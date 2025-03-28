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
