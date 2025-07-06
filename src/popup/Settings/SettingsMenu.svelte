<script>
  import { onMount } from 'svelte';
  import { modalStore, closeModal } from '../stores/settingsModal'
  import { fade, scale } from 'svelte/transition'
  import { quintOut } from 'svelte/easing'
  import Icon from '@iconify/svelte'

  const SETTINGS_KEY = "Settings"

  const DEFAULT_SETTINGS = {
    enable_affiliate_links: false,
    affiliate_link_endpoint: ""
  }
  
  let enable_affiliate_links = $state(DEFAULT_SETTINGS.enable_affiliate_links);
  let affiliate_link_endpoint = $state(DEFAULT_SETTINGS.affiliate_link_endpoint);

  // Fetch the actual values from settings values
  onMount(async () => {
    const settings = {...DEFAULT_SETTINGS, ...(await chrome.storage.sync.get(SETTINGS_KEY))[SETTINGS_KEY]}

    // Assign them to local values so they can be used in inputs
    enable_affiliate_links = settings.enable_affiliate_links
    affiliate_link_endpoint = settings.affiliate_link_endpoint
  });

  // If any of the state values change trigger function to save data to storage
  // TODO not efficeint as it updates storage every letter that is typed
  $effect(async () => {
    await chrome.runtime.sendMessage({
      type: 'update_settings',
      payload: {
        data: {
          enable_affiliate_links: enable_affiliate_links,
          affiliate_link_endpoint: affiliate_link_endpoint,
        },
      },
    })
  })
  

</script>

<div class="space-y-4 p-4 max-w-md">
  <!-- Toggle switch -->
  <div class="flex items-center justify-between">
    <label class="text-lg font-medium" for="affiliate-toggle">Enable affiliate links</label>
    <div
      role="switch"
      aria-checked={enable_affiliate_links}
      tabindex="0"
      class={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
        enable_affiliate_links ? 'bg-green-500' : 'bg-gray-300'
      }`}
      on:click={() => (enable_affiliate_links = !enable_affiliate_links)}
    >
      <div
        class={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
          enable_affiliate_links ? 'translate-x-6' : ''
        }`}
      ></div>
    </div>
  </div>

  <!-- Input for API endpoint -->
  <div class="flex flex-col">
    <label for="affiliate-endpoint" class="text-sm font-medium text-gray-700 mb-1">
      Affiliate API Endpoint
    </label>
    <input
      id="affiliate-endpoint"
      type="text"
      placeholder="Not set"
      bind:value={affiliate_link_endpoint}
      disabled={!enable_affiliate_links}
      class="px-4 py-2 border rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
    />
  </div>
</div>
