let remountCount = 0 

export class Counter extends HTMLElement {
  _count!: number;

  set count(count: number) {
    this._count = count;
    this.render();
  }

  get count() {
    return this._count;
  }
  
  constructor() {
    super();
    remountCount++;  
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  connectedCallback() {
    this.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('submit', { detail: 'hello' }));
    });
  }

  render() {
    if (!this.shadowRoot) 
      return;
    
    this.shadowRoot.innerHTML = `
      <div>
        <div id="props">${this.count}</div>
        <div id="remount-count">${remountCount}</div>
        <slot name="main" />
        <slot />
      </div>
    `
  }
}

customElements.define('pw-counter', Counter);
