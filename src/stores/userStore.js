import { defineStore } from "pinia";
import { ref } from "vue";
import { userService } from "@/services/user";

export const useUserStore = defineStore("user", () => {
  const users = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const fetchUsers = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await userService.getAll();
      if (response.statusCode === 200) {
        users.value = response.data;
      } else {
        error.value = response.message || "Không thể lấy danh sách người dùng";
      }
    } catch (error) {
      error.value = "Đã xảy ra lỗi khi kết nối đến máy chủ";
      console.error("UserStore Error:", error);
    } finally {
      isLoading.value = false;
    }
  };
  const deleteUser = async (id) => {
    try {
      const response = await userService.delete(id);
      if (response.statusCode === 200) {
        users.value = users.value.filter((u) => u.id !== id);
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Có lỗi xảy ra khi xóa";
      return { success: false, message: errorMsg };
    }
  };
  const getMe = async () => {
    try {
      const response = await userService.getMe();
      if (response.statusCode === 200) {
        return response.data;
      } else {
        throw new Error(response.message || "Không thể lấy thông tin người dùng");
      }
    } catch (error) {
      console.error("UserStore Error:", error);
      throw error;
    }
  };
  const updateUser = async (id, data) => {
    try {
      const response = await userService.update(id, data);
      if (response.statusCode === 200) {
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Có lỗi xảy ra khi cập nhật";
      return { success: false, message: errorMsg };
    }
  };
  const checkEmailExists = async (email) => {
    try {
      const response = await userService.checkEmail(email);
      return response;
    } catch (error) {
      console.error("UserStore Check Email Error:", error);
      throw error; // Ném lỗi ra ngoài cho UI hiển thị chữ đỏ
    }
  };
  const addUser = async (data) => {
    try {
      const response = await userService.create(data);
      if (response.statusCode === 200 || response.statusCode === 201) {
        if (response.data) {
          await fetchUsers();
        }
        return { success: true, message: response.message || "Tạo người dùng thành công!" };
      } else {
        return { success: false, message: response.message || "Tạo người dùng thất bại." };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Có lỗi xảy ra khi tạo mới người dùng";
      console.error("UserStore Create Error:", error);
      return { success: false, message: errorMsg };
    }
  };
  return {
    users,
    isLoading,
    error,
    fetchUsers,
    deleteUser,
    getMe,
    updateUser,
    checkEmailExists,
    addUser,
  };
});
