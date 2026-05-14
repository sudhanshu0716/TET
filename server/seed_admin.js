const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

dotenv.config({ path: path.join(__dirname, '.env') });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminId = 'su';
    const adminPassword = 'su';

    // Check if admin already exists
    let user = await User.findOne({ email: adminId });
    
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(adminPassword, salt);

    if (user) {
      console.log('Admin user exists, updating password and role...');
      user.password_hash = password_hash;
      user.role = 'admin';
      await user.save();
    } else {
      console.log('Creating new admin user...');
      user = new User({
        user_id: 'admin_su',
        name: 'Super Admin',
        email: adminId,
        password_hash,
        role: 'admin',
        level: 'primary'
      });
      await user.save();
    }

    console.log('Admin user seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
  }
};

seedAdmin();
