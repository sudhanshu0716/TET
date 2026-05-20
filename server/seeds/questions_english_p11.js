const { v4: uuidv4 } = require('uuid');
const Q = (l,s,t,o,a,src,yr) => ({question_id:uuidv4(),level:l,subject:s,question_text:t,options:o,correct_answer:a,source:src,year:yr,created_at:new Date()});

module.exports = [
Q('primary','english','What is the plural of the word "Knife"?',['Knives','Knifes','Knifess','Knife'],'Knives','UPTET Practice',2026),
Q('primary','english','Choose the correct article: Iron is ____ useful metal.',['a','an','the','no article'],'a','CTET Practice',2026),
Q('primary','english','Identify the adverb in the sentence: "She ran quickly to the door."',['quickly','ran','door','to'],'quickly','UPTET Practice',2026),
Q('primary','english','What is the past tense of the verb "Go"?',['Went','Gone','Going','Goes'],'Went','CTET Practice',2026),
Q('primary','english','Choose the correct pronoun: Every student should bring ____ own book.',['his','their','our','they'],'his','UPTET Practice',2026),
Q('junior','english','Identify the error in: "The sceneries of Kashmir are very beautiful."',['sceneries','are','beautiful','Kashmir'],'sceneries','CTET Practice',2026),
Q('junior','english','Which word is the antonym of "Barren"?',['Fertile','Dry','Empty','Harsh'],'Fertile','UPTET Practice',2026),
Q('junior','english','Identify the passive voice of: "Who wrote this book?"',['By whom was this book written?','Who has written this book?','This book is written by whom?','Whom wrote this book?'],'By whom was this book written?','CTET Practice',2026),
Q('junior','english','Choose the correct spelling:',['Curriculum','Curiculum','Curricullum','Curicullum'],'Curriculum','UPTET Practice',2026),
Q('junior','english','Complete the idiom: "A blessing in ____"',['disguise','hiding','mask','pain'],'disguise','CTET Practice',2026),
];
