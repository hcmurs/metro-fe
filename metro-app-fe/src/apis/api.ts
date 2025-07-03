import axios from "axios";
import { API_PATH } from "../constants/path";

const api = axios.create({
  baseURL: API_PATH.ORIGIN,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-API-KEY":
      "c761c9f0bb379612afbfd6ffeca90261db961bb93bce17728bc2a74430a66c0a",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      //Todo
    }
    return Promise.reject(error);
  }
);

export default api;
