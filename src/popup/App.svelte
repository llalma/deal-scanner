<script>
  import List from './List/List.svelte'
  import TagModal from './EditItem/Popup.svelte'

  let items = []

  async function handleScanClick() {
    chrome.runtime.sendMessage({
      type: 'scan',
      payload: Object.entries(await chrome.storage.sync.get()), // Scan all item
    })
  }

  function handleAddClick() {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab_id = tabs[0].id

      // Request permissions to host - Used to inject script to find element user clicks and to scan for user requsted checks
      await chrome.permissions.request({
        permissions: ['scripting'],
        origins: [tabs[0].url],
      })

      // Inject the scripts for getting user selection
      await chrome.scripting.executeScript({
        files: [
          'src/injections/functions.js',
          'src/injections/eventListeners.js',
        ],
        target: { tabId: tab_id },
      })

      // Inject CSS to greyout screen
      await chrome.scripting.insertCSS({
        files: ['src/injections/injection.css'],
        target: { tabId: tab_id },
      })

      // Close the popup window so it dosent get in the way
      await window.close()
    })
  }
</script>

<TagModal />

<div
  class="items-center justify-center min-h-screen bg-gray-100 p-3 overflow-hidden"
>
  <div class="flex flex-col items-center gap-2">
    <div class="flex gap-2 mb-2">
      <button
        on:click={handleScanClick}
        class="px-6 py-3 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer"
      >
        Scan
      </button>

      <button
        on:click={handleAddClick}
        class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer"
      >
        Add
      </button>
    </div>

    <!-- Dynamic watch list -->
    <List />
  </div>
</div>
