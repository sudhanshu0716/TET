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
,
  {
  "scenario_id": "scen_003",
  "subject": "pedagogy",
  "level": "primary",
  "title_en": "Handling the Gifted Bored Student",
  "title_hi": "प्रतिभाशाली ऊबे हुए छात्र को संभालना",
  "steps": [
    {
      "step_number": 1,
      "description_en": "During a math lesson on basic addition, a gifted student, Rohan, sighs loudly and says, \"This is too easy. I already know this.\" He then starts drawing on his desk.",
      "description_hi": "बुनियादी जोड़ पर गणित के पाठ के दौरान, एक प्रतिभाशाली छात्र, रोहन, जोर से आह भरता है और कहता है, \"यह बहुत आसान है। मुझे यह पहले से ही पता है।\" फिर वह अपनी मेज पर चित्र बनाना शुरू कर देता है।",
      "choices": [
        {
          "choice_index": 0,
          "text_en": "Tell him to stop complaining and do the work anyway.",
          "text_hi": "उसे शिकायत बंद करने और वैसे भी काम करने के लिए कहें।",
          "points": 2,
          "theory_tag": "Authoritarian",
          "explanation_en": "Does not address the student's learning needs.",
          "explanation_hi": "छात्र की सीखने की जरूरतों को पूरा नहीं करता है।",
          "reaction_modifier_en": "Rohan becomes defiant.",
          "reaction_modifier_hi": "रोहन विद्रोही हो जाता है।"
        },
        {
          "choice_index": 1,
          "text_en": "Provide him with a more challenging math puzzle related to the topic.",
          "text_hi": "उसे विषय से संबंधित अधिक चुनौतीपूर्ण गणित पहेली प्रदान करें।",
          "points": 10,
          "theory_tag": "Differentiated Instruction",
          "explanation_en": "Meets his advanced cognitive level.",
          "explanation_hi": "उसके उन्नत संज्ञानात्मक स्तर को पूरा करता है।",
          "reaction_modifier_en": "Rohan eagerly solves the puzzle.",
          "reaction_modifier_hi": "रोहन उत्सुकता से पहेली हल करता है।"
        },
        {
          "choice_index": 2,
          "text_en": "Ignore him as long as he is quiet.",
          "text_hi": "जब तक वह चुप है तब तक उसे अनदेखा करें।",
          "points": 4,
          "theory_tag": "Neglect",
          "explanation_en": "Wastes his potential and encourages bad habits.",
          "explanation_hi": "उसकी क्षमता को बर्बाद करता है और बुरी आदतों को प्रोत्साहित करता है।",
          "reaction_modifier_en": "Rohan loses interest in class.",
          "reaction_modifier_hi": "रोहन की कक्षा में रुचि खत्म हो जाती है।"
        },
        {
          "choice_index": 3,
          "text_en": "Ask him to teach the class.",
          "text_hi": "उसे कक्षा को पढ़ाने के लिए कहें।",
          "points": 5,
          "theory_tag": "Peer Tutoring (Misapplied)",
          "explanation_en": "Can cause resentment among peers if not managed well.",
          "explanation_hi": "यदि अच्छी तरह से प्रबंधित नहीं किया गया तो साथियों के बीच नाराजगी पैदा कर सकता है।",
          "reaction_modifier_en": "Peers feel intimidated.",
          "reaction_modifier_hi": "साथी डरा हुआ महसूस करते हैं।"
        }
      ]
    },
    {
      "step_number": 2,
      "description_en": "Rohan finishes the advanced puzzle quickly and asks, \"What now?\"",
      "description_hi": "रोहन उन्नत पहेली को जल्दी से पूरा करता है और पूछता है, \"अब क्या?\"",
      "choices": [
        {
          "choice_index": 0,
          "text_en": "Give him more of the same puzzles.",
          "text_hi": "उसे उसी तरह की और पहेलियाँ दें।",
          "points": 5,
          "theory_tag": "Busy Work",
          "explanation_en": "Repetitive tasks do not stimulate gifted minds.",
          "explanation_hi": "दोहराए जाने वाले कार्य प्रतिभाशाली दिमाग को उत्तेजित नहीं करते हैं।",
          "reaction_modifier_en": "Rohan gets bored again.",
          "reaction_modifier_hi": "रोहन फिर बोर हो जाता है।"
        },
        {
          "choice_index": 1,
          "text_en": "Have him apply the math concept to a real-world problem (e.g., designing a simple building layout).",
          "text_hi": "उससे गणित की अवधारणा को एक वास्तविक दुनिया की समस्या पर लागू करने के लिए कहें (जैसे, एक साधारण इमारत लेआउट डिजाइन करना)।",
          "points": 10,
          "theory_tag": "Constructivism",
          "explanation_en": "Higher-order thinking application.",
          "explanation_hi": "उच्च क्रम की सोच का अनुप्रयोग।",
          "reaction_modifier_en": "Rohan is highly engaged.",
          "reaction_modifier_hi": "रोहन अत्यधिक व्यस्त है।"
        },
        {
          "choice_index": 2,
          "text_en": "Tell him to read a book quietly.",
          "text_hi": "उसे चुपचाप एक किताब पढ़ने के लिए कहें।",
          "points": 4,
          "theory_tag": "Passive Engagement",
          "explanation_en": "Disconnected from the lesson objective.",
          "explanation_hi": "पाठ के उद्देश्य से अलग।",
          "reaction_modifier_en": "Rohan complies but seems unenthusiastic.",
          "reaction_modifier_hi": "रोहन मान जाता है लेकिन निरुत्साहित लगता है।"
        },
        {
          "choice_index": 3,
          "text_en": "Send him to a higher grade class.",
          "text_hi": "उसे उच्च श्रेणी की कक्षा में भेजें।",
          "points": 2,
          "theory_tag": "Tracking",
          "explanation_en": "Socially isolating and administrative overreach for a single lesson.",
          "explanation_hi": "एक ही पाठ के लिए सामाजिक रूप से अलग-थलग करना और प्रशासनिक अतिरेक।",
          "reaction_modifier_en": "Rohan feels out of place socially.",
          "reaction_modifier_hi": "रोहन सामाजिक रूप से अलग-थलग महसूस करता है।"
        }
      ]
    },
    {
      "step_number": 3,
      "description_en": "Rohan creates a fantastic layout. How do you integrate his success with the rest of the class?",
      "description_hi": "रोहन एक शानदार लेआउट बनाता है। आप उसकी सफलता को बाकी कक्षा के साथ कैसे एकीकृत करते हैं?",
      "choices": [
        {
          "choice_index": 0,
          "text_en": "Praise him loudly and tell others to be like him.",
          "text_hi": "उसकी ज़ोर से प्रशंसा करें और दूसरों को उसके जैसा बनने के लिए कहें।",
          "points": 2,
          "theory_tag": "Negative Social Comparison",
          "explanation_en": "Creates unhealthy competition and resentment.",
          "explanation_hi": "अस्वस्थ प्रतिस्पर्धा और आक्रोश पैदा करता है।",
          "reaction_modifier_en": "Classmates resent Rohan.",
          "reaction_modifier_hi": "सहपाठी रोहन से नाराज होते हैं।"
        },
        {
          "choice_index": 1,
          "text_en": "Display his work on the board without explanation.",
          "text_hi": "बिना स्पष्टीकरण के उसका काम बोर्ड पर प्रदर्शित करें।",
          "points": 5,
          "theory_tag": "Passive Recognition",
          "explanation_en": "Misses a learning opportunity for others.",
          "explanation_hi": "दूसरों के लिए सीखने का अवसर चूक जाता है।",
          "reaction_modifier_en": "Students are confused by the complex work.",
          "reaction_modifier_hi": "छात्र जटिल कार्य से भ्रमित हैं।"
        },
        {
          "choice_index": 2,
          "text_en": "Have Rohan briefly explain his project, focusing on the effort and process, not just his smarts.",
          "text_hi": "रोहन से अपनी परियोजना को संक्षेप में समझाने के लिए कहें, केवल उसकी बुद्धिमत्ता पर नहीं, बल्कि प्रयास और प्रक्रिया पर ध्यान केंद्रित करें।",
          "points": 10,
          "theory_tag": "Growth Mindset (Dweck)",
          "explanation_en": "Values process over innate ability, inspiring others.",
          "explanation_hi": "जन्मजात क्षमता पर प्रक्रिया को महत्व देता है, दूसरों को प्रेरित करता है।",
          "reaction_modifier_en": "Classmates are intrigued and ask questions.",
          "reaction_modifier_hi": "सहपाठी चकित हैं और सवाल पूछते हैं।"
        },
        {
          "choice_index": 3,
          "text_en": "Keep it a secret to avoid making others feel bad.",
          "text_hi": "दूसरों को बुरा महसूस कराने से बचने के लिए इसे गुप्त रखें।",
          "points": 3,
          "theory_tag": "Overprotection",
          "explanation_en": "Denies recognition and sharing of knowledge.",
          "explanation_hi": "मान्यता और ज्ञान के बंटवारे से इनकार करता है।",
          "reaction_modifier_en": "Rohan feels his extra effort is unvalued.",
          "reaction_modifier_hi": "रोहन को लगता है कि उसके अतिरिक्त प्रयास का कोई महत्व नहीं है।"
        }
      ]
    }
  ]
},
  {
  "scenario_id": "scen_004",
  "subject": "pedagogy",
  "level": "primary",
  "title_en": "Managing Classroom Bullying",
  "title_hi": "कक्षा में बदमाशी का प्रबंधन",
  "steps": [
    {
      "step_number": 1,
      "description_en": "You notice a group of students consistently teasing a new student, Maya, about her accent.",
      "description_hi": "आप देखते हैं कि छात्रों का एक समूह लगातार एक नई छात्रा, माया, को उसके उच्चारण के लिए चिढ़ा रहा है।",
      "choices": [
        {
          "choice_index": 0,
          "text_en": "Address the issue immediately with a classroom discussion on diversity and empathy.",
          "text_hi": "विविधता और सहानुभूति पर कक्षा में चर्चा के साथ तुरंत इस मुद्दे को संबोधित करें।",
          "points": 10,
          "theory_tag": "Proactive Social-Emotional Learning",
          "explanation_en": "Creates a culture of inclusion.",
          "explanation_hi": "समावेश की संस्कृति बनाता है।",
          "reaction_modifier_en": "Students reflect on their behavior.",
          "reaction_modifier_hi": "छात्र अपने व्यवहार पर चिंतन करते हैं।"
        },
        {
          "choice_index": 1,
          "text_en": "Wait to see if Maya defends herself.",
          "text_hi": "यह देखने के लिए प्रतीक्षा करें कि क्या माया अपना बचाव करती है।",
          "points": 2,
          "theory_tag": "Negligence",
          "explanation_en": "Allows bullying culture to take root.",
          "explanation_hi": "बदमाशी संस्कृति को जड़ें जमाने देता है।",
          "reaction_modifier_en": "Maya becomes withdrawn.",
          "reaction_modifier_hi": "माया अंतर्मुखी हो जाती है।"
        },
        {
          "choice_index": 2,
          "text_en": "Punish the bullies privately without explaining why to the class.",
          "text_hi": "कक्षा को कारण बताए बिना बदमाशों को निजी तौर पर दंडित करें।",
          "points": 4,
          "theory_tag": "Punitive without Restitution",
          "explanation_en": "Stops the immediate behavior but doesn't teach empathy.",
          "explanation_hi": "तत्काल व्यवहार को रोकता है लेकिन सहानुभूति नहीं सिखाता है।",
          "reaction_modifier_en": "Teasing stops openly but continues in secret.",
          "reaction_modifier_hi": "चिढ़ाना खुले तौर पर बंद हो जाता है लेकिन गुप्त रूप से जारी रहता है।"
        },
        {
          "choice_index": 3,
          "text_en": "Tell Maya to ignore them.",
          "text_hi": "माया से कहें कि वह उन्हें नजरअंदाज कर दे।",
          "points": 3,
          "theory_tag": "Victim Blaming",
          "explanation_en": "Places the burden on the victim.",
          "explanation_hi": "पीड़ित पर बोझ डालता है।",
          "reaction_modifier_en": "Maya feels unsupported.",
          "reaction_modifier_hi": "माया को लगता है कि उसे कोई समर्थन नहीं मिल रहा है।"
        }
      ]
    },
    {
      "step_number": 2,
      "description_en": "One of the bullies, Kabir, says he was \"just joking.\"",
      "description_hi": "बदमाशों में से एक, कबीर, कहता है कि वह \"सिर्फ मजाक कर रहा था।\"",
      "choices": [
        {
          "choice_index": 0,
          "text_en": "Accept his excuse and let it go.",
          "text_hi": "उसका बहाना स्वीकार करें और जाने दें।",
          "points": 2,
          "theory_tag": "Minimization",
          "explanation_en": "Validates bullying disguised as humor.",
          "explanation_hi": "हास्य के रूप में प्रच्छन्न बदमाशी को मान्य करता है।",
          "reaction_modifier_en": "Kabir smirks.",
          "reaction_modifier_hi": "कबीर मुस्कुराता है।"
        },
        {
          "choice_index": 1,
          "text_en": "Explain the difference between a joke (where everyone laughs) and bullying (where someone is hurt).",
          "text_hi": "एक मजाक (जहां हर कोई हंसता है) और बदमाशी (जहां किसी को चोट लगती है) के बीच अंतर स्पष्ट करें।",
          "points": 10,
          "theory_tag": "Cognitive Restructuring",
          "explanation_en": "Helps him understand the impact of his actions.",
          "explanation_hi": "उसे अपने कार्यों के प्रभाव को समझने में मदद करता है।",
          "reaction_modifier_en": "Kabir looks thoughtful and realizes his mistake.",
          "reaction_modifier_hi": "कबीर विचारशील दिखता है और अपनी गलती का एहसास करता है।"
        },
        {
          "choice_index": 2,
          "text_en": "Yell at him for lying.",
          "text_hi": "झूठ बोलने के लिए उस पर चिल्लाओ।",
          "points": 3,
          "theory_tag": "Aggressive Confrontation",
          "explanation_en": "Models aggressive behavior.",
          "explanation_hi": "आक्रामक व्यवहार का मॉडल।",
          "reaction_modifier_en": "Kabir becomes defensive.",
          "reaction_modifier_hi": "कबीर रक्षात्मक हो जाता है।"
        },
        {
          "choice_index": 3,
          "text_en": "Make him write \"I will not joke\" 100 times.",
          "text_hi": "उसे 100 बार \"मैं मजाक नहीं करूंगा\" लिखने को कहें।",
          "points": 4,
          "theory_tag": "Rote Punishment",
          "explanation_en": "Ineffective for moral development.",
          "explanation_hi": "नैतिक विकास के लिए अप्रभावी।",
          "reaction_modifier_en": "Kabir resents the task.",
          "reaction_modifier_hi": "कबीर कार्य से नाराज है।"
        }
      ]
    },
    {
      "step_number": 3,
      "description_en": "How do you support Maya moving forward?",
      "description_hi": "आप माया को आगे बढ़ने में कैसे समर्थन करते हैं?",
      "choices": [
        {
          "choice_index": 0,
          "text_en": "Assign her a sympathetic \"buddy\" for the week.",
          "text_hi": "सप्ताह के लिए उसे एक सहानुभूतिपूर्ण \"दोस्त\" सौंपें।",
          "points": 10,
          "theory_tag": "Peer Support Systems",
          "explanation_en": "Fosters positive peer integration.",
          "explanation_hi": "सकारात्मक सहकर्मी एकीकरण को बढ़ावा देता है।",
          "reaction_modifier_en": "Maya smiles and makes a friend.",
          "reaction_modifier_hi": "माया मुस्कुराती है और एक दोस्त बनाती है।"
        },
        {
          "choice_index": 1,
          "text_en": "Keep her close to your desk at all times.",
          "text_hi": "उसे हर समय अपनी मेज के करीब रखें।",
          "points": 5,
          "theory_tag": "Over-scaffolding",
          "explanation_en": "Prevents natural socialization.",
          "explanation_hi": "प्राकृतिक समाजीकरण को रोकता है।",
          "reaction_modifier_en": "Maya feels alienated from peers.",
          "reaction_modifier_hi": "माया साथियों से अलग-थलग महसूस करती है।"
        },
        {
          "choice_index": 2,
          "text_en": "Tell her parents to toughen her up.",
          "text_hi": "उसके माता-पिता से उसे कठोर बनाने के लिए कहें।",
          "points": 2,
          "theory_tag": "Dismissive",
          "explanation_en": "Unprofessional and unhelpful.",
          "explanation_hi": "अव्यावसायिक और अनुपयोगी।",
          "reaction_modifier_en": "Parents are offended.",
          "reaction_modifier_hi": "माता-पिता आहत हैं।"
        },
        {
          "choice_index": 3,
          "text_en": "Do nothing, assuming the problem is solved.",
          "text_hi": "यह मानकर कुछ न करें कि समस्या हल हो गई है।",
          "points": 4,
          "theory_tag": "Lack of Follow-through",
          "explanation_en": "Fails to ensure long-term well-being.",
          "explanation_hi": "दीर्घकालिक भलाई सुनिश्चित करने में विफल रहता है।",
          "reaction_modifier_en": "Maya remains slightly anxious.",
          "reaction_modifier_hi": "माया थोड़ी चिंतित रहती है।"
        }
      ]
    }
  ]
},
  {
  "scenario_id": "scen_005",
  "subject": "pedagogy",
  "level": "primary",
  "title_en": "Teaching a Child with Dyslexia",
  "title_hi": "डिस्लेक्सिया वाले बच्चे को पढ़ाना",
  "steps": [
    {
      "step_number": 1,
      "description_en": "Ravi struggles to read aloud, mixing up letters like 'b' and 'd'. Peers snicker.",
      "description_hi": "रवि जोर से पढ़ने में संघर्ष करता है, 'b' और 'd' जैसे अक्षरों को मिला देता है। सहपाठी हंसते हैं।",
      "choices": [
        {
          "choice_index": 0,
          "text_en": "Provide him with text printed in a dyslexia-friendly font and use multisensory reading techniques (tracing letters in sand).",
          "text_hi": "उसे डिस्लेक्सिया-अनुकूल फ़ॉन्ट में मुद्रित पाठ प्रदान करें और बहुसंवेदी पठन तकनीकों (रेत में अक्षरों का पता लगाना) का उपयोग करें।",
          "points": 10,
          "theory_tag": "Multisensory Orton-Gillingham Approach",
          "explanation_en": "Evidence-based intervention for dyslexia.",
          "explanation_hi": "डिस्लेक्सिया के लिए साक्ष्य-आधारित हस्तक्षेप।",
          "reaction_modifier_en": "Ravi makes slow but confident progress.",
          "reaction_modifier_hi": "रवि धीमी लेकिन आत्मविश्वासी प्रगति करता है।"
        },
        {
          "choice_index": 1,
          "text_en": "Force him to read aloud more often to \"practice\".",
          "text_hi": "\"अभ्यास\" करने के लिए उसे अधिक बार जोर से पढ़ने के लिए मजबूर करें।",
          "points": 2,
          "theory_tag": "Forced Exposure",
          "explanation_en": "Increases anxiety without providing tools.",
          "explanation_hi": "उपकरण प्रदान किए बिना चिंता बढ़ाता है।",
          "reaction_modifier_en": "Ravi develops severe reading anxiety.",
          "reaction_modifier_hi": "रवि में पढ़ने की गंभीर चिंता विकसित हो जाती है।"
        },
        {
          "choice_index": 2,
          "text_en": "Exempt him from reading entirely.",
          "text_hi": "उसे पूरी तरह से पढ़ने से छूट दें।",
          "points": 4,
          "theory_tag": "Low Expectations",
          "explanation_en": "Denies him the right to learn to read.",
          "explanation_hi": "उसे पढ़ना सीखने के अधिकार से वंचित करता है।",
          "reaction_modifier_en": "Ravi falls further behind academically.",
          "reaction_modifier_hi": "रवि अकादमिक रूप से और पिछड़ जाता है।"
        },
        {
          "choice_index": 3,
          "text_en": "Tell the laughing peers to stop, but do nothing to help Ravi read.",
          "text_hi": "हंसते हुए साथियों को रुकने के लिए कहें, लेकिन रवि को पढ़ने में मदद करने के लिए कुछ न करें।",
          "points": 5,
          "theory_tag": "Superficial Management",
          "explanation_en": "Addresses symptom but not the root educational need.",
          "explanation_hi": "लक्षण को संबोधित करता है लेकिन मूल शैक्षिक आवश्यकता को नहीं।",
          "reaction_modifier_en": "Ravi feels defended but still helpless.",
          "reaction_modifier_hi": "रवि को लगता है कि उसका बचाव किया गया है लेकिन वह अभी भी असहाय है।"
        }
      ]
    },
    {
      "step_number": 2,
      "description_en": "It's spelling test time. Ravi is extremely stressed.",
      "description_hi": "यह वर्तनी परीक्षण (स्पेलिंग टेस्ट) का समय है। रवि बेहद तनाव में है।",
      "choices": [
        {
          "choice_index": 0,
          "text_en": "Grade him only on phonetics and effort, not perfect standard spelling.",
          "text_hi": "उसे केवल ध्वनिविज्ञान (फ़ोनेटिक्स) और प्रयास पर ग्रेड दें, सही मानक वर्तनी पर नहीं।",
          "points": 10,
          "theory_tag": "Alternative Assessment",
          "explanation_en": "Focuses on the learning process over rigid outcomes.",
          "explanation_hi": "कठोर परिणामों के बजाय सीखने की प्रक्रिया पर ध्यान केंद्रित करता है।",
          "reaction_modifier_en": "Ravi tries his best without fear of a zero.",
          "reaction_modifier_hi": "रवि बिना शून्य के डर के अपना सर्वश्रेष्ठ प्रयास करता है।"
        },
        {
          "choice_index": 1,
          "text_en": "Give him a zero for every reversed letter.",
          "text_hi": "हर उल्टे अक्षर के लिए उसे शून्य दें।",
          "points": 2,
          "theory_tag": "Rigid Assessment",
          "explanation_en": "Punishes a neurological difference.",
          "explanation_hi": "एक तंत्रिका संबंधी अंतर को दंडित करता है।",
          "reaction_modifier_en": "Ravi tears up his paper.",
          "reaction_modifier_hi": "रवि अपना कागज फाड़ देता है।"
        },
        {
          "choice_index": 2,
          "text_en": "Let him copy from a friend.",
          "text_hi": "उसे एक दोस्त से नकल करने दें।",
          "points": 3,
          "theory_tag": "Academic Dishonesty Facilitation",
          "explanation_en": "Prevents accurate assessment.",
          "explanation_hi": "सटीक मूल्यांकन को रोकता है।",
          "reaction_modifier_en": "Ravi learns nothing.",
          "reaction_modifier_hi": "रवि कुछ नहीं सीखता।"
        },
        {
          "choice_index": 3,
          "text_en": "Give him fewer words to spell.",
          "text_hi": "उसे स्पेलिंग के लिए कम शब्द दें।",
          "points": 7,
          "theory_tag": "Task Reduction",
          "explanation_en": "A valid accommodation, but alternative grading is better.",
          "explanation_hi": "एक वैध आवास, लेकिन वैकल्पिक ग्रेडिंग बेहतर है।",
          "reaction_modifier_en": "Ravi is less stressed but still struggles with the format.",
          "reaction_modifier_hi": "रवि कम तनावग्रस्त है लेकिन फिर भी प्रारूप के साथ संघर्ष करता है।"
        }
      ]
    },
    {
      "step_number": 3,
      "description_en": "Ravi expresses interest in storytelling despite his reading issues.",
      "description_hi": "रवि अपनी पढ़ने की समस्याओं के बावजूद कहानी सुनाने में रुचि व्यक्त करता है।",
      "choices": [
        {
          "choice_index": 0,
          "text_en": "Allow him to record his stories on an audio device or use speech-to-text software.",
          "text_hi": "उसे अपनी कहानियों को एक ऑडियो डिवाइस पर रिकॉर्ड करने या स्पीच-टू-टेक्स्ट सॉफ़्टवेयर का उपयोग करने की अनुमति दें।",
          "points": 10,
          "theory_tag": "Assistive Technology Integration",
          "explanation_en": "Bypasses the deficit to allow expression of strengths.",
          "explanation_hi": "ताकत की अभिव्यक्ति की अनुमति देने के लिए कमी को दरकिनार करता है।",
          "reaction_modifier_en": "Ravi creates amazing stories.",
          "reaction_modifier_hi": "रवि अद्भुत कहानियाँ बनाता है।"
        },
        {
          "choice_index": 1,
          "text_en": "Tell him he must learn to write properly first.",
          "text_hi": "उससे कहें कि उसे पहले ठीक से लिखना सीखना होगा।",
          "points": 3,
          "theory_tag": "Skill Gating",
          "explanation_en": "Kills creativity by making it contingent on a weakness.",
          "explanation_hi": "इसे कमजोरी पर निर्भर बनाकर रचनात्मकता को मारता है।",
          "reaction_modifier_en": "Ravi stops inventing stories.",
          "reaction_modifier_hi": "रवि कहानियाँ गढ़ना बंद कर देता है।"
        },
        {
          "choice_index": 2,
          "text_en": "Have another student write his stories for him permanently.",
          "text_hi": "किसी अन्य छात्र से उसके लिए स्थायी रूप से उसकी कहानियाँ लिखवाएं।",
          "points": 5,
          "theory_tag": "Over-reliance",
          "explanation_en": "Reduces his independence.",
          "explanation_hi": "उसकी स्वतंत्रता को कम करता है।",
          "reaction_modifier_en": "Ravi feels dependent on others.",
          "reaction_modifier_hi": "रवि दूसरों पर निर्भर महसूस करता है।"
        },
        {
          "choice_index": 3,
          "text_en": "Give him extra handwriting homework.",
          "text_hi": "उसे अतिरिक्त हस्तलेखन होमवर्क दें।",
          "points": 2,
          "theory_tag": "Misaligned Intervention",
          "explanation_en": "Handwriting drills don't cure dyslexia.",
          "explanation_hi": "हस्तलेखन अभ्यास डिस्लेक्सिया का इलाज नहीं करते हैं।",
          "reaction_modifier_en": "Ravi is exhausted and frustrated.",
          "reaction_modifier_hi": "रवि थका हुआ और निराश है।"
        }
      ]
    }
  ]
},
  {
  "scenario_id": "scen_006",
  "subject": "pedagogy",
  "level": "primary",
  "title_en": "First Day of School Anxiety",
  "title_hi": "स्कूल के पहले दिन की चिंता",
  "steps": [
    {
      "step_number": 1,
      "description_en": "A 5-year-old child, Sana, is crying uncontrollably and clinging to her mother on the first day of school.",
      "description_hi": "5 साल की बच्ची, सना, स्कूल के पहले दिन बेतहाशा रो रही है और अपनी माँ से लिपटी हुई है।",
      "choices": [
        {
          "choice_index": 0,
          "text_en": "Pry her away and tell the mother to leave immediately.",
          "text_hi": "उसे दूर करें और माँ को तुरंत जाने के लिए कहें।",
          "points": 2,
          "theory_tag": "Traumatic Separation",
          "explanation_en": "Damages trust (Erikson: Trust vs. Mistrust).",
          "explanation_hi": "विश्वास को नुकसान पहुँचाता है (एरिकसन: विश्वास बनाम अविश्वास)।",
          "reaction_modifier_en": "Sana cries for hours.",
          "reaction_modifier_hi": "सना घंटों रोती है।"
        },
        {
          "choice_index": 1,
          "text_en": "Welcome them warmly, show Sana a fascinating toy, and suggest the mother stay for 5 minutes before saying a clear goodbye.",
          "text_hi": "उनका गर्मजोशी से स्वागत करें, सना को एक आकर्षक खिलौना दिखाएं, और सुझाव दें कि माँ स्पष्ट अलविदा कहने से पहले 5 मिनट रुकें।",
          "points": 10,
          "theory_tag": "Attachment Theory (Transitional Object)",
          "explanation_en": "Provides a secure base transition.",
          "explanation_hi": "एक सुरक्षित आधार संक्रमण प्रदान करता है।",
          "reaction_modifier_en": "Sana slowly engages with the toy as mom leaves.",
          "reaction_modifier_hi": "माँ के जाने पर सना धीरे-धीरे खिलौने में व्यस्त हो जाती है।"
        },
        {
          "choice_index": 2,
          "text_en": "Tell Sana big girls don't cry.",
          "text_hi": "सना से कहो कि बड़ी लड़कियां नहीं रोतीं।",
          "points": 3,
          "theory_tag": "Emotion Dismissal",
          "explanation_en": "Invalidates her genuine fear.",
          "explanation_hi": "उसके वास्तविक डर को अमान्य करता है।",
          "reaction_modifier_en": "Sana suppresses her feelings but looks terrified.",
          "reaction_modifier_hi": "सना अपनी भावनाओं को दबाती है लेकिन भयभीत दिखती है।"
        },
        {
          "choice_index": 3,
          "text_en": "Ignore the crying and start the lesson loudly.",
          "text_hi": "रोने को नज़रअंदाज़ करें और ज़ोर से पाठ शुरू करें।",
          "points": 4,
          "theory_tag": "Insensitive Instruction",
          "explanation_en": "Shows lack of emotional intelligence.",
          "explanation_hi": "भावनात्मक बुद्धिमत्ता की कमी को दर्शाता है।",
          "reaction_modifier_en": "Sana feels neglected.",
          "reaction_modifier_hi": "सना खुद को उपेक्षित महसूस करती है।"
        }
      ]
    },
    {
      "step_number": 2,
      "description_en": "Later, Sana refuses to join the circle time.",
      "description_hi": "बाद में, सना सर्कल समय में शामिल होने से इनकार कर देती है।",
      "choices": [
        {
          "choice_index": 0,
          "text_en": "Force her to sit in the circle.",
          "text_hi": "उसे सर्कल में बैठने के लिए मजबूर करें।",
          "points": 2,
          "theory_tag": "Coercion",
          "explanation_en": "Increases resistance.",
          "explanation_hi": "प्रतिरोध बढ़ाता है।",
          "reaction_modifier_en": "Sana throws a tantrum.",
          "reaction_modifier_hi": "सना नखरे करती है।"
        },
        {
          "choice_index": 1,
          "text_en": "Allow her to watch from a short distance and invite her gently when she seems ready.",
          "text_hi": "उसे थोड़ी दूरी से देखने दें और जब वह तैयार लगे तो उसे धीरे से आमंत्रित करें।",
          "points": 10,
          "theory_tag": "Gradual Exposure",
          "explanation_en": "Respects her boundaries while encouraging participation.",
          "explanation_hi": "भागीदारी को प्रोत्साहित करते हुए उसकी सीमाओं का सम्मान करता है।",
          "reaction_modifier_en": "Sana eventually scoots closer to the group.",
          "reaction_modifier_hi": "सना अंततः समूह के करीब आती है।"
        },
        {
          "choice_index": 2,
          "text_en": "Bribe her with a candy.",
          "text_hi": "उसे कैंडी की रिश्वत दें।",
          "points": 4,
          "theory_tag": "Extrinsic Motivation",
          "explanation_en": "Doesn't build intrinsic security.",
          "explanation_hi": "आंतरिक सुरक्षा का निर्माण नहीं करता है।",
          "reaction_modifier_en": "Sana joins for the candy but leaves after.",
          "reaction_modifier_hi": "सना कैंडी के लिए जुड़ती है लेकिन उसके बाद चली जाती है।"
        },
        {
          "choice_index": 3,
          "text_en": "Tell the class to chant her name.",
          "text_hi": "कक्षा को उसका नाम जपने के लिए कहें।",
          "points": 3,
          "theory_tag": "Overwhelming Attention",
          "explanation_en": "Can be terrifying for an anxious child.",
          "explanation_hi": "एक चिंतित बच्चे के लिए भयानक हो सकता है।",
          "reaction_modifier_en": "Sana hides under a desk.",
          "reaction_modifier_hi": "सना एक डेस्क के नीचे छिप जाती है।"
        }
      ]
    },
    {
      "step_number": 3,
      "description_en": "By the end of the day, she is playing happily with blocks.",
      "description_hi": "दिन के अंत तक, वह ब्लॉकों के साथ खुशी-खुशी खेल रही है।",
      "choices": [
        {
          "choice_index": 0,
          "text_en": "Say nothing to avoid reminding her of the morning.",
          "text_hi": "सुबह की याद दिलाने से बचने के लिए कुछ न कहें।",
          "points": 5,
          "theory_tag": "Missed Reinforcement",
          "explanation_en": "Misses a chance to reinforce positive behavior.",
          "explanation_hi": "सकारात्मक व्यवहार को सुदृढ़ करने का अवसर चूक जाता है।",
          "reaction_modifier_en": "Sana leaves quietly.",
          "reaction_modifier_hi": "सना चुपचाप चली जाती है।"
        },
        {
          "choice_index": 1,
          "text_en": "Praise her specifically: \"I loved seeing you build that tall tower today! You were very brave.\"",
          "text_hi": "विशेष रूप से उसकी प्रशंसा करें: \"मुझे आज आपको वह ऊंचा टॉवर बनाते हुए देखना बहुत अच्छा लगा! आप बहुत बहादुर थे।\"",
          "points": 10,
          "theory_tag": "Specific Positive Reinforcement",
          "explanation_en": "Builds self-efficacy.",
          "explanation_hi": "आत्म-प्रभावकारिता का निर्माण करता है।",
          "reaction_modifier_en": "Sana smiles proudly.",
          "reaction_modifier_hi": "सना गर्व से मुस्कुराती है।"
        },
        {
          "choice_index": 2,
          "text_en": "Tell her mom she was a \"crybaby\" initially.",
          "text_hi": "उसकी माँ को बताएं कि वह शुरू में एक \"रोतड़ू\" थी।",
          "points": 2,
          "theory_tag": "Negative Labeling",
          "explanation_en": "Unprofessional and damaging.",
          "explanation_hi": "अव्यावसायिक और हानिकारक।",
          "reaction_modifier_en": "Mom looks upset.",
          "reaction_modifier_hi": "माँ परेशान दिखती है।"
        },
        {
          "choice_index": 3,
          "text_en": "Give her a sticker for surviving.",
          "text_hi": "जीवित रहने के लिए उसे एक स्टिकर दें।",
          "points": 6,
          "theory_tag": "Generic Reward",
          "explanation_en": "Okay, but less effective than specific verbal praise.",
          "explanation_hi": "ठीक है, लेकिन विशिष्ट मौखिक प्रशंसा से कम प्रभावी है।",
          "reaction_modifier_en": "Sana likes the sticker.",
          "reaction_modifier_hi": "सना को स्टिकर पसंद आता है।"
        }
      ]
    }
  ]
},
  {
  "scenario_id": "scen_007",
  "subject": "pedagogy",
  "level": "junior",
  "title_en": "Student Caught Cheating on Test",
  "title_hi": "टेस्ट में नकल करते पकड़ा गया छात्र",
  "steps": [
    {
      "step_number": 1,
      "description_en": "You catch a 7th grader, Aryan, looking at a cheat sheet during a mid-term exam.",
      "description_hi": "आप 7वीं कक्षा के छात्र, आर्यन को मिड-टर्म परीक्षा के दौरान चीट शीट देखते हुए पकड़ते हैं।",
      "choices": [
        {
          "choice_index": 0,
          "text_en": "Tear his paper in front of everyone and shout at him.",
          "text_hi": "सबके सामने उसका पेपर फाड़ दें और उस पर चिल्लाएं।",
          "points": 2,
          "theory_tag": "Public Humiliation",
          "explanation_en": "Violates dignity and creates a hostile environment.",
          "explanation_hi": "गरिमा का उल्लंघन करता है और एक शत्रुतापूर्ण वातावरण बनाता है।",
          "reaction_modifier_en": "Aryan is humiliated and angry.",
          "reaction_modifier_hi": "आर्यन अपमानित और क्रोधित है।"
        },
        {
          "choice_index": 1,
          "text_en": "Quietly take the cheat sheet, tap his desk, and gesture for him to see you after class.",
          "text_hi": "चुपचाप चीट शीट लें, उसकी डेस्क थपथपाएं, और उसे कक्षा के बाद आपसे मिलने का इशारा करें।",
          "points": 10,
          "theory_tag": "Private Correction (Dignity Retention)",
          "explanation_en": "Stops the cheating immediately without public shaming.",
          "explanation_hi": "सार्वजनिक रूप से शर्मिंदा किए बिना तुरंत नकल रोकता है।",
          "reaction_modifier_en": "Aryan looks ashamed but finishes what he knows.",
          "reaction_modifier_hi": "आर्यन शर्मिंदा दिखता है लेकिन जो जानता है उसे पूरा करता है।"
        },
        {
          "choice_index": 2,
          "text_en": "Ignore it so you don't disrupt the others taking the test.",
          "text_hi": "इसे नज़रअंदाज़ करें ताकि आप परीक्षा देने वाले अन्य लोगों को परेशान न करें।",
          "points": 3,
          "theory_tag": "Permissive",
          "explanation_en": "Invalidates the assessment for everyone.",
          "explanation_hi": "सभी के लिए मूल्यांकन को अमान्य करता है।",
          "reaction_modifier_en": "Other students see Aryan cheating and lose respect for you.",
          "reaction_modifier_hi": "अन्य छात्र आर्यन को नकल करते हुए देखते हैं और आपके प्रति सम्मान खो देते हैं।"
        },
        {
          "choice_index": 3,
          "text_en": "Announce to the class that someone is cheating without naming him.",
          "text_hi": "कक्षा में घोषणा करें कि कोई नाम लिए बिना नकल कर रहा है।",
          "points": 5,
          "theory_tag": "Passive Aggressive Management",
          "explanation_en": "Causes anxiety for innocent students and may not stop Aryan.",
          "explanation_hi": "निर्दोष छात्रों के लिए चिंता का कारण बनता है और आर्यन को नहीं रोक सकता है।",
          "reaction_modifier_en": "The whole class becomes tense.",
          "reaction_modifier_hi": "पूरी कक्षा तनावग्रस्त हो जाती है।"
        }
      ]
    },
    {
      "step_number": 2,
      "description_en": "Aryan meets you after class and cries, saying his parents will punish him if he doesn't get an A.",
      "description_hi": "आर्यन कक्षा के बाद आपसे मिलता है और रोते हुए कहता है कि अगर उसे 'A' नहीं मिला तो उसके माता-पिता उसे सजा देंगे।",
      "choices": [
        {
          "choice_index": 0,
          "text_en": "Tell him rules are rules and give him a zero anyway.",
          "text_hi": "उसे बताएं कि नियम नियम हैं और उसे वैसे भी शून्य दें।",
          "points": 4,
          "theory_tag": "Zero-Tolerance Policy",
          "explanation_en": "Fails to address the underlying psychological pressure.",
          "explanation_hi": "अंतर्निहित मनोवैज्ञानिक दबाव को दूर करने में विफल रहता है।",
          "reaction_modifier_en": "Aryan feels hopeless.",
          "reaction_modifier_hi": "आर्यन निराश महसूस करता है।"
        },
        {
          "choice_index": 1,
          "text_en": "Discuss the pressure with him, grade the portion he did honestly, and schedule a parent-teacher meeting regarding realistic expectations.",
          "text_hi": "उसके साथ दबाव पर चर्चा करें, उस हिस्से को ग्रेड दें जो उसने ईमानदारी से किया था, और यथार्थवादी अपेक्षाओं के संबंध में माता-पिता-शिक्षक बैठक निर्धारित करें।",
          "points": 10,
          "theory_tag": "Restorative Justice & Root Cause Analysis",
          "explanation_en": "Addresses the root cause (parental pressure) while maintaining academic integrity.",
          "explanation_hi": "अकादमिक अखंडता बनाए रखते हुए मूल कारण (माता-पिता का दबाव) को संबोधित करता है।",
          "reaction_modifier_en": "Aryan feels understood and agrees to the meeting.",
          "reaction_modifier_hi": "आर्यन खुद को समझा हुआ महसूस करता है और बैठक के लिए सहमत होता है।"
        },
        {
          "choice_index": 2,
          "text_en": "Let him retake the test immediately.",
          "text_hi": "उसे तुरंत परीक्षा फिर से देने दें।",
          "points": 5,
          "theory_tag": "Unearned Pardon",
          "explanation_en": "Doesn't teach accountability for the initial action.",
          "explanation_hi": "प्रारंभिक कार्रवाई के लिए जवाबदेही नहीं सिखाता है।",
          "reaction_modifier_en": "Aryan learns cheating has no real consequences.",
          "reaction_modifier_hi": "आर्यन सीखता है कि धोखाधड़ी के कोई वास्तविक परिणाम नहीं होते हैं।"
        },
        {
          "choice_index": 3,
          "text_en": "Threaten to tell his parents he cheated to scare him straight.",
          "text_hi": "उसे डराने के लिए उसके माता-पिता को बताने की धमकी दें कि उसने नकल की है।",
          "points": 2,
          "theory_tag": "Coercive Threat",
          "explanation_en": "Exploits his existing fear and breaks teacher-student trust.",
          "explanation_hi": "उसके मौजूदा डर का फायदा उठाता है और शिक्षक-छात्र के विश्वास को तोड़ता है।",
          "reaction_modifier_en": "Aryan panics and begs you not to.",
          "reaction_modifier_hi": "आर्यन घबरा जाता है और आपसे ऐसा न करने की भीख मांगता है।"
        }
      ]
    },
    {
      "step_number": 3,
      "description_en": "To prevent future cheating, what structural change do you implement?",
      "description_hi": "भविष्य में होने वाली धोखाधड़ी को रोकने के लिए, आप कौन सा संरचनात्मक परिवर्तन लागू करते हैं?",
      "choices": [
        {
          "choice_index": 0,
          "text_en": "Make tests 100% multiple choice so it's harder to cheat.",
          "text_hi": "परीक्षणों को 100% बहुविकल्पीय बनाएं ताकि नकल करना कठिन हो।",
          "points": 3,
          "theory_tag": "Lower-order Assessment",
          "explanation_en": "Multiple choice can actually be easier to cheat on (copying letters).",
          "explanation_hi": "बहुविकल्पीय पर नकल करना वास्तव में आसान हो सकता है (अक्षरों की नकल करना)।",
          "reaction_modifier_en": "Students still find ways to cheat.",
          "reaction_modifier_hi": "छात्र अभी भी नकल करने के तरीके खोज लेते हैं।"
        },
        {
          "choice_index": 1,
          "text_en": "Shift towards open-book tests and project-based assessments focusing on application.",
          "text_hi": "ओपन-बुक परीक्षणों और अनुप्रयोग पर ध्यान केंद्रित करने वाले प्रोजेक्ट-आधारित आकलनों की ओर शिफ्ट करें।",
          "points": 10,
          "theory_tag": "Authentic Assessment",
          "explanation_en": "Tests higher-order thinking where rote cheating is impossible.",
          "explanation_hi": "उच्च क्रम की सोच का परीक्षण करता है जहां रट कर धोखाधड़ी करना असंभव है।",
          "reaction_modifier_en": "Students focus on understanding rather than memorizing.",
          "reaction_modifier_hi": "छात्र रटने के बजाय समझने पर ध्यान केंद्रित करते हैं।"
        },
        {
          "choice_index": 2,
          "text_en": "Install cameras in the classroom.",
          "text_hi": "कक्षा में कैमरे लगाएं।",
          "points": 2,
          "theory_tag": "Surveillance Culture",
          "explanation_en": "Creates an atmosphere of distrust.",
          "explanation_hi": "अविश्वास का माहौल बनाता है।",
          "reaction_modifier_en": "Students feel anxious and untrusted.",
          "reaction_modifier_hi": "छात्र चिंतित और अविश्वास महसूस करते हैं।"
        },
        {
          "choice_index": 3,
          "text_en": "Make the tests incredibly difficult so even with a cheat sheet, they fail.",
          "text_hi": "परीक्षणों को अविश्वसनीय रूप से कठिन बनाएं ताकि चीट शीट के साथ भी वे विफल हो जाएं।",
          "points": 2,
          "theory_tag": "Punitive Assessment Design",
          "explanation_en": "Destroys academic motivation for all students.",
          "explanation_hi": "सभी छात्रों के लिए शैक्षणिक प्रेरणा को नष्ट कर देता है।",
          "reaction_modifier_en": "Class average plummets; morale hits rock bottom.",
          "reaction_modifier_hi": "कक्षा का औसत गिरता है; मनोबल रसातल में चला जाता है।"
        }
      ]
    }
  ]
},
  {
  "scenario_id": "scen_008",
  "subject": "pedagogy",
  "level": "junior",
  "title_en": "Multilingual Classroom Communication",
  "title_hi": "बहुभाषी कक्षा संचार",
  "steps": [
    {
      "step_number": 1,
      "description_en": "You are teaching science. A student from a rural background asks a question in a regional dialect. Other students laugh.",
      "description_hi": "आप विज्ञान पढ़ा रहे हैं। ग्रामीण पृष्ठभूमि का एक छात्र क्षेत्रीय बोली में एक प्रश्न पूछता है। अन्य छात्र हंसते हैं।",
      "choices": [
        {
          "choice_index": 0,
          "text_en": "Tell the student to only speak in standard English or Hindi.",
          "text_hi": "छात्र से केवल मानक अंग्रेजी या हिंदी में बोलने के लिए कहें।",
          "points": 3,
          "theory_tag": "Linguistic Imperialism",
          "explanation_en": "Violates NCF guidelines on mother tongue use.",
          "explanation_hi": "मातृभाषा के उपयोग पर NCF दिशानिर्देशों का उल्लंघन करता है।",
          "reaction_modifier_en": "The student stops asking questions entirely.",
          "reaction_modifier_hi": "छात्र पूरी तरह से सवाल पूछना बंद कर देता है।"
        },
        {
          "choice_index": 1,
          "text_en": "Silence the laughter, validate the student's question, and translate it smoothly for the class.",
          "text_hi": "हंसी को शांत करें, छात्र के प्रश्न को मान्य करें, और कक्षा के लिए इसका सुचारू रूप से अनुवाद करें।",
          "points": 10,
          "theory_tag": "Translanguaging & Inclusive Pedagogy",
          "explanation_en": "Respects linguistic diversity and ensures comprehension.",
          "explanation_hi": "भाषाई विविधता का सम्मान करता है और समझ सुनिश्चित करता है।",
          "reaction_modifier_en": "The student feels respected and continues participating.",
          "reaction_modifier_hi": "छात्र सम्मानित महसूस करता है और भाग लेना जारी रखता है।"
        },
        {
          "choice_index": 2,
          "text_en": "Laugh along with the class to keep the mood light.",
          "text_hi": "माहौल को हल्का रखने के लिए कक्षा के साथ हंसें।",
          "points": 1,
          "theory_tag": "Teacher Complicity in Bullying",
          "explanation_en": "Deeply damaging to the student's self-esteem.",
          "explanation_hi": "छात्र के आत्मसम्मान को गहरा नुकसान पहुंचाता है।",
          "reaction_modifier_en": "The student feels humiliated.",
          "reaction_modifier_hi": "छात्र अपमानित महसूस करता है।"
        },
        {
          "choice_index": 3,
          "text_en": "Ignore the student's question completely.",
          "text_hi": "छात्र के प्रश्न को पूरी तरह से नजरअंदाज करें।",
          "points": 2,
          "theory_tag": "Exclusion",
          "explanation_en": "Denies the student access to learning.",
          "explanation_hi": "छात्र को सीखने की पहुँच से वंचित करता है।",
          "reaction_modifier_en": "The student feels invisible.",
          "reaction_modifier_hi": "छात्र अदृश्य महसूस करता है।"
        }
      ]
    },
    {
      "step_number": 2,
      "description_en": "To make the lesson more inclusive for diverse language speakers, you decide to:",
      "description_hi": "विभिन्न भाषा बोलने वालों के लिए पाठ को अधिक समावेशी बनाने के लिए, आप यह निर्णय लेते हैं:",
      "choices": [
        {
          "choice_index": 0,
          "text_en": "Use only the textbook and read verbatim.",
          "text_hi": "केवल पाठ्यपुस्तक का प्रयोग करें और शब्दशः पढ़ें।",
          "points": 2,
          "theory_tag": "Teacher-Centered Rote Method",
          "explanation_en": "Boring and hard to comprehend for ESL learners.",
          "explanation_hi": "ESL शिक्षार्थियों के लिए उबाऊ और समझने में कठिन।",
          "reaction_modifier_en": "Students tune out.",
          "reaction_modifier_hi": "छात्र ध्यान हटा लेते हैं।"
        },
        {
          "choice_index": 1,
          "text_en": "Use visual aids, diagrams, and physical models to explain concepts alongside verbal explanations.",
          "text_hi": "मौखिक स्पष्टीकरण के साथ अवधारणाओं को समझाने के लिए दृश्य सहायक सामग्री, आरेख और भौतिक मॉडल का उपयोग करें।",
          "points": 10,
          "theory_tag": "Multimodal Learning (VARK)",
          "explanation_en": "Visuals transcend language barriers.",
          "explanation_hi": "दृश्य भाषा की बाधाओं को पार करते हैं।",
          "reaction_modifier_en": "Comprehension improves across the board.",
          "reaction_modifier_hi": "बोर्ड भर में समझ में सुधार होता है।"
        },
        {
          "choice_index": 2,
          "text_en": "Give them extra homework to learn the language faster.",
          "text_hi": "भाषा को तेजी से सीखने के लिए उन्हें अतिरिक्त होमवर्क दें।",
          "points": 4,
          "theory_tag": "Unreasonable Workload",
          "explanation_en": "Punishes them for their linguistic background.",
          "explanation_hi": "उन्हें उनकी भाषाई पृष्ठभूमि के लिए दंडित करता है।",
          "reaction_modifier_en": "Students are overwhelmed and stressed.",
          "reaction_modifier_hi": "छात्र अभिभूत और तनावग्रस्त हैं।"
        },
        {
          "choice_index": 3,
          "text_en": "Pair them only with students who speak their exact dialect.",
          "text_hi": "उन्हें केवल उन छात्रों के साथ जोड़ें जो उनकी सटीक बोली बोलते हैं।",
          "points": 6,
          "theory_tag": "Segregation",
          "explanation_en": "Helps short term but prevents integration with the wider class.",
          "explanation_hi": "अल्पावधि में मदद करता है लेकिन व्यापक कक्षा के साथ एकीकरण को रोकता है।",
          "reaction_modifier_en": "Cliques form based on language.",
          "reaction_modifier_hi": "भाषा के आधार पर गुट बन जाते हैं।"
        }
      ]
    },
    {
      "step_number": 3,
      "description_en": "A parent complains that using regional languages in class is ruining the standard of English/Hindi.",
      "description_hi": "एक अभिभावक शिकायत करता है कि कक्षा में क्षेत्रीय भाषाओं का उपयोग करने से अंग्रेजी/हिंदी का स्तर खराब हो रहा है।",
      "choices": [
        {
          "choice_index": 0,
          "text_en": "Agree and promise to ban regional languages.",
          "text_hi": "सहमत हों और क्षेत्रीय भाषाओं पर प्रतिबंध लगाने का वादा करें।",
          "points": 2,
          "theory_tag": "Appeasement over Pedagogy",
          "explanation_en": "Disregards modern linguistic pedagogy.",
          "explanation_hi": "आधुनिक भाषाई शिक्षाशास्त्र की उपेक्षा करता है।",
          "reaction_modifier_en": "Classroom becomes less inclusive.",
          "reaction_modifier_hi": "कक्षा कम समावेशी हो जाती है।"
        },
        {
          "choice_index": 1,
          "text_en": "Politely explain that using a child's mother tongue as a bridge (scaffolding) actually improves their acquisition of the target standard language (as per NCF).",
          "text_hi": "विनम्रतापूर्वक समझाएं कि बच्चे की मातृभाषा को एक पुल (मचान) के रूप में उपयोग करने से वास्तव में लक्ष्य मानक भाषा (NCF के अनुसार) के उनके अधिग्रहण में सुधार होता है।",
          "points": 10,
          "theory_tag": "Bilingual Transition Theory",
          "explanation_en": "Educates parents using sound pedagogical reasoning.",
          "explanation_hi": "ठोस शैक्षणिक तर्क का उपयोग करके माता-पिता को शिक्षित करता है।",
          "reaction_modifier_en": "The parent understands and supports the approach.",
          "reaction_modifier_hi": "अभिभावक इस दृष्टिकोण को समझते हैं और उसका समर्थन करते हैं।"
        },
        {
          "choice_index": 2,
          "text_en": "Tell the parent to move their child to a different school if they don't like it.",
          "text_hi": "यदि उन्हें यह पसंद नहीं है तो माता-पिता से अपने बच्चे को दूसरे स्कूल में ले जाने के लिए कहें।",
          "points": 1,
          "theory_tag": "Hostile Defensiveness",
          "explanation_en": "Highly unprofessional.",
          "explanation_hi": "अत्यधिक अव्यावसायिक।",
          "reaction_modifier_en": "The parent files a formal complaint.",
          "reaction_modifier_hi": "अभिभावक औपचारिक शिकायत दर्ज करता है।"
        },
        {
          "choice_index": 3,
          "text_en": "Ignore the parent's comment and walk away.",
          "text_hi": "माता-पिता की टिप्पणी को अनसुना करें और चले जाएं।",
          "points": 3,
          "theory_tag": "Avoidance of Communication",
          "explanation_en": "Fails to build a teacher-parent partnership.",
          "explanation_hi": "शिक्षक-माता-पिता की साझेदारी बनाने में विफल रहता है।",
          "reaction_modifier_en": "The parent remains frustrated.",
          "reaction_modifier_hi": "अभिभावक निराश रहता है।"
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
