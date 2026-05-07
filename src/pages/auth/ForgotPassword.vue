<script setup>
import { ref } from "vue";
import BaseButton from "@/components/common/BaseButton.vue";
import BaseInput from "@/components/common/BaseInput.vue";

const email = ref("");

const handleSend = () => {
  if (email.value) {
    console.log("Gửi yêu cầu reset pass cho:", email.value);
    alert("Hệ thống đã gửi hướng dẫn lấy lại mật khẩu vào email của bạn!");
  }
};
</script>

<template>
  <div class="auth-wrapper">
    <h1 class="auth-title">Forgot Password</h1>
    <form @submit.prevent="handleSend">
      <BaseInput
        label="Email address"
        id="email"
        v-model="email"
        type="email"
        required
      />

      <BaseButton text="Send" type="submit" />

      <div class="auth-footer">
        <router-link to="/login" class="auth-link">
          Back to Login
        </router-link>
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
  line-height: 100%;
}
.auth-wrapper {
  animation: fadeIn 0.5s ease-in-out;
}

.auth-subtitle {
  font-size: 1.4rem;
  color: #666;
  margin-bottom: 3rem;
  line-height: 1.6;
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

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>