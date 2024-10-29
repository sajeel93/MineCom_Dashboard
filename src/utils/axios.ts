// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:1337/api',
  baseURL: 'https://minecom-backend-apis-strapi.onrender.com/api', // Replace with your Strapi backend URL
  timeout: 10000, // Optional timeout setting
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token in every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle responses globally (optional)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle response errors globally (e.g., token expiration, network errors)
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access, token expiration, etc.
      console.error('Unauthorized access - possibly token expired');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
