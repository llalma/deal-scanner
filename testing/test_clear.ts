import { test, expect } from "./fixtures";
import * as path from "path";
import * as fs from "fs";

test("Test display", async ({ page, extensionId, testInfo, loadData }) => {
  // Load the extension to interact with it
  await page.goto(`chrome-extension://${extensionId}/popup/base.html`);

  // Add value via storage api
  await loadData(page, {
    title: "test2",
    url: "url",
    xpath: "xpath",
    previousValue: "expected",
    alertValue: 0,
    shouldAlert: false,
  });

  // Click the clear button
  await page.click("#clear");

  // Wait 1 second fo rupdate
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Get the current count of list
  const list_count: number = await page
    .locator("#displayList")
    .locator("div")
    .count();

  // Return if the value matched
  expect(list_count).toBe(0);
});
