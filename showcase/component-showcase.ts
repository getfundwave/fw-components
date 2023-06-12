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
        color: var(--text-body);
    }

    .showcase-page {
        width: 100vw;
        height: 100svh;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "DM Sans", sans-serif;
        background-color: var(--background-color)
    }

    .content-container {
        width: 60rem;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        gap: 2rem;
    }

    .showcase-content {
        width: 100%;
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
        justify-content: flex-start;
        gap: 1rem;
    }

    .color-circle {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
    }

    .primary-color {
        background-color: var(--primary) !important;
    }

    .secondary-color {
        background-color: var(--secondary) !important;
    }

    .primary-txt-color {
        background-color: var(--primary-btn-text-color) !important;
    }

    .secondary-txt-color {
        background-color: var(--secondary-btn-text-color) !important;
    }

    .title-color {
        background-color: var(--text-title) !important;
    }

    .subtitle-color {
        background-color: var(--text-subtitle) !important;
    }

    .body-txt-color {
        background-color: var(--text-body) !important;
    }

    .main-heading {
        font-size: var(--font-huge);
        font-weight: 700;
        margin-bottom: 1rem;
        color: var(--text-title);
        display: flex;
        align-items: flex-start
    }

    .sub-heading {
        font-size: var(--font-xl);
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
        background-color: var(--primary);
        color: var(--primary-btn-text-color);
        font-size: var(--font-m);
    }
    .primary-button:hover {
        transition: 0.2s ease-in-out;
        box-shadow: 0px 20px 80px -10px var(--primary);
    }

    .secondary-button {
        background-color: var(--secondary);
        color: var(--secondary-btn-text-color);
        font-size: var(--font-m);
    }
    
    .body-text {
        color: var(--text-body);
        font-size: var(--font-s);
    }

    .alpha-pill {
        background-color: var(--primary-l3);
        color: var(--primary);
        font-size: var(--font-tiny);
        padding: 4px 6px 4px 6px;
        border-radius: 0.6rem;
        font-weight: 400;
    }

    .features {
        display: flex;
        justify-content: center;
        gap: 2rem;
    }

    .features > section {
        background-color: var(--primary-l3);
        border: 2px solid var(--primary-l2);
        padding: 1rem;
        width: 15rem;
        height: 15rem;
        border-radius: 0.5rem;
    }

    .secondary-colors {
        background-color: var(--secondary-l3) !important;
        border: 2px solid var(--secondary-l2) !important;
    }


    .features > section > h4 {
        font-size: var(--font-l);
        margin: 0.2rem 0rem;
        font-weight: 400;
        color: var(--primary-l1);
    }

    .secondary-colors > h4 {
        color: var(--secondary-l1) !important;
    }

    .features > section > p {
        font-size: var(--font-xs);
        margin: 0.5rem 0rem;
        font-weight: 400;
        color: var(--text-body-l1);
    }

    .error-text {
        color: var(--error);
    }
    .error-text > strong {
        user-select: none;
        background-color: var(--error-l1);
        padding: 3px 7px;
        border-radius: 4px;
        /* font-weight: 400; */
        margin-left: 1rem;
        font-size: var(--font-xs);
        cursor: pointer;
    }
    .error-text > strong:hover:after {
        content: " :(";
    }


    @media (max-width: 1160px) {
        .showcase-content {
            width: 60rem;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            gap: 3rem;
            align-items: center;
            margin-top: 10rem;
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
            <div class="content-container">
                <div class="showcase-content">
                    <section class="left-section">
                        <span class="main-heading">
                            Theme Builder
                            <span class="alpha-pill">Alpha</span>
                        </span>
                        <span class="sub-heading">Build and customize your own theme, effortlessly.</span>
                        <span>
                            <button class="button primary-button">
                                See all components
                            </button>
                            <button class="button secondary-button">
                                Go to repository
                            </button>
                        </span>
                        <p class="error-text">Oops! Seems like an error occured.<strong>Fix this</strong></p>
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
                        <p class="body-text">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable.</p>
                    </section>
                </div>
                <div class="features">
                    <section class="secondary-colors">
                        <h4>Build your design system</h4>
                        <p>In eu sapien risus. Nulla vel lectus faucibus, tincidunt massa at, pulvinar metus. Phasellus vitae elit in mi ullamcorper commodo. Vivamus consequat eu nunc at auctor.</p>
                    </section>
                    <section>
                        <h4>Customize font sizes</h4>
                        <p>Pellentesque pretium cursus nisi, et hendrerit nulla dictum vel. Ut vel erat quis ipsum suscipit tincidunt a eu turpis. Quisque felis risus, porta ac lacus eget, efficitur tempor enim.</p>
                    </section>
                    <section>
                        <h4>Customize colors</h4>
                        <p>Cras feugiat ut enim eu congue. Aliquam erat volutpat. Curabitur quam tortor, eleifend et interdum eu, venenatis et quam. Donec vehicula aliquet lobortis. </p>
                    </section>
                </div>
            </div>
        </main>
        `;
    }
}