const { chromium } = require("playwright");
const { test, expect } = require("@playwright/test");
const path = require("path");
const fs = require("fs");

let browser;

const test_folder = path.join(__dirname, "tests");

// Path to extension DIR - Shouldnt change
const EXTENSION_PATH = path.join(process.cwd(), "../");

async function test_page(test_path) {
  // Collect info from data
  const data = fs.readFileSync(path.join(test_path, "data.json"), "utf8");
  const test_info = JSON.parse(data);

  // Open a new page
  const page = await browser.newPage();

  // Load locally saved test
  const filePath = `file://${path.join(test_path, "page.html")}`;
  await page.goto(filePath);

  // Assert that values match
  await expect(page.locator(test_info.xpath)).toHaveText(test_info.expected, {
    useInnerText: true,
  });

  await browser.close();
}

(async () => {
  // Launch browser with the extension loaded
  browser = await chromium.launchPersistentContext("", {
    channel: "chromium",
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
    ],
  });

  fs.readdir(test_folder, async (err, files) => {
    files.forEach(async (test) => {
      await test_page(path.join(test_folder, test));
    });
  });
})();
