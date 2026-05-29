import { createRouter, createWebHashHistory } from "vue-router";
import { authGuard } from "./guards/auth.guard";
import { authRoutes } from "./modules/auth.routes";
import { dashBoardRoutes } from "./modules/dashboard.routes";
import { projectRoutes } from "./modules/project.routes";
import { userRoutes } from "./modules/user.routes";
import { taskRoutes } from "./modules/task.routes";
import { performanceRoutes } from "./modules/performance.routes";
import { workLogRoutes } from "./modules/worklog.routes";
import { positionRoutes } from "./modules/position.routes";
import { roleRoutes } from "./modules/role.routes";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    ...authRoutes,
    ...dashBoardRoutes,
    ...projectRoutes,
    ...userRoutes,
    ...taskRoutes,
    ...performanceRoutes,
    ...workLogRoutes,
    ...positionRoutes,
    ...roleRoutes,
  ],
});
router.beforeEach(authGuard);
export default router;
