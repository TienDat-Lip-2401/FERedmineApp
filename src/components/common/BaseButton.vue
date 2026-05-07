<script setup>
defineProps({
  text: String,
  type: {
    type: String,
    default: "button",
  },
  className: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <button :type="type" :class="['btn-base', className]">
    {{ text }}
  </button>
</template>

<style scoped>
.btn-base {
  width: 100%;
  height: 5.2rem;
  background-color: #ff3b3f; /* Màu đỏ Redmine của Đạt */
  color: white;
  border: none;
  border-radius: 3rem;
  font-size: 1.8rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    opacity 0.2s,
    transform 0.1s;
}

.btn-base:hover {
  opacity: 0.9;
}

.btn-base:active {
  transform: scale(0.98);
}
</style>
