export class EmptyTemplate extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = '<template></template>';
  }
}

customElements.define('pw-empty-template', EmptyTemplate);
