// Worker-safe utilities (no DOM dependencies)

// INFO: base64 encoding/decoding
// INFO: support for .toBase64() and .fromBase64() was added to browsers in late 24. So we use this for now.
export function arrayToB64(array) {
  let bin = "";
  const chunkSize = 0x8000; // 32k chars per chunk
  for (let i = 0; i < array.length; i += chunkSize) {
    bin += String.fromCharCode(...array.subarray(i, i + chunkSize));
  }
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function b64ToArray(str) {
  const b64 =
    str.replace(/-/g, "+").replace(/_/g, "/") +
    "===".slice((str.length + 3) % 4);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// Concatenate multiple Uint8Arrays into a single Uint8Array
export function concatUint8Arrays(arrays) {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

// Read a 32-bit unsigned integer in big-endian format
export function readUint32BE(array, offset) {
  const view = new DataView(array.buffer, array.byteOffset, array.byteLength);
  return view.getUint32(offset, false); // false = big-endian
}

// Write a 32-bit unsigned integer in big-endian format
export function writeUint32BE(array, offset, value) {
  const view = new DataView(array.buffer, array.byteOffset, array.byteLength);
  view.setUint32(offset, value, false); // false = big-endian
}

// Read an 8-bit unsigned integer
export function readUint8(array, offset) {
  return array[offset];
}

// Write an 8-bit unsigned integer
export function writeUint8(array, offset, value) {
  array[offset] = value;
}

//////////////////// OTHER HELPERS ////////////////////
export function delay(delay = 100) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export async function streamToArrayBuffer(stream, size) {
  const reader = stream.getReader();
  let state = await reader.read();

  if (size) {
    const result = new Uint8Array(size);
    let offset = 0;
    while (!state.done) {
      result.set(state.value, offset);
      offset += state.value.length;
      state = await reader.read();
    }
    return result.buffer;
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
