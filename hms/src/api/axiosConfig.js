import axios from 'axios';

// Switch this to your deployed backend URL when going live!
const api = axios.create({
  // baseURL: 'http://localhost:5000/api', // Local Development
  baseURL: 'https://hostel-management-system-iota-blond.vercel.app/api', // Production URL (if backend is on Vercel)
});

// Request interceptor to add the auth token header to requests
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
