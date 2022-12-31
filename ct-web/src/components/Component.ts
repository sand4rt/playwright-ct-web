export class Component extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `<div>test</div>`
  }
}

customElements.define('pw-component', Component);
