const { v4: uuidv4 } = require('uuid');
const Q = (l,s,t,o,a,src,yr) => ({question_id:uuidv4(),level:l,subject:s,question_text:t,options:o,correct_answer:a,source:src,year:yr,created_at:new Date()});

module.exports = [
Q('primary','english','Choose the correct preposition: She is afraid ____ spiders.',['of','from','by','with'],'of','UPTET Practice',2026),
Q('primary','english','What is the feminine gender of "Monk"?',['Nun','Priestess','Lady','Mother'],'Nun','CTET Practice',2026),
Q('primary','english','Choose the correct synonym of "Peculiar":',['Strange','Common','Simple','Normal'],'Strange','UPTET Practice',2026),
Q('primary','english','Fill in: Five miles ____ a long distance to walk.',['is','are','were','have been'],'is','CTET Practice',2026),
Q('primary','english','Choose the correct spelling:',['Receive','Recieve','Receeve','Recive'],'Receive','UPTET Practice',2026),
Q('junior','english','Identify the clause in red: "The boy *who won the race* is my cousin."',['Adjective Clause','Noun Clause','Adverb Clause','Principal Clause'],'Adjective Clause','CTET Practice',2026),
Q('junior','english','What is the synonym of "Apathy"?',['Indifference','Sympathy','Empathy','Anger'],'Indifference','UPTET Practice',2026),
Q('junior','english','What is the antonym of "Ambiguous"?',['Clear','Vague','Obscure','Uncertain'],'Clear','CTET Practice',2026),
Q('junior','english','Change the voice: "Do not spit on the floor."',['You are forbidden to spit on the floor.','Let floor not be spitted on.','Let the floor not spit.','Do not spit on the floor.'],'You are forbidden to spit on the floor.','UPTET Practice',2026),
Q('junior','english','Identify the parts of speech for "brave" in: "He is a brave soldier."',['Adjective','Noun','Pronoun','Verb'],'Adjective','CTET Practice',2026),
];
