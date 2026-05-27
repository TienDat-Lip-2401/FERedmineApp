<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import BaseButton from "@/components/common/BaseButton.vue";
import BaseInput from "@/components/common/BaseInput.vue";
import { useModalStore } from "@/stores/modalStore";
import { useUserStore } from "@/stores/userStore";

const { t } = useI18n();
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const modalStore = useModalStore();
const userStore = useUserStore();

const email = ref("");
const emailError = ref("");
const isSubmitting = ref(false);

const handleSend = async () => {
  emailError.value = "";
  if (!email.value) {
    emailError.value = t("auth.forgot.err_empty");
    return;
  }
  if (!emailRegex.test(email.value)) {
    emailError.value = t("auth.forgot.err_invalid");
    return;
  }

  isSubmitting.value = true;
  try {
    await userStore.checkEmailExists(email.value);
    modalStore.showModal({
      title: t("auth.forgot.success_title"),
      message: t("auth.forgot.success_msg"),
      type: "success",
    });
  } catch (error) {
    emailError.value = error.response?.data?.message || t("auth.forgot.err_server");
  } finally {
    isSubmitting.value = false;
    email.value = "";
  }
};
</script>

<template>
  <div class="auth-wrapper">
    <h1 class="auth-title">{{ t("auth.forgot.title") }}</h1>
    <form @submit.prevent="handleSend" novalidate>
      <BaseInput
        :label="t('auth.forgot.email_label')"
        id="email"
        v-model="email"
        type="email"
        required
      />

      <Transition name="slide-fade">
        <span v-if="emailError" class="error-text">{{ emailError }}</span>
      </Transition>

      <BaseButton :text="t('auth.forgot.send_btn')" type="submit" class="btn-auth" />

      <div class="auth-footer">
        <router-link to="/auth/login" class="auth-link">
          {{ t("auth.forgot.back_link") }}
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
