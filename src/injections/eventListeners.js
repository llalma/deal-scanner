import { clean_up_text_field } from "./functions.js";

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
  async function (event) {
    const element = event.target;
    const element_text = element.firstChild?.nodeValue?.trim() || "";

    // check if the element actually has text. I.E value is not ina child element
    try {
      const float_value = clean_up_text_field(element_text);
    } catch (e) {
      alert("Selected element did not contain a $ value");
      return;
    }

    // Get the value from user to alert on
    // TODO make sure input is valid
    const target_price = prompt(
      `Enter Value to send alert. Current value is ${float_value}`,
    );

    // Send value to storage
    chrome.runtime.sendMessage({
      type: "update",
      payload: {
        key: crypto.randomUUID(),
        data: {
          name: document.title,
          link: window.location.href,
          xpath: getXPath(element),
          original_value: float_value,
          target_price: target_price,
          alert_bool: false,
          error_alert: {},
          tags: [],
        },
      },
    });

    // Send info to background worker
    chrome.runtime.sendMessage({
      type: "remove_css",
    });

    // Event to clean up functions. Needs to be after events being removed
    window.controller.abort();
    window._previousElement.style.outline = "";
  },
  { signal: window.controller.signal },
);
