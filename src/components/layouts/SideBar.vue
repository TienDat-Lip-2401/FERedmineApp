<script setup>
import IconProject from "@/assets/icons/Projects.svg";
import IconTasks from "@/assets/icons/Tasks.svg";
import IconWorkLogs from "@/assets/icons/WorkLogs.svg";
import IconPerformance from "@/assets/icons/Perfomance.svg";
import IconUsers from "@/assets/icons/Setting.svg";
import IconPositions from "@/assets/icons/Setting.svg";
import IconRoles from "@/assets/icons/Setting.svg";
import { ref } from "vue";
const menuItems = [
  { name: "Projects", icon: IconProject, active: true, path: "/projects" },
  { name: "Tasks", icon: IconTasks, active: false, path: "/tasks" },
  { name: "Work Logs", icon: IconWorkLogs, active: false, path: "/work-logs" },
  { name: "Performance", icon: IconPerformance, active: false, path: "/performance" },
  { name: "Users", icon: IconUsers, active: false, path: "/users" },
  { name: "Positions", icon: IconPositions, active: false, path: "/positions" },
  { name: "Roles", icon: IconRoles, active: false, path: "/roles" },
];
const activeName = ref(menuItems[0].name);
const handleActiveItem = (name) => {
  activeName.value = name;
  // menuItems.forEach((item) => {
  //   item.active = item.name === name;
  // });
};
</script>

<template>
  <aside class="sidebar">
    <nav class="siderbar-nav">
      <RouterLink
        class=""
        v-for="item in menuItems"
        :key="item.name"
        :class="['nav-item', { active: activeName === item.name }]"
        :to="item.path"
        @click="handleActiveItem(item.name)"
      >
        <span class="nav-icon">
          <img :src="item.icon" alt="Icon" class="icon" />
        </span>
        <span class="nav-text">{{ item.name }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 314px;
  height: 100vh;
  border-right: 1px solid #eee;
  padding: 2rem 0;
  background-color: #fff;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.02);
}
.nav-item {
  display: flex;
  align-items: center;
  padding: 1.5rem 3rem;
  gap: 1.5rem;
  color: #5D7285;
  transition: all 0.3s ease;
}
.nav-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
}
.icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.nav-text {
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0.01em;
}
.nav-item.active {
  background-color: #FFF5F5;
  border-right: 3px solid #FF383C;
}

.nav-item.active .nav-text {
  color: #FF383C;
  font-weight: 500;
}

/* Hiệu ứng Hover để người dùng biết là bấm được */
.nav-item:hover:not(.active) {
  background-color: #f9f9f9;
}
</style>
