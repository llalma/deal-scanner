<script lang="ts">
  import ListItem from './ListItem.svelte'
  import TagSearch from '../Tagging/TagSearch.svelte'

  let items: [Object] = []
  let current_filters = ['']

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

  // Function to filter items appearing in the list. Must match all given tags. Returns everything if no filters are given
  function all_matches(filters: string[], item_tags: string[]) {
    if (!filters || filters.length == 0) return true
    return filters.every((tag) => item_tags.includes(tag))
  }
</script>

<main>
  {#if items}
    <!-- Search bar for tags-->
    <div>
      <TagSearch on_tags_change_func={(tags) => (current_filters = tags)} />
    </div>

    <div>
      <ul class="space-y-2 w-full max-w-sm">
        {#each items as item, index}
          {#if all_matches(current_filters, item[1].tags)}
            <ListItem guid={item[0]} data={item[1]} />
          {/if}
        {/each}
      </ul>
    </div>
  {/if}
</main>
