import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('named-slots-component')
export class NamedSlots extends LitElement {
  render() {
    return html`
      <div>
        <header>
          <slot name="header" />
        </header>
        <main>
          <slot name="main" />
        </main>
        <footer>
          <slot name="footer" />
        </footer>
      </div>
    `;
  }
}
