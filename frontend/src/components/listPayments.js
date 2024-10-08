import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ListPayments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    fetch(`${process.env.REACT_APP_API_URL}/payments`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setPayments(data))
      .catch((error) => window.alert(`Failed to fetch payments: ${error}`));
  }, []);

  return (
    <div className="container">
      <h3>All Payments</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment._id}>
              <td>{payment.orderId}</td>
              <td>{payment.customerName}</td>
              <td>{payment.amount}</td>
              <td>{payment.status}</td>
              <td>
                <Link to={`/payments/${payment._id}`} className="btn btn-info">View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
