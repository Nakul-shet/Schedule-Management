import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import AddNewDoctor from "./components/AddNewDoctor";
import Messages from "./components/Messages";
import Doctors from "./components/Doctors";
import Patients from "./components/Patients";
import Appointment from "./components/Appointment";
import AddNewAppointment from "./components/AddNewAppointment";
import { GlobalProvider } from "./components/GlobalVarOfLocation";
import { Context } from "./main";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar";
import AddNewAdmin from "./components/AddNewAdmin";
import AddOrEditDoctor from "./components/AddNewDoctor";
import AddNewPatient from "./components/AddPatient";
import EditPatient from "./components/EditPatient";
import PaymentUpdate from "./components/PaymentUpdate";
import AddNewClinic from "./components/AddClinic";
import Clinics from "./components/Clinics";
import UpdateClinics from "./components/UpdateClinic";
import Settings from "./components/Settings";
import "./App.css";

const App = () => {
  const { isAuthenticated, setIsAuthenticated, admin, setAdmin } =
    useContext(Context);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${CONFIG.runEndpoint.backendUrl}/api/v1/user/admin/me`,
  //         {
  //           withCredentials: true,
  //         }
  //       );
  //       setIsAuthenticated(true);
  //       setAdmin(response.data.user);
  //     } catch (error) {
  //       setIsAuthenticated(false);
  //       setAdmin({});
  //     }
  //   };
  //   fetchUser();
  // }, [isAuthenticated]);

  useEffect(() => {
      const checkAuthentication = async () => {
          try {
              const response = await axios.get(`${CONFIG.runEndpoint.backendUrl}/api/v1/user/admin/me`, {
                  withCredentials: true, // Send cookies for validation
              });
              setIsAuthenticated(true); // Set authenticated state
              setUser(response.data.user); // Load user details
          } catch (error) {
              setIsAuthenticated(false); // User is not authenticated
          }
      };
  
      checkAuthentication();
  }, []);

  return (
    <GlobalProvider>
      <Router>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/doctor/addnew" element={<AddNewDoctor />} />
          <Route path="/admin/addnew" element={<AddNewAdmin />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctor/edit/:id" element={<AddOrEditDoctor />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/appointment/addnew" element={<AddNewAppointment />} />
          <Route path="/patient/addnew" element={<AddNewPatient />} />
          <Route path="/patient/edit/:id" element={<EditPatient />} />
          <Route
            path="/patient/payment/:patientId"
            element={<PaymentUpdate />}
          />
          <Route path="/clinics/addnew" element={<AddNewClinic />} />
          <Route path="/clinics" element={<Clinics />} />
          <Route path="/clinics/update/:id" element={<UpdateClinics />} />
          <Route path="/settings" element={<Settings/>}/>
        </Routes>
        <ToastContainer position="top-center" />
      </Router>
    </GlobalProvider>
  );
};

export default App;
