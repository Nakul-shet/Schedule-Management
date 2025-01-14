import React, { useContext, useState } from "react";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router-dom";
import { GlobalContext } from "./GlobalVarOfLocation";
import { toast } from "react-toastify";
import axios from "axios";
import { CONFIG } from "../config";

const AddNewPatient = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const { globalVariable } = useContext(GlobalContext); // Changed to globalVariable from GlobalContext

  const [patientName, setPatientName] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("India"); // Set default country as India
  const [city, setCity] = useState("Mangalore"); // Set default city as Mangalore
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("@gmail.com"); // Set default email
  const [dob, setDob] = useState("");
  const [note, setNote] = useState("");
  const [treatmentAmount, setTreatmentAmount] = useState(""); // New state for treatment amount
  const [notificationMethod, setNotificationMethod] = useState({
    email: true,
    sms: true,
  });

  const navigateTo = useNavigate();

  const validateForm = () => {
    if (!patientName || !gender || !mobile || !email) {
      toast.error("All fields are required.");
      return false;
    }
    const mobilePattern = /^[0-9]{10}$/;
    if (!mobilePattern.test(mobile)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return false;
    }
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    return true;
  };
  
  const handleAddNewPatient = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Validate form before proceeding
  
    try {
      await axios.post(
        `${CONFIG.runEndpoint.backendUrl}/patient/addPatient`,
        {
          patientName,
          gender,
          country,
          city,
          mobile,
          email,
          dob,
          notes: note,
          treatmentAmount,
          clinicName: globalVariable,
          notificationMethod,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("Patient added successfully!");
      navigateTo("/patients");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.error("Please fill the details with non-duplicate values.");
        } else {
          toast.error(error.response.data.message || "An unexpected error occurred.");
        }
      } else {
        toast.error(error.message || "An unexpected error occurred.");
      }
    }
  };  

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page">
      <section className="container form-component add-admin-form">
        <h1 className="form-title">ADD NEW PATIENT</h1>
        <form onSubmit={handleAddNewPatient}>
          <div>
            <input
              type="text"
              placeholder="Patient Name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              placeholder="Country"
              value={country} // Default country value is India
              onChange={(e) => setCountry(e.target.value)}
            />
            <input
              type="text"
              placeholder="City"
              value={city} // Default city value is Mangalore
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email} // Default email is patient@gmail.com
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Treatment Amount"
              value={treatmentAmount} // Treatment Amount field
              onChange={(e) => setTreatmentAmount(e.target.value)}
            />
            <input
              type={"date"}
              placeholder="Date of Birth"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Clinic Name"
              value={globalVariable} // Clinic name is fetched from globalVariable
              readOnly // Made the field non-editable
            />
            <textarea
              placeholder="Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>
          <div>
            
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={notificationMethod.email}
                onChange={(e) =>
                  setNotificationMethod((prev) => ({
                    ...prev,
                    email: e.target.checked,
                  }))
                }
              />
              Whatsapp Notification
            </label>
            <label>
              <input
                type="checkbox"
                checked={notificationMethod.sms}
                onChange={(e) =>
                  setNotificationMethod((prev) => ({
                    ...prev,
                    sms: e.target.checked,
                  }))
                }
              />
              SMS Notification
            </label>
          </div>
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button type="submit">ADD NEW PATIENT</button>
          </div>
        </form>
      </section>
    </section>
  );
};

export default AddNewPatient;
