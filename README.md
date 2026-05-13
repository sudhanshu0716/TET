# TET PREP - UPTET/CTET Exam Preparation App

A mobile-first MERN stack web application to help candidates prepare for UPTET and CTET exams.

## Features
- **User Authentication**: Secure login/registration with Level & Language selection.
- **Daily Exam**: 30-question MCQ test generated daily based on user preferences.
- **Timer & Results**: Real-time timer and instant result summary.
- **Cheatsheets**: Revision notes accessible after exams.
- **Mobile-First Design**: Optimized for mobile users with premium glassmorphic UI.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide React.
- **Backend**: Node.js, Express, MongoDB, JWT.

## Setup Instructions

### 1. Prerequisites
- Node.js installed.
- MongoDB Atlas account (or local MongoDB).

### 2. Backend Setup
1. Navigate to the `server` directory.
2. Update `.env` with your `MONGODB_URI` and `JWT_SECRET`.
3. Run `npm install`.
4. Seed the database with sample questions:
   ```bash
   node seedQuestions.js
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the `client` directory.
2. Run `npm install`.
3. Start the development server:
   ```bash
   npm run dev
   ```

## Next Steps
- Implement Phase 3: Scraping automation using Cheerio & PDF-Parse.
- Implement Phase 4: Admin Panel and Community Uploads.
