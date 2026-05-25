<script setup>


// 1. Tắt kế thừa thuộc tính vào thẻ div ngoài cùng
defineOptions({
  inheritAttrs: false
});

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  label: String,
  modelValue: [String, Number],
  type: { type: String, default: 'text' },
  placeholder: String,
  required: { type: Boolean, default: false },
  width: { type: String, default: '100%' },
  height: { type: String, default: '4.8rem' },
  id: String,
  error: String,
  // Thêm prop này để tắt margin khi dùng trong Filter
  noMargin: { type: Boolean, default: false }
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="field-container" :style="{ width: width }">
    <label v-if="label" :for="id" class="field-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>

    <div class="input-wrapper">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        v-bind="$attrs" 
        :class="['field-input', { 'input-error': error }]"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      
      <div class="input-suffix">
        <slot name="suffix"></slot>
      </div>
    </div>

    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<style scoped>
.field-container {
  /* 3. Dùng v-if/v-else logic cho margin */
  margin-bottom: v-bind('noMargin ? "0" : "2rem"');
  display: flex;
  flex-direction: column;
}

.field-label {
  display: block;
  font-size: 1.4rem;
  font-weight: 500;
  margin-bottom: 0.8rem;
  color: #333;
  .required-mark {
    color: #FF0000;
  }
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: v-bind(height); /* Đưa height vào đây để bao quát cả ô input */
}

.field-input {
  width: 100%;
  height: 100%;
  padding: 0 1.5rem;
  border: 1px solid #ccc;
  border-radius: 0.8rem;
  font-family: inherit;
  font-size: 1.6rem;
  outline: none;
  transition: all 0.2s ease;
}

/* 4. Style khi bị Disabled cho xịn */
.field-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  border-color: #e0e0e0;
  color: #999;
}

.field-input:focus {
  border-color: #737370; /* Đổi sang màu đỏ Redmine của Đạt cho đồng bộ */
  box-shadow: 0 0 0 2px rgba(255, 59, 63, 0.1);
}

.input-suffix {
  position: absolute;
  right: 1.2rem;
  display: flex;
  align-items: center;
}

.error-message {
  color: #ff3b3f;
  font-size: 1.2rem;
  margin-top: 0.5rem;
}

</style>