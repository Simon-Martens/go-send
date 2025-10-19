import { x25519 } from "@noble/curves/ed25519";
import { arrayToB64, b64ToArray } from "./utils.mjs";

export const OWNER_SECRET_VERSION = 1;
export const APP_VERSION = "1.0.0";

const USER_STORAGE_KEY = "user_state";
const WRAP_NONCE_LENGTH = 12;
const encoder = new TextEncoder();
const WRAP_INFO = encoder.encode("go-send-owner-wrap-v1");

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
    ["deriveKey"],
  );

  const aesKey = await crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: new Uint8Array(),
      info: WRAP_INFO,
    },
    hkdfKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt"],
  );

  const nonce = crypto.getRandomValues(new Uint8Array(WRAP_NONCE_LENGTH));
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: nonce,
    },
    aesKey,
    toArrayBuffer(secretBytes),
  );

  return {
    ciphertext: new Uint8Array(ciphertext),
    nonce,
  };
}

export function getUserStorageKey() {
  return USER_STORAGE_KEY;
}

export default class UserSecrets {
  constructor({
    email,
    name,
    role,
    settings,
    ed25519Seed,
    x25519PrivateKey,
    ed25519PublicKey,
    x25519PublicKey,
    version,
  } = {}) {
    this.email = email || null;
    this.name = name || null;
    this.role = role || null;
    this.settings = settings || null;
    this.ed25519Seed = ed25519Seed || null;
    this.x25519PrivateKey = x25519PrivateKey || null;
    this.ed25519PublicKey = ed25519PublicKey || null;
    this.x25519PublicKey = x25519PublicKey || null;
    this.version = version || null;
  }

  static fromKeyMaterial({
    email,
    name,
    role,
    settings,
    edSeed,
    x25519Seed,
    edPublicKey,
    x25519PublicKey,
    version,
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

    return new UserSecrets({
      email,
      name,
      role,
      settings,
      ed25519Seed: edSeedB64,
      x25519PrivateKey: xSeedB64,
      ed25519PublicKey: edPublicKey ? arrayToB64(edPublicKey) : null,
      x25519PublicKey: x25519PublicKey
        ? arrayToB64(x25519PublicKey)
        : derivedXPublic,
      version: version || APP_VERSION,
    });
  }

  toJSON() {
    return {
      email: this.email,
      name: this.name,
      role: this.role,
      settings: this.settings,
      ed25519Seed: this.ed25519Seed,
      x25519PrivateKey: this.x25519PrivateKey,
      ed25519PublicKey: this.ed25519PublicKey,
      x25519PublicKey: this.x25519PublicKey,
      version: this.version,
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
      secretBytes,
    );

    ephemeralPrivate.fill(0);
    sharedSecret.fill(0);

    return {
      ciphertext: arrayToB64(ciphertext),
      nonce: arrayToB64(nonce),
      ephemeralPublicKey: arrayToB64(ephemeralPublic),
      version: OWNER_SECRET_VERSION,
      updated,
    };
  }

  async unwrapSecret({
    ciphertext,
    nonce,
    ephemeralPublicKey,
    version = OWNER_SECRET_VERSION,
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
      ["deriveKey"],
    );

    const aesKey = await crypto.subtle.deriveKey(
      {
        name: "HKDF",
        hash: "SHA-256",
        salt: new Uint8Array(),
        info: WRAP_INFO,
      },
      hkdfKey,
      {
        name: "AES-GCM",
        length: 256,
      },
      false,
      ["decrypt"],
    );

    sharedSecret.fill(0);

    const plaintext = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: nonceBytes,
      },
      aesKey,
      cipherBytes,
    );

    return new Uint8Array(plaintext);
  }
}
