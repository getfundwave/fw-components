import {html, css, LitElement} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import "./fw-color-pick";
import "./fw-size-pick";
import "./fw-font-pick";
import { home, colors, sizes, fonts, pallette, textColors } from "./models";

@customElement('fw-theme-builder')
class FwThemeBuilder extends LitElement {
    constructor() {
        super();
    }

    @state()
    nav = "home";

    @property()
    fontOptions = [
        {
            name : "Archivo",
            url: 'https://fonts.gstatic.com/s/archivo/v18/k3kPo8UDI-1M0wlSV9XAw6lQkqWY8Q82sLydOxI.woff2',
            style: "'Archivo', sans-serif",
        },
        {
            name : "Barlow",
            url: 'https://fonts.gstatic.com/s/barlow/v12/7cHpv4kjgoGqM7E_DMs5.woff2',
            style: "'Barlow', sans-serif",
        },
        {
            name : "Cabin",
            url: 'https://fonts.gstatic.com/s/cabin/v26/u-4i0qWljRw-PfU81xCKCpdpbgZJl6Xvqdns.woff2',
            style: "'Cabin', sans-serif",
        },
        {
            name : "DM Sans",
            url: 'https://fonts.gstatic.com/s/dmsans/v11/rP2Hp2ywxg089UriCZOIHQ.woff2',
            style: "'DM Sans', sans-serif",
        },
        {
            name : "Geologica",
            url: 'https://fonts.gstatic.com/s/geologica/v1/oY1l8evIr7j9P3TN9YwNAdyjzUyDKkKdAGOJh1UlCDUIhAIdhCZOn1fLsig7jfvCCPHZckUWE1lE.woff2',
            style: "'Geologica', sans-serif",
        },
        {
            name : "Inter",
            url: 'https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2',
            style: "'Inter', sans-serif",
        },
        {
            name : "Karla",
            url: 'https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7SUc.woff2',
            style: "'Karla', sans-serif",
        },
        {
            name : "Nunito Sans",
            url: 'https://fonts.gstatic.com/s/nunitosans/v15/pe0TMImSLYBIv1o4X1M8ce2xCx3yop4tQpF_MeTm0lfGWVpNn64CL7U8upHZIbMV51Q42ptCp7t1R-s.woff2',
            style: "'Nunito Sans', sans-serif",
        },
        {
            name : "Playfair Display",
            url: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFiD-vYSZviVYUb_rj3ij__anPXDTzYgA.woff2',
            style: "'Playfair Display', serif",
        },
        {
            name : "Poppins",
            url: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2',
            style: "'Poppins', sans-serif",
        },
        {
            name : "Public Sans",
            url: 'https://fonts.gstatic.com/s/publicsans/v14/ijwRs572Xtc6ZYQws9YVwnNGfJ4.woff2',
            style: "'Public Sans', sans-serif",
        },
        {
            name : "Raleway",
            url: 'https://fonts.gstatic.com/s/raleway/v28/1Ptug8zYS_SKggPNyC0ITw.woff2',
            style: "'Raleway', sans-serif",
        },
        {
            name : "Roboto",
            url: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2',
            style: "'Roboto', sans-serif",
        },
        {
            name : "Roboto Slab",
            url: 'https://fonts.gstatic.com/s/robotoslab/v25/BngMUXZYTXPIvIBgJJSb6ufN5qU.woff2',
            style: "'Roboto Slab', serif",
        },
        {
            name : "Rubik",
            url: 'https://fonts.gstatic.com/s/rubik/v26/iJWKBXyIfDnIV7nBrXw.woff2',
            style: "'Rubik', sans-serif",
        },
        {
            name : "Tajawal",
            url: 'https://fonts.gstatic.com/s/tajawal/v9/Iurf6YBj_oCad4k1l8KiHrFpiQ.woff2',
            style: "'Tajawal', sans-serif",
        },
    ]

    @property()
    theme = {
        fonts : {
            "title" : {
                name : "DM Sans",
                url: 'https://fonts.gstatic.com/s/dmsans/v11/rP2Hp2ywxg089UriCZOIHQ.woff2',
                style: "'DM Sans', sans-serif",
            },
            "body" : {
                name : "DM Sans",
                url: 'https://fonts.gstatic.com/s/dmsans/v11/rP2Hp2ywxg089UriCZOIHQ.woff2',
                style: "'DM Sans', sans-serif",
            }
        },
        sizes : {
            "tiny"  : "10px",
            "xs"    : "14px",
            "s"     : "16px",
            "m"     : "18px",
            "l"     : "20px",
            "xl"    : "22px",
            "huge"  : "48px",
        },
        colors : {
            "primary" : {
                "hex" : "#ad38d1",
                "rgb" : "rgb(173, 56, 209)",
                "l1" : "#ba68d3",
                "l2" : "#dcb5e7",
                "l3" : "#e5d3eb",
                "contrast" : "#f0f0f0",
            },
            "secondary" : {
                "hex" : "#4a48c7",
                "rgb" : "rgb(74, 72, 199)",
                "l1" : "#5f5dce",
                "l2" : "#706fd1",
                "l3" : "#9190df",
                "contrast" : "#ebdbdb",
            },
            "background" : {
                "hex" : "#eeeeee",
                "rgb" : "rgb(238, 238, 238)",
            },
            "error" : {
                "hex" : "#e61e1e",
                "rgb" : "rgb(230, 30, 30)",
                "l1" : "#f1b4b4",
            },
            "text" : {
                "title" : "#1b1b1b",
                "subtitle" : "#1b1b1b",
                "body" : "#1b1b1b",
                "body-l1" : "#363636",
            }
        }
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
                        textColors.map((clr) => (
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