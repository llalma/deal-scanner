import { test, expect } from "./fixtures";
import * as path from "path";
import * as fs from "fs";

test("Test display", async ({ page, extensionId, testInfo, loadData }) => {
  // Load the extension to interact with it
  await page.goto(`chrome-extension://${extensionId}/popup/base.html`);

  // Add value1 via storage api
  await loadData(page, {
    title: "test2",
    url: "url",
    xpath: "xpath",
    previousValue: "expected",
    alertValue: 0,
    shouldAlert: false,
  });

  // Add value2 via storage api
  await loadData(page, {
    title: "test1",
    url: "url",
    xpath: "xpath",
    previousValue: "expected",
    alertValue: 0,
    shouldAlert: false,
  });

  // Check value has been added
  const list_count: number = await page
    .locator("#displayList")
    .locator("div")
    .count();

  // Return if the value matched
  expect(list_count).toBe(2);
});
