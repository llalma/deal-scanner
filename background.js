// On chrme start run a scan of deals
chrome.runtime.onStartup.addListener(async function () {
  handle_scan(await chrome.storage.sync.get());
});

// Add listener to turn off css
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  // Handle when use has selected an element to watch
  if (message.type === "complete") {
    await chrome.scripting.removeCSS({
      files: ["injections/greyed_out.css"],
      target: { tabId: sender.tab.id },
    });
  } else if (message.type === "clear") {
    current_deal_count = 0;
    set_badge_text();
  } else if (message.type === "scan") {
    await handle_scan(message.data);
  } else if (message.type === "reset_deal") {
    current_deal_count--;
    update_item(message.key, message.data, message.updated_data);
    set_badge_text();
  }
});

async function handle_scan(sites) {
  // get the values added to storage
  // const sites = await chrome.storage.sync.get();

  // Iter over each site added
  for (const [k, v] of Object.entries(sites)) {
    chrome.tabs.create({ url: v.url, active: true }, async function (tab) {
      // Fetch the data on the give xpath
      let current_value = await fetch_page_data(tab.id, v.xpath);

      // Close the tab after data has been fetched
      chrome.tabs.remove(tab.id);

      // Compare the current value and previous value
      const is_deal = compare_values(k, v, current_value);

      // Update the badge text to alrert about deals
      set_badge_text();

      // Update the data about the item if its a deal
      update_item(k, v, { shouldAlert: is_deal });
    });
  }
}

async function fetch_page_data(tabId, xpath) {
  // Fetch the value of the selected xpath
  const res = await chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: async (xpath) => {
      return new Promise((resolve, reject) => {
        let timeoutId;

        // Function to attempt getting the element
        const tryGetElement = () => {
          try {
            const element = document.evaluate(
              xpath,
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null,
            ).singleNodeValue;

            if (element) {
              clearTimeout(timeoutId);
              resolve(element.textContent);
              return true;
            }
            return false;
          } catch (error) {
            return false;
          }
        };

        // Function to check document state and element presence
        const checkState = () => {
          // Check if we're at least in interactive state
          if (
            document.readyState === "interactive" ||
            document.readyState === "complete"
          ) {
            // Try to get the element
            if (!tryGetElement()) {
              // If element not found, retry after a short delay
              setTimeout(checkState, 100);
            }
          } else {
            // If page isn't even interactive yet, keep waiting
            setTimeout(checkState, 100);
          }
        };

        // Start checking
        checkState();
      });
    },
    args: [xpath],
  });

  // todo add handling if xpath not found
  return res[0].result;
}

// Compare the previous and current values to see if it has changed
function compare_values(id, data, current) {
  current = current.replace("$", "");
  console.log(current, data.alertValue);
  if (parseFloat(current) < parseFloat(data.alertValue)) {
    current_deal_count++;
    return true;
  }

  // If it was previously a deal. and is now not. Remove the count
  if (data.shouldAlert) {
    current_deal_count--;
  }
  return false;
}

function update_item(id, orignial_data, new_data) {
  const updated_data = Object.assign({}, orignial_data, new_data);
  chrome.storage.sync.set({ [id]: updated_data });
}

// Set the badge text
let input_required = false;
let current_deal_count = 0;
function set_badge_text() {
  // Set an alert badge for notification
  if (input_required) {
    chrome.action.setBadgeText({
      text: "!",
    });
    chrome.action.setBadgeTextColor({
      color: "red",
    });
  } else {
    chrome.action.setBadgeText({
      text: current_deal_count.toString(),
    });
    chrome.action.setBadgeTextColor({
      color: "black",
    });
  }
}
