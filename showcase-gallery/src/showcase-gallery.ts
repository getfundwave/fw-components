import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import "@fw-components/formula-editor";
import "@fw-components/fw-avatar";
import { fwAvatarGroupShowcase } from "./components/fw-avatar-group-showcase";

@customElement("showcase-gallery")
class ShowcaseGallery extends LitElement {
  static styles = css`
    .showcase-gallery {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 100%;
    }

    .gallery-sidebar {
      width: 30%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      list-style-type: none;
    }

    .gallery-sidebar li {
      cursor: pointer;
    }

    .component {
      width: 70%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `;

  @state()
  currentComponent = 2;

  componentList: { [key: string]: TemplateResult } = {
    "FW Avatar": html`<fw-avatar
      name="Fundwave"
      title="PE Funds"
      imgSrc="https://yt3.googleusercontent.com/ytc/AGIKgqMS30TaqQXVW2DCV-m1pFo5dzrLGDdjhqb5Zipw=s900-c-k-c0x00ffffff-no-rj"
    ></fw-avatar>`,
    "FW Avatar Group": fwAvatarGroupShowcase,
    "Formula Editor": html`<formula-editor></formula-editor>`,
  };

  render() {
    return html`
      <div class="showcase-gallery">
        <ul class="gallery-sidebar">
          ${Object.keys(this.componentList).map((componentName, index) => {
            return html`<li @click=${() => (this.currentComponent = index)}>
              ${componentName}
            </li>`;
          })}
        </ul>

        <div class="component">
          ${this.componentList[
            Object.keys(this.componentList)[this.currentComponent]
          ]}
        </div>
      </div>
    `;
  }
}
