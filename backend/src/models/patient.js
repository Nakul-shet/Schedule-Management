const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    unique: true
  },
  patientName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  country: String,
  city: String,
  contact: String,
  mobile: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  dob: Date,
  notes: String,
  clinicName: String,
  alertPreference: {
    type: String,
    enum: ['Email', 'SMS', 'Both', 'None'],
    default: 'None'
  }
}, { timestamps: true });

const Patient = mongoose.model("Patient" , patientSchema)

module.exports = {Patient , patientSchema}