export class CustomizableTagName extends HTMLElement {
  static #tagName = `customizable-tag-name-component`;

  static register(prefix: string = '') {
    customElements.define(`${prefix}${CustomizableTagName.#tagName}`, CustomizableTagName);
  }

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
