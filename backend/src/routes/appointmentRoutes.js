const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
// const auth = require('../middleware/auth');

router.post('/', appointmentController.createAppointment);
router.get('/', appointmentController.getAppointments);
router.get('/:id', appointmentController.getAppointment);
router.put('/:id', appointmentController.updateAppointment);
router.delete('/:id', appointmentController.cancelAppointment);
router.get('/dentist/:dentistId', appointmentController.getDentistAppointments);

module.exports = router;