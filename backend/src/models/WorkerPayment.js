const mongoose = require('mongoose');

const workerPaymentSchema = mongoose.Schema(
  {
    workerName: { type: String, required: true },
    month: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
  },
  { timestamps: true }
);

const WorkerPayment = mongoose.model('WorkerPayment', workerPaymentSchema);
module.exports = WorkerPayment;
