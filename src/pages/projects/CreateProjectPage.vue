<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import BaseInput from "@/components/common/BaseInput.vue";
import AddMemberModal from "@/components/project/AddMemberModal.vue";
import ConfirmModal from "@/components/common/ConfirmModal.vue";
import { useProjectStore } from "@/stores/projectStore.js";
const projectStore = useProjectStore();
const isModalOpen = ref(false);
// Xử lý xác nhận xóa thành viên
const isConfirmOpen = ref(false);
const memberIndexToDelete = ref(null);
const triggerDelete = (index) => {
  memberIndexToDelete.value = index;
  isConfirmOpen.value = true;
};
const confirmDelete = () => {
  if (memberIndexToDelete.value !== null) {
    members.value.splice(memberIndexToDelete.value, 1);
    isConfirmOpen.value = false;
    memberIndexToDelete.value = null; // Reset lại
  }
};
const onAddMembers = (selectedList) => {
  selectedList.forEach((newMember) => {
    const isExisted = members.value.some((m) => m.email === newMember.email);
    if (!isExisted) {
      // Đẩy thành viên mới vào mảng members
      members.value.push({
        name: newMember.name,
        role: newMember.role,
        email: newMember.email, // Thêm email để sau này dễ quản lý
      });
    }
  });
  isModalOpen.value = false;
};
const handleSave = () => {
  const newProject = {
    ...form,
    code: `PR0J-${projectStore.projects.length + 1}`,
    timeline: `${form.startDate} - ${form.endDate}`,
    id: form.id || `P${Date.now()}`,
    members: members.value,
    createdAt: new Date().toLocaleDateString(),
  };

  projectStore.addProject(newProject);
  router.push("/projects");
};
const router = useRouter();
const form = reactive({
  id: "",
  title: "",
  startDate: "",
  endDate: "",
  description: "",
  pmName: "",
  status: "Active",
  isPublic: false,
  isActive: true,
  stats: [
    { label: "Progress", current: Math.ceil(Math.random() * 100), total: 100 },
    { label: "Tasks", current: Math.ceil(Math.random() * 100), total: 600 },
    { label: "Bugs", current: Math.ceil(Math.random() * 100), total: 100 },
  ],
});
const members = ref([
  { name: "Nguyễn Văn A", role: "Backend Developer" },
  { name: "Nguyễn Văn B", role: "FrontEnd Developer" },
  { name: "Nguyễn Thị C", role: "Project Manager" },
]);
// const removeMember = (index) => {
//   members.value.splice(index, 1);
// };
</script>

<template>
  <div class="create-project-container">
    <h2 class="page-title">Create Project</h2>
    <div class="form-card">
      <BaseInput label="ID" v-model="form.id" required placeholder="Nhập mã dự án..." />
      <BaseInput label="Title" v-model="form.title" required placeholder="Nhập tên dự án..." />

      <div class="input-group">
        <BaseInput type="date" label="Start date" v-model="form.startDate" />
        <BaseInput type="date" label="End date" v-model="form.endDate" />
      </div>

      <div class="field-container">
        <label class="field-label">Description</label>
        <textarea v-model="form.description" class="field-textarea" rows="4"></textarea>
      </div>

      <div class="field-container">
        <label class="field-label">Manager</label>
        <select v-model="form.pmName" class="field-select">
          <option value="">Chọn quản lý...</option>
          <option value="pm-01">PM-01</option>
          <option value="pm-02">PM-02</option>
          <option value="pm-03">PM-03</option>
          <option value="pm-04">PM-04</option>
        </select>
      </div>
      <div class="members-section">
        <div class="section-header">
          <label class="field-label">Members</label>
          <button class="btn-add-member" @click="isModalOpen = true">+ Add member</button>
        </div>

        <table class="members-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Role</th>
              <th class="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(m, index) in members" :key="index">
              <td>{{ index + 1 }}</td>
              <td class="font-bold">{{ m.name }}</td>
              <td>{{ m.role }}</td>
              <td class="text-center">
                <button @click="triggerDelete(index)" class="btn-delete">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="form-footer-options">
        <div class="status-group">
          <label class="field-label">Status</label>
          <div class="radio-options">
            <label><input type="radio" v-model="form.status" value="Active" /> Active</label>
            <label><input type="radio" v-model="form.status" value="Pending" /> Pending</label>
            <label><input type="radio" v-model="form.status" value="Completed" /> Completed</label>
          </div>
        </div>

        <div class="toggle-group">
          <div class="toggle-item">
            <span>Public</span>
            <input type="checkbox" v-model="form.isPublic" class="switch" />
          </div>
          <div class="toggle-item">
            <span>Active</span>
            <input type="checkbox" v-model="form.isActive" class="switch" />
          </div>
        </div>
      </div>
      <div class="form-actions">
        <button class="btn-cancel" @click="router.back()">Cancel</button>
        <button class="btn-save" @click="handleSave">Save</button>
      </div>
    </div>
    <AddMemberModal :isOpen="isModalOpen" @close="isModalOpen = false" @add="onAddMembers" />
    <ConfirmModal :isOpen="isConfirmOpen" @close="isConfirmOpen = false" @confirm="confirmDelete" />
  </div>
</template>

<style scoped>
.create-project-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}
.page-title {
  font-size: 3rem;
  font-weight: 700;
  color: #0e2040;
  margin-bottom: 2rem;
}
.form-card {
  background: #fff;
  padding: 3rem;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}
.input-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
.field-container {
  margin-bottom: 2rem;
  .field-label {
    margin-bottom: 1rem;
  }
}
.field-label {
  display: block;
  font-size: 1.6rem;
  font-weight: 400;
  color: #000000;
  line-height: 1;
}
.field-textarea,
.field-select {
  width: 100%;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.8rem;
  font-family: inherit;
  outline: none;
}
.members-section {
  margin-top: 2rem;
}
.section-header {
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  align-items: center;
  line-height: 1;
  margin-bottom: 1rem;
}
.btn-add-member {
  font-family: inherit;
  font-size: 1.6rem;
  background: none;
  border: none;
  color: #ff383c;
  font-weight: 400;
  cursor: pointer;
  line-height: 1;
}

.members-table {
  width: 100%;
  margin-top: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
}

.members-table th {
  text-align: left;
  padding: 1.2rem;
  background: #f8fafc;
  color: #718096;
  font-size: 1.2rem;
}

.members-table td {
  padding: 1.2rem;
  border-bottom: 1px solid #edf2f7;
  font-size: 1.4rem;
}

/* Footer & Switch */
.form-footer-options {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 3rem;
}

.radio-options {
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
}
.radio-options label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 1.4rem;
}

.radio-options input[type="radio"] {
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid #cbd5e0;
  border-radius: 50%;
  margin-right: 8px;
  position: relative;
  cursor: pointer;
  transition: 0.2s;
}
.radio-options input[type="radio"]:checked {
  border-color: #ff3b3f; /* Viền chuyển đỏ */
}
.radio-options input[type="radio"]:checked::after {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #ff3b3f;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.toggle-group {
  display: flex;
  gap: 4rem;
}

.toggle-item {
  display: flex;
  flex-direction: column;
  align-items: center; /* Chữ nằm giữa trên đầu nút gạt */
  gap: 0.8rem;
}

.toggle-item span {
  font-size: 1.4rem;
  color: #4a5568;
}

/* Nút gạt xịn */
.switch {
  appearance: none;
  width: 36px;
  height: 18px;
  background-color: #e2e8f0; /* Màu xám khi tắt */
  border-radius: 20px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;
}

.switch:checked {
  background-color: #ff3b3f; /* Màu đỏ khi bật */
}

/* Cục tròn trắng bên trong */
.switch::before {
  content: "";
  position: absolute;
  width: 14px;
  height: 14px;
  background-color: white;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: 0.3s;
}

.switch:checked::before {
  left: 20px; /* Đẩy cục tròn sang phải */
}
/* Nút bấm */
.form-actions {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 4rem;
}

.btn-cancel {
  padding: 1.2rem 4rem;
  background: #cbd5e0;
  color: #fff;
  border-radius: 2.5rem;
  border: none;
  cursor: pointer;
}

.btn-save {
  padding: 1.2rem 4rem;
  background: #ff3b3f;
  color: #fff;
  border-radius: 2.5rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
}
</style>
