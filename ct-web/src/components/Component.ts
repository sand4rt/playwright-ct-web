export class Component extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    if (!this.shadowRoot)
      return;
    this.shadowRoot.innerHTML = `<div>test</div>`;
  }
}

customElements.define('pw-component', Component);
