import {html, css, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement("fw-color-pick")
class FwColorPick extends LitElement {
  constructor() {
    super();
  }
  @property() 
  label? : string;
  @property() 
  CSSvariable = "";
  @property() 
  value? : string;
  @property() 
  styling = "";

  handleChange(e : any) {
    console.log(e);
    let clr = (e.target as HTMLInputElement)?.value;
    console.log("color", clr);
    if (clr == "rgba(0, 0, 0, 0)")
        return;
    document.body.style.setProperty(this.CSSvariable, clr);
    this.value = clr;
    let rgb = hexToRgb(clr);
    let textClr = rgbToHex((255 - rgb.r), (255 - rgb.g), (255 - rgb.b));
    console.log(rgb);
    console.log("textColor", textClr);
    (e.target as HTMLInputElement).parentElement?.style.setProperty("color", textClr);
  }

  firstUpdated() {
    this.styling = `
    .color-button {
      position: relative;
      background-color: var(${this.CSSvariable}) !important;
      border-radius: 4px;
      padding: 0.2rem 0.5rem;
      font-family: "DM Sans", sans-serif;
      font-weight: 400;
      color: #2b2b2b;
      cursor: pointer;
      box-shadow: #1b1b1b3b 0px 4px 10px;
    }
    .colorpicker-hidden {
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 20;
      border-radius: 4px;
      cursor: pointer;
    }`;
  }

  render () {
    return html`
    <style>${this.styling}</style>
      <span class="color-button" >
        <p>${this.label}</p>
        <input 
          class="colorpicker-hidden"
          type="color"
          value=${this.value || "ERROR"}
          @change=${this.handleChange}
        />
      </span>
    `;
  }
}

function hexToRgb(hex : string) {
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

function rgbToHex(r : number, g: number, b: number) {
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}