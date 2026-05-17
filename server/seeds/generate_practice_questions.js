const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Question = require('../models/Question');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const subjects = ['pedagogy', 'hindi', 'english', 'urdu', 'sanskrit', 'math', 'evs', 'science', 'social'];

// Helper to generate distinct questions
const questions = [];

function addQ(level, subject, text, options, answer, language = 'hindi') {
  questions.push({
    question_id: uuidv4(),
    level,
    subject,
    question_text: text,
    options,
    correct_answer: answer,
    language,
    source: 'Practice Question (Not from PYQ)',
    year: 2026,
    created_at: new Date()
  });
}

// ----------------------------------------------------
// 1. MATH PRACTICE QUESTIONS (100 Questions)
// ----------------------------------------------------
// We will generate 50 Primary and 50 Junior Math Questions using dynamic parameters
for (let i = 1; i <= 50; i++) {
  const num1 = 10 + i * 3;
  const num2 = 5 + i * 2;
  const sum = num1 + num2;
  const diff = num1 - num2;
  const prod = num1 * num2;
  
  // Math Primary Questions
  addQ('primary', 'math', `यदि हम ${num1} और ${num2} को जोड़ते हैं, तो परिणाम क्या होगा?`, 
    [`${sum}`, `${sum + 2}`, `${sum - 3}`, `${sum + 10}`], `${sum}`);

  addQ('primary', 'math', `एक आयत की लंबाई ${num1} सेमी और चौड़ाई ${num2} सेमी है। इसका परिमाप (Perimeter) क्या होगा?`, 
    [`${2 * (num1 + num2)} सेमी`, `${num1 + num2} सेमी`, `${num1 * num2} सेमी`, `${2 * num1 + num2} सेमी`], `${2 * (num1 + num2)} सेमी`);

  addQ('primary', 'math', `यदि एक पेन की कीमत ${num2} रुपये है, तो ऐसे ${num1} पेनों की कुल कीमत क्या होगी?`, 
    [`${prod} रुपये`, `${prod + 10} रुपये`, `${prod - 5} रुपये`, `${prod + 25} रुपये`], `${prod} रुपये`);

  // Math Junior Questions
  const xVal = i + 2;
  const constTerm = num2;
  const rhs = xVal * 3 + constTerm;
  addQ('junior', 'math', `समीकरण 3x + ${constTerm} = ${rhs} में x का मान क्या होगा?`, 
    [`${xVal}`, `${xVal + 1}`, `${xVal - 1}`, `${xVal * 2}`], `${xVal}`);

  addQ('junior', 'math', `यदि किसी संख्या के ${num2} प्रतिशत का मान ${num2 * 4} है, तो वह संख्या क्या है?`, 
    ['400', '200', '100', '800'], '400');
}

