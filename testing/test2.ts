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
    const info = testInfo(testPath);
    console.log(info);
    await page.goto(`file://${path.join(testPath, "page.html")}`);
    await expect(page.locator(info.xpath)).toHaveText(info.expected, {
      useInnerText: true,
    });
  });
});
