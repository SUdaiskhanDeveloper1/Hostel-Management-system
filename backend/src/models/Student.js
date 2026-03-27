const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cnic: { type: String, required: true },
    phone: { type: String, required: true },
    room: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    guardian: { type: String },
    registrationDate: { type: Date, required: true, default: Date.now },
    duration: { type: Number, required: true, default: 1 } // in months
  },
  { timestamps: true }
);

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
