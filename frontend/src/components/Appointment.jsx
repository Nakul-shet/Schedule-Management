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
      if (result.isConfirmed) {
        updateAppointment(event.id)
          .then(() => {
            Swal.fire('Appointment marked as completed!', '', 'info');
          })
          .catch((error) => {
            Swal.fire('Failed to mark appointment as completed');
            console.log('error');
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
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
      setSelectedDate(start);
      setView(Views.DAY);
    } else if (view === Views.DAY) {
      const currentDateTime = moment(); 
      const date = moment(start).format("YYYY-MM-DD");
      const time = moment(start).format("HH:mm");
      const startDateTime = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm");
      if (startDateTime.isAfter(currentDateTime)) {
        navigate(`/appointment/addnew?date=${date}&time=${time}`);
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
      const res = await axios.get(
        `${CONFIG.runEndpoint.backendUrl}/appointment`,
        { withCredentials: true }
      );
      setEvents(res.data);
    } catch (error) {
      console.error(error.response?.data?.message || "Error updating appointment.");
    }
  };

  const cancelAppointment = async (id) => {
    try {
      await axios.delete(
        `${CONFIG.runEndpoint.backendUrl}/appointment/deleteAppointment/${id}`,
        { withCredentials: true }
      );
      const res = await axios.get(
        `${CONFIG.runEndpoint.backendUrl}/appointment`,
        { withCredentials: true }
      );
      setEvents(res.data);
    } catch (error) {
      console.error(error.response?.data?.message || "Error canceling appointment.");
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
      <span className="rbc-toolbar-label" onClick={() => setShowDatePicker(true)}>
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
        <button className="add-patient-btn" onClick={gotoAddPatientsAppointment}>
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
          step={15}
          timeslots={1}
          components={{ toolbar: CustomToolbar }}
          scrollToTime={moment().toDate()} // Scroll to current time when on day view
        />
      </div>
    </section>
  );
};

export default Events;
