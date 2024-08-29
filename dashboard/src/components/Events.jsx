import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../static/calendar.css";

// Create a localizer using moment.js
const localizer = momentLocalizer(moment);

const Events = () => {
  const [events, setEvents] = useState([]);
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/events",
          { withCredentials: true }
        );
        // Assuming the events data is an array of objects with start and end dates
        setEvents(data.events);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching events");
      }
    };
    fetchEvents();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  // Convert events to the format required by react-big-calendar
  const calendarEvents = events.map((event) => ({
    title: event.title,
    start: new Date(event.startDate), // Assuming startDate is in ISO format
    end: new Date(event.endDate), // Assuming endDate is in ISO format
    // Optionally, you can add other properties like description, location, etc.
  }));

  return (
    <section className="page events">
      <h1>Events</h1>
      <div style={{ height: "80vh" }}>
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          // Optionally, you can customize the Calendar component with additional props if needed
          // Example:
          // views={['month', 'week']}
          // defaultView='month'
          // onSelectEvent={event => alert(event.title)}
        />
      </div>
    </section>
  );
};

export default Events;
