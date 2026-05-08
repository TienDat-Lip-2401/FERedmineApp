<script setup>
import MainHeader from "@/components/layouts/MainHeader.vue";
import SideBar from "@/components/layouts/SideBar.vue";
</script>

<template>
  <div class="default-layout">
    <MainHeader />
    <main class="main-content">
      <SideBar />
      <div class="page-content">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
.default-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.page-content {
  flex: 1; 
  padding: 2rem;
  background-color: #f4f7fe;
  overflow-y: auto;
}
</style>
