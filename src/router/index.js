import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/pages/home/Home.vue";
import Login from "@/pages/auth/Login.vue";
import ForgotPassword from "@/pages/auth/ForgotPassword.vue";
import ResetPassword from "@/pages/auth/ResetPassword.vue";
import AuthLayout from "@/layouts/AuthLayout/AuthLayout.vue";
import DefaultLayout from "@/layouts/DefaultLayout/DefaultLayout.vue";
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
          path: "project",
          name: "Project",
          component: Home,
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
