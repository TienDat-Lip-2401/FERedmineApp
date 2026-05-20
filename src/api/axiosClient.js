import axios from "axios";
//Tạo client axios với baseURL từ biến môi trường
const baseURL = import.meta.env.VITE_API_URL;
export const httpClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
httpClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
);

export const http = {
  get: (path, config = {}) => httpClient.get(path, config),

  post: (path, data = {}, config = {}) => {return httpClient.post(path, data, config);},

  put: (path, data = {}, config = {}) => httpClient.put(path, data, config),

  patch: (path, data = {}, config = {}) => httpClient.patch(path, data, config),

  delete: (path, config = {}) => httpClient.delete(path, config),
};
