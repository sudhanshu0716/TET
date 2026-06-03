const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Scenario = require('../models/Scenario');

const scenarios = [
  {
    scenario_id: 'scen_001',
    subject: 'pedagogy',
    level: 'primary',
    title_en: 'Supporting the Isolated Child',
    title_hi: 'एकाकी छात्र की सहायता करना',
    steps: [
      {
        step_number: 1,
        description_en: 'A student, Aarav, approaches you during a group project session. He looks down and whispers, "Teacher, can I work alone? Nobody in my group wants to listen to my ideas, and they are ignoring me."',
        description_hi: 'एक छात्र, आरव, एक समूह परियोजना सत्र के दौरान आपके पास आता है। वह नीचे देखता है और फुसफुसाता है, "शिक्षक, क्या मैं अकेला काम कर सकता हूँ? मेरे समूह में कोई भी मेरे विचारों को सुनना नहीं चाहता है, और वे मुझे अनदेखा कर रहे हैं।""',
        choices: [
          {
            choice_index: 0,
            text_en: 'Permit Aarav to work alone to avoid conflicts and reduce stress.',
            text_hi: 'आरव को संघर्षों से बचने और तनाव को कम करने के लिए अकेले काम करने की अनुमति दें।',
            points: 4,
            theory_tag: 'Laissez-Faire Teaching',
            explanation_en: 'Allowing him to work alone avoids immediate friction but fails to develop essential social-cooperative skills outlined in Vygotsky’s social development theories.',
            explanation_hi: 'उसे अकेले काम करने की अनुमति देने से तत्काल घर्षण से बचा जाता है, लेकिन वाइगोत्स्की के सामाजिक विकास सिद्धांतों में रेखांकित आवश्यक सामाजिक-सहकारी कौशल विकसित करने में विफल रहता है।',
            reaction_modifier_en: 'Aarav works alone quietly but feels increasingly isolated from his classmates.',
            reaction_modifier_hi: 'आरव अकेले चुपचाप काम करता है लेकिन अपने सहपाठियों से तेजी से अलग महसूस करता है।'
          },
          {
            choice_index: 1,
            text_en: 'Scaffold the group: Assign Aarav a specific, valued role (e.g., Lead Illustrator) and establish a turn-taking discussion rule.',
            text_hi: 'समूह को मचान (Scaffold) दें: आरव को एक विशिष्ट, मूल्यवान भूमिका (जैसे, मुख्य चित्रकार) सौंपें और बारी-बारी से चर्चा करने का नियम बनाएं।',
            points: 10,
            theory_tag: "Vygotsky's Scaffolding & ZPD",
            explanation_en: 'This is the most student-centric approach. By structuring the social interaction, you keep Aarav in his Zone of Proximal Development (ZPD) and foster peer cooperation.',
            explanation_hi: 'यह सबसे छात्र-केंद्रित दृष्टिकोण है। सामाजिक अंतःक्रिया को संरचित करके, आप आरव को उसके समीपस्थ विकास के क्षेत्र (ZPD) में रखते हैं और सहकर्मी सहयोग को बढ़ावा देते हैं।',
            reaction_modifier_en: 'Armed with a clear role, Aarav joins the group. The students start discussing illustrations, and Aarav looks more confident.',
            reaction_modifier_hi: 'एक स्पष्ट भूमिका के साथ, आरव समूह में शामिल हो जाता है। छात्र चित्रों पर चर्चा करना शुरू करते हैं, और आरव अधिक आश्वस्त दिखता है।'
          },
          {
            choice_index: 2,
            text_en: 'Reprimand the group members publicly and force them to include Aarav.',
            text_hi: 'समूह के सदस्यों को सार्वजनिक रूप से फटकारें और उन्हें आरव को शामिल करने के लिए मजबूर करें।',
            points: 2,
            theory_tag: 'Authoritarian Classroom Management',
            explanation_en: 'Publicly scolding the group creates resentment towards both you and Aarav, damaging long-term classroom dynamics and peer relations.',
            explanation_hi: 'समूह को सार्वजनिक रूप से डांटने से आपके और आरव दोनों के प्रति आक्रोश पैदा होता है, जिससे दीर्घकालिक कक्षा की गतिशीलता और सहकर्मी संबंध खराब होते हैं।',
            reaction_modifier_en: 'The group reluctantly sits with Aarav, but the atmosphere is tense and quiet. Nobody speaks to Aarav.',
            reaction_modifier_hi: 'समूह अनिच्छा से आरव के साथ बैठता है, लेकिन माहौल तनावपूर्ण और शांत है। आरव से कोई बात नहीं करता।'
          },
          {
            choice_index: 3,
            text_en: 'Bribe the group: Offer extra star points to whoever agrees to lead Aarav.',
            text_hi: 'समूह को रिश्वत दें: जो कोई भी आरव का नेतृत्व करने के लिए सहमत होता है उसे अतिरिक्त स्टार अंक प्रदान करें।',
            points: 5,
            theory_tag: 'Extrinsic Reinforcement (Behaviorism)',
            explanation_en: 'While extrinsic rewards (star points) can motivate cooperation temporarily, it doesn\'t cultivate genuine inclusive behavior or intrinsic empathy.',
            explanation_hi: 'हालांकि बाहरी पुरस्कार (स्टार अंक) अस्थायी रूप से सहयोग को प्रेरित कर सकते हैं, लेकिन यह वास्तविक समावेशी व्यवहार या आंतरिक सहानुभूति पैदा नहीं करता है।',
            reaction_modifier_en: 'A student agrees to work with Aarav just for the stars, but treats Aarav like a burden rather than a teammate.',
            reaction_modifier_hi: 'एक छात्र केवल सितारों के लिए आरव के साथ काम करने के लिए सहमत होता है, लेकिन आरव के साथ एक टीम के साथी के बजाय एक बोझ की तरह व्यवहार करता है।'
          }
        ]
      },
      {
        step_number: 2,
        description_en: 'As the project continues, you observe Aarav\'s progress. While the initial friction has settled, the group is now designing a presentation, and Aarav is hesitant to speak during rehearsals.',
        description_hi: 'जैसे ही परियोजना जारी रहती है, आप आरव की प्रगति का निरीक्षण करते हैं। हालांकि शुरुआती घर्षण शांत हो गया है, समूह अब एक प्रस्तुति डिजाइन कर रहा है, और आरव रिहर्सल के दौरान बोलने में संकोच कर रहा है।',
        choices: [
          {
            choice_index: 0,
            text_en: 'Praise Aarav\'s effort privately and encourage him to practice speaking in front of a mirror or with you first.',
            text_hi: 'आरव के प्रयास की निजी तौर पर प्रशंसा करें और उसे पहले दर्पण के सामने या आपके साथ बोलने का अभ्यास करने के लिए प्रोत्साहित करें।',
            points: 10,
            theory_tag: 'Building Self-Efficacy (Bandura)',
            explanation_en: 'Private support builds self-efficacy and master experiences in a low-anxiety environment, helping a shy child overcome public speaking fears.',
            explanation_hi: 'निजी समर्थन कम चिंता वाले वातावरण में आत्म-प्रभावकारिता और मास्टर अनुभवों का निर्माण करता है, जिससे एक शर्मीले बच्चे को सार्वजनिक रूप से बोलने के डर पर काबू पाने में मदद मिलती है।',
            reaction_modifier_en: 'Aarav practices with you during recess, building his speaking confidence step-by-step.',
            reaction_modifier_hi: 'आरव मध्यांतर के दौरान आपके साथ अभ्यास करता है, जिससे कदम-दर-कदम उसका बोलने का आत्मविश्वास बढ़ता है।'
          },
          {
            choice_index: 1,
            text_en: 'Tell Aarav that speaking is mandatory for a grade and he must push through his fear.',
            text_hi: 'आरव से कहें कि ग्रेड के लिए बोलना अनिवार्य है और उसे अपने डर पर काबू पाना ही होगा।',
            points: 3,
            theory_tag: 'Coercive Motivation',
            explanation_en: 'Using grade threats increases anxiety, which hinders performance and can trigger school avoidance behaviors in introverted children.',
            explanation_hi: 'ग्रेड के खतरों का उपयोग करने से चिंता बढ़ती है, जो प्रदर्शन में बाधा डालती है और अंतर्मुखी बच्चों में स्कूल से बचने के व्यवहार को गति दे सकती है।',
            reaction_modifier_en: 'Aarav looks visibly anxious, holding back tears and becoming completely silent.',
            reaction_modifier_hi: 'आरव स्पष्ट रूप से चिंतित दिखता है, आँसू रोकता है और पूरी तरह से शांत हो जाता है।'
          },
          {
            choice_index: 2,
            text_en: 'Suggest the group lets Aarav handle the slide transitions instead of speaking.',
            text_hi: 'सुझाव दें कि समूह आरव को बोलने के बजाय स्लाइड ट्रांज़िशन संभालने दे।',
            points: 6,
            theory_tag: 'Avoidant Accommodation',
            explanation_en: 'While accommodating children\'s differences is valuable, completely exempting them from verbal challenges prevents them from developing oral communication skills.',
            explanation_hi: 'हालांकि बच्चों के मतभेदों को समायोजित करना मूल्यवान है, लेकिन उन्हें मौखिक चुनौतियों से पूरी तरह से छूट देने से वे मौखिक संचार कौशल विकसित करने से बच जाते हैं।',
            reaction_modifier_en: 'Aarav is relieved to not speak, but he stays in the background and misses a chance to grow.',
            reaction_modifier_hi: 'आरव बोलने से बचने के लिए राहत महसूस करता है, लेकिन वह पृष्ठभूमि में रहता है और बढ़ने का मौका गंवा देता है।'
          },
          {
            choice_index: 3,
            text_en: 'Command the group to stand in a circle and clap for Aarav to encourage him to speak.',
            text_hi: 'आरव को बोलने के लिए प्रोत्साहित करने के लिए समूह को एक घेरे में खड़े होने और ताली बजाने का आदेश दें।',
            points: 4,
            theory_tag: 'Exaggerated Social Pressure',
            explanation_en: 'Forcing excessive attention on an already anxious and introverted child usually backfires by raising their affective filter and causing extreme self-consciousness.',
            explanation_hi: 'पहले से ही चिंतित और अंतर्मुखी बच्चे पर अत्यधिक ध्यान केंद्रित करने से आमतौर पर उनका भावनात्मक फिल्टर बढ़ जाता है और वे अत्यधिक संकोच करने लगते हैं।',
            reaction_modifier_en: 'Aarav hides his face in his hands, deeply embarrassed by the sudden attention.',
            reaction_modifier_hi: 'आरव अचानक मिले ध्यान से बहुत शर्मिंदा होकर अपना चेहरा अपने हाथों में छिपा लेता है।'
          }
        ]
      },
      {
        step_number: 3,
        description_en: 'It\'s presentation day. The group stands in front of the class. It is Aarav\'s turn to present. He looks at the audience, freezes, and drops his notes.',
        description_hi: 'यह प्रस्तुति का दिन है। समूह कक्षा के सामने खड़ा है। अब प्रस्तुति देने की आरव की बारी है। वह दर्शकों की ओर देखता है, सहम जाता है, और अपने नोट्स गिरा देता है।',
        choices: [
          {
            choice_index: 0,
            text_en: 'Walk to the front, stand beside Aarav, help him pick up his notes, and co-present the first slide with him.',
            text_hi: 'आगे बढ़ें, आरव के पास खड़े हों, उसके नोट्स उठाने में उसकी मदद करें, और उसके साथ पहली स्लाइड को सह-प्रस्तुत करें।',
            points: 10,
            theory_tag: 'Teacher as a Facilitator & Safe Environment',
            explanation_en: 'By physically supporting him and co-presenting, you lower his performance anxiety, model positive behavior, and establish the classroom as a safe, empathetic space.',
            explanation_hi: 'शारीरिक रूप से उसका समर्थन करके और सह-प्रस्तुत करके, आप उसके प्रदर्शन की चिंता को कम करते हैं, सकारात्मक व्यवहार का मॉडल बनाते हैं, और कक्षा को एक सुरक्षित, सहानुभूतिपूर्ण स्थान के रूप में स्थापित करते हैं।',
            reaction_modifier_en: 'With you by his side, Aarav takes a deep breath, reads his notes, and finishes his speech to warm applause.',
            reaction_modifier_hi: 'आपके साथ रहने से, आरव एक गहरी सांस लेता है, अपने नोट्स पढ़ता है, और तालियों की गड़गड़ाहट के बीच अपना भाषण समाप्त करता है।'
          },
          {
            choice_index: 1,
            text_en: 'Ask Aarav to sit down and have another group member present his part instead.',
            text_hi: 'आरव से बैठने के लिए कहें और उसके बजाय समूह के किसी अन्य सदस्य से उसका भाग प्रस्तुत करने के लिए कहें।',
            points: 4,
            theory_tag: 'Defeatist Management',
            explanation_en: 'Quickly giving up on Aarav reinforces his sense of failure, lowering his academic self-concept and peer standing.',
            explanation_hi: 'आरव पर जल्दी से हार मान लेने से उसकी असफलता की भावना को बल मिलता है, जिससे उसकी शैक्षणिक आत्म-अवधारणा और साथियों की स्थिति कम हो जाती है।',
            reaction_modifier_en: 'Aarav sits down in shame, feeling he let everyone down, and shuts down emotionally.',
            reaction_modifier_hi: 'आरव शर्म से बैठ जाता है, यह महसूस करते हुए कि उसने सभी को निराश किया, और भावनात्मक रूप से मौन हो जाता है।'
          },
          {
            choice_index: 2,
            text_en: 'Tell Aarav to take a deep breath and wait silently until he is ready to continue on his own.',
            text_hi: 'आरव से गहरी सांस लेने और चुपचाप प्रतीक्षा करने के लिए कहें जब तक कि वह अपने दम पर जारी रखने के लिए तैयार न हो जाए।',
            points: 6,
            theory_tag: 'Unassisted Autonomy',
            explanation_en: 'While taking a breath is good advice, leaving a child standing frozen in front of a staring crowd without support can increase trauma and stage fright.',
            explanation_hi: 'हालांकि सांस लेना एक अच्छी सलाह है, लेकिन एक बच्चे को बिना किसी सहायता के घूरती भीड़ के सामने खड़ा छोड़ देना सदमे और मंच के डर को बढ़ा सकता है।',
            reaction_modifier_en: 'The silence stretches awkwardly. Aarav feels panicked under the staring eyes of the class.',
            reaction_modifier_hi: 'सन्नाटा अजीब तरह से खिंच जाता है। कक्षा की घूरती आँखों के सामने आरव घबरा जाता है।'
          },
          {
            choice_index: 3,
            text_en: 'Mark his presentation rubric as "Fail" on your sheet immediately so he learns consequences.',
            text_hi: 'अपनी शीट पर तुरंत उसकी प्रस्तुति रूब्रिक को "असफल" के रूप में चिह्नित करें ताकि वह परिणामों को सीख सके।',
            points: 1,
            theory_tag: 'Punitive Assessment',
            explanation_en: 'Punishing a child for panic or stage fright is highly inappropriate and violates child psychology assessment standards which advocate for diagnostic and supportive feedback.',
            explanation_hi: 'घबराहट या मंच के डर के लिए एक बच्चे को दंडित करना अत्यधिक अनुचित है और बाल मनोविज्ञान मूल्यांकन मानकों का उल्लंघन करता है जो नैदानिक और सहायक प्रतिक्रिया की वकालत करते हैं।',
            reaction_modifier_en: 'Aarav bursts into tears and runs out of the classroom, devastated.',
            reaction_modifier_hi: 'आरव रो पड़ता है और कक्षा से बाहर भाग जाता है, गहरा आहत होकर।'
          }
        ]
      }
    ]
  },
  {
    scenario_id: 'scen_002',
    subject: 'pedagogy',
    level: 'primary',
    title_en: 'Engaging the Restless Child',
    title_hi: 'अशांत बच्चे को व्यस्त रखना',
    steps: [
      {
        step_number: 1,
        description_en: 'During a quiet reading lesson, Kabir (Grade 2) stands up, walks around the desks, taps his ruler on cabinets, and distracts nearby students. When you ask him to sit down, he pouts and says, "Reading is boring, my legs want to jump!"',
        description_hi: 'एक शांत पढ़ने के पाठ के दौरान, कबीर (कक्षा 2) खड़ा हो जाता है, मेजों के चारों ओर घूमता है, अलमारियों पर अपना पैमाना (रूलर) थपथपाता है, और आस-पास के छात्रों का ध्यान भटकाता है। जब आप उसे बैठने के लिए कहते हैं, तो वह मुंह फुलाता है और कहता है, "पढ़ना उबाऊ है, मेरे पैर कूदना चाहते हैं!"',
        choices: [
          {
            choice_index: 0,
            text_en: 'Make him stand in the corner as a timeout so he learns classroom discipline.',
            text_hi: 'अनुशासन सिखाने के लिए उसे टाइमआउट के रूप में कोने में खड़ा करें।',
            points: 2,
            theory_tag: 'Behavior Modification (Punishment)',
            explanation_en: 'Physical punishment or isolation (timeout corner) for hyperactive behavior does not address the child\'s physical need for movement and causes negative emotional associations with school.',
            explanation_hi: 'अतिसक्रिय व्यवहार के लिए शारीरिक दंड या अलगाव (टाइमआउट कोना) बच्चे के आंदोलन की शारीरिक आवश्यकता को संबोधित नहीं करता है और स्कूल के साथ नकारात्मक भावनात्मक जुड़ाव पैदा करता है।',
            reaction_modifier_en: 'Kabir stands in the corner, looking angry, and starts kicking the wall, causing more noise.',
            reaction_modifier_hi: 'कबीर गुस्से में कोने में खड़ा हो जाता है, और दीवार को लात मारना शुरू कर देता है, जिससे और अधिक शोर होता है।'
          },
          {
            choice_index: 1,
            text_en: 'Give him an active role: Ask him to help you distribute books, and integrate kinesthetic reading tasks (like acting out words).',
            text_hi: 'उसे एक सक्रिय भूमिका दें: उससे पुस्तकें वितरित करने में आपकी सहायता करने के लिए कहें, और गतिज पठन कार्यों (जैसे शब्दों का अभिनय करना) को एकीकृत करें।',
            points: 10,
            theory_tag: 'Inclusive Kinesthetic Learning',
            explanation_en: 'This aligns with Howard Gardner\'s Bodily-Kinesthetic Intelligence and Inclusive Pedagogy. Redirecting his energy into useful movements helps him remain engaged productively.',
            explanation_hi: 'यह हॉवर्ड गार्डनर के शारीरिक-गतिज बुद्धि और समावेशी शिक्षाशास्त्र के अनुरूप है। उनकी ऊर्जा को उपयोगी आंदोलनों में पुनर्निर्देशित करने से उन्हें उत्पादक रूप से व्यस्त रहने में मदद मिलती है।',
            reaction_modifier_en: 'Kabir beams with pride as he hands out worksheets, using up his excess energy productively.',
            reaction_modifier_hi: 'कबीर गर्व से चमक उठता है जब वह वर्कशीट वितरित करता है, अपनी अतिरिक्त ऊर्जा का उत्पादक रूप से उपयोग करता है।'
          },
          {
            choice_index: 2,
            text_en: 'Promise him a candy if he sits quietly for the rest of the 40-minute lesson.',
            text_hi: 'उससे वादा करें कि यदि वह शेष 40 मिनट के पाठ के लिए चुपचाप बैठता है तो उसे एक कैंडी दी जाएगी।',
            points: 4,
            theory_tag: 'Extrinsic Rewards Strategy',
            explanation_en: 'Relying heavily on edible extrinsic rewards creates habituation and fails to address the underlying need for movement. It also causes peer envy.',
            explanation_hi: 'खाने योग्य बाहरी पुरस्कारों पर बहुत अधिक निर्भर रहने से आदत बन जाती है और आंदोलन की अंतर्निहित आवश्यकता को संबोधित करने में विफल रहता है। यह साथियों में ईर्ष्या भी पैदा करता है।',
            reaction_modifier_en: 'Kabir sits still for five minutes, but soon starts fidgeting again, asking, "Is it candy time yet?"',
            reaction_modifier_hi: 'कबीर पांच मिनट के लिए शांत बैठता है, लेकिन जल्द ही फिर से छटपटाने लगता है, पूछता है, "क्या यह कैंडी का समय है?"'
          },
          {
            choice_index: 3,
            text_en: 'Ignore his movement and continue teaching so you don\'t disrupt the rest of the class.',
            text_hi: 'उसके आंदोलन पर ध्यान न दें और पढ़ाना जारी रखें ताकि आप बाकी कक्षा को बाधित न करें।',
            points: 5,
            theory_tag: 'Extinction/Passive Avoidance',
            explanation_en: 'While ignoring minor attention-seeking behavior can sometimes work, ignoring a child walking around cabinets and disrupting peers creates classroom chaos and lacks active intervention.',
            explanation_hi: 'हालांकि ध्यान आकर्षित करने वाले छोटे-मोटे व्यवहारों की अनदेखी करना कभी-कभी काम कर सकता है, लेकिन अलमारियों के चारों ओर घूमते और सहपाठियों को बाधित करते बच्चे की अनदेखी करने से कक्षा में अराजकता पैदा होती है और सक्रिय हस्तक्षेप की कमी होती है।',
            reaction_modifier_en: 'Kabir interprets your silence as permission and starts throwing paper airplanes.',
            reaction_modifier_hi: 'कबीर आपकी खामोशी को अनुमति मान लेता है और कागज के हवाई जहाज फेंकना शुरू कर देता है।'
          }
        ]
      },
      {
        step_number: 2,
        description_en: 'The reading session ends. It is now time for math. Kabir is still restless, rocking his chair back and forth, and tapping his pencil loudly.',
        description_hi: 'पठन सत्र समाप्त होता है। अब गणित का समय है। कबीर अभी भी अशांत है, अपनी कुर्सी को आगे-पीछे हिला रहा है, और अपनी पेंसिल को जोर से थपथपा रहा है।',
        choices: [
          {
            choice_index: 0,
            text_en: 'Replace his pencil-tapping with a quiet sensory toy (like a squeeze ball) and use manipulative blocks for math counting.',
            text_hi: 'अपनी पेंसिल थपथपाने की जगह उसे एक शांत संवेदी खिलौना (जैसे निचोड़ने वाली गेंद) दें और गणित की गिनती के लिए जोड़-तोड़ वाले ब्लॉकों का उपयोग करें।',
            points: 10,
            theory_tag: 'Sensory Regulation & Concrete Math Manipulatives',
            explanation_en: 'Providing sensory tools allows the child to self-regulate silently, while concrete math manipulatives engage his tactile learning preferences productively.',
            explanation_hi: 'संवेदी उपकरण प्रदान करने से बच्चे को चुपचाप खुद को विनियमित करने की अनुमति मिलती है, जबकि ठोस गणित जोड़-तोड़ उनके स्पर्श सीखने की प्राथमिकताओं को उत्पादक रूप से संलग्न करते हैं।',
            reaction_modifier_en: 'Kabir happily squeezes the ball and counts math blocks, focusing quietly on the tasks.',
            reaction_modifier_hi: 'कबीर खुशी से गेंद को निचोड़ता है और गणितीय ब्लॉकों को गिनता है, चुपचाप कार्यों पर ध्यान केंद्रित करता है।'
          },
          {
            choice_index: 1,
            text_en: 'Confiscate his pencil and tell him he will not participate in math until he sits correctly.',
            text_hi: 'उसकी पेंसिल जब्त कर लें और उससे कहें कि जब तक वह सही तरीके से नहीं बैठता तब तक वह गणित में भाग नहीं लेगा।',
            points: 2,
            theory_tag: 'Exclusionary Punishment',
            explanation_en: 'Depriving a child of writing materials and excluding him from learning tasks is counterproductive and harms his academic progression.',
            explanation_hi: 'एक बच्चे को लेखन सामग्री से वंचित करना और उसे सीखने के कार्यों से बाहर करना प्रतिकूल है और उसकी शैक्षणिक प्रगति को नुकसान पहुंचाता।',
            reaction_modifier_en: 'Without a pencil, Kabir becomes bored, lays his head on the desk, and disengages completely.',
            reaction_modifier_hi: 'पेंसिल के बिना, कबीर ऊब जाता है, अपना सिर मेज पर रख लेता है, और पूरी तरह से अलग हो जाता है।'
          },
          {
            choice_index: 2,
            text_en: 'Send him to the Principal\'s office immediately for persistent disruption.',
            text_hi: 'लगातार व्यवधान के लिए उसे तुरंत प्रधानाचार्य के कार्यालय भेजें।',
            points: 3,
            theory_tag: 'Escalation of Authority',
            explanation_en: 'Escalating standard hyperactive behaviors to the administration shows a lack of classroom management skills and misses opportunities for behavioral scaffolding.',
            explanation_hi: 'प्रशासन के सामने सामान्य अतिसक्रिय व्यवहार को बढ़ाना कक्षा प्रबंधन कौशल की कमी को दर्शाता है और व्यवहारिक मचान के अवसरों को खो देता है।',
            reaction_modifier_en: 'Kabir goes to the office looking shame-faced, missing the entire math lesson.',
            reaction_modifier_hi: 'कबीर पूरी गणित का पाठ छोड़कर शर्मिंदा होकर कार्यालय जाता है।'
          },
          {
            choice_index: 3,
            text_en: 'Ask his classmate sitting next to him to monitor Kabir and tell him to behave.',
            text_hi: 'कबीर के पास बैठे उसके सहपाठी से कबीर पर नजर रखने और उसे तमीज से रहने के लिए कहने को कहें।',
            points: 5,
            theory_tag: 'Abdication of Responsibility',
            explanation_en: 'Delegating discipline or monitoring responsibility to another student is inappropriate, puts pressure on peers, and can damage student relationships.',
            explanation_hi: 'अनुशासन या निगरानी की जिम्मेदारी दूसरे छात्र को सौंपना अनुचित है, साथियों पर दबाव डालता है, और छात्र संबंधों को नुकसान पहुंचा सकता है।',
            reaction_modifier_en: 'The neighbor student whispers warnings to Kabir, leading to a whispered argument between them.',
            reaction_modifier_hi: 'पड़ोसी छात्र कबीर को फुसफुसाते हुए चेतावनी देता है, जिससे उनके बीच फुसफुसाते हुए बहस शुरू हो जाती है।'
          }
        ]
      },
      {
        step_number: 3,
        description_en: 'During lunch break, you meet Kabir\'s parents. They explain he struggles at home too. They ask for your advice on how to build consistent habits.',
        description_hi: 'दोपहर के भोजन के अवकाश के दौरान, आप कबीर के माता-पिता से मिलते हैं। वे बताते हैं कि वह घर पर भी संघर्ष करता है। वे निरंतर आदतें बनाने के बारे में आपकी सलाह मांगते हैं।',
        choices: [
          {
            choice_index: 0,
            text_en: 'Co-design a structured "Home-School Daily Report Card" tracking specific behaviors, rewarding consistency with physical activities rather than candies.',
            text_hi: 'एक संरचित "होम-स्कूल दैनिक रिपोर्ट कार्ड" का सह-डिजाइन करें जो विशिष्ट व्यवहारों को ट्रैक करता है, कैंडीज के बजाय शारीरिक गतिविधियों के साथ निरंतरता को पुरस्कृत करता है।',
            points: 10,
            theory_tag: 'Ecological Systems & Behavioral Scaffolding (Bronfenbrenner)',
            explanation_en: 'Aligning home and school environments (microsystems) using structured charts and positive reinforcements creates a supportive behavioral framework for ADHD-like behaviors.',
            explanation_hi: 'संरचित चार्ट और सकारात्मक सुदृढीकरण का उपयोग करके घर और स्कूल के वातावरण (माइक्रोसिस्टम्स) को संरेखित करना एडीएचडी जैसी व्यवहार प्रवृत्तियों के लिए एक सहायक ढांचा बनाता है।',
            reaction_modifier_en: 'The parents agree enthusiastically, setting up a consistent, supportive routine for Kabir.',
            reaction_modifier_hi: 'माता-पिता उत्साहपूर्वक सहमत होते हैं, कबीर के लिए एक सुसंगत, सहायक दिनचर्या स्थापित करते हैं।'
          },
          {
            choice_index: 1,
            text_en: 'Tell the parents they must consult a psychiatrist immediately and medicate him so he can sit still.',
            text_hi: 'माता-पिता से कहें कि उन्हें तुरंत एक मनोचिकित्सक से परामर्श करना चाहिए और उसे दवा देनी चाहिए ताकि वह शांत बैठ सके।',
            points: 2,
            theory_tag: 'Medicalization Deficit Model',
            explanation_en: 'Suggesting immediate medication is outside a teacher\'s professional boundary and adopts a deficit view of the child rather than supporting behavioral adjustments.',
            explanation_hi: 'तत्काल दवा का सुझाव देना एक शिक्षक की पेशेवर सीमा से बाहर है और व्यवहारिक समायोजन का समर्थन करने के बजाय बच्चे के प्रति एक कमी का दृष्टिकोण अपनाता है।',
            reaction_modifier_en: 'The parents look defensive and upset, feeling you are labeling their child.',
            reaction_modifier_hi: 'माता-पिता रक्षात्मक और परेशान दिखते हैं, यह महसूस करते हुए कि आप उनके बच्चे पर लेबल लगा रहे हैं।'
          },
          {
            choice_index: 2,
            text_en: 'Recommend they reduce Kabir\'s outdoor playtime at home so he conserves energy for school classes.',
            text_hi: 'सुझाव दें कि वे घर पर कबीर के बाहर खेलने के समय को कम करें ताकि वह स्कूल की कक्षाओं के लिए ऊर्जा बचा सके।',
            points: 4,
            theory_tag: 'Physical Deprivation Misconception',
            explanation_en: 'Reducing physical activity for hyperactive children increases restlessness and energy buildup, worsening school behavioral challenges.',
            explanation_hi: 'अतिसक्रिय बच्चों के लिए शारीरिक गतिविधि को कम करने से अशांतता और ऊर्जा का संचय बढ़ता है, जिससे स्कूल की व्यवहार संबंधी चुनौतियाँ और खराब हो जाती हैं।',
            reaction_modifier_en: 'With less play, Kabir\'s energy levels at school spike, making classroom management harder.',
            reaction_modifier_hi: 'कम खेलने के साथ, स्कूल में कबीर का ऊर्जा स्तर बढ़ जाता है, जिससे कक्षा प्रबंधन और कठिन हो जाता है।'
          },
          {
            choice_index: 3,
            text_en: 'Advise them to ignore his restlessness at home and let him grow out of it naturally.',
            text_hi: 'उन्हें सलाह दें कि वे घर पर उसकी अशांतता की अनदेखी करें और उसे प्राकृतिक रूप से इससे बाहर निकलने दें।',
            points: 5,
            theory_tag: 'Permissive Inaction',
            explanation_en: 'Passive inaction misses early developmental intervention windows and fails to establish critical self-regulation boundaries for the growing child.',
            explanation_hi: 'निष्क्रिय निष्क्रियता प्रारंभिकिका विकासात्मक हस्तक्षेप के अवसरों को खो देती है और बढ़ते बच्चे के लिए महत्वपूर्ण आत्म-नियमन सीमाएं स्थापित करने में विफल रहती है।',
            reaction_modifier_en: 'Kabir\'s habits remain erratic, leading to continuing behavioral struggles at home and school.',
            reaction_modifier_hi: 'कबीर की आदतें अनियमित रहती हैं, जिससे घर और स्कूल में व्यवहार संबंधी संघर्ष जारी रहता है।'
          }
        ]
      }
    ]
  }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    console.log('Clearing old scenarios...');
    await Scenario.deleteMany({});

    console.log('Inserting seed scenarios...');
    await Scenario.insertMany(scenarios);
    console.log('Success! Seeded', scenarios.length, 'scenarios.');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();
