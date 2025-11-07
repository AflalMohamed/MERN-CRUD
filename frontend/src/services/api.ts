import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  // We keep the JSON default here, but will override it for files
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
 * Request Interceptor (Update this)
 */
api.interceptors.request.use(
  (config) => {
    // 1. Get the token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
     // 2. --- NEW: Check for FormData ---
    // If the data is FormData (meaning we're uploading a file)...
    if (config.data instanceof FormData) {
      // ...remove the 'Content-Type' header.
      // This forces axios/browser to set the correct 'multipart/form-data'
      // header with the correct 'boundary' string.
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;