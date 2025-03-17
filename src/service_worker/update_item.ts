interface Item {
  id: string;
}

async function get_item(id: string): Item | null {
  let item = await chrome.storage.sync.get([id]);
  console.log("get_item");
  console.log(item);
  if (item.id) {
    return item;
  }

  return null;
}

// Update the given id with data. If key dosent exist it creates it. If it does exist update with merge
export async function update_item(id, data) {
  // Get the data if it exists
  const original_data = await get_item(id);
  console.log(original_data);

  // Default assign data. but if original_data exists merger with data and replace
  let updated_data = data;
  if (original_data) {
    updated_data = Object.assign({}, original_data, data);
  }
  console.log("update_item");
  console.log(updated_data);

  // Update storage with new data
  chrome.storage.sync.set({ [id]: updated_data });
}
