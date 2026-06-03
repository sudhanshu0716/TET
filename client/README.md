# 💻 UPTET/CTET Prep — Frontend Client

The frontend React client for the UPTET/CTET Prep Application, built using **React 19**, **Vite**, **Tailwind CSS v4**, **Framer Motion**, and **Recharts**. Designed with a premium mobile-first glassmorphic UI.

---

## 🚀 Key Modules & UI Features

### 1. 📱 Responsive Navigation
- **Navbar**: Sticky top header with app branding, user profile badge, and a bilingual language toggle (English / Hindi).
- **Bottom Navigation**: Mobile sticky footer with quick links:
  - **Home**: Dashboard with daily challenges and study goals.
  - **Practice**: Subject tests, full mocks, PYQs, and flashcards.
  - **Leaderboard**: Global rankings and live contest standings.
  - **Profile**: Progress overview, personal settings, and subscription management.

### 2. ⚡ Exam Engine (`DailyExam.jsx`)
- Handles all exam types: `daily`, `subject`, `full-mock`, `important`, `year`, `contest`.
- **Fixed Navigation**: Previous / Next buttons are always visible — no scrolling needed.
- **Last Question Fix**: Final question shows "Review & Submit" instead of jumping straight to the results page.
- **Auto-Submit**: Triggers submission when the countdown timer reaches zero.
- **50-Question Default**: Daily and practice sessions load up to 50 questions by default.
- **No Limits**: Per-day attempt restrictions removed for all exam types.
- **Smart Result Grading**: Performance labels are dynamically selected based on the score percentage — low scores no longer incorrectly show "Brilliant".
- **Bilingual**: Toggle question language between English and Hindi on-the-fly.

### 3. 🧭 Onboarding Tutorial (`AppTutorial.jsx`)
- **New-User Only**: Triggers automatically after first registration. Returning users who log in are never shown it.
- **Per-User Key**: Stored as `hasSeenTutorial_<userId>` in localStorage — switching accounts on shared devices works correctly.
- **Spotlight Overlays**: Framer Motion animations highlight key UI elements with a glowing border + ripple pulse.
- **Progress Dots**: Navigation dots let users jump to any step or skip ahead.
- **Bilingual**: Full English and Hindi support.
- **Replay**: Users can re-watch the tutorial from the Profile page.

### 4. 🛡️ Admin Dashboard (`/admin`)
- **Question Bank**: Add MCQs, filter by subject/level, delete records.
- **User Controller**: Toggle admin access, reset subscriptions, edit credentials.
- **Contest Scheduler**: Initialize live contests, monitor registrations, end active sessions.
- **Maintenance Switch**: Global toggle to activate/deactivate site maintenance mode.

### 5. 💳 Subscription Page (`/subscription`)
| Plan | Price | Duration |
|------|-------|----------|
| Monthly | ₹29 | 1 Month |
| Quarterly | ₹59 | 3 Months |
| Half-Yearly | ₹99 | 6 Months |
| Yearly | ₹149 | 12 Months |

Razorpay Checkout modal launched on click; user context updated on successful payment verification.

### 6. 🏫 Classroom Simulator RPG (`ClassroomSimulator.jsx`)
- Immersive visual novel experience to practice child psychology and pedagogical decision-making.
- **Narrative Audio Synthesis**: Web Speech TTS voice output with pitch and rate adjustments for child student and teacher voices.
- **Visual Classroom Board**: Features a letter-by-letter green chalkboard typewriter animation, dynamic cartoon dialogue bubbles, and a control desk with educational theory references, quiz reset buttons, and motivational quotes.
- **Transparent Avatars**: Boundaries BFS image preprocessing removing solid backgrounds from character sprites.

### 7. 📳 Progressive Web App (PWA)
- Full-screen standalone PWA support using `vite-plugin-pwa` and caching strategies.
- Apple standalone compliance tags and dynamically synchronized status bar theme-colors.
- Spring-animated Homescreen installer prompt component (`InstallPrompt.jsx`) with a 7-day dismiss cooldown.

### 8. 💀 Skeleton Shimmer Loaders (`SkeletonLoader.jsx`)
- A modular library of shimmer effect skeleton shapes representing layouts of various dashboard cards, graphs, lists, and pages.
- Replaces traditional standard spinner loader wheels, preventing visual jumps during API hydration.

