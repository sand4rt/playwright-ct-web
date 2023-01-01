export class DefaultSlot extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <div>
        <h1>Welcome!</h1>
        <main><slot /></main>
        <footer>Thanks for visiting.</footer>
      </div>
    `;
  }
}

customElements.define('pw-default-slot', DefaultSlot);
