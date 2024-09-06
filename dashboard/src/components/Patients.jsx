import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Context } from "../main";
import { useNavigate } from "react-router-dom"; // Updated to use useNavigate
import { IoPersonAddSharp } from "react-icons/io5";

const Patients = () => {
  const [show, setShow] = useState(false);
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage, setPatientsPerPage] = useState(5);
  const { isAuthenticated } = useContext(Context);
  const navigate = useNavigate(); // Use navigate for navigation

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/patients",
          { withCredentials: true }
        );
        setPatients(data.patients);
        setFilteredPatients(data.patients);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchPatients();
  }, []);

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    if (value !== "") {
      const filtered = patients.filter((patient) =>
        patient.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  };

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const gotoAddPatientsPage = () => {
    navigate("/patient/addnew");
    setShow(!show); // Navigate to the add patient page
  };

  if (!isAuthenticated) {
    navigate("/login");
  }

  return (
    <section className="page patients">
      <div className="header">
        <h1>Patients</h1>
        <button className="add-patient-btn" onClick={gotoAddPatientsPage}>
          <IoPersonAddSharp /> Add Patient
        </button>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search Patient by Name"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {currentPatients.length === 0 ? (
        <h2>No Patients Found!</h2>
      ) : (
        <table className="patients-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Gender</th>
              <th>Country</th>
              <th>City</th>
              <th>Contact</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Date of Birth</th>
              <th>Note</th>
              <th>Clinic Name</th>
              <th>Email Notifications</th>
              <th>SMS Notifications</th>
            </tr>
          </thead>
          <tbody>
            {currentPatients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.name}</td>
                <td>{patient.gender}</td>
                <td>{patient.country}</td>
                <td>{patient.city}</td>
                <td>{patient.contact}</td>
                <td>{patient.mobile}</td>
                <td>{patient.email}</td>
                <td>{patient.dob}</td>
                <td>{patient.note}</td>
                <td>{patient.clinicName}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={patient.emailNotification}
                    readOnly
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={patient.smsNotification}
                    readOnly
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination">
        {Array.from(
          { length: Math.ceil(filteredPatients.length / patientsPerPage) },
          (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          )
        )}
        <select
          value={patientsPerPage}
          onChange={(e) => setPatientsPerPage(e.target.value)}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </div>
    </section>
  );
};

export default Patients;
