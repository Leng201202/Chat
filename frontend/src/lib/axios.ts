import axios from "axios";

// Use environment variables or determine base URL based on environment
const apiBaseUrl = import.meta.env.VITE_API_URL || 
                  (import.meta.env.MODE === 'development' 
                    ? 'http://localhost:8000' // Development - connect to local backend
                    : ''); // Production - use relative URL (deployed alongside frontend)

export const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});