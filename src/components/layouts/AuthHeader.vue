<script setup>
</script>

<template>
    <header class="auth-header">
        <div class = "logo-wrapper">
            <img src="@/assets/images/logo.png" alt="Logo" class="logo-img" />
        </div>
    </header>
</template>

<style scoped>
.auth-header {
    width: 100%;
    height: 72px;
    color: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 0.1rem solid #eeeeee;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
.logo-wrapper {
  display: flex;
  justify-content: center;
}
.logo-img {
  height: 205px;
  width: 205px;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
}
</style>
