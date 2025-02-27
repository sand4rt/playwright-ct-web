import { LitElement, html } from 'lit';

export class CustomizableTagName extends LitElement {
    private static tagName = `customizable-tag-name-component`;

    static register(prefix: string = '') {
        customElements.define(`${prefix}${CustomizableTagName.tagName}`, CustomizableTagName);
    }

    render() {
        return html`<div>test</div>`;
    }
}
