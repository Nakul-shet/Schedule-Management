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
  const { patientId } = useParams(); // Fetch the patientId from the URL

  const [paymentDetails, setPaymentDetails] = useState({
    treatmentAmount: "",
    paymentMade: "",
    paymentPending: "",
    paymentDate: moment().format("YYYY-MM-DD"), // Default to today's date
  });

  // Fetch existing payment details when the component mounts
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const { data } = await axios.get(
          `${CONFIG.runEndpoint.backendUrl}/patient/paymentDetails/${patientId}`,
          { withCredentials: true }
        );
        setPaymentDetails({
          treatmentAmount: data.treatmentAmount || "",
          paymentMade: data.paymentMade || "",
          paymentPending: data.paymentPending || "",
          paymentDate: data.paymentDate
            ? moment(data.paymentDate).format("YYYY-MM-DD")
            : moment().format("YYYY-MM-DD"),
        });
      } catch (error) {
        toast.error("Error fetching payment details.");
      }
    };

    fetchPaymentDetails();
  }, [patientId]);

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
      navigate("/patients"); // Redirect back to the patients list after update
    } catch (error) {
      toast.error("Error updating payment.");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <section className="page">
      <section className="container form-component add-admin-form">
        <h1 className="form-title">Update Payment for Patient: {patientId}</h1>

        <form onSubmit={handlePaymentUpdate}>
          {/* Payment Details */}
          <div className="form-group">
            <input
              type="number"
              name="treatmentAmount"
              placeholder="Treatment Amount"
              value={paymentDetails.treatmentAmount}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              name="paymentMade"
              placeholder="Payment Made"
              value={paymentDetails.paymentMade}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              name="paymentPending"
              placeholder="Payment Pending"
              value={paymentDetails.paymentPending}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="date"
              name="paymentDate"
              placeholder="Payment Date"
              value={paymentDetails.paymentDate}
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
    </section>
  );
};

export default PaymentUpdate;
