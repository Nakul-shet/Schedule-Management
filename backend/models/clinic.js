import mongoose from "mongoose";
const Schema = mongoose.Schema;

const clinicSchema = new Schema({
  clinicName: {
    type: String,
    required: [true, 'Clinic name is required'],
    trim: true,
  },
  clinicAddress: {
    type: String,
    required: [true, 'Clinic address is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  contact: {
    type: String,
    required: [true, 'Contact is required'],
  },
}, { timestamps: true });

const Clinic = mongoose.model('Clinic', clinicSchema);

export {Clinic , clinicSchema }
