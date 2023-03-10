// @ts-check
// This file is injected into the registry as text, no dependencies are allowed.

/** @typedef {import('@playwright/test/types/component').Component} Component */
/** @typedef {new (...args: any[]) => HTMLElement} FrameworkComponent */

/** @type {Map<string, FrameworkComponent>} */
const registry = new Map();
const listeners = new Map();

/**
 * @param {{[key: string]: FrameworkComponent}} components
 */
export function register(components) {
  for (const [name, value] of Object.entries(components))
    registry.set(name, value);
}

/**
 * @param {HTMLElement} webComponent
 */
function updateProps(webComponent, props = {}) {
  for (const [key, value] of Object.entries(props))
    webComponent[key] = value;
}

/**
 * @param {HTMLElement} webComponent
 */
function removeEvents(webComponent, events = {}) {
  for (const [key] of Object.entries(events)) {
    webComponent.removeEventListener(key, listeners.get(key));
    listeners.delete(key);
  }
}

/**
 * @param {HTMLElement} webComponent
 */
function updateEvents(webComponent, events = {}) {
  for (const [key, listener] of Object.entries(events)) {
    const fn = event => listener(/** @type {CustomEvent} */ (event).detail);
    webComponent.addEventListener(key, fn);
    listeners.set(key, fn);
  }
}

/**
 * @param {HTMLElement} webComponent
 */
function updateSlots(webComponent, slots = {}) {
  for (const [key, value] of Object.entries(slots)) {
    let slotElements;
    if (typeof value !== 'object')
      slotElements = [createSlot(value)];

    if (Array.isArray(value))
      slotElements = value.map(createSlot);

    if (!slotElements)
      throw new Error(`Invalid slot with name: \`${key}\` supplied to \`mount()\``);

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
 * @param {any} value
 * @return {?HTMLElement}
 */
function createSlot(value) {
  return /** @type {?HTMLElement} */ (
    document
      .createRange()
      .createContextualFragment(value)
      .firstChild
  );
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

  return new Component();
}

window.playwrightMount = async (component, rootElement, hooksConfig) => {
  if (component.kind !== 'object')
    throw new Error('JSX mount notation is not supported');

  const webComponent = createComponent(component);
  updateProps(webComponent, component.options?.props);
  updateSlots(webComponent, component.options?.slots);
  updateEvents(webComponent, component.options?.on);

  for (const hook of window['__pw_hooks_before_mount'] || [])
    await hook({ hooksConfig });

  rootElement.appendChild(webComponent);

  for (const hook of window['__pw_hooks_after_mount'] || [])
    await hook({ hooksConfig });
};

window.playwrightUpdate = async (rootElement, component) => {
  if (component.kind === 'jsx')
    throw new Error('JSX mount notation is not supported');

  const webComponent = /** @type {?HTMLElement} */ (rootElement.firstChild);
  if (!webComponent) throw new Error('Component was not mounted');

  updateProps(webComponent, component.options?.props);
  updateSlots(webComponent, component.options?.slots);
  removeEvents(webComponent, component.options?.on);
  updateEvents(webComponent, component.options?.on);
};

window.playwrightUnmount = async (rootElement) => {
  rootElement.replaceChildren();
};
