import { httpClient } from "./axiosClient";
import { useAuthStore } from "@/stores/authStore";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;
export const setupAuthInterceptor = () => {
  let isRefreshing = false;
  let failedQueue = [];

  const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  };
  httpClient.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    const token = authStore.accessToken || localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  httpClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const authStore = useAuthStore();
      if (error.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return httpClient(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }
        originalRequest._retry = true;
        isRefreshing = true;
        try {
          const rfToken = localStorage.getItem("refresh_token");
          const { data } = await axios.post(
            `${BASE_URL}/auth/refresh-token`,
            {
              refresh_token: rfToken,
            },
            { withCredentials: true },
          );
          const newToken = data.accessToken;
          authStore.setAccessToken(newToken);
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return httpClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          isRefreshing = false;
          authStore.logout();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    },
  );
};
