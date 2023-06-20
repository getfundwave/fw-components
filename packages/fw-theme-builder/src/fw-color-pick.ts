import {html, css, LitElement} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';

@customElement("fw-color-pick")
class FwColorPick extends LitElement {
  @property() 
  label? : string;

  @property() 
  CSSvariable = "";

  @property() 
  value = "";

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
      "type"    : this.value,
      "value"   : clr,
    }
    const event = new CustomEvent('color-change', { detail, bubbles : true, composed : true });
    this.dispatchEvent(event);

    document.body.style.setProperty(this.CSSvariable, clr);
    this.theme.colors[this.type][this.value] = clr;

    detail = {...(this.theme)}
    const event2 = new CustomEvent('theme-change', { detail, bubbles : true, composed : true });
    this.dispatchEvent(event2);
    
    let rgb = hexToRgb(clr);
    let textClr = rgbToHex((255 - rgb.r), (255 - rgb.g), (255 - rgb.b));
    (e.target as HTMLInputElement).parentElement?.style.setProperty("color", textClr);
  }

  firstUpdated() {
    let rgb = hexToRgb(this.theme.colors[this.type][this.value] ?? "#ffffff");
    let textClr = rgbToHex((255 - rgb.r), (255 - rgb.g), (255 - rgb.b));
    this.textColor = textClr;
    this.styling = `
    .color-button {
      min-width: 6rem;
      height: 3.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      background-color: var(${this.CSSvariable}) !important;
      border-radius: 4px;
      padding: 0.2rem 0.5rem;
      font-family: "DM Sans", sans-serif;
      font-weight: 400;
      color: ${this.textColor};
      cursor: pointer;
      box-shadow: #1b1b1b3b 0px 4px 10px;
    }
    .color-button > p {
      margin: 0;
      font-family: "DM Sans", sans-serif;
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
        value=${this.theme.colors[this.type][this.value] || "ERROR"}
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