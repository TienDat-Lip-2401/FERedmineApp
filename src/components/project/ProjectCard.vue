<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import MenuIcon from "@/assets/icons/Menu.svg";
import BaseMenu from "@/components/common/BaseMenu.vue";
const authStore = useAuthStore();
const router = useRouter();
const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["edit", "delete"]);
const currentUser = computed(() => authStore.user);
const hasPermission = computed(() => {
  if(!currentUser.value) return false;
  const isAdmin = currentUser.value.positions?.includes("Admin");
  const isProjectManager = currentUser.value.id === props.project.projectManagerId;
  return isAdmin || isProjectManager;
})
const handleEdit = () => {
  router.push({
    name: "UpdateProject",
    params: { id: props.project.id },
  });
  console.log("Edit project with ID:", props.project.id);
  emit("edit", props.project.id);
};

const handleDelete = () => {
  emit("delete", props.project.id);
};
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
const randomNumber = () => {
  return Math.floor(Math.random() * 101);
};
const progressPercent = randomNumber();
const tasksPercent = randomNumber();
const bugsPercent = randomNumber();
</script>

<template>
  <div class="project-card">
    <!-- Header -->
    <div class="card-header">
      <div class="title-group">
        <h3>{{ project.title }}</h3>
        <span class="project-id">{{ project.projectCode }}</span>
      </div>

      <BaseMenu v-if="hasPermission">
        <template #trigger>
          <button class="btn-more">
            <img :src="MenuIcon" alt="Menu" />
          </button>
        </template>

        <div class="menu-item edit" @click="handleEdit">Edit</div>
        <div class="menu-item delete" @click="handleDelete">Delete</div>
      </BaseMenu>
    </div>
    <!-- Body -->
    <div class="card-body">
      <p class="pm-text">
        PM: <span>PM-{{ project.projectManagerId }}</span>
      </p>
      <div class="members-section">
        <span class="members-label">Members:</span>
        <div class="avatar-group">
          <div
            v-for="(member, index) in project.members.slice(0, 4)"
            :key="member.id"
            class="avatar-item"
            :style="{ zIndex: 10 - index }"
          >
            <img v-if="member.avatar" :src="member.avatar" :alt="member.userName" />
            <div v-else class="avatar-placeholder" :class="'color-' + (index % 4)">
              {{ member.userName.trim().split(/\s+/).pop().charAt(0).toUpperCase() }}
            </div>
          </div>

          <div v-if="project.members.length > 4" class="avatar-more">
            +{{ project.members.length - 4 }}
          </div>
        </div>
      </div>
      <div class="stat-list">
        <!-- <div class="stat-item" v-for="stat in project.stats" :key="stat.label">
          <div class="stat-label">
            <span>Progress: </span>
            <span>75%</span>
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              style="width: 75%;"
            ></div>
          </div>
        </div> -->
        <div class="stat-item">
          <div class="stat-label">
            <span>Progress:</span>
            <span>75%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
        </div>

        <div class="stat-item">
          <div class="stat-label">
            <span>Tasks:</span>
            <span>42/50</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: tasksPercent + '%' }"></div>
          </div>
        </div>

        <div class="stat-item">
          <div class="stat-label">
            <span>Bugs:</span>
            <span>3/15</span>
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: bugsPercent + '%', backgroundColor: '#ef4444' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <!-- Footer -->
    <div class="card-footer">
      <span class="status-badge" :class="project.isActive ? 'Active' : 'Pending'">{{
        project.isActive ? "Active" : "Pending"
      }}</span>
      <span class="timeline"
        >Timeline:
        <span class="time"
          >{{ formatDate(project.startDate) }} - {{ formatDate(project.endDate) }}</span
        ></span
      >
    </div>
  </div>
</template>

<style scoped>
.project-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.project-card:hover {
  transform: translateY(-5px);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}
.title-group {
  display: flex;
  flex-direction: column;
  .h3 {
    font-size: 26px;
    font-weight: 600;
    margin: 0;
  }
  .project-id {
    font-size: 12px;
    font-weight: 500;
    color: #888;
  }
}
.btn-more {
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: #000000;
  .img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.btn-more:hover {
  background-color: #e5e5e5;
  transform: scale(1.05);
}

.btn-more:active {
  transform: scale(0.95);
}
.pm-text {
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #787486;
}

.pm-text span {
  font-weight: 500;
}
.members-section {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}
.members-label {
  font-size: 12px;
  font-weight: 700;
  color: #787486;
}
.avatar-group {
  display: flex;
  align-items: center;
}
.avatar-item {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #fff;
  margin-left: -8px;
  overflow: hidden;
  background-color: #eee;
}
.avatar-item:first-child {
  margin-left: 0;
}
.avatar-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
}
/* Màu giả lập cho placeholder nếu không có ảnh */
.color-0 {
  background-color: #ff9f43;
}
.color-1 {
  background-color: #28c76f;
}
.color-2 {
  background-color: #ea5455;
}
.color-3 {
  background-color: #7367f0;
}
.avatar-more {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #fce1d1;
  color: #f2994a;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -8px;
  border: 2px solid #fff;
  z-index: 1;
}
/* Stats */
.stats-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}
.stat-label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 500;
  color: #787486;
  margin-bottom: 6px;
}
.progress-bar {
  height: 16px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #dc3545;
  border-radius: 4px;
}
.card-footer {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  padding-top: 15px;
  border-top: 1px solid #f5f5f5;
}
.status-badge {
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 15px;
  font-weight: 400;
}
.status-badge.Active {
  background: #198754;
  color: #ffffff;
}
.status-badge.Pending {
  background: #f40505;
  color: #fefefe;
}
.status-badge.Completed {
  background: #fdfeff;
  color: #0c6d97;
}
.timeline {
  font-size: 12px;
  font-weight: 700;
  color: #787486;
  .time {
    font-weight: 500;
  }
}
</style>
