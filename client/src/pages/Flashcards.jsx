import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Flashcards = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const cards = [
    { term: "Jean Piaget", definition: "Known for the Theory of Cognitive Development. Focused on 4 stages: Sensory-motor, Pre-operational, Concrete operational, and Formal operational." },
    { term: "Lev Vygotsky", definition: "Introduced 'Social Constructivism' and the concept of ZPD (Zone of Proximal Development) and Scaffolding." },
    { term: "Erik Erikson", definition: "Proposed the 8 stages of Psychosocial Development, focusing on conflicts like 'Trust vs Mistrust'." },
    { term: "B.F. Skinner", definition: "Famous for Operant Conditioning. Focused on how reinforcement and punishment shape behavior." },
    { term: "Ivan Pavlov", definition: "Pioneer of Classical Conditioning. Known for the experiment with dogs and the bell (Stimulus-Response)." },
    { term: "Howard Gardner", definition: "Proposed the Theory of Multiple Intelligences (e.g., Linguistic, Logical-Mathematical, Musical, etc.)." },
    { term: "Lawrence Kohlberg", definition: "Developed the stages of Moral Development (Pre-conventional, Conventional, Post-conventional)." },
    { term: "Abraham Maslow", definition: "Known for the Hierarchy of Needs, culminating in Self-Actualization." },
    { term: "ZPD", definition: "Zone of Proximal Development: The gap between what a learner can do alone and what they can do with help." },
    { term: "Scaffolding", definition: "Temporary support given to a student by a teacher or peer to help them master a new task." },
    { term: "Constructivism", definition: "A theory stating that learners actively construct their own knowledge based on their experiences." },
    { term: "Bloom's Taxonomy", definition: "A hierarchical model used to classify educational learning objectives into levels of complexity (Remembering to Creating)." },
    { term: "Metacognition", definition: "Thinking about one's own thinking. Awareness and understanding of one's own thought processes." },
    { term: "Inclusive Education", definition: "An approach where students with special needs spend most or all of their time with non-special needs students." },
    { term: "Formative Assessment", definition: "Ongoing evaluations to monitor student learning and provide continuous feedback (e.g., quizzes, class discussion)." },
    { term: "Summative Assessment", definition: "Evaluations used to measure student learning at the end of an instructional unit (e.g., final exams)." },
    { term: "Positive Reinforcement", definition: "The addition of a reinforcing stimulus following a behavior that makes it more likely that the behavior will occur again." },
    { term: "Negative Reinforcement", definition: "The removal of an unpleasant stimulus after a behavior to increase the likelihood of that behavior repeating." },
    { term: "Discovery Learning", definition: "An inquiry-based learning method where students interact with their environment to discover principles." },
    { term: "Egocentrism", definition: "A child's inability to see a situation from another person's point of view (common in Piaget's pre-operational stage)." },
    { term: "Assimilation", definition: "The process of taking in new information into our already existing schemas." },
    { term: "Accommodation", definition: "Modifying existing schemas, or ideas, as a result of new information or new experiences." },
    { term: "Crystallized Intelligence", definition: "The ability to use learned knowledge and experience (increases with age)." },
    { term: "Fluid Intelligence", definition: "The ability to solve new problems, use logic in new situations, and identify patterns (decreases with age)." },
    { term: "Spiral Curriculum", definition: "Jerome Bruner's idea that subjects should be revisited at increasing levels of difficulty." }
  ];

  const nextCard = () => {
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const prevCard = () => {
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  return (
    <div className="flex flex-col gap-8 pt-8 px-6 pb-32 max-w-md mx-auto w-full animate-fade-in min-h-screen">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl">←</button>
        <div>
          <h2 className="text-2xl font-black text-[var(--text-primary)]">Pedagogy <span className="text-amber-400">Flashcards</span></h2>
          <p className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-widest">{currentIndex + 1} of {cards.length}</p>
        </div>
      </header>

      <div className="flex-1 flex flex-col justify-center items-center gap-12">
        {/* Flashcard Container */}
        <div 
          className="perspective-1000 w-full h-80 cursor-pointer"
          onClick={() => setFlipped(!flipped)}
        >
          <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>
            {/* Front */}
            <div className="absolute w-full h-full backface-hidden glass-card flex flex-col items-center justify-center p-8 text-center border-2 border-white/5 shadow-2xl">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 mb-4 opacity-50">Who is / What is</span>
              <h3 className="text-4xl font-black text-[var(--text-primary)] leading-tight">{cards[currentIndex].term}</h3>
              <div className="mt-8 text-xs font-bold text-slate-500 uppercase tracking-widest animate-bounce">Tap to Flip 🔄</div>
            </div>
            
            {/* Back */}
            <div className="absolute w-full h-full backface-hidden rotate-y-180 glass-card flex flex-col items-center justify-center p-8 text-center border-2 border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-4 opacity-50">The Concept</span>
              <p className="text-lg font-bold text-[var(--text-primary)] leading-relaxed italic">
                "{cards[currentIndex].definition}"
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 w-full">
          <button 
            onClick={(e) => { e.stopPropagation(); prevCard(); }}
            className="flex-1 py-5 rounded-2xl bg-white/5 border border-white/10 text-[var(--text-primary)] font-black transition-all active:scale-90"
          >
            Previous
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); nextCard(); }}
            className="flex-1 py-5 rounded-2xl bg-amber-500 text-white font-black shadow-xl shadow-amber-500/20 transition-all active:scale-90"
          >
            Next
          </button>
        </div>
      </div>

      <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-loose">
        Active Recall: Test yourself before flipping the card for 2x faster learning!
      </p>

      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}} />
    </div>
  );
};

export default Flashcards;
