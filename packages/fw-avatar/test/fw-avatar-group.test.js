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
let usersWoSecndryAttr = [
  { name: "Richard" },
  { name: "Dinesh" },
  { name: "Jared" },
  { name: "Gavin Belson" },
  { name: "Monica Hall" },
];

let pAction = {
  title: "Primary action Button",
  icon: "->",
};
let sAction = {
  title: "Secondary action button",
  closeDialog: true,
};
let emptyStateActionObj = {
  title: "Empty State action button",
  closeDialog: true,
};
let maxCount = 3;
let emptyStatemsg = "No Match Found";
let header = "Sillicon Valley";
let nameAttr = "name";
let secondaryAttr = "company";
let showSearchBar = true;

describe("Fw-Avatar-Group Tests", async () => {
  let ele;
  beforeEach(async () => {
    ele = await fixture(html` <fw-avatar-group
      .items=${users}
      nameAttribute=${nameAttr}
      secondaryAttribute=${secondaryAttr}
      .maxCount=${maxCount}
      header=${header}
      .showSearchBar=${showSearchBar}
      .primaryAction=${pAction}
      .secondaryAction=${sAction}
      emptyStateMessage=${emptyStatemsg}
      .emptyStateAction=${emptyStateActionObj}
      .absolute=${true}
    ></fw-avatar-group>`);
  });

  it("FwAvatarGroup instance check", () => {
    assert.instanceOf(
      ele,
      FwAvatarGroup,
      " The Element created from tag fw-avatar-group is not an instance of FWAvatarGroup class\n"
    );
  });

  it("checks for items(with secondary attr) content", async () => {
    const renderedHtml = ele.shadowRoot.querySelectorAll(
      "mwc-list-item.items-list-item > span"
    );

    let tempArray = Array();
    for (let i = 0; i < renderedHtml.length; i = i + 2) {
      tempArray.push({
        name: String(renderedHtml[i].textContent.trim()),
        company: String(renderedHtml[i + 1].textContent.trim()),
      });
    }
    expect(ele.items).to.equal(users);
    expect(tempArray).to.be.eql(users);
  });

  it("checks for items(without secondary attr) content", async () => {
    ele.items = usersWoSecndryAttr;
    ele.removeAttribute("secondaryattribute");
    await ele.elementUpdated;

    const renderedHtml = ele.shadowRoot.querySelectorAll(
      "mwc-list-item.items-list-item > span"
    );

    let tempArray = Array();
    for (let i = 0; i < renderedHtml.length; i = i + 1) {
      tempArray.push({
        name: String(renderedHtml[i].textContent.trim()),
      });
    }
    expect(ele.items).to.equal(usersWoSecndryAttr);
    expect(tempArray).to.be.eql(usersWoSecndryAttr);
  });

  it("checks Max Count property", async () => {
    const visibleAvatars = ele.shadowRoot
      .querySelector("#group")
      .querySelectorAll("fw-avatar[type='initials']");
    expect(ele.maxCount).to.equal(maxCount);
    expect(visibleAvatars.length).to.equal(
      Math.min(users.length, maxCount),
      "The number of avatars rendered in the group do not match with MaxCount\n"
    );
  });

  it("checks menu visiblility on tap/Click event", async () => {
    expect(
      ele.shadowRoot.querySelector("#menu").getAttributeNames()
    ).not.to.include("open", "Menu in open mode without Click event \n");

    const divBtn = ele.shadowRoot.querySelector(".group");

    setTimeout(() => {
      divBtn.click();
    });
    const {} = await oneEvent(divBtn, "click");

    expect(
      ele.shadowRoot.querySelector("#menu").getAttributeNames()
    ).to.include("open", "Click even didn't triggered the menu to  open \n");
  });

  it("checks Header property", async () => {
    const htmlText = ele.shadowRoot
      .querySelector(".dialog-header-span")
      .textContent.trim();

    expect(ele.header).to.equal(header);
    expect(htmlText).to.be.oneOf(
      [header, "Members"],
      "Header render do not match with given prop\n"
    );
  });

  it("checks for searchBar visibility", async () => {
    const searchBarEle = ele.shadowRoot.querySelector("#searchBar");

    if (!showSearchBar)
      expect(
        searchBarEle,
        "Search Bar visible , even when false passed to showSearchBar\n"
      ).to.be.null;
    else
      expect(
        searchBarEle,
        "Search Bar not visible when true passed to showSearchBar\n"
      ).not.to.be.null;
  });

  it("checks for primary action property", async () => {
    const primaryBtnItem = ele.shadowRoot.querySelector("#primary-action-item");

    expect(primaryBtnItem.querySelector("span").textContent).to.equal(
      pAction["title"]
    );
    expect(primaryBtnItem.querySelector("mwc-icon")).dom.to.equal(
      `
    <mwc-icon>${pAction["icon"]}</mwc-icon>`,
      { ignoreAttributes: ["slot"] }
    );

    setTimeout(() => {
      primaryBtnItem.click();
    });
    const event = await oneEvent(ele, "primary-action-clicked");
    expect(event.type).to.equal("primary-action-clicked");
    
  });

  it("checks for secondary action property", async () => {
    const divBtn = ele.shadowRoot.querySelector(".group");
    const menuEle = ele.shadowRoot.querySelector("#menu");

    setTimeout(() => {
      divBtn.click();
    });
    const {} = await oneEvent(divBtn, "click");

    expect(menuEle.getAttributeNames()).to.include("open");

    const secBtnEle = ele.shadowRoot.querySelector(
      ".secondary-text-underlined"
    );

    expect(secBtnEle.textContent).to.equal(sAction.title);

    setTimeout(() => {
      secBtnEle.click();
    });
    const event = await oneEvent(ele, "secondary-action-clicked");

    expect(event.type).to.equal("secondary-action-clicked");

    if (sAction.closeDialog) {
      expect(menuEle.getAttributeNames()).not.to.include("open");
    } else {
      expect(menuEle.getAttributeNames()).to.include("open");
    }
  });

  it("checks the empty state msg and action properties",async()=>{

    const divBtn = ele.shadowRoot.querySelector(".group");
    const menuEle = ele.shadowRoot.querySelector("#menu");

    setTimeout(() => {
      divBtn.click();
    });
    const {} = await oneEvent(divBtn, "click");
    expect(menuEle.getAttributeNames()).to.include("open");

    const searchBarEle = ele.shadowRoot.querySelector("#searchBar");
    searchBarEle.value= "hashText";
    ele.searchInputValueChanged(searchBarEle.value);
    await ele.elementUpdated;
    
    const emptyActionDiv = ele.shadowRoot.querySelector("div.list-item");
    expect(emptyActionDiv.querySelector("span").textContent).to.equal(emptyStatemsg);
    
    const emptyActionBtn =emptyActionDiv.querySelector("paper-button")
    expect(emptyActionBtn.textContent).to.equal(emptyStateActionObj.title);
   
    setTimeout(() => {
      emptyActionBtn.click();
    });
    const event = await oneEvent(ele, "empty-state-action-clicked");
    expect(event.type).to.equal("empty-state-action-clicked");

    if (emptyStateActionObj.closeDialog) {
      expect(menuEle.getAttributeNames()).not.to.include("open");
    } else {
      expect(menuEle.getAttributeNames()).to.include("open");
    } 
  })
});
