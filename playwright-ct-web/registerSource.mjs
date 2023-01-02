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
 * @param {ChildNode} webComponent 
 */
function updateProps(webComponent, props = {}) {
  for (const [key, value] of Object.entries(props))
    webComponent[key] = value;
}

/**
 * @param {ChildNode} webComponent 
 */
function updateEvents(webComponent, events = {}) {
  for (const [key, listener] of Object.entries(events)) {
    webComponent.addEventListener(key, event =>
      listener(/** @type {CustomEvent} */ (event).detail)
    );
  }
}

/**
 * @param {string} html
 * @return {?HTMLElement}
 */
function stringToHtml(html) {
  return /** @type {?HTMLElement} */ (document.createRange().createContextualFragment(html).firstChild);
}

/**
 * @param {HTMLElement} webComponent 
 */
function updateSlots(webComponent, slots = {}) {
  for (const [key, value] of Object.entries(slots)) {
    let slotElements;
    if (typeof value === 'string')
      slotElements = [stringToHtml(value)];
  
    if (Array.isArray(value))
      slotElements = value.map(stringToHtml);
  
    if (!slotElements)
      throw new Error(`Invalid slot with name: \`${key}\` supplied to \`mount()\`, expected \`string | string[]\``);

    for (const slotElement of slotElements) {
      if (!slotElement)
        throw new Error(`Invalid slot with name: \`${key}\` supplied to \`mount()\``);

      if (key === 'default') {
        webComponent.appendChild(slotElement);
        continue;
      }

      if (slotElement.nodeName === '#text') {
        throw new Error(
          `Invalid slot with name: \`${key}\` supplied to \`mount()\`, expected \`HTMLElement\` but received \`TextNode\`.`
        );
      }

      slotElement.slot = key;
      webComponent.appendChild(slotElement);
    }
  }
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
  updateProps(webComponent, component.options?.props);
  updateSlots(webComponent, component.options?.slots);
  updateEvents(webComponent, component.options?.on);
  return webComponent;
}

window.playwrightUpdate = async (rootElement, component) => {
  if (component.kind === 'jsx')
    throw new Error('JSX mount notation is not supported');

  const webComponent = /** @type {?HTMLElement} */ (rootElement.firstChild);
  if (!webComponent) throw new Error('Component was not mounted');

  updateProps(webComponent, component.options?.props);
  updateSlots(webComponent, component.options?.slots);
  updateEvents(webComponent, component.options?.on);
};

window.playwrightUnmount = async (rootElement) => {
  rootElement.replaceChildren();
};

window.playwrightMount = async (component, rootElement, hooksConfig) => {
  for (const hook of window['__pw_hooks_before_mount'] || [])
    await hook({ hooksConfig });

  rootElement.appendChild(createComponent(component));

  for (const hook of window['__pw_hooks_after_mount'] || [])
    await hook({ hooksConfig });
};
