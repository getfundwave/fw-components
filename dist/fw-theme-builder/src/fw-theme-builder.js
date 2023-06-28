var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import "./fw-color-pick";
import "./fw-size-pick";
import "./fw-font-pick";
import { fontoptions, initialthemenew } from "./models";
let FwThemeBuilder = class FwThemeBuilder extends LitElement {
    constructor() {
        super();
        this.nav = "home";
        this.fontOptions = fontoptions;
        this.theme = initialthemenew;
    }
    colorChangeCallback(e, theme) {
        if (e.detail.type == "hex")
            this.theme.Colors[e.detail.section].rgb = e.detail.rgb;
        else
            this.theme.Colors[e.detail.section][e.detail.type] = e.detail.value;
    }
    sizeChangeCallback(e, theme) {
        this.theme.sizes[e.detail.section] = e.detail.value;
    }
    fontChangeCallback(e, theme) {
        this.theme.fonts[e.detail.section] = e.detail.value;
    }
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('color-change', (e) => this.colorChangeCallback(e, this.theme));
        this.addEventListener("size-change", (e) => this.sizeChangeCallback(e, this.theme));
        this.addEventListener("font-change", (e) => this.fontChangeCallback(e, this.theme));
    }
    disconnectedCallback() {
        this.removeEventListener("color-change", (e) => this.colorChangeCallback(e, this.theme));
        this.removeEventListener("size-change", (e) => this.sizeChangeCallback(e, this.theme));
        this.removeEventListener("font-change", (e) => this.fontChangeCallback(e, this.theme));
        super.disconnectedCallback();
    }
    sectionChangeHandler(e, s) {
        this.nav = s;
    }
    navigateBack() {
        if (this.nav == "home")
            return;
        if (this.nav == "Colors" || this.nav == "Sizes" || this.nav == "Fonts") {
            this.nav = "home";
        }
        else {
            this.nav = "Colors";
        }
    }
    render() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        let content;
        switch (this.nav) {
            case "home":
                content = html `
                <div part="content-container">
                    ${((_a = Object.keys(this.theme)) !== null && _a !== void 0 ? _a : []).map(section => (html `
                            <button part="theme-button" @click=${(e) => this.sectionChangeHandler(e, `${section}`)}>
                                ${section}
                            </button>
                            `))}
                </div>
            `;
                break;
            case "Colors":
                content = html `
                <div part="content-container">
                    ${((_b = Object.keys(this.theme.Colors)) !== null && _b !== void 0 ? _b : []).map(clr => (html `
                            <button part="theme-button" @click=${(e) => this.sectionChangeHandler(e, `Colors-${clr}`)}>
                                ${clr}
                            </button>
                            `))}
                </div>
                `;
                break;
            case "Sizes":
                content = html `
                <span part="content-container">
                    ${((_c = Object.keys(this.theme.Sizes)) !== null && _c !== void 0 ? _c : []).map(size => (html `
                            <fw-size-pick
                                exportparts="size-container, size-label, size-input"
                                label="${size}"
                                .theme="${this.theme}"
                                value="${size}"
                            >
                            </fw-size-pick>
                            `))}
                </span>
                `;
                break;
            case "Fonts":
                content = html `
                <span part="content-container">
                    ${((_d = Object.keys(this.theme.Fonts)) !== null && _d !== void 0 ? _d : []).map(font => (html `
                            <fw-font-pick
                                exportparts="font-container, font-label, font-button, font-dropdown-container, font-dropdown-option, font-dropdown-selected"
                                label="${font}"
                                value="${font}"
                                .theme="${this.theme}"
                                .options="${this.fontOptions}"
                            >
                            </fw-font-pick>
                            `))}
                </span>
                `;
                break;
            case "Colors-Primary":
                content = html `
                <span part="content-container">
                    ${((_e = Object.keys(this.theme.Colors.Primary)) !== null && _e !== void 0 ? _e : []).map((item) => (html `
                                <fw-color-pick
                                    exportparts="color-button, color-label, color-hidden-input"
                                    label="Primary ${item == "Hex" ? "" : item}"
                                    cssvariable="${item == "Hex" ? `--primary` : `--primary-${item.toLowerCase()}`}"
                                    .theme="${this.theme}"
                                    value="${item}"
                                    type="Primary"
                                >
                                </fw-color-pick>
                            `))}
                </span> 
                `;
                break;
            case "Colors-Secondary":
                content = html `
                <span part="content-container">
                    ${((_f = Object.keys(this.theme.Colors.Secondary)) !== null && _f !== void 0 ? _f : []).map((item) => (html `
                                <fw-color-pick
                                    exportparts="color-button, color-label, color-hidden-input"
                                    label="Secondary ${item == "Hex" ? "" : item}"
                                    cssvariable="${item == "Hex" ? `--secondary` : `--secondary-${item.toLowerCase()}`}"
                                    .theme="${this.theme}"
                                    value="${item}"
                                    type="Secondary"
                                >
                                </fw-color-pick>
                            `))}
                </span> 
                `;
                break;
            case "Colors-Background":
                content = html `
                <span part="content-container">
                    ${((_g = Object.keys(this.theme.Colors.Background)) !== null && _g !== void 0 ? _g : []).map((item) => (html `
                                <fw-color-pick
                                    exportparts="color-button, color-label, color-hidden-input"
                                    label="Background ${item == "Hex" ? "" : item}"
                                    cssvariable="${item == "Hex" ? `--background` : `--background-${item.toLowerCase()}`}"
                                    .theme="${this.theme}"
                                    value="${item}"
                                    type="Background"
                                >
                                </fw-color-pick>
                            `))}
                </span> 
                `;
                break;
            case "Colors-Error":
                content = html `
                <span part="content-container">
                    ${((_h = Object.keys(this.theme.Colors.Error)) !== null && _h !== void 0 ? _h : []).map((item) => (html `
                                <fw-color-pick
                                    exportparts="color-button, color-label, color-hidden-input"
                                    label="Error ${item == "Hex" ? "" : item}"
                                    cssvariable="${item == "Hex" ? `--error` : `--error-${item.toLowerCase()}`}"
                                    .theme="${this.theme}"
                                    value="${item}"
                                    type="Error"
                                >
                                </fw-color-pick>
                            `))}
                </span>`;
                break;
            case "Colors-Text":
                content = html `
                <span part="content-container">
                    ${((_j = Object.keys(this.theme.Colors.Text)) !== null && _j !== void 0 ? _j : []).map((item) => (html `
                                <fw-color-pick
                                    exportparts="color-button, color-label, color-hidden-input"
                                    label="Text ${item == "Hex" ? "" : item}"
                                    cssvariable="${item == "Hex" ? `--text` : `--text-${item.toLowerCase()}`}"
                                    .theme="${this.theme}"
                                    value="${item}"
                                    type="Text"
                                >
                                </fw-color-pick>
                            `))}
                </span>`;
                break;
        }
        return html `
            <div part="container" >
                <span part="back-icon-container" class="back-button ${this.nav == "home" ? "back-hidden" : ""}" @click="${this.navigateBack}">
                    <svg class="back-icon" width="46" height="80" viewBox="0 0 46 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M43.9567 77.8954C46.6811 75.1012 46.6811 70.5876 43.9567 67.7935L16.8527 39.9955L43.9567 12.1975C46.6811 9.40334 46.6811 4.88973 43.9567 2.0956C41.2324 -0.698533 36.8314 -0.698533 34.1071 2.0956L2.04329 34.9804C-0.681091 37.7745 -0.681092 42.2881 2.04328 45.0822L34.1071 77.967C36.7616 80.6895 41.2323 80.6895 43.9567 77.8954Z" fill="black"/>
                    </svg>
                </span>
                <span part="content-span">
                    ${content}
                </span>
            </div>
        `;
    }
};
FwThemeBuilder.styles = css `
    .primary-color {
        background-color: var(--primary) !important;
    }

    .secondary-color {
        background-color: var(--secondary) !important;
    }

    .primary-btn-text-color {
        background-color: var(--primary-contrast) !important;
    }

    .secondary-btn-text-color {
        background-color: var(--secondary-contrast) !important;
    }

    .title-text-color {
        background-color: var(--title-text-color) !important;
    }

    .subtitle-text-color {
        background-color: var(--subtitle-text-color) !important;
    }

    .body-text-color {
        background-color: var(--body-text-color) !important;
    }

    .background-color {
        background-color: var(--background-color) !important;
    }

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
    `;
__decorate([
    state()
], FwThemeBuilder.prototype, "nav", void 0);
__decorate([
    property({ type: Array })
], FwThemeBuilder.prototype, "fontOptions", void 0);
__decorate([
    property({ type: Object })
], FwThemeBuilder.prototype, "theme", void 0);
FwThemeBuilder = __decorate([
    customElement('fw-theme-builder')
], FwThemeBuilder);
//# sourceMappingURL=fw-theme-builder.js.map