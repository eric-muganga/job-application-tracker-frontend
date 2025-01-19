import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "https://localhost:44348/api", // Set your API base URL
});

// Add a request interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken"); // Get the token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Attach the token to the Authorization header
  }
  return config;
});

// Handle token expiration globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
