import { msg } from "@fw-components/localize";
import { html, css, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("fw-color-pick")
export class FwColorPick extends LitElement {
  @property()
  label?: string;

  @state()
  textColor = "";

  @property()
  value = "";

  handleChange(e: InputEvent) {
    const colorHEX = (e.target as HTMLInputElement)?.value;
    this.value = colorHEX;

    if (colorHEX == "rgba(0, 0, 0, 0)") return;

    const colorRGB = hexToRgb(colorHEX);
    const colorHSL = rgbToHsl(colorRGB.red, colorRGB.green, colorRGB.blue);

    const event = new CustomEvent("value-changed", {
      detail: { hex: colorHEX, rgb: colorRGB, hsl: colorHSL },
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(event);
  }

  getColorForLabel(value: string) {
    const { red, green, blue } = hexToRgb(value ?? "#ffffff");
    const intensity = red * 0.299 + green * 0.587 + blue * 0.114;
  
    return intensity > 186 ? '#000000' : '#FFFFFF';
  }

  updated(changedProperties : Map<string, unknown>) {
    if (changedProperties.has("value")) this.textColor = this.getColorForLabel(this.value);
  }

  render() {
    return html`
      <style>
        .color-button {
          position: relative;
          color: ${this.textColor};
          background-color: ${this.value};
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
        }
      </style>
      <button part="color-button" class="color-button" data-label-color="${this.value}">
        ${msg((this.label || "").trim())}
        <input
          part="color-hidden-input"
          class="colorpicker-hidden"
          type="color"
          value=${this.value}
          @change=${this.handleChange}
        />
      </button>
    `;
  }
}

function hexToRgb(hex: string) {
  const hexValues = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  const red = hexValues ? parseInt(hexValues[1], 16) : 0;
  const green = hexValues ? parseInt(hexValues[2], 16) : 0;
  const blue = hexValues ? parseInt(hexValues[3], 16) : 0;

  return { red, green, blue };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const l = Math.max(r, g, b);
  const s = l - Math.min(r, g, b);
  const h = s
    ? l === r
      ? (g - b) / s
      : l === g
      ? 2 + (b - r) / s
      : 4 + (r - g) / s
    : 0;
  const hslArr = [
    60 * h < 0 ? 60 * h + 360 : 60 * h,
    100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
    (100 * (2 * l - s)) / 2,
  ];

  const hslObj = {h : hslArr[0], s : hslArr[1], l : hslArr[2]};
  return hslObj;
}
