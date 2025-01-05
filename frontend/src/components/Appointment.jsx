import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { GlobalContext } from "./GlobalVarOfLocation";
import { useNavigate } from "react-router-dom";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import DatePicker from "react-datepicker";
import { IoPersonAddSharp } from "react-icons/io5";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import "../../static/calendar.css";
import { CONFIG } from "../config";
import Swal from "sweetalert2";

const localizer = momentLocalizer(moment);

const Events = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState(Views.MONTH);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { isAuthenticated } = useContext(Context);
  const { globalVariable } = useContext(GlobalContext);
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
          `${CONFIG.runEndpoint.backendUrl}/appointment/all/${globalVariable}`,
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
    Swal.fire({
      title: `Choose an action for Appointment`,
      text: `${event.title}`,
      showCancelButton: true,
      confirmButtonText: 'Completed',
      cancelButtonText: 'Remove',
      reverseButtons: true,
      focusCancel: true
    }).then((result) => {
      // Check if 'Completed' button is clicked (Confirm button)
      if (result.isConfirmed) {
        // Mark as completed
        updateAppointment(event.id)
          .then(() => {
            Swal.fire('Appointment marked as completed!', '', 'info');
          })
          .catch((error) => {
            Swal.fire('Failed to mark appointment as completed');
            console.log('error');
          });
      }
      // Check if 'Cancel' button is clicked (Cancel button)
      else if (result.dismiss === Swal.DismissReason.cancel) {
        // Call cancelAppointment if cancel button is clicked
        cancelAppointment(event.id)
          .then(() => {
             Swal.fire('Appointment canceled', '', 'info');
          })
          .catch((error) => {
            Swal.fire('Error', error?.message || 'Failed to cancel appointment', 'error');
          });
      }
    });
  };

  const handleSelectSlot = ({ start }) => {
    if (view === Views.MONTH) {
      // If the current view is Month, change to Day view on date click
      setSelectedDate(start);
      setView(Views.DAY);
    } else if (view === Views.DAY) {
      const currentDateTime = moment(); // Get the current date and time
  
      const date = moment(start).format("YYYY-MM-DD"); // Format start date as YYYY-MM-DD
      const time = moment(start).format("HH:mm"); // Format start time as HH:mm in 24-hour format
  
      const startDateTime = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm"); // Combine date and time for comparison
      console.log(111)
      // Check if the start time is ahead of the current time
      if (startDateTime.isAfter(currentDateTime)) {
        navigate(`/appointment/addnew?date=${date}&time=${time}`); // Navigate to the Add Appointment page
      } else {
        Swal.fire('', 'The selected time must be in the future.', 'info'); 
      }
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
      // Refetch events after the update to ensure the latest data
      const res = await axios.get(
        `${CONFIG.runEndpoint.backendUrl}/appointment`,
        { withCredentials: true }
      );
      setEvents(res.data); // Update state with the fetched data
    } catch (error) {
      console.error(
        error.response?.data?.message || "Error updating appointment.",
        '',
        'error'
      );
    }
  };

  const cancelAppointment = async (id) => {
    try {
      // Call the API to delete the appointment
      await axios.delete(
        `${CONFIG.runEndpoint.backendUrl}/appointment/deleteAppointment/${id}`,
        { withCredentials: true }
      );
      // Refetch events after the update to ensure the latest data
      const res = await axios.get(
        `${CONFIG.runEndpoint.backendUrl}/appointment`,
        { withCredentials: true }
      );
      setEvents(res.data); // Update state with the fetched data
    } catch (error) {
      console.error(
        error.response?.data?.message || "Error canceling appointment.",
        '',
        'error'
      );
    }
  };  

  const CustomToolbar = ({ label, onNavigate }) => (
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

      <button className="rbc-btn" onClick={() => onNavigate("PREV")}>
        Back
      </button>
      <button className="rbc-btn" onClick={() => onNavigate("TODAY")}>
        Today
      </button>
      <button className="rbc-btn" onClick={() => onNavigate("NEXT")}>
        Next
      </button>

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
