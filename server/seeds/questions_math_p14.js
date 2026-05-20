const { v4: uuidv4 } = require('uuid');
const Q = (l,s,t,o,a,src,yr) => ({question_id:uuidv4(),level:l,subject:s,question_text:t,options:o,correct_answer:a,source:src,year:yr,created_at:new Date()});

module.exports = [
Q('primary','math','सबसे छोटी पूर्ण संख्या (Whole Number) कौन सी है?',['0','1','-1','कोई नहीं'],'0','UPTET Practice',2026),
Q('primary','math','1/3 को दशमलव रूप में लिखने पर क्या प्राप्त होगा?',['0.333...','0.3','0.03','0.34'],'0.333...','CTET Practice',2026),
Q('primary','math','एक समकोण त्रिभुज का आधार 3 सेमी और ऊंचाई 4 सेमी है। इसका कर्ण (Hypotenuse) क्या होगा?',['5 सेमी','7 सेमी','6 सेमी','25 सेमी'],'5 सेमी','UPTET Practice',2026),
Q('primary','math','यदि x/5 = 12 है, तो x का मान क्या होगा?',['60','17','7','2.4'],'60','CTET Practice',2026),
Q('primary','math','3, 5, 8, 12, 17, ? श्रेणी का अगला पद क्या होगा?',['23','22','24','21'],'23','UPTET Practice',2026),
Q('junior','math','एक गोले (Sphere) की त्रिज्या 3 सेमी है। इसका आयतन क्या होगा?',['36π घन सेमी','12π घन सेमी','108π घन सेमी','27π घन सेमी'],'36π घन सेमी','CTET Practice',2026),
Q('junior','math','एक पासे (Dice) को फेंकने पर सम संख्या (Even Number) आने की प्रायिकता (Probability) क्या होगी?',['1/2','1/6','1/3','2/3'],'1/2','UPTET Practice',2026),
Q('junior','math','यदि sec A + tan A = p है, तो sec A - tan A का मान क्या होगा?',['1/p','p','-p','1 - p'],'1/p','CTET Practice',2026),
Q('junior','math','यदि (x - 1) बहुपद x^2 - kx + 2 का एक गुणनखंड है, तो k का मान क्या होगा?',['3','2','1','4'],'3','UPTET Practice',2026),
Q('junior','math','एक आयताकार मैदान का क्षेत्रफल 150 वर्ग मीटर है और इसकी चौड़ाई 10 मीटर है। इसका परिमाप क्या होगा?',['50 मीटर','15 मीटर','30 मीटर','60 मीटर'],'50 मीटर','CTET Practice',2026),
];
