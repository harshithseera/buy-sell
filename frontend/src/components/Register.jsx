import { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    contactNumber: "",
    password: ""
  });
  
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, form);
      alert("Registration successful! You can now log in.");
    } catch (err) {
      // If the server sends an error message, display it
      const message = err.response?.data?.error || "Error registering user";
      setError(message);
      console.error("Error registering user:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form className="p-6 bg-white rounded shadow-md w-96" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="text"
          placeholder="First Name"
          className="w-full p-2 border mb-3"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          className="w-full p-2 border mb-3"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email (must end with @iiit.ac.in)"
          className="w-full p-2 border mb-3"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Age"
          className="w-full p-2 border mb-3"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />
        <input
          type="text"
          placeholder="Contact Number"
          className="w-full p-2 border mb-3"
          value={form.contactNumber}
          onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-3"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button className="bg-green-500 text-white w-full p-2 rounded" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}
