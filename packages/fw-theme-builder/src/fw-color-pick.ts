import {html, css, LitElement} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';

@customElement("fw-color-pick")
class FwColorPick extends LitElement {
  @property() 
  label? : string;

  @property() 
  section = "";

  @property() 
  type = "";

  @property() 
  theme? : any;

  @property() 
  styling = "";

  @state()
  textColor = "";

  handleChange(e : any) {
    let clr = (e.target as HTMLInputElement)?.value;
    if (clr == "rgba(0, 0, 0, 0)")
      return;

    let detail = {
      "section" : this.type,
      "type"    : this.section,
      "value"   : clr,
      "rgb"     : hexToRgb(clr),
    }
    const event = new CustomEvent('color-change', { detail, bubbles : true, composed : true });
    this.dispatchEvent(event);
    
    let rgb = hexToRgb(clr);
    let textClr = rgbToHex((255 - rgb.r), (255 - rgb.g), (255 - rgb.b));
    (e.target as HTMLInputElement).parentElement?.style.setProperty("color", textClr);
    (e.target as HTMLInputElement).parentElement?.style.setProperty("background-color", clr);
  }

  firstUpdated() {
    let rgb = hexToRgb(this.theme.Colors[this.type][this.section] ?? "#ffffff");
    let textClr = rgbToHex((255 - rgb.r), (255 - rgb.g), (255 - rgb.b));
    this.textColor = textClr;
    this.styling = `
    .color-button {
      position: relative;
      color: ${this.textColor};
      background-color: ${this.theme.Colors[this.type][this.section]};
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

  render () {
    return html`
    <style>${this.styling}</style>
    <button part="color-button" class="color-button" >
      ${this.label}
      <input 
        part="color-hidden-input"
        class="colorpicker-hidden"
        type="color"
        value=${this.theme.Colors[this.type][this.section] || "ERROR"}
        @change=${this.handleChange}
      />
    </button>
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