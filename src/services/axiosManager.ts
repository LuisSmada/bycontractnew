import axios from "axios";

const axiosManager = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  timeout: 10000,
});

export default axiosManager;
