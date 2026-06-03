import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ArrowLeft, 
  Award, 
  BookOpen, 
  CheckCircle, 
  UserCheck, 
  Sparkles,
  RefreshCw,
  Home,
  Book,
  Coffee,
  X,
  Volume2,
  VolumeX
} from 'lucide-react';
import api from '../services/api';
import translations from '../translations';
import TransparentAvatar from '../components/TransparentAvatar';
import { useCustomModal } from '../context/ModalContext';

// Typewriter Text Effect Component
const Typewriter = ({ text = '', speed = 12 }) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    if (!text) {
      setDisplayed('');
      return;
    }
    setDisplayed('');
    let i = 0;
    const timer = setInterval(() => {
      setDisplayed((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return <span>{displayed}</span>;
};

const ClassroomSimulator = () => {
  const navigate = useNavigate();
  const { showAlert } = useCustomModal();
  const lang = localStorage.getItem('appLang') || 'EN';
  const t = translations[lang] || translations.EN;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [scenario, setScenario] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState([]); // indices selected e.g. [1, 0, 2]
  const [currentChoice, setCurrentChoice] = useState(null); // choice index selected for current step
  
  // Interactive Visual Novel States
  const [isReacting, setIsReacting] = useState(false); // intermediate reaction review phase
  const [reactionText, setReactionText] = useState(''); 
  const [chosenPoints, setChosenPoints] = useState(0);
  const [chosenText, setChosenText] = useState('');

  // Audio / Speech Engine States
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('simMuted') === 'true';
  });
  const [voices, setVoices] = useState([]);
  const activeUtteranceRef = useRef(null);
  const isFirstRenderRef = useRef(true);

  // Desk Mini-App States
  const [showHandbook, setShowHandbook] = useState(false);
  const [coffeeToast, setCoffeeToast] = useState('');
  const [showCoffeeToast, setShowCoffeeToast] = useState(false);

  const [result, setResult] = useState(null); // report card payload
  const [xp, setXp] = useState(0); // user rank points for career title

  // Handle async voice loading and keep fresh list
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        console.log('ClassroomSimulator: Loaded voices count =', availableVoices.length);
      };
      updateVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
    }
  }, []);

  // Cancel speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    fetchScenario();
    fetchUserXp();
  }, []);

  // Single-Utterance Speech Narration (Highly stable local-first voice matching)
  const speakText = (text, usePreferredVoice = true) => {
    if (!text || text.trim() === '') return;
    if (!('speechSynthesis' in window) || isMuted) {
      return;
    }

    const synth = window.speechSynthesis;
    
    try {
      if (synth.paused) {
        synth.resume();
      }
      synth.cancel(); // Clear any running speech
    } catch (e) {
      console.warn('Speech cancel error:', e);
    }

    const utterance = new SpeechSynthesisUtterance(text);
    activeUtteranceRef.current = utterance; // Retain reference to prevent Garbage Collection in Chrome
    
    const availableVoices = voices.length > 0 ? voices : synth.getVoices();
    let voice = null;

    if (usePreferredVoice && availableVoices.length > 0) {
      if (lang === 'HI') {
        // Find Hindi voice, prefer local services (no network dependencies)
        voice = availableVoices.find(v => (v.lang.includes('hi') || v.lang.includes('HI')) && v.localService === true);
        if (!voice) {
          voice = availableVoices.find(v => v.lang.includes('hi') || v.lang.includes('HI'));
        }
        
        if (voice) {
          utterance.voice = voice;
          utterance.lang = voice.lang; // Sync exact locale
        } else {
          utterance.lang = 'hi-IN';
        }
      } else {
        // English, prefer local services
        voice = availableVoices.find(v => (v.lang.includes('en') || v.lang.includes('EN')) && v.localService === true);
        if (!voice) {
          voice = availableVoices.find(v => v.lang.includes('en') || v.lang.includes('EN'));
        }
        
        if (voice) {
          utterance.voice = voice;
          utterance.lang = voice.lang; // Sync exact locale
        } else {
          utterance.lang = 'en-US';
        }
      }
    } else {
      // Fallback mode: do not assign custom voice object, let browser use native local fallback voice
      utterance.lang = lang === 'HI' ? 'hi-IN' : 'en-US';
    }

    // Standard clear speech parameters (pitch and rate)
    utterance.rate = lang === 'HI' ? 0.85 : 0.9;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsPlayingSpeech(true);
    };

    utterance.onend = () => {
      setIsPlayingSpeech(false);
      if (activeUtteranceRef.current === utterance) {
        activeUtteranceRef.current = null;
      }
    };

    utterance.onerror = (e) => {
      // If preferred voice failed (e.g. online Google voice failed due to Chrome message port closed), retry offline local voice
      if (e.error === 'synthesis-failed' && usePreferredVoice && utterance.voice) {
        console.warn('SpeechSynthesis preferred voice failed, retrying with system default local voice...');
        setIsPlayingSpeech(false);
        if (activeUtteranceRef.current === utterance) {
          activeUtteranceRef.current = null;
        }
        setTimeout(() => {
          speakText(text, false);
        }, 50);
        return;
      }

      // Ignore normal 'interrupted' events
      if (e.error !== 'interrupted') {
        console.warn('Speech error event:', e.error);
      }
      setIsPlayingSpeech(false);
      if (activeUtteranceRef.current === utterance) {
        activeUtteranceRef.current = null;
      }
    };

    // Small delay to allow Chrome to release buffers
    setTimeout(() => {
      try {
        synth.speak(utterance);
      } catch (err) {
        console.error('Speech speak execution failed:', err);
        setIsPlayingSpeech(false);
        activeUtteranceRef.current = null;
      }
    }, 50);
  };

  const triggerCurrentStateSpeech = () => {
    if (isReacting) {
      const text = chosenText + (reactionText ? (lang === 'HI' ? '। छात्र की प्रतिक्रिया: ' : '. Student reaction: ') + reactionText : '');
      speakText(text);
    } else if (currentStep) {
      const { narrative: stepNarrative, speech: stepSpeech } = parseDialogue(
        lang === 'HI' ? currentStep.description_hi : currentStep.description_en
      );
      const text = stepNarrative + (stepSpeech ? (lang === 'HI' ? '। छात्र कहता है: ' : '. The student says: ') + stepSpeech : '');
      speakText(text);
    }
  };

  const handlePlayAudioButton = async () => {
    if (!('speechSynthesis' in window)) {
      await showAlert("Text-to-speech is not supported in this browser.", "Not Supported");
      return;
    }

    if (isPlayingSpeech) {
      // If playing, stop it
      window.speechSynthesis.cancel();
      setIsPlayingSpeech(false);
    } else {
      // If stopped, play it
      if (isMuted) {
        setIsMuted(false);
        localStorage.setItem('simMuted', 'false');
      }
      triggerCurrentStateSpeech();
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    localStorage.setItem('simMuted', String(nextMuted));
    if (nextMuted) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingSpeech(false);
    } else {
      // Re-trigger current state text speech after short timeout
      setTimeout(() => {
        triggerCurrentStateSpeech();
      }, 100);
    }
  };

  const fetchScenario = async () => {
    setLoading(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingSpeech(false);
    try {
      const res = await api.get('/api/scenarios/random');
      // Defensive check for SPA HTML fallback
      if (!res.data || typeof res.data === 'string' || !res.data.steps) {
        setScenario(null);
      } else {
        setScenario(res.data);
      }
      setCurrentStepIndex(0);
      setSelectedChoices([]);
      setCurrentChoice(null);
      setReactionText('');
      setResult(null);
      setIsReacting(false);
    } catch (err) {
      console.error('Error fetching scenario:', err);
      setScenario(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserXp = async () => {
    try {
      const res = await api.get('/api/profile');
      setXp(res.data.rank_points || 0);
    } catch (err) {
      console.error(err);
    }
  };

  const steps = scenario?.steps || [];
  const currentStep = steps[currentStepIndex];

  // Separate narrative block from dialogue inside quotes
  const parseDialogue = (text) => {
    if (!text) return { narrative: '', speech: '' };
    const quoteIndex = text.indexOf('"');
    if (quoteIndex !== -1) {
      const endQuoteIndex = text.indexOf('"', quoteIndex + 1);
      if (endQuoteIndex !== -1) {
        const narrative = text.substring(0, quoteIndex).trim() + " " + text.substring(endQuoteIndex + 1).trim();
        const speech = text.substring(quoteIndex + 1, endQuoteIndex).trim();
        return { narrative: narrative.trim(), speech };
      }
    }
    return { narrative: text, speech: '' };
  };

  const { narrative, speech } = parseDialogue(
    lang === 'HI' ? currentStep?.description_hi : currentStep?.description_en
  );

  // Trigger speech on initial mount/scenario fetch (Dependencies length: 3)
  useEffect(() => {
    if (!loading && scenario && currentStep && !isReacting && !result) {
      if (isFirstRenderRef.current) {
        // Skip automatic speech on the very first mount of simulator to prevent autoplay block sticking the queue
        isFirstRenderRef.current = false;
      } else {
        triggerCurrentStateSpeech();
      }
    }
  }, [currentStepIndex, scenario, loading]);

  const handleCommitChoice = () => {
    if (currentChoice === null) return;

    const chosenChoiceDetail = currentStep?.choices?.find(c => c.choice_index === currentChoice);
    if (chosenChoiceDetail) {
      const rText = lang === 'HI' 
        ? chosenChoiceDetail.reaction_modifier_hi 
        : chosenChoiceDetail.reaction_modifier_en;
      
      const cText = lang === 'HI'
        ? chosenChoiceDetail.text_hi
        : chosenChoiceDetail.text_en;

      setReactionText(rText || '');
      setChosenPoints(chosenChoiceDetail.points || 0);
      setChosenText(cText || '');
      setIsReacting(true);

      // Play decision + reaction sequence
      const speechCombined = cText + (rText ? (lang === 'HI' ? '। छात्र की प्रतिक्रिया: ' : '. Student reaction: ') + rText : '');
      speakText(speechCombined);
    }
  };

  const handleNextStep = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingSpeech(false);
    
    const updatedChoices = [...selectedChoices, currentChoice];
    setSelectedChoices(updatedChoices);
    setIsReacting(false);
    
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setCurrentChoice(null);
      setReactionText('');
      // Note: We do not trigger speakText manually here. The useEffect hook triggered by
      // currentStepIndex state update will automatically trigger triggerCurrentStateSpeech
      // in the standard gameplay loop without double-invocation race conditions.
    } else {
      submitScenario(updatedChoices);
    }
  };

  const submitScenario = async (choices) => {
    setSubmitting(true);
    try {
      const res = await api.post(`/api/scenarios/submit/${scenario.scenario_id}`, {
        selected_choices: choices
      });
      setResult(res.data);
      if (res.data.user_stats) {
        setXp(res.data.user_stats.rank_points || 0);
      }
    } catch (err) {
      console.error(err);
      await showAlert('Failed to submit choices. Please try again.', 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  const getCareerTitle = (points) => {
    if (points < 500) return { title: t.internTeacher || 'Student Intern', icon: '🎓', max: 500, min: 0 };
    if (points < 1500) return { title: t.assistantTeacher || 'Assistant Teacher', icon: '🏫', max: 1500, min: 500 };
    if (points < 3000) return { title: t.seniorTeacher || 'Senior Educator', icon: '🍎', max: 3000, min: 1500 };
    return { title: t.principalTeacher || 'Principal Educator', icon: '👑', max: 10000, min: 3000 };
  };

  const career = getCareerTitle(xp);
  const xpProgress = ((xp - career.min) / (career.max - career.min)) * 100;

  const getReactionEmoji = (pts) => {
    if (pts === 10) return '💡';
    if (pts >= 6) return '👍';
    if (pts >= 4) return '😐';
    return '😢';
  };

  // Coffee Desk Minigame
  const drinkCoffee = () => {
    const quotes = lang === 'HI' ? [
      '"शिक्षा का उद्देश्य तथ्यों को सिखाना नहीं, बल्कि दिमाग को सोचने का प्रशिक्षण देना है।" - अल्बर्ट आइंस्टीन',
      '"एक अच्छा शिक्षक आशा को प्रेरित कर सकता है, कल्पना को प्रज्वलित कर सकता है।" - ब्रैड हेनरी',
      '"बच्चे खाली बर्तन नहीं हैं जिन्हें भरा जाना है, बल्कि दीपक हैं जिन्हें जलाया जाना है।" - प्लूटार्क',
      '"पढ़ाने का मतलब दूसरों को सीखने के लिए प्रेरित करना है।"'
    ] : [
      '"Education is not the learning of facts, but the training of the mind to think." - Albert Einstein',
      '"A good teacher can inspire hope, ignite the imagination, and instill a love of learning." - Brad Henry',
      '"Children are not vessels to be filled, but lamps to be lit." - Plutarch',
      '"To teach is to touch a life forever."'
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCoffeeToast(randomQuote);
    setShowCoffeeToast(true);
    setTimeout(() => setShowCoffeeToast(false), 4500);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-5 max-w-md mx-auto w-full">
      <div className="loader"></div>
      <p className="text-slate-500 font-bold animate-pulse">{t.loadingSimulator || "Preparing classroom scenario..."}</p>
    </div>
  );

  if (!scenario) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-5 max-w-md mx-auto w-full text-center">
      <div className="text-4xl">⚠️</div>
      <h3 className="text-xl font-black text-[var(--text-primary)]">No Scenario Available</h3>
      <button 
        onClick={() => {
          if ('speechSynthesis' in window) window.speechSynthesis.cancel();
          navigate('/dashboard');
        }}
        className="px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-slate-400 font-bold text-sm"
      >
        {t.returnDash}
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 px-5 pt-6 pb-32 max-w-md mx-auto w-full animate-fade-in relative overflow-x-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-1">
        <button 
          onClick={() => {
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            navigate('/dashboard');
          }}
          className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
        >
          <ArrowLeft size={10} /> {t.returnDash}
        </button>
        <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
          {t.classroomSimulator}
        </span>
      </div>

      {/* Main Container */}
      <AnimatePresence mode="wait">
        {!result ? (
          // PLAYING STEP STATE
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            {/* Step Indicators & Audio Speaker Mute Toggle */}
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <span>{lang === 'HI' ? `चरण ${currentStepIndex + 1} / ${steps.length}` : `Step ${currentStepIndex + 1} of ${steps.length}`}</span>
                <button 
                  onClick={toggleMute} 
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                    isMuted 
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  }`}
                  title={isMuted ? "Unmute Sound" : "Mute Sound"}
                >
                  {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                </button>
              </span>
              <div className="flex gap-1.5">
                {steps.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      idx === currentStepIndex 
                        ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)] scale-110' 
                        : idx < currentStepIndex ? 'bg-emerald-500' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Visual Novel Blackboard */}
            <div className="bg-[#1b4332] border-[10px] border-[#5c3d2e] rounded-3xl p-4 shadow-2xl relative min-h-[260px] flex flex-col justify-between overflow-hidden select-none">
              {/* Wood texture overlay */}
              <div className="absolute inset-0 bg-black/15 pointer-events-none" />
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_70%)] pointer-events-none" />
              
              {/* Play/Stop Audio Button on blackboard top-right */}
              <button 
                onClick={handlePlayAudioButton}
                className={`absolute right-4 top-4 z-30 p-2 rounded-xl border backdrop-blur-md transition-all cursor-pointer shadow-lg flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider ${
                  isPlayingSpeech 
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 hover:bg-rose-500/30' 
                    : 'bg-white/10 border-white/20 text-emerald-400 hover:bg-white/20'
                }`}
                title={isPlayingSpeech ? "Stop Audio" : "Listen Audio"}
              >
                {isPlayingSpeech ? (
                  <>
                    <VolumeX size={14} />
                    <span>{lang === 'HI' ? 'रोकें' : 'Stop'}</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={14} />
                    <span>{lang === 'HI' ? 'सुनें' : 'Listen'}</span>
                  </>
                )}
              </button>

              {/* 3D Character Avatars */}
              <motion.div 
                animate={isReacting ? { filter: 'brightness(0.6)' } : { filter: 'brightness(1)' }}
                className="absolute left-1 bottom-0 w-22 h-30 pointer-events-none z-10 opacity-95 transition-all"
              >
                <TransparentAvatar 
                  src="/teacher_sprite.png" 
                  alt="Teacher" 
                  className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] transform -scale-x-100"
                />
              </motion.div>

              <motion.div 
                animate={
                  isReacting 
                    ? chosenPoints === 10
                      ? { y: [0, -12, 0], scale: 1.1 }
                      : chosenPoints < 5
                        ? { x: [-4, 4, -4, 4, 0], scale: 0.95 }
                        : { scale: 1.05 }
                    : { scale: 1, y: 0, x: 0 }
                }
                transition={{ duration: 0.5 }}
                className="absolute right-1 bottom-0 w-22 h-26 pointer-events-none z-10 opacity-95 transition-all"
              >
                <TransparentAvatar 
                  src="/student_sprite.png" 
                  alt="Student" 
                  className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
                />
              </motion.div>

              {/* Floating Emojis Reaction */}
              <AnimatePresence>
                {isReacting && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.5 }}
                    animate={{ opacity: 1, y: -45, scale: 1.3 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute right-8 top-16 text-3xl z-30 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                  >
                    {getReactionEmoji(chosenPoints)}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dialogues Overlay Area */}
              <div className="w-full h-full flex flex-col justify-start pb-20 relative z-20 space-y-3">
                {!isReacting ? (
                  // PROBLEM/NARRATIVE SCENE
                  <div className="space-y-3 px-1 mt-1">
                    {narrative && (
                      <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider bg-black/30 rounded px-2.5 py-1 w-max">
                        {lang === 'HI' ? 'कक्षा दृश्य' : 'Classroom Scene'}
                      </div>
                    )}
                    
                    {/* Narrative Intro */}
                    {narrative && (
                      <p className="text-[11px] text-emerald-100 font-medium leading-relaxed leading-normal text-pretty max-w-[85%] mx-auto text-center border-b border-emerald-800/40 pb-2">
                        <Typewriter text={narrative} speed={10} />
                      </p>
                    )}

                    {/* Student Dialogue Speech Bubble */}
                    {speech ? (
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="sim-bubble student-bubble bg-white border-2 border-slate-300 text-slate-800 rounded-2xl px-3.5 py-2.5 relative shadow-xl text-xs font-bold leading-normal text-pretty max-w-[80%] self-end float-right mr-16 mt-1"
                      >
                        <p className="text-[11px] font-bold text-slate-900 leading-normal">
                          <Typewriter text={speech} speed={15} />
                        </p>
                        {/* Bubble pointer */}
                        <div className="absolute right-4 bottom-[-8px] w-0 h-0 border-t-8 border-t-white border-x-8 border-x-transparent bubble-pointer" />
                      </motion.div>
                    ) : (
                      // If no dialogue, show narrative as main text
                      !narrative && (
                        <p className="text-xs text-white/90 font-medium leading-relaxed text-center py-4 px-4 leading-normal">
                          <Typewriter text={lang === 'HI' ? currentStep?.description_hi : currentStep?.description_en} speed={15} />
                        </p>
                      )
                    )}
                  </div>
                ) : (
                  // CHOICE RESOLUTION SCENE (Interactive Dialogue)
                  <div className="space-y-4 px-1 mt-1 flex flex-col w-full">
                    {/* Teacher Speech Bubble (Choice Selected) */}
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0, x: -10 }}
                      animate={{ scale: 1, opacity: 1, x: 0 }}
                      className="sim-bubble teacher-bubble bg-purple-600 border border-purple-500 text-white rounded-2xl px-3.5 py-2.5 relative shadow-xl text-[11px] font-bold leading-normal text-pretty max-w-[78%] ml-16 self-start float-left"
                    >
                      <span className="text-[8px] font-black text-purple-200 uppercase tracking-widest block mb-1">
                        {lang === 'HI' ? 'आपका उत्तर' : 'Your Response'}
                      </span>
                      "{chosenText}"
                      <div className="absolute left-4 bottom-[-8px] w-0 h-0 border-t-8 border-t-purple-600 border-x-8 border-x-transparent bubble-pointer" />
                    </motion.div>

                    {/* Student Reaction Bubble */}
                    {reactionText && (
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0, x: 10 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="sim-bubble student-bubble bg-white border-2 border-slate-300 text-slate-800 rounded-2xl px-3.5 py-2.5 relative shadow-xl text-[11px] font-bold leading-normal text-pretty max-w-[78%] mr-16 self-end float-right mt-1"
                      >
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                          {lang === 'HI' ? 'छात्र की प्रतिक्रिया' : 'Student Reaction'}
                        </span>
                        <Typewriter text={reactionText} speed={15} />
                        <div className="absolute right-4 bottom-[-8px] w-0 h-0 border-t-8 border-t-white border-x-8 border-x-transparent bubble-pointer" />
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {/* Blackboard bottom tray */}
              <div className="h-2 w-full bg-white/20 rounded-full mt-auto relative z-20 flex justify-center items-center">
                <div className="w-10 h-1.5 bg-yellow-100/35 rounded-full" />
              </div>
            </div>

            {/* Interactive Decision Options */}
            <AnimatePresence mode="wait">
              {!isReacting ? (
                <motion.div 
                  key="choices"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="flex flex-col gap-3"
                >
                  {(currentStep?.choices || []).map((choice) => {
                    const isSelected = currentChoice === choice.choice_index;
                    return (
                      <motion.div
                        key={choice.choice_index}
                        whileHover={{ scale: 1.015, rotateY: 1.5, rotateX: -0.5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCurrentChoice(choice.choice_index)}
                        className={`group relative overflow-hidden glass-card !p-4 cursor-pointer transition-all border-2 flex items-center gap-4 ${
                          isSelected 
                            ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.15)]' 
                            : 'border-white/5 hover:border-white/20 hover:bg-white/5'
                        }`}
                        style={{ minHeight: '70px', perspective: '1000px' }}
                      >
                        <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                          isSelected ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'bg-white/5 text-slate-500 group-hover:text-slate-300'
                        }`}>
                          {String.fromCharCode(65 + choice.choice_index)}
                        </div>

                        <span className={`text-xs font-semibold leading-relaxed leading-normal text-pretty ${isSelected ? 'text-purple-400 font-black' : 'text-[var(--text-primary)]'}`}>
                          {lang === 'HI' ? choice.text_hi : choice.text_en}
                        </span>

                        {isSelected && (
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent pointer-events-none" />
                        )}
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                // Locked display of chosen response
                <motion.div 
                  key="feedback"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card !p-5 text-center bg-purple-950/20 border-purple-500/30 flex flex-col items-center gap-3 relative overflow-hidden"
                >
                  <div className="h-10 w-10 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-lg animate-pulse">
                    🏆
                  </div>
                  <h4 className="text-xs font-black text-purple-400 uppercase tracking-widest">
                    {lang === 'HI' ? 'निर्णय दर्ज किया गया' : 'Decision Committed'}
                  </h4>
                  <p className="text-xs text-slate-300 font-semibold max-w-[280px] leading-relaxed">
                    {lang === 'HI' 
                      ? 'छात्र ने आपकी प्रतिक्रिया के प्रति प्रतिक्रिया दी है। परिणाम देखने के लिए नीचे क्लिक करें।' 
                      : 'The student has reacted to your intervention. Click below to proceed.'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step Controls */}
            <div className="pt-2">
              {!isReacting ? (
                <button
                  disabled={currentChoice === null}
                  onClick={handleCommitChoice}
                  className="w-full h-14 rounded-2xl premium-button font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{lang === 'HI' ? 'निर्णय लें' : 'Commit Decision'}</span>
                  <CheckCircle size={16} />
                </button>
              ) : (
                <button
                  onClick={handleNextStep}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  <span>
                    {currentStepIndex === steps.length - 1 
                      ? (t.completeScenario || 'Complete Scenario') 
                      : (t.nextStep || 'Proceed to Next Step')}
                  </span>
                  <ChevronRight size={16} />
                </button>
              )}
            </div>

            {/* Teacher's Desk Interface */}
            <div className="relative">
              {/* Coffee Toast Overlay */}
              <AnimatePresence>
                {showCoffeeToast && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: -45, scale: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute inset-x-0 mx-auto glass-card border-purple-500/20 !p-3 shadow-2xl bg-slate-900/90 text-center text-[10px] font-semibold text-purple-300 leading-normal"
                    style={{ zIndex: 50 }}
                  >
                    ☕ {coffeeToast}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="glass-card !p-4 bg-slate-900/60 border-white/5 flex items-center justify-around text-center shadow-lg">
                <div 
                  onClick={() => setShowHandbook(true)}
                  className="flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <span className="text-2xl group-hover:scale-115 transition-transform duration-300">📘</span>
                  <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider group-hover:text-purple-400 transition-colors">
                    {lang === 'HI' ? 'सिद्धांत मार्गदर्शिका' : 'Theory Guide'}
                  </span>
                </div>
                <div 
                  onClick={drinkCoffee}
                  className="flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <span className="text-2xl group-hover:scale-115 group-hover:rotate-12 transition-transform duration-300">☕</span>
                  <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider group-hover:text-amber-400 transition-colors">
                    {lang === 'HI' ? 'कॉफी ब्रेक' : 'Coffee Break'}
                  </span>
                </div>
                <div 
                  onClick={fetchScenario}
                  className="flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <span className="text-2xl group-hover:scale-115 group-hover:rotate-90 transition-transform duration-300">🧽</span>
                  <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider group-hover:text-rose-400 transition-colors">
                    {lang === 'HI' ? 'रीसेट कहानी' : 'Reset Story'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          // EVALUATION REPORT CARD STATE
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Principal's Evaluation Certificate */}
            <div className={`glass-card relative overflow-hidden border-2 !p-6 text-center space-y-4 shadow-2xl ${
              result.license === 'gold' 
                ? 'border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-transparent shadow-amber-500/10' 
                : result.license === 'silver'
                  ? 'border-sky-500/30 bg-gradient-to-b from-sky-500/10 to-transparent shadow-sky-500/10'
                  : 'border-slate-500/30 bg-gradient-to-b from-slate-500/10 to-transparent'
            }`}>
              {result.license === 'gold' && (
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-[radial-gradient(circle,rgba(245,158,11,0.15)_0%,transparent_70%)] animate-pulse pointer-events-none" />
              )}
              
              <div className="flex justify-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className={`relative h-20 w-20 rounded-full flex items-center justify-center border-2 ${
                    result.license === 'gold' 
                      ? 'border-amber-400/40 bg-amber-400/10 text-amber-400' 
                      : result.license === 'silver'
                        ? 'border-sky-400/40 bg-sky-400/10 text-sky-400'
                        : 'border-slate-400/40 bg-slate-400/10 text-slate-400'
                  }`}
                >
                  <Award size={44} className="drop-shadow-lg" />
                </motion.div>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500">
                  {t.teachingLicense || "Teaching License"}
                </span>
                <h3 className={`text-xl font-black ${
                  result.license === 'gold' 
                    ? 'text-amber-400 chalk-yellow' 
                    : result.license === 'silver'
                      ? 'text-sky-400 chalk-blue'
                      : 'text-slate-400'
                }`}>
                  {result.license === 'gold' 
                    ? (t.goldLicense || "Gold License") 
                    : result.license === 'silver'
                      ? (t.silverLicense || "Silver License")
                      : (t.bronzeLicense || "Bronze License")}
                </h3>
              </div>

              <div className="text-4xl font-black text-gradient py-2">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {result.score}
                </motion.span> / 30
              </div>
              
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {t.scoreEarned || "Score Earned"}
              </p>
            </div>

            {/* Career Progress Title */}
            <div className="glass-card !p-5 space-y-3 bg-slate-950/40 border-white/5">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                    {t.careerTitle || "Career Title"}
                  </span>
                  <h4 className="text-sm font-black text-[var(--text-primary)] flex items-center gap-1.5">
                    <span>{career.icon}</span> {career.title}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-purple-400">{xp} XP</span>
                </div>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                />
              </div>
              <p className="text-[8px] text-slate-500 font-medium italic">
                {career.max < 10000 
                  ? `Earn ${career.max - xp} more XP to reach the next teaching level!` 
                  : "Maximum teaching career level achieved! 🏆"}
              </p>
            </div>

            {/* Step-by-Step Principal Diagnostic Feedback */}
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
              {t.feedbackTitle || "AI Principal Feedback"}
            </h4>
            <div className="flex flex-col gap-3">
              {result.evaluations.map((evalItem) => (
                <div 
                  key={evalItem.step_number}
                  className="glass-card !p-4 space-y-3 bg-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      {evalItem.theory_tag || 'Pedagogy'}
                    </span>
                    <span className={`text-[10px] font-black ${evalItem.points >= 8 ? 'text-emerald-400' : 'text-amber-500'}`}>
                      +{evalItem.points} pts
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      {lang === 'HI' ? `चरण ${evalItem.step_number} निर्णय` : `Step ${evalItem.step_number} Decision`}
                    </div>
                    <p className="text-xs font-semibold text-[var(--text-primary)] leading-normal">
                      "{lang === 'HI' ? evalItem.choice_text_hi : evalItem.choice_text_en}"
                    </p>
                  </div>

                  {evalItem.explanation_en && (
                    <p className="text-[10px] text-slate-400 leading-normal leading-relaxed leading-normal text-pretty pt-2 border-t border-white/5">
                      {lang === 'HI' ? evalItem.explanation_hi : evalItem.explanation_en}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Evaluation Actions */}
            <div className="flex flex-col gap-3 pt-4">
              <button
                onClick={fetchScenario}
                className="w-full h-14 rounded-2xl premium-button font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-purple-500/20 active:scale-95"
              >
                <RefreshCw size={16} /> {t.nextStep === 'Proceed to Next Step' ? 'Next Scenario' : 'अगला परिदृश्य'}
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full h-14 rounded-2xl bg-white/5 border border-white/5 text-[var(--text-secondary)] font-black text-sm flex items-center justify-center gap-2 hover:bg-white/10 active:scale-95 transition-all"
              >
                <Home size={16} /> {t.returnDash}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theory Guidebook Modal */}
      <AnimatePresence>
        {showHandbook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="sim-handbook-modal bg-[#0b1329] border border-white/10 rounded-3xl w-full max-w-sm max-h-[80vh] overflow-y-auto p-5 relative space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <span>📘</span> {lang === 'HI' ? 'बाल विकास सिद्धांत' : 'Child Psychology Theories'}
                </h3>
                <button 
                  onClick={() => setShowHandbook(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 pr-1 text-xs">
                {/* Vygotsky */}
                <div className="space-y-1">
                  <h4 className="font-black text-purple-400">1. Lev Vygotsky: Social Scaffolding</h4>
                  <p className="text-slate-300 leading-relaxed font-semibold">
                    {lang === 'HI' 
                      ? 'समीपस्थ विकास का क्षेत्र (ZPD): वह दूरी जो एक बच्चा स्वतंत्र रूप से कर सकता है और जो वे मार्गदर्शन के साथ कर सकते हैं। वयस्कों या सहकर्मियों द्वारा सामाजिक मचान (Scaffolding) देना अधिगम को गति देता है।'
                      : 'Zone of Proximal Development (ZPD): The gap between what a child can do alone and with guidance. Structured social help (scaffolding) by teachers or peers accelerates cognitive growth.'}
                  </p>
                </div>

                {/* Jean Piaget */}
                <div className="space-y-1">
                  <h4 className="font-black text-amber-400">2. Jean Piaget: Cognitive Development</h4>
                  <p className="text-slate-300 leading-relaxed font-semibold">
                    {lang === 'HI'
                      ? 'बच्चे पर्यावरण के साथ सक्रिय रूप से जुड़कर अपने ज्ञान का निर्माण करते हैं (सक्रिय शिक्षार्थी)। अमूर्त सूत्रों से पहले मूर्त वस्तुओं और गतिविधियों (जैसे गिनती के ब्लॉक) का अनुभव होना आवश्यक है।'
                      : 'Children construct knowledge by active exploration (little scientists). Early learning requires concrete physical manipulatives (like math blocks) before moving to abstract concepts.'}
                  </p>
                </div>

                {/* Albert Bandura */}
                <div className="space-y-1">
                  <h4 className="font-black text-sky-400">3. Albert Bandura: Self-Efficacy</h4>
                  <p className="text-slate-300 leading-relaxed font-semibold">
                    {lang === 'HI'
                      ? 'शिक्षकों द्वारा सकारात्मक रोल-मॉडलिंग और सुरक्षित, तनाव-मुक्त वातावरण प्रदान करना बच्चे के आत्मविश्वास (स्व-प्रभावकारिता) का निर्माण करता है, जिससे वे चुनौतियों को सफलतापूर्वक संभालते हैं।'
                      : 'Self-Efficacy is a child\'s belief in their ability to succeed. Private encouragement, mastery experiences, and supportive modeling build confidence and lower academic anxiety.'}
                  </p>
                </div>

                {/* Howard Gardner */}
                <div className="space-y-1">
                  <h4 className="font-black text-emerald-400">4. Howard Gardner: Multiple Intelligences</h4>
                  <p className="text-slate-300 leading-relaxed font-semibold">
                    {lang === 'HI'
                      ? 'प्रत्येक बच्चे की सीखने की शैली अलग होती है। गतिज शिक्षण (Kinesthetic learning) अशांत या ऊर्जावान छात्रों की शारीरिक ऊर्जा को अधिगम में बदलने का सबसे प्रभावी माध्यम है।'
                      : 'Children possess diverse intelligences. Bodily-kinesthetic learners need physical movement, roleplays, or hands-on tasks to absorb concepts without feeling restricted.'}
                  </p>
                </div>

                {/* Urie Bronfenbrenner */}
                <div className="space-y-1">
                  <h4 className="font-black text-rose-400">5. Urie Bronfenbrenner: Ecological Systems</h4>
                  <p className="text-slate-300 leading-relaxed font-semibold">
                    {lang === 'HI'
                      ? 'विकास घर, स्कूल और समाज के आपसी तालमेल से होता है। नियमित होम-स्कूल दैनिक रिपोर्ट कार्ड और अभिभावक-शिक्षक संवाद कबीर जैसे अशांत बच्चों के लिए एक सुसंगत ढांचा तैयार करता है।'
                      : 'A child\'s growth is shaped by nested environments. Co-designing a Home-School report card aligns the home and school microsystems, forming a consistent structure for behavioral development.'}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setShowHandbook(false)}
                className="w-full h-11 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                {lang === 'HI' ? 'बंद करें' : 'Close Guide'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClassroomSimulator;
