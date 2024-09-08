const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
// const auth = require('../middleware/auth');

router.post('/createAppointment', appointmentController.createAppointment);
router.get("/today" , appointmentController.getTodayAppointments)
router.get('/', appointmentController.getAllAppointments);
router.put('/updateAppointment/:appointmentId', appointmentController.updateAppointment);

// router.get('/:id', appointmentController.getAppointment);
// router.delete('/:id', appointmentController.cancelAppointment);
// router.get('/dentist/:dentistId', appointmentController.getDentistAppointments);

module.exports = router;