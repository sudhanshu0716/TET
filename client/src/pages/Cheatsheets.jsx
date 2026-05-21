import React, { useState, useEffect } from 'react';
import api from '../services/api';
import translations from '../translations';
import ReactMarkdown from 'react-markdown';

const Cheatsheets = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [filter, setFilter] = useState('all');
  const [noteLang, setNoteLang] = useState('HI'); // Default language is Hindi ('HI')
  const lang = localStorage.getItem('appLang') || 'EN';
  const t = translations[lang] || translations.EN;

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/api/cheatsheets', {
          headers: { 'x-auth-token': token }
        });
        setNotes(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
        if (err.response?.status === 403) {
          console.log("Access denied: Premium required");
        }
      }
    };
    fetchNotes();
  }, []);

  const subjects = ['all', 'pedagogy', 'hindi', 'english', 'evs', 'math', 'social', 'science', 'sanskrit'];
  const filteredNotes = filter === 'all' ? notes : notes.filter(n => n.subject === filter);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="loader"></div>
      <p className="text-slate-500 font-bold animate-pulse">{t.preparing}</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 px-5 pt-6 pb-32 max-w-md mx-auto w-full animate-fade-in">
      <header className="flex justify-between items-start gap-4">
        <div className="space-y-1 min-w-0">
          <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">{t.notes} <span className="text-sky-400">📄</span></h2>
          <p className="text-[var(--text-secondary)] font-medium text-xs truncate">{t.notesDesc || "Quick 'Must-Know' points for last-minute prep"}</p>
        </div>
        
        {/* Bilingual Notes Toggle Switch */}
        <div className="flex bg-white/5 border border-white/5 rounded-full p-0.5 shrink-0 self-center">
          <button
            onClick={() => setNoteLang('HI')}
            className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all duration-200 cursor-pointer ${
              noteLang === 'HI'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            हिन्दी
          </button>
          <button
            onClick={() => setNoteLang('EN')}
            className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all duration-200 cursor-pointer ${
              noteLang === 'EN'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            EN
          </button>
        </div>
      </header>

      {selectedNote ? (
        <div className="animate-fade-in">
          <button 
            onClick={() => setSelectedNote(null)}
            className="text-sky-400 font-black text-sm mb-4 uppercase tracking-widest hover:text-sky-300 transition-colors cursor-pointer"
          >
            ← {t.backToNotes || "Back to Notes"}
          </button>
          
          <div className="glass-card space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest">{selectedNote.subject}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {noteLang === 'HI' ? (selectedNote.category_hi || selectedNote.category) : (selectedNote.category_en || selectedNote.category)}
              </span>
            </div>
            
            <h3 className="text-xl font-black text-[var(--text-primary)] pb-4 border-b border-white/5">
              {noteLang === 'HI' ? (selectedNote.title_hi || selectedNote.title) : (selectedNote.title_en || selectedNote.title)}
            </h3>
            
            <div className="text-sm text-[var(--text-secondary)] leading-loose font-medium markdown-body whitespace-pre-line">
              <ReactMarkdown>
                {noteLang === 'HI' ? (selectedNote.content_hi || selectedNote.content) : (selectedNote.content_en || selectedNote.content)}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Subject Filter Pills */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 hide-scrollbar">
            {subjects.map(sub => (
              <button
                key={sub}
                onClick={() => setFilter(sub)}
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border cursor-pointer ${
                  filter === sub 
                    ? 'border-sky-500/40 bg-sky-500/10 text-sky-400 shadow-lg shadow-sky-500/10' 
                    : 'border-white/5 bg-white/5 text-slate-400 hover:border-white/10'
                }`}
              >
                {sub.charAt(0).toUpperCase() + sub.slice(1)}
              </button>
            ))}
          </div>

          {/* Notes List */}
          <div className="flex flex-col gap-3">
            {filteredNotes.length > 0 ? filteredNotes.map(note => {
              const noteTitle = noteLang === 'HI' ? (note.title_hi || note.title) : (note.title_en || note.title);
              const noteCategory = noteLang === 'HI' ? (note.category_hi || note.category) : (note.category_en || note.category);
              
              return (
                <div 
                  key={note.topic_id} 
                  className="glass-card cursor-pointer active:scale-[0.98] transition-all hover:bg-white/5 flex items-center justify-between gap-4"
                  onClick={() => setSelectedNote(note)}
                >
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest">{note.subject}</span>
                    <h4 className="text-base font-black text-[var(--text-primary)] truncate">{noteTitle}</h4>
                    <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{noteCategory}</span>
                  </div>
                  <span className="text-2xl shrink-0">📖</span>
                </div>
              );
            }) : (
              <div className="glass-card text-center py-12">
                <p className="text-slate-500 font-bold">No notes found for this subject yet.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Cheatsheets;
