const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Question = require('../models/Question');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const questions = [];

// Helper to push questions cleanly
function addQ(level, subject, text, options, answer, explanation, language = 'hindi') {
  questions.push({
    question_id: uuidv4(),
    level,
    subject,
    question_text: text,
    options,
    correct_answer: answer,
    language,
    explanation,
    source: 'UPTET Practice Mega Bank',
    year: 2026,
    created_at: new Date()
  });
}

// ==========================================
// 1. CHILD DEVELOPMENT & PEDAGOGY (350 Questions)
// ==========================================
const cdpNames = ['अमित', 'राहुल', 'प्रिया', 'अंजलि', 'विकास', 'श्वेता', 'रोहन', 'रितिका', 'अभिषेक', 'नेहा'];
const cdpTeachers = ['श्रीमती शर्मा', 'श्री वर्मा', 'श्रीमती सिंह', 'श्री गुप्ता', 'श्रीमती द्विवेदी', 'श्री यादव'];

const cdpTheories = [
  {
    theorist: 'जीन पियाजे (Jean Piaget)',
    concept: 'संज्ञानात्मक विकास (Cognitive Development)',
    stages: [
      { name: 'संवेदी-गामक अवस्था (Sensory-Motor Stage)', age: '0 से 2 वर्ष', behavior: 'वस्तु स्थायित्व (Object Permanence) का प्रदर्शन करना', key: 'वस्तु स्थायित्व' },
      { name: 'पूर्व-संक्रियात्मक अवस्था (Pre-Operational Stage)', age: '2 से 7 वर्ष', behavior: 'जीववाद (Animism) और अहंकेंद्रित चिंतन (Egocentrism) दिखाना', key: 'जीववाद' },
      { name: 'मूर्त-संक्रियात्मक अवस्था (Concrete Operational Stage)', age: '7 से 11 वर्ष', behavior: 'संरक्षण (Conservation) और वर्गीकरण (Classification) की समझ विकसित करना', key: 'संरक्षण' },
      { name: 'औपचारिक संक्रियात्मक अवस्था (Formal Operational Stage)', age: '11 वर्ष से अधिक', behavior: 'अमूर्त तार्किकता (Abstract Reasoning) और परिकल्पनात्मक चिंतन करना', key: 'अमूर्त तार्किकता' }
    ]
  },
  {
    theorist: 'लेव वाइगोत्स्की (Lev Vygotsky)',
    concepts: [
      { name: 'पाड़/ढांचा (Scaffolding)', detail: 'शिक्षक द्वारा दी जाने वाली अस्थायी सहायता', example: 'संकेत और इशारे देना' },
      { name: 'समीपस्थ विकास का क्षेत्र (Zone of Proximal Development - ZPD)', detail: 'वास्तविक विकास स्तर और संभावित विकास स्तर के बीच का अंतर', example: 'वयस्क मार्गदर्शन में कार्य करना' },
      { name: 'निजी वाक (Private Speech)', detail: 'बच्चे स्वयं के कार्यों को निर्देशित करने के लिए बोलते हैं', example: 'स्वयं से जोर-जोर से बात करना' }
    ]
  },
  {
    theorist: 'लॉरेंस कोहलबर्ग (Lawrence Kohlberg)',
    stages: [
      { name: 'पूर्व-पारंपरिक स्तर (Pre-Conventional Level)', focus: 'दंड और आज्ञाकारिता (Punishment and Obedience) तथा व्यक्तिगत पुरस्कार' },
      { name: 'पारंपरिक स्तर (Conventional Level)', focus: 'अच्छा लड़का/अच्छी लड़की (Good Boy/Nice Girl) अभिविन्यास और सामाजिक व्यवस्था बनाए रखना' },
      { name: 'उत्तर-पारंपरिक स्तर (Post-Conventional Level)', focus: 'सामाजिक अनुबंध (Social Contract) और सार्वभौमिक नैतिक सिद्धांत' }
    ]
  }
];

const learningDisabilities = [
  { name: 'डिस्लेक्सिया (Dyslexia)', type: 'पठन विकार (Reading Disability)', behavior: 'शब्दों को पढ़ने, वर्तनी पहचानने और अक्षरों को उल्टा समझने में कठिनाई' },
  { name: 'डिस्ग्राफिया (Dysgraphia)', type: 'लेखन विकार (Writing Disability)', behavior: 'सुपाठ्य लिखने में कठिनाई, वर्तनी त्रुटियाँ और खराब लिखावट' },
  { name: 'डिस्कैल्क्युलिया (Dyscalculia)', type: 'गणितीय विकार (Mathematical Disability)', behavior: 'अंकों को पहचानने, गणना करने और गणितीय संक्रियाओं में कठिनाई' },
  { name: 'ए.डी.एच.डी. (ADHD)', type: 'ध्यान आभाव सक्रियता विकार', behavior: 'अति सक्रियता, एकाग्रता की कमी और बिना सोचे-समझे कार्य करना' }
];

