import { arrayToB64, b64ToArray, delay } from "./utils-worker";
import { ECE_RECORD_SIZE } from "./crypto/ece.mjs";

let fileProtocolWssUrl = null;

try {
  fileProtocolWssUrl = localStorage.getItem("wssURL");
} catch (e) {
  // NOOP
}

if (!fileProtocolWssUrl) {
  fileProtocolWssUrl = "wss://send.firefox.com/api/ws";
}

export class ConnectionError extends Error {
  constructor(cancelled, duration, size) {
    super(cancelled ? "0" : "connection closed");
    this.cancelled = cancelled;
    this.duration = duration;
    this.size = size;
  }
}

export function setFileProtocolWssUrl(url) {
  localStorage && localStorage.setItem("wssURL", url);
  fileProtocolWssUrl = url;
}

export function getFileProtocolWssUrl() {
  return fileProtocolWssUrl;
}

let apiUrlPrefix = "";
export function getApiUrl(path) {
  return apiUrlPrefix + path;
}

export function setApiUrlPrefix(prefix) {
  apiUrlPrefix = prefix;
}

function post(obj) {
  const h = {
    "Content-Type": "application/json",
  };
  return {
    method: "POST",
    headers: new Headers(h),
    body: JSON.stringify(obj),
  };
}

export function parseNonce(header) {
  header = header || "";
  return header.split(" ")[1];
}

async function fetchWithAuth(url, params, keychain) {
  const result = {};
  params = params || {};
  const h = await keychain.authHeader();
  params.headers = new Headers({
    Authorization: h,
    "Content-Type": "application/json",
  });
  const response = await fetch(url, params);
  result.response = response;
  result.ok = response.ok;
  const nonce = parseNonce(response.headers.get("WWW-Authenticate"));
  result.shouldRetry = response.status === 401 && nonce !== keychain.nonce;
  keychain.nonce = nonce;
  return result;
}

async function fetchWithAuthAndRetry(url, params, keychain) {
  const result = await fetchWithAuth(url, params, keychain);
  if (result.shouldRetry) {
    return fetchWithAuth(url, params, keychain);
  }
  return result;
}

export async function del(id, owner_token) {
  const response = await fetch(
    getApiUrl(`/api/delete/${id}`),
    post({ owner_token }),
  );
  return response.ok;
}

export async function setParams(id, owner_token, params) {
  const response = await fetch(
    getApiUrl(`/api/params/${id}`),
    post({
      owner_token,
      dlimit: params.dlimit,
    }),
  );
  return response.ok;
}

export async function fileInfo(id, owner_token) {
  const response = await fetch(
    getApiUrl(`/api/info/${id}`),
    post({ owner_token }),
  );

  if (response.ok) {
    const obj = await response.json();
    return obj;
  }

  throw new Error(response.status);
}

export async function metadata(id, keychain) {
  const result = await fetchWithAuthAndRetry(
    getApiUrl(`/api/metadata/${id}`),
    { method: "GET" },
    keychain,
  );
  if (result.ok) {
    const data = await result.response.json();
    const meta = await keychain.decryptMetadata(b64ToArray(data.metadata));
    return {
      size: meta.size,
      ttl: data.ttl,
      iv: meta.iv,
      name: meta.name,
      type: meta.type,
      manifest: meta.manifest,
    };
  }
  throw new Error(result.response.status);
}

export async function setPassword(id, owner_token, keychain) {
  const auth = await keychain.authKeyB64();
  const response = await fetch(
    getApiUrl(`/api/password/${id}`),
    post({ owner_token, auth }),
  );
  return response.ok;
}

function asyncInitWebSocket(server, timeout = 10000) {
  return new Promise((resolve, reject) => {
    try {
      const ws = new WebSocket(server);
      const timeoutId = setTimeout(() => {
        ws.close();
        reject(new Error("WebSocket connection timeout"));
      }, timeout);

      ws.addEventListener(
        "open",
        () => {
          clearTimeout(timeoutId);
          resolve(ws);
        },
        { once: true },
      );

      ws.addEventListener(
        "error",
        (e) => {
          clearTimeout(timeoutId);
          reject(new ConnectionError(false));
        },
        { once: true },
      );
    } catch (e) {
      reject(new ConnectionError(false));
    }
  });
}

