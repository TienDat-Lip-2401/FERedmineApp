<script setup>
import { reactive, ref } from "vue";
import BaseButton from "@/components/common/BaseButton.vue";
import BaseInput from "@/components/common/BaseInput.vue";

const formData = reactive({
  password: "",
  confirmPassword: "",
});

const isPasswordHidden = ref(true);
const isConfirmPasswordHidden = ref(true);

const handleReset = () => {
  if (formData.password !== formData.confirmPassword) {
    alert("Mật khẩu xác nhận không khớp, vui lòng kiểm tra lại!");
    return;
  }
  console.log("Mật khẩu mới:", formData.password);
  alert("Chúc mừng! Bạn đã đổi mật khẩu thành công.");
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

    <form @submit.prevent="handleReset">
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
        <button type="button" class="btn btn-link toggle-confirm-password" @click="toggleConfirmPassword">
          {{ isConfirmPasswordHidden ? "Show" : "Hide" }}
        </button>
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
</style>
