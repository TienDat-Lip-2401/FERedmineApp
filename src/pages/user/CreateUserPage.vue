<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import BaseInput from "@/components/common/BaseInput.vue";
import BaseButton from "@/components/common/BaseButton.vue";
import ConfirmModal from "@/components/common/ConfirmModal.vue";
import trashIcon from "@/assets/icons/trash.svg";
import AssignPositionModal from "@/components/user/AssignPositionModal.vue";

const isAssignModalOpen = ref(false);
const onAddPositions = (selectedList) => {
  selectedList.forEach((newPos) => {
    // Chỉ thêm nếu chưa tồn tại trong danh sách positions hiện tại
    if (!positions.value.some((p) => p.id === newPos.id)) {
      positions.value.push(newPos);
    }
  });
  isAssignModalOpen.value = false;
};
const router = useRouter();
const userStore = useUserStore();
const form = reactive({
  code: "",
  name: "",
  email: "",
  phone: "",
  gender: "Male",
  birthday: "",
  joinedDate: "",
  leavedDate: "",
  isActive: true,
});
const positions = ref([
  { id: 1, name: "Backend Developer" },
  { id: 2, name: "Frontend Developer" },
  { id: 3, name: "Business Analyst" },
  { id: 4, name: "Project Manager" },
  { id: 5, name: "Tester" },
]);
const isConfirmOpen = ref(false);
const positionIndexToDelete = ref(null);
const triggerDeletePosition = (index) => {
  positionIndexToDelete.value = index;
  isConfirmOpen.value = true;
};
const confirmDeletePosition = () => {
  if (positionIndexToDelete.value !== null) {
    positions.value.splice(positionIndexToDelete.value, 1);
    isConfirmOpen.value = false;
    positionIndexToDelete.value = null;
  }
};
const handleSave = () => {
  const newUser = {
    ...form,
    id: Date.now(),
    positions: [...positions.value],
    status: form.isActive ? "Active" : "Inactive",
  };
  userStore.addUser(newUser);
  router.push("/users");
};
</script>

<template>
  <div class="create-user-container">
    <h2 class="page-title">Create User</h2>

    <div class="form-card">
      <BaseInput label="Code" v-model="form.code" required placeholder="Enter user code..." />

      <BaseInput label="Name" v-model="form.name" required placeholder="Enter full name..." />

      <BaseInput
        label="Email"
        v-model="form.email"
        type="email"
        required
        placeholder="Enter email address..."
      />

      <BaseInput label="Phone number" v-model="form.phone" placeholder="Enter phone number..." />

      <div class="input-grid">
        <div class="field-container">
          <label class="field-label">Gender</label>
          <select v-model="form.gender" class="custom-select">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <BaseInput label="Birthday" v-model="form.birthday" type="date" />
      </div>

      <div class="input-grid">
        <BaseInput label="Joined Date" v-model="form.joinedDate" type="date" />
        <BaseInput label="Leaved Date" v-model="form.leavedDate" type="date" />
      </div>

      <div class="positions-section">
        <div class="section-header">
          <label class="field-label">Position</label>
          <button class="btn-assign" @click="isAssignModalOpen = true">+ Assign Position</button>
        </div>

        <table class="positions-table">
          <thead>
            <tr>
              <th width="10%">No</th>
              <th width="70%">Name</th>
              <th width="20%" class="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(pos, index) in positions" :key="pos.id">
              <td>{{ index + 1 }}</td>
              <td>{{ pos.name }}</td>
              <td class="text-center">
                <button class="btn-delete" @click="triggerDeletePosition(index)">
                  <img :src="trashIcon" alt="Delete" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="status-switch">
        <span class="field-label">Active</span>
        <input type="checkbox" v-model="form.isActive" class="switch" />
      </div>

      <div class="form-actions">
        <BaseButton variant="outline" @click="router.back()">Cancle</BaseButton>
        <BaseButton variant="danger" @click="handleSave">Save</BaseButton>
      </div>
    </div>

    <ConfirmModal
      :isOpen="isConfirmOpen"
      @close="isConfirmOpen = false"
      @confirm="confirmDeletePosition"
    />
    <AssignPositionModal :isOpen="isAssignModalOpen" @close="isAssignModalOpen = false" @add="onAddPositions" />
  </div>
