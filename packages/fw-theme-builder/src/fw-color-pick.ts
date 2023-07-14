import { html, css, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("fw-color-pick")
class FwColorPick extends LitElement {
  @property()
  label?: string;

  @state()
  textColor = "";

  @property()
  value = "";

  handleChange(e: any) {
    let clr = (e.target as HTMLInputElement)?.value;
    this.value = clr;
    if (clr == "rgba(0, 0, 0, 0)") return;
    const rgbClr = hexToRgb(clr);
    const hslClr = rgbToHsl(rgbClr.r, rgbClr.g, rgbClr.b);
    let detail = {
      hex: clr,
      rgb: rgbClr,
      hsl: hslClr
    };
    const event = new CustomEvent("value-changed", {
      detail,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  updated(changedProperties : any) {
    if (changedProperties.has("value")) {
      let rgb = hexToRgb(this.value ?? "#ffffff");
      let textClr = rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b);
      this.textColor = textClr;
    }
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
      <button part="color-button" class="color-button">
        ${this.label}
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
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : {
        r: 0,
        g: 0,
        b: 0,
      };
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
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
