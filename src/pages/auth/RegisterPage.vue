<script setup>
import { reactive, ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import BaseButton from "@/components/common/BaseButton.vue";
import BaseInput from "@/components/common/BaseInput.vue";

const router = useRouter();
const authStore = useAuthStore();
const formData = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});
const apiErrors = reactive({
  email: "",
  password: "",
  confirmPassword: "",
});
const isPasswordHidden = ref(true);
const isConfirmPasswordHidden = ref(true);
const isLoading = ref(false);
//Load dữ liệu
onMounted(() => {
  const draft = sessionStorage.getItem("register_form_draft");
  if (draft) {
    const parseDraft = JSON.parse(draft);
    formData.name = parseDraft.name;
    formData.email = parseDraft.email;
  }
});
//Lưu dữ liệu đang nhập vào session
watch(
  () => [formData.name, formData.email],
  ([newName, newEmail]) => {
    const dataSaved = {
      name: newName,
      email: newEmail,
    };
    sessionStorage.setItem("register_form_draft", JSON.stringify(dataSaved));
  },
);
const togglePassword = () => {
  isPasswordHidden.value = !isPasswordHidden.value;
};

const toggleConfirmPassword = () => {
  isConfirmPasswordHidden.value = !isConfirmPasswordHidden.value;
};

const handleRegister = async () => {
  apiErrors.email = "";
  apiErrors.password = "";
  apiErrors.confirmPassword = "";
  apiErrors.name="";
  if (!formData.name.trim()) {
    apiErrors.name = "Bạn chưa nhập tên!";
    return;
  }
  if (formData.password !== formData.confirmPassword) {
    apiErrors.confirmPassword = "Mật khẩu nhập lại không khớp!";
    return;
  }

  isLoading.value = true;
  try {
    await authStore.register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });

    alert("Đăng ký tài khoản thành công! Vui lòng đăng nhập.");
    sessionStorage.removeItem("register_form_draft");
    router.push("/auth/login"); // Chuyển hướng về trang Login
  } catch (error) {
    const responseData = error.response?.data;
    if (responseData && responseData.message) {
      const errorMsg = responseData.message;
      const lowerMsg = errorMsg.toLowerCase();
      if (lowerMsg.includes("email")) {
        apiErrors.email = errorMsg;
      } else if (lowerMsg.includes("mật khẩu") || lowerMsg.includes("password")) {
        apiErrors.password = errorMsg;
      } else {
        alert(errorMsg);
      }
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="auth-wrapper">
    <h1 class="auth-title">Register</h1>

    <form @submit.prevent="handleRegister" novalidate>
      <div class="form-group">
        <BaseInput
          label="Full Name"
          id="name"
          v-model="formData.name"
          type="text"
          class="auth-input"
          required
        />
        <Transition name="slide-fade">
          <span v-if="apiErrors.name" class="error-text">{{ apiErrors.name }}</span>
        </Transition>
      </div>

      <div class="form-group">
        <BaseInput
          label="Email"
          id="email"
          v-model="formData.email"
          type="email"
          class="auth-input"
          required
        />
        <Transition name="slide-fade">
          <span v-if="apiErrors.email" class="error-text">{{ apiErrors.email }}</span>
        </Transition>
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
        <Transition name="slide-fade">
          <span v-if="apiErrors.password" class="error-text">{{ apiErrors.password }}</span>
        </Transition>
      </div>

      <div class="form-group form-group-password" style="margin-bottom: 2.5rem">
        <BaseInput
          label="Confirm Password"
          id="confirmPassword"
          v-model="formData.confirmPassword"
          :type="isConfirmPasswordHidden ? 'password' : 'text'"
          class="auth-input"
          required
        />
        <button type="button" class="btn btn-link toggle-password" @click="toggleConfirmPassword">
          {{ isConfirmPasswordHidden ? "Show" : "Hide" }}
        </button>
        <Transition name="slide-fade">
          <span v-if="apiErrors.confirmPassword" class="error-text">{{
            apiErrors.confirmPassword
          }}</span>
        </Transition>
      </div>

      <BaseButton text="Create Account" type="submit" variant="auth" />

      <div class="auth-footer">
        <p class="auth-prompt">
          <span>Already have an account? </span>
          <router-link to="/auth/login" class="auth-link font-bold">Login here</router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<style scoped>
.auth-title {
  font-size: 3.2rem;
  font-weight: 500;
  margin-bottom: 2rem;
  color: #333333;
}

.auth-wrapper {
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

.form-group {
  margin-bottom: 1.5rem;
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

.auth-prompt {
  margin-top: 1.5rem;
  color: #666;
  font-size: 1.4rem;
  text-decoration: none;
}

.font-bold {
  font-weight: 600;
}
.error-text {
  display: block;
  color: #ff383c;
  font-size: 1.2rem;
  margin-top: 0.5rem;
  font-weight: 500;
  text-align: left;
}

/* HIỆU ỨNG TRANSITION CỦA VUE */

/* 1. Thiết lập tốc độ và kiểu chuyển động */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-in-out;
  max-height: 50px;
  opacity: 1;
  overflow: hidden;
}

/* 2. Trạng thái lúc bắt đầu xuất hiện (enter-from) và lúc kết thúc biến mất (leave-to) */
.slide-fade-enter-from,
.slide-fade-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
  transform: translateY(-5px);
}
</style>
