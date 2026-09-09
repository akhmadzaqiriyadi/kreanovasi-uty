import type { AxiosInstance } from "axios";
import axios from "axios";
import { env } from "@/lib/env";

// In-memory token storage references for client-side routing
let _accessToken: string | null = null;
let _refreshSubscribers: Array<(token: string) => void> = [];
let _isRefreshing = false;

export function setLocalAccessToken(token: string | null) {
  _accessToken = token;
}

function dispatchLoadingStart() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("api-request-start"));
  }
}

function dispatchLoadingEnd() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("api-request-end"));
  }
}

const apiClient: AxiosInstance = axios.create({
  baseURL:
    typeof window !== "undefined"
      ? "/api-proxy"
      : env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Attach access token from memory if present
apiClient.interceptors.request.use(
  (config) => {
    dispatchLoadingStart();
    if (_accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${_accessToken}`;
    }
    return config;
  },
  (error) => {
    dispatchLoadingEnd();
    return Promise.reject(error);
  },
);

// Response interceptor: Capture 401 errors and refresh token silently
apiClient.interceptors.response.use(
  (response) => {
    dispatchLoadingEnd();
    return response;
  },
  async (error) => {
    dispatchLoadingEnd();
    const originalRequest = error.config;
    const isAuthRequest =
      originalRequest?.url?.includes("auth/login") ||
      originalRequest?.url?.includes("auth/refresh") ||
      originalRequest?.url?.includes("auth/logout");

    // Check if error is 401 and request has not been retried yet, and not an auth request
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      originalRequest._retry = true;

      if (typeof window === "undefined") {
        // If on the server (RSC), we don't have access to browser in-memory token state
        return Promise.reject(error);
      }

      // If a refresh is already in progress, queue up requests
      if (_isRefreshing) {
        return new Promise((resolve) => {
          _refreshSubscribers.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      _isRefreshing = true;

      try {
        // Perform silent token refresh
        // This goes through /api-proxy which propagates the HttpOnly refresh_token cookie
        const response = await axios.post(
          "/api-proxy/auth/refresh",
          {},
          { headers: { "Content-Type": "application/json" } },
        );

        const { accessToken } = response.data;
        setLocalAccessToken(accessToken);

        // Update header and broadcast to subscribers
        apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        for (const callback of _refreshSubscribers) callback(accessToken);
        _refreshSubscribers = [];

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear token memory and reject request
        setLocalAccessToken(null);
        _refreshSubscribers = [];

        // Re-trigger redirect or context cleanup from UI side by propagating 401
        return Promise.reject(refreshError);
      } finally {
        _isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
