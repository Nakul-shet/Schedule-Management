import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import { IoPersonAddSharp } from "react-icons/io5";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../static/calendar.css";

const localizer = momentLocalizer(moment);

const Events = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState(Views.MONTH);
  const { isAuthenticated } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:3001/appointment", {
          withCredentials: true,
        });
        setEvents(res.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching events");
      }
    };
    fetchEvents();
  }, []);

  const gotoAddPatientsAppointment = () => {
    navigate("/appointment/addnew");
  };

  const calendarEvents = events.map((event) => ({
    title: `${event.patientId} | ${event.clinicName} | ${event.treatmentType}`,
    start: new Date(event.startTime),
    end: new Date(event.endTime),
    id: event.id, // Assuming each event has a unique id
  }));

  const handleSelectEvent = (event) => {
    const confirmToast = () => (
      <div>
        <p>Choose an action for {event.title}:</p>
        <button onClick={() => updateAppointment(event.id)}>Update</button>
        <button onClick={() => cancelAppointment(event.id)}>Cancel</button>
      </div>
    );

    toast.info(confirmToast, {
      autoClose: false,
      closeOnClick: false,
    });
  };

  const updateAppointment = async (id) => {
    const updatedData = {
      /* Add updated appointment data here */
    };
    try {
      await axios.put(
        `http://localhost:3001/appointment/updateAppointment/${id}`,
        updatedData,
        {
          withCredentials: true,
        }
      );
      toast.success("Appointment updated successfully.");
      fetchEvents(); // Refresh events after update
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error updating appointment."
      );
    }
  };

  const cancelAppointment = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (confirmDelete) {
      try {
        await axios.delete(
          `http://localhost:3001/appointment/deleteAppointment/${id}`,
          {
            withCredentials: true,
          }
        );
        setEvents(events.filter((event) => event.id !== id)); // Update state after deletion
        toast.success("Appointment canceled successfully.");
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Error canceling appointment."
        );
      }
    }
  };

  return (
    <section className="page events">
      <div className="header">
        <h1>Appointments</h1>
        <button
          className="add-patient-btn"
          onClick={gotoAddPatientsAppointment}
        >
          <IoPersonAddSharp /> Create Appointment
        </button>
      </div>
      <div style={{ height: "80vh" }}>
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          onSelectEvent={handleSelectEvent}
          onNavigate={(date) => setSelectedDate(date)}
          defaultView={Views.MONTH}
          views={["month", "week", "day"]}
          date={selectedDate}
          view={view}
          onView={setView}
        />
      </div>
    </section>
  );
};

export default Events;
