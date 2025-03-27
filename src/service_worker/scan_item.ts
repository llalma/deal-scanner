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
}

// Fetch the string value of a page for a given xpath
async function fetch_xpath(tab_id: string, xpath: string): string {
  const res = await chrome.scripting.executeScript({
    target: { tabId: tab_id },
    func: injected_func,
    args: [xpath],
  });

  // todo add handling if xpath not found
  return res[0].result;
}

async function scan_item(data: Object) {
  // Create a tab
  // TODO: someway to make it work without active
  const tab = await chrome.tabs.create({ url: data.link, active: true });

  // Get the current value of the xpath
  const current_value = await fetch_xpath(tab.id, data.xpath);
  console.log(`Value for ${data.name} is ${current_value}`);

  // Close the tab after data has been fetched
  chrome.tabs.remove(tab.id);
}

export async function scan_items(items: Array<[string, Object]>) {
  for (const [guid, data] of items) {
    await scan_item(data);
  }
}
