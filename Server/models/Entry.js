const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  date: { type: Date, required: true },
  homeEmi: { type: Number, default: 0 },
  carEmi: { type: Number, default: 0 },
  personalLoanEmi: { type: Number, default: 0 },
  creditcardEmi: { type: Number, default: 0 },
  homeMaintenance: { type: Number, default: 0 },
  waterCharges: { type: Number, default: 0 },
  netPhoneCharges: { type: Number, default: 0 },
  transport: { type: Number, default: 0 },
  foodOrders: { type: Number, default: 0 },
  groceries: { type: Number, default: 0 },
  clothing: { type: Number, default: 0 },
  travelling: { type: Number, default: 0 },
  carMaintenance: { type: Number, default: 0 },
  petrol: { type: Number, default: 0 },
  bikeMaintenance: { type: Number, default: 0 },
  maid: { type: Number, default: 0 },
  urbanCompany: { type: Number, default: 0 },
  drinkingWater: { type: Number, default: 0 },
  donations: { type: Number, default: 0 },
  school: { type: Number, default: 0 },
  gym: { type: Number, default: 0 },
  badminton: { type: Number, default: 0 },
  eatery: { type: Number, default: 0 },
  onlineShopping: { type: Number, default: 0 },
  repairsReplacements: { type: Number, default: 0 },
  income: { type: Number, default: 0 },
  investment: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Entry', entrySchema);