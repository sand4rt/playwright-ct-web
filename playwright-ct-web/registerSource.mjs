// @ts-check
// This file is injected into the registry as text, no dependencies are allowed.

/** @typedef {import('@playwright/test/types/component').Component} Component */
/** @typedef {new (...args: any[]) => HTMLElement} FrameworkComponent */

/** @type {Map<string, FrameworkComponent>} */
const registry = new Map();

/**
 * @param {{[key: string]: FrameworkComponent}} components
 */
export function register(components) {
  for (const [name, value] of Object.entries(components))
    registry.set(name, value);
}

/**
 * @param {string} html
 * @return {DocumentFragment}
 */
function stringToHtml(html) {
  return document.createRange().createContextualFragment(html);
}

/**
 * @param {string | string[]} slot
 */
function createSlots(slot) {
  if (typeof slot === 'string')
    return [stringToHtml(slot)];

  if (Array.isArray(slot))
    return slot.map(stringToHtml);

  throw Error(`Invalid slot received.`);
}

/**
 * @param {Component} component
 */
function createComponent(component) {
  let Component = registry.get(component.type);
  if (!Component) {
    // Lookup by shorthand.
    for (const [name, value] of registry) {
      if (component.type.endsWith(`_${name}`)) {
        Component = value;
        break;
      }
    }
  }

  if (!Component)
    throw new Error(
      `Unregistered component: ${
        component.type
      }. Following components are registered: ${[...registry.keys()]}`
    );

  if (component.kind !== 'object')
    throw new Error('JSX mount notation is not supported');

  const webComponent = new Component();

  for (const [key, value] of Object.entries(component.options?.props || {}))
    webComponent[key] = value;

  for (const [key, listener] of Object.entries(component.options?.on || {}))
    webComponent.addEventListener(key, event => listener(/** @type {CustomEvent} */ (event).detail));

  for (const [key, value] of Object.entries(component.options?.slots || {})) {
    if (key !== 'default')
      throw new Error('named slots are not yet supported');
    
    createSlots(value).forEach(slot => {
      webComponent.appendChild(slot);
    })
  }

  return webComponent;
}

window.playwrightUpdate = async (rootElement, component) => {
  if (component.kind === 'jsx')
    throw new Error('JSX mount notation is not supported');

  if (component.options?.slots)
    throw new Error('slots in component.update() is not yet supported');

  const wrapper = rootElement.firstChild;
  if (!wrapper)
    throw new Error('Component was not mounted');

  for (const [key, value] of Object.entries(component.options?.props || {}))
    wrapper[key] = value;

  for (const [key, listener] of Object.entries(component.options?.on || {}))
    wrapper.addEventListener(key, event => listener(/** @type {CustomEvent} */ (event).detail));
};

window.playwrightUnmount = async (rootElement) => {
  rootElement.replaceChildren();
};

window.playwrightMount = async (component, rootElement, hooksConfig) => {
  for (const hook of /** @type {any} */ (window).__pw_hooks_before_mount || [])
    await hook({ hooksConfig });

  rootElement.appendChild(createComponent(component));

  for (const hook of /** @type {any} */ (window).__pw_hooks_after_mount || [])
    await hook({ hooksConfig });
};
