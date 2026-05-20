const { v4: uuidv4 } = require('uuid');
const Q = (l,s,t,o,a,src,yr) => ({question_id:uuidv4(),level:l,subject:s,question_text:t,options:o,correct_answer:a,source:src,year:yr,created_at:new Date()});

module.exports = [
Q('primary','english','Choose the antonym of "Beautiful":',['Ugly','Pretty','Attractive','Nice'],'Ugly','UPTET Practice',2026),
Q('primary','english','Choose the correct article: He is ____ IAS officer.',['an','a','the','no article'],'an','CTET Practice',2026),
Q('primary','english','Choose the plural of "Child":',['Children','Childs','Childrens','Childes'],'Children','UPTET Practice',2026),
Q('primary','english','Choose the synonym of "Huge":',['Large','Tiny','Small','Short'],'Large','CTET Practice',2026),
Q('primary','english','Fill in: She lives ____ New Delhi.',['in','at','on','into'],'in','UPTET Practice',2026),
Q('junior','english','Choose the correct synonym of "Loquacious":',['Talkative','Silent','Smart','Sad'],'Talkative','CTET Practice',2026),
Q('junior','english','Choose the correct spelling:',['Lieutenant','Leutenant','Lieutanant','Lutenant'],'Lieutenant','UPTET Practice',2026),
Q('junior','english','Identify the sentence in passive voice:',['The house was built by him.','He built the house.','He is building the house.','He will build the house.'],'The house was built by him.','CTET Practice',2026),
Q('junior','english','Identify the antonym of "Nadir":',['Zenith','Bottom','Base','Deep'],'Zenith','UPTET Practice',2026),
Q('junior','english','Identify the part of speech of "under" in: "The cat is under the table."',['Preposition','Adverb','Noun','Conjunction'],'Preposition','CTET Practice',2026),
];
