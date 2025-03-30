<script>
  import TagSearch from './TagSearch.svelte'
  // Params
  let { guid, data } = $props()

  let name_input = $state(data.name)
  let target_price_input = $state(data.target_price)
  let tags_input = $state(data.tags)

  // If any of the state values change trigger function to save data to storage
  // TODO not efficeint as it updates storage every letter that is typed
  $effect(async () => {
    await chrome.runtime.sendMessage({
      type: 'update',
      payload: {
        key: guid,
        data: {
          name: name_input,
          target_price: target_price_input,
          tags: tags_input,
        },
      },
    })
  })
</script>

<div class="flex flex-wrap items-center border rounded p-2 w-full">
  <!-- Edit name -->
  <input
    type="text"
    bind:value={name_input}
    class="flex-grow min-w-0 border-none outline-none"
  />
</div>

<div class="flex flex-wrap items-center border rounded p-2 w-full">
  <!-- Edit target_price -->
  <input
    type="text"
    bind:value={target_price_input}
    class="flex-grow min-w-0 border-none outline-none"
  />
</div>

<div class="flex flex-wrap items-center border rounded p-2 w-full">
  <!-- Edit Tags-->
  <TagSearch bind:tags={tags_input} />
</div>
