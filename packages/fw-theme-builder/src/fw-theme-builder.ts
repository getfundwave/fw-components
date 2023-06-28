import {html, css, LitElement} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import "./fw-color-pick";
import "./fw-size-pick";
import "./fw-font-pick";
import {fontoptions, initialthemenew } from "./models";

@customElement('fw-theme-builder')
class FwThemeBuilder extends LitElement {
    constructor () {
        super();
    }
    @state()
    nav = "home";

    @property({type : Array})
    fontOptions = fontoptions;

    @property({type : Object})
    theme = initialthemenew;

    colorChangeCallback (e : any, theme : Object) {
        if (e.detail.type == "hex")
            this.theme.Colors[e.detail.section].rgb = e.detail.rgb;
        else
            this.theme.Colors[e.detail.section][e.detail.type] = e.detail.value;
    }

    sizeChangeCallback (e : any, theme : Object) {
        this.theme.Sizes[e.detail.section] = e.detail.value;
    }

    fontChangeCallback (e : any, theme : Object) {
        this.theme.Fonts[e.detail.section]= e.detail.value;
    }

    connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener('color-change', (e: any) => this.colorChangeCallback(e, this.theme));
        this.addEventListener("size-change", (e: any) => this.sizeChangeCallback(e, this.theme));
        this.addEventListener("font-change", (e: any) => this.fontChangeCallback(e, this.theme));

    }

    disconnectedCallback(): void {
        this.removeEventListener("color-change", (e: any) => this.colorChangeCallback(e, this.theme));
        this.removeEventListener("size-change", (e: any) => this.sizeChangeCallback(e, this.theme));
        this.removeEventListener("font-change", (e: any) => this.fontChangeCallback(e, this.theme));
        super.disconnectedCallback();
    }


    static styles = css`
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

    sectionChangeHandler (e : any, s : string) {
        this.nav = s;
    }

    navigateBack() {
        if (this.nav == "home")
            return; 
        if (this.nav == "Colors" || this.nav == "Sizes"  || this.nav == "Fonts" ) {
            this.nav = "home";
        } else {
            this.nav = "Colors";
        }
    }
    
    render () {
        let content;
        switch (this.nav) {
            case "home":
                content = html`
                <div part="content-container">
                    ${
                        (Object.keys(this.theme)??[]).map(section => (
                            html`
                            <button part="theme-button" @click=${(e : any) => this.sectionChangeHandler(e, `${section}`)}>
                                ${section}
                            </button>
                            `
                        ))
                    }
                </div>
            `;    
            break;
            case "Colors":
                content = html`
                <div part="content-container">
                    ${
                        (Object.keys(this.theme.Colors)??[]).map(clr => (
                            html`
                            <button part="theme-button" @click=${(e : any) => this.sectionChangeHandler(e, `Colors-${clr}`)}>
                                ${clr}
                            </button>
                            `
                        ))
                    }
                </div>
                `;
            break;
            case "Sizes":
                content = html`
                <span part="content-container">
                    ${
                        (Object.keys(this.theme.Sizes)??[]).map(size => (
                            html`
                            <fw-size-pick
                                exportparts="size-container, size-label, size-input"
                                label="${size}"
                                .theme="${this.theme}"
                                value="${size}"
                            >
                            </fw-size-pick>
                            `
                        ))
                    }
                </span>
                `;
            break;
            case "Fonts":
                content = html`
                <span part="content-container">
                    ${
                        (Object.keys(this.theme.Fonts)??[]).map(font => (
                            html`
                            <fw-font-pick
                                exportparts="font-container, font-label, font-button, font-dropdown-container, font-dropdown-option, font-dropdown-selected"
                                label="${font}"
                                value="${font}"
                                .theme="${this.theme}"
                                .options="${this.fontOptions}"
                            >
                            </fw-font-pick>
                            `
                        ))
                    }
                </span>
                `;
            break;

            case "Colors-Primary":
                content = html`
                <span part="content-container">
                    ${
                        (Object.keys(this.theme.Colors.Primary)??[]).map((item) => (
                            html`
                                <fw-color-pick
                                    exportparts="color-button, color-label, color-hidden-input"
                                    label="Primary ${item == "Hex" ? "" : item}"
                                    cssvariable="${item == "Hex" ? `--primary`: `--primary-${item.toLowerCase()}`}"
                                    .theme="${this.theme}"
                                    value="${item}"
                                    type="Primary"
                                >
                                </fw-color-pick>
                            `
                        ))
                    }
                </span> 
                `;
            break;
            case "Colors-Secondary":
                content = html`
                <span part="content-container">
                    ${
                        (Object.keys(this.theme.Colors.Secondary)??[]).map((item) => (
                            html`
                                <fw-color-pick
                                    exportparts="color-button, color-label, color-hidden-input"
                                    label="Secondary ${item == "Hex" ? "" : item}"
                                    cssvariable="${item == "Hex" ? `--secondary`: `--secondary-${item.toLowerCase()}`}"
                                    .theme="${this.theme}"
                                    value="${item}"
                                    type="Secondary"
                                >
                                </fw-color-pick>
                            `
                        ))
                    }
                </span> 
                `;
            break;
            case "Colors-Background":
                content = html`
                <span part="content-container">
                    ${
                        (Object.keys(this.theme.Colors.Background)??[]).map((item) => (
                            html`
                                <fw-color-pick
                                    exportparts="color-button, color-label, color-hidden-input"
                                    label="Background ${item == "Hex" ? "" : item}"
                                    cssvariable="${item == "Hex" ? `--background`: `--background-${item.toLowerCase()}`}"
                                    .theme="${this.theme}"
                                    value="${item}"
                                    type="Background"
                                >
                                </fw-color-pick>
                            `
                        ))
                    }
                </span> 
                `;
            break;
            case "Colors-Error":
                content = html`
                <span part="content-container">
                    ${
                        (Object.keys(this.theme.Colors.Error)??[]).map((item) => (
                            html`
                                <fw-color-pick
                                    exportparts="color-button, color-label, color-hidden-input"
                                    label="Error ${item == "Hex" ? "" : item}"
                                    cssvariable="${item == "Hex" ? `--error`: `--error-${item.toLowerCase()}`}"
                                    .theme="${this.theme}"
                                    value="${item}"
                                    type="Error"
                                >
                                </fw-color-pick>
                            `
                        ))
                    }
                </span>`;
            break;
            case "Colors-Text":
                content = html`
                <span part="content-container">
                    ${
                        (Object.keys(this.theme.Colors.Text)??[]).map((item) => (
                            html`
                                <fw-color-pick
                                    exportparts="color-button, color-label, color-hidden-input"
                                    label="Text ${item == "Hex" ? "" : item}"
                                    cssvariable="${item == "Hex" ? `--text`: `--text-${item.toLowerCase()}`}"
                                    .theme="${this.theme}"
                                    value="${item}"
                                    type="Text"
                                >
                                </fw-color-pick>
                            `
                        ))
                    }
                </span>`;
            break;
        }

        return html`
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
}
