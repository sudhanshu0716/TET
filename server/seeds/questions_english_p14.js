const { v4: uuidv4 } = require('uuid');
const Q = (l,s,t,o,a,src,yr) => ({question_id:uuidv4(),level:l,subject:s,question_text:t,options:o,correct_answer:a,source:src,year:yr,created_at:new Date()});

module.exports = [
Q('primary','english','Choose the correct spelling:',['Believe','Beleeve','Belive','Believee'],'Believe','UPTET Practice',2026),
Q('primary','english','What is the past participle of "Speak"?',['Spoken','Spoke','Speaks','Speaking'],'Spoken','CTET Practice',2026),
Q('primary','english','Identify the pronoun in: "They went to the market."',['They','went','market','to'],'They','UPTET Practice',2026),
Q('primary','english','Choose the synonym of "Courage":',['Bravery','Fear','Sadness','Anger'],'Bravery','CTET Practice',2026),
Q('primary','english','Fill in: The book is ____ the table.',['on','in','at','into'],'on','UPTET Practice',2026),
Q('junior','english','What is the meaning of the phrase "Piece of cake"?',['Very easy','Very hard','A small portion','Sweet taste'],'Very easy','CTET Practice',2026),
Q('junior','english','Choose the correct passive voice: "They are playing football."',['Football is being played by them.','Football was played by them.','Football is played by them.','Football has been played by them.'],'Football is being played by them.','UPTET Practice',2026),
Q('junior','english','Identify the synonym of "Benevolent":',['Kind','Cruel','Selfish','Greedy'],'Kind','CTET Practice',2026),
Q('junior','english','Identify the antonym of "Transient":',['Permanent','Temporary','Short','Brief'],'Permanent','UPTET Practice',2026),
Q('junior','english','Complete the sentence: He is too weak ____ walk.',['to','for','at','in'],'to','CTET Practice',2026),
];
