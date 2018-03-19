declare module 'domutils' {
  export function append(element, next);

  export function appendChild(element, child);

  export function compareDocumentPosition(nodeA, nodeB);

  export function existsOne(test, element);

  export function filter(test, element, recurse, limit);

  export function find(test, elements, recurse, limit);

  export function findAll(test, rootElements);

  export function findOne(test, elements);

  export function findOneChild(test, elements);

  export function getAttributeValue(element, name);

  export function getChildren(element);

  export function getElementById(id, element, recurse);

  export function getElements(options, element, recurse, limit);

  export function getElementsByTagName(name, element, recurse, limit);

  export function getElementsByTagType(type, element, recurse, limit);

  export function getInnerHTML(elements, options);

  export function getName(element);

  export function getOuterHTML(elements, options);

  export function getParent(element);

  export function getSiblings(element);

  export function getText(element);

  export function hasAttrib(element, name);

  export function isTag(element);

  export function prepend(element, prev);

  export function removeElement(element);

  export function removeSubsets(nodes);

  export function replaceElement(element, replaceElement);

  export function testElement(options, element);

  export function uniqueSort(nodes: any[]);
}
