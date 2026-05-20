import { authService } from "@/services/auth";
import { defineStore } from "pinia";
import { ref } from "vue";
export const useAuthStore = defineStore("auth", () => {
  const savedUser = localStorage.getItem("user");
  const user = ref(savedUser ? JSON.parse(savedUser) : null);
  const accessToken = ref(localStorage.getItem("access_token") || null);
  const refreshToken = ref(localStorage.getItem("refresh_token") || null);
  const setAccessToken = (token) => {
    accessToken.value = token;
    localStorage.setItem("access_token", token);
  };
  const setAuthData = (token, rfToken, userData) => {
    accessToken.value = token;
    user.value = userData;
    refreshToken.value = rfToken;
    localStorage.setItem("access_token", token);
    localStorage.setItem("refresh_token", rfToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };
  const setUser = (userData) => {
    user.value = userData;
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    accessToken.value = null;
    user.value = null;
    refreshToken.value = null;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  };
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      throw error;
    }
  }
  return { accessToken, user, refreshToken, setAccessToken, setAuthData, setUser, logout, register };
});
