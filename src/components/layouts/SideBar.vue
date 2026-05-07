<script setup>
import IconProject from "@/assets/icons/Projects.svg";
import IconTasks from "@/assets/icons/Tasks.svg";
import IconWorkLogs from "@/assets/icons/WorkLogs.svg";
import IconPerformance from "@/assets/icons/Perfomance.svg";
import IconUsers from "@/assets/icons/Setting.svg";
import IconPositions from "@/assets/icons/Setting.svg";
import IconRoles from "@/assets/icons/Setting.svg";

const menuItems = [
  { name: "Projects", icon: IconProject, active: true, path: "/projects" },
  { name: "Tasks", icon: IconTasks, active: false, path: "/tasks" },
  { name: "Work Logs", icon: IconWorkLogs, active: false, path: "/work-logs" },
  { name: "Performance", icon: IconPerformance, active: false, path: "/performance" },
  { name: "Users", icon: IconUsers, active: false, path: "/users" },
  { name: "Positions", icon: IconPositions, active: false, path: "/positions" },
  { name: "Roles", icon: IconRoles, active: false, path: "/roles" },
];
</script>

<template>
  <aside class="sidebar">
    <nav class="siderbar-nav">
      <RouterLink
        class=""
        v-for="item in menuItems"
        :key="item.name"
        :class="['nav-item', { active: item.active }]"
        :to="item.path"
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
  box-shadow:
    rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
    rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
}
.nav-item {
  display: flex;
  align-items: center;
  padding: 1.5rem 3rem;
  gap: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  .nav-text {
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 1%;
  }
  nav-icon.icon {
    width: 24px;
    height: 24px;
    color: #5D7285;
  }
}
</style>
