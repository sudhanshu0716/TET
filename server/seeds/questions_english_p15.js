const { v4: uuidv4 } = require('uuid');
const Q = (l,s,t,o,a,src,yr) => ({question_id:uuidv4(),level:l,subject:s,question_text:t,options:o,correct_answer:a,source:src,year:yr,created_at:new Date()});

module.exports = [
Q('primary','english','Choose the correct spelling:',['Tomorrow','Tommorow','Tomorow','Tommorrow'],'Tomorrow','UPTET Practice',2026),
Q('primary','english','What is the past participle of "Eat"?',['Eaten','Ate','Eating','Eats'],'Eaten','CTET Practice',2026),
Q('primary','english','Identify the adverb in: "He solved the puzzle easily."',['easily','solved','puzzle','He'],'easily','UPTET Practice',2026),
Q('primary','english','Choose the synonym of "Silent":',['Quiet','Noisy','Loud','Shouting'],'Quiet','CTET Practice',2026),
Q('primary','english','Fill in: The birds flew ____ the trees.',['over','under','at','in'],'over','UPTET Practice',2026),
Q('junior','english','What does the idiom "Spill the beans" mean?',['Reveal a secret','Drop the food','Make a mistake','Work hard'],'Reveal a secret','CTET Practice',2026),
Q('junior','english','Choose the correct passive voice: "Someone stole my pen."',['My pen was stolen.','My pen is stolen.','My pen has been stolen.','My pen was steal.'],'My pen was stolen.','UPTET Practice',2026),
Q('junior','english','Identify the synonym of "Jovial":',['Cheerful','Sad','Angry','Lazy'],'Cheerful','CTET Practice',2026),
Q('junior','english','Identify the antonym of "Amicable":',['Hostile','Friendly','Kind','Polite'],'Hostile','UPTET Practice',2026),
Q('junior','english','Complete the sentence: She is senior ____ me in office.',['to','than','from','with'],'to','CTET Practice',2026),
];
