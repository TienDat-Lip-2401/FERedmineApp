import { http } from "@/api/axiosClient";
export const authService = {
  login: (credentials) => {
    return http.post("/auth/login", credentials);
  },
  logout: () => {
    return http.post("/auth/logout");
  },
  register: (data) => {
    return http.post("/auth/register", data);
  },
  resetMyPassword: (data) => {
    return http.post("/auth/reset-my-password", data); 
  },
};
