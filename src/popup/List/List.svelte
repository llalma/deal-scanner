<script lang="ts">
  import ListItem from './ListItem.svelte'
  import TagSearch from '../EditItem/TagSearch.svelte'

  let items: [Object] = []
  let current_filters

  // Event to handle initial load of data
  document.addEventListener('DOMContentLoaded', async () => {
    items = Object.entries((await chrome.storage.sync.get("WatchedItems")).WatchedItems)
  })

  // Event to trigger a list rerender - We only care about sync
  // TODO could use changes var here to save a call to storage.sync
  chrome.storage.onChanged.addListener(async (changes, namespace) => {
    if (namespace === 'sync') {
      items = Object.entries(await chrome.storage.sync.get("WatchedItems"))
    }
  })

  // Function to filter items appearing in the list. Must match all given tags. Returns everything if no filters are given
  function all_matches(item_tags: string[]) {
    if (!current_filters || current_filters.length == 0) return true
    return current_filters.every((tag) => item_tags.includes(tag))
  }
</script>

{#if items}
  <div class="flex flex-col h-screen">
    <!-- Search bar for tags-->
    <div class="p-2 bg-gray-100 border-b border-gray-200">
      <TagSearch bind:tags={current_filters} />
    </div>

    <div class="max-h-54 overflow-y-auto p-4">
      <ul class="space-y-2 w-full max-w-sm">
        {#each items as item, index}
          {#if all_matches(item[1].tags)}
            <ListItem guid={item[0]} data={item[1]} />
          {/if}
        {/each}
      </ul>
    </div>
  </div>
{/if}
