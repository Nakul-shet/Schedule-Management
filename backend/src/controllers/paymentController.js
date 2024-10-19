const {Payment} = require("../models/payment")

exports.updatePaymentForPatient = async (req, res) => {
    try {
      const { patientId, amount } = req.body;
  
      // Find the payment document by patientId
      const payment = await Payment.findOne({ patientId });
  
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }

      //Previous Payment
      const previousPayment = (String(payment.updatedAt)).substring(0 , 10)
  
      // Update the paymentMade field
      payment.paymentMade += amount;
      payment.paymentdate.push(previousPayment)
  
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