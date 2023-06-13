import { LitElement, html } from 'lit';

import '@github/markdown-toolbar-element/dist/index.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/editor-icons.js';
import '@material/mwc-tab-bar';
import '@material/mwc-tab';
import '@material/mwc-menu/mwc-menu';
import '@material/mwc-list/mwc-list-item.js';

import { rawSpan } from '@fundwave/ui-utils/src/ModuleUtil.js';
import { gfm } from 'turndown-plugin-gfm/lib/turndown-plugin-gfm.es';

import { TabStyles } from "@fundwave/styles/tab-styles";


export class MarkdownEditor extends LitElement {

  render() {

    return html`

        ${TabStyles}

        <style>
          mwc-tab-bar.primary-colored {
            --mdc-typography-button-font-weight: 500;
            display: inline-block;
          }
          .toolbar-icon{
            font-family: var(--theme-font);
            --iron-icon-height: var(--h2-font-size, 16px);
            --iron-icon-width: var(--h2-font-size, 16px);
            --iron-icon-color: var(--secondary-color, #515151);
            color: var(--secondary-color, #515151);
            font-size: var(--body-font-size, 16px);
            padding: 0 max(5px ,1%);
          }
          .toolbar-icon:hover{
            --iron-icon-color: var(--primary-color, #515151);
            color: var(--primary-color, #515151);
            cursor: pointer;
          }
          .textarea{
            width: 100%;
            min-height: var(--textarea-min-height, 300px);
            resize: vertical;
            color: var(--secondary-color, #515151);
            font-size: var(--body-font-size, 16px);
            font-family: var(--theme-font);
            border: none;
            padding: 1%;
            box-sizing: border-box;
            outline: none;
            line-height: 1.5;
            overflow-y: auto;
          }
          .toolbar,.textarea{
            display: none;
          }
          .toolbar[active],.textarea[active]{
            display: block;
          }
          .email-editor{
            border: 1px solid var(--secondary-color-l1);
            margin: 3% 0;
            position: relative;
          }
          .toolbar-container{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--secondary-color-l1, #eee);
          }
          .toolbar{
            text-align: end;
            width: 100%;
          }
          @media (max-width: 768px){
            .toolbar-container{
              display: flex;
              flex-direction: column;
              align-items: unset;
            }
            .toolbar{
              padding: 10px 0;
              flex-wrap: wrap;
              border-top: 1px solid var(--secondary-color-l1, #eee);
              text-align: start;
            }
          }

          .insert-button {
            color: var(--secondary-color, #515151);
            font-family: var(--theme-font);
            border: none;
            background: transparent;
            font-size: var(--body-font-size, 16px);
          }
          .insert-button:hover {
            color: var(--primary-color, #515151);
            cursor: pointer;
            background: #f5f5f5;
            border: none;
          }
          .insert-button:focus {
            outline: none;
          }

          #fields-menu {
            border-radius: 10px;
          }
          #secondary-fields-menu {
            border-radius: 10px;
          }
          .menu-item-group {
            font-family: var(--theme-font);
            font-weight: 500;
            font-size: var(--body-font-size, 16px);
            padding-left: 5px;
            margin: 5px;
            text-align: left;
          }
          .menu-item {
            cursor: pointer;
            font-family: var(--theme-font);
            padding: 10px;
            margin: 0px;
            text-align: left;
            min-width: 300px;
          }
          .menu-item:hover {
            background-color: #f5f5f5;
          }

        </style>

        <div class="email-editor">

          <div class="toolbar-container">

            <mwc-tab-bar @MDCTabBar:activated=${(e) => this.activeIndex = e.detail.index} class="primary-colored">
              <mwc-tab label="Write"></mwc-tab>
              <mwc-tab label="Preview"></mwc-tab>
            </mwc-tab-bar>

            <markdown-toolbar class="toolbar" for="textarea_id" ?active=${this.activeIndex == 0}>
              ${this.customFields?.length > 0 ?
                html`
                  <span style="position:relative;">
                    <button class="insert-button" @tap="${(e) => this.showFieldsMenu(e,'fields-menu')}">Insert</button>
                    ${this.getCustomFieldsMenu()}
                    ${this.getCustomSecondaryFieldsMenu()}
                  </span>
                `
                :
                html ``
              }
              <md-header><span class="toolbar-icon"><b>H</b></span></md-header>
              <md-bold><iron-icon class="toolbar-icon" icon="editor:format-bold"></iron-icon></md-bold>
              <md-italic><iron-icon class="toolbar-icon" icon="editor:format-italic"></iron-icon></md-italic>
              <md-quote><iron-icon class="toolbar-icon" icon="editor:format-quote"></iron-icon></md-quote>
              <md-code><iron-icon class="toolbar-icon" icon="icons:code"></iron-icon></md-code>
              <md-link><iron-icon class="toolbar-icon" icon="editor:insert-link"></iron-icon></md-link>
              <md-unordered-list><iron-icon class="toolbar-icon" icon="editor:format-list-bulleted"></iron-icon></md-unordered-list>
              <md-ordered-list><iron-icon class="toolbar-icon" icon="editor:format-list-numbered"></iron-icon></md-ordered-list>
              <!-- <md-task-list><iron-icon class="toolbar-icon" icon="icons:check-box"></iron-icon></md-task-list> -->
            </markdown-toolbar>

          </div>

          <textarea id="textarea_id" class="textarea" .value=${this.markdownText ?? ''} ?active=${this.activeIndex == 0}></textarea>

          <div class="textarea" ?active=${this.activeIndex == 1}>
            ${rawSpan(this.editorEmailText)}
          </div>
        </div>
        `;
  }

  /* Setup Methods */
  static get properties() {
    return {
      emailText: String,
      editorEmailText: String,
      markdownText: String,
      markdownToHTMLService: Object,
      htmlToMarkdownService: Object,
      activeIndex: Number,
      customFields: Array,
      secondaryFields: Array,
      selectedFieldGroup: String,
      fieldFormat: String
    }
  }


  constructor() {
    super();
    this.markdownToHTMLService = new showdown.Converter();
    this.markdownToHTMLService.setFlavor('github');
    this.htmlToMarkdownService = new TurndownService({bulletListMarker: '-', headingStyle: 'atx', hr: '---'});
    this.htmlToMarkdownService.use(gfm);

    this.selectedFieldGroup = "";
    this.secondaryFields = [];
  }

  firstUpdated() {
    let textarea = this.shadowRoot.querySelector('#textarea_id');

    let eventListener = (e) => {
      this.markdownTextChanged(e.target.value);
    };

    textarea.addEventListener('input', eventListener);
  }

  markdownTextChanged(markdownText) {
    this.markdownText = markdownText;
    this.editorEmailText = this.markdownToHTMLService.makeHtml(this.markdownText);

    this.dispatchEvent(new CustomEvent('email-text-changed', { detail: { value : this.editorEmailText }, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('markdown-text-changed', { detail: { value : this.markdownText }, bubbles: true, composed: true }));
  }

  updated(changedProperties) {
    if (changedProperties.has('emailText') && this.emailText && this.editorEmailText != this.emailText) {
      this.setEditorContent();
    }
  }

  getCustomFieldsMenu() {
    return html`
      <mwc-menu id="fields-menu">
        ${this.customFields.map(field => html`
          ${field.fields ?
            html`
              <div class="menu-item" @tap="${e => {e.detail.value = field; this.fieldGroupSelected(e); this.hideFieldsMenu('fields-menu');}}">
                ${field.title}
                <div style="float:right; color:var(--secondary-color, #515151);"><iron-icon icon="hardware:keyboard-arrow-right"></iron-icon></div>
              </div>
            `
            :
            html`
              <div class="menu-item" @tap="${() => {this.setCustomField(field.property); this.hideFieldsMenu('fields-menu');}}">
                ${field.text}
              </div>
            `
          }
        `)}
      </mwc-menu>
    `;
  }

  getCustomSecondaryFieldsMenu() {
    return html `
      <mwc-menu id="secondary-fields-menu">
        <div class="menu-item-group">${this.selectedFieldGroup}</div>
        ${this.secondaryFields && this.secondaryFields.map(field => html`
          <div class="menu-item" @tap="${() => {this.setCustomField(field.property); this.hideFieldsMenu('secondary-fields-menu');}}">
            ${field.text}
          </div>
        `)}
      </mwc-menu>
    `;
  }

  fieldGroupSelected(e) {
    let fieldGroup = e.detail.value;

    this.secondaryFields = [].concat(fieldGroup.fields);
    this.selectedFieldGroup = fieldGroup.title;
    this.showFieldsMenu(e,'secondary-fields-menu');
  }

  showFieldsMenu(e,divId) {
    divId = `#${divId}`;
    var customFieldMenu = this.shadowRoot.querySelector(divId);

    customFieldMenu.anchor = e.target;
    customFieldMenu.corner = "BOTTOM_START";
    customFieldMenu.menuCorner = "START";

    customFieldMenu.show();
  }
  hideFieldsMenu(divId) {
    divId = `#${divId}`;
    var customFieldMenu = this.shadowRoot.querySelector(divId);
    customFieldMenu.close();
  }

  setCustomField(field) {
    let textarea = this.shadowRoot.querySelector('#textarea_id');

    let cursorStartPosition = textarea.selectionStart;
    let cursorEndPosition = textarea.selectionEnd;
    let markdownText = this.markdownText;

    let formattedFieldText = this.getFormattedField(field);;

    if(cursorStartPosition === cursorEndPosition)
      markdownText = textarea.value.slice(0,cursorStartPosition) + formattedFieldText + textarea.value.slice(cursorStartPosition);  //insert field at startPosition
    else {
      let selectedSubstring = textarea.value.slice(cursorStartPosition,cursorEndPosition);
      markdownText = textarea.value.replace(selectedSubstring,formattedFieldText);  //replace selected string with field
    }

    this.markdownTextChanged(markdownText);

    this.hideFieldsMenu('fields-menu');
  }

  getFormattedField(field) {
    return this.fieldFormat.replace("field",field);
  }

  setEditorContent() {

    this.editorEmailText = this.emailText;

    //Run through the services once to remove any unsupported styling
    let markdown = this.htmlToMarkdownService.turndown(this.editorEmailText);

    this.editorEmailText = this.markdownToHTMLService.makeHtml(markdown);

    this.markdownText = this.htmlToMarkdownService.turndown(this.editorEmailText);

  }

}

customElements.define('markdown-editor', MarkdownEditor);
