import { css } from "lit";

export const FormulaEditorStyles = css`

  .formula-editor-label {
    display: block;
    font-size: var(--fe-label-font-size, 0.8rem);
    color: var(--fe-label-color, #515151);
    margin-bottom: var(--fe-label-margin-bottom, 1px);
  }

  :host {
    display: block;
    position: relative;
  }

  #wysiwyg-editor {
    display: inline-block;
    padding: var(--fe-padding, 8px);
    caret-color: var(--fe-caret-color, #fff);
    color: var(--fe-text-color, #f7f1ff);
    line-height: 1.1;
    width:  var(--fe-width, 100%);
    height: var(--fe-height, 60%);
    border-radius: var(--fe-border-radius, 4px);
    overflow: auto;
    border: var(--fe-border, 2px solid black);
    border-bottom: var(--fe-border-bottom, 0px solid black);
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    white-space: pre-wrap;
    background-color: var(--fe-background-color, #222222);
    margin: 0px;
    box-sizing: border-box;
    /* position: relative; */
  }

  #wysiwyg-editor:empty:before {
  content: attr(placeholder);
  color: var(--fe-placeholder-color,grey);
  pointer-events: none;
  }

  #wysiwyg-editor:focus {
    border-color: var(--fe-focus-border-color, #7c5dfa);
    box-shadow: 0 0 0 2px var(--fe-focus-shadow-color, rgba(124, 93, 250, 0.2));
  }

  /* Responsive styles */
  @media (max-width: 768px) {
    #wysiwyg-editor {
      font-size: var(--fe-mobile-font-size, 14px);
      padding: var(--fe-mobile-padding, 6px);
    }
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
    transition: color 0.2s ease;
  }

  .wysiwygInternals.operator {
    font-weight: bold;
    color: var(--fe-operator-color, #fc618d);
    transition: color 0.2s ease;
  }

  .wysiwygInternals.variable {
    color: var(--fe-variable-color, #fc618d);
    transition: color 0.2s ease;
  }

  .wysiwygInternals.function {
    color: var(--fe-function-color, #82aaff);
    font-style: italic;
    transition: color 0.2s ease;
  }

  .wysiwygInternals.constant {
    color: var(--fe-constant-color, #c3e88d);
    font-weight: 500;
    transition: color 0.2s ease;
  }

  /* High contrast mode support */
  @media (forced-colors: active) {
    .wysiwygInternals.error {
      forced-color-adjust: none;
      text-decoration-color: CanvasText;
    }
    
    #wysiwyg-editor:focus {
      outline: 2px solid Highlight;
    }
  }

  .error-message {
    color: var(--fe-error-color, #fc514f);
    background-color: var(--fe-error-background, rgba(252, 81, 79, 0.1));
    padding: var(--fe-error-padding, 8px);
    border-radius: var(--fe-error-border-radius, 4px);
    margin-top: var(--fe-error-margin-top, 4px);
    animation: fadeIn 0.2s ease;
    font-size: var(--fe-error-font-size, 0.8rem);
    margin-top: var(--fe-error-margin-top, 4px);
    min-height: var(--fe-error-min-height, 1.2em);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Loading state */
  .loading::after {
    content: '';
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    border: 2px solid var(--fe-loading-color, #fc618d);
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: translateY(-50%) rotate(360deg);
    }
  }
`;
