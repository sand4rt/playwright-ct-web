export class Button extends HTMLElement {
  set title(title: string) {
    this.innerHTML = `<button>${title}</button>`
  }

  constructor() {
    super();

    this.innerHTML = `<button>${this.title}</button>`;
  }
}

customElements.define('pw-button', Button);
