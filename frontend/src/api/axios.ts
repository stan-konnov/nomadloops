import axios from 'axios';

export const api = axios.create({
  headers: { 'Content-Type': 'application/json' },
  baseURL: `${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VER}`,
});

// Unwrap the response data
api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
);