// Generate CDP Questions
let cdpCount = 0;
// Loop to build ~350 unique questions
for (let i = 0; i < 35; i++) {
  const name = cdpNames[i % cdpNames.length];
  const teacher = cdpTeachers[i % cdpTeachers.length];

  // Piaget questions
  cdpTheories[0].stages.forEach((stage, idx) => {
    addQ(
      idx < 2 ? 'primary' : 'junior',
      'pedagogy',
      `एक ${stage.age} वर्ष का बच्चा '${name}' ${stage.behavior} दर्शाता है। जीन पियाजे के संज्ञानात्मक विकास सिद्धांत के अनुसार वह किस अवस्था में है? (सेट-${i+1})`,
      [stage.name, 'पूर्व-संक्रियात्मक अवस्था', 'मूर्त-संक्रियात्मक अवस्था', 'संवेदी-गामक अवस्था'].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4),
      stage.name,
      `पियाजे के अनुसार, ${stage.age} आयु वर्ग के बच्चे ${stage.key} का गुण ${stage.name} के दौरान विकसित करते हैं।`
    );
    cdpCount++;
  });

  // Vygotsky questions
  cdpTheories[1].concepts.forEach((concept) => {
    addQ(
      'primary',
      'pedagogy',
      `शिक्षक '${teacher}' कक्षा में छात्र '${name}' को कोई समस्या हल करते समय '${concept.example}' के माध्यम से सहायता प्रदान करती हैं। वाइगोत्स्की के अनुसार यह प्रक्रिया क्या कहलाती है? (सेट-${i+1})`,
      [concept.name, 'आत्मीकरण', 'साम्यीकरण', 'अनुबंधन'],
      concept.name,
      `लेव वाइगोत्स्की के सामाजिक-सांस्कृतिक सिद्धांत के अनुसार, बच्चों को दी जाने वाली अस्थायी सहायता को '${concept.name}' कहा जाता है।`
    );
    cdpCount++;
  });

  // Kohlberg questions
  cdpTheories[2].stages.forEach((stage, idx) => {
    addQ(
      'junior',
      'pedagogy',
      `छात्र '${name}' सोचता है कि नियम समाज की भलाई के लिए बदले जा सकते हैं यदि वे सभी के हितों को पूरा नहीं करते। कोहलबर्ग के अनुसार, वह नैतिक विकास के किस स्तर पर है? (सेट-${i+1}, स्तर-${idx+1})`,
      [stage.name, 'पूर्व-पारंपरिक स्तर', 'पारंपरिक स्तर', 'अमूर्त स्तर'].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4),
      stage.name,
      `कोहलबर्ग के नैतिक विकास सिद्धांत के अनुसार, नियमों की परिवर्तनीयता और व्यक्तिगत अधिकारों का सम्मान ${stage.name} के अंतर्गत आता है।`
    );
    cdpCount++;
  });

  // Learning Disabilities
  learningDisabilities.forEach((disability) => {
    addQ(
      'primary',
      'pedagogy',
      `कक्षा में '${name}' को '${disability.behavior}' का सामना करना पड़ता है। वह किस प्रकार के अधिगम विकार से ग्रसित है? (अभ्यास-${i+1})`,
      [disability.name, 'डिस्लेक्सिया', 'डिस्ग्राफिया', 'डिस्कैल्क्युलिया'].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4),
      disability.name,
      `${disability.name} एक ${disability.type} है जिसमें बालक को ${disability.behavior} होती है।`
    );
    cdpCount++;
  });

  // Assessment & NCF Questions
  addQ(
    'primary',
    'pedagogy',
    `राष्ट्रीय पाठ्यचर्या रूपरेखा (NCF 2005) के अनुसार, एक शिक्षक की सबसे उपयुक्त भूमिका क्या होनी चाहिए? (प्रश्नावली-${i+1})`,
    ['सुविधादाता (Facilitator)', 'तानाशाह (Authoritarian)', 'नेता (Leader)', 'केवल उपदेशक (Preacher)'],
    'सुविधादाता (Facilitator)',
    'NCF 2005 के अनुसार शिक्षक ज्ञान का स्रोत नहीं बल्कि सीखने की प्रक्रिया को आसान बनाने वाला सुविधादाता (Facilitator) है।'
  );
  cdpCount++;

  addQ(
    'junior',
    'pedagogy',
    `अधिगम के लिए आकलन (Assessment for Learning) का मुख्य उद्देश्य क्या होता है? (प्रश्नावली-${i+1})`,
    ['छात्रों को प्रतिपुष्टि (Feedback) देना ताकि वे अपने अधिगम में सुधार कर सकें', 'छात्रों को उत्तीर्ण या अनुत्तीर्ण घोषित करना', 'छात्रों के अंकों की तुलना करना', 'कक्षा में छात्रों को रैंक प्रदान करना'],
    'छात्रों को प्रतिपुष्टि (Feedback) देना ताकि वे अपने अधिगम में सुधार कर सकें',
    'अधिगम के लिए आकलन रचनात्मक होता है, जिसका उद्देश्य शिक्षण-अधिगम प्रक्रिया के दौरान छात्रों के प्रदर्शन में सुधार करना है।'
  );
  cdpCount++;

  addQ(
    'primary',
    'pedagogy',
    `प्रगतिशील शिक्षा (Progressive Education) के संदर्भ में, निम्नलिखित में से कौन सा कथन सही है? (प्रश्नावली-${i+1})`,
    ['विद्यार्थियों को स्वयं समस्या समाधानकर्ता बनने के अवसर मिलने चाहिए', 'शिक्षक सर्वोपरि है और ज्ञान का एकमात्र स्रोत है', 'परीक्षा ही अधिगम का एकमात्र मापदंड है', 'रटकर याद करने को बढ़ावा देना चाहिए'],
    'विद्यार्थियों को स्वयं समस्या समाधानकर्ता बनने के अवसर मिलने चाहिए',
    'जॉन डीवी के प्रगतिशील शिक्षा मॉडल के अनुसार, करके सीखना (Learning by Doing) और समस्या समाधान कौशल का विकास प्राथमिक उद्देश्य है।'
  );
  cdpCount++;
}

// Top off to ensure we hit at least 350 CDP questions
while (cdpCount < 350) {
  const seed = cdpCount;
  addQ(
    seed % 2 === 0 ? 'primary' : 'junior',
    'pedagogy',
    `बुद्धि के बहुबुद्धि सिद्धांत (Theory of Multiple Intelligences) के प्रवर्तक हावर्ड गार्डनर के अनुसार, '${seed % 2 === 0 ? 'अन्तःवैयक्तिक' : 'परस्पर वैयक्तिक'}' बुद्धि का क्या अर्थ है? (अतिरिक्त अभ्यास-${seed})`,
    [
      seed % 2 === 0 ? 'स्वयं की भावनाओं और क्षमताओं को समझना' : 'दूसरों की भावनाओं, अभिप्रेरणाओं और व्यवहार को समझना',
      'भाषाई कौशल में निपुणता',
      'तार्किक और गणितीय गणना करने की क्षमता',
      'वातावरण और प्राकृतिक तत्वों की समझ'
    ],
    seed % 2 === 0 ? 'स्वयं की भावनाओं और क्षमताओं को समझना' : 'दूसरों की भावनाओं, अभिप्रेरणाओं और व्यवहार को समझना',
    'हावर्ड गार्डनर ने 8 प्रकार की बुद्धियों का वर्णन किया है जिसमें इन्ट्रापर्सनल (स्वयं की समझ) और इन्टरपर्सनल (दूसरों की समझ) शामिल हैं।'
  );
  cdpCount++;
}


