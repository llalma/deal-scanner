export const WATCHED_ITEMS_KEY = "WatchedItems"

// Update the given id with data. If key dosent exist it creates it. If it does exist update with merge
// TODO this only handles adding, not deleting
export async function update_item(id: string, data: Object) {

  // Get the original_data watched data
  let watched_items = (await chrome.storage.sync.get(WATCHED_ITEMS_KEY))[WATCHED_ITEMS_KEY]

  // Update the line item with the new data
  watched_items[id] = Object.assign({}, watched_items[id], data)

  // Update storage with new data
  chrome.storage.sync.set({ 
    [WATCHED_ITEMS_KEY]: watched_items
  });
}

// Handle initial load
determine_err_status();

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
  const items = Object.entries((await chrome.storage.sync.get(WATCHED_ITEMS_KEY))[WATCHED_ITEMS_KEY]);

  // Get the current count where alert_bool is true
  const alert_count = items.filter((v, _) => v[1].alert_bool).length;

  // Only set badge text if no warining is current
  if ((await chrome.action.getBadgeText({})) !== BADGE_ALERT_TEXT) {
    // Set the badge text
    chrome.action.setBadgeText({ text: String(alert_count) });
    chrome.action.setBadgeBackgroundColor({ color: BADGE_NORMAL_COLOUR });
  }
}

// Function to handle setting errors just so all errors are in 1 place and should be easier to rewrite in future
// TODO only handles 1 error at a time
const BADGE_ALERT_TEXT: string = "!";
const BADGE_ALERT_COLOUR: string = "red";
const BADGE_NORMAL_COLOUR: string = "blue";
export async function add_err(guid: string, error_id: int) {
  let error_message: string;

  // Determine the error via error_id
  switch (error_id) {
    case 1:
      error_message = "Unable to locate xpath on webpage";
      break;

    default:
      error_message = "Unhandled error_id";
      break;
  }

  // Update the item with the alert
  await update_item(guid, {
    error_alert: { id: error_id, msg: error_message },
    alert_bool: false, // Also set this to false to be sure
  });

  // Update the badge text to alert value
  chrome.action.setBadgeText({ text: BADGE_ALERT_TEXT });
  chrome.action.setBadgeBackgroundColor({ color: BADGE_ALERT_COLOUR });
}

// Function to check if the alert should be removed
export async function determine_err_status() {
  // Get all the items added to the extension
  const items = Object.entries((await chrome.storage.sync.get([WATCHED_ITEMS_KEY]))[WATCHED_ITEMS_KEY]);

  // Get the current count where error_alert is not blank
  const alert_count = items.filter(
    (v, _) => Object.keys(v[1].error_alert).length !== 0,
  ).length;

  // Set the alert status
  if (alert_count > 0) {
    chrome.action.setBadgeText({ text: BADGE_ALERT_TEXT });
    chrome.action.setBadgeBackgroundColor({ color: BADGE_ALERT_COLOUR });
    return;
  }

  // If no active alerts calculate the deal count and display it, have to manually set badge text to anything besides BADGE_ALERT_TEXT first
  chrome.action.setBadgeText({ text: "" });
  set_badge();
}
