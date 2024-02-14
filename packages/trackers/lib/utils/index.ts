import { MULTIPLE_TARGETS_IDENTIFIER, SHADOW_ROOT_IDENTIFIER } from "./constants.js";

/**
 * retrieves multiple elements for a provided selector
 * @param {string} selector - css-selector
 * @param {Document | ShadowRoot | null} context - context from where to start tree-traversal
 * @returns {Element[] | null}
 */
export function getElementsFromSelector(selector: string = "", context: Document | DocumentFragment | Element | null = document): Element[] | null {
  if (!context?.querySelector) {
    console.warn("Provided context doesn't provide `querySelector` handler");
    return null;
  }

  if (!selector.includes(SHADOW_ROOT_IDENTIFIER) && !selector.includes(MULTIPLE_TARGETS_IDENTIFIER)) return Array.from(context!.querySelectorAll(selector));

  if (selector.includes(MULTIPLE_TARGETS_IDENTIFIER)) {
    const [branchParent, ...tail] = selector.split(MULTIPLE_TARGETS_IDENTIFIER);
    const pathToChildren = tail.join(MULTIPLE_TARGETS_IDENTIFIER).replace(/^[^\w]+/, "");
    const targets = getElementsFromSelector(branchParent, context);

    if (!pathToChildren) return targets;

    const descendants =
      targets?.reduce((store, parent) => {
        const descendant = getElementsFromSelector(pathToChildren, parent?.shadowRoot || parent);
        if (descendant) store.push(...descendant);
        return store;
      }, [] as Element[]) || null;

    return descendants;
  }

  const [current, ...nested] = selector.split(SHADOW_ROOT_IDENTIFIER);
  if (!nested) return Array.from(context!.querySelectorAll(current));

  const element = context!.querySelector(current);
  return getElementsFromSelector(nested.join(SHADOW_ROOT_IDENTIFIER), element?.shadowRoot);
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
    } else if (patternDir === path[index]) {
      if (!pattern[index + 1] && !path[index + 1]) return true;
    } else return false;
  }

  return false;
}

/**
 * retrieves the DOM-element for the provided selector, along with all of it's parent shadowRoots
 * @param {string} selector - css-selector
 * @param {Document | ShadowRoot | null} context - context from where to start tree-traversal
 * @returns {{ destinations: Element[] | null, context: Document | ShadowRoot, shadowRoots: ShadowRoot[] }}
 */
export function getNodeTree(selector: string, context: Document | ShadowRoot) {
  const nodeTreeContext = { destinations: null as Element[] | null, context, shadowRoots: [] as ShadowRoot[] };

  const targets = getElementsFromSelector(selector, nodeTreeContext.context);
  if (!targets) return nodeTreeContext;

  const element = targets[0];
  if (element?.shadowRoot && !(targets.length > 1)) {
    nodeTreeContext.shadowRoots.push(element.shadowRoot);
    nodeTreeContext.context = element.shadowRoot;
  }
  nodeTreeContext.destinations = targets;

  return nodeTreeContext;
}
