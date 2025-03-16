// Define an abort to use to send events
window.controller = new AbortController();

// Highlight functions
document.addEventListener("mouseover", mouseover_func, {
  signal: window.controller.signal,
});
document.addEventListener("mouseout", mouseout_func, {
  signal: window.controller.signal,
});

// Event for finiding the clicked element
document.addEventListener(
  "click",
  function (event) {
    const element = event.target;
    const element_text = element.firstChild?.nodeValue?.trim() || "";

    // check if the element actually has text. I.E value is not ina child element
    if (!element_text) {
      alert("Selected element did not contain a $ value");
      return;
    }

    // Remove $ signs from string
    let dollar_value = element_text.replace("$", "");

    const user_input = prompt(
      `Enter Value to send alert. Current value is ${dollar_value}`,
    );

    // Send info to background worker
    chrome.runtime.sendMessage({
      type: "complete",
    });
    chrome.storage.sync.set({
      [crypto.randomUUID()]: {
        title: document.title,
        url: window.location.href,
        xpath: getXPath(element),
        previousValue: dollar_value,
        alertValue: user_input,
        shouldAlert: false,
        tags: [],
      },
    });

    // Event to clean up functions. Needs to be after events being removed
    window.controller.abort();
    window._previousElement.style.outline = "";
  },
  { signal: window.controller.signal },
);
