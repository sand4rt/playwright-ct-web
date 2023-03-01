import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('component-component')
export class Component extends LitElement {
  render() {
    return html`<div>test</div>`;
  }
}
