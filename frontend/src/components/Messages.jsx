import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import { GlobalContext } from "./GlobalVarOfLocation";
import { FaTimes, FaCheck, FaHourglassHalf } from "react-icons/fa"; // Icons for status
import { MdSmsFailed } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { CONFIG } from "../config";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [messagesPerPage, setMessagesPerPage] = useState(10); // Pagination limit
  const { isAuthenticated } = useContext(Context);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const { globalVariable } = useContext(GlobalContext);

  // Fetch messages from the API
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${CONFIG.runEndpoint.backendUrl}/whatsapp/getNotifications/${globalVariable}`, {
          withCredentials: true
        });
        setMessages(response.data); // Access the data inside response.data
      } catch (error) {
        setError("Error fetching notifications."); // Handle error
        toast.error("Error fetching notifications.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchMessages(); 
  }, [globalVariable]);
  
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  // Pagination logic
  const lastIndex = currentPage * messagesPerPage;
  const firstIndex = lastIndex - messagesPerPage;
  const currentMessages = messages.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(messages.length / messagesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderConfirmationIcon = (confirmation, replyDate) => {
    switch (confirmation) {
      case 0:
        return (
          <div>
            <FaTimes title="Rejected" style={{ color: "red" }} />
            <span className="date" title={formatTime(replyDate)}>
              {formatDate(replyDate)}
            </span>
          </div>
        );
      case 1:
        return (
          <div>
            <FaCheck title="Confirmed" style={{ color: "green" }} />
            <span className="date" title={formatTime(replyDate)}>
              {formatDate(replyDate)}
            </span>
          </div>
        );
      case 2:
        return (
          <div>
            <FaHourglassHalf title="Pending" style={{ color: "orange" }} />
          </div>
        );
      default:
        return null;
    }
  };

  function getTimeDifference(appointmentAt) {
    const appointmentDate = new Date(appointmentAt);
    const currentDate = new Date();
  
    // Check if the appointment is in the future
    if (appointmentDate <= currentDate) {
      return { days: 0, hours: 0 }; // Return zero if the appointment has passed or is the current time
    }
  
    const timeDifference = appointmentDate - currentDate;
  
    // Calculate the difference in days and hours
    const days = Math.floor(timeDifference / (1000 * 3600 * 24)); // Convert time difference to days
    const hours = Math.floor((timeDifference % (1000 * 3600 * 24)) / (1000 * 3600)); // Remaining hours after days
  
    return { days, hours };
  }

  const renderSmsSentIcon = (smsSent) => {
    return smsSent ? (
      <FaCheck title="Sent" style={{ color: "green" }} />
    ) : (
      <MdSmsFailed title="Not Sent" style={{ color: "gray" }} />
    );
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with zero if needed
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (0-based) and pad
    const year = date.getFullYear(); // Get full year
    return `${day}-${month}-${year}`; // Format as DD-MM-YYYY
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0"); // Pad minutes with zero if needed
    const ampm = hours >= 12 ? "PM" : "AM"; // Determine AM/PM
    hours = hours % 12; // Convert to 12-hour format
    hours = hours ? String(hours).padStart(2, "0") : "12"; // Pad hours with zero and handle 0 as 12
    return `${hours}:${minutes} ${ampm}`; // Format as hh:mm AM/PM
  };

  return (
    <section className="page messages">
      <h1>Sent Messages</h1>
      <div className="banner">
        {loading ? (
          <div>Loading...</div> // Display loading message
        ) : error ? (
          <div>{error}</div> // Display error message if fetching fails
        ) : (
          <table className="message-table">
            <thead>
              <tr>
                <th>Sent Date</th>
                <th>Patient</th>
                <th>Appointment On</th>
                <th>Appointment In</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentMessages && currentMessages.length > 0 ? (
                currentMessages.map((message) => {
                  const { days, hours } = getTimeDifference(message.appointmentAt);
                  const appointmentIn = (days!=0) ? `${days} days ${hours} hours` : (hours!=0) ? `${hours} hours` : "Done";
                  return (
                    <tr key={message._id}>
                      <td title={formatTime(message.sentdate)}>{formatDate(message.sentdate)}</td>
                      <td>{message.patientName} ({message.patientId})</td>
                      <td>{formatDate(message.appointmentAt)} {formatTime(message.appointmentAt)}</td>
                      <td>{appointmentIn}</td>
                      <td>{renderSmsSentIcon(message.status)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5">No Messages!</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Pagination Controls */}
        <div className="pagination-controls-container">
          <div className="pagination-controls">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={currentPage === index + 1 ? "active" : ""}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* Messages Per Page Selector */}
          <div className="messages-per-page">
            <label htmlFor="messagesPerPage">Messages per page: </label>
            <select
              id="messagesPerPage"
              value={messagesPerPage}
              onChange={(e) => setMessagesPerPage(parseInt(e.target.value))}
            >
              {[10, 20, 30].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Messages;
