import React, { useContext, useState, useEffect } from "react";
import { Context } from "../main";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import { CONFIG } from "../config";

const EditNewClinic = () => {
  const { isAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();
  const { state } = useLocation(); // Get passed clinic data if any
  const clinicData = state?.clinic; // Get clinic data for editing

  // State variables for clinic details
  const [clinicName, setClinicName] = useState(clinicData?.clinicName || "");
  const [address, setAddress] = useState(clinicData?.clinicAddress || "");
  const [phone, setPhone] = useState(clinicData?.contact || "");
  const [description, setDescription] = useState(clinicData?.description || "");

  const handleSaveClinic = async (e) => {
    e.preventDefault();
    try {
      if (clinicData) {
        // Update existing clinic
        await axios.put(
          `${CONFIG.runEndpoint.backendUrl}/clinic/updateClinic/${clinicData._id}`,
          {
            clinicName,
            clinicAddress: address,
            contact: phone,
            description,
          },
          { withCredentials: true }
        );
        toast.success("Clinic updated successfully!");
      }

      // Redirect to the clinics list page after save
      navigateTo("/clinics");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving clinic.");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <section className="page">
      <section className="container form-component add-clinic-form">
        <div className="flex-row">
          <img src="/Shourya.png" alt="logo" className="logo" />
        </div>
        <form onSubmit={handleSaveClinic}>
          <div>
            <input
              type="text"
              placeholder="Clinic Name"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div>
            <button type="submit">
              {clinicData ? "Update Clinic" : "Add New Clinic"}
            </button>
          </div>
        </form>
      </section>
    </section>
  );
};

export default EditNewClinic;
