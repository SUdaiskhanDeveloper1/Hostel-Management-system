const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema(
  {
    category: { type: String, required: true },
    month: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
  },
  { timestamps: true }
);

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;
