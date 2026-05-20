require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;

  // Simulate the EXACT daily exam query (primary level, hindi L1, english L2)
  const pedagogy = await db.collection('questions').aggregate([
    { $match: { subject: 'pedagogy', level: 'primary', language: 'hindi' } },
    { $sample: { size: 6 } }
  ]).toArray();

  const hindi = await db.collection('questions').aggregate([
    { $match: { subject: 'hindi', level: 'primary', language: 'hindi' } },
    { $sample: { size: 6 } }
  ]).toArray();

  const english = await db.collection('questions').aggregate([
    { $match: { subject: 'english', level: 'primary', language: 'hindi' } },
    { $sample: { size: 6 } }
  ]).toArray();

  const math = await db.collection('questions').aggregate([
    { $match: { subject: 'math', level: 'primary', language: 'hindi' } },
    { $sample: { size: 6 } }
  ]).toArray();

  const evs = await db.collection('questions').aggregate([
    { $match: { subject: 'evs', level: 'primary', language: 'hindi' } },
    { $sample: { size: 6 } }
  ]).toArray();

  const all = [...pedagogy, ...hindi, ...english, ...math, ...evs];
  console.log('\n=== DAILY EXAM VERIFICATION ===');
  console.log('Total questions fetched:', all.length);

  // Count by year
  const byYear = {};
  all.forEach(q => { byYear[q.year || 'unknown'] = (byYear[q.year || 'unknown'] || 0) + 1; });
  console.log('\nYear breakdown:');
  Object.entries(byYear).sort().forEach(([y, c]) => console.log(`  ${y}: ${c} questions`));

  // Show how many are from the NEW 2026 bank
  const new2026 = all.filter(q => q.year === 2026);
  const realYear = all.filter(q => q.year && q.year !== 2026);
  console.log(`\n✅ New practice questions (year=2026): ${new2026.length}`);
  console.log(`📅 Real past-year questions: ${realYear.length}`);
  console.log('\nSample questions:');
  all.slice(0, 5).forEach(q => {
    console.log(`  [${q.subject.toUpperCase()} ${q.year}] ${q.question_text.substring(0, 60)}...`);
  });

  // Also verify total counts per subject
  console.log('\n=== TOTAL DB COUNTS PER SUBJECT ===');
  const subjects = ['pedagogy', 'hindi', 'english', 'math', 'evs', 'science', 'social', 'sanskrit', 'urdu'];
  for (const s of subjects) {
    const count = await db.collection('questions').countDocuments({ subject: s });
    console.log(`  ${s}: ${count}`);
  }

  process.exit(0);
});
