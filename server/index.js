const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React frontend
app.use(express.static(path.join(__dirname, '../client/dist')));

// API Routes
app.get('/api/status', (req, res) => {
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
app.use('/api/revision', require('./routes/revision'));
app.use('/api/scenarios', require('./routes/scenarios'));

// Cheatsheet Routes
const cheatsheetRoutes = require('./routes/cheatsheets');
app.use('/api/cheatsheets', cheatsheetRoutes);

// Super Tricks Routes
const superTricksRoutes = require('./routes/supertricks');
app.use('/api/super-tricks', superTricksRoutes);

// Profile & Ranking Routes
const profileRoutes = require('./routes/profile');
app.use('/api/profile', profileRoutes);

// Admin Routes
app.use('/api/admin', require('./routes/admin'));

// Payment Routes
const paymentRoutes = require('./routes/payment');
app.use('/api/payment', paymentRoutes);

// Connect to MongoDB
const topicLinker = require('./services/topicLinker');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    // Run topic linker dynamically
    await topicLinker();
  })
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Catch-all route for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 5005;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
