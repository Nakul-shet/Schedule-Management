import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";
import { IoPersonAddSharp } from "react-icons/io5";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { GlobalContext } from "./GlobalVarOfLocation";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import { CONFIG } from "../config";
import Swal from "sweetalert2";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage, setPatientsPerPage] = useState(5);
  const { isAuthenticated } = useContext(Context); // Authentication context
  const { globalVariable } = useContext(GlobalContext); // Global variable context
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]); // This effect will run when the component mounts or when `isAuthenticated` changes

  // Fetch patients function
  const fetchPatients = async () => {
    try {
      const { data } = await axios.get(
        `${CONFIG.runEndpoint.backendUrl}/patient/getAllPatient/${globalVariable}`,
        { withCredentials: true }
      );
      setPatients(data || []);
      setFilteredPatients(data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching patients.");
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []); // Fetch patients when the component mounts

  // Handle search functionality
  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    if (value !== "") {
      const filtered = patients.filter(
        (patient) =>
          (patient.patientName && patient.patientName.toLowerCase().includes(value.toLowerCase())) ||
          (patient.mobile && patient.mobile.includes(value)) ||
          (patient.id && patient.id.toString().includes(value))
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  };

  // Pagination logic
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients && filteredPatients.length > 0
    ? filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient)
    : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const gotoAddPatientsPage = () => {
    navigate("/patient/addnew");
  };

  const editPatient = (id) => {
    navigate(`/patient/edit/${id}`);
  };

  const deletePatient = async (id, name) => {
    const { value } = await Swal.fire({
      text: `Are you sure you want to delete ${name} from patient list?`,
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'No, Stay',
      icon: 'question'
    });
    
    // If the user selects "Yes", proceed with delete patient
    if (value) {
      try {
        await axios.delete(
          `${CONFIG.runEndpoint.backendUrl}/patient/deletePatient/${id}`,
          { withCredentials: true }
        );
        toast.success("Patient deleted successfully.");
        fetchPatients();
      } catch (error) {
        toast.error(error?.response?.data?.message || "Error deleting patient.");
      }
    } else {
      // If the user selects "No", do nothing
      toast.success("Patient remained in the list.");
    }
  };

  // Fetch payment details function
  const getPaymentDetails = async (patientId, patientName) => {
    try {
      const { data } = await axios.get(
        `${CONFIG.runEndpoint.backendUrl}/payment/getPaymentDetails/${patientId}`,
        { withCredentials: true }
      );
      const balence = data.treatmentAmount - data.paymentMade;
      Swal.fire({
        title: `Payment of ${patientName}`,
        text: `Treatment amount: ${data.treatmentAmount} | Balance : ${balence}`,
        confirmButtonText: 'Close'
      });
    } catch (error) {
      toast.error("Error getting payment details.");
    }
  };

  // Keep the onClick as is, just fetch payment details
  const handlePaymentClick = (patientId) => {
    navigate(`/patient/payment/${patientId}`);
  };

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
            {currentPatients.map((patient, index) => {
              return (
                <tr key={patient.id || index}>
                  <td>{patient.patientName}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.city}</td>
                  <td>{patient.mobile}</td>
                  <td>{patient.email}</td>
                  <td>
                    <RiMoneyRupeeCircleFill
                      onClick={() => handlePaymentClick(patient.patientId)} // Keep onClick the same
                      style={{ color: "goldenrod", fontSize: "25px" }}
                      title={patient.patientId}
                    />
                    <button className="view-btn" onClick={() => getPaymentDetails(patient.patientId, patient.patientName)}>
                      <FaEye/> View
                    </button>
                  </td>
                  <td className="actions-cell">
                    <button className="edit-btn" onClick={() => editPatient(patient.patientId)}>
                      <AiFillEdit />
                    </button>
                    <button className="delete-btn" onClick={() => deletePatient(patient.patientId, patient.patientName)}>
                      <AiFillDelete />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredPatients.length / patientsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
        <select value={patientsPerPage} onChange={(e) => setPatientsPerPage(e.target.value)}>
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </div>
    </section>
  );
};

export default Patients;
