<script setup>
import { reactive, ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { authService } from "@/services/auth";
import BaseButton from "@/components/common/BaseButton.vue";
import BaseInput from "@/components/common/BaseInput.vue";
const router = useRouter();
const authStore = useAuthStore();
const formData = reactive({
  email: "",
  password: "",
  rememberMe: false,
});
const apiErrors = reactive({
  email: "",
  password: "",
  general: "", // Dùng cho các lỗi chung chung
});
const isPasswordHidden = ref(true);
const isLoading = ref(false);
onMounted(() => {
  const draft = sessionStorage.getItem("login_form_draft");
  if (draft) {
    const parseDraft = JSON.parse(draft);
    formData.email = parseDraft.email;
    formData.password = parseDraft.password;
  }
});
watch(
  () => [formData.email, formData.password],
  ([newEmail, newPassword]) => {
    const dataSaved = {
      email: newEmail,
      password: newPassword,
    };
    sessionStorage.setItem("login_form_draft", JSON.stringify(dataSaved));
  },
);
const togglePassword = () => {
  isPasswordHidden.value = !isPasswordHidden.value;
};
const handleLogin = async () => {
  apiErrors.email = "";
  apiErrors.password = "";
  apiErrors.general = "";

  if (!formData.email.trim()) {
    apiErrors.email = "Vui lòng nhập email";
  }

  if (!formData.password.trim()) {
    apiErrors.password = "Vui lòng nhập mật khẩu";
  }
  if (apiErrors.email || apiErrors.password) {
    return;
  }
  isLoading.value = true;
  try {
    const response = await authService.login({
      email: formData.email,
      password: formData.password,
    });
    console.log("Login successful:", response.data);
    const { access_token, refresh_token, user_id, name, positions } = response.data;
    authStore.setAuthData(access_token, refresh_token, {
      id: user_id,
      name: name,
      positions: positions,
    });
    sessionStorage.removeItem("login_form_draft");
    router.push("/");
  } catch (error) {
    const errorMsg = error.response?.data?.message || "Đăng nhập không thành công";

    // Gán vào lỗi chung để hiển thị tập trung
    apiErrors.general = errorMsg;
  } finally {
    isLoading.value = false;
  }
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
      <div v-if="apiErrors.email" class="error-box">
        {{ apiErrors.email }}
      </div>
      <div v-else-if="apiErrors.password" class="error-box">
        {{ apiErrors.password }}
      </div>
      <div v-else-if="apiErrors.general" class="error-box">
        {{ apiErrors.general }}
      </div>
      <BaseButton text="Login" type="submit" variant="auth" />
      <div class="auth-footer">
        <router-link to="/auth/forgot-password" class="auth-link">
          Forgot your password
        </router-link>
        <p class="register-prompt">
          <span>Don't have an account? </span>
          <router-link to="/auth/register" class="auth-link font-bold">Register here</router-link>
        </p>
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
  background: none;
  border: none;
}
.auth-footer {
  margin-top: 2.5rem;
  text-align: center;
}
.auth-link {
  color: #ff383c;
  text-decoration: underline;
  transition: opacity 0.2s ease;
}

.auth-link:hover {
  opacity: 0.8;
}

.register-prompt {
  margin-top: 1.5rem;
  color: #666;
  font-size: 1.4rem;
}
.register-prompt span {
  text-decoration: none;
}
.font-bold {
  font-weight: 600;
}
.error-box {
  background-color: #fff5f5;
  color: #ff383c;
  border: 1px solid #ffccd0;
  padding: 1rem 1.5rem;
  border-radius: 6px;
  font-size: 1.4rem;
  font-weight: 500;
  margin-bottom: 2rem;
  text-align: center;
  animation: shake 0.2s ease-in-out; /* Hiệu ứng rung nhẹ khi xuất hiện */
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}
</style>