function listenForResponse(ws, canceller) {
  return new Promise((resolve, reject) => {
    function handleClose(event) {
      // a 'close' event before a 'message' event means the request failed
      ws.removeEventListener("message", handleMessage);
      reject(new ConnectionError(canceller.cancelled));
    }
    function handleMessage(msg) {
      ws.removeEventListener("close", handleClose);
      try {
        const response = JSON.parse(msg.data);
        if (response.error) {
          throw new Error(response.error);
        } else {
          resolve(response);
        }
      } catch (e) {
        reject(e);
      }
    }
    ws.addEventListener("message", handleMessage, { once: true });
    ws.addEventListener("close", handleClose, { once: true });
  });
}

async function upload(
  stream,
  metadata,
  verifierB64,
  timeLimit,
  dlimit,
  onprogress,
  canceller,
  ownerWrap,
  recipientWrap,
) {
  let size = 0;
  const start = Date.now();
  const host = window.location.hostname;
  const port = window.location.port;
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const endpoint =
    window.location.protocol === "file:"
      ? fileProtocolWssUrl
      : `${protocol}//${host}${port ? ":" : ""}${port}/api/ws`;

  // Retry WebSocket connection with exponential backoff
  let ws;
  let lastError;
  const maxRetries = 3;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    if (canceller.cancelled) {
      throw new ConnectionError(true);
    }

    try {
      ws = await asyncInitWebSocket(endpoint);
      break; // Success
    } catch (e) {
      lastError = e;
      if (attempt < maxRetries - 1) {
        // Exponential backoff: 500ms, 1000ms, 2000ms
        const backoffMs = 500 * Math.pow(2, attempt);
        await delay(backoffMs);
      }
    }
  }

  if (!ws) {
    throw lastError || new ConnectionError(false);
  }

  try {
    const metadataHeader = arrayToB64(new Uint8Array(metadata));
    const fileMeta = {
      fileMetadata: metadataHeader,
      authorization: `send-v1 ${verifierB64}`,
      timeLimit,
      dlimit,
    };
    if (
      ownerWrap &&
      ownerWrap.ciphertext &&
      ownerWrap.nonce &&
      ownerWrap.ephemeralPublicKey
    ) {
      fileMeta.ownerSecretCiphertext = ownerWrap.ciphertext;
      fileMeta.ownerSecretNonce = ownerWrap.nonce;
      fileMeta.ownerSecretEphemeralPub = ownerWrap.ephemeralPublicKey;
      if (ownerWrap.version != null) {
        fileMeta.ownerSecretVersion = ownerWrap.version;
      }
    }
    // Add recipient encryption data (optional - file encrypted FOR a specific user)
    if (
      recipientWrap &&
      recipientWrap.userId &&
      recipientWrap.ciphertext &&
      recipientWrap.nonce &&
      recipientWrap.ephemeralPublicKey
    ) {
      fileMeta.recipientUserId = recipientWrap.userId;
      fileMeta.recipientSecretCiphertext = recipientWrap.ciphertext;
      fileMeta.recipientSecretNonce = recipientWrap.nonce;
      fileMeta.recipientSecretEphemeralPub = recipientWrap.ephemeralPublicKey;
      if (recipientWrap.version != null) {
        fileMeta.recipientSecretVersion = recipientWrap.version;
      }
    }
    const uploadInfoResponse = listenForResponse(ws, canceller);
    ws.send(JSON.stringify(fileMeta));
    const uploadInfo = await uploadInfoResponse;

    const completedResponse = listenForResponse(ws, canceller);

    const reader = stream.getReader();
    let state = await reader.read();
    while (!state.done) {
      if (canceller.cancelled) {
        ws.close();
      }
      if (ws.readyState !== WebSocket.OPEN) {
        break;
      }
      const buf = state.value;
      ws.send(buf);
      onprogress(size);
      size += buf.length;
      state = await reader.read();
      while (
        ws.bufferedAmount > ECE_RECORD_SIZE * 2 &&
        ws.readyState === WebSocket.OPEN &&
        !canceller.cancelled
      ) {
        await delay();
      }
    }
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(new Uint8Array([0])); //EOF
    }

    await completedResponse;
    uploadInfo.duration = Date.now() - start;
    return uploadInfo;
  } catch (e) {
    e.size = size;
    e.duration = Date.now() - start;
    throw e;
  } finally {
    if (![WebSocket.CLOSED, WebSocket.CLOSING].includes(ws.readyState)) {
      ws.close();
    }
  }
}

export function uploadWs(
  encrypted,
  metadata,
  verifierB64,
  timeLimit,
  dlimit,
  onprogress,
  ownerWrap = null,
  recipientWrap = null,
) {
  const canceller = { cancelled: false };

  return {
    cancel: function () {
      canceller.cancelled = true;
    },

    result: upload(
      encrypted,
      metadata,
      verifierB64,
      timeLimit,
      dlimit,
      onprogress,
      canceller,
      ownerWrap,
      recipientWrap,
    ),
  };
}

