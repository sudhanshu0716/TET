const mongoose = require('mongoose');
require('dotenv').config({path: '.env'});
const Question = require('./models/Question');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const duplicates = await Question.aggregate([
    { $group: { _id: '$question_text', count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } }
  ]);
  console.log('Found ' + duplicates.length + ' duplicated questions.');
  if (duplicates.length > 0) {
    console.log('Sample duplicate:', duplicates[0]._id);
  }
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
