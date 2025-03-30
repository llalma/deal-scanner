<!-- An input field with pill boxes that users can type into to add values into the pill boxes. -->
<!-- Each pill box can be manually deleted. Used for tags -->

<script>
  // Params
  // TODO convert tags to Sets at start so dont need to keep converting
  let { tags = $bindable(), on_tags_change_func } = $props()

  const PLACEHOLDER_TEXT = 'Press enter to add tag'

  // Keeps the user input from text input
  let input_tag = $state()

  // Adds tags, only triggers when users presses enter and input is not blank. Otherwise do nothing -
  function add_tag(event) {
    if (event.key === 'Enter' && input_tag) {
      tags = Array.from(new Set(tags).add(input_tag))

      // Clear the input
      input_tag = ''
    }
  }

  // Delete tags from list
  function delete_tag(tag) {
    let reduced_set = new Set(tags)
    reduced_set.delete(tag)
    tags = Array.from(reduced_set)
  }
</script>

<!-- Render each tag as a pill -->
<div class="flex flex-wrap items-center border rounded p-2 w-full">
  {#each tags as tag}
    <span
      class="inline-flex items-center rounded-full bg-gray-200 px-3 py-0.5 text-sm font-medium text-gray-800 mr-2"
    >
      {tag}
      <button
        type="button"
        class="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
        on:click={() => delete_tag(tag)}
      >
        <svg
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </span>
  {/each}

  <!-- Input field for adding tags -->
  <input
    type="text"
    on:keydown={add_tag}
    bind:value={input_tag}
    placeholder={PLACEHOLDER_TEXT}
    class="flex-grow min-w-0 border-none outline-none"
  />
</div>
