import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('empty-template-component')
export class EmptyTemplate extends LitElement {
  render() {
    return html`<template></template>`;
  }
}
