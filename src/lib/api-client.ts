import type { AxiosInstance } from "axios";
import axios from "axios";
import type { ApiEnvelope, BackendAuthResponse } from "@/types/auth";

// In-memory token storage references for client-side routing
let _accessToken: string | null = null;
let _refreshSubscribers: Array<(token: string) => void> = [];
let _isRefreshing = false;

// Initialize token from storage on client side if available
if (typeof window !== "undefined") {
  try {
    _accessToken = localStorage.getItem("uch_access_token");
  } catch {
    _accessToken = null;
  }
}

export function getLocalAccessToken(): string | null {
  if (!_accessToken && typeof window !== "undefined") {
    try {
      _accessToken = localStorage.getItem("uch_access_token");
    } catch {
      _accessToken = null;
    }
  }
  return _accessToken;
}

export function getLocalRefreshToken(): string | null {
  if (typeof window !== "undefined") {
    try {
      return localStorage.getItem("uch_refresh_token");
    } catch {
      return null;
    }
  }
  return null;
}

export function setLocalTokens(accessToken: string | null, refreshToken?: string | null) {
  _accessToken = accessToken;
  if (typeof window !== "undefined") {
    try {
      if (accessToken) {
        localStorage.setItem("uch_access_token", accessToken);
      } else {
        localStorage.removeItem("uch_access_token");
      }

      if (refreshToken !== undefined) {
        if (refreshToken) {
          localStorage.setItem("uch_refresh_token", refreshToken);
        } else {
          localStorage.removeItem("uch_refresh_token");
        }
      }
    } catch {
      // ignore storage errors
    }
  }
}

export function setLocalAccessToken(token: string | null) {
  setLocalTokens(token);
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
      ? "/api/v1"
      : process.env.BACKEND_API_URL
        ? `${process.env.BACKEND_API_URL}/api/v1`
        : "http://localhost:8080/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Attach access token from memory if present
apiClient.interceptors.request.use(
  (config) => {
    dispatchLoadingStart();
    const token = getLocalAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
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
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/refresh") ||
      originalRequest?.url?.includes("/auth/register");

    // Check if error is 401 and request has not been retried yet, and not an auth request
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      originalRequest._retry = true;

      const refreshToken = getLocalRefreshToken();
      if (!refreshToken || typeof window === "undefined") {
        setLocalTokens(null, null);
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
        // Perform silent token refresh via reverse proxy
        const response = await axios.post<ApiEnvelope<BackendAuthResponse>>(
          "/api/v1/auth/refresh",
          { refresh_token: refreshToken },
          { headers: { "Content-Type": "application/json" } },
        );

        const newAccessToken = response.data?.data?.access_token;
        const newRefreshToken = response.data?.data?.refresh_token;

        if (newAccessToken) {
          setLocalTokens(newAccessToken, newRefreshToken || refreshToken);

          // Update header and broadcast to subscribers
          apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          for (const callback of _refreshSubscribers) callback(newAccessToken);
          _refreshSubscribers = [];

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, clear token memory and reject request
        setLocalTokens(null, null);
        _refreshSubscribers = [];
        return Promise.reject(refreshError);
      } finally {
        _isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
