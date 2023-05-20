# Playwright Web component testing

> **Note**
> The API has been designed to closely resemble Playwright's API wherever applicable. This library is _(without guarantee)_ aimed at facilitating a smooth transition to Playwright once it offers official support for Web components. It is important to take into account that this library will reach end of life when Playwright has official support for Web component testing.
> 
> To push for official support, feedback in the form of github issues and or stars is appreciated!

## Usage

Initialize Playwright Web component testing with PNPM, NPM or Yarn and follow the installation steps:

```sh
pnpm dlx create-playwright-sand4rt --ct
```
```sh
npm init playwright-sand4rt@latest -- --ct
```
```sh
yarn create playwright-sand4rt --ct
```

Now you can start adding your first test:

```ts
// Button.ts
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('button-component')
export class Button extends LitElement {
  @property({ type: String })
  title!: string;

  render() {
    return html`<button>${this.title}</button>`;
  }
}
```

```jsx
// Button.test.ts
import { test, expect } from '@sand4rt/experimental-ct-web';
import { Button } from './components/Button';

test('render props', async ({ mount }) => {
  const component = await mount(Button, {
    props: {
      title: 'Submit',
    },
  });
  await expect(component).toContainText('Submit');
});
```

See the official [playwright component testing documentation](https://playwright.dev/docs/test-components) and the tests for [lit](https://github.com/sand4rt/playwright-ct-web/tree/master/ct-web-lit/tests) and [native web components](https://github.com/sand4rt/playwright-ct-web/tree/master/ct-web/tests) for more information on how to use it.
