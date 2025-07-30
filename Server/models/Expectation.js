const mongoose = require('mongoose');

const expectationSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  income: { type: Number, required: true },
  necessaryPercentage: { type: Number, required: true },
  spendingPercentage: { type: Number, required: true },
  savingsPercentage: { type: Number, required: true },
  investmentPercentage: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Expectation', expectationSchema);