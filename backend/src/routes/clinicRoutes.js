const express = require('express');
const router = express.Router();
const clinicController = require('../controllers/clinicController');

// CRUD Routes
router.get('/getAllClinic', clinicController.getAllClinics);
router.get('/getClinicById/:id', clinicController.getClinicById);
router.post('/createClinic', clinicController.createClinic);
router.patch('/updateClinic/:id', clinicController.updateClinic);
router.delete('/deleteClinic/:id', clinicController.deleteClinic);

module.exports = router;
