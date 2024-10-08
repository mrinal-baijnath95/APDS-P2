import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreatePayment() {
  const [form, setForm] = useState({ customerName: "", amount: "", paymentMethod: "", orderId: "" });
  const navigate = useNavigate();

  function updateForm(value) {
    return setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("jwt");

    const newPayment = { ...form };

    await fetch(`${process.env.REACT_APP_API_URL}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(newPayment),
    })
      .then((response) => response.json())
      .then((data) => {
        window.alert("Payment request created successfully!");
        navigate("/payments");
      })
      .catch((error) => window.alert(`Failed to create payment: ${error}`));
  }

  return (
    <div className="container">
      <h3>Create New Payment</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Customer Name</label>
          <input
            type="text"
            className="form-control"
            value={form.customerName}
            onChange={(e) => updateForm({ customerName: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            className="form-control"
            value={form.amount}
            onChange={(e) => updateForm({ amount: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Payment Method</label>
          <input
            type="text"
            className="form-control"
            value={form.paymentMethod}
            onChange={(e) => updateForm({ paymentMethod: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Order ID</label>
          <input
            type="text"
            className="form-control"
            value={form.orderId}
            onChange={(e) => updateForm({ orderId: e.target.value })}
          />
        </div>
        <div className="form-group">
          <input type="submit" value="Create Payment" className="btn btn-primary" />
        </div>
      </form>
    </div>
  );
}
