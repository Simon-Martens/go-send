const te = "3.4.27";
function ne(h) {
  return h && h.__esModule && Object.prototype.hasOwnProperty.call(h, "default") ? h.default : h;
}
function ie(h) {
  if (Object.prototype.hasOwnProperty.call(h, "__esModule")) return h;
  var u = h.default;
  if (typeof u == "function") {
    var c = function l() {
      var y = !1;
      try {
        y = this instanceof l;
      } catch {
      }
      return y ? Reflect.construct(u, arguments, this.constructor) : u.apply(this, arguments);
    };
    c.prototype = u.prototype;
  } else c = {};
  return Object.defineProperty(c, "__esModule", { value: !0 }), Object.keys(h).forEach(function(l) {
    var y = Object.getOwnPropertyDescriptor(h, l);
    Object.defineProperty(c, l, y.get ? y : {
      enumerable: !0,
      get: function() {
        return h[l];
      }
    });
  }), c;
}
var Q = {};
Q.byteLength = ae;
Q.toByteArray = fe;
Q.fromByteArray = pe;
var G = [], z = [], oe = typeof Uint8Array < "u" ? Uint8Array : Array, kr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var J = 0, ue = kr.length; J < ue; ++J)
  G[J] = kr[J], z[kr.charCodeAt(J)] = J;
z[45] = 62;
z[95] = 63;
function Gr(h) {
  var u = h.length;
  if (u % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var c = h.indexOf("=");
  c === -1 && (c = u);
  var l = c === u ? 0 : 4 - c % 4;
  return [c, l];
}
function ae(h) {
  var u = Gr(h), c = u[0], l = u[1];
  return (c + l) * 3 / 4 - l;
}
function se(h, u, c) {
  return (u + c) * 3 / 4 - c;
}
function fe(h) {
  var u, c = Gr(h), l = c[0], y = c[1], B = new oe(se(h, l, y)), m = 0, o = y > 0 ? l - 4 : l, b;
  for (b = 0; b < o; b += 4)
    u = z[h.charCodeAt(b)] << 18 | z[h.charCodeAt(b + 1)] << 12 | z[h.charCodeAt(b + 2)] << 6 | z[h.charCodeAt(b + 3)], B[m++] = u >> 16 & 255, B[m++] = u >> 8 & 255, B[m++] = u & 255;
  return y === 2 && (u = z[h.charCodeAt(b)] << 2 | z[h.charCodeAt(b + 1)] >> 4, B[m++] = u & 255), y === 1 && (u = z[h.charCodeAt(b)] << 10 | z[h.charCodeAt(b + 1)] << 4 | z[h.charCodeAt(b + 2)] >> 2, B[m++] = u >> 8 & 255, B[m++] = u & 255), B;
}
function ce(h) {
  return G[h >> 18 & 63] + G[h >> 12 & 63] + G[h >> 6 & 63] + G[h & 63];
}
function he(h, u, c) {
  for (var l, y = [], B = u; B < c; B += 3)
    l = (h[B] << 16 & 16711680) + (h[B + 1] << 8 & 65280) + (h[B + 2] & 255), y.push(ce(l));
  return y.join("");
}
function pe(h) {
  for (var u, c = h.length, l = c % 3, y = [], B = 16383, m = 0, o = c - l; m < o; m += B)
    y.push(he(h, m, m + B > o ? o : m + B));
  return l === 1 ? (u = h[c - 1], y.push(
    G[u >> 2] + G[u << 4 & 63] + "=="
  )) : l === 2 && (u = (h[c - 2] << 8) + h[c - 1], y.push(
    G[u >> 10] + G[u >> 4 & 63] + G[u << 2 & 63] + "="
  )), y.join("");
}
var Dr, Kr;
function le() {
  if (Kr) return Dr;
  Kr = 1;
  const h = Q;
  function u(B) {
    return h.fromByteArray(B).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }
  function c(B) {
    return h.toByteArray(B + "===".slice((B.length + 3) % 4));
  }
  function l(B = 100) {
    return new Promise((m) => setTimeout(m, B));
  }
  async function y(B, m) {
    const o = B.getReader();
    let b = await o.read();
    if (m) {
      const L = new Uint8Array(m);
      let H = 0;
      for (; !b.done; )
        L.set(b.value, H), H += b.value.length, b = await o.read();
      return L.buffer;
    }
    const D = [];
    let S = 0;
    for (; !b.done; )
      D.push(b.value), S += b.value.length, b = await o.read();
    let _ = 0;
    const O = new Uint8Array(S);
    for (const L of D)
      O.set(L, _), _ += L.length;
    return O.buffer;
  }
  return Dr = {
    arrayToB64: u,
    b64ToArray: c,
    delay: l,
    streamToArrayBuffer: y
  }, Dr;
}
var fr = le(), K = {}, wr = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
wr.read = function(h, u, c, l, y) {
  var B, m, o = y * 8 - l - 1, b = (1 << o) - 1, D = b >> 1, S = -7, _ = c ? y - 1 : 0, O = c ? -1 : 1, L = h[u + _];
  for (_ += O, B = L & (1 << -S) - 1, L >>= -S, S += o; S > 0; B = B * 256 + h[u + _], _ += O, S -= 8)
    ;
  for (m = B & (1 << -S) - 1, B >>= -S, S += l; S > 0; m = m * 256 + h[u + _], _ += O, S -= 8)
    ;
  if (B === 0)
    B = 1 - D;
  else {
    if (B === b)
      return m ? NaN : (L ? -1 : 1) * (1 / 0);
    m = m + Math.pow(2, l), B = B - D;
  }
  return (L ? -1 : 1) * m * Math.pow(2, B - l);
};
wr.write = function(h, u, c, l, y, B) {
  var m, o, b, D = B * 8 - y - 1, S = (1 << D) - 1, _ = S >> 1, O = y === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, L = l ? 0 : B - 1, H = l ? 1 : -1, W = u < 0 || u === 0 && 1 / u < 0 ? 1 : 0;
  for (u = Math.abs(u), isNaN(u) || u === 1 / 0 ? (o = isNaN(u) ? 1 : 0, m = S) : (m = Math.floor(Math.log(u) / Math.LN2), u * (b = Math.pow(2, -m)) < 1 && (m--, b *= 2), m + _ >= 1 ? u += O / b : u += O * Math.pow(2, 1 - _), u * b >= 2 && (m++, b /= 2), m + _ >= S ? (o = 0, m = S) : m + _ >= 1 ? (o = (u * b - 1) * Math.pow(2, y), m = m + _) : (o = u * Math.pow(2, _ - 1) * Math.pow(2, y), m = 0)); y >= 8; h[c + L] = o & 255, L += H, o /= 256, y -= 8)
    ;
  for (m = m << y | o, D += y; D > 0; h[c + L] = m & 255, L += H, m /= 256, D -= 8)
    ;
  h[c + L - H] |= W * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(h) {
  const u = Q, c = wr, l = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  h.Buffer = o, h.SlowBuffer = Er, h.INSPECT_MAX_BYTES = 50;
  const y = 2147483647;
  h.kMaxLength = y, o.TYPED_ARRAY_SUPPORT = B(), !o.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function B() {
    try {
      const i = new Uint8Array(1), r = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(r, Uint8Array.prototype), Object.setPrototypeOf(i, r), i.foo() === 42;
    } catch {
      return !1;
    }
  }
  Object.defineProperty(o.prototype, "parent", {
    enumerable: !0,
    get: function() {
      if (o.isBuffer(this))
        return this.buffer;
    }
  }), Object.defineProperty(o.prototype, "offset", {
    enumerable: !0,
    get: function() {
      if (o.isBuffer(this))
        return this.byteOffset;
    }
  });
  function m(i) {
    if (i > y)
      throw new RangeError('The value "' + i + '" is invalid for option "size"');
    const r = new Uint8Array(i);
    return Object.setPrototypeOf(r, o.prototype), r;
  }
  function o(i, r, e) {
    if (typeof i == "number") {
      if (typeof r == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return _(i);
    }
    return b(i, r, e);
  }
  o.poolSize = 8192;
  function b(i, r, e) {
    if (typeof i == "string")
      return O(i, r);
    if (ArrayBuffer.isView(i))
      return H(i);
    if (i == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof i
      );
    if (g(i, ArrayBuffer) || i && g(i.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (g(i, SharedArrayBuffer) || i && g(i.buffer, SharedArrayBuffer)))
      return W(i, r, e);
    if (typeof i == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    const s = i.valueOf && i.valueOf();
    if (s != null && s !== i)
      return o.from(s, r, e);
    const p = mr(i);
    if (p) return p;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof i[Symbol.toPrimitive] == "function")
      return o.from(i[Symbol.toPrimitive]("string"), r, e);
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof i
    );
  }
  o.from = function(i, r, e) {
    return b(i, r, e);
  }, Object.setPrototypeOf(o.prototype, Uint8Array.prototype), Object.setPrototypeOf(o, Uint8Array);
  function D(i) {
    if (typeof i != "number")
      throw new TypeError('"size" argument must be of type number');
    if (i < 0)
      throw new RangeError('The value "' + i + '" is invalid for option "size"');
  }
  function S(i, r, e) {
    return D(i), i <= 0 ? m(i) : r !== void 0 ? typeof e == "string" ? m(i).fill(r, e) : m(i).fill(r) : m(i);
  }
  o.alloc = function(i, r, e) {
    return S(i, r, e);
  };
  function _(i) {
    return D(i), m(i < 0 ? 0 : V(i) | 0);
  }
  o.allocUnsafe = function(i) {
    return _(i);
  }, o.allocUnsafeSlow = function(i) {
    return _(i);
  };
  function O(i, r) {
    if ((typeof r != "string" || r === "") && (r = "utf8"), !o.isEncoding(r))
      throw new TypeError("Unknown encoding: " + r);
    const e = rr(i, r) | 0;
    let s = m(e);
    const p = s.write(i, r);
    return p !== e && (s = s.slice(0, p)), s;
  }
  function L(i) {
    const r = i.length < 0 ? 0 : V(i.length) | 0, e = m(r);
    for (let s = 0; s < r; s += 1)
      e[s] = i[s] & 255;
    return e;
  }
  function H(i) {
    if (g(i, Uint8Array)) {
      const r = new Uint8Array(i);
      return W(r.buffer, r.byteOffset, r.byteLength);
    }
    return L(i);
  }
  function W(i, r, e) {
    if (r < 0 || i.byteLength < r)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (i.byteLength < r + (e || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    let s;
    return r === void 0 && e === void 0 ? s = new Uint8Array(i) : e === void 0 ? s = new Uint8Array(i, r) : s = new Uint8Array(i, r, e), Object.setPrototypeOf(s, o.prototype), s;
  }
  function mr(i) {
    if (o.isBuffer(i)) {
      const r = V(i.length) | 0, e = m(r);
      return e.length === 0 || i.copy(e, 0, 0, r), e;
    }
    if (i.length !== void 0)
      return typeof i.length != "number" || U(i.length) ? m(0) : L(i);
    if (i.type === "Buffer" && Array.isArray(i.data))
      return L(i.data);
  }
  function V(i) {
    if (i >= y)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + y.toString(16) + " bytes");
    return i | 0;
  }
  function Er(i) {
    return +i != i && (i = 0), o.alloc(+i);
  }
  o.isBuffer = function(r) {
    return r != null && r._isBuffer === !0 && r !== o.prototype;
  }, o.compare = function(r, e) {
    if (g(r, Uint8Array) && (r = o.from(r, r.offset, r.byteLength)), g(e, Uint8Array) && (e = o.from(e, e.offset, e.byteLength)), !o.isBuffer(r) || !o.isBuffer(e))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (r === e) return 0;
    let s = r.length, p = e.length;
    for (let d = 0, w = Math.min(s, p); d < w; ++d)
      if (r[d] !== e[d]) {
        s = r[d], p = e[d];
        break;
      }
    return s < p ? -1 : p < s ? 1 : 0;
  }, o.isEncoding = function(r) {
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
  }, o.concat = function(r, e) {
    if (!Array.isArray(r))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (r.length === 0)
      return o.alloc(0);
    let s;
    if (e === void 0)
      for (e = 0, s = 0; s < r.length; ++s)
        e += r[s].length;
    const p = o.allocUnsafe(e);
    let d = 0;
    for (s = 0; s < r.length; ++s) {
      let w = r[s];
      if (g(w, Uint8Array))
        d + w.length > p.length ? (o.isBuffer(w) || (w = o.from(w)), w.copy(p, d)) : Uint8Array.prototype.set.call(
          p,
          w,
          d
        );
      else if (o.isBuffer(w))
        w.copy(p, d);
      else
        throw new TypeError('"list" argument must be an Array of Buffers');
      d += w.length;
    }
    return p;
  };
  function rr(i, r) {
    if (o.isBuffer(i))
      return i.length;
    if (ArrayBuffer.isView(i) || g(i, ArrayBuffer))
      return i.byteLength;
    if (typeof i != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof i
      );
    const e = i.length, s = arguments.length > 2 && arguments[2] === !0;
    if (!s && e === 0) return 0;
    let p = !1;
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
          return x(i).length;
        default:
          if (p)
            return s ? -1 : t(i).length;
          r = ("" + r).toLowerCase(), p = !0;
      }
  }
  o.byteLength = rr;
  function gr(i, r, e) {
    let s = !1;
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
          return _r(this, r, e);
        default:
          if (s) throw new TypeError("Unknown encoding: " + i);
          i = (i + "").toLowerCase(), s = !0;
      }
  }
  o.prototype._isBuffer = !0;
  function $(i, r, e) {
    const s = i[r];
    i[r] = i[e], i[e] = s;
  }
  o.prototype.swap16 = function() {
    const r = this.length;
    if (r % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let e = 0; e < r; e += 2)
      $(this, e, e + 1);
    return this;
  }, o.prototype.swap32 = function() {
    const r = this.length;
    if (r % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let e = 0; e < r; e += 4)
      $(this, e, e + 3), $(this, e + 1, e + 2);
    return this;
  }, o.prototype.swap64 = function() {
    const r = this.length;
    if (r % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let e = 0; e < r; e += 8)
      $(this, e, e + 7), $(this, e + 1, e + 6), $(this, e + 2, e + 5), $(this, e + 3, e + 4);
    return this;
  }, o.prototype.toString = function() {
    const r = this.length;
    return r === 0 ? "" : arguments.length === 0 ? nr(this, 0, r) : gr.apply(this, arguments);
  }, o.prototype.toLocaleString = o.prototype.toString, o.prototype.equals = function(r) {
    if (!o.isBuffer(r)) throw new TypeError("Argument must be a Buffer");
    return this === r ? !0 : o.compare(this, r) === 0;
  }, o.prototype.inspect = function() {
    let r = "";
    const e = h.INSPECT_MAX_BYTES;
    return r = this.toString("hex", 0, e).replace(/(.{2})/g, "$1 ").trim(), this.length > e && (r += " ... "), "<Buffer " + r + ">";
  }, l && (o.prototype[l] = o.prototype.inspect), o.prototype.compare = function(r, e, s, p, d) {
    if (g(r, Uint8Array) && (r = o.from(r, r.offset, r.byteLength)), !o.isBuffer(r))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof r
      );
    if (e === void 0 && (e = 0), s === void 0 && (s = r ? r.length : 0), p === void 0 && (p = 0), d === void 0 && (d = this.length), e < 0 || s > r.length || p < 0 || d > this.length)
      throw new RangeError("out of range index");
    if (p >= d && e >= s)
      return 0;
    if (p >= d)
      return -1;
    if (e >= s)
      return 1;
    if (e >>>= 0, s >>>= 0, p >>>= 0, d >>>= 0, this === r) return 0;
    let w = d - p, F = s - e;
    const M = Math.min(w, F), k = this.slice(p, d), N = r.slice(e, s);
    for (let C = 0; C < M; ++C)
      if (k[C] !== N[C]) {
        w = k[C], F = N[C];
        break;
      }
    return w < F ? -1 : F < w ? 1 : 0;
  };
  function er(i, r, e, s, p) {
    if (i.length === 0) return -1;
    if (typeof e == "string" ? (s = e, e = 0) : e > 2147483647 ? e = 2147483647 : e < -2147483648 && (e = -2147483648), e = +e, U(e) && (e = p ? 0 : i.length - 1), e < 0 && (e = i.length + e), e >= i.length) {
      if (p) return -1;
      e = i.length - 1;
    } else if (e < 0)
      if (p) e = 0;
      else return -1;
    if (typeof r == "string" && (r = o.from(r, s)), o.isBuffer(r))
      return r.length === 0 ? -1 : tr(i, r, e, s, p);
    if (typeof r == "number")
      return r = r & 255, typeof Uint8Array.prototype.indexOf == "function" ? p ? Uint8Array.prototype.indexOf.call(i, r, e) : Uint8Array.prototype.lastIndexOf.call(i, r, e) : tr(i, [r], e, s, p);
    throw new TypeError("val must be string, number or Buffer");
  }
  function tr(i, r, e, s, p) {
    let d = 1, w = i.length, F = r.length;
    if (s !== void 0 && (s = String(s).toLowerCase(), s === "ucs2" || s === "ucs-2" || s === "utf16le" || s === "utf-16le")) {
      if (i.length < 2 || r.length < 2)
        return -1;
      d = 2, w /= 2, F /= 2, e /= 2;
    }
    function M(N, C) {
      return d === 1 ? N[C] : N.readUInt16BE(C * d);
    }
    let k;
    if (p) {
      let N = -1;
      for (k = e; k < w; k++)
        if (M(i, k) === M(r, N === -1 ? 0 : k - N)) {
          if (N === -1 && (N = k), k - N + 1 === F) return N * d;
        } else
          N !== -1 && (k -= k - N), N = -1;
    } else
      for (e + F > w && (e = w - F), k = e; k >= 0; k--) {
        let N = !0;
        for (let C = 0; C < F; C++)
          if (M(i, k + C) !== M(r, C)) {
            N = !1;
            break;
          }
        if (N) return k;
      }
    return -1;
  }
  o.prototype.includes = function(r, e, s) {
    return this.indexOf(r, e, s) !== -1;
  }, o.prototype.indexOf = function(r, e, s) {
    return er(this, r, e, s, !0);
  }, o.prototype.lastIndexOf = function(r, e, s) {
    return er(this, r, e, s, !1);
  };
  function Br(i, r, e, s) {
    e = Number(e) || 0;
    const p = i.length - e;
    s ? (s = Number(s), s > p && (s = p)) : s = p;
    const d = r.length;
    s > d / 2 && (s = d / 2);
    let w;
    for (w = 0; w < s; ++w) {
      const F = parseInt(r.substr(w * 2, 2), 16);
      if (U(F)) return w;
      i[e + w] = F;
    }
    return w;
  }
  function br(i, r, e, s) {
    return E(t(r, i.length - e), i, e, s);
  }
  function Ar(i, r, e, s) {
    return E(n(r), i, e, s);
  }
  function Ur(i, r, e, s) {
    return E(x(r), i, e, s);
  }
  function Fr(i, r, e, s) {
    return E(f(r, i.length - e), i, e, s);
  }
  o.prototype.write = function(r, e, s, p) {
    if (e === void 0)
      p = "utf8", s = this.length, e = 0;
    else if (s === void 0 && typeof e == "string")
      p = e, s = this.length, e = 0;
    else if (isFinite(e))
      e = e >>> 0, isFinite(s) ? (s = s >>> 0, p === void 0 && (p = "utf8")) : (p = s, s = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    const d = this.length - e;
    if ((s === void 0 || s > d) && (s = d), r.length > 0 && (s < 0 || e < 0) || e > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    p || (p = "utf8");
    let w = !1;
    for (; ; )
      switch (p) {
        case "hex":
          return Br(this, r, e, s);
        case "utf8":
        case "utf-8":
          return br(this, r, e, s);
        case "ascii":
        case "latin1":
        case "binary":
          return Ar(this, r, e, s);
        case "base64":
          return Ur(this, r, e, s);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return Fr(this, r, e, s);
        default:
          if (w) throw new TypeError("Unknown encoding: " + p);
          p = ("" + p).toLowerCase(), w = !0;
      }
  }, o.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function Ir(i, r, e) {
    return r === 0 && e === i.length ? u.fromByteArray(i) : u.fromByteArray(i.slice(r, e));
  }
  function nr(i, r, e) {
    e = Math.min(i.length, e);
    const s = [];
    let p = r;
    for (; p < e; ) {
      const d = i[p];
      let w = null, F = d > 239 ? 4 : d > 223 ? 3 : d > 191 ? 2 : 1;
      if (p + F <= e) {
        let M, k, N, C;
        switch (F) {
          case 1:
            d < 128 && (w = d);
            break;
          case 2:
            M = i[p + 1], (M & 192) === 128 && (C = (d & 31) << 6 | M & 63, C > 127 && (w = C));
            break;
          case 3:
            M = i[p + 1], k = i[p + 2], (M & 192) === 128 && (k & 192) === 128 && (C = (d & 15) << 12 | (M & 63) << 6 | k & 63, C > 2047 && (C < 55296 || C > 57343) && (w = C));
            break;
          case 4:
            M = i[p + 1], k = i[p + 2], N = i[p + 3], (M & 192) === 128 && (k & 192) === 128 && (N & 192) === 128 && (C = (d & 15) << 18 | (M & 63) << 12 | (k & 63) << 6 | N & 63, C > 65535 && C < 1114112 && (w = C));
        }
      }
      w === null ? (w = 65533, F = 1) : w > 65535 && (w -= 65536, s.push(w >>> 10 & 1023 | 55296), w = 56320 | w & 1023), s.push(w), p += F;
    }
    return Sr(s);
  }
  const ir = 4096;
  function Sr(i) {
    const r = i.length;
    if (r <= ir)
      return String.fromCharCode.apply(String, i);
    let e = "", s = 0;
    for (; s < r; )
      e += String.fromCharCode.apply(
        String,
        i.slice(s, s += ir)
      );
    return e;
  }
  function Tr(i, r, e) {
    let s = "";
    e = Math.min(i.length, e);
    for (let p = r; p < e; ++p)
      s += String.fromCharCode(i[p] & 127);
    return s;
  }
  function Rr(i, r, e) {
    let s = "";
    e = Math.min(i.length, e);
    for (let p = r; p < e; ++p)
      s += String.fromCharCode(i[p]);
    return s;
  }
  function Cr(i, r, e) {
    const s = i.length;
    (!r || r < 0) && (r = 0), (!e || e < 0 || e > s) && (e = s);
    let p = "";
    for (let d = r; d < e; ++d)
      p += R[i[d]];
    return p;
  }
  function _r(i, r, e) {
    const s = i.slice(r, e);
    let p = "";
    for (let d = 0; d < s.length - 1; d += 2)
      p += String.fromCharCode(s[d] + s[d + 1] * 256);
    return p;
  }
  o.prototype.slice = function(r, e) {
    const s = this.length;
    r = ~~r, e = e === void 0 ? s : ~~e, r < 0 ? (r += s, r < 0 && (r = 0)) : r > s && (r = s), e < 0 ? (e += s, e < 0 && (e = 0)) : e > s && (e = s), e < r && (e = r);
    const p = this.subarray(r, e);
    return Object.setPrototypeOf(p, o.prototype), p;
  };
  function A(i, r, e) {
    if (i % 1 !== 0 || i < 0) throw new RangeError("offset is not uint");
    if (i + r > e) throw new RangeError("Trying to access beyond buffer length");
  }
  o.prototype.readUintLE = o.prototype.readUIntLE = function(r, e, s) {
    r = r >>> 0, e = e >>> 0, s || A(r, e, this.length);
    let p = this[r], d = 1, w = 0;
    for (; ++w < e && (d *= 256); )
      p += this[r + w] * d;
    return p;
  }, o.prototype.readUintBE = o.prototype.readUIntBE = function(r, e, s) {
    r = r >>> 0, e = e >>> 0, s || A(r, e, this.length);
    let p = this[r + --e], d = 1;
    for (; e > 0 && (d *= 256); )
      p += this[r + --e] * d;
    return p;
  }, o.prototype.readUint8 = o.prototype.readUInt8 = function(r, e) {
    return r = r >>> 0, e || A(r, 1, this.length), this[r];
  }, o.prototype.readUint16LE = o.prototype.readUInt16LE = function(r, e) {
    return r = r >>> 0, e || A(r, 2, this.length), this[r] | this[r + 1] << 8;
  }, o.prototype.readUint16BE = o.prototype.readUInt16BE = function(r, e) {
    return r = r >>> 0, e || A(r, 2, this.length), this[r] << 8 | this[r + 1];
  }, o.prototype.readUint32LE = o.prototype.readUInt32LE = function(r, e) {
    return r = r >>> 0, e || A(r, 4, this.length), (this[r] | this[r + 1] << 8 | this[r + 2] << 16) + this[r + 3] * 16777216;
  }, o.prototype.readUint32BE = o.prototype.readUInt32BE = function(r, e) {
    return r = r >>> 0, e || A(r, 4, this.length), this[r] * 16777216 + (this[r + 1] << 16 | this[r + 2] << 8 | this[r + 3]);
  }, o.prototype.readBigUInt64LE = I(function(r) {
    r = r >>> 0, v(r, "offset");
    const e = this[r], s = this[r + 7];
    (e === void 0 || s === void 0) && X(r, this.length - 8);
    const p = e + this[++r] * 2 ** 8 + this[++r] * 2 ** 16 + this[++r] * 2 ** 24, d = this[++r] + this[++r] * 2 ** 8 + this[++r] * 2 ** 16 + s * 2 ** 24;
    return BigInt(p) + (BigInt(d) << BigInt(32));
  }), o.prototype.readBigUInt64BE = I(function(r) {
    r = r >>> 0, v(r, "offset");
    const e = this[r], s = this[r + 7];
    (e === void 0 || s === void 0) && X(r, this.length - 8);
    const p = e * 2 ** 24 + this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + this[++r], d = this[++r] * 2 ** 24 + this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + s;
    return (BigInt(p) << BigInt(32)) + BigInt(d);
  }), o.prototype.readIntLE = function(r, e, s) {
    r = r >>> 0, e = e >>> 0, s || A(r, e, this.length);
    let p = this[r], d = 1, w = 0;
    for (; ++w < e && (d *= 256); )
      p += this[r + w] * d;
    return d *= 128, p >= d && (p -= Math.pow(2, 8 * e)), p;
  }, o.prototype.readIntBE = function(r, e, s) {
    r = r >>> 0, e = e >>> 0, s || A(r, e, this.length);
    let p = e, d = 1, w = this[r + --p];
    for (; p > 0 && (d *= 256); )
      w += this[r + --p] * d;
    return d *= 128, w >= d && (w -= Math.pow(2, 8 * e)), w;
  }, o.prototype.readInt8 = function(r, e) {
    return r = r >>> 0, e || A(r, 1, this.length), this[r] & 128 ? (255 - this[r] + 1) * -1 : this[r];
  }, o.prototype.readInt16LE = function(r, e) {
    r = r >>> 0, e || A(r, 2, this.length);
    const s = this[r] | this[r + 1] << 8;
    return s & 32768 ? s | 4294901760 : s;
  }, o.prototype.readInt16BE = function(r, e) {
    r = r >>> 0, e || A(r, 2, this.length);
    const s = this[r + 1] | this[r] << 8;
    return s & 32768 ? s | 4294901760 : s;
  }, o.prototype.readInt32LE = function(r, e) {
    return r = r >>> 0, e || A(r, 4, this.length), this[r] | this[r + 1] << 8 | this[r + 2] << 16 | this[r + 3] << 24;
  }, o.prototype.readInt32BE = function(r, e) {
    return r = r >>> 0, e || A(r, 4, this.length), this[r] << 24 | this[r + 1] << 16 | this[r + 2] << 8 | this[r + 3];
  }, o.prototype.readBigInt64LE = I(function(r) {
    r = r >>> 0, v(r, "offset");
    const e = this[r], s = this[r + 7];
    (e === void 0 || s === void 0) && X(r, this.length - 8);
    const p = this[r + 4] + this[r + 5] * 2 ** 8 + this[r + 6] * 2 ** 16 + (s << 24);
    return (BigInt(p) << BigInt(32)) + BigInt(e + this[++r] * 2 ** 8 + this[++r] * 2 ** 16 + this[++r] * 2 ** 24);
  }), o.prototype.readBigInt64BE = I(function(r) {
    r = r >>> 0, v(r, "offset");
    const e = this[r], s = this[r + 7];
    (e === void 0 || s === void 0) && X(r, this.length - 8);
    const p = (e << 24) + // Overflow
    this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + this[++r];
    return (BigInt(p) << BigInt(32)) + BigInt(this[++r] * 2 ** 24 + this[++r] * 2 ** 16 + this[++r] * 2 ** 8 + s);
  }), o.prototype.readFloatLE = function(r, e) {
    return r = r >>> 0, e || A(r, 4, this.length), c.read(this, r, !0, 23, 4);
  }, o.prototype.readFloatBE = function(r, e) {
    return r = r >>> 0, e || A(r, 4, this.length), c.read(this, r, !1, 23, 4);
  }, o.prototype.readDoubleLE = function(r, e) {
    return r = r >>> 0, e || A(r, 8, this.length), c.read(this, r, !0, 52, 8);
  }, o.prototype.readDoubleBE = function(r, e) {
    return r = r >>> 0, e || A(r, 8, this.length), c.read(this, r, !1, 52, 8);
  };
  function T(i, r, e, s, p, d) {
    if (!o.isBuffer(i)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (r > p || r < d) throw new RangeError('"value" argument is out of bounds');
    if (e + s > i.length) throw new RangeError("Index out of range");
  }
  o.prototype.writeUintLE = o.prototype.writeUIntLE = function(r, e, s, p) {
    if (r = +r, e = e >>> 0, s = s >>> 0, !p) {
      const F = Math.pow(2, 8 * s) - 1;
      T(this, r, e, s, F, 0);
    }
    let d = 1, w = 0;
    for (this[e] = r & 255; ++w < s && (d *= 256); )
      this[e + w] = r / d & 255;
    return e + s;
  }, o.prototype.writeUintBE = o.prototype.writeUIntBE = function(r, e, s, p) {
    if (r = +r, e = e >>> 0, s = s >>> 0, !p) {
      const F = Math.pow(2, 8 * s) - 1;
      T(this, r, e, s, F, 0);
    }
    let d = s - 1, w = 1;
    for (this[e + d] = r & 255; --d >= 0 && (w *= 256); )
      this[e + d] = r / w & 255;
    return e + s;
  }, o.prototype.writeUint8 = o.prototype.writeUInt8 = function(r, e, s) {
    return r = +r, e = e >>> 0, s || T(this, r, e, 1, 255, 0), this[e] = r & 255, e + 1;
  }, o.prototype.writeUint16LE = o.prototype.writeUInt16LE = function(r, e, s) {
    return r = +r, e = e >>> 0, s || T(this, r, e, 2, 65535, 0), this[e] = r & 255, this[e + 1] = r >>> 8, e + 2;
  }, o.prototype.writeUint16BE = o.prototype.writeUInt16BE = function(r, e, s) {
    return r = +r, e = e >>> 0, s || T(this, r, e, 2, 65535, 0), this[e] = r >>> 8, this[e + 1] = r & 255, e + 2;
  }, o.prototype.writeUint32LE = o.prototype.writeUInt32LE = function(r, e, s) {
    return r = +r, e = e >>> 0, s || T(this, r, e, 4, 4294967295, 0), this[e + 3] = r >>> 24, this[e + 2] = r >>> 16, this[e + 1] = r >>> 8, this[e] = r & 255, e + 4;
  }, o.prototype.writeUint32BE = o.prototype.writeUInt32BE = function(r, e, s) {
    return r = +r, e = e >>> 0, s || T(this, r, e, 4, 4294967295, 0), this[e] = r >>> 24, this[e + 1] = r >>> 16, this[e + 2] = r >>> 8, this[e + 3] = r & 255, e + 4;
  };
  function or(i, r, e, s, p) {
    Z(r, s, p, i, e, 7);
    let d = Number(r & BigInt(4294967295));
    i[e++] = d, d = d >> 8, i[e++] = d, d = d >> 8, i[e++] = d, d = d >> 8, i[e++] = d;
    let w = Number(r >> BigInt(32) & BigInt(4294967295));
    return i[e++] = w, w = w >> 8, i[e++] = w, w = w >> 8, i[e++] = w, w = w >> 8, i[e++] = w, e;
  }
  function ur(i, r, e, s, p) {
    Z(r, s, p, i, e, 7);
    let d = Number(r & BigInt(4294967295));
    i[e + 7] = d, d = d >> 8, i[e + 6] = d, d = d >> 8, i[e + 5] = d, d = d >> 8, i[e + 4] = d;
    let w = Number(r >> BigInt(32) & BigInt(4294967295));
    return i[e + 3] = w, w = w >> 8, i[e + 2] = w, w = w >> 8, i[e + 1] = w, w = w >> 8, i[e] = w, e + 8;
  }
  o.prototype.writeBigUInt64LE = I(function(r, e = 0) {
    return or(this, r, e, BigInt(0), BigInt("0xffffffffffffffff"));
  }), o.prototype.writeBigUInt64BE = I(function(r, e = 0) {
    return ur(this, r, e, BigInt(0), BigInt("0xffffffffffffffff"));
  }), o.prototype.writeIntLE = function(r, e, s, p) {
    if (r = +r, e = e >>> 0, !p) {
      const M = Math.pow(2, 8 * s - 1);
      T(this, r, e, s, M - 1, -M);
    }
    let d = 0, w = 1, F = 0;
    for (this[e] = r & 255; ++d < s && (w *= 256); )
      r < 0 && F === 0 && this[e + d - 1] !== 0 && (F = 1), this[e + d] = (r / w >> 0) - F & 255;
    return e + s;
  }, o.prototype.writeIntBE = function(r, e, s, p) {
    if (r = +r, e = e >>> 0, !p) {
      const M = Math.pow(2, 8 * s - 1);
      T(this, r, e, s, M - 1, -M);
    }
    let d = s - 1, w = 1, F = 0;
    for (this[e + d] = r & 255; --d >= 0 && (w *= 256); )
      r < 0 && F === 0 && this[e + d + 1] !== 0 && (F = 1), this[e + d] = (r / w >> 0) - F & 255;
    return e + s;
  }, o.prototype.writeInt8 = function(r, e, s) {
    return r = +r, e = e >>> 0, s || T(this, r, e, 1, 127, -128), r < 0 && (r = 255 + r + 1), this[e] = r & 255, e + 1;
  }, o.prototype.writeInt16LE = function(r, e, s) {
    return r = +r, e = e >>> 0, s || T(this, r, e, 2, 32767, -32768), this[e] = r & 255, this[e + 1] = r >>> 8, e + 2;
  }, o.prototype.writeInt16BE = function(r, e, s) {
    return r = +r, e = e >>> 0, s || T(this, r, e, 2, 32767, -32768), this[e] = r >>> 8, this[e + 1] = r & 255, e + 2;
  }, o.prototype.writeInt32LE = function(r, e, s) {
    return r = +r, e = e >>> 0, s || T(this, r, e, 4, 2147483647, -2147483648), this[e] = r & 255, this[e + 1] = r >>> 8, this[e + 2] = r >>> 16, this[e + 3] = r >>> 24, e + 4;
  }, o.prototype.writeInt32BE = function(r, e, s) {
    return r = +r, e = e >>> 0, s || T(this, r, e, 4, 2147483647, -2147483648), r < 0 && (r = 4294967295 + r + 1), this[e] = r >>> 24, this[e + 1] = r >>> 16, this[e + 2] = r >>> 8, this[e + 3] = r & 255, e + 4;
  }, o.prototype.writeBigInt64LE = I(function(r, e = 0) {
    return or(this, r, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }), o.prototype.writeBigInt64BE = I(function(r, e = 0) {
    return ur(this, r, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function ar(i, r, e, s, p, d) {
    if (e + s > i.length) throw new RangeError("Index out of range");
    if (e < 0) throw new RangeError("Index out of range");
  }
  function lr(i, r, e, s, p) {
    return r = +r, e = e >>> 0, p || ar(i, r, e, 4), c.write(i, r, e, s, 23, 4), e + 4;
  }
  o.prototype.writeFloatLE = function(r, e, s) {
    return lr(this, r, e, !0, s);
  }, o.prototype.writeFloatBE = function(r, e, s) {
    return lr(this, r, e, !1, s);
  };
  function xr(i, r, e, s, p) {
    return r = +r, e = e >>> 0, p || ar(i, r, e, 8), c.write(i, r, e, s, 52, 8), e + 8;
  }
  o.prototype.writeDoubleLE = function(r, e, s) {
    return xr(this, r, e, !0, s);
  }, o.prototype.writeDoubleBE = function(r, e, s) {
    return xr(this, r, e, !1, s);
  }, o.prototype.copy = function(r, e, s, p) {
    if (!o.isBuffer(r)) throw new TypeError("argument should be a Buffer");
    if (s || (s = 0), !p && p !== 0 && (p = this.length), e >= r.length && (e = r.length), e || (e = 0), p > 0 && p < s && (p = s), p === s || r.length === 0 || this.length === 0) return 0;
    if (e < 0)
      throw new RangeError("targetStart out of bounds");
    if (s < 0 || s >= this.length) throw new RangeError("Index out of range");
    if (p < 0) throw new RangeError("sourceEnd out of bounds");
    p > this.length && (p = this.length), r.length - e < p - s && (p = r.length - e + s);
    const d = p - s;
    return this === r && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(e, s, p) : Uint8Array.prototype.set.call(
      r,
      this.subarray(s, p),
      e
    ), d;
  }, o.prototype.fill = function(r, e, s, p) {
    if (typeof r == "string") {
      if (typeof e == "string" ? (p = e, e = 0, s = this.length) : typeof s == "string" && (p = s, s = this.length), p !== void 0 && typeof p != "string")
        throw new TypeError("encoding must be a string");
      if (typeof p == "string" && !o.isEncoding(p))
        throw new TypeError("Unknown encoding: " + p);
      if (r.length === 1) {
        const w = r.charCodeAt(0);
        (p === "utf8" && w < 128 || p === "latin1") && (r = w);
      }
    } else typeof r == "number" ? r = r & 255 : typeof r == "boolean" && (r = Number(r));
    if (e < 0 || this.length < e || this.length < s)
      throw new RangeError("Out of range index");
    if (s <= e)
      return this;
    e = e >>> 0, s = s === void 0 ? this.length : s >>> 0, r || (r = 0);
    let d;
    if (typeof r == "number")
      for (d = e; d < s; ++d)
        this[d] = r;
    else {
      const w = o.isBuffer(r) ? r : o.from(r, p), F = w.length;
      if (F === 0)
        throw new TypeError('The value "' + r + '" is invalid for argument "value"');
      for (d = 0; d < s - e; ++d)
        this[d + e] = w[d % F];
    }
    return this;
  };
  const q = {};
  function sr(i, r, e) {
    q[i] = class extends e {
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
      set code(p) {
        Object.defineProperty(this, "code", {
          configurable: !0,
          enumerable: !0,
          value: p,
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
      let s = `The value of "${i}" is out of range.`, p = e;
      return Number.isInteger(e) && Math.abs(e) > 2 ** 32 ? p = yr(String(e)) : typeof e == "bigint" && (p = String(e), (e > BigInt(2) ** BigInt(32) || e < -(BigInt(2) ** BigInt(32))) && (p = yr(p)), p += "n"), s += ` It must be ${r}. Received ${p}`, s;
    },
    RangeError
  );
  function yr(i) {
    let r = "", e = i.length;
    const s = i[0] === "-" ? 1 : 0;
    for (; e >= s + 4; e -= 3)
      r = `_${i.slice(e - 3, e)}${r}`;
    return `${i.slice(0, e)}${r}`;
  }
  function dr(i, r, e) {
    v(r, "offset"), (i[r] === void 0 || i[r + e] === void 0) && X(r, i.length - (e + 1));
  }
  function Z(i, r, e, s, p, d) {
    if (i > e || i < r) {
      const w = typeof r == "bigint" ? "n" : "";
      let F;
      throw r === 0 || r === BigInt(0) ? F = `>= 0${w} and < 2${w} ** ${(d + 1) * 8}${w}` : F = `>= -(2${w} ** ${(d + 1) * 8 - 1}${w}) and < 2 ** ${(d + 1) * 8 - 1}${w}`, new q.ERR_OUT_OF_RANGE("value", F, i);
    }
    dr(s, p, d);
  }
  function v(i, r) {
    if (typeof i != "number")
      throw new q.ERR_INVALID_ARG_TYPE(r, "number", i);
  }
  function X(i, r, e) {
    throw Math.floor(i) !== i ? (v(i, e), new q.ERR_OUT_OF_RANGE("offset", "an integer", i)) : r < 0 ? new q.ERR_BUFFER_OUT_OF_BOUNDS() : new q.ERR_OUT_OF_RANGE(
      "offset",
      `>= 0 and <= ${r}`,
      i
    );
  }
  const Lr = /[^+/0-9A-Za-z-_]/g;
  function a(i) {
    if (i = i.split("=")[0], i = i.trim().replace(Lr, ""), i.length < 2) return "";
    for (; i.length % 4 !== 0; )
      i = i + "=";
    return i;
  }
  function t(i, r) {
    r = r || 1 / 0;
    let e;
    const s = i.length;
    let p = null;
    const d = [];
    for (let w = 0; w < s; ++w) {
      if (e = i.charCodeAt(w), e > 55295 && e < 57344) {
        if (!p) {
          if (e > 56319) {
            (r -= 3) > -1 && d.push(239, 191, 189);
            continue;
          } else if (w + 1 === s) {
            (r -= 3) > -1 && d.push(239, 191, 189);
            continue;
          }
          p = e;
          continue;
        }
        if (e < 56320) {
          (r -= 3) > -1 && d.push(239, 191, 189), p = e;
          continue;
        }
        e = (p - 55296 << 10 | e - 56320) + 65536;
      } else p && (r -= 3) > -1 && d.push(239, 191, 189);
      if (p = null, e < 128) {
        if ((r -= 1) < 0) break;
        d.push(e);
      } else if (e < 2048) {
        if ((r -= 2) < 0) break;
        d.push(
          e >> 6 | 192,
          e & 63 | 128
        );
      } else if (e < 65536) {
        if ((r -= 3) < 0) break;
        d.push(
          e >> 12 | 224,
          e >> 6 & 63 | 128,
          e & 63 | 128
        );
      } else if (e < 1114112) {
        if ((r -= 4) < 0) break;
        d.push(
          e >> 18 | 240,
          e >> 12 & 63 | 128,
          e >> 6 & 63 | 128,
          e & 63 | 128
        );
      } else
        throw new Error("Invalid code point");
    }
    return d;
  }
  function n(i) {
    const r = [];
    for (let e = 0; e < i.length; ++e)
      r.push(i.charCodeAt(e) & 255);
    return r;
  }
  function f(i, r) {
    let e, s, p;
    const d = [];
    for (let w = 0; w < i.length && !((r -= 2) < 0); ++w)
      e = i.charCodeAt(w), s = e >> 8, p = e % 256, d.push(p), d.push(s);
    return d;
  }
  function x(i) {
    return u.toByteArray(a(i));
  }
  function E(i, r, e, s) {
    let p;
    for (p = 0; p < s && !(p + e >= r.length || p >= i.length); ++p)
      r[p + e] = i[p];
    return p;
  }
  function g(i, r) {
    return i instanceof r || i != null && i.constructor != null && i.constructor.name != null && i.constructor.name === r.name;
  }
  function U(i) {
    return i !== i;
  }
  const R = function() {
    const i = "0123456789abcdef", r = new Array(256);
    for (let e = 0; e < 16; ++e) {
      const s = e * 16;
      for (let p = 0; p < 16; ++p)
        r[s + p] = i[e] + i[p];
    }
    return r;
  }();
  function I(i) {
    return typeof BigInt > "u" ? P : i;
  }
  function P() {
    throw new Error("BigInt not supported");
  }
})(K);
function pr(h, u, c) {
  try {
    return h.pipeThrough(new TransformStream(u));
  } catch {
    const y = h.getReader();
    return new ReadableStream({
      start(B) {
        if (u.start)
          return u.start(B);
      },
      async pull(B) {
        let m = !1;
        const o = {
          enqueue(b) {
            m = !0, B.enqueue(b);
          }
        };
        for (; !m; ) {
          const b = await y.read();
          if (b.done)
            return u.flush && await u.flush(B), B.close();
          await u.transform(b.value, o);
        }
      },
      cancel(B) {
        h.cancel(B), c && c(B);
      }
    });
  }
}
typeof window < "u" && (window.Buffer = K.Buffer);
const xe = 12, Or = 16, hr = 16, Mr = "encrypt", Wr = "decrypt", Xr = 1024 * 64, zr = new TextEncoder();
function ye(h) {
  const u = new Uint8Array(h);
  return crypto.getRandomValues(u), u.buffer;
}
class Yr {
  constructor(u, c, l, y) {
    this.mode = u, this.prevChunk, this.seq = 0, this.firstchunk = !0, this.rs = l, this.ikm = c.buffer, this.salt = y;
  }
  async generateKey() {
    const u = await crypto.subtle.importKey(
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
      u,
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
    const u = await crypto.subtle.importKey(
      "raw",
      this.ikm,
      "HKDF",
      !1,
      ["deriveKey"]
    ), c = await crypto.subtle.exportKey(
      "raw",
      await crypto.subtle.deriveKey(
        {
          name: "HKDF",
          salt: this.salt,
          info: zr.encode("Content-Encoding: nonce\0"),
          hash: "SHA-256"
        },
        u,
        {
          name: "AES-GCM",
          length: 128
        },
        !0,
        ["encrypt", "decrypt"]
      )
    );
    return K.Buffer.from(c.slice(0, xe));
  }
  generateNonce(u) {
    if (u > 4294967295)
      throw new Error("record sequence number exceeds limit");
    const c = K.Buffer.from(this.nonceBase), y = (c.readUIntBE(c.length - 4, 4) ^ u) >>> 0;
    return c.writeUIntBE(y, c.length - 4, 4), c;
  }
  pad(u, c) {
    const l = u.length;
    if (l + Or >= this.rs)
      throw new Error("data too large for record size");
    if (c) {
      const y = K.Buffer.alloc(1);
      return y.writeUInt8(2, 0), K.Buffer.concat([u, y]);
    } else {
      const y = K.Buffer.alloc(this.rs - l - Or);
      return y.fill(0), y.writeUInt8(1, 0), K.Buffer.concat([u, y]);
    }
  }
  unpad(u, c) {
    for (let l = u.length - 1; l >= 0; l--)
      if (u[l]) {
        if (c) {
          if (u[l] !== 2)
            throw new Error("delimiter of final record is not 2");
        } else if (u[l] !== 1)
          throw new Error("delimiter of not final record is not 1");
        return u.slice(0, l);
      }
    throw new Error("no delimiter found");
  }
  createHeader() {
    const u = K.Buffer.alloc(5);
    return u.writeUIntBE(this.rs, 0, 4), u.writeUIntBE(0, 4, 1), K.Buffer.concat([K.Buffer.from(this.salt), u]);
  }
  readHeader(u) {
    if (u.length < 21)
      throw new Error("chunk too small for reading header");
    const c = {};
    c.salt = u.buffer.slice(0, hr), c.rs = u.readUIntBE(hr, 4);
    const l = u.readUInt8(hr + 4);
    return c.length = l + hr + 5, c;
  }
  async encryptRecord(u, c, l) {
    const y = this.generateNonce(c), B = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: y },
      this.key,
      this.pad(u, l)
    );
    return K.Buffer.from(B);
  }
  async decryptRecord(u, c, l) {
    const y = this.generateNonce(c), B = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: y,
        tagLength: 128
      },
      this.key,
      u
    );
    return this.unpad(K.Buffer.from(B), l);
  }
  async start(u) {
    if (this.mode === Mr)
      this.key = await this.generateKey(), this.nonceBase = await this.generateNonceBase(), u.enqueue(this.createHeader());
    else if (this.mode !== Wr)
      throw new Error("mode must be either encrypt or decrypt");
  }
  async transformPrevChunk(u, c) {
    if (this.mode === Mr)
      c.enqueue(
        await this.encryptRecord(this.prevChunk, this.seq, u)
      ), this.seq++;
    else {
      if (this.seq === 0) {
        const l = this.readHeader(this.prevChunk);
        this.salt = l.salt, this.rs = l.rs, this.key = await this.generateKey(), this.nonceBase = await this.generateNonceBase();
      } else
        c.enqueue(
          await this.decryptRecord(this.prevChunk, this.seq - 1, u)
        );
      this.seq++;
    }
  }
  async transform(u, c) {
    this.firstchunk || await this.transformPrevChunk(!1, c), this.firstchunk = !1, this.prevChunk = K.Buffer.from(u.buffer);
  }
  async flush(u) {
    this.prevChunk && await this.transformPrevChunk(!0, u);
  }
}
class Vr {
  constructor(u, c) {
    this.mode = c, this.rs = u, this.chunkSize = c === Mr ? u - 17 : 21, this.partialChunk = new Uint8Array(this.chunkSize), this.offset = 0;
  }
  send(u, c) {
    c.enqueue(u), this.chunkSize === 21 && this.mode === Wr && (this.chunkSize = this.rs), this.partialChunk = new Uint8Array(this.chunkSize), this.offset = 0;
  }
  //reslice input into record sized chunks
  transform(u, c) {
    let l = 0;
    if (this.offset > 0) {
      const y = Math.min(u.byteLength, this.chunkSize - this.offset);
      this.partialChunk.set(u.slice(0, y), this.offset), this.offset += y, l += y, this.offset === this.chunkSize && this.send(this.partialChunk, c);
    }
    for (; l < u.byteLength; ) {
      const y = u.byteLength - l;
      if (y >= this.chunkSize) {
        const B = u.slice(l, l + this.chunkSize);
        l += this.chunkSize, this.send(B, c);
      } else {
        const B = u.slice(l, l + y);
        l += B.byteLength, this.partialChunk.set(B), this.offset = B.byteLength;
      }
    }
  }
  flush(u) {
    this.offset > 0 && u.enqueue(this.partialChunk.slice(0, this.offset));
  }
}
function de(h, u, c = Xr, l = ye(hr)) {
  const y = "encrypt", B = pr(h, new Vr(c, y));
  return pr(B, new Yr(y, u, c, l));
}
function we(h, u, c = Xr) {
  const l = "decrypt", y = pr(h, new Vr(c, l));
  return pr(y, new Yr(l, u, c));
}
const cr = new TextEncoder(), me = new TextDecoder();
class Ee {
  constructor(u, c) {
    this._nonce = c || "yRCdyQ1EMSA3mo4rqSkuNQ==", u ? this.rawSecret = fr.b64ToArray(u) : this.rawSecret = crypto.getRandomValues(new Uint8Array(16)), this.secretKeyPromise = crypto.subtle.importKey(
      "raw",
      this.rawSecret,
      "HKDF",
      !1,
      ["deriveKey"]
    ), this.metaKeyPromise = this.secretKeyPromise.then(function(l) {
      return crypto.subtle.deriveKey(
        {
          name: "HKDF",
          salt: new Uint8Array(),
          info: cr.encode("metadata"),
          hash: "SHA-256"
        },
        l,
        {
          name: "AES-GCM",
          length: 128
        },
        !1,
        ["encrypt", "decrypt"]
      );
    }), this.authKeyPromise = this.secretKeyPromise.then(function(l) {
      return crypto.subtle.deriveKey(
        {
          name: "HKDF",
          salt: new Uint8Array(),
          info: cr.encode("authentication"),
          hash: "SHA-256"
        },
        l,
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
  set nonce(u) {
    u && u !== this._nonce && (this._nonce = u);
  }
  setPassword(u, c) {
    this.authKeyPromise = crypto.subtle.importKey("raw", cr.encode(u), { name: "PBKDF2" }, !1, [
      "deriveKey"
    ]).then(
      (l) => crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: cr.encode(c),
          iterations: 100,
          hash: "SHA-256"
        },
        l,
        {
          name: "HMAC",
          hash: "SHA-256"
        },
        !0,
        ["sign"]
      )
    );
  }
  setAuthKey(u) {
    this.authKeyPromise = crypto.subtle.importKey(
      "raw",
      fr.b64ToArray(u),
      {
        name: "HMAC",
        hash: "SHA-256"
      },
      !0,
      ["sign"]
    );
  }
  async authKeyB64() {
    const u = await this.authKeyPromise, c = await crypto.subtle.exportKey("raw", u);
    return fr.arrayToB64(new Uint8Array(c));
  }
  async authHeader() {
    const u = await this.authKeyPromise, c = await crypto.subtle.sign(
      {
        name: "HMAC"
      },
      u,
      fr.b64ToArray(this.nonce)
    );
    return `send-v1 ${fr.arrayToB64(new Uint8Array(c))}`;
  }
  async encryptMetadata(u) {
    const c = await this.metaKeyPromise;
    return await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(12),
        tagLength: 128
      },
      c,
      cr.encode(
        JSON.stringify({
          name: u.name,
          size: u.size,
          type: u.type || "application/octet-stream",
          manifest: u.manifest || {}
        })
      )
    );
  }
  encryptStream(u) {
    return de(u, this.rawSecret);
  }
  decryptStream(u) {
    return we(u, this.rawSecret);
  }
  async decryptMetadata(u) {
    const c = await this.metaKeyPromise, l = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(12),
        tagLength: 128
      },
      c,
      u
    );
    return JSON.parse(me.decode(l));
  }
}
let Nr = null;
try {
  Nr = localStorage.getItem("wssURL");
} catch {
}
Nr || (Nr = "wss://send.firefox.com/api/ws");
let ge = "";
function Be(h) {
  return ge + h;
}
function be(h) {
  return h = h || "", h.split(" ")[1];
}
async function Ae(h, u, c) {
  const l = await u.authHeader(), y = await fetch(Be(`/api/download/${h}`), {
    signal: c,
    method: "GET",
    headers: { Authorization: l }
  }), B = y.headers.get("WWW-Authenticate");
  if (B && (u.nonce = be(B)), y.status !== 200)
    throw new Error(y.status);
  return y.body;
}
async function Zr(h, u, c, l = 2) {
  try {
    return await Ae(h, u, c);
  } catch (y) {
    if (y.message === "401" && --l > 0)
      return Zr(h, u, c, l);
    throw y.name === "AbortError" ? new Error("0") : y;
  }
}
function Ue(h, u) {
  const c = new AbortController();
  function l() {
    c.abort();
  }
  return {
    cancel: l,
    result: Zr(h, u, c.signal)
  };
}
var Y = {};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(h) {
  var u = Q, c = wr, l = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  h.Buffer = o, h.SlowBuffer = Er, h.INSPECT_MAX_BYTES = 50;
  var y = 2147483647;
  h.kMaxLength = y, o.TYPED_ARRAY_SUPPORT = B(), !o.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function B() {
    try {
      var a = new Uint8Array(1), t = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(t, Uint8Array.prototype), Object.setPrototypeOf(a, t), a.foo() === 42;
    } catch {
      return !1;
    }
  }
  Object.defineProperty(o.prototype, "parent", {
    enumerable: !0,
    get: function() {
      if (o.isBuffer(this))
        return this.buffer;
    }
  }), Object.defineProperty(o.prototype, "offset", {
    enumerable: !0,
    get: function() {
      if (o.isBuffer(this))
        return this.byteOffset;
    }
  });
  function m(a) {
    if (a > y)
      throw new RangeError('The value "' + a + '" is invalid for option "size"');
    var t = new Uint8Array(a);
    return Object.setPrototypeOf(t, o.prototype), t;
  }
  function o(a, t, n) {
    if (typeof a == "number") {
      if (typeof t == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return _(a);
    }
    return b(a, t, n);
  }
  o.poolSize = 8192;
  function b(a, t, n) {
    if (typeof a == "string")
      return O(a, t);
    if (ArrayBuffer.isView(a))
      return H(a);
    if (a == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof a
      );
    if (v(a, ArrayBuffer) || a && v(a.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (v(a, SharedArrayBuffer) || a && v(a.buffer, SharedArrayBuffer)))
      return W(a, t, n);
    if (typeof a == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    var f = a.valueOf && a.valueOf();
    if (f != null && f !== a)
      return o.from(f, t, n);
    var x = mr(a);
    if (x) return x;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof a[Symbol.toPrimitive] == "function")
      return o.from(
        a[Symbol.toPrimitive]("string"),
        t,
        n
      );
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof a
    );
  }
  o.from = function(a, t, n) {
    return b(a, t, n);
  }, Object.setPrototypeOf(o.prototype, Uint8Array.prototype), Object.setPrototypeOf(o, Uint8Array);
  function D(a) {
    if (typeof a != "number")
      throw new TypeError('"size" argument must be of type number');
    if (a < 0)
      throw new RangeError('The value "' + a + '" is invalid for option "size"');
  }
  function S(a, t, n) {
    return D(a), a <= 0 ? m(a) : t !== void 0 ? typeof n == "string" ? m(a).fill(t, n) : m(a).fill(t) : m(a);
  }
  o.alloc = function(a, t, n) {
    return S(a, t, n);
  };
  function _(a) {
    return D(a), m(a < 0 ? 0 : V(a) | 0);
  }
  o.allocUnsafe = function(a) {
    return _(a);
  }, o.allocUnsafeSlow = function(a) {
    return _(a);
  };
  function O(a, t) {
    if ((typeof t != "string" || t === "") && (t = "utf8"), !o.isEncoding(t))
      throw new TypeError("Unknown encoding: " + t);
    var n = rr(a, t) | 0, f = m(n), x = f.write(a, t);
    return x !== n && (f = f.slice(0, x)), f;
  }
  function L(a) {
    for (var t = a.length < 0 ? 0 : V(a.length) | 0, n = m(t), f = 0; f < t; f += 1)
      n[f] = a[f] & 255;
    return n;
  }
  function H(a) {
    if (v(a, Uint8Array)) {
      var t = new Uint8Array(a);
      return W(t.buffer, t.byteOffset, t.byteLength);
    }
    return L(a);
  }
  function W(a, t, n) {
    if (t < 0 || a.byteLength < t)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (a.byteLength < t + (n || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    var f;
    return t === void 0 && n === void 0 ? f = new Uint8Array(a) : n === void 0 ? f = new Uint8Array(a, t) : f = new Uint8Array(a, t, n), Object.setPrototypeOf(f, o.prototype), f;
  }
  function mr(a) {
    if (o.isBuffer(a)) {
      var t = V(a.length) | 0, n = m(t);
      return n.length === 0 || a.copy(n, 0, 0, t), n;
    }
    if (a.length !== void 0)
      return typeof a.length != "number" || X(a.length) ? m(0) : L(a);
    if (a.type === "Buffer" && Array.isArray(a.data))
      return L(a.data);
  }
  function V(a) {
    if (a >= y)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + y.toString(16) + " bytes");
    return a | 0;
  }
  function Er(a) {
    return +a != a && (a = 0), o.alloc(+a);
  }
  o.isBuffer = function(t) {
    return t != null && t._isBuffer === !0 && t !== o.prototype;
  }, o.compare = function(t, n) {
    if (v(t, Uint8Array) && (t = o.from(t, t.offset, t.byteLength)), v(n, Uint8Array) && (n = o.from(n, n.offset, n.byteLength)), !o.isBuffer(t) || !o.isBuffer(n))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (t === n) return 0;
    for (var f = t.length, x = n.length, E = 0, g = Math.min(f, x); E < g; ++E)
      if (t[E] !== n[E]) {
        f = t[E], x = n[E];
        break;
      }
    return f < x ? -1 : x < f ? 1 : 0;
  }, o.isEncoding = function(t) {
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
  }, o.concat = function(t, n) {
    if (!Array.isArray(t))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (t.length === 0)
      return o.alloc(0);
    var f;
    if (n === void 0)
      for (n = 0, f = 0; f < t.length; ++f)
        n += t[f].length;
    var x = o.allocUnsafe(n), E = 0;
    for (f = 0; f < t.length; ++f) {
      var g = t[f];
      if (v(g, Uint8Array))
        E + g.length > x.length ? o.from(g).copy(x, E) : Uint8Array.prototype.set.call(
          x,
          g,
          E
        );
      else if (o.isBuffer(g))
        g.copy(x, E);
      else
        throw new TypeError('"list" argument must be an Array of Buffers');
      E += g.length;
    }
    return x;
  };
  function rr(a, t) {
    if (o.isBuffer(a))
      return a.length;
    if (ArrayBuffer.isView(a) || v(a, ArrayBuffer))
      return a.byteLength;
    if (typeof a != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof a
      );
    var n = a.length, f = arguments.length > 2 && arguments[2] === !0;
    if (!f && n === 0) return 0;
    for (var x = !1; ; )
      switch (t) {
        case "ascii":
        case "latin1":
        case "binary":
          return n;
        case "utf8":
        case "utf-8":
          return q(a).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return n * 2;
        case "hex":
          return n >>> 1;
        case "base64":
          return dr(a).length;
        default:
          if (x)
            return f ? -1 : q(a).length;
          t = ("" + t).toLowerCase(), x = !0;
      }
  }
  o.byteLength = rr;
  function gr(a, t, n) {
    var f = !1;
    if ((t === void 0 || t < 0) && (t = 0), t > this.length || ((n === void 0 || n > this.length) && (n = this.length), n <= 0) || (n >>>= 0, t >>>= 0, n <= t))
      return "";
    for (a || (a = "utf8"); ; )
      switch (a) {
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
          return _r(this, t, n);
        default:
          if (f) throw new TypeError("Unknown encoding: " + a);
          a = (a + "").toLowerCase(), f = !0;
      }
  }
  o.prototype._isBuffer = !0;
  function $(a, t, n) {
    var f = a[t];
    a[t] = a[n], a[n] = f;
  }
  o.prototype.swap16 = function() {
    var t = this.length;
    if (t % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (var n = 0; n < t; n += 2)
      $(this, n, n + 1);
    return this;
  }, o.prototype.swap32 = function() {
    var t = this.length;
    if (t % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (var n = 0; n < t; n += 4)
      $(this, n, n + 3), $(this, n + 1, n + 2);
    return this;
  }, o.prototype.swap64 = function() {
    var t = this.length;
    if (t % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (var n = 0; n < t; n += 8)
      $(this, n, n + 7), $(this, n + 1, n + 6), $(this, n + 2, n + 5), $(this, n + 3, n + 4);
    return this;
  }, o.prototype.toString = function() {
    var t = this.length;
    return t === 0 ? "" : arguments.length === 0 ? nr(this, 0, t) : gr.apply(this, arguments);
  }, o.prototype.toLocaleString = o.prototype.toString, o.prototype.equals = function(t) {
    if (!o.isBuffer(t)) throw new TypeError("Argument must be a Buffer");
    return this === t ? !0 : o.compare(this, t) === 0;
  }, o.prototype.inspect = function() {
    var t = "", n = h.INSPECT_MAX_BYTES;
    return t = this.toString("hex", 0, n).replace(/(.{2})/g, "$1 ").trim(), this.length > n && (t += " ... "), "<Buffer " + t + ">";
  }, l && (o.prototype[l] = o.prototype.inspect), o.prototype.compare = function(t, n, f, x, E) {
    if (v(t, Uint8Array) && (t = o.from(t, t.offset, t.byteLength)), !o.isBuffer(t))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof t
      );
    if (n === void 0 && (n = 0), f === void 0 && (f = t ? t.length : 0), x === void 0 && (x = 0), E === void 0 && (E = this.length), n < 0 || f > t.length || x < 0 || E > this.length)
      throw new RangeError("out of range index");
    if (x >= E && n >= f)
      return 0;
    if (x >= E)
      return -1;
    if (n >= f)
      return 1;
    if (n >>>= 0, f >>>= 0, x >>>= 0, E >>>= 0, this === t) return 0;
    for (var g = E - x, U = f - n, R = Math.min(g, U), I = this.slice(x, E), P = t.slice(n, f), i = 0; i < R; ++i)
      if (I[i] !== P[i]) {
        g = I[i], U = P[i];
        break;
      }
    return g < U ? -1 : U < g ? 1 : 0;
  };
  function er(a, t, n, f, x) {
    if (a.length === 0) return -1;
    if (typeof n == "string" ? (f = n, n = 0) : n > 2147483647 ? n = 2147483647 : n < -2147483648 && (n = -2147483648), n = +n, X(n) && (n = x ? 0 : a.length - 1), n < 0 && (n = a.length + n), n >= a.length) {
      if (x) return -1;
      n = a.length - 1;
    } else if (n < 0)
      if (x) n = 0;
      else return -1;
    if (typeof t == "string" && (t = o.from(t, f)), o.isBuffer(t))
      return t.length === 0 ? -1 : tr(a, t, n, f, x);
    if (typeof t == "number")
      return t = t & 255, typeof Uint8Array.prototype.indexOf == "function" ? x ? Uint8Array.prototype.indexOf.call(a, t, n) : Uint8Array.prototype.lastIndexOf.call(a, t, n) : tr(a, [t], n, f, x);
    throw new TypeError("val must be string, number or Buffer");
  }
  function tr(a, t, n, f, x) {
    var E = 1, g = a.length, U = t.length;
    if (f !== void 0 && (f = String(f).toLowerCase(), f === "ucs2" || f === "ucs-2" || f === "utf16le" || f === "utf-16le")) {
      if (a.length < 2 || t.length < 2)
        return -1;
      E = 2, g /= 2, U /= 2, n /= 2;
    }
    function R(e, s) {
      return E === 1 ? e[s] : e.readUInt16BE(s * E);
    }
    var I;
    if (x) {
      var P = -1;
      for (I = n; I < g; I++)
        if (R(a, I) === R(t, P === -1 ? 0 : I - P)) {
          if (P === -1 && (P = I), I - P + 1 === U) return P * E;
        } else
          P !== -1 && (I -= I - P), P = -1;
    } else
      for (n + U > g && (n = g - U), I = n; I >= 0; I--) {
        for (var i = !0, r = 0; r < U; r++)
          if (R(a, I + r) !== R(t, r)) {
            i = !1;
            break;
          }
        if (i) return I;
      }
    return -1;
  }
  o.prototype.includes = function(t, n, f) {
    return this.indexOf(t, n, f) !== -1;
  }, o.prototype.indexOf = function(t, n, f) {
    return er(this, t, n, f, !0);
  }, o.prototype.lastIndexOf = function(t, n, f) {
    return er(this, t, n, f, !1);
  };
  function Br(a, t, n, f) {
    n = Number(n) || 0;
    var x = a.length - n;
    f ? (f = Number(f), f > x && (f = x)) : f = x;
    var E = t.length;
    f > E / 2 && (f = E / 2);
    for (var g = 0; g < f; ++g) {
      var U = parseInt(t.substr(g * 2, 2), 16);
      if (X(U)) return g;
      a[n + g] = U;
    }
    return g;
  }
  function br(a, t, n, f) {
    return Z(q(t, a.length - n), a, n, f);
  }
  function Ar(a, t, n, f) {
    return Z(sr(t), a, n, f);
  }
  function Ur(a, t, n, f) {
    return Z(dr(t), a, n, f);
  }
  function Fr(a, t, n, f) {
    return Z(yr(t, a.length - n), a, n, f);
  }
  o.prototype.write = function(t, n, f, x) {
    if (n === void 0)
      x = "utf8", f = this.length, n = 0;
    else if (f === void 0 && typeof n == "string")
      x = n, f = this.length, n = 0;
    else if (isFinite(n))
      n = n >>> 0, isFinite(f) ? (f = f >>> 0, x === void 0 && (x = "utf8")) : (x = f, f = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    var E = this.length - n;
    if ((f === void 0 || f > E) && (f = E), t.length > 0 && (f < 0 || n < 0) || n > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    x || (x = "utf8");
    for (var g = !1; ; )
      switch (x) {
        case "hex":
          return Br(this, t, n, f);
        case "utf8":
        case "utf-8":
          return br(this, t, n, f);
        case "ascii":
        case "latin1":
        case "binary":
          return Ar(this, t, n, f);
        case "base64":
          return Ur(this, t, n, f);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return Fr(this, t, n, f);
        default:
          if (g) throw new TypeError("Unknown encoding: " + x);
          x = ("" + x).toLowerCase(), g = !0;
      }
  }, o.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function Ir(a, t, n) {
    return t === 0 && n === a.length ? u.fromByteArray(a) : u.fromByteArray(a.slice(t, n));
  }
  function nr(a, t, n) {
    n = Math.min(a.length, n);
    for (var f = [], x = t; x < n; ) {
      var E = a[x], g = null, U = E > 239 ? 4 : E > 223 ? 3 : E > 191 ? 2 : 1;
      if (x + U <= n) {
        var R, I, P, i;
        switch (U) {
          case 1:
            E < 128 && (g = E);
            break;
          case 2:
            R = a[x + 1], (R & 192) === 128 && (i = (E & 31) << 6 | R & 63, i > 127 && (g = i));
            break;
          case 3:
            R = a[x + 1], I = a[x + 2], (R & 192) === 128 && (I & 192) === 128 && (i = (E & 15) << 12 | (R & 63) << 6 | I & 63, i > 2047 && (i < 55296 || i > 57343) && (g = i));
            break;
          case 4:
            R = a[x + 1], I = a[x + 2], P = a[x + 3], (R & 192) === 128 && (I & 192) === 128 && (P & 192) === 128 && (i = (E & 15) << 18 | (R & 63) << 12 | (I & 63) << 6 | P & 63, i > 65535 && i < 1114112 && (g = i));
        }
      }
      g === null ? (g = 65533, U = 1) : g > 65535 && (g -= 65536, f.push(g >>> 10 & 1023 | 55296), g = 56320 | g & 1023), f.push(g), x += U;
    }
    return Sr(f);
  }
  var ir = 4096;
  function Sr(a) {
    var t = a.length;
    if (t <= ir)
      return String.fromCharCode.apply(String, a);
    for (var n = "", f = 0; f < t; )
      n += String.fromCharCode.apply(
        String,
        a.slice(f, f += ir)
      );
    return n;
  }
  function Tr(a, t, n) {
    var f = "";
    n = Math.min(a.length, n);
    for (var x = t; x < n; ++x)
      f += String.fromCharCode(a[x] & 127);
    return f;
  }
  function Rr(a, t, n) {
    var f = "";
    n = Math.min(a.length, n);
    for (var x = t; x < n; ++x)
      f += String.fromCharCode(a[x]);
    return f;
  }
  function Cr(a, t, n) {
    var f = a.length;
    (!t || t < 0) && (t = 0), (!n || n < 0 || n > f) && (n = f);
    for (var x = "", E = t; E < n; ++E)
      x += Lr[a[E]];
    return x;
  }
  function _r(a, t, n) {
    for (var f = a.slice(t, n), x = "", E = 0; E < f.length - 1; E += 2)
      x += String.fromCharCode(f[E] + f[E + 1] * 256);
    return x;
  }
  o.prototype.slice = function(t, n) {
    var f = this.length;
    t = ~~t, n = n === void 0 ? f : ~~n, t < 0 ? (t += f, t < 0 && (t = 0)) : t > f && (t = f), n < 0 ? (n += f, n < 0 && (n = 0)) : n > f && (n = f), n < t && (n = t);
    var x = this.subarray(t, n);
    return Object.setPrototypeOf(x, o.prototype), x;
  };
  function A(a, t, n) {
    if (a % 1 !== 0 || a < 0) throw new RangeError("offset is not uint");
    if (a + t > n) throw new RangeError("Trying to access beyond buffer length");
  }
  o.prototype.readUintLE = o.prototype.readUIntLE = function(t, n, f) {
    t = t >>> 0, n = n >>> 0, f || A(t, n, this.length);
    for (var x = this[t], E = 1, g = 0; ++g < n && (E *= 256); )
      x += this[t + g] * E;
    return x;
  }, o.prototype.readUintBE = o.prototype.readUIntBE = function(t, n, f) {
    t = t >>> 0, n = n >>> 0, f || A(t, n, this.length);
    for (var x = this[t + --n], E = 1; n > 0 && (E *= 256); )
      x += this[t + --n] * E;
    return x;
  }, o.prototype.readUint8 = o.prototype.readUInt8 = function(t, n) {
    return t = t >>> 0, n || A(t, 1, this.length), this[t];
  }, o.prototype.readUint16LE = o.prototype.readUInt16LE = function(t, n) {
    return t = t >>> 0, n || A(t, 2, this.length), this[t] | this[t + 1] << 8;
  }, o.prototype.readUint16BE = o.prototype.readUInt16BE = function(t, n) {
    return t = t >>> 0, n || A(t, 2, this.length), this[t] << 8 | this[t + 1];
  }, o.prototype.readUint32LE = o.prototype.readUInt32LE = function(t, n) {
    return t = t >>> 0, n || A(t, 4, this.length), (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + this[t + 3] * 16777216;
  }, o.prototype.readUint32BE = o.prototype.readUInt32BE = function(t, n) {
    return t = t >>> 0, n || A(t, 4, this.length), this[t] * 16777216 + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]);
  }, o.prototype.readIntLE = function(t, n, f) {
    t = t >>> 0, n = n >>> 0, f || A(t, n, this.length);
    for (var x = this[t], E = 1, g = 0; ++g < n && (E *= 256); )
      x += this[t + g] * E;
    return E *= 128, x >= E && (x -= Math.pow(2, 8 * n)), x;
  }, o.prototype.readIntBE = function(t, n, f) {
    t = t >>> 0, n = n >>> 0, f || A(t, n, this.length);
    for (var x = n, E = 1, g = this[t + --x]; x > 0 && (E *= 256); )
      g += this[t + --x] * E;
    return E *= 128, g >= E && (g -= Math.pow(2, 8 * n)), g;
  }, o.prototype.readInt8 = function(t, n) {
    return t = t >>> 0, n || A(t, 1, this.length), this[t] & 128 ? (255 - this[t] + 1) * -1 : this[t];
  }, o.prototype.readInt16LE = function(t, n) {
    t = t >>> 0, n || A(t, 2, this.length);
    var f = this[t] | this[t + 1] << 8;
    return f & 32768 ? f | 4294901760 : f;
  }, o.prototype.readInt16BE = function(t, n) {
    t = t >>> 0, n || A(t, 2, this.length);
    var f = this[t + 1] | this[t] << 8;
    return f & 32768 ? f | 4294901760 : f;
  }, o.prototype.readInt32LE = function(t, n) {
    return t = t >>> 0, n || A(t, 4, this.length), this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24;
  }, o.prototype.readInt32BE = function(t, n) {
    return t = t >>> 0, n || A(t, 4, this.length), this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3];
  }, o.prototype.readFloatLE = function(t, n) {
    return t = t >>> 0, n || A(t, 4, this.length), c.read(this, t, !0, 23, 4);
  }, o.prototype.readFloatBE = function(t, n) {
    return t = t >>> 0, n || A(t, 4, this.length), c.read(this, t, !1, 23, 4);
  }, o.prototype.readDoubleLE = function(t, n) {
    return t = t >>> 0, n || A(t, 8, this.length), c.read(this, t, !0, 52, 8);
  }, o.prototype.readDoubleBE = function(t, n) {
    return t = t >>> 0, n || A(t, 8, this.length), c.read(this, t, !1, 52, 8);
  };
  function T(a, t, n, f, x, E) {
    if (!o.isBuffer(a)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (t > x || t < E) throw new RangeError('"value" argument is out of bounds');
    if (n + f > a.length) throw new RangeError("Index out of range");
  }
  o.prototype.writeUintLE = o.prototype.writeUIntLE = function(t, n, f, x) {
    if (t = +t, n = n >>> 0, f = f >>> 0, !x) {
      var E = Math.pow(2, 8 * f) - 1;
      T(this, t, n, f, E, 0);
    }
    var g = 1, U = 0;
    for (this[n] = t & 255; ++U < f && (g *= 256); )
      this[n + U] = t / g & 255;
    return n + f;
  }, o.prototype.writeUintBE = o.prototype.writeUIntBE = function(t, n, f, x) {
    if (t = +t, n = n >>> 0, f = f >>> 0, !x) {
      var E = Math.pow(2, 8 * f) - 1;
      T(this, t, n, f, E, 0);
    }
    var g = f - 1, U = 1;
    for (this[n + g] = t & 255; --g >= 0 && (U *= 256); )
      this[n + g] = t / U & 255;
    return n + f;
  }, o.prototype.writeUint8 = o.prototype.writeUInt8 = function(t, n, f) {
    return t = +t, n = n >>> 0, f || T(this, t, n, 1, 255, 0), this[n] = t & 255, n + 1;
  }, o.prototype.writeUint16LE = o.prototype.writeUInt16LE = function(t, n, f) {
    return t = +t, n = n >>> 0, f || T(this, t, n, 2, 65535, 0), this[n] = t & 255, this[n + 1] = t >>> 8, n + 2;
  }, o.prototype.writeUint16BE = o.prototype.writeUInt16BE = function(t, n, f) {
    return t = +t, n = n >>> 0, f || T(this, t, n, 2, 65535, 0), this[n] = t >>> 8, this[n + 1] = t & 255, n + 2;
  }, o.prototype.writeUint32LE = o.prototype.writeUInt32LE = function(t, n, f) {
    return t = +t, n = n >>> 0, f || T(this, t, n, 4, 4294967295, 0), this[n + 3] = t >>> 24, this[n + 2] = t >>> 16, this[n + 1] = t >>> 8, this[n] = t & 255, n + 4;
  }, o.prototype.writeUint32BE = o.prototype.writeUInt32BE = function(t, n, f) {
    return t = +t, n = n >>> 0, f || T(this, t, n, 4, 4294967295, 0), this[n] = t >>> 24, this[n + 1] = t >>> 16, this[n + 2] = t >>> 8, this[n + 3] = t & 255, n + 4;
  }, o.prototype.writeIntLE = function(t, n, f, x) {
    if (t = +t, n = n >>> 0, !x) {
      var E = Math.pow(2, 8 * f - 1);
      T(this, t, n, f, E - 1, -E);
    }
    var g = 0, U = 1, R = 0;
    for (this[n] = t & 255; ++g < f && (U *= 256); )
      t < 0 && R === 0 && this[n + g - 1] !== 0 && (R = 1), this[n + g] = (t / U >> 0) - R & 255;
    return n + f;
  }, o.prototype.writeIntBE = function(t, n, f, x) {
    if (t = +t, n = n >>> 0, !x) {
      var E = Math.pow(2, 8 * f - 1);
      T(this, t, n, f, E - 1, -E);
    }
    var g = f - 1, U = 1, R = 0;
    for (this[n + g] = t & 255; --g >= 0 && (U *= 256); )
      t < 0 && R === 0 && this[n + g + 1] !== 0 && (R = 1), this[n + g] = (t / U >> 0) - R & 255;
    return n + f;
  }, o.prototype.writeInt8 = function(t, n, f) {
    return t = +t, n = n >>> 0, f || T(this, t, n, 1, 127, -128), t < 0 && (t = 255 + t + 1), this[n] = t & 255, n + 1;
  }, o.prototype.writeInt16LE = function(t, n, f) {
    return t = +t, n = n >>> 0, f || T(this, t, n, 2, 32767, -32768), this[n] = t & 255, this[n + 1] = t >>> 8, n + 2;
  }, o.prototype.writeInt16BE = function(t, n, f) {
    return t = +t, n = n >>> 0, f || T(this, t, n, 2, 32767, -32768), this[n] = t >>> 8, this[n + 1] = t & 255, n + 2;
  }, o.prototype.writeInt32LE = function(t, n, f) {
    return t = +t, n = n >>> 0, f || T(this, t, n, 4, 2147483647, -2147483648), this[n] = t & 255, this[n + 1] = t >>> 8, this[n + 2] = t >>> 16, this[n + 3] = t >>> 24, n + 4;
  }, o.prototype.writeInt32BE = function(t, n, f) {
    return t = +t, n = n >>> 0, f || T(this, t, n, 4, 2147483647, -2147483648), t < 0 && (t = 4294967295 + t + 1), this[n] = t >>> 24, this[n + 1] = t >>> 16, this[n + 2] = t >>> 8, this[n + 3] = t & 255, n + 4;
  };
  function or(a, t, n, f, x, E) {
    if (n + f > a.length) throw new RangeError("Index out of range");
    if (n < 0) throw new RangeError("Index out of range");
  }
  function ur(a, t, n, f, x) {
    return t = +t, n = n >>> 0, x || or(a, t, n, 4), c.write(a, t, n, f, 23, 4), n + 4;
  }
  o.prototype.writeFloatLE = function(t, n, f) {
    return ur(this, t, n, !0, f);
  }, o.prototype.writeFloatBE = function(t, n, f) {
    return ur(this, t, n, !1, f);
  };
  function ar(a, t, n, f, x) {
    return t = +t, n = n >>> 0, x || or(a, t, n, 8), c.write(a, t, n, f, 52, 8), n + 8;
  }
  o.prototype.writeDoubleLE = function(t, n, f) {
    return ar(this, t, n, !0, f);
  }, o.prototype.writeDoubleBE = function(t, n, f) {
    return ar(this, t, n, !1, f);
  }, o.prototype.copy = function(t, n, f, x) {
    if (!o.isBuffer(t)) throw new TypeError("argument should be a Buffer");
    if (f || (f = 0), !x && x !== 0 && (x = this.length), n >= t.length && (n = t.length), n || (n = 0), x > 0 && x < f && (x = f), x === f || t.length === 0 || this.length === 0) return 0;
    if (n < 0)
      throw new RangeError("targetStart out of bounds");
    if (f < 0 || f >= this.length) throw new RangeError("Index out of range");
    if (x < 0) throw new RangeError("sourceEnd out of bounds");
    x > this.length && (x = this.length), t.length - n < x - f && (x = t.length - n + f);
    var E = x - f;
    return this === t && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(n, f, x) : Uint8Array.prototype.set.call(
      t,
      this.subarray(f, x),
      n
    ), E;
  }, o.prototype.fill = function(t, n, f, x) {
    if (typeof t == "string") {
      if (typeof n == "string" ? (x = n, n = 0, f = this.length) : typeof f == "string" && (x = f, f = this.length), x !== void 0 && typeof x != "string")
        throw new TypeError("encoding must be a string");
      if (typeof x == "string" && !o.isEncoding(x))
        throw new TypeError("Unknown encoding: " + x);
      if (t.length === 1) {
        var E = t.charCodeAt(0);
        (x === "utf8" && E < 128 || x === "latin1") && (t = E);
      }
    } else typeof t == "number" ? t = t & 255 : typeof t == "boolean" && (t = Number(t));
    if (n < 0 || this.length < n || this.length < f)
      throw new RangeError("Out of range index");
    if (f <= n)
      return this;
    n = n >>> 0, f = f === void 0 ? this.length : f >>> 0, t || (t = 0);
    var g;
    if (typeof t == "number")
      for (g = n; g < f; ++g)
        this[g] = t;
    else {
      var U = o.isBuffer(t) ? t : o.from(t, x), R = U.length;
      if (R === 0)
        throw new TypeError('The value "' + t + '" is invalid for argument "value"');
      for (g = 0; g < f - n; ++g)
        this[g + n] = U[g % R];
    }
    return this;
  };
  var lr = /[^+/0-9A-Za-z-_]/g;
  function xr(a) {
    if (a = a.split("=")[0], a = a.trim().replace(lr, ""), a.length < 2) return "";
    for (; a.length % 4 !== 0; )
      a = a + "=";
    return a;
  }
  function q(a, t) {
    t = t || 1 / 0;
    for (var n, f = a.length, x = null, E = [], g = 0; g < f; ++g) {
      if (n = a.charCodeAt(g), n > 55295 && n < 57344) {
        if (!x) {
          if (n > 56319) {
            (t -= 3) > -1 && E.push(239, 191, 189);
            continue;
          } else if (g + 1 === f) {
            (t -= 3) > -1 && E.push(239, 191, 189);
            continue;
          }
          x = n;
          continue;
        }
        if (n < 56320) {
          (t -= 3) > -1 && E.push(239, 191, 189), x = n;
          continue;
        }
        n = (x - 55296 << 10 | n - 56320) + 65536;
      } else x && (t -= 3) > -1 && E.push(239, 191, 189);
      if (x = null, n < 128) {
        if ((t -= 1) < 0) break;
        E.push(n);
      } else if (n < 2048) {
        if ((t -= 2) < 0) break;
        E.push(
          n >> 6 | 192,
          n & 63 | 128
        );
      } else if (n < 65536) {
        if ((t -= 3) < 0) break;
        E.push(
          n >> 12 | 224,
          n >> 6 & 63 | 128,
          n & 63 | 128
        );
      } else if (n < 1114112) {
        if ((t -= 4) < 0) break;
        E.push(
          n >> 18 | 240,
          n >> 12 & 63 | 128,
          n >> 6 & 63 | 128,
          n & 63 | 128
        );
      } else
        throw new Error("Invalid code point");
    }
    return E;
  }
  function sr(a) {
    for (var t = [], n = 0; n < a.length; ++n)
      t.push(a.charCodeAt(n) & 255);
    return t;
  }
  function yr(a, t) {
    for (var n, f, x, E = [], g = 0; g < a.length && !((t -= 2) < 0); ++g)
      n = a.charCodeAt(g), f = n >> 8, x = n % 256, E.push(x), E.push(f);
    return E;
  }
  function dr(a) {
    return u.toByteArray(xr(a));
  }
  function Z(a, t, n, f) {
    for (var x = 0; x < f && !(x + n >= t.length || x >= a.length); ++x)
      t[x + n] = a[x];
    return x;
  }
  function v(a, t) {
    return a instanceof t || a != null && a.constructor != null && a.constructor.name != null && a.constructor.name === t.name;
  }
  function X(a) {
    return a !== a;
  }
  var Lr = function() {
    for (var a = "0123456789abcdef", t = new Array(256), n = 0; n < 16; ++n)
      for (var f = n * 16, x = 0; x < 16; ++x)
        t[f + x] = a[n] + a[x];
    return t;
  }();
})(Y);
const Fe = Y.Buffer.from && Y.Buffer.alloc && Y.Buffer.allocUnsafe && Y.Buffer.allocUnsafeSlow ? Y.Buffer.from : (
  // support for Node < 5.10
  (h) => new Y.Buffer(h)
);
function Ie(h, u) {
  const c = (l, y) => u(l, y) >>> 0;
  return c.signed = u, c.unsigned = c, c.model = h, c;
}
let Pr = [
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
typeof Int32Array < "u" && (Pr = new Int32Array(Pr));
const Se = Ie("crc-32", function(h, u) {
  Y.Buffer.isBuffer(h) || (h = Fe(h));
  let c = u === 0 ? 0 : ~~u ^ -1;
  for (let l = 0; l < h.length; l++) {
    const y = h[l];
    c = Pr[(c ^ y) & 255] ^ c >>> 8;
  }
  return c ^ -1;
}), Te = new TextEncoder();
function Re(h = /* @__PURE__ */ new Date()) {
  const u = h.getFullYear() - 1980 << 9, c = h.getMonth() + 1 << 5, l = h.getDate(), y = u | c | l, B = h.getHours() << 11, m = h.getMinutes() << 5, o = Math.floor(h.getSeconds() / 2), b = B | m | o;
  return { date: y, time: b };
}
class Ce {
  constructor(u) {
    this.name = Te.encode(u.name), this.size = u.size, this.bytesRead = 0, this.crc = null, this.dateTime = Re();
  }
  get header() {
    const u = new ArrayBuffer(30 + this.name.byteLength), c = new DataView(u);
    c.setUint32(0, 67324752, !0), c.setUint16(4, 20, !0), c.setUint16(6, 2056, !0), c.setUint16(8, 0, !0), c.setUint16(10, this.dateTime.time, !0), c.setUint16(12, this.dateTime.date, !0), c.setUint32(14, 0, !0), c.setUint32(18, 0, !0), c.setUint32(22, 0, !0), c.setUint16(26, this.name.byteLength, !0), c.setUint16(28, 0, !0);
    for (let l = 0; l < this.name.byteLength; l++)
      c.setUint8(30 + l, this.name[l]);
    return new Uint8Array(u);
  }
  get dataDescriptor() {
    const u = new ArrayBuffer(16), c = new DataView(u);
    return c.setUint32(0, 134695760, !0), c.setUint32(4, this.crc, !0), c.setUint32(8, this.size, !0), c.setUint32(12, this.size, !0), new Uint8Array(u);
  }
  directoryRecord(u) {
    const c = new ArrayBuffer(46 + this.name.byteLength), l = new DataView(c);
    l.setUint32(0, 33639248, !0), l.setUint16(4, 20, !0), l.setUint16(6, 20, !0), l.setUint16(8, 2056, !0), l.setUint16(10, 0, !0), l.setUint16(12, this.dateTime.time, !0), l.setUint16(14, this.dateTime.date, !0), l.setUint32(16, this.crc, !0), l.setUint32(20, this.size, !0), l.setUint32(24, this.size, !0), l.setUint16(28, this.name.byteLength, !0), l.setUint16(30, 0, !0), l.setUint16(32, 0, !0), l.setUint16(34, 0, !0), l.setUint16(36, 0, !0), l.setUint32(38, 0, !0), l.setUint32(42, u, !0);
    for (let y = 0; y < this.name.byteLength; y++)
      l.setUint8(46 + y, this.name[y]);
    return new Uint8Array(c);
  }
  get byteLength() {
    return this.size + this.name.byteLength + 30 + 16;
  }
  append(u, c) {
    this.bytesRead += u.byteLength;
    const l = u.byteLength - Math.max(this.bytesRead - this.size, 0), y = u.slice(0, l);
    if (this.crc = Se(y, this.crc), c.enqueue(y), l < u.byteLength)
      return u.slice(l, u.byteLength);
  }
}
function _e(h, u) {
  let c = 0, l = 0;
  for (let y = 0; y < h.length; y++) {
    const B = h[y], m = B.directoryRecord(c);
    c += B.byteLength, u.enqueue(m), l += m.byteLength;
  }
  u.enqueue(Le(h.length, l, c));
}
function Le(h, u, c) {
  const l = new ArrayBuffer(22), y = new DataView(l);
  return y.setUint32(0, 101010256, !0), y.setUint16(4, 0, !0), y.setUint16(6, 0, !0), y.setUint16(8, h, !0), y.setUint16(10, h, !0), y.setUint32(12, u, !0), y.setUint32(16, c, !0), y.setUint16(20, 0, !0), new Uint8Array(l);
}
class ke {
  constructor(u, c) {
    this.files = u, this.fileIndex = 0, this.file = null, this.reader = c.getReader(), this.nextFile(), this.extra = null;
  }
  nextFile() {
    this.file = this.files[this.fileIndex++];
  }
  async pull(u) {
    if (!this.file)
      return _e(this.files, u), u.close();
    if (this.file.bytesRead === 0 && (u.enqueue(this.file.header), this.extra && (this.extra = this.file.append(this.extra, u))), this.file.bytesRead >= this.file.size)
      return u.enqueue(this.file.dataDescriptor), this.nextFile(), this.pull(u);
    const c = await this.reader.read();
    if (c.done)
      return this.nextFile(), this.pull(u);
    this.extra = this.file.append(c.value, u);
  }
}
class De {
  constructor(u, c) {
    this.files = u.files.map((l) => new Ce(l)), this.source = c;
  }
  get stream() {
    return new ReadableStream(new ke(this.files, this.source));
  }
  get size() {
    return this.files.reduce(
      (l, y) => l + y.byteLength * 2 - y.size,
      0
    ) + 22;
  }
}
var $r = { exports: {} };
const Me = {}, Ne = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Me
}, Symbol.toStringTag, { value: "Module" })), Pe = /* @__PURE__ */ ie(Ne);
var vr = { exports: {} };
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
(function(h, u) {
  var c = K, l = c.Buffer;
  function y(m, o) {
    for (var b in m)
      o[b] = m[b];
  }
  l.from && l.alloc && l.allocUnsafe && l.allocUnsafeSlow ? h.exports = c : (y(c, u), u.Buffer = B);
  function B(m, o, b) {
    return l(m, o, b);
  }
  B.prototype = Object.create(l.prototype), y(l, B), B.from = function(m, o, b) {
    if (typeof m == "number")
      throw new TypeError("Argument must not be a number");
    return l(m, o, b);
  }, B.alloc = function(m, o, b) {
    if (typeof m != "number")
      throw new TypeError("Argument must be a number");
    var D = l(m);
    return o !== void 0 ? typeof b == "string" ? D.fill(o, b) : D.fill(o) : D.fill(0), D;
  }, B.allocUnsafe = function(m) {
    if (typeof m != "number")
      throw new TypeError("Argument must be a number");
    return l(m);
  }, B.allocUnsafeSlow = function(m) {
    if (typeof m != "number")
      throw new TypeError("Argument must be a number");
    return c.SlowBuffer(m);
  };
})(vr, vr.exports);
var ve = vr.exports;
/*!
 * content-disposition
 * Copyright(c) 2014-2017 Douglas Christopher Wilson
 * MIT Licensed
 */
$r.exports = Ve;
$r.exports.parse = Qe;
var Hr = Pe.basename, $e = ve.Buffer, Ke = /[\x00-\x20"'()*,/:;<=>?@[\\\]{}\x7f]/g, Oe = /%[0-9A-Fa-f]{2}/, ze = /%([0-9A-Fa-f]{2})/g, jr = /[^\x20-\x7e\xa0-\xff]/g, He = /\\([\u0000-\u007f])/g, qe = /([\\"])/g, qr = /;[\x09\x20]*([!#$%&'*+.0-9A-Z^_`a-z|~-]+)[\x09\x20]*=[\x09\x20]*("(?:[\x20!\x23-\x5b\x5d-\x7e\x80-\xff]|\\[\x20-\x7e])*"|[!#$%&'*+.0-9A-Z^_`a-z|~-]+)[\x09\x20]*/g, Ge = /^[\x20-\x7e\x80-\xff]+$/, We = /^[!#$%&'*+.0-9A-Z^_`a-z|~-]+$/, Xe = /^([A-Za-z0-9!#$%&+\-^_`{}~]+)'(?:[A-Za-z]{2,3}(?:-[A-Za-z]{3}){0,3}|[A-Za-z]{4,8}|)'((?:%[0-9A-Fa-f]{2}|[A-Za-z0-9!#$&+.^_`|~-])+)$/, Ye = /^([!#$%&'*+.0-9A-Z^_`a-z|~-]+)[\x09\x20]*(?:$|;)/;
function Ve(h, u) {
  var c = u || {}, l = c.type || "attachment", y = Ze(h, c.fallback);
  return je(new Qr(l, y));
}
function Ze(h, u) {
  if (h !== void 0) {
    var c = {};
    if (typeof h != "string")
      throw new TypeError("filename must be a string");
    if (u === void 0 && (u = !0), typeof u != "string" && typeof u != "boolean")
      throw new TypeError("fallback must be a string or boolean");
    if (typeof u == "string" && jr.test(u))
      throw new TypeError("fallback must be ISO-8859-1 string");
    var l = Hr(h), y = Ge.test(l), B = typeof u != "string" ? u && Jr(l) : Hr(u), m = typeof B == "string" && B !== l;
    return (m || !y || Oe.test(l)) && (c["filename*"] = l), (y || m) && (c.filename = m ? B : l), c;
  }
}
function je(h) {
  var u = h.parameters, c = h.type;
  if (!c || typeof c != "string" || !We.test(c))
    throw new TypeError("invalid type");
  var l = String(c).toLowerCase();
  if (u && typeof u == "object")
    for (var y, B = Object.keys(u).sort(), m = 0; m < B.length; m++) {
      y = B[m];
      var o = y.substr(-1) === "*" ? nt(u[y]) : tt(u[y]);
      l += "; " + y + "=" + o;
    }
  return l;
}
function Je(h) {
  var u = Xe.exec(h);
  if (!u)
    throw new TypeError("invalid extended field value");
  var c = u[1].toLowerCase(), l = u[2], y, B = l.replace(ze, rt);
  switch (c) {
    case "iso-8859-1":
      y = Jr(B);
      break;
    case "utf-8":
      y = $e.from(B, "binary").toString("utf8");
      break;
    default:
      throw new TypeError("unsupported charset in extended field");
  }
  return y;
}
function Jr(h) {
  return String(h).replace(jr, "?");
}
function Qe(h) {
  if (!h || typeof h != "string")
    throw new TypeError("argument string is required");
  var u = Ye.exec(h);
  if (!u)
    throw new TypeError("invalid type format");
  var c = u[0].length, l = u[1].toLowerCase(), y, B = [], m = {}, o;
  for (c = qr.lastIndex = u[0].substr(-1) === ";" ? c - 1 : c; u = qr.exec(h); ) {
    if (u.index !== c)
      throw new TypeError("invalid parameter format");
    if (c += u[0].length, y = u[1].toLowerCase(), o = u[2], B.indexOf(y) !== -1)
      throw new TypeError("invalid duplicate parameter");
    if (B.push(y), y.indexOf("*") + 1 === y.length) {
      y = y.slice(0, -1), o = Je(o), m[y] = o;
      continue;
    }
    typeof m[y] != "string" && (o[0] === '"' && (o = o.substr(1, o.length - 2).replace(He, "$1")), m[y] = o);
  }
  if (c !== -1 && c !== h.length)
    throw new TypeError("invalid parameter format");
  return new Qr(l, m);
}
function rt(h, u) {
  return String.fromCharCode(parseInt(u, 16));
}
function et(h) {
  return "%" + String(h).charCodeAt(0).toString(16).toUpperCase();
}
function tt(h) {
  var u = String(h);
  return '"' + u.replace(qe, "\\$1") + '"';
}
function nt(h) {
  var u = String(h), c = encodeURIComponent(u).replace(Ke, et);
  return "UTF-8''" + c;
}
function Qr(h, u) {
  this.type = h, this.parameters = u;
}
var it = $r.exports;
const ot = /* @__PURE__ */ ne(it);
let re = !1;
const j = /* @__PURE__ */ new Map(), ut = /\.[A-Fa-f0-9]{8}\.(js|css|png|svg|jpg)(#\w+)?$/, at = /\/api\/download\/([A-Fa-f0-9]{4,})/, st = /\.woff2?$/;
self.addEventListener("install", () => {
  self.skipWaiting();
});
self.addEventListener("activate", (h) => {
  h.waitUntil(self.clients.claim());
});
async function ft(h) {
  const u = j.get(h);
  if (!u)
    return new Response(null, { status: 400 });
  try {
    let c = u.size, l = u.type;
    const y = new Ee(u.key, u.nonce);
    u.requiresPassword && y.setPassword(u.password, u.url), u.download = Ue(h, y);
    const B = await u.download.result, m = y.decryptStream(B);
    let o = null;
    if (u.type === "send-archive") {
      const S = new De(u.manifest, m);
      o = S.stream, l = "application/zip", c = S.size;
    }
    const b = pr(
      o || m,
      {
        transform(S, _) {
          u.progress += S.length, _.enqueue(S);
        }
      },
      function() {
        u.download.cancel(), j.delete(h);
      }
    ), D = {
      "Content-Disposition": ot(u.filename),
      "Content-Type": l,
      "Content-Length": c
    };
    return new Response(b, { headers: D });
  } catch (c) {
    return re ? new Response(null, { status: c.message }) : new Response(null, {
      status: 302,
      headers: {
        Location: `/download/${h}/#${u.key}`
      }
    });
  }
}
function ee(h) {
  return ut.test(h) || st.test(h);
}
async function ct(h) {
  const u = await caches.open(te), c = await u.match(h);
  if (c)
    return c;
  const l = await fetch(h);
  return l.ok && ee(h.url) && u.put(h, l.clone()), l;
}
self.onfetch = (h) => {
  const u = h.request;
  if (u.method !== "GET") return;
  const c = new URL(u.url), l = at.exec(c.pathname);
  l ? h.respondWith(ft(l[1])) : ee(c.pathname) && h.respondWith(ct(u));
};
self.onmessage = (h) => {
  if (h.data.request === "init") {
    re = h.data.noSave;
    const u = {
      key: h.data.key,
      nonce: h.data.nonce,
      filename: h.data.filename,
      requiresPassword: h.data.requiresPassword,
      password: h.data.password,
      url: h.data.url,
      type: h.data.type,
      manifest: h.data.manifest,
      size: h.data.size,
      progress: 0
    };
    j.set(h.data.id, u), h.ports[0].postMessage("file info received");
  } else if (h.data.request === "progress") {
    const u = j.get(h.data.id);
    u ? (u.progress === u.size && j.delete(h.data.id), h.ports[0].postMessage({ progress: u.progress })) : h.ports[0].postMessage({ error: "cancelled" });
  } else if (h.data.request === "cancel") {
    const u = j.get(h.data.id);
    u && (u.download && u.download.cancel(), j.delete(h.data.id)), h.ports[0].postMessage("download cancelled");
  }
};
//# sourceMappingURL=serviceWorker.js.map
