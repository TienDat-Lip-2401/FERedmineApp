<script setup>
import AuthHeader from "@/components/layouts/AuthHeader.vue";
</script>

<template>
  <div class="auth-layout">
    <AuthHeader />
    <div class="auth-content">
      <div class="auth-card">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
}
.auth-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.auth-card {
  width: 100%;
  max-width: 50rem;
  padding: 0 2rem;
}
</style>
