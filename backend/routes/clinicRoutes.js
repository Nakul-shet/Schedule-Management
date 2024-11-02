import express from "express"
const router = express.Router();
import {getAllClinics , getClinicById ,createClinic , updateClinic , deleteClinic} from '../controller/clinicController.js';

// CRUD Routes
router.get('/getAllClinic', getAllClinics);
router.get('/getClinicById/:id', getClinicById);
router.post('/createClinic', createClinic);
router.patch('/updateClinic/:id', updateClinic);
router.delete('/deleteClinic/:id', deleteClinic);

export default router;
