import React, { useContext, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FaTooth } from "react-icons/fa6";
import { toast } from "react-toastify";
import { GlobalContext } from "./GlobalVarOfLocation";
import { Context } from "../main";
import axios from "axios";

import { CONFIG } from "../config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clinics, setClinics] = useState([]); // Store clinics from API
  const [selectedClinic, setSelectedClinic] = useState(""); // Default selected clinic

  const { globalVariable, setGlobalVariable } = useContext(GlobalContext);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const navigateTo = useNavigate();

  // Fetch all clinics on component mount
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await axios.get(
          `${CONFIG.runEndpoint.backendUrl}/clinic/getAllClinic`,
          {
            withCredentials: true,
          }
        );
        setClinics(response.data || []); // Assuming response.data is the list of clinics
        // Set the first clinic as default if available
        if (response.data.length > 0) {
          setSelectedClinic(response.data[0].clinicName);
        }
      } catch (error) {
        console.error("Error fetching clinics:", error);
      }
    };

    fetchClinics();
  }, []);

  // Set selected clinic in global variable when it changes
  useEffect(() => {
    if (selectedClinic) {
      setGlobalVariable(selectedClinic); // Only set global variable when a valid clinic is selected
    }
  }, [selectedClinic, setGlobalVariable]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(
          `${CONFIG.runEndpoint.authUrl}/api/v1/user/login`,
          { email, password, confirmPassword, role: "Admin" },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => {
          toast.success(res.data.message);
          setIsAuthenticated(true);
          navigateTo("/");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <section className="form-component flex-row">
        <div className="flex-column">
          {/* <h1 className="one-dentist">
            <FaTooth className="one-dentist" />
            One Dentist
          </h1> */}
          <img src="/Shourya.png" alt="logo" className="logo" />
          <p>Only Admins Are Allowed To Access These Resources!</p>
        </div>
        <div className="form-component">
          <h1>LOGIN</h1>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {/* Clinic Dropdown */}
            <select
              value={selectedClinic}
              onChange={(e) => setSelectedClinic(e.target.value)}
            >
              {clinics.length > 0 ? (
                clinics.map((clinic) => (
                  <option key={clinic.clinicName} value={clinic.clinicName}>
                    {clinic.clinicName}
                  </option>
                ))
              ) : (
                <option value="">Loading clinics...</option>
              )}
            </select>

            <div style={{ justifyContent: "center", alignItems: "center" }}>
              <button type="submit">Login</button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;
