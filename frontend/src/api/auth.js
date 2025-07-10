import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const register = async (userData) => {
  return await axios.post(`${API_BASE_URL}/auth/register`, userData);
};

export const loginUser = async (userData) => {
  return await axios.post(`${API_BASE_URL}/auth/login`, userData);
};
