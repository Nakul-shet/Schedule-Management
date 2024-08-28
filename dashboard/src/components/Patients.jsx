import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const { isAuthenticated } = useContext(Context);
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/patients",
          { withCredentials: true }
        );
        setPatients(data.patients);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchPatients();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }
  return (
    <section className="page doctors">
      <h1>Patients</h1>
      <h1>No Patients Found!</h1>
    </section>
  );
};

export default Patients;
