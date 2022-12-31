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
    throw new Error(`Unregistered component: ${component.type}. Following components are registered: ${[...registry.keys()]}`);

  if (component.kind !== 'object')
    throw new Error('JSX mount notation is not supported');

  const webComponent = new Component();

  for (const [key, value] of Object.entries(component.options?.props || {})) {
    webComponent[key] = value
  }

  return webComponent;
}

window.playwrightUnmount = async rootElement => {
  rootElement.replaceChildren();
};

window.playwrightMount = async (component, rootElement, hooksConfig) => {
  for (const hook of /** @type {any} */(window).__pw_hooks_before_mount || [])
    await hook({ hooksConfig });

  rootElement.appendChild(createComponent(component));

  for (const hook of /** @type {any} */(window).__pw_hooks_after_mount || [])
    await hook({ hooksConfig });
};
