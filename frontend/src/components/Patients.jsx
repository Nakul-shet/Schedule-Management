import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";
import { IoPersonAddSharp } from "react-icons/io5";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { GlobalContext } from "./GlobalVarOfLocation";
import { BsCurrencyRupee } from "react-icons/bs";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { CONFIG } from "../config";

const Patients = () => {
  //const [patients, setPatients] = useState([]); // To store the fetched patients
  const [patients, setPatients] = useState([
    {
      patientId: 1,
      patientName: "John Doe",
      gender: "Male",
      city: "New York",
      treatmentAmount: 25000,
      mobile: "1234567890",
      email: "john@example.com",
      notificationMethod: { email: true, sms: false },
    },
    {
      patientId: 2,
      patientName: "Jane Smith",
      gender: "Female",
      city: "Los Angeles",
      treatmentAmount: 999999,
      mobile: "0987654321",
      email: "jane@example.com",
      notificationMethod: { email: false, sms: true },
    },
    {
      patientId: 3,
      patientName: "Alice Johnson",
      gender: "Female",
      city: "Chicago",
      treatmentAmount: 999999,
      mobile: "1122334455",
      email: "alice@example.com",
      notificationMethod: { email: true, sms: true },
    },
    {
      patientId: 4,
      patientName: "Bob Brown",
      gender: "Male",
      city: "Houston",
      treatmentAmount: 999999,
      mobile: "2233445566",
      email: "bob@example.com",
      notificationMethod: { email: false, sms: false },
    },
    {
      patientId: 5,
      patientName: "Charlie Davis",
      gender: "Male",
      city: "Phoenix",
      treatmentAmount: 999999,
      mobile: "3344556677",
      email: "charlie@example.com",
      notificationMethod: { email: true, sms: false },
    },
  ]);
  // const [filteredPatients, setFilteredPatients] = useState([]); // To store the filtered patients based on search
  const [filteredPatients, setFilteredPatients] = useState([
    {
      patientId: 1,
      patientName: "John Doe",
      gender: "Male",
      city: "New York",
      treatmentAmount: 999999,
      mobile: "1234567890",
      email: "john@example.com",
      notificationMethod: { email: true, sms: false },
    },
    {
      patientId: 2,
      patientName: "Jane Smith",
      gender: "Female",
      city: "Los Angeles",
      treatmentAmount: 999999,
      mobile: "0987654321",
      email: "jane@example.com",
      notificationMethod: { email: false, sms: true },
    },
    {
      patientId: 3,
      patientName: "Alice Johnson",
      gender: "Female",
      city: "Chicago",
      treatmentAmount: 999999,
      mobile: "1122334455",
      email: "alice@example.com",
      notificationMethod: { email: true, sms: true },
    },
    {
      patientId: 4,
      patientName: "Bob Brown",
      gender: "Male",
      city: "Houston",
      treatmentAmount: 999999,
      mobile: "2233445566",
      email: "bob@example.com",
      notificationMethod: { email: false, sms: false },
    },
    {
      patientId: 5,
      patientName: "Charlie Davis",
      gender: "Male",
      city: "Phoenix",
      treatmentAmount: 999999,
      mobile: "3344556677",
      email: "charlie@example.com",
      notificationMethod: { email: true, sms: false },
    },
  ]);
  const [searchTerm, setSearchTerm] = useState(""); // To track the search input
  const [currentPage, setCurrentPage] = useState(1); // To track the current page for pagination
  const [patientsPerPage, setPatientsPerPage] = useState(5); // Number of patients per page
  const { isAuthenticated } = useContext(Context); // Authentication context
  const { globalVariable } = useContext(GlobalContext);
  const navigate = useNavigate(); // Navigation function

  // Fetch patients function (can be used in both useEffect and after delete)
  const fetchPatients = async () => {
    try {
      const { data } = await axios.get(
        `${CONFIG.runEndpoint.backendUrl}/patient/getAllPatient/${globalVariable}`,
        { withCredentials: true }
      );
      setPatients(data || []); // Fallback to empty array if data is undefined
      setFilteredPatients(data || []);
      console.log(data)
      // Initialize filteredPatients with the fetched data
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching patients.");
    }
  };

  // Call fetchPatients once when the component mounts
  useEffect(() => {
    fetchPatients();
  }, []);

  // Handle search functionality to filter patients based on search term
  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchTerm(value);

    if (value !== "") {
      const filtered = patients.filter(
        (patient) =>
          (patient.patientName &&
            patient.patientName.toLowerCase().includes(value.toLowerCase())) ||
          (patient.mobile && patient.mobile.includes(value)) ||
          (patient.id && patient.id.toString().includes(value))
      );
      setFilteredPatients(filtered);
    } else {
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

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Navigate to the Add New Patient page
  const gotoAddPatientsPage = () => {
    navigate("/patient/addnew");
  };

  // Edit patient handler to navigate to the edit page for a specific patient
  const editPatient = (id) => {
    navigate(`/patient/edit/${id}`);
  };

  // Delete patient function
  const deletePatient = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this patient?"
    );

    if (confirmDelete) {
      try {
        // Delete the patient
        await axios.delete(
          `${CONFIG.runEndpoint.backendUrl}/patient/deletePatient/${id}`,
          {
            withCredentials: true,
          }
        );

        toast.success("Patient deleted successfully.");

        // Re-fetch the updated patient list after deletion
        fetchPatients();
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Error deleting patient."
        );
      }
    } else {
      toast.info("Patient deletion cancelled.");
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
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPatients.map((patient, index) => (
              <tr key={patient.id || index}>
                <td>{patient.patientName}</td>
                <td>{patient.gender}</td>
                <td>{patient.city}</td>
                <td>{patient.mobile}</td>
                <td>{patient.email}</td>
                <td>
                  {/* <button
                    className="Payment-btn"
                    title={patient.patientId}
                    onClick={() =>
                      navigate(`/patient/payment/${patient.patientId}`)
                    }
                  >
                    <RiMoneyRupeeCircleFill onClick={() =>
                      navigate(`/patient/payment/${patient.patientId}`)
                    } style={{ color: "goldenrod" }} /> {patient.patientId}
                  </button> */}
                  {/* <span style={{ marginLeft: "8px" }}>
                    {patient.treatmentAmount}
                  </span> */}
                  <RiMoneyRupeeCircleFill onClick={() =>
                      navigate(`/patient/payment/${patient.patientId}`)
                    } style={{ color: "goldenrod" }} /> {patient.patientId}
                </td>

                <td className="actions-cell">
                  <button
                    className="edit-btn"
                    onClick={() => editPatient(patient.patientId)}
                  >
                    <AiFillEdit />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deletePatient(patient.patientId)}
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
