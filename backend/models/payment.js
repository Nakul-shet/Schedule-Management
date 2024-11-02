import mongoose from "mongoose";
const Schema = mongoose.Schema;

const paymentSchema = new mongoose.Schema({
    patientId: {
      type: String,
      required: true,
    },
    treatmentAmount : {
        type : Number,
        required : true
    },
    paymentMade : {
        type : Number,
        required : true
    },
    paymentdate : []
  }, { timestamps: true });
  
  const Payment = mongoose.model("Payment" , paymentSchema)
  
  export {Payment , paymentSchema}