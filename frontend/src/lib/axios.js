import axios from "axios";

let notify = null;
export const setApiNotifier = (callback) => {
  notify = callback;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("triagesync_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toLowerCase();
    if (
      ["post", "put", "patch", "delete"].includes(method) &&
      response.config.headers?.["X-Skip-Success-Toast"] !== "true"
    ) {
      notify?.(
        response.data?.message || "Changes saved successfully.",
        "success",
      );
    }
    return response;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error?.message ||
      error.message ||
      "Something went wrong.";
    if (
      error.config?.url !== "/auth/login" &&
      error.config?.url !== "/auth/register"
    )
      notify?.(message, "error");
    if (error.response?.status === 401) {
      localStorage.removeItem("triagesync_token");
      localStorage.removeItem("triagesync_user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
