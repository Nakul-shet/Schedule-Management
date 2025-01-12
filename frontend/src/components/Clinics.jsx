import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";
import "../../static/clinics.css";
import { GlobalContext } from "./GlobalVarOfLocation";
import Swal from "sweetalert2";

import { CONFIG } from "../config";

const Clinics = () => {
  const [clinics, setClinics] = useState([]);
  const { globalVariable, setGlobalVariable } = useContext(GlobalContext);
  const { isAuthenticated } = useContext(Context);
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState({});
  const [isDropdownActive, setIsDropdownActive] = useState(false);  // Track if dropdown is active

  // Fetch clinics from API
  const fetchClinics = async () => {
    try {
      const response = await axios.get(
        `${CONFIG.runEndpoint.backendUrl}/clinic/getAllClinic`,
        {
          withCredentials: true,
        }
      );
      setClinics(response.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching clinics.");
    }
  };

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate("/login");
    }
    fetchClinics();
  }, [isAuthenticated, navigate]);

  // Navigate to the Add New Clinic page
  const gotoAddClinicPage = () => {
    navigate("/clinics/addnew");
  };

  // Navigate to the Update Clinic page with clinic data
  const gotoUpdateClinicPage = (clinic) => {
    navigate(`/clinics/update/${clinic._id}`, { state: { clinic } });
  };

  // Handle clinic card click to select a clinic
  const handleCardClick = async (clinicName) => {
    // Don't proceed if dropdown is active
    if (isDropdownActive) return;

    // Show SweetAlert2 confirmation dialog
    const { value } = await Swal.fire({
      title: `Do you want to change the clinic to ${clinicName}?`,
      showCancelButton: true,
      confirmButtonText: 'Yes, Change',
      cancelButtonText: 'No, Stay',
      icon: 'question'
    });

    // If the user selects "Yes", proceed with changing the clinic
    if (value) {
      setGlobalVariable(clinicName);  // Set the global variable with clinic name
      const tiHomeElement = document.getElementById("TiHome");
      tiHomeElement.classList.toggle("active-icon");
      const faLocationDot = document.getElementById("FaLocationDot");
      faLocationDot.classList.toggle("active-icon");
      navigate("/");  // Navigate to the home page (or any desired page)
    } else {
      // If the user selects "No", do nothing or log it
      console.log('User chose not to change clinic.');
    }
  };

  // Handle clinic deletion
  const deleteClinic = async (id) => {
    // Use SweetAlert2 for confirmation
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    });
  
    // If user confirms deletion
    if (result.isConfirmed) {
      try {
        await axios.delete(`${CONFIG.runEndpoint.backendUrl}/clinic/deleteClinic/${id}`, {
          withCredentials: true,
        });
        setClinics(clinics.filter((clinic) => clinic._id !== id)); // Update state after deletion
        toast.success("Clinic deleted successfully.");
      } catch (error) {
        toast.error(error?.response?.data?.message || "Error deleting clinic.");
      }
    } else {
      console.log("Deletion cancelled");
    }
  };

  // Toggle dropdown visibility and set dropdown state
  const toggleDropdown = (id) => {
    setDropdownVisible((prevState) => {
      const newState = {
        ...prevState,
        [id]: !prevState[id],  // Toggle visibility for the specific clinic
      };
      setIsDropdownActive(Object.values(newState).includes(true));  // Set the dropdown active flag
      return newState;
    });
  };

  return (
    <section className="page">
      <div className="header">
        <h1>Clinics</h1>
        <button className="add-patient-btn" onClick={gotoAddClinicPage}>
          Add Clinics
        </button>
      </div>
      <div className="clinics">
        {clinics.length > 0 ? (
          clinics.map((clinic) => (
            <div
              className={`card ${
                clinic.clinicName === globalVariable ? "now-card" : ""
              }`}
              key={clinic._id}
              onClick={() => handleCardClick(clinic.clinicName)} // Only triggers if dropdown is not active
            >
              <div className="card-header">
                <div className="details">
                  <p>
                    <span>{clinic.clinicName}</span>
                  </p>
                  <p>
                    Address: <span>{clinic.clinicAddress}</span>
                  </p>
                  <p>
                    Phone: <span>{clinic.contact}</span>
                  </p>
                  <p>
                    <span>{clinic.description}</span>
                  </p>
                </div>

                {/* 3-dots icon */}
                <div
                  className="dots-menu"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent card click
                    toggleDropdown(clinic._id);
                  }}
                >
                  &#x22EE; {/* Vertical Ellipsis icon */}
                </div>

                {/* Dropdown menu */}
                {dropdownVisible[clinic._id] && (
                  <div className="dropdown-menu">
                    <button
                      onClick={() => {
                        setDropdownVisible({});
                        gotoUpdateClinicPage(clinic);
                      }}
                    >
                      Update
                    </button>
                    <button
                      onClick={() => {
                        setDropdownVisible({});
                        deleteClinic(clinic._id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <h1>No Clinics Found!</h1>
        )}
      </div>
    </section>
  );
};

export default Clinics;
