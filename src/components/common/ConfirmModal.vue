<script setup>
defineProps({
  isOpen: Boolean,
  message: {
    type: String,
    default: "Are you sure you want to delete it?",
  },
});
const emit = defineEmits(["close", "confirm"]);
import BaseButton from "@/components/common/BaseButton.vue";
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
    <div class="confirm-card">
      <p class="confirm-text">{{ message }}</p>
      <div class="confirm-actions">
        <BaseButton @click="emit('close')" variant="outline">Cancel</BaseButton>
        <BaseButton @click="emit('confirm')" variant="danger">Delete</BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4); /* Làm tối nền */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.confirm-card {
  background-color: white;
  width: 450px;
  padding: 4rem 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  text-align: center;
  animation: fadeIn 0.3s ease-out;
}

.confirm-text {
  font-size: 2rem;
  font-weight: 500;
  color: #1a202c;
  margin-bottom: 3.5rem;
  line-height: 1.4;
}

.confirm-actions {
  display: flex;
  justify-content: center;
  gap: 2rem; /* Tạo khoảng cách giữa 2 nút */
}

/* Hiệu ứng hiện ra nhẹ nhàng */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
