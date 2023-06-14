import {html, css, LitElement} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import "./fw-color-pick";
import "./fw-size-pick";
import "./fw-font-pick";

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
            url: 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500',
            style: "'Geologica', sans-serif",
        },
        {
            name : "Barlow",
            url: 'https://fonts.googleapis.com/css2?family=Barlow:wght@400;500',
            style: "'Barlow', sans-serif",
        },
        {
            name : "Cabin",
            url: 'https://fonts.googleapis.com/css2?family=Cabin:wght@400;500',
            style: "'Cabin', sans-serif",
        },
        {
            name : "DM Sans",
            url: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500',
            style: "'DM Sans', sans-serif",
        },
        {
            name : "Geologica",
            url: 'https://fonts.googleapis.com/css2?family=Geologica:wght@400;500',
            style: "'Geologica', sans-serif",
        },
        {
            name : "Inter",
            url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500',
            style: "'Inter', sans-serif",
        },
        {
            name : "Karla",
            url: 'https://fonts.googleapis.com/css2?family=Karla:wght@400;500',
            style: "'Karla', sans-serif",
        },
        {
            name : "Nunito Sans",
            url: 'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;500',
            style: "'Nunito Sans', sans-serif",
        },
        {
            name : "Playfair Display",
            url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500',
            style: "'Playfair Display', serif",
        },
        {
            name : "Poppins",
            url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500',
            style: "'Poppins', sans-serif",
        },
        {
            name : "Public Sans",
            url: 'https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500',
            style: "'Public Sans', sans-serif",
        },
        {
            name : "Raleway",
            url: 'https://fonts.googleapis.com/css2?family=Raleway:wght@400;500',
            style: "'Raleway', sans-serif",
        },
        {
            name : "Roboto",
            url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500',
            style: "'Roboto', sans-serif",
        },
        {
            name : "Roboto Slab",
            url: 'https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;500',
            style: "'Roboto Slab', serif",
        },
        {
            name : "Rubik",
            url: 'https://fonts.googleapis.com/css2?family=Rubik:wght@400;500',
            style: "'Rubik', sans-serif",
        },
        {
            name : "Tajawal",
            url: 'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500',
            style: "'Tajawal', sans-serif",
        },
    ]

    @property()
    theme = {
        fonts : {
            "title" : {
                name : "DM Sans",
                url: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500',
                style: "'DM Sans', sans-serif",
            },
            "body" : {
                name : "DM Sans",
                url: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500',
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
                <span class="theme-button" @click=${(e : any) => this.sectionChangeHandler(e, "colors")}>
                    <p>Colors</p>
                </span>
                <span class="theme-button" @click="${(e : any) => {this.sectionChangeHandler(e, "sizes")}}">
                    <p>Sizes</p>
                </span>
                <span class="theme-button" @click="${(e : any) => {this.sectionChangeHandler(e, "fonts")}}">
                    <p>Fonts</p>
                </span>
            </div>
            `;    
            break;
            case "colors":
                content = html`
                <div class="content-container">
                    <span class="theme-button" @click="${(e : any) => {this.sectionChangeHandler(e, "colors-primary")}}">
                        <p>Primary</p>
                    </span>
                    <span class="theme-button" @click="${(e : any) => {this.sectionChangeHandler(e, "colors-secondary")}}">
                        <p>Secondary</p>
                    </span>
                    <span class="theme-button" @click="${(e : any) => {this.sectionChangeHandler(e, "colors-background")}}">
                        <p>Background</p>
                    </span>
                    <span class="theme-button" @click="${(e : any) => {this.sectionChangeHandler(e, "colors-error")}}">
                        <p>Error</p>
                    </span>
                    <span class="theme-button" @click="${(e : any) => {this.sectionChangeHandler(e, "colors-text")}}">
                        <p>Text</p>
                    </span>
                </div>
                `;
            break;
            case "sizes":
                content = html`
                <span class="content-container">
                    <fw-size-pick
                        label="Tiny"
                        cssvariable="--font-tiny"
                        .value="${this.theme.sizes.tiny}"
                        style="display:flex"
                    >
                    </fw-size-pick>
                    <fw-size-pick
                        label="XS"
                        cssvariable="--font-xs"
                        .value="${this.theme.sizes.xs}"
                        style="display:flex"
                    >
                    </fw-size-pick>
                    <fw-size-pick
                        label="S"
                        cssvariable="--font-s"
                        .value="${this.theme.sizes.s}"
                        style="display:flex"
                    >
                    </fw-size-pick>
                    <fw-size-pick
                        label="M"
                        cssvariable="--font-m"
                        .value="${this.theme.sizes.m}"
                        style="display:flex"
                    >
                    </fw-size-pick>
                    <fw-size-pick
                        label="L"
                        cssvariable="--font-l"
                        .value="${this.theme.sizes.l}"
                        style="display:flex"
                    >
                    </fw-size-pick>
                    <fw-size-pick
                        label="XL"
                        cssvariable="--font-xl"
                        .value="${this.theme.sizes.xl}"
                        style="display:flex"
                    >
                    </fw-size-pick>
                    <fw-size-pick
                        label="Huge"
                        cssvariable="--font-huge"
                        .value="${this.theme.sizes.huge}"
                        style="display:flex"
                    >
                    </fw-size-pick>
                </span>
                `;
            break;
            case "fonts":
                content = html`
                <span class="content-container">
                    <fw-font-pick
                        label="Title"
                        cssvariable="--title-font"
                        .value="${this.theme.fonts.title}"
                        .options="${this.fontOptions}"
                        style="display:flex"
                    >
                    </fw-font-pick>
                    <fw-font-pick
                        label="Body"
                        cssvariable="--body-font"
                        .value="${this.theme.fonts.body}"
                        .options="${this.fontOptions}"
                        style="display:flex"
                    >
                    </fw-font-pick>
                </span>
                `;
            break;

            case "colors-primary":
                content = html`
                <span class="content-container">
                    <fw-color-pick
                        label="Primary"
                        cssvariable="--primary"
                        .value="${this.theme.colors.primary.hex}"
                        style="display:flex"
                    >
                    </fw-color-pick>
                    <fw-color-pick
                        label="Primary Light 1"
                        cssvariable="--primary-l1"
                        .value="${this.theme.colors.primary.l1}"
                        style="display:flex"
                    >
                    </fw-color-pick>
                    <fw-color-pick
                        label="Primary Light 2"
                        cssvariable="--primary-l2"
                        .value="${this.theme.colors.primary.l2}"
                        style="display:flex"
                    >
                    </fw-color-pick>
                    <fw-color-pick
                        label="Primary Light 3"
                        cssvariable="--primary-l3"
                        .value="${this.theme.colors.primary.l3}"
                        style="display:flex"
                    >
                    </fw-color-pick>
                    <fw-color-pick
                        label="Primary Contrast"
                        cssvariable="--primary-contrast"
                        .value="${this.theme.colors.primary.contrast}"
                        style="display:flex"
                    >
                    </fw-color-pick>
                </span> 
                `;
            break;
            case "colors-secondary":
                content = html`
                <span class="content-container">
                    <fw-color-pick
                        label="Secondary"
                        cssvariable="--secondary"
                        .value="${this.theme.colors.secondary.hex}"
                        style="display:flex"
                    >
                    </fw-color-pick>
                    <fw-color-pick
                        label="Secondary Light 1"
                        cssvariable="--secondary-l1"
                        .value="${this.theme.colors.secondary.l1}"
                        style="display:flex"
                    >
                    </fw-color-pick>
                    <fw-color-pick
                        label="Secondary Light 2"
                        cssvariable="--secondary-l2"
                        .value="${this.theme.colors.secondary.l2}"
                        style="display:flex"
                    >
                    </fw-color-pick>
                    <fw-color-pick
                        label="Secondary Light 3"secondary
                        cssvariable="--secondary-l3"
                        .value="${this.theme.colors.secondary.l3}"
                        style="display:flex"
                    >
                    </fw-color-pick>
                    <fw-color-pick
                        label="Secondary Contrast"
                        cssvariable="--secondary-contrast"
                        .value="${this.theme.colors.secondary.contrast}"
                        style="display:flex"
                    >
                    </fw-color-pick>
                </span> `;
            break;
            case "colors-background":
                content = html`
                <span class="content-container">
                    <fw-color-pick
                        label="Background"
                        cssvariable="--background"
                        .value="${this.theme.colors.background.hex}"
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
                        .value="${this.theme.colors.error.hex}"
                        style="display:flex"
                    >
                    </fw-color-pick>
                    <fw-color-pick
                        label="Error Light 1"
                        cssvariable="--error-l1"
                        .value="${this.theme.colors.error.l1}"
                        style="display:flex"
                    >
                    </fw-color-pick>
                </span>`;
            break;
            case "colors-text":
                content = html`
                <span class="content-container">
                    <fw-color-pick
                        label="Title"
                        cssvariable="--text-title"
                        .value="${this.theme.colors.text.title}"
                        style="display:flex"
                    >
                    </fw-color-pick>
                    <fw-color-pick
                        label="Subtitle"
                        cssvariable="--text-subtitle"
                        .value="${this.theme.colors.text.subtitle}"
                        style="display:flex"
                    >
                    </fw-color-pick>
                    <fw-color-pick
                        label="Body"
                        cssvariable="--text-body"
                        .value="${this.theme.colors.text.body}"
                        style="display:flex"
                    >
                    </fw-color-pick>
                    <fw-color-pick
                        label="Body Light 1"
                        cssvariable="--text-body-l1"
                        .value="${this.theme.colors.text['body-l1']}"
                        style="display:flex"
                    >
                    </fw-color-pick>
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