import { defineStore } from "pinia";
import { ref } from "vue";
import { projectService } from "@/services/project";
export const useProjectStore = defineStore("project", {
  state: () => ({
    projects: [],
    availableUsers: [], // Lưu danh sách user chưa tham gia dự án (cho Modal)
    isLoading: false,
    isLoaded: false,
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 6,
  }),
  actions: {
    async fetchProjects(page = 1, size = 6,search = "", forceRefresh = false) {
      if (this.isLoading) return;

      this.isLoading = true;
      try {
        const res = await projectService.getMyProjects(page, size, search);
        const responseData = res.data;
        this.projects = responseData.data;
        this.totalItems = responseData.totalItems;
        this.totalPages = responseData.totalPages;
        this.currentPage = responseData.currentPage;
        this.pageSize = size;
        return res;
      } catch (error) {
        console.error("Fetch projects failed:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async fetchProjectDetail(projectId) {
      this.isLoading = true;
      try {
        const res = await projectService.getDetail(projectId); // Cần có hàm getDetail trong projectService
        this.currentProject = res.data?.data || res.data || null;
        return res;
      } catch (error) {
        console.error("Lỗi lấy chi tiết dự án:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async addProject(projectData) {
      try {
        const res = await projectService.create(projectData);
        if (res.statusCode === 201 || res.statusCode === 200) {
          // Tạo thành công thì gọi lại API lấy danh sách mới nhất
          await this.fetchProjects();
        }
        return res;
      } catch (error) {
        throw error;
      }
    },
    async deleteProject(projectId) {
      try {
        // Giả sử projectService có hàm delete
        const res = await projectService.delete(projectId);

        if (res.statusCode === 200) {
          // Xóa thành công thì lọc bỏ khỏi state hiện tại cho UI mượt mà
          await this.fetchProjects(this.currentPage, 6, true);
        }
        return res;
      } catch (error) {
        throw error;
      }
    },
    async fetchAvailableUsers(projectId) {
      try {
        const res = await projectService.getAvailableUsers(projectId);
        this.availableUsers = res.data || [];
        return res;
      } catch (error) {
        console.error("Lỗi lấy danh sách user khả dụng:", error);
      }
    },
    async addMembers(projectId, selectedIds) {
      try {
        const res = await projectService.addMembers(projectId, selectedIds);

        if (res.statusCode === 200 || res.statusCode === 201) {
          // Sau khi thêm thành công, làm mới lại danh sách user khả dụng
          await this.fetchAvailableUsers(projectId);
        }
        return res;
      } catch (error) {
        throw error;
      }
    },
    async removeMember(projectId, userId) {
      try {
        const res = await projectService.removeMember(projectId, userId);

        if (res.statusCode === 200) {
          // Xóa xong thì user đó lại trở thành "khả dụng", nên fetch lại danh sách
          await this.fetchAvailableUsers(projectId);
        }
        return res;
      } catch (error) {
        throw error;
      }
    },
    async updateProject(projectId, projectData) {
      this.isLoading = true;
      try {
        const res = await projectService.update(projectId, projectData);
        return res;
      } catch (error) {
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteProject(projectId) {
      this.isLoading = true;
      try {
        const res = await projectService.delete(projectId);
        if (res.statusCode === 200) {
          this.projects = this.projects.filter((p) => p.id !== projectId);
        }
        return res;
      } catch (error) {
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
