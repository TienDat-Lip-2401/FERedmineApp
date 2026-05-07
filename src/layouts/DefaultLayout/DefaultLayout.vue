<script setup>
import MainHeader from "@/components/layouts/MainHeader.vue";
import SideBar from "@/components/layouts/SideBar.vue";
</script>

<template>
  <div class="default-layout">
    <MainHeader />
    <main class="main-content">
      <SideBar />
      <RouterView/> 
    </main>
  </div>
</template>

<style scoped></style>
