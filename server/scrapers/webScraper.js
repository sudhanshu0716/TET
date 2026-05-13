const axios = require('axios');
const cheerio = require('cheerio');
const { v4: uuidv4 } = require('uuid');

/**
 * Scrapes an educational website for past paper questions.
 */
async function scrapeWebsite(url, metadata = {}) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const $ = cheerio.load(data);
    const questions = [];

    // Strategy 1: Look for bold tags followed by options (Very common for Jagran/GKToday)
    $('strong, b, h3').each((i, el) => {
      const text = $(el).text().trim();
      // Match "Q1." or "1." at start
      if (/^(?:Q\d+|[0-9]+\.)/i.test(text)) {
        let qText = text.replace(/^(?:Q\d+|[0-9]+\.)[\s\.]*/i, '');
        let options = [];
        let correctAnswer = 'A';

        // Look at next few paragraphs for options
        let next = $(el).parent().next();
        for (let j = 0; j < 6; j++) {
          if (!next.length) break;
          const nextText = next.text().trim();
          
          // Match options like (a) or A.
          const optMatches = nextText.match(/^[a-d][\)\.]\s*(.*)/i);
          if (optMatches) {
            options.push(optMatches[1]);
          } else if (nextText.toLowerCase().includes('ans') || nextText.toLowerCase().includes('correct')) {
            const ansMatch = nextText.match(/(?:ans|correct)[:\s]+([a-d])/i);
            if (ansMatch) correctAnswer = ansMatch[1].toUpperCase();
          }
          next = next.next();
        }

        if (qText && options.length >= 2) {
          // Fill up to 4 options if missing
          while(options.length < 4) options.push('None of the above');
          
          questions.push({
            question_id: uuidv4(),
            ...metadata,
            question_text: qText,
            options: options.slice(0, 4),
            correct_answer: correctAnswer,
            source: metadata.source || url,
            created_at: new Date()
          });
        }
      }
    });

    // Strategy 3: Hardcore Fallback - Clean all style/script and search for patterns
    if (questions.length === 0) {
      // Remove style and script tags to prevent them from interfering
      $('style, script').remove();
      const bodyText = $('body').text().replace(/\s\s+/g, '\n');
      
      // Look for lines that look like questions followed by A, B, C, D
      const lines = bodyText.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.includes('?') && line.length > 20) {
          let options = [];
          // Look at next 10 lines for A, B, C, D
          for (let k = 1; k < 10; k++) {
            if (i + k >= lines.length) break;
            const nextLine = lines[i+k].trim();
            if (/^[a-d][\)\.]/i.test(nextLine)) {
              options.push(nextLine.replace(/^[a-d][\)\.]\s*/i, ''));
            }
            if (options.length === 4) break;
          }

          if (options.length >= 2) {
            while(options.length < 4) options.push('None of the above');
            questions.push({
              question_id: uuidv4(),
              ...metadata,
              question_text: line,
              options: options.slice(0, 4),
              correct_answer: 'A',
              source: metadata.source || url,
              created_at: new Date()
            });
          }
        }
      }
    }

    return questions;
  } catch (err) {
    console.error(`Error scraping ${url}:`, err.message);
    return [];
  }
}

module.exports = { scrapeWebsite };
