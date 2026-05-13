import React, { useState, useEffect } from 'react';
import api from '../services/api';
import translations from '../translations';

const Cheatsheets = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [filter, setFilter] = useState('all');
  const lang = localStorage.getItem('appLang') || 'EN';
  const t = translations[lang];

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
      }
    };
    fetchNotes();
  }, []);

  const subjects = ['all', 'pedagogy', 'hindi', 'english', 'evs', 'math', 'social', 'science', 'sanskrit'];
  const filteredNotes = filter === 'all' ? notes : notes.filter(n => n.subject === filter);

  if (loading) return <div className="app-container">{t.preparing}</div>;

  return (
    <div className="app-container animate-fade">
      <header style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>{t.notes} 📄</h2>
        <p style={{ color: 'var(--text-muted)' }}>{t.notesDesc}</p>
      </header>

      {selectedNote ? (
        <div className="animate-fade">
          <button 
            onClick={() => setSelectedNote(null)}
            style={{ background: 'transparent', border: 'none', color: 'var(--primary)', marginBottom: '16px', fontWeight: 600, cursor: 'pointer' }}
          >
            ← {t.backToNotes}
          </button>
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span className="subject-pill" style={{ fontSize: '0.7rem' }}>{selectedNote.subject.toUpperCase()}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{selectedNote.category}</span>
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>{selectedNote.title}</h3>
            <div style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap', fontSize: '1rem' }}>
              {selectedNote.content}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '16px', scrollbarWidth: 'none' }}>
            {subjects.map(sub => (
              <button
                key={sub}
                onClick={() => setFilter(sub)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: filter === sub ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                  background: filter === sub ? 'rgba(99, 102, 241, 0.1)' : 'var(--glass)',
                  color: filter === sub ? 'var(--primary)' : 'white',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                {sub.charAt(0).toUpperCase() + sub.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredNotes.length > 0 ? filteredNotes.map(note => (
              <div 
                key={note.topic_id} 
                className="glass-card" 
                style={{ cursor: 'pointer', transition: '0.3s' }}
                onClick={() => setSelectedNote(note)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>{note.subject}</span>
                    <h4 style={{ margin: '4px 0', fontSize: '1.1rem' }}>{note.title}</h4>
                    <small style={{ color: 'var(--text-muted)' }}>{note.category}</small>
                  </div>
                  <div style={{ fontSize: '1.5rem' }}>📖</div>
                </div>
              </div>
            )) : (
              <div className="glass-card text-center" style={{ padding: '40px' }}>
                <p style={{ color: 'var(--text-muted)' }}>No notes found for this subject yet.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Cheatsheets;
