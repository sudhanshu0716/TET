const mongoose = require('mongoose');
const Cheatsheet = require('./models/Cheatsheet');
require('dotenv').config();

const cheatsheets = [
  // CDP / Pedagogy
  { topic_id: "CDP_001", subject: "pedagogy", title: "Piaget's Cognitive Development", category: "Psychology", content: "1. Sensorimotor (0-2y): Object permanence.\n2. Pre-operational (2-7y): Egocentrism, Animism.\n3. Concrete Operational (7-11y): Conservation, Reversibility.\n4. Formal Operational (11y+): Abstract thinking.", difficulty: "Medium" },
  { topic_id: "CDP_002", subject: "pedagogy", title: "Vygotsky: ZPD & Scaffolding", category: "Psychology", content: "ZPD: Gap between what a learner can do alone and with help.\nScaffolding: Temporary support provided by MKO.\nSocial Interaction: Language is key for cognitive development.", difficulty: "Hard" },
  { topic_id: "CDP_003", subject: "pedagogy", title: "Kohlberg's Moral Development", category: "Psychology", content: "1. Pre-conventional: Punishment/Obedience.\n2. Conventional: Law & Order.\n3. Post-conventional: Social Contract, Universal Ethics.", difficulty: "Hard" },
  { topic_id: "CDP_004", subject: "pedagogy", title: "Bloom's Taxonomy", category: "Education", content: "Revised Taxonomy: Remembering, Understanding, Applying, Analyzing, Evaluating, Creating.", difficulty: "Medium" },
  { topic_id: "CDP_005", subject: "pedagogy", title: "Inclusive Education", category: "Philosophy", content: "Teaching all students together, regardless of challenges. Focus on equity, accessibility, and individualized support.", difficulty: "Easy" },

  // Hindi
  { topic_id: "HIN_001", subject: "hindi", title: "संधि के प्रकार (Sandhi)", category: "Grammar", content: "1. स्वर संधि: स्वरों का मेल।\n2. व्यंजन संधि: व्यंजन + स्वर/व्यंजन।\n3. विसर्ग संधि: विसर्ग + स्वर/व्यंजन।", difficulty: "Medium" },
  { topic_id: "HIN_002", subject: "hindi", title: "समास (Samas)", category: "Grammar", content: "1. अव्ययीभाव: प्रथम पद प्रधान।\n2. तत्पुरुष: उत्तर पद प्रधान।\n3. द्वंद्व: दोनों पद प्रधान।\n4. बहुव्रीहि: अन्य पद प्रधान।", difficulty: "Medium" },
  { topic_id: "HIN_003", subject: "hindi", title: "अलंकार (Alankar)", category: "Poetry", content: "1. अनुप्रास: वर्ण की आवृत्ति।\n2. यमक: शब्द की आवृत्ति, अर्थ भिन्न।\n3. उपमा: तुलना।\n4. रूपक: अभेद आरोप।", difficulty: "Hard" },

  // English
  { topic_id: "ENG_001", subject: "english", title: "Parts of Speech", category: "Grammar", content: "Noun, Pronoun, Verb, Adjective, Adverb, Preposition, Conjunction, Interjection.", difficulty: "Easy" },
  { topic_id: "ENG_002", subject: "english", title: "Figures of Speech", category: "Literature", content: "Simile (Comparison using like/as), Metaphor (Direct comparison), Personification (Human traits to objects).", difficulty: "Medium" },
  { topic_id: "ENG_003", subject: "english", title: "Active & Passive Voice", category: "Grammar", content: "Active: Subject does action (He eats an apple). Passive: Subject receives action (An apple is eaten by him).", difficulty: "Medium" },

  // EVS
  { topic_id: "EVS_001", subject: "evs", title: "National Parks of India", category: "Geography", content: "Jim Corbett (UK), Kaziranga (Assam), Gir (Gujarat), Kanha (MP), Sundarbans (WB).", difficulty: "Easy" },
  { topic_id: "EVS_002", subject: "evs", title: "Layers of Atmosphere", category: "Science", content: "Troposphere (Weather), Stratosphere (Ozone), Mesosphere (Meteorites), Thermosphere (Radio), Exosphere (Outer).", difficulty: "Medium" },
  { topic_id: "EVS_003", subject: "evs", title: "Water Cycle", category: "Science", content: "Evaporation -> Condensation -> Precipitation -> Collection.", difficulty: "Easy" },

  // Math
  { topic_id: "MAT_001", subject: "math", title: "Number Systems", category: "Arithmetic", content: "Natural (1,2,3), Whole (0,1,2), Integers (...,-1,0,1,...), Rational (p/q form), Irrational (sqrt 2, pi).", difficulty: "Easy" },
  { topic_id: "MAT_002", subject: "math", title: "Van Hiele Levels", category: "Pedagogy", content: "L0: Visualization, L1: Analysis, L2: Informal Deduction, L3: Deduction, L4: Rigor.", difficulty: "Hard" },
  { topic_id: "MAT_003", subject: "math", title: "Divisibility Rules", category: "Arithmetic", content: "2: Even digit at end.\n3: Sum of digits div by 3.\n5: Ends in 0 or 5.\n9: Sum of digits div by 9.", difficulty: "Medium" },

  // Social / Science
  { topic_id: "SOC_001", subject: "social", title: "Indian Constitution", category: "Polity", content: "Adopted: Nov 26, 1949. Enforced: Jan 26, 1950. Fundamental Rights: Articles 12-35.", difficulty: "Hard" },
  { topic_id: "SCI_001", subject: "science", title: "Human Digestive System", category: "Biology", content: "Mouth (Amylase) -> Esophagus -> Stomach (HCl) -> Small Intestine (Absorption) -> Large Intestine.", difficulty: "Medium" }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB for Super-Seeding Cheatsheets...');
    await Cheatsheet.deleteMany({});
    await Cheatsheet.insertMany(cheatsheets);
    console.log('Super-Seeded ' + cheatsheets.length + ' Notes successfully!');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
