import { ROUTE_NAMES } from "../constants/routeNames";
export const projectRoutes = [
  {
    path: "/projects",
    component: () => import("@/layouts/DefaultLayout/DefaultLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: ROUTE_NAMES.PROJECT_LIST,
        component: () => import("@/pages/projects/ProjectsPage.vue"),
      },
      {
        path: "create",
        name: ROUTE_NAMES.CREATE_PROJECT,
        component: () => import("@/pages/projects/CreateProjectPage.vue"),
      },
      {
        path: "update/:id",
        name: ROUTE_NAMES.UPDATE_PROJECT,
        component: () => import("@/pages/projects/UpdateProjectPage.vue"),
      },
    ],
  },
];
