import React, { useContext, useState } from "react";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const AddNewPatient = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [patientName, setPatientName] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [note, setNote] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [notificationMethod, setNotificationMethod] = useState({
    email: false,
    sms: false,
  });

  const navigateTo = useNavigate();

  const handleAddNewPatient = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(
          "http://localhost:3001/patient/addPatient",
          {
            patientName,
            gender,
            country,
            city,
            contact,
            mobile,
            email,
            dob,
            notes : note,
            clinicName,
            notificationMethod,
          },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => {
          toast.success(res.data.message);
          setIsAuthenticated(true);
          navigateTo("/");
          setPatientName("");
          setGender("");
          setCountry("");
          setCity("");
          setContact("");
          setMobile("");
          setEmail("");
          setDob("");
          setNote("");
          setClinicName("");
          setNotificationMethod({ email: false, sms: false });
        });
    } catch (res) {
      toast.error(res.data.error);

    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  // const handlePatientSubmit = async () => {

  //   await axios.post("http://localhost:3001/patient/addPatient")
  //   .then((res) => {

  //   })
  // }

  return (
    <section className="page">
      <section className="container form-component add-admin-form">
        <h1 className="form-title">ADD NEW PATIENT</h1>
        <form onSubmit={handleAddNewPatient}>
          <div>
            <input
              type="text"
              placeholder="Patient Name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            <input
              type="number"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type={"date"}
              placeholder="Date of Birth"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <div>
            <textarea
              placeholder="Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
            <input
              type="text"
              placeholder="Clinic Name"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
            />
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={notificationMethod.email}
                onChange={(e) =>
                  setNotificationMethod((prev) => ({
                    ...prev,
                    email: e.target.checked,
                  }))
                }
              />
              Email Notification
            </label>
            <label>
              <input
                type="checkbox"
                checked={notificationMethod.sms}
                onChange={(e) =>
                  setNotificationMethod((prev) => ({
                    ...prev,
                    sms: e.target.checked,
                  }))
                }
              />
              SMS Notification
            </label>
          </div>
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button onClick={handleAddNewPatient()}>ADD NEW PATIENT</button>
          </div>
        </form>
      </section>
    </section>
  );
};

export default AddNewPatient;
