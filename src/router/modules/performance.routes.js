import { ROUTE_NAMES } from "../constants/routeNames";
export const performanceRoutes = [
  {
    path: "/performance",
    component: () => import("@/layouts/DefaultLayout/DefaultLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: ROUTE_NAMES.PERFORMANCE,
        component: () => import("@/pages/dashboard/PerformancePage.vue"),
      },
    ],
  },
];
