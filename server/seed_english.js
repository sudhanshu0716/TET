const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('./models/Question');

// Load environment variables
dotenv.config({ path: './server/.env' });

// List of all new English seed files
const seedFiles = [
    './seeds/questions_pedagogy_en_p1', './seeds/questions_pedagogy_en_p2', './seeds/questions_pedagogy_en_p3', './seeds/questions_pedagogy_en_p4', './seeds/questions_pedagogy_en_p5', './seeds/questions_pedagogy_en_p6',
    './seeds/questions_math_en_p1', './seeds/questions_math_en_p2', './seeds/questions_math_en_p3', './seeds/questions_math_en_p4', './seeds/questions_math_en_p5', './seeds/questions_math_en_p6',
    './seeds/questions_evs_en_p1', './seeds/questions_evs_en_p2', './seeds/questions_evs_en_p3', './seeds/questions_evs_en_p4', './seeds/questions_evs_en_p5', './seeds/questions_evs_en_p6',
    './seeds/questions_science_en_p1', './seeds/questions_science_en_p2', './seeds/questions_science_en_p3', './seeds/questions_science_en_p4', './seeds/questions_science_en_p5', './seeds/questions_science_en_p6',
    './seeds/questions_social_en_p1', './seeds/questions_social_en_p2', './seeds/questions_social_en_p3', './seeds/questions_social_en_p4', './seeds/questions_social_en_p5', './seeds/questions_social_en_p6'
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tet_prep');
        console.log('Connected to MongoDB for seeding...');

        let totalAdded = 0;

        for (const filePath of seedFiles) {
            try {
                const questions = require(filePath);
                await Question.insertMany(questions);
                totalAdded += questions.length;
                console.log(`Successfully seeded ${questions.length} questions from ${filePath}`);
            } catch (err) {
                console.error(`Error seeding ${filePath}:`, err.message);
            }
        }

        console.log(`\nDONE! Total English questions added: ${totalAdded}`);
        process.exit();
    } catch (error) {
        console.error('Connection Error:', error);
        process.exit(1);
    }
};

seedDB();
