export class Button extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `<button>${this.title}</button>`;
  }

  set title(title: string) {
    this.innerHTML = `<button>${title}</button>`;
  }

  connectedCallback() {
    this.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('submit', { detail: 'hello' }));
    });
  }
}

customElements.define('pw-button', Button);
