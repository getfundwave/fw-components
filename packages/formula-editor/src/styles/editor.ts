import { css } from "lit";

export const FormulaEditorStyles = css`
  .editor-label {
    display: block;
    font-size: var(--fe-label-font-size, 0.8rem);
    color: var(--fe-label-color, #515151);
    margin-bottom: var(--fe-label-margin-bottom, 1px);
  }

  #wysiwyg-editor {
    display: block;
    resize: none;
    padding: var(--fe-padding, 4px);
    caret-color: var(--fe-caret-color, #fff);
    color: var(--fe-text-color, #f7f1ff);
    font-size: var(--fe-text-font-size, 12px);
    min-width: 100%;
    min-height: 30px;
    height: var(--fe-height, 30px);
    border-radius: var(--fe-border-radius, 4px);
    border: var(--fe-border, 2px solid black);
    border-bottom: var(--fe-border-bottom, 0px solid black);
    outline: 0px solid black;
    background-color: var(--fe-background-color, #222222);
    box-sizing: border-box;
  }

  #wysiwyg-editor:empty:before {
    content: attr(placeholder);
    color: var(--fe-placeholder-color, grey);
    pointer-events: none;
  }

  #wysiwyg-editor.error {
    text-decoration: underline;
    -webkit-text-decoration-style: wavy;
    text-decoration-style: wavy;
    text-decoration-color: var(--fe-err-underline-color, red);
  }
`;
