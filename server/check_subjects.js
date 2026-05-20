const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const counts = await mongoose.connection.db.collection('questions').aggregate([
    { $match: { year: 2026 } },
    { $group: { _id: '$subject', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]).toArray();
  console.log('2026 questions counts by subject:');
  console.log(JSON.stringify(counts, null, 2));
  process.exit(0);
}
check();
