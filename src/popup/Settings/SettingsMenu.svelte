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

  // Set default values for the settings
  let settings = $state({ ...DEFAULT_SETTINGS });

  // Fetch the actual values from settings values
  onMount(async () => {
    settings = {...DEFAULT_SETTINGS, ...(await chrome.storage.sync.get(SETTINGS_KEY))[SETTINGS_KEY]}
  });

  // If any of the state values change trigger function to save data to storage
  $effect(async () => {
    chrome.storage.sync.set({ 
      [SETTINGS_KEY]: settings 
    });
  })
</script>

<div class="space-y-4 p-4 max-w-md">
  <!-- Toggle switch -->
  <div class="flex items-center justify-between">
    <label class="text-lg font-medium" for="affiliate-toggle">Enable affiliate links</label>
    <div
      role="switch"
      aria-checked={settings.enable_affiliate_links}
      tabindex="0"
      class={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
        settings.enable_affiliate_links ? 'bg-green-500' : 'bg-gray-300'
      }`}
      on:click={() => (settings.enable_affiliate_links = !settings.enable_affiliate_links)}
    >
      <div
        class={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
          settings.enable_affiliate_links ? 'translate-x-6' : ''
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
      bind:value={settings.affiliate_link_endpoint}
      disabled={!settings.enable_affiliate_links}
      class="px-4 py-2 border rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
    />
  </div>
</div>
