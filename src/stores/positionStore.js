import { defineStore } from "pinia";
import { positionService } from "@/services/position/positionService";
export const usePositionStore = defineStore("position", {
  state: () => ({
    userPositions: [],
    availablePositions: [],
    allPositions: [],
    isLoading: false,
  }),
  actions: {
    async fetchUserPositions(userId) {
      this.isLoading = true;
      try {
        const res = await positionService.getByUserId(userId);
        // Backend trả về ApiResponse { data: [...] }
        this.userPositions = res.data || [];
        return res;
      } finally {
        this.isLoading = false;
      }
    },
    async fetchAvailablePositions(userId) {
      try {
        const res = await positionService.getAvailable(userId);
        this.availablePositions = res.data || []; // Theo Controller bạn dùng Ok(result)
        return res;
      } catch (error) {
        console.error("Lỗi lấy danh sách chức vụ khả dụng:", error);
      }
    },
    async assignPositions(userId, selectedIds) {
      try {
        const payload = {
          userId: userId,
          positionIds: selectedIds,
        };
        const res = await positionService.addPositions(payload);

        if (res.statusCode === 200) {
          // Sau khi thêm thành công, làm mới lại danh sách hiện tại
          await this.fetchUserPositions(userId);
          await this.fetchAvailablePositions(userId);
        }
        return res;
      } catch (error) {
        throw error;
      }
    },
    async removePosition(userId, positionId) {
      try {
        const payload = { userId, positionId };
        const res = await positionService.removePosition(payload);

        if (res.statusCode === 200) {
          // Cập nhật lại state tại chỗ để giao diện mượt mà
          this.userPositions = this.userPositions.filter((p) => p.id !== positionId);
          // Load lại danh sách khả dụng vì chức vụ này giờ đã có thể gán lại
          await this.fetchAvailablePositions(userId);
        }
        return res;
      } catch (error) {
        throw error;
      }
    },
    async getAllPositions() {
      try {
        const res = await positionService.getAllPosition();
        if (res.statusCode === 200) {
          // Gán vào state allPositions
          this.allPositions = res.data || [];
          return { success: true, data: res.data };
        } else {
          return { success: false, message: res.message };
        }
      } catch (error) {
        console.error("Lỗi lấy tất cả chức vụ:", error);
        throw error;
      }
    },
  },
});
