import { LitElement, html } from 'lit';
export class FwAvatar extends LitElement {
    static get properties() {
        return {
            name: Object,
            title: Object,
            color: Object,
            type: Object,
            imgSrc: String,
            luminance: String
        };
    }
    render() {
        var _a;
        return html `
          <style>
            .avatar {
              display:inline-block;
              font-size: calc(var(--avatar-size,30px) / 2.5);
              width:var(--avatar-size,30px);
              height:var(--avatar-size,30px);
              line-height:var(--avatar-size,30px);
              text-align:center;
              border-radius:50%;
              vertical-align:middle;
              color:var(--avatar-color,white);
              border: var(--border, none);
              font-family: var(--theme-font);
              background: plum;
            }
          </style>

         <div class="avatar" title="${this.title ? this.title : this.name}" style="background: ${this.type === "image" ? `url(${this.imgSrc})` : ((_a = this.color) !== null && _a !== void 0 ? _a : `var(--avatar-background,${this.getColor(this.name)})`)}">
           ${(!(this.type === "image")) ? html `<div>${this.type == "initials" ? this.getInitials(this.name) : this.name}</div> ` : html ``}
         </div>

        `;
    }
    constructor() {
        super();
    }
    updated(changedProperties) {
    }
    getInitials(name) {
        var initials = name.split(/\s/) || [];
        let firstLetter = initials.shift() || '';
        let lastLetter = initials.pop() || '';
        initials = (((firstLetter === null || firstLetter === void 0 ? void 0 : firstLetter[0]) || '') + ((lastLetter === null || lastLetter === void 0 ? void 0 : lastLetter[0]) || (firstLetter === null || firstLetter === void 0 ? void 0 : firstLetter[1]) || '')).toUpperCase();
        return initials;
    }
    getColor(str) {
        var _a;
        if (!str)
            return "plum";
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        var h = hash % 360;
        var l = (_a = this.luminance) !== null && _a !== void 0 ? _a : '80%';
        return `hsl(${h}, 50%, ${l})`;
    }
}
customElements.define('fw-avatar', FwAvatar);
//# sourceMappingURL=fw-avatar.js.map