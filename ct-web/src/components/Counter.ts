export class Counter extends HTMLElement {
  constructor() {
    super();
  }
}

customElements.define('pw-counter', Counter);
