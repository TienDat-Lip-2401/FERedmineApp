<script setup>
import { reactive, ref } from "vue";
import BaseButton from "@/components/common/BaseButton.vue";
import BaseInput from "@/components/common/BaseInput.vue";
const formData = reactive({
  email: "",
  password: "",
  rememberMe: false,
});
const isPasswordHidden = ref(true);
const togglePassword = () => {
  isPasswordHidden.value = !isPasswordHidden.value;
};
const handleLogin = () => {
  console.log("Dữ liệu Đạt gửi lên:", formData);
  alert("Đang tiến hành đăng nhập cho: " + formData.email);
};
</script>

<template>
  <div class="login-wrapper">
    <h1 class="auth-title">Login</h1>
    <form action="" @submit.prevent="handleLogin">
      <div class="form-group">
        <BaseInput
          label="Email"
          id="email"
          v-model="formData.email"
          type="email"
          class="auth-input"
          required
        />
      </div>
      <div class="form-group form-group-password">
        <BaseInput
          label="Password"
          id="password"
          v-model="formData.password"
          :type="isPasswordHidden ? 'password' : 'text'"
          class="auth-input"
          required
        />
        <button type="button" class="btn btn-link toggle-password" @click="togglePassword">
          {{ isPasswordHidden ? "Show" : "Hide" }}
        </button>
      </div>
      <div class="auth-extra">
        <label class="remember-me">
          <input v-model="formData.rememberMe" type="checkbox" />
          Remember me
        </label>
      </div>
      <BaseButton text="Login" type="submit" className="btn-login" />
      <div class="auth-footer">
        <router-link to="/auth/forgot-password" class="auth-link"> Forgot your password </router-link>
      </div>
    </form>
  </div>
</template>

<style scoped>
.auth-title {
  font-size: 3.2rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: #333333;
}
.login-wrapper {
  animation: fadeIn 0.5s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.form-group-password {
  position: relative;
}
.toggle-password {
  position: absolute;
  right: 0.5rem;
  top: 20%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: #666;
  cursor: pointer;
  font-weight: 500;
  user-select: none;
}
.auth-footer {
  margin-top: 2.5rem;
  text-align: center;
  color: #FF383C;
  text-decoration: underline;
}
.btn-login {
  margin-top: 1.5rem;
}
</style>
