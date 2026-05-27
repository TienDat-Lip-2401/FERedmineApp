import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/pages/home/Home.vue";
import Login from "@/pages/auth/Login.vue";
import ForgotPassword from "@/pages/auth/ForgotPassword.vue";
import ResetPassword from "@/pages/auth/ResetPassword.vue";
import AuthLayout from "@/layouts/AuthLayout/AuthLayout.vue";
import DefaultLayout from "@/layouts/DefaultLayout/DefaultLayout.vue";
import TasksPage from "@/pages/dashboard/TasksPage.vue";
import Performance from "@/pages/dashboard/PerformancePage.vue";
import Roles from "@/pages/dashboard/RolesPage.vue";
import UsersPage from "@/pages/user/UsersPage.vue";
import WorkLogsPage from "@/pages/dashboard/WorkLogsPage.vue";
import PositionsPage from "@/pages/dashboard/PositionsPage.vue";
import CreateProjectPage from "@/pages/projects/CreateProjectPage.vue";
import ProjectsPage from "@/pages/projects/ProjectsPage.vue";
import CreateUserPage from "@/pages/user/CreateUserPage.vue";
import ProfilePage from "@/pages/user/ProfilePage.vue";
import UpdateProjectPage from "@/pages/projects/UpdateProjectPage.vue";
import UpdateUserPage from "@/pages/user/UpdateUserPage.vue";
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: DefaultLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: "",
          name: "Home",
          component: Home,
        },
        {
          path: "projects",
          name: "Project",
          component: ProjectsPage,
        },
        {
          path: "projects/create",
          name: "CreateProject",
          component: CreateProjectPage,
        },
        {
          path: "projects/update/:id",
          name: "UpdateProject",
          component: UpdateProjectPage,
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
          path: "users/create",
          name: "CreateUser",
          component: CreateUserPage,
        },
        {
          path: "users/profile",
          name: "Profile",
          component: ProfilePage,
        },
        {
          path: "users/update/:id",
          name: "UpdateUser",
          component: UpdateUserPage,
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
        },
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
          meta: { guestOnly: true },
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

router.beforeEach((to, from) => {
  // 1. SỬA Ở ĐÂY: Kiểm tra xem có thông tin user không (thay vì kiểm tra token)
  const isAuthenticated = !!localStorage.getItem("user");

  // 2. Kiểm tra các thuộc tính meta của Route hiện tại
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isGuestOnly = to.matched.some((record) => record.meta.guestOnly);

  // TRƯỜNG HỢP 1: Truy cập trang yêu cầu đăng nhập mà chưa đăng nhập
  if (requiresAuth && !isAuthenticated) {
    // Đẩy về trang Login
    return { name: "Login" };
  }

  // TRƯỜNG HỢP 2: Đã đăng nhập rồi nhưng cố tình vào lại trang Login/Quên mật khẩu
  if (isGuestOnly && isAuthenticated) {
    // Đẩy về trang chủ (Home)
    return { name: "Home" };
  }

  // Cho phép đi tiếp bình thường
  return true;
});
export default router;
