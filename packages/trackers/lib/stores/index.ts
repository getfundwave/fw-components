import { TrackerContext } from "../interfaces/index.js";
import { fetchEventsFromNotionDatabase, fetchEventsFromNotionTable } from "./notion.js";

export type TStoreContext = {
  notion: {
    url: string,
    pageId: string;
    authToken?: string;
  };
  "notion-table": {
    url: string,
    pageId: string;
    authToken?: string;
  };
  "notion-database": {
    url: string,
    pageId: string;
    authToken?: string;
  };
};

export const supportedStores = ["notion", "notion-database", "notion-table"] as const;

export async function fetchEvents(store: TrackerContext["store"]) {
  if (!store) return console.warn("Store configuration missing");
  
  const { context } = store;

  switch (store.type) {
    case "notion":
    case "notion-database":
      if (!Boolean(context.url)) throw new Error("Missing url to retrieve events from!");
      return fetchEventsFromNotionDatabase(context);
    case "notion-table":
      if (!Boolean(context.url)) throw new Error("Missing url to retrieve events from!");
      return fetchEventsFromNotionTable(context);
  }
}
