<script lang="ts">
  import { openModal } from '../stores/modalStore'
  import Icon from '@iconify/svelte'

  // Params
  export let guid
  export let data

  // Does what it says on the tin
  async function delete_item() {
    await chrome.runtime.sendMessage({
      type: 'delete',
      payload: {
        key: guid,
      },
    })
  }

  // Handles left clicks on name span as it dosent work. Changes to default to open new tab
  function handle_click() {
    event.preventDefault()
    window.open(data.link, '_blank')
  }
</script>

<li
  class="flex justify-between items-center p-2 border rounded bg-gray-100 cursor-pointer max-h-14 relative"
>
  <!-- Flashing alert for action needed  -->
  {#if Object.keys(data.error_alert).length !== 0}
    <span
      class="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-br-lg shadow-md animate-pulse"
    >
      Needs Action
    </span>
  {/if}

  <!-- Flashing alert for a deal  -->
  <!-- Will break if error_alert and alert_bool are both ever set. Currently not possible-->
  {#if data.alert_bool}
    <span
      class="absolute top-0 left-0 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg shadow-md animate-pulse"
    >
      Deal Found!
    </span>
  {/if}

  <a href={data.link} on:click={handle_click} class="flex-1 overflow-hidden">
    <span>{data.name}</span>
  </a>

  <button
    on:click={() => openModal(guid, data, data.tags)}
    class="cursor-pointer ml-2"
  >
    <Icon icon="mdi:pencil" style="font-size: 24px;" />
  </button>
  <button class="cursor-pointer ml-2" on:click={delete_item}>
    <Icon icon="mdi:close" style="font-size: 24px;" />
  </button>
</li>
