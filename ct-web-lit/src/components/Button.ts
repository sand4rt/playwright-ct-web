import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('pw-button')
export class Button extends LitElement {
  @property({ type: String })
  title = '';

  render() {
    return html`<button>Submit ${this.title}</button>`;
  }
}