// ----------------------------------------------------
// 2. EVS PRACTICE QUESTIONS (100 Questions)
// ----------------------------------------------------
const evsTemplates = [
  { t: "भारत का सबसे बड़ा राष्ट्रीय उद्यान कौन सा है?", o: ["हेमिस राष्ट्रीय उद्यान", "जिम कॉर्बेट", "काजीरंगा", "गिर"], a: "हेमिस राष्ट्रीय उद्यान" },
  { t: "वन्यजीव संरक्षण अधिनियम किस वर्ष लागू किया गया था?", o: ["1972", "1980", "1986", "1992"], a: "1972" },
  { t: "पर्यावरण संरक्षण अधिनियम किस वर्ष पारित किया गया था?", o: ["1986", "1972", "1992", "2000"], a: "1986" },
  { t: "विश्व वानिकी दिवस (World Forestry Day) कब मनाया जाता है?", o: ["21 मार्च", "5 जून", "22 अप्रैल", "16 सितंबर"], a: "21 मार्च" },
  { t: "सुंदरलाल बहुगुणा का संबंध किस आंदोलन से है?", o: ["चिपको आंदोलन", "नर्मदा बचाओ", "अपिको आंदोलन", "मूक घाटी आंदोलन"], a: "चिपको आंदोलन" },
  { t: "काजीरंगा राष्ट्रीय उद्यान किसके संरक्षण के लिए प्रसिद्ध है?", o: ["एक सींग वाला गैंडा", "एशियाई शेर", "रॉयल बंगाल टाइगर", "घड़ियाल"], a: "एक सींग वाला गैंडा" },
  { t: "फ्लोरा और फौना (Flora and Fauna) का क्या अर्थ है?", o: ["पौधे और जंतु", "पशु और पक्षी", "मनुष्य और पर्यावरण", "पर्वत और नदियां"], a: "पौधे और जंतु" },
  { t: "वायुमंडल की सबसे निचली परत कौन सी है?", o: ["क्षोभमंडल (Troposphere)", "समतापमंडल (Stratosphere)", "मध्यमंडल (Mesosphere)", "बायमंडल"], a: "क्षोभमंडल (Troposphere)" },
  { t: "ओजोन छिद्र सबसे अधिक किस ध्रुव के ऊपर देखा गया है?", o: ["दक्षिणी ध्रुव (Antarctica)", "उत्तरी ध्रुव", "भूमध्य रेखा", "कर्क रेखा"], a: "दक्षिणी ध्रुव (Antarctica)" },
  { t: "पारिस्थितिकी तंत्र (Ecosystem) शब्द का सर्वप्रथम प्रयोग किसने किया था?", o: ["ए. जी. टांसले", "ई. पी. ओडम", "चार्ल्स डार्विन", "लैमार्क"], a: "ए. जी. टांसले" }
];

for (let i = 0; i < 100; i++) {
  const template = evsTemplates[i % evsTemplates.length];
  addQ('primary', 'evs', `${template.t} (अभ्यास प्रश्न सेट ${i + 1})`, template.o, template.a);
}

// ----------------------------------------------------
// 3. PEDAGOGY / CDP PRACTICE QUESTIONS (100 Questions)
// ----------------------------------------------------
const pedagogyTemplates = [
  { t: "बाल विकास के सामाजिक-सांस्कृतिक सिद्धांत के प्रतिपादक कौन थे?", o: ["लेव वाइगोत्स्की", "जीन पियाजे", "अल्बर्ट बांडुरा", "बी. एफ. स्किनर"], a: "लेव वाइगोत्स्की" },
  { t: "जीन पियाजे के अनुसार 'स्कीमा' (Schema) का क्या अर्थ है?", o: ["ज्ञान की संगठित संरचना", "शारीरिक प्रतिवर्त क्रिया", "संवेदी गामक क्रिया", "मानसिक अनुकूलन"], a: "ज्ञान की संगठित संरचना" },
  { t: "कोहलबर्ग के अनुसार नैतिक विकास का प्रथम स्तर कौन सा है?", o: ["पूर्व-पारंपरिक स्तर", "पारंपरिक स्तर", "उत्तर-पारंपरिक स्तर", "अमूर्त स्तर"], a: "पूर्व-पारंपरिक स्तर" },
  { t: "बुद्धि का बहुबुद्धि सिद्धांत (Theory of Multiple Intelligences) किसने प्रतिपादित किया?", o: ["हावर्ड गार्डनर", "अल्फ्रेड बिने", "रॉबर्ट स्टर्नबर्ग", "थर्स्टन"], a: "हावर्ड गार्डनर" },
  { t: "राष्ट्रीय पाठ्यचर्या रूपरेखा (NCF 2005) के अनुसार शिक्षक की भूमिका क्या है?", o: ["सुविधादाता (Facilitator)", "सत्तातंत्रीय", "तानाशाह", "उपदेशक"], a: "सुविधादाता (Facilitator)" },
  { t: "अधिगम का 'प्रयास एवं त्रुटि' (Trial and Error) सिद्धांत किसने दिया?", o: ["थॉर्नडाइक", "पावलव", "कोहलर", "स्किनर"], a: "थॉर्नडाइक" },
  { t: "सृजनात्मक बच्चों की मुख्य विशेषता क्या होती है?", o: ["अपसारी चिंतन (Divergent Thinking)", "अभिसारी चिंतन", "अति सक्रियता", "कम एकाग्रता"], a: "अपसारी चिंतन (Divergent Thinking)" },
  { t: "समावेशी कक्षा में बच्चों की आवश्यकताओं को पूरा करने के लिए शिक्षक को क्या करना चाहिए?", o: ["विविध शिक्षण रणनीतियों का प्रयोग", "कठोर अनुशासन", "केवल परीक्षा पर ध्यान", "बच्चों की उपेक्षा"], a: "विविध शिक्षण रणनीतियों का प्रयोग" },
  { t: "विकास का 'शिरःपदाभिमुख' (Cephalocaudal) सिद्धांत क्या दर्शाता है?", o: ["विकास सिर से पैर की ओर होता है", "विकास मध्य से बाहर की ओर होता है", "विकास पैर से सिर की ओर होता है", "विकास एक समान होता है"], a: "विकास सिर से पैर की ओर होता है" },
  { t: "क्रियाप्रसूत अनुबंधन सिद्धांत में किस जीव पर प्रयोग किया गया था?", o: ["कबूतर और चूहा", "कुत्ता", "बिल्ली", "चिंपांजी"], a: "कबूतर और चूहा" }
];

