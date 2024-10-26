import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import DatePicker from "react-datepicker";
import { IoPersonAddSharp } from "react-icons/io5";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import "../../static/calendar.css";
import { CONFIG } from "../config";

const localizer = momentLocalizer(moment);

const Events = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState(Views.MONTH);
  const [showDatePicker, setShowDatePicker] = useState(false);
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
        const res = await axios.get(
          `${CONFIG.runEndpoint.backendUrl}/appointment`,
          { withCredentials: true }
        );
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
    title: `${event.patientId} | ${event.patientName} | ${event.treatmentType}`,
    start: new Date(event.startTime),
    end: new Date(event.endTime),
    id: event._id,
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

  const handleSelectSlot = ({ start }) => {
    if (view === Views.MONTH) {
      // If the current view is Month, change to Day view on date click
      setSelectedDate(start);
      setView(Views.DAY);
    } else if (view === Views.DAY) {
      // If the current view is Day, navigate to the Add Appointment page on time click
      const date = moment(start).format("DD-MM-YYYY"); // Format date as DD-MM-YYYY
      const time = moment(start).format("hh:mmA"); // Format time as hh:mmAM/PM
      navigate(`/appointment/addnew?date=${date}&time=${time}`);
    }
  };

  const updateAppointment = async (id) => {
    const updatedData = { status: "completed" };
    try {
      await axios.put(
        `${CONFIG.runEndpoint.backendUrl}/appointment/updateAppointment/${id}`,
        updatedData,
        { withCredentials: true }
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
          `${CONFIG.runEndpoint.backendUrl}/appointment/deleteAppointment/${id}`,
          { withCredentials: true }
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

  const CustomToolbar = ({ date, label }) => (
    <div className="rbc-toolbar">
      <button className="rbc-btn" onClick={() => setView(Views.MONTH)}>
        Month
      </button>
      <button className="rbc-btn" onClick={() => setView(Views.WEEK)}>
        Week
      </button>
      <button className="rbc-btn" onClick={() => setView(Views.DAY)}>
        Day
      </button>

      <span
        className="rbc-toolbar-label"
        onClick={() => setShowDatePicker(true)}
      >
        {label}
      </span>

      {showDatePicker && (
        <DatePicker
          className="react-datepicker"
          selected={selectedDate}
          onChange={(date) => {
            setView(Views.DAY);
            setSelectedDate(date);
            setShowDatePicker(false);
          }}
          inline
        />
      )}

      <button className="rbc-btn" onClick={() => navigate("back")}>
        Back
      </button>
      <button className="rbc-btn" onClick={() => navigate("next")}>
        Next
      </button>
    </div>
  );

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
      <div className="calendar-container" style={{ height: "80vh" }}>
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          onNavigate={(date) => setSelectedDate(date)}
          defaultView={Views.MONTH}
          views={["month", "week", "day"]}
          date={selectedDate}
          view={view}
          onView={setView}
          step={15} // Each slot represents 15 minutes
          timeslots={1} // Show one timeslot per step, meaning every 15 minutes
          components={{ toolbar: CustomToolbar }}
        />
      </div>
    </section>
  );
};

export default Events;
