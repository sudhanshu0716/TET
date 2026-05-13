const mongoose = require('mongoose');
const { scrapeWebsite } = require('./webScraper');
const Question = require('../models/Question');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Add your website sources here.
 * url: The website to scrape.
 * metadata: Info to categorize the scraped questions.
 */
const SOURCES = [
  // Surefire Source - Simple and effective
  {
    url: 'https://www.jagranjosh.com/articles/ctet-cdp-practice-questions-1518175544-1',
    metadata: { level: 'primary', subject: 'pedagogy', source: 'Jagran Easy CDP' }
  },
  // BYJU'S Exam Prep - Very reliable
  {
    url: 'https://byjusexamprep.com/ctet-environmental-studies-questions-answers-i-a886a870-7613-11e7-8b5d-9b59e663365a',
    metadata: { level: 'primary', subject: 'evs', source: 'BYJU CTET EVS' }
  },
  // Testbook - High Quality
  {
    url: 'https://testbook.com/ctet/child-development-and-pedagogy-questions',
    metadata: { level: 'primary', subject: 'pedagogy', source: 'Testbook Pedagogy' }
  },
  // Jagran Josh - Verified active pages
  {
    url: 'https://www.jagranjosh.com/articles/ctet-science-pedagogy-mcqs-solved-1555581977-1',
    metadata: { level: 'junior', subject: 'science', source: 'Jagran Science' }
  },
  {
    url: 'https://www.jagranjosh.com/articles/ctet-social-studies-mcqs-solved-1555581977-1',
    metadata: { level: 'junior', subject: 'social', source: 'Jagran Social' }
  }
];

async function automate() {
  try {
    // If not already connected, connect to DB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to DB for automation');
    }

    for (let i = 0; i < SOURCES.length; i++) {
      const source = SOURCES[i];
      console.log(`[${i + 1}/${SOURCES.length}] 🔄 Scraping: ${source.metadata.source}...`);
      
      const questions = await scrapeWebsite(source.url, source.metadata);
      
      if (questions.length > 0) {
        let newCount = 0;
        for (const q of questions) {
          const exists = await Question.findOne({ question_text: q.question_text });
          if (!exists) {
            await new Question(q).save();
            newCount++;
          }
        }
        console.log(`✅ Finished ${source.metadata.source}: Added ${newCount} new questions.`);
      } else {
        console.log(`⚠️  Warning: No questions found at ${source.metadata.source}.`);
      }
    }

    const finalCount = await Question.countDocuments();
    console.log(`🚀 Automation task completed! Total questions in DB: ${finalCount}`);
  } catch (err) {
    console.error('Automation task failed:', err);
    throw err;
  }
}

// Run if executed directly
if (require.main === module) {
  automate().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = { automate };
