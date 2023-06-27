export class FwAvatar extends LitElement {
    static get properties(): {
        name: ObjectConstructor;
        title: ObjectConstructor;
        color: ObjectConstructor;
        type: ObjectConstructor;
        imgSrc: StringConstructor;
        luminance: StringConstructor;
    };
    render(): import("lit-html").TemplateResult<1>;
    updated(changedProperties: any): void;
    getInitials(name: any): any;
    getColor(str: any): string;
}
import { LitElement } from "lit-element/lit-element";
