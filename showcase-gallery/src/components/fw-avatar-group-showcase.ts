import { html } from "lit";
import "@fw-components/fw-avatar";

const users = [
  { name: "Richard", company: "PiedPiper" },
  { name: "Dinesh", company: "PiedPiper" },
  { name: "Jared", company: "PiedPiper" },
  { name: "Gavin Belson", company: "Hooli" },
  { name: "Monica Hall", company: "Bream Hall" },
];

const usersWithOutSecondaryAttribute = [
  { name: "Richard" },
  { name: "Dinesh" },
  { name: "Jared" },
  { name: "Gavin Belson" },
  { name: "Monica Hall" },
];

const primaryAction = {
  title: "Primary action Button",
  icon: "add",
};

const secondaryAction = {
  title: "Secondary action button",
  closeDialog: true,
};

const emptyStateAction = {
  title: "Empty State action button",
  closeDialog: true,
};

const maxCount = 3;
const emptyStateMessage = "No Match Found";
const header = "Sillicon Valley";
const nameAttribute = "name";
const secondaryAttribute = "company";
const showSearchBar = true;

export let fwAvatarGroupShowcase = html`<fw-avatar-group
  .absolute=${true}
  .emptyStateAction=${emptyStateAction}
  .items=${users}
  .maxCount=${maxCount}
  .primaryAction=${primaryAction}
  .secondaryAction=${secondaryAction}
  .showSearchBar=${showSearchBar}
  nameAttribute=${nameAttribute}
  secondaryAttribute=${secondaryAttribute}
  header=${header}
  emptyStateMessage=${emptyStateMessage}
></fw-avatar-group>`;
