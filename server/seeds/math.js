module.exports = [
  {
    topic_id: "mat-geom-01",
    subject: "math",
    title_hi: "ज्यामिति: कोण और बहुभुज (Geometry)",
    title_en: "Geometry: Angles & Polygons",
    category_hi: "ज्यामिति",
    category_en: "Geometry",
    level: "both",
    content_en: `### 📐 Angles Quick Cheat Sheet
- **Acute Angle (न्यूनकोण)**: < 90°
- **Right Angle (समकोण)**: = 90°
- **Obtuse Angle (अधिककोण)**: Between 90° and 180°
- **Straight Angle (ऋजुकोण)**: = 180°
- **Reflex Angle (वृहतकोण)**: Between 180° and 360°
- **Complementary Angles**: Two angles summing up to **90°**
- **Supplementary Angles**: Two angles summing up to **180°**

### 🔷 Polygons & Formula Shortcuts
Let **n** be the number of sides of a regular polygon:
- **Sum of all interior angles (अंतः कोणों का योग)**: \`(n - 2) × 180°\`
- **Each interior angle**: \`[(n - 2) × 180°] / n\`
- **Sum of all exterior angles**: Always **360°**
- **Number of diagonals (विकर्णों की संख्या)**: \`[n(n - 3)] / 2\`

### 🔄 Angle Hierarchy
\`\`\`text
         [Angles Classification]
                    │
      ┌─────────────┼─────────────┐
      ▼             ▼             ▼
  [< 90°]        [= 90°]       [> 90°]
(Acute Angle) (Right Angle) (Obtuse Angle)
\`\`\``,
    content_hi: `### 📐 कोण और उनके प्रकार (Angles Cheat Sheet)
- **न्यूनकोण (Acute Angle)**: 90° से कम का कोण।
- **समकोण (Right Angle)**: ठीक 90° का कोण।
- **अधिककोण (Obtuse Angle)**: 90° से अधिक और 180° से कम का कोण।
- **ऋजुकोण (Straight Angle)**: ठीक 180° का कोण।
- **वृहतकोण (Reflex Angle)**: 180° से अधिक और 360° से कम का कोण।
- **पूरक कोण (Complementary)**: जिन दो कोणों का योग **90°** हो (उदा: 30° + 60°)।
- **संपूरक कोण (Supplementary)**: जिन दो कोणों का योग **180°** हो (उदा: 70° + 110°)।

### 🔷 बहुभुज के महत्वपूर्ण सूत्र (Polygons)
यदि बहुभुज की भुजाओं की संख्या **n** हो:
- **सभी अंतः कोणों का योग**: \`(n - 2) × 180°\`
- **प्रत्येक अंतः कोण**: \`[(n - 2) × 180°] / n\`
- **सभी बाह्य कोणों का योग**: हमेशा **360°** होता है।
- **विकर्णों की संख्या (Number of Diagonals)**: \`[n(n - 3)] / 2\` (उदा: पंचभुज में 5 विकर्ण)

### 🔄 कोण वर्गीकरण
\`\`\`text
         [कोणों का वर्गीकरण]
                  │
      ┌───────────┼───────────┐
      ▼           ▼           ▼
   [< 90°]     [= 90°]     [> 90°]
  (न्यूनकोण)   (समकोण)    (अधिककोण)
\`\`\``
  },
  {
    topic_id: "mat-num-02",
    subject: "math",
    title_hi: "संख्या पद्धति और विभाज्यता के नियम",
    title_en: "Number System & Divisibility Rules",
    category_hi: "अंकगणित",
    category_en: "Arithmetic",
    level: "both",
    content_en: `### 🔢 Divisibility Rules Cheat Sheet
Instantly test if a number is divisible without full calculation:

| Divisor | Divisibility Rule / Trick | Example |
|---|---|---|
| **2** | Last digit is even (0, 2, 4, 6, 8) | 56**4** - Yes |
| **3** | Sum of all digits is divisible by 3 | 321 (3+2+1=6) - Yes |
| **4** | Last two digits are divisible by 4 | 5**24** (24 is) - Yes |
| **5** | Last digit is 0 or 5 | 74**5** - Yes |
| **6** | Divisible by both 2 and 3 | 126 - Yes |
| **8** | Last three digits are divisible by 8 | 1**128** - Yes |
| **9** | Sum of all digits is divisible by 9 | 729 (7+2+9=18) - Yes |
| **11**| Difference of sum of odd & even places is 0 or mult of 11 | 1331 (1+3)-(3+1)=0 - Yes |

### 🔄 Number Classification
\`\`\`text
                 [Complex Numbers]
                         │
           ┌─────────────┴─────────────┐
           ▼                           ▼
    [Real Numbers]            [Imaginary Numbers]
           │
     ┌─────┴─────┐
     ▼           ▼
[Rational]   [Irrational (e.g. √2, π)]
  ├─ Integers
  └─ Fractions
\`\`\``,
    content_hi: `### 🔢 विभाज्यता के जादुई नियम (Divisibility Rules)
बड़ी संख्याओं को बिना भाग दिए विभाजित होने की जांच करें:

| भाजक | विभाज्यता का नियम | उदाहरण |
|---|---|---|
| **2** | इकाई का अंक सम संख्या (0, 2, 4, 6, 8) हो। | 89**6** (हाँ) |
| **3** | अंकों का योग 3 से विभाजित हो। | 432 (4+3+2 = 9) - हाँ |
| **4** | अंतिम दो अंक 4 से विभाजित हों। | 7**28** (28 विभाजित है) - हाँ |
| **5** | इकाई का अंक 0 या 5 हो। | 98**5** (हाँ) |
| **6** | संख्या 2 और 3 दोनों के नियमों का पालन करे। | 216 (सम है और योग 9 है) - हाँ |
| **9** | अंकों का योग 9 से विभाजित हो। | 819 (8+1+9 = 18) - हाँ |
| **11**| सम और विषम स्थानों के अंकों के योग का अंतर 0 या 11 हो। | 121 (1+1 - 2 = 0) - हाँ |

### 🔄 संख्या वर्गीकरण फ्लोचार्ट
\`\`\`text
                [वास्तविक संख्याएँ]
                        │
          ┌─────────────┴─────────────┐
          ▼                           ▼
   [परिमेय (Rational)]      [अपरिमेय (Irrational)]
 (p/q रूप, जैसे: 2/3)      (जैसे: √3, पाई (π))
          │
      [पूर्णांक (Integers)]
    (ऋणात्मक, शून्य, धनात्मक)
\`\`\``
  },
  {
    topic_id: "mat-arith-03",
    subject: "math",
    title_hi: "लघुत्तम (LCM) और महत्तम (HCF) ट्रिक्स",
    title_en: "LCM & HCF Shortcuts",
    category_hi: "अंकगणित",
    category_en: "Arithmetic",
    level: "both",
    content_en: `### 🔑 Core Formulas
1. **Product Rule**: \`First Number (I) × Second Number (II) = HCF × LCM\`
2. **HCF of Fractions**: \`HCF of Numerators / LCM of Denominators\`
3. **LCM of Fractions**: \`LCM of Numerators / HCF of Denominators\`

### 💡 High-Yield Exam Word Problems
- **Bells ringing together**: Find the **LCM** of the time intervals.
- **Greatest possible length / container size**: Find the **HCF** of the measurements.
- **Dividing and leaving a remainder 'r'**:
  - Find number: \`LCM(x, y, z) + r\` (if remainder is same).

### 🔄 Fraction Rule Flow
\`\`\`text
           [Fractions HCF / LCM]
                     │
      ┌──────────────┴──────────────┐
      ▼                             ▼
  [Find HCF]                    [Find LCM]
  Numerator: HCF                Numerator: LCM
  Denominator: LCM              Denominator: HCF
\`\`\``,
    content_hi: `### 🔑 प्रमुख सूत्र और नियम
1. **दो संख्याओं का गुणनफल**: \`प्रथम संख्या (I) × द्वितीय संख्या (II) = HCF × LCM\`
2. **भिन्नों का महत्तम (HCF)**: \`अंशों का HCF / हरों का LCM\`
3. **भिन्नों का लघुत्तम (LCM)**: \`अंशों का LCM / हरों का HCF\`

### 💡 परीक्षा विशेष ट्रिक्स (शब्द समस्याएँ)
- **घंटियाँ एक साथ बजने वाले प्रश्न**: समय अंतरालों का हमेशा **लघुत्तम (LCM)** ज्ञात करें।
- **वह बड़ी से बड़ी नाप / पैमाना ज्ञात करें**: दी गई मापों का हमेशा **महत्तम (HCF)** निकालें।

### 🔄 भिन्न सूत्र फ्लोचार्ट
\`\`\`text
         [भिन्नों का HCF / LCM]
                    │
      ┌─────────────┴─────────────┐
      ▼                           ▼
 [HCF निकालना है]             [LCM निकालना है]
  अंश: HCF लें                अंश: LCM लें
  हर: LCM लें                 हर: HCF लें
\`\`\``
  },
  {
    topic_id: "mat-arith-04",
    subject: "math",
    title_hi: "प्रतिशतता और लाभ-हानि सूत्र",
    title_en: "Percentage, Profit & Loss Formulas",
    category_hi: "अंकगणित",
    category_en: "Arithmetic",
    level: "both",
    content_en: `### 📊 Percentage Conversion
- **Fraction to %**: Multiply by 100 (\`1/5 = 20%\`)
- **% to Fraction**: Divide by 100 (\`40% = 40/100 = 2/5\`)

### 💰 Profit & Loss Formulas
Let **CP** = Cost Price (क्रय मूल्य), **SP** = Selling Price (विक्रय मूल्य):
- **Profit (लाभ)**: \`SP - CP\` (when SP > CP)
- **Loss (हानि)**: \`CP - SP\` (when CP > SP)
- **Profit %**: \`(Profit / CP) × 100\` (Always calculated on CP!)
- **Loss %**: \`(Loss / CP) × 100\`

### 🔄 Net Percentage Change Trick
If a value is increased by **a%** and then decreased by **b%**:
\`Net Change = a - b - (ab / 100)\``,
    content_hi: `### 📊 प्रतिशतता परिवर्तन
- **भिन्न को % में बदलें**: 100 से गुणा करें (\`1/4 × 100 = 25%\`)
- **% को भिन्न में बदलें**: 100 से भाग दें (\`20% = 20/100 = 1/5\`)

### 💰 लाभ और हानि के सूत्र
यहाँ **CP** = क्रय मूल्य (खरीद), **SP** = विक्रय मूल्य (बिक्री):
- **लाभ (Profit)**: \`SP - CP\` (जब विक्रय मूल्य अधिक हो)
- **हानि (Loss)**: \`CP - SP\` (जब क्रय मूल्य अधिक हो)
- **लाभ प्रतिशत (%)**: \`(लाभ / CP) × 100\` (हमेशा **क्रय मूल्य** पर ही निकाला जाता है!)
- **हानि प्रतिशत (%)**: \`(हानि / CP) × 100\`

### 🔄 क्रमिक बदलाव की जादुई ट्रिक (Net Change)
यदि पहले **a%** बढ़ाया जाए और फिर **b%** घटाया जाए:
\`कुल बदलाव = a - b - (ab / 100)%\``
  },
  {
    topic_id: "mat-arith-05",
    subject: "math",
    title_hi: "साधारण एवं चक्रवृद्धि ब्याज (SI & CI)",
    title_en: "Simple & Compound Interest Formulas",
    category_hi: "अंकगणित",
    category_en: "Arithmetic",
    level: "both",
    content_en: `### 💵 Simple Interest (SI)
Calculated only on the Principal (P).
Formula:
\`SI = (P × R × T) / 100\`
Total Amount (\`A\`) = \`P + SI\`
*(P = Principal, R = Rate of Interest %, T = Time in Years)*

### 📈 Compound Interest (CI)
Interest is calculated on Principal + Accumulated Interest.
Formula:
\`Amount (A) = P × (1 + R / 100)^n\`
\`CI = Amount (A) - Principal (P)\`
*(n = number of years)*

### 🔑 Difference between CI and SI (2 Years Shortcut)
For exactly **2 years**, the difference (\`D\`) is:
\`D = P × (R / 100)^2\``,
    content_hi: `### 💵 साधारण ब्याज (Simple Interest - SI)
यह केवल मूलधन (P) पर लगाया जाता है।
सूत्र:
\`SI = (P × R × T) / 100\`
मिश्रधन (\`A\`) = \`मूलधन (P) + साधारण ब्याज (SI)\`
*(P = मूलधन, R = ब्याज दर %, T = समय वर्ष में)*

### 📈 चक्रवृद्धि ब्याज (Compound Interest - CI)
ब्याज के ऊपर ब्याज जोड़कर गणना की जाती है।
सूत्र:
\`मिश्रधन (A) = P × (1 + R / 100)^n\`
\`चक्रवृद्धि ब्याज (CI) = मिश्रधन (A) - मूलधन (P)\`
*(n = समय वर्ष में)*

### 🔑 2 वर्ष के लिए CI और SI का अंतर (ट्रिक)
यदि समय ठीक **2 वर्ष** हो, तो ब्याज का अंतर (\`D\`) होगा:
\`D = P × (R / 100)^2\``
  },
  {
    topic_id: "mat-arith-06",
    subject: "math",
    title_hi: "अनुपात, समानुपात और साझेदारी",
    title_en: "Ratio, Proportion & Partnership",
    category_hi: "अंकगणित",
    category_en: "Arithmetic",
    level: "both",
    content_en: `### ⚖️ Ratio & Proportion Rules
- **Direct Proportion**: If x increases, y increases (\`x/y = k\`).
- **Inverse Proportion**: If x increases, y decreases (\`x × y = k\`).

### 🔑 Mean, Third, and Fourth Proportional
For numbers a, b, c:
- **Mean Proportional (मध्यानुपाती)** of a and b: \`√(a × b)\`
- **Third Proportional (तृतीयानुपाती)** of a and b: \`b^2 / a\`
- **Fourth Proportional (चतुर्थानुपाती)** of a, b, c: \`(b × c) / a\`

### 🤝 Partnership Formula
Profits are shared in the ratio of the **capital invested × duration of investment**.
\`Profit Ratio (A : B) = (Capital_A × Time_A) : (Capital_B × Time_B)\``,
    content_hi: `### ⚖️ अनुपात एवं समानुपात के नियम
- **समानुपात (Proportion)**: जब दो अनुपात आपस में बराबर हों (\`a : b = c : d\` या \`ad = bc\`)।

### 🔑 अनुपाती सूत्र (परीक्षा के लिए महत्वपूर्ण)
संख्याओं a, b, c के लिए:
- **मध्यानुपाती** (Mean Proportional) = \`√(a × b)\` (उदा: 4 और 9 का मध्यानुपाती \`√36 = 6\`)
- **तृतीयानुपाती** (Third Proportional) = \`b^2 / a\`
- **चतुर्थानुपाती** (Fourth Proportional) = \`(b × c) / a\`

### 🤝 साझेदारी (Partnership) का नियम
साझेदारों में लाभ का बँटवारा उनके **निवेशित धन × निवेश के समय** के अनुपात में होता है।
\`लाभ का अनुपात (A : B) = (धन_A × समय_A) : (धन_B × समय_B)\``
  },
  {
    topic_id: "mat-alg-07",
    subject: "math",
    title_hi: "बीजगणित के महत्वपूर्ण सूत्र (Algebra)",
    title_en: "Algebraic Identities Cheat Sheet",
    category_hi: "बीजगणित",
    category_en: "Algebra",
    level: "both",
    content_en: `### 🔑 Top 8 Algebraic Identities
Memorize these formulas for quick expansions in variables:

1. \`(a + b)^2 = a^2 + b^2 + 2ab\`
2. \`(a - b)^2 = a^2 + b^2 - 2ab\`
3. \`a^2 - b^2 = (a - b)(a + b)\`
4. \`(a + b)^3 = a^3 + b^3 + 3ab(a + b)\`
5. \`(a - b)^3 = a^3 - b^3 - 3ab(a - b)\`
6. \`a^3 + b^3 = (a + b)(a^2 - ab + b^2)\`
7. \`a^3 - b^3 = (a - b)(a^2 + ab + b^2)\`
8. If \`a + b + c = 0\`, then \`a^3 + b^3 + c^3 = 3abc\` (Very High Yield)

### 📊 Quadratic Equation Formula
For \`ax^2 + bx + c = 0\`, roots are given by:
\`x = [-b ± √(b^2 - 4ac)] / 2a\``,
    content_hi: `### 🔑 महत्वपूर्ण बीजगणितीय सूत्र
परीक्षा में बीजीय सरलीकरण (Simplification) के प्रश्नों के लिए:

1. \`(a + b)^2 = a^2 + b^2 + 2ab\`
2. \`(a - b)^2 = a^2 + b^2 - 2ab\`
3. \`a^2 - b^2 = (a - b)(a + b)\`
4. \`(a + b)^3 = a^3 + b^3 + 3ab(a + b)\`
5. \`(a - b)^3 = a^3 - b^3 - 3ab(a - b)\`
6. \`a^3 + b^3 = (a + b)(a^2 - ab + b^2)\`
7. \`a^3 - b^3 = (a - b)(a^2 + ab + b^2)\`
8. यदि \`a + b + c = 0\` हो, तो \`a^3 + b^3 + c^3 = 3abc\` होता है।

### 📊 द्विघात समीकरण के मूल (Quadratic Roots)
समीकरण \`ax^2 + bx + c = 0\` के मूल ज्ञात करने का सूत्र:
\`x = [-b ± √(b^2 - 4ac)] / 2a\`
*(जहाँ \`b^2 - 4ac\` विविक्तकर (Discriminant) है)*`
  },
  {
    topic_id: "mat-mens-08",
    subject: "math",
    title_hi: "क्षेत्रमिति सूत्र: 2D और 3D (Mensuration)",
    title_en: "Mensuration Formulas: 2D & 3D Shapes",
    category_hi: "क्षेत्रमिति",
    category_en: "Mensuration",
    level: "both",
    content_en: `### 📐 2D Shapes (Area & Perimeter)
- **Square (वर्ग)**: Area = \`a^2\`, Perimeter = \`4a\`
- **Rectangle (आयत)**: Area = \`l × w\`, Perimeter = \`2(l + w)\`
- **Circle (वृत्त)**: Area = \`πr^2\`, Circumference = \`2πr\`
- **Triangle (त्रिभुज)**: Area = \`1/2 × Base × Height\`
  - *Heron's Formula*: \`√[s(s - a)(s - b)(s - c)]\`, where \`s = (a+b+c)/2\`

### 📦 3D Shapes (Volume & Surface Area)
- **Cube (घन)**: Volume = \`a^3\`, Total Surface Area = \`6a^2\`
- **Cuboid (घनाभ)**: Volume = \`l × w × h\`, TSA = \`2(lw + wh + hl)\`
- **Cylinder (बेलन)**: Volume = \`πr^2h\`, Curved Surface Area = \`2πrh\`
- **Cone (शंकु)**: Volume = \`1/3 πr^2h\`, Slant Height (\`l\`) = \`√(r^2 + h^2)\`
- **Sphere (गोला)**: Volume = \`4/3 πr^3\`, Surface Area = \`4πr^2\``,
    content_hi: `### 📐 2D आकृतियाँ (क्षेत्रफल एवं परिमाप)
- **वर्ग (Square)**: क्षेत्रफल = \`a^2\`, परिमाप = \`4a\` (विकर्ण = \`a√2\`)
- **आयत (Rectangle)**: क्षेत्रफल = \`लम्बाई × चौड़ाई\`, परिमाप = \`2(लम्बाई + चौड़ाई)\`
- **वृत्त (Circle)**: क्षेत्रफल = \`πr^2\`, परिधि = \`2πr\`
- **त्रिभुज (Triangle)**: क्षेत्रफल = \`1/2 × आधार × ऊँचाई\`
  - *हीरोन का सूत्र*: \`√[s(s - a)(s - b)(s - c)]\`, जहाँ \`s = (a + b + c)/2\`

### 📦 3D आकृतियाँ (आयतन एवं पृष्ठ क्षेत्रफल)
- **घन (Cube)**: आयतन = \`a^3\`, कुल पृष्ठीय क्षेत्रफल = \`6a^2\` (विकर्ण = \`a√3\`)
- **घनाभ (Cuboid)**: आयतन = \`l × w × h\`, पृष्ठीय क्षेत्रफल = \`2(lw + wh + hl)\`
- **बेलन (Cylinder)**: आयतन = \`πr^2h\`, वक्र पृष्ठ = \`2πrh\`
- **शंकु (Cone)**: आयतन = \`1/3 πr^2h\`, तिर्यक ऊँचाई (\`l\`) = \`√(r^2 + h^2)\`
- **गोला (Sphere)**: आयतन = \`4/3 πr^3\`, पृष्ठीय क्षेत्रफल = \`4πr^2\``
  },
  {
    topic_id: "mat-arith-09",
    subject: "math",
    title_hi: "समय, दूरी, चाल और कार्य के नियम",
    title_en: "Time, Distance, Speed & Work",
    category_hi: "अंकगणित",
    category_en: "Arithmetic",
    level: "both",
    content_en: `### 🚗 Speed, Time & Distance Formulas
- Core Formula: \`Speed = Distance / Time\`
- **Unit Conversion**:
  - \`km/h\` to \`m/s\`: Multiply by \`5/18\` (e.g. \`36 km/h = 36 × 5/18 = 10 m/s\`)
  - \`m/s\` to \`km/h\`: Multiply by \`18/5\`
- **Average Speed**: \`[2 × S1 × S2] / (S1 + S2)\` (when distance travelled is equal).

### 👥 Time & Work Rules
- If A does a work in **x** days, A's 1-day work = \`1/x\`.
- If A and B work together, time taken = \`(x × y) / (x + y)\` days.
- **Worker-Day-Hour Formula**:
  \`(M1 × D1 × H1) / W1 = (M2 × D2 × H2) / W2\`
  *(M = Men, D = Days, H = Hours, W = Work)*`,
    content_hi: `### 🚗 समय, चाल और दूरी (Speed & Distance)
- मूल सूत्र: \`चाल = दूरी / समय\`
- **इकाई परिवर्तन (Unit Conversion)**:
  - \`किमी/घंटा\` से \`मीटर/सेकंड\`: \`5/18\` से गुणा करें (उदा: 54 किमी/घंटा = 54 × 5/18 = 15 मी/से)।
  - \`मीटर/सेकंड\` से \`किमी/घंटा\`: \`18/5\` से गुणा करें।
- **औसत चाल (Average Speed)**: \`[2 × S1 × S2] / (S1 + S2)\` (जब समान दूरी तय की गई हो)।

### 👥 समय और कार्य (Time & Work)
- यदि A किसी काम को **x** दिन में करता है, तो 1 दिन का काम = \`1/x\` भाग।
- यदि A और B मिलकर काम करें, तो कुल समय = \`(x × y) / (x + y)\` दिन।
- **मजदूर-दिन-काम सूत्र (M-D-H Rule)**:
  \`(M1 × D1 × H1) / W1 = (M2 × D2 × H2) / W2\`
  *(M = मजदूर, D = दिन, H = रोजाना घंटे, W = कार्य भाग)*`
  },
  {
    topic_id: "mat-pedagogy-10",
    subject: "math",
    title_hi: "गणित शिक्षाशास्त्र: गणित की प्रकृति",
    title_en: "Mathematics Pedagogy: Nature of Math",
    category_hi: "शिक्षा शास्त्र",
    category_en: "Pedagogy",
    level: "both",
    content_en: `### 🧠 Nature of Mathematics
- **Logical (तार्किक)**: Mathematics is based on logic and reasoning.
- **Hierarchical (पदानुक्रमित)**: Concepts build on top of previous concepts (e.g. Addition ──> Multiplication).
- **Abstract (अमूर्त)**: Deals with symbols, formulas, and imaginary concepts before concrete.

### 📐 George Polya's Steps of Problem Solving
1. **Understand the problem** (समस्या को समझना)
2. **Devise a plan** (योजना बनाना)
3. **Carry out the plan** (योजना लागू करना)
4. **Look back / Review** (पुनः जाँच करना)

### 🔄 Polya's Flowchart
\`\`\`text
   [Understand the Problem]
              │
              ▼
       [Devise a Plan]
              │
              ▼
     [Carry out the Plan]
              │
              ▼
      [Review / Look back]
\`\`\``,
    content_hi: `### 🧠 गणित की प्रकृति (Nature of Mathematics)
- **तार्किक (Logical)**: गणित तार्किक चिंतन पर आधारित है, रटने पर नहीं।
- **पदानुक्रमित (Hierarchical)**: गणितीय अवधारणाएँ एक-दूसरे से जुड़ी होती हैं (जैसे- जोड़ ──> गुणा ──> भाग)।
- **अमूर्त (Abstract)**: गणित मूर्त वस्तुओं से शुरू होकर अमूर्त सूत्रों की ओर बढ़ता है।

### 📐 जॉर्ज पोल्या: समस्या समाधान के 4 चरण
1. **समस्या को समझना**: प्रश्न में क्या पूछा गया है यह स्पष्ट करना।
2. **योजना बनाना**: सूत्र या विधि तय करना।
3. **योजना को क्रियान्वित करना**: गणना करना।
4. **पुनः जाँच करना (मूल्यांकन)**: उत्तर की सत्यता परखना।

### 🔄 समस्या समाधान प्रवाह (Polya's Flowchart)
\`\`\`text
    [समस्या को समझना (Understand)]
                  │
                  ▼
       [योजना बनाना (Plan)]
                  │
                  ▼
     [योजना लागू करना (Execute)]
                  │
                  ▼
      [पुनः जाँच करना (Review)]
\`\`\``
  }
];
