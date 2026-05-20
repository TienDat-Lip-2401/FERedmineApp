<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const isOpen = ref(false);
const menuRef = ref(null);

const toggle = () => (isOpen.value = !isOpen.value);
const close = () => (isOpen.value = false);

// Logic xử lý khi click ra ngoài menu thì tự đóng
const handleClickOutside = (event) => {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    close();
  }
};

onMounted(() => document.addEventListener("click", handleClickOutside));
onUnmounted(() => document.removeEventListener("click", handleClickOutside));
</script>

<template>
  <div class="base-menu" ref="menuRef">
    <div @click.stop="toggle" class="menu-trigger">
      <slot name="trigger" />
    </div>

    <Transition name="slide-fade">
      <div v-if="isOpen" class="menu-content" @click="close">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.base-menu {
  position: relative;
  display: inline-block;
}
.menu-trigger {
  cursor: pointer;
}

.menu-content {
  width: 120px;
  height: auto;
  position: absolute;
  top: 60%;
  right: 10px;
  padding: 8px 0;
  background: white;
  border-radius: 5px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid #78787833;
  z-index: 100;
  margin-top: 10px;
  overflow: hidden;
}
:slotted(.menu-item) {
  padding: 12px 16px;
  font-size: 1.2rem;
  font-weight: 500;
  color: #333333;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  background: transparent;
  display:flex;
  align-items:center;
  justify-content:flex-start;
}
:slotted(.menu-item.delete) {
  color: #ef4444;
  border-top: 1px solid #f1f5f9;
  margin-top: 4px;
  padding-top: 12px;
}
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.1s ease-in;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
