const { test: base, chromium } = require("@playwright/test");
const path = require("path");

const EXTENSION_PATH = path.join(process.cwd(), "../");
const TEST_PATH = path.join(__dirname, "tests");

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
  testInfo: (path: string) => { inputFolders: string[] };
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
    const getTestInfo = (path: string) => {
      const data = fs.readFileSync(path.join(TEST_PATH, "data.json"), "utf8");
      const test_info = JSON.parse(data);

      return { test_info };
    };

    await use(getTestInfo);
  },
});
export const expect = test.expect;
