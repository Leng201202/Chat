import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true, // if using cookie auth
  headers: {
    "Content-Type": "application/json",
  },
});