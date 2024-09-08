const express = require('express');
const router = express.Router();
const patientRecordController = require('../controllers/patientController');
// const auth = require('../middleware/auth');

router.post('/addPatient', patientRecordController.createPatientRecord);
router.get("/getAllPatient/:clinicName" , patientRecordController.getAllPatientFromClinic)
router.get('/:patientId', patientRecordController.getPatientRecord);
router.get("/getPatientByName/:name" , patientRecordController.searchPatientByName);
router.put('/:patientId', patientRecordController.updatePatientRecord);

module.exports = router;