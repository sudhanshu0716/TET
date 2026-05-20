const { v4: uuidv4 } = require('uuid');
const Q = (l,s,t,o,a,src,yr) => ({question_id:uuidv4(),level:l,subject:s,question_text:t,options:o,correct_answer:a,source:src,year:yr,created_at:new Date()});

module.exports = [
Q('junior','science','द्रव अवस्था में पाई जाने वाली एकमात्र अधातु (Non-metal) कौन सी है?',['ब्रोमीन (Bromine)','पारा','क्लोरीन','आयोडीन'],'ब्रोमीन (Bromine)','UPTET Practice',2026),
Q('junior','science','दूध की शुद्धता मापने का यंत्र कौन सा है?',['लैक्टोमीटर (Lactometer)','हाइड्रोमीटर','बैरोमीटर','थर्मामीटर'],'लैक्टोमीटर (Lactometer)','CTET Practice',2026),
Q('junior','science','मानव हृदय में कितने कक्ष (Chambers) होते हैं?',['चार (4)','दो (2)','तीन (3)','एक (1)'],'चार (4)','UPTET Practice',2026),
Q('junior','science','जंग लगने पर लोहे के भार में क्या परिवर्तन होता है?',['भार बढ़ जाता है','भार घट जाता है','भार अपरिवर्तित रहता है','पहले घटता है फिर बढ़ता है'],'भार बढ़ जाता है','CTET Practice',2026),
Q('junior','science','रेडियोएक्टिविटी की खोज किसने की थी?',['हेनरी बेकरल','मैरी क्यूरी','रदरफोर्ड','जे. जे. थॉमसन'],'हेनरी बेकरल','UPTET Practice',2026),
Q('junior','science','किस रंग के प्रकाश का प्रकीर्णन (Scattering) सबसे अधिक होता है?',['बैंगनी (Violet)','लाल','नीला','पीला'],'बैंगनी (Violet)','CTET Practice',2026),
Q('junior','science','रसोई गैस (LPG) में महक के लिए कौन सा पदार्थ मिलाया जाता है?',['एथिल मरकैप्टन (Ethyl Mercaptan)','ब्यूटेन','प्रोपेन','मीथेन'],'एथिल मरकैप्टन (Ethyl Mercaptan)','UPTET Practice',2026),
Q('junior','science','मलेरिया रोग किस मच्छर के काटने से फैलता है?',['मादा एनोफेलीज (Female Anopheles)','नर एनोफेलीज','एडीज','क्यूलेक्स'],'मादा एनोफेलीज (Female Anopheles)','CTET Practice',2026),
Q('junior','science','आनुवंशिकी के जनक (Father of Genetics) कौन हैं?',['ग्रेगर जॉन मेंडल','चार्ल्स डार्विन','लैमार्क','डी व्रीज'],'ग्रेगर जॉन मेंडल','UPTET Practice',2026),
Q('junior','science','प्रकाश वर्ष (Light Year) किसका मात्रक है?',['दूरी का (Distance)','समय का','प्रकाश की तीव्रता का','वेग का'],'दूरी का (Distance)','CTET Practice',2026),
];
