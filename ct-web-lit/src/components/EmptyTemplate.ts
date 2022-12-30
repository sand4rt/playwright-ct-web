import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('pw-empty-template')
export class EmptyTemplate extends LitElement {
  render() {
    return html`<template></template>`;
  }
}
