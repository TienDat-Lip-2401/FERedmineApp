import { authService } from "@/services/auth";
import { defineStore } from "pinia";
import { ref } from "vue";
export const useAuthStore = defineStore("auth", () => {
  const savedUser = localStorage.getItem("user");
  const user = ref(savedUser ? JSON.parse(savedUser) : null);
  const isAuthenticated = ref(!!savedUser);
  const setAuthData = (userData) => {
    isAuthenticated.value = true;
    user.value = userData;
    localStorage.setItem("user", JSON.stringify(userData));
  };
  const setUser = (userData) => {
    user.value = userData;
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Lỗi khi đăng xuất backend:", error);
    } finally {
      user.value = null;
      localStorage.removeItem("user");
      isAuthenticated.value = false;
    }
  };
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };
  const clearFirstLoginFlag = () => {
    if (user.value) {
      user.value.isFirstLogin = false;
      localStorage.setItem("user", JSON.stringify(user.value));
    }
  };
  const resetPassword = async (data) => {
    try {
      const response = await authService.resetMyPassword(data);
      clearFirstLoginFlag();
      return response;
    } catch (error) {
      throw error;
    }
  };
  const refreshToken = async () => {
    try {
      const response = await authService.refreshToken();
      return response;
    } catch (error) {
      await logout();
      throw error;
    }
  };
  return {
    user,
    setAuthData,
    setUser,
    logout,
    register,
    resetPassword,
    clearFirstLoginFlag,
    refreshToken,
    isAuthenticated,
  };
});
