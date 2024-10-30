import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { Context } from "../main";
import { GlobalContext } from "./GlobalVarOfLocation";
import { toast } from "react-toastify";
import axios from "axios";
import { CONFIG } from "../config";

const EditPatient = () => {
  const { isAuthenticated } = useContext(Context);
  const { globalVariable } = useContext(GlobalContext);

  const [patientName, setPatientName] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [note, setNote] = useState("");
  const [treatmentAmount, setTreatmentAmount] = useState(""); // New Treatment Amount field
  const [notificationMethod, setNotificationMethod] = useState({
    email: false,
    sms: false,
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const res = await axios.get(
          `${CONFIG.runEndpoint.backendUrl}/patient/${id}`,
          {
            withCredentials: true,
          }
        );
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
        setTreatmentAmount(patient.treatmentAmount || ""); // Prepopulate treatment amount if available
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

    // Validate Treatment Amount as a positive number
    if (!treatmentAmount || isNaN(treatmentAmount) || treatmentAmount <= 0) {
      toast.error("Please enter a valid treatment amount.");
      return;
    }

    try {
      await axios.patch(
        `${CONFIG.runEndpoint.backendUrl}/patient/updatePatient/${id}`,
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
          treatmentAmount, // Pass treatmentAmount to the API
          clinicName: globalVariable,
          notificationMethod,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("Patient updated successfully.");
      navigate("/patients");
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
            <input
              type="number"
              placeholder="Treatment Amount"
              value={treatmentAmount}
              onChange={(e) => setTreatmentAmount(e.target.value)}
            />
            <input
              type="text"
              placeholder="Clinic Name"
              value={globalVariable}
              readOnly
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
            <textarea
              placeholder="Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
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
