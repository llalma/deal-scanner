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
      class="modal-content"
      transition:scale={{ duration: 250, easing: quintOut }}
      on:click|stopPropagation
    >
      <h1>Add Tags</h1>

      <div class="flex flex-wrap items-center border rounded p-2 w-full">
        <!-- Render tags as bullets -->
        {#each $modalStore.tags as tag}
          <Tag {tag} />
        {/each}

        <!-- Input for user to create new tags -->
        <input
          type="text"
          on:keydown={add_tag}
          bind:value={input_tag}
          class="flex-grow min-w-0 border-none outline-none"
        />
      </div>

      <!-- <button class="modal-close" on:click={closeModal}> &times; </button> -->
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
