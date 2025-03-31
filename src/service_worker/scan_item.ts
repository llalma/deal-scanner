import { update_item, add_err } from "./update_item";
import { sanitise_xpath_value } from "../helpers/helpers";

// Function which is execute in tab to fetch the xpath
// TODO surely better way todo it
function injected_func(xpath) {
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
          resolve({ error: false, msg: element.textContent });
          return true;
        }

        // Handle in element cannot be found and all loading attempts have passed
        // TODO make this adjustable
        if (count > 15) {
          throw new Exception("Could not find element on given xpath");
        }

        return false;
      } catch (error) {
        if (count > 15) {
          resolve({
            error: true,
            msg: "Could not find element on given xpath2",
          });
          return true;
        }
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
          count++;
        }
      } else {
        // If page isn't even interactive yet, keep waiting
        setTimeout(checkState, 100);
      }
    };

    // Start checking
    let count = 0;
    checkState();
  });
}

// Fetch the string value of a page for a given xpath
async function fetch_xpath(tab_id: string, xpath: string): string {
  const res = await chrome.scripting.executeScript({
    target: { tabId: tab_id },
    func: injected_func,
    args: [xpath],
  });

  // Handle error state
  if (res[0].result.error) {
    throw new Error("Could not find xpath");
  }

  // Handle xpath found outcome
  return res[0].result.msg;
}

async function scan_item(guid: string, data: Object) {
  // Create a tab
  // TODO: someway to make it work without active
  const tab = await chrome.tabs.create({ url: data.link, active: true });

  try {
    // Get the current value of the xpath
    const current_value = await fetch_xpath(tab.id, data.xpath);

    // Handling if the value is < target_price
    if (
      parseFloat(sanitise_xpath_value(current_value)) <
      parseFloat(data.target_price)
    ) {
      await update_item(guid, { alert_bool: true });
    }
  } catch (err) {
    // Handle case xpath could not be found
    await add_err(guid, 1);
  }

  // Close the tab after data has been fetched
  chrome.tabs.remove(tab.id);
}

export async function scan_items(items: Array<[string, Object]>) {
  // TODO make this a toggle setting in options to help debug?
  // for (const [guid, data] of items) {
  //   await scan_item(guid, data);
  // }

  await Promise.all(
    items.map(async ([guid, data]) => {
      await scan_item(guid, data);
    }),
  );
}
