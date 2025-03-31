// Update the given id with data. If key dosent exist it creates it. If it does exist update with merge
// TODO this only handles adding, not deleting
export async function update_item(id: string, data: Object) {
  // Get the data if it exists -  need todo this weird indexing thing on result so nt double nesting
  const original_data = (await chrome.storage.sync.get([id]))[id];

  // Overwrite any data if item already existed
  const updated_data = Object.assign({}, original_data, data);

  // Update storage with new data
  chrome.storage.sync.set({ [id]: updated_data });
}

// Handle initial load
set_badge();

// Handle whenever the values change
chrome.storage.onChanged.addListener(async (changes, namespace) => {
  if (namespace === "sync") {
    set_badge();
  }
});

// Function to watch changes in sync storage to rerender the icon value
// TODO not very efficeint wil the call to storage sync
async function set_badge() {
  // Get all the items added to the extension
  const items = Object.entries(await chrome.storage.sync.get());

  // Get the current count where alert_bool is true
  const alert_count = items.filter((v, _) => v[1].alert_bool).length;

  // Set the badge text
  chrome.action.setBadgeText({ text: String(alert_count) });
}

// Function to handle setting errors just so all errors are in 1 place and should be easier to rewrite in future
export async function add_err(guid: string, error_id: int) {
  let error_message: string;

  // Determine the error via error_id, No default value so cases have to be handled
  switch (error_id) {
    case 1:
      error_message = "Unable to locate xpath on webpage";
  }

  await update_item(guid, {
    error_alert: { id: error_id, msg: error_message },
  });
}
