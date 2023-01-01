export class DefaultSlot extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
      <div>
        <h1>Welcome!</h1>
        <main><slot /></main>
        <footer>Thanks for visiting.</footer>
      </div>
    `;
  }
}

customElements.define('pw-default-slot', DefaultSlot);
