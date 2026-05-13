<script setup>
import { ref, computed, watch } from "vue";
import BaseInput from "@/components/common/BaseInput.vue";
import BasePagination from "@/components/common/BasePagination.vue";
import ProjectCard from "@/components/project/ProjectCard.vue";
import ConfirmModal from "@/components/common/ConfirmModal.vue";
import { useProjectStore } from "@/stores/projectStore.js";
const projectStore = useProjectStore();
const currentPage = ref(1);
// --- Tìm kiếm ---
const searchQuery = ref("");
const debouncedSearchQuery = ref("");
let debounceTimeout = null;
// --- Phân trang ---
const itemsPerPage = ref(6);
const projectIdToDelete = ref(null);
const isConfirmOpen = ref(false);

const openDeleteModal = (id) => {
  console.log("Project ID to delete:", id, typeof id);
  projectIdToDelete.value = id;
  isConfirmOpen.value = true;
  console.log(isConfirmOpen.value);
};
const handleConfirmDelete = () => {
  console.log("Confirmed deletion for project ID:", projectIdToDelete.value, typeof projectIdToDelete.value);
  if (projectIdToDelete.value) {
    console.log("Deleting project with ID:", projectIdToDelete.value, typeof projectIdToDelete.value);
    projectStore.deleteProject(projectIdToDelete.value);
    isConfirmOpen.value = false;
    projectIdToDelete.value = null;
  }
};
const gridClass = computed(() => {
  console.log(itemsPerPage.value);
  return `grid-items-${itemsPerPage.value}`;
});
// watch([searchQuery, itemsPerPage], () => {
//   currentPage.value = 1;
// });
watch(searchQuery, (newQuery) => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    currentPage.value = 1;
    debouncedSearchQuery.value = newQuery;
  }, 300);
});
const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredProjects.value.slice(start, end);
});
const filteredProjects = computed(() => {
  const list = projectStore.projects || [];
  const query = (debouncedSearchQuery.value || "").toLowerCase().trim();
  return list.filter((item) => {
    const projectTitle = (item.title || "").toLowerCase();
    return projectTitle.includes(query);
  });
});
// 4. Tính tổng số trang (Dùng Math.ceil cho ngắn gọn thay vì if/else)
const totalItems = computed(() => filteredProjects.value.length);
const totalPages = computed(() => {
  return totalItems.value >0 ? Math.ceil(totalItems.value / itemsPerPage.value) : 1;
});
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
      <ProjectCard v-for="item in paginatedProjects" :key="item.id" :project="item" @delete="openDeleteModal"/>
    </div>
    <!-- Pagination -->
    <BasePagination
      :total="totalItems"
      :pages="totalPages"
      v-model:current="currentPage"
      v-model:pageSize="itemsPerPage"
    />
    <!-- Confirm Modal -->
    <ConfirmModal
      v-if="isConfirmOpen"
      :isOpen="isConfirmOpen"
      title="Confirm Deletion"
      message="Are you sure you want to delete this project?"
      @confirm="handleConfirmDelete"
      @close="isConfirmOpen = false"
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
