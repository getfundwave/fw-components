import "../src/fw-avatar";
import { FwAvatar } from "../src/fw-avatar";

import {
  fixture,
  html,
  expect,
  assert,
  fixtureCleanup,
} from "@open-wc/testing";

describe("Fw-Avatar Tests", async () => {
  let ele;
  beforeEach(async () => {
    ele = await fixture(
      html`<fw-avatar
        name="Richard Hendrickson"
        title="CEO"
        type="initials"
        color="red"
      ></fw-avatar>`
    );
  });

  it("FwAvatar instance check", () => {
    assert.instanceOf(ele, FwAvatar);
  });

  it("checking title property", async () => {
    expect(ele.title).to.equal("CEO");
    expect(
      ele.shadowRoot.querySelector(".avatar").getAttribute("title")
    ).to.equal("CEO");
  });

  it("checking type property", async () => {
    expect(ele.type).to.equal("initials");
    expect(ele.shadowRoot.querySelector(".avatar")).to.have.trimmed.text("RH");
    expect(ele.shadowRoot.querySelector(".avatar")).not.to.have.trimmed.text(
      "Richard Hendrickson"
    );
  });

  it("checking color property", async () => {
    expect(ele.color).to.equal("red");
    expect(ele.shadowRoot.querySelector(".avatar").style.background).to.equal(
      "red"
    );
  });

  it("checking name property", async () => {
    ele.removeAttribute("type");
    await ele.elementUpdated;

    expect(ele.shadowRoot.querySelector(".avatar")).to.have.trimmed.text(
      "Richard Hendrickson"
    );
    expect(ele.shadowRoot.querySelector(".avatar")).not.to.have.trimmed.text(
      "RH"
    );
  });

  it("checking Image Source property", async () => {
    let imgUrl =
      "https://img.favpng.com/17/0/0/thor-superhero-icon-png-favpng-LeMG9gL7C2w6Zn569zHSHzFrW.jpg";
    const el = await fixture(
      html`<fw-avatar
        name="Richard Hendrickson"
        type="image"
        imgSrc=${imgUrl}
      ></fw-avatar>`
    );

    expect(el.shadowRoot.querySelector(".avatar").style.background).to.equal(
      `url("${imgUrl}")`
    );
  });
  fixtureCleanup();
});
