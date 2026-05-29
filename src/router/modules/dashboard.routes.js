import { ROUTE_NAMES } from "../constants/routeNames";
export const dashBoardRoutes = [
  {
    path: "/",
    component: () => import("@/layouts/DefaultLayout/DefaultLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: ROUTE_NAMES.HOME,
        component: () => import("@/pages/home/Home.vue"),
      },
    ],
  },
];
