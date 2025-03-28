export const REMOVE_CHARS = ["$"];

export function sanitise_xpath_value(val: string): string {
  // Remove REMOVE_CHARS from string
  for (const char of REMOVE_CHARS) {
    val = val.replace(char, "");
  }

  return val;
}
