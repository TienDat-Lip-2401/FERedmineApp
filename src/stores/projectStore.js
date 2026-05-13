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
  const deleteProject = (projectId) => {
    projects.value = projects.value.filter((project) => project.id !== projectId);
  }
  return { projects, addProject , deleteProject};
});
