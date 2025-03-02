import { test, expect } from "./fixtures";
import * as path from "path";
import * as fs from "fs";

const TEST_PATH = path.join(__dirname, "tests");

fs.readdirSync(TEST_PATH).forEach((test_id) => {
  // Get the test path ID
  const testPath = path.join(TEST_PATH, test_id);

  // Run the test
  test(`popup page: ${path.basename(testPath)}`, async ({
    page,
    extensionId,
    testInfo,
  }) => {
    // Get the test info
    const info = testInfo(testPath).test_info;

    page.on("console", (msg) => console.log(msg.text()));

    await page.goto(`chrome-extension://${extensionId}/popup/base.html`);

    // Add value via storage api
    await page.evaluate(
      ({ url, xpath, expected }) => {
        return new Promise((resolve) => {
          chrome.storage.sync.set(
            {
              [crypto.randomUUID()]: {
                title: "test",
                url: "/home/llalma/Documents/Projects/price-checker-extension/testing/tests/8b4d1aefa1ee3b35fb1865b950b6529e2faedd20710d0fa74a462b1942924297/page.html",
                xpath: xpath,
                previousValue: expected,
                alertValue: "166",
                shouldAlert: false,
              },
            },
            () => {
              resolve();
            },
          );
        });
      },
      { url: info.url, xpath: info.xpath, expected: info.expected },
    );

    // Click the scan button
    await page.click("#scan");
    await page.screenshot({ path: "playrwight_chrome_extensions.png" });

    console.log(await page.context().pages());

    // await page.goto(`file://${path.join(testPath, "page.html")}`);
    // await expect(page.locator(info.xpath)).toHaveText(info.expected, {
    //   useInnerText: true,
    // });
  });
});
