import { http } from "@/api/axiosClient";
export const userService = {
  getAll: () => {
    return http.get("/user/get-all");
  },
  delete: (id) => {
    return http.delete(`/user/${id}`);
  },
  update: (id, data) => {
    return http.put(`/user/${id}`, data);
  },
  checkEmail: (email) => {
    return http.get(`/user/check-email?email=${encodeURIComponent(email)}`);
  },
  create: (data) => {
    return http.post("/user/create", data);
  },
  getById: (id) => {
    return http.get(`/user/${id}`);
  },
  getMyProfile: () => {
    return http.get(`user/my-profile`);
  },
};
