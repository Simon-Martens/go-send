// src/utils-worker.mjs
function arrayToB64(array) {
  let bin = "";
  const chunkSize = 32768;
  for (let i = 0; i < array.length; i += chunkSize) {
    bin += String.fromCharCode(...array.subarray(i, i + chunkSize));
  }
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64ToArray(str) {
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
      this.rawSecret = b64ToArray(secretKeyB64);
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
      b64ToArray(authKeyB64),
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
    return arrayToB64(new Uint8Array(rawAuth));
  }
  async authHeader() {
    const authKey = await this.authKeyPromise;
    const sig = await crypto.subtle.sign(
      {
        name: "HMAC"
      },
      authKey,
      b64ToArray(this.nonce)
    );
    return `send-v1 ${arrayToB64(new Uint8Array(sig))}`;
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
async function fetchUsers() {
  const response = await fetch(getApiUrl("/api/users"));
  if (response.ok) {
    const data = await response.json();
    return data.users || [];
  }
  throw new Error(response.status);
}
async function fetchLogs(page = 1) {
  const response = await fetch(getApiUrl(`/api/logs?page=${page}`));
  if (response.ok) {
    const data = await response.json();
    return {
      logs: data.logs || [],
      currentPage: data.currentPage || page,
      totalCount: data.totalCount || 0
    };
  }
  throw new Error(response.status);
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
    const meta = await keychain.decryptMetadata(b64ToArray(data.metadata));
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
async function upload(stream, metadata2, verifierB64, timeLimit, dlimit, onprogress, canceller, ownerWrap, recipientWrap) {
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
    const metadataHeader = arrayToB64(new Uint8Array(metadata2));
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
    if (recipientWrap && recipientWrap.userId && recipientWrap.ciphertext && recipientWrap.nonce && recipientWrap.ephemeralPublicKey) {
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
function uploadWs(encrypted, metadata2, verifierB64, timeLimit, dlimit, onprogress, ownerWrap = null, recipientWrap = null) {
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
      ownerWrap,
      recipientWrap
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

// node_modules/crc/mjs/calculators/crc32.js
var TABLE = [
  0,
  1996959894,
  3993919788,
  2567524794,
  124634137,
  1886057615,
  3915621685,
  2657392035,
  249268274,
  2044508324,
  3772115230,
  2547177864,
  162941995,
  2125561021,
  3887607047,
  2428444049,
  498536548,
  1789927666,
  4089016648,
  2227061214,
  450548861,
  1843258603,
  4107580753,
  2211677639,
  325883990,
  1684777152,
  4251122042,
  2321926636,
  335633487,
  1661365465,
  4195302755,
  2366115317,
  997073096,
  1281953886,
  3579855332,
  2724688242,
  1006888145,
  1258607687,
  3524101629,
  2768942443,
  901097722,
  1119000684,
  3686517206,
  2898065728,
  853044451,
  1172266101,
  3705015759,
  2882616665,
  651767980,
  1373503546,
  3369554304,
  3218104598,
  565507253,
  1454621731,
  3485111705,
  3099436303,
  671266974,
  1594198024,
  3322730930,
  2970347812,
  795835527,
  1483230225,
  3244367275,
  3060149565,
  1994146192,
  31158534,
  2563907772,
  4023717930,
  1907459465,
  112637215,
  2680153253,
  3904427059,
  2013776290,
  251722036,
  2517215374,
  3775830040,
  2137656763,
  141376813,
  2439277719,
  3865271297,
  1802195444,
  476864866,
  2238001368,
  4066508878,
  1812370925,
  453092731,
  2181625025,
  4111451223,
  1706088902,
  314042704,
  2344532202,
  4240017532,
  1658658271,
  366619977,
  2362670323,
  4224994405,
  1303535960,
  984961486,
  2747007092,
  3569037538,
  1256170817,
  1037604311,
  2765210733,
  3554079995,
  1131014506,
  879679996,
  2909243462,
  3663771856,
  1141124467,
  855842277,
  2852801631,
  3708648649,
  1342533948,
  654459306,
  3188396048,
  3373015174,
  1466479909,
  544179635,
  3110523913,
  3462522015,
  1591671054,
  702138776,
  2966460450,
  3352799412,
  1504918807,
  783551873,
  3082640443,
  3233442989,
  3988292384,
  2596254646,
  62317068,
  1957810842,
  3939845945,
  2647816111,
  81470997,
  1943803523,
  3814918930,
  2489596804,
  225274430,
  2053790376,
  3826175755,
  2466906013,
  167816743,
  2097651377,
  4027552580,
  2265490386,
  503444072,
  1762050814,
  4150417245,
  2154129355,
  426522225,
  1852507879,
  4275313526,
  2312317920,
  282753626,
  1742555852,
  4189708143,
  2394877945,
  397917763,
  1622183637,
  3604390888,
  2714866558,
  953729732,
  1340076626,
  3518719985,
  2797360999,
  1068828381,
  1219638859,
  3624741850,
  2936675148,
  906185462,
  1090812512,
  3747672003,
  2825379669,
  829329135,
  1181335161,
  3412177804,
  3160834842,
  628085408,
  1382605366,
  3423369109,
  3138078467,
  570562233,
  1426400815,
  3317316542,
  2998733608,
  733239954,
  1555261956,
  3268935591,
  3050360625,
  752459403,
  1541320221,
  2607071920,
  3965973030,
  1969922972,
  40735498,
  2617837225,
  3943577151,
  1913087877,
  83908371,
  2512341634,
  3803740692,
  2075208622,
  213261112,
  2463272603,
  3855990285,
  2094854071,
  198958881,
  2262029012,
  4057260610,
  1759359992,
  534414190,
  2176718541,
  4139329115,
  1873836001,
  414664567,
  2282248934,
  4279200368,
  1711684554,
  285281116,
  2405801727,
  4167216745,
  1634467795,
  376229701,
  2685067896,
  3608007406,
  1308918612,
  956543938,
  2808555105,
  3495958263,
  1231636301,
  1047427035,
  2932959818,
  3654703836,
  1088359270,
  936918e3,
  2847714899,
  3736837829,
  1202900863,
  817233897,
  3183342108,
  3401237130,
  1404277552,
  615818150,
  3134207493,
  3453421203,
  1423857449,
  601450431,
  3009837614,
  3294710456,
  1567103746,
  711928724,
  3020668471,
  3272380065,
  1510334235,
  755167117
];
if (typeof Int32Array !== "undefined") {
  TABLE = new Int32Array(TABLE);
}
var crc32 = (current, previous) => {
  let crc = previous === 0 ? 0 : ~~previous ^ -1;
  for (let index = 0; index < current.length; index++) {
    crc = TABLE[(crc ^ current[index]) & 255] ^ crc >>> 8;
  }
  return crc ^ -1;
};
var crc32_default = crc32;

// src/zip.mjs
var encoder3 = new TextEncoder();
function dosDateTime(dateTime = /* @__PURE__ */ new Date()) {
  const year = dateTime.getFullYear() - 1980 << 9;
  const month = dateTime.getMonth() + 1 << 5;
  const day = dateTime.getDate();
  const date = year | month | day;
  const hour = dateTime.getHours() << 11;
  const minute = dateTime.getMinutes() << 5;
  const second = Math.floor(dateTime.getSeconds() / 2);
  const time = hour | minute | second;
  return { date, time };
}
var File = class {
  constructor(info) {
    this.name = encoder3.encode(info.name);
    this.size = info.size;
    this.bytesRead = 0;
    this.crc = null;
    this.dateTime = dosDateTime();
  }
  get header() {
    const h = new ArrayBuffer(30 + this.name.byteLength);
    const v = new DataView(h);
    v.setUint32(0, 67324752, true);
    v.setUint16(4, 20, true);
    v.setUint16(6, 2056, true);
    v.setUint16(8, 0, true);
    v.setUint16(10, this.dateTime.time, true);
    v.setUint16(12, this.dateTime.date, true);
    v.setUint32(14, 0, true);
    v.setUint32(18, 0, true);
    v.setUint32(22, 0, true);
    v.setUint16(26, this.name.byteLength, true);
    v.setUint16(28, 0, true);
    for (let i = 0; i < this.name.byteLength; i++) {
      v.setUint8(30 + i, this.name[i]);
    }
    return new Uint8Array(h);
  }
  get dataDescriptor() {
    const dd = new ArrayBuffer(16);
    const v = new DataView(dd);
    v.setUint32(0, 134695760, true);
    v.setUint32(4, this.crc, true);
    v.setUint32(8, this.size, true);
    v.setUint32(12, this.size, true);
    return new Uint8Array(dd);
  }
  directoryRecord(offset) {
    const dr = new ArrayBuffer(46 + this.name.byteLength);
    const v = new DataView(dr);
    v.setUint32(0, 33639248, true);
    v.setUint16(4, 20, true);
    v.setUint16(6, 20, true);
    v.setUint16(8, 2056, true);
    v.setUint16(10, 0, true);
    v.setUint16(12, this.dateTime.time, true);
    v.setUint16(14, this.dateTime.date, true);
    v.setUint32(16, this.crc, true);
    v.setUint32(20, this.size, true);
    v.setUint32(24, this.size, true);
    v.setUint16(28, this.name.byteLength, true);
    v.setUint16(30, 0, true);
    v.setUint16(32, 0, true);
    v.setUint16(34, 0, true);
    v.setUint16(36, 0, true);
    v.setUint32(38, 0, true);
    v.setUint32(42, offset, true);
    for (let i = 0; i < this.name.byteLength; i++) {
      v.setUint8(46 + i, this.name[i]);
    }
    return new Uint8Array(dr);
  }
  get byteLength() {
    return this.size + this.name.byteLength + 30 + 16;
  }
  append(data, controller) {
    this.bytesRead += data.byteLength;
    const endIndex = data.byteLength - Math.max(this.bytesRead - this.size, 0);
    const buf = data.slice(0, endIndex);
    this.crc = crc32_default(buf, this.crc);
    controller.enqueue(buf);
    if (endIndex < data.byteLength) {
      return data.slice(endIndex, data.byteLength);
    }
  }
};
function centralDirectory(files, controller) {
  let directoryOffset = 0;
  let directorySize = 0;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const record = file.directoryRecord(directoryOffset);
    directoryOffset += file.byteLength;
    controller.enqueue(record);
    directorySize += record.byteLength;
  }
  controller.enqueue(eod(files.length, directorySize, directoryOffset));
}
function eod(fileCount, directorySize, directoryOffset) {
  const e = new ArrayBuffer(22);
  const v = new DataView(e);
  v.setUint32(0, 101010256, true);
  v.setUint16(4, 0, true);
  v.setUint16(6, 0, true);
  v.setUint16(8, fileCount, true);
  v.setUint16(10, fileCount, true);
  v.setUint32(12, directorySize, true);
  v.setUint32(16, directoryOffset, true);
  v.setUint16(20, 0, true);
  return new Uint8Array(e);
}
var ZipStreamController = class {
  constructor(files, source) {
    this.files = files;
    this.fileIndex = 0;
    this.file = null;
    this.reader = source.getReader();
    this.nextFile();
    this.extra = null;
  }
  nextFile() {
    this.file = this.files[this.fileIndex++];
  }
  async pull(controller) {
    if (!this.file) {
      centralDirectory(this.files, controller);
      return controller.close();
    }
    if (this.file.bytesRead === 0) {
      controller.enqueue(this.file.header);
      if (this.extra) {
        this.extra = this.file.append(this.extra, controller);
      }
    }
    if (this.file.bytesRead >= this.file.size) {
      controller.enqueue(this.file.dataDescriptor);
      this.nextFile();
      return this.pull(controller);
    }
    const data = await this.reader.read();
    if (data.done) {
      this.nextFile();
      return this.pull(controller);
    }
    this.extra = this.file.append(data.value, controller);
  }
};
var Zip = class {
  constructor(manifest, source) {
    this.files = manifest.files.map((info) => new File(info));
    this.source = source;
  }
  get stream() {
    return new ReadableStream(new ZipStreamController(this.files, this.source));
  }
  get size() {
    const entries = this.files.reduce(
      (total, file) => total + file.byteLength * 2 - file.size,
      0
    );
    const eod2 = 22;
    return entries + eod2;
  }
};

// src/serviceWorker.mjs
function contentDisposition(filename) {
  const asciiName = filename.replace(/[^\x20-\x7E]/g, "_");
  const encodedName = encodeURIComponent(filename);
  return `attachment; filename="${asciiName}"; filename*=UTF-8''${encodedName}`;
}
var noSave = false;
var map = /* @__PURE__ */ new Map();
var IMAGES = /.*\.(png|svg|jpg)$/;
var VERSIONED_ASSET = /\.[A-Fa-f0-9]{8}\.(js|css|png|svg|jpg)(#\w+)?$/;
var DOWNLOAD_URL = /\/api\/download\/([A-Fa-f0-9]{4,})/;
var FONT = /\.woff2?$/;
self.addEventListener("install", () => {
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
async function decryptStream2(id, signal) {
  const file = map.get(id);
  if (!file) {
    console.error("[SW] File not found in map for id:", id);
    return new Response(null, { status: 400 });
  }
  if (signal && signal.aborted) {
    console.log("[SW] Request already aborted for", id);
    map.delete(id);
    return new Response(null, { status: 499 });
  }
  console.log("[SW] Starting decryptStream for", id, "with nonce:", file.nonce);
  let abortHandler = null;
  try {
    let size = file.size;
    let type = file.type;
    const keychain = new Keychain(file.key, file.nonce);
    if (file.requiresPassword) {
      keychain.setPassword(file.password, file.url);
    }
    console.log("[SW] Calling downloadStream...");
    file.download = downloadStream(id, keychain);
    if (signal && typeof signal.addEventListener === "function") {
      abortHandler = () => {
        console.log("[SW] Request aborted for", id);
        try {
          if (file.download && typeof file.download.cancel === "function") {
            file.download.cancel();
          }
        } catch (err) {
          console.warn("[SW] Failed to cancel download after abort", err);
        }
        map.delete(id);
      };
      signal.addEventListener("abort", abortHandler, { once: true });
    }
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
          if (signal && abortHandler && file.progress >= size) {
            signal.removeEventListener("abort", abortHandler);
          }
          controller.enqueue(chunk);
        }
      },
      function oncancel() {
        file.download.cancel();
        map.delete(id);
      }
    );
    const headers = {
      "Content-Disposition": contentDisposition(file.filename),
      "Content-Type": type,
      "Content-Length": size
    };
    console.log("[SW] Returning decrypted stream response");
    return new Response(responseStream, { headers });
  } catch (e) {
    if (e && (e.message === "0" || e.name === "AbortError")) {
      console.log("[SW] Download aborted for", id);
      return new Response(null, { status: 499 });
    }
    console.error("[SW] Error in decryptStream:", e, "noSave:", noSave);
    if (noSave) {
      return new Response(null, { status: e.message });
    }
    console.log("[SW] Redirecting to download page");
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/download/${id}/#${file.key}`
      }
    });
  } finally {
    if (signal && abortHandler) {
      signal.removeEventListener("abort", abortHandler);
    }
  }
}
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const dlmatch = DOWNLOAD_URL.exec(url.pathname);
  if (dlmatch) {
    console.log("[SW] Intercepted download request for:", dlmatch[1]);
    event.respondWith(decryptStream2(dlmatch[1], event.request.signal));
  }
});
self.addEventListener("message", (event) => {
  if (event.data.request === "init") {
    console.log(
      "[SW] Received init message for",
      event.data.id,
      "nonce:",
      event.data.nonce
    );
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
      progress: 0
    };
    map.set(event.data.id, info);
    console.log("[SW] File info stored in map");
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
});
//# sourceMappingURL=serviceWorker.js.map
