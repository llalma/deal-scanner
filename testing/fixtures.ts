const { test: base, chromium } = require("@playwright/test");
const path = require("path");
import * as fs from "fs";

const EXTENSION_PATH = process.cwd();

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
  testInfo: (path: string) => { inputFolders: string[] };
  LoadData: (page: any, data: object) => {};
}>({
  // Get page context
  context: async ({}, use) => {
    const context = await chromium.launchPersistentContext("", {
      channel: "chromium",
      args: [
        `--disable-extensions-except=${EXTENSION_PATH}`,
        `--load-extension=${EXTENSION_PATH}`,
      ],
    });
    await use(context);
    await context.close();
  },

  // Fetch the extension id
  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers();
    if (!background) background = await context.waitForEvent("serviceworker");

    const extensionId = background.url().split("/")[2];
    await use(extensionId);
  },

  // Load test info using given path
  testInfo: async ({}, use) => {
    const getTestInfo = (test_info_path: string) => {
      const data = fs.readFileSync(
        path.join(test_info_path, "data.json"),
        "utf8",
      );
      const test_info = JSON.parse(data);

      return { test_info };
    };

    await use(getTestInfo);
  },

  // Load data via storage api
  loadData: async ({}, use) => {
    const loadData = async (page: any, data: object) => {
      await page.evaluate(
        ({ data }) => {
          return new Promise((resolve) => {
            chrome.storage.sync.set(
              {
                [crypto.randomUUID()]: {
                  title: data.title,
                  url: `file://${data.url}/page.html`,
                  xpath: data.xpath,
                  previousValue: data.expected,
                  alertValue: data.alertValue,
                  shouldAlert: data.shouldAlert,
                },
              },
              () => {
                resolve();
              },
            );
          });
        },
        {
          data: data,
        },
      );
    };
    await use(loadData);
  },
});
export const expect = test.expect;
