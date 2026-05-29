import { ROUTE_NAMES } from "../constants/routeNames";
export const roleRoutes = [
  {
    path: "/roles",
    component: () => import("@/layouts/DefaultLayout/DefaultLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: ROUTE_NAMES.ROLES,
        component: () => import("@/pages/dashboard/RolesPage.vue"),
      },
    ],
  },
];
