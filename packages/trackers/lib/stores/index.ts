import { TrackerContext } from "../interfaces/index.js";
import { fetchEventsFromNotion } from "./notion.js";

export type TStoreContext = {
  notion: {
    url: string,
    pageId: string;
    authToken?: string;
  };
};

export const supportedStores = ["notion"] as const;

export async function fetchEvents(store: TrackerContext["store"]) {
  if (!store) return console.warn("Store configuration missing");

  switch (store.type) {
    case "notion":
      const { context } = store;
      if (!Boolean(context.url)) throw new Error("Missing url to retrieve events from!");
      return fetchEventsFromNotion(context);
  }
}
