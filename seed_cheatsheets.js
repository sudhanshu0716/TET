const mongoose = require('./server/node_modules/mongoose');
require('dotenv').config({ path: './server/.env' });
const Cheatsheet = require('./server/models/Cheatsheet');

// Import modular seeds
const cdp = require('./server/seeds/cdp');
const hindi = require('./server/seeds/hindi');
const english = require('./server/seeds/english');
const evs = require('./server/seeds/evs');
const math = require('./server/seeds/math');
const sanskrit = require('./server/seeds/sanskrit');
const science = require('./server/seeds/science');
const social = require('./server/seeds/social');

// Combine all cheatsheets (10 per subject, 8 subjects = 80 total)
const cheatsheets = [
  ...cdp,
  ...hindi,
  ...english,
  ...evs,
  ...math,
  ...sanskrit,
  ...science,
  ...social
];

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in process.env");
    }
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected for Cheatsheet seeding');
    
    console.log('Deleting old cheatsheets...');
    await Cheatsheet.deleteMany({});
    
    console.log(`Inserting ${cheatsheets.length} new high-quality bilingual cheatsheets...`);
    await Cheatsheet.insertMany(cheatsheets);
    
    console.log('✅ Cheatsheets seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();
