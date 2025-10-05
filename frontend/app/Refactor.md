• You can absolutely scrap user.js now that every FXA flow is gone. Here’s
  what the removal looks like:

  - main.js — Drop the import User from "./user" and don’t add a user field
    to window.initialState. The rest of the app will read limits directly from
    LIMITS and call storage helpers.
  - controller.js — Remove all account-specific listeners (login, logout,
    authenticate, signup-cta) and the signupDialog / surveyDialog imports.
    Replace every state.user.syncFileList() with state.storage.merge(),
    swap state.user.maxSize for state.LIMITS.MAX_FILE_SIZE, and delete
    the state.user.refresh() retry branch. The survey close handler can go
    entirely since we’re dropping the surveyed flag.
  - fileSender.js & api.js — Make uploads bearer-agnostic: remove the
    bearerToken argument from sender.upload(...), only include fileMeta.bearer
    when you actually have one (which is now never), and adjust uploadWs/
    upload signatures accordingly.
  - ownedFile.js — Simplify changeLimit(dlimit) so it no longer expects a user
    object; just pass undefined for the bearer token when calling setParams.
  - storage.js — Delete the user getter/setter and any lingering survey/
    device helpers (firstAction, surveyed, device_id remain fine if you still
    want them; if not, remove those keys too). storage.merge() already works
    without remote lists, so nothing else needs to change.
  - UI components
      - ui/archiveTile.js, ui/expiryOptions.js — Swap each state.user.max*
        reference for the relevant state.LIMITS constant and strip the upsell
        button that referenced state.user.loggedIn.
      - ui/downloadCompleted.js, ui/notFound.js, ui/error.js — Remove the
        state.user.loggedIn branches; just show the anonymous copy deck.
      - Delete ui/signupDialog.js (and the import) completely. If you’re
        abandoning surveys too, drop the surveyDialog import and never open
        it.
  - capabilities.js — Hard-code account to false (or base it on another
    feature flag) so the UI never acts like accounts are available.
  - Finally, remove the obsolete files (user.js, fxa.js, ui/signupDialog.js)
    plus their unit tests or localization strings if they exist.

  After this sweep, the only “user state” left is what’s already in storage
  (local uploads, device usage counters, etc.). Limits come straight from
  LIMITS, and syncing becomes await state.storage.merge() wherever you
  previously called user.syncFileList(). The app still hashes a device id if
  you keep storage.id; if you don’t want that either, delete the getter and
  replace the telemetry helpers with undefined.

  Once you finish the edits, run the usual build/test command (e.g., npm run
  build) to confirm nothing still references the removed module.
