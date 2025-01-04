import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";
import "../../static/clinics.css";
import { GlobalContext } from "./GlobalVarOfLocation";

import { CONFIG } from "../config";

const Clinics = () => {
  const [clinics, setClinics] = useState([]);
  const { globalVariable, setGlobalVariable } = useContext(GlobalContext);
  const { isAuthenticated } = useContext(Context);
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState({});

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate("/login");
  }

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
    fetchClinics();
  }, []);

  // Navigate to the Add New Clinic page
  const gotoAddClinicPage = () => {
    navigate("/clinics/addnew");
  };

  // Navigate to the Update Clinic page with clinic data
  const gotoUpdateClinicPage = (clinic) => {
    navigate(`/clinics/update/${clinic._id}`, { state: { clinic } });
  };

  // Handle clinic card click to select a clinic
  const handleCardClick = (clinicName) => {
    console.log(clinicName)

    setGlobalVariable(clinicName);
    navigate("/");

    // const confirmToast = () => (
    //   <div>
    //     <p>Do you want to change to {clinicName}?</p>
    //     <button
    //       className="yes"
    //       onClick={() => {
    //         setGlobalVariable(clinicName);
    //         toast.success(`Clinic changed to ${clinicName}`, {
    //           position: "top-right",
    //         });
    //         toast.dismiss();
    //       }}
    //     >
    //       Yes
    //     </button>
    //     <button className="no" onClick={() => toast.dismiss()}>
    //       No
    //     </button>
    //   </div>
    // );

    // toast.info(confirmToast, {
    //   autoClose: false,
    //   closeOnClick: false,
    // });
  };

  // Handle clinic deletion
  const deleteClinic = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this clinic?"
    );

    if (confirmDelete) {
      try {
        await axios.delete(`${CONFIG.runEndpoint.backendUrl}/clinic/deleteClinic/${id}`, {
          withCredentials: true,
        });
        setClinics(clinics.filter((clinic) => clinic._id !== id)); // Update state after deletion
        toast.success("Clinic deleted successfully.");
      } catch (error) {
        toast.error(error?.response?.data?.message || "Error deleting clinic.");
      }
    }
  };

  // Toggle dropdown visibility
  const toggleDropdown = (id) => {
    setDropdownVisible((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
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
              onClick={() => handleCardClick(clinic.clinicName)}
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
