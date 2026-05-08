<script setup>
import { computed } from "vue";
const props = defineProps({
  total: { type: Number, default: 0 },
  pages: { type: Number, default: 1 },
  current: { type: Number, default: 1 },
  pageSize: { type: Number, default: 6 },
});
const emit = defineEmits(["update:current", "update:pageSize"]);
let debounceTimer = null;
const displayedPages = computed(() => {
  const total = props.pages;
  const current = props.current;
  const delta = 2;
  const range = [];
  const rangeWithDots = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    }
  }
  let prev;
  for (const i of range) {
    if (prev) {
      if (i - prev === 2) {
        rangeWithDots.push(prev + 1);
      } else if (i - prev !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    prev = i;
  }
  return rangeWithDots;
});
const changePage = (page) => {
  if (page === "...") return;
  clearTimeout(debounceTimer);
  const pageNum = Number(page);
  if (pageNum < 1 || pageNum > props.pages) return;

  // 3. Thiết lập timer mới: Chỉ thực hiện sau khi Đạt "ngừng bấm" 200ms
  debounceTimer = setTimeout(() => {
    // Chỉ emit khi giá trị thực sự thay đổi
    if (pageNum !== Number(props.current)) {
      emit("update:current", pageNum);
    }
  }, 200);
};
const onPageSizeChange = (event) => {
  emit("update:pageSize", Number(event.target.value));
};
</script>

<template>
  <div class="pagination-wrapper">
    <span class="total-items">Total {{ total }} items</span>
    <div class="page-numbers">
      <button class="page-btn" @click="changePage(current - 1)">&lt;</button>
      <button
        v-for="(page, index) in displayedPages"
        :key="`${page}-${index}`"
        :class="['page-btn', { active: page === current }]"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
      <button class="page-btn" @click="changePage(current + 1)">&gt;</button>
    </div>
    <select class="page-size-select" :value="pageSize" @change="onPageSizeChange">
      <option value="6">6 / page</option>
      <option value="10">10 / page</option>
    </select>
  </div>
</template>

<style scoped>
.pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 3rem;
}
.total-items {
  color: #212529;
  font-size: 2rem;
  font-weight: 400;
  line-height: 150%;
  letter-spacing: 0%;
}
.page-numbers {
  display: flex;
}
.page-btn {
  width: 62px;
  height: 62px;
  font-size: 20px;
  font-weight: 400;
  line-height: 150%;
  border: 1px solid #e0e0e0;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  color: #ff383c;
}
.page-btn:last-child {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}
.page-btn:first-child {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}
.page-btn.active {
  background-color: #ff3b3f;
  border-color: #ff3b3f;
  color: #fff;
}
.page-btn.dots {
  border: none;
  cursor: default;
}
.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.page-size-select {
  height: 3.2rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}
</style>
