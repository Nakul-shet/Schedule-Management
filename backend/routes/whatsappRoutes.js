import express from "express";
const router = express.Router();
import {getAllAppointmentNotifications , getAppointmentNotifications} from '../controller/whatsappController.js';

router.get('/getAllNotifications', getAllAppointmentNotifications);
router.get('/getNotifications/:clinic', getAppointmentNotifications);

export default router;