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

// node_modules/pvtsutils/build/index.js
var require_build = __commonJS({
  "node_modules/pvtsutils/build/index.js"(exports) {
    "use strict";
    var ARRAY_BUFFER_NAME = "[object ArrayBuffer]";
    var BufferSourceConverter2 = class _BufferSourceConverter {
      static {
        __name(this, "BufferSourceConverter");
      }
      static isArrayBuffer(data) {
        return Object.prototype.toString.call(data) === ARRAY_BUFFER_NAME;
      }
      static toArrayBuffer(data) {
        if (this.isArrayBuffer(data)) {
          return data;
        }
        if (data.byteLength === data.buffer.byteLength) {
          return data.buffer;
        }
        if (data.byteOffset === 0 && data.byteLength === data.buffer.byteLength) {
          return data.buffer;
        }
        return this.toUint8Array(data.buffer).slice(data.byteOffset, data.byteOffset + data.byteLength).buffer;
      }
      static toUint8Array(data) {
        return this.toView(data, Uint8Array);
      }
      static toView(data, type) {
        if (data.constructor === type) {
          return data;
        }
        if (this.isArrayBuffer(data)) {
          return new type(data);
        }
        if (this.isArrayBufferView(data)) {
          return new type(data.buffer, data.byteOffset, data.byteLength);
        }
        throw new TypeError("The provided value is not of type '(ArrayBuffer or ArrayBufferView)'");
      }
      static isBufferSource(data) {
        return this.isArrayBufferView(data) || this.isArrayBuffer(data);
      }
      static isArrayBufferView(data) {
        return ArrayBuffer.isView(data) || data && this.isArrayBuffer(data.buffer);
      }
      static isEqual(a, b) {
        const aView = _BufferSourceConverter.toUint8Array(a);
        const bView = _BufferSourceConverter.toUint8Array(b);
        if (aView.length !== bView.byteLength) {
          return false;
        }
        for (let i = 0; i < aView.length; i++) {
          if (aView[i] !== bView[i]) {
            return false;
          }
        }
        return true;
      }
      static concat(...args) {
        let buffers;
        if (Array.isArray(args[0]) && !(args[1] instanceof Function)) {
          buffers = args[0];
        } else if (Array.isArray(args[0]) && args[1] instanceof Function) {
          buffers = args[0];
        } else {
          if (args[args.length - 1] instanceof Function) {
            buffers = args.slice(0, args.length - 1);
          } else {
            buffers = args;
          }
        }
        let size = 0;
        for (const buffer of buffers) {
          size += buffer.byteLength;
        }
        const res = new Uint8Array(size);
        let offset = 0;
        for (const buffer of buffers) {
          const view = this.toUint8Array(buffer);
          res.set(view, offset);
          offset += view.length;
        }
        if (args[args.length - 1] instanceof Function) {
          return this.toView(res, args[args.length - 1]);
        }
        return res.buffer;
      }
    };
    var STRING_TYPE = "string";
    var HEX_REGEX = /^[0-9a-f]+$/i;
    var BASE64_REGEX = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    var BASE64URL_REGEX = /^[a-zA-Z0-9-_]+$/;
    var Utf8Converter = class {
      static {
        __name(this, "Utf8Converter");
      }
      static fromString(text) {
        const s = unescape(encodeURIComponent(text));
        const uintArray = new Uint8Array(s.length);
        for (let i = 0; i < s.length; i++) {
          uintArray[i] = s.charCodeAt(i);
        }
        return uintArray.buffer;
      }
      static toString(buffer) {
        const buf = BufferSourceConverter2.toUint8Array(buffer);
        let encodedString = "";
        for (let i = 0; i < buf.length; i++) {
          encodedString += String.fromCharCode(buf[i]);
        }
        const decodedString = decodeURIComponent(escape(encodedString));
        return decodedString;
      }
    };
    var Utf16Converter = class {
      static {
        __name(this, "Utf16Converter");
      }
      static toString(buffer, littleEndian = false) {
        const arrayBuffer = BufferSourceConverter2.toArrayBuffer(buffer);
        const dataView = new DataView(arrayBuffer);
        let res = "";
        for (let i = 0; i < arrayBuffer.byteLength; i += 2) {
          const code2 = dataView.getUint16(i, littleEndian);
          res += String.fromCharCode(code2);
        }
        return res;
      }
      static fromString(text, littleEndian = false) {
        const res = new ArrayBuffer(text.length * 2);
        const dataView = new DataView(res);
        for (let i = 0; i < text.length; i++) {
          dataView.setUint16(i * 2, text.charCodeAt(i), littleEndian);
        }
        return res;
      }
    };
    var Convert2 = class _Convert {
      static {
        __name(this, "Convert");
      }
      static isHex(data) {
        return typeof data === STRING_TYPE && HEX_REGEX.test(data);
      }
      static isBase64(data) {
        return typeof data === STRING_TYPE && BASE64_REGEX.test(data);
      }
      static isBase64Url(data) {
        return typeof data === STRING_TYPE && BASE64URL_REGEX.test(data);
      }
      static ToString(buffer, enc = "utf8") {
        const buf = BufferSourceConverter2.toUint8Array(buffer);
        switch (enc.toLowerCase()) {
          case "utf8":
            return this.ToUtf8String(buf);
          case "binary":
            return this.ToBinary(buf);
          case "hex":
            return this.ToHex(buf);
          case "base64":
            return this.ToBase64(buf);
          case "base64url":
            return this.ToBase64Url(buf);
          case "utf16le":
            return Utf16Converter.toString(buf, true);
          case "utf16":
          case "utf16be":
            return Utf16Converter.toString(buf);
          default:
            throw new Error(`Unknown type of encoding '${enc}'`);
        }
      }
      static FromString(str, enc = "utf8") {
        if (!str) {
          return new ArrayBuffer(0);
        }
        switch (enc.toLowerCase()) {
          case "utf8":
            return this.FromUtf8String(str);
          case "binary":
            return this.FromBinary(str);
          case "hex":
            return this.FromHex(str);
          case "base64":
            return this.FromBase64(str);
          case "base64url":
            return this.FromBase64Url(str);
          case "utf16le":
            return Utf16Converter.fromString(str, true);
          case "utf16":
          case "utf16be":
            return Utf16Converter.fromString(str);
          default:
            throw new Error(`Unknown type of encoding '${enc}'`);
        }
      }
      static ToBase64(buffer) {
        const buf = BufferSourceConverter2.toUint8Array(buffer);
        if (typeof btoa !== "undefined") {
          const binary = this.ToString(buf, "binary");
          return btoa(binary);
        } else {
          return Buffer.from(buf).toString("base64");
        }
      }
      static FromBase64(base642) {
        const formatted = this.formatString(base642);
        if (!formatted) {
          return new ArrayBuffer(0);
        }
        if (!_Convert.isBase64(formatted)) {
          throw new TypeError("Argument 'base64Text' is not Base64 encoded");
        }
        if (typeof atob !== "undefined") {
          return this.FromBinary(atob(formatted));
        } else {
          return new Uint8Array(Buffer.from(formatted, "base64")).buffer;
        }
      }
      static FromBase64Url(base64url2) {
        const formatted = this.formatString(base64url2);
        if (!formatted) {
          return new ArrayBuffer(0);
        }
        if (!_Convert.isBase64Url(formatted)) {
          throw new TypeError("Argument 'base64url' is not Base64Url encoded");
        }
        return this.FromBase64(this.Base64Padding(formatted.replace(/\-/g, "+").replace(/\_/g, "/")));
      }
      static ToBase64Url(data) {
        return this.ToBase64(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, "");
      }
      static FromUtf8String(text, encoding = _Convert.DEFAULT_UTF8_ENCODING) {
        switch (encoding) {
          case "ascii":
            return this.FromBinary(text);
          case "utf8":
            return Utf8Converter.fromString(text);
          case "utf16":
          case "utf16be":
            return Utf16Converter.fromString(text);
          case "utf16le":
          case "usc2":
            return Utf16Converter.fromString(text, true);
          default:
            throw new Error(`Unknown type of encoding '${encoding}'`);
        }
      }
      static ToUtf8String(buffer, encoding = _Convert.DEFAULT_UTF8_ENCODING) {
        switch (encoding) {
          case "ascii":
            return this.ToBinary(buffer);
          case "utf8":
            return Utf8Converter.toString(buffer);
          case "utf16":
          case "utf16be":
            return Utf16Converter.toString(buffer);
          case "utf16le":
          case "usc2":
            return Utf16Converter.toString(buffer, true);
          default:
            throw new Error(`Unknown type of encoding '${encoding}'`);
        }
      }
      static FromBinary(text) {
        const stringLength = text.length;
        const resultView = new Uint8Array(stringLength);
        for (let i = 0; i < stringLength; i++) {
          resultView[i] = text.charCodeAt(i);
        }
        return resultView.buffer;
      }
      static ToBinary(buffer) {
        const buf = BufferSourceConverter2.toUint8Array(buffer);
        let res = "";
        for (let i = 0; i < buf.length; i++) {
          res += String.fromCharCode(buf[i]);
        }
        return res;
      }
      static ToHex(buffer) {
        const buf = BufferSourceConverter2.toUint8Array(buffer);
        let result = "";
        const len = buf.length;
        for (let i = 0; i < len; i++) {
          const byte = buf[i];
          if (byte < 16) {
            result += "0";
          }
          result += byte.toString(16);
        }
        return result;
      }
      static FromHex(hexString) {
        let formatted = this.formatString(hexString);
        if (!formatted) {
          return new ArrayBuffer(0);
        }
        if (!_Convert.isHex(formatted)) {
          throw new TypeError("Argument 'hexString' is not HEX encoded");
        }
        if (formatted.length % 2) {
          formatted = `0${formatted}`;
        }
        const res = new Uint8Array(formatted.length / 2);
        for (let i = 0; i < formatted.length; i = i + 2) {
          const c = formatted.slice(i, i + 2);
          res[i / 2] = parseInt(c, 16);
        }
        return res.buffer;
      }
      static ToUtf16String(buffer, littleEndian = false) {
        return Utf16Converter.toString(buffer, littleEndian);
      }
      static FromUtf16String(text, littleEndian = false) {
        return Utf16Converter.fromString(text, littleEndian);
      }
      static Base64Padding(base642) {
        const padCount = 4 - base642.length % 4;
        if (padCount < 4) {
          for (let i = 0; i < padCount; i++) {
            base642 += "=";
          }
        }
        return base642;
      }
      static formatString(data) {
        return (data === null || data === void 0 ? void 0 : data.replace(/[\n\r\t ]/g, "")) || "";
      }
    };
    Convert2.DEFAULT_UTF8_ENCODING = "utf8";
    function assign(target, ...sources) {
      const res = arguments[0];
      for (let i = 1; i < arguments.length; i++) {
        const obj = arguments[i];
        for (const prop in obj) {
          res[prop] = obj[prop];
        }
      }
      return res;
    }
    __name(assign, "assign");
    function combine(...buf) {
      const totalByteLength = buf.map((item) => item.byteLength).reduce((prev, cur) => prev + cur);
      const res = new Uint8Array(totalByteLength);
      let currentPos = 0;
      buf.map((item) => new Uint8Array(item)).forEach((arr) => {
        for (const item2 of arr) {
          res[currentPos++] = item2;
        }
      });
      return res.buffer;
    }
    __name(combine, "combine");
    function isEqual(bytes1, bytes2) {
      if (!(bytes1 && bytes2)) {
        return false;
      }
      if (bytes1.byteLength !== bytes2.byteLength) {
        return false;
      }
      const b1 = new Uint8Array(bytes1);
      const b2 = new Uint8Array(bytes2);
      for (let i = 0; i < bytes1.byteLength; i++) {
        if (b1[i] !== b2[i]) {
          return false;
        }
      }
      return true;
    }
    __name(isEqual, "isEqual");
    exports.BufferSourceConverter = BufferSourceConverter2;
    exports.Convert = Convert2;
    exports.assign = assign;
    exports.combine = combine;
    exports.isEqual = isEqual;
  }
});

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
      var log22 = Math.log(num) / Math.log(2);
      var nextPow2 = 1 << log22 + 1;
      return Math.max(nextPow2, 4);
    }, "_nextPowerOf2");
    module.exports = Denque2;
  }
});

// node_modules/@libp2p/interface/dist/src/peer-id/index.js
var peerIdSymbol = Symbol.for("@libp2p/peer-id");

// node_modules/@libp2p/interface/dist/src/pubsub/index.js
var StrictSign = "StrictSign";
var StrictNoSign = "StrictNoSign";
var TopicValidatorResult;
(function(TopicValidatorResult2) {
  TopicValidatorResult2["Accept"] = "accept";
  TopicValidatorResult2["Ignore"] = "ignore";
  TopicValidatorResult2["Reject"] = "reject";
})(TopicValidatorResult || (TopicValidatorResult = {}));

// node_modules/@libp2p/interface/dist/src/errors.js
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
var InvalidMultihashError = class extends Error {
  static name = "InvalidMultihashError";
  constructor(message2 = "Invalid Multihash") {
    super(message2);
    this.name = "InvalidMultihashError";
  }
};
var UnsupportedKeyTypeError = class extends Error {
  static name = "UnsupportedKeyTypeError";
  constructor(message2 = "Unsupported key type") {
    super(message2);
    this.name = "UnsupportedKeyTypeError";
  }
};

// node_modules/@libp2p/interface/dist/src/events.browser.js
function setMaxListeners() {
}
__name(setMaxListeners, "setMaxListeners");

// node_modules/@libp2p/interface/dist/src/events.js
var setMaxListeners2 = /* @__PURE__ */ __name((n, ...eventTargets) => {
  try {
    setMaxListeners(n, ...eventTargets);
  } catch {
  }
}, "setMaxListeners");

