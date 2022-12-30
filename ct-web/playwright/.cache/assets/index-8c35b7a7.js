true&&(function polyfill() {
    const relList = document.createElement('link').relList;
    if (relList && relList.supports && relList.supports('modulepreload')) {
        return;
    }
    for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
        processPreload(link);
    }
    new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type !== 'childList') {
                continue;
            }
            for (const node of mutation.addedNodes) {
                if (node.tagName === 'LINK' && node.rel === 'modulepreload')
                    processPreload(node);
            }
        }
    }).observe(document, { childList: true, subtree: true });
    function getFetchOpts(script) {
        const fetchOpts = {};
        if (script.integrity)
            fetchOpts.integrity = script.integrity;
        if (script.referrerpolicy)
            fetchOpts.referrerPolicy = script.referrerpolicy;
        if (script.crossorigin === 'use-credentials')
            fetchOpts.credentials = 'include';
        else if (script.crossorigin === 'anonymous')
            fetchOpts.credentials = 'omit';
        else
            fetchOpts.credentials = 'same-origin';
        return fetchOpts;
    }
    function processPreload(link) {
        if (link.ep)
            // ep marker = processed
            return;
        link.ep = true;
        // prepopulate the load record
        const fetchOpts = getFetchOpts(link);
        fetch(link.href, fetchOpts);
    }
}());

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

const __pw_hooks_before_mount = [];
const __pw_hooks_after_mount = [];

window.__pw_hooks_before_mount = __pw_hooks_before_mount;
window.__pw_hooks_after_mount = __pw_hooks_after_mount;

const beforeMount = callback => {
  __pw_hooks_before_mount.push(callback);
};

const afterMount = callback => {
  __pw_hooks_after_mount.push(callback);
};

const index = '';

class Button extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = "<button>Submit</button>";
  }
}
customElements.define("pw-button", Button);

class Counter extends HTMLElement {
  constructor() {
    super();
  }
}
customElements.define("pw-button", Counter);

class DefaultSlot extends HTMLElement {
  constructor() {
    super();
  }
}
customElements.define("pw-button", DefaultSlot);

class NamedSlots extends HTMLElement {
  constructor() {
    super();
  }
}
customElements.define("pw-button", NamedSlots);

class MultiRoot extends HTMLElement {
  constructor() {
    super();
  }
}
customElements.define("pw-button", MultiRoot);

class Component extends HTMLElement {
  constructor() {
    super();
  }
}
customElements.define("pw-button", Component);

class EmptyTemplate extends HTMLElement {
  constructor() {
    super();
  }
}
customElements.define("pw-button", EmptyTemplate);

beforeMount(async ({ hooksConfig }) => {
  console.log(`Before mount: ${JSON.stringify(hooksConfig)}`);
});
afterMount(async () => {
  console.log(`After mount`);
});


// @ts-check
// This file is injected into the registry as text, no dependencies are allowed.


/** @typedef {import('../playwright-test/types/component').Component} Component */
/** @typedef {new (...args: any[]) => HTMLElement} FrameworkComponent */

/** @type {Map<string, FrameworkComponent>} */
const registry = new Map();

/**
 * @param {{[key: string]: FrameworkComponent}} components
 */
function register(components) {
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
    throw new Error('Object mount notation is not supported');

  return new Component();
}


window.playwrightMount = async (component, rootElement, hooksConfig) => {
  for (const hook of /** @type {any} */(window).__pw_hooks_before_mount || [])
    await hook({ hooksConfig });

  rootElement.appendChild(createComponent(component));

  for (const hook of /** @type {any} */(window).__pw_hooks_after_mount || [])
    await hook({ hooksConfig });
};
register({ _Users_sander_Desktop_playwright_ct_web_ct_web_src_components_Button_ts_Button: Button,
  _Users_sander_Desktop_playwright_ct_web_ct_web_src_components_Counter_ts_Counter: Counter,
  _Users_sander_Desktop_playwright_ct_web_ct_web_src_components_DefaultSlot_ts_DefaultSlot: DefaultSlot,
  _Users_sander_Desktop_playwright_ct_web_ct_web_src_components_NamedSlots_ts_NamedSlots: NamedSlots,
  _Users_sander_Desktop_playwright_ct_web_ct_web_src_components_MultiRoot_ts_MultiRoot: MultiRoot,
  _Users_sander_Desktop_playwright_ct_web_ct_web_src_components_Component_ts_Component: Component,
  _Users_sander_Desktop_playwright_ct_web_ct_web_src_components_EmptyTemplate_ts_EmptyTemplate: EmptyTemplate });
//# sourceMappingURL=index-8c35b7a7.js.map