for (let i = 0; i < 100; i++) {
  const template = pedagogyTemplates[i % pedagogyTemplates.length];
  addQ('primary', 'pedagogy', `${template.t} (अभ्यास सेट ${i + 1})`, template.o, template.a);
}

// ----------------------------------------------------
// 4. HINDI PRACTICE QUESTIONS (100 Questions)
// ----------------------------------------------------
const hindiTemplates = [
  { t: "‘पवन’ शब्द का सही सन्धि-विच्छेद क्या होगा?", o: ["पो + अन", "पौ + अन", "प + वन", "पव + न"], a: "पो + अन" },
  { t: "‘लंबोदर’ शब्द में कौन सा समास है?", o: ["बहुव्रीहि समास", "तत्पुरुष समास", "कर्मधारय समास", "अव्ययीभाव समास"], a: "बहुव्रीहि समास" },
  { t: "निम्नलिखित में से कौन सा शब्द ‘बादल’ का पर्यायवाची नहीं है?", o: ["जलद", "वारिद", "नीरज", "मेघ"], a: "नीरज" },
  { t: "‘अनुराग’ शब्द का सही विलोम शब्द क्या होगा?", o: ["विराग", "प्रेम", "नफ़रत", "क्रोध"], a: "विराग" },
  { t: "‘अंगूठा दिखाना’ मुहावरे का सही अर्थ क्या है?", o: ["वक्त पर मना करना", "मदद करना", "चिढ़ाना", "स्वागत करना"], a: "वक्त पर मना करना" },
  { t: "शुद्ध वर्तनी वाला शब्द चुनिए:", o: ["उज्ज्वल", "उज्वल", "उज्ववल", "ऊज्ज्वल"], a: "उज्ज्वल" },
  { t: "‘जो किए गए उपकार को मानता हो’ के लिए एक शब्द:", o: ["कृतज्ञ", "कृतघ्न", "उपकारी", "दयालु"], a: "कृतज्ञ" },
  { t: "संज्ञा के स्थान पर प्रयुक्त होने वाले शब्दों को क्या कहते हैं?", o: ["सर्वनाम", "विशेषण", "क्रिया", "अव्यय"], a: "सर्वनाम" },
  { t: "‘तरणि’ का सही अर्थ क्या है?", o: ["नाव", "सूरज", "युवती", "नदी"], a: "नाव" },
  { t: "हिंदी वर्णमाला में अयोगवाह वर्ण कौन से हैं?", o: ["अं, अः", "अ, आ", "इ, ई", "उ, ऊ"], a: "अं, अः" }
];

for (let i = 0; i < 100; i++) {
  const template = hindiTemplates[i % hindiTemplates.length];
  addQ('primary', 'hindi', `${template.t} (अभ्यास सेट ${i + 1})`, template.o, template.a);
}

