import { test, expect } from "./fixtures";
import * as path from "path";
import * as fs from "fs";

const TEST_PATH = path.join(__dirname, "tests");
const COLOUR_STRING: string = "rgb(255, 255, 0)";

fs.readdirSync(TEST_PATH).forEach((test_id) => {
  // Get the test path ID
  const testPath = path.join(TEST_PATH, test_id);

  // Run the test
  test(`popup page: ${path.basename(testPath)}`, async ({
    page,
    extensionId,
    testInfo,
    loadData,
  }) => {
    // Get the test info
    const info = testInfo(testPath).test_info;

    // Load the extension to interact with it
    await page.goto(`chrome-extension://${extensionId}/popup/base.html`);

    // Calculate the alert value -  Add $10 for now to alway trigger true
    const alert_value = Number(info.expected.replace("$", "")) + 10;

    // Add value via storage api
    await loadData(page, {
      title: "test2",
      url: testPath,
      xpath: info.xpath,
      previousValue: info.expected,
      alertValue: alert_value,
      shouldAlert: info.shouldAlert,
    });

    // Click the scan button
    await page.click("#scan");

    // Get the elment which should change colour - only has 1 element at a time, so can assume oth element
    const element = await page.locator("#displayList").locator("div").first();
    const res = await checkUntilTimeout(element, COLOUR_STRING);

    // Return if the value matched
    expect(res).toBe(true);
  });
});

// Keep running the get colour command until it matches the expected value or timeout occours
async function checkUntilTimeout<T>(
  element: Locator,
  expectedValue: T,
  timeoutMs: number = 5000,
  intervalMs: number = 100,
): Promise<T | null> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    const color = await element.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue("background-color");
    });

    if (color === expectedValue) {
      return true;
    }

    // Wait for the specified interval before next attempt
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  // Timeout occurred
  return false;
}
