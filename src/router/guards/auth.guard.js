import { useAuthStore } from "@/stores/authStore";
import { ROUTE_NAMES } from "../constants/routeNames";
export const authGuard = (to, from) => {
  const authStore = useAuthStore();
  const publicRoutes = [ROUTE_NAMES.LOGIN, ROUTE_NAMES.FORGOT_PASSWORD];
  const isPublic = publicRoutes.includes(to.name);
  const isAuthenticated = authStore.isAuthenticated;
  if (isPublic) {
    if (isAuthenticated) {
      return { name: ROUTE_NAMES.HOME };
    } else {
      return;
    }
  } else {
    if (!isAuthenticated) {
      return { name: ROUTE_NAMES.LOGIN };
    } else {
      return;
    }
  }
};
