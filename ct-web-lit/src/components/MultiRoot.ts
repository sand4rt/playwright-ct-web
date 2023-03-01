import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('multi-root-component')
export class MultiRoot extends LitElement {
  render() {
    return html`
      <div>root 1</div>
      <div>root 2</div>
    `;
  }
}
