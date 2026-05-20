const { v4: uuidv4 } = require('uuid');
const Q = (l,s,t,o,a,src,yr) => ({question_id:uuidv4(),level:l,subject:s,question_text:t,options:o,correct_answer:a,source:src,year:yr,created_at:new Date()});

module.exports = [
Q('junior','science','दूध का पीला रंग किसके कारण होता है?',['कैरोटीन (Carotene)','केसीन','लैक्टोज','राइबोफ्लेविन'],'कैरोटीन (Carotene)','UPTET Practice',2026),
Q('junior','science','हंसाने वाली गैस का सूत्र क्या है?',['N2O','NO2','NO','NH3'],'N2O','CTET Practice',2026),
Q('junior','science','विद्युत हीटर की कुंडली (Heater Coil) किस धातु की बनी होती है?',['नाइक्रोम (Nichrome)','टंगस्टन','तांबा','लोहा'],'नाइक्रोम (Nichrome)','UPTET Practice',2026),
Q('junior','science','दूध खट्टा होने पर उसमें कौन सा अम्ल बनता है?',['लैक्टिक अम्ल (Lactic Acid)','एसिटिक अम्ल','टार्टरिक अम्ल','सिट्रिक अम्ल'],'लैक्टिक अम्ल (Lactic Acid)','CTET Practice',2026),
Q('junior','science','परमाणु बम (Atom Bomb) किस सिद्धांत पर आधारित है?',['नाभिकीय विखंडन (Nuclear Fission)','नाभिकीय संलयन','रेडियोएक्टिव विघटन','कोई नहीं'],'नाभिकीय विखंडन (Nuclear Fission)','UPTET Practice',2026),
Q('junior','science','हाइड्रोजन बम (Hydrogen Bomb) किस सिद्धांत पर आधारित है?',['नाभिकीय संलयन (Nuclear Fusion)','नाभिकीय विखंडन','रासायनिक क्रिया','विद्युत चुंबकीय प्रभाव'],'नाभिकीय संलयन (Nuclear Fusion)','CTET Practice',2026),
Q('junior','science','सूर्य की ऊर्जा का मुख्य स्रोत क्या है?',['नाभिकीय संलयन (Nuclear Fusion)','नाभिकीय विखंडन','ऑक्सीकरण','कोयला जलना'],'नाभिकीय संलयन (Nuclear Fusion)','UPTET Practice',2026),
Q('junior','science','पेंसिल की लीड (Pencil Lead) किसकी बनी होती है?',['ग्रेफाइट (Graphite)','चारकोल','सीसा','कोयला'],'ग्रेफाइट (Graphite)','CTET Practice',2026),
Q('junior','science','पौधों में क्लोरोफिल बनाने के लिए कौन सा तत्व आवश्यक है?',['मैग्नीशियम (Mg)','कैल्शियम','लोहा','फास्फोरस'],'मैग्नीशियम (Mg)','UPTET Practice',2026),
Q('junior','science','विद्युत बल्ब में सामान्यतः कौन सी गैस भरी जाती है?',['नाइट्रोजन या आर्गन','ऑक्सीजन','हाइड्रोजन','कार्बन डाइऑक्साइड'],'नाइट्रोजन या आर्गन','CTET Practice',2026),
];
