<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import BaseInput from "@/components/common/BaseInput.vue";
import AddMemberModal from "@/components/project/AddMemberModal.vue";
import ConfirmModal from "@/components/common/ConfirmModal.vue";
import { useProjectStore } from "@/stores/projectStore.js";
import { useModalStore } from "@/stores/modalStore";
import trashIcon from "@/assets/icons/trash.svg";
const projectStore = useProjectStore();
const router = useRouter();
const isModalOpen = ref(false);
const modalStore = useModalStore();
// Xử lý xác nhận xóa thành viên
const isConfirmOpen = ref(false);
const memberIndexToDelete = ref(null);
const form = ref({
  projectCode: "",
  title: "",
  startDate: "",
  endDate: "",
  description: "",
  pmId: "",
  status: 1,
  isPublic: false,
  isActive: true,
  members: [],
  stats: [
    { label: "Progress", current: Math.ceil(Math.random() * 100), total: 100 },
    { label: "Tasks", current: Math.ceil(Math.random() * 100), total: 600 },
    { label: "Bugs", current: Math.ceil(Math.random() * 100), total: 100 },
  ],
});
const getRoleName = (roleId) => {
  const roles = {
    1: "Backend Developer",
    2: "FrontEnd Developer",
    3: "Project Manager",
    4: "Tester",
  };
  return roles[roleId] || "Member";
};
const triggerDelete = (index) => {
  memberIndexToDelete.value = index;
  isConfirmOpen.value = true;
};
const confirmDelete = () => {
  if (memberIndexToDelete.value !== null) {
    form.value.members.splice(memberIndexToDelete.value, 1);
    isConfirmOpen.value = false;
    memberIndexToDelete.value = null;
  }
};
const onAddMembers = (selectedList) => {
  if (!selectedList || selectedList.length === 0) return;

  selectedList.forEach((newMember) => {
    // Check trùng lặp bằng userId
    const isExisted = form.value.members.some(
      (m) => (m.userId || m.id) === (newMember.userId || newMember.id),
    );
    console.log(newMember);
    if (!isExisted) {
      form.value.members.push({
        userId: newMember.id,
        userName: newMember.name,
        email: newMember.userEmail,
        roleId: parseInt(newMember.roleId),
        roleName: getRoleName(newMember.roleId),
      });
    }
  });

  isModalOpen.value = false;
};
const handleSave = async () => {
  try {
    // Đóng gói Payload chuẩn theo DTO của Backend C#
    const projectPayload = {
      projectCode: form.value.projectCode,
      title: form.value.title,
      startDate: form.value.startDate ? new Date(form.value.startDate).toISOString() : null,
      endDate: form.value.endDate ? new Date(form.value.endDate).toISOString() : null,
      description: form.value.description,
      projectManagerId: parseInt(form.value.pmId) || 0,
      status: form.value.status,
      isPublic: form.value.isPublic,
      isActive: form.value.isActive,

      // Mảng memberIds chỉ lấy ID và Role để gửi lên
      memberIds: form.value.members.map((m) => ({
        userId: parseInt(m.userId || m.id),
        roleId: parseInt(m.roleId),
      })),
    };
    console.log(projectPayload);
    // Gọi hàm addProject từ Store
    await projectStore.addProject(projectPayload);

    // Tạo thành công thì quay về trang danh sách
    router.push("/projects");
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Đã xảy ra lỗi khi tạo dự án. Vui lòng thử lại!";
    modalStore.showModal({
      title: "Thất bại",
      message: errorMessage,
      type: "error", // Đổi type thành error để UI hiển thị màu đỏ/cảnh báo
    });
  }
};
</script>

<template>
  <div class="create-project-container">
    <h2 class="page-title">Create Project</h2>
    <div class="form-card">
      <BaseInput
        label="Project Code"
        v-model="form.projectCode"
        required
        placeholder="Nhập mã dự án..."
      />
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
        <select v-model="form.pmId" class="field-select">
          <option value="">Chọn quản lý...</option>
          <option value="13">PM-01</option>
          <option value="14">PM-02</option>
          <option value="15">PM-03</option>
          <option value="16">PM-04</option>
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
            <tr v-for="(m, index) in form.members" :key="index">
              <td>{{ index + 1 }}</td>
              <td class="font-bold">{{ m.userName }}</td>
              <td>{{ getRoleName(m.roleId) }}</td>
              <td class="text-center">
                <button class="btn-delete" @click="triggerDelete(index)">
                  <img :src="trashIcon" alt="Delete" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="form-footer-options">
        <div class="status-group">
          <label class="field-label">Status</label>
          <div class="radio-options">
            <label><input type="radio" v-model="form.status" :value="0" /> Active</label>
            <label><input type="radio" v-model="form.status" :value="1" /> Pending</label>
            <label><input type="radio" v-model="form.status" :value="2" /> Completed</label>
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
        <button class="btn-cancel" @click="router.push('/projects')">Cancel</button>
        <button class="btn-save" @click="handleSave">Save</button>
      </div>
    </div>
    <AddMemberModal
      :isOpen="isModalOpen"
      :projectId="0"
      :currentMembers="form.members"
      @close="isModalOpen = false"
      @add="onAddMembers"
    />
    <ConfirmModal :isOpen="isConfirmOpen" @close="isConfirmOpen = false" @confirm="confirmDelete" />
  </div>
</template>

<style scoped>
.create-project-container {
  /* max-width: 1000px; */
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
</style>