</template>

<style scoped>
.create-user-container {
  padding: 2rem 3rem;
  background-color: #f5f7fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  
}
.page-title {
  font-size: 3rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  width: 100%;
  /* max-width: 900px; */
}
.form-card {
  background: white;
  border-radius: 8px;
  padding: 2.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  width: 100%;
  /* max-width: 900px; */
}
.input-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}
.input-grid:first-of-type {
  grid-template-columns: 0.8fr 1.2fr;
}
.field-container {
  display: flex;
  flex-direction: column;
}
.field-label {
  display: block;
  font-size: 1.4rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.8rem;
}
.custom-select {
  width: 100%;
  padding: 0.75rem;
  height: 48px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1.6rem;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.2s;
  box-sizing: border-box;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23374151' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2.5rem;
}
.custom-select:focus {
  outline: none;
  border-color: #3b82f6;
}
.positions-section {
  margin: 2rem 0;
}

.section-header {
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.6rem;
  font-weight: 400;
}

.btn-assign {
  background-color: transparent;
  color: #ff383c;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
  margin-bottom: 0.8rem;
}

.btn-assign:hover {
  opacity: 0.8;
}

/* Positions Table */
.positions-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}

.positions-table thead {
  background-color: #f9fafb;
}

.positions-table th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.positions-table th.text-center {
  text-align: center;
}
.positions-table td {
  padding: 0.75rem 1rem;
  font-size: 1.6rem;
  font-weight: 400;
  color: #000000;
  border-bottom: 1px solid #e5e7eb;
}

.text-center {
  text-align: center;
}

.btn-delete {
  width: 14px;
  height: 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0.25rem;
  transition: transform 0.2s;
  display: inline-block;
  .img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.btn-delete:hover {
  transform: scale(1.2);
}

/* Status Switch */
.status-switch {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
  padding: 1.5rem 0;
  border-top: 1px solid #e5e7eb;
}

.switch {
  position: relative;
  width: 44px;
  height: 24px;
  appearance: none;
  background: #d1d5db;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.switch::before {
  content: "";
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  top: 2px;
  left: 2px;
  transition: transform 0.3s;
}

.switch:checked {
  background-color: #ef4444;
}

.switch:checked::before {
  transform: translateX(20px);
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

/* BaseInput Component Deep Styles */
:deep(.base-input-wrapper) {
  margin-bottom: 1.5rem;
}

:deep(.base-input-label) {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

:deep(.base-input-label.required::after) {
  content: " *";
  color: #ef4444;
}

:deep(.base-input-field) {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

:deep(.base-input-field:focus) {
  outline: none;
  border-color: #3b82f6;
}

:deep(.base-input-field::placeholder) {
  color: #9ca3af;
}

/* BaseButton Deep Styles */
:deep(.base-button) {
  padding: 0.75rem 2.5rem;
  border-radius: 25px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

:deep(.base-button.outline) {
  background-color: #9ca3af;
  color: white;
  border: none;
}

:deep(.base-button.outline:hover) {
  background-color: #6b7280;
}

:deep(.base-button.danger) {
  background-color: #ef4444;
  color: white;
}

:deep(.base-button.danger:hover) {
  background-color: #dc2626;
}

/* Responsive */
@media (max-width: 1200px) {
  .create-user-container {
    padding: 1.5rem;
  }

  .form-card {
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .create-user-container {
    padding: 1rem;
  }

  .form-card {
    padding: 1.5rem;
  }

  .input-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  :deep(.base-button) {
    width: 100%;
  }

  .positions-table {
    font-size: 0.85rem;
  }

  .positions-table th,
  .positions-table td {
    padding: 0.5rem;
  }
}
</style>
