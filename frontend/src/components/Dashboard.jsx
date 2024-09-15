import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { GlobalContext } from "./GlobalVarOfLocation";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]); // State to hold fetched appointments
  const [todayAppointments, setTodayAppointments] = useState([]); // State to hold today's appointments

  const { globalVariable } = useContext(GlobalContext); // Access globalVariable
  const { isAuthenticated, admin } = useContext(Context); // Access authentication and admin details

  // Fetch appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get("http://localhost:3001/appointment", {
          withCredentials: true,
        });

        // Map appointments to the format required by the Calendar component
        const mappedAppointments = data.map((appointment) => ({
          title: appointment.patientName,
          start: new Date(appointment.startTime),
          end: new Date(appointment.endTime),
          status: appointment.status,
          _id: appointment._id,
        }));

        // Filter today's appointments
        const today = new Date();
        const filteredTodayAppointments = mappedAppointments.filter(
          (appointment) =>
            appointment.start.toDateString() === today.toDateString()
        );

        // Set the state for appointments and today's appointments
        setAppointments(mappedAppointments);
        setTodayAppointments(filteredTodayAppointments);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Error fetching appointments."
        );
      }
    };

    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:3001/appointment/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error updating appointment status."
      );
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <section className="dashboard page">
        <div className="banner">
          <div className="firstBox">
            <img src="/doc.png" alt="docImg" />
            <div className="content">
              <div>
                <p>Hello,</p>
                <h5>Dr. {admin && `${admin.firstName} ${admin.lastName}`}</h5>
              </div>
              <p>
                Welcome to your dashboard at {globalVariable}, where you can
                seamlessly manage your appointments, patient records, and
                provide the best care with just a few clicks.
              </p>
            </div>
          </div>
          <div className="secondBox">
            <p>Appointments Today</p>
            <h3>{todayAppointments.length}</h3>{" "}
            {/* Display count of today's appointments */}
          </div>
          <div className="thirdBox">
            <p>Users Now</p>
            <h3>1</h3>
          </div>
        </div>

        <div className="banner">
          <div className="last-child">
            <h5>Today's Appointments</h5>
            <Calendar
              localizer={localizer}
              events={todayAppointments} // Use today's appointments for the calendar
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              defaultView="day"
              views={{ day: true }}
              toolbar={false}
              date={new Date()}
              onNavigate={() => {}}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
