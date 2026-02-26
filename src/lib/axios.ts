import axios from "axios";
import { authService } from "../services/authService";

axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axios;
