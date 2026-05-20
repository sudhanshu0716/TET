const { v4: uuidv4 } = require('uuid');
const Q = (l,s,t,o,a,src,yr) => ({question_id:uuidv4(),level:l,subject:s,question_text:t,options:o,correct_answer:a,source:src,year:yr,created_at:new Date()});

module.exports = [
Q('junior','science','पानी का घनत्व अधिकतम किस तापमान पर होता है?',['4°C','0°C','100°C','-4°C'],'4°C','UPTET Practice',2026),
Q('junior','science','लाफिंग गैस (Laughing Gas) का रासायनिक नाम क्या है?',['नाइट्रस ऑक्साइड (N2O)','नाइट्रिक ऑक्साइड','नाइट्रोजन डाइऑक्साइड','सल्फर डाइऑक्साइड'],'नाइट्रस ऑक्साइड (N2O)','CTET Practice',2026),
Q('junior','science','मानव शरीर में रक्त का थक्का बनाने में कौन सा विटामिन सहायक होता है?',['विटामिन के (Vitamin K)','विटामिन सी','विटामिन डी','विटामिन ए'],'विटामिन के (Vitamin K)','UPTET Practice',2026),
Q('junior','science','विद्युत बल्ब का फिलामेंट किस धातु का बना होता है?',['टंगस्टन','तांबा','लोहा','नाइक्रोम'],'टंगस्टन','CTET Practice',2026),
Q('junior','science','पीतल (Brass) निम्नलिखित में से किन धातुओं की मिश्रधातु (Alloy) है?',['तांबा और जस्ता (Cu + Zn)','तांबा और टिन','लोहा और कार्बन','सीसा और टिन'],'तांबा और जस्ता (Cu + Zn)','UPTET Practice',2026),
Q('junior','science','इंसुलिन हार्मोन का स्राव शरीर के किस अंग से होता है?',['अग्न्याशय (Pancreas)','यकृत (Liver)','पीयूष ग्रंथि','थायरॉयड ग्रंथि'],'अग्न्याशय (Pancreas)','CTET Practice',2026),
Q('junior','science','ध्वनि की चाल सबसे अधिक किस माध्यम में होती है?',['ठोस (Solid)','द्रव (Liquid)','गैस (Gas)','निर्वात (Vacuum)'],'ठोस (Solid)','UPTET Practice',2026),
Q('junior','science','कार्य का एस.आई. (S.I.) मात्रक क्या है?',['जूल (Joule)','वाट','न्यूटन','पास्कल'],'जूल (Joule)','CTET Practice',2026),
Q('junior','science','सर्चलाइट और वाहनों की हेडलाइट में किस दर्पण का उपयोग किया जाता है?',['अवतल दर्पण (Concave Mirror)','उत्तल दर्पण','समतल दर्पण','बेलनाकार दर्पण'],'अवतल दर्पण (Concave Mirror)','UPTET Practice',2026),
Q('junior','science','प्रकाश संश्लेषण (Photosynthesis) की क्रिया में कौन सी गैस उत्पन्न होती है?',['ऑक्सीजन','कार्बन डाइऑक्साइड','नाइट्रोजन','हाइड्रोजन'],'ऑक्सीजन','CTET Practice',2026),
];
