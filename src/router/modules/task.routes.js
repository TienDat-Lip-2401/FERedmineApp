import { ROUTE_NAMES } from "../constants/routeNames";
export const taskRoutes = [
  {
    path: "/tasks",
    component: () => import("@/layouts/DefaultLayout/DefaultLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: ROUTE_NAMES.TASK,
        component: () => import("@/pages/dashboard/TasksPage.vue"),
      },
    ],
  },
];
