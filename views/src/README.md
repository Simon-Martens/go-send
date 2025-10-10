- pasteManager.js: has a smart quard for route /


Things that are choo-specific, we must change:
- Routes: routing, we don't do that
- Modules: dragManager.js, pasteManager.js
- Controller as engine of the app uses emitters from choo
- api.js uses old ff URLs, need to be set at build time
