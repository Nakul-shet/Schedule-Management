import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import { FaTimes, FaCheck, FaHourglassHalf } from "react-icons/fa"; // Icons for status
import { MdSmsFailed } from "react-icons/md";
import { TiTick } from "react-icons/ti";

const sampleMessages = [
  {
    _id: "1",
    sentDate: "2024-10-01T14:30:00Z", // UTC format
    template: "Appointment Reminder",
    confirmation: 0,
    replyDate: "2024-10-02T09:00:00Z", // UTC format
    smsSent: 1,
  },
  {
    _id: "2",
    sentDate: "2024-10-02T15:00:00Z",
    template: "Follow-up Reminder",
    confirmation: 1,
    replyDate: "2024-10-03T11:00:00Z",
    smsSent: 0,
  },
  {
    _id: "3",
    sentDate: "2024-10-03T12:00:00Z",
    template: "Billing Reminder",
    confirmation: 2,
    replyDate: "2024-10-04T08:30:00Z",
    smsSent: 1,
  },
  {
    _id: "4",
    sentDate: "2024-10-04T09:00:00Z",
    template: "Check-up Reminder",
    confirmation: 0,
    replyDate: "2024-10-05T13:00:00Z",
    smsSent: 0,
  },
  {
    _id: "5",
    sentDate: "2024-10-05T14:00:00Z",
    template: "Follow-up Reminder",
    confirmation: 1,
    replyDate: "2024-10-06T09:15:00Z",
    smsSent: 1,
  },
  {
    _id: "1",
    sentDate: "2024-10-01T14:30:00Z", // UTC format
    template: "Appointment Reminder",
    confirmation: 0,
    replyDate: "2024-10-02T09:00:00Z", // UTC format
    smsSent: 1,
  },
  {
    _id: "2",
    sentDate: "2024-10-02T15:00:00Z",
    template: "Follow-up Reminder",
    confirmation: 1,
    replyDate: "2024-10-03T11:00:00Z",
    smsSent: 0,
  },
  {
    _id: "3",
    sentDate: "2024-10-03T12:00:00Z",
    template: "Billing Reminder",
    confirmation: 2,
    replyDate: "2024-10-04T08:30:00Z",
    smsSent: 1,
  },
  {
    _id: "4",
    sentDate: "2024-10-04T09:00:00Z",
    template: "Check-up Reminder",
    confirmation: 0,
    replyDate: "2024-10-05T13:00:00Z",
    smsSent: 0,
  },
  {
    _id: "5",
    sentDate: "2024-10-05T14:00:00Z",
    template: "Follow-up Reminder",
    confirmation: 1,
    replyDate: "2024-10-06T09:15:00Z",
    smsSent: 1,
  },
  {
    _id: "1",
    sentDate: "2024-10-01T14:30:00Z", // UTC format
    template: "Appointment Reminder",
    confirmation: 0,
    replyDate: "2024-10-02T09:00:00Z", // UTC format
    smsSent: 1,
  },
  {
    _id: "2",
    sentDate: "2024-10-02T15:00:00Z",
    template: "Follow-up Reminder",
    confirmation: 1,
    replyDate: "2024-10-03T11:00:00Z",
    smsSent: 0,
  },
  {
    _id: "3",
    sentDate: "2024-10-03T12:00:00Z",
    template: "Billing Reminder",
    confirmation: 2,
    replyDate: "2024-10-04T08:30:00Z",
    smsSent: 1,
  },
  {
    _id: "4",
    sentDate: "2024-10-04T09:00:00Z",
    template: "Check-up Reminder",
    confirmation: 0,
    replyDate: "2024-10-05T13:00:00Z",
    smsSent: 0,
  },
  {
    _id: "5",
    sentDate: "2024-10-05T14:00:00Z",
    template: "Follow-up Reminder",
    confirmation: 1,
    replyDate: "2024-10-06T09:15:00Z",
    smsSent: 1,
  },
  {
    _id: "1",
    sentDate: "2024-10-01T14:30:00Z", // UTC format
    template: "Appointment Reminder",
    confirmation: 0,
    replyDate: "2024-10-02T09:00:00Z", // UTC format
    smsSent: 1,
  },
  {
    _id: "2",
    sentDate: "2024-10-02T15:00:00Z",
    template: "Follow-up Reminder",
    confirmation: 1,
    replyDate: "2024-10-03T11:00:00Z",
    smsSent: 0,
  },
  {
    _id: "3",
    sentDate: "2024-10-03T12:00:00Z",
    template: "Billing Reminder",
    confirmation: 2,
    replyDate: "2024-10-04T08:30:00Z",
    smsSent: 1,
  },
  {
    _id: "4",
    sentDate: "2024-10-04T09:00:00Z",
    template: "Check-up Reminder",
    confirmation: 0,
    replyDate: "2024-10-05T13:00:00Z",
    smsSent: 0,
  },
  {
    _id: "5",
    sentDate: "2024-10-05T14:00:00Z",
    template: "Follow-up Reminder",
    confirmation: 1,
    replyDate: "2024-10-06T09:15:00Z",
    smsSent: 1,
  },
  {
    _id: "1",
    sentDate: "2024-10-01T14:30:00Z", // UTC format
    template: "Appointment Reminder",
    confirmation: 0,
    replyDate: "2024-10-02T09:00:00Z", // UTC format
    smsSent: 1,
  },
  {
    _id: "2",
    sentDate: "2024-10-02T15:00:00Z",
    template: "Follow-up Reminder",
    confirmation: 1,
    replyDate: "2024-10-03T11:00:00Z",
    smsSent: 0,
  },
  {
    _id: "3",
    sentDate: "2024-10-03T12:00:00Z",
    template: "Billing Reminder",
    confirmation: 2,
    replyDate: "2024-10-04T08:30:00Z",
    smsSent: 1,
  },
  {
    _id: "4",
    sentDate: "2024-10-04T09:00:00Z",
    template: "Check-up Reminder",
    confirmation: 0,
    replyDate: "2024-10-05T13:00:00Z",
    smsSent: 0,
  },
  {
    _id: "5",
    sentDate: "2024-10-05T14:00:00Z",
    template: "Follow-up Reminder",
    confirmation: 1,
    replyDate: "2024-10-06T09:15:00Z",
    smsSent: 1,
  },
  {
    _id: "1",
    sentDate: "2024-10-01T14:30:00Z", // UTC format
    template: "Appointment Reminder",
    confirmation: 0,
    replyDate: "2024-10-02T09:00:00Z", // UTC format
    smsSent: 1,
  },
  {
    _id: "2",
    sentDate: "2024-10-02T15:00:00Z",
    template: "Follow-up Reminder",
    confirmation: 1,
    replyDate: "2024-10-03T11:00:00Z",
    smsSent: 0,
  },
  {
    _id: "3",
    sentDate: "2024-10-03T12:00:00Z",
    template: "Billing Reminder",
    confirmation: 2,
    replyDate: "2024-10-04T08:30:00Z",
    smsSent: 1,
  },
  {
    _id: "4",
    sentDate: "2024-10-04T09:00:00Z",
    template: "Check-up Reminder",
    confirmation: 0,
    replyDate: "2024-10-05T13:00:00Z",
    smsSent: 0,
  },
  {
    _id: "5",
    sentDate: "2024-10-05T14:00:00Z",
    template: "Follow-up Reminder",
    confirmation: 1,
    replyDate: "2024-10-06T09:15:00Z",
    smsSent: 1,
  },
];

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [messagesPerPage, setMessagesPerPage] = useState(10); // Pagination limit

  const { isAuthenticated } = useContext(Context);

  // Using sample messages data for testing
  useEffect(() => {
    setMessages(sampleMessages); // Replace with API call in production
  }, []);

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

  const renderSmsSentIcon = (smsSent) => {
    return smsSent ? (
      <FaCheck title="SMS Sent" style={{ color: "green" }} />
    ) : (
      <MdSmsFailed title="SMS Not Sent" style={{ color: "gray" }} />
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
        <table className="message-table">
          <thead>
            <tr>
              <th>Sent Date</th>
              <th>Message Template</th>
              <th>Confirmation</th>
              <th>SMS</th>
            </tr>
          </thead>
          <tbody>
            {currentMessages && currentMessages.length > 0 ? (
              currentMessages.map((message) => (
                <tr key={message._id}>
                  <td title={formatTime(message.sentDate)}>
                    {formatDate(message.sentDate)}
                  </td>
                  <td>{message.template}</td>
                  <td>
                    {renderConfirmationIcon(
                      message.confirmation,
                      message.replyDate
                    )}
                  </td>
                  <td>{renderSmsSentIcon(message.smsSent)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No Messages!</td>
              </tr>
            )}
          </tbody>
        </table>

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