### 9. 💬 Promise-Based Custom Dialogs (`ModalContext.jsx`)
- Replaces standard blocking browser alert/confirms with custom React modals utilizing vertical spring animations and context-aware visual borders (V1, V2, and V3 support).

---

## 📁 Source Code Directory Structure

```text
client/
├── public/                 # Static assets (favicons, logos)
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── AppTutorial.jsx      # Interactive onboarding guided tour
│   │   ├── AdminQuestions.jsx   # Question editor control
│   │   ├── AdminUsers.jsx       # User administration grid
│   │   ├── BottomNav.jsx        # Mobile footer navigation bar
│   │   ├── ErrorBoundary.jsx    # Graceful crash fallback
│   │   ├── InstallPrompt.jsx    # PWA standalone installer prompt
│   │   ├── Leaderboard.jsx      # Global rankings view
│   │   ├── Navbar.jsx           # Global top header
│   │   ├── PaymentButton.jsx    # Razorpay button wrapper
│   │   ├── PremiumModal.jsx     # Expired trial prompt modal
│   │   ├── Profile.jsx          # Settings, stats & tutorial replay
│   │   ├── ProtectedRoute.jsx   # Auth guard for private routes
│   │   ├── SkeletonLoader.jsx   # Reusable UI shimmer components
│   │   ├── SVGCharts.jsx        # SVG Performance Radar charts
│   │   └── TransparentAvatar.jsx # Avatar BFS canvas transparency solver
│   ├── context/            # React global state contexts
│   │   ├── AuthContext.jsx      # Login/register + per-user tutorial flag
│   │   ├── ThemeContext.jsx     # Visual styling (V1, V2, V3) context
│   │   └── ModalContext.jsx     # Visual custom alert/confirms context
│   ├── pages/              # Primary route screens
│   │   ├── AdminDashboard.jsx   # Administrative control centre
│   │   ├── Cheatsheets.jsx      # Revision notes library
│   │   ├── ClassroomSimulator.jsx # RPG-style branching pedagogy game
│   │   ├── CommunityUpload.jsx  # User-contributed content
│   │   ├── Dashboard.jsx        # Main study dashboard
│   │   ├── DailyExam.jsx        # Exam engine (all types)
│   │   ├── Exams.jsx            # Exam type selector
│   │   ├── Flashcards.jsx       # Active recall flashcard viewer
│   │   ├── Home.jsx             # Landing page
│   │   ├── Login.jsx            # Sign in page
│   │   ├── Progress.jsx         # Progress & analytics screen
│   │   ├── Register.jsx         # Registration page
│   │   ├── ResultAnalysis.jsx   # Detailed exam result review
│   │   └── Subscription.jsx     # Premium subscription portal
│   ├── services/           # Axios API service wrappers
│   │   ├── api.js               # Common HTTP client
│   │   └── paymentService.js    # Payment handling requests
│   ├── translations.js     # Bilingual dictionary (English & Hindi)
│   ├── App.jsx             # React router + global state wrapper
│   ├── index.css           # Tailwind CSS + custom design tokens
│   └── main.jsx            # DOM mounting root
├── index.html              # HTML entry point
├── vite.config.js          # Vite build config
└── package.json            # Client dependencies
```

---

## ⚙️ Development Guide

### 1. Requirements
Node.js v18+ must be installed.

### 2. Environment Setup
Create a `.env` file in the `client/` directory:
```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 3. Startup & Dev Server
```bash
npm install
npm run dev
```
Client runs at [http://localhost:5173](http://localhost:5173).

---

## 🛠️ Key Libraries Used

| Library | Purpose |
|---------|---------|
| React 19 | Component architecture & hooks |
| Vite 8 | Ultra-fast dev server & build tool |
| Tailwind CSS v4 | Utility-first styling system |
| Framer Motion | Animations, spotlight overlays, page transitions |
| Recharts | Responsive SVG Radar chart for subject analytics |
| Lucide React | Icon library |
| Axios | HTTP client with auto auth headers |
| React Router v7 | Client-side routing |
