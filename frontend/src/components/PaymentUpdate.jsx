import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Context } from "../main";
import { CONFIG } from "../config";
import moment from "moment";
import { DateLocalizer } from "react-big-calendar";

const PaymentUpdate = () => {
  const { isAuthenticated } = useContext(Context);
  const navigate = useNavigate();
  const { patientId } = useParams();

  const [paymentData , setPaymentdata] = useState({});

  const [paymentMade, setPaymentMade] = useState(0);

  const [paymentHistory, setPaymentHistory] = useState([
    {
      paymentDate: "2023-09-01",
      treatmentAmount: 25000,
      paymentMade: 1800,
      paymentPending: 1300,
    }
  ]);

  useEffect(() => {
    const getPaymentDetails = async () => {
      try {
        const {data} = await axios.get(
          `${CONFIG.runEndpoint.backendUrl}/payment/getPaymentDetails/${patientId}`,
          { withCredentials: true }
        );
        setPaymentdata(data);
      } catch (error) {
        toast.error("Error Getting payment detials");
      }
    };

    getPaymentDetails()
  } , [patientId])

  useEffect(() => {
    console.log('Updated paymentData:', paymentData);
  }, [paymentData]);

  const handlePaymentUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `${CONFIG.runEndpoint.backendUrl}/payment/updatePayment`,
        {
          patientId,
          amount : Number(paymentMade)
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

  //Calculate Payment Pending
  const paymentPending = () => {
    return paymentData.treatmentAmount - paymentData.paymentMade;
  }

  return (
    <section className="page">
      <section
        className="container form-component add-admin-form"
        style={{ minHeight: 0, paddingBottom: 0 }}
      >
        <h1
          className="form-title"
          style={{ display: "flex", alignItems: "center", gap: "5px"}}
        >
          Update Payment for <h5 style={{ margin: 0 , color : "green" }}>{patientId}</h5> |
          Pending:
          <h5 style={{ margin: 0 , color : "red"}}>{paymentPending()}</h5>
        </h1>

        <form onSubmit={handlePaymentUpdate}>
          <div className="form-group">
            <div className="input-wrapper">
              <label className="floating-label">Treatment Amount</label>
              <input
                type="number"
                name="treatmentAmount"
                placeholder="Treatment Amount"
                value={paymentData.treatmentAmount}
                readOnly
              />
            </div>
            <input
              type="number"
              name="paymentMade"
              placeholder="Payment Made"
              onChange={(e) => setPaymentMade(e.target.value)}
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
        {paymentData.paymentdate?.length > 0 ? (
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {paymentData.paymentdate.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.dateOnly3}</td>
                  <td>{entry.newPayment}</td>
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
