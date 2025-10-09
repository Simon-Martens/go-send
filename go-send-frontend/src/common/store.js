import { createStore } from "solid-js/store";
import Archive from "./archive";

export const [state, setState] = createStore({
  LIMITS: {},
  DEFAULTS: {},
  WEB_UI: {},
  PREFS: {},

  archive: null,
  capabilities: null,
  translate: (key) => key,
  transfer: null,
  fileInfo: null,
  locale: "en-US",
});

setState(
  "archive",
  new Archive([], state.DEFAULTS.EXPIRE_SECONDS, state.DEFAULTS.DOWNLOADS),
);
