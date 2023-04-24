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
export function pwRegister(components) {
  for (const [name, value] of Object.entries(components))
    registry.set(name, value);
}

/**
 * @param {HTMLElement} webComponent
 */
function __pwUpdateProps(webComponent, props = {}) {
  for (const [key, value] of Object.entries(props))
    webComponent[key] = value;
}

/**
 * @param {HTMLElement} webComponent
 */
function __pwUpdateAttributes(webComponent, attributes = {}) {
  for (const [key, value] of Object.entries(attributes))
    webComponent.setAttribute(key, typeof value === 'boolean' ? '' : value);
}

/**
 * @param {HTMLElement} webComponent
 */
function __pwRemoveEvents(webComponent, events = {}) {
  for (const [key] of Object.entries(events)) {
    webComponent.removeEventListener(key, listeners.get(key));
    listeners.delete(key);
  }
}

/**
 * @param {HTMLElement} webComponent
 */
function __pwUpdateEvents(webComponent, events = {}) {
  for (const [key, listener] of Object.entries(events)) {
    const fn = event => listener(/** @type {CustomEvent} */ (event).detail);
    webComponent.addEventListener(key, fn);
    listeners.set(key, fn);
  }
}

/**
 * @param {HTMLElement} webComponent
 */
function __pwUpdateSlots(webComponent, slots = {}) {
  for (const [key, value] of Object.entries(slots)) {
    let slotElements;
    if (typeof value !== 'object')
      slotElements = [__pwCreateSlot(value)];

    if (Array.isArray(value))
      slotElements = value.map(__pwCreateSlot);

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
function __pwCreateSlot(value) {
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
function __pwCreateComponent(component) {
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

  const webComponent = __pwCreateComponent(component);
  __pwUpdateProps(webComponent, component.options?.props);
  __pwUpdateAttributes(webComponent, component.options?.attributes);
  __pwUpdateSlots(webComponent, component.options?.slots);
  __pwUpdateEvents(webComponent, component.options?.on);

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

  __pwUpdateProps(webComponent, component.options?.props);
  __pwUpdateAttributes(webComponent, component.options?.attributes);
  __pwUpdateSlots(webComponent, component.options?.slots);
  __pwRemoveEvents(webComponent, component.options?.on);
  __pwUpdateEvents(webComponent, component.options?.on);
};

window.playwrightUnmount = async (rootElement) => {
  rootElement.replaceChildren();
};
