<script setup>
import { useI18n } from "vue-i18n";
const { locale } = useI18n();
const toggleLanguage = () => {
  locale.value = locale.value === "vi" ? "en" : "vi";
  localStorage.setItem("locale", locale.value);
};
</script>

<template>
  <header class="auth-header">
    <div class="header-spacer"></div>

    <div class="logo-wrapper">
      <img src="@/assets/images/logo.png" alt="Logo" class="logo-img" />
    </div>

    <div class="lang-wrapper">
      <button class="lang-selector" @click="toggleLanguage" type="button">
        <span class="flag-icon">{{ locale === "vi" ? "🇻🇳" : "🇬🇧" }}</span>
        <span class="lang-text">{{ locale === "vi" ? "VI" : "EN" }}</span>
      </button>
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
</style>
