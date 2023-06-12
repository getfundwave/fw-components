import {html, css, LitElement} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import "./fw-color-pick";

@customElement('fw-theme-builder')
class FwThemeBuilder extends LitElement {
    constructor() {
        super();
    }
    
    @state()
    nav = "home";

    @property()
    theme = {
        fonts : {
            primary : {
                "name" : "",
                "import" : "",
            },
            secondary : {
                "name" : "",
                "import" : "",
            }
        },
        sizes : {
            "font-tiny" : "10px",
            "font-xs" : "14px",
            "font-s" : "16px",
            "font-m" : "18px",
            "font-l" : "20px",
            "font-xl" : "22px",
            "font-huge" : "48px",
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
        justify-content: center;
        gap: 1rem;
        padding: 1rem 1rem;
    }

    .theme-button {
        width: 4rem;
        text-align: center;
        background-color: #f5e6e6;
        border-radius: 4px;
        padding: 0.2rem 0.5rem;
        font-family: "DM Sans", sans-serif;
        font-weight: 400;
        color: #2b2b2b;
        cursor: pointer;
        box-shadow: #1b1b1b3b 0px 4px 10px;
    }

    @media (max-width: 1200px) {
        .floating-container {
            width: 40rem;
            left: calc((100vw - 40rem)/2);
        }
    }
    `;
    
    render () {
        if (this.nav == "home")
            return html`
            <div class="floating-container">
                <span class="theme-button">
                    <p>Colors</p>
                </span>
                <span class="theme-button">
                    <p>Sizes</p>
                </span>
                <span class="theme-button">
                    <p>Fonts</p>
                </span>
            </div>
            <!-- <fw-color-pick
                label="Primary"
                cssvariable="--primary"
                .value="${this.theme.colors.primary.hex}"
                style="display:flex"
            >
            </fw-color-pick> -->
            `;
        if (this.nav == "colors")
            return html`
            <div class="floating-container">
                <span class="theme-button">
                    <p>Primary</p>
                </span>
                <span class="theme-button">
                    <p>Secondary</p>
                </span>
                <span class="theme-button">
                    <p>Background</p>
                </span>
                <span class="theme-button">
                    <p>Error</p>
                </span>
                <span class="theme-button">
                    <p>Text</p>
                </span>
            </div>
            `;
        if (this.nav == "sizes")
            return html``;
        if (this.nav == "fonts")
            return html``;

        if (this.nav == "colors-primary")
            return html``;
        if (this.nav == "colors-secondary")
            return html``;
        if (this.nav == "colors-background")
            return html``;
        if (this.nav == "colors-error")
            return html``;
        if (this.nav == "colors-text")
            return html``;
    }
}