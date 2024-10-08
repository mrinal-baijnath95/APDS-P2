import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ name: "", password: "" });
  const navigate = useNavigate();

  function updateForm(value) {
    return setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const newPerson = { ...form };

    try {
      console.log("Sending request to: ", `${process.env.REACT_APP_API_URL}/users/login`);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPerson),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText} (${response.status})`);
      }

      const data = await response.json();
      console.log("Login Response: ", data);
      const { token, name } = data;

      if (token && name) {
        localStorage.setItem("jwt", token);
        localStorage.setItem("name", name);
        navigate("/posts");
      } else {
        window.alert("Invalid response from server. Please try again.");
      }
    } catch (error) {
      console.error("Failed to login: ", error.message);
      window.alert(`Failed to login: ${error.message}`);
    }
  }

  return (
    <div>
      <h3>Login</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={form.password}
            onChange={(e) => updateForm({ password: e.target.value })}
          />
        </div>
        <div className="form-group">
          <input type="submit" value="Login" className="btn btn-primary" />
        </div>
      </form>
    </div>
  );
}
