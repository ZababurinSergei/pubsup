var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
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

// node_modules/denque/index.js
var require_denque = __commonJS({
  "node_modules/denque/index.js"(exports, module) {
    "use strict";
    function Denque2(array, options) {
      var options = options || {};
      this._capacity = options.capacity;
      this._head = 0;
      this._tail = 0;
      if (Array.isArray(array)) {
        this._fromArray(array);
      } else {
        this._capacityMask = 3;
        this._list = new Array(4);
      }
    }
    __name(Denque2, "Denque");
    Denque2.prototype.peekAt = /* @__PURE__ */ __name(function peekAt(index) {
      var i = index;
      if (i !== (i | 0)) {
        return void 0;
      }
      var len = this.size();
      if (i >= len || i < -len) return void 0;
      if (i < 0) i += len;
      i = this._head + i & this._capacityMask;
      return this._list[i];
    }, "peekAt");
    Denque2.prototype.get = /* @__PURE__ */ __name(function get(i) {
      return this.peekAt(i);
    }, "get");
    Denque2.prototype.peek = /* @__PURE__ */ __name(function peek() {
      if (this._head === this._tail) return void 0;
      return this._list[this._head];
    }, "peek");
    Denque2.prototype.peekFront = /* @__PURE__ */ __name(function peekFront() {
      return this.peek();
    }, "peekFront");
    Denque2.prototype.peekBack = /* @__PURE__ */ __name(function peekBack() {
      return this.peekAt(-1);
    }, "peekBack");
    Object.defineProperty(Denque2.prototype, "length", {
      get: /* @__PURE__ */ __name(function length3() {
        return this.size();
      }, "length")
    });
    Denque2.prototype.size = /* @__PURE__ */ __name(function size() {
      if (this._head === this._tail) return 0;
      if (this._head < this._tail) return this._tail - this._head;
      else return this._capacityMask + 1 - (this._head - this._tail);
    }, "size");
    Denque2.prototype.unshift = /* @__PURE__ */ __name(function unshift(item) {
      if (arguments.length === 0) return this.size();
      var len = this._list.length;
      this._head = this._head - 1 + len & this._capacityMask;
      this._list[this._head] = item;
      if (this._tail === this._head) this._growArray();
      if (this._capacity && this.size() > this._capacity) this.pop();
      if (this._head < this._tail) return this._tail - this._head;
      else return this._capacityMask + 1 - (this._head - this._tail);
    }, "unshift");
    Denque2.prototype.shift = /* @__PURE__ */ __name(function shift() {
      var head = this._head;
      if (head === this._tail) return void 0;
      var item = this._list[head];
      this._list[head] = void 0;
      this._head = head + 1 & this._capacityMask;
      if (head < 2 && this._tail > 1e4 && this._tail <= this._list.length >>> 2) this._shrinkArray();
      return item;
    }, "shift");
    Denque2.prototype.push = /* @__PURE__ */ __name(function push(item) {
      if (arguments.length === 0) return this.size();
      var tail = this._tail;
      this._list[tail] = item;
      this._tail = tail + 1 & this._capacityMask;
      if (this._tail === this._head) {
        this._growArray();
      }
      if (this._capacity && this.size() > this._capacity) {
        this.shift();
      }
      if (this._head < this._tail) return this._tail - this._head;
      else return this._capacityMask + 1 - (this._head - this._tail);
    }, "push");
    Denque2.prototype.pop = /* @__PURE__ */ __name(function pop() {
      var tail = this._tail;
      if (tail === this._head) return void 0;
      var len = this._list.length;
      this._tail = tail - 1 + len & this._capacityMask;
      var item = this._list[this._tail];
      this._list[this._tail] = void 0;
      if (this._head < 2 && tail > 1e4 && tail <= len >>> 2) this._shrinkArray();
      return item;
    }, "pop");
    Denque2.prototype.removeOne = /* @__PURE__ */ __name(function removeOne(index) {
      var i = index;
      if (i !== (i | 0)) {
        return void 0;
      }
      if (this._head === this._tail) return void 0;
      var size = this.size();
      var len = this._list.length;
      if (i >= size || i < -size) return void 0;
      if (i < 0) i += size;
      i = this._head + i & this._capacityMask;
      var item = this._list[i];
      var k;
      if (index < size / 2) {
        for (k = index; k > 0; k--) {
          this._list[i] = this._list[i = i - 1 + len & this._capacityMask];
        }
        this._list[i] = void 0;
        this._head = this._head + 1 + len & this._capacityMask;
      } else {
        for (k = size - 1 - index; k > 0; k--) {
          this._list[i] = this._list[i = i + 1 + len & this._capacityMask];
        }
        this._list[i] = void 0;
        this._tail = this._tail - 1 + len & this._capacityMask;
      }
      return item;
    }, "removeOne");
    Denque2.prototype.remove = /* @__PURE__ */ __name(function remove(index, count) {
      var i = index;
      var removed;
      var del_count = count;
      if (i !== (i | 0)) {
        return void 0;
      }
      if (this._head === this._tail) return void 0;
      var size = this.size();
      var len = this._list.length;
      if (i >= size || i < -size || count < 1) return void 0;
      if (i < 0) i += size;
      if (count === 1 || !count) {
        removed = new Array(1);
        removed[0] = this.removeOne(i);
        return removed;
      }
      if (i === 0 && i + count >= size) {
        removed = this.toArray();
        this.clear();
        return removed;
      }
      if (i + count > size) count = size - i;
      var k;
      removed = new Array(count);
      for (k = 0; k < count; k++) {
        removed[k] = this._list[this._head + i + k & this._capacityMask];
      }
      i = this._head + i & this._capacityMask;
      if (index + count === size) {
        this._tail = this._tail - count + len & this._capacityMask;
        for (k = count; k > 0; k--) {
          this._list[i = i + 1 + len & this._capacityMask] = void 0;
        }
        return removed;
      }
      if (index === 0) {
        this._head = this._head + count + len & this._capacityMask;
        for (k = count - 1; k > 0; k--) {
          this._list[i = i + 1 + len & this._capacityMask] = void 0;
        }
        return removed;
      }
      if (i < size / 2) {
        this._head = this._head + index + count + len & this._capacityMask;
        for (k = index; k > 0; k--) {
          this.unshift(this._list[i = i - 1 + len & this._capacityMask]);
        }
        i = this._head - 1 + len & this._capacityMask;
        while (del_count > 0) {
          this._list[i = i - 1 + len & this._capacityMask] = void 0;
          del_count--;
        }
        if (index < 0) this._tail = i;
      } else {
        this._tail = i;
        i = i + count + len & this._capacityMask;
        for (k = size - (count + index); k > 0; k--) {
          this.push(this._list[i++]);
        }
        i = this._tail;
        while (del_count > 0) {
          this._list[i = i + 1 + len & this._capacityMask] = void 0;
          del_count--;
        }
      }
      if (this._head < 2 && this._tail > 1e4 && this._tail <= len >>> 2) this._shrinkArray();
      return removed;
    }, "remove");
    Denque2.prototype.splice = /* @__PURE__ */ __name(function splice(index, count) {
      var i = index;
      if (i !== (i | 0)) {
        return void 0;
      }
      var size = this.size();
      if (i < 0) i += size;
      if (i > size) return void 0;
      if (arguments.length > 2) {
        var k;
        var temp;
        var removed;
        var arg_len = arguments.length;
        var len = this._list.length;
        var arguments_index = 2;
        if (!size || i < size / 2) {
          temp = new Array(i);
          for (k = 0; k < i; k++) {
            temp[k] = this._list[this._head + k & this._capacityMask];
          }
          if (count === 0) {
            removed = [];
            if (i > 0) {
              this._head = this._head + i + len & this._capacityMask;
            }
          } else {
            removed = this.remove(i, count);
            this._head = this._head + i + len & this._capacityMask;
          }
          while (arg_len > arguments_index) {
            this.unshift(arguments[--arg_len]);
          }
          for (k = i; k > 0; k--) {
            this.unshift(temp[k - 1]);
          }
        } else {
          temp = new Array(size - (i + count));
          var leng = temp.length;
          for (k = 0; k < leng; k++) {
            temp[k] = this._list[this._head + i + count + k & this._capacityMask];
          }
          if (count === 0) {
            removed = [];
            if (i != size) {
              this._tail = this._head + i + len & this._capacityMask;
            }
          } else {
            removed = this.remove(i, count);
            this._tail = this._tail - leng + len & this._capacityMask;
          }
          while (arguments_index < arg_len) {
            this.push(arguments[arguments_index++]);
          }
          for (k = 0; k < leng; k++) {
            this.push(temp[k]);
          }
        }
        return removed;
      } else {
        return this.remove(i, count);
      }
    }, "splice");
    Denque2.prototype.clear = /* @__PURE__ */ __name(function clear() {
      this._list = new Array(this._list.length);
      this._head = 0;
      this._tail = 0;
    }, "clear");
    Denque2.prototype.isEmpty = /* @__PURE__ */ __name(function isEmpty() {
      return this._head === this._tail;
    }, "isEmpty");
    Denque2.prototype.toArray = /* @__PURE__ */ __name(function toArray() {
      return this._copyArray(false);
    }, "toArray");
    Denque2.prototype._fromArray = /* @__PURE__ */ __name(function _fromArray(array) {
      var length3 = array.length;
      var capacity = this._nextPowerOf2(length3);
      this._list = new Array(capacity);
      this._capacityMask = capacity - 1;
      this._tail = length3;
      for (var i = 0; i < length3; i++) this._list[i] = array[i];
    }, "_fromArray");
    Denque2.prototype._copyArray = /* @__PURE__ */ __name(function _copyArray(fullCopy, size) {
      var src2 = this._list;
      var capacity = src2.length;
      var length3 = this.length;
      size = size | length3;
      if (size == length3 && this._head < this._tail) {
        return this._list.slice(this._head, this._tail);
      }
      var dest = new Array(size);
      var k = 0;
      var i;
      if (fullCopy || this._head > this._tail) {
        for (i = this._head; i < capacity; i++) dest[k++] = src2[i];
        for (i = 0; i < this._tail; i++) dest[k++] = src2[i];
      } else {
        for (i = this._head; i < this._tail; i++) dest[k++] = src2[i];
      }
      return dest;
    }, "_copyArray");
    Denque2.prototype._growArray = /* @__PURE__ */ __name(function _growArray() {
      if (this._head != 0) {
        var newList = this._copyArray(true, this._list.length << 1);
        this._tail = this._list.length;
        this._head = 0;
        this._list = newList;
      } else {
        this._tail = this._list.length;
        this._list.length <<= 1;
      }
      this._capacityMask = this._capacityMask << 1 | 1;
    }, "_growArray");
    Denque2.prototype._shrinkArray = /* @__PURE__ */ __name(function _shrinkArray() {
      this._list.length >>>= 1;
      this._capacityMask >>>= 1;
    }, "_shrinkArray");
    Denque2.prototype._nextPowerOf2 = /* @__PURE__ */ __name(function _nextPowerOf2(num) {
      var log2 = Math.log(num) / Math.log(2);
      var nextPow2 = 1 << log2 + 1;
      return Math.max(nextPow2, 4);
    }, "_nextPowerOf2");
    module.exports = Denque2;
  }
});

// node_modules/@chainsafe/libp2p-gossipsub/node_modules/@libp2p/interface/dist/src/peer-id.js
var peerIdSymbol = Symbol.for("@libp2p/peer-id");

// node_modules/@chainsafe/libp2p-gossipsub/node_modules/@libp2p/interface/dist/src/pubsub.js
var StrictSign = "StrictSign";
var StrictNoSign = "StrictNoSign";
var TopicValidatorResult;
(function(TopicValidatorResult2) {
  TopicValidatorResult2["Accept"] = "accept";
  TopicValidatorResult2["Ignore"] = "ignore";
  TopicValidatorResult2["Reject"] = "reject";
})(TopicValidatorResult || (TopicValidatorResult = {}));
var pubSubSymbol = Symbol.for("@libp2p/pubsub");

// node_modules/@chainsafe/libp2p-gossipsub/node_modules/@libp2p/interface/dist/src/errors.js
var InvalidParametersError = class extends Error {
  static name = "InvalidParametersError";
  constructor(message2 = "Invalid parameters") {
    super(message2);
    this.name = "InvalidParametersError";
  }
};
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

// node_modules/main-event/dist/src/events.browser.js
function setMaxListeners() {
}
__name(setMaxListeners, "setMaxListeners");

// node_modules/main-event/dist/src/index.js
var TypedEventEmitter = class extends EventTarget {
  static {
    __name(this, "TypedEventEmitter");
  }
  #listeners = /* @__PURE__ */ new Map();
  constructor() {
    super();
    setMaxListeners(Infinity, this);
  }
  listenerCount(type) {
    const listeners = this.#listeners.get(type);
    if (listeners == null) {
      return 0;
    }
    return listeners.length;
  }
  addEventListener(type, listener, options) {
    super.addEventListener(type, listener, options);
    let list = this.#listeners.get(type);
    if (list == null) {
      list = [];
      this.#listeners.set(type, list);
    }
    list.push({
      callback: listener,
      once: (options !== true && options !== false && options?.once) ?? false
    });
  }
  removeEventListener(type, listener, options) {
    super.removeEventListener(type.toString(), listener ?? null, options);
    let list = this.#listeners.get(type);
    if (list == null) {
      return;
    }
    list = list.filter(({ callback }) => callback !== listener);
    this.#listeners.set(type, list);
  }
  dispatchEvent(event) {
    const result = super.dispatchEvent(event);
    let list = this.#listeners.get(event.type);
    if (list == null) {
      return result;
    }
    list = list.filter(({ once }) => !once);
    this.#listeners.set(event.type, list);
    return result;
  }
  safeDispatchEvent(type, detail = {}) {
    return this.dispatchEvent(new CustomEvent(type, detail));
  }
};

// node_modules/@chainsafe/libp2p-gossipsub/node_modules/@libp2p/interface/dist/src/index.js
var serviceCapabilities = Symbol.for("@libp2p/service-capabilities");
var serviceDependencies = Symbol.for("@libp2p/service-dependencies");

