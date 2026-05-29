
import { ROUTE_NAMES } from "../constants/routeNames";
export const authRoutes = [
  {
    path: "/auth",
    component: () => import("@/layouts/AuthLayout/AuthLayout.vue"),
    children: [
      {
        path: "login",
        name: ROUTE_NAMES.LOGIN,
        component: () => import("@/pages/auth/Login.vue"),
      },
      {
        path: "forgot-password",
        name: ROUTE_NAMES.FORGOT_PASSWORD,
        component: () => import("@/pages/auth/ForgotPassword.vue"),
      },
      {
        path: "reset-password",
        name: ROUTE_NAMES.RESET_PASSWORD,
        component: () => import("@/pages/auth/ResetPassword.vue"),
      },
    ],
  },
];
