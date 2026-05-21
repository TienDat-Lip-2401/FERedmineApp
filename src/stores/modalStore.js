import { defineStore } from "pinia";
export const useModalStore = defineStore("modal", {
  state: () => ({
    isOpen: false,
    title: "",
    message: "",
    type: "info", // Có thể là 'info', 'success', 'error', 'warning', 'confirm'
    onConfirm: null,
  }),
  actions: {
    showModal({ title, message, type = "info", onConfirm = null }) {
      this.title = title;
      this.message = message;
      this.type = type;
      this.onConfirm = onConfirm;
      this.isOpen = true;
    },
    closeModal() {
      this.isOpen = false;
      this.onConfirm = null;
    },
    confirmModal() {
      if (this.onConfirm) {
        this.onConfirm();
      }
      this.closeModal();
    },
  },
});
