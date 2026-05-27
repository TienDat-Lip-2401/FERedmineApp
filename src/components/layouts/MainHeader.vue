<script setup>
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import nontificationIcon from "@/assets/icons/notification.svg";
import { useAuthStore } from "@/stores/authStore";
import BaseMenu from "../common/BaseMenu.vue";

const { locale } = useI18n();
const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  await authStore.logout();
  router.push({ name: "Login" });
};
const goToProfile = () => {
  router.push("/users/profile");
};
const goToResetPassword = () => {
  router.push("/auth/reset-password");
};
const toggleLanguage = () => {
  locale.value = locale.value === "vi" ? "en" : "vi";
  localStorage.setItem("locale", locale.value);
};
</script>

<template>
  <header class="main-header">
    <div class="header-left">
      <img src="@/assets/images/logo.png" alt="Logo" class="logo-img" />
    </div>
    <div class="header-right">
      <!-- Language Switcher Widget -->
      <button class="lang-selector" @click="toggleLanguage" type="button">
        <span class="flag-icon">{{ locale === 'vi' ? '🇻🇳' : '🇬🇧' }}</span>
        <span class="lang-text">{{ locale === 'vi' ? 'VI' : 'EN' }}</span>
      </button>

      <div class="notification-icon">
        <i class="icon-bell">
          <img :src="nontificationIcon" alt="Notification Icon" class="notification-svg" />
        </i>
        <span class="badge">10</span>
      </div>
      <BaseMenu>
        <template #trigger>
          <div class="user-profile">
            <div class="user-info">
              <p class="user-name">{{ authStore.user?.name || $t("common.header.not_logged_in") }}</p>
              <p class="user-role">
                {{
                  authStore.user?.positions?.includes("Admin")
                    ? "Admin"
                    : authStore.user?.positions?.includes("Project Manager")
                      ? "Project Manager"
                      : authStore.user?.positions?.[0]
                }}
              </p>
            </div>
            <img src="@/assets/images/avatar.png" alt="Avatar" class="user-avatar" />
          </div>
        </template>
        <div class="menu-item" @click="goToProfile"><i class="icon-edit"></i> {{ $t("common.header.edit_profile") }}</div>
        <div class="menu-item" @click="goToResetPassword">
          <i class="icon-edit"></i> {{ $t("common.header.change_password") }}
        </div>
        <div class="menu-item delete" @click="handleLogout">
          <i class="icon-logout"></i> {{ $t("common.header.logout") }}
        </div>
      </BaseMenu>
    </div>
  </header>
</template>

<style scoped>
.lang-selector {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  cursor: pointer;
  color: #0d062d;
  font-family: inherit;
  font-size: 1.4rem;
  font-weight: 500;
  transition: all 0.3s ease;
}
.lang-selector:hover {
  background: rgba(0, 0, 0, 0.04);
  transform: translateY(-1px);
}
.lang-selector:active {
  transform: translateY(0);
}
.flag-icon {
  font-size: 1.8rem;
  line-height: 1;
}
.lang-text {
  font-size: 1.3rem;
  font-weight: 600;
  color: #5d7285;
}
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 72px;
  color: #ffffff;
  border-bottom: 0.1rem solid #eeeeee;
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0 20px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
.header-left {
  display: flex;
  align-items: center;
}
.logo-img {
  height: 67px;
  width: 205px;
  object-fit: cover;
  user-select: none;
  -webkit-user-drag: none;
  max-height: 100%;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}
.notification-icon {
  position: relative;
  cursor: pointer;
  width: 41px;
  height: 35px;
  .icon-bell.notification-svg {
    font-size: 10px;
  }
  .badge {
    position: absolute;
    top: -5px;
    right: -2px;
    background-color: #ff4d4f;
    color: white;
    border-radius: 5px;
    padding: 2px 6px;
    font-size: 10px;
  }
}
.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  .user-info {
    font-style: inter;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    .user-name {
      font-size: 16px;
      font-weight: 400;
      color: #0d062d;
    }
    .user-role {
      font-size: 14px;
      color: #787486;
    }
  }
  .user-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    user-select: none;
    -webkit-user-drag: none;
  }
}
:deep(.menu-content) {
  top: 80%;
  right: -1px;
}
</style>
