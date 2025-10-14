var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value2) => __defProp(target, "name", { value: value2, configurable: true });
var __commonJS = (cb, mod2) => function __require() {
  return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
};
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from3, except, desc) => {
  if (from3 && typeof from3 === "object" || typeof from3 === "function") {
    for (let key of __getOwnPropNames(from3))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from3[key], enumerable: !(desc = __getOwnPropDesc(from3, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target,
  mod2
));

// node_modules/netmask/lib/netmask.js
var require_netmask = __commonJS({
  "node_modules/netmask/lib/netmask.js"(exports) {
    (function() {
      var Netmask2, atob, chr, chr0, chrA, chra, ip2long, long2ip;
      long2ip = /* @__PURE__ */ __name(function(long) {
        var a, b, c, d;
        a = (long & 255 << 24) >>> 24;
        b = (long & 255 << 16) >>> 16;
        c = (long & 255 << 8) >>> 8;
        d = long & 255;
        return [a, b, c, d].join(".");
      }, "long2ip");
      ip2long = /* @__PURE__ */ __name(function(ip) {
        var b, c, i, j, n, ref;
        b = [];
        for (i = j = 0; j <= 3; i = ++j) {
          if (ip.length === 0) {
            break;
          }
          if (i > 0) {
            if (ip[0] !== ".") {
              throw new Error("Invalid IP");
            }
            ip = ip.substring(1);
          }
          ref = atob(ip), n = ref[0], c = ref[1];
          ip = ip.substring(c);
          b.push(n);
        }
        if (ip.length !== 0) {
          throw new Error("Invalid IP");
        }
        switch (b.length) {
          case 1:
            if (b[0] > 4294967295) {
              throw new Error("Invalid IP");
            }
            return b[0] >>> 0;
          case 2:
            if (b[0] > 255 || b[1] > 16777215) {
              throw new Error("Invalid IP");
            }
            return (b[0] << 24 | b[1]) >>> 0;
          case 3:
            if (b[0] > 255 || b[1] > 255 || b[2] > 65535) {
              throw new Error("Invalid IP");
            }
            return (b[0] << 24 | b[1] << 16 | b[2]) >>> 0;
          case 4:
            if (b[0] > 255 || b[1] > 255 || b[2] > 255 || b[3] > 255) {
              throw new Error("Invalid IP");
            }
            return (b[0] << 24 | b[1] << 16 | b[2] << 8 | b[3]) >>> 0;
          default:
            throw new Error("Invalid IP");
        }
      }, "ip2long");
      chr = /* @__PURE__ */ __name(function(b) {
        return b.charCodeAt(0);
      }, "chr");
      chr0 = chr("0");
      chra = chr("a");
      chrA = chr("A");
      atob = /* @__PURE__ */ __name(function(s) {
        var base3, dmax, i, n, start;
        n = 0;
        base3 = 10;
        dmax = "9";
        i = 0;
        if (s.length > 1 && s[i] === "0") {
          if (s[i + 1] === "x" || s[i + 1] === "X") {
            i += 2;
            base3 = 16;
          } else if ("0" <= s[i + 1] && s[i + 1] <= "9") {
            i++;
            base3 = 8;
            dmax = "7";
          }
        }
        start = i;
        while (i < s.length) {
          if ("0" <= s[i] && s[i] <= dmax) {
            n = n * base3 + (chr(s[i]) - chr0) >>> 0;
          } else if (base3 === 16) {
            if ("a" <= s[i] && s[i] <= "f") {
              n = n * base3 + (10 + chr(s[i]) - chra) >>> 0;
            } else if ("A" <= s[i] && s[i] <= "F") {
              n = n * base3 + (10 + chr(s[i]) - chrA) >>> 0;
            } else {
              break;
            }
          } else {
            break;
          }
          if (n > 4294967295) {
            throw new Error("too large");
          }
          i++;
        }
        if (i === start) {
          throw new Error("empty octet");
        }
        return [n, i];
      }, "atob");
      Netmask2 = (function() {
        function Netmask3(net, mask) {
          var error, i, j, ref;
          if (typeof net !== "string") {
            throw new Error("Missing `net' parameter");
          }
          if (!mask) {
            ref = net.split("/", 2), net = ref[0], mask = ref[1];
          }
          if (!mask) {
            mask = 32;
          }
          if (typeof mask === "string" && mask.indexOf(".") > -1) {
            try {
              this.maskLong = ip2long(mask);
            } catch (error1) {
              error = error1;
              throw new Error("Invalid mask: " + mask);
            }
            for (i = j = 32; j >= 0; i = --j) {
              if (this.maskLong === 4294967295 << 32 - i >>> 0) {
                this.bitmask = i;
                break;
              }
            }
          } else if (mask || mask === 0) {
            this.bitmask = parseInt(mask, 10);
            this.maskLong = 0;
            if (this.bitmask > 0) {
              this.maskLong = 4294967295 << 32 - this.bitmask >>> 0;
            }
          } else {
            throw new Error("Invalid mask: empty");
          }
          try {
            this.netLong = (ip2long(net) & this.maskLong) >>> 0;
          } catch (error1) {
            error = error1;
            throw new Error("Invalid net address: " + net);
          }
          if (!(this.bitmask <= 32)) {
            throw new Error("Invalid mask for ip4: " + mask);
          }
          this.size = Math.pow(2, 32 - this.bitmask);
          this.base = long2ip(this.netLong);
          this.mask = long2ip(this.maskLong);
          this.hostmask = long2ip(~this.maskLong);
          this.first = this.bitmask <= 30 ? long2ip(this.netLong + 1) : this.base;
          this.last = this.bitmask <= 30 ? long2ip(this.netLong + this.size - 2) : long2ip(this.netLong + this.size - 1);
          this.broadcast = this.bitmask <= 30 ? long2ip(this.netLong + this.size - 1) : void 0;
        }
        __name(Netmask3, "Netmask");
        Netmask3.prototype.contains = function(ip) {
          if (typeof ip === "string" && (ip.indexOf("/") > 0 || ip.split(".").length !== 4)) {
            ip = new Netmask3(ip);
          }
          if (ip instanceof Netmask3) {
            return this.contains(ip.base) && this.contains(ip.broadcast || ip.last);
          } else {
            return (ip2long(ip) & this.maskLong) >>> 0 === (this.netLong & this.maskLong) >>> 0;
          }
        };
        Netmask3.prototype.next = function(count) {
          if (count == null) {
            count = 1;
          }
          return new Netmask3(long2ip(this.netLong + this.size * count), this.mask);
        };
        Netmask3.prototype.forEach = function(fn) {
          var index, lastLong, long;
          long = ip2long(this.first);
          lastLong = ip2long(this.last);
          index = 0;
          while (long <= lastLong) {
            fn(long2ip(long), long, index);
            index++;
            long++;
          }
        };
        Netmask3.prototype.toString = function() {
          return this.base + "/" + this.bitmask;
        };
        return Netmask3;
      })();
      exports.ip2long = ip2long;
      exports.long2ip = long2ip;
      exports.Netmask = Netmask2;
    }).call(exports);
  }
});

// node_modules/@libp2p/identify/node_modules/@libp2p/interface/dist/src/errors.js
var InvalidMessageError = class extends Error {
  static name = "InvalidMessageError";
  constructor(message2 = "Invalid message") {
    super(message2);
    this.name = "InvalidMessageError";
  }
};

// node_modules/main-event/dist/src/events.browser.js
function setMaxListeners() {
}
__name(setMaxListeners, "setMaxListeners");

// node_modules/@libp2p/identify/node_modules/@libp2p/interface/dist/src/index.js
var serviceCapabilities = Symbol.for("@libp2p/service-capabilities");
var serviceDependencies = Symbol.for("@libp2p/service-dependencies");

// node_modules/@libp2p/crypto/node_modules/@libp2p/interface/dist/src/errors.js
var InvalidParametersError = class extends Error {
  static name = "InvalidParametersError";
  constructor(message2 = "Invalid parameters") {
    super(message2);
    this.name = "InvalidParametersError";
  }
};
var InvalidPublicKeyError = class extends Error {
  static name = "InvalidPublicKeyError";
  constructor(message2 = "Invalid public key") {
    super(message2);
    this.name = "InvalidPublicKeyError";
  }
};
var UnsupportedKeyTypeError = class extends Error {
  static name = "UnsupportedKeyTypeError";
  constructor(message2 = "Unsupported key type") {
    super(message2);
    this.name = "UnsupportedKeyTypeError";
  }
};

// node_modules/multiformats/dist/src/bases/base58.js
var base58_exports = {};
__export(base58_exports, {
  base58btc: () => base58btc,
  base58flickr: () => base58flickr
});

// node_modules/multiformats/dist/src/bytes.js
var empty = new Uint8Array(0);
function equals(aa, bb) {
  if (aa === bb) {
    return true;
  }
  if (aa.byteLength !== bb.byteLength) {
    return false;
  }
  for (let ii = 0; ii < aa.byteLength; ii++) {
    if (aa[ii] !== bb[ii]) {
      return false;
    }
  }
  return true;
}
__name(equals, "equals");
function coerce(o) {
  if (o instanceof Uint8Array && o.constructor.name === "Uint8Array") {
    return o;
  }
  if (o instanceof ArrayBuffer) {
    return new Uint8Array(o);
  }
  if (ArrayBuffer.isView(o)) {
    return new Uint8Array(o.buffer, o.byteOffset, o.byteLength);
  }
  throw new Error("Unknown type, must be binary type");
}
__name(coerce, "coerce");
function fromString(str) {
  return new TextEncoder().encode(str);
}
__name(fromString, "fromString");
function toString(b) {
  return new TextDecoder().decode(b);
}
__name(toString, "toString");

// node_modules/multiformats/dist/src/vendor/base-x.js
function base(ALPHABET, name2) {
  if (ALPHABET.length >= 255) {
    throw new TypeError("Alphabet too long");
  }
  var BASE_MAP = new Uint8Array(256);
  for (var j = 0; j < BASE_MAP.length; j++) {
    BASE_MAP[j] = 255;
  }
  for (var i = 0; i < ALPHABET.length; i++) {
    var x = ALPHABET.charAt(i);
    var xc = x.charCodeAt(0);
    if (BASE_MAP[xc] !== 255) {
      throw new TypeError(x + " is ambiguous");
    }
    BASE_MAP[xc] = i;
  }
  var BASE = ALPHABET.length;
  var LEADER = ALPHABET.charAt(0);
  var FACTOR = Math.log(BASE) / Math.log(256);
  var iFACTOR = Math.log(256) / Math.log(BASE);
  function encode6(source) {
    if (source instanceof Uint8Array)
      ;
    else if (ArrayBuffer.isView(source)) {
      source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
    } else if (Array.isArray(source)) {
      source = Uint8Array.from(source);
    }
    if (!(source instanceof Uint8Array)) {
      throw new TypeError("Expected Uint8Array");
    }
    if (source.length === 0) {
      return "";
    }
    var zeroes = 0;
    var length3 = 0;
    var pbegin = 0;
    var pend = source.length;
    while (pbegin !== pend && source[pbegin] === 0) {
      pbegin++;
      zeroes++;
    }
    var size = (pend - pbegin) * iFACTOR + 1 >>> 0;
    var b58 = new Uint8Array(size);
    while (pbegin !== pend) {
      var carry = source[pbegin];
      var i2 = 0;
      for (var it1 = size - 1; (carry !== 0 || i2 < length3) && it1 !== -1; it1--, i2++) {
        carry += 256 * b58[it1] >>> 0;
        b58[it1] = carry % BASE >>> 0;
        carry = carry / BASE >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length3 = i2;
      pbegin++;
    }
    var it2 = size - length3;
    while (it2 !== size && b58[it2] === 0) {
      it2++;
    }
    var str = LEADER.repeat(zeroes);
    for (; it2 < size; ++it2) {
      str += ALPHABET.charAt(b58[it2]);
    }
    return str;
  }
  __name(encode6, "encode");
  function decodeUnsafe(source) {
    if (typeof source !== "string") {
      throw new TypeError("Expected String");
    }
    if (source.length === 0) {
      return new Uint8Array();
    }
    var psz = 0;
    if (source[psz] === " ") {
      return;
    }
    var zeroes = 0;
    var length3 = 0;
    while (source[psz] === LEADER) {
      zeroes++;
      psz++;
    }
    var size = (source.length - psz) * FACTOR + 1 >>> 0;
    var b256 = new Uint8Array(size);
    while (source[psz]) {
      var carry = BASE_MAP[source.charCodeAt(psz)];
      if (carry === 255) {
        return;
      }
      var i2 = 0;
      for (var it3 = size - 1; (carry !== 0 || i2 < length3) && it3 !== -1; it3--, i2++) {
        carry += BASE * b256[it3] >>> 0;
        b256[it3] = carry % 256 >>> 0;
        carry = carry / 256 >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length3 = i2;
      psz++;
    }
    if (source[psz] === " ") {
      return;
    }
    var it4 = size - length3;
    while (it4 !== size && b256[it4] === 0) {
      it4++;
    }
    var vch = new Uint8Array(zeroes + (size - it4));
    var j2 = zeroes;
    while (it4 !== size) {
      vch[j2++] = b256[it4++];
    }
    return vch;
  }
  __name(decodeUnsafe, "decodeUnsafe");
  function decode7(string2) {
    var buffer = decodeUnsafe(string2);
    if (buffer) {
      return buffer;
    }
    throw new Error(`Non-${name2} character`);
  }
  __name(decode7, "decode");
  return {
    encode: encode6,
    decodeUnsafe,
    decode: decode7
  };
}
__name(base, "base");
var src = base;
var _brrp__multiformats_scope_baseX = src;
var base_x_default = _brrp__multiformats_scope_baseX;

// node_modules/multiformats/dist/src/bases/base.js
var Encoder = class {
  static {
    __name(this, "Encoder");
  }
  name;
  prefix;
  baseEncode;
  constructor(name2, prefix, baseEncode) {
    this.name = name2;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
  }
  encode(bytes) {
    if (bytes instanceof Uint8Array) {
      return `${this.prefix}${this.baseEncode(bytes)}`;
    } else {
      throw Error("Unknown type, must be binary type");
    }
  }
};
var Decoder = class {
  static {
    __name(this, "Decoder");
  }
  name;
  prefix;
  baseDecode;
  prefixCodePoint;
  constructor(name2, prefix, baseDecode) {
    this.name = name2;
    this.prefix = prefix;
    const prefixCodePoint = prefix.codePointAt(0);
    if (prefixCodePoint === void 0) {
      throw new Error("Invalid prefix character");
    }
    this.prefixCodePoint = prefixCodePoint;
    this.baseDecode = baseDecode;
  }
  decode(text) {
    if (typeof text === "string") {
      if (text.codePointAt(0) !== this.prefixCodePoint) {
        throw Error(`Unable to decode multibase string ${JSON.stringify(text)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
      }
      return this.baseDecode(text.slice(this.prefix.length));
    } else {
      throw Error("Can only multibase decode strings");
    }
  }
  or(decoder) {
    return or(this, decoder);
  }
};
var ComposedDecoder = class {
  static {
    __name(this, "ComposedDecoder");
  }
  decoders;
  constructor(decoders3) {
    this.decoders = decoders3;
  }
  or(decoder) {
    return or(this, decoder);
  }
  decode(input) {
    const prefix = input[0];
    const decoder = this.decoders[prefix];
    if (decoder != null) {
      return decoder.decode(input);
    } else {
      throw RangeError(`Unable to decode multibase string ${JSON.stringify(input)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
    }
  }
};
function or(left, right) {
  return new ComposedDecoder({
    ...left.decoders ?? { [left.prefix]: left },
    ...right.decoders ?? { [right.prefix]: right }
  });
}
__name(or, "or");
var Codec = class {
  static {
    __name(this, "Codec");
  }
  name;
  prefix;
  baseEncode;
  baseDecode;
  encoder;
  decoder;
  constructor(name2, prefix, baseEncode, baseDecode) {
    this.name = name2;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
    this.baseDecode = baseDecode;
    this.encoder = new Encoder(name2, prefix, baseEncode);
    this.decoder = new Decoder(name2, prefix, baseDecode);
  }
  encode(input) {
    return this.encoder.encode(input);
  }
  decode(input) {
    return this.decoder.decode(input);
  }
};
function from({ name: name2, prefix, encode: encode6, decode: decode7 }) {
  return new Codec(name2, prefix, encode6, decode7);
}
__name(from, "from");
function baseX({ name: name2, prefix, alphabet: alphabet2 }) {
  const { encode: encode6, decode: decode7 } = base_x_default(alphabet2, name2);
  return from({
    prefix,
    name: name2,
    encode: encode6,
    decode: /* @__PURE__ */ __name((text) => coerce(decode7(text)), "decode")
  });
}
__name(baseX, "baseX");
function decode(string2, alphabetIdx, bitsPerChar, name2) {
  let end = string2.length;
  while (string2[end - 1] === "=") {
    --end;
  }
  const out = new Uint8Array(end * bitsPerChar / 8 | 0);
  let bits = 0;
  let buffer = 0;
  let written = 0;
  for (let i = 0; i < end; ++i) {
    const value2 = alphabetIdx[string2[i]];
    if (value2 === void 0) {
      throw new SyntaxError(`Non-${name2} character`);
    }
    buffer = buffer << bitsPerChar | value2;
    bits += bitsPerChar;
    if (bits >= 8) {
      bits -= 8;
      out[written++] = 255 & buffer >> bits;
    }
  }
  if (bits >= bitsPerChar || (255 & buffer << 8 - bits) !== 0) {
    throw new SyntaxError("Unexpected end of data");
  }
  return out;
}
__name(decode, "decode");
function encode(data, alphabet2, bitsPerChar) {
  const pad = alphabet2[alphabet2.length - 1] === "=";
  const mask = (1 << bitsPerChar) - 1;
  let out = "";
  let bits = 0;
  let buffer = 0;
  for (let i = 0; i < data.length; ++i) {
    buffer = buffer << 8 | data[i];
    bits += 8;
    while (bits > bitsPerChar) {
      bits -= bitsPerChar;
      out += alphabet2[mask & buffer >> bits];
    }
  }
  if (bits !== 0) {
    out += alphabet2[mask & buffer << bitsPerChar - bits];
  }
  if (pad) {
    while ((out.length * bitsPerChar & 7) !== 0) {
      out += "=";
    }
  }
  return out;
}
__name(encode, "encode");
function createAlphabetIdx(alphabet2) {
  const alphabetIdx = {};
  for (let i = 0; i < alphabet2.length; ++i) {
    alphabetIdx[alphabet2[i]] = i;
  }
  return alphabetIdx;
}
__name(createAlphabetIdx, "createAlphabetIdx");
function rfc4648({ name: name2, prefix, bitsPerChar, alphabet: alphabet2 }) {
  const alphabetIdx = createAlphabetIdx(alphabet2);
  return from({
    prefix,
    name: name2,
    encode(input) {
      return encode(input, alphabet2, bitsPerChar);
    },
    decode(input) {
      return decode(input, alphabetIdx, bitsPerChar, name2);
    }
  });
}
__name(rfc4648, "rfc4648");

// node_modules/multiformats/dist/src/bases/base58.js
var base58btc = baseX({
  name: "base58btc",
  prefix: "z",
  alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
});
var base58flickr = baseX({
  name: "base58flickr",
  prefix: "Z",
  alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
});

// node_modules/multiformats/dist/src/bases/base32.js
var base32_exports = {};
__export(base32_exports, {
  base32: () => base32,
  base32hex: () => base32hex,
  base32hexpad: () => base32hexpad,
  base32hexpadupper: () => base32hexpadupper,
  base32hexupper: () => base32hexupper,
  base32pad: () => base32pad,
  base32padupper: () => base32padupper,
  base32upper: () => base32upper,
  base32z: () => base32z
});
var base32 = rfc4648({
  prefix: "b",
  name: "base32",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567",
  bitsPerChar: 5
});
var base32upper = rfc4648({
  prefix: "B",
  name: "base32upper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
  bitsPerChar: 5
});
var base32pad = rfc4648({
  prefix: "c",
  name: "base32pad",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
  bitsPerChar: 5
});
var base32padupper = rfc4648({
  prefix: "C",
  name: "base32padupper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
  bitsPerChar: 5
});
var base32hex = rfc4648({
  prefix: "v",
  name: "base32hex",
  alphabet: "0123456789abcdefghijklmnopqrstuv",
  bitsPerChar: 5
});
var base32hexupper = rfc4648({
  prefix: "V",
  name: "base32hexupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
  bitsPerChar: 5
});
var base32hexpad = rfc4648({
  prefix: "t",
  name: "base32hexpad",
  alphabet: "0123456789abcdefghijklmnopqrstuv=",
  bitsPerChar: 5
});
var base32hexpadupper = rfc4648({
  prefix: "T",
  name: "base32hexpadupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
  bitsPerChar: 5
});
var base32z = rfc4648({
  prefix: "h",
  name: "base32z",
  alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
  bitsPerChar: 5
});

// node_modules/multiformats/dist/src/bases/base36.js
var base36_exports = {};
__export(base36_exports, {
  base36: () => base36,
  base36upper: () => base36upper
});
var base36 = baseX({
  prefix: "k",
  name: "base36",
  alphabet: "0123456789abcdefghijklmnopqrstuvwxyz"
});
var base36upper = baseX({
  prefix: "K",
  name: "base36upper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
});

// node_modules/multiformats/dist/src/vendor/varint.js
var encode_1 = encode2;
var MSB = 128;
var REST = 127;
var MSBALL = ~REST;
var INT = Math.pow(2, 31);
function encode2(num, out, offset) {
  out = out || [];
  offset = offset || 0;
  var oldOffset = offset;
  while (num >= INT) {
    out[offset++] = num & 255 | MSB;
    num /= 128;
  }
  while (num & MSBALL) {
    out[offset++] = num & 255 | MSB;
    num >>>= 7;
  }
  out[offset] = num | 0;
  encode2.bytes = offset - oldOffset + 1;
  return out;
}
__name(encode2, "encode");
var decode2 = read;
var MSB$1 = 128;
var REST$1 = 127;
function read(buf, offset) {
  var res = 0, offset = offset || 0, shift = 0, counter = offset, b, l = buf.length;
  do {
    if (counter >= l) {
      read.bytes = 0;
      throw new RangeError("Could not decode varint");
    }
    b = buf[counter++];
    res += shift < 28 ? (b & REST$1) << shift : (b & REST$1) * Math.pow(2, shift);
    shift += 7;
  } while (b >= MSB$1);
  read.bytes = counter - offset;
  return res;
}
__name(read, "read");
var N1 = Math.pow(2, 7);
var N2 = Math.pow(2, 14);
var N3 = Math.pow(2, 21);
var N4 = Math.pow(2, 28);
var N5 = Math.pow(2, 35);
var N6 = Math.pow(2, 42);
var N7 = Math.pow(2, 49);
var N8 = Math.pow(2, 56);
var N9 = Math.pow(2, 63);
var length = /* @__PURE__ */ __name(function(value2) {
  return value2 < N1 ? 1 : value2 < N2 ? 2 : value2 < N3 ? 3 : value2 < N4 ? 4 : value2 < N5 ? 5 : value2 < N6 ? 6 : value2 < N7 ? 7 : value2 < N8 ? 8 : value2 < N9 ? 9 : 10;
}, "length");
var varint = {
  encode: encode_1,
  decode: decode2,
  encodingLength: length
};
var _brrp_varint = varint;
var varint_default = _brrp_varint;

// node_modules/multiformats/dist/src/varint.js
function decode3(data, offset = 0) {
  const code3 = varint_default.decode(data, offset);
  return [code3, varint_default.decode.bytes];
}
__name(decode3, "decode");
function encodeTo(int, target, offset = 0) {
  varint_default.encode(int, target, offset);
  return target;
}
__name(encodeTo, "encodeTo");
function encodingLength(int) {
  return varint_default.encodingLength(int);
}
__name(encodingLength, "encodingLength");

// node_modules/multiformats/dist/src/hashes/digest.js
function create(code3, digest2) {
  const size = digest2.byteLength;
  const sizeOffset = encodingLength(code3);
  const digestOffset = sizeOffset + encodingLength(size);
  const bytes = new Uint8Array(digestOffset + size);
  encodeTo(code3, bytes, 0);
  encodeTo(size, bytes, sizeOffset);
  bytes.set(digest2, digestOffset);
  return new Digest(code3, size, digest2, bytes);
}
__name(create, "create");
function decode4(multihash) {
  const bytes = coerce(multihash);
  const [code3, sizeOffset] = decode3(bytes);
  const [size, digestOffset] = decode3(bytes.subarray(sizeOffset));
  const digest2 = bytes.subarray(sizeOffset + digestOffset);
  if (digest2.byteLength !== size) {
    throw new Error("Incorrect length");
  }
  return new Digest(code3, size, digest2, bytes);
}
__name(decode4, "decode");
function equals2(a, b) {
  if (a === b) {
    return true;
  } else {
    const data = b;
    return a.code === data.code && a.size === data.size && data.bytes instanceof Uint8Array && equals(a.bytes, data.bytes);
  }
}
__name(equals2, "equals");
var Digest = class {
  static {
    __name(this, "Digest");
  }
  code;
  size;
  digest;
  bytes;
  /**
   * Creates a multihash digest.
   */
  constructor(code3, size, digest2, bytes) {
    this.code = code3;
    this.size = size;
    this.digest = digest2;
    this.bytes = bytes;
  }
};

// node_modules/multiformats/dist/src/cid.js
function format(link, base3) {
  const { bytes, version } = link;
  switch (version) {
    case 0:
      return toStringV0(bytes, baseCache(link), base3 ?? base58btc.encoder);
    default:
      return toStringV1(bytes, baseCache(link), base3 ?? base32.encoder);
  }
}
__name(format, "format");
var cache = /* @__PURE__ */ new WeakMap();
function baseCache(cid) {
  const baseCache2 = cache.get(cid);
  if (baseCache2 == null) {
    const baseCache3 = /* @__PURE__ */ new Map();
    cache.set(cid, baseCache3);
    return baseCache3;
  }
  return baseCache2;
}
__name(baseCache, "baseCache");
var CID = class _CID {
  static {
    __name(this, "CID");
  }
  code;
  version;
  multihash;
  bytes;
  "/";
  /**
   * @param version - Version of the CID
   * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
   * @param multihash - (Multi)hash of the of the content.
   */
  constructor(version, code3, multihash, bytes) {
    this.code = code3;
    this.version = version;
    this.multihash = multihash;
    this.bytes = bytes;
    this["/"] = bytes;
  }
  /**
   * Signalling `cid.asCID === cid` has been replaced with `cid['/'] === cid.bytes`
   * please either use `CID.asCID(cid)` or switch to new signalling mechanism
   *
   * @deprecated
   */
  get asCID() {
    return this;
  }
  // ArrayBufferView
  get byteOffset() {
    return this.bytes.byteOffset;
  }
  // ArrayBufferView
  get byteLength() {
    return this.bytes.byteLength;
  }
  toV0() {
    switch (this.version) {
      case 0: {
        return this;
      }
      case 1: {
        const { code: code3, multihash } = this;
        if (code3 !== DAG_PB_CODE) {
          throw new Error("Cannot convert a non dag-pb CID to CIDv0");
        }
        if (multihash.code !== SHA_256_CODE) {
          throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");
        }
        return _CID.createV0(multihash);
      }
      default: {
        throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`);
      }
    }
  }
  toV1() {
    switch (this.version) {
      case 0: {
        const { code: code3, digest: digest2 } = this.multihash;
        const multihash = create(code3, digest2);
        return _CID.createV1(this.code, multihash);
      }
      case 1: {
        return this;
      }
      default: {
        throw Error(`Can not convert CID version ${this.version} to version 1. This is a bug please report`);
      }
    }
  }
  equals(other) {
    return _CID.equals(this, other);
  }
  static equals(self, other) {
    const unknown = other;
    return unknown != null && self.code === unknown.code && self.version === unknown.version && equals2(self.multihash, unknown.multihash);
  }
  toString(base3) {
    return format(this, base3);
  }
  toJSON() {
    return { "/": format(this) };
  }
  link() {
    return this;
  }
  [Symbol.toStringTag] = "CID";
  // Legacy
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return `CID(${this.toString()})`;
  }
  /**
   * Takes any input `value` and returns a `CID` instance if it was
   * a `CID` otherwise returns `null`. If `value` is instanceof `CID`
   * it will return value back. If `value` is not instance of this CID
   * class, but is compatible CID it will return new instance of this
   * `CID` class. Otherwise returns null.
   *
   * This allows two different incompatible versions of CID library to
   * co-exist and interop as long as binary interface is compatible.
   */
  static asCID(input) {
    if (input == null) {
      return null;
    }
    const value2 = input;
    if (value2 instanceof _CID) {
      return value2;
    } else if (value2["/"] != null && value2["/"] === value2.bytes || value2.asCID === value2) {
      const { version, code: code3, multihash, bytes } = value2;
      return new _CID(version, code3, multihash, bytes ?? encodeCID(version, code3, multihash.bytes));
    } else if (value2[cidSymbol] === true) {
      const { version, multihash, code: code3 } = value2;
      const digest2 = decode4(multihash);
      return _CID.create(version, code3, digest2);
    } else {
      return null;
    }
  }
  /**
   * @param version - Version of the CID
   * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
   * @param digest - (Multi)hash of the of the content.
   */
  static create(version, code3, digest2) {
    if (typeof code3 !== "number") {
      throw new Error("String codecs are no longer supported");
    }
    if (!(digest2.bytes instanceof Uint8Array)) {
      throw new Error("Invalid digest");
    }
    switch (version) {
      case 0: {
        if (code3 !== DAG_PB_CODE) {
          throw new Error(`Version 0 CID must use dag-pb (code: ${DAG_PB_CODE}) block encoding`);
        } else {
          return new _CID(version, code3, digest2, digest2.bytes);
        }
      }
      case 1: {
        const bytes = encodeCID(version, code3, digest2.bytes);
        return new _CID(version, code3, digest2, bytes);
      }
      default: {
        throw new Error("Invalid version");
      }
    }
  }
  /**
   * Simplified version of `create` for CIDv0.
   */
  static createV0(digest2) {
    return _CID.create(0, DAG_PB_CODE, digest2);
  }
  /**
   * Simplified version of `create` for CIDv1.
   *
   * @param code - Content encoding format code.
   * @param digest - Multihash of the content.
   */
  static createV1(code3, digest2) {
    return _CID.create(1, code3, digest2);
  }
  /**
   * Decoded a CID from its binary representation. The byte array must contain
   * only the CID with no additional bytes.
   *
   * An error will be thrown if the bytes provided do not contain a valid
   * binary representation of a CID.
   */
  static decode(bytes) {
    const [cid, remainder] = _CID.decodeFirst(bytes);
    if (remainder.length !== 0) {
      throw new Error("Incorrect length");
    }
    return cid;
  }
  /**
   * Decoded a CID from its binary representation at the beginning of a byte
   * array.
   *
   * Returns an array with the first element containing the CID and the second
   * element containing the remainder of the original byte array. The remainder
   * will be a zero-length byte array if the provided bytes only contained a
   * binary CID representation.
   */
  static decodeFirst(bytes) {
    const specs = _CID.inspectBytes(bytes);
    const prefixSize = specs.size - specs.multihashSize;
    const multihashBytes = coerce(bytes.subarray(prefixSize, prefixSize + specs.multihashSize));
    if (multihashBytes.byteLength !== specs.multihashSize) {
      throw new Error("Incorrect length");
    }
    const digestBytes = multihashBytes.subarray(specs.multihashSize - specs.digestSize);
    const digest2 = new Digest(specs.multihashCode, specs.digestSize, digestBytes, multihashBytes);
    const cid = specs.version === 0 ? _CID.createV0(digest2) : _CID.createV1(specs.codec, digest2);
    return [cid, bytes.subarray(specs.size)];
  }
  /**
   * Inspect the initial bytes of a CID to determine its properties.
   *
   * Involves decoding up to 4 varints. Typically this will require only 4 to 6
   * bytes but for larger multicodec code values and larger multihash digest
   * lengths these varints can be quite large. It is recommended that at least
   * 10 bytes be made available in the `initialBytes` argument for a complete
   * inspection.
   */
  static inspectBytes(initialBytes) {
    let offset = 0;
    const next = /* @__PURE__ */ __name(() => {
      const [i, length3] = decode3(initialBytes.subarray(offset));
      offset += length3;
      return i;
    }, "next");
    let version = next();
    let codec = DAG_PB_CODE;
    if (version === 18) {
      version = 0;
      offset = 0;
    } else {
      codec = next();
    }
    if (version !== 0 && version !== 1) {
      throw new RangeError(`Invalid CID version ${version}`);
    }
    const prefixSize = offset;
    const multihashCode = next();
    const digestSize = next();
    const size = offset + digestSize;
    const multihashSize = size - prefixSize;
    return { version, codec, multihashCode, digestSize, multihashSize, size };
  }
  /**
   * Takes cid in a string representation and creates an instance. If `base`
   * decoder is not provided will use a default from the configuration. It will
   * throw an error if encoding of the CID is not compatible with supplied (or
   * a default decoder).
   */
  static parse(source, base3) {
    const [prefix, bytes] = parseCIDtoBytes(source, base3);
    const cid = _CID.decode(bytes);
    if (cid.version === 0 && source[0] !== "Q") {
      throw Error("Version 0 CID string must not include multibase prefix");
    }
    baseCache(cid).set(prefix, source);
    return cid;
  }
};
function parseCIDtoBytes(source, base3) {
  switch (source[0]) {
    // CIDv0 is parsed differently
    case "Q": {
      const decoder = base3 ?? base58btc;
      return [
        base58btc.prefix,
        decoder.decode(`${base58btc.prefix}${source}`)
      ];
    }
    case base58btc.prefix: {
      const decoder = base3 ?? base58btc;
      return [base58btc.prefix, decoder.decode(source)];
    }
    case base32.prefix: {
      const decoder = base3 ?? base32;
      return [base32.prefix, decoder.decode(source)];
    }
    case base36.prefix: {
      const decoder = base3 ?? base36;
      return [base36.prefix, decoder.decode(source)];
    }
    default: {
      if (base3 == null) {
        throw Error("To parse non base32, base36 or base58btc encoded CID multibase decoder must be provided");
      }
      return [source[0], base3.decode(source)];
    }
  }
}
__name(parseCIDtoBytes, "parseCIDtoBytes");
function toStringV0(bytes, cache2, base3) {
  const { prefix } = base3;
  if (prefix !== base58btc.prefix) {
    throw Error(`Cannot string encode V0 in ${base3.name} encoding`);
  }
  const cid = cache2.get(prefix);
  if (cid == null) {
    const cid2 = base3.encode(bytes).slice(1);
    cache2.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
__name(toStringV0, "toStringV0");
function toStringV1(bytes, cache2, base3) {
  const { prefix } = base3;
  const cid = cache2.get(prefix);
  if (cid == null) {
    const cid2 = base3.encode(bytes);
    cache2.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
__name(toStringV1, "toStringV1");
var DAG_PB_CODE = 112;
var SHA_256_CODE = 18;
function encodeCID(version, code3, multihash) {
  const codeOffset = encodingLength(version);
  const hashOffset = codeOffset + encodingLength(code3);
  const bytes = new Uint8Array(hashOffset + multihash.byteLength);
  encodeTo(version, bytes, 0);
  encodeTo(code3, bytes, codeOffset);
  bytes.set(multihash, hashOffset);
  return bytes;
}
__name(encodeCID, "encodeCID");
var cidSymbol = Symbol.for("@ipld/js-cid/CID");

// node_modules/multiformats/dist/src/hashes/identity.js
var identity_exports = {};
__export(identity_exports, {
  identity: () => identity
});
var code = 0;
var name = "identity";
var encode3 = coerce;
function digest(input, options) {
  if (options?.truncate != null && options.truncate !== input.byteLength) {
    if (options.truncate < 0 || options.truncate > input.byteLength) {
      throw new Error(`Invalid truncate option, must be less than or equal to ${input.byteLength}`);
    }
    input = input.subarray(0, options.truncate);
  }
  return create(code, encode3(input));
}
__name(digest, "digest");
var identity = { code, name, encode: encode3, digest };

// node_modules/uint8arrays/dist/src/equals.js
function equals3(a, b) {
  if (a === b) {
    return true;
  }
  if (a.byteLength !== b.byteLength) {
    return false;
  }
  for (let i = 0; i < a.byteLength; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}
__name(equals3, "equals");

// node_modules/uint8arrays/dist/src/alloc.js
function alloc(size = 0) {
  return new Uint8Array(size);
}
__name(alloc, "alloc");
function allocUnsafe(size = 0) {
  return new Uint8Array(size);
}
__name(allocUnsafe, "allocUnsafe");

// node_modules/uint8arrays/dist/src/util/as-uint8array.js
function asUint8Array(buf) {
  return buf;
}
__name(asUint8Array, "asUint8Array");

// node_modules/uint8arrays/dist/src/concat.js
function concat(arrays, length3) {
  if (length3 == null) {
    length3 = arrays.reduce((acc, curr) => acc + curr.length, 0);
  }
  const output = allocUnsafe(length3);
  let offset = 0;
  for (const arr of arrays) {
    output.set(arr, offset);
    offset += arr.length;
  }
  return asUint8Array(output);
}
__name(concat, "concat");

// node_modules/uint8arraylist/dist/src/index.js
var symbol = Symbol.for("@achingbrain/uint8arraylist");
function findBufAndOffset(bufs, index) {
  if (index == null || index < 0) {
    throw new RangeError("index is out of bounds");
  }
  let offset = 0;
  for (const buf of bufs) {
    const bufEnd = offset + buf.byteLength;
    if (index < bufEnd) {
      return {
        buf,
        index: index - offset
      };
    }
    offset = bufEnd;
  }
  throw new RangeError("index is out of bounds");
}
__name(findBufAndOffset, "findBufAndOffset");
function isUint8ArrayList(value2) {
  return Boolean(value2?.[symbol]);
}
__name(isUint8ArrayList, "isUint8ArrayList");
var Uint8ArrayList = class _Uint8ArrayList {
  static {
    __name(this, "Uint8ArrayList");
  }
  bufs;
  length;
  [symbol] = true;
  constructor(...data) {
    this.bufs = [];
    this.length = 0;
    if (data.length > 0) {
      this.appendAll(data);
    }
  }
  *[Symbol.iterator]() {
    yield* this.bufs;
  }
  get byteLength() {
    return this.length;
  }
  /**
   * Add one or more `bufs` to the end of this Uint8ArrayList
   */
  append(...bufs) {
    this.appendAll(bufs);
  }
  /**
   * Add all `bufs` to the end of this Uint8ArrayList
   */
  appendAll(bufs) {
    let length3 = 0;
    for (const buf of bufs) {
      if (buf instanceof Uint8Array) {
        length3 += buf.byteLength;
        this.bufs.push(buf);
      } else if (isUint8ArrayList(buf)) {
        length3 += buf.byteLength;
        this.bufs.push(...buf.bufs);
      } else {
        throw new Error("Could not append value, must be an Uint8Array or a Uint8ArrayList");
      }
    }
    this.length += length3;
  }
  /**
   * Add one or more `bufs` to the start of this Uint8ArrayList
   */
  prepend(...bufs) {
    this.prependAll(bufs);
  }
  /**
   * Add all `bufs` to the start of this Uint8ArrayList
   */
  prependAll(bufs) {
    let length3 = 0;
    for (const buf of bufs.reverse()) {
      if (buf instanceof Uint8Array) {
        length3 += buf.byteLength;
        this.bufs.unshift(buf);
      } else if (isUint8ArrayList(buf)) {
        length3 += buf.byteLength;
        this.bufs.unshift(...buf.bufs);
      } else {
        throw new Error("Could not prepend value, must be an Uint8Array or a Uint8ArrayList");
      }
    }
    this.length += length3;
  }
  /**
   * Read the value at `index`
   */
  get(index) {
    const res = findBufAndOffset(this.bufs, index);
    return res.buf[res.index];
  }
  /**
   * Set the value at `index` to `value`
   */
  set(index, value2) {
    const res = findBufAndOffset(this.bufs, index);
    res.buf[res.index] = value2;
  }
  /**
   * Copy bytes from `buf` to the index specified by `offset`
   */
  write(buf, offset = 0) {
    if (buf instanceof Uint8Array) {
      for (let i = 0; i < buf.length; i++) {
        this.set(offset + i, buf[i]);
      }
    } else if (isUint8ArrayList(buf)) {
      for (let i = 0; i < buf.length; i++) {
        this.set(offset + i, buf.get(i));
      }
    } else {
      throw new Error("Could not write value, must be an Uint8Array or a Uint8ArrayList");
    }
  }
  /**
   * Remove bytes from the front of the pool
   */
  consume(bytes) {
    bytes = Math.trunc(bytes);
    if (Number.isNaN(bytes) || bytes <= 0) {
      return;
    }
    if (bytes === this.byteLength) {
      this.bufs = [];
      this.length = 0;
      return;
    }
    while (this.bufs.length > 0) {
      if (bytes >= this.bufs[0].byteLength) {
        bytes -= this.bufs[0].byteLength;
        this.length -= this.bufs[0].byteLength;
        this.bufs.shift();
      } else {
        this.bufs[0] = this.bufs[0].subarray(bytes);
        this.length -= bytes;
        break;
      }
    }
  }
  /**
   * Extracts a section of an array and returns a new array.
   *
   * This is a copy operation as it is with Uint8Arrays and Arrays
   * - note this is different to the behaviour of Node Buffers.
   */
  slice(beginInclusive, endExclusive) {
    const { bufs, length: length3 } = this._subList(beginInclusive, endExclusive);
    return concat(bufs, length3);
  }
  /**
   * Returns a alloc from the given start and end element index.
   *
   * In the best case where the data extracted comes from a single Uint8Array
   * internally this is a no-copy operation otherwise it is a copy operation.
   */
  subarray(beginInclusive, endExclusive) {
    const { bufs, length: length3 } = this._subList(beginInclusive, endExclusive);
    if (bufs.length === 1) {
      return bufs[0];
    }
    return concat(bufs, length3);
  }
  /**
   * Returns a allocList from the given start and end element index.
   *
   * This is a no-copy operation.
   */
  sublist(beginInclusive, endExclusive) {
    const { bufs, length: length3 } = this._subList(beginInclusive, endExclusive);
    const list = new _Uint8ArrayList();
    list.length = length3;
    list.bufs = [...bufs];
    return list;
  }
  _subList(beginInclusive, endExclusive) {
    beginInclusive = beginInclusive ?? 0;
    endExclusive = endExclusive ?? this.length;
    if (beginInclusive < 0) {
      beginInclusive = this.length + beginInclusive;
    }
    if (endExclusive < 0) {
      endExclusive = this.length + endExclusive;
    }
    if (beginInclusive < 0 || endExclusive > this.length) {
      throw new RangeError("index is out of bounds");
    }
    if (beginInclusive === endExclusive) {
      return { bufs: [], length: 0 };
    }
    if (beginInclusive === 0 && endExclusive === this.length) {
      return { bufs: this.bufs, length: this.length };
    }
    const bufs = [];
    let offset = 0;
    for (let i = 0; i < this.bufs.length; i++) {
      const buf = this.bufs[i];
      const bufStart = offset;
      const bufEnd = bufStart + buf.byteLength;
      offset = bufEnd;
      if (beginInclusive >= bufEnd) {
        continue;
      }
      const sliceStartInBuf = beginInclusive >= bufStart && beginInclusive < bufEnd;
      const sliceEndsInBuf = endExclusive > bufStart && endExclusive <= bufEnd;
      if (sliceStartInBuf && sliceEndsInBuf) {
        if (beginInclusive === bufStart && endExclusive === bufEnd) {
          bufs.push(buf);
          break;
        }
        const start = beginInclusive - bufStart;
        bufs.push(buf.subarray(start, start + (endExclusive - beginInclusive)));
        break;
      }
      if (sliceStartInBuf) {
        if (beginInclusive === 0) {
          bufs.push(buf);
          continue;
        }
        bufs.push(buf.subarray(beginInclusive - bufStart));
        continue;
      }
      if (sliceEndsInBuf) {
        if (endExclusive === bufEnd) {
          bufs.push(buf);
          break;
        }
        bufs.push(buf.subarray(0, endExclusive - bufStart));
        break;
      }
      bufs.push(buf);
    }
    return { bufs, length: endExclusive - beginInclusive };
  }
  indexOf(search, offset = 0) {
    if (!isUint8ArrayList(search) && !(search instanceof Uint8Array)) {
      throw new TypeError('The "value" argument must be a Uint8ArrayList or Uint8Array');
    }
    const needle = search instanceof Uint8Array ? search : search.subarray();
    offset = Number(offset ?? 0);
    if (isNaN(offset)) {
      offset = 0;
    }
    if (offset < 0) {
      offset = this.length + offset;
    }
    if (offset < 0) {
      offset = 0;
    }
    if (search.length === 0) {
      return offset > this.length ? this.length : offset;
    }
    const M = needle.byteLength;
    if (M === 0) {
      throw new TypeError("search must be at least 1 byte long");
    }
    const radix = 256;
    const rightmostPositions = new Int32Array(radix);
    for (let c = 0; c < radix; c++) {
      rightmostPositions[c] = -1;
    }
    for (let j = 0; j < M; j++) {
      rightmostPositions[needle[j]] = j;
    }
    const right = rightmostPositions;
    const lastIndex = this.byteLength - needle.byteLength;
    const lastPatIndex = needle.byteLength - 1;
    let skip;
    for (let i = offset; i <= lastIndex; i += skip) {
      skip = 0;
      for (let j = lastPatIndex; j >= 0; j--) {
        const char = this.get(i + j);
        if (needle[j] !== char) {
          skip = Math.max(1, j - right[char]);
          break;
        }
      }
      if (skip === 0) {
        return i;
      }
    }
    return -1;
  }
  getInt8(byteOffset) {
    const buf = this.subarray(byteOffset, byteOffset + 1);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    return view.getInt8(0);
  }
  setInt8(byteOffset, value2) {
    const buf = allocUnsafe(1);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    view.setInt8(0, value2);
    this.write(buf, byteOffset);
  }
  getInt16(byteOffset, littleEndian) {
    const buf = this.subarray(byteOffset, byteOffset + 2);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    return view.getInt16(0, littleEndian);
  }
  setInt16(byteOffset, value2, littleEndian) {
    const buf = alloc(2);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    view.setInt16(0, value2, littleEndian);
    this.write(buf, byteOffset);
  }
  getInt32(byteOffset, littleEndian) {
    const buf = this.subarray(byteOffset, byteOffset + 4);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    return view.getInt32(0, littleEndian);
  }
  setInt32(byteOffset, value2, littleEndian) {
    const buf = alloc(4);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    view.setInt32(0, value2, littleEndian);
    this.write(buf, byteOffset);
  }
  getBigInt64(byteOffset, littleEndian) {
    const buf = this.subarray(byteOffset, byteOffset + 8);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    return view.getBigInt64(0, littleEndian);
  }
  setBigInt64(byteOffset, value2, littleEndian) {
    const buf = alloc(8);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    view.setBigInt64(0, value2, littleEndian);
    this.write(buf, byteOffset);
  }
  getUint8(byteOffset) {
    const buf = this.subarray(byteOffset, byteOffset + 1);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    return view.getUint8(0);
  }
  setUint8(byteOffset, value2) {
    const buf = allocUnsafe(1);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    view.setUint8(0, value2);
    this.write(buf, byteOffset);
  }
  getUint16(byteOffset, littleEndian) {
    const buf = this.subarray(byteOffset, byteOffset + 2);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    return view.getUint16(0, littleEndian);
  }
  setUint16(byteOffset, value2, littleEndian) {
    const buf = alloc(2);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    view.setUint16(0, value2, littleEndian);
    this.write(buf, byteOffset);
  }
  getUint32(byteOffset, littleEndian) {
    const buf = this.subarray(byteOffset, byteOffset + 4);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    return view.getUint32(0, littleEndian);
  }
  setUint32(byteOffset, value2, littleEndian) {
    const buf = alloc(4);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    view.setUint32(0, value2, littleEndian);
    this.write(buf, byteOffset);
  }
  getBigUint64(byteOffset, littleEndian) {
    const buf = this.subarray(byteOffset, byteOffset + 8);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    return view.getBigUint64(0, littleEndian);
  }
  setBigUint64(byteOffset, value2, littleEndian) {
    const buf = alloc(8);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    view.setBigUint64(0, value2, littleEndian);
    this.write(buf, byteOffset);
  }
  getFloat32(byteOffset, littleEndian) {
    const buf = this.subarray(byteOffset, byteOffset + 4);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    return view.getFloat32(0, littleEndian);
  }
  setFloat32(byteOffset, value2, littleEndian) {
    const buf = alloc(4);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    view.setFloat32(0, value2, littleEndian);
    this.write(buf, byteOffset);
  }
  getFloat64(byteOffset, littleEndian) {
    const buf = this.subarray(byteOffset, byteOffset + 8);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    return view.getFloat64(0, littleEndian);
  }
  setFloat64(byteOffset, value2, littleEndian) {
    const buf = alloc(8);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    view.setFloat64(0, value2, littleEndian);
    this.write(buf, byteOffset);
  }
  equals(other) {
    if (other == null) {
      return false;
    }
    if (!(other instanceof _Uint8ArrayList)) {
      return false;
    }
    if (other.bufs.length !== this.bufs.length) {
      return false;
    }
    for (let i = 0; i < this.bufs.length; i++) {
      if (!equals3(this.bufs[i], other.bufs[i])) {
        return false;
      }
    }
    return true;
  }
  /**
   * Create a Uint8ArrayList from a pre-existing list of Uint8Arrays.  Use this
   * method if you know the total size of all the Uint8Arrays ahead of time.
   */
  static fromUint8Arrays(bufs, length3) {
    const list = new _Uint8ArrayList();
    list.bufs = bufs;
    if (length3 == null) {
      length3 = bufs.reduce((acc, curr) => acc + curr.byteLength, 0);
    }
    list.length = length3;
    return list;
  }
};

// node_modules/multiformats/dist/src/bases/base10.js
var base10_exports = {};
__export(base10_exports, {
  base10: () => base10
});
var base10 = baseX({
  prefix: "9",
  name: "base10",
  alphabet: "0123456789"
});

// node_modules/multiformats/dist/src/bases/base16.js
var base16_exports = {};
__export(base16_exports, {
  base16: () => base16,
  base16upper: () => base16upper
});
var base16 = rfc4648({
  prefix: "f",
  name: "base16",
  alphabet: "0123456789abcdef",
  bitsPerChar: 4
});
var base16upper = rfc4648({
  prefix: "F",
  name: "base16upper",
  alphabet: "0123456789ABCDEF",
  bitsPerChar: 4
});

// node_modules/multiformats/dist/src/bases/base2.js
var base2_exports = {};
__export(base2_exports, {
  base2: () => base2
});
var base2 = rfc4648({
  prefix: "0",
  name: "base2",
  alphabet: "01",
  bitsPerChar: 1
});

// node_modules/multiformats/dist/src/bases/base256emoji.js
var base256emoji_exports = {};
__export(base256emoji_exports, {
  base256emoji: () => base256emoji
});
var alphabet = Array.from("\u{1F680}\u{1FA90}\u2604\u{1F6F0}\u{1F30C}\u{1F311}\u{1F312}\u{1F313}\u{1F314}\u{1F315}\u{1F316}\u{1F317}\u{1F318}\u{1F30D}\u{1F30F}\u{1F30E}\u{1F409}\u2600\u{1F4BB}\u{1F5A5}\u{1F4BE}\u{1F4BF}\u{1F602}\u2764\u{1F60D}\u{1F923}\u{1F60A}\u{1F64F}\u{1F495}\u{1F62D}\u{1F618}\u{1F44D}\u{1F605}\u{1F44F}\u{1F601}\u{1F525}\u{1F970}\u{1F494}\u{1F496}\u{1F499}\u{1F622}\u{1F914}\u{1F606}\u{1F644}\u{1F4AA}\u{1F609}\u263A\u{1F44C}\u{1F917}\u{1F49C}\u{1F614}\u{1F60E}\u{1F607}\u{1F339}\u{1F926}\u{1F389}\u{1F49E}\u270C\u2728\u{1F937}\u{1F631}\u{1F60C}\u{1F338}\u{1F64C}\u{1F60B}\u{1F497}\u{1F49A}\u{1F60F}\u{1F49B}\u{1F642}\u{1F493}\u{1F929}\u{1F604}\u{1F600}\u{1F5A4}\u{1F603}\u{1F4AF}\u{1F648}\u{1F447}\u{1F3B6}\u{1F612}\u{1F92D}\u2763\u{1F61C}\u{1F48B}\u{1F440}\u{1F62A}\u{1F611}\u{1F4A5}\u{1F64B}\u{1F61E}\u{1F629}\u{1F621}\u{1F92A}\u{1F44A}\u{1F973}\u{1F625}\u{1F924}\u{1F449}\u{1F483}\u{1F633}\u270B\u{1F61A}\u{1F61D}\u{1F634}\u{1F31F}\u{1F62C}\u{1F643}\u{1F340}\u{1F337}\u{1F63B}\u{1F613}\u2B50\u2705\u{1F97A}\u{1F308}\u{1F608}\u{1F918}\u{1F4A6}\u2714\u{1F623}\u{1F3C3}\u{1F490}\u2639\u{1F38A}\u{1F498}\u{1F620}\u261D\u{1F615}\u{1F33A}\u{1F382}\u{1F33B}\u{1F610}\u{1F595}\u{1F49D}\u{1F64A}\u{1F639}\u{1F5E3}\u{1F4AB}\u{1F480}\u{1F451}\u{1F3B5}\u{1F91E}\u{1F61B}\u{1F534}\u{1F624}\u{1F33C}\u{1F62B}\u26BD\u{1F919}\u2615\u{1F3C6}\u{1F92B}\u{1F448}\u{1F62E}\u{1F646}\u{1F37B}\u{1F343}\u{1F436}\u{1F481}\u{1F632}\u{1F33F}\u{1F9E1}\u{1F381}\u26A1\u{1F31E}\u{1F388}\u274C\u270A\u{1F44B}\u{1F630}\u{1F928}\u{1F636}\u{1F91D}\u{1F6B6}\u{1F4B0}\u{1F353}\u{1F4A2}\u{1F91F}\u{1F641}\u{1F6A8}\u{1F4A8}\u{1F92C}\u2708\u{1F380}\u{1F37A}\u{1F913}\u{1F619}\u{1F49F}\u{1F331}\u{1F616}\u{1F476}\u{1F974}\u25B6\u27A1\u2753\u{1F48E}\u{1F4B8}\u2B07\u{1F628}\u{1F31A}\u{1F98B}\u{1F637}\u{1F57A}\u26A0\u{1F645}\u{1F61F}\u{1F635}\u{1F44E}\u{1F932}\u{1F920}\u{1F927}\u{1F4CC}\u{1F535}\u{1F485}\u{1F9D0}\u{1F43E}\u{1F352}\u{1F617}\u{1F911}\u{1F30A}\u{1F92F}\u{1F437}\u260E\u{1F4A7}\u{1F62F}\u{1F486}\u{1F446}\u{1F3A4}\u{1F647}\u{1F351}\u2744\u{1F334}\u{1F4A3}\u{1F438}\u{1F48C}\u{1F4CD}\u{1F940}\u{1F922}\u{1F445}\u{1F4A1}\u{1F4A9}\u{1F450}\u{1F4F8}\u{1F47B}\u{1F910}\u{1F92E}\u{1F3BC}\u{1F975}\u{1F6A9}\u{1F34E}\u{1F34A}\u{1F47C}\u{1F48D}\u{1F4E3}\u{1F942}");
var alphabetBytesToChars = alphabet.reduce((p, c, i) => {
  p[i] = c;
  return p;
}, []);
var alphabetCharsToBytes = alphabet.reduce((p, c, i) => {
  const codePoint = c.codePointAt(0);
  if (codePoint == null) {
    throw new Error(`Invalid character: ${c}`);
  }
  p[codePoint] = i;
  return p;
}, []);
function encode4(data) {
  return data.reduce((p, c) => {
    p += alphabetBytesToChars[c];
    return p;
  }, "");
}
__name(encode4, "encode");
function decode5(str) {
  const byts = [];
  for (const char of str) {
    const codePoint = char.codePointAt(0);
    if (codePoint == null) {
      throw new Error(`Invalid character: ${char}`);
    }
    const byt = alphabetCharsToBytes[codePoint];
    if (byt == null) {
      throw new Error(`Non-base256emoji character: ${char}`);
    }
    byts.push(byt);
  }
  return new Uint8Array(byts);
}
__name(decode5, "decode");
var base256emoji = from({
  prefix: "\u{1F680}",
  name: "base256emoji",
  encode: encode4,
  decode: decode5
});

// node_modules/multiformats/dist/src/bases/base64.js
var base64_exports = {};
__export(base64_exports, {
  base64: () => base64,
  base64pad: () => base64pad,
  base64url: () => base64url,
  base64urlpad: () => base64urlpad
});
var base64 = rfc4648({
  prefix: "m",
  name: "base64",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
  bitsPerChar: 6
});
var base64pad = rfc4648({
  prefix: "M",
  name: "base64pad",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  bitsPerChar: 6
});
var base64url = rfc4648({
  prefix: "u",
  name: "base64url",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
  bitsPerChar: 6
});
var base64urlpad = rfc4648({
  prefix: "U",
  name: "base64urlpad",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
  bitsPerChar: 6
});

// node_modules/multiformats/dist/src/bases/base8.js
var base8_exports = {};
__export(base8_exports, {
  base8: () => base8
});
var base8 = rfc4648({
  prefix: "7",
  name: "base8",
  alphabet: "01234567",
  bitsPerChar: 3
});

// node_modules/multiformats/dist/src/bases/identity.js
var identity_exports2 = {};
__export(identity_exports2, {
  identity: () => identity2
});
var identity2 = from({
  prefix: "\0",
  name: "identity",
  encode: /* @__PURE__ */ __name((buf) => toString(buf), "encode"),
  decode: /* @__PURE__ */ __name((str) => fromString(str), "decode")
});

// node_modules/multiformats/dist/src/codecs/json.js
var textEncoder = new TextEncoder();
var textDecoder = new TextDecoder();

// node_modules/multiformats/dist/src/hashes/sha2-browser.js
var sha2_browser_exports = {};
__export(sha2_browser_exports, {
  sha256: () => sha256,
  sha512: () => sha512
});

// node_modules/multiformats/dist/src/hashes/hasher.js
var DEFAULT_MIN_DIGEST_LENGTH = 20;
function from2({ name: name2, code: code3, encode: encode6, minDigestLength, maxDigestLength }) {
  return new Hasher(name2, code3, encode6, minDigestLength, maxDigestLength);
}
__name(from2, "from");
var Hasher = class {
  static {
    __name(this, "Hasher");
  }
  name;
  code;
  encode;
  minDigestLength;
  maxDigestLength;
  constructor(name2, code3, encode6, minDigestLength, maxDigestLength) {
    this.name = name2;
    this.code = code3;
    this.encode = encode6;
    this.minDigestLength = minDigestLength ?? DEFAULT_MIN_DIGEST_LENGTH;
    this.maxDigestLength = maxDigestLength;
  }
  digest(input, options) {
    if (options?.truncate != null) {
      if (options.truncate < this.minDigestLength) {
        throw new Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);
      }
      if (this.maxDigestLength != null && options.truncate > this.maxDigestLength) {
        throw new Error(`Invalid truncate option, must be less than or equal to ${this.maxDigestLength}`);
      }
    }
    if (input instanceof Uint8Array) {
      const result = this.encode(input);
      if (result instanceof Uint8Array) {
        return createDigest(result, this.code, options?.truncate);
      }
      return result.then((digest2) => createDigest(digest2, this.code, options?.truncate));
    } else {
      throw Error("Unknown type, must be binary type");
    }
  }
};
function createDigest(digest2, code3, truncate) {
  if (truncate != null && truncate !== digest2.byteLength) {
    if (truncate > digest2.byteLength) {
      throw new Error(`Invalid truncate option, must be less than or equal to ${digest2.byteLength}`);
    }
    digest2 = digest2.subarray(0, truncate);
  }
  return create(code3, digest2);
}
__name(createDigest, "createDigest");

// node_modules/multiformats/dist/src/hashes/sha2-browser.js
function sha(name2) {
  return async (data) => new Uint8Array(await crypto.subtle.digest(name2, data));
}
__name(sha, "sha");
var sha256 = from2({
  name: "sha2-256",
  code: 18,
  encode: sha("SHA-256")
});
var sha512 = from2({
  name: "sha2-512",
  code: 19,
  encode: sha("SHA-512")
});

// node_modules/multiformats/dist/src/basics.js
var bases = { ...identity_exports2, ...base2_exports, ...base8_exports, ...base10_exports, ...base16_exports, ...base32_exports, ...base36_exports, ...base58_exports, ...base64_exports, ...base256emoji_exports };
var hashes = { ...sha2_browser_exports, ...identity_exports };

// node_modules/uint8arrays/dist/src/util/bases.js
function createCodec(name2, prefix, encode6, decode7) {
  return {
    name: name2,
    prefix,
    encoder: {
      name: name2,
      prefix,
      encode: encode6
    },
    decoder: {
      decode: decode7
    }
  };
}
__name(createCodec, "createCodec");
var string = createCodec("utf8", "u", (buf) => {
  const decoder = new TextDecoder("utf8");
  return "u" + decoder.decode(buf);
}, (str) => {
  const encoder = new TextEncoder();
  return encoder.encode(str.substring(1));
});
var ascii = createCodec("ascii", "a", (buf) => {
  let string2 = "a";
  for (let i = 0; i < buf.length; i++) {
    string2 += String.fromCharCode(buf[i]);
  }
  return string2;
}, (str) => {
  str = str.substring(1);
  const buf = allocUnsafe(str.length);
  for (let i = 0; i < str.length; i++) {
    buf[i] = str.charCodeAt(i);
  }
  return buf;
});
var BASES = {
  utf8: string,
  "utf-8": string,
  hex: bases.base16,
  latin1: ascii,
  ascii,
  binary: ascii,
  ...bases
};
var bases_default = BASES;

// node_modules/uint8arrays/dist/src/from-string.js
function fromString2(string2, encoding = "utf8") {
  const base3 = bases_default[encoding];
  if (base3 == null) {
    throw new Error(`Unsupported encoding "${encoding}"`);
  }
  return base3.decoder.decode(`${base3.prefix}${string2}`);
}
__name(fromString2, "fromString");

// node_modules/uint8arrays/dist/src/to-string.js
function toString2(array, encoding = "utf8") {
  const base3 = bases_default[encoding];
  if (base3 == null) {
    throw new Error(`Unsupported encoding "${encoding}"`);
  }
  return base3.encoder.encode(array).substring(1);
}
__name(toString2, "toString");

// node_modules/@libp2p/crypto/dist/src/keys/rsa/der.js
var TAG_MASK = parseInt("11111", 2);
var LONG_LENGTH_MASK = parseInt("10000000", 2);
var LONG_LENGTH_BYTES_MASK = parseInt("01111111", 2);
var decoders = {
  0: readSequence,
  1: readSequence,
  2: readInteger,
  3: readBitString,
  4: readOctetString,
  5: readNull,
  6: readObjectIdentifier,
  16: readSequence,
  22: readSequence,
  48: readSequence
};
function decodeDer(buf, context = { offset: 0 }) {
  const tag = buf[context.offset] & TAG_MASK;
  context.offset++;
  if (decoders[tag] != null) {
    return decoders[tag](buf, context);
  }
  throw new Error("No decoder for tag " + tag);
}
__name(decodeDer, "decodeDer");
function readLength(buf, context) {
  let length3 = 0;
  if ((buf[context.offset] & LONG_LENGTH_MASK) === LONG_LENGTH_MASK) {
    const count = buf[context.offset] & LONG_LENGTH_BYTES_MASK;
    let str = "0x";
    context.offset++;
    for (let i = 0; i < count; i++, context.offset++) {
      str += buf[context.offset].toString(16).padStart(2, "0");
    }
    length3 = parseInt(str, 16);
  } else {
    length3 = buf[context.offset];
    context.offset++;
  }
  return length3;
}
__name(readLength, "readLength");
function readSequence(buf, context) {
  readLength(buf, context);
  const entries = [];
  while (true) {
    if (context.offset >= buf.byteLength) {
      break;
    }
    const result = decodeDer(buf, context);
    if (result === null) {
      break;
    }
    entries.push(result);
  }
  return entries;
}
__name(readSequence, "readSequence");
function readInteger(buf, context) {
  const length3 = readLength(buf, context);
  const start = context.offset;
  const end = context.offset + length3;
  const vals = [];
  for (let i = start; i < end; i++) {
    if (i === start && buf[i] === 0) {
      continue;
    }
    vals.push(buf[i]);
  }
  context.offset += length3;
  return Uint8Array.from(vals);
}
__name(readInteger, "readInteger");
function readObjectIdentifier(buf, context) {
  const count = readLength(buf, context);
  const finalOffset = context.offset + count;
  const byte = buf[context.offset];
  context.offset++;
  let val1 = 0;
  let val2 = 0;
  if (byte < 40) {
    val1 = 0;
    val2 = byte;
  } else if (byte < 80) {
    val1 = 1;
    val2 = byte - 40;
  } else {
    val1 = 2;
    val2 = byte - 80;
  }
  let oid = `${val1}.${val2}`;
  let num = [];
  while (context.offset < finalOffset) {
    const byte2 = buf[context.offset];
    context.offset++;
    num.push(byte2 & 127);
    if (byte2 < 128) {
      num.reverse();
      let val = 0;
      for (let i = 0; i < num.length; i++) {
        val += num[i] << i * 7;
      }
      oid += `.${val}`;
      num = [];
    }
  }
  return oid;
}
__name(readObjectIdentifier, "readObjectIdentifier");
function readNull(buf, context) {
  context.offset++;
  return null;
}
__name(readNull, "readNull");
function readBitString(buf, context) {
  const length3 = readLength(buf, context);
  const unusedBits = buf[context.offset];
  context.offset++;
  const bytes = buf.subarray(context.offset, context.offset + length3 - 1);
  context.offset += length3;
  if (unusedBits !== 0) {
    throw new Error("Unused bits in bit string is unimplemented");
  }
  return bytes;
}
__name(readBitString, "readBitString");
function readOctetString(buf, context) {
  const length3 = readLength(buf, context);
  const bytes = buf.subarray(context.offset, context.offset + length3);
  context.offset += length3;
  return bytes;
}
__name(readOctetString, "readOctetString");
function encodeNumber(value2) {
  let number = value2.toString(16);
  if (number.length % 2 === 1) {
    number = "0" + number;
  }
  const array = new Uint8ArrayList();
  for (let i = 0; i < number.length; i += 2) {
    array.append(Uint8Array.from([parseInt(`${number[i]}${number[i + 1]}`, 16)]));
  }
  return array;
}
__name(encodeNumber, "encodeNumber");
function encodeLength(bytes) {
  if (bytes.byteLength < 128) {
    return Uint8Array.from([bytes.byteLength]);
  }
  const length3 = encodeNumber(bytes.byteLength);
  return new Uint8ArrayList(Uint8Array.from([
    length3.byteLength | LONG_LENGTH_MASK
  ]), length3);
}
__name(encodeLength, "encodeLength");
function encodeInteger(value2) {
  const contents = new Uint8ArrayList();
  const mask = 128;
  const positive2 = (value2.subarray()[0] & mask) === mask;
  if (positive2) {
    contents.append(Uint8Array.from([0]));
  }
  contents.append(value2);
  return new Uint8ArrayList(Uint8Array.from([2]), encodeLength(contents), contents);
}
__name(encodeInteger, "encodeInteger");
function encodeBitString(value2) {
  const unusedBits = Uint8Array.from([0]);
  const contents = new Uint8ArrayList(unusedBits, value2);
  return new Uint8ArrayList(Uint8Array.from([3]), encodeLength(contents), contents);
}
__name(encodeBitString, "encodeBitString");
function encodeSequence(values, tag = 48) {
  const output = new Uint8ArrayList();
  for (const buf of values) {
    output.append(buf);
  }
  return new Uint8ArrayList(Uint8Array.from([tag]), encodeLength(output), output);
}
__name(encodeSequence, "encodeSequence");

// node_modules/@libp2p/crypto/dist/src/keys/ecdsa/index.js
async function hashAndVerify(key, sig, msg, options) {
  const publicKey = await crypto.subtle.importKey("jwk", key, {
    name: "ECDSA",
    namedCurve: key.crv ?? "P-256"
  }, false, ["verify"]);
  options?.signal?.throwIfAborted();
  const result = await crypto.subtle.verify({
    name: "ECDSA",
    hash: {
      name: "SHA-256"
    }
  }, publicKey, sig, msg.subarray());
  options?.signal?.throwIfAborted();
  return result;
}
__name(hashAndVerify, "hashAndVerify");

// node_modules/@libp2p/crypto/dist/src/keys/ecdsa/utils.js
var OID_256 = Uint8Array.from([6, 8, 42, 134, 72, 206, 61, 3, 1, 7]);
var OID_384 = Uint8Array.from([6, 5, 43, 129, 4, 0, 34]);
var OID_521 = Uint8Array.from([6, 5, 43, 129, 4, 0, 35]);
var P_256_KEY_JWK = {
  ext: true,
  kty: "EC",
  crv: "P-256"
};
var P_384_KEY_JWK = {
  ext: true,
  kty: "EC",
  crv: "P-384"
};
var P_521_KEY_JWK = {
  ext: true,
  kty: "EC",
  crv: "P-521"
};
var P_256_KEY_LENGTH = 32;
var P_384_KEY_LENGTH = 48;
var P_521_KEY_LENGTH = 66;
function unmarshalECDSAPublicKey(bytes) {
  const message2 = decodeDer(bytes);
  return pkiMessageToECDSAPublicKey(message2);
}
__name(unmarshalECDSAPublicKey, "unmarshalECDSAPublicKey");
function pkiMessageToECDSAPublicKey(message2) {
  const coordinates = message2[1][1][0];
  const offset = 1;
  let x;
  let y;
  if (coordinates.byteLength === P_256_KEY_LENGTH * 2 + 1) {
    x = toString2(coordinates.subarray(offset, offset + P_256_KEY_LENGTH), "base64url");
    y = toString2(coordinates.subarray(offset + P_256_KEY_LENGTH), "base64url");
    return new ECDSAPublicKey({
      ...P_256_KEY_JWK,
      key_ops: ["verify"],
      x,
      y
    });
  }
  if (coordinates.byteLength === P_384_KEY_LENGTH * 2 + 1) {
    x = toString2(coordinates.subarray(offset, offset + P_384_KEY_LENGTH), "base64url");
    y = toString2(coordinates.subarray(offset + P_384_KEY_LENGTH), "base64url");
    return new ECDSAPublicKey({
      ...P_384_KEY_JWK,
      key_ops: ["verify"],
      x,
      y
    });
  }
  if (coordinates.byteLength === P_521_KEY_LENGTH * 2 + 1) {
    x = toString2(coordinates.subarray(offset, offset + P_521_KEY_LENGTH), "base64url");
    y = toString2(coordinates.subarray(offset + P_521_KEY_LENGTH), "base64url");
    return new ECDSAPublicKey({
      ...P_521_KEY_JWK,
      key_ops: ["verify"],
      x,
      y
    });
  }
  throw new InvalidParametersError(`coordinates were wrong length, got ${coordinates.byteLength}, expected 65, 97 or 133`);
}
__name(pkiMessageToECDSAPublicKey, "pkiMessageToECDSAPublicKey");
function publicKeyToPKIMessage(publicKey) {
  return encodeSequence([
    encodeInteger(Uint8Array.from([1])),
    // header
    encodeSequence([
      getOID(publicKey.crv)
    ], 160),
    encodeSequence([
      encodeBitString(new Uint8ArrayList(Uint8Array.from([4]), fromString2(publicKey.x ?? "", "base64url"), fromString2(publicKey.y ?? "", "base64url")))
    ], 161)
  ]).subarray();
}
__name(publicKeyToPKIMessage, "publicKeyToPKIMessage");
function getOID(curve) {
  if (curve === "P-256") {
    return OID_256;
  }
  if (curve === "P-384") {
    return OID_384;
  }
  if (curve === "P-521") {
    return OID_521;
  }
  throw new InvalidParametersError(`Invalid curve ${curve}`);
}
__name(getOID, "getOID");

// node_modules/@libp2p/crypto/dist/src/keys/ecdsa/ecdsa.js
var ECDSAPublicKey = class {
  static {
    __name(this, "ECDSAPublicKey");
  }
  type = "ECDSA";
  jwk;
  _raw;
  constructor(jwk) {
    this.jwk = jwk;
  }
  get raw() {
    if (this._raw == null) {
      this._raw = publicKeyToPKIMessage(this.jwk);
    }
    return this._raw;
  }
  toMultihash() {
    return identity.digest(publicKeyToProtobuf(this));
  }
  toCID() {
    return CID.createV1(114, this.toMultihash());
  }
  toString() {
    return base58btc.encode(this.toMultihash().bytes).substring(1);
  }
  equals(key) {
    if (key == null || !(key.raw instanceof Uint8Array)) {
      return false;
    }
    return equals3(this.raw, key.raw);
  }
  async verify(data, sig, options) {
    return hashAndVerify(this.jwk, sig, data, options);
  }
};

// node_modules/@libp2p/crypto/node_modules/@noble/hashes/utils.js
function isBytes(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
__name(isBytes, "isBytes");
function anumber(n, title = "") {
  if (!Number.isSafeInteger(n) || n < 0) {
    const prefix = title && `"${title}" `;
    throw new Error(`${prefix}expected integer >= 0, got ${n}`);
  }
}
__name(anumber, "anumber");
function abytes(value2, length3, title = "") {
  const bytes = isBytes(value2);
  const len = value2?.length;
  const needsLen = length3 !== void 0;
  if (!bytes || needsLen && len !== length3) {
    const prefix = title && `"${title}" `;
    const ofLen = needsLen ? ` of length ${length3}` : "";
    const got = bytes ? `length=${len}` : `type=${typeof value2}`;
    throw new Error(prefix + "expected Uint8Array" + ofLen + ", got " + got);
  }
  return value2;
}
__name(abytes, "abytes");
function ahash(h) {
  if (typeof h !== "function" || typeof h.create !== "function")
    throw new Error("Hash must wrapped by utils.createHasher");
  anumber(h.outputLen);
  anumber(h.blockLen);
}
__name(ahash, "ahash");
function aexists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
__name(aexists, "aexists");
function aoutput(out, instance) {
  abytes(out, void 0, "digestInto() output");
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error('"digestInto() output" expected to be of length >=' + min);
  }
}
__name(aoutput, "aoutput");
function clean(...arrays) {
  for (let i = 0; i < arrays.length; i++) {
    arrays[i].fill(0);
  }
}
__name(clean, "clean");
function createView(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
__name(createView, "createView");
function rotr(word, shift) {
  return word << 32 - shift | word >>> shift;
}
__name(rotr, "rotr");
var hasHexBuiltin = /* @__PURE__ */ (() => (
  // @ts-ignore
  typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
))();
var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
function bytesToHex(bytes) {
  abytes(bytes);
  if (hasHexBuiltin)
    return bytes.toHex();
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += hexes[bytes[i]];
  }
  return hex;
}
__name(bytesToHex, "bytesToHex");
var asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function asciiToBase16(ch) {
  if (ch >= asciis._0 && ch <= asciis._9)
    return ch - asciis._0;
  if (ch >= asciis.A && ch <= asciis.F)
    return ch - (asciis.A - 10);
  if (ch >= asciis.a && ch <= asciis.f)
    return ch - (asciis.a - 10);
  return;
}
__name(asciiToBase16, "asciiToBase16");
function hexToBytes(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  if (hasHexBuiltin)
    return Uint8Array.fromHex(hex);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2)
    throw new Error("hex string expected, got unpadded hex of length " + hl);
  const array = new Uint8Array(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = asciiToBase16(hex.charCodeAt(hi));
    const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
    if (n1 === void 0 || n2 === void 0) {
      const char = hex[hi] + hex[hi + 1];
      throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
    }
    array[ai] = n1 * 16 + n2;
  }
  return array;
}
__name(hexToBytes, "hexToBytes");
function concatBytes(...arrays) {
  let sum = 0;
  for (let i = 0; i < arrays.length; i++) {
    const a = arrays[i];
    abytes(a);
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i = 0, pad = 0; i < arrays.length; i++) {
    const a = arrays[i];
    res.set(a, pad);
    pad += a.length;
  }
  return res;
}
__name(concatBytes, "concatBytes");
function createHasher(hashCons, info = {}) {
  const hashC = /* @__PURE__ */ __name((msg, opts) => hashCons(opts).update(msg).digest(), "hashC");
  const tmp = hashCons(void 0);
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = (opts) => hashCons(opts);
  Object.assign(hashC, info);
  return Object.freeze(hashC);
}
__name(createHasher, "createHasher");
function randomBytes(bytesLength = 32) {
  const cr = typeof globalThis === "object" ? globalThis.crypto : null;
  if (typeof cr?.getRandomValues !== "function")
    throw new Error("crypto.getRandomValues must be defined");
  return cr.getRandomValues(new Uint8Array(bytesLength));
}
__name(randomBytes, "randomBytes");
var oidNist = /* @__PURE__ */ __name((suffix) => ({
  oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, suffix])
}), "oidNist");

// node_modules/@libp2p/crypto/node_modules/@noble/hashes/_md.js
function Chi(a, b, c) {
  return a & b ^ ~a & c;
}
__name(Chi, "Chi");
function Maj(a, b, c) {
  return a & b ^ a & c ^ b & c;
}
__name(Maj, "Maj");
var HashMD = class {
  static {
    __name(this, "HashMD");
  }
  blockLen;
  outputLen;
  padOffset;
  isLE;
  // For partial updates less than block size
  buffer;
  view;
  finished = false;
  length = 0;
  pos = 0;
  destroyed = false;
  constructor(blockLen, outputLen, padOffset, isLE) {
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView(this.buffer);
  }
  update(data) {
    aexists(this);
    abytes(data);
    const { view, buffer, blockLen } = this;
    const len = data.length;
    for (let pos = 0; pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        const dataView = createView(data);
        for (; blockLen <= len - pos; pos += blockLen)
          this.process(dataView, pos);
        continue;
      }
      buffer.set(data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view, 0);
        this.pos = 0;
      }
    }
    this.length += data.length;
    this.roundClean();
    return this;
  }
  digestInto(out) {
    aexists(this);
    aoutput(out, this);
    this.finished = true;
    const { buffer, view, blockLen, isLE } = this;
    let { pos } = this;
    buffer[pos++] = 128;
    clean(this.buffer.subarray(pos));
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      pos = 0;
    }
    for (let i = pos; i < blockLen; i++)
      buffer[i] = 0;
    view.setBigUint64(blockLen - 8, BigInt(this.length * 8), isLE);
    this.process(view, 0);
    const oview = createView(out);
    const len = this.outputLen;
    if (len % 4)
      throw new Error("_sha2: outputLen must be aligned to 32bit");
    const outLen = len / 4;
    const state = this.get();
    if (outLen > state.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let i = 0; i < outLen; i++)
      oview.setUint32(4 * i, state[i], isLE);
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    to ||= new this.constructor();
    to.set(...this.get());
    const { blockLen, buffer, length: length3, finished, destroyed, pos } = this;
    to.destroyed = destroyed;
    to.finished = finished;
    to.length = length3;
    to.pos = pos;
    if (length3 % blockLen)
      to.buffer.set(buffer);
    return to;
  }
  clone() {
    return this._cloneInto();
  }
};
var SHA256_IV = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
var SHA512_IV = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  4089235720,
  3144134277,
  2227873595,
  1013904242,
  4271175723,
  2773480762,
  1595750129,
  1359893119,
  2917565137,
  2600822924,
  725511199,
  528734635,
  4215389547,
  1541459225,
  327033209
]);

// node_modules/@libp2p/crypto/node_modules/@noble/hashes/_u64.js
var U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
var _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n, le = false) {
  if (le)
    return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
  return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
__name(fromBig, "fromBig");
function split(lst, le = false) {
  const len = lst.length;
  let Ah = new Uint32Array(len);
  let Al = new Uint32Array(len);
  for (let i = 0; i < len; i++) {
    const { h, l } = fromBig(lst[i], le);
    [Ah[i], Al[i]] = [h, l];
  }
  return [Ah, Al];
}
__name(split, "split");
var shrSH = /* @__PURE__ */ __name((h, _l, s) => h >>> s, "shrSH");
var shrSL = /* @__PURE__ */ __name((h, l, s) => h << 32 - s | l >>> s, "shrSL");
var rotrSH = /* @__PURE__ */ __name((h, l, s) => h >>> s | l << 32 - s, "rotrSH");
var rotrSL = /* @__PURE__ */ __name((h, l, s) => h << 32 - s | l >>> s, "rotrSL");
var rotrBH = /* @__PURE__ */ __name((h, l, s) => h << 64 - s | l >>> s - 32, "rotrBH");
var rotrBL = /* @__PURE__ */ __name((h, l, s) => h >>> s - 32 | l << 64 - s, "rotrBL");
function add(Ah, Al, Bh, Bl) {
  const l = (Al >>> 0) + (Bl >>> 0);
  return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
}
__name(add, "add");
var add3L = /* @__PURE__ */ __name((Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0), "add3L");
var add3H = /* @__PURE__ */ __name((low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0, "add3H");
var add4L = /* @__PURE__ */ __name((Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0), "add4L");
var add4H = /* @__PURE__ */ __name((low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0, "add4H");
var add5L = /* @__PURE__ */ __name((Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0), "add5L");
var add5H = /* @__PURE__ */ __name((low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0, "add5H");

// node_modules/@libp2p/crypto/node_modules/@noble/hashes/sha2.js
var SHA256_K = /* @__PURE__ */ Uint32Array.from([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
var SHA2_32B = class extends HashMD {
  static {
    __name(this, "SHA2_32B");
  }
  constructor(outputLen) {
    super(64, outputLen, 8, false);
  }
  get() {
    const { A, B, C, D, E, F, G, H } = this;
    return [A, B, C, D, E, F, G, H];
  }
  // prettier-ignore
  set(A, B, C, D, E, F, G, H) {
    this.A = A | 0;
    this.B = B | 0;
    this.C = C | 0;
    this.D = D | 0;
    this.E = E | 0;
    this.F = F | 0;
    this.G = G | 0;
    this.H = H | 0;
  }
  process(view, offset) {
    for (let i = 0; i < 16; i++, offset += 4)
      SHA256_W[i] = view.getUint32(offset, false);
    for (let i = 16; i < 64; i++) {
      const W15 = SHA256_W[i - 15];
      const W2 = SHA256_W[i - 2];
      const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
      const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
      SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
    }
    let { A, B, C, D, E, F, G, H } = this;
    for (let i = 0; i < 64; i++) {
      const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
      const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
      const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
      const T2 = sigma0 + Maj(A, B, C) | 0;
      H = G;
      G = F;
      F = E;
      E = D + T1 | 0;
      D = C;
      C = B;
      B = A;
      A = T1 + T2 | 0;
    }
    A = A + this.A | 0;
    B = B + this.B | 0;
    C = C + this.C | 0;
    D = D + this.D | 0;
    E = E + this.E | 0;
    F = F + this.F | 0;
    G = G + this.G | 0;
    H = H + this.H | 0;
    this.set(A, B, C, D, E, F, G, H);
  }
  roundClean() {
    clean(SHA256_W);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    clean(this.buffer);
  }
};
var _SHA256 = class extends SHA2_32B {
  static {
    __name(this, "_SHA256");
  }
  // We cannot use array here since array allows indexing by variable
  // which means optimizer/compiler cannot use registers.
  A = SHA256_IV[0] | 0;
  B = SHA256_IV[1] | 0;
  C = SHA256_IV[2] | 0;
  D = SHA256_IV[3] | 0;
  E = SHA256_IV[4] | 0;
  F = SHA256_IV[5] | 0;
  G = SHA256_IV[6] | 0;
  H = SHA256_IV[7] | 0;
  constructor() {
    super(32);
  }
};
var K512 = /* @__PURE__ */ (() => split([
  "0x428a2f98d728ae22",
  "0x7137449123ef65cd",
  "0xb5c0fbcfec4d3b2f",
  "0xe9b5dba58189dbbc",
  "0x3956c25bf348b538",
  "0x59f111f1b605d019",
  "0x923f82a4af194f9b",
  "0xab1c5ed5da6d8118",
  "0xd807aa98a3030242",
  "0x12835b0145706fbe",
  "0x243185be4ee4b28c",
  "0x550c7dc3d5ffb4e2",
  "0x72be5d74f27b896f",
  "0x80deb1fe3b1696b1",
  "0x9bdc06a725c71235",
  "0xc19bf174cf692694",
  "0xe49b69c19ef14ad2",
  "0xefbe4786384f25e3",
  "0x0fc19dc68b8cd5b5",
  "0x240ca1cc77ac9c65",
  "0x2de92c6f592b0275",
  "0x4a7484aa6ea6e483",
  "0x5cb0a9dcbd41fbd4",
  "0x76f988da831153b5",
  "0x983e5152ee66dfab",
  "0xa831c66d2db43210",
  "0xb00327c898fb213f",
  "0xbf597fc7beef0ee4",
  "0xc6e00bf33da88fc2",
  "0xd5a79147930aa725",
  "0x06ca6351e003826f",
  "0x142929670a0e6e70",
  "0x27b70a8546d22ffc",
  "0x2e1b21385c26c926",
  "0x4d2c6dfc5ac42aed",
  "0x53380d139d95b3df",
  "0x650a73548baf63de",
  "0x766a0abb3c77b2a8",
  "0x81c2c92e47edaee6",
  "0x92722c851482353b",
  "0xa2bfe8a14cf10364",
  "0xa81a664bbc423001",
  "0xc24b8b70d0f89791",
  "0xc76c51a30654be30",
  "0xd192e819d6ef5218",
  "0xd69906245565a910",
  "0xf40e35855771202a",
  "0x106aa07032bbd1b8",
  "0x19a4c116b8d2d0c8",
  "0x1e376c085141ab53",
  "0x2748774cdf8eeb99",
  "0x34b0bcb5e19b48a8",
  "0x391c0cb3c5c95a63",
  "0x4ed8aa4ae3418acb",
  "0x5b9cca4f7763e373",
  "0x682e6ff3d6b2b8a3",
  "0x748f82ee5defb2fc",
  "0x78a5636f43172f60",
  "0x84c87814a1f0ab72",
  "0x8cc702081a6439ec",
  "0x90befffa23631e28",
  "0xa4506cebde82bde9",
  "0xbef9a3f7b2c67915",
  "0xc67178f2e372532b",
  "0xca273eceea26619c",
  "0xd186b8c721c0c207",
  "0xeada7dd6cde0eb1e",
  "0xf57d4f7fee6ed178",
  "0x06f067aa72176fba",
  "0x0a637dc5a2c898a6",
  "0x113f9804bef90dae",
  "0x1b710b35131c471b",
  "0x28db77f523047d84",
  "0x32caab7b40c72493",
  "0x3c9ebe0a15c9bebc",
  "0x431d67c49c100d4c",
  "0x4cc5d4becb3e42b6",
  "0x597f299cfc657e2a",
  "0x5fcb6fab3ad6faec",
  "0x6c44198c4a475817"
].map((n) => BigInt(n))))();
var SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
var SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
var SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
var SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
var SHA2_64B = class extends HashMD {
  static {
    __name(this, "SHA2_64B");
  }
  constructor(outputLen) {
    super(128, outputLen, 16, false);
  }
  // prettier-ignore
  get() {
    const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
  }
  // prettier-ignore
  set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
    this.Ah = Ah | 0;
    this.Al = Al | 0;
    this.Bh = Bh | 0;
    this.Bl = Bl | 0;
    this.Ch = Ch | 0;
    this.Cl = Cl | 0;
    this.Dh = Dh | 0;
    this.Dl = Dl | 0;
    this.Eh = Eh | 0;
    this.El = El | 0;
    this.Fh = Fh | 0;
    this.Fl = Fl | 0;
    this.Gh = Gh | 0;
    this.Gl = Gl | 0;
    this.Hh = Hh | 0;
    this.Hl = Hl | 0;
  }
  process(view, offset) {
    for (let i = 0; i < 16; i++, offset += 4) {
      SHA512_W_H[i] = view.getUint32(offset);
      SHA512_W_L[i] = view.getUint32(offset += 4);
    }
    for (let i = 16; i < 80; i++) {
      const W15h = SHA512_W_H[i - 15] | 0;
      const W15l = SHA512_W_L[i - 15] | 0;
      const s0h = rotrSH(W15h, W15l, 1) ^ rotrSH(W15h, W15l, 8) ^ shrSH(W15h, W15l, 7);
      const s0l = rotrSL(W15h, W15l, 1) ^ rotrSL(W15h, W15l, 8) ^ shrSL(W15h, W15l, 7);
      const W2h = SHA512_W_H[i - 2] | 0;
      const W2l = SHA512_W_L[i - 2] | 0;
      const s1h = rotrSH(W2h, W2l, 19) ^ rotrBH(W2h, W2l, 61) ^ shrSH(W2h, W2l, 6);
      const s1l = rotrSL(W2h, W2l, 19) ^ rotrBL(W2h, W2l, 61) ^ shrSL(W2h, W2l, 6);
      const SUMl = add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
      const SUMh = add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
      SHA512_W_H[i] = SUMh | 0;
      SHA512_W_L[i] = SUMl | 0;
    }
    let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    for (let i = 0; i < 80; i++) {
      const sigma1h = rotrSH(Eh, El, 14) ^ rotrSH(Eh, El, 18) ^ rotrBH(Eh, El, 41);
      const sigma1l = rotrSL(Eh, El, 14) ^ rotrSL(Eh, El, 18) ^ rotrBL(Eh, El, 41);
      const CHIh = Eh & Fh ^ ~Eh & Gh;
      const CHIl = El & Fl ^ ~El & Gl;
      const T1ll = add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
      const T1h = add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
      const T1l = T1ll | 0;
      const sigma0h = rotrSH(Ah, Al, 28) ^ rotrBH(Ah, Al, 34) ^ rotrBH(Ah, Al, 39);
      const sigma0l = rotrSL(Ah, Al, 28) ^ rotrBL(Ah, Al, 34) ^ rotrBL(Ah, Al, 39);
      const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
      const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
      Hh = Gh | 0;
      Hl = Gl | 0;
      Gh = Fh | 0;
      Gl = Fl | 0;
      Fh = Eh | 0;
      Fl = El | 0;
      ({ h: Eh, l: El } = add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
      Dh = Ch | 0;
      Dl = Cl | 0;
      Ch = Bh | 0;
      Cl = Bl | 0;
      Bh = Ah | 0;
      Bl = Al | 0;
      const All = add3L(T1l, sigma0l, MAJl);
      Ah = add3H(All, T1h, sigma0h, MAJh);
      Al = All | 0;
    }
    ({ h: Ah, l: Al } = add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
    ({ h: Bh, l: Bl } = add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
    ({ h: Ch, l: Cl } = add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
    ({ h: Dh, l: Dl } = add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
    ({ h: Eh, l: El } = add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
    ({ h: Fh, l: Fl } = add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
    ({ h: Gh, l: Gl } = add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
    ({ h: Hh, l: Hl } = add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
    this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
  }
  roundClean() {
    clean(SHA512_W_H, SHA512_W_L);
  }
  destroy() {
    clean(this.buffer);
    this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
var _SHA512 = class extends SHA2_64B {
  static {
    __name(this, "_SHA512");
  }
  Ah = SHA512_IV[0] | 0;
  Al = SHA512_IV[1] | 0;
  Bh = SHA512_IV[2] | 0;
  Bl = SHA512_IV[3] | 0;
  Ch = SHA512_IV[4] | 0;
  Cl = SHA512_IV[5] | 0;
  Dh = SHA512_IV[6] | 0;
  Dl = SHA512_IV[7] | 0;
  Eh = SHA512_IV[8] | 0;
  El = SHA512_IV[9] | 0;
  Fh = SHA512_IV[10] | 0;
  Fl = SHA512_IV[11] | 0;
  Gh = SHA512_IV[12] | 0;
  Gl = SHA512_IV[13] | 0;
  Hh = SHA512_IV[14] | 0;
  Hl = SHA512_IV[15] | 0;
  constructor() {
    super(64);
  }
};
var sha2562 = /* @__PURE__ */ createHasher(
  () => new _SHA256(),
  /* @__PURE__ */ oidNist(1)
);
var sha5122 = /* @__PURE__ */ createHasher(
  () => new _SHA512(),
  /* @__PURE__ */ oidNist(3)
);

// node_modules/@libp2p/crypto/node_modules/@noble/curves/utils.js
var _0n = /* @__PURE__ */ BigInt(0);
var _1n = /* @__PURE__ */ BigInt(1);
function abool(value2, title = "") {
  if (typeof value2 !== "boolean") {
    const prefix = title && `"${title}" `;
    throw new Error(prefix + "expected boolean, got type=" + typeof value2);
  }
  return value2;
}
__name(abool, "abool");
function abignumber(n) {
  if (typeof n === "bigint") {
    if (!isPosBig(n))
      throw new Error("positive bigint expected, got " + n);
  } else
    anumber(n);
  return n;
}
__name(abignumber, "abignumber");
function numberToHexUnpadded(num) {
  const hex = abignumber(num).toString(16);
  return hex.length & 1 ? "0" + hex : hex;
}
__name(numberToHexUnpadded, "numberToHexUnpadded");
function hexToNumber(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  return hex === "" ? _0n : BigInt("0x" + hex);
}
__name(hexToNumber, "hexToNumber");
function bytesToNumberBE(bytes) {
  return hexToNumber(bytesToHex(bytes));
}
__name(bytesToNumberBE, "bytesToNumberBE");
function bytesToNumberLE(bytes) {
  return hexToNumber(bytesToHex(copyBytes(abytes(bytes)).reverse()));
}
__name(bytesToNumberLE, "bytesToNumberLE");
function numberToBytesBE(n, len) {
  anumber(len);
  n = abignumber(n);
  const res = hexToBytes(n.toString(16).padStart(len * 2, "0"));
  if (res.length !== len)
    throw new Error("number too large");
  return res;
}
__name(numberToBytesBE, "numberToBytesBE");
function numberToBytesLE(n, len) {
  return numberToBytesBE(n, len).reverse();
}
__name(numberToBytesLE, "numberToBytesLE");
function copyBytes(bytes) {
  return Uint8Array.from(bytes);
}
__name(copyBytes, "copyBytes");
var isPosBig = /* @__PURE__ */ __name((n) => typeof n === "bigint" && _0n <= n, "isPosBig");
function inRange(n, min, max) {
  return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
}
__name(inRange, "inRange");
function aInRange(title, n, min, max) {
  if (!inRange(n, min, max))
    throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
}
__name(aInRange, "aInRange");
function bitLen(n) {
  let len;
  for (len = 0; n > _0n; n >>= _1n, len += 1)
    ;
  return len;
}
__name(bitLen, "bitLen");
var bitMask = /* @__PURE__ */ __name((n) => (_1n << BigInt(n)) - _1n, "bitMask");
function createHmacDrbg(hashLen, qByteLen, hmacFn) {
  anumber(hashLen, "hashLen");
  anumber(qByteLen, "qByteLen");
  if (typeof hmacFn !== "function")
    throw new Error("hmacFn must be a function");
  const u8n = /* @__PURE__ */ __name((len) => new Uint8Array(len), "u8n");
  const NULL = Uint8Array.of();
  const byte0 = Uint8Array.of(0);
  const byte1 = Uint8Array.of(1);
  const _maxDrbgIters = 1e3;
  let v = u8n(hashLen);
  let k = u8n(hashLen);
  let i = 0;
  const reset = /* @__PURE__ */ __name(() => {
    v.fill(1);
    k.fill(0);
    i = 0;
  }, "reset");
  const h = /* @__PURE__ */ __name((...msgs) => hmacFn(k, concatBytes(v, ...msgs)), "h");
  const reseed = /* @__PURE__ */ __name((seed = NULL) => {
    k = h(byte0, seed);
    v = h();
    if (seed.length === 0)
      return;
    k = h(byte1, seed);
    v = h();
  }, "reseed");
  const gen = /* @__PURE__ */ __name(() => {
    if (i++ >= _maxDrbgIters)
      throw new Error("drbg: tried max amount of iterations");
    let len = 0;
    const out = [];
    while (len < qByteLen) {
      v = h();
      const sl = v.slice();
      out.push(sl);
      len += v.length;
    }
    return concatBytes(...out);
  }, "gen");
  const genUntil = /* @__PURE__ */ __name((seed, pred) => {
    reset();
    reseed(seed);
    let res = void 0;
    while (!(res = pred(gen())))
      reseed();
    reset();
    return res;
  }, "genUntil");
  return genUntil;
}
__name(createHmacDrbg, "createHmacDrbg");
function validateObject(object, fields = {}, optFields = {}) {
  if (!object || typeof object !== "object")
    throw new Error("expected valid options object");
  function checkField(fieldName, expectedType, isOpt) {
    const val = object[fieldName];
    if (isOpt && val === void 0)
      return;
    const current = typeof val;
    if (current !== expectedType || val === null)
      throw new Error(`param "${fieldName}" is invalid: expected ${expectedType}, got ${current}`);
  }
  __name(checkField, "checkField");
  const iter = /* @__PURE__ */ __name((f, isOpt) => Object.entries(f).forEach(([k, v]) => checkField(k, v, isOpt)), "iter");
  iter(fields, false);
  iter(optFields, true);
}
__name(validateObject, "validateObject");
function memoized(fn) {
  const map = /* @__PURE__ */ new WeakMap();
  return (arg, ...args) => {
    const val = map.get(arg);
    if (val !== void 0)
      return val;
    const computed = fn(arg, ...args);
    map.set(arg, computed);
    return computed;
  };
}
__name(memoized, "memoized");

// node_modules/@libp2p/crypto/node_modules/@noble/curves/abstract/modular.js
var _0n2 = /* @__PURE__ */ BigInt(0);
var _1n2 = /* @__PURE__ */ BigInt(1);
var _2n = /* @__PURE__ */ BigInt(2);
var _3n = /* @__PURE__ */ BigInt(3);
var _4n = /* @__PURE__ */ BigInt(4);
var _5n = /* @__PURE__ */ BigInt(5);
var _7n = /* @__PURE__ */ BigInt(7);
var _8n = /* @__PURE__ */ BigInt(8);
var _9n = /* @__PURE__ */ BigInt(9);
var _16n = /* @__PURE__ */ BigInt(16);
function mod(a, b) {
  const result = a % b;
  return result >= _0n2 ? result : b + result;
}
__name(mod, "mod");
function pow2(x, power, modulo) {
  let res = x;
  while (power-- > _0n2) {
    res *= res;
    res %= modulo;
  }
  return res;
}
__name(pow2, "pow2");
function invert(number, modulo) {
  if (number === _0n2)
    throw new Error("invert: expected non-zero number");
  if (modulo <= _0n2)
    throw new Error("invert: expected positive modulus, got " + modulo);
  let a = mod(number, modulo);
  let b = modulo;
  let x = _0n2, y = _1n2, u = _1n2, v = _0n2;
  while (a !== _0n2) {
    const q = b / a;
    const r = b % a;
    const m = x - u * q;
    const n = y - v * q;
    b = a, a = r, x = u, y = v, u = m, v = n;
  }
  const gcd = b;
  if (gcd !== _1n2)
    throw new Error("invert: does not exist");
  return mod(x, modulo);
}
__name(invert, "invert");
function assertIsSquare(Fp, root, n) {
  if (!Fp.eql(Fp.sqr(root), n))
    throw new Error("Cannot find square root");
}
__name(assertIsSquare, "assertIsSquare");
function sqrt3mod4(Fp, n) {
  const p1div4 = (Fp.ORDER + _1n2) / _4n;
  const root = Fp.pow(n, p1div4);
  assertIsSquare(Fp, root, n);
  return root;
}
__name(sqrt3mod4, "sqrt3mod4");
function sqrt5mod8(Fp, n) {
  const p5div8 = (Fp.ORDER - _5n) / _8n;
  const n2 = Fp.mul(n, _2n);
  const v = Fp.pow(n2, p5div8);
  const nv = Fp.mul(n, v);
  const i = Fp.mul(Fp.mul(nv, _2n), v);
  const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
  assertIsSquare(Fp, root, n);
  return root;
}
__name(sqrt5mod8, "sqrt5mod8");
function sqrt9mod16(P) {
  const Fp_ = Field(P);
  const tn = tonelliShanks(P);
  const c1 = tn(Fp_, Fp_.neg(Fp_.ONE));
  const c2 = tn(Fp_, c1);
  const c3 = tn(Fp_, Fp_.neg(c1));
  const c4 = (P + _7n) / _16n;
  return (Fp, n) => {
    let tv1 = Fp.pow(n, c4);
    let tv2 = Fp.mul(tv1, c1);
    const tv3 = Fp.mul(tv1, c2);
    const tv4 = Fp.mul(tv1, c3);
    const e1 = Fp.eql(Fp.sqr(tv2), n);
    const e2 = Fp.eql(Fp.sqr(tv3), n);
    tv1 = Fp.cmov(tv1, tv2, e1);
    tv2 = Fp.cmov(tv4, tv3, e2);
    const e3 = Fp.eql(Fp.sqr(tv2), n);
    const root = Fp.cmov(tv1, tv2, e3);
    assertIsSquare(Fp, root, n);
    return root;
  };
}
__name(sqrt9mod16, "sqrt9mod16");
function tonelliShanks(P) {
  if (P < _3n)
    throw new Error("sqrt is not defined for small field");
  let Q = P - _1n2;
  let S = 0;
  while (Q % _2n === _0n2) {
    Q /= _2n;
    S++;
  }
  let Z = _2n;
  const _Fp = Field(P);
  while (FpLegendre(_Fp, Z) === 1) {
    if (Z++ > 1e3)
      throw new Error("Cannot find square root: probably non-prime P");
  }
  if (S === 1)
    return sqrt3mod4;
  let cc = _Fp.pow(Z, Q);
  const Q1div2 = (Q + _1n2) / _2n;
  return /* @__PURE__ */ __name(function tonelliSlow(Fp, n) {
    if (Fp.is0(n))
      return n;
    if (FpLegendre(Fp, n) !== 1)
      throw new Error("Cannot find square root");
    let M = S;
    let c = Fp.mul(Fp.ONE, cc);
    let t = Fp.pow(n, Q);
    let R = Fp.pow(n, Q1div2);
    while (!Fp.eql(t, Fp.ONE)) {
      if (Fp.is0(t))
        return Fp.ZERO;
      let i = 1;
      let t_tmp = Fp.sqr(t);
      while (!Fp.eql(t_tmp, Fp.ONE)) {
        i++;
        t_tmp = Fp.sqr(t_tmp);
        if (i === M)
          throw new Error("Cannot find square root");
      }
      const exponent = _1n2 << BigInt(M - i - 1);
      const b = Fp.pow(c, exponent);
      M = i;
      c = Fp.sqr(b);
      t = Fp.mul(t, c);
      R = Fp.mul(R, b);
    }
    return R;
  }, "tonelliSlow");
}
__name(tonelliShanks, "tonelliShanks");
function FpSqrt(P) {
  if (P % _4n === _3n)
    return sqrt3mod4;
  if (P % _8n === _5n)
    return sqrt5mod8;
  if (P % _16n === _9n)
    return sqrt9mod16(P);
  return tonelliShanks(P);
}
__name(FpSqrt, "FpSqrt");
var isNegativeLE = /* @__PURE__ */ __name((num, modulo) => (mod(num, modulo) & _1n2) === _1n2, "isNegativeLE");
var FIELD_FIELDS = [
  "create",
  "isValid",
  "is0",
  "neg",
  "inv",
  "sqrt",
  "sqr",
  "eql",
  "add",
  "sub",
  "mul",
  "pow",
  "div",
  "addN",
  "subN",
  "mulN",
  "sqrN"
];
function validateField(field) {
  const initial = {
    ORDER: "bigint",
    BYTES: "number",
    BITS: "number"
  };
  const opts = FIELD_FIELDS.reduce((map, val) => {
    map[val] = "function";
    return map;
  }, initial);
  validateObject(field, opts);
  return field;
}
__name(validateField, "validateField");
function FpPow(Fp, num, power) {
  if (power < _0n2)
    throw new Error("invalid exponent, negatives unsupported");
  if (power === _0n2)
    return Fp.ONE;
  if (power === _1n2)
    return num;
  let p = Fp.ONE;
  let d = num;
  while (power > _0n2) {
    if (power & _1n2)
      p = Fp.mul(p, d);
    d = Fp.sqr(d);
    power >>= _1n2;
  }
  return p;
}
__name(FpPow, "FpPow");
function FpInvertBatch(Fp, nums, passZero = false) {
  const inverted = new Array(nums.length).fill(passZero ? Fp.ZERO : void 0);
  const multipliedAcc = nums.reduce((acc, num, i) => {
    if (Fp.is0(num))
      return acc;
    inverted[i] = acc;
    return Fp.mul(acc, num);
  }, Fp.ONE);
  const invertedAcc = Fp.inv(multipliedAcc);
  nums.reduceRight((acc, num, i) => {
    if (Fp.is0(num))
      return acc;
    inverted[i] = Fp.mul(acc, inverted[i]);
    return Fp.mul(acc, num);
  }, invertedAcc);
  return inverted;
}
__name(FpInvertBatch, "FpInvertBatch");
function FpLegendre(Fp, n) {
  const p1mod2 = (Fp.ORDER - _1n2) / _2n;
  const powered = Fp.pow(n, p1mod2);
  const yes = Fp.eql(powered, Fp.ONE);
  const zero2 = Fp.eql(powered, Fp.ZERO);
  const no = Fp.eql(powered, Fp.neg(Fp.ONE));
  if (!yes && !zero2 && !no)
    throw new Error("invalid Legendre symbol result");
  return yes ? 1 : zero2 ? 0 : -1;
}
__name(FpLegendre, "FpLegendre");
function nLength(n, nBitLength) {
  if (nBitLength !== void 0)
    anumber(nBitLength);
  const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
  const nByteLength = Math.ceil(_nBitLength / 8);
  return { nBitLength: _nBitLength, nByteLength };
}
__name(nLength, "nLength");
var _Field = class {
  static {
    __name(this, "_Field");
  }
  ORDER;
  BITS;
  BYTES;
  isLE;
  ZERO = _0n2;
  ONE = _1n2;
  _lengths;
  _sqrt;
  // cached sqrt
  _mod;
  constructor(ORDER, opts = {}) {
    if (ORDER <= _0n2)
      throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
    let _nbitLength = void 0;
    this.isLE = false;
    if (opts != null && typeof opts === "object") {
      if (typeof opts.BITS === "number")
        _nbitLength = opts.BITS;
      if (typeof opts.sqrt === "function")
        this.sqrt = opts.sqrt;
      if (typeof opts.isLE === "boolean")
        this.isLE = opts.isLE;
      if (opts.allowedLengths)
        this._lengths = opts.allowedLengths?.slice();
      if (typeof opts.modFromBytes === "boolean")
        this._mod = opts.modFromBytes;
    }
    const { nBitLength, nByteLength } = nLength(ORDER, _nbitLength);
    if (nByteLength > 2048)
      throw new Error("invalid field: expected ORDER of <= 2048 bytes");
    this.ORDER = ORDER;
    this.BITS = nBitLength;
    this.BYTES = nByteLength;
    this._sqrt = void 0;
    Object.preventExtensions(this);
  }
  create(num) {
    return mod(num, this.ORDER);
  }
  isValid(num) {
    if (typeof num !== "bigint")
      throw new Error("invalid field element: expected bigint, got " + typeof num);
    return _0n2 <= num && num < this.ORDER;
  }
  is0(num) {
    return num === _0n2;
  }
  // is valid and invertible
  isValidNot0(num) {
    return !this.is0(num) && this.isValid(num);
  }
  isOdd(num) {
    return (num & _1n2) === _1n2;
  }
  neg(num) {
    return mod(-num, this.ORDER);
  }
  eql(lhs, rhs) {
    return lhs === rhs;
  }
  sqr(num) {
    return mod(num * num, this.ORDER);
  }
  add(lhs, rhs) {
    return mod(lhs + rhs, this.ORDER);
  }
  sub(lhs, rhs) {
    return mod(lhs - rhs, this.ORDER);
  }
  mul(lhs, rhs) {
    return mod(lhs * rhs, this.ORDER);
  }
  pow(num, power) {
    return FpPow(this, num, power);
  }
  div(lhs, rhs) {
    return mod(lhs * invert(rhs, this.ORDER), this.ORDER);
  }
  // Same as above, but doesn't normalize
  sqrN(num) {
    return num * num;
  }
  addN(lhs, rhs) {
    return lhs + rhs;
  }
  subN(lhs, rhs) {
    return lhs - rhs;
  }
  mulN(lhs, rhs) {
    return lhs * rhs;
  }
  inv(num) {
    return invert(num, this.ORDER);
  }
  sqrt(num) {
    if (!this._sqrt)
      this._sqrt = FpSqrt(this.ORDER);
    return this._sqrt(this, num);
  }
  toBytes(num) {
    return this.isLE ? numberToBytesLE(num, this.BYTES) : numberToBytesBE(num, this.BYTES);
  }
  fromBytes(bytes, skipValidation = false) {
    abytes(bytes);
    const { _lengths: allowedLengths, BYTES, isLE, ORDER, _mod: modFromBytes } = this;
    if (allowedLengths) {
      if (!allowedLengths.includes(bytes.length) || bytes.length > BYTES) {
        throw new Error("Field.fromBytes: expected " + allowedLengths + " bytes, got " + bytes.length);
      }
      const padded = new Uint8Array(BYTES);
      padded.set(bytes, isLE ? 0 : padded.length - bytes.length);
      bytes = padded;
    }
    if (bytes.length !== BYTES)
      throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
    let scalar = isLE ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
    if (modFromBytes)
      scalar = mod(scalar, ORDER);
    if (!skipValidation) {
      if (!this.isValid(scalar))
        throw new Error("invalid field element: outside of range 0..ORDER");
    }
    return scalar;
  }
  // TODO: we don't need it here, move out to separate fn
  invertBatch(lst) {
    return FpInvertBatch(this, lst);
  }
  // We can't move this out because Fp6, Fp12 implement it
  // and it's unclear what to return in there.
  cmov(a, b, condition) {
    return condition ? b : a;
  }
};
function Field(ORDER, opts = {}) {
  return new _Field(ORDER, opts);
}
__name(Field, "Field");
function getFieldBytesLength(fieldOrder) {
  if (typeof fieldOrder !== "bigint")
    throw new Error("field order must be bigint");
  const bitLength = fieldOrder.toString(2).length;
  return Math.ceil(bitLength / 8);
}
__name(getFieldBytesLength, "getFieldBytesLength");
function getMinHashLength(fieldOrder) {
  const length3 = getFieldBytesLength(fieldOrder);
  return length3 + Math.ceil(length3 / 2);
}
__name(getMinHashLength, "getMinHashLength");
function mapHashToField(key, fieldOrder, isLE = false) {
  abytes(key);
  const len = key.length;
  const fieldLen = getFieldBytesLength(fieldOrder);
  const minLen = getMinHashLength(fieldOrder);
  if (len < 16 || len < minLen || len > 1024)
    throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
  const num = isLE ? bytesToNumberLE(key) : bytesToNumberBE(key);
  const reduced = mod(num, fieldOrder - _1n2) + _1n2;
  return isLE ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
}
__name(mapHashToField, "mapHashToField");

// node_modules/@libp2p/crypto/node_modules/@noble/curves/abstract/curve.js
var _0n3 = /* @__PURE__ */ BigInt(0);
var _1n3 = /* @__PURE__ */ BigInt(1);
function negateCt(condition, item) {
  const neg = item.negate();
  return condition ? neg : item;
}
__name(negateCt, "negateCt");
function normalizeZ(c, points) {
  const invertedZs = FpInvertBatch(c.Fp, points.map((p) => p.Z));
  return points.map((p, i) => c.fromAffine(p.toAffine(invertedZs[i])));
}
__name(normalizeZ, "normalizeZ");
function validateW(W, bits) {
  if (!Number.isSafeInteger(W) || W <= 0 || W > bits)
    throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W);
}
__name(validateW, "validateW");
function calcWOpts(W, scalarBits) {
  validateW(W, scalarBits);
  const windows = Math.ceil(scalarBits / W) + 1;
  const windowSize = 2 ** (W - 1);
  const maxNumber = 2 ** W;
  const mask = bitMask(W);
  const shiftBy = BigInt(W);
  return { windows, windowSize, mask, maxNumber, shiftBy };
}
__name(calcWOpts, "calcWOpts");
function calcOffsets(n, window, wOpts) {
  const { windowSize, mask, maxNumber, shiftBy } = wOpts;
  let wbits = Number(n & mask);
  let nextN = n >> shiftBy;
  if (wbits > windowSize) {
    wbits -= maxNumber;
    nextN += _1n3;
  }
  const offsetStart = window * windowSize;
  const offset = offsetStart + Math.abs(wbits) - 1;
  const isZero = wbits === 0;
  const isNeg = wbits < 0;
  const isNegF = window % 2 !== 0;
  const offsetF = offsetStart;
  return { nextN, offset, isZero, isNeg, isNegF, offsetF };
}
__name(calcOffsets, "calcOffsets");
var pointPrecomputes = /* @__PURE__ */ new WeakMap();
var pointWindowSizes = /* @__PURE__ */ new WeakMap();
function getW(P) {
  return pointWindowSizes.get(P) || 1;
}
__name(getW, "getW");
function assert0(n) {
  if (n !== _0n3)
    throw new Error("invalid wNAF");
}
__name(assert0, "assert0");
var wNAF = class {
  static {
    __name(this, "wNAF");
  }
  BASE;
  ZERO;
  Fn;
  bits;
  // Parametrized with a given Point class (not individual point)
  constructor(Point, bits) {
    this.BASE = Point.BASE;
    this.ZERO = Point.ZERO;
    this.Fn = Point.Fn;
    this.bits = bits;
  }
  // non-const time multiplication ladder
  _unsafeLadder(elm, n, p = this.ZERO) {
    let d = elm;
    while (n > _0n3) {
      if (n & _1n3)
        p = p.add(d);
      d = d.double();
      n >>= _1n3;
    }
    return p;
  }
  /**
   * Creates a wNAF precomputation window. Used for caching.
   * Default window size is set by `utils.precompute()` and is equal to 8.
   * Number of precomputed points depends on the curve size:
   * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
   * - 𝑊 is the window size
   * - 𝑛 is the bitlength of the curve order.
   * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
   * @param point Point instance
   * @param W window size
   * @returns precomputed point tables flattened to a single array
   */
  precomputeWindow(point, W) {
    const { windows, windowSize } = calcWOpts(W, this.bits);
    const points = [];
    let p = point;
    let base3 = p;
    for (let window = 0; window < windows; window++) {
      base3 = p;
      points.push(base3);
      for (let i = 1; i < windowSize; i++) {
        base3 = base3.add(p);
        points.push(base3);
      }
      p = base3.double();
    }
    return points;
  }
  /**
   * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
   * More compact implementation:
   * https://github.com/paulmillr/noble-secp256k1/blob/47cb1669b6e506ad66b35fe7d76132ae97465da2/index.ts#L502-L541
   * @returns real and fake (for const-time) points
   */
  wNAF(W, precomputes, n) {
    if (!this.Fn.isValid(n))
      throw new Error("invalid scalar");
    let p = this.ZERO;
    let f = this.BASE;
    const wo = calcWOpts(W, this.bits);
    for (let window = 0; window < wo.windows; window++) {
      const { nextN, offset, isZero, isNeg, isNegF, offsetF } = calcOffsets(n, window, wo);
      n = nextN;
      if (isZero) {
        f = f.add(negateCt(isNegF, precomputes[offsetF]));
      } else {
        p = p.add(negateCt(isNeg, precomputes[offset]));
      }
    }
    assert0(n);
    return { p, f };
  }
  /**
   * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
   * @param acc accumulator point to add result of multiplication
   * @returns point
   */
  wNAFUnsafe(W, precomputes, n, acc = this.ZERO) {
    const wo = calcWOpts(W, this.bits);
    for (let window = 0; window < wo.windows; window++) {
      if (n === _0n3)
        break;
      const { nextN, offset, isZero, isNeg } = calcOffsets(n, window, wo);
      n = nextN;
      if (isZero) {
        continue;
      } else {
        const item = precomputes[offset];
        acc = acc.add(isNeg ? item.negate() : item);
      }
    }
    assert0(n);
    return acc;
  }
  getPrecomputes(W, point, transform) {
    let comp = pointPrecomputes.get(point);
    if (!comp) {
      comp = this.precomputeWindow(point, W);
      if (W !== 1) {
        if (typeof transform === "function")
          comp = transform(comp);
        pointPrecomputes.set(point, comp);
      }
    }
    return comp;
  }
  cached(point, scalar, transform) {
    const W = getW(point);
    return this.wNAF(W, this.getPrecomputes(W, point, transform), scalar);
  }
  unsafe(point, scalar, transform, prev) {
    const W = getW(point);
    if (W === 1)
      return this._unsafeLadder(point, scalar, prev);
    return this.wNAFUnsafe(W, this.getPrecomputes(W, point, transform), scalar, prev);
  }
  // We calculate precomputes for elliptic curve point multiplication
  // using windowed method. This specifies window size and
  // stores precomputed values. Usually only base point would be precomputed.
  createCache(P, W) {
    validateW(W, this.bits);
    pointWindowSizes.set(P, W);
    pointPrecomputes.delete(P);
  }
  hasCache(elm) {
    return getW(elm) !== 1;
  }
};
function mulEndoUnsafe(Point, point, k1, k2) {
  let acc = point;
  let p1 = Point.ZERO;
  let p2 = Point.ZERO;
  while (k1 > _0n3 || k2 > _0n3) {
    if (k1 & _1n3)
      p1 = p1.add(acc);
    if (k2 & _1n3)
      p2 = p2.add(acc);
    acc = acc.double();
    k1 >>= _1n3;
    k2 >>= _1n3;
  }
  return { p1, p2 };
}
__name(mulEndoUnsafe, "mulEndoUnsafe");
function createField(order, field, isLE) {
  if (field) {
    if (field.ORDER !== order)
      throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
    validateField(field);
    return field;
  } else {
    return Field(order, { isLE });
  }
}
__name(createField, "createField");
function createCurveFields(type, CURVE, curveOpts = {}, FpFnLE) {
  if (FpFnLE === void 0)
    FpFnLE = type === "edwards";
  if (!CURVE || typeof CURVE !== "object")
    throw new Error(`expected valid ${type} CURVE object`);
  for (const p of ["p", "n", "h"]) {
    const val = CURVE[p];
    if (!(typeof val === "bigint" && val > _0n3))
      throw new Error(`CURVE.${p} must be positive bigint`);
  }
  const Fp = createField(CURVE.p, curveOpts.Fp, FpFnLE);
  const Fn = createField(CURVE.n, curveOpts.Fn, FpFnLE);
  const _b = type === "weierstrass" ? "b" : "d";
  const params = ["Gx", "Gy", "a", _b];
  for (const p of params) {
    if (!Fp.isValid(CURVE[p]))
      throw new Error(`CURVE.${p} must be valid field element of CURVE.Fp`);
  }
  CURVE = Object.freeze(Object.assign({}, CURVE));
  return { CURVE, Fp, Fn };
}
__name(createCurveFields, "createCurveFields");
function createKeygen(randomSecretKey, getPublicKey) {
  return /* @__PURE__ */ __name(function keygen(seed) {
    const secretKey = randomSecretKey(seed);
    return { secretKey, publicKey: getPublicKey(secretKey) };
  }, "keygen");
}
__name(createKeygen, "createKeygen");

// node_modules/@libp2p/crypto/node_modules/@noble/curves/abstract/edwards.js
var _0n4 = BigInt(0);
var _1n4 = BigInt(1);
var _2n2 = BigInt(2);
var _8n2 = BigInt(8);
function isEdValidXY(Fp, CURVE, x, y) {
  const x2 = Fp.sqr(x);
  const y2 = Fp.sqr(y);
  const left = Fp.add(Fp.mul(CURVE.a, x2), y2);
  const right = Fp.add(Fp.ONE, Fp.mul(CURVE.d, Fp.mul(x2, y2)));
  return Fp.eql(left, right);
}
__name(isEdValidXY, "isEdValidXY");
function edwards(params, extraOpts = {}) {
  const validated = createCurveFields("edwards", params, extraOpts, extraOpts.FpFnLE);
  const { Fp, Fn } = validated;
  let CURVE = validated.CURVE;
  const { h: cofactor } = CURVE;
  validateObject(extraOpts, {}, { uvRatio: "function" });
  const MASK = _2n2 << BigInt(Fn.BYTES * 8) - _1n4;
  const modP = /* @__PURE__ */ __name((n) => Fp.create(n), "modP");
  const uvRatio2 = extraOpts.uvRatio || ((u, v) => {
    try {
      return { isValid: true, value: Fp.sqrt(Fp.div(u, v)) };
    } catch (e) {
      return { isValid: false, value: _0n4 };
    }
  });
  if (!isEdValidXY(Fp, CURVE, CURVE.Gx, CURVE.Gy))
    throw new Error("bad curve params: generator point");
  function acoord(title, n, banZero = false) {
    const min = banZero ? _1n4 : _0n4;
    aInRange("coordinate " + title, n, min, MASK);
    return n;
  }
  __name(acoord, "acoord");
  function aedpoint(other) {
    if (!(other instanceof Point))
      throw new Error("EdwardsPoint expected");
  }
  __name(aedpoint, "aedpoint");
  const toAffineMemo = memoized((p, iz) => {
    const { X, Y, Z } = p;
    const is0 = p.is0();
    if (iz == null)
      iz = is0 ? _8n2 : Fp.inv(Z);
    const x = modP(X * iz);
    const y = modP(Y * iz);
    const zz = Fp.mul(Z, iz);
    if (is0)
      return { x: _0n4, y: _1n4 };
    if (zz !== _1n4)
      throw new Error("invZ was invalid");
    return { x, y };
  });
  const assertValidMemo = memoized((p) => {
    const { a, d } = CURVE;
    if (p.is0())
      throw new Error("bad point: ZERO");
    const { X, Y, Z, T } = p;
    const X2 = modP(X * X);
    const Y2 = modP(Y * Y);
    const Z2 = modP(Z * Z);
    const Z4 = modP(Z2 * Z2);
    const aX2 = modP(X2 * a);
    const left = modP(Z2 * modP(aX2 + Y2));
    const right = modP(Z4 + modP(d * modP(X2 * Y2)));
    if (left !== right)
      throw new Error("bad point: equation left != right (1)");
    const XY = modP(X * Y);
    const ZT = modP(Z * T);
    if (XY !== ZT)
      throw new Error("bad point: equation left != right (2)");
    return true;
  });
  class Point {
    static {
      __name(this, "Point");
    }
    // base / generator point
    static BASE = new Point(CURVE.Gx, CURVE.Gy, _1n4, modP(CURVE.Gx * CURVE.Gy));
    // zero / infinity / identity point
    static ZERO = new Point(_0n4, _1n4, _1n4, _0n4);
    // 0, 1, 1, 0
    // math field
    static Fp = Fp;
    // scalar field
    static Fn = Fn;
    X;
    Y;
    Z;
    T;
    constructor(X, Y, Z, T) {
      this.X = acoord("x", X);
      this.Y = acoord("y", Y);
      this.Z = acoord("z", Z, true);
      this.T = acoord("t", T);
      Object.freeze(this);
    }
    static CURVE() {
      return CURVE;
    }
    static fromAffine(p) {
      if (p instanceof Point)
        throw new Error("extended point not allowed");
      const { x, y } = p || {};
      acoord("x", x);
      acoord("y", y);
      return new Point(x, y, _1n4, modP(x * y));
    }
    // Uses algo from RFC8032 5.1.3.
    static fromBytes(bytes, zip215 = false) {
      const len = Fp.BYTES;
      const { a, d } = CURVE;
      bytes = copyBytes(abytes(bytes, len, "point"));
      abool(zip215, "zip215");
      const normed = copyBytes(bytes);
      const lastByte = bytes[len - 1];
      normed[len - 1] = lastByte & ~128;
      const y = bytesToNumberLE(normed);
      const max = zip215 ? MASK : Fp.ORDER;
      aInRange("point.y", y, _0n4, max);
      const y2 = modP(y * y);
      const u = modP(y2 - _1n4);
      const v = modP(d * y2 - a);
      let { isValid: isValid2, value: x } = uvRatio2(u, v);
      if (!isValid2)
        throw new Error("bad point: invalid y coordinate");
      const isXOdd = (x & _1n4) === _1n4;
      const isLastByteOdd = (lastByte & 128) !== 0;
      if (!zip215 && x === _0n4 && isLastByteOdd)
        throw new Error("bad point: x=0 and x_0=1");
      if (isLastByteOdd !== isXOdd)
        x = modP(-x);
      return Point.fromAffine({ x, y });
    }
    static fromHex(hex, zip215 = false) {
      return Point.fromBytes(hexToBytes(hex), zip215);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    precompute(windowSize = 8, isLazy = true) {
      wnaf.createCache(this, windowSize);
      if (!isLazy)
        this.multiply(_2n2);
      return this;
    }
    // Useful in fromAffine() - not for fromBytes(), which always created valid points.
    assertValidity() {
      assertValidMemo(this);
    }
    // Compare one point to another.
    equals(other) {
      aedpoint(other);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const { X: X2, Y: Y2, Z: Z2 } = other;
      const X1Z2 = modP(X1 * Z2);
      const X2Z1 = modP(X2 * Z1);
      const Y1Z2 = modP(Y1 * Z2);
      const Y2Z1 = modP(Y2 * Z1);
      return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
    }
    is0() {
      return this.equals(Point.ZERO);
    }
    negate() {
      return new Point(modP(-this.X), this.Y, this.Z, modP(-this.T));
    }
    // Fast algo for doubling Extended Point.
    // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#doubling-dbl-2008-hwcd
    // Cost: 4M + 4S + 1*a + 6add + 1*2.
    double() {
      const { a } = CURVE;
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const A = modP(X1 * X1);
      const B = modP(Y1 * Y1);
      const C = modP(_2n2 * modP(Z1 * Z1));
      const D = modP(a * A);
      const x1y1 = X1 + Y1;
      const E = modP(modP(x1y1 * x1y1) - A - B);
      const G = D + B;
      const F = G - C;
      const H = D - B;
      const X3 = modP(E * F);
      const Y3 = modP(G * H);
      const T3 = modP(E * H);
      const Z3 = modP(F * G);
      return new Point(X3, Y3, Z3, T3);
    }
    // Fast algo for adding 2 Extended Points.
    // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#addition-add-2008-hwcd
    // Cost: 9M + 1*a + 1*d + 7add.
    add(other) {
      aedpoint(other);
      const { a, d } = CURVE;
      const { X: X1, Y: Y1, Z: Z1, T: T1 } = this;
      const { X: X2, Y: Y2, Z: Z2, T: T2 } = other;
      const A = modP(X1 * X2);
      const B = modP(Y1 * Y2);
      const C = modP(T1 * d * T2);
      const D = modP(Z1 * Z2);
      const E = modP((X1 + Y1) * (X2 + Y2) - A - B);
      const F = D - C;
      const G = D + C;
      const H = modP(B - a * A);
      const X3 = modP(E * F);
      const Y3 = modP(G * H);
      const T3 = modP(E * H);
      const Z3 = modP(F * G);
      return new Point(X3, Y3, Z3, T3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    // Constant-time multiplication.
    multiply(scalar) {
      if (!Fn.isValidNot0(scalar))
        throw new Error("invalid scalar: expected 1 <= sc < curve.n");
      const { p, f } = wnaf.cached(this, scalar, (p2) => normalizeZ(Point, p2));
      return normalizeZ(Point, [p, f])[0];
    }
    // Non-constant-time multiplication. Uses double-and-add algorithm.
    // It's faster, but should only be used when you don't care about
    // an exposed private key e.g. sig verification.
    // Does NOT allow scalars higher than CURVE.n.
    // Accepts optional accumulator to merge with multiply (important for sparse scalars)
    multiplyUnsafe(scalar, acc = Point.ZERO) {
      if (!Fn.isValid(scalar))
        throw new Error("invalid scalar: expected 0 <= sc < curve.n");
      if (scalar === _0n4)
        return Point.ZERO;
      if (this.is0() || scalar === _1n4)
        return this;
      return wnaf.unsafe(this, scalar, (p) => normalizeZ(Point, p), acc);
    }
    // Checks if point is of small order.
    // If you add something to small order point, you will have "dirty"
    // point with torsion component.
    // Multiplies point by cofactor and checks if the result is 0.
    isSmallOrder() {
      return this.multiplyUnsafe(cofactor).is0();
    }
    // Multiplies point by curve order and checks if the result is 0.
    // Returns `false` is the point is dirty.
    isTorsionFree() {
      return wnaf.unsafe(this, CURVE.n).is0();
    }
    // Converts Extended point to default (x, y) coordinates.
    // Can accept precomputed Z^-1 - for example, from invertBatch.
    toAffine(invertedZ) {
      return toAffineMemo(this, invertedZ);
    }
    clearCofactor() {
      if (cofactor === _1n4)
        return this;
      return this.multiplyUnsafe(cofactor);
    }
    toBytes() {
      const { x, y } = this.toAffine();
      const bytes = Fp.toBytes(y);
      bytes[bytes.length - 1] |= x & _1n4 ? 128 : 0;
      return bytes;
    }
    toHex() {
      return bytesToHex(this.toBytes());
    }
    toString() {
      return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
    }
  }
  const wnaf = new wNAF(Point, Fn.BITS);
  Point.BASE.precompute(8);
  return Point;
}
__name(edwards, "edwards");
function eddsa(Point, cHash, eddsaOpts = {}) {
  if (typeof cHash !== "function")
    throw new Error('"hash" function param is required');
  validateObject(eddsaOpts, {}, {
    adjustScalarBytes: "function",
    randomBytes: "function",
    domain: "function",
    prehash: "function",
    mapToCurve: "function"
  });
  const { prehash } = eddsaOpts;
  const { BASE, Fp, Fn } = Point;
  const randomBytes2 = eddsaOpts.randomBytes || randomBytes;
  const adjustScalarBytes2 = eddsaOpts.adjustScalarBytes || ((bytes) => bytes);
  const domain = eddsaOpts.domain || ((data, ctx, phflag) => {
    abool(phflag, "phflag");
    if (ctx.length || phflag)
      throw new Error("Contexts/pre-hash are not supported");
    return data;
  });
  function modN_LE(hash) {
    return Fn.create(bytesToNumberLE(hash));
  }
  __name(modN_LE, "modN_LE");
  function getPrivateScalar(key) {
    const len = lengths.secretKey;
    abytes(key, lengths.secretKey, "secretKey");
    const hashed = abytes(cHash(key), 2 * len, "hashedSecretKey");
    const head = adjustScalarBytes2(hashed.slice(0, len));
    const prefix = hashed.slice(len, 2 * len);
    const scalar = modN_LE(head);
    return { head, prefix, scalar };
  }
  __name(getPrivateScalar, "getPrivateScalar");
  function getExtendedPublicKey(secretKey) {
    const { head, prefix, scalar } = getPrivateScalar(secretKey);
    const point = BASE.multiply(scalar);
    const pointBytes = point.toBytes();
    return { head, prefix, scalar, point, pointBytes };
  }
  __name(getExtendedPublicKey, "getExtendedPublicKey");
  function getPublicKey(secretKey) {
    return getExtendedPublicKey(secretKey).pointBytes;
  }
  __name(getPublicKey, "getPublicKey");
  function hashDomainToScalar(context = Uint8Array.of(), ...msgs) {
    const msg = concatBytes(...msgs);
    return modN_LE(cHash(domain(msg, abytes(context, void 0, "context"), !!prehash)));
  }
  __name(hashDomainToScalar, "hashDomainToScalar");
  function sign(msg, secretKey, options = {}) {
    msg = abytes(msg, void 0, "message");
    if (prehash)
      msg = prehash(msg);
    const { prefix, scalar, pointBytes } = getExtendedPublicKey(secretKey);
    const r = hashDomainToScalar(options.context, prefix, msg);
    const R = BASE.multiply(r).toBytes();
    const k = hashDomainToScalar(options.context, R, pointBytes, msg);
    const s = Fn.create(r + k * scalar);
    if (!Fn.isValid(s))
      throw new Error("sign failed: invalid s");
    const rs = concatBytes(R, Fn.toBytes(s));
    return abytes(rs, lengths.signature, "result");
  }
  __name(sign, "sign");
  const verifyOpts = { zip215: true };
  function verify(sig, msg, publicKey, options = verifyOpts) {
    const { context, zip215 } = options;
    const len = lengths.signature;
    sig = abytes(sig, len, "signature");
    msg = abytes(msg, void 0, "message");
    publicKey = abytes(publicKey, lengths.publicKey, "publicKey");
    if (zip215 !== void 0)
      abool(zip215, "zip215");
    if (prehash)
      msg = prehash(msg);
    const mid = len / 2;
    const r = sig.subarray(0, mid);
    const s = bytesToNumberLE(sig.subarray(mid, len));
    let A, R, SB;
    try {
      A = Point.fromBytes(publicKey, zip215);
      R = Point.fromBytes(r, zip215);
      SB = BASE.multiplyUnsafe(s);
    } catch (error) {
      return false;
    }
    if (!zip215 && A.isSmallOrder())
      return false;
    const k = hashDomainToScalar(context, R.toBytes(), A.toBytes(), msg);
    const RkA = R.add(A.multiplyUnsafe(k));
    return RkA.subtract(SB).clearCofactor().is0();
  }
  __name(verify, "verify");
  const _size = Fp.BYTES;
  const lengths = {
    secretKey: _size,
    publicKey: _size,
    signature: 2 * _size,
    seed: _size
  };
  function randomSecretKey(seed = randomBytes2(lengths.seed)) {
    return abytes(seed, lengths.seed, "seed");
  }
  __name(randomSecretKey, "randomSecretKey");
  function isValidSecretKey(key) {
    return isBytes(key) && key.length === Fn.BYTES;
  }
  __name(isValidSecretKey, "isValidSecretKey");
  function isValidPublicKey(key, zip215) {
    try {
      return !!Point.fromBytes(key, zip215);
    } catch (error) {
      return false;
    }
  }
  __name(isValidPublicKey, "isValidPublicKey");
  const utils = {
    getExtendedPublicKey,
    randomSecretKey,
    isValidSecretKey,
    isValidPublicKey,
    /**
     * Converts ed public key to x public key. Uses formula:
     * - ed25519:
     *   - `(u, v) = ((1+y)/(1-y), sqrt(-486664)*u/x)`
     *   - `(x, y) = (sqrt(-486664)*u/v, (u-1)/(u+1))`
     * - ed448:
     *   - `(u, v) = ((y-1)/(y+1), sqrt(156324)*u/x)`
     *   - `(x, y) = (sqrt(156324)*u/v, (1+u)/(1-u))`
     */
    toMontgomery(publicKey) {
      const { y } = Point.fromBytes(publicKey);
      const size = lengths.publicKey;
      const is25519 = size === 32;
      if (!is25519 && size !== 57)
        throw new Error("only defined for 25519 and 448");
      const u = is25519 ? Fp.div(_1n4 + y, _1n4 - y) : Fp.div(y - _1n4, y + _1n4);
      return Fp.toBytes(u);
    },
    toMontgomerySecret(secretKey) {
      const size = lengths.secretKey;
      abytes(secretKey, size);
      const hashed = cHash(secretKey.subarray(0, size));
      return adjustScalarBytes2(hashed).subarray(0, size);
    }
  };
  return Object.freeze({
    keygen: createKeygen(randomSecretKey, getPublicKey),
    getPublicKey,
    sign,
    verify,
    utils,
    Point,
    lengths
  });
}
__name(eddsa, "eddsa");

// node_modules/@libp2p/crypto/node_modules/@noble/curves/ed25519.js
var _1n5 = BigInt(1);
var _2n3 = BigInt(2);
var _5n2 = BigInt(5);
var _8n3 = BigInt(8);
var ed25519_CURVE_p = BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed");
var ed25519_CURVE = /* @__PURE__ */ (() => ({
  p: ed25519_CURVE_p,
  n: BigInt("0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3ed"),
  h: _8n3,
  a: BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec"),
  d: BigInt("0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3"),
  Gx: BigInt("0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a"),
  Gy: BigInt("0x6666666666666666666666666666666666666666666666666666666666666658")
}))();
function ed25519_pow_2_252_3(x) {
  const _10n = BigInt(10), _20n = BigInt(20), _40n = BigInt(40), _80n = BigInt(80);
  const P = ed25519_CURVE_p;
  const x2 = x * x % P;
  const b2 = x2 * x % P;
  const b4 = pow2(b2, _2n3, P) * b2 % P;
  const b5 = pow2(b4, _1n5, P) * x % P;
  const b10 = pow2(b5, _5n2, P) * b5 % P;
  const b20 = pow2(b10, _10n, P) * b10 % P;
  const b40 = pow2(b20, _20n, P) * b20 % P;
  const b80 = pow2(b40, _40n, P) * b40 % P;
  const b160 = pow2(b80, _80n, P) * b80 % P;
  const b240 = pow2(b160, _80n, P) * b80 % P;
  const b250 = pow2(b240, _10n, P) * b10 % P;
  const pow_p_5_8 = pow2(b250, _2n3, P) * x % P;
  return { pow_p_5_8, b2 };
}
__name(ed25519_pow_2_252_3, "ed25519_pow_2_252_3");
function adjustScalarBytes(bytes) {
  bytes[0] &= 248;
  bytes[31] &= 127;
  bytes[31] |= 64;
  return bytes;
}
__name(adjustScalarBytes, "adjustScalarBytes");
var ED25519_SQRT_M1 = /* @__PURE__ */ BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
function uvRatio(u, v) {
  const P = ed25519_CURVE_p;
  const v3 = mod(v * v * v, P);
  const v7 = mod(v3 * v3 * v, P);
  const pow = ed25519_pow_2_252_3(u * v7).pow_p_5_8;
  let x = mod(u * v3 * pow, P);
  const vx2 = mod(v * x * x, P);
  const root1 = x;
  const root2 = mod(x * ED25519_SQRT_M1, P);
  const useRoot1 = vx2 === u;
  const useRoot2 = vx2 === mod(-u, P);
  const noRoot = vx2 === mod(-u * ED25519_SQRT_M1, P);
  if (useRoot1)
    x = root1;
  if (useRoot2 || noRoot)
    x = root2;
  if (isNegativeLE(x, P))
    x = mod(-x, P);
  return { isValid: useRoot1 || useRoot2, value: x };
}
__name(uvRatio, "uvRatio");
var ed25519_Point = /* @__PURE__ */ edwards(ed25519_CURVE, { uvRatio });
function ed(opts) {
  return eddsa(ed25519_Point, sha5122, Object.assign({ adjustScalarBytes }, opts));
}
__name(ed, "ed");
var ed25519 = /* @__PURE__ */ ed({});

// node_modules/@libp2p/crypto/dist/src/errors.js
var VerificationError = class extends Error {
  static {
    __name(this, "VerificationError");
  }
  constructor(message2 = "An error occurred while verifying a message") {
    super(message2);
    this.name = "VerificationError";
  }
};
var WebCryptoMissingError = class extends Error {
  static {
    __name(this, "WebCryptoMissingError");
  }
  constructor(message2 = "Missing Web Crypto API") {
    super(message2);
    this.name = "WebCryptoMissingError";
  }
};

// node_modules/@libp2p/crypto/dist/src/webcrypto/webcrypto.browser.js
var webcrypto_browser_default = {
  get(win = globalThis) {
    const nativeCrypto = win.crypto;
    if (nativeCrypto?.subtle == null) {
      throw new WebCryptoMissingError("Missing Web Crypto API. The most likely cause of this error is that this page is being accessed from an insecure context (i.e. not HTTPS). For more information and possible resolutions see https://github.com/libp2p/js-libp2p/blob/main/packages/crypto/README.md#web-crypto-api");
    }
    return nativeCrypto;
  }
};

// node_modules/@libp2p/crypto/dist/src/webcrypto/index.js
var webcrypto_default = webcrypto_browser_default;

// node_modules/@libp2p/crypto/dist/src/keys/ed25519/index.browser.js
var PUBLIC_KEY_BYTE_LENGTH = 32;
var ed25519Supported;
var webCryptoEd25519SupportedPromise = (async () => {
  try {
    await webcrypto_default.get().subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"]);
    return true;
  } catch {
    return false;
  }
})();
async function hashAndVerifyWebCrypto(publicKey, sig, msg) {
  if (publicKey.buffer instanceof ArrayBuffer) {
    const key = await webcrypto_default.get().subtle.importKey("raw", publicKey.buffer, { name: "Ed25519" }, false, ["verify"]);
    const isValid2 = await webcrypto_default.get().subtle.verify({ name: "Ed25519" }, key, sig, msg instanceof Uint8Array ? msg : msg.subarray());
    return isValid2;
  }
  throw new TypeError("WebCrypto does not support SharedArrayBuffer for Ed25519 keys");
}
__name(hashAndVerifyWebCrypto, "hashAndVerifyWebCrypto");
function hashAndVerifyNoble(publicKey, sig, msg) {
  return ed25519.verify(sig, msg instanceof Uint8Array ? msg : msg.subarray(), publicKey);
}
__name(hashAndVerifyNoble, "hashAndVerifyNoble");
async function hashAndVerify2(publicKey, sig, msg) {
  if (ed25519Supported == null) {
    ed25519Supported = await webCryptoEd25519SupportedPromise;
  }
  if (ed25519Supported) {
    return hashAndVerifyWebCrypto(publicKey, sig, msg);
  }
  return hashAndVerifyNoble(publicKey, sig, msg);
}
__name(hashAndVerify2, "hashAndVerify");

// node_modules/@libp2p/crypto/dist/src/util.js
function isPromise(thing) {
  if (thing == null) {
    return false;
  }
  return typeof thing.then === "function" && typeof thing.catch === "function" && typeof thing.finally === "function";
}
__name(isPromise, "isPromise");

// node_modules/@libp2p/crypto/dist/src/keys/ed25519/ed25519.js
var Ed25519PublicKey = class {
  static {
    __name(this, "Ed25519PublicKey");
  }
  type = "Ed25519";
  raw;
  constructor(key) {
    this.raw = ensureEd25519Key(key, PUBLIC_KEY_BYTE_LENGTH);
  }
  toMultihash() {
    return identity.digest(publicKeyToProtobuf(this));
  }
  toCID() {
    return CID.createV1(114, this.toMultihash());
  }
  toString() {
    return base58btc.encode(this.toMultihash().bytes).substring(1);
  }
  equals(key) {
    if (key == null || !(key.raw instanceof Uint8Array)) {
      return false;
    }
    return equals3(this.raw, key.raw);
  }
  verify(data, sig, options) {
    options?.signal?.throwIfAborted();
    const result = hashAndVerify2(this.raw, sig, data);
    if (isPromise(result)) {
      return result.then((res) => {
        options?.signal?.throwIfAborted();
        return res;
      });
    }
    return result;
  }
};

// node_modules/@libp2p/crypto/dist/src/keys/ed25519/utils.js
function unmarshalEd25519PublicKey(bytes) {
  bytes = ensureEd25519Key(bytes, PUBLIC_KEY_BYTE_LENGTH);
  return new Ed25519PublicKey(bytes);
}
__name(unmarshalEd25519PublicKey, "unmarshalEd25519PublicKey");
function ensureEd25519Key(key, length3) {
  key = Uint8Array.from(key ?? []);
  if (key.length !== length3) {
    throw new InvalidParametersError(`Key must be a Uint8Array of length ${length3}, got ${key.length}`);
  }
  return key;
}
__name(ensureEd25519Key, "ensureEd25519Key");

// node_modules/uint8-varint/dist/src/index.js
var N12 = Math.pow(2, 7);
var N22 = Math.pow(2, 14);
var N32 = Math.pow(2, 21);
var N42 = Math.pow(2, 28);
var N52 = Math.pow(2, 35);
var N62 = Math.pow(2, 42);
var N72 = Math.pow(2, 49);
var MSB2 = 128;
var REST2 = 127;
function encodingLength2(value2) {
  if (value2 < N12) {
    return 1;
  }
  if (value2 < N22) {
    return 2;
  }
  if (value2 < N32) {
    return 3;
  }
  if (value2 < N42) {
    return 4;
  }
  if (value2 < N52) {
    return 5;
  }
  if (value2 < N62) {
    return 6;
  }
  if (value2 < N72) {
    return 7;
  }
  if (Number.MAX_SAFE_INTEGER != null && value2 > Number.MAX_SAFE_INTEGER) {
    throw new RangeError("Could not encode varint");
  }
  return 8;
}
__name(encodingLength2, "encodingLength");
function encodeUint8Array(value2, buf, offset = 0) {
  switch (encodingLength2(value2)) {
    case 8: {
      buf[offset++] = value2 & 255 | MSB2;
      value2 /= 128;
    }
    case 7: {
      buf[offset++] = value2 & 255 | MSB2;
      value2 /= 128;
    }
    case 6: {
      buf[offset++] = value2 & 255 | MSB2;
      value2 /= 128;
    }
    case 5: {
      buf[offset++] = value2 & 255 | MSB2;
      value2 /= 128;
    }
    case 4: {
      buf[offset++] = value2 & 255 | MSB2;
      value2 >>>= 7;
    }
    case 3: {
      buf[offset++] = value2 & 255 | MSB2;
      value2 >>>= 7;
    }
    case 2: {
      buf[offset++] = value2 & 255 | MSB2;
      value2 >>>= 7;
    }
    case 1: {
      buf[offset++] = value2 & 255;
      value2 >>>= 7;
      break;
    }
    default:
      throw new Error("unreachable");
  }
  return buf;
}
__name(encodeUint8Array, "encodeUint8Array");
function encodeUint8ArrayList(value2, buf, offset = 0) {
  switch (encodingLength2(value2)) {
    case 8: {
      buf.set(offset++, value2 & 255 | MSB2);
      value2 /= 128;
    }
    case 7: {
      buf.set(offset++, value2 & 255 | MSB2);
      value2 /= 128;
    }
    case 6: {
      buf.set(offset++, value2 & 255 | MSB2);
      value2 /= 128;
    }
    case 5: {
      buf.set(offset++, value2 & 255 | MSB2);
      value2 /= 128;
    }
    case 4: {
      buf.set(offset++, value2 & 255 | MSB2);
      value2 >>>= 7;
    }
    case 3: {
      buf.set(offset++, value2 & 255 | MSB2);
      value2 >>>= 7;
    }
    case 2: {
      buf.set(offset++, value2 & 255 | MSB2);
      value2 >>>= 7;
    }
    case 1: {
      buf.set(offset++, value2 & 255);
      value2 >>>= 7;
      break;
    }
    default:
      throw new Error("unreachable");
  }
  return buf;
}
__name(encodeUint8ArrayList, "encodeUint8ArrayList");
function decodeUint8Array(buf, offset) {
  let b = buf[offset];
  let res = 0;
  res += b & REST2;
  if (b < MSB2) {
    return res;
  }
  b = buf[offset + 1];
  res += (b & REST2) << 7;
  if (b < MSB2) {
    return res;
  }
  b = buf[offset + 2];
  res += (b & REST2) << 14;
  if (b < MSB2) {
    return res;
  }
  b = buf[offset + 3];
  res += (b & REST2) << 21;
  if (b < MSB2) {
    return res;
  }
  b = buf[offset + 4];
  res += (b & REST2) * N42;
  if (b < MSB2) {
    return res;
  }
  b = buf[offset + 5];
  res += (b & REST2) * N52;
  if (b < MSB2) {
    return res;
  }
  b = buf[offset + 6];
  res += (b & REST2) * N62;
  if (b < MSB2) {
    return res;
  }
  b = buf[offset + 7];
  res += (b & REST2) * N72;
  if (b < MSB2) {
    return res;
  }
  throw new RangeError("Could not decode varint");
}
__name(decodeUint8Array, "decodeUint8Array");
function decodeUint8ArrayList(buf, offset) {
  let b = buf.get(offset);
  let res = 0;
  res += b & REST2;
  if (b < MSB2) {
    return res;
  }
  b = buf.get(offset + 1);
  res += (b & REST2) << 7;
  if (b < MSB2) {
    return res;
  }
  b = buf.get(offset + 2);
  res += (b & REST2) << 14;
  if (b < MSB2) {
    return res;
  }
  b = buf.get(offset + 3);
  res += (b & REST2) << 21;
  if (b < MSB2) {
    return res;
  }
  b = buf.get(offset + 4);
  res += (b & REST2) * N42;
  if (b < MSB2) {
    return res;
  }
  b = buf.get(offset + 5);
  res += (b & REST2) * N52;
  if (b < MSB2) {
    return res;
  }
  b = buf.get(offset + 6);
  res += (b & REST2) * N62;
  if (b < MSB2) {
    return res;
  }
  b = buf.get(offset + 7);
  res += (b & REST2) * N72;
  if (b < MSB2) {
    return res;
  }
  throw new RangeError("Could not decode varint");
}
__name(decodeUint8ArrayList, "decodeUint8ArrayList");
function encode5(value2, buf, offset = 0) {
  if (buf == null) {
    buf = allocUnsafe(encodingLength2(value2));
  }
  if (buf instanceof Uint8Array) {
    return encodeUint8Array(value2, buf, offset);
  } else {
    return encodeUint8ArrayList(value2, buf, offset);
  }
}
__name(encode5, "encode");
function decode6(buf, offset = 0) {
  if (buf instanceof Uint8Array) {
    return decodeUint8Array(buf, offset);
  } else {
    return decodeUint8ArrayList(buf, offset);
  }
}
__name(decode6, "decode");

// node_modules/protons-runtime/dist/src/utils/float.js
var f32 = new Float32Array([-0]);
var f8b = new Uint8Array(f32.buffer);
function writeFloatLE(val, buf, pos) {
  f32[0] = val;
  buf[pos] = f8b[0];
  buf[pos + 1] = f8b[1];
  buf[pos + 2] = f8b[2];
  buf[pos + 3] = f8b[3];
}
__name(writeFloatLE, "writeFloatLE");
function readFloatLE(buf, pos) {
  f8b[0] = buf[pos];
  f8b[1] = buf[pos + 1];
  f8b[2] = buf[pos + 2];
  f8b[3] = buf[pos + 3];
  return f32[0];
}
__name(readFloatLE, "readFloatLE");
var f64 = new Float64Array([-0]);
var d8b = new Uint8Array(f64.buffer);
function writeDoubleLE(val, buf, pos) {
  f64[0] = val;
  buf[pos] = d8b[0];
  buf[pos + 1] = d8b[1];
  buf[pos + 2] = d8b[2];
  buf[pos + 3] = d8b[3];
  buf[pos + 4] = d8b[4];
  buf[pos + 5] = d8b[5];
  buf[pos + 6] = d8b[6];
  buf[pos + 7] = d8b[7];
}
__name(writeDoubleLE, "writeDoubleLE");
function readDoubleLE(buf, pos) {
  d8b[0] = buf[pos];
  d8b[1] = buf[pos + 1];
  d8b[2] = buf[pos + 2];
  d8b[3] = buf[pos + 3];
  d8b[4] = buf[pos + 4];
  d8b[5] = buf[pos + 5];
  d8b[6] = buf[pos + 6];
  d8b[7] = buf[pos + 7];
  return f64[0];
}
__name(readDoubleLE, "readDoubleLE");

// node_modules/protons-runtime/dist/src/utils/longbits.js
var MAX_SAFE_NUMBER_INTEGER = BigInt(Number.MAX_SAFE_INTEGER);
var MIN_SAFE_NUMBER_INTEGER = BigInt(Number.MIN_SAFE_INTEGER);
var LongBits = class _LongBits {
  static {
    __name(this, "LongBits");
  }
  lo;
  hi;
  constructor(lo, hi) {
    this.lo = lo | 0;
    this.hi = hi | 0;
  }
  /**
   * Converts this long bits to a possibly unsafe JavaScript number
   */
  toNumber(unsigned = false) {
    if (!unsigned && this.hi >>> 31 > 0) {
      const lo = ~this.lo + 1 >>> 0;
      let hi = ~this.hi >>> 0;
      if (lo === 0) {
        hi = hi + 1 >>> 0;
      }
      return -(lo + hi * 4294967296);
    }
    return this.lo + this.hi * 4294967296;
  }
  /**
   * Converts this long bits to a bigint
   */
  toBigInt(unsigned = false) {
    if (unsigned) {
      return BigInt(this.lo >>> 0) + (BigInt(this.hi >>> 0) << 32n);
    }
    if (this.hi >>> 31 !== 0) {
      const lo = ~this.lo + 1 >>> 0;
      let hi = ~this.hi >>> 0;
      if (lo === 0) {
        hi = hi + 1 >>> 0;
      }
      return -(BigInt(lo) + (BigInt(hi) << 32n));
    }
    return BigInt(this.lo >>> 0) + (BigInt(this.hi >>> 0) << 32n);
  }
  /**
   * Converts this long bits to a string
   */
  toString(unsigned = false) {
    return this.toBigInt(unsigned).toString();
  }
  /**
   * Zig-zag encodes this long bits
   */
  zzEncode() {
    const mask = this.hi >> 31;
    this.hi = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
    this.lo = (this.lo << 1 ^ mask) >>> 0;
    return this;
  }
  /**
   * Zig-zag decodes this long bits
   */
  zzDecode() {
    const mask = -(this.lo & 1);
    this.lo = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
    this.hi = (this.hi >>> 1 ^ mask) >>> 0;
    return this;
  }
  /**
   * Calculates the length of this longbits when encoded as a varint.
   */
  length() {
    const part0 = this.lo;
    const part1 = (this.lo >>> 28 | this.hi << 4) >>> 0;
    const part2 = this.hi >>> 24;
    return part2 === 0 ? part1 === 0 ? part0 < 16384 ? part0 < 128 ? 1 : 2 : part0 < 2097152 ? 3 : 4 : part1 < 16384 ? part1 < 128 ? 5 : 6 : part1 < 2097152 ? 7 : 8 : part2 < 128 ? 9 : 10;
  }
  /**
   * Constructs new long bits from the specified number
   */
  static fromBigInt(value2) {
    if (value2 === 0n) {
      return zero;
    }
    if (value2 < MAX_SAFE_NUMBER_INTEGER && value2 > MIN_SAFE_NUMBER_INTEGER) {
      return this.fromNumber(Number(value2));
    }
    const negative = value2 < 0n;
    if (negative) {
      value2 = -value2;
    }
    let hi = value2 >> 32n;
    let lo = value2 - (hi << 32n);
    if (negative) {
      hi = ~hi | 0n;
      lo = ~lo | 0n;
      if (++lo > TWO_32) {
        lo = 0n;
        if (++hi > TWO_32) {
          hi = 0n;
        }
      }
    }
    return new _LongBits(Number(lo), Number(hi));
  }
  /**
   * Constructs new long bits from the specified number
   */
  static fromNumber(value2) {
    if (value2 === 0) {
      return zero;
    }
    const sign = value2 < 0;
    if (sign) {
      value2 = -value2;
    }
    let lo = value2 >>> 0;
    let hi = (value2 - lo) / 4294967296 >>> 0;
    if (sign) {
      hi = ~hi >>> 0;
      lo = ~lo >>> 0;
      if (++lo > 4294967295) {
        lo = 0;
        if (++hi > 4294967295) {
          hi = 0;
        }
      }
    }
    return new _LongBits(lo, hi);
  }
  /**
   * Constructs new long bits from a number, long or string
   */
  static from(value2) {
    if (typeof value2 === "number") {
      return _LongBits.fromNumber(value2);
    }
    if (typeof value2 === "bigint") {
      return _LongBits.fromBigInt(value2);
    }
    if (typeof value2 === "string") {
      return _LongBits.fromBigInt(BigInt(value2));
    }
    return value2.low != null || value2.high != null ? new _LongBits(value2.low >>> 0, value2.high >>> 0) : zero;
  }
};
var zero = new LongBits(0, 0);
zero.toBigInt = function() {
  return 0n;
};
zero.zzEncode = zero.zzDecode = function() {
  return this;
};
zero.length = function() {
  return 1;
};
var TWO_32 = 4294967296n;

// node_modules/protons-runtime/dist/src/utils/utf8.js
function length2(string2) {
  let len = 0;
  let c = 0;
  for (let i = 0; i < string2.length; ++i) {
    c = string2.charCodeAt(i);
    if (c < 128) {
      len += 1;
    } else if (c < 2048) {
      len += 2;
    } else if ((c & 64512) === 55296 && (string2.charCodeAt(i + 1) & 64512) === 56320) {
      ++i;
      len += 4;
    } else {
      len += 3;
    }
  }
  return len;
}
__name(length2, "length");
function read2(buffer, start, end) {
  const len = end - start;
  if (len < 1) {
    return "";
  }
  let parts;
  const chunk = [];
  let i = 0;
  let t;
  while (start < end) {
    t = buffer[start++];
    if (t < 128) {
      chunk[i++] = t;
    } else if (t > 191 && t < 224) {
      chunk[i++] = (t & 31) << 6 | buffer[start++] & 63;
    } else if (t > 239 && t < 365) {
      t = ((t & 7) << 18 | (buffer[start++] & 63) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63) - 65536;
      chunk[i++] = 55296 + (t >> 10);
      chunk[i++] = 56320 + (t & 1023);
    } else {
      chunk[i++] = (t & 15) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
    }
    if (i > 8191) {
      (parts ?? (parts = [])).push(String.fromCharCode.apply(String, chunk));
      i = 0;
    }
  }
  if (parts != null) {
    if (i > 0) {
      parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
    }
    return parts.join("");
  }
  return String.fromCharCode.apply(String, chunk.slice(0, i));
}
__name(read2, "read");
function write(string2, buffer, offset) {
  const start = offset;
  let c1;
  let c2;
  for (let i = 0; i < string2.length; ++i) {
    c1 = string2.charCodeAt(i);
    if (c1 < 128) {
      buffer[offset++] = c1;
    } else if (c1 < 2048) {
      buffer[offset++] = c1 >> 6 | 192;
      buffer[offset++] = c1 & 63 | 128;
    } else if ((c1 & 64512) === 55296 && ((c2 = string2.charCodeAt(i + 1)) & 64512) === 56320) {
      c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
      ++i;
      buffer[offset++] = c1 >> 18 | 240;
      buffer[offset++] = c1 >> 12 & 63 | 128;
      buffer[offset++] = c1 >> 6 & 63 | 128;
      buffer[offset++] = c1 & 63 | 128;
    } else {
      buffer[offset++] = c1 >> 12 | 224;
      buffer[offset++] = c1 >> 6 & 63 | 128;
      buffer[offset++] = c1 & 63 | 128;
    }
  }
  return offset - start;
}
__name(write, "write");

// node_modules/protons-runtime/dist/src/utils/reader.js
function indexOutOfRange(reader, writeLength) {
  return RangeError(`index out of range: ${reader.pos} + ${writeLength ?? 1} > ${reader.len}`);
}
__name(indexOutOfRange, "indexOutOfRange");
function readFixed32End(buf, end) {
  return (buf[end - 4] | buf[end - 3] << 8 | buf[end - 2] << 16 | buf[end - 1] << 24) >>> 0;
}
__name(readFixed32End, "readFixed32End");
var Uint8ArrayReader = class {
  static {
    __name(this, "Uint8ArrayReader");
  }
  buf;
  pos;
  len;
  _slice = Uint8Array.prototype.subarray;
  constructor(buffer) {
    this.buf = buffer;
    this.pos = 0;
    this.len = buffer.length;
  }
  /**
   * Reads a varint as an unsigned 32 bit value
   */
  uint32() {
    let value2 = 4294967295;
    value2 = (this.buf[this.pos] & 127) >>> 0;
    if (this.buf[this.pos++] < 128) {
      return value2;
    }
    value2 = (value2 | (this.buf[this.pos] & 127) << 7) >>> 0;
    if (this.buf[this.pos++] < 128) {
      return value2;
    }
    value2 = (value2 | (this.buf[this.pos] & 127) << 14) >>> 0;
    if (this.buf[this.pos++] < 128) {
      return value2;
    }
    value2 = (value2 | (this.buf[this.pos] & 127) << 21) >>> 0;
    if (this.buf[this.pos++] < 128) {
      return value2;
    }
    value2 = (value2 | (this.buf[this.pos] & 15) << 28) >>> 0;
    if (this.buf[this.pos++] < 128) {
      return value2;
    }
    if ((this.pos += 5) > this.len) {
      this.pos = this.len;
      throw indexOutOfRange(this, 10);
    }
    return value2;
  }
  /**
   * Reads a varint as a signed 32 bit value
   */
  int32() {
    return this.uint32() | 0;
  }
  /**
   * Reads a zig-zag encoded varint as a signed 32 bit value
   */
  sint32() {
    const value2 = this.uint32();
    return value2 >>> 1 ^ -(value2 & 1) | 0;
  }
  /**
   * Reads a varint as a boolean
   */
  bool() {
    return this.uint32() !== 0;
  }
  /**
   * Reads fixed 32 bits as an unsigned 32 bit integer
   */
  fixed32() {
    if (this.pos + 4 > this.len) {
      throw indexOutOfRange(this, 4);
    }
    const res = readFixed32End(this.buf, this.pos += 4);
    return res;
  }
  /**
   * Reads fixed 32 bits as a signed 32 bit integer
   */
  sfixed32() {
    if (this.pos + 4 > this.len) {
      throw indexOutOfRange(this, 4);
    }
    const res = readFixed32End(this.buf, this.pos += 4) | 0;
    return res;
  }
  /**
   * Reads a float (32 bit) as a number
   */
  float() {
    if (this.pos + 4 > this.len) {
      throw indexOutOfRange(this, 4);
    }
    const value2 = readFloatLE(this.buf, this.pos);
    this.pos += 4;
    return value2;
  }
  /**
   * Reads a double (64 bit float) as a number
   */
  double() {
    if (this.pos + 8 > this.len) {
      throw indexOutOfRange(this, 4);
    }
    const value2 = readDoubleLE(this.buf, this.pos);
    this.pos += 8;
    return value2;
  }
  /**
   * Reads a sequence of bytes preceded by its length as a varint
   */
  bytes() {
    const length3 = this.uint32();
    const start = this.pos;
    const end = this.pos + length3;
    if (end > this.len) {
      throw indexOutOfRange(this, length3);
    }
    this.pos += length3;
    return start === end ? new Uint8Array(0) : this.buf.subarray(start, end);
  }
  /**
   * Reads a string preceded by its byte length as a varint
   */
  string() {
    const bytes = this.bytes();
    return read2(bytes, 0, bytes.length);
  }
  /**
   * Skips the specified number of bytes if specified, otherwise skips a varint
   */
  skip(length3) {
    if (typeof length3 === "number") {
      if (this.pos + length3 > this.len) {
        throw indexOutOfRange(this, length3);
      }
      this.pos += length3;
    } else {
      do {
        if (this.pos >= this.len) {
          throw indexOutOfRange(this);
        }
      } while ((this.buf[this.pos++] & 128) !== 0);
    }
    return this;
  }
  /**
   * Skips the next element of the specified wire type
   */
  skipType(wireType) {
    switch (wireType) {
      case 0:
        this.skip();
        break;
      case 1:
        this.skip(8);
        break;
      case 2:
        this.skip(this.uint32());
        break;
      case 3:
        while ((wireType = this.uint32() & 7) !== 4) {
          this.skipType(wireType);
        }
        break;
      case 5:
        this.skip(4);
        break;
      /* istanbul ignore next */
      default:
        throw Error(`invalid wire type ${wireType} at offset ${this.pos}`);
    }
    return this;
  }
  readLongVarint() {
    const bits = new LongBits(0, 0);
    let i = 0;
    if (this.len - this.pos > 4) {
      for (; i < 4; ++i) {
        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
        if (this.buf[this.pos++] < 128) {
          return bits;
        }
      }
      bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
      bits.hi = (bits.hi | (this.buf[this.pos] & 127) >> 4) >>> 0;
      if (this.buf[this.pos++] < 128) {
        return bits;
      }
      i = 0;
    } else {
      for (; i < 3; ++i) {
        if (this.pos >= this.len) {
          throw indexOutOfRange(this);
        }
        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
        if (this.buf[this.pos++] < 128) {
          return bits;
        }
      }
      bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
      return bits;
    }
    if (this.len - this.pos > 4) {
      for (; i < 5; ++i) {
        bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
        if (this.buf[this.pos++] < 128) {
          return bits;
        }
      }
    } else {
      for (; i < 5; ++i) {
        if (this.pos >= this.len) {
          throw indexOutOfRange(this);
        }
        bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
        if (this.buf[this.pos++] < 128) {
          return bits;
        }
      }
    }
    throw Error("invalid varint encoding");
  }
  readFixed64() {
    if (this.pos + 8 > this.len) {
      throw indexOutOfRange(this, 8);
    }
    const lo = readFixed32End(this.buf, this.pos += 4);
    const hi = readFixed32End(this.buf, this.pos += 4);
    return new LongBits(lo, hi);
  }
  /**
   * Reads a varint as a signed 64 bit value
   */
  int64() {
    return this.readLongVarint().toBigInt();
  }
  /**
   * Reads a varint as a signed 64 bit value returned as a possibly unsafe
   * JavaScript number
   */
  int64Number() {
    return this.readLongVarint().toNumber();
  }
  /**
   * Reads a varint as a signed 64 bit value returned as a string
   */
  int64String() {
    return this.readLongVarint().toString();
  }
  /**
   * Reads a varint as an unsigned 64 bit value
   */
  uint64() {
    return this.readLongVarint().toBigInt(true);
  }
  /**
   * Reads a varint as an unsigned 64 bit value returned as a possibly unsafe
   * JavaScript number
   */
  uint64Number() {
    const value2 = decodeUint8Array(this.buf, this.pos);
    this.pos += encodingLength2(value2);
    return value2;
  }
  /**
   * Reads a varint as an unsigned 64 bit value returned as a string
   */
  uint64String() {
    return this.readLongVarint().toString(true);
  }
  /**
   * Reads a zig-zag encoded varint as a signed 64 bit value
   */
  sint64() {
    return this.readLongVarint().zzDecode().toBigInt();
  }
  /**
   * Reads a zig-zag encoded varint as a signed 64 bit value returned as a
   * possibly unsafe JavaScript number
   */
  sint64Number() {
    return this.readLongVarint().zzDecode().toNumber();
  }
  /**
   * Reads a zig-zag encoded varint as a signed 64 bit value returned as a
   * string
   */
  sint64String() {
    return this.readLongVarint().zzDecode().toString();
  }
  /**
   * Reads fixed 64 bits
   */
  fixed64() {
    return this.readFixed64().toBigInt();
  }
  /**
   * Reads fixed 64 bits returned as a possibly unsafe JavaScript number
   */
  fixed64Number() {
    return this.readFixed64().toNumber();
  }
  /**
   * Reads fixed 64 bits returned as a string
   */
  fixed64String() {
    return this.readFixed64().toString();
  }
  /**
   * Reads zig-zag encoded fixed 64 bits
   */
  sfixed64() {
    return this.readFixed64().toBigInt();
  }
  /**
   * Reads zig-zag encoded fixed 64 bits returned as a possibly unsafe
   * JavaScript number
   */
  sfixed64Number() {
    return this.readFixed64().toNumber();
  }
  /**
   * Reads zig-zag encoded fixed 64 bits returned as a string
   */
  sfixed64String() {
    return this.readFixed64().toString();
  }
};
function createReader(buf) {
  return new Uint8ArrayReader(buf instanceof Uint8Array ? buf : buf.subarray());
}
__name(createReader, "createReader");

// node_modules/protons-runtime/dist/src/decode.js
function decodeMessage(buf, codec, opts) {
  const reader = createReader(buf);
  return codec.decode(reader, void 0, opts);
}
__name(decodeMessage, "decodeMessage");

// node_modules/protons-runtime/dist/src/utils/pool.js
function pool(size) {
  const SIZE = size ?? 8192;
  const MAX = SIZE >>> 1;
  let slab;
  let offset = SIZE;
  return /* @__PURE__ */ __name(function poolAlloc(size2) {
    if (size2 < 1 || size2 > MAX) {
      return allocUnsafe(size2);
    }
    if (offset + size2 > SIZE) {
      slab = allocUnsafe(SIZE);
      offset = 0;
    }
    const buf = slab.subarray(offset, offset += size2);
    if ((offset & 7) !== 0) {
      offset = (offset | 7) + 1;
    }
    return buf;
  }, "poolAlloc");
}
__name(pool, "pool");

// node_modules/protons-runtime/dist/src/utils/writer.js
var Op = class {
  static {
    __name(this, "Op");
  }
  /**
   * Function to call
   */
  fn;
  /**
   * Value byte length
   */
  len;
  /**
   * Next operation
   */
  next;
  /**
   * Value to write
   */
  val;
  constructor(fn, len, val) {
    this.fn = fn;
    this.len = len;
    this.next = void 0;
    this.val = val;
  }
};
function noop() {
}
__name(noop, "noop");
var State = class {
  static {
    __name(this, "State");
  }
  /**
   * Current head
   */
  head;
  /**
   * Current tail
   */
  tail;
  /**
   * Current buffer length
   */
  len;
  /**
   * Next state
   */
  next;
  constructor(writer) {
    this.head = writer.head;
    this.tail = writer.tail;
    this.len = writer.len;
    this.next = writer.states;
  }
};
var bufferPool = pool();
function alloc2(size) {
  if (globalThis.Buffer != null) {
    return allocUnsafe(size);
  }
  return bufferPool(size);
}
__name(alloc2, "alloc");
var Uint8ArrayWriter = class {
  static {
    __name(this, "Uint8ArrayWriter");
  }
  /**
   * Current length
   */
  len;
  /**
   * Operations head
   */
  head;
  /**
   * Operations tail
   */
  tail;
  /**
   * Linked forked states
   */
  states;
  constructor() {
    this.len = 0;
    this.head = new Op(noop, 0, 0);
    this.tail = this.head;
    this.states = null;
  }
  /**
   * Pushes a new operation to the queue
   */
  _push(fn, len, val) {
    this.tail = this.tail.next = new Op(fn, len, val);
    this.len += len;
    return this;
  }
  /**
   * Writes an unsigned 32 bit value as a varint
   */
  uint32(value2) {
    this.len += (this.tail = this.tail.next = new VarintOp((value2 = value2 >>> 0) < 128 ? 1 : value2 < 16384 ? 2 : value2 < 2097152 ? 3 : value2 < 268435456 ? 4 : 5, value2)).len;
    return this;
  }
  /**
   * Writes a signed 32 bit value as a varint`
   */
  int32(value2) {
    return value2 < 0 ? this._push(writeVarint64, 10, LongBits.fromNumber(value2)) : this.uint32(value2);
  }
  /**
   * Writes a 32 bit value as a varint, zig-zag encoded
   */
  sint32(value2) {
    return this.uint32((value2 << 1 ^ value2 >> 31) >>> 0);
  }
  /**
   * Writes an unsigned 64 bit value as a varint
   */
  uint64(value2) {
    const bits = LongBits.fromBigInt(value2);
    return this._push(writeVarint64, bits.length(), bits);
  }
  /**
   * Writes an unsigned 64 bit value as a varint
   */
  uint64Number(value2) {
    return this._push(encodeUint8Array, encodingLength2(value2), value2);
  }
  /**
   * Writes an unsigned 64 bit value as a varint
   */
  uint64String(value2) {
    return this.uint64(BigInt(value2));
  }
  /**
   * Writes a signed 64 bit value as a varint
   */
  int64(value2) {
    return this.uint64(value2);
  }
  /**
   * Writes a signed 64 bit value as a varint
   */
  int64Number(value2) {
    return this.uint64Number(value2);
  }
  /**
   * Writes a signed 64 bit value as a varint
   */
  int64String(value2) {
    return this.uint64String(value2);
  }
  /**
   * Writes a signed 64 bit value as a varint, zig-zag encoded
   */
  sint64(value2) {
    const bits = LongBits.fromBigInt(value2).zzEncode();
    return this._push(writeVarint64, bits.length(), bits);
  }
  /**
   * Writes a signed 64 bit value as a varint, zig-zag encoded
   */
  sint64Number(value2) {
    const bits = LongBits.fromNumber(value2).zzEncode();
    return this._push(writeVarint64, bits.length(), bits);
  }
  /**
   * Writes a signed 64 bit value as a varint, zig-zag encoded
   */
  sint64String(value2) {
    return this.sint64(BigInt(value2));
  }
  /**
   * Writes a boolish value as a varint
   */
  bool(value2) {
    return this._push(writeByte, 1, value2 ? 1 : 0);
  }
  /**
   * Writes an unsigned 32 bit value as fixed 32 bits
   */
  fixed32(value2) {
    return this._push(writeFixed32, 4, value2 >>> 0);
  }
  /**
   * Writes a signed 32 bit value as fixed 32 bits
   */
  sfixed32(value2) {
    return this.fixed32(value2);
  }
  /**
   * Writes an unsigned 64 bit value as fixed 64 bits
   */
  fixed64(value2) {
    const bits = LongBits.fromBigInt(value2);
    return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
  }
  /**
   * Writes an unsigned 64 bit value as fixed 64 bits
   */
  fixed64Number(value2) {
    const bits = LongBits.fromNumber(value2);
    return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
  }
  /**
   * Writes an unsigned 64 bit value as fixed 64 bits
   */
  fixed64String(value2) {
    return this.fixed64(BigInt(value2));
  }
  /**
   * Writes a signed 64 bit value as fixed 64 bits
   */
  sfixed64(value2) {
    return this.fixed64(value2);
  }
  /**
   * Writes a signed 64 bit value as fixed 64 bits
   */
  sfixed64Number(value2) {
    return this.fixed64Number(value2);
  }
  /**
   * Writes a signed 64 bit value as fixed 64 bits
   */
  sfixed64String(value2) {
    return this.fixed64String(value2);
  }
  /**
   * Writes a float (32 bit)
   */
  float(value2) {
    return this._push(writeFloatLE, 4, value2);
  }
  /**
   * Writes a double (64 bit float).
   *
   * @function
   * @param {number} value - Value to write
   * @returns {Writer} `this`
   */
  double(value2) {
    return this._push(writeDoubleLE, 8, value2);
  }
  /**
   * Writes a sequence of bytes
   */
  bytes(value2) {
    const len = value2.length >>> 0;
    if (len === 0) {
      return this._push(writeByte, 1, 0);
    }
    return this.uint32(len)._push(writeBytes, len, value2);
  }
  /**
   * Writes a string
   */
  string(value2) {
    const len = length2(value2);
    return len !== 0 ? this.uint32(len)._push(write, len, value2) : this._push(writeByte, 1, 0);
  }
  /**
   * Forks this writer's state by pushing it to a stack.
   * Calling {@link Writer#reset|reset} or {@link Writer#ldelim|ldelim} resets the writer to the previous state.
   */
  fork() {
    this.states = new State(this);
    this.head = this.tail = new Op(noop, 0, 0);
    this.len = 0;
    return this;
  }
  /**
   * Resets this instance to the last state
   */
  reset() {
    if (this.states != null) {
      this.head = this.states.head;
      this.tail = this.states.tail;
      this.len = this.states.len;
      this.states = this.states.next;
    } else {
      this.head = this.tail = new Op(noop, 0, 0);
      this.len = 0;
    }
    return this;
  }
  /**
   * Resets to the last state and appends the fork state's current write length as a varint followed by its operations.
   */
  ldelim() {
    const head = this.head;
    const tail = this.tail;
    const len = this.len;
    this.reset().uint32(len);
    if (len !== 0) {
      this.tail.next = head.next;
      this.tail = tail;
      this.len += len;
    }
    return this;
  }
  /**
   * Finishes the write operation
   */
  finish() {
    let head = this.head.next;
    const buf = alloc2(this.len);
    let pos = 0;
    while (head != null) {
      head.fn(head.val, buf, pos);
      pos += head.len;
      head = head.next;
    }
    return buf;
  }
};
function writeByte(val, buf, pos) {
  buf[pos] = val & 255;
}
__name(writeByte, "writeByte");
function writeVarint32(val, buf, pos) {
  while (val > 127) {
    buf[pos++] = val & 127 | 128;
    val >>>= 7;
  }
  buf[pos] = val;
}
__name(writeVarint32, "writeVarint32");
var VarintOp = class extends Op {
  static {
    __name(this, "VarintOp");
  }
  next;
  constructor(len, val) {
    super(writeVarint32, len, val);
    this.next = void 0;
  }
};
function writeVarint64(val, buf, pos) {
  while (val.hi !== 0) {
    buf[pos++] = val.lo & 127 | 128;
    val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
    val.hi >>>= 7;
  }
  while (val.lo > 127) {
    buf[pos++] = val.lo & 127 | 128;
    val.lo = val.lo >>> 7;
  }
  buf[pos++] = val.lo;
}
__name(writeVarint64, "writeVarint64");
function writeFixed32(val, buf, pos) {
  buf[pos] = val & 255;
  buf[pos + 1] = val >>> 8 & 255;
  buf[pos + 2] = val >>> 16 & 255;
  buf[pos + 3] = val >>> 24;
}
__name(writeFixed32, "writeFixed32");
function writeBytes(val, buf, pos) {
  buf.set(val, pos);
}
__name(writeBytes, "writeBytes");
if (globalThis.Buffer != null) {
  Uint8ArrayWriter.prototype.bytes = function(value2) {
    const len = value2.length >>> 0;
    this.uint32(len);
    if (len > 0) {
      this._push(writeBytesBuffer, len, value2);
    }
    return this;
  };
  Uint8ArrayWriter.prototype.string = function(value2) {
    const len = globalThis.Buffer.byteLength(value2);
    this.uint32(len);
    if (len > 0) {
      this._push(writeStringBuffer, len, value2);
    }
    return this;
  };
}
function writeBytesBuffer(val, buf, pos) {
  buf.set(val, pos);
}
__name(writeBytesBuffer, "writeBytesBuffer");
function writeStringBuffer(val, buf, pos) {
  if (val.length < 40) {
    write(val, buf, pos);
  } else if (buf.utf8Write != null) {
    buf.utf8Write(val, pos);
  } else {
    buf.set(fromString2(val), pos);
  }
}
__name(writeStringBuffer, "writeStringBuffer");
function createWriter() {
  return new Uint8ArrayWriter();
}
__name(createWriter, "createWriter");

// node_modules/protons-runtime/dist/src/encode.js
function encodeMessage(message2, codec) {
  const w = createWriter();
  codec.encode(message2, w, {
    lengthDelimited: false
  });
  return w.finish();
}
__name(encodeMessage, "encodeMessage");

// node_modules/protons-runtime/dist/src/codec.js
var CODEC_TYPES;
(function(CODEC_TYPES2) {
  CODEC_TYPES2[CODEC_TYPES2["VARINT"] = 0] = "VARINT";
  CODEC_TYPES2[CODEC_TYPES2["BIT64"] = 1] = "BIT64";
  CODEC_TYPES2[CODEC_TYPES2["LENGTH_DELIMITED"] = 2] = "LENGTH_DELIMITED";
  CODEC_TYPES2[CODEC_TYPES2["START_GROUP"] = 3] = "START_GROUP";
  CODEC_TYPES2[CODEC_TYPES2["END_GROUP"] = 4] = "END_GROUP";
  CODEC_TYPES2[CODEC_TYPES2["BIT32"] = 5] = "BIT32";
})(CODEC_TYPES || (CODEC_TYPES = {}));
function createCodec2(name2, type, encode6, decode7) {
  return {
    name: name2,
    type,
    encode: encode6,
    decode: decode7
  };
}
__name(createCodec2, "createCodec");

// node_modules/protons-runtime/dist/src/codecs/enum.js
function enumeration(v) {
  function findValue(val) {
    if (v[val.toString()] == null) {
      throw new Error("Invalid enum value");
    }
    return v[val];
  }
  __name(findValue, "findValue");
  const encode6 = /* @__PURE__ */ __name(function enumEncode(val, writer) {
    const enumValue = findValue(val);
    writer.int32(enumValue);
  }, "enumEncode");
  const decode7 = /* @__PURE__ */ __name(function enumDecode(reader) {
    const val = reader.int32();
    return findValue(val);
  }, "enumDecode");
  return createCodec2("enum", CODEC_TYPES.VARINT, encode6, decode7);
}
__name(enumeration, "enumeration");

// node_modules/protons-runtime/dist/src/codecs/message.js
function message(encode6, decode7) {
  return createCodec2("message", CODEC_TYPES.LENGTH_DELIMITED, encode6, decode7);
}
__name(message, "message");

// node_modules/protons-runtime/dist/src/index.js
var MaxLengthError = class extends Error {
  static {
    __name(this, "MaxLengthError");
  }
  /**
   * This will be removed in a future release
   *
   * @deprecated use the `.name` property instead
   */
  code = "ERR_MAX_LENGTH";
  name = "MaxLengthError";
};

// node_modules/@libp2p/crypto/dist/src/keys/keys.js
var KeyType;
(function(KeyType2) {
  KeyType2["RSA"] = "RSA";
  KeyType2["Ed25519"] = "Ed25519";
  KeyType2["secp256k1"] = "secp256k1";
  KeyType2["ECDSA"] = "ECDSA";
})(KeyType || (KeyType = {}));
var __KeyTypeValues;
(function(__KeyTypeValues2) {
  __KeyTypeValues2[__KeyTypeValues2["RSA"] = 0] = "RSA";
  __KeyTypeValues2[__KeyTypeValues2["Ed25519"] = 1] = "Ed25519";
  __KeyTypeValues2[__KeyTypeValues2["secp256k1"] = 2] = "secp256k1";
  __KeyTypeValues2[__KeyTypeValues2["ECDSA"] = 3] = "ECDSA";
})(__KeyTypeValues || (__KeyTypeValues = {}));
(function(KeyType2) {
  KeyType2.codec = () => {
    return enumeration(__KeyTypeValues);
  };
})(KeyType || (KeyType = {}));
var PublicKey;
(function(PublicKey2) {
  let _codec;
  PublicKey2.codec = () => {
    if (_codec == null) {
      _codec = message((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork();
        }
        if (obj.Type != null) {
          w.uint32(8);
          KeyType.codec().encode(obj.Type, w);
        }
        if (obj.Data != null) {
          w.uint32(18);
          w.bytes(obj.Data);
        }
        if (opts.lengthDelimited !== false) {
          w.ldelim();
        }
      }, (reader, length3, opts = {}) => {
        const obj = {};
        const end = length3 == null ? reader.len : reader.pos + length3;
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              obj.Type = KeyType.codec().decode(reader);
              break;
            }
            case 2: {
              obj.Data = reader.bytes();
              break;
            }
            default: {
              reader.skipType(tag & 7);
              break;
            }
          }
        }
        return obj;
      });
    }
    return _codec;
  };
  PublicKey2.encode = (obj) => {
    return encodeMessage(obj, PublicKey2.codec());
  };
  PublicKey2.decode = (buf, opts) => {
    return decodeMessage(buf, PublicKey2.codec(), opts);
  };
})(PublicKey || (PublicKey = {}));
var PrivateKey;
(function(PrivateKey2) {
  let _codec;
  PrivateKey2.codec = () => {
    if (_codec == null) {
      _codec = message((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork();
        }
        if (obj.Type != null) {
          w.uint32(8);
          KeyType.codec().encode(obj.Type, w);
        }
        if (obj.Data != null) {
          w.uint32(18);
          w.bytes(obj.Data);
        }
        if (opts.lengthDelimited !== false) {
          w.ldelim();
        }
      }, (reader, length3, opts = {}) => {
        const obj = {};
        const end = length3 == null ? reader.len : reader.pos + length3;
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              obj.Type = KeyType.codec().decode(reader);
              break;
            }
            case 2: {
              obj.Data = reader.bytes();
              break;
            }
            default: {
              reader.skipType(tag & 7);
              break;
            }
          }
        }
        return obj;
      });
    }
    return _codec;
  };
  PrivateKey2.encode = (obj) => {
    return encodeMessage(obj, PrivateKey2.codec());
  };
  PrivateKey2.decode = (buf, opts) => {
    return decodeMessage(buf, PrivateKey2.codec(), opts);
  };
})(PrivateKey || (PrivateKey = {}));

// node_modules/@libp2p/crypto/dist/src/keys/rsa/utils.js
var utils_exports = {};
__export(utils_exports, {
  MAX_RSA_KEY_SIZE: () => MAX_RSA_KEY_SIZE,
  generateRSAKeyPair: () => generateRSAKeyPair,
  jwkToJWKKeyPair: () => jwkToJWKKeyPair,
  jwkToPkcs1: () => jwkToPkcs1,
  jwkToPkix: () => jwkToPkix,
  jwkToRSAPrivateKey: () => jwkToRSAPrivateKey,
  pkcs1MessageToJwk: () => pkcs1MessageToJwk,
  pkcs1MessageToRSAPrivateKey: () => pkcs1MessageToRSAPrivateKey,
  pkcs1ToJwk: () => pkcs1ToJwk,
  pkcs1ToRSAPrivateKey: () => pkcs1ToRSAPrivateKey,
  pkixMessageToJwk: () => pkixMessageToJwk,
  pkixMessageToRSAPublicKey: () => pkixMessageToRSAPublicKey,
  pkixToJwk: () => pkixToJwk,
  pkixToRSAPublicKey: () => pkixToRSAPublicKey
});

// node_modules/@libp2p/crypto/dist/src/keys/rsa/rsa.js
var RSAPublicKey = class {
  static {
    __name(this, "RSAPublicKey");
  }
  type = "RSA";
  jwk;
  _raw;
  _multihash;
  constructor(jwk, digest2) {
    this.jwk = jwk;
    this._multihash = digest2;
  }
  get raw() {
    if (this._raw == null) {
      this._raw = utils_exports.jwkToPkix(this.jwk);
    }
    return this._raw;
  }
  toMultihash() {
    return this._multihash;
  }
  toCID() {
    return CID.createV1(114, this._multihash);
  }
  toString() {
    return base58btc.encode(this.toMultihash().bytes).substring(1);
  }
  equals(key) {
    if (key == null || !(key.raw instanceof Uint8Array)) {
      return false;
    }
    return equals3(this.raw, key.raw);
  }
  verify(data, sig, options) {
    return hashAndVerify3(this.jwk, sig, data, options);
  }
};
var RSAPrivateKey = class {
  static {
    __name(this, "RSAPrivateKey");
  }
  type = "RSA";
  jwk;
  _raw;
  publicKey;
  constructor(jwk, publicKey) {
    this.jwk = jwk;
    this.publicKey = publicKey;
  }
  get raw() {
    if (this._raw == null) {
      this._raw = utils_exports.jwkToPkcs1(this.jwk);
    }
    return this._raw;
  }
  equals(key) {
    if (key == null || !(key.raw instanceof Uint8Array)) {
      return false;
    }
    return equals3(this.raw, key.raw);
  }
  sign(message2, options) {
    return hashAndSign3(this.jwk, message2, options);
  }
};

// node_modules/@libp2p/crypto/dist/src/keys/rsa/utils.js
var MAX_RSA_KEY_SIZE = 8192;
var SHA2_256_CODE = 18;
var MAX_RSA_JWK_SIZE = 1062;
var RSA_ALGORITHM_IDENTIFIER = Uint8Array.from([
  48,
  13,
  6,
  9,
  42,
  134,
  72,
  134,
  247,
  13,
  1,
  1,
  1,
  5,
  0
]);
function pkcs1ToJwk(bytes) {
  const message2 = decodeDer(bytes);
  return pkcs1MessageToJwk(message2);
}
__name(pkcs1ToJwk, "pkcs1ToJwk");
function pkcs1MessageToJwk(message2) {
  return {
    n: toString2(message2[1], "base64url"),
    e: toString2(message2[2], "base64url"),
    d: toString2(message2[3], "base64url"),
    p: toString2(message2[4], "base64url"),
    q: toString2(message2[5], "base64url"),
    dp: toString2(message2[6], "base64url"),
    dq: toString2(message2[7], "base64url"),
    qi: toString2(message2[8], "base64url"),
    kty: "RSA"
  };
}
__name(pkcs1MessageToJwk, "pkcs1MessageToJwk");
function jwkToPkcs1(jwk) {
  if (jwk.n == null || jwk.e == null || jwk.d == null || jwk.p == null || jwk.q == null || jwk.dp == null || jwk.dq == null || jwk.qi == null) {
    throw new InvalidParametersError("JWK was missing components");
  }
  return encodeSequence([
    encodeInteger(Uint8Array.from([0])),
    encodeInteger(fromString2(jwk.n, "base64url")),
    encodeInteger(fromString2(jwk.e, "base64url")),
    encodeInteger(fromString2(jwk.d, "base64url")),
    encodeInteger(fromString2(jwk.p, "base64url")),
    encodeInteger(fromString2(jwk.q, "base64url")),
    encodeInteger(fromString2(jwk.dp, "base64url")),
    encodeInteger(fromString2(jwk.dq, "base64url")),
    encodeInteger(fromString2(jwk.qi, "base64url"))
  ]).subarray();
}
__name(jwkToPkcs1, "jwkToPkcs1");
function pkixToJwk(bytes) {
  const message2 = decodeDer(bytes, {
    offset: 0
  });
  return pkixMessageToJwk(message2);
}
__name(pkixToJwk, "pkixToJwk");
function pkixMessageToJwk(message2) {
  const keys = decodeDer(message2[1], {
    offset: 0
  });
  return {
    kty: "RSA",
    n: toString2(keys[0], "base64url"),
    e: toString2(keys[1], "base64url")
  };
}
__name(pkixMessageToJwk, "pkixMessageToJwk");
function jwkToPkix(jwk) {
  if (jwk.n == null || jwk.e == null) {
    throw new InvalidParametersError("JWK was missing components");
  }
  const subjectPublicKeyInfo = encodeSequence([
    RSA_ALGORITHM_IDENTIFIER,
    encodeBitString(encodeSequence([
      encodeInteger(fromString2(jwk.n, "base64url")),
      encodeInteger(fromString2(jwk.e, "base64url"))
    ]))
  ]);
  return subjectPublicKeyInfo.subarray();
}
__name(jwkToPkix, "jwkToPkix");
function pkcs1ToRSAPrivateKey(bytes) {
  const message2 = decodeDer(bytes);
  return pkcs1MessageToRSAPrivateKey(message2);
}
__name(pkcs1ToRSAPrivateKey, "pkcs1ToRSAPrivateKey");
function pkcs1MessageToRSAPrivateKey(message2) {
  const jwk = pkcs1MessageToJwk(message2);
  return jwkToRSAPrivateKey(jwk);
}
__name(pkcs1MessageToRSAPrivateKey, "pkcs1MessageToRSAPrivateKey");
function pkixToRSAPublicKey(bytes, digest2) {
  if (bytes.byteLength >= MAX_RSA_JWK_SIZE) {
    throw new InvalidPublicKeyError("Key size is too large");
  }
  const message2 = decodeDer(bytes, {
    offset: 0
  });
  return pkixMessageToRSAPublicKey(message2, bytes, digest2);
}
__name(pkixToRSAPublicKey, "pkixToRSAPublicKey");
function pkixMessageToRSAPublicKey(message2, bytes, digest2) {
  const jwk = pkixMessageToJwk(message2);
  if (digest2 == null) {
    const hash = sha2562(PublicKey.encode({
      Type: KeyType.RSA,
      Data: bytes
    }));
    digest2 = create(SHA2_256_CODE, hash);
  }
  return new RSAPublicKey(jwk, digest2);
}
__name(pkixMessageToRSAPublicKey, "pkixMessageToRSAPublicKey");
function jwkToRSAPrivateKey(jwk) {
  if (rsaKeySize(jwk) > MAX_RSA_KEY_SIZE) {
    throw new InvalidParametersError("Key size is too large");
  }
  const keys = jwkToJWKKeyPair(jwk);
  const hash = sha2562(PublicKey.encode({
    Type: KeyType.RSA,
    Data: jwkToPkix(keys.publicKey)
  }));
  const digest2 = create(SHA2_256_CODE, hash);
  return new RSAPrivateKey(keys.privateKey, new RSAPublicKey(keys.publicKey, digest2));
}
__name(jwkToRSAPrivateKey, "jwkToRSAPrivateKey");
async function generateRSAKeyPair(bits) {
  if (bits > MAX_RSA_KEY_SIZE) {
    throw new InvalidParametersError("Key size is too large");
  }
  const keys = await generateRSAKey(bits);
  const hash = sha2562(PublicKey.encode({
    Type: KeyType.RSA,
    Data: jwkToPkix(keys.publicKey)
  }));
  const digest2 = create(SHA2_256_CODE, hash);
  return new RSAPrivateKey(keys.privateKey, new RSAPublicKey(keys.publicKey, digest2));
}
__name(generateRSAKeyPair, "generateRSAKeyPair");
function jwkToJWKKeyPair(key) {
  if (key == null) {
    throw new InvalidParametersError("Missing key parameter");
  }
  return {
    privateKey: key,
    publicKey: {
      kty: key.kty,
      n: key.n,
      e: key.e
    }
  };
}
__name(jwkToJWKKeyPair, "jwkToJWKKeyPair");

// node_modules/@libp2p/crypto/dist/src/keys/rsa/index.browser.js
async function generateRSAKey(bits, options) {
  const pair = await webcrypto_default.get().subtle.generateKey({
    name: "RSASSA-PKCS1-v1_5",
    modulusLength: bits,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: { name: "SHA-256" }
  }, true, ["sign", "verify"]);
  options?.signal?.throwIfAborted();
  const keys = await exportKey(pair, options);
  return {
    privateKey: keys[0],
    publicKey: keys[1]
  };
}
__name(generateRSAKey, "generateRSAKey");
async function hashAndSign3(key, msg, options) {
  const privateKey = await webcrypto_default.get().subtle.importKey("jwk", key, {
    name: "RSASSA-PKCS1-v1_5",
    hash: { name: "SHA-256" }
  }, false, ["sign"]);
  options?.signal?.throwIfAborted();
  const sig = await webcrypto_default.get().subtle.sign({ name: "RSASSA-PKCS1-v1_5" }, privateKey, msg instanceof Uint8Array ? msg : msg.subarray());
  options?.signal?.throwIfAborted();
  return new Uint8Array(sig, 0, sig.byteLength);
}
__name(hashAndSign3, "hashAndSign");
async function hashAndVerify3(key, sig, msg, options) {
  const publicKey = await webcrypto_default.get().subtle.importKey("jwk", key, {
    name: "RSASSA-PKCS1-v1_5",
    hash: { name: "SHA-256" }
  }, false, ["verify"]);
  options?.signal?.throwIfAborted();
  const result = await webcrypto_default.get().subtle.verify({ name: "RSASSA-PKCS1-v1_5" }, publicKey, sig, msg instanceof Uint8Array ? msg : msg.subarray());
  options?.signal?.throwIfAborted();
  return result;
}
__name(hashAndVerify3, "hashAndVerify");
async function exportKey(pair, options) {
  if (pair.privateKey == null || pair.publicKey == null) {
    throw new InvalidParametersError("Private and public key are required");
  }
  const result = await Promise.all([
    webcrypto_default.get().subtle.exportKey("jwk", pair.privateKey),
    webcrypto_default.get().subtle.exportKey("jwk", pair.publicKey)
  ]);
  options?.signal?.throwIfAborted();
  return result;
}
__name(exportKey, "exportKey");
function rsaKeySize(jwk) {
  if (jwk.kty !== "RSA") {
    throw new InvalidParametersError("invalid key type");
  } else if (jwk.n == null) {
    throw new InvalidParametersError("invalid key modulus");
  }
  const bytes = fromString2(jwk.n, "base64url");
  return bytes.length * 8;
}
__name(rsaKeySize, "rsaKeySize");

// node_modules/@libp2p/crypto/node_modules/@noble/hashes/hmac.js
var _HMAC = class {
  static {
    __name(this, "_HMAC");
  }
  oHash;
  iHash;
  blockLen;
  outputLen;
  finished = false;
  destroyed = false;
  constructor(hash, key) {
    ahash(hash);
    abytes(key, void 0, "key");
    this.iHash = hash.create();
    if (typeof this.iHash.update !== "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const blockLen = this.blockLen;
    const pad = new Uint8Array(blockLen);
    pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
    for (let i = 0; i < pad.length; i++)
      pad[i] ^= 54;
    this.iHash.update(pad);
    this.oHash = hash.create();
    for (let i = 0; i < pad.length; i++)
      pad[i] ^= 54 ^ 92;
    this.oHash.update(pad);
    clean(pad);
  }
  update(buf) {
    aexists(this);
    this.iHash.update(buf);
    return this;
  }
  digestInto(out) {
    aexists(this);
    abytes(out, this.outputLen, "output");
    this.finished = true;
    this.iHash.digestInto(out);
    this.oHash.update(out);
    this.oHash.digestInto(out);
    this.destroy();
  }
  digest() {
    const out = new Uint8Array(this.oHash.outputLen);
    this.digestInto(out);
    return out;
  }
  _cloneInto(to) {
    to ||= Object.create(Object.getPrototypeOf(this), {});
    const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
    to = to;
    to.finished = finished;
    to.destroyed = destroyed;
    to.blockLen = blockLen;
    to.outputLen = outputLen;
    to.oHash = oHash._cloneInto(to.oHash);
    to.iHash = iHash._cloneInto(to.iHash);
    return to;
  }
  clone() {
    return this._cloneInto();
  }
  destroy() {
    this.destroyed = true;
    this.oHash.destroy();
    this.iHash.destroy();
  }
};
var hmac = /* @__PURE__ */ __name((hash, key, message2) => new _HMAC(hash, key).update(message2).digest(), "hmac");
hmac.create = (hash, key) => new _HMAC(hash, key);

// node_modules/@libp2p/crypto/node_modules/@noble/curves/abstract/weierstrass.js
var divNearest = /* @__PURE__ */ __name((num, den) => (num + (num >= 0 ? den : -den) / _2n4) / den, "divNearest");
function _splitEndoScalar(k, basis, n) {
  const [[a1, b1], [a2, b2]] = basis;
  const c1 = divNearest(b2 * k, n);
  const c2 = divNearest(-b1 * k, n);
  let k1 = k - c1 * a1 - c2 * a2;
  let k2 = -c1 * b1 - c2 * b2;
  const k1neg = k1 < _0n5;
  const k2neg = k2 < _0n5;
  if (k1neg)
    k1 = -k1;
  if (k2neg)
    k2 = -k2;
  const MAX_NUM = bitMask(Math.ceil(bitLen(n) / 2)) + _1n6;
  if (k1 < _0n5 || k1 >= MAX_NUM || k2 < _0n5 || k2 >= MAX_NUM) {
    throw new Error("splitScalar (endomorphism): failed, k=" + k);
  }
  return { k1neg, k1, k2neg, k2 };
}
__name(_splitEndoScalar, "_splitEndoScalar");
function validateSigFormat(format2) {
  if (!["compact", "recovered", "der"].includes(format2))
    throw new Error('Signature format must be "compact", "recovered", or "der"');
  return format2;
}
__name(validateSigFormat, "validateSigFormat");
function validateSigOpts(opts, def) {
  const optsn = {};
  for (let optName of Object.keys(def)) {
    optsn[optName] = opts[optName] === void 0 ? def[optName] : opts[optName];
  }
  abool(optsn.lowS, "lowS");
  abool(optsn.prehash, "prehash");
  if (optsn.format !== void 0)
    validateSigFormat(optsn.format);
  return optsn;
}
__name(validateSigOpts, "validateSigOpts");
var DERErr = class extends Error {
  static {
    __name(this, "DERErr");
  }
  constructor(m = "") {
    super(m);
  }
};
var DER = {
  // asn.1 DER encoding utils
  Err: DERErr,
  // Basic building block is TLV (Tag-Length-Value)
  _tlv: {
    encode: /* @__PURE__ */ __name((tag, data) => {
      const { Err: E } = DER;
      if (tag < 0 || tag > 256)
        throw new E("tlv.encode: wrong tag");
      if (data.length & 1)
        throw new E("tlv.encode: unpadded data");
      const dataLen = data.length / 2;
      const len = numberToHexUnpadded(dataLen);
      if (len.length / 2 & 128)
        throw new E("tlv.encode: long form length too big");
      const lenLen = dataLen > 127 ? numberToHexUnpadded(len.length / 2 | 128) : "";
      const t = numberToHexUnpadded(tag);
      return t + lenLen + len + data;
    }, "encode"),
    // v - value, l - left bytes (unparsed)
    decode(tag, data) {
      const { Err: E } = DER;
      let pos = 0;
      if (tag < 0 || tag > 256)
        throw new E("tlv.encode: wrong tag");
      if (data.length < 2 || data[pos++] !== tag)
        throw new E("tlv.decode: wrong tlv");
      const first = data[pos++];
      const isLong = !!(first & 128);
      let length3 = 0;
      if (!isLong)
        length3 = first;
      else {
        const lenLen = first & 127;
        if (!lenLen)
          throw new E("tlv.decode(long): indefinite length not supported");
        if (lenLen > 4)
          throw new E("tlv.decode(long): byte length is too big");
        const lengthBytes = data.subarray(pos, pos + lenLen);
        if (lengthBytes.length !== lenLen)
          throw new E("tlv.decode: length bytes not complete");
        if (lengthBytes[0] === 0)
          throw new E("tlv.decode(long): zero leftmost byte");
        for (const b of lengthBytes)
          length3 = length3 << 8 | b;
        pos += lenLen;
        if (length3 < 128)
          throw new E("tlv.decode(long): not minimal encoding");
      }
      const v = data.subarray(pos, pos + length3);
      if (v.length !== length3)
        throw new E("tlv.decode: wrong value length");
      return { v, l: data.subarray(pos + length3) };
    }
  },
  // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
  // since we always use positive integers here. It must always be empty:
  // - add zero byte if exists
  // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
  _int: {
    encode(num) {
      const { Err: E } = DER;
      if (num < _0n5)
        throw new E("integer: negative integers are not allowed");
      let hex = numberToHexUnpadded(num);
      if (Number.parseInt(hex[0], 16) & 8)
        hex = "00" + hex;
      if (hex.length & 1)
        throw new E("unexpected DER parsing assertion: unpadded hex");
      return hex;
    },
    decode(data) {
      const { Err: E } = DER;
      if (data[0] & 128)
        throw new E("invalid signature integer: negative");
      if (data[0] === 0 && !(data[1] & 128))
        throw new E("invalid signature integer: unnecessary leading zero");
      return bytesToNumberBE(data);
    }
  },
  toSig(bytes) {
    const { Err: E, _int: int, _tlv: tlv } = DER;
    const data = abytes(bytes, void 0, "signature");
    const { v: seqBytes, l: seqLeftBytes } = tlv.decode(48, data);
    if (seqLeftBytes.length)
      throw new E("invalid signature: left bytes after parsing");
    const { v: rBytes, l: rLeftBytes } = tlv.decode(2, seqBytes);
    const { v: sBytes, l: sLeftBytes } = tlv.decode(2, rLeftBytes);
    if (sLeftBytes.length)
      throw new E("invalid signature: left bytes after parsing");
    return { r: int.decode(rBytes), s: int.decode(sBytes) };
  },
  hexFromSig(sig) {
    const { _tlv: tlv, _int: int } = DER;
    const rs = tlv.encode(2, int.encode(sig.r));
    const ss = tlv.encode(2, int.encode(sig.s));
    const seq = rs + ss;
    return tlv.encode(48, seq);
  }
};
var _0n5 = BigInt(0);
var _1n6 = BigInt(1);
var _2n4 = BigInt(2);
var _3n2 = BigInt(3);
var _4n2 = BigInt(4);
function weierstrass(params, extraOpts = {}) {
  const validated = createCurveFields("weierstrass", params, extraOpts);
  const { Fp, Fn } = validated;
  let CURVE = validated.CURVE;
  const { h: cofactor, n: CURVE_ORDER } = CURVE;
  validateObject(extraOpts, {}, {
    allowInfinityPoint: "boolean",
    clearCofactor: "function",
    isTorsionFree: "function",
    fromBytes: "function",
    toBytes: "function",
    endo: "object"
  });
  const { endo } = extraOpts;
  if (endo) {
    if (!Fp.is0(CURVE.a) || typeof endo.beta !== "bigint" || !Array.isArray(endo.basises)) {
      throw new Error('invalid endo: expected "beta": bigint and "basises": array');
    }
  }
  const lengths = getWLengths(Fp, Fn);
  function assertCompressionIsSupported() {
    if (!Fp.isOdd)
      throw new Error("compression is not supported: Field does not have .isOdd()");
  }
  __name(assertCompressionIsSupported, "assertCompressionIsSupported");
  function pointToBytes(_c, point, isCompressed) {
    const { x, y } = point.toAffine();
    const bx = Fp.toBytes(x);
    abool(isCompressed, "isCompressed");
    if (isCompressed) {
      assertCompressionIsSupported();
      const hasEvenY = !Fp.isOdd(y);
      return concatBytes(pprefix(hasEvenY), bx);
    } else {
      return concatBytes(Uint8Array.of(4), bx, Fp.toBytes(y));
    }
  }
  __name(pointToBytes, "pointToBytes");
  function pointFromBytes(bytes) {
    abytes(bytes, void 0, "Point");
    const { publicKey: comp, publicKeyUncompressed: uncomp } = lengths;
    const length3 = bytes.length;
    const head = bytes[0];
    const tail = bytes.subarray(1);
    if (length3 === comp && (head === 2 || head === 3)) {
      const x = Fp.fromBytes(tail);
      if (!Fp.isValid(x))
        throw new Error("bad point: is not on curve, wrong x");
      const y2 = weierstrassEquation(x);
      let y;
      try {
        y = Fp.sqrt(y2);
      } catch (sqrtError) {
        const err = sqrtError instanceof Error ? ": " + sqrtError.message : "";
        throw new Error("bad point: is not on curve, sqrt error" + err);
      }
      assertCompressionIsSupported();
      const evenY = Fp.isOdd(y);
      const evenH = (head & 1) === 1;
      if (evenH !== evenY)
        y = Fp.neg(y);
      return { x, y };
    } else if (length3 === uncomp && head === 4) {
      const L = Fp.BYTES;
      const x = Fp.fromBytes(tail.subarray(0, L));
      const y = Fp.fromBytes(tail.subarray(L, L * 2));
      if (!isValidXY(x, y))
        throw new Error("bad point: is not on curve");
      return { x, y };
    } else {
      throw new Error(`bad point: got length ${length3}, expected compressed=${comp} or uncompressed=${uncomp}`);
    }
  }
  __name(pointFromBytes, "pointFromBytes");
  const encodePoint = extraOpts.toBytes || pointToBytes;
  const decodePoint = extraOpts.fromBytes || pointFromBytes;
  function weierstrassEquation(x) {
    const x2 = Fp.sqr(x);
    const x3 = Fp.mul(x2, x);
    return Fp.add(Fp.add(x3, Fp.mul(x, CURVE.a)), CURVE.b);
  }
  __name(weierstrassEquation, "weierstrassEquation");
  function isValidXY(x, y) {
    const left = Fp.sqr(y);
    const right = weierstrassEquation(x);
    return Fp.eql(left, right);
  }
  __name(isValidXY, "isValidXY");
  if (!isValidXY(CURVE.Gx, CURVE.Gy))
    throw new Error("bad curve params: generator point");
  const _4a3 = Fp.mul(Fp.pow(CURVE.a, _3n2), _4n2);
  const _27b2 = Fp.mul(Fp.sqr(CURVE.b), BigInt(27));
  if (Fp.is0(Fp.add(_4a3, _27b2)))
    throw new Error("bad curve params: a or b");
  function acoord(title, n, banZero = false) {
    if (!Fp.isValid(n) || banZero && Fp.is0(n))
      throw new Error(`bad point coordinate ${title}`);
    return n;
  }
  __name(acoord, "acoord");
  function aprjpoint(other) {
    if (!(other instanceof Point))
      throw new Error("Weierstrass Point expected");
  }
  __name(aprjpoint, "aprjpoint");
  function splitEndoScalarN(k) {
    if (!endo || !endo.basises)
      throw new Error("no endo");
    return _splitEndoScalar(k, endo.basises, Fn.ORDER);
  }
  __name(splitEndoScalarN, "splitEndoScalarN");
  const toAffineMemo = memoized((p, iz) => {
    const { X, Y, Z } = p;
    if (Fp.eql(Z, Fp.ONE))
      return { x: X, y: Y };
    const is0 = p.is0();
    if (iz == null)
      iz = is0 ? Fp.ONE : Fp.inv(Z);
    const x = Fp.mul(X, iz);
    const y = Fp.mul(Y, iz);
    const zz = Fp.mul(Z, iz);
    if (is0)
      return { x: Fp.ZERO, y: Fp.ZERO };
    if (!Fp.eql(zz, Fp.ONE))
      throw new Error("invZ was invalid");
    return { x, y };
  });
  const assertValidMemo = memoized((p) => {
    if (p.is0()) {
      if (extraOpts.allowInfinityPoint && !Fp.is0(p.Y))
        return;
      throw new Error("bad point: ZERO");
    }
    const { x, y } = p.toAffine();
    if (!Fp.isValid(x) || !Fp.isValid(y))
      throw new Error("bad point: x or y not field elements");
    if (!isValidXY(x, y))
      throw new Error("bad point: equation left != right");
    if (!p.isTorsionFree())
      throw new Error("bad point: not in prime-order subgroup");
    return true;
  });
  function finishEndo(endoBeta, k1p, k2p, k1neg, k2neg) {
    k2p = new Point(Fp.mul(k2p.X, endoBeta), k2p.Y, k2p.Z);
    k1p = negateCt(k1neg, k1p);
    k2p = negateCt(k2neg, k2p);
    return k1p.add(k2p);
  }
  __name(finishEndo, "finishEndo");
  class Point {
    static {
      __name(this, "Point");
    }
    // base / generator point
    static BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE);
    // zero / infinity / identity point
    static ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ZERO);
    // 0, 1, 0
    // math field
    static Fp = Fp;
    // scalar field
    static Fn = Fn;
    X;
    Y;
    Z;
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    constructor(X, Y, Z) {
      this.X = acoord("x", X);
      this.Y = acoord("y", Y, true);
      this.Z = acoord("z", Z);
      Object.freeze(this);
    }
    static CURVE() {
      return CURVE;
    }
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    static fromAffine(p) {
      const { x, y } = p || {};
      if (!p || !Fp.isValid(x) || !Fp.isValid(y))
        throw new Error("invalid affine point");
      if (p instanceof Point)
        throw new Error("projective point not allowed");
      if (Fp.is0(x) && Fp.is0(y))
        return Point.ZERO;
      return new Point(x, y, Fp.ONE);
    }
    static fromBytes(bytes) {
      const P = Point.fromAffine(decodePoint(abytes(bytes, void 0, "point")));
      P.assertValidity();
      return P;
    }
    static fromHex(hex) {
      return Point.fromBytes(hexToBytes(hex));
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    /**
     *
     * @param windowSize
     * @param isLazy true will defer table computation until the first multiplication
     * @returns
     */
    precompute(windowSize = 8, isLazy = true) {
      wnaf.createCache(this, windowSize);
      if (!isLazy)
        this.multiply(_3n2);
      return this;
    }
    // TODO: return `this`
    /** A point on curve is valid if it conforms to equation. */
    assertValidity() {
      assertValidMemo(this);
    }
    hasEvenY() {
      const { y } = this.toAffine();
      if (!Fp.isOdd)
        throw new Error("Field doesn't support isOdd");
      return !Fp.isOdd(y);
    }
    /** Compare one point to another. */
    equals(other) {
      aprjpoint(other);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const { X: X2, Y: Y2, Z: Z2 } = other;
      const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
      const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
      return U1 && U2;
    }
    /** Flips point to one corresponding to (x, -y) in Affine coordinates. */
    negate() {
      return new Point(this.X, Fp.neg(this.Y), this.Z);
    }
    // Renes-Costello-Batina exception-free doubling formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 3
    // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
    double() {
      const { a, b } = CURVE;
      const b3 = Fp.mul(b, _3n2);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
      let t0 = Fp.mul(X1, X1);
      let t1 = Fp.mul(Y1, Y1);
      let t2 = Fp.mul(Z1, Z1);
      let t3 = Fp.mul(X1, Y1);
      t3 = Fp.add(t3, t3);
      Z3 = Fp.mul(X1, Z1);
      Z3 = Fp.add(Z3, Z3);
      X3 = Fp.mul(a, Z3);
      Y3 = Fp.mul(b3, t2);
      Y3 = Fp.add(X3, Y3);
      X3 = Fp.sub(t1, Y3);
      Y3 = Fp.add(t1, Y3);
      Y3 = Fp.mul(X3, Y3);
      X3 = Fp.mul(t3, X3);
      Z3 = Fp.mul(b3, Z3);
      t2 = Fp.mul(a, t2);
      t3 = Fp.sub(t0, t2);
      t3 = Fp.mul(a, t3);
      t3 = Fp.add(t3, Z3);
      Z3 = Fp.add(t0, t0);
      t0 = Fp.add(Z3, t0);
      t0 = Fp.add(t0, t2);
      t0 = Fp.mul(t0, t3);
      Y3 = Fp.add(Y3, t0);
      t2 = Fp.mul(Y1, Z1);
      t2 = Fp.add(t2, t2);
      t0 = Fp.mul(t2, t3);
      X3 = Fp.sub(X3, t0);
      Z3 = Fp.mul(t2, t1);
      Z3 = Fp.add(Z3, Z3);
      Z3 = Fp.add(Z3, Z3);
      return new Point(X3, Y3, Z3);
    }
    // Renes-Costello-Batina exception-free addition formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 1
    // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
    add(other) {
      aprjpoint(other);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const { X: X2, Y: Y2, Z: Z2 } = other;
      let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
      const a = CURVE.a;
      const b3 = Fp.mul(CURVE.b, _3n2);
      let t0 = Fp.mul(X1, X2);
      let t1 = Fp.mul(Y1, Y2);
      let t2 = Fp.mul(Z1, Z2);
      let t3 = Fp.add(X1, Y1);
      let t4 = Fp.add(X2, Y2);
      t3 = Fp.mul(t3, t4);
      t4 = Fp.add(t0, t1);
      t3 = Fp.sub(t3, t4);
      t4 = Fp.add(X1, Z1);
      let t5 = Fp.add(X2, Z2);
      t4 = Fp.mul(t4, t5);
      t5 = Fp.add(t0, t2);
      t4 = Fp.sub(t4, t5);
      t5 = Fp.add(Y1, Z1);
      X3 = Fp.add(Y2, Z2);
      t5 = Fp.mul(t5, X3);
      X3 = Fp.add(t1, t2);
      t5 = Fp.sub(t5, X3);
      Z3 = Fp.mul(a, t4);
      X3 = Fp.mul(b3, t2);
      Z3 = Fp.add(X3, Z3);
      X3 = Fp.sub(t1, Z3);
      Z3 = Fp.add(t1, Z3);
      Y3 = Fp.mul(X3, Z3);
      t1 = Fp.add(t0, t0);
      t1 = Fp.add(t1, t0);
      t2 = Fp.mul(a, t2);
      t4 = Fp.mul(b3, t4);
      t1 = Fp.add(t1, t2);
      t2 = Fp.sub(t0, t2);
      t2 = Fp.mul(a, t2);
      t4 = Fp.add(t4, t2);
      t0 = Fp.mul(t1, t4);
      Y3 = Fp.add(Y3, t0);
      t0 = Fp.mul(t5, t4);
      X3 = Fp.mul(t3, X3);
      X3 = Fp.sub(X3, t0);
      t0 = Fp.mul(t3, t1);
      Z3 = Fp.mul(t5, Z3);
      Z3 = Fp.add(Z3, t0);
      return new Point(X3, Y3, Z3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    is0() {
      return this.equals(Point.ZERO);
    }
    /**
     * Constant time multiplication.
     * Uses wNAF method. Windowed method may be 10% faster,
     * but takes 2x longer to generate and consumes 2x memory.
     * Uses precomputes when available.
     * Uses endomorphism for Koblitz curves.
     * @param scalar by which the point would be multiplied
     * @returns New point
     */
    multiply(scalar) {
      const { endo: endo2 } = extraOpts;
      if (!Fn.isValidNot0(scalar))
        throw new Error("invalid scalar: out of range");
      let point, fake;
      const mul = /* @__PURE__ */ __name((n) => wnaf.cached(this, n, (p) => normalizeZ(Point, p)), "mul");
      if (endo2) {
        const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(scalar);
        const { p: k1p, f: k1f } = mul(k1);
        const { p: k2p, f: k2f } = mul(k2);
        fake = k1f.add(k2f);
        point = finishEndo(endo2.beta, k1p, k2p, k1neg, k2neg);
      } else {
        const { p, f } = mul(scalar);
        point = p;
        fake = f;
      }
      return normalizeZ(Point, [point, fake])[0];
    }
    /**
     * Non-constant-time multiplication. Uses double-and-add algorithm.
     * It's faster, but should only be used when you don't care about
     * an exposed secret key e.g. sig verification, which works over *public* keys.
     */
    multiplyUnsafe(sc) {
      const { endo: endo2 } = extraOpts;
      const p = this;
      if (!Fn.isValid(sc))
        throw new Error("invalid scalar: out of range");
      if (sc === _0n5 || p.is0())
        return Point.ZERO;
      if (sc === _1n6)
        return p;
      if (wnaf.hasCache(this))
        return this.multiply(sc);
      if (endo2) {
        const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(sc);
        const { p1, p2 } = mulEndoUnsafe(Point, p, k1, k2);
        return finishEndo(endo2.beta, p1, p2, k1neg, k2neg);
      } else {
        return wnaf.unsafe(p, sc);
      }
    }
    /**
     * Converts Projective point to affine (x, y) coordinates.
     * @param invertedZ Z^-1 (inverted zero) - optional, precomputation is useful for invertBatch
     */
    toAffine(invertedZ) {
      return toAffineMemo(this, invertedZ);
    }
    /**
     * Checks whether Point is free of torsion elements (is in prime subgroup).
     * Always torsion-free for cofactor=1 curves.
     */
    isTorsionFree() {
      const { isTorsionFree } = extraOpts;
      if (cofactor === _1n6)
        return true;
      if (isTorsionFree)
        return isTorsionFree(Point, this);
      return wnaf.unsafe(this, CURVE_ORDER).is0();
    }
    clearCofactor() {
      const { clearCofactor } = extraOpts;
      if (cofactor === _1n6)
        return this;
      if (clearCofactor)
        return clearCofactor(Point, this);
      return this.multiplyUnsafe(cofactor);
    }
    isSmallOrder() {
      return this.multiplyUnsafe(cofactor).is0();
    }
    toBytes(isCompressed = true) {
      abool(isCompressed, "isCompressed");
      this.assertValidity();
      return encodePoint(Point, this, isCompressed);
    }
    toHex(isCompressed = true) {
      return bytesToHex(this.toBytes(isCompressed));
    }
    toString() {
      return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
    }
  }
  const bits = Fn.BITS;
  const wnaf = new wNAF(Point, extraOpts.endo ? Math.ceil(bits / 2) : bits);
  Point.BASE.precompute(8);
  return Point;
}
__name(weierstrass, "weierstrass");
function pprefix(hasEvenY) {
  return Uint8Array.of(hasEvenY ? 2 : 3);
}
__name(pprefix, "pprefix");
function getWLengths(Fp, Fn) {
  return {
    secretKey: Fn.BYTES,
    publicKey: 1 + Fp.BYTES,
    publicKeyUncompressed: 1 + 2 * Fp.BYTES,
    publicKeyHasPrefix: true,
    signature: 2 * Fn.BYTES
  };
}
__name(getWLengths, "getWLengths");
function ecdh(Point, ecdhOpts = {}) {
  const { Fn } = Point;
  const randomBytes_ = ecdhOpts.randomBytes || randomBytes;
  const lengths = Object.assign(getWLengths(Point.Fp, Fn), { seed: getMinHashLength(Fn.ORDER) });
  function isValidSecretKey(secretKey) {
    try {
      const num = Fn.fromBytes(secretKey);
      return Fn.isValidNot0(num);
    } catch (error) {
      return false;
    }
  }
  __name(isValidSecretKey, "isValidSecretKey");
  function isValidPublicKey(publicKey, isCompressed) {
    const { publicKey: comp, publicKeyUncompressed } = lengths;
    try {
      const l = publicKey.length;
      if (isCompressed === true && l !== comp)
        return false;
      if (isCompressed === false && l !== publicKeyUncompressed)
        return false;
      return !!Point.fromBytes(publicKey);
    } catch (error) {
      return false;
    }
  }
  __name(isValidPublicKey, "isValidPublicKey");
  function randomSecretKey(seed = randomBytes_(lengths.seed)) {
    return mapHashToField(abytes(seed, lengths.seed, "seed"), Fn.ORDER);
  }
  __name(randomSecretKey, "randomSecretKey");
  function getPublicKey(secretKey, isCompressed = true) {
    return Point.BASE.multiply(Fn.fromBytes(secretKey)).toBytes(isCompressed);
  }
  __name(getPublicKey, "getPublicKey");
  function isProbPub(item) {
    const { secretKey, publicKey, publicKeyUncompressed } = lengths;
    if (!isBytes(item))
      return void 0;
    if ("_lengths" in Fn && Fn._lengths || secretKey === publicKey)
      return void 0;
    const l = abytes(item, void 0, "key").length;
    return l === publicKey || l === publicKeyUncompressed;
  }
  __name(isProbPub, "isProbPub");
  function getSharedSecret(secretKeyA, publicKeyB, isCompressed = true) {
    if (isProbPub(secretKeyA) === true)
      throw new Error("first arg must be private key");
    if (isProbPub(publicKeyB) === false)
      throw new Error("second arg must be public key");
    const s = Fn.fromBytes(secretKeyA);
    const b = Point.fromBytes(publicKeyB);
    return b.multiply(s).toBytes(isCompressed);
  }
  __name(getSharedSecret, "getSharedSecret");
  const utils = {
    isValidSecretKey,
    isValidPublicKey,
    randomSecretKey
  };
  const keygen = createKeygen(randomSecretKey, getPublicKey);
  return Object.freeze({ getPublicKey, getSharedSecret, keygen, Point, utils, lengths });
}
__name(ecdh, "ecdh");
function ecdsa(Point, hash, ecdsaOpts = {}) {
  ahash(hash);
  validateObject(ecdsaOpts, {}, {
    hmac: "function",
    lowS: "boolean",
    randomBytes: "function",
    bits2int: "function",
    bits2int_modN: "function"
  });
  ecdsaOpts = Object.assign({}, ecdsaOpts);
  const randomBytes2 = ecdsaOpts.randomBytes || randomBytes;
  const hmac2 = ecdsaOpts.hmac || ((key, msg) => hmac(hash, key, msg));
  const { Fp, Fn } = Point;
  const { ORDER: CURVE_ORDER, BITS: fnBits } = Fn;
  const { keygen, getPublicKey, getSharedSecret, utils, lengths } = ecdh(Point, ecdsaOpts);
  const defaultSigOpts = {
    prehash: true,
    lowS: typeof ecdsaOpts.lowS === "boolean" ? ecdsaOpts.lowS : true,
    format: "compact",
    extraEntropy: false
  };
  const hasLargeCofactor = CURVE_ORDER * _2n4 < Fp.ORDER;
  function isBiggerThanHalfOrder(number) {
    const HALF = CURVE_ORDER >> _1n6;
    return number > HALF;
  }
  __name(isBiggerThanHalfOrder, "isBiggerThanHalfOrder");
  function validateRS(title, num) {
    if (!Fn.isValidNot0(num))
      throw new Error(`invalid signature ${title}: out of range 1..Point.Fn.ORDER`);
    return num;
  }
  __name(validateRS, "validateRS");
  function assertSmallCofactor() {
    if (hasLargeCofactor)
      throw new Error('"recovered" sig type is not supported for cofactor >2 curves');
  }
  __name(assertSmallCofactor, "assertSmallCofactor");
  function validateSigLength(bytes, format2) {
    validateSigFormat(format2);
    const size = lengths.signature;
    const sizer = format2 === "compact" ? size : format2 === "recovered" ? size + 1 : void 0;
    return abytes(bytes, sizer);
  }
  __name(validateSigLength, "validateSigLength");
  class Signature {
    static {
      __name(this, "Signature");
    }
    r;
    s;
    recovery;
    constructor(r, s, recovery) {
      this.r = validateRS("r", r);
      this.s = validateRS("s", s);
      if (recovery != null) {
        assertSmallCofactor();
        if (![0, 1, 2, 3].includes(recovery))
          throw new Error("invalid recovery id");
        this.recovery = recovery;
      }
      Object.freeze(this);
    }
    static fromBytes(bytes, format2 = defaultSigOpts.format) {
      validateSigLength(bytes, format2);
      let recid;
      if (format2 === "der") {
        const { r: r2, s: s2 } = DER.toSig(abytes(bytes));
        return new Signature(r2, s2);
      }
      if (format2 === "recovered") {
        recid = bytes[0];
        format2 = "compact";
        bytes = bytes.subarray(1);
      }
      const L = lengths.signature / 2;
      const r = bytes.subarray(0, L);
      const s = bytes.subarray(L, L * 2);
      return new Signature(Fn.fromBytes(r), Fn.fromBytes(s), recid);
    }
    static fromHex(hex, format2) {
      return this.fromBytes(hexToBytes(hex), format2);
    }
    assertRecovery() {
      const { recovery } = this;
      if (recovery == null)
        throw new Error("invalid recovery id: must be present");
      return recovery;
    }
    addRecoveryBit(recovery) {
      return new Signature(this.r, this.s, recovery);
    }
    recoverPublicKey(messageHash) {
      const { r, s } = this;
      const recovery = this.assertRecovery();
      const radj = recovery === 2 || recovery === 3 ? r + CURVE_ORDER : r;
      if (!Fp.isValid(radj))
        throw new Error("invalid recovery id: sig.r+curve.n != R.x");
      const x = Fp.toBytes(radj);
      const R = Point.fromBytes(concatBytes(pprefix((recovery & 1) === 0), x));
      const ir = Fn.inv(radj);
      const h = bits2int_modN(abytes(messageHash, void 0, "msgHash"));
      const u1 = Fn.create(-h * ir);
      const u2 = Fn.create(s * ir);
      const Q = Point.BASE.multiplyUnsafe(u1).add(R.multiplyUnsafe(u2));
      if (Q.is0())
        throw new Error("invalid recovery: point at infinify");
      Q.assertValidity();
      return Q;
    }
    // Signatures should be low-s, to prevent malleability.
    hasHighS() {
      return isBiggerThanHalfOrder(this.s);
    }
    toBytes(format2 = defaultSigOpts.format) {
      validateSigFormat(format2);
      if (format2 === "der")
        return hexToBytes(DER.hexFromSig(this));
      const { r, s } = this;
      const rb = Fn.toBytes(r);
      const sb = Fn.toBytes(s);
      if (format2 === "recovered") {
        assertSmallCofactor();
        return concatBytes(Uint8Array.of(this.assertRecovery()), rb, sb);
      }
      return concatBytes(rb, sb);
    }
    toHex(format2) {
      return bytesToHex(this.toBytes(format2));
    }
  }
  const bits2int = ecdsaOpts.bits2int || /* @__PURE__ */ __name(function bits2int_def(bytes) {
    if (bytes.length > 8192)
      throw new Error("input is too large");
    const num = bytesToNumberBE(bytes);
    const delta = bytes.length * 8 - fnBits;
    return delta > 0 ? num >> BigInt(delta) : num;
  }, "bits2int_def");
  const bits2int_modN = ecdsaOpts.bits2int_modN || /* @__PURE__ */ __name(function bits2int_modN_def(bytes) {
    return Fn.create(bits2int(bytes));
  }, "bits2int_modN_def");
  const ORDER_MASK = bitMask(fnBits);
  function int2octets(num) {
    aInRange("num < 2^" + fnBits, num, _0n5, ORDER_MASK);
    return Fn.toBytes(num);
  }
  __name(int2octets, "int2octets");
  function validateMsgAndHash(message2, prehash) {
    abytes(message2, void 0, "message");
    return prehash ? abytes(hash(message2), void 0, "prehashed message") : message2;
  }
  __name(validateMsgAndHash, "validateMsgAndHash");
  function prepSig(message2, secretKey, opts) {
    const { lowS, prehash, extraEntropy } = validateSigOpts(opts, defaultSigOpts);
    message2 = validateMsgAndHash(message2, prehash);
    const h1int = bits2int_modN(message2);
    const d = Fn.fromBytes(secretKey);
    if (!Fn.isValidNot0(d))
      throw new Error("invalid private key");
    const seedArgs = [int2octets(d), int2octets(h1int)];
    if (extraEntropy != null && extraEntropy !== false) {
      const e = extraEntropy === true ? randomBytes2(lengths.secretKey) : extraEntropy;
      seedArgs.push(abytes(e, void 0, "extraEntropy"));
    }
    const seed = concatBytes(...seedArgs);
    const m = h1int;
    function k2sig(kBytes) {
      const k = bits2int(kBytes);
      if (!Fn.isValidNot0(k))
        return;
      const ik = Fn.inv(k);
      const q = Point.BASE.multiply(k).toAffine();
      const r = Fn.create(q.x);
      if (r === _0n5)
        return;
      const s = Fn.create(ik * Fn.create(m + r * d));
      if (s === _0n5)
        return;
      let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n6);
      let normS = s;
      if (lowS && isBiggerThanHalfOrder(s)) {
        normS = Fn.neg(s);
        recovery ^= 1;
      }
      return new Signature(r, normS, hasLargeCofactor ? void 0 : recovery);
    }
    __name(k2sig, "k2sig");
    return { seed, k2sig };
  }
  __name(prepSig, "prepSig");
  function sign(message2, secretKey, opts = {}) {
    const { seed, k2sig } = prepSig(message2, secretKey, opts);
    const drbg = createHmacDrbg(hash.outputLen, Fn.BYTES, hmac2);
    const sig = drbg(seed, k2sig);
    return sig.toBytes(opts.format);
  }
  __name(sign, "sign");
  function verify(signature, message2, publicKey, opts = {}) {
    const { lowS, prehash, format: format2 } = validateSigOpts(opts, defaultSigOpts);
    publicKey = abytes(publicKey, void 0, "publicKey");
    message2 = validateMsgAndHash(message2, prehash);
    if (!isBytes(signature)) {
      const end = signature instanceof Signature ? ", use sig.toBytes()" : "";
      throw new Error("verify expects Uint8Array signature" + end);
    }
    validateSigLength(signature, format2);
    try {
      const sig = Signature.fromBytes(signature, format2);
      const P = Point.fromBytes(publicKey);
      if (lowS && sig.hasHighS())
        return false;
      const { r, s } = sig;
      const h = bits2int_modN(message2);
      const is = Fn.inv(s);
      const u1 = Fn.create(h * is);
      const u2 = Fn.create(r * is);
      const R = Point.BASE.multiplyUnsafe(u1).add(P.multiplyUnsafe(u2));
      if (R.is0())
        return false;
      const v = Fn.create(R.x);
      return v === r;
    } catch (e) {
      return false;
    }
  }
  __name(verify, "verify");
  function recoverPublicKey(signature, message2, opts = {}) {
    const { prehash } = validateSigOpts(opts, defaultSigOpts);
    message2 = validateMsgAndHash(message2, prehash);
    return Signature.fromBytes(signature, "recovered").recoverPublicKey(message2).toBytes();
  }
  __name(recoverPublicKey, "recoverPublicKey");
  return Object.freeze({
    keygen,
    getPublicKey,
    getSharedSecret,
    utils,
    lengths,
    Point,
    sign,
    verify,
    recoverPublicKey,
    Signature,
    hash
  });
}
__name(ecdsa, "ecdsa");

// node_modules/@libp2p/crypto/node_modules/@noble/curves/secp256k1.js
var secp256k1_CURVE = {
  p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: BigInt(1),
  a: BigInt(0),
  b: BigInt(7),
  Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
  Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
};
var secp256k1_ENDO = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  basises: [
    [BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")],
    [BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15")]
  ]
};
var _2n5 = /* @__PURE__ */ BigInt(2);
function sqrtMod(y) {
  const P = secp256k1_CURVE.p;
  const _3n3 = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
  const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
  const b2 = y * y * y % P;
  const b3 = b2 * b2 * y % P;
  const b6 = pow2(b3, _3n3, P) * b3 % P;
  const b9 = pow2(b6, _3n3, P) * b3 % P;
  const b11 = pow2(b9, _2n5, P) * b2 % P;
  const b22 = pow2(b11, _11n, P) * b11 % P;
  const b44 = pow2(b22, _22n, P) * b22 % P;
  const b88 = pow2(b44, _44n, P) * b44 % P;
  const b176 = pow2(b88, _88n, P) * b88 % P;
  const b220 = pow2(b176, _44n, P) * b44 % P;
  const b223 = pow2(b220, _3n3, P) * b3 % P;
  const t1 = pow2(b223, _23n, P) * b22 % P;
  const t2 = pow2(t1, _6n, P) * b2 % P;
  const root = pow2(t2, _2n5, P);
  if (!Fpk1.eql(Fpk1.sqr(root), y))
    throw new Error("Cannot find square root");
  return root;
}
__name(sqrtMod, "sqrtMod");
var Fpk1 = Field(secp256k1_CURVE.p, { sqrt: sqrtMod });
var Pointk1 = /* @__PURE__ */ weierstrass(secp256k1_CURVE, {
  Fp: Fpk1,
  endo: secp256k1_ENDO
});
var secp256k1 = /* @__PURE__ */ ecdsa(Pointk1, sha2562);

// node_modules/@libp2p/crypto/dist/src/keys/secp256k1/index.browser.js
function hashAndVerify4(key, sig, msg, options) {
  const p = sha256.digest(msg instanceof Uint8Array ? msg : msg.subarray());
  if (isPromise(p)) {
    return p.then(({ digest: digest2 }) => {
      options?.signal?.throwIfAborted();
      return secp256k1.verify(sig, digest2, key, {
        prehash: false,
        format: "der"
      });
    }).catch((err) => {
      if (err.name === "AbortError") {
        throw err;
      }
      throw new VerificationError(String(err));
    });
  }
  try {
    options?.signal?.throwIfAborted();
    return secp256k1.verify(sig, p.digest, key, {
      prehash: false,
      format: "der"
    });
  } catch (err) {
    throw new VerificationError(String(err));
  }
}
__name(hashAndVerify4, "hashAndVerify");

// node_modules/@libp2p/crypto/dist/src/keys/secp256k1/secp256k1.js
var Secp256k1PublicKey = class {
  static {
    __name(this, "Secp256k1PublicKey");
  }
  type = "secp256k1";
  raw;
  _key;
  constructor(key) {
    this._key = validateSecp256k1PublicKey(key);
    this.raw = compressSecp256k1PublicKey(this._key);
  }
  toMultihash() {
    return identity.digest(publicKeyToProtobuf(this));
  }
  toCID() {
    return CID.createV1(114, this.toMultihash());
  }
  toString() {
    return base58btc.encode(this.toMultihash().bytes).substring(1);
  }
  equals(key) {
    if (key == null || !(key.raw instanceof Uint8Array)) {
      return false;
    }
    return equals3(this.raw, key.raw);
  }
  verify(data, sig, options) {
    return hashAndVerify4(this._key, sig, data, options);
  }
};

// node_modules/@libp2p/crypto/dist/src/keys/secp256k1/utils.js
function unmarshalSecp256k1PublicKey(bytes) {
  return new Secp256k1PublicKey(bytes);
}
__name(unmarshalSecp256k1PublicKey, "unmarshalSecp256k1PublicKey");
function compressSecp256k1PublicKey(key) {
  return secp256k1.Point.fromBytes(key).toBytes();
}
__name(compressSecp256k1PublicKey, "compressSecp256k1PublicKey");
function validateSecp256k1PublicKey(key) {
  try {
    secp256k1.Point.fromBytes(key);
    return key;
  } catch (err) {
    throw new InvalidPublicKeyError(String(err));
  }
}
__name(validateSecp256k1PublicKey, "validateSecp256k1PublicKey");

// node_modules/@libp2p/crypto/dist/src/keys/index.js
function publicKeyFromProtobuf(buf, digest2) {
  const { Type, Data } = PublicKey.decode(buf);
  const data = Data ?? new Uint8Array();
  switch (Type) {
    case KeyType.RSA:
      return pkixToRSAPublicKey(data, digest2);
    case KeyType.Ed25519:
      return unmarshalEd25519PublicKey(data);
    case KeyType.secp256k1:
      return unmarshalSecp256k1PublicKey(data);
    case KeyType.ECDSA:
      return unmarshalECDSAPublicKey(data);
    default:
      throw new UnsupportedKeyTypeError();
  }
}
__name(publicKeyFromProtobuf, "publicKeyFromProtobuf");
function publicKeyFromMultihash(digest2) {
  const { Type, Data } = PublicKey.decode(digest2.digest);
  const data = Data ?? new Uint8Array();
  switch (Type) {
    case KeyType.Ed25519:
      return unmarshalEd25519PublicKey(data);
    case KeyType.secp256k1:
      return unmarshalSecp256k1PublicKey(data);
    case KeyType.ECDSA:
      return unmarshalECDSAPublicKey(data);
    default:
      throw new UnsupportedKeyTypeError();
  }
}
__name(publicKeyFromMultihash, "publicKeyFromMultihash");
function publicKeyToProtobuf(key) {
  return PublicKey.encode({
    Type: KeyType[key.type],
    Data: key.raw
  });
}
__name(publicKeyToProtobuf, "publicKeyToProtobuf");

// node_modules/@libp2p/peer-record/dist/src/envelope/envelope.js
var Envelope;
(function(Envelope2) {
  let _codec;
  Envelope2.codec = () => {
    if (_codec == null) {
      _codec = message((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork();
        }
        if (obj.publicKey != null && obj.publicKey.byteLength > 0) {
          w.uint32(10);
          w.bytes(obj.publicKey);
        }
        if (obj.payloadType != null && obj.payloadType.byteLength > 0) {
          w.uint32(18);
          w.bytes(obj.payloadType);
        }
        if (obj.payload != null && obj.payload.byteLength > 0) {
          w.uint32(26);
          w.bytes(obj.payload);
        }
        if (obj.signature != null && obj.signature.byteLength > 0) {
          w.uint32(42);
          w.bytes(obj.signature);
        }
        if (opts.lengthDelimited !== false) {
          w.ldelim();
        }
      }, (reader, length3, opts = {}) => {
        const obj = {
          publicKey: alloc(0),
          payloadType: alloc(0),
          payload: alloc(0),
          signature: alloc(0)
        };
        const end = length3 == null ? reader.len : reader.pos + length3;
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              obj.publicKey = reader.bytes();
              break;
            }
            case 2: {
              obj.payloadType = reader.bytes();
              break;
            }
            case 3: {
              obj.payload = reader.bytes();
              break;
            }
            case 5: {
              obj.signature = reader.bytes();
              break;
            }
            default: {
              reader.skipType(tag & 7);
              break;
            }
          }
        }
        return obj;
      });
    }
    return _codec;
  };
  Envelope2.encode = (obj) => {
    return encodeMessage(obj, Envelope2.codec());
  };
  Envelope2.decode = (buf, opts) => {
    return decodeMessage(buf, Envelope2.codec(), opts);
  };
})(Envelope || (Envelope = {}));

// node_modules/@libp2p/peer-record/dist/src/envelope/errors.js
var InvalidSignatureError = class extends Error {
  static {
    __name(this, "InvalidSignatureError");
  }
  constructor(message2 = "Invalid signature") {
    super(message2);
    this.name = "InvalidSignatureError";
  }
};

// node_modules/@libp2p/peer-record/dist/src/envelope/index.js
var RecordEnvelope = class _RecordEnvelope {
  static {
    __name(this, "RecordEnvelope");
  }
  /**
   * Unmarshal a serialized Envelope protobuf message
   */
  static createFromProtobuf = /* @__PURE__ */ __name((data) => {
    const envelopeData = Envelope.decode(data);
    const publicKey = publicKeyFromProtobuf(envelopeData.publicKey);
    return new _RecordEnvelope({
      publicKey,
      payloadType: envelopeData.payloadType,
      payload: envelopeData.payload,
      signature: envelopeData.signature
    });
  }, "createFromProtobuf");
  /**
   * Seal marshals the given Record, places the marshaled bytes inside an Envelope
   * and signs it with the given peerId's private key
   */
  static seal = /* @__PURE__ */ __name(async (record, privateKey, options) => {
    if (privateKey == null) {
      throw new Error("Missing private key");
    }
    const domain = record.domain;
    const payloadType = record.codec;
    const payload = record.marshal();
    const signData = formatSignaturePayload(domain, payloadType, payload);
    const signature = await privateKey.sign(signData.subarray(), options);
    return new _RecordEnvelope({
      publicKey: privateKey.publicKey,
      payloadType,
      payload,
      signature
    });
  }, "seal");
  /**
   * Open and certify a given marshaled envelope.
   * Data is unmarshaled and the signature validated for the given domain.
   */
  static openAndCertify = /* @__PURE__ */ __name(async (data, domain, options) => {
    const envelope = _RecordEnvelope.createFromProtobuf(data);
    const valid = await envelope.validate(domain, options);
    if (!valid) {
      throw new InvalidSignatureError("Envelope signature is not valid for the given domain");
    }
    return envelope;
  }, "openAndCertify");
  publicKey;
  payloadType;
  payload;
  signature;
  marshaled;
  /**
   * The Envelope is responsible for keeping an arbitrary signed record
   * by a libp2p peer.
   */
  constructor(init) {
    const { publicKey, payloadType, payload, signature } = init;
    this.publicKey = publicKey;
    this.payloadType = payloadType;
    this.payload = payload;
    this.signature = signature;
  }
  /**
   * Marshal the envelope content
   */
  marshal() {
    if (this.marshaled == null) {
      this.marshaled = Envelope.encode({
        publicKey: publicKeyToProtobuf(this.publicKey),
        payloadType: this.payloadType,
        payload: this.payload.subarray(),
        signature: this.signature
      });
    }
    return this.marshaled;
  }
  /**
   * Verifies if the other Envelope is identical to this one
   */
  equals(other) {
    if (other == null) {
      return false;
    }
    return equals3(this.marshal(), other.marshal());
  }
  /**
   * Validate envelope data signature for the given domain
   */
  async validate(domain, options) {
    const signData = formatSignaturePayload(domain, this.payloadType, this.payload);
    return this.publicKey.verify(signData.subarray(), this.signature, options);
  }
};
var formatSignaturePayload = /* @__PURE__ */ __name((domain, payloadType, payload) => {
  const domainUint8Array = fromString2(domain);
  const domainLength = encode5(domainUint8Array.byteLength);
  const payloadTypeLength = encode5(payloadType.length);
  const payloadLength = encode5(payload.length);
  return new Uint8ArrayList(domainLength, domainUint8Array, payloadTypeLength, payloadType, payloadLength, payload);
}, "formatSignaturePayload");

// node_modules/@libp2p/peer-id/node_modules/@libp2p/interface/dist/src/errors.js
var InvalidCIDError = class extends Error {
  static name = "InvalidCIDError";
  constructor(message2 = "Invalid CID") {
    super(message2);
    this.name = "InvalidCIDError";
  }
};
var InvalidMultihashError = class extends Error {
  static name = "InvalidMultihashError";
  constructor(message2 = "Invalid Multihash") {
    super(message2);
    this.name = "InvalidMultihashError";
  }
};
var UnsupportedKeyTypeError2 = class extends Error {
  static name = "UnsupportedKeyTypeError";
  constructor(message2 = "Unsupported key type") {
    super(message2);
    this.name = "UnsupportedKeyTypeError";
  }
};

// node_modules/@libp2p/peer-id/node_modules/@libp2p/interface/dist/src/peer-id.js
var peerIdSymbol = Symbol.for("@libp2p/peer-id");

// node_modules/@libp2p/peer-id/dist/src/peer-id.js
var inspect = Symbol.for("nodejs.util.inspect.custom");
var LIBP2P_KEY_CODE = 114;
var PeerIdImpl = class {
  static {
    __name(this, "PeerIdImpl");
  }
  type;
  multihash;
  publicKey;
  string;
  constructor(init) {
    this.type = init.type;
    this.multihash = init.multihash;
    Object.defineProperty(this, "string", {
      enumerable: false,
      writable: true
    });
  }
  get [Symbol.toStringTag]() {
    return `PeerId(${this.toString()})`;
  }
  [peerIdSymbol] = true;
  toString() {
    if (this.string == null) {
      this.string = base58btc.encode(this.multihash.bytes).slice(1);
    }
    return this.string;
  }
  toMultihash() {
    return this.multihash;
  }
  // return self-describing String representation
  // in default format from RFC 0001: https://github.com/libp2p/specs/pull/209
  toCID() {
    return CID.createV1(LIBP2P_KEY_CODE, this.multihash);
  }
  toJSON() {
    return this.toString();
  }
  /**
   * Checks the equality of `this` peer against a given PeerId
   */
  equals(id) {
    if (id == null) {
      return false;
    }
    if (id instanceof Uint8Array) {
      return equals3(this.multihash.bytes, id);
    } else if (typeof id === "string") {
      return this.toString() === id;
    } else if (id?.toMultihash()?.bytes != null) {
      return equals3(this.multihash.bytes, id.toMultihash().bytes);
    } else {
      throw new Error("not valid Id");
    }
  }
  /**
   * Returns PeerId as a human-readable string
   * https://nodejs.org/api/util.html#utilinspectcustom
   *
   * @example
   * ```TypeScript
   * import { peerIdFromString } from '@libp2p/peer-id'
   *
   * console.info(peerIdFromString('QmFoo'))
   * // 'PeerId(QmFoo)'
   * ```
   */
  [inspect]() {
    return `PeerId(${this.toString()})`;
  }
};
var RSAPeerId = class extends PeerIdImpl {
  static {
    __name(this, "RSAPeerId");
  }
  type = "RSA";
  publicKey;
  constructor(init) {
    super({ ...init, type: "RSA" });
    this.publicKey = init.publicKey;
  }
};
var Ed25519PeerId = class extends PeerIdImpl {
  static {
    __name(this, "Ed25519PeerId");
  }
  type = "Ed25519";
  publicKey;
  constructor(init) {
    super({ ...init, type: "Ed25519" });
    this.publicKey = init.publicKey;
  }
};
var Secp256k1PeerId = class extends PeerIdImpl {
  static {
    __name(this, "Secp256k1PeerId");
  }
  type = "secp256k1";
  publicKey;
  constructor(init) {
    super({ ...init, type: "secp256k1" });
    this.publicKey = init.publicKey;
  }
};
var TRANSPORT_IPFS_GATEWAY_HTTP_CODE = 2336;
var URLPeerId = class {
  static {
    __name(this, "URLPeerId");
  }
  type = "url";
  multihash;
  publicKey;
  url;
  constructor(url) {
    this.url = url.toString();
    this.multihash = identity.digest(fromString2(this.url));
  }
  [inspect]() {
    return `PeerId(${this.url})`;
  }
  [peerIdSymbol] = true;
  toString() {
    return this.toCID().toString();
  }
  toMultihash() {
    return this.multihash;
  }
  toCID() {
    return CID.createV1(TRANSPORT_IPFS_GATEWAY_HTTP_CODE, this.toMultihash());
  }
  toJSON() {
    return this.toString();
  }
  equals(other) {
    if (other == null) {
      return false;
    }
    if (other instanceof Uint8Array) {
      other = toString2(other);
    }
    return other.toString() === this.toString();
  }
};

// node_modules/@libp2p/peer-id/dist/src/index.js
var LIBP2P_KEY_CODE2 = 114;
var TRANSPORT_IPFS_GATEWAY_HTTP_CODE2 = 2336;
function peerIdFromPublicKey(publicKey) {
  if (publicKey.type === "Ed25519") {
    return new Ed25519PeerId({
      multihash: publicKey.toCID().multihash,
      publicKey
    });
  } else if (publicKey.type === "secp256k1") {
    return new Secp256k1PeerId({
      multihash: publicKey.toCID().multihash,
      publicKey
    });
  } else if (publicKey.type === "RSA") {
    return new RSAPeerId({
      multihash: publicKey.toCID().multihash,
      publicKey
    });
  }
  throw new UnsupportedKeyTypeError2();
}
__name(peerIdFromPublicKey, "peerIdFromPublicKey");
function peerIdFromMultihash(multihash) {
  if (isSha256Multihash(multihash)) {
    return new RSAPeerId({ multihash });
  } else if (isIdentityMultihash(multihash)) {
    try {
      const publicKey = publicKeyFromMultihash(multihash);
      if (publicKey.type === "Ed25519") {
        return new Ed25519PeerId({ multihash, publicKey });
      } else if (publicKey.type === "secp256k1") {
        return new Secp256k1PeerId({ multihash, publicKey });
      }
    } catch (err) {
      const url = toString2(multihash.digest);
      return new URLPeerId(new URL(url));
    }
  }
  throw new InvalidMultihashError("Supplied PeerID Multihash is invalid");
}
__name(peerIdFromMultihash, "peerIdFromMultihash");
function peerIdFromCID(cid) {
  if (cid?.multihash == null || cid.version == null || cid.version === 1 && cid.code !== LIBP2P_KEY_CODE2 && cid.code !== TRANSPORT_IPFS_GATEWAY_HTTP_CODE2) {
    throw new InvalidCIDError("Supplied PeerID CID is invalid");
  }
  if (cid.code === TRANSPORT_IPFS_GATEWAY_HTTP_CODE2) {
    const url = toString2(cid.multihash.digest);
    return new URLPeerId(new URL(url));
  }
  return peerIdFromMultihash(cid.multihash);
}
__name(peerIdFromCID, "peerIdFromCID");
function isIdentityMultihash(multihash) {
  return multihash.code === identity.code;
}
__name(isIdentityMultihash, "isIdentityMultihash");
function isSha256Multihash(multihash) {
  return multihash.code === sha256.code;
}
__name(isSha256Multihash, "isSha256Multihash");

// node_modules/@multiformats/multiaddr/dist/src/errors.js
var InvalidMultiaddrError = class extends Error {
  static name = "InvalidMultiaddrError";
  name = "InvalidMultiaddrError";
};
var ValidationError = class extends Error {
  static name = "ValidationError";
  name = "ValidationError";
};
var InvalidParametersError3 = class extends Error {
  static name = "InvalidParametersError";
  name = "InvalidParametersError";
};
var UnknownProtocolError = class extends Error {
  static name = "UnknownProtocolError";
  name = "UnknownProtocolError";
};

// node_modules/@chainsafe/is-ip/lib/parser.js
var Parser = class {
  static {
    __name(this, "Parser");
  }
  index = 0;
  input = "";
  new(input) {
    this.index = 0;
    this.input = input;
    return this;
  }
  /** Run a parser, and restore the pre-parse state if it fails. */
  readAtomically(fn) {
    const index = this.index;
    const result = fn();
    if (result === void 0) {
      this.index = index;
    }
    return result;
  }
  /** Run a parser, but fail if the entire input wasn't consumed. Doesn't run atomically. */
  parseWith(fn) {
    const result = fn();
    if (this.index !== this.input.length) {
      return void 0;
    }
    return result;
  }
  /** Peek the next character from the input */
  peekChar() {
    if (this.index >= this.input.length) {
      return void 0;
    }
    return this.input[this.index];
  }
  /** Read the next character from the input */
  readChar() {
    if (this.index >= this.input.length) {
      return void 0;
    }
    return this.input[this.index++];
  }
  /** Read the next character from the input if it matches the target. */
  readGivenChar(target) {
    return this.readAtomically(() => {
      const char = this.readChar();
      if (char !== target) {
        return void 0;
      }
      return char;
    });
  }
  /**
   * Helper for reading separators in an indexed loop. Reads the separator
   * character iff index > 0, then runs the parser. When used in a loop,
   * the separator character will only be read on index > 0 (see
   * readIPv4Addr for an example)
   */
  readSeparator(sep, index, inner) {
    return this.readAtomically(() => {
      if (index > 0) {
        if (this.readGivenChar(sep) === void 0) {
          return void 0;
        }
      }
      return inner();
    });
  }
  /**
   * Read a number off the front of the input in the given radix, stopping
   * at the first non-digit character or eof. Fails if the number has more
   * digits than max_digits or if there is no number.
   */
  readNumber(radix, maxDigits, allowZeroPrefix, maxBytes) {
    return this.readAtomically(() => {
      let result = 0;
      let digitCount = 0;
      const leadingChar = this.peekChar();
      if (leadingChar === void 0) {
        return void 0;
      }
      const hasLeadingZero = leadingChar === "0";
      const maxValue2 = 2 ** (8 * maxBytes) - 1;
      while (true) {
        const digit = this.readAtomically(() => {
          const char = this.readChar();
          if (char === void 0) {
            return void 0;
          }
          const num = Number.parseInt(char, radix);
          if (Number.isNaN(num)) {
            return void 0;
          }
          return num;
        });
        if (digit === void 0) {
          break;
        }
        result *= radix;
        result += digit;
        if (result > maxValue2) {
          return void 0;
        }
        digitCount += 1;
        if (maxDigits !== void 0) {
          if (digitCount > maxDigits) {
            return void 0;
          }
        }
      }
      if (digitCount === 0) {
        return void 0;
      } else if (!allowZeroPrefix && hasLeadingZero && digitCount > 1) {
        return void 0;
      } else {
        return result;
      }
    });
  }
  /** Read an IPv4 address. */
  readIPv4Addr() {
    return this.readAtomically(() => {
      const out = new Uint8Array(4);
      for (let i = 0; i < out.length; i++) {
        const ix = this.readSeparator(".", i, () => this.readNumber(10, 3, false, 1));
        if (ix === void 0) {
          return void 0;
        }
        out[i] = ix;
      }
      return out;
    });
  }
  /** Read an IPv6 Address. */
  readIPv6Addr() {
    const readGroups = /* @__PURE__ */ __name((groups) => {
      for (let i = 0; i < groups.length / 2; i++) {
        const ix = i * 2;
        if (i < groups.length - 3) {
          const ipv4 = this.readSeparator(":", i, () => this.readIPv4Addr());
          if (ipv4 !== void 0) {
            groups[ix] = ipv4[0];
            groups[ix + 1] = ipv4[1];
            groups[ix + 2] = ipv4[2];
            groups[ix + 3] = ipv4[3];
            return [ix + 4, true];
          }
        }
        const group = this.readSeparator(":", i, () => this.readNumber(16, 4, true, 2));
        if (group === void 0) {
          return [ix, false];
        }
        groups[ix] = group >> 8;
        groups[ix + 1] = group & 255;
      }
      return [groups.length, false];
    }, "readGroups");
    return this.readAtomically(() => {
      const head = new Uint8Array(16);
      const [headSize, headIp4] = readGroups(head);
      if (headSize === 16) {
        return head;
      }
      if (headIp4) {
        return void 0;
      }
      if (this.readGivenChar(":") === void 0) {
        return void 0;
      }
      if (this.readGivenChar(":") === void 0) {
        return void 0;
      }
      const tail = new Uint8Array(14);
      const limit = 16 - (headSize + 2);
      const [tailSize] = readGroups(tail.subarray(0, limit));
      head.set(tail.subarray(0, tailSize), 16 - tailSize);
      return head;
    });
  }
  /** Read an IP Address, either IPv4 or IPv6. */
  readIPAddr() {
    return this.readIPv4Addr() ?? this.readIPv6Addr();
  }
};

// node_modules/@chainsafe/is-ip/lib/parse.js
var MAX_IPV6_LENGTH = 45;
var MAX_IPV4_LENGTH = 15;
var parser = new Parser();
function parseIPv4(input) {
  if (input.length > MAX_IPV4_LENGTH) {
    return void 0;
  }
  return parser.new(input).parseWith(() => parser.readIPv4Addr());
}
__name(parseIPv4, "parseIPv4");
function parseIPv6(input) {
  if (input.includes("%")) {
    input = input.split("%")[0];
  }
  if (input.length > MAX_IPV6_LENGTH) {
    return void 0;
  }
  return parser.new(input).parseWith(() => parser.readIPv6Addr());
}
__name(parseIPv6, "parseIPv6");
function parseIP(input, mapIPv4ToIPv6 = false) {
  if (input.includes("%")) {
    input = input.split("%")[0];
  }
  if (input.length > MAX_IPV6_LENGTH) {
    return void 0;
  }
  const addr = parser.new(input).parseWith(() => parser.readIPAddr());
  if (!addr) {
    return void 0;
  }
  if (mapIPv4ToIPv6 && addr.length === 4) {
    return Uint8Array.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, addr[0], addr[1], addr[2], addr[3]]);
  }
  return addr;
}
__name(parseIP, "parseIP");

// node_modules/@chainsafe/is-ip/lib/is-ip.js
function isIPv4(input) {
  return Boolean(parseIPv4(input));
}
__name(isIPv4, "isIPv4");
function isIPv6(input) {
  return Boolean(parseIPv6(input));
}
__name(isIPv6, "isIPv6");

// node_modules/@multiformats/multiaddr/dist/src/constants.js
var CODE_IP4 = 4;
var CODE_TCP = 6;
var CODE_UDP = 273;
var CODE_DCCP = 33;
var CODE_IP6 = 41;
var CODE_IP6ZONE = 42;
var CODE_IPCIDR = 43;
var CODE_DNS = 53;
var CODE_DNS4 = 54;
var CODE_DNS6 = 55;
var CODE_DNSADDR = 56;
var CODE_SCTP = 132;
var CODE_UDT = 301;
var CODE_UTP = 302;
var CODE_UNIX = 400;
var CODE_P2P = 421;
var CODE_ONION = 444;
var CODE_ONION3 = 445;
var CODE_GARLIC64 = 446;
var CODE_GARLIC32 = 447;
var CODE_TLS = 448;
var CODE_SNI = 449;
var CODE_NOISE = 454;
var CODE_QUIC = 460;
var CODE_QUIC_V1 = 461;
var CODE_WEBTRANSPORT = 465;
var CODE_CERTHASH = 466;
var CODE_HTTP = 480;
var CODE_HTTP_PATH = 481;
var CODE_HTTPS = 443;
var CODE_WS = 477;
var CODE_WSS = 478;
var CODE_P2P_WEBSOCKET_STAR = 479;
var CODE_P2P_STARDUST = 277;
var CODE_P2P_WEBRTC_STAR = 275;
var CODE_P2P_WEBRTC_DIRECT = 276;
var CODE_WEBRTC_DIRECT = 280;
var CODE_WEBRTC = 281;
var CODE_P2P_CIRCUIT = 290;
var CODE_MEMORY = 777;

// node_modules/@multiformats/multiaddr/dist/src/utils.js
function bytesToString(base3) {
  return (buf) => {
    return toString2(buf, base3);
  };
}
__name(bytesToString, "bytesToString");
function stringToBytes(base3) {
  return (buf) => {
    return fromString2(buf, base3);
  };
}
__name(stringToBytes, "stringToBytes");
function bytes2port(buf) {
  const view = new DataView(buf.buffer);
  return view.getUint16(buf.byteOffset).toString();
}
__name(bytes2port, "bytes2port");
function port2bytes(port) {
  const buf = new ArrayBuffer(2);
  const view = new DataView(buf);
  view.setUint16(0, typeof port === "string" ? parseInt(port) : port);
  return new Uint8Array(buf);
}
__name(port2bytes, "port2bytes");
function onion2bytes(str) {
  const addr = str.split(":");
  if (addr.length !== 2) {
    throw new Error(`failed to parse onion addr: ["'${addr.join('", "')}'"]' does not contain a port number`);
  }
  if (addr[0].length !== 16) {
    throw new Error(`failed to parse onion addr: ${addr[0]} not a Tor onion address.`);
  }
  const buf = fromString2(addr[0], "base32");
  const port = parseInt(addr[1], 10);
  if (port < 1 || port > 65536) {
    throw new Error("Port number is not in range(1, 65536)");
  }
  const portBuf = port2bytes(port);
  return concat([buf, portBuf], buf.length + portBuf.length);
}
__name(onion2bytes, "onion2bytes");
function onion32bytes(str) {
  const addr = str.split(":");
  if (addr.length !== 2) {
    throw new Error(`failed to parse onion addr: ["'${addr.join('", "')}'"]' does not contain a port number`);
  }
  if (addr[0].length !== 56) {
    throw new Error(`failed to parse onion addr: ${addr[0]} not a Tor onion3 address.`);
  }
  const buf = base32.decode(`b${addr[0]}`);
  const port = parseInt(addr[1], 10);
  if (port < 1 || port > 65536) {
    throw new Error("Port number is not in range(1, 65536)");
  }
  const portBuf = port2bytes(port);
  return concat([buf, portBuf], buf.length + portBuf.length);
}
__name(onion32bytes, "onion32bytes");
function bytes2onion(buf) {
  const addrBytes = buf.subarray(0, buf.length - 2);
  const portBytes = buf.subarray(buf.length - 2);
  const addr = toString2(addrBytes, "base32");
  const port = bytes2port(portBytes);
  return `${addr}:${port}`;
}
__name(bytes2onion, "bytes2onion");
var ip4ToBytes = /* @__PURE__ */ __name(function(ip) {
  ip = ip.toString().trim();
  const bytes = new Uint8Array(4);
  ip.split(/\./g).forEach((byte, index) => {
    const value2 = parseInt(byte, 10);
    if (isNaN(value2) || value2 < 0 || value2 > 255) {
      throw new InvalidMultiaddrError("Invalid byte value in IP address");
    }
    bytes[index] = value2;
  });
  return bytes;
}, "ip4ToBytes");
var ip6ToBytes = /* @__PURE__ */ __name(function(ip) {
  let offset = 0;
  ip = ip.toString().trim();
  const sections = ip.split(":", 8);
  let i;
  for (i = 0; i < sections.length; i++) {
    const isv4 = isIPv4(sections[i]);
    let v4Buffer;
    if (isv4) {
      v4Buffer = ip4ToBytes(sections[i]);
      sections[i] = toString2(v4Buffer.subarray(0, 2), "base16");
    }
    if (v4Buffer != null && ++i < 8) {
      sections.splice(i, 0, toString2(v4Buffer.subarray(2, 4), "base16"));
    }
  }
  if (sections[0] === "") {
    while (sections.length < 8) {
      sections.unshift("0");
    }
  } else if (sections[sections.length - 1] === "") {
    while (sections.length < 8) {
      sections.push("0");
    }
  } else if (sections.length < 8) {
    for (i = 0; i < sections.length && sections[i] !== ""; i++) {
    }
    const argv = [i, 1];
    for (i = 9 - sections.length; i > 0; i--) {
      argv.push("0");
    }
    sections.splice.apply(sections, argv);
  }
  const bytes = new Uint8Array(offset + 16);
  for (i = 0; i < sections.length; i++) {
    if (sections[i] === "") {
      sections[i] = "0";
    }
    const word = parseInt(sections[i], 16);
    if (isNaN(word) || word < 0 || word > 65535) {
      throw new InvalidMultiaddrError("Invalid byte value in IP address");
    }
    bytes[offset++] = word >> 8 & 255;
    bytes[offset++] = word & 255;
  }
  return bytes;
}, "ip6ToBytes");
var ip4ToString = /* @__PURE__ */ __name(function(buf) {
  if (buf.byteLength !== 4) {
    throw new InvalidMultiaddrError("IPv4 address was incorrect length");
  }
  const result = [];
  for (let i = 0; i < buf.byteLength; i++) {
    result.push(buf[i]);
  }
  return result.join(".");
}, "ip4ToString");
var ip6ToString = /* @__PURE__ */ __name(function(buf) {
  if (buf.byteLength !== 16) {
    throw new InvalidMultiaddrError("IPv6 address was incorrect length");
  }
  const result = [];
  for (let i = 0; i < buf.byteLength; i += 2) {
    const byte1 = buf[i];
    const byte2 = buf[i + 1];
    const tuple = `${byte1.toString(16).padStart(2, "0")}${byte2.toString(16).padStart(2, "0")}`;
    result.push(tuple);
  }
  const ip = result.join(":");
  try {
    const url = new URL(`http://[${ip}]`);
    return url.hostname.substring(1, url.hostname.length - 1);
  } catch {
    throw new InvalidMultiaddrError(`Invalid IPv6 address "${ip}"`);
  }
}, "ip6ToString");
function ip6StringToValue(str) {
  try {
    const url = new URL(`http://[${str}]`);
    return url.hostname.substring(1, url.hostname.length - 1);
  } catch {
    throw new InvalidMultiaddrError(`Invalid IPv6 address "${str}"`);
  }
}
__name(ip6StringToValue, "ip6StringToValue");
var decoders2 = Object.values(bases).map((c) => c.decoder);
var anybaseDecoder = (function() {
  let acc = decoders2[0].or(decoders2[1]);
  decoders2.slice(2).forEach((d) => acc = acc.or(d));
  return acc;
})();
function mb2bytes(mbstr) {
  return anybaseDecoder.decode(mbstr);
}
__name(mb2bytes, "mb2bytes");
function bytes2mb(base3) {
  return (buf) => {
    return base3.encoder.encode(buf);
  };
}
__name(bytes2mb, "bytes2mb");

// node_modules/@multiformats/multiaddr/dist/src/validation.js
function integer(value2) {
  const int = parseInt(value2);
  if (int.toString() !== value2) {
    throw new ValidationError("Value must be an integer");
  }
}
__name(integer, "integer");
function positive(value2) {
  if (value2 < 0) {
    throw new ValidationError("Value must be a positive integer, or zero");
  }
}
__name(positive, "positive");
function maxValue(max) {
  return (value2) => {
    if (value2 > max) {
      throw new ValidationError(`Value must be smaller than or equal to ${max}`);
    }
  };
}
__name(maxValue, "maxValue");
function validate(...funcs) {
  return (value2) => {
    for (const fn of funcs) {
      fn(value2);
    }
  };
}
__name(validate, "validate");
var validatePort = validate(integer, positive, maxValue(65535));

// node_modules/@multiformats/multiaddr/dist/src/registry.js
var V = -1;
var Registry = class {
  static {
    __name(this, "Registry");
  }
  protocolsByCode = /* @__PURE__ */ new Map();
  protocolsByName = /* @__PURE__ */ new Map();
  getProtocol(key) {
    let codec;
    if (typeof key === "string") {
      codec = this.protocolsByName.get(key);
    } else {
      codec = this.protocolsByCode.get(key);
    }
    if (codec == null) {
      throw new UnknownProtocolError(`Protocol ${key} was unknown`);
    }
    return codec;
  }
  addProtocol(codec) {
    this.protocolsByCode.set(codec.code, codec);
    this.protocolsByName.set(codec.name, codec);
    codec.aliases?.forEach((alias) => {
      this.protocolsByName.set(alias, codec);
    });
  }
  removeProtocol(code3) {
    const codec = this.protocolsByCode.get(code3);
    if (codec == null) {
      return;
    }
    this.protocolsByCode.delete(codec.code);
    this.protocolsByName.delete(codec.name);
    codec.aliases?.forEach((alias) => {
      this.protocolsByName.delete(alias);
    });
  }
};
var registry = new Registry();
var codecs = [{
  code: CODE_IP4,
  name: "ip4",
  size: 32,
  valueToBytes: ip4ToBytes,
  bytesToValue: ip4ToString,
  validate: /* @__PURE__ */ __name((value2) => {
    if (!isIPv4(value2)) {
      throw new ValidationError(`Invalid IPv4 address "${value2}"`);
    }
  }, "validate")
}, {
  code: CODE_TCP,
  name: "tcp",
  size: 16,
  valueToBytes: port2bytes,
  bytesToValue: bytes2port,
  validate: validatePort
}, {
  code: CODE_UDP,
  name: "udp",
  size: 16,
  valueToBytes: port2bytes,
  bytesToValue: bytes2port,
  validate: validatePort
}, {
  code: CODE_DCCP,
  name: "dccp",
  size: 16,
  valueToBytes: port2bytes,
  bytesToValue: bytes2port,
  validate: validatePort
}, {
  code: CODE_IP6,
  name: "ip6",
  size: 128,
  valueToBytes: ip6ToBytes,
  bytesToValue: ip6ToString,
  stringToValue: ip6StringToValue,
  validate: /* @__PURE__ */ __name((value2) => {
    if (!isIPv6(value2)) {
      throw new ValidationError(`Invalid IPv6 address "${value2}"`);
    }
  }, "validate")
}, {
  code: CODE_IP6ZONE,
  name: "ip6zone",
  size: V
}, {
  code: CODE_IPCIDR,
  name: "ipcidr",
  size: 8,
  bytesToValue: bytesToString("base10"),
  valueToBytes: stringToBytes("base10")
}, {
  code: CODE_DNS,
  name: "dns",
  size: V
}, {
  code: CODE_DNS4,
  name: "dns4",
  size: V
}, {
  code: CODE_DNS6,
  name: "dns6",
  size: V
}, {
  code: CODE_DNSADDR,
  name: "dnsaddr",
  size: V
}, {
  code: CODE_SCTP,
  name: "sctp",
  size: 16,
  valueToBytes: port2bytes,
  bytesToValue: bytes2port,
  validate: validatePort
}, {
  code: CODE_UDT,
  name: "udt"
}, {
  code: CODE_UTP,
  name: "utp"
}, {
  code: CODE_UNIX,
  name: "unix",
  size: V,
  stringToValue: /* @__PURE__ */ __name((str) => decodeURIComponent(str), "stringToValue"),
  valueToString: /* @__PURE__ */ __name((val) => encodeURIComponent(val), "valueToString")
}, {
  code: CODE_P2P,
  name: "p2p",
  aliases: ["ipfs"],
  size: V,
  bytesToValue: bytesToString("base58btc"),
  valueToBytes: /* @__PURE__ */ __name((val) => {
    if (val.startsWith("Q") || val.startsWith("1")) {
      return stringToBytes("base58btc")(val);
    }
    return CID.parse(val).multihash.bytes;
  }, "valueToBytes")
}, {
  code: CODE_ONION,
  name: "onion",
  size: 96,
  bytesToValue: bytes2onion,
  valueToBytes: onion2bytes
}, {
  code: CODE_ONION3,
  name: "onion3",
  size: 296,
  bytesToValue: bytes2onion,
  valueToBytes: onion32bytes
}, {
  code: CODE_GARLIC64,
  name: "garlic64",
  size: V
}, {
  code: CODE_GARLIC32,
  name: "garlic32",
  size: V
}, {
  code: CODE_TLS,
  name: "tls"
}, {
  code: CODE_SNI,
  name: "sni",
  size: V
}, {
  code: CODE_NOISE,
  name: "noise"
}, {
  code: CODE_QUIC,
  name: "quic"
}, {
  code: CODE_QUIC_V1,
  name: "quic-v1"
}, {
  code: CODE_WEBTRANSPORT,
  name: "webtransport"
}, {
  code: CODE_CERTHASH,
  name: "certhash",
  size: V,
  bytesToValue: bytes2mb(base64url),
  valueToBytes: mb2bytes
}, {
  code: CODE_HTTP,
  name: "http"
}, {
  code: CODE_HTTP_PATH,
  name: "http-path",
  size: V,
  stringToValue: /* @__PURE__ */ __name((str) => `/${decodeURIComponent(str)}`, "stringToValue"),
  valueToString: /* @__PURE__ */ __name((val) => encodeURIComponent(val.substring(1)), "valueToString")
}, {
  code: CODE_HTTPS,
  name: "https"
}, {
  code: CODE_WS,
  name: "ws"
}, {
  code: CODE_WSS,
  name: "wss"
}, {
  code: CODE_P2P_WEBSOCKET_STAR,
  name: "p2p-websocket-star"
}, {
  code: CODE_P2P_STARDUST,
  name: "p2p-stardust"
}, {
  code: CODE_P2P_WEBRTC_STAR,
  name: "p2p-webrtc-star"
}, {
  code: CODE_P2P_WEBRTC_DIRECT,
  name: "p2p-webrtc-direct"
}, {
  code: CODE_WEBRTC_DIRECT,
  name: "webrtc-direct"
}, {
  code: CODE_WEBRTC,
  name: "webrtc"
}, {
  code: CODE_P2P_CIRCUIT,
  name: "p2p-circuit"
}, {
  code: CODE_MEMORY,
  name: "memory",
  size: V
}];
codecs.forEach((codec) => {
  registry.addProtocol(codec);
});

// node_modules/@multiformats/multiaddr/dist/src/components.js
function bytesToComponents(bytes) {
  const components = [];
  let i = 0;
  while (i < bytes.length) {
    const code3 = decode6(bytes, i);
    const codec = registry.getProtocol(code3);
    const codeLength = encodingLength2(code3);
    const size = sizeForAddr(codec, bytes, i + codeLength);
    let sizeLength = 0;
    if (size > 0 && codec.size === V) {
      sizeLength = encodingLength2(size);
    }
    const componentLength = codeLength + sizeLength + size;
    const component = {
      code: code3,
      name: codec.name,
      bytes: bytes.subarray(i, i + componentLength)
    };
    if (size > 0) {
      const valueOffset = i + codeLength + sizeLength;
      const valueBytes = bytes.subarray(valueOffset, valueOffset + size);
      component.value = codec.bytesToValue?.(valueBytes) ?? toString2(valueBytes);
    }
    components.push(component);
    i += componentLength;
  }
  return components;
}
__name(bytesToComponents, "bytesToComponents");
function componentsToBytes(components) {
  let length3 = 0;
  const bytes = [];
  for (const component of components) {
    if (component.bytes == null) {
      const codec = registry.getProtocol(component.code);
      const codecLength = encodingLength2(component.code);
      let valueBytes;
      let valueLength = 0;
      let valueLengthLength = 0;
      if (component.value != null) {
        valueBytes = codec.valueToBytes?.(component.value) ?? fromString2(component.value);
        valueLength = valueBytes.byteLength;
        if (codec.size === V) {
          valueLengthLength = encodingLength2(valueLength);
        }
      }
      const bytes2 = new Uint8Array(codecLength + valueLengthLength + valueLength);
      let offset = 0;
      encodeUint8Array(component.code, bytes2, offset);
      offset += codecLength;
      if (valueBytes != null) {
        if (codec.size === V) {
          encodeUint8Array(valueLength, bytes2, offset);
          offset += valueLengthLength;
        }
        bytes2.set(valueBytes, offset);
      }
      component.bytes = bytes2;
    }
    bytes.push(component.bytes);
    length3 += component.bytes.byteLength;
  }
  return concat(bytes, length3);
}
__name(componentsToBytes, "componentsToBytes");
function stringToComponents(string2) {
  if (string2.charAt(0) !== "/") {
    throw new InvalidMultiaddrError('String multiaddr must start with "/"');
  }
  const components = [];
  let collecting = "protocol";
  let value2 = "";
  let protocol = "";
  for (let i = 1; i < string2.length; i++) {
    const char = string2.charAt(i);
    if (char !== "/") {
      if (collecting === "protocol") {
        protocol += string2.charAt(i);
      } else {
        value2 += string2.charAt(i);
      }
    }
    const ended = i === string2.length - 1;
    if (char === "/" || ended) {
      const codec = registry.getProtocol(protocol);
      if (collecting === "protocol") {
        if (codec.size == null || codec.size === 0) {
          components.push({
            code: codec.code,
            name: codec.name
          });
          value2 = "";
          protocol = "";
          collecting = "protocol";
          continue;
        } else if (ended) {
          throw new InvalidMultiaddrError(`Component ${protocol} was missing value`);
        }
        collecting = "value";
      } else if (collecting === "value") {
        const component = {
          code: codec.code,
          name: codec.name
        };
        if (codec.size != null && codec.size !== 0) {
          if (value2 === "") {
            throw new InvalidMultiaddrError(`Component ${protocol} was missing value`);
          }
          component.value = codec.stringToValue?.(value2) ?? value2;
        }
        components.push(component);
        value2 = "";
        protocol = "";
        collecting = "protocol";
      }
    }
  }
  if (protocol !== "" && value2 !== "") {
    throw new InvalidMultiaddrError("Incomplete multiaddr");
  }
  return components;
}
__name(stringToComponents, "stringToComponents");
function componentsToString(components) {
  return `/${components.flatMap((component) => {
    if (component.value == null) {
      return component.name;
    }
    const codec = registry.getProtocol(component.code);
    if (codec == null) {
      throw new InvalidMultiaddrError(`Unknown protocol code ${component.code}`);
    }
    return [
      component.name,
      codec.valueToString?.(component.value) ?? component.value
    ];
  }).join("/")}`;
}
__name(componentsToString, "componentsToString");
function sizeForAddr(codec, bytes, offset) {
  if (codec.size == null || codec.size === 0) {
    return 0;
  }
  if (codec.size > 0) {
    return codec.size / 8;
  }
  return decode6(bytes, offset);
}
__name(sizeForAddr, "sizeForAddr");

// node_modules/@multiformats/multiaddr/dist/src/multiaddr.js
var inspect2 = Symbol.for("nodejs.util.inspect.custom");
var symbol2 = Symbol.for("@multiformats/multiaddr");
function toComponents(addr) {
  if (addr == null) {
    addr = "/";
  }
  if (isMultiaddr(addr)) {
    return addr.getComponents();
  }
  if (addr instanceof Uint8Array) {
    return bytesToComponents(addr);
  }
  if (typeof addr === "string") {
    addr = addr.replace(/\/(\/)+/, "/").replace(/(\/)+$/, "");
    if (addr === "") {
      addr = "/";
    }
    return stringToComponents(addr);
  }
  if (Array.isArray(addr)) {
    return addr;
  }
  throw new InvalidMultiaddrError("Must be a string, Uint8Array, Component[], or another Multiaddr");
}
__name(toComponents, "toComponents");
var Multiaddr = class _Multiaddr {
  static {
    __name(this, "Multiaddr");
  }
  [symbol2] = true;
  #components;
  // cache string representation
  #string;
  // cache byte representation
  #bytes;
  constructor(addr = "/", options = {}) {
    this.#components = toComponents(addr);
    if (options.validate !== false) {
      validate2(this);
    }
  }
  get bytes() {
    if (this.#bytes == null) {
      this.#bytes = componentsToBytes(this.#components);
    }
    return this.#bytes;
  }
  toString() {
    if (this.#string == null) {
      this.#string = componentsToString(this.#components);
    }
    return this.#string;
  }
  toJSON() {
    return this.toString();
  }
  getComponents() {
    return [
      ...this.#components.map((c) => ({ ...c }))
    ];
  }
  encapsulate(addr) {
    const ma = new _Multiaddr(addr);
    return new _Multiaddr([
      ...this.#components,
      ...ma.getComponents()
    ], {
      validate: false
    });
  }
  decapsulate(addr) {
    const addrString = addr.toString();
    const s = this.toString();
    const i = s.lastIndexOf(addrString);
    if (i < 0) {
      throw new InvalidParametersError3(`Address ${this.toString()} does not contain subaddress: ${addrString}`);
    }
    return new _Multiaddr(s.slice(0, i), {
      validate: false
    });
  }
  decapsulateCode(code3) {
    let index;
    for (let i = this.#components.length - 1; i > -1; i--) {
      if (this.#components[i].code === code3) {
        index = i;
        break;
      }
    }
    return new _Multiaddr(this.#components.slice(0, index), {
      validate: false
    });
  }
  equals(addr) {
    return equals3(this.bytes, addr.bytes);
  }
  /**
   * Returns Multiaddr as a human-readable string
   * https://nodejs.org/api/util.html#utilinspectcustom
   *
   * @example
   * ```js
   * import { multiaddr } from '@multiformats/multiaddr'
   *
   * console.info(multiaddr('/ip4/127.0.0.1/tcp/4001'))
   * // 'Multiaddr(/ip4/127.0.0.1/tcp/4001)'
   * ```
   */
  [inspect2]() {
    return `Multiaddr(${this.toString()})`;
  }
};
function validate2(addr) {
  addr.getComponents().forEach((component) => {
    const codec = registry.getProtocol(component.code);
    if (component.value == null) {
      return;
    }
    codec.validate?.(component.value);
  });
}
__name(validate2, "validate");

// node_modules/@multiformats/multiaddr/dist/src/index.js
function isMultiaddr(value2) {
  return Boolean(value2?.[symbol2]);
}
__name(isMultiaddr, "isMultiaddr");
function multiaddr(addr) {
  return new Multiaddr(addr);
}
__name(multiaddr, "multiaddr");

// node_modules/@libp2p/peer-record/dist/src/peer-record/consts.js
var ENVELOPE_DOMAIN_PEER_RECORD = "libp2p-peer-record";
var ENVELOPE_PAYLOAD_TYPE_PEER_RECORD = Uint8Array.from([3, 1]);

// node_modules/@libp2p/peer-record/dist/src/peer-record/peer-record.js
var PeerRecord;
(function(PeerRecord3) {
  let AddressInfo;
  (function(AddressInfo2) {
    let _codec2;
    AddressInfo2.codec = () => {
      if (_codec2 == null) {
        _codec2 = message((obj, w, opts = {}) => {
          if (opts.lengthDelimited !== false) {
            w.fork();
          }
          if (obj.multiaddr != null && obj.multiaddr.byteLength > 0) {
            w.uint32(10);
            w.bytes(obj.multiaddr);
          }
          if (opts.lengthDelimited !== false) {
            w.ldelim();
          }
        }, (reader, length3, opts = {}) => {
          const obj = {
            multiaddr: alloc(0)
          };
          const end = length3 == null ? reader.len : reader.pos + length3;
          while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
              case 1: {
                obj.multiaddr = reader.bytes();
                break;
              }
              default: {
                reader.skipType(tag & 7);
                break;
              }
            }
          }
          return obj;
        });
      }
      return _codec2;
    };
    AddressInfo2.encode = (obj) => {
      return encodeMessage(obj, AddressInfo2.codec());
    };
    AddressInfo2.decode = (buf, opts) => {
      return decodeMessage(buf, AddressInfo2.codec(), opts);
    };
  })(AddressInfo = PeerRecord3.AddressInfo || (PeerRecord3.AddressInfo = {}));
  let _codec;
  PeerRecord3.codec = () => {
    if (_codec == null) {
      _codec = message((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork();
        }
        if (obj.peerId != null && obj.peerId.byteLength > 0) {
          w.uint32(10);
          w.bytes(obj.peerId);
        }
        if (obj.seq != null && obj.seq !== 0n) {
          w.uint32(16);
          w.uint64(obj.seq);
        }
        if (obj.addresses != null) {
          for (const value2 of obj.addresses) {
            w.uint32(26);
            PeerRecord3.AddressInfo.codec().encode(value2, w);
          }
        }
        if (opts.lengthDelimited !== false) {
          w.ldelim();
        }
      }, (reader, length3, opts = {}) => {
        const obj = {
          peerId: alloc(0),
          seq: 0n,
          addresses: []
        };
        const end = length3 == null ? reader.len : reader.pos + length3;
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              obj.peerId = reader.bytes();
              break;
            }
            case 2: {
              obj.seq = reader.uint64();
              break;
            }
            case 3: {
              if (opts.limits?.addresses != null && obj.addresses.length === opts.limits.addresses) {
                throw new MaxLengthError('Decode error - map field "addresses" had too many elements');
              }
              obj.addresses.push(PeerRecord3.AddressInfo.codec().decode(reader, reader.uint32(), {
                limits: opts.limits?.addresses$
              }));
              break;
            }
            default: {
              reader.skipType(tag & 7);
              break;
            }
          }
        }
        return obj;
      });
    }
    return _codec;
  };
  PeerRecord3.encode = (obj) => {
    return encodeMessage(obj, PeerRecord3.codec());
  };
  PeerRecord3.decode = (buf, opts) => {
    return decodeMessage(buf, PeerRecord3.codec(), opts);
  };
})(PeerRecord || (PeerRecord = {}));

// node_modules/@libp2p/peer-record/dist/src/peer-record/utils.js
function arrayEquals(a, b) {
  const sort = /* @__PURE__ */ __name((a2, b2) => a2.toString().localeCompare(b2.toString()), "sort");
  if (a.length !== b.length) {
    return false;
  }
  b.sort(sort);
  return a.sort(sort).every((item, index) => b[index].equals(item));
}
__name(arrayEquals, "arrayEquals");

// node_modules/@libp2p/peer-record/dist/src/peer-record/index.js
var PeerRecord2 = class _PeerRecord {
  static {
    __name(this, "PeerRecord");
  }
  /**
   * Unmarshal Peer Record Protobuf
   */
  static createFromProtobuf = /* @__PURE__ */ __name((buf) => {
    const peerRecord = PeerRecord.decode(buf);
    const peerId = peerIdFromMultihash(decode4(peerRecord.peerId));
    const multiaddrs = (peerRecord.addresses ?? []).map((a) => multiaddr(a.multiaddr));
    const seqNumber = peerRecord.seq;
    return new _PeerRecord({ peerId, multiaddrs, seqNumber });
  }, "createFromProtobuf");
  static DOMAIN = ENVELOPE_DOMAIN_PEER_RECORD;
  static CODEC = ENVELOPE_PAYLOAD_TYPE_PEER_RECORD;
  peerId;
  multiaddrs;
  seqNumber;
  domain = _PeerRecord.DOMAIN;
  codec = _PeerRecord.CODEC;
  marshaled;
  constructor(init) {
    const { peerId, multiaddrs, seqNumber } = init;
    this.peerId = peerId;
    this.multiaddrs = multiaddrs ?? [];
    this.seqNumber = seqNumber ?? BigInt(Date.now());
  }
  /**
   * Marshal a record to be used in an envelope
   */
  marshal() {
    if (this.marshaled == null) {
      this.marshaled = PeerRecord.encode({
        peerId: this.peerId.toMultihash().bytes,
        seq: BigInt(this.seqNumber),
        addresses: this.multiaddrs.map((m) => ({
          multiaddr: m.bytes
        }))
      });
    }
    return this.marshaled;
  }
  /**
   * Returns true if `this` record equals the `other`
   */
  equals(other) {
    if (!(other instanceof _PeerRecord)) {
      return false;
    }
    if (!this.peerId.equals(other.peerId)) {
      return false;
    }
    if (this.seqNumber !== other.seqNumber) {
      return false;
    }
    if (!arrayEquals(this.multiaddrs, other.multiaddrs)) {
      return false;
    }
    return true;
  }
};

// node_modules/@libp2p/utils/node_modules/@libp2p/interface/dist/src/errors.js
var InvalidParametersError4 = class extends Error {
  static name = "InvalidParametersError";
  constructor(message2 = "Invalid parameters") {
    super(message2);
    this.name = "InvalidParametersError";
  }
};

// node_modules/@libp2p/utils/dist/src/multiaddr/get-net-config.js
function getNetConfig(ma) {
  const components = ma.getComponents();
  const config = {};
  let index = 0;
  if (components[index]?.name === "ip6zone") {
    config.zone = `${components[index].value}`;
    index++;
  }
  if (components[index].name === "ip4" || components[index].name === "ip6") {
    config.type = components[index].name;
    config.host = components[index].value;
    index++;
  } else if (components[index].name === "dns" || components[index].name === "dns4" || components[index].name === "dns6") {
    config.type = components[index].name;
    config.host = components[index].value;
    index++;
  } else if (components[index].name === "dnsaddr") {
    config.type = components[index].name;
    config.host = `_dnsaddr.${components[index].value}`;
    index++;
  }
  if (components[index]?.name === "tcp" || components[index]?.name === "udp") {
    config.protocol = components[index].name === "tcp" ? "tcp" : "udp";
    config.port = parseInt(`${components[index].value}`);
    index++;
  }
  if (components[index]?.name === "ipcidr") {
    if (config.type === "ip4") {
      config.cidr = parseInt(`${components[index].value}`);
    } else if (config.type === "ip6") {
      config.cidr = `${components[index].value}`;
    }
    index++;
  }
  if (config.type == null || config.host == null) {
    throw new InvalidParametersError4(`Multiaddr ${ma} was not an IPv4, IPv6, DNS, DNS4, DNS6 or DNSADDR address`);
  }
  if (components[index]?.name === "tls" && components[index + 1]?.name === "sni") {
    config.sni = components[index + 1].value;
    index += 2;
  }
  return config;
}
__name(getNetConfig, "getNetConfig");

// node_modules/@chainsafe/netmask/dist/src/util.js
function allFF(a, from3, to) {
  let i = 0;
  for (const e of a) {
    if (i < from3)
      continue;
    if (i > to)
      break;
    if (e !== 255)
      return false;
    i++;
  }
  return true;
}
__name(allFF, "allFF");
function deepEqual(a, b, from3, to) {
  let i = 0;
  for (const e of a) {
    if (i < from3)
      continue;
    if (i > to)
      break;
    if (e !== b[i])
      return false;
    i++;
  }
  return true;
}
__name(deepEqual, "deepEqual");
function ipToString(ip) {
  switch (ip.length) {
    case IPv4Len: {
      return ip.join(".");
    }
    case IPv6Len: {
      const result = [];
      for (let i = 0; i < ip.length; i++) {
        if (i % 2 === 0) {
          result.push(ip[i].toString(16).padStart(2, "0") + ip[i + 1].toString(16).padStart(2, "0"));
        }
      }
      return result.join(":");
    }
    default: {
      throw new Error("Invalid ip length");
    }
  }
}
__name(ipToString, "ipToString");
function simpleMaskLength(mask) {
  let ones = 0;
  for (let [index, byte] of mask.entries()) {
    if (byte === 255) {
      ones += 8;
      continue;
    }
    while ((byte & 128) != 0) {
      ones++;
      byte = byte << 1;
    }
    if ((byte & 128) != 0) {
      return -1;
    }
    for (let i = index + 1; i < mask.length; i++) {
      if (mask[i] != 0) {
        return -1;
      }
    }
    break;
  }
  return ones;
}
__name(simpleMaskLength, "simpleMaskLength");
function maskToHex(mask) {
  let hex = "0x";
  for (const byte of mask) {
    hex += (byte >> 4).toString(16) + (byte & 15).toString(16);
  }
  return hex;
}
__name(maskToHex, "maskToHex");

// node_modules/@chainsafe/netmask/dist/src/ip.js
var IPv4Len = 4;
var IPv6Len = 16;
var maxIPv6Octet = parseInt("0xFFFF", 16);
var ipv4Prefix = new Uint8Array([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  255,
  255
]);
function maskIp(ip, mask) {
  if (mask.length === IPv6Len && ip.length === IPv4Len && allFF(mask, 0, 11)) {
    mask = mask.slice(12);
  }
  if (mask.length === IPv4Len && ip.length === IPv6Len && deepEqual(ip, ipv4Prefix, 0, 11)) {
    ip = ip.slice(12);
  }
  const n = ip.length;
  if (n != mask.length) {
    throw new Error("Failed to mask ip");
  }
  const out = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    out[i] = ip[i] & mask[i];
  }
  return out;
}
__name(maskIp, "maskIp");
function containsIp(net, ip) {
  if (typeof ip === "string") {
    ip = parseIP(ip);
  }
  if (ip == null)
    throw new Error("Invalid ip");
  if (ip.length !== net.network.length) {
    return false;
  }
  for (let i = 0; i < ip.length; i++) {
    if ((net.network[i] & net.mask[i]) !== (ip[i] & net.mask[i])) {
      return false;
    }
  }
  return true;
}
__name(containsIp, "containsIp");

// node_modules/@chainsafe/netmask/dist/src/cidr.js
function parseCidr(s) {
  const [address, maskString] = s.split("/");
  if (!address || !maskString)
    throw new Error("Failed to parse given CIDR: " + s);
  let ipLength = IPv4Len;
  let ip = parseIPv4(address);
  if (ip == null) {
    ipLength = IPv6Len;
    ip = parseIPv6(address);
    if (ip == null)
      throw new Error("Failed to parse given CIDR: " + s);
  }
  const m = parseInt(maskString, 10);
  if (Number.isNaN(m) || String(m).length !== maskString.length || m < 0 || m > ipLength * 8) {
    throw new Error("Failed to parse given CIDR: " + s);
  }
  const mask = cidrMask(m, 8 * ipLength);
  return {
    network: maskIp(ip, mask),
    mask
  };
}
__name(parseCidr, "parseCidr");
function cidrMask(ones, bits) {
  if (bits !== 8 * IPv4Len && bits !== 8 * IPv6Len)
    throw new Error("Invalid CIDR mask");
  if (ones < 0 || ones > bits)
    throw new Error("Invalid CIDR mask");
  const l = bits / 8;
  const m = new Uint8Array(l);
  for (let i = 0; i < l; i++) {
    if (ones >= 8) {
      m[i] = 255;
      ones -= 8;
      continue;
    }
    m[i] = 255 - (255 >> ones);
    ones = 0;
  }
  return m;
}
__name(cidrMask, "cidrMask");

// node_modules/@chainsafe/netmask/dist/src/ipnet.js
var IpNet = class {
  static {
    __name(this, "IpNet");
  }
  /**
   *
   * @param ipOrCidr either network ip or full cidr address
   * @param mask in case ipOrCidr is network this can be either mask in decimal format or as ip address
   */
  constructor(ipOrCidr, mask) {
    if (mask == null) {
      ({ network: this.network, mask: this.mask } = parseCidr(ipOrCidr));
    } else {
      const ipResult = parseIP(ipOrCidr);
      if (ipResult == null) {
        throw new Error("Failed to parse network");
      }
      mask = String(mask);
      const m = parseInt(mask, 10);
      if (Number.isNaN(m) || String(m).length !== mask.length || m < 0 || m > ipResult.length * 8) {
        const maskResult = parseIP(mask);
        if (maskResult == null) {
          throw new Error("Failed to parse mask");
        }
        this.mask = maskResult;
      } else {
        this.mask = cidrMask(m, 8 * ipResult.length);
      }
      this.network = maskIp(ipResult, this.mask);
    }
  }
  /**
   * Checks if netmask contains ip address
   * @param ip
   * @returns
   */
  contains(ip) {
    return containsIp({ network: this.network, mask: this.mask }, ip);
  }
  /**Serializes back to string format */
  toString() {
    const l = simpleMaskLength(this.mask);
    const mask = l !== -1 ? String(l) : maskToHex(this.mask);
    return ipToString(this.network) + "/" + mask;
  }
};

// node_modules/@chainsafe/netmask/dist/src/index.js
function cidrContains(cidr, ip) {
  const ipnet = new IpNet(cidr);
  return ipnet.contains(ip);
}
__name(cidrContains, "cidrContains");

// node_modules/@libp2p/utils/dist/src/multiaddr/is-global-unicast.js
function isGlobalUnicast(ma) {
  try {
    const config = getNetConfig(ma);
    switch (config.type) {
      case "ip6":
        return cidrContains("2000::/3", config.host);
      default:
        return false;
    }
  } catch {
    return false;
  }
}
__name(isGlobalUnicast, "isGlobalUnicast");

// node_modules/@libp2p/utils/dist/src/private-ip.js
var import_netmask2 = __toESM(require_netmask(), 1);
var PRIVATE_IP_RANGES = [
  "0.0.0.0/8",
  "10.0.0.0/8",
  "100.64.0.0/10",
  "127.0.0.0/8",
  "169.254.0.0/16",
  "172.16.0.0/12",
  "192.0.0.0/24",
  "192.0.0.0/29",
  "192.0.0.8/32",
  "192.0.0.9/32",
  "192.0.0.10/32",
  "192.0.0.170/32",
  "192.0.0.171/32",
  "192.0.2.0/24",
  "192.31.196.0/24",
  "192.52.193.0/24",
  "192.88.99.0/24",
  "192.168.0.0/16",
  "192.175.48.0/24",
  "198.18.0.0/15",
  "198.51.100.0/24",
  "203.0.113.0/24",
  "240.0.0.0/4",
  "255.255.255.255/32"
];
var NETMASK_RANGES = PRIVATE_IP_RANGES.map((ipRange) => new import_netmask2.Netmask(ipRange));
function ipv4Check(ipAddr) {
  for (const r of NETMASK_RANGES) {
    if (r.contains(ipAddr)) {
      return true;
    }
  }
  return false;
}
__name(ipv4Check, "ipv4Check");
function isIpv4MappedIpv6(ipAddr) {
  return /^::ffff:([0-9a-fA-F]{1,4}):([0-9a-fA-F]{1,4})$/.test(ipAddr);
}
__name(isIpv4MappedIpv6, "isIpv4MappedIpv6");
function ipv4MappedIpv6Check(ipAddr) {
  const parts = ipAddr.split(":");
  if (parts.length < 2) {
    return false;
  }
  const octet34 = parts[parts.length - 1].padStart(4, "0");
  const octet12 = parts[parts.length - 2].padStart(4, "0");
  const ip4 = `${parseInt(octet12.substring(0, 2), 16)}.${parseInt(octet12.substring(2), 16)}.${parseInt(octet34.substring(0, 2), 16)}.${parseInt(octet34.substring(2), 16)}`;
  return ipv4Check(ip4);
}
__name(ipv4MappedIpv6Check, "ipv4MappedIpv6Check");
function isIpv4EmbeddedIpv6(ipAddr) {
  return /^::ffff:([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/.test(ipAddr);
}
__name(isIpv4EmbeddedIpv6, "isIpv4EmbeddedIpv6");
function ipv4EmbeddedIpv6Check(ipAddr) {
  const parts = ipAddr.split(":");
  const ip4 = parts[parts.length - 1];
  return ipv4Check(ip4);
}
__name(ipv4EmbeddedIpv6Check, "ipv4EmbeddedIpv6Check");
function ipv6Check(ipAddr) {
  return /^::$/.test(ipAddr) || /^::1$/.test(ipAddr) || /^64:ff9b::([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/.test(ipAddr) || /^100::([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4})$/.test(ipAddr) || /^2001::([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4})$/.test(ipAddr) || /^2001:2[0-9a-fA-F]:([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4})$/.test(ipAddr) || /^2001:db8:([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4})$/.test(ipAddr) || /^2002:([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4})$/.test(ipAddr) || /^f[c-d]([0-9a-fA-F]{2,2}):/i.test(ipAddr) || /^fe[8-9a-bA-B][0-9a-fA-F]:/i.test(ipAddr) || /^ff([0-9a-fA-F]{2,2}):/i.test(ipAddr);
}
__name(ipv6Check, "ipv6Check");
function isPrivateIp(ip) {
  if (isIPv4(ip)) {
    return ipv4Check(ip);
  }
  if (isIpv4MappedIpv6(ip)) {
    return ipv4MappedIpv6Check(ip);
  }
  if (isIpv4EmbeddedIpv6(ip)) {
    return ipv4EmbeddedIpv6Check(ip);
  }
  if (isIPv6(ip)) {
    return ipv6Check(ip);
  }
}
__name(isPrivateIp, "isPrivateIp");

// node_modules/@libp2p/utils/dist/src/multiaddr/is-private.js
function isPrivate(ma) {
  try {
    const config = getNetConfig(ma);
    switch (config.type) {
      case "ip4":
      case "ip6":
        return isPrivateIp(config.host) ?? false;
      default:
        return config.host === "localhost";
    }
  } catch {
    return false;
  }
}
__name(isPrivate, "isPrivate");

// node_modules/p-defer/index.js
function pDefer() {
  const deferred = {};
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
}
__name(pDefer, "pDefer");

// node_modules/p-timeout/index.js
var TimeoutError = class extends Error {
  static {
    __name(this, "TimeoutError");
  }
  constructor(message2) {
    super(message2);
    this.name = "TimeoutError";
  }
};
var AbortError = class extends Error {
  static {
    __name(this, "AbortError");
  }
  constructor(message2) {
    super();
    this.name = "AbortError";
    this.message = message2;
  }
};
var getDOMException = /* @__PURE__ */ __name((errorMessage) => globalThis.DOMException === void 0 ? new AbortError(errorMessage) : new DOMException(errorMessage), "getDOMException");
var getAbortedReason = /* @__PURE__ */ __name((signal) => {
  const reason = signal.reason === void 0 ? getDOMException("This operation was aborted.") : signal.reason;
  return reason instanceof Error ? reason : getDOMException(reason);
}, "getAbortedReason");
function pTimeout(promise, options) {
  const {
    milliseconds,
    fallback,
    message: message2,
    customTimers = { setTimeout, clearTimeout }
  } = options;
  let timer;
  let abortHandler;
  const wrappedPromise = new Promise((resolve, reject) => {
    if (typeof milliseconds !== "number" || Math.sign(milliseconds) !== 1) {
      throw new TypeError(`Expected \`milliseconds\` to be a positive number, got \`${milliseconds}\``);
    }
    if (options.signal) {
      const { signal } = options;
      if (signal.aborted) {
        reject(getAbortedReason(signal));
      }
      abortHandler = /* @__PURE__ */ __name(() => {
        reject(getAbortedReason(signal));
      }, "abortHandler");
      signal.addEventListener("abort", abortHandler, { once: true });
    }
    if (milliseconds === Number.POSITIVE_INFINITY) {
      promise.then(resolve, reject);
      return;
    }
    const timeoutError = new TimeoutError();
    timer = customTimers.setTimeout.call(void 0, () => {
      if (fallback) {
        try {
          resolve(fallback());
        } catch (error) {
          reject(error);
        }
        return;
      }
      if (typeof promise.cancel === "function") {
        promise.cancel();
      }
      if (message2 === false) {
        resolve();
      } else if (message2 instanceof Error) {
        reject(message2);
      } else {
        timeoutError.message = message2 ?? `Promise timed out after ${milliseconds} milliseconds`;
        reject(timeoutError);
      }
    }, milliseconds);
    (async () => {
      try {
        resolve(await promise);
      } catch (error) {
        reject(error);
      }
    })();
  });
  const cancelablePromise = wrappedPromise.finally(() => {
    cancelablePromise.clear();
    if (abortHandler && options.signal) {
      options.signal.removeEventListener("abort", abortHandler);
    }
  });
  cancelablePromise.clear = () => {
    customTimers.clearTimeout.call(void 0, timer);
    timer = void 0;
  };
  return cancelablePromise;
}
__name(pTimeout, "pTimeout");

// node_modules/p-event/index.js
var normalizeEmitter = /* @__PURE__ */ __name((emitter) => {
  const addListener = emitter.addEventListener || emitter.on || emitter.addListener;
  const removeListener = emitter.removeEventListener || emitter.off || emitter.removeListener;
  if (!addListener || !removeListener) {
    throw new TypeError("Emitter is not compatible");
  }
  return {
    addListener: addListener.bind(emitter),
    removeListener: removeListener.bind(emitter)
  };
}, "normalizeEmitter");
function pEventMultiple(emitter, event, options) {
  let cancel;
  const returnValue = new Promise((resolve, reject) => {
    options = {
      rejectionEvents: ["error"],
      multiArgs: false,
      rejectionMultiArgs: false,
      resolveImmediately: false,
      ...options
    };
    if (!(options.count >= 0 && (options.count === Number.POSITIVE_INFINITY || Number.isInteger(options.count)))) {
      throw new TypeError("The `count` option should be at least 0 or more");
    }
    options.signal?.throwIfAborted();
    const events = [event].flat();
    const items = [];
    const { addListener, removeListener } = normalizeEmitter(emitter);
    const onItem = /* @__PURE__ */ __name(async (...arguments_) => {
      const value2 = options.multiArgs ? arguments_ : arguments_[0];
      if (options.filter) {
        try {
          if (!await options.filter(value2)) {
            return;
          }
        } catch (error) {
          cancel();
          reject(error);
          return;
        }
      }
      items.push(value2);
      if (options.count === items.length) {
        cancel();
        resolve(items);
      }
    }, "onItem");
    const rejectHandler = /* @__PURE__ */ __name((...arguments_) => {
      cancel();
      reject(options.rejectionMultiArgs ? arguments_ : arguments_[0]);
    }, "rejectHandler");
    cancel = /* @__PURE__ */ __name(() => {
      for (const event2 of events) {
        removeListener(event2, onItem);
      }
      for (const rejectionEvent of options.rejectionEvents) {
        if (!events.includes(rejectionEvent)) {
          removeListener(rejectionEvent, rejectHandler);
        }
      }
    }, "cancel");
    for (const event2 of events) {
      addListener(event2, onItem);
    }
    for (const rejectionEvent of options.rejectionEvents) {
      if (!events.includes(rejectionEvent)) {
        addListener(rejectionEvent, rejectHandler);
      }
    }
    if (options.signal) {
      options.signal.addEventListener("abort", () => {
        rejectHandler(options.signal.reason);
      }, { once: true });
    }
    if (options.resolveImmediately) {
      resolve(items);
    }
  });
  returnValue.cancel = cancel;
  if (typeof options.timeout === "number") {
    const timeout = pTimeout(returnValue, { milliseconds: options.timeout });
    timeout.cancel = () => {
      cancel();
      timeout.clear();
    };
    return timeout;
  }
  return returnValue;
}
__name(pEventMultiple, "pEventMultiple");
function pEvent(emitter, event, options) {
  if (typeof options === "function") {
    options = { filter: options };
  }
  options = {
    ...options,
    count: 1,
    resolveImmediately: false
  };
  const arrayPromise = pEventMultiple(emitter, event, options);
  const promise = arrayPromise.then((array) => array[0]);
  promise.cancel = arrayPromise.cancel;
  return promise;
}
__name(pEvent, "pEvent");

// node_modules/@libp2p/utils/dist/src/debounce.js
function debounce(func, wait) {
  let timeout;
  const output = /* @__PURE__ */ __name(function() {
    const later = /* @__PURE__ */ __name(function() {
      timeout = void 0;
      void func();
    }, "later");
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  }, "output");
  output.start = () => {
  };
  output.stop = () => {
    clearTimeout(timeout);
  };
  return output;
}
__name(debounce, "debounce");

// node_modules/@libp2p/utils/dist/src/errors.js
var UnexpectedEOFError = class extends Error {
  static name = "UnexpectedEOFError";
  name = "UnexpectedEOFError";
};

// node_modules/@libp2p/utils/node_modules/race-signal/dist/src/index.js
function defaultTranslate(signal) {
  return signal.reason;
}
__name(defaultTranslate, "defaultTranslate");
async function raceSignal(promise, signal, opts) {
  if (signal == null) {
    return promise;
  }
  const translateError = opts?.translateError ?? defaultTranslate;
  if (signal.aborted) {
    promise.catch(() => {
    });
    return Promise.reject(translateError(signal));
  }
  let listener;
  try {
    return await Promise.race([
      promise,
      new Promise((resolve, reject) => {
        listener = /* @__PURE__ */ __name(() => {
          reject(translateError(signal));
        }, "listener");
        signal.addEventListener("abort", listener);
      })
    ]);
  } finally {
    if (listener != null) {
      signal.removeEventListener("abort", listener);
    }
  }
}
__name(raceSignal, "raceSignal");

// node_modules/@libp2p/utils/dist/src/stream-utils.js
var DEFAULT_MAX_BUFFER_SIZE = 4194304;
var UnwrappedError = class extends Error {
  static name = "UnwrappedError";
  name = "UnwrappedError";
};
var InvalidMessageLengthError = class extends Error {
  static {
    __name(this, "InvalidMessageLengthError");
  }
  name = "InvalidMessageLengthError";
  code = "ERR_INVALID_MSG_LENGTH";
};
var InvalidDataLengthError = class extends Error {
  static {
    __name(this, "InvalidDataLengthError");
  }
  name = "InvalidDataLengthError";
  code = "ERR_MSG_DATA_TOO_LONG";
};
var InvalidDataLengthLengthError = class extends Error {
  static {
    __name(this, "InvalidDataLengthLengthError");
  }
  name = "InvalidDataLengthLengthError";
  code = "ERR_MSG_LENGTH_TOO_LONG";
};
function isStream(obj) {
  return typeof obj?.closeRead === "function";
}
__name(isStream, "isStream");
function isMultiaddrConnection(obj) {
  return typeof obj?.close === "function";
}
__name(isMultiaddrConnection, "isMultiaddrConnection");
function isEOF(obj) {
  if (isStream(obj)) {
    return obj.remoteWriteStatus !== "writable" && obj.readBufferLength === 0;
  }
  if (isMultiaddrConnection(obj)) {
    return obj.status !== "open";
  }
  return false;
}
__name(isEOF, "isEOF");
function isValid(obj) {
  return obj?.addEventListener != null && obj?.removeEventListener != null && obj?.send != null && obj?.push != null && obj?.log != null;
}
__name(isValid, "isValid");
function byteStream(stream, opts) {
  const maxBufferSize = opts?.maxBufferSize ?? DEFAULT_MAX_BUFFER_SIZE;
  const readBuffer = new Uint8ArrayList();
  let hasBytes;
  let unwrapped = false;
  if (!isValid(stream)) {
    throw new InvalidParametersError4("Argument should be a Stream or a Multiaddr");
  }
  const byteStreamOnMessageListener = /* @__PURE__ */ __name((evt) => {
    readBuffer.append(evt.data);
    if (readBuffer.byteLength > maxBufferSize) {
      const readBufferSize = readBuffer.byteLength;
      readBuffer.consume(readBuffer.byteLength);
      hasBytes?.reject(new Error(`Read buffer overflow - ${readBufferSize} > ${maxBufferSize}`));
    }
    hasBytes?.resolve();
  }, "byteStreamOnMessageListener");
  stream.addEventListener("message", byteStreamOnMessageListener);
  const byteStreamOnCloseListener = /* @__PURE__ */ __name((evt) => {
    if (evt.error != null) {
      hasBytes?.reject(evt.error);
    } else {
      hasBytes?.resolve();
    }
  }, "byteStreamOnCloseListener");
  stream.addEventListener("close", byteStreamOnCloseListener);
  const byteStreamOnRemoteCloseWrite = /* @__PURE__ */ __name(() => {
    hasBytes?.resolve();
  }, "byteStreamOnRemoteCloseWrite");
  stream.addEventListener("remoteCloseWrite", byteStreamOnRemoteCloseWrite);
  const byteStream2 = {
    readBuffer,
    // @ts-expect-error options type prevents type inference
    async read(options) {
      if (unwrapped === true) {
        throw new UnwrappedError("Stream was unwrapped");
      }
      if (isEOF(stream)) {
        if (options?.bytes == null) {
          return null;
        }
        if (readBuffer.byteLength < options.bytes) {
          stream.log.error("closed after reading %d/%d bytes", readBuffer.byteLength, options.bytes);
          throw new UnexpectedEOFError(`Unexpected EOF - stream closed after reading ${readBuffer.byteLength}/${options.bytes} bytes`);
        }
      }
      const bytesToRead = options?.bytes ?? 1;
      hasBytes = Promise.withResolvers();
      while (true) {
        if (readBuffer.byteLength >= bytesToRead) {
          hasBytes.resolve();
          break;
        }
        await raceSignal(hasBytes.promise, options?.signal);
        if (isEOF(stream)) {
          if (readBuffer.byteLength === 0 && options?.bytes == null) {
            return null;
          }
          break;
        }
        hasBytes = Promise.withResolvers();
      }
      const toRead = options?.bytes ?? readBuffer.byteLength;
      if (readBuffer.byteLength < toRead) {
        if (isEOF(stream)) {
          stream.log.error("closed while reading %d/%d bytes", readBuffer.byteLength, toRead);
          throw new UnexpectedEOFError(`Unexpected EOF - stream closed while reading ${readBuffer.byteLength}/${toRead} bytes`);
        }
        return byteStream2.read(options);
      }
      const output = readBuffer.sublist(0, toRead);
      readBuffer.consume(toRead);
      return output;
    },
    async write(data, options) {
      if (unwrapped === true) {
        throw new UnwrappedError("Stream was unwrapped");
      }
      if (!stream.send(data)) {
        await pEvent(stream, "drain", {
          signal: options?.signal,
          rejectionEvents: ["close"]
        });
      }
    },
    unwrap() {
      if (unwrapped) {
        return stream;
      }
      unwrapped = true;
      stream.removeEventListener("message", byteStreamOnMessageListener);
      stream.removeEventListener("close", byteStreamOnCloseListener);
      stream.removeEventListener("remoteCloseWrite", byteStreamOnRemoteCloseWrite);
      if (readBuffer.byteLength > 0) {
        stream.log("stream unwrapped with %d unread bytes", readBuffer.byteLength);
        stream.push(readBuffer);
      }
      return stream;
    }
  };
  return byteStream2;
}
__name(byteStream, "byteStream");
function lpStream(stream, opts = {}) {
  const bytes = byteStream(stream, opts);
  if (opts.maxDataLength != null && opts.maxLengthLength == null) {
    opts.maxLengthLength = encodingLength2(opts.maxDataLength);
  }
  const decodeLength = opts?.lengthDecoder ?? decode6;
  const encodeLength2 = opts?.lengthEncoder ?? encode5;
  const lpStream2 = {
    async read(options) {
      let dataLength = -1;
      const lengthBuffer = new Uint8ArrayList();
      while (true) {
        const buf2 = await bytes.read({
          ...options,
          bytes: 1
        });
        if (buf2 == null) {
          break;
        }
        lengthBuffer.append(buf2);
        try {
          dataLength = decodeLength(lengthBuffer);
        } catch (err) {
          if (err instanceof RangeError) {
            continue;
          }
          throw err;
        }
        if (dataLength < 0) {
          throw new InvalidMessageLengthError("Invalid message length");
        }
        if (opts?.maxLengthLength != null && lengthBuffer.byteLength > opts.maxLengthLength) {
          throw new InvalidDataLengthLengthError(`Message length length too long - ${lengthBuffer.byteLength} > ${opts.maxLengthLength}`);
        }
        if (dataLength > -1) {
          break;
        }
      }
      if (opts?.maxDataLength != null && dataLength > opts.maxDataLength) {
        throw new InvalidDataLengthError(`Message length too long - ${dataLength} > ${opts.maxDataLength}`);
      }
      const buf = await bytes.read({
        ...options,
        bytes: dataLength
      });
      if (buf == null) {
        stream.log.error("tried to read %d bytes but the stream closed", dataLength);
        throw new UnexpectedEOFError(`Unexpected EOF - tried to read ${dataLength} bytes but the stream closed`);
      }
      if (buf.byteLength !== dataLength) {
        stream.log.error("read %d/%d bytes before the stream closed", buf.byteLength, dataLength);
        throw new UnexpectedEOFError(`Unexpected EOF - read ${buf.byteLength}/${dataLength} bytes before the stream closed`);
      }
      return buf;
    },
    async write(data, options) {
      await bytes.write(new Uint8ArrayList(encodeLength2(data.byteLength), data), options);
    },
    async writeV(data, options) {
      const list = new Uint8ArrayList(...data.flatMap((buf) => [encodeLength2(buf.byteLength), buf]));
      await bytes.write(list, options);
    },
    unwrap() {
      return bytes.unwrap();
    }
  };
  return lpStream2;
}
__name(lpStream, "lpStream");
function pbStream(stream, opts) {
  const lp = lpStream(stream, opts);
  const pbStream2 = {
    read: /* @__PURE__ */ __name(async (proto, options) => {
      const value2 = await lp.read(options);
      return proto.decode(value2);
    }, "read"),
    write: /* @__PURE__ */ __name(async (message2, proto, options) => {
      await lp.write(proto.encode(message2), options);
    }, "write"),
    writeV: /* @__PURE__ */ __name(async (messages, proto, options) => {
      await lp.writeV(messages.map((message2) => proto.encode(message2)), options);
    }, "writeV"),
    pb: /* @__PURE__ */ __name((proto) => {
      return {
        read: /* @__PURE__ */ __name(async (options) => pbStream2.read(proto, options), "read"),
        write: /* @__PURE__ */ __name(async (d, options) => pbStream2.write(d, proto, options), "write"),
        writeV: /* @__PURE__ */ __name(async (d, options) => pbStream2.writeV(d, proto, options), "writeV"),
        unwrap: /* @__PURE__ */ __name(() => pbStream2, "unwrap")
      };
    }, "pb"),
    unwrap: /* @__PURE__ */ __name(() => {
      return lp.unwrap();
    }, "unwrap")
  };
  return pbStream2;
}
__name(pbStream, "pbStream");

// node_modules/it-drain/dist/src/index.js
function isAsyncIterable(thing) {
  return thing[Symbol.asyncIterator] != null;
}
__name(isAsyncIterable, "isAsyncIterable");
function drain(source) {
  if (isAsyncIterable(source)) {
    return (async () => {
      for await (const _ of source) {
      }
    })();
  } else {
    for (const _ of source) {
    }
  }
}
__name(drain, "drain");
var src_default2 = drain;

// node_modules/it-parallel/dist/src/index.js
var CustomEvent2 = globalThis.CustomEvent ?? Event;
async function* parallel(source, options = {}) {
  let concurrency = options.concurrency ?? Infinity;
  if (concurrency < 1) {
    concurrency = Infinity;
  }
  const ordered = options.ordered ?? false;
  const emitter = new EventTarget();
  const ops = [];
  let slotAvailable = pDefer();
  let resultAvailable = pDefer();
  let sourceFinished = false;
  let sourceErr;
  let opErred = false;
  emitter.addEventListener("task-complete", () => {
    resultAvailable.resolve();
  });
  void Promise.resolve().then(async () => {
    try {
      for await (const task of source) {
        if (ops.length === concurrency) {
          slotAvailable = pDefer();
          await slotAvailable.promise;
        }
        if (opErred) {
          break;
        }
        const op = {
          done: false
        };
        ops.push(op);
        task().then((result) => {
          op.done = true;
          op.ok = true;
          op.value = result;
          emitter.dispatchEvent(new CustomEvent2("task-complete"));
        }, (err) => {
          op.done = true;
          op.err = err;
          emitter.dispatchEvent(new CustomEvent2("task-complete"));
        });
      }
      sourceFinished = true;
      emitter.dispatchEvent(new CustomEvent2("task-complete"));
    } catch (err) {
      sourceErr = err;
      emitter.dispatchEvent(new CustomEvent2("task-complete"));
    }
  });
  function valuesAvailable() {
    if (ordered) {
      return ops[0]?.done;
    }
    return Boolean(ops.find((op) => op.done));
  }
  __name(valuesAvailable, "valuesAvailable");
  function* yieldOrderedValues() {
    while (ops.length > 0 && ops[0].done) {
      const op = ops[0];
      ops.shift();
      if (op.ok) {
        yield op.value;
      } else {
        opErred = true;
        slotAvailable.resolve();
        throw op.err;
      }
      slotAvailable.resolve();
    }
  }
  __name(yieldOrderedValues, "yieldOrderedValues");
  function* yieldUnOrderedValues() {
    while (valuesAvailable()) {
      for (let i = 0; i < ops.length; i++) {
        if (ops[i].done) {
          const op = ops[i];
          ops.splice(i, 1);
          i--;
          if (op.ok) {
            yield op.value;
          } else {
            opErred = true;
            slotAvailable.resolve();
            throw op.err;
          }
          slotAvailable.resolve();
        }
      }
    }
  }
  __name(yieldUnOrderedValues, "yieldUnOrderedValues");
  while (true) {
    if (!valuesAvailable()) {
      resultAvailable = pDefer();
      await resultAvailable.promise;
    }
    if (sourceErr != null) {
      throw sourceErr;
    }
    if (ordered) {
      yield* yieldOrderedValues();
    } else {
      yield* yieldUnOrderedValues();
    }
    if (sourceErr != null) {
      throw sourceErr;
    }
    if (sourceFinished && ops.length === 0) {
      break;
    }
  }
}
__name(parallel, "parallel");

// node_modules/@libp2p/identify/dist/src/consts.js
var IDENTIFY_PROTOCOL_VERSION = "0.1.0";
var MULTICODEC_IDENTIFY_PROTOCOL_NAME = "id";
var MULTICODEC_IDENTIFY_PUSH_PROTOCOL_NAME = "id/push";
var MULTICODEC_IDENTIFY_PROTOCOL_VERSION = "1.0.0";
var MULTICODEC_IDENTIFY_PUSH_PROTOCOL_VERSION = "1.0.0";
var MAX_IDENTIFY_MESSAGE_SIZE = 1024 * 8;
var MAX_PUSH_CONCURRENCY = 32;
var PUSH_DEBOUNCE_MS = 1e3;

// node_modules/@libp2p/identify/dist/src/pb/message.js
var Identify;
(function(Identify3) {
  let _codec;
  Identify3.codec = () => {
    if (_codec == null) {
      _codec = message((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork();
        }
        if (obj.protocolVersion != null) {
          w.uint32(42);
          w.string(obj.protocolVersion);
        }
        if (obj.agentVersion != null) {
          w.uint32(50);
          w.string(obj.agentVersion);
        }
        if (obj.publicKey != null) {
          w.uint32(10);
          w.bytes(obj.publicKey);
        }
        if (obj.listenAddrs != null) {
          for (const value2 of obj.listenAddrs) {
            w.uint32(18);
            w.bytes(value2);
          }
        }
        if (obj.observedAddr != null) {
          w.uint32(34);
          w.bytes(obj.observedAddr);
        }
        if (obj.protocols != null) {
          for (const value2 of obj.protocols) {
            w.uint32(26);
            w.string(value2);
          }
        }
        if (obj.signedPeerRecord != null) {
          w.uint32(66);
          w.bytes(obj.signedPeerRecord);
        }
        if (opts.lengthDelimited !== false) {
          w.ldelim();
        }
      }, (reader, length3, opts = {}) => {
        const obj = {
          listenAddrs: [],
          protocols: []
        };
        const end = length3 == null ? reader.len : reader.pos + length3;
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 5: {
              obj.protocolVersion = reader.string();
              break;
            }
            case 6: {
              obj.agentVersion = reader.string();
              break;
            }
            case 1: {
              obj.publicKey = reader.bytes();
              break;
            }
            case 2: {
              if (opts.limits?.listenAddrs != null && obj.listenAddrs.length === opts.limits.listenAddrs) {
                throw new MaxLengthError('Decode error - map field "listenAddrs" had too many elements');
              }
              obj.listenAddrs.push(reader.bytes());
              break;
            }
            case 4: {
              obj.observedAddr = reader.bytes();
              break;
            }
            case 3: {
              if (opts.limits?.protocols != null && obj.protocols.length === opts.limits.protocols) {
                throw new MaxLengthError('Decode error - map field "protocols" had too many elements');
              }
              obj.protocols.push(reader.string());
              break;
            }
            case 8: {
              obj.signedPeerRecord = reader.bytes();
              break;
            }
            default: {
              reader.skipType(tag & 7);
              break;
            }
          }
        }
        return obj;
      });
    }
    return _codec;
  };
  Identify3.encode = (obj) => {
    return encodeMessage(obj, Identify3.codec());
  };
  Identify3.decode = (buf, opts) => {
    return decodeMessage(buf, Identify3.codec(), opts);
  };
})(Identify || (Identify = {}));

// node_modules/@libp2p/identify/dist/src/utils.js
var defaultValues = {
  protocolPrefix: "ipfs",
  timeout: 5e3,
  maxInboundStreams: 1,
  maxOutboundStreams: 1,
  maxObservedAddresses: 10,
  maxMessageSize: MAX_IDENTIFY_MESSAGE_SIZE,
  runOnConnectionOpen: true,
  runOnSelfUpdate: true,
  runOnLimitedConnection: true,
  concurrency: MAX_PUSH_CONCURRENCY
};
function getCleanMultiaddr(addr) {
  if (addr != null && addr.length > 0) {
    try {
      return multiaddr(addr);
    } catch {
    }
  }
}
__name(getCleanMultiaddr, "getCleanMultiaddr");
async function consumeIdentifyMessage(peerStore, events, log, connection, message2) {
  log("received identify from %p", connection.remotePeer);
  if (message2 == null) {
    throw new InvalidMessageError("message was null or undefined");
  }
  const peer = {};
  if (message2.listenAddrs.length > 0) {
    peer.addresses = message2.listenAddrs.map((buf) => ({
      isCertified: false,
      multiaddr: multiaddr(buf)
    }));
  }
  if (message2.protocols.length > 0) {
    peer.protocols = message2.protocols;
  }
  if (message2.publicKey != null) {
    const publicKey = publicKeyFromProtobuf(message2.publicKey);
    const peerId = peerIdFromPublicKey(publicKey);
    if (!peerId.equals(connection.remotePeer)) {
      throw new InvalidMessageError("public key did not match remote PeerId");
    }
    peer.publicKey = publicKey;
  }
  let output;
  if (message2.signedPeerRecord != null) {
    log.trace("received signedPeerRecord from %p", connection.remotePeer);
    let peerRecordEnvelope = message2.signedPeerRecord;
    const envelope = await RecordEnvelope.openAndCertify(peerRecordEnvelope, PeerRecord2.DOMAIN);
    let peerRecord = PeerRecord2.createFromProtobuf(envelope.payload);
    const envelopePeer = peerIdFromCID(envelope.publicKey.toCID());
    if (!peerRecord.peerId.equals(envelopePeer)) {
      throw new InvalidMessageError("signing key does not match PeerId in the PeerRecord");
    }
    if (!connection.remotePeer.equals(peerRecord.peerId)) {
      throw new InvalidMessageError("signing key does not match remote PeerId");
    }
    let existingPeer;
    try {
      existingPeer = await peerStore.get(peerRecord.peerId);
    } catch (err) {
      if (err.name !== "NotFoundError") {
        throw err;
      }
    }
    if (existingPeer != null) {
      peer.metadata = existingPeer.metadata;
      if (existingPeer.peerRecordEnvelope != null) {
        const storedEnvelope = RecordEnvelope.createFromProtobuf(existingPeer.peerRecordEnvelope);
        const storedRecord = PeerRecord2.createFromProtobuf(storedEnvelope.payload);
        if (storedRecord.seqNumber >= peerRecord.seqNumber) {
          log("sequence number was lower or equal to existing sequence number - stored: %d received: %d", storedRecord.seqNumber, peerRecord.seqNumber);
          peerRecord = storedRecord;
          peerRecordEnvelope = existingPeer.peerRecordEnvelope;
        }
      }
    }
    peer.peerRecordEnvelope = peerRecordEnvelope;
    peer.addresses = peerRecord.multiaddrs.map((multiaddr2) => ({
      isCertified: true,
      multiaddr: multiaddr2
    }));
    output = {
      seq: peerRecord.seqNumber,
      addresses: peerRecord.multiaddrs
    };
  } else {
    log("%p did not send a signed peer record", connection.remotePeer);
  }
  log.trace("patching %p with", connection.remotePeer, peer);
  await peerStore.patch(connection.remotePeer, peer);
  if (message2.agentVersion != null || message2.protocolVersion != null) {
    const metadata = {};
    if (message2.agentVersion != null) {
      metadata.AgentVersion = fromString2(message2.agentVersion);
    }
    if (message2.protocolVersion != null) {
      metadata.ProtocolVersion = fromString2(message2.protocolVersion);
    }
    log.trace("merging %p metadata", connection.remotePeer, metadata);
    await peerStore.merge(connection.remotePeer, {
      metadata
    });
  }
  const result = {
    peerId: connection.remotePeer,
    protocolVersion: message2.protocolVersion,
    agentVersion: message2.agentVersion,
    publicKey: message2.publicKey,
    listenAddrs: message2.listenAddrs.map((buf) => multiaddr(buf)),
    observedAddr: message2.observedAddr == null ? void 0 : multiaddr(message2.observedAddr),
    protocols: message2.protocols,
    signedPeerRecord: output,
    connection
  };
  events.safeDispatchEvent("peer:identify", { detail: result });
  return result;
}
__name(consumeIdentifyMessage, "consumeIdentifyMessage");
var AbstractIdentify = class {
  static {
    __name(this, "AbstractIdentify");
  }
  host;
  components;
  protocol;
  started;
  timeout;
  maxInboundStreams;
  maxOutboundStreams;
  maxMessageSize;
  maxObservedAddresses;
  runOnLimitedConnection;
  log;
  constructor(components, init) {
    this.protocol = init.protocol;
    this.started = false;
    this.components = components;
    this.log = init.log;
    this.timeout = init.timeout ?? defaultValues.timeout;
    this.maxInboundStreams = init.maxInboundStreams ?? defaultValues.maxInboundStreams;
    this.maxOutboundStreams = init.maxOutboundStreams ?? defaultValues.maxOutboundStreams;
    this.maxMessageSize = init.maxMessageSize ?? defaultValues.maxMessageSize;
    this.maxObservedAddresses = init.maxObservedAddresses ?? defaultValues.maxObservedAddresses;
    this.runOnLimitedConnection = init.runOnLimitedConnection ?? defaultValues.runOnLimitedConnection;
    this.host = {
      protocolVersion: `${init.protocolPrefix ?? defaultValues.protocolPrefix}/${IDENTIFY_PROTOCOL_VERSION}`,
      agentVersion: components.nodeInfo.userAgent
    };
    this.handleProtocol = this.handleProtocol.bind(this);
  }
  isStarted() {
    return this.started;
  }
  async start() {
    if (this.started) {
      return;
    }
    await this.components.peerStore.merge(this.components.peerId, {
      metadata: {
        AgentVersion: fromString2(this.host.agentVersion),
        ProtocolVersion: fromString2(this.host.protocolVersion)
      }
    });
    await this.components.registrar.handle(this.protocol, this.handleProtocol, {
      maxInboundStreams: this.maxInboundStreams,
      maxOutboundStreams: this.maxOutboundStreams,
      runOnLimitedConnection: this.runOnLimitedConnection
    });
    this.started = true;
  }
  async stop() {
    await this.components.registrar.unhandle(this.protocol);
    this.started = false;
  }
};

// node_modules/@libp2p/identify/dist/src/identify-push.js
var IdentifyPush = class extends AbstractIdentify {
  static {
    __name(this, "IdentifyPush");
  }
  connectionManager;
  concurrency;
  _push;
  constructor(components, init = {}) {
    super(components, {
      ...init,
      protocol: `/${init.protocolPrefix ?? defaultValues.protocolPrefix}/${MULTICODEC_IDENTIFY_PUSH_PROTOCOL_NAME}/${MULTICODEC_IDENTIFY_PUSH_PROTOCOL_VERSION}`,
      log: components.logger.forComponent("libp2p:identify-push")
    });
    this.connectionManager = components.connectionManager;
    this.concurrency = init.concurrency ?? defaultValues.concurrency;
    this._push = debounce(this.sendPushMessage.bind(this), init.debounce ?? PUSH_DEBOUNCE_MS);
    if (init.runOnSelfUpdate ?? defaultValues.runOnSelfUpdate) {
      components.events.addEventListener("self:peer:update", (evt) => {
        this.push().catch((err) => {
          this.log.error("error pushing updates to peers - %e", err);
        });
      });
    }
  }
  [serviceCapabilities] = [
    "@libp2p/identify-push"
  ];
  /**
   * Calls `push` on all peer connections
   */
  async push() {
    this._push();
  }
  async sendPushMessage() {
    if (!this.isStarted()) {
      return;
    }
    try {
      const listenAddresses = this.components.addressManager.getAddresses().map((ma) => ma.decapsulateCode(CODE_P2P));
      const peerRecord = new PeerRecord2({
        peerId: this.components.peerId,
        multiaddrs: listenAddresses
      });
      const signedPeerRecord = await RecordEnvelope.seal(peerRecord, this.components.privateKey);
      const supportedProtocols = this.components.registrar.getProtocols();
      const peer = await this.components.peerStore.get(this.components.peerId);
      const agentVersion = toString2(peer.metadata.get("AgentVersion") ?? fromString2(this.host.agentVersion));
      const protocolVersion = toString2(peer.metadata.get("ProtocolVersion") ?? fromString2(this.host.protocolVersion));
      const self = this;
      async function* pushToConnections() {
        for (const connection of self.connectionManager.getConnections()) {
          const peer2 = await self.components.peerStore.get(connection.remotePeer);
          if (!peer2.protocols.includes(self.protocol)) {
            continue;
          }
          yield async () => {
            let stream;
            const signal = AbortSignal.timeout(self.timeout);
            setMaxListeners(Infinity, signal);
            try {
              stream = await connection.newStream(self.protocol, {
                signal,
                runOnLimitedConnection: self.runOnLimitedConnection
              });
              const pb = pbStream(stream, {
                maxDataLength: self.maxMessageSize
              }).pb(Identify);
              await pb.write({
                listenAddrs: listenAddresses.map((ma) => ma.bytes),
                signedPeerRecord: signedPeerRecord.marshal(),
                protocols: supportedProtocols,
                agentVersion,
                protocolVersion
              }, {
                signal
              });
              await stream.close({
                signal
              });
            } catch (err) {
              const log = stream?.log.newScope("identify-push");
              log?.error("could not push identify update to peer", err);
              stream?.abort(err);
            }
          };
        }
      }
      __name(pushToConnections, "pushToConnections");
      await src_default2(parallel(pushToConnections(), {
        concurrency: this.concurrency
      }));
    } catch (err) {
      this.log.error("error pushing updates to peers - %e", err);
    }
  }
  /**
   * Reads the Identify Push message from the given `connection`
   */
  async handleProtocol(stream, connection) {
    const log = stream.log.newScope("identify-push");
    if (this.components.peerId.equals(connection.remotePeer)) {
      throw new Error("received push from ourselves?");
    }
    const options = {
      signal: AbortSignal.timeout(this.timeout)
    };
    const pb = pbStream(stream, {
      maxDataLength: this.maxMessageSize
    }).pb(Identify);
    const message2 = await pb.read(options);
    await stream.close(options);
    await consumeIdentifyMessage(this.components.peerStore, this.components.events, log, connection, message2);
    log.trace("handled push from %p", connection.remotePeer);
  }
};

// node_modules/@multiformats/multiaddr-matcher/dist/src/utils.js
var code2 = /* @__PURE__ */ __name((code3) => {
  return {
    match: /* @__PURE__ */ __name((vals) => {
      const component = vals[0];
      if (component == null) {
        return false;
      }
      if (component.code !== code3) {
        return false;
      }
      if (component.value != null) {
        return false;
      }
      return vals.slice(1);
    }, "match")
  };
}, "code");
var value = /* @__PURE__ */ __name((code3, value2) => {
  return {
    match: /* @__PURE__ */ __name((vals) => {
      const component = vals[0];
      if (component?.code !== code3) {
        return false;
      }
      if (component.value == null) {
        return false;
      }
      if (value2 != null && component.value !== value2) {
        return false;
      }
      return vals.slice(1);
    }, "match")
  };
}, "value");
var not = /* @__PURE__ */ __name((matcher) => {
  return {
    match: /* @__PURE__ */ __name((vals) => {
      const result = matcher.match(vals);
      if (result === false) {
        return vals;
      }
      return false;
    }, "match")
  };
}, "not");
var optional = /* @__PURE__ */ __name((matcher) => {
  return {
    match: /* @__PURE__ */ __name((vals) => {
      const result = matcher.match(vals);
      if (result === false) {
        return vals;
      }
      return result;
    }, "match")
  };
}, "optional");
var or2 = /* @__PURE__ */ __name((...matchers) => {
  return {
    match: /* @__PURE__ */ __name((vals) => {
      let matches;
      for (const matcher of matchers) {
        const result = matcher.match(vals);
        if (result === false) {
          continue;
        }
        if (matches == null || result.length < matches.length) {
          matches = result;
        }
      }
      if (matches == null) {
        return false;
      }
      return matches;
    }, "match")
  };
}, "or");
var and = /* @__PURE__ */ __name((...matchers) => {
  return {
    match: /* @__PURE__ */ __name((vals) => {
      for (const matcher of matchers) {
        const result = matcher.match(vals);
        if (result === false) {
          return false;
        }
        vals = result;
      }
      return vals;
    }, "match")
  };
}, "and");
function fmt(...matchers) {
  function match(ma) {
    if (ma == null) {
      return false;
    }
    let parts = ma.getComponents();
    for (const matcher of matchers) {
      const result = matcher.match(parts);
      if (result === false) {
        return false;
      }
      parts = result;
    }
    return parts;
  }
  __name(match, "match");
  function matches(ma) {
    const result = match(ma);
    return result !== false;
  }
  __name(matches, "matches");
  function exactMatch(ma) {
    const result = match(ma);
    if (result === false) {
      return false;
    }
    return result.length === 0;
  }
  __name(exactMatch, "exactMatch");
  return {
    matchers,
    matches,
    exactMatch
  };
}
__name(fmt, "fmt");

// node_modules/@multiformats/multiaddr-matcher/dist/src/index.js
var _PEER_ID = value(CODE_P2P);
var PEER_ID = fmt(_PEER_ID);
var _DNS4 = value(CODE_DNS4);
var _DNS6 = value(CODE_DNS6);
var _DNSADDR = value(CODE_DNSADDR);
var _DNS = value(CODE_DNS);
var DNS4 = fmt(_DNS4, optional(value(CODE_P2P)));
var DNS6 = fmt(_DNS6, optional(value(CODE_P2P)));
var DNSADDR = fmt(_DNSADDR, optional(value(CODE_P2P)));
var DNS = fmt(or2(_DNS, _DNSADDR, _DNS4, _DNS6), optional(value(CODE_P2P)));
var _IP4 = and(value(CODE_IP4), optional(value(CODE_IPCIDR)));
var _IP6 = and(optional(value(CODE_IP6ZONE)), value(CODE_IP6), optional(value(CODE_IPCIDR)));
var _IP = or2(_IP4, _IP6);
var _IP_OR_DOMAIN = or2(_IP, _DNS, _DNS4, _DNS6, _DNSADDR);
var IP_OR_DOMAIN = fmt(or2(_IP, and(or2(_DNS, _DNSADDR, _DNS4, _DNS6), optional(value(CODE_P2P)))));
var IP4 = fmt(_IP4);
var IP6 = fmt(_IP6);
var IP = fmt(_IP);
var _TCP = and(_IP_OR_DOMAIN, value(CODE_TCP));
var _UDP = and(_IP_OR_DOMAIN, value(CODE_UDP));
var TCP = fmt(and(_TCP, optional(value(CODE_P2P))));
var UDP = fmt(_UDP);
var _QUIC = and(_UDP, code2(CODE_QUIC), optional(value(CODE_P2P)));
var _QUIC_V1 = and(_UDP, code2(CODE_QUIC_V1), optional(value(CODE_P2P)));
var QUIC_V0_OR_V1 = or2(_QUIC, _QUIC_V1);
var QUIC = fmt(_QUIC);
var QUIC_V1 = fmt(_QUIC_V1);
var _WEB = or2(_IP_OR_DOMAIN, _TCP, _UDP, _QUIC, _QUIC_V1);
var _WebSockets = or2(and(_WEB, code2(CODE_WS), optional(value(CODE_P2P))));
var WebSockets = fmt(_WebSockets);
var _WebSocketsSecure = or2(and(_WEB, code2(CODE_WSS), optional(value(CODE_P2P))), and(_WEB, code2(CODE_TLS), optional(value(CODE_SNI)), code2(CODE_WS), optional(value(CODE_P2P))));
var WebSocketsSecure = fmt(_WebSocketsSecure);
var _WebRTCDirect = and(_UDP, code2(CODE_WEBRTC_DIRECT), optional(value(CODE_CERTHASH)), optional(value(CODE_CERTHASH)), optional(value(CODE_P2P)));
var WebRTCDirect = fmt(_WebRTCDirect);
var _WebTransport = and(_QUIC_V1, code2(CODE_WEBTRANSPORT), optional(value(CODE_CERTHASH)), optional(value(CODE_CERTHASH)), optional(value(CODE_P2P)));
var WebTransport = fmt(_WebTransport);
var _P2P = or2(_WebSockets, _WebSocketsSecure, and(_TCP, optional(value(CODE_P2P))), and(QUIC_V0_OR_V1, optional(value(CODE_P2P))), and(_IP_OR_DOMAIN, optional(value(CODE_P2P))), _WebRTCDirect, _WebTransport, value(CODE_P2P));
var P2P = fmt(_P2P);
var _Circuit = and(optional(_P2P), code2(CODE_P2P_CIRCUIT), not(code2(CODE_WEBRTC)), optional(value(CODE_P2P)));
var Circuit = fmt(_Circuit);
var _WebRTC = or2(and(_P2P, code2(CODE_P2P_CIRCUIT), code2(CODE_WEBRTC), optional(value(CODE_P2P))), and(_P2P, code2(CODE_WEBRTC), optional(value(CODE_P2P))), and(code2(CODE_WEBRTC), optional(value(CODE_P2P))));
var WebRTC = fmt(_WebRTC);
var _HTTP = or2(and(_IP_OR_DOMAIN, value(CODE_TCP), code2(CODE_HTTP), optional(value(CODE_P2P))), and(_IP_OR_DOMAIN, code2(CODE_HTTP), optional(value(CODE_P2P))));
var HTTP = fmt(_HTTP);
var _HTTPS = and(_IP_OR_DOMAIN, or2(and(value(CODE_TCP, "443"), code2(CODE_HTTP)), and(value(CODE_TCP), code2(CODE_HTTPS)), and(value(CODE_TCP), code2(CODE_TLS), code2(CODE_HTTP)), and(code2(CODE_TLS), code2(CODE_HTTP)), code2(CODE_TLS), code2(CODE_HTTPS)), optional(value(CODE_P2P)));
var HTTPS = fmt(_HTTPS);
var _Memory = or2(and(value(CODE_MEMORY), optional(value(CODE_P2P))));
var Memory = fmt(_Memory);
var _Unix = or2(and(value(CODE_UNIX), optional(value(CODE_P2P))));
var Unix = fmt(_Unix);

// node_modules/@libp2p/identify/dist/src/identify.js
var Identify2 = class extends AbstractIdentify {
  static {
    __name(this, "Identify");
  }
  constructor(components, init = {}) {
    super(components, {
      ...init,
      protocol: `/${init.protocolPrefix ?? defaultValues.protocolPrefix}/${MULTICODEC_IDENTIFY_PROTOCOL_NAME}/${MULTICODEC_IDENTIFY_PROTOCOL_VERSION}`,
      log: components.logger.forComponent("libp2p:identify")
    });
    if (init.runOnConnectionOpen ?? defaultValues.runOnConnectionOpen) {
      components.events.addEventListener("connection:open", (evt) => {
        const connection = evt.detail;
        this.identify(connection).catch(() => {
        });
      });
    }
  }
  [serviceCapabilities] = [
    "@libp2p/identify"
  ];
  async _identify(connection, options = {}) {
    let stream;
    let log;
    if (options.signal == null) {
      const signal = AbortSignal.timeout(this.timeout);
      setMaxListeners(Infinity, signal);
      options = {
        ...options,
        signal
      };
    }
    this.log("run identify on new connection %a", connection.remoteAddr);
    try {
      stream = await connection.newStream(this.protocol, {
        ...options,
        runOnLimitedConnection: this.runOnLimitedConnection
      });
      log = stream.log.newScope("identify");
      const pb = pbStream(stream, {
        maxDataLength: this.maxMessageSize
      }).pb(Identify);
      const message2 = await pb.read(options);
      await pb.unwrap().unwrap().close(options);
      return message2;
    } catch (err) {
      log?.error("identify failed - %e", err);
      stream?.abort(err);
      throw err;
    }
  }
  async identify(connection, options = {}) {
    const message2 = await this._identify(connection, options);
    const { publicKey, protocols, observedAddr } = message2;
    if (publicKey == null) {
      throw new InvalidMessageError("Public key was missing from identify message");
    }
    const key = publicKeyFromProtobuf(publicKey);
    const id = peerIdFromCID(key.toCID());
    if (!connection.remotePeer.equals(id)) {
      throw new InvalidMessageError("Identified peer does not match the expected peer");
    }
    if (this.components.peerId.equals(id)) {
      throw new InvalidMessageError("Identified peer is our own peer id?");
    }
    this.maybeAddObservedAddress(observedAddr);
    this.log("completed for peer %p and protocols %o", id, protocols);
    return consumeIdentifyMessage(this.components.peerStore, this.components.events, this.log, connection, message2);
  }
  maybeAddObservedAddress(observedAddr) {
    const cleanObservedAddr = getCleanMultiaddr(observedAddr);
    if (cleanObservedAddr == null) {
      return;
    }
    this.log.trace("our observed address was %a", cleanObservedAddr);
    if (isPrivate(cleanObservedAddr)) {
      return;
    }
    const tuples = cleanObservedAddr.getComponents();
    if ((tuples[0].code === CODE_IP6 || tuples[0].code === CODE_IP6ZONE && tuples[1].code === CODE_IP6) && !isGlobalUnicast(cleanObservedAddr)) {
      this.log.trace("our observed address was IPv6 but not a global unicast address");
      return;
    }
    if (TCP.exactMatch(cleanObservedAddr)) {
      return;
    }
    this.log.trace("storing the observed address");
    this.components.addressManager.addObservedAddr(cleanObservedAddr);
  }
  /**
   * Sends the `Identify` response with the Signed Peer Record
   * to the requesting peer over the given `connection`
   */
  async handleProtocol(stream, connection) {
    const log = stream.log.newScope("identify");
    log("responding to identify");
    const signal = AbortSignal.timeout(this.timeout);
    setMaxListeners(Infinity, signal);
    const peerData = await this.components.peerStore.get(this.components.peerId, {
      signal
    });
    const multiaddrs = this.components.addressManager.getAddresses().map((ma) => ma.decapsulateCode(CODE_P2P));
    let signedPeerRecord = peerData.peerRecordEnvelope;
    if (multiaddrs.length > 0 && signedPeerRecord == null) {
      const peerRecord = new PeerRecord2({
        peerId: this.components.peerId,
        multiaddrs
      });
      const envelope = await RecordEnvelope.seal(peerRecord, this.components.privateKey, {
        signal
      });
      signedPeerRecord = envelope.marshal().subarray();
    }
    let observedAddr = connection.remoteAddr.bytes;
    if (!IP_OR_DOMAIN.matches(connection.remoteAddr)) {
      observedAddr = void 0;
    }
    const pb = pbStream(stream).pb(Identify);
    log("send response");
    await pb.write({
      protocolVersion: this.host.protocolVersion,
      agentVersion: this.host.agentVersion,
      publicKey: publicKeyToProtobuf(this.components.privateKey.publicKey),
      listenAddrs: multiaddrs.map((addr) => addr.bytes),
      signedPeerRecord,
      observedAddr,
      protocols: peerData.protocols
    }, {
      signal
    });
    log("close write");
    await pb.unwrap().unwrap().close({
      signal
    });
  }
};

// node_modules/@libp2p/identify/dist/src/index.js
function identify(init = {}) {
  return (components) => new Identify2(components, init);
}
__name(identify, "identify");
function identifyPush(init = {}) {
  return (components) => new IdentifyPush(components, init);
}
__name(identifyPush, "identifyPush");
export {
  identify,
  identifyPush
};
/*! Bundled license information:

@noble/hashes/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/utils.js:
@noble/curves/abstract/modular.js:
@noble/curves/abstract/curve.js:
@noble/curves/abstract/edwards.js:
@noble/curves/ed25519.js:
@noble/curves/abstract/weierstrass.js:
@noble/curves/secp256k1.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
//# sourceMappingURL=lib-identify.js.map
