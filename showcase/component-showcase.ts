import {html, css, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';

@customElement('component-showcase')
export class Showcase extends LitElement {
    static styles = css`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap');

    body {
        margin: 0;
    }

    p {
        color: var(--primary-color);
    }

    .showcase-page {
        width: 100vw;
        height: 100svh;
        display: flex;
        justify-content: center;
        font-family: "DM Sans", sans-serif;
        background-color: var(--background-color)
    }

    .showcase-content {
        width: 60rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .left-section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        width: 50%;
    }

    .right-section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 50%;
    }

    .circle-group {
        width: 100%;
        display: flex;
        justify-content: space-between;
        gap: 1rem;
    }

    .color-circle {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
    }

    .primary-color {
        background-color: var(--primary-color) !important;
    }

    .secondary-color {
        background-color: var(--secondary-color) !important;
    }

    .primary-txt-color {
        background-color: var(--primary-btn-text-color) !important;
    }

    .secondary-txt-color {
        background-color: var(--secondary-btn-text-color) !important;
    }

    .title-color {
        background-color: var(--title-text-color) !important;
    }

    .subtitle-color {
        background-color: var(--subtitle-text-color) !important;
    }

    .body-txt-color {
        background-color: var(--body-text-color) !important;
    }

    .main-heading {
        font-size: 3rem;
        font-weight: 700;
        margin-bottom: 1rem;
        color: var(--title-text-color);
    }

    .sub-heading {
        font-size: 1.5rem;
        font-weight: 400;
        color: var(--subtitle-text-color);
        margin-bottom: 2rem;
    }

    .button {
        padding: 0.8rem 1.5rem;
        border: none;
        cursor: pointer;
        border-radius: 7px;
        font-size: 1rem;
    }

    .primary-button {
        transition: 0.2s ease-in-out;
        background-color: var(--primary-color);
        color: var(--primary-btn-text-color);
    }
    .primary-button:hover {
        transition: 0.2s ease-in-out;
        box-shadow: 0px 20px 80px -10px var(--primary-color);
    }

    .secondary-button {
        background-color: var(--secondary-color);
        color: var(--secondary-btn-text-color);
    }

    @media (max-width: 1160px) {
        .showcase-content {
            width: 45rem;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: center;
        }
        .right-section {
            width: 80%;
        }
        .left-section {
            width: 80%;
        }
    }
    `;

    render () {
        return html`
        <main class="showcase-page">
            <div class="showcase-content">
                <section class="left-section">
                    <span class="main-heading">Component Showcase</span>
                    <span class="sub-heading">See all the components and their functionalities</span>
                    <span>
                        <button class="button primary-button">
                            See all components
                        </button>
                        <button class="button secondary-button">
                            Go to repository
                        </button>
                    </span>
                </section>
                <section class="right-section">
                    <div class="circle-group">
                        <span class="primary-color color-circle"></span>
                        <span class="secondary-color color-circle"></span>
                        <span class="primary-txt-color color-circle"></span>
                        <span class="secondary-txt-color color-circle"></span>
                        <span class="title-color color-circle"></span>
                        <span class="subtitle-color color-circle"></span>
                        <span class="body-txt-color color-circle"></span>
                    </div>
                </section>
            </div>
        </main>
        `;
    }
}