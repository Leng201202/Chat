import axios from "axios";

// Use environment variable if available, otherwise fallback to the hardcoded URL https://chatkie.onrender.com
const apiBaseUrl =  import.meta.env.MODE === 'production' ? 'http://localhost:8000/api' : "/api";

export const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});