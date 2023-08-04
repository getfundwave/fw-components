import { html } from "lit";

export const CustomDndStyles = html`
  <style>
    :host {
      font-family: var(--theme-font);
    }
    .item-row {
      display: flex;
      cursor: default;
      align-items: center;
      color: var(--fw-crud-dnd-item-color, var(--secondary-color, #515151));
      background-color: var(--fw-crud-dnd-item-background, white);
      width: 100%;
    }
    .item-bottom-border {
      border-bottom: var(--fw-crud-dnd-item-border, 1px solid var(--secondary-color-l3, #eee));
    }
    .item-grid-container {
      width: 100%;
      display: inline-grid;
      gap: 10px;
      word-break: break-word;
      align-items: center;
      grid-template-columns: 1fr 2fr auto auto;
      font-size: var(--fw-crud-dnd-item-font-size, var(--body-font-size, 16px));
      padding: 5px 0px;
      padding-left: 10px;
      min-height: 40px;
      user-select: none;
    }
    .item-grid-container > paper-input:invalid {
      margin-bottom: 10px;
    }
    .item-grid-container > .grid-template-3-column {
      grid-template-columns: 1fr auto auto;
    }
    .item-grid-container span {
      user-select: text;
    }
    paper-textarea.box,
    paper-input.box {
      --paper-input-container_-_padding: 0px 0px;
      --paper-input-container-input_-_padding-left: 10px;
    }
    paper-textarea.add-warning-margin,
    paper-input.add-warning-margin {
      margin-bottom: 15px;
    }
    @media all and (max-width: 550px) {
      .item-grid-container {
        display: inline-grid;
        grid-template-columns: 1fr auto;
        grid-template-rows: auto auto;
        gap: 0px;
      }
      .item-grid-container > .grid-row-2-item {
        grid-row: 2;
      }
      .item-grid-container > .grid-reposition-btn {
        grid-column: 2;
      }
      paper-textarea.add-warning-margin,
      paper-input.add-warning-margin {
        margin-bottom: 20px;
      }
    }
  </style>
`;

export const HeaderRowStyle = html`
  <style>
    .header-row {
      display: inline-grid;
      grid-template-columns: 1fr 2fr auto;
      gap: 30px;
      width: calc(100% - 30px);
      padding: 0px 0px 5px 30px;
      border-bottom: var(--fw-crud-dnd-header-border, 3px solid var(--secondary-color-l3, #eee));
      font-size: var(--fw-crud-dnd-header-font-size, var(--h2-font-size, 20px));
      color: var(--fw-crud-dnd-header-text-color, var(--secondary-color, #515151));
      font-weight: bold;
    }
    .header-row span {
      display: inline-flex;
      align-items: end;
    }
    @media all and (max-width: 550px) {
      .header-row {
        display: inline-grid;
        grid-template-columns: 1fr auto;
        grid-template-rows: auto auto;
        gap: 0px;
      }
      .grid-row-2-item {
        grid-row: 2;
      }
    }
  </style>
`;

export const ItemRowStyle = html`
  <style>
    iron-icon {
      color: var(--icon-color, var(--secondary-color, #515151));
      cursor: grabbing;
    }
    .delete-btn:hover {
      color: var(--error-color, #d50000);
    }
    .edit-btn:hover {
      color: var(--primary-color, #2e7ae7);
    }
    .info-btn:hover {
      cursor: pointer;
    }
    .info-btn-text:after {
      content: attr(title);
      font-size: 12px;
      display: block;
      text-align: right;
      width: max-content;
      position: absolute;
      right: 0;
      bottom: auto;
    }
    @media all and (max-width: 550px) {
      .info-btn-text:after {
        font-size: 14px;
        max-width: 250px;
      }
      paper-icon-button.info-btn-text {
        margin-bottom: 20px;
      }
    }
  </style>
`;
