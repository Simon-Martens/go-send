import { version } from "../package.json";
import Keychain from "./keychain";
import { downloadStream } from "./api";
import { transformStream } from "./streams";
import Zip from "./zip";

// Content-Disposition header generator with ASCII fallback
function contentDisposition(filename) {
  // ASCII fallback for old browsers + modern UTF-8 encoding
  const asciiName = filename.replace(/[^\x20-\x7E]/g, '_');
  const encodedName = encodeURIComponent(filename);
  return `attachment; filename="${asciiName}"; filename*=UTF-8''${encodedName}`;
}

let noSave = false;
const map = new Map();
const IMAGES = /.*\.(png|svg|jpg)$/;
const VERSIONED_ASSET = /\.[A-Fa-f0-9]{8}\.(js|css|png|svg|jpg)(#\w+)?$/;
const DOWNLOAD_URL = /\/api\/download\/([A-Fa-f0-9]{4,})/;
const FONT = /\.woff2?$/;

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim()).then(precache);
});

async function decryptStream(id) {
  const file = map.get(id);
  if (!file) {
    console.error('[SW] File not found in map for id:', id);
    return new Response(null, { status: 400 });
  }
  console.log('[SW] Starting decryptStream for', id, 'with nonce:', file.nonce);
  try {
    let size = file.size;
    let type = file.type;
    const keychain = new Keychain(file.key, file.nonce);
    if (file.requiresPassword) {
      keychain.setPassword(file.password, file.url);
    }

    console.log('[SW] Calling downloadStream...');
    file.download = downloadStream(id, keychain);

    const body = await file.download.result;

    const decrypted = keychain.decryptStream(body);

    let zipStream = null;
    if (file.type === "send-archive") {
      const zip = new Zip(file.manifest, decrypted);
      zipStream = zip.stream;
      type = "application/zip";
      size = zip.size;
    }
    const responseStream = transformStream(
      zipStream || decrypted,
      {
        transform(chunk, controller) {
          file.progress += chunk.length;
          controller.enqueue(chunk);
        },
      },
      function oncancel() {
        // NOTE: cancel doesn't currently fire on chrome
        // https://bugs.chromium.org/p/chromium/issues/detail?id=638494
        file.download.cancel();
        map.delete(id);
      },
    );

    const headers = {
      "Content-Disposition": contentDisposition(file.filename),
      "Content-Type": type,
      "Content-Length": size,
    };
    console.log('[SW] Returning decrypted stream response');
    return new Response(responseStream, { headers });
  } catch (e) {
    console.error('[SW] Error in decryptStream:', e, 'noSave:', noSave);
    if (noSave) {
      return new Response(null, { status: e.message });
    }

    console.log('[SW] Redirecting to download page');
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/download/${id}#${file.key}`,
      },
    });
  }
}

async function precache() {
  try {
    await cleanCache();
    const cache = await caches.open(version);
    const images = assets.match(IMAGES);
    await cache.addAll(images);
  } catch (e) {
    console.error(e);
  }
}

async function cleanCache() {
  const oldCaches = await caches.keys();
  for (const c of oldCaches) {
    if (c !== version) {
      await caches.delete(c);
    }
  }
}

function cacheable(url) {
  return VERSIONED_ASSET.test(url) || FONT.test(url);
}

async function cachedOrFetched(req) {
  const cache = await caches.open(version);
  const cached = await cache.match(req);
  if (cached) {
    return cached;
  }
  const fetched = await fetch(req);
  if (fetched.ok && cacheable(req.url)) {
    cache.put(req, fetched.clone());
  }
  return fetched;
}

self.onfetch = (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const dlmatch = DOWNLOAD_URL.exec(url.pathname);
  if (dlmatch) {
    console.log('[SW] Intercepted download request for:', dlmatch[1]);
    event.respondWith(decryptStream(dlmatch[1]));
  } else if (cacheable(url.pathname)) {
    event.respondWith(cachedOrFetched(req));
  }
};

self.onmessage = (event) => {
  if (event.data.request === "init") {
    console.log('[SW] Received init message for', event.data.id, 'nonce:', event.data.nonce);
    noSave = event.data.noSave;
    const info = {
      key: event.data.key,
      nonce: event.data.nonce,
      filename: event.data.filename,
      requiresPassword: event.data.requiresPassword,
      password: event.data.password,
      url: event.data.url,
      type: event.data.type,
      manifest: event.data.manifest,
      size: event.data.size,
      progress: 0,
    };
    map.set(event.data.id, info);
    console.log('[SW] File info stored in map');

    event.ports[0].postMessage("file info received");
  } else if (event.data.request === "progress") {
    const file = map.get(event.data.id);
    if (!file) {
      event.ports[0].postMessage({ error: "cancelled" });
    } else {
      if (file.progress === file.size) {
        map.delete(event.data.id);
      }
      event.ports[0].postMessage({ progress: file.progress });
    }
  } else if (event.data.request === "cancel") {
    const file = map.get(event.data.id);
    if (file) {
      if (file.download) {
        file.download.cancel();
      }
      map.delete(event.data.id);
    }
    event.ports[0].postMessage("download cancelled");
  }
};
