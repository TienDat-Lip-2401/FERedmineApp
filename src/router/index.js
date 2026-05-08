import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/pages/home/Home.vue";
import Login from "@/pages/auth/Login.vue";
import ForgotPassword from "@/pages/auth/ForgotPassword.vue";
import ResetPassword from "@/pages/auth/ResetPassword.vue";
import AuthLayout from "@/layouts/AuthLayout/AuthLayout.vue";
import DefaultLayout from "@/layouts/DefaultLayout/DefaultLayout.vue";
import ProjectPage from "@/pages/dashboard/ProjectsPage.vue";
import TasksPage from "@/pages/dashboard/TasksPage.vue";
import Performance from "@/pages/dashboard/PerformancePage.vue";
import Roles from "@/pages/dashboard/RolesPage.vue";
import UsersPage from "@/pages/dashboard/UsersPage.vue";
import WorkLogsPage from "@/pages/dashboard/WorkLogsPage.vue";
import PositionsPage from "@/pages/dashboard/PositionsPage.vue";
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: DefaultLayout,
      children: [
        {
          path: "",
          name: "Home",
          component: Home,
        },
        {
          path: "projects",
          name: "Project",
          component: ProjectPage,
        },
        {
          path: "tasks",
          name: "Tasks",
          component: TasksPage,
        },
        {
          path: "performance",
          name: "Performance",
          component: Performance,
        },
        {
          path: "roles",
          name: "Roles",
          component: Roles,
        },
        {
          path: "users",
          name: "Users",
          component: UsersPage,
        },
        {
          path: "work-logs",
          name: "WorkLogs",
          component: WorkLogsPage,
        },
        {
          path: "positions",
          name: "Positions",
          component: PositionsPage,
        }
      ],
    },
    {
      path: "/auth",
      component: AuthLayout,
      children: [
        {
          path: "login",
          name: "Login",
          component: Login,
        },
        {
          path: "forgot-password",
          name: "ForgotPassword",
          component: ForgotPassword,
        },
        {
          path: "reset-password",
          name: "ResetPassword",
          component: ResetPassword,
        },
      ],
    },
  ],
});

export default router;
