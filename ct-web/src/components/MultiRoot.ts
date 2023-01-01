export class MultiRoot extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <div>root 1</div>
      <div>root 2</div>
    `;
  }
}

customElements.define('pw-multi-root', MultiRoot);
