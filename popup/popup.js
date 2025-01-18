// WAit for dom load
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("add").title = "Click on value you wish to watch";
  document.getElementById("scan").title = "Check values of all watched items";
  document.getElementById("clear").title = "Delete all watched items";
});

// Event for updating the added items list
const itemList = document.getElementById("displayList");
document.addEventListener("DOMContentLoaded", function () {
  render_list();
});
chrome.storage.onChanged.addListener(async (changes, namespace) => {
  // Check the storage change is the sync
  if (namespace === "sync") {
    await render_list();
  }
});

async function render_list() {
  const items = await chrome.storage.sync.get();

  // Clear items from previous render
  itemList.innerHTML = "";

  // Populate the list with stored items
  Object.entries(items).forEach((item) => {
    const key = item[0];
    const data = item[1];
    // Create a div per item
    const listItem = document.createElement("div");

    // Create a title span
    const title = document.createElement("span");
    title.textContent = data.title;

    // Add scan button
    const scan_button = document.createElement("button");
    scan_button.innerHTML =
      '<i class="fa-solid fa-magnifying-glass-dollar"></i>';
    scan_button.className = "action-btn";
    scan_button.onclick = () => {
      chrome.runtime.sendMessage({
        type: "scan",
        data: { [key]: data },
      });
    };

    // Add link button
    const link_button = document.createElement("button");
    link_button.innerHTML = '<i class="fa-solid fa-link"></i>';
    link_button.className = "action-btn";
    link_button.onclick = () => {
      chrome.windows.create({ url: data.url });
    };

    // Add delete button
    const delete_button = document.createElement("button");
    delete_button.innerHTML = '<i class="fa-solid fa-trash"></i>';
    delete_button.className = "action-btn";
    delete_button.onclick = () => {
      chrome.storage.sync.remove(key);
    };

    // Add all elements to row
    listItem.appendChild(title);
    listItem.appendChild(scan_button);
    listItem.appendChild(link_button);
    listItem.appendChild(delete_button);

    // Add row to list
    itemList.appendChild(listItem);
  });
}

// Event for rescanning added items
document.getElementById("scan").addEventListener("click", async function () {
  chrome.runtime.sendMessage({
    type: "scan",
    data: await chrome.storage.sync.get(),
  });
});

// Event for adding a new item
document.getElementById("add").addEventListener("click", async function () {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tabId = tabs[0].id;
    await chrome.scripting.executeScript({
      files: ["injections/functions.js", "injections/eventListeners.js"],
      target: { tabId: tabId },
    });
    await chrome.scripting.insertCSS({
      files: ["injections/greyed_out.css"],
      target: { tabId: tabId },
    });
    // Close pupup window so item can be selected be selected
    await window.close();
  });
});

// Event for clearing checklist
document.getElementById("clear").addEventListener("click", async function () {
  chrome.storage.sync.clear();
  chrome.runtime.sendMessage({
    type: "clear",
  });
});
