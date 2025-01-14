import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { GlobalContext } from "./GlobalVarOfLocation";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { CONFIG } from "../config";

const localizer = momentLocalizer(moment);

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [todayScheduledAppointments, setTodayScheduledAppointments] = useState([]);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [appointmentStats, setAppointmentStats] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [calendarHeight, setCalendarHeight] = useState(400); // State for dynamic calendar height

  const { globalVariable } = useContext(GlobalContext);
  const { isAuthenticated, admin } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.success("Please 🙏 Login to use the Application");
      navigate("/login");
    }

    const todayScheduledAppointments = async () => {
      try {
        const { data } = await axios.get(
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
    };

    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          `${CONFIG.runEndpoint.backendUrl}/appointment/today/${globalVariable}`,
          {
            withCredentials: true,
          }
        );

        const mappedAppointments = data.map((appointment) => ({
          title: appointment.patientName,
          start: new Date(appointment.startTime),
          end: new Date(appointment.endTime),
          status: appointment.status,
          _id: appointment._id,
        }));

        const today = new Date();
        const filteredTodayAppointments = mappedAppointments.filter(
          (appointment) =>
            appointment.start.toDateString() === today.toDateString()
        );

        const filteredTodayScheduledAppointments = filteredTodayAppointments.filter(
          (appointment) => appointment.status === "scheduled"
        );

        setAppointments(mappedAppointments);
        setTodayScheduledAppointments(filteredTodayScheduledAppointments);

        const now = new Date();
        const upcomingAppointments = filteredTodayScheduledAppointments.filter(
          (appointment) => appointment.start >= now || appointment.status === "scheduled"
        );

        if (upcomingAppointments.length > 0) {
          const nextApp = upcomingAppointments.sort(
            (a, b) => a.start - b.start
          )[0];
          setNextAppointment(nextApp);
        }
      } catch (error) {
        if (isAuthenticated) {
          toast.error(
            error.response?.data?.message || "Error fetching appointments."
          );
        } else {
          toast.success("Please 🙏 Login to use the Application");
        }
      }

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

        return () => clearInterval(intervalId);
      }
    };

    if (isAuthenticated) {
      fetchAppointments();
      todayScheduledAppointments();
    }

    // Calculate and set the calendar height on window resize and initial load
    const handleResize = () => {
      setCalendarHeight(window.innerHeight * 0.6); // Set height to 60% of screen height
    };

    handleResize(); // Set initial height

    window.addEventListener("resize", handleResize); // Add event listener for resizing
    return () => window.removeEventListener("resize", handleResize); // Cleanup on component unmount
  }, [isAuthenticated, nextAppointment, globalVariable]);

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

  return (
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
            events={todayScheduledAppointments}
            startAccessor="start"
            endAccessor="end"
            style={{ height: calendarHeight }} // Use the dynamically calculated height
            defaultView="day"
            views={{ day: true }}
            toolbar={false}
            date={new Date()}
            scrollToTime={new Date()}
            onNavigate={() => {}}
          />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
