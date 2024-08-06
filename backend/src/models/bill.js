const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const billSchema = new Schema({
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue'],
      default: 'pending'
    },
    dueDate: {
      type: Date,
      required: true
    },
    paymentDate: Date
  }, {
    timestamps: true
});

const Bill = mongoose.model("Bill" , billSchema)

module.exports = {Bill , billSchema}