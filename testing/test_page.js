const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const test_folder = path.join(__dirname, "tests");

let browser;

async function test_page(test_path) {
  // Collect info from data
  const data = fs.readFileSync(path.join(test_path, "data.json"), "utf8");
  const test_info = JSON.parse(data);

  // Create a new page to run test on
  const page = await browser.newPage();

  // Load the local file
  const filePath = `file://${path.join(test_path, "page.html")}`;
  await page.goto(filePath);

  // Run an XPath query (Example: Select all <p> elements)
  const element = await page.waitForSelector(`::-p-xpath(${test_info.xpath})`);
  const text = await page.evaluate((el) => el.textContent, element);

  await browser.close();

  console.assert(text === test_info.expected);
}

(async () => {
  // Create instance of puppeteer
  browser = await puppeteer.launch();

  fs.readdir(test_folder, async (err, files) => {
    files.forEach(async (test) => {
      const test_path = path.join(test_folder, test);
      await test_page(test_path);
    });
  });
})();
