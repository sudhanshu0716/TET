const { v4: uuidv4 } = require('uuid');
const Q = (l,s,t,o,a,src,yr) => ({question_id:uuidv4(),level:l,subject:s,question_text:t,options:o,correct_answer:a,source:src,year:yr,created_at:new Date()});

module.exports = [
Q('junior','science','परम शून्य ताप (Absolute Zero Temperature) का मान क्या है?',['-273.15°C','0°C','100°C','-100°C'],'-273.15°C','UPTET Practice',2026),
Q('junior','science','सिरके (Vinegar) में कौन सा अम्ल पाया जाता है?',['एसिटिक अम्ल (Acetic Acid)','सिट्रिक अम्ल','लैक्टिक अम्ल','टार्टरिक अम्ल'],'एसिटिक अम्ल (Acetic Acid)','CTET Practice',2026),
Q('junior','science','सर्वदाता रक्त समूह (Universal Donor Blood Group) कौन सा है?',['O-','AB+','A+','B+'],'O-','UPTET Practice',2026),
Q('junior','science','ऊर्जा का प्राथमिक स्रोत पेड़-पौधों के लिए क्या है?',['सूर्य का प्रकाश','खाद','पानी','मिट्टी'],'सूर्य का प्रकाश','CTET Practice',2026),
Q('junior','science','डायनामाइट (Dynamite) के आविष्कारक कौन थे?',['अल्फ्रेड नोबेल','थॉमस एडिसन','आइजैक न्यूटन','मैरी क्यूरी'],'अल्फ्रेड नोबेल','UPTET Practice',2026),
Q('junior','science','किस तापमान पर सेल्सियस और फारेनहाइट स्केल का मान समान होता है?',['-40°','0°','40°','-100°'],'-40°','CTET Practice',2026),
Q('junior','science','मधुमेह (Diabetes) रोग किसकी कमी से होता है?',['इंसुलिन','थायरॉक्सिन','एड्रिनेलिन','एस्ट्रोजन'],'इंसुलिन','UPTET Practice',2026),
Q('junior','science','आंसुओं में कौन सा एंजाइम पाया जाता है जिससे जीवाणु मर जाते हैं?',['लाइसोसोम (Lysozyme)','एमाइलेज','पेप्सिन','टायलिन'],'लाइसोसोम (Lysozyme)','CTET Practice',2026),
Q('junior','science','तारों का टिमटिमाना (Twinkling of Stars) किस घटना के कारण होता है?',['प्रकाश का अपवर्तन (Refraction of Light)','प्रकाश का परावर्तन','प्रकाश का प्रकीर्णन','पूर्ण आंतरिक परावर्तन'],'प्रकाश का अपवर्तन (Refraction of Light)','UPTET Practice',2026),
Q('junior','science','विद्युत का सबसे अच्छा चालक (Best Conductor of Electricity) कौन सा है?',['चांदी (Silver)','तांबा','सोना','एल्युमीनियम'],'चांदी (Silver)','CTET Practice',2026),
];
