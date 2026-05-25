<script setup>
import { ref, computed, watch } from "vue";
import { useProjectStore } from "@/stores/projectStore";
import { useUserStore } from "@/stores/userStore";
const userStore = useUserStore();
const projectStore = useProjectStore();
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  isOpen: Boolean,
  projectId: [Number, String],
  currentMembers: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(["close", "add"]);
const removeVietnameseTones = (str) => {
  if (!str) return "";
  return str
    .normalize("NFD") // Tách các dấu ra khỏi chữ cái gốc
    .replace(/[\u0300-\u036f]/g, "") // Xóa các dấu vừa tách
    .replace(/đ/g, "d") // Xử lý riêng chữ đ
    .replace(/Đ/g, "D")
    .toLowerCase();
};
const searchQuery = ref("");
const selectedUsers = ref([]);
const loadAvailableUsers = async () => {
  if (props.projectId && props.projectId !== 0 && props.projectId !== "0") {
    // Trang Update
    await projectStore.fetchAvailableUsers(props.projectId);
  } else {
    // Trang Create (projectId = 0)
    if (userStore.users.length === 0) {
      await userStore.fetchUsers();
    }
  }
};
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      loadAvailableUsers();
      selectedUsers.value = [];
      searchQuery.value = "";
    }
  },
  {
    immediate: true,
  },
);
const filteredUsers = computed(() => {
  const query = removeVietnameseTones(searchQuery.value.trim());
  // eslint-disable-next-line no-useless-assignment
  let users = [];
  if (props.projectId && props.projectId !== 0 && props.projectId !== "0") {
    users = projectStore.availableUsers || [];
  } else {
    users = userStore.users || [];
  }
  const existingMembers = Array.isArray(props.currentMembers) ? props.currentMembers : [];
  const existingIds = existingMembers.map((m) => m.userId || m.id);
  users = users.filter((u) => !existingIds.includes(u.id));
  if (!query) return users;
  return users.filter((user) => removeVietnameseTones(user.name).includes(query));
});
const toggleUser = (user) => {
  const index = selectedUsers.value.findIndex((u) => u.id === user.id);
  if (index > -1) {
    selectedUsers.value.splice(index, 1);
  } else {
    selectedUsers.value.push({ ...user, roleId: "" });
  }
};
const isSelected = (userId) => {
  return selectedUsers.value.some((u) => u.id === userId);
};
const getRoleForSelect = (userId) => {
  const selectedUser = selectedUsers.value.find((u) => u.id == userId);
  return selectedUser ? selectedUser.roleId : "";
};
const updateRole = (userId, newRole) => {
  const selectedUser = selectedUsers.value.find((u) => u.id === userId);
  if (selectedUser) {
    selectedUser.roleId = newRole;
  }
};
const handleApply = () => {
  const finalMembers = selectedUsers.value.filter((u) => u.roleId !== "");
  if (selectedUsers.value.length > 0 && finalMembers.length === 0) {
    alert("Vui lòng chọn Role (Vai trò) cho những thành viên bạn vừa tích chọn!");
    return;
  }
  emit("add", finalMembers);
  handleClose();
};

const handleClose = () => {
  selectedUsers.value = [];
  searchQuery.value = "";
  emit("close");
};
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="handleClose">
    <div class="modal-content">
      <h2 class="modal-title">Add member</h2>

      <div class="search-section">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search user..."
          class="search-input"
        />
        <button class="btn-search" @click="handleSearch">Search</button>
      </div>

      <div class="table-wrapper">
        <table class="user-table">
          <thead>
            <tr>
              <th style="width: 50px"></th>
              <th>User</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td>
                <input
                  type="checkbox"
                  :checked="isSelected(user.id)"
                  @change="toggleUser(user)"
                  class="custom-checkbox"
                />
              </td>
              <td>
                <div class="user-info">
                  <span class="user-name">{{ user.name }}</span>
                  <span class="user-email">{{ user.email }}</span>
                </div>
              </td>
              <td>
                <select
                  :value="getRoleForSelect(user.id)"
                  @change="(e) => updateRole(user.id, e.target.value)"
                  class="role-select"
                  :disabled="!isSelected(user.id)"
                >
                  <option value="">Select role...</option>
                  <option value="1">Backend Developer</option>
                  <option value="2">FrontEnd Developer</option>
                  <option value="3">Project Manager</option>
                  <option value="4">Tester</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @click="handleClose">Cancel</button>
        <button class="btn-apply" @click="handleApply">Apply</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  width: 600px;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.modal-title {
  text-align: center;
  font-size: 24px;
  color: #0e2040;
  margin-bottom: 25px;
  font-weight: 700;
}

/* Search Bar */
.search-section {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 12px 20px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #fdfdfd;
  outline: none;
}

.btn-search {
  padding: 0 30px;
  background: #ff3b3f;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
}

/* Table Style */
.table-wrapper {
  border: 1px solid #edf2f7;
  border-radius: 10px;
  overflow: hidden;
  max-height: 350px;
  overflow-y: auto;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table th {
  background: #f7fafc;
  text-align: left;
  padding: 12px;
  font-size: 13px;
  color: #718096;
}

.user-table td {
  padding: 12px;
  border-bottom: 1px solid #edf2f7;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: #2d3748;
}
.user-email {
  font-size: 12px;
  color: #a0aec0;
}

.role-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #4a5568;
  outline: none;
}

/* Checkbox Style */
.custom-checkbox {
  width: 18px;
  height: 18px;
  accent-color: #ff3b3f;
  cursor: pointer;
}

/* Footer Buttons */
.modal-footer {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.btn-cancel {
  padding: 12px 40px;
  background: #cbd5e0;
  color: white;
  border-radius: 30px;
  border: none;
  cursor: pointer;
}

.btn-apply {
  padding: 12px 40px;
  background: #ff3b3f;
  color: white;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

/* Inherit Font */
button,
input,
select {
  font-family: inherit;
}
</style>
