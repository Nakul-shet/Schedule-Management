const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const auth = require('../middleware/auth');

router.post('/', auth, appointmentController.createAppointment);
router.get('/', auth, appointmentController.getAppointments);
router.get('/:id', auth, appointmentController.getAppointment);
router.put('/:id', auth, appointmentController.updateAppointment);
router.delete('/:id', auth, appointmentController.cancelAppointment);

module.exports = router;