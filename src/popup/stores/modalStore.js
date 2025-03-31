import { writable, get } from "svelte/store";

export const modalStore = writable({
  isOpen: false,
  guid: null,
  data: null,
  tags: null,
});

// TODO remove tags input. Can fetch from data input
export function openModal(guid, data, tags = {}) {
  modalStore.update((store) => ({
    isOpen: true,
    guid: guid,
    data: data,
    tags: tags,
  }));
}

export function closeModal() {
  modalStore.update((store) => ({
    isOpen: false,
    guid: null,
    data: null,
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
      data: changes[store.guid].newValues,
      tags: changes[store.guid].newValue.tags,
    }));
  }
});
