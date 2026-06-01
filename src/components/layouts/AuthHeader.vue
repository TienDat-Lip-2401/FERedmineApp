<script setup>
import { useI18n } from "vue-i18n";
import BaseMenu from "../common/BaseMenu.vue";

const { locale } = useI18n();

const changeLanguage = (lang) => {
  locale.value = lang;
  localStorage.setItem("locale", lang);
};
</script>

<template>
  <header class="auth-header">
    <div class="header-spacer"></div>

    <div class="logo-wrapper">
      <img src="@/assets/images/logo.png" alt="Logo" class="logo-img" />
    </div>

    <div class="lang-wrapper">
      <BaseMenu class="lang-menu">
        <template #trigger>
          <button class="lang-selector" type="button">
            <span class="flag-icon">{{ locale === "vi" ? "🇻🇳" : "🇬🇧" }}</span>
            <span class="lang-text">{{ locale === "vi" ? "VI" : "EN" }}</span>
            <span class="chevron-icon">▼</span>
          </button>
        </template>
        <div class="menu-item" :class="{ active: locale === 'vi' }" @click="changeLanguage('vi')">
          <span class="flag-icon-menu">🇻🇳</span> Tiếng Việt
        </div>
        <div class="menu-item" :class="{ active: locale === 'en' }" @click="changeLanguage('en')">
          <span class="flag-icon-menu">🇬🇧</span> English
        </div>
      </BaseMenu>
    </div>
  </header>
</template>

<style scoped>
.auth-header {
  width: 100%;
  height: 72px;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 0.1rem solid #eeeeee;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
.header-spacer,
.lang-wrapper {
  flex: 1;
  display: flex;
}
.lang-wrapper {
  justify-content: center;
  align-items: center;
}
.logo-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
}
.logo-img {
  height: 205px;
  width: 205px;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
}
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
.chevron-icon {
  font-size: 0.9rem;
  color: #787486;
  transition: transform 0.2s ease;
  margin-left: 2px;
}
.lang-selector:hover .chevron-icon {
  color: #0d062d;
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
.flag-icon-menu {
  font-size: 1.6rem;
  margin-right: 10px;
  line-height: 1;
}
.lang-menu :deep(.menu-content) {
  top: 100% !important;
  right: 0 !important;
  min-width: 140px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  margin-top: 8px;
}
.lang-menu :deep(.menu-item) {
  padding: 10px 16px;
  font-size: 1.3rem;
  font-weight: 500;
  color: #5d7285;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}
.lang-menu :deep(.menu-item:hover) {
  background: #f8fafc;
  color: #0d062d;
}
.lang-menu :deep(.menu-item.active) {
  background: #f1f5f9;
  color: #0d062d;
  font-weight: 600;
}
</style>
