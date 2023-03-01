import { LitElement, html } from 'lit';
import { customElement, eventOptions, property } from 'lit/decorators.js';

let remountCount = 0 

@customElement('counter-component')
export class Counter extends LitElement {
  @property({ type: Number })
  count!: number;

  constructor() {
    super();
    remountCount++;
  }

  @eventOptions({ passive: true })
  onClick() {
    this.dispatchEvent(new CustomEvent('submit', { detail: 'hello' }));
  }
  
  render() {
    return html`
      <div  @click=${this.onClick}>
        <div id="props">${this.count}</div>
        <div id="remount-count">${remountCount}</div>
        <slot name="main" />
        <slot />
      </div>
    `;
  }
}
