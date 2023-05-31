import {html, css, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';

@customElement('component-showcase')
export class Showcase extends LitElement {
    static styles = css`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap');

    /* Declaration of CSS variables */
    * {
        --primary-color: #1c1cdb;
        --secondary-color: #6565ff;
        --primary-btn-text-color: #ffffff;
        --secondary-btn-text-color: #cecedb;
        --title-text-color: #1b1b1b; 
        --subtitle-text-color: #1b1b1b; 
        --body-text-color: #1b1b1b;
        --background-color: #f0f0f0;
    }

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

    #primary-circle {
        background-color: var(--primary-color);
    }

    #secondary-circle {
        background-color: var(--secondary-color);
    }

    #primary-txt-circle {
        background-color: var(--primary-btn-text-color);
    }

    #secondary-txt-circle {
        background-color: var(--secondary-btn-text-color);
    }

    #title-circle {
        background-color: var(--title-text-color);
    }

    #subtitle-circle {
        background-color: var(--subtitle-text-color);
    }

    #body-txt-circle {
        background-color: var(--body-text-color);
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
        color: var(--title-text-color);
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
        background-color: var(--primary-color);
        color: var(--primary-btn-text-color);
    }

    .secondary-button {
        background-color: var(--secondary-color);
        color: var(--secondary-btn-text-color);
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
                        <span id="primary-circle" class="color-circle"></span>
                        <span id="secondary-circle" class="color-circle"></span>
                        <span id="primary-txt-circle" class="color-circle"></span>
                        <span id="secondary-txt-circle" class="color-circle"></span>
                        <span id="title-circle" class="color-circle"></span>
                        <span id="subtitle-circle" class="color-circle"></span>
                        <span id="body-circle" class="color-circle"></span>
                    </div>
                </section>
            </div>
        </main>
        `;
    }
}