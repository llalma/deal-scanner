const { defineConfig } = require("@playwright/test");

export default defineConfig({
  testDir: "testing",
  testMatch: "test_*.ts",
});
