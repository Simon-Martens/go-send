import { arrayToB64, b64ToArray } from "../utils.mjs";
import { getPublicKey, sign } from "../vendor/noble-ed25519.mjs";

const encoder = new TextEncoder();

export const DEFAULT_KDF_SETTINGS = {
  algorithm: "pbkdf2-sha256",
  hash: "SHA-256",
  iterations: 310000,
  saltLength: 16,
  outputLength: 32,
};

const DERIVATION_INFO = encoder.encode("go-send-ed25519-seed");

export function generateSalt(length = DEFAULT_KDF_SETTINGS.saltLength) {
  if (length <= 0) {
    throw new Error("Salt length must be positive");
  }
  const salt = new Uint8Array(length);
  crypto.getRandomValues(salt);
  return salt;
}

export async function deriveSeed(password, salt, settings = DEFAULT_KDF_SETTINGS) {
  if (!password) {
    throw new Error("Password is required for seed derivation");
  }
  if (!(salt instanceof Uint8Array)) {
    throw new TypeError("Salt must be a Uint8Array");
  }

  const iterations = settings.iterations || DEFAULT_KDF_SETTINGS.iterations;
  const hash = settings.hash || DEFAULT_KDF_SETTINGS.hash;
  const length = settings.outputLength || DEFAULT_KDF_SETTINGS.outputLength;

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash,
    },
    keyMaterial,
    length * 8
  );

  const seed = new Uint8Array(derivedBits);

  // Optional HKDF to decorrelate direct PBKDF2 output from Ed25519 private key
  const hkdfKey = await crypto.subtle.importKey("raw", seed, { name: "HKDF" }, false, [
    "deriveBits",
  ]);

  const hkdfBits = await crypto.subtle.deriveBits(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: new Uint8Array(),
      info: DERIVATION_INFO,
    },
    hkdfKey,
    length * 8
  );

  seed.fill(0);
  return new Uint8Array(hkdfBits);
}

export async function deriveKeyPair(password, salt, settings = DEFAULT_KDF_SETTINGS) {
  const seed = await deriveSeed(password, salt, settings);
  const publicKey = await getPublicKey(seed);
  return { seed, publicKey };
}

export function serializeKDFSettings(settings = DEFAULT_KDF_SETTINGS) {
  return {
    algorithm: settings.algorithm,
    hash: settings.hash,
    iterations: settings.iterations,
    saltLength: settings.saltLength,
    outputLength: settings.outputLength,
  };
}

export function normalizeKDFSettings(settings) {
  if (!settings) {
    return { ...DEFAULT_KDF_SETTINGS };
  }
  return {
    algorithm: settings.algorithm || DEFAULT_KDF_SETTINGS.algorithm,
    hash: settings.hash || DEFAULT_KDF_SETTINGS.hash,
    iterations: settings.iterations || DEFAULT_KDF_SETTINGS.iterations,
    saltLength: settings.saltLength || DEFAULT_KDF_SETTINGS.saltLength,
    outputLength: settings.outputLength || DEFAULT_KDF_SETTINGS.outputLength,
  };
}

export function encodeSalt(salt) {
  return arrayToB64(salt);
}

export function encodePublicKey(publicKey) {
  return arrayToB64(publicKey);
}

export function decodeSalt(saltB64) {
  return b64ToArray(saltB64);
}

export function decodePublicKey(publicKeyB64) {
  return b64ToArray(publicKeyB64);
}

export async function signChallenge(seed, challengeB64) {
  const challenge = b64ToArray(challengeB64);
  try {
    const signature = await sign(challenge, seed);
    return arrayToB64(signature);
  } finally {
    seed.fill(0);
  }
}
