import axios from "axios";

const api = axios.create({
  baseURL: "httpa://api.sundayhundred.com/api/v1",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true,
});

// Request interceptor – attach token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor – unwrap errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject({ message, status: error.response?.status, errors: error.response?.data?.errors });
  }
);

export default api;
