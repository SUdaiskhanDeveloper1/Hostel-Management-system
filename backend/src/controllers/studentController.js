const Student = require('../models/Student');
const Room = require('../models/Room');

const getStudents = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    
    // Filtering
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: 'i' } }
      : {};
      
    const count = await Student.countDocuments({ ...keyword });
    const students = await Student.find({ ...keyword })
      .sort(req.query.sort ? { [req.query.sort]: req.query.order === 'desc' ? -1 : 1 } : { createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ students, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createStudent = async (req, res) => {
  try {
    const { name, cnic, phone, room, guardian, status, registrationDate, duration } = req.body;

    // Check Room Capacity
    if (status !== 'Inactive') {
      const roomRecord = await Room.findOne({ number: room });
      if (!roomRecord) return res.status(404).json({ message: "Selected room does not exist. Please configure it in Rooms first." });
      
      const occupied = await Student.countDocuments({ room: room, status: 'Active' });
      if (occupied >= roomRecord.capacity) {
        return res.status(400).json({ message: `Room ${room} is at maximum capacity (${roomRecord.capacity}). Cannot register student here.` });
      }
    }

    const student = await Student.create({ name, cnic, phone, room, guardian, status, registrationDate, duration });
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { room, status } = req.body;
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    
    // Check Room Capacity if taking up a new active bed
    if ((room && room !== student.room) || (status === 'Active' && student.status === 'Inactive')) {
      const targetRoom = room || student.room;
      const roomRecord = await Room.findOne({ number: targetRoom });
      if (!roomRecord) return res.status(404).json({ message: "Selected room does not exist in the system." });

      const occupied = await Student.countDocuments({ room: targetRoom, status: 'Active' });
      if (occupied >= roomRecord.capacity) {
        return res.status(400).json({ message: `Room ${targetRoom} is at maximum capacity (${roomRecord.capacity}). Cannot transfer/activate student here.` });
      }
    }

    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (student) {
      await student.deleteOne();
      res.json({ message: 'Student removed' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStudents, createStudent, updateStudent, deleteStudent };
