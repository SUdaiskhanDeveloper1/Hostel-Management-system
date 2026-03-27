const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    unique: true,
  },
  capacity: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4, 5, 6], // Supported seaters
  }
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
