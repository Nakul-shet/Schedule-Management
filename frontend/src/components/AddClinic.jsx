import React, { useContext, useState } from "react";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const AddNewClinic = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();

  // State variables for clinic details
  const [clinicName, setClinicName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");

  const handleAddNewClinic = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(
          "http://localhost:3001/clinic/createClinic",
          {
            clinicName,
            address,
            phone,
            description,
          },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => {
          toast.success(res.data.message);
          setIsAuthenticated(true);
          navigateTo("/clinics"); // Redirect to the clinics list page
          // Clear form
          setClinicName("");
          setAddress("");
          setPhone("");
          setDescription("");
        });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding clinic.");
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
        <form onSubmit={handleAddNewClinic}>
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
            <button type="submit">ADD NEW CLINIC</button>
          </div>
        </form>
      </section>
    </section>
  );
};

export default AddNewClinic;
