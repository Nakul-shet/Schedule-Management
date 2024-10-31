import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { GlobalContext } from "./GlobalVarOfLocation";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { CONFIG } from "../config";
import moment from "moment";

const AddNewAppointment = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const { globalVariable } = useContext(GlobalContext);

  const [patientSearch, setPatientSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState(""); // State to track the selected duration
  const [treatmentType, setTreatmentType] = useState("");

  const navigateTo = useNavigate();
  const location = useLocation(); // Hook to get the current URL

  // Extract query parameters (date and time) from the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dateParam = params.get("date");
    const timeParam = params.get("time");

    if (dateParam) {
      setAppointmentDate(dateParam); // Set the appointment date from the URL
    }
    if (timeParam) {
      const formattedTime = moment(timeParam, "HH:mm").format("HH:mm");
      setStartTime(formattedTime); // Set the start time in 24-hour format
    }
  }, [location]);

  // Format the date for the title
  const formattedTitleDate = appointmentDate
    ? moment(appointmentDate, "YYYY-MM-DD").format("MMM DD YYYY")
    : "selected Date";

  // Search for patients by name or ID
  const handlePatientSearch = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `${CONFIG.runEndpoint.backendUrl}/patient/getPatientByName/${patientSearch}`
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

  // Function to calculate the end time based on the selected start time and duration
  const calculateEndTime = (startTime, duration) => {
    if (!startTime || !duration) return;
    const end = moment(startTime, "HH:mm")
      .add(duration, "minutes")
      .format("HH:mm");
    setEndTime(end);
  };

  // Update the end time whenever start time or duration changes
  useEffect(() => {
    calculateEndTime(startTime, duration);
  }, [startTime, duration]);

  const handleAddNewAppointment = async (e) => {
    e.preventDefault();
    if (!selectedPatient) {
      toast.error("Please select a patient");
      return;
    }
    try {
      await axios.post(
        `${CONFIG.runEndpoint.backendUrl}/appointment/createAppointment`,
        {
          patientId: selectedPatient.patientId,
          patientName: selectedPatient.patientName,
          date: appointmentDate,
          startTime,
          endTime,
          treatmentType,
          clinicName: globalVariable,
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
    setDuration("");
    setTreatmentType("");
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page">
      <section className="container form-component add-admin-form">
        {/* Title with dynamic date */}
        <h1 className="form-title">
          Add New Appointment on {formattedTitleDate}
        </h1>

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
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="date"
              placeholder="Date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
            />
            <input
              type="time"
              placeholder="Start Time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          {/* Time slot duration dropdown */}
          <div style={{ display: "flex", gap: "10px" }}>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            >
              <option value="">Select Duration</option>
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
              <option value="20">20 minutes</option>
              <option value="30">30 minutes</option>
            </select>
            <input
              type="time"
              placeholder="End Time"
              value={endTime}
              readOnly
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