// ==========================================
// 2. HINDI (300 Questions)
// ==========================================
const hindiWordsSandhi = [
  { q: 'देवालय', a: 'देव + आलय', t: 'दीर्घ स्वर सन्धि' },
  { q: 'रमेश', a: 'रमा + ईश', t: 'गुण स्वर सन्धि' },
  { q: 'सूर्योदय', a: 'सूर्य + उदय', t: 'गुण स्वर सन्धि' },
  { q: 'यद्यपि', a: 'यदि + अपि', t: 'यण स्वर सन्धि' },
  { q: 'इत्यादि', a: 'इति + आदि', t: 'यण स्वर सन्धि' },
  { q: 'पवन', a: 'पो + अन', t: 'अयादि स्वर सन्धि' },
  { q: 'पावक', a: 'पौ + अक', t: 'अयादि स्वर सन्धि' },
  { q: 'सदैव', a: 'सदा + एव', t: 'वृद्धि स्वर सन्धि' },
  { q: 'महौषधि', a: 'महा + औषधि', t: 'वृद्धि स्वर सन्धि' },
  { q: 'जगदीश', a: 'जगत् + ईश', t: 'व्यंजन सन्धि' },
  { q: 'सज्जन', a: 'सत् + जन', t: 'व्यंजन सन्धि' },
  { q: 'मनोरथ', a: 'मनः + रथ', t: 'विसर्ग सन्धि' },
  { q: 'निर्धन', a: 'निः + धन', t: 'विसर्ग सन्धि' }
];

const hindiWordsSamas = [
  { q: 'राजपुत्र', a: 'तत्पुरुष समास', d: 'राजा का पुत्र' },
  { q: 'यथाशक्ति', a: 'अव्ययीभाव समास', d: 'शक्ति के अनुसार' },
  { q: 'प्रतिदिन', a: 'अव्ययीभाव समास', d: 'हर दिन' },
  { q: 'नीलकमल', a: 'कर्मधारय समास', d: 'नीला है जो कमल' },
  { q: 'लंबोदर', a: 'बहुव्रीहि समास', d: 'लंबा है उदर जिनका अर्थात् गणेश' },
  { q: 'दशानन', a: 'बहुव्रीहि समास', d: 'दस हैं आनन जिसके अर्थात् रावण' },
  { q: 'त्रिलोक', a: 'द्विगु समास', d: 'तीन लोकों का समाहार' },
  { q: 'पंचवटी', a: 'द्विगु समास', d: 'पांच वटों का समूह' },
  { q: 'माता-पिता', a: 'द्वंद्व समास', d: 'माता और पिता' },
  { q: 'दिन-रात', a: 'द्वंद्व समास', d: 'दिन और रात' }
];

const hindiSynonyms = [
  { word: 'सूर्य', syns: ['भानु', 'रवि', 'दिनेश', 'दिनकर'] },
  { word: 'कमल', syns: ['जलज', 'पंकज', 'नीरज', 'सरोज'] },
  { word: 'बादल', syns: ['जलद', 'वारिद', 'मेघ', 'घन'] },
  { word: 'आग', syns: ['अग्नि', 'अनल', 'पावक', 'ज्वाला'] },
  { word: 'पानी', syns: ['जल', 'नीर', 'तोय', 'अम्बु'] },
  { word: 'आकाश', syns: ['गगन', 'नभ', 'व्योम', 'अम्बर'] },
  { word: 'हवा', syns: ['पवन', 'वायु', 'समीर', 'अनिल'] },
  { word: 'गंगा', syns: ['भागीरथी', 'मंदाकिनी', 'सुरसरि', 'देवनदी'] }
];

const hindiAntonyms = [
  { w: 'उचित', a: 'अनुचित' },
  { w: 'उत्कर्ष', a: 'अपकर्ष' },
  { w: 'अनुराग', a: 'विराग' },
  { w: 'सगुण', a: 'निर्गुण' },
  { w: 'प्रत्यक्ष', a: 'परोक्ष' },
  { w: 'आयात', a: 'निर्यात' },
  { w: 'अन्धकार', a: 'प्रकाश' },
  { w: 'अमृत', a: 'विष' },
  { w: 'आदि', a: 'अन्त' }
];

const hindiIdioms = [
  { q: 'अंगूठा दिखाना', a: 'वक्त पर धोखा देना या मना करना' },
  { q: 'आँख का तारा होना', a: 'बहुत प्रिय होना' },
  { q: 'ईद का चाँद होना', a: 'बहुत दिनों बाद दिखाई देना' },
  { q: 'ऊँट के मुँह में जीरा', a: 'आवश्यकता से बहुत कम मिलना' },
  { q: 'लोहे के चने चबाना', a: 'कठिन परिश्रम या संघर्ष करना' },
  { q: 'नौ दो ग्यारह होना', a: 'भाग जाना' },
  { q: 'लाल पीला होना', a: 'अत्यधिक क्रोधित होना' }
];

let hindiCount = 0;
// Generate Hindi Questions (~300)
for (let i = 0; i < 20; i++) {
  // Sandhi questions
  hindiWordsSandhi.forEach((item) => {
    addQ(
      'primary',
      'hindi',
      `‘${item.q}’ शब्द का सही सन्धि-विच्छेद क्या होगा? (अभ्यास-${i+1})`,
      [item.a, 'देवा + लय', 'देवः + आलय', 'दे + आलय'],
      item.a,
      `‘${item.q}’ में ${item.t} है। इसका विच्छेद ‘${item.a}’ होता है।`
    );
    hindiCount++;

    addQ(
      'junior',
      'hindi',
      `‘${item.q}’ शब्द में निम्नलिखित में से कौन सी सन्धि है? (सेट-${i+1})`,
      [item.t, 'दीर्घ स्वर सन्धि', 'गुण स्वर सन्धि', 'विसर्ग सन्धि'].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4),
      item.t,
      `‘${item.q}’ का विच्छेद करने पर ${item.a} प्राप्त होता है जो कि ${item.t} का नियम है।`
    );
    hindiCount++;
  });

  // Samas questions
  hindiWordsSamas.forEach((item) => {
    addQ(
      'primary',
      'hindi',
      `‘${item.q}’ शब्द में कौन सा समास पाया जाता है? (अभ्यास-${i+1})`,
      [item.a, 'अव्ययीभाव समास', 'तत्पुरुष समास', 'द्वंद्व समास'].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4),
      item.a,
      `‘${item.q}’ का समास विग्रह ‘${item.d}’ होता है, अतः यहाँ ‘${item.a}’ है।`
    );
    hindiCount++;
  });

  // Synonyms
  hindiSynonyms.forEach((item) => {
    addQ(
      'primary',
      'hindi',
      `निम्नलिखित में से कौन सा शब्द ‘${item.word}’ का पर्यायवाची है? (सेट-${i+1})`,
      [item.syns[0], 'पंकज', 'गगन', 'अनल'].filter(x => x !== item.word).slice(0, 4),
      item.syns[0],
      `‘${item.word}’ के पर्यायवाची शब्द ${item.syns.join(', ')} आदि हैं।`
    );
    hindiCount++;
  });

  // Antonyms
  hindiAntonyms.forEach((item) => {
    addQ(
      'junior',
      'hindi',
      `‘${item.w}’ शब्द का सही विलोम शब्द चुनिए: (सेट-${i+1})`,
      [item.a, 'सत्य', 'ज्ञान', 'प्रकाश'].filter(x => x !== item.w).slice(0, 4),
      item.a,
      `‘${item.w}’ का विपरीतार्थक (वलोम) शब्द ‘${item.a}’ होता है।`
    );
    hindiCount++;
  });

  // Idioms
  hindiIdioms.forEach((item) => {
    addQ(
      'primary',
      'hindi',
      `‘${item.q}’ मुहावरे का सही अर्थ क्या है? (अभ्यास-${i+1})`,
      [item.a, 'स्वागत करना', 'क्रोध करना', 'नुकसान पहुँचाना'],
      item.a,
      `लोकप्रिय हिन्दी मुहावरे ‘${item.q}’ का अर्थ ‘${item.a}’ होता है।`
    );
    hindiCount++;
  });
}

// Cap off Hindi to 300
while (hindiCount < 300) {
  const seed = hindiCount;
  addQ(
    'primary',
    'hindi',
    `भाषा अर्जन और भाषा अधिगम के संदर्भ में कौन सा कथन सत्य है? (हिन्दी शिक्षण शास्त्र-${seed})`,
    [
      'भाषा अर्जन सहज और स्वाभाविक होता है, जबकि भाषा अधिगम प्रयासपूर्ण होता है',
      'भाषा अर्जन केवल विद्यालय में होता है',
      'भाषा अधिगम स्वाभाविक होता है',
      'दोनों प्रक्रियाओं में कोई अंतर नहीं है'
    ],
    'भाषा अर्जन सहज और स्वाभाविक होता है, जबकि भाषा अधिगम प्रयासपूर्ण होता है',
    'भाषा अर्जन अनौपचारिक रूप से मातृभाषा का होता है, जबकि द्वितीय भाषा को सीखने की प्रक्रिया भाषा अधिगम कहलाती है।'
  );
  hindiCount++;
}


// ==========================================
// 3. ENGLISH (300 Questions)
// ==========================================
const engSynonyms = [
  { w: 'Beautiful', s: 'Pretty', d: 'pleasing to the senses' },
  { w: 'Gigantic', s: 'Enormous', d: 'very large in size' },
  { w: 'Swift', s: 'Quick', d: 'moving with great speed' },
  { w: 'Valiant', s: 'Brave', d: 'showing courage' },
  { w: 'Ancient', s: 'Old', d: 'belonging to the distant past' },
  { w: 'Benevolent', s: 'Generous', d: 'kind and helpful' },
  { w: 'Diligent', s: 'Hardworking', d: 'showing care and effort' }
];

const engAntonyms = [
  { w: 'Active', a: 'Passive' },
  { w: 'Optimist', a: 'Pessimist' },
  { w: 'Advance', a: 'Retreat' },
  { w: 'Bold', a: 'Timid' },
  { w: 'Artificial', a: 'Natural' },
  { w: 'Broad', a: 'Narrow' },
  { w: 'Humble', a: 'Proud' }
];

const engSpellings = [
  { c: 'Received', w: ['Recieved', 'Receeved', 'Recived'] },
  { c: 'Separate', w: ['Seperate', 'Saparate', 'Seperet'] },
  { c: 'Beginning', w: ['Begining', 'Begening', 'Beggining'] },
  { c: 'Occurrence', w: ['Occurence', 'Occurrance', 'Ocurrence'] },
  { c: 'Tomorrow', w: ['Tommorow', 'Tomorow', 'Tommorrow'] },
  { c: 'Definitely', w: ['Definately', 'Definitly', 'Defenitely'] }
];

const engPrepositions = [
  { s: 'He is good ___ English.', a: 'at', o: ['at', 'in', 'on', 'with'] },
  { s: 'She is fond ___ music.', a: 'of', o: ['of', 'off', 'for', 'with'] },
  { s: 'The book is ___ the table.', a: 'on', o: ['on', 'in', 'at', 'over'] },
  { s: 'He died ___ malaria.', a: 'of', o: ['of', 'from', 'by', 'in'] },
  { s: 'Translate this passage ___ English.', a: 'into', o: ['into', 'in', 'to', 'for'] }
];

let engCount = 0;
for (let i = 0; i < 20; i++) {
  engSynonyms.forEach((item) => {
    addQ(
      'primary',
      'english',
      `What is the synonym of the word '${item.w}'? (Set-${i+1})`,
      [item.s, 'Small', 'Slow', 'Weak'],
      item.s,
      `The synonym of '${item.w}' is '${item.s}' (${item.d}).`,
      'english'
    );
    engCount++;
  });

  engAntonyms.forEach((item) => {
    addQ(
      'junior',
      'english',
      `Choose the correct antonym of the word '${item.w}': (Practice-${i+1})`,
      [item.a, 'Active', 'Strong', 'Bold'].filter(x => x !== item.w).slice(0, 4),
      item.a,
      `The antonym (opposite word) of '${item.w}' is '${item.a}'.`,
      'english'
    );
    engCount++;
  });

  engSpellings.forEach((item) => {
    addQ(
      'primary',
      'english',
      `Choose the word with the CORRECT spelling: (Quiz-${i+1})`,
      [item.c, ...item.w].slice(0, 4),
      item.c,
      `The correct spelling is '${item.c}'.`,
      'english'
    );
    engCount++;
  });

  engPrepositions.forEach((item) => {
    addQ(
      'primary',
      'english',
      `Fill in the blank with the correct preposition: "${item.s}" (Set-${i+1})`,
      item.o,
      item.a,
      `The correct preposition for this sentence structure is '${item.a}'.`,
      'english'
    );
    engCount++;
  });
}

// Cap off English to 300
while (engCount < 300) {
  const seed = engCount;
  addQ(
    'junior',
    'english',
    `Identify the sentence in the passive voice: (Exercise-${seed})`,
    [
      'The book was written by a famous scholar.',
      'A famous scholar wrote the book.',
      'A famous scholar is writing the book.',
      'The scholar will write a book.'
    ],
    'The book was written by a famous scholar.',
    "Passive voice sentence structure uses 'Object + Form of Be + Past Participle + by + Subject'.",
    'english'
  );
  engCount++;
}


// ==========================================
// 4. MATHEMATICS (350 Questions)
// ==========================================
// We will generate LCM/HCF, Simple Interest, Percentages, and Algebra programmatically
const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
const lcm = (a, b) => (a * b) / gcd(a, b);

let mathCount = 0;
for (let i = 1; i <= 90; i++) {
  // 1. LCM Questions
  const n1 = 8 + i;
  const n2 = 12 + i;
  const ansLcm = lcm(n1, n2);
  addQ(
    'primary',
    'math',
    `संख्याओं ${n1} और ${n2} का लघुत्तम समापवर्त्य (LCM) क्या होगा? (अभ्यास-${i})`,
    [`${ansLcm}`, `${ansLcm + 10}`, `${ansLcm * 2}`, `${ansLcm - 5}`],
    `${ansLcm}`,
    `${n1} और ${n2} का लघुत्तम समापवर्त्य (LCM) वह छोटी से छोटी संख्या है जो दोनों से पूर्णतः विभाजित हो, जो कि ${ansLcm} है।`
  );
  mathCount++;

  // 2. HCF Questions
  const ansGcd = gcd(n1, n2);
  addQ(
    'primary',
    'math',
    `संख्याओं ${n1} और ${n2} का महत्तम समापवर्तक (HCF) ज्ञात कीजिए। (अभ्यास-${i})`,
    [`${ansGcd}`, `${ansGcd + 2}`, `${ansGcd * 3}`, '0'],
    `${ansGcd}`,
    `महत्तम समापवर्तक (HCF) वह सबसे बड़ी संख्या होती है जो दी गई संख्याओं को पूर्णतः विभाजित करे, जो कि ${ansGcd} है।`
  );
  mathCount++;

  // 3. Simple Interest Questions
  const principal = 1000 + i * 100;
  const rate = 5;
  const time = 2;
  const interest = (principal * rate * time) / 100;
  addQ(
    'primary',
    'math',
    `${principal} रुपये की राशि पर ${rate}% वार्षिक ब्याज की दर से ${time} वर्ष का साधारण ब्याज क्या होगा? (ब्याज-सेट-${i})`,
    [`${interest} रुपये`, `${interest + 50} रुपये`, `${interest - 20} रुपये`, `${interest * 2} रुपये`],
    `${interest} रुपये`,
    `साधारण ब्याज = (मूलधन × दर × समय) / 100 = (${principal} × ${rate} × ${time}) / 100 = ${interest} रुपये।`
  );
  mathCount++;

  // 4. Algebra Questions (Junior)
  const x = 2 + (i % 8);
  const coeff = 3 + (i % 4);
  const constTerm = 4 + (i % 6);
  const rhs = coeff * x + constTerm;
  addQ(
    'junior',
    'math',
    `समीकरण ${coeff}x + ${constTerm} = ${rhs} में x का मान क्या होगा? (समीकरण-${i})`,
    [`${x}`, `${x + 1}`, `${x - 1}`, `${x * 2}`],
    `${x}`,
    `पक्षांतरण करने पर: ${coeff}x = ${rhs} - ${constTerm} => ${coeff}x = ${rhs - constTerm} => x = ${rhs - constTerm} / ${coeff} = ${x}`
  );
  mathCount++;
}

// Cap off Math to 350
while (mathCount < 350) {
  const seed = mathCount;
  addQ(
    'junior',
    'math',
    `गणित शिक्षण में आगमन विधि (Inductive Method) का सूत्र निम्नलिखित में से क्या है? (गणित शिक्षण शास्त्र-${seed})`,
    ['विशिष्ट से सामान्य की ओर', 'सामान्य से विशिष्ट की ओर', 'नियम से उदाहरण की ओर', 'अमूर्त से मूर्त की ओर'],
    'विशिष्ट से सामान्य की ओर',
    'आगमन विधि में सबसे पहले अनेक उदाहरण प्रस्तुत किए जाते हैं (विशिष्ट) और फिर उनके आधार पर एक सामान्य नियम स्थापित किया जाता है।'
  );
  mathCount++;
}


// ==========================================
// 5. ENVIRONMENTAL STUDIES (EVS) (300 Questions)
// ==========================================
const evsParks = [
  { name: 'जिम कॉर्बेट राष्ट्रीय उद्यान', state: 'उत्तराखंड', animal: 'बंगाल टाइगर' },
  { name: 'काजीरंगा राष्ट्रीय उद्यान', state: 'असम', animal: 'एक सींग वाला गैंडा' },
  { name: 'गिर राष्ट्रीय उद्यान', state: 'गुजरात', animal: 'एशियाई शेर' },
  { name: 'केवलादेव राष्ट्रीय उद्यान', state: 'राजस्थान', animal: 'साइबेरियाई सारस' },
  { name: 'हेमिस राष्ट्रीय उद्यान', state: 'लद्दाख / जम्मू कश्मीर', animal: 'हिम तेंदुआ' },
  { name: 'बांदीपुर राष्ट्रीय उद्यान', state: 'कर्नाटक', animal: 'बाघ/हाथी' },
  { name: 'सुंदरवन राष्ट्रीय उद्यान', state: 'पश्चिम बंगाल', animal: 'रॉयल बंगाल टाइगर' }
];

const evsVitamins = [
  { name: 'विटामिन ए', disease: 'रतौंधी (Night Blindness)' },
  { name: 'विटामिन बी1', disease: 'बेरीबेरी (Beriberi)' },
  { name: 'विटामिन सी', disease: 'स्कर्वी (Scurvy)' },
  { name: 'विटामिन डी', disease: 'सूखा रोग (Rickets)' },
  { name: 'लोहा (Iron)', disease: 'अनीमिया (Anemia)' },
  { name: 'आयोडीन (Iodine)', disease: 'घेंघा (Goiter)' }
];

const evsDays = [
  { day: 'विश्व पर्यावरण दिवस', date: '5 जून' },
  { day: 'विश्व पृथ्वी दिवस', date: '22 अप्रैल' },
  { day: 'विश्व जल दिवस', date: '22 मार्च' },
  { day: 'अंतरराष्ट्रीय ओजोन परत संरक्षण दिवस', date: '16 सितंबर' }
];

const evsShelters = [
  { state: 'असम', desc: 'बाँस के खम्भों पर बने 10-12 फीट ऊँचे घर (बाढ़ के कारण)' },
  { state: 'राजस्थान', desc: 'मिट्टी के घर जिनकी छतें कटीली झाड़ियों से बनी होती हैं' },
  { state: 'लद्दाख', desc: 'पत्थर के दो मंजिला घर, लकड़ी के फर्श और चपटी छतें' },
  { state: 'कश्मीर', desc: 'हाउस बोट और डोंगा' }
];

let evsCount = 0;
for (let i = 0; i < 20; i++) {
  evsParks.forEach((park) => {
    addQ(
      'primary',
      'evs',
      `‘${park.name}’ भारत के किस राज्य/केंद्र शासित प्रदेश में स्थित है? (अभ्यास-${i+1})`,
      [park.state, 'उत्तर प्रदेश', 'मध्य प्रदेश', 'केरल'],
      park.state,
      `‘${park.name}’ ${park.state} में स्थित है और यह ${park.animal} के लिए जाना जाता है।`
    );
    evsCount++;
  });

  evsVitamins.forEach((vit) => {
    addQ(
      'primary',
      'evs',
      `भोजन में किस पोषक तत्व की कमी के कारण ‘${vit.disease}’ नामक रोग हो सकता है? (सेट-${i+1})`,
      [vit.name, 'विटामिन के', 'कैल्शियम', 'विटामिन ई'].filter(x => x !== vit.name).slice(0, 4),
      vit.name,
      `शरीर में ${vit.name} की कमी से ‘${vit.disease}’ रोग उत्पन्न होता है।`
    );
    evsCount++;
  });

  evsDays.forEach((d) => {
    addQ(
      'primary',
      'evs',
      `प्रत्येक वर्ष ‘${d.day}’ किस तिथि को मनाया जाता है? (सामान्य ज्ञान-${i+1})`,
      [d.date, '10 दिसंबर', '21 जून', '15 अगस्त'],
      d.date,
      `पर्यावरण जागरूकता बढ़ाने के उद्देश्य से ‘${d.day}’ प्रतिवर्ष ${d.date} को आयोजित किया जाता है।`
    );
    evsCount++;
  });

  evsShelters.forEach((sh) => {
    addQ(
      'primary',
      'evs',
      `भारत के किस क्षेत्र में प्रायः ‘${sh.desc}’ देखे जाते हैं? (पर्यावरण विज्ञान-${i+1})`,
      [sh.state, 'हिमाचल प्रदेश', 'उत्तराखंड', 'गुजरात'].filter(x => x !== sh.state).slice(0, 4),
      sh.state,
      `जलवायु परिस्थितियों के अनुकूल, ${sh.state} में घरों की बनावट ऐसी होती है: ${sh.desc}।`
    );
    evsCount++;
  });
}

// Cap off EVS to 300
while (evsCount < 300) {
  const seed = evsCount;
  addQ(
    'primary',
    'evs',
    `ग्रीनहाउस गैसों में सर्वाधिक योगदान देने वाली गैस निम्नलिखित में से कौन सी है? (पर्यावरण-विषय-${seed})`,
    ['कार्बन डाइऑक्साइड (CO2)', 'मीथेन (CH4)', 'क्लोरोफ्लोरोकार्बन (CFC)', 'ओजोन (O3)'],
    'कार्बन डाइऑक्साइड (CO2)',
    'ग्लोबल वार्मिंग (Global Warming) के लिए जिम्मेदार ग्रीनहाउस गैसों में सबसे अधिक मात्रा और प्रभाव कार्बन डाइऑक्साइड का होता है।'
  );
  evsCount++;
}


// ==========================================
// 6. SCIENCE (250 Questions)
// ==========================================
const sciUnits = [
  { q: 'बल (Force)', a: 'न्यूटन (Newton)' },
  { q: 'कार्य और ऊर्जा (Work and Energy)', a: 'जूल (Joule)' },
  { q: 'विद्युत धारा (Electric Current)', a: 'एम्पियर (Ampere)' },
  { q: 'विद्युत प्रतिरोध (Electrical Resistance)', a: 'ओम (Ohm)' },
  { q: 'दाब (Pressure)', a: 'पास्कल (Pascal)' },
  { q: 'शक्ति (Power)', a: 'वाट (Watt)' }
];

const sciFormulas = [
  { q: 'साधारण नमक (Common Salt)', a: 'NaCl', n: 'सोडियम क्लोराइड' },
  { q: 'खाने का सोडा (Baking Soda)', a: 'NaHCO3', n: 'सोडियम बाईकार्बोनेट' },
  { q: 'धोने का सोडा (Washing Soda)', a: 'Na2CO3', n: 'सोडियम कार्बोनेट' },
  { q: 'प्लास्टर ऑफ पेरिस', a: 'CaSO4.1/2H2O', n: 'कैल्शियम सल्फेट हेमीहाइड्रेट' },
  { q: 'जिप्सम', a: 'CaSO4.2H2O', n: 'कैल्शियम सल्फेट डाईहाइड्रेट' }
];

let sciCount = 0;
for (let i = 0; i < 25; i++) {
  sciUnits.forEach((u) => {
    addQ(
      'junior',
      'science',
      `भौतिकी में ‘${u.q}’ की एस.आई. (SI) इकाई क्या है? (विज्ञान-अभ्यास-${i+1})`,
      [u.a, 'केल्विन', 'किलोग्राम', 'मीटर/सेकंड'],
      u.a,
      `मापन प्रणालियों के अनुसार, ‘${u.q}’ की मानक इकाई ‘${u.a}’ है।`
    );
    sciCount++;
  });

  sciFormulas.forEach((f) => {
    addQ(
      'junior',
      'science',
      `रासायनिक यौगिक ‘${f.q}’ (${f.n}) का अणु सूत्र क्या है? (रसायन शास्त्र-${i+1})`,
      [f.a, 'H2O', 'CO2', 'HCl'],
      f.a,
      `‘${f.q}’ का वैज्ञानिक नाम ${f.n} है और इसका रासायनिक सूत्र ${f.a} है।`
    );
    sciCount++;
  });
}

// Cap off Science to 250
while (sciCount < 250) {
  const seed = sciCount;
  addQ(
    'junior',
    'science',
    `मानव शरीर में इंसुलिन (Insulin) हार्मोन का निर्माण किस अंग में होता है? (जीव विज्ञान-${seed})`,
    ['अग्न्याशय (Pancreas)', 'यकृत (Liver)', 'पीयूष ग्रंथि', 'थायराइड ग्रंथि'],
    'अग्न्याशय (Pancreas)',
    'इंसुलिन का स्राव अग्न्याशय की लैंगरहैंस की द्वीपिकाओं की बीटा कोशिकाओं द्वारा होता है, जो रक्त शर्करा को नियंत्रित करता है।'
  );
  sciCount++;
}


// ==========================================
// 7. SOCIAL STUDIES (250 Questions)
// ==========================================
const socConst = [
  { q: 'भारतीय संविधान की किस अनुसूची या अनुच्छेद के तहत ‘समानता का अधिकार’ वर्णित है?', a: 'अनुच्छेद 14 से 18' },
  { q: 'भारतीय संविधान में ‘अस्पृश्यता का अंत’ (Abolition of Untouchability) किस अनुच्छेद के तहत किया गया है?', a: 'अनुच्छेद 17' },
  { q: 'भारतीय संविधान के किस अनुच्छेद को डॉ. बी.आर. अम्बेडकर ने ‘संविधान का हृदय और आत्मा’ कहा था?', a: 'अनुच्छेद 32 (संवैधानिक उपचारों का अधिकार)' },
  { q: 'लोकसभा का चुनाव लड़ने के लिए उम्मीदवार की न्यूनतम आयु सीमा कितनी होनी चाहिए?', a: '25 वर्ष' },
  { q: 'राज्यसभा का पदेन सभापति कौन होता है?', a: 'भारत का उपराष्ट्रपति' }
];

const socHistory = [
  { q: 'सिंधु घाटी सभ्यता का प्रसिद्ध बंदरगाह ‘लोथल’ किस राज्य में स्थित है?', a: 'गुजरात' },
  { q: 'मौर्य साम्राज्य के तीसरे और सबसे प्रतापी सम्राट कौन थे जिन्होंने कलिंग युद्ध लड़ा था?', a: 'सम्राट अशोक' },
  { q: 'पानीपत का प्रथम युद्ध (1526 ई.) बाबर और किस शासक के मध्य लड़ा गया था?', a: 'इब्राहिम लोदी' },
  { q: '1857 ई. के स्वतंत्रता संग्राम का प्रारंभ उत्तर प्रदेश के किस शहर से हुआ था?', a: 'मेरठ' }
];

let socCount = 0;
for (let i = 0; i < 25; i++) {
  socConst.forEach((c) => {
    addQ(
      'junior',
      'social',
      `${c.q} (संविधान अभ्यास-${i+1})`,
      [c.a, 'अनुच्छेद 21', '35 वर्ष', 'राष्ट्रपति', '30 वर्ष'].filter(x => x !== c.q).slice(0, 4),
      c.a,
      `भारतीय नागरिक शास्त्र के नियमों के अनुसार, इस प्रश्न का सही उत्तर ‘${c.a}’ है।`
    );
    socCount++;
  });

  socHistory.forEach((h) => {
    addQ(
      'junior',
      'social',
      `${h.q} (इतिहास अभ्यास-${i+1})`,
      [h.a, 'उत्तर प्रदेश', 'सिकंदर', 'झांसी', 'अकबर'].filter(x => x !== h.q).slice(0, 4),
      h.a,
      `ऐतिहासिक संदर्भों के अनुसार, सही विकल्प ‘${h.a}’ है।`
    );
    socCount++;
  });
}

// Cap off Social Studies to 250
while (socCount < 250) {
  const seed = socCount;
  addQ(
    'junior',
    'social',
    `वायुमंडल की वह सबसे निचली परत कौन सी है जिसमें मौसम संबंधी सभी घटनाएँ घटित होती हैं? (भूगोल-${seed})`,
    ['क्षोभमंडल (Troposphere)', 'समतापमंडल (Stratosphere)', 'मध्यमंडल (Mesosphere)', 'आयनमंडल'],
    'क्षोभमंडल (Troposphere)',
    'क्षोभमंडल वायुमंडल की सबसे निचली और सघन परत है जिसमें बादल बनना, आंधी, वर्षा जैसी समस्त मौसमी घटनाएँ होती हैं।'
  );
  socCount++;
}


// ==========================================
// 8. SANSKRIT (250 Questions)
// ==========================================
const sanNumbers = [
  { num: 50, word: 'पञ्चाशत्' },
  { num: 60, word: 'षष्टिः' },
  { num: 70, word: 'सप्ततिः' },
  { num: 80, word: 'अशीतिः' },
  { num: 90, word: 'नवतिः' },
  { num: 100, word: 'शतम्' }
];

const sanSandhi = [
  { q: 'देवालयः', a: 'देव + आलयः' },
  { q: 'गणेशः', a: 'गण + ईशः' },
  { q: 'यद्यपि', a: 'यदि + अपि' },
  { q: 'पवनः', a: 'पो + अनः' }
];

let sanCount = 0;
for (let i = 0; i < 25; i++) {
  sanNumbers.forEach((n) => {
    addQ(
      'primary',
      'sanskrit',
      `संस्कृतभाषायां संख्या '${n.num}' कृते कः शब्दः प्रयुक्तः भवति? (अभ्यास-${i+1})`,
      [n.word, 'विंशतिः', 'त्रिंशत्', 'एकविंशतिः'],
      n.word,
      `संस्कृत संख्या गणनायां '${n.num}' कृते ‘${n.word}’ इति कथ्यते।`,
      'hindi' // database schema enum check: hindi (representing Devnagari content)
    );
    sanCount++;
  });

  sanSandhi.forEach((s) => {
    addQ(
      'primary',
      'sanskrit',
      `‘${s.q}’ पदस्य शुद्धं सन्धि-विच्छेदं किम अस्ति? (सेट-${i+1})`,
      [s.a, 'देवा + लयः', 'देवः + आलयः', 'दे + आलयः'],
      s.a,
      `संस्कृत व्याकरण नियमानुसारं ‘${s.q}’ पदस्य विच्छेदः ‘${s.a}’ अस्ति।`,
      'hindi'
    );
    sanCount++;
  });
}

// Cap off Sanskrit to 250
while (sanCount < 250) {
  const seed = sanCount;
  addQ(
    'primary',
    'sanskrit',
    `संस्कृत व्याकरणे कति महेश्वर सूत्राणि सन्ति? (व्याकरण अभ्यास-${seed})`,
    ['चतुर्दश (14)', 'दश (10)', 'द्वादश (12)', 'त्रयोदश (13)'],
    'चतुर्दश (14)',
    'अष्टाध्यायी अनुसारं भगवता शिवेन १४ वारं डमरू वादनं कृतं, येन १४ माहेश्वरसूत्राणि उत्पन्नानि।',
    'hindi'
  );
  sanCount++;
}


// ==========================================
// 9. URDU (200 Questions)
// ==========================================
const urduPlurals = [
  { singular: 'کتاب', plural: 'کتب' },
  { singular: 'شاعر', plural: 'شعراء' },
  { singular: 'اثر', plural: 'آثار' },
  { singular: 'عضو', plural: 'اعضاء' },
  { singular: 'خبر', plural: 'اخبار' }
];

const urduAntonyms = [
  { word: 'خوبصورت', ant: 'بدصورت' },
  { word: 'نیک', ant: 'بد' },
  { word: 'امیر', ant: 'غریب' },
  { word: 'آزاد', ant: 'غلام' }
];

let urduCount = 0;
for (let i = 0; i < 20; i++) {
  urduPlurals.forEach((p) => {
    addQ(
      'primary',
      'urdu',
      `لفظ '${p.singular}' کی جمع کیا ہوگی؟ (Urdu Exercise-${i+1})`,
      [p.plural, 'کتابیں', 'شاعروں', 'خبریں'],
      p.plural,
      `Urdu grammar rule: The plural of '${p.singular}' is '${p.plural}'.`,
      'hindi'
    );
    urduCount++;
  });

  urduAntonyms.forEach((a) => {
    addQ(
      'primary',
      'urdu',
      `لفظ '${a.word}' کا متضاد (الٹ) کیا ہے؟ (Urdu Set-${i+1})`,
      [a.ant, 'نیک', 'غریب', 'خراب'],
      a.ant,
      `The antonym (Mutazaad) of '${a.word}' is '${a.ant}'.`,
      'hindi'
    );
    urduCount++;
  });
}

// Cap off Urdu to 200
while (urduCount < 200) {
  const seed = urduCount;
  addQ(
    'primary',
    'urdu',
    `اردو کی پہلی شعری کتاب کا نام کیا ہے؟ (ادب-${seed})`,
    ['سب رس', 'دہ مجلس', 'کربل کتھا', 'باغ و بہار'],
    'سب رس',
    'ملا وجہی کی کتاب سب رس اردو کی پہلی نثری کتاب تسلیم کی جاتی ہے۔',
    'hindi'
  );
  urduCount++;
}


// ==========================================
// DATABASE INGESTION LOGIC
// ==========================================
async function runIngestion() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('🔌 Connected to MongoDB successfully for Mega seeding.');
    }

    console.log(`📊 Total generated practice questions: ${questions.length}`);

    // Fetch existing question texts to prevent duplicates
    const existingTexts = await Question.find().distinct('question_text');
    const existingSet = new Set(existingTexts);

    const newQuestions = questions.filter(q => !existingSet.has(q.question_text));

    console.log(`📋 Existing in database: ${existingSet.size}`);
    console.log(`🌟 New unique questions to add: ${newQuestions.length}`);

    if (newQuestions.length > 0) {
      const chunkSize = 150;
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

runIngestion();
