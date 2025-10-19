// INFO: Login flow overview:
// 1. Browser fetches per-user salt & KDF parameters via /auth/challenge.
// TODO: make sure the salt is sent regardless if the user exists or not.
// 2. Password + salt feed into PBKDF2 to derive base entropy.
// 3. The hashed result is passed to HKDF with two separate info strings to produce:
//    - Ed25519 seed (for authentication/signing)
//    - X25519 seed (for encryption key agreement)
// 4. The seeds deterministically regenerate both key pairs (deriveKeyPair):
//    Ed25519 and X25519 public/private keys
// 5. The Ed25519 private seed signs the challenge nonce (signChallenge).
// 6. Browser posts {email, challenge_id, signature}; server verifies signature with stored Ed25519 public key and issues a session.

// INFO: Registration flow overview:
// 1. Browser generates a fresh salt (generateSalt) and runs the PBKDF2 + HKDF derivation to obtain:
//    - Deterministic Ed25519 seed → Ed25519 public key (for authentication)
//    - Deterministic X25519 seed → X25519 public key (for encryption)
// 2. Only the salt, both derived public keys (Ed25519 + X25519), and KDF parameters are sent to /register along with the invitation token.
// 3. Server stores those public parameters so any future login can reproduce the identical private keys from the password alone.

// WARNING: Always confirm posted data contains no sensitive information before commit.

import {
  getPublicKey,
  sign,
  utils as ed25519Utils,
  etc as ed25519Hash,
} from "@noble/ed25519";
import { x25519 } from "@noble/curves/ed25519";
import { sha512 as nobleSha512 } from "@noble/hashes/sha2";
import { arrayToB64, b64ToArray } from "../utils.mjs";

const encoder = new TextEncoder();

function concatBytes(...arrays) {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const output = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    output.set(arr, offset);
    offset += arr.length;
  }
  return output;
}

const sha512Sync = (...messages) => nobleSha512(concatBytes(...messages));
const sha512Async = async (...messages) => {
  const data = concatBytes(...messages);
  if (globalThis?.crypto?.subtle) {
    const digest = await globalThis.crypto.subtle.digest("SHA-512", data);
    return new Uint8Array(digest);
  }
  return nobleSha512(data);
};

if (!ed25519Hash.sha512Sync) {
  ed25519Hash.sha512Sync = sha512Sync;
}

if (!ed25519Hash.sha512Async) {
  ed25519Hash.sha512Async = sha512Async;
}

// Maintain backwards compatibility with utils helpers if accessed elsewhere
if (!ed25519Utils.sha512Sync) {
  ed25519Utils.sha512Sync = sha512Sync;
}

if (!ed25519Utils.sha512) {
  ed25519Utils.sha512 = sha512Async;
}

export const DEFAULT_KDF_SETTINGS = {
  algorithm: "pbkdf2-sha256",
  hash: "SHA-256",
  iterations: 600000,
  saltLength: 16,
  outputLength: 32,
};

const DERIVATION_INFO = encoder.encode("go-send-ed25519-seed");
const X25519_INFO = encoder.encode("go-send-x25519-seed");

export function generateSalt(length = DEFAULT_KDF_SETTINGS.saltLength) {
  if (length <= 0) {
    throw new Error("Salt length must be positive");
  }
  const salt = new Uint8Array(length);
  crypto.getRandomValues(salt);
  return salt;
}

async function deriveKeySeeds(password, salt, settings = DEFAULT_KDF_SETTINGS) {
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
    ["deriveBits"],
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash,
    },
    keyMaterial,
    length * 8,
  );

  const pbkdfOutput = new Uint8Array(derivedBits);
  const hkdfKey = await crypto.subtle.importKey(
    "raw",
    pbkdfOutput,
    { name: "HKDF" },
    false,
    ["deriveBits"],
  );

  const edSeedBits = await crypto.subtle.deriveBits(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: new Uint8Array(),
      info: DERIVATION_INFO,
    },
    hkdfKey,
    length * 8,
  );

  const x25519SeedBits = await crypto.subtle.deriveBits(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: new Uint8Array(),
      info: X25519_INFO,
    },
    hkdfKey,
    32 * 8,
  );

  pbkdfOutput.fill(0);

  return {
    edSeed: new Uint8Array(edSeedBits),
    x25519Seed: new Uint8Array(x25519SeedBits),
  };
}

export async function deriveKeyMaterial(
  password,
  salt,
  settings = DEFAULT_KDF_SETTINGS,
) {
  return deriveKeySeeds(password, salt, settings);
}

export async function deriveSeed(
  password,
  salt,
  settings = DEFAULT_KDF_SETTINGS,
) {
  const { edSeed, x25519Seed } = await deriveKeySeeds(password, salt, settings);
  x25519Seed.fill(0);
  return edSeed;
}

export async function deriveKeyPair(
  password,
  salt,
  settings = DEFAULT_KDF_SETTINGS,
) {
  const { edSeed, x25519Seed } = await deriveKeySeeds(password, salt, settings);
  const publicKey = await getPublicKey(edSeed);
  const encryptionPublicKey = x25519.scalarMultBase(x25519Seed);
  x25519Seed.fill(0);
  return { seed: edSeed, publicKey, encryptionPublicKey };
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

export { getPublicKey };

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
