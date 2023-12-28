import { getNodeTree, matchPathPattern } from "./utils/index.js";
import { fetchEvents } from "./stores/index.js";
import { IEvent, TrackerContext } from "./interfaces/index.js";

export class Trackers {
  observer: MutationObserver | null;
  track: TrackerContext["track"];
  events: IEvent[];
  store: TrackerContext["store"];
  debug: boolean;

  constructor(context: TrackerContext) {
    if (!Boolean(context.track)) throw new Error("Missing required `track` method!");

    this.store = context.store;
    this.observer = null;
    this.track = context.track;
    this.events = [];
    this.debug = Boolean(context.debug);
  }

  /**
   * Fetches events and starts registering observers to begin tracking
   * note: optionally can pass events, if not they'll be fetched from the store config
   * @param {IEvent[]} events (optional) - array of events to perform the tracking for
   **/
  async initialize(events?: IEvent[]) {
    if ((window as any).fwTrackersRegistered) return;

    if (!events?.length && !this.store) return console.error("Malformed configuration. Please provide store config or list of events");

    try {
      if (events?.length) this.events = events;
      else this.events = (await fetchEvents(this.store)) || [];

      if (!this.events) return this.#debug("No events fetched from store: ", this.store);

      this.#debug("Events fetch from store", { events: this.events, store: this.store });

      this.registerTrackers(this.events, this.track);
      this.observer = new MutationObserver(() => this.registerTrackers(this.events, this.track));
      this.observer.observe(document, { subtree: true, attributes: true, childList: true });

      (window as any).fwTrackersRegistered = true;
    } catch (error) {
      console.warn("Error while registering event-trackers", error);
    }
  }

  /**
   * identifies targets and attaches required listeners for tracking
   * @param {IEvent[]} events - list of event-configs
   * @param {function} track - tracker function provided by the user with supplied context
   **/
  registerTrackers(events: IEvent[], track: TrackerContext["track"]) {
    (events || []).forEach((eventConfig) => {
      if (!eventConfig.location) return;
      if (!matchPathPattern(location.pathname, eventConfig.location)) return;

      const tree = getNodeTree(eventConfig.jsPath, document);
      const element = tree.destination;
      this.#debug("Attempting registration of trackers @ ", { tree, config: eventConfig });

      if (!element) tree.shadowRoots.forEach((root) => this.observeNode(root));

      if (!element || !eventConfig.title) return;

      const trackerRegistered = Boolean(element.getAttribute("fw-events-registered"));
      this.#debug("Tracking status", { element, trackerRegistered });

      if (trackerRegistered) return;

      const eventsToTrack = (eventConfig.type || "").split(",").filter(Boolean) || [];
      if (!Boolean(eventsToTrack.length)) eventsToTrack.push("click");

      eventsToTrack.forEach((eventType: any) =>
        element.addEventListener(eventType, (event) => {
          try {
            if (!Boolean(this.track)) return this.#debug("Missing `track` method!");

            this.#debug("Event triggered: ", eventConfig, event);
            track(eventConfig.title!, element, event, eventConfig);
          } catch (error) {
            this.#debug("Failed to register events.", error);
          }
        })
      );

      element.setAttribute("fw-events-registered", "true");
      this.#debug("Tracker registered @ ", { element, eventConfig });
    });
  }

  /**
   * attaches mutation-observer to provided node
   * @param {ShadowRoot | null} node - ShadowRoot to attach the observer to
   */
  observeNode(node: ShadowRoot | null) {
    if (!Boolean(node)) return;

    try {
      this.observer?.observe(node!, { subtree: true, attributes: true, childList: true });
      this.#debug("Registering observer on target: ", node?.host || node);
    } catch (error) {
      this.#debug("Failed to register observer on target: ", { error, node: node!.host || node });
    }
  }

  /*
   * dumps logs to console when in debug mode
   */
  #debug(...params: any[]) {
    if (this.debug) console.log(...params);
  }
}
