<script setup>
import { ref, computed, watch } from "vue";
import BaseButton from "@/components/common/BaseButton.vue";
import BaseInput from "@/components/common/BaseInput.vue";
import { usePositionStore } from "@/stores/positionStore";

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  isOpen: Boolean,
  userId: [Number, String],
});
const emit = defineEmits(["close", "add"]);
const positionStore = usePositionStore();
// Data mẫu (Sau này Đạt có thể lấy từ Store hoặc API)
const searchQuery = ref("");
const selectedIds = ref([]);
const loadAvailablePositions = async () => {
  if (props.userId) {
    await positionStore.fetchAvailablePositions(props.userId);
  }
};
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      loadAvailablePositions();
      selectedIds.value = [];
    }
  },
  {
    immediate: true,
  },
);

// Logic tìm kiếm real-time
const filteredPositions = computed(() => {
  const key = searchQuery.value.toLowerCase().trim();
  return positionStore.availablePositions.filter((p) => p.name.toLowerCase().includes(key));
});

const toggleSelect = (id) => {
  const index = selectedIds.value.indexOf(id);
  if (index > -1) {
    selectedIds.value.splice(index, 1);
  } else {
    selectedIds.value.push(id);
  }
};

const handleApply = async () => {
  if (selectedIds.value.length === 0) {
    alert("Please select at least one position.");
    return;
  }
  try {
    const result = await positionStore.assignPositions(props.userId, selectedIds.value);
    if (result.statusCode === 200 || result.success) {
      // Báo cho cha biết đã thêm thành công để cập nhật UI
      emit("add");
      emit("close");
    }
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    console.error("Lỗi chi tiết khiến nó nhảy vào catch:", error);

    // Hiển thị lỗi từ Backend (nếu có) thay vì câu fix cứng
    const errorMsg =
      error.response?.data?.message || error.message || "Failed to assign positions.";
    alert("Lỗi: " + errorMsg);
  }
};
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
    <div class="assign-card">
      <h3 class="modal-title">Assign Position</h3>

      <div class="search-box">
        <BaseInput
          v-model="searchQuery"
          placeholder="Search position name..."
          no-margin
          class="flex-1"
        />
        <BaseButton variant="danger" style="height: 4.8rem">Search</BaseButton>
      </div>

      <div class="table-wrapper">
        <table class="assign-table">
          <thead>
            <tr>
              <th width="10%"></th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pos in filteredPositions" :key="pos.id">
              <td>
                <input
                  type="checkbox"
                  :checked="selectedIds.includes(pos.id)"
                  @change="toggleSelect(pos.id)"
                  class="custom-checkbox"
                />
              </td>
              <td>{{ pos.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="modal-footer">
        <BaseButton variant="outline" @click="emit('close')">Cancle</BaseButton>
        <BaseButton variant="danger" @click="handleApply">Apply</BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.assign-card {
  background: white;
  width: 600px;
  padding: 3rem;
  border-radius: 1.2rem;
}

.modal-title {
  text-align: center;
  font-size: 2.4rem;
  font-weight: 700;
  color: #0e2040;
  margin-bottom: 2.5rem;
}

.search-box {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.flex-1 {
  flex: 1;
}

.table-wrapper {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #f1f5f9;
  border-radius: 0.8rem;
  margin-bottom: 3rem;
}

.assign-table {
  width: 100%;
  border-collapse: collapse;
}

.assign-table th {
  background: #f8fafc;
  padding: 1.2rem;
  text-align: left;
  font-size: 1.4rem;
  color: #64748b;
  position: sticky;
  top: 0;
}

.assign-table td {
  padding: 1.2rem;
  border-top: 1px solid #f1f5f9;
  font-size: 1.5rem;
}

/* Checkbox đỏ Redmine */
.custom-checkbox {
  width: 1.8rem;
  height: 1.8rem;
  cursor: pointer;
  accent-color: #ff3b3f;
}

.modal-footer {
  display: flex;
  justify-content: center;
  gap: 2rem;
}
</style>
