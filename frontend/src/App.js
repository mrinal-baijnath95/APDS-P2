import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Import existing components
import Navbar from "./components/navbar.js";
import PostList from "./components/postList.js";
import EditPost from "./components/postEdit.js";
import CreatePost from "./components/postCreate.js";
import Register from "./components/register.js";
import Login from "./components/login.js";

// Import new payment components
import CreatePayment from "./components/createPayment.js";
import ViewPayment from "./components/viewPayment.js";
import ListPayments from "./components/listPayments.js";

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          {/* Default page set to Login */}
          <Route exact path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Posts Routes */}
          <Route path="/posts" element={<PostList />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/edit/:id" element={<EditPost />} />

          {/* New Payment Routes */}
          <Route path="/payments" element={<ListPayments />} />
          <Route path="/payments/create" element={<CreatePayment />} />
          <Route path="/payments/:id" element={<ViewPayment />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
