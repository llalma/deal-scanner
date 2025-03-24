<script lang="ts">
	export let guid;
  export let data;
	

	// Does what it says on the tin
	async function delete_item(){
		await chrome.storage.sync.remove(guid)
	}

	// Handles left clicks on name span as it dosent work. Changes to default to open new tab
	function handle_click() {
			event.preventDefault(); 
			window.open(data.link, "_blank"); 
	}


</script>

<main>
	<li class="flex justify-between items-center p-2 border rounded bg-gray-100">
		<a href={data.link} on:click={handle_click}>
			<span>{data.name}</span>
		</a>
		<button class="bg-red-500 text-white px-2 py-1 rounded ml-4 cursor-pointer" on:click={delete_item}>
			Delete
		</button>
	</li>
</main>
