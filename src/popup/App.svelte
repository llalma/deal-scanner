<script>
  let items = [];

  function handleScanClick() {
    alert('Scan button clicked!');
  }

  function handleAddClick() {
    items = [...items, "test"];
  }

  function deleteItem(index) {
      console.log(index)
      items = items.filter((_, i) => i !== index);
  }
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100 p-4">
  <div class="flex flex-col items-center gap-4">
    <div class="flex gap-4 mb-4">
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
    <ul class="space-y-2 w-full max-w-sm">
      {#each items as item, index}
        <li class="flex justify-between items-center p-2 border rounded bg-gray-100">
          <span>{item}</span>
          <button
            on:click={() => deleteItem(index)}
            class="bg-red-500 text-white px-2 py-1 rounded ml-4 cursor-pointer" 
          >
            Delete
          </button>
        </li>
      {/each}
    </ul>
  </div>
</div>

