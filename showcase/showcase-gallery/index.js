import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";

export class ShowcaseGallery extends LitElement {
  @property({ type: Array })
  showcases = [
    {
      id: "formula-editor",
      name: "Formula Editor",
      url: "https://getfundwave.github.io/fw-components/formula-editor/"
    },
    {
      id: "fw-dnd",
      name: "Drag and Drop",
      url: "https://getfundwave.github.io/fw-components/fw-dnd/"
    },
    {
      id: "fw-theme-builder",
      name: "Theme Builder",
      url: "https://getfundwave.github.io/fw-components/fw-theme-builder/"
    }
  ];

  @state()
  activeShowcase = null;

  @state()
  iframeLoading = false;

  @state()
  sidebarCollapsed = false;

  connectedCallback() {
    super.connectedCallback();
    // Set the first showcase as active by default
    if (this.showcases.length > 0 && !this.activeShowcase) {
      this.activeShowcase = this.showcases[0];
      this.iframeLoading = true;
    }
  }

  selectShowcase(showcase) {
    this.activeShowcase = showcase;
    this.iframeLoading = true;
    // On mobile, collapse sidebar after selection
    if (window.innerWidth <= 768) {
      this.sidebarCollapsed = true;
    }
  }

  handleIframeLoad() {
    this.iframeLoading = false;
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
      --primary-color: #1976d2;
      --primary-dark: #1565c0;
      --primary-light: #bbdefb;
      --secondary-color: #f5f9ff;
      --border-color: #e0e0e0;
      --hover-color: #f0f7ff;
      --shadow-color: rgba(0, 0, 0, 0.1);
    }

    .container {
      width: 100%;
      height: 100vh;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
    }

    .header {
      text-align: center;
      padding: 10px;
      background-color: var(--secondary-color);
      border-bottom: 1px solid var(--border-color);
    }

    h1 {
      color: var(--primary-color);
      margin: 0 0 5px 0;
      font-size: 1.5rem;
    }

    .showcase-layout {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .showcase-list {
      width: 160px;
      border-right: 1px solid var(--border-color);
      overflow-y: auto;
      transition: transform 0.3s ease;
      background-color: white;
      z-index: 10;
    }

    .showcase-list.collapsed {
      transform: translateX(-160px);
    }

    .toggle-sidebar {
      position: absolute;
      top: 80px;
      left: 160px;
      z-index: 20;
      background-color: var(--primary-color);
      color: white;
      border: none;
      border-radius: 0 4px 4px 0;
      width: 24px;
      height: 40px;
      cursor: pointer;
      transition: left 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .toggle-sidebar:hover {
      background-color: var(--primary-dark);
    }

    .toggle-sidebar.collapsed {
      left: 0;
    }

    .toggle-sidebar svg {
      width: 16px;
      height: 16px;
      fill: white;
    }

    .showcase-item {
      padding: 12px 10px;
      border-bottom: 1px solid var(--border-color);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .showcase-item:hover {
      background-color: var(--hover-color);
    }

    .showcase-item.active {
      background-color: var(--secondary-color);
      border-left: 4px solid var(--primary-color);
      padding-left: 6px;
    }

    .showcase-name {
      font-weight: bold;
      color: var(--primary-color);
      font-size: 0.9rem;
    }

    .showcase-display {
      flex: 1;
      position: relative;
      overflow: hidden;
    }

    .iframe-container {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    iframe {
      width: 100%;
      height: 100%;
      border: none;
      display: block;
    }

    .loading-indicator {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--primary-light);
      border-top: 4px solid var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .showcase-list {
        position: absolute;
        height: calc(100% - 60px);
      }
      
      .header {
        height: 60px;
      }
    }
  `;

  render() {
    return html`
      <div class="container">
        <div class="header">
          <h1>Fundwave Component Showcase</h1>
        </div>

        <div class="showcase-layout">
          <div class="showcase-list ${this.sidebarCollapsed ? 'collapsed' : ''}">
            ${this.showcases.map(
              (showcase) => html`
                <div 
                  class="showcase-item ${this.activeShowcase && this.activeShowcase.id === showcase.id ? 'active' : ''}"
                  @click=${() => this.selectShowcase(showcase)}
                >
                  <div class="showcase-name">${showcase.name}</div>
                </div>
              `
            )}
          </div>
          
          <button class="toggle-sidebar ${this.sidebarCollapsed ? 'collapsed' : ''}" @click=${this.toggleSidebar}>
            ${this.sidebarCollapsed 
              ? html`<svg viewBox="0 0 24 24"><path d="M8.59,16.59L13.17,12L8.59,7.41L10,6l6,6l-6,6L8.59,16.59z"/></svg>`
              : html`<svg viewBox="0 0 24 24"><path d="M15.41,16.59L10.83,12l4.58-4.59L14,6l-6,6l6,6L15.41,16.59z"/></svg>`
            }
          </button>

          <div class="showcase-display">
            ${this.activeShowcase
              ? html`
                  <div class="iframe-container">
                    <iframe 
                      src="${this.activeShowcase.url}" 
                      @load=${this.handleIframeLoad}
                      title="${this.activeShowcase.name}"
                    ></iframe>
                    ${this.iframeLoading
                      ? html`
                          <div class="loading-indicator">
                            <div class="spinner"></div>
                          </div>
                        `
                      : ``}
                  </div>
                `
              : html`<div class="no-showcase">Please select a component to view</div>`}
          </div>
        </div>
      </div>
    `;
  }
}

window.customElements.define("showcase-gallery", ShowcaseGallery);