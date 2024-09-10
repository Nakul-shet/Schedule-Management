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
  const [events, setEvents] = useState([{}]);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Track the selected date
  const [view, setView] = useState(Views.MONTH); // Track the calendar view (month/week/day)
  const { isAuthenticated } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page if not authenticated
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
    title: event.treatmentType,
    start: new Date(event.startTime),
    end: new Date(event.endTime),
  }));

  const handleSelectEvent = (event) => {
    setSelectedDate(event.start); // Set the selected date to the event's start date
    setView(Views.DAY); // Change the calendar view to "day"
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
          view={view} // Set the current view (either 'month', 'week', or 'day')
          onView={setView} // Handle view changes
        />
      </div>
    </section>
  );
};

export default Events;
