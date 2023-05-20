/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// @ts-check
// This file is injected into the registry as text, no dependencies are allowed.

/** @typedef {import('@playwright/experimental-ct-core/types/component').Component} Component */
/** @typedef {import('@playwright/experimental-ct-core/types/component').JsxComponent} JsxComponent */
/** @typedef {import('@playwright/experimental-ct-core/types/component').ObjectComponent} ObjectComponent */
/** @typedef {new (...args: any[]) => HTMLElement} FrameworkComponent */

/** @type {Map<string, () => Promise<FrameworkComponent>>} */
const __pwLoaderRegistry = new Map();
/** @type {Map<string, FrameworkComponent>} */
const __pwRegistry = new Map();
const __pwListeners = new Map();

/**
 * @param {{[key: string]: () => Promise<FrameworkComponent>}} components
 */
export function pwRegister(components) {
  for (const [name, value] of Object.entries(components))
    __pwLoaderRegistry.set(name, value);
}

/**
 * @param {Component} component
 * @returns {component is JsxComponent | ObjectComponent}
 */
function isComponent(component) {
  return !(typeof component !== 'object' || Array.isArray(component));
}

/**
 * @param {Component} component
 */
async function __pwResolveComponent(component) {
  if (!isComponent(component))
    return

  let componentFactory = __pwLoaderRegistry.get(component.type);
  if (!componentFactory) {
    // Lookup by shorthand.
    for (const [name, value] of __pwLoaderRegistry) {
      if (component.type.endsWith(`_${name}`)) {
        componentFactory = value;
        break;
      }
    }
  }

  if (!componentFactory && component.type[0].toUpperCase() === component.type[0])
    throw new Error(`Unregistered component: ${component.type}. Following components are registered: ${[...__pwRegistry.keys()]}`);

  if(componentFactory)
    __pwRegistry.set(component.type, await componentFactory())

  if ('children' in component)
    await Promise.all(component.children.map(child => __pwResolveComponent(child)))
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
function __pwRemoveEvents(webComponent, events = {}) {
  for (const [key] of Object.entries(events)) {
    webComponent.removeEventListener(key, __pwListeners.get(key));
    __pwListeners.delete(key);
  }
}

/**
 * @param {HTMLElement} webComponent
 */
function __pwUpdateEvents(webComponent, events = {}) {
  for (const [key, listener] of Object.entries(events)) {
    const fn = event => listener(/** @type {CustomEvent} */ (event).detail);
    webComponent.addEventListener(key, fn);
    __pwListeners.set(key, fn);
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
  const Component = __pwRegistry.get(component.type);
  if (!Component)
    throw new Error(
      `Unregistered component: ${
        component.type
      }. Following components are registered: ${[...__pwRegistry.keys()]}`
    );

  const webComponent = new Component();
  __pwUpdateProps(webComponent, component.options?.props);
  __pwUpdateSlots(webComponent, component.options?.slots);
  __pwUpdateEvents(webComponent, component.options?.on);
  return webComponent;
}

window.playwrightMount = async (component, rootElement, hooksConfig) => {
  await __pwResolveComponent(component);
  if (component.kind !== 'object')
    throw new Error('JSX mount notation is not supported');

  const webComponent = __pwCreateComponent(component);

  for (const hook of window['__pw_hooks_before_mount'] || [])
    await hook({ hooksConfig });

  rootElement.appendChild(webComponent);

  for (const hook of window['__pw_hooks_after_mount'] || [])
    await hook({ hooksConfig });
};

window.playwrightUpdate = async (rootElement, component) => {
  await __pwResolveComponent(component);
  if (component.kind === 'jsx')
    throw new Error('JSX mount notation is not supported');

  const webComponent = /** @type {?HTMLElement} */ (rootElement.firstChild);
  if (!webComponent) throw new Error('Component was not mounted');

  __pwUpdateProps(webComponent, component.options?.props);
  __pwUpdateSlots(webComponent, component.options?.slots);
  __pwRemoveEvents(webComponent, component.options?.on);
  __pwUpdateEvents(webComponent, component.options?.on);
};

window.playwrightUnmount = async (rootElement) => {
  rootElement.replaceChildren();
};
