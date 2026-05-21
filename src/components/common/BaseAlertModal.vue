<script setup>
import { useModalStore } from "@/stores/modalStore";
import BaseButton from "@/components/common/BaseButton.vue";

const modalStore = useModalStore();
</script>
<template>
  <div v-if="modalStore.isOpen" class="modal-overlay" @click.self="modalStore.closeModal">
    <div class="alert-card">
      <h3 class="modal-title" :class="{ 'text-danger': modalStore.type === 'error' }">
        {{ modalStore.title }}
      </h3>

      <p class="modal-message">{{ modalStore.message }}</p>

      <div class="modal-footer">
        <BaseButton
          v-if="modalStore.type === 'confirm'"
          variant="outline"
          @click="modalStore.closeModal"
        >
          Hủy
        </BaseButton>

        <BaseButton
          :variant="modalStore.type === 'error' ? 'danger' : 'primary'"
          @click="
            modalStore.type === 'confirm' ? modalStore.confirmModal() : modalStore.closeModal()
          "
        >
          {{ modalStore.type === "confirm" ? "Xác nhận" : "Đóng" }}
        </BaseButton>
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
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000; /* Cho cao hơn các modal khác */
}

.alert-card {
  background: white;
  width: 400px;
  padding: 2.5rem;
  border-radius: 1.2rem;
  text-align: center;
}

.modal-title {
  font-size: 2rem;
  font-weight: 700;
  color: #0e2040;
  margin-bottom: 1.5rem;
}

.text-danger {
  color: #ff3b3f; /* Màu đỏ của bạn */
}

.modal-message {
  font-size: 1.4rem;
  color: #64748b;
  margin-bottom: 2.5rem;
  line-height: 1.5;
}

.modal-footer {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}
</style>
