import { LitElement, html } from "lit";
import "@fw-components/fw-dnd/fw-dnd-crud";
import "@fw-components/fw-dnd/fw-dnd"

export class FWDndShowcase extends LitElement {
  static get properties() {
    return {
      list: Array,
      admin: Boolean,
    };
  }

  constructor() {
    super();
    this.admin = true;
    this.list = [...sampleDocumentTags];
  }

  async handleDelete(eventDetails) {
    const deletedTag = eventDetails.data;
  
    this.list = this.list.filter((tag) => tag.id !== deletedTag.id);
  }

  async handleAdd(eventDetails) {
    const addedTag = eventDetails.data;

    addedTag["id"] = `randomId${Math.floor(Math.random() * 65536) + 1}`;
    this.list = [...this.list, addedTag];
  }

  async handleUpdate(eventDetails) {
    const updatedTag = eventDetails.data;
    
    this.list = this.list.filter((tag) => tag.id !== updatedTag.id);
    this.list = [...this.list, updatedTag];
  }

  hoverMessageForDefaultName(tag) {
    return `All ${tag.defaultName} shared from Fund Admin would be linked with this tag`;
  }

  render() {
    console.log(this.list)
    return html`
      <div style='width:95%;margin:auto'>
        <button style="margin-bottom:20px;"
          @click=${() => {this.admin = !this.admin}}
        > Toggle Admin </button>
        <h2 style="margin-left:10px;">Customize Document Types</h2>
        <fw-dnd-crud
          .list=${this.list}
          .editable=${this.admin}
          .stepSize=${1024}
          .defaultAttributeHoverMessage=${(tag) =>this.hoverMessageForDefaultName(tag)}
          primaryAttribute="name"
          secondaryAttribute="description"
          idAttribute="id"
          positionAttribute="position"
          preventDeleteAttribute="defaultName"
          primaryHeaderValue="Name"
          secondaryHeaderValue="Description"
          @item-deleted=${(e) => this.handleDelete(e.detail)}
          @item-added=${(e) => this.handleAdd(e.detail)}
          @item-updated=${(e) => this.handleUpdate(e.detail)}
        ></fw-dnd-crud>
      </div>
    `;
  }
}
const sampleDocumentTags = [
  {
    id: "62b56101904ca55d591af825",
    name: "Term Sheet",
    position: 2048,
  },
  {
    id: "32rfew2f432a55d591af825",
    name: "Subscription Agreement",
    position: 5120,
  },
  {
    id: "23rf3wf34225ecbda94db4a78d",
    name: "RoFR",
    description: "Right of First Refusal",
    position: 6144,
  },
  {
    id: "5ee9b297cc6c8cea31387c33",
    name: "VA",
    description: "Voting agreement",
    position: 1024,
  },
  {
    id: "7s2kjshfn39c8cea31387c33",
    name: "Notices",
    position: 3072,
    defaultName: "Notices",
  },
  {
    id: "jdn372vbks87cea31387c33",
    name: "Reports",
    position: 7168,
    defaultName: "Reports",
  },
];

window.customElements.define("fw-dnd-showcase", FWDndShowcase);
