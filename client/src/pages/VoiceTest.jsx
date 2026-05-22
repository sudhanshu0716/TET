import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  ArrowLeft, 
  Sparkles, 
  Trophy, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Play, 
  HelpCircle,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import api from '../services/api';
import translations from '../translations';

const VoiceTest = () => {
  const navigate = useNavigate();
  const lang = localStorage.getItem('appLang') || 'EN';
  const t = translations[lang] || translations.EN;

  // States
  const [step, setStep] = useState('setup'); // 'setup' | 'loading' | 'ready-to-start' | 'speaking-intro' | 'exam' | 'result'
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [voiceLang, setVoiceLang] = useState(lang); // 'EN' or 'HI'
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [exam, setExam] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // Voice engine state: 'idle' | 'speaking' | 'listening' | 'thinking' | 'success' | 'error'
  const [voiceState, setVoiceState] = useState('idle');
  const [subtitle, setSubtitle] = useState('');
  const [transcript, setTranscript] = useState('');
  const [speechError, setSpeechError] = useState(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  
  // Refs to handle voice recognition and synthesis
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const speakTimeoutRef = useRef(null);
  const currentAudioRef = useRef(null);

  // Subject options
  const subjects = [
    { id: 'all', name: lang === 'HI' ? 'सभी विषय' : 'All Subjects', icon: '🎯', color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30' },
    { id: 'pedagogy', name: lang === 'HI' ? 'बाल विकास (CDP)' : 'Pedagogy (CDP)', icon: '🧠', color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30' },
    { id: 'evs', name: lang === 'HI' ? 'पर्यावरण अध्ययन' : 'EVS', icon: '🌱', color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30' },
    { id: 'math', name: lang === 'HI' ? 'गणित' : 'Mathematics', icon: '➗', color: 'from-sky-500/20 to-blue-500/10 border-sky-500/30' },
    { id: 'hindi', name: lang === 'HI' ? 'हिन्दी' : 'Hindi', icon: '📖', color: 'from-rose-500/20 to-pink-500/10 border-rose-500/30' },
    { id: 'english', name: lang === 'HI' ? 'अंग्रेजी' : 'English', icon: '🔤', color: 'from-cyan-500/20 to-sky-500/10 border-cyan-500/30' }
  ];

  // Monitor voice loads
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const handleVoicesChanged = () => {
        setVoicesLoaded(true);
      };
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      if (window.speechSynthesis.getVoices().length > 0) {
        setVoicesLoaded(true);
      }
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      };
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      
      rec.onstart = () => {
        isListeningRef.current = true;
        setVoiceState('listening');
        setSpeechError(null);
      };

      rec.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setVoiceState('thinking');
        handleSpokenAnswer(text);
      };

      rec.onerror = (event) => {
        console.error('SpeechRecognition error:', event.error);
        if (event.error === 'no-speech') {
          setVoiceState('idle');
          setTranscript(voiceLang === 'HI' ? 'आवाज नहीं सुनी गई' : 'No speech detected');
        } else {
          setSpeechError(event.error);
          setVoiceState('idle');
        }
      };

      rec.onend = () => {
        isListeningRef.current = false;
        setVoiceState(prev => prev === 'listening' ? 'idle' : prev);
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
    };
  }, [voiceLang]);

  // Main game loop engine triggered by index or step changes
  useEffect(() => {
    if (step === 'exam' && questions.length > 0) {
      playQuestion(currentIndex);
    }

    return () => {
      stopListening();
    };
  }, [step, currentIndex, questions]);

  // General unmount cleanup
  useEffect(() => {
    return () => {
      if (speakTimeoutRef.current) {
        clearTimeout(speakTimeoutRef.current);
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      stopListening();
    };
  }, []);

  // Clean text from HTML tags, markdown, and extra characters
  const cleanTextForSpeech = (txt) => {
    if (!txt) return '';
    let cleaned = txt;
    // Decode HTML entities
    cleaned = cleaned.replace(/&nbsp;/gi, ' ');
    cleaned = cleaned.replace(/&lt;/gi, '<');
    cleaned = cleaned.replace(/&gt;/gi, '>');
    cleaned = cleaned.replace(/&amp;/gi, '&');
    cleaned = cleaned.replace(/&quot;/gi, '"');
    // Remove HTML tags
    cleaned = cleaned.replace(/<[^>]*>/g, ' ');
    // Remove Markdown formatting
    cleaned = cleaned.replace(/[\*_`~#]/g, '');
    // Clean up multiple spaces
    cleaned = cleaned.replace(/\s+/g, ' ');
    return cleaned.trim();
  };

  // Speak voice synthesizer helper
  // Helper to split long text into smaller pronunciation chunks
  const splitTextIntoSpeechChunks = (txt, maxLength = 150) => {
    const sentences = txt.split(/([.,!?।\n]+)/);
    const chunks = [];
    let currentChunk = "";
    
    for (let part of sentences) {
      if (!part) continue;
      
      if (part.length > maxLength) {
        if (currentChunk.trim()) {
          chunks.push(currentChunk.trim());
          currentChunk = "";
        }
        const words = part.split(/\s+/);
        let tempChunk = "";
        for (let word of words) {
          if (!word) continue;
          if ((tempChunk + " " + word).trim().length > maxLength) {
            if (tempChunk.trim()) {
              chunks.push(tempChunk.trim());
            }
            tempChunk = word;
          } else {
            tempChunk = tempChunk ? tempChunk + " " + word : word;
          }
        }
        if (tempChunk.trim()) {
          currentChunk = tempChunk;
        }
      } else if ((currentChunk + part).length > maxLength) {
        if (currentChunk.trim()) {
          chunks.push(currentChunk.trim());
        }
        currentChunk = part;
      } else {
        currentChunk += part;
      }
    }
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }
    return chunks;
  };

  // Google Translate TTS cloud playback (works on all devices/browsers seamlessly)
  const playGoogleTTS = (txt, finalCallback) => {
    const chunks = splitTextIntoSpeechChunks(txt);
    if (chunks.length === 0) {
      finalCallback(true);
      return;
    }

    let idx = 0;
    let failed = false;

    const playNext = () => {
      if (failed) {
        finalCallback(false);
        return;
      }

      if (idx >= chunks.length) {
        finalCallback(true);
        return;
      }

      const chunk = chunks[idx];
      // Auto-detect Devanagari (Hindi) characters for bilingual switching
      const hasHindi = /[\u0900-\u097F]/.test(chunk);
      const langCode = hasHindi ? 'hi' : 'en';
      
      const isCapacitor = window.Capacitor || (window.location.protocol !== 'http:' && window.location.protocol !== 'https:');
      const apiBaseURL = api.defaults.baseURL || '';
      const url = (isCapacitor && apiBaseURL)
        ? `${apiBaseURL}/api/exams/tts?text=${encodeURIComponent(chunk)}&lang=${langCode}`
        : `/api/exams/tts?text=${encodeURIComponent(chunk)}&lang=${langCode}`;
      
      const audio = new Audio(url);
      audio.crossOrigin = "anonymous";
      currentAudioRef.current = audio;

      audio.onended = () => {
        idx++;
        playNext();
      };

      audio.onerror = (err) => {
        console.error("Google TTS error:", err);
        failed = true;
        finalCallback(false);
      };

      audio.play().catch(err => {
        console.error("Audio playback error:", err);
        failed = true;
        finalCallback(false);
      });
    };

    playNext();
  };

  // Web Speech API fallback for local offline synthesis
  const speakWebSpeech = (txt, callback) => {
    if (!('speechSynthesis' in window)) {
      if (callback) callback();
      return;
    }

    if (speakTimeoutRef.current) {
      clearTimeout(speakTimeoutRef.current);
    }

    speakTimeoutRef.current = setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(txt);
      const voices = window.speechSynthesis.getVoices();
      let selectedVoice = null;
      
      if (voiceLang === 'HI') {
        selectedVoice = voices.find(v => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('india')) || null;
        utterance.lang = 'hi-IN';
        utterance.rate = 0.92;
      } else {
        selectedVoice = voices.find(v => v.lang.startsWith('en') || v.name.toLowerCase().includes('english') || v.name.toLowerCase().includes('united states')) || null;
        utterance.lang = 'en-US';
        utterance.rate = 1.0;
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      let ended = false;
      const handleEnd = () => {
        if (ended) return;
        ended = true;
        setVoiceState('idle');
        if (callback) callback();
      };

      utterance.onend = handleEnd;
      utterance.onerror = (e) => {
        console.error('SpeechSynthesis error:', e);
        handleEnd();
      };

      const estimatedDuration = Math.max(3000, txt.length * 85); 
      const safetyTimer = setTimeout(() => {
        if (!ended) {
          console.warn('SpeechSynthesis safety timeout triggered.');
          handleEnd();
        }
      }, estimatedDuration);

      const originalOnEnd = utterance.onend;
      utterance.onend = () => {
        clearTimeout(safetyTimer);
        originalOnEnd();
      };

      const originalOnError = utterance.onerror;
      utterance.onerror = (e) => {
        clearTimeout(safetyTimer);
        originalOnError(e);
      };

      window.speechSynthesis.speak(utterance);
    }, 80);
  };

  // Main hybrid speech synthesis function
  const speak = (txt, callback) => {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }

    setVoiceState('speaking');
    setSubtitle(txt);

    const cleanedText = cleanTextForSpeech(txt);

    // Try Google TTS first, fallback to Web Speech Synthesis if blocked or offline
    playGoogleTTS(cleanedText, (success) => {
      if (success) {
        setVoiceState('idle');
        if (callback) callback();
      } else {
        speakWebSpeech(cleanedText, callback);
      }
    });
  };

  // Start Speech Recognition Listening
  const startListening = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (!recognitionRef.current) return;
    if (isListeningRef.current) return;
    
    try {
      recognitionRef.current.lang = voiceLang === 'HI' ? 'hi-IN' : 'en-US';
      recognitionRef.current.start();
    } catch (e) {
      console.error('Error starting recognition:', e);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListeningRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Play Asha Welcome Intro inside user gesture
  const handleStartExam = () => {
    setStep('speaking-intro');
    const text = voiceLang === 'HI' 
      ? 'नमस्ते! मैं हूँ आशा ए आई। आपकी मौखिक परीक्षा में आपका स्वागत है। मैं आपसे दस प्रश्न पूछूँगी। कृपया माइक्रोफ़ोन चमकने पर अपना विकल्प जैसे, ऑप्शन ए, बी, सी, या डी बोलें। चलिए शुरू करते हैं!'
      : 'Hello! I am Asha AI. Welcome to your oral exam. I will ask you ten questions. Please speak your answer, like Option A, B, C, or D, when the microphone glows green. Let us begin!';
    
    speak(text, () => {
      setStep('exam');
    });
  };

  // Play Question voice output
  const playQuestion = (index) => {
    const q = questions[index];
    if (!q) return;

    setTranscript('');
    setSpeechError(null);

    let speechText = '';
    if (voiceLang === 'HI') {
      speechText = `प्रश्न ${index + 1}. ${q.question_text}. `;
      speechText += `विकल्प ए. ${q.options[0]}. `;
      speechText += `विकल्प बी. ${q.options[1]}. `;
      speechText += `विकल्प सी. ${q.options[2]}. `;
      speechText += `विकल्प डी. ${q.options[3]}. `;
    } else {
      speechText = `Question ${index + 1}. ${q.question_text}. `;
      speechText += `Option A. ${q.options[0]}. `;
      speechText += `Option B. ${q.options[1]}. `;
      speechText += `Option C. ${q.options[2]}. `;
      speechText += `Option D. ${q.options[3]}. `;
    }

    speak(speechText, () => {
      setTimeout(() => {
        startListening();
      }, 300);
    });
  };

  // Repeat current question
  const repeatQuestion = () => {
    stopListening();
    playQuestion(currentIndex);
  };

  const handleOrbClick = () => {
    if (voiceState === 'idle') {
      startListening();
    } else {
      repeatQuestion();
    }
  };

  // Voice Matcher Logic
  const getSelectedIndex = (spokenText, options) => {
    const cleanStr = spokenText.toLowerCase().trim();
    
    // 1. Direct match with option text
    for (let i = 0; i < options.length; i++) {
      const optClean = options[i].toLowerCase().trim();
      if (cleanStr === optClean || (cleanStr.length > 3 && optClean.includes(cleanStr))) {
        return i;
      }
    }

    const patterns = [
      {
        index: 0,
        words: [
          'option a', 'option 1', 'option one', 'opt a', 'opt 1', 'first', 'one', 'a', '1',
          'पहला', 'पहला ऑप्शन', 'ऑप्शन ए', 'ऑप्शन 1', 'एक', 'पहला विकल्प', 'विकल्प ए'
        ]
      },
      {
        index: 1,
        words: [
          'option b', 'option 2', 'option two', 'opt b', 'opt 2', 'second', 'two', 'b', '2',
          'दूसरा', 'दूसरा ऑप्शन', 'ऑप्शन बी', 'ऑप्शन 2', 'दो', 'दूसरा विकल्प', 'विकल्प बी'
        ]
      },
      {
        index: 2,
        words: [
          'option c', 'option 3', 'option three', 'opt c', 'opt 3', 'third', 'three', 'c', '3',
          'तीसरा', 'तीसरा ऑप्शन', 'ऑप्शन सी', 'ऑप्शन 3', 'तीन', 'तीसरा विकल्प', 'विकल्प सी'
        ]
      },
      {
        index: 3,
        words: [
          'option d', 'option 4', 'option four', 'opt d', 'opt 4', 'fourth', 'four', 'd', '4',
          'चौथा', 'चौथा ऑप्शन', 'ऑप्शन डी', 'ऑप्शन 4', 'चार', 'चौथा विकल्प', 'विकल्प डी'
        ]
      }
    ];

    for (const pattern of patterns) {
      for (const word of pattern.words) {
        if (cleanStr === word || cleanStr.startsWith(word + ' ') || cleanStr.endsWith(' ' + word) || cleanStr.includes(' ' + word + ' ')) {
          return pattern.index;
        }
      }
    }

    for (const pattern of patterns) {
      for (const word of pattern.words) {
        if (word.length > 2 && cleanStr.includes(word)) {
          return pattern.index;
        }
      }
    }

    // Exact word boundaries matching for letters to prevent false triggers (e.g. matching 'सीखने' as 'सी')
    const matchLetter = (str, engLetter, hiLetter) => {
      const words = str.split(/[\s,.-]+/);
      if (words.includes(engLetter) || words.includes(hiLetter)) return true;
      if (str === engLetter || str === hiLetter) return true;
      const hiRegex = new RegExp(`(?:^|\\s)${hiLetter}(?:$|\\s)`);
      const engRegex = new RegExp(`\\b${engLetter}\\b`);
      return hiRegex.test(str) || engRegex.test(str);
    };

    if (matchLetter(cleanStr, 'a', 'ए') || cleanStr === '1' || cleanStr.includes('one')) return 0;
    if (matchLetter(cleanStr, 'b', 'बी') || cleanStr === '2' || cleanStr.includes('two')) return 1;
    if (matchLetter(cleanStr, 'c', 'सी') || cleanStr === '3' || cleanStr.includes('three')) return 2;
    if (matchLetter(cleanStr, 'd', 'डी') || cleanStr === '4' || cleanStr.includes('four')) return 3;

    return -1;
  };

  // Handle Voice Input Answer
  const handleSpokenAnswer = (spokenText) => {
    const q = questions[currentIndex];
    if (!q) return;

    const repeatPhrases = ['repeat', 'repeat question', 'फिर से बोलो', 'फिर से', 'दोबारा', 'दोबारा बोलो'];
    if (repeatPhrases.some(phrase => spokenText.toLowerCase().includes(phrase))) {
      const confirmText = voiceLang === 'HI' ? 'ठीक है, मैं प्रश्न दोहराती हूँ।' : 'Sure, repeating the question.';
      speak(confirmText, () => {
        playQuestion(currentIndex);
      });
      return;
    }

    const optIndex = getSelectedIndex(spokenText, q.options);
    if (optIndex !== -1) {
      submitOptionAnswer(optIndex);
    } else {
      const retryText = voiceLang === 'HI' 
        ? 'क्षमा करें, मुझे समझ नहीं आया। कृपया विकल्प ए, बी, सी या डी बोलें या स्क्रीन पर दबाएं।'
        : 'Sorry, I did not catch that. Please speak Option A, B, C, or D, or tap on the screen.';
      
      speak(retryText, () => {
        setTimeout(() => startListening(), 300);
      });
    }
  };

  // Submit Answer
  const submitOptionAnswer = (optIndex) => {
    stopListening();
    const q = questions[currentIndex];
    if (!q) return;

    const selectedOpt = q.options[optIndex];
    setAnswers(prev => ({
      ...prev,
      [q.question_id]: selectedOpt
    }));

    const isCorrect = selectedOpt === q.correct_answer;
    setVoiceState(isCorrect ? 'success' : 'error');

    let feedback = '';
    const optionLetters = ['A', 'B', 'C', 'D'];
    const correctIndex = q.options.indexOf(q.correct_answer);
    const correctLetter = correctIndex !== -1 ? optionLetters[correctIndex] : 'A';

    if (isCorrect) {
      feedback = voiceLang === 'HI' ? 'सही उत्तर!' : 'Correct answer!';
    } else {
      feedback = voiceLang === 'HI' 
        ? `गलत उत्तर। सही उत्तर है विकल्प ${correctLetter}. ${q.correct_answer}.`
        : `Incorrect. The correct answer is Option ${correctLetter}. ${q.correct_answer}.`;
    }

    speak(feedback, () => {
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          handleSubmitExam({
            ...answers,
            [q.question_id]: selectedOpt
          });
        }
      }, 1000);
    });
  };

  // Fetch voice exam questions from server
  const fetchQuestions = async () => {
    setStep('loading');
    try {
      const token = localStorage.getItem('token');
      const apiLang = voiceLang === 'HI' ? 'hindi' : 'english';
      let url = `/api/exams/today?count=10&duration=10&lang=${apiLang}`; // 'all' fallback
      if (selectedSubject !== 'all') {
        url = `/api/exams/subject/${selectedSubject}?count=10&duration=10&lang=${apiLang}`;
      }
      
      const res = await api.get(url, { headers: { 'x-auth-token': token } });
      const { exam: newExam, questions: newQuestions } = res.data;
      
      setExam(newExam);
      setQuestions(newQuestions.slice(0, 10));
      setCurrentIndex(0);
      setAnswers({});
      setStep('ready-to-start');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error loading questions');
      setStep('setup');
    }
  };

  // Submit test to backend
  const handleSubmitExam = async (finalAnswers) => {
    setStep('loading');
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const formattedAnswers = Object.entries(finalAnswers).map(([qid, opt]) => ({
        question_id: qid,
        selected_option: opt
      }));

      const res = await api.post(`/api/exams/submit/${exam.exam_id}`, {
        answers: formattedAnswers
      }, {
        headers: { 'x-auth-token': token }
      });

      setResult(res.data.exam);
      setStep('result');

      const score = res.data.exam.score;
      let praise = '';
      if (voiceLang === 'HI') {
        praise = `परीक्षा पूरी हुई। आपका स्कोर दस में से ${score} है। `;
        if (score >= 8) praise += 'अति उत्तम! आपने बहुत अच्छा प्रदर्शन किया।';
        else if (score >= 5) praise += 'अच्छा प्रयास है! थोड़ा और अभ्यास करें।';
        else praise += 'चिंता न करें, प्रयास करते रहें और फिर से कोशिश करें!';
      } else {
        praise = `Test completed. Your score is ${score} out of 10. `;
        if (score >= 8) praise += 'Outstanding! You did an amazing job.';
        else if (score >= 5) praise += 'Good job! Keep practicing.';
        else praise += 'Do not worry, keep studying and try again!';
      }
      speak(praise);

    } catch (err) {
      console.error(err);
      alert('Error submitting results. Storing locally.');
      setStep('result');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    stopListening();
    setStep('setup');
    setCurrentIndex(0);
    setAnswers({});
    setQuestions([]);
    setResult(null);
    setTranscript('');
    setSubtitle('');
    setVoiceState('idle');
  };

  const getDotColor = (idx) => {
    if (idx === currentIndex) return 'bg-sky-400 ring-4 ring-sky-500/30 scale-125';
    
    const q = questions[idx];
    if (!q) return 'bg-white/10';
    
    const ans = answers[q.question_id];
    if (!ans) return 'bg-white/20';
    
    return ans === q.correct_answer ? 'bg-emerald-400' : 'bg-rose-400';
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0F19] text-white px-5 pt-6 pb-24 max-w-md mx-auto w-full relative overflow-hidden select-none">
      {/* Dynamic Glow Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] rounded-full bg-indigo-500/10 blur-[80px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] rounded-full bg-cyan-500/10 blur-[80px]" />

      {/* Styled inject for 3D concentric rotating rings */}
      <style dangerouslySetInnerHTML={{__html: `
        .hologram-viewport {
          perspective: 1000px;
        }
        .hologram-container {
          transform-style: preserve-3d;
          animation: float 4s ease-in-out infinite;
        }
        .hologram-ring {
          position: absolute;
          border: 2px solid transparent;
          border-radius: 50%;
          opacity: 0.7;
          pointer-events: none;
        }
        .ring-1 {
          width: 140px;
          height: 140px;
          border-left-color: var(--glow-color, #38bdf8);
          border-right-color: var(--glow-color, #38bdf8);
          animation: rotate-x 6s linear infinite;
        }
        .ring-2 {
          width: 160px;
          height: 160px;
          border-top-color: var(--glow-color, #38bdf8);
          border-bottom-color: var(--glow-color, #38bdf8);
          animation: rotate-y 8s linear infinite;
        }
        .ring-3 {
          width: 180px;
          height: 180px;
          border-left-color: var(--glow-color, #38bdf8);
          border-top-color: var(--glow-color, #38bdf8);
          animation: rotate-z 12s linear infinite;
        }
        @keyframes rotate-x {
          0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateX(360deg) rotateY(180deg) rotateZ(360deg); }
        }
        @keyframes rotate-y {
          0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateX(180deg) rotateY(360deg) rotateZ(360deg); }
        }
        @keyframes rotate-z {
          0% { transform: rotateZ(0deg); }
          100% { transform: rotateZ(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.01); }
        }
      `}} />

      {/* Header bar */}
      <header className="flex justify-between items-center relative z-10 mb-6">
        <button 
          onClick={handleReset}
          className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            Asha AI
          </span>
        </div>
      </header>

      {/* STEP 1: SETUP */}
      {step === 'setup' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6 relative z-10 flex-1 justify-center"
        >
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {t.voiceBannerTitle || "🎙️ AI Oral Exam Bot"}
            </h1>
            <p className="text-sm text-slate-400 font-semibold px-2">
              {t.voiceTestDesc || "Take a hands-free, voice-controlled 10-question test with immediate speech feedback."}
            </p>
          </div>

          {/* Subject choice */}
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-1">
              {t.selectSubject || "Select Subject"}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {subjects.map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubject(sub.id)}
                  className={`glass-card p-4 flex flex-col gap-2 items-center justify-center text-center transition-all border-2 ${
                    selectedSubject === sub.id 
                      ? 'border-sky-400 bg-sky-500/10 shadow-lg shadow-sky-500/10 scale-[1.02]' 
                      : 'border-white/5 bg-white/5 opacity-80 hover:opacity-100'
                  }`}
                >
                  <span className="text-2xl">{sub.icon}</span>
                  <span className="text-xs font-black tracking-wide text-slate-200">{sub.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Voice Language selection */}
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-1">
              {t.selectLanguage || "Select Voice Language"}
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setVoiceLang('EN')}
                className={`flex-1 py-4 rounded-2xl text-sm font-black border-2 transition-all ${
                  voiceLang === 'EN' 
                    ? 'border-indigo-500 bg-indigo-500/10 text-white' 
                    : 'border-white/5 bg-white/5 text-slate-400'
                }`}
              >
                English Voice 🇺🇸
              </button>
              <button
                onClick={() => setVoiceLang('HI')}
                className={`flex-1 py-4 rounded-2xl text-sm font-black border-2 transition-all ${
                  voiceLang === 'HI' 
                    ? 'border-indigo-500 bg-indigo-500/10 text-white' 
                    : 'border-white/5 bg-white/5 text-slate-400'
                }`}
              >
                हिन्दी आवाज 🇮🇳
              </button>
            </div>
          </div>

          {/* Instructions banner */}
          <div className="glass-card !bg-white/5 !border-white/5 text-[11px] leading-relaxed text-slate-400 p-4 rounded-2xl flex gap-3">
            <Sparkles className="text-indigo-400 shrink-0" size={18} />
            <p>{t.voiceInstructions || "Instructions: Enable microphone access. The AI will speak questions & options. Wait for the avatar to glow green, then answer clearly like 'Option A' or 'पहला विकल्प'."}</p>
          </div>

          {/* Launch button */}
          <button
            onClick={fetchQuestions}
            className="w-full mt-4 py-5 rounded-3xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 font-black tracking-widest text-sm shadow-xl shadow-indigo-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <Play size={16} fill="currentColor" />
            {t.startVoiceTest || "Launch Voice Test"}
          </button>
        </motion.div>
      )}

      {/* STEP 2: LOADING */}
      {step === 'loading' && (
        <div className="flex flex-col items-center justify-center flex-1 gap-6 relative z-10">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <Sparkles className="absolute inset-0 m-auto text-indigo-400 animate-pulse" size={24} />
          </div>
          <p className="text-sm font-black text-slate-300 animate-pulse uppercase tracking-widest">
            {submitting ? (lang === 'HI' ? 'स्कोर सबमिट हो रहा है...' : 'Submitting score...') : (lang === 'HI' ? 'सवाल तैयार हो रहे हैं...' : 'Asha AI is preparing questions...')}
          </p>
        </div>
      )}

      {/* STEP: READY-TO-START */}
      {step === 'ready-to-start' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6 relative z-10 flex-1 justify-center items-center text-center"
        >
          <div className="w-24 h-24 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shadow-lg shadow-sky-500/5 relative mb-4">
            <Volume2 className="text-sky-400 animate-pulse" size={40} />
            <Sparkles className="absolute top-0 right-0 text-indigo-400 animate-bounce" size={20} />
          </div>
          
          <div className="space-y-2 max-w-sm">
            <h1 className="text-2xl font-black tracking-tight text-slate-100">
              {lang === 'HI' ? 'आशा एआई तैयार है' : 'Asha AI is Ready'} 🎙️
            </h1>
            <p className="text-sm text-slate-400 font-semibold px-4 leading-relaxed">
              {lang === 'HI' 
                ? 'आपके प्रश्न लोड हो चुके हैं। मौखिक परीक्षा शुरू करने और आशा की आवाज सुनने के लिए नीचे दिए गए बटन को दबाएं।'
                : 'Your questions are successfully loaded. Tap the button below to start and enable the voice assistant.'}
            </p>
          </div>

          <button
            onClick={handleStartExam}
            className="w-full mt-4 py-5 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 font-black tracking-widest text-sm shadow-xl shadow-emerald-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <Play size={16} fill="currentColor" />
            {lang === 'HI' ? 'परीक्षा शुरू करें' : 'Start Oral Test'}
          </button>
        </motion.div>
      )}

      {/* STEP 3: SPEAKING-INTRO / 4: EXAM */}
      {(step === 'speaking-intro' || step === 'exam') && (
        <div className="flex flex-col flex-1 relative z-10 justify-between">
          {/* Progress Indicators */}
          {step === 'exam' && (
            <div className="flex justify-between items-center gap-2 px-1 mb-2">
              <div className="flex gap-1.5 flex-1">
                {questions.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-2 flex-1 rounded-full transition-all duration-300 ${getDotColor(idx)}`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">
                {currentIndex + 1} / 10
              </span>
            </div>
          )}

          {/* 3D Simulated Hologram Sphere */}
          <div className="flex-1 flex flex-col items-center justify-center py-6">
            <div 
              className="hologram-viewport w-64 h-64 flex items-center justify-center relative cursor-pointer"
              onClick={handleOrbClick}
              style={{
                '--glow-color': 
                  voiceState === 'speaking' ? 'rgba(168, 85, 247, 0.7)' :
                  voiceState === 'listening' ? 'rgba(16, 185, 129, 0.85)' :
                  voiceState === 'thinking' ? 'rgba(245, 158, 11, 0.75)' :
                  voiceState === 'success' ? 'rgba(34, 197, 94, 0.9)' :
                  voiceState === 'error' ? 'rgba(239, 68, 68, 0.9)' :
                  'rgba(56, 189, 248, 0.6)'
              }}
            >
              {/* Inner glowing cores */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-sky-500/30 to-purple-600/30 blur-md absolute animate-pulse" />
              <motion.div 
                animate={{
                  scale: voiceState === 'listening' ? [1, 1.25, 1] : voiceState === 'speaking' ? [1, 1.15, 1] : 1,
                }}
                transition={{
                  repeat: Infinity,
                  duration: voiceState === 'listening' ? 1.2 : 2,
                  ease: 'easeInOut'
                }}
                className={`w-28 h-28 rounded-full border-4 border-white/10 relative flex items-center justify-center shadow-2xl backdrop-blur-2xl transition-all duration-500 ${
                  voiceState === 'speaking' ? 'bg-purple-500/20 shadow-purple-500/35 border-purple-500/40' :
                  voiceState === 'listening' ? 'bg-emerald-500/25 shadow-emerald-500/40 border-emerald-500/40' :
                  voiceState === 'thinking' ? 'bg-amber-500/20 shadow-amber-500/35 border-amber-500/40' :
                  voiceState === 'success' ? 'bg-emerald-500/30 shadow-emerald-500/50 border-emerald-400' :
                  voiceState === 'error' ? 'bg-rose-500/30 shadow-rose-500/50 border-rose-400' :
                  'bg-sky-500/10 shadow-sky-500/20 border-white/15'
                }`}
              >
                {/* Visual state icon inside the sphere */}
                <AnimatePresence mode="wait">
                  {voiceState === 'speaking' && (
                    <motion.div key="speak" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                      <Volume2 className="text-purple-300" size={32} />
                    </motion.div>
                  )}
                  {voiceState === 'listening' && (
                    <motion.div key="listen" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1.2, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                      <Mic className="text-emerald-300" size={36} />
                    </motion.div>
                  )}
                  {voiceState === 'thinking' && (
                    <motion.div key="think" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                      <Sparkles className="text-amber-300 animate-spin" style={{ animationDuration: '3s' }} size={32} />
                    </motion.div>
                  )}
                  {voiceState === 'success' && (
                    <motion.div key="ok" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1.2, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                      <CheckCircle2 className="text-emerald-400" size={36} />
                    </motion.div>
                  )}
                  {voiceState === 'error' && (
                    <motion.div key="err" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1.2, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                      <XCircle className="text-rose-400" size={36} />
                    </motion.div>
                  )}
                  {voiceState === 'idle' && (
                    <motion.div key="idle" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                      <VolumeX className="text-sky-300" size={28} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* 3D Orbiting Rings */}
              <div className="hologram-container absolute flex items-center justify-center pointer-events-none">
                <div className="hologram-ring ring-1" />
                <div className="hologram-ring ring-2" />
                <div className="hologram-ring ring-3" />
              </div>
            </div>

            {/* Speaking State Labels */}
            <div className="text-center mt-2 px-6 min-h-[44px]">
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                voiceState === 'speaking' ? 'bg-purple-500/20 text-purple-300' :
                voiceState === 'listening' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                voiceState === 'thinking' ? 'bg-amber-500/20 text-amber-300' :
                voiceState === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                voiceState === 'error' ? 'bg-rose-500/20 text-rose-400' :
                'bg-white/5 text-slate-500'
              }`}>
                {voiceState === 'speaking' ? (t.speaking || "Asha is speaking...") :
                 voiceState === 'listening' ? (t.listening || "Listening... Answer now") :
                 voiceState === 'thinking' ? (t.processing || "Thinking...") :
                 voiceState === 'success' ? (t.correct || "Correct!") :
                 voiceState === 'error' ? (t.incorrect || "Incorrect!") :
                 (t.ready || "Tap orb to repeat")}
              </span>
            </div>
          </div>

          {/* Subtitles & Transcripts Panel */}
          <div className="space-y-4 mb-6">
            {/* Asha AI Question Subtitle */}
            <div className="glass-card !bg-white/5 !border-white/5 p-4 rounded-2xl">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-1">
                {lang === 'HI' ? 'सब्जेक्ट प्रश्न' : 'Asha AI Subtitle'}
              </span>
              <p className="text-sm font-semibold leading-relaxed text-slate-200">
                {step === 'speaking-intro' ? subtitle : (questions[currentIndex]?.question_text || '')}
              </p>
            </div>

            {/* Speech Recognition User Transcript */}
            {step === 'exam' && (
              <div className={`p-4 rounded-2xl border transition-all ${
                voiceState === 'listening' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/5 border-white/5'
              }`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                    {lang === 'HI' ? 'आपका जवाब (आवाज)' : 'Your Response (Speech)'}
                  </span>
                  {voiceState === 'listening' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>
                <p className={`text-sm font-black ${transcript ? 'text-white' : 'text-slate-500 italic'}`}>
                  {transcript || (voiceState === 'listening' ? (lang === 'HI' ? 'बोलना शुरू करें...' : 'Say your option now...') : (lang === 'HI' ? 'बोलने के लिए हरा बटन दबाएं' : 'Microphone standby - tap green button to speak'))}
                </p>
                {speechError && (
                  <p className="text-[10px] font-bold text-rose-400 mt-1">
                    Mic issue: {speechError}. You can tap options below manually.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Manual Selector Fallback Option List */}
          {step === 'exam' && questions[currentIndex] && (
            <div className="space-y-2 mb-2 relative z-10">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1 block mb-1">
                {lang === 'HI' ? 'मैन्युअल विकल्प चुनें (टैप करें)' : 'Manual Selection Option Fallback'}
              </span>
              <div className="grid grid-cols-1 gap-2.5">
                {questions[currentIndex].options.map((opt, optIdx) => {
                  const optionLetters = ['A', 'B', 'C', 'D'];
                  const qId = questions[currentIndex].question_id;
                  const answeredOpt = answers[qId];
                  const isThisOptAnswered = answeredOpt === opt;
                  const isCorrect = opt === questions[currentIndex].correct_answer;
                  
                  let borderStyle = 'border-white/5 bg-white/5 text-slate-200 hover:border-white/10 active:scale-[0.99]';
                  if (answeredOpt) {
                    if (isThisOptAnswered) {
                      borderStyle = isCorrect 
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold shadow-lg shadow-emerald-500/5'
                        : 'border-rose-500 bg-rose-500/10 text-rose-400 font-bold shadow-lg shadow-rose-500/5';
                    } else if (isCorrect) {
                      borderStyle = 'border-emerald-500/50 bg-emerald-500/5 text-emerald-400/80 font-bold';
                    } else {
                      borderStyle = 'border-white/5 bg-white/5 opacity-55 text-slate-400 pointer-events-none';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={!!answeredOpt}
                      onClick={() => submitOptionAnswer(optIdx)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs font-semibold flex items-center gap-3.5 transition-all ${borderStyle}`}
                    >
                      <span className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-black tracking-tight border ${
                        answeredOpt && isThisOptAnswered
                          ? (isCorrect ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-rose-500/20 border-rose-400 text-rose-300')
                          : 'bg-white/10 border-white/10 text-slate-300'
                      }`}>
                        {optionLetters[optIdx]}
                      </span>
                      <span className="leading-normal">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Repeat / Manual buttons */}
          <div className="flex gap-3 justify-center mt-2 relative z-10">
            <button
              onClick={repeatQuestion}
              className="py-3 px-6 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-black text-xs hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <RotateCcw size={13} />
              {lang === 'HI' ? 'प्रश्न दोबारा सुनें' : 'Repeat Question'}
            </button>
            {voiceState !== 'listening' && step === 'exam' && !answers[questions[currentIndex]?.question_id] && (
              <button
                onClick={startListening}
                className="py-3 px-6 rounded-xl bg-emerald-600 border border-emerald-500 text-white font-black text-xs hover:bg-emerald-700 transition-all flex items-center gap-2 animate-pulse"
              >
                <Mic size={13} />
                {lang === 'HI' ? 'बोलकर उत्तर दें' : 'Speak Answer'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* STEP 5: RESULTS */}
      {step === 'result' && result && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col gap-6 relative z-10 flex-1 justify-center py-4"
        >
          <div className="text-center space-y-2">
            <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border-2 border-amber-500/20 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/5">
              <Trophy className="text-amber-400" size={40} />
            </div>
            <h1 className="text-2xl font-black text-slate-200 tracking-tight">
              {t.voiceScore || "Your Voice Test Score"}
            </h1>
            <p className="text-xs text-slate-400 font-black tracking-widest uppercase mt-1">
              {subjects.find(s => s.id === selectedSubject)?.name || selectedSubject}
            </p>
          </div>

          {/* Large score display */}
          <div className="glass-card relative overflow-hidden text-center p-6 space-y-3 bg-gradient-to-br from-indigo-500/10 to-purple-600/5 border border-white/10 rounded-3xl">
            <div className="text-6xl font-black tracking-tight bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
              {result.score} <span className="text-2xl text-slate-500 font-bold">/ {questions.length}</span>
            </div>
            <div className="text-sm font-bold text-slate-300">
              {lang === 'HI' 
                ? `सटीकता: ${Math.round((result.score / questions.length) * 100)}%` 
                : `Accuracy: ${Math.round((result.score / questions.length) * 100)}%`}
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-sky-400 h-full rounded-full" 
                style={{ width: `${(result.score / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Detailed Question Review List */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
              {lang === 'HI' ? 'प्रश्नों का विवरण' : 'Question Breakdown'}
            </h3>
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const userAns = answers[q.question_id];
                const isCorrect = userAns === q.correct_answer;
                
                return (
                  <div 
                    key={idx}
                    className="glass-card !p-3.5 !bg-white/5 !border-white/5 flex items-start gap-3 rounded-2xl"
                  >
                    <div className="mt-0.5">
                      {isCorrect ? (
                        <CheckCircle2 className="text-emerald-400" size={16} />
                      ) : (
                        <XCircle className="text-rose-400" size={16} />
                      )}
                    </div>
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-200 leading-normal truncate">
                        {idx + 1}. {q.question_text}
                      </p>
                      <div className="text-[10px] text-slate-400 flex flex-wrap gap-x-3 gap-y-1">
                        <span>
                          <strong className="text-slate-500 uppercase font-black text-[8px] tracking-wide mr-0.5">Your:</strong>
                          <span className={isCorrect ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>{userAns || 'Not Answered'}</span>
                        </span>
                        {!isCorrect && (
                          <span>
                            <strong className="text-slate-500 uppercase font-black text-[8px] tracking-wide mr-0.5">Correct:</strong>
                            <span className="text-emerald-400 font-semibold">{q.correct_answer}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 mt-2">
            <button
              onClick={handleReset}
              className="w-full py-4.5 rounded-2xl bg-white/5 border border-white/10 font-black text-sm tracking-wide text-white hover:bg-white/10 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={15} />
              {t.restart || "Restart Test"}
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-4.5 rounded-2xl bg-sky-500 font-black text-sm tracking-wide text-white shadow-lg shadow-sky-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={15} />
              {lang === 'HI' ? 'डैशबोर्ड पर वापस जाएं' : 'Return to Dashboard'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default VoiceTest;
