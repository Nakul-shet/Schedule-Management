const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');
// const auth = require('../middleware/auth');

router.post('/', slotController.createSlot);
router.get('/', slotController.getAvailableSlots);
router.get('/dentist/:dentistId', slotController.getDentistSlots);
router.put('/:id', slotController.updateSlot);
router.delete('/:id', slotController.deleteSlot);

module.exports = router;