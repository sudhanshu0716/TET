import React, { useState, useEffect } from 'react';
import api from '../services/api';
import translations from '../translations';
import ReactMarkdown from 'react-markdown';

const Cheatsheets = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [filter, setFilter] = useState('all');
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
          // Handled by global PremiumModal
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
      <header className="space-y-1">
        <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">{t.notes} <span className="text-sky-400">📄</span></h2>
        <p className="text-[var(--text-secondary)] font-medium text-sm">{t.notesDesc}</p>
      </header>

      {selectedNote ? (
        <div className="animate-fade-in">
          <button 
            onClick={() => setSelectedNote(null)}
            className="text-sky-400 font-black text-sm mb-4 uppercase tracking-widest hover:text-sky-300 transition-colors"
          >
            ← {t.backToNotes}
          </button>
          <div className="glass-card space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest">{selectedNote.subject.toUpperCase()}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{selectedNote.category}</span>
            </div>
            <h3 className="text-xl font-black text-[var(--text-primary)] pb-4 border-b border-white/5">{selectedNote.title}</h3>
            <div className="text-sm text-[var(--text-secondary)] leading-loose font-medium markdown-body">
              <ReactMarkdown>{selectedNote.content}</ReactMarkdown>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Filter Pills */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 hide-scrollbar">
            {subjects.map(sub => (
              <button
                key={sub}
                onClick={() => setFilter(sub)}
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
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
            {filteredNotes.length > 0 ? filteredNotes.map(note => (
              <div 
                key={note.topic_id} 
                className="glass-card cursor-pointer active:scale-[0.98] transition-all hover:bg-white/5 flex items-center justify-between gap-4"
                onClick={() => setSelectedNote(note)}
              >
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest">{note.subject}</span>
                  <h4 className="text-base font-black text-[var(--text-primary)] truncate">{note.title}</h4>
                  <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{note.category}</span>
                </div>
                <span className="text-2xl shrink-0">📖</span>
              </div>
            )) : (
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
