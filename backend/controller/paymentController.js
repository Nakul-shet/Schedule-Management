import {Payment} from "../models/payment.js";

// export const createPaymentForPatient = async (req , res) => {

//   const {amount} = req.body;
//   const {patientId} = req.params;
  
//   const newPayment = new Payment({
//       patientId : patientId,
//       treatmentAmount : Number(amount),
//       paymentMade : 
//   })
// }

export const updatePaymentForPatient = async (req, res) => {
    try {
      const { patientId, amount } = req.body;
  
      // Find the payment document by patientId
      const payment = await Payment.findOne({ patientId });
  
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }

      //Previous Payment
      const previousPayment = (String(payment.updatedAt)).substring(0 , 10)

      const newPayment = Number(amount);

      console.log(newPayment);
  
      // Update the paymentMade field
      payment.paymentMade += newPayment;

      const dateOnly3 = new Date().toLocaleDateString('en-CA');

      payment.paymentdate.push({dateOnly3 , newPayment})
  
      // Save the updated document
      await payment.save();
  
      res.status(200).json({
        message: 'Payment updated successfully',
        payment: {
          patientId: payment.patientId,
          treatmentAmount: payment.treatmentAmount,
          paymentMade: payment.paymentMade,
          paymentPending : payment.treatmentAmount - payment.paymentMade,
          paymentdate : payment.paymentdate
        }
      });
    } catch (error) {
      console.error('Error updating payment:', error);
      res.status(500).json({ message: 'Error updating payment', error: error.message });
    }
  };

  export const getPaymentDetails = async (req , res) => {

    const {patientId} = req.params;

    const payment = await Payment.findOne({ patientId });
  
    // if (!payment) {
    //   return res.status(404).json({ message: 'Payment not found' });
    // } 

    res.send(payment)
  }
