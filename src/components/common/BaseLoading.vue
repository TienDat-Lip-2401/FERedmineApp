<script setup>
defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    default: "Đang xử lý...", // Chữ hiển thị bên dưới vòng xoay
  },
});
</script>

<template>
  <Transition name="fade">
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="spinner"></div>
        <p class="loading-text">{{ text }}</p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Lớp phủ mờ toàn màn hình */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.8); /* Nền trắng mờ */
  backdrop-filter: blur(2px); /* Hiệu ứng blur xịn xò của Apple */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999; /* Đảm bảo nằm trên cùng mọi thứ */
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

/* Hiệu ứng vòng xoay */
.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb; /* Màu xám nhạt */
  border-top-color: #ef4444; /* Màu đỏ chủ đạo của dự án bạn */
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  color: #374151;
  font-size: 1.4rem;
  font-weight: 500;
}

/* Hiệu ứng xoay */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Hiệu ứng mờ dần khi ẩn/hiện */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
