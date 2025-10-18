// Minimal subset of @noble/ed25519 (MIT License, https://github.com/paulmillr/noble-ed25519)
// Only the synchronous getPublicKey & sign helpers are included to keep the bundle lean.
// The implementation is adapted to work in modern browsers without Node built-ins.

const _0n = BigInt(0);
const _1n = BigInt(1);
const _2n = BigInt(2);
const _3n = BigInt(3);
const _4n = BigInt(4);
const _5n = BigInt(5);
const _8n = BigInt(8);

function bytesToHex(uint8a) {
  if (!(uint8a instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  let hex = "";
  for (const i of uint8a) hex += i.toString(16).padStart(2, "0");
  return hex;
}
function hexToBytes(hex) {
  if (typeof hex !== "string")
    throw new TypeError("hex must be a string");
  if (hex.length % 2)
    throw new Error("hex must be even length");
  const array = new Uint8Array(hex.length / 2);
  for (let i = 0; i < array.length; i++) {
    const j = i * 2;
    array[i] = parseInt(hex.slice(j, j + 2), 16);
  }
  return array;
}
function utf8ToBytes(str) {
  if (typeof str !== "string")
    throw new TypeError("utf8ToBytes expected string");
  return new TextEncoder().encode(str);
}
function concatBytes(...arrays) {
  if (!arrays.every((a) => a instanceof Uint8Array))
    throw new TypeError("Uint8Array expected");
  const length = arrays.reduce((a, arr) => a + arr.length, 0);
  const result = new Uint8Array(length);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

const mod = (a, b) => {
  const result = a % b;
  return result >= _0n ? result : b + result;
};
const pow2 = (bits) => mod(_1n << BigInt(bits), CURVE.p);

function sqrtMod(a) {
  const { p } = CURVE;
  const _1p = mod(p + _1n, _4n);
  if (_1p === _3n) {
    return pow(a, mod(p + _1n, _4n));
  }
  if (p % _8n !== _5n) {
    throw new Error("Cannot find square root for p % 8 != 5");
  }
  let x = pow(a, mod(p + _3n, _8n));
  const t = mod(x * x, p);
  const x2 = mod(x * (_1n - t) * sqrtMinusOne, p);
  if (!isSquare(t)) x = x2;
  if (!isSquare(mod(x * x - a, p)))
    throw new Error("Cannot find square root");
  return x;
}
const invert = (number) => pow(number, CURVE.p - _2n);

function invertBatch(nums) {
  const tmp = new Array(nums.length);
  let last = _1n;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === _0n) continue;
    tmp[i] = last;
    last = mod(last * nums[i], CURVE.p);
  }
  last = invert(last);
  for (let i = nums.length - 1; i >= 0; i--) {
    if (nums[i] === _0n) continue;
    tmp[i] = mod(last * tmp[i], CURVE.p);
    last = mod(last * nums[i], CURVE.p);
  }
  return tmp;
}

const pow = (number, power) => {
  let n = mod(number, CURVE.p);
  let e = power;
  let result = _1n;
  while (e > _0n) {
    if (e & _1n) result = mod(result * n, CURVE.p);
    n = mod(n * n, CURVE.p);
    e >>= _1n;
  }
  return result;
};
const isSquare = (y) => {
  return pow(y, (CURVE.p - _1n) >> _1n) === _1n;
};

const CURVE = {
  a: BigInt(-1),
  d: BigInt("37095705934669439343138083508754565189542113879843219016388785533085940283555"),
  P: [
    BigInt("15112221349535400772501151409588531511454012693041857206046113283949847762202"),
    BigInt("46316835694926478169428394003475163141307993866256225615783033603165251855960")
  ],
  p: BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed"),
  n: BigInt("0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3ed"),
  h: BigInt(8),
};
const sqrtMinusOne = pow(BigInt(-1), (CURVE.p - _1n) / _4n);

function bytesToNumberLE(bytes) {
  return BigInt("0x" + bytesToHex(Uint8Array.from(bytes).reverse()));
}

function numberToBytesLE(num, length) {
  return hexToBytes(num.toString(16).padStart(length * 2, "0")).reverse();
}

function modL_LE(hash) {
  return mod(bytesToNumberLE(hash), CURVE.n);
}

function ensureBytes(hex, ...lengths) {
  let bytes;
  if (hex instanceof Uint8Array) {
    bytes = Uint8Array.from(hex);
  } else if (typeof hex === "string") {
    bytes = hex.length % 2 ? hexToBytes(`0${hex}`) : hexToBytes(hex);
  } else if (ArrayBuffer.isView(hex)) {
    bytes = new Uint8Array(hex.buffer.slice(hex.byteOffset, hex.byteOffset + hex.byteLength));
  } else {
    throw new TypeError("Expected hex or Uint8Array");
  }
  if (lengths.length > 0 && !lengths.includes(bytes.length)) {
    throw new TypeError(`Expected hex / Uint8Array of length ${lengths}, not ${bytes.length}`);
  }
  return bytes;
}

async function getExtendedPublicKey(privateKey) {
    const hash = await utils.sha512(privateKey);
  const head = hash.slice(0, 32);
  const prefix = hash.slice(32);
  head[0] &= 248;
  head[31] &= 63;
  head[31] |= 64;
  const scalar = mod(bytesToNumberLE(head), CURVE.n);
  const point = Point.BASE.multiplyUnsafe(scalar).toRawBytes();
  return { head, prefix, scalar, point };
}

function assertPrivateKey(key) {
  key = ensureBytes(key, 32);
  return key;
}
function assertPublicKey(key) {
  key = ensureBytes(key, 32);
  return key;
}

class Point {
  constructor(x, y, z, t) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.t = t;
  }
  static fromAffine({ x, y }) {
    if (!isValidFieldElement(x) || !isValidFieldElement(y)) throw new TypeError("invalid point");
    return new Point(x, y, _1n, mod(x * y, CURVE.p));
  }
  toAffine() {
    const { x, y, z } = this;
    const iz = invert(z);
    return { x: mod(x * iz, CURVE.p), y: mod(y * iz, CURVE.p) };
  }
  toRawBytes() {
    const { x, y } = this.toAffine();
    const bytes = numberToBytesLE(y, 32);
    bytes[31] |= Number(x & _1n) << 7;
    return bytes;
  }
  is0() {
    return this.x === _0n && this.y === this.z && this.z === _0n;
  }
  negate() {
    return new Point(mod(-this.x, CURVE.p), this.y, this.z, mod(-this.t, CURVE.p));
  }
  add(other) {
    if (!(other instanceof Point)) {
      throw new TypeError("Expected Point");
    }
    const A = mod((this.y - this.x) * (other.y - other.x), CURVE.p);
    const B = mod((this.y + this.x) * (other.y + other.x), CURVE.p);
    const F = mod(this.t * _2n * other.t * CURVE.d, CURVE.p);
    const C = mod(this.z * _2n * other.z, CURVE.p);
    const D = mod(F + C, CURVE.p);
    const E = mod(B - A, CURVE.p);
    const G = mod(B + A, CURVE.p);
    const H = mod(C - F, CURVE.p);
    const X3 = mod(E * H, CURVE.p);
    const Y3 = mod(G * D, CURVE.p);
    const T3 = mod(E * G, CURVE.p);
    const Z3 = mod(D * H, CURVE.p);
    return new Point(X3, Y3, Z3, T3);
  }
  double() {
    const X1 = this.x;
    const Y1 = this.y;
    const Z1 = this.z;
    const A = mod(X1 ** _2n, CURVE.p);
    const B = mod(Y1 ** _2n, CURVE.p);
    const C = mod(_2n * Z1 ** _2n, CURVE.p);
    const D = mod(-A, CURVE.p);
    const E = mod((X1 + Y1) ** _2n - A - B, CURVE.p);
    const G = mod(D + B, CURVE.p);
    const F = mod(G - C, CURVE.p);
    const H = mod(D - B, CURVE.p);
    const X3 = mod(E * F, CURVE.p);
    const Y3 = mod(G * H, CURVE.p);
    const T3 = mod(E * H, CURVE.p);
    const Z3 = mod(F * G, CURVE.p);
    return new Point(X3, Y3, Z3, T3);
  }
  multiplyUnsafe(scalar) {
    let n = scalar;
    if (scalar <= _0n) return Point.ZERO;
    if (scalar === _1n) return this;
    let p = Point.ZERO;
    let d = this;
    while (n > _0n) {
      if (n & _1n) p = p.add(d);
      d = d.double();
      n >>= _1n;
    }
    return p;
  }
  static fromHex(hex) {
    const bytes = ensureBytes(hex, 32);
    const last = bytes[31] & 0x80;
    bytes[31] &= 0x7f;
    const y = bytesToNumberLE(bytes);
    if (y >= CURVE.p) throw new Error("Expected 0 < number < P");
    const y2 = mod(y * y, CURVE.p);
    const u = mod(y2 - _1n, CURVE.p);
    const v = mod(CURVE.d * y2 + _1n, CURVE.p);
    let x = mod(u * invert(v), CURVE.p);
    if (!isSquare(x)) x = mod(x * sqrtMinusOne, CURVE.p);
    const isLast = (x & _1n) === _1n;
    if (last && !isLast) x = mod(-x, CURVE.p);
    if (!last && isLast) x = mod(-x, CURVE.p);
    return Point.fromAffine({ x, y });
  }
}

Point.BASE = Point.fromAffine({ x: CURVE.P[0], y: CURVE.P[1] });
Point.ZERO = new Point(_0n, _1n, _1n, _0n);

function isValidFieldElement(n) {
  return typeof n === "bigint" && _0n <= n && n < CURVE.p;
}

function sha512(message) {
  if (typeof crypto?.subtle?.digest !== "function") {
    throw new Error("crypto.subtle.digest not available");
  }
  return crypto.subtle.digest("SHA-512", message);
}

const utils = {
  sha512: async (msg) => {
    const buf = await sha512(msg);
    return new Uint8Array(buf);
  },
  randomBytes: (len) => {
    const out = new Uint8Array(len);
    crypto.getRandomValues(out);
    return out;
  },
};

async function getPublicKeyAsync(privateKey) {
  const key = assertPrivateKey(privateKey);
  const { point } = await getExtendedPublicKey(key);
  return point;
}

export async function getPublicKey(privateKey) {
  return getPublicKeyAsync(privateKey);
}

async function signAsync(message, privateKey) {
  const key = assertPrivateKey(privateKey);
  const msg = ensureBytes(message);
  const { head, prefix, scalar, point } = await getExtendedPublicKey(key);
  prefix; point;
  const r = modL_LE(await utils.sha512(concatBytes(prefix, msg)));
  const R = Point.BASE.multiplyUnsafe(r).toRawBytes();
  const k = modL_LE(await utils.sha512(concatBytes(R, point, msg)));
  const s = mod(r + k * scalar, CURVE.n);
  const signature = concatBytes(R, numberToBytesLE(s, 32));
  return signature;
}

export async function sign(message, privateKey) {
  return signAsync(message, privateKey);
}
