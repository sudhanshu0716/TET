const { v4: uuidv4 } = require('uuid');
const Q = (l,s,t,o,a,src,yr) => ({question_id:uuidv4(),level:l,subject:s,question_text:t,options:o,correct_answer:a,source:src,year:yr,created_at:new Date()});

module.exports = [
Q('primary','english','Choose the correct synonym for the word "Magnificent":',['Splendid','Ordinary','Ugly','Weak'],'Splendid','UPTET Practice',2026),
Q('primary','english','Identify the antonym of the word "Humble":',['Proud','Modest','Polite','Gentle'],'Proud','CTET Practice',2026),
Q('primary','english','Fill in the blank: He has been working here ____ five years.',['for','since','from','during'],'for','UPTET Practice',2026),
Q('primary','english','Choose the correct spelling of the word:',['Necessary','Neccessary','Necesary','Necassary'],'Necessary','CTET Practice',2026),
Q('primary','english','Identify the noun type for the word "Honesty":',['Abstract Noun','Common Noun','Proper Noun','Collective Noun'],'Abstract Noun','UPTET Practice',2026),
Q('junior','english','Identify the figure of speech: "He is as brave as a lion."',['Simile','Metaphor','Personification','Hyperbole'],'Simile','CTET Practice',2026),
Q('junior','english','Which of the following is a synonym of "Reluctant"?',['Unwilling','Eager','Ready','Happy'],'Unwilling','UPTET Practice',2026),
Q('junior','english','Complete the sentence: If I had known, I ____ helped you.',['would have','will have','should','would'],'would have','CTET Practice',2026),
Q('junior','english','Change the sentence into passive voice: "She sang a beautiful song."',['A beautiful song was sung by her.','A beautiful song is sung by her.','A beautiful song had sung by her.','A beautiful song has been sung by her.'],'A beautiful song was sung by her.','UPTET Practice',2026),
Q('junior','english','Select the correct option to fill in: Neither of the two boys ____ present.',['was','were','are','have been'],'was','CTET Practice',2026),
];
