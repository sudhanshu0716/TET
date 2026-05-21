# 💻 UPTET/CTET Prep - Frontend Client

This is the frontend React client for the UPTET/CTET Prep Application, built using **React 19**, **Vite**, **Tailwind CSS v4**, **Framer Motion**, and **Recharts**. It is designed with a premium, mobile-first glassmorphic UI optimized for seamless preparation.

---

## 🚀 Key Modules & UI Features

### 1. 📱 Responsive Navigation
- **Navbar**: Sticky header featuring the app branding, notification alerts, user profile badge, and the global bilingual language toggle (English/Hindi).
- **Bottom Navigation**: Sticky bottom bar on mobile views containing quick links:
  - **Home**: Main dashboard with challenges and study goals.
  - **Practice**: Subject tests, mocks, repeated PYQs, and flashcards.
  - **Leaderboard**: Global ranks and live contest standings.
  - **Profile**: Progress overview, personal settings, and premium plans.

### 2. ⚡ Timer-Based Exam Room (`/exam/:examType/:subject?`)
- **Bilingual Support**: Toggle the language of the exam questions on-the-fly.
- **Navigator Sidebar**: Visual index showing visited, marked for review, answered, and skipped question statuses.
- **Automatic Auto-Submit**: Triggers submission once the 150-minute exam timer reaches zero.
- **Interactive Review**: Instantly displays score breakdown, correct answers list, and explanatory guides.

### 3. 🛡️ Admin Dashboard (`/admin`)
- **Control Center**: Dynamic control board accessible only to administrative accounts:
  - **Question Bank**: Admin interface to add new MCQs, filter questions by subject/level, and delete records.
  - **User Controller**: Live table of all registered users with tools to toggle admin access, reset subscription tiers, and edit profile credentials.
  - **Contest Scheduler**: Panel to initialize live contests, monitor registrations, and end active mock sessions.
  - **Maintenance Switch**: Global configuration toggle to activate/deactivate the site maintenance mode.

### 4. 💳 Subscription Page (`/subscription`)
- **Pricing Cards**: Renders four plans:
  - **Monthly**: ₹29 (1 Month)
  - **Quarterly**: ₹59 (3 Months)
  - **Half-Yearly**: ₹99 (6 Months)
  - **Yearly**: ₹149 (12 Months)
- **Razorpay Integration**: Calls the backend order creator and invokes the client SDK modal, updating the user context on payment validation success.

---

## 📁 Source Code Directory Structure

```text
client/
├── public/                 # Static assets (favicons, logos)
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── AdminQuestions.jsx   # Question editor control
│   │   ├── AdminUsers.jsx       # User administration grid
│   │   ├── AppTutorial.jsx      # Guided tour walkthrough
│   │   ├── BottomNav.jsx        # Mobile footer navigation bar
│   │   ├── MaintenanceMode.jsx  # Fallback maintenance screen
│   │   ├── Navbar.jsx           # Global top header
│   │   ├── PaymentButton.jsx    # Razorpay button component
│   │   ├── SVGCharts.jsx        # SVG Performance Radar charts
│   │   └── ...
│   ├── context/            # React global state contexts
│   │   ├── AuthContext.jsx      # Credentials, level, and preferences
│   │   └── ThemeContext.jsx     # Visual styling configurations
│   ├── pages/              # Primary route screens
│   │   ├── AdminDashboard.jsx   # Administrative center
│   │   ├── Dashboard.jsx        # Main study dashboard
│   │   ├── ExamPage.jsx         # Live exam session page
│   │   ├── Leaderboard.jsx      # Global rankings
│   │   ├── Profile.jsx          # Settings and stats
│   │   ├── Subscription.jsx     # Subscription premium portal
│   │   └── ...
│   ├── services/           # API request services (Axios wrappers)
│   │   ├── api.js               # Common API connection client
│   │   └── paymentService.js    # Payment handling requests
│   ├── translations.js     # Bilingual dictionary (English & Hindi)
│   ├── App.jsx             # React router and app entry-wrapper
│   ├── index.css           # Custom variables and styling rules
│   └── main.jsx            # DOM mounting root
├── index.html              # Core HTML structure
├── vite.config.js          # Vite custom build settings
└── package.json            # Client dependency configuration
```

---

## ⚙️ Development Guide

### 1. Requirements
Ensure you have Node.js (v18+) installed.

### 2. Environment Setup
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5005
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 3. Startup & Dev Server
Install packages and boot the local dev server:
```bash
npm install
npm run dev
```
The client will be running on [http://localhost:5173](http://localhost:5173).

---

## 🛠️ Key Libraries Used
- **React**: Modern components architecture and state hooks.
- **Framer Motion**: Smooth entry-fade effects, modal slide transitions, and flipping flashcards.
- **Recharts**: Responsive SVG Radar charts showing subject metrics.
- **Axios**: HTTP communication layer with automatic authorization header attachment.
