import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";
import { IoPersonAddSharp } from "react-icons/io5";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { GlobalContext } from "./GlobalVarOfLocation";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]); // To store the fetched doctors
  const [filteredDoctors, setFilteredDoctors] = useState([]); // To store the filtered doctors based on search
  const [searchTerm, setSearchTerm] = useState(""); // To track the search input
  const [currentPage, setCurrentPage] = useState(1); // To track the current page for pagination
  const [doctorsPerPage, setDoctorsPerPage] = useState(5); // Number of doctors per page
  const { globalVariable } = useContext(GlobalContext);
  const { isAuthenticated } = useContext(Context); // Authentication context
  const navigate = useNavigate(); // Navigation function

  // Fetch doctors from API when the component mounts
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // Fetching data from the API
        const { data } = await axios.get(
          "http://localhost:3001/user/getAllUsers",
          { withCredentials: true }
        );

        // Filter doctors by role
        const doctorList = data.filter((user) => user.role === "Doctor");
        setDoctors(doctorList);
        setFilteredDoctors(doctorList); // Initialize filteredDoctors with the fetched doctors
      } catch (error) {
        // Show error message if the API call fails
        toast.error(
          error?.response?.data?.message || "Error fetching doctors."
        );
      }
    };

    fetchDoctors();
  }, []); // Empty dependency array to ensure this runs once when the component mounts

  // Handle search functionality to filter doctors based on search term
  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    if (value !== "") {
      // Filter doctors based on the search term
      const filtered = doctors.filter(
        (doctor) =>
          doctor.firstName.toLowerCase().includes(value.toLowerCase()) ||
          doctor.lastName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDoctors(filtered);
    } else {
      // If search term is empty, show all doctors
      setFilteredDoctors(doctors);
    }
  };

  // Pagination logic: Determine the doctors to display on the current page
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;

  // Safeguard: Ensure that filteredDoctors is defined and is an array
  const currentDoctors =
    filteredDoctors && filteredDoctors.length > 0
      ? filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor)
      : [];

  // Pagination click handler to change the current page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Navigate to the Add New Doctor page
  const gotoAddDoctorsPage = () => {
    navigate("/doctor/addnew");
  };

  // Edit doctor handler to navigate to the edit page for a specific doctor
  const editDoctor = (id) => {
    navigate(`/doctor/edit/${id}`);
  };

  // Delete doctor handler to remove a doctor from the list
  const deleteDoctor = async (id) => {
    try {
      // API call to delete the doctor
      await axios.delete(`http://localhost:3001/user/delete/${id}`, {
        withCredentials: true,
      });
      // Update the state after deletion
      setDoctors(doctors.filter((doctor) => doctor.id !== id));
      setFilteredDoctors(filteredDoctors.filter((doctor) => doctor.id !== id));
      toast.success("Doctor deleted successfully.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error deleting doctor.");
    }
  };

  // Redirect to the login page if the user is not authenticated
  if (!isAuthenticated) {
    navigate("/login");
  }

  return (
    <section className="page patients">
      <div className="header">
        <h1>Doctors</h1>
        <button className="add-patient-btn" onClick={gotoAddDoctorsPage}>
          <IoPersonAddSharp /> Add Doctor
        </button>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search Doctor by Name"
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
              <th>Phone Number</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentDoctors.map((doctor) => (
              <tr key={doctor.id}>
                <td>{doctor.firstName}</td>
                <td>{doctor.lastName}</td>
                <td>{doctor.email}</td>
                <td>{doctor.phoneNumber}</td>
                <td>{doctor.role}</td>
                <td className="actions-cell">
                  <button
                    className="edit-btn"
                    onClick={() => editDoctor(doctor.id)}
                  >
                    <AiFillEdit />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteDoctor(doctor.id)}
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
