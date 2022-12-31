# Playwright web component testing

> **Note**
> Playwright component testing is marked as experimental by the playwright team. 

## Usage

First, install playwright and initialize component testing, then install the web component adapter.

```sh
npm init playwright@latest -- --ct
npm install -D @sand4rt/experimental-ct-web
```

After installing the config needs to be modified:

```ts
import { PlaywrightTestConfig } from "@sand4rt/experimental-ct-web";

const config: PlaywrightTestConfig = {
  // Your config
};

export default config;
```

Now you can start adding your first test:

```ts
// Button.ts
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';


@customElement('pw-button')
export class Button extends LitElement {
  render() {
    return html`<button>Submit</button>`
  }
}
```

```jsx
// Button.test.ts
import { test, expect } from '@sand4rt/experimental-ct-web';
import { Button } from './components/Button';

test('render props', async ({ mount }) => {
  const component = await mount(Button);
  await expect(component).toContainText('Submit');
});
```

See the offical [playwright component testing documentation](https://playwright.dev/docs/test-components) and the tests for [lit](./ct-web-lit/src/tests.spec.ts) and [native web components](ct-web/src/tests.spec.ts) for more information on how to use it.

