# 🏆 TET PREP - Premium UPTET/CTET Preparation App

A state-of-the-art, mobile-first full-stack application designed to empower candidates preparing for **UPTET** and **CTET** exams. Built with a premium glassmorphic UI and robust MERN stack architecture.

---

## ✨ Key Features

### 🎓 For Students
- **Daily Challenge**: 30 personalized questions tailored to your level (Primary/Junior) and language choice.
- **Exam Score Predictor**: AI-based score estimation out of 150 based on your historical performance.
- **Live Contests**: Compete in daily 8:30 PM battles with a global leaderboard.
- **Subject-Wise Practice**: Deep dive into Pedagogy, Hindi, English, Math, EVS, Science, and Social Studies.
- **Smart Analytics**: Track your streak, accuracy, and detailed topic-wise insights.
- **Digital Library**: Access curated cheatsheets, flashcards, and quick revision notes.
- **Bilingual Interface**: Seamlessly switch between Hindi and English at any time.

### 🛠️ For Administrators
- **Admin Dashboard**: Manage questions, contests, and cheatsheets through a protected interface.
- **Contest Management**: Real-time control over upcoming and live contests.
- **Data Insights**: Monitor user growth and overall platform performance.

---

## 🎨 Design Philosophy
- **Glassmorphism**: A sleek, modern aesthetic using backdrop blurs and subtle gradients.
- **Dark Mode First**: Optimized for long study sessions with reduced eye strain.
- **Micro-Animations**: Smooth transitions powered by Framer Motion and Tailwind CSS.
- **Mobile Optimized**: Designed to feel like a native app with a bottom navigation bar and safe-area support.

---

## 🚀 Tech Stack

- **Frontend**: 
  - React (Vite)
  - Tailwind CSS (Version 4 ready)
  - Lucide React (Icons)
  - Framer Motion (Animations)
- **Backend**: 
  - Node.js & Express
  - MongoDB (Mongoose)
  - JWT Authentication
- **Deployment**: 
  - Vercel (Frontend & Serverless Functions)

---

## 🛠️ Installation & Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account

### 2. Backend Setup
1. Enter the `server` folder:
   ```bash
   cd server
   npm install
   ```
2. Create a `.env` file:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```
3. Seed the database (Questions & Admin):
   ```bash
   node seeds/questions_pedagogy.js
   node seed_admin.js
   ```
4. Start development:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Enter the `client` folder:
   ```bash
   cd client
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```

---

## 📡 Deployment (Vercel)
The project is configured for seamless deployment on Vercel:
1. Connect your GitHub repository to Vercel.
2. The `vercel.json` handles routing and Cache-Control automatically.
3. Ensure Environment Variables are set in the Vercel Dashboard.

---

## 🛡️ Security
- **JWT Protection**: Secure API endpoints for profile and exam data.
- **Bcrypt Hashing**: Encrypted user passwords.
- **Defensive Data Handling**: Optional chaining and fallbacks to prevent client-side crashes.
- **Cache-Busting**: Automated Service Worker unregistration to prevent stale version issues.

---

*Made with ❤️ for future teachers.*
