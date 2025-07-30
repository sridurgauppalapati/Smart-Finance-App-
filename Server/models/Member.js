const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  profession: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);