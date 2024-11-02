import express from "express";
import {
  addNewAdmin,
  addNewDoctor,
  getAllDoctors,
  getDoctor,
  getUserDetails,
  login,
  logoutAdmin,
  logoutPatient,
  patientRegister,
  updateDoctor,
  deleteDoctor,
} from "../controller/userController.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", login);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);
router.post("/admin/addnew", addNewAdmin);
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);

router.post("/doctor/addnew", addNewDoctor);
router.get("/doctors", getAllDoctors);
router.get("/doctors/:id", getDoctor);
router.patch("/doctors/:id", updateDoctor);
router.delete("/doctors/:id", deleteDoctor);

router.post("/patient/register", patientRegister);
router.get("/patient/me", isPatientAuthenticated, getUserDetails);
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);

export default router;
