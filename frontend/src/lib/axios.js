import axios from "axios";
import { SESSION_KEYS } from "../utils/constants";
import { getErrorMessage } from "../utils/formatters";
let notify = null;
export const setApiNotifier = (callback) => {
  notify = callback;
};
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(SESSION_KEYS.token);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const authRequest = ["/auth/login", "/auth/register"].includes(
      error.config?.url,
    );
    // Query errors are rendered beside their retry action; do not toast each retry.
    if (!authRequest && error.config?.method !== "get")
      notify?.(getErrorMessage(error), "error");
    if (error.response?.status === 401 && !authRequest) {
      localStorage.removeItem(SESSION_KEYS.token);
      localStorage.removeItem(SESSION_KEYS.user);
      if (window.location.pathname !== "/login")
        window.location.assign("/login");
    }
    return Promise.reject(error);
  },
);
export default api;
