import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Context } from "../main";
import { CONFIG } from "../config";
import moment from "moment";

const PaymentUpdate = () => {
  const { isAuthenticated } = useContext(Context);
  const navigate = useNavigate();
  const { patientId } = useParams();

  const [paymentDetails, setPaymentDetails] = useState({
    treatmentAmount: "",
    paymentMade: "",
    paymentPending: "",
    paymentDate: moment().format("YYYY-MM-DD"),
  });

  const [initialPendingAmount, setInitialPendingAmount] = useState(0);

  const [paymentHistory, setPaymentHistory] = useState([
    {
      paymentDate: "2023-09-01",
      treatmentAmount: 13000,
      paymentMade: 5000,
      paymentPending: 5000,
    },
    {
      paymentDate: "2023-10-05",
      treatmentAmount: 12000,
      paymentMade: 2000,
      paymentPending: 3000,
    },
    {
      paymentDate: "2023-11-05",
      treatmentAmount: 11000,
      paymentMade: 1200,
      paymentPending: 1800,
    },
    {
      paymentDate: "2023-09-01",
      treatmentAmount: 13000,
      paymentMade: 5000,
      paymentPending: 5000,
    },
    {
      paymentDate: "2023-10-05",
      treatmentAmount: 12000,
      paymentMade: 2000,
      paymentPending: 3000,
    },
    {
      paymentDate: "2023-11-05",
      treatmentAmount: 11000,
      paymentMade: 1200,
      paymentPending: 1800,
    },
    {
      paymentDate: "2023-09-01",
      treatmentAmount: 13000,
      paymentMade: 5000,
      paymentPending: 5000,
    },
    {
      paymentDate: "2023-10-05",
      treatmentAmount: 12000,
      paymentMade: 2000,
      paymentPending: 3000,
    },
    {
      paymentDate: "2023-11-05",
      treatmentAmount: 11000,
      paymentMade: 1200,
      paymentPending: 1800,
    },
    {
      paymentDate: "2023-09-01",
      treatmentAmount: 13000,
      paymentMade: 5000,
      paymentPending: 5000,
    },
    {
      paymentDate: "2023-10-05",
      treatmentAmount: 12000,
      paymentMade: 2000,
      paymentPending: 3000,
    },
    {
      paymentDate: "2023-11-05",
      treatmentAmount: 11000,
      paymentMade: 1200,
      paymentPending: 1800,
    },
  ]);

  // Set initial values from the latest payment history
  useEffect(() => {
    const latestPayment = [...paymentHistory].sort(
      (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)
    )[0];

    if (latestPayment) {
      setPaymentDetails({
        treatmentAmount: latestPayment.treatmentAmount,
        paymentMade: "",
        paymentPending: latestPayment.paymentPending,
        paymentDate: moment(latestPayment.paymentDate).format("YYYY-MM-DD"),
      });
      setInitialPendingAmount(latestPayment.paymentPending);
    }
  }, [patientId, paymentHistory]);

  // Update `paymentPending` whenever `paymentMade` changes
  useEffect(() => {
    setPaymentDetails((prevDetails) => ({
      ...prevDetails,
    }));
  }, [
    paymentDetails.paymentMade,
    paymentDetails.treatmentAmount,
    initialPendingAmount,
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handlePaymentUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `${CONFIG.runEndpoint.backendUrl}/patient/updatePayment`,
        {
          patientId,
          ...paymentDetails,
        },
        { withCredentials: true }
      );
      toast.success("Payment updated successfully.");
      navigate("/patients");
    } catch (error) {
      toast.error("Error updating payment.");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Sort payment history by date in ascending order
  const sortedPaymentHistory = [...paymentHistory].sort((a, b) => {
    return new Date(b.paymentDate) - new Date(a.paymentDate);
  });

  return (
    <section className="page">
      <section
        className="container form-component add-admin-form"
        style={{ minHeight: 0, paddingBottom: 0 }}
      >
        <h1
          className="form-title"
          style={{ display: "flex", alignItems: "center", gap: "5px" }}
        >
          Update Payment of <h5 style={{ margin: 0 }}>{patientId}</h5> |
          Pending:
          <h5 style={{ margin: 0 }}>{paymentDetails.paymentPending}</h5>
        </h1>

        <form onSubmit={handlePaymentUpdate}>
          <div className="form-group">
            <div className="input-wrapper">
              <label className="floating-label">Treatment Amount</label>
              <input
                type="number"
                name="treatmentAmount"
                placeholder="Treatment Amount"
                value={paymentDetails.treatmentAmount}
                onChange={handleInputChange}
                required
              />
            </div>
            <input
              type="number"
              name="paymentMade"
              placeholder="Payment Made"
              value={paymentDetails.paymentMade}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group" style={{ textAlign: "center" }}>
            <button type="submit" className="submit-btn">
              Update Payment
            </button>
          </div>
        </form>
      </section>
      {/* Display Payment History */}
      <section className="payment-history">
        <h2>Payment History</h2>
        {sortedPaymentHistory.length > 0 ? (
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Treatment Amount</th>
                <th>Payment Made</th>
                <th>Payment Pending</th>
              </tr>
            </thead>
            <tbody>
              {sortedPaymentHistory.map((entry, index) => (
                <tr key={index}>
                  <td>{moment(entry.paymentDate).format("DD-MM-YYYY")}</td>
                  <td>{entry.treatmentAmount}</td>
                  <td>{entry.paymentMade}</td>
                  <td>{entry.paymentPending}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No payment history available.</p>
        )}
      </section>
    </section>
  );
};

export default PaymentUpdate;
