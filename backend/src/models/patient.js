const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientRecordSchema = new Schema({
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    medicalHistory: String,
    allergies: [String],
    treatments: [{
      date: {
        type: Date,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      dentistNotes: String
    }]
  }, {
    timestamps: true
});

const Patient = mongoose.model("Patient" , patientRecordSchema);

module.exports = {Patient , patientRecordSchema}