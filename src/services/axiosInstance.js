import axios from "axios";

// Dynamically set the base URL based on the environment
const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_API_URL // Use production URL
    : process.env.REACT_APP_DEV_API_URL; // Use development URL

console.log("Environment:", process.env.NODE_ENV);
console.log("Production API URL:", process.env.REACT_APP_PROD_API_URL);
console.log("Axios Base URL:", baseURL); // Debugging: Log the selected base URL

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token in headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;