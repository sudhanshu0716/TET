const fs = require('fs');
const pdf = require('pdf-parse');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

/**
 * Extracts text from a PDF file or URL and parses it into Question objects.
 */
async function scrapePDF(pdfPath, metadata = {}) {
  try {
    let dataBuffer;
    
    if (pdfPath.startsWith('http')) {
      const response = await axios.get(pdfPath, { responseType: 'arraybuffer' });
      dataBuffer = Buffer.from(response.data);
    } else {
      dataBuffer = fs.readFileSync(pdfPath);
    }

    const data = await pdf(dataBuffer);
    const text = data.text;

    // Very basic parsing logic - this needs to be customized based on the PDF layout
    // Example: Looking for "Q1.", "Q2." etc.
    const questions = [];
    const questionBlocks = text.split(/Q\d+\./g).filter(block => block.trim().length > 0);

    for (const block of questionBlocks) {
      // Logic to extract question text, options, and correct answer
      // This is highly dependent on the source PDF format
      // For demonstration, we'll create a generic structure
      
      const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length < 5) continue;

      const questionText = lines[0];
      const options = lines.slice(1, 5);
      
      questions.push({
        question_id: uuidv4(),
        level: metadata.level || 'primary',
        subject: metadata.subject || 'pedagogy',
        question_text: questionText,
        options: options,
        correct_answer: options[0], // Placeholder: needs actual extraction logic
        source: metadata.source || 'Scraped PDF',
        created_at: new Date()
      });
    }

    return questions;
  } catch (err) {
    console.error('Error scraping PDF:', err);
    return [];
  }
}

module.exports = { scrapePDF };
