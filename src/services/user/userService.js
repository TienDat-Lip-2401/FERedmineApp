import { http } from "@/api/axiosClient";
export const userService =  {
    getAll : () => {
        return http.get("/user/get-all");
    },
    delete : (id) => {
        return http.delete(`/user/${id}`);
    },
    getMe: () => {
        return http.get("/user/me");
    },
    update: (id, data) => {
        return http.put(`/user/${id}`, data);
    }
}