const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const count = await mongoose.connection.db.collection('questions').countDocuments();
    console.log('--- DATABASE VERIFICATION ---');
    console.log('Total Questions in MongoDB:', count);
    console.log('----------------------------');
    process.exit(0);
  } catch (err) {
    console.error('Connection Failed:', err.message);
    process.exit(1);
  }
}
check();
