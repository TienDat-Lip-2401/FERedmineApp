<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import BaseButton from "@/components/common/BaseButton.vue";
import BasePagination from "@/components/common/BasePagination.vue";
import ConfirmModal from "@/components/common/ConfirmModal.vue";
import BaseInput from "@/components/common/BaseInput.vue";
import trashIcon from "@/assets/icons/trash.svg";
import editIcon from "@/assets/icons/edit.svg";
const router = useRouter();
const userStore = useUserStore();
onMounted(async () => {
  if (userStore.users.length === 0) {
    await userStore.fetchUsers();
    console.log("Fetched users:", userStore.users);
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
const filteredUsers = computed(() => {
  const key = removeVietnameseTones(debouncedSearchQuery.value);

  return userStore.users.filter((user) => {
    // Lọc theo trường đã chọn (Name/Email/Code)
    const fieldValue = searchField.value
      ? removeVietnameseTones(user[searchField.value] || "")
      : "";
    const matchSearch = searchField.value ? fieldValue.includes(key) : true;

    // Lọc theo Status
    const matchStatus = statusFilter.value ? user.status === statusFilter.value : true;

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
  const result = await userStore.deleteUser(userIdToDelete.value);
  if (result.success) {
    if (paginatedUsers.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }
  } else {
    alert(result.message);
  }
  isConfirmOpen.value = false;
  userIdToDelete.value = null;
};
</script>

<template>
  <div class="users-container">
    <div class="page-header">
      <h1 class="page-title">Users</h1>
      <BaseButton variant="danger" @click="handleCreateUser" class="btn-create">
        + Create User
      </BaseButton>
    </div>

    <div class="filter-card">
      <div class="filter-group">
        <span class="filter-label">Filter</span>

        <select v-model="searchField" class="filter-select field-select">
          <option value="" disabled>-- Select field --</option>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="code">Code</option>
        </select>

        <BaseInput v-model="searchQuery" no-margin height="5.6rem" :disabled="!searchField" />

        <select v-model="statusFilter" class="filter-select status-select">
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <BaseButton variant="danger" class="filter-button"> Search </BaseButton>
      </div>
    </div>

    <div class="table-card">
      <table class="user-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Code</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone number</th>
            <th>Join date</th>
            <th>Status</th>
            <th class="text-center">Action</th>
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
                {{ user.status ? "Active" : "Inactive" }}
              </span>
            </td>
            <td class="action-btns">
              <button class="btn-icon edit">
                <img :src="editIcon" alt="Edit" />
              </button>
              <button class="btn-icon delete" @click="triggerDelete(user.id)">
                <img :src="trashIcon" alt="Delete" />
              </button>
            </td>
          </tr>
          <tr v-if="paginatedUsers.length === 0">
            <td colspan="8" class="empty-state">No users found.</td>
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
