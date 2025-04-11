import { expect, test } from "vitest";
import { clean_up_text_field } from "./functions.js";

test.each([
  ["10.00", 10.0],
  ["1.32", 1.32],
  [".15", 0.15],
  ["625", 625.0],
  ["$84525", 84525.0],
  ["$13.99", 13.99],
])("Values are converted correctly", (input, expected) => {
  expect(clean_up_text_field(input)).toBe(expected);
});
