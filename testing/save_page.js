const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const test_folder = "tests";

// Function to get full XPath
const getFullXPath = (element) => {
  let xpath = "";
  while (element && element.nodeType === Node.ELEMENT_NODE) {
    let count = 0;
    let sibling = element;
    while (sibling) {
      if (
        sibling.nodeType === Node.ELEMENT_NODE &&
        sibling.nodeName === element.nodeName
      ) {
        count++;
      }
      sibling = sibling.previousSibling;
    }
    let tagName = element.nodeName.toLowerCase();
    let index = count > 1 ? `[${count}]` : "";
    xpath = `/${tagName}${index}${xpath}`;
    element = element.parentNode;
  }
  return xpath;
};

async function save_page(url, xpath, expected) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  // Function to get full XPath
  const getFullXPath = (element) => {
    let xpath = "";
    while (element && element.nodeType === Node.ELEMENT_NODE) {
      let count = 0;
      let sibling = element;
      while (sibling) {
        if (
          sibling.nodeType === Node.ELEMENT_NODE &&
          sibling.nodeName === element.nodeName
        ) {
          count++;
        }
        sibling = sibling.previousSibling;
      }
      let tagName = element.nodeName.toLowerCase();
      let index = count > 1 ? `[${count}]` : "";
      xpath = `/${tagName}${index}${xpath}`;
      element = element.parentNode;
    }
    return xpath;
  };

  // Inject script to modify the HTML
  await page.evaluate(() => {
    function getFullXPath(element) {
      let xpath = "";
      while (element && element.nodeType === Node.ELEMENT_NODE) {
        let count = 0;
        let sibling = element;
        while (sibling) {
          if (
            sibling.nodeType === Node.ELEMENT_NODE &&
            sibling.nodeName === element.nodeName
          ) {
            count++;
          }
          sibling = sibling.previousSibling;
        }
        let tagName = element.nodeName.toLowerCase();
        let index = count > 1 ? `[${count}]` : "";
        xpath = `/${tagName}${index}${xpath}`;
        element = element.parentNode;
      }
      return xpath;
    }

    document.querySelectorAll("*").forEach((el) => {
      el.setAttribute("data-xpath", getFullXPath(el));
    });
  });

  // Create dir if it dosent exist
  const folder_name = `${test_folder}/${crypto.randomUUID()}`;
  if (!fs.existsSync(folder_name)) {
    fs.mkdirSync(folder_name, { recursive: true });
  }

  // Save the loaded HTML
  const content = await page.evaluate(() => document.documentElement.outerHTML);
  fs.writeFileSync(path.join(folder_name, "page.html"), content);

  // Write the expected path and value as json
  const data = {
    url: url,
    xpath: xpath,
    expected: expected,
  };
  fs.writeFileSync(
    path.join(folder_name, "data.json"),
    JSON.stringify(data, null, 2),
  );

  await browser.close();
}

save_page(
  "https://www.roddandgunn.com/au/clothing/jeans/gunn-straight-fit-jean/007297-04.html?bvstate=pg%3A2%2Fct%3Ar&cgid=best_sellers",
  '//*[@id="product-content"]/div/span/h2',
  "$149.00",
);
