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

/** @typedef {import('@playwright/experimental-ct-core/types/component').ObjectComponent} ObjectComponent */
/** @typedef {new (...args: any[]) => HTMLElement} FrameworkComponent */

const __pwListeners = new Map();

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
 * @param {ObjectComponent} component
 */
function __pwCreateComponent(component) {
  const webComponent = new component.type();
  __pwUpdateProps(webComponent, component.props);
  __pwUpdateSlots(webComponent, component.slots);
  __pwUpdateEvents(webComponent, component.on);
  return webComponent;
}

window.playwrightMount = async (component, rootElement, hooksConfig) => {
  if (component.__pw_type === 'jsx')
    throw new Error('JSX mount notation is not supported');

  for (const hook of window['__pw_hooks_before_mount'] || [])
    await hook({ hooksConfig, App: component.type });

  const webComponent = __pwCreateComponent(component);

  rootElement.appendChild(webComponent);

  for (const hook of window['__pw_hooks_after_mount'] || [])
    await hook({ hooksConfig, instance: webComponent });
};

window.playwrightUpdate = async (rootElement, component) => {
  if (component.__pw_type === 'jsx')
    throw new Error('JSX mount notation is not supported');

  const webComponent = /** @type {?HTMLElement} */ (rootElement.firstChild);
  if (!webComponent)
    throw new Error('Component was not mounted');

  __pwUpdateProps(webComponent, component.props);
  __pwUpdateSlots(webComponent, component.slots);
  __pwRemoveEvents(webComponent, component.on);
  __pwUpdateEvents(webComponent, component.on);
};

window.playwrightUnmount = async (rootElement) => {
  rootElement.replaceChildren();
};
