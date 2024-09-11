import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);

  // useEffect(() => {
  //   const fetchAppointments = async () => {
  //     try {
  //       const { data } = await axios.get(
  //         "http://localhost:4000/api/v1/appointment/getall",
  //         { withCredentials: true }
  //       );
  //       setAppointments(data.appointments);
  //     } catch (error) {
  //       setAppointments([]);
  //     }
  //   };
  //   fetchAppointments();
  // }, []);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/appointment/update/${appointmentId}`,
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
      toast.error(error.response.data.message);
    }
  };

  // Filter appointments for only today's date
  // const todayAppointments = appointments.filter((appointment) =>
  //   moment(appointment.appointment_date).isSame(moment(), "day")
  // );

  // const calendarEvents = todayAppointments.map((appointment) => ({
  //   title: `${appointment.firstName} ${appointment.lastName} with Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
  //   start: new Date(appointment.appointment_date),
  //   end: new Date(moment(appointment.appointment_date).add(30, "minutes")), // assuming 30-minute appointments
  //   allDay: false,
  // }));

  const { isAuthenticated, admin } = useContext(Context);
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
                <p>Hello ,</p>
                <h5>Dr. {admin && `${admin.firstName} ${admin.lastName}`} </h5>
              </div>
              <p>
                Welcome to your dashboard at [Clinic Name], where you can
                seamlessly manage your appointments, patient records, and
                provide the best care with just a few clicks.
              </p>
            </div>
          </div>
          <div className="secondBox">
            <p>Appointments Today</p>
            {/* <h3>{todayAppointments.length}</h3> */}
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
              // events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              defaultView="day" // Show only today's events
              views={{ day: true }} // Restrict to day view
              toolbar={false} // Remove the navigation toolbar
              date={new Date()} // Set the date to today
              onNavigate={() => {}} // Disable navigation
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
