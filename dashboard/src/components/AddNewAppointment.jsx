import React, { useContext, useState, useEffect } from "react";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const AddNewAppointment = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [patientSearch, setPatientSearch] = useState("");
  const [patients, setPatients] = useState({});
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [treatmentType, setTreatmentType] = useState("");

  const navigateTo = useNavigate();

  // Search for patients by name or ID
  const handlePatientSearch = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `http://localhost:3001/patient/getPatientByName/${patientSearch}`
      );
      setPatients(data);
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
        "http://localhost:3001/appointment/createAppointment",
        {
          patientId: patients.patientId,
          clinicName,
          date: appointmentDate,
          startTime,
          endTime,
          treatmentType,
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

          {
              Object.keys(patients).length > 0 ? 
              <div>
                <div>
                  <h1>{patients.patientName}</h1>
                  <h3>{patients.patientId}</h3>
                </div>
              </div>
              : ""
          }

          {/* List of patients */}
          {/* {patients.length > 0 && (
            <ul className="patient-list">
              {patients.map((patient) => (
                <li
                  key={patient._id}
                  onClick={() => handleSelectPatient(patient)}
                >
                  {patient.name} (ID: {patient._id})
                </li>
              ))}
            </ul>
          )} */}

          {/* Selected patient details */}
          {selectedPatient && (
            <div>
              <p>
                <strong>Selected Patient:</strong> {selectedPatient.name} (ID:{" "}
                {selectedPatient._id})
              </p>
            </div>
          )}

          {/* Appointment details */}
          <div>
            <input
              type="text"
              placeholder="Clinic Name"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              required
            />
          </div>
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
            <button onClick={handleAddNewAppointment} type="submit">Add Appointment</button>
          </div>
        </form>
      </section>
    </section>
  );
};

export default AddNewAppointment;
