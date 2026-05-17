const { v4: uuidv4 } = require('uuid');
const Q = (l,s,t,o,a,src,yr) => ({question_id:uuidv4(),level:l,subject:s,question_text:t,options:o,correct_answer:a,source:src,year:yr,created_at:new Date()});

module.exports = [
Q('junior','science','प्रकाश संश्लेषण (Photosynthesis) की दर किस रंग के प्रकाश में सर्वाधिक होती है?',['लाल प्रकाश','नीला प्रकाश','हरा प्रकाश','पीला प्रकाश'],'लाल प्रकाश','CTET Practice',2024),
Q('junior','science','मानव शरीर की सबसे बड़ी ग्रंथि कौन सी है?',['यकृत (Liver)','अग्न्याशय (Pancreas)','थायराइड','पीयूष ग्रंथि'],'यकृत (Liver)','UPTET Practice',2024),
Q('junior','science','ध्वनि की चाल सबसे अधिक किस माध्यम में होती है?',['ठोस (Solid)','द्रव (Liquid)','गैस (Gas)','निर्वात (Vacuum)'],'ठोस (Solid)','CTET Practice',2024),
Q('junior','science','विद्युत धारा (Electric Current) का एस.आई. (SI) मात्रक क्या है?',['एम्पीयर','वोल्ट','ओम','वाट'],'एम्पीयर','UPTET Practice',2024),
Q('junior','science','रक्त का पीएच (pH) मान कितना होता है?',['7.4','6.5','8.2','5.8'],'7.4','CTET Practice',2024),
Q('junior','science','निम्नलिखित में से कौन सा एक भौतिक परिवर्तन (Physical Change) है?',['पानी का बर्फ बनना','लोहे में जंग लगना','दूध का दही बनना','मोमबत्ती का जलना'],'पानी का बर्फ बनना','UPTET Practice',2024),
Q('junior','science','विटामिन डी की कमी से कौन सा रोग होता है?',['सूखा रोग (Rickets)','रतौंधी','स्कर्वी','बेरी-बेरी'],'सूखा रोग (Rickets)','CTET Practice',2024),
Q('junior','science','कोशिका का "पावर हाउस" (Powerhouse of the Cell) किसे कहा जाता है?',['माइटोकॉन्ड्रिया','लाइसोसोम','राइबोसोम','गॉल्जीकाय'],'माइटोकॉन्ड्रिया','UPTET Practice',2024),
Q('junior','science','सूर्य की किरणों से हमारे शरीर को कौन सा विटामिन प्राप्त होता है?',['विटामिन डी','विटामिन सी','विटामिन ए','विटामिन के'],'विटामिन डी','CTET Practice',2024),
Q('junior','science','वायुमंडल में ऑक्सीजन गैस का प्रतिशत कितना है?',['21%','78%','0.03%','1%'],'21%','UPTET Practice',2024)
];
