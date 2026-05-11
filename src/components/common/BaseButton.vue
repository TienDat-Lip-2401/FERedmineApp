<script setup>
defineProps({
  text: String,
  variant: {
    type: String,
    default: "danger",
  },
  type: {
    type: String,
    default: "button",
  },
});
</script>

<template>
  <button :type="type" :class="['btn-base', `btn-${variant}`]">
    <slot>{{ text }}</slot>
  </button>
</template>

<style scoped>
.btn-base {
  /* Bỏ width: 100% để nút co giãn theo nội dung */
  min-width: 12rem;
  height: 4.5rem;
  padding: 0 2rem;
  border: none;
  border-radius: 3rem;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

/* Biến thể màu đỏ (Danger) */
.btn-danger {
  background-color: #ff3b3f;
  color: white;
}

/* Biến thể màu xám (Outline/Cancel) */
.btn-outline {
  background-color: #cbd5e0;
  color: white;
}

.btn-base:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}
.btn-auth {
  width: 100%;
  height: 6.4rem; 
  font-size: 2.2rem;
  font-weight: 600;
  color: white;
  background-color: #ff3b3f;
  border-radius: 3.2rem; 
  box-shadow: 0 4px 15px rgba(255, 59, 63, 0.3); 
  margin-top: 2rem;
}

.btn-auth:hover {
  background-color: #e63538;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 59, 63, 0.4);
}
</style>
