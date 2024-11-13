import { html, css, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "./fw-color-pick";
import "./fw-size-pick";
import "./fw-font-pick";
import { fontoptions, initialthemenew } from "./models";

@customElement("fw-theme-builder")
class FwThemeBuilder extends LitElement {
  @state()
  nav = "home";

  @property({ type: Array })
  fontOptions = fontoptions;

  @property({ type: Object })
  theme = initialthemenew;

  @property({ type: Boolean })
  viewByGroup = false;

  static styles = css`
    .back-button {
      user-select: none;
      cursor: pointer;
      width: 3rem;
      padding: 0.5rem 0.5rem;
      z-index: 100;
    }
    .back-hidden {
      opacity: 0;
      cursor: default;
    }
    .back-icon {
      height: 1rem;
    }

    .action-button {
      transition: all 0.1s ease-in-out;
      cursor: pointer;
      width: 3.5rem;
      user-select: none;
      text-align: center;
      border-radius: 4px;
      font-family: "DM Sans", sans-serif;
      padding: 0.5rem 0.5rem;
      box-shadow: #1b1b1b3b 0px 4px 2px;
    }
    .save-btn {
      background-color: #aaf16f;
    }
    .discard-btn {
      background-color: #e7e7e7;
    }
    .action-button:active {
      box-shadow: none;
      transform: translateY(-2px);
    }
    .color-group-heading {
      font-weight: 300;
      margin: 0.25rem 0rem 0.1rem 0rem;
    }
    .section-heading {
      font-weight: 300;
      margin: 1rem 0rem 0.25rem 0rem;
      border-bottom: 1px solid #1b1b1b3b;
      padding-bottom: 0.2rem;
    }
  `;

  sectionChangeHandler(e: any, s: string) {
    this.nav = s;
  }

  navigateBack() {
    if (this.nav == "home") return;
    if (this.nav == "Colors" || this.nav == "Sizes" || this.nav == "Fonts") {
      this.nav = "home";
    } else {
      this.nav = "Colors";
    }
  }

  createFontPickComponent(font: string) {
    return html` <fw-font-pick
      exportparts="font-container, font-label, font-button, font-dropdown-container, font-dropdown-option, font-dropdown-selected"
      .label=${font}
      @value-changed=${(e: any) => {
        let detail = {
          type: font,
          value: e.detail.value,
        };
        this.shadowRoot?.dispatchEvent(
          new CustomEvent("font-change", {
            detail,
            bubbles: true,
            composed: true,
          })
        );
        this.theme.Fonts[font] = e.detail.value;
        this.theme = { ...this.theme };
      }}
      .options="${this.fontOptions}"
      .value=${this.theme.Fonts[font]}
    >
    </fw-font-pick>`;
  }

  createSizePickComponent(size: string) {
    return html` <fw-size-pick
      exportparts="size-container, size-label, size-input"
      .label=${size}
      @value-changed=${(e: any) => {
        let detail = {
          type: size,
          value: e.detail.value,
        };
        this.shadowRoot?.dispatchEvent(
          new CustomEvent("size-change", {
            detail,
            bubbles: true,
            composed: true,
          })
        );
        this.theme.Sizes[size] = e.detail.value;
        this.theme = { ...this.theme };
      }}
      .value=${this.theme.Sizes[size]}
    >
    </fw-size-pick>`;
  }

  createColorPickComponent(group: string, type: string) {
    return html` <fw-color-pick
      exportparts="color-button, color-label, color-hidden-input"
      @value-changed=${(e: any) => {
        let detail = {
          group: group,
          type: type,
          value: e.detail.hex,
          rgb: e.detail.rgb,
          hsl: e.detail.hsl,
        };
        this.shadowRoot?.dispatchEvent(
          new CustomEvent("color-change", {
            detail,
            bubbles: true,
            composed: true,
          })
        );
        this.theme.Colors[group][type] = e.detail.hex;
        this.theme = { ...this.theme };
      }}
      .label=${`${group} ${
        type?.toLowerCase().slice(-3) == "hex"
          ? type?.toLowerCase().slice(0, -4)
          : type
      }`}
      .value="${this.theme.Colors[group][type]}"
    >
    </fw-color-pick>`;
  }

  getContent() {
    let content;
    switch (this.nav) {
      case "home":
        content = html` <div part="content-container">
          ${(Object.keys(this.theme) ?? []).map(
            (section) => html` <button
              part="theme-button"
              @click=${(e: any) => this.sectionChangeHandler(e, `${section}`)}
            >
              ${section}
            </button>`
          )}
        </div>`;
        break;
      case "Colors":
        content = html` <div part="content-container">
          ${(Object.keys(this.theme.Colors) ?? []).map(
            (clr) => html` <button
              part="theme-button"
              @click=${(e: any) =>
                this.sectionChangeHandler(e, `Colors-${clr}`)}
            >
              ${clr}
            </button>`
          )}
        </div>`;
        break;
      case "Sizes":
        content = html` <span part="content-container">
          ${this.theme["Sizes"] && Object.keys(this.theme["Sizes"]).length != 0
            ? Object.keys(this.theme["Sizes"]).map((size: string) =>
                this.createSizePickComponent(size)
              )
            : null}
        </span>`;
        break;
      case "Fonts":
        content = html` <span part="content-container">
          ${Object.keys(this.theme["Fonts"]).map((font: string) =>
            this.createFontPickComponent(font)
          )}
        </span>`;
        break;
      default:
        const group = this.nav.slice(7);
        content = html` <span part="content-container">
          ${Object.keys(this.theme["Colors"][group]).map((type: string) =>
            this.createColorPickComponent(group, type)
          )}
        </span>`;
        break;
    }
    return content;
  }

  render() {
    return html`
      <div part="container">
        ${this.viewByGroup
          ? html` <span
                part="back-icon-container"
                class="back-button ${this.nav == "home" ? "back-hidden" : ""}"
                @click="${this.navigateBack}"
              >
                <svg
                  class="back-icon"
                  width="46"
                  height="80"
                  viewBox="0 0 46 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M43.9567 77.8954C46.6811 75.1012 46.6811 70.5876 43.9567 67.7935L16.8527 39.9955L43.9567 12.1975C46.6811 9.40334 46.6811 4.88973 43.9567 2.0956C41.2324 -0.698533 36.8314 -0.698533 34.1071 2.0956L2.04329 34.9804C-0.681091 37.7745 -0.681092 42.2881 2.04328 45.0822L34.1071 77.967C36.7616 80.6895 41.2323 80.6895 43.9567 77.8954Z"
                    fill="black"
                  />
                </svg>
              </span>
              <span part="content-span"> ${this.getContent()} </span>`
          : html`
              ${
                // Fonts
                this.theme && this.theme["Fonts"] &&
                Object.keys(this.theme["Fonts"]).length != 0
                  ? html`<div part="fonts-ungrouped-container">
                      <h2
                        class="section-heading"
                        part="fonts-ungrouped-heading"
                      >
                        Fonts
                      </h2>
                      ${Object.keys(this.theme["Fonts"]).map((font: string) =>
                        this.createFontPickComponent(font)
                      )}
                    </div>`
                  : null
              }
              ${
                // Sizes
                this.theme && this.theme["Sizes"] &&
                Object.keys(this.theme["Sizes"]).length != 0
                  ? html`<div part="sizes-ungrouped-container">
                      <h2
                        class="section-heading"
                        part="sizes-ungrouped-heading"
                      >
                        Sizes
                      </h2>
                      ${Object.keys(this.theme["Sizes"]).map((size: string) =>
                        this.createSizePickComponent(size)
                      )}
                    </div>`
                  : null
              }
              ${
                // Colors
                this.theme && this.theme["Colors"] &&
                Object.keys(this.theme["Colors"]).length != 0
                  ? html`<div part="colors-ungrouped-container">
                      <h2
                        class="section-heading"
                        part="colors-ungrouped-heading"
                      >
                        Colors
                      </h2>
                      ${Object.keys(this.theme["Colors"]).map(
                        (group) => html`
                          <div part="color-group-container">
                            <h3
                              class="color-group-heading"
                              part="color-group-heading"
                            >
                              ${group}
                            </h3>
                            ${Object.keys(this.theme["Colors"][group]).map(
                              (type: string) =>
                                this.createColorPickComponent(group, type)
                            )}
                          </div>
                        `
                      )}
                    </div>`
                  : null
              }
            `}
      </div>
    `;
  }
}
