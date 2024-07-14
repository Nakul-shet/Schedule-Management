const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: String,
  qualifications: [String]
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;