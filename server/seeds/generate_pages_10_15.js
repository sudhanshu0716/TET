const fs = require('fs');
const path = require('path');

const questionBank = {
  pedagogy: [
    // Page 11
    { level: 'primary', text: 'जीन पियाजे के संज्ञानात्मक विकास की किस अवस्था में बच्चे अमूर्त चिंतन (Abstract Thinking) करना प्रारंभ करते हैं?', options: ['औपचारिक संक्रियात्मक अवस्था', 'मूर्त संक्रियात्मक अवस्था', 'पूर्व-संक्रियात्मक अवस्था', 'संवेदी-पेशीय अवस्था'], answer: 'औपचारिक संक्रियात्मक अवस्था', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'लेव वाइगोत्स्की के अनुसार, बच्चों के सीखने में निम्नलिखित में से किस कारक की महत्वपूर्ण भूमिका है?', options: ['सामाजिक', 'शारीरिक', 'आनुवंशिक', 'नैतिक'], answer: 'सामाजिक', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'सृजनात्मकता (Creativity) का संबंध मुख्य रूप से किस प्रकार के चिंतन से है?', options: ['अपसारी चिंतन (Divergent Thinking)', 'अभिसारी चिंतन', 'अनुकरण', 'तार्किक चिंतन'], answer: 'अपसारी चिंतन (Divergent Thinking)', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'एक समावेशी कक्षा (Inclusive Classroom) में शिक्षक को क्या करना चाहिए?', options: ['प्रत्येक बच्चे की क्षमता को निखारने का अवसर प्रदान करना', 'केवल प्रतिभाशाली बच्चों पर ध्यान देना', 'कमजोर बच्चों की उपेक्षा करना', 'कठोर नियमों का पालन करना'], answer: 'प्रत्येक बच्चे की क्षमता को निखारने का अवसर प्रदान करना', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'अधिगम असमर्थता (Learning Disability) "डिस्लेक्सिया" (Dyslexia) किससे संबंधित है?', options: ['पठन विकार', 'लेखन विकार', 'गणितीय विकार', 'व्यवहार संबंधी विकार'], answer: 'पठन विकार', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'कोहलबर्ग के नैतिक विकास के सिद्धांत के अनुसार, किस स्तर पर नैतिक निर्णय दूसरों के मानकों पर आधारित होते हैं?', options: ['पारंपरिक स्तर (Conventional)', 'पूर्व-पारंपरिक स्तर', 'उत्तर-पारंपरिक स्तर', 'अमूर्त स्तर'], answer: 'पारंपरिक स्तर (Conventional)', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'बुद्धि के "बहुबुद्धि सिद्धांत" (Theory of Multiple Intelligences) के प्रतिपादक कौन हैं?', options: ['हावर्ड गार्डनर', 'अल्फ्रेड बिने', 'रॉबर्ट स्टर्नबर्ग', 'स्पीयरमैन'], answer: 'हावर्ड गार्डनर', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'राष्ट्रीय पाठ्यचर्या की रूपरेखा (NCF 2005) के अनुसार शिक्षक की क्या भूमिका है?', options: ['सुविधादाता (Facilitator)', 'सत्तातंत्रीय', 'तानाशाह', 'नेता'], answer: 'सुविधादाता (Facilitator)', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'थॉर्नडाइक के अधिगम सिद्धांत के अनुसार, मुख्य नियम कौन सा है?', options: ['अभ्यास का नियम', 'मनोवृत्ति का नियम', 'बहु-अनुक्रिया का नियम', 'आंशिक क्रिया का नियम'], answer: 'अभ्यास का नियम', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'प्रगतिशील शिक्षा (Progressive Education) के संदर्भ में निम्नलिखित में से कौन सा कथन सही है?', options: ['विद्यार्थियों को स्वयं ही सामाजिक समस्याओं को सुलझाने में सक्षम होना चाहिए', 'कक्षा पूरी तरह से शिक्षक-नियंत्रित होनी चाहिए', 'परीक्षा ही अधिगम का एकमात्र पैमाना है', 'विद्यार्थियों में केवल निष्क्रिय श्रवण होना चाहिए'], answer: 'विद्यार्थियों को स्वयं ही सामाजिक समस्याओं को सुलझाने में सक्षम होना चाहिए', source: 'CTET Practice', year: 2026 },

    // Page 12
    { level: 'primary', text: 'विकास का "शिरःपदाभिमुख" (Cephalocaudal) सिद्धांत क्या दर्शाता है?', options: ['विकास सिर से पैर की ओर होता है', 'विकास केंद्र से बाहर की ओर होता है', 'विकास पैर से सिर की ओर होता है', 'विकास सामान्य से विशिष्ट की ओर होता है'], answer: 'विकास सिर से पैर की ओर होता है', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'डिस्ग्राफिया (Dysgraphia) मुख्यतः किस कठिनाई से जुड़ा है?', options: ['लिखने की कठिनाई', 'पढ़ने की कठिनाई', 'गणित करने की कठिनाई', 'सुनने की कठिनाई'], answer: 'लिखने की कठिनाई', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'जीन पियाजे के अनुसार "स्कीमा" (Schema) निर्माण क्या है?', options: ['संवेदी अनुभवों को व्यवस्थित करने की मानसिक संरचना', 'शारीरिक गतिविधियों का अनुकरण', 'पुरस्कार एवं दंड की प्रक्रिया', 'संवेदी अंगों का विकास'], answer: 'संवेदी अनुभवों को व्यवस्थित करने की मानसिक संरचना', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'मनोविज्ञान का जन्म सर्वप्रथम किस शास्त्र के अंग के रूप में हुआ था?', options: ['दर्शनशास्त्र', 'समाजशास्त्र', 'तर्कशास्त्र', 'राजनीतिशास्त्र'], answer: 'दर्शनशास्त्र', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'बाल केंद्रित शिक्षा (Child-Centered Education) में शामिल है:', options: ['बच्चों के लिए हस्तपरक गतिविधियाँ', 'प्रतिबंधित परिवेश में अधिगम', 'शिक्षक का पूर्ण नियंत्रण', 'बच्चों का कोई महत्व न होना'], answer: 'बच्चों के लिए हस्तपरक गतिविधियाँ', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'अधिगम के अंतर्दृष्टि सिद्धांत (Insight Theory) का प्रतिपादन किसने किया था?', options: ['गेस्टाल्टवादियों ने', 'व्यवहारवादियों ने', 'संरचनावादियों ने', 'प्रकार्यवादियों ने'], answer: 'गेस्टाल्टवादियों ने', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'क्रियाप्रसूत अनुबंधन (Operant Conditioning) सिद्धांत के प्रवर्तक कौन हैं?', options: ['बी. एफ. स्किनर', 'आई. पी. पावलव', 'थॉर्नडाइक', 'कोहलर'], answer: 'बी. एफ. स्किनर', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'निम्नलिखित में से कौन सा अधिगम का एक संज्ञानात्मक सिद्धांत है?', options: ['गेस्टाल्ट सिद्धांत', 'समीपता का सिद्धांत', 'शास्त्रीय अनुबंधन', 'क्रियाप्रसूत अनुबंधन'], answer: 'गेस्टाल्ट सिद्धांत', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'व्यक्तिगत विभिन्नताओं (Individual Differences) का मुख्य कारण क्या है?', options: ['आनुवंशिकता और पर्यावरण की अंतःक्रिया', 'केवल आनुवंशिकता', 'केवल सामाजिक परिवेश', 'आर्थिक स्थिति'], answer: 'आनुवंशिकता और पर्यावरण की अंतःक्रिया', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'प्रतिभाशाली शिक्षार्थियों के लिए निम्नलिखित में से कौन सी गतिविधि सबसे उपयुक्त है?', options: ['उन्हें उच्च स्तरीय अमूर्त विचारों के साथ समृद्ध करना', 'सरल अभ्यास कार्य देना', 'कक्षा के अन्य बच्चों को पढ़ाने का काम सौंपना', 'उन्हें अलग बिठाना'], answer: 'उन्हें उच्च स्तरीय अमूर्त विचारों के साथ समृद्ध करना', source: 'CTET Practice', year: 2026 },

    // Page 13
    { level: 'primary', text: 'शिक्षा का अधिकार अधिनियम (RTE Act, 2009) किस आयु वर्ग के बच्चों के लिए मुफ्त और अनिवार्य शिक्षा सुनिश्चित करता है?', options: ['6 से 14 वर्ष', '5 से 10 वर्ष', '3 से 18 वर्ष', '6 से 18 वर्ष'], answer: '6 से 14 वर्ष', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'सीखने का वह नियम जिसके अनुसार अभ्यास करने से अधिगम दृढ़ होता है, कहलाता है:', options: ['अभ्यास का नियम', 'प्रभाव का नियम', 'तत्परता का नियम', 'समीपता का नियम'], answer: 'अभ्यास का नियम', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'बाल्यावस्था (Childhood) को "अनोखा काल" किसने कहा है?', options: ['कोल और ब्रूस', 'रॉस', 'स्टेनली हॉल', 'क्रो एवं क्रो'], answer: 'कोल और ब्रूस', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'किशोरावस्था को "तनाव और तूफान की अवस्था" किसने कहा है?', options: ['स्टेनली हॉल', 'पियाजे', 'वाइगोत्स्की', 'स्किनर'], answer: 'स्टेनली हॉल', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'बुद्धि लब्धि (IQ) मापने का सूत्र मानसिक आयु / वास्तविक आयु × 100 सर्वप्रथम किसने दिया?', options: ['स्टर्न', 'टर्मन', 'बिने', 'स्पीयरमैन'], answer: 'टर्मन', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'अल्बर्ट बांडुरा द्वारा प्रतिपादित अधिगम का सिद्धांत कहलाता है:', options: ['सामाजिक अधिगम सिद्धांत', 'शास्त्रीय अनुबंधन सिद्धांत', 'अंतर्दृष्टि सिद्धांत', 'संज्ञानात्मक विकास सिद्धांत'], answer: 'सामाजिक अधिगम सिद्धांत', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'शिक्षा मनोविज्ञान का मुख्य केंद्र क्या है?', options: ['बालक', 'शिक्षक', 'पाठ्यक्रम', 'अध्ययन विधियाँ'], answer: 'बालक', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'राष्ट्रीय शिक्षा नीति (NEP 2020) के अनुसार शिक्षा का ढांचा क्या है?', options: ['5+3+3+4', '10+2', '5+3+4', '3+4+4+4'], answer: '5+3+3+4', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'मूल्यांकन का मुख्य उद्देश्य क्या होना चाहिए?', options: ['अधिगम की कमियों को पहचानना और सुधार करना', 'छात्रों को उत्तीर्ण/अनुत्तीर्ण घोषित करना', 'छात्रों में प्रतियोगिता बढ़ाना', 'कक्षा नियंत्रण'], answer: 'अधिगम की कमियों को पहचानना और सुधार करना', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'कक्षा में अनुशासन बनाए रखने का सबसे प्रभावी उपाय क्या है?', options: ['शिक्षण कार्य को रोचक और व्यावहारिक बनाना', 'अनुशासनहीन छात्रों को बाहर निकालना', 'अभिभावकों से शिकायत करना', 'शारीरिक दंड देना'], answer: 'शिक्षण कार्य को रोचक और व्यावहारिक बनाना', source: 'CTET Practice', year: 2026 },

    // Page 14
    { level: 'primary', text: 'किंडरगार्टन (Kindergarten) प्रणाली के जनक कौन हैं?', options: ['फ्रोबेल', 'मारिया मोंटेसरी', 'जॉन डीवी', 'किलपैट्रिक'], answer: 'फ्रोबेल', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'खेल विधि (Play-way Method) के प्रवर्तक कौन माने जाते हैं?', options: ['हेनरी कोल्डवेल कुक', 'फ्रोबेल', 'मोंटेसरी', 'थॉर्नडाइक'], answer: 'हेनरी कोल्डवेल कुक', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'प्रायोजना विधि (Project Method) के जनक कौन हैं?', options: ['विलियम हेनरी किलपैट्रिक', 'जॉन डीवी', 'रॉस', 'रूसो'], answer: 'विलियम हेनरी किलपैट्रिक', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'संवेदी गामक अवस्था (Sensory Motor Stage) की अवधि होती है:', options: ['जन्म से 2 वर्ष', '2 से 7 वर्ष', '7 से 11 वर्ष', '11 वर्ष से अधिक'], answer: 'जन्म से 2 वर्ष', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'कक्षा में प्रश्न पूछना:', options: ['अधिगम को उत्प्रेरित करता है', 'समय की बर्बादी है', 'कक्षा में व्यवधान उत्पन्न करता है', 'छात्रों को डराता है'], answer: 'अधिगम को उत्प्रेरित करता है', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'सूक्ष्म शिक्षण (Microteaching) चक्र का प्रथम पद क्या होता है?', options: ['योजना बनाना (Planning)', 'शिक्षण (Teaching)', 'प्रतिपुष्टि (Feedback)', 'पुनः योजना'], answer: 'योजना बनाना (Planning)', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'सूक्ष्म शिक्षण के भारतीय प्रतिमान में कुल कितना समय लगता है?', options: ['36 मिनट', '45 मिनट', '30 मिनट', '40 मिनट'], answer: '36 मिनट', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'सृजनात्मकता की पहचान के लिए टोरेंस ने कौन सा परीक्षण बनाया?', options: ['टोरेंस सृजनात्मक चिंतन परीक्षण', 'अल्फ्रेड बिने परीक्षण', 'भाटिया बैटरी परीक्षण', 'वेक्सलर परीक्षण'], answer: 'टोरेंस सृजनात्मक चिंतन परीक्षण', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'प्रयत्न भूल (Trial and Error) सिद्धांत में थॉर्नडाइक ने किस जानवर पर प्रयोग किया था?', options: ['बिल्ली', 'कुत्ता', 'चूहा', 'चिंपांजी'], answer: 'बिल्ली', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'पावलव ने शास्त्रीय अनुबंधन सिद्धांत में किस पर प्रयोग किया था?', options: ['कुत्ता', 'बिल्ली', 'कबूतर', 'बंदर'], answer: 'कुत्ता', source: 'UPTET Practice', year: 2026 },

    // Page 15 (these 10 questions fill chunk 5, which creates page 15 since 0 is page 10)
    { level: 'primary', text: 'मानसिक मंदता (Mental Retardation) से ग्रसित बालकों की बुद्धि लब्धि (IQ) सामान्यतः होती है:', options: ['70 से कम', '90 से 110', '120 से अधिक', '140 से अधिक'], answer: '70 से कम', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'पियाजे के अनुसार पूर्व-संक्रियात्मक अवस्था (Pre-operational Stage) की अवधि होती है:', options: ['2 से 7 वर्ष', 'जन्म से 2 वर्ष', '7 से 11 वर्ष', '11 से 15 वर्ष'], answer: '2 से 7 वर्ष', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'संवेग (Emotion) शब्द का शाब्दिक अर्थ क्या है?', options: ['उत्तेजना या भावों में उथल-पुथल', 'क्रोध और भय', 'स्नेह और प्रेम', 'शारीरिक हलचल'], answer: 'उत्तेजना या भावों में उथल-पुथल', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'समानता का नियम (Law of Similarity) आनुवंशिकता में क्या बताता है?', options: ['जैसे माता-पिता, वैसी ही संतान', 'माता-पिता से भिन्न संतान', 'माता-पिता के विपरीत संतान', 'संतान में कोई समानता न होना'], answer: 'जैसे माता-पिता, वैसी ही संतान', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'थॉर्नडाइक का सिद्धांत अधिगम के किस वर्ग के अंतर्गत आता है?', options: ['व्यवहारवादी सिद्धांत', 'संज्ञानात्मक सिद्धांत', 'मानवतावादी सिद्धांत', 'मनोविश्लेषणात्मक सिद्धांत'], answer: 'व्यवहारवादी सिद्धांत', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'शिक्षण की आगमन विधि (Inductive Method) का सूत्र निम्नलिखित में से कौन सा है?', options: ['विशिष्ट से सामान्य की ओर', 'सामान्य से विशिष्ट की ओर', 'अमूर्त से मूर्त की ओर', 'नियम से उदाहरण की ओर'], answer: 'विशिष्ट से सामान्य की ओर', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'शिक्षण की निगमन विधि (Deductive Method) का मुख्य सूत्र है:', options: ['सामान्य से विशिष्ट की ओर', 'विशिष्ट से सामान्य की ओर', 'स्थूल से सूक्ष्म की ओर', 'ज्ञात से अज्ञात की ओर'], answer: 'सामान्य से विशिष्ट की ओर', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'मापन और मूल्यांकन में मुख्य अंतर क्या है?', options: ['मूल्यांकन का क्षेत्र व्यापक होता है', 'मापन का क्षेत्र व्यापक होता है', 'दोनों समान हैं', 'मापन गुणात्मक होता है'], answer: 'मूल्यांकन का क्षेत्र व्यापक होता है', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'अभिप्रेरणा (Motivation) का "मांग या आवश्यकता सिद्धांत" किसने दिया था?', options: ['अब्राहम मैस्लो', 'हर्जबर्ग', 'मैकक्लीलैंड', 'स्किनर'], answer: 'अब्राहम मैस्लो', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'क्रियात्मक अनुसंधान (Action Research) का मुख्य उद्देश्य क्या होता है?', options: ['तात्कालिक समस्याओं का समाधान ढूंढना', 'नए सिद्धांतों की खोज', 'शैक्षणिक नीतियों का निर्माण', 'वैज्ञानिक ज्ञान बढ़ाना'], answer: 'तात्कालिक समस्याओं का समाधान ढूंढना', source: 'UPTET Practice', year: 2026 },

    // Page 16 (which will generate page 15 because chunk 0 was page 10 and was skipped. So:
    // chunk 0 -> page 10 (skipped)
    // chunk 1 -> page 11
    // chunk 2 -> page 12
    // chunk 3 -> page 13
    // chunk 4 -> page 14
    // chunk 5 -> page 15 (Created!)
    { level: 'primary', text: '“विकास कभी न समाप्त होने वाली प्रक्रिया है” यह विचार किस सिद्धांत से संबंधित है?', options: ['निरंतरता का सिद्धांत', 'अंतःसंबंध का सिद्धांत', 'एकीकरण का सिद्धांत', 'अंतःक्रिया का सिद्धांत'], answer: 'निरंतरता का सिद्धांत', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'बच्चों के बौद्धिक विकास की चार विशिष्ट अवस्थाओं की पहचान किसने की?', options: ['जीन पियाजे', 'एरिक एरिक्सन', 'स्किनर', 'कोहलबर्ग'], answer: 'जीन पियाजे', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'सीखने के पठार (Learning Plateau) का मुख्य कारण क्या है?', options: ['थकान या प्रेरणा की कमी', 'रुचि की अधिकता', 'अच्छी शिक्षण विधि', 'स्वस्थ वातावरण'], answer: 'थकान या प्रेरणा की कमी', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'व्यक्तित्व मापन की प्रक्षेपी विधि (Projective Technique) कौन सी है?', options: ['प्रासंगिक अन्तर्बोध परीक्षण (TAT)', 'साक्षात्कार', 'प्रश्नावली', 'निरीक्षण'], answer: 'प्रासंगिक अन्तर्बोध परीक्षण (TAT)', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: '“व्यवहार के कारण व्यवहार में परिवर्तन ही अधिगम है” यह कथन किसका है?', options: ['गिलफोर्ड', 'वुडवर्थ', 'स्किनर', 'क्रो एवं क्रो'], answer: 'गिलफोर्ड', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'बुद्धि का द्विकारक सिद्धांत (Two-Factor Theory) किसने प्रतिपादित किया था?', options: ['स्पीयरमैन', 'थॉर्नडाइक', 'बिने', 'गार्डनर'], answer: 'स्पीयरमैन', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'वंचित वर्ग के बच्चों को शिक्षा देने के लिए शिक्षक को क्या करना चाहिए?', options: ['उनके बारे में अधिक जानकारी जुटाने का प्रयास करना और उन्हें कक्षा की गतिविधियों में शामिल करना', 'उन्हें अलग कक्षा में बिठाना', 'उन्हें गृहकार्य न देना', 'उन पर ध्यान न देना'], answer: 'उनके बारे में अधिक जानकारी जुटाने का प्रयास करना और उन्हें कक्षा की गतिविधियों में शामिल करना', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'समावेशी शिक्षा मानती है कि हमें ____ को ____ के अनुरूप बदलना है।', options: ['व्यवस्था / बच्चे', 'बच्चे / व्यवस्था', 'पर्यावरण / परिवार', 'बच्चे / पर्यावरण'], answer: 'व्यवस्था / बच्चे', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'सृजनात्मक बालक में निम्नलिखित में से कौन सा गुण नहीं पाया जाता?', options: ['सीमित रुचि और संकीर्ण सोच', 'जिज्ञासु प्रवृत्ति', 'स्वतंत्र निर्णय क्षमता', 'लचीलापन'], answer: 'सीमित रुचि और संकीर्ण सोच', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'पियाजे के अनुसार संज्ञानात्मक विकास के किस चरण पर बच्चा ‘वस्तु स्थायित्व’ (Object Permanence) प्रदर्शित करता है?', options: ['संवेदी-पेशीय अवस्था (Sensory Motor)', 'पूर्व-संक्रियात्मक अवस्था', 'मूर्त संक्रियात्मक अवस्था', 'औपचारिक संक्रियात्मक अवस्था'], answer: 'संवेदी-पेशीय अवस्था (Sensory Motor)', source: 'CTET Practice', year: 2026 }
  ],
  hindi: [
    // Page 10
    { level: 'primary', text: '‘पवन’ शब्द का sandhi विच्छेद क्या होगा?', options: ['पो + अन', 'पौ + अन', 'प + वन', 'पव + न'], answer: 'पो + अन', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: '‘लंबोदर’ शब्द में कौन सा समास प्रयुक्त हुआ है?', options: ['बहुव्रीहि समास', 'द्विगु समास', 'द्वंद्व समास', 'कर्मधारय समास'], answer: 'बहुव्रीहि समास', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'निम्नलिखित में से कौन सा शब्द ‘बादल’ का पर्यायवाची है?', options: ['नीरद', 'नीरज', 'नीरधि', 'अम्बुज'], answer: 'नीरद', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: '‘अंगूठा दिखाना’ मुहावरे का सही अर्थ क्या है?', options: ['ऐन वक्त पर मना करना', 'चिढ़ाना', 'सहायता करना', 'क्रोधित होना'], answer: 'ऐन वक्त पर मना करना', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'निम्नलिखित में से शुद्ध वर्तनी वाला शब्द चुनिए:', options: ['उज्ज्वल', 'उज्वल', 'उज्ववल', 'ऊज्जवल'], answer: 'उज्ज्वल', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘अभिज्ञान शकुंतलम’ के लेखक कौन हैं?', options: ['कालिदास', 'तुलसीदास', 'कबीरदास', 'सूरदास'], answer: 'कालिदास', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: '‘अंधेर नगरी चौपट राजा’ नाटक के रचयिता कौन हैं?', options: ['भारतेंदु हरिश्चंद्र', 'महावीर प्रसाद द्विवेदी', 'रामचंद्र शुक्ल', 'जयशंकर प्रसाद'], answer: 'भारतेंदु हरिश्चंद्र', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘कनक कनक ते सौ गुनी मादकता अधिकाय’ में कौन सा अलंकार है?', options: ['यमकालंकार', 'अनुप्रास अलंकार', 'श्लेष अलंकार', 'उपमा अलंकार'], answer: 'यमकालंकार', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: '‘जो सब कुछ जानता हो’ के लिए एक शब्द क्या होगा?', options: ['सर्वज्ञ', 'अल्पज्ञ', 'विद्वान', 'बहुज्ञ'], answer: 'सर्वज्ञ', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘सूरसागर’ किस भाषा की रचना है?', options: ['ब्रजभाषा', 'अवधी', 'खड़ी बोली', 'बुंदेली'], answer: 'ब्रजभाषा', source: 'CTET Practice', year: 2026 },

    // Page 11
    { level: 'primary', text: 'हिंदी वर्णमाला में अयोगवाह वर्ण कौन-से हैं?', options: ['अं, अः', 'अ, आ', 'इ, ई', 'उ, ऊ'], answer: 'अं, अः', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: '‘कवि’ शब्द का स्त्रीलिंग रूप क्या होगा?', options: ['कवयित्री', 'कविअत्री', 'कवियित्री', 'कविइत्री'], answer: 'कवयित्री', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'निम्नलिखित में से तद्भव (Tadbhav) शब्द कौन सा है?', options: ['सूरज', 'सूर्य', 'अग्नि', 'दुग्ध'], answer: 'सूरज', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: '‘जो किया गया उपकार न मानता हो’ के लिए एक शब्द:', options: ['कृतघ्न', 'कृतज्ञ', 'उपकारी', 'अकृतज्ञ'], answer: 'कृतघ्न', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'वर्ण ‘क्ष’ किसके योग से बना है?', options: ['क + ष', 'क + च', 'क + छ', 'क + श'], answer: 'क + ष', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘रामचरितमानस’ की रचना किस भाषा में हुई है?', options: ['अवधी', 'ब्रजभाषा', 'मैथिली', 'संस्कृत'], answer: 'अवधी', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: '‘बीजक’ किसकी रचनाओं का संग्रह है?', options: ['कबीर', 'जायसी', 'तुलसी', 'सूरदास'], answer: 'कबीर', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘तरणि तनूजा तट तमाल तरुवर बहु छाए’ में कौन सा अलंकार है?', options: ['अनुप्रास', 'यमक', 'श्लेष', 'रूपक'], answer: 'अनुप्रास', source: 'अनुप्रास', year: 2026 },
    { level: 'junior', text: 'निम्नलिखित में से ‘अमृत’ का विलोम शब्द क्या होगा?', options: ['विष', 'जल', 'सुधा', 'अमी'], answer: 'विष', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘अष्टाध्यायी’ में कौन सा समास है?', options: ['द्विगु समास', 'द्वंद्व समास', 'तत्पुरुष समास', 'कर्मधारय समास'], answer: 'द्विगु समास', source: 'CTET Practice', year: 2026 },

    // Page 12
    { level: 'primary', text: '‘यशोदा’ शब्द का सही संधि विच्छेद क्या होगा?', options: ['यशः + दा', 'यश + ओदा', 'यशो + दा', 'यशः + उदा'], answer: 'यशः + दा', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: '‘आँख का तारा होना’ मुहावरे का सही अर्थ क्या है?', options: ['अत्यधिक प्रिय होना', 'कम दिखाई देना', 'अप्रिय होना', 'नेत्र रोग होना'], answer: 'अत्यधिक प्रिय होना', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: '‘घोड़ा’ शब्द का तत्सम रूप क्या होगा?', options: ['घोटक', 'अश्व', 'तुरंग', 'है'], answer: 'घोटक', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'हिंदी दिवस कब मनाया जाता है?', options: ['14 सितंबर', '5 सितंबर', '2 अक्टूबर', '26 जनवरी'], answer: '14 सितंबर', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'भाषा की सबसे छोटी इकाई कौन सी है?', options: ['वर्ण', 'शब्द', 'वाक्य', 'पद'], answer: 'वर्ण', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘गोदान’ उपन्यास के लेखक कौन हैं?', options: ['मुंशी प्रेमचंद', 'जयशंकर प्रसाद', 'महादेवी वर्मा', 'सुमित्रानंदन पंत'], answer: 'मुंशी प्रेमचंद', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: '‘चारु चंद्र की चंचल किरणें’ में कौन सा अलंकार है?', options: ['अनुप्रास', 'श्लेष', 'यमक', 'उत्प्रेक्षा'], answer: 'अनुप्रास', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘गैविश’ या ‘गौ’ किस संज्ञा भेद के अंतर्गत आता है?', options: ['जातिवाचक संज्ञा', 'व्यक्तिवाचक संज्ञा', 'भाववाचक संज्ञा', 'द्रव्यवाचक संज्ञा'], answer: 'जातिवाचक संज्ञा', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: '‘स्थावर’ का सही विलोम शब्द क्या है?', options: ['जंगम', 'चेतन', 'सचल', 'चंचल'], answer: 'जंगम', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘पुरुषोत्तम’ में कौन सा समास है?', options: ['तत्पुरुष', 'द्वंद्व', 'द्विगु', 'अव्ययीभाव'], answer: 'तत्पुरुष', source: 'CTET Practice', year: 2026 },

    // Page 13
    { level: 'primary', text: '‘नायक’ शब्द का सही संधि विच्छेद क्या होगा?', options: ['नै + अक', 'ने + अक', 'ना + अक', 'नाय + क'], answer: 'नै + अक', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: '‘दशानन’ में कौन सा समास है?', options: ['बहुव्रीहि', 'द्विगु', 'तत्पुरुष', 'द्वंद्व'], answer: 'बहुव्रीहि', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: '‘कमल’ का पर्यायवाची शब्द कौन सा है?', options: ['जलज', 'जलद', 'जलधि', 'वारिद'], answer: 'जलज', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: '‘आकाश’ का सही विलोम शब्द क्या है?', options: ['पाताल', 'धरती', 'गगन', 'पाताल लोक'], answer: 'पाताल', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: '‘मुँह की खाना’ मुहावरे का क्या अर्थ है?', options: ['बुरी तरह हारना', 'भोजन करना', 'अपमानित होना', 'भाग जाना'], answer: 'बुरी तरह हारना', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘पृथ्वीराज रासो’ किसकी रचना है?', options: ['चंदबरदाई', 'नरपति नाल्ह', 'जगनिक', 'दलपति विजय'], answer: 'चंदबरदाई', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: '‘मैला आँचल’ उपन्यास के लेखक कौन हैं?', options: ['फणीश्वरनाथ रेणु', 'प्रेमचंद', 'अज्ञेय', 'यशपाल'], answer: 'फणीश्वरनाथ रेणु', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘चरण कमल बंदौ हरिराई’ में कौन सा अलंकार है?', options: ['रूपक अलंकार', 'उपमा अलंकार', 'उत्प्रेक्षा अलंकार', 'श्लेष अलंकार'], answer: 'रूपक अलंकार', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: '‘मूक’ का सही विलोम शब्द क्या होगा?', options: ['वाचाल', 'शांत', 'भाषी', 'मौन'], answer: 'वाचाल', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘नीलकंठ’ में कौन सा समास है?', options: ['बहुव्रीहि समास', 'तत्पुरुष समास', 'कर्मधारय समास', 'द्वंद्व समास'], answer: 'बहुव्रीहि समास', source: 'CTET Practice', year: 2026 },

    // Page 14
    { level: 'primary', text: '‘गिरीश’ शब्द का सही संधि विच्छेद क्या होगा?', options: ['गिरि + ईश', 'गिरि + इश', 'गीर + ईश', 'गिर + ईश'], answer: 'गिरि + ईश', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: '‘पीतांबर’ में कौन सा समास है?', options: ['बहुव्रीहि', 'तत्पुरुष', 'द्वंद्व', 'अव्ययीभाव'], answer: 'बहुव्रीहि', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: '‘सूर्य’ का पर्यायवाची कौन सा है?', options: ['दिनकर', 'शशांक', 'सुधाकर', 'हिमांश'], answer: 'दिनकर', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: '‘अंधकार’ का विलोम शब्द क्या है?', options: ['प्रकाश', 'उजाला', 'रात', 'किरण'], answer: 'प्रकाश', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: '‘हाथ साफ करना’ मुहावरे का सही अर्थ क्या है?', options: ['चोरी करना', 'हाथ धोना', 'सफाई करना', 'मेहनत करना'], answer: 'चोरी करना', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘कामायनी’ महाकाव्य के रचयिता कौन हैं?', options: ['जयशंकर प्रसाद', 'सूर्यकांत त्रिपाठी निराला', 'सुमित्रानंदन पंत', 'महादेवी वर्मा'], answer: 'जयशंकर प्रसाद', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: '‘यामा’ किसकी रचनाओं का संग्रह है?', options: ['महादेवी वर्मा', 'सुभद्रा कुमारी चौहान', 'मीराबाई', 'मन्नू भंडारी'], answer: 'महादेवी वर्मा', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘रहिमन पानी राखिए बिन पानी सब सून’ में कौन सा अलंकार है?', options: ['श्लेष अलंकार', 'यमक अलंकार', 'अनुप्रास अलंकार', 'रूपक अलंकार'], answer: 'श्लेष अलंकार', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘वक्र’ का सही विलोम शब्द क्या होगा?', options: ['ऋजु', 'सीधा', 'तिरछा', 'टेढ़ा'], answer: 'ऋजु', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘सज्जन’ शब्द का संधि विच्छेद क्या होगा?', options: ['सत् + जन', 'सज + जन', 'सद + जन', 'सजा + न'], answer: 'सत् + जन', source: 'CTET Practice', year: 2026 },

    // Page 15
    { level: 'primary', text: '‘पावक’ शब्द का सही संधि विच्छेद क्या होगा?', options: ['पौ + अक', 'पो + अक', 'पा + अवक', 'पाव + क'], answer: 'पौ + अक', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: '‘त्रिफला’ में कौन सा समास है?', options: ['द्विगु समास', 'द्वंद्व समास', 'तत्पुरुष समास', 'कर्मधारय समास'], answer: 'द्विगु समास', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: '‘गंगा’ का पर्यायवाची शब्द कौन सा है?', options: ['भागीरथी', 'सरस्वती', 'कालिंदी', 'यमुना'], answer: 'भागीरथी', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: '‘अल्पायु’ का सही विलोम शब्द क्या होगा?', options: ['दीर्घायु', 'अतिआयु', 'चिरंजीवी', 'कमआयु'], answer: 'दीर्घायु', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: '‘आसमान पर चढ़ाना’ मुहावरे का क्या अर्थ है?', options: ['अत्यधिक प्रशंसा करना', 'कठिन कार्य करना', 'ऊपर जाना', 'अभिमान करना'], answer: 'अत्यधिक प्रशंसा करना', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘गोदान’ के अतिरिक्त मुंशी प्रेमचंद का अन्य प्रसिद्ध उपन्यास कौन सा है?', options: ['गबन', 'तितली', 'कंकाल', 'शेखर एक जीवनी'], answer: 'गबन', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: '‘साकेत’ महाकाव्य के रचयिता कौन हैं?', options: ['मैथिलीशरण गुप्त', 'महादेवी वर्मा', 'रामधारी सिंह दिनकर', 'जयशंकर प्रसाद'], answer: 'मैथिलीशरण गुप्त', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘कबीरा खड़ा बाजार में मांगे सबकी खैर’ पंक्तियाँ किसकी हैं?', options: ['कबीरदास', 'सूरदास', 'रहीमदास', 'तुलसीदास'], answer: 'कबीरदास', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: '‘निर्दय’ का सही विलोम शब्द क्या होगा?', options: ['सदय', 'सहृदय', 'दयालु', 'कृपालु'], answer: 'सदय', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘चक्रपाणि’ में कौन सा समास है?', options: ['बहुव्रीहि समास', 'तत्पुरुष समास', 'कर्मधारय समास', 'अव्ययीभाव समास'], answer: 'बहुव्रीहि समास', source: 'CTET Practice', year: 2026 }
  ],
  english: [
    // Page 10
    { level: 'primary', text: 'Choose the correct synonym for the word "Magnificent":', options: ['Splendid', 'Ordinary', 'Ugly', 'Weak'], answer: 'Splendid', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'primary', text: 'Identify the antonym of the word "Humble":', options: ['Proud', 'Modest', 'Polite', 'Gentle'], answer: 'Proud', source: 'CTET Practice', year: 2026, language: 'english' },
    { level: 'primary', text: 'Fill in the blank: He has been working here ____ five years.', options: ['for', 'since', 'from', 'during'], answer: 'for', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'primary', text: 'Choose the correct spelling of the word:', options: ['Necessary', 'Neccessary', 'Necesary', 'Necassary'], answer: 'Necessary', source: 'CTET Practice', year: 2026, language: 'english' },
    { level: 'primary', text: 'Identify the noun type for the word "Honesty":', options: ['Abstract Noun', 'Common Noun', 'Proper Noun', 'Collective Noun'], answer: 'Abstract Noun', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'junior', text: 'Identify the figure of speech: "He is as brave as a lion."', options: ['Simile', 'Metaphor', 'Personification', 'Hyperbole'], answer: 'Simile', source: 'CTET Practice', year: 2026, language: 'english' },
    { level: 'junior', text: 'Which of the following is a synonym of "Reluctant"?', options: ['Unwilling', 'Eager', 'Ready', 'Happy'], answer: 'Unwilling', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'junior', text: 'Complete the sentence: If I had known, I ____ helped you.', options: ['would have', 'will have', 'should', 'would'], answer: 'would have', source: 'CTET Practice', year: 2026, language: 'english' },
    { level: 'junior', text: 'Change the sentence into passive voice: "She sang a beautiful song."', options: ['A beautiful song was sung by her.', 'A beautiful song is sung by her.', 'A beautiful song had sung by her.', 'A beautiful song has been sung by her.'], answer: 'A beautiful song was sung by her.', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'junior', text: 'Select the correct option to fill in: Neither of the two boys ____ present.', options: ['was', 'were', 'are', 'have been'], answer: 'was', source: 'CTET Practice', year: 2026, language: 'english' },

    // Page 11
    { level: 'primary', text: 'What is the plural of the word "Knife"?', options: ['Knives', 'Knifes', 'Knifess', 'Knife'], answer: 'Knives', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'primary', text: 'Choose the correct article: Iron is ____ useful metal.', options: ['a', 'an', 'the', 'no article'], answer: 'a', source: 'CTET Practice', year: 2026, language: 'english' },
    { level: 'primary', text: 'Identify the adverb in the sentence: "She ran quickly to the door."', options: ['quickly', 'ran', 'door', 'to'], answer: 'quickly', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'primary', text: 'What is the past tense of the verb "Go"?', options: ['Went', 'Gone', 'Going', 'Goes'], answer: 'Went', source: 'CTET Practice', year: 2026, language: 'english' },
    { level: 'primary', text: 'Choose the correct pronoun: Every student should bring ____ own book.', options: ['his', 'their', 'our', 'they'], answer: 'his', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'junior', text: 'Identify the error in: "The sceneries of Kashmir are very beautiful."', options: ['sceneries', 'are', 'beautiful', 'Kashmir'], answer: 'sceneries', source: 'CTET Practice', year: 2026, language: 'english' },
    { level: 'junior', text: 'Which word is the antonym of "Barren"?', options: ['Fertile', 'Dry', 'Empty', 'Harsh'], answer: 'Fertile', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'junior', text: 'Identify the passive voice of: "Who wrote this book?"', options: ['By whom was this book written?', 'Who has written this book?', 'This book is written by whom?', 'Whom wrote this book?'], answer: 'By whom was this book written?', source: 'CTET Practice', year: 2026, language: 'english' },
    { level: 'junior', text: 'Choose the correct spelling:', options: ['Curriculum', 'Curiculum', 'Curricullum', 'Curicullum'], answer: 'Curriculum', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'junior', text: 'Complete the idiom: "A blessing in ____"', options: ['disguise', 'hiding', 'mask', 'pain'], answer: 'disguise', source: 'CTET Practice', year: 2026, language: 'english' },

    // Page 12
    { level: 'primary', text: 'Choose the correct preposition: She is afraid ____ spiders.', options: ['of', 'from', 'by', 'with'], answer: 'of', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'primary', text: 'What is the feminine gender of "Monk"?', options: ['Nun', 'Priestess', 'Lady', 'Mother'], answer: 'Nun', source: 'CTET Practice', year: 2026, language: 'english' },
    { level: 'primary', text: 'Choose the correct synonym of "Peculiar":', options: ['Strange', 'Common', 'Simple', 'Normal'], answer: 'Strange', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'primary', text: 'Fill in: Five miles ____ a long distance to walk.', options: ['is', 'are', 'were', 'have been'], answer: 'is', source: 'CTET Practice', year: 2026, language: 'english' },
    { level: 'primary', text: 'Choose the correct spelling:', options: ['Receive', 'Recieve', 'Receeve', 'Recive'], answer: 'Receive', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'junior', text: 'Identify the clause in red: "The boy *who won the race* is my cousin."', options: ['Adjective Clause', 'Noun Clause', 'Adverb Clause', 'Principal Clause'], answer: 'Adjective Clause', source: 'CTET Practice', year: 2026, language: 'english' },
    { level: 'junior', text: 'What is the synonym of "Apathy"?', options: ['Indifference', 'Sympathy', 'Empathy', 'Anger'], answer: 'Indifference', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'junior', text: 'What is the antonym of "Ambiguous"?', options: ['Clear', 'Vague', 'Obscure', 'Uncertain'], answer: 'Clear', source: 'CTET Practice', year: 2026, language: 'english' },
    { level: 'junior', text: 'Change the voice: "Do not spit on the floor."', options: ['You are forbidden to spit on the floor.', 'Let floor not be spitted on.', 'Let the floor not spit.', 'Do not spit on the floor.'], answer: 'You are forbidden to spit on the floor.', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'junior', text: 'Identify the parts of speech for "brave" in: "He is a brave soldier."', options: ['Adjective', 'Noun', 'Pronoun', 'Verb'], answer: 'Adjective', source: 'CTET Practice', year: 2026, language: 'english' },

    // Page 13
    { level: 'primary', text: 'Choose the antonym of "Beautiful":', options: ['Ugly', 'Pretty', 'Attractive', 'Nice'], answer: 'Ugly', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'primary', text: 'Choose the correct article: He is ____ IAS officer.', options: ['an', 'a', 'the', 'no article'], answer: 'an', source: 'CTET Practice', year: 2026, language: 'english' },
    { level: 'primary', text: 'Choose the plural of "Child":', options: ['Children', 'Childs', 'Childrens', 'Childes'], answer: 'Children', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'primary', text: 'Choose the synonym of "Huge":', options: ['Large', 'Tiny', 'Small', 'Short'], answer: 'Large', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'primary', text: 'Fill in: She lives ____ New Delhi.', options: ['in', 'at', 'on', 'into'], answer: 'in', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'junior', text: 'Choose the correct synonym of "Loquacious":', options: ['Talkative', 'Silent', 'Smart', 'Sad'], answer: 'Talkative', source: 'CTET Practice', year: 2026, language: 'english' },
    { level: 'junior', text: 'Choose the correct spelling:', options: ['Lieutenant', 'Leutenant', 'Lieutanant', 'Lutenant'], answer: 'Lieutenant', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'junior', text: 'Identify the sentence in passive voice:', options: ['The house was built by him.', 'He built the house.', 'He is building the house.', 'He will build the house.'], answer: 'The house was built by him.', source: 'CTET Practice', year: 2026, language: 'english' },
    { level: 'junior', text: 'Identify the antonym of "Nadir":', options: ['Zenith', 'Bottom', 'Base', 'Deep'], answer: 'Zenith', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'junior', text: 'Identify the part of speech of "under" in: "The cat is under the table."', options: ['Preposition', 'Adverb', 'Noun', 'Conjunction'], answer: 'Preposition', source: 'CTET Practice', year: 2026, language: 'english' },

    // Page 14
    { level: 'primary', text: 'Choose the correct spelling:', options: ['Believe', 'Beleeve', 'Belive', 'Believee'], answer: 'Believe', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'primary', text: 'What is the past participle of "Speak"?', options: ['Spoken', 'Spoke', 'Speaks', 'Speaking'], answer: 'Spoken', source: 'CTET Practice', year: 2026, language: 'english' },
    { level: 'primary', text: 'Identify the pronoun in: "They went to the market."', options: ['They', 'went', 'market', 'to'], answer: 'They', source: 'They', year: 2026, language: 'english' },
    { level: 'primary', text: 'Choose the synonym of "Courage":', options: ['Bravery', 'Fear', 'Sadness', 'Anger'], answer: 'Bravery', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'primary', text: 'Fill in: The book is ____ the table.', options: ['on', 'in', 'at', 'into'], answer: 'on', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'junior', text: 'What is the meaning of the phrase "Piece of cake"?', options: ['Very easy', 'Very hard', 'A small portion', 'Sweet taste'], answer: 'Very easy', source: 'CTET Practice', year: 2026, language: 'english' },
    { level: 'junior', text: 'Choose the correct passive voice: "They are playing football."', options: ['Football is being played by them.', 'Football was played by them.', 'Football is played by them.', 'Football has been played by them.'], answer: 'Football is being played by them.', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'junior', text: 'Identify the synonym of "Benevolent":', options: ['Kind', 'Cruel', 'Selfish', 'Greedy'], answer: 'Kind', source: 'CTET Practice', year: 2026, language: 'english' },
    { level: 'junior', text: 'Identify the antonym of "Transient":', options: ['Permanent', 'Temporary', 'Short', 'Brief'], answer: 'Permanent', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'junior', text: 'Complete the sentence: He is too weak ____ walk.', options: ['to', 'for', 'at', 'in'], answer: 'to', source: 'CTET Practice', year: 2026, language: 'english' },

    // Page 15
    { level: 'primary', text: 'Choose the correct spelling:', options: ['Tomorrow', 'Tommorow', 'Tomorow', 'Tommorrow'], answer: 'Tomorrow', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'primary', text: 'What is the past participle of "Eat"?', options: ['Eaten', 'Ate', 'Eating', 'Eats'], answer: 'Eaten', source: 'CTET Practice', year: 2026, language: 'english' },
    { level: 'primary', text: 'Identify the adverb in: "He solved the puzzle easily."', options: ['easily', 'solved', 'puzzle', 'He'], answer: 'easily', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'primary', text: 'Choose the synonym of "Silent":', options: ['Quiet', 'Noisy', 'Loud', 'Shouting'], answer: 'Quiet', source: 'CTET Practice', year: 2026, language: 'english' },
    { level: 'primary', text: 'Fill in: The birds flew ____ the trees.', options: ['over', 'under', 'at', 'in'], answer: 'over', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'junior', text: 'What does the idiom "Spill the beans" mean?', options: ['Reveal a secret', 'Drop the food', 'Make a mistake', 'Work hard'], answer: 'Reveal a secret', source: 'CTET Practice', year: 2026, language: 'english' },
    { level: 'junior', text: 'Choose the correct passive voice: "Someone stole my pen."', options: ['My pen was stolen.', 'My pen is stolen.', 'My pen has been stolen.', 'My pen was steal.'], answer: 'My pen was stolen.', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'junior', text: 'Identify the synonym of "Jovial":', options: ['Cheerful', 'Sad', 'Angry', 'Lazy'], answer: 'Cheerful', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'junior', text: 'Identify the antonym of "Amicable":', options: ['Hostile', 'Friendly', 'Kind', 'Polite'], answer: 'Hostile', source: 'UPTET Practice', year: 2026, language: 'english' },
    { level: 'junior', text: 'Complete the sentence: She is senior ____ me in office.', options: ['to', 'than', 'from', 'with'], answer: 'to', source: 'CTET Practice', year: 2026, language: 'english' }
  ],
  sanskrit: [
    // Page 9
    { level: 'primary', text: '‘सूर्यः’ इत्यस्य पदस्य पर्यायपदं किम्?', options: ['भानुः', 'चन्द्रः', 'जलम्', 'वायुः'], answer: 'भानुः', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'संस्कृतव्याकरणे कति स्वराः स्वीक्रियन्ते?', options: ['त्रयोदश (13)', 'नव (9)', 'एकादश (11)', 'द्वादश (12)'], answer: 'त्रयोदश (13)', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: '‘नदी’ शब्दस्य प्रथमा विभक्तिः एकवचनं किम्?', options: ['नदी', 'नद्यः', 'नद्या', 'नदीम्'], answer: 'नदी', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: '‘पठ्’ धातोः लृट् लकारे उत्तम पुरुष एकवचनं किम्?', options: ['पठिष्यामि', 'पठामि', 'पठिष्यसि', 'पठिष्यति'], answer: 'पठिष्यामि', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: '‘उपकारः’ इत्यस्य विरुद्धार्थकं पदं किम्?', options: ['अपकारः', 'सत्कारः', 'आदरः', 'परोपकारः'], answer: 'अपकारः', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘लघुसिद्धान्तकौमुदी’ कस्य रचना अस्ति?', options: ['वरदराजाचार्यः', 'पाणिनिः', 'पतञ्जलिः', 'भट्टोजिदीक्षितः'], answer: 'वरदराजाचार्यः', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: '‘अष्टाध्यायी’ इत्यस्य ग्रन्थस्य रचयिता कः?', options: ['पाणिनिः', 'कात्यायनः', 'पतञ्जलिः', 'कालिदासः'], answer: 'पाणिनिः', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'संस्कृत वर्णमालायां कति महेश्वर सूत्राणि सन्ति?', options: ['चतुर्दश (14)', 'दश (10)', 'द्वादश (12)', 'षोडश (16)'], answer: 'चतुर्दश (14)', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: '‘विद्यायाः अमृतमश्नुते’ इति कुतः उद्धृतम्?', options: ['ईशावास्योपनिषद्', 'कठोपनिषद्', 'ऋग्वेदः', 'श्रीमद्भगवद्गीता'], answer: 'ईशावास्योपनिषद्', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘महाकवि कालिदासः’ कति नाटकानि अलिखत्?', options: ['त्रीणि (3)', 'द्वे (2)', 'पञ्च (5)', 'सप्त (7)'], answer: 'त्रीणि (3)', source: 'CTET Practice', year: 2026 },

    // Page 10
    { level: 'primary', text: '‘देवालयः’ इत्यत्र कः सन्धिः अस्ति?', options: ['दीर्घसन्धिः', 'गुणसन्धिः', 'वृद्धिसन्धिः', 'यण्सन्धिः'], answer: 'दीर्घसन्धिः', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: '‘पठितुम्’ इत्यत्र कः प्रत्ययः अस्ति?', options: ['तुमुन्', 'क्त्वा', 'ल्यप्', 'क्त'], answer: 'तुमुन्', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: '‘गङ्गा’ शब्दस्य तृतीया विभक्तिः एकवचनं किम्?', options: ['गङ्गया', 'गङ्गाम्', 'गङ्गायाः', 'गङ्गासु'], answer: 'गङ्गया', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'संस्कृतभाषायां कति कारकाणि भवन्ति?', options: ['षट् (6)', 'सप्त (7)', 'अष्ट (8)', 'नव (9)'], answer: 'षट् (6)', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: '‘नायकः’ इत्यस्य पदस्य सन्धि विच्छेदः कः?', options: ['नै + अकः', 'ने + अकः', 'नाय + कः', 'ना + अकः'], answer: 'नै + अकः', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘कादम्बरी’ कस्य सुप्रसिद्धा गद्यकृतिः अस्ति?', options: ['बाणभट्टः', 'दण्डी', 'सुबन्धुः', 'अम्बिकादत्तव्यासः'], answer: 'बाणभट्टः', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: '‘शिशुपालवधम्’ महाकाव्यस्य रचयिता कः?', options: ['माघः', 'भारविः', 'श्रीहर्षः', 'कालिदासः'], answer: 'माघः', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘प्रत्येकम्’ इत्यत्र कः सन्धिः अस्ति?', options: ['यण्सन्धिः', 'गुणसन्धिः', 'वृद्धिसन्धिः', 'अयादिसन्धिः'], answer: 'यण्सन्धिः', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: '‘पितरौ’ इत्यत्र कः समासः अस्ति?', options: ['एकशेषद्वन्द्वः', 'तत्पुरुषः', 'अव्ययीभावः', 'बहुव्रीहिः'], answer: 'एकशेषद्वन्द्वः', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'संस्कृते प्रत्याहाराणां संख्या कति अस्ति?', options: ['द्विचत्वारिंशत् (42)', 'चतुश्चत्वारिंशत् (44)', 'चत्वारिंशत् (40)', 'पञ्चचत्वारिंशत् (45)'], answer: 'द्विचत्वारिंशत् (42)', source: 'CTET Practice', year: 2026 },

    // Page 11
    { level: 'primary', text: '‘कवीन्द्रः’ इत्यत्र कः सन्धिः अस्ति?', options: ['दीर्घसन्धिः', 'गुणसन्धिः', 'वृद्धिसन्धिः', 'यण्सन्धिः'], answer: 'दीर्घसन्धिः', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: '‘हसित्वा’ इत्यत्र कः प्रत्ययः अस्ति?', options: ['क्त्वा', 'ल्यप्', 'तुमुन्', 'क्त'], answer: 'क्त्वा', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: '‘लता’ शब्दस्य द्वितीया विभक्तिः बहुवचनं किम्?', options: ['लताः', 'लताम्', 'लतयोः', 'लतासु'], answer: 'लताः', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: '‘अष्टाविंशतिः’ संख्या का अस्ति?', options: ['28', '18', '38', '48'], answer: '28', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: '‘विद्याहीनः’ इत्यत्र कः समासः अस्ति?', options: ['तत्पुरुषः', 'द्वन्द्वः', 'बहुव्रीहिः', 'अव्ययीभावः'], answer: 'तत्पुरुषः', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘किरातार्जुनीयम्’ महाकाव्यस्य रचयिता कः?', options: ['भारविः', 'माघः', 'श्रीहर्षः', 'कालिदासः'], answer: 'भारविः', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: '‘नैषधीयचरितम्’ महाकाव्यस्य नायकः कः?', options: ['नलः', 'दुष्यन्तः', 'रामः', 'शिशुपालः'], answer: 'नलः', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘कवर्ग’ स्य उच्चारणस्थानं किम् अस्ति?', options: ['कण्ठः', 'तालु', 'मूर्धा', 'दन्ताः'], answer: 'कण्ठः', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: '‘यथाशक्ति’ इत्यत्र कः समासः अस्ति?', options: ['अव्ययीभावः', 'तत्पुरुषः', 'बहुव्रीहिः', 'द्वन्द्वः'], answer: 'अव्ययीभावः', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘अभिज्ञानशकुन्तले’ कति अङ्काः सन्ति?', options: ['सप्त (7)', 'पञ्च (5)', 'अष्ट (8)', 'दश (10)'], answer: 'सप्त (7)', source: 'CTET Practice', year: 2026 },

    // Page 12
    { level: 'primary', text: '‘रमेशः’ इत्यस्य पदस्य सन्धि विच्छेदः कः?', options: ['रमा + ईशः', 'रमे + ईशः', 'रम + ईशः', 'रमा + इशः'], answer: 'रमा + ईशः', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: '‘विहस्य’ इत्यत्र कः प्रत्ययः अस्ति?', options: ['ल्यप्', 'क्त्वा', 'तुमुन्', 'क्त'], answer: 'ल्यप्', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: '‘पठन्ति’ इत्यत्र कः लकारः अस्ति?', options: ['लट् लकारः', 'लोट् लकारः', 'लृट् लकारः', 'लङ् लकारः'], answer: 'लट् लकारः', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: '‘पञ्चदश’ संख्या का अस्ति?', options: ['15', '25', '5', '50'], answer: '15', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: '‘चौरभयम्’ इत्यत्र कः समासः अस्ति?', options: ['तत्पुरुषः', 'बहुव्रीहिः', 'द्विगुः', 'द्वन्द्वः'], answer: 'तत्पुरुषः', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘उत्तररामचरितम्’ कस्य कृतिः अस्ति?', options: ['भवभूतिः', 'कालिदासः', 'हर्षः', 'भारविः'], answer: 'भवभूतिः', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: '‘दशकुमारचरितम्’ कस्य गद्यकाव्यम् अस्ति?', options: ['दण्डी', 'बाणभट्टः', 'सुबन्धुः', 'भर्तृहरिः'], answer: 'दण्डी', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: '‘चवर्ग’ स्य उच्चारणस्थानं किम् अस्ति?', options: ['तालु', 'कण्ठः', 'मूर्धा', 'दन्ताः'], answer: 'तालु', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: '‘राजपुरुषः’ इत्यत्र कः समासः अस्ति?', options: ['तत्पुरुषः', 'अव्ययीभावः', 'बहुव्रीहिः', 'द्वन्द्वः'], answer: 'तत्पुरुषः', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘हितोपदेशः’ कस्य रचना अस्ति?', options: ['नारायणपण्डितः', 'विष्णुशर्मा', 'भर्तृहरिः', 'गुण आढ्यः'], answer: 'नारायणपण्डितः', source: 'CTET Practice', year: 2026 },

    // Page 13
    { level: 'primary', text: '‘कवीनाम्’ इत्यत्र का विभक्तिः अस्ति?', options: ['षष्ठी', 'सप्तमी', 'प्रथमा', 'तृतीया'], answer: 'षष्ठी', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: '‘कत्वा’ प्रत्ययस्य योगेन निर्मितं पदं किम्?', options: ['गत्वा', 'गन्तुम्', 'गतवान्', 'गतः'], answer: 'गत्वा', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: '‘लिखितवान्’ इत्यत्र कः प्रत्ययः अस्ति?', options: ['क्तवतु', 'क्त', 'शत्रु', 'शानच्'], answer: 'क्तवतु', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: '‘पञ्चविंशतिः’ संख्या का अस्ति?', options: ['25', '15', '35', '45'], answer: '25', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: '‘घनश्यामः’ इत्यत्र कः समासः अस्ति?', options: ['कर्मधारयः', 'तत्पुरुषः', 'द्विगुः', 'अव्ययीभावः'], answer: 'कर्मधारयः', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘स्वप्नवासवदत्तम्’ कस्य नाटकम् अस्ति?', options: ['भासः', 'कालिदासः', 'भवभूतिः', 'शूद्रकः'], answer: 'भासः', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: '‘मृच्छकटिकम्’ रूपकस्य रचयिता कः?', options: ['शूद्रकः', 'विशाखदत्तः', 'भट्टनारायणः', 'हर्षः'], answer: 'शूद्रकः', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: '‘टवर्ग’ स्य उच्चारणस्थानं किम् अस्ति?', options: ['मूर्धा', 'तालु', 'कण्ठः', 'दन्ताः'], answer: 'मूर्धा', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: '‘नीलोत्पलम्’ इत्यत्र कः समासः अस्ति?', options: ['कर्मधारयः', 'तत्पुरुषः', 'बहुव्रीहिः', 'द्विगुः'], answer: 'कर्मधारयः', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘नीतिशतकम्’ कस्य रचना अस्ति?', options: ['भर्तृहरिः', 'कालिदासः', 'विष्णुशर्मा', 'भवभूतिः'], answer: 'भर्तृहरिः', source: 'CTET Practice', year: 2026 },

    // Page 14
    { level: 'primary', text: '‘हरीशः’ इत्यस्य पदस्य सन्धि विच्छेदः कः?', options: ['हरि + ईशः', 'हरी + ईशः', 'हर + ईशः', 'हरि + इशः'], answer: 'हरि + ईशः', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: '‘भू’ धातोः लट् लकारे प्रथम पुरुष एकवचनं किम्?', options: ['भवति', 'भवामि', 'भवसि', 'भवन्ति'], answer: 'भवति', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: '‘फलम्’ शब्दस्य द्वितीया विभक्तिः एकवचनं किम्?', options: ['फलम्', 'फले', 'फलानि', 'फलेन'], answer: 'फलम्', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: '‘एकविंशतिः’ संख्या का अस्ति?', options: ['21', '11', '31', '41'], answer: '21', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: '‘त्रिभुवनम्’ इत्यत्र कः समासः अस्ति?', options: ['द्विगुः', 'तत्पुरुषः', 'द्वन्द्वः', 'कर्मधारयः'], answer: 'द्विगुः', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘मुद्राराक्षसम्’ नाटकस्य रचयिता कः?', options: ['विशाखदत्तः', 'शूद्रकः', 'भासः', 'कालिदासः'], answer: 'विशाखदत्तः', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: '‘रघुवंशम्’ महाकाव्ये कति सर्गाः सन्ति?', options: ['एकोनविंशतिः (19)', 'सप्तदश (17)', 'अष्टादश (18)', 'विंशतिः (20)'], answer: 'एकोनविंशतिः (19)', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘तवर्ग’ स्य उच्चारणस्थानं किम् अस्ति?', options: ['दन्ताः', 'मूर्धा', 'ओष्ठौ', 'तालु'], answer: 'दन्ताः', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: '‘चन्द्रशेखरः’ इत्यत्र कः समासः अस्ति?', options: ['बहुव्रीहिः', 'तत्पुरुषः', 'कर्मधारयः', 'द्विगुः'], answer: 'बहुव्रीहिः', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘पञ्चतन्त्रम्’ कस्य सुप्रसिद्धा रचना अस्ति?', options: ['विष्णुशर्मा', 'नारायणपण्डितः', 'चाणक्यः', 'भर्तृहरिः'], answer: 'विष्णुशर्मा', source: 'CTET Practice', year: 2026 },

    // Page 15
    { level: 'primary', text: '‘महेन्द्रः’ इत्यस्य पदस्य सन्धि विच्छेदः कः?', options: ['महा + इन्द्रः', 'मही + इन्द्रः', 'महे + इन्द्रः', 'मह + इन्द्रः'], answer: 'महा + इन्द्रः', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: '‘क्रीडितुम्’ इत्यत्र कः प्रत्ययः अस्ति?', options: ['तुमुन्', 'क्त्वा', 'ल्यप्', 'क्त'], answer: 'तुमुन्', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: '‘मयूराः’ इति पदस्य अर्थः कः?', options: ['मोर (Peacocks)', 'कबूतर', 'तोता', 'कोयल'], answer: 'मोर (Peacocks)', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: '‘एकत्रिंशत्’ संख्या का अस्ति?', options: ['31', '21', '41', '11'], answer: '31', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: '‘सूर्योदयः’ इत्यत्र कः सन्धिः अस्ति?', options: ['गुणसन्धिः', 'दीर्घसन्धिः', 'वृद्धिसन्धिः', 'यण्सन्धिः'], answer: 'गुणसन्धिः', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘वेणीसंहारम्’ नाटकस्य रचयिता कतः?', options: ['भट्टनारायणः', 'शूद्रकः', 'भवभूतिः', 'भासः'], answer: 'भट्टनारायणः', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: '‘कुमारसंभवम्’ महाकाव्ये कति सर्गाः सन्ति?', options: ['सप्तदश (17)', 'एकोनविंशतिः (19)', 'अष्टादश (18)', 'षोडश (16)'], answer: 'सप्तदश (17)', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘पवर्ग’ स्य उच्चारणस्थानं किम् अस्ति?', options: ['ओष्ठौ', 'दन्ताः', 'कण्ठः', 'मूर्धा'], answer: 'ओष्ठौ', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: '‘पीताम्बरम्’ इत्यत्र कः समासः अस्ति?', options: ['कर्मधारयः', 'बहुव्रीहिः', 'तत्पुरुषः', 'अव्ययीभावः'], answer: 'कर्मधारयः', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘महाभाष्यम्’ कस्य व्याकरणग्रन्थः अस्ति?', options: ['पतञ्जलिः', 'पाणिनिः', 'कात्यायनः', 'भर्तृहरिः'], answer: 'पतञ्जलिः', source: 'CTET Practice', year: 2026 }
  ],
  urdu: [
    // Page 10
    { level: 'primary', text: 'اردو زبان کا تعلق کس لسانی خاندان سے ہے؟', options: ['ہند یورپی', 'درواڑی', 'سامی', 'چینی'], answer: 'ہند یورپی', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'لفظ "خوبصورت" का متضاد کیا ہے؟', options: ['بدصورت', 'بدشکل', 'حسین', 'پیارا'], answer: 'بدصورت', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'اردو کا پہلا ناول نگار کسे مانا جاتا ہے؟', options: ['ڈپٹی نذیر احمد', 'پریم چند', 'سرشار', 'رسوا'], answer: 'ڈپٹی نذیر احمد', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'غزل کا آخری شعر جس میں شاعر اپنا تخلص استعمال کرتا ہے، کیا کہلاتا ہے؟', options: ['مقطع', 'مطلع', 'حسن مطلع', 'بیت الغزل'], answer: 'مقطع', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'شعر के दोनों مصرعوں کا ہم قافیہ ہونا کیا کہلاتا ہے؟', options: ['ردیف و قافیہ', 'مطلع', 'مقطع', 'تشبیہ'], answer: 'ردیف व قافیہ', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'مسدس کے ایک بند में کتنے مصرعے ہوتے ہیں؟', options: ['چھ (6)', 'चार (4)', 'پانچ (5)', 'آٹھ (8)'], answer: 'چھ (6)', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'علامہ اقبال کی پہلی اردو شعری تصنیف کون سی ہے?', options: ['بانگ درا', 'بال جبریل', 'ضرب کلیم', 'ارمغان حجاز'], answer: 'بانگ درا', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'شعر میں کسی تاریخی واقعہ की तरफ इशारा करने को क्या कहते हैं؟', options: ['تلمیح', 'تشبیہ', 'استعارہ', 'مجاز مرسل'], answer: 'تلمیح', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'اردو का पहला साहब दीवान शायर कौन है؟', options: ['قلی قطب شاہ', 'ولی دکنی', 'میر تقی میر', 'غالب'], answer: 'قلی قطب شاہ', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'کون سا لفظ واحد ہے؟', options: ['کتاب', 'کتب', 'کتابیں', 'کتب خانہ'], answer: 'کتاب', source: 'CTET Practice', year: 2026 },

    // Page 11
    { level: 'primary', text: 'لفظ "دوست" کا متضاد کیا ہے؟', options: ['دشمن', 'یار', 'رفیق', 'ساتھی'], answer: 'دشمن', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'حروف تہجی کی کل تعداد کتنی ہے؟', options: ['37', '36', '39', '38'], answer: '37', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'اردو کا پہلا اخبار کون سا تھا؟', options: ['جام جہاں نما', 'دہلی اردو اخبار', 'الهلال', 'ہمدرد'], answer: 'جام جہاں نما', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'اسم معرفہ کی کتنی قسمیں ہیں؟', options: ['चार (4)', 'پانچ (5)', 'چھ (6)', 'سات (7)'], answer: 'चार (4)', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'لفظ "عقل" की सिफत क्या है؟', options: ['عقل مند', 'عقلی', 'عاقل', 'عقول'], answer: 'عقل مند', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'مثنوی "سحر البیان" کس کی تصنیف ہے؟', options: ['میر حسن', 'میر تقی میر', 'دیا شنکر نسیم', 'شوق نیموی'], answer: 'میر حسن', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'غالب کا پورا نام کیا تھا؟', options: ['اسد اللہ خان غالب', 'مرزا اسد اللہ', 'محمد اسد خان', 'غالب خان'], answer: 'اسد اللہ خان غالب', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'وہ لفظ جو اسم کی جگہ استعمال ہو، اسے کیا کہتے ہیں؟', options: ['ضمیر (Pronoun)', 'صفت', 'فعل', 'حرف'], answer: 'ضمیر (Pronoun)', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: '"آب حیات" کس کی لکھی ہوئی کتاب ہے؟', options: ['محمد حسین آزاد', 'شبلی نعمانی', 'الطاف حسین حالی', 'سر سید'], answer: 'محمد حسین آزاد', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'اردو زبان کا پہلا شاعر کسے مانا جاتا है؟', options: ['امیر خسرو', 'قلی قطب شاہ', 'ولی دکنی', 'میر تقی میر'], answer: 'امیر خسرو', source: 'CTET Practice', year: 2026 },

    // Page 12
    { level: 'primary', text: 'اسم نکرہ کی کتنی قسمیں ہیں؟', options: ['پانچ (5)', 'چھ (6)', 'सात (7)', 'آٹھ (8)'], answer: 'پانچ (5)', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'لفظ "دن" کا متضاد کیا ہے؟', options: ['رات', 'صبح', 'شام', 'دوپہر'], answer: 'رات', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'اردو کس زبان کا لفظ ہے؟', options: ['ترکی', 'فارسی', 'عربی', 'سنسکرत'], answer: 'ترکی', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'اردو کا معنی کیا ہے؟', options: ['لشکر', 'فوج', 'ملنا', 'زبان'], answer: 'لشکر', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'لفظ "سیاہ" کا متضاد کیا ہے؟', options: ['سفید', 'سرخ', 'نیلا', 'ہرا'], answer: 'سفید', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '"حیات جاوید" کس کی سوانح عمری ہے؟', options: ['سر سید احمد خان', 'غالب', 'اقبال', 'حالی'], answer: 'سر سید احمد خان', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'مثنوی "گلزار نسیم" کس की तस्नीफ है؟', options: ['پنڈت دیا شنکر نسیم', 'میر حسن', 'شوق نیموی', 'غالب'], answer: 'پنڈت دیا شنکر نسیم', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'اردو ڈراما نگاری کا شیکسپیئر کسے کہا جاتا ہے؟', options: ['آغا حشر کاشمیری', 'امتیاز علی تاج', 'حبیب تنویر', 'محمد مجیب'], answer: 'آغا حشر काशमीरी', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'شعر کے پہلے مصرعے کو کیا کہتے ہیں؟', options: ['مصرع اولیٰ', 'مصرع ثانی', 'مطلع', 'مقطع'], answer: 'مصرع اولیٰ', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'الطاف حسین حالی کے استاد کون تھے؟', options: ['غالب', 'ذوق', 'مومن', 'داغ'], answer: 'غالب', source: 'CTET Practice', year: 2026 },

    // Page 13
    { level: 'primary', text: 'حروف علت کتنے ہیں؟', options: ['تین (3)', 'چار (4)', 'پانچ (5)', 'دو (2)'], answer: 'تین (3)', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'لفظ "آسمان" کا متضاد کیا ہے؟', options: ['زمین', 'پاتال', 'خلا', 'بادل'], answer: 'زمین', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'لفظ "خوشی" का मुतजाद क्या है؟', options: ['غم', 'غصہ', 'درد', 'رنج'], answer: 'غم', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'اردو کی پہلی شاعرہ کون ہیں؟', options: ['ماہ لقا بائی چندا', 'ادا جعفری', 'زاہدہ خاتون', 'پروین شاکر'], answer: 'ماہ لقا بائی چندا', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'اسم فاعل کی نشاندہی کیجیے:', options: ['قاتل', 'مقتول', 'قتل', 'مقتل'], answer: 'قاتل', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '"شعرائے اردو کا پہلا تذکرہ" کس کتاب کو کہا جاتا ہے؟', options: ['نکات الشعراء', 'تذکرہ ہندی', 'گلشن بے خار', 'آب حیات'], answer: 'نکات الشعراء', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'سر سید احمد خان نے علی گڑھ مسلم یونیورسٹی کی بنیاد کب رکھی؟', options: ['1875', '1877', '1885', '1920'], answer: '1875', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'ناول "امراؤ جان ادا" کس کی تصنیف ہے؟', options: ['مرزا محمد ہادی رسوا', 'ڈپٹی نذیر احمد', 'عبدالحلیم شرر', 'پریم چند'], answer: 'مرزا محمد ہادی رسوا', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'اردو میں "سرسید تحریک" کس صدی میں شروع ہوئی؟', options: ['19ویں صدی', '18ویں صدی', '20ویں صدی', '17ویں صدی'], answer: '19ویں صدی', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'شعر کے دوسرے مصرعے کو کیا کہتے ہیں؟', options: ['مصرع ثانی', 'مصرع اولیٰ', 'بیت', 'فرد'], answer: 'مصرع ثانی', source: 'CTET Practice', year: 2026 },

    // Page 14
    { level: 'primary', text: 'حروف شمسی کتنے ہیں؟', options: ['14', '15', '12', '13'], answer: '14', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'لفظ "روشنی" کا متضاد کیا ہے؟', options: ['تاریکی', 'اندھیرا', 'ظلمت', 'سایہ'], answer: 'تاریکی', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'اردو رسم الخط کیا کہلاتا ہے؟', options: ['نستعلیق', 'نسخ', 'رقعہ', 'شکستہ'], answer: 'نستعلیق', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'اردو ہندی کا قریبی رشتہ کس بولی سے ہے؟', options: ['کھڑی بولی', 'برج بھاشا', 'اودھی', 'مگدھی'], answer: 'کھڑی بولی', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'اسم مفعول کی نشاندہی کیجیے:', options: ['مظلوم', 'ظالم', 'ظلم', 'مظالم'], answer: 'مظلوم', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '"غبار خاطر" کس کے خطوط کا مجموعہ ہے؟', options: ['ابوالکلام آزاد', 'غالب', 'اقبال', 'سر سید'], answer: 'ابوالکلام آزاد', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'شاعر مشرق کس شاعر کو کہا جاتا ہے؟', options: ['علامہ اقبال', 'غالب', 'فیض', 'جوش'], answer: 'علامہ اقبال', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'اردو افسانہ "کفن" کس की तखलीक है؟', options: ['منشی प्रेम चंद', 'کرشن چندر', 'راجندر سنگھ بیدی', 'عصمت چغتائی'], answer: 'منشی प्रेम चंद', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'جس نظم میں اللہ تعالی کی تعریف بیان کی جائے، اسے کیا کہتے ہیں؟', options: ['حمد', 'نعت', 'منقبت', 'قصیدہ'], answer: 'حمد', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'جس نظم میں حضور صلی اللہ علیہ وسلم کی تعریف کی جائے، اسے کیا کہتے हैं؟', options: ['نعت', 'حمد', 'منقبت', 'قصیدہ'], answer: 'نعت', source: 'CTET Practice', year: 2026 },

    // Page 15
    { level: 'primary', text: 'حروف قمری کتنے ہیں؟', options: ['14', '15', '12', '16'], answer: '14', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'لفظ "سستا" کا متضاد کیا ہے؟', options: ['مہنگا', 'قیمتی', 'خالص', 'نیا'], answer: 'مہنگا', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'اردو کا سب سے پہلا ڈراما کون سا ہے؟', options: ['اندر سبھا', 'انارکلی', 'یہودی کی لڑکی', 'رستم و سہراب'], answer: 'اندر سبھا', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'اردو قواعد میں حروف جار کیا کہلاتے ہیں؟', options: ['Prepositions', 'Conjunctions', 'Interjections', 'Verbs'], answer: 'Prepositions', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'لفظ "شمس" کا ہم معنی لفظ کیا ہے؟', options: ['سورج', 'چاند', 'ستارہ', 'آسمان'], answer: 'سورج', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'خدا سخن کس شاعر کو کہا جاتا ہے؟', options: ['میر تقی میر', 'غالب', 'سودا', 'درد'], answer: 'میر تقی میر', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'اردو میں عوامی شاعر کسے کہا جاتا ہے؟', options: ['نظیر اکبر آبادی', 'حالی', 'اقبال', 'اکبر الٰہ آبادی'], answer: 'نظیر اکبر آبادی', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'اردو کی پہلی داستان کون سی ہے؟', options: ['سب رس', 'باغ و بہار', 'فسانہ عجائب', 'بوستان خیال'], answer: 'سب رس', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'جس نظم में صحابہ کرام یا اولیاء کرام کی تعریف کی جائے، اسے کیا کہتے ہیں؟', options: ['منقبت', 'نعت', 'حمد', 'قصیدہ'], answer: 'منقبت', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'بادشاہوں یا امیروں کی تعریف میں لکھی جانے والی نظم کو کیا کہتے ہیں؟', options: ['قصیدہ', 'حمد', 'نعت', 'مرثیہ'], answer: 'قصیدہ', source: 'CTET Practice', year: 2026 }
  ],
  math: [
    // Page 11
    { level: 'primary', text: 'यदि किसी आयत की लंबाई दोगुनी कर दी जाए और चौड़ाई आधी कर दी जाए, तो उसके क्षेत्रफल पर क्या प्रभाव पड़ेगा?', options: ['क्षेत्रफल अपरिवर्तित रहेगा', 'क्षेत्रफल दोगुना हो जाएगा', 'क्षेत्रफल आधा हो जाएगा', 'क्षेत्रफल चार गुना हो जाएगा'], answer: 'क्षेत्रफल अपरिवर्तित रहेगा', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'संख्या 45678 में अंक 6 का स्थानीय मान (Place Value) और अंकित मान (Face Value) का अंतर क्या है?', options: ['594', '600', '6', '590'], answer: '594', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'सबसे छोटी अभाज्य संख्या (Prime Number) कौन सी है?', options: ['2', '1', '3', '0'], answer: '2', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'यदि 15 कलमों का मूल्य ₹180 है, तो 25 कलमों का मूल्य कितना होगा?', options: ['₹300', '₹250', '₹270', '₹320'], answer: '₹300', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'एक त्रिभुज के दो कोण क्रमशः 60° और 70° हैं। तीसरा कोण क्या होगा?', options: ['50°', '60°', '45°', '90°'], answer: '50°', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'यदि 2^x = 128 है, तो x का मान क्या होगा?', options: ['7', '6', '8', '5'], answer: '7', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'एक बेलन का व्यास 14 सेमी और ऊंचाई 10 सेमी है। इसका वक्रपृष्ठीय क्षेत्रफल (Curved Surface Area) क्या होगा?', options: ['440 वर्ग सेमी', '220 वर्ग सेमी', '880 वर्ग सेमी', '1540 वर्ग सेमी'], answer: '440 वर्ग सेमी', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'यदि x + y = 10 और x - y = 4 है, तो x^2 - y^2 का मान क्या होगा?', options: ['40', '16', '100', '28'], answer: '40', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'एक वस्तु का क्रय मूल्य ₹800 है और उसे ₹960 में बेचा जाता है। लाभ प्रतिशत क्या होगा?', options: ['20%', '15%', '25%', '10%'], answer: '20%', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'यदि प्रथम 10 प्राकृतिक संख्याओं का औसत ज्ञात करना हो, तो परिणाम क्या होगा?', options: ['5.5', '5.0', '6.0', '4.5'], answer: '5.5', source: 'CTET Practice', year: 2026 },

    // Page 12
    { level: 'primary', text: '3/4, 5/6, 7/8 में सबसे बड़ी भिन्न (Fraction) कौन सी है?', options: ['7/8', '5/6', '3/4', 'सभी बराबर हैं'], answer: '7/8', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: '₹500 का 10% वार्षिक ब्याज की दर से 2 वर्ष का साधारण ब्याज क्या होगा?', options: ['₹100', '₹50', '₹150', '₹200'], answer: '₹100', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'संख्या 12, 15 और 20 का लघुत्तम समापवर्त्य (LCM) क्या होगा?', options: ['60', '120', '30', '180'], answer: '60', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'एक वर्ग की भुजा 8 सेमी है। इसका क्षेत्रफल क्या होगा?', options: ['64 वर्ग सेमी', '32 वर्ग सेमी', '24 वर्ग सेमी', '16 वर्ग सेमी'], answer: '64 वर्ग सेमी', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: '1 से 50 तक की संख्याओं में कितनी अभाज्य संख्याएँ (Prime Numbers) होती हैं?', options: ['15', '10', '12', '18'], answer: '15', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'यदि (x + 2)(x + 3) = 0 है, तो x के संभावित मान क्या होंगे?', options: ['-2 और -3', '2 और 3', '-2 और 3', '2 और -3'], answer: '-2 और -3', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'यदि किसी वृत्त की परिधि 44 सेमी है, तो इसकी त्रिज्या क्या होगी?', options: ['7 सेमी', '14 सेमी', '3.5 सेमी', '21 सेमी'], answer: '7 सेमी', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'यदि किसी संख्या का 40% भाग 120 है, तो वह संख्या क्या है?', options: ['300', '200', '400', '150'], answer: '300', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'एक कार की चाल 72 किमी/घंटा है। मीटर/सेकंड में इसकी चाल क्या होगी?', options: ['20 meter/second', '25 meter/second', '15 meter/second', '30 meter/second'], answer: '20 meter/second', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'दो संख्याओं का म.स. (HCF) 12 और ल.स. (LCM) 72 है। यदि एक संख्या 36 है, तो दूसरी संख्या क्या होगी?', options: ['24', '18', '48', '30'], answer: '24', source: 'CTET Practice', year: 2026 },

    // Page 13
    { level: 'primary', text: 'एक वृत्त की त्रिज्या 7 सेमी है। इसका क्षेत्रफल क्या होगा? (π = 22/7)', options: ['154 वर्ग सेमी', '44 वर्ग सेमी', '308 वर्ग सेमी', '77 वर्ग सेमी'], answer: '154 वर्ग सेमी', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'संख्या 1/2 + 1/3 का मान क्या होगा?', options: ['5/6', '2/5', '1/5', '2/3'], answer: '5/6', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'यदि एक समबाहु त्रिभुज (Equilateral Triangle) की भुजा 6 सेमी है, तो इसका क्षेत्रफल क्या होगा?', options: ['9√3 वर्ग सेमी', '36 वर्ग सेमी', '18√3 वर्ग सेमी', '12 वर्ग सेमी'], answer: '9√3 वर्ग सेमी', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: '0.005 का प्रतिशत में मान क्या होगा?', options: ['0.5%', '5%', '0.05%', '50%'], answer: '0.5%', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: '35, 45, 55, 65, 75 का समांतर माध्य (Mean) क्या होगा?', options: ['55', '50', '60', '45'], answer: '55', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'यदि x^2 - 5x + 6 = 0 है, तो x के मूल (Roots) क्या होंगे?', options: ['2, 3', '-2, -3', '1, 6', '-1, -6'], answer: '2, 3', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'एक घन का आयतन 216 घन सेमी है। इसकी एक भुजा की लंबाई क्या होगी?', options: ['6 सेमी', '8 सेमी', '12 सेमी', '4 सेमी'], answer: '6 सेमी', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'यदि tan A = 4/3 है, तो sin A का मान क्या होगा?', options: ['4/5', '3/5', '5/4', '5/3'], answer: '4/5', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'प्रथम 5 अभाज्य संख्याओं का योगफल क्या होगा?', options: ['28', '26', '18', '30'], answer: '28', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'यदि किसी संख्या का वर्ग 625 है, तो उस संख्या का घनमूल (Cube Root of the number) क्या होगा?', options: ['5 (since number is 25)', '25', '125', '15'], answer: '5 (since number is 25)', source: 'CTET Practice', year: 2026 },

    // Page 14
    { level: 'primary', text: 'रोमन पद्धति में संख्या 90 को कैसे लिखा जाता है?', options: ['XC', 'LXXXX', 'C', 'CX'], answer: 'XC', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'एक कोण का मान 105° है, यह कौन सा कोण है?', options: ['अधिक कोण (Obtuse Angle)', 'न्यून कोण (Acute Angle)', 'समकोण (Right Angle)', 'ऋजु कोण (Straight Angle)'], answer: 'अधिक कोण (Obtuse Angle)', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'संख्या 3.05 को भिन्न के रूप में बदलने पर क्या प्राप्त होगा?', options: ['61/20', '305/10', '15/2', '31/10'], answer: '61/20', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'यदि 1 मीटर = 100 सेमी है, तो 5 वर्ग मीटर में कितने वर्ग सेमी होंगे?', options: ['50000 वर्ग सेमी', '500 वर्ग सेमी', '5000 वर्ग सेमी', '500000 वर्ग सेमी'], answer: '50000 वर्ग सेमी', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'एक कमरे की लंबाई 5 मीटर, चौड़ाई 4 मीटर और ऊंचाई 3 मीटर है। कमरे की चारों दीवारों का क्षेत्रफल क्या होगा?', options: ['54 वर्ग मीटर', '60 वर्ग मीटर', '94 वर्ग मीटर', '48 वर्ग मीटर'], answer: '54 वर्ग मीटर', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'यदि किसी बहुभुज (Polygon) के अंतःकोणों का योग 720° है, तो उसमें भुजाओं की संख्या क्या होगी?', options: ['6', '5', '8', '7'], answer: '6', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'यदि log_10 (x) = 3 है, तो x का मान क्या होगा?', options: ['1000', '100', '30', '10'], answer: '1000', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'एक वृत्त की जीवा की लंबाई 16 सेमी है और वह केंद्र से 6 सेमी की दूरी पर है। वृत्त की त्रिज्या क्या होगी?', options: ['10 सेमी', '8 सेमी', '12 सेमी', '14 सेमी'], answer: '10 सेमी', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'यदि a:b = 2:3 and b:c = 4:5 है, तो a:b:c का मान क्या होगा?', options: ['8:12:15', '2:4:5', '8:10:15', '6:9:15'], answer: '8:12:15', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'यदि 10 पुरुष एक काम को 6 दिन में कर सकते हैं, तो 15 पुरुष उस काम को कितने दिन में करेंगे?', options: ['4 दिन', '5 दिन', '3 दिन', '8 दिन'], answer: '4 दिन', source: 'CTET Practice', year: 2026 },

    // Page 15 (this chunk was page 14 previously. Let's make sure it is generated, then we add another chunk for page 15)
    { level: 'primary', text: 'सबसे छोटी पूर्ण संख्या (Whole Number) कौन सी है?', options: ['0', '1', '-1', 'कोई नहीं'], answer: '0', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: '1/3 को दशमलव रूप में लिखने पर क्या प्राप्त होगा?', options: ['0.333...', '0.3', '0.03', '0.34'], answer: '0.333...', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'एक समकोण त्रिभुज का आधार 3 सेमी और ऊंचाई 4 सेमी है। इसका कर्ण (Hypotenuse) क्या होगा?', options: ['5 सेमी', '7 सेमी', '6 सेमी', '25 सेमी'], answer: '5 सेमी', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'यदि x/5 = 12 है, तो x का मान क्या होगा?', options: ['60', '17', '7', '2.4'], answer: '60', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: '3, 5, 8, 12, 17, ? श्रेणी का अगला पद क्या होगा?', options: ['23', '22', '24', '21'], answer: '23', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'एक गोले (Sphere) की त्रिज्या 3 सेमी है। इसका आयतन क्या होगा?', options: ['36π घन सेमी', '12π घन सेमी', '108π घन सेमी', '27π घन सेमी'], answer: '36π घन सेमी', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'एक पासे (Dice) को फेंकने पर सम संख्या (Even Number) आने की प्रायिकता (Probability) क्या होगी?', options: ['1/2', '1/6', '1/3', '2/3'], answer: '1/2', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'यदि sec A + tan A = p है, तो sec A - tan A का मान क्या होगा?', options: ['1/p', 'p', '-p', '1 - p'], answer: '1/p', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'यदि (x - 1) बहुपद x^2 - kx + 2 का एक गुणनखंड है, तो k का मान क्या होगा?', options: ['3', '2', '1', '4'], answer: '3', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'एक आयताकार मैदान का क्षेत्रफल 150 वर्ग मीटर है और इसकी चौड़ाई 10 मीटर है। इसका परिमाप क्या होगा?', options: ['50 मीटर', '15 मीटर', '30 मीटर', '60 मीटर'], answer: '50 मीटर', source: 'UPTET Practice', year: 2026 },

    // Page 16 (will map to page 15)
    { level: 'primary', text: '0.1 × 0.1 × 0.1 का मान क्या होगा?', options: ['0.001', '0.01', '0.1', '0.0001'], answer: '0.001', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'यदि किसी वृत्त का व्यास 28 सेमी है, तो उसकी परिधि (Circumference) क्या होगी?', options: ['88 सेमी', '44 सेमी', '176 सेमी', '154 सेमी'], answer: '88 सेमी', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'यदि 10 वस्तुओं का क्रय मूल्य 8 वस्तुओं के विक्रय मूल्य के बराबर है, तो लाभ प्रतिशत क्या होगा?', options: ['25%', '20%', '12.5%', '30%'], answer: '25%', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'एक समकोण त्रिभुज का क्षेत्रफल 30 वर्ग सेमी है और इसका आधार 5 सेमी है। इसकी ऊंचाई क्या होगी?', options: ['12 सेमी', '6 सेमी', '10 सेमी', '15 सेमी'], answer: '12 सेमी', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'संख्या 24 के सभी धनात्मक गुणनखंडों (Factors) का योग क्या होगा?', options: ['60', '56', '48', '54'], answer: '60', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'यदि x^2 + 5x + k = 0 का एक मूल -2 है, तो k का मान क्या होगा?', options: ['6', '5', '4', '8'], answer: '6', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'किसी गोले का पृष्ठीय क्षेत्रफल (Surface Area) 616 वर्ग सेमी है। इसकी त्रिज्या क्या होगी?', options: ['7 सेमी', '14 सेमी', '3.5 सेमी', '21 सेमी'], answer: '7 सेमी', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'यदि log_2 (32) = x है, तो x का मान क्या होगा?', options: ['5', '6', '4', '16'], answer: '5', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'दो पासों (Dice) को एक साथ फेंकने पर दोनों पर समान संख्या (Doublet) आने की प्रायिकता क्या होगी?', options: ['1/6', '1/12', '1/36', '5/6'], answer: '1/6', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '8, 12, 16 और 20 का चतुर्थानुपाती (Fourth Proportional) क्या होगा?', options: ['30', '24', '32', '28'], answer: '30', source: 'CTET Practice', year: 2026 }
  ],
  evs: [
    // Page 11
    { level: 'primary', text: 'चिपको आंदोलन (Chipko Movement) के प्रणेता कौन थे?', options: ['सुंदरलाल बहुगुणा', 'मेधा पाटकर', 'मदर टेरेसा', 'अमृता देवी बिश्नोई'], answer: 'सुंदरलाल बहुगुणा', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'ओजोन परत (Ozone Layer) वायुमंडल के किस भाग में पाई जाती है?', options: ['समतापमंडल (Stratosphere)', 'क्षोभमंडल (Troposphere)', 'मध्यमंडल (Mesosphere)', 'बाह्यमंडल'], answer: 'समतापमंडल (Stratosphere)', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'विश्व पर्यावरण दिवस (World Environment Day) कब मनाया जाता है?', options: ['5 जून', '22 अप्रैल', '16 सितंबर', '21 मार्च'], answer: '5 जून', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'पारिस्थितिकी तंत्र (Ecosystem) शब्द का सबसे पहले प्रयोग किसने किया था?', options: ['ए. जी. टांसले', 'ई. पी. ओडम', 'चार्ल्स डार्विन', 'लैमार्क'], answer: 'ए. जी. टांसले', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'भारत का राष्ट्रीय जलीय जीव (National Aquatic Animal) कौन सा है?', options: ['गंगा डॉल्फिन', 'कछुआ', 'घड़ियाल', 'नीली ह्वेल'], answer: 'गंगा डॉल्फिन', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'काजीरंगा राष्ट्रीय उद्यान (Kaziranga National Park) भारत के किस राज्य में स्थित है?', options: ['असम', 'उत्तराखंड', 'गुजरात', 'राजस्थान'], answer: 'असम', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'निम्नलिखित में से कौन सा ग्रीनहाउस गैस नहीं है?', options: ['नाइट्रोजन', 'CARBON DIOXIDE', 'मीथेन', 'जलवाष्प'], answer: 'नाइट्रोजन', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'जल जनित रोग (Water-borne disease) का उदाहरण निम्नलिखित में से कौन सा है?', options: ['हैजा (Cholera)', 'टीबी (Tuberculosis)', 'खसरा', 'मलेरिया'], answer: 'हैजा (Cholera)', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'शांत घाटी (Silent Valley) किस राज्य में स्थित है जिसे जैव विविधता का हॉटस्पॉट माना जाता है?', options: ['केरल', 'तमिलनाडु', 'उत्तराखंड', 'हिमाचल प्रदेश'], answer: 'केरल', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'सीएनजी (CNG) का मुख्य घटक क्या है?', options: ['मीथेन', 'ब्यूटेन', 'प्रोपेन', 'एथेन'], answer: 'मीथेन', source: 'CTET Practice', year: 2026 },

    // Page 12
    { level: 'primary', text: 'रेड डाटा बुक (Red Data Book) किससे संबंधित है?', options: ['विलुप्ति की कगार पर खड़े जीवों से', 'प्रदूषण से', 'भूजल स्तर घटने से', 'नदियों के पानी से'], answer: 'विलुप्ति की कगार पर खड़े जीवों से', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'पौधों में जल का अधिग्रहण किसके द्वारा होता है?', options: ['जाइलम (Xylem)', 'फ्लोएम (Phloem)', 'कैम्बियम', 'एपिडर्मिस'], answer: 'जाइलम (Xylem)', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'गिर राष्ट्रीय उद्यान (Gir National Park) किस जीव के संरक्षण के लिए प्रसिद्ध है?', options: ['एशियाई शेर (Asiatic Lion)', 'बाघ', 'एक सींग वाला गैंडा', 'हाथी'], answer: 'एशियाई शेर (Asiatic Lion)', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'तम्बाकू की आदत किससे होती है?', options: ['निकोटीन', 'कैफीन', 'कोकीन', 'हिस्टामिन'], answer: 'निकोटीन', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'पर्यावरण संरक्षण अधिनियम किस वर्ष पारित हुआ था?', options: ['1986', '1972', '1992', '2000'], answer: '1986', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'भूकंप की तीव्रता मापने का यंत्र कौन सा है?', options: ['सिस्मोग्राफ (Seismograph)', 'बैरोमीटर', 'कार्डियोग्राफ', 'थर्मामीटर'], answer: 'सिस्मोग्राफ (Seismograph)', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'वायुमंडल में सबसे अधिक प्रतिशत किस गैस का है?', options: ['नाइट्रोजन', 'ऑक्सीजन', 'कार्बन डाइऑक्साइड', 'ऑर्गन'], answer: 'नाइट्रोजन', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'अम्लीय वर्षा (Acid Rain) का मुख्य कारण क्या है?', options: ['सल्फर डाइऑक्साइड (SO2)', 'कार्बन मोनोऑक्साइड', 'मीथेन', 'ओजोन'], answer: 'सल्फर डाइऑक्साइड (SO2)', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'सौर सेल द्वारा किस ऊर्जा को विद्युत ऊर्जा में बदला जाता है?', options: ['प्रकाश ऊर्जा', 'रासायनिक ऊर्जा', 'नाभिकीय ऊर्जा', 'उष्मीय ऊर्जा'], answer: 'प्रकाश ऊर्जा', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'पारिस्थितिक तंत्र में ऊर्जा का मुख्य स्रोत क्या है?', options: ['सूर्य का प्रकाश', 'एटीपी', 'डीएनए', 'आरएनए'], answer: 'सूर्य का प्रकाश', source: 'CTET Practice', year: 2026 },

    // Page 13
    { level: 'primary', text: 'विश्व ओजोन दिवस कब मनाया जाता है?', options: ['16 सितंबर', '21 मार्च', '22 अप्रैल', '5 जून'], answer: '16 सितंबर', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'ग्रीन मफलर (Green Muffler) किससे संबंधित है?', options: ['ध्वनि प्रदूषण से', 'वायु प्रदूषण से', 'जल प्रदूषण से', 'मृदा प्रदूषण से'], answer: 'ध्वनि प्रदूषण से', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'मिनीमाटा (Minamata) रोग किस धातु के पानी में घुलने से होता है?', options: ['पारा (Mercury)', 'कैडमियम', 'सीसा', 'आर्सेनिक'], answer: 'पारा (Mercury)', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'गंगा नदी कहाँ से निकलती है?', options: ['गंगोत्री ग्लेशियर', 'अरावली श्रेणी', 'लद्दाख', 'अमरकंटक'], answer: 'गंगोत्री ग्लेशियर', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'फूलों की घाटी (Valley of Flowers) कहाँ स्थित है?', options: ['उत्तराखंड', 'केरल', 'जम्मू कश्मीर', 'हिमाचल प्रदेश'], answer: 'उत्तराखंड', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'विश्व जल दिवस कब मनाया जाता है?', options: ['22 मार्च', '22 अप्रैल', '5 जून', '16 सितंबर'], answer: '22 मार्च', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'भारत का सबसे पहला राष्ट्रीय उद्यान कौन सा है?', options: ['जिम कॉर्बेट राष्ट्रीय उद्यान', 'काजीरंगा', 'गिर', 'हेमिस'], answer: 'जिम कॉर्बेट राष्ट्रीय उद्यान', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'दूध से दही बनने की प्रक्रिया को क्या कहते हैं?', options: ['किण्वन (Fermentation)', 'आसवन', 'पास्चुरीकरण', 'स्टरलाइजेशन'], answer: 'किण्वन (Fermentation)', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'कौन सा प्रथम साहित्य स्रोत है?', options: ['ऋग्वेद', 'सामवेद', 'यजुर्वेद', 'अथर्ववेद'], answer: 'ऋग्वेद', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'पारिस्थितिक तंत्र में तत्वों के चक्रण को क्या कहते हैं?', options: ['जैव-भू-रासायनिक चक्र', 'रासायनिक चक्र', 'भूवैज्ञानिक चक्र', 'भू-रासायनिक चक्र'], answer: 'जैव-भू-रासायनिक चक्र', source: 'CTET Practice', year: 2026 },

    // Page 14
    { level: 'primary', text: 'विश्व पृथ्वी दिवस (World Earth Day) कब मनाया जाता है?', options: ['22 अप्रैल', '22 मार्च', '5 जून', '16 सितंबर'], answer: '22 अप्रैल', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'टिड्डा, घास और मेंढक की खाद्य श्रृंखला में मेंढक किस श्रेणी का उपभोक्ता है?', options: ['द्वितीयक उपभोक्ता', 'प्राथमिक उपभोक्ता', 'तृतीयक उपभोक्ता', 'उत्पादक'], answer: 'द्वितीयक उपभोक्ता', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'इटाई-इटाई (Itai-Itai) रोग किस धातु के प्रदूषण से होता है?', options: ['कैडमियम (Cadmium)', 'पारा', 'सीसा', 'तांबा'], answer: 'कैडमियम (Cadmium)', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'लौंग और इलायची पौधे के किस भाग से प्राप्त होते हैं?', options: ['फूल (Flower bud)', 'जड़', 'तना', 'फल'], answer: 'फूल (Flower bud)', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'सुंदरवन डेल्टा किस राज्य में स्थित है और यह किसके लिए प्रसिद्ध है?', options: ['पश्चिम बंगाल, सुंदरी वृक्ष और बंगाल टाइगर', 'गुजरात, एशियाई शेर', 'उत्तराखंड, कस्तूरी मृग', 'असम, एक सींग वाला गैंडा'], answer: 'पश्चिम बंगाल, सुंदरी वृक्ष and बंगाल टाइगर', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'ध्वनि प्रदूषण मापने की इकाई क्या है?', options: ['डेसिबल (Decibel)', 'हर्ट्ज', 'जूल', 'न्यूटन'], answer: 'डेसिबल (Decibel)', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'बायोडीजल (Biodiesel) तैयार करने के लिए किस पौधे का उपयोग किया जाता है?', options: ['जेट्रोफा (Jatropha)', 'देवदार', 'यूकेलिप्टस', 'सनाय'], answer: 'जेट्रोफा (Jatropha)', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'पर्यावरण दिवस 2026 की थीम के लिए सबसे प्रमुख उद्देश्य क्या है?', options: ['भूमि पुनर्स्थापना और मरुस्थलीकरण रोकना', 'प्लास्टिक प्रदूषण समाप्त करना', 'वायु की गुणवत्ता सुधारना', 'ग्लोबल वार्मिंग घटाना'], answer: 'भूमि पुनर्स्थापना और मरुस्थलीकरण रोकना', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'काजीरंगा राष्ट्रीय उद्यान असम में किस पशु के लिए प्रसिद्ध है?', options: ['एक सींग वाला गैंडा', 'हाथी', 'रॉयल बंगाल टाइगर', 'कस्तूरी मृग'], answer: 'एक सींग वाला गैंडा', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'वन्यजीव सप्ताह (Wildlife Week) कब मनाया जाता है?', options: ['1 से 7 अक्टूबर', '15 से 21 अक्टूबर', '1 से 7 जून', '15 से 21 जून'], answer: '1 से 7 अक्टूबर', source: 'CTET Practice', year: 2026 },

    // Page 15 (this chunk was page 14 previously. Let's make sure it is generated, then we add another chunk for page 15)
    { level: 'primary', text: 'सुनामी (Tsunami) का मुख्य कारण क्या है?', options: ['समुद्र के अंदर भूकंप आना', 'चक्रवात आना', 'ज्वालामुखी विस्फोट स्थल पर होना', 'ज्वारभाटा'], answer: 'समुद्र के अंदर भूकंप आना', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'निम्नलिखित में से कौन सा भारत का जैविक हॉटस्पॉट (Biodiversity Hotspot) है?', options: ['पश्चिमी घाट (Western Ghats)', 'अरावली श्रेणी', 'थार मरुस्थल', 'पूर्वी घाट'], answer: 'पश्चिमी घाट (Western Ghats)', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'रेगिस्तानी ओक (Desert Oak) नामक वृक्ष कहाँ पाया जाता है?', options: ['ऑस्ट्रेलिया', 'अबू ढाबी', 'राजस्थान', 'सऊदी अरब'], answer: 'ऑस्ट्रेलिया', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'खेजड़ी (Khejri) वृक्ष के बारे में क्या सही है?', options: ['यह छायादार वृक्ष मरुस्थल में पाया जाता है और इसकी छाल से दवा बनती है', 'इसे बहुत अधिक पानी की आवश्यकता होती है', 'यह केवल पहाड़ी इलाकों में उगता है', 'इसकी लकड़ी में कीड़ा नहीं लगता'], answer: 'यह छायादार वृक्ष मरुस्थल में पाया जाता है और इसकी छाल से दवा बनती है', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'घरों के नीचे दी गई विशेषताओं में से लद्दाख के घरों की पहचान कीजिए:', options: ['पत्थर के घर, लकड़ी के फर्श और चपटी छतें', 'बांस के खंभों पर बने घर', 'मिट्टी के घर जिनकी छतें कटीली झाड़ियों की होती हैं', 'हाउसबोट'], answer: 'पत्थर के घर, लकड़ी के फर्श और चपटी छतें', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'मधुबनी (Madhubani) चित्रकला किस राज्य से संबंधित है?', options: ['बिहार', 'उत्तर प्रदेश', 'उत्तराखंड', 'मध्य प्रदेश'], answer: 'बिहार', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'घटपर्णी पौधा (Nepenthes) कीड़े-मकौड़ों का शिकार क्यों करता है?', options: ['नाइट्रोजन की कमी पूरी करने के लिए', 'भोजन बनाने के लिए', 'पानी प्राप्त करने के लिए', 'आकर्षक दिखने के लिए'], answer: 'नाइट्रोजन की कमी पूरी करने के लिए', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'विटामिन सी (Vitamin C) की कमी से कौन सा रोग होता है?', options: ['स्कर्वी', 'रतौंधी', 'बेरी-बेरी', 'रिकेट्स'], answer: 'स्कर्वी', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'रक्त अल्पता (Anemia) से बचने के लिए डॉक्टर क्या खाने की सलाह देते हैं?', options: ['आंवला, पालक और गुड़ (Iron rich)', 'चावल, चीनी और आलू', 'दूध, अंडा और मछली', 'सेब, संतरा और नींबू'], answer: 'आंवला, पालक और गुड़ (Iron rich)', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'मलेरिया परजीवी (Plasmodium) की खोज के लिए किसे नोबेल पुरस्कार मिला था?', options: ['रोनाल्ड रॉस', 'रॉबर्ट कोच', 'एडवर्ड जेनर', 'लुई पाश्चर'], answer: 'रोनाल्ड रॉस', source: 'CTET Practice', year: 2026 },

    // Page 16 (will map to page 15)
    { level: 'primary', text: 'ओजोन परत के क्षरण (Ozone Depletion) के लिए मुख्य रूप से कौन सी गैस उत्तरदायी है?', options: ['क्लोरोफ्लोरोकार्बन (CFC)', 'कार्बन डाइऑक्साइड', 'कार्बन मोनोऑक्साइड', 'मीथेन'], answer: 'क्लोरोफ्लोरोकार्बन (CFC)', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'कान्हा राष्ट्रीय उद्यान (Kanha National Park) भारत के किस राज्य में स्थित है?', options: ['मध्य प्रदेश', 'उत्तर प्रदेश', 'राजस्थान', 'उत्तराखंड'], answer: 'मध्य प्रदेश', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'हमारे पर्यावरण को बचाने के लिए तीन ‘R’ (3 Rs) कौन से हैं?', options: ['कम उपयोग, पुनः चक्रण, पुनः उपयोग', 'कम उपयोग, पुनः उत्पादन, पुनः निर्माण', 'एकत्रित करना, पुनः चक्रण, बेचना', 'सुरक्षित करना, कम करना, फेंकना'], answer: 'कम उपयोग, पुनः चक्रण, पुनः उपयोग', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'किस मृदा का निर्माण लावा द्वारा होता है और जिसमें कपास की खेती सर्वोत्तम होती है?', options: ['काली मिट्टी (Black Soil)', 'लाल मिट्टी', 'जलोढ़ मिट्टी', 'लैटेराइट मिट्टी'], answer: 'काली मिट्टी (Black Soil)', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: 'वायुमंडल की कौन सी परत रेडियो तरंगों को परावर्तित करती है?', options: ['आयनमंडल (Ionosphere)', 'समतापमंडल', 'क्षोभमंडल', 'मध्यमंडल'], answer: 'आयनमंडल (Ionosphere)', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'निम्नलिखित में से कौन सी नदियां डेल्टा नहीं बनातीं बल्कि एस्टुअरी बनाती हैं?', options: ['नर्मदा और ताप्ती', 'गंगा और यमुना', 'महानदी और गोदावरी', 'कृष्णा और कावेरी'], answer: 'नर्मदा और ताप्ती', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: '‘अमृता देवी बिश्नोई पुरस्कार’ किस क्षेत्र में प्रदान किया जाता है?', options: ['वन्यजीव संरक्षण', 'पर्यावरण शिक्षा', 'वन रोपण', 'ऊर्जा संरक्षण'], answer: 'वन्यजीव संरक्षण', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'टाइटन (Titan) किस ग्रह का सबसे बड़ा प्राकृतिक उपग्रह है?', options: ['शनि (Saturn)', 'बृहस्पति', 'मंगल', 'वरुण'], answer: 'शनि (Saturn)', source: 'CTET Practice', year: 2026 },
    { level: 'primary', text: '‘बिहू’ भारत के किस राज्य का प्रसिद्ध लोक नृत्य है?', options: ['असम', 'मेघालय', 'मिजोरम', 'त्रिपुरा'], answer: 'असम', source: 'UPTET Practice', year: 2026 },
    { level: 'primary', text: 'इंसुलिन (Insulin) की रासायनिक प्रकृति क्या है?', options: ['प्रोटीन', 'विटामिन', 'वसा', 'कार्बोहाइड्रेट'], answer: 'प्रोटीन', source: 'CTET Practice', year: 2026 }
  ],
  science: [
    // Page 10
    { level: 'junior', text: 'पानी का घनत्व अधिकतम किस तापमान पर होता है?', options: ['4°C', '0°C', '100°C', '-4°C'], answer: '4°C', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'लाफिंग गैस (Laughing Gas) का रासायनिक नाम क्या है?', options: ['नाइट्रस ऑक्साइड (N2O)', 'नाइट्रिक ऑक्साइड', 'नाइट्रोजन डाइऑक्साइड', 'सल्फर डाइऑक्साइड'], answer: 'नाइट्रस ऑक्साइड (N2O)', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'मानव शरीर में रक्त का थक्का बनाने में कौन सा विटामिन सहायक होता है?', options: ['विटामिन के (Vitamin K)', 'विटामिन सी', 'विटामिन डी', 'विटामिन ए'], answer: 'विटामिन के (Vitamin K)', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'विद्युत बल्ब का फिलामेंट किस धातु का बना होता है?', options: ['टंगस्टन', 'तांबा', 'लोहा', 'नाइक्रोम'], answer: 'टंगस्टन', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'पीतल (Brass) निम्नलिखित में से किन धातुओं की मिश्रधातु (Alloy) है?', options: ['तांबा और जस्ता (Cu + Zn)', 'तांबा और टिन', 'लोहा और कार्बन', 'सीसा और टिन'], answer: 'तांबा और जस्ता (Cu + Zn)', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'इंसुलिन हार्मोन का स्राव शरीर के किस अंग से होता है?', options: ['अग्न्याशय (Pancreas)', 'यकृत (Liver)', 'पीयूष ग्रंथि', 'थायरॉयड ग्रंथि'], answer: 'अग्न्याशय (Pancreas)', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'ध्वनि की चाल सबसे अधिक किस माध्यम में होती है?', options: ['ठोस (Solid)', 'द्रव (Liquid)', 'गैस (Gas)', 'निर्वात (Vacuum)'], answer: 'ठोस (Solid)', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'कार्य का एस.आई. (S.I.) मात्रक क्या है?', options: ['जूल (Joule)', 'वाट', 'न्यूटन', 'पास्कल'], answer: 'जूल (Joule)', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'सर्चलाइट और वाहनों की हेडलाइट में किस दर्पण का उपयोग किया जाता है?', options: ['अवतल दर्पण (Concave Mirror)', 'उत्तल दर्पण', 'समतल दर्पण', 'बेलनाकार दर्पण'], answer: 'अवतल दर्पण (Concave Mirror)', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'प्रकाश संश्लेषण (Photosynthesis) की क्रिया में कौन सी गैस उत्पन्न होती है?', options: ['ऑक्सीजन', 'कार्बन डाइऑक्साइड', 'नाइट्रोजन', 'हाइड्रोजन'], answer: 'ऑक्सीजन', source: 'UPTET Practice', year: 2026 },

    // Page 11
    { level: 'junior', text: 'निकट दृष्टि दोष (Myopia) को दूर करने के लिए किस लेंस का प्रयोग किया जाता है?', options: ['अवतल लेंस (Concave Lens)', 'उत्तल लेंस', 'द्विफोकसी लेंस', 'बेलनाकार लेंस'], answer: 'अवतल लेंस (Concave Lens)', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'भारी जल (Heavy Water) का रासायनिक सूत्र क्या है?', options: ['D2O', 'H2O', 'H2O2', 'CO2'], answer: 'D2O', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'मनुष्य के शरीर में कुल कितनी हड्डियाँ पाई जाती हैं?', options: ['206', '300', '208', '180'], answer: '206', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'किस ग्रंथि को मास्टर ग्रंथि (Master Gland) कहा जाता है?', options: ['पीयूष ग्रंथि (Pituitary Gland)', 'थायरॉयड ग्रंथि', 'अधिवृक्क ग्रंथि', 'अग्न्याशय'], answer: 'पीयूष ग्रंथि (Pituitary Gland)', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'शुद्ध सोने का कैरेट मान क्या होता है?', options: ['24 कैरेट', '22 कैरेट', '18 कैरेट', '20 कैरेट'], answer: '24 कैरेट', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'शुष्क बर्फ (Dry Ice) क्या है?', options: ['ठोस कार्बन डाइऑक्साइड', 'ठोस पानी', 'ठोस नाइट्रोजन', 'ठोस ऑक्सीजन'], answer: 'ठोस कार्बन डाइऑक्साइड', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'रक्त का पीएच (pH) मान कितना होता है?', options: ['7.4', '6.0', '8.0', '7.0'], answer: '7.4', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'विद्युत धारा (Electric Current) मापने का यंत्र कौन सा है?', options: ['अमीटर (Ammeter)', 'वोल्टमीटर', 'गैल्वेनोमीटर', 'लैक्टोमीटर'], answer: 'अमीटर (Ammeter)', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'पेनिसिलिन (Penicillin) की खोज किसने की थी?', options: ['अलेक्जेंडर फ्लेमिंग', 'एडवर्ड जेनर', 'लुई पाश्चर', 'रॉबर्ट कोच'], answer: 'अलेक्जेंडर फ्लेमिंग', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'विटामिन डी (Vitamin D) की कमी से बच्चों में कौन सा रोग होता है?', options: ['सूखा रोग (Rickets)', 'रतौंधी', 'स्कर्वी', 'बेरी-बेरी'], answer: 'सूखा रोग (Rickets)', source: 'CTET Practice', year: 2026 },

    // Page 12
    { level: 'junior', text: 'परम शून्य ताप (Absolute Zero Temperature) का मान क्या है?', options: ['-273.15°C', '0°C', '100°C', '-100°C'], answer: '-273.15°C', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'सिरके (Vinegar) में कौन सा अम्ल पाया जाता है?', options: ['एसिटिक अम्ल (Acetic Acid)', 'सिट्रिक अम्ल', 'लैक्टिक अम्ल', 'टार्टरिक अम्ल'], answer: 'एसिटिक अम्ल (Acetic Acid)', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'सर्वदाता रक्त समूह (Universal Donor Blood Group) कौन सा है?', options: ['O-', 'AB+', 'A+', 'B+'], answer: 'O-', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'ऊर्जा का प्राथमिक स्रोत पेड़-पौधों के लिए क्या है?', options: ['सूर्य का प्रकाश', 'खाद', 'पानी', 'मिट्टी'], answer: 'सूर्य का प्रकाश', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'डायनामाइट (Dynamite) के आविष्कारक कौन थे?', options: ['अल्फ्रेड नोबेल', 'थॉमस एडिसन', 'आइजैक न्यूटन', 'मैरी क्यूरी'], answer: 'अल्फ्रेड नोबेल', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'किस तापमान पर सेल्सियस और फारेनहाइट स्केल का मान समान होता है?', options: ['-40°', '0°', '40°', '-100°'], answer: '-40°', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'मधुमेह (Diabetes) रोग किसकी कमी से होता है?', options: ['इंसुलिन', 'थायरॉक्सिन', 'एड्रिनेलिन', 'एस्ट्रोजन'], answer: 'इंसुलिन', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'आंसुओं में कौन सा एंजाइम पाया जाता है जिससे जीवाणु मर जाते हैं?', options: ['लाइसोसोम (Lysozyme)', 'एमाइलेज', 'पेप्सिन', 'टायलिन'], answer: 'लाइसोसोम (Lysozyme)', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'तारों का टिमटिमाना (Twinkling of Stars) किस घटना के कारण होता है?', options: ['प्रकाश का अपवर्तन (Refraction of Light)', 'प्रकाश का परावर्तन', 'प्रकाश का प्रकीर्णन', 'पूर्ण आंतरिक परावर्तन'], answer: 'प्रकाश का अपवर्तन (Refraction of Light)', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'विद्युत का सबसे अच्छा चालक (Best Conductor of Electricity) कौन सा है?', options: ['चांदी (Silver)', 'तांबा', 'सोना', 'एल्युमीनियम'], answer: 'चांदी (Silver)', source: 'CTET Practice', year: 2026 },

    // Page 13
    { level: 'junior', text: 'द्रव अवस्था में पाई जाने वाली एकमात्र अधातु (Non-metal) कौन सी है?', options: ['ब्रोमीन (Bromine)', 'पारा', 'क्लोरीन', 'आयोडीन'], answer: 'ब्रोमीन (Bromine)', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'दूध की शुद्धता मापने का यंत्र कौन सा है?', options: ['लैक्टोमीटर (Lactometer)', 'हाइड्रोमीटर', 'बैरोमीटर', 'थर्मामीटर'], answer: 'लैक्टोमीटर (Lactometer)', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'मानव हृदय में कितने कक्ष (Chambers) होते हैं?', options: ['चार (4)', 'दो (2)', 'तीन (3)', 'एक (1)'], answer: 'चार (4)', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'जंग लगने पर लोहे के भार में क्या परिवर्तन होता है?', options: ['भार बढ़ जाता है', 'भार घट जाता है', 'भार अपरिवर्तित रहता है', 'पहले घटता है फिर बढ़ता है'], answer: 'भार बढ़ जाता है', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'रेडियोएक्टिविटी की खोज किसने की थी?', options: ['हेनरी बेकरल', 'मैरी क्यूरी', 'रदरफोर्ड', 'जे. जे. थॉमसन'], answer: 'हेनरी बेकरल', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'किस रंग के प्रकाश का प्रकीर्णन (Scattering) सबसे अधिक होता है?', options: ['बैंगनी (Violet)', 'लाल', 'नीला', 'पीला'], answer: 'बैंगनी (Violet)', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'रसोई गैस (LPG) में महक के लिए कौन सा पदार्थ मिलाया जाता है?', options: ['एथिल मरकैप्टन (Ethyl Mercaptan)', 'ब्यूटेन', 'प्रोपेन', 'मीथेन'], answer: 'एथिल मरकैप्टन (Ethyl Mercaptan)', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'मलेरिया रोग किस मच्छर के काटने से फैलता है?', options: ['मादा एनोफेलीज (Female Anopheles)', 'नर एनोफेलीज', 'एडीज', 'क्यूलेक्स'], answer: 'मादा एनोफेलीज (Female Anopheles)', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'आनुवंशिकी के जनक (Father of Genetics) कौन हैं?', options: ['ग्रेगर जॉन मेंडल', 'चार्ल्स डार्विन', 'लैमार्क', 'डी व्रीज'], answer: 'ग्रेगर जॉन मेंडल', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'प्रकाश वर्ष (Light Year) किसका मात्रक है?', options: ['दूरी का (Distance)', 'समय का', 'प्रकाश की तीव्रता का', 'वेग का'], answer: 'दूरी का (Distance)', source: 'CTET Practice', year: 2026 },

    // Page 14
    { level: 'junior', text: 'दूध का पीला रंग किसके कारण होता है?', options: ['कैरोटीन (Carotene)', 'केसीन', 'लैक्टोज', 'राइबोफ्लेविन'], answer: 'कैरोटीन (Carotene)', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'हंसाने वाली गैस का सूत्र क्या है?', options: ['N2O', 'NO2', 'NO', 'NH3'], answer: 'N2O', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'विद्युत हीटर की कुंडली (Heater Coil) किस धातु की बनी होती है?', options: ['नाइक्रोम (Nichrome)', 'टंगस्टन', 'तांबा', 'लोहा'], answer: 'नाइक्रोम (Nichrome)', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'दूध खट्टा होने पर उसमें कौन सा अम्ल बनता है?', options: ['लैक्टिक अम्ल (Lactic Acid)', 'एसिटिक अम्ल', 'टार्टरिक अम्ल', 'सिट्रिक अम्ल'], answer: 'लैक्टिक अम्ल (Lactic Acid)', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'परमाणु बम (Atom Bomb) किस सिद्धांत पर आधारित है?', options: ['नाभिकीय विखंडन (Nuclear Fission)', 'नाभिकीय संलयन', 'रेडियोएक्टिव विघटन', 'कोई नहीं'], answer: 'नाभिकीय विखंडन (Nuclear Fission)', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'हाइड्रोजन बम (Hydrogen Bomb) किस सिद्धांत पर आधारित है?', options: ['नाभिकीय संलयन (Nuclear Fusion)', 'नाभिकीय विखंडन', 'रासायनिक क्रिया', 'विद्युत चुंबकीय प्रभाव'], answer: 'नाभिकीय संलयन (Nuclear Fusion)', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'सूर्य की ऊर्जा का मुख्य स्रोत क्या है?', options: ['नाभिकीय संलयन (Nuclear Fusion)', 'नाभिकीय विखंडन', 'ऑक्सीकरण', 'कोयला जलना'], answer: 'नाभिकीय संलयन (Nuclear Fusion)', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'पेंसिल की लीड (Pencil Lead) किसकी बनी होती है?', options: ['ग्रेफाइट (Graphite)', 'चारकोल', 'सीसा', 'कोयला'], answer: 'ग्रेफाइट (Graphite)', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'पौधों में क्लोरोफिल बनाने के लिए कौन सा तत्व आवश्यक है?', options: ['मैग्नीशियम (Mg)', 'कैल्शियम', 'लोहा', 'फास्फोरस'], answer: 'मैग्नीशियम (Mg)', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'विद्युत बल्ब में सामान्यतः कौन सी गैस भरी जाती है?', options: ['नाइट्रोजन या आर्गन', 'ऑक्सीजन', 'हाइड्रोजन', 'कार्बन डाइऑक्साइड'], answer: 'नाइट्रोजन या आर्गन', source: 'CTET Practice', year: 2026 },

    // Page 15
    { level: 'junior', text: 'सोने को घोलने के लिए किसका उपयोग किया जाता है?', options: ['अम्लराज (Aqua Regia)', 'सल्फ्यूरिक अम्ल', 'नाइट्रिक अम्ल', 'हाइड्रोक्लोरिक अम्ल'], answer: 'अम्लराज (Aqua Regia)', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'शुद्ध जल का पीएच (pH) मान कितना होता है?', options: ['7.0', '5.6', '8.2', '6.5'], answer: '7.0', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'रसोई गैस (LPG) में मुख्य रूप से कौन सी गैसें होती हैं?', options: ['प्रोपेन और ब्यूटेन', 'मीथेन और एथेन', 'हाइड्रोजन और ऑक्सीजन', 'कार्बन मोनोऑक्साइड'], answer: 'प्रोपेन और ब्यूटेन', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'बायो गैस (Biogas) का मुख्य घटक क्या है?', options: ['मीथेन (Methane)', 'ब्यूटेन', 'प्रोपेन', 'कार्बन डाइऑक्साइड'], answer: 'मीथेन (Methane)', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'पेड़-पौधे रात में कौन सी गैस छोड़ते हैं?', options: ['कार्बन डाइऑक्साइड', 'ऑक्सीजन', 'नाइट्रोजन', 'हाइड्रोजन'], answer: 'कार्बन डाइऑक्साइड', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'रक्त दाब (Blood Pressure) मापने का यंत्र कौन सा है?', options: ['स्फिग्मोमैनोमीटर', 'बैरोमीटर', 'थर्मामीटर', 'स्टेथोस्कोप'], answer: 'स्फिग्मोमैनोमीटर', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'मानव शरीर में सबसे बड़ी हड्डी कौन सी है?', options: ['फीमर (जांघ की हड्डी)', 'स्टेपिस (कान की हड्डी)', 'ह्यूमरस', 'रेडियस'], answer: 'फीमर (जांघ की हड्डी)', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'मानव शरीर में सबसे छोटी हड्डी कौन सी है?', options: ['स्टेपिस (Stapes)', 'फीमर', 'पटैला', 'फाइबुला'], answer: 'स्टेपिस (Stapes)', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'रक्त का लाल रंग किसके कारण होता है?', options: ['हीमोग्लोबिन (Hemoglobin)', 'प्लाज्मा', 'श्वेत रक्त कणिकाएं', 'प्लेटलेट्स'], answer: 'हीमोग्लोबिन (Hemoglobin)', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'पिट्यूटरी ग्रंथि (Pituitary Gland) मानव मस्तिष्क के किस भाग में स्थित होती है?', options: ['आधार भाग में (Base of Brain)', 'मध्य भाग में', 'अग्र भाग में', 'पश्च भाग में'], answer: 'आधार भाग में (Base of Brain)', source: 'CTET Practice', year: 2026 }
  ],
  social: [
    // Page 10
    { level: 'junior', text: 'भारतीय संविधान का जनक किसे कहा जाता है?', options: ['डॉ. बी. आर. अम्बेडकर', 'डॉ. राजेन्द्र प्रसाद', 'जवाहरलाल नेहरू', 'महात्मा गांधी'], answer: 'डॉ. बी. आर. अम्बेडकर', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'भारत के किस राज्य की तटरेखा सबसे लंबी है?', options: ['गुजरात', 'आंध्र प्रदेश', 'तमिलनाडु', 'महाराष्ट्र'], answer: 'गुजरात', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'मौर्य साम्राज्य की स्थापना किसने की थी?', options: ['चंद्रगुप्त मौर्य', 'सम्राट अशोक', 'बिन्दुसार', 'चंद्रगुप्त द्वितीय'], answer: 'चंद्रगुप्त मौर्य', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'पानीपत का प्रथम युद्ध (1526 ई.) किसके बीच लड़ा गया था?', options: ['बाबर और इब्राहिम लोदी', 'अकबर और हेमू', 'बाबर और राणा सांगा', 'हुमायूं और शेरशाह'], answer: 'बाबर और इब्राहिम लोदी', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'राज्यसभा का पदेन सभापति कौन होता है?', options: ['उपराष्ट्रपति', 'राष्ट्रपति', 'प्रधानमंत्री', 'लोकसभा अध्यक्ष'], answer: 'उपराष्ट्रपति', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'संसद् के दोनों सदनों की संयुक्त बैठक की अध्यक्षता कौन करता है?', options: ['लोकसभा अध्यक्ष', 'राष्ट्रपति', 'उपराष्ट्रपति', 'प्रधानमंत्री'], answer: 'लोकसभा अध्यक्ष', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'भारत में स्थानीय स्वशासन का जनक किसे माना जाता है?', options: ['लॉर्ड रिपन', 'लॉर्ड लिटन', 'लॉर्ड कर्जन', 'LORD DALHOUSIE'], answer: 'लॉर्ड रिपन', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'प्रसिद्ध सूफी संत सलीम चिश्ती की दरगाह कहाँ स्थित है?', options: ['فتےپور سیکरी (Fatehpur Sikri)', 'अजमेर', 'दिल्ली', 'आगरा'], answer: 'فتےپور سیکरी (Fatehpur Sikri)', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'संसार का सबसे बड़ा मरुस्थल कौन सा है?', options: ['सहारा मरुस्थल', 'थार मरुस्थल', 'गोबी मरुस्थल', 'कालाहारी मरुस्थल'], answer: 'सहारा मरुस्थल', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'भारतीय राष्ट्रीय कांग्रेस की स्थापना किस वर्ष और कहाँ हुई थी?', options: ['1885 ई., बंबई', '1885 ई., कलकत्ता', '1905 ई., सूरत', '1906 ई., ढाका'], answer: '1885 ई., बंबई', source: 'CTET Practice', year: 2026 },

    // Page 11
    { level: 'junior', text: 'भारत में मुगल साम्राज्य का संस्थापक कौन था?', options: ['बाबर', 'अकबर', 'हुमायूं', 'शेरशाह सूरी'], answer: 'बाबर', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'प्रसिद्ध गीत "सारे जहाँ से अच्छा" के रचयिता कौन हैं?', options: ['मोहम्मद इकबाल', 'रवींद्रनाथ टैगोर', 'बंकिम चंद्र चटर्जी', 'मिर्जा गालिब'], answer: 'मोहम्मद इकबाल', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'हड़प्पा सभ्यता की खोज किस वर्ष हुई थी?', options: ['1921 ई.', '1920 ई.', '1922 ई.', '1925 ई.'], answer: '1921 ई.', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'भारतीय संविधान में मौलिक अधिकारों (Fundamental Rights) की संख्या कितनी है?', options: ['6', '7', '8', '10'], answer: '6', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'विश्व का सबसे बड़ा महासागर कौन सा है?', options: ['प्रशांत महासागर (Pacific Ocean)', 'अटलांटिक महासागर', 'हिन्द महासागर', 'आर्कटिक महासागर'], answer: 'प्रशांत महासागर (Pacific Ocean)', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘डिस्कवरी ऑफ इंडिया’ (Discovery of India) पुस्तक के लेखक कौन हैं?', options: ['जवाहरलाल नेहरू', 'महात्मा गांधी', 'सुभाष चंद्र बोस', 'बाल गंगाधर तिलक'], answer: 'जवाहरलाल नेहरू', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'भारत के मुख्य चुनाव आयुक्त की नियुक्ति कौन करता है?', options: ['राष्ट्रपति (President)', 'प्रधानमंत्री', 'संसद', 'मुख्य न्यायाधीश'], answer: 'राष्ट्रपति (President)', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'فلی پور سیکری کا بلند دروازہ کس نے بنوایا تھا؟', options: ['اکبر (Akbar)', 'شاہجہاں', 'جہانگیر', 'اورنگزیب'], answer: 'اکبر (Akbar)', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'सौरमंडल का सबसे गर्म ग्रह कौन सा है?', options: ['शुक्र (Venus)', 'बुध (Mercury)', 'मंगल', 'बृहस्पति'], answer: 'शुक्र (Venus)', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘गदर पार्टी’ के संस्थापक कौन थे?', options: ['लाला हरदयाल', 'भगत सिंह', 'चंद्रशेखर आजाद', 'सुभाष चंद्र बोस'], answer: 'लाला हरदयाल', source: 'CTET Practice', year: 2026 },

    // Page 12
    { level: 'junior', text: '‘अकबरनामा’ ग्रंथ की रचना थी?', options: ['अबुल फजल', 'फैजी', 'अब्दुल कादिर बदायूंनी', 'बीरबल'], answer: 'अबुल फजल', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'भारत के किस राज्य को ‘मसालों का बगीचा’ कहा जाता है?', options: ['केरल', 'कर्नाटक', 'तमिलनाडु', 'आंध्र प्रदेश'], answer: 'केरल', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'प्रसिद्ध गायत्री मंत्र का उल्लेख किस वेद में है?', options: ['ऋग्वेद', 'सामवेद', 'यजुर्वेद', 'अथर्ववेद'], answer: 'ऋग्वेद', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'भारतीय संविधान में नीति निदेशक तत्व (DPSP) किस देश के संविधान से लिए गए हैं?', options: ['आयरलैंड', 'अमेरिका', 'ब्रिटेन', 'कनाडा'], answer: 'आयरलैंड', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'भूमध्य रेखा पर दिन और रात की अवधि कितनी होती है?', options: ['12 घंटे', '24 घंटे', '6 महीने', 'ऋतु अनुसार बदलती है'], answer: '12 घंटे', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘सत्यार्थ प्रकाश’ पुस्तक के लेखक कौन थे?', options: ['स्वामी दयानंद सरस्वती', 'स्वामी विवेकानंद', 'राजा राममोहन राय', 'केशव चंद्र सेन'], answer: 'स्वामी दयानंद सरस्वती', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'भारत के राष्ट्रपति को पद की शपथ कौन दिलाता है?', options: ['भारत का मुख्य न्यायाधीश (Chief Justice)', 'उपराष्ट्रपति', 'प्रधानमंत्री', 'लोकसभा अध्यक्ष'], answer: 'भारत का मुख्य न्यायाधीश (Chief Justice)', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'कुतुब मीनार का निर्माण कार्य किसने पूरा करवाया था?', options: ['इल्तुतमिश', 'कुतुबुद्दीन ऐबक', 'रजिया सुल्तान', 'बलवन'], answer: 'इल्तुतमिश', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'क्षेत्रफल की दृष्टि से भारत का विश्व में कौन सा स्थान है?', options: ['सातवाँ', 'पाँचवाँ', 'छठा', 'दूसरा'], answer: 'सातवाँ', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘असहयोग आंदोलन’ किस वर्ष प्रारंभ किया गया था?', options: ['1920 ई.', '1919 ई.', '1922 ई.', '1930 ई.'], answer: '1920 ई.', source: 'CTET Practice', year: 2026 },

    // Page 13
    { level: 'junior', text: 'भारत का राष्ट्रीय मानवाधिकार आयोग किस वर्ष स्थापित हुआ था?', options: ['1993', '1990', '1995', '2000'], answer: '1993', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'विश्व की सबसे लंबी नदी कौन सी है?', options: ['नील नदी (Nile)', 'अमेज़न', 'यांग्त्ज़ी', 'गंगा'], answer: 'नील नदी (Nile)', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'सिंधु घाटी सभ्यता का विशाल स्नानागार (Great Bath) कहाँ पाया गया था?', options: ['मोहनजोदड़ो', 'हड़प्पा', 'लोथल', 'कालीबंगा'], answer: 'मोहनजोदड़ो', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'लोकसभा का सदस्य बनने के लिए न्यूनतम आयु क्या है?', options: ['25 वर्ष', '30 वर्ष', '35 वर्ष', '21 वर्ष'], answer: '25 वर्ष', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'भारत का मानक समय (Standard Time) किस शहर से लिया गया है?', options: ['प्रयागराज (नैनी)', 'दिल्ली', 'कोलकाता', 'मुंबई'], answer: 'प्रयागराज (नैनी)', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘स्वराज मेरा जन्मसिद्ध अधिकार है’ यह नारा किसने दिया था?', options: ['बाल गंगाधर तिलक', 'लाला लाजपत राय', 'विपिन चंद्र पाल', 'सुभाष चंद्र बोस'], answer: 'बाल गंगाधर तिलक', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'संविधान सभा के स्थायी अध्यक्ष कौन थे?', options: ['डॉ. राजेन्द्र प्रसाद', 'डॉ. सच्चिदानंद सिन्हा', 'डॉ. बी. आर. अम्बेडकर', 'जवाहरलाल नेहरू'], answer: 'डॉ. राजेन्द्र प्रसाद', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'विजयनगर साम्राज्य के सबसे प्रसिद्ध शासक कौन थे?', options: ['कृष्णदेव राय', 'हरिहर', 'बुक्का', 'देवराय द्वितीय'], answer: 'कृष्णदेव राय', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'भाखड़ा नांगल बाँध किस नदी पर बना है?', options: ['सतलुज नदी', 'गंगा नदी', 'व्यास नदी', 'रावी नदी'], answer: 'सतलुज नदी', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘चोरी-चोरा’ कांड किस वर्ष हुआ था जिसके कारण असहयोग आंदोलन स्थगित हुआ?', options: ['1922 ई.', '1920 ई.', '1921 ई.', '1923 ई.'], answer: '1922 ई.', source: 'CTET Practice', year: 2026 },

    // Page 14
    { level: 'junior', text: 'अकबर के दरबार में प्रसिद्ध संगीतकार तानसेन का मूल नाम क्या था?', options: ['रामतनु पाण्डेय', 'मकरंद पाण्डेय', 'लाल कलावंत', 'बाज़ बहादुर'], answer: 'रामतनु पाण्डेय', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'वायुमंडल की सबसे निचली परत कौन सी है?', options: ['क्षोभमंडल (Troposphere)', 'समतापमंडल', 'मध्यमंडल', 'आयनमंडल'], answer: 'क्षोभमंडल (Troposphere)', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'सत्यमेव जयते का उल्लेख कहाँ मिलता है?', options: ['मुण्डकोपनिषद्', 'ऋग्वेद', 'सामवेद', 'रामायण'], answer: 'मुण्डकोपनिषद्', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'भारत के पहले मुख्य न्यायाधीश कौन थे?', options: ['हरिलाल जे. कानिया', 'एम. पतंजलि शास्त्री', 'मेहर चंद महाजन', 'बी. के. मुखर्जी'], answer: 'हरिलाल जे. कानिया', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'सौरमंडल का सबसे बड़ा ग्रह कौन सा है?', options: ['बृहस्पति (Jupiter)', 'शनि', 'अरुण', 'वरुण'], answer: 'बृहस्पति (Jupiter)', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘केसरी’ समाचार पत्र के संपादक कौन थे?', options: ['बाल गंगाधर तिलक', 'गोपाल कृष्ण गोखले', 'महात्मा गांधी', 'लाला लाजपत राय'], answer: 'बाल गंगाधर तिलक', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'संविधान संशोधन की प्रक्रिया का उल्लेख किस अनुच्छेद में है?', options: ['अनुच्छेद 368', 'अनुच्छेद 360', 'अनुच्छेद 352', 'अनुच्छेद 356'], answer: 'अनुच्छेद 368', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'हल्दीघाटी का प्रसिद्ध युद्ध (1576 ई.) किसके बीच हुआ था?', options: ['अकबर और महाराणा प्रताप', 'अकबर और हेमू', 'बाबर और राणा सांगा', 'हुमायूं और शेरशाह'], answer: 'अकबर और महाराणा प्रताप', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'पृथ्वी के सबसे निकट का खगोलीय पिंड कौन सा है?', options: ['चंद्रमा', 'शुक्र', 'सूर्य', 'बुध'], answer: 'चंद्रमा', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘बंगाल का विभाजन’ किस वर्ष लागू हुआ था?', options: ['1905 ई.', '1906 ई.', '1907 ई.', '1911 ई.'], answer: '1905 ई.', source: 'CTET Practice', year: 2026 },

    // Page 15
    { level: 'junior', text: '‘अष्टांग मार्ग’ का प्रतिपादन किसने किया था?', options: ['गौतम बुद्ध', 'महावीर स्वामी', 'ऋषभदेव', 'आदि शंकराचार्य'], answer: 'गौतम बुद्ध', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'भारत के पूर्वी तट पर स्थित प्रमुख लैगून झील कौन सी है?', options: ['चिल्का झील (Chilika)', 'पुलिकट झील', 'कोलेरू झील', 'वूलर झील'], answer: 'चिल्का झील (Chilika)', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: '‘गीत गोविंद’ के रचयिता कौन थे?', options: ['जयदेव', 'विल्हण', 'कल्हण', 'बाणभट्ट'], answer: 'जयदेव', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'भारतीय रिजर्व बैंक (RBI) की स्थापना किस वर्ष हुई थी?', options: ['1935', '1947', '1950', '1921'], answer: '1935', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'संसार की सबसे ऊंची पर्वत चोटी कौन सी है?', options: ['माउंट एवरेस्ट', 'के-2 (गॉडविन ऑस्टिन)', 'कंचनजंगा', 'ल्हात्से'], answer: 'माउंट एवरेस्ट', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: '‘इंकलाब जिंदाबाद’ का नारा सबसे पहले किसने दिया था?', options: ['हसरत मोहानी (Bhagat Singh popularized it)', 'भगत सिंह', 'सुभाष चंद्र बोस', 'चंद्रशेखर आजाद'], answer: 'हसरत मोहानी (Bhagat Singh popularized it)', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'भारत में पहली रेलगाड़ी कब और कहाँ चली थी?', options: ['1853 ई., मुंबई से ठाणे', '1853 ई., कलकत्ता से रानीगंज', '1854 ई., मद्रास से अरकोणम', '1856 ई., दिल्ली से आगरा'], answer: '1853 ई., मुंबई से ठाणे', source: 'UPTET Practice', year: 2026 },
    { level: 'junior', text: 'किस गवर्नर जनरल के काल में सती प्रथा का उन्मूलन (1829 ई.) किया गया था?', options: ['लॉर्ड विलियम बैंटिक', 'लॉर्ड डलहौजी', 'लॉर्ड वेलेज़ली', 'लॉर्ड कैनिंग'], answer: 'लॉर्ड विलियम बैंटिक', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'ओजोन परत किस मंडल में अवस्थित है?', options: ['समतापमंडल (Stratosphere)', 'क्षोभमंडल', 'मध्यमंडल', 'आयनमंडल'], answer: 'समतापमंडल (Stratosphere)', source: 'CTET Practice', year: 2026 },
    { level: 'junior', text: 'भारत का सबसे बड़ा बंदरगाह नगर कौन सा है?', options: ['मुंबई', 'कोलकाता', 'चेन्नई', 'कांडला'], answer: 'मुंबई', source: 'UPTET Practice', year: 2026 }
  ]
};

const targetDir = path.join(__dirname);
const subjects = Object.keys(questionBank);

subjects.forEach(subj => {
  const list = questionBank[subj];
  if (!list || list.length === 0) return;

  // Let's divide list into chunks of 10
  const chunkSize = 10;
  
  let startPage = 10;
  if (subj === 'sanskrit') {
    startPage = 9; // Sanskrit needs page 9 to 15
  }

  for (let i = 0; i < Math.ceil(list.length / chunkSize); i++) {
    const pageNum = startPage + i;
    const chunk = list.slice(i * chunkSize, (i + 1) * chunkSize);
    if (chunk.length === 0) continue;

    const fileName = `questions_${subj}_p${pageNum}.js`;
    const filePath = path.join(targetDir, fileName);

    // If file already exists, we skip it to prevent overwriting
    if (fs.existsSync(filePath)) {
      console.log(`⚠️  File ${fileName} already exists. Skipping.`);
      continue;
    }

    // Build JavaScript file content
    let content = `const { v4: uuidv4 } = require('uuid');\n`;
    content += `const Q = (l,s,t,o,a,src,yr) => ({question_id:uuidv4(),level:l,subject:s,question_text:t,options:o,correct_answer:a,source:src,year:yr,created_at:new Date()});\n\n`;
    content += `module.exports = [\n`;
    
    chunk.forEach(q => {
      const escapedText = q.text.replace(/'/g, "\\'");
      const escapedOptions = q.options.map(opt => `'${opt.replace(/'/g, "\\'")}'`).join(',');
      const escapedAnswer = q.answer.replace(/'/g, "\\'");
      
      content += `Q('${q.level}','${subj}','${escapedText}',[${escapedOptions}],'${escapedAnswer}','${q.source}',${q.year}),\n`;
    });

    content += `];\n`;

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Created ${fileName} with ${chunk.length} questions.`);
  }
});

console.log('🚀 Page generation complete! Ready to run the main seed script.');
