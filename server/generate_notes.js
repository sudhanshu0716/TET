const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { v4: uuidv4 } = require('uuid');
const Question = require('./models/Question');
const Cheatsheet = require('./models/Cheatsheet');

async function generateNotes() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('🟢 Connected to Database for Notes Generation');

  const subjects = ['pedagogy', 'evs', 'math', 'science', 'social', 'hindi', 'english'];
  const languages = ['hindi', 'english'];

  // Delete all previously auto-generated notes to avoid clutter
  await Cheatsheet.deleteMany({ category: 'Auto-Generated Revision' });

  for (const subject of subjects) {
    for (const language of languages) {
      // Find up to 100 questions for this subject/language
      const questions = await Question.find({ subject, language }).limit(100);
      if (questions.length === 0) continue;

      let content = `### 🌟 High-Yield Concepts & Explanations\n\n`;
      const explQs = questions.filter(q => q.explanation && q.explanation.length > 5).slice(0, 50);
      
      explQs.forEach((q, i) => {
        const correctOptIndex = ['A', 'B', 'C', 'D'].indexOf(q.correct_answer);
        let answerText = q.correct_answer;
        if (correctOptIndex !== -1 && q.options && q.options.length > correctOptIndex) {
          answerText = q.options[correctOptIndex];
        }
        
        content += `**${i+1}. ${q.question_text}**\n`;
        content += `> **✅ ${language === 'hindi' ? 'उत्तर' : 'Answer'}:** ${answerText}\n`;
        content += `> **💡 ${language === 'hindi' ? 'तथ्य' : 'Concept'}:** ${q.explanation}\n\n`;
      });

      let shortContent = `\n### ⚡ Quick One-Liners\n\n`;
      const shortQs = questions.filter(q => !q.explanation || q.explanation.length <= 5).slice(0, 50);
      shortQs.forEach((q) => {
        const correctOptIndex = ['A', 'B', 'C', 'D'].indexOf(q.correct_answer);
        let answerText = q.correct_answer;
        if (correctOptIndex !== -1 && q.options && q.options.length > correctOptIndex) {
          answerText = q.options[correctOptIndex];
        }
        shortContent += `* **Q:** ${q.question_text}\n  * **A:** ${answerText}\n`;
      });

      const finalContent = content + shortContent;
      
      let title = language === 'hindi' 
        ? `${subject.toUpperCase()} - सम्पूर्ण रिवीजन नोट्स` 
        : `${subject.toUpperCase()} - Master Revision Notes`;

      const newCheatsheet = new Cheatsheet({
        topic_id: uuidv4(),
        title: title,
        subject: subject,
        category: 'Auto-Generated Revision',
        level: 'both',
        content: finalContent
      });

      await newCheatsheet.save();
      console.log(`✅ Generated ${language} Master Notes for ${subject}`);
    }
  }

  console.log('🎉 All Cheatsheets Generated Successfully!');
  process.exit();
}

generateNotes();
