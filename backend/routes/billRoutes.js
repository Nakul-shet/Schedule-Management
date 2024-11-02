import express from "express"
const router = express.Router();
import {createBill , getBills , getBill , updateBill , payBill} from '../controller/billController.js';
// const auth = require('../middleware/auth');

router.post('/', createBill);
router.get('/', getBills);
router.get('/:id', getBill);
router.put('/:id', updateBill);
router.put('/:id/pay', payBill);

export default router;