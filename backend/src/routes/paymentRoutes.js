const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.patch('/updatePayment', paymentController.updatePaymentForPatient);

module.exports = router;