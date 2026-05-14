import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Flashcards = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const cards = [
    { 
      term: "Jean Piaget", 
      termHi: "जीन पियाजे", 
      definition: "Known for the Theory of Cognitive Development. Focused on 4 stages: Sensory-motor, Pre-operational, Concrete operational, and Formal operational.",
      defHi: "संज्ञानात्मक विकास के सिद्धांत के लिए जाने जाते हैं। उन्होंने 4 चरणों पर ध्यान केंद्रित किया: संवेदी-पेशीय, पूर्व-संक्रियात्मक, मूर्त संक्रियात्मक और औपचारिक संक्रियात्मक।"
    },
    { 
      term: "Lev Vygotsky", 
      termHi: "लेव वायगोत्स्की", 
      definition: "Introduced 'Social Constructivism' and the concept of ZPD (Zone of Proximal Development) and Scaffolding.",
      defHi: "'सामाजिक रचनावाद' और ZPD (समीपस्थ विकास का क्षेत्र) और पाड़ (Scaffolding) की अवधारणा पेश की।"
    },
    { 
      term: "Erik Erikson", 
      termHi: "एरिक एरिक्सन", 
      definition: "Proposed the 8 stages of Psychosocial Development, focusing on conflicts like 'Trust vs Mistrust'.",
      defHi: "मनोसामाजिक विकास के 8 चरणों का प्रस्ताव दिया, जिसमें 'विश्वास बनाम अविश्वास' जैसे संघर्षों पर ध्यान केंद्रित किया गया।"
    },
    { 
      term: "B.F. Skinner", 
      termHi: "बी.एफ. स्किनर", 
      definition: "Famous for Operant Conditioning. Focused on how reinforcement and punishment shape behavior.",
      defHi: "क्रियाप्रसूत अनुबंधन (Operant Conditioning) के लिए प्रसिद्ध। इस बात पर ध्यान केंद्रित किया कि सुदृढ़ीकरण और दंड व्यवहार को कैसे आकार देते हैं।"
    },
    { 
      term: "Ivan Pavlov", 
      termHi: "इवान पावलोव", 
      definition: "Pioneer of Classical Conditioning. Known for the experiment with dogs and the bell (Stimulus-Response).",
      defHi: "शास्त्रीय अनुबंधन के अग्रदूत। कुत्तों और घंटी (उत्तेजना-प्रतिक्रिया) के प्रयोग के लिए जाने जाते हैं।"
    },
    { 
      term: "Howard Gardner", 
      termHi: "हावर्ड गार्डनर", 
      definition: "Proposed the Theory of Multiple Intelligences (e.g., Linguistic, Logical-Mathematical, Musical, etc.).",
      defHi: "बहु-बुद्धि के सिद्धांत का प्रस्ताव दिया (जैसे, भाषाई, तार्किक-गणितीय, संगीतमय, आदि)।"
    },
    { 
      term: "Lawrence Kohlberg", 
      termHi: "लॉरेंस कोहलबर्ग", 
      definition: "Developed the stages of Moral Development (Pre-conventional, Conventional, Post-conventional).",
      defHi: "नैतिक विकास के चरणों (पूर्व-पारंपरिक, पारंपरिक, उत्तर-पारंपरिक) को विकसित किया।"
    },
    { 
      term: "Abraham Maslow", 
      termHi: "अब्राहम मास्लो", 
      definition: "Known for the Hierarchy of Needs, culminating in Self-Actualization.",
      defHi: "आवश्यकताओं के पदानुक्रम (Hierarchy of Needs) के लिए जाने जाते हैं, जो आत्म-साक्षात्कार में समाप्त होता है।"
    },
    { 
      term: "ZPD", 
      termHi: "समीपस्थ विकास का क्षेत्र", 
      definition: "Zone of Proximal Development: The gap between what a learner can do alone and what they can do with help.",
      defHi: "एक शिक्षार्थी जो अकेले कर सकता है और जो वह मदद के साथ कर सकता है, उसके बीच का अंतर।"
    },
    { 
      term: "Scaffolding", 
      termHi: "पाड़ / ढांचा", 
      definition: "Temporary support given to a student by a teacher or peer to help them master a new task.",
      defHi: "किसी छात्र को नया कार्य सीखने में मदद करने के लिए शिक्षक या सहपाठी द्वारा दिया गया अस्थायी समर्थन।"
    },
    { 
      term: "Constructivism", 
      termHi: "रचनावाद", 
      definition: "A theory stating that learners actively construct their own knowledge based on their experiences.",
      defHi: "एक सिद्धांत जो बताता है कि शिक्षार्थी अपने अनुभवों के आधार पर सक्रिय रूप से अपना ज्ञान स्वयं बनाते हैं।"
    },
    { 
      term: "Bloom's Taxonomy", 
      termHi: "ब्लूम का वर्गीकरण", 
      definition: "A hierarchical model used to classify educational learning objectives into levels of complexity (Remembering to Creating).",
      defHi: "शैक्षिक शिक्षण उद्देश्यों को जटिलता के स्तरों (याद रखने से लेकर निर्माण करने तक) में वर्गीकृत करने के लिए उपयोग किया जाने वाला एक पदानुक्रमित मॉडल।"
    },
    { 
      term: "Metacognition", 
      termHi: "अधिसंज्ञान", 
      definition: "Thinking about one's own thinking. Awareness and understanding of one's own thought processes.",
      defHi: "अपनी खुद की सोच के बारे में सोचना। अपनी स्वयं की विचार प्रक्रियाओं के प्रति जागरूकता और समझ।"
    },
    { 
      term: "Inclusive Education", 
      termHi: "समावेशी शिक्षा", 
      definition: "An approach where students with special needs spend most or all of their time with non-special needs students.",
      defHi: "एक दृष्टिकोण जहां विशेष आवश्यकता वाले छात्र अपना अधिकांश या पूरा समय सामान्य छात्रों के साथ बिताते हैं।"
    },
    { 
      term: "Formative Assessment", 
      termHi: "रचनात्मक मूल्यांकन", 
      definition: "Ongoing evaluations to monitor student learning and provide continuous feedback (e.g., quizzes, class discussion).",
      defHi: "छात्रों के सीखने की निगरानी करने और निरंतर प्रतिक्रिया प्रदान करने के लिए चल रहे मूल्यांकन (जैसे, प्रश्नोत्तरी, कक्षा चर्चा)।"
    },
    { 
      term: "Summative Assessment", 
      termHi: "योगात्मक मूल्यांकन", 
      definition: "Evaluations used to measure student learning at the end of an instructional unit (e.g., final exams).",
      defHi: "एक निर्देश इकाई के अंत में छात्र के सीखने को मापने के लिए उपयोग किए जाने वाले मूल्यांकन (जैसे, अंतिम परीक्षा)।"
    },
    { 
      term: "Positive Reinforcement", 
      termHi: "सकारात्मक सुदृढ़ीकरण", 
      definition: "The addition of a reinforcing stimulus following a behavior that makes it more likely that the behavior will occur again.",
      defHi: "व्यवहार के बाद एक सुदृढ़ीकरण उत्तेजना जोड़ना जो उस व्यवहार के दोबारा होने की संभावना को बढ़ाता है।"
    },
    { 
      term: "Negative Reinforcement", 
      termHi: "नकारात्मक सुदृढ़ीकरण", 
      definition: "The removal of an unpleasant stimulus after a behavior to increase the likelihood of that behavior repeating.",
      defHi: "व्यवहार के बाद एक अप्रिय उत्तेजना को हटाना ताकि उस व्यवहार के दोहराने की संभावना बढ़ सके।"
    },
    { 
      term: "Discovery Learning", 
      termHi: "खोजपूर्ण अधिगम", 
      definition: "An inquiry-based learning method where students interact with their environment to discover principles.",
      defHi: "एक पूछताछ-आधारित सीखने की विधि जहां छात्र सिद्धांतों की खोज करने के लिए अपने पर्यावरण के साथ बातचीत करते हैं।"
    },
    { 
      term: "Egocentrism", 
      termHi: "अहंकेंद्रिता", 
      definition: "A child's inability to see a situation from another person's point of view (common in Piaget's pre-operational stage).",
      defHi: "किसी स्थिति को दूसरे व्यक्ति के दृष्टिकोण से देखने में बच्चे की अक्षमता (पियाजे के पूर्व-संक्रियात्मक चरण में सामान्य)।"
    },
    { 
      term: "Assimilation", 
      termHi: "आत्मसातीकरण", 
      definition: "The process of taking in new information into our already existing schemas.",
      defHi: "नयी जानकारी को हमारी पहले से मौजूद मानसिक संरचनाओं (schemas) में लेने की प्रक्रिया।"
    },
    { 
      term: "Accommodation", 
      termHi: "समायोजन", 
      definition: "Modifying existing schemas, or ideas, as a result of new information or new experiences.",
      defHi: "नई जानकारी या नए अनुभवों के परिणामस्वरूप मौजूदा स्कीमा या विचारों को संशोधित करना।"
    },
    { 
      term: "Crystallized Intelligence", 
      termHi: "ठोस बुद्धि", 
      definition: "The ability to use learned knowledge and experience (increases with age).",
      defHi: "सीखे गए ज्ञान और अनुभव का उपयोग करने की क्षमता (उम्र के साथ बढ़ती है)।"
    },
    { 
      term: "Fluid Intelligence", 
      termHi: "तरल बुद्धि", 
      definition: "The ability to solve new problems, use logic in new situations, and identify patterns (decreases with age).",
      defHi: "नई समस्याओं को हल करने, नई स्थितियों में तर्क का उपयोग करने और पैटर्न की पहचान करने की क्षमता (उम्र के साथ घटती है)।"
    },
    { 
      term: "Spiral Curriculum", 
      termHi: "सर्पिल पाठ्यक्रम", 
      definition: "Jerome Bruner's idea that subjects should be revisited at increasing levels of difficulty.",
      defHi: "जेरोम ब्रूनर का विचार कि विषयों को कठिनाई के बढ़ते स्तरों पर दोबारा दोहराया जाना चाहिए।"
    }
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
              <h3 className="text-3xl font-black text-[var(--text-primary)] leading-tight">{cards[currentIndex].term}</h3>
              <div className="h-px w-12 bg-slate-200 dark:bg-white/10 my-4" />
              <h3 className="text-2xl font-bold text-[var(--text-secondary)] tracking-tight">{cards[currentIndex].termHi}</h3>
              <div className="mt-8 text-xs font-bold text-slate-500 uppercase tracking-widest animate-bounce">Tap to Flip 🔄</div>
            </div>
            
            {/* Back */}
            <div className="absolute w-full h-full backface-hidden rotate-y-180 glass-card flex flex-col items-center justify-center p-8 text-center border-2 border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400 mb-2 block opacity-80">English</span>
                  <p className="text-sm font-bold text-[var(--text-primary)] leading-relaxed italic">
                    "{cards[currentIndex].definition}"
                  </p>
                </div>
                <div className="h-px w-full bg-slate-200 dark:bg-white/5" />
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-600 dark:text-sky-400 mb-2 block opacity-80">Hindi / हिंदी</span>
                  <p className="text-sm font-bold text-[var(--text-primary)] leading-relaxed italic">
                    "{cards[currentIndex].defHi}"
                  </p>
                </div>
              </div>
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
