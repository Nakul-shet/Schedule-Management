import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { Context } from "../main";
import { GlobalContext } from "./GlobalVarOfLocation";
import { toast } from "react-toastify";
import axios from "axios";

const EditPatient = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const { globalVariable } = useContext(GlobalContext); // Used globalVariable from GlobalContext

  const [patientName, setPatientName] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [note, setNote] = useState("");
  const [notificationMethod, setNotificationMethod] = useState({
    email: false,
    sms: false,
  });

  const navigate = useNavigate();
  const { id } = useParams();
  // Get the patient ID from the URL

  // Fetch the patient details when the component mounts
  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const res = await axios.get(`https://schedule-management-api.onrender.com/patient/${id}`, {
          withCredentials: true,
        });
        const patient = res.data;
        setPatientName(patient.patientName);
        setGender(patient.gender);
        setCountry(patient.country);
        setCity(patient.city);
        setContact(patient.contact);
        setMobile(patient.mobile);
        setEmail(patient.email);
        setDob(patient.dob);
        setNote(patient.notes);
        setNotificationMethod(
          patient.notificationMethod || { email: false, sms: false }
        );
      } catch (error) {
        toast.error("Failed to fetch patient details.");
      }
    };
    fetchPatientDetails();
  }, [id]);

  const handleUpdatePatient = async (e) => {
    e.preventDefault();
    try {
      await axios
        .patch(
          `https://schedule-management-api.onrender.com/patient/updatePatient/${id}`, // Use the correct update API
          {
            patientName,
            gender,
            country,
            city,
            contact,
            mobile,
            email,
            dob,
            notes: note,
            clinicName: globalVariable, // Send the clinicName as globalVariable
            notificationMethod,
          },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => {
          toast.success(res.data.message);
          navigate("/patients"); // Redirect to home or patient list after update
        });
    } catch (error) {
      toast.error("Failed to update patient.");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <section className="page">
      <section className="container form-component add-admin-form">
        <h1 className="form-title">EDIT PATIENT DETAILS</h1>
        <form onSubmit={handleUpdatePatient}>
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
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            <input
              type="number"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="date"
              placeholder="Date of Birth"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <div>
            <textarea
              placeholder="Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
            <input
              type="text"
              placeholder="Clinic Name"
              value={globalVariable} // clinicName is fixed as globalVariable
              readOnly // Non-editable field
            />
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
              Email Notification
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
            <button type="submit">UPDATE PATIENT</button>
          </div>
        </form>
      </section>
    </section>
  );
};

export default EditPatient;
