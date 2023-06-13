import { LitElement, html } from 'lit';
import { repeat } from 'lit/directives/repeat';

import '@material/mwc-menu/mwc-menu';
import '@material/mwc-list/mwc-list-item.js';

import { ScaleUpVerticalBottom } from '@fundwave/styles/animation-styles';

export class FwRichTextEditor extends LitElement  {
    render() {
      return html `
          ${ScaleUpVerticalBottom}
          <style>
            :host {
              width: 100%;
              display: inline-block;
            }

            #text-container{
              min-height: var(--container-height, 20px);
              font-family: var(--theme-font);
              color: var(--secondary-color, #9e9e9e);
              font-size: var(--text-size, 14px);
              padding: 10px;
              outline-style:none;
              white-space: pre-wrap;
              align-content: flex-start;
              border-radius: 2px;
              border-bottom: 1px solid var(--secondary-color-l3);
            }

            [contentEditable]:empty:not(:focus):before {
              content:attr(data-placeholder);
              color: var(--secondary-color-l1);
              display: inline-block;
            }

            paper-button {
              min-width: 10px;
              max-width: var(--button-text-width, 10px);
              margin: 10px 0px 0 0;
              height: 30px;
              font-size: var(--button-text-size, 13px);
              font-family: var(--theme-font);
              text-transform: none;
            }

            paper-button#post-button {
              color: var(--button-text-color, var(--primary-color));
              background-color: var(--button-background-color, transparent);
            }

            .character-limit {
              font-family: var(--theme-font);
              color: var(--secondary-color);
              font-size: var(--tertiary-font-size, 12px);
              margin: 10px 6px 0 0;
              float: right;
            }

            .container{
              position: relative;
            }

            .container[border] {
              border: var(--border-width, 1px) solid #EEEEEE;
            }
            
            .exceed {
              color: #df0000!important;
            }

            .tag{
              color: var(--tag-color);
            }
            
            .hidden-item { display: none; }
            #text-container:focus ~ .hidden-item { display: inline-block; }

            .post-button { height: auto; padding: 0; margin: 8px 10px 5px 10px; margin-right: 20px;}
            .char-count { margin: 8px 10px 5px 10px;}
            .char-count-persist { display: flex; }

            .post-button-persist { display: flex;}
            .post-button:hover{ font-weight: bold; display: block;}

            .hidden-item:focus { display: block; }

            mwc-menu, mwc-list-item {
              font-family: var(--theme-font);
              font-size: var(--secondary-font-size, 15px);
              color: var(--secondary-color);
              --mdc-menu-max-width: 350px;
              --mdc-menu-min-width: 200px;
              --mdc-menu-max-height: 25vh;
              --mdc-theme-primary: var(--primary-color);
              --mdc-theme-text-icon-on-background: var(--secondary-color);
              --mdc-menu-z-index: 300;
              word-break: break-word;
            }
            .keyPressCaption{
              color: var(--secondary-color-l1);
              font-size: calc(var(--tertiary-font-size, 12px) - 3px);
              font-family: var(--theme-font);
            }
            @media all and (max-width: 1024px) {
              .keyPressCaption{
                display: none!important;
              }
            }
          </style>

          <div class="container" ?border=${!this.noBorder}>

            <div id="text-container" dir="ltr"
              class="text colored" contenteditable="true" data-placeholder="${this.placeholder}"
              @keypress=${(e) => this.onKeypress(e)} @keyup="${(e) => {this.countCharacters(e); this.openTagListOnMobile(e)}}"></div>

           ${this.maxCharCount && this.maxCharCount > 0 ? html `<div id="character-limit" class="character-limit ${this.persistCharCount ? 'char-count-persist' : 'char-count  hidden-item'}">${this.charCount}/${this.maxCharCount}</div>` : null}

           <paper-button id="post-button" icon="send" class="send scale-up-ver-bottom" class="${this.persistButton ? 'post-button-persist' : 'post-button hidden-item'}" @tap="${(e) => this.save(e)}">Post</paper-button>
           <span class="keyPressCaption  hidden-item">Shift + Return to post</span>

           ${this.tagList && this.tagList.length ? html`
            <mwc-menu id="menu" @action="${(e) => this.addTag(this.tagList?.[e.detail.index])}" defaultFocus="FIRST_ITEM">
                
                ${repeat(this.tagList, (tag) => html`
                  <mwc-list-item .value=${tag} id="list-item">${tag?.firstName}</mwc-list-item>
                `)}

              </mwc-menu>
            ` : null}
        </div>
        `;
      }

    /* Setup Methods */
    static get properties(){
      return {
        loggedInUser: Object,
        childNodes: Number,
        tags: Array,
        tagList: Array,
        placeholder: String,
        persistButton: Boolean,
        allowAttachments: Boolean,
        noBorder: Boolean,
        value: String,
        charCount: Number,
        maxCharCount: Number,
        persistCharCount: Boolean,
        required: Boolean
      }
    }


    constructor() {
      super();
      this.value = '';
      this.noBorder = false;
      this.placeholder = '';
      this.persistButton = false;
      this.persistCharCount = false;
      this.tags = new Array();
      this.childNodes = 1;
      this.charCount = 0;
      this.maxCharCount = 0;
      this.required = true;
    }

