import {html, css, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';

@customElement('fw-theme-builder')
class FwThemeBuilder extends LitElement {
    static styles = css`
    .floating-container {
        position: absolute;
        bottom: 1rem;
        width: 70rem;
        left: calc((100vw - 70rem)/2);
        height: 5rem;
        background-color: #ffffff;
        z-index: 10;
        border-radius: 10px;
        /* border: 1px solid #1b1b1b4c; */
        box-shadow: 0px 10px 40px -10px #1b1b1b4c;
    }
    `;
    render () {
        return html`
        <div class="floating-container">
            
        </div>
        `;
    }
}