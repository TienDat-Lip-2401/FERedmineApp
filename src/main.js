import { createApp } from "vue";
import { createPinia } from "pinia";
import "@/styles/index.css";
import App from "./App.vue";
import router from "./router";
import i18n from "./i18n";
import { setupAuthInterceptor } from "@/api/authInterceptor";
const app = createApp(App);
app.use(i18n);
app.use(createPinia());
app.use(router);
// Kích hoạt tầng xử lý Auth cho axios
setupAuthInterceptor();
router.beforeEach((to) => {
  console.log("Navigating to:", to.fullPath);
});
app.mount("#app");
