import { SHADOW_ROOT_IDENTIFIER } from "./constants.js";

/**
 * retrieves an element for a provided selector
 * @param {string} selector - css-selector 
 * @param {Document | ShadowRoot | null} context - context from where to start tree-traversal 
 * @returns {Element | null}
 */
export function getElementFromSelector(selector: string = "", context: Document | ShadowRoot | null = document) {
  if (context === null) context = document;

  if (!context?.querySelector) {
    console.warn("Provided context doesn't provide `querySelector` handler");
    return null;
  }

  if (!selector.includes(SHADOW_ROOT_IDENTIFIER)) return context!.querySelector(selector);

  const [current, ...nested] = selector.split(SHADOW_ROOT_IDENTIFIER);
  const element = context!.querySelector(current);
  if (!nested) return element;

  return getElementFromSelector(nested.join(SHADOW_ROOT_IDENTIFIER), element?.shadowRoot);
}

/**
 * converts provided js-path string into traversable string
 * note: helps avoid performing eval over a bare js-path
 * @param {string} jsPath - js-path to be converted
 * @returns {string}
 */
export function getSelectorForShadowRootJsPath(jsPath: string = "") {
  if (!jsPath.includes("document") || !jsPath.includes("querySelector")) return null;

  return Array.from(jsPath.matchAll(/\"([^\"]*)\"/g))
    .map(([_, selector]) => selector)
    .join(` ${SHADOW_ROOT_IDENTIFIER} `);
}

/**
 * matches provided path with given glob-pattern
 * note: only works for basic global-patterns in urls
 * @param {string} path - path to match the pattern with
 * @param {string} pattern - glob-pattern for urls
 * @returns {boolean}
 **/
export function matchPathPattern(path: string | string[], pattern: string | string[]): boolean {
  if (!Array.isArray(path)) path = path.split("/").filter(Boolean);
  if (!Array.isArray(pattern)) pattern = pattern.split("/").filter(Boolean);

  for (let [index, patternDir] of pattern.entries()) {
    if (patternDir === "**") return true;
    else if (patternDir === "*") {
      if (Boolean(pattern[index + 1])) continue;
      return !Boolean(path[index + 1]);
    }
    else if (patternDir === path[index]) {
      if (!pattern[index + 1] && !path[index + 1]) return true;
    } else return false;
  }

  return false;
}

/**
 * retrieves the DOM-element for the provided selector, along with all of it's parent shadowRoots
 * @param {string} selector - css-selector 
 * @param {Document | ShadowRoot | null} context - context from where to start tree-traversal 
 * @returns {{ destination: Element | null, context: Document | ShadowRoot, shadowRoots: ShadowRoot[] }}
 */
export function getNodeTree(selector: string, context: Document | ShadowRoot) {
  const tree = selector.split(SHADOW_ROOT_IDENTIFIER);

  const nodeTreeContext = { destination: null as Element | null, context, shadowRoots: [] as ShadowRoot[] };

  for (selector of tree) {
    const element = getElementFromSelector(selector, nodeTreeContext.context);
    if (!element) return nodeTreeContext;

    if (element.shadowRoot) nodeTreeContext.shadowRoots.push(element.shadowRoot);
    if (tree.indexOf(selector) === tree.length - 1) nodeTreeContext.destination = element;
    if (element.shadowRoot) nodeTreeContext.context = element.shadowRoot;
  }

  return nodeTreeContext;
}
