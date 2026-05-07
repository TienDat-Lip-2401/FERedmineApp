<script setup>

defineProps({
  label: String,
  modelValue: [String, Number],
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String,
  required: {
    type: Boolean,
    default: false
  },
  id: String,
  error: String
});
defineEmits(['update:modelValue']);
</script>

<template>
  <div class="field-container">
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
        :class="['field-input', { 'input-error': error }]"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>

    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<style scoped>
.field-container {
  margin-bottom: 2rem;
  width: 100%;
}

.field-label {
  display: block;
  font-size: 1.4rem;
  font-weight: 500;
  margin-bottom: 0.8rem;
  color: #333;
}

.required-mark {
  color: #ff3b3f; /* Màu đỏ Redmine */
  margin-left: 0.2rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.field-input {
  width: 100%;
  height: 4.8rem;
  padding: 0 1.5rem;
  border: 1px solid #ccc;
  border-radius: 0.8rem;
  font-family: 'Poppins', sans-serif;
  font-size: 1.6rem;
  outline: none;
  transition: all 0.2s ease;
}

.field-input:focus {
  border-color: #33a6ff; /* Viền xanh khi click vào */
  box-shadow: 0 0 0 2px rgba(51, 166, 255, 0.1);
}

.input-error {
  border-color: #ff3b3f;
}
.error-message {
  color: #ff3b3f;
  font-size: 1.2rem;
  margin-top: 0.5rem;
  display: block;
}
</style>