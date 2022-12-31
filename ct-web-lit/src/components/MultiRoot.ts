import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators';

@customElement('pw-multi-root')
export class MultiRoot extends LitElement {
  render() {
    return html`
      <div>root 1</div>
      <div>root 2</div>
    `;
  }
}
