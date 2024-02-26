import { css } from "lit";

export const FormulaEditorStyles = css`
  #wysiwyg-editor {
    display: inline-block;
    border: none;
    padding: 4px;
    caret-color: var(--fe-caret-color, #fff);
    color: var(--fe-text-color, #f7f1ff);
    line-height: 1.1;
    width: 100%;
    height: var(--fe-height, 60%);
    border-radius: var(--fe-border-radius, 4px) var(--fe-border-radius, 4px) 0px
      0px;
    overflow: auto;
    border: 2px solid black;
    outline: 0px solid black;
    white-space: pre-wrap;
    background-color: var(--fe-background-color, #222222);
    margin: 0px;
    /* position: relative; */
  }

  .wysiwygInternals.error {
    text-decoration: underline;
    -webkit-text-decoration-color: var(--fe-err-underline-color, #fc514f);
    text-decoration-color: var(--fe-err-underline-color, #fc514f);
    -webkit-text-decoration-style: wavy;
    text-decoration-style: wavy;
    /* text-decoration-thickness: 1px; */
    text-decoration-color: var(--fe-err-underline-color, red);
  }

  .wysiwygInternals.bracket {
    color: var(--fe-bracket-color, #fc514f);
  }

  .wysiwygInternals.operator {
    font-weight: bold;
    color: var(--fe-operator-color, #fc618d);
  }

  .wysiwygInternals.variable {
    color: var(--fe-variable-color, #fc618d);
  }
`;
