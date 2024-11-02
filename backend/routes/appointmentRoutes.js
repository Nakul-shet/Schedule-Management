import express from "express";
const router = express.Router();
import {createAppointment , getTodayAppointments , getAllAppointments ,updateAppointment ,  cancelAppointment} from '../controller/appointmentController.js';
// const auth = require('../middleware/auth');

router.post('/createAppointment', createAppointment);
router.get("/today" , getTodayAppointments)
router.get('/', getAllAppointments);
router.put('/updateAppointment/:patientId', updateAppointment);
router.delete("/deleteAppointment/:patientId" , cancelAppointment);

// router.get('/:id', appointmentController.getAppointment);
// router.delete('/:id', appointmentController.cancelAppointment);
// router.get('/dentist/:dentistId', appointmentController.getDentistAppointments);

export default router;