const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const existingAdmin = await User.findOne({ email: 'admin@hms.com' });
    
    if (!existingAdmin) {
      const admin = new User({
        name: 'Admin',
        email: 'admin@hms.com',
        password: 'password123',
        role: 'admin',
      });
      await admin.save();
      console.log('✅ Default Admin user created: admin@hms.com / password123');
    } else {
      console.log('✅ Admin user already exists. You can log in with: admin@hms.com / password123');
    }
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
