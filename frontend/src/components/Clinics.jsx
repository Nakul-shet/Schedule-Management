import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";
import "../../static/clinics.css";
import { GlobalContext } from "./GlobalVarOfLocation";

const Clinics = () => {
  const [clinics, setClinics] = useState([]);
  const { globalVariable, setGlobalVariable } = useContext(GlobalContext);
  const { isAuthenticated } = useContext(Context);
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate("/login");
  }

  // Fetch clinics from API
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/clinic/getAllClinic",
          {
            withCredentials: true,
          }
        );
        setClinics(response.data || []);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Error fetching clinics."
        );
      }
    };

    fetchClinics();
  }, []);

  // Navigate to the Add New Clinic page
  const gotoAddClinicPage = () => {
    navigate("/clinics/addnew");
  };

  const handleCardClick = (clinicName) => {
    const confirmToast = () => (
      <div>
        <p>Do you want to change to {clinicName}?</p>
        <button
          className="yes"
          onClick={() => {
            setGlobalVariable(clinicName);
            toast.success(`Clinic changed to ${clinicName}`, {
              position: "top-right",
            });
            toast.dismiss();
          }}
        >
          Yes
        </button>
        <button className="no" onClick={() => toast.dismiss()}>
          No
        </button>
      </div>
    );

    toast.info(confirmToast, {
      autoClose: false,
      closeOnClick: false,
    });
  };

  const updateClinic = async (id, updatedData) => {
    try {
      await axios.put(
        `http://localhost:3001/clinic/updateClinic/${id}`,
        updatedData,
        {
          withCredentials: true,
        }
      );
      toast.success("Clinic updated successfully.");
      // Refresh the clinic list after update
      fetchClinics();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating clinic.");
    }
  };

  const deleteClinic = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this clinic?"
    );

    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3001/clinic/deleteClinic/${id}`, {
          withCredentials: true,
        });
        setClinics(clinics.filter((clinic) => clinic._id !== id)); // Update state after deletion
        toast.success("Clinic deleted successfully.");
      } catch (error) {
        toast.error(error?.response?.data?.message || "Error deleting clinic.");
      }
    }
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
                clinic.name === globalVariable ? "now-card" : ""
              }`}
              key={clinic._id}
              onClick={() => handleCardClick(clinic.name)}
            >
              <div className="details">
                <p>
                  <span>{clinic.name}</span>
                </p>
                <p>
                  Address: <span>{clinic.address}</span>
                </p>
                <p>
                  Phone: <span>{clinic.phone}</span>
                </p>
                <p>
                  <span>{clinic.description}</span>
                </p>
              </div>
              <div className="actions">
                <button
                  onClick={() =>
                    updateClinic(clinic._id, {
                      /* updated data here */
                    })
                  }
                >
                  Update
                </button>
                <button onClick={() => deleteClinic(clinic._id)}>Delete</button>
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
