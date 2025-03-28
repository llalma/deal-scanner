<script lang="ts">
  import ListItem from './ListItem.svelte'

  let items: [Object] = []

  // Event to handle initial load of data
  document.addEventListener('DOMContentLoaded', async () => {
    items = Object.entries(await chrome.storage.sync.get())
  })

  // Event to trigger a list rerender - We only care about sync
  // TODO could use changes var here to save a call to storage.sync
  chrome.storage.onChanged.addListener(async (changes, namespace) => {
    if (namespace === 'sync') {
      items = Object.entries(await chrome.storage.sync.get())
    }
  })
</script>

<main>
  <ul class="space-y-2 w-full max-w-sm">
    {#each items as item, index}
      <ListItem guid={item[0]} data={item[1]} />
    {/each}
  </ul>
</main>
