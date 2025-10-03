function gr(h) {
  return h && h.__esModule && Object.prototype.hasOwnProperty.call(h, "default") ? h.default : h;
}
function vr(h) {
  if (Object.prototype.hasOwnProperty.call(h, "__esModule")) return h;
  var o = h.default;
  if (typeof o == "function") {
    var c = function l() {
      var p = !1;
      try {
        p = this instanceof l;
      } catch {
      }
      return p ? Reflect.construct(o, arguments, this.constructor) : o.apply(this, arguments);
    };
    c.prototype = o.prototype;
  } else c = {};
  return Object.defineProperty(c, "__esModule", { value: !0 }), Object.keys(h).forEach(function(l) {
    var p = Object.getOwnPropertyDescriptor(h, l);
    Object.defineProperty(c, l, p.get ? p : {
      enumerable: !0,
      get: function() {
        return h[l];
      }
    });
  }), c;
}
const _r = {}, Lr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _r
}, Symbol.toStringTag, { value: "Module" })), rr = /* @__PURE__ */ vr(Lr);
var Ye, sr;
function Mr() {
  if (sr) return Ye;
  sr = 1;
  const h = rr, o = rr;
  function c(l) {
    return `"${l}": require('../assets/${l}')`;
  }
  return Ye = function() {
    const l = h.readdirSync(o.join(__dirname, "..", "assets"));
    return {
      code: `module.exports = {
    ${l.map(c).join(`,
`)}
  };`,
      dependencies: l.map((y) => require.resolve("../assets/" + y)),
      cacheable: !0
    };
  }, Ye;
}
const Dr = {
  "app.css": "app.CBwU1azp.css",
  "app.js": "app.B_trwQxc.js"
};
var Ze, fr;
function Nr() {
  if (fr) return Ze;
  fr = 1;
  const h = Mr(), o = typeof h == "function";
  let c = "", l = {};
  try {
    l = Dr;
  } catch {
  }
  const p = o ? l : h;
  function y(E) {
    return c + p[E];
  }
  function x(E) {
    c = E;
  }
  function a(E) {
    return Object.keys(p).filter((F) => E.test(F)).map(y);
  }
  const A = {
    setPrefix: x,
    get: y,
    match: a,
    setMiddleware: function(E) {
      function F() {
        return JSON.parse(
          E.fileSystem.readFileSync(
            E.getFilenameFromUrl("/manifest.json")
          )
        );
      }
      E && (A.get = function(v) {
        const S = F();
        return c + S[v];
      }, A.match = function(v) {
        const S = F();
        return Object.keys(S).filter((P) => v.test(P)).map((P) => c + S[P]);
      });
    }
  };
  return Ze = A, Ze;
}
var kr = Nr();
const Pr = /* @__PURE__ */ gr(kr), ar = "3.4.27";
var Or = $r, cr = {
  class: "className",
  for: "htmlFor",
  "http-equiv": "httpEquiv"
};
function $r(h) {
  return function(o, c, l) {
    for (var p in c)
      p in cr && (c[cr[p]] = c[p], delete c[p]);
    return h(o, c, l);
  };
}
var Gr = Or, Ae = 0, ce = 1, re = 2, Ke = 3, oe = 4, j = 5, Qe = 6, me = 7, Z = 8, Ie = 9, Se = 10, Me = 11, ge = 12, Fe = 13, qr = function(h, o) {
  o || (o = {});
  var c = o.concat || function(p, y) {
    return String(p) + String(y);
  };
  return o.attrToProp !== !1 && (h = Gr(h)), function(p) {
    for (var y = ce, x = "", a = arguments.length, A = [], E = 0; E < p.length; E++)
      if (E < a - 1) {
        var F = arguments[E + 1], U = ae(p[E]), v = y;
        v === Se && (v = Z), v === Ie && (v = Z), v === me && (v = Z), v === oe && (v = j), v === re ? x === "/" ? (U.push([re, "/", F]), x = "") : U.push([re, F]) : v === Fe && o.comments ? x += String(F) : v !== Fe && U.push([Ae, v, F]), A.push.apply(A, U);
      } else A.push.apply(A, ae(p[E]));
    for (var S = [null, {}, []], P = [[S, -1]], E = 0; E < A.length; E++) {
      var T = P[P.length - 1][0], U = A[E], X = U[0];
      if (X === re && /^\//.test(U[1])) {
        var te = P[P.length - 1][1];
        P.length > 1 && (P.pop(), P[P.length - 1][0][2][te] = h(
          T[0],
          T[1],
          T[2].length ? T[2] : void 0
        ));
      } else if (X === re) {
        var de = [U[1], {}, []];
        T[2].push(de), P.push([de, T[2].length - 1]);
      } else if (X === j || X === Ae && U[1] === j) {
        for (var K = "", ie; E < A.length; E++)
          if (A[E][0] === j)
            K = c(K, A[E][1]);
          else if (A[E][0] === Ae && A[E][1] === j)
            if (typeof A[E][2] == "object" && !K)
              for (ie in A[E][2])
                A[E][2].hasOwnProperty(ie) && !T[1][ie] && (T[1][ie] = A[E][2][ie]);
            else
              K = c(K, A[E][2]);
          else break;
        A[E][0] === Me && E++;
        for (var W = E; E < A.length; E++)
          if (A[E][0] === Z || A[E][0] === j)
            T[1][K] ? A[E][1] === "" || (T[1][K] = c(T[1][K], A[E][1])) : T[1][K] = l(A[E][1]);
          else if (A[E][0] === Ae && (A[E][1] === Z || A[E][1] === j))
            T[1][K] ? A[E][2] === "" || (T[1][K] = c(T[1][K], A[E][2])) : T[1][K] = l(A[E][2]);
          else {
            K.length && !T[1][K] && E === W && (A[E][0] === Ke || A[E][0] === ge) && (T[1][K] = K.toLowerCase()), A[E][0] === Ke && E--;
            break;
          }
      } else if (X === j)
        T[1][U[1]] = !0;
      else if (X === Ae && U[1] === j)
        T[1][U[2]] = !0;
      else if (X === Ke) {
        if (Hr(T[0]) && P.length) {
          var te = P[P.length - 1][1];
          P.pop(), P[P.length - 1][0][2][te] = h(
            T[0],
            T[1],
            T[2].length ? T[2] : void 0
          );
        }
      } else if (X === Ae && U[1] === ce)
        U[2] === void 0 || U[2] === null ? U[2] = "" : U[2] || (U[2] = c("", U[2])), Array.isArray(U[2][0]) ? T[2].push.apply(T[2], U[2]) : T[2].push(U[2]);
      else if (X === ce)
        T[2].push(U[1]);
      else if (!(X === Me || X === ge)) throw new Error("unhandled: " + X);
    }
    if (S[2].length > 1 && /^\s*$/.test(S[2][0]) && S[2].shift(), S[2].length > 2 || S[2].length === 2 && /\S/.test(S[2][1])) {
      if (o.createFragment) return o.createFragment(S[2]);
      throw new Error(
        "multiple root elements must be wrapped in an enclosing tag"
      );
    }
    return Array.isArray(S[2][0]) && typeof S[2][0][0] == "string" && Array.isArray(S[2][0][2]) && (S[2][0] = h(S[2][0][0], S[2][0][1], S[2][0][2])), S[2][0];
    function ae(ue) {
      var O = [];
      y === me && (y = oe);
      for (var se = 0; se < ue.length; se++) {
        var D = ue.charAt(se);
        y === ce && D === "<" ? (x.length && O.push([ce, x]), x = "", y = re) : D === ">" && !Kr(y) && y !== Fe ? (y === re && x.length ? O.push([re, x]) : y === j ? O.push([j, x]) : y === Z && x.length && O.push([Z, x]), O.push([Ke]), x = "", y = ce) : y === Fe && /-$/.test(x) && D === "-" ? (o.comments && O.push([Z, x.substr(0, x.length - 1)]), x = "", y = ce) : y === re && /^!--$/.test(x) ? (o.comments && O.push([re, x], [j, "comment"], [Me]), x = D, y = Fe) : y === ce || y === Fe ? x += D : y === re && D === "/" && x.length || (y === re && /\s/.test(D) ? (x.length && O.push([re, x]), x = "", y = oe) : y === re ? x += D : y === oe && /[^\s"'=/]/.test(D) ? (y = j, x = D) : y === oe && /\s/.test(D) ? (x.length && O.push([j, x]), O.push([ge])) : y === j && /\s/.test(D) ? (O.push([j, x]), x = "", y = Qe) : y === j && D === "=" ? (O.push([j, x], [Me]), x = "", y = me) : y === j ? x += D : (y === Qe || y === oe) && D === "=" ? (O.push([Me]), y = me) : (y === Qe || y === oe) && !/\s/.test(D) ? (O.push([ge]), /[\w-]/.test(D) ? (x += D, y = j) : y = oe) : y === me && D === '"' ? y = Se : y === me && D === "'" ? y = Ie : y === Se && D === '"' ? (O.push([Z, x], [ge]), x = "", y = oe) : y === Ie && D === "'" ? (O.push([Z, x], [ge]), x = "", y = oe) : y === me && !/\s/.test(D) ? (y = Z, se--) : y === Z && /\s/.test(D) ? (O.push([Z, x], [ge]), x = "", y = oe) : (y === Z || y === Ie || y === Se) && (x += D));
      }
      return y === ce && x.length ? (O.push([ce, x]), x = "") : y === Z && x.length ? (O.push([Z, x]), x = "") : y === Se && x.length ? (O.push([Z, x]), x = "") : y === Ie && x.length ? (O.push([Z, x]), x = "") : y === j && (O.push([j, x]), x = ""), O;
    }
  };
  function l(p) {
    return typeof p == "function" || typeof p == "string" || p && typeof p == "object" || p == null ? p : c("", p);
  }
};
function Kr(h) {
  return h === Ie || h === Se;
}
var zr = RegExp("^(" + [
  "area",
  "base",
  "basefont",
  "bgsound",
  "br",
  "col",
  "command",
  "embed",
  "frame",
  "hr",
  "img",
  "input",
  "isindex",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
  "!--",
  // SVG TAGS
  "animate",
  "animateTransform",
  "circle",
  "cursor",
  "desc",
  "ellipse",
  "feBlend",
  "feColorMatrix",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "font-face-format",
  "font-face-name",
  "font-face-uri",
  "glyph",
  "glyphRef",
  "hkern",
  "image",
  "line",
  "missing-glyph",
  "mpath",
  "path",
  "polygon",
  "polyline",
  "rect",
  "set",
  "stop",
  "tref",
  "use",
  "view",
  "vkern"
].join("|") + ")(?:[.#][a-zA-Z0-9-￿_:-]+)*$");
function Hr(h) {
  return zr.test(h);
}
var ze = /\n[\s]+$/, He = /^\n[\s]+/, hr = /[\s]+$/, lr = /^[\s]+/, Ve = /[\n\s]+/g, pr = [
  "a",
  "abbr",
  "b",
  "bdi",
  "bdo",
  "br",
  "cite",
  "data",
  "dfn",
  "em",
  "i",
  "kbd",
  "mark",
  "q",
  "rp",
  "rt",
  "rtc",
  "ruby",
  "s",
  "amp",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "time",
  "u",
  "var",
  "wbr"
], je = [
  "code",
  "pre",
  "textarea"
], Vr = function h(o, c) {
  if (Array.isArray(c))
    for (var l = o.nodeName.toLowerCase(), p = !1, y, x, a = 0, A = c.length; a < A; a++) {
      var E = c[a];
      if (Array.isArray(E)) {
        h(o, E);
        continue;
      }
      (typeof E == "number" || typeof E == "boolean" || typeof E == "function" || E instanceof Date || E instanceof RegExp) && (E = E.toString());
      var F = o.childNodes[o.childNodes.length - 1];
      if (typeof E == "string")
        p = !0, F && F.nodeName === "#text" ? F.nodeValue += E : (E = o.ownerDocument.createTextNode(E), o.appendChild(E), F = E), a === A - 1 && (p = !1, pr.indexOf(l) === -1 && je.indexOf(l) === -1 ? (y = F.nodeValue.replace(He, "").replace(hr, "").replace(ze, "").replace(Ve, " "), y === "" ? o.removeChild(F) : F.nodeValue = y) : je.indexOf(l) === -1 && (x = a === 0 ? "" : " ", y = F.nodeValue.replace(He, x).replace(lr, " ").replace(hr, "").replace(ze, "").replace(Ve, " "), F.nodeValue = y));
      else if (E && E.nodeType) {
        p && (p = !1, pr.indexOf(l) === -1 && je.indexOf(l) === -1 ? (y = F.nodeValue.replace(He, "").replace(ze, " ").replace(Ve, " "), y === "" ? o.removeChild(F) : F.nodeValue = y) : je.indexOf(l) === -1 && (y = F.nodeValue.replace(lr, " ").replace(He, "").replace(ze, " ").replace(Ve, " "), F.nodeValue = y));
        var U = E.nodeName;
        U && (l = U.toLowerCase()), o.appendChild(E);
      }
    }
}, jr = [
  "svg",
  "altGlyph",
  "altGlyphDef",
  "altGlyphItem",
  "animate",
  "animateColor",
  "animateMotion",
  "animateTransform",
  "circle",
  "clipPath",
  "color-profile",
  "cursor",
  "defs",
  "desc",
  "ellipse",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "filter",
  "font",
  "font-face",
  "font-face-format",
  "font-face-name",
  "font-face-src",
  "font-face-uri",
  "foreignObject",
  "g",
  "glyph",
  "glyphRef",
  "hkern",
  "image",
  "line",
  "linearGradient",
  "marker",
  "mask",
  "metadata",
  "missing-glyph",
  "mpath",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "set",
  "stop",
  "switch",
  "symbol",
  "text",
  "textPath",
  "title",
  "tref",
  "tspan",
  "use",
  "view",
  "vkern"
], Wr = [
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defaultchecked",
  "defer",
  "disabled",
  "formnovalidate",
  "hidden",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected"
], Xr = [
  "indeterminate"
], Yr = qr, Zr = Vr, Qr = jr, Jr = Wr, et = Xr, rt = "http://www.w3.org/2000/svg", tt = "http://www.w3.org/1999/xlink", nt = "!--", it = function(h) {
  function o(p, y, x) {
    var a;
    Qr.indexOf(p) !== -1 && (y.namespace = rt);
    var A = !1;
    y.namespace && (A = y.namespace, delete y.namespace);
    var E = !1;
    if (y.is && (E = y.is, delete y.is), A)
      E ? a = h.createElementNS(A, p, { is: E }) : a = h.createElementNS(A, p);
    else {
      if (p === nt)
        return h.createComment(y.comment);
      E ? a = h.createElement(p, { is: E }) : a = h.createElement(p);
    }
    for (var F in y)
      if (y.hasOwnProperty(F)) {
        var U = F.toLowerCase(), v = y[F];
        if (U === "classname" && (U = "class", F = "class"), F === "htmlFor" && (F = "for"), Jr.indexOf(U) !== -1) {
          if (String(v) === "true") v = U;
          else if (String(v) === "false") continue;
        }
        U.slice(0, 2) === "on" || et.indexOf(U) !== -1 ? a[F] = v : A ? F === "xlink:href" ? a.setAttributeNS(tt, F, v) : /^xmlns($|:)/i.test(F) || a.setAttributeNS(null, F, v) : a.setAttribute(F, v);
      }
    return Zr(a, x), a;
  }
  function c(p) {
    for (var y = h.createDocumentFragment(), x = 0; x < p.length; x++)
      p[x] != null && (Array.isArray(p[x]) ? y.appendChild(c(p[x])) : (typeof p[x] == "string" && (p[x] = h.createTextNode(p[x])), y.appendChild(p[x])));
    return y;
  }
  var l = Yr(o, {
    comments: !0,
    createFragment: c
  });
  return l.default = l, l.createComment = o, l;
}, ot = it(document), at = ot, Te = {};
Te.byteLength = ft;
Te.toByteArray = ht;
Te.fromByteArray = dt;
var he = [], ne = [], ut = typeof Uint8Array < "u" ? Uint8Array : Array, Je = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Ue = 0, st = Je.length; Ue < st; ++Ue)
  he[Ue] = Je[Ue], ne[Je.charCodeAt(Ue)] = Ue;
ne[45] = 62;
ne[95] = 63;
function Er(h) {
  var o = h.length;
  if (o % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var c = h.indexOf("=");
  c === -1 && (c = o);
  var l = c === o ? 0 : 4 - c % 4;
  return [c, l];
}
function ft(h) {
  var o = Er(h), c = o[0], l = o[1];
  return (c + l) * 3 / 4 - l;
}
function ct(h, o, c) {
  return (o + c) * 3 / 4 - c;
}
function ht(h) {
  var o, c = Er(h), l = c[0], p = c[1], y = new ut(ct(h, l, p)), x = 0, a = p > 0 ? l - 4 : l, A;
  for (A = 0; A < a; A += 4)
    o = ne[h.charCodeAt(A)] << 18 | ne[h.charCodeAt(A + 1)] << 12 | ne[h.charCodeAt(A + 2)] << 6 | ne[h.charCodeAt(A + 3)], y[x++] = o >> 16 & 255, y[x++] = o >> 8 & 255, y[x++] = o & 255;
  return p === 2 && (o = ne[h.charCodeAt(A)] << 2 | ne[h.charCodeAt(A + 1)] >> 4, y[x++] = o & 255), p === 1 && (o = ne[h.charCodeAt(A)] << 10 | ne[h.charCodeAt(A + 1)] << 4 | ne[h.charCodeAt(A + 2)] >> 2, y[x++] = o >> 8 & 255, y[x++] = o & 255), y;
}
function lt(h) {
  return he[h >> 18 & 63] + he[h >> 12 & 63] + he[h >> 6 & 63] + he[h & 63];
}
function pt(h, o, c) {
  for (var l, p = [], y = o; y < c; y += 3)
    l = (h[y] << 16 & 16711680) + (h[y + 1] << 8 & 65280) + (h[y + 2] & 255), p.push(lt(l));
  return p.join("");
}
function dt(h) {
  for (var o, c = h.length, l = c % 3, p = [], y = 16383, x = 0, a = c - l; x < a; x += y)
    p.push(pt(h, x, x + y > a ? a : x + y));
  return l === 1 ? (o = h[c - 1], p.push(
    he[o >> 2] + he[o << 4 & 63] + "=="
  )) : l === 2 && (o = (h[c - 2] << 8) + h[c - 1], p.push(
    he[o >> 10] + he[o >> 4 & 63] + he[o << 2 & 63] + "="
  )), p.join("");
}
var er, dr;
function yt() {
  if (dr) return er;
  dr = 1;
  let h;
  try {
    h = at;
  } catch {
  }
  const o = Te;
  function c(I) {
    return o.fromByteArray(I).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }
  function l(I) {
    return o.toByteArray(I + "===".slice((I.length + 3) % 4));
  }
  function p() {
    return document.querySelector("html").lang;
  }
  function y(I) {
    return new Promise((C, N) => {
      const M = document.createElement("script");
      M.src = I, M.addEventListener("load", () => C(!0)), M.addEventListener("error", () => C(!1)), document.head.appendChild(M);
    });
  }
  function x(I) {
    return /^[0-9a-fA-F]{10,16}$/.test(I);
  }
  function a(I) {
    const C = document.createElement("input");
    if (C.setAttribute("value", I), C.contentEditable = !0, C.readOnly = !0, document.body.appendChild(C), navigator.userAgent.match(/iphone|ipad|ipod/i)) {
      const M = document.createRange();
      M.selectNodeContents(C);
      const ee = getSelection();
      ee.removeAllRanges(), ee.addRange(M), C.setSelectionRange(0, I.length);
    } else
      C.select();
    const N = document.execCommand("copy");
    return document.body.removeChild(C), N;
  }
  const A = !!(typeof Intl == "object" && Intl && typeof Intl.NumberFormat == "function" && typeof navigator == "object"), E = ["bytes", "kb", "mb", "gb"];
  function F(I) {
    if (I < 1)
      return "0B";
    const C = Math.min(Math.floor(Math.log10(I) / 3), E.length - 1), N = Number(I / Math.pow(1024, C)), M = Math.floor(N) === N ? 0 : 1;
    let ee = N.toFixed(M);
    if (A)
      try {
        ee = N.toLocaleString(p(), {
          minimumFractionDigits: M,
          maximumFractionDigits: M
        });
      } catch {
      }
    return D("fileSize", {
      num: ee,
      units: D(E[C])
    });
  }
  function U(I) {
    if (A)
      try {
        return I.toLocaleString(p(), { style: "percent" });
      } catch {
      }
    return `${Math.floor(I * 100)}%`;
  }
  function v(I) {
    return A ? I.toLocaleString(p()) : I.toString();
  }
  function S() {
    return !!document.queryCommandSupported ? document.queryCommandSupported("copy") : !1;
  }
  function P(I = 100) {
    return new Promise((C) => setTimeout(C, I));
  }
  function T(I) {
    const C = document.querySelector(I).classList;
    return C.remove("effect--fadeIn"), C.add("effect--fadeOut"), P(300);
  }
  function X(I, C = !0) {
    return I = I || Array.from(document.querySelectorAll("a:not([target])")), C ? I.forEach((N) => {
      N.setAttribute("target", "_blank"), N.setAttribute("rel", "noopener noreferrer");
    }) : I.forEach((N) => {
      N.removeAttribute("target"), N.removeAttribute("rel");
    }), I;
  }
  function te() {
    try {
      return /firefox/i.test(navigator.userAgent) ? "firefox" : /edge/i.test(navigator.userAgent) ? "edge" : /edg/i.test(navigator.userAgent) ? "edgium" : /trident/i.test(navigator.userAgent) ? "ie" : /chrome/i.test(navigator.userAgent) ? "chrome" : /safari/i.test(navigator.userAgent) ? "safari" : /send android/i.test(navigator.userAgent) ? "android-app" : "other";
    } catch {
      return "unknown";
    }
  }
  async function de(I, C) {
    const N = I.getReader();
    let M = await N.read();
    if (C) {
      const le = new Uint8Array(C);
      let R = 0;
      for (; !M.done; )
        le.set(M.value, R), R += M.value.length, M = await N.read();
      return le.buffer;
    }
    const ee = [];
    let xe = 0;
    for (; !M.done; )
      ee.push(M.value), xe += M.value.length, M = await N.read();
    let be = 0;
    const Be = new Uint8Array(xe);
    for (const le of ee)
      Be.set(le, be), be += le.length;
    return Be.buffer;
  }
  function K(I, C = "", N = "") {
    const M = I.map(
      (ee) => h`
        <li class="${N}">${ee}</li>
      `
    );
    return h`
    <ul class="${C}">
      ${M}
    </ul>
  `;
  }
  function ie(I) {
    return I < 3600 ? { id: "timespanMinutes", num: Math.floor(I / 60) } : I < 86400 ? { id: "timespanHours", num: Math.floor(I / 3600) } : { id: "timespanDays", num: Math.floor(I / 86400) };
  }
  function W(I) {
    if (I < 1)
      return { id: "linkExpiredAlt" };
    const C = Math.floor(I / 1e3 / 60), N = Math.floor(C / 60), M = Math.floor(N / 24);
    return M >= 1 ? {
      id: "expiresDaysHoursMinutes",
      days: M,
      hours: N % 24,
      minutes: C % 60
    } : N >= 1 ? {
      id: "expiresHoursMinutes",
      hours: N,
      minutes: C % 60
    } : N === 0 ? C === 0 ? { id: "expiresMinutes", minutes: "< 1" } : { id: "expiresMinutes", minutes: C } : null;
  }
  function ae() {
    return typeof Android == "object" ? "android" : "web";
  }
  const ue = 1024 * 64, O = 16;
  function se(I, C = ue, N = O) {
    const M = N + 1;
    return 21 + I + M * Math.ceil(I / (C - M));
  }
  let D = function() {
    throw new Error("uninitialized translate function. call setTranslate first");
  };
  function Re(I) {
    D = I;
  }
  return er = {
    locale: p,
    fadeOut: T,
    delay: P,
    allowedCopy: S,
    bytes: F,
    percent: U,
    number: v,
    copyToClipboard: a,
    arrayToB64: c,
    b64ToArray: l,
    loadShim: y,
    isFile: x,
    openLinksInNewTab: X,
    browserName: te,
    streamToArrayBuffer: de,
    list: K,
    secondsToL10nId: ie,
    timeLeft: W,
    platform: ae,
    encryptedSize: se,
    setTranslate: Re
  }, er;
}
var De = yt(), J = {}, We = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
We.read = function(h, o, c, l, p) {
  var y, x, a = p * 8 - l - 1, A = (1 << a) - 1, E = A >> 1, F = -7, U = c ? p - 1 : 0, v = c ? -1 : 1, S = h[o + U];
  for (U += v, y = S & (1 << -F) - 1, S >>= -F, F += a; F > 0; y = y * 256 + h[o + U], U += v, F -= 8)
    ;
  for (x = y & (1 << -F) - 1, y >>= -F, F += l; F > 0; x = x * 256 + h[o + U], U += v, F -= 8)
    ;
  if (y === 0)
    y = 1 - E;
  else {
    if (y === A)
      return x ? NaN : (S ? -1 : 1) * (1 / 0);
    x = x + Math.pow(2, l), y = y - E;
  }
  return (S ? -1 : 1) * x * Math.pow(2, y - l);
};
We.write = function(h, o, c, l, p, y) {
  var x, a, A, E = y * 8 - p - 1, F = (1 << E) - 1, U = F >> 1, v = p === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, S = l ? 0 : y - 1, P = l ? 1 : -1, T = o < 0 || o === 0 && 1 / o < 0 ? 1 : 0;
  for (o = Math.abs(o), isNaN(o) || o === 1 / 0 ? (a = isNaN(o) ? 1 : 0, x = F) : (x = Math.floor(Math.log(o) / Math.LN2), o * (A = Math.pow(2, -x)) < 1 && (x--, A *= 2), x + U >= 1 ? o += v / A : o += v * Math.pow(2, 1 - U), o * A >= 2 && (x++, A /= 2), x + U >= F ? (a = 0, x = F) : x + U >= 1 ? (a = (o * A - 1) * Math.pow(2, p), x = x + U) : (a = o * Math.pow(2, U - 1) * Math.pow(2, p), x = 0)); p >= 8; h[c + S] = a & 255, S += P, a /= 256, p -= 8)
    ;
  for (x = x << p | a, E += p; E > 0; h[c + S] = x & 255, S += P, x /= 256, E -= 8)
    ;
  h[c + S - P] |= T * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(h) {
  const o = Te, c = We, l = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  h.Buffer = a, h.SlowBuffer = de, h.INSPECT_MAX_BYTES = 50;
  const p = 2147483647;
  h.kMaxLength = p, a.TYPED_ARRAY_SUPPORT = y(), !a.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function y() {
    try {
      const i = new Uint8Array(1), e = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(e, Uint8Array.prototype), Object.setPrototypeOf(i, e), i.foo() === 42;
    } catch {
      return !1;
    }
  }
  Object.defineProperty(a.prototype, "parent", {
    enumerable: !0,
    get: function() {
      if (a.isBuffer(this))
        return this.buffer;
    }
  }), Object.defineProperty(a.prototype, "offset", {
    enumerable: !0,
    get: function() {
      if (a.isBuffer(this))
        return this.byteOffset;
    }
  });
  function x(i) {
    if (i > p)
      throw new RangeError('The value "' + i + '" is invalid for option "size"');
    const e = new Uint8Array(i);
    return Object.setPrototypeOf(e, a.prototype), e;
  }
  function a(i, e, r) {
    if (typeof i == "number") {
      if (typeof e == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return U(i);
    }
    return A(i, e, r);
  }
  a.poolSize = 8192;
  function A(i, e, r) {
    if (typeof i == "string")
      return v(i, e);
    if (ArrayBuffer.isView(i))
      return P(i);
    if (i == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof i
      );
    if (B(i, ArrayBuffer) || i && B(i.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (B(i, SharedArrayBuffer) || i && B(i.buffer, SharedArrayBuffer)))
      return T(i, e, r);
    if (typeof i == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    const s = i.valueOf && i.valueOf();
    if (s != null && s !== i)
      return a.from(s, e, r);
    const d = X(i);
    if (d) return d;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof i[Symbol.toPrimitive] == "function")
      return a.from(i[Symbol.toPrimitive]("string"), e, r);
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof i
    );
  }
  a.from = function(i, e, r) {
    return A(i, e, r);
  }, Object.setPrototypeOf(a.prototype, Uint8Array.prototype), Object.setPrototypeOf(a, Uint8Array);
  function E(i) {
    if (typeof i != "number")
      throw new TypeError('"size" argument must be of type number');
    if (i < 0)
      throw new RangeError('The value "' + i + '" is invalid for option "size"');
  }
  function F(i, e, r) {
    return E(i), i <= 0 ? x(i) : e !== void 0 ? typeof r == "string" ? x(i).fill(e, r) : x(i).fill(e) : x(i);
  }
  a.alloc = function(i, e, r) {
    return F(i, e, r);
  };
  function U(i) {
    return E(i), x(i < 0 ? 0 : te(i) | 0);
  }
  a.allocUnsafe = function(i) {
    return U(i);
  }, a.allocUnsafeSlow = function(i) {
    return U(i);
  };
  function v(i, e) {
    if ((typeof e != "string" || e === "") && (e = "utf8"), !a.isEncoding(e))
      throw new TypeError("Unknown encoding: " + e);
    const r = K(i, e) | 0;
    let s = x(r);
    const d = s.write(i, e);
    return d !== r && (s = s.slice(0, d)), s;
  }
  function S(i) {
    const e = i.length < 0 ? 0 : te(i.length) | 0, r = x(e);
    for (let s = 0; s < e; s += 1)
      r[s] = i[s] & 255;
    return r;
  }
  function P(i) {
    if (B(i, Uint8Array)) {
      const e = new Uint8Array(i);
      return T(e.buffer, e.byteOffset, e.byteLength);
    }
    return S(i);
  }
  function T(i, e, r) {
    if (e < 0 || i.byteLength < e)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (i.byteLength < e + (r || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    let s;
    return e === void 0 && r === void 0 ? s = new Uint8Array(i) : r === void 0 ? s = new Uint8Array(i, e) : s = new Uint8Array(i, e, r), Object.setPrototypeOf(s, a.prototype), s;
  }
  function X(i) {
    if (a.isBuffer(i)) {
      const e = te(i.length) | 0, r = x(e);
      return r.length === 0 || i.copy(r, 0, 0, e), r;
    }
    if (i.length !== void 0)
      return typeof i.length != "number" || _(i.length) ? x(0) : S(i);
    if (i.type === "Buffer" && Array.isArray(i.data))
      return S(i.data);
  }
  function te(i) {
    if (i >= p)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + p.toString(16) + " bytes");
    return i | 0;
  }
  function de(i) {
    return +i != i && (i = 0), a.alloc(+i);
  }
  a.isBuffer = function(e) {
    return e != null && e._isBuffer === !0 && e !== a.prototype;
  }, a.compare = function(e, r) {
    if (B(e, Uint8Array) && (e = a.from(e, e.offset, e.byteLength)), B(r, Uint8Array) && (r = a.from(r, r.offset, r.byteLength)), !a.isBuffer(e) || !a.isBuffer(r))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (e === r) return 0;
    let s = e.length, d = r.length;
    for (let m = 0, g = Math.min(s, d); m < g; ++m)
      if (e[m] !== r[m]) {
        s = e[m], d = r[m];
        break;
      }
    return s < d ? -1 : d < s ? 1 : 0;
  }, a.isEncoding = function(e) {
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
  }, a.concat = function(e, r) {
    if (!Array.isArray(e))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (e.length === 0)
      return a.alloc(0);
    let s;
    if (r === void 0)
      for (r = 0, s = 0; s < e.length; ++s)
        r += e[s].length;
    const d = a.allocUnsafe(r);
    let m = 0;
    for (s = 0; s < e.length; ++s) {
      let g = e[s];
      if (B(g, Uint8Array))
        m + g.length > d.length ? (a.isBuffer(g) || (g = a.from(g)), g.copy(d, m)) : Uint8Array.prototype.set.call(
          d,
          g,
          m
        );
      else if (a.isBuffer(g))
        g.copy(d, m);
      else
        throw new TypeError('"list" argument must be an Array of Buffers');
      m += g.length;
    }
    return d;
  };
  function K(i, e) {
    if (a.isBuffer(i))
      return i.length;
    if (ArrayBuffer.isView(i) || B(i, ArrayBuffer))
      return i.byteLength;
    if (typeof i != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof i
      );
    const r = i.length, s = arguments.length > 2 && arguments[2] === !0;
    if (!s && r === 0) return 0;
    let d = !1;
    for (; ; )
      switch (e) {
        case "ascii":
        case "latin1":
        case "binary":
          return r;
        case "utf8":
        case "utf-8":
          return t(i).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return r * 2;
        case "hex":
          return r >>> 1;
        case "base64":
          return w(i).length;
        default:
          if (d)
            return s ? -1 : t(i).length;
          e = ("" + e).toLowerCase(), d = !0;
      }
  }
  a.byteLength = K;
  function ie(i, e, r) {
    let s = !1;
    if ((e === void 0 || e < 0) && (e = 0), e > this.length || ((r === void 0 || r > this.length) && (r = this.length), r <= 0) || (r >>>= 0, e >>>= 0, r <= e))
      return "";
    for (i || (i = "utf8"); ; )
      switch (i) {
        case "hex":
          return Be(this, e, r);
        case "utf8":
        case "utf-8":
          return N(this, e, r);
        case "ascii":
          return xe(this, e, r);
        case "latin1":
        case "binary":
          return be(this, e, r);
        case "base64":
          return C(this, e, r);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return le(this, e, r);
        default:
          if (s) throw new TypeError("Unknown encoding: " + i);
          i = (i + "").toLowerCase(), s = !0;
      }
  }
  a.prototype._isBuffer = !0;
  function W(i, e, r) {
    const s = i[e];
    i[e] = i[r], i[r] = s;
  }
  a.prototype.swap16 = function() {
    const e = this.length;
    if (e % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let r = 0; r < e; r += 2)
      W(this, r, r + 1);
    return this;
  }, a.prototype.swap32 = function() {
    const e = this.length;
    if (e % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let r = 0; r < e; r += 4)
      W(this, r, r + 3), W(this, r + 1, r + 2);
    return this;
  }, a.prototype.swap64 = function() {
    const e = this.length;
    if (e % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let r = 0; r < e; r += 8)
      W(this, r, r + 7), W(this, r + 1, r + 6), W(this, r + 2, r + 5), W(this, r + 3, r + 4);
    return this;
  }, a.prototype.toString = function() {
    const e = this.length;
    return e === 0 ? "" : arguments.length === 0 ? N(this, 0, e) : ie.apply(this, arguments);
  }, a.prototype.toLocaleString = a.prototype.toString, a.prototype.equals = function(e) {
    if (!a.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
    return this === e ? !0 : a.compare(this, e) === 0;
  }, a.prototype.inspect = function() {
    let e = "";
    const r = h.INSPECT_MAX_BYTES;
    return e = this.toString("hex", 0, r).replace(/(.{2})/g, "$1 ").trim(), this.length > r && (e += " ... "), "<Buffer " + e + ">";
  }, l && (a.prototype[l] = a.prototype.inspect), a.prototype.compare = function(e, r, s, d, m) {
    if (B(e, Uint8Array) && (e = a.from(e, e.offset, e.byteLength)), !a.isBuffer(e))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e
      );
    if (r === void 0 && (r = 0), s === void 0 && (s = e ? e.length : 0), d === void 0 && (d = 0), m === void 0 && (m = this.length), r < 0 || s > e.length || d < 0 || m > this.length)
      throw new RangeError("out of range index");
    if (d >= m && r >= s)
      return 0;
    if (d >= m)
      return -1;
    if (r >= s)
      return 1;
    if (r >>>= 0, s >>>= 0, d >>>= 0, m >>>= 0, this === e) return 0;
    let g = m - d, L = s - r;
    const H = Math.min(g, L), z = this.slice(d, m), V = e.slice(r, s);
    for (let q = 0; q < H; ++q)
      if (z[q] !== V[q]) {
        g = z[q], L = V[q];
        break;
      }
    return g < L ? -1 : L < g ? 1 : 0;
  };
  function ae(i, e, r, s, d) {
    if (i.length === 0) return -1;
    if (typeof r == "string" ? (s = r, r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648), r = +r, _(r) && (r = d ? 0 : i.length - 1), r < 0 && (r = i.length + r), r >= i.length) {
      if (d) return -1;
      r = i.length - 1;
    } else if (r < 0)
      if (d) r = 0;
      else return -1;
    if (typeof e == "string" && (e = a.from(e, s)), a.isBuffer(e))
      return e.length === 0 ? -1 : ue(i, e, r, s, d);
    if (typeof e == "number")
      return e = e & 255, typeof Uint8Array.prototype.indexOf == "function" ? d ? Uint8Array.prototype.indexOf.call(i, e, r) : Uint8Array.prototype.lastIndexOf.call(i, e, r) : ue(i, [e], r, s, d);
    throw new TypeError("val must be string, number or Buffer");
  }
  function ue(i, e, r, s, d) {
    let m = 1, g = i.length, L = e.length;
    if (s !== void 0 && (s = String(s).toLowerCase(), s === "ucs2" || s === "ucs-2" || s === "utf16le" || s === "utf-16le")) {
      if (i.length < 2 || e.length < 2)
        return -1;
      m = 2, g /= 2, L /= 2, r /= 2;
    }
    function H(V, q) {
      return m === 1 ? V[q] : V.readUInt16BE(q * m);
    }
    let z;
    if (d) {
      let V = -1;
      for (z = r; z < g; z++)
        if (H(i, z) === H(e, V === -1 ? 0 : z - V)) {
          if (V === -1 && (V = z), z - V + 1 === L) return V * m;
        } else
          V !== -1 && (z -= z - V), V = -1;
    } else
      for (r + L > g && (r = g - L), z = r; z >= 0; z--) {
        let V = !0;
        for (let q = 0; q < L; q++)
          if (H(i, z + q) !== H(e, q)) {
            V = !1;
            break;
          }
        if (V) return z;
      }
    return -1;
  }
  a.prototype.includes = function(e, r, s) {
    return this.indexOf(e, r, s) !== -1;
  }, a.prototype.indexOf = function(e, r, s) {
    return ae(this, e, r, s, !0);
  }, a.prototype.lastIndexOf = function(e, r, s) {
    return ae(this, e, r, s, !1);
  };
  function O(i, e, r, s) {
    r = Number(r) || 0;
    const d = i.length - r;
    s ? (s = Number(s), s > d && (s = d)) : s = d;
    const m = e.length;
    s > m / 2 && (s = m / 2);
    let g;
    for (g = 0; g < s; ++g) {
      const L = parseInt(e.substr(g * 2, 2), 16);
      if (_(L)) return g;
      i[r + g] = L;
    }
    return g;
  }
  function se(i, e, r, s) {
    return b(t(e, i.length - r), i, r, s);
  }
  function D(i, e, r, s) {
    return b(n(e), i, r, s);
  }
  function Re(i, e, r, s) {
    return b(w(e), i, r, s);
  }
  function I(i, e, r, s) {
    return b(f(e, i.length - r), i, r, s);
  }
  a.prototype.write = function(e, r, s, d) {
    if (r === void 0)
      d = "utf8", s = this.length, r = 0;
    else if (s === void 0 && typeof r == "string")
      d = r, s = this.length, r = 0;
    else if (isFinite(r))
      r = r >>> 0, isFinite(s) ? (s = s >>> 0, d === void 0 && (d = "utf8")) : (d = s, s = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    const m = this.length - r;
    if ((s === void 0 || s > m) && (s = m), e.length > 0 && (s < 0 || r < 0) || r > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    d || (d = "utf8");
    let g = !1;
    for (; ; )
      switch (d) {
        case "hex":
          return O(this, e, r, s);
        case "utf8":
        case "utf-8":
          return se(this, e, r, s);
        case "ascii":
        case "latin1":
        case "binary":
          return D(this, e, r, s);
        case "base64":
          return Re(this, e, r, s);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return I(this, e, r, s);
        default:
          if (g) throw new TypeError("Unknown encoding: " + d);
          d = ("" + d).toLowerCase(), g = !0;
      }
  }, a.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function C(i, e, r) {
    return e === 0 && r === i.length ? o.fromByteArray(i) : o.fromByteArray(i.slice(e, r));
  }
  function N(i, e, r) {
    r = Math.min(i.length, r);
    const s = [];
    let d = e;
    for (; d < r; ) {
      const m = i[d];
      let g = null, L = m > 239 ? 4 : m > 223 ? 3 : m > 191 ? 2 : 1;
      if (d + L <= r) {
        let H, z, V, q;
        switch (L) {
          case 1:
            m < 128 && (g = m);
            break;
          case 2:
            H = i[d + 1], (H & 192) === 128 && (q = (m & 31) << 6 | H & 63, q > 127 && (g = q));
            break;
          case 3:
            H = i[d + 1], z = i[d + 2], (H & 192) === 128 && (z & 192) === 128 && (q = (m & 15) << 12 | (H & 63) << 6 | z & 63, q > 2047 && (q < 55296 || q > 57343) && (g = q));
            break;
          case 4:
            H = i[d + 1], z = i[d + 2], V = i[d + 3], (H & 192) === 128 && (z & 192) === 128 && (V & 192) === 128 && (q = (m & 15) << 18 | (H & 63) << 12 | (z & 63) << 6 | V & 63, q > 65535 && q < 1114112 && (g = q));
        }
      }
      g === null ? (g = 65533, L = 1) : g > 65535 && (g -= 65536, s.push(g >>> 10 & 1023 | 55296), g = 56320 | g & 1023), s.push(g), d += L;
    }
    return ee(s);
  }
  const M = 4096;
  function ee(i) {
    const e = i.length;
    if (e <= M)
      return String.fromCharCode.apply(String, i);
    let r = "", s = 0;
    for (; s < e; )
      r += String.fromCharCode.apply(
        String,
        i.slice(s, s += M)
      );
    return r;
  }
  function xe(i, e, r) {
    let s = "";
    r = Math.min(i.length, r);
    for (let d = e; d < r; ++d)
      s += String.fromCharCode(i[d] & 127);
    return s;
  }
  function be(i, e, r) {
    let s = "";
    r = Math.min(i.length, r);
    for (let d = e; d < r; ++d)
      s += String.fromCharCode(i[d]);
    return s;
  }
  function Be(i, e, r) {
    const s = i.length;
    (!e || e < 0) && (e = 0), (!r || r < 0 || r > s) && (r = s);
    let d = "";
    for (let m = e; m < r; ++m)
      d += G[i[m]];
    return d;
  }
  function le(i, e, r) {
    const s = i.slice(e, r);
    let d = "";
    for (let m = 0; m < s.length - 1; m += 2)
      d += String.fromCharCode(s[m] + s[m + 1] * 256);
    return d;
  }
  a.prototype.slice = function(e, r) {
    const s = this.length;
    e = ~~e, r = r === void 0 ? s : ~~r, e < 0 ? (e += s, e < 0 && (e = 0)) : e > s && (e = s), r < 0 ? (r += s, r < 0 && (r = 0)) : r > s && (r = s), r < e && (r = e);
    const d = this.subarray(e, r);
    return Object.setPrototypeOf(d, a.prototype), d;
  };
  function R(i, e, r) {
    if (i % 1 !== 0 || i < 0) throw new RangeError("offset is not uint");
    if (i + e > r) throw new RangeError("Trying to access beyond buffer length");
  }
  a.prototype.readUintLE = a.prototype.readUIntLE = function(e, r, s) {
    e = e >>> 0, r = r >>> 0, s || R(e, r, this.length);
    let d = this[e], m = 1, g = 0;
    for (; ++g < r && (m *= 256); )
      d += this[e + g] * m;
    return d;
  }, a.prototype.readUintBE = a.prototype.readUIntBE = function(e, r, s) {
    e = e >>> 0, r = r >>> 0, s || R(e, r, this.length);
    let d = this[e + --r], m = 1;
    for (; r > 0 && (m *= 256); )
      d += this[e + --r] * m;
    return d;
  }, a.prototype.readUint8 = a.prototype.readUInt8 = function(e, r) {
    return e = e >>> 0, r || R(e, 1, this.length), this[e];
  }, a.prototype.readUint16LE = a.prototype.readUInt16LE = function(e, r) {
    return e = e >>> 0, r || R(e, 2, this.length), this[e] | this[e + 1] << 8;
  }, a.prototype.readUint16BE = a.prototype.readUInt16BE = function(e, r) {
    return e = e >>> 0, r || R(e, 2, this.length), this[e] << 8 | this[e + 1];
  }, a.prototype.readUint32LE = a.prototype.readUInt32LE = function(e, r) {
    return e = e >>> 0, r || R(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + this[e + 3] * 16777216;
  }, a.prototype.readUint32BE = a.prototype.readUInt32BE = function(e, r) {
    return e = e >>> 0, r || R(e, 4, this.length), this[e] * 16777216 + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
  }, a.prototype.readBigUInt64LE = k(function(e) {
    e = e >>> 0, Q(e, "offset");
    const r = this[e], s = this[e + 7];
    (r === void 0 || s === void 0) && pe(e, this.length - 8);
    const d = r + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24, m = this[++e] + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + s * 2 ** 24;
    return BigInt(d) + (BigInt(m) << BigInt(32));
  }), a.prototype.readBigUInt64BE = k(function(e) {
    e = e >>> 0, Q(e, "offset");
    const r = this[e], s = this[e + 7];
    (r === void 0 || s === void 0) && pe(e, this.length - 8);
    const d = r * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e], m = this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + s;
    return (BigInt(d) << BigInt(32)) + BigInt(m);
  }), a.prototype.readIntLE = function(e, r, s) {
    e = e >>> 0, r = r >>> 0, s || R(e, r, this.length);
    let d = this[e], m = 1, g = 0;
    for (; ++g < r && (m *= 256); )
      d += this[e + g] * m;
    return m *= 128, d >= m && (d -= Math.pow(2, 8 * r)), d;
  }, a.prototype.readIntBE = function(e, r, s) {
    e = e >>> 0, r = r >>> 0, s || R(e, r, this.length);
    let d = r, m = 1, g = this[e + --d];
    for (; d > 0 && (m *= 256); )
      g += this[e + --d] * m;
    return m *= 128, g >= m && (g -= Math.pow(2, 8 * r)), g;
  }, a.prototype.readInt8 = function(e, r) {
    return e = e >>> 0, r || R(e, 1, this.length), this[e] & 128 ? (255 - this[e] + 1) * -1 : this[e];
  }, a.prototype.readInt16LE = function(e, r) {
    e = e >>> 0, r || R(e, 2, this.length);
    const s = this[e] | this[e + 1] << 8;
    return s & 32768 ? s | 4294901760 : s;
  }, a.prototype.readInt16BE = function(e, r) {
    e = e >>> 0, r || R(e, 2, this.length);
    const s = this[e + 1] | this[e] << 8;
    return s & 32768 ? s | 4294901760 : s;
  }, a.prototype.readInt32LE = function(e, r) {
    return e = e >>> 0, r || R(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
  }, a.prototype.readInt32BE = function(e, r) {
    return e = e >>> 0, r || R(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
  }, a.prototype.readBigInt64LE = k(function(e) {
    e = e >>> 0, Q(e, "offset");
    const r = this[e], s = this[e + 7];
    (r === void 0 || s === void 0) && pe(e, this.length - 8);
    const d = this[e + 4] + this[e + 5] * 2 ** 8 + this[e + 6] * 2 ** 16 + (s << 24);
    return (BigInt(d) << BigInt(32)) + BigInt(r + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24);
  }), a.prototype.readBigInt64BE = k(function(e) {
    e = e >>> 0, Q(e, "offset");
    const r = this[e], s = this[e + 7];
    (r === void 0 || s === void 0) && pe(e, this.length - 8);
    const d = (r << 24) + // Overflow
    this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e];
    return (BigInt(d) << BigInt(32)) + BigInt(this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + s);
  }), a.prototype.readFloatLE = function(e, r) {
    return e = e >>> 0, r || R(e, 4, this.length), c.read(this, e, !0, 23, 4);
  }, a.prototype.readFloatBE = function(e, r) {
    return e = e >>> 0, r || R(e, 4, this.length), c.read(this, e, !1, 23, 4);
  }, a.prototype.readDoubleLE = function(e, r) {
    return e = e >>> 0, r || R(e, 8, this.length), c.read(this, e, !0, 52, 8);
  }, a.prototype.readDoubleBE = function(e, r) {
    return e = e >>> 0, r || R(e, 8, this.length), c.read(this, e, !1, 52, 8);
  };
  function $(i, e, r, s, d, m) {
    if (!a.isBuffer(i)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (e > d || e < m) throw new RangeError('"value" argument is out of bounds');
    if (r + s > i.length) throw new RangeError("Index out of range");
  }
  a.prototype.writeUintLE = a.prototype.writeUIntLE = function(e, r, s, d) {
    if (e = +e, r = r >>> 0, s = s >>> 0, !d) {
      const L = Math.pow(2, 8 * s) - 1;
      $(this, e, r, s, L, 0);
    }
    let m = 1, g = 0;
    for (this[r] = e & 255; ++g < s && (m *= 256); )
      this[r + g] = e / m & 255;
    return r + s;
  }, a.prototype.writeUintBE = a.prototype.writeUIntBE = function(e, r, s, d) {
    if (e = +e, r = r >>> 0, s = s >>> 0, !d) {
      const L = Math.pow(2, 8 * s) - 1;
      $(this, e, r, s, L, 0);
    }
    let m = s - 1, g = 1;
    for (this[r + m] = e & 255; --m >= 0 && (g *= 256); )
      this[r + m] = e / g & 255;
    return r + s;
  }, a.prototype.writeUint8 = a.prototype.writeUInt8 = function(e, r, s) {
    return e = +e, r = r >>> 0, s || $(this, e, r, 1, 255, 0), this[r] = e & 255, r + 1;
  }, a.prototype.writeUint16LE = a.prototype.writeUInt16LE = function(e, r, s) {
    return e = +e, r = r >>> 0, s || $(this, e, r, 2, 65535, 0), this[r] = e & 255, this[r + 1] = e >>> 8, r + 2;
  }, a.prototype.writeUint16BE = a.prototype.writeUInt16BE = function(e, r, s) {
    return e = +e, r = r >>> 0, s || $(this, e, r, 2, 65535, 0), this[r] = e >>> 8, this[r + 1] = e & 255, r + 2;
  }, a.prototype.writeUint32LE = a.prototype.writeUInt32LE = function(e, r, s) {
    return e = +e, r = r >>> 0, s || $(this, e, r, 4, 4294967295, 0), this[r + 3] = e >>> 24, this[r + 2] = e >>> 16, this[r + 1] = e >>> 8, this[r] = e & 255, r + 4;
  }, a.prototype.writeUint32BE = a.prototype.writeUInt32BE = function(e, r, s) {
    return e = +e, r = r >>> 0, s || $(this, e, r, 4, 4294967295, 0), this[r] = e >>> 24, this[r + 1] = e >>> 16, this[r + 2] = e >>> 8, this[r + 3] = e & 255, r + 4;
  };
  function Ce(i, e, r, s, d) {
    we(e, s, d, i, r, 7);
    let m = Number(e & BigInt(4294967295));
    i[r++] = m, m = m >> 8, i[r++] = m, m = m >> 8, i[r++] = m, m = m >> 8, i[r++] = m;
    let g = Number(e >> BigInt(32) & BigInt(4294967295));
    return i[r++] = g, g = g >> 8, i[r++] = g, g = g >> 8, i[r++] = g, g = g >> 8, i[r++] = g, r;
  }
  function ve(i, e, r, s, d) {
    we(e, s, d, i, r, 7);
    let m = Number(e & BigInt(4294967295));
    i[r + 7] = m, m = m >> 8, i[r + 6] = m, m = m >> 8, i[r + 5] = m, m = m >> 8, i[r + 4] = m;
    let g = Number(e >> BigInt(32) & BigInt(4294967295));
    return i[r + 3] = g, g = g >> 8, i[r + 2] = g, g = g >> 8, i[r + 1] = g, g = g >> 8, i[r] = g, r + 8;
  }
  a.prototype.writeBigUInt64LE = k(function(e, r = 0) {
    return Ce(this, e, r, BigInt(0), BigInt("0xffffffffffffffff"));
  }), a.prototype.writeBigUInt64BE = k(function(e, r = 0) {
    return ve(this, e, r, BigInt(0), BigInt("0xffffffffffffffff"));
  }), a.prototype.writeIntLE = function(e, r, s, d) {
    if (e = +e, r = r >>> 0, !d) {
      const H = Math.pow(2, 8 * s - 1);
      $(this, e, r, s, H - 1, -H);
    }
    let m = 0, g = 1, L = 0;
    for (this[r] = e & 255; ++m < s && (g *= 256); )
      e < 0 && L === 0 && this[r + m - 1] !== 0 && (L = 1), this[r + m] = (e / g >> 0) - L & 255;
    return r + s;
  }, a.prototype.writeIntBE = function(e, r, s, d) {
    if (e = +e, r = r >>> 0, !d) {
      const H = Math.pow(2, 8 * s - 1);
      $(this, e, r, s, H - 1, -H);
    }
    let m = s - 1, g = 1, L = 0;
    for (this[r + m] = e & 255; --m >= 0 && (g *= 256); )
      e < 0 && L === 0 && this[r + m + 1] !== 0 && (L = 1), this[r + m] = (e / g >> 0) - L & 255;
    return r + s;
  }, a.prototype.writeInt8 = function(e, r, s) {
    return e = +e, r = r >>> 0, s || $(this, e, r, 1, 127, -128), e < 0 && (e = 255 + e + 1), this[r] = e & 255, r + 1;
  }, a.prototype.writeInt16LE = function(e, r, s) {
    return e = +e, r = r >>> 0, s || $(this, e, r, 2, 32767, -32768), this[r] = e & 255, this[r + 1] = e >>> 8, r + 2;
  }, a.prototype.writeInt16BE = function(e, r, s) {
    return e = +e, r = r >>> 0, s || $(this, e, r, 2, 32767, -32768), this[r] = e >>> 8, this[r + 1] = e & 255, r + 2;
  }, a.prototype.writeInt32LE = function(e, r, s) {
    return e = +e, r = r >>> 0, s || $(this, e, r, 4, 2147483647, -2147483648), this[r] = e & 255, this[r + 1] = e >>> 8, this[r + 2] = e >>> 16, this[r + 3] = e >>> 24, r + 4;
  }, a.prototype.writeInt32BE = function(e, r, s) {
    return e = +e, r = r >>> 0, s || $(this, e, r, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), this[r] = e >>> 24, this[r + 1] = e >>> 16, this[r + 2] = e >>> 8, this[r + 3] = e & 255, r + 4;
  }, a.prototype.writeBigInt64LE = k(function(e, r = 0) {
    return Ce(this, e, r, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }), a.prototype.writeBigInt64BE = k(function(e, r = 0) {
    return ve(this, e, r, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function _e(i, e, r, s, d, m) {
    if (r + s > i.length) throw new RangeError("Index out of range");
    if (r < 0) throw new RangeError("Index out of range");
  }
  function Oe(i, e, r, s, d) {
    return e = +e, r = r >>> 0, d || _e(i, e, r, 4), c.write(i, e, r, s, 23, 4), r + 4;
  }
  a.prototype.writeFloatLE = function(e, r, s) {
    return Oe(this, e, r, !0, s);
  }, a.prototype.writeFloatBE = function(e, r, s) {
    return Oe(this, e, r, !1, s);
  };
  function $e(i, e, r, s, d) {
    return e = +e, r = r >>> 0, d || _e(i, e, r, 8), c.write(i, e, r, s, 52, 8), r + 8;
  }
  a.prototype.writeDoubleLE = function(e, r, s) {
    return $e(this, e, r, !0, s);
  }, a.prototype.writeDoubleBE = function(e, r, s) {
    return $e(this, e, r, !1, s);
  }, a.prototype.copy = function(e, r, s, d) {
    if (!a.isBuffer(e)) throw new TypeError("argument should be a Buffer");
    if (s || (s = 0), !d && d !== 0 && (d = this.length), r >= e.length && (r = e.length), r || (r = 0), d > 0 && d < s && (d = s), d === s || e.length === 0 || this.length === 0) return 0;
    if (r < 0)
      throw new RangeError("targetStart out of bounds");
    if (s < 0 || s >= this.length) throw new RangeError("Index out of range");
    if (d < 0) throw new RangeError("sourceEnd out of bounds");
    d > this.length && (d = this.length), e.length - r < d - s && (d = e.length - r + s);
    const m = d - s;
    return this === e && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(r, s, d) : Uint8Array.prototype.set.call(
      e,
      this.subarray(s, d),
      r
    ), m;
  }, a.prototype.fill = function(e, r, s, d) {
    if (typeof e == "string") {
      if (typeof r == "string" ? (d = r, r = 0, s = this.length) : typeof s == "string" && (d = s, s = this.length), d !== void 0 && typeof d != "string")
        throw new TypeError("encoding must be a string");
      if (typeof d == "string" && !a.isEncoding(d))
        throw new TypeError("Unknown encoding: " + d);
      if (e.length === 1) {
        const g = e.charCodeAt(0);
        (d === "utf8" && g < 128 || d === "latin1") && (e = g);
      }
    } else typeof e == "number" ? e = e & 255 : typeof e == "boolean" && (e = Number(e));
    if (r < 0 || this.length < r || this.length < s)
      throw new RangeError("Out of range index");
    if (s <= r)
      return this;
    r = r >>> 0, s = s === void 0 ? this.length : s >>> 0, e || (e = 0);
    let m;
    if (typeof e == "number")
      for (m = r; m < s; ++m)
        this[m] = e;
    else {
      const g = a.isBuffer(e) ? e : a.from(e, d), L = g.length;
      if (L === 0)
        throw new TypeError('The value "' + e + '" is invalid for argument "value"');
      for (m = 0; m < s - r; ++m)
        this[m + r] = g[m % L];
    }
    return this;
  };
  const fe = {};
  function Le(i, e, r) {
    fe[i] = class extends r {
      constructor() {
        super(), Object.defineProperty(this, "message", {
          value: e.apply(this, arguments),
          writable: !0,
          configurable: !0
        }), this.name = `${this.name} [${i}]`, this.stack, delete this.name;
      }
      get code() {
        return i;
      }
      set code(d) {
        Object.defineProperty(this, "code", {
          configurable: !0,
          enumerable: !0,
          value: d,
          writable: !0
        });
      }
      toString() {
        return `${this.name} [${i}]: ${this.message}`;
      }
    };
  }
  Le(
    "ERR_BUFFER_OUT_OF_BOUNDS",
    function(i) {
      return i ? `${i} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
    },
    RangeError
  ), Le(
    "ERR_INVALID_ARG_TYPE",
    function(i, e) {
      return `The "${i}" argument must be of type number. Received type ${typeof e}`;
    },
    TypeError
  ), Le(
    "ERR_OUT_OF_RANGE",
    function(i, e, r) {
      let s = `The value of "${i}" is out of range.`, d = r;
      return Number.isInteger(r) && Math.abs(r) > 2 ** 32 ? d = Ge(String(r)) : typeof r == "bigint" && (d = String(r), (r > BigInt(2) ** BigInt(32) || r < -(BigInt(2) ** BigInt(32))) && (d = Ge(d)), d += "n"), s += ` It must be ${e}. Received ${d}`, s;
    },
    RangeError
  );
  function Ge(i) {
    let e = "", r = i.length;
    const s = i[0] === "-" ? 1 : 0;
    for (; r >= s + 4; r -= 3)
      e = `_${i.slice(r - 3, r)}${e}`;
    return `${i.slice(0, r)}${e}`;
  }
  function qe(i, e, r) {
    Q(e, "offset"), (i[e] === void 0 || i[e + r] === void 0) && pe(e, i.length - (r + 1));
  }
  function we(i, e, r, s, d, m) {
    if (i > r || i < e) {
      const g = typeof e == "bigint" ? "n" : "";
      let L;
      throw e === 0 || e === BigInt(0) ? L = `>= 0${g} and < 2${g} ** ${(m + 1) * 8}${g}` : L = `>= -(2${g} ** ${(m + 1) * 8 - 1}${g}) and < 2 ** ${(m + 1) * 8 - 1}${g}`, new fe.ERR_OUT_OF_RANGE("value", L, i);
    }
    qe(s, d, m);
  }
  function Q(i, e) {
    if (typeof i != "number")
      throw new fe.ERR_INVALID_ARG_TYPE(e, "number", i);
  }
  function pe(i, e, r) {
    throw Math.floor(i) !== i ? (Q(i, r), new fe.ERR_OUT_OF_RANGE("offset", "an integer", i)) : e < 0 ? new fe.ERR_BUFFER_OUT_OF_BOUNDS() : new fe.ERR_OUT_OF_RANGE(
      "offset",
      `>= 0 and <= ${e}`,
      i
    );
  }
  const Xe = /[^+/0-9A-Za-z-_]/g;
  function u(i) {
    if (i = i.split("=")[0], i = i.trim().replace(Xe, ""), i.length < 2) return "";
    for (; i.length % 4 !== 0; )
      i = i + "=";
    return i;
  }
  function t(i, e) {
    e = e || 1 / 0;
    let r;
    const s = i.length;
    let d = null;
    const m = [];
    for (let g = 0; g < s; ++g) {
      if (r = i.charCodeAt(g), r > 55295 && r < 57344) {
        if (!d) {
          if (r > 56319) {
            (e -= 3) > -1 && m.push(239, 191, 189);
            continue;
          } else if (g + 1 === s) {
            (e -= 3) > -1 && m.push(239, 191, 189);
            continue;
          }
          d = r;
          continue;
        }
        if (r < 56320) {
          (e -= 3) > -1 && m.push(239, 191, 189), d = r;
          continue;
        }
        r = (d - 55296 << 10 | r - 56320) + 65536;
      } else d && (e -= 3) > -1 && m.push(239, 191, 189);
      if (d = null, r < 128) {
        if ((e -= 1) < 0) break;
        m.push(r);
      } else if (r < 2048) {
        if ((e -= 2) < 0) break;
        m.push(
          r >> 6 | 192,
          r & 63 | 128
        );
      } else if (r < 65536) {
        if ((e -= 3) < 0) break;
        m.push(
          r >> 12 | 224,
          r >> 6 & 63 | 128,
          r & 63 | 128
        );
      } else if (r < 1114112) {
        if ((e -= 4) < 0) break;
        m.push(
          r >> 18 | 240,
          r >> 12 & 63 | 128,
          r >> 6 & 63 | 128,
          r & 63 | 128
        );
      } else
        throw new Error("Invalid code point");
    }
    return m;
  }
  function n(i) {
    const e = [];
    for (let r = 0; r < i.length; ++r)
      e.push(i.charCodeAt(r) & 255);
    return e;
  }
  function f(i, e) {
    let r, s, d;
    const m = [];
    for (let g = 0; g < i.length && !((e -= 2) < 0); ++g)
      r = i.charCodeAt(g), s = r >> 8, d = r % 256, m.push(d), m.push(s);
    return m;
  }
  function w(i) {
    return o.toByteArray(u(i));
  }
  function b(i, e, r, s) {
    let d;
    for (d = 0; d < s && !(d + r >= e.length || d >= i.length); ++d)
      e[d + r] = i[d];
    return d;
  }
  function B(i, e) {
    return i instanceof e || i != null && i.constructor != null && i.constructor.name != null && i.constructor.name === e.name;
  }
  function _(i) {
    return i !== i;
  }
  const G = function() {
    const i = "0123456789abcdef", e = new Array(256);
    for (let r = 0; r < 16; ++r) {
      const s = r * 16;
      for (let d = 0; d < 16; ++d)
        e[s + d] = i[r] + i[d];
    }
    return e;
  }();
  function k(i) {
    return typeof BigInt > "u" ? Y : i;
  }
  function Y() {
    throw new Error("BigInt not supported");
  }
})(J);
function Pe(h, o, c) {
  try {
    return h.pipeThrough(new TransformStream(o));
  } catch {
    const p = h.getReader();
    return new ReadableStream({
      start(y) {
        if (o.start)
          return o.start(y);
      },
      async pull(y) {
        let x = !1;
        const a = {
          enqueue(A) {
            x = !0, y.enqueue(A);
          }
        };
        for (; !x; ) {
          const A = await p.read();
          if (A.done)
            return o.flush && await o.flush(y), y.close();
          await o.transform(A.value, a);
        }
      },
      cancel(y) {
        h.cancel(y), c && c(y);
      }
    });
  }
}
typeof window < "u" && (window.Buffer = J.Buffer);
const xt = 12, yr = 16, ke = 16, tr = "encrypt", br = "decrypt", Br = 1024 * 64, xr = new TextEncoder();
function wt(h) {
  const o = new Uint8Array(h);
  return crypto.getRandomValues(o), o.buffer;
}
class Ar {
  constructor(o, c, l, p) {
    this.mode = o, this.prevChunk, this.seq = 0, this.firstchunk = !0, this.rs = l, this.ikm = c.buffer, this.salt = p;
  }
  async generateKey() {
    const o = await crypto.subtle.importKey(
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
        info: xr.encode("Content-Encoding: aes128gcm\0"),
        hash: "SHA-256"
      },
      o,
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
    const o = await crypto.subtle.importKey(
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
          info: xr.encode("Content-Encoding: nonce\0"),
          hash: "SHA-256"
        },
        o,
        {
          name: "AES-GCM",
          length: 128
        },
        !0,
        ["encrypt", "decrypt"]
      )
    );
    return J.Buffer.from(c.slice(0, xt));
  }
  generateNonce(o) {
    if (o > 4294967295)
      throw new Error("record sequence number exceeds limit");
    const c = J.Buffer.from(this.nonceBase), p = (c.readUIntBE(c.length - 4, 4) ^ o) >>> 0;
    return c.writeUIntBE(p, c.length - 4, 4), c;
  }
  pad(o, c) {
    const l = o.length;
    if (l + yr >= this.rs)
      throw new Error("data too large for record size");
    if (c) {
      const p = J.Buffer.alloc(1);
      return p.writeUInt8(2, 0), J.Buffer.concat([o, p]);
    } else {
      const p = J.Buffer.alloc(this.rs - l - yr);
      return p.fill(0), p.writeUInt8(1, 0), J.Buffer.concat([o, p]);
    }
  }
  unpad(o, c) {
    for (let l = o.length - 1; l >= 0; l--)
      if (o[l]) {
        if (c) {
          if (o[l] !== 2)
            throw new Error("delimiter of final record is not 2");
        } else if (o[l] !== 1)
          throw new Error("delimiter of not final record is not 1");
        return o.slice(0, l);
      }
    throw new Error("no delimiter found");
  }
  createHeader() {
    const o = J.Buffer.alloc(5);
    return o.writeUIntBE(this.rs, 0, 4), o.writeUIntBE(0, 4, 1), J.Buffer.concat([J.Buffer.from(this.salt), o]);
  }
  readHeader(o) {
    if (o.length < 21)
      throw new Error("chunk too small for reading header");
    const c = {};
    c.salt = o.buffer.slice(0, ke), c.rs = o.readUIntBE(ke, 4);
    const l = o.readUInt8(ke + 4);
    return c.length = l + ke + 5, c;
  }
  async encryptRecord(o, c, l) {
    const p = this.generateNonce(c), y = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: p },
      this.key,
      this.pad(o, l)
    );
    return J.Buffer.from(y);
  }
  async decryptRecord(o, c, l) {
    const p = this.generateNonce(c), y = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: p,
        tagLength: 128
      },
      this.key,
      o
    );
    return this.unpad(J.Buffer.from(y), l);
  }
  async start(o) {
    if (this.mode === tr)
      this.key = await this.generateKey(), this.nonceBase = await this.generateNonceBase(), o.enqueue(this.createHeader());
    else if (this.mode !== br)
      throw new Error("mode must be either encrypt or decrypt");
  }
  async transformPrevChunk(o, c) {
    if (this.mode === tr)
      c.enqueue(
        await this.encryptRecord(this.prevChunk, this.seq, o)
      ), this.seq++;
    else {
      if (this.seq === 0) {
        const l = this.readHeader(this.prevChunk);
        this.salt = l.salt, this.rs = l.rs, this.key = await this.generateKey(), this.nonceBase = await this.generateNonceBase();
      } else
        c.enqueue(
          await this.decryptRecord(this.prevChunk, this.seq - 1, o)
        );
      this.seq++;
    }
  }
  async transform(o, c) {
    this.firstchunk || await this.transformPrevChunk(!1, c), this.firstchunk = !1, this.prevChunk = J.Buffer.from(o.buffer);
  }
  async flush(o) {
    this.prevChunk && await this.transformPrevChunk(!0, o);
  }
}
class Fr {
  constructor(o, c) {
    this.mode = c, this.rs = o, this.chunkSize = c === tr ? o - 17 : 21, this.partialChunk = new Uint8Array(this.chunkSize), this.offset = 0;
  }
  send(o, c) {
    c.enqueue(o), this.chunkSize === 21 && this.mode === br && (this.chunkSize = this.rs), this.partialChunk = new Uint8Array(this.chunkSize), this.offset = 0;
  }
  //reslice input into record sized chunks
  transform(o, c) {
    let l = 0;
    if (this.offset > 0) {
      const p = Math.min(o.byteLength, this.chunkSize - this.offset);
      this.partialChunk.set(o.slice(0, p), this.offset), this.offset += p, l += p, this.offset === this.chunkSize && this.send(this.partialChunk, c);
    }
    for (; l < o.byteLength; ) {
      const p = o.byteLength - l;
      if (p >= this.chunkSize) {
        const y = o.slice(l, l + this.chunkSize);
        l += this.chunkSize, this.send(y, c);
      } else {
        const y = o.slice(l, l + p);
        l += y.byteLength, this.partialChunk.set(y), this.offset = y.byteLength;
      }
    }
  }
  flush(o) {
    this.offset > 0 && o.enqueue(this.partialChunk.slice(0, this.offset));
  }
}
function mt(h, o, c = Br, l = wt(ke)) {
  const p = "encrypt", y = Pe(h, new Fr(c, p));
  return Pe(y, new Ar(p, o, c, l));
}
function gt(h, o, c = Br) {
  const l = "decrypt", p = Pe(h, new Fr(c, l));
  return Pe(p, new Ar(l, o, c));
}
const Ne = new TextEncoder(), Et = new TextDecoder();
class bt {
  constructor(o, c) {
    this._nonce = c || "yRCdyQ1EMSA3mo4rqSkuNQ==", o ? this.rawSecret = De.b64ToArray(o) : this.rawSecret = crypto.getRandomValues(new Uint8Array(16)), this.secretKeyPromise = crypto.subtle.importKey(
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
          info: Ne.encode("metadata"),
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
          info: Ne.encode("authentication"),
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
  set nonce(o) {
    o && o !== this._nonce && (this._nonce = o);
  }
  setPassword(o, c) {
    this.authKeyPromise = crypto.subtle.importKey("raw", Ne.encode(o), { name: "PBKDF2" }, !1, [
      "deriveKey"
    ]).then(
      (l) => crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: Ne.encode(c),
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
  setAuthKey(o) {
    this.authKeyPromise = crypto.subtle.importKey(
      "raw",
      De.b64ToArray(o),
      {
        name: "HMAC",
        hash: "SHA-256"
      },
      !0,
      ["sign"]
    );
  }
  async authKeyB64() {
    const o = await this.authKeyPromise, c = await crypto.subtle.exportKey("raw", o);
    return De.arrayToB64(new Uint8Array(c));
  }
  async authHeader() {
    const o = await this.authKeyPromise, c = await crypto.subtle.sign(
      {
        name: "HMAC"
      },
      o,
      De.b64ToArray(this.nonce)
    );
    return `send-v1 ${De.arrayToB64(new Uint8Array(c))}`;
  }
  async encryptMetadata(o) {
    const c = await this.metaKeyPromise;
    return await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(12),
        tagLength: 128
      },
      c,
      Ne.encode(
        JSON.stringify({
          name: o.name,
          size: o.size,
          type: o.type || "application/octet-stream",
          manifest: o.manifest || {}
        })
      )
    );
  }
  encryptStream(o) {
    return mt(o, this.rawSecret);
  }
  decryptStream(o) {
    return gt(o, this.rawSecret);
  }
  async decryptMetadata(o) {
    const c = await this.metaKeyPromise, l = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(12),
        tagLength: 128
      },
      c,
      o
    );
    return JSON.parse(Et.decode(l));
  }
}
let nr = null;
try {
  nr = localStorage.getItem("wssURL");
} catch {
}
nr || (nr = "wss://send.firefox.com/api/ws");
let Bt = "";
function At(h) {
  return Bt + h;
}
function Ft(h) {
  return h = h || "", h.split(" ")[1];
}
async function Ut(h, o, c) {
  const l = await o.authHeader(), p = await fetch(At(`/api/download/${h}`), {
    signal: c,
    method: "GET",
    headers: { Authorization: l }
  }), y = p.headers.get("WWW-Authenticate");
  if (y && (o.nonce = Ft(y)), p.status !== 200)
    throw new Error(p.status);
  return p.body;
}
async function Ur(h, o, c, l = 2) {
  try {
    return await Ut(h, o, c);
  } catch (p) {
    if (p.message === "401" && --l > 0)
      return Ur(h, o, c, l);
    throw p.name === "AbortError" ? new Error("0") : p;
  }
}
function It(h, o) {
  const c = new AbortController();
  function l() {
    c.abort();
  }
  return {
    cancel: l,
    result: Ur(h, o, c.signal)
  };
}
var ye = {};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(h) {
  var o = Te, c = We, l = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  h.Buffer = a, h.SlowBuffer = de, h.INSPECT_MAX_BYTES = 50;
  var p = 2147483647;
  h.kMaxLength = p, a.TYPED_ARRAY_SUPPORT = y(), !a.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function y() {
    try {
      var u = new Uint8Array(1), t = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(t, Uint8Array.prototype), Object.setPrototypeOf(u, t), u.foo() === 42;
    } catch {
      return !1;
    }
  }
  Object.defineProperty(a.prototype, "parent", {
    enumerable: !0,
    get: function() {
      if (a.isBuffer(this))
        return this.buffer;
    }
  }), Object.defineProperty(a.prototype, "offset", {
    enumerable: !0,
    get: function() {
      if (a.isBuffer(this))
        return this.byteOffset;
    }
  });
  function x(u) {
    if (u > p)
      throw new RangeError('The value "' + u + '" is invalid for option "size"');
    var t = new Uint8Array(u);
    return Object.setPrototypeOf(t, a.prototype), t;
  }
  function a(u, t, n) {
    if (typeof u == "number") {
      if (typeof t == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return U(u);
    }
    return A(u, t, n);
  }
  a.poolSize = 8192;
  function A(u, t, n) {
    if (typeof u == "string")
      return v(u, t);
    if (ArrayBuffer.isView(u))
      return P(u);
    if (u == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof u
      );
    if (Q(u, ArrayBuffer) || u && Q(u.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (Q(u, SharedArrayBuffer) || u && Q(u.buffer, SharedArrayBuffer)))
      return T(u, t, n);
    if (typeof u == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    var f = u.valueOf && u.valueOf();
    if (f != null && f !== u)
      return a.from(f, t, n);
    var w = X(u);
    if (w) return w;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof u[Symbol.toPrimitive] == "function")
      return a.from(
        u[Symbol.toPrimitive]("string"),
        t,
        n
      );
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof u
    );
  }
  a.from = function(u, t, n) {
    return A(u, t, n);
  }, Object.setPrototypeOf(a.prototype, Uint8Array.prototype), Object.setPrototypeOf(a, Uint8Array);
  function E(u) {
    if (typeof u != "number")
      throw new TypeError('"size" argument must be of type number');
    if (u < 0)
      throw new RangeError('The value "' + u + '" is invalid for option "size"');
  }
  function F(u, t, n) {
    return E(u), u <= 0 ? x(u) : t !== void 0 ? typeof n == "string" ? x(u).fill(t, n) : x(u).fill(t) : x(u);
  }
  a.alloc = function(u, t, n) {
    return F(u, t, n);
  };
  function U(u) {
    return E(u), x(u < 0 ? 0 : te(u) | 0);
  }
  a.allocUnsafe = function(u) {
    return U(u);
  }, a.allocUnsafeSlow = function(u) {
    return U(u);
  };
  function v(u, t) {
    if ((typeof t != "string" || t === "") && (t = "utf8"), !a.isEncoding(t))
      throw new TypeError("Unknown encoding: " + t);
    var n = K(u, t) | 0, f = x(n), w = f.write(u, t);
    return w !== n && (f = f.slice(0, w)), f;
  }
  function S(u) {
    for (var t = u.length < 0 ? 0 : te(u.length) | 0, n = x(t), f = 0; f < t; f += 1)
      n[f] = u[f] & 255;
    return n;
  }
  function P(u) {
    if (Q(u, Uint8Array)) {
      var t = new Uint8Array(u);
      return T(t.buffer, t.byteOffset, t.byteLength);
    }
    return S(u);
  }
  function T(u, t, n) {
    if (t < 0 || u.byteLength < t)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (u.byteLength < t + (n || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    var f;
    return t === void 0 && n === void 0 ? f = new Uint8Array(u) : n === void 0 ? f = new Uint8Array(u, t) : f = new Uint8Array(u, t, n), Object.setPrototypeOf(f, a.prototype), f;
  }
  function X(u) {
    if (a.isBuffer(u)) {
      var t = te(u.length) | 0, n = x(t);
      return n.length === 0 || u.copy(n, 0, 0, t), n;
    }
    if (u.length !== void 0)
      return typeof u.length != "number" || pe(u.length) ? x(0) : S(u);
    if (u.type === "Buffer" && Array.isArray(u.data))
      return S(u.data);
  }
  function te(u) {
    if (u >= p)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + p.toString(16) + " bytes");
    return u | 0;
  }
  function de(u) {
    return +u != u && (u = 0), a.alloc(+u);
  }
  a.isBuffer = function(t) {
    return t != null && t._isBuffer === !0 && t !== a.prototype;
  }, a.compare = function(t, n) {
    if (Q(t, Uint8Array) && (t = a.from(t, t.offset, t.byteLength)), Q(n, Uint8Array) && (n = a.from(n, n.offset, n.byteLength)), !a.isBuffer(t) || !a.isBuffer(n))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (t === n) return 0;
    for (var f = t.length, w = n.length, b = 0, B = Math.min(f, w); b < B; ++b)
      if (t[b] !== n[b]) {
        f = t[b], w = n[b];
        break;
      }
    return f < w ? -1 : w < f ? 1 : 0;
  }, a.isEncoding = function(t) {
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
  }, a.concat = function(t, n) {
    if (!Array.isArray(t))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (t.length === 0)
      return a.alloc(0);
    var f;
    if (n === void 0)
      for (n = 0, f = 0; f < t.length; ++f)
        n += t[f].length;
    var w = a.allocUnsafe(n), b = 0;
    for (f = 0; f < t.length; ++f) {
      var B = t[f];
      if (Q(B, Uint8Array))
        b + B.length > w.length ? a.from(B).copy(w, b) : Uint8Array.prototype.set.call(
          w,
          B,
          b
        );
      else if (a.isBuffer(B))
        B.copy(w, b);
      else
        throw new TypeError('"list" argument must be an Array of Buffers');
      b += B.length;
    }
    return w;
  };
  function K(u, t) {
    if (a.isBuffer(u))
      return u.length;
    if (ArrayBuffer.isView(u) || Q(u, ArrayBuffer))
      return u.byteLength;
    if (typeof u != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof u
      );
    var n = u.length, f = arguments.length > 2 && arguments[2] === !0;
    if (!f && n === 0) return 0;
    for (var w = !1; ; )
      switch (t) {
        case "ascii":
        case "latin1":
        case "binary":
          return n;
        case "utf8":
        case "utf-8":
          return fe(u).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return n * 2;
        case "hex":
          return n >>> 1;
        case "base64":
          return qe(u).length;
        default:
          if (w)
            return f ? -1 : fe(u).length;
          t = ("" + t).toLowerCase(), w = !0;
      }
  }
  a.byteLength = K;
  function ie(u, t, n) {
    var f = !1;
    if ((t === void 0 || t < 0) && (t = 0), t > this.length || ((n === void 0 || n > this.length) && (n = this.length), n <= 0) || (n >>>= 0, t >>>= 0, n <= t))
      return "";
    for (u || (u = "utf8"); ; )
      switch (u) {
        case "hex":
          return Be(this, t, n);
        case "utf8":
        case "utf-8":
          return N(this, t, n);
        case "ascii":
          return xe(this, t, n);
        case "latin1":
        case "binary":
          return be(this, t, n);
        case "base64":
          return C(this, t, n);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return le(this, t, n);
        default:
          if (f) throw new TypeError("Unknown encoding: " + u);
          u = (u + "").toLowerCase(), f = !0;
      }
  }
  a.prototype._isBuffer = !0;
  function W(u, t, n) {
    var f = u[t];
    u[t] = u[n], u[n] = f;
  }
  a.prototype.swap16 = function() {
    var t = this.length;
    if (t % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (var n = 0; n < t; n += 2)
      W(this, n, n + 1);
    return this;
  }, a.prototype.swap32 = function() {
    var t = this.length;
    if (t % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (var n = 0; n < t; n += 4)
      W(this, n, n + 3), W(this, n + 1, n + 2);
    return this;
  }, a.prototype.swap64 = function() {
    var t = this.length;
    if (t % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (var n = 0; n < t; n += 8)
      W(this, n, n + 7), W(this, n + 1, n + 6), W(this, n + 2, n + 5), W(this, n + 3, n + 4);
    return this;
  }, a.prototype.toString = function() {
    var t = this.length;
    return t === 0 ? "" : arguments.length === 0 ? N(this, 0, t) : ie.apply(this, arguments);
  }, a.prototype.toLocaleString = a.prototype.toString, a.prototype.equals = function(t) {
    if (!a.isBuffer(t)) throw new TypeError("Argument must be a Buffer");
    return this === t ? !0 : a.compare(this, t) === 0;
  }, a.prototype.inspect = function() {
    var t = "", n = h.INSPECT_MAX_BYTES;
    return t = this.toString("hex", 0, n).replace(/(.{2})/g, "$1 ").trim(), this.length > n && (t += " ... "), "<Buffer " + t + ">";
  }, l && (a.prototype[l] = a.prototype.inspect), a.prototype.compare = function(t, n, f, w, b) {
    if (Q(t, Uint8Array) && (t = a.from(t, t.offset, t.byteLength)), !a.isBuffer(t))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof t
      );
    if (n === void 0 && (n = 0), f === void 0 && (f = t ? t.length : 0), w === void 0 && (w = 0), b === void 0 && (b = this.length), n < 0 || f > t.length || w < 0 || b > this.length)
      throw new RangeError("out of range index");
    if (w >= b && n >= f)
      return 0;
    if (w >= b)
      return -1;
    if (n >= f)
      return 1;
    if (n >>>= 0, f >>>= 0, w >>>= 0, b >>>= 0, this === t) return 0;
    for (var B = b - w, _ = f - n, G = Math.min(B, _), k = this.slice(w, b), Y = t.slice(n, f), i = 0; i < G; ++i)
      if (k[i] !== Y[i]) {
        B = k[i], _ = Y[i];
        break;
      }
    return B < _ ? -1 : _ < B ? 1 : 0;
  };
  function ae(u, t, n, f, w) {
    if (u.length === 0) return -1;
    if (typeof n == "string" ? (f = n, n = 0) : n > 2147483647 ? n = 2147483647 : n < -2147483648 && (n = -2147483648), n = +n, pe(n) && (n = w ? 0 : u.length - 1), n < 0 && (n = u.length + n), n >= u.length) {
      if (w) return -1;
      n = u.length - 1;
    } else if (n < 0)
      if (w) n = 0;
      else return -1;
    if (typeof t == "string" && (t = a.from(t, f)), a.isBuffer(t))
      return t.length === 0 ? -1 : ue(u, t, n, f, w);
    if (typeof t == "number")
      return t = t & 255, typeof Uint8Array.prototype.indexOf == "function" ? w ? Uint8Array.prototype.indexOf.call(u, t, n) : Uint8Array.prototype.lastIndexOf.call(u, t, n) : ue(u, [t], n, f, w);
    throw new TypeError("val must be string, number or Buffer");
  }
  function ue(u, t, n, f, w) {
    var b = 1, B = u.length, _ = t.length;
    if (f !== void 0 && (f = String(f).toLowerCase(), f === "ucs2" || f === "ucs-2" || f === "utf16le" || f === "utf-16le")) {
      if (u.length < 2 || t.length < 2)
        return -1;
      b = 2, B /= 2, _ /= 2, n /= 2;
    }
    function G(r, s) {
      return b === 1 ? r[s] : r.readUInt16BE(s * b);
    }
    var k;
    if (w) {
      var Y = -1;
      for (k = n; k < B; k++)
        if (G(u, k) === G(t, Y === -1 ? 0 : k - Y)) {
          if (Y === -1 && (Y = k), k - Y + 1 === _) return Y * b;
        } else
          Y !== -1 && (k -= k - Y), Y = -1;
    } else
      for (n + _ > B && (n = B - _), k = n; k >= 0; k--) {
        for (var i = !0, e = 0; e < _; e++)
          if (G(u, k + e) !== G(t, e)) {
            i = !1;
            break;
          }
        if (i) return k;
      }
    return -1;
  }
  a.prototype.includes = function(t, n, f) {
    return this.indexOf(t, n, f) !== -1;
  }, a.prototype.indexOf = function(t, n, f) {
    return ae(this, t, n, f, !0);
  }, a.prototype.lastIndexOf = function(t, n, f) {
    return ae(this, t, n, f, !1);
  };
  function O(u, t, n, f) {
    n = Number(n) || 0;
    var w = u.length - n;
    f ? (f = Number(f), f > w && (f = w)) : f = w;
    var b = t.length;
    f > b / 2 && (f = b / 2);
    for (var B = 0; B < f; ++B) {
      var _ = parseInt(t.substr(B * 2, 2), 16);
      if (pe(_)) return B;
      u[n + B] = _;
    }
    return B;
  }
  function se(u, t, n, f) {
    return we(fe(t, u.length - n), u, n, f);
  }
  function D(u, t, n, f) {
    return we(Le(t), u, n, f);
  }
  function Re(u, t, n, f) {
    return we(qe(t), u, n, f);
  }
  function I(u, t, n, f) {
    return we(Ge(t, u.length - n), u, n, f);
  }
  a.prototype.write = function(t, n, f, w) {
    if (n === void 0)
      w = "utf8", f = this.length, n = 0;
    else if (f === void 0 && typeof n == "string")
      w = n, f = this.length, n = 0;
    else if (isFinite(n))
      n = n >>> 0, isFinite(f) ? (f = f >>> 0, w === void 0 && (w = "utf8")) : (w = f, f = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    var b = this.length - n;
    if ((f === void 0 || f > b) && (f = b), t.length > 0 && (f < 0 || n < 0) || n > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    w || (w = "utf8");
    for (var B = !1; ; )
      switch (w) {
        case "hex":
          return O(this, t, n, f);
        case "utf8":
        case "utf-8":
          return se(this, t, n, f);
        case "ascii":
        case "latin1":
        case "binary":
          return D(this, t, n, f);
        case "base64":
          return Re(this, t, n, f);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return I(this, t, n, f);
        default:
          if (B) throw new TypeError("Unknown encoding: " + w);
          w = ("" + w).toLowerCase(), B = !0;
      }
  }, a.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function C(u, t, n) {
    return t === 0 && n === u.length ? o.fromByteArray(u) : o.fromByteArray(u.slice(t, n));
  }
  function N(u, t, n) {
    n = Math.min(u.length, n);
    for (var f = [], w = t; w < n; ) {
      var b = u[w], B = null, _ = b > 239 ? 4 : b > 223 ? 3 : b > 191 ? 2 : 1;
      if (w + _ <= n) {
        var G, k, Y, i;
        switch (_) {
          case 1:
            b < 128 && (B = b);
            break;
          case 2:
            G = u[w + 1], (G & 192) === 128 && (i = (b & 31) << 6 | G & 63, i > 127 && (B = i));
            break;
          case 3:
            G = u[w + 1], k = u[w + 2], (G & 192) === 128 && (k & 192) === 128 && (i = (b & 15) << 12 | (G & 63) << 6 | k & 63, i > 2047 && (i < 55296 || i > 57343) && (B = i));
            break;
          case 4:
            G = u[w + 1], k = u[w + 2], Y = u[w + 3], (G & 192) === 128 && (k & 192) === 128 && (Y & 192) === 128 && (i = (b & 15) << 18 | (G & 63) << 12 | (k & 63) << 6 | Y & 63, i > 65535 && i < 1114112 && (B = i));
        }
      }
      B === null ? (B = 65533, _ = 1) : B > 65535 && (B -= 65536, f.push(B >>> 10 & 1023 | 55296), B = 56320 | B & 1023), f.push(B), w += _;
    }
    return ee(f);
  }
  var M = 4096;
  function ee(u) {
    var t = u.length;
    if (t <= M)
      return String.fromCharCode.apply(String, u);
    for (var n = "", f = 0; f < t; )
      n += String.fromCharCode.apply(
        String,
        u.slice(f, f += M)
      );
    return n;
  }
  function xe(u, t, n) {
    var f = "";
    n = Math.min(u.length, n);
    for (var w = t; w < n; ++w)
      f += String.fromCharCode(u[w] & 127);
    return f;
  }
  function be(u, t, n) {
    var f = "";
    n = Math.min(u.length, n);
    for (var w = t; w < n; ++w)
      f += String.fromCharCode(u[w]);
    return f;
  }
  function Be(u, t, n) {
    var f = u.length;
    (!t || t < 0) && (t = 0), (!n || n < 0 || n > f) && (n = f);
    for (var w = "", b = t; b < n; ++b)
      w += Xe[u[b]];
    return w;
  }
  function le(u, t, n) {
    for (var f = u.slice(t, n), w = "", b = 0; b < f.length - 1; b += 2)
      w += String.fromCharCode(f[b] + f[b + 1] * 256);
    return w;
  }
  a.prototype.slice = function(t, n) {
    var f = this.length;
    t = ~~t, n = n === void 0 ? f : ~~n, t < 0 ? (t += f, t < 0 && (t = 0)) : t > f && (t = f), n < 0 ? (n += f, n < 0 && (n = 0)) : n > f && (n = f), n < t && (n = t);
    var w = this.subarray(t, n);
    return Object.setPrototypeOf(w, a.prototype), w;
  };
  function R(u, t, n) {
    if (u % 1 !== 0 || u < 0) throw new RangeError("offset is not uint");
    if (u + t > n) throw new RangeError("Trying to access beyond buffer length");
  }
  a.prototype.readUintLE = a.prototype.readUIntLE = function(t, n, f) {
    t = t >>> 0, n = n >>> 0, f || R(t, n, this.length);
    for (var w = this[t], b = 1, B = 0; ++B < n && (b *= 256); )
      w += this[t + B] * b;
    return w;
  }, a.prototype.readUintBE = a.prototype.readUIntBE = function(t, n, f) {
    t = t >>> 0, n = n >>> 0, f || R(t, n, this.length);
    for (var w = this[t + --n], b = 1; n > 0 && (b *= 256); )
      w += this[t + --n] * b;
    return w;
  }, a.prototype.readUint8 = a.prototype.readUInt8 = function(t, n) {
    return t = t >>> 0, n || R(t, 1, this.length), this[t];
  }, a.prototype.readUint16LE = a.prototype.readUInt16LE = function(t, n) {
    return t = t >>> 0, n || R(t, 2, this.length), this[t] | this[t + 1] << 8;
  }, a.prototype.readUint16BE = a.prototype.readUInt16BE = function(t, n) {
    return t = t >>> 0, n || R(t, 2, this.length), this[t] << 8 | this[t + 1];
  }, a.prototype.readUint32LE = a.prototype.readUInt32LE = function(t, n) {
    return t = t >>> 0, n || R(t, 4, this.length), (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + this[t + 3] * 16777216;
  }, a.prototype.readUint32BE = a.prototype.readUInt32BE = function(t, n) {
    return t = t >>> 0, n || R(t, 4, this.length), this[t] * 16777216 + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]);
  }, a.prototype.readIntLE = function(t, n, f) {
    t = t >>> 0, n = n >>> 0, f || R(t, n, this.length);
    for (var w = this[t], b = 1, B = 0; ++B < n && (b *= 256); )
      w += this[t + B] * b;
    return b *= 128, w >= b && (w -= Math.pow(2, 8 * n)), w;
  }, a.prototype.readIntBE = function(t, n, f) {
    t = t >>> 0, n = n >>> 0, f || R(t, n, this.length);
    for (var w = n, b = 1, B = this[t + --w]; w > 0 && (b *= 256); )
      B += this[t + --w] * b;
    return b *= 128, B >= b && (B -= Math.pow(2, 8 * n)), B;
  }, a.prototype.readInt8 = function(t, n) {
    return t = t >>> 0, n || R(t, 1, this.length), this[t] & 128 ? (255 - this[t] + 1) * -1 : this[t];
  }, a.prototype.readInt16LE = function(t, n) {
    t = t >>> 0, n || R(t, 2, this.length);
    var f = this[t] | this[t + 1] << 8;
    return f & 32768 ? f | 4294901760 : f;
  }, a.prototype.readInt16BE = function(t, n) {
    t = t >>> 0, n || R(t, 2, this.length);
    var f = this[t + 1] | this[t] << 8;
    return f & 32768 ? f | 4294901760 : f;
  }, a.prototype.readInt32LE = function(t, n) {
    return t = t >>> 0, n || R(t, 4, this.length), this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24;
  }, a.prototype.readInt32BE = function(t, n) {
    return t = t >>> 0, n || R(t, 4, this.length), this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3];
  }, a.prototype.readFloatLE = function(t, n) {
    return t = t >>> 0, n || R(t, 4, this.length), c.read(this, t, !0, 23, 4);
  }, a.prototype.readFloatBE = function(t, n) {
    return t = t >>> 0, n || R(t, 4, this.length), c.read(this, t, !1, 23, 4);
  }, a.prototype.readDoubleLE = function(t, n) {
    return t = t >>> 0, n || R(t, 8, this.length), c.read(this, t, !0, 52, 8);
  }, a.prototype.readDoubleBE = function(t, n) {
    return t = t >>> 0, n || R(t, 8, this.length), c.read(this, t, !1, 52, 8);
  };
  function $(u, t, n, f, w, b) {
    if (!a.isBuffer(u)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (t > w || t < b) throw new RangeError('"value" argument is out of bounds');
    if (n + f > u.length) throw new RangeError("Index out of range");
  }
  a.prototype.writeUintLE = a.prototype.writeUIntLE = function(t, n, f, w) {
    if (t = +t, n = n >>> 0, f = f >>> 0, !w) {
      var b = Math.pow(2, 8 * f) - 1;
      $(this, t, n, f, b, 0);
    }
    var B = 1, _ = 0;
    for (this[n] = t & 255; ++_ < f && (B *= 256); )
      this[n + _] = t / B & 255;
    return n + f;
  }, a.prototype.writeUintBE = a.prototype.writeUIntBE = function(t, n, f, w) {
    if (t = +t, n = n >>> 0, f = f >>> 0, !w) {
      var b = Math.pow(2, 8 * f) - 1;
      $(this, t, n, f, b, 0);
    }
    var B = f - 1, _ = 1;
    for (this[n + B] = t & 255; --B >= 0 && (_ *= 256); )
      this[n + B] = t / _ & 255;
    return n + f;
  }, a.prototype.writeUint8 = a.prototype.writeUInt8 = function(t, n, f) {
    return t = +t, n = n >>> 0, f || $(this, t, n, 1, 255, 0), this[n] = t & 255, n + 1;
  }, a.prototype.writeUint16LE = a.prototype.writeUInt16LE = function(t, n, f) {
    return t = +t, n = n >>> 0, f || $(this, t, n, 2, 65535, 0), this[n] = t & 255, this[n + 1] = t >>> 8, n + 2;
  }, a.prototype.writeUint16BE = a.prototype.writeUInt16BE = function(t, n, f) {
    return t = +t, n = n >>> 0, f || $(this, t, n, 2, 65535, 0), this[n] = t >>> 8, this[n + 1] = t & 255, n + 2;
  }, a.prototype.writeUint32LE = a.prototype.writeUInt32LE = function(t, n, f) {
    return t = +t, n = n >>> 0, f || $(this, t, n, 4, 4294967295, 0), this[n + 3] = t >>> 24, this[n + 2] = t >>> 16, this[n + 1] = t >>> 8, this[n] = t & 255, n + 4;
  }, a.prototype.writeUint32BE = a.prototype.writeUInt32BE = function(t, n, f) {
    return t = +t, n = n >>> 0, f || $(this, t, n, 4, 4294967295, 0), this[n] = t >>> 24, this[n + 1] = t >>> 16, this[n + 2] = t >>> 8, this[n + 3] = t & 255, n + 4;
  }, a.prototype.writeIntLE = function(t, n, f, w) {
    if (t = +t, n = n >>> 0, !w) {
      var b = Math.pow(2, 8 * f - 1);
      $(this, t, n, f, b - 1, -b);
    }
    var B = 0, _ = 1, G = 0;
    for (this[n] = t & 255; ++B < f && (_ *= 256); )
      t < 0 && G === 0 && this[n + B - 1] !== 0 && (G = 1), this[n + B] = (t / _ >> 0) - G & 255;
    return n + f;
  }, a.prototype.writeIntBE = function(t, n, f, w) {
    if (t = +t, n = n >>> 0, !w) {
      var b = Math.pow(2, 8 * f - 1);
      $(this, t, n, f, b - 1, -b);
    }
    var B = f - 1, _ = 1, G = 0;
    for (this[n + B] = t & 255; --B >= 0 && (_ *= 256); )
      t < 0 && G === 0 && this[n + B + 1] !== 0 && (G = 1), this[n + B] = (t / _ >> 0) - G & 255;
    return n + f;
  }, a.prototype.writeInt8 = function(t, n, f) {
    return t = +t, n = n >>> 0, f || $(this, t, n, 1, 127, -128), t < 0 && (t = 255 + t + 1), this[n] = t & 255, n + 1;
  }, a.prototype.writeInt16LE = function(t, n, f) {
    return t = +t, n = n >>> 0, f || $(this, t, n, 2, 32767, -32768), this[n] = t & 255, this[n + 1] = t >>> 8, n + 2;
  }, a.prototype.writeInt16BE = function(t, n, f) {
    return t = +t, n = n >>> 0, f || $(this, t, n, 2, 32767, -32768), this[n] = t >>> 8, this[n + 1] = t & 255, n + 2;
  }, a.prototype.writeInt32LE = function(t, n, f) {
    return t = +t, n = n >>> 0, f || $(this, t, n, 4, 2147483647, -2147483648), this[n] = t & 255, this[n + 1] = t >>> 8, this[n + 2] = t >>> 16, this[n + 3] = t >>> 24, n + 4;
  }, a.prototype.writeInt32BE = function(t, n, f) {
    return t = +t, n = n >>> 0, f || $(this, t, n, 4, 2147483647, -2147483648), t < 0 && (t = 4294967295 + t + 1), this[n] = t >>> 24, this[n + 1] = t >>> 16, this[n + 2] = t >>> 8, this[n + 3] = t & 255, n + 4;
  };
  function Ce(u, t, n, f, w, b) {
    if (n + f > u.length) throw new RangeError("Index out of range");
    if (n < 0) throw new RangeError("Index out of range");
  }
  function ve(u, t, n, f, w) {
    return t = +t, n = n >>> 0, w || Ce(u, t, n, 4), c.write(u, t, n, f, 23, 4), n + 4;
  }
  a.prototype.writeFloatLE = function(t, n, f) {
    return ve(this, t, n, !0, f);
  }, a.prototype.writeFloatBE = function(t, n, f) {
    return ve(this, t, n, !1, f);
  };
  function _e(u, t, n, f, w) {
    return t = +t, n = n >>> 0, w || Ce(u, t, n, 8), c.write(u, t, n, f, 52, 8), n + 8;
  }
  a.prototype.writeDoubleLE = function(t, n, f) {
    return _e(this, t, n, !0, f);
  }, a.prototype.writeDoubleBE = function(t, n, f) {
    return _e(this, t, n, !1, f);
  }, a.prototype.copy = function(t, n, f, w) {
    if (!a.isBuffer(t)) throw new TypeError("argument should be a Buffer");
    if (f || (f = 0), !w && w !== 0 && (w = this.length), n >= t.length && (n = t.length), n || (n = 0), w > 0 && w < f && (w = f), w === f || t.length === 0 || this.length === 0) return 0;
    if (n < 0)
      throw new RangeError("targetStart out of bounds");
    if (f < 0 || f >= this.length) throw new RangeError("Index out of range");
    if (w < 0) throw new RangeError("sourceEnd out of bounds");
    w > this.length && (w = this.length), t.length - n < w - f && (w = t.length - n + f);
    var b = w - f;
    return this === t && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(n, f, w) : Uint8Array.prototype.set.call(
      t,
      this.subarray(f, w),
      n
    ), b;
  }, a.prototype.fill = function(t, n, f, w) {
    if (typeof t == "string") {
      if (typeof n == "string" ? (w = n, n = 0, f = this.length) : typeof f == "string" && (w = f, f = this.length), w !== void 0 && typeof w != "string")
        throw new TypeError("encoding must be a string");
      if (typeof w == "string" && !a.isEncoding(w))
        throw new TypeError("Unknown encoding: " + w);
      if (t.length === 1) {
        var b = t.charCodeAt(0);
        (w === "utf8" && b < 128 || w === "latin1") && (t = b);
      }
    } else typeof t == "number" ? t = t & 255 : typeof t == "boolean" && (t = Number(t));
    if (n < 0 || this.length < n || this.length < f)
      throw new RangeError("Out of range index");
    if (f <= n)
      return this;
    n = n >>> 0, f = f === void 0 ? this.length : f >>> 0, t || (t = 0);
    var B;
    if (typeof t == "number")
      for (B = n; B < f; ++B)
        this[B] = t;
    else {
      var _ = a.isBuffer(t) ? t : a.from(t, w), G = _.length;
      if (G === 0)
        throw new TypeError('The value "' + t + '" is invalid for argument "value"');
      for (B = 0; B < f - n; ++B)
        this[B + n] = _[B % G];
    }
    return this;
  };
  var Oe = /[^+/0-9A-Za-z-_]/g;
  function $e(u) {
    if (u = u.split("=")[0], u = u.trim().replace(Oe, ""), u.length < 2) return "";
    for (; u.length % 4 !== 0; )
      u = u + "=";
    return u;
  }
  function fe(u, t) {
    t = t || 1 / 0;
    for (var n, f = u.length, w = null, b = [], B = 0; B < f; ++B) {
      if (n = u.charCodeAt(B), n > 55295 && n < 57344) {
        if (!w) {
          if (n > 56319) {
            (t -= 3) > -1 && b.push(239, 191, 189);
            continue;
          } else if (B + 1 === f) {
            (t -= 3) > -1 && b.push(239, 191, 189);
            continue;
          }
          w = n;
          continue;
        }
        if (n < 56320) {
          (t -= 3) > -1 && b.push(239, 191, 189), w = n;
          continue;
        }
        n = (w - 55296 << 10 | n - 56320) + 65536;
      } else w && (t -= 3) > -1 && b.push(239, 191, 189);
      if (w = null, n < 128) {
        if ((t -= 1) < 0) break;
        b.push(n);
      } else if (n < 2048) {
        if ((t -= 2) < 0) break;
        b.push(
          n >> 6 | 192,
          n & 63 | 128
        );
      } else if (n < 65536) {
        if ((t -= 3) < 0) break;
        b.push(
          n >> 12 | 224,
          n >> 6 & 63 | 128,
          n & 63 | 128
        );
      } else if (n < 1114112) {
        if ((t -= 4) < 0) break;
        b.push(
          n >> 18 | 240,
          n >> 12 & 63 | 128,
          n >> 6 & 63 | 128,
          n & 63 | 128
        );
      } else
        throw new Error("Invalid code point");
    }
    return b;
  }
  function Le(u) {
    for (var t = [], n = 0; n < u.length; ++n)
      t.push(u.charCodeAt(n) & 255);
    return t;
  }
  function Ge(u, t) {
    for (var n, f, w, b = [], B = 0; B < u.length && !((t -= 2) < 0); ++B)
      n = u.charCodeAt(B), f = n >> 8, w = n % 256, b.push(w), b.push(f);
    return b;
  }
  function qe(u) {
    return o.toByteArray($e(u));
  }
  function we(u, t, n, f) {
    for (var w = 0; w < f && !(w + n >= t.length || w >= u.length); ++w)
      t[w + n] = u[w];
    return w;
  }
  function Q(u, t) {
    return u instanceof t || u != null && u.constructor != null && u.constructor.name != null && u.constructor.name === t.name;
  }
  function pe(u) {
    return u !== u;
  }
  var Xe = function() {
    for (var u = "0123456789abcdef", t = new Array(256), n = 0; n < 16; ++n)
      for (var f = n * 16, w = 0; w < 16; ++w)
        t[f + w] = u[n] + u[w];
    return t;
  }();
})(ye);
const St = ye.Buffer.from && ye.Buffer.alloc && ye.Buffer.allocUnsafe && ye.Buffer.allocUnsafeSlow ? ye.Buffer.from : (
  // support for Node < 5.10
  (h) => new ye.Buffer(h)
);
function Tt(h, o) {
  const c = (l, p) => o(l, p) >>> 0;
  return c.signed = o, c.unsigned = c, c.model = h, c;
}
let ir = [
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
typeof Int32Array < "u" && (ir = new Int32Array(ir));
const Rt = Tt("crc-32", function(h, o) {
  ye.Buffer.isBuffer(h) || (h = St(h));
  let c = o === 0 ? 0 : ~~o ^ -1;
  for (let l = 0; l < h.length; l++) {
    const p = h[l];
    c = ir[(c ^ p) & 255] ^ c >>> 8;
  }
  return c ^ -1;
}), Ct = new TextEncoder();
function vt(h = /* @__PURE__ */ new Date()) {
  const o = h.getFullYear() - 1980 << 9, c = h.getMonth() + 1 << 5, l = h.getDate(), p = o | c | l, y = h.getHours() << 11, x = h.getMinutes() << 5, a = Math.floor(h.getSeconds() / 2), A = y | x | a;
  return { date: p, time: A };
}
class _t {
  constructor(o) {
    this.name = Ct.encode(o.name), this.size = o.size, this.bytesRead = 0, this.crc = null, this.dateTime = vt();
  }
  get header() {
    const o = new ArrayBuffer(30 + this.name.byteLength), c = new DataView(o);
    c.setUint32(0, 67324752, !0), c.setUint16(4, 20, !0), c.setUint16(6, 2056, !0), c.setUint16(8, 0, !0), c.setUint16(10, this.dateTime.time, !0), c.setUint16(12, this.dateTime.date, !0), c.setUint32(14, 0, !0), c.setUint32(18, 0, !0), c.setUint32(22, 0, !0), c.setUint16(26, this.name.byteLength, !0), c.setUint16(28, 0, !0);
    for (let l = 0; l < this.name.byteLength; l++)
      c.setUint8(30 + l, this.name[l]);
    return new Uint8Array(o);
  }
  get dataDescriptor() {
    const o = new ArrayBuffer(16), c = new DataView(o);
    return c.setUint32(0, 134695760, !0), c.setUint32(4, this.crc, !0), c.setUint32(8, this.size, !0), c.setUint32(12, this.size, !0), new Uint8Array(o);
  }
  directoryRecord(o) {
    const c = new ArrayBuffer(46 + this.name.byteLength), l = new DataView(c);
    l.setUint32(0, 33639248, !0), l.setUint16(4, 20, !0), l.setUint16(6, 20, !0), l.setUint16(8, 2056, !0), l.setUint16(10, 0, !0), l.setUint16(12, this.dateTime.time, !0), l.setUint16(14, this.dateTime.date, !0), l.setUint32(16, this.crc, !0), l.setUint32(20, this.size, !0), l.setUint32(24, this.size, !0), l.setUint16(28, this.name.byteLength, !0), l.setUint16(30, 0, !0), l.setUint16(32, 0, !0), l.setUint16(34, 0, !0), l.setUint16(36, 0, !0), l.setUint32(38, 0, !0), l.setUint32(42, o, !0);
    for (let p = 0; p < this.name.byteLength; p++)
      l.setUint8(46 + p, this.name[p]);
    return new Uint8Array(c);
  }
  get byteLength() {
    return this.size + this.name.byteLength + 30 + 16;
  }
  append(o, c) {
    this.bytesRead += o.byteLength;
    const l = o.byteLength - Math.max(this.bytesRead - this.size, 0), p = o.slice(0, l);
    if (this.crc = Rt(p, this.crc), c.enqueue(p), l < o.byteLength)
      return o.slice(l, o.byteLength);
  }
}
function Lt(h, o) {
  let c = 0, l = 0;
  for (let p = 0; p < h.length; p++) {
    const y = h[p], x = y.directoryRecord(c);
    c += y.byteLength, o.enqueue(x), l += x.byteLength;
  }
  o.enqueue(Mt(h.length, l, c));
}
function Mt(h, o, c) {
  const l = new ArrayBuffer(22), p = new DataView(l);
  return p.setUint32(0, 101010256, !0), p.setUint16(4, 0, !0), p.setUint16(6, 0, !0), p.setUint16(8, h, !0), p.setUint16(10, h, !0), p.setUint32(12, o, !0), p.setUint32(16, c, !0), p.setUint16(20, 0, !0), new Uint8Array(l);
}
class Dt {
  constructor(o, c) {
    this.files = o, this.fileIndex = 0, this.file = null, this.reader = c.getReader(), this.nextFile(), this.extra = null;
  }
  nextFile() {
    this.file = this.files[this.fileIndex++];
  }
  async pull(o) {
    if (!this.file)
      return Lt(this.files, o), o.close();
    if (this.file.bytesRead === 0 && (o.enqueue(this.file.header), this.extra && (this.extra = this.file.append(this.extra, o))), this.file.bytesRead >= this.file.size)
      return o.enqueue(this.file.dataDescriptor), this.nextFile(), this.pull(o);
    const c = await this.reader.read();
    if (c.done)
      return this.nextFile(), this.pull(o);
    this.extra = this.file.append(c.value, o);
  }
}
class Nt {
  constructor(o, c) {
    this.files = o.files.map((l) => new _t(l)), this.source = c;
  }
  get stream() {
    return new ReadableStream(new Dt(this.files, this.source));
  }
  get size() {
    return this.files.reduce(
      (l, p) => l + p.byteLength * 2 - p.size,
      0
    ) + 22;
  }
}
var ur = { exports: {} }, or = { exports: {} };
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
(function(h, o) {
  var c = J, l = c.Buffer;
  function p(x, a) {
    for (var A in x)
      a[A] = x[A];
  }
  l.from && l.alloc && l.allocUnsafe && l.allocUnsafeSlow ? h.exports = c : (p(c, o), o.Buffer = y);
  function y(x, a, A) {
    return l(x, a, A);
  }
  y.prototype = Object.create(l.prototype), p(l, y), y.from = function(x, a, A) {
    if (typeof x == "number")
      throw new TypeError("Argument must not be a number");
    return l(x, a, A);
  }, y.alloc = function(x, a, A) {
    if (typeof x != "number")
      throw new TypeError("Argument must be a number");
    var E = l(x);
    return a !== void 0 ? typeof A == "string" ? E.fill(a, A) : E.fill(a) : E.fill(0), E;
  }, y.allocUnsafe = function(x) {
    if (typeof x != "number")
      throw new TypeError("Argument must be a number");
    return l(x);
  }, y.allocUnsafeSlow = function(x) {
    if (typeof x != "number")
      throw new TypeError("Argument must be a number");
    return c.SlowBuffer(x);
  };
})(or, or.exports);
var kt = or.exports;
/*!
 * content-disposition
 * Copyright(c) 2014-2017 Douglas Christopher Wilson
 * MIT Licensed
 */
ur.exports = Wt;
ur.exports.parse = Qt;
var wr = rr.basename, Pt = kt.Buffer, Ot = /[\x00-\x20"'()*,/:;<=>?@[\\\]{}\x7f]/g, $t = /%[0-9A-Fa-f]{2}/, Gt = /%([0-9A-Fa-f]{2})/g, Ir = /[^\x20-\x7e\xa0-\xff]/g, qt = /\\([\u0000-\u007f])/g, Kt = /([\\"])/g, mr = /;[\x09\x20]*([!#$%&'*+.0-9A-Z^_`a-z|~-]+)[\x09\x20]*=[\x09\x20]*("(?:[\x20!\x23-\x5b\x5d-\x7e\x80-\xff]|\\[\x20-\x7e])*"|[!#$%&'*+.0-9A-Z^_`a-z|~-]+)[\x09\x20]*/g, zt = /^[\x20-\x7e\x80-\xff]+$/, Ht = /^[!#$%&'*+.0-9A-Z^_`a-z|~-]+$/, Vt = /^([A-Za-z0-9!#$%&+\-^_`{}~]+)'(?:[A-Za-z]{2,3}(?:-[A-Za-z]{3}){0,3}|[A-Za-z]{4,8}|)'((?:%[0-9A-Fa-f]{2}|[A-Za-z0-9!#$&+.^_`|~-])+)$/, jt = /^([!#$%&'*+.0-9A-Z^_`a-z|~-]+)[\x09\x20]*(?:$|;)/;
function Wt(h, o) {
  var c = o || {}, l = c.type || "attachment", p = Xt(h, c.fallback);
  return Yt(new Tr(l, p));
}
function Xt(h, o) {
  if (h !== void 0) {
    var c = {};
    if (typeof h != "string")
      throw new TypeError("filename must be a string");
    if (o === void 0 && (o = !0), typeof o != "string" && typeof o != "boolean")
      throw new TypeError("fallback must be a string or boolean");
    if (typeof o == "string" && Ir.test(o))
      throw new TypeError("fallback must be ISO-8859-1 string");
    var l = wr(h), p = zt.test(l), y = typeof o != "string" ? o && Sr(l) : wr(o), x = typeof y == "string" && y !== l;
    return (x || !p || $t.test(l)) && (c["filename*"] = l), (p || x) && (c.filename = x ? y : l), c;
  }
}
function Yt(h) {
  var o = h.parameters, c = h.type;
  if (!c || typeof c != "string" || !Ht.test(c))
    throw new TypeError("invalid type");
  var l = String(c).toLowerCase();
  if (o && typeof o == "object")
    for (var p, y = Object.keys(o).sort(), x = 0; x < y.length; x++) {
      p = y[x];
      var a = p.substr(-1) === "*" ? tn(o[p]) : rn(o[p]);
      l += "; " + p + "=" + a;
    }
  return l;
}
function Zt(h) {
  var o = Vt.exec(h);
  if (!o)
    throw new TypeError("invalid extended field value");
  var c = o[1].toLowerCase(), l = o[2], p, y = l.replace(Gt, Jt);
  switch (c) {
    case "iso-8859-1":
      p = Sr(y);
      break;
    case "utf-8":
      p = Pt.from(y, "binary").toString("utf8");
      break;
    default:
      throw new TypeError("unsupported charset in extended field");
  }
  return p;
}
function Sr(h) {
  return String(h).replace(Ir, "?");
}
function Qt(h) {
  if (!h || typeof h != "string")
    throw new TypeError("argument string is required");
  var o = jt.exec(h);
  if (!o)
    throw new TypeError("invalid type format");
  var c = o[0].length, l = o[1].toLowerCase(), p, y = [], x = {}, a;
  for (c = mr.lastIndex = o[0].substr(-1) === ";" ? c - 1 : c; o = mr.exec(h); ) {
    if (o.index !== c)
      throw new TypeError("invalid parameter format");
    if (c += o[0].length, p = o[1].toLowerCase(), a = o[2], y.indexOf(p) !== -1)
      throw new TypeError("invalid duplicate parameter");
    if (y.push(p), p.indexOf("*") + 1 === p.length) {
      p = p.slice(0, -1), a = Zt(a), x[p] = a;
      continue;
    }
    typeof x[p] != "string" && (a[0] === '"' && (a = a.substr(1, a.length - 2).replace(qt, "$1")), x[p] = a);
  }
  if (c !== -1 && c !== h.length)
    throw new TypeError("invalid parameter format");
  return new Tr(l, x);
}
function Jt(h, o) {
  return String.fromCharCode(parseInt(o, 16));
}
function en(h) {
  return "%" + String(h).charCodeAt(0).toString(16).toUpperCase();
}
function rn(h) {
  var o = String(h);
  return '"' + o.replace(Kt, "\\$1") + '"';
}
function tn(h) {
  var o = String(h), c = encodeURIComponent(o).replace(Ot, en);
  return "UTF-8''" + c;
}
function Tr(h, o) {
  this.type = h, this.parameters = o;
}
var nn = ur.exports;
const on = /* @__PURE__ */ gr(nn);
let Rr = !1;
const Ee = /* @__PURE__ */ new Map(), an = /.*\.(png|svg|jpg)$/, un = /\.[A-Fa-f0-9]{8}\.(js|css|png|svg|jpg)(#\w+)?$/, sn = /\/api\/download\/([A-Fa-f0-9]{4,})/, fn = /\.woff2?$/;
self.addEventListener("install", () => {
  self.skipWaiting();
});
self.addEventListener("activate", (h) => {
  h.waitUntil(self.clients.claim().then(hn));
});
async function cn(h) {
  const o = Ee.get(h);
  if (!o)
    return new Response(null, { status: 400 });
  try {
    let c = o.size, l = o.type;
    const p = new bt(o.key, o.nonce);
    o.requiresPassword && p.setPassword(o.password, o.url), o.download = It(h, p);
    const y = await o.download.result, x = p.decryptStream(y);
    let a = null;
    if (o.type === "send-archive") {
      const F = new Nt(o.manifest, x);
      a = F.stream, l = "application/zip", c = F.size;
    }
    const A = Pe(
      a || x,
      {
        transform(F, U) {
          o.progress += F.length, U.enqueue(F);
        }
      },
      function() {
        o.download.cancel(), Ee.delete(h);
      }
    ), E = {
      "Content-Disposition": on(o.filename),
      "Content-Type": l,
      "Content-Length": c
    };
    return new Response(A, { headers: E });
  } catch (c) {
    return Rr ? new Response(null, { status: c.message }) : new Response(null, {
      status: 302,
      headers: {
        Location: `/download/${h}/#${o.key}`
      }
    });
  }
}
async function hn() {
  try {
    await ln();
    const h = await caches.open(ar), o = Pr.match(an);
    await h.addAll(o);
  } catch (h) {
    console.error(h);
  }
}
async function ln() {
  const h = await caches.keys();
  for (const o of h)
    o !== ar && await caches.delete(o);
}
function Cr(h) {
  return un.test(h) || fn.test(h);
}
async function pn(h) {
  const o = await caches.open(ar), c = await o.match(h);
  if (c)
    return c;
  const l = await fetch(h);
  return l.ok && Cr(h.url) && o.put(h, l.clone()), l;
}
self.onfetch = (h) => {
  const o = h.request;
  if (o.method !== "GET") return;
  const c = new URL(o.url), l = sn.exec(c.pathname);
  l ? h.respondWith(cn(l[1])) : Cr(c.pathname) && h.respondWith(pn(o));
};
self.onmessage = (h) => {
  if (h.data.request === "init") {
    Rr = h.data.noSave;
    const o = {
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
    Ee.set(h.data.id, o), h.ports[0].postMessage("file info received");
  } else if (h.data.request === "progress") {
    const o = Ee.get(h.data.id);
    o ? (o.progress === o.size && Ee.delete(h.data.id), h.ports[0].postMessage({ progress: o.progress })) : h.ports[0].postMessage({ error: "cancelled" });
  } else if (h.data.request === "cancel") {
    const o = Ee.get(h.data.id);
    o && (o.download && o.download.cancel(), Ee.delete(h.data.id)), h.ports[0].postMessage("download cancelled");
  }
};
//# sourceMappingURL=serviceWorker.js.map
