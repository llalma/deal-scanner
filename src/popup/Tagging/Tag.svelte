<script>
  import { modalStore, updateModal } from '../stores/modalStore'

  // Params
  export let tag

  // Delete tag from chrome storage
  async function delete_tag(event) {
    // Prevent click closing modal
    event.stopPropagation()

    await chrome.runtime.sendMessage({
      type: 'update',
      payload: {
        key: $modalStore.guid,
        data: { tags: $modalStore.tags.filter((item) => item !== tag) },
      },
    })
  }
</script>

<span
  class="inline-flex items-center rounded-full bg-gray-200 px-3 py-0.5 text-sm font-medium text-gray-800 mr-2"
>
  {tag}
  <button
    type="button"
    class="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
    on:click={delete_tag}
  >
    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>
</span>
