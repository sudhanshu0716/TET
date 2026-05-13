const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });
const Cheatsheet = require('./server/models/Cheatsheet');

const cheatsheets = [
  {
    topic_id: 'cdp-theory-01',
    title: 'Jean Piaget: Cognitive Development',
    subject: 'pedagogy',
    category: 'Theory',
    level: 'both',
    content: `### 🧠 Piaget's 4 Stages of Development
1. **Sensorimotor (0-2 years)**: Object Permanence, Goal-directed behavior.
2. **Pre-operational (2-7 years)**: Ego-centrism, Animism, Centration.
3. **Concrete Operational (7-11 years)**: Conservation, Reversibility, Classification.
4. **Formal Operational (11+ years)**: Abstract thinking, Hypothetical reasoning.

**Key Terms**: Assimilation, Accommodation, Equilibration, Schema.`
  },
  {
    topic_id: 'cdp-theory-02',
    title: 'Lev Vygotsky: Social Constructivism',
    subject: 'pedagogy',
    category: 'Theory',
    level: 'both',
    content: `### 🤝 Social Development Theory
- **MKO (More Knowledgeable Other)**: Anyone with better understanding.
- **ZPD (Zone of Proximal Development)**: Distance between what a learner can do with help and without.
- **Scaffolding**: Temporary support provided by MKO.
- **Language**: Private speech is essential for cognitive development.`
  },
  {
    topic_id: 'evs-must-know-01',
    title: 'Major Festivals & States',
    subject: 'evs',
    category: 'GK',
    level: 'primary',
    content: `### 🎊 Important Cultural Facts
- **Bihu**: Assam (Harvest festival)
- **Pongal**: Tamil Nadu
- **Onam**: Kerala
- **Chhath Puja**: Bihar
- **Lavani**: Maharashtra (Dance)`
  },
  {
    topic_id: 'hindi-grammar-01',
    title: 'संधि (Sandhi) Quick Rules',
    subject: 'hindi',
    category: 'Grammar',
    level: 'both',
    content: `### ✍️ संधि के मुख्य प्रकार
1. **स्वर संधि**: दो स्वरों का मेल (e.g., विद्या + अर्थी = विद्यार्थी)
2. **व्यंजन संधि**: व्यंजन का स्वर या व्यंजन से मेल.
3. **विसर्ग संधि**: विसर्ग का मेल.

**याद रखें**: दीर्घ, गुण, वृद्धि, यण, और अयादि स्वर संधि के भेद हैं.`
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected for Cheatsheet seeding');
    
    await Cheatsheet.deleteMany({});
    await Cheatsheet.insertMany(cheatsheets);
    
    console.log('✅ Cheatsheets seeded successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
