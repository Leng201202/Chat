import axios from "axios";

// Use environment variable if available, otherwise fallback to the hardcoded URL
const apiBaseUrl = import.meta.env.VITE_API_URL || "https://chatkie.onrender.com/api";

export const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});