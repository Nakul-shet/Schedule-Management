import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";

const AddOrEditDoctor = () => {
  const { id } = useParams(); // Get doctor ID from URL
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(Context);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (id) {
      // Fetch doctor details if we are in edit mode
      const fetchDoctor = async () => {
        try {
          const { data } = await axios.get(
            `https://schedule-management-authentication.onrender.com/api/v1/user/doctors/${id}`,
            { withCredentials: true }
          );
          setFirstName(data.firstName);
          setLastName(data.lastName);
          setEmail(data.email);
          setGender(data.gender);
        } catch (error) {
          toast.error("Error fetching doctor details.");
        }
      };

      fetchDoctor();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const doctorData = { firstName, lastName, email, password, gender };

    try {
      if (id) {
        // Edit existing doctor
        await axios.patch(
          `https://schedule-management-authentication.onrender.com/api/v1/user/doctors/${id}`,
          doctorData,
          { withCredentials: true }
        );
        toast.success("Doctor updated successfully.");
      } else {
        // Add new doctor
        await axios.post(
          `https://schedule-management-authentication.onrender.com/api/v1/user/doctor/addnew`,
          doctorData,
          { withCredentials: true }
        );
        toast.success("Doctor added successfully.");
      }

      navigate("/doctors"); // Navigate to doctors list
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error saving doctor.");
    }
  };

  if (!isAuthenticated) {
    navigate("/login");
  }

  return (
    <section className="page">
      <section className="container form-component add-edit-doctor-form">
        <h1>{id ? "Edit Doctor" : "Add New Doctor"}</h1>
        <form onSubmit={handleSubmit}>
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
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {!id && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          )}
          <button type="submit">{id ? "Update Doctor" : "Add Doctor"}</button>
        </form>
      </section>
    </section>
  );
};

export default AddOrEditDoctor;
