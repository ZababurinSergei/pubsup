var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all2) => {
  for (var name2 in all2)
    __defProp(target, name2, { get: all2[name2], enumerable: true });
};

// node_modules/multiformats/dist/src/bases/base10.js
var base10_exports = {};
__export(base10_exports, {
  base10: () => base10
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
  function encode5(source) {
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
    var length2 = 0;
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
      for (var it1 = size - 1; (carry !== 0 || i2 < length2) && it1 !== -1; it1--, i2++) {
        carry += 256 * b58[it1] >>> 0;
        b58[it1] = carry % BASE >>> 0;
        carry = carry / BASE >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length2 = i2;
      pbegin++;
    }
    var it2 = size - length2;
    while (it2 !== size && b58[it2] === 0) {
      it2++;
    }
    var str = LEADER.repeat(zeroes);
    for (; it2 < size; ++it2) {
      str += ALPHABET.charAt(b58[it2]);
    }
    return str;
  }
  __name(encode5, "encode");
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
    var length2 = 0;
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
      for (var it3 = size - 1; (carry !== 0 || i2 < length2) && it3 !== -1; it3--, i2++) {
        carry += BASE * b256[it3] >>> 0;
        b256[it3] = carry % 256 >>> 0;
        carry = carry / 256 >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length2 = i2;
      psz++;
    }
    if (source[psz] === " ") {
      return;
    }
    var it4 = size - length2;
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
    encode: encode5,
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
  constructor(decoders2) {
    this.decoders = decoders2;
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
function from({ name: name2, prefix, encode: encode5, decode: decode7 }) {
  return new Codec(name2, prefix, encode5, decode7);
}
__name(from, "from");
function baseX({ name: name2, prefix, alphabet: alphabet2 }) {
  const { encode: encode5, decode: decode7 } = base_x_default(alphabet2, name2);
  return from({
    prefix,
    name: name2,
    encode: encode5,
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
    const value = alphabetIdx[string2[i]];
    if (value === void 0) {
      throw new SyntaxError(`Non-${name2} character`);
    }
    buffer = buffer << bitsPerChar | value;
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

// node_modules/multiformats/dist/src/bases/base10.js
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
function encode2(data) {
  return data.reduce((p, c) => {
    p += alphabetBytesToChars[c];
    return p;
  }, "");
}
__name(encode2, "encode");
function decode2(str) {
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
__name(decode2, "decode");
var base256emoji = from({
  prefix: "\u{1F680}",
  name: "base256emoji",
  encode: encode2,
  decode: decode2
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

// node_modules/multiformats/dist/src/bases/base58.js
var base58_exports = {};
__export(base58_exports, {
  base58btc: () => base58btc,
  base58flickr: () => base58flickr
});
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
var identity_exports = {};
__export(identity_exports, {
  identity: () => identity
});
var identity = from({
  prefix: "\0",
  name: "identity",
  encode: /* @__PURE__ */ __name((buf) => toString(buf), "encode"),
  decode: /* @__PURE__ */ __name((str) => fromString(str), "decode")
});

// node_modules/multiformats/dist/src/codecs/json.js
var textEncoder = new TextEncoder();
var textDecoder = new TextDecoder();

// node_modules/multiformats/dist/src/hashes/identity.js
var identity_exports2 = {};
__export(identity_exports2, {
  identity: () => identity2
});

// node_modules/multiformats/dist/src/vendor/varint.js
var encode_1 = encode3;
var MSB = 128;
var REST = 127;
var MSBALL = ~REST;
var INT = Math.pow(2, 31);
function encode3(num, out, offset) {
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
  encode3.bytes = offset - oldOffset + 1;
  return out;
}
__name(encode3, "encode");
var decode3 = read;
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
var length = /* @__PURE__ */ __name(function(value) {
  return value < N1 ? 1 : value < N2 ? 2 : value < N3 ? 3 : value < N4 ? 4 : value < N5 ? 5 : value < N6 ? 6 : value < N7 ? 7 : value < N8 ? 8 : value < N9 ? 9 : 10;
}, "length");
var varint = {
  encode: encode_1,
  decode: decode3,
  encodingLength: length
};
var _brrp_varint = varint;
var varint_default = _brrp_varint;

// node_modules/multiformats/dist/src/varint.js
function decode4(data, offset = 0) {
  const code2 = varint_default.decode(data, offset);
  return [code2, varint_default.decode.bytes];
}
__name(decode4, "decode");
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
function create(code2, digest2) {
  const size = digest2.byteLength;
  const sizeOffset = encodingLength(code2);
  const digestOffset = sizeOffset + encodingLength(size);
  const bytes = new Uint8Array(digestOffset + size);
  encodeTo(code2, bytes, 0);
  encodeTo(size, bytes, sizeOffset);
  bytes.set(digest2, digestOffset);
  return new Digest(code2, size, digest2, bytes);
}
__name(create, "create");
function decode5(multihash) {
  const bytes = coerce(multihash);
  const [code2, sizeOffset] = decode4(bytes);
  const [size, digestOffset] = decode4(bytes.subarray(sizeOffset));
  const digest2 = bytes.subarray(sizeOffset + digestOffset);
  if (digest2.byteLength !== size) {
    throw new Error("Incorrect length");
  }
  return new Digest(code2, size, digest2, bytes);
}
__name(decode5, "decode");
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
  constructor(code2, size, digest2, bytes) {
    this.code = code2;
    this.size = size;
    this.digest = digest2;
    this.bytes = bytes;
  }
};

// node_modules/multiformats/dist/src/hashes/identity.js
var code = 0;
var name = "identity";
var encode4 = coerce;
function digest(input, options) {
  if (options?.truncate != null && options.truncate !== input.byteLength) {
    if (options.truncate < 0 || options.truncate > input.byteLength) {
      throw new Error(`Invalid truncate option, must be less than or equal to ${input.byteLength}`);
    }
    input = input.subarray(0, options.truncate);
  }
  return create(code, encode4(input));
}
__name(digest, "digest");
var identity2 = { code, name, encode: encode4, digest };

// node_modules/multiformats/dist/src/hashes/sha2-browser.js
var sha2_browser_exports = {};
__export(sha2_browser_exports, {
  sha256: () => sha256,
  sha512: () => sha512
});

// node_modules/multiformats/dist/src/hashes/hasher.js
var DEFAULT_MIN_DIGEST_LENGTH = 20;
function from2({ name: name2, code: code2, encode: encode5, minDigestLength, maxDigestLength }) {
  return new Hasher(name2, code2, encode5, minDigestLength, maxDigestLength);
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
  constructor(name2, code2, encode5, minDigestLength, maxDigestLength) {
    this.name = name2;
    this.code = code2;
    this.encode = encode5;
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
function createDigest(digest2, code2, truncate) {
  if (truncate != null && truncate !== digest2.byteLength) {
    if (truncate > digest2.byteLength) {
      throw new Error(`Invalid truncate option, must be less than or equal to ${digest2.byteLength}`);
    }
    digest2 = digest2.subarray(0, truncate);
  }
  return create(code2, digest2);
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

// node_modules/multiformats/dist/src/cid.js
function format(link, base4) {
  const { bytes, version } = link;
  switch (version) {
    case 0:
      return toStringV0(bytes, baseCache(link), base4 ?? base58btc.encoder);
    default:
      return toStringV1(bytes, baseCache(link), base4 ?? base32.encoder);
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
  constructor(version, code2, multihash, bytes) {
    this.code = code2;
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
        const { code: code2, multihash } = this;
        if (code2 !== DAG_PB_CODE) {
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
        const { code: code2, digest: digest2 } = this.multihash;
        const multihash = create(code2, digest2);
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
  toString(base4) {
    return format(this, base4);
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
    const value = input;
    if (value instanceof _CID) {
      return value;
    } else if (value["/"] != null && value["/"] === value.bytes || value.asCID === value) {
      const { version, code: code2, multihash, bytes } = value;
      return new _CID(version, code2, multihash, bytes ?? encodeCID(version, code2, multihash.bytes));
    } else if (value[cidSymbol] === true) {
      const { version, multihash, code: code2 } = value;
      const digest2 = decode5(multihash);
      return _CID.create(version, code2, digest2);
    } else {
      return null;
    }
  }
  /**
   * @param version - Version of the CID
   * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
   * @param digest - (Multi)hash of the of the content.
   */
  static create(version, code2, digest2) {
    if (typeof code2 !== "number") {
      throw new Error("String codecs are no longer supported");
    }
    if (!(digest2.bytes instanceof Uint8Array)) {
      throw new Error("Invalid digest");
    }
    switch (version) {
      case 0: {
        if (code2 !== DAG_PB_CODE) {
          throw new Error(`Version 0 CID must use dag-pb (code: ${DAG_PB_CODE}) block encoding`);
        } else {
          return new _CID(version, code2, digest2, digest2.bytes);
        }
      }
      case 1: {
        const bytes = encodeCID(version, code2, digest2.bytes);
        return new _CID(version, code2, digest2, bytes);
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
  static createV1(code2, digest2) {
    return _CID.create(1, code2, digest2);
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
      const [i, length2] = decode4(initialBytes.subarray(offset));
      offset += length2;
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
  static parse(source, base4) {
    const [prefix, bytes] = parseCIDtoBytes(source, base4);
    const cid = _CID.decode(bytes);
    if (cid.version === 0 && source[0] !== "Q") {
      throw Error("Version 0 CID string must not include multibase prefix");
    }
    baseCache(cid).set(prefix, source);
    return cid;
  }
};
function parseCIDtoBytes(source, base4) {
  switch (source[0]) {
    // CIDv0 is parsed differently
    case "Q": {
      const decoder = base4 ?? base58btc;
      return [
        base58btc.prefix,
        decoder.decode(`${base58btc.prefix}${source}`)
      ];
    }
    case base58btc.prefix: {
      const decoder = base4 ?? base58btc;
      return [base58btc.prefix, decoder.decode(source)];
    }
    case base32.prefix: {
      const decoder = base4 ?? base32;
      return [base32.prefix, decoder.decode(source)];
    }
    case base36.prefix: {
      const decoder = base4 ?? base36;
      return [base36.prefix, decoder.decode(source)];
    }
    default: {
      if (base4 == null) {
        throw Error("To parse non base32, base36 or base58btc encoded CID multibase decoder must be provided");
      }
      return [source[0], base4.decode(source)];
    }
  }
}
__name(parseCIDtoBytes, "parseCIDtoBytes");
function toStringV0(bytes, cache2, base4) {
  const { prefix } = base4;
  if (prefix !== base58btc.prefix) {
    throw Error(`Cannot string encode V0 in ${base4.name} encoding`);
  }
  const cid = cache2.get(prefix);
  if (cid == null) {
    const cid2 = base4.encode(bytes).slice(1);
    cache2.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
__name(toStringV0, "toStringV0");
function toStringV1(bytes, cache2, base4) {
  const { prefix } = base4;
  const cid = cache2.get(prefix);
  if (cid == null) {
    const cid2 = base4.encode(bytes);
    cache2.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
__name(toStringV1, "toStringV1");
var DAG_PB_CODE = 112;
var SHA_256_CODE = 18;
function encodeCID(version, code2, multihash) {
  const codeOffset = encodingLength(version);
  const hashOffset = codeOffset + encodingLength(code2);
  const bytes = new Uint8Array(hashOffset + multihash.byteLength);
  encodeTo(version, bytes, 0);
  encodeTo(code2, bytes, codeOffset);
  bytes.set(multihash, hashOffset);
  return bytes;
}
__name(encodeCID, "encodeCID");
var cidSymbol = Symbol.for("@ipld/js-cid/CID");

// node_modules/multiformats/dist/src/basics.js
var bases = { ...identity_exports, ...base2_exports, ...base8_exports, ...base10_exports, ...base16_exports, ...base32_exports, ...base36_exports, ...base58_exports, ...base64_exports, ...base256emoji_exports };
var hashes = { ...sha2_browser_exports, ...identity_exports2 };

// node_modules/uint8arrays/dist/src/alloc.js
function allocUnsafe(size = 0) {
  return new Uint8Array(size);
}
__name(allocUnsafe, "allocUnsafe");

// node_modules/uint8arrays/dist/src/util/bases.js
function createCodec(name2, prefix, encode5, decode7) {
  return {
    name: name2,
    prefix,
    encoder: {
      name: name2,
      prefix,
      encode: encode5
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

// node_modules/uint8arrays/dist/src/to-string.js
function toString2(array, encoding = "utf8") {
  const base4 = bases_default[encoding];
  if (base4 == null) {
    throw new Error(`Unsupported encoding "${encoding}"`);
  }
  return base4.encoder.encode(array).substring(1);
}
__name(toString2, "toString");

// node_modules/@multiformats/multiaddr/dist/src/errors.js
var InvalidMultiaddrError = class extends Error {
  static name = "InvalidMultiaddrError";
  name = "InvalidMultiaddrError";
};
var ValidationError = class extends Error {
  static name = "ValidationError";
  name = "ValidationError";
};
var InvalidParametersError = class extends Error {
  static name = "InvalidParametersError";
  name = "InvalidParametersError";
};
var UnknownProtocolError = class extends Error {
  static name = "UnknownProtocolError";
  name = "UnknownProtocolError";
};

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

// node_modules/uint8arrays/dist/src/from-string.js
function fromString2(string2, encoding = "utf8") {
  const base4 = bases_default[encoding];
  if (base4 == null) {
    throw new Error(`Unsupported encoding "${encoding}"`);
  }
  return base4.decoder.decode(`${base4.prefix}${string2}`);
}
__name(fromString2, "fromString");

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
function encodingLength2(value) {
  if (value < N12) {
    return 1;
  }
  if (value < N22) {
    return 2;
  }
  if (value < N32) {
    return 3;
  }
  if (value < N42) {
    return 4;
  }
  if (value < N52) {
    return 5;
  }
  if (value < N62) {
    return 6;
  }
  if (value < N72) {
    return 7;
  }
  if (Number.MAX_SAFE_INTEGER != null && value > Number.MAX_SAFE_INTEGER) {
    throw new RangeError("Could not encode varint");
  }
  return 8;
}
__name(encodingLength2, "encodingLength");
function encodeUint8Array(value, buf, offset = 0) {
  switch (encodingLength2(value)) {
    case 8: {
      buf[offset++] = value & 255 | MSB2;
      value /= 128;
    }
    case 7: {
      buf[offset++] = value & 255 | MSB2;
      value /= 128;
    }
    case 6: {
      buf[offset++] = value & 255 | MSB2;
      value /= 128;
    }
    case 5: {
      buf[offset++] = value & 255 | MSB2;
      value /= 128;
    }
    case 4: {
      buf[offset++] = value & 255 | MSB2;
      value >>>= 7;
    }
    case 3: {
      buf[offset++] = value & 255 | MSB2;
      value >>>= 7;
    }
    case 2: {
      buf[offset++] = value & 255 | MSB2;
      value >>>= 7;
    }
    case 1: {
      buf[offset++] = value & 255;
      value >>>= 7;
      break;
    }
    default:
      throw new Error("unreachable");
  }
  return buf;
}
__name(encodeUint8Array, "encodeUint8Array");
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
function decode6(buf, offset = 0) {
  if (buf instanceof Uint8Array) {
    return decodeUint8Array(buf, offset);
  } else {
    return decodeUint8ArrayList(buf, offset);
  }
}
__name(decode6, "decode");

// node_modules/uint8arrays/dist/src/util/as-uint8array.js
function asUint8Array(buf) {
  return buf;
}
__name(asUint8Array, "asUint8Array");

// node_modules/uint8arrays/dist/src/concat.js
function concat(arrays, length2) {
  if (length2 == null) {
    length2 = arrays.reduce((acc, curr) => acc + curr.length, 0);
  }
  const output = allocUnsafe(length2);
  let offset = 0;
  for (const arr of arrays) {
    output.set(arr, offset);
    offset += arr.length;
  }
  return asUint8Array(output);
}
__name(concat, "concat");

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
function bytesToString(base4) {
  return (buf) => {
    return toString2(buf, base4);
  };
}
__name(bytesToString, "bytesToString");
function stringToBytes(base4) {
  return (buf) => {
    return fromString2(buf, base4);
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
    const value = parseInt(byte, 10);
    if (isNaN(value) || value < 0 || value > 255) {
      throw new InvalidMultiaddrError("Invalid byte value in IP address");
    }
    bytes[index] = value;
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
var decoders = Object.values(bases).map((c) => c.decoder);
var anybaseDecoder = function() {
  let acc = decoders[0].or(decoders[1]);
  decoders.slice(2).forEach((d) => acc = acc.or(d));
  return acc;
}();
function mb2bytes(mbstr) {
  return anybaseDecoder.decode(mbstr);
}
__name(mb2bytes, "mb2bytes");
function bytes2mb(base4) {
  return (buf) => {
    return base4.encoder.encode(buf);
  };
}
__name(bytes2mb, "bytes2mb");

// node_modules/@multiformats/multiaddr/dist/src/validation.js
function integer(value) {
  const int = parseInt(value);
  if (int.toString() !== value) {
    throw new ValidationError("Value must be an integer");
  }
}
__name(integer, "integer");
function positive(value) {
  if (value < 0) {
    throw new ValidationError("Value must be a positive integer, or zero");
  }
}
__name(positive, "positive");
function maxValue(max) {
  return (value) => {
    if (value > max) {
      throw new ValidationError(`Value must be smaller than or equal to ${max}`);
    }
  };
}
__name(maxValue, "maxValue");
function validate(...funcs) {
  return (value) => {
    for (const fn of funcs) {
      fn(value);
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
  removeProtocol(code2) {
    const codec = this.protocolsByCode.get(code2);
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
  validate: /* @__PURE__ */ __name((value) => {
    if (!isIPv4(value)) {
      throw new ValidationError(`Invalid IPv4 address "${value}"`);
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
  validate: /* @__PURE__ */ __name((value) => {
    if (!isIPv6(value)) {
      throw new ValidationError(`Invalid IPv6 address "${value}"`);
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
  size: V,
  resolvable: true
}, {
  code: CODE_DNS4,
  name: "dns4",
  size: V,
  resolvable: true
}, {
  code: CODE_DNS6,
  name: "dns6",
  size: V,
  resolvable: true
}, {
  code: CODE_DNSADDR,
  name: "dnsaddr",
  size: V,
  resolvable: true
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
  path: true,
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
    const code2 = decode6(bytes, i);
    const codec = registry.getProtocol(code2);
    const codeLength = encodingLength2(code2);
    const size = sizeForAddr(codec, bytes, i + codeLength);
    let sizeLength = 0;
    if (size > 0 && codec.size === V) {
      sizeLength = encodingLength2(size);
    }
    const componentLength = codeLength + sizeLength + size;
    const component = {
      code: code2,
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
  let length2 = 0;
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
    length2 += component.bytes.byteLength;
  }
  return concat(bytes, length2);
}
__name(componentsToBytes, "componentsToBytes");
function stringToComponents(string2) {
  if (string2.charAt(0) !== "/") {
    throw new InvalidMultiaddrError('String multiaddr must start with "/"');
  }
  const components = [];
  let collecting = "protocol";
  let value = "";
  let protocol = "";
  for (let i = 1; i < string2.length; i++) {
    const char = string2.charAt(i);
    if (char !== "/") {
      if (collecting === "protocol") {
        protocol += string2.charAt(i);
      } else {
        value += string2.charAt(i);
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
          value = "";
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
          if (value === "") {
            throw new InvalidMultiaddrError(`Component ${protocol} was missing value`);
          }
          component.value = codec.stringToValue?.(value) ?? value;
        }
        components.push(component);
        value = "";
        protocol = "";
        collecting = "protocol";
      }
    }
  }
  if (protocol !== "" && value !== "") {
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
var inspect = Symbol.for("nodejs.util.inspect.custom");
var symbol = Symbol.for("@multiformats/multiaddr");
var DNS_CODES = [
  CODE_DNS,
  CODE_DNS4,
  CODE_DNS6,
  CODE_DNSADDR
];
var NoAvailableResolverError = class extends Error {
  static {
    __name(this, "NoAvailableResolverError");
  }
  constructor(message = "No available resolver") {
    super(message);
    this.name = "NoAvailableResolverError";
  }
};
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
  [symbol] = true;
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
  toOptions() {
    let family;
    let transport;
    let host;
    let port;
    let zone = "";
    for (const { code: code2, name: name2, value } of this.#components) {
      if (code2 === CODE_IP6ZONE) {
        zone = `%${value ?? ""}`;
      }
      if (DNS_CODES.includes(code2)) {
        transport = "tcp";
        port = 443;
        host = `${value ?? ""}${zone}`;
        family = code2 === CODE_DNS6 ? 6 : 4;
      }
      if (code2 === CODE_TCP || code2 === CODE_UDP) {
        transport = name2 === "tcp" ? "tcp" : "udp";
        port = parseInt(value ?? "");
      }
      if (code2 === CODE_IP4 || code2 === CODE_IP6) {
        transport = "tcp";
        host = `${value ?? ""}${zone}`;
        family = code2 === CODE_IP6 ? 6 : 4;
      }
    }
    if (family == null || transport == null || host == null || port == null) {
      throw new Error('multiaddr must have a valid format: "/{ip4, ip6, dns4, dns6, dnsaddr}/{address}/{tcp, udp}/{port}".');
    }
    const opts = {
      family,
      host,
      transport,
      port
    };
    return opts;
  }
  getComponents() {
    return [
      ...this.#components
    ];
  }
  protos() {
    return this.#components.map(({ code: code2, value }) => {
      const codec = registry.getProtocol(code2);
      return {
        code: code2,
        size: codec.size ?? 0,
        name: codec.name,
        resolvable: Boolean(codec.resolvable),
        path: Boolean(codec.path)
      };
    });
  }
  protoCodes() {
    return this.#components.map(({ code: code2 }) => code2);
  }
  protoNames() {
    return this.#components.map(({ name: name2 }) => name2);
  }
  tuples() {
    return this.#components.map(({ code: code2, value }) => {
      if (value == null) {
        return [code2];
      }
      const codec = registry.getProtocol(code2);
      const output = [code2];
      if (value != null) {
        output.push(codec.valueToBytes?.(value) ?? fromString2(value));
      }
      return output;
    });
  }
  stringTuples() {
    return this.#components.map(({ code: code2, value }) => {
      if (value == null) {
        return [code2];
      }
      return [code2, value];
    });
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
      throw new InvalidParametersError(`Address ${this.toString()} does not contain subaddress: ${addr.toString()}`);
    }
    return new _Multiaddr(s.slice(0, i), {
      validate: false
    });
  }
  decapsulateCode(code2) {
    let index;
    for (let i = this.#components.length - 1; i > -1; i--) {
      if (this.#components[i].code === code2) {
        index = i;
        break;
      }
    }
    return new _Multiaddr(this.#components.slice(0, index), {
      validate: false
    });
  }
  getPeerId() {
    try {
      let tuples = [];
      this.#components.forEach(({ code: code2, value }) => {
        if (code2 === CODE_P2P) {
          tuples.push([code2, value]);
        }
        if (code2 === CODE_P2P_CIRCUIT) {
          tuples = [];
        }
      });
      const tuple = tuples.pop();
      if (tuple?.[1] != null) {
        const peerIdStr = tuple[1];
        if (peerIdStr[0] === "Q" || peerIdStr[0] === "1") {
          return toString2(base58btc.decode(`z${peerIdStr}`), "base58btc");
        }
        return toString2(CID.parse(peerIdStr).multihash.bytes, "base58btc");
      }
      return null;
    } catch (e) {
      return null;
    }
  }
  getPath() {
    for (const component of this.#components) {
      const codec = registry.getProtocol(component.code);
      if (!codec.path) {
        continue;
      }
      return component.value ?? null;
    }
    return null;
  }
  equals(addr) {
    return equals3(this.bytes, addr.bytes);
  }
  async resolve(options) {
    const resolvableProto = this.protos().find((p) => p.resolvable);
    if (resolvableProto == null) {
      return [this];
    }
    const resolver = resolvers.get(resolvableProto.name);
    if (resolver == null) {
      throw new NoAvailableResolverError(`no available resolver for ${resolvableProto.name}`);
    }
    const result = await resolver(this, options);
    return result.map((str) => multiaddr(str));
  }
  nodeAddress() {
    const options = this.toOptions();
    if (options.transport !== "tcp" && options.transport !== "udp") {
      throw new Error(`multiaddr must have a valid format - no protocol with name: "${options.transport}". Must have a valid transport protocol: "{tcp, udp}"`);
    }
    return {
      family: options.family,
      address: options.host,
      port: options.port
    };
  }
  isThinWaistAddress() {
    if (this.#components.length !== 2) {
      return false;
    }
    if (this.#components[0].code !== CODE_IP4 && this.#components[0].code !== CODE_IP6) {
      return false;
    }
    if (this.#components[1].code !== CODE_TCP && this.#components[1].code !== CODE_UDP) {
      return false;
    }
    return true;
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
  [inspect]() {
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

// node_modules/@chainsafe/netmask/dist/src/ip.js
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

// node_modules/@multiformats/multiaddr/dist/src/index.js
var resolvers = /* @__PURE__ */ new Map();
function isMultiaddr(value) {
  return Boolean(value?.[symbol]);
}
__name(isMultiaddr, "isMultiaddr");
function multiaddr(addr) {
  return new Multiaddr(addr);
}
__name(multiaddr, "multiaddr");

// node_modules/@multiformats/mafmt/dist/src/index.js
var DNS4 = base3("dns4");
var DNS6 = base3("dns6");
var DNSADDR = base3("dnsaddr");
var DNS = or2(base3("dns"), DNSADDR, DNS4, DNS6);
var IP = or2(base3("ip4"), base3("ip6"));
var TCP = or2(and(IP, base3("tcp")), and(DNS, base3("tcp")));
var UDP = and(IP, base3("udp"));
var UTP = and(UDP, base3("utp"));
var QUIC = and(UDP, base3("quic"));
var QUICV1 = and(UDP, base3("quic-v1"));
var _WebSockets = or2(and(TCP, base3("ws")), and(DNS, base3("ws")));
var WebSockets = or2(and(_WebSockets, base3("p2p")), _WebSockets);
var _WebSocketsSecure = or2(and(TCP, base3("wss")), and(DNS, base3("wss")), and(TCP, base3("tls"), base3("ws")), and(DNS, base3("tls"), base3("ws")));
var WebSocketsSecure = or2(and(_WebSocketsSecure, base3("p2p")), _WebSocketsSecure);
var HTTP = or2(and(TCP, base3("http")), and(IP, base3("http")), and(DNS, base3("http")));
var HTTPS = or2(and(TCP, base3("https")), and(IP, base3("https")), and(DNS, base3("https")));
var _WebRTCDirect = and(UDP, base3("webrtc-direct"), base3("certhash"));
var WebRTCDirect = or2(and(_WebRTCDirect, base3("p2p")), _WebRTCDirect);
var _WebTransport = and(QUICV1, base3("webtransport"), base3("certhash"), base3("certhash"));
var WebTransport = or2(and(_WebTransport, base3("p2p")), _WebTransport);
var P2PWebRTCStar = or2(and(WebSockets, base3("p2p-webrtc-star"), base3("p2p")), and(WebSocketsSecure, base3("p2p-webrtc-star"), base3("p2p")), and(WebSockets, base3("p2p-webrtc-star")), and(WebSocketsSecure, base3("p2p-webrtc-star")));
var WebSocketStar = or2(and(WebSockets, base3("p2p-websocket-star"), base3("p2p")), and(WebSocketsSecure, base3("p2p-websocket-star"), base3("p2p")), and(WebSockets, base3("p2p-websocket-star")), and(WebSocketsSecure, base3("p2p-websocket-star")));
var P2PWebRTCDirect = or2(and(HTTP, base3("p2p-webrtc-direct"), base3("p2p")), and(HTTPS, base3("p2p-webrtc-direct"), base3("p2p")), and(HTTP, base3("p2p-webrtc-direct")), and(HTTPS, base3("p2p-webrtc-direct")));
var Reliable = or2(_WebSockets, _WebSocketsSecure, HTTP, HTTPS, P2PWebRTCStar, P2PWebRTCDirect, TCP, UTP, QUIC, DNS, WebRTCDirect, WebTransport);
var Stardust = or2(and(Reliable, base3("p2p-stardust"), base3("p2p")), and(Reliable, base3("p2p-stardust")));
var _P2P = or2(and(Reliable, base3("p2p")), P2PWebRTCStar, P2PWebRTCDirect, WebRTCDirect, WebTransport, base3("p2p"));
var _Circuit = or2(and(_P2P, base3("p2p-circuit"), _P2P), and(_P2P, base3("p2p-circuit")), and(base3("p2p-circuit"), _P2P), and(Reliable, base3("p2p-circuit")), and(base3("p2p-circuit"), Reliable), base3("p2p-circuit"));
var CircuitRecursive = /* @__PURE__ */ __name(() => or2(and(_Circuit, CircuitRecursive), _Circuit), "CircuitRecursive");
var Circuit = CircuitRecursive();
var P2P = or2(and(Circuit, _P2P, Circuit), and(_P2P, Circuit), and(Circuit, _P2P), Circuit, _P2P);
var WebRTC = or2(and(Circuit, base3("webrtc"), base3("p2p")), and(Circuit, base3("webrtc")), and(Reliable, base3("webrtc"), base3("p2p")), and(Reliable, base3("webrtc")), base3("webrtc"));
function makeMatchesFunction(partialMatch) {
  function matches(a) {
    let ma;
    try {
      ma = multiaddr(a);
    } catch (err) {
      return false;
    }
    const out = partialMatch(ma.protoNames());
    if (out === null) {
      return false;
    }
    if (out === true || out === false) {
      return out;
    }
    return out.length === 0;
  }
  __name(matches, "matches");
  return matches;
}
__name(makeMatchesFunction, "makeMatchesFunction");
function and(...args) {
  function partialMatch(a) {
    if (a.length < args.length) {
      return null;
    }
    let out = a;
    args.some((arg) => {
      out = typeof arg === "function" ? arg().partialMatch(a) : arg.partialMatch(a);
      if (Array.isArray(out)) {
        a = out;
      }
      if (out === null) {
        return true;
      }
      return false;
    });
    return out;
  }
  __name(partialMatch, "partialMatch");
  return {
    toString: /* @__PURE__ */ __name(function() {
      return "{ " + args.join(" ") + " }";
    }, "toString"),
    input: args,
    matches: makeMatchesFunction(partialMatch),
    partialMatch
  };
}
__name(and, "and");
function or2(...args) {
  function partialMatch(a) {
    let out = null;
    args.some((arg) => {
      const res = typeof arg === "function" ? arg().partialMatch(a) : arg.partialMatch(a);
      if (res != null) {
        out = res;
        return true;
      }
      return false;
    });
    return out;
  }
  __name(partialMatch, "partialMatch");
  const result = {
    toString: /* @__PURE__ */ __name(function() {
      return "{ " + args.join(" ") + " }";
    }, "toString"),
    input: args,
    matches: makeMatchesFunction(partialMatch),
    partialMatch
  };
  return result;
}
__name(or2, "or");
function base3(n) {
  const name2 = n;
  function matches(a) {
    let ma;
    try {
      ma = multiaddr(a);
    } catch (err) {
      return false;
    }
    const pnames = ma.protoNames();
    if (pnames.length === 1 && pnames[0] === name2) {
      return true;
    }
    return false;
  }
  __name(matches, "matches");
  function partialMatch(protos) {
    if (protos.length === 0) {
      return null;
    }
    if (protos[0] === name2) {
      return protos.slice(1);
    }
    return null;
  }
  __name(partialMatch, "partialMatch");
  return {
    toString: /* @__PURE__ */ __name(function() {
      return name2;
    }, "toString"),
    matches,
    partialMatch
  };
}
__name(base3, "base");

// node_modules/@libp2p/websockets/dist/src/constants.js
var CODE_P2P2 = 421;
var CODE_CIRCUIT = 290;
var CODE_TCP2 = 6;
var CODE_WS2 = 477;
var CODE_WSS2 = 478;

// node_modules/@libp2p/websockets/dist/src/filters.js
function all(multiaddrs) {
  return multiaddrs.filter((ma) => {
    if (ma.protoCodes().includes(CODE_CIRCUIT)) {
      return false;
    }
    const testMa = ma.decapsulateCode(CODE_P2P2);
    return WebSockets.matches(testMa) || WebSocketsSecure.matches(testMa);
  });
}
__name(all, "all");
function wss(multiaddrs) {
  return multiaddrs.filter((ma) => {
    if (ma.protoCodes().includes(CODE_CIRCUIT)) {
      return false;
    }
    const testMa = ma.decapsulateCode(CODE_P2P2);
    return WebSocketsSecure.matches(testMa);
  });
}
__name(wss, "wss");
function dnsWss(multiaddrs) {
  return multiaddrs.filter((ma) => {
    if (ma.protoCodes().includes(CODE_CIRCUIT)) {
      return false;
    }
    const testMa = ma.decapsulateCode(CODE_P2P2);
    return WebSocketsSecure.matches(testMa) && DNS.matches(testMa.decapsulateCode(CODE_TCP2).decapsulateCode(CODE_WSS2));
  });
}
__name(dnsWss, "dnsWss");
function dnsWsOrWss(multiaddrs) {
  return multiaddrs.filter((ma) => {
    if (ma.protoCodes().includes(CODE_CIRCUIT)) {
      return false;
    }
    const testMa = ma.decapsulateCode(CODE_P2P2);
    if (WebSockets.matches(testMa)) {
      return DNS.matches(testMa.decapsulateCode(CODE_TCP2).decapsulateCode(CODE_WS2));
    }
    return WebSocketsSecure.matches(testMa) && DNS.matches(testMa.decapsulateCode(CODE_TCP2).decapsulateCode(CODE_WSS2));
  });
}
__name(dnsWsOrWss, "dnsWsOrWss");
export {
  all,
  dnsWsOrWss,
  dnsWss,
  wss
};
//# sourceMappingURL=lib-filters.js.map
