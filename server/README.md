# ⚙️ UPTET/CTET Prep - Backend Server

This is the Node.js / Express backend server that powers the UPTET/CTET Prep application. It connects to MongoDB Atlas using Mongoose and integrates with Razorpay for secure premium subscription management.

---

## 🔒 Key Server Functionalities & Security

### 1. Payment Verification & Anti-Tampering Flow
To prevent client-side payment manipulation (such as a user editing the client code to purchase a 12-month tier at the price of a 1-month tier), the server enforces the following strict flow:
- **Order Creation**: The user requests an order creation passing `amount` and `planId`. The backend initiates the order via the Razorpay SDK, embedding the `planId` inside the order `notes` metadata.
- **HMAC Verification**: Once payment is completed, the frontend returns the transaction identifiers. The server constructs an HMAC-SHA256 signature using the server-side `RAZORPAY_KEY_SECRET` and compares it with the payment signature.
- **Order Fetching**: If the signature matches, the server fetches the original order details directly from Razorpay's API (`razorpay.orders.fetch(orderId)`).
- **Date Calculation**: The server retrieves the verified `planId` from the fetched order `notes` (falling back to payment `amount` if missing) and calculates the correct subscription expiry date:
  - `plan_1_month` (₹29) -> +1 Month
  - `plan_3_months` (₹59) -> +3 Months
  - `plan_6_months` (₹99) -> +6 Months
  - `plan_12_months` (₹149) -> +12 Months
- **DB Updates**: Sets `is_premium = true` and saves `subscription_end_date` to the user's database document.

### 2. Maintenance Mode & Admin Controls
- Admins can toggle a global maintenance mode setting in the DB.
- If maintenance mode is active, standard requests to protected APIs return a `503 Service Unavailable` status, showing the maintenance interface. Administrative users bypass this limitation to allow debugging on live sites.

---

## 📡 REST API Endpoint Routes

### 🔐 Authentication (`/api/auth`)
- `POST /register`: Registers a new student, hashes passwords using `bcryptjs`, and sets a 3-day trial period.
- `POST /login`: Validates user credentials and signs a payload-carrying JWT.
- `GET /user`: Returns user information, configuration levels, and subscription statuses.
- `POST /update-profile`: Updates user options (exam level, languages, stream preferences).
- `POST /change-password`: Encrypts and updates the user's login password.

### 📝 Exams & Tests (`/api/exams`)
- `GET /daily-challenge`: Personalized daily challenge sheet matching the user's level.
- `POST /submit`: Processes and saves results for full mocks, daily challenges, PYQs, and subject exams.
- `GET /history`: Retrieves history logs of all exams completed by the user.
- `GET /review/:examId`: Provides detailed score reviews, option selections, and solutions.

### 🏆 Contests & Rooms (`/api/contests`)
- `GET /active`: Fetches upcoming or running live contests scheduled for the day.
- `POST /register`: Enrolls user in a specific live contest.
- `GET /leaderboard/:contestId`: Lists global real-time standings for a contest.

### 💳 Payments & Billing (`/api/payment`)
- `POST /create-order`: Prepares a new subscription payment order with a plan tier.
- `POST /verify-payment`: Confirms verification signature and calculates subscription periods.

### 👑 Admin Control Panel (`/api/admin`)
- `GET /users`: Lists all users registered in the database.
- `POST /users/update`: Allows admins to modify roles, subscription statuses, or user fields.
- `POST /maintenance-mode`: Switches maintenance mode on or off.
- `POST /questions/add`: Appends a new question to the MCQ database bank.
- `DELETE /questions/:questionId`: Deletes a question from the MCQ database.

---

## 📁 Backend Directory Structure

```text
server/
├── middleware/             # Request interceptors
│   └── auth.js                 # JWT check and Admin privilege verification
├── models/                 # Mongoose Database models
│   ├── Exam.js                 # Schema for exams/history
│   ├── Maintenance.js          # Schema for global app switches
│   ├── Question.js             # Schema for exam questions
│   ├── User.js                 # Schema for user data & subscriptions
│   └── ...
├── routes/                 # Express REST endpoint modules
│   ├── admin.js                # Administration actions
│   ├── auth.js                 # Login, signup, and settings
│   ├── cheatsheets.js          # Retrieval of study guides
│   ├── contests.js             # Live mock exams and timings
│   ├── exams.js                # Practice mocks and challenge submissions
│   ├── payment.js              # Payment order creation and dynamic verification
│   └── profile.js              # Analytics, radar charts, and leaderboards
├── seeds/                  # Question seeds organized by subject
│   ├── questions_math.js       # Math PYQ list
│   ├── questions_pedagogy.js   # Pedagogy questions list
│   └── ...
├── index.js                # Express entry-point & MongoDB connection
├── seed_admin.js           # Independent script to create first Admin user
├── start_project.bat       # Helper batch file to boot frontend/backend concurrently
└── package.json            # Server dependencies configuration
```

---

## 🛠️ Local Installation & Launch

### 1. Prerequisites
- Node.js (v18+)
- Local MongoDB installation or a MongoDB Atlas cloud URL connection string.

### 2. Environment Setup
Create a `.env` file in the `server` directory:
```env
PORT=5005
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_signing_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
```

### 3. Execution
Install dependencies and run the server locally:
```bash
npm install
npm run dev
```
The server will bind to [http://localhost:5005](http://localhost:5005).

### 4. Database Seeding
Seed admin accounts and questions:
```bash
# Seed initial administrator credentials
node seed_admin.js

# Seed question banks
node seeds/questions_pedagogy.js
```
