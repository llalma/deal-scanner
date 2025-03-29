import { writable, get } from "svelte/store";

export const modalStore = writable({
  isOpen: false,
  guid: null,
  tags: null,
});

export function openModal(guid, tags = {}) {
  modalStore.update((store) => ({
    isOpen: true,
    guid: guid,
    tags: tags,
  }));
}

export function closeModal() {
  modalStore.update((store) => ({
    isOpen: false,
    guid: null,
    tags: null,
  }));
}

// Handles the rerendering when tags are deleted or added
chrome.storage.onChanged.addListener(async (changes, namespace) => {
  // Fetch the current values of the store
  const store = get(modalStore);

  // Only bother checking if store is open and namespace is sync
  if (namespace === "sync" && store.isOpen) {
    // Update the modal store with the new tags
    modalStore.update((store) => ({
      isOpen: true,
      guid: store.guid,
      tags: changes[store.guid].newValue.tags,
    }));
  }
});
