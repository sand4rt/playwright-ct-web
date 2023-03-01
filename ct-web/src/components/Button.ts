export class Button extends HTMLElement {
  static _title: string;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static set title(title: string) {
    this._title = title;
  }

  static get title() {
    return this._title;
  }

  connectedCallback() {
    this.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('submit', { detail: 'hello' }));
    });
    this.render();
  }

  render() {
    if (!this.shadowRoot)
      return;
    this.shadowRoot.innerHTML = `<button>${this.title}</button>`;
  }
}

customElements.define('button-component', Button);
