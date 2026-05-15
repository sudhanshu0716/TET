import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DailyExam from './pages/DailyExam';
import Cheatsheets from './pages/Cheatsheets';
import ProfileSetup from './pages/ProfileSetup';
import AdminDashboard from './pages/AdminDashboard';
import CommunityUpload from './pages/CommunityUpload';
import ResultAnalysis from './pages/ResultAnalysis';
import Flashcards from './pages/Flashcards';
import Subscription from './pages/Subscription';
import Exams from './pages/Exams';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Profile from './components/Profile';
import Leaderboard from './components/Leaderboard';
import BottomNav from './components/BottomNav';
import ProtectedRoute from './components/ProtectedRoute';
import AppTutorial from './components/AppTutorial';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
        <div className="flex flex-col min-h-screen selection:bg-sky-500/30">
          <Navbar />
          <main className="flex-1 w-full flex flex-col overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/exams" element={<Exams />} />
                <Route path="/daily-exam" element={<DailyExam type="daily" />} />
                <Route path="/practice/:subject" element={<DailyExam type="subject" />} />
                <Route path="/full-mock" element={<DailyExam type="full-mock" />} />
                <Route path="/important" element={<DailyExam type="important" />} />
                <Route path="/year-test/:year" element={<DailyExam type="year" />} />
                <Route path="/contest-live" element={<DailyExam type="contest" />} />
                <Route path="/contest-leaderboard" element={<Leaderboard />} />
                <Route path="/cheatsheets" element={<Cheatsheets />} />
                <Route path="/exam-result/:examId" element={<ResultAnalysis />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/upload" element={<CommunityUpload />} />
                <Route path="/flashcards" element={<Flashcards />} />
                <Route path="/subscription" element={<Subscription />} />
              </Route>
            </Routes>
          </main>
          <BottomNav />
          <AppTutorial />
        </div>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
