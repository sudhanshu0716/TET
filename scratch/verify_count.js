const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const count = await mongoose.connection.db.collection('questions').countDocuments();
  console.log('PROGRAMMATIC_COUNT_REPORT:', count);
  process.exit();
}
check();
