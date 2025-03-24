function mouseover_func(e) {
  if (window._previousElement) {
    window._previousElement.style.outline = "";
  }
  e.target.style.outline = "2px solid red";
  window._previousElement = e.target;
}

function mouseout_func(e) {
  if (window._previousElement) {
    window._previousElement.style.outline = "";
  }
}

// Find the Xpath of the selected element
function getXPath(element) {
  // If element has an id, we can construct a shorter xpath using id
  if (element.id) {
    return `//*[@id="${element.id}"]`;
  }

  // Get the path to the element
  const paths = [];

  // Loop until we reach the root element
  while (element.nodeType === Node.ELEMENT_NODE) {
    // Get the element's position among its siblings
    let index = 1;
    let sibling = element.previousSibling;

    while (sibling) {
      if (
        sibling.nodeType === Node.ELEMENT_NODE &&
        sibling.tagName === element.tagName
      ) {
        index++;
      }
      sibling = sibling.previousSibling;
    }

    // Construct the path piece
    const tagName = element.tagName.toLowerCase();
    const pathPiece = index > 1 ? `${tagName}[${index}]` : tagName;
    paths.unshift(pathPiece);

    element = element.parentNode;
  }

  return `/${paths.join("/")}`;
}
