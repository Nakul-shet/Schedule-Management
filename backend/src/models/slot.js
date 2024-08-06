const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const slotSchema = new Schema({
    dentistId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  }, {
    timestamps: true
});

const Slot = mongoose.model("Slot" , slotSchema)

module.exports = {Slot , slotSchema}