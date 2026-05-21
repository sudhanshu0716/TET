# ⚙️ UPTET/CTET Prep — Backend Server

The Node.js / Express backend for the UPTET/CTET Prep application. Connects to MongoDB Atlas via Mongoose and integrates with Razorpay for secure premium subscription management.

---

## 🔒 Key Server Functionalities & Security

### 1. Payment Verification & Anti-Tampering Flow
To prevent client-side payment manipulation (e.g., buying a 12-month plan at the 1-month price):

- **Order Creation**: Backend initiates the Razorpay order embedding `planId` in order `notes` — the user never controls the plan tier.
- **HMAC Verification**: On payment completion, the server constructs an HMAC-SHA256 signature using `RAZORPAY_KEY_SECRET` and compares it with the returned payment signature.
- **Order Fetching**: If the signature matches, the server fetches the original order directly from Razorpay's API to read the verified `planId`.
- **Date Calculation**: Subscription end date calculated server-side:
  - `plan_1_month` (₹29) → +1 Month
  - `plan_3_months` (₹59) → +3 Months
  - `plan_6_months` (₹99) → +6 Months
  - `plan_12_months` (₹149) → +12 Months
- **DB Update**: Sets `is_premium = true` and saves `subscription_end_date`.

### 2. Exam Question Serving (Updated)
- **50-Question Default**: `/api/exams/start` now returns up to 50 questions per session (previously capped at 30).
- **No Daily Limits**: All per-day attempt restrictions removed — users can practise unlimited times.
- All exam types (`daily`, `subject`, `full-mock`, `important`, `year`, `contest`) served via the same route with `type` and `subject` query parameters.

### 3. Maintenance Mode & Admin Controls
- Admins can toggle a global maintenance mode flag in the DB.
- If active, standard protected API requests return `503 Service Unavailable`. Admin accounts bypass this restriction.

---

## 📡 REST API Endpoint Routes

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Registers a new student, hashes password, sets 3-day trial |
| POST | `/login` | Validates credentials, returns signed JWT |
| GET | `/profile` | Returns full user profile (auth required) |
| GET | `/stats` | Returns exam stats summary (auth required) |
| POST | `/change-password` | Encrypts and updates login password |

### 📝 Exams & Tests (`/api/exams`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/start` | Returns up to 50 questions for the requested exam type |
| POST | `/submit` | Processes and saves results for all exam types |
| GET | `/history` | All completed exams for the current user |
| GET | `/review/:examId` | Detailed per-question review with explanations |

### 🏆 Contests & Rooms (`/api/contests`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/active` | Fetches active or upcoming contests for today |
| POST | `/register` | Enrols user in a contest |
| GET | `/leaderboard/:contestId` | Real-time standings for a contest |

### 💳 Payments & Billing (`/api/payment`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create-order` | Creates a new Razorpay order with plan tier |
| POST | `/verify-payment` | Verifies signature & updates subscription |

### 👑 Admin Control Panel (`/api/admin`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Lists all registered users |
| POST | `/users/update` | Modify roles, subscriptions, or user fields |
| POST | `/maintenance-mode` | Toggle maintenance mode on/off |
| POST | `/questions/add` | Appends new MCQ to the database |
| DELETE | `/questions/:questionId` | Removes a question from the bank |

### 👤 Profile & Leaderboard (`/api/profile`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Returns full profile + analytics |
| PUT | `/settings` | Updates user preferences (level, language, etc.) |
| GET | `/leaderboard` | Global leaderboard ranking |

---

## 📁 Backend Directory Structure

```text
server/
├── middleware/
│   └── auth.js                 # JWT validation & admin privilege checks
├── models/
│   ├── ContestRegistration.js  # Contest registration records
│   ├── ContestSettings.js      # Contest schedule configuration
│   ├── Cheatsheet.js           # Revision note documents
│   ├── Exam.js                 # Exam history records
│   ├── GlobalSettings.js       # App-wide settings (maintenance, etc.)
│   ├── Question.js             # MCQ question bank
│   └── User.js                 # User auth, profile & subscription data
├── routes/
│   ├── admin.js                # Admin-only operations
│   ├── auth.js                 # Login, register, change password
│   ├── cheatsheets.js          # Study note retrieval
│   ├── contests.js             # Live mock exam scheduling & results
│   ├── exams.js                # Exam serving (50Q, no limits) & submission
│   ├── payment.js              # Razorpay order & secure verification
│   └── profile.js              # Analytics, radar data & leaderboard
├── seeds/                      # Question seed scripts by subject
│   ├── questions_pedagogy.js
│   ├── questions_math.js
│   └── ...
├── index.js                    # Express entry point & MongoDB connection
├── seed_admin.js               # One-time admin account creation script
└── package.json
```

---

## 🛠️ Local Installation & Launch

### 1. Prerequisites
- Node.js v18+
- MongoDB Atlas connection string (or local MongoDB)

### 2. Environment Setup
Create a `.env` in the `server/` directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_signing_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
```

### 3. Execution
```bash
npm install
npm run dev
```
Server runs at [http://localhost:5000](http://localhost:5000).

### 4. Database Seeding
```bash
# Create admin account
node seed_admin.js

# Seed question banks (repeat per subject)
node seeds/questions_pedagogy.js
node seeds/questions_math.js
```

---

## 📋 Recent Server-Side Changes

### v2.0 — May 2026
- **50-Question Default**: `exams.js` updated to return up to 50 questions per session (was 30).
- **Limits Removed**: All `dailyLimit` checks stripped from exam serving logic.
- **Unused Code Cleanup**: Dead routes and unused seed scripts removed.
