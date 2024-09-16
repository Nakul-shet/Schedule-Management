import React, { useContext, useState } from "react";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { GlobalContext } from "./GlobalVarOfLocation";

const AddNewDoctor = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const { globalVariable } = useContext(GlobalContext); // Global variable to get the clinic name
  const navigateTo = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Doctor"); // Default to "Doctor"
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Automatically set clinic name from global variable
  const clinicName = globalVariable || "Default Clinic";

  const handleAddNewDoctor = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(
          "http://localhost:3001/user/addDoctor",
          {
            email,
            password,
            role,
            firstName,
            lastName,
            phoneNumber,
            clinicName,
          },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => {
          toast.success(res.data.message);
          setIsAuthenticated(true);
          navigateTo("/doctors"); // Redirect to doctors page
          // Clear form
          setEmail("");
          setPassword("");
          setRole("Doctor");
          setFirstName("");
          setLastName("");
          setPhoneNumber("");
        });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding doctor.");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <section className="page">
      <section className="container form-component add-doctor-form">
        <div className="flex-column">
          <h1 className="form-title">ADD NEW DOCTOR</h1>
          <img src="/Shourya.png" alt="logo" className="logo" />
        </div>
        <form onSubmit={handleAddNewDoctor}>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Clinic Name"
              value={clinicName}
              disabled
            />
          </div>
          <div>
            <button type="submit">ADD NEW USER</button>
          </div>
        </form>
      </section>
    </section>
  );
};

export default AddNewDoctor;
