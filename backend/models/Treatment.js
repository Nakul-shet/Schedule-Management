const mongoose = require('mongoose');

const treatmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  estimatedDuration: { type: Number, required: true }, // in minutes
  cost: Number
});

const Treatment = mongoose.model('Treatment', treatmentSchema);

module.exports = Treatment;