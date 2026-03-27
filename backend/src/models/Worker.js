const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    salary: { type: Number, required: true },
    startingDate: { type: Date },
    endDate: { type: Date }
  },
  { timestamps: true }
);

const Worker = mongoose.model('Worker', workerSchema);
module.exports = Worker;
