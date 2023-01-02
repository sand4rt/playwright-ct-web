export class Button extends HTMLElement {
  _title!: string;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  set title(title: string) {
    this._title = title;
    this.render();
  }

  get title() {
    return this._title;
  }

  connectedCallback() {
    this.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('submit', { detail: 'hello' }));
    });
  }

  render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `<button>${this.title}</button>`;
  }
}

customElements.define('pw-button', Button);
