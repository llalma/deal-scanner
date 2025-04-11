class Item {
  // Properties
  name: string;
  link: string;
  xpath: string;
  original_value: float;
  target_price: float;
  alert_bool: bool;
  error_alert: [string];
  tags: [string];

  constructor(
    name: string,
    link: string,
    xpath: string,
    original_value: float,
    target_price: float,
    alert_bool: bool,
    error_alert: [string],
    tags: [string],
  ) {
    this.name = name;
    this.link = link;
    this.xpath = xpath;
    this.original_value = original_value;
    this.target_price = target_price;
    this.alert_bool = alert_bool;
    this.error_alert = error_alert;
    this.tags = tags;
  }

  // Method 1
  greet(): void {
    console.log(`Hello, my name is ${this.name}.`);
  }
}