// node_modules/@libp2p/interface/dist/src/event-target.js
var TypedEventEmitter = class extends EventTarget {
  static {
    __name(this, "TypedEventEmitter");
  }
  #listeners = /* @__PURE__ */ new Map();
  constructor() {
    super();
    setMaxListeners2(Infinity, this);
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

// node_modules/@libp2p/interface/dist/src/index.js
var serviceCapabilities = Symbol.for("@libp2p/service-capabilities");
var serviceDependencies = Symbol.for("@libp2p/service-dependencies");

// node_modules/multiformats/dist/src/bases/base58.js
var base58_exports = {};
__export(base58_exports, {
  base58btc: () => base58btc,
  base58flickr: () => base58flickr
});

// node_modules/multiformats/dist/src/bytes.js
var empty = new Uint8Array(0);
function equals(aa, bb) {
  if (aa === bb)
    return true;
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
  if (o instanceof Uint8Array && o.constructor.name === "Uint8Array")
    return o;
  if (o instanceof ArrayBuffer)
    return new Uint8Array(o);
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
  encode(bytes2) {
    if (bytes2 instanceof Uint8Array) {
      return `${this.prefix}${this.baseEncode(bytes2)}`;
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
function decode(string2, alphabet2, bitsPerChar, name2) {
  const codes2 = {};
  for (let i = 0; i < alphabet2.length; ++i) {
    codes2[alphabet2[i]] = i;
  }
  let end = string2.length;
  while (string2[end - 1] === "=") {
    --end;
  }
  const out = new Uint8Array(end * bitsPerChar / 8 | 0);
  let bits = 0;
  let buffer = 0;
  let written = 0;
  for (let i = 0; i < end; ++i) {
    const value = codes2[string2[i]];
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
function rfc4648({ name: name2, prefix, bitsPerChar, alphabet: alphabet2 }) {
  return from({
    prefix,
    name: name2,
    encode(input) {
      return encode(input, alphabet2, bitsPerChar);
    },
    decode(input) {
      return decode(input, alphabet2, bitsPerChar, name2);
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
  const bytes2 = new Uint8Array(digestOffset + size);
  encodeTo(code2, bytes2, 0);
  encodeTo(size, bytes2, sizeOffset);
  bytes2.set(digest2, digestOffset);
  return new Digest(code2, size, digest2, bytes2);
}
__name(create, "create");
function decode4(multihash) {
  const bytes2 = coerce(multihash);
  const [code2, sizeOffset] = decode3(bytes2);
  const [size, digestOffset] = decode3(bytes2.subarray(sizeOffset));
  const digest2 = bytes2.subarray(sizeOffset + digestOffset);
  if (digest2.byteLength !== size) {
    throw new Error("Incorrect length");
  }
  return new Digest(code2, size, digest2, bytes2);
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
  constructor(code2, size, digest2, bytes2) {
    this.code = code2;
    this.size = size;
    this.digest = digest2;
    this.bytes = bytes2;
  }
};

// node_modules/multiformats/dist/src/cid.js
function format(link, base3) {
  const { bytes: bytes2, version } = link;
  switch (version) {
    case 0:
      return toStringV0(bytes2, baseCache(link), base3 ?? base58btc.encoder);
    default:
      return toStringV1(bytes2, baseCache(link), base3 ?? base32.encoder);
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
  constructor(version, code2, multihash, bytes2) {
    this.code = code2;
    this.version = version;
    this.multihash = multihash;
    this.bytes = bytes2;
    this["/"] = bytes2;
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
      const { version, code: code2, multihash, bytes: bytes2 } = value;
      return new _CID(version, code2, multihash, bytes2 ?? encodeCID(version, code2, multihash.bytes));
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
        const bytes2 = encodeCID(version, code2, digest2.bytes);
        return new _CID(version, code2, digest2, bytes2);
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
  static decode(bytes2) {
    const [cid, remainder] = _CID.decodeFirst(bytes2);
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
  static decodeFirst(bytes2) {
    const specs = _CID.inspectBytes(bytes2);
    const prefixSize = specs.size - specs.multihashSize;
    const multihashBytes = coerce(bytes2.subarray(prefixSize, prefixSize + specs.multihashSize));
    if (multihashBytes.byteLength !== specs.multihashSize) {
      throw new Error("Incorrect length");
    }
    const digestBytes = multihashBytes.subarray(specs.multihashSize - specs.digestSize);
    const digest2 = new Digest(specs.multihashCode, specs.digestSize, digestBytes, multihashBytes);
    const cid = specs.version === 0 ? _CID.createV0(digest2) : _CID.createV1(specs.codec, digest2);
    return [cid, bytes2.subarray(specs.size)];
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
    const [prefix, bytes2] = parseCIDtoBytes(source, base3);
    const cid = _CID.decode(bytes2);
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
function toStringV0(bytes2, cache2, base3) {
  const { prefix } = base3;
  if (prefix !== base58btc.prefix) {
    throw Error(`Cannot string encode V0 in ${base3.name} encoding`);
  }
  const cid = cache2.get(prefix);
  if (cid == null) {
    const cid2 = base3.encode(bytes2).slice(1);
    cache2.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
__name(toStringV0, "toStringV0");
function toStringV1(bytes2, cache2, base3) {
  const { prefix } = base3;
  const cid = cache2.get(prefix);
  if (cid == null) {
    const cid2 = base3.encode(bytes2);
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
  const bytes2 = new Uint8Array(hashOffset + multihash.byteLength);
  encodeTo(version, bytes2, 0);
  encodeTo(code2, bytes2, codeOffset);
  bytes2.set(multihash, hashOffset);
  return bytes2;
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
function digest(input) {
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

// node_modules/@noble/hashes/esm/_assert.js
function number(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error(`positive integer expected, not ${n}`);
}
__name(number, "number");
function isBytes(a) {
  return a instanceof Uint8Array || a != null && typeof a === "object" && a.constructor.name === "Uint8Array";
}
__name(isBytes, "isBytes");
function bytes(b, ...lengths) {
  if (!isBytes(b))
    throw new Error("Uint8Array expected");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error(`Uint8Array expected of length ${lengths}, not of length=${b.length}`);
}
__name(bytes, "bytes");
function hash(h) {
  if (typeof h !== "function" || typeof h.create !== "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  number(h.outputLen);
  number(h.blockLen);
}
__name(hash, "hash");
function exists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
__name(exists, "exists");
function output(out, instance) {
  bytes(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error(`digestInto() expects output buffer of length at least ${min}`);
  }
}
__name(output, "output");

// node_modules/@noble/hashes/esm/crypto.js
var crypto2 = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;

// node_modules/@noble/hashes/esm/utils.js
var createView = /* @__PURE__ */ __name((arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength), "createView");
var rotr = /* @__PURE__ */ __name((word, shift) => word << 32 - shift | word >>> shift, "rotr");
var isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function utf8ToBytes(str) {
  if (typeof str !== "string")
    throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
  return new Uint8Array(new TextEncoder().encode(str));
}
__name(utf8ToBytes, "utf8ToBytes");
function toBytes(data) {
  if (typeof data === "string")
    data = utf8ToBytes(data);
  bytes(data);
  return data;
}
__name(toBytes, "toBytes");
function concatBytes(...arrays) {
  let sum = 0;
  for (let i = 0; i < arrays.length; i++) {
    const a = arrays[i];
    bytes(a);
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
var Hash = class {
  static {
    __name(this, "Hash");
  }
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
var toStr = {}.toString;
function wrapConstructor(hashCons) {
  const hashC = /* @__PURE__ */ __name((msg) => hashCons().update(toBytes(msg)).digest(), "hashC");
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
__name(wrapConstructor, "wrapConstructor");
function randomBytes(bytesLength = 32) {
  if (crypto2 && typeof crypto2.getRandomValues === "function") {
    return crypto2.getRandomValues(new Uint8Array(bytesLength));
  }
  if (crypto2 && typeof crypto2.randomBytes === "function") {
    return crypto2.randomBytes(bytesLength);
  }
  throw new Error("crypto.getRandomValues must be defined");
}
__name(randomBytes, "randomBytes");

// node_modules/@noble/hashes/esm/_md.js
function setBigUint64(view, byteOffset, value, isLE2) {
  if (typeof view.setBigUint64 === "function")
    return view.setBigUint64(byteOffset, value, isLE2);
  const _32n2 = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n2 & _u32_max);
  const wl = Number(value & _u32_max);
  const h = isLE2 ? 4 : 0;
  const l = isLE2 ? 0 : 4;
  view.setUint32(byteOffset + h, wh, isLE2);
  view.setUint32(byteOffset + l, wl, isLE2);
}
__name(setBigUint64, "setBigUint64");
var Chi = /* @__PURE__ */ __name((a, b, c) => a & b ^ ~a & c, "Chi");
var Maj = /* @__PURE__ */ __name((a, b, c) => a & b ^ a & c ^ b & c, "Maj");
var HashMD = class extends Hash {
  static {
    __name(this, "HashMD");
  }
  constructor(blockLen, outputLen, padOffset, isLE2) {
    super();
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE2;
    this.finished = false;
    this.length = 0;
    this.pos = 0;
    this.destroyed = false;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView(this.buffer);
  }
  update(data) {
    exists(this);
    const { view, buffer, blockLen } = this;
    data = toBytes(data);
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
    exists(this);
    output(out, this);
    this.finished = true;
    const { buffer, view, blockLen, isLE: isLE2 } = this;
    let { pos } = this;
    buffer[pos++] = 128;
    this.buffer.subarray(pos).fill(0);
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      pos = 0;
    }
    for (let i = pos; i < blockLen; i++)
      buffer[i] = 0;
    setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE2);
    this.process(view, 0);
    const oview = createView(out);
    const len = this.outputLen;
    if (len % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const outLen = len / 4;
    const state = this.get();
    if (outLen > state.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let i = 0; i < outLen; i++)
      oview.setUint32(4 * i, state[i], isLE2);
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    to || (to = new this.constructor());
    to.set(...this.get());
    const { blockLen, buffer, length: length3, finished, destroyed, pos } = this;
    to.length = length3;
    to.pos = pos;
    to.finished = finished;
    to.destroyed = destroyed;
    if (length3 % blockLen)
      to.buffer.set(buffer);
    return to;
  }
};

// node_modules/@noble/hashes/esm/_u64.js
var U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
var _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n, le = false) {
  if (le)
    return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
  return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
__name(fromBig, "fromBig");
function split(lst, le = false) {
  let Ah = new Uint32Array(lst.length);
  let Al = new Uint32Array(lst.length);
  for (let i = 0; i < lst.length; i++) {
    const { h, l } = fromBig(lst[i], le);
    [Ah[i], Al[i]] = [h, l];
  }
  return [Ah, Al];
}
__name(split, "split");
var toBig = /* @__PURE__ */ __name((h, l) => BigInt(h >>> 0) << _32n | BigInt(l >>> 0), "toBig");
var shrSH = /* @__PURE__ */ __name((h, _l, s) => h >>> s, "shrSH");
var shrSL = /* @__PURE__ */ __name((h, l, s) => h << 32 - s | l >>> s, "shrSL");
var rotrSH = /* @__PURE__ */ __name((h, l, s) => h >>> s | l << 32 - s, "rotrSH");
var rotrSL = /* @__PURE__ */ __name((h, l, s) => h << 32 - s | l >>> s, "rotrSL");
var rotrBH = /* @__PURE__ */ __name((h, l, s) => h << 64 - s | l >>> s - 32, "rotrBH");
var rotrBL = /* @__PURE__ */ __name((h, l, s) => h >>> s - 32 | l << 64 - s, "rotrBL");
var rotr32H = /* @__PURE__ */ __name((_h, l) => l, "rotr32H");
var rotr32L = /* @__PURE__ */ __name((h, _l) => h, "rotr32L");
var rotlSH = /* @__PURE__ */ __name((h, l, s) => h << s | l >>> 32 - s, "rotlSH");
var rotlSL = /* @__PURE__ */ __name((h, l, s) => l << s | h >>> 32 - s, "rotlSL");
var rotlBH = /* @__PURE__ */ __name((h, l, s) => l << s - 32 | h >>> 64 - s, "rotlBH");
var rotlBL = /* @__PURE__ */ __name((h, l, s) => h << s - 32 | l >>> 64 - s, "rotlBL");
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
var u64 = {
  fromBig,
  split,
  toBig,
  shrSH,
  shrSL,
  rotrSH,
  rotrSL,
  rotrBH,
  rotrBL,
  rotr32H,
  rotr32L,
  rotlSH,
  rotlSL,
  rotlBH,
  rotlBL,
  add,
  add3L,
  add3H,
  add4L,
  add4H,
  add5H,
  add5L
};
var u64_default = u64;

// node_modules/@noble/hashes/esm/sha512.js
var [SHA512_Kh, SHA512_Kl] = /* @__PURE__ */ (() => u64_default.split([
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
var SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
var SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
var SHA512 = class extends HashMD {
  static {
    __name(this, "SHA512");
  }
  constructor() {
    super(128, 64, 16, false);
    this.Ah = 1779033703 | 0;
    this.Al = 4089235720 | 0;
    this.Bh = 3144134277 | 0;
    this.Bl = 2227873595 | 0;
    this.Ch = 1013904242 | 0;
    this.Cl = 4271175723 | 0;
    this.Dh = 2773480762 | 0;
    this.Dl = 1595750129 | 0;
    this.Eh = 1359893119 | 0;
    this.El = 2917565137 | 0;
    this.Fh = 2600822924 | 0;
    this.Fl = 725511199 | 0;
    this.Gh = 528734635 | 0;
    this.Gl = 4215389547 | 0;
    this.Hh = 1541459225 | 0;
    this.Hl = 327033209 | 0;
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
      const s0h = u64_default.rotrSH(W15h, W15l, 1) ^ u64_default.rotrSH(W15h, W15l, 8) ^ u64_default.shrSH(W15h, W15l, 7);
      const s0l = u64_default.rotrSL(W15h, W15l, 1) ^ u64_default.rotrSL(W15h, W15l, 8) ^ u64_default.shrSL(W15h, W15l, 7);
      const W2h = SHA512_W_H[i - 2] | 0;
      const W2l = SHA512_W_L[i - 2] | 0;
      const s1h = u64_default.rotrSH(W2h, W2l, 19) ^ u64_default.rotrBH(W2h, W2l, 61) ^ u64_default.shrSH(W2h, W2l, 6);
      const s1l = u64_default.rotrSL(W2h, W2l, 19) ^ u64_default.rotrBL(W2h, W2l, 61) ^ u64_default.shrSL(W2h, W2l, 6);
      const SUMl = u64_default.add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
      const SUMh = u64_default.add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
      SHA512_W_H[i] = SUMh | 0;
      SHA512_W_L[i] = SUMl | 0;
    }
    let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    for (let i = 0; i < 80; i++) {
      const sigma1h = u64_default.rotrSH(Eh, El, 14) ^ u64_default.rotrSH(Eh, El, 18) ^ u64_default.rotrBH(Eh, El, 41);
      const sigma1l = u64_default.rotrSL(Eh, El, 14) ^ u64_default.rotrSL(Eh, El, 18) ^ u64_default.rotrBL(Eh, El, 41);
      const CHIh = Eh & Fh ^ ~Eh & Gh;
      const CHIl = El & Fl ^ ~El & Gl;
      const T1ll = u64_default.add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
      const T1h = u64_default.add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
      const T1l = T1ll | 0;
      const sigma0h = u64_default.rotrSH(Ah, Al, 28) ^ u64_default.rotrBH(Ah, Al, 34) ^ u64_default.rotrBH(Ah, Al, 39);
      const sigma0l = u64_default.rotrSL(Ah, Al, 28) ^ u64_default.rotrBL(Ah, Al, 34) ^ u64_default.rotrBL(Ah, Al, 39);
      const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
      const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
      Hh = Gh | 0;
      Hl = Gl | 0;
      Gh = Fh | 0;
      Gl = Fl | 0;
      Fh = Eh | 0;
      Fl = El | 0;
      ({ h: Eh, l: El } = u64_default.add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
      Dh = Ch | 0;
      Dl = Cl | 0;
      Ch = Bh | 0;
      Cl = Bl | 0;
      Bh = Ah | 0;
      Bl = Al | 0;
      const All = u64_default.add3L(T1l, sigma0l, MAJl);
      Ah = u64_default.add3H(All, T1h, sigma0h, MAJh);
      Al = All | 0;
    }
    ({ h: Ah, l: Al } = u64_default.add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
    ({ h: Bh, l: Bl } = u64_default.add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
    ({ h: Ch, l: Cl } = u64_default.add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
    ({ h: Dh, l: Dl } = u64_default.add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
    ({ h: Eh, l: El } = u64_default.add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
    ({ h: Fh, l: Fl } = u64_default.add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
    ({ h: Gh, l: Gl } = u64_default.add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
    ({ h: Hh, l: Hl } = u64_default.add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
    this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
  }
  roundClean() {
    SHA512_W_H.fill(0);
    SHA512_W_L.fill(0);
  }
  destroy() {
    this.buffer.fill(0);
    this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
var sha512 = /* @__PURE__ */ wrapConstructor(() => new SHA512());

// node_modules/@noble/curves/esm/abstract/utils.js
var utils_exports = {};
__export(utils_exports, {
  aInRange: () => aInRange,
  abool: () => abool,
  abytes: () => abytes,
  bitGet: () => bitGet,
  bitLen: () => bitLen,
  bitMask: () => bitMask,
  bitSet: () => bitSet,
  bytesToHex: () => bytesToHex,
  bytesToNumberBE: () => bytesToNumberBE,
  bytesToNumberLE: () => bytesToNumberLE,
  concatBytes: () => concatBytes2,
  createHmacDrbg: () => createHmacDrbg,
  ensureBytes: () => ensureBytes,
  equalBytes: () => equalBytes,
  hexToBytes: () => hexToBytes,
  hexToNumber: () => hexToNumber,
  inRange: () => inRange,
  isBytes: () => isBytes2,
  memoized: () => memoized,
  notImplemented: () => notImplemented,
  numberToBytesBE: () => numberToBytesBE,
  numberToBytesLE: () => numberToBytesLE,
  numberToHexUnpadded: () => numberToHexUnpadded,
  numberToVarBytesBE: () => numberToVarBytesBE,
  utf8ToBytes: () => utf8ToBytes2,
  validateObject: () => validateObject
});
var _0n = /* @__PURE__ */ BigInt(0);
var _1n = /* @__PURE__ */ BigInt(1);
var _2n = /* @__PURE__ */ BigInt(2);
function isBytes2(a) {
  return a instanceof Uint8Array || a != null && typeof a === "object" && a.constructor.name === "Uint8Array";
}
__name(isBytes2, "isBytes");
function abytes(item) {
  if (!isBytes2(item))
    throw new Error("Uint8Array expected");
}
__name(abytes, "abytes");
function abool(title, value) {
  if (typeof value !== "boolean")
    throw new Error(`${title} must be valid boolean, got "${value}".`);
}
__name(abool, "abool");
var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
function bytesToHex(bytes2) {
  abytes(bytes2);
  let hex = "";
  for (let i = 0; i < bytes2.length; i++) {
    hex += hexes[bytes2[i]];
  }
  return hex;
}
__name(bytesToHex, "bytesToHex");
function numberToHexUnpadded(num) {
  const hex = num.toString(16);
  return hex.length & 1 ? `0${hex}` : hex;
}
__name(numberToHexUnpadded, "numberToHexUnpadded");
function hexToNumber(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  return BigInt(hex === "" ? "0" : `0x${hex}`);
}
__name(hexToNumber, "hexToNumber");
var asciis = { _0: 48, _9: 57, _A: 65, _F: 70, _a: 97, _f: 102 };
function asciiToBase16(char) {
  if (char >= asciis._0 && char <= asciis._9)
    return char - asciis._0;
  if (char >= asciis._A && char <= asciis._F)
    return char - (asciis._A - 10);
  if (char >= asciis._a && char <= asciis._f)
    return char - (asciis._a - 10);
  return;
}
__name(asciiToBase16, "asciiToBase16");
function hexToBytes(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2)
    throw new Error("padded hex string expected, got unpadded hex of length " + hl);
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
function bytesToNumberBE(bytes2) {
  return hexToNumber(bytesToHex(bytes2));
}
__name(bytesToNumberBE, "bytesToNumberBE");
function bytesToNumberLE(bytes2) {
  abytes(bytes2);
  return hexToNumber(bytesToHex(Uint8Array.from(bytes2).reverse()));
}
__name(bytesToNumberLE, "bytesToNumberLE");
function numberToBytesBE(n, len) {
  return hexToBytes(n.toString(16).padStart(len * 2, "0"));
}
__name(numberToBytesBE, "numberToBytesBE");
function numberToBytesLE(n, len) {
  return numberToBytesBE(n, len).reverse();
}
__name(numberToBytesLE, "numberToBytesLE");
function numberToVarBytesBE(n) {
  return hexToBytes(numberToHexUnpadded(n));
}
__name(numberToVarBytesBE, "numberToVarBytesBE");
function ensureBytes(title, hex, expectedLength) {
  let res;
  if (typeof hex === "string") {
    try {
      res = hexToBytes(hex);
    } catch (e) {
      throw new Error(`${title} must be valid hex string, got "${hex}". Cause: ${e}`);
    }
  } else if (isBytes2(hex)) {
    res = Uint8Array.from(hex);
  } else {
    throw new Error(`${title} must be hex string or Uint8Array`);
  }
  const len = res.length;
  if (typeof expectedLength === "number" && len !== expectedLength)
    throw new Error(`${title} expected ${expectedLength} bytes, got ${len}`);
  return res;
}
__name(ensureBytes, "ensureBytes");
function concatBytes2(...arrays) {
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
__name(concatBytes2, "concatBytes");
function equalBytes(a, b) {
  if (a.length !== b.length)
    return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++)
    diff |= a[i] ^ b[i];
  return diff === 0;
}
__name(equalBytes, "equalBytes");
function utf8ToBytes2(str) {
  if (typeof str !== "string")
    throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
  return new Uint8Array(new TextEncoder().encode(str));
}
__name(utf8ToBytes2, "utf8ToBytes");
var isPosBig = /* @__PURE__ */ __name((n) => typeof n === "bigint" && _0n <= n, "isPosBig");
function inRange(n, min, max) {
  return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
}
__name(inRange, "inRange");
function aInRange(title, n, min, max) {
  if (!inRange(n, min, max))
    throw new Error(`expected valid ${title}: ${min} <= n < ${max}, got ${typeof n} ${n}`);
}
__name(aInRange, "aInRange");
function bitLen(n) {
  let len;
  for (len = 0; n > _0n; n >>= _1n, len += 1)
    ;
  return len;
}
__name(bitLen, "bitLen");
function bitGet(n, pos) {
  return n >> BigInt(pos) & _1n;
}
__name(bitGet, "bitGet");
function bitSet(n, pos, value) {
  return n | (value ? _1n : _0n) << BigInt(pos);
}
__name(bitSet, "bitSet");
var bitMask = /* @__PURE__ */ __name((n) => (_2n << BigInt(n - 1)) - _1n, "bitMask");
var u8n = /* @__PURE__ */ __name((data) => new Uint8Array(data), "u8n");
var u8fr = /* @__PURE__ */ __name((arr) => Uint8Array.from(arr), "u8fr");
function createHmacDrbg(hashLen, qByteLen, hmacFn) {
  if (typeof hashLen !== "number" || hashLen < 2)
    throw new Error("hashLen must be a number");
  if (typeof qByteLen !== "number" || qByteLen < 2)
    throw new Error("qByteLen must be a number");
  if (typeof hmacFn !== "function")
    throw new Error("hmacFn must be a function");
  let v = u8n(hashLen);
  let k = u8n(hashLen);
  let i = 0;
  const reset = /* @__PURE__ */ __name(() => {
    v.fill(1);
    k.fill(0);
    i = 0;
  }, "reset");
  const h = /* @__PURE__ */ __name((...b) => hmacFn(k, v, ...b), "h");
  const reseed = /* @__PURE__ */ __name((seed = u8n()) => {
    k = h(u8fr([0]), seed);
    v = h();
    if (seed.length === 0)
      return;
    k = h(u8fr([1]), seed);
    v = h();
  }, "reseed");
  const gen = /* @__PURE__ */ __name(() => {
    if (i++ >= 1e3)
      throw new Error("drbg: tried 1000 values");
    let len = 0;
    const out = [];
    while (len < qByteLen) {
      v = h();
      const sl = v.slice();
      out.push(sl);
      len += v.length;
    }
    return concatBytes2(...out);
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
var validatorFns = {
  bigint: /* @__PURE__ */ __name((val) => typeof val === "bigint", "bigint"),
  function: /* @__PURE__ */ __name((val) => typeof val === "function", "function"),
  boolean: /* @__PURE__ */ __name((val) => typeof val === "boolean", "boolean"),
  string: /* @__PURE__ */ __name((val) => typeof val === "string", "string"),
  stringOrUint8Array: /* @__PURE__ */ __name((val) => typeof val === "string" || isBytes2(val), "stringOrUint8Array"),
  isSafeInteger: /* @__PURE__ */ __name((val) => Number.isSafeInteger(val), "isSafeInteger"),
  array: /* @__PURE__ */ __name((val) => Array.isArray(val), "array"),
  field: /* @__PURE__ */ __name((val, object) => object.Fp.isValid(val), "field"),
  hash: /* @__PURE__ */ __name((val) => typeof val === "function" && Number.isSafeInteger(val.outputLen), "hash")
};
function validateObject(object, validators, optValidators = {}) {
  const checkField = /* @__PURE__ */ __name((fieldName, type, isOptional) => {
    const checkVal = validatorFns[type];
    if (typeof checkVal !== "function")
      throw new Error(`Invalid validator "${type}", expected function`);
    const val = object[fieldName];
    if (isOptional && val === void 0)
      return;
    if (!checkVal(val, object)) {
      throw new Error(`Invalid param ${String(fieldName)}=${val} (${typeof val}), expected ${type}`);
    }
  }, "checkField");
  for (const [fieldName, type] of Object.entries(validators))
    checkField(fieldName, type, false);
  for (const [fieldName, type] of Object.entries(optValidators))
    checkField(fieldName, type, true);
  return object;
}
__name(validateObject, "validateObject");
var notImplemented = /* @__PURE__ */ __name(() => {
  throw new Error("not implemented");
}, "notImplemented");
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

// node_modules/@noble/curves/esm/abstract/modular.js
var _0n2 = BigInt(0);
var _1n2 = BigInt(1);
var _2n2 = BigInt(2);
var _3n = BigInt(3);
var _4n = BigInt(4);
var _5n = BigInt(5);
var _8n = BigInt(8);
var _9n = BigInt(9);
var _16n = BigInt(16);
function mod(a, b) {
  const result = a % b;
  return result >= _0n2 ? result : b + result;
}
__name(mod, "mod");
function pow(num, power, modulo) {
  if (modulo <= _0n2 || power < _0n2)
    throw new Error("Expected power/modulo > 0");
  if (modulo === _1n2)
    return _0n2;
  let res = _1n2;
  while (power > _0n2) {
    if (power & _1n2)
      res = res * num % modulo;
    num = num * num % modulo;
    power >>= _1n2;
  }
  return res;
}
__name(pow, "pow");
function pow2(x, power, modulo) {
  let res = x;
  while (power-- > _0n2) {
    res *= res;
    res %= modulo;
  }
  return res;
}
__name(pow2, "pow2");
function invert(number2, modulo) {
  if (number2 === _0n2 || modulo <= _0n2) {
    throw new Error(`invert: expected positive integers, got n=${number2} mod=${modulo}`);
  }
  let a = mod(number2, modulo);
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
function tonelliShanks(P) {
  const legendreC = (P - _1n2) / _2n2;
  let Q, S, Z;
  for (Q = P - _1n2, S = 0; Q % _2n2 === _0n2; Q /= _2n2, S++)
    ;
  for (Z = _2n2; Z < P && pow(Z, legendreC, P) !== P - _1n2; Z++)
    ;
  if (S === 1) {
    const p1div4 = (P + _1n2) / _4n;
    return /* @__PURE__ */ __name(function tonelliFast(Fp3, n) {
      const root = Fp3.pow(n, p1div4);
      if (!Fp3.eql(Fp3.sqr(root), n))
        throw new Error("Cannot find square root");
      return root;
    }, "tonelliFast");
  }
  const Q1div2 = (Q + _1n2) / _2n2;
  return /* @__PURE__ */ __name(function tonelliSlow(Fp3, n) {
    if (Fp3.pow(n, legendreC) === Fp3.neg(Fp3.ONE))
      throw new Error("Cannot find square root");
    let r = S;
    let g = Fp3.pow(Fp3.mul(Fp3.ONE, Z), Q);
    let x = Fp3.pow(n, Q1div2);
    let b = Fp3.pow(n, Q);
    while (!Fp3.eql(b, Fp3.ONE)) {
      if (Fp3.eql(b, Fp3.ZERO))
        return Fp3.ZERO;
      let m = 1;
      for (let t2 = Fp3.sqr(b); m < r; m++) {
        if (Fp3.eql(t2, Fp3.ONE))
          break;
        t2 = Fp3.sqr(t2);
      }
      const ge = Fp3.pow(g, _1n2 << BigInt(r - m - 1));
      g = Fp3.sqr(ge);
      x = Fp3.mul(x, ge);
      b = Fp3.mul(b, g);
      r = m;
    }
    return x;
  }, "tonelliSlow");
}
__name(tonelliShanks, "tonelliShanks");
function FpSqrt(P) {
  if (P % _4n === _3n) {
    const p1div4 = (P + _1n2) / _4n;
    return /* @__PURE__ */ __name(function sqrt3mod4(Fp3, n) {
      const root = Fp3.pow(n, p1div4);
      if (!Fp3.eql(Fp3.sqr(root), n))
        throw new Error("Cannot find square root");
      return root;
    }, "sqrt3mod4");
  }
  if (P % _8n === _5n) {
    const c1 = (P - _5n) / _8n;
    return /* @__PURE__ */ __name(function sqrt5mod8(Fp3, n) {
      const n2 = Fp3.mul(n, _2n2);
      const v = Fp3.pow(n2, c1);
      const nv = Fp3.mul(n, v);
      const i = Fp3.mul(Fp3.mul(nv, _2n2), v);
      const root = Fp3.mul(nv, Fp3.sub(i, Fp3.ONE));
      if (!Fp3.eql(Fp3.sqr(root), n))
        throw new Error("Cannot find square root");
      return root;
    }, "sqrt5mod8");
  }
  if (P % _16n === _9n) {
  }
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
    MASK: "bigint",
    BYTES: "isSafeInteger",
    BITS: "isSafeInteger"
  };
  const opts = FIELD_FIELDS.reduce((map, val) => {
    map[val] = "function";
    return map;
  }, initial);
  return validateObject(field, opts);
}
__name(validateField, "validateField");
function FpPow(f, num, power) {
  if (power < _0n2)
    throw new Error("Expected power > 0");
  if (power === _0n2)
    return f.ONE;
  if (power === _1n2)
    return num;
  let p = f.ONE;
  let d = num;
  while (power > _0n2) {
    if (power & _1n2)
      p = f.mul(p, d);
    d = f.sqr(d);
    power >>= _1n2;
  }
  return p;
}
__name(FpPow, "FpPow");
function FpInvertBatch(f, nums) {
  const tmp = new Array(nums.length);
  const lastMultiplied = nums.reduce((acc, num, i) => {
    if (f.is0(num))
      return acc;
    tmp[i] = acc;
    return f.mul(acc, num);
  }, f.ONE);
  const inverted = f.inv(lastMultiplied);
  nums.reduceRight((acc, num, i) => {
    if (f.is0(num))
      return acc;
    tmp[i] = f.mul(acc, tmp[i]);
    return f.mul(acc, num);
  }, inverted);
  return tmp;
}
__name(FpInvertBatch, "FpInvertBatch");
function nLength(n, nBitLength) {
  const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
  const nByteLength = Math.ceil(_nBitLength / 8);
  return { nBitLength: _nBitLength, nByteLength };
}
__name(nLength, "nLength");
function Field(ORDER, bitLen2, isLE2 = false, redef = {}) {
  if (ORDER <= _0n2)
    throw new Error(`Expected Field ORDER > 0, got ${ORDER}`);
  const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, bitLen2);
  if (BYTES > 2048)
    throw new Error("Field lengths over 2048 bytes are not supported");
  const sqrtP = FpSqrt(ORDER);
  const f = Object.freeze({
    ORDER,
    BITS,
    BYTES,
    MASK: bitMask(BITS),
    ZERO: _0n2,
    ONE: _1n2,
    create: /* @__PURE__ */ __name((num) => mod(num, ORDER), "create"),
    isValid: /* @__PURE__ */ __name((num) => {
      if (typeof num !== "bigint")
        throw new Error(`Invalid field element: expected bigint, got ${typeof num}`);
      return _0n2 <= num && num < ORDER;
    }, "isValid"),
    is0: /* @__PURE__ */ __name((num) => num === _0n2, "is0"),
    isOdd: /* @__PURE__ */ __name((num) => (num & _1n2) === _1n2, "isOdd"),
    neg: /* @__PURE__ */ __name((num) => mod(-num, ORDER), "neg"),
    eql: /* @__PURE__ */ __name((lhs, rhs) => lhs === rhs, "eql"),
    sqr: /* @__PURE__ */ __name((num) => mod(num * num, ORDER), "sqr"),
    add: /* @__PURE__ */ __name((lhs, rhs) => mod(lhs + rhs, ORDER), "add"),
    sub: /* @__PURE__ */ __name((lhs, rhs) => mod(lhs - rhs, ORDER), "sub"),
    mul: /* @__PURE__ */ __name((lhs, rhs) => mod(lhs * rhs, ORDER), "mul"),
    pow: /* @__PURE__ */ __name((num, power) => FpPow(f, num, power), "pow"),
    div: /* @__PURE__ */ __name((lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER), "div"),
    // Same as above, but doesn't normalize
    sqrN: /* @__PURE__ */ __name((num) => num * num, "sqrN"),
    addN: /* @__PURE__ */ __name((lhs, rhs) => lhs + rhs, "addN"),
    subN: /* @__PURE__ */ __name((lhs, rhs) => lhs - rhs, "subN"),
    mulN: /* @__PURE__ */ __name((lhs, rhs) => lhs * rhs, "mulN"),
    inv: /* @__PURE__ */ __name((num) => invert(num, ORDER), "inv"),
    sqrt: redef.sqrt || ((n) => sqrtP(f, n)),
    invertBatch: /* @__PURE__ */ __name((lst) => FpInvertBatch(f, lst), "invertBatch"),
    // TODO: do we really need constant cmov?
    // We don't have const-time bigints anyway, so probably will be not very useful
    cmov: /* @__PURE__ */ __name((a, b, c) => c ? b : a, "cmov"),
    toBytes: /* @__PURE__ */ __name((num) => isLE2 ? numberToBytesLE(num, BYTES) : numberToBytesBE(num, BYTES), "toBytes"),
    fromBytes: /* @__PURE__ */ __name((bytes2) => {
      if (bytes2.length !== BYTES)
        throw new Error(`Fp.fromBytes: expected ${BYTES}, got ${bytes2.length}`);
      return isLE2 ? bytesToNumberLE(bytes2) : bytesToNumberBE(bytes2);
    }, "fromBytes")
  });
  return Object.freeze(f);
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
function mapHashToField(key, fieldOrder, isLE2 = false) {
  const len = key.length;
  const fieldLen = getFieldBytesLength(fieldOrder);
  const minLen = getMinHashLength(fieldOrder);
  if (len < 16 || len < minLen || len > 1024)
    throw new Error(`expected ${minLen}-1024 bytes of input, got ${len}`);
  const num = isLE2 ? bytesToNumberBE(key) : bytesToNumberLE(key);
  const reduced = mod(num, fieldOrder - _1n2) + _1n2;
  return isLE2 ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
}
__name(mapHashToField, "mapHashToField");

// node_modules/@noble/curves/esm/abstract/curve.js
var _0n3 = BigInt(0);
var _1n3 = BigInt(1);
var pointPrecomputes = /* @__PURE__ */ new WeakMap();
var pointWindowSizes = /* @__PURE__ */ new WeakMap();
function wNAF(c, bits) {
  const constTimeNegate = /* @__PURE__ */ __name((condition, item) => {
    const neg = item.negate();
    return condition ? neg : item;
  }, "constTimeNegate");
  const validateW = /* @__PURE__ */ __name((W) => {
    if (!Number.isSafeInteger(W) || W <= 0 || W > bits)
      throw new Error(`Wrong window size=${W}, should be [1..${bits}]`);
  }, "validateW");
  const opts = /* @__PURE__ */ __name((W) => {
    validateW(W);
    const windows = Math.ceil(bits / W) + 1;
    const windowSize = 2 ** (W - 1);
    return { windows, windowSize };
  }, "opts");
  return {
    constTimeNegate,
    // non-const time multiplication ladder
    unsafeLadder(elm, n) {
      let p = c.ZERO;
      let d = elm;
      while (n > _0n3) {
        if (n & _1n3)
          p = p.add(d);
        d = d.double();
        n >>= _1n3;
      }
      return p;
    },
    /**
     * Creates a wNAF precomputation window. Used for caching.
     * Default window size is set by `utils.precompute()` and is equal to 8.
     * Number of precomputed points depends on the curve size:
     * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
     * - 𝑊 is the window size
     * - 𝑛 is the bitlength of the curve order.
     * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
     * @returns precomputed point tables flattened to a single array
     */
    precomputeWindow(elm, W) {
      const { windows, windowSize } = opts(W);
      const points = [];
      let p = elm;
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
    },
    /**
     * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
     * @param W window size
     * @param precomputes precomputed tables
     * @param n scalar (we don't check here, but should be less than curve order)
     * @returns real and fake (for const-time) points
     */
    wNAF(W, precomputes, n) {
      const { windows, windowSize } = opts(W);
      let p = c.ZERO;
      let f = c.BASE;
      const mask = BigInt(2 ** W - 1);
      const maxNumber = 2 ** W;
      const shiftBy = BigInt(W);
      for (let window = 0; window < windows; window++) {
        const offset = window * windowSize;
        let wbits = Number(n & mask);
        n >>= shiftBy;
        if (wbits > windowSize) {
          wbits -= maxNumber;
          n += _1n3;
        }
        const offset1 = offset;
        const offset2 = offset + Math.abs(wbits) - 1;
        const cond1 = window % 2 !== 0;
        const cond2 = wbits < 0;
        if (wbits === 0) {
          f = f.add(constTimeNegate(cond1, precomputes[offset1]));
        } else {
          p = p.add(constTimeNegate(cond2, precomputes[offset2]));
        }
      }
      return { p, f };
    },
    wNAFCached(P, n, transform) {
      const W = pointWindowSizes.get(P) || 1;
      let comp = pointPrecomputes.get(P);
      if (!comp) {
        comp = this.precomputeWindow(P, W);
        if (W !== 1)
          pointPrecomputes.set(P, transform(comp));
      }
      return this.wNAF(W, comp, n);
    },
    // We calculate precomputes for elliptic curve point multiplication
    // using windowed method. This specifies window size and
    // stores precomputed values. Usually only base point would be precomputed.
    setWindowSize(P, W) {
      validateW(W);
      pointWindowSizes.set(P, W);
      pointPrecomputes.delete(P);
    }
  };
}
__name(wNAF, "wNAF");
function pippenger(c, field, points, scalars) {
  if (!Array.isArray(points) || !Array.isArray(scalars) || scalars.length !== points.length)
    throw new Error("arrays of points and scalars must have equal length");
  scalars.forEach((s, i) => {
    if (!field.isValid(s))
      throw new Error(`wrong scalar at index ${i}`);
  });
  points.forEach((p, i) => {
    if (!(p instanceof c))
      throw new Error(`wrong point at index ${i}`);
  });
  const wbits = bitLen(BigInt(points.length));
  const windowSize = wbits > 12 ? wbits - 3 : wbits > 4 ? wbits - 2 : wbits ? 2 : 1;
  const MASK = (1 << windowSize) - 1;
  const buckets = new Array(MASK + 1).fill(c.ZERO);
  const lastBits = Math.floor((field.BITS - 1) / windowSize) * windowSize;
  let sum = c.ZERO;
  for (let i = lastBits; i >= 0; i -= windowSize) {
    buckets.fill(c.ZERO);
    for (let j = 0; j < scalars.length; j++) {
      const scalar = scalars[j];
      const wbits2 = Number(scalar >> BigInt(i) & BigInt(MASK));
      buckets[wbits2] = buckets[wbits2].add(points[j]);
    }
    let resI = c.ZERO;
    for (let j = buckets.length - 1, sumI = c.ZERO; j > 0; j--) {
      sumI = sumI.add(buckets[j]);
      resI = resI.add(sumI);
    }
    sum = sum.add(resI);
    if (i !== 0)
      for (let j = 0; j < windowSize; j++)
        sum = sum.double();
  }
  return sum;
}
__name(pippenger, "pippenger");
function validateBasic(curve) {
  validateField(curve.Fp);
  validateObject(curve, {
    n: "bigint",
    h: "bigint",
    Gx: "field",
    Gy: "field"
  }, {
    nBitLength: "isSafeInteger",
    nByteLength: "isSafeInteger"
  });
  return Object.freeze({
    ...nLength(curve.n, curve.nBitLength),
    ...curve,
    ...{ p: curve.Fp.ORDER }
  });
}
__name(validateBasic, "validateBasic");

// node_modules/@noble/curves/esm/abstract/edwards.js
var _0n4 = BigInt(0);
var _1n4 = BigInt(1);
var _2n3 = BigInt(2);
var _8n2 = BigInt(8);
var VERIFY_DEFAULT = { zip215: true };
function validateOpts(curve) {
  const opts = validateBasic(curve);
  validateObject(curve, {
    hash: "function",
    a: "bigint",
    d: "bigint",
    randomBytes: "function"
  }, {
    adjustScalarBytes: "function",
    domain: "function",
    uvRatio: "function",
    mapToCurve: "function"
  });
  return Object.freeze({ ...opts });
}
__name(validateOpts, "validateOpts");
function twistedEdwards(curveDef) {
  const CURVE = validateOpts(curveDef);
  const { Fp: Fp3, n: CURVE_ORDER, prehash, hash: cHash, randomBytes: randomBytes3, nByteLength, h: cofactor } = CURVE;
  const MASK = _2n3 << BigInt(nByteLength * 8) - _1n4;
  const modP = Fp3.create;
  const Fn = Field(CURVE.n, CURVE.nBitLength);
  const uvRatio2 = CURVE.uvRatio || ((u, v) => {
    try {
      return { isValid: true, value: Fp3.sqrt(u * Fp3.inv(v)) };
    } catch (e) {
      return { isValid: false, value: _0n4 };
    }
  });
  const adjustScalarBytes2 = CURVE.adjustScalarBytes || ((bytes2) => bytes2);
  const domain = CURVE.domain || ((data, ctx, phflag) => {
    abool("phflag", phflag);
    if (ctx.length || phflag)
      throw new Error("Contexts/pre-hash are not supported");
    return data;
  });
  function aCoordinate(title, n) {
    aInRange("coordinate " + title, n, _0n4, MASK);
  }
  __name(aCoordinate, "aCoordinate");
  function assertPoint(other) {
    if (!(other instanceof Point2))
      throw new Error("ExtendedPoint expected");
  }
  __name(assertPoint, "assertPoint");
  const toAffineMemo = memoized((p, iz) => {
    const { ex: x, ey: y, ez: z } = p;
    const is0 = p.is0();
    if (iz == null)
      iz = is0 ? _8n2 : Fp3.inv(z);
    const ax = modP(x * iz);
    const ay = modP(y * iz);
    const zz = modP(z * iz);
    if (is0)
      return { x: _0n4, y: _1n4 };
    if (zz !== _1n4)
      throw new Error("invZ was invalid");
    return { x: ax, y: ay };
  });
  const assertValidMemo = memoized((p) => {
    const { a, d } = CURVE;
    if (p.is0())
      throw new Error("bad point: ZERO");
    const { ex: X, ey: Y, ez: Z, et: T } = p;
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
  class Point2 {
    static {
      __name(this, "Point");
    }
    constructor(ex, ey, ez, et) {
      this.ex = ex;
      this.ey = ey;
      this.ez = ez;
      this.et = et;
      aCoordinate("x", ex);
      aCoordinate("y", ey);
      aCoordinate("z", ez);
      aCoordinate("t", et);
      Object.freeze(this);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    static fromAffine(p) {
      if (p instanceof Point2)
        throw new Error("extended point not allowed");
      const { x, y } = p || {};
      aCoordinate("x", x);
      aCoordinate("y", y);
      return new Point2(x, y, _1n4, modP(x * y));
    }
    static normalizeZ(points) {
      const toInv = Fp3.invertBatch(points.map((p) => p.ez));
      return points.map((p, i) => p.toAffine(toInv[i])).map(Point2.fromAffine);
    }
    // Multiscalar Multiplication
    static msm(points, scalars) {
      return pippenger(Point2, Fn, points, scalars);
    }
    // "Private method", don't use it directly
    _setWindowSize(windowSize) {
      wnaf.setWindowSize(this, windowSize);
    }
    // Not required for fromHex(), which always creates valid points.
    // Could be useful for fromAffine().
    assertValidity() {
      assertValidMemo(this);
    }
    // Compare one point to another.
    equals(other) {
      assertPoint(other);
      const { ex: X1, ey: Y1, ez: Z1 } = this;
      const { ex: X2, ey: Y2, ez: Z2 } = other;
      const X1Z2 = modP(X1 * Z2);
      const X2Z1 = modP(X2 * Z1);
      const Y1Z2 = modP(Y1 * Z2);
      const Y2Z1 = modP(Y2 * Z1);
      return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
    }
    is0() {
      return this.equals(Point2.ZERO);
    }
    negate() {
      return new Point2(modP(-this.ex), this.ey, this.ez, modP(-this.et));
    }
    // Fast algo for doubling Extended Point.
    // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#doubling-dbl-2008-hwcd
    // Cost: 4M + 4S + 1*a + 6add + 1*2.
    double() {
      const { a } = CURVE;
      const { ex: X1, ey: Y1, ez: Z1 } = this;
      const A = modP(X1 * X1);
      const B = modP(Y1 * Y1);
      const C = modP(_2n3 * modP(Z1 * Z1));
      const D = modP(a * A);
      const x1y1 = X1 + Y1;
      const E = modP(modP(x1y1 * x1y1) - A - B);
      const G2 = D + B;
      const F = G2 - C;
      const H = D - B;
      const X3 = modP(E * F);
      const Y3 = modP(G2 * H);
      const T3 = modP(E * H);
      const Z3 = modP(F * G2);
      return new Point2(X3, Y3, Z3, T3);
    }
    // Fast algo for adding 2 Extended Points.
    // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#addition-add-2008-hwcd
    // Cost: 9M + 1*a + 1*d + 7add.
    add(other) {
      assertPoint(other);
      const { a, d } = CURVE;
      const { ex: X1, ey: Y1, ez: Z1, et: T1 } = this;
      const { ex: X2, ey: Y2, ez: Z2, et: T2 } = other;
      if (a === BigInt(-1)) {
        const A2 = modP((Y1 - X1) * (Y2 + X2));
        const B2 = modP((Y1 + X1) * (Y2 - X2));
        const F2 = modP(B2 - A2);
        if (F2 === _0n4)
          return this.double();
        const C2 = modP(Z1 * _2n3 * T2);
        const D2 = modP(T1 * _2n3 * Z2);
        const E2 = D2 + C2;
        const G3 = B2 + A2;
        const H2 = D2 - C2;
        const X32 = modP(E2 * F2);
        const Y32 = modP(G3 * H2);
        const T32 = modP(E2 * H2);
        const Z32 = modP(F2 * G3);
        return new Point2(X32, Y32, Z32, T32);
      }
      const A = modP(X1 * X2);
      const B = modP(Y1 * Y2);
      const C = modP(T1 * d * T2);
      const D = modP(Z1 * Z2);
      const E = modP((X1 + Y1) * (X2 + Y2) - A - B);
      const F = D - C;
      const G2 = D + C;
      const H = modP(B - a * A);
      const X3 = modP(E * F);
      const Y3 = modP(G2 * H);
      const T3 = modP(E * H);
      const Z3 = modP(F * G2);
      return new Point2(X3, Y3, Z3, T3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    wNAF(n) {
      return wnaf.wNAFCached(this, n, Point2.normalizeZ);
    }
    // Constant-time multiplication.
    multiply(scalar) {
      const n = scalar;
      aInRange("scalar", n, _1n4, CURVE_ORDER);
      const { p, f } = this.wNAF(n);
      return Point2.normalizeZ([p, f])[0];
    }
    // Non-constant-time multiplication. Uses double-and-add algorithm.
    // It's faster, but should only be used when you don't care about
    // an exposed private key e.g. sig verification.
    // Does NOT allow scalars higher than CURVE.n.
    multiplyUnsafe(scalar) {
      const n = scalar;
      aInRange("scalar", n, _0n4, CURVE_ORDER);
      if (n === _0n4)
        return I;
      if (this.equals(I) || n === _1n4)
        return this;
      if (this.equals(G))
        return this.wNAF(n).p;
      return wnaf.unsafeLadder(this, n);
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
      return wnaf.unsafeLadder(this, CURVE_ORDER).is0();
    }
    // Converts Extended point to default (x, y) coordinates.
    // Can accept precomputed Z^-1 - for example, from invertBatch.
    toAffine(iz) {
      return toAffineMemo(this, iz);
    }
    clearCofactor() {
      const { h: cofactor2 } = CURVE;
      if (cofactor2 === _1n4)
        return this;
      return this.multiplyUnsafe(cofactor2);
    }
    // Converts hash string or Uint8Array to Point.
    // Uses algo from RFC8032 5.1.3.
    static fromHex(hex, zip215 = false) {
      const { d, a } = CURVE;
      const len = Fp3.BYTES;
      hex = ensureBytes("pointHex", hex, len);
      abool("zip215", zip215);
      const normed = hex.slice();
      const lastByte = hex[len - 1];
      normed[len - 1] = lastByte & ~128;
      const y = bytesToNumberLE(normed);
      const max = zip215 ? MASK : Fp3.ORDER;
      aInRange("pointHex.y", y, _0n4, max);
      const y2 = modP(y * y);
      const u = modP(y2 - _1n4);
      const v = modP(d * y2 - a);
      let { isValid, value: x } = uvRatio2(u, v);
      if (!isValid)
        throw new Error("Point.fromHex: invalid y coordinate");
      const isXOdd = (x & _1n4) === _1n4;
      const isLastByteOdd = (lastByte & 128) !== 0;
      if (!zip215 && x === _0n4 && isLastByteOdd)
        throw new Error("Point.fromHex: x=0 and x_0=1");
      if (isLastByteOdd !== isXOdd)
        x = modP(-x);
      return Point2.fromAffine({ x, y });
    }
    static fromPrivateKey(privKey) {
      return getExtendedPublicKey(privKey).point;
    }
    toRawBytes() {
      const { x, y } = this.toAffine();
      const bytes2 = numberToBytesLE(y, Fp3.BYTES);
      bytes2[bytes2.length - 1] |= x & _1n4 ? 128 : 0;
      return bytes2;
    }
    toHex() {
      return bytesToHex(this.toRawBytes());
    }
  }
  Point2.BASE = new Point2(CURVE.Gx, CURVE.Gy, _1n4, modP(CURVE.Gx * CURVE.Gy));
  Point2.ZERO = new Point2(_0n4, _1n4, _1n4, _0n4);
  const { BASE: G, ZERO: I } = Point2;
  const wnaf = wNAF(Point2, nByteLength * 8);
  function modN(a) {
    return mod(a, CURVE_ORDER);
  }
  __name(modN, "modN");
  function modN_LE(hash2) {
    return modN(bytesToNumberLE(hash2));
  }
  __name(modN_LE, "modN_LE");
  function getExtendedPublicKey(key) {
    const len = nByteLength;
    key = ensureBytes("private key", key, len);
    const hashed = ensureBytes("hashed private key", cHash(key), 2 * len);
    const head = adjustScalarBytes2(hashed.slice(0, len));
    const prefix = hashed.slice(len, 2 * len);
    const scalar = modN_LE(head);
    const point = G.multiply(scalar);
    const pointBytes = point.toRawBytes();
    return { head, prefix, scalar, point, pointBytes };
  }
  __name(getExtendedPublicKey, "getExtendedPublicKey");
  function getPublicKey(privKey) {
    return getExtendedPublicKey(privKey).pointBytes;
  }
  __name(getPublicKey, "getPublicKey");
  function hashDomainToScalar(context = new Uint8Array(), ...msgs) {
    const msg = concatBytes2(...msgs);
    return modN_LE(cHash(domain(msg, ensureBytes("context", context), !!prehash)));
  }
  __name(hashDomainToScalar, "hashDomainToScalar");
  function sign(msg, privKey, options = {}) {
    msg = ensureBytes("message", msg);
    if (prehash)
      msg = prehash(msg);
    const { prefix, scalar, pointBytes } = getExtendedPublicKey(privKey);
    const r = hashDomainToScalar(options.context, prefix, msg);
    const R = G.multiply(r).toRawBytes();
    const k = hashDomainToScalar(options.context, R, pointBytes, msg);
    const s = modN(r + k * scalar);
    aInRange("signature.s", s, _0n4, CURVE_ORDER);
    const res = concatBytes2(R, numberToBytesLE(s, Fp3.BYTES));
    return ensureBytes("result", res, nByteLength * 2);
  }
  __name(sign, "sign");
  const verifyOpts = VERIFY_DEFAULT;
  function verify(sig, msg, publicKey, options = verifyOpts) {
    const { context, zip215 } = options;
    const len = Fp3.BYTES;
    sig = ensureBytes("signature", sig, 2 * len);
    msg = ensureBytes("message", msg);
    if (zip215 !== void 0)
      abool("zip215", zip215);
    if (prehash)
      msg = prehash(msg);
    const s = bytesToNumberLE(sig.slice(len, 2 * len));
    let A, R, SB;
    try {
      A = Point2.fromHex(publicKey, zip215);
      R = Point2.fromHex(sig.slice(0, len), zip215);
      SB = G.multiplyUnsafe(s);
    } catch (error) {
      return false;
    }
    if (!zip215 && A.isSmallOrder())
      return false;
    const k = hashDomainToScalar(context, R.toRawBytes(), A.toRawBytes(), msg);
    const RkA = R.add(A.multiplyUnsafe(k));
    return RkA.subtract(SB).clearCofactor().equals(Point2.ZERO);
  }
  __name(verify, "verify");
  G._setWindowSize(8);
  const utils = {
    getExtendedPublicKey,
    // ed25519 private keys are uniform 32b. No need to check for modulo bias, like in secp256k1.
    randomPrivateKey: /* @__PURE__ */ __name(() => randomBytes3(Fp3.BYTES), "randomPrivateKey"),
    /**
     * We're doing scalar multiplication (used in getPublicKey etc) with precomputed BASE_POINT
     * values. This slows down first getPublicKey() by milliseconds (see Speed section),
     * but allows to speed-up subsequent getPublicKey() calls up to 20x.
     * @param windowSize 2, 4, 8, 16
     */
    precompute(windowSize = 8, point = Point2.BASE) {
      point._setWindowSize(windowSize);
      point.multiply(BigInt(3));
      return point;
    }
  };
  return {
    CURVE,
    getPublicKey,
    sign,
    verify,
    ExtendedPoint: Point2,
    utils
  };
}
__name(twistedEdwards, "twistedEdwards");

// node_modules/@noble/curves/esm/ed25519.js
var ED25519_P = BigInt("57896044618658097711785492504343953926634992332820282019728792003956564819949");
var ED25519_SQRT_M1 = /* @__PURE__ */ BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
var _0n5 = BigInt(0);
var _1n5 = BigInt(1);
var _2n4 = BigInt(2);
var _3n2 = BigInt(3);
var _5n2 = BigInt(5);
var _8n3 = BigInt(8);
function ed25519_pow_2_252_3(x) {
  const _10n = BigInt(10), _20n = BigInt(20), _40n = BigInt(40), _80n = BigInt(80);
  const P = ED25519_P;
  const x2 = x * x % P;
  const b2 = x2 * x % P;
  const b4 = pow2(b2, _2n4, P) * b2 % P;
  const b5 = pow2(b4, _1n5, P) * x % P;
  const b10 = pow2(b5, _5n2, P) * b5 % P;
  const b20 = pow2(b10, _10n, P) * b10 % P;
  const b40 = pow2(b20, _20n, P) * b20 % P;
  const b80 = pow2(b40, _40n, P) * b40 % P;
  const b160 = pow2(b80, _80n, P) * b80 % P;
  const b240 = pow2(b160, _80n, P) * b80 % P;
  const b250 = pow2(b240, _10n, P) * b10 % P;
  const pow_p_5_8 = pow2(b250, _2n4, P) * x % P;
  return { pow_p_5_8, b2 };
}
__name(ed25519_pow_2_252_3, "ed25519_pow_2_252_3");
function adjustScalarBytes(bytes2) {
  bytes2[0] &= 248;
  bytes2[31] &= 127;
  bytes2[31] |= 64;
  return bytes2;
}
__name(adjustScalarBytes, "adjustScalarBytes");
function uvRatio(u, v) {
  const P = ED25519_P;
  const v3 = mod(v * v * v, P);
  const v7 = mod(v3 * v3 * v, P);
  const pow3 = ed25519_pow_2_252_3(u * v7).pow_p_5_8;
  let x = mod(u * v3 * pow3, P);
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
var Fp = /* @__PURE__ */ (() => Field(ED25519_P, void 0, true))();
var ed25519Defaults = /* @__PURE__ */ (() => ({
  // Param: a
  a: BigInt(-1),
  // Fp.create(-1) is proper; our way still works and is faster
  // d is equal to -121665/121666 over finite field.
  // Negative number is P - number, and division is invert(number, P)
  d: BigInt("37095705934669439343138083508754565189542113879843219016388785533085940283555"),
  // Finite field 𝔽p over which we'll do calculations; 2n**255n - 19n
  Fp,
  // Subgroup order: how many points curve has
  // 2n**252n + 27742317777372353535851937790883648493n;
  n: BigInt("7237005577332262213973186563042994240857116359379907606001950938285454250989"),
  // Cofactor
  h: _8n3,
  // Base point (x, y) aka generator point
  Gx: BigInt("15112221349535400772501151409588531511454012693041857206046113283949847762202"),
  Gy: BigInt("46316835694926478169428394003475163141307993866256225615783033603165251855960"),
  hash: sha512,
  randomBytes,
  adjustScalarBytes,
  // dom2
  // Ratio of u to v. Allows us to combine inversion and square root. Uses algo from RFC8032 5.1.3.
  // Constant-time, u/√v
  uvRatio
}))();
var ed25519 = /* @__PURE__ */ (() => twistedEdwards(ed25519Defaults))();

// node_modules/@libp2p/crypto/dist/src/keys/ed25519/index.browser.js
var PUBLIC_KEY_BYTE_LENGTH = 32;
function hashAndVerify(publicKey, sig, msg) {
  return ed25519.verify(sig, msg instanceof Uint8Array ? msg : msg.subarray(), publicKey);
}
__name(hashAndVerify, "hashAndVerify");

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
  verify(data, sig) {
    return hashAndVerify(this.raw, sig, data);
  }
};

// node_modules/@libp2p/crypto/dist/src/keys/ed25519/utils.js
function unmarshalEd25519PublicKey(bytes2) {
  bytes2 = ensureEd25519Key(bytes2, PUBLIC_KEY_BYTE_LENGTH);
  return new Ed25519PublicKey(bytes2);
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

// node_modules/uint8arrays/dist/src/alloc.js
function alloc(size = 0) {
  return new Uint8Array(size);
}
__name(alloc, "alloc");
function allocUnsafe(size = 0) {
  return new Uint8Array(size);
}
__name(allocUnsafe, "allocUnsafe");

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
function encode4(value, buf, offset = 0) {
  if (buf == null) {
    buf = allocUnsafe(encodingLength2(value));
  }
  if (buf instanceof Uint8Array) {
    return encodeUint8Array(value, buf, offset);
  } else {
    return encodeUint8ArrayList(value, buf, offset);
  }
}
__name(encode4, "encode");
function decode5(buf, offset = 0) {
  if (buf instanceof Uint8Array) {
    return decodeUint8Array(buf, offset);
  } else {
    return decodeUint8ArrayList(buf, offset);
  }
}
__name(decode5, "decode");

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
    if (this.buf[this.pos++] < 128)
      return value;
    value = (value | (this.buf[this.pos] & 127) << 7) >>> 0;
    if (this.buf[this.pos++] < 128)
      return value;
    value = (value | (this.buf[this.pos] & 127) << 14) >>> 0;
    if (this.buf[this.pos++] < 128)
      return value;
    value = (value | (this.buf[this.pos] & 127) << 21) >>> 0;
    if (this.buf[this.pos++] < 128)
      return value;
    value = (value | (this.buf[this.pos] & 15) << 28) >>> 0;
    if (this.buf[this.pos++] < 128)
      return value;
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
    const bytes2 = this.bytes();
    return read2(bytes2, 0, bytes2.length);
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
function encode5(data) {
  return data.reduce((p, c) => {
    p += alphabetBytesToChars[c];
    return p;
  }, "");
}
__name(encode5, "encode");
function decode6(str) {
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
__name(decode6, "decode");
var base256emoji = from({
  prefix: "\u{1F680}",
  name: "base256emoji",
  encode: encode5,
  decode: decode6
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
  sha512: () => sha5122
});

// node_modules/multiformats/dist/src/hashes/hasher.js
function from2({ name: name2, code: code2, encode: encode7 }) {
  return new Hasher(name2, code2, encode7);
}
__name(from2, "from");
var Hasher = class {
  static {
    __name(this, "Hasher");
  }
  name;
  code;
  encode;
  constructor(name2, code2, encode7) {
    this.name = name2;
    this.code = code2;
    this.encode = encode7;
  }
  digest(input) {
    if (input instanceof Uint8Array) {
      const result = this.encode(input);
      return result instanceof Uint8Array ? create(this.code, result) : result.then((digest2) => create(this.code, digest2));
    } else {
      throw Error("Unknown type, must be binary type");
    }
  }
};

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
var sha5122 = from2({
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
})(KeyType || (KeyType = {}));
var __KeyTypeValues;
(function(__KeyTypeValues2) {
  __KeyTypeValues2[__KeyTypeValues2["RSA"] = 0] = "RSA";
  __KeyTypeValues2[__KeyTypeValues2["Ed25519"] = 1] = "Ed25519";
  __KeyTypeValues2[__KeyTypeValues2["secp256k1"] = 2] = "secp256k1";
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
var utils_exports2 = {};
__export(utils_exports2, {
  MAX_RSA_KEY_SIZE: () => MAX_RSA_KEY_SIZE,
  generateRSAKeyPair: () => generateRSAKeyPair,
  jwkToJWKKeyPair: () => jwkToJWKKeyPair,
  jwkToPkcs1: () => jwkToPkcs1,
  jwkToPkix: () => jwkToPkix,
  jwkToRSAPrivateKey: () => jwkToRSAPrivateKey,
  pkcs1ToJwk: () => pkcs1ToJwk,
  pkcs1ToRSAPrivateKey: () => pkcs1ToRSAPrivateKey,
  pkixToJwk: () => pkixToJwk,
  pkixToRSAPublicKey: () => pkixToRSAPublicKey
});

// node_modules/@noble/hashes/esm/sha256.js
var SHA256_K = /* @__PURE__ */ new Uint32Array([
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
var SHA256_IV = /* @__PURE__ */ new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
var SHA256 = class extends HashMD {
  static {
    __name(this, "SHA256");
  }
  constructor() {
    super(64, 32, 8, false);
    this.A = SHA256_IV[0] | 0;
    this.B = SHA256_IV[1] | 0;
    this.C = SHA256_IV[2] | 0;
    this.D = SHA256_IV[3] | 0;
    this.E = SHA256_IV[4] | 0;
    this.F = SHA256_IV[5] | 0;
    this.G = SHA256_IV[6] | 0;
    this.H = SHA256_IV[7] | 0;
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
    SHA256_W.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    this.buffer.fill(0);
  }
};
var sha2562 = /* @__PURE__ */ wrapConstructor(() => new SHA256());

// node_modules/asn1js/build/index.es.js
var pvtsutils = __toESM(require_build());

// node_modules/pvutils/build/utils.es.js
function utilFromBase(inputBuffer, inputBase) {
  let result = 0;
  if (inputBuffer.length === 1) {
    return inputBuffer[0];
  }
  for (let i = inputBuffer.length - 1; i >= 0; i--) {
    result += inputBuffer[inputBuffer.length - 1 - i] * Math.pow(2, inputBase * i);
  }
  return result;
}
__name(utilFromBase, "utilFromBase");
function utilToBase(value, base3, reserved = -1) {
  const internalReserved = reserved;
  let internalValue = value;
  let result = 0;
  let biggest = Math.pow(2, base3);
  for (let i = 1; i < 8; i++) {
    if (value < biggest) {
      let retBuf;
      if (internalReserved < 0) {
        retBuf = new ArrayBuffer(i);
        result = i;
      } else {
        if (internalReserved < i) {
          return new ArrayBuffer(0);
        }
        retBuf = new ArrayBuffer(internalReserved);
        result = internalReserved;
      }
      const retView = new Uint8Array(retBuf);
      for (let j = i - 1; j >= 0; j--) {
        const basis = Math.pow(2, j * base3);
        retView[result - j - 1] = Math.floor(internalValue / basis);
        internalValue -= retView[result - j - 1] * basis;
      }
      return retBuf;
    }
    biggest *= Math.pow(2, base3);
  }
  return new ArrayBuffer(0);
}
__name(utilToBase, "utilToBase");
function utilConcatView(...views) {
  let outputLength = 0;
  let prevLength = 0;
  for (const view of views) {
    outputLength += view.length;
  }
  const retBuf = new ArrayBuffer(outputLength);
  const retView = new Uint8Array(retBuf);
  for (const view of views) {
    retView.set(view, prevLength);
    prevLength += view.length;
  }
  return retView;
}
__name(utilConcatView, "utilConcatView");
function utilDecodeTC() {
  const buf = new Uint8Array(this.valueHex);
  if (this.valueHex.byteLength >= 2) {
    const condition1 = buf[0] === 255 && buf[1] & 128;
    const condition2 = buf[0] === 0 && (buf[1] & 128) === 0;
    if (condition1 || condition2) {
      this.warnings.push("Needlessly long format");
    }
  }
  const bigIntBuffer = new ArrayBuffer(this.valueHex.byteLength);
  const bigIntView = new Uint8Array(bigIntBuffer);
  for (let i = 0; i < this.valueHex.byteLength; i++) {
    bigIntView[i] = 0;
  }
  bigIntView[0] = buf[0] & 128;
  const bigInt = utilFromBase(bigIntView, 8);
  const smallIntBuffer = new ArrayBuffer(this.valueHex.byteLength);
  const smallIntView = new Uint8Array(smallIntBuffer);
  for (let j = 0; j < this.valueHex.byteLength; j++) {
    smallIntView[j] = buf[j];
  }
  smallIntView[0] &= 127;
  const smallInt = utilFromBase(smallIntView, 8);
  return smallInt - bigInt;
}
__name(utilDecodeTC, "utilDecodeTC");
function utilEncodeTC(value) {
  const modValue = value < 0 ? value * -1 : value;
  let bigInt = 128;
  for (let i = 1; i < 8; i++) {
    if (modValue <= bigInt) {
      if (value < 0) {
        const smallInt = bigInt - modValue;
        const retBuf2 = utilToBase(smallInt, 8, i);
        const retView2 = new Uint8Array(retBuf2);
        retView2[0] |= 128;
        return retBuf2;
      }
      let retBuf = utilToBase(modValue, 8, i);
      let retView = new Uint8Array(retBuf);
      if (retView[0] & 128) {
        const tempBuf = retBuf.slice(0);
        const tempView = new Uint8Array(tempBuf);
        retBuf = new ArrayBuffer(retBuf.byteLength + 1);
        retView = new Uint8Array(retBuf);
        for (let k = 0; k < tempBuf.byteLength; k++) {
          retView[k + 1] = tempView[k];
        }
        retView[0] = 0;
      }
      return retBuf;
    }
    bigInt *= Math.pow(2, 8);
  }
  return new ArrayBuffer(0);
}
__name(utilEncodeTC, "utilEncodeTC");
function isEqualBuffer(inputBuffer1, inputBuffer2) {
  if (inputBuffer1.byteLength !== inputBuffer2.byteLength) {
    return false;
  }
  const view1 = new Uint8Array(inputBuffer1);
  const view2 = new Uint8Array(inputBuffer2);
  for (let i = 0; i < view1.length; i++) {
    if (view1[i] !== view2[i]) {
      return false;
    }
  }
  return true;
}
__name(isEqualBuffer, "isEqualBuffer");
function padNumber(inputNumber, fullLength) {
  const str = inputNumber.toString(10);
  if (fullLength < str.length) {
    return "";
  }
  const dif = fullLength - str.length;
  const padding = new Array(dif);
  for (let i = 0; i < dif; i++) {
    padding[i] = "0";
  }
  const paddingString = padding.join("");
  return paddingString.concat(str);
}
__name(padNumber, "padNumber");
var log2 = Math.log(2);

// node_modules/asn1js/build/index.es.js
function assertBigInt() {
  if (typeof BigInt === "undefined") {
    throw new Error("BigInt is not defined. Your environment doesn't implement BigInt.");
  }
}
__name(assertBigInt, "assertBigInt");
function concat(buffers) {
  let outputLength = 0;
  let prevLength = 0;
  for (let i = 0; i < buffers.length; i++) {
    const buffer = buffers[i];
    outputLength += buffer.byteLength;
  }
  const retView = new Uint8Array(outputLength);
  for (let i = 0; i < buffers.length; i++) {
    const buffer = buffers[i];
    retView.set(new Uint8Array(buffer), prevLength);
    prevLength += buffer.byteLength;
  }
  return retView.buffer;
}
__name(concat, "concat");
function checkBufferParams(baseBlock, inputBuffer, inputOffset, inputLength) {
  if (!(inputBuffer instanceof Uint8Array)) {
    baseBlock.error = "Wrong parameter: inputBuffer must be 'Uint8Array'";
    return false;
  }
  if (!inputBuffer.byteLength) {
    baseBlock.error = "Wrong parameter: inputBuffer has zero length";
    return false;
  }
  if (inputOffset < 0) {
    baseBlock.error = "Wrong parameter: inputOffset less than zero";
    return false;
  }
  if (inputLength < 0) {
    baseBlock.error = "Wrong parameter: inputLength less than zero";
    return false;
  }
  if (inputBuffer.byteLength - inputOffset - inputLength < 0) {
    baseBlock.error = "End of input reached before message was fully decoded (inconsistent offset and length values)";
    return false;
  }
  return true;
}
__name(checkBufferParams, "checkBufferParams");
var ViewWriter = class {
  static {
    __name(this, "ViewWriter");
  }
  constructor() {
    this.items = [];
  }
  write(buf) {
    this.items.push(buf);
  }
  final() {
    return concat(this.items);
  }
};
var powers2 = [new Uint8Array([1])];
var digitsString = "0123456789";
var EMPTY_STRING = "";
var EMPTY_BUFFER = new ArrayBuffer(0);
var EMPTY_VIEW = new Uint8Array(0);
var END_OF_CONTENT_NAME = "EndOfContent";
var OCTET_STRING_NAME = "OCTET STRING";
var BIT_STRING_NAME = "BIT STRING";
function HexBlock(BaseClass) {
  var _a2;
  return _a2 = class Some extends BaseClass {
    static {
      __name(this, "Some");
    }
    constructor(...args) {
      var _a3;
      super(...args);
      const params = args[0] || {};
      this.isHexOnly = (_a3 = params.isHexOnly) !== null && _a3 !== void 0 ? _a3 : false;
      this.valueHexView = params.valueHex ? pvtsutils.BufferSourceConverter.toUint8Array(params.valueHex) : EMPTY_VIEW;
    }
    get valueHex() {
      return this.valueHexView.slice().buffer;
    }
    set valueHex(value) {
      this.valueHexView = new Uint8Array(value);
    }
    fromBER(inputBuffer, inputOffset, inputLength) {
      const view = inputBuffer instanceof ArrayBuffer ? new Uint8Array(inputBuffer) : inputBuffer;
      if (!checkBufferParams(this, view, inputOffset, inputLength)) {
        return -1;
      }
      const endLength = inputOffset + inputLength;
      this.valueHexView = view.subarray(inputOffset, endLength);
      if (!this.valueHexView.length) {
        this.warnings.push("Zero buffer length");
        return inputOffset;
      }
      this.blockLength = inputLength;
      return endLength;
    }
    toBER(sizeOnly = false) {
      if (!this.isHexOnly) {
        this.error = "Flag 'isHexOnly' is not set, abort";
        return EMPTY_BUFFER;
      }
      if (sizeOnly) {
        return new ArrayBuffer(this.valueHexView.byteLength);
      }
      return this.valueHexView.byteLength === this.valueHexView.buffer.byteLength ? this.valueHexView.buffer : this.valueHexView.slice().buffer;
    }
    toJSON() {
      return {
        ...super.toJSON(),
        isHexOnly: this.isHexOnly,
        valueHex: pvtsutils.Convert.ToHex(this.valueHexView)
      };
    }
  }, _a2.NAME = "hexBlock", _a2;
}
__name(HexBlock, "HexBlock");
var LocalBaseBlock = class {
  static {
    __name(this, "LocalBaseBlock");
  }
  constructor({ blockLength = 0, error = EMPTY_STRING, warnings = [], valueBeforeDecode = EMPTY_VIEW } = {}) {
    this.blockLength = blockLength;
    this.error = error;
    this.warnings = warnings;
    this.valueBeforeDecodeView = pvtsutils.BufferSourceConverter.toUint8Array(valueBeforeDecode);
  }
  static blockName() {
    return this.NAME;
  }
  get valueBeforeDecode() {
    return this.valueBeforeDecodeView.slice().buffer;
  }
  set valueBeforeDecode(value) {
    this.valueBeforeDecodeView = new Uint8Array(value);
  }
  toJSON() {
    return {
      blockName: this.constructor.NAME,
      blockLength: this.blockLength,
      error: this.error,
      warnings: this.warnings,
      valueBeforeDecode: pvtsutils.Convert.ToHex(this.valueBeforeDecodeView)
    };
  }
};
LocalBaseBlock.NAME = "baseBlock";
var ValueBlock = class extends LocalBaseBlock {
  static {
    __name(this, "ValueBlock");
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    throw TypeError("User need to make a specific function in a class which extends 'ValueBlock'");
  }
  toBER(sizeOnly, writer) {
    throw TypeError("User need to make a specific function in a class which extends 'ValueBlock'");
  }
};
ValueBlock.NAME = "valueBlock";
var LocalIdentificationBlock = class extends HexBlock(LocalBaseBlock) {
  static {
    __name(this, "LocalIdentificationBlock");
  }
  constructor({ idBlock = {} } = {}) {
    var _a2, _b, _c, _d;
    super();
    if (idBlock) {
      this.isHexOnly = (_a2 = idBlock.isHexOnly) !== null && _a2 !== void 0 ? _a2 : false;
      this.valueHexView = idBlock.valueHex ? pvtsutils.BufferSourceConverter.toUint8Array(idBlock.valueHex) : EMPTY_VIEW;
      this.tagClass = (_b = idBlock.tagClass) !== null && _b !== void 0 ? _b : -1;
      this.tagNumber = (_c = idBlock.tagNumber) !== null && _c !== void 0 ? _c : -1;
      this.isConstructed = (_d = idBlock.isConstructed) !== null && _d !== void 0 ? _d : false;
    } else {
      this.tagClass = -1;
      this.tagNumber = -1;
      this.isConstructed = false;
    }
  }
  toBER(sizeOnly = false) {
    let firstOctet = 0;
    switch (this.tagClass) {
      case 1:
        firstOctet |= 0;
        break;
      case 2:
        firstOctet |= 64;
        break;
      case 3:
        firstOctet |= 128;
        break;
      case 4:
        firstOctet |= 192;
        break;
      default:
        this.error = "Unknown tag class";
        return EMPTY_BUFFER;
    }
    if (this.isConstructed)
      firstOctet |= 32;
    if (this.tagNumber < 31 && !this.isHexOnly) {
      const retView2 = new Uint8Array(1);
      if (!sizeOnly) {
        let number2 = this.tagNumber;
        number2 &= 31;
        firstOctet |= number2;
        retView2[0] = firstOctet;
      }
      return retView2.buffer;
    }
    if (!this.isHexOnly) {
      const encodedBuf = utilToBase(this.tagNumber, 7);
      const encodedView = new Uint8Array(encodedBuf);
      const size = encodedBuf.byteLength;
      const retView2 = new Uint8Array(size + 1);
      retView2[0] = firstOctet | 31;
      if (!sizeOnly) {
        for (let i = 0; i < size - 1; i++)
          retView2[i + 1] = encodedView[i] | 128;
        retView2[size] = encodedView[size - 1];
      }
      return retView2.buffer;
    }
    const retView = new Uint8Array(this.valueHexView.byteLength + 1);
    retView[0] = firstOctet | 31;
    if (!sizeOnly) {
      const curView = this.valueHexView;
      for (let i = 0; i < curView.length - 1; i++)
        retView[i + 1] = curView[i] | 128;
      retView[this.valueHexView.byteLength] = curView[curView.length - 1];
    }
    return retView.buffer;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    const inputView = pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer);
    if (!checkBufferParams(this, inputView, inputOffset, inputLength)) {
      return -1;
    }
    const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
    if (intBuffer.length === 0) {
      this.error = "Zero buffer length";
      return -1;
    }
    const tagClassMask = intBuffer[0] & 192;
    switch (tagClassMask) {
      case 0:
        this.tagClass = 1;
        break;
      case 64:
        this.tagClass = 2;
        break;
      case 128:
        this.tagClass = 3;
        break;
      case 192:
        this.tagClass = 4;
        break;
      default:
        this.error = "Unknown tag class";
        return -1;
    }
    this.isConstructed = (intBuffer[0] & 32) === 32;
    this.isHexOnly = false;
    const tagNumberMask = intBuffer[0] & 31;
    if (tagNumberMask !== 31) {
      this.tagNumber = tagNumberMask;
      this.blockLength = 1;
    } else {
      let count = 1;
      let intTagNumberBuffer = this.valueHexView = new Uint8Array(255);
      let tagNumberBufferMaxLength = 255;
      while (intBuffer[count] & 128) {
        intTagNumberBuffer[count - 1] = intBuffer[count] & 127;
        count++;
        if (count >= intBuffer.length) {
          this.error = "End of input reached before message was fully decoded";
          return -1;
        }
        if (count === tagNumberBufferMaxLength) {
          tagNumberBufferMaxLength += 255;
          const tempBufferView2 = new Uint8Array(tagNumberBufferMaxLength);
          for (let i = 0; i < intTagNumberBuffer.length; i++)
            tempBufferView2[i] = intTagNumberBuffer[i];
          intTagNumberBuffer = this.valueHexView = new Uint8Array(tagNumberBufferMaxLength);
        }
      }
      this.blockLength = count + 1;
      intTagNumberBuffer[count - 1] = intBuffer[count] & 127;
      const tempBufferView = new Uint8Array(count);
      for (let i = 0; i < count; i++)
        tempBufferView[i] = intTagNumberBuffer[i];
      intTagNumberBuffer = this.valueHexView = new Uint8Array(count);
      intTagNumberBuffer.set(tempBufferView);
      if (this.blockLength <= 9)
        this.tagNumber = utilFromBase(intTagNumberBuffer, 7);
      else {
        this.isHexOnly = true;
        this.warnings.push("Tag too long, represented as hex-coded");
      }
    }
    if (this.tagClass === 1 && this.isConstructed) {
      switch (this.tagNumber) {
        case 1:
        case 2:
        case 5:
        case 6:
        case 9:
        case 13:
        case 14:
        case 23:
        case 24:
        case 31:
        case 32:
        case 33:
        case 34:
          this.error = "Constructed encoding used for primitive type";
          return -1;
      }
    }
    return inputOffset + this.blockLength;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      tagClass: this.tagClass,
      tagNumber: this.tagNumber,
      isConstructed: this.isConstructed
    };
  }
};
LocalIdentificationBlock.NAME = "identificationBlock";
var LocalLengthBlock = class extends LocalBaseBlock {
  static {
    __name(this, "LocalLengthBlock");
  }
  constructor({ lenBlock = {} } = {}) {
    var _a2, _b, _c;
    super();
    this.isIndefiniteForm = (_a2 = lenBlock.isIndefiniteForm) !== null && _a2 !== void 0 ? _a2 : false;
    this.longFormUsed = (_b = lenBlock.longFormUsed) !== null && _b !== void 0 ? _b : false;
    this.length = (_c = lenBlock.length) !== null && _c !== void 0 ? _c : 0;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    const view = pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer);
    if (!checkBufferParams(this, view, inputOffset, inputLength)) {
      return -1;
    }
    const intBuffer = view.subarray(inputOffset, inputOffset + inputLength);
    if (intBuffer.length === 0) {
      this.error = "Zero buffer length";
      return -1;
    }
    if (intBuffer[0] === 255) {
      this.error = "Length block 0xFF is reserved by standard";
      return -1;
    }
    this.isIndefiniteForm = intBuffer[0] === 128;
    if (this.isIndefiniteForm) {
      this.blockLength = 1;
      return inputOffset + this.blockLength;
    }
    this.longFormUsed = !!(intBuffer[0] & 128);
    if (this.longFormUsed === false) {
      this.length = intBuffer[0];
      this.blockLength = 1;
      return inputOffset + this.blockLength;
    }
    const count = intBuffer[0] & 127;
    if (count > 8) {
      this.error = "Too big integer";
      return -1;
    }
    if (count + 1 > intBuffer.length) {
      this.error = "End of input reached before message was fully decoded";
      return -1;
    }
    const lenOffset = inputOffset + 1;
    const lengthBufferView = view.subarray(lenOffset, lenOffset + count);
    if (lengthBufferView[count - 1] === 0)
      this.warnings.push("Needlessly long encoded length");
    this.length = utilFromBase(lengthBufferView, 8);
    if (this.longFormUsed && this.length <= 127)
      this.warnings.push("Unnecessary usage of long length form");
    this.blockLength = count + 1;
    return inputOffset + this.blockLength;
  }
  toBER(sizeOnly = false) {
    let retBuf;
    let retView;
    if (this.length > 127)
      this.longFormUsed = true;
    if (this.isIndefiniteForm) {
      retBuf = new ArrayBuffer(1);
      if (sizeOnly === false) {
        retView = new Uint8Array(retBuf);
        retView[0] = 128;
      }
      return retBuf;
    }
    if (this.longFormUsed) {
      const encodedBuf = utilToBase(this.length, 8);
      if (encodedBuf.byteLength > 127) {
        this.error = "Too big length";
        return EMPTY_BUFFER;
      }
      retBuf = new ArrayBuffer(encodedBuf.byteLength + 1);
      if (sizeOnly)
        return retBuf;
      const encodedView = new Uint8Array(encodedBuf);
      retView = new Uint8Array(retBuf);
      retView[0] = encodedBuf.byteLength | 128;
      for (let i = 0; i < encodedBuf.byteLength; i++)
        retView[i + 1] = encodedView[i];
      return retBuf;
    }
    retBuf = new ArrayBuffer(1);
    if (sizeOnly === false) {
      retView = new Uint8Array(retBuf);
      retView[0] = this.length;
    }
    return retBuf;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      isIndefiniteForm: this.isIndefiniteForm,
      longFormUsed: this.longFormUsed,
      length: this.length
    };
  }
};
LocalLengthBlock.NAME = "lengthBlock";
var typeStore = {};
var BaseBlock = class extends LocalBaseBlock {
  static {
    __name(this, "BaseBlock");
  }
  constructor({ name: name2 = EMPTY_STRING, optional = false, primitiveSchema, ...parameters } = {}, valueBlockType) {
    super(parameters);
    this.name = name2;
    this.optional = optional;
    if (primitiveSchema) {
      this.primitiveSchema = primitiveSchema;
    }
    this.idBlock = new LocalIdentificationBlock(parameters);
    this.lenBlock = new LocalLengthBlock(parameters);
    this.valueBlock = valueBlockType ? new valueBlockType(parameters) : new ValueBlock(parameters);
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm ? inputLength : this.lenBlock.length);
    if (resultOffset === -1) {
      this.error = this.valueBlock.error;
      return resultOffset;
    }
    if (!this.idBlock.error.length)
      this.blockLength += this.idBlock.blockLength;
    if (!this.lenBlock.error.length)
      this.blockLength += this.lenBlock.blockLength;
    if (!this.valueBlock.error.length)
      this.blockLength += this.valueBlock.blockLength;
    return resultOffset;
  }
  toBER(sizeOnly, writer) {
    const _writer = writer || new ViewWriter();
    if (!writer) {
      prepareIndefiniteForm(this);
    }
    const idBlockBuf = this.idBlock.toBER(sizeOnly);
    _writer.write(idBlockBuf);
    if (this.lenBlock.isIndefiniteForm) {
      _writer.write(new Uint8Array([128]).buffer);
      this.valueBlock.toBER(sizeOnly, _writer);
      _writer.write(new ArrayBuffer(2));
    } else {
      const valueBlockBuf = this.valueBlock.toBER(sizeOnly);
      this.lenBlock.length = valueBlockBuf.byteLength;
      const lenBlockBuf = this.lenBlock.toBER(sizeOnly);
      _writer.write(lenBlockBuf);
      _writer.write(valueBlockBuf);
    }
    if (!writer) {
      return _writer.final();
    }
    return EMPTY_BUFFER;
  }
  toJSON() {
    const object = {
      ...super.toJSON(),
      idBlock: this.idBlock.toJSON(),
      lenBlock: this.lenBlock.toJSON(),
      valueBlock: this.valueBlock.toJSON(),
      name: this.name,
      optional: this.optional
    };
    if (this.primitiveSchema)
      object.primitiveSchema = this.primitiveSchema.toJSON();
    return object;
  }
  toString(encoding = "ascii") {
    if (encoding === "ascii") {
      return this.onAsciiEncoding();
    }
    return pvtsutils.Convert.ToHex(this.toBER());
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${pvtsutils.Convert.ToHex(this.valueBlock.valueBeforeDecodeView)}`;
  }
  isEqual(other) {
    if (this === other) {
      return true;
    }
    if (!(other instanceof this.constructor)) {
      return false;
    }
    const thisRaw = this.toBER();
    const otherRaw = other.toBER();
    return isEqualBuffer(thisRaw, otherRaw);
  }
};
BaseBlock.NAME = "BaseBlock";
function prepareIndefiniteForm(baseBlock) {
  if (baseBlock instanceof typeStore.Constructed) {
    for (const value of baseBlock.valueBlock.value) {
      if (prepareIndefiniteForm(value)) {
        baseBlock.lenBlock.isIndefiniteForm = true;
      }
    }
  }
  return !!baseBlock.lenBlock.isIndefiniteForm;
}
__name(prepareIndefiniteForm, "prepareIndefiniteForm");
var BaseStringBlock = class extends BaseBlock {
  static {
    __name(this, "BaseStringBlock");
  }
  constructor({ value = EMPTY_STRING, ...parameters } = {}, stringValueBlockType) {
    super(parameters, stringValueBlockType);
    if (value) {
      this.fromString(value);
    }
  }
  getValue() {
    return this.valueBlock.value;
  }
  setValue(value) {
    this.valueBlock.value = value;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm ? inputLength : this.lenBlock.length);
    if (resultOffset === -1) {
      this.error = this.valueBlock.error;
      return resultOffset;
    }
    this.fromBuffer(this.valueBlock.valueHexView);
    if (!this.idBlock.error.length)
      this.blockLength += this.idBlock.blockLength;
    if (!this.lenBlock.error.length)
      this.blockLength += this.lenBlock.blockLength;
    if (!this.valueBlock.error.length)
      this.blockLength += this.valueBlock.blockLength;
    return resultOffset;
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : '${this.valueBlock.value}'`;
  }
};
BaseStringBlock.NAME = "BaseStringBlock";
var LocalPrimitiveValueBlock = class extends HexBlock(ValueBlock) {
  static {
    __name(this, "LocalPrimitiveValueBlock");
  }
  constructor({ isHexOnly = true, ...parameters } = {}) {
    super(parameters);
    this.isHexOnly = isHexOnly;
  }
};
LocalPrimitiveValueBlock.NAME = "PrimitiveValueBlock";
var _a$w;
var Primitive = class extends BaseBlock {
  static {
    __name(this, "Primitive");
  }
  constructor(parameters = {}) {
    super(parameters, LocalPrimitiveValueBlock);
    this.idBlock.isConstructed = false;
  }
};
_a$w = Primitive;
(() => {
  typeStore.Primitive = _a$w;
})();
Primitive.NAME = "PRIMITIVE";
function localChangeType(inputObject, newType) {
  if (inputObject instanceof newType) {
    return inputObject;
  }
  const newObject = new newType();
  newObject.idBlock = inputObject.idBlock;
  newObject.lenBlock = inputObject.lenBlock;
  newObject.warnings = inputObject.warnings;
  newObject.valueBeforeDecodeView = inputObject.valueBeforeDecodeView;
  return newObject;
}
__name(localChangeType, "localChangeType");
function localFromBER(inputBuffer, inputOffset = 0, inputLength = inputBuffer.length) {
  const incomingOffset = inputOffset;
  let returnObject = new BaseBlock({}, ValueBlock);
  const baseBlock = new LocalBaseBlock();
  if (!checkBufferParams(baseBlock, inputBuffer, inputOffset, inputLength)) {
    returnObject.error = baseBlock.error;
    return {
      offset: -1,
      result: returnObject
    };
  }
  const intBuffer = inputBuffer.subarray(inputOffset, inputOffset + inputLength);
  if (!intBuffer.length) {
    returnObject.error = "Zero buffer length";
    return {
      offset: -1,
      result: returnObject
    };
  }
  let resultOffset = returnObject.idBlock.fromBER(inputBuffer, inputOffset, inputLength);
  if (returnObject.idBlock.warnings.length) {
    returnObject.warnings.concat(returnObject.idBlock.warnings);
  }
  if (resultOffset === -1) {
    returnObject.error = returnObject.idBlock.error;
    return {
      offset: -1,
      result: returnObject
    };
  }
  inputOffset = resultOffset;
  inputLength -= returnObject.idBlock.blockLength;
  resultOffset = returnObject.lenBlock.fromBER(inputBuffer, inputOffset, inputLength);
  if (returnObject.lenBlock.warnings.length) {
    returnObject.warnings.concat(returnObject.lenBlock.warnings);
  }
  if (resultOffset === -1) {
    returnObject.error = returnObject.lenBlock.error;
    return {
      offset: -1,
      result: returnObject
    };
  }
  inputOffset = resultOffset;
  inputLength -= returnObject.lenBlock.blockLength;
  if (!returnObject.idBlock.isConstructed && returnObject.lenBlock.isIndefiniteForm) {
    returnObject.error = "Indefinite length form used for primitive encoding form";
    return {
      offset: -1,
      result: returnObject
    };
  }
  let newASN1Type = BaseBlock;
  switch (returnObject.idBlock.tagClass) {
    case 1:
      if (returnObject.idBlock.tagNumber >= 37 && returnObject.idBlock.isHexOnly === false) {
        returnObject.error = "UNIVERSAL 37 and upper tags are reserved by ASN.1 standard";
        return {
          offset: -1,
          result: returnObject
        };
      }
      switch (returnObject.idBlock.tagNumber) {
        case 0:
          if (returnObject.idBlock.isConstructed && returnObject.lenBlock.length > 0) {
            returnObject.error = "Type [UNIVERSAL 0] is reserved";
            return {
              offset: -1,
              result: returnObject
            };
          }
          newASN1Type = typeStore.EndOfContent;
          break;
        case 1:
          newASN1Type = typeStore.Boolean;
          break;
        case 2:
          newASN1Type = typeStore.Integer;
          break;
        case 3:
          newASN1Type = typeStore.BitString;
          break;
        case 4:
          newASN1Type = typeStore.OctetString;
          break;
        case 5:
          newASN1Type = typeStore.Null;
          break;
        case 6:
          newASN1Type = typeStore.ObjectIdentifier;
          break;
        case 10:
          newASN1Type = typeStore.Enumerated;
          break;
        case 12:
          newASN1Type = typeStore.Utf8String;
          break;
        case 13:
          newASN1Type = typeStore.RelativeObjectIdentifier;
          break;
        case 14:
          newASN1Type = typeStore.TIME;
          break;
        case 15:
          returnObject.error = "[UNIVERSAL 15] is reserved by ASN.1 standard";
          return {
            offset: -1,
            result: returnObject
          };
        case 16:
          newASN1Type = typeStore.Sequence;
          break;
        case 17:
          newASN1Type = typeStore.Set;
          break;
        case 18:
          newASN1Type = typeStore.NumericString;
          break;
        case 19:
          newASN1Type = typeStore.PrintableString;
          break;
        case 20:
          newASN1Type = typeStore.TeletexString;
          break;
        case 21:
          newASN1Type = typeStore.VideotexString;
          break;
        case 22:
          newASN1Type = typeStore.IA5String;
          break;
        case 23:
          newASN1Type = typeStore.UTCTime;
          break;
        case 24:
          newASN1Type = typeStore.GeneralizedTime;
          break;
        case 25:
          newASN1Type = typeStore.GraphicString;
          break;
        case 26:
          newASN1Type = typeStore.VisibleString;
          break;
        case 27:
          newASN1Type = typeStore.GeneralString;
          break;
        case 28:
          newASN1Type = typeStore.UniversalString;
          break;
        case 29:
          newASN1Type = typeStore.CharacterString;
          break;
        case 30:
          newASN1Type = typeStore.BmpString;
          break;
        case 31:
          newASN1Type = typeStore.DATE;
          break;
        case 32:
          newASN1Type = typeStore.TimeOfDay;
          break;
        case 33:
          newASN1Type = typeStore.DateTime;
          break;
        case 34:
          newASN1Type = typeStore.Duration;
          break;
        default: {
          const newObject = returnObject.idBlock.isConstructed ? new typeStore.Constructed() : new typeStore.Primitive();
          newObject.idBlock = returnObject.idBlock;
          newObject.lenBlock = returnObject.lenBlock;
          newObject.warnings = returnObject.warnings;
          returnObject = newObject;
        }
      }
      break;
    case 2:
    case 3:
    case 4:
    default: {
      newASN1Type = returnObject.idBlock.isConstructed ? typeStore.Constructed : typeStore.Primitive;
    }
  }
  returnObject = localChangeType(returnObject, newASN1Type);
  resultOffset = returnObject.fromBER(inputBuffer, inputOffset, returnObject.lenBlock.isIndefiniteForm ? inputLength : returnObject.lenBlock.length);
  returnObject.valueBeforeDecodeView = inputBuffer.subarray(incomingOffset, incomingOffset + returnObject.blockLength);
  return {
    offset: resultOffset,
    result: returnObject
  };
}
__name(localFromBER, "localFromBER");
function fromBER(inputBuffer) {
  if (!inputBuffer.byteLength) {
    const result = new BaseBlock({}, ValueBlock);
    result.error = "Input buffer has zero length";
    return {
      offset: -1,
      result
    };
  }
  return localFromBER(pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer).slice(), 0, inputBuffer.byteLength);
}
__name(fromBER, "fromBER");
function checkLen(indefiniteLength, length3) {
  if (indefiniteLength) {
    return 1;
  }
  return length3;
}
__name(checkLen, "checkLen");
var LocalConstructedValueBlock = class extends ValueBlock {
  static {
    __name(this, "LocalConstructedValueBlock");
  }
  constructor({ value = [], isIndefiniteForm = false, ...parameters } = {}) {
    super(parameters);
    this.value = value;
    this.isIndefiniteForm = isIndefiniteForm;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    const view = pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer);
    if (!checkBufferParams(this, view, inputOffset, inputLength)) {
      return -1;
    }
    this.valueBeforeDecodeView = view.subarray(inputOffset, inputOffset + inputLength);
    if (this.valueBeforeDecodeView.length === 0) {
      this.warnings.push("Zero buffer length");
      return inputOffset;
    }
    let currentOffset = inputOffset;
    while (checkLen(this.isIndefiniteForm, inputLength) > 0) {
      const returnObject = localFromBER(view, currentOffset, inputLength);
      if (returnObject.offset === -1) {
        this.error = returnObject.result.error;
        this.warnings.concat(returnObject.result.warnings);
        return -1;
      }
      currentOffset = returnObject.offset;
      this.blockLength += returnObject.result.blockLength;
      inputLength -= returnObject.result.blockLength;
      this.value.push(returnObject.result);
      if (this.isIndefiniteForm && returnObject.result.constructor.NAME === END_OF_CONTENT_NAME) {
        break;
      }
    }
    if (this.isIndefiniteForm) {
      if (this.value[this.value.length - 1].constructor.NAME === END_OF_CONTENT_NAME) {
        this.value.pop();
      } else {
        this.warnings.push("No EndOfContent block encoded");
      }
    }
    return currentOffset;
  }
  toBER(sizeOnly, writer) {
    const _writer = writer || new ViewWriter();
    for (let i = 0; i < this.value.length; i++) {
      this.value[i].toBER(sizeOnly, _writer);
    }
    if (!writer) {
      return _writer.final();
    }
    return EMPTY_BUFFER;
  }
  toJSON() {
    const object = {
      ...super.toJSON(),
      isIndefiniteForm: this.isIndefiniteForm,
      value: []
    };
    for (const value of this.value) {
      object.value.push(value.toJSON());
    }
    return object;
  }
};
LocalConstructedValueBlock.NAME = "ConstructedValueBlock";
var _a$v;
var Constructed = class extends BaseBlock {
  static {
    __name(this, "Constructed");
  }
  constructor(parameters = {}) {
    super(parameters, LocalConstructedValueBlock);
    this.idBlock.isConstructed = true;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
    const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm ? inputLength : this.lenBlock.length);
    if (resultOffset === -1) {
      this.error = this.valueBlock.error;
      return resultOffset;
    }
    if (!this.idBlock.error.length)
      this.blockLength += this.idBlock.blockLength;
    if (!this.lenBlock.error.length)
      this.blockLength += this.lenBlock.blockLength;
    if (!this.valueBlock.error.length)
      this.blockLength += this.valueBlock.blockLength;
    return resultOffset;
  }
  onAsciiEncoding() {
    const values = [];
    for (const value of this.valueBlock.value) {
      values.push(value.toString("ascii").split("\n").map((o) => `  ${o}`).join("\n"));
    }
    const blockName = this.idBlock.tagClass === 3 ? `[${this.idBlock.tagNumber}]` : this.constructor.NAME;
    return values.length ? `${blockName} :
${values.join("\n")}` : `${blockName} :`;
  }
};
_a$v = Constructed;
(() => {
  typeStore.Constructed = _a$v;
})();
Constructed.NAME = "CONSTRUCTED";
var LocalEndOfContentValueBlock = class extends ValueBlock {
  static {
    __name(this, "LocalEndOfContentValueBlock");
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    return inputOffset;
  }
  toBER(sizeOnly) {
    return EMPTY_BUFFER;
  }
};
LocalEndOfContentValueBlock.override = "EndOfContentValueBlock";
var _a$u;
var EndOfContent = class extends BaseBlock {
  static {
    __name(this, "EndOfContent");
  }
  constructor(parameters = {}) {
    super(parameters, LocalEndOfContentValueBlock);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 0;
  }
};
_a$u = EndOfContent;
(() => {
  typeStore.EndOfContent = _a$u;
})();
EndOfContent.NAME = END_OF_CONTENT_NAME;
var _a$t;
var Null = class extends BaseBlock {
  static {
    __name(this, "Null");
  }
  constructor(parameters = {}) {
    super(parameters, ValueBlock);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 5;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    if (this.lenBlock.length > 0)
      this.warnings.push("Non-zero length of value block for Null type");
    if (!this.idBlock.error.length)
      this.blockLength += this.idBlock.blockLength;
    if (!this.lenBlock.error.length)
      this.blockLength += this.lenBlock.blockLength;
    this.blockLength += inputLength;
    if (inputOffset + inputLength > inputBuffer.byteLength) {
      this.error = "End of input reached before message was fully decoded (inconsistent offset and length values)";
      return -1;
    }
    return inputOffset + inputLength;
  }
  toBER(sizeOnly, writer) {
    const retBuf = new ArrayBuffer(2);
    if (!sizeOnly) {
      const retView = new Uint8Array(retBuf);
      retView[0] = 5;
      retView[1] = 0;
    }
    if (writer) {
      writer.write(retBuf);
    }
    return retBuf;
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME}`;
  }
};
_a$t = Null;
(() => {
  typeStore.Null = _a$t;
})();
Null.NAME = "NULL";
var LocalBooleanValueBlock = class extends HexBlock(ValueBlock) {
  static {
    __name(this, "LocalBooleanValueBlock");
  }
  constructor({ value, ...parameters } = {}) {
    super(parameters);
    if (parameters.valueHex) {
      this.valueHexView = pvtsutils.BufferSourceConverter.toUint8Array(parameters.valueHex);
    } else {
      this.valueHexView = new Uint8Array(1);
    }
    if (value) {
      this.value = value;
    }
  }
  get value() {
    for (const octet of this.valueHexView) {
      if (octet > 0) {
        return true;
      }
    }
    return false;
  }
  set value(value) {
    this.valueHexView[0] = value ? 255 : 0;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    const inputView = pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer);
    if (!checkBufferParams(this, inputView, inputOffset, inputLength)) {
      return -1;
    }
    this.valueHexView = inputView.subarray(inputOffset, inputOffset + inputLength);
    if (inputLength > 1)
      this.warnings.push("Boolean value encoded in more then 1 octet");
    this.isHexOnly = true;
    utilDecodeTC.call(this);
    this.blockLength = inputLength;
    return inputOffset + inputLength;
  }
  toBER() {
    return this.valueHexView.slice();
  }
  toJSON() {
    return {
      ...super.toJSON(),
      value: this.value
    };
  }
};
LocalBooleanValueBlock.NAME = "BooleanValueBlock";
var _a$s;
var Boolean2 = class extends BaseBlock {
  static {
    __name(this, "Boolean");
  }
  constructor(parameters = {}) {
    super(parameters, LocalBooleanValueBlock);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 1;
  }
  getValue() {
    return this.valueBlock.value;
  }
  setValue(value) {
    this.valueBlock.value = value;
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${this.getValue}`;
  }
};
_a$s = Boolean2;
(() => {
  typeStore.Boolean = _a$s;
})();
Boolean2.NAME = "BOOLEAN";
var LocalOctetStringValueBlock = class extends HexBlock(LocalConstructedValueBlock) {
  static {
    __name(this, "LocalOctetStringValueBlock");
  }
  constructor({ isConstructed = false, ...parameters } = {}) {
    super(parameters);
    this.isConstructed = isConstructed;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    let resultOffset = 0;
    if (this.isConstructed) {
      this.isHexOnly = false;
      resultOffset = LocalConstructedValueBlock.prototype.fromBER.call(this, inputBuffer, inputOffset, inputLength);
      if (resultOffset === -1)
        return resultOffset;
      for (let i = 0; i < this.value.length; i++) {
        const currentBlockName = this.value[i].constructor.NAME;
        if (currentBlockName === END_OF_CONTENT_NAME) {
          if (this.isIndefiniteForm)
            break;
          else {
            this.error = "EndOfContent is unexpected, OCTET STRING may consists of OCTET STRINGs only";
            return -1;
          }
        }
        if (currentBlockName !== OCTET_STRING_NAME) {
          this.error = "OCTET STRING may consists of OCTET STRINGs only";
          return -1;
        }
      }
    } else {
      this.isHexOnly = true;
      resultOffset = super.fromBER(inputBuffer, inputOffset, inputLength);
      this.blockLength = inputLength;
    }
    return resultOffset;
  }
  toBER(sizeOnly, writer) {
    if (this.isConstructed)
      return LocalConstructedValueBlock.prototype.toBER.call(this, sizeOnly, writer);
    return sizeOnly ? new ArrayBuffer(this.valueHexView.byteLength) : this.valueHexView.slice().buffer;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      isConstructed: this.isConstructed
    };
  }
};
LocalOctetStringValueBlock.NAME = "OctetStringValueBlock";
var _a$r;
var OctetString = class _OctetString extends BaseBlock {
  static {
    __name(this, "OctetString");
  }
  constructor({ idBlock = {}, lenBlock = {}, ...parameters } = {}) {
    var _b, _c;
    (_b = parameters.isConstructed) !== null && _b !== void 0 ? _b : parameters.isConstructed = !!((_c = parameters.value) === null || _c === void 0 ? void 0 : _c.length);
    super({
      idBlock: {
        isConstructed: parameters.isConstructed,
        ...idBlock
      },
      lenBlock: {
        ...lenBlock,
        isIndefiniteForm: !!parameters.isIndefiniteForm
      },
      ...parameters
    }, LocalOctetStringValueBlock);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 4;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    this.valueBlock.isConstructed = this.idBlock.isConstructed;
    this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
    if (inputLength === 0) {
      if (this.idBlock.error.length === 0)
        this.blockLength += this.idBlock.blockLength;
      if (this.lenBlock.error.length === 0)
        this.blockLength += this.lenBlock.blockLength;
      return inputOffset;
    }
    if (!this.valueBlock.isConstructed) {
      const view = inputBuffer instanceof ArrayBuffer ? new Uint8Array(inputBuffer) : inputBuffer;
      const buf = view.subarray(inputOffset, inputOffset + inputLength);
      try {
        if (buf.byteLength) {
          const asn = localFromBER(buf, 0, buf.byteLength);
          if (asn.offset !== -1 && asn.offset === inputLength) {
            this.valueBlock.value = [asn.result];
          }
        }
      } catch (e) {
      }
    }
    return super.fromBER(inputBuffer, inputOffset, inputLength);
  }
  onAsciiEncoding() {
    if (this.valueBlock.isConstructed || this.valueBlock.value && this.valueBlock.value.length) {
      return Constructed.prototype.onAsciiEncoding.call(this);
    }
    return `${this.constructor.NAME} : ${pvtsutils.Convert.ToHex(this.valueBlock.valueHexView)}`;
  }
  getValue() {
    if (!this.idBlock.isConstructed) {
      return this.valueBlock.valueHexView.slice().buffer;
    }
    const array = [];
    for (const content of this.valueBlock.value) {
      if (content instanceof _OctetString) {
        array.push(content.valueBlock.valueHexView);
      }
    }
    return pvtsutils.BufferSourceConverter.concat(array);
  }
};
_a$r = OctetString;
(() => {
  typeStore.OctetString = _a$r;
})();
OctetString.NAME = OCTET_STRING_NAME;
var LocalBitStringValueBlock = class extends HexBlock(LocalConstructedValueBlock) {
  static {
    __name(this, "LocalBitStringValueBlock");
  }
  constructor({ unusedBits = 0, isConstructed = false, ...parameters } = {}) {
    super(parameters);
    this.unusedBits = unusedBits;
    this.isConstructed = isConstructed;
    this.blockLength = this.valueHexView.byteLength;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    if (!inputLength) {
      return inputOffset;
    }
    let resultOffset = -1;
    if (this.isConstructed) {
      resultOffset = LocalConstructedValueBlock.prototype.fromBER.call(this, inputBuffer, inputOffset, inputLength);
      if (resultOffset === -1)
        return resultOffset;
      for (const value of this.value) {
        const currentBlockName = value.constructor.NAME;
        if (currentBlockName === END_OF_CONTENT_NAME) {
          if (this.isIndefiniteForm)
            break;
          else {
            this.error = "EndOfContent is unexpected, BIT STRING may consists of BIT STRINGs only";
            return -1;
          }
        }
        if (currentBlockName !== BIT_STRING_NAME) {
          this.error = "BIT STRING may consists of BIT STRINGs only";
          return -1;
        }
        const valueBlock = value.valueBlock;
        if (this.unusedBits > 0 && valueBlock.unusedBits > 0) {
          this.error = 'Using of "unused bits" inside constructive BIT STRING allowed for least one only';
          return -1;
        }
        this.unusedBits = valueBlock.unusedBits;
      }
      return resultOffset;
    }
    const inputView = pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer);
    if (!checkBufferParams(this, inputView, inputOffset, inputLength)) {
      return -1;
    }
    const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
    this.unusedBits = intBuffer[0];
    if (this.unusedBits > 7) {
      this.error = "Unused bits for BitString must be in range 0-7";
      return -1;
    }
    if (!this.unusedBits) {
      const buf = intBuffer.subarray(1);
      try {
        if (buf.byteLength) {
          const asn = localFromBER(buf, 0, buf.byteLength);
          if (asn.offset !== -1 && asn.offset === inputLength - 1) {
            this.value = [asn.result];
          }
        }
      } catch (e) {
      }
    }
    this.valueHexView = intBuffer.subarray(1);
    this.blockLength = intBuffer.length;
    return inputOffset + inputLength;
  }
  toBER(sizeOnly, writer) {
    if (this.isConstructed) {
      return LocalConstructedValueBlock.prototype.toBER.call(this, sizeOnly, writer);
    }
    if (sizeOnly) {
      return new ArrayBuffer(this.valueHexView.byteLength + 1);
    }
    if (!this.valueHexView.byteLength) {
      return EMPTY_BUFFER;
    }
    const retView = new Uint8Array(this.valueHexView.length + 1);
    retView[0] = this.unusedBits;
    retView.set(this.valueHexView, 1);
    return retView.buffer;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      unusedBits: this.unusedBits,
      isConstructed: this.isConstructed
    };
  }
};
LocalBitStringValueBlock.NAME = "BitStringValueBlock";
var _a$q;
var BitString = class extends BaseBlock {
  static {
    __name(this, "BitString");
  }
  constructor({ idBlock = {}, lenBlock = {}, ...parameters } = {}) {
    var _b, _c;
    (_b = parameters.isConstructed) !== null && _b !== void 0 ? _b : parameters.isConstructed = !!((_c = parameters.value) === null || _c === void 0 ? void 0 : _c.length);
    super({
      idBlock: {
        isConstructed: parameters.isConstructed,
        ...idBlock
      },
      lenBlock: {
        ...lenBlock,
        isIndefiniteForm: !!parameters.isIndefiniteForm
      },
      ...parameters
    }, LocalBitStringValueBlock);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 3;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    this.valueBlock.isConstructed = this.idBlock.isConstructed;
    this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
    return super.fromBER(inputBuffer, inputOffset, inputLength);
  }
  onAsciiEncoding() {
    if (this.valueBlock.isConstructed || this.valueBlock.value && this.valueBlock.value.length) {
      return Constructed.prototype.onAsciiEncoding.call(this);
    } else {
      const bits = [];
      const valueHex = this.valueBlock.valueHexView;
      for (const byte of valueHex) {
        bits.push(byte.toString(2).padStart(8, "0"));
      }
      const bitsStr = bits.join("");
      return `${this.constructor.NAME} : ${bitsStr.substring(0, bitsStr.length - this.valueBlock.unusedBits)}`;
    }
  }
};
_a$q = BitString;
(() => {
  typeStore.BitString = _a$q;
})();
BitString.NAME = BIT_STRING_NAME;
var _a$p;
function viewAdd(first, second2) {
  const c = new Uint8Array([0]);
  const firstView = new Uint8Array(first);
  const secondView = new Uint8Array(second2);
  let firstViewCopy = firstView.slice(0);
  const firstViewCopyLength = firstViewCopy.length - 1;
  const secondViewCopy = secondView.slice(0);
  const secondViewCopyLength = secondViewCopy.length - 1;
  let value = 0;
  const max = secondViewCopyLength < firstViewCopyLength ? firstViewCopyLength : secondViewCopyLength;
  let counter = 0;
  for (let i = max; i >= 0; i--, counter++) {
    switch (true) {
      case counter < secondViewCopy.length:
        value = firstViewCopy[firstViewCopyLength - counter] + secondViewCopy[secondViewCopyLength - counter] + c[0];
        break;
      default:
        value = firstViewCopy[firstViewCopyLength - counter] + c[0];
    }
    c[0] = value / 10;
    switch (true) {
      case counter >= firstViewCopy.length:
        firstViewCopy = utilConcatView(new Uint8Array([value % 10]), firstViewCopy);
        break;
      default:
        firstViewCopy[firstViewCopyLength - counter] = value % 10;
    }
  }
  if (c[0] > 0)
    firstViewCopy = utilConcatView(c, firstViewCopy);
  return firstViewCopy;
}
__name(viewAdd, "viewAdd");
function power2(n) {
  if (n >= powers2.length) {
    for (let p = powers2.length; p <= n; p++) {
      const c = new Uint8Array([0]);
      let digits = powers2[p - 1].slice(0);
      for (let i = digits.length - 1; i >= 0; i--) {
        const newValue = new Uint8Array([(digits[i] << 1) + c[0]]);
        c[0] = newValue[0] / 10;
        digits[i] = newValue[0] % 10;
      }
      if (c[0] > 0)
        digits = utilConcatView(c, digits);
      powers2.push(digits);
    }
  }
  return powers2[n];
}
__name(power2, "power2");
function viewSub(first, second2) {
  let b = 0;
  const firstView = new Uint8Array(first);
  const secondView = new Uint8Array(second2);
  const firstViewCopy = firstView.slice(0);
  const firstViewCopyLength = firstViewCopy.length - 1;
  const secondViewCopy = secondView.slice(0);
  const secondViewCopyLength = secondViewCopy.length - 1;
  let value;
  let counter = 0;
  for (let i = secondViewCopyLength; i >= 0; i--, counter++) {
    value = firstViewCopy[firstViewCopyLength - counter] - secondViewCopy[secondViewCopyLength - counter] - b;
    switch (true) {
      case value < 0:
        b = 1;
        firstViewCopy[firstViewCopyLength - counter] = value + 10;
        break;
      default:
        b = 0;
        firstViewCopy[firstViewCopyLength - counter] = value;
    }
  }
  if (b > 0) {
    for (let i = firstViewCopyLength - secondViewCopyLength + 1; i >= 0; i--, counter++) {
      value = firstViewCopy[firstViewCopyLength - counter] - b;
      if (value < 0) {
        b = 1;
        firstViewCopy[firstViewCopyLength - counter] = value + 10;
      } else {
        b = 0;
        firstViewCopy[firstViewCopyLength - counter] = value;
        break;
      }
    }
  }
  return firstViewCopy.slice();
}
__name(viewSub, "viewSub");
var LocalIntegerValueBlock = class extends HexBlock(ValueBlock) {
  static {
    __name(this, "LocalIntegerValueBlock");
  }
  constructor({ value, ...parameters } = {}) {
    super(parameters);
    this._valueDec = 0;
    if (parameters.valueHex) {
      this.setValueHex();
    }
    if (value !== void 0) {
      this.valueDec = value;
    }
  }
  setValueHex() {
    if (this.valueHexView.length >= 4) {
      this.warnings.push("Too big Integer for decoding, hex only");
      this.isHexOnly = true;
      this._valueDec = 0;
    } else {
      this.isHexOnly = false;
      if (this.valueHexView.length > 0) {
        this._valueDec = utilDecodeTC.call(this);
      }
    }
  }
  set valueDec(v) {
    this._valueDec = v;
    this.isHexOnly = false;
    this.valueHexView = new Uint8Array(utilEncodeTC(v));
  }
  get valueDec() {
    return this._valueDec;
  }
  fromDER(inputBuffer, inputOffset, inputLength, expectedLength = 0) {
    const offset = this.fromBER(inputBuffer, inputOffset, inputLength);
    if (offset === -1)
      return offset;
    const view = this.valueHexView;
    if (view[0] === 0 && (view[1] & 128) !== 0) {
      this.valueHexView = view.subarray(1);
    } else {
      if (expectedLength !== 0) {
        if (view.length < expectedLength) {
          if (expectedLength - view.length > 1)
            expectedLength = view.length + 1;
          this.valueHexView = view.subarray(expectedLength - view.length);
        }
      }
    }
    return offset;
  }
  toDER(sizeOnly = false) {
    const view = this.valueHexView;
    switch (true) {
      case (view[0] & 128) !== 0:
        {
          const updatedView = new Uint8Array(this.valueHexView.length + 1);
          updatedView[0] = 0;
          updatedView.set(view, 1);
          this.valueHexView = updatedView;
        }
        break;
      case (view[0] === 0 && (view[1] & 128) === 0):
        {
          this.valueHexView = this.valueHexView.subarray(1);
        }
        break;
    }
    return this.toBER(sizeOnly);
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    const resultOffset = super.fromBER(inputBuffer, inputOffset, inputLength);
    if (resultOffset === -1) {
      return resultOffset;
    }
    this.setValueHex();
    return resultOffset;
  }
  toBER(sizeOnly) {
    return sizeOnly ? new ArrayBuffer(this.valueHexView.length) : this.valueHexView.slice().buffer;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      valueDec: this.valueDec
    };
  }
  toString() {
    const firstBit = this.valueHexView.length * 8 - 1;
    let digits = new Uint8Array(this.valueHexView.length * 8 / 3);
    let bitNumber = 0;
    let currentByte;
    const asn1View = this.valueHexView;
    let result = "";
    let flag = false;
    for (let byteNumber = asn1View.byteLength - 1; byteNumber >= 0; byteNumber--) {
      currentByte = asn1View[byteNumber];
      for (let i = 0; i < 8; i++) {
        if ((currentByte & 1) === 1) {
          switch (bitNumber) {
            case firstBit:
              digits = viewSub(power2(bitNumber), digits);
              result = "-";
              break;
            default:
              digits = viewAdd(digits, power2(bitNumber));
          }
        }
        bitNumber++;
        currentByte >>= 1;
      }
    }
    for (let i = 0; i < digits.length; i++) {
      if (digits[i])
        flag = true;
      if (flag)
        result += digitsString.charAt(digits[i]);
    }
    if (flag === false)
      result += digitsString.charAt(0);
    return result;
  }
};
_a$p = LocalIntegerValueBlock;
LocalIntegerValueBlock.NAME = "IntegerValueBlock";
(() => {
  Object.defineProperty(_a$p.prototype, "valueHex", {
    set: /* @__PURE__ */ __name(function(v) {
      this.valueHexView = new Uint8Array(v);
      this.setValueHex();
    }, "set"),
    get: /* @__PURE__ */ __name(function() {
      return this.valueHexView.slice().buffer;
    }, "get")
  });
})();
var _a$o;
var Integer = class _Integer extends BaseBlock {
  static {
    __name(this, "Integer");
  }
  constructor(parameters = {}) {
    super(parameters, LocalIntegerValueBlock);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 2;
  }
  toBigInt() {
    assertBigInt();
    return BigInt(this.valueBlock.toString());
  }
  static fromBigInt(value) {
    assertBigInt();
    const bigIntValue = BigInt(value);
    const writer = new ViewWriter();
    const hex = bigIntValue.toString(16).replace(/^-/, "");
    const view = new Uint8Array(pvtsutils.Convert.FromHex(hex));
    if (bigIntValue < 0) {
      const first = new Uint8Array(view.length + (view[0] & 128 ? 1 : 0));
      first[0] |= 128;
      const firstInt = BigInt(`0x${pvtsutils.Convert.ToHex(first)}`);
      const secondInt = firstInt + bigIntValue;
      const second2 = pvtsutils.BufferSourceConverter.toUint8Array(pvtsutils.Convert.FromHex(secondInt.toString(16)));
      second2[0] |= 128;
      writer.write(second2);
    } else {
      if (view[0] & 128) {
        writer.write(new Uint8Array([0]));
      }
      writer.write(view);
    }
    const res = new _Integer({
      valueHex: writer.final()
    });
    return res;
  }
  convertToDER() {
    const integer = new _Integer({ valueHex: this.valueBlock.valueHexView });
    integer.valueBlock.toDER();
    return integer;
  }
  convertFromDER() {
    return new _Integer({
      valueHex: this.valueBlock.valueHexView[0] === 0 ? this.valueBlock.valueHexView.subarray(1) : this.valueBlock.valueHexView
    });
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${this.valueBlock.toString()}`;
  }
};
_a$o = Integer;
(() => {
  typeStore.Integer = _a$o;
})();
Integer.NAME = "INTEGER";
var _a$n;
var Enumerated = class extends Integer {
  static {
    __name(this, "Enumerated");
  }
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 10;
  }
};
_a$n = Enumerated;
(() => {
  typeStore.Enumerated = _a$n;
})();
Enumerated.NAME = "ENUMERATED";
var LocalSidValueBlock = class extends HexBlock(ValueBlock) {
  static {
    __name(this, "LocalSidValueBlock");
  }
  constructor({ valueDec = -1, isFirstSid = false, ...parameters } = {}) {
    super(parameters);
    this.valueDec = valueDec;
    this.isFirstSid = isFirstSid;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    if (!inputLength) {
      return inputOffset;
    }
    const inputView = pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer);
    if (!checkBufferParams(this, inputView, inputOffset, inputLength)) {
      return -1;
    }
    const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
    this.valueHexView = new Uint8Array(inputLength);
    for (let i = 0; i < inputLength; i++) {
      this.valueHexView[i] = intBuffer[i] & 127;
      this.blockLength++;
      if ((intBuffer[i] & 128) === 0)
        break;
    }
    const tempView = new Uint8Array(this.blockLength);
    for (let i = 0; i < this.blockLength; i++) {
      tempView[i] = this.valueHexView[i];
    }
    this.valueHexView = tempView;
    if ((intBuffer[this.blockLength - 1] & 128) !== 0) {
      this.error = "End of input reached before message was fully decoded";
      return -1;
    }
    if (this.valueHexView[0] === 0)
      this.warnings.push("Needlessly long format of SID encoding");
    if (this.blockLength <= 8)
      this.valueDec = utilFromBase(this.valueHexView, 7);
    else {
      this.isHexOnly = true;
      this.warnings.push("Too big SID for decoding, hex only");
    }
    return inputOffset + this.blockLength;
  }
  set valueBigInt(value) {
    assertBigInt();
    let bits = BigInt(value).toString(2);
    while (bits.length % 7) {
      bits = "0" + bits;
    }
    const bytes2 = new Uint8Array(bits.length / 7);
    for (let i = 0; i < bytes2.length; i++) {
      bytes2[i] = parseInt(bits.slice(i * 7, i * 7 + 7), 2) + (i + 1 < bytes2.length ? 128 : 0);
    }
    this.fromBER(bytes2.buffer, 0, bytes2.length);
  }
  toBER(sizeOnly) {
    if (this.isHexOnly) {
      if (sizeOnly)
        return new ArrayBuffer(this.valueHexView.byteLength);
      const curView = this.valueHexView;
      const retView2 = new Uint8Array(this.blockLength);
      for (let i = 0; i < this.blockLength - 1; i++)
        retView2[i] = curView[i] | 128;
      retView2[this.blockLength - 1] = curView[this.blockLength - 1];
      return retView2.buffer;
    }
    const encodedBuf = utilToBase(this.valueDec, 7);
    if (encodedBuf.byteLength === 0) {
      this.error = "Error during encoding SID value";
      return EMPTY_BUFFER;
    }
    const retView = new Uint8Array(encodedBuf.byteLength);
    if (!sizeOnly) {
      const encodedView = new Uint8Array(encodedBuf);
      const len = encodedBuf.byteLength - 1;
      for (let i = 0; i < len; i++)
        retView[i] = encodedView[i] | 128;
      retView[len] = encodedView[len];
    }
    return retView;
  }
  toString() {
    let result = "";
    if (this.isHexOnly)
      result = pvtsutils.Convert.ToHex(this.valueHexView);
    else {
      if (this.isFirstSid) {
        let sidValue = this.valueDec;
        if (this.valueDec <= 39)
          result = "0.";
        else {
          if (this.valueDec <= 79) {
            result = "1.";
            sidValue -= 40;
          } else {
            result = "2.";
            sidValue -= 80;
          }
        }
        result += sidValue.toString();
      } else
        result = this.valueDec.toString();
    }
    return result;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      valueDec: this.valueDec,
      isFirstSid: this.isFirstSid
    };
  }
};
LocalSidValueBlock.NAME = "sidBlock";
var LocalObjectIdentifierValueBlock = class extends ValueBlock {
  static {
    __name(this, "LocalObjectIdentifierValueBlock");
  }
  constructor({ value = EMPTY_STRING, ...parameters } = {}) {
    super(parameters);
    this.value = [];
    if (value) {
      this.fromString(value);
    }
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    let resultOffset = inputOffset;
    while (inputLength > 0) {
      const sidBlock = new LocalSidValueBlock();
      resultOffset = sidBlock.fromBER(inputBuffer, resultOffset, inputLength);
      if (resultOffset === -1) {
        this.blockLength = 0;
        this.error = sidBlock.error;
        return resultOffset;
      }
      if (this.value.length === 0)
        sidBlock.isFirstSid = true;
      this.blockLength += sidBlock.blockLength;
      inputLength -= sidBlock.blockLength;
      this.value.push(sidBlock);
    }
    return resultOffset;
  }
  toBER(sizeOnly) {
    const retBuffers = [];
    for (let i = 0; i < this.value.length; i++) {
      const valueBuf = this.value[i].toBER(sizeOnly);
      if (valueBuf.byteLength === 0) {
        this.error = this.value[i].error;
        return EMPTY_BUFFER;
      }
      retBuffers.push(valueBuf);
    }
    return concat(retBuffers);
  }
  fromString(string2) {
    this.value = [];
    let pos1 = 0;
    let pos2 = 0;
    let sid = "";
    let flag = false;
    do {
      pos2 = string2.indexOf(".", pos1);
      if (pos2 === -1)
        sid = string2.substring(pos1);
      else
        sid = string2.substring(pos1, pos2);
      pos1 = pos2 + 1;
      if (flag) {
        const sidBlock = this.value[0];
        let plus = 0;
        switch (sidBlock.valueDec) {
          case 0:
            break;
          case 1:
            plus = 40;
            break;
          case 2:
            plus = 80;
            break;
          default:
            this.value = [];
            return;
        }
        const parsedSID = parseInt(sid, 10);
        if (isNaN(parsedSID))
          return;
        sidBlock.valueDec = parsedSID + plus;
        flag = false;
      } else {
        const sidBlock = new LocalSidValueBlock();
        if (sid > Number.MAX_SAFE_INTEGER) {
          assertBigInt();
          const sidValue = BigInt(sid);
          sidBlock.valueBigInt = sidValue;
        } else {
          sidBlock.valueDec = parseInt(sid, 10);
          if (isNaN(sidBlock.valueDec))
            return;
        }
        if (!this.value.length) {
          sidBlock.isFirstSid = true;
          flag = true;
        }
        this.value.push(sidBlock);
      }
    } while (pos2 !== -1);
  }
  toString() {
    let result = "";
    let isHexOnly = false;
    for (let i = 0; i < this.value.length; i++) {
      isHexOnly = this.value[i].isHexOnly;
      let sidStr = this.value[i].toString();
      if (i !== 0)
        result = `${result}.`;
      if (isHexOnly) {
        sidStr = `{${sidStr}}`;
        if (this.value[i].isFirstSid)
          result = `2.{${sidStr} - 80}`;
        else
          result += sidStr;
      } else
        result += sidStr;
    }
    return result;
  }
  toJSON() {
    const object = {
      ...super.toJSON(),
      value: this.toString(),
      sidArray: []
    };
    for (let i = 0; i < this.value.length; i++) {
      object.sidArray.push(this.value[i].toJSON());
    }
    return object;
  }
};
LocalObjectIdentifierValueBlock.NAME = "ObjectIdentifierValueBlock";
var _a$m;
var ObjectIdentifier = class extends BaseBlock {
  static {
    __name(this, "ObjectIdentifier");
  }
  constructor(parameters = {}) {
    super(parameters, LocalObjectIdentifierValueBlock);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 6;
  }
  getValue() {
    return this.valueBlock.toString();
  }
  setValue(value) {
    this.valueBlock.fromString(value);
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${this.valueBlock.toString() || "empty"}`;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      value: this.getValue()
    };
  }
};
_a$m = ObjectIdentifier;
(() => {
  typeStore.ObjectIdentifier = _a$m;
})();
ObjectIdentifier.NAME = "OBJECT IDENTIFIER";
var LocalRelativeSidValueBlock = class extends HexBlock(LocalBaseBlock) {
  static {
    __name(this, "LocalRelativeSidValueBlock");
  }
  constructor({ valueDec = 0, ...parameters } = {}) {
    super(parameters);
    this.valueDec = valueDec;
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    if (inputLength === 0)
      return inputOffset;
    const inputView = pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer);
    if (!checkBufferParams(this, inputView, inputOffset, inputLength))
      return -1;
    const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
    this.valueHexView = new Uint8Array(inputLength);
    for (let i = 0; i < inputLength; i++) {
      this.valueHexView[i] = intBuffer[i] & 127;
      this.blockLength++;
      if ((intBuffer[i] & 128) === 0)
        break;
    }
    const tempView = new Uint8Array(this.blockLength);
    for (let i = 0; i < this.blockLength; i++)
      tempView[i] = this.valueHexView[i];
    this.valueHexView = tempView;
    if ((intBuffer[this.blockLength - 1] & 128) !== 0) {
      this.error = "End of input reached before message was fully decoded";
      return -1;
    }
    if (this.valueHexView[0] === 0)
      this.warnings.push("Needlessly long format of SID encoding");
    if (this.blockLength <= 8)
      this.valueDec = utilFromBase(this.valueHexView, 7);
    else {
      this.isHexOnly = true;
      this.warnings.push("Too big SID for decoding, hex only");
    }
    return inputOffset + this.blockLength;
  }
  toBER(sizeOnly) {
    if (this.isHexOnly) {
      if (sizeOnly)
        return new ArrayBuffer(this.valueHexView.byteLength);
      const curView = this.valueHexView;
      const retView2 = new Uint8Array(this.blockLength);
      for (let i = 0; i < this.blockLength - 1; i++)
        retView2[i] = curView[i] | 128;
      retView2[this.blockLength - 1] = curView[this.blockLength - 1];
      return retView2.buffer;
    }
    const encodedBuf = utilToBase(this.valueDec, 7);
    if (encodedBuf.byteLength === 0) {
      this.error = "Error during encoding SID value";
      return EMPTY_BUFFER;
    }
    const retView = new Uint8Array(encodedBuf.byteLength);
    if (!sizeOnly) {
      const encodedView = new Uint8Array(encodedBuf);
      const len = encodedBuf.byteLength - 1;
      for (let i = 0; i < len; i++)
        retView[i] = encodedView[i] | 128;
      retView[len] = encodedView[len];
    }
    return retView.buffer;
  }
  toString() {
    let result = "";
    if (this.isHexOnly)
      result = pvtsutils.Convert.ToHex(this.valueHexView);
    else {
      result = this.valueDec.toString();
    }
    return result;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      valueDec: this.valueDec
    };
  }
};
LocalRelativeSidValueBlock.NAME = "relativeSidBlock";
var LocalRelativeObjectIdentifierValueBlock = class extends ValueBlock {
  static {
    __name(this, "LocalRelativeObjectIdentifierValueBlock");
  }
  constructor({ value = EMPTY_STRING, ...parameters } = {}) {
    super(parameters);
    this.value = [];
    if (value) {
      this.fromString(value);
    }
  }
  fromBER(inputBuffer, inputOffset, inputLength) {
    let resultOffset = inputOffset;
    while (inputLength > 0) {
      const sidBlock = new LocalRelativeSidValueBlock();
      resultOffset = sidBlock.fromBER(inputBuffer, resultOffset, inputLength);
      if (resultOffset === -1) {
        this.blockLength = 0;
        this.error = sidBlock.error;
        return resultOffset;
      }
      this.blockLength += sidBlock.blockLength;
      inputLength -= sidBlock.blockLength;
      this.value.push(sidBlock);
    }
    return resultOffset;
  }
  toBER(sizeOnly, writer) {
    const retBuffers = [];
    for (let i = 0; i < this.value.length; i++) {
      const valueBuf = this.value[i].toBER(sizeOnly);
      if (valueBuf.byteLength === 0) {
        this.error = this.value[i].error;
        return EMPTY_BUFFER;
      }
      retBuffers.push(valueBuf);
    }
    return concat(retBuffers);
  }
  fromString(string2) {
    this.value = [];
    let pos1 = 0;
    let pos2 = 0;
    let sid = "";
    do {
      pos2 = string2.indexOf(".", pos1);
      if (pos2 === -1)
        sid = string2.substring(pos1);
      else
        sid = string2.substring(pos1, pos2);
      pos1 = pos2 + 1;
      const sidBlock = new LocalRelativeSidValueBlock();
      sidBlock.valueDec = parseInt(sid, 10);
      if (isNaN(sidBlock.valueDec))
        return true;
      this.value.push(sidBlock);
    } while (pos2 !== -1);
    return true;
  }
  toString() {
    let result = "";
    let isHexOnly = false;
    for (let i = 0; i < this.value.length; i++) {
      isHexOnly = this.value[i].isHexOnly;
      let sidStr = this.value[i].toString();
      if (i !== 0)
        result = `${result}.`;
      if (isHexOnly) {
        sidStr = `{${sidStr}}`;
        result += sidStr;
      } else
        result += sidStr;
    }
    return result;
  }
  toJSON() {
    const object = {
      ...super.toJSON(),
      value: this.toString(),
      sidArray: []
    };
    for (let i = 0; i < this.value.length; i++)
      object.sidArray.push(this.value[i].toJSON());
    return object;
  }
};
LocalRelativeObjectIdentifierValueBlock.NAME = "RelativeObjectIdentifierValueBlock";
var _a$l;
var RelativeObjectIdentifier = class extends BaseBlock {
  static {
    __name(this, "RelativeObjectIdentifier");
  }
  constructor(parameters = {}) {
    super(parameters, LocalRelativeObjectIdentifierValueBlock);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 13;
  }
  getValue() {
    return this.valueBlock.toString();
  }
  setValue(value) {
    this.valueBlock.fromString(value);
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${this.valueBlock.toString() || "empty"}`;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      value: this.getValue()
    };
  }
};
_a$l = RelativeObjectIdentifier;
(() => {
  typeStore.RelativeObjectIdentifier = _a$l;
})();
RelativeObjectIdentifier.NAME = "RelativeObjectIdentifier";
var _a$k;
var Sequence = class extends Constructed {
  static {
    __name(this, "Sequence");
  }
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 16;
  }
};
_a$k = Sequence;
(() => {
  typeStore.Sequence = _a$k;
})();
Sequence.NAME = "SEQUENCE";
var _a$j;
var Set2 = class extends Constructed {
  static {
    __name(this, "Set");
  }
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 17;
  }
};
_a$j = Set2;
(() => {
  typeStore.Set = _a$j;
})();
Set2.NAME = "SET";
var LocalStringValueBlock = class extends HexBlock(ValueBlock) {
  static {
    __name(this, "LocalStringValueBlock");
  }
  constructor({ ...parameters } = {}) {
    super(parameters);
    this.isHexOnly = true;
    this.value = EMPTY_STRING;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      value: this.value
    };
  }
};
LocalStringValueBlock.NAME = "StringValueBlock";
var LocalSimpleStringValueBlock = class extends LocalStringValueBlock {
  static {
    __name(this, "LocalSimpleStringValueBlock");
  }
};
LocalSimpleStringValueBlock.NAME = "SimpleStringValueBlock";
var LocalSimpleStringBlock = class extends BaseStringBlock {
  static {
    __name(this, "LocalSimpleStringBlock");
  }
  constructor({ ...parameters } = {}) {
    super(parameters, LocalSimpleStringValueBlock);
  }
  fromBuffer(inputBuffer) {
    this.valueBlock.value = String.fromCharCode.apply(null, pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer));
  }
  fromString(inputString) {
    const strLen = inputString.length;
    const view = this.valueBlock.valueHexView = new Uint8Array(strLen);
    for (let i = 0; i < strLen; i++)
      view[i] = inputString.charCodeAt(i);
    this.valueBlock.value = inputString;
  }
};
LocalSimpleStringBlock.NAME = "SIMPLE STRING";
var LocalUtf8StringValueBlock = class extends LocalSimpleStringBlock {
  static {
    __name(this, "LocalUtf8StringValueBlock");
  }
  fromBuffer(inputBuffer) {
    this.valueBlock.valueHexView = pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer);
    try {
      this.valueBlock.value = pvtsutils.Convert.ToUtf8String(inputBuffer);
    } catch (ex) {
      this.warnings.push(`Error during "decodeURIComponent": ${ex}, using raw string`);
      this.valueBlock.value = pvtsutils.Convert.ToBinary(inputBuffer);
    }
  }
  fromString(inputString) {
    this.valueBlock.valueHexView = new Uint8Array(pvtsutils.Convert.FromUtf8String(inputString));
    this.valueBlock.value = inputString;
  }
};
LocalUtf8StringValueBlock.NAME = "Utf8StringValueBlock";
var _a$i;
var Utf8String = class extends LocalUtf8StringValueBlock {
  static {
    __name(this, "Utf8String");
  }
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 12;
  }
};
_a$i = Utf8String;
(() => {
  typeStore.Utf8String = _a$i;
})();
Utf8String.NAME = "UTF8String";
var LocalBmpStringValueBlock = class extends LocalSimpleStringBlock {
  static {
    __name(this, "LocalBmpStringValueBlock");
  }
  fromBuffer(inputBuffer) {
    this.valueBlock.value = pvtsutils.Convert.ToUtf16String(inputBuffer);
    this.valueBlock.valueHexView = pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer);
  }
  fromString(inputString) {
    this.valueBlock.value = inputString;
    this.valueBlock.valueHexView = new Uint8Array(pvtsutils.Convert.FromUtf16String(inputString));
  }
};
LocalBmpStringValueBlock.NAME = "BmpStringValueBlock";
var _a$h;
var BmpString = class extends LocalBmpStringValueBlock {
  static {
    __name(this, "BmpString");
  }
  constructor({ ...parameters } = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 30;
  }
};
_a$h = BmpString;
(() => {
  typeStore.BmpString = _a$h;
})();
BmpString.NAME = "BMPString";
var LocalUniversalStringValueBlock = class extends LocalSimpleStringBlock {
  static {
    __name(this, "LocalUniversalStringValueBlock");
  }
  fromBuffer(inputBuffer) {
    const copyBuffer = ArrayBuffer.isView(inputBuffer) ? inputBuffer.slice().buffer : inputBuffer.slice(0);
    const valueView = new Uint8Array(copyBuffer);
    for (let i = 0; i < valueView.length; i += 4) {
      valueView[i] = valueView[i + 3];
      valueView[i + 1] = valueView[i + 2];
      valueView[i + 2] = 0;
      valueView[i + 3] = 0;
    }
    this.valueBlock.value = String.fromCharCode.apply(null, new Uint32Array(copyBuffer));
  }
  fromString(inputString) {
    const strLength = inputString.length;
    const valueHexView = this.valueBlock.valueHexView = new Uint8Array(strLength * 4);
    for (let i = 0; i < strLength; i++) {
      const codeBuf = utilToBase(inputString.charCodeAt(i), 8);
      const codeView = new Uint8Array(codeBuf);
      if (codeView.length > 4)
        continue;
      const dif = 4 - codeView.length;
      for (let j = codeView.length - 1; j >= 0; j--)
        valueHexView[i * 4 + j + dif] = codeView[j];
    }
    this.valueBlock.value = inputString;
  }
};
LocalUniversalStringValueBlock.NAME = "UniversalStringValueBlock";
var _a$g;
var UniversalString = class extends LocalUniversalStringValueBlock {
  static {
    __name(this, "UniversalString");
  }
  constructor({ ...parameters } = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 28;
  }
};
_a$g = UniversalString;
(() => {
  typeStore.UniversalString = _a$g;
})();
UniversalString.NAME = "UniversalString";
var _a$f;
var NumericString = class extends LocalSimpleStringBlock {
  static {
    __name(this, "NumericString");
  }
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 18;
  }
};
_a$f = NumericString;
(() => {
  typeStore.NumericString = _a$f;
})();
NumericString.NAME = "NumericString";
var _a$e;
var PrintableString = class extends LocalSimpleStringBlock {
  static {
    __name(this, "PrintableString");
  }
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 19;
  }
};
_a$e = PrintableString;
(() => {
  typeStore.PrintableString = _a$e;
})();
PrintableString.NAME = "PrintableString";
var _a$d;
var TeletexString = class extends LocalSimpleStringBlock {
  static {
    __name(this, "TeletexString");
  }
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 20;
  }
};
_a$d = TeletexString;
(() => {
  typeStore.TeletexString = _a$d;
})();
TeletexString.NAME = "TeletexString";
var _a$c;
var VideotexString = class extends LocalSimpleStringBlock {
  static {
    __name(this, "VideotexString");
  }
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 21;
  }
};
_a$c = VideotexString;
(() => {
  typeStore.VideotexString = _a$c;
})();
VideotexString.NAME = "VideotexString";
var _a$b;
var IA5String = class extends LocalSimpleStringBlock {
  static {
    __name(this, "IA5String");
  }
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 22;
  }
};
_a$b = IA5String;
(() => {
  typeStore.IA5String = _a$b;
})();
IA5String.NAME = "IA5String";
var _a$a;
var GraphicString = class extends LocalSimpleStringBlock {
  static {
    __name(this, "GraphicString");
  }
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 25;
  }
};
_a$a = GraphicString;
(() => {
  typeStore.GraphicString = _a$a;
})();
GraphicString.NAME = "GraphicString";
var _a$9;
var VisibleString = class extends LocalSimpleStringBlock {
  static {
    __name(this, "VisibleString");
  }
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 26;
  }
};
_a$9 = VisibleString;
(() => {
  typeStore.VisibleString = _a$9;
})();
VisibleString.NAME = "VisibleString";
var _a$8;
var GeneralString = class extends LocalSimpleStringBlock {
  static {
    __name(this, "GeneralString");
  }
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 27;
  }
};
_a$8 = GeneralString;
(() => {
  typeStore.GeneralString = _a$8;
})();
GeneralString.NAME = "GeneralString";
var _a$7;
var CharacterString = class extends LocalSimpleStringBlock {
  static {
    __name(this, "CharacterString");
  }
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 29;
  }
};
_a$7 = CharacterString;
(() => {
  typeStore.CharacterString = _a$7;
})();
CharacterString.NAME = "CharacterString";
var _a$6;
var UTCTime = class extends VisibleString {
  static {
    __name(this, "UTCTime");
  }
  constructor({ value, valueDate, ...parameters } = {}) {
    super(parameters);
    this.year = 0;
    this.month = 0;
    this.day = 0;
    this.hour = 0;
    this.minute = 0;
    this.second = 0;
    if (value) {
      this.fromString(value);
      this.valueBlock.valueHexView = new Uint8Array(value.length);
      for (let i = 0; i < value.length; i++)
        this.valueBlock.valueHexView[i] = value.charCodeAt(i);
    }
    if (valueDate) {
      this.fromDate(valueDate);
      this.valueBlock.valueHexView = new Uint8Array(this.toBuffer());
    }
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 23;
  }
  fromBuffer(inputBuffer) {
    this.fromString(String.fromCharCode.apply(null, pvtsutils.BufferSourceConverter.toUint8Array(inputBuffer)));
  }
  toBuffer() {
    const str = this.toString();
    const buffer = new ArrayBuffer(str.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < str.length; i++)
      view[i] = str.charCodeAt(i);
    return buffer;
  }
  fromDate(inputDate) {
    this.year = inputDate.getUTCFullYear();
    this.month = inputDate.getUTCMonth() + 1;
    this.day = inputDate.getUTCDate();
    this.hour = inputDate.getUTCHours();
    this.minute = inputDate.getUTCMinutes();
    this.second = inputDate.getUTCSeconds();
  }
  toDate() {
    return new Date(Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second));
  }
  fromString(inputString) {
    const parser2 = /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z/ig;
    const parserArray = parser2.exec(inputString);
    if (parserArray === null) {
      this.error = "Wrong input string for conversion";
      return;
    }
    const year = parseInt(parserArray[1], 10);
    if (year >= 50)
      this.year = 1900 + year;
    else
      this.year = 2e3 + year;
    this.month = parseInt(parserArray[2], 10);
    this.day = parseInt(parserArray[3], 10);
    this.hour = parseInt(parserArray[4], 10);
    this.minute = parseInt(parserArray[5], 10);
    this.second = parseInt(parserArray[6], 10);
  }
  toString(encoding = "iso") {
    if (encoding === "iso") {
      const outputArray = new Array(7);
      outputArray[0] = padNumber(this.year < 2e3 ? this.year - 1900 : this.year - 2e3, 2);
      outputArray[1] = padNumber(this.month, 2);
      outputArray[2] = padNumber(this.day, 2);
      outputArray[3] = padNumber(this.hour, 2);
      outputArray[4] = padNumber(this.minute, 2);
      outputArray[5] = padNumber(this.second, 2);
      outputArray[6] = "Z";
      return outputArray.join("");
    }
    return super.toString(encoding);
  }
  onAsciiEncoding() {
    return `${this.constructor.NAME} : ${this.toDate().toISOString()}`;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      year: this.year,
      month: this.month,
      day: this.day,
      hour: this.hour,
      minute: this.minute,
      second: this.second
    };
  }
};
_a$6 = UTCTime;
(() => {
  typeStore.UTCTime = _a$6;
})();
UTCTime.NAME = "UTCTime";
var _a$5;
var GeneralizedTime = class extends UTCTime {
  static {
    __name(this, "GeneralizedTime");
  }
  constructor(parameters = {}) {
    var _b;
    super(parameters);
    (_b = this.millisecond) !== null && _b !== void 0 ? _b : this.millisecond = 0;
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 24;
  }
  fromDate(inputDate) {
    super.fromDate(inputDate);
    this.millisecond = inputDate.getUTCMilliseconds();
  }
  toDate() {
    return new Date(Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second, this.millisecond));
  }
  fromString(inputString) {
    let isUTC = false;
    let timeString = "";
    let dateTimeString = "";
    let fractionPart = 0;
    let parser2;
    let hourDifference = 0;
    let minuteDifference = 0;
    if (inputString[inputString.length - 1] === "Z") {
      timeString = inputString.substring(0, inputString.length - 1);
      isUTC = true;
    } else {
      const number2 = new Number(inputString[inputString.length - 1]);
      if (isNaN(number2.valueOf()))
        throw new Error("Wrong input string for conversion");
      timeString = inputString;
    }
    if (isUTC) {
      if (timeString.indexOf("+") !== -1)
        throw new Error("Wrong input string for conversion");
      if (timeString.indexOf("-") !== -1)
        throw new Error("Wrong input string for conversion");
    } else {
      let multiplier = 1;
      let differencePosition = timeString.indexOf("+");
      let differenceString = "";
      if (differencePosition === -1) {
        differencePosition = timeString.indexOf("-");
        multiplier = -1;
      }
      if (differencePosition !== -1) {
        differenceString = timeString.substring(differencePosition + 1);
        timeString = timeString.substring(0, differencePosition);
        if (differenceString.length !== 2 && differenceString.length !== 4)
          throw new Error("Wrong input string for conversion");
        let number2 = parseInt(differenceString.substring(0, 2), 10);
        if (isNaN(number2.valueOf()))
          throw new Error("Wrong input string for conversion");
        hourDifference = multiplier * number2;
        if (differenceString.length === 4) {
          number2 = parseInt(differenceString.substring(2, 4), 10);
          if (isNaN(number2.valueOf()))
            throw new Error("Wrong input string for conversion");
          minuteDifference = multiplier * number2;
        }
      }
    }
    let fractionPointPosition = timeString.indexOf(".");
    if (fractionPointPosition === -1)
      fractionPointPosition = timeString.indexOf(",");
    if (fractionPointPosition !== -1) {
      const fractionPartCheck = new Number(`0${timeString.substring(fractionPointPosition)}`);
      if (isNaN(fractionPartCheck.valueOf()))
        throw new Error("Wrong input string for conversion");
      fractionPart = fractionPartCheck.valueOf();
      dateTimeString = timeString.substring(0, fractionPointPosition);
    } else
      dateTimeString = timeString;
    switch (true) {
      case dateTimeString.length === 8:
        parser2 = /(\d{4})(\d{2})(\d{2})/ig;
        if (fractionPointPosition !== -1)
          throw new Error("Wrong input string for conversion");
        break;
      case dateTimeString.length === 10:
        parser2 = /(\d{4})(\d{2})(\d{2})(\d{2})/ig;
        if (fractionPointPosition !== -1) {
          let fractionResult = 60 * fractionPart;
          this.minute = Math.floor(fractionResult);
          fractionResult = 60 * (fractionResult - this.minute);
          this.second = Math.floor(fractionResult);
          fractionResult = 1e3 * (fractionResult - this.second);
          this.millisecond = Math.floor(fractionResult);
        }
        break;
      case dateTimeString.length === 12:
        parser2 = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/ig;
        if (fractionPointPosition !== -1) {
          let fractionResult = 60 * fractionPart;
          this.second = Math.floor(fractionResult);
          fractionResult = 1e3 * (fractionResult - this.second);
          this.millisecond = Math.floor(fractionResult);
        }
        break;
      case dateTimeString.length === 14:
        parser2 = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/ig;
        if (fractionPointPosition !== -1) {
          const fractionResult = 1e3 * fractionPart;
          this.millisecond = Math.floor(fractionResult);
        }
        break;
      default:
        throw new Error("Wrong input string for conversion");
    }
    const parserArray = parser2.exec(dateTimeString);
    if (parserArray === null)
      throw new Error("Wrong input string for conversion");
    for (let j = 1; j < parserArray.length; j++) {
      switch (j) {
        case 1:
          this.year = parseInt(parserArray[j], 10);
          break;
        case 2:
          this.month = parseInt(parserArray[j], 10);
          break;
        case 3:
          this.day = parseInt(parserArray[j], 10);
          break;
        case 4:
          this.hour = parseInt(parserArray[j], 10) + hourDifference;
          break;
        case 5:
          this.minute = parseInt(parserArray[j], 10) + minuteDifference;
          break;
        case 6:
          this.second = parseInt(parserArray[j], 10);
          break;
        default:
          throw new Error("Wrong input string for conversion");
      }
    }
    if (isUTC === false) {
      const tempDate = new Date(this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
      this.year = tempDate.getUTCFullYear();
      this.month = tempDate.getUTCMonth();
      this.day = tempDate.getUTCDay();
      this.hour = tempDate.getUTCHours();
      this.minute = tempDate.getUTCMinutes();
      this.second = tempDate.getUTCSeconds();
      this.millisecond = tempDate.getUTCMilliseconds();
    }
  }
  toString(encoding = "iso") {
    if (encoding === "iso") {
      const outputArray = [];
      outputArray.push(padNumber(this.year, 4));
      outputArray.push(padNumber(this.month, 2));
      outputArray.push(padNumber(this.day, 2));
      outputArray.push(padNumber(this.hour, 2));
      outputArray.push(padNumber(this.minute, 2));
      outputArray.push(padNumber(this.second, 2));
      if (this.millisecond !== 0) {
        outputArray.push(".");
        outputArray.push(padNumber(this.millisecond, 3));
      }
      outputArray.push("Z");
      return outputArray.join("");
    }
    return super.toString(encoding);
  }
  toJSON() {
    return {
      ...super.toJSON(),
      millisecond: this.millisecond
    };
  }
};
_a$5 = GeneralizedTime;
(() => {
  typeStore.GeneralizedTime = _a$5;
})();
GeneralizedTime.NAME = "GeneralizedTime";
var _a$4;
var DATE = class extends Utf8String {
  static {
    __name(this, "DATE");
  }
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 31;
  }
};
_a$4 = DATE;
(() => {
  typeStore.DATE = _a$4;
})();
DATE.NAME = "DATE";
var _a$3;
var TimeOfDay = class extends Utf8String {
  static {
    __name(this, "TimeOfDay");
  }
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 32;
  }
};
_a$3 = TimeOfDay;
(() => {
  typeStore.TimeOfDay = _a$3;
})();
TimeOfDay.NAME = "TimeOfDay";
var _a$2;
var DateTime = class extends Utf8String {
  static {
    __name(this, "DateTime");
  }
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 33;
  }
};
_a$2 = DateTime;
(() => {
  typeStore.DateTime = _a$2;
})();
DateTime.NAME = "DateTime";
var _a$1;
var Duration = class extends Utf8String {
  static {
    __name(this, "Duration");
  }
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 34;
  }
};
_a$1 = Duration;
(() => {
  typeStore.Duration = _a$1;
})();
Duration.NAME = "Duration";
var _a;
var TIME = class extends Utf8String {
  static {
    __name(this, "TIME");
  }
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1;
    this.idBlock.tagNumber = 14;
  }
};
_a = TIME;
(() => {
  typeStore.TIME = _a;
})();
TIME.NAME = "TIME";

// node_modules/uint8arrays/dist/src/to-string.js
function toString2(array, encoding = "utf8") {
  const base3 = bases_default[encoding];
  if (base3 == null) {
    throw new Error(`Unsupported encoding "${encoding}"`);
  }
  return base3.encoder.encode(array).substring(1);
}
__name(toString2, "toString");

// node_modules/@libp2p/crypto/dist/src/random-bytes.js
function randomBytes2(length3) {
  if (isNaN(length3) || length3 <= 0) {
    throw new InvalidParametersError("random bytes length must be a Number bigger than 0");
  }
  return randomBytes(length3);
}
__name(randomBytes2, "randomBytes");

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

// node_modules/@libp2p/crypto/dist/src/keys/rsa/index.browser.js
async function generateRSAKey(bits) {
  const pair = await webcrypto_default.get().subtle.generateKey({
    name: "RSASSA-PKCS1-v1_5",
    modulusLength: bits,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: { name: "SHA-256" }
  }, true, ["sign", "verify"]);
  const keys = await exportKey(pair);
  return {
    privateKey: keys[0],
    publicKey: keys[1]
  };
}
__name(generateRSAKey, "generateRSAKey");
async function hashAndSign2(key, msg) {
  const privateKey = await webcrypto_default.get().subtle.importKey("jwk", key, {
    name: "RSASSA-PKCS1-v1_5",
    hash: { name: "SHA-256" }
  }, false, ["sign"]);
  const sig = await webcrypto_default.get().subtle.sign({ name: "RSASSA-PKCS1-v1_5" }, privateKey, msg instanceof Uint8Array ? msg : msg.subarray());
  return new Uint8Array(sig, 0, sig.byteLength);
}
__name(hashAndSign2, "hashAndSign");
async function hashAndVerify2(key, sig, msg) {
  const publicKey = await webcrypto_default.get().subtle.importKey("jwk", key, {
    name: "RSASSA-PKCS1-v1_5",
    hash: { name: "SHA-256" }
  }, false, ["verify"]);
  return webcrypto_default.get().subtle.verify({ name: "RSASSA-PKCS1-v1_5" }, publicKey, sig, msg instanceof Uint8Array ? msg : msg.subarray());
}
__name(hashAndVerify2, "hashAndVerify");
async function exportKey(pair) {
  if (pair.privateKey == null || pair.publicKey == null) {
    throw new InvalidParametersError("Private and public key are required");
  }
  return Promise.all([
    webcrypto_default.get().subtle.exportKey("jwk", pair.privateKey),
    webcrypto_default.get().subtle.exportKey("jwk", pair.publicKey)
  ]);
}
__name(exportKey, "exportKey");
function rsaKeySize(jwk) {
  if (jwk.kty !== "RSA") {
    throw new InvalidParametersError("invalid key type");
  } else if (jwk.n == null) {
    throw new InvalidParametersError("invalid key modulus");
  }
  const bytes2 = fromString2(jwk.n, "base64url");
  return bytes2.length * 8;
}
__name(rsaKeySize, "rsaKeySize");

// node_modules/@libp2p/crypto/dist/src/keys/rsa/rsa.js
var RSAPublicKey = class {
  static {
    __name(this, "RSAPublicKey");
  }
  type = "RSA";
  _key;
  _raw;
  _multihash;
  constructor(key, digest2) {
    this._key = key;
    this._multihash = digest2;
  }
  get raw() {
    if (this._raw == null) {
      this._raw = utils_exports2.jwkToPkix(this._key);
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
  verify(data, sig) {
    return hashAndVerify2(this._key, sig, data);
  }
};
var RSAPrivateKey = class {
  static {
    __name(this, "RSAPrivateKey");
  }
  type = "RSA";
  _key;
  _raw;
  publicKey;
  constructor(key, publicKey) {
    this._key = key;
    this.publicKey = publicKey;
  }
  get raw() {
    if (this._raw == null) {
      this._raw = utils_exports2.jwkToPkcs1(this._key);
    }
    return this._raw;
  }
  equals(key) {
    if (key == null || !(key.raw instanceof Uint8Array)) {
      return false;
    }
    return equals3(this.raw, key.raw);
  }
  sign(message2) {
    return hashAndSign2(this._key, message2);
  }
};

// node_modules/@libp2p/crypto/dist/src/keys/rsa/utils.js
var MAX_RSA_KEY_SIZE = 8192;
var SHA2_256_CODE = 18;
function pkcs1ToJwk(bytes2) {
  const { result } = fromBER(bytes2);
  const values = result.valueBlock.value;
  const key = {
    n: toString2(bnToBuf(values[1].toBigInt()), "base64url"),
    e: toString2(bnToBuf(values[2].toBigInt()), "base64url"),
    d: toString2(bnToBuf(values[3].toBigInt()), "base64url"),
    p: toString2(bnToBuf(values[4].toBigInt()), "base64url"),
    q: toString2(bnToBuf(values[5].toBigInt()), "base64url"),
    dp: toString2(bnToBuf(values[6].toBigInt()), "base64url"),
    dq: toString2(bnToBuf(values[7].toBigInt()), "base64url"),
    qi: toString2(bnToBuf(values[8].toBigInt()), "base64url"),
    kty: "RSA",
    alg: "RS256"
  };
  return key;
}
__name(pkcs1ToJwk, "pkcs1ToJwk");
function jwkToPkcs1(jwk) {
  if (jwk.n == null || jwk.e == null || jwk.d == null || jwk.p == null || jwk.q == null || jwk.dp == null || jwk.dq == null || jwk.qi == null) {
    throw new InvalidParametersError("JWK was missing components");
  }
  const root = new Sequence({
    value: [
      new Integer({ value: 0 }),
      Integer.fromBigInt(bufToBn(fromString2(jwk.n, "base64url"))),
      Integer.fromBigInt(bufToBn(fromString2(jwk.e, "base64url"))),
      Integer.fromBigInt(bufToBn(fromString2(jwk.d, "base64url"))),
      Integer.fromBigInt(bufToBn(fromString2(jwk.p, "base64url"))),
      Integer.fromBigInt(bufToBn(fromString2(jwk.q, "base64url"))),
      Integer.fromBigInt(bufToBn(fromString2(jwk.dp, "base64url"))),
      Integer.fromBigInt(bufToBn(fromString2(jwk.dq, "base64url"))),
      Integer.fromBigInt(bufToBn(fromString2(jwk.qi, "base64url")))
    ]
  });
  const der = root.toBER();
  return new Uint8Array(der, 0, der.byteLength);
}
__name(jwkToPkcs1, "jwkToPkcs1");
function pkixToJwk(bytes2) {
  const { result } = fromBER(bytes2);
  const values = result.valueBlock.value[1].valueBlock.value[0].valueBlock.value;
  return {
    kty: "RSA",
    n: toString2(bnToBuf(values[0].toBigInt()), "base64url"),
    e: toString2(bnToBuf(values[1].toBigInt()), "base64url")
  };
}
__name(pkixToJwk, "pkixToJwk");
function jwkToPkix(jwk) {
  if (jwk.n == null || jwk.e == null) {
    throw new InvalidParametersError("JWK was missing components");
  }
  const root = new Sequence({
    value: [
      new Sequence({
        value: [
          // rsaEncryption
          new ObjectIdentifier({
            value: "1.2.840.113549.1.1.1"
          }),
          new Null()
        ]
      }),
      // this appears to be a bug in asn1js.js - this should really be a Sequence
      // and not a BitString but it generates the same bytes as node-forge so 🤷‍♂️
      new BitString({
        valueHex: new Sequence({
          value: [
            Integer.fromBigInt(bufToBn(fromString2(jwk.n, "base64url"))),
            Integer.fromBigInt(bufToBn(fromString2(jwk.e, "base64url")))
          ]
        }).toBER()
      })
    ]
  });
  const der = root.toBER();
  return new Uint8Array(der, 0, der.byteLength);
}
__name(jwkToPkix, "jwkToPkix");
function bnToBuf(bn) {
  let hex = bn.toString(16);
  if (hex.length % 2 > 0) {
    hex = `0${hex}`;
  }
  const len = hex.length / 2;
  const u8 = new Uint8Array(len);
  let i = 0;
  let j = 0;
  while (i < len) {
    u8[i] = parseInt(hex.slice(j, j + 2), 16);
    i += 1;
    j += 2;
  }
  return u8;
}
__name(bnToBuf, "bnToBuf");
function bufToBn(u8) {
  const hex = [];
  u8.forEach(function(i) {
    let h = i.toString(16);
    if (h.length % 2 > 0) {
      h = `0${h}`;
    }
    hex.push(h);
  });
  return BigInt("0x" + hex.join(""));
}
__name(bufToBn, "bufToBn");
function pkcs1ToRSAPrivateKey(bytes2) {
  const jwk = pkcs1ToJwk(bytes2);
  return jwkToRSAPrivateKey(jwk);
}
__name(pkcs1ToRSAPrivateKey, "pkcs1ToRSAPrivateKey");
function pkixToRSAPublicKey(bytes2) {
  const jwk = pkixToJwk(bytes2);
  if (rsaKeySize(jwk) > MAX_RSA_KEY_SIZE) {
    throw new InvalidPublicKeyError("Key size is too large");
  }
  const hash2 = sha2562(PublicKey.encode({
    Type: KeyType.RSA,
    Data: bytes2
  }));
  const digest2 = create(SHA2_256_CODE, hash2);
  return new RSAPublicKey(jwk, digest2);
}
__name(pkixToRSAPublicKey, "pkixToRSAPublicKey");
function jwkToRSAPrivateKey(jwk) {
  if (rsaKeySize(jwk) > MAX_RSA_KEY_SIZE) {
    throw new InvalidParametersError("Key size is too large");
  }
  const keys = jwkToJWKKeyPair(jwk);
  const hash2 = sha2562(PublicKey.encode({
    Type: KeyType.RSA,
    Data: jwkToPkix(keys.publicKey)
  }));
  const digest2 = create(SHA2_256_CODE, hash2);
  return new RSAPrivateKey(keys.privateKey, new RSAPublicKey(keys.publicKey, digest2));
}
__name(jwkToRSAPrivateKey, "jwkToRSAPrivateKey");
async function generateRSAKeyPair(bits) {
  if (bits > MAX_RSA_KEY_SIZE) {
    throw new InvalidParametersError("Key size is too large");
  }
  const keys = await generateRSAKey(bits);
  const hash2 = sha2562(PublicKey.encode({
    Type: KeyType.RSA,
    Data: jwkToPkix(keys.publicKey)
  }));
  const digest2 = create(SHA2_256_CODE, hash2);
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

// node_modules/@noble/hashes/esm/hmac.js
var HMAC = class extends Hash {
  static {
    __name(this, "HMAC");
  }
  constructor(hash2, _key) {
    super();
    this.finished = false;
    this.destroyed = false;
    hash(hash2);
    const key = toBytes(_key);
    this.iHash = hash2.create();
    if (typeof this.iHash.update !== "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const blockLen = this.blockLen;
    const pad = new Uint8Array(blockLen);
    pad.set(key.length > blockLen ? hash2.create().update(key).digest() : key);
    for (let i = 0; i < pad.length; i++)
      pad[i] ^= 54;
    this.iHash.update(pad);
    this.oHash = hash2.create();
    for (let i = 0; i < pad.length; i++)
      pad[i] ^= 54 ^ 92;
    this.oHash.update(pad);
    pad.fill(0);
  }
  update(buf) {
    exists(this);
    this.iHash.update(buf);
    return this;
  }
  digestInto(out) {
    exists(this);
    bytes(out, this.outputLen);
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
    to || (to = Object.create(Object.getPrototypeOf(this), {}));
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
  destroy() {
    this.destroyed = true;
    this.oHash.destroy();
    this.iHash.destroy();
  }
};
var hmac = /* @__PURE__ */ __name((hash2, key, message2) => new HMAC(hash2, key).update(message2).digest(), "hmac");
hmac.create = (hash2, key) => new HMAC(hash2, key);

// node_modules/@noble/curves/esm/abstract/weierstrass.js
function validateSigVerOpts(opts) {
  if (opts.lowS !== void 0)
    abool("lowS", opts.lowS);
  if (opts.prehash !== void 0)
    abool("prehash", opts.prehash);
}
__name(validateSigVerOpts, "validateSigVerOpts");
function validatePointOpts(curve) {
  const opts = validateBasic(curve);
  validateObject(opts, {
    a: "field",
    b: "field"
  }, {
    allowedPrivateKeyLengths: "array",
    wrapPrivateKey: "boolean",
    isTorsionFree: "function",
    clearCofactor: "function",
    allowInfinityPoint: "boolean",
    fromBytes: "function",
    toBytes: "function"
  });
  const { endo, Fp: Fp3, a } = opts;
  if (endo) {
    if (!Fp3.eql(a, Fp3.ZERO)) {
      throw new Error("Endomorphism can only be defined for Koblitz curves that have a=0");
    }
    if (typeof endo !== "object" || typeof endo.beta !== "bigint" || typeof endo.splitScalar !== "function") {
      throw new Error("Expected endomorphism with beta: bigint and splitScalar: function");
    }
  }
  return Object.freeze({ ...opts });
}
__name(validatePointOpts, "validatePointOpts");
var { bytesToNumberBE: b2n, hexToBytes: h2b } = utils_exports;
var DER = {
  // asn.1 DER encoding utils
  Err: class DERErr extends Error {
    static {
      __name(this, "DERErr");
    }
    constructor(m = "") {
      super(m);
    }
  },
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
      return `${numberToHexUnpadded(tag)}${lenLen}${len}${data}`;
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
      if (num < _0n6)
        throw new E("integer: negative integers are not allowed");
      let hex = numberToHexUnpadded(num);
      if (Number.parseInt(hex[0], 16) & 8)
        hex = "00" + hex;
      if (hex.length & 1)
        throw new E("unexpected assertion");
      return hex;
    },
    decode(data) {
      const { Err: E } = DER;
      if (data[0] & 128)
        throw new E("Invalid signature integer: negative");
      if (data[0] === 0 && !(data[1] & 128))
        throw new E("Invalid signature integer: unnecessary leading zero");
      return b2n(data);
    }
  },
  toSig(hex) {
    const { Err: E, _int: int, _tlv: tlv } = DER;
    const data = typeof hex === "string" ? h2b(hex) : hex;
    abytes(data);
    const { v: seqBytes, l: seqLeftBytes } = tlv.decode(48, data);
    if (seqLeftBytes.length)
      throw new E("Invalid signature: left bytes after parsing");
    const { v: rBytes, l: rLeftBytes } = tlv.decode(2, seqBytes);
    const { v: sBytes, l: sLeftBytes } = tlv.decode(2, rLeftBytes);
    if (sLeftBytes.length)
      throw new E("Invalid signature: left bytes after parsing");
    return { r: int.decode(rBytes), s: int.decode(sBytes) };
  },
  hexFromSig(sig) {
    const { _tlv: tlv, _int: int } = DER;
    const seq = `${tlv.encode(2, int.encode(sig.r))}${tlv.encode(2, int.encode(sig.s))}`;
    return tlv.encode(48, seq);
  }
};
var _0n6 = BigInt(0);
var _1n6 = BigInt(1);
var _2n5 = BigInt(2);
var _3n3 = BigInt(3);
var _4n2 = BigInt(4);
function weierstrassPoints(opts) {
  const CURVE = validatePointOpts(opts);
  const { Fp: Fp3 } = CURVE;
  const Fn = Field(CURVE.n, CURVE.nBitLength);
  const toBytes3 = CURVE.toBytes || ((_c, point, _isCompressed) => {
    const a = point.toAffine();
    return concatBytes2(Uint8Array.from([4]), Fp3.toBytes(a.x), Fp3.toBytes(a.y));
  });
  const fromBytes = CURVE.fromBytes || ((bytes2) => {
    const tail = bytes2.subarray(1);
    const x = Fp3.fromBytes(tail.subarray(0, Fp3.BYTES));
    const y = Fp3.fromBytes(tail.subarray(Fp3.BYTES, 2 * Fp3.BYTES));
    return { x, y };
  });
  function weierstrassEquation(x) {
    const { a, b } = CURVE;
    const x2 = Fp3.sqr(x);
    const x3 = Fp3.mul(x2, x);
    return Fp3.add(Fp3.add(x3, Fp3.mul(x, a)), b);
  }
  __name(weierstrassEquation, "weierstrassEquation");
  if (!Fp3.eql(Fp3.sqr(CURVE.Gy), weierstrassEquation(CURVE.Gx)))
    throw new Error("bad generator point: equation left != right");
  function isWithinCurveOrder(num) {
    return inRange(num, _1n6, CURVE.n);
  }
  __name(isWithinCurveOrder, "isWithinCurveOrder");
  function normPrivateKeyToScalar(key) {
    const { allowedPrivateKeyLengths: lengths, nByteLength, wrapPrivateKey, n: N } = CURVE;
    if (lengths && typeof key !== "bigint") {
      if (isBytes2(key))
        key = bytesToHex(key);
      if (typeof key !== "string" || !lengths.includes(key.length))
        throw new Error("Invalid key");
      key = key.padStart(nByteLength * 2, "0");
    }
    let num;
    try {
      num = typeof key === "bigint" ? key : bytesToNumberBE(ensureBytes("private key", key, nByteLength));
    } catch (error) {
      throw new Error(`private key must be ${nByteLength} bytes, hex or bigint, not ${typeof key}`);
    }
    if (wrapPrivateKey)
      num = mod(num, N);
    aInRange("private key", num, _1n6, N);
    return num;
  }
  __name(normPrivateKeyToScalar, "normPrivateKeyToScalar");
  function assertPrjPoint(other) {
    if (!(other instanceof Point2))
      throw new Error("ProjectivePoint expected");
  }
  __name(assertPrjPoint, "assertPrjPoint");
  const toAffineMemo = memoized((p, iz) => {
    const { px: x, py: y, pz: z } = p;
    if (Fp3.eql(z, Fp3.ONE))
      return { x, y };
    const is0 = p.is0();
    if (iz == null)
      iz = is0 ? Fp3.ONE : Fp3.inv(z);
    const ax = Fp3.mul(x, iz);
    const ay = Fp3.mul(y, iz);
    const zz = Fp3.mul(z, iz);
    if (is0)
      return { x: Fp3.ZERO, y: Fp3.ZERO };
    if (!Fp3.eql(zz, Fp3.ONE))
      throw new Error("invZ was invalid");
    return { x: ax, y: ay };
  });
  const assertValidMemo = memoized((p) => {
    if (p.is0()) {
      if (CURVE.allowInfinityPoint && !Fp3.is0(p.py))
        return;
      throw new Error("bad point: ZERO");
    }
    const { x, y } = p.toAffine();
    if (!Fp3.isValid(x) || !Fp3.isValid(y))
      throw new Error("bad point: x or y not FE");
    const left = Fp3.sqr(y);
    const right = weierstrassEquation(x);
    if (!Fp3.eql(left, right))
      throw new Error("bad point: equation left != right");
    if (!p.isTorsionFree())
      throw new Error("bad point: not in prime-order subgroup");
    return true;
  });
  class Point2 {
    static {
      __name(this, "Point");
    }
    constructor(px, py, pz) {
      this.px = px;
      this.py = py;
      this.pz = pz;
      if (px == null || !Fp3.isValid(px))
        throw new Error("x required");
      if (py == null || !Fp3.isValid(py))
        throw new Error("y required");
      if (pz == null || !Fp3.isValid(pz))
        throw new Error("z required");
      Object.freeze(this);
    }
    // Does not validate if the point is on-curve.
    // Use fromHex instead, or call assertValidity() later.
    static fromAffine(p) {
      const { x, y } = p || {};
      if (!p || !Fp3.isValid(x) || !Fp3.isValid(y))
        throw new Error("invalid affine point");
      if (p instanceof Point2)
        throw new Error("projective point not allowed");
      const is0 = /* @__PURE__ */ __name((i) => Fp3.eql(i, Fp3.ZERO), "is0");
      if (is0(x) && is0(y))
        return Point2.ZERO;
      return new Point2(x, y, Fp3.ONE);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    /**
     * Takes a bunch of Projective Points but executes only one
     * inversion on all of them. Inversion is very slow operation,
     * so this improves performance massively.
     * Optimization: converts a list of projective points to a list of identical points with Z=1.
     */
    static normalizeZ(points) {
      const toInv = Fp3.invertBatch(points.map((p) => p.pz));
      return points.map((p, i) => p.toAffine(toInv[i])).map(Point2.fromAffine);
    }
    /**
     * Converts hash string or Uint8Array to Point.
     * @param hex short/long ECDSA hex
     */
    static fromHex(hex) {
      const P = Point2.fromAffine(fromBytes(ensureBytes("pointHex", hex)));
      P.assertValidity();
      return P;
    }
    // Multiplies generator point by privateKey.
    static fromPrivateKey(privateKey) {
      return Point2.BASE.multiply(normPrivateKeyToScalar(privateKey));
    }
    // Multiscalar Multiplication
    static msm(points, scalars) {
      return pippenger(Point2, Fn, points, scalars);
    }
    // "Private method", don't use it directly
    _setWindowSize(windowSize) {
      wnaf.setWindowSize(this, windowSize);
    }
    // A point on curve is valid if it conforms to equation.
    assertValidity() {
      assertValidMemo(this);
    }
    hasEvenY() {
      const { y } = this.toAffine();
      if (Fp3.isOdd)
        return !Fp3.isOdd(y);
      throw new Error("Field doesn't support isOdd");
    }
    /**
     * Compare one point to another.
     */
    equals(other) {
      assertPrjPoint(other);
      const { px: X1, py: Y1, pz: Z1 } = this;
      const { px: X2, py: Y2, pz: Z2 } = other;
      const U1 = Fp3.eql(Fp3.mul(X1, Z2), Fp3.mul(X2, Z1));
      const U2 = Fp3.eql(Fp3.mul(Y1, Z2), Fp3.mul(Y2, Z1));
      return U1 && U2;
    }
    /**
     * Flips point to one corresponding to (x, -y) in Affine coordinates.
     */
    negate() {
      return new Point2(this.px, Fp3.neg(this.py), this.pz);
    }
    // Renes-Costello-Batina exception-free doubling formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 3
    // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
    double() {
      const { a, b } = CURVE;
      const b3 = Fp3.mul(b, _3n3);
      const { px: X1, py: Y1, pz: Z1 } = this;
      let X3 = Fp3.ZERO, Y3 = Fp3.ZERO, Z3 = Fp3.ZERO;
      let t0 = Fp3.mul(X1, X1);
      let t1 = Fp3.mul(Y1, Y1);
      let t2 = Fp3.mul(Z1, Z1);
      let t3 = Fp3.mul(X1, Y1);
      t3 = Fp3.add(t3, t3);
      Z3 = Fp3.mul(X1, Z1);
      Z3 = Fp3.add(Z3, Z3);
      X3 = Fp3.mul(a, Z3);
      Y3 = Fp3.mul(b3, t2);
      Y3 = Fp3.add(X3, Y3);
      X3 = Fp3.sub(t1, Y3);
      Y3 = Fp3.add(t1, Y3);
      Y3 = Fp3.mul(X3, Y3);
      X3 = Fp3.mul(t3, X3);
      Z3 = Fp3.mul(b3, Z3);
      t2 = Fp3.mul(a, t2);
      t3 = Fp3.sub(t0, t2);
      t3 = Fp3.mul(a, t3);
      t3 = Fp3.add(t3, Z3);
      Z3 = Fp3.add(t0, t0);
      t0 = Fp3.add(Z3, t0);
      t0 = Fp3.add(t0, t2);
      t0 = Fp3.mul(t0, t3);
      Y3 = Fp3.add(Y3, t0);
      t2 = Fp3.mul(Y1, Z1);
      t2 = Fp3.add(t2, t2);
      t0 = Fp3.mul(t2, t3);
      X3 = Fp3.sub(X3, t0);
      Z3 = Fp3.mul(t2, t1);
      Z3 = Fp3.add(Z3, Z3);
      Z3 = Fp3.add(Z3, Z3);
      return new Point2(X3, Y3, Z3);
    }
    // Renes-Costello-Batina exception-free addition formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 1
    // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
    add(other) {
      assertPrjPoint(other);
      const { px: X1, py: Y1, pz: Z1 } = this;
      const { px: X2, py: Y2, pz: Z2 } = other;
      let X3 = Fp3.ZERO, Y3 = Fp3.ZERO, Z3 = Fp3.ZERO;
      const a = CURVE.a;
      const b3 = Fp3.mul(CURVE.b, _3n3);
      let t0 = Fp3.mul(X1, X2);
      let t1 = Fp3.mul(Y1, Y2);
      let t2 = Fp3.mul(Z1, Z2);
      let t3 = Fp3.add(X1, Y1);
      let t4 = Fp3.add(X2, Y2);
      t3 = Fp3.mul(t3, t4);
      t4 = Fp3.add(t0, t1);
      t3 = Fp3.sub(t3, t4);
      t4 = Fp3.add(X1, Z1);
      let t5 = Fp3.add(X2, Z2);
      t4 = Fp3.mul(t4, t5);
      t5 = Fp3.add(t0, t2);
      t4 = Fp3.sub(t4, t5);
      t5 = Fp3.add(Y1, Z1);
      X3 = Fp3.add(Y2, Z2);
      t5 = Fp3.mul(t5, X3);
      X3 = Fp3.add(t1, t2);
      t5 = Fp3.sub(t5, X3);
      Z3 = Fp3.mul(a, t4);
      X3 = Fp3.mul(b3, t2);
      Z3 = Fp3.add(X3, Z3);
      X3 = Fp3.sub(t1, Z3);
      Z3 = Fp3.add(t1, Z3);
      Y3 = Fp3.mul(X3, Z3);
      t1 = Fp3.add(t0, t0);
      t1 = Fp3.add(t1, t0);
      t2 = Fp3.mul(a, t2);
      t4 = Fp3.mul(b3, t4);
      t1 = Fp3.add(t1, t2);
      t2 = Fp3.sub(t0, t2);
      t2 = Fp3.mul(a, t2);
      t4 = Fp3.add(t4, t2);
      t0 = Fp3.mul(t1, t4);
      Y3 = Fp3.add(Y3, t0);
      t0 = Fp3.mul(t5, t4);
      X3 = Fp3.mul(t3, X3);
      X3 = Fp3.sub(X3, t0);
      t0 = Fp3.mul(t3, t1);
      Z3 = Fp3.mul(t5, Z3);
      Z3 = Fp3.add(Z3, t0);
      return new Point2(X3, Y3, Z3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    is0() {
      return this.equals(Point2.ZERO);
    }
    wNAF(n) {
      return wnaf.wNAFCached(this, n, Point2.normalizeZ);
    }
    /**
     * Non-constant-time multiplication. Uses double-and-add algorithm.
     * It's faster, but should only be used when you don't care about
     * an exposed private key e.g. sig verification, which works over *public* keys.
     */
    multiplyUnsafe(sc) {
      aInRange("scalar", sc, _0n6, CURVE.n);
      const I = Point2.ZERO;
      if (sc === _0n6)
        return I;
      if (sc === _1n6)
        return this;
      const { endo } = CURVE;
      if (!endo)
        return wnaf.unsafeLadder(this, sc);
      let { k1neg, k1, k2neg, k2 } = endo.splitScalar(sc);
      let k1p = I;
      let k2p = I;
      let d = this;
      while (k1 > _0n6 || k2 > _0n6) {
        if (k1 & _1n6)
          k1p = k1p.add(d);
        if (k2 & _1n6)
          k2p = k2p.add(d);
        d = d.double();
        k1 >>= _1n6;
        k2 >>= _1n6;
      }
      if (k1neg)
        k1p = k1p.negate();
      if (k2neg)
        k2p = k2p.negate();
      k2p = new Point2(Fp3.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
      return k1p.add(k2p);
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
      const { endo, n: N } = CURVE;
      aInRange("scalar", scalar, _1n6, N);
      let point, fake;
      if (endo) {
        const { k1neg, k1, k2neg, k2 } = endo.splitScalar(scalar);
        let { p: k1p, f: f1p } = this.wNAF(k1);
        let { p: k2p, f: f2p } = this.wNAF(k2);
        k1p = wnaf.constTimeNegate(k1neg, k1p);
        k2p = wnaf.constTimeNegate(k2neg, k2p);
        k2p = new Point2(Fp3.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
        point = k1p.add(k2p);
        fake = f1p.add(f2p);
      } else {
        const { p, f } = this.wNAF(scalar);
        point = p;
        fake = f;
      }
      return Point2.normalizeZ([point, fake])[0];
    }
    /**
     * Efficiently calculate `aP + bQ`. Unsafe, can expose private key, if used incorrectly.
     * Not using Strauss-Shamir trick: precomputation tables are faster.
     * The trick could be useful if both P and Q are not G (not in our case).
     * @returns non-zero affine point
     */
    multiplyAndAddUnsafe(Q, a, b) {
      const G = Point2.BASE;
      const mul = /* @__PURE__ */ __name((P, a2) => a2 === _0n6 || a2 === _1n6 || !P.equals(G) ? P.multiplyUnsafe(a2) : P.multiply(a2), "mul");
      const sum = mul(this, a).add(mul(Q, b));
      return sum.is0() ? void 0 : sum;
    }
    // Converts Projective point to affine (x, y) coordinates.
    // Can accept precomputed Z^-1 - for example, from invertBatch.
    // (x, y, z) ∋ (x=x/z, y=y/z)
    toAffine(iz) {
      return toAffineMemo(this, iz);
    }
    isTorsionFree() {
      const { h: cofactor, isTorsionFree } = CURVE;
      if (cofactor === _1n6)
        return true;
      if (isTorsionFree)
        return isTorsionFree(Point2, this);
      throw new Error("isTorsionFree() has not been declared for the elliptic curve");
    }
    clearCofactor() {
      const { h: cofactor, clearCofactor } = CURVE;
      if (cofactor === _1n6)
        return this;
      if (clearCofactor)
        return clearCofactor(Point2, this);
      return this.multiplyUnsafe(CURVE.h);
    }
    toRawBytes(isCompressed = true) {
      abool("isCompressed", isCompressed);
      this.assertValidity();
      return toBytes3(Point2, this, isCompressed);
    }
    toHex(isCompressed = true) {
      abool("isCompressed", isCompressed);
      return bytesToHex(this.toRawBytes(isCompressed));
    }
  }
  Point2.BASE = new Point2(CURVE.Gx, CURVE.Gy, Fp3.ONE);
  Point2.ZERO = new Point2(Fp3.ZERO, Fp3.ONE, Fp3.ZERO);
  const _bits = CURVE.nBitLength;
  const wnaf = wNAF(Point2, CURVE.endo ? Math.ceil(_bits / 2) : _bits);
  return {
    CURVE,
    ProjectivePoint: Point2,
    normPrivateKeyToScalar,
    weierstrassEquation,
    isWithinCurveOrder
  };
}
__name(weierstrassPoints, "weierstrassPoints");
function validateOpts2(curve) {
  const opts = validateBasic(curve);
  validateObject(opts, {
    hash: "hash",
    hmac: "function",
    randomBytes: "function"
  }, {
    bits2int: "function",
    bits2int_modN: "function",
    lowS: "boolean"
  });
  return Object.freeze({ lowS: true, ...opts });
}
__name(validateOpts2, "validateOpts");
function weierstrass(curveDef) {
  const CURVE = validateOpts2(curveDef);
  const { Fp: Fp3, n: CURVE_ORDER } = CURVE;
  const compressedLen = Fp3.BYTES + 1;
  const uncompressedLen = 2 * Fp3.BYTES + 1;
  function modN(a) {
    return mod(a, CURVE_ORDER);
  }
  __name(modN, "modN");
  function invN(a) {
    return invert(a, CURVE_ORDER);
  }
  __name(invN, "invN");
  const { ProjectivePoint: Point2, normPrivateKeyToScalar, weierstrassEquation, isWithinCurveOrder } = weierstrassPoints({
    ...CURVE,
    toBytes(_c, point, isCompressed) {
      const a = point.toAffine();
      const x = Fp3.toBytes(a.x);
      const cat = concatBytes2;
      abool("isCompressed", isCompressed);
      if (isCompressed) {
        return cat(Uint8Array.from([point.hasEvenY() ? 2 : 3]), x);
      } else {
        return cat(Uint8Array.from([4]), x, Fp3.toBytes(a.y));
      }
    },
    fromBytes(bytes2) {
      const len = bytes2.length;
      const head = bytes2[0];
      const tail = bytes2.subarray(1);
      if (len === compressedLen && (head === 2 || head === 3)) {
        const x = bytesToNumberBE(tail);
        if (!inRange(x, _1n6, Fp3.ORDER))
          throw new Error("Point is not on curve");
        const y2 = weierstrassEquation(x);
        let y;
        try {
          y = Fp3.sqrt(y2);
        } catch (sqrtError) {
          const suffix = sqrtError instanceof Error ? ": " + sqrtError.message : "";
          throw new Error("Point is not on curve" + suffix);
        }
        const isYOdd = (y & _1n6) === _1n6;
        const isHeadOdd = (head & 1) === 1;
        if (isHeadOdd !== isYOdd)
          y = Fp3.neg(y);
        return { x, y };
      } else if (len === uncompressedLen && head === 4) {
        const x = Fp3.fromBytes(tail.subarray(0, Fp3.BYTES));
        const y = Fp3.fromBytes(tail.subarray(Fp3.BYTES, 2 * Fp3.BYTES));
        return { x, y };
      } else {
        throw new Error(`Point of length ${len} was invalid. Expected ${compressedLen} compressed bytes or ${uncompressedLen} uncompressed bytes`);
      }
    }
  });
  const numToNByteStr = /* @__PURE__ */ __name((num) => bytesToHex(numberToBytesBE(num, CURVE.nByteLength)), "numToNByteStr");
  function isBiggerThanHalfOrder(number2) {
    const HALF = CURVE_ORDER >> _1n6;
    return number2 > HALF;
  }
  __name(isBiggerThanHalfOrder, "isBiggerThanHalfOrder");
  function normalizeS(s) {
    return isBiggerThanHalfOrder(s) ? modN(-s) : s;
  }
  __name(normalizeS, "normalizeS");
  const slcNum = /* @__PURE__ */ __name((b, from3, to) => bytesToNumberBE(b.slice(from3, to)), "slcNum");
  class Signature {
    static {
      __name(this, "Signature");
    }
    constructor(r, s, recovery) {
      this.r = r;
      this.s = s;
      this.recovery = recovery;
      this.assertValidity();
    }
    // pair (bytes of r, bytes of s)
    static fromCompact(hex) {
      const l = CURVE.nByteLength;
      hex = ensureBytes("compactSignature", hex, l * 2);
      return new Signature(slcNum(hex, 0, l), slcNum(hex, l, 2 * l));
    }
    // DER encoded ECDSA signature
    // https://bitcoin.stackexchange.com/questions/57644/what-are-the-parts-of-a-bitcoin-transaction-input-script
    static fromDER(hex) {
      const { r, s } = DER.toSig(ensureBytes("DER", hex));
      return new Signature(r, s);
    }
    assertValidity() {
      aInRange("r", this.r, _1n6, CURVE_ORDER);
      aInRange("s", this.s, _1n6, CURVE_ORDER);
    }
    addRecoveryBit(recovery) {
      return new Signature(this.r, this.s, recovery);
    }
    recoverPublicKey(msgHash) {
      const { r, s, recovery: rec } = this;
      const h = bits2int_modN(ensureBytes("msgHash", msgHash));
      if (rec == null || ![0, 1, 2, 3].includes(rec))
        throw new Error("recovery id invalid");
      const radj = rec === 2 || rec === 3 ? r + CURVE.n : r;
      if (radj >= Fp3.ORDER)
        throw new Error("recovery id 2 or 3 invalid");
      const prefix = (rec & 1) === 0 ? "02" : "03";
      const R = Point2.fromHex(prefix + numToNByteStr(radj));
      const ir = invN(radj);
      const u1 = modN(-h * ir);
      const u2 = modN(s * ir);
      const Q = Point2.BASE.multiplyAndAddUnsafe(R, u1, u2);
      if (!Q)
        throw new Error("point at infinify");
      Q.assertValidity();
      return Q;
    }
    // Signatures should be low-s, to prevent malleability.
    hasHighS() {
      return isBiggerThanHalfOrder(this.s);
    }
    normalizeS() {
      return this.hasHighS() ? new Signature(this.r, modN(-this.s), this.recovery) : this;
    }
    // DER-encoded
    toDERRawBytes() {
      return hexToBytes(this.toDERHex());
    }
    toDERHex() {
      return DER.hexFromSig({ r: this.r, s: this.s });
    }
    // padded bytes of r, then padded bytes of s
    toCompactRawBytes() {
      return hexToBytes(this.toCompactHex());
    }
    toCompactHex() {
      return numToNByteStr(this.r) + numToNByteStr(this.s);
    }
  }
  const utils = {
    isValidPrivateKey(privateKey) {
      try {
        normPrivateKeyToScalar(privateKey);
        return true;
      } catch (error) {
        return false;
      }
    },
    normPrivateKeyToScalar,
    /**
     * Produces cryptographically secure private key from random of size
     * (groupLen + ceil(groupLen / 2)) with modulo bias being negligible.
     */
    randomPrivateKey: /* @__PURE__ */ __name(() => {
      const length3 = getMinHashLength(CURVE.n);
      return mapHashToField(CURVE.randomBytes(length3), CURVE.n);
    }, "randomPrivateKey"),
    /**
     * Creates precompute table for an arbitrary EC point. Makes point "cached".
     * Allows to massively speed-up `point.multiply(scalar)`.
     * @returns cached point
     * @example
     * const fast = utils.precompute(8, ProjectivePoint.fromHex(someonesPubKey));
     * fast.multiply(privKey); // much faster ECDH now
     */
    precompute(windowSize = 8, point = Point2.BASE) {
      point._setWindowSize(windowSize);
      point.multiply(BigInt(3));
      return point;
    }
  };
  function getPublicKey(privateKey, isCompressed = true) {
    return Point2.fromPrivateKey(privateKey).toRawBytes(isCompressed);
  }
  __name(getPublicKey, "getPublicKey");
  function isProbPub(item) {
    const arr = isBytes2(item);
    const str = typeof item === "string";
    const len = (arr || str) && item.length;
    if (arr)
      return len === compressedLen || len === uncompressedLen;
    if (str)
      return len === 2 * compressedLen || len === 2 * uncompressedLen;
    if (item instanceof Point2)
      return true;
    return false;
  }
  __name(isProbPub, "isProbPub");
  function getSharedSecret(privateA, publicB, isCompressed = true) {
    if (isProbPub(privateA))
      throw new Error("first arg must be private key");
    if (!isProbPub(publicB))
      throw new Error("second arg must be public key");
    const b = Point2.fromHex(publicB);
    return b.multiply(normPrivateKeyToScalar(privateA)).toRawBytes(isCompressed);
  }
  __name(getSharedSecret, "getSharedSecret");
  const bits2int = CURVE.bits2int || function(bytes2) {
    const num = bytesToNumberBE(bytes2);
    const delta = bytes2.length * 8 - CURVE.nBitLength;
    return delta > 0 ? num >> BigInt(delta) : num;
  };
  const bits2int_modN = CURVE.bits2int_modN || function(bytes2) {
    return modN(bits2int(bytes2));
  };
  const ORDER_MASK = bitMask(CURVE.nBitLength);
  function int2octets(num) {
    aInRange(`num < 2^${CURVE.nBitLength}`, num, _0n6, ORDER_MASK);
    return numberToBytesBE(num, CURVE.nByteLength);
  }
  __name(int2octets, "int2octets");
  function prepSig(msgHash, privateKey, opts = defaultSigOpts) {
    if (["recovered", "canonical"].some((k) => k in opts))
      throw new Error("sign() legacy options not supported");
    const { hash: hash2, randomBytes: randomBytes3 } = CURVE;
    let { lowS, prehash, extraEntropy: ent } = opts;
    if (lowS == null)
      lowS = true;
    msgHash = ensureBytes("msgHash", msgHash);
    validateSigVerOpts(opts);
    if (prehash)
      msgHash = ensureBytes("prehashed msgHash", hash2(msgHash));
    const h1int = bits2int_modN(msgHash);
    const d = normPrivateKeyToScalar(privateKey);
    const seedArgs = [int2octets(d), int2octets(h1int)];
    if (ent != null && ent !== false) {
      const e = ent === true ? randomBytes3(Fp3.BYTES) : ent;
      seedArgs.push(ensureBytes("extraEntropy", e));
    }
    const seed = concatBytes2(...seedArgs);
    const m = h1int;
    function k2sig(kBytes) {
      const k = bits2int(kBytes);
      if (!isWithinCurveOrder(k))
        return;
      const ik = invN(k);
      const q = Point2.BASE.multiply(k).toAffine();
      const r = modN(q.x);
      if (r === _0n6)
        return;
      const s = modN(ik * modN(m + r * d));
      if (s === _0n6)
        return;
      let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n6);
      let normS = s;
      if (lowS && isBiggerThanHalfOrder(s)) {
        normS = normalizeS(s);
        recovery ^= 1;
      }
      return new Signature(r, normS, recovery);
    }
    __name(k2sig, "k2sig");
    return { seed, k2sig };
  }
  __name(prepSig, "prepSig");
  const defaultSigOpts = { lowS: CURVE.lowS, prehash: false };
  const defaultVerOpts = { lowS: CURVE.lowS, prehash: false };
  function sign(msgHash, privKey, opts = defaultSigOpts) {
    const { seed, k2sig } = prepSig(msgHash, privKey, opts);
    const C = CURVE;
    const drbg = createHmacDrbg(C.hash.outputLen, C.nByteLength, C.hmac);
    return drbg(seed, k2sig);
  }
  __name(sign, "sign");
  Point2.BASE._setWindowSize(8);
  function verify(signature, msgHash, publicKey, opts = defaultVerOpts) {
    const sg = signature;
    msgHash = ensureBytes("msgHash", msgHash);
    publicKey = ensureBytes("publicKey", publicKey);
    if ("strict" in opts)
      throw new Error("options.strict was renamed to lowS");
    validateSigVerOpts(opts);
    const { lowS, prehash } = opts;
    let _sig = void 0;
    let P;
    try {
      if (typeof sg === "string" || isBytes2(sg)) {
        try {
          _sig = Signature.fromDER(sg);
        } catch (derError) {
          if (!(derError instanceof DER.Err))
            throw derError;
          _sig = Signature.fromCompact(sg);
        }
      } else if (typeof sg === "object" && typeof sg.r === "bigint" && typeof sg.s === "bigint") {
        const { r: r2, s: s2 } = sg;
        _sig = new Signature(r2, s2);
      } else {
        throw new Error("PARSE");
      }
      P = Point2.fromHex(publicKey);
    } catch (error) {
      if (error.message === "PARSE")
        throw new Error(`signature must be Signature instance, Uint8Array or hex string`);
      return false;
    }
    if (lowS && _sig.hasHighS())
      return false;
    if (prehash)
      msgHash = CURVE.hash(msgHash);
    const { r, s } = _sig;
    const h = bits2int_modN(msgHash);
    const is = invN(s);
    const u1 = modN(h * is);
    const u2 = modN(r * is);
    const R = Point2.BASE.multiplyAndAddUnsafe(P, u1, u2)?.toAffine();
    if (!R)
      return false;
    const v = modN(R.x);
    return v === r;
  }
  __name(verify, "verify");
  return {
    CURVE,
    getPublicKey,
    getSharedSecret,
    sign,
    verify,
    ProjectivePoint: Point2,
    Signature,
    utils
  };
}
__name(weierstrass, "weierstrass");

// node_modules/@noble/curves/esm/_shortw_utils.js
function getHash(hash2) {
  return {
    hash: hash2,
    hmac: /* @__PURE__ */ __name((key, ...msgs) => hmac(hash2, key, concatBytes(...msgs)), "hmac"),
    randomBytes
  };
}
__name(getHash, "getHash");
function createCurve(curveDef, defHash) {
  const create2 = /* @__PURE__ */ __name((hash2) => weierstrass({ ...curveDef, ...getHash(hash2) }), "create");
  return Object.freeze({ ...create2(defHash), create: create2 });
}
__name(createCurve, "createCurve");

// node_modules/@noble/curves/esm/secp256k1.js
var secp256k1P = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f");
var secp256k1N = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141");
var _1n7 = BigInt(1);
var _2n6 = BigInt(2);
var divNearest = /* @__PURE__ */ __name((a, b) => (a + b / _2n6) / b, "divNearest");
function sqrtMod(y) {
  const P = secp256k1P;
  const _3n4 = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
  const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
  const b2 = y * y * y % P;
  const b3 = b2 * b2 * y % P;
  const b6 = pow2(b3, _3n4, P) * b3 % P;
  const b9 = pow2(b6, _3n4, P) * b3 % P;
  const b11 = pow2(b9, _2n6, P) * b2 % P;
  const b22 = pow2(b11, _11n, P) * b11 % P;
  const b44 = pow2(b22, _22n, P) * b22 % P;
  const b88 = pow2(b44, _44n, P) * b44 % P;
  const b176 = pow2(b88, _88n, P) * b88 % P;
  const b220 = pow2(b176, _44n, P) * b44 % P;
  const b223 = pow2(b220, _3n4, P) * b3 % P;
  const t1 = pow2(b223, _23n, P) * b22 % P;
  const t2 = pow2(t1, _6n, P) * b2 % P;
  const root = pow2(t2, _2n6, P);
  if (!Fp2.eql(Fp2.sqr(root), y))
    throw new Error("Cannot find square root");
  return root;
}
__name(sqrtMod, "sqrtMod");
var Fp2 = Field(secp256k1P, void 0, void 0, { sqrt: sqrtMod });
var secp256k1 = createCurve({
  a: BigInt(0),
  // equation params: a, b
  b: BigInt(7),
  // Seem to be rigid: bitcointalk.org/index.php?topic=289795.msg3183975#msg3183975
  Fp: Fp2,
  // Field's prime: 2n**256n - 2n**32n - 2n**9n - 2n**8n - 2n**7n - 2n**6n - 2n**4n - 1n
  n: secp256k1N,
  // Curve order, total count of valid points in the field
  // Base point (x, y) aka generator point
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  h: BigInt(1),
  // Cofactor
  lowS: true,
  // Allow only low-S signatures by default in sign() and verify()
  /**
   * secp256k1 belongs to Koblitz curves: it has efficiently computable endomorphism.
   * Endomorphism uses 2x less RAM, speeds up precomputation by 2x and ECDH / key recovery by 20%.
   * For precomputed wNAF it trades off 1/2 init time & 1/3 ram for 20% perf hit.
   * Explanation: https://gist.github.com/paulmillr/eb670806793e84df628a7c434a873066
   */
  endo: {
    beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
    splitScalar: /* @__PURE__ */ __name((k) => {
      const n = secp256k1N;
      const a1 = BigInt("0x3086d221a7d46bcde86c90e49284eb15");
      const b1 = -_1n7 * BigInt("0xe4437ed6010e88286f547fa90abfe4c3");
      const a2 = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8");
      const b2 = a1;
      const POW_2_128 = BigInt("0x100000000000000000000000000000000");
      const c1 = divNearest(b2 * k, n);
      const c2 = divNearest(-b1 * k, n);
      let k1 = mod(k - c1 * a1 - c2 * a2, n);
      let k2 = mod(-c1 * b1 - c2 * b2, n);
      const k1neg = k1 > POW_2_128;
      const k2neg = k2 > POW_2_128;
      if (k1neg)
        k1 = n - k1;
      if (k2neg)
        k2 = n - k2;
      if (k1 > POW_2_128 || k2 > POW_2_128) {
        throw new Error("splitScalar: Endomorphism failed, k=" + k);
      }
      return { k1neg, k1, k2neg, k2 };
    }, "splitScalar")
  }
}, sha2562);
var _0n7 = BigInt(0);
var Point = secp256k1.ProjectivePoint;

// node_modules/uint8arrays/dist/src/util/as-uint8array.js
function asUint8Array(buf) {
  return buf;
}
__name(asUint8Array, "asUint8Array");

// node_modules/uint8arrays/dist/src/concat.js
function concat2(arrays, length3) {
  if (length3 == null) {
    length3 = arrays.reduce((acc, curr) => acc + curr.length, 0);
  }
  const output2 = allocUnsafe(length3);
  let offset = 0;
  for (const arr of arrays) {
    output2.set(arr, offset);
    offset += arr.length;
  }
  return asUint8Array(output2);
}
__name(concat2, "concat");

// node_modules/@libp2p/crypto/dist/src/util.js
function isPromise(thing) {
  if (thing == null) {
    return false;
  }
  return typeof thing.then === "function" && typeof thing.catch === "function" && typeof thing.finally === "function";
}
__name(isPromise, "isPromise");

// node_modules/@libp2p/crypto/dist/src/keys/secp256k1/index.browser.js
function hashAndVerify3(key, sig, msg) {
  const p = sha256.digest(msg instanceof Uint8Array ? msg : msg.subarray());
  if (isPromise(p)) {
    return p.then(({ digest: digest2 }) => secp256k1.verify(sig, digest2, key)).catch((err) => {
      throw new VerificationError(String(err));
    });
  }
  try {
    return secp256k1.verify(sig, p.digest, key);
  } catch (err) {
    throw new VerificationError(String(err));
  }
}
__name(hashAndVerify3, "hashAndVerify");

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
  verify(data, sig) {
    return hashAndVerify3(this._key, sig, data);
  }
};

// node_modules/@libp2p/crypto/dist/src/keys/secp256k1/utils.js
function unmarshalSecp256k1PublicKey(bytes2) {
  return new Secp256k1PublicKey(bytes2);
}
__name(unmarshalSecp256k1PublicKey, "unmarshalSecp256k1PublicKey");
function compressSecp256k1PublicKey(key) {
  const point = secp256k1.ProjectivePoint.fromHex(key).toRawBytes(true);
  return point;
}
__name(compressSecp256k1PublicKey, "compressSecp256k1PublicKey");
function validateSecp256k1PublicKey(key) {
  try {
    secp256k1.ProjectivePoint.fromHex(key);
    return key;
  } catch (err) {
    throw new InvalidPublicKeyError(String(err));
  }
}
__name(validateSecp256k1PublicKey, "validateSecp256k1PublicKey");

// node_modules/@libp2p/crypto/dist/src/keys/index.js
function publicKeyFromProtobuf(buf) {
  const { Type, Data } = PublicKey.decode(buf);
  const data = Data ?? new Uint8Array();
  switch (Type) {
    case KeyType.RSA:
      return pkixToRSAPublicKey(data);
    case KeyType.Ed25519:
      return unmarshalEd25519PublicKey(data);
    case KeyType.secp256k1:
      return unmarshalSecp256k1PublicKey(data);
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
function peerIdFromString(str, decoder) {
  let multihash;
  if (str.charAt(0) === "1" || str.charAt(0) === "Q") {
    multihash = decode4(base58btc.decode(`z${str}`));
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
function isIdentityMultihash(multihash) {
  return multihash.code === identity.code;
}
__name(isIdentityMultihash, "isIdentityMultihash");
function isSha256Multihash(multihash) {
  return multihash.code === sha256.code;
}
__name(isSha256Multihash, "isSha256Multihash");

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
  consume(bytes2) {
    bytes2 = Math.trunc(bytes2);
    if (Number.isNaN(bytes2) || bytes2 <= 0) {
      return;
    }
    if (bytes2 === this.byteLength) {
      this.bufs = [];
      this.length = 0;
      return;
    }
    while (this.bufs.length > 0) {
      if (bytes2 >= this.bufs[0].byteLength) {
        bytes2 -= this.bufs[0].byteLength;
        this.length -= this.bufs[0].byteLength;
        this.bufs.shift();
      } else {
        this.bufs[0] = this.bufs[0].subarray(bytes2);
        this.length -= bytes2;
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
    return concat2(bufs, length3);
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
    return concat2(bufs, length3);
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

// node_modules/it-length-prefixed/dist/src/utils.js
function isAsyncIterable(thing) {
  return thing[Symbol.asyncIterator] != null;
}
__name(isAsyncIterable, "isAsyncIterable");

// node_modules/it-length-prefixed/dist/src/encode.js
var defaultEncoder = /* @__PURE__ */ __name((length3) => {
  const lengthLength = encodingLength2(length3);
  const lengthBuf = allocUnsafe(lengthLength);
  encode4(length3, lengthBuf);
  defaultEncoder.bytes = lengthLength;
  return lengthBuf;
}, "defaultEncoder");
defaultEncoder.bytes = 0;
function encode6(source, options) {
  options = options ?? {};
  const encodeLength = options.lengthEncoder ?? defaultEncoder;
  function* maybeYield(chunk) {
    const length3 = encodeLength(chunk.byteLength);
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
    return async function* () {
      for await (const chunk of source) {
        yield* maybeYield(chunk);
      }
    }();
  }
  return function* () {
    for (const chunk of source) {
      yield* maybeYield(chunk);
    }
  }();
}
__name(encode6, "encode");
encode6.single = (chunk, options) => {
  options = options ?? {};
  const encodeLength = options.lengthEncoder ?? defaultEncoder;
  return new Uint8ArrayList(encodeLength(chunk.byteLength), chunk);
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
  const length3 = decode5(buf);
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
    return async function* () {
      for await (const buf of source) {
        buffer.append(buf);
        yield* maybeYield();
      }
      if (buffer.byteLength > 0) {
        throw new UnexpectedEOFError("Unexpected end of input");
      }
    }();
  }
  return function* () {
    for (const buf of source) {
      buffer.append(buf);
      yield* maybeYield();
    }
    if (buffer.byteLength > 0) {
      throw new UnexpectedEOFError("Unexpected end of input");
    }
  }();
}
__name(decode7, "decode");
decode7.fromReader = (reader, options) => {
  let byteLength = 1;
  const varByteSource = async function* () {
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
  }();
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

// node_modules/it-merge/dist/src/index.js
function isAsyncIterable2(thing) {
  return thing[Symbol.asyncIterator] != null;
}
__name(isAsyncIterable2, "isAsyncIterable");
function merge(...sources) {
  const syncSources = [];
  for (const source of sources) {
    if (!isAsyncIterable2(source)) {
      syncSources.push(source);
    }
  }
  if (syncSources.length === sources.length) {
    return function* () {
      for (const source of syncSources) {
        yield* source;
      }
    }();
  }
  return async function* () {
    const output2 = pushable({
      objectMode: true
    });
    void Promise.resolve().then(async () => {
      try {
        await Promise.all(sources.map(async (source) => {
          for await (const item of source) {
            output2.push(item);
          }
        }));
        output2.end();
      } catch (err) {
        output2.end(err);
      }
    });
    yield* output2;
  }();
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
      const bytes2 = concat2([SignPrefix, RPC.Message.encode(rpcMsg)]);
      rpcMsg.signature = await publishConfig.privateKey.sign(bytes2);
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
      if (msg.key != null)
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
      const bytes2 = concat2([SignPrefix, RPC.Message.encode(rpcMsgPreSign)]);
      if (!await publicKey.verify(bytes2, msg.signature)) {
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
          key: msg.key != null ? publicKeyFromProtobuf(msg.key) : publicKey
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
      const maxValue = 2 ** (8 * maxBytes) - 1;
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
        if (result > maxValue) {
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
var parser = new Parser();
function parseIP(input) {
  if (input.includes("%")) {
    input = input.split("%")[0];
  }
  if (input.length > MAX_IPV6_LENGTH) {
    return void 0;
  }
  return parser.new(input).parseWith(() => parser.readIPAddr());
}
__name(parseIP, "parseIP");

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
function isIP(input) {
  return Boolean(parseIP(input));
}
__name(isIP, "isIP");

// node_modules/@multiformats/multiaddr/dist/src/ip.js
var toString3 = /* @__PURE__ */ __name(function(buf, offset = 0, length3) {
  offset = ~~offset;
  length3 = length3 ?? buf.length - offset;
  const view = new DataView(buf.buffer);
  if (length3 === 4) {
    const result = [];
    for (let i = 0; i < length3; i++) {
      result.push(buf[offset + i]);
    }
    return result.join(".");
  }
  if (length3 === 16) {
    const result = [];
    for (let i = 0; i < length3; i += 2) {
      result.push(view.getUint16(offset + i).toString(16));
    }
    return result.join(":").replace(/(^|:)0(:0)*:0(:|$)/, "$1::$3").replace(/:{3,4}/, "::");
  }
  return "";
}, "toString");

// node_modules/@multiformats/multiaddr/dist/src/protocols-table.js
var V = -1;
var names = {};
var codes = {};
var table = [
  [4, 32, "ip4"],
  [6, 16, "tcp"],
  [33, 16, "dccp"],
  [41, 128, "ip6"],
  [42, V, "ip6zone"],
  [43, 8, "ipcidr"],
  [53, V, "dns", true],
  [54, V, "dns4", true],
  [55, V, "dns6", true],
  [56, V, "dnsaddr", true],
  [132, 16, "sctp"],
  [273, 16, "udp"],
  [275, 0, "p2p-webrtc-star"],
  [276, 0, "p2p-webrtc-direct"],
  [277, 0, "p2p-stardust"],
  [280, 0, "webrtc-direct"],
  [281, 0, "webrtc"],
  [290, 0, "p2p-circuit"],
  [301, 0, "udt"],
  [302, 0, "utp"],
  [400, V, "unix", false, true],
  // `ipfs` is added before `p2p` for legacy support.
  // All text representations will default to `p2p`, but `ipfs` will
  // still be supported
  [421, V, "ipfs"],
  // `p2p` is the preferred name for 421, and is now the default
  [421, V, "p2p"],
  [443, 0, "https"],
  [444, 96, "onion"],
  [445, 296, "onion3"],
  [446, V, "garlic64"],
  [448, 0, "tls"],
  [449, V, "sni"],
  [460, 0, "quic"],
  [461, 0, "quic-v1"],
  [465, 0, "webtransport"],
  [466, V, "certhash"],
  [477, 0, "ws"],
  [478, 0, "wss"],
  [479, 0, "p2p-websocket-star"],
  [480, 0, "http"],
  [481, V, "http-path"],
  [777, V, "memory"]
];
table.forEach((row) => {
  const proto = createProtocol(...row);
  codes[proto.code] = proto;
  names[proto.name] = proto;
});
function createProtocol(code2, size, name2, resolvable, path) {
  return {
    code: code2,
    size,
    name: name2,
    resolvable: Boolean(resolvable),
    path: Boolean(path)
  };
}
__name(createProtocol, "createProtocol");
function getProtocol(proto) {
  if (typeof proto === "number") {
    if (codes[proto] != null) {
      return codes[proto];
    }
    throw new Error(`no protocol with code: ${proto}`);
  } else if (typeof proto === "string") {
    if (names[proto] != null) {
      return names[proto];
    }
    throw new Error(`no protocol with name: ${proto}`);
  }
  throw new Error(`invalid protocol id type: ${typeof proto}`);
}
__name(getProtocol, "getProtocol");

// node_modules/@multiformats/multiaddr/dist/src/convert.js
var ip4Protocol = getProtocol("ip4");
var ip6Protocol = getProtocol("ip6");
var ipcidrProtocol = getProtocol("ipcidr");
function convertToString(proto, buf) {
  const protocol = getProtocol(proto);
  switch (protocol.code) {
    case 4:
    // ipv4
    case 41:
      return bytes2ip(buf);
    case 42:
      return bytes2str(buf);
    case 6:
    // tcp
    case 273:
    // udp
    case 33:
    // dccp
    case 132:
      return bytes2port(buf).toString();
    case 53:
    // dns
    case 54:
    // dns4
    case 55:
    // dns6
    case 56:
    // dnsaddr
    case 400:
    // unix
    case 449:
    // sni
    case 777:
      return bytes2str(buf);
    case 421:
      return bytes2mh(buf);
    case 444:
      return bytes2onion(buf);
    case 445:
      return bytes2onion(buf);
    case 466:
      return bytes2mb(buf);
    case 481:
      return globalThis.encodeURIComponent(bytes2str(buf));
    default:
      return toString2(buf, "base16");
  }
}
__name(convertToString, "convertToString");
var decoders = Object.values(bases).map((c) => c.decoder);
var anybaseDecoder = function() {
  let acc = decoders[0].or(decoders[1]);
  decoders.slice(2).forEach((d) => acc = acc.or(d));
  return acc;
}();
function bytes2ip(ipBuff) {
  const ipString = toString3(ipBuff, 0, ipBuff.length);
  if (ipString == null) {
    throw new Error("ipBuff is required");
  }
  if (!isIP(ipString)) {
    throw new Error("invalid ip address");
  }
  return ipString;
}
__name(bytes2ip, "bytes2ip");
function bytes2port(buf) {
  const view = new DataView(buf.buffer);
  return view.getUint16(buf.byteOffset);
}
__name(bytes2port, "bytes2port");
function bytes2str(buf) {
  const size = decode5(buf);
  buf = buf.slice(encodingLength2(size));
  if (buf.length !== size) {
    throw new Error("inconsistent lengths");
  }
  return toString2(buf);
}
__name(bytes2str, "bytes2str");
function bytes2mb(buf) {
  const size = decode5(buf);
  const hash2 = buf.slice(encodingLength2(size));
  if (hash2.length !== size) {
    throw new Error("inconsistent lengths");
  }
  return "u" + toString2(hash2, "base64url");
}
__name(bytes2mb, "bytes2mb");
function bytes2mh(buf) {
  const size = decode5(buf);
  const address = buf.slice(encodingLength2(size));
  if (address.length !== size) {
    throw new Error("inconsistent lengths");
  }
  return toString2(address, "base58btc");
}
__name(bytes2mh, "bytes2mh");
function bytes2onion(buf) {
  const addrBytes = buf.slice(0, buf.length - 2);
  const portBytes = buf.slice(buf.length - 2);
  const addr = toString2(addrBytes, "base32");
  const port = bytes2port(portBytes);
  return `${addr}:${port}`;
}
__name(bytes2onion, "bytes2onion");

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
  peers = /* @__PURE__ */ new Set();
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
    return [...this.peers.keys()].map((str) => peerIdFromString(str));
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
      this.peers.add(id);
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
    return (peersInTopic != null ? Array.from(peersInTopic) : []).map((str) => peerIdFromString(str));
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
      recipients: Array.from(tosend.values()).map((str) => peerIdFromString(str))
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
      const id2 = peerIdFromString(peerId);
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
    this.components.peerStore.merge(peerIdFromString(peerId), {
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
    this.components.peerStore.merge(peerIdFromString(peerId), {
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

pvtsutils/build/index.js:
  (*!
   * MIT License
   * 
   * Copyright (c) 2017-2022 Peculiar Ventures, LLC
   * 
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   * 
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   * 
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   * 
   *)

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/utils.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/modular.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/curve.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/edwards.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/ed25519.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

pvutils/build/utils.es.js:
  (*!
   Copyright (c) Peculiar Ventures, LLC
  *)

asn1js/build/index.es.js:
  (*!
   * Copyright (c) 2014, GMO GlobalSign
   * Copyright (c) 2015-2022, Peculiar Ventures
   * All rights reserved.
   * 
   * Author 2014-2019, Yury Strozhevsky
   * 
   * Redistribution and use in source and binary forms, with or without modification,
   * are permitted provided that the following conditions are met:
   * 
   * * Redistributions of source code must retain the above copyright notice, this
   *   list of conditions and the following disclaimer.
   * 
   * * Redistributions in binary form must reproduce the above copyright notice, this
   *   list of conditions and the following disclaimer in the documentation and/or
   *   other materials provided with the distribution.
   * 
   * * Neither the name of the copyright holder nor the names of its
   *   contributors may be used to endorse or promote products derived from
   *   this software without specific prior written permission.
   * 
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
   * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
   * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
   * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
   * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
   * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   * 
   *)

@noble/curves/esm/abstract/weierstrass.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/_shortw_utils.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/secp256k1.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
//# sourceMappingURL=lib-gossipsub.js.map
