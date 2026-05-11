<script setup>
import { ref, computed, watch } from "vue";
import BaseInput from "@/components/common/BaseInput.vue";
import BasePagination from "@/components/common/BasePagination.vue";
import ProjectCard from "@/components/project/ProjectCard.vue";
import { useProjectStore } from "@/stores/projectStore.js";
const projectStore = useProjectStore();
const currentPage = ref(1);
const searchQuery = ref("");
const itemsPerPage = ref(6);
const gridClass = computed(() => {
  console.log(itemsPerPage.value);
  return `grid-items-${itemsPerPage.value}`;
});
watch([searchQuery, itemsPerPage], () => {
  currentPage.value = 1;
});
const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredProjects.value.slice(start, end);
});
const filteredProjects = computed(() => {
  const list = projectStore.projects || [];
  const query = (searchQuery.value || "").toLowerCase();
  return list.filter((item) => {
    const projectTitle = (item.title || "").toLowerCase();
    return projectTitle.includes(query);
  });
});
// 4. Tính tổng số trang (Dùng Math.ceil cho ngắn gọn thay vì if/else)
const totalItems = computed(() => projectStore.projects.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));
</script>

<template>
  <div class="projects-wrapper">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">Projects</h1>
      <div class="search-box">
        <BaseInput placeholder="Search" width="42rem" height="4.5rem" v-model="searchQuery" />
      </div>
    </div>
    <!-- Project List -->
    <div :class="['projects-grid', gridClass]">
      <ProjectCard v-for="item in paginatedProjects" :key="item.id" :project="item" />
    </div>
    <!-- Pagination -->
    <BasePagination
      :total="totalItems"
      :pages="totalPages"
      v-model:current="currentPage"
      v-model:pageSize="itemsPerPage"
    />
  </div>
</template>

<style scoped>
.projects-wrapper {
  padding: 2rem;
  width: 100%;
  margin: 0 auto;
  max-width: 1440px;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  .page-title {
    font-weight: 700;
    font-size: 30px;
    line-height: 100%;
    letter-spacing: 0%;
  }
}
.projects-grid {
  display: grid;
  gap: 24px;
}
/* Tablet: Chia 2 cột */
@media (max-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile: Chia 1 cột */
@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
.grid-items-6 {
  grid-template-columns: repeat(3, 1fr);
}

/* Khi chọn 10/page -> Chia 5 cột (2 hàng) */
.grid-items-10 {
  grid-template-columns: repeat(5, 1fr);
}
</style>
