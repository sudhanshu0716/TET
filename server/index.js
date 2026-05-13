const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('UPTET/CTET Prep API is running...');
});

// Auth Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Question Routes
const questionRoutes = require('./routes/questions');
app.use('/api/questions', questionRoutes);

// Exam Routes
const examRoutes = require('./routes/exams');
app.use('/api/exams', require('./routes/exams'));
app.use('/api/contests', require('./routes/contests'));
app.use('/api/cheatsheets', require('./routes/cheatsheets'));

// Cheatsheet Routes
const cheatsheetRoutes = require('./routes/cheatsheets');
app.use('/api/cheatsheets', cheatsheetRoutes);

// Profile & Ranking Routes
const profileRoutes = require('./routes/profile');
app.use('/api/profile', profileRoutes);

// Connect to MongoDB
const { initAutomation } = require('./services/automationService');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start background automation (checks for empty DB on boot + schedules daily runs)
    initAutomation();
  })
  .catch(err => console.error('Could not connect to MongoDB:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
