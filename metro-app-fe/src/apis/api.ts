import axios from 'axios';
import { API_PATH } from '../constants/path';

const api = axios.create({
  baseURL: API_PATH.ORIGIN,
  withCredentials: true,                
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      //Todo
    }
    return Promise.reject(error);
  }
);

export default api;