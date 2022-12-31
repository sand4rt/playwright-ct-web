import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators';

@customElement('pw-default-slot')
export class DefaultSlot extends LitElement {
  render() {
    return html`
      <div>
        <h1>Welcome!</h1>
        <main><slot /></main>
        <footer>Thanks for visiting.</footer>
      </div>
    `;
  }
}
