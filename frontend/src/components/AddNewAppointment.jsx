import React, { useContext, useState } from "react";
import { Context } from "../main";
import {GlobalContext} from "./GlobalVarOfLocation";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const AddNewAppointment = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const { globalVariable } = useContext(GlobalContext);

  const [patientSearch, setPatientSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [treatmentType, setTreatmentType] = useState("");

  const navigateTo = useNavigate();

  // Search for patients by name or ID
  const handlePatientSearch = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `https://schedule-management-api.onrender.com/patient/getPatientByName/${patientSearch}`
      );
      setPatients([data]);
    } catch (error) {
      toast.error("Error fetching patients");
    }
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setPatientSearch("");
    setPatients([]);
  };

  const handleAddNewAppointment = async (e) => {
    e.preventDefault();
    if (!selectedPatient) {
      toast.error("Please select a patient");
      return;
    }
    try {
      await axios.post(
        "https://schedule-management-api.onrender.com/appointment/createAppointment",
        {
          patientId: selectedPatient.patientId, // Use selectedPatient data
          patientName: selectedPatient.patientName,
          date: appointmentDate,
          startTime,
          endTime,
          treatmentType,
          clinicName : globalVariable
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("Appointment added successfully");
      setIsAuthenticated(true);
      navigateTo("/");
      resetForm();
    } catch (error) {
      toast.error("Error adding appointment");
    }
  };

  const resetForm = () => {
    setSelectedPatient(null);
    setAppointmentDate("");
    setStartTime("");
    setEndTime("");
    setClinicName("");
    setTreatmentType("");
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page">
      <section className="container form-component add-admin-form">
        <h1 className="form-title">Add New Appointment</h1>
        <form onSubmit={handleAddNewAppointment}>
          {/* Patient search field */}
          <div>
            <input
              type="text"
              placeholder="Search Patient by Name or ID"
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
            />
            <button onClick={handlePatientSearch}>Search</button>
          </div>

          {/* Show search results */}
          {patients.length > 0 && (
            <div>
              {patients.map((patient) => (
                <li
                  key={patient.patientId}
                  onClick={() => handleSelectPatient(patient)}
                >
                  {patient.patientName} (ID: {patient.patientId})
                </li>
              ))}
            </div>
          )}

          {/* Selected patient details (read-only) */}
          {selectedPatient && (
            <div>
              <div>
                <input
                  type="text"
                  value={selectedPatient.patientName}
                  readOnly
                  placeholder="Patient Name"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={selectedPatient.patientId}
                  readOnly
                  placeholder="Patient ID"
                />
              </div>
            </div>
          )}

          {/* Appointment details */}
          <div>
            <input
              type="date"
              placeholder="Date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="time"
              placeholder="Start Time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="time"
              placeholder="End Time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
          <div>
            <select
              value={treatmentType}
              onChange={(e) => setTreatmentType(e.target.value)}
              required
            >
              <option value="">Select Treatment Type</option>
              <option value="Consultation">Consultation</option>
              <option value="Follow-Up">Follow-Up</option>
              <option value="Surgery">Surgery</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button type="submit">Add Appointment</button>
          </div>
        </form>
      </section>
    </section>
  );
};

export default AddNewAppointment;
