import express from "express"
const router = express.Router();
import {createPatientRecord , getAllPatientFromClinic , getPatientRecord , searchPatientByName , updatePatientRecord , deletePatientRecord} from '../controller/patientController.js';

router.post('/addPatient', createPatientRecord);
router.get("/getAllPatient/:clinicName" , getAllPatientFromClinic)
router.get('/:patientId', getPatientRecord);
router.get("/getPatientByName/:name" , searchPatientByName);
router.patch('/updatePatient/:patientId', updatePatientRecord);
router.delete('/deletePatient/:patientId', deletePatientRecord);

export default router;