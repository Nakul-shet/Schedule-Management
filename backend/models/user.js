import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['patient', 'dentist'],
      required: true
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    // Fields for dentists
    specialization: String,
    licenseNumber: String,
    // Fields for patients
    dateOfBirth: Date,
    emergencyContact: String
  }, {
    timestamps: true
});

const User = mongoose.model("User" , userSchema);

export {User , userSchema}