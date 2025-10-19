import {
  x25519
} from "./chunk-U2WOWVJN.js";
import {
  arrayToB64,
  b64ToArray,
  isFile
} from "./chunk-6LPP53TP.js";

// src/utils-worker.mjs
function arrayToB642(array) {
  let bin = "";
  const chunkSize = 32768;
  for (let i = 0; i < array.length; i += chunkSize) {
    bin += String.fromCharCode(...array.subarray(i, i + chunkSize));
  }
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64ToArray2(str) {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((str.length + 3) % 4);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function concatUint8Arrays(arrays) {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}
function readUint32BE(array, offset) {
  const view = new DataView(array.buffer, array.byteOffset, array.byteLength);
  return view.getUint32(offset, false);
}
function writeUint32BE(array, offset, value) {
  const view = new DataView(array.buffer, array.byteOffset, array.byteLength);
  view.setUint32(offset, value, false);
}
function readUint8(array, offset) {
  return array[offset];
}
function writeUint8(array, offset, value) {
  array[offset] = value;
}
function delay(delay2 = 100) {
  return new Promise((resolve) => setTimeout(resolve, delay2));
}
async function streamToArrayBuffer(stream, size) {
  const reader = stream.getReader();
  let state = await reader.read();
  if (size) {
    const result2 = new Uint8Array(size);
    let offset2 = 0;
    while (!state.done) {
      result2.set(state.value, offset2);
      offset2 += state.value.length;
      state = await reader.read();
    }
    return result2.buffer;
  }
  const parts = [];
  let len = 0;
  while (!state.done) {
    parts.push(state.value);
    len += state.value.length;
    state = await reader.read();
  }
  let offset = 0;
  const result = new Uint8Array(len);
  for (const part of parts) {
    result.set(part, offset);
    offset += part.length;
  }
  return result.buffer;
}

// src/streams.mjs
function transformStream(readable, transformer = {}, oncancel) {
  const reader = readable.getReader();
  const wrappedTransformer = transformer || {};
  return new ReadableStream({
    async start(controller) {
      if (wrappedTransformer.start) {
        await wrappedTransformer.start(controller);
      }
    },
    async pull(controller) {
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          if (wrappedTransformer.flush) {
            await wrappedTransformer.flush(controller);
          }
          reader.releaseLock();
          controller.close();
          return;
        }
        if (!wrappedTransformer.transform) {
          controller.enqueue(value);
          return;
        }
        let enqueued = false;
        const wrappedController = {
          enqueue(chunk) {
            enqueued = true;
            controller.enqueue(chunk);
          }
        };
        await wrappedTransformer.transform(value, wrappedController);
        if (enqueued) {
          return;
        }
      }
    },
    cancel(reason) {
      reader.cancel(reason);
      if (wrappedTransformer.cancel) {
        wrappedTransformer.cancel(reason);
      }
      if (oncancel) {
        oncancel(reason);
      }
    }
  });
}
var BlobStreamController = class {
  constructor(blob, size) {
    this.blob = blob;
    this.index = 0;
    this.chunkSize = size || 1024 * 64;
  }
  pull(controller) {
    return new Promise((resolve, reject) => {
      const bytesLeft = this.blob.size - this.index;
      if (bytesLeft <= 0) {
        controller.close();
        return resolve();
      }
      const size = Math.min(this.chunkSize, bytesLeft);
      const slice = this.blob.slice(this.index, this.index + size);
      const reader = new FileReader();
      reader.onload = () => {
        controller.enqueue(new Uint8Array(reader.result));
        resolve();
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(slice);
      this.index += size;
    });
  }
};
function blobStream(blob, size) {
  return new ReadableStream(new BlobStreamController(blob, size));
}
var ConcatStreamController = class {
  constructor(streams) {
    this.streams = streams;
    this.index = 0;
    this.reader = null;
    this.nextReader();
  }
  nextReader() {
    const next = this.streams[this.index++];
    this.reader = next && next.getReader();
  }
  async pull(controller) {
    if (!this.reader) {
      return controller.close();
    }
    const data = await this.reader.read();
    if (data.done) {
      this.nextReader();
      return this.pull(controller);
    }
    controller.enqueue(data.value);
  }
};
function concatStream(streams) {
  return new ReadableStream(new ConcatStreamController(streams));
}

// src/crypto/ece.mjs
var NONCE_LENGTH = 12;
var TAG_LENGTH = 16;
var KEY_LENGTH = 16;
var MODE_ENCRYPT = "encrypt";
var MODE_DECRYPT = "decrypt";
var ECE_RECORD_SIZE = 1024 * 64;
var encoder = new TextEncoder();
function generateSalt(len) {
  const randSalt = new Uint8Array(len);
  crypto.getRandomValues(randSalt);
  return randSalt.buffer;
}
var ECETransformer = class {
  constructor(mode, ikm, rs, salt) {
    this.mode = mode;
    this.prevChunk;
    this.seq = 0;
    this.firstchunk = true;
    this.rs = rs;
    this.ikm = ikm.buffer;
    this.salt = salt;
  }
  async generateKey() {
    const inputKey = await crypto.subtle.importKey(
      "raw",
      this.ikm,
      "HKDF",
      false,
      ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
      {
        name: "HKDF",
        salt: this.salt,
        info: encoder.encode("Content-Encoding: aes128gcm\0"),
        hash: "SHA-256"
      },
      inputKey,
      {
        name: "AES-GCM",
        length: 128
      },
      true,
      // Edge polyfill requires key to be extractable to encrypt :/
      ["encrypt", "decrypt"]
    );
  }
  async generateNonceBase() {
    const inputKey = await crypto.subtle.importKey(
      "raw",
      this.ikm,
      "HKDF",
      false,
      ["deriveKey"]
    );
    const base = await crypto.subtle.exportKey(
      "raw",
      await crypto.subtle.deriveKey(
        {
          name: "HKDF",
          salt: this.salt,
          info: encoder.encode("Content-Encoding: nonce\0"),
          hash: "SHA-256"
        },
        inputKey,
        {
          name: "AES-GCM",
          length: 128
        },
        true,
        ["encrypt", "decrypt"]
      )
    );
    return new Uint8Array(base.slice(0, NONCE_LENGTH));
  }
  generateNonce(seq) {
    if (seq > 4294967295) {
      throw new Error("record sequence number exceeds limit");
    }
    const nonce = new Uint8Array(this.nonceBase);
    const m = readUint32BE(nonce, nonce.length - 4);
    const xor = (m ^ seq) >>> 0;
    writeUint32BE(nonce, nonce.length - 4, xor);
    return nonce;
  }
  pad(data, isLast) {
    const len = data.length;
    if (len + TAG_LENGTH >= this.rs) {
      throw new Error("data too large for record size");
    }
    if (isLast) {
      const padding = new Uint8Array(1);
      padding[0] = 2;
      return concatUint8Arrays([data, padding]);
    } else {
      const padding = new Uint8Array(this.rs - len - TAG_LENGTH);
      padding[0] = 1;
      return concatUint8Arrays([data, padding]);
    }
  }
  unpad(data, isLast) {
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i]) {
        if (isLast) {
          if (data[i] !== 2) {
            throw new Error("delimiter of final record is not 2");
          }
        } else {
          if (data[i] !== 1) {
            throw new Error("delimiter of not final record is not 1");
          }
        }
        return data.slice(0, i);
      }
    }
    throw new Error("no delimiter found");
  }
  createHeader() {
    const nums = new Uint8Array(5);
    writeUint32BE(nums, 0, this.rs);
    writeUint8(nums, 4, 0);
    return concatUint8Arrays([new Uint8Array(this.salt), nums]);
  }
  readHeader(buffer) {
    if (buffer.length < 21) {
      throw new Error("chunk too small for reading header");
    }
    const header = {};
    header.salt = buffer.buffer.slice(0, KEY_LENGTH);
    header.rs = readUint32BE(buffer, KEY_LENGTH);
    const idlen = readUint8(buffer, KEY_LENGTH + 4);
    header.length = idlen + KEY_LENGTH + 5;
    return header;
  }
  async encryptRecord(buffer, seq, isLast) {
    const nonce = this.generateNonce(seq);
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: nonce },
      this.key,
      this.pad(buffer, isLast)
    );
    return new Uint8Array(encrypted);
  }
  async decryptRecord(buffer, seq, isLast) {
    const nonce = this.generateNonce(seq);
    const data = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: nonce,
        tagLength: 128
      },
      this.key,
      buffer
    );
    return this.unpad(new Uint8Array(data), isLast);
  }
  async start(controller) {
    if (this.mode === MODE_ENCRYPT) {
      this.key = await this.generateKey();
      this.nonceBase = await this.generateNonceBase();
      controller.enqueue(this.createHeader());
    } else if (this.mode !== MODE_DECRYPT) {
      throw new Error("mode must be either encrypt or decrypt");
    }
  }
  async transformPrevChunk(isLast, controller) {
    if (this.mode === MODE_ENCRYPT) {
      controller.enqueue(
        await this.encryptRecord(this.prevChunk, this.seq, isLast)
      );
      this.seq++;
    } else {
      if (this.seq === 0) {
        const header = this.readHeader(this.prevChunk);
        this.salt = header.salt;
        this.rs = header.rs;
        this.key = await this.generateKey();
        this.nonceBase = await this.generateNonceBase();
      } else {
        controller.enqueue(
          await this.decryptRecord(this.prevChunk, this.seq - 1, isLast)
        );
      }
      this.seq++;
    }
  }
  async transform(chunk, controller) {
    if (!this.firstchunk) {
      await this.transformPrevChunk(false, controller);
    }
    this.firstchunk = false;
    this.prevChunk = new Uint8Array(chunk.buffer);
  }
  async flush(controller) {
    if (this.prevChunk) {
      await this.transformPrevChunk(true, controller);
    }
  }
};
var StreamSlicer = class {
  constructor(rs, mode) {
    this.mode = mode;
    this.rs = rs;
    this.chunkSize = mode === MODE_ENCRYPT ? rs - 17 : 21;
    this.partialChunk = new Uint8Array(this.chunkSize);
    this.offset = 0;
  }
  send(buf, controller) {
    controller.enqueue(buf);
    if (this.chunkSize === 21 && this.mode === MODE_DECRYPT) {
      this.chunkSize = this.rs;
    }
    this.partialChunk = new Uint8Array(this.chunkSize);
    this.offset = 0;
  }
  //reslice input into record sized chunks
  transform(chunk, controller) {
    let i = 0;
    if (this.offset > 0) {
      const len = Math.min(chunk.byteLength, this.chunkSize - this.offset);
      this.partialChunk.set(chunk.slice(0, len), this.offset);
      this.offset += len;
      i += len;
      if (this.offset === this.chunkSize) {
        this.send(this.partialChunk, controller);
      }
    }
    while (i < chunk.byteLength) {
      const remainingBytes = chunk.byteLength - i;
      if (remainingBytes >= this.chunkSize) {
        const record = chunk.slice(i, i + this.chunkSize);
        i += this.chunkSize;
        this.send(record, controller);
      } else {
        const end = chunk.slice(i, i + remainingBytes);
        i += end.byteLength;
        this.partialChunk.set(end);
        this.offset = end.byteLength;
      }
    }
  }
  flush(controller) {
    if (this.offset > 0) {
      controller.enqueue(this.partialChunk.slice(0, this.offset));
    }
  }
};
function encryptStream(input, key, rs = ECE_RECORD_SIZE, salt = generateSalt(KEY_LENGTH)) {
  const mode = "encrypt";
  const inputStream = transformStream(input, new StreamSlicer(rs, mode));
  return transformStream(inputStream, new ECETransformer(mode, key, rs, salt));
}
function decryptStream(input, key, rs = ECE_RECORD_SIZE) {
  const mode = "decrypt";
  const inputStream = transformStream(input, new StreamSlicer(rs, mode));
  return transformStream(inputStream, new ECETransformer(mode, key, rs));
}

// src/keychain.mjs
var encoder2 = new TextEncoder();
var decoder = new TextDecoder();
var Keychain = class {
  constructor(secretKeyB64, nonce) {
    this._nonce = nonce || "yRCdyQ1EMSA3mo4rqSkuNQ==";
    if (secretKeyB64) {
      this.rawSecret = b64ToArray2(secretKeyB64);
    } else {
      this.rawSecret = crypto.getRandomValues(new Uint8Array(16));
    }
    this.secretKeyPromise = crypto.subtle.importKey(
      "raw",
      this.rawSecret,
      "HKDF",
      false,
      ["deriveKey"]
    );
    this.metaKeyPromise = this.secretKeyPromise.then(function(secretKey) {
      return crypto.subtle.deriveKey(
        {
          name: "HKDF",
          salt: new Uint8Array(),
          info: encoder2.encode("metadata"),
          hash: "SHA-256"
        },
        secretKey,
        {
          name: "AES-GCM",
          length: 128
        },
        false,
        ["encrypt", "decrypt"]
      );
    });
    this.authKeyPromise = this.secretKeyPromise.then(function(secretKey) {
      return crypto.subtle.deriveKey(
        {
          name: "HKDF",
          salt: new Uint8Array(),
          info: encoder2.encode("authentication"),
          hash: "SHA-256"
        },
        secretKey,
        {
          name: "HMAC",
          hash: { name: "SHA-256" }
        },
        true,
        ["sign"]
      );
    });
  }
  get nonce() {
    return this._nonce;
  }
  set nonce(n) {
    if (n && n !== this._nonce) {
      this._nonce = n;
    }
  }
  setPassword(password, shareUrl) {
    this.authKeyPromise = crypto.subtle.importKey("raw", encoder2.encode(password), { name: "PBKDF2" }, false, [
      "deriveKey"
    ]).then(
      (passwordKey) => crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: encoder2.encode(shareUrl),
          iterations: 100,
          hash: "SHA-256"
        },
        passwordKey,
        {
          name: "HMAC",
          hash: "SHA-256"
        },
        true,
        ["sign"]
      )
    );
  }
  setAuthKey(authKeyB64) {
    this.authKeyPromise = crypto.subtle.importKey(
      "raw",
      b64ToArray2(authKeyB64),
      {
        name: "HMAC",
        hash: "SHA-256"
      },
      true,
      ["sign"]
    );
  }
  async authKeyB64() {
    const authKey = await this.authKeyPromise;
    const rawAuth = await crypto.subtle.exportKey("raw", authKey);
    return arrayToB642(new Uint8Array(rawAuth));
  }
  async authHeader() {
    const authKey = await this.authKeyPromise;
    const sig = await crypto.subtle.sign(
      {
        name: "HMAC"
      },
      authKey,
      b64ToArray2(this.nonce)
    );
    return `send-v1 ${arrayToB642(new Uint8Array(sig))}`;
  }
  async encryptMetadata(metadata2) {
    const metaKey = await this.metaKeyPromise;
    const ciphertext = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(12),
        tagLength: 128
      },
      metaKey,
      encoder2.encode(
        JSON.stringify({
          name: metadata2.name,
          size: metadata2.size,
          type: metadata2.type || "application/octet-stream",
          manifest: metadata2.manifest || {}
        })
      )
    );
    return ciphertext;
  }
  encryptStream(plainStream) {
    return encryptStream(plainStream, this.rawSecret);
  }
  decryptStream(cryptotext) {
    return decryptStream(cryptotext, this.rawSecret);
  }
  async decryptMetadata(ciphertext) {
    const metaKey = await this.metaKeyPromise;
    const plaintext = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(12),
        tagLength: 128
      },
      metaKey,
      ciphertext
    );
    return JSON.parse(decoder.decode(plaintext));
  }
};

// src/api.mjs
var fileProtocolWssUrl = null;
try {
  fileProtocolWssUrl = localStorage.getItem("wssURL");
} catch (e) {
}
if (!fileProtocolWssUrl) {
  fileProtocolWssUrl = "wss://send.firefox.com/api/ws";
}
var ConnectionError = class extends Error {
  constructor(cancelled, duration, size) {
    super(cancelled ? "0" : "connection closed");
    this.cancelled = cancelled;
    this.duration = duration;
    this.size = size;
  }
};
function setFileProtocolWssUrl(url) {
  localStorage && localStorage.setItem("wssURL", url);
  fileProtocolWssUrl = url;
}
function getFileProtocolWssUrl() {
  return fileProtocolWssUrl;
}
var apiUrlPrefix = "";
function getApiUrl(path) {
  return apiUrlPrefix + path;
}
function setApiUrlPrefix(prefix) {
  apiUrlPrefix = prefix;
}
function post(obj) {
  const h = {
    "Content-Type": "application/json"
  };
  return {
    method: "POST",
    headers: new Headers(h),
    body: JSON.stringify(obj)
  };
}
function parseNonce(header) {
  header = header || "";
  return header.split(" ")[1];
}
async function fetchWithAuth(url, params, keychain) {
  const result = {};
  params = params || {};
  const h = await keychain.authHeader();
  params.headers = new Headers({
    Authorization: h,
    "Content-Type": "application/json"
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
async function del(id, owner_token) {
  const response = await fetch(
    getApiUrl(`/api/delete/${id}`),
    post({ owner_token })
  );
  return response.ok;
}
async function setParams(id, owner_token, params) {
  const response = await fetch(
    getApiUrl(`/api/params/${id}`),
    post({
      owner_token,
      dlimit: params.dlimit
    })
  );
  return response.ok;
}
async function fileInfo(id, owner_token) {
  const response = await fetch(
    getApiUrl(`/api/info/${id}`),
    post({ owner_token })
  );
  if (response.ok) {
    const obj = await response.json();
    return obj;
  }
  throw new Error(response.status);
}
async function metadata(id, keychain) {
  const result = await fetchWithAuthAndRetry(
    getApiUrl(`/api/metadata/${id}`),
    { method: "GET" },
    keychain
  );
  if (result.ok) {
    const data = await result.response.json();
    const meta = await keychain.decryptMetadata(b64ToArray2(data.metadata));
    return {
      size: meta.size,
      ttl: data.ttl,
      iv: meta.iv,
      name: meta.name,
      type: meta.type,
      manifest: meta.manifest
    };
  }
  throw new Error(result.response.status);
}
async function setPassword(id, owner_token, keychain) {
  const auth = await keychain.authKeyB64();
  const response = await fetch(
    getApiUrl(`/api/password/${id}`),
    post({ owner_token, auth })
  );
  return response.ok;
}
function asyncInitWebSocket(server, timeout = 1e4) {
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
        { once: true }
      );
      ws.addEventListener(
        "error",
        (e) => {
          clearTimeout(timeoutId);
          reject(new ConnectionError(false));
        },
        { once: true }
      );
    } catch (e) {
      reject(new ConnectionError(false));
    }
  });
}
function listenForResponse(ws, canceller) {
  return new Promise((resolve, reject) => {
    function handleClose(event) {
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
async function upload(stream, metadata2, verifierB64, timeLimit, dlimit, onprogress, canceller, ownerWrap) {
  let size = 0;
  const start = Date.now();
  const host = window.location.hostname;
  const port = window.location.port;
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const endpoint = window.location.protocol === "file:" ? fileProtocolWssUrl : `${protocol}//${host}${port ? ":" : ""}${port}/api/ws`;
  let ws;
  let lastError;
  const maxRetries = 3;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    if (canceller.cancelled) {
      throw new ConnectionError(true);
    }
    try {
      ws = await asyncInitWebSocket(endpoint);
      break;
    } catch (e) {
      lastError = e;
      if (attempt < maxRetries - 1) {
        const backoffMs = 500 * Math.pow(2, attempt);
        await delay(backoffMs);
      }
    }
  }
  if (!ws) {
    throw lastError || new ConnectionError(false);
  }
  try {
    const metadataHeader = arrayToB642(new Uint8Array(metadata2));
    const fileMeta = {
      fileMetadata: metadataHeader,
      authorization: `send-v1 ${verifierB64}`,
      timeLimit,
      dlimit
    };
    if (ownerWrap && ownerWrap.ciphertext && ownerWrap.nonce && ownerWrap.ephemeralPublicKey) {
      fileMeta.ownerSecretCiphertext = ownerWrap.ciphertext;
      fileMeta.ownerSecretNonce = ownerWrap.nonce;
      fileMeta.ownerSecretEphemeralPub = ownerWrap.ephemeralPublicKey;
      if (ownerWrap.version != null) {
        fileMeta.ownerSecretVersion = ownerWrap.version;
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
      while (ws.bufferedAmount > ECE_RECORD_SIZE * 2 && ws.readyState === WebSocket.OPEN && !canceller.cancelled) {
        await delay();
      }
    }
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(new Uint8Array([0]));
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
function uploadWs(encrypted, metadata2, verifierB64, timeLimit, dlimit, onprogress, ownerWrap = null) {
  const canceller = { cancelled: false };
  return {
    cancel: function() {
      canceller.cancelled = true;
    },
    result: upload(
      encrypted,
      metadata2,
      verifierB64,
      timeLimit,
      dlimit,
      onprogress,
      canceller,
      ownerWrap
    )
  };
}
async function downloadS(id, keychain, signal) {
  const auth = await keychain.authHeader();
  const response = await fetch(getApiUrl(`/api/download/${id}`), {
    signal,
    method: "GET",
    headers: { Authorization: auth }
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
function downloadStream(id, keychain) {
  const controller = new AbortController();
  function cancel() {
    controller.abort();
  }
  return {
    cancel,
    result: tryDownloadStream(id, keychain, controller.signal)
  };
}
async function download(id, keychain, onprogress, canceller) {
  const auth = await keychain.authHeader();
  const xhr = new XMLHttpRequest();
  canceller.oncancel = function() {
    xhr.abort();
  };
  return new Promise(function(resolve, reject) {
    xhr.addEventListener("loadend", function() {
      canceller.oncancel = function() {
      };
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
    xhr.addEventListener("progress", function(event) {
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
function downloadFile(id, keychain, onprogress) {
  const canceller = {
    oncancel: function() {
    }
    // download() sets this
  };
  function cancel() {
    canceller.oncancel();
  }
  return {
    cancel,
    result: tryDownload(id, keychain, onprogress, canceller)
  };
}
async function getFileList(bearerToken, kid) {
  const headers = new Headers({ Authorization: `Bearer ${bearerToken}` });
  const response = await fetch(getApiUrl(`/api/filelist/${kid}`), { headers });
  if (response.ok) {
    const encrypted = await response.blob();
    return encrypted;
  }
  throw new Error(response.status);
}
async function setFileList(bearerToken, kid, data) {
  const headers = new Headers({ Authorization: `Bearer ${bearerToken}` });
  const response = await fetch(getApiUrl(`/api/filelist/${kid}`), {
    headers,
    method: "POST",
    body: data
  });
  return response.ok;
}
async function getConstants() {
  const response = await fetch(getApiUrl("/config"));
  if (response.ok) {
    const obj = await response.json();
    return obj;
  }
  throw new Error(response.status);
}

// src/ownedFile.mjs
var OwnedFile = class {
  constructor(obj) {
    if (!obj.manifest) {
      throw new Error("invalid file object");
    }
    this.id = obj.id;
    this.url = obj.url;
    this.name = obj.name;
    this.size = obj.size;
    this.manifest = obj.manifest;
    this.time = obj.time;
    this.speed = obj.speed;
    this.createdAt = obj.createdAt;
    this.expiresAt = obj.expiresAt;
    this.ownerToken = obj.ownerToken;
    this.dlimit = obj.dlimit || 1;
    this.dtotal = obj.dtotal || 0;
    this.keychain = new Keychain(obj.secretKey, obj.nonce);
    this._hasPassword = !!obj.hasPassword;
    this.timeLimit = obj.timeLimit;
  }
  get hasPassword() {
    return !!this._hasPassword;
  }
  get expired() {
    return this.dlimit === this.dtotal || Date.now() > this.expiresAt;
  }
  async setPassword(password) {
    try {
      this.password = password;
      this._hasPassword = true;
      this.keychain.setPassword(password, this.url);
      const result = await setPassword(this.id, this.ownerToken, this.keychain);
      return result;
    } catch (e) {
      this.password = null;
      this._hasPassword = false;
      throw e;
    }
  }
  del() {
    return del(this.id, this.ownerToken);
  }
  changeLimit(dlimit) {
    if (this.dlimit !== dlimit) {
      this.dlimit = dlimit;
      return setParams(this.id, this.ownerToken, { dlimit });
    }
    return Promise.resolve(true);
  }
  async updateDownloadCount() {
    const oldTotal = this.dtotal;
    const oldLimit = this.dlimit;
    try {
      const result = await fileInfo(this.id, this.ownerToken);
      this.dtotal = result.dtotal;
      this.dlimit = result.dlimit;
    } catch (e) {
      if (e.message === "404") {
        this.dtotal = this.dlimit;
      }
    }
    return oldTotal !== this.dtotal || oldLimit !== this.dlimit;
  }
  toJSON() {
    return {
      id: this.id,
      url: this.url,
      name: this.name,
      size: this.size,
      manifest: this.manifest,
      time: this.time,
      speed: this.speed,
      createdAt: this.createdAt,
      expiresAt: this.expiresAt,
      secretKey: arrayToB64(this.keychain.rawSecret),
      ownerToken: this.ownerToken,
      dlimit: this.dlimit,
      dtotal: this.dtotal,
      hasPassword: this.hasPassword,
      timeLimit: this.timeLimit
    };
  }
};

// src/userSecrets.mjs
var OWNER_SECRET_VERSION = 1;
var USER_STORAGE_KEY = "user_state";
var WRAP_NONCE_LENGTH = 12;
var encoder3 = new TextEncoder();
var WRAP_INFO = encoder3.encode("go-send-owner-wrap-v1");
function randomX25519PrivateKey() {
  const key = new Uint8Array(32);
  crypto.getRandomValues(key);
  key[0] &= 248;
  key[31] &= 127;
  key[31] |= 64;
  return key;
}
function toArrayBuffer(view) {
  if (view instanceof ArrayBuffer) {
    return view.slice(0);
  }
  return view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength);
}
async function encryptWithSharedSecret(sharedSecret, secretBytes) {
  const hkdfKey = await crypto.subtle.importKey(
    "raw",
    sharedSecret,
    "HKDF",
    false,
    ["deriveKey"]
  );
  const aesKey = await crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: new Uint8Array(),
      info: WRAP_INFO
    },
    hkdfKey,
    {
      name: "AES-GCM",
      length: 256
    },
    false,
    ["encrypt"]
  );
  const nonce = crypto.getRandomValues(new Uint8Array(WRAP_NONCE_LENGTH));
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: nonce
    },
    aesKey,
    toArrayBuffer(secretBytes)
  );
  return {
    ciphertext: new Uint8Array(ciphertext),
    nonce
  };
}
function getUserStorageKey() {
  return USER_STORAGE_KEY;
}
var UserSecrets = class _UserSecrets {
  constructor({
    email,
    ed25519Seed,
    x25519PrivateKey,
    ed25519PublicKey,
    x25519PublicKey
  } = {}) {
    this.email = email || null;
    this.ed25519Seed = ed25519Seed || null;
    this.x25519PrivateKey = x25519PrivateKey || null;
    this.ed25519PublicKey = ed25519PublicKey || null;
    this.x25519PublicKey = x25519PublicKey || null;
  }
  static fromKeyMaterial({
    email,
    edSeed,
    x25519Seed,
    edPublicKey,
    x25519PublicKey
  }) {
    if (!email) {
      throw new Error("email required to persist user secrets");
    }
    if (!(edSeed instanceof Uint8Array) || edSeed.length === 0) {
      throw new Error("invalid Ed25519 seed");
    }
    if (!(x25519Seed instanceof Uint8Array) || x25519Seed.length === 0) {
      throw new Error("invalid X25519 key material");
    }
    const edSeedB64 = arrayToB64(edSeed);
    const xSeedB64 = arrayToB64(x25519Seed);
    const derivedXPublic = arrayToB64(x25519.scalarMultBase(x25519Seed));
    return new _UserSecrets({
      email,
      ed25519Seed: edSeedB64,
      x25519PrivateKey: xSeedB64,
      ed25519PublicKey: edPublicKey ? arrayToB64(edPublicKey) : null,
      x25519PublicKey: x25519PublicKey ? arrayToB64(x25519PublicKey) : derivedXPublic
    });
  }
  toJSON() {
    return {
      email: this.email,
      ed25519Seed: this.ed25519Seed,
      x25519PrivateKey: this.x25519PrivateKey,
      ed25519PublicKey: this.ed25519PublicKey,
      x25519PublicKey: this.x25519PublicKey
    };
  }
  getEd25519Seed() {
    return this.ed25519Seed ? b64ToArray(this.ed25519Seed) : null;
  }
  getX25519PrivateKey() {
    return this.x25519PrivateKey ? b64ToArray(this.x25519PrivateKey) : null;
  }
  getEd25519PublicKey() {
    return this.ed25519PublicKey ? b64ToArray(this.ed25519PublicKey) : null;
  }
  getX25519PublicKey() {
    return this.x25519PublicKey ? b64ToArray(this.x25519PublicKey) : null;
  }
  async wrapSecret(secretBytes) {
    if (!(secretBytes instanceof Uint8Array)) {
      throw new TypeError("secretBytes must be a Uint8Array");
    }
    if (!secretBytes.length) {
      throw new Error("secretBytes cannot be empty");
    }
    let updated = false;
    let userPublicKey = this.getX25519PublicKey();
    if (!userPublicKey) {
      const xPriv = this.getX25519PrivateKey();
      if (!xPriv) {
        throw new Error("missing X25519 key material");
      }
      userPublicKey = x25519.scalarMultBase(xPriv);
      xPriv.fill(0);
      this.x25519PublicKey = arrayToB64(userPublicKey);
      updated = true;
    }
    const ephemeralPrivate = randomX25519PrivateKey();
    const ephemeralPublic = x25519.scalarMultBase(ephemeralPrivate);
    const sharedSecret = x25519.scalarMult(ephemeralPrivate, userPublicKey);
    const { ciphertext, nonce } = await encryptWithSharedSecret(
      sharedSecret,
      secretBytes
    );
    ephemeralPrivate.fill(0);
    sharedSecret.fill(0);
    return {
      ciphertext: arrayToB64(ciphertext),
      nonce: arrayToB64(nonce),
      ephemeralPublicKey: arrayToB64(ephemeralPublic),
      version: OWNER_SECRET_VERSION,
      updated
    };
  }
  async unwrapSecret({
    ciphertext,
    nonce,
    ephemeralPublicKey,
    version = OWNER_SECRET_VERSION
  }) {
    if (version !== OWNER_SECRET_VERSION) {
      throw new Error(`Unsupported secret version: ${version}`);
    }
    const privateKey = this.getX25519PrivateKey();
    if (!privateKey) {
      throw new Error("missing X25519 private key");
    }
    const cipherBytes = b64ToArray(ciphertext);
    const nonceBytes = b64ToArray(nonce);
    const ephemeralBytes = b64ToArray(ephemeralPublicKey);
    if (nonceBytes.length !== WRAP_NONCE_LENGTH) {
      throw new Error("invalid nonce length");
    }
    if (ephemeralBytes.length !== 32) {
      throw new Error("invalid ephemeral public key");
    }
    const sharedSecret = x25519.scalarMult(privateKey, ephemeralBytes);
    privateKey.fill(0);
    const hkdfKey = await crypto.subtle.importKey(
      "raw",
      sharedSecret,
      "HKDF",
      false,
      ["deriveKey"]
    );
    const aesKey = await crypto.subtle.deriveKey(
      {
        name: "HKDF",
        hash: "SHA-256",
        salt: new Uint8Array(),
        info: WRAP_INFO
      },
      hkdfKey,
      {
        name: "AES-GCM",
        length: 256
      },
      false,
      ["decrypt"]
    );
    sharedSecret.fill(0);
    const plaintext = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: nonceBytes
      },
      aesKey,
      cipherBytes
    );
    return new Uint8Array(plaintext);
  }
};

// src/storage.mjs
var Mem = class {
  constructor() {
    this.items = /* @__PURE__ */ new Map();
  }
  get length() {
    return this.items.size;
  }
  getItem(key) {
    return this.items.get(key);
  }
  setItem(key, value) {
    return this.items.set(key, value);
  }
  removeItem(key) {
    return this.items.delete(key);
  }
  key(i) {
    return this.items.keys()[i];
  }
};
var Storage = class {
  constructor() {
    try {
      this.engine = localStorage || new Mem();
    } catch (e) {
      this.engine = new Mem();
    }
    this._files = this.loadFiles();
    this._user = this.loadUser();
  }
  loadFiles() {
    const fs = /* @__PURE__ */ new Map();
    for (let i = 0; i < this.engine.length; i++) {
      const k = this.engine.key(i);
      if (k === getUserStorageKey()) {
        continue;
      }
      if (isFile(k)) {
        try {
          const f = new OwnedFile(JSON.parse(this.engine.getItem(k)));
          if (!f.id) {
            f.id = f.fileId;
          }
          fs.set(f.id, f);
        } catch (err) {
          this.engine.removeItem(k);
        }
      }
    }
    return fs;
  }
  loadUser() {
    try {
      const raw = this.engine.getItem(getUserStorageKey());
      if (!raw) {
        return null;
      }
      return new UserSecrets(JSON.parse(raw));
    } catch (err) {
      this.engine.removeItem(getUserStorageKey());
      return null;
    }
  }
  get id() {
    let id = this.engine.getItem("device_id");
    if (!id) {
      id = arrayToB64(crypto.getRandomValues(new Uint8Array(16)));
      this.engine.setItem("device_id", id);
    }
    return id;
  }
  get totalDownloads() {
    return Number(this.engine.getItem("totalDownloads"));
  }
  set totalDownloads(n) {
    this.engine.setItem("totalDownloads", n);
  }
  get totalUploads() {
    return Number(this.engine.getItem("totalUploads"));
  }
  set totalUploads(n) {
    this.engine.setItem("totalUploads", n);
  }
  get referrer() {
    return this.engine.getItem("referrer");
  }
  set referrer(str) {
    this.engine.setItem("referrer", str);
  }
  get enrolled() {
    return JSON.parse(this.engine.getItem("ab_experiments") || "{}");
  }
  enroll(id, variant) {
    const enrolled = {};
    enrolled[id] = variant;
    this.engine.setItem("ab_experiments", JSON.stringify(enrolled));
  }
  get files() {
    return Array.from(this._files.values()).sort(
      (a, b) => a.createdAt - b.createdAt
    );
  }
  getFileById(id) {
    return this._files.get(id);
  }
  get user() {
    return this._user;
  }
  get(id) {
    return this.engine.getItem(id);
  }
  set(id, value) {
    return this.engine.setItem(id, value);
  }
  remove(property) {
    if (isFile(property)) {
      this._files.delete(property);
    }
    this.engine.removeItem(property);
  }
  addFile(file) {
    this._files.set(file.id, file);
    this.writeFile(file);
  }
  writeFile(file) {
    this.engine.setItem(file.id, JSON.stringify(file));
  }
  setUser(user) {
    if (!(user instanceof UserSecrets)) {
      throw new Error("Expected UserSecrets instance");
    }
    this._user = user;
    this.engine.setItem(
      getUserStorageKey(),
      JSON.stringify(user.toJSON())
    );
  }
  clearUser() {
    this._user = null;
    this.engine.removeItem(getUserStorageKey());
  }
  writeFiles() {
    this._files.forEach((f) => this.writeFile(f));
  }
  clearLocalFiles() {
    this._files.forEach((f) => this.engine.removeItem(f.id));
    this._files = /* @__PURE__ */ new Map();
  }
  async merge(files = []) {
    let incoming = false;
    let outgoing = false;
    let downloadCount = false;
    for (const f of files) {
      if (!this.getFileById(f.id)) {
        this.addFile(new OwnedFile(f));
        incoming = true;
      }
    }
    const workingFiles = this.files.slice();
    for (const f of workingFiles) {
      const cc = await f.updateDownloadCount();
      if (cc) {
        await this.writeFile(f);
      }
      downloadCount = downloadCount || cc;
      outgoing = outgoing || f.expired;
      if (f.expired) {
        this.remove(f.id);
      } else if (!files.find((x) => x.id === f.id)) {
        outgoing = true;
      }
    }
    return {
      incoming,
      outgoing,
      downloadCount
    };
  }
};
var storage_default = new Storage();

export {
  blobStream,
  concatStream,
  Keychain,
  getApiUrl,
  metadata,
  uploadWs,
  downloadFile,
  OwnedFile,
  OWNER_SECRET_VERSION,
  UserSecrets,
  storage_default
};
//# sourceMappingURL=chunk-42IXS7QU.js.map
