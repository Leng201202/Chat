import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://chatkie.onrender.com/api",
  withCredentials: true, // if using cookie auth
  headers: {
    "Content-Type": "application/json",
  },
});