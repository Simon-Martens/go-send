var j = {};
j.byteLength = Zr;
j.toByteArray = vr;
j.fromByteArray = ee;
var G = [], W = [], Xr = typeof Uint8Array < "u" ? Uint8Array : Array, Dr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var v = 0, Jr = Dr.length; v < Jr; ++v)
  G[v] = Dr[v], W[Dr.charCodeAt(v)] = v;
W[45] = 62;
W[95] = 63;
function Wr(l) {
  var c = l.length;
  if (c % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var f = l.indexOf("=");
  f === -1 && (f = c);
  var x = f === c ? 0 : 4 - f % 4;
  return [f, x];
}
function Zr(l) {
  var c = Wr(l), f = c[0], x = c[1];
  return (f + x) * 3 / 4 - x;
}
function Qr(l, c, f) {
  return (c + f) * 3 / 4 - f;
}
function vr(l) {
  var c, f = Wr(l), x = f[0], d = f[1], g = new Xr(Qr(l, x, d)), B = 0, u = d > 0 ? x - 4 : x, b;
  for (b = 0; b < u; b += 4)
    c = W[l.charCodeAt(b)] << 18 | W[l.charCodeAt(b + 1)] << 12 | W[l.charCodeAt(b + 2)] << 6 | W[l.charCodeAt(b + 3)], g[B++] = c >> 16 & 255, g[B++] = c >> 8 & 255, g[B++] = c & 255;
  return d === 2 && (c = W[l.charCodeAt(b)] << 2 | W[l.charCodeAt(b + 1)] >> 4, g[B++] = c & 255), d === 1 && (c = W[l.charCodeAt(b)] << 10 | W[l.charCodeAt(b + 1)] << 4 | W[l.charCodeAt(b + 2)] >> 2, g[B++] = c >> 8 & 255, g[B++] = c & 255), g;
}
function jr(l) {
  return G[l >> 18 & 63] + G[l >> 12 & 63] + G[l >> 6 & 63] + G[l & 63];
}
function re(l, c, f) {
  for (var x, d = [], g = c; g < f; g += 3)
    x = (l[g] << 16 & 16711680) + (l[g + 1] << 8 & 65280) + (l[g + 2] & 255), d.push(jr(x));
  return d.join("");
}
function ee(l) {
  for (var c, f = l.length, x = f % 3, d = [], g = 16383, B = 0, u = f - x; B < u; B += g)
    d.push(re(l, B, B + g > u ? u : B + g));
  return x === 1 ? (c = l[f - 1], d.push(
    G[c >> 2] + G[c << 4 & 63] + "=="
  )) : x === 2 && (c = (l[f - 2] << 8) + l[f - 1], d.push(
    G[c >> 10] + G[c >> 4 & 63] + G[c << 2 & 63] + "="
  )), d.join("");
}
var Mr, qr;
function te() {
  if (qr) return Mr;
  qr = 1;
  const l = j;
  function c(g) {
    return l.fromByteArray(g).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }
  function f(g) {
    return l.toByteArray(g + "===".slice((g.length + 3) % 4));
  }
  function x(g = 100) {
    return new Promise((B) => setTimeout(B, g));
  }
  async function d(g, B) {
    const u = g.getReader();
    let b = await u.read();
    if (B) {
      const k = new Uint8Array(B);
      let H = 0;
      for (; !b.done; )
        k.set(b.value, H), H += b.value.length, b = await u.read();
      return k.buffer;
    }
    const K = [];
    let C = 0;
    for (; !b.done; )
      K.push(b.value), C += b.value.length, b = await u.read();
    let L = 0;
    const M = new Uint8Array(C);
    for (const k of K)
      M.set(k, L), L += k.length;
    return M.buffer;
  }
  return Mr = {
    arrayToB64: c,
    b64ToArray: f,
    delay: x,
    streamToArrayBuffer: d
  }, Mr;
}
var cr = te(), z = {}, wr = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
wr.read = function(l, c, f, x, d) {
  var g, B, u = d * 8 - x - 1, b = (1 << u) - 1, K = b >> 1, C = -7, L = f ? d - 1 : 0, M = f ? -1 : 1, k = l[c + L];
  for (L += M, g = k & (1 << -C) - 1, k >>= -C, C += u; C > 0; g = g * 256 + l[c + L], L += M, C -= 8)
    ;
  for (B = g & (1 << -C) - 1, g >>= -C, C += x; C > 0; B = B * 256 + l[c + L], L += M, C -= 8)
    ;
  if (g === 0)
    g = 1 - K;
  else {
    if (g === b)
      return B ? NaN : (k ? -1 : 1) * (1 / 0);
    B = B + Math.pow(2, x), g = g - K;
  }
  return (k ? -1 : 1) * B * Math.pow(2, g - x);
};
wr.write = function(l, c, f, x, d, g) {
  var B, u, b, K = g * 8 - d - 1, C = (1 << K) - 1, L = C >> 1, M = d === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, k = x ? 0 : g - 1, H = x ? 1 : -1, Y = c < 0 || c === 0 && 1 / c < 0 ? 1 : 0;
  for (c = Math.abs(c), isNaN(c) || c === 1 / 0 ? (u = isNaN(c) ? 1 : 0, B = C) : (B = Math.floor(Math.log(c) / Math.LN2), c * (b = Math.pow(2, -B)) < 1 && (B--, b *= 2), B + L >= 1 ? c += M / b : c += M * Math.pow(2, 1 - L), c * b >= 2 && (B++, b /= 2), B + L >= C ? (u = 0, B = C) : B + L >= 1 ? (u = (c * b - 1) * Math.pow(2, d), B = B + L) : (u = c * Math.pow(2, L - 1) * Math.pow(2, d), B = 0)); d >= 8; l[f + k] = u & 255, k += H, u /= 256, d -= 8)
    ;
  for (B = B << d | u, K += d; K > 0; l[f + k] = B & 255, k += H, B /= 256, K -= 8)
    ;
  l[f + k - H] |= Y * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(l) {
  const c = j, f = wr, x = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  l.Buffer = u, l.SlowBuffer = Er, l.INSPECT_MAX_BYTES = 50;
  const d = 2147483647;
  l.kMaxLength = d, u.TYPED_ARRAY_SUPPORT = g(), !u.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function g() {
    try {
      const i = new Uint8Array(1), r = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(r, Uint8Array.prototype), Object.setPrototypeOf(i, r), i.foo() === 42;
    } catch {
      return !1;
    }
  }
  Object.defineProperty(u.prototype, "parent", {
    enumerable: !0,
    get: function() {
      if (u.isBuffer(this))
        return this.buffer;
    }
  }), Object.defineProperty(u.prototype, "offset", {
    enumerable: !0,
    get: function() {
      if (u.isBuffer(this))
        return this.byteOffset;
    }
  });
  function B(i) {
    if (i > d)
      throw new RangeError('The value "' + i + '" is invalid for option "size"');
    const r = new Uint8Array(i);
    return Object.setPrototypeOf(r, u.prototype), r;
  }
  function u(i, r, e) {
    if (typeof i == "number") {
      if (typeof r == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return L(i);
    }
    return b(i, r, e);
  }
  u.poolSize = 8192;
  function b(i, r, e) {
    if (typeof i == "string")
      return M(i, r);
    if (ArrayBuffer.isView(i))
      return H(i);
    if (i == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof i
      );
    if (E(i, ArrayBuffer) || i && E(i.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (E(i, SharedArrayBuffer) || i && E(i.buffer, SharedArrayBuffer)))
      return Y(i, r, e);
    if (typeof i == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    const a = i.valueOf && i.valueOf();
    if (a != null && a !== i)
      return u.from(a, r, e);
    const h = mr(i);
    if (h) return h;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof i[Symbol.toPrimitive] == "function")
      return u.from(i[Symbol.toPrimitive]("string"), r, e);
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof i
    );
  }
  u.from = function(i, r, e) {
    return b(i, r, e);
  }, Object.setPrototypeOf(u.prototype, Uint8Array.prototype), Object.setPrototypeOf(u, Uint8Array);
  function K(i) {
    if (typeof i != "number")
      throw new TypeError('"size" argument must be of type number');
    if (i < 0)
      throw new RangeError('The value "' + i + '" is invalid for option "size"');
  }
  function C(i, r, e) {
    return K(i), i <= 0 ? B(i) : r !== void 0 ? typeof e == "string" ? B(i).fill(r, e) : B(i).fill(r) : B(i);
  }
  u.alloc = function(i, r, e) {
    return C(i, r, e);
  };
  function L(i) {
    return K(i), B(i < 0 ? 0 : Z(i) | 0);
  }
  u.allocUnsafe = function(i) {
    return L(i);
  }, u.allocUnsafeSlow = function(i) {
    return L(i);
  };
  function M(i, r) {
    if ((typeof r != "string" || r === "") && (r = "utf8"), !u.isEncoding(r))
      throw new TypeError("Unknown encoding: " + r);
    const e = rr(i, r) | 0;
    let a = B(e);
    const h = a.write(i, r);
    return h !== e && (a = a.slice(0, h)), a;
  }
  function k(i) {
    const r = i.length < 0 ? 0 : Z(i.length) | 0, e = B(r);
    for (let a = 0; a < r; a += 1)
      e[a] = i[a] & 255;
    return e;
  }
  function H(i) {
    if (E(i, Uint8Array)) {
      const r = new Uint8Array(i);
      return Y(r.buffer, r.byteOffset, r.byteLength);
    }
    return k(i);
  }
  function Y(i, r, e) {
    if (r < 0 || i.byteLength < r)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (i.byteLength < r + (e || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    let a;
    return r === void 0 && e === void 0 ? a = new Uint8Array(i) : e === void 0 ? a = new Uint8Array(i, r) : a = new Uint8Array(i, r, e), Object.setPrototypeOf(a, u.prototype), a;
  }
  function mr(i) {
    if (u.isBuffer(i)) {
      const r = Z(i.length) | 0, e = B(r);
      return e.length === 0 || i.copy(e, 0, 0, r), e;
    }
    if (i.length !== void 0)
      return typeof i.length != "number" || A(i.length) ? B(0) : k(i);
    if (i.type === "Buffer" && Array.isArray(i.data))
      return k(i.data);
  }
  function Z(i) {
    if (i >= d)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + d.toString(16) + " bytes");
    return i | 0;
  }
  function Er(i) {
    return +i != i && (i = 0), u.alloc(+i);
  }
  u.isBuffer = function(r) {
    return r != null && r._isBuffer === !0 && r !== u.prototype;
  }, u.compare = function(r, e) {
    if (E(r, Uint8Array) && (r = u.from(r, r.offset, r.byteLength)), E(e, Uint8Array) && (e = u.from(e, e.offset, e.byteLength)), !u.isBuffer(r) || !u.isBuffer(e))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (r === e) return 0;
    let a = r.length, h = e.length;
    for (let y = 0, w = Math.min(a, h); y < w; ++y)
      if (r[y] !== e[y]) {
        a = r[y], h = e[y];
        break;
      }
    return a < h ? -1 : h < a ? 1 : 0;
  }, u.isEncoding = function(r) {
    switch (String(r).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return !0;
      default:
        return !1;
    }
  }, u.concat = function(r, e) {
    if (!Array.isArray(r))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (r.length === 0)
      return u.alloc(0);
    let a;
    if (e === void 0)
      for (e = 0, a = 0; a < r.length; ++a)
        e += r[a].length;
    const h = u.allocUnsafe(e);
    let y = 0;
    for (a = 0; a < r.length; ++a) {
      let w = r[a];
      if (E(w, Uint8Array))
        y + w.length > h.length ? (u.isBuffer(w) || (w = u.from(w)), w.copy(h, y)) : Uint8Array.prototype.set.call(
          h,
          w,
          y
        );
      else if (u.isBuffer(w))
        w.copy(h, y);
      else
        throw new TypeError('"list" argument must be an Array of Buffers');
      y += w.length;
    }
    return h;
  };
  function rr(i, r) {
    if (u.isBuffer(i))
      return i.length;
    if (ArrayBuffer.isView(i) || E(i, ArrayBuffer))
      return i.byteLength;
    if (typeof i != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof i
      );
    const e = i.length, a = arguments.length > 2 && arguments[2] === !0;
    if (!a && e === 0) return 0;
    let h = !1;
    for (; ; )
      switch (r) {
        case "ascii":
        case "latin1":
        case "binary":
          return e;
        case "utf8":
        case "utf-8":
          return t(i).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return e * 2;
        case "hex":
          return e >>> 1;
        case "base64":
          return p(i).length;
        default:
          if (h)
            return a ? -1 : t(i).length;
          r = ("" + r).toLowerCase(), h = !0;
      }
  }
  u.byteLength = rr;
  function gr(i, r, e) {
    let a = !1;
    if ((r === void 0 || r < 0) && (r = 0), r > this.length || ((e === void 0 || e > this.length) && (e = this.length), e <= 0) || (e >>>= 0, r >>>= 0, e <= r))
      return "";
    for (i || (i = "utf8"); ; )
      switch (i) {
        case "hex":
          return Cr(this, r, e);
        case "utf8":
        case "utf-8":
          return nr(this, r, e);
        case "ascii":
          return Tr(this, r, e);
        case "latin1":
        case "binary":
          return Rr(this, r, e);
        case "base64":
          return Ir(this, r, e);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return Lr(this, r, e);
        default:
          if (a) throw new TypeError("Unknown encoding: " + i);
          i = (i + "").toLowerCase(), a = !0;
      }
  }
  u.prototype._isBuffer = !0;
  function $(i, r, e) {
    const a = i[r];
    i[r] = i[e], i[e] = a;
  }
  u.prototype.swap16 = function() {
    const r = this.length;
    if (r % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let e = 0; e < r; e += 2)
      $(this, e, e + 1);
    return this;
  }, u.prototype.swap32 = function() {
    const r = this.length;
    if (r % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let e = 0; e < r; e += 4)
      $(this, e, e + 3), $(this, e + 1, e + 2);
    return this;
  }, u.prototype.swap64 = function() {
    const r = this.length;
    if (r % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let e = 0; e < r; e += 8)
      $(this, e, e + 7), $(this, e + 1, e + 6), $(this, e + 2, e + 5), $(this, e + 3, e + 4);
    return this;
  }, u.prototype.toString = function() {
    const r = this.length;
    return r === 0 ? "" : arguments.length === 0 ? nr(this, 0, r) : gr.apply(this, arguments);
  }, u.prototype.toLocaleString = u.prototype.toString, u.prototype.equals = function(r) {
    if (!u.isBuffer(r)) throw new TypeError("Argument must be a Buffer");
    return this === r ? !0 : u.compare(this, r) === 0;
  }, u.prototype.inspect = function() {
    let r = "";
    const e = l.INSPECT_MAX_BYTES;
    return r = this.toString("hex", 0, e).replace(/(.{2})/g, "$1 ").trim(), this.length > e && (r += " ... "), "<Buffer " + r + ">";
  }, x && (u.prototype[x] = u.prototype.inspect), u.prototype.compare = function(r, e, a, h, y) {
    if (E(r, Uint8Array) && (r = u.from(r, r.offset, r.byteLength)), !u.isBuffer(r))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof r
      );
    if (e === void 0 && (e = 0), a === void 0 && (a = r ? r.length : 0), h === void 0 && (h = 0), y === void 0 && (y = this.length), e < 0 || a > r.length || h < 0 || y > this.length)
      throw new RangeError("out of range index");
    if (h >= y && e >= a)
      return 0;
    if (h >= y)
      return -1;
    if (e >= a)
      return 1;
    if (e >>>= 0, a >>>= 0, h >>>= 0, y >>>= 0, this === r) return 0;
    let w = y - h, F = a - e;
    const _ = Math.min(w, F), D = this.slice(h, y), N = r.slice(e, a);
    for (let R = 0; R < _; ++R)
      if (D[R] !== N[R]) {
        w = D[R], F = N[R];
        break;
      }
    return w < F ? -1 : F < w ? 1 : 0;
  };
  function er(i, r, e, a, h) {
    if (i.length === 0) return -1;
    if (typeof e == "string" ? (a = e, e = 0) : e > 2147483647 ? e = 2147483647 : e < -2147483648 && (e = -2147483648), e = +e, A(e) && (e = h ? 0 : i.length - 1), e < 0 && (e = i.length + e), e >= i.length) {
      if (h) return -1;
      e = i.length - 1;
    } else if (e < 0)
      if (h) e = 0;
      else return -1;
    if (typeof r == "string" && (r = u.from(r, a)), u.isBuffer(r))
      return r.length === 0 ? -1 : tr(i, r, e, a, h);
    if (typeof r == "number")
      return r = r & 255, typeof Uint8Array.prototype.indexOf == "function" ? h ? Uint8Array.prototype.indexOf.call(i, r, e) : Uint8Array.prototype.lastIndexOf.call(i, r, e) : tr(i, [r], e, a, h);
    throw new TypeError("val must be string, number or Buffer");
  }
  function tr(i, r, e, a, h) {
    let y = 1, w = i.length, F = r.length;
    if (a !== void 0 && (a = String(a).toLowerCase(), a === "ucs2" || a === "ucs-2" || a === "utf16le" || a === "utf-16le")) {
      if (i.length < 2 || r.length < 2)
        return -1;
      y = 2, w /= 2, F /= 2, e /= 2;
    }
    function _(N, R) {
      return y === 1 ? N[R] : N.readUInt16BE(R * y);
    }
    let D;
    if (h) {
      let N = -1;
      for (D = e; D < w; D++)
        if (_(i, D) === _(r, N === -1 ? 0 : D - N)) {
          if (N === -1 && (N = D), D - N + 1 === F) return N * y;
        } else
          N !== -1 && (D -= D - N), N = -1;
    } else
      for (e + F > w && (e = w - F), D = e; D >= 0; D--) {
        let N = !0;
        for (let R = 0; R < F; R++)
          if (_(i, D + R) !== _(r, R)) {
            N = !1;
            break;
          }
        if (N) return D;
      }
    return -1;
  }
  u.prototype.includes = function(r, e, a) {
    return this.indexOf(r, e, a) !== -1;
  }, u.prototype.indexOf = function(r, e, a) {
    return er(this, r, e, a, !0);
  }, u.prototype.lastIndexOf = function(r, e, a) {
    return er(this, r, e, a, !1);
  };
  function Br(i, r, e, a) {
    e = Number(e) || 0;
    const h = i.length - e;
    a ? (a = Number(a), a > h && (a = h)) : a = h;
    const y = r.length;
    a > y / 2 && (a = y / 2);
    let w;
    for (w = 0; w < a; ++w) {
      const F = parseInt(r.substr(w * 2, 2), 16);
      if (A(F)) return w;
      i[e + w] = F;
    }
    return w;
  }
  function br(i, r, e, a) {
    return m(t(r, i.length - e), i, e, a);
  }
  function Ur(i, r, e, a) {
    return m(n(r), i, e, a);
  }
  function Ar(i, r, e, a) {
    return m(p(r), i, e, a);
  }
  function Fr(i, r, e, a) {
    return m(s(r, i.length - e), i, e, a);
  }
  u.prototype.write = function(r, e, a, h) {
    if (e === void 0)
      h = "utf8", a = this.length, e = 0;
    else if (a === void 0 && typeof e == "string")
      h = e, a = this.length, e = 0;
    else if (isFinite(e))
      e = e >>> 0, isFinite(a) ? (a = a >>> 0, h === void 0 && (h = "utf8")) : (h = a, a = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    const y = this.length - e;
    if ((a === void 0 || a > y) && (a = y), r.length > 0 && (a < 0 || e < 0) || e > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    h || (h = "utf8");
    let w = !1;
    for (; ; )
      switch (h) {
        case "hex":
          return Br(this, r, e, a);
        case "utf8":
        case "utf-8":
          return br(this, r, e, a);
        case "ascii":
        case "latin1":
        case "binary":
          return Ur(this, r, e, a);
        case "base64":
          return Ar(this, r, e, a);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return Fr(this, r, e, a);
        default:
          if (w) throw new TypeError("Unknown encoding: " + h);
          h = ("" + h).toLowerCase(), w = !0;
      }
  }, u.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function Ir(i, r, e) {
    return r === 0 && e === i.length ? c.fromByteArray(i) : c.fromByteArray(i.slice(r, e));
  }
  function nr(i, r, e) {
    e = Math.min(i.length, e);
    const a = [];
    let h = r;
    for (; h < e; ) {
      const y = i[h];
      let w = null, F = y > 239 ? 4 : y > 223 ? 3 : y > 191 ? 2 : 1;
      if (h + F <= e) {
        let _, D, N, R;
        switch (F) {
          case 1:
            y < 128 && (w = y);
            break;
          case 2:
            _ = i[h + 1], (_ & 192) === 128 && (R = (y & 31) << 6 | _ & 63, R > 127 && (w = R));
            break;
          case 3:
            _ = i[h + 1], D = i[h + 2], (_ & 192) === 128 && (D & 192) === 128 && (R = (y & 15) << 12 | (_ & 63) << 6 | D & 63, R > 2047 && (R < 55296 || R > 57343) && (w = R));
            break;
          case 4:
            _ = i[h + 1], D = i[h + 2], N = i[h + 3], (_ & 192) === 128 && (D & 192) === 128 && (N & 192) === 128 && (R = (y & 15) << 18 | (_ & 63) << 12 | (D & 63) << 6 | N & 63, R > 65535 && R < 1114112 && (w = R));
        }
      }
      w === null ? (w = 65533, F = 1) : w > 65535 && (w -= 65536, a.push(w >>> 10 & 1023 | 55296), w = 56320 | w & 1023), a.push(w), h += F;
    }
    return Sr(a);
  }
  const ir = 4096;
  function Sr(i) {
    const r = i.length;
    if (r <= ir)
      return String.fromCharCode.apply(String, i);
    let e = "", a = 0;
    for (; a < r; )
      e += String.fromCharCode.apply(
        String,
        i.slice(a, a += ir)
      );
    return e;
  }
  function Tr(i, r, e) {
    let a = "";
    e = Math.min(i.length, e);
    for (let h = r; h < e; ++h)
      a += String.fromCharCode(i[h] & 127);
    return a;
  }
  function Rr(i, r, e) {
    let a = "";
    e = Math.min(i.length, e);
    for (let h = r; h < e; ++h)
      a += String.fromCharCode(i[h]);
    return a;
  }
  function Cr(i, r, e) {
    const a = i.length;
    (!r || r < 0) && (r = 0), (!e || e < 0 || e > a) && (e = a);
    let h = "";
    for (let y = r; y < e; ++y)
      h += T[i[y]];
    return h;
  }
  function Lr(i, r, e) {
    const a = i.slice(r, e);
    let h = "";
    for (let y = 0; y < a.length - 1; y += 2)
      h += String.fromCharCode(a[y] + a[y + 1] * 256);
    return h;
  }
  u.prototype.slice = function(r, e) {
    const a = this.length;
    r = ~~r, e = e === void 0 ? a : ~~e, r < 0 ? (r += a, r < 0 && (r = 0)) : r > a && (r = a), e < 0 ? (e += a, e < 0 && (e = 0)) : e > a && (e = a), e < r && (e = r);
    const h = this.subarray(r, e);
    return Object.setPrototypeOf(h, u.prototype), h;
  };
  function U(i, r, e) {
    if (i % 1 !== 0 || i < 0) throw new RangeError("offset is not uint");
    if (i + r > e) throw new RangeError("Trying to access beyond buffer length");
  }
  u.prototype.readUintLE = u.prototype.readUIntLE = function(r, e, a) {
    r = r >>> 0, e = e >>> 0, a || U(r, e, this.length);
    let h = this[r], y = 1, w = 0;
    for (; ++w < e && (y *= 256); )
      h += this[r + w] * y;
    return h;
  }, u.prototype.readUintBE = u.prototype.readUIntBE = function(r, e, a) {
    r = r >>> 0, e = e >>> 0, a || U(r, e, this.length);
    let h = this[r + --e], y = 1;
    for (; e > 0 && (y *= 256); )
      h += this[r + --e] * y;
    return h;
  }, u.prototype.readUint8 = u.prototype.readUInt8 = function(r, e) {
    return r = r >>> 0, e || U(r, 1, this.length), this[r];
  }, u.prototype.readUint16LE = u.prototype.readUInt16LE = function(r, e) {
    return r = r >>> 0, e || U(r, 2, this.length), this[r] | this[r + 1] << 8;
  }, u.prototype.readUint16BE = u.prototype.readUInt16BE = function(r, e) {
    return r = r >>> 0, e || U(r, 2, this.length), this[r] << 8 | this[r + 1];
  }, u.prototype.readUint32LE = u.prototype.readUInt32LE = function(r, e) {
    return r = r >>> 0, e || U(r, 4, this.length), (this[r] | this[r + 1] << 8 | this[r + 2] << 16) + this[r + 3] * 16777216;
  }, u.prototype.readUint32BE = u.prototype.readUInt32BE = function(r, e) {
    return r = r >>> 0, e || U(r, 4, this.length), this[r] * 16777216 + (this[r + 1] << 16 | this[r + 2] << 8 | this[r + 3]);
  }, u.prototype.readBigUInt64LE = I(function(r) {
    r = r >>> 0, q(r, "offset");
    const e = this[r], a = this[r + 7];
    (e === void 0 || a === void 0) && V(r, this.length - 8);
    const h = e + this[++r] * 2 ** 8 + this[++r] * 2 ** 16 + this[++r] * 2 ** 24, y = this[++r] + this[++r] * 2 ** 8 + this[++r] * 2 ** 16 + a * 2 ** 24;
    return BigInt(h) + (BigInt(y) << BigInt(32));
  }), u.prototype.readBigUInt64BE = I(function(r) {
    r = r >>> 0, q(r, "offset");
    const e = this[r], a = this[r + 7];
    (e === void 0 || a === void 0) && V(r, this.length - 8);
    const h = e * 2 ** 24 + this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + this[++r], y = this[++r] * 2 ** 24 + this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + a;
    return (BigInt(h) << BigInt(32)) + BigInt(y);
  }), u.prototype.readIntLE = function(r, e, a) {
    r = r >>> 0, e = e >>> 0, a || U(r, e, this.length);
    let h = this[r], y = 1, w = 0;
    for (; ++w < e && (y *= 256); )
      h += this[r + w] * y;
    return y *= 128, h >= y && (h -= Math.pow(2, 8 * e)), h;
  }, u.prototype.readIntBE = function(r, e, a) {
    r = r >>> 0, e = e >>> 0, a || U(r, e, this.length);
    let h = e, y = 1, w = this[r + --h];
    for (; h > 0 && (y *= 256); )
      w += this[r + --h] * y;
    return y *= 128, w >= y && (w -= Math.pow(2, 8 * e)), w;
  }, u.prototype.readInt8 = function(r, e) {
    return r = r >>> 0, e || U(r, 1, this.length), this[r] & 128 ? (255 - this[r] + 1) * -1 : this[r];
  }, u.prototype.readInt16LE = function(r, e) {
    r = r >>> 0, e || U(r, 2, this.length);
    const a = this[r] | this[r + 1] << 8;
    return a & 32768 ? a | 4294901760 : a;
  }, u.prototype.readInt16BE = function(r, e) {
    r = r >>> 0, e || U(r, 2, this.length);
    const a = this[r + 1] | this[r] << 8;
    return a & 32768 ? a | 4294901760 : a;
  }, u.prototype.readInt32LE = function(r, e) {
    return r = r >>> 0, e || U(r, 4, this.length), this[r] | this[r + 1] << 8 | this[r + 2] << 16 | this[r + 3] << 24;
  }, u.prototype.readInt32BE = function(r, e) {
    return r = r >>> 0, e || U(r, 4, this.length), this[r] << 24 | this[r + 1] << 16 | this[r + 2] << 8 | this[r + 3];
  }, u.prototype.readBigInt64LE = I(function(r) {
    r = r >>> 0, q(r, "offset");
    const e = this[r], a = this[r + 7];
    (e === void 0 || a === void 0) && V(r, this.length - 8);
    const h = this[r + 4] + this[r + 5] * 2 ** 8 + this[r + 6] * 2 ** 16 + (a << 24);
    return (BigInt(h) << BigInt(32)) + BigInt(e + this[++r] * 2 ** 8 + this[++r] * 2 ** 16 + this[++r] * 2 ** 24);
  }), u.prototype.readBigInt64BE = I(function(r) {
    r = r >>> 0, q(r, "offset");
    const e = this[r], a = this[r + 7];
    (e === void 0 || a === void 0) && V(r, this.length - 8);
    const h = (e << 24) + // Overflow
    this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + this[++r];
    return (BigInt(h) << BigInt(32)) + BigInt(this[++r] * 2 ** 24 + this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + a);
  }), u.prototype.readFloatLE = function(r, e) {
    return r = r >>> 0, e || U(r, 4, this.length), f.read(this, r, !0, 23, 4);
  }, u.prototype.readFloatBE = function(r, e) {
    return r = r >>> 0, e || U(r, 4, this.length), f.read(this, r, !1, 23, 4);
  }, u.prototype.readDoubleLE = function(r, e) {
    return r = r >>> 0, e || U(r, 8, this.length), f.read(this, r, !0, 52, 8);
  }, u.prototype.readDoubleBE = function(r, e) {
    return r = r >>> 0, e || U(r, 8, this.length), f.read(this, r, !1, 52, 8);
  };
  function S(i, r, e, a, h, y) {
    if (!u.isBuffer(i)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (r > h || r < y) throw new RangeError('"value" argument is out of bounds');
    if (e + a > i.length) throw new RangeError("Index out of range");
  }
  u.prototype.writeUintLE = u.prototype.writeUIntLE = function(r, e, a, h) {
    if (r = +r, e = e >>> 0, a = a >>> 0, !h) {
      const F = Math.pow(2, 8 * a) - 1;
      S(this, r, e, a, F, 0);
    }
    let y = 1, w = 0;
    for (this[e] = r & 255; ++w < a && (y *= 256); )
      this[e + w] = r / y & 255;
    return e + a;
  }, u.prototype.writeUintBE = u.prototype.writeUIntBE = function(r, e, a, h) {
    if (r = +r, e = e >>> 0, a = a >>> 0, !h) {
      const F = Math.pow(2, 8 * a) - 1;
      S(this, r, e, a, F, 0);
    }
    let y = a - 1, w = 1;
    for (this[e + y] = r & 255; --y >= 0 && (w *= 256); )
      this[e + y] = r / w & 255;
    return e + a;
  }, u.prototype.writeUint8 = u.prototype.writeUInt8 = function(r, e, a) {
    return r = +r, e = e >>> 0, a || S(this, r, e, 1, 255, 0), this[e] = r & 255, e + 1;
  }, u.prototype.writeUint16LE = u.prototype.writeUInt16LE = function(r, e, a) {
    return r = +r, e = e >>> 0, a || S(this, r, e, 2, 65535, 0), this[e] = r & 255, this[e + 1] = r >>> 8, e + 2;
  }, u.prototype.writeUint16BE = u.prototype.writeUInt16BE = function(r, e, a) {
    return r = +r, e = e >>> 0, a || S(this, r, e, 2, 65535, 0), this[e] = r >>> 8, this[e + 1] = r & 255, e + 2;
  }, u.prototype.writeUint32LE = u.prototype.writeUInt32LE = function(r, e, a) {
    return r = +r, e = e >>> 0, a || S(this, r, e, 4, 4294967295, 0), this[e + 3] = r >>> 24, this[e + 2] = r >>> 16, this[e + 1] = r >>> 8, this[e] = r & 255, e + 4;
  }, u.prototype.writeUint32BE = u.prototype.writeUInt32BE = function(r, e, a) {
    return r = +r, e = e >>> 0, a || S(this, r, e, 4, 4294967295, 0), this[e] = r >>> 24, this[e + 1] = r >>> 16, this[e + 2] = r >>> 8, this[e + 3] = r & 255, e + 4;
  };
  function or(i, r, e, a, h) {
    Q(r, a, h, i, e, 7);
    let y = Number(r & BigInt(4294967295));
    i[e++] = y, y = y >> 8, i[e++] = y, y = y >> 8, i[e++] = y, y = y >> 8, i[e++] = y;
    let w = Number(r >> BigInt(32) & BigInt(4294967295));
    return i[e++] = w, w = w >> 8, i[e++] = w, w = w >> 8, i[e++] = w, w = w >> 8, i[e++] = w, e;
  }
  function ur(i, r, e, a, h) {
    Q(r, a, h, i, e, 7);
    let y = Number(r & BigInt(4294967295));
    i[e + 7] = y, y = y >> 8, i[e + 6] = y, y = y >> 8, i[e + 5] = y, y = y >> 8, i[e + 4] = y;
    let w = Number(r >> BigInt(32) & BigInt(4294967295));
    return i[e + 3] = w, w = w >> 8, i[e + 2] = w, w = w >> 8, i[e + 1] = w, w = w >> 8, i[e] = w, e + 8;
  }
  u.prototype.writeBigUInt64LE = I(function(r, e = 0) {
    return or(this, r, e, BigInt(0), BigInt("0xffffffffffffffff"));
  }), u.prototype.writeBigUInt64BE = I(function(r, e = 0) {
    return ur(this, r, e, BigInt(0), BigInt("0xffffffffffffffff"));
  }), u.prototype.writeIntLE = function(r, e, a, h) {
    if (r = +r, e = e >>> 0, !h) {
      const _ = Math.pow(2, 8 * a - 1);
      S(this, r, e, a, _ - 1, -_);
    }
    let y = 0, w = 1, F = 0;
    for (this[e] = r & 255; ++y < a && (w *= 256); )
      r < 0 && F === 0 && this[e + y - 1] !== 0 && (F = 1), this[e + y] = (r / w >> 0) - F & 255;
    return e + a;
  }, u.prototype.writeIntBE = function(r, e, a, h) {
    if (r = +r, e = e >>> 0, !h) {
      const _ = Math.pow(2, 8 * a - 1);
      S(this, r, e, a, _ - 1, -_);
    }
    let y = a - 1, w = 1, F = 0;
    for (this[e + y] = r & 255; --y >= 0 && (w *= 256); )
      r < 0 && F === 0 && this[e + y + 1] !== 0 && (F = 1), this[e + y] = (r / w >> 0) - F & 255;
    return e + a;
  }, u.prototype.writeInt8 = function(r, e, a) {
    return r = +r, e = e >>> 0, a || S(this, r, e, 1, 127, -128), r < 0 && (r = 255 + r + 1), this[e] = r & 255, e + 1;
  }, u.prototype.writeInt16LE = function(r, e, a) {
    return r = +r, e = e >>> 0, a || S(this, r, e, 2, 32767, -32768), this[e] = r & 255, this[e + 1] = r >>> 8, e + 2;
  }, u.prototype.writeInt16BE = function(r, e, a) {
    return r = +r, e = e >>> 0, a || S(this, r, e, 2, 32767, -32768), this[e] = r >>> 8, this[e + 1] = r & 255, e + 2;
  }, u.prototype.writeInt32LE = function(r, e, a) {
    return r = +r, e = e >>> 0, a || S(this, r, e, 4, 2147483647, -2147483648), this[e] = r & 255, this[e + 1] = r >>> 8, this[e + 2] = r >>> 16, this[e + 3] = r >>> 24, e + 4;
  }, u.prototype.writeInt32BE = function(r, e, a) {
    return r = +r, e = e >>> 0, a || S(this, r, e, 4, 2147483647, -2147483648), r < 0 && (r = 4294967295 + r + 1), this[e] = r >>> 24, this[e + 1] = r >>> 16, this[e + 2] = r >>> 8, this[e + 3] = r & 255, e + 4;
  }, u.prototype.writeBigInt64LE = I(function(r, e = 0) {
    return or(this, r, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }), u.prototype.writeBigInt64BE = I(function(r, e = 0) {
    return ur(this, r, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function ar(i, r, e, a, h, y) {
    if (e + a > i.length) throw new RangeError("Index out of range");
    if (e < 0) throw new RangeError("Index out of range");
  }
  function lr(i, r, e, a, h) {
    return r = +r, e = e >>> 0, h || ar(i, r, e, 4), f.write(i, r, e, a, 23, 4), e + 4;
  }
  u.prototype.writeFloatLE = function(r, e, a) {
    return lr(this, r, e, !0, a);
  }, u.prototype.writeFloatBE = function(r, e, a) {
    return lr(this, r, e, !1, a);
  };
  function xr(i, r, e, a, h) {
    return r = +r, e = e >>> 0, h || ar(i, r, e, 8), f.write(i, r, e, a, 52, 8), e + 8;
  }
  u.prototype.writeDoubleLE = function(r, e, a) {
    return xr(this, r, e, !0, a);
  }, u.prototype.writeDoubleBE = function(r, e, a) {
    return xr(this, r, e, !1, a);
  }, u.prototype.copy = function(r, e, a, h) {
    if (!u.isBuffer(r)) throw new TypeError("argument should be a Buffer");
    if (a || (a = 0), !h && h !== 0 && (h = this.length), e >= r.length && (e = r.length), e || (e = 0), h > 0 && h < a && (h = a), h === a || r.length === 0 || this.length === 0) return 0;
    if (e < 0)
      throw new RangeError("targetStart out of bounds");
    if (a < 0 || a >= this.length) throw new RangeError("Index out of range");
    if (h < 0) throw new RangeError("sourceEnd out of bounds");
    h > this.length && (h = this.length), r.length - e < h - a && (h = r.length - e + a);
    const y = h - a;
    return this === r && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(e, a, h) : Uint8Array.prototype.set.call(
      r,
      this.subarray(a, h),
      e
    ), y;
  }, u.prototype.fill = function(r, e, a, h) {
    if (typeof r == "string") {
      if (typeof e == "string" ? (h = e, e = 0, a = this.length) : typeof a == "string" && (h = a, a = this.length), h !== void 0 && typeof h != "string")
        throw new TypeError("encoding must be a string");
      if (typeof h == "string" && !u.isEncoding(h))
        throw new TypeError("Unknown encoding: " + h);
      if (r.length === 1) {
        const w = r.charCodeAt(0);
        (h === "utf8" && w < 128 || h === "latin1") && (r = w);
      }
    } else typeof r == "number" ? r = r & 255 : typeof r == "boolean" && (r = Number(r));
    if (e < 0 || this.length < e || this.length < a)
      throw new RangeError("Out of range index");
    if (a <= e)
      return this;
    e = e >>> 0, a = a === void 0 ? this.length : a >>> 0, r || (r = 0);
    let y;
    if (typeof r == "number")
      for (y = e; y < a; ++y)
        this[y] = r;
    else {
      const w = u.isBuffer(r) ? r : u.from(r, h), F = w.length;
      if (F === 0)
        throw new TypeError('The value "' + r + '" is invalid for argument "value"');
      for (y = 0; y < a - e; ++y)
        this[y + e] = w[y % F];
    }
    return this;
  };
  const O = {};
  function sr(i, r, e) {
    O[i] = class extends e {
      constructor() {
        super(), Object.defineProperty(this, "message", {
          value: r.apply(this, arguments),
          writable: !0,
          configurable: !0
        }), this.name = `${this.name} [${i}]`, this.stack, delete this.name;
      }
      get code() {
        return i;
      }
      set code(h) {
        Object.defineProperty(this, "code", {
          configurable: !0,
          enumerable: !0,
          value: h,
          writable: !0
        });
      }
      toString() {
        return `${this.name} [${i}]: ${this.message}`;
      }
    };
  }
  sr(
    "ERR_BUFFER_OUT_OF_BOUNDS",
    function(i) {
      return i ? `${i} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
    },
    RangeError
  ), sr(
    "ERR_INVALID_ARG_TYPE",
    function(i, r) {
      return `The "${i}" argument must be of type number. Received type ${typeof r}`;
    },
    TypeError
  ), sr(
    "ERR_OUT_OF_RANGE",
    function(i, r, e) {
      let a = `The value of "${i}" is out of range.`, h = e;
      return Number.isInteger(e) && Math.abs(e) > 2 ** 32 ? h = yr(String(e)) : typeof e == "bigint" && (h = String(e), (e > BigInt(2) ** BigInt(32) || e < -(BigInt(2) ** BigInt(32))) && (h = yr(h)), h += "n"), a += ` It must be ${r}. Received ${h}`, a;
    },
    RangeError
  );
  function yr(i) {
    let r = "", e = i.length;
    const a = i[0] === "-" ? 1 : 0;
    for (; e >= a + 4; e -= 3)
      r = `_${i.slice(e - 3, e)}${r}`;
    return `${i.slice(0, e)}${r}`;
  }
  function dr(i, r, e) {
    q(r, "offset"), (i[r] === void 0 || i[r + e] === void 0) && V(r, i.length - (e + 1));
  }
  function Q(i, r, e, a, h, y) {
    if (i > e || i < r) {
      const w = typeof r == "bigint" ? "n" : "";
      let F;
      throw r === 0 || r === BigInt(0) ? F = `>= 0${w} and < 2${w} ** ${(y + 1) * 8}${w}` : F = `>= -(2${w} ** ${(y + 1) * 8 - 1}${w}) and < 2 ** ${(y + 1) * 8 - 1}${w}`, new O.ERR_OUT_OF_RANGE("value", F, i);
    }
    dr(a, h, y);
  }
  function q(i, r) {
    if (typeof i != "number")
      throw new O.ERR_INVALID_ARG_TYPE(r, "number", i);
  }
  function V(i, r, e) {
    throw Math.floor(i) !== i ? (q(i, e), new O.ERR_OUT_OF_RANGE("offset", "an integer", i)) : r < 0 ? new O.ERR_BUFFER_OUT_OF_BOUNDS() : new O.ERR_OUT_OF_RANGE(
      "offset",
      `>= 0 and <= ${r}`,
      i
    );
  }
  const kr = /[^+/0-9A-Za-z-_]/g;
  function o(i) {
    if (i = i.split("=")[0], i = i.trim().replace(kr, ""), i.length < 2) return "";
    for (; i.length % 4 !== 0; )
      i = i + "=";
    return i;
  }
  function t(i, r) {
    r = r || 1 / 0;
    let e;
    const a = i.length;
    let h = null;
    const y = [];
    for (let w = 0; w < a; ++w) {
      if (e = i.charCodeAt(w), e > 55295 && e < 57344) {
        if (!h) {
          if (e > 56319) {
            (r -= 3) > -1 && y.push(239, 191, 189);
            continue;
          } else if (w + 1 === a) {
            (r -= 3) > -1 && y.push(239, 191, 189);
            continue;
          }
          h = e;
          continue;
        }
        if (e < 56320) {
          (r -= 3) > -1 && y.push(239, 191, 189), h = e;
          continue;
        }
        e = (h - 55296 << 10 | e - 56320) + 65536;
      } else h && (r -= 3) > -1 && y.push(239, 191, 189);
      if (h = null, e < 128) {
        if ((r -= 1) < 0) break;
        y.push(e);
      } else if (e < 2048) {
        if ((r -= 2) < 0) break;
        y.push(
          e >> 6 | 192,
          e & 63 | 128
        );
      } else if (e < 65536) {
        if ((r -= 3) < 0) break;
        y.push(
          e >> 12 | 224,
          e >> 6 & 63 | 128,
          e & 63 | 128
        );
      } else if (e < 1114112) {
        if ((r -= 4) < 0) break;
        y.push(
          e >> 18 | 240,
          e >> 12 & 63 | 128,
          e >> 6 & 63 | 128,
          e & 63 | 128
        );
      } else
        throw new Error("Invalid code point");
    }
    return y;
  }
  function n(i) {
    const r = [];
    for (let e = 0; e < i.length; ++e)
      r.push(i.charCodeAt(e) & 255);
    return r;
  }
  function s(i, r) {
    let e, a, h;
    const y = [];
    for (let w = 0; w < i.length && !((r -= 2) < 0); ++w)
      e = i.charCodeAt(w), a = e >> 8, h = e % 256, y.push(h), y.push(a);
    return y;
  }
  function p(i) {
    return c.toByteArray(o(i));
  }
  function m(i, r, e, a) {
    let h;
    for (h = 0; h < a && !(h + e >= r.length || h >= i.length); ++h)
      r[h + e] = i[h];
    return h;
  }
  function E(i, r) {
    return i instanceof r || i != null && i.constructor != null && i.constructor.name != null && i.constructor.name === r.name;
  }
  function A(i) {
    return i !== i;
  }
  const T = function() {
    const i = "0123456789abcdef", r = new Array(256);
    for (let e = 0; e < 16; ++e) {
      const a = e * 16;
      for (let h = 0; h < 16; ++h)
        r[a + h] = i[e] + i[h];
    }
    return r;
  }();
  function I(i) {
    return typeof BigInt > "u" ? P : i;
  }
  function P() {
    throw new Error("BigInt not supported");
  }
})(z);
function pr(l, c = {}, f) {
  const x = l.getReader(), d = c || {};
  return new ReadableStream({
    async start(g) {
      d.start && await d.start(g);
    },
    async pull(g) {
      for (; ; ) {
        const { value: B, done: u } = await x.read();
        if (u) {
          d.flush && await d.flush(g), x.releaseLock(), g.close();
          return;
        }
        if (!d.transform) {
          g.enqueue(B);
          return;
        }
        let b = !1;
        const K = {
          enqueue(C) {
            b = !0, g.enqueue(C);
          }
        };
        if (await d.transform(B, K), b)
          return;
      }
    },
    cancel(g) {
      x.cancel(g), d.cancel && d.cancel(g), f && f(g);
    }
  });
}
typeof window < "u" && (window.Buffer = z.Buffer);
const ne = 12, $r = 16, hr = 16, _r = "encrypt", Hr = "decrypt", Or = 1024 * 64, zr = new TextEncoder();
function ie(l) {
  const c = new Uint8Array(l);
  return crypto.getRandomValues(c), c.buffer;
}
class Gr {
  constructor(c, f, x, d) {
    this.mode = c, this.prevChunk, this.seq = 0, this.firstchunk = !0, this.rs = x, this.ikm = f.buffer, this.salt = d;
  }
  async generateKey() {
    const c = await crypto.subtle.importKey(
      "raw",
      this.ikm,
      "HKDF",
      !1,
      ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
      {
        name: "HKDF",
        salt: this.salt,
        info: zr.encode("Content-Encoding: aes128gcm\0"),
        hash: "SHA-256"
      },
      c,
      {
        name: "AES-GCM",
        length: 128
      },
      !0,
      // Edge polyfill requires key to be extractable to encrypt :/
      ["encrypt", "decrypt"]
    );
  }
  async generateNonceBase() {
    const c = await crypto.subtle.importKey(
      "raw",
      this.ikm,
      "HKDF",
      !1,
      ["deriveKey"]
    ), f = await crypto.subtle.exportKey(
      "raw",
      await crypto.subtle.deriveKey(
        {
          name: "HKDF",
          salt: this.salt,
          info: zr.encode("Content-Encoding: nonce\0"),
          hash: "SHA-256"
        },
        c,
        {
          name: "AES-GCM",
          length: 128
        },
        !0,
        ["encrypt", "decrypt"]
      )
    );
    return z.Buffer.from(f.slice(0, ne));
  }
  generateNonce(c) {
    if (c > 4294967295)
      throw new Error("record sequence number exceeds limit");
    const f = z.Buffer.from(this.nonceBase), d = (f.readUIntBE(f.length - 4, 4) ^ c) >>> 0;
    return f.writeUIntBE(d, f.length - 4, 4), f;
  }
  pad(c, f) {
    const x = c.length;
    if (x + $r >= this.rs)
      throw new Error("data too large for record size");
    if (f) {
      const d = z.Buffer.alloc(1);
      return d.writeUInt8(2, 0), z.Buffer.concat([c, d]);
    } else {
      const d = z.Buffer.alloc(this.rs - x - $r);
      return d.fill(0), d.writeUInt8(1, 0), z.Buffer.concat([c, d]);
    }
  }
  unpad(c, f) {
    for (let x = c.length - 1; x >= 0; x--)
      if (c[x]) {
        if (f) {
          if (c[x] !== 2)
            throw new Error("delimiter of final record is not 2");
        } else if (c[x] !== 1)
          throw new Error("delimiter of not final record is not 1");
        return c.slice(0, x);
      }
    throw new Error("no delimiter found");
  }
  createHeader() {
    const c = z.Buffer.alloc(5);
    return c.writeUIntBE(this.rs, 0, 4), c.writeUIntBE(0, 4, 1), z.Buffer.concat([z.Buffer.from(this.salt), c]);
  }
  readHeader(c) {
    if (c.length < 21)
      throw new Error("chunk too small for reading header");
    const f = {};
    f.salt = c.buffer.slice(0, hr), f.rs = c.readUIntBE(hr, 4);
    const x = c.readUInt8(hr + 4);
    return f.length = x + hr + 5, f;
  }
  async encryptRecord(c, f, x) {
    const d = this.generateNonce(f), g = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: d },
      this.key,
      this.pad(c, x)
    );
    return z.Buffer.from(g);
  }
  async decryptRecord(c, f, x) {
    const d = this.generateNonce(f), g = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: d,
        tagLength: 128
      },
      this.key,
      c
    );
    return this.unpad(z.Buffer.from(g), x);
  }
  async start(c) {
    if (this.mode === _r)
      this.key = await this.generateKey(), this.nonceBase = await this.generateNonceBase(), c.enqueue(this.createHeader());
    else if (this.mode !== Hr)
      throw new Error("mode must be either encrypt or decrypt");
  }
  async transformPrevChunk(c, f) {
    if (this.mode === _r)
      f.enqueue(
        await this.encryptRecord(this.prevChunk, this.seq, c)
      ), this.seq++;
    else {
      if (this.seq === 0) {
        const x = this.readHeader(this.prevChunk);
        this.salt = x.salt, this.rs = x.rs, this.key = await this.generateKey(), this.nonceBase = await this.generateNonceBase();
      } else
        f.enqueue(
          await this.decryptRecord(this.prevChunk, this.seq - 1, c)
        );
      this.seq++;
    }
  }
  async transform(c, f) {
    this.firstchunk || await this.transformPrevChunk(!1, f), this.firstchunk = !1, this.prevChunk = z.Buffer.from(c.buffer);
  }
  async flush(c) {
    this.prevChunk && await this.transformPrevChunk(!0, c);
  }
}
class Yr {
  constructor(c, f) {
    this.mode = f, this.rs = c, this.chunkSize = f === _r ? c - 17 : 21, this.partialChunk = new Uint8Array(this.chunkSize), this.offset = 0;
  }
  send(c, f) {
    f.enqueue(c), this.chunkSize === 21 && this.mode === Hr && (this.chunkSize = this.rs), this.partialChunk = new Uint8Array(this.chunkSize), this.offset = 0;
  }
  //reslice input into record sized chunks
  transform(c, f) {
    let x = 0;
    if (this.offset > 0) {
      const d = Math.min(c.byteLength, this.chunkSize - this.offset);
      this.partialChunk.set(c.slice(0, d), this.offset), this.offset += d, x += d, this.offset === this.chunkSize && this.send(this.partialChunk, f);
    }
    for (; x < c.byteLength; ) {
      const d = c.byteLength - x;
      if (d >= this.chunkSize) {
        const g = c.slice(x, x + this.chunkSize);
        x += this.chunkSize, this.send(g, f);
      } else {
        const g = c.slice(x, x + d);
        x += g.byteLength, this.partialChunk.set(g), this.offset = g.byteLength;
      }
    }
  }
  flush(c) {
    this.offset > 0 && c.enqueue(this.partialChunk.slice(0, this.offset));
  }
}
function oe(l, c, f = Or, x = ie(hr)) {
  const d = "encrypt", g = pr(l, new Yr(f, d));
  return pr(g, new Gr(d, c, f, x));
}
function ue(l, c, f = Or) {
  const x = "decrypt", d = pr(l, new Yr(f, x));
  return pr(d, new Gr(x, c, f));
}
const fr = new TextEncoder(), ae = new TextDecoder();
class se {
  constructor(c, f) {
    this._nonce = f || "yRCdyQ1EMSA3mo4rqSkuNQ==", c ? this.rawSecret = cr.b64ToArray(c) : this.rawSecret = crypto.getRandomValues(new Uint8Array(16)), this.secretKeyPromise = crypto.subtle.importKey(
      "raw",
      this.rawSecret,
      "HKDF",
      !1,
      ["deriveKey"]
    ), this.metaKeyPromise = this.secretKeyPromise.then(function(x) {
      return crypto.subtle.deriveKey(
        {
          name: "HKDF",
          salt: new Uint8Array(),
          info: fr.encode("metadata"),
          hash: "SHA-256"
        },
        x,
        {
          name: "AES-GCM",
          length: 128
        },
        !1,
        ["encrypt", "decrypt"]
      );
    }), this.authKeyPromise = this.secretKeyPromise.then(function(x) {
      return crypto.subtle.deriveKey(
        {
          name: "HKDF",
          salt: new Uint8Array(),
          info: fr.encode("authentication"),
          hash: "SHA-256"
        },
        x,
        {
          name: "HMAC",
          hash: { name: "SHA-256" }
        },
        !0,
        ["sign"]
      );
    });
  }
  get nonce() {
    return this._nonce;
  }
  set nonce(c) {
    c && c !== this._nonce && (this._nonce = c);
  }
  setPassword(c, f) {
    this.authKeyPromise = crypto.subtle.importKey("raw", fr.encode(c), { name: "PBKDF2" }, !1, [
      "deriveKey"
    ]).then(
      (x) => crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: fr.encode(f),
          iterations: 100,
          hash: "SHA-256"
        },
        x,
        {
          name: "HMAC",
          hash: "SHA-256"
        },
        !0,
        ["sign"]
      )
    );
  }
  setAuthKey(c) {
    this.authKeyPromise = crypto.subtle.importKey(
      "raw",
      cr.b64ToArray(c),
      {
        name: "HMAC",
        hash: "SHA-256"
      },
      !0,
      ["sign"]
    );
  }
  async authKeyB64() {
    const c = await this.authKeyPromise, f = await crypto.subtle.exportKey("raw", c);
    return cr.arrayToB64(new Uint8Array(f));
  }
  async authHeader() {
    const c = await this.authKeyPromise, f = await crypto.subtle.sign(
      {
        name: "HMAC"
      },
      c,
      cr.b64ToArray(this.nonce)
    );
    return `send-v1 ${cr.arrayToB64(new Uint8Array(f))}`;
  }
  async encryptMetadata(c) {
    const f = await this.metaKeyPromise;
    return await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(12),
        tagLength: 128
      },
      f,
      fr.encode(
        JSON.stringify({
          name: c.name,
          size: c.size,
          type: c.type || "application/octet-stream",
          manifest: c.manifest || {}
        })
      )
    );
  }
  encryptStream(c) {
    return oe(c, this.rawSecret);
  }
  decryptStream(c) {
    return ue(c, this.rawSecret);
  }
  async decryptMetadata(c) {
    const f = await this.metaKeyPromise, x = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(12),
        tagLength: 128
      },
      f,
      c
    );
    return JSON.parse(ae.decode(x));
  }
}
let Nr = null;
try {
  Nr = localStorage.getItem("wssURL");
} catch {
}
Nr || (Nr = "wss://send.firefox.com/api/ws");
let ce = "";
function fe(l) {
  return ce + l;
}
function he(l) {
  return l = l || "", l.split(" ")[1];
}
async function pe(l, c, f) {
  const x = await c.authHeader(), d = await fetch(fe(`/api/download/${l}`), {
    signal: f,
    method: "GET",
    headers: { Authorization: x }
  }), g = d.headers.get("WWW-Authenticate");
  if (g && (c.nonce = he(g)), d.status !== 200)
    throw new Error(d.status);
  return d.body;
}
async function Vr(l, c, f, x = 2) {
  try {
    return await pe(l, c, f);
  } catch (d) {
    if (d.message === "401" && --x > 0)
      return Vr(l, c, f, x);
    throw d.name === "AbortError" ? new Error("0") : d;
  }
}
function le(l, c) {
  const f = new AbortController();
  function x() {
    f.abort();
  }
  return {
    cancel: x,
    result: Vr(l, c, f.signal)
  };
}
var J = {};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(l) {
  var c = j, f = wr, x = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  l.Buffer = u, l.SlowBuffer = Er, l.INSPECT_MAX_BYTES = 50;
  var d = 2147483647;
  l.kMaxLength = d, u.TYPED_ARRAY_SUPPORT = g(), !u.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function g() {
    try {
      var o = new Uint8Array(1), t = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(t, Uint8Array.prototype), Object.setPrototypeOf(o, t), o.foo() === 42;
    } catch {
      return !1;
    }
  }
  Object.defineProperty(u.prototype, "parent", {
    enumerable: !0,
    get: function() {
      if (u.isBuffer(this))
        return this.buffer;
    }
  }), Object.defineProperty(u.prototype, "offset", {
    enumerable: !0,
    get: function() {
      if (u.isBuffer(this))
        return this.byteOffset;
    }
  });
  function B(o) {
    if (o > d)
      throw new RangeError('The value "' + o + '" is invalid for option "size"');
    var t = new Uint8Array(o);
    return Object.setPrototypeOf(t, u.prototype), t;
  }
  function u(o, t, n) {
    if (typeof o == "number") {
      if (typeof t == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return L(o);
    }
    return b(o, t, n);
  }
  u.poolSize = 8192;
  function b(o, t, n) {
    if (typeof o == "string")
      return M(o, t);
    if (ArrayBuffer.isView(o))
      return H(o);
    if (o == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof o
      );
    if (q(o, ArrayBuffer) || o && q(o.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (q(o, SharedArrayBuffer) || o && q(o.buffer, SharedArrayBuffer)))
      return Y(o, t, n);
    if (typeof o == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    var s = o.valueOf && o.valueOf();
    if (s != null && s !== o)
      return u.from(s, t, n);
    var p = mr(o);
    if (p) return p;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof o[Symbol.toPrimitive] == "function")
      return u.from(
        o[Symbol.toPrimitive]("string"),
        t,
        n
      );
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof o
    );
  }
  u.from = function(o, t, n) {
    return b(o, t, n);
  }, Object.setPrototypeOf(u.prototype, Uint8Array.prototype), Object.setPrototypeOf(u, Uint8Array);
  function K(o) {
    if (typeof o != "number")
      throw new TypeError('"size" argument must be of type number');
    if (o < 0)
      throw new RangeError('The value "' + o + '" is invalid for option "size"');
  }
  function C(o, t, n) {
    return K(o), o <= 0 ? B(o) : t !== void 0 ? typeof n == "string" ? B(o).fill(t, n) : B(o).fill(t) : B(o);
  }
  u.alloc = function(o, t, n) {
    return C(o, t, n);
  };
  function L(o) {
    return K(o), B(o < 0 ? 0 : Z(o) | 0);
  }
  u.allocUnsafe = function(o) {
    return L(o);
  }, u.allocUnsafeSlow = function(o) {
    return L(o);
  };
  function M(o, t) {
    if ((typeof t != "string" || t === "") && (t = "utf8"), !u.isEncoding(t))
      throw new TypeError("Unknown encoding: " + t);
    var n = rr(o, t) | 0, s = B(n), p = s.write(o, t);
    return p !== n && (s = s.slice(0, p)), s;
  }
  function k(o) {
    for (var t = o.length < 0 ? 0 : Z(o.length) | 0, n = B(t), s = 0; s < t; s += 1)
      n[s] = o[s] & 255;
    return n;
  }
  function H(o) {
    if (q(o, Uint8Array)) {
      var t = new Uint8Array(o);
      return Y(t.buffer, t.byteOffset, t.byteLength);
    }
    return k(o);
  }
  function Y(o, t, n) {
    if (t < 0 || o.byteLength < t)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (o.byteLength < t + (n || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    var s;
    return t === void 0 && n === void 0 ? s = new Uint8Array(o) : n === void 0 ? s = new Uint8Array(o, t) : s = new Uint8Array(o, t, n), Object.setPrototypeOf(s, u.prototype), s;
  }
  function mr(o) {
    if (u.isBuffer(o)) {
      var t = Z(o.length) | 0, n = B(t);
      return n.length === 0 || o.copy(n, 0, 0, t), n;
    }
    if (o.length !== void 0)
      return typeof o.length != "number" || V(o.length) ? B(0) : k(o);
    if (o.type === "Buffer" && Array.isArray(o.data))
      return k(o.data);
  }
  function Z(o) {
    if (o >= d)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + d.toString(16) + " bytes");
    return o | 0;
  }
  function Er(o) {
    return +o != o && (o = 0), u.alloc(+o);
  }
  u.isBuffer = function(t) {
    return t != null && t._isBuffer === !0 && t !== u.prototype;
  }, u.compare = function(t, n) {
    if (q(t, Uint8Array) && (t = u.from(t, t.offset, t.byteLength)), q(n, Uint8Array) && (n = u.from(n, n.offset, n.byteLength)), !u.isBuffer(t) || !u.isBuffer(n))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (t === n) return 0;
    for (var s = t.length, p = n.length, m = 0, E = Math.min(s, p); m < E; ++m)
      if (t[m] !== n[m]) {
        s = t[m], p = n[m];
        break;
      }
    return s < p ? -1 : p < s ? 1 : 0;
  }, u.isEncoding = function(t) {
    switch (String(t).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return !0;
      default:
        return !1;
    }
  }, u.concat = function(t, n) {
    if (!Array.isArray(t))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (t.length === 0)
      return u.alloc(0);
    var s;
    if (n === void 0)
      for (n = 0, s = 0; s < t.length; ++s)
        n += t[s].length;
    var p = u.allocUnsafe(n), m = 0;
    for (s = 0; s < t.length; ++s) {
      var E = t[s];
      if (q(E, Uint8Array))
        m + E.length > p.length ? u.from(E).copy(p, m) : Uint8Array.prototype.set.call(
          p,
          E,
          m
        );
      else if (u.isBuffer(E))
        E.copy(p, m);
      else
        throw new TypeError('"list" argument must be an Array of Buffers');
      m += E.length;
    }
    return p;
  };
  function rr(o, t) {
    if (u.isBuffer(o))
      return o.length;
    if (ArrayBuffer.isView(o) || q(o, ArrayBuffer))
      return o.byteLength;
    if (typeof o != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof o
      );
    var n = o.length, s = arguments.length > 2 && arguments[2] === !0;
    if (!s && n === 0) return 0;
    for (var p = !1; ; )
      switch (t) {
        case "ascii":
        case "latin1":
        case "binary":
          return n;
        case "utf8":
        case "utf-8":
          return O(o).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return n * 2;
        case "hex":
          return n >>> 1;
        case "base64":
          return dr(o).length;
        default:
          if (p)
            return s ? -1 : O(o).length;
          t = ("" + t).toLowerCase(), p = !0;
      }
  }
  u.byteLength = rr;
  function gr(o, t, n) {
    var s = !1;
    if ((t === void 0 || t < 0) && (t = 0), t > this.length || ((n === void 0 || n > this.length) && (n = this.length), n <= 0) || (n >>>= 0, t >>>= 0, n <= t))
      return "";
    for (o || (o = "utf8"); ; )
      switch (o) {
        case "hex":
          return Cr(this, t, n);
        case "utf8":
        case "utf-8":
          return nr(this, t, n);
        case "ascii":
          return Tr(this, t, n);
        case "latin1":
        case "binary":
          return Rr(this, t, n);
        case "base64":
          return Ir(this, t, n);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return Lr(this, t, n);
        default:
          if (s) throw new TypeError("Unknown encoding: " + o);
          o = (o + "").toLowerCase(), s = !0;
      }
  }
  u.prototype._isBuffer = !0;
  function $(o, t, n) {
    var s = o[t];
    o[t] = o[n], o[n] = s;
  }
  u.prototype.swap16 = function() {
    var t = this.length;
    if (t % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (var n = 0; n < t; n += 2)
      $(this, n, n + 1);
    return this;
  }, u.prototype.swap32 = function() {
    var t = this.length;
    if (t % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (var n = 0; n < t; n += 4)
      $(this, n, n + 3), $(this, n + 1, n + 2);
    return this;
  }, u.prototype.swap64 = function() {
    var t = this.length;
    if (t % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (var n = 0; n < t; n += 8)
      $(this, n, n + 7), $(this, n + 1, n + 6), $(this, n + 2, n + 5), $(this, n + 3, n + 4);
    return this;
  }, u.prototype.toString = function() {
    var t = this.length;
    return t === 0 ? "" : arguments.length === 0 ? nr(this, 0, t) : gr.apply(this, arguments);
  }, u.prototype.toLocaleString = u.prototype.toString, u.prototype.equals = function(t) {
    if (!u.isBuffer(t)) throw new TypeError("Argument must be a Buffer");
    return this === t ? !0 : u.compare(this, t) === 0;
  }, u.prototype.inspect = function() {
    var t = "", n = l.INSPECT_MAX_BYTES;
    return t = this.toString("hex", 0, n).replace(/(.{2})/g, "$1 ").trim(), this.length > n && (t += " ... "), "<Buffer " + t + ">";
  }, x && (u.prototype[x] = u.prototype.inspect), u.prototype.compare = function(t, n, s, p, m) {
    if (q(t, Uint8Array) && (t = u.from(t, t.offset, t.byteLength)), !u.isBuffer(t))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof t
      );
    if (n === void 0 && (n = 0), s === void 0 && (s = t ? t.length : 0), p === void 0 && (p = 0), m === void 0 && (m = this.length), n < 0 || s > t.length || p < 0 || m > this.length)
      throw new RangeError("out of range index");
    if (p >= m && n >= s)
      return 0;
    if (p >= m)
      return -1;
    if (n >= s)
      return 1;
    if (n >>>= 0, s >>>= 0, p >>>= 0, m >>>= 0, this === t) return 0;
    for (var E = m - p, A = s - n, T = Math.min(E, A), I = this.slice(p, m), P = t.slice(n, s), i = 0; i < T; ++i)
      if (I[i] !== P[i]) {
        E = I[i], A = P[i];
        break;
      }
    return E < A ? -1 : A < E ? 1 : 0;
  };
  function er(o, t, n, s, p) {
    if (o.length === 0) return -1;
    if (typeof n == "string" ? (s = n, n = 0) : n > 2147483647 ? n = 2147483647 : n < -2147483648 && (n = -2147483648), n = +n, V(n) && (n = p ? 0 : o.length - 1), n < 0 && (n = o.length + n), n >= o.length) {
      if (p) return -1;
      n = o.length - 1;
    } else if (n < 0)
      if (p) n = 0;
      else return -1;
    if (typeof t == "string" && (t = u.from(t, s)), u.isBuffer(t))
      return t.length === 0 ? -1 : tr(o, t, n, s, p);
    if (typeof t == "number")
      return t = t & 255, typeof Uint8Array.prototype.indexOf == "function" ? p ? Uint8Array.prototype.indexOf.call(o, t, n) : Uint8Array.prototype.lastIndexOf.call(o, t, n) : tr(o, [t], n, s, p);
    throw new TypeError("val must be string, number or Buffer");
  }
  function tr(o, t, n, s, p) {
    var m = 1, E = o.length, A = t.length;
    if (s !== void 0 && (s = String(s).toLowerCase(), s === "ucs2" || s === "ucs-2" || s === "utf16le" || s === "utf-16le")) {
      if (o.length < 2 || t.length < 2)
        return -1;
      m = 2, E /= 2, A /= 2, n /= 2;
    }
    function T(e, a) {
      return m === 1 ? e[a] : e.readUInt16BE(a * m);
    }
    var I;
    if (p) {
      var P = -1;
      for (I = n; I < E; I++)
        if (T(o, I) === T(t, P === -1 ? 0 : I - P)) {
          if (P === -1 && (P = I), I - P + 1 === A) return P * m;
        } else
          P !== -1 && (I -= I - P), P = -1;
    } else
      for (n + A > E && (n = E - A), I = n; I >= 0; I--) {
        for (var i = !0, r = 0; r < A; r++)
          if (T(o, I + r) !== T(t, r)) {
            i = !1;
            break;
          }
        if (i) return I;
      }
    return -1;
  }
  u.prototype.includes = function(t, n, s) {
    return this.indexOf(t, n, s) !== -1;
  }, u.prototype.indexOf = function(t, n, s) {
    return er(this, t, n, s, !0);
  }, u.prototype.lastIndexOf = function(t, n, s) {
    return er(this, t, n, s, !1);
  };
  function Br(o, t, n, s) {
    n = Number(n) || 0;
    var p = o.length - n;
    s ? (s = Number(s), s > p && (s = p)) : s = p;
    var m = t.length;
    s > m / 2 && (s = m / 2);
    for (var E = 0; E < s; ++E) {
      var A = parseInt(t.substr(E * 2, 2), 16);
      if (V(A)) return E;
      o[n + E] = A;
    }
    return E;
  }
  function br(o, t, n, s) {
    return Q(O(t, o.length - n), o, n, s);
  }
  function Ur(o, t, n, s) {
    return Q(sr(t), o, n, s);
  }
  function Ar(o, t, n, s) {
    return Q(dr(t), o, n, s);
  }
  function Fr(o, t, n, s) {
    return Q(yr(t, o.length - n), o, n, s);
  }
  u.prototype.write = function(t, n, s, p) {
    if (n === void 0)
      p = "utf8", s = this.length, n = 0;
    else if (s === void 0 && typeof n == "string")
      p = n, s = this.length, n = 0;
    else if (isFinite(n))
      n = n >>> 0, isFinite(s) ? (s = s >>> 0, p === void 0 && (p = "utf8")) : (p = s, s = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    var m = this.length - n;
    if ((s === void 0 || s > m) && (s = m), t.length > 0 && (s < 0 || n < 0) || n > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    p || (p = "utf8");
    for (var E = !1; ; )
      switch (p) {
        case "hex":
          return Br(this, t, n, s);
        case "utf8":
        case "utf-8":
          return br(this, t, n, s);
        case "ascii":
        case "latin1":
        case "binary":
          return Ur(this, t, n, s);
        case "base64":
          return Ar(this, t, n, s);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return Fr(this, t, n, s);
        default:
          if (E) throw new TypeError("Unknown encoding: " + p);
          p = ("" + p).toLowerCase(), E = !0;
      }
  }, u.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function Ir(o, t, n) {
    return t === 0 && n === o.length ? c.fromByteArray(o) : c.fromByteArray(o.slice(t, n));
  }
  function nr(o, t, n) {
    n = Math.min(o.length, n);
    for (var s = [], p = t; p < n; ) {
      var m = o[p], E = null, A = m > 239 ? 4 : m > 223 ? 3 : m > 191 ? 2 : 1;
      if (p + A <= n) {
        var T, I, P, i;
        switch (A) {
          case 1:
            m < 128 && (E = m);
            break;
          case 2:
            T = o[p + 1], (T & 192) === 128 && (i = (m & 31) << 6 | T & 63, i > 127 && (E = i));
            break;
          case 3:
            T = o[p + 1], I = o[p + 2], (T & 192) === 128 && (I & 192) === 128 && (i = (m & 15) << 12 | (T & 63) << 6 | I & 63, i > 2047 && (i < 55296 || i > 57343) && (E = i));
            break;
          case 4:
            T = o[p + 1], I = o[p + 2], P = o[p + 3], (T & 192) === 128 && (I & 192) === 128 && (P & 192) === 128 && (i = (m & 15) << 18 | (T & 63) << 12 | (I & 63) << 6 | P & 63, i > 65535 && i < 1114112 && (E = i));
        }
      }
      E === null ? (E = 65533, A = 1) : E > 65535 && (E -= 65536, s.push(E >>> 10 & 1023 | 55296), E = 56320 | E & 1023), s.push(E), p += A;
    }
    return Sr(s);
  }
  var ir = 4096;
  function Sr(o) {
    var t = o.length;
    if (t <= ir)
      return String.fromCharCode.apply(String, o);
    for (var n = "", s = 0; s < t; )
      n += String.fromCharCode.apply(
        String,
        o.slice(s, s += ir)
      );
    return n;
  }
  function Tr(o, t, n) {
    var s = "";
    n = Math.min(o.length, n);
    for (var p = t; p < n; ++p)
      s += String.fromCharCode(o[p] & 127);
    return s;
  }
  function Rr(o, t, n) {
    var s = "";
    n = Math.min(o.length, n);
    for (var p = t; p < n; ++p)
      s += String.fromCharCode(o[p]);
    return s;
  }
  function Cr(o, t, n) {
    var s = o.length;
    (!t || t < 0) && (t = 0), (!n || n < 0 || n > s) && (n = s);
    for (var p = "", m = t; m < n; ++m)
      p += kr[o[m]];
    return p;
  }
  function Lr(o, t, n) {
    for (var s = o.slice(t, n), p = "", m = 0; m < s.length - 1; m += 2)
      p += String.fromCharCode(s[m] + s[m + 1] * 256);
    return p;
  }
  u.prototype.slice = function(t, n) {
    var s = this.length;
    t = ~~t, n = n === void 0 ? s : ~~n, t < 0 ? (t += s, t < 0 && (t = 0)) : t > s && (t = s), n < 0 ? (n += s, n < 0 && (n = 0)) : n > s && (n = s), n < t && (n = t);
    var p = this.subarray(t, n);
    return Object.setPrototypeOf(p, u.prototype), p;
  };
  function U(o, t, n) {
    if (o % 1 !== 0 || o < 0) throw new RangeError("offset is not uint");
    if (o + t > n) throw new RangeError("Trying to access beyond buffer length");
  }
  u.prototype.readUintLE = u.prototype.readUIntLE = function(t, n, s) {
    t = t >>> 0, n = n >>> 0, s || U(t, n, this.length);
    for (var p = this[t], m = 1, E = 0; ++E < n && (m *= 256); )
      p += this[t + E] * m;
    return p;
  }, u.prototype.readUintBE = u.prototype.readUIntBE = function(t, n, s) {
    t = t >>> 0, n = n >>> 0, s || U(t, n, this.length);
    for (var p = this[t + --n], m = 1; n > 0 && (m *= 256); )
      p += this[t + --n] * m;
    return p;
  }, u.prototype.readUint8 = u.prototype.readUInt8 = function(t, n) {
    return t = t >>> 0, n || U(t, 1, this.length), this[t];
  }, u.prototype.readUint16LE = u.prototype.readUInt16LE = function(t, n) {
    return t = t >>> 0, n || U(t, 2, this.length), this[t] | this[t + 1] << 8;
  }, u.prototype.readUint16BE = u.prototype.readUInt16BE = function(t, n) {
    return t = t >>> 0, n || U(t, 2, this.length), this[t] << 8 | this[t + 1];
  }, u.prototype.readUint32LE = u.prototype.readUInt32LE = function(t, n) {
    return t = t >>> 0, n || U(t, 4, this.length), (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + this[t + 3] * 16777216;
  }, u.prototype.readUint32BE = u.prototype.readUInt32BE = function(t, n) {
    return t = t >>> 0, n || U(t, 4, this.length), this[t] * 16777216 + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]);
  }, u.prototype.readIntLE = function(t, n, s) {
    t = t >>> 0, n = n >>> 0, s || U(t, n, this.length);
    for (var p = this[t], m = 1, E = 0; ++E < n && (m *= 256); )
      p += this[t + E] * m;
    return m *= 128, p >= m && (p -= Math.pow(2, 8 * n)), p;
  }, u.prototype.readIntBE = function(t, n, s) {
    t = t >>> 0, n = n >>> 0, s || U(t, n, this.length);
    for (var p = n, m = 1, E = this[t + --p]; p > 0 && (m *= 256); )
      E += this[t + --p] * m;
    return m *= 128, E >= m && (E -= Math.pow(2, 8 * n)), E;
  }, u.prototype.readInt8 = function(t, n) {
    return t = t >>> 0, n || U(t, 1, this.length), this[t] & 128 ? (255 - this[t] + 1) * -1 : this[t];
  }, u.prototype.readInt16LE = function(t, n) {
    t = t >>> 0, n || U(t, 2, this.length);
    var s = this[t] | this[t + 1] << 8;
    return s & 32768 ? s | 4294901760 : s;
  }, u.prototype.readInt16BE = function(t, n) {
    t = t >>> 0, n || U(t, 2, this.length);
    var s = this[t + 1] | this[t] << 8;
    return s & 32768 ? s | 4294901760 : s;
  }, u.prototype.readInt32LE = function(t, n) {
    return t = t >>> 0, n || U(t, 4, this.length), this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24;
  }, u.prototype.readInt32BE = function(t, n) {
    return t = t >>> 0, n || U(t, 4, this.length), this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3];
  }, u.prototype.readFloatLE = function(t, n) {
    return t = t >>> 0, n || U(t, 4, this.length), f.read(this, t, !0, 23, 4);
  }, u.prototype.readFloatBE = function(t, n) {
    return t = t >>> 0, n || U(t, 4, this.length), f.read(this, t, !1, 23, 4);
  }, u.prototype.readDoubleLE = function(t, n) {
    return t = t >>> 0, n || U(t, 8, this.length), f.read(this, t, !0, 52, 8);
  }, u.prototype.readDoubleBE = function(t, n) {
    return t = t >>> 0, n || U(t, 8, this.length), f.read(this, t, !1, 52, 8);
  };
  function S(o, t, n, s, p, m) {
    if (!u.isBuffer(o)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (t > p || t < m) throw new RangeError('"value" argument is out of bounds');
    if (n + s > o.length) throw new RangeError("Index out of range");
  }
  u.prototype.writeUintLE = u.prototype.writeUIntLE = function(t, n, s, p) {
    if (t = +t, n = n >>> 0, s = s >>> 0, !p) {
      var m = Math.pow(2, 8 * s) - 1;
      S(this, t, n, s, m, 0);
    }
    var E = 1, A = 0;
    for (this[n] = t & 255; ++A < s && (E *= 256); )
      this[n + A] = t / E & 255;
    return n + s;
  }, u.prototype.writeUintBE = u.prototype.writeUIntBE = function(t, n, s, p) {
    if (t = +t, n = n >>> 0, s = s >>> 0, !p) {
      var m = Math.pow(2, 8 * s) - 1;
      S(this, t, n, s, m, 0);
    }
    var E = s - 1, A = 1;
    for (this[n + E] = t & 255; --E >= 0 && (A *= 256); )
      this[n + E] = t / A & 255;
    return n + s;
  }, u.prototype.writeUint8 = u.prototype.writeUInt8 = function(t, n, s) {
    return t = +t, n = n >>> 0, s || S(this, t, n, 1, 255, 0), this[n] = t & 255, n + 1;
  }, u.prototype.writeUint16LE = u.prototype.writeUInt16LE = function(t, n, s) {
    return t = +t, n = n >>> 0, s || S(this, t, n, 2, 65535, 0), this[n] = t & 255, this[n + 1] = t >>> 8, n + 2;
  }, u.prototype.writeUint16BE = u.prototype.writeUInt16BE = function(t, n, s) {
    return t = +t, n = n >>> 0, s || S(this, t, n, 2, 65535, 0), this[n] = t >>> 8, this[n + 1] = t & 255, n + 2;
  }, u.prototype.writeUint32LE = u.prototype.writeUInt32LE = function(t, n, s) {
    return t = +t, n = n >>> 0, s || S(this, t, n, 4, 4294967295, 0), this[n + 3] = t >>> 24, this[n + 2] = t >>> 16, this[n + 1] = t >>> 8, this[n] = t & 255, n + 4;
  }, u.prototype.writeUint32BE = u.prototype.writeUInt32BE = function(t, n, s) {
    return t = +t, n = n >>> 0, s || S(this, t, n, 4, 4294967295, 0), this[n] = t >>> 24, this[n + 1] = t >>> 16, this[n + 2] = t >>> 8, this[n + 3] = t & 255, n + 4;
  }, u.prototype.writeIntLE = function(t, n, s, p) {
    if (t = +t, n = n >>> 0, !p) {
      var m = Math.pow(2, 8 * s - 1);
      S(this, t, n, s, m - 1, -m);
    }
    var E = 0, A = 1, T = 0;
    for (this[n] = t & 255; ++E < s && (A *= 256); )
      t < 0 && T === 0 && this[n + E - 1] !== 0 && (T = 1), this[n + E] = (t / A >> 0) - T & 255;
    return n + s;
  }, u.prototype.writeIntBE = function(t, n, s, p) {
    if (t = +t, n = n >>> 0, !p) {
      var m = Math.pow(2, 8 * s - 1);
      S(this, t, n, s, m - 1, -m);
    }
    var E = s - 1, A = 1, T = 0;
    for (this[n + E] = t & 255; --E >= 0 && (A *= 256); )
      t < 0 && T === 0 && this[n + E + 1] !== 0 && (T = 1), this[n + E] = (t / A >> 0) - T & 255;
    return n + s;
  }, u.prototype.writeInt8 = function(t, n, s) {
    return t = +t, n = n >>> 0, s || S(this, t, n, 1, 127, -128), t < 0 && (t = 255 + t + 1), this[n] = t & 255, n + 1;
  }, u.prototype.writeInt16LE = function(t, n, s) {
    return t = +t, n = n >>> 0, s || S(this, t, n, 2, 32767, -32768), this[n] = t & 255, this[n + 1] = t >>> 8, n + 2;
  }, u.prototype.writeInt16BE = function(t, n, s) {
    return t = +t, n = n >>> 0, s || S(this, t, n, 2, 32767, -32768), this[n] = t >>> 8, this[n + 1] = t & 255, n + 2;
  }, u.prototype.writeInt32LE = function(t, n, s) {
    return t = +t, n = n >>> 0, s || S(this, t, n, 4, 2147483647, -2147483648), this[n] = t & 255, this[n + 1] = t >>> 8, this[n + 2] = t >>> 16, this[n + 3] = t >>> 24, n + 4;
  }, u.prototype.writeInt32BE = function(t, n, s) {
    return t = +t, n = n >>> 0, s || S(this, t, n, 4, 2147483647, -2147483648), t < 0 && (t = 4294967295 + t + 1), this[n] = t >>> 24, this[n + 1] = t >>> 16, this[n + 2] = t >>> 8, this[n + 3] = t & 255, n + 4;
  };
  function or(o, t, n, s, p, m) {
    if (n + s > o.length) throw new RangeError("Index out of range");
    if (n < 0) throw new RangeError("Index out of range");
  }
  function ur(o, t, n, s, p) {
    return t = +t, n = n >>> 0, p || or(o, t, n, 4), f.write(o, t, n, s, 23, 4), n + 4;
  }
  u.prototype.writeFloatLE = function(t, n, s) {
    return ur(this, t, n, !0, s);
  }, u.prototype.writeFloatBE = function(t, n, s) {
    return ur(this, t, n, !1, s);
  };
  function ar(o, t, n, s, p) {
    return t = +t, n = n >>> 0, p || or(o, t, n, 8), f.write(o, t, n, s, 52, 8), n + 8;
  }
  u.prototype.writeDoubleLE = function(t, n, s) {
    return ar(this, t, n, !0, s);
  }, u.prototype.writeDoubleBE = function(t, n, s) {
    return ar(this, t, n, !1, s);
  }, u.prototype.copy = function(t, n, s, p) {
    if (!u.isBuffer(t)) throw new TypeError("argument should be a Buffer");
    if (s || (s = 0), !p && p !== 0 && (p = this.length), n >= t.length && (n = t.length), n || (n = 0), p > 0 && p < s && (p = s), p === s || t.length === 0 || this.length === 0) return 0;
    if (n < 0)
      throw new RangeError("targetStart out of bounds");
    if (s < 0 || s >= this.length) throw new RangeError("Index out of range");
    if (p < 0) throw new RangeError("sourceEnd out of bounds");
    p > this.length && (p = this.length), t.length - n < p - s && (p = t.length - n + s);
    var m = p - s;
    return this === t && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(n, s, p) : Uint8Array.prototype.set.call(
      t,
      this.subarray(s, p),
      n
    ), m;
  }, u.prototype.fill = function(t, n, s, p) {
    if (typeof t == "string") {
      if (typeof n == "string" ? (p = n, n = 0, s = this.length) : typeof s == "string" && (p = s, s = this.length), p !== void 0 && typeof p != "string")
        throw new TypeError("encoding must be a string");
      if (typeof p == "string" && !u.isEncoding(p))
        throw new TypeError("Unknown encoding: " + p);
      if (t.length === 1) {
        var m = t.charCodeAt(0);
        (p === "utf8" && m < 128 || p === "latin1") && (t = m);
      }
    } else typeof t == "number" ? t = t & 255 : typeof t == "boolean" && (t = Number(t));
    if (n < 0 || this.length < n || this.length < s)
      throw new RangeError("Out of range index");
    if (s <= n)
      return this;
    n = n >>> 0, s = s === void 0 ? this.length : s >>> 0, t || (t = 0);
    var E;
    if (typeof t == "number")
      for (E = n; E < s; ++E)
        this[E] = t;
    else {
      var A = u.isBuffer(t) ? t : u.from(t, p), T = A.length;
      if (T === 0)
        throw new TypeError('The value "' + t + '" is invalid for argument "value"');
      for (E = 0; E < s - n; ++E)
        this[E + n] = A[E % T];
    }
    return this;
  };
  var lr = /[^+/0-9A-Za-z-_]/g;
  function xr(o) {
    if (o = o.split("=")[0], o = o.trim().replace(lr, ""), o.length < 2) return "";
    for (; o.length % 4 !== 0; )
      o = o + "=";
    return o;
  }
  function O(o, t) {
    t = t || 1 / 0;
    for (var n, s = o.length, p = null, m = [], E = 0; E < s; ++E) {
      if (n = o.charCodeAt(E), n > 55295 && n < 57344) {
        if (!p) {
          if (n > 56319) {
            (t -= 3) > -1 && m.push(239, 191, 189);
            continue;
          } else if (E + 1 === s) {
            (t -= 3) > -1 && m.push(239, 191, 189);
            continue;
          }
          p = n;
          continue;
        }
        if (n < 56320) {
          (t -= 3) > -1 && m.push(239, 191, 189), p = n;
          continue;
        }
        n = (p - 55296 << 10 | n - 56320) + 65536;
      } else p && (t -= 3) > -1 && m.push(239, 191, 189);
      if (p = null, n < 128) {
        if ((t -= 1) < 0) break;
        m.push(n);
      } else if (n < 2048) {
        if ((t -= 2) < 0) break;
        m.push(
          n >> 6 | 192,
          n & 63 | 128
        );
      } else if (n < 65536) {
        if ((t -= 3) < 0) break;
        m.push(
          n >> 12 | 224,
          n >> 6 & 63 | 128,
          n & 63 | 128
        );
      } else if (n < 1114112) {
        if ((t -= 4) < 0) break;
        m.push(
          n >> 18 | 240,
          n >> 12 & 63 | 128,
          n >> 6 & 63 | 128,
          n & 63 | 128
        );
      } else
        throw new Error("Invalid code point");
    }
    return m;
  }
  function sr(o) {
    for (var t = [], n = 0; n < o.length; ++n)
      t.push(o.charCodeAt(n) & 255);
    return t;
  }
  function yr(o, t) {
    for (var n, s, p, m = [], E = 0; E < o.length && !((t -= 2) < 0); ++E)
      n = o.charCodeAt(E), s = n >> 8, p = n % 256, m.push(p), m.push(s);
    return m;
  }
  function dr(o) {
    return c.toByteArray(xr(o));
  }
  function Q(o, t, n, s) {
    for (var p = 0; p < s && !(p + n >= t.length || p >= o.length); ++p)
      t[p + n] = o[p];
    return p;
  }
  function q(o, t) {
    return o instanceof t || o != null && o.constructor != null && o.constructor.name != null && o.constructor.name === t.name;
  }
  function V(o) {
    return o !== o;
  }
  var kr = function() {
    for (var o = "0123456789abcdef", t = new Array(256), n = 0; n < 16; ++n)
      for (var s = n * 16, p = 0; p < 16; ++p)
        t[s + p] = o[n] + o[p];
    return t;
  }();
})(J);
const xe = J.Buffer.from && J.Buffer.alloc && J.Buffer.allocUnsafe && J.Buffer.allocUnsafeSlow ? J.Buffer.from : (
  // support for Node < 5.10
  (l) => new J.Buffer(l)
);
function ye(l, c) {
  const f = (x, d) => c(x, d) >>> 0;
  return f.signed = c, f.unsigned = f, f.model = l, f;
}
let Kr = [
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
typeof Int32Array < "u" && (Kr = new Int32Array(Kr));
const de = ye("crc-32", function(l, c) {
  J.Buffer.isBuffer(l) || (l = xe(l));
  let f = c === 0 ? 0 : ~~c ^ -1;
  for (let x = 0; x < l.length; x++) {
    const d = l[x];
    f = Kr[(f ^ d) & 255] ^ f >>> 8;
  }
  return f ^ -1;
}), we = new TextEncoder();
function me(l = /* @__PURE__ */ new Date()) {
  const c = l.getFullYear() - 1980 << 9, f = l.getMonth() + 1 << 5, x = l.getDate(), d = c | f | x, g = l.getHours() << 11, B = l.getMinutes() << 5, u = Math.floor(l.getSeconds() / 2), b = g | B | u;
  return { date: d, time: b };
}
class Ee {
  constructor(c) {
    this.name = we.encode(c.name), this.size = c.size, this.bytesRead = 0, this.crc = null, this.dateTime = me();
  }
  get header() {
    const c = new ArrayBuffer(30 + this.name.byteLength), f = new DataView(c);
    f.setUint32(0, 67324752, !0), f.setUint16(4, 20, !0), f.setUint16(6, 2056, !0), f.setUint16(8, 0, !0), f.setUint16(10, this.dateTime.time, !0), f.setUint16(12, this.dateTime.date, !0), f.setUint32(14, 0, !0), f.setUint32(18, 0, !0), f.setUint32(22, 0, !0), f.setUint16(26, this.name.byteLength, !0), f.setUint16(28, 0, !0);
    for (let x = 0; x < this.name.byteLength; x++)
      f.setUint8(30 + x, this.name[x]);
    return new Uint8Array(c);
  }
  get dataDescriptor() {
    const c = new ArrayBuffer(16), f = new DataView(c);
    return f.setUint32(0, 134695760, !0), f.setUint32(4, this.crc, !0), f.setUint32(8, this.size, !0), f.setUint32(12, this.size, !0), new Uint8Array(c);
  }
  directoryRecord(c) {
    const f = new ArrayBuffer(46 + this.name.byteLength), x = new DataView(f);
    x.setUint32(0, 33639248, !0), x.setUint16(4, 20, !0), x.setUint16(6, 20, !0), x.setUint16(8, 2056, !0), x.setUint16(10, 0, !0), x.setUint16(12, this.dateTime.time, !0), x.setUint16(14, this.dateTime.date, !0), x.setUint32(16, this.crc, !0), x.setUint32(20, this.size, !0), x.setUint32(24, this.size, !0), x.setUint16(28, this.name.byteLength, !0), x.setUint16(30, 0, !0), x.setUint16(32, 0, !0), x.setUint16(34, 0, !0), x.setUint16(36, 0, !0), x.setUint32(38, 0, !0), x.setUint32(42, c, !0);
    for (let d = 0; d < this.name.byteLength; d++)
      x.setUint8(46 + d, this.name[d]);
    return new Uint8Array(f);
  }
  get byteLength() {
    return this.size + this.name.byteLength + 30 + 16;
  }
  append(c, f) {
    this.bytesRead += c.byteLength;
    const x = c.byteLength - Math.max(this.bytesRead - this.size, 0), d = c.slice(0, x);
    if (this.crc = de(d, this.crc), f.enqueue(d), x < c.byteLength)
      return c.slice(x, c.byteLength);
  }
}
function ge(l, c) {
  let f = 0, x = 0;
  for (let d = 0; d < l.length; d++) {
    const g = l[d], B = g.directoryRecord(f);
    f += g.byteLength, c.enqueue(B), x += B.byteLength;
  }
  c.enqueue(Be(l.length, x, f));
}
function Be(l, c, f) {
  const x = new ArrayBuffer(22), d = new DataView(x);
  return d.setUint32(0, 101010256, !0), d.setUint16(4, 0, !0), d.setUint16(6, 0, !0), d.setUint16(8, l, !0), d.setUint16(10, l, !0), d.setUint32(12, c, !0), d.setUint32(16, f, !0), d.setUint16(20, 0, !0), new Uint8Array(x);
}
class be {
  constructor(c, f) {
    this.files = c, this.fileIndex = 0, this.file = null, this.reader = f.getReader(), this.nextFile(), this.extra = null;
  }
  nextFile() {
    this.file = this.files[this.fileIndex++];
  }
  async pull(c) {
    if (!this.file)
      return ge(this.files, c), c.close();
    if (this.file.bytesRead === 0 && (c.enqueue(this.file.header), this.extra && (this.extra = this.file.append(this.extra, c))), this.file.bytesRead >= this.file.size)
      return c.enqueue(this.file.dataDescriptor), this.nextFile(), this.pull(c);
    const f = await this.reader.read();
    if (f.done)
      return this.nextFile(), this.pull(c);
    this.extra = this.file.append(f.value, c);
  }
}
class Ue {
  constructor(c, f) {
    this.files = c.files.map((x) => new Ee(x)), this.source = f;
  }
  get stream() {
    return new ReadableStream(new be(this.files, this.source));
  }
  get size() {
    return this.files.reduce(
      (x, d) => x + d.byteLength * 2 - d.size,
      0
    ) + 22;
  }
}
function Ae(l) {
  const c = l.replace(/[^\x20-\x7E]/g, "_"), f = encodeURIComponent(l);
  return `attachment; filename="${c}"; filename*=UTF-8''${f}`;
}
let Pr = !1;
const X = /* @__PURE__ */ new Map(), Fe = /\/api\/download\/([A-Fa-f0-9]{4,})/;
self.addEventListener("install", () => {
  self.skipWaiting();
});
self.addEventListener("activate", (l) => {
  l.waitUntil(self.clients.claim());
});
async function Ie(l, c) {
  const f = X.get(l);
  if (!f)
    return console.error("[SW] File not found in map for id:", l), new Response(null, { status: 400 });
  if (c && c.aborted)
    return console.log("[SW] Request already aborted for", l), X.delete(l), new Response(null, { status: 499 });
  console.log("[SW] Starting decryptStream for", l, "with nonce:", f.nonce);
  let x = null;
  try {
    let d = f.size, g = f.type;
    const B = new se(f.key, f.nonce);
    f.requiresPassword && B.setPassword(f.password, f.url), console.log("[SW] Calling downloadStream..."), f.download = le(l, B), c && typeof c.addEventListener == "function" && (x = () => {
      console.log("[SW] Request aborted for", l);
      try {
        f.download && typeof f.download.cancel == "function" && f.download.cancel();
      } catch (M) {
        console.warn("[SW] Failed to cancel download after abort", M);
      }
      X.delete(l);
    }, c.addEventListener("abort", x, { once: !0 }));
    const u = await f.download.result, b = B.decryptStream(u);
    let K = null;
    if (f.type === "send-archive") {
      const M = new Ue(f.manifest, b);
      K = M.stream, g = "application/zip", d = M.size;
    }
    const C = pr(
      K || b,
      {
        transform(M, k) {
          f.progress += M.length, c && x && f.progress >= d && c.removeEventListener("abort", x), k.enqueue(M);
        }
      },
      function() {
        f.download.cancel(), X.delete(l);
      }
    ), L = {
      "Content-Disposition": Ae(f.filename),
      "Content-Type": g,
      "Content-Length": d
    };
    return console.log("[SW] Returning decrypted stream response"), new Response(C, { headers: L });
  } catch (d) {
    return d && (d.message === "0" || d.name === "AbortError") ? (console.log("[SW] Download aborted for", l), new Response(null, { status: 499 })) : (console.error("[SW] Error in decryptStream:", d, "noSave:", Pr), Pr ? new Response(null, { status: d.message }) : (console.log("[SW] Redirecting to download page"), new Response(null, {
      status: 302,
      headers: {
        Location: `/download/${l}/#${f.key}`
      }
    })));
  } finally {
    c && x && c.removeEventListener("abort", x);
  }
}
self.addEventListener("fetch", (l) => {
  const c = l.request;
  if (c.method !== "GET") return;
  const f = new URL(c.url), x = Fe.exec(f.pathname);
  x && (console.log("[SW] Intercepted download request for:", x[1]), l.respondWith(Ie(x[1], l.request.signal)));
});
self.addEventListener("message", (l) => {
  if (l.data.request === "init") {
    console.log(
      "[SW] Received init message for",
      l.data.id,
      "nonce:",
      l.data.nonce
    ), Pr = l.data.noSave;
    const c = {
      key: l.data.key,
      nonce: l.data.nonce,
      filename: l.data.filename,
      requiresPassword: l.data.requiresPassword,
      password: l.data.password,
      url: l.data.url,
      type: l.data.type,
      manifest: l.data.manifest,
      size: l.data.size,
      progress: 0
    };
    X.set(l.data.id, c), console.log("[SW] File info stored in map"), l.ports[0].postMessage("file info received");
  } else if (l.data.request === "progress") {
    const c = X.get(l.data.id);
    c ? (c.progress === c.size && X.delete(l.data.id), l.ports[0].postMessage({ progress: c.progress })) : l.ports[0].postMessage({ error: "cancelled" });
  } else if (l.data.request === "cancel") {
    const c = X.get(l.data.id);
    c && (c.download && c.download.cancel(), X.delete(l.data.id)), l.ports[0].postMessage("download cancelled");
  }
});
//# sourceMappingURL=serviceWorker.js.map
