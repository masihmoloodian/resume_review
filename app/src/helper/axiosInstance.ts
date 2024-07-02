import axios from "axios";
import { openErrorNotification } from "./notification";
import history from "./history";
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      setTimeout(() => {
        history.push("/login");
        window.location.reload();
      }, 1000);
    }
    if (!error.response || error.response.status === 500)
      openErrorNotification("Something went wrong");
    return Promise.reject(error);
  }
);

export default axiosInstance;
