/**
 * Minimal P-256 (secp256r1) elliptic curve wrapper
 * Uses @noble/curves - a well-audited, minimal EC library
 *
 * This is necessary because Web Crypto API doesn't expose
 * point multiplication (scalar * G) needed for deterministic keys
 */

import { p256 } from '@noble/curves/nist.js';

export const P256 = {
  /**
   * Compute public key from private key scalar
   * @param {Uint8Array} privateKeyBytes - 32-byte private key scalar
   * @returns {Uint8Array} 65-byte uncompressed public key (0x04 || x || y)
   */
  getPublicKey(privateKeyBytes) {
    // noble-curves p256.getPublicKey returns uncompressed point by default
    return p256.getPublicKey(privateKeyBytes, false);
  }
};
