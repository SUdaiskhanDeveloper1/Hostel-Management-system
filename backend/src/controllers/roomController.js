const Room = require('../models/Room');
const Student = require('../models/Student');

// Get all rooms with their dynamic occupancy
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ number: 1 });
    
    // Calculate occupancy dynamically
    const roomsWithOccupancy = await Promise.all(rooms.map(async (room) => {
      // Find active students in this room
      const occupied = await Student.countDocuments({ room: room.number, status: 'Active' });
      return {
        _id: room._id,
        number: room.number,
        capacity: room.capacity,
        occupied: occupied,
        available: room.capacity - occupied
      };
    }));

    res.json({ rooms: roomsWithOccupancy });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createRoom = async (req, res) => {
  try {
    const { number, capacity } = req.body;
    const roomExists = await Room.findOne({ number });
    if (roomExists) return res.status(400).json({ message: "Room already exists" });

    const room = await Room.create({ number, capacity });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRoom = async (req, res) => {
  try {
    const { capacity } = req.body;
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const occupied = await Student.countDocuments({ room: room.number, status: 'Active' });
    if (capacity < occupied) {
      return res.status(400).json({ message: `Cannot reduce capacity: Room already has ${occupied} active students.` });
    }

    room.capacity = capacity;
    await room.save();
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const studentsInRoom = await Student.countDocuments({ room: room.number, status: 'Active' });
    if (studentsInRoom > 0) {
      return res.status(400).json({ message: "Cannot delete room: there are active students occupying it." });
    }
    
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: "Room removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRooms, createRoom, updateRoom, deleteRoom };
