import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Profile() {
  const { user, logout, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // If for some reason user is not in context, show a fallback
  if (!user) {
    return (
      <div className="flex flex-col items-center mt-10">
        <p>You must be logged in to view your profile.</p>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    firstName: user.user.firstName || "",
    lastName: user.user.lastName || "",
    email: user.user.email || "",
    contactNumber: user.user.contactNumber || "",
    age: user.user.age || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await axios.put(
        `${API_BASE_URL}/auth/update-profile`,
        formData,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      // Update AuthContext with the new user info
      setUser(res.data);
      alert("Profile updated successfully!");
      handleLogout();
    } catch (err) {
      console.error("Error updating profile:", err.response?.data || err.message);
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSave}>
        <div className="mb-2">
          <label className="block font-semibold">First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block font-semibold">Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block font-semibold">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block font-semibold">Contact Number:</label>
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-2">
          <label className="block font-semibold">Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex justify-between mt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </form>
    </div>
  );
}
