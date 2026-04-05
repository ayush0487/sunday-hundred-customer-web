import axios from "axios";

const serverApi = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default serverApi;
