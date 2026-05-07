<script setup>
import nontificationIcon from "@/assets/icons/notification.svg";
</script>

<template>
  <header class="main-header">
    <div class="header-left">
      <img src="@/assets/images/logo.png" alt="Logo" class="logo-img" />
    </div>
    <div class="header-right">
      <div class="notification-icon">
        <i class="icon-bell">
          <img :src="nontificationIcon" alt="Notification Icon" class="notification-svg" />
        </i>
        <span class="badge">10</span>
      </div>
      <div class="user-profile">
        <div class="user-info">
          <p class="user-name">Nguyễn Tiến Đạt</p>
          <p class="user-role">PHP Developer</p>
        </div>
        <img src="@/assets/images/avatar.png" alt="Avatar" class="user-avatar" />
      </div>
    </div>
  </header>
</template>

<style scoped>
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
</style>
