import axios from "axios"

const productionBaseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/v1`
  : "/api/v1";

const apiBaseURL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8080/api/v1"
    : productionBaseURL;

export const axiosInstance = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
  timeout: 45000,
});
