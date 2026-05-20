const { v4: uuidv4 } = require('uuid');
const Q = (l,s,t,o,a,src,yr) => ({question_id:uuidv4(),level:l,subject:s,question_text:t,options:o,correct_answer:a,source:src,year:yr,created_at:new Date()});

module.exports = [
Q('primary','math','एक वृत्त की त्रिज्या 7 सेमी है। इसका क्षेत्रफल क्या होगा? (π = 22/7)',['154 वर्ग सेमी','44 वर्ग सेमी','308 वर्ग सेमी','77 वर्ग सेमी'],'154 वर्ग सेमी','UPTET Practice',2026),
Q('primary','math','संख्या 1/2 + 1/3 का मान क्या होगा?',['5/6','2/5','1/5','2/3'],'5/6','CTET Practice',2026),
Q('primary','math','यदि एक समबाहु त्रिभुज (Equilateral Triangle) की भुजा 6 सेमी है, तो इसका क्षेत्रफल क्या होगा?',['9√3 वर्ग सेमी','36 वर्ग सेमी','18√3 वर्ग सेमी','12 वर्ग सेमी'],'9√3 वर्ग सेमी','UPTET Practice',2026),
Q('primary','math','0.005 का प्रतिशत में मान क्या होगा?',['0.5%','5%','0.05%','50%'],'0.5%','CTET Practice',2026),
Q('primary','math','35, 45, 55, 65, 75 का समांतर माध्य (Mean) क्या होगा?',['55','50','60','45'],'55','UPTET Practice',2026),
Q('junior','math','यदि x^2 - 5x + 6 = 0 है, तो x के मूल (Roots) क्या होंगे?',['2, 3','-2, -3','1, 6','-1, -6'],'2, 3','CTET Practice',2026),
Q('junior','math','एक घन का आयतन 216 घन सेमी है। इसकी एक भुजा की लंबाई क्या होगी?',['6 सेमी','8 सेमी','12 सेमी','4 सेमी'],'6 सेमी','UPTET Practice',2026),
Q('junior','math','यदि tan A = 4/3 है, तो sin A का मान क्या होगा?',['4/5','3/5','5/4','5/3'],'4/5','CTET Practice',2026),
Q('junior','math','प्रथम 5 अभाज्य संख्याओं का योगफल क्या होगा?',['28','26','18','30'],'28','UPTET Practice',2026),
Q('junior','math','यदि किसी संख्या का वर्ग 625 है, तो उस संख्या का घनमूल (Cube Root of the number) क्या होगा?',['5 (since number is 25)','25','125','15'],'5 (since number is 25)','CTET Practice',2026),
];
