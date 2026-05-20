const { v4: uuidv4 } = require('uuid');
const Q = (l,s,t,o,a,src,yr) => ({question_id:uuidv4(),level:l,subject:s,question_text:t,options:o,correct_answer:a,source:src,year:yr,created_at:new Date()});

module.exports = [
Q('junior','science','निकट दृष्टि दोष (Myopia) को दूर करने के लिए किस लेंस का प्रयोग किया जाता है?',['अवतल लेंस (Concave Lens)','उत्तल लेंस','द्विफोकसी लेंस','बेलनाकार लेंस'],'अवतल लेंस (Concave Lens)','UPTET Practice',2026),
Q('junior','science','भारी जल (Heavy Water) का रासायनिक सूत्र क्या है?',['D2O','H2O','H2O2','CO2'],'D2O','CTET Practice',2026),
Q('junior','science','मनुष्य के शरीर में कुल कितनी हड्डियाँ पाई जाती हैं?',['206','300','208','180'],'206','UPTET Practice',2026),
Q('junior','science','किस ग्रंथि को मास्टर ग्रंथि (Master Gland) कहा जाता है?',['पीयूष ग्रंथि (Pituitary Gland)','थायरॉयड ग्रंथि','अधिवृक्क ग्रंथि','अग्न्याशय'],'पीयूष ग्रंथि (Pituitary Gland)','CTET Practice',2026),
Q('junior','science','शुद्ध सोने का कैरेट मान क्या होता है?',['24 कैरेट','22 कैरेट','18 कैरेट','20 कैरेट'],'24 कैरेट','UPTET Practice',2026),
Q('junior','science','शुष्क बर्फ (Dry Ice) क्या है?',['ठोस कार्बन डाइऑक्साइड','ठोस पानी','ठोस नाइट्रोजन','ठोस ऑक्सीजन'],'ठोस कार्बन डाइऑक्साइड','CTET Practice',2026),
Q('junior','science','रक्त का पीएच (pH) मान कितना होता है?',['7.4','6.0','8.0','7.0'],'7.4','UPTET Practice',2026),
Q('junior','science','विद्युत धारा (Electric Current) मापने का यंत्र कौन सा है?',['अमीटर (Ammeter)','वोल्टमीटर','गैल्वेनोमीटर','लैक्टोमीटर'],'अमीटर (Ammeter)','CTET Practice',2026),
Q('junior','science','पेनिसिलिन (Penicillin) की खोज किसने की थी?',['अलेक्जेंडर फ्लेमिंग','एडवर्ड जेनर','लुई पाश्चर','रॉबर्ट कोच'],'अलेक्जेंडर फ्लेमिंग','UPTET Practice',2026),
Q('junior','science','विटामिन डी (Vitamin D) की कमी से बच्चों में कौन सा रोग होता है?',['सूखा रोग (Rickets)','रतौंधी','स्कर्वी','बेरी-बेरी'],'सूखा रोग (Rickets)','CTET Practice',2026),
];
