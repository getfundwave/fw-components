var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
let FwColorPick = class FwColorPick extends LitElement {
    constructor() {
        super(...arguments);
        this.CSSvariable = "";
        this.value = "";
        this.type = "";
        this.styling = "";
        this.textColor = "";
    }
    handleChange(e) {
        var _a, _b;
        let clr = (_a = e.target) === null || _a === void 0 ? void 0 : _a.value;
        if (clr == "rgba(0, 0, 0, 0)")
            return;
        let detail = {
            "section": this.type,
            "type": this.value,
            "value": clr,
            "rgb": hexToRgb(clr),
        };
        const event = new CustomEvent('color-change', { detail, bubbles: true, composed: true });
        this.dispatchEvent(event);
        // document.body.style.setProperty(this.CSSvariable, clr);
        let rgb = hexToRgb(clr);
        let textClr = rgbToHex((255 - rgb.r), (255 - rgb.g), (255 - rgb.b));
        (_b = e.target.parentElement) === null || _b === void 0 ? void 0 : _b.style.setProperty("color", textClr);
    }
    firstUpdated() {
        var _a;
        let rgb = hexToRgb((_a = this.theme.Colors[this.type][this.value]) !== null && _a !== void 0 ? _a : "#ffffff");
        let textClr = rgbToHex((255 - rgb.r), (255 - rgb.g), (255 - rgb.b));
        this.textColor = textClr;
        this.styling = `
    .color-button {
      position: relative;
      color: ${this.textColor};
      background-color: var(${this.CSSvariable}) !important;
    }
    .colorpicker-hidden {
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 20;
      cursor: pointer;
    }`;
    }
    render() {
        return html `
    <style>${this.styling}</style>
    <button part="color-button" class="color-button" >
      ${this.label}
      <input 
        part="color-hidden-input"
        class="colorpicker-hidden"
        type="color"
        value=${this.theme.Colors[this.type][this.value] || "ERROR"}
        @change=${this.handleChange}
      />
    </button>
    `;
    }
};
__decorate([
    property()
], FwColorPick.prototype, "label", void 0);
__decorate([
    property()
], FwColorPick.prototype, "CSSvariable", void 0);
__decorate([
    property()
], FwColorPick.prototype, "value", void 0);
__decorate([
    property()
], FwColorPick.prototype, "type", void 0);
__decorate([
    property()
], FwColorPick.prototype, "theme", void 0);
__decorate([
    property()
], FwColorPick.prototype, "styling", void 0);
__decorate([
    state()
], FwColorPick.prototype, "textColor", void 0);
FwColorPick = __decorate([
    customElement("fw-color-pick")
], FwColorPick);
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : {
        r: 0,
        g: 0,
        b: 0
    };
}
function rgbToHex(r, g, b) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}
//# sourceMappingURL=fw-color-pick.js.map