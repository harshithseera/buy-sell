// src/utils/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import React from "react";
export default function PrivateRoute() {
  const { user,loading } = useContext(AuthContext);
  // If user is not authenticated, redirect to /login; otherwise, render nested routes.
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
