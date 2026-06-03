const Question = require('../models/Question');
const Cheatsheet = require('../models/Cheatsheet');

const linkQuestionsToCheatsheets = async () => {
  try {
    const topicsRules = [
      {
        topic_id: "cdp-theory-01",
        keywords: ["piaget", "पियाजे", "schema", "स्कीमा", "assimilation", "आत्मीकरण", "accommodation", "समायोजन", "egocentrism", "अहंकेंद्रित", "sensorimotor", "concrete operational", "formal operational"]
      },
      {
        topic_id: "hin-grammar-01",
        keywords: ["संधि", "sandhi", "दीर्घ स्वर", "गुण स्वर", "वृद्धि स्वर", "यण स्वर", "अयादि स्वर"]
      },
      {
        topic_id: "eng-lit-01",
        keywords: ["simile", "metaphor", "personification", "alliteration", "hyperbole", "figure of speech"]
      },
      {
        topic_id: "evs-eco-01",
        keywords: ["ecosystem", "food chain", "trophic", "ecology", "पारिस्थितिकी", "खाद्य श्रृंखला", "जैविक", "अजैविक"]
      },
      {
        topic_id: "mat-geom-01",
        keywords: ["van hiele", "वैन हीले", "geometric thought", "ज्यामितीय चिंतन", "geometry", "ज्यामिति"]
      },
      {
        topic_id: "san-grammar-01",
        keywords: ["माहेश्वर सूत्र", "प्रत्याहार", "महेश्वर"]
      },
      {
        topic_id: "sci-bio-01",
        keywords: ["digestive", "digestion", "enzyme", "trypsin", "pepsin", "amylase", "lipase", "पाचन", "एंजाइम"]
      },
      {
        topic_id: "soc-polity-01",
        keywords: ["fundamental rights", "article", "मौलिक अधिकार", "अनुच्छेद", "समानता का अधिकार", "स्वतंत्रता का अधिकार"]
      }
    ];

    console.log('--- STARTING DYNAMIC TOPIC LINKER ---');
    for (const rule of topicsRules) {
      // Create regex matching list for all keywords
      const regexList = rule.keywords.map(kw => new RegExp(kw, 'i'));
      
      const questions = await Question.find({
        $or: [
          { question_text: { $in: regexList } },
          { options: { $in: regexList } }
        ]
      }).select('question_id');

      const questionIds = questions.map(q => q.question_id);
      
      await Cheatsheet.updateOne(
        { topic_id: rule.topic_id },
        { $set: { linked_questions: questionIds } }
      );
      
      console.log(`Topic [${rule.topic_id}]: Linked ${questionIds.length} matching questions.`);
    }
    console.log('--- DYNAMIC TOPIC LINKER COMPLETE ---');
  } catch (err) {
    console.error('Dynamic Topic Linker Error:', err.message);
  }
};

module.exports = linkQuestionsToCheatsheets;
