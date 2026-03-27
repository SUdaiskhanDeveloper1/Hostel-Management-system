const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Room = require('./src/models/Room');

dotenv.config();

const seedRooms = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB.');
    const rooms = [];
    // Generating 50 rooms
    for (let i = 1; i <= 50; i++) {
        let cap = 3;
        if (i <= 10) cap = 1; // 1-10: 1-seater
        else if (i <= 20) cap = 2; // 11-20: 2-seater
        else if (i <= 30) cap = 3; // 21-30: 3-seater
        else if (i <= 40) cap = 4; // 31-40: 4-seater
        else cap = 5; // 41-50: 5-seater
        rooms.push({ number: `${100 + i}`, capacity: cap });
    }
    
    await Room.deleteMany(); // Clear existing
    await Room.insertMany(rooms);
    console.log('✅ 50 Rooms seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding rooms:', error);
    process.exit(1);
  }
};

seedRooms();