    updated(changedProperties) {
      if(changedProperties.has('value')) this._valueChanged();
    }

    _valueChanged() {
      if(this.maxCharCount && this.maxCharCount > 0) this.charCount = this.value?.length ?? 0;
      var textContainer = this.shadowRoot.querySelector('#text-container');
      textContainer.textContent = this.value ?? '';
      this.tags = [];
    }

    onKeypress(e){
      if(e.key == "@"){
        this.showTagMenu(e);
      }
      if (e.keyCode == 13 && e.shiftKey) {
        e.preventDefault();
        this.save();
      }
    }

    openTagListOnMobile(e) {
      var keyCode = e.keyCode || e.which;
      if (keyCode == 0 || keyCode == 229) { //for android chrome keycode fix, would only work if @ is at last position.
          let value = this.shadowRoot.querySelector('#text-container').innerText;
          if(value) {
            keyCode = value.charCodeAt(value.length - 1);
            if(keyCode == 64) this.showTagMenu(e);
          }
      }
    }

    showTagMenu(e){
      var menu = this.shadowRoot.querySelector('#menu');
      if(!menu) return;
      menu.anchor = e.target;
      menu.corner = "BOTTOM_START";
      menu.menuCorner = "END";
      menu.show();
    }

    countCharacters() {
      var textArea = this.shadowRoot.querySelector('#text-container');
      var characterLimit = this.shadowRoot.querySelector('#character-limit');
      this.charCount = textArea.textContent.length;
      if(this.maxCharCount == 0 || this.charCount <= this.maxCharCount) characterLimit.classList.remove('exceed');
      if(this.charCount > this.maxCharCount) characterLimit.classList.add('exceed');
    }

    closeTagList() {
      var menu = this.shadowRoot.querySelector('#menu');
      if(menu) menu.close();
    }

    addTag(user) {
      var commentTextArea = this.shadowRoot.querySelector('#text-container');
      this.tags.push(user);
      this.removeMentionSymbol(commentTextArea);
      var node = document.createElement('span');
      var textNode = document.createTextNode('\u0020');
      node.id = 'userid'+user.userId;
      node.classList.add('tag');
      node.user = user;
      node.contentEditable = true;
      node.innerHTML = '@'+user.firstName;
      commentTextArea.appendChild(node);
      commentTextArea.appendChild(textNode);
      this.focusElement(commentTextArea, 'end');
      this.closeTagList();
      this.addMutationObserver(node, this);
    }

    removeMentionSymbol(commentTextArea) {
        var length = commentTextArea.childNodes.length;
        var index = length-1;
        while(commentTextArea.childNodes[index].nodeType != 3 && index >= 0) {
          index--;
        }
        var mentionSymbolNode = commentTextArea.childNodes[index];
        mentionSymbolNode.textContent = mentionSymbolNode.textContent.substring(0,mentionSymbolNode.textContent.length-1);
    }

    focusElement(commentTextArea, position) {
      var commentTextArea = this.shadowRoot.querySelector('#text-container');

      if(position == "end") {
        var range = document.createRange();
        var sel = window.getSelection();

        // Sets the range start to the end
        range.setStart(commentTextArea, commentTextArea.childNodes.length);

        // collapse true sets the rangeStart = rangeEnd
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }

      commentTextArea.focus();
    }

    // TODO: make this method pick up the caret position and respect all the messaging apps for their smooth interface. no, really.
    getCaretPosition() {
      var commentTextArea = this.shadowRoot.querySelector('#text-container');
      var range = window.getSelection().getRangeAt(0);
      var preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(commentTextArea);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      var caretOffset = preCaretRange.toString().length;
      return caretOffset;
    }

    addMutationObserver(node, that) {
      var commentTextArea = this.shadowRoot.querySelector('#text-container');
      var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if(mutation.type == "characterData") {
          var user = node.user;
          for(var index = 0; index < that.tags.length; index++) {
              if(that.tags[index].userId == user.userId) that.tags.splice(index, 1);
          }
            that.focusElement(commentTextArea, '');
            //that.getCaretPosition();
            observer.disconnect();
            node.parentNode.removeChild(node);
          }
        });
      });
      const config = {characterData: true, attributes: false, childList: false, subtree: true};
      observer.observe(node, config);
    }

    replaceAll(str, find, replace) {
      return str.replace(new RegExp(find, 'g'), replace);
    }

    reset(){
      this.resetCharCount();
      this.tags = new Array();
      textArea.textContent = '';
    }

    resetCharCount() {
      this.charCount = 0;
    }

    save(e) {
      var textArea = this.shadowRoot.querySelector('#text-container');
      var text =  textArea.innerText?.trim();
      if(this.maxCharCount > 0 && text.length > this.maxCharCount && (this.required && !text)) return;
      this.dispatchEvent(new CustomEvent('save', {detail: {text: text, tags: this.tags}, bubbles: true, composed: true}));
      //Reset only if the field was required as other components might be validating on their own
      if(this.required) {
        this.value = null;
        this.requestUpdate('value');
      }
    }

}

customElements.define('fw-rte', FwRichTextEditor);
