import axios from "axios";

// Use environment variable if available, otherwise fallback to the hardcoded URL
const apiBaseUrl =  "http://localhost:8000"; 
// "https://chatkie.onrender.com" || import.meta.env.VITE_API_URL 

export const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});