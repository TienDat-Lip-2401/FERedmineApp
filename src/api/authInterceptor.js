import { httpClient } from "./axiosClient";
import { useAuthStore } from "@/stores/authStore";
import axios from "axios";
import router from "@/router";

const BASE_URL = import.meta.env.VITE_API_URL;

export const setupAuthInterceptor = () => {
  let isRefreshing = false;
  let failedQueue = [];

  const processQueue = (error) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve();
      }
    });
    failedQueue = [];
  };

  httpClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Khai báo Store (lưu ý: Pinia đôi khi báo lỗi nếu gọi ngoài context,
      // nhưng đặt trong callback thế này thường là an toàn)
      const authStore = useAuthStore();

      // ==============================================================
      // FIX 1: CHẶN VÒNG LẶP LOGOUT
      // Nếu API logout bị 401, tuyệt đối KHÔNG gọi authStore.logout() nữa
      // ==============================================================
      if (error.response?.status === 401 && originalRequest.url.includes("/auth/logout")) {
        authStore.user = null; // Dọn dẹp State
        localStorage.removeItem("user"); // Dọn dẹp ổ cứng
        router.push({ name: "Login" });
        return Promise.reject(error);
      }

      // ==============================================================
      // FIX 2: CHẶN VÒNG LẶP REFRESH TOKEN
      // Nếu API gia hạn token mà cũng báo lỗi 401 thì dọn dẹp và nghỉ luôn
      // ==============================================================
      if (error.response?.status === 401 && originalRequest.url.includes("/auth/refresh-token")) {
        authStore.user = null;
        localStorage.removeItem("user");
        router.push({ name: "Login" });
        return Promise.reject(error);
      }

      // XỬ LÝ LỖI 401 CHO CÁC API BÌNH THƯỜNG KHÁC
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return httpClient(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Lên server xin Cookie mới
          await axios.post(`${BASE_URL}/auth/refresh-token`, {}, { withCredentials: true });

          processQueue(null);
          return httpClient(originalRequest);
        } catch (refreshError) {
          // Lỗi rồi thì ép out. TUYỆT ĐỐI KHÔNG dùng authStore.logout() ở đây!
          processQueue(refreshError);

          authStore.user = null;
          localStorage.removeItem("user");
          router.push({ name: "Login" });

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );
};
