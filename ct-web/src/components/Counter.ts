let remountCount = 0 

export class Counter extends HTMLElement {
  set count(count: string) {
    this.innerHTML = `
      <div>
        <div id="props">${count}</div>
        <div id="remount-count">${remountCount}</div>
        <slot name="main" />
        <slot />
      </div>
    `;
  }

  constructor() {
    super();
    remountCount++;
    this.innerHTML = `
      <div>
        <div id="props">${this.count}</div>
        <div id="remount-count">${remountCount}</div>
        <slot name="main" />
        <slot />
      </div>
    `
  }

  connectedCallback() {
    this.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('submit', { detail: 'hello' }));
    });
  }
}

customElements.define('pw-counter', Counter);
