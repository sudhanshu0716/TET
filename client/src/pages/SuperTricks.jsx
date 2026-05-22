import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, Search, ArrowLeft, Sparkles, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import translations from '../translations';

const SuperTricks = () => {
  const [tricks, setTricks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [displayLang, setDisplayLang] = useState('HI'); // Default trick display language
  const [playingId, setPlayingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  
  const navigate = useNavigate();
  const synthRef = useRef(window.speechSynthesis);
  const wakeLockRef = useRef(null);
  
  const appLang = localStorage.getItem('appLang') || 'EN';
  const t = translations[appLang] || translations.EN;

  // Subject configurations with colors and emojis
  const subjectConfig = {
    all: { name: appLang === 'HI' ? 'सभी' : 'All', emoji: '🌟', color: 'sky' },
    pedagogy: { name: t.subjects.pedagogy, emoji: '🧠', color: 'purple' },
    hindi: { name: t.subjects.hindi, emoji: '✍️', color: 'amber' },
    english: { name: t.subjects.english, emoji: '🔤', color: 'cyan' },
    evs: { name: t.subjects.evs, emoji: '🌱', color: 'emerald' },
    math: { name: t.subjects.math, emoji: '📐', color: 'indigo' },
    sanskrit: { name: t.subjects.sanskrit, emoji: '📜', color: 'rose' },
    science: { name: t.subjects.science, emoji: '🔬', color: 'pink' },
    social: { name: t.subjects.social, emoji: '🌍', color: 'orange' }
  };

  // Request Screen Wake Lock to prevent screen sleep/lock while playing audio
  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator && !wakeLockRef.current) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
      }
    } catch (err) {
      console.warn('Failed to acquire screen wake lock:', err.message);
    }
  };

  const releaseWakeLock = async () => {
    try {
      if (wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    } catch (err) {
      console.warn('Failed to release screen wake lock:', err.message);
    }
  };

  useEffect(() => {
    const fetchTricks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/api/super-tricks', {
          headers: { 'x-auth-token': token }
        });
        setTricks(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load super tricks.');
        setLoading(false);
      }
    };
    fetchTricks();

    // Cleanup speech and wake lock on unmount
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (wakeLockRef.current) {
        wakeLockRef.current.release().then(() => {
          wakeLockRef.current = null;
        }).catch(err => console.warn(err));
      }
    };
  }, []);

  // Handle visibility change to re-acquire wake lock if returning to tab while playing
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && playingId) {
        await requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [playingId]);

  // Handle Text to Speech
  const handlePlayVoice = (e, trick) => {
    e.stopPropagation(); // Avoid card click expansion triggering

    if (!synthRef.current) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (playingId === trick.trick_id) {
      // Toggle off if clicking the same button
      synthRef.current.cancel();
      setPlayingId(null);
      releaseWakeLock();
      return;
    }

    // Cancel active speech
    synthRef.current.cancel();
    setPlayingId(trick.trick_id);
    requestWakeLock();

    // Formulate read aloud content based on toggle language
    let textToSpeak = '';
    if (displayLang === 'HI') {
      textToSpeak = `शीर्षक है, ${trick.title_hi}। याद रखने का सूत्र है, ${trick.mnemonic_hi || 'कोई सूत्र नहीं है'}। ट्रिक विवरण है, ${trick.trick_hi}। व्याख्या है, ${trick.explanation_hi || ''}`;
    } else {
      textToSpeak = `Title is, ${trick.title_en}। Mnemonic cue is, ${trick.mnemonic_en || 'none'}। Trick detail is, ${trick.trick_en}। Explanation is, ${trick.explanation_en || ''}`;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = displayLang === 'HI' ? 'hi-IN' : 'en-US';

    // Find and assign proper voice
    const voices = synthRef.current.getVoices();
    let voice = null;
    if (displayLang === 'HI') {
      voice = voices.find(v => v.lang.includes('hi') || v.lang.includes('HI'));
    } else {
      voice = voices.find(v => v.lang.includes('en') || v.lang.includes('EN'));
    }

    if (voice) {
      utterance.voice = voice;
    }

    // Speaking speed
    utterance.rate = displayLang === 'HI' ? 0.85 : 0.9;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setPlayingId(null);
      releaseWakeLock();
    };

    utterance.onerror = () => {
      setPlayingId(null);
      releaseWakeLock();
    };

    synthRef.current.speak(utterance);
  };

  // Stop current voice
  const stopVoice = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setPlayingId(null);
      releaseWakeLock();
    }
  };

  // Get active color utilities
  const getSubjectColorClasses = (subject) => {
    const config = subjectConfig[subject] || subjectConfig.all;
    switch (config.color) {
      case 'purple':
        return {
          bg: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
          shadow: 'shadow-purple-500/10',
          gradient: 'from-purple-500/20 to-indigo-500/5',
          accent: 'border-l-purple-500'
        };
      case 'amber':
        return {
          bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
          shadow: 'shadow-amber-500/10',
          gradient: 'from-amber-500/20 to-orange-500/5',
          accent: 'border-l-amber-500'
        };
      case 'cyan':
        return {
          bg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
          shadow: 'shadow-cyan-500/10',
          gradient: 'from-cyan-500/20 to-blue-500/5',
          accent: 'border-l-cyan-500'
        };
      case 'emerald':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
          shadow: 'shadow-emerald-500/10',
          gradient: 'from-emerald-500/20 to-teal-500/5',
          accent: 'border-l-emerald-500'
        };
      case 'indigo':
        return {
          bg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
          shadow: 'shadow-indigo-500/10',
          gradient: 'from-indigo-500/20 to-violet-500/5',
          accent: 'border-l-indigo-500'
        };
      case 'rose':
        return {
          bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
          shadow: 'shadow-rose-500/10',
          gradient: 'from-rose-500/20 to-pink-500/5',
          accent: 'border-l-rose-500'
        };
      case 'pink':
        return {
          bg: 'bg-pink-500/10 border-pink-500/20 text-pink-400',
          shadow: 'shadow-pink-500/10',
          gradient: 'from-pink-500/20 to-rose-500/5',
          accent: 'border-l-pink-500'
        };
      case 'orange':
        return {
          bg: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
          shadow: 'shadow-orange-500/10',
          gradient: 'from-orange-500/20 to-red-500/5',
          accent: 'border-l-orange-500'
        };
      default:
        return {
          bg: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
          shadow: 'shadow-sky-500/10',
          gradient: 'from-sky-500/20 to-indigo-500/5',
          accent: 'border-l-sky-500'
        };
    }
  };

  // Filtering rules
  const filteredTricks = tricks.filter(trick => {
    const matchesSubject = selectedSubject === 'all' || trick.subject === selectedSubject;
    const matchesQuery = 
      trick.title_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trick.title_hi.includes(searchQuery) ||
      (trick.mnemonic_en && trick.mnemonic_en.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (trick.mnemonic_hi && trick.mnemonic_hi.includes(searchQuery)) ||
      trick.trick_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trick.trick_hi.includes(searchQuery);

    return matchesSubject && matchesQuery;
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="loader"></div>
      <p className="text-slate-500 font-bold animate-pulse">{t.preparing}</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-5 max-w-md mx-auto text-center">
      <div className="text-4xl text-rose-500">⚠️</div>
      <div>
        <h3 className="text-xl font-black text-[var(--text-primary)]">Error</h3>
        <p className="text-sm text-slate-500 font-bold mt-1">{error}</p>
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="px-6 py-3 rounded-2xl bg-sky-500 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-sky-500/20"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 px-5 pt-4 pb-32 max-w-md mx-auto w-full animate-fade-in relative">
      {/* Audio style injector for dancing waves */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes soundWave {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
        .dancing-bar {
          animation: soundWave 0.8s ease-in-out infinite;
        }
        .dancing-bar:nth-child(2) { animation-delay: 0.15s; }
        .dancing-bar:nth-child(3) { animation-delay: 0.3s; }
        .dancing-bar:nth-child(4) { animation-delay: 0.45s; }
      `}} />

      {/* Floating Stop Button if audio is active */}
      {playingId && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-[200] animate-bounce">
          <button 
            onClick={stopVoice}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-rose-500 text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-rose-500/40 border border-rose-400/20 hover:scale-105 active:scale-95 transition-all"
          >
            <VolumeX size={14} />
            <span>{t.stopSpeech}</span>
          </button>
        </div>
      )}

      {/* Header bar */}
      <header className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft size={20} className="text-[var(--text-primary)]" />
          </button>
          <div>
            <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-1.5">
              {t.superTricks} <Sparkles className="text-amber-400 w-6 h-6 animate-pulse" />
            </h2>
            <p className="text-[var(--text-secondary)] font-medium text-xs mt-0.5">{t.superTricksDesc}</p>
          </div>
        </div>

        {/* Display Lang Toggle */}
        <div className="flex bg-white/5 border border-white/5 rounded-full p-0.5 shrink-0 self-center">
          <button
            onClick={() => setDisplayLang('HI')}
            className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all duration-200 cursor-pointer ${
              displayLang === 'HI'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            हिन्दी
          </button>
          <button
            onClick={() => setDisplayLang('EN')}
            className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all duration-200 cursor-pointer ${
              displayLang === 'EN'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            EN
          </button>
        </div>
      </header>

      {/* Search Input */}
      <div className="relative">
        <input 
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl glass-input text-sm font-medium"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
      </div>

      {/* Horizontal Subject Bar */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 hide-scrollbar">
        {Object.entries(subjectConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setSelectedSubject(key)}
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border cursor-pointer flex items-center gap-1.5 ${
              selectedSubject === key
                ? 'border-sky-500/40 bg-sky-500/10 text-sky-400 shadow-lg shadow-sky-500/10'
                : 'border-white/5 bg-white/5 text-slate-400 hover:border-white/10'
            }`}
          >
            <span>{config.emoji}</span>
            <span>{config.name}</span>
          </button>
        ))}
      </div>

      {/* Count Info */}
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
          Showing {filteredTricks.length} of 100 super tricks
        </span>
      </div>

      {/* Tricks List */}
      <div className="flex flex-col gap-4">
        {filteredTricks.length > 0 ? (
          filteredTricks.map((trick) => {
            const cardTheme = getSubjectColorClasses(trick.subject);
            const isPlaying = playingId === trick.trick_id;
            const isExpanded = expandedId === trick.trick_id;
            
            const title = displayLang === 'HI' ? trick.title_hi : trick.title_en;
            const mnemonic = displayLang === 'HI' ? trick.mnemonic_hi : trick.mnemonic_en;
            const content = displayLang === 'HI' ? trick.trick_hi : trick.trick_en;
            const explanation = displayLang === 'HI' ? trick.explanation_hi : trick.explanation_en;
            const category = displayLang === 'HI' ? trick.category_hi : trick.category_en;
            
            return (
              <motion.div 
                key={trick.trick_id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setExpandedId(isExpanded ? null : trick.trick_id)}
                className={`glass-card relative overflow-hidden border-l-4 ${cardTheme.accent} ${cardTheme.shadow} hover:border-r-white/5 flex flex-col gap-3.5 cursor-pointer active:scale-[0.99] transition-all`}
              >
                {/* Upper stats row */}
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] font-black uppercase tracking-widest text-sky-400 bg-sky-500/5 px-2 py-0.5 rounded border border-sky-500/10 w-fit">
                      {trick.subject}
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide mt-1">
                      {category}
                    </span>
                  </div>

                  {/* Play audio speaker */}
                  <button 
                    onClick={(e) => handlePlayVoice(e, trick)}
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-300 cursor-pointer ${
                      isPlaying 
                        ? 'bg-rose-500/15 border-rose-500/40 text-rose-400 scale-105' 
                        : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                    title={t.speakTrick}
                  >
                    {isPlaying ? (
                      <div className="flex items-end gap-0.5 h-4 justify-center">
                        <div className="w-[3px] bg-rose-400 rounded-full dancing-bar" style={{height: '6px'}}></div>
                        <div className="w-[3px] bg-rose-400 rounded-full dancing-bar" style={{height: '14px'}}></div>
                        <div className="w-[3px] bg-rose-400 rounded-full dancing-bar" style={{height: '10px'}}></div>
                        <div className="w-[3px] bg-rose-400 rounded-full dancing-bar" style={{height: '8px'}}></div>
                      </div>
                    ) : (
                      <Volume2 size={16} />
                    )}
                  </button>
                </div>

                {/* Title */}
                <h3 className="text-lg font-black text-[var(--text-primary)] leading-tight">
                  {title}
                </h3>

                {/* Mnemonic formula Box */}
                {mnemonic && (
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${cardTheme.gradient} border border-dashed border-white/5 flex flex-col items-center gap-1`}>
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Mnemonic / सूत्र</span>
                    <span className="text-base font-black text-[var(--text-primary)] tracking-wide uppercase text-center leading-relaxed">
                      {mnemonic}
                    </span>
                  </div>
                )}

                {/* Trick Content text */}
                <div className="text-xs font-semibold text-[var(--text-secondary)] leading-relaxed mt-1">
                  <div className="flex items-start gap-1.5">
                    <BookOpen size={14} className="text-sky-400 mt-0.5 shrink-0" />
                    <span>{content}</span>
                  </div>
                </div>

                {/* Expand indicator and Details section */}
                <div className="border-t border-white/5 pt-2 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-500">
                    <span>{isExpanded ? "Hide Details" : "Tap for Explanation"}</span>
                    {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </div>

                  <AnimatePresence>
                    {isExpanded && explanation && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs text-slate-400 font-medium leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5 mt-1">
                          {explanation}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="glass-card text-center py-12">
            <p className="text-slate-500 font-bold">{t.noTricksFound}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperTricks;
