import axios from "axios";

const axiosManager = axios.create({
    baseURL: "http://192.168.0.41:3000/api/v1",
    timeout: 10000,
});

export default axiosManager;