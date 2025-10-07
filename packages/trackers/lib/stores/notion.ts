import { ExtendedRecordMap } from "notion-types";
import { getSelectorForShadowRootJsPath } from "../utils";
import { IEvent } from "../interfaces/index.js";
import { parsePageId } from "notion-utils";
import { TStoreContext } from "./index.js";

export async function fetchEventsFromNotionDatabase(context: TStoreContext["notion-database"]) {
  if (!context.pageId) {
    console.warn("Notion-Store | Missing page-id parameter");
    return;
  }

  const notionPage: ExtendedRecordMap = await fetch(context.url)
    .then((res) => res.json())
    .catch((err) => console.log(err));

  if (!notionPage) return;
  const pageId = parsePageId(context.pageId);

  const core = notionPage.block[pageId];

  const collectionId = core.value.type === "collection_view_page" ? core.value.collection_id : null;

  if (!collectionId) return;

  const databaseProperties = notionPage.collection[collectionId].value.schema;
  if (!databaseProperties) return;

  const parsedEvents: IEvent[] = [];

  Object.values(notionPage.block).forEach(block => {
    if (block.role === "none") return;

    const pageProperties = block.value?.properties;

    if (block.value?.type !== "page" || !pageProperties) return;

    const result: IEvent = { jsPath: "" };

    Object.entries(pageProperties).forEach(([property, value]) => {
      const key = databaseProperties[property].name as keyof IEvent;

      if (Array.isArray(value)) value = value.toString();
      if (key === "jsPath") value = getSelectorForShadowRootJsPath(value as string);

      result[key] = value as string;
    });

    if (!Boolean(result.location)) result.location = "/";

    parsedEvents.push(result);
  });

  return parsedEvents;
}

export async function fetchEventsFromNotionTable(context: TStoreContext["notion-table"]) {
  if (!context.pageId) {
    console.warn("Notion-Store | Missing page-id parameter");
    return;
  }

  const notionPage: ExtendedRecordMap = await fetch(context.url)
    .then((res) => res.json())
    .catch((err) => {
      console.error("Notion-Store | Failed to fetch notion page", err);
      return null;
    });

  if (!notionPage) return;

  const blocks = notionPage.block;
  if (!blocks) {
    console.warn("Notion-Store | No blocks found in page JSON");
    return;
  }

  const parsedRows: IEvent[] = [];

  Object.values(blocks).forEach((block: any) => {
    const value = block.value;
    if (!value || value.type !== "table") return;

    const rowIds = value.content || [];
    const rows = rowIds
      .map((id: string) => blocks[id]?.value)
      .filter(Boolean);

    if (rows.length === 0) return;

    // First row defines headers
    const headerRow = rows[0];
    const headerMap: Record<string, string> = {};

    Object.entries(headerRow.properties || {}).forEach(([colKey, colVal]) => {
      const header = Array.isArray(colVal) ? colVal[0]?.[0] : null;
      if (header) headerMap[colKey] = header;
    });

    // Remaining rows → data
    rows.slice(1).forEach((row: any) => {
      const properties = row.properties || {};
      const record: IEvent = { jsPath: "" };

      Object.entries(properties).forEach(([colKey, colVal]) => {
        const key = headerMap[colKey] as keyof IEvent;
        if (!key) return;

        let value = Array.isArray(colVal) ? colVal[0]?.[0] : "";
        if (key === "jsPath") {
          value = getSelectorForShadowRootJsPath(value);
        }

        record[key] = value;
      });

      if (!Boolean(record.location)) record.location = "/";

      parsedRows.push(record);
    });
  });

  return parsedRows;
}
