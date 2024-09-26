const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    patientId: {
      type: String,
      required: true
    },
    patientName : {
      type : String,
      required : true
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled'
    },
    treatmentType : {
      type : String,
      required : true
    }
  }, {
    timestamps: true
});

const Appointment = mongoose.model("Appointment" , appointmentSchema);

module.exports = {Appointment , appointmentSchema}