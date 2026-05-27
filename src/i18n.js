import { createI18n } from "vue-i18n";
import viAuth from "@/locales/vi/auth.json";
import enAuth from "@/locales/en/auth.json";
import viSidebar from "@/locales/vi/sidebar.json";
import enSidebar from "@/locales/en/sidebar.json";
import viCommon from "@/locales/vi/common.json";
import enCommon from "@/locales/en/common.json";
import viProjects from "@/locales/vi/projects.json";
import enProjects from "@/locales/en/projects.json";
import viUsers from "@/locales/vi/users.json";
import enUsers from "@/locales/en/users.json";

const messages = {
  vi: {
    ...viAuth,
    ...viSidebar,
    ...viCommon,
    ...viProjects,
    ...viUsers,
  },
  en: {
    ...enAuth,
    ...enSidebar,
    ...enCommon,
    ...enProjects,
    ...enUsers,
  },
};

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("locale") || "en",
  fallbackLocale: "vi",
  messages,
});

export default i18n;
