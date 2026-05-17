const { v4: uuidv4 } = require('uuid');
const Q = (l,s,t,o,a,src,yr) => ({question_id:uuidv4(),level:l,subject:s,question_text:t,options:o,correct_answer:a,source:src,year:yr,created_at:new Date()});

module.exports = [
Q('primary','english','Identify the correct spelling of the following word:',['Accomodation','Accommodation','Acomodation','Accomodashun'],'Accommodation','CTET Practice',2024),
Q('primary','english','Choose the antonym of the word "Obvious":',['Clear','Vague','Plain','Evident'],'Vague','UPTET Practice',2024),
Q('primary','english','Fill in the blank with the correct preposition: She is good ____ languages.',['at','in','on','with'],'at','CTET Practice',2024),
Q('primary','english','What is the noun form of the verb "Educate"?',['Educational','Education','Educated','Educatively'],'Education','UPTET Practice',2024),
Q('primary','english','Identify the type of noun for the word "Team":',['Proper Noun','Common Noun','Collective Noun','Abstract Noun'],'Collective Noun','CTET Practice',2024),
Q('junior','english','Identify the figure of speech in: "The wind whispered through the trees."',['Metaphor','Simile','Personification','Onomatopoeia'],'Personification','UPTET Practice',2024),
Q('junior','english','Which of the following is a synonym of "Meticulous"?',['Careless','Thorough','Lazy','Messy'],'Thorough','CTET Practice',2024),
Q('junior','english','Complete the conditional sentence: If it rains, the match ____ postponed.',['will be','would be','is','has been'],'will be','UPTET Practice',2024),
Q('primary','english','Identify the adjective in the sentence: "He is a courageous soldier."',['He','is','courageous','soldier'],'courageous','CTET Practice',2024),
Q('primary','english','Select the correct passive voice for: "The boy caught the ball."',['The ball was caught by the boy','The ball is caught by the boy','The ball has caught by the boy','The ball was catch by the boy'],'The ball was caught by the boy','UPTET Practice',2024)
];
