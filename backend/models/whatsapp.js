import mongoose from "mongoose";
const Schema = mongoose.Schema;

const whatsappSchema = new Schema({
    patientName : {
      type : String,
      required : true
    },
    patientId : {
      type : String,
      required : true
    },
    clinicName : {
      type : String,
      required : true
    },
    sentdate: {
      type: Date,
      required: true,
      default : Date.now
    },
    appointmentAt : {
      type : Date,
      requird : true
    },
    status: {
      type: String,
      enum: ['Sent', 'Not Sent', 'cancelled'],
      default: 'Sent'
    }
});

const Whatsapp = mongoose.model("Whatsapp" , whatsappSchema);

export {Whatsapp , whatsappSchema}