import { http } from "@/api/axiosClient";

export const projectService = {
    // 1. Lấy chi tiết một dự án (kèm danh sách member đang có)
    getById: (id) => {
        return http.get(`/project/${id}`);
    },

    // 2. Lấy danh sách dự án của tài khoản đang đăng nhập
    getMyProjects: () => {
        return http.get("/project/my-projects");
    },

    // 3. Tạo dự án mới (có thể gửi kèm mảng member ban đầu)
    create: (data) => {
        return http.post("/project", data);
    },

    // 4. Lấy danh sách user CHƯA tham gia dự án (để vẽ lên Modal Add Member)
    getAvailableUsers: (projectId) => {
        return http.get(`/project/${projectId}/available-users`);
    },

    // 5. Thêm danh sách thành viên vào dự án đã có (Nút Apply trên Modal)
    // data có dạng: [ { userId: 1, roleId: 2 }, ... ]
    addMembers: (projectId, data) => {
        return http.post(`/project/${projectId}/members`, data);
    },

    // 6. Xóa cứng một thành viên khỏi dự án (Icon thùng rác)
    removeMember: (projectId, userId) => {
        return http.delete(`/project/${projectId}/members/${userId}`);
    },
    getDetail: (id) => {
        return http.get(`/project/${id}`);
    },
    update: (id, data) => {
        return http.put(`/project/${id}`, data);
    },
}