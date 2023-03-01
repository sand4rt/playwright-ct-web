export class MultiRoot extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    if (!this.shadowRoot)
      return;
    this.shadowRoot.innerHTML = `
      <div>root 1</div>
      <div>root 2</div>
    `;
  }
}

customElements.define('multi-root-component', MultiRoot);
