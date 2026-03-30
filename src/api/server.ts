import axios from "axios";

const serverApi = axios.create({
  baseURL: "https://sundayhundred.com/api/v1",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default serverApi;
