import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";
import { IoPersonAddSharp } from "react-icons/io5";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { GlobalContext } from "./GlobalVarOfLocation";
import Swal from "sweetalert2";
import { CONFIG } from "../config";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage, setDoctorsPerPage] = useState(5);
  const { isAuthenticated, userId } = useContext(Context);
  const { globalVariable } = useContext(GlobalContext);
  const navigate = useNavigate();

  // Fetch doctors function
  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get(
        `${CONFIG.runEndpoint.authUrl}/api/v1/user/doctors`,
        { withCredentials: true }
      );
      setDoctors(data || []);
      setFilteredDoctors(data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching doctors.");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Handle search functionality
  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchTerm(value);

    if (value !== "") {
      const filtered = doctors.filter(
        (doctor) =>
          (doctor.firstName &&
            doctor.firstName.toLowerCase().includes(value.toLowerCase())) ||
          (doctor.lastName &&
            doctor.lastName.toLowerCase().includes(value.toLowerCase())) ||
          (doctor.email &&
            doctor.email.toLowerCase().includes(value.toLowerCase()))
      );
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors(doctors);
    }
  };

  // Pagination logic
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors =
    filteredDoctors.length > 0
      ? filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor)
      : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Navigate to the Add New Doctor page
  const gotoAddDoctorsPage = () => {
    navigate("/doctor/addnew");
  };

  // Edit doctor handler
  const editDoctor = (id,isAuth) => {
    if(!isAuth) {
      toast.info("You are not authorised to Update this details");
    }
    navigate(`/doctor/edit/${id}`);
  };

  // Delete doctor function
  const deleteDoctor = async (id,isAuth) => {
    if(!isAuth) {
      toast.info("You are no authorised to Delete this details");
    }

    const { value } = await Swal.fire({
          text: `Are you sure you want to delete this doctor?`,
          showCancelButton: true,
          confirmButtonText: 'Yes, Delete',
          cancelButtonText: 'No, Stay',
          icon: 'question'
        });
    if (value) {
      try {
        await axios.delete(`${CONFIG.runEndpoint.authUrl}/api/v1/user/doctors/${id}`, {
          withCredentials: true,
        });
        toast.success("Doctor deleted successfully.");
        fetchDoctors(); // Re-fetch updated doctor list after deletion
      } catch (error) {
        toast.error(error?.response?.data?.message || "Error deleting doctor.");
      }
    } else {
      toast.info("Doctor deletion cancelled.");
    }
  };

  if (!isAuthenticated) {
    navigate("/login");
  }

  return (
    <section className="page doctors">
      <div className="header">
        <h1>Doctors</h1>
        <button className="add-patient-btn" onClick={gotoAddDoctorsPage}>
          <IoPersonAddSharp /> Add Doctor
        </button>
      </div>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search Doctor by Name or Email"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      {currentDoctors.length === 0 ? (
        <h2>No Doctors Found!</h2>
      ) : (
        <table className="patients-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentDoctors.map((doctor, index) => (
              <tr key={doctor._id || index}>
                <td>{doctor.firstName}</td>
                <td>{doctor.lastName}</td>
                <td>{doctor.email}</td>
                <td className="actions-cell">
                  {(userId === doctor._id) ? (
                    <>
                      <button
                        className="edit-btn"
                        onClick={() => editDoctor(doctor._id,true)}
                      >
                        <AiFillEdit />
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteDoctor(doctor._id,true)}
                      >
                        <AiFillDelete />
                      </button>
                    </>
                  ):(
                    <>
                      <button
                        className="edit-btn"
                        onClick={() => editDoctor(doctor._id,false)}
                      >
                        <AiFillEdit />
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteDoctor(doctor._id,false)}
                      >
                        <AiFillDelete />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination">
        {Array.from(
          { length: Math.ceil(filteredDoctors.length / doctorsPerPage) },
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
          value={doctorsPerPage}
          onChange={(e) => setDoctorsPerPage(e.target.value)}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </div>
    </section>
  );
};

export default Doctors;
