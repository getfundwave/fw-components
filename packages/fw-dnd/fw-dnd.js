import { LitElement, html, css } from "lit";

class DnDList extends LitElement {
  static get styles() {
    return css`
      :host,
      .drag-test {
        display: block;
        height: 100%;
      }
    `;
  }

  static get properties() {
    return {
      headerName: String,
      dragStartElement: Object,
      endContainer: String,
      startContainer: String,
      list: Array,
      loading: Boolean,
    };
  }

  constructor() {
    super();
    this.headerName = "Table-1";
    this.list = [];
    this.loading = false;
  }

  render() {
    return html`
      <style>
        .droppable-container .draggable-item {
          cursor: grabbing;
        }
        .draggable-item.dragging {
          opacity: var(--fw-drag-drop-placeholder-opacity, 0.5);
          border: var(--fw-drag-drop-placeholder-border, "");
          background-color: var(--fw-drag-drop-placeholder-bgColor, "transparent");
        }
      </style>
      ${this.loading
        ? ""
        : html`
            <div class="drag-test">
              <div
                class="droppable-container"
                id=${this.headerName}
                @dragover=${(e) => this.reorderListItems(e)}
                @dragenter=${(e) => e.preventDefault()}
                @drop=${(e) => e.preventDefault()}
              >
                ${this.list &&
                this.list.map((item, index) => {
                  return html`
                    <div
                      class="draggable-item"
                      id=${index}
                      containerName=${this.headerName}
                      draggable="true"
                      @dragstart=${(e) => this.dragStart(e)}
                      @dragend=${(e) => {
                        e.currentTarget.classList.remove("dragging");
                        this.dragEnded(e);
                      }}
                    >
                      ${this.dragItemRenderer(item)}
                    </div>
                  `;
                })}
              </div>
            </div>
          `}
    `;
  }

  dragStart(e) {
    this.dragStartElement = e.target;
    e.dataTransfer.setData("text", e.target);
    setTimeout(() => {
      this.dragStartElement.classList.add("dragging");
    }, 0);
  }

  dragEnded(e) {
    e.preventDefault();
    this.startContainer = this.dragStartElement.getAttribute("containerName");
    this.endContainer = e.currentTarget.getAttribute("containerName");
    if (this.startContainer !== this.endContainer) {
      return;
    }
    const listArray = Array.from(e.currentTarget.parentNode.childNodes);
    const [updatedList, draggedItem, newIndex] = this.updateList(listArray);
    const oldIndex = this.list.findIndex((item) => item === draggedItem);
    if (oldIndex === newIndex) return;
    this.loading = true;
    let itemReorderEvent = new CustomEvent("item-reordered", { detail: { draggedItem: draggedItem, newIndex: newIndex }, bubbles: true, composed: true });
    let event = new CustomEvent("list-updated", { detail: { data: updatedList }, bubbles: true, composed: true });
    this.list = updatedList;
    this.dispatchEvent(event);
    this.dispatchEvent(itemReorderEvent);
    setTimeout(() => {
      this.loading = false;
    }, 0);
  }

  updateList(listArray) {
    const data = [];
    let draggedItem, newIndex;
    let count = 0;
    for (let i = 0; i < listArray.length; i++) {
      if (listArray[i].className === "draggable-item") {
        var id = listArray[i].id;
        if (id === this.dragStartElement.id) {
          draggedItem = this.list[id];
          newIndex = count;
        }
        data.push(this.list[id]);
        count++;
      }
    }
    return [data, draggedItem, newIndex];
  }

  reorderListItems(e) {
    e.preventDefault();
    const droppableContainer = this.shadowRoot.querySelector(".droppable-container");
    const draggingItem = this.shadowRoot.querySelector(".dragging");

    let siblings = [...droppableContainer.querySelectorAll(".draggable-item:not(.dragging)")];
    let nextSibling = siblings.find((sibling) => {
      const dim = sibling.getBoundingClientRect();
      return e.clientY <= dim.top + dim.height / 2;
    });
    droppableContainer.insertBefore(draggingItem, nextSibling);
  }
}

window.customElements.define("fw-dnd", DnDList);
