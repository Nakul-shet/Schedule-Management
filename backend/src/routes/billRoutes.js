const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');
// const auth = require('../middleware/auth');

router.post('/', billController.createBill);
router.get('/', billController.getBills);
router.get('/:id', billController.getBill);
router.put('/:id', billController.updateBill);
router.put('/:id/pay', billController.payBill);

module.exports = router;