import "../src/fw-avatar-group.js";
import { FwAvatarGroup } from "../src/fw-avatar-group.js";
import { fixture, html, expect, assert, oneEvent } from "@open-wc/testing";

//constants
let users = [
  { name: "Richard", company: "PiedPiper" },
  { name: "Dinesh", company: "PiedPiper" },
  { name: "Jared", company: "PiedPiper" },
  { name: "Gavin Belson", company: "Hooli" },
  { name: "Monica Hall", company: "Bream Hall" },
];
let usersWoSecondryAttribute = [
  { name: "Richard" },
  { name: "Dinesh" },
  { name: "Jared" },
  { name: "Gavin Belson" },
  { name: "Monica Hall" },
];
let primaryAction = {
  title: "Primary action Button",
  icon: "add",
};
let secondaryAction = {
  title: "Secondary action button",
  closeDialog: true,
};
let emptyStateAction = {
  title: "Empty State action button",
  closeDialog: true,
};
let maxCount = 3;
let emptyStateMessage = "No Match Found";
let header = "Sillicon Valley";
let nameAttribute = "name";
let secondaryAttribute = "company";
let showSearchBar = true;

describe("Fw-Avatar-Group Tests", async () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html` <fw-avatar-group
      .items=${users}
      nameAttribute=${nameAttribute}
      secondaryAttribute=${secondaryAttribute}
      .maxCount=${maxCount}
      header=${header}
      .showSearchBar=${showSearchBar}
      .primaryAction=${primaryAction}
      .secondaryAction=${secondaryAction}
      emptyStateMessage=${emptyStateMessage}
      .emptyStateAction=${emptyStateAction}
      .absolute=${true}
    ></fw-avatar-group>`);
  });

  it("FwAvatarGroup instance check", () => {
    assert.instanceOf(
      element,
      FwAvatarGroup,
      " The Element created from tag fw-avatar-group is not an instance of FWAvatarGroup class\n"
    );
  });

  it("checks for items(with secondary attr) content", async () => {
    const itemsListHtml = element.shadowRoot.querySelectorAll(
      "mwc-list-item.items-list-item > span"
    );

    let tempArray = Array();
    for (let i = 0; i < itemsListHtml.length; i = i + 2) {
      tempArray.push({
        name: String(itemsListHtml[i].textContent.trim()),
        company: String(itemsListHtml[i + 1].textContent.trim()),
      });
    }
    expect(element.items).to.equal(users);
    expect(tempArray).to.be.eql(users);
  });

  it("checks for items(without secondary attr) content", async () => {
    element.items = usersWoSecondryAttribute;
    element.removeAttribute("secondaryAttribute");
    await element.elementUpdated;

    const itemsListHtml = element.shadowRoot.querySelectorAll(
      "mwc-list-item.items-list-item > span"
    );

    let tempArray = Array();
    for (let i = 0; i < itemsListHtml.length; i = i + 1) {
      tempArray.push({
        name: String(itemsListHtml[i].textContent.trim()),
      });
    }
    expect(element.items).to.equal(usersWoSecondryAttribute);
    expect(tempArray).to.be.eql(usersWoSecondryAttribute);
  });

  it("checks Max Count property", async () => {
    const visibleAvatars = element.shadowRoot
      .querySelector("#group")
      .querySelectorAll("fw-avatar[type='initials']");
    expect(element.maxCount).to.equal(maxCount);
    expect(visibleAvatars.length).to.equal(
      Math.min(users.length, maxCount),
      "The number of avatars rendered in the group do not match with MaxCount\n"
    );
  });

  it("checks menu visiblility on tap/Click event", async () => {
    expect(
      element.shadowRoot.querySelector("#menu").getAttributeNames()
    ).not.to.include("open", "Menu in open mode without Click event \n");

    const AvatarGroupButton = element.shadowRoot.querySelector(".group");

    setTimeout(() => {
      AvatarGroupButton.click();
    });
    const {} = await oneEvent(AvatarGroupButton, "click");

    expect(
      element.shadowRoot.querySelector("#menu").getAttributeNames()
    ).to.include("open", "Click even didn't triggered the menu to  open \n");
  });

  it("checks Header property", async () => {
    let headertext = element.shadowRoot
      .querySelector(".dialog-header-span")
      .textContent.trim();

    expect(element.header).to.equal(header);
    expect(headertext).to.be.equal(
      header,
      "Header do not match with given prop\n"
    );
    element.removeAttribute("header");
    await element.elementUpdated;
    headertext = element.shadowRoot
    .querySelector(".dialog-header-span")
    .textContent.trim();

    expect(headertext).to.equal("Members","Default Header Value do not match");

  });

  it("checks for searchBar visibility", async () => {
    const searchBarElement = element.shadowRoot.querySelector("#searchBar");

    if (!showSearchBar)
      expect(
        searchBarElement,
        "Search Bar visible , even when false passed to showSearchBar\n"
      ).to.be.null;
    else
      expect(
        searchBarElement,
        "Search Bar not visible when true passed to showSearchBar\n"
      ).not.to.be.null;
  });

  it("checks for primary action property", async () => {
    const primaryBtnItem = element.shadowRoot.querySelector("#primary-action-item");

    expect(primaryBtnItem.querySelector("span").textContent).to.equal(
      primaryAction["title"]
    );
    expect(primaryBtnItem.querySelector("mwc-icon")).dom.to.equal(
      `<mwc-icon>${primaryAction["icon"]}</mwc-icon>`,
      { ignoreAttributes: ["slot"] }
    );

    setTimeout(() => {
      primaryBtnItem.click();
    });
    const event = await oneEvent(element, "primary-action-clicked");
    expect(event.type).to.equal("primary-action-clicked");
    
  });

  it("checks for secondary action property", async () => {
    const AvatarGroupButton = element.shadowRoot.querySelector(".group");
    const menuElement = element.shadowRoot.querySelector("#menu");

    setTimeout(() => {
      AvatarGroupButton.click();
    });
    const {} = await oneEvent(AvatarGroupButton, "click");

    expect(menuElement.getAttributeNames()).to.include("open");

    const secBtnElement = element.shadowRoot.querySelector(
      ".secondary-text-underlined"
    );

    expect(secBtnElement.textContent).to.equal(secondaryAction.title);

    setTimeout(() => {
      secBtnElement.click();
    });
    const event = await oneEvent(element, "secondary-action-clicked");

    expect(event.type).to.equal("secondary-action-clicked");

    if (secondaryAction.closeDialog) {
      expect(menuElement.getAttributeNames()).not.to.include("open");
    } else {
      expect(menuElement.getAttributeNames()).to.include("open");
    }
  });

  it("checks the empty state msg and action properties",async()=>{

    const AvatarGroupButton = element.shadowRoot.querySelector(".group");
    const menuElement = element.shadowRoot.querySelector("#menu");

    setTimeout(() => {
      AvatarGroupButton.click();
    });
    const {} = await oneEvent(AvatarGroupButton, "click");
    expect(menuElement.getAttributeNames()).to.include("open");

    const searchBarElement = element.shadowRoot.querySelector("#searchBar");
    searchBarElement.value= "hashText";
    element.searchInputValueChanged(searchBarElement.value);
    await element.elementUpdated;
    
    const emptyActionDiv = element.shadowRoot.querySelector("div.list-item");
    expect(emptyActionDiv.querySelector("span").textContent).to.equal(emptyStateMessage);
    
    const emptyActionButton = emptyActionDiv.querySelector("paper-button")
    expect(emptyActionButton.textContent).to.equal(emptyStateAction.title);
   
    setTimeout(() => {
      emptyActionButton.click();
    });
    const event = await oneEvent(element, "empty-state-action-clicked");
    expect(event.type).to.equal("empty-state-action-clicked");

    if (emptyStateAction.closeDialog) {
      expect(menuElement.getAttributeNames()).not.to.include("open");
    } else {
      expect(menuElement.getAttributeNames()).to.include("open");
    } 
  })
});
