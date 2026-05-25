<script setup>
import { reactive, ref } from "vue";
import BaseButton from "@/components/common/BaseButton.vue";
import BaseInput from "@/components/common/BaseInput.vue";
import { useRouter } from "vue-router";
import { useModalStore } from "@/stores/modalStore";
import { useAuthStore } from "@/stores/authStore";
const router = useRouter();
const modalStore = useModalStore();
const authStore = useAuthStore();
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const formData = reactive({
  password: "",
  confirmPassword: "",
});
const formError = reactive({
  password: "",
  confirmPassword: "",
});
const isPasswordHidden = ref(true);
const isConfirmPasswordHidden = ref(true);
const isLoading = ref(false);
const handleReset = async () => {
  formError.password = "";
  formError.confirmPassword = "";
  if (!formData.password) {
    formError.password = "Vui lòng nhập mật khẩu mới.";
    return;
  } else if (!passwordRegex.test(formData.password)) {
    formError.password = "Mật khẩu phải từ 8 ký tự, gồm số, chữ hoa và ký tự đặc biệt.";
    return;
  }
  if (!formData.confirmPassword) {
    formError.confirmPassword = "Vui lòng xác nhận lại mật khẩu.";
    return;
  } else if (formData.password !== formData.confirmPassword) {
    // Nếu có nhập nhưng bị lệch với ô trên
    formError.confirmPassword = "Mật khẩu xác nhận không khớp, vui lòng kiểm tra lại!";
    return;
  }
  try {
    isLoading.value = true;

    // Gửi duy nhất newPassword xuống C#
    await authStore.resetPassword({
      newPassword: formData.password,
    });
    modalStore.showModal({
      title: "Thành công",
      message: "Chúc mừng! Bạn đã đổi mật khẩu thành công.",
      type: "success",
    });
    formData.password = "";
    formData.confirmPassword = "";

    // 3. Đẩy về trang chủ
    router.push("/");
  } catch (error) {
    formError.password =
      error.response?.data?.message || "Đổi mật khẩu thất bại, vui lòng thử lại!";
  } finally {
    isLoading.value = false;
  }
};
const togglePassword = () => {
  isPasswordHidden.value = !isPasswordHidden.value;
};
const toggleConfirmPassword = () => {
  isConfirmPasswordHidden.value = !isConfirmPasswordHidden.value;
};
</script>

<template>
  <div class="auth-wrapper">
    <h1 class="auth-title">Reset Password</h1>

    <form @submit.prevent="handleReset" novalidate>
      <div class="form-group form-group-password">
        <BaseInput
          label="New Password"
          id="password"
          v-model="formData.password"
          :type="isPasswordHidden ? 'password' : 'text'"
          required
        >
        </BaseInput>
        <button type="button" class="btn btn-link toggle-password" @click="togglePassword">
          {{ isPasswordHidden ? "Show" : "Hide" }}
        </button>
        <Transition name="slide-fade">
          <span v-if="formError.password" class="error-text">{{ formError.password }}</span>
        </Transition>
      </div>

      <div class="form-group form-group-confirm-password">
        <BaseInput
          label="Confirm Password"
          id="confirmPassword"
          v-model="formData.confirmPassword"
          :type="isConfirmPasswordHidden ? 'password' : 'text'"
          required
        >
        </BaseInput>
        <button
          type="button"
          class="btn btn-link toggle-confirm-password"
          @click="toggleConfirmPassword"
        >
          {{ isConfirmPasswordHidden ? "Show" : "Hide" }}
        </button>
        <Transition name="slide-fade">
          <span v-if="formError.confirmPassword" class="error-text">{{
            formError.confirmPassword
          }}</span>
        </Transition>
      </div>

      <BaseButton text="Save" type="submit" variant="auth" />

      <div class="auth-footer">
        <router-link to="/auth/login" class="auth-link"> Back to Login </router-link>
      </div>
    </form>
  </div>
</template>

<style scoped>
.auth-wrapper {
  animation: fadeIn 0.5s ease-in-out;
}

.toggle-btn {
  background: none;
  border: none;
  color: #666;
  font-size: 1.2rem;
  cursor: pointer;
  font-weight: 500;
  padding: 0.5rem;
}

.toggle-btn:hover {
  color: #33a6ff;
}

.auth-footer {
  margin-top: 2.5rem;
  text-align: center;
}

.auth-link {
  color: #ff3b3f;
  text-decoration: none;
  font-size: 1.4rem;
  font-weight: 500;
}

.auth-link:hover {
  text-decoration: underline;
}
.form-group {
  position: relative;
}
.toggle-confirm-password {
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
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-in-out;
  max-height: 50px;
  opacity: 1;
  overflow: hidden;
}
.error-text {
  color: #ff3b3f; /* Màu đỏ đồng bộ với theme của bạn */
  font-size: 1.3rem;
  display: block;
  margin-top: -0.5rem; /* Kéo lên gần input một chút */
  margin-bottom: 1.5rem;
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
