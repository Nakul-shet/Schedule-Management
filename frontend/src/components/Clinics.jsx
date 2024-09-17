import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";
import "../../static/clinics.css";
import { GlobalContext } from "./GlobalVarOfLocation";

const Clinics = () => {
  const [clinics, setClinics] = useState([
    {
      _id: "1",
      name: "Clinic 1",
      address: "123 Wellness St, Health City, HC 12345",
      phone: "+1 (555) 123-4567",
      email: "contact@healthcareclinic.com",
      description:
        "Providing top-notch healthcare services with compassion and care.",
    },
    {
      _id: "2",
      name: "Clinic 2",
      address: "456 Smile Ave, Bright Town, BT 67890",
      phone: "+1 (555) 987-6543",
      email: "info@brightsmilesdental.com",
      description: "Expert dental care for a brighter, healthier smile.",
    },
    {
      _id: "3",
      name: "Wellness Spa & Clinic 3",
      address: "789 Relax Rd, Spa City, SC 23456",
      phone: "+1 (555) 246-8101",
      email: "appointments@wellnessspa.com",
      description: "A tranquil retreat for health, relaxation, and wellness.",
    },
  ]);

  const { globalVariable, setGlobalVariable } = useContext(GlobalContext);
  const { isAuthenticated } = useContext(Context);
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate("/login");
  }

  // Navigate to the Add New Patient page
  const gotoAddClinicPage = () => {
    navigate("/clinics/addnew");
  };

  const handleCardClick = (clinicName) => {
    // Create custom confirmation toast
    const confirmToast = () => (
      <div>
        <p>Do you want to change to {clinicName}?</p>
        <button
          className="yes"
          onClick={() => {
            setGlobalVariable(clinicName);
            toast.success(`Clinic changed to ${clinicName}`, {
              position: "top-right", // Success toast position
            });
            toast.dismiss(); // Dismiss the confirmation toast
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

  return (
    <section className="page">
      <div className="header">
        <h1>Clinics</h1>
        <button className="add-patient-btn" onClick={gotoAddClinicPage}>
          Add Clinics
        </button>
      </div>
      <div className="clinics">
        {clinics && clinics.length > 0 ? (
          clinics.map((clinic) => (
            <div
              className={`card ${
                clinic.name === globalVariable ? "now-card" : ""
              }`}
              key={clinic._id}
              onClick={() => handleCardClick(clinic.name)} // Handle card click
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
