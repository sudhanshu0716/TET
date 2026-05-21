const mongoose = require('mongoose');
const Cheatsheet = require('./models/Cheatsheet');
require('dotenv').config();

const cheatsheets = [
  {
    topic_id: "cdp-theory-01",
    subject: "pedagogy",
    title_hi: "पियाजे का संज्ञानात्मक विकास",
    title_en: "Jean Piaget's Cognitive Development",
    category_hi: "संज्ञानात्मक सिद्धांत",
    category_en: "Cognitive Theory",
    level: "both",
    content_en: `### 🧠 Piaget's 4 Stages of Development
Use the mnemonic: **S**ome **P**eople **C**an **F**ly.

| Stage | Age | Key Characteristics | Trick / Shortcut |
|---|---|---|---|
| **S**ensorimotor | 0-2y | Object Permanence, Reflexes | Out of sight, out of mind ends |
| **P**re-operational | 2-7y | Egocentrism, Animism, Centration | Lacks conservation & logic |
| **C**oncrete Operational | 7-11y | Conservation, Reversibility, Logic | Math logic begins, tangible |
| **F**ormal Operational | 11y+ | Abstract logic, Hypothesis | Out-of-the-box hypothetical thinking |

### 🔄 Schema Process Flowchart
\`\`\`text
[Assimilation] ──> [State of Equilibrium]
      │                     │
      ▼                     ▼
[New Situation] ──> [Disequilibrium] ──> [Accommodation] ──> [New Schema]
\`\`\`

### 💡 Key Concepts & Subtopics
- **Schema (स्कीमा)**: Mental building blocks of knowledge.
- **Assimilation (आत्मीकरण)**: Fitting new info into existing schemas without modification.
- **Accommodation (समायोजन)**: Modifying existing schemas because of new info.
- **Equilibration (संतुलन)**: The balance between Assimilation and Accommodation.`,
    content_hi: `### 🧠 जीन पियाजे: संज्ञानात्मक विकास के 4 चरण
याद रखने का सूत्र: **S**ome **P**eople **C**an **F**ly.

| चरण | आयु | मुख्य विशेषताएं | याद रखने की शॉर्टकट ट्रिक |
|---|---|---|---|
| **S** - संवेदी-पेशीय | 0-2 वर्ष | वस्तु स्थायित्व (Object Permanence) | पाँचों इन्द्रियों द्वारा अनुभव |
| **P** - पूर्व-संक्रियात्मक | 2-7 वर्ष | अहंकेंद्रित (Egocentrism), जीववाद | तर्क का अभाव, प्रतीकात्मक सोच |
| **C** - मूर्त-संक्रियात्मक | 7-11 वर्ष | संरक्षण (Conservation), प्रतिवर्तीयता | मूर्त वस्तुओं पर तार्किक चिंतन |
| **F** - अमूर्त-संक्रियात्मक | 11 वर्ष+ | अमूर्त तर्क, परिकल्पना निर्माण | वैज्ञानिक सोच, अमूर्त चिंतन |

### 🔄 स्कीमा अधिगम चक्र (फ्लोचार्ट)
\`\`\`text
[आत्मीकरण (Assimilation)] ──> [संतुलन (Equilibrium)]
          │                            │
          ▼                            ▼
[नई परिस्थिति (New)] ──> [असंतुलन (Disequilibrium)] ──> [समायोजन (Accommodation)]
\`\`\`

### 💡 मुख्य शब्दावली (उप-विषय)
- **स्कीमा (Schema)**: सूचनाओं के संगठित पैकेट जो मस्तिष्क में स्टोर होते हैं।
- **आत्मीकरण (Assimilation)**: नई जानकारी को पुरानी जानकारी में बिना किसी बदलाव के जोड़ना।
- **समायोजन (Accommodation)**: नई जानकारी के कारण अपनी पुरानी स्कीमा में संशोधन/बदलाव करना।`
  },
  {
    topic_id: "hin-grammar-01",
    subject: "hindi",
    title_hi: "संधि पहचानने की जादुई ट्रिक्स",
    title_en: "Sandhi: Quick Rules & Tricks",
    category_hi: "व्याकरण",
    category_en: "Grammar",
    level: "both",
    content_en: `### ✍️ Sandhi: Joining of Sounds
Learn the short tricks to identify Swar Sandhi in exams instantly:

| Sandhi Type | Identification Shortcut | Example |
|---|---|---|
| **Dirgha (दीर्घ)** | Big vowel sounds in middle: **आ (aa), ई (ee), ऊ (oo)** | विद्या + अर्थी = विद्य**ार्थी** |
| **Guna (गुण)** | Single मात्रा in middle: **ए (e), ओ (o)** | सुर + ईश = सुर**ेश** |
| **Vriddhi (वृद्धि)** | Double मात्रा in middle: **ऐ (ai), औ (au)** | सदा + एव = सद**ैव** |
| **Yana (यण)** | Semi-vowel **य (y), व (v), र (r)** preceded by a half-consonant | इति + आदि = इ**त्या**दि |
| **Ayadi (अयादि)** | Middle sounds of **अय, आय, अव, आव** (usually 3 letters) | ने + अन = न**य**न |

### 🔄 Sandhi Classification Flowchart
\`\`\`text
                 ┌───────── संधि ─────────┐
                 │                        │
       ┌─────────┴─────────┐              │
    स्वर संधि          व्यंजन संधि     विसर्ग संधि
(दीर्घ, गुण, वृद्धि,    (व्यंजन + स्वर)  (विसर्ग परिवर्तन)
  यण, अयादि)
\`\`\``,
    content_hi: `### ✍️ संधि (Sandhi) पहचानने की सबसे आसान ट्रिक्स
परीक्षा में देखते ही संधि पहचानने की आसान शॉर्टकट ट्रिक:

| संधि का प्रकार | सबसे आसान पहचान ट्रिक | उदाहरण |
|---|---|---|
| **दीर्घ स्वर संधि** | शब्द के बीच में **बड़ी मात्रा** (आ, ई, ऊ) आए | हिम + आलय = हिमा**ला**य |
| **गुण स्वर संधि** | शब्द के बीच में **एक मात्रा** (ए, ओ) आए | नर + इंद्र = नरें**द्र** |
| **वृद्धि स्वर संधि** | शब्द के बीच में **दो मात्राएं** (ऐ, औ) आएं | महा + ओषधि = महौ**षधि** |
| **यण स्वर संधि** | **य, व, र** से पहले कोई **आधा अक्षर** आए | अति + आवश्यक = अत्य**ा**वश्यक |
| **अयादि स्वर संधि** | शब्द में ऐ, आय, अव, आव ध्वनि (अधिकतर 3 अक्षर शब्द) | पो + अन = प**व**न |

### 🔄 संधि वर्गीकरण फ्लोचार्ट
\`\`\`text
                 ┌───────── संधि ─────────┐
                 │                        │
       ┌─────────┴─────────┐              │
    स्वर संधि          व्यंजन संधि     विसर्ग संधि
(दीर्घ, गुण, वृद्धि,    (व्यंजन + स्वर)  (विसर्ग परिवर्तन)
  यण, अयादि)
\`\`\``
  },
  {
    topic_id: "eng-lit-01",
    subject: "english",
    title_hi: "अलंकार (Figures of Speech)",
    title_en: "Figures of Speech",
    category_hi: "व्याकरण / साहित्य",
    category_en: "Grammar / Literature",
    level: "both",
    content_en: `### 🎭 Figures of Speech Shortcuts
Identify literary devices instantly using these triggers:

| Device | Core Concept | Identification Trigger | Example |
|---|---|---|---|
| **Simile** | Comparison of two things | Look for **"like"** or **"as"** | He is **as** brave **as** a lion. |
| **Metaphor** | Direct comparison (no like/as) | Renders one thing as another | Time is a thief. |
| **Personification** | Non-human acts like human | Look for human verbs on objects | The wind **whispered** in the night. |
| **Alliteration** | Repetition of consonant sounds | Repeating same starting letter | **S**he **s**ells **s**ea **s**hells. |
| **Hyperbole** | Extreme exaggeration | Impossible claims | I have told you a **million times**. |

### 🔄 Figure of Speech Flowchart
\`\`\`text
[Comparison?]
    │
    ├── Yes (using like/as) ──> Simile
    ├── Yes (direct) ──────────> Metaphor
    └── No (action-based)
            │
            ├── Non-human acting human ──> Personification
            └── Sound-based repetition ──> Alliteration
\`\`\``,
    content_hi: `### 🎭 Figures of Speech (अलंकार) पहचानने की ट्रिक
अंग्रेजी परीक्षा में पूछे जाने वाले प्रमुख अलंकारों की आसान पहचान:

| अलंकार (Device) | मुख्य अवधारणा | पहचान का शब्द (Trigger) | उदाहरण |
|---|---|---|---|
| **Simile (उपमा)** | दो अलग वस्तुओं की तुलना | वाक्य में **"like"** या **"as"** आए | He is **as** brave **as** a lion. |
| **Metaphor (रूपक)** | सीधा रूपक (बिना like/as के) | एक वस्तु को दूसरी मान लेना | Time is a thief. |
| **Personification (मानवीकरण)** | निर्जीव को सजीव मानना | निर्जीव वस्तुओं द्वारा इंसानी काम | The wind **whispered** in the night. |
| **Alliteration (अनुप्रास)** | वर्णों की आवृत्ति | एक ही अक्षर से शुरू होने वाले शब्द | **S**he **s**ells **s**ea **s**hells. |
| **Hyperbole (अतिशयोक्ति)** | बढ़ा-चढ़ाकर कहना | बहुत ज्यादा बढ़ा-चढ़ाकर बोलना | I have told you a **million times**. |

### 🔄 पहचानने का फ्लोचार्ट
\`\`\`text
[क्या तुलना की गई है?]
         │
         ├── हाँ (like/as के साथ) ──> Simile (उपमा)
         ├── हाँ (सीधे मान लिया) ───> Metaphor (रूपक)
         └── ना (विशेषता के आधार पर)
                   │
                   ├── निर्जीव को सजीव मानना ──> Personification
                   └── एक ही ध्वनि की आवृत्ति ──> Alliteration
\`\`\``
  },
  {
    topic_id: "evs-eco-01",
    subject: "evs",
    title_hi: "पारिस्थितिकी और खाद्य श्रृंखला",
    title_en: "Ecosystems and Food Chain",
    category_hi: "पर्यावरण अध्ययन",
    category_en: "Environmental Studies",
    level: "primary",
    content_en: `### 🌾 Ecosystem Energy Flow
Remember the **10% Law of Lindeman**: Only 10% of energy is transferred to the next trophic level. 90% is lost as heat.

### 🔺 Trophic Levels Pyramid
\`\`\`text
            /  Decomposers  \\       <-- Microbes (Fungi, Bacteria)
           /─────────────────\\
          /  Tertiary Cons.   \\     <-- Apex Predators (Eagle, Lion)
         /─────────────────────\\
        /  Secondary Cons.      \\    <-- Carnivores (Snake, Frog)
       /─────────────────────────\\
      /   Primary Consumers       \\   <-- Herbivores (Rabbit, Grasshopper)
     /─────────────────────────────\\
    /       Producers (Plants)      \\  <-- Autotrophs (Chlorophyll)
   /─────────────────────────────────\\
\`\`\`

### 💡 Important EVS Memory Table
- **Biotic Factors**: Living components (Plants, Animals, Decomposers).
- **Abiotic Factors**: Non-living components (Sunlight, Water, Soil, Temperature).
- **Primary Source of Energy**: The Sun.`,
    content_hi: `### 🌾 पारिस्थितिक तंत्र और ऊर्जा का प्रवाह
**लिंडमैन का 10% नियम**: प्रत्येक स्तर पर केवल 10% ऊर्जा ही आगे स्थानांतरित होती है, 90% ऊर्जा ऊष्मा के रूप में नष्ट हो जाती है।

### 🔺 खाद्य श्रृंखला का पिरामिड (ट्रॉफिक लेवल)
\`\`\`text
            /     अपघटक      \\       <-- जीवाणु, कवक (Decomposers)
           /─────────────────\\
          /  तृतीयक उपभोक्ता   \\     <-- शीर्ष मांसाहारी (बाज, शेर)
         /─────────────────────\\
        /  द्वितीयक उपभोक्ता     \\    <-- मांसाहारी (सांप, मेंढक)
       /─────────────────────────\\
      /   प्राथमिक उपभोक्ता       \\   <-- शाकाहारी (टिड्डा, खरगोश)
     /─────────────────────────────\\
    /       उत्पादक (हरे पौधे)      \\  <-- स्वपोषी (क्लोरोफिल युक्त)
   /─────────────────────────────────\\
\`\`\`

### 💡 महत्वपूर्ण EVS फैक्ट्स
- **जैविक घटक (Biotic)**: सजीव वस्तुएं (पौधे, जंतु, कवक)।
- **अजैविक घटक (Abiotic)**: निर्जीव वस्तुएं (सूर्य का प्रकाश, जल, मिट्टी, तापमान)।
- **ऊर्जा का मुख्य स्रोत**: सूर्य।`
  },
  {
    topic_id: "mat-geom-01",
    subject: "math",
    title_hi: "वैन हीले का ज्यामितीय चिंतन स्तर",
    title_en: "Van Hiele Levels of Geometric Thought",
    category_hi: "गणित शिक्षाशास्त्र",
    category_en: "Math Pedagogy",
    level: "both",
    content_en: `### 📐 Van Hiele Geometric Thought
Learn the levels easily using this shortcut table:

| Level | Name | Age / Stage | Focus / Trick | Example |
|---|---|---|---|---|
| **Level 0** | **Visualization** | Primary classes | Appearance (Looks like) | A circle looks like a coin/roti. |
| **Level 1** | **Analysis** | Upper Primary | Properties & Features | A rectangle has opposite sides equal. |
| **Level 2** | **Informal Deduction** | Junior level | Relationships / Classes | All squares are rectangles. |
| **Level 3** | **Formal Deduction** | High school | Proving theorems | Prove Pythagoras theorem ($a^2+b^2=c^2$). |
| **Level 4** | **Rigor** | Advanced | Abstract geometry | Comparison of different axioms. |

### 🔄 Geometric Thought Progress Map
\`\`\`text
[Level 0: Visual] ──> [Level 1: Analysis] ──> [Level 2: Relation] ──> [Level 3: Proofs]
\`\`\``,
    content_hi: `### 📐 वैन हीले का ज्यामितीय चिंतन स्तर
गणित शिक्षाशास्त्र (Pedagogy) के लिए वैन हीले के स्तरों को याद रखने की तालिका:

| स्तर (Level) | नाम (Hindi) | मुख्य विशेषताएं | याद रखने की शॉर्टकट ट्रिक | उदाहरण |
|---|---|---|---|---|
| **स्तर 0 (Level 0)** | **दृश्यीकरण (Visualization)** | दिखावट के आधार पर पहचान | वस्तु कैसी दिखती है | गोल चीज़ रोटी या सिक्के जैसी है। |
| **स्तर 1 (Level 1)** | **विश्लेषण (Analysis)** | आकृतियों के गुणों की पहचान | गुणों और विशेषताओं का ज्ञान | आयत की आमने-सामने की भुजाएं बराबर होती हैं। |
| **स्तर 2 (Level 2)** | **अनौपचारिक निगमन (Informal)** | विभिन्न आकृतियों में संबंध | आकृतियों के बीच संबंध जोड़ना | सभी वर्ग आयत होते हैं। |
| **स्तर 3 (Level 3)** | **औपचारिक निगमन (Formal)** | सूत्रों को सिद्ध करना | प्रमेय सिद्ध करना | पाइथागोरस प्रमेय सिद्ध करना। |
| **स्तर 4 (Level 4)** | **दृढ़ता (Rigor)** | अमूर्त ज्यामिति | विभिन्न प्रणालियों में तुलना | अमूर्त रूप से सोचना। |

### 🔄 ज्यामितीय चिंतन विकास पथ
\`\`\`text
[स्तर 0: दिखावट] ──> [स्तर 1: गुण/विश्लेषण] ──> [स्तर 2: संबंध/वर्गीकरण] ──> [स्तर 3: प्रमेय सिद्ध]
\`\`\``
  },
  {
    topic_id: "san-grammar-01",
    subject: "sanskrit",
    title_hi: "माहेश्वर सूत्र एवं प्रत्याहार निर्माण",
    title_en: "Maheshwar Sutra & Pratyahar",
    category_hi: "संस्कृत व्याकरण",
    category_en: "Sanskrit Grammar",
    level: "both",
    content_en: `### 🕉️ Maheshwar Sutras: Core of Sanskrit Grammar
There are **14 Maheshwar Sutras** originating from Lord Shiva's Damru, which are used to construct **Pratyaharas** (short forms of letter groups).

### 🔑 Core Formulas & Shortcuts
- **अच् (Ach)**: Denotes all **Vowels (Swar)**.
- **हल् (Hal)**: Denotes all **Consonants (Vyanjan)**.
- **अल् (Al)**: Denotes all **Alphabets (Swar + Vyanjan)**.

### 🔄 Maheshwar Sutras List (First 4 contain Vowels)
1. अ इ उ ण्
2. ऋ लृ क्
3. ए ओ ङ्
4. ऐ औ च् (Ach Pratyahar ends here, grouping all vowels!)

### 💡 Quick Tip to Create Pratyahar
Take the first letter of any sutra and join it with the final silent consonant (indicated with हलन्त '्') of another sutra. For example, **अ** + **क्** = **अक्** (includes: अ, इ, उ, ऋ, लृ).`,
    content_hi: `### 🕉️ माहेश्वर सूत्र एवं प्रत्याहार निर्माण ट्रिक
संस्कृत व्याकरण का आधार **14 माहेश्वर सूत्र** हैं जो भगवान शिव के डमरू से उत्पन्न माने जाते हैं। इनसे **प्रत्याहार** (वर्णों के संक्षिप्त रूप) बनाए जाते हैं।

### 🔑 मुख्य प्रत्याहार शॉर्टकट सूत्र
- **अच् (Ach)**: इसमें सभी **स्वर** आते हैं। (स्वर = अच्)
- **हल् (Hal)**: इसमें सभी **व्यंजन** आते हैं। (व्यंजन = हल्)
- **अल् (Al)**: इसमें **सम्पूर्ण वर्णमाला** (स्वर + व्यंजन) आती है।

### 🔄 प्रथम 4 माहेश्वर सूत्र (जिनमें केवल स्वर हैं)
1. अ इ उ **ण्**
2. ऋ लृ **क्**
3. ए ओ **ङ्**
4. ऐ औ **च्** (यहाँ तक 'अच्' प्रत्याहार बनता है, जिसमें सभी स्वर आ जाते हैं!)

### 💡 प्रत्याहार बनाने की सबसे आसान ट्रिक
किसी सूत्र का पहला अक्षर लें और किसी भी अगले सूत्र के अंतिम हलन्त (अंतिम शांत वर्ण जैसे ण्, क्, च्) से मिला दें।
जैसे: **अ** + **क्** = **अक्** प्रत्याहार (इसके अंतर्गत अ, इ, उ, ऋ, लृ वर्ण आते हैं)।`
  },
  {
    topic_id: "sci-bio-01",
    subject: "science",
    title_hi: "मानव पाचन तंत्र और एंजाइम",
    title_en: "Human Digestive System",
    category_hi: "जीव विज्ञान",
    category_en: "Biology",
    level: "junior",
    content_en: `### 🧪 Human Digestion Overview
Learn the sequence of digestion and key enzymes:

\`\`\`text
[Mouth] ──> [Esophagus] ──> [Stomach] ──> [Small Intestine] ──> [Large Intestine]
  │                           │                 │
Amylase (Starch)           HCl, Pepsin       Bile, Trypsin, Lipase
\`\`\`

### 🔑 Digestive Enzymes Cheat Sheet
| Organ | Secreted Enzyme | Action / Role | Shortcut Trick |
|---|---|---|---|
| **Mouth** | Salivary Amylase | Breaks down **Starch** into sugar | **M**outh loves **S**tarch (MS) |
| **Stomach** | HCl & Pepsin | Acidic medium, Digests **Protein** | **P**epsin cuts **P**rotein |
| **Liver** | Bile Juice | Emulsifies **Fats** | Alkaline helper |
| **Pancreas** | Trypsin & Lipase | Breaks Protein & Fats | **T**rypsin targets **P**rotein, **L**ipase targets **L**ipids/Fats |`,
    content_hi: `### 🧪 मानव पाचन तंत्र और महत्वपूर्ण एंजाइम
पाचन का क्रम और एंजाइमों का स्राव फ्लोचार्ट:

\`\`\`text
[मुखगुहा] ──> [ग्रासनली] ──> [आमाशय] ──> [छोटी आंत] ──> [बड़ी आंत]
   │                            │              │
एमाइलेज (स्टार्च)            HCl, पेप्सिन     पित्त रस, ट्रिप्सिन, लाइपेज
\`\`\`

### 🔑 पाचन एंजाइम शॉर्टकट टेबल
| अंग | स्रावित एंजाइम | कार्य / भूमिका | याद रखने की आसान ट्रिक |
|---|---|---|---|
| **मुखगुहा (Mouth)** | लार एमाइलेज | **स्टार्च** को शर्करा में तोड़ना | मुख से ही पाचन शुरू |
| **आमाशय (Stomach)** | HCl और पेप्सिन | आमाशय का अम्लीय माध्यम, प्रोटीन पाचन | **प** से पेप्सिन = **प** से प्रोटीन |
| **यकृत (Liver)** | पित्त रस (Bile) | **वसा** का पायसीकरण (Emulsification) | वसा को पचाने में सहायक |
| **अग्न्याशय (Pancreas)**| ट्रिप्सिन, लाइपेज | प्रोटीन और वसा का पूर्ण पाचन | **ल** से लाइपेज = **ल** से लिपिड (वसा) |`
  },
  {
    topic_id: "soc-polity-01",
    subject: "social",
    title_hi: "भारतीय संविधान के मौलिक अधिकार",
    title_en: "Fundamental Rights of India",
    category_hi: "नागरिक शास्त्र / राजनीति",
    category_en: "Civics / Polity",
    level: "junior",
    content_en: `### 📜 Fundamental Rights (Articles 12-35)
Remember the 6 fundamental rights using this trick:
**"E**quality and **F**reedom are protected from **E**xploitation; **R**eligious and **C**ultural rights are saved by **C**onstitutional remedies."

| Right | Articles | Shortcut Focus |
|---|---|---|
| **Right to Equality** | Art 14-18 | Equal treatment before law |
| **Right to Freedom** | Art 19-22 | Speech, assembly, movement |
| **Right against Exploitation** | Art 23-24 | Stop child labor & human trafficking |
| **Right to Freedom of Religion** | Art 25-28 | Free to practice any religion |
| **Cultural & Educational Rights** | Art 29-30 | Protect minority interests |
| **Right to Constitutional Remedies** | Art 32 | Heart & Soul of Constitution (Ambedkar) |

### 🔄 Rights Flowchart
\`\`\`text
                ┌────── मौलिक अधिकार (भाग III) ──────┐
                │                                      │
      ┌─────────┴─────────┐                  ┌─────────┴─────────┐
  समानता (14-18)     स्वतंत्रता (19-22)  शोषण के विरुद्ध (23-24)  धार्मिक स्वतंत्रता (25-28)
\`\`\``,
    content_hi: `### 📜 मौलिक अधिकार (अनुच्छेद 12-35)
6 मौलिक अधिकारों को याद रखने की आसान ट्रिक:
"**स**मस्त **स्व**तंत्रता **शो**षण के खिलाफ है, **ध**र्म और **सं**स्कृति का **सं**विधान में इलाज है।"

| मौलिक अधिकार | अनुच्छेद | मुख्य विषय |
|---|---|---|
| **समानता का अधिकार** | अनु. 14-18 | कानून के समक्ष सभी समान हैं |
| **स्वतंत्रता का अधिकार** | अनु. 19-22 | भाषण, अभिव्यक्ति, देश में घूमने की स्वतंत्रता |
| **शोषण के विरुद्ध अधिकार** | अनु. 23-24 | बाल श्रम और मानव तस्करी पर रोक |
| **धार्मिक स्वतंत्रता का अधिकार** | अनु. 25-28 | किसी भी धर्म को मानने और प्रचार की स्वतंत्रता |
| **संस्कृति और शिक्षा का अधिकार** | अनु. 29-30 | अल्पसंख्यकों के हितों का संरक्षण |
| **संवैधानिक उपचारों का अधिकार** | अनु. 32 | डॉ. अंबेडकर द्वारा 'संविधान की आत्मा' कहा गया |

### 🔄 अधिकार फ्लोचार्ट
\`\`\`text
                ┌────── मौलिक अधिकार (भाग III) ──────┐
                │                                      │
      ┌─────────┴─────────┐                  ┌─────────┴─────────┐
  समानता (14-18)     स्वतंत्रता (19-22)  शोषण के विरुद्ध (23-24)  धार्मिक स्वतंत्रता (25-28)
\`\`\``
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB for Super-Seeding Cheatsheets...');
    await Cheatsheet.deleteMany({});
    await Cheatsheet.insertMany(cheatsheets);
    console.log('Super-Seeded ' + cheatsheets.length + ' High-Quality Notes successfully!');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
