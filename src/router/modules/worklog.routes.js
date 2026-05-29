import { ROUTE_NAMES } from "../constants/routeNames";
export const workLogRoutes = [
  {
    path: "/work-logs",
    component: () => import("@/layouts/DefaultLayout/DefaultLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: ROUTE_NAMES.WORK_LOG,
        component: () => import("@/pages/dashboard/WorkLogsPage.vue"),
      },
    ],
  },
];
