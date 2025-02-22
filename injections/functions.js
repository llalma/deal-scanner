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
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  // If the element has an ID, return the shortest XPath - Only returns 1 / intentionall as its prefixed in return
  if (element.id) {
    return `/*[@id="${element.id}"]`;
  }

  const paths = [];

  while (element && element.nodeType === Node.ELEMENT_NODE) {
    // If an ancestor has an ID, return the shortest XPath
    if (element.id) {
      paths.unshift(`//*[@id="${element.id}"]`);
      break;
    }

    let index = 1;
    let sibling = element.previousElementSibling;

    while (sibling) {
      if (sibling.tagName === element.tagName) {
        index++;
      }
      sibling = sibling.previousElementSibling;
    }

    const tagName = element.tagName.toLowerCase();
    const pathPiece = index > 1 ? `${tagName}[${index}]` : tagName;
    paths.unshift(pathPiece);

    element = element.parentNode;
  }

  return `/${paths.join("/")}`;
}
