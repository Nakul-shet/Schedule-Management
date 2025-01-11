import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { GlobalContext } from "./GlobalVarOfLocation";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { CONFIG } from "../config";

const localizer = momentLocalizer(moment);

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]); // State to hold fetched appointments
  const [todayScheduledAppointments, setTodayScheduledAppointments] = useState(
    []
  ); // State to hold today's scheduled appointments
  const [nextAppointment, setNextAppointment] = useState(null); // State for next appointment
  const [appointmentStats, setAppointmentStats] = useState("");
  const [timeLeft, setTimeLeft] = useState(""); // State to hold countdown timer

  const { globalVariable } = useContext(GlobalContext); // Access globalVariable
  const { isAuthenticated, admin } = useContext(Context); // Access authentication and admin details

  // Fetch appointments from API
  useEffect(() => {
    if (!isAuthenticated) {
      return <Navigate to={"/login"} />;
    }
    
    const todayScheduledAppointments = async () =>{
      try {
        const {data} = await axios.get(
          `${CONFIG.runEndpoint.backendUrl}/appointment/appointmentStats/${globalVariable}`,
          {
            withCredentials: true,
          }
        );
        setAppointmentStats(data);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Error fetching appointments."
        );
      }
    }
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          `${CONFIG.runEndpoint.backendUrl}/appointment/today/${globalVariable}`,
          {
            withCredentials: true,
          }
        );

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

        // Filter only scheduled appointments
        const filteredTodayScheduledAppointments =
          filteredTodayAppointments.filter(
            (appointment) => appointment.status === "scheduled"
          );

        // Set the state for appointments and today's scheduled appointments
        setAppointments(mappedAppointments);
        setTodayScheduledAppointments(filteredTodayScheduledAppointments);

        // Find the next upcoming appointment
        const now = new Date();

        const upcomingAppointments = filteredTodayScheduledAppointments.filter(
          (appointment) => appointment.start >= now || appointment.status === "scheduled"
        );

        if (upcomingAppointments.length > 0) {
          const nextApp = upcomingAppointments.sort(
            (a, b) => a.start - b.start
          )[0]; // Get the closest next appointment
          setNextAppointment(nextApp);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Error fetching appointments."
        );
      }
    };

    fetchAppointments();
    todayScheduledAppointments();
  }, []);


  // Function to calculate and format time left for the next appointment
  useEffect(() => {
    if (nextAppointment) {
      const intervalId = setInterval(() => {
        const now = new Date();
        const timeDifference = nextAppointment.start - now;

        if (timeDifference <= 0) {
          clearInterval(intervalId);
          setTimeLeft("Starting now");
        } else {
          const hours = Math.floor(timeDifference / (1000 * 60 * 60));
          const minutes = Math.floor(
            (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(intervalId); // Cleanup timer on unmount
    }
  }, [nextAppointment]);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `${CONFIG.runEndpoint.backendUrl}/appointment/update/${appointmentId}`,
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
                <h5>
                  {admin.firstName && `${admin.firstName} ${admin.lastName}`}{" "}
                </h5>
              </div>
              <p>
                Welcome to your dashboard at <b>{globalVariable}</b>, where you
                can seamlessly manage your appointments, patient records, and
                provide the best care with just a few clicks.
              </p>
            </div>
          </div>
          <div className="secondBox">
            <p>Appointments Completed</p>
            <h3>{appointmentStats}</h3>
            {/* Display total scheduled count */}
          </div>
          <div className="thirdBox">
            <p>Next Appointment</p>
            {nextAppointment ? (
              <>
                <h5>{nextAppointment.title}</h5>
                <p>
                  Starts at:{" "}
                  {nextAppointment.start.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p>Time Left: {timeLeft}</p>
              </>
            ) : (
              <p>No upcoming appointments</p>
            )}
          </div>
        </div>

        <div className="banner">
          <div className="last-child">
            <h5>Today's Scheduled Appointments</h5>
            <Calendar
              localizer={localizer}
              events={todayScheduledAppointments} // Use only scheduled appointments for the calendar
              startAccessor="start"
              endAccessor="end"
              style={{ height: 300 }}
              defaultView="day"
              views={{ day: true }}
              toolbar={false}
              date={new Date()}
              scrollToTime={new Date()} // Automatically scroll to current time
              onNavigate={() => {}}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