// node_modules/@libp2p/crypto/node_modules/@libp2p/interface/dist/src/errors.js
var InvalidParametersError2 = class extends Error {
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
  function encode7(source) {
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
  __name(encode7, "encode");
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
  function decode8(string2) {
    var buffer = decodeUnsafe(string2);
    if (buffer) {
      return buffer;
    }
    throw new Error(`Non-${name2} character`);
  }
  __name(decode8, "decode");
  return {
    encode: encode7,
    decodeUnsafe,
    decode: decode8
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
function from({ name: name2, prefix, encode: encode7, decode: decode8 }) {
  return new Codec(name2, prefix, encode7, decode8);
}
__name(from, "from");
function baseX({ name: name2, prefix, alphabet: alphabet2 }) {
  const { encode: encode7, decode: decode8 } = base_x_default(alphabet2, name2);
  return from({
    prefix,
    name: name2,
    encode: encode7,
    decode: /* @__PURE__ */ __name((text) => coerce(decode8(text)), "decode")
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
var length = /* @__PURE__ */ __name(function(value) {
  return value < N1 ? 1 : value < N2 ? 2 : value < N3 ? 3 : value < N4 ? 4 : value < N5 ? 5 : value < N6 ? 6 : value < N7 ? 7 : value < N8 ? 8 : value < N9 ? 9 : 10;
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
  const code2 = varint_default.decode(data, offset);
  return [code2, varint_default.decode.bytes];
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
function decode4(multihash) {
  const bytes = coerce(multihash);
  const [code2, sizeOffset] = decode3(bytes);
  const [size, digestOffset] = decode3(bytes.subarray(sizeOffset));
  const digest2 = bytes.subarray(sizeOffset + digestOffset);
  if (digest2.byteLength !== size) {
    throw new Error("Incorrect length");
  }
  return new Digest(code2, size, digest2, bytes);
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
  constructor(code2, size, digest2, bytes) {
    this.code = code2;
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
    const value = input;
    if (value instanceof _CID) {
      return value;
    } else if (value["/"] != null && value["/"] === value.bytes || value.asCID === value) {
      const { version, code: code2, multihash, bytes } = value;
      return new _CID(version, code2, multihash, bytes ?? encodeCID(version, code2, multihash.bytes));
    } else if (value[cidSymbol] === true) {
      const { version, multihash, code: code2 } = value;
      const digest2 = decode4(multihash);
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
function isUint8ArrayList(value) {
  return Boolean(value?.[symbol]);
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
  set(index, value) {
    const res = findBufAndOffset(this.bufs, index);
    res.buf[res.index] = value;
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
  setInt8(byteOffset, value) {
    const buf = allocUnsafe(1);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    view.setInt8(0, value);
    this.write(buf, byteOffset);
  }
  getInt16(byteOffset, littleEndian) {
    const buf = this.subarray(byteOffset, byteOffset + 2);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    return view.getInt16(0, littleEndian);
  }
  setInt16(byteOffset, value, littleEndian) {
    const buf = alloc(2);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    view.setInt16(0, value, littleEndian);
    this.write(buf, byteOffset);
  }
  getInt32(byteOffset, littleEndian) {
    const buf = this.subarray(byteOffset, byteOffset + 4);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    return view.getInt32(0, littleEndian);
  }
  setInt32(byteOffset, value, littleEndian) {
    const buf = alloc(4);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    view.setInt32(0, value, littleEndian);
    this.write(buf, byteOffset);
  }
  getBigInt64(byteOffset, littleEndian) {
    const buf = this.subarray(byteOffset, byteOffset + 8);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    return view.getBigInt64(0, littleEndian);
  }
  setBigInt64(byteOffset, value, littleEndian) {
    const buf = alloc(8);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    view.setBigInt64(0, value, littleEndian);
    this.write(buf, byteOffset);
  }
  getUint8(byteOffset) {
    const buf = this.subarray(byteOffset, byteOffset + 1);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    return view.getUint8(0);
  }
  setUint8(byteOffset, value) {
    const buf = allocUnsafe(1);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    view.setUint8(0, value);
    this.write(buf, byteOffset);
  }
  getUint16(byteOffset, littleEndian) {
    const buf = this.subarray(byteOffset, byteOffset + 2);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    return view.getUint16(0, littleEndian);
  }
  setUint16(byteOffset, value, littleEndian) {
    const buf = alloc(2);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    view.setUint16(0, value, littleEndian);
    this.write(buf, byteOffset);
  }
  getUint32(byteOffset, littleEndian) {
    const buf = this.subarray(byteOffset, byteOffset + 4);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    return view.getUint32(0, littleEndian);
  }
  setUint32(byteOffset, value, littleEndian) {
    const buf = alloc(4);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    view.setUint32(0, value, littleEndian);
    this.write(buf, byteOffset);
  }
  getBigUint64(byteOffset, littleEndian) {
    const buf = this.subarray(byteOffset, byteOffset + 8);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    return view.getBigUint64(0, littleEndian);
  }
  setBigUint64(byteOffset, value, littleEndian) {
    const buf = alloc(8);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    view.setBigUint64(0, value, littleEndian);
    this.write(buf, byteOffset);
  }
  getFloat32(byteOffset, littleEndian) {
    const buf = this.subarray(byteOffset, byteOffset + 4);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    return view.getFloat32(0, littleEndian);
  }
  setFloat32(byteOffset, value, littleEndian) {
    const buf = alloc(4);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    view.setFloat32(0, value, littleEndian);
    this.write(buf, byteOffset);
  }
  getFloat64(byteOffset, littleEndian) {
    const buf = this.subarray(byteOffset, byteOffset + 8);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    return view.getFloat64(0, littleEndian);
  }
  setFloat64(byteOffset, value, littleEndian) {
    const buf = alloc(8);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    view.setFloat64(0, value, littleEndian);
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
function from2({ name: name2, code: code2, encode: encode7, minDigestLength, maxDigestLength }) {
  return new Hasher(name2, code2, encode7, minDigestLength, maxDigestLength);
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
  constructor(name2, code2, encode7, minDigestLength, maxDigestLength) {
    this.name = name2;
    this.code = code2;
    this.encode = encode7;
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

// node_modules/multiformats/dist/src/basics.js
var bases = { ...identity_exports2, ...base2_exports, ...base8_exports, ...base10_exports, ...base16_exports, ...base32_exports, ...base36_exports, ...base58_exports, ...base64_exports, ...base256emoji_exports };
var hashes = { ...sha2_browser_exports, ...identity_exports };

// node_modules/uint8arrays/dist/src/util/bases.js
function createCodec(name2, prefix, encode7, decode8) {
  return {
    name: name2,
    prefix,
    encoder: {
      name: name2,
      prefix,
      encode: encode7
    },
    decoder: {
      decode: decode8
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
function encodeNumber(value) {
  let number = value.toString(16);
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
function encodeInteger(value) {
  const contents = new Uint8ArrayList();
  const mask = 128;
  const positive2 = (value.subarray()[0] & mask) === mask;
  if (positive2) {
    contents.append(Uint8Array.from([0]));
  }
  contents.append(value);
  return new Uint8ArrayList(Uint8Array.from([2]), encodeLength(contents), contents);
}
__name(encodeInteger, "encodeInteger");
function encodeBitString(value) {
  const unusedBits = Uint8Array.from([0]);
  const contents = new Uint8ArrayList(unusedBits, value);
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
  throw new InvalidParametersError2(`coordinates were wrong length, got ${coordinates.byteLength}, expected 65, 97 or 133`);
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
  throw new InvalidParametersError2(`Invalid curve ${curve}`);
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
function abytes(value, length3, title = "") {
  const bytes = isBytes(value);
  const len = value?.length;
  const needsLen = length3 !== void 0;
  if (!bytes || needsLen && len !== length3) {
    const prefix = title && `"${title}" `;
    const ofLen = needsLen ? ` of length ${length3}` : "";
    const got = bytes ? `length=${len}` : `type=${typeof value}`;
    throw new Error(prefix + "expected Uint8Array" + ofLen + ", got " + got);
  }
  return value;
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
function abool(value, title = "") {
  if (typeof value !== "boolean") {
    const prefix = title && `"${title}" `;
    throw new Error(prefix + "expected boolean, got type=" + typeof value);
  }
  return value;
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
      let { isValid, value: x } = uvRatio2(u, v);
      if (!isValid)
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
  const randomBytes3 = eddsaOpts.randomBytes || randomBytes;
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
  function randomSecretKey(seed = randomBytes3(lengths.seed)) {
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
    const isValid = await webcrypto_default.get().subtle.verify({ name: "Ed25519" }, key, sig, msg instanceof Uint8Array ? msg : msg.subarray());
    return isValid;
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
    throw new InvalidParametersError2(`Key must be a Uint8Array of length ${length3}, got ${key.length}`);
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
function encodeUint8ArrayList(value, buf, offset = 0) {
  switch (encodingLength2(value)) {
    case 8: {
      buf.set(offset++, value & 255 | MSB2);
      value /= 128;
    }
    case 7: {
      buf.set(offset++, value & 255 | MSB2);
      value /= 128;
    }
    case 6: {
      buf.set(offset++, value & 255 | MSB2);
      value /= 128;
    }
    case 5: {
      buf.set(offset++, value & 255 | MSB2);
      value /= 128;
    }
    case 4: {
      buf.set(offset++, value & 255 | MSB2);
      value >>>= 7;
    }
    case 3: {
      buf.set(offset++, value & 255 | MSB2);
      value >>>= 7;
    }
    case 2: {
      buf.set(offset++, value & 255 | MSB2);
      value >>>= 7;
    }
    case 1: {
      buf.set(offset++, value & 255);
      value >>>= 7;
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
function encode5(value, buf, offset = 0) {
  if (buf == null) {
    buf = allocUnsafe(encodingLength2(value));
  }
  if (buf instanceof Uint8Array) {
    return encodeUint8Array(value, buf, offset);
  } else {
    return encodeUint8ArrayList(value, buf, offset);
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
  static fromBigInt(value) {
    if (value === 0n) {
      return zero;
    }
    if (value < MAX_SAFE_NUMBER_INTEGER && value > MIN_SAFE_NUMBER_INTEGER) {
      return this.fromNumber(Number(value));
    }
    const negative = value < 0n;
    if (negative) {
      value = -value;
    }
    let hi = value >> 32n;
    let lo = value - (hi << 32n);
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
  static fromNumber(value) {
    if (value === 0) {
      return zero;
    }
    const sign = value < 0;
    if (sign) {
      value = -value;
    }
    let lo = value >>> 0;
    let hi = (value - lo) / 4294967296 >>> 0;
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
  static from(value) {
    if (typeof value === "number") {
      return _LongBits.fromNumber(value);
    }
    if (typeof value === "bigint") {
      return _LongBits.fromBigInt(value);
    }
    if (typeof value === "string") {
      return _LongBits.fromBigInt(BigInt(value));
    }
    return value.low != null || value.high != null ? new _LongBits(value.low >>> 0, value.high >>> 0) : zero;
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
    let value = 4294967295;
    value = (this.buf[this.pos] & 127) >>> 0;
    if (this.buf[this.pos++] < 128) {
      return value;
    }
    value = (value | (this.buf[this.pos] & 127) << 7) >>> 0;
    if (this.buf[this.pos++] < 128) {
      return value;
    }
    value = (value | (this.buf[this.pos] & 127) << 14) >>> 0;
    if (this.buf[this.pos++] < 128) {
      return value;
    }
    value = (value | (this.buf[this.pos] & 127) << 21) >>> 0;
    if (this.buf[this.pos++] < 128) {
      return value;
    }
    value = (value | (this.buf[this.pos] & 15) << 28) >>> 0;
    if (this.buf[this.pos++] < 128) {
      return value;
    }
    if ((this.pos += 5) > this.len) {
      this.pos = this.len;
      throw indexOutOfRange(this, 10);
    }
    return value;
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
    const value = this.uint32();
    return value >>> 1 ^ -(value & 1) | 0;
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
    const value = readFloatLE(this.buf, this.pos);
    this.pos += 4;
    return value;
  }
  /**
   * Reads a double (64 bit float) as a number
   */
  double() {
    if (this.pos + 8 > this.len) {
      throw indexOutOfRange(this, 4);
    }
    const value = readDoubleLE(this.buf, this.pos);
    this.pos += 8;
    return value;
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
    const value = decodeUint8Array(this.buf, this.pos);
    this.pos += encodingLength2(value);
    return value;
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
  uint32(value) {
    this.len += (this.tail = this.tail.next = new VarintOp((value = value >>> 0) < 128 ? 1 : value < 16384 ? 2 : value < 2097152 ? 3 : value < 268435456 ? 4 : 5, value)).len;
    return this;
  }
  /**
   * Writes a signed 32 bit value as a varint`
   */
  int32(value) {
    return value < 0 ? this._push(writeVarint64, 10, LongBits.fromNumber(value)) : this.uint32(value);
  }
  /**
   * Writes a 32 bit value as a varint, zig-zag encoded
   */
  sint32(value) {
    return this.uint32((value << 1 ^ value >> 31) >>> 0);
  }
  /**
   * Writes an unsigned 64 bit value as a varint
   */
  uint64(value) {
    const bits = LongBits.fromBigInt(value);
    return this._push(writeVarint64, bits.length(), bits);
  }
  /**
   * Writes an unsigned 64 bit value as a varint
   */
  uint64Number(value) {
    return this._push(encodeUint8Array, encodingLength2(value), value);
  }
  /**
   * Writes an unsigned 64 bit value as a varint
   */
  uint64String(value) {
    return this.uint64(BigInt(value));
  }
  /**
   * Writes a signed 64 bit value as a varint
   */
  int64(value) {
    return this.uint64(value);
  }
  /**
   * Writes a signed 64 bit value as a varint
   */
  int64Number(value) {
    return this.uint64Number(value);
  }
  /**
   * Writes a signed 64 bit value as a varint
   */
  int64String(value) {
    return this.uint64String(value);
  }
  /**
   * Writes a signed 64 bit value as a varint, zig-zag encoded
   */
  sint64(value) {
    const bits = LongBits.fromBigInt(value).zzEncode();
    return this._push(writeVarint64, bits.length(), bits);
  }
  /**
   * Writes a signed 64 bit value as a varint, zig-zag encoded
   */
  sint64Number(value) {
    const bits = LongBits.fromNumber(value).zzEncode();
    return this._push(writeVarint64, bits.length(), bits);
  }
  /**
   * Writes a signed 64 bit value as a varint, zig-zag encoded
   */
  sint64String(value) {
    return this.sint64(BigInt(value));
  }
  /**
   * Writes a boolish value as a varint
   */
  bool(value) {
    return this._push(writeByte, 1, value ? 1 : 0);
  }
  /**
   * Writes an unsigned 32 bit value as fixed 32 bits
   */
  fixed32(value) {
    return this._push(writeFixed32, 4, value >>> 0);
  }
  /**
   * Writes a signed 32 bit value as fixed 32 bits
   */
  sfixed32(value) {
    return this.fixed32(value);
  }
  /**
   * Writes an unsigned 64 bit value as fixed 64 bits
   */
  fixed64(value) {
    const bits = LongBits.fromBigInt(value);
    return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
  }
  /**
   * Writes an unsigned 64 bit value as fixed 64 bits
   */
  fixed64Number(value) {
    const bits = LongBits.fromNumber(value);
    return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
  }
  /**
   * Writes an unsigned 64 bit value as fixed 64 bits
   */
  fixed64String(value) {
    return this.fixed64(BigInt(value));
  }
  /**
   * Writes a signed 64 bit value as fixed 64 bits
   */
  sfixed64(value) {
    return this.fixed64(value);
  }
  /**
   * Writes a signed 64 bit value as fixed 64 bits
   */
  sfixed64Number(value) {
    return this.fixed64Number(value);
  }
  /**
   * Writes a signed 64 bit value as fixed 64 bits
   */
  sfixed64String(value) {
    return this.fixed64String(value);
  }
  /**
   * Writes a float (32 bit)
   */
  float(value) {
    return this._push(writeFloatLE, 4, value);
  }
  /**
   * Writes a double (64 bit float).
   *
   * @function
   * @param {number} value - Value to write
   * @returns {Writer} `this`
   */
  double(value) {
    return this._push(writeDoubleLE, 8, value);
  }
  /**
   * Writes a sequence of bytes
   */
  bytes(value) {
    const len = value.length >>> 0;
    if (len === 0) {
      return this._push(writeByte, 1, 0);
    }
    return this.uint32(len)._push(writeBytes, len, value);
  }
  /**
   * Writes a string
   */
  string(value) {
    const len = length2(value);
    return len !== 0 ? this.uint32(len)._push(write, len, value) : this._push(writeByte, 1, 0);
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
  Uint8ArrayWriter.prototype.bytes = function(value) {
    const len = value.length >>> 0;
    this.uint32(len);
    if (len > 0) {
      this._push(writeBytesBuffer, len, value);
    }
    return this;
  };
  Uint8ArrayWriter.prototype.string = function(value) {
    const len = globalThis.Buffer.byteLength(value);
    this.uint32(len);
    if (len > 0) {
      this._push(writeStringBuffer, len, value);
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
function createCodec2(name2, type, encode7, decode8) {
  return {
    name: name2,
    type,
    encode: encode7,
    decode: decode8
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
  const encode7 = /* @__PURE__ */ __name(function enumEncode(val, writer) {
    const enumValue = findValue(val);
    writer.int32(enumValue);
  }, "enumEncode");
  const decode8 = /* @__PURE__ */ __name(function enumDecode(reader) {
    const val = reader.int32();
    return findValue(val);
  }, "enumDecode");
  return createCodec2("enum", CODEC_TYPES.VARINT, encode7, decode8);
}
__name(enumeration, "enumeration");

// node_modules/protons-runtime/dist/src/codecs/message.js
function message(encode7, decode8) {
  return createCodec2("message", CODEC_TYPES.LENGTH_DELIMITED, encode7, decode8);
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

// node_modules/@libp2p/crypto/dist/src/random-bytes.js
function randomBytes2(length3) {
  if (isNaN(length3) || length3 <= 0) {
    throw new InvalidParametersError2("random bytes length must be a Number bigger than 0");
  }
  return randomBytes(length3);
}
__name(randomBytes2, "randomBytes");

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
    throw new InvalidParametersError2("JWK was missing components");
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
    throw new InvalidParametersError2("JWK was missing components");
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
    throw new InvalidParametersError2("Key size is too large");
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
    throw new InvalidParametersError2("Key size is too large");
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
    throw new InvalidParametersError2("Missing key parameter");
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
    throw new InvalidParametersError2("Private and public key are required");
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
    throw new InvalidParametersError2("invalid key type");
  } else if (jwk.n == null) {
    throw new InvalidParametersError2("invalid key modulus");
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
  const randomBytes3 = ecdsaOpts.randomBytes || randomBytes;
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
      const e = extraEntropy === true ? randomBytes3(lengths.secretKey) : extraEntropy;
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

// node_modules/@chainsafe/libp2p-gossipsub/node_modules/@libp2p/peer-id/dist/src/peer-id.js
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

// node_modules/@chainsafe/libp2p-gossipsub/node_modules/@libp2p/peer-id/dist/src/index.js
var LIBP2P_KEY_CODE2 = 114;
var TRANSPORT_IPFS_GATEWAY_HTTP_CODE2 = 2336;
function peerIdFromString(str, decoder) {
  let multihash;
  if (str.charAt(0) === "1" || str.charAt(0) === "Q") {
    multihash = decode4(base58btc.decode(`z${str}`));
  } else if (str.startsWith("k51qzi5uqu5") || str.startsWith("kzwfwjn5ji4") || str.startsWith("k2k4r8") || str.startsWith("bafz")) {
    return peerIdFromCID(CID.parse(str));
  } else {
    if (decoder == null) {
      throw new InvalidParametersError('Please pass a multibase decoder for strings that do not start with "1" or "Q"');
    }
    multihash = decode4(decoder.decode(str));
  }
  return peerIdFromMultihash(multihash);
}
__name(peerIdFromString, "peerIdFromString");
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

// node_modules/it-length-prefixed/dist/src/utils.js
function isAsyncIterable(thing) {
  return thing[Symbol.asyncIterator] != null;
}
__name(isAsyncIterable, "isAsyncIterable");

// node_modules/it-length-prefixed/dist/src/encode.js
var defaultEncoder = /* @__PURE__ */ __name((length3) => {
  const lengthLength = encodingLength2(length3);
  const lengthBuf = allocUnsafe(lengthLength);
  encode5(length3, lengthBuf);
  defaultEncoder.bytes = lengthLength;
  return lengthBuf;
}, "defaultEncoder");
defaultEncoder.bytes = 0;
function encode6(source, options) {
  options = options ?? {};
  const encodeLength2 = options.lengthEncoder ?? defaultEncoder;
  function* maybeYield(chunk) {
    const length3 = encodeLength2(chunk.byteLength);
    if (length3 instanceof Uint8Array) {
      yield length3;
    } else {
      yield* length3;
    }
    if (chunk instanceof Uint8Array) {
      yield chunk;
    } else {
      yield* chunk;
    }
  }
  __name(maybeYield, "maybeYield");
  if (isAsyncIterable(source)) {
    return (async function* () {
      for await (const chunk of source) {
        yield* maybeYield(chunk);
      }
    })();
  }
  return (function* () {
    for (const chunk of source) {
      yield* maybeYield(chunk);
    }
  })();
}
__name(encode6, "encode");
encode6.single = (chunk, options) => {
  options = options ?? {};
  const encodeLength2 = options.lengthEncoder ?? defaultEncoder;
  return new Uint8ArrayList(encodeLength2(chunk.byteLength), chunk);
};

// node_modules/it-length-prefixed/dist/src/errors.js
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
var UnexpectedEOFError = class extends Error {
  static {
    __name(this, "UnexpectedEOFError");
  }
  name = "UnexpectedEOFError";
  code = "ERR_UNEXPECTED_EOF";
};

// node_modules/it-length-prefixed/dist/src/decode.js
var MAX_LENGTH_LENGTH = 8;
var MAX_DATA_LENGTH = 1024 * 1024 * 4;
var ReadMode;
(function(ReadMode2) {
  ReadMode2[ReadMode2["LENGTH"] = 0] = "LENGTH";
  ReadMode2[ReadMode2["DATA"] = 1] = "DATA";
})(ReadMode || (ReadMode = {}));
var defaultDecoder = /* @__PURE__ */ __name((buf) => {
  const length3 = decode6(buf);
  defaultDecoder.bytes = encodingLength2(length3);
  return length3;
}, "defaultDecoder");
defaultDecoder.bytes = 0;
function decode7(source, options) {
  const buffer = new Uint8ArrayList();
  let mode = ReadMode.LENGTH;
  let dataLength = -1;
  const lengthDecoder = options?.lengthDecoder ?? defaultDecoder;
  const maxLengthLength = options?.maxLengthLength ?? MAX_LENGTH_LENGTH;
  const maxDataLength = options?.maxDataLength ?? MAX_DATA_LENGTH;
  function* maybeYield() {
    while (buffer.byteLength > 0) {
      if (mode === ReadMode.LENGTH) {
        try {
          dataLength = lengthDecoder(buffer);
          if (dataLength < 0) {
            throw new InvalidMessageLengthError("Invalid message length");
          }
          if (dataLength > maxDataLength) {
            throw new InvalidDataLengthError("Message length too long");
          }
          const dataLengthLength = lengthDecoder.bytes;
          buffer.consume(dataLengthLength);
          if (options?.onLength != null) {
            options.onLength(dataLength);
          }
          mode = ReadMode.DATA;
        } catch (err) {
          if (err instanceof RangeError) {
            if (buffer.byteLength > maxLengthLength) {
              throw new InvalidDataLengthLengthError("Message length length too long");
            }
            break;
          }
          throw err;
        }
      }
      if (mode === ReadMode.DATA) {
        if (buffer.byteLength < dataLength) {
          break;
        }
        const data = buffer.sublist(0, dataLength);
        buffer.consume(dataLength);
        if (options?.onData != null) {
          options.onData(data);
        }
        yield data;
        mode = ReadMode.LENGTH;
      }
    }
  }
  __name(maybeYield, "maybeYield");
  if (isAsyncIterable(source)) {
    return (async function* () {
      for await (const buf of source) {
        buffer.append(buf);
        yield* maybeYield();
      }
      if (buffer.byteLength > 0) {
        throw new UnexpectedEOFError("Unexpected end of input");
      }
    })();
  }
  return (function* () {
    for (const buf of source) {
      buffer.append(buf);
      yield* maybeYield();
    }
    if (buffer.byteLength > 0) {
      throw new UnexpectedEOFError("Unexpected end of input");
    }
  })();
}
__name(decode7, "decode");
decode7.fromReader = (reader, options) => {
  let byteLength = 1;
  const varByteSource = (async function* () {
    while (true) {
      try {
        const { done, value } = await reader.next(byteLength);
        if (done === true) {
          return;
        }
        if (value != null) {
          yield value;
        }
      } catch (err) {
        if (err.code === "ERR_UNDER_READ") {
          return { done: true, value: null };
        }
        throw err;
      } finally {
        byteLength = 1;
      }
    }
  })();
  const onLength = /* @__PURE__ */ __name((l) => {
    byteLength = l;
  }, "onLength");
  return decode7(varByteSource, {
    ...options ?? {},
    onLength
  });
};

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

// node_modules/it-pushable/dist/src/fifo.js
var FixedFIFO = class {
  static {
    __name(this, "FixedFIFO");
  }
  buffer;
  mask;
  top;
  btm;
  next;
  constructor(hwm) {
    if (!(hwm > 0) || (hwm - 1 & hwm) !== 0) {
      throw new Error("Max size for a FixedFIFO should be a power of two");
    }
    this.buffer = new Array(hwm);
    this.mask = hwm - 1;
    this.top = 0;
    this.btm = 0;
    this.next = null;
  }
  push(data) {
    if (this.buffer[this.top] !== void 0) {
      return false;
    }
    this.buffer[this.top] = data;
    this.top = this.top + 1 & this.mask;
    return true;
  }
  shift() {
    const last = this.buffer[this.btm];
    if (last === void 0) {
      return void 0;
    }
    this.buffer[this.btm] = void 0;
    this.btm = this.btm + 1 & this.mask;
    return last;
  }
  isEmpty() {
    return this.buffer[this.btm] === void 0;
  }
};
var FIFO = class {
  static {
    __name(this, "FIFO");
  }
  size;
  hwm;
  head;
  tail;
  constructor(options = {}) {
    this.hwm = options.splitLimit ?? 16;
    this.head = new FixedFIFO(this.hwm);
    this.tail = this.head;
    this.size = 0;
  }
  calculateSize(obj) {
    if (obj?.byteLength != null) {
      return obj.byteLength;
    }
    return 1;
  }
  push(val) {
    if (val?.value != null) {
      this.size += this.calculateSize(val.value);
    }
    if (!this.head.push(val)) {
      const prev = this.head;
      this.head = prev.next = new FixedFIFO(2 * this.head.buffer.length);
      this.head.push(val);
    }
  }
  shift() {
    let val = this.tail.shift();
    if (val === void 0 && this.tail.next != null) {
      const next = this.tail.next;
      this.tail.next = null;
      this.tail = next;
      val = this.tail.shift();
    }
    if (val?.value != null) {
      this.size -= this.calculateSize(val.value);
    }
    return val;
  }
  isEmpty() {
    return this.head.isEmpty();
  }
};

// node_modules/it-pushable/dist/src/index.js
var AbortError = class extends Error {
  static {
    __name(this, "AbortError");
  }
  type;
  code;
  constructor(message2, code2) {
    super(message2 ?? "The operation was aborted");
    this.type = "aborted";
    this.code = code2 ?? "ABORT_ERR";
  }
};
function pushable(options = {}) {
  const getNext = /* @__PURE__ */ __name((buffer) => {
    const next = buffer.shift();
    if (next == null) {
      return { done: true };
    }
    if (next.error != null) {
      throw next.error;
    }
    return {
      done: next.done === true,
      // @ts-expect-error if done is false, value will be present
      value: next.value
    };
  }, "getNext");
  return _pushable(getNext, options);
}
__name(pushable, "pushable");
function _pushable(getNext, options) {
  options = options ?? {};
  let onEnd = options.onEnd;
  let buffer = new FIFO();
  let pushable2;
  let onNext;
  let ended;
  let drain = pDefer();
  const waitNext = /* @__PURE__ */ __name(async () => {
    try {
      if (!buffer.isEmpty()) {
        return getNext(buffer);
      }
      if (ended) {
        return { done: true };
      }
      return await new Promise((resolve, reject) => {
        onNext = /* @__PURE__ */ __name((next) => {
          onNext = null;
          buffer.push(next);
          try {
            resolve(getNext(buffer));
          } catch (err) {
            reject(err);
          }
          return pushable2;
        }, "onNext");
      });
    } finally {
      if (buffer.isEmpty()) {
        queueMicrotask(() => {
          drain.resolve();
          drain = pDefer();
        });
      }
    }
  }, "waitNext");
  const bufferNext = /* @__PURE__ */ __name((next) => {
    if (onNext != null) {
      return onNext(next);
    }
    buffer.push(next);
    return pushable2;
  }, "bufferNext");
  const bufferError = /* @__PURE__ */ __name((err) => {
    buffer = new FIFO();
    if (onNext != null) {
      return onNext({ error: err });
    }
    buffer.push({ error: err });
    return pushable2;
  }, "bufferError");
  const push = /* @__PURE__ */ __name((value) => {
    if (ended) {
      return pushable2;
    }
    if (options?.objectMode !== true && value?.byteLength == null) {
      throw new Error("objectMode was not true but tried to push non-Uint8Array value");
    }
    return bufferNext({ done: false, value });
  }, "push");
  const end = /* @__PURE__ */ __name((err) => {
    if (ended)
      return pushable2;
    ended = true;
    return err != null ? bufferError(err) : bufferNext({ done: true });
  }, "end");
  const _return = /* @__PURE__ */ __name(() => {
    buffer = new FIFO();
    end();
    return { done: true };
  }, "_return");
  const _throw = /* @__PURE__ */ __name((err) => {
    end(err);
    return { done: true };
  }, "_throw");
  pushable2 = {
    [Symbol.asyncIterator]() {
      return this;
    },
    next: waitNext,
    return: _return,
    throw: _throw,
    push,
    end,
    get readableLength() {
      return buffer.size;
    },
    onEmpty: /* @__PURE__ */ __name(async (options2) => {
      const signal = options2?.signal;
      signal?.throwIfAborted();
      if (buffer.isEmpty()) {
        return;
      }
      let cancel;
      let listener;
      if (signal != null) {
        cancel = new Promise((resolve, reject) => {
          listener = /* @__PURE__ */ __name(() => {
            reject(new AbortError());
          }, "listener");
          signal.addEventListener("abort", listener);
        });
      }
      try {
        await Promise.race([
          drain.promise,
          cancel
        ]);
      } finally {
        if (listener != null && signal != null) {
          signal?.removeEventListener("abort", listener);
        }
      }
    }, "onEmpty")
  };
  if (onEnd == null) {
    return pushable2;
  }
  const _pushable2 = pushable2;
  pushable2 = {
    [Symbol.asyncIterator]() {
      return this;
    },
    next() {
      return _pushable2.next();
    },
    throw(err) {
      _pushable2.throw(err);
      if (onEnd != null) {
        onEnd(err);
        onEnd = void 0;
      }
      return { done: true };
    },
    return() {
      _pushable2.return();
      if (onEnd != null) {
        onEnd();
        onEnd = void 0;
      }
      return { done: true };
    },
    push,
    end(err) {
      _pushable2.end(err);
      if (onEnd != null) {
        onEnd(err);
        onEnd = void 0;
      }
      return pushable2;
    },
    get readableLength() {
      return _pushable2.readableLength;
    },
    onEmpty: /* @__PURE__ */ __name((opts) => {
      return _pushable2.onEmpty(opts);
    }, "onEmpty")
  };
  return pushable2;
}
__name(_pushable, "_pushable");

// node_modules/race-signal/dist/src/index.js
var AbortError2 = class extends Error {
  static {
    __name(this, "AbortError");
  }
  type;
  code;
  constructor(message2, code2, name2) {
    super(message2 ?? "The operation was aborted");
    this.type = "aborted";
    this.name = name2 ?? "AbortError";
    this.code = code2 ?? "ABORT_ERR";
  }
};
async function raceSignal(promise, signal, opts) {
  if (signal == null) {
    return promise;
  }
  if (signal.aborted) {
    promise.catch(() => {
    });
    return Promise.reject(new AbortError2(opts?.errorMessage, opts?.errorCode, opts?.errorName));
  }
  let listener;
  const error = new AbortError2(opts?.errorMessage, opts?.errorCode, opts?.errorName);
  try {
    return await Promise.race([
      promise,
      new Promise((resolve, reject) => {
        listener = /* @__PURE__ */ __name(() => {
          reject(error);
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

// node_modules/it-queueless-pushable/dist/src/index.js
var QueuelessPushable = class {
  static {
    __name(this, "QueuelessPushable");
  }
  readNext;
  haveNext;
  ended;
  nextResult;
  error;
  constructor() {
    this.ended = false;
    this.readNext = pDefer();
    this.haveNext = pDefer();
  }
  [Symbol.asyncIterator]() {
    return this;
  }
  async next() {
    if (this.nextResult == null) {
      await this.haveNext.promise;
    }
    if (this.nextResult == null) {
      throw new Error("HaveNext promise resolved but nextResult was undefined");
    }
    const nextResult = this.nextResult;
    this.nextResult = void 0;
    this.readNext.resolve();
    this.readNext = pDefer();
    return nextResult;
  }
  async throw(err) {
    this.ended = true;
    this.error = err;
    if (err != null) {
      this.haveNext.promise.catch(() => {
      });
      this.haveNext.reject(err);
    }
    const result = {
      done: true,
      value: void 0
    };
    return result;
  }
  async return() {
    const result = {
      done: true,
      value: void 0
    };
    this.ended = true;
    this.nextResult = result;
    this.haveNext.resolve();
    return result;
  }
  async push(value, options) {
    await this._push(value, options);
  }
  async end(err, options) {
    if (err != null) {
      await this.throw(err);
    } else {
      await this._push(void 0, options);
    }
  }
  async _push(value, options) {
    if (value != null && this.ended) {
      throw this.error ?? new Error("Cannot push value onto an ended pushable");
    }
    while (this.nextResult != null) {
      await this.readNext.promise;
    }
    if (value != null) {
      this.nextResult = { done: false, value };
    } else {
      this.ended = true;
      this.nextResult = { done: true, value: void 0 };
    }
    this.haveNext.resolve();
    this.haveNext = pDefer();
    await raceSignal(this.readNext.promise, options?.signal, options);
  }
};
function queuelessPushable() {
  return new QueuelessPushable();
}
__name(queuelessPushable, "queuelessPushable");

// node_modules/it-merge/dist/src/index.js
function isAsyncIterable2(thing) {
  return thing[Symbol.asyncIterator] != null;
}
__name(isAsyncIterable2, "isAsyncIterable");
async function addAllToPushable(sources, output, signal) {
  try {
    await Promise.all(sources.map(async (source) => {
      for await (const item of source) {
        await output.push(item, {
          signal
        });
        signal.throwIfAborted();
      }
    }));
    await output.end(void 0, {
      signal
    });
  } catch (err) {
    await output.end(err, {
      signal
    }).catch(() => {
    });
  }
}
__name(addAllToPushable, "addAllToPushable");
async function* mergeSources(sources) {
  const controller = new AbortController();
  const output = queuelessPushable();
  addAllToPushable(sources, output, controller.signal).catch(() => {
  });
  try {
    yield* output;
  } finally {
    controller.abort();
  }
}
__name(mergeSources, "mergeSources");
function* mergeSyncSources(syncSources) {
  for (const source of syncSources) {
    yield* source;
  }
}
__name(mergeSyncSources, "mergeSyncSources");
function merge(...sources) {
  const syncSources = [];
  for (const source of sources) {
    if (!isAsyncIterable2(source)) {
      syncSources.push(source);
    }
  }
  if (syncSources.length === sources.length) {
    return mergeSyncSources(syncSources);
  }
  return mergeSources(sources);
}
__name(merge, "merge");
var src_default = merge;

// node_modules/it-pipe/dist/src/index.js
function pipe(first, ...rest) {
  if (first == null) {
    throw new Error("Empty pipeline");
  }
  if (isDuplex(first)) {
    const duplex = first;
    first = /* @__PURE__ */ __name(() => duplex.source, "first");
  } else if (isIterable(first) || isAsyncIterable3(first)) {
    const source = first;
    first = /* @__PURE__ */ __name(() => source, "first");
  }
  const fns = [first, ...rest];
  if (fns.length > 1) {
    if (isDuplex(fns[fns.length - 1])) {
      fns[fns.length - 1] = fns[fns.length - 1].sink;
    }
  }
  if (fns.length > 2) {
    for (let i = 1; i < fns.length - 1; i++) {
      if (isDuplex(fns[i])) {
        fns[i] = duplexPipelineFn(fns[i]);
      }
    }
  }
  return rawPipe(...fns);
}
__name(pipe, "pipe");
var rawPipe = /* @__PURE__ */ __name((...fns) => {
  let res;
  while (fns.length > 0) {
    res = fns.shift()(res);
  }
  return res;
}, "rawPipe");
var isAsyncIterable3 = /* @__PURE__ */ __name((obj) => {
  return obj?.[Symbol.asyncIterator] != null;
}, "isAsyncIterable");
var isIterable = /* @__PURE__ */ __name((obj) => {
  return obj?.[Symbol.iterator] != null;
}, "isIterable");
var isDuplex = /* @__PURE__ */ __name((obj) => {
  if (obj == null) {
    return false;
  }
  return obj.sink != null && obj.source != null;
}, "isDuplex");
var duplexPipelineFn = /* @__PURE__ */ __name((duplex) => {
  return (source) => {
    const p = duplex.sink(source);
    if (p?.then != null) {
      const stream = pushable({
        objectMode: true
      });
      p.then(() => {
        stream.end();
      }, (err) => {
        stream.end(err);
      });
      let sourceWrap;
      const source2 = duplex.source;
      if (isAsyncIterable3(source2)) {
        sourceWrap = /* @__PURE__ */ __name(async function* () {
          yield* source2;
          stream.end();
        }, "sourceWrap");
      } else if (isIterable(source2)) {
        sourceWrap = /* @__PURE__ */ __name(function* () {
          yield* source2;
          stream.end();
        }, "sourceWrap");
      } else {
        throw new Error("Unknown duplex source type - must be Iterable or AsyncIterable");
      }
      return src_default(stream, sourceWrap());
    }
    return duplex.source;
  };
}, "duplexPipelineFn");

// node_modules/@chainsafe/libp2p-gossipsub/dist/src/constants.js
var second = 1e3;
var minute = 60 * second;
var FloodsubID = "/floodsub/1.0.0";
var GossipsubIDv10 = "/meshsub/1.0.0";
var GossipsubIDv11 = "/meshsub/1.1.0";
var GossipsubIDv12 = "/meshsub/1.2.0";
var GossipsubD = 6;
var GossipsubDlo = 4;
var GossipsubDhi = 12;
var GossipsubDscore = 4;
var GossipsubDout = 2;
var GossipsubHistoryLength = 5;
var GossipsubHistoryGossip = 3;
var GossipsubDlazy = 6;
var GossipsubGossipFactor = 0.25;
var GossipsubGossipRetransmission = 3;
var GossipsubHeartbeatInitialDelay = 100;
var GossipsubHeartbeatInterval = second;
var GossipsubFanoutTTL = minute;
var GossipsubPrunePeers = 16;
var GossipsubPruneBackoff = minute;
var GossipsubUnsubscribeBackoff = 10 * second;
var GossipsubPruneBackoffTicks = 15;
var GossipsubConnectionTimeout = 30 * second;
var GossipsubDirectConnectTicks = 300;
var GossipsubDirectConnectInitialDelay = second;
var GossipsubOpportunisticGraftTicks = 60;
var GossipsubOpportunisticGraftPeers = 2;
var GossipsubGraftFloodThreshold = 10 * second;
var GossipsubMaxIHaveLength = 5e3;
var GossipsubMaxIHaveMessages = 10;
var GossipsubIWantFollowupTime = 3 * second;
var GossipsubSeenTTL = 2 * minute;
var TimeCacheDuration = 120 * 1e3;
var ERR_TOPIC_VALIDATOR_REJECT = "ERR_TOPIC_VALIDATOR_REJECT";
var ERR_TOPIC_VALIDATOR_IGNORE = "ERR_TOPIC_VALIDATOR_IGNORE";
var ACCEPT_FROM_WHITELIST_THRESHOLD_SCORE = 0;
var ACCEPT_FROM_WHITELIST_MAX_MESSAGES = 128;
var ACCEPT_FROM_WHITELIST_DURATION_MS = 1e3;
var DEFAULT_METRIC_MESH_MESSAGE_DELIVERIES_WINDOWS = 1e3;
var BACKOFF_SLACK = 1;
var GossipsubIdontwantMinDataSize = 512;
var GossipsubIdontwantMaxMessages = 512;

// node_modules/@chainsafe/libp2p-gossipsub/dist/src/message/decodeRpc.js
var defaultDecodeRpcLimits = {
  maxSubscriptions: Infinity,
  maxMessages: Infinity,
  maxIhaveMessageIDs: Infinity,
  maxIwantMessageIDs: Infinity,
  maxIdontwantMessageIDs: Infinity,
  maxControlMessages: Infinity,
  maxPeerInfos: Infinity
};

// node_modules/@chainsafe/libp2p-gossipsub/dist/src/message/rpc.js
var RPC;
(function(RPC2) {
  let SubOpts;
  (function(SubOpts2) {
    let _codec2;
    SubOpts2.codec = () => {
      if (_codec2 == null) {
        _codec2 = message((obj, w, opts = {}) => {
          if (opts.lengthDelimited !== false) {
            w.fork();
          }
          if (obj.subscribe != null) {
            w.uint32(8);
            w.bool(obj.subscribe);
          }
          if (obj.topic != null) {
            w.uint32(18);
            w.string(obj.topic);
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
                obj.subscribe = reader.bool();
                break;
              }
              case 2: {
                obj.topic = reader.string();
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
    SubOpts2.encode = (obj) => {
      return encodeMessage(obj, SubOpts2.codec());
    };
    SubOpts2.decode = (buf, opts) => {
      return decodeMessage(buf, SubOpts2.codec(), opts);
    };
  })(SubOpts = RPC2.SubOpts || (RPC2.SubOpts = {}));
  let Message;
  (function(Message2) {
    let _codec2;
    Message2.codec = () => {
      if (_codec2 == null) {
        _codec2 = message((obj, w, opts = {}) => {
          if (opts.lengthDelimited !== false) {
            w.fork();
          }
          if (obj.from != null) {
            w.uint32(10);
            w.bytes(obj.from);
          }
          if (obj.data != null) {
            w.uint32(18);
            w.bytes(obj.data);
          }
          if (obj.seqno != null) {
            w.uint32(26);
            w.bytes(obj.seqno);
          }
          if (obj.topic != null && obj.topic !== "") {
            w.uint32(34);
            w.string(obj.topic);
          }
          if (obj.signature != null) {
            w.uint32(42);
            w.bytes(obj.signature);
          }
          if (obj.key != null) {
            w.uint32(50);
            w.bytes(obj.key);
          }
          if (opts.lengthDelimited !== false) {
            w.ldelim();
          }
        }, (reader, length3, opts = {}) => {
          const obj = {
            topic: ""
          };
          const end = length3 == null ? reader.len : reader.pos + length3;
          while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
              case 1: {
                obj.from = reader.bytes();
                break;
              }
              case 2: {
                obj.data = reader.bytes();
                break;
              }
              case 3: {
                obj.seqno = reader.bytes();
                break;
              }
              case 4: {
                obj.topic = reader.string();
                break;
              }
              case 5: {
                obj.signature = reader.bytes();
                break;
              }
              case 6: {
                obj.key = reader.bytes();
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
    Message2.encode = (obj) => {
      return encodeMessage(obj, Message2.codec());
    };
    Message2.decode = (buf, opts) => {
      return decodeMessage(buf, Message2.codec(), opts);
    };
  })(Message = RPC2.Message || (RPC2.Message = {}));
  let ControlMessage;
  (function(ControlMessage2) {
    let _codec2;
    ControlMessage2.codec = () => {
      if (_codec2 == null) {
        _codec2 = message((obj, w, opts = {}) => {
          if (opts.lengthDelimited !== false) {
            w.fork();
          }
          if (obj.ihave != null) {
            for (const value of obj.ihave) {
              w.uint32(10);
              RPC2.ControlIHave.codec().encode(value, w);
            }
          }
          if (obj.iwant != null) {
            for (const value of obj.iwant) {
              w.uint32(18);
              RPC2.ControlIWant.codec().encode(value, w);
            }
          }
          if (obj.graft != null) {
            for (const value of obj.graft) {
              w.uint32(26);
              RPC2.ControlGraft.codec().encode(value, w);
            }
          }
          if (obj.prune != null) {
            for (const value of obj.prune) {
              w.uint32(34);
              RPC2.ControlPrune.codec().encode(value, w);
            }
          }
          if (obj.idontwant != null) {
            for (const value of obj.idontwant) {
              w.uint32(42);
              RPC2.ControlIDontWant.codec().encode(value, w);
            }
          }
          if (opts.lengthDelimited !== false) {
            w.ldelim();
          }
        }, (reader, length3, opts = {}) => {
          const obj = {
            ihave: [],
            iwant: [],
            graft: [],
            prune: [],
            idontwant: []
          };
          const end = length3 == null ? reader.len : reader.pos + length3;
          while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
              case 1: {
                if (opts.limits?.ihave != null && obj.ihave.length === opts.limits.ihave) {
                  throw new MaxLengthError('Decode error - map field "ihave" had too many elements');
                }
                obj.ihave.push(RPC2.ControlIHave.codec().decode(reader, reader.uint32(), {
                  limits: opts.limits?.ihave$
                }));
                break;
              }
              case 2: {
                if (opts.limits?.iwant != null && obj.iwant.length === opts.limits.iwant) {
                  throw new MaxLengthError('Decode error - map field "iwant" had too many elements');
                }
                obj.iwant.push(RPC2.ControlIWant.codec().decode(reader, reader.uint32(), {
                  limits: opts.limits?.iwant$
                }));
                break;
              }
              case 3: {
                if (opts.limits?.graft != null && obj.graft.length === opts.limits.graft) {
                  throw new MaxLengthError('Decode error - map field "graft" had too many elements');
                }
                obj.graft.push(RPC2.ControlGraft.codec().decode(reader, reader.uint32(), {
                  limits: opts.limits?.graft$
                }));
                break;
              }
              case 4: {
                if (opts.limits?.prune != null && obj.prune.length === opts.limits.prune) {
                  throw new MaxLengthError('Decode error - map field "prune" had too many elements');
                }
                obj.prune.push(RPC2.ControlPrune.codec().decode(reader, reader.uint32(), {
                  limits: opts.limits?.prune$
                }));
                break;
              }
              case 5: {
                if (opts.limits?.idontwant != null && obj.idontwant.length === opts.limits.idontwant) {
                  throw new MaxLengthError('Decode error - map field "idontwant" had too many elements');
                }
                obj.idontwant.push(RPC2.ControlIDontWant.codec().decode(reader, reader.uint32(), {
                  limits: opts.limits?.idontwant$
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
      return _codec2;
    };
    ControlMessage2.encode = (obj) => {
      return encodeMessage(obj, ControlMessage2.codec());
    };
    ControlMessage2.decode = (buf, opts) => {
      return decodeMessage(buf, ControlMessage2.codec(), opts);
    };
  })(ControlMessage = RPC2.ControlMessage || (RPC2.ControlMessage = {}));
  let ControlIHave;
  (function(ControlIHave2) {
    let _codec2;
    ControlIHave2.codec = () => {
      if (_codec2 == null) {
        _codec2 = message((obj, w, opts = {}) => {
          if (opts.lengthDelimited !== false) {
            w.fork();
          }
          if (obj.topicID != null) {
            w.uint32(10);
            w.string(obj.topicID);
          }
          if (obj.messageIDs != null) {
            for (const value of obj.messageIDs) {
              w.uint32(18);
              w.bytes(value);
            }
          }
          if (opts.lengthDelimited !== false) {
            w.ldelim();
          }
        }, (reader, length3, opts = {}) => {
          const obj = {
            messageIDs: []
          };
          const end = length3 == null ? reader.len : reader.pos + length3;
          while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
              case 1: {
                obj.topicID = reader.string();
                break;
              }
              case 2: {
                if (opts.limits?.messageIDs != null && obj.messageIDs.length === opts.limits.messageIDs) {
                  throw new MaxLengthError('Decode error - map field "messageIDs" had too many elements');
                }
                obj.messageIDs.push(reader.bytes());
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
    ControlIHave2.encode = (obj) => {
      return encodeMessage(obj, ControlIHave2.codec());
    };
    ControlIHave2.decode = (buf, opts) => {
      return decodeMessage(buf, ControlIHave2.codec(), opts);
    };
  })(ControlIHave = RPC2.ControlIHave || (RPC2.ControlIHave = {}));
  let ControlIWant;
  (function(ControlIWant2) {
    let _codec2;
    ControlIWant2.codec = () => {
      if (_codec2 == null) {
        _codec2 = message((obj, w, opts = {}) => {
          if (opts.lengthDelimited !== false) {
            w.fork();
          }
          if (obj.messageIDs != null) {
            for (const value of obj.messageIDs) {
              w.uint32(10);
              w.bytes(value);
            }
          }
          if (opts.lengthDelimited !== false) {
            w.ldelim();
          }
        }, (reader, length3, opts = {}) => {
          const obj = {
            messageIDs: []
          };
          const end = length3 == null ? reader.len : reader.pos + length3;
          while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
              case 1: {
                if (opts.limits?.messageIDs != null && obj.messageIDs.length === opts.limits.messageIDs) {
                  throw new MaxLengthError('Decode error - map field "messageIDs" had too many elements');
                }
                obj.messageIDs.push(reader.bytes());
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
    ControlIWant2.encode = (obj) => {
      return encodeMessage(obj, ControlIWant2.codec());
    };
    ControlIWant2.decode = (buf, opts) => {
      return decodeMessage(buf, ControlIWant2.codec(), opts);
    };
  })(ControlIWant = RPC2.ControlIWant || (RPC2.ControlIWant = {}));
  let ControlGraft;
  (function(ControlGraft2) {
    let _codec2;
    ControlGraft2.codec = () => {
      if (_codec2 == null) {
        _codec2 = message((obj, w, opts = {}) => {
          if (opts.lengthDelimited !== false) {
            w.fork();
          }
          if (obj.topicID != null) {
            w.uint32(10);
            w.string(obj.topicID);
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
                obj.topicID = reader.string();
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
    ControlGraft2.encode = (obj) => {
      return encodeMessage(obj, ControlGraft2.codec());
    };
    ControlGraft2.decode = (buf, opts) => {
      return decodeMessage(buf, ControlGraft2.codec(), opts);
    };
  })(ControlGraft = RPC2.ControlGraft || (RPC2.ControlGraft = {}));
  let ControlPrune;
  (function(ControlPrune2) {
    let _codec2;
    ControlPrune2.codec = () => {
      if (_codec2 == null) {
        _codec2 = message((obj, w, opts = {}) => {
          if (opts.lengthDelimited !== false) {
            w.fork();
          }
          if (obj.topicID != null) {
            w.uint32(10);
            w.string(obj.topicID);
          }
          if (obj.peers != null) {
            for (const value of obj.peers) {
              w.uint32(18);
              RPC2.PeerInfo.codec().encode(value, w);
            }
          }
          if (obj.backoff != null) {
            w.uint32(24);
            w.uint64Number(obj.backoff);
          }
          if (opts.lengthDelimited !== false) {
            w.ldelim();
          }
        }, (reader, length3, opts = {}) => {
          const obj = {
            peers: []
          };
          const end = length3 == null ? reader.len : reader.pos + length3;
          while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
              case 1: {
                obj.topicID = reader.string();
                break;
              }
              case 2: {
                if (opts.limits?.peers != null && obj.peers.length === opts.limits.peers) {
                  throw new MaxLengthError('Decode error - map field "peers" had too many elements');
                }
                obj.peers.push(RPC2.PeerInfo.codec().decode(reader, reader.uint32(), {
                  limits: opts.limits?.peers$
                }));
                break;
              }
              case 3: {
                obj.backoff = reader.uint64Number();
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
    ControlPrune2.encode = (obj) => {
      return encodeMessage(obj, ControlPrune2.codec());
    };
    ControlPrune2.decode = (buf, opts) => {
      return decodeMessage(buf, ControlPrune2.codec(), opts);
    };
  })(ControlPrune = RPC2.ControlPrune || (RPC2.ControlPrune = {}));
  let PeerInfo;
  (function(PeerInfo2) {
    let _codec2;
    PeerInfo2.codec = () => {
      if (_codec2 == null) {
        _codec2 = message((obj, w, opts = {}) => {
          if (opts.lengthDelimited !== false) {
            w.fork();
          }
          if (obj.peerID != null) {
            w.uint32(10);
            w.bytes(obj.peerID);
          }
          if (obj.signedPeerRecord != null) {
            w.uint32(18);
            w.bytes(obj.signedPeerRecord);
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
                obj.peerID = reader.bytes();
                break;
              }
              case 2: {
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
      return _codec2;
    };
    PeerInfo2.encode = (obj) => {
      return encodeMessage(obj, PeerInfo2.codec());
    };
    PeerInfo2.decode = (buf, opts) => {
      return decodeMessage(buf, PeerInfo2.codec(), opts);
    };
  })(PeerInfo = RPC2.PeerInfo || (RPC2.PeerInfo = {}));
  let ControlIDontWant;
  (function(ControlIDontWant2) {
    let _codec2;
    ControlIDontWant2.codec = () => {
      if (_codec2 == null) {
        _codec2 = message((obj, w, opts = {}) => {
          if (opts.lengthDelimited !== false) {
            w.fork();
          }
          if (obj.messageIDs != null) {
            for (const value of obj.messageIDs) {
              w.uint32(10);
              w.bytes(value);
            }
          }
          if (opts.lengthDelimited !== false) {
            w.ldelim();
          }
        }, (reader, length3, opts = {}) => {
          const obj = {
            messageIDs: []
          };
          const end = length3 == null ? reader.len : reader.pos + length3;
          while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
              case 1: {
                if (opts.limits?.messageIDs != null && obj.messageIDs.length === opts.limits.messageIDs) {
                  throw new MaxLengthError('Decode error - map field "messageIDs" had too many elements');
                }
                obj.messageIDs.push(reader.bytes());
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
    ControlIDontWant2.encode = (obj) => {
      return encodeMessage(obj, ControlIDontWant2.codec());
    };
    ControlIDontWant2.decode = (buf, opts) => {
      return decodeMessage(buf, ControlIDontWant2.codec(), opts);
    };
  })(ControlIDontWant = RPC2.ControlIDontWant || (RPC2.ControlIDontWant = {}));
  let _codec;
  RPC2.codec = () => {
    if (_codec == null) {
      _codec = message((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork();
        }
        if (obj.subscriptions != null) {
          for (const value of obj.subscriptions) {
            w.uint32(10);
            RPC2.SubOpts.codec().encode(value, w);
          }
        }
        if (obj.messages != null) {
          for (const value of obj.messages) {
            w.uint32(18);
            RPC2.Message.codec().encode(value, w);
          }
        }
        if (obj.control != null) {
          w.uint32(26);
          RPC2.ControlMessage.codec().encode(obj.control, w);
        }
        if (opts.lengthDelimited !== false) {
          w.ldelim();
        }
      }, (reader, length3, opts = {}) => {
        const obj = {
          subscriptions: [],
          messages: []
        };
        const end = length3 == null ? reader.len : reader.pos + length3;
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              if (opts.limits?.subscriptions != null && obj.subscriptions.length === opts.limits.subscriptions) {
                throw new MaxLengthError('Decode error - map field "subscriptions" had too many elements');
              }
              obj.subscriptions.push(RPC2.SubOpts.codec().decode(reader, reader.uint32(), {
                limits: opts.limits?.subscriptions$
              }));
              break;
            }
            case 2: {
              if (opts.limits?.messages != null && obj.messages.length === opts.limits.messages) {
                throw new MaxLengthError('Decode error - map field "messages" had too many elements');
              }
              obj.messages.push(RPC2.Message.codec().decode(reader, reader.uint32(), {
                limits: opts.limits?.messages$
              }));
              break;
            }
            case 3: {
              obj.control = RPC2.ControlMessage.codec().decode(reader, reader.uint32(), {
                limits: opts.limits?.control
              });
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
  RPC2.encode = (obj) => {
    return encodeMessage(obj, RPC2.codec());
  };
  RPC2.decode = (buf, opts) => {
    return decodeMessage(buf, RPC2.codec(), opts);
  };
})(RPC || (RPC = {}));

// node_modules/@chainsafe/libp2p-gossipsub/dist/src/message-cache.js
var MessageCache = class {
  static {
    __name(this, "MessageCache");
  }
  gossip;
  msgs = /* @__PURE__ */ new Map();
  msgIdToStrFn;
  history = [];
  /** Track with accounting of messages in the mcache that are not yet validated */
  notValidatedCount = 0;
  /**
   * Holds history of messages in timebounded history arrays
   */
  constructor(gossip, historyCapacity, msgIdToStrFn) {
    this.gossip = gossip;
    this.msgIdToStrFn = msgIdToStrFn;
    for (let i = 0; i < historyCapacity; i++) {
      this.history[i] = [];
    }
  }
  get size() {
    return this.msgs.size;
  }
  /**
   * Adds a message to the current window and the cache
   * Returns true if the message is not known and is inserted in the cache
   */
  put(messageId, msg, validated = false) {
    const { msgIdStr } = messageId;
    if (this.msgs.has(msgIdStr)) {
      return false;
    }
    this.msgs.set(msgIdStr, {
      message: msg,
      validated,
      originatingPeers: /* @__PURE__ */ new Set(),
      iwantCounts: /* @__PURE__ */ new Map()
    });
    this.history[0].push({ ...messageId, topic: msg.topic });
    if (!validated) {
      this.notValidatedCount++;
    }
    return true;
  }
  observeDuplicate(msgId2, fromPeerIdStr) {
    const entry = this.msgs.get(msgId2);
    if (entry != null && // if the message is already validated, we don't need to store extra peers sending us
    // duplicates as the message has already been forwarded
    !entry.validated) {
      entry.originatingPeers.add(fromPeerIdStr);
    }
  }
  /**
   * Retrieves a message from the cache by its ID, if it is still present
   */
  get(msgId2) {
    return this.msgs.get(this.msgIdToStrFn(msgId2))?.message;
  }
  /**
   * Increases the iwant count for the given message by one and returns the message together
   * with the iwant if the message exists.
   */
  getWithIWantCount(msgIdStr, p) {
    const msg = this.msgs.get(msgIdStr);
    if (msg == null) {
      return null;
    }
    const count = (msg.iwantCounts.get(p) ?? 0) + 1;
    msg.iwantCounts.set(p, count);
    return { msg: msg.message, count };
  }
  /**
   * Retrieves a list of message IDs for a set of topics
   */
  getGossipIDs(topics) {
    const msgIdsByTopic = /* @__PURE__ */ new Map();
    for (let i = 0; i < this.gossip; i++) {
      this.history[i].forEach((entry) => {
        const msg = this.msgs.get(entry.msgIdStr);
        if ((msg?.validated ?? false) && topics.has(entry.topic)) {
          let msgIds = msgIdsByTopic.get(entry.topic);
          if (msgIds == null) {
            msgIds = [];
            msgIdsByTopic.set(entry.topic, msgIds);
          }
          msgIds.push(entry.msgId);
        }
      });
    }
    return msgIdsByTopic;
  }
  /**
   * Gets a message with msgId and tags it as validated.
   * This function also returns the known peers that have sent us this message. This is used to
   * prevent us sending redundant messages to peers who have already propagated it.
   */
  validate(msgId2) {
    const entry = this.msgs.get(msgId2);
    if (entry == null) {
      return null;
    }
    if (!entry.validated) {
      this.notValidatedCount--;
    }
    const { message: message2, originatingPeers } = entry;
    entry.validated = true;
    entry.originatingPeers = /* @__PURE__ */ new Set();
    return { message: message2, originatingPeers };
  }
  /**
   * Shifts the current window, discarding messages older than this.history.length of the cache
   */
  shift() {
    const lastCacheEntries = this.history[this.history.length - 1];
    lastCacheEntries.forEach((cacheEntry) => {
      const entry = this.msgs.get(cacheEntry.msgIdStr);
      if (entry != null) {
        this.msgs.delete(cacheEntry.msgIdStr);
        if (!entry.validated) {
          this.notValidatedCount--;
        }
      }
    });
    this.history.pop();
    this.history.unshift([]);
  }
  remove(msgId2) {
    const entry = this.msgs.get(msgId2);
    if (entry == null) {
      return null;
    }
    this.msgs.delete(msgId2);
    return entry;
  }
};

// node_modules/@chainsafe/libp2p-gossipsub/dist/src/types.js
var SignaturePolicy;
(function(SignaturePolicy2) {
  SignaturePolicy2["StrictSign"] = "StrictSign";
  SignaturePolicy2["StrictNoSign"] = "StrictNoSign";
})(SignaturePolicy || (SignaturePolicy = {}));
var PublishConfigType;
(function(PublishConfigType2) {
  PublishConfigType2[PublishConfigType2["Signing"] = 0] = "Signing";
  PublishConfigType2[PublishConfigType2["Anonymous"] = 1] = "Anonymous";
})(PublishConfigType || (PublishConfigType = {}));
var RejectReason;
(function(RejectReason2) {
  RejectReason2["Error"] = "error";
  RejectReason2["Ignore"] = "ignore";
  RejectReason2["Reject"] = "reject";
  RejectReason2["Blacklisted"] = "blacklisted";
})(RejectReason || (RejectReason = {}));
var ValidateError;
(function(ValidateError2) {
  ValidateError2["InvalidSignature"] = "invalid_signature";
  ValidateError2["InvalidSeqno"] = "invalid_seqno";
  ValidateError2["InvalidPeerId"] = "invalid_peerid";
  ValidateError2["SignaturePresent"] = "signature_present";
  ValidateError2["SeqnoPresent"] = "seqno_present";
  ValidateError2["FromPresent"] = "from_present";
  ValidateError2["TransformFailed"] = "transform_failed";
})(ValidateError || (ValidateError = {}));
var MessageStatus;
(function(MessageStatus2) {
  MessageStatus2["duplicate"] = "duplicate";
  MessageStatus2["invalid"] = "invalid";
  MessageStatus2["valid"] = "valid";
})(MessageStatus || (MessageStatus = {}));
function rejectReasonFromAcceptance(acceptance) {
  switch (acceptance) {
    case TopicValidatorResult.Ignore:
      return RejectReason.Ignore;
    case TopicValidatorResult.Reject:
      return RejectReason.Reject;
    default:
      throw new Error("Unreachable");
  }
}
__name(rejectReasonFromAcceptance, "rejectReasonFromAcceptance");

// node_modules/@chainsafe/libp2p-gossipsub/dist/src/metrics.js
var MessageSource;
(function(MessageSource2) {
  MessageSource2["forward"] = "forward";
  MessageSource2["publish"] = "publish";
})(MessageSource || (MessageSource = {}));
var InclusionReason;
(function(InclusionReason2) {
  InclusionReason2["Fanout"] = "fanout";
  InclusionReason2["Random"] = "random";
  InclusionReason2["Subscribed"] = "subscribed";
  InclusionReason2["Outbound"] = "outbound";
  InclusionReason2["NotEnough"] = "not_enough";
  InclusionReason2["Opportunistic"] = "opportunistic";
})(InclusionReason || (InclusionReason = {}));
var ChurnReason;
(function(ChurnReason2) {
  ChurnReason2["Dc"] = "disconnected";
  ChurnReason2["BadScore"] = "bad_score";
  ChurnReason2["Prune"] = "prune";
  ChurnReason2["Excess"] = "excess";
})(ChurnReason || (ChurnReason = {}));
var ScorePenalty;
(function(ScorePenalty2) {
  ScorePenalty2["GraftBackoff"] = "graft_backoff";
  ScorePenalty2["BrokenPromise"] = "broken_promise";
  ScorePenalty2["MessageDeficit"] = "message_deficit";
  ScorePenalty2["IPColocation"] = "IP_colocation";
})(ScorePenalty || (ScorePenalty = {}));
var IHaveIgnoreReason;
(function(IHaveIgnoreReason2) {
  IHaveIgnoreReason2["LowScore"] = "low_score";
  IHaveIgnoreReason2["MaxIhave"] = "max_ihave";
  IHaveIgnoreReason2["MaxIasked"] = "max_iasked";
})(IHaveIgnoreReason || (IHaveIgnoreReason = {}));
var ScoreThreshold;
(function(ScoreThreshold2) {
  ScoreThreshold2["graylist"] = "graylist";
  ScoreThreshold2["publish"] = "publish";
  ScoreThreshold2["gossip"] = "gossip";
  ScoreThreshold2["mesh"] = "mesh";
})(ScoreThreshold || (ScoreThreshold = {}));
function getMetrics(register, topicStrToLabel, opts) {
  return {
    /* Metrics for static config */
    protocolsEnabled: register.gauge({
      name: "gossipsub_protocol",
      help: "Status of enabled protocols",
      labelNames: ["protocol"]
    }),
    /* Metrics per known topic */
    /**
     * Status of our subscription to this topic. This metric allows analyzing other topic metrics
     * filtered by our current subscription status.
     * = rust-libp2p `topic_subscription_status` */
    topicSubscriptionStatus: register.gauge({
      name: "gossipsub_topic_subscription_status",
      help: "Status of our subscription to this topic",
      labelNames: ["topicStr"]
    }),
    /** Number of peers subscribed to each topic. This allows us to analyze a topic's behaviour
     * regardless of our subscription status. */
    topicPeersCount: register.gauge({
      name: "gossipsub_topic_peer_count",
      help: "Number of peers subscribed to each topic",
      labelNames: ["topicStr"]
    }),
    /* Metrics regarding mesh state */
    /**
     * Number of peers in our mesh. This metric should be updated with the count of peers for a
     * topic in the mesh regardless of inclusion and churn events.
     * = rust-libp2p `mesh_peer_counts` */
    meshPeerCounts: register.gauge({
      name: "gossipsub_mesh_peer_count",
      help: "Number of peers in our mesh",
      labelNames: ["topicStr"]
    }),
    /**
     * Number of times we include peers in a topic mesh for different reasons.
     * = rust-libp2p `mesh_peer_inclusion_events` */
    meshPeerInclusionEventsFanout: register.gauge({
      name: "gossipsub_mesh_peer_inclusion_events_fanout_total",
      help: "Number of times we include peers in a topic mesh for fanout reasons",
      labelNames: ["topic"]
    }),
    meshPeerInclusionEventsRandom: register.gauge({
      name: "gossipsub_mesh_peer_inclusion_events_random_total",
      help: "Number of times we include peers in a topic mesh for random reasons",
      labelNames: ["topic"]
    }),
    meshPeerInclusionEventsSubscribed: register.gauge({
      name: "gossipsub_mesh_peer_inclusion_events_subscribed_total",
      help: "Number of times we include peers in a topic mesh for subscribed reasons",
      labelNames: ["topic"]
    }),
    meshPeerInclusionEventsOutbound: register.gauge({
      name: "gossipsub_mesh_peer_inclusion_events_outbound_total",
      help: "Number of times we include peers in a topic mesh for outbound reasons",
      labelNames: ["topic"]
    }),
    meshPeerInclusionEventsNotEnough: register.gauge({
      name: "gossipsub_mesh_peer_inclusion_events_not_enough_total",
      help: "Number of times we include peers in a topic mesh for not_enough reasons",
      labelNames: ["topic"]
    }),
    meshPeerInclusionEventsOpportunistic: register.gauge({
      name: "gossipsub_mesh_peer_inclusion_events_opportunistic_total",
      help: "Number of times we include peers in a topic mesh for opportunistic reasons",
      labelNames: ["topic"]
    }),
    meshPeerInclusionEventsUnknown: register.gauge({
      name: "gossipsub_mesh_peer_inclusion_events_unknown_total",
      help: "Number of times we include peers in a topic mesh for unknown reasons",
      labelNames: ["topic"]
    }),
    /**
     * Number of times we remove peers in a topic mesh for different reasons.
     * = rust-libp2p `mesh_peer_churn_events` */
    meshPeerChurnEventsDisconnected: register.gauge({
      name: "gossipsub_peer_churn_events_disconnected_total",
      help: "Number of times we remove peers in a topic mesh for disconnected reasons",
      labelNames: ["topic"]
    }),
    meshPeerChurnEventsBadScore: register.gauge({
      name: "gossipsub_peer_churn_events_bad_score_total",
      help: "Number of times we remove peers in a topic mesh for bad_score reasons",
      labelNames: ["topic"]
    }),
    meshPeerChurnEventsPrune: register.gauge({
      name: "gossipsub_peer_churn_events_prune_total",
      help: "Number of times we remove peers in a topic mesh for prune reasons",
      labelNames: ["topic"]
    }),
    meshPeerChurnEventsExcess: register.gauge({
      name: "gossipsub_peer_churn_events_excess_total",
      help: "Number of times we remove peers in a topic mesh for excess reasons",
      labelNames: ["topic"]
    }),
    meshPeerChurnEventsUnknown: register.gauge({
      name: "gossipsub_peer_churn_events_unknown_total",
      help: "Number of times we remove peers in a topic mesh for unknown reasons",
      labelNames: ["topic"]
    }),
    /* General Metrics */
    /**
     * Gossipsub supports floodsub, gossipsub v1.0, v1.1, and v1.2. Peers are classified based
     * on which protocol they support. This metric keeps track of the number of peers that are
     * connected of each type. */
    peersPerProtocol: register.gauge({
      name: "gossipsub_peers_per_protocol_count",
      help: "Peers connected for each topic",
      labelNames: ["protocol"]
    }),
    /** The time it takes to complete one iteration of the heartbeat. */
    heartbeatDuration: register.histogram({
      name: "gossipsub_heartbeat_duration_seconds",
      help: "The time it takes to complete one iteration of the heartbeat",
      // Should take <10ms, over 1s it's a huge issue that needs debugging, since a heartbeat will be cancelled
      buckets: [0.01, 0.1, 1]
    }),
    /** Heartbeat run took longer than heartbeat interval so next is skipped */
    heartbeatSkipped: register.gauge({
      name: "gossipsub_heartbeat_skipped",
      help: "Heartbeat run took longer than heartbeat interval so next is skipped"
    }),
    /**
     * Message validation results for each topic.
     * Invalid == Reject?
     * = rust-libp2p `invalid_messages`, `accepted_messages`, `ignored_messages`, `rejected_messages` */
    acceptedMessagesTotal: register.gauge({
      name: "gossipsub_accepted_messages_total",
      help: "Total accepted messages for each topic",
      labelNames: ["topic"]
    }),
    ignoredMessagesTotal: register.gauge({
      name: "gossipsub_ignored_messages_total",
      help: "Total ignored messages for each topic",
      labelNames: ["topic"]
    }),
    rejectedMessagesTotal: register.gauge({
      name: "gossipsub_rejected_messages_total",
      help: "Total rejected messages for each topic",
      labelNames: ["topic"]
    }),
    unknownValidationResultsTotal: register.gauge({
      name: "gossipsub_unknown_validation_results_total",
      help: "Total unknown validation results for each topic",
      labelNames: ["topic"]
    }),
    /**
     * When the user validates a message, it tries to re propagate it to its mesh peers. If the
     * message expires from the memcache before it can be validated, we count this a cache miss
     * and it is an indicator that the memcache size should be increased.
     * = rust-libp2p `mcache_misses` */
    asyncValidationMcacheHit: register.gauge({
      name: "gossipsub_async_validation_mcache_hit_total",
      help: "Async validation result reported by the user layer",
      labelNames: ["hit"]
    }),
    asyncValidationDelayFromFirstSeenSec: register.histogram({
      name: "gossipsub_async_validation_delay_from_first_seen",
      help: "Async validation report delay from first seen in second",
      buckets: [0.01, 0.03, 0.1, 0.3, 1, 3, 10]
    }),
    asyncValidationUnknownFirstSeen: register.gauge({
      name: "gossipsub_async_validation_unknown_first_seen_count_total",
      help: "Async validation report unknown first seen value for message"
    }),
    // peer stream
    peerReadStreamError: register.gauge({
      name: "gossipsub_peer_read_stream_err_count_total",
      help: "Peer read stream error"
    }),
    // RPC outgoing. Track byte length + data structure sizes
    rpcRecvBytes: register.gauge({ name: "gossipsub_rpc_recv_bytes_total", help: "RPC recv" }),
    rpcRecvCount: register.gauge({ name: "gossipsub_rpc_recv_count_total", help: "RPC recv" }),
    rpcRecvSubscription: register.gauge({ name: "gossipsub_rpc_recv_subscription_total", help: "RPC recv" }),
    rpcRecvMessage: register.gauge({ name: "gossipsub_rpc_recv_message_total", help: "RPC recv" }),
    rpcRecvControl: register.gauge({ name: "gossipsub_rpc_recv_control_total", help: "RPC recv" }),
    rpcRecvIHave: register.gauge({ name: "gossipsub_rpc_recv_ihave_total", help: "RPC recv" }),
    rpcRecvIWant: register.gauge({ name: "gossipsub_rpc_recv_iwant_total", help: "RPC recv" }),
    rpcRecvGraft: register.gauge({ name: "gossipsub_rpc_recv_graft_total", help: "RPC recv" }),
    rpcRecvPrune: register.gauge({ name: "gossipsub_rpc_recv_prune_total", help: "RPC recv" }),
    rpcDataError: register.gauge({ name: "gossipsub_rpc_data_err_count_total", help: "RPC data error" }),
    rpcRecvError: register.gauge({ name: "gossipsub_rpc_recv_err_count_total", help: "RPC recv error" }),
    /** Total count of RPC dropped because acceptFrom() == false */
    rpcRecvNotAccepted: register.gauge({
      name: "gossipsub_rpc_rcv_not_accepted_total",
      help: "Total count of RPC dropped because acceptFrom() == false"
    }),
    // RPC incoming. Track byte length + data structure sizes
    rpcSentBytes: register.gauge({ name: "gossipsub_rpc_sent_bytes_total", help: "RPC sent" }),
    rpcSentCount: register.gauge({ name: "gossipsub_rpc_sent_count_total", help: "RPC sent" }),
    rpcSentSubscription: register.gauge({ name: "gossipsub_rpc_sent_subscription_total", help: "RPC sent" }),
    rpcSentMessage: register.gauge({ name: "gossipsub_rpc_sent_message_total", help: "RPC sent" }),
    rpcSentControl: register.gauge({ name: "gossipsub_rpc_sent_control_total", help: "RPC sent" }),
    rpcSentIHave: register.gauge({ name: "gossipsub_rpc_sent_ihave_total", help: "RPC sent" }),
    rpcSentIWant: register.gauge({ name: "gossipsub_rpc_sent_iwant_total", help: "RPC sent" }),
    rpcSentGraft: register.gauge({ name: "gossipsub_rpc_sent_graft_total", help: "RPC sent" }),
    rpcSentPrune: register.gauge({ name: "gossipsub_rpc_sent_prune_total", help: "RPC sent" }),
    rpcSentIDontWant: register.gauge({ name: "gossipsub_rpc_sent_idontwant_total", help: "RPC sent" }),
    // publish message. Track peers sent to and bytes
    /** Total count of msg published by topic */
    msgPublishCount: register.gauge({
      name: "gossipsub_msg_publish_count_total",
      help: "Total count of msg published by topic",
      labelNames: ["topic"]
    }),
    /** Total count of peers that we publish a msg to */
    msgPublishPeersByTopic: register.gauge({
      name: "gossipsub_msg_publish_peers_total",
      help: "Total count of peers that we publish a msg to",
      labelNames: ["topic"]
    }),
    /** Total count of peers (by group) that we publish a msg to */
    directPeersPublishedTotal: register.gauge({
      name: "gossipsub_direct_peers_published_total",
      help: "Total direct peers that we publish a msg to",
      labelNames: ["topic"]
    }),
    floodsubPeersPublishedTotal: register.gauge({
      name: "gossipsub_floodsub_peers_published_total",
      help: "Total floodsub peers that we publish a msg to",
      labelNames: ["topic"]
    }),
    meshPeersPublishedTotal: register.gauge({
      name: "gossipsub_mesh_peers_published_total",
      help: "Total mesh peers that we publish a msg to",
      labelNames: ["topic"]
    }),
    fanoutPeersPublishedTotal: register.gauge({
      name: "gossipsub_fanout_peers_published_total",
      help: "Total fanout peers that we publish a msg to",
      labelNames: ["topic"]
    }),
    /** Total count of msg publish data.length bytes */
    msgPublishBytes: register.gauge({
      name: "gossipsub_msg_publish_bytes_total",
      help: "Total count of msg publish data.length bytes",
      labelNames: ["topic"]
    }),
    /** Total time in seconds to publish a message */
    msgPublishTime: register.histogram({
      name: "gossipsub_msg_publish_seconds",
      help: "Total time in seconds to publish a message",
      buckets: [1e-3, 2e-3, 5e-3, 0.01, 0.1, 0.5, 1],
      labelNames: ["topic"]
    }),
    /** Total count of msg forwarded by topic */
    msgForwardCount: register.gauge({
      name: "gossipsub_msg_forward_count_total",
      help: "Total count of msg forwarded by topic",
      labelNames: ["topic"]
    }),
    /** Total count of peers that we forward a msg to */
    msgForwardPeers: register.gauge({
      name: "gossipsub_msg_forward_peers_total",
      help: "Total count of peers that we forward a msg to",
      labelNames: ["topic"]
    }),
    /** Total count of recv msgs before any validation */
    msgReceivedPreValidation: register.gauge({
      name: "gossipsub_msg_received_prevalidation_total",
      help: "Total count of recv msgs before any validation",
      labelNames: ["topic"]
    }),
    /** Total count of recv msgs error */
    msgReceivedError: register.gauge({
      name: "gossipsub_msg_received_error_total",
      help: "Total count of recv msgs error",
      labelNames: ["topic"]
    }),
    /** Tracks distribution of recv msgs by duplicate, invalid, valid */
    prevalidationInvalidTotal: register.gauge({
      name: "gossipsub_pre_validation_invalid_total",
      help: "Total count of invalid messages received",
      labelNames: ["topic"]
    }),
    prevalidationValidTotal: register.gauge({
      name: "gossipsub_pre_validation_valid_total",
      help: "Total count of valid messages received",
      labelNames: ["topic"]
    }),
    prevalidationDuplicateTotal: register.gauge({
      name: "gossipsub_pre_validation_duplicate_total",
      help: "Total count of duplicate messages received",
      labelNames: ["topic"]
    }),
    prevalidationUnknownTotal: register.gauge({
      name: "gossipsub_pre_validation_unknown_status_total",
      help: "Total count of unknown_status messages received",
      labelNames: ["topic"]
    }),
    /** Tracks specific reason of invalid */
    msgReceivedInvalid: register.gauge({
      name: "gossipsub_msg_received_invalid_total",
      help: "Tracks specific reason of invalid",
      labelNames: ["error"]
    }),
    msgReceivedInvalidByTopic: register.gauge({
      name: "gossipsub_msg_received_invalid_by_topic_total",
      help: "Tracks specific invalid message by topic",
      labelNames: ["topic"]
    }),
    /** Track duplicate message delivery time */
    duplicateMsgDeliveryDelay: register.histogram({
      name: "gossisub_duplicate_msg_delivery_delay_seconds",
      help: "Time since the 1st duplicated message validated",
      labelNames: ["topic"],
      buckets: [
        0.25 * opts.maxMeshMessageDeliveriesWindowSec,
        0.5 * opts.maxMeshMessageDeliveriesWindowSec,
        Number(opts.maxMeshMessageDeliveriesWindowSec),
        2 * opts.maxMeshMessageDeliveriesWindowSec,
        4 * opts.maxMeshMessageDeliveriesWindowSec
      ]
    }),
    /** Total count of late msg delivery total by topic */
    duplicateMsgLateDelivery: register.gauge({
      name: "gossisub_duplicate_msg_late_delivery_total",
      help: "Total count of late duplicate message delivery by topic, which triggers P3 penalty",
      labelNames: ["topic"]
    }),
    duplicateMsgIgnored: register.gauge({
      name: "gossisub_ignored_published_duplicate_msgs_total",
      help: "Total count of published duplicate message ignored by topic",
      labelNames: ["topic"]
    }),
    /* Metrics related to scoring */
    /** Total times score() is called */
    scoreFnCalls: register.gauge({
      name: "gossipsub_score_fn_calls_total",
      help: "Total times score() is called"
    }),
    /** Total times score() call actually computed computeScore(), no cache */
    scoreFnRuns: register.gauge({
      name: "gossipsub_score_fn_runs_total",
      help: "Total times score() call actually computed computeScore(), no cache"
    }),
    scoreCachedDelta: register.histogram({
      name: "gossipsub_score_cache_delta",
      help: "Delta of score between cached values that expired",
      buckets: [10, 100, 1e3]
    }),
    /** Current count of peers by score threshold */
    peersByScoreThreshold: register.gauge({
      name: "gossipsub_peers_by_score_threshold_count",
      help: "Current count of peers by score threshold",
      labelNames: ["threshold"]
    }),
    score: register.avgMinMax({
      name: "gossipsub_score",
      help: "Avg min max of gossip scores"
    }),
    /**
     * Separate score weights
     * Need to use 2-label metrics in this case to debug the score weights
     **/
    scoreWeights: register.avgMinMax({
      name: "gossipsub_score_weights",
      help: "Separate score weights",
      labelNames: ["topic", "p"]
    }),
    /** Histogram of the scores for each mesh topic. */
    // TODO: Not implemented
    scorePerMesh: register.avgMinMax({
      name: "gossipsub_score_per_mesh",
      help: "Histogram of the scores for each mesh topic",
      labelNames: ["topic"]
    }),
    /** A counter of the kind of penalties being applied to peers. */
    // TODO: Not fully implemented
    scoringPenalties: register.gauge({
      name: "gossipsub_scoring_penalties_total",
      help: "A counter of the kind of penalties being applied to peers",
      labelNames: ["penalty"]
    }),
    behaviourPenalty: register.histogram({
      name: "gossipsub_peer_stat_behaviour_penalty",
      help: "Current peer stat behaviour_penalty at each scrape",
      buckets: [
        0.25 * opts.behaviourPenaltyThreshold,
        0.5 * opts.behaviourPenaltyThreshold,
        Number(opts.behaviourPenaltyThreshold),
        2 * opts.behaviourPenaltyThreshold,
        4 * opts.behaviourPenaltyThreshold
      ]
    }),
    // TODO:
    // - iasked per peer (on heartbeat)
    // - when promise is resolved, track messages from promises
    /** Total received IHAVE messages that we ignore for some reason */
    ihaveRcvIgnored: register.gauge({
      name: "gossipsub_ihave_rcv_ignored_total",
      help: "Total received IHAVE messages that we ignore for some reason",
      labelNames: ["reason"]
    }),
    /** Total received IHAVE messages by topic */
    ihaveRcvMsgids: register.gauge({
      name: "gossipsub_ihave_rcv_msgids_total",
      help: "Total received IHAVE messages by topic",
      labelNames: ["topic"]
    }),
    /**
     * Total messages per topic we don't have. Not actual requests.
     * The number of times we have decided that an IWANT control message is required for this
     * topic. A very high metric might indicate an underperforming network.
     * = rust-libp2p `topic_iwant_msgs` */
    ihaveRcvNotSeenMsgids: register.gauge({
      name: "gossipsub_ihave_rcv_not_seen_msgids_total",
      help: "Total messages per topic we do not have, not actual requests",
      labelNames: ["topic"]
    }),
    /** Total received IWANT messages by topic */
    iwantRcvMsgids: register.gauge({
      name: "gossipsub_iwant_rcv_msgids_total",
      help: "Total received IWANT messages by topic",
      labelNames: ["topic"]
    }),
    /** Total requested messageIDs that we don't have */
    iwantRcvDonthaveMsgids: register.gauge({
      name: "gossipsub_iwant_rcv_dont_have_msgids_total",
      help: "Total requested messageIDs that we do not have"
    }),
    /** Total received IDONTWANT messages */
    idontwantRcvMsgids: register.gauge({
      name: "gossipsub_idontwant_rcv_msgids_total",
      help: "Total received IDONTWANT messages"
    }),
    /** Total received IDONTWANT messageIDs that we don't have */
    idontwantRcvDonthaveMsgids: register.gauge({
      name: "gossipsub_idontwant_rcv_dont_have_msgids_total",
      help: "Total received IDONTWANT messageIDs that we do not have in mcache"
    }),
    iwantPromiseStarted: register.gauge({
      name: "gossipsub_iwant_promise_sent_total",
      help: "Total count of started IWANT promises"
    }),
    /** Total count of resolved IWANT promises */
    iwantPromiseResolved: register.gauge({
      name: "gossipsub_iwant_promise_resolved_total",
      help: "Total count of resolved IWANT promises"
    }),
    /** Total count of resolved IWANT promises from duplicate messages */
    iwantPromiseResolvedFromDuplicate: register.gauge({
      name: "gossipsub_iwant_promise_resolved_from_duplicate_total",
      help: "Total count of resolved IWANT promises from duplicate messages"
    }),
    /** Total count of peers we have asked IWANT promises that are resolved */
    iwantPromiseResolvedPeers: register.gauge({
      name: "gossipsub_iwant_promise_resolved_peers",
      help: "Total count of peers we have asked IWANT promises that are resolved"
    }),
    iwantPromiseBroken: register.gauge({
      name: "gossipsub_iwant_promise_broken",
      help: "Total count of broken IWANT promises"
    }),
    iwantMessagePruned: register.gauge({
      name: "gossipsub_iwant_message_pruned",
      help: "Total count of pruned IWANT messages"
    }),
    /** Histogram of delivery time of resolved IWANT promises */
    iwantPromiseDeliveryTime: register.histogram({
      name: "gossipsub_iwant_promise_delivery_seconds",
      help: "Histogram of delivery time of resolved IWANT promises",
      buckets: [
        0.5 * opts.gossipPromiseExpireSec,
        Number(opts.gossipPromiseExpireSec),
        2 * opts.gossipPromiseExpireSec,
        4 * opts.gossipPromiseExpireSec
      ]
    }),
    iwantPromiseUntracked: register.gauge({
      name: "gossip_iwant_promise_untracked",
      help: "Total count of untracked IWANT promise"
    }),
    /** Backoff time */
    connectedPeersBackoffSec: register.histogram({
      name: "gossipsub_connected_peers_backoff_seconds",
      help: "Backoff time in seconds",
      // Using 1 seconds as minimum as that's close to the heartbeat duration, no need for more resolution.
      // As per spec, backoff times are 10 seconds for UnsubscribeBackoff and 60 seconds for PruneBackoff.
      // Higher values of 60 seconds should not occur, but we add 120 seconds just in case
      // https://github.com/libp2p/specs/blob/master/pubsub/gossipsub/gossipsub-v1.1.md#overview-of-new-parameters
      buckets: [1, 2, 4, 10, 20, 60, 120]
    }),
    /* Data structure sizes */
    /** Unbounded cache sizes */
    cacheSize: register.gauge({
      name: "gossipsub_cache_size",
      help: "Unbounded cache sizes",
      labelNames: ["cache"]
    }),
    /** Current mcache msg count */
    mcacheSize: register.gauge({
      name: "gossipsub_mcache_size",
      help: "Current mcache msg count"
    }),
    mcacheNotValidatedCount: register.gauge({
      name: "gossipsub_mcache_not_validated_count",
      help: "Current mcache msg count not validated"
    }),
    fastMsgIdCacheCollision: register.gauge({
      name: "gossipsub_fastmsgid_cache_collision_total",
      help: "Total count of key collisions on fastmsgid cache put"
    }),
    newConnectionCount: register.gauge({
      name: "gossipsub_new_connection_total",
      help: "Total new connection by status",
      labelNames: ["status"]
    }),
    topicStrToLabel,
    toTopic(topicStr) {
      return this.topicStrToLabel.get(topicStr) ?? topicStr;
    },
    /** We joined a topic */
    onJoin(topicStr) {
      this.topicSubscriptionStatus.set({ topicStr }, 1);
      this.meshPeerCounts.set({ topicStr }, 0);
    },
    /** We left a topic */
    onLeave(topicStr) {
      this.topicSubscriptionStatus.set({ topicStr }, 0);
      this.meshPeerCounts.set({ topicStr }, 0);
    },
    /** Register the inclusion of peers in our mesh due to some reason. */
    onAddToMesh(topicStr, reason, count) {
      const topic = this.toTopic(topicStr);
      switch (reason) {
        case InclusionReason.Fanout:
          this.meshPeerInclusionEventsFanout.inc({ topic }, count);
          break;
        case InclusionReason.Random:
          this.meshPeerInclusionEventsRandom.inc({ topic }, count);
          break;
        case InclusionReason.Subscribed:
          this.meshPeerInclusionEventsSubscribed.inc({ topic }, count);
          break;
        case InclusionReason.Outbound:
          this.meshPeerInclusionEventsOutbound.inc({ topic }, count);
          break;
        case InclusionReason.NotEnough:
          this.meshPeerInclusionEventsNotEnough.inc({ topic }, count);
          break;
        case InclusionReason.Opportunistic:
          this.meshPeerInclusionEventsOpportunistic.inc({ topic }, count);
          break;
        default:
          this.meshPeerInclusionEventsUnknown.inc({ topic }, count);
          break;
      }
    },
    /** Register the removal of peers in our mesh due to some reason */
    // - remove_peer_from_mesh()
    // - heartbeat() Churn::BadScore
    // - heartbeat() Churn::Excess
    // - on_disconnect() Churn::Ds
    onRemoveFromMesh(topicStr, reason, count) {
      const topic = this.toTopic(topicStr);
      switch (reason) {
        case ChurnReason.Dc:
          this.meshPeerChurnEventsDisconnected.inc({ topic }, count);
          break;
        case ChurnReason.BadScore:
          this.meshPeerChurnEventsBadScore.inc({ topic }, count);
          break;
        case ChurnReason.Prune:
          this.meshPeerChurnEventsPrune.inc({ topic }, count);
          break;
        case ChurnReason.Excess:
          this.meshPeerChurnEventsExcess.inc({ topic }, count);
          break;
        default:
          this.meshPeerChurnEventsUnknown.inc({ topic }, count);
          break;
      }
    },
    /**
     * Update validation result to metrics
     *
     * @param messageRecord - null means the message's mcache record was not known at the time of acceptance report
     */
    onReportValidation(messageRecord, acceptance, firstSeenTimestampMs) {
      this.asyncValidationMcacheHit.inc({ hit: messageRecord != null ? "hit" : "miss" });
      if (messageRecord != null) {
        const topic = this.toTopic(messageRecord.message.topic);
        switch (acceptance) {
          case TopicValidatorResult.Accept:
            this.acceptedMessagesTotal.inc({ topic });
            break;
          case TopicValidatorResult.Ignore:
            this.ignoredMessagesTotal.inc({ topic });
            break;
          case TopicValidatorResult.Reject:
            this.rejectedMessagesTotal.inc({ topic });
            break;
          default:
            this.unknownValidationResultsTotal.inc({ topic });
            break;
        }
      }
      if (firstSeenTimestampMs != null) {
        this.asyncValidationDelayFromFirstSeenSec.observe((Date.now() - firstSeenTimestampMs) / 1e3);
      } else {
        this.asyncValidationUnknownFirstSeen.inc();
      }
    },
    /**
     * - in handle_graft() Penalty::GraftBackoff
     * - in apply_iwant_penalties() Penalty::BrokenPromise
     * - in metric_score() P3 Penalty::MessageDeficit
     * - in metric_score() P6 Penalty::IPColocation
     */
    onScorePenalty(penalty) {
      this.scoringPenalties.inc({ penalty }, 1);
    },
    onIhaveRcv(topicStr, ihave, idonthave) {
      const topic = this.toTopic(topicStr);
      this.ihaveRcvMsgids.inc({ topic }, ihave);
      this.ihaveRcvNotSeenMsgids.inc({ topic }, idonthave);
    },
    onIwantRcv(iwantByTopic, iwantDonthave) {
      for (const [topicStr, iwant] of iwantByTopic) {
        const topic = this.toTopic(topicStr);
        this.iwantRcvMsgids.inc({ topic }, iwant);
      }
      this.iwantRcvDonthaveMsgids.inc(iwantDonthave);
    },
    onIdontwantRcv(idontwant, idontwantDonthave) {
      this.idontwantRcvMsgids.inc(idontwant);
      this.idontwantRcvDonthaveMsgids.inc(idontwantDonthave);
    },
    onForwardMsg(topicStr, tosendCount) {
      const topic = this.toTopic(topicStr);
      this.msgForwardCount.inc({ topic }, 1);
      this.msgForwardPeers.inc({ topic }, tosendCount);
    },
    onPublishMsg(topicStr, tosendGroupCount, tosendCount, dataLen, ms) {
      const topic = this.toTopic(topicStr);
      this.msgPublishCount.inc({ topic }, 1);
      this.msgPublishBytes.inc({ topic }, tosendCount * dataLen);
      this.msgPublishPeersByTopic.inc({ topic }, tosendCount);
      this.directPeersPublishedTotal.inc({ topic }, tosendGroupCount.direct);
      this.floodsubPeersPublishedTotal.inc({ topic }, tosendGroupCount.floodsub);
      this.meshPeersPublishedTotal.inc({ topic }, tosendGroupCount.mesh);
      this.fanoutPeersPublishedTotal.inc({ topic }, tosendGroupCount.fanout);
      this.msgPublishTime.observe({ topic }, ms / 1e3);
    },
    onMsgRecvPreValidation(topicStr) {
      const topic = this.toTopic(topicStr);
      this.msgReceivedPreValidation.inc({ topic }, 1);
    },
    onMsgRecvError(topicStr) {
      const topic = this.toTopic(topicStr);
      this.msgReceivedError.inc({ topic }, 1);
    },
    onPrevalidationResult(topicStr, status) {
      const topic = this.toTopic(topicStr);
      switch (status) {
        case MessageStatus.duplicate:
          this.prevalidationDuplicateTotal.inc({ topic });
          break;
        case MessageStatus.invalid:
          this.prevalidationInvalidTotal.inc({ topic });
          break;
        case MessageStatus.valid:
          this.prevalidationValidTotal.inc({ topic });
          break;
        default:
          this.prevalidationUnknownTotal.inc({ topic });
          break;
      }
    },
    onMsgRecvInvalid(topicStr, reason) {
      const topic = this.toTopic(topicStr);
      const error = reason.reason === RejectReason.Error ? reason.error : reason.reason;
      this.msgReceivedInvalid.inc({ error }, 1);
      this.msgReceivedInvalidByTopic.inc({ topic }, 1);
    },
    onDuplicateMsgDelivery(topicStr, deliveryDelayMs, isLateDelivery) {
      const topic = this.toTopic(topicStr);
      this.duplicateMsgDeliveryDelay.observe({ topic }, deliveryDelayMs / 1e3);
      if (isLateDelivery) {
        this.duplicateMsgLateDelivery.inc({ topic }, 1);
      }
    },
    onPublishDuplicateMsg(topicStr) {
      const topic = this.toTopic(topicStr);
      this.duplicateMsgIgnored.inc({ topic }, 1);
    },
    onPeerReadStreamError() {
      this.peerReadStreamError.inc(1);
    },
    onRpcRecvError() {
      this.rpcRecvError.inc(1);
    },
    onRpcDataError() {
      this.rpcDataError.inc(1);
    },
    onRpcRecv(rpc, rpcBytes) {
      this.rpcRecvBytes.inc(rpcBytes);
      this.rpcRecvCount.inc(1);
      if (rpc.subscriptions != null)
        this.rpcRecvSubscription.inc(rpc.subscriptions.length);
      if (rpc.messages != null)
        this.rpcRecvMessage.inc(rpc.messages.length);
      if (rpc.control != null) {
        this.rpcRecvControl.inc(1);
        if (rpc.control.ihave != null)
          this.rpcRecvIHave.inc(rpc.control.ihave.length);
        if (rpc.control.iwant != null)
          this.rpcRecvIWant.inc(rpc.control.iwant.length);
        if (rpc.control.graft != null)
          this.rpcRecvGraft.inc(rpc.control.graft.length);
        if (rpc.control.prune != null)
          this.rpcRecvPrune.inc(rpc.control.prune.length);
      }
    },
    onRpcSent(rpc, rpcBytes) {
      this.rpcSentBytes.inc(rpcBytes);
      this.rpcSentCount.inc(1);
      if (rpc.subscriptions != null)
        this.rpcSentSubscription.inc(rpc.subscriptions.length);
      if (rpc.messages != null)
        this.rpcSentMessage.inc(rpc.messages.length);
      if (rpc.control != null) {
        const ihave = rpc.control.ihave?.length ?? 0;
        const iwant = rpc.control.iwant?.length ?? 0;
        const graft = rpc.control.graft?.length ?? 0;
        const prune = rpc.control.prune?.length ?? 0;
        const idontwant = rpc.control.idontwant?.length ?? 0;
        if (ihave > 0)
          this.rpcSentIHave.inc(ihave);
        if (iwant > 0)
          this.rpcSentIWant.inc(iwant);
        if (graft > 0)
          this.rpcSentGraft.inc(graft);
        if (prune > 0)
          this.rpcSentPrune.inc(prune);
        if (idontwant > 0)
          this.rpcSentIDontWant.inc(idontwant);
        if (ihave > 0 || iwant > 0 || graft > 0 || prune > 0 || idontwant > 0)
          this.rpcSentControl.inc(1);
      }
    },
    registerScores(scores, scoreThresholds) {
      let graylist = 0;
      let publish = 0;
      let gossip = 0;
      let mesh = 0;
      for (const score of scores) {
        if (score >= scoreThresholds.graylistThreshold)
          graylist++;
        if (score >= scoreThresholds.publishThreshold)
          publish++;
        if (score >= scoreThresholds.gossipThreshold)
          gossip++;
        if (score >= 0)
          mesh++;
      }
      this.peersByScoreThreshold.set({ threshold: ScoreThreshold.graylist }, graylist);
      this.peersByScoreThreshold.set({ threshold: ScoreThreshold.publish }, publish);
      this.peersByScoreThreshold.set({ threshold: ScoreThreshold.gossip }, gossip);
      this.peersByScoreThreshold.set({ threshold: ScoreThreshold.mesh }, mesh);
      this.score.set(scores);
    },
    registerScoreWeights(sw) {
      for (const [topic, wsTopic] of sw.byTopic) {
        this.scoreWeights.set({ topic, p: "p1" }, wsTopic.p1w);
        this.scoreWeights.set({ topic, p: "p2" }, wsTopic.p2w);
        this.scoreWeights.set({ topic, p: "p3" }, wsTopic.p3w);
        this.scoreWeights.set({ topic, p: "p3b" }, wsTopic.p3bw);
        this.scoreWeights.set({ topic, p: "p4" }, wsTopic.p4w);
      }
      this.scoreWeights.set({ p: "p5" }, sw.p5w);
      this.scoreWeights.set({ p: "p6" }, sw.p6w);
      this.scoreWeights.set({ p: "p7" }, sw.p7w);
    },
    registerScorePerMesh(mesh, scoreByPeer) {
      const peersPerTopicLabel = /* @__PURE__ */ new Map();
      mesh.forEach((peers, topicStr) => {
        const topicLabel = this.topicStrToLabel.get(topicStr) ?? "unknown";
        let peersInMesh = peersPerTopicLabel.get(topicLabel);
        if (peersInMesh == null) {
          peersInMesh = /* @__PURE__ */ new Set();
          peersPerTopicLabel.set(topicLabel, peersInMesh);
        }
        peers.forEach((p) => peersInMesh?.add(p));
      });
      for (const [topic, peers] of peersPerTopicLabel) {
        const meshScores = [];
        peers.forEach((peer) => {
          meshScores.push(scoreByPeer.get(peer) ?? 0);
        });
        this.scorePerMesh.set({ topic }, meshScores);
      }
    }
  };
}
__name(getMetrics, "getMetrics");

// node_modules/@chainsafe/libp2p-gossipsub/dist/src/errors.js
var InvalidPeerScoreParamsError = class extends Error {
  static name = "InvalidPeerScoreParamsError";
  constructor(message2 = "Invalid peer score params") {
    super(message2);
    this.name = "InvalidPeerScoreParamsError";
  }
};

// node_modules/@chainsafe/libp2p-gossipsub/dist/src/score/peer-score-params.js
var defaultPeerScoreParams = {
  topics: {},
  topicScoreCap: 10,
  appSpecificScore: /* @__PURE__ */ __name(() => 0, "appSpecificScore"),
  appSpecificWeight: 10,
  IPColocationFactorWeight: -5,
  IPColocationFactorThreshold: 10,
  IPColocationFactorWhitelist: /* @__PURE__ */ new Set(),
  behaviourPenaltyWeight: -10,
  behaviourPenaltyThreshold: 0,
  behaviourPenaltyDecay: 0.2,
  decayInterval: 1e3,
  decayToZero: 0.1,
  retainScore: 3600 * 1e3
};
var defaultTopicScoreParams = {
  topicWeight: 0.5,
  timeInMeshWeight: 1,
  timeInMeshQuantum: 1,
  timeInMeshCap: 3600,
  firstMessageDeliveriesWeight: 1,
  firstMessageDeliveriesDecay: 0.5,
  firstMessageDeliveriesCap: 2e3,
  meshMessageDeliveriesWeight: -1,
  meshMessageDeliveriesDecay: 0.5,
  meshMessageDeliveriesCap: 100,
  meshMessageDeliveriesThreshold: 20,
  meshMessageDeliveriesWindow: 10,
  meshMessageDeliveriesActivation: 5e3,
  meshFailurePenaltyWeight: -1,
  meshFailurePenaltyDecay: 0.5,
  invalidMessageDeliveriesWeight: -1,
  invalidMessageDeliveriesDecay: 0.3
};
function createPeerScoreParams(p = {}) {
  return {
    ...defaultPeerScoreParams,
    ...p,
    topics: p.topics != null ? Object.entries(p.topics).reduce((topics, [topic, topicScoreParams]) => {
      topics[topic] = createTopicScoreParams(topicScoreParams);
      return topics;
    }, {}) : {}
  };
}
__name(createPeerScoreParams, "createPeerScoreParams");
function createTopicScoreParams(p = {}) {
  return {
    ...defaultTopicScoreParams,
    ...p
  };
}
__name(createTopicScoreParams, "createTopicScoreParams");
function validatePeerScoreParams(p) {
  for (const [topic, params] of Object.entries(p.topics)) {
    try {
      validateTopicScoreParams(params);
    } catch (e) {
      throw new InvalidPeerScoreParamsError(`invalid score parameters for topic ${topic}: ${e.message}`);
    }
  }
  if (p.topicScoreCap < 0) {
    throw new InvalidPeerScoreParamsError("invalid topic score cap; must be positive (or 0 for no cap)");
  }
  if (p.appSpecificScore === null || p.appSpecificScore === void 0) {
    throw new InvalidPeerScoreParamsError("missing application specific score function");
  }
  if (p.IPColocationFactorWeight > 0) {
    throw new InvalidPeerScoreParamsError("invalid IPColocationFactorWeight; must be negative (or 0 to disable)");
  }
  if (p.IPColocationFactorWeight !== 0 && p.IPColocationFactorThreshold < 1) {
    throw new InvalidPeerScoreParamsError("invalid IPColocationFactorThreshold; must be at least 1");
  }
  if (p.behaviourPenaltyWeight > 0) {
    throw new InvalidPeerScoreParamsError("invalid BehaviourPenaltyWeight; must be negative (or 0 to disable)");
  }
  if (p.behaviourPenaltyWeight !== 0 && (p.behaviourPenaltyDecay <= 0 || p.behaviourPenaltyDecay >= 1)) {
    throw new InvalidPeerScoreParamsError("invalid BehaviourPenaltyDecay; must be between 0 and 1");
  }
  if (p.decayInterval < 1e3) {
    throw new InvalidPeerScoreParamsError("invalid DecayInterval; must be at least 1s");
  }
  if (p.decayToZero <= 0 || p.decayToZero >= 1) {
    throw new InvalidPeerScoreParamsError("invalid DecayToZero; must be between 0 and 1");
  }
}
__name(validatePeerScoreParams, "validatePeerScoreParams");
function validateTopicScoreParams(p) {
  if (p.topicWeight < 0) {
    throw new InvalidPeerScoreParamsError("invalid topic weight; must be >= 0");
  }
  if (p.timeInMeshQuantum === 0) {
    throw new InvalidPeerScoreParamsError("invalid TimeInMeshQuantum; must be non zero");
  }
  if (p.timeInMeshWeight < 0) {
    throw new InvalidPeerScoreParamsError("invalid TimeInMeshWeight; must be positive (or 0 to disable)");
  }
  if (p.timeInMeshWeight !== 0 && p.timeInMeshQuantum <= 0) {
    throw new InvalidPeerScoreParamsError("invalid TimeInMeshQuantum; must be positive");
  }
  if (p.timeInMeshWeight !== 0 && p.timeInMeshCap <= 0) {
    throw new InvalidPeerScoreParamsError("invalid TimeInMeshCap; must be positive");
  }
  if (p.firstMessageDeliveriesWeight < 0) {
    throw new InvalidPeerScoreParamsError("invallid FirstMessageDeliveriesWeight; must be positive (or 0 to disable)");
  }
  if (p.firstMessageDeliveriesWeight !== 0 && (p.firstMessageDeliveriesDecay <= 0 || p.firstMessageDeliveriesDecay >= 1)) {
    throw new InvalidPeerScoreParamsError("invalid FirstMessageDeliveriesDecay; must be between 0 and 1");
  }
  if (p.firstMessageDeliveriesWeight !== 0 && p.firstMessageDeliveriesCap <= 0) {
    throw new InvalidPeerScoreParamsError("invalid FirstMessageDeliveriesCap; must be positive");
  }
  if (p.meshMessageDeliveriesWeight > 0) {
    throw new InvalidPeerScoreParamsError("invalid MeshMessageDeliveriesWeight; must be negative (or 0 to disable)");
  }
  if (p.meshMessageDeliveriesWeight !== 0 && (p.meshMessageDeliveriesDecay <= 0 || p.meshMessageDeliveriesDecay >= 1)) {
    throw new InvalidPeerScoreParamsError("invalid MeshMessageDeliveriesDecay; must be between 0 and 1");
  }
  if (p.meshMessageDeliveriesWeight !== 0 && p.meshMessageDeliveriesCap <= 0) {
    throw new InvalidPeerScoreParamsError("invalid MeshMessageDeliveriesCap; must be positive");
  }
  if (p.meshMessageDeliveriesWeight !== 0 && p.meshMessageDeliveriesThreshold <= 0) {
    throw new InvalidPeerScoreParamsError("invalid MeshMessageDeliveriesThreshold; must be positive");
  }
  if (p.meshMessageDeliveriesWindow < 0) {
    throw new InvalidPeerScoreParamsError("invalid MeshMessageDeliveriesWindow; must be non-negative");
  }
  if (p.meshMessageDeliveriesWeight !== 0 && p.meshMessageDeliveriesActivation < 1e3) {
    throw new InvalidPeerScoreParamsError("invalid MeshMessageDeliveriesActivation; must be at least 1s");
  }
  if (p.meshFailurePenaltyWeight > 0) {
    throw new InvalidPeerScoreParamsError("invalid MeshFailurePenaltyWeight; must be negative (or 0 to disable)");
  }
  if (p.meshFailurePenaltyWeight !== 0 && (p.meshFailurePenaltyDecay <= 0 || p.meshFailurePenaltyDecay >= 1)) {
    throw new InvalidPeerScoreParamsError("invalid MeshFailurePenaltyDecay; must be between 0 and 1");
  }
  if (p.invalidMessageDeliveriesWeight > 0) {
    throw new InvalidPeerScoreParamsError("invalid InvalidMessageDeliveriesWeight; must be negative (or 0 to disable)");
  }
  if (p.invalidMessageDeliveriesDecay <= 0 || p.invalidMessageDeliveriesDecay >= 1) {
    throw new InvalidPeerScoreParamsError("invalid InvalidMessageDeliveriesDecay; must be between 0 and 1");
  }
}
__name(validateTopicScoreParams, "validateTopicScoreParams");

// node_modules/@chainsafe/libp2p-gossipsub/dist/src/score/peer-score-thresholds.js
var defaultPeerScoreThresholds = {
  gossipThreshold: -10,
  publishThreshold: -50,
  graylistThreshold: -80,
  acceptPXThreshold: 10,
  opportunisticGraftThreshold: 20
};
function createPeerScoreThresholds(p = {}) {
  return {
    ...defaultPeerScoreThresholds,
    ...p
  };
}
__name(createPeerScoreThresholds, "createPeerScoreThresholds");

// node_modules/@chainsafe/libp2p-gossipsub/dist/src/utils/set.js
function removeItemsFromSet(superSet, ineed, cond = () => true) {
  const subset = /* @__PURE__ */ new Set();
  if (ineed <= 0)
    return subset;
  for (const id of superSet) {
    if (subset.size >= ineed)
      break;
    if (cond(id)) {
      subset.add(id);
      superSet.delete(id);
    }
  }
  return subset;
}
__name(removeItemsFromSet, "removeItemsFromSet");
function removeFirstNItemsFromSet(superSet, ineed) {
  return removeItemsFromSet(superSet, ineed, () => true);
}
__name(removeFirstNItemsFromSet, "removeFirstNItemsFromSet");
var MapDef = class extends Map {
  static {
    __name(this, "MapDef");
  }
  getDefault;
  constructor(getDefault) {
    super();
    this.getDefault = getDefault;
  }
  getOrDefault(key) {
    let value = super.get(key);
    if (value === void 0) {
      value = this.getDefault();
      this.set(key, value);
    }
    return value;
  }
};

// node_modules/@chainsafe/libp2p-gossipsub/dist/src/score/compute-score.js
function computeScore(peer, pstats, params, peerIPs) {
  let score = 0;
  Object.entries(pstats.topics).forEach(([topic, tstats]) => {
    const topicParams = params.topics[topic];
    if (topicParams === void 0) {
      return;
    }
    let topicScore = 0;
    if (tstats.inMesh) {
      let p1 = tstats.meshTime / topicParams.timeInMeshQuantum;
      if (p1 > topicParams.timeInMeshCap) {
        p1 = topicParams.timeInMeshCap;
      }
      topicScore += p1 * topicParams.timeInMeshWeight;
    }
    let p2 = tstats.firstMessageDeliveries;
    if (p2 > topicParams.firstMessageDeliveriesCap) {
      p2 = topicParams.firstMessageDeliveriesCap;
    }
    topicScore += p2 * topicParams.firstMessageDeliveriesWeight;
    if (tstats.meshMessageDeliveriesActive && tstats.meshMessageDeliveries < topicParams.meshMessageDeliveriesThreshold) {
      const deficit = topicParams.meshMessageDeliveriesThreshold - tstats.meshMessageDeliveries;
      const p3 = deficit * deficit;
      topicScore += p3 * topicParams.meshMessageDeliveriesWeight;
    }
    const p3b = tstats.meshFailurePenalty;
    topicScore += p3b * topicParams.meshFailurePenaltyWeight;
    const p4 = tstats.invalidMessageDeliveries * tstats.invalidMessageDeliveries;
    topicScore += p4 * topicParams.invalidMessageDeliveriesWeight;
    score += topicScore * topicParams.topicWeight;
  });
  if (params.topicScoreCap > 0 && score > params.topicScoreCap) {
    score = params.topicScoreCap;
  }
  const p5 = params.appSpecificScore(peer);
  score += p5 * params.appSpecificWeight;
  pstats.knownIPs.forEach((ip) => {
    if (params.IPColocationFactorWhitelist.has(ip)) {
      return;
    }
    const peersInIP = peerIPs.get(ip);
    const numPeersInIP = peersInIP != null ? peersInIP.size : 0;
    if (numPeersInIP > params.IPColocationFactorThreshold) {
      const surplus = numPeersInIP - params.IPColocationFactorThreshold;
      const p6 = surplus * surplus;
      score += p6 * params.IPColocationFactorWeight;
    }
  });
  if (pstats.behaviourPenalty > params.behaviourPenaltyThreshold) {
    const excess = pstats.behaviourPenalty - params.behaviourPenaltyThreshold;
    const p7 = excess * excess;
    score += p7 * params.behaviourPenaltyWeight;
  }
  return score;
}
__name(computeScore, "computeScore");

// node_modules/@chainsafe/libp2p-gossipsub/dist/src/score/message-deliveries.js
var import_denque = __toESM(require_denque(), 1);
var DeliveryRecordStatus;
(function(DeliveryRecordStatus2) {
  DeliveryRecordStatus2[DeliveryRecordStatus2["unknown"] = 0] = "unknown";
  DeliveryRecordStatus2[DeliveryRecordStatus2["valid"] = 1] = "valid";
  DeliveryRecordStatus2[DeliveryRecordStatus2["invalid"] = 2] = "invalid";
  DeliveryRecordStatus2[DeliveryRecordStatus2["ignored"] = 3] = "ignored";
})(DeliveryRecordStatus || (DeliveryRecordStatus = {}));
var MessageDeliveries = class {
  static {
    __name(this, "MessageDeliveries");
  }
  records;
  queue;
  constructor() {
    this.records = /* @__PURE__ */ new Map();
    this.queue = new import_denque.default();
  }
  getRecord(msgIdStr) {
    return this.records.get(msgIdStr);
  }
  ensureRecord(msgIdStr) {
    let drec = this.records.get(msgIdStr);
    if (drec != null) {
      return drec;
    }
    drec = {
      status: DeliveryRecordStatus.unknown,
      firstSeenTsMs: Date.now(),
      validated: 0,
      peers: /* @__PURE__ */ new Set()
    };
    this.records.set(msgIdStr, drec);
    const entry = {
      msgId: msgIdStr,
      expire: Date.now() + TimeCacheDuration
    };
    this.queue.push(entry);
    return drec;
  }
  gc() {
    const now = Date.now();
    let head = this.queue.peekFront();
    while (head != null && head.expire < now) {
      this.records.delete(head.msgId);
      this.queue.shift();
      head = this.queue.peekFront();
    }
  }
  clear() {
    this.records.clear();
    this.queue.clear();
  }
};

// node_modules/@chainsafe/libp2p-gossipsub/dist/src/score/peer-score.js
var PeerScore = class {
  static {
    __name(this, "PeerScore");
  }
  params;
  metrics;
  /**
   * Per-peer stats for score calculation
   */
  peerStats = /* @__PURE__ */ new Map();
  /**
   * IP colocation tracking; maps IP => set of peers.
   */
  peerIPs = new MapDef(() => /* @__PURE__ */ new Set());
  /**
   * Cache score up to decayInterval if topic stats are unchanged.
   */
  scoreCache = /* @__PURE__ */ new Map();
  /**
   * Recent message delivery timing/participants
   */
  deliveryRecords = new MessageDeliveries();
  _backgroundInterval;
  scoreCacheValidityMs;
  computeScore;
  log;
  constructor(params, metrics, componentLogger, opts) {
    this.params = params;
    this.metrics = metrics;
    validatePeerScoreParams(params);
    this.scoreCacheValidityMs = opts.scoreCacheValidityMs;
    this.computeScore = opts.computeScore ?? computeScore;
    this.log = componentLogger.forComponent("libp2p:gossipsub:score");
  }
  get size() {
    return this.peerStats.size;
  }
  /**
   * Start PeerScore instance
   */
  start() {
    if (this._backgroundInterval != null) {
      this.log("Peer score already running");
      return;
    }
    this._backgroundInterval = setInterval(() => {
      this.background();
    }, this.params.decayInterval);
    this.log("started");
  }
  /**
   * Stop PeerScore instance
   */
  stop() {
    if (this._backgroundInterval == null) {
      this.log("Peer score already stopped");
      return;
    }
    clearInterval(this._backgroundInterval);
    delete this._backgroundInterval;
    this.peerIPs.clear();
    this.peerStats.clear();
    this.deliveryRecords.clear();
    this.log("stopped");
  }
  /**
   * Periodic maintenance
   */
  background() {
    this.refreshScores();
    this.deliveryRecords.gc();
  }
  dumpPeerScoreStats() {
    return Object.fromEntries(Array.from(this.peerStats.entries()).map(([peer, stats]) => [peer, stats]));
  }
  messageFirstSeenTimestampMs(msgIdStr) {
    const drec = this.deliveryRecords.getRecord(msgIdStr);
    return drec != null ? drec.firstSeenTsMs : null;
  }
  /**
   * Decays scores, and purges score records for disconnected peers once their expiry has elapsed.
   */
  refreshScores() {
    const now = Date.now();
    const decayToZero = this.params.decayToZero;
    this.peerStats.forEach((pstats, id) => {
      if (!pstats.connected) {
        if (now > pstats.expire) {
          this.removeIPsForPeer(id, pstats.knownIPs);
          this.peerStats.delete(id);
          this.scoreCache.delete(id);
        }
        return;
      }
      Object.entries(pstats.topics).forEach(([topic, tstats]) => {
        const tparams = this.params.topics[topic];
        if (tparams === void 0) {
          return;
        }
        tstats.firstMessageDeliveries *= tparams.firstMessageDeliveriesDecay;
        if (tstats.firstMessageDeliveries < decayToZero) {
          tstats.firstMessageDeliveries = 0;
        }
        tstats.meshMessageDeliveries *= tparams.meshMessageDeliveriesDecay;
        if (tstats.meshMessageDeliveries < decayToZero) {
          tstats.meshMessageDeliveries = 0;
        }
        tstats.meshFailurePenalty *= tparams.meshFailurePenaltyDecay;
        if (tstats.meshFailurePenalty < decayToZero) {
          tstats.meshFailurePenalty = 0;
        }
        tstats.invalidMessageDeliveries *= tparams.invalidMessageDeliveriesDecay;
        if (tstats.invalidMessageDeliveries < decayToZero) {
          tstats.invalidMessageDeliveries = 0;
        }
        if (tstats.inMesh) {
          tstats.meshTime = now - tstats.graftTime;
          if (tstats.meshTime > tparams.meshMessageDeliveriesActivation) {
            tstats.meshMessageDeliveriesActive = true;
          }
        }
      });
      pstats.behaviourPenalty *= this.params.behaviourPenaltyDecay;
      if (pstats.behaviourPenalty < decayToZero) {
        pstats.behaviourPenalty = 0;
      }
    });
  }
  /**
   * Return the score for a peer
   */
  score(id) {
    this.metrics?.scoreFnCalls.inc();
    const pstats = this.peerStats.get(id);
    if (pstats == null) {
      return 0;
    }
    const now = Date.now();
    const cacheEntry = this.scoreCache.get(id);
    if (cacheEntry != null && cacheEntry.cacheUntil > now) {
      return cacheEntry.score;
    }
    this.metrics?.scoreFnRuns.inc();
    const score = this.computeScore(id, pstats, this.params, this.peerIPs);
    const cacheUntil = now + this.scoreCacheValidityMs;
    if (cacheEntry != null) {
      this.metrics?.scoreCachedDelta.observe(Math.abs(score - cacheEntry.score));
      cacheEntry.score = score;
      cacheEntry.cacheUntil = cacheUntil;
    } else {
      this.scoreCache.set(id, { score, cacheUntil });
    }
    return score;
  }
  /**
   * Apply a behavioural penalty to a peer
   */
  addPenalty(id, penalty, penaltyLabel) {
    const pstats = this.peerStats.get(id);
    if (pstats != null) {
      pstats.behaviourPenalty += penalty;
      this.metrics?.onScorePenalty(penaltyLabel);
    }
  }
  addPeer(id) {
    const pstats = {
      connected: true,
      expire: 0,
      topics: {},
      knownIPs: /* @__PURE__ */ new Set(),
      behaviourPenalty: 0
    };
    this.peerStats.set(id, pstats);
  }
  /** Adds a new IP to a peer, if the peer is not known the update is ignored */
  addIP(id, ip) {
    const pstats = this.peerStats.get(id);
    if (pstats != null) {
      pstats.knownIPs.add(ip);
    }
    this.peerIPs.getOrDefault(ip).add(id);
  }
  /** Remove peer association with IP */
  removeIP(id, ip) {
    const pstats = this.peerStats.get(id);
    if (pstats != null) {
      pstats.knownIPs.delete(ip);
    }
    const peersWithIP = this.peerIPs.get(ip);
    if (peersWithIP != null) {
      peersWithIP.delete(id);
      if (peersWithIP.size === 0) {
        this.peerIPs.delete(ip);
      }
    }
  }
  removePeer(id) {
    const pstats = this.peerStats.get(id);
    if (pstats == null) {
      return;
    }
    if (this.score(id) > 0) {
      this.removeIPsForPeer(id, pstats.knownIPs);
      this.peerStats.delete(id);
      return;
    }
    Object.entries(pstats.topics).forEach(([topic, tstats]) => {
      tstats.firstMessageDeliveries = 0;
      const threshold = this.params.topics[topic].meshMessageDeliveriesThreshold;
      if (tstats.inMesh && tstats.meshMessageDeliveriesActive && tstats.meshMessageDeliveries < threshold) {
        const deficit = threshold - tstats.meshMessageDeliveries;
        tstats.meshFailurePenalty += deficit * deficit;
      }
      tstats.inMesh = false;
      tstats.meshMessageDeliveriesActive = false;
    });
    pstats.connected = false;
    pstats.expire = Date.now() + this.params.retainScore;
  }
  /** Handles scoring functionality as a peer GRAFTs to a topic. */
  graft(id, topic) {
    const pstats = this.peerStats.get(id);
    if (pstats != null) {
      const tstats = this.getPtopicStats(pstats, topic);
      if (tstats != null) {
        tstats.inMesh = true;
        tstats.graftTime = Date.now();
        tstats.meshTime = 0;
        tstats.meshMessageDeliveriesActive = false;
      }
    }
  }
  /** Handles scoring functionality as a peer PRUNEs from a topic. */
  prune(id, topic) {
    const pstats = this.peerStats.get(id);
    if (pstats != null) {
      const tstats = this.getPtopicStats(pstats, topic);
      if (tstats != null) {
        const threshold = this.params.topics[topic].meshMessageDeliveriesThreshold;
        if (tstats.meshMessageDeliveriesActive && tstats.meshMessageDeliveries < threshold) {
          const deficit = threshold - tstats.meshMessageDeliveries;
          tstats.meshFailurePenalty += deficit * deficit;
        }
        tstats.meshMessageDeliveriesActive = false;
        tstats.inMesh = false;
      }
    }
  }
  validateMessage(msgIdStr) {
    this.deliveryRecords.ensureRecord(msgIdStr);
  }
  deliverMessage(from3, msgIdStr, topic) {
    this.markFirstMessageDelivery(from3, topic);
    const drec = this.deliveryRecords.ensureRecord(msgIdStr);
    const now = Date.now();
    if (drec.status !== DeliveryRecordStatus.unknown) {
      this.log("unexpected delivery: message from %s was first seen %s ago and has delivery status %s", from3, now - drec.firstSeenTsMs, DeliveryRecordStatus[drec.status]);
      return;
    }
    drec.status = DeliveryRecordStatus.valid;
    drec.validated = now;
    drec.peers.forEach((p) => {
      if (p !== from3.toString()) {
        this.markDuplicateMessageDelivery(p, topic);
      }
    });
  }
  /**
   * Similar to `rejectMessage` except does not require the message id or reason for an invalid message.
   */
  rejectInvalidMessage(from3, topic) {
    this.markInvalidMessageDelivery(from3, topic);
  }
  rejectMessage(from3, msgIdStr, topic, reason) {
    switch (reason) {
      // these messages are not tracked, but the peer is penalized as they are invalid
      case RejectReason.Error:
        this.markInvalidMessageDelivery(from3, topic);
        return;
      // we ignore those messages, so do nothing.
      case RejectReason.Blacklisted:
        return;
    }
    const drec = this.deliveryRecords.ensureRecord(msgIdStr);
    if (drec.status !== DeliveryRecordStatus.unknown) {
      this.log("unexpected rejection: message from %s was first seen %s ago and has delivery status %d", from3, Date.now() - drec.firstSeenTsMs, DeliveryRecordStatus[drec.status]);
      return;
    }
    if (reason === RejectReason.Ignore) {
      drec.status = DeliveryRecordStatus.ignored;
      drec.peers.clear();
      return;
    }
    drec.status = DeliveryRecordStatus.invalid;
    this.markInvalidMessageDelivery(from3, topic);
    drec.peers.forEach((p) => {
      this.markInvalidMessageDelivery(p, topic);
    });
    drec.peers.clear();
  }
  duplicateMessage(from3, msgIdStr, topic) {
    const drec = this.deliveryRecords.ensureRecord(msgIdStr);
    if (drec.peers.has(from3)) {
      return;
    }
    switch (drec.status) {
      case DeliveryRecordStatus.unknown:
        drec.peers.add(from3);
        break;
      case DeliveryRecordStatus.valid:
        drec.peers.add(from3);
        this.markDuplicateMessageDelivery(from3, topic, drec.validated);
        break;
      case DeliveryRecordStatus.invalid:
        this.markInvalidMessageDelivery(from3, topic);
        break;
      case DeliveryRecordStatus.ignored:
        break;
    }
  }
  /**
   * Increments the "invalid message deliveries" counter for all scored topics the message is published in.
   */
  markInvalidMessageDelivery(from3, topic) {
    const pstats = this.peerStats.get(from3);
    if (pstats != null) {
      const tstats = this.getPtopicStats(pstats, topic);
      if (tstats != null) {
        tstats.invalidMessageDeliveries += 1;
      }
    }
  }
  /**
   * Increments the "first message deliveries" counter for all scored topics the message is published in,
   * as well as the "mesh message deliveries" counter, if the peer is in the mesh for the topic.
   * Messages already known (with the seenCache) are counted with markDuplicateMessageDelivery()
   */
  markFirstMessageDelivery(from3, topic) {
    const pstats = this.peerStats.get(from3);
    if (pstats != null) {
      const tstats = this.getPtopicStats(pstats, topic);
      if (tstats != null) {
        let cap = this.params.topics[topic].firstMessageDeliveriesCap;
        tstats.firstMessageDeliveries = Math.min(cap, tstats.firstMessageDeliveries + 1);
        if (tstats.inMesh) {
          cap = this.params.topics[topic].meshMessageDeliveriesCap;
          tstats.meshMessageDeliveries = Math.min(cap, tstats.meshMessageDeliveries + 1);
        }
      }
    }
  }
  /**
   * Increments the "mesh message deliveries" counter for messages we've seen before,
   * as long the message was received within the P3 window.
   */
  markDuplicateMessageDelivery(from3, topic, validatedTime) {
    const pstats = this.peerStats.get(from3);
    if (pstats != null) {
      const now = validatedTime !== void 0 ? Date.now() : 0;
      const tstats = this.getPtopicStats(pstats, topic);
      if (tstats != null && tstats.inMesh) {
        const tparams = this.params.topics[topic];
        if (validatedTime !== void 0) {
          const deliveryDelayMs = now - validatedTime;
          const isLateDelivery = deliveryDelayMs > tparams.meshMessageDeliveriesWindow;
          this.metrics?.onDuplicateMsgDelivery(topic, deliveryDelayMs, isLateDelivery);
          if (isLateDelivery) {
            return;
          }
        }
        const cap = tparams.meshMessageDeliveriesCap;
        tstats.meshMessageDeliveries = Math.min(cap, tstats.meshMessageDeliveries + 1);
      }
    }
  }
  /**
   * Removes an IP list from the tracking list for a peer.
   */
  removeIPsForPeer(id, ipsToRemove) {
    for (const ipToRemove of ipsToRemove) {
      const peerSet = this.peerIPs.get(ipToRemove);
      if (peerSet != null) {
        peerSet.delete(id);
        if (peerSet.size === 0) {
          this.peerIPs.delete(ipToRemove);
        }
      }
    }
  }
  /**
   * Returns topic stats if they exist, otherwise if the supplied parameters score the
   * topic, inserts the default stats and returns a reference to those. If neither apply, returns None.
   */
  getPtopicStats(pstats, topic) {
    let topicStats = pstats.topics[topic];
    if (topicStats !== void 0) {
      return topicStats;
    }
    if (this.params.topics[topic] !== void 0) {
      topicStats = {
        inMesh: false,
        graftTime: 0,
        meshTime: 0,
        firstMessageDeliveries: 0,
        meshMessageDeliveries: 0,
        meshMessageDeliveriesActive: false,
        meshFailurePenalty: 0,
        invalidMessageDeliveries: 0
      };
      pstats.topics[topic] = topicStats;
      return topicStats;
    }
    return null;
  }
};

// node_modules/@chainsafe/libp2p-gossipsub/dist/src/score/scoreMetrics.js
function computeScoreWeights(peer, pstats, params, peerIPs, topicStrToLabel) {
  let score = 0;
  const byTopic = /* @__PURE__ */ new Map();
  Object.entries(pstats.topics).forEach(([topic, tstats]) => {
    const topicLabel = topicStrToLabel.get(topic) ?? "unknown";
    const topicParams = params.topics[topic];
    if (topicParams === void 0) {
      return;
    }
    let topicScores = byTopic.get(topicLabel);
    if (topicScores == null) {
      topicScores = {
        p1w: 0,
        p2w: 0,
        p3w: 0,
        p3bw: 0,
        p4w: 0
      };
      byTopic.set(topicLabel, topicScores);
    }
    let p1w = 0;
    let p2w = 0;
    let p3w = 0;
    let p3bw = 0;
    let p4w = 0;
    if (tstats.inMesh) {
      const p1 = Math.max(tstats.meshTime / topicParams.timeInMeshQuantum, topicParams.timeInMeshCap);
      p1w += p1 * topicParams.timeInMeshWeight;
    }
    let p2 = tstats.firstMessageDeliveries;
    if (p2 > topicParams.firstMessageDeliveriesCap) {
      p2 = topicParams.firstMessageDeliveriesCap;
    }
    p2w += p2 * topicParams.firstMessageDeliveriesWeight;
    if (tstats.meshMessageDeliveriesActive && tstats.meshMessageDeliveries < topicParams.meshMessageDeliveriesThreshold) {
      const deficit = topicParams.meshMessageDeliveriesThreshold - tstats.meshMessageDeliveries;
      const p3 = deficit * deficit;
      p3w += p3 * topicParams.meshMessageDeliveriesWeight;
    }
    const p3b = tstats.meshFailurePenalty;
    p3bw += p3b * topicParams.meshFailurePenaltyWeight;
    const p4 = tstats.invalidMessageDeliveries * tstats.invalidMessageDeliveries;
    p4w += p4 * topicParams.invalidMessageDeliveriesWeight;
    score += (p1w + p2w + p3w + p3bw + p4w) * topicParams.topicWeight;
    topicScores.p1w += p1w;
    topicScores.p2w += p2w;
    topicScores.p3w += p3w;
    topicScores.p3bw += p3bw;
    topicScores.p4w += p4w;
  });
  if (params.topicScoreCap > 0 && score > params.topicScoreCap) {
    score = params.topicScoreCap;
    const capF = params.topicScoreCap / score;
    for (const ws of byTopic.values()) {
      ws.p1w *= capF;
      ws.p2w *= capF;
      ws.p3w *= capF;
      ws.p3bw *= capF;
      ws.p4w *= capF;
    }
  }
  let p5w = 0;
  let p6w = 0;
  let p7w = 0;
  const p5 = params.appSpecificScore(peer);
  p5w += p5 * params.appSpecificWeight;
  pstats.knownIPs.forEach((ip) => {
    if (params.IPColocationFactorWhitelist.has(ip)) {
      return;
    }
    const peersInIP = peerIPs.get(ip);
    const numPeersInIP = peersInIP != null ? peersInIP.size : 0;
    if (numPeersInIP > params.IPColocationFactorThreshold) {
      const surplus = numPeersInIP - params.IPColocationFactorThreshold;
      const p6 = surplus * surplus;
      p6w += p6 * params.IPColocationFactorWeight;
    }
  });
  const p7 = pstats.behaviourPenalty * pstats.behaviourPenalty;
  p7w += p7 * params.behaviourPenaltyWeight;
  score += p5w + p6w + p7w;
  return {
    byTopic,
    p5w,
    p6w,
    p7w,
    score
  };
}
__name(computeScoreWeights, "computeScoreWeights");
function computeAllPeersScoreWeights(peerIdStrs, peerStats, params, peerIPs, topicStrToLabel) {
  const sw = {
    byTopic: /* @__PURE__ */ new Map(),
    p5w: [],
    p6w: [],
    p7w: [],
    score: []
  };
  for (const peerIdStr of peerIdStrs) {
    const pstats = peerStats.get(peerIdStr);
    if (pstats != null) {
      const swPeer = computeScoreWeights(peerIdStr, pstats, params, peerIPs, topicStrToLabel);
      for (const [topic, swPeerTopic] of swPeer.byTopic) {
        let swTopic = sw.byTopic.get(topic);
        if (swTopic == null) {
          swTopic = {
            p1w: [],
            p2w: [],
            p3w: [],
            p3bw: [],
            p4w: []
          };
          sw.byTopic.set(topic, swTopic);
        }
        swTopic.p1w.push(swPeerTopic.p1w);
        swTopic.p2w.push(swPeerTopic.p2w);
        swTopic.p3w.push(swPeerTopic.p3w);
        swTopic.p3bw.push(swPeerTopic.p3bw);
        swTopic.p4w.push(swPeerTopic.p4w);
      }
      sw.p5w.push(swPeer.p5w);
      sw.p6w.push(swPeer.p6w);
      sw.p7w.push(swPeer.p7w);
      sw.score.push(swPeer.score);
    } else {
      sw.p5w.push(0);
      sw.p6w.push(0);
      sw.p7w.push(0);
      sw.score.push(0);
    }
  }
  return sw;
}
__name(computeAllPeersScoreWeights, "computeAllPeersScoreWeights");

// node_modules/@chainsafe/libp2p-gossipsub/dist/src/stream.js
var OutboundStream = class {
  static {
    __name(this, "OutboundStream");
  }
  rawStream;
  pushable;
  closeController;
  maxBufferSize;
  constructor(rawStream, errCallback, opts) {
    this.rawStream = rawStream;
    this.pushable = pushable();
    this.closeController = new AbortController();
    this.maxBufferSize = opts.maxBufferSize ?? Infinity;
    this.closeController.signal.addEventListener("abort", () => {
      rawStream.close().catch((err) => {
        rawStream.abort(err);
      });
    });
    pipe(this.pushable, this.rawStream).catch(errCallback);
  }
  get protocol() {
    return this.rawStream.protocol;
  }
  push(data) {
    if (this.pushable.readableLength > this.maxBufferSize) {
      throw Error(`OutboundStream buffer full, size > ${this.maxBufferSize}`);
    }
    this.pushable.push(encode6.single(data));
  }
  /**
   * Same to push() but this is prefixed data so no need to encode length prefixed again
   */
  pushPrefixed(data) {
    if (this.pushable.readableLength > this.maxBufferSize) {
      throw Error(`OutboundStream buffer full, size > ${this.maxBufferSize}`);
    }
    this.pushable.push(data);
  }
  async close() {
    this.closeController.abort();
    await this.pushable.return();
  }
};
var InboundStream = class {
  static {
    __name(this, "InboundStream");
  }
  source;
  rawStream;
  closeController;
  constructor(rawStream, opts = {}) {
    this.rawStream = rawStream;
    this.closeController = new AbortController();
    this.closeController.signal.addEventListener("abort", () => {
      rawStream.close().catch((err) => {
        rawStream.abort(err);
      });
    });
    this.source = pipe(this.rawStream, (source) => decode7(source, opts));
  }
  async close() {
    this.closeController.abort();
  }
};

// node_modules/@chainsafe/libp2p-gossipsub/dist/src/tracer.js
var IWantTracer = class {
  static {
    __name(this, "IWantTracer");
  }
  gossipsubIWantFollowupMs;
  msgIdToStrFn;
  metrics;
  /**
   * Promises to deliver a message
   * Map per message id, per peer, promise expiration time
   */
  promises = /* @__PURE__ */ new Map();
  /**
   * First request time by msgId. Used for metrics to track expire times.
   * Necessary to know if peers are actually breaking promises or simply sending them a bit later
   */
  requestMsByMsg = /* @__PURE__ */ new Map();
  requestMsByMsgExpire;
  constructor(gossipsubIWantFollowupMs, msgIdToStrFn, metrics) {
    this.gossipsubIWantFollowupMs = gossipsubIWantFollowupMs;
    this.msgIdToStrFn = msgIdToStrFn;
    this.metrics = metrics;
    this.requestMsByMsgExpire = 10 * gossipsubIWantFollowupMs;
  }
  get size() {
    return this.promises.size;
  }
  get requestMsByMsgSize() {
    return this.requestMsByMsg.size;
  }
  /**
   * Track a promise to deliver a message from a list of msgIds we are requesting
   */
  addPromise(from3, msgIds) {
    const ix = Math.floor(Math.random() * msgIds.length);
    const msgId2 = msgIds[ix];
    const msgIdStr = this.msgIdToStrFn(msgId2);
    let expireByPeer = this.promises.get(msgIdStr);
    if (expireByPeer == null) {
      expireByPeer = /* @__PURE__ */ new Map();
      this.promises.set(msgIdStr, expireByPeer);
    }
    const now = Date.now();
    if (!expireByPeer.has(from3)) {
      expireByPeer.set(from3, now + this.gossipsubIWantFollowupMs);
      if (this.metrics != null) {
        this.metrics.iwantPromiseStarted.inc(1);
        if (!this.requestMsByMsg.has(msgIdStr)) {
          this.requestMsByMsg.set(msgIdStr, now);
        }
      }
    }
  }
  /**
   * Returns the number of broken promises for each peer who didn't follow up on an IWANT request.
   *
   * This should be called not too often relative to the expire times, since it iterates over the whole data.
   */
  getBrokenPromises() {
    const now = Date.now();
    const result = /* @__PURE__ */ new Map();
    let brokenPromises = 0;
    this.promises.forEach((expireByPeer, msgId2) => {
      expireByPeer.forEach((expire, p) => {
        if (expire < now) {
          result.set(p, (result.get(p) ?? 0) + 1);
          expireByPeer.delete(p);
          brokenPromises++;
        }
      });
      if (expireByPeer.size === 0) {
        this.promises.delete(msgId2);
      }
    });
    this.metrics?.iwantPromiseBroken.inc(brokenPromises);
    return result;
  }
  /**
   * Someone delivered a message, stop tracking promises for it
   */
  deliverMessage(msgIdStr, isDuplicate = false) {
    this.trackMessage(msgIdStr);
    const expireByPeer = this.promises.get(msgIdStr);
    if (expireByPeer != null) {
      this.promises.delete(msgIdStr);
      if (this.metrics != null) {
        this.metrics.iwantPromiseResolved.inc(1);
        if (isDuplicate)
          this.metrics.iwantPromiseResolvedFromDuplicate.inc(1);
        this.metrics.iwantPromiseResolvedPeers.inc(expireByPeer.size);
      }
    }
  }
  /**
   * A message got rejected, so we can stop tracking promises and let the score penalty apply from invalid message delivery,
   * unless its an obviously invalid message.
   */
  rejectMessage(msgIdStr, reason) {
    this.trackMessage(msgIdStr);
    switch (reason) {
      case RejectReason.Error:
        return;
      default:
        break;
    }
    this.promises.delete(msgIdStr);
  }
  clear() {
    this.promises.clear();
  }
  prune() {
    const maxMs = Date.now() - this.requestMsByMsgExpire;
    let count = 0;
    for (const [k, v] of this.requestMsByMsg.entries()) {
      if (v < maxMs) {
        this.requestMsByMsg.delete(k);
        count++;
      } else {
        break;
      }
    }
    this.metrics?.iwantMessagePruned.inc(count);
  }
  trackMessage(msgIdStr) {
    if (this.metrics != null) {
      const requestMs = this.requestMsByMsg.get(msgIdStr);
      if (requestMs !== void 0) {
        this.metrics.iwantPromiseDeliveryTime.observe((Date.now() - requestMs) / 1e3);
        this.requestMsByMsg.delete(msgIdStr);
      }
    }
  }
};

// node_modules/@chainsafe/libp2p-gossipsub/dist/src/utils/buildRawMessage.js
var SignPrefix = fromString2("libp2p-pubsub:");
async function buildRawMessage(publishConfig, topic, originalData, transformedData) {
  switch (publishConfig.type) {
    case PublishConfigType.Signing: {
      const rpcMsg = {
        from: publishConfig.author.toMultihash().bytes,
        data: transformedData,
        seqno: randomBytes2(8),
        topic,
        signature: void 0,
        // Exclude signature field for signing
        key: void 0
        // Exclude key field for signing
      };
      const bytes = concat([SignPrefix, RPC.Message.encode(rpcMsg)]);
      rpcMsg.signature = await publishConfig.privateKey.sign(bytes);
      rpcMsg.key = publishConfig.key;
      const msg = {
        type: "signed",
        from: publishConfig.author,
        data: originalData,
        sequenceNumber: BigInt(`0x${toString2(rpcMsg.seqno ?? new Uint8Array(0), "base16")}`),
        topic,
        signature: rpcMsg.signature,
        key: publicKeyFromProtobuf(rpcMsg.key)
      };
      return {
        raw: rpcMsg,
        msg
      };
    }
    case PublishConfigType.Anonymous: {
      return {
        raw: {
          from: void 0,
          data: transformedData,
          seqno: void 0,
          topic,
          signature: void 0,
          key: void 0
        },
        msg: {
          type: "unsigned",
          data: originalData,
          topic
        }
      };
    }
    default:
      throw new Error("Unreachable");
  }
}
__name(buildRawMessage, "buildRawMessage");
async function validateToRawMessage(signaturePolicy, msg) {
  switch (signaturePolicy) {
    case StrictNoSign:
      if (msg.signature != null)
        return { valid: false, error: ValidateError.SignaturePresent };
      if (msg.seqno != null)
        return { valid: false, error: ValidateError.SeqnoPresent };
      if (msg.from != null)
        return { valid: false, error: ValidateError.FromPresent };
      return { valid: true, message: { type: "unsigned", topic: msg.topic, data: msg.data ?? new Uint8Array(0) } };
    case StrictSign: {
      if (msg.seqno == null)
        return { valid: false, error: ValidateError.InvalidSeqno };
      if (msg.seqno.length !== 8) {
        return { valid: false, error: ValidateError.InvalidSeqno };
      }
      if (msg.signature == null)
        return { valid: false, error: ValidateError.InvalidSignature };
      if (msg.from == null)
        return { valid: false, error: ValidateError.InvalidPeerId };
      let fromPeerId;
      try {
        fromPeerId = peerIdFromMultihash(decode4(msg.from));
      } catch (e) {
        return { valid: false, error: ValidateError.InvalidPeerId };
      }
      let publicKey;
      if (msg.key != null) {
        publicKey = publicKeyFromProtobuf(msg.key);
        if (fromPeerId.publicKey !== void 0 && !publicKey.equals(fromPeerId.publicKey)) {
          return { valid: false, error: ValidateError.InvalidPeerId };
        }
      } else {
        if (fromPeerId.publicKey == null) {
          return { valid: false, error: ValidateError.InvalidPeerId };
        }
        publicKey = fromPeerId.publicKey;
      }
      const rpcMsgPreSign = {
        from: msg.from,
        data: msg.data,
        seqno: msg.seqno,
        topic: msg.topic,
        signature: void 0,
        // Exclude signature field for signing
        key: void 0
        // Exclude key field for signing
      };
      const bytes = concat([SignPrefix, RPC.Message.encode(rpcMsgPreSign)]);
      if (!await publicKey.verify(bytes, msg.signature)) {
        return { valid: false, error: ValidateError.InvalidSignature };
      }
      return {
        valid: true,
        message: {
          type: "signed",
          from: fromPeerId,
          data: msg.data ?? new Uint8Array(0),
          sequenceNumber: BigInt(`0x${toString2(msg.seqno, "base16")}`),
          topic: msg.topic,
          signature: msg.signature,
          key: publicKey
        }
      };
    }
    default:
      throw new Error("Unreachable");
  }
}
__name(validateToRawMessage, "validateToRawMessage");

// node_modules/@chainsafe/libp2p-gossipsub/dist/src/utils/create-gossip-rpc.js
function createGossipRpc(messages = [], control) {
  return {
    subscriptions: [],
    messages,
    control: control !== void 0 ? {
      graft: control.graft ?? [],
      prune: control.prune ?? [],
      ihave: control.ihave ?? [],
      iwant: control.iwant ?? [],
      idontwant: control.idontwant ?? []
    } : void 0
  };
}
__name(createGossipRpc, "createGossipRpc");
function ensureControl(rpc) {
  if (rpc.control === void 0) {
    rpc.control = {
      graft: [],
      prune: [],
      ihave: [],
      iwant: [],
      idontwant: []
    };
  }
  return rpc;
}
__name(ensureControl, "ensureControl");

// node_modules/@chainsafe/libp2p-gossipsub/dist/src/utils/shuffle.js
function shuffle(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  const randInt = /* @__PURE__ */ __name(() => {
    return Math.floor(Math.random() * Math.floor(arr.length));
  }, "randInt");
  for (let i = 0; i < arr.length; i++) {
    const j = randInt();
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}
__name(shuffle, "shuffle");

// node_modules/@chainsafe/libp2p-gossipsub/dist/src/utils/messageIdToString.js
function messageIdToString(msgId2) {
  return toString2(msgId2, "base64");
}
__name(messageIdToString, "messageIdToString");

// node_modules/@chainsafe/libp2p-gossipsub/dist/src/utils/publishConfig.js
function getPublishConfigFromPeerId(signaturePolicy, peerId, privateKey) {
  switch (signaturePolicy) {
    case StrictSign: {
      return {
        type: PublishConfigType.Signing,
        author: peerId,
        key: publicKeyToProtobuf(privateKey.publicKey),
        privateKey
      };
    }
    case StrictNoSign:
      return {
        type: PublishConfigType.Anonymous
      };
    default:
      throw new Error(`Unknown signature policy "${signaturePolicy}"`);
  }
}
__name(getPublishConfigFromPeerId, "getPublishConfigFromPeerId");

// node_modules/@libp2p/pubsub/dist/src/utils.js
var msgId = /* @__PURE__ */ __name((key, seqno) => {
  const seqnoBytes = fromString2(seqno.toString(16).padStart(16, "0"), "base16");
  const keyBytes = publicKeyToProtobuf(key);
  const msgId2 = new Uint8Array(keyBytes.byteLength + seqnoBytes.length);
  msgId2.set(keyBytes, 0);
  msgId2.set(seqnoBytes, keyBytes.byteLength);
  return msgId2;
}, "msgId");

// node_modules/@chainsafe/libp2p-gossipsub/dist/src/utils/msgIdFn.js
function msgIdFnStrictSign(msg) {
  if (msg.type !== "signed") {
    throw new Error("expected signed message type");
  }
  if (msg.sequenceNumber == null)
    throw Error("missing seqno field");
  return msgId(msg.from.publicKey ?? msg.key, msg.sequenceNumber);
}
__name(msgIdFnStrictSign, "msgIdFnStrictSign");
async function msgIdFnStrictNoSign(msg) {
  return sha256.encode(msg.data);
}
__name(msgIdFnStrictNoSign, "msgIdFnStrictNoSign");

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

// node_modules/@chainsafe/is-ip/lib/is-ip.js
function isIPv4(input) {
  return Boolean(parseIPv4(input));
}
__name(isIPv4, "isIPv4");
function isIPv6(input) {
  return Boolean(parseIPv6(input));
}
__name(isIPv6, "isIPv6");

// node_modules/@chainsafe/libp2p-gossipsub/node_modules/@multiformats/multiaddr/dist/src/constants.js
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

// node_modules/@chainsafe/libp2p-gossipsub/node_modules/@multiformats/multiaddr/dist/src/errors.js
var InvalidMultiaddrError = class extends Error {
  static name = "InvalidMultiaddrError";
  name = "InvalidMultiaddrError";
};
var ValidationError = class extends Error {
  static name = "ValidationError";
  name = "ValidationError";
};
var UnknownProtocolError = class extends Error {
  static name = "UnknownProtocolError";
  name = "UnknownProtocolError";
};

// node_modules/@chainsafe/libp2p-gossipsub/node_modules/@multiformats/multiaddr/dist/src/utils.js
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

// node_modules/@chainsafe/libp2p-gossipsub/node_modules/@multiformats/multiaddr/dist/src/validation.js
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

// node_modules/@chainsafe/libp2p-gossipsub/node_modules/@multiformats/multiaddr/dist/src/registry.js
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

// node_modules/@chainsafe/libp2p-gossipsub/node_modules/@multiformats/multiaddr/dist/src/convert.js
function convertToString(proto, buf) {
  const protocol = registry.getProtocol(proto);
  return protocol.bytesToValue?.(buf) ?? toString2(buf, "base16");
}
__name(convertToString, "convertToString");

// node_modules/@chainsafe/libp2p-gossipsub/dist/src/utils/multiaddr.js
var Protocol;
(function(Protocol2) {
  Protocol2[Protocol2["ip4"] = 4] = "ip4";
  Protocol2[Protocol2["ip6"] = 41] = "ip6";
})(Protocol || (Protocol = {}));
function multiaddrToIPStr(multiaddr) {
  for (const tuple of multiaddr.tuples()) {
    switch (tuple[0]) {
      case Protocol.ip4:
      case Protocol.ip6:
        return convertToString(tuple[0], tuple[1]);
      default:
        break;
    }
  }
  return null;
}
__name(multiaddrToIPStr, "multiaddrToIPStr");

// node_modules/@chainsafe/libp2p-gossipsub/dist/src/utils/time-cache.js
var SimpleTimeCache = class {
  static {
    __name(this, "SimpleTimeCache");
  }
  entries = /* @__PURE__ */ new Map();
  validityMs;
  constructor(opts) {
    this.validityMs = opts.validityMs;
  }
  get size() {
    return this.entries.size;
  }
  /** Returns true if there was a key collision and the entry is dropped */
  put(key, value) {
    if (this.entries.has(key)) {
      return true;
    }
    this.entries.set(key, { value, validUntilMs: Date.now() + this.validityMs });
    return false;
  }
  prune() {
    const now = Date.now();
    for (const [k, v] of this.entries.entries()) {
      if (v.validUntilMs < now) {
        this.entries.delete(k);
      } else {
        break;
      }
    }
  }
  has(key) {
    return this.entries.has(key);
  }
  get(key) {
    const value = this.entries.get(key);
    return value != null && value.validUntilMs >= Date.now() ? value.value : void 0;
  }
  clear() {
    this.entries.clear();
  }
};

// node_modules/@chainsafe/libp2p-gossipsub/dist/src/index.js
var multicodec = GossipsubIDv12;
var GossipStatusCode;
(function(GossipStatusCode2) {
  GossipStatusCode2[GossipStatusCode2["started"] = 0] = "started";
  GossipStatusCode2[GossipStatusCode2["stopped"] = 1] = "stopped";
})(GossipStatusCode || (GossipStatusCode = {}));
var GossipSub = class extends TypedEventEmitter {
  static {
    __name(this, "GossipSub");
  }
  /**
   * The signature policy to follow by default
   */
  globalSignaturePolicy;
  multicodecs = [GossipsubIDv12, GossipsubIDv11, GossipsubIDv10];
  publishConfig;
  dataTransform;
  // State
  peers = /* @__PURE__ */ new Map();
  streamsInbound = /* @__PURE__ */ new Map();
  streamsOutbound = /* @__PURE__ */ new Map();
  /** Ensures outbound streams are created sequentially */
  outboundInflightQueue = pushable({ objectMode: true });
  /** Direct peers */
  direct = /* @__PURE__ */ new Set();
  /** Floodsub peers */
  floodsubPeers = /* @__PURE__ */ new Set();
  /** Cache of seen messages */
  seenCache;
  /**
   * Map of peer id and AcceptRequestWhileListEntry
   */
  acceptFromWhitelist = /* @__PURE__ */ new Map();
  /**
   * Map of topics to which peers are subscribed to
   */
  topics = /* @__PURE__ */ new Map();
  /**
   * List of our subscriptions
   */
  subscriptions = /* @__PURE__ */ new Set();
  /**
   * Map of topic meshes
   * topic => peer id set
   */
  mesh = /* @__PURE__ */ new Map();
  /**
   * Map of topics to set of peers. These mesh peers are the ones to which we are publishing without a topic membership
   * topic => peer id set
   */
  fanout = /* @__PURE__ */ new Map();
  /**
   * Map of last publish time for fanout topics
   * topic => last publish time
   */
  fanoutLastpub = /* @__PURE__ */ new Map();
  /**
   * Map of pending messages to gossip
   * peer id => control messages
   */
  gossip = /* @__PURE__ */ new Map();
  /**
   * Map of control messages
   * peer id => control message
   */
  control = /* @__PURE__ */ new Map();
  /**
   * Number of IHAVEs received from peer in the last heartbeat
   */
  peerhave = /* @__PURE__ */ new Map();
  /** Number of messages we have asked from peer in the last heartbeat */
  iasked = /* @__PURE__ */ new Map();
  /** Prune backoff map */
  backoff = /* @__PURE__ */ new Map();
  /**
   * Connection direction cache, marks peers with outbound connections
   * peer id => direction
   */
  outbound = /* @__PURE__ */ new Map();
  msgIdFn;
  /**
   * A fast message id function used for internal message de-duplication
   */
  fastMsgIdFn;
  msgIdToStrFn;
  /** Maps fast message-id to canonical message-id */
  fastMsgIdCache;
  /**
   * Short term cache for published message ids. This is used for penalizing peers sending
   * our own messages back if the messages are anonymous or use a random author.
   */
  publishedMessageIds;
  /**
   * A message cache that contains the messages for last few heartbeat ticks
   */
  mcache;
  /** Peer score tracking */
  score;
  /**
   * Custom validator function per topic.
   * Must return or resolve quickly (< 100ms) to prevent causing penalties for late messages.
   * If you need to apply validation that may require longer times use `asyncValidation` option and callback the
   * validation result through `Gossipsub.reportValidationResult`
   */
  topicValidators = /* @__PURE__ */ new Map();
  /**
   * Make this protected so child class may want to redirect to its own log.
   */
  log;
  /**
   * Number of heartbeats since the beginning of time
   * This allows us to amortize some resource cleanup -- eg: backoff cleanup
   */
  heartbeatTicks = 0;
  /**
   * Tracks IHAVE/IWANT promises broken by peers
   */
  gossipTracer;
  /**
   * Tracks IDONTWANT messages received by peers in the current heartbeat
   */
  idontwantCounts = /* @__PURE__ */ new Map();
  /**
   * Tracks IDONTWANT messages received by peers and the heartbeat they were received in
   *
   * idontwants are stored for `mcacheLength` heartbeats before being pruned,
   * so this map is bounded by peerCount * idontwantMaxMessages * mcacheLength
   */
  idontwants = /* @__PURE__ */ new Map();
  components;
  directPeerInitial = null;
  static multicodec = GossipsubIDv12;
  // Options
  opts;
  decodeRpcLimits;
  metrics;
  status = { code: GossipStatusCode.stopped };
  maxInboundStreams;
  maxOutboundStreams;
  runOnLimitedConnection;
  allowedTopics;
  heartbeatTimer = null;
  constructor(components, options = {}) {
    super();
    const opts = {
      fallbackToFloodsub: true,
      floodPublish: true,
      batchPublish: false,
      tagMeshPeers: true,
      doPX: false,
      directPeers: [],
      D: GossipsubD,
      Dlo: GossipsubDlo,
      Dhi: GossipsubDhi,
      Dscore: GossipsubDscore,
      Dout: GossipsubDout,
      Dlazy: GossipsubDlazy,
      heartbeatInterval: GossipsubHeartbeatInterval,
      fanoutTTL: GossipsubFanoutTTL,
      mcacheLength: GossipsubHistoryLength,
      mcacheGossip: GossipsubHistoryGossip,
      seenTTL: GossipsubSeenTTL,
      gossipsubIWantFollowupMs: GossipsubIWantFollowupTime,
      prunePeers: GossipsubPrunePeers,
      pruneBackoff: GossipsubPruneBackoff,
      unsubcribeBackoff: GossipsubUnsubscribeBackoff,
      graftFloodThreshold: GossipsubGraftFloodThreshold,
      opportunisticGraftPeers: GossipsubOpportunisticGraftPeers,
      opportunisticGraftTicks: GossipsubOpportunisticGraftTicks,
      directConnectTicks: GossipsubDirectConnectTicks,
      gossipFactor: GossipsubGossipFactor,
      idontwantMinDataSize: GossipsubIdontwantMinDataSize,
      idontwantMaxMessages: GossipsubIdontwantMaxMessages,
      ...options,
      scoreParams: createPeerScoreParams(options.scoreParams),
      scoreThresholds: createPeerScoreThresholds(options.scoreThresholds)
    };
    this.components = components;
    this.decodeRpcLimits = opts.decodeRpcLimits ?? defaultDecodeRpcLimits;
    this.globalSignaturePolicy = opts.globalSignaturePolicy ?? StrictSign;
    if (opts.fallbackToFloodsub) {
      this.multicodecs.push(FloodsubID);
    }
    this.log = components.logger.forComponent(opts.debugName ?? "libp2p:gossipsub");
    this.opts = opts;
    this.direct = new Set(opts.directPeers.map((p) => p.id.toString()));
    this.seenCache = new SimpleTimeCache({ validityMs: opts.seenTTL });
    this.publishedMessageIds = new SimpleTimeCache({ validityMs: opts.seenTTL });
    if (options.msgIdFn != null) {
      this.msgIdFn = options.msgIdFn;
    } else {
      switch (this.globalSignaturePolicy) {
        case StrictSign:
          this.msgIdFn = msgIdFnStrictSign;
          break;
        case StrictNoSign:
          this.msgIdFn = msgIdFnStrictNoSign;
          break;
        default:
          throw new Error(`Invalid globalSignaturePolicy: ${this.globalSignaturePolicy}`);
      }
    }
    if (options.fastMsgIdFn != null) {
      this.fastMsgIdFn = options.fastMsgIdFn;
      this.fastMsgIdCache = new SimpleTimeCache({ validityMs: opts.seenTTL });
    }
    this.msgIdToStrFn = options.msgIdToStrFn ?? messageIdToString;
    this.mcache = options.messageCache ?? new MessageCache(opts.mcacheGossip, opts.mcacheLength, this.msgIdToStrFn);
    if (options.dataTransform != null) {
      this.dataTransform = options.dataTransform;
    }
    if (options.metricsRegister != null) {
      if (options.metricsTopicStrToLabel == null) {
        throw Error("Must set metricsTopicStrToLabel with metrics");
      }
      const maxMeshMessageDeliveriesWindowMs = Math.max(...Object.values(opts.scoreParams.topics).map((topicParam) => topicParam.meshMessageDeliveriesWindow), DEFAULT_METRIC_MESH_MESSAGE_DELIVERIES_WINDOWS);
      const metrics = getMetrics(options.metricsRegister, options.metricsTopicStrToLabel, {
        gossipPromiseExpireSec: this.opts.gossipsubIWantFollowupMs / 1e3,
        behaviourPenaltyThreshold: opts.scoreParams.behaviourPenaltyThreshold,
        maxMeshMessageDeliveriesWindowSec: maxMeshMessageDeliveriesWindowMs / 1e3
      });
      metrics.mcacheSize.addCollect(() => {
        this.onScrapeMetrics(metrics);
      });
      for (const protocol of this.multicodecs) {
        metrics.protocolsEnabled.set({ protocol }, 1);
      }
      this.metrics = metrics;
    } else {
      this.metrics = null;
    }
    this.gossipTracer = new IWantTracer(this.opts.gossipsubIWantFollowupMs, this.msgIdToStrFn, this.metrics);
    this.score = new PeerScore(this.opts.scoreParams, this.metrics, this.components.logger, {
      scoreCacheValidityMs: opts.heartbeatInterval
    });
    this.maxInboundStreams = options.maxInboundStreams;
    this.maxOutboundStreams = options.maxOutboundStreams;
    this.runOnLimitedConnection = options.runOnLimitedConnection;
    this.allowedTopics = opts.allowedTopics != null ? new Set(opts.allowedTopics) : null;
  }
  [Symbol.toStringTag] = "@chainsafe/libp2p-gossipsub";
  [serviceCapabilities] = [
    "@libp2p/pubsub"
  ];
  [serviceDependencies] = [
    "@libp2p/identify"
  ];
  getPeers() {
    return [...this.peers.values()];
  }
  isStarted() {
    return this.status.code === GossipStatusCode.started;
  }
  // LIFECYCLE METHODS
  /**
   * Mounts the gossipsub protocol onto the libp2p node and sends our
   * our subscriptions to every peer connected
   */
  async start() {
    if (this.isStarted()) {
      return;
    }
    this.log("starting");
    this.publishConfig = getPublishConfigFromPeerId(this.globalSignaturePolicy, this.components.peerId, this.components.privateKey);
    this.outboundInflightQueue = pushable({ objectMode: true });
    pipe(this.outboundInflightQueue, async (source) => {
      for await (const { peerId, connection } of source) {
        await this.createOutboundStream(peerId, connection);
      }
    }).catch((e) => {
      this.log.error("outbound inflight queue error", e);
    });
    await Promise.all(this.opts.directPeers.map(async (p) => {
      await this.components.peerStore.merge(p.id, {
        multiaddrs: p.addrs
      });
    }));
    const registrar = this.components.registrar;
    await Promise.all(this.multicodecs.map(async (multicodec2) => registrar.handle(multicodec2, this.onIncomingStream.bind(this), {
      maxInboundStreams: this.maxInboundStreams,
      maxOutboundStreams: this.maxOutboundStreams,
      runOnLimitedConnection: this.runOnLimitedConnection
    })));
    const topology = {
      onConnect: this.onPeerConnected.bind(this),
      onDisconnect: this.onPeerDisconnected.bind(this),
      notifyOnLimitedConnection: this.runOnLimitedConnection
    };
    const registrarTopologyIds = await Promise.all(this.multicodecs.map(async (multicodec2) => registrar.register(multicodec2, topology)));
    const heartbeatTimeout = setTimeout(this.runHeartbeat, GossipsubHeartbeatInitialDelay);
    this.status = {
      code: GossipStatusCode.started,
      registrarTopologyIds,
      heartbeatTimeout,
      hearbeatStartMs: Date.now() + GossipsubHeartbeatInitialDelay
    };
    this.score.start();
    this.directPeerInitial = setTimeout(() => {
      Promise.resolve().then(async () => {
        await Promise.all(Array.from(this.direct).map(async (id) => this.connect(id)));
      }).catch((err) => {
        this.log(err);
      });
    }, GossipsubDirectConnectInitialDelay);
    if (this.opts.tagMeshPeers) {
      this.addEventListener("gossipsub:graft", this.tagMeshPeer);
      this.addEventListener("gossipsub:prune", this.untagMeshPeer);
    }
    this.log("started");
  }
  /**
   * Unmounts the gossipsub protocol and shuts down every connection
   */
  async stop() {
    this.log("stopping");
    if (this.status.code !== GossipStatusCode.started) {
      return;
    }
    const { registrarTopologyIds } = this.status;
    this.status = { code: GossipStatusCode.stopped };
    if (this.opts.tagMeshPeers) {
      this.removeEventListener("gossipsub:graft", this.tagMeshPeer);
      this.removeEventListener("gossipsub:prune", this.untagMeshPeer);
    }
    const registrar = this.components.registrar;
    await Promise.all(this.multicodecs.map(async (multicodec2) => registrar.unhandle(multicodec2)));
    registrarTopologyIds.forEach((id) => {
      registrar.unregister(id);
    });
    this.outboundInflightQueue.end();
    const closePromises = [];
    for (const outboundStream of this.streamsOutbound.values()) {
      closePromises.push(outboundStream.close());
    }
    this.streamsOutbound.clear();
    for (const inboundStream of this.streamsInbound.values()) {
      closePromises.push(inboundStream.close());
    }
    this.streamsInbound.clear();
    await Promise.all(closePromises);
    this.peers.clear();
    this.subscriptions.clear();
    if (this.heartbeatTimer != null) {
      this.heartbeatTimer.cancel();
      this.heartbeatTimer = null;
    }
    this.score.stop();
    this.mesh.clear();
    this.fanout.clear();
    this.fanoutLastpub.clear();
    this.gossip.clear();
    this.control.clear();
    this.peerhave.clear();
    this.iasked.clear();
    this.backoff.clear();
    this.outbound.clear();
    this.gossipTracer.clear();
    this.seenCache.clear();
    if (this.fastMsgIdCache != null)
      this.fastMsgIdCache.clear();
    if (this.directPeerInitial != null)
      clearTimeout(this.directPeerInitial);
    this.idontwantCounts.clear();
    this.idontwants.clear();
    this.log("stopped");
  }
  /** FOR DEBUG ONLY - Dump peer stats for all peers. Data is cloned, safe to mutate */
  dumpPeerScoreStats() {
    return this.score.dumpPeerScoreStats();
  }
  /**
   * On an inbound stream opened
   */
  onIncomingStream({ stream, connection }) {
    if (!this.isStarted()) {
      return;
    }
    const peerId = connection.remotePeer;
    this.addPeer(peerId, connection.direction, connection.remoteAddr);
    this.createInboundStream(peerId, stream);
    this.outboundInflightQueue.push({ peerId, connection });
  }
  /**
   * Registrar notifies an established connection with pubsub protocol
   */
  onPeerConnected(peerId, connection) {
    this.metrics?.newConnectionCount.inc({ status: connection.status });
    if (!this.isStarted() || connection.status !== "open") {
      return;
    }
    this.addPeer(peerId, connection.direction, connection.remoteAddr);
    this.outboundInflightQueue.push({ peerId, connection });
  }
  /**
   * Registrar notifies a closing connection with pubsub protocol
   */
  onPeerDisconnected(peerId) {
    this.log("connection ended %p", peerId);
    this.removePeer(peerId);
  }
  async createOutboundStream(peerId, connection) {
    if (!this.isStarted()) {
      return;
    }
    const id = peerId.toString();
    if (!this.peers.has(id)) {
      return;
    }
    if (this.streamsOutbound.has(id)) {
      return;
    }
    try {
      const stream = new OutboundStream(await connection.newStream(this.multicodecs, {
        runOnLimitedConnection: this.runOnLimitedConnection
      }), (e) => {
        this.log.error("outbound pipe error", e);
      }, { maxBufferSize: this.opts.maxOutboundBufferSize });
      this.log("create outbound stream %p", peerId);
      this.streamsOutbound.set(id, stream);
      const protocol = stream.protocol;
      if (protocol === FloodsubID) {
        this.floodsubPeers.add(id);
      }
      this.metrics?.peersPerProtocol.inc({ protocol }, 1);
      if (this.subscriptions.size > 0) {
        this.log("send subscriptions to", id);
        this.sendSubscriptions(id, Array.from(this.subscriptions), true);
      }
    } catch (e) {
      this.log.error("createOutboundStream error", e);
    }
  }
  createInboundStream(peerId, stream) {
    if (!this.isStarted()) {
      return;
    }
    const id = peerId.toString();
    if (!this.peers.has(id)) {
      return;
    }
    const priorInboundStream = this.streamsInbound.get(id);
    if (priorInboundStream !== void 0) {
      this.log("replacing existing inbound steam %s", id);
      priorInboundStream.close().catch((err) => {
        this.log.error(err);
      });
    }
    this.log("create inbound stream %s", id);
    const inboundStream = new InboundStream(stream, { maxDataLength: this.opts.maxInboundDataLength });
    this.streamsInbound.set(id, inboundStream);
    this.pipePeerReadStream(peerId, inboundStream.source).catch((err) => {
      this.log(err);
    });
  }
  /**
   * Add a peer to the router
   */
  addPeer(peerId, direction, addr) {
    const id = peerId.toString();
    if (!this.peers.has(id)) {
      this.log("new peer %p", peerId);
      this.peers.set(id, peerId);
      this.score.addPeer(id);
      const currentIP = multiaddrToIPStr(addr);
      if (currentIP !== null) {
        this.score.addIP(id, currentIP);
      } else {
        this.log("Added peer has no IP in current address %s %s", id, addr.toString());
      }
      if (!this.outbound.has(id)) {
        this.outbound.set(id, direction === "outbound");
      }
    }
  }
  /**
   * Removes a peer from the router
   */
  removePeer(peerId) {
    const id = peerId.toString();
    if (!this.peers.has(id)) {
      return;
    }
    this.log("delete peer %p", peerId);
    this.peers.delete(id);
    const outboundStream = this.streamsOutbound.get(id);
    const inboundStream = this.streamsInbound.get(id);
    if (outboundStream != null) {
      this.metrics?.peersPerProtocol.inc({ protocol: outboundStream.protocol }, -1);
    }
    outboundStream?.close().catch((err) => {
      this.log.error(err);
    });
    inboundStream?.close().catch((err) => {
      this.log.error(err);
    });
    this.streamsOutbound.delete(id);
    this.streamsInbound.delete(id);
    for (const peers of this.topics.values()) {
      peers.delete(id);
    }
    for (const [topicStr, peers] of this.mesh) {
      if (peers.delete(id)) {
        this.metrics?.onRemoveFromMesh(topicStr, ChurnReason.Dc, 1);
      }
    }
    for (const peers of this.fanout.values()) {
      peers.delete(id);
    }
    this.floodsubPeers.delete(id);
    this.gossip.delete(id);
    this.control.delete(id);
    this.outbound.delete(id);
    this.idontwantCounts.delete(id);
    this.idontwants.delete(id);
    this.score.removePeer(id);
    this.acceptFromWhitelist.delete(id);
  }
  // API METHODS
  get started() {
    return this.status.code === GossipStatusCode.started;
  }
  /**
   * Get a the peer-ids in a topic mesh
   */
  getMeshPeers(topic) {
    const peersInTopic = this.mesh.get(topic);
    return peersInTopic != null ? Array.from(peersInTopic) : [];
  }
  /**
   * Get a list of the peer-ids that are subscribed to one topic.
   */
  getSubscribers(topic) {
    const peersInTopic = this.topics.get(topic);
    return (peersInTopic != null ? Array.from(peersInTopic) : []).map((str) => this.peers.get(str) ?? peerIdFromString(str));
  }
  /**
   * Get the list of topics which the peer is subscribed to.
   */
  getTopics() {
    return Array.from(this.subscriptions);
  }
  // TODO: Reviewing Pubsub API
  // MESSAGE METHODS
  /**
   * Responsible for processing each RPC message received by other peers.
   */
  async pipePeerReadStream(peerId, stream) {
    try {
      await pipe(stream, async (source) => {
        for await (const data of source) {
          try {
            const rpcBytes = data.subarray();
            const rpc = RPC.decode(rpcBytes, {
              limits: {
                subscriptions: this.decodeRpcLimits.maxSubscriptions,
                messages: this.decodeRpcLimits.maxMessages,
                control$: {
                  ihave: this.decodeRpcLimits.maxIhaveMessageIDs,
                  iwant: this.decodeRpcLimits.maxIwantMessageIDs,
                  graft: this.decodeRpcLimits.maxControlMessages,
                  prune: this.decodeRpcLimits.maxControlMessages,
                  prune$: {
                    peers: this.decodeRpcLimits.maxPeerInfos
                  },
                  idontwant: this.decodeRpcLimits.maxControlMessages,
                  idontwant$: {
                    messageIDs: this.decodeRpcLimits.maxIdontwantMessageIDs
                  }
                }
              }
            });
            this.metrics?.onRpcRecv(rpc, rpcBytes.length);
            if (this.opts.awaitRpcHandler) {
              try {
                await this.handleReceivedRpc(peerId, rpc);
              } catch (err) {
                this.metrics?.onRpcRecvError();
                this.log(err);
              }
            } else {
              this.handleReceivedRpc(peerId, rpc).catch((err) => {
                this.metrics?.onRpcRecvError();
                this.log(err);
              });
            }
          } catch (e) {
            this.metrics?.onRpcDataError();
            this.log(e);
          }
        }
      });
    } catch (err) {
      this.metrics?.onPeerReadStreamError();
      this.handlePeerReadStreamError(err, peerId);
    }
  }
  /**
   * Handle error when read stream pipe throws, less of the functional use but more
   * to for testing purposes to spy on the error handling
   * */
  handlePeerReadStreamError(err, peerId) {
    this.log.error(err);
    this.onPeerDisconnected(peerId);
  }
  /**
   * Handles an rpc request from a peer
   */
  async handleReceivedRpc(from3, rpc) {
    if (!this.acceptFrom(from3.toString())) {
      this.log("received message from unacceptable peer %p", from3);
      this.metrics?.rpcRecvNotAccepted.inc();
      return;
    }
    const subscriptions = rpc.subscriptions != null ? rpc.subscriptions.length : 0;
    const messages = rpc.messages != null ? rpc.messages.length : 0;
    let ihave = 0;
    let iwant = 0;
    let graft = 0;
    let prune = 0;
    if (rpc.control != null) {
      if (rpc.control.ihave != null)
        ihave = rpc.control.ihave.length;
      if (rpc.control.iwant != null)
        iwant = rpc.control.iwant.length;
      if (rpc.control.graft != null)
        graft = rpc.control.graft.length;
      if (rpc.control.prune != null)
        prune = rpc.control.prune.length;
    }
    this.log(`rpc.from ${from3.toString()} subscriptions ${subscriptions} messages ${messages} ihave ${ihave} iwant ${iwant} graft ${graft} prune ${prune}`);
    if (rpc.subscriptions != null && rpc.subscriptions.length > 0) {
      const subscriptions2 = [];
      rpc.subscriptions.forEach((subOpt) => {
        const topic = subOpt.topic;
        const subscribe = subOpt.subscribe === true;
        if (topic != null) {
          if (this.allowedTopics != null && !this.allowedTopics.has(topic)) {
            return;
          }
          this.handleReceivedSubscription(from3, topic, subscribe);
          subscriptions2.push({ topic, subscribe });
        }
      });
      this.safeDispatchEvent("subscription-change", {
        detail: { peerId: from3, subscriptions: subscriptions2 }
      });
    }
    for (const message2 of rpc.messages) {
      if (this.allowedTopics != null && !this.allowedTopics.has(message2.topic)) {
        continue;
      }
      const handleReceivedMessagePromise = this.handleReceivedMessage(from3, message2).catch((err) => {
        this.metrics?.onMsgRecvError(message2.topic);
        this.log(err);
      });
      if (this.opts.awaitRpcMessageHandler) {
        await handleReceivedMessagePromise;
      }
    }
    if (rpc.control != null) {
      await this.handleControlMessage(from3.toString(), rpc.control);
    }
  }
  /**
   * Handles a subscription change from a peer
   */
  handleReceivedSubscription(from3, topic, subscribe) {
    this.log("subscription update from %p topic %s", from3, topic);
    let topicSet = this.topics.get(topic);
    if (topicSet == null) {
      topicSet = /* @__PURE__ */ new Set();
      this.topics.set(topic, topicSet);
    }
    if (subscribe) {
      topicSet.add(from3.toString());
    } else {
      topicSet.delete(from3.toString());
    }
  }
  /**
   * Handles a newly received message from an RPC.
   * May forward to all peers in the mesh.
   */
  async handleReceivedMessage(from3, rpcMsg) {
    this.metrics?.onMsgRecvPreValidation(rpcMsg.topic);
    const validationResult = await this.validateReceivedMessage(from3, rpcMsg);
    this.metrics?.onPrevalidationResult(rpcMsg.topic, validationResult.code);
    const validationCode = validationResult.code;
    switch (validationCode) {
      case MessageStatus.duplicate:
        this.score.duplicateMessage(from3.toString(), validationResult.msgIdStr, rpcMsg.topic);
        this.gossipTracer.deliverMessage(validationResult.msgIdStr, true);
        this.mcache.observeDuplicate(validationResult.msgIdStr, from3.toString());
        return;
      case MessageStatus.invalid:
        if (validationResult.msgIdStr != null) {
          const msgIdStr = validationResult.msgIdStr;
          this.score.rejectMessage(from3.toString(), msgIdStr, rpcMsg.topic, validationResult.reason);
          this.gossipTracer.rejectMessage(msgIdStr, validationResult.reason);
        } else {
          this.score.rejectInvalidMessage(from3.toString(), rpcMsg.topic);
        }
        this.metrics?.onMsgRecvInvalid(rpcMsg.topic, validationResult);
        return;
      case MessageStatus.valid:
        this.score.validateMessage(validationResult.messageId.msgIdStr);
        this.gossipTracer.deliverMessage(validationResult.messageId.msgIdStr);
        this.mcache.put(validationResult.messageId, rpcMsg, !this.opts.asyncValidation);
        if (this.subscriptions.has(rpcMsg.topic)) {
          const isFromSelf = this.components.peerId.equals(from3);
          if (!isFromSelf || this.opts.emitSelf) {
            super.dispatchEvent(new CustomEvent("gossipsub:message", {
              detail: {
                propagationSource: from3,
                msgId: validationResult.messageId.msgIdStr,
                msg: validationResult.msg
              }
            }));
            super.dispatchEvent(new CustomEvent("message", { detail: validationResult.msg }));
          }
        }
        if (!this.opts.asyncValidation) {
          this.forwardMessage(validationResult.messageId.msgIdStr, rpcMsg, from3.toString());
        }
        break;
      default:
        throw new Error(`Invalid validation result: ${validationCode}`);
    }
  }
  /**
   * Handles a newly received message from an RPC.
   * May forward to all peers in the mesh.
   */
  async validateReceivedMessage(propagationSource, rpcMsg) {
    const fastMsgIdStr = this.fastMsgIdFn?.(rpcMsg);
    const msgIdCached = fastMsgIdStr !== void 0 ? this.fastMsgIdCache?.get(fastMsgIdStr) : void 0;
    if (msgIdCached != null) {
      return { code: MessageStatus.duplicate, msgIdStr: msgIdCached };
    }
    const validationResult = await validateToRawMessage(this.globalSignaturePolicy, rpcMsg);
    if (!validationResult.valid) {
      return { code: MessageStatus.invalid, reason: RejectReason.Error, error: validationResult.error };
    }
    const msg = validationResult.message;
    try {
      if (this.dataTransform != null) {
        msg.data = this.dataTransform.inboundTransform(rpcMsg.topic, msg.data);
      }
    } catch (e) {
      this.log("Invalid message, transform failed", e);
      return { code: MessageStatus.invalid, reason: RejectReason.Error, error: ValidateError.TransformFailed };
    }
    const msgId2 = await this.msgIdFn(msg);
    const msgIdStr = this.msgIdToStrFn(msgId2);
    const messageId = { msgId: msgId2, msgIdStr };
    if (fastMsgIdStr !== void 0 && this.fastMsgIdCache != null) {
      const collision = this.fastMsgIdCache.put(fastMsgIdStr, msgIdStr);
      if (collision) {
        this.metrics?.fastMsgIdCacheCollision.inc();
      }
    }
    if (this.seenCache.has(msgIdStr)) {
      return { code: MessageStatus.duplicate, msgIdStr };
    } else {
      this.seenCache.put(msgIdStr);
    }
    if ((rpcMsg.data?.length ?? 0) >= this.opts.idontwantMinDataSize) {
      this.sendIDontWants(msgId2, rpcMsg.topic, propagationSource.toString());
    }
    const topicValidator = this.topicValidators.get(rpcMsg.topic);
    if (topicValidator != null) {
      let acceptance;
      try {
        acceptance = await topicValidator(propagationSource, msg);
      } catch (e) {
        const errCode = e.code;
        if (errCode === ERR_TOPIC_VALIDATOR_IGNORE)
          acceptance = TopicValidatorResult.Ignore;
        if (errCode === ERR_TOPIC_VALIDATOR_REJECT)
          acceptance = TopicValidatorResult.Reject;
        else
          acceptance = TopicValidatorResult.Ignore;
      }
      if (acceptance !== TopicValidatorResult.Accept) {
        return { code: MessageStatus.invalid, reason: rejectReasonFromAcceptance(acceptance), msgIdStr };
      }
    }
    return { code: MessageStatus.valid, messageId, msg };
  }
  /**
   * Return score of a peer.
   */
  getScore(peerId) {
    return this.score.score(peerId);
  }
  /**
   * Send an rpc object to a peer with subscriptions
   */
  sendSubscriptions(toPeer, topics, subscribe) {
    this.sendRpc(toPeer, {
      subscriptions: topics.map((topic) => ({ topic, subscribe })),
      messages: []
    });
  }
  /**
   * Handles an rpc control message from a peer
   */
  async handleControlMessage(id, controlMsg) {
    if (controlMsg === void 0) {
      return;
    }
    const iwant = controlMsg.ihave?.length > 0 ? this.handleIHave(id, controlMsg.ihave) : [];
    const ihave = controlMsg.iwant?.length > 0 ? this.handleIWant(id, controlMsg.iwant) : [];
    const prune = controlMsg.graft?.length > 0 ? await this.handleGraft(id, controlMsg.graft) : [];
    controlMsg.prune?.length > 0 && await this.handlePrune(id, controlMsg.prune);
    controlMsg.idontwant?.length > 0 && this.handleIdontwant(id, controlMsg.idontwant);
    if (iwant.length === 0 && ihave.length === 0 && prune.length === 0) {
      return;
    }
    const sent = this.sendRpc(id, createGossipRpc(ihave, { iwant, prune }));
    const iwantMessageIds = iwant[0]?.messageIDs;
    if (iwantMessageIds != null) {
      if (sent) {
        this.gossipTracer.addPromise(id, iwantMessageIds);
      } else {
        this.metrics?.iwantPromiseUntracked.inc(1);
      }
    }
  }
  /**
   * Whether to accept a message from a peer
   */
  acceptFrom(id) {
    if (this.direct.has(id)) {
      return true;
    }
    const now = Date.now();
    const entry = this.acceptFromWhitelist.get(id);
    if (entry != null && entry.messagesAccepted < ACCEPT_FROM_WHITELIST_MAX_MESSAGES && entry.acceptUntil >= now) {
      entry.messagesAccepted += 1;
      return true;
    }
    const score = this.score.score(id);
    if (score >= ACCEPT_FROM_WHITELIST_THRESHOLD_SCORE) {
      this.acceptFromWhitelist.set(id, {
        messagesAccepted: 0,
        acceptUntil: now + ACCEPT_FROM_WHITELIST_DURATION_MS
      });
    } else {
      this.acceptFromWhitelist.delete(id);
    }
    return score >= this.opts.scoreThresholds.graylistThreshold;
  }
  /**
   * Handles IHAVE messages
   */
  handleIHave(id, ihave) {
    if (ihave.length === 0) {
      return [];
    }
    const score = this.score.score(id);
    if (score < this.opts.scoreThresholds.gossipThreshold) {
      this.log("IHAVE: ignoring peer %s with score below threshold [ score = %d ]", id, score);
      this.metrics?.ihaveRcvIgnored.inc({ reason: IHaveIgnoreReason.LowScore });
      return [];
    }
    const peerhave = (this.peerhave.get(id) ?? 0) + 1;
    this.peerhave.set(id, peerhave);
    if (peerhave > GossipsubMaxIHaveMessages) {
      this.log("IHAVE: peer %s has advertised too many times (%d) within this heartbeat interval; ignoring", id, peerhave);
      this.metrics?.ihaveRcvIgnored.inc({ reason: IHaveIgnoreReason.MaxIhave });
      return [];
    }
    const iasked = this.iasked.get(id) ?? 0;
    if (iasked >= GossipsubMaxIHaveLength) {
      this.log("IHAVE: peer %s has already advertised too many messages (%d); ignoring", id, iasked);
      this.metrics?.ihaveRcvIgnored.inc({ reason: IHaveIgnoreReason.MaxIasked });
      return [];
    }
    const iwant = /* @__PURE__ */ new Map();
    ihave.forEach(({ topicID, messageIDs }) => {
      if (topicID == null || messageIDs == null || !this.mesh.has(topicID)) {
        return;
      }
      let idonthave = 0;
      messageIDs.forEach((msgId2) => {
        const msgIdStr = this.msgIdToStrFn(msgId2);
        if (!this.seenCache.has(msgIdStr)) {
          iwant.set(msgIdStr, msgId2);
          idonthave++;
        }
      });
      this.metrics?.onIhaveRcv(topicID, messageIDs.length, idonthave);
    });
    if (iwant.size === 0) {
      return [];
    }
    let iask = iwant.size;
    if (iask + iasked > GossipsubMaxIHaveLength) {
      iask = GossipsubMaxIHaveLength - iasked;
    }
    this.log("IHAVE: Asking for %d out of %d messages from %s", iask, iwant.size, id);
    let iwantList = Array.from(iwant.values());
    shuffle(iwantList);
    iwantList = iwantList.slice(0, iask);
    this.iasked.set(id, iasked + iask);
    return [
      {
        messageIDs: iwantList
      }
    ];
  }
  /**
   * Handles IWANT messages
   * Returns messages to send back to peer
   */
  handleIWant(id, iwant) {
    if (iwant.length === 0) {
      return [];
    }
    const score = this.score.score(id);
    if (score < this.opts.scoreThresholds.gossipThreshold) {
      this.log("IWANT: ignoring peer %s with score below threshold [score = %d]", id, score);
      return [];
    }
    const ihave = /* @__PURE__ */ new Map();
    const iwantByTopic = /* @__PURE__ */ new Map();
    let iwantDonthave = 0;
    iwant.forEach(({ messageIDs }) => {
      messageIDs?.forEach((msgId2) => {
        const msgIdStr = this.msgIdToStrFn(msgId2);
        const entry = this.mcache.getWithIWantCount(msgIdStr, id);
        if (entry == null) {
          iwantDonthave++;
          return;
        }
        iwantByTopic.set(entry.msg.topic, 1 + (iwantByTopic.get(entry.msg.topic) ?? 0));
        if (entry.count > GossipsubGossipRetransmission) {
          this.log("IWANT: Peer %s has asked for message %s too many times: ignoring request", id, msgId2);
          return;
        }
        ihave.set(msgIdStr, entry.msg);
      });
    });
    this.metrics?.onIwantRcv(iwantByTopic, iwantDonthave);
    if (ihave.size === 0) {
      this.log("IWANT: Could not provide any wanted messages to %s", id);
      return [];
    }
    this.log("IWANT: Sending %d messages to %s", ihave.size, id);
    return Array.from(ihave.values());
  }
  /**
   * Handles Graft messages
   */
  async handleGraft(id, graft) {
    const prune = [];
    const score = this.score.score(id);
    const now = Date.now();
    let doPX = this.opts.doPX;
    graft.forEach(({ topicID }) => {
      if (topicID == null) {
        return;
      }
      const peersInMesh = this.mesh.get(topicID);
      if (peersInMesh == null) {
        doPX = false;
        return;
      }
      if (peersInMesh.has(id)) {
        return;
      }
      const backoffExpiry = this.backoff.get(topicID)?.get(id);
      if (this.direct.has(id)) {
        this.log("GRAFT: ignoring request from direct peer %s", id);
        prune.push(topicID);
        doPX = false;
      } else if (typeof backoffExpiry === "number" && now < backoffExpiry) {
        this.log("GRAFT: ignoring backed off peer %s", id);
        this.score.addPenalty(id, 1, ScorePenalty.GraftBackoff);
        doPX = false;
        const floodCutoff = backoffExpiry + this.opts.graftFloodThreshold - this.opts.pruneBackoff;
        if (now < floodCutoff) {
          this.score.addPenalty(id, 1, ScorePenalty.GraftBackoff);
        }
        this.addBackoff(id, topicID);
        prune.push(topicID);
      } else if (score < 0) {
        this.log("GRAFT: ignoring peer %s with negative score: score=%d, topic=%s", id, score, topicID);
        prune.push(topicID);
        doPX = false;
        this.addBackoff(id, topicID);
      } else if (peersInMesh.size >= this.opts.Dhi && !(this.outbound.get(id) ?? false)) {
        prune.push(topicID);
        this.addBackoff(id, topicID);
      } else {
        this.log("GRAFT: Add mesh link from %s in %s", id, topicID);
        this.score.graft(id, topicID);
        peersInMesh.add(id);
        this.metrics?.onAddToMesh(topicID, InclusionReason.Subscribed, 1);
      }
      this.safeDispatchEvent("gossipsub:graft", { detail: { peerId: id, topic: topicID, direction: "inbound" } });
    });
    if (prune.length === 0) {
      return [];
    }
    const onUnsubscribe = false;
    return Promise.all(prune.map(async (topic) => this.makePrune(id, topic, doPX, onUnsubscribe)));
  }
  /**
   * Handles Prune messages
   */
  async handlePrune(id, prune) {
    const score = this.score.score(id);
    for (const { topicID, backoff, peers } of prune) {
      if (topicID == null) {
        continue;
      }
      const peersInMesh = this.mesh.get(topicID);
      if (peersInMesh == null) {
        return;
      }
      this.log("PRUNE: Remove mesh link to %s in %s", id, topicID);
      this.score.prune(id, topicID);
      if (peersInMesh.has(id)) {
        peersInMesh.delete(id);
        this.metrics?.onRemoveFromMesh(topicID, ChurnReason.Prune, 1);
      }
      if (typeof backoff === "number" && backoff > 0) {
        this.doAddBackoff(id, topicID, backoff * 1e3);
      } else {
        this.addBackoff(id, topicID);
      }
      if (peers != null && peers.length > 0) {
        if (score < this.opts.scoreThresholds.acceptPXThreshold) {
          this.log("PRUNE: ignoring PX from peer %s with insufficient score [score = %d, topic = %s]", id, score, topicID);
        } else {
          await this.pxConnect(peers);
        }
      }
      this.safeDispatchEvent("gossipsub:prune", { detail: { peerId: id, topic: topicID, direction: "inbound" } });
    }
  }
  handleIdontwant(id, idontwant) {
    let idontwantCount = this.idontwantCounts.get(id) ?? 0;
    if (idontwantCount >= this.opts.idontwantMaxMessages) {
      return;
    }
    const startIdontwantCount = idontwantCount;
    let idontwants = this.idontwants.get(id);
    if (idontwants == null) {
      idontwants = /* @__PURE__ */ new Map();
      this.idontwants.set(id, idontwants);
    }
    let idonthave = 0;
    out: for (const { messageIDs } of idontwant) {
      for (const msgId2 of messageIDs) {
        if (idontwantCount >= this.opts.idontwantMaxMessages) {
          break out;
        }
        idontwantCount++;
        const msgIdStr = this.msgIdToStrFn(msgId2);
        idontwants.set(msgIdStr, this.heartbeatTicks);
        if (!this.mcache.msgs.has(msgIdStr))
          idonthave++;
      }
    }
    this.idontwantCounts.set(id, idontwantCount);
    const total = idontwantCount - startIdontwantCount;
    this.metrics?.onIdontwantRcv(total, idonthave);
  }
  /**
   * Add standard backoff log for a peer in a topic
   */
  addBackoff(id, topic) {
    this.doAddBackoff(id, topic, this.opts.pruneBackoff);
  }
  /**
   * Add backoff expiry interval for a peer in a topic
   *
   * @param id
   * @param topic
   * @param intervalMs - backoff duration in milliseconds
   */
  doAddBackoff(id, topic, intervalMs) {
    let backoff = this.backoff.get(topic);
    if (backoff == null) {
      backoff = /* @__PURE__ */ new Map();
      this.backoff.set(topic, backoff);
    }
    const expire = Date.now() + intervalMs;
    const existingExpire = backoff.get(id) ?? 0;
    if (existingExpire < expire) {
      backoff.set(id, expire);
    }
  }
  /**
   * Apply penalties from broken IHAVE/IWANT promises
   */
  applyIwantPenalties() {
    this.gossipTracer.getBrokenPromises().forEach((count, p) => {
      this.log("peer %s didn't follow up in %d IWANT requests; adding penalty", p, count);
      this.score.addPenalty(p, count, ScorePenalty.BrokenPromise);
    });
  }
  /**
   * Clear expired backoff expiries
   */
  clearBackoff() {
    if (this.heartbeatTicks % GossipsubPruneBackoffTicks !== 0) {
      return;
    }
    const now = Date.now();
    this.backoff.forEach((backoff, topic) => {
      backoff.forEach((expire, id) => {
        if (expire + BACKOFF_SLACK * this.opts.heartbeatInterval < now) {
          backoff.delete(id);
        }
      });
      if (backoff.size === 0) {
        this.backoff.delete(topic);
      }
    });
  }
  /**
   * Maybe reconnect to direct peers
   */
  async directConnect() {
    const toconnect = [];
    this.direct.forEach((id) => {
      if (!this.streamsOutbound.has(id)) {
        toconnect.push(id);
      }
    });
    await Promise.all(toconnect.map(async (id) => this.connect(id)));
  }
  /**
   * Maybe attempt connection given signed peer records
   */
  async pxConnect(peers) {
    if (peers.length > this.opts.prunePeers) {
      shuffle(peers);
      peers = peers.slice(0, this.opts.prunePeers);
    }
    const toconnect = [];
    await Promise.all(peers.map(async (pi) => {
      if (pi.peerID == null) {
        return;
      }
      const peer = peerIdFromMultihash(decode4(pi.peerID));
      const p = peer.toString();
      if (this.peers.has(p)) {
        return;
      }
      if (pi.signedPeerRecord == null) {
        toconnect.push(p);
        return;
      }
      try {
        if (!await this.components.peerStore.consumePeerRecord(pi.signedPeerRecord, peer)) {
          this.log("bogus peer record obtained through px: could not add peer record to address book");
          return;
        }
        toconnect.push(p);
      } catch (e) {
        this.log("bogus peer record obtained through px: invalid signature or not a peer record");
      }
    }));
    if (toconnect.length === 0) {
      return;
    }
    await Promise.all(toconnect.map(async (id) => this.connect(id)));
  }
  /**
   * Connect to a peer using the gossipsub protocol
   */
  async connect(id) {
    this.log("Initiating connection with %s", id);
    const peerId = peerIdFromString(id);
    const connection = await this.components.connectionManager.openConnection(peerId);
    for (const multicodec2 of this.multicodecs) {
      for (const topology of this.components.registrar.getTopologies(multicodec2)) {
        topology.onConnect?.(peerId, connection);
      }
    }
  }
  /**
   * Subscribes to a topic
   */
  subscribe(topic) {
    if (this.status.code !== GossipStatusCode.started) {
      throw new Error("Pubsub has not started");
    }
    if (!this.subscriptions.has(topic)) {
      this.subscriptions.add(topic);
      for (const peerId of this.peers.keys()) {
        this.sendSubscriptions(peerId, [topic], true);
      }
    }
    this.join(topic);
  }
  /**
   * Unsubscribe to a topic
   */
  unsubscribe(topic) {
    if (this.status.code !== GossipStatusCode.started) {
      throw new Error("Pubsub is not started");
    }
    const wasSubscribed = this.subscriptions.delete(topic);
    this.log("unsubscribe from %s - am subscribed %s", topic, wasSubscribed);
    if (wasSubscribed) {
      for (const peerId of this.peers.keys()) {
        this.sendSubscriptions(peerId, [topic], false);
      }
    }
    this.leave(topic);
  }
  /**
   * Join topic
   */
  join(topic) {
    if (this.status.code !== GossipStatusCode.started) {
      throw new Error("Gossipsub has not started");
    }
    if (this.mesh.has(topic)) {
      return;
    }
    this.log("JOIN %s", topic);
    this.metrics?.onJoin(topic);
    const toAdd = /* @__PURE__ */ new Set();
    const backoff = this.backoff.get(topic);
    const fanoutPeers = this.fanout.get(topic);
    if (fanoutPeers != null) {
      this.fanout.delete(topic);
      this.fanoutLastpub.delete(topic);
      fanoutPeers.forEach((id) => {
        if (!this.direct.has(id) && this.score.score(id) >= 0 && backoff?.has(id) !== true) {
          toAdd.add(id);
        }
      });
      this.metrics?.onAddToMesh(topic, InclusionReason.Fanout, toAdd.size);
    }
    if (toAdd.size < this.opts.D) {
      const fanoutCount = toAdd.size;
      const newPeers = this.getRandomGossipPeers(topic, this.opts.D, (id) => (
        // filter direct peers and peers with negative score
        !toAdd.has(id) && !this.direct.has(id) && this.score.score(id) >= 0 && backoff?.has(id) !== true
      ));
      newPeers.forEach((peer) => {
        toAdd.add(peer);
      });
      this.metrics?.onAddToMesh(topic, InclusionReason.Random, toAdd.size - fanoutCount);
    }
    this.mesh.set(topic, toAdd);
    toAdd.forEach((id) => {
      this.log("JOIN: Add mesh link to %s in %s", id, topic);
      this.sendGraft(id, topic);
    });
  }
  /**
   * Leave topic
   */
  leave(topic) {
    if (this.status.code !== GossipStatusCode.started) {
      throw new Error("Gossipsub has not started");
    }
    this.log("LEAVE %s", topic);
    this.metrics?.onLeave(topic);
    const meshPeers = this.mesh.get(topic);
    if (meshPeers != null) {
      Promise.all(Array.from(meshPeers).map(async (id) => {
        this.log("LEAVE: Remove mesh link to %s in %s", id, topic);
        await this.sendPrune(id, topic);
      })).catch((err) => {
        this.log("Error sending prunes to mesh peers", err);
      });
      this.mesh.delete(topic);
    }
  }
  selectPeersToForward(topic, propagationSource, excludePeers) {
    const tosend = /* @__PURE__ */ new Set();
    const peersInTopic = this.topics.get(topic);
    if (peersInTopic != null) {
      this.direct.forEach((peer) => {
        if (peersInTopic.has(peer) && propagationSource !== peer && !(excludePeers?.has(peer) ?? false)) {
          tosend.add(peer);
        }
      });
      this.floodsubPeers.forEach((peer) => {
        if (peersInTopic.has(peer) && propagationSource !== peer && !(excludePeers?.has(peer) ?? false) && this.score.score(peer) >= this.opts.scoreThresholds.publishThreshold) {
          tosend.add(peer);
        }
      });
    }
    const meshPeers = this.mesh.get(topic);
    if (meshPeers != null && meshPeers.size > 0) {
      meshPeers.forEach((peer) => {
        if (propagationSource !== peer && !(excludePeers?.has(peer) ?? false)) {
          tosend.add(peer);
        }
      });
    }
    return tosend;
  }
  selectPeersToPublish(topic) {
    const tosend = /* @__PURE__ */ new Set();
    const tosendCount = {
      direct: 0,
      floodsub: 0,
      mesh: 0,
      fanout: 0
    };
    const peersInTopic = this.topics.get(topic);
    if (peersInTopic != null) {
      if (this.opts.floodPublish) {
        peersInTopic.forEach((id) => {
          if (this.direct.has(id)) {
            tosend.add(id);
            tosendCount.direct++;
          } else if (this.score.score(id) >= this.opts.scoreThresholds.publishThreshold) {
            tosend.add(id);
            tosendCount.floodsub++;
          }
        });
      } else {
        this.direct.forEach((id) => {
          if (peersInTopic.has(id)) {
            tosend.add(id);
            tosendCount.direct++;
          }
        });
        this.floodsubPeers.forEach((id) => {
          if (peersInTopic.has(id) && this.score.score(id) >= this.opts.scoreThresholds.publishThreshold) {
            tosend.add(id);
            tosendCount.floodsub++;
          }
        });
        const meshPeers = this.mesh.get(topic);
        if (meshPeers != null && meshPeers.size > 0) {
          meshPeers.forEach((peer) => {
            tosend.add(peer);
            tosendCount.mesh++;
          });
          if (meshPeers.size < this.opts.D) {
            const topicPeers = this.getRandomGossipPeers(topic, this.opts.D - meshPeers.size, (id) => {
              return !meshPeers.has(id) && !this.direct.has(id) && !this.floodsubPeers.has(id) && this.score.score(id) >= this.opts.scoreThresholds.publishThreshold;
            });
            topicPeers.forEach((peer) => {
              tosend.add(peer);
              tosendCount.mesh++;
            });
          }
        } else {
          const fanoutPeers = this.fanout.get(topic);
          if (fanoutPeers != null && fanoutPeers.size > 0) {
            fanoutPeers.forEach((peer) => {
              tosend.add(peer);
              tosendCount.fanout++;
            });
          } else {
            const newFanoutPeers = this.getRandomGossipPeers(topic, this.opts.D, (id) => {
              return this.score.score(id) >= this.opts.scoreThresholds.publishThreshold;
            });
            if (newFanoutPeers.size > 0) {
              this.fanout.set(topic, newFanoutPeers);
              newFanoutPeers.forEach((peer) => {
                tosend.add(peer);
                tosendCount.fanout++;
              });
            }
          }
          this.fanoutLastpub.set(topic, Date.now());
        }
      }
    }
    return { tosend, tosendCount };
  }
  /**
   * Forwards a message from our peers.
   *
   * For messages published by us (the app layer), this class uses `publish`
   */
  forwardMessage(msgIdStr, rawMsg, propagationSource, excludePeers) {
    if (propagationSource != null) {
      this.score.deliverMessage(propagationSource, msgIdStr, rawMsg.topic);
    }
    const tosend = this.selectPeersToForward(rawMsg.topic, propagationSource, excludePeers);
    tosend.forEach((id) => {
      this.sendRpc(id, createGossipRpc([rawMsg]));
    });
    this.metrics?.onForwardMsg(rawMsg.topic, tosend.size);
  }
  /**
   * App layer publishes a message to peers, return number of peers this message is published to
   * Note: `async` due to crypto only if `StrictSign`, otherwise it's a sync fn.
   *
   * For messages not from us, this class uses `forwardMessage`.
   */
  async publish(topic, data, opts) {
    const startMs = Date.now();
    const transformedData = this.dataTransform != null ? this.dataTransform.outboundTransform(topic, data) : data;
    if (this.publishConfig == null) {
      throw Error("PublishError.Uninitialized");
    }
    const { raw: rawMsg, msg } = await buildRawMessage(this.publishConfig, topic, data, transformedData);
    const msgId2 = await this.msgIdFn(msg);
    const msgIdStr = this.msgIdToStrFn(msgId2);
    const ignoreDuplicatePublishError = opts?.ignoreDuplicatePublishError ?? this.opts.ignoreDuplicatePublishError;
    if (this.seenCache.has(msgIdStr)) {
      if (ignoreDuplicatePublishError) {
        this.metrics?.onPublishDuplicateMsg(topic);
        return { recipients: [] };
      }
      throw Error("PublishError.Duplicate");
    }
    const { tosend, tosendCount } = this.selectPeersToPublish(topic);
    const willSendToSelf = this.opts.emitSelf && this.subscriptions.has(topic);
    const allowPublishToZeroTopicPeers = opts?.allowPublishToZeroTopicPeers ?? this.opts.allowPublishToZeroTopicPeers;
    if (tosend.size === 0 && !allowPublishToZeroTopicPeers && !willSendToSelf) {
      throw Error("PublishError.NoPeersSubscribedToTopic");
    }
    this.seenCache.put(msgIdStr);
    this.mcache.put({ msgId: msgId2, msgIdStr }, rawMsg, true);
    this.gossipTracer.deliverMessage(msgIdStr);
    this.publishedMessageIds.put(msgIdStr);
    const batchPublish = opts?.batchPublish ?? this.opts.batchPublish;
    const rpc = createGossipRpc([rawMsg]);
    if (batchPublish) {
      this.sendRpcInBatch(tosend, rpc);
    } else {
      for (const id of tosend) {
        const sent = this.sendRpc(id, rpc);
        if (!sent) {
          tosend.delete(id);
        }
      }
    }
    const durationMs = Date.now() - startMs;
    this.metrics?.onPublishMsg(topic, tosendCount, tosend.size, rawMsg.data != null ? rawMsg.data.length : 0, durationMs);
    if (willSendToSelf) {
      tosend.add(this.components.peerId.toString());
      super.dispatchEvent(new CustomEvent("gossipsub:message", {
        detail: {
          propagationSource: this.components.peerId,
          msgId: msgIdStr,
          msg
        }
      }));
      super.dispatchEvent(new CustomEvent("message", { detail: msg }));
    }
    return {
      recipients: Array.from(tosend.values()).map((str) => this.peers.get(str) ?? peerIdFromString(str))
    };
  }
  /**
   * Send the same data in batch to tosend list without considering cached control messages
   * This is not only faster but also avoid allocating memory for each peer
   * see https://github.com/ChainSafe/js-libp2p-gossipsub/issues/344
   */
  sendRpcInBatch(tosend, rpc) {
    const rpcBytes = RPC.encode(rpc);
    const prefixedData = encode6.single(rpcBytes);
    for (const id of tosend) {
      const outboundStream = this.streamsOutbound.get(id);
      if (outboundStream == null) {
        this.log(`Cannot send RPC to ${id} as there is no open stream to it available`);
        tosend.delete(id);
        continue;
      }
      try {
        outboundStream.pushPrefixed(prefixedData);
      } catch (e) {
        tosend.delete(id);
        this.log.error(`Cannot send rpc to ${id}`, e);
      }
      this.metrics?.onRpcSent(rpc, rpcBytes.length);
    }
  }
  /**
   * This function should be called when `asyncValidation` is `true` after
   * the message got validated by the caller. Messages are stored in the `mcache` and
   * validation is expected to be fast enough that the messages should still exist in the cache.
   * There are three possible validation outcomes and the outcome is given in acceptance.
   *
   * If acceptance = `MessageAcceptance.Accept` the message will get propagated to the
   * network. The `propagation_source` parameter indicates who the message was received by and
   * will not be forwarded back to that peer.
   *
   * If acceptance = `MessageAcceptance.Reject` the message will be deleted from the memcache
   * and the P₄ penalty will be applied to the `propagationSource`.
   *
   * If acceptance = `MessageAcceptance.Ignore` the message will be deleted from the memcache
   * but no P₄ penalty will be applied.
   *
   * This function will return true if the message was found in the cache and false if was not
   * in the cache anymore.
   *
   * This should only be called once per message.
   */
  reportMessageValidationResult(msgId2, propagationSource, acceptance) {
    let cacheEntry;
    if (acceptance === TopicValidatorResult.Accept) {
      cacheEntry = this.mcache.validate(msgId2);
      if (cacheEntry != null) {
        const { message: rawMsg, originatingPeers } = cacheEntry;
        this.score.deliverMessage(propagationSource, msgId2, rawMsg.topic);
        this.forwardMessage(msgId2, cacheEntry.message, propagationSource, originatingPeers);
      }
    } else {
      cacheEntry = this.mcache.remove(msgId2);
      if (cacheEntry != null) {
        const rejectReason = rejectReasonFromAcceptance(acceptance);
        const { message: rawMsg, originatingPeers } = cacheEntry;
        this.score.rejectMessage(propagationSource, msgId2, rawMsg.topic, rejectReason);
        for (const peer of originatingPeers) {
          this.score.rejectMessage(peer, msgId2, rawMsg.topic, rejectReason);
        }
      }
    }
    const firstSeenTimestampMs = this.score.messageFirstSeenTimestampMs(msgId2);
    this.metrics?.onReportValidation(cacheEntry, acceptance, firstSeenTimestampMs);
  }
  /**
   * Sends a GRAFT message to a peer
   */
  sendGraft(id, topic) {
    const graft = [
      {
        topicID: topic
      }
    ];
    const out = createGossipRpc([], { graft });
    this.sendRpc(id, out);
  }
  /**
   * Sends a PRUNE message to a peer
   */
  async sendPrune(id, topic) {
    const onUnsubscribe = true;
    const prune = [await this.makePrune(id, topic, this.opts.doPX, onUnsubscribe)];
    const out = createGossipRpc([], { prune });
    this.sendRpc(id, out);
  }
  sendIDontWants(msgId2, topic, source) {
    const ids = this.mesh.get(topic);
    if (ids == null) {
      return;
    }
    const tosend = new Set(ids);
    tosend.delete(source);
    for (const id of tosend) {
      if (this.streamsOutbound.get(id)?.protocol !== GossipsubIDv12) {
        tosend.delete(id);
      }
    }
    const idontwantRpc = createGossipRpc([], { idontwant: [{ messageIDs: [msgId2] }] });
    this.sendRpcInBatch(tosend, idontwantRpc);
  }
  /**
   * Send an rpc object to a peer
   */
  sendRpc(id, rpc) {
    const outboundStream = this.streamsOutbound.get(id);
    if (outboundStream == null) {
      this.log(`Cannot send RPC to ${id} as there is no open stream to it available`);
      return false;
    }
    const ctrl = this.control.get(id);
    if (ctrl != null) {
      this.piggybackControl(id, rpc, ctrl);
      this.control.delete(id);
    }
    const ihave = this.gossip.get(id);
    if (ihave != null) {
      this.piggybackGossip(id, rpc, ihave);
      this.gossip.delete(id);
    }
    const rpcBytes = RPC.encode(rpc);
    try {
      outboundStream.push(rpcBytes);
    } catch (e) {
      this.log.error(`Cannot send rpc to ${id}`, e);
      if (ctrl != null) {
        this.control.set(id, ctrl);
      }
      if (ihave != null) {
        this.gossip.set(id, ihave);
      }
      return false;
    }
    this.metrics?.onRpcSent(rpc, rpcBytes.length);
    if (rpc.control?.graft != null) {
      for (const topic of rpc.control?.graft) {
        if (topic.topicID != null) {
          this.safeDispatchEvent("gossipsub:graft", { detail: { peerId: id, topic: topic.topicID, direction: "outbound" } });
        }
      }
    }
    if (rpc.control?.prune != null) {
      for (const topic of rpc.control?.prune) {
        if (topic.topicID != null) {
          this.safeDispatchEvent("gossipsub:prune", { detail: { peerId: id, topic: topic.topicID, direction: "outbound" } });
        }
      }
    }
    return true;
  }
  /** Mutates `outRpc` adding graft and prune control messages */
  piggybackControl(id, outRpc, ctrl) {
    const rpc = ensureControl(outRpc);
    for (const graft of ctrl.graft) {
      if (graft.topicID != null && (this.mesh.get(graft.topicID)?.has(id) ?? false)) {
        rpc.control.graft.push(graft);
      }
    }
    for (const prune of ctrl.prune) {
      if (prune.topicID != null && !(this.mesh.get(prune.topicID)?.has(id) ?? false)) {
        rpc.control.prune.push(prune);
      }
    }
  }
  /** Mutates `outRpc` adding ihave control messages */
  piggybackGossip(id, outRpc, ihave) {
    const rpc = ensureControl(outRpc);
    rpc.control.ihave = ihave;
  }
  /**
   * Send graft and prune messages
   *
   * @param tograft - peer id => topic[]
   * @param toprune - peer id => topic[]
   */
  async sendGraftPrune(tograft, toprune, noPX) {
    const doPX = this.opts.doPX;
    const onUnsubscribe = false;
    for (const [id, topics] of tograft) {
      const graft = topics.map((topicID) => ({ topicID }));
      let prune = [];
      const pruning = toprune.get(id);
      if (pruning != null) {
        prune = await Promise.all(pruning.map(async (topicID) => this.makePrune(id, topicID, doPX && !(noPX.get(id) ?? false), onUnsubscribe)));
        toprune.delete(id);
      }
      this.sendRpc(id, createGossipRpc([], { graft, prune }));
    }
    for (const [id, topics] of toprune) {
      const prune = await Promise.all(topics.map(async (topicID) => this.makePrune(id, topicID, doPX && !(noPX.get(id) ?? false), onUnsubscribe)));
      this.sendRpc(id, createGossipRpc([], { prune }));
    }
  }
  /**
   * Emits gossip - Send IHAVE messages to a random set of gossip peers
   */
  emitGossip(peersToGossipByTopic) {
    const gossipIDsByTopic = this.mcache.getGossipIDs(new Set(peersToGossipByTopic.keys()));
    for (const [topic, peersToGossip] of peersToGossipByTopic) {
      this.doEmitGossip(topic, peersToGossip, gossipIDsByTopic.get(topic) ?? []);
    }
  }
  /**
   * Send gossip messages to GossipFactor peers above threshold with a minimum of D_lazy
   * Peers are randomly selected from the heartbeat which exclude mesh + fanout peers
   * We also exclude direct peers, as there is no reason to emit gossip to them
   *
   * @param topic
   * @param candidateToGossip - peers to gossip
   * @param messageIDs - message ids to gossip
   */
  doEmitGossip(topic, candidateToGossip, messageIDs) {
    if (messageIDs.length === 0) {
      return;
    }
    shuffle(messageIDs);
    if (messageIDs.length > GossipsubMaxIHaveLength) {
      this.log("too many messages for gossip; will truncate IHAVE list (%d messages)", messageIDs.length);
    }
    if (candidateToGossip.size === 0)
      return;
    let target = this.opts.Dlazy;
    const gossipFactor = this.opts.gossipFactor;
    const factor = gossipFactor * candidateToGossip.size;
    let peersToGossip = candidateToGossip;
    if (factor > target) {
      target = factor;
    }
    if (target > peersToGossip.size) {
      target = peersToGossip.size;
    } else {
      peersToGossip = shuffle(Array.from(peersToGossip)).slice(0, target);
    }
    peersToGossip.forEach((id) => {
      let peerMessageIDs = messageIDs;
      if (messageIDs.length > GossipsubMaxIHaveLength) {
        peerMessageIDs = shuffle(peerMessageIDs.slice()).slice(0, GossipsubMaxIHaveLength);
      }
      this.pushGossip(id, {
        topicID: topic,
        messageIDs: peerMessageIDs
      });
    });
  }
  /**
   * Flush gossip and control messages
   */
  flush() {
    for (const [peer, ihave] of this.gossip.entries()) {
      this.gossip.delete(peer);
      this.sendRpc(peer, createGossipRpc([], { ihave }));
    }
    for (const [peer, control] of this.control.entries()) {
      this.control.delete(peer);
      const out = createGossipRpc([], { graft: control.graft, prune: control.prune });
      this.sendRpc(peer, out);
    }
  }
  /**
   * Adds new IHAVE messages to pending gossip
   */
  pushGossip(id, controlIHaveMsgs) {
    this.log("Add gossip to %s", id);
    const gossip = this.gossip.get(id) ?? [];
    this.gossip.set(id, gossip.concat(controlIHaveMsgs));
  }
  /**
   * Make a PRUNE control message for a peer in a topic
   */
  async makePrune(id, topic, doPX, onUnsubscribe) {
    this.score.prune(id, topic);
    if (this.streamsOutbound.get(id)?.protocol === GossipsubIDv10) {
      return {
        topicID: topic,
        peers: []
      };
    }
    const backoffMs = onUnsubscribe ? this.opts.unsubcribeBackoff : this.opts.pruneBackoff;
    const backoff = backoffMs / 1e3;
    this.doAddBackoff(id, topic, backoffMs);
    if (!doPX) {
      return {
        topicID: topic,
        peers: [],
        backoff
      };
    }
    const peers = this.getRandomGossipPeers(topic, this.opts.prunePeers, (xid) => {
      return xid !== id && this.score.score(xid) >= 0;
    });
    const px = await Promise.all(Array.from(peers).map(async (peerId) => {
      const id2 = this.peers.get(peerId) ?? peerIdFromString(peerId);
      let peerInfo;
      try {
        peerInfo = await this.components.peerStore.get(id2);
      } catch (err) {
        if (err.name !== "NotFoundError") {
          throw err;
        }
      }
      return {
        peerID: id2.toMultihash().bytes,
        signedPeerRecord: peerInfo?.peerRecordEnvelope
      };
    }));
    return {
      topicID: topic,
      peers: px,
      backoff
    };
  }
  runHeartbeat = /* @__PURE__ */ __name(() => {
    const timer = this.metrics?.heartbeatDuration.startTimer();
    this.heartbeat().catch((err) => {
      this.log("Error running heartbeat", err);
    }).finally(() => {
      if (timer != null) {
        timer();
      }
      if (this.status.code === GossipStatusCode.started) {
        clearTimeout(this.status.heartbeatTimeout);
        let msToNextHeartbeat = this.opts.heartbeatInterval - (Date.now() - this.status.hearbeatStartMs) % this.opts.heartbeatInterval;
        if (msToNextHeartbeat < this.opts.heartbeatInterval * 0.25) {
          msToNextHeartbeat += this.opts.heartbeatInterval;
          this.metrics?.heartbeatSkipped.inc();
        }
        this.status.heartbeatTimeout = setTimeout(this.runHeartbeat, msToNextHeartbeat);
      }
    });
  }, "runHeartbeat");
  /**
   * Maintains the mesh and fanout maps in gossipsub.
   */
  async heartbeat() {
    const { D, Dlo, Dhi, Dscore, Dout, fanoutTTL } = this.opts;
    this.heartbeatTicks++;
    const scores = /* @__PURE__ */ new Map();
    const getScore = /* @__PURE__ */ __name((id) => {
      let s = scores.get(id);
      if (s === void 0) {
        s = this.score.score(id);
        scores.set(id, s);
      }
      return s;
    }, "getScore");
    const tograft = /* @__PURE__ */ new Map();
    const toprune = /* @__PURE__ */ new Map();
    const noPX = /* @__PURE__ */ new Map();
    this.clearBackoff();
    this.peerhave.clear();
    this.metrics?.cacheSize.set({ cache: "iasked" }, this.iasked.size);
    this.iasked.clear();
    this.applyIwantPenalties();
    this.idontwantCounts.clear();
    for (const idontwants of this.idontwants.values()) {
      for (const [msgId2, heartbeatTick] of idontwants) {
        if (this.heartbeatTicks - heartbeatTick >= this.opts.mcacheLength) {
          idontwants.delete(msgId2);
        }
      }
    }
    if (this.heartbeatTicks % this.opts.directConnectTicks === 0) {
      await this.directConnect();
    }
    this.fastMsgIdCache?.prune();
    this.seenCache.prune();
    this.gossipTracer.prune();
    this.publishedMessageIds.prune();
    const peersToGossipByTopic = /* @__PURE__ */ new Map();
    this.mesh.forEach((peers, topic) => {
      const peersInTopic = this.topics.get(topic);
      const candidateMeshPeers = /* @__PURE__ */ new Set();
      const peersToGossip = /* @__PURE__ */ new Set();
      peersToGossipByTopic.set(topic, peersToGossip);
      if (peersInTopic != null) {
        const shuffledPeers = shuffle(Array.from(peersInTopic));
        const backoff = this.backoff.get(topic);
        for (const id of shuffledPeers) {
          const peerStreams = this.streamsOutbound.get(id);
          if (peerStreams != null && this.multicodecs.includes(peerStreams.protocol) && !peers.has(id) && !this.direct.has(id)) {
            const score = getScore(id);
            if (backoff?.has(id) !== true && score >= 0)
              candidateMeshPeers.add(id);
            if (score >= this.opts.scoreThresholds.gossipThreshold)
              peersToGossip.add(id);
          }
        }
      }
      const prunePeer = /* @__PURE__ */ __name((id, reason) => {
        this.log("HEARTBEAT: Remove mesh link to %s in %s", id, topic);
        this.addBackoff(id, topic);
        peers.delete(id);
        if (getScore(id) >= this.opts.scoreThresholds.gossipThreshold)
          peersToGossip.add(id);
        this.metrics?.onRemoveFromMesh(topic, reason, 1);
        const topics = toprune.get(id);
        if (topics == null) {
          toprune.set(id, [topic]);
        } else {
          topics.push(topic);
        }
      }, "prunePeer");
      const graftPeer = /* @__PURE__ */ __name((id, reason) => {
        this.log("HEARTBEAT: Add mesh link to %s in %s", id, topic);
        this.score.graft(id, topic);
        peers.add(id);
        peersToGossip.delete(id);
        this.metrics?.onAddToMesh(topic, reason, 1);
        const topics = tograft.get(id);
        if (topics == null) {
          tograft.set(id, [topic]);
        } else {
          topics.push(topic);
        }
      }, "graftPeer");
      peers.forEach((id) => {
        const score = getScore(id);
        if (score < 0) {
          this.log("HEARTBEAT: Prune peer %s with negative score: score=%d, topic=%s", id, score, topic);
          prunePeer(id, ChurnReason.BadScore);
          noPX.set(id, true);
        }
      });
      if (peers.size < Dlo) {
        const ineed = D - peers.size;
        const newMeshPeers = removeFirstNItemsFromSet(candidateMeshPeers, ineed);
        newMeshPeers.forEach((p) => {
          graftPeer(p, InclusionReason.NotEnough);
        });
      }
      if (peers.size > Dhi) {
        let peersArray = Array.from(peers);
        peersArray.sort((a, b) => getScore(b) - getScore(a));
        peersArray = peersArray.slice(0, Dscore).concat(shuffle(peersArray.slice(Dscore)));
        let outbound = 0;
        peersArray.slice(0, D).forEach((p) => {
          if (this.outbound.get(p) ?? false) {
            outbound++;
          }
        });
        if (outbound < Dout) {
          const rotate = /* @__PURE__ */ __name((i) => {
            const p = peersArray[i];
            for (let j = i; j > 0; j--) {
              peersArray[j] = peersArray[j - 1];
            }
            peersArray[0] = p;
          }, "rotate");
          if (outbound > 0) {
            let ihave = outbound;
            for (let i = 1; i < D && ihave > 0; i++) {
              if (this.outbound.get(peersArray[i]) ?? false) {
                rotate(i);
                ihave--;
              }
            }
          }
          let ineed = D - outbound;
          for (let i = D; i < peersArray.length && ineed > 0; i++) {
            if (this.outbound.get(peersArray[i]) ?? false) {
              rotate(i);
              ineed--;
            }
          }
        }
        peersArray.slice(D).forEach((p) => {
          prunePeer(p, ChurnReason.Excess);
        });
      }
      if (peers.size >= Dlo) {
        let outbound = 0;
        peers.forEach((p) => {
          if (this.outbound.get(p) ?? false) {
            outbound++;
          }
        });
        if (outbound < Dout) {
          const ineed = Dout - outbound;
          const newMeshPeers = removeItemsFromSet(candidateMeshPeers, ineed, (id) => this.outbound.get(id) === true);
          newMeshPeers.forEach((p) => {
            graftPeer(p, InclusionReason.Outbound);
          });
        }
      }
      if (this.heartbeatTicks % this.opts.opportunisticGraftTicks === 0 && peers.size > 1) {
        const peersList = Array.from(peers).sort((a, b) => getScore(a) - getScore(b));
        const medianIndex = Math.floor(peers.size / 2);
        const medianScore = getScore(peersList[medianIndex]);
        if (medianScore < this.opts.scoreThresholds.opportunisticGraftThreshold) {
          const ineed = this.opts.opportunisticGraftPeers;
          const newMeshPeers = removeItemsFromSet(candidateMeshPeers, ineed, (id) => getScore(id) > medianScore);
          for (const id of newMeshPeers) {
            this.log("HEARTBEAT: Opportunistically graft peer %s on topic %s", id, topic);
            graftPeer(id, InclusionReason.Opportunistic);
          }
        }
      }
    });
    const now = Date.now();
    this.fanoutLastpub.forEach((lastpb, topic) => {
      if (lastpb + fanoutTTL < now) {
        this.fanout.delete(topic);
        this.fanoutLastpub.delete(topic);
      }
    });
    this.fanout.forEach((fanoutPeers, topic) => {
      const topicPeers = this.topics.get(topic);
      fanoutPeers.forEach((id) => {
        if (!(topicPeers?.has(id) ?? false) || getScore(id) < this.opts.scoreThresholds.publishThreshold) {
          fanoutPeers.delete(id);
        }
      });
      const peersInTopic = this.topics.get(topic);
      const candidateFanoutPeers = [];
      const peersToGossip = /* @__PURE__ */ new Set();
      peersToGossipByTopic.set(topic, peersToGossip);
      if (peersInTopic != null) {
        const shuffledPeers = shuffle(Array.from(peersInTopic));
        for (const id of shuffledPeers) {
          const peerStreams = this.streamsOutbound.get(id);
          if (peerStreams != null && this.multicodecs.includes(peerStreams.protocol) && !fanoutPeers.has(id) && !this.direct.has(id)) {
            const score = getScore(id);
            if (score >= this.opts.scoreThresholds.publishThreshold)
              candidateFanoutPeers.push(id);
            if (score >= this.opts.scoreThresholds.gossipThreshold)
              peersToGossip.add(id);
          }
        }
      }
      if (fanoutPeers.size < D) {
        const ineed = D - fanoutPeers.size;
        candidateFanoutPeers.slice(0, ineed).forEach((id) => {
          fanoutPeers.add(id);
          peersToGossip?.delete(id);
        });
      }
    });
    this.emitGossip(peersToGossipByTopic);
    await this.sendGraftPrune(tograft, toprune, noPX);
    this.flush();
    this.mcache.shift();
    this.dispatchEvent(new CustomEvent("gossipsub:heartbeat"));
  }
  /**
   * Given a topic, returns up to count peers subscribed to that topic
   * that pass an optional filter function
   *
   * @param topic
   * @param count
   * @param filter - a function to filter acceptable peers
   */
  getRandomGossipPeers(topic, count, filter = () => true) {
    const peersInTopic = this.topics.get(topic);
    if (peersInTopic == null) {
      return /* @__PURE__ */ new Set();
    }
    let peers = [];
    peersInTopic.forEach((id) => {
      const peerStreams = this.streamsOutbound.get(id);
      if (peerStreams == null) {
        return;
      }
      if (this.multicodecs.includes(peerStreams.protocol) && filter(id)) {
        peers.push(id);
      }
    });
    peers = shuffle(peers);
    if (count > 0 && peers.length > count) {
      peers = peers.slice(0, count);
    }
    return new Set(peers);
  }
  onScrapeMetrics(metrics) {
    metrics.mcacheSize.set(this.mcache.size);
    metrics.mcacheNotValidatedCount.set(this.mcache.notValidatedCount);
    metrics.cacheSize.set({ cache: "direct" }, this.direct.size);
    metrics.cacheSize.set({ cache: "seenCache" }, this.seenCache.size);
    metrics.cacheSize.set({ cache: "fastMsgIdCache" }, this.fastMsgIdCache?.size ?? 0);
    metrics.cacheSize.set({ cache: "publishedMessageIds" }, this.publishedMessageIds.size);
    metrics.cacheSize.set({ cache: "mcache" }, this.mcache.size);
    metrics.cacheSize.set({ cache: "score" }, this.score.size);
    metrics.cacheSize.set({ cache: "gossipTracer.promises" }, this.gossipTracer.size);
    metrics.cacheSize.set({ cache: "gossipTracer.requests" }, this.gossipTracer.requestMsByMsgSize);
    metrics.cacheSize.set({ cache: "topics" }, this.topics.size);
    metrics.cacheSize.set({ cache: "subscriptions" }, this.subscriptions.size);
    metrics.cacheSize.set({ cache: "mesh" }, this.mesh.size);
    metrics.cacheSize.set({ cache: "fanout" }, this.fanout.size);
    metrics.cacheSize.set({ cache: "peers" }, this.peers.size);
    metrics.cacheSize.set({ cache: "streamsOutbound" }, this.streamsOutbound.size);
    metrics.cacheSize.set({ cache: "streamsInbound" }, this.streamsInbound.size);
    metrics.cacheSize.set({ cache: "acceptFromWhitelist" }, this.acceptFromWhitelist.size);
    metrics.cacheSize.set({ cache: "gossip" }, this.gossip.size);
    metrics.cacheSize.set({ cache: "control" }, this.control.size);
    metrics.cacheSize.set({ cache: "peerhave" }, this.peerhave.size);
    metrics.cacheSize.set({ cache: "outbound" }, this.outbound.size);
    let backoffSize = 0;
    const now = Date.now();
    metrics.connectedPeersBackoffSec.reset();
    for (const backoff of this.backoff.values()) {
      backoffSize += backoff.size;
      for (const [peer, expiredMs] of backoff.entries()) {
        if (this.peers.has(peer)) {
          metrics.connectedPeersBackoffSec.observe(Math.max(0, expiredMs - now) / 1e3);
        }
      }
    }
    metrics.cacheSize.set({ cache: "backoff" }, backoffSize);
    let idontwantsCount = 0;
    for (const idontwant of this.idontwants.values()) {
      idontwantsCount += idontwant.size;
    }
    metrics.cacheSize.set({ cache: "idontwants" }, idontwantsCount);
    for (const [topicStr, peers] of this.topics) {
      metrics.topicPeersCount.set({ topicStr }, peers.size);
    }
    for (const [topicStr, peers] of this.mesh) {
      metrics.meshPeerCounts.set({ topicStr }, peers.size);
    }
    const scores = [];
    const scoreByPeer = /* @__PURE__ */ new Map();
    metrics.behaviourPenalty.reset();
    for (const peerIdStr of this.peers.keys()) {
      const score = this.score.score(peerIdStr);
      scores.push(score);
      scoreByPeer.set(peerIdStr, score);
      metrics.behaviourPenalty.observe(this.score.peerStats.get(peerIdStr)?.behaviourPenalty ?? 0);
    }
    metrics.registerScores(scores, this.opts.scoreThresholds);
    metrics.registerScorePerMesh(this.mesh, scoreByPeer);
    const sw = computeAllPeersScoreWeights(this.peers.keys(), this.score.peerStats, this.score.params, this.score.peerIPs, metrics.topicStrToLabel);
    metrics.registerScoreWeights(sw);
  }
  tagMeshPeer = /* @__PURE__ */ __name((evt) => {
    const { peerId, topic } = evt.detail;
    this.components.peerStore.merge(this.peers.get(peerId) ?? peerIdFromString(peerId), {
      tags: {
        [topic]: {
          value: 100
        }
      }
    }).catch((err) => {
      this.log.error("Error tagging peer %s with topic %s", peerId, topic, err);
    });
  }, "tagMeshPeer");
  untagMeshPeer = /* @__PURE__ */ __name((evt) => {
    const { peerId, topic } = evt.detail;
    this.components.peerStore.merge(this.peers.get(peerId) ?? peerIdFromString(peerId), {
      tags: {
        [topic]: void 0
      }
    }).catch((err) => {
      this.log.error("Error untagging peer %s with topic %s", peerId, topic, err);
    });
  }, "untagMeshPeer");
};
function gossipsub(init = {}) {
  return (components) => new GossipSub(components, init);
}
__name(gossipsub, "gossipsub");
export {
  GossipSub,
  gossipsub,
  multicodec
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
//# sourceMappingURL=lib-gossipsub.js.map
