import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";
import { IoPersonAddSharp } from "react-icons/io5";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { GlobalContext } from "./GlobalVarOfLocation";

const Patients = () => {
  const [patients, setPatients] = useState([]); // To store the fetched patients
  const [filteredPatients, setFilteredPatients] = useState([]); // To store the filtered patients based on search
  const [searchTerm, setSearchTerm] = useState(""); // To track the search input
  const [currentPage, setCurrentPage] = useState(1); // To track the current page for pagination
  const [patientsPerPage, setPatientsPerPage] = useState(5); // Number of patients per page
  const { isAuthenticated } = useContext(Context); // Authentication context
  const { globalVariable } = useContext(GlobalContext);
  const navigate = useNavigate(); // Navigation function

  // Fetch patients from API when the component mounts
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Fetching data from the API
        const { data } = await axios.get(
          `http://localhost:3001/patient/getAllPatient/${globalVariable}`,
          { withCredentials: true }
        );

        // Set the data directly into the state if it's an array
        setPatients(data || []); // Fallback to empty array if data is undefined
        setFilteredPatients(data || []); // Initialize filteredPatients with the fetched data
      } catch (error) {
        // Show error message if the API call fails
        toast.error(
          error?.response?.data?.message || "Error fetching patients."
        );
      }
    };

    fetchPatients();
  }, []); // Empty dependency array to ensure this runs once when the component mounts

  // Handle search functionality to filter patients based on search term
  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    if (value !== "") {
      // Filter patients based on the search term
      const filtered = patients.filter((patient) =>
        patient.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredPatients(filtered);
    } else {
      // If search term is empty, show all patients
      setFilteredPatients(patients);
    }
  };

  // Pagination logic: Determine the patients to display on the current page
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;

  // Safeguard: Ensure that filteredPatients is defined and is an array
  const currentPatients =
    filteredPatients && filteredPatients.length > 0
      ? filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient)
      : [];

  // Pagination click handler to change the current page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Navigate to the Add New Patient page
  const gotoAddPatientsPage = () => {
    navigate("/patient/addnew");
  };

  // Edit patient handler to navigate to the edit page for a specific patient
  const editPatient = (id) => {
    navigate(`/patient/edit/${id}`);
  };

  // Delete patient handler to remove a patient from the list
  const deletePatient = async (id) => {
    try {
      // API call to delete the patient
      await axios.delete(`http://localhost:3001/patient/delete/${id}`, {
        withCredentials: true,
      });
      // Update the state after deletion
      setPatients(patients.filter((patient) => patient.id !== id));
      setFilteredPatients(
        filteredPatients.filter((patient) => patient.id !== id)
      );
      toast.success("Patient deleted successfully.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error deleting patient.");
    }
  };

  // Redirect to the login page if the user is not authenticated
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
              <th>City</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Notifications</th> {/* Updated header */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPatients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.patientName}</td>
                <td>{patient.gender}</td>
                <td>{patient.city}</td>
                <td>{patient.mobile}</td>
                <td>{patient.email}</td>
                <td className="notification-cell">
                  {/* Combined Email and SMS notifications in one cell */}
                  <div className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={patient.emailNotification}
                        readOnly
                      />
                      Email
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={patient.smsNotification}
                        readOnly
                      />
                      SMS
                    </label>
                  </div>
                </td>
                <td className="actions-cell">
                  <button
                    className="edit-btn"
                    onClick={() => editPatient(patient.id)}
                  >
                    <AiFillEdit />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deletePatient(patient.id)}
                  >
                    <AiFillDelete />
                  </button>
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
