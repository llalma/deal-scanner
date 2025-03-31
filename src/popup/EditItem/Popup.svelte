<script>
  import { modalStore, closeModal } from '../stores/modalStore'
  import { fade, scale } from 'svelte/transition'
  import { quintOut } from 'svelte/easing'
  import EditItem from './EditItem.svelte'
  import Icon from '@iconify/svelte'

  let modalElement
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
        <Icon icon="mdi:close" style="font-size: 24px;" />
      </button>

      <!-- Update item info -->
      <EditItem guid={$modalStore.guid} data={$modalStore.data} />
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