////////////////////////

async function downloadS(id, keychain, signal) {
  const auth = await keychain.authHeader();

  const response = await fetch(getApiUrl(`/api/download/${id}`), {
    signal: signal,
    method: "GET",
    headers: { Authorization: auth },
  });

  const authHeader = response.headers.get("WWW-Authenticate");
  if (authHeader) {
    keychain.nonce = parseNonce(authHeader);
  }

  if (response.status !== 200) {
    throw new Error(response.status);
  }

  return response.body;
}

async function tryDownloadStream(id, keychain, signal, tries = 2) {
  try {
    const result = await downloadS(id, keychain, signal);
    return result;
  } catch (e) {
    if (e.message === "401" && --tries > 0) {
      return tryDownloadStream(id, keychain, signal, tries);
    }
    if (e.name === "AbortError") {
      throw new Error("0");
    }
    throw e;
  }
}

export function downloadStream(id, keychain) {
  const controller = new AbortController();
  function cancel() {
    controller.abort();
  }
  return {
    cancel,
    result: tryDownloadStream(id, keychain, controller.signal),
  };
}

//////////////////

async function download(id, keychain, onprogress, canceller) {
  const auth = await keychain.authHeader();
  const xhr = new XMLHttpRequest();
  canceller.oncancel = function () {
    xhr.abort();
  };
  return new Promise(function (resolve, reject) {
    xhr.addEventListener("loadend", function () {
      canceller.oncancel = function () {};
      const authHeader = xhr.getResponseHeader("WWW-Authenticate");
      if (authHeader) {
        keychain.nonce = parseNonce(authHeader);
      }
      if (xhr.status !== 200) {
        return reject(new Error(xhr.status));
      }

      const blob = new Blob([xhr.response]);
      resolve(blob);
    });

    xhr.addEventListener("progress", function (event) {
      if (event.target.status === 200) {
        onprogress(event.loaded);
      }
    });
    xhr.open("get", getApiUrl(`/api/download/blob/${id}`));
    xhr.setRequestHeader("Authorization", auth);
    xhr.responseType = "blob";
    xhr.send();
    onprogress(0);
  });
}

async function tryDownload(id, keychain, onprogress, canceller, tries = 2) {
  try {
    const result = await download(id, keychain, onprogress, canceller);
    return result;
  } catch (e) {
    if (e.message === "401" && --tries > 0) {
      return tryDownload(id, keychain, onprogress, canceller, tries);
    }
    throw e;
  }
}

export function downloadFile(id, keychain, onprogress) {
  const canceller = {
    oncancel: function () {}, // download() sets this
  };
  function cancel() {
    canceller.oncancel();
  }
  return {
    cancel,
    result: tryDownload(id, keychain, onprogress, canceller),
  };
}

export async function getFileList(bearerToken, kid) {
  const headers = new Headers({ Authorization: `Bearer ${bearerToken}` });
  const response = await fetch(getApiUrl(`/api/filelist/${kid}`), { headers });
  if (response.ok) {
    const encrypted = await response.blob();
    return encrypted;
  }
  throw new Error(response.status);
}

export async function setFileList(bearerToken, kid, data) {
  const headers = new Headers({ Authorization: `Bearer ${bearerToken}` });
  const response = await fetch(getApiUrl(`/api/filelist/${kid}`), {
    headers,
    method: "POST",
    body: data,
  });
  return response.ok;
}

export async function getConstants() {
  const response = await fetch(getApiUrl("/config"));

  if (response.ok) {
    const obj = await response.json();
    return obj;
  }

  throw new Error(response.status);
}

export async function fetchUsers() {
  const response = await fetch(getApiUrl("/api/users"));

  if (response.ok) {
    const data = await response.json();
    return data.users || [];
  }

  throw new Error(response.status);
}

export async function fetchInbox() {
  const response = await fetch(getApiUrl("/api/me/inbox"));

  if (response.ok) {
    const data = await response.json();
    return data.files || [];
  }

  throw new Error(response.status);
}

export async function fetchOutbox() {
  const response = await fetch(getApiUrl("/api/me/outbox"));

  if (response.ok) {
    const data = await response.json();
    return data.files || [];
  }

  throw new Error(response.status);
}

export async function fetchFileInfo(fileID) {
  const response = await fetch(getApiUrl(`/api/me/file-info/${fileID}`));

  if (response.ok) {
    const data = await response.json();
    return data;
  }

  throw new Error(response.status);
}
