<script lang="ts">
  import ListItem from './ListItem.svelte'
  import TagSearch from '../Tagging/TagSearch.svelte'

  let items: [Object] = []
  let current_filters = []

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

  function tag_filter(tags) {
    current_filters = tags
  }

  let filtered_items = $derived(
    items.filter((item) => {
      return true
      if (current_filters.length == 0) return true
      return current_filters.every((tag) => item.tags.includes(tag))
    })
  )
</script>

<main>
  <!-- Search bar for tags-->
  <div><TagSearch on_tags_change_func={tag_filter} /></div>

  <div>
    <ul class="space-y-2 w-full max-w-sm">
      {#each current_filters as item, index}
        <ListItem guid={item[0]} data={item[1]} />
      {/each}
    </ul>
  </div>
</main>
