const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
// const auth = require('../middleware/auth');

// router.post('/', auth, appointmentController.createAppointment);
// router.get('/', auth, appointmentController.getAppointments);
// router.get('/:id', auth, appointmentController.getAppointment);
// router.put('/:id', auth, appointmentController.updateAppointment);
// router.delete('/:id', auth, appointmentController.cancelAppointment);

router.post('/', appointmentController.createAppointment);
router.get('/', appointmentController.getAppointments);
router.get('/:id', appointmentController.getAppointment);
router.put('/:id', appointmentController.updateAppointment);
router.delete('/:id', appointmentController.cancelAppointment);

module.exports = router;