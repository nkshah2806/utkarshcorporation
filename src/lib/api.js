import axios from "axios";
import { startLoading, stopLoading } from "./globalLoading";

export const BACKEND_URL = import.meta.env.VITE_API_URL || "https://uttkarsh-backend.onrender.com";
export const API = `${BACKEND_URL}/api`;

/**
 * Resolve a server-relative media reference (`/uploads/<folder>/<file>`) to a
 * full URL the browser can load. Legacy external URLs pass through untouched.
 */
export function mediaSrc(value) {
  if (!value) return "";
  if (/^https?:\/\//.test(value)) return value;
  if (value.startsWith("/uploads/")) return `${BACKEND_URL}${value}`;
  return value;
}

const api = axios.create({ baseURL: API });

// Track requests that should drive the global loader. Background calls (for
// example on-demand translation batches) opt out via `{ silent: true }`.
const isSilent = (config) => Boolean(config && config.silent) || config?.headers?.["X-Silent"] === "1";

// Attach bearer token from localStorage and report loading state.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("uc_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (!isSilent(config)) {
    config.__globalLoadingTracked = true;
    startLoading();
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response?.config?.__globalLoadingTracked) stopLoading();
    return response;
  },
  (error) => {
    if (error?.config?.__globalLoadingTracked) stopLoading();
    return Promise.reject(error);
  }
);

export function formatApiError(err) {
  const payload = err?.response?.data;
  const detail = payload?.detail || payload?.message || payload?.error;
  if (detail == null) return err?.message || "Something went wrong.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export default api;
