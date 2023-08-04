import { LitElement, html } from "lit";
import "@fw-components/fw-dnd/fw-dnd-crud";
import "@fw-components/fw-dnd/fw-dnd";

export class FWDndShowcase extends LitElement {
  static get properties() {
    return {
      list: Array,
      editable: Boolean,
    };
  }

  constructor() {
    super();
    this.editable = true;
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

  getInfoMessage(tag) {
    return `This ${tag.name} can't be deleted`;
  }

  render() {
    console.log(this.list);
    return html`
      <div style="width:95%;margin:auto;">
        <h2>Customize Document Types</h2>
        <button
          style="margin-bottom:20px;"
          @click=${() => {
            this.editable = !this.editable;
          }}
        >
          Toggle editable
        </button>
        <fw-dnd-crud
          .list=${this.list}
          .editable=${this.editable}
          .stepSize=${1024}
          secondaryAttribute="description"
          positionAttribute="position"
          restrictDeleteAttribute="fixed"
          secondaryHeader="Description"
          .getInfoMessage=${(tag) => this.getInfoMessage(tag)}
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
    fixed: true,
  },
  {
    id: "jdn372vbks87cea31387c33",
    name: "Reports",
    position: 7168,
    fixed: true,
  },
];

window.customElements.define("fw-dnd-showcase", FWDndShowcase);
