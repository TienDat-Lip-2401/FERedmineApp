<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import BaseInput from "@/components/common/BaseInput.vue";
import BasePagination from "@/components/common/BasePagination.vue";
import ProjectCard from "@/components/project/ProjectCard.vue";
import ConfirmModal from "@/components/common/ConfirmModal.vue";
import { useProjectStore } from "@/stores/projectStore.js";
import { useModalStore } from "@/stores/modalStore";
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const modalStore = useModalStore();
const projectStore = useProjectStore();
const currentPage = ref(Number(route.query.page) || 1);
// --- Tìm kiếm ---
const searchQuery = ref(route.query.search || "");
const debouncedSearchQuery = ref("");
let debounceTimeout = null;
// --- Phân trang ---
const itemsPerPage = ref(Number(route.query.size) || 6);
const projectIdToDelete = ref(null);
const isConfirmOpen = ref(false);
const openDeleteModal = (id) => {
  projectIdToDelete.value = id;
  isConfirmOpen.value = true;
};
const handleConfirmDelete = async () => {
  if (!projectIdToDelete.value) return;
  try {
    await projectStore.deleteProject(projectIdToDelete.value);
    isConfirmOpen.value = false;
    projectIdToDelete.value = null;
    modalStore.showModal({
      title: t("common.alert.success"),
      message: t("projects.delete_success"),
      type: "success",
    });
  } catch (error) {
    isConfirmOpen.value = false;
    projectIdToDelete.value = null;
    const errorMessage = error.response?.data?.message || t("projects.delete_failed");

    modalStore.showModal({
      title: t("common.alert.failed"),
      message: errorMessage,
      type: "error",
    });
  }
};
const gridClass = computed(() => {
  console.log(itemsPerPage.value);
  return `grid-items-${itemsPerPage.value}`;
});
watch(searchQuery, (newQuery) => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    currentPage.value = 1;
    debouncedSearchQuery.value = newQuery;
  }, 300);
});

const paginatedProjects = computed(() => projectStore.projects);
watch(
  [currentPage, itemsPerPage, debouncedSearchQuery],
  ([newCurrent, newSize, newSearch]) => {
    projectStore.fetchProjects(newCurrent, newSize, newSearch);
    router.replace({
      query: { ...route.query, page: newCurrent, size: newSize, search: newSearch || undefined },
    });
  },
  { immediate: true },
);
const totalPages = computed(() => projectStore.totalPages);
const totalItems = computed(() => projectStore.totalItems);
</script>

<template>
  <div class="projects-wrapper">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">{{ $t("projects.title") }}</h1>
      <div class="search-box">
        <BaseInput
          :placeholder="$t('common.search')"
          width="42rem"
          height="4.5rem"
          v-model="searchQuery"
        />
      </div>
    </div>
    <!-- Project List -->
    <div :class="['projects-grid', gridClass]">
      <ProjectCard
        v-for="item in paginatedProjects"
        :key="item.id"
        :project="item"
        @delete="openDeleteModal"
      />
    </div>
    <!-- Pagination -->
    <BasePagination
      :total="totalItems"
      :pages="totalPages"
      :current="currentPage"
      :pageSize="itemsPerPage"
      @update:current="currentPage = $event"
      @update:pageSize="itemsPerPage = $event"
    />
    <!-- Confirm Modal -->
    <ConfirmModal
      v-if="isConfirmOpen"
      :isOpen="isConfirmOpen"
      :message="$t('projects.confirm_delete_project')"
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
