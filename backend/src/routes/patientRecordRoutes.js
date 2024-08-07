const express = require('express');
const router = express.Router();
const patientRecordController = require('../controllers/patientRecordController');
// const auth = require('../middleware/auth');

router.post('/', patientRecordController.createPatientRecord);
router.get('/:patientId', patientRecordController.getPatientRecord);
router.put('/:patientId', patientRecordController.updatePatientRecord);
router.post('/:patientId/treatments', patientRecordController.addTreatment);

module.exports = router;