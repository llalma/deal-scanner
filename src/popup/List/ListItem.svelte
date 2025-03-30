<script lang="ts">
  import { openModal } from '../stores/modalStore'
  import Icon from '@iconify/svelte'

  // Params
  export let guid
  export let data

  // Does what it says on the tin
  async function delete_item() {
    await chrome.storage.sync.remove(guid)
  }

  // Handles left clicks on name span as it dosent work. Changes to default to open new tab
  function handle_click() {
    event.preventDefault()
    window.open(data.link, '_blank')
  }

  function test() {
    openModal(guid, data, data.tags)
  }
</script>

<main>
  <li
    class="flex justify-between items-center p-2 border rounded bg-gray-100 cursor-pointer max-h-14"
    class:bg-red-100={data.alert_bool}
  >
    <a href={data.link} on:click={handle_click}>
      <span>{data.name}</span>
    </a>
    <button on:click={test} class="cursor-pointer">
      <Icon icon="mdi:pencil" style="font-size: 24px;" />
    </button>
    <button class="cursor-pointer" on:click={delete_item}>
      <Icon icon="mdi:close" style="font-size: 24px;" />
    </button>
  </li>
</main>
