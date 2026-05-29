import { ROUTE_NAMES } from "../constants/routeNames";
export const positionRoutes = [
  {
    path: "/positions",
    component: () => import("@/layouts/DefaultLayout/DefaultLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: ROUTE_NAMES.POSITIONS,
        component: () => import("@/pages/dashboard/PositionsPage.vue"),
      },
    ],
  },
];
