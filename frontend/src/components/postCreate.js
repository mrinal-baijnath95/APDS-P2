import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function CreatePost() {
  const [form, setForm] = useState({ user: "", content: "", image: "" });
  const [imagePreview, setImagePreview] = useState(null); // Store the image preview
  const [csrfToken, setCsrfToken] = useState(""); // Store the CSRF token
  const [isLoading, setIsLoading] = useState(false); // Loading state for API request
  const navigate = useNavigate();

  // Retrieve CSRF token and user from local storage
  useEffect(() => {
    const savedUser = localStorage.getItem("name");
    if (savedUser) {
      setForm((prev) => ({ ...prev, user: savedUser }));
    } else {
      navigate("/login");
    }

    // Fetch CSRF token
    async function fetchCsrfToken() {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/csrf-token`, {
          credentials: "include",
        });
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        window.alert("Failed to fetch CSRF token.");
      }
    }

    fetchCsrfToken();
  }, [navigate]);

  // Handle image file change
  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        setForm((prev) => ({ ...prev, image: base64String }));
        setImagePreview(reader.result); // Show image preview
      };
      reader.readAsDataURL(file);
    }
  }

  // Function to handle form submission
  async function onSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("jwt");
    const newPost = { user: form.user, content: form.content, image: form.image };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/posts/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "CSRF-Token": csrfToken, // Include CSRF token in headers
        },
        credentials: "include", // Required for sending cookies across domains
        body: JSON.stringify(newPost),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Network response was not ok");
      }

      const result = await response.json();
      console.log("Post created:", result);
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      setIsLoading(false);
      window.alert("Failed to create post: " + error.message);
    }
  }

  return (
    <div className="container">
      <h3 className="header">Create New Post</h3>
      <form onSubmit={onSubmit} className="form">
        <div className="form-group">
          <label htmlFor="user">User</label>
          <input type="text" className="form-control" id="user" value={form.user} disabled />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <input
            type="text"
            className="form-control"
            id="content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input type="file" className="form-control" id="image" accept="image/*" onChange={handleImageChange} />
        </div>
        {imagePreview && (
          <div className="form-group">
            <label>Image Preview:</label>
            <img src={imagePreview} alt="Preview" style={{ maxHeight: "200px" }} />
          </div>
        )}
        <div className="form-group">
          <input type="submit" value={isLoading ? "Creating Post..." : "Create Post"} className="btn btn-primary" disabled={isLoading} />
        </div>
      </form>
    </div>
  );
}
