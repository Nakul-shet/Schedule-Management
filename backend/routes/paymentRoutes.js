import express from 'express';
const router = express.Router();
import {updatePaymentForPatient , getPaymentDetails} from '../controller/paymentController.js';

router.get("/getPaymentDetails/:patientId" , getPaymentDetails)
router.patch('/updatePayment', updatePaymentForPatient);

export default router;