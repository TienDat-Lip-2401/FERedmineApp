import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/home/Home.vue";
import Login from "@/pages/auth/Login.vue";
import ForgotPassword from "@/pages/auth/ForgotPassword.vue";
import ResetPassword from "@/pages/auth/ResetPassword.vue";
import AuthLayout from "@/layouts/AuthLayout/AuthLayout.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
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
