// api.js
import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL,
});

console.log('API Base URL:', baseURL);

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('access_token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('JWT token is missing from sessionStorage!');
  }
  
  return config;
});

export default api;
