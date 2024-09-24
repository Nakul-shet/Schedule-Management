const express = require('express');
const router = express.Router();
const patientRecordController = require('../controllers/patientController');

router.post('/addPatient', patientRecordController.createPatientRecord);
router.get("/getAllPatient/:clinicName" , patientRecordController.getAllPatientFromClinic)
router.get('/:patientId', patientRecordController.getPatientRecord);
router.get("/getPatientByName/:name" , patientRecordController.searchPatientByName);
router.patch('/updatePatient/:patientId', patientRecordController.updatePatientRecord);
router.delete('/deletePatient/:patientId', patientRecordController.deletePatientRecord);

module.exports = router;