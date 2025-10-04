const $r = "3.4.27";
var v = {};
v.byteLength = jr;
v.toByteArray = rt;
v.fromByteArray = nt;
var G = [], q = [], Zr = typeof Uint8Array < "u" ? Uint8Array : Array, Dr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var j = 0, Qr = Dr.length; j < Qr; ++j)
  G[j] = Dr[j], q[Dr.charCodeAt(j)] = j;
q[45] = 62;
q[95] = 63;
function Wr(p) {
  var s = p.length;
  if (s % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var h = p.indexOf("=");
  h === -1 && (h = s);
  var x = h === s ? 0 : 4 - h % 4;
  return [h, x];
}
function jr(p) {
  var s = Wr(p), h = s[0], x = s[1];
  return (h + x) * 3 / 4 - x;
}
function vr(p, s, h) {
  return (s + h) * 3 / 4 - h;
}
function rt(p) {
  var s, h = Wr(p), x = h[0], w = h[1], g = new Zr(vr(p, x, w)), B = 0, u = w > 0 ? x - 4 : x, b;
  for (b = 0; b < u; b += 4)
    s = q[p.charCodeAt(b)] << 18 | q[p.charCodeAt(b + 1)] << 12 | q[p.charCodeAt(b + 2)] << 6 | q[p.charCodeAt(b + 3)], g[B++] = s >> 16 & 255, g[B++] = s >> 8 & 255, g[B++] = s & 255;
  return w === 2 && (s = q[p.charCodeAt(b)] << 2 | q[p.charCodeAt(b + 1)] >> 4, g[B++] = s & 255), w === 1 && (s = q[p.charCodeAt(b)] << 10 | q[p.charCodeAt(b + 1)] << 4 | q[p.charCodeAt(b + 2)] >> 2, g[B++] = s >> 8 & 255, g[B++] = s & 255), g;
}
function tt(p) {
  return G[p >> 18 & 63] + G[p >> 12 & 63] + G[p >> 6 & 63] + G[p & 63];
}
function et(p, s, h) {
  for (var x, w = [], g = s; g < h; g += 3)
    x = (p[g] << 16 & 16711680) + (p[g + 1] << 8 & 65280) + (p[g + 2] & 255), w.push(tt(x));
  return w.join("");
}
function nt(p) {
  for (var s, h = p.length, x = h % 3, w = [], g = 16383, B = 0, u = h - x; B < u; B += g)
    w.push(et(p, B, B + g > u ? u : B + g));
  return x === 1 ? (s = p[h - 1], w.push(
    G[s >> 2] + G[s << 4 & 63] + "=="
  )) : x === 2 && (s = (p[h - 2] << 8) + p[h - 1], w.push(
    G[s >> 10] + G[s >> 4 & 63] + G[s << 2 & 63] + "="
  )), w.join("");
}
var Mr, zr;
function it() {
  if (zr) return Mr;
  zr = 1;
  const p = v;
  function s(g) {
    return p.fromByteArray(g).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }
  function h(g) {
    return p.toByteArray(g + "===".slice((g.length + 3) % 4));
  }
  function x(g = 100) {
    return new Promise((B) => setTimeout(B, g));
  }
  async function w(g, B) {
    const u = g.getReader();
    let b = await u.read();
    if (B) {
      const k = new Uint8Array(B);
      let W = 0;
      for (; !b.done; )
        k.set(b.value, W), W += b.value.length, b = await u.read();
      return k.buffer;
    }
    const N = [];
    let S = 0;
    for (; !b.done; )
      N.push(b.value), S += b.value.length, b = await u.read();
    let L = 0;
    const H = new Uint8Array(S);
    for (const k of N)
      H.set(k, L), L += k.length;
    return H.buffer;
  }
  return Mr = {
    arrayToB64: s,
    b64ToArray: h,
    delay: x,
    streamToArrayBuffer: w
  }, Mr;
}
var cr = it(), z = {}, wr = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
wr.read = function(p, s, h, x, w) {
  var g, B, u = w * 8 - x - 1, b = (1 << u) - 1, N = b >> 1, S = -7, L = h ? w - 1 : 0, H = h ? -1 : 1, k = p[s + L];
  for (L += H, g = k & (1 << -S) - 1, k >>= -S, S += u; S > 0; g = g * 256 + p[s + L], L += H, S -= 8)
    ;
  for (B = g & (1 << -S) - 1, g >>= -S, S += x; S > 0; B = B * 256 + p[s + L], L += H, S -= 8)
    ;
  if (g === 0)
    g = 1 - N;
  else {
    if (g === b)
      return B ? NaN : (k ? -1 : 1) * (1 / 0);
    B = B + Math.pow(2, x), g = g - N;
  }
  return (k ? -1 : 1) * B * Math.pow(2, g - x);
};
wr.write = function(p, s, h, x, w, g) {
  var B, u, b, N = g * 8 - w - 1, S = (1 << N) - 1, L = S >> 1, H = w === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, k = x ? 0 : g - 1, W = x ? 1 : -1, Y = s < 0 || s === 0 && 1 / s < 0 ? 1 : 0;
  for (s = Math.abs(s), isNaN(s) || s === 1 / 0 ? (u = isNaN(s) ? 1 : 0, B = S) : (B = Math.floor(Math.log(s) / Math.LN2), s * (b = Math.pow(2, -B)) < 1 && (B--, b *= 2), B + L >= 1 ? s += H / b : s += H * Math.pow(2, 1 - L), s * b >= 2 && (B++, b /= 2), B + L >= S ? (u = 0, B = S) : B + L >= 1 ? (u = (s * b - 1) * Math.pow(2, w), B = B + L) : (u = s * Math.pow(2, L - 1) * Math.pow(2, w), B = 0)); w >= 8; p[h + k] = u & 255, k += W, u /= 256, w -= 8)
    ;
  for (B = B << w | u, N += w; N > 0; p[h + k] = B & 255, k += W, B /= 256, N -= 8)
    ;
  p[h + k - W] |= Y * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(p) {
  const s = v, h = wr, x = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  p.Buffer = u, p.SlowBuffer = Er, p.INSPECT_MAX_BYTES = 50;
  const w = 2147483647;
  p.kMaxLength = w, u.TYPED_ARRAY_SUPPORT = g(), !u.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
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
    if (i > w)
      throw new RangeError('The value "' + i + '" is invalid for option "size"');
    const r = new Uint8Array(i);
    return Object.setPrototypeOf(r, u.prototype), r;
  }
  function u(i, r, t) {
    if (typeof i == "number") {
      if (typeof r == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return L(i);
    }
    return b(i, r, t);
  }
  u.poolSize = 8192;
  function b(i, r, t) {
    if (typeof i == "string")
      return H(i, r);
    if (ArrayBuffer.isView(i))
      return W(i);
    if (i == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof i
      );
    if (E(i, ArrayBuffer) || i && E(i.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (E(i, SharedArrayBuffer) || i && E(i.buffer, SharedArrayBuffer)))
      return Y(i, r, t);
    if (typeof i == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    const a = i.valueOf && i.valueOf();
    if (a != null && a !== i)
      return u.from(a, r, t);
    const f = mr(i);
    if (f) return f;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof i[Symbol.toPrimitive] == "function")
      return u.from(i[Symbol.toPrimitive]("string"), r, t);
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof i
    );
  }
  u.from = function(i, r, t) {
    return b(i, r, t);
  }, Object.setPrototypeOf(u.prototype, Uint8Array.prototype), Object.setPrototypeOf(u, Uint8Array);
  function N(i) {
    if (typeof i != "number")
      throw new TypeError('"size" argument must be of type number');
    if (i < 0)
      throw new RangeError('The value "' + i + '" is invalid for option "size"');
  }
  function S(i, r, t) {
    return N(i), i <= 0 ? B(i) : r !== void 0 ? typeof t == "string" ? B(i).fill(r, t) : B(i).fill(r) : B(i);
  }
  u.alloc = function(i, r, t) {
    return S(i, r, t);
  };
  function L(i) {
    return N(i), B(i < 0 ? 0 : J(i) | 0);
  }
  u.allocUnsafe = function(i) {
    return L(i);
  }, u.allocUnsafeSlow = function(i) {
    return L(i);
  };
  function H(i, r) {
    if ((typeof r != "string" || r === "") && (r = "utf8"), !u.isEncoding(r))
      throw new TypeError("Unknown encoding: " + r);
    const t = rr(i, r) | 0;
    let a = B(t);
    const f = a.write(i, r);
    return f !== t && (a = a.slice(0, f)), a;
  }
  function k(i) {
    const r = i.length < 0 ? 0 : J(i.length) | 0, t = B(r);
    for (let a = 0; a < r; a += 1)
      t[a] = i[a] & 255;
    return t;
  }
  function W(i) {
    if (E(i, Uint8Array)) {
      const r = new Uint8Array(i);
      return Y(r.buffer, r.byteOffset, r.byteLength);
    }
    return k(i);
  }
  function Y(i, r, t) {
    if (r < 0 || i.byteLength < r)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (i.byteLength < r + (t || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    let a;
    return r === void 0 && t === void 0 ? a = new Uint8Array(i) : t === void 0 ? a = new Uint8Array(i, r) : a = new Uint8Array(i, r, t), Object.setPrototypeOf(a, u.prototype), a;
  }
  function mr(i) {
    if (u.isBuffer(i)) {
      const r = J(i.length) | 0, t = B(r);
      return t.length === 0 || i.copy(t, 0, 0, r), t;
    }
    if (i.length !== void 0)
      return typeof i.length != "number" || A(i.length) ? B(0) : k(i);
    if (i.type === "Buffer" && Array.isArray(i.data))
      return k(i.data);
  }
  function J(i) {
    if (i >= w)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + w.toString(16) + " bytes");
    return i | 0;
  }
  function Er(i) {
    return +i != i && (i = 0), u.alloc(+i);
  }
  u.isBuffer = function(r) {
    return r != null && r._isBuffer === !0 && r !== u.prototype;
  }, u.compare = function(r, t) {
    if (E(r, Uint8Array) && (r = u.from(r, r.offset, r.byteLength)), E(t, Uint8Array) && (t = u.from(t, t.offset, t.byteLength)), !u.isBuffer(r) || !u.isBuffer(t))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (r === t) return 0;
    let a = r.length, f = t.length;
    for (let y = 0, d = Math.min(a, f); y < d; ++y)
      if (r[y] !== t[y]) {
        a = r[y], f = t[y];
        break;
      }
    return a < f ? -1 : f < a ? 1 : 0;
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
  }, u.concat = function(r, t) {
    if (!Array.isArray(r))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (r.length === 0)
      return u.alloc(0);
    let a;
    if (t === void 0)
      for (t = 0, a = 0; a < r.length; ++a)
        t += r[a].length;
    const f = u.allocUnsafe(t);
    let y = 0;
    for (a = 0; a < r.length; ++a) {
      let d = r[a];
      if (E(d, Uint8Array))
        y + d.length > f.length ? (u.isBuffer(d) || (d = u.from(d)), d.copy(f, y)) : Uint8Array.prototype.set.call(
          f,
          d,
          y
        );
      else if (u.isBuffer(d))
        d.copy(f, y);
      else
        throw new TypeError('"list" argument must be an Array of Buffers');
      y += d.length;
    }
    return f;
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
    const t = i.length, a = arguments.length > 2 && arguments[2] === !0;
    if (!a && t === 0) return 0;
    let f = !1;
    for (; ; )
      switch (r) {
        case "ascii":
        case "latin1":
        case "binary":
          return t;
        case "utf8":
        case "utf-8":
          return e(i).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return t * 2;
        case "hex":
          return t >>> 1;
        case "base64":
          return l(i).length;
        default:
          if (f)
            return a ? -1 : e(i).length;
          r = ("" + r).toLowerCase(), f = !0;
      }
  }
  u.byteLength = rr;
  function gr(i, r, t) {
    let a = !1;
    if ((r === void 0 || r < 0) && (r = 0), r > this.length || ((t === void 0 || t > this.length) && (t = this.length), t <= 0) || (t >>>= 0, r >>>= 0, t <= r))
      return "";
    for (i || (i = "utf8"); ; )
      switch (i) {
        case "hex":
          return Cr(this, r, t);
        case "utf8":
        case "utf-8":
          return nr(this, r, t);
        case "ascii":
          return Tr(this, r, t);
        case "latin1":
        case "binary":
          return Rr(this, r, t);
        case "base64":
          return Ir(this, r, t);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return Lr(this, r, t);
        default:
          if (a) throw new TypeError("Unknown encoding: " + i);
          i = (i + "").toLowerCase(), a = !0;
      }
  }
  u.prototype._isBuffer = !0;
  function $(i, r, t) {
    const a = i[r];
    i[r] = i[t], i[t] = a;
  }
  u.prototype.swap16 = function() {
    const r = this.length;
    if (r % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let t = 0; t < r; t += 2)
      $(this, t, t + 1);
    return this;
  }, u.prototype.swap32 = function() {
    const r = this.length;
    if (r % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let t = 0; t < r; t += 4)
      $(this, t, t + 3), $(this, t + 1, t + 2);
    return this;
  }, u.prototype.swap64 = function() {
    const r = this.length;
    if (r % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let t = 0; t < r; t += 8)
      $(this, t, t + 7), $(this, t + 1, t + 6), $(this, t + 2, t + 5), $(this, t + 3, t + 4);
    return this;
  }, u.prototype.toString = function() {
    const r = this.length;
    return r === 0 ? "" : arguments.length === 0 ? nr(this, 0, r) : gr.apply(this, arguments);
  }, u.prototype.toLocaleString = u.prototype.toString, u.prototype.equals = function(r) {
    if (!u.isBuffer(r)) throw new TypeError("Argument must be a Buffer");
    return this === r ? !0 : u.compare(this, r) === 0;
  }, u.prototype.inspect = function() {
    let r = "";
    const t = p.INSPECT_MAX_BYTES;
    return r = this.toString("hex", 0, t).replace(/(.{2})/g, "$1 ").trim(), this.length > t && (r += " ... "), "<Buffer " + r + ">";
  }, x && (u.prototype[x] = u.prototype.inspect), u.prototype.compare = function(r, t, a, f, y) {
    if (E(r, Uint8Array) && (r = u.from(r, r.offset, r.byteLength)), !u.isBuffer(r))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof r
      );
    if (t === void 0 && (t = 0), a === void 0 && (a = r ? r.length : 0), f === void 0 && (f = 0), y === void 0 && (y = this.length), t < 0 || a > r.length || f < 0 || y > this.length)
      throw new RangeError("out of range index");
    if (f >= y && t >= a)
      return 0;
    if (f >= y)
      return -1;
    if (t >= a)
      return 1;
    if (t >>>= 0, a >>>= 0, f >>>= 0, y >>>= 0, this === r) return 0;
    let d = y - f, F = a - t;
    const M = Math.min(d, F), D = this.slice(f, y), _ = r.slice(t, a);
    for (let C = 0; C < M; ++C)
      if (D[C] !== _[C]) {
        d = D[C], F = _[C];
        break;
      }
    return d < F ? -1 : F < d ? 1 : 0;
  };
  function tr(i, r, t, a, f) {
    if (i.length === 0) return -1;
    if (typeof t == "string" ? (a = t, t = 0) : t > 2147483647 ? t = 2147483647 : t < -2147483648 && (t = -2147483648), t = +t, A(t) && (t = f ? 0 : i.length - 1), t < 0 && (t = i.length + t), t >= i.length) {
      if (f) return -1;
      t = i.length - 1;
    } else if (t < 0)
      if (f) t = 0;
      else return -1;
    if (typeof r == "string" && (r = u.from(r, a)), u.isBuffer(r))
      return r.length === 0 ? -1 : er(i, r, t, a, f);
    if (typeof r == "number")
      return r = r & 255, typeof Uint8Array.prototype.indexOf == "function" ? f ? Uint8Array.prototype.indexOf.call(i, r, t) : Uint8Array.prototype.lastIndexOf.call(i, r, t) : er(i, [r], t, a, f);
    throw new TypeError("val must be string, number or Buffer");
  }
  function er(i, r, t, a, f) {
    let y = 1, d = i.length, F = r.length;
    if (a !== void 0 && (a = String(a).toLowerCase(), a === "ucs2" || a === "ucs-2" || a === "utf16le" || a === "utf-16le")) {
      if (i.length < 2 || r.length < 2)
        return -1;
      y = 2, d /= 2, F /= 2, t /= 2;
    }
    function M(_, C) {
      return y === 1 ? _[C] : _.readUInt16BE(C * y);
    }
    let D;
    if (f) {
      let _ = -1;
      for (D = t; D < d; D++)
        if (M(i, D) === M(r, _ === -1 ? 0 : D - _)) {
          if (_ === -1 && (_ = D), D - _ + 1 === F) return _ * y;
        } else
          _ !== -1 && (D -= D - _), _ = -1;
    } else
      for (t + F > d && (t = d - F), D = t; D >= 0; D--) {
        let _ = !0;
        for (let C = 0; C < F; C++)
          if (M(i, D + C) !== M(r, C)) {
            _ = !1;
            break;
          }
        if (_) return D;
      }
    return -1;
  }
  u.prototype.includes = function(r, t, a) {
    return this.indexOf(r, t, a) !== -1;
  }, u.prototype.indexOf = function(r, t, a) {
    return tr(this, r, t, a, !0);
  }, u.prototype.lastIndexOf = function(r, t, a) {
    return tr(this, r, t, a, !1);
  };
  function Br(i, r, t, a) {
    t = Number(t) || 0;
    const f = i.length - t;
    a ? (a = Number(a), a > f && (a = f)) : a = f;
    const y = r.length;
    a > y / 2 && (a = y / 2);
    let d;
    for (d = 0; d < a; ++d) {
      const F = parseInt(r.substr(d * 2, 2), 16);
      if (A(F)) return d;
      i[t + d] = F;
    }
    return d;
  }
  function br(i, r, t, a) {
    return m(e(r, i.length - t), i, t, a);
  }
  function Ur(i, r, t, a) {
    return m(n(r), i, t, a);
  }
  function Ar(i, r, t, a) {
    return m(l(r), i, t, a);
  }
  function Fr(i, r, t, a) {
    return m(c(r, i.length - t), i, t, a);
  }
  u.prototype.write = function(r, t, a, f) {
    if (t === void 0)
      f = "utf8", a = this.length, t = 0;
    else if (a === void 0 && typeof t == "string")
      f = t, a = this.length, t = 0;
    else if (isFinite(t))
      t = t >>> 0, isFinite(a) ? (a = a >>> 0, f === void 0 && (f = "utf8")) : (f = a, a = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    const y = this.length - t;
    if ((a === void 0 || a > y) && (a = y), r.length > 0 && (a < 0 || t < 0) || t > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    f || (f = "utf8");
    let d = !1;
    for (; ; )
      switch (f) {
        case "hex":
          return Br(this, r, t, a);
        case "utf8":
        case "utf-8":
          return br(this, r, t, a);
        case "ascii":
        case "latin1":
        case "binary":
          return Ur(this, r, t, a);
        case "base64":
          return Ar(this, r, t, a);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return Fr(this, r, t, a);
        default:
          if (d) throw new TypeError("Unknown encoding: " + f);
          f = ("" + f).toLowerCase(), d = !0;
      }
  }, u.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function Ir(i, r, t) {
    return r === 0 && t === i.length ? s.fromByteArray(i) : s.fromByteArray(i.slice(r, t));
  }
  function nr(i, r, t) {
    t = Math.min(i.length, t);
    const a = [];
    let f = r;
    for (; f < t; ) {
      const y = i[f];
      let d = null, F = y > 239 ? 4 : y > 223 ? 3 : y > 191 ? 2 : 1;
      if (f + F <= t) {
        let M, D, _, C;
        switch (F) {
          case 1:
            y < 128 && (d = y);
            break;
          case 2:
            M = i[f + 1], (M & 192) === 128 && (C = (y & 31) << 6 | M & 63, C > 127 && (d = C));
            break;
          case 3:
            M = i[f + 1], D = i[f + 2], (M & 192) === 128 && (D & 192) === 128 && (C = (y & 15) << 12 | (M & 63) << 6 | D & 63, C > 2047 && (C < 55296 || C > 57343) && (d = C));
            break;
          case 4:
            M = i[f + 1], D = i[f + 2], _ = i[f + 3], (M & 192) === 128 && (D & 192) === 128 && (_ & 192) === 128 && (C = (y & 15) << 18 | (M & 63) << 12 | (D & 63) << 6 | _ & 63, C > 65535 && C < 1114112 && (d = C));
        }
      }
      d === null ? (d = 65533, F = 1) : d > 65535 && (d -= 65536, a.push(d >>> 10 & 1023 | 55296), d = 56320 | d & 1023), a.push(d), f += F;
    }
    return Sr(a);
  }
  const ir = 4096;
  function Sr(i) {
    const r = i.length;
    if (r <= ir)
      return String.fromCharCode.apply(String, i);
    let t = "", a = 0;
    for (; a < r; )
      t += String.fromCharCode.apply(
        String,
        i.slice(a, a += ir)
      );
    return t;
  }
  function Tr(i, r, t) {
    let a = "";
    t = Math.min(i.length, t);
    for (let f = r; f < t; ++f)
      a += String.fromCharCode(i[f] & 127);
    return a;
  }
  function Rr(i, r, t) {
    let a = "";
    t = Math.min(i.length, t);
    for (let f = r; f < t; ++f)
      a += String.fromCharCode(i[f]);
    return a;
  }
  function Cr(i, r, t) {
    const a = i.length;
    (!r || r < 0) && (r = 0), (!t || t < 0 || t > a) && (t = a);
    let f = "";
    for (let y = r; y < t; ++y)
      f += R[i[y]];
    return f;
  }
  function Lr(i, r, t) {
    const a = i.slice(r, t);
    let f = "";
    for (let y = 0; y < a.length - 1; y += 2)
      f += String.fromCharCode(a[y] + a[y + 1] * 256);
    return f;
  }
  u.prototype.slice = function(r, t) {
    const a = this.length;
    r = ~~r, t = t === void 0 ? a : ~~t, r < 0 ? (r += a, r < 0 && (r = 0)) : r > a && (r = a), t < 0 ? (t += a, t < 0 && (t = 0)) : t > a && (t = a), t < r && (t = r);
    const f = this.subarray(r, t);
    return Object.setPrototypeOf(f, u.prototype), f;
  };
  function U(i, r, t) {
    if (i % 1 !== 0 || i < 0) throw new RangeError("offset is not uint");
    if (i + r > t) throw new RangeError("Trying to access beyond buffer length");
  }
  u.prototype.readUintLE = u.prototype.readUIntLE = function(r, t, a) {
    r = r >>> 0, t = t >>> 0, a || U(r, t, this.length);
    let f = this[r], y = 1, d = 0;
    for (; ++d < t && (y *= 256); )
      f += this[r + d] * y;
    return f;
  }, u.prototype.readUintBE = u.prototype.readUIntBE = function(r, t, a) {
    r = r >>> 0, t = t >>> 0, a || U(r, t, this.length);
    let f = this[r + --t], y = 1;
    for (; t > 0 && (y *= 256); )
      f += this[r + --t] * y;
    return f;
  }, u.prototype.readUint8 = u.prototype.readUInt8 = function(r, t) {
    return r = r >>> 0, t || U(r, 1, this.length), this[r];
  }, u.prototype.readUint16LE = u.prototype.readUInt16LE = function(r, t) {
    return r = r >>> 0, t || U(r, 2, this.length), this[r] | this[r + 1] << 8;
  }, u.prototype.readUint16BE = u.prototype.readUInt16BE = function(r, t) {
    return r = r >>> 0, t || U(r, 2, this.length), this[r] << 8 | this[r + 1];
  }, u.prototype.readUint32LE = u.prototype.readUInt32LE = function(r, t) {
    return r = r >>> 0, t || U(r, 4, this.length), (this[r] | this[r + 1] << 8 | this[r + 2] << 16) + this[r + 3] * 16777216;
  }, u.prototype.readUint32BE = u.prototype.readUInt32BE = function(r, t) {
    return r = r >>> 0, t || U(r, 4, this.length), this[r] * 16777216 + (this[r + 1] << 16 | this[r + 2] << 8 | this[r + 3]);
  }, u.prototype.readBigUInt64LE = I(function(r) {
    r = r >>> 0, P(r, "offset");
    const t = this[r], a = this[r + 7];
    (t === void 0 || a === void 0) && V(r, this.length - 8);
    const f = t + this[++r] * 2 ** 8 + this[++r] * 2 ** 16 + this[++r] * 2 ** 24, y = this[++r] + this[++r] * 2 ** 8 + this[++r] * 2 ** 16 + a * 2 ** 24;
    return BigInt(f) + (BigInt(y) << BigInt(32));
  }), u.prototype.readBigUInt64BE = I(function(r) {
    r = r >>> 0, P(r, "offset");
    const t = this[r], a = this[r + 7];
    (t === void 0 || a === void 0) && V(r, this.length - 8);
    const f = t * 2 ** 24 + this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + this[++r], y = this[++r] * 2 ** 24 + this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + a;
    return (BigInt(f) << BigInt(32)) + BigInt(y);
  }), u.prototype.readIntLE = function(r, t, a) {
    r = r >>> 0, t = t >>> 0, a || U(r, t, this.length);
    let f = this[r], y = 1, d = 0;
    for (; ++d < t && (y *= 256); )
      f += this[r + d] * y;
    return y *= 128, f >= y && (f -= Math.pow(2, 8 * t)), f;
  }, u.prototype.readIntBE = function(r, t, a) {
    r = r >>> 0, t = t >>> 0, a || U(r, t, this.length);
    let f = t, y = 1, d = this[r + --f];
    for (; f > 0 && (y *= 256); )
      d += this[r + --f] * y;
    return y *= 128, d >= y && (d -= Math.pow(2, 8 * t)), d;
  }, u.prototype.readInt8 = function(r, t) {
    return r = r >>> 0, t || U(r, 1, this.length), this[r] & 128 ? (255 - this[r] + 1) * -1 : this[r];
  }, u.prototype.readInt16LE = function(r, t) {
    r = r >>> 0, t || U(r, 2, this.length);
    const a = this[r] | this[r + 1] << 8;
    return a & 32768 ? a | 4294901760 : a;
  }, u.prototype.readInt16BE = function(r, t) {
    r = r >>> 0, t || U(r, 2, this.length);
    const a = this[r + 1] | this[r] << 8;
    return a & 32768 ? a | 4294901760 : a;
  }, u.prototype.readInt32LE = function(r, t) {
    return r = r >>> 0, t || U(r, 4, this.length), this[r] | this[r + 1] << 8 | this[r + 2] << 16 | this[r + 3] << 24;
  }, u.prototype.readInt32BE = function(r, t) {
    return r = r >>> 0, t || U(r, 4, this.length), this[r] << 24 | this[r + 1] << 16 | this[r + 2] << 8 | this[r + 3];
  }, u.prototype.readBigInt64LE = I(function(r) {
    r = r >>> 0, P(r, "offset");
    const t = this[r], a = this[r + 7];
    (t === void 0 || a === void 0) && V(r, this.length - 8);
    const f = this[r + 4] + this[r + 5] * 2 ** 8 + this[r + 6] * 2 ** 16 + (a << 24);
    return (BigInt(f) << BigInt(32)) + BigInt(t + this[++r] * 2 ** 8 + this[++r] * 2 ** 16 + this[++r] * 2 ** 24);
  }), u.prototype.readBigInt64BE = I(function(r) {
    r = r >>> 0, P(r, "offset");
    const t = this[r], a = this[r + 7];
    (t === void 0 || a === void 0) && V(r, this.length - 8);
    const f = (t << 24) + // Overflow
    this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + this[++r];
    return (BigInt(f) << BigInt(32)) + BigInt(this[++r] * 2 ** 24 + this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + a);
  }), u.prototype.readFloatLE = function(r, t) {
    return r = r >>> 0, t || U(r, 4, this.length), h.read(this, r, !0, 23, 4);
  }, u.prototype.readFloatBE = function(r, t) {
    return r = r >>> 0, t || U(r, 4, this.length), h.read(this, r, !1, 23, 4);
  }, u.prototype.readDoubleLE = function(r, t) {
    return r = r >>> 0, t || U(r, 8, this.length), h.read(this, r, !0, 52, 8);
  }, u.prototype.readDoubleBE = function(r, t) {
    return r = r >>> 0, t || U(r, 8, this.length), h.read(this, r, !1, 52, 8);
  };
  function T(i, r, t, a, f, y) {
    if (!u.isBuffer(i)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (r > f || r < y) throw new RangeError('"value" argument is out of bounds');
    if (t + a > i.length) throw new RangeError("Index out of range");
  }
  u.prototype.writeUintLE = u.prototype.writeUIntLE = function(r, t, a, f) {
    if (r = +r, t = t >>> 0, a = a >>> 0, !f) {
      const F = Math.pow(2, 8 * a) - 1;
      T(this, r, t, a, F, 0);
    }
    let y = 1, d = 0;
    for (this[t] = r & 255; ++d < a && (y *= 256); )
      this[t + d] = r / y & 255;
    return t + a;
  }, u.prototype.writeUintBE = u.prototype.writeUIntBE = function(r, t, a, f) {
    if (r = +r, t = t >>> 0, a = a >>> 0, !f) {
      const F = Math.pow(2, 8 * a) - 1;
      T(this, r, t, a, F, 0);
    }
    let y = a - 1, d = 1;
    for (this[t + y] = r & 255; --y >= 0 && (d *= 256); )
      this[t + y] = r / d & 255;
    return t + a;
  }, u.prototype.writeUint8 = u.prototype.writeUInt8 = function(r, t, a) {
    return r = +r, t = t >>> 0, a || T(this, r, t, 1, 255, 0), this[t] = r & 255, t + 1;
  }, u.prototype.writeUint16LE = u.prototype.writeUInt16LE = function(r, t, a) {
    return r = +r, t = t >>> 0, a || T(this, r, t, 2, 65535, 0), this[t] = r & 255, this[t + 1] = r >>> 8, t + 2;
  }, u.prototype.writeUint16BE = u.prototype.writeUInt16BE = function(r, t, a) {
    return r = +r, t = t >>> 0, a || T(this, r, t, 2, 65535, 0), this[t] = r >>> 8, this[t + 1] = r & 255, t + 2;
  }, u.prototype.writeUint32LE = u.prototype.writeUInt32LE = function(r, t, a) {
    return r = +r, t = t >>> 0, a || T(this, r, t, 4, 4294967295, 0), this[t + 3] = r >>> 24, this[t + 2] = r >>> 16, this[t + 1] = r >>> 8, this[t] = r & 255, t + 4;
  }, u.prototype.writeUint32BE = u.prototype.writeUInt32BE = function(r, t, a) {
    return r = +r, t = t >>> 0, a || T(this, r, t, 4, 4294967295, 0), this[t] = r >>> 24, this[t + 1] = r >>> 16, this[t + 2] = r >>> 8, this[t + 3] = r & 255, t + 4;
  };
  function or(i, r, t, a, f) {
    Z(r, a, f, i, t, 7);
    let y = Number(r & BigInt(4294967295));
    i[t++] = y, y = y >> 8, i[t++] = y, y = y >> 8, i[t++] = y, y = y >> 8, i[t++] = y;
    let d = Number(r >> BigInt(32) & BigInt(4294967295));
    return i[t++] = d, d = d >> 8, i[t++] = d, d = d >> 8, i[t++] = d, d = d >> 8, i[t++] = d, t;
  }
  function ur(i, r, t, a, f) {
    Z(r, a, f, i, t, 7);
    let y = Number(r & BigInt(4294967295));
    i[t + 7] = y, y = y >> 8, i[t + 6] = y, y = y >> 8, i[t + 5] = y, y = y >> 8, i[t + 4] = y;
    let d = Number(r >> BigInt(32) & BigInt(4294967295));
    return i[t + 3] = d, d = d >> 8, i[t + 2] = d, d = d >> 8, i[t + 1] = d, d = d >> 8, i[t] = d, t + 8;
  }
  u.prototype.writeBigUInt64LE = I(function(r, t = 0) {
    return or(this, r, t, BigInt(0), BigInt("0xffffffffffffffff"));
  }), u.prototype.writeBigUInt64BE = I(function(r, t = 0) {
    return ur(this, r, t, BigInt(0), BigInt("0xffffffffffffffff"));
  }), u.prototype.writeIntLE = function(r, t, a, f) {
    if (r = +r, t = t >>> 0, !f) {
      const M = Math.pow(2, 8 * a - 1);
      T(this, r, t, a, M - 1, -M);
    }
    let y = 0, d = 1, F = 0;
    for (this[t] = r & 255; ++y < a && (d *= 256); )
      r < 0 && F === 0 && this[t + y - 1] !== 0 && (F = 1), this[t + y] = (r / d >> 0) - F & 255;
    return t + a;
  }, u.prototype.writeIntBE = function(r, t, a, f) {
    if (r = +r, t = t >>> 0, !f) {
      const M = Math.pow(2, 8 * a - 1);
      T(this, r, t, a, M - 1, -M);
    }
    let y = a - 1, d = 1, F = 0;
    for (this[t + y] = r & 255; --y >= 0 && (d *= 256); )
      r < 0 && F === 0 && this[t + y + 1] !== 0 && (F = 1), this[t + y] = (r / d >> 0) - F & 255;
    return t + a;
  }, u.prototype.writeInt8 = function(r, t, a) {
    return r = +r, t = t >>> 0, a || T(this, r, t, 1, 127, -128), r < 0 && (r = 255 + r + 1), this[t] = r & 255, t + 1;
  }, u.prototype.writeInt16LE = function(r, t, a) {
    return r = +r, t = t >>> 0, a || T(this, r, t, 2, 32767, -32768), this[t] = r & 255, this[t + 1] = r >>> 8, t + 2;
  }, u.prototype.writeInt16BE = function(r, t, a) {
    return r = +r, t = t >>> 0, a || T(this, r, t, 2, 32767, -32768), this[t] = r >>> 8, this[t + 1] = r & 255, t + 2;
  }, u.prototype.writeInt32LE = function(r, t, a) {
    return r = +r, t = t >>> 0, a || T(this, r, t, 4, 2147483647, -2147483648), this[t] = r & 255, this[t + 1] = r >>> 8, this[t + 2] = r >>> 16, this[t + 3] = r >>> 24, t + 4;
  }, u.prototype.writeInt32BE = function(r, t, a) {
    return r = +r, t = t >>> 0, a || T(this, r, t, 4, 2147483647, -2147483648), r < 0 && (r = 4294967295 + r + 1), this[t] = r >>> 24, this[t + 1] = r >>> 16, this[t + 2] = r >>> 8, this[t + 3] = r & 255, t + 4;
  }, u.prototype.writeBigInt64LE = I(function(r, t = 0) {
    return or(this, r, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }), u.prototype.writeBigInt64BE = I(function(r, t = 0) {
    return ur(this, r, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function ar(i, r, t, a, f, y) {
    if (t + a > i.length) throw new RangeError("Index out of range");
    if (t < 0) throw new RangeError("Index out of range");
  }
  function lr(i, r, t, a, f) {
    return r = +r, t = t >>> 0, f || ar(i, r, t, 4), h.write(i, r, t, a, 23, 4), t + 4;
  }
  u.prototype.writeFloatLE = function(r, t, a) {
    return lr(this, r, t, !0, a);
  }, u.prototype.writeFloatBE = function(r, t, a) {
    return lr(this, r, t, !1, a);
  };
  function xr(i, r, t, a, f) {
    return r = +r, t = t >>> 0, f || ar(i, r, t, 8), h.write(i, r, t, a, 52, 8), t + 8;
  }
  u.prototype.writeDoubleLE = function(r, t, a) {
    return xr(this, r, t, !0, a);
  }, u.prototype.writeDoubleBE = function(r, t, a) {
    return xr(this, r, t, !1, a);
  }, u.prototype.copy = function(r, t, a, f) {
    if (!u.isBuffer(r)) throw new TypeError("argument should be a Buffer");
    if (a || (a = 0), !f && f !== 0 && (f = this.length), t >= r.length && (t = r.length), t || (t = 0), f > 0 && f < a && (f = a), f === a || r.length === 0 || this.length === 0) return 0;
    if (t < 0)
      throw new RangeError("targetStart out of bounds");
    if (a < 0 || a >= this.length) throw new RangeError("Index out of range");
    if (f < 0) throw new RangeError("sourceEnd out of bounds");
    f > this.length && (f = this.length), r.length - t < f - a && (f = r.length - t + a);
    const y = f - a;
    return this === r && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(t, a, f) : Uint8Array.prototype.set.call(
      r,
      this.subarray(a, f),
      t
    ), y;
  }, u.prototype.fill = function(r, t, a, f) {
    if (typeof r == "string") {
      if (typeof t == "string" ? (f = t, t = 0, a = this.length) : typeof a == "string" && (f = a, a = this.length), f !== void 0 && typeof f != "string")
        throw new TypeError("encoding must be a string");
      if (typeof f == "string" && !u.isEncoding(f))
        throw new TypeError("Unknown encoding: " + f);
      if (r.length === 1) {
        const d = r.charCodeAt(0);
        (f === "utf8" && d < 128 || f === "latin1") && (r = d);
      }
    } else typeof r == "number" ? r = r & 255 : typeof r == "boolean" && (r = Number(r));
    if (t < 0 || this.length < t || this.length < a)
      throw new RangeError("Out of range index");
    if (a <= t)
      return this;
    t = t >>> 0, a = a === void 0 ? this.length : a >>> 0, r || (r = 0);
    let y;
    if (typeof r == "number")
      for (y = t; y < a; ++y)
        this[y] = r;
    else {
      const d = u.isBuffer(r) ? r : u.from(r, f), F = d.length;
      if (F === 0)
        throw new TypeError('The value "' + r + '" is invalid for argument "value"');
      for (y = 0; y < a - t; ++y)
        this[y + t] = d[y % F];
    }
    return this;
  };
  const O = {};
  function sr(i, r, t) {
    O[i] = class extends t {
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
      set code(f) {
        Object.defineProperty(this, "code", {
          configurable: !0,
          enumerable: !0,
          value: f,
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
    function(i, r, t) {
      let a = `The value of "${i}" is out of range.`, f = t;
      return Number.isInteger(t) && Math.abs(t) > 2 ** 32 ? f = yr(String(t)) : typeof t == "bigint" && (f = String(t), (t > BigInt(2) ** BigInt(32) || t < -(BigInt(2) ** BigInt(32))) && (f = yr(f)), f += "n"), a += ` It must be ${r}. Received ${f}`, a;
    },
    RangeError
  );
  function yr(i) {
    let r = "", t = i.length;
    const a = i[0] === "-" ? 1 : 0;
    for (; t >= a + 4; t -= 3)
      r = `_${i.slice(t - 3, t)}${r}`;
    return `${i.slice(0, t)}${r}`;
  }
  function dr(i, r, t) {
    P(r, "offset"), (i[r] === void 0 || i[r + t] === void 0) && V(r, i.length - (t + 1));
  }
  function Z(i, r, t, a, f, y) {
    if (i > t || i < r) {
      const d = typeof r == "bigint" ? "n" : "";
      let F;
      throw r === 0 || r === BigInt(0) ? F = `>= 0${d} and < 2${d} ** ${(y + 1) * 8}${d}` : F = `>= -(2${d} ** ${(y + 1) * 8 - 1}${d}) and < 2 ** ${(y + 1) * 8 - 1}${d}`, new O.ERR_OUT_OF_RANGE("value", F, i);
    }
    dr(a, f, y);
  }
  function P(i, r) {
    if (typeof i != "number")
      throw new O.ERR_INVALID_ARG_TYPE(r, "number", i);
  }
  function V(i, r, t) {
    throw Math.floor(i) !== i ? (P(i, t), new O.ERR_OUT_OF_RANGE("offset", "an integer", i)) : r < 0 ? new O.ERR_BUFFER_OUT_OF_BOUNDS() : new O.ERR_OUT_OF_RANGE(
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
  function e(i, r) {
    r = r || 1 / 0;
    let t;
    const a = i.length;
    let f = null;
    const y = [];
    for (let d = 0; d < a; ++d) {
      if (t = i.charCodeAt(d), t > 55295 && t < 57344) {
        if (!f) {
          if (t > 56319) {
            (r -= 3) > -1 && y.push(239, 191, 189);
            continue;
          } else if (d + 1 === a) {
            (r -= 3) > -1 && y.push(239, 191, 189);
            continue;
          }
          f = t;
          continue;
        }
        if (t < 56320) {
          (r -= 3) > -1 && y.push(239, 191, 189), f = t;
          continue;
        }
        t = (f - 55296 << 10 | t - 56320) + 65536;
      } else f && (r -= 3) > -1 && y.push(239, 191, 189);
      if (f = null, t < 128) {
        if ((r -= 1) < 0) break;
        y.push(t);
      } else if (t < 2048) {
        if ((r -= 2) < 0) break;
        y.push(
          t >> 6 | 192,
          t & 63 | 128
        );
      } else if (t < 65536) {
        if ((r -= 3) < 0) break;
        y.push(
          t >> 12 | 224,
          t >> 6 & 63 | 128,
          t & 63 | 128
        );
      } else if (t < 1114112) {
        if ((r -= 4) < 0) break;
        y.push(
          t >> 18 | 240,
          t >> 12 & 63 | 128,
          t >> 6 & 63 | 128,
          t & 63 | 128
        );
      } else
        throw new Error("Invalid code point");
    }
    return y;
  }
  function n(i) {
    const r = [];
    for (let t = 0; t < i.length; ++t)
      r.push(i.charCodeAt(t) & 255);
    return r;
  }
  function c(i, r) {
    let t, a, f;
    const y = [];
    for (let d = 0; d < i.length && !((r -= 2) < 0); ++d)
      t = i.charCodeAt(d), a = t >> 8, f = t % 256, y.push(f), y.push(a);
    return y;
  }
  function l(i) {
    return s.toByteArray(o(i));
  }
  function m(i, r, t, a) {
    let f;
    for (f = 0; f < a && !(f + t >= r.length || f >= i.length); ++f)
      r[f + t] = i[f];
    return f;
  }
  function E(i, r) {
    return i instanceof r || i != null && i.constructor != null && i.constructor.name != null && i.constructor.name === r.name;
  }
  function A(i) {
    return i !== i;
  }
  const R = function() {
    const i = "0123456789abcdef", r = new Array(256);
    for (let t = 0; t < 16; ++t) {
      const a = t * 16;
      for (let f = 0; f < 16; ++f)
        r[a + f] = i[t] + i[f];
    }
    return r;
  }();
  function I(i) {
    return typeof BigInt > "u" ? K : i;
  }
  function K() {
    throw new Error("BigInt not supported");
  }
})(z);
function pr(p, s, h) {
  try {
    return p.pipeThrough(new TransformStream(s));
  } catch {
    const w = p.getReader();
    return new ReadableStream({
      start(g) {
        if (s.start)
          return s.start(g);
      },
      async pull(g) {
        let B = !1;
        const u = {
          enqueue(b) {
            B = !0, g.enqueue(b);
          }
        };
        for (; !B; ) {
          const b = await w.read();
          if (b.done)
            return s.flush && await s.flush(g), g.close();
          await s.transform(b.value, u);
        }
      },
      cancel(g) {
        p.cancel(g), h && h(g);
      }
    });
  }
}
typeof window < "u" && (window.Buffer = z.Buffer);
const ot = 12, Hr = 16, hr = 16, _r = "encrypt", Or = "decrypt", Gr = 1024 * 64, qr = new TextEncoder();
function ut(p) {
  const s = new Uint8Array(p);
  return crypto.getRandomValues(s), s.buffer;
}
class Yr {
  constructor(s, h, x, w) {
    this.mode = s, this.prevChunk, this.seq = 0, this.firstchunk = !0, this.rs = x, this.ikm = h.buffer, this.salt = w;
  }
  async generateKey() {
    const s = await crypto.subtle.importKey(
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
        info: qr.encode("Content-Encoding: aes128gcm\0"),
        hash: "SHA-256"
      },
      s,
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
    const s = await crypto.subtle.importKey(
      "raw",
      this.ikm,
      "HKDF",
      !1,
      ["deriveKey"]
    ), h = await crypto.subtle.exportKey(
      "raw",
      await crypto.subtle.deriveKey(
        {
          name: "HKDF",
          salt: this.salt,
          info: qr.encode("Content-Encoding: nonce\0"),
          hash: "SHA-256"
        },
        s,
        {
          name: "AES-GCM",
          length: 128
        },
        !0,
        ["encrypt", "decrypt"]
      )
    );
    return z.Buffer.from(h.slice(0, ot));
  }
  generateNonce(s) {
    if (s > 4294967295)
      throw new Error("record sequence number exceeds limit");
    const h = z.Buffer.from(this.nonceBase), w = (h.readUIntBE(h.length - 4, 4) ^ s) >>> 0;
    return h.writeUIntBE(w, h.length - 4, 4), h;
  }
  pad(s, h) {
    const x = s.length;
    if (x + Hr >= this.rs)
      throw new Error("data too large for record size");
    if (h) {
      const w = z.Buffer.alloc(1);
      return w.writeUInt8(2, 0), z.Buffer.concat([s, w]);
    } else {
      const w = z.Buffer.alloc(this.rs - x - Hr);
      return w.fill(0), w.writeUInt8(1, 0), z.Buffer.concat([s, w]);
    }
  }
  unpad(s, h) {
    for (let x = s.length - 1; x >= 0; x--)
      if (s[x]) {
        if (h) {
          if (s[x] !== 2)
            throw new Error("delimiter of final record is not 2");
        } else if (s[x] !== 1)
          throw new Error("delimiter of not final record is not 1");
        return s.slice(0, x);
      }
    throw new Error("no delimiter found");
  }
  createHeader() {
    const s = z.Buffer.alloc(5);
    return s.writeUIntBE(this.rs, 0, 4), s.writeUIntBE(0, 4, 1), z.Buffer.concat([z.Buffer.from(this.salt), s]);
  }
  readHeader(s) {
    if (s.length < 21)
      throw new Error("chunk too small for reading header");
    const h = {};
    h.salt = s.buffer.slice(0, hr), h.rs = s.readUIntBE(hr, 4);
    const x = s.readUInt8(hr + 4);
    return h.length = x + hr + 5, h;
  }
  async encryptRecord(s, h, x) {
    const w = this.generateNonce(h), g = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: w },
      this.key,
      this.pad(s, x)
    );
    return z.Buffer.from(g);
  }
  async decryptRecord(s, h, x) {
    const w = this.generateNonce(h), g = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: w,
        tagLength: 128
      },
      this.key,
      s
    );
    return this.unpad(z.Buffer.from(g), x);
  }
  async start(s) {
    if (this.mode === _r)
      this.key = await this.generateKey(), this.nonceBase = await this.generateNonceBase(), s.enqueue(this.createHeader());
    else if (this.mode !== Or)
      throw new Error("mode must be either encrypt or decrypt");
  }
  async transformPrevChunk(s, h) {
    if (this.mode === _r)
      h.enqueue(
        await this.encryptRecord(this.prevChunk, this.seq, s)
      ), this.seq++;
    else {
      if (this.seq === 0) {
        const x = this.readHeader(this.prevChunk);
        this.salt = x.salt, this.rs = x.rs, this.key = await this.generateKey(), this.nonceBase = await this.generateNonceBase();
      } else
        h.enqueue(
          await this.decryptRecord(this.prevChunk, this.seq - 1, s)
        );
      this.seq++;
    }
  }
  async transform(s, h) {
    this.firstchunk || await this.transformPrevChunk(!1, h), this.firstchunk = !1, this.prevChunk = z.Buffer.from(s.buffer);
  }
  async flush(s) {
    this.prevChunk && await this.transformPrevChunk(!0, s);
  }
}
class Vr {
  constructor(s, h) {
    this.mode = h, this.rs = s, this.chunkSize = h === _r ? s - 17 : 21, this.partialChunk = new Uint8Array(this.chunkSize), this.offset = 0;
  }
  send(s, h) {
    h.enqueue(s), this.chunkSize === 21 && this.mode === Or && (this.chunkSize = this.rs), this.partialChunk = new Uint8Array(this.chunkSize), this.offset = 0;
  }
  //reslice input into record sized chunks
  transform(s, h) {
    let x = 0;
    if (this.offset > 0) {
      const w = Math.min(s.byteLength, this.chunkSize - this.offset);
      this.partialChunk.set(s.slice(0, w), this.offset), this.offset += w, x += w, this.offset === this.chunkSize && this.send(this.partialChunk, h);
    }
    for (; x < s.byteLength; ) {
      const w = s.byteLength - x;
      if (w >= this.chunkSize) {
        const g = s.slice(x, x + this.chunkSize);
        x += this.chunkSize, this.send(g, h);
      } else {
        const g = s.slice(x, x + w);
        x += g.byteLength, this.partialChunk.set(g), this.offset = g.byteLength;
      }
    }
  }
  flush(s) {
    this.offset > 0 && s.enqueue(this.partialChunk.slice(0, this.offset));
  }
}
function at(p, s, h = Gr, x = ut(hr)) {
  const w = "encrypt", g = pr(p, new Vr(h, w));
  return pr(g, new Yr(w, s, h, x));
}
function st(p, s, h = Gr) {
  const x = "decrypt", w = pr(p, new Vr(h, x));
  return pr(w, new Yr(x, s, h));
}
const fr = new TextEncoder(), ct = new TextDecoder();
class ft {
  constructor(s, h) {
    this._nonce = h || "yRCdyQ1EMSA3mo4rqSkuNQ==", s ? this.rawSecret = cr.b64ToArray(s) : this.rawSecret = crypto.getRandomValues(new Uint8Array(16)), this.secretKeyPromise = crypto.subtle.importKey(
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
  set nonce(s) {
    s && s !== this._nonce && (this._nonce = s);
  }
  setPassword(s, h) {
    this.authKeyPromise = crypto.subtle.importKey("raw", fr.encode(s), { name: "PBKDF2" }, !1, [
      "deriveKey"
    ]).then(
      (x) => crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: fr.encode(h),
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
  setAuthKey(s) {
    this.authKeyPromise = crypto.subtle.importKey(
      "raw",
      cr.b64ToArray(s),
      {
        name: "HMAC",
        hash: "SHA-256"
      },
      !0,
      ["sign"]
    );
  }
  async authKeyB64() {
    const s = await this.authKeyPromise, h = await crypto.subtle.exportKey("raw", s);
    return cr.arrayToB64(new Uint8Array(h));
  }
  async authHeader() {
    const s = await this.authKeyPromise, h = await crypto.subtle.sign(
      {
        name: "HMAC"
      },
      s,
      cr.b64ToArray(this.nonce)
    );
    return `send-v1 ${cr.arrayToB64(new Uint8Array(h))}`;
  }
  async encryptMetadata(s) {
    const h = await this.metaKeyPromise;
    return await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(12),
        tagLength: 128
      },
      h,
      fr.encode(
        JSON.stringify({
          name: s.name,
          size: s.size,
          type: s.type || "application/octet-stream",
          manifest: s.manifest || {}
        })
      )
    );
  }
  encryptStream(s) {
    return at(s, this.rawSecret);
  }
  decryptStream(s) {
    return st(s, this.rawSecret);
  }
  async decryptMetadata(s) {
    const h = await this.metaKeyPromise, x = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(12),
        tagLength: 128
      },
      h,
      s
    );
    return JSON.parse(ct.decode(x));
  }
}
let Nr = null;
try {
  Nr = localStorage.getItem("wssURL");
} catch {
}
Nr || (Nr = "wss://send.firefox.com/api/ws");
let ht = "";
function pt(p) {
  return ht + p;
}
function lt(p) {
  return p = p || "", p.split(" ")[1];
}
async function xt(p, s, h) {
  const x = await s.authHeader(), w = await fetch(pt(`/api/download/${p}`), {
    signal: h,
    method: "GET",
    headers: { Authorization: x }
  }), g = w.headers.get("WWW-Authenticate");
  if (g && (s.nonce = lt(g)), w.status !== 200)
    throw new Error(w.status);
  return w.body;
}
async function Xr(p, s, h, x = 2) {
  try {
    return await xt(p, s, h);
  } catch (w) {
    if (w.message === "401" && --x > 0)
      return Xr(p, s, h, x);
    throw w.name === "AbortError" ? new Error("0") : w;
  }
}
function yt(p, s) {
  const h = new AbortController();
  function x() {
    h.abort();
  }
  return {
    cancel: x,
    result: Xr(p, s, h.signal)
  };
}
var X = {};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(p) {
  var s = v, h = wr, x = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  p.Buffer = u, p.SlowBuffer = Er, p.INSPECT_MAX_BYTES = 50;
  var w = 2147483647;
  p.kMaxLength = w, u.TYPED_ARRAY_SUPPORT = g(), !u.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function g() {
    try {
      var o = new Uint8Array(1), e = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(e, Uint8Array.prototype), Object.setPrototypeOf(o, e), o.foo() === 42;
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
    if (o > w)
      throw new RangeError('The value "' + o + '" is invalid for option "size"');
    var e = new Uint8Array(o);
    return Object.setPrototypeOf(e, u.prototype), e;
  }
  function u(o, e, n) {
    if (typeof o == "number") {
      if (typeof e == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return L(o);
    }
    return b(o, e, n);
  }
  u.poolSize = 8192;
  function b(o, e, n) {
    if (typeof o == "string")
      return H(o, e);
    if (ArrayBuffer.isView(o))
      return W(o);
    if (o == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof o
      );
    if (P(o, ArrayBuffer) || o && P(o.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (P(o, SharedArrayBuffer) || o && P(o.buffer, SharedArrayBuffer)))
      return Y(o, e, n);
    if (typeof o == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    var c = o.valueOf && o.valueOf();
    if (c != null && c !== o)
      return u.from(c, e, n);
    var l = mr(o);
    if (l) return l;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof o[Symbol.toPrimitive] == "function")
      return u.from(
        o[Symbol.toPrimitive]("string"),
        e,
        n
      );
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof o
    );
  }
  u.from = function(o, e, n) {
    return b(o, e, n);
  }, Object.setPrototypeOf(u.prototype, Uint8Array.prototype), Object.setPrototypeOf(u, Uint8Array);
  function N(o) {
    if (typeof o != "number")
      throw new TypeError('"size" argument must be of type number');
    if (o < 0)
      throw new RangeError('The value "' + o + '" is invalid for option "size"');
  }
  function S(o, e, n) {
    return N(o), o <= 0 ? B(o) : e !== void 0 ? typeof n == "string" ? B(o).fill(e, n) : B(o).fill(e) : B(o);
  }
  u.alloc = function(o, e, n) {
    return S(o, e, n);
  };
  function L(o) {
    return N(o), B(o < 0 ? 0 : J(o) | 0);
  }
  u.allocUnsafe = function(o) {
    return L(o);
  }, u.allocUnsafeSlow = function(o) {
    return L(o);
  };
  function H(o, e) {
    if ((typeof e != "string" || e === "") && (e = "utf8"), !u.isEncoding(e))
      throw new TypeError("Unknown encoding: " + e);
    var n = rr(o, e) | 0, c = B(n), l = c.write(o, e);
    return l !== n && (c = c.slice(0, l)), c;
  }
  function k(o) {
    for (var e = o.length < 0 ? 0 : J(o.length) | 0, n = B(e), c = 0; c < e; c += 1)
      n[c] = o[c] & 255;
    return n;
  }
  function W(o) {
    if (P(o, Uint8Array)) {
      var e = new Uint8Array(o);
      return Y(e.buffer, e.byteOffset, e.byteLength);
    }
    return k(o);
  }
  function Y(o, e, n) {
    if (e < 0 || o.byteLength < e)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (o.byteLength < e + (n || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    var c;
    return e === void 0 && n === void 0 ? c = new Uint8Array(o) : n === void 0 ? c = new Uint8Array(o, e) : c = new Uint8Array(o, e, n), Object.setPrototypeOf(c, u.prototype), c;
  }
  function mr(o) {
    if (u.isBuffer(o)) {
      var e = J(o.length) | 0, n = B(e);
      return n.length === 0 || o.copy(n, 0, 0, e), n;
    }
    if (o.length !== void 0)
      return typeof o.length != "number" || V(o.length) ? B(0) : k(o);
    if (o.type === "Buffer" && Array.isArray(o.data))
      return k(o.data);
  }
  function J(o) {
    if (o >= w)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + w.toString(16) + " bytes");
    return o | 0;
  }
  function Er(o) {
    return +o != o && (o = 0), u.alloc(+o);
  }
  u.isBuffer = function(e) {
    return e != null && e._isBuffer === !0 && e !== u.prototype;
  }, u.compare = function(e, n) {
    if (P(e, Uint8Array) && (e = u.from(e, e.offset, e.byteLength)), P(n, Uint8Array) && (n = u.from(n, n.offset, n.byteLength)), !u.isBuffer(e) || !u.isBuffer(n))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (e === n) return 0;
    for (var c = e.length, l = n.length, m = 0, E = Math.min(c, l); m < E; ++m)
      if (e[m] !== n[m]) {
        c = e[m], l = n[m];
        break;
      }
    return c < l ? -1 : l < c ? 1 : 0;
  }, u.isEncoding = function(e) {
    switch (String(e).toLowerCase()) {
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
  }, u.concat = function(e, n) {
    if (!Array.isArray(e))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (e.length === 0)
      return u.alloc(0);
    var c;
    if (n === void 0)
      for (n = 0, c = 0; c < e.length; ++c)
        n += e[c].length;
    var l = u.allocUnsafe(n), m = 0;
    for (c = 0; c < e.length; ++c) {
      var E = e[c];
      if (P(E, Uint8Array))
        m + E.length > l.length ? u.from(E).copy(l, m) : Uint8Array.prototype.set.call(
          l,
          E,
          m
        );
      else if (u.isBuffer(E))
        E.copy(l, m);
      else
        throw new TypeError('"list" argument must be an Array of Buffers');
      m += E.length;
    }
    return l;
  };
  function rr(o, e) {
    if (u.isBuffer(o))
      return o.length;
    if (ArrayBuffer.isView(o) || P(o, ArrayBuffer))
      return o.byteLength;
    if (typeof o != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof o
      );
    var n = o.length, c = arguments.length > 2 && arguments[2] === !0;
    if (!c && n === 0) return 0;
    for (var l = !1; ; )
      switch (e) {
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
          if (l)
            return c ? -1 : O(o).length;
          e = ("" + e).toLowerCase(), l = !0;
      }
  }
  u.byteLength = rr;
  function gr(o, e, n) {
    var c = !1;
    if ((e === void 0 || e < 0) && (e = 0), e > this.length || ((n === void 0 || n > this.length) && (n = this.length), n <= 0) || (n >>>= 0, e >>>= 0, n <= e))
      return "";
    for (o || (o = "utf8"); ; )
      switch (o) {
        case "hex":
          return Cr(this, e, n);
        case "utf8":
        case "utf-8":
          return nr(this, e, n);
        case "ascii":
          return Tr(this, e, n);
        case "latin1":
        case "binary":
          return Rr(this, e, n);
        case "base64":
          return Ir(this, e, n);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return Lr(this, e, n);
        default:
          if (c) throw new TypeError("Unknown encoding: " + o);
          o = (o + "").toLowerCase(), c = !0;
      }
  }
  u.prototype._isBuffer = !0;
  function $(o, e, n) {
    var c = o[e];
    o[e] = o[n], o[n] = c;
  }
  u.prototype.swap16 = function() {
    var e = this.length;
    if (e % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (var n = 0; n < e; n += 2)
      $(this, n, n + 1);
    return this;
  }, u.prototype.swap32 = function() {
    var e = this.length;
    if (e % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (var n = 0; n < e; n += 4)
      $(this, n, n + 3), $(this, n + 1, n + 2);
    return this;
  }, u.prototype.swap64 = function() {
    var e = this.length;
    if (e % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (var n = 0; n < e; n += 8)
      $(this, n, n + 7), $(this, n + 1, n + 6), $(this, n + 2, n + 5), $(this, n + 3, n + 4);
    return this;
  }, u.prototype.toString = function() {
    var e = this.length;
    return e === 0 ? "" : arguments.length === 0 ? nr(this, 0, e) : gr.apply(this, arguments);
  }, u.prototype.toLocaleString = u.prototype.toString, u.prototype.equals = function(e) {
    if (!u.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
    return this === e ? !0 : u.compare(this, e) === 0;
  }, u.prototype.inspect = function() {
    var e = "", n = p.INSPECT_MAX_BYTES;
    return e = this.toString("hex", 0, n).replace(/(.{2})/g, "$1 ").trim(), this.length > n && (e += " ... "), "<Buffer " + e + ">";
  }, x && (u.prototype[x] = u.prototype.inspect), u.prototype.compare = function(e, n, c, l, m) {
    if (P(e, Uint8Array) && (e = u.from(e, e.offset, e.byteLength)), !u.isBuffer(e))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e
      );
    if (n === void 0 && (n = 0), c === void 0 && (c = e ? e.length : 0), l === void 0 && (l = 0), m === void 0 && (m = this.length), n < 0 || c > e.length || l < 0 || m > this.length)
      throw new RangeError("out of range index");
    if (l >= m && n >= c)
      return 0;
    if (l >= m)
      return -1;
    if (n >= c)
      return 1;
    if (n >>>= 0, c >>>= 0, l >>>= 0, m >>>= 0, this === e) return 0;
    for (var E = m - l, A = c - n, R = Math.min(E, A), I = this.slice(l, m), K = e.slice(n, c), i = 0; i < R; ++i)
      if (I[i] !== K[i]) {
        E = I[i], A = K[i];
        break;
      }
    return E < A ? -1 : A < E ? 1 : 0;
  };
  function tr(o, e, n, c, l) {
    if (o.length === 0) return -1;
    if (typeof n == "string" ? (c = n, n = 0) : n > 2147483647 ? n = 2147483647 : n < -2147483648 && (n = -2147483648), n = +n, V(n) && (n = l ? 0 : o.length - 1), n < 0 && (n = o.length + n), n >= o.length) {
      if (l) return -1;
      n = o.length - 1;
    } else if (n < 0)
      if (l) n = 0;
      else return -1;
    if (typeof e == "string" && (e = u.from(e, c)), u.isBuffer(e))
      return e.length === 0 ? -1 : er(o, e, n, c, l);
    if (typeof e == "number")
      return e = e & 255, typeof Uint8Array.prototype.indexOf == "function" ? l ? Uint8Array.prototype.indexOf.call(o, e, n) : Uint8Array.prototype.lastIndexOf.call(o, e, n) : er(o, [e], n, c, l);
    throw new TypeError("val must be string, number or Buffer");
  }
  function er(o, e, n, c, l) {
    var m = 1, E = o.length, A = e.length;
    if (c !== void 0 && (c = String(c).toLowerCase(), c === "ucs2" || c === "ucs-2" || c === "utf16le" || c === "utf-16le")) {
      if (o.length < 2 || e.length < 2)
        return -1;
      m = 2, E /= 2, A /= 2, n /= 2;
    }
    function R(t, a) {
      return m === 1 ? t[a] : t.readUInt16BE(a * m);
    }
    var I;
    if (l) {
      var K = -1;
      for (I = n; I < E; I++)
        if (R(o, I) === R(e, K === -1 ? 0 : I - K)) {
          if (K === -1 && (K = I), I - K + 1 === A) return K * m;
        } else
          K !== -1 && (I -= I - K), K = -1;
    } else
      for (n + A > E && (n = E - A), I = n; I >= 0; I--) {
        for (var i = !0, r = 0; r < A; r++)
          if (R(o, I + r) !== R(e, r)) {
            i = !1;
            break;
          }
        if (i) return I;
      }
    return -1;
  }
  u.prototype.includes = function(e, n, c) {
    return this.indexOf(e, n, c) !== -1;
  }, u.prototype.indexOf = function(e, n, c) {
    return tr(this, e, n, c, !0);
  }, u.prototype.lastIndexOf = function(e, n, c) {
    return tr(this, e, n, c, !1);
  };
  function Br(o, e, n, c) {
    n = Number(n) || 0;
    var l = o.length - n;
    c ? (c = Number(c), c > l && (c = l)) : c = l;
    var m = e.length;
    c > m / 2 && (c = m / 2);
    for (var E = 0; E < c; ++E) {
      var A = parseInt(e.substr(E * 2, 2), 16);
      if (V(A)) return E;
      o[n + E] = A;
    }
    return E;
  }
  function br(o, e, n, c) {
    return Z(O(e, o.length - n), o, n, c);
  }
  function Ur(o, e, n, c) {
    return Z(sr(e), o, n, c);
  }
  function Ar(o, e, n, c) {
    return Z(dr(e), o, n, c);
  }
  function Fr(o, e, n, c) {
    return Z(yr(e, o.length - n), o, n, c);
  }
  u.prototype.write = function(e, n, c, l) {
    if (n === void 0)
      l = "utf8", c = this.length, n = 0;
    else if (c === void 0 && typeof n == "string")
      l = n, c = this.length, n = 0;
    else if (isFinite(n))
      n = n >>> 0, isFinite(c) ? (c = c >>> 0, l === void 0 && (l = "utf8")) : (l = c, c = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    var m = this.length - n;
    if ((c === void 0 || c > m) && (c = m), e.length > 0 && (c < 0 || n < 0) || n > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    l || (l = "utf8");
    for (var E = !1; ; )
      switch (l) {
        case "hex":
          return Br(this, e, n, c);
        case "utf8":
        case "utf-8":
          return br(this, e, n, c);
        case "ascii":
        case "latin1":
        case "binary":
          return Ur(this, e, n, c);
        case "base64":
          return Ar(this, e, n, c);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return Fr(this, e, n, c);
        default:
          if (E) throw new TypeError("Unknown encoding: " + l);
          l = ("" + l).toLowerCase(), E = !0;
      }
  }, u.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function Ir(o, e, n) {
    return e === 0 && n === o.length ? s.fromByteArray(o) : s.fromByteArray(o.slice(e, n));
  }
  function nr(o, e, n) {
    n = Math.min(o.length, n);
    for (var c = [], l = e; l < n; ) {
      var m = o[l], E = null, A = m > 239 ? 4 : m > 223 ? 3 : m > 191 ? 2 : 1;
      if (l + A <= n) {
        var R, I, K, i;
        switch (A) {
          case 1:
            m < 128 && (E = m);
            break;
          case 2:
            R = o[l + 1], (R & 192) === 128 && (i = (m & 31) << 6 | R & 63, i > 127 && (E = i));
            break;
          case 3:
            R = o[l + 1], I = o[l + 2], (R & 192) === 128 && (I & 192) === 128 && (i = (m & 15) << 12 | (R & 63) << 6 | I & 63, i > 2047 && (i < 55296 || i > 57343) && (E = i));
            break;
          case 4:
            R = o[l + 1], I = o[l + 2], K = o[l + 3], (R & 192) === 128 && (I & 192) === 128 && (K & 192) === 128 && (i = (m & 15) << 18 | (R & 63) << 12 | (I & 63) << 6 | K & 63, i > 65535 && i < 1114112 && (E = i));
        }
      }
      E === null ? (E = 65533, A = 1) : E > 65535 && (E -= 65536, c.push(E >>> 10 & 1023 | 55296), E = 56320 | E & 1023), c.push(E), l += A;
    }
    return Sr(c);
  }
  var ir = 4096;
  function Sr(o) {
    var e = o.length;
    if (e <= ir)
      return String.fromCharCode.apply(String, o);
    for (var n = "", c = 0; c < e; )
      n += String.fromCharCode.apply(
        String,
        o.slice(c, c += ir)
      );
    return n;
  }
  function Tr(o, e, n) {
    var c = "";
    n = Math.min(o.length, n);
    for (var l = e; l < n; ++l)
      c += String.fromCharCode(o[l] & 127);
    return c;
  }
  function Rr(o, e, n) {
    var c = "";
    n = Math.min(o.length, n);
    for (var l = e; l < n; ++l)
      c += String.fromCharCode(o[l]);
    return c;
  }
  function Cr(o, e, n) {
    var c = o.length;
    (!e || e < 0) && (e = 0), (!n || n < 0 || n > c) && (n = c);
    for (var l = "", m = e; m < n; ++m)
      l += kr[o[m]];
    return l;
  }
  function Lr(o, e, n) {
    for (var c = o.slice(e, n), l = "", m = 0; m < c.length - 1; m += 2)
      l += String.fromCharCode(c[m] + c[m + 1] * 256);
    return l;
  }
  u.prototype.slice = function(e, n) {
    var c = this.length;
    e = ~~e, n = n === void 0 ? c : ~~n, e < 0 ? (e += c, e < 0 && (e = 0)) : e > c && (e = c), n < 0 ? (n += c, n < 0 && (n = 0)) : n > c && (n = c), n < e && (n = e);
    var l = this.subarray(e, n);
    return Object.setPrototypeOf(l, u.prototype), l;
  };
  function U(o, e, n) {
    if (o % 1 !== 0 || o < 0) throw new RangeError("offset is not uint");
    if (o + e > n) throw new RangeError("Trying to access beyond buffer length");
  }
  u.prototype.readUintLE = u.prototype.readUIntLE = function(e, n, c) {
    e = e >>> 0, n = n >>> 0, c || U(e, n, this.length);
    for (var l = this[e], m = 1, E = 0; ++E < n && (m *= 256); )
      l += this[e + E] * m;
    return l;
  }, u.prototype.readUintBE = u.prototype.readUIntBE = function(e, n, c) {
    e = e >>> 0, n = n >>> 0, c || U(e, n, this.length);
    for (var l = this[e + --n], m = 1; n > 0 && (m *= 256); )
      l += this[e + --n] * m;
    return l;
  }, u.prototype.readUint8 = u.prototype.readUInt8 = function(e, n) {
    return e = e >>> 0, n || U(e, 1, this.length), this[e];
  }, u.prototype.readUint16LE = u.prototype.readUInt16LE = function(e, n) {
    return e = e >>> 0, n || U(e, 2, this.length), this[e] | this[e + 1] << 8;
  }, u.prototype.readUint16BE = u.prototype.readUInt16BE = function(e, n) {
    return e = e >>> 0, n || U(e, 2, this.length), this[e] << 8 | this[e + 1];
  }, u.prototype.readUint32LE = u.prototype.readUInt32LE = function(e, n) {
    return e = e >>> 0, n || U(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + this[e + 3] * 16777216;
  }, u.prototype.readUint32BE = u.prototype.readUInt32BE = function(e, n) {
    return e = e >>> 0, n || U(e, 4, this.length), this[e] * 16777216 + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
  }, u.prototype.readIntLE = function(e, n, c) {
    e = e >>> 0, n = n >>> 0, c || U(e, n, this.length);
    for (var l = this[e], m = 1, E = 0; ++E < n && (m *= 256); )
      l += this[e + E] * m;
    return m *= 128, l >= m && (l -= Math.pow(2, 8 * n)), l;
  }, u.prototype.readIntBE = function(e, n, c) {
    e = e >>> 0, n = n >>> 0, c || U(e, n, this.length);
    for (var l = n, m = 1, E = this[e + --l]; l > 0 && (m *= 256); )
      E += this[e + --l] * m;
    return m *= 128, E >= m && (E -= Math.pow(2, 8 * n)), E;
  }, u.prototype.readInt8 = function(e, n) {
    return e = e >>> 0, n || U(e, 1, this.length), this[e] & 128 ? (255 - this[e] + 1) * -1 : this[e];
  }, u.prototype.readInt16LE = function(e, n) {
    e = e >>> 0, n || U(e, 2, this.length);
    var c = this[e] | this[e + 1] << 8;
    return c & 32768 ? c | 4294901760 : c;
  }, u.prototype.readInt16BE = function(e, n) {
    e = e >>> 0, n || U(e, 2, this.length);
    var c = this[e + 1] | this[e] << 8;
    return c & 32768 ? c | 4294901760 : c;
  }, u.prototype.readInt32LE = function(e, n) {
    return e = e >>> 0, n || U(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
  }, u.prototype.readInt32BE = function(e, n) {
    return e = e >>> 0, n || U(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
  }, u.prototype.readFloatLE = function(e, n) {
    return e = e >>> 0, n || U(e, 4, this.length), h.read(this, e, !0, 23, 4);
  }, u.prototype.readFloatBE = function(e, n) {
    return e = e >>> 0, n || U(e, 4, this.length), h.read(this, e, !1, 23, 4);
  }, u.prototype.readDoubleLE = function(e, n) {
    return e = e >>> 0, n || U(e, 8, this.length), h.read(this, e, !0, 52, 8);
  }, u.prototype.readDoubleBE = function(e, n) {
    return e = e >>> 0, n || U(e, 8, this.length), h.read(this, e, !1, 52, 8);
  };
  function T(o, e, n, c, l, m) {
    if (!u.isBuffer(o)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (e > l || e < m) throw new RangeError('"value" argument is out of bounds');
    if (n + c > o.length) throw new RangeError("Index out of range");
  }
  u.prototype.writeUintLE = u.prototype.writeUIntLE = function(e, n, c, l) {
    if (e = +e, n = n >>> 0, c = c >>> 0, !l) {
      var m = Math.pow(2, 8 * c) - 1;
      T(this, e, n, c, m, 0);
    }
    var E = 1, A = 0;
    for (this[n] = e & 255; ++A < c && (E *= 256); )
      this[n + A] = e / E & 255;
    return n + c;
  }, u.prototype.writeUintBE = u.prototype.writeUIntBE = function(e, n, c, l) {
    if (e = +e, n = n >>> 0, c = c >>> 0, !l) {
      var m = Math.pow(2, 8 * c) - 1;
      T(this, e, n, c, m, 0);
    }
    var E = c - 1, A = 1;
    for (this[n + E] = e & 255; --E >= 0 && (A *= 256); )
      this[n + E] = e / A & 255;
    return n + c;
  }, u.prototype.writeUint8 = u.prototype.writeUInt8 = function(e, n, c) {
    return e = +e, n = n >>> 0, c || T(this, e, n, 1, 255, 0), this[n] = e & 255, n + 1;
  }, u.prototype.writeUint16LE = u.prototype.writeUInt16LE = function(e, n, c) {
    return e = +e, n = n >>> 0, c || T(this, e, n, 2, 65535, 0), this[n] = e & 255, this[n + 1] = e >>> 8, n + 2;
  }, u.prototype.writeUint16BE = u.prototype.writeUInt16BE = function(e, n, c) {
    return e = +e, n = n >>> 0, c || T(this, e, n, 2, 65535, 0), this[n] = e >>> 8, this[n + 1] = e & 255, n + 2;
  }, u.prototype.writeUint32LE = u.prototype.writeUInt32LE = function(e, n, c) {
    return e = +e, n = n >>> 0, c || T(this, e, n, 4, 4294967295, 0), this[n + 3] = e >>> 24, this[n + 2] = e >>> 16, this[n + 1] = e >>> 8, this[n] = e & 255, n + 4;
  }, u.prototype.writeUint32BE = u.prototype.writeUInt32BE = function(e, n, c) {
    return e = +e, n = n >>> 0, c || T(this, e, n, 4, 4294967295, 0), this[n] = e >>> 24, this[n + 1] = e >>> 16, this[n + 2] = e >>> 8, this[n + 3] = e & 255, n + 4;
  }, u.prototype.writeIntLE = function(e, n, c, l) {
    if (e = +e, n = n >>> 0, !l) {
      var m = Math.pow(2, 8 * c - 1);
      T(this, e, n, c, m - 1, -m);
    }
    var E = 0, A = 1, R = 0;
    for (this[n] = e & 255; ++E < c && (A *= 256); )
      e < 0 && R === 0 && this[n + E - 1] !== 0 && (R = 1), this[n + E] = (e / A >> 0) - R & 255;
    return n + c;
  }, u.prototype.writeIntBE = function(e, n, c, l) {
    if (e = +e, n = n >>> 0, !l) {
      var m = Math.pow(2, 8 * c - 1);
      T(this, e, n, c, m - 1, -m);
    }
    var E = c - 1, A = 1, R = 0;
    for (this[n + E] = e & 255; --E >= 0 && (A *= 256); )
      e < 0 && R === 0 && this[n + E + 1] !== 0 && (R = 1), this[n + E] = (e / A >> 0) - R & 255;
    return n + c;
  }, u.prototype.writeInt8 = function(e, n, c) {
    return e = +e, n = n >>> 0, c || T(this, e, n, 1, 127, -128), e < 0 && (e = 255 + e + 1), this[n] = e & 255, n + 1;
  }, u.prototype.writeInt16LE = function(e, n, c) {
    return e = +e, n = n >>> 0, c || T(this, e, n, 2, 32767, -32768), this[n] = e & 255, this[n + 1] = e >>> 8, n + 2;
  }, u.prototype.writeInt16BE = function(e, n, c) {
    return e = +e, n = n >>> 0, c || T(this, e, n, 2, 32767, -32768), this[n] = e >>> 8, this[n + 1] = e & 255, n + 2;
  }, u.prototype.writeInt32LE = function(e, n, c) {
    return e = +e, n = n >>> 0, c || T(this, e, n, 4, 2147483647, -2147483648), this[n] = e & 255, this[n + 1] = e >>> 8, this[n + 2] = e >>> 16, this[n + 3] = e >>> 24, n + 4;
  }, u.prototype.writeInt32BE = function(e, n, c) {
    return e = +e, n = n >>> 0, c || T(this, e, n, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), this[n] = e >>> 24, this[n + 1] = e >>> 16, this[n + 2] = e >>> 8, this[n + 3] = e & 255, n + 4;
  };
  function or(o, e, n, c, l, m) {
    if (n + c > o.length) throw new RangeError("Index out of range");
    if (n < 0) throw new RangeError("Index out of range");
  }
  function ur(o, e, n, c, l) {
    return e = +e, n = n >>> 0, l || or(o, e, n, 4), h.write(o, e, n, c, 23, 4), n + 4;
  }
  u.prototype.writeFloatLE = function(e, n, c) {
    return ur(this, e, n, !0, c);
  }, u.prototype.writeFloatBE = function(e, n, c) {
    return ur(this, e, n, !1, c);
  };
  function ar(o, e, n, c, l) {
    return e = +e, n = n >>> 0, l || or(o, e, n, 8), h.write(o, e, n, c, 52, 8), n + 8;
  }
  u.prototype.writeDoubleLE = function(e, n, c) {
    return ar(this, e, n, !0, c);
  }, u.prototype.writeDoubleBE = function(e, n, c) {
    return ar(this, e, n, !1, c);
  }, u.prototype.copy = function(e, n, c, l) {
    if (!u.isBuffer(e)) throw new TypeError("argument should be a Buffer");
    if (c || (c = 0), !l && l !== 0 && (l = this.length), n >= e.length && (n = e.length), n || (n = 0), l > 0 && l < c && (l = c), l === c || e.length === 0 || this.length === 0) return 0;
    if (n < 0)
      throw new RangeError("targetStart out of bounds");
    if (c < 0 || c >= this.length) throw new RangeError("Index out of range");
    if (l < 0) throw new RangeError("sourceEnd out of bounds");
    l > this.length && (l = this.length), e.length - n < l - c && (l = e.length - n + c);
    var m = l - c;
    return this === e && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(n, c, l) : Uint8Array.prototype.set.call(
      e,
      this.subarray(c, l),
      n
    ), m;
  }, u.prototype.fill = function(e, n, c, l) {
    if (typeof e == "string") {
      if (typeof n == "string" ? (l = n, n = 0, c = this.length) : typeof c == "string" && (l = c, c = this.length), l !== void 0 && typeof l != "string")
        throw new TypeError("encoding must be a string");
      if (typeof l == "string" && !u.isEncoding(l))
        throw new TypeError("Unknown encoding: " + l);
      if (e.length === 1) {
        var m = e.charCodeAt(0);
        (l === "utf8" && m < 128 || l === "latin1") && (e = m);
      }
    } else typeof e == "number" ? e = e & 255 : typeof e == "boolean" && (e = Number(e));
    if (n < 0 || this.length < n || this.length < c)
      throw new RangeError("Out of range index");
    if (c <= n)
      return this;
    n = n >>> 0, c = c === void 0 ? this.length : c >>> 0, e || (e = 0);
    var E;
    if (typeof e == "number")
      for (E = n; E < c; ++E)
        this[E] = e;
    else {
      var A = u.isBuffer(e) ? e : u.from(e, l), R = A.length;
      if (R === 0)
        throw new TypeError('The value "' + e + '" is invalid for argument "value"');
      for (E = 0; E < c - n; ++E)
        this[E + n] = A[E % R];
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
  function O(o, e) {
    e = e || 1 / 0;
    for (var n, c = o.length, l = null, m = [], E = 0; E < c; ++E) {
      if (n = o.charCodeAt(E), n > 55295 && n < 57344) {
        if (!l) {
          if (n > 56319) {
            (e -= 3) > -1 && m.push(239, 191, 189);
            continue;
          } else if (E + 1 === c) {
            (e -= 3) > -1 && m.push(239, 191, 189);
            continue;
          }
          l = n;
          continue;
        }
        if (n < 56320) {
          (e -= 3) > -1 && m.push(239, 191, 189), l = n;
          continue;
        }
        n = (l - 55296 << 10 | n - 56320) + 65536;
      } else l && (e -= 3) > -1 && m.push(239, 191, 189);
      if (l = null, n < 128) {
        if ((e -= 1) < 0) break;
        m.push(n);
      } else if (n < 2048) {
        if ((e -= 2) < 0) break;
        m.push(
          n >> 6 | 192,
          n & 63 | 128
        );
      } else if (n < 65536) {
        if ((e -= 3) < 0) break;
        m.push(
          n >> 12 | 224,
          n >> 6 & 63 | 128,
          n & 63 | 128
        );
      } else if (n < 1114112) {
        if ((e -= 4) < 0) break;
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
    for (var e = [], n = 0; n < o.length; ++n)
      e.push(o.charCodeAt(n) & 255);
    return e;
  }
  function yr(o, e) {
    for (var n, c, l, m = [], E = 0; E < o.length && !((e -= 2) < 0); ++E)
      n = o.charCodeAt(E), c = n >> 8, l = n % 256, m.push(l), m.push(c);
    return m;
  }
  function dr(o) {
    return s.toByteArray(xr(o));
  }
  function Z(o, e, n, c) {
    for (var l = 0; l < c && !(l + n >= e.length || l >= o.length); ++l)
      e[l + n] = o[l];
    return l;
  }
  function P(o, e) {
    return o instanceof e || o != null && o.constructor != null && o.constructor.name != null && o.constructor.name === e.name;
  }
  function V(o) {
    return o !== o;
  }
  var kr = function() {
    for (var o = "0123456789abcdef", e = new Array(256), n = 0; n < 16; ++n)
      for (var c = n * 16, l = 0; l < 16; ++l)
        e[c + l] = o[n] + o[l];
    return e;
  }();
})(X);
const dt = X.Buffer.from && X.Buffer.alloc && X.Buffer.allocUnsafe && X.Buffer.allocUnsafeSlow ? X.Buffer.from : (
  // support for Node < 5.10
  (p) => new X.Buffer(p)
);
function wt(p, s) {
  const h = (x, w) => s(x, w) >>> 0;
  return h.signed = s, h.unsigned = h, h.model = p, h;
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
const mt = wt("crc-32", function(p, s) {
  X.Buffer.isBuffer(p) || (p = dt(p));
  let h = s === 0 ? 0 : ~~s ^ -1;
  for (let x = 0; x < p.length; x++) {
    const w = p[x];
    h = Kr[(h ^ w) & 255] ^ h >>> 8;
  }
  return h ^ -1;
}), Et = new TextEncoder();
function gt(p = /* @__PURE__ */ new Date()) {
  const s = p.getFullYear() - 1980 << 9, h = p.getMonth() + 1 << 5, x = p.getDate(), w = s | h | x, g = p.getHours() << 11, B = p.getMinutes() << 5, u = Math.floor(p.getSeconds() / 2), b = g | B | u;
  return { date: w, time: b };
}
class Bt {
  constructor(s) {
    this.name = Et.encode(s.name), this.size = s.size, this.bytesRead = 0, this.crc = null, this.dateTime = gt();
  }
  get header() {
    const s = new ArrayBuffer(30 + this.name.byteLength), h = new DataView(s);
    h.setUint32(0, 67324752, !0), h.setUint16(4, 20, !0), h.setUint16(6, 2056, !0), h.setUint16(8, 0, !0), h.setUint16(10, this.dateTime.time, !0), h.setUint16(12, this.dateTime.date, !0), h.setUint32(14, 0, !0), h.setUint32(18, 0, !0), h.setUint32(22, 0, !0), h.setUint16(26, this.name.byteLength, !0), h.setUint16(28, 0, !0);
    for (let x = 0; x < this.name.byteLength; x++)
      h.setUint8(30 + x, this.name[x]);
    return new Uint8Array(s);
  }
  get dataDescriptor() {
    const s = new ArrayBuffer(16), h = new DataView(s);
    return h.setUint32(0, 134695760, !0), h.setUint32(4, this.crc, !0), h.setUint32(8, this.size, !0), h.setUint32(12, this.size, !0), new Uint8Array(s);
  }
  directoryRecord(s) {
    const h = new ArrayBuffer(46 + this.name.byteLength), x = new DataView(h);
    x.setUint32(0, 33639248, !0), x.setUint16(4, 20, !0), x.setUint16(6, 20, !0), x.setUint16(8, 2056, !0), x.setUint16(10, 0, !0), x.setUint16(12, this.dateTime.time, !0), x.setUint16(14, this.dateTime.date, !0), x.setUint32(16, this.crc, !0), x.setUint32(20, this.size, !0), x.setUint32(24, this.size, !0), x.setUint16(28, this.name.byteLength, !0), x.setUint16(30, 0, !0), x.setUint16(32, 0, !0), x.setUint16(34, 0, !0), x.setUint16(36, 0, !0), x.setUint32(38, 0, !0), x.setUint32(42, s, !0);
    for (let w = 0; w < this.name.byteLength; w++)
      x.setUint8(46 + w, this.name[w]);
    return new Uint8Array(h);
  }
  get byteLength() {
    return this.size + this.name.byteLength + 30 + 16;
  }
  append(s, h) {
    this.bytesRead += s.byteLength;
    const x = s.byteLength - Math.max(this.bytesRead - this.size, 0), w = s.slice(0, x);
    if (this.crc = mt(w, this.crc), h.enqueue(w), x < s.byteLength)
      return s.slice(x, s.byteLength);
  }
}
function bt(p, s) {
  let h = 0, x = 0;
  for (let w = 0; w < p.length; w++) {
    const g = p[w], B = g.directoryRecord(h);
    h += g.byteLength, s.enqueue(B), x += B.byteLength;
  }
  s.enqueue(Ut(p.length, x, h));
}
function Ut(p, s, h) {
  const x = new ArrayBuffer(22), w = new DataView(x);
  return w.setUint32(0, 101010256, !0), w.setUint16(4, 0, !0), w.setUint16(6, 0, !0), w.setUint16(8, p, !0), w.setUint16(10, p, !0), w.setUint32(12, s, !0), w.setUint32(16, h, !0), w.setUint16(20, 0, !0), new Uint8Array(x);
}
class At {
  constructor(s, h) {
    this.files = s, this.fileIndex = 0, this.file = null, this.reader = h.getReader(), this.nextFile(), this.extra = null;
  }
  nextFile() {
    this.file = this.files[this.fileIndex++];
  }
  async pull(s) {
    if (!this.file)
      return bt(this.files, s), s.close();
    if (this.file.bytesRead === 0 && (s.enqueue(this.file.header), this.extra && (this.extra = this.file.append(this.extra, s))), this.file.bytesRead >= this.file.size)
      return s.enqueue(this.file.dataDescriptor), this.nextFile(), this.pull(s);
    const h = await this.reader.read();
    if (h.done)
      return this.nextFile(), this.pull(s);
    this.extra = this.file.append(h.value, s);
  }
}
class Ft {
  constructor(s, h) {
    this.files = s.files.map((x) => new Bt(x)), this.source = h;
  }
  get stream() {
    return new ReadableStream(new At(this.files, this.source));
  }
  get size() {
    return this.files.reduce(
      (x, w) => x + w.byteLength * 2 - w.size,
      0
    ) + 22;
  }
}
function It(p) {
  const s = p.replace(/[^\x20-\x7E]/g, "_"), h = encodeURIComponent(p);
  return `attachment; filename="${s}"; filename*=UTF-8''${h}`;
}
let Pr = !1;
const Q = /* @__PURE__ */ new Map(), St = /.*\.(png|svg|jpg)$/, Tt = /\.[A-Fa-f0-9]{8}\.(js|css|png|svg|jpg)(#\w+)?$/, Rt = /\/api\/download\/([A-Fa-f0-9]{4,})/, Ct = /\.woff2?$/;
self.addEventListener("install", () => {
  self.skipWaiting();
});
self.addEventListener("activate", (p) => {
  p.waitUntil(self.clients.claim()).then(kt);
});
async function Lt(p) {
  const s = Q.get(p);
  if (!s)
    return console.error("[SW] File not found in map for id:", p), new Response(null, { status: 400 });
  console.log("[SW] Starting decryptStream for", p, "with nonce:", s.nonce);
  try {
    let h = s.size, x = s.type;
    const w = new ft(s.key, s.nonce);
    s.requiresPassword && w.setPassword(s.password, s.url), console.log("[SW] Calling downloadStream..."), s.download = yt(p, w);
    const g = await s.download.result, B = w.decryptStream(g);
    let u = null;
    if (s.type === "send-archive") {
      const S = new Ft(s.manifest, B);
      u = S.stream, x = "application/zip", h = S.size;
    }
    const b = pr(
      u || B,
      {
        transform(S, L) {
          s.progress += S.length, L.enqueue(S);
        }
      },
      function() {
        s.download.cancel(), Q.delete(p);
      }
    ), N = {
      "Content-Disposition": It(s.filename),
      "Content-Type": x,
      "Content-Length": h
    };
    return console.log("[SW] Returning decrypted stream response"), new Response(b, { headers: N });
  } catch (h) {
    return console.error("[SW] Error in decryptStream:", h, "noSave:", Pr), Pr ? new Response(null, { status: h.message }) : (console.log("[SW] Redirecting to download page"), new Response(null, {
      status: 302,
      headers: {
        Location: `/download/${p}#${s.key}`
      }
    }));
  }
}
async function kt() {
  try {
    await Dt();
    const p = await caches.open($r), s = assets.match(St);
    await p.addAll(s);
  } catch (p) {
    console.error(p);
  }
}
async function Dt() {
  const p = await caches.keys();
  for (const s of p)
    s !== $r && await caches.delete(s);
}
function Jr(p) {
  return Tt.test(p) || Ct.test(p);
}
async function Mt(p) {
  const s = await caches.open($r), h = await s.match(p);
  if (h)
    return h;
  const x = await fetch(p);
  return x.ok && Jr(p.url) && s.put(p, x.clone()), x;
}
self.onfetch = (p) => {
  const s = p.request;
  if (s.method !== "GET") return;
  const h = new URL(s.url), x = Rt.exec(h.pathname);
  x ? (console.log("[SW] Intercepted download request for:", x[1]), p.respondWith(Lt(x[1]))) : Jr(h.pathname) && p.respondWith(Mt(s));
};
self.onmessage = (p) => {
  if (p.data.request === "init") {
    console.log("[SW] Received init message for", p.data.id, "nonce:", p.data.nonce), Pr = p.data.noSave;
    const s = {
      key: p.data.key,
      nonce: p.data.nonce,
      filename: p.data.filename,
      requiresPassword: p.data.requiresPassword,
      password: p.data.password,
      url: p.data.url,
      type: p.data.type,
      manifest: p.data.manifest,
      size: p.data.size,
      progress: 0
    };
    Q.set(p.data.id, s), console.log("[SW] File info stored in map"), p.ports[0].postMessage("file info received");
  } else if (p.data.request === "progress") {
    const s = Q.get(p.data.id);
    s ? (s.progress === s.size && Q.delete(p.data.id), p.ports[0].postMessage({ progress: s.progress })) : p.ports[0].postMessage({ error: "cancelled" });
  } else if (p.data.request === "cancel") {
    const s = Q.get(p.data.id);
    s && (s.download && s.download.cancel(), Q.delete(p.data.id)), p.ports[0].postMessage("download cancelled");
  }
};
//# sourceMappingURL=serviceWorker.js.map
