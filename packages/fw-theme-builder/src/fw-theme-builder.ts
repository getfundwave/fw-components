import {html, css, LitElement} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import "./fw-color-pick";
import "./fw-size-pick";
import "./fw-font-pick";
import { home, colors, sizes, fonts, pallette, textcolors, fontoptions, initialtheme } from "./models";

@customElement('fw-theme-builder')
class FwThemeBuilder extends LitElement {
    constructor() {
        super();
    }

    @state()
    nav = "home";

    @property()
    fontOptions = fontoptions;

    @property()
    theme = initialtheme;

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

    .floating-container {
        position: absolute;
        bottom: 1rem;
        width: 70rem;
        left: calc((100svw - 72rem)/2);
        height: max-content;
        background-color: #ffffff;
        z-index: 10;
        border-radius: 10px;
        box-shadow: 0px 10px 40px -10px #1b1b1b4c;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 1rem 1rem;
    }

    .content-container {
        display: flex;
        justify-content: center;
        gap: 1rem;
    }

    .back-button {
        user-select: none;
        cursor: pointer;
        width: 5rem;
        padding: 0.5rem 0.5rem;
    }
    .back-hidden {
        opacity: 0;
        cursor: default;
    }
    .back-icon {
        height: 1rem;
    }
    
    .save-button {
        transition: all 0.1s ease-in-out;
        cursor: pointer;
        width: 5rem;
        user-select: none;
        text-align: center;
        background-color: #aaf16f;
        border-radius: 4px;
        font-family: "DM Sans", sans-serif;
        padding: 0.5rem 0.5rem;
        box-shadow: #1b1b1b3b 0px 4px 2px;
    }
    .save-button:active {
        box-shadow: none;
        transform: translateY(2px)
    }
    

    .theme-button {
        user-select: none;
        width: 6rem;
        height: 3.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f5e6e6;
        border-radius: 4px;
        padding: 0.2rem 0.5rem;
        font-family: "DM Sans", sans-serif;
        font-weight: 400;
        color: #2b2b2b;
        cursor: pointer;
        box-shadow: #1b1b1b3b 0px 4px 10px;
    }
    .theme-button:hover {
        background-color: #e4d5d5;
    }
    .theme-button:active {
        box-shadow: none;
    }
    .theme-button > p {
        margin: 0;
    }

    @media (max-width: 1200px) {
        .floating-container {
            width: 40rem;
            left: calc((100vw - 40rem)/2);
        }
    }
    `;

    sectionChangeHandler (e : any, s : string) {
        this.nav = s;
    }

    navigateBack() {
        if (this.nav == "home")
            return; 
        if (this.nav == "colors" || this.nav == "sizes"  || this.nav == "fonts" ) {
            this.nav = "home";
        } else {
            this.nav = "colors";
        }
    }
    
    render () {
        let content;
        switch (this.nav) {
            case "home":
                content = html`
                <div class="content-container">
                    ${
                        home.map((section) => (
                            html`
                            <span class="theme-button" @click=${(e : any) => this.sectionChangeHandler(e, `${section.value}`)}>
                                <p>${section.label}</p>
                            </span>
                            `
                        ))
                    }
                </div>
            `;    
            break;
            case "colors":
                content = html`
                <div class="content-container">
                    ${
                        colors.map((clr) => (
                            html`
                            <span class="theme-button" @click=${(e : any) => {this.sectionChangeHandler(e, `colors-${clr.value}`)}}>
                                <p>${clr.label}</p>
                            </span>
                            `
                        ))
                    }
                </div>
                `;
            break;
            case "sizes":
                content = html`
                <span class="content-container">
                    ${
                        sizes.map((size) => (
                            html`
                            <fw-size-pick
                                label="${size.label}"
                                cssvariable="--font-${size.value}"
                                .theme="${this.theme}"
                                style="display:flex"
                                value="${size.value}"
                            >
                            </fw-size-pick>
                            `
                        ))
                    }
                </span>
                `;
            break;
            case "fonts":
                content = html`
                <span class="content-container">
                    ${
                        fonts.map((font) => (
                            html`
                            <fw-font-pick
                                label="${font.label}"
                                cssvariable="--${font.value}-font"
                                value="${font.value}"
                                .theme="${this.theme}"
                                .options="${this.fontOptions}"
                                style="display:flex"
                            >
                            </fw-font-pick>
                            `
                        ))
                    }
                </span>
                `;
            break;

            case "colors-primary":
                content = html`
                <span class="content-container">
                    ${
                        pallette.map((item) => (
                            html`
                                <fw-color-pick
                                    label="Primary${item.label}"
                                    cssvariable="${item.value == "hex" ? `--primary`: `--primary-${item.value}`}"
                                    .theme="${this.theme}"
                                    value="${item.value}"
                                    type="primary"
                                    style="display:flex"
                                >
                                </fw-color-pick>
                            `
                        ))
                    }
                </span> 
                `;
            break;
            case "colors-secondary":
                content = html`
                <span class="content-container">
                    ${
                        pallette.map((item) => (
                            html`
                                <fw-color-pick
                                    label="Secondary${item.label}"
                                    cssvariable="${item.value == "hex" ? `--secondary`: `--secondary-${item.value}`}"
                                    .theme="${this.theme}"
                                    value="${item.value}"
                                    type="secondary"
                                    style="display:flex"
                                >
                                </fw-color-pick>
                            `
                        ))
                    }
                </span> 
                `;
            break;
            case "colors-background":
                content = html`
                <span class="content-container">
                    <fw-color-pick
                        label="Background"
                        cssvariable="--background"
                        .theme="${this.theme}"
                        value="hex"
                        type="background"
                        style="display:flex"
                    >
                    </fw-color-pick>
                </span> `;
            break;
            case "colors-error":
                content = html`
                <span class="content-container">
                    <fw-color-pick
                        label="Error"
                        cssvariable="--error"
                        .theme="${this.theme}"
                        value="hex"
                        type="error"
                        style="display:flex"
                    >
                    </fw-color-pick>
                    <fw-color-pick
                        label="Error Light 1"
                        cssvariable="--error-l1"
                        .theme="${this.theme}"
                        value="l1"
                        type="error"
                        style="display:flex"
                    >
                    </fw-color-pick>
                </span>`;
            break;
            case "colors-text":
                content = html`
                <span class="content-container">
                    ${
                        textcolors.map((clr) => (
                            html`
                                <fw-color-pick
                                    label="${clr.label}"
                                    cssvariable="--text-${clr.value}"
                                    .theme="${this.theme}"
                                    value="${clr.value}"
                                    type="text"
                                    style="display:flex"
                                >
                                </fw-color-pick>
                            `
                        ))
                    }
                </span>`;
            break;
        }

        return html`
            <div class="floating-container">
                <span class="back-button ${this.nav == "home" ? "back-hidden" : ""}" @click="${this.navigateBack}">
                    <img class="back-icon" src="back-arrow.svg" />    
                </span>
                ${content}
                <span class="save-button">Save</span>
            </div>
        `;
    }
}