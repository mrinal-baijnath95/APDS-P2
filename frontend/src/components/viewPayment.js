import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ViewPayment() {
  const [payment, setPayment] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    fetch(`${process.env.REACT_APP_API_URL}/payments/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setPayment(data))
      .catch((error) => window.alert(`Failed to fetch payment details: ${error}`));
  }, [id]);

  return payment ? (
    <div className="container">
      <h3>Payment Details</h3>
      <p><strong>Customer Name:</strong> {payment.customerName}</p>
      <p><strong>Amount:</strong> {payment.amount}</p>
      <p><strong>Payment Method:</strong> {payment.paymentMethod}</p>
      <p><strong>Order ID:</strong> {payment.orderId}</p>
      <p><strong>Status:</strong> {payment.status}</p>
      <p><strong>Created At:</strong> {new Date(payment.createdAt).toLocaleString()}</p>
    </div>
  ) : (
    <div>Loading...</div>
  );
}
