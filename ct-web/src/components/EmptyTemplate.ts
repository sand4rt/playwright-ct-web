export class EmptyTemplate extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = '<template></template>';
  }
}

customElements.define('pw-empty-template', EmptyTemplate);
