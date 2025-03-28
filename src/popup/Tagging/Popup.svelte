<script>
  import { modalStore, closeModal } from '../stores/modalStore'
  import { fade, scale } from 'svelte/transition'
  import { quintOut } from 'svelte/easing'
  import Tag from './Tag.svelte'

  let modalElement
  let input_tag

  // Adds tags, only triggers when users presses enter. Otherwise do nothing
  async function add_tag(event) {
    if (event.key === 'Enter') {
      // Update the sync storage with new tag - Converts array to set, adds a tag then back to array to prevent duplicate tags
      await chrome.runtime.sendMessage({
        type: 'update',
        payload: {
          key: $modalStore.guid,
          data: { tags: Array.from(new Set($modalStore.tags).add(input_tag)) },
        },
      })

      // Clear the input
      input_tag = ''
    }
  }
</script>

<!-- Content of the modal -->
{#if $modalStore.isOpen}
  <div
    class="modal-backdrop"
    transition:fade={{ duration: 200 }}
    bind:this={modalElement}
  >
    <div
      class="modal-content relative"
      transition:scale={{ duration: 250, easing: quintOut }}
      on:click|stopPropagation
    >
      <!-- Close button -->
      <button
        class="modal-close absolute top-2 right-2 cursor-pointer"
        on:click={closeModal}
      >
        <svg
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <h1>Tags</h1>

      <!-- Render each tag as a pill -->
      <div class="flex flex-wrap items-center border rounded p-2 w-full">
        {#each $modalStore.tags as tag}
          <Tag {tag} />
        {/each}

        <!-- Input field for adding tags -->
        <input
          type="text"
          on:keydown={add_tag}
          bind:value={input_tag}
          class="flex-grow min-w-0 border-none outline-none"
        />
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    position: relative;
    max-width: 90%;
    max-height: 90%;
    overflow: auto;
  }
</style>
