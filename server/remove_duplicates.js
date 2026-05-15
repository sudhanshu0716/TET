const mongoose = require('mongoose');
require('dotenv').config({path: '.env'});
const Question = require('./models/Question');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected to DB. Finding duplicates...');
  const duplicates = await Question.aggregate([
    { $group: { _id: '$question_text', count: { $sum: 1 }, docs: { $push: '$_id' } } },
    { $match: { count: { $gt: 1 } } }
  ]);
  
  let idsToDelete = [];
  duplicates.forEach(dup => {
    // Keep the first document, mark the rest for deletion
    const [, ...rest] = dup.docs; 
    idsToDelete = idsToDelete.concat(rest);
  });
  
  console.log(`Found ${duplicates.length} question texts with duplicates.`);
  console.log(`Total duplicate documents to delete: ${idsToDelete.length}`);
  
  if (idsToDelete.length > 0) {
    const result = await Question.deleteMany({ _id: { $in: idsToDelete } });
    console.log(`✅ Successfully deleted ${result.deletedCount} duplicate questions.`);
  } else {
    console.log('No duplicates found to delete.');
  }
  
  process.exit(0);
}).catch(err => {
  console.error('Error during cleanup:', err);
  process.exit(1);
});
