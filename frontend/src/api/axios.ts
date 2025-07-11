import axios from 'axios';

import { toSnakeCase } from '@src/utils/to.snake.case';

export const api = axios.create({
  headers: { 'Content-Type': 'application/json' },
  baseURL: `${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VER}`,
});

// Transform body keys to snake_case
api.interceptors.request.use(
  (config) => {
    if (config.data && typeof config.data === 'object') {
      config.data = toSnakeCase(config.data);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Unwrap the response data
api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
);
