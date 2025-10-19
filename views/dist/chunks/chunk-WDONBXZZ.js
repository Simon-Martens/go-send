import {
  Keychain,
  OwnedFile,
  storage_default
} from "./chunk-FZGJLVBJ.js";
import {
  arrayToB64,
  b64ToArray
} from "./chunk-6DFT5NXM.js";

// src/syncFiles.mjs
async function syncOwnedFiles(userSecrets, options = {}) {
  const { clearFirst = false } = options;
  if (!userSecrets) {
    console.warn("[syncFiles] No user secrets provided, skipping sync");
    return;
  }
  try {
    const response = await fetch("/api/me/files", {
      method: "GET",
      headers: {
        "Accept": "application/json"
      },
      credentials: "same-origin"
    });
    if (!response.ok) {
      console.warn("[syncFiles] Failed to fetch owned files", response.status);
      return;
    }
    const payload = await response.json();
    const files = Array.isArray(payload == null ? void 0 : payload.files) ? payload.files : [];
    if (clearFirst) {
      storage_default.clearLocalFiles();
    }
    const existingFileIds = clearFirst ? /* @__PURE__ */ new Set() : new Set(
      storage_default.files.map((f) => f.id).filter((id) => id)
    );
    let addedCount = 0;
    let skippedCount = 0;
    for (const file of files) {
      try {
        if (existingFileIds.has(file.id)) {
          skippedCount++;
          continue;
        }
        const secretBytes = await userSecrets.unwrapSecret({
          ciphertext: file.secret_ciphertext,
          nonce: file.secret_nonce,
          ephemeralPublicKey: file.secret_ephemeral_pub,
          version: file.secret_version
        });
        try {
          const secretB64 = arrayToB64(secretBytes);
          const keychain = new Keychain(secretB64, file.nonce);
          const metadataBytes = b64ToArray(file.metadata);
          const metadata = await keychain.decryptMetadata(metadataBytes);
          const ownedFile = new OwnedFile({
            id: file.id,
            url: `${window.location.origin}/download/${file.id}#${secretB64}`,
            name: metadata.name,
            size: metadata.size,
            manifest: metadata.manifest || {},
            time: 0,
            speed: metadata.size || 0,
            createdAt: file.created_at * 1e3,
            expiresAt: file.expires_at * 1e3,
            secretKey: secretB64,
            nonce: file.nonce,
            ownerToken: file.owner_token,
            dlimit: file.dl_limit,
            dtotal: file.dl_count,
            hasPassword: file.password,
            timeLimit: file.time_limit
          });
          storage_default.addFile(ownedFile);
          addedCount++;
        } finally {
          secretBytes.fill(0);
        }
      } catch (fileError) {
        console.warn("[syncFiles] Failed to restore file", fileError, file == null ? void 0 : file.id);
      }
    }
    if (addedCount > 0 || skippedCount > 0) {
      console.log(`[syncFiles] Sync complete: ${addedCount} added, ${skippedCount} already present`);
    }
  } catch (err) {
    console.warn("[syncFiles] Failed to sync owned files", err);
  }
}

export {
  syncOwnedFiles
};
//# sourceMappingURL=chunk-WDONBXZZ.js.map
