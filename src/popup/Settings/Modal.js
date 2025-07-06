import { writable, get } from "svelte/store";

export const modalStore = writable({
  isOpen: false,
});

export function openModal(guid = {}) {
  modalStore.update((store) => ({
    isOpen: true,
  }));
}

export function closeModal() {
  modalStore.update((store) => ({
    isOpen: false,
  }));
}
