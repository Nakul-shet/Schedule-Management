const mongoose = require('mongoose');

const treatmentRecordSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  treatment: { type: mongoose.Schema.Types.ObjectId, ref: 'Treatment', required: true },
  notes: String,
  outcome: String
});

const TreatmentRecord = mongoose.model('TreatmentRecord', treatmentRecordSchema);

module.exports = TreatmentRecord;