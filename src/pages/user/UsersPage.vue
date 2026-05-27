<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/stores/userStore";
import BaseButton from "@/components/common/BaseButton.vue";
import BasePagination from "@/components/common/BasePagination.vue";
import BaseLoading from "@/components/common/BaseLoading.vue";
import { useModalStore } from "@/stores/modalStore";
import ConfirmModal from "@/components/common/ConfirmModal.vue";
import BaseInput from "@/components/common/BaseInput.vue";
import trashIcon from "@/assets/icons/trash.svg";
import editIcon from "@/assets/icons/edit.svg";

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();
const modalStore = useModalStore();
const isLoading = ref(false);
const loadingText = ref(t("common.loading"));
onMounted(async () => {
  try {
    isLoading.value = true;
    loadingText.value = t("common.loading");
    await userStore.fetchUsers();
  } catch (error) {
    console.error("Lỗi khi tải User:", error);
  } finally {
    isLoading.value = false;
  }
});

// --- QUẢN LÝ TÌM KIẾM ---
const searchQuery = ref("");
const debouncedSearchQuery = ref("");
let debounceTimeout = null;
const searchField = ref("");
const statusFilter = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);
watch(searchQuery, (newQuery) => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    debouncedSearchQuery.value = newQuery;
  }, 300);
});
// --- XỬ LÝ XÓA ---
const isConfirmOpen = ref(false);
const userIdToDelete = ref(null);
// --- Chuyển đổi dấu sang không dấu ---
const removeVietnameseTones = (str) => {
  if (!str) return "";
  return str
    .normalize("NFD") // Tách các dấu ra khỏi chữ cái gốc
    .replace(/[\u0300-\u036f]/g, "") // Xóa các dấu vừa tách
    .replace(/đ/g, "d") // Xử lý riêng chữ đ
    .replace(/Đ/g, "D")
    .toLowerCase();
};
// Đổi trường tìm kiếm thì xóa trắng ô nhập
watch(searchField, () => {
  searchQuery.value = "";
});
// Khi searchQuery, statusFilter hoặc searchField thay đổi thì reset về trang 1
watch([debouncedSearchQuery, statusFilter, searchField], () => {
  currentPage.value = 1;
});
const handleEdit = (userId) => {
  router.push(`/users/update/${userId}`);
};
const filteredUsers = computed(() => {
  const key = removeVietnameseTones(debouncedSearchQuery.value);

  return userStore.users.filter((user) => {
    // 1. Lọc theo trường tìm kiếm
    const fieldValue = searchField.value
      ? removeVietnameseTones(user[searchField.value] || "")
      : "";
    const matchSearch = searchField.value ? fieldValue.includes(key) : true;

    // 2. Lọc theo trạng thái (Xử lý chuyển đổi kiểu)
    let matchStatus = true;
    if (statusFilter.value === "Active") {
      matchStatus = user.status === true;
    } else if (statusFilter.value === "Inactive") {
      matchStatus = user.status === false;
    }

    return matchSearch && matchStatus;
  });
});
const totalItems = computed(() => filteredUsers.value.length);
const totalPages = computed(() => {
  return totalItems.value > 0 ? Math.ceil(totalItems.value / itemsPerPage.value) : 1;
});
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredUsers.value.slice(start, end);
});
const handleCreateUser = () => {
  router.push("/users/create");
};
const triggerDelete = (id) => {
  userIdToDelete.value = id;
  isConfirmOpen.value = true;
};
// Xác nhận xóa
const confirmDelete = async () => {
  if (!userIdToDelete.value) return;

  // Đóng bảng hỏi xác nhận trước
  isConfirmOpen.value = false;

  try {
    // Bật Loading và đổi chữ
    isLoading.value = true;
    loadingText.value = t("users.delete_loading");

    const result = await userStore.deleteUser(userIdToDelete.value);

    if (result.success) {
      if (paginatedUsers.value.length === 0 && currentPage.value > 1) {
        currentPage.value--;
      }
    } else {
      modalStore.showModal({
        title: t("common.alert.failed"),
        message: result.message,
        type: "error",
      });
    }
  } catch (error) {
    const msg = error.message;
    modalStore.showModal({
      title: t("common.alert.failed"),
      message: msg || t("users.delete_failed"),
      type: "error",
    });
  } finally {
    isLoading.value = false;
    userIdToDelete.value = null;
  }
};
</script>

<template>
  <div class="users-container">
    <div class="page-header">
      <h1 class="page-title">{{ $t("users.title") }}</h1>
      <BaseButton variant="danger" @click="handleCreateUser" class="btn-create">
        + {{ $t("users.create_title") }}
      </BaseButton>
    </div>

    <div class="filter-card">
      <div class="filter-group">
        <span class="filter-label">{{ $t("users.filter") }}</span>

        <select v-model="searchField" class="filter-select field-select">
          <option value="" disabled>{{ $t("users.select_field") }}</option>
          <option value="name">{{ $t("users.name") }}</option>
          <option value="email">{{ $t("users.email") }}</option>
          <option value="code">{{ $t("users.code") }}</option>
        </select>

        <BaseInput v-model="searchQuery" no-margin height="5.6rem" :disabled="!searchField" />

        <select v-model="statusFilter" class="filter-select status-select">
          <option value="">{{ $t("users.all_status") }}</option>
          <option value="Active">{{ $t("common.status.active") }}</option>
          <option value="Inactive">{{ $t("common.status.inactive") }}</option>
        </select>

        <BaseButton variant="danger" class="filter-button"> {{ $t("common.search") }} </BaseButton>
      </div>
    </div>

    <div class="table-card">
      <table class="user-table">
        <thead>
          <tr>
            <th>{{ $t("common.no") }}</th>
            <th>{{ $t("users.code") }}</th>
            <th>{{ $t("users.name") }}</th>
            <th>{{ $t("users.email") }}</th>
            <th>{{ $t("users.phone") }}</th>
            <th>{{ $t("users.join_date") }}</th>
            <th>{{ $t("users.status") }}</th>
            <th class="text-center">{{ $t("common.action") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in paginatedUsers" :key="user.id">
            <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td>{{ user.code }}</td>
            <td class="user-name">{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.phoneNumber || "N/A" }}</td>
            <td>{{ user.joinDate }}</td>
            <td>
              <span :class="['status-tag', user.status ? 'active' : 'inactive']">
                {{ user.status ? $t("common.status.active") : $t("common.status.inactive") }}
              </span>
            </td>
            <td class="action-btns">
              <button class="btn-icon edit" @click="handleEdit(user.id)">
                <img :src="editIcon" alt="Edit" />
              </button>
              <button class="btn-icon delete" @click="triggerDelete(user.id)">
                <img :src="trashIcon" alt="Delete" />
              </button>
            </td>
          </tr>
          <tr v-if="paginatedUsers.length === 0">
            <td colspan="8" class="empty-state">{{ $t("users.no_users") }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BasePagination
      :total="totalItems"
      :pages="totalPages"
      v-model:current="currentPage"
      v-model:pageSize="itemsPerPage"
    />

    <ConfirmModal :isOpen="isConfirmOpen" @close="isConfirmOpen = false" @confirm="confirmDelete" />
    <BaseLoading :isLoading="isLoading" :text="loadingText" />
  </div>
</template>

<style scoped>
.users-container {
  padding: 2rem 3rem;
  background-color: #f8fafc;
  min-height: 100vh;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  .page-title {
    font-size: 3rem;
    font-weight: 700;
    color: #0e2040;
  }
}
.filter-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  margin-bottom: 2rem;
}
.filter-group {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.filter-label {
  font-weight: 400;
  font-size: 2rem;
  color: #000000;
  line-height: 150%;
}
.filter-select,
.search-input {
  height: 5.6rem;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 0 1.2rem;
  font-size: 1.4rem;
  outline: none;
}
.filter-button {
  height: 5.6rem;
  min-width: 10rem;
}
.search-input {
  flex: 1;
}
.table-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}
.user-table {
  width: 100%;
  text-align: left;
  padding: 1.6rem;
}
.user-table th {
  background-color: #f2f2f7;
  padding: 1.5rem;
  font-size: 20px;
  font-weight: 700;
  color: #000000;
  border-bottom: 1px solid #f2f2f7;
}
.user-table td {
  padding: 1.5rem;
  font-size: 1.4rem;
  border-bottom: 1px solid #f1f5f9;
  color: #000000;
  font-size: 2rem;
  font-weight: 400;
}
.status-tag.active {
  color: #2ecc71;
}
.status-tag.inactive {
  color: #e74c3c;
}

.action-btns {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0; /* Bỏ padding để icon không bị nhỏ lại */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}
.btn-icon.edit img {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.btn-icon.delete img {
  width: 14px;
  height: 16px;
  object-fit: contain;
}

.btn-icon:hover {
  transform: scale(1.2);
}

.empty-state {
  text-align: center;
  padding: 4rem !important;
  color: #94a3b8;
}
</style>
