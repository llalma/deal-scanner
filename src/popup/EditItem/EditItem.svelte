<script>
  import TagSearch from './TagSearch.svelte'
  // Params
  let { guid, data } = $props()

  let name_input = $state(data.name)
  let target_price_input = $state(data.target_price)
  let xpath_input = $state(data.xpath)
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
          xpath: xpath_input,
          tags: tags_input,
        },
      },
    })
  })
</script>

<!-- Name Edit-->
<div class="bg-white rounded-lg shadow p-4">
  <label class="block text-sm font-medium text-gray-700"> Name </label>
  <input
    type="text"
    bind:value={name_input}
    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
  />
</div>

<!-- Target price Edit-->
<div class="bg-white rounded-lg shadow p-4">
  <label class="block text-sm font-medium text-gray-700"> Target Price </label>
  <input
    type="text"
    bind:value={target_price_input}
    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
  />
</div>

<!-- Xpath Edit-->
<div class="bg-white rounded-lg shadow p-4">
  <label class="block text-sm font-medium text-gray-700"> Xpath </label>
  <input
    type="text"
    bind:value={xpath_input}
    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
  />
</div>

<!-- Tags Edit-->
<div class="bg-white rounded-lg shadow p-4">
  <label class="block text-sm font-medium text-gray-700"> Tags </label>
  <TagSearch bind:tags={tags_input} />
</div>
