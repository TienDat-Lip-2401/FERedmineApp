import { defineStore } from "pinia";
import { ref } from "vue";
import { projectList } from "@/mock/projects.js";
export const useProjectStore = defineStore("project", () => {
  // Danh sách dự án khởi tạo
  const projects = ref(projectList);
  // Hàm để thêm dự án mới
  const addProject = (newProject) => {
    projects.value.unshift(newProject); // Thêm vào đầu danh sách
  };

  return { projects, addProject };
});