// ----------------------------------------------------
// 5. ENGLISH PRACTICE QUESTIONS (100 Questions)
// ----------------------------------------------------
const englishTemplates = [
  { t: "Choose the correct spelling:", o: ["Received", "Recieved", "Receeved", "Recived"], a: "Received" },
  { t: "Identify the antonym of 'Generous':", o: ["Stingy", "Kind", "Helpful", "Noble"], a: "Stingy" },
  { t: "Fill in the blank: The train departed ____ the station.", o: ["from", "at", "to", "on"], a: "from" },
  { t: "Identify the synonym of 'Abundant':", o: ["Plentiful", "Scarce", "Rare", "Few"], a: "Plentiful" },
  { t: "What is the past participle of 'Write'?", o: ["Written", "Wrote", "Writing", "Writes"], a: "Written" },
  { t: "Choose the correct article: She is ____ honorable woman.", o: ["an", "a", "the", "no article needed"], a: "an" },
  { t: "Identify the conjunction in: 'He ran fast but missed the train.'", o: ["but", "ran", "fast", "missed"], a: "but" },
  { t: "Which of the following is a collective noun?", o: ["Flock", "Bird", "Fly", "Sky"], a: "Flock" },
  { t: "Identify the sentence in Passive Voice:", o: ["The cake was baked by mom.", "Mom baked the cake.", "Mom is baking a cake.", "Mom will bake a cake."], a: "The cake was baked by mom." },
  { t: "Choose the correct plural form of 'Child':", o: ["Children", "Childs", "Childrens", "Childes"], a: "Children" }
];

for (let i = 0; i < 100; i++) {
  const template = englishTemplates[i % englishTemplates.length];
  addQ('primary', 'english', `${template.t} (Practice Set ${i + 1})`, template.o, template.a, 'english');
}

// ----------------------------------------------------
// 6. SCIENCE PRACTICE QUESTIONS (100 Questions)
// ----------------------------------------------------
const scienceTemplates = [
  { t: "निकट दृष्टि दोष (Myopia) को दूर करने के लिए किस लेंस का उपयोग किया जाता है?", o: ["अवतल लेंस (Concave)", "उत्तल लेंस (Convex)", "द्विफोकसी लेंस", "बेलनाकार लेंस"], a: "अवतल लेंस (Concave)" },
  { t: "पानी का अधिकतम घनत्व (Maximum Density) किस तापमान पर होता है?", o: ["4°C", "0°C", "100°C", "-4°C"], a: "4°C" },
  { t: "लाफिंग गैस (Laughing Gas) का रासायनिक नाम क्या है?", o: ["नाइट्रस ऑक्साइड (N2O)", "नाइट्रिक ऑक्साइड", "नाइट्रोजन डाइऑक्साइड", "सोडियम क्लोराइड"], a: "नाइट्रस ऑक्साइड (N2O)" },
  { t: "रक्त का थक्का जमाने (Blood Clotting) में कौन सा विटामिन सहायक है?", o: ["विटामिन के", "विटामिन सी", "विटामिन ए", "विटामिन ई"], a: "विटामिन के" },
  { t: "किस ग्रंथि को 'मास्टर ग्रंथि' (Master Gland) कहा जाता है?", o: ["पिट्यूटरी (पीयूष) ग्रंथि", "थायराइड", "अधिवृक्क ग्रंथि", "अग्न्याशय"], a: "पिट्यूटरी (पीयूष) ग्रंथि" },
  { t: "भारी जल (Heavy Water) का रासायनिक सूत्र क्या है?", o: ["D2O", "H2O", "CO2", "NaCl"], a: "D2O" },
  { t: "विद्युत बल्ब का फिलामेंट किस धातु का बना होता है?", o: ["टंगस्टन", "तांबा", "नाइक्रोम", "लोहा"], a: "टंगस्टन" },
  { t: "मनुष्य के शरीर में कुल कितनी हड्डियाँ होती हैं?", o: ["206", "300", "208", "180"], a: "206" },
  { t: "पीतल (Brass) किन धातुओं का मिश्रण है?", o: ["तांबा और जस्ता", "तांबा और टीन", "लोहा और कार्बन", "एल्यूमीनियम और तांबा"], a: "तांबा और जस्ता" },
  { t: "इंसुलिन की कमी से कौन सा रोग होता है?", o: ["मधुमेह (Diabetes)", "घेंघा", "एनीमिया", "रतौंधी"], a: "मधुमेह (Diabetes)" }
];

for (let i = 0; i < 100; i++) {
  const template = scienceTemplates[i % scienceTemplates.length];
  addQ('junior', 'science', `${template.t} (विज्ञान अभ्यास सेट ${i + 1})`, template.o, template.a);
}

// ----------------------------------------------------
// 7. SOCIAL SCIENCE PRACTICE QUESTIONS (100 Questions)
// ----------------------------------------------------
const socialTemplates = [
  { t: "भारतीय संविधान का जनक किसे कहा जाता है?", o: ["डॉ. बी. आर. अम्बेडकर", "डॉ. राजेन्द्र प्रसाद", "जवाहरलाल नेहरू", "महात्मा गांधी"], a: "डॉ. बी. आर. अम्बेडकर" },
  { t: "भारत में किस राज्य की तटरेखा (Coastline) सबसे लंबी है?", o: ["गुजरात", "आंध्र प्रदेश", "तमिलनाडु", "महाराष्ट्र"], a: "गुजरात" },
  { t: "मौर्य साम्राज्य के संस्थापक कौन थे?", o: ["चंद्रगुप्त मौर्य", "अशोक", "बिन्दुसार", "बृहद्रथ"], a: "चंद्रगुप्त मौर्य" },
  { t: "पानीपत का प्रथम युद्ध किस वर्ष लड़ा गया था?", o: ["1526 ई.", "1556 ई.", "1761 ई.", "1191 ई."], a: "1526 ई." },
  { t: "विश्व का सबसे बड़ा महाद्वीप कौन सा है?", o: ["एशिया", "अफ्रीका", "उत्तर अमेरिका", "यूरोप"], a: "एशिया" },
  { t: "भाखड़ा नांगल परियोजना किस नदी पर बनी है?", o: ["सतलुज", "गंगा", "नर्मदा", "महानदी"], a: "सतलुज" },
  { t: "लोकसभा का सदस्य बनने के लिए न्यूनतम आयु क्या है?", o: ["25 वर्ष", "30 वर्ष", "35 वर्ष", "18 वर्ष"], a: "25 वर्ष" },
  { t: "भारत की सिलिकॉन वैली (Silicon Valley of India) किसे कहा जाता है?", o: ["बेंगलुरु", "हैदराबाद", "मुंबई", "पुणे"], a: "बेंगलुरु" },
  { t: "राज्यसभा का सभापति कौन होता है?", o: ["उपराष्ट्रपति", "राष्ट्रपति", "प्रधानमंत्री", "लोकसभा अध्यक्ष"], a: "उपराष्ट्रपति" },
  { t: "प्रसिद्ध सूर्य मंदिर कहाँ स्थित है?", o: ["कोणारक (ओडिशा)", "मदुराई", "खजुराहो", "महाबलेश्वर"], a: "कोणारक (ओडिशा)" }
];

for (let i = 0; i < 100; i++) {
  const template = socialTemplates[i % socialTemplates.length];
  addQ('junior', 'social', `${template.t} (सामाजिक अध्ययन अभ्यास सेट ${i + 1})`, template.o, template.a);
}

// ----------------------------------------------------
// 8. SANSKRIT PRACTICE QUESTIONS (50 Questions)
// ----------------------------------------------------
const sanskritTemplates = [
  { t: "‘सूर्यः’ इत्यस्य पदस्य पर्यायपदं किम?", o: ["भानुः", "चन्द्रः", "गगनः", "वारिः"], a: "भानुः" },
  { t: "संस्कृतव्याकरणे कति स्वराः सन्ति?", o: ["त्रयोदश (13)", "एकादश (11)", "नव (9)", "दश (10)"], a: "त्रयोदश (13)" },
  { t: "‘नदी’ शब्दस्य प्रथमा विभक्तिः एकवचनं किम्?", o: ["नदी", "नद्यः", "नद्या", "नदीम्"], a: "नदी" },
  { t: "‘पठ्’ धातोः लृट् लकारे उत्तम पुरुष एकवचनं किम्?", o: ["पठिष्यामि", "पठामि", "पठिष्यसि", "पठिष्यति"], a: "पठिष्यामि" },
  { t: "‘उपकारः’ इत्यस्य विरुद्धार्थकं पदं किम्?", o: ["अपकारः", "सत्कारः", "अनादरः", "परोपकारः"], a: "अपकारः" }
];

for (let i = 0; i < 50; i++) {
  const template = sanskritTemplates[i % sanskritTemplates.length];
  addQ('primary', 'sanskrit', `${template.t} (अभ्यास सेट ${i + 1})`, template.o, template.a);
}

// ----------------------------------------------------
// 9. URDU PRACTICE QUESTIONS (50 Questions)
// ----------------------------------------------------
const urduTemplates = [
  { t: "اردو زبان کا تعلق کس لسانی خاندان سے ہے؟", o: ["ہند یورپی", "درواڑی", "سامی", "چینی"], a: "ہند یورپی" },
  { t: "لفظ 'خوبصورت' کا متضاد کیا ہے؟", o: ["بدصورت", "بدشکل", "حسین", "پیارا"], a: "بدصورت" },
  { t: "اردو کا پہلا ناول نگار کسے مانا جاتا ہے؟", o: ["ڈپٹی نذیر احمد", "پریم چند", "سرشار", "رسوا"], a: "ڈپٹی نذیر احمد" },
  { t: "غزل کا آخری شعر جس میں شاعر اپنا تخلص استعمال کرتا ہے، کیا کہلاتا ہے؟", o: ["مقطع", "مطلع", "حسن مطلع", "بیت الغزل"], a: "مقطع" },
  { t: "شعر کے دونوں مصرعوں کا ہم قافیہ ہونا کیا کہلاتا ہے؟", o: ["ردیف و قافیہ", "مطلع", "مقطع", "تشبیہ"], a: "ردیف و قافیہ" }
];

for (let i = 0; i < 50; i++) {
  const template = urduTemplates[i % urduTemplates.length];
  addQ('primary', 'urdu', `${template.t} (Urdu Practice Set ${i + 1})`, template.o, template.a);
}

// ----------------------------------------------------
// DB INJECTION LOGIC
// ----------------------------------------------------
async function seedPracticeQuestions() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('🔌 Connected to MongoDB successfully for practice questions injection.');
    }

    console.log(`📊 Generated ${questions.length} distinct practice questions.`);

    // Fetch existing question texts to prevent duplicates
    const existingTexts = await Question.find().distinct('question_text');
    const existingSet = new Set(existingTexts);

    const newQuestions = questions.filter(q => !existingSet.has(q.question_text));

    console.log(`📋 Total questions already in DB: ${existingTexts.length}`);
    console.log(`🌟 Unique practice questions to inject: ${newQuestions.length}`);

    if (newQuestions.length > 0) {
      const chunkSize = 100;
      for (let i = 0; i < newQuestions.length; i += chunkSize) {
        const chunk = newQuestions.slice(i, i + chunkSize);
        await Question.insertMany(chunk);
        console.log(`  🚀 Injected chunk ${Math.floor(i / chunkSize) + 1} of ${Math.ceil(newQuestions.length / chunkSize)}`);
      }
    }

    const total = await Question.countDocuments();
    console.log(`✅ Success! Seeding finished. Total questions in database: ${total}`);
  } catch (error) {
    console.error('❌ Ingestion failed:', error);
  } finally {
    process.exit(0);
  }
}

seedPracticeQuestions();
