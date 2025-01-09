import { html } from "lit";

export const ThemeBuilderShowcaseStyles = html`
  <style>

    p {
      color: var(--text-body);
    }

    .showcase-page {
      width: 100%;
      min-height: 100svh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--body-font);
      background-color: var(--background);
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
      transition: all 0.1s ease-in-out;
      background-color: var(--primary) !important;
    }

    .secondary-color {
      transition: all 0.1s ease-in-out;
      background-color: var(--secondary) !important;
    }

    .primary-txt-color {
      transition: all 0.1s ease-in-out;
      background-color: var(--primary-contrast) !important;
    }

    .secondary-txt-color {
      transition: all 0.1s ease-in-out;
      background-color: var(--secondary-contrast) !important;
    }

    .title-color {
      transition: all 0.1s ease-in-out;
      background-color: var(--text-title) !important;
    }

    .subtitle-color {
      transition: all 0.1s ease-in-out;
      background-color: var(--text-subtitle) !important;
    }

    .body-txt-color {
      transition: all 0.1s ease-in-out;
      background-color: var(--text-body) !important;
    }

    .main-heading {
      font-family: var(--title-font);
      font-size: var(--font-huge);
      font-weight: 700;
      margin-bottom: 1rem;
      color: var(--text-title);
      display: flex;
      align-items: flex-start;
      overflow-x: visible;
      white-space: nowrap;
    }

    .sub-heading {
      font-size: var(--font-xl);
      font-weight: 400;
      color: var(--text-subtitle);
      margin-bottom: 2rem;
    }

    .main-buttons {
      overflow-x: visible;
      white-space: nowrap;
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
      color: var(--primary-contrast);
      font-size: var(--font-m);
    }
    .primary-button:hover {
      transition: 0.2s ease-in-out;
      box-shadow: 0px 20px 80px -10px var(--primary);
    }

    .secondary-button {
      background-color: var(--secondary);
      color: var(--secondary-contrast);
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
      font-family: var(--body-font);
      padding: calc(var(--font-tiny) / 2) calc(var(--font-tiny) / 2);
      border-radius: calc(var(--font-tiny));
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
      font-size: var(--font-xs);
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

    fw-theme-builder::part(container) {
      position: fixed;
      bottom: 1rem;
      width: 70rem;
      left: calc((100svw - 72rem) / 2);
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

    fw-theme-builder::part(content-span) {
      display: flex;
      width: 90%;
      flex-direction: row;
      justify-content: center;
      margin-right: 3rem;
    }

    fw-theme-builder::part(content-container) {
      display: flex;
      gap: 1rem;
    }

    fw-theme-builder::part(font-dropdown-selected) {
      margin: 6;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    fw-theme-builder::part(font-button) {
      cursor: pointer;
      position: relative;
      user-select: none;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      width: 8rem;
      height: 2rem;
      border-radius: 4px;
      padding: 0.2rem 0.5rem;
      box-shadow: 3px 3px 10px #1b1b1b1b, -3px -3px 10px #1b1b1b1b;
    }
    fw-theme-builder::part(font-button):hover {
      background-color: #fcfcfc;
    }
    fw-theme-builder::part(font-button):active {
      box-shadow: none;
      background-color: #e4e4e4;
    }
    fw-theme-builder::part(font-container) {
      display: flex;
      flex-direction: row;
      justify-content: center;
      gap: 0.5rem;
      align-items: center;
      height: 3.2rem;
      padding: 0.2rem 0.5rem;
    }

    fw-theme-builder::part(theme-button) {
      user-select: none;
      min-width: 6.5rem;
      height: 3.2rem;
      background-color: #e2e2e2;
      border-radius: 5px;
      border: none;
      padding: 0.2rem 0.5rem;
      font-size: 16px;
      font-family: "DM Sans", sans-serif;
      font-weight: 400;
      color: #2b2b2b;
      cursor: pointer;
      box-shadow: #1b1b1b3b 0px 4px 10px;
    }
    fw-theme-builder::part(theme-button):hover {
      background-color: #dddddd;
    }
    fw-theme-builder::part(theme-button):active {
      box-shadow: none;
    }

    fw-theme-builder::part(color-button) {
      min-width: 6.5rem;
      height: 3.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 5px;
      border: none;
      padding: 0.2rem 0.5rem;
      font-size: 16px;
      font-family: "DM Sans", sans-serif;
      font-weight: 400;
      cursor: pointer;
      box-shadow: #1b1b1b3b 0px 4px 10px;
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
      fw-theme-builder::part(container) {
        width: 44rem;
        left: calc((100vw - 46rem) / 2);
      }
    }

    @media screen and (max-width: 985px) {
      .showcase-content {
        width: 100vw;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 3rem;
        align-items: center;
        margin-top: 10rem;
      }
      .content-container {
        width: 100vw !important;
        overflow: hidden;
      }
      .right-section {
        width: 100%;
        justify-content: center;
        text-align: center;
      }
      .left-section {
        width: 100%;
        justify-content: center;
        text-align: center;
      }
      .main-heading {
        width: 100%;
        display: flex;
        justify-content: center;
      }
      .sub-heading {
        width: 100%;
      }
      .error-text {
        width: 100%;
      }
      .circle-group {
        width: 100%;
        display: flex;
        justify-content: center;
      }
      .main-buttons {
        display: flex;
        justify-content: center;
        width: 100%;
        gap: 0.5rem;
      }
      .hide-on-phone {
        display: none !important;
      }
      .features {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      fw-theme-builder::part(container) {
        width: calc(100% - 4rem);
        left: 1rem;
        background-color: #ffffff67;
      }
      fw-theme-builder::part(content-container) {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
    }
  </style>
`;
