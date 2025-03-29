import { update_item } from "./update_item";
import { scan_items } from "./scan_item";

interface Message {
  type: string;
  payload?: any;
}

chrome.runtime.onMessage.addListener(
  async (
    message: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void,
  ) => {
    switch (message.type) {
      case "scan":
        await scan_items(message.payload);
        break;

      case "update":
        await update_item(message.payload.key, message.payload.data);
        break;

      case "remove_css":
        await chrome.scripting.removeCSS({
          files: ["src/injections/injection.css"],
          target: { tabId: sender.tab.id },
        });
        break;

      default:
        console.error(`Not a valid message type: ${message.type}`);
    }
  },
);
