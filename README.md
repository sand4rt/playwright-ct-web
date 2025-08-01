# 🎭 Playwright Web component testing

> The API has been designed to closely resemble Playwright's API wherever applicable. This library is _(without guarantee)_ aimed at facilitating a smooth transition once Playwright offers official support for Web component testing.

## Capabilities

- Run tests fast, in parallel and optionally over multiple machines with [sharding](https://playwright.dev/docs/test-sharding) or [Azure's Testing Service](https://www.youtube.com/watch?v=FvyYC2pxL_8).
- Run the test headless or headed accross multiple _real_ desktop and/or mobile browser engines.
- Full support for shadow DOM, SVG/Canvas, multiple origins, (i)frames, browser tabs and contexts.
- Minimizes flakyness, due to auto waiting, web first assertions and ensures that every test runs in [full isolation](https://playwright.dev/docs/browser-contexts).
- Advanced [emulation capabilities](https://playwright.dev/docs/emulation) such as modifying screen size, geolocation, color scheme and [the network](https://playwright.dev/docs/mock-browser-apis).
- Interactions with the components are indistinguishable from real user behavior.
- [Visual regression / screenshot testing](https://playwright.dev/docs/api/class-pageassertions#page-assertions-to-have-screenshot-1).
- Zero-configuration TypeScript support.

Along with all these ✨ awesome capabilities ✨ that come with Playwright, you will also get:

- [Watch mode _(BETA)_](https://github.com/microsoft/playwright/issues/21960#issuecomment-1483604692).
- [Visual Studio Code intergration](https://playwright.dev/docs/getting-started-vscode).
- [UI mode](https://playwright.dev/docs/test-ui-mode) for debuging tests with a time travel experience complete with watch mode.
- [Playwright Tracing](https://playwright.dev/docs/trace-viewer-intro) for post-mortem debugging in CI.
- [Playwright Test Code generation](https://playwright.dev/docs/codegen-intro) to record and generate tests suites.

## Usage

Initialize Playwright Web component testing with PNPM, NPM or Yarn and follow the installation steps:

```sh
pnpm create playwright-sand4rt --ct
```
```sh
npm init playwright-sand4rt@latest -- --ct
```
```sh
yarn create playwright-sand4rt --ct
```

Now you can start creating your tests:

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
