const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema(
  {
    name: { type: String, required: true }, // Student name
    room: { type: String, required: true },
    month: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    paymentMethod: { type: String, enum: ['Cash', 'Bank', 'Easypaisa', 'Jazzcash', 'Other'], default: 'Cash' },
    receiptImage: { type: String } // Base64 image
  },
  { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
