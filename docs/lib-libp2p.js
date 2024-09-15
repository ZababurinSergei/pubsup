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
var __export = (target, all2) => {
  for (var name3 in all2)
    __defProp(target, name3, { get: all2[name3], enumerable: true });
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
        const s2 = unescape(encodeURIComponent(text));
        const uintArray = new Uint8Array(s2.length);
        for (let i = 0; i < s2.length; i++) {
          uintArray[i] = s2.charCodeAt(i);
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

// node_modules/murmurhash3js-revisited/lib/murmurHash3js.js
var require_murmurHash3js = __commonJS({
  "node_modules/murmurhash3js-revisited/lib/murmurHash3js.js"(exports, module) {
    (function(root, undefined2) {
      "use strict";
      var library = {
        "version": "3.0.0",
        "x86": {},
        "x64": {},
        "inputValidation": true
      };
      function _validBytes(bytes2) {
        if (!Array.isArray(bytes2) && !ArrayBuffer.isView(bytes2)) {
          return false;
        }
        for (var i = 0; i < bytes2.length; i++) {
          if (!Number.isInteger(bytes2[i]) || bytes2[i] < 0 || bytes2[i] > 255) {
            return false;
          }
        }
        return true;
      }
      __name(_validBytes, "_validBytes");
      function _x86Multiply(m2, n) {
        return (m2 & 65535) * n + (((m2 >>> 16) * n & 65535) << 16);
      }
      __name(_x86Multiply, "_x86Multiply");
      function _x86Rotl(m2, n) {
        return m2 << n | m2 >>> 32 - n;
      }
      __name(_x86Rotl, "_x86Rotl");
      function _x86Fmix(h2) {
        h2 ^= h2 >>> 16;
        h2 = _x86Multiply(h2, 2246822507);
        h2 ^= h2 >>> 13;
        h2 = _x86Multiply(h2, 3266489909);
        h2 ^= h2 >>> 16;
        return h2;
      }
      __name(_x86Fmix, "_x86Fmix");
      function _x64Add(m2, n) {
        m2 = [m2[0] >>> 16, m2[0] & 65535, m2[1] >>> 16, m2[1] & 65535];
        n = [n[0] >>> 16, n[0] & 65535, n[1] >>> 16, n[1] & 65535];
        var o = [0, 0, 0, 0];
        o[3] += m2[3] + n[3];
        o[2] += o[3] >>> 16;
        o[3] &= 65535;
        o[2] += m2[2] + n[2];
        o[1] += o[2] >>> 16;
        o[2] &= 65535;
        o[1] += m2[1] + n[1];
        o[0] += o[1] >>> 16;
        o[1] &= 65535;
        o[0] += m2[0] + n[0];
        o[0] &= 65535;
        return [o[0] << 16 | o[1], o[2] << 16 | o[3]];
      }
      __name(_x64Add, "_x64Add");
      function _x64Multiply(m2, n) {
        m2 = [m2[0] >>> 16, m2[0] & 65535, m2[1] >>> 16, m2[1] & 65535];
        n = [n[0] >>> 16, n[0] & 65535, n[1] >>> 16, n[1] & 65535];
        var o = [0, 0, 0, 0];
        o[3] += m2[3] * n[3];
        o[2] += o[3] >>> 16;
        o[3] &= 65535;
        o[2] += m2[2] * n[3];
        o[1] += o[2] >>> 16;
        o[2] &= 65535;
        o[2] += m2[3] * n[2];
        o[1] += o[2] >>> 16;
        o[2] &= 65535;
        o[1] += m2[1] * n[3];
        o[0] += o[1] >>> 16;
        o[1] &= 65535;
        o[1] += m2[2] * n[2];
        o[0] += o[1] >>> 16;
        o[1] &= 65535;
        o[1] += m2[3] * n[1];
        o[0] += o[1] >>> 16;
        o[1] &= 65535;
        o[0] += m2[0] * n[3] + m2[1] * n[2] + m2[2] * n[1] + m2[3] * n[0];
        o[0] &= 65535;
        return [o[0] << 16 | o[1], o[2] << 16 | o[3]];
      }
      __name(_x64Multiply, "_x64Multiply");
      function _x64Rotl(m2, n) {
        n %= 64;
        if (n === 32) {
          return [m2[1], m2[0]];
        } else if (n < 32) {
          return [m2[0] << n | m2[1] >>> 32 - n, m2[1] << n | m2[0] >>> 32 - n];
        } else {
          n -= 32;
          return [m2[1] << n | m2[0] >>> 32 - n, m2[0] << n | m2[1] >>> 32 - n];
        }
      }
      __name(_x64Rotl, "_x64Rotl");
      function _x64LeftShift(m2, n) {
        n %= 64;
        if (n === 0) {
          return m2;
        } else if (n < 32) {
          return [m2[0] << n | m2[1] >>> 32 - n, m2[1] << n];
        } else {
          return [m2[1] << n - 32, 0];
        }
      }
      __name(_x64LeftShift, "_x64LeftShift");
      function _x64Xor(m2, n) {
        return [m2[0] ^ n[0], m2[1] ^ n[1]];
      }
      __name(_x64Xor, "_x64Xor");
      function _x64Fmix(h2) {
        h2 = _x64Xor(h2, [0, h2[0] >>> 1]);
        h2 = _x64Multiply(h2, [4283543511, 3981806797]);
        h2 = _x64Xor(h2, [0, h2[0] >>> 1]);
        h2 = _x64Multiply(h2, [3301882366, 444984403]);
        h2 = _x64Xor(h2, [0, h2[0] >>> 1]);
        return h2;
      }
      __name(_x64Fmix, "_x64Fmix");
      library.x86.hash32 = function(bytes2, seed) {
        if (library.inputValidation && !_validBytes(bytes2)) {
          return undefined2;
        }
        seed = seed || 0;
        var remainder = bytes2.length % 4;
        var blocks = bytes2.length - remainder;
        var h1 = seed;
        var k1 = 0;
        var c1 = 3432918353;
        var c2 = 461845907;
        for (var i = 0; i < blocks; i = i + 4) {
          k1 = bytes2[i] | bytes2[i + 1] << 8 | bytes2[i + 2] << 16 | bytes2[i + 3] << 24;
          k1 = _x86Multiply(k1, c1);
          k1 = _x86Rotl(k1, 15);
          k1 = _x86Multiply(k1, c2);
          h1 ^= k1;
          h1 = _x86Rotl(h1, 13);
          h1 = _x86Multiply(h1, 5) + 3864292196;
        }
        k1 = 0;
        switch (remainder) {
          case 3:
            k1 ^= bytes2[i + 2] << 16;
          case 2:
            k1 ^= bytes2[i + 1] << 8;
          case 1:
            k1 ^= bytes2[i];
            k1 = _x86Multiply(k1, c1);
            k1 = _x86Rotl(k1, 15);
            k1 = _x86Multiply(k1, c2);
            h1 ^= k1;
        }
        h1 ^= bytes2.length;
        h1 = _x86Fmix(h1);
        return h1 >>> 0;
      };
      library.x86.hash128 = function(bytes2, seed) {
        if (library.inputValidation && !_validBytes(bytes2)) {
          return undefined2;
        }
        seed = seed || 0;
        var remainder = bytes2.length % 16;
        var blocks = bytes2.length - remainder;
        var h1 = seed;
        var h2 = seed;
        var h3 = seed;
        var h4 = seed;
        var k1 = 0;
        var k2 = 0;
        var k3 = 0;
        var k4 = 0;
        var c1 = 597399067;
        var c2 = 2869860233;
        var c3 = 951274213;
        var c4 = 2716044179;
        for (var i = 0; i < blocks; i = i + 16) {
          k1 = bytes2[i] | bytes2[i + 1] << 8 | bytes2[i + 2] << 16 | bytes2[i + 3] << 24;
          k2 = bytes2[i + 4] | bytes2[i + 5] << 8 | bytes2[i + 6] << 16 | bytes2[i + 7] << 24;
          k3 = bytes2[i + 8] | bytes2[i + 9] << 8 | bytes2[i + 10] << 16 | bytes2[i + 11] << 24;
          k4 = bytes2[i + 12] | bytes2[i + 13] << 8 | bytes2[i + 14] << 16 | bytes2[i + 15] << 24;
          k1 = _x86Multiply(k1, c1);
          k1 = _x86Rotl(k1, 15);
          k1 = _x86Multiply(k1, c2);
          h1 ^= k1;
          h1 = _x86Rotl(h1, 19);
          h1 += h2;
          h1 = _x86Multiply(h1, 5) + 1444728091;
          k2 = _x86Multiply(k2, c2);
          k2 = _x86Rotl(k2, 16);
          k2 = _x86Multiply(k2, c3);
          h2 ^= k2;
          h2 = _x86Rotl(h2, 17);
          h2 += h3;
          h2 = _x86Multiply(h2, 5) + 197830471;
          k3 = _x86Multiply(k3, c3);
          k3 = _x86Rotl(k3, 17);
          k3 = _x86Multiply(k3, c4);
          h3 ^= k3;
          h3 = _x86Rotl(h3, 15);
          h3 += h4;
          h3 = _x86Multiply(h3, 5) + 2530024501;
          k4 = _x86Multiply(k4, c4);
          k4 = _x86Rotl(k4, 18);
          k4 = _x86Multiply(k4, c1);
          h4 ^= k4;
          h4 = _x86Rotl(h4, 13);
          h4 += h1;
          h4 = _x86Multiply(h4, 5) + 850148119;
        }
        k1 = 0;
        k2 = 0;
        k3 = 0;
        k4 = 0;
        switch (remainder) {
          case 15:
            k4 ^= bytes2[i + 14] << 16;
          case 14:
            k4 ^= bytes2[i + 13] << 8;
          case 13:
            k4 ^= bytes2[i + 12];
            k4 = _x86Multiply(k4, c4);
            k4 = _x86Rotl(k4, 18);
            k4 = _x86Multiply(k4, c1);
            h4 ^= k4;
          case 12:
            k3 ^= bytes2[i + 11] << 24;
          case 11:
            k3 ^= bytes2[i + 10] << 16;
          case 10:
            k3 ^= bytes2[i + 9] << 8;
          case 9:
            k3 ^= bytes2[i + 8];
            k3 = _x86Multiply(k3, c3);
            k3 = _x86Rotl(k3, 17);
            k3 = _x86Multiply(k3, c4);
            h3 ^= k3;
          case 8:
            k2 ^= bytes2[i + 7] << 24;
          case 7:
            k2 ^= bytes2[i + 6] << 16;
          case 6:
            k2 ^= bytes2[i + 5] << 8;
          case 5:
            k2 ^= bytes2[i + 4];
            k2 = _x86Multiply(k2, c2);
            k2 = _x86Rotl(k2, 16);
            k2 = _x86Multiply(k2, c3);
            h2 ^= k2;
          case 4:
            k1 ^= bytes2[i + 3] << 24;
          case 3:
            k1 ^= bytes2[i + 2] << 16;
          case 2:
            k1 ^= bytes2[i + 1] << 8;
          case 1:
            k1 ^= bytes2[i];
            k1 = _x86Multiply(k1, c1);
            k1 = _x86Rotl(k1, 15);
            k1 = _x86Multiply(k1, c2);
            h1 ^= k1;
        }
        h1 ^= bytes2.length;
        h2 ^= bytes2.length;
        h3 ^= bytes2.length;
        h4 ^= bytes2.length;
        h1 += h2;
        h1 += h3;
        h1 += h4;
        h2 += h1;
        h3 += h1;
        h4 += h1;
        h1 = _x86Fmix(h1);
        h2 = _x86Fmix(h2);
        h3 = _x86Fmix(h3);
        h4 = _x86Fmix(h4);
        h1 += h2;
        h1 += h3;
        h1 += h4;
        h2 += h1;
        h3 += h1;
        h4 += h1;
        return ("00000000" + (h1 >>> 0).toString(16)).slice(-8) + ("00000000" + (h2 >>> 0).toString(16)).slice(-8) + ("00000000" + (h3 >>> 0).toString(16)).slice(-8) + ("00000000" + (h4 >>> 0).toString(16)).slice(-8);
      };
      library.x64.hash128 = function(bytes2, seed) {
        if (library.inputValidation && !_validBytes(bytes2)) {
          return undefined2;
        }
        seed = seed || 0;
        var remainder = bytes2.length % 16;
        var blocks = bytes2.length - remainder;
        var h1 = [0, seed];
        var h2 = [0, seed];
        var k1 = [0, 0];
        var k2 = [0, 0];
        var c1 = [2277735313, 289559509];
        var c2 = [1291169091, 658871167];
        for (var i = 0; i < blocks; i = i + 16) {
          k1 = [bytes2[i + 4] | bytes2[i + 5] << 8 | bytes2[i + 6] << 16 | bytes2[i + 7] << 24, bytes2[i] | bytes2[i + 1] << 8 | bytes2[i + 2] << 16 | bytes2[i + 3] << 24];
          k2 = [bytes2[i + 12] | bytes2[i + 13] << 8 | bytes2[i + 14] << 16 | bytes2[i + 15] << 24, bytes2[i + 8] | bytes2[i + 9] << 8 | bytes2[i + 10] << 16 | bytes2[i + 11] << 24];
          k1 = _x64Multiply(k1, c1);
          k1 = _x64Rotl(k1, 31);
          k1 = _x64Multiply(k1, c2);
          h1 = _x64Xor(h1, k1);
          h1 = _x64Rotl(h1, 27);
          h1 = _x64Add(h1, h2);
          h1 = _x64Add(_x64Multiply(h1, [0, 5]), [0, 1390208809]);
          k2 = _x64Multiply(k2, c2);
          k2 = _x64Rotl(k2, 33);
          k2 = _x64Multiply(k2, c1);
          h2 = _x64Xor(h2, k2);
          h2 = _x64Rotl(h2, 31);
          h2 = _x64Add(h2, h1);
          h2 = _x64Add(_x64Multiply(h2, [0, 5]), [0, 944331445]);
        }
        k1 = [0, 0];
        k2 = [0, 0];
        switch (remainder) {
          case 15:
            k2 = _x64Xor(k2, _x64LeftShift([0, bytes2[i + 14]], 48));
          case 14:
            k2 = _x64Xor(k2, _x64LeftShift([0, bytes2[i + 13]], 40));
          case 13:
            k2 = _x64Xor(k2, _x64LeftShift([0, bytes2[i + 12]], 32));
          case 12:
            k2 = _x64Xor(k2, _x64LeftShift([0, bytes2[i + 11]], 24));
          case 11:
            k2 = _x64Xor(k2, _x64LeftShift([0, bytes2[i + 10]], 16));
          case 10:
            k2 = _x64Xor(k2, _x64LeftShift([0, bytes2[i + 9]], 8));
          case 9:
            k2 = _x64Xor(k2, [0, bytes2[i + 8]]);
            k2 = _x64Multiply(k2, c2);
            k2 = _x64Rotl(k2, 33);
            k2 = _x64Multiply(k2, c1);
            h2 = _x64Xor(h2, k2);
          case 8:
            k1 = _x64Xor(k1, _x64LeftShift([0, bytes2[i + 7]], 56));
          case 7:
            k1 = _x64Xor(k1, _x64LeftShift([0, bytes2[i + 6]], 48));
          case 6:
            k1 = _x64Xor(k1, _x64LeftShift([0, bytes2[i + 5]], 40));
          case 5:
            k1 = _x64Xor(k1, _x64LeftShift([0, bytes2[i + 4]], 32));
          case 4:
            k1 = _x64Xor(k1, _x64LeftShift([0, bytes2[i + 3]], 24));
          case 3:
            k1 = _x64Xor(k1, _x64LeftShift([0, bytes2[i + 2]], 16));
          case 2:
            k1 = _x64Xor(k1, _x64LeftShift([0, bytes2[i + 1]], 8));
          case 1:
            k1 = _x64Xor(k1, [0, bytes2[i]]);
            k1 = _x64Multiply(k1, c1);
            k1 = _x64Rotl(k1, 31);
            k1 = _x64Multiply(k1, c2);
            h1 = _x64Xor(h1, k1);
        }
        h1 = _x64Xor(h1, [0, bytes2.length]);
        h2 = _x64Xor(h2, [0, bytes2.length]);
        h1 = _x64Add(h1, h2);
        h2 = _x64Add(h2, h1);
        h1 = _x64Fmix(h1);
        h2 = _x64Fmix(h2);
        h1 = _x64Add(h1, h2);
        h2 = _x64Add(h2, h1);
        return ("00000000" + (h1[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h1[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[1] >>> 0).toString(16)).slice(-8);
      };
      if (typeof exports !== "undefined") {
        if (typeof module !== "undefined" && module.exports) {
          exports = module.exports = library;
        }
        exports.murmurHash3 = library;
      } else if (typeof define === "function" && define.amd) {
        define([], function() {
          return library;
        });
      } else {
        library._murmurHash3 = root.murmurHash3;
        library.noConflict = function() {
          root.murmurHash3 = library._murmurHash3;
          library._murmurHash3 = undefined2;
          library.noConflict = undefined2;
          return library;
        };
        root.murmurHash3 = library;
      }
    })(exports);
  }
});

// node_modules/murmurhash3js-revisited/index.js
var require_murmurhash3js_revisited = __commonJS({
  "node_modules/murmurhash3js-revisited/index.js"(exports, module) {
    module.exports = require_murmurHash3js();
  }
});

// node_modules/p-queue/node_modules/eventemitter3/index.js
var require_eventemitter3 = __commonJS({
  "node_modules/p-queue/node_modules/eventemitter3/index.js"(exports, module) {
    "use strict";
    var has = Object.prototype.hasOwnProperty;
    var prefix = "~";
    function Events() {
    }
    __name(Events, "Events");
    if (Object.create) {
      Events.prototype = /* @__PURE__ */ Object.create(null);
      if (!new Events().__proto__) prefix = false;
    }
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }
    __name(EE, "EE");
    function addListener(emitter, event, fn, context, once) {
      if (typeof fn !== "function") {
        throw new TypeError("The listener must be a function");
      }
      var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
      if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
      else emitter._events[evt] = [emitter._events[evt], listener];
      return emitter;
    }
    __name(addListener, "addListener");
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0) emitter._events = new Events();
      else delete emitter._events[evt];
    }
    __name(clearEvent, "clearEvent");
    function EventEmitter2() {
      this._events = new Events();
      this._eventsCount = 0;
    }
    __name(EventEmitter2, "EventEmitter");
    EventEmitter2.prototype.eventNames = /* @__PURE__ */ __name(function eventNames() {
      var names2 = [], events2, name3;
      if (this._eventsCount === 0) return names2;
      for (name3 in events2 = this._events) {
        if (has.call(events2, name3)) names2.push(prefix ? name3.slice(1) : name3);
      }
      if (Object.getOwnPropertySymbols) {
        return names2.concat(Object.getOwnPropertySymbols(events2));
      }
      return names2;
    }, "eventNames");
    EventEmitter2.prototype.listeners = /* @__PURE__ */ __name(function listeners(event) {
      var evt = prefix ? prefix + event : event, handlers = this._events[evt];
      if (!handlers) return [];
      if (handlers.fn) return [handlers.fn];
      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
      }
      return ee;
    }, "listeners");
    EventEmitter2.prototype.listenerCount = /* @__PURE__ */ __name(function listenerCount(event) {
      var evt = prefix ? prefix + event : event, listeners = this._events[evt];
      if (!listeners) return 0;
      if (listeners.fn) return 1;
      return listeners.length;
    }, "listenerCount");
    EventEmitter2.prototype.emit = /* @__PURE__ */ __name(function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt]) return false;
      var listeners = this._events[evt], len = arguments.length, args, i;
      if (listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
        switch (len) {
          case 1:
            return listeners.fn.call(listeners.context), true;
          case 2:
            return listeners.fn.call(listeners.context, a1), true;
          case 3:
            return listeners.fn.call(listeners.context, a1, a2), true;
          case 4:
            return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for (i = 1, args = new Array(len - 1); i < len; i++) {
          args[i - 1] = arguments[i];
        }
        listeners.fn.apply(listeners.context, args);
      } else {
        var length3 = listeners.length, j;
        for (i = 0; i < length3; i++) {
          if (listeners[i].once) this.removeListener(event, listeners[i].fn, void 0, true);
          switch (len) {
            case 1:
              listeners[i].fn.call(listeners[i].context);
              break;
            case 2:
              listeners[i].fn.call(listeners[i].context, a1);
              break;
            case 3:
              listeners[i].fn.call(listeners[i].context, a1, a2);
              break;
            case 4:
              listeners[i].fn.call(listeners[i].context, a1, a2, a3);
              break;
            default:
              if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
                args[j - 1] = arguments[j];
              }
              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }
      return true;
    }, "emit");
    EventEmitter2.prototype.on = /* @__PURE__ */ __name(function on(event, fn, context) {
      return addListener(this, event, fn, context, false);
    }, "on");
    EventEmitter2.prototype.once = /* @__PURE__ */ __name(function once(event, fn, context) {
      return addListener(this, event, fn, context, true);
    }, "once");
    EventEmitter2.prototype.removeListener = /* @__PURE__ */ __name(function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt]) return this;
      if (!fn) {
        clearEvent(this, evt);
        return this;
      }
      var listeners = this._events[evt];
      if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
          clearEvent(this, evt);
        }
      } else {
        for (var i = 0, events2 = [], length3 = listeners.length; i < length3; i++) {
          if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
            events2.push(listeners[i]);
          }
        }
        if (events2.length) this._events[evt] = events2.length === 1 ? events2[0] : events2;
        else clearEvent(this, evt);
      }
      return this;
    }, "removeListener");
    EventEmitter2.prototype.removeAllListeners = /* @__PURE__ */ __name(function removeAllListeners(event) {
      var evt;
      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt]) clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }
      return this;
    }, "removeAllListeners");
    EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
    EventEmitter2.prototype.addListener = EventEmitter2.prototype.on;
    EventEmitter2.prefixed = prefix;
    EventEmitter2.EventEmitter = EventEmitter2;
    if ("undefined" !== typeof module) {
      module.exports = EventEmitter2;
    }
  }
});

// node_modules/err-code/index.js
var require_err_code = __commonJS({
  "node_modules/err-code/index.js"(exports, module) {
    "use strict";
    function assign(obj, props) {
      for (const key in props) {
        Object.defineProperty(obj, key, {
          value: props[key],
          enumerable: true,
          configurable: true
        });
      }
      return obj;
    }
    __name(assign, "assign");
    function createError(err, code2, props) {
      if (!err || typeof err === "string") {
        throw new TypeError("Please pass an Error to err-code");
      }
      if (!props) {
        props = {};
      }
      if (typeof code2 === "object") {
        props = code2;
        code2 = "";
      }
      if (code2) {
        props.code = code2;
      }
      try {
        return assign(err, props);
      } catch (_) {
        props.message = err.message;
        props.stack = err.stack;
        const ErrClass = /* @__PURE__ */ __name(function() {
        }, "ErrClass");
        ErrClass.prototype = Object.create(Object.getPrototypeOf(err));
        const output2 = assign(new ErrClass(), props);
        return output2;
      }
    }
    __name(createError, "createError");
    module.exports = createError;
  }
});

// node_modules/netmask/lib/netmask.js
var require_netmask = __commonJS({
  "node_modules/netmask/lib/netmask.js"(exports) {
    (function() {
      var Netmask2, atob2, chr, chr0, chrA, chra, ip2long, long2ip;
      long2ip = /* @__PURE__ */ __name(function(long) {
        var a, b, c, d2;
        a = (long & 255 << 24) >>> 24;
        b = (long & 255 << 16) >>> 16;
        c = (long & 255 << 8) >>> 8;
        d2 = long & 255;
        return [a, b, c, d2].join(".");
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
          ref = atob2(ip), n = ref[0], c = ref[1];
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
      atob2 = /* @__PURE__ */ __name(function(s2) {
        var base3, dmax, i, n, start;
        n = 0;
        base3 = 10;
        dmax = "9";
        i = 0;
        if (s2.length > 1 && s2[i] === "0") {
          if (s2[i + 1] === "x" || s2[i + 1] === "X") {
            i += 2;
            base3 = 16;
          } else if ("0" <= s2[i + 1] && s2[i + 1] <= "9") {
            i++;
            base3 = 8;
            dmax = "7";
          }
        }
        start = i;
        while (i < s2.length) {
          if ("0" <= s2[i] && s2[i] <= dmax) {
            n = n * base3 + (chr(s2[i]) - chr0) >>> 0;
          } else if (base3 === 16) {
            if ("a" <= s2[i] && s2[i] <= "f") {
              n = n * base3 + (10 + chr(s2[i]) - chra) >>> 0;
            } else if ("A" <= s2[i] && s2[i] <= "F") {
              n = n * base3 + (10 + chr(s2[i]) - chrA) >>> 0;
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
      Netmask2 = function() {
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
      }();
      exports.ip2long = ip2long;
      exports.long2ip = long2ip;
      exports.Netmask = Netmask2;
    }).call(exports);
  }
});

// node_modules/hashlru/index.js
var require_hashlru = __commonJS({
  "node_modules/hashlru/index.js"(exports, module) {
    module.exports = function(max) {
      if (!max) throw Error("hashlru must have a max value, of type number, greater than 0");
      var size = 0, cache3 = /* @__PURE__ */ Object.create(null), _cache = /* @__PURE__ */ Object.create(null);
      function update(key, value) {
        cache3[key] = value;
        size++;
        if (size >= max) {
          size = 0;
          _cache = cache3;
          cache3 = /* @__PURE__ */ Object.create(null);
        }
      }
      __name(update, "update");
      return {
        has: /* @__PURE__ */ __name(function(key) {
          return cache3[key] !== void 0 || _cache[key] !== void 0;
        }, "has"),
        remove: /* @__PURE__ */ __name(function(key) {
          if (cache3[key] !== void 0)
            cache3[key] = void 0;
          if (_cache[key] !== void 0)
            _cache[key] = void 0;
        }, "remove"),
        get: /* @__PURE__ */ __name(function(key) {
          var v = cache3[key];
          if (v !== void 0) return v;
          if ((v = _cache[key]) !== void 0) {
            update(key, v);
            return v;
          }
        }, "get"),
        set: /* @__PURE__ */ __name(function(key, value) {
          if (cache3[key] !== void 0) cache3[key] = value;
          else update(key, value);
        }, "set"),
        clear: /* @__PURE__ */ __name(function() {
          cache3 = /* @__PURE__ */ Object.create(null);
          _cache = /* @__PURE__ */ Object.create(null);
        }, "clear")
      };
    };
  }
});

// node_modules/is-plain-obj/index.js
var require_is_plain_obj = __commonJS({
  "node_modules/is-plain-obj/index.js"(exports, module) {
    "use strict";
    module.exports = (value) => {
      if (Object.prototype.toString.call(value) !== "[object Object]") {
        return false;
      }
      const prototype = Object.getPrototypeOf(value);
      return prototype === null || prototype === Object.prototype;
    };
  }
});

// node_modules/merge-options/index.js
var require_merge_options = __commonJS({
  "node_modules/merge-options/index.js"(exports, module) {
    "use strict";
    var isOptionObject = require_is_plain_obj();
    var { hasOwnProperty } = Object.prototype;
    var { propertyIsEnumerable } = Object;
    var defineProperty = /* @__PURE__ */ __name((object, name3, value) => Object.defineProperty(object, name3, {
      value,
      writable: true,
      enumerable: true,
      configurable: true
    }), "defineProperty");
    var globalThis2 = exports;
    var defaultMergeOptions = {
      concatArrays: false,
      ignoreUndefined: false
    };
    var getEnumerableOwnPropertyKeys = /* @__PURE__ */ __name((value) => {
      const keys = [];
      for (const key in value) {
        if (hasOwnProperty.call(value, key)) {
          keys.push(key);
        }
      }
      if (Object.getOwnPropertySymbols) {
        const symbols = Object.getOwnPropertySymbols(value);
        for (const symbol3 of symbols) {
          if (propertyIsEnumerable.call(value, symbol3)) {
            keys.push(symbol3);
          }
        }
      }
      return keys;
    }, "getEnumerableOwnPropertyKeys");
    function clone(value) {
      if (Array.isArray(value)) {
        return cloneArray(value);
      }
      if (isOptionObject(value)) {
        return cloneOptionObject(value);
      }
      return value;
    }
    __name(clone, "clone");
    function cloneArray(array) {
      const result = array.slice(0, 0);
      getEnumerableOwnPropertyKeys(array).forEach((key) => {
        defineProperty(result, key, clone(array[key]));
      });
      return result;
    }
    __name(cloneArray, "cloneArray");
    function cloneOptionObject(object) {
      const result = Object.getPrototypeOf(object) === null ? /* @__PURE__ */ Object.create(null) : {};
      getEnumerableOwnPropertyKeys(object).forEach((key) => {
        defineProperty(result, key, clone(object[key]));
      });
      return result;
    }
    __name(cloneOptionObject, "cloneOptionObject");
    var mergeKeys = /* @__PURE__ */ __name((merged, source, keys, config) => {
      keys.forEach((key) => {
        if (typeof source[key] === "undefined" && config.ignoreUndefined) {
          return;
        }
        if (key in merged && merged[key] !== Object.getPrototypeOf(merged)) {
          defineProperty(merged, key, merge2(merged[key], source[key], config));
        } else {
          defineProperty(merged, key, clone(source[key]));
        }
      });
      return merged;
    }, "mergeKeys");
    var concatArrays = /* @__PURE__ */ __name((merged, source, config) => {
      let result = merged.slice(0, 0);
      let resultIndex = 0;
      [merged, source].forEach((array) => {
        const indices = [];
        for (let k = 0; k < array.length; k++) {
          if (!hasOwnProperty.call(array, k)) {
            continue;
          }
          indices.push(String(k));
          if (array === merged) {
            defineProperty(result, resultIndex++, array[k]);
          } else {
            defineProperty(result, resultIndex++, clone(array[k]));
          }
        }
        result = mergeKeys(result, array, getEnumerableOwnPropertyKeys(array).filter((key) => !indices.includes(key)), config);
      });
      return result;
    }, "concatArrays");
    function merge2(merged, source, config) {
      if (config.concatArrays && Array.isArray(merged) && Array.isArray(source)) {
        return concatArrays(merged, source, config);
      }
      if (!isOptionObject(source) || !isOptionObject(merged)) {
        return clone(source);
      }
      return mergeKeys(merged, source, getEnumerableOwnPropertyKeys(source), config);
    }
    __name(merge2, "merge");
    module.exports = function(...options) {
      const config = merge2(clone(defaultMergeOptions), this !== globalThis2 && this || {}, defaultMergeOptions);
      let merged = { _: {} };
      for (const option of options) {
        if (option === void 0) {
          continue;
        }
        if (!isOptionObject(option)) {
          throw new TypeError("`" + option + "` is not an Option Object");
        }
        merged = merge2(merged, { _: option }, config);
      }
      return merged._;
    };
  }
});

// node_modules/@libp2p/interface/dist/src/connection/index.js
var connectionSymbol = Symbol.for("@libp2p/connection");

// node_modules/@libp2p/interface/dist/src/content-routing/index.js
var contentRoutingSymbol = Symbol.for("@libp2p/content-routing");

// node_modules/@libp2p/interface/dist/src/peer-discovery/index.js
var peerDiscoverySymbol = Symbol.for("@libp2p/peer-discovery");

// node_modules/@libp2p/interface/dist/src/peer-id/index.js
var peerIdSymbol = Symbol.for("@libp2p/peer-id");
function isPeerId(other) {
  return other != null && Boolean(other[peerIdSymbol]);
}
__name(isPeerId, "isPeerId");

// node_modules/@libp2p/interface/dist/src/peer-routing/index.js
var peerRoutingSymbol = Symbol.for("@libp2p/peer-routing");

// node_modules/@libp2p/interface/dist/src/peer-store/tags.js
var KEEP_ALIVE = "keep-alive";

// node_modules/@libp2p/interface/dist/src/transport/index.js
var transportSymbol = Symbol.for("@libp2p/transport");
var FaultTolerance;
(function(FaultTolerance2) {
  FaultTolerance2[FaultTolerance2["FATAL_ALL"] = 0] = "FATAL_ALL";
  FaultTolerance2[FaultTolerance2["NO_FATAL"] = 1] = "NO_FATAL";
})(FaultTolerance || (FaultTolerance = {}));

// node_modules/@libp2p/interface/dist/src/errors.js
var AbortError = class _AbortError extends Error {
  static {
    __name(this, "AbortError");
  }
  code;
  type;
  constructor(message2 = "The operation was aborted") {
    super(message2);
    this.name = "AbortError";
    this.code = _AbortError.code;
    this.type = _AbortError.type;
  }
  static code = "ABORT_ERR";
  static type = "aborted";
};
var CodeError = class extends Error {
  static {
    __name(this, "CodeError");
  }
  code;
  props;
  constructor(message2, code2, props) {
    super(message2);
    this.code = code2;
    this.name = props?.name ?? "CodeError";
    this.props = props ?? {};
  }
};
var AggregateCodeError = class extends AggregateError {
  static {
    __name(this, "AggregateCodeError");
  }
  code;
  props;
  constructor(errors, message2, code2, props) {
    super(errors, message2);
    this.code = code2;
    this.name = props?.name ?? "AggregateCodeError";
    this.props = props ?? {};
  }
};
var ERR_TIMEOUT = "ERR_TIMEOUT";

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
var CustomEvent = globalThis.CustomEvent;

// node_modules/@libp2p/interface/dist/src/startable.js
function isStartable(obj) {
  return obj != null && typeof obj.start === "function" && typeof obj.stop === "function";
}
__name(isStartable, "isStartable");

// node_modules/@libp2p/interface/dist/src/index.js
var serviceCapabilities = Symbol.for("@libp2p/service-capabilities");
var serviceDependencies = Symbol.for("@libp2p/service-dependencies");

// node_modules/libp2p/node_modules/@libp2p/crypto/dist/src/keys/ed25519-class.js
var ed25519_class_exports = {};
__export(ed25519_class_exports, {
  Ed25519PrivateKey: () => Ed25519PrivateKey,
  Ed25519PublicKey: () => Ed25519PublicKey,
  generateKeyPair: () => generateKeyPair,
  generateKeyPairFromSeed: () => generateKeyPairFromSeed,
  unmarshalEd25519PrivateKey: () => unmarshalEd25519PrivateKey,
  unmarshalEd25519PublicKey: () => unmarshalEd25519PublicKey
});

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
function base(ALPHABET, name3) {
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
  function decode8(string3) {
    var buffer = decodeUnsafe(string3);
    if (buffer) {
      return buffer;
    }
    throw new Error(`Non-${name3} character`);
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
  constructor(name3, prefix, baseEncode) {
    this.name = name3;
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
  constructor(name3, prefix, baseDecode) {
    this.name = name3;
    this.prefix = prefix;
    if (prefix.codePointAt(0) === void 0) {
      throw new Error("Invalid prefix character");
    }
    this.prefixCodePoint = prefix.codePointAt(0);
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
  constructor(name3, prefix, baseEncode, baseDecode) {
    this.name = name3;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
    this.baseDecode = baseDecode;
    this.encoder = new Encoder(name3, prefix, baseEncode);
    this.decoder = new Decoder(name3, prefix, baseDecode);
  }
  encode(input) {
    return this.encoder.encode(input);
  }
  decode(input) {
    return this.decoder.decode(input);
  }
};
function from({ name: name3, prefix, encode: encode7, decode: decode8 }) {
  return new Codec(name3, prefix, encode7, decode8);
}
__name(from, "from");
function baseX({ name: name3, prefix, alphabet: alphabet2 }) {
  const { encode: encode7, decode: decode8 } = base_x_default(alphabet2, name3);
  return from({
    prefix,
    name: name3,
    encode: encode7,
    decode: /* @__PURE__ */ __name((text) => coerce(decode8(text)), "decode")
  });
}
__name(baseX, "baseX");
function decode(string3, alphabet2, bitsPerChar, name3) {
  const codes5 = {};
  for (let i = 0; i < alphabet2.length; ++i) {
    codes5[alphabet2[i]] = i;
  }
  let end = string3.length;
  while (string3[end - 1] === "=") {
    --end;
  }
  const out = new Uint8Array(end * bitsPerChar / 8 | 0);
  let bits = 0;
  let buffer = 0;
  let written = 0;
  for (let i = 0; i < end; ++i) {
    const value = codes5[string3[i]];
    if (value === void 0) {
      throw new SyntaxError(`Non-${name3} character`);
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
function rfc4648({ name: name3, prefix, bitsPerChar, alphabet: alphabet2 }) {
  return from({
    prefix,
    name: name3,
    encode(input) {
      return encode(input, alphabet2, bitsPerChar);
    },
    decode(input) {
      return decode(input, alphabet2, bitsPerChar, name3);
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

// node_modules/multiformats/dist/src/hashes/identity.js
var identity_exports = {};
__export(identity_exports, {
  identity: () => identity
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

// node_modules/multiformats/dist/src/hashes/identity.js
var code = 0;
var name = "identity";
var encode3 = coerce;
function digest(input) {
  return create(code, encode3(input));
}
__name(digest, "digest");
var identity = { code, name, encode: encode3, digest };

// node_modules/multiformats/dist/src/hashes/sha2-browser.js
var sha2_browser_exports = {};
__export(sha2_browser_exports, {
  sha256: () => sha256,
  sha512: () => sha512
});

// node_modules/multiformats/dist/src/hashes/hasher.js
function from2({ name: name3, code: code2, encode: encode7 }) {
  return new Hasher(name3, code2, encode7);
}
__name(from2, "from");
var Hasher = class {
  static {
    __name(this, "Hasher");
  }
  name;
  code;
  encode;
  constructor(name3, code2, encode7) {
    this.name = name3;
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
function sha(name3) {
  return async (data) => new Uint8Array(await crypto.subtle.digest(name3, data));
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
  const output2 = allocUnsafe(length3);
  let offset = 0;
  for (const arr of arrays) {
    output2.set(arr, offset);
    offset += arr.length;
  }
  return asUint8Array(output2);
}
__name(concat, "concat");

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
  p[c.codePointAt(0)] = i;
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
    const byt = alphabetCharsToBytes[char.codePointAt(0)];
    if (byt === void 0) {
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

// node_modules/multiformats/dist/src/cid.js
function format(link, base3) {
  const { bytes: bytes2, version: version2 } = link;
  switch (version2) {
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
  constructor(version2, code2, multihash, bytes2) {
    this.code = code2;
    this.version = version2;
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
      const { version: version2, code: code2, multihash, bytes: bytes2 } = value;
      return new _CID(version2, code2, multihash, bytes2 ?? encodeCID(version2, code2, multihash.bytes));
    } else if (value[cidSymbol] === true) {
      const { version: version2, multihash, code: code2 } = value;
      const digest2 = decode4(multihash);
      return _CID.create(version2, code2, digest2);
    } else {
      return null;
    }
  }
  /**
   * @param version - Version of the CID
   * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
   * @param digest - (Multi)hash of the of the content.
   */
  static create(version2, code2, digest2) {
    if (typeof code2 !== "number") {
      throw new Error("String codecs are no longer supported");
    }
    if (!(digest2.bytes instanceof Uint8Array)) {
      throw new Error("Invalid digest");
    }
    switch (version2) {
      case 0: {
        if (code2 !== DAG_PB_CODE) {
          throw new Error(`Version 0 CID must use dag-pb (code: ${DAG_PB_CODE}) block encoding`);
        } else {
          return new _CID(version2, code2, digest2, digest2.bytes);
        }
      }
      case 1: {
        const bytes2 = encodeCID(version2, code2, digest2.bytes);
        return new _CID(version2, code2, digest2, bytes2);
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
    let version2 = next();
    let codec = DAG_PB_CODE;
    if (version2 === 18) {
      version2 = 0;
      offset = 0;
    } else {
      codec = next();
    }
    if (version2 !== 0 && version2 !== 1) {
      throw new RangeError(`Invalid CID version ${version2}`);
    }
    const prefixSize = offset;
    const multihashCode = next();
    const digestSize = next();
    const size = offset + digestSize;
    const multihashSize = size - prefixSize;
    return { version: version2, codec, multihashCode, digestSize, multihashSize, size };
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
function toStringV0(bytes2, cache3, base3) {
  const { prefix } = base3;
  if (prefix !== base58btc.prefix) {
    throw Error(`Cannot string encode V0 in ${base3.name} encoding`);
  }
  const cid = cache3.get(prefix);
  if (cid == null) {
    const cid2 = base3.encode(bytes2).slice(1);
    cache3.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
__name(toStringV0, "toStringV0");
function toStringV1(bytes2, cache3, base3) {
  const { prefix } = base3;
  const cid = cache3.get(prefix);
  if (cid == null) {
    const cid2 = base3.encode(bytes2);
    cache3.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
__name(toStringV1, "toStringV1");
var DAG_PB_CODE = 112;
var SHA_256_CODE = 18;
function encodeCID(version2, code2, multihash) {
  const codeOffset = encodingLength(version2);
  const hashOffset = codeOffset + encodingLength(code2);
  const bytes2 = new Uint8Array(hashOffset + multihash.byteLength);
  encodeTo(version2, bytes2, 0);
  encodeTo(code2, bytes2, codeOffset);
  bytes2.set(multihash, hashOffset);
  return bytes2;
}
__name(encodeCID, "encodeCID");
var cidSymbol = Symbol.for("@ipld/js-cid/CID");

// node_modules/multiformats/dist/src/basics.js
var bases = { ...identity_exports2, ...base2_exports, ...base8_exports, ...base10_exports, ...base16_exports, ...base32_exports, ...base36_exports, ...base58_exports, ...base64_exports, ...base256emoji_exports };
var hashes = { ...sha2_browser_exports, ...identity_exports };

// node_modules/uint8arrays/dist/src/util/bases.js
function createCodec(name3, prefix, encode7, decode8) {
  return {
    name: name3,
    prefix,
    encoder: {
      name: name3,
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
  let string3 = "a";
  for (let i = 0; i < buf.length; i++) {
    string3 += String.fromCharCode(buf[i]);
  }
  return string3;
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
function fromString2(string3, encoding = "utf8") {
  const base3 = bases_default[encoding];
  if (base3 == null) {
    throw new Error(`Unsupported encoding "${encoding}"`);
  }
  return base3.decoder.decode(`${base3.prefix}${string3}`);
}
__name(fromString2, "fromString");

// node_modules/libp2p/node_modules/@libp2p/crypto/dist/src/util.js
function isPromise(thing) {
  if (thing == null) {
    return false;
  }
  return typeof thing.then === "function" && typeof thing.catch === "function" && typeof thing.finally === "function";
}
__name(isPromise, "isPromise");

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
function hash(h2) {
  if (typeof h2 !== "function" || typeof h2.create !== "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  number(h2.outputLen);
  number(h2.blockLen);
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
var nextTick = /* @__PURE__ */ __name(async () => {
}, "nextTick");
async function asyncLoop(iters, tick, cb) {
  let ts = Date.now();
  for (let i = 0; i < iters; i++) {
    cb(i);
    const diff = Date.now() - ts;
    if (diff >= 0 && diff < tick)
      continue;
    await nextTick();
    ts += diff;
  }
}
__name(asyncLoop, "asyncLoop");
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
function checkOpts(defaults, opts) {
  if (opts !== void 0 && toStr.call(opts) !== "[object Object]")
    throw new Error("Options should be object or undefined");
  const merged = Object.assign(defaults, opts);
  return merged;
}
__name(checkOpts, "checkOpts");
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
  const h2 = isLE2 ? 4 : 0;
  const l = isLE2 ? 0 : 4;
  view.setUint32(byteOffset + h2, wh, isLE2);
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
      const take2 = Math.min(blockLen - this.pos, len - pos);
      if (take2 === blockLen) {
        const dataView = createView(data);
        for (; blockLen <= len - pos; pos += blockLen)
          this.process(dataView, pos);
        continue;
      }
      buffer.set(data.subarray(pos, pos + take2), this.pos);
      this.pos += take2;
      pos += take2;
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
    const { h: h2, l } = fromBig(lst[i], le);
    [Ah[i], Al[i]] = [h2, l];
  }
  return [Ah, Al];
}
__name(split, "split");
var toBig = /* @__PURE__ */ __name((h2, l) => BigInt(h2 >>> 0) << _32n | BigInt(l >>> 0), "toBig");
var shrSH = /* @__PURE__ */ __name((h2, _l, s2) => h2 >>> s2, "shrSH");
var shrSL = /* @__PURE__ */ __name((h2, l, s2) => h2 << 32 - s2 | l >>> s2, "shrSL");
var rotrSH = /* @__PURE__ */ __name((h2, l, s2) => h2 >>> s2 | l << 32 - s2, "rotrSH");
var rotrSL = /* @__PURE__ */ __name((h2, l, s2) => h2 << 32 - s2 | l >>> s2, "rotrSL");
var rotrBH = /* @__PURE__ */ __name((h2, l, s2) => h2 << 64 - s2 | l >>> s2 - 32, "rotrBH");
var rotrBL = /* @__PURE__ */ __name((h2, l, s2) => h2 >>> s2 - 32 | l << 64 - s2, "rotrBL");
var rotr32H = /* @__PURE__ */ __name((_h, l) => l, "rotr32H");
var rotr32L = /* @__PURE__ */ __name((h2, _l) => h2, "rotr32L");
var rotlSH = /* @__PURE__ */ __name((h2, l, s2) => h2 << s2 | l >>> 32 - s2, "rotlSH");
var rotlSL = /* @__PURE__ */ __name((h2, l, s2) => l << s2 | h2 >>> 32 - s2, "rotlSL");
var rotlBH = /* @__PURE__ */ __name((h2, l, s2) => l << s2 - 32 | h2 >>> 64 - s2, "rotlBH");
var rotlBL = /* @__PURE__ */ __name((h2, l, s2) => h2 << s2 - 32 | l >>> 64 - s2, "rotlBL");
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
var sha5122 = /* @__PURE__ */ wrapConstructor(() => new SHA512());

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
  const h2 = /* @__PURE__ */ __name((...b) => hmacFn(k, v, ...b), "h");
  const reseed = /* @__PURE__ */ __name((seed = u8n()) => {
    k = h2(u8fr([0]), seed);
    v = h2();
    if (seed.length === 0)
      return;
    k = h2(u8fr([1]), seed);
    v = h2();
  }, "reseed");
  const gen = /* @__PURE__ */ __name(() => {
    if (i++ >= 1e3)
      throw new Error("drbg: tried 1000 values");
    let len = 0;
    const out = [];
    while (len < qByteLen) {
      v = h2();
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
function invert(number3, modulo) {
  if (number3 === _0n2 || modulo <= _0n2) {
    throw new Error(`invert: expected positive integers, got n=${number3} mod=${modulo}`);
  }
  let a = mod(number3, modulo);
  let b = modulo;
  let x = _0n2, y2 = _1n2, u = _1n2, v = _0n2;
  while (a !== _0n2) {
    const q = b / a;
    const r = b % a;
    const m2 = x - u * q;
    const n = y2 - v * q;
    b = a, a = r, x = u, y2 = v, u = m2, v = n;
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
      let m2 = 1;
      for (let t2 = Fp3.sqr(b); m2 < r; m2++) {
        if (Fp3.eql(t2, Fp3.ONE))
          break;
        t2 = Fp3.sqr(t2);
      }
      const ge = Fp3.pow(g, _1n2 << BigInt(r - m2 - 1));
      g = Fp3.sqr(ge);
      x = Fp3.mul(x, ge);
      b = Fp3.mul(b, g);
      r = m2;
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
  let d2 = num;
  while (power > _0n2) {
    if (power & _1n2)
      p = f.mul(p, d2);
    d2 = f.sqr(d2);
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
      let d2 = elm;
      while (n > _0n3) {
        if (n & _1n3)
          p = p.add(d2);
        d2 = d2.double();
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
      for (let window2 = 0; window2 < windows; window2++) {
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
      for (let window2 = 0; window2 < windows; window2++) {
        const offset = window2 * windowSize;
        let wbits = Number(n & mask);
        n >>= shiftBy;
        if (wbits > windowSize) {
          wbits -= maxNumber;
          n += _1n3;
        }
        const offset1 = offset;
        const offset2 = offset + Math.abs(wbits) - 1;
        const cond1 = window2 % 2 !== 0;
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
  scalars.forEach((s2, i) => {
    if (!field.isValid(s2))
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
  const { Fp: Fp3, n: CURVE_ORDER, prehash, hash: cHash, randomBytes: randomBytes5, nByteLength, h: cofactor } = CURVE;
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
    const { ex: x, ey: y2, ez: z } = p;
    const is0 = p.is0();
    if (iz == null)
      iz = is0 ? _8n2 : Fp3.inv(z);
    const ax = modP(x * iz);
    const ay = modP(y2 * iz);
    const zz = modP(z * iz);
    if (is0)
      return { x: _0n4, y: _1n4 };
    if (zz !== _1n4)
      throw new Error("invZ was invalid");
    return { x: ax, y: ay };
  });
  const assertValidMemo = memoized((p) => {
    const { a, d: d2 } = CURVE;
    if (p.is0())
      throw new Error("bad point: ZERO");
    const { ex: X, ey: Y, ez: Z, et: T } = p;
    const X2 = modP(X * X);
    const Y2 = modP(Y * Y);
    const Z2 = modP(Z * Z);
    const Z4 = modP(Z2 * Z2);
    const aX2 = modP(X2 * a);
    const left = modP(Z2 * modP(aX2 + Y2));
    const right = modP(Z4 + modP(d2 * modP(X2 * Y2)));
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
      const { x, y: y2 } = p || {};
      aCoordinate("x", x);
      aCoordinate("y", y2);
      return new Point2(x, y2, _1n4, modP(x * y2));
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
      const { a, d: d2 } = CURVE;
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
      const C = modP(T1 * d2 * T2);
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
      const { d: d2, a } = CURVE;
      const len = Fp3.BYTES;
      hex = ensureBytes("pointHex", hex, len);
      abool("zip215", zip215);
      const normed = hex.slice();
      const lastByte = hex[len - 1];
      normed[len - 1] = lastByte & ~128;
      const y2 = bytesToNumberLE(normed);
      const max = zip215 ? MASK : Fp3.ORDER;
      aInRange("pointHex.y", y2, _0n4, max);
      const y22 = modP(y2 * y2);
      const u = modP(y22 - _1n4);
      const v = modP(d2 * y22 - a);
      let { isValid, value: x } = uvRatio2(u, v);
      if (!isValid)
        throw new Error("Point.fromHex: invalid y coordinate");
      const isXOdd = (x & _1n4) === _1n4;
      const isLastByteOdd = (lastByte & 128) !== 0;
      if (!zip215 && x === _0n4 && isLastByteOdd)
        throw new Error("Point.fromHex: x=0 and x_0=1");
      if (isLastByteOdd !== isXOdd)
        x = modP(-x);
      return Point2.fromAffine({ x, y: y2 });
    }
    static fromPrivateKey(privKey) {
      return getExtendedPublicKey(privKey).point;
    }
    toRawBytes() {
      const { x, y: y2 } = this.toAffine();
      const bytes2 = numberToBytesLE(y2, Fp3.BYTES);
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
    const s2 = modN(r + k * scalar);
    aInRange("signature.s", s2, _0n4, CURVE_ORDER);
    const res = concatBytes2(R, numberToBytesLE(s2, Fp3.BYTES));
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
    const s2 = bytesToNumberLE(sig.slice(len, 2 * len));
    let A, R, SB;
    try {
      A = Point2.fromHex(publicKey, zip215);
      R = Point2.fromHex(sig.slice(0, len), zip215);
      SB = G.multiplyUnsafe(s2);
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
    randomPrivateKey: /* @__PURE__ */ __name(() => randomBytes5(Fp3.BYTES), "randomPrivateKey"),
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
  hash: sha5122,
  randomBytes,
  adjustScalarBytes,
  // dom2
  // Ratio of u to v. Allows us to combine inversion and square root. Uses algo from RFC8032 5.1.3.
  // Constant-time, u/√v
  uvRatio
}))();
var ed25519 = /* @__PURE__ */ (() => twistedEdwards(ed25519Defaults))();

// node_modules/libp2p/node_modules/@libp2p/crypto/dist/src/keys/ed25519-browser.js
var PUBLIC_KEY_BYTE_LENGTH = 32;
var PRIVATE_KEY_BYTE_LENGTH = 64;
var KEYS_BYTE_LENGTH = 32;
function generateKey() {
  const privateKeyRaw = ed25519.utils.randomPrivateKey();
  const publicKey = ed25519.getPublicKey(privateKeyRaw);
  const privateKey = concatKeys(privateKeyRaw, publicKey);
  return {
    privateKey,
    publicKey
  };
}
__name(generateKey, "generateKey");
function generateKeyFromSeed(seed) {
  if (seed.length !== KEYS_BYTE_LENGTH) {
    throw new TypeError('"seed" must be 32 bytes in length.');
  } else if (!(seed instanceof Uint8Array)) {
    throw new TypeError('"seed" must be a node.js Buffer, or Uint8Array.');
  }
  const privateKeyRaw = seed;
  const publicKey = ed25519.getPublicKey(privateKeyRaw);
  const privateKey = concatKeys(privateKeyRaw, publicKey);
  return {
    privateKey,
    publicKey
  };
}
__name(generateKeyFromSeed, "generateKeyFromSeed");
function hashAndSign(privateKey, msg) {
  const privateKeyRaw = privateKey.subarray(0, KEYS_BYTE_LENGTH);
  return ed25519.sign(msg instanceof Uint8Array ? msg : msg.subarray(), privateKeyRaw);
}
__name(hashAndSign, "hashAndSign");
function hashAndVerify(publicKey, sig, msg) {
  return ed25519.verify(sig, msg instanceof Uint8Array ? msg : msg.subarray(), publicKey);
}
__name(hashAndVerify, "hashAndVerify");
function concatKeys(privateKeyRaw, publicKey) {
  const privateKey = new Uint8Array(PRIVATE_KEY_BYTE_LENGTH);
  for (let i = 0; i < KEYS_BYTE_LENGTH; i++) {
    privateKey[i] = privateKeyRaw[i];
    privateKey[KEYS_BYTE_LENGTH + i] = publicKey[i];
  }
  return privateKey;
}
__name(concatKeys, "concatKeys");

// node_modules/libp2p/node_modules/@libp2p/crypto/dist/src/webcrypto-browser.js
var webcrypto_browser_default = {
  get(win = globalThis) {
    const nativeCrypto = win.crypto;
    if (nativeCrypto?.subtle == null) {
      throw Object.assign(new Error("Missing Web Crypto API. The most likely cause of this error is that this page is being accessed from an insecure context (i.e. not HTTPS). For more information and possible resolutions see https://github.com/libp2p/js-libp2p/blob/main/packages/crypto/README.md#web-crypto-api"), { code: "ERR_MISSING_WEB_CRYPTO" });
    }
    return nativeCrypto;
  }
};

// node_modules/libp2p/node_modules/@libp2p/crypto/dist/src/ciphers/aes-gcm.browser.js
var derivedEmptyPasswordKey = { alg: "A128GCM", ext: true, k: "scm9jmO_4BJAgdwWGVulLg", key_ops: ["encrypt", "decrypt"], kty: "oct" };
function create2(opts) {
  const algorithm = opts?.algorithm ?? "AES-GCM";
  let keyLength = opts?.keyLength ?? 16;
  const nonceLength = opts?.nonceLength ?? 12;
  const digest2 = opts?.digest ?? "SHA-256";
  const saltLength = opts?.saltLength ?? 16;
  const iterations = opts?.iterations ?? 32767;
  const crypto3 = webcrypto_browser_default.get();
  keyLength *= 8;
  async function encrypt(data, password) {
    const salt = crypto3.getRandomValues(new Uint8Array(saltLength));
    const nonce = crypto3.getRandomValues(new Uint8Array(nonceLength));
    const aesGcm = { name: algorithm, iv: nonce };
    if (typeof password === "string") {
      password = fromString2(password);
    }
    let cryptoKey;
    if (password.length === 0) {
      cryptoKey = await crypto3.subtle.importKey("jwk", derivedEmptyPasswordKey, { name: "AES-GCM" }, true, ["encrypt"]);
      try {
        const deriveParams = { name: "PBKDF2", salt, iterations, hash: { name: digest2 } };
        const runtimeDerivedEmptyPassword = await crypto3.subtle.importKey("raw", password, { name: "PBKDF2" }, false, ["deriveKey"]);
        cryptoKey = await crypto3.subtle.deriveKey(deriveParams, runtimeDerivedEmptyPassword, { name: algorithm, length: keyLength }, true, ["encrypt"]);
      } catch {
        cryptoKey = await crypto3.subtle.importKey("jwk", derivedEmptyPasswordKey, { name: "AES-GCM" }, true, ["encrypt"]);
      }
    } else {
      const deriveParams = { name: "PBKDF2", salt, iterations, hash: { name: digest2 } };
      const rawKey = await crypto3.subtle.importKey("raw", password, { name: "PBKDF2" }, false, ["deriveKey"]);
      cryptoKey = await crypto3.subtle.deriveKey(deriveParams, rawKey, { name: algorithm, length: keyLength }, true, ["encrypt"]);
    }
    const ciphertext = await crypto3.subtle.encrypt(aesGcm, cryptoKey, data);
    return concat([salt, aesGcm.iv, new Uint8Array(ciphertext)]);
  }
  __name(encrypt, "encrypt");
  async function decrypt(data, password) {
    const salt = data.subarray(0, saltLength);
    const nonce = data.subarray(saltLength, saltLength + nonceLength);
    const ciphertext = data.subarray(saltLength + nonceLength);
    const aesGcm = { name: algorithm, iv: nonce };
    if (typeof password === "string") {
      password = fromString2(password);
    }
    let cryptoKey;
    if (password.length === 0) {
      try {
        const deriveParams = { name: "PBKDF2", salt, iterations, hash: { name: digest2 } };
        const runtimeDerivedEmptyPassword = await crypto3.subtle.importKey("raw", password, { name: "PBKDF2" }, false, ["deriveKey"]);
        cryptoKey = await crypto3.subtle.deriveKey(deriveParams, runtimeDerivedEmptyPassword, { name: algorithm, length: keyLength }, true, ["decrypt"]);
      } catch {
        cryptoKey = await crypto3.subtle.importKey("jwk", derivedEmptyPasswordKey, { name: "AES-GCM" }, true, ["decrypt"]);
      }
    } else {
      const deriveParams = { name: "PBKDF2", salt, iterations, hash: { name: digest2 } };
      const rawKey = await crypto3.subtle.importKey("raw", password, { name: "PBKDF2" }, false, ["deriveKey"]);
      cryptoKey = await crypto3.subtle.deriveKey(deriveParams, rawKey, { name: algorithm, length: keyLength }, true, ["decrypt"]);
    }
    const plaintext = await crypto3.subtle.decrypt(aesGcm, cryptoKey, ciphertext);
    return new Uint8Array(plaintext);
  }
  __name(decrypt, "decrypt");
  const cipher = {
    encrypt,
    decrypt
  };
  return cipher;
}
__name(create2, "create");

// node_modules/libp2p/node_modules/@libp2p/crypto/dist/src/keys/exporter.js
async function exporter(privateKey, password) {
  const cipher = create2();
  const encryptedKey = await cipher.encrypt(privateKey, password);
  return base64.encode(encryptedKey);
}
__name(exporter, "exporter");

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
function length2(string3) {
  let len = 0;
  let c = 0;
  for (let i = 0; i < string3.length; ++i) {
    c = string3.charCodeAt(i);
    if (c < 128) {
      len += 1;
    } else if (c < 2048) {
      len += 2;
    } else if ((c & 64512) === 55296 && (string3.charCodeAt(i + 1) & 64512) === 56320) {
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
function write(string3, buffer, offset) {
  const start = offset;
  let c1;
  let c2;
  for (let i = 0; i < string3.length; ++i) {
    c1 = string3.charCodeAt(i);
    if (c1 < 128) {
      buffer[offset++] = c1;
    } else if (c1 < 2048) {
      buffer[offset++] = c1 >> 6 | 192;
      buffer[offset++] = c1 & 63 | 128;
    } else if ((c1 & 64512) === 55296 && ((c2 = string3.charCodeAt(i + 1)) & 64512) === 56320) {
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
  const w2 = createWriter();
  codec.encode(message2, w2, {
    lengthDelimited: false
  });
  return w2.finish();
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
function createCodec2(name3, type, encode7, decode8) {
  return {
    name: name3,
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

// node_modules/libp2p/node_modules/@libp2p/crypto/dist/src/keys/keys.js
var KeyType;
(function(KeyType4) {
  KeyType4["RSA"] = "RSA";
  KeyType4["Ed25519"] = "Ed25519";
  KeyType4["Secp256k1"] = "Secp256k1";
})(KeyType || (KeyType = {}));
var __KeyTypeValues;
(function(__KeyTypeValues4) {
  __KeyTypeValues4[__KeyTypeValues4["RSA"] = 0] = "RSA";
  __KeyTypeValues4[__KeyTypeValues4["Ed25519"] = 1] = "Ed25519";
  __KeyTypeValues4[__KeyTypeValues4["Secp256k1"] = 2] = "Secp256k1";
})(__KeyTypeValues || (__KeyTypeValues = {}));
(function(KeyType4) {
  KeyType4.codec = () => {
    return enumeration(__KeyTypeValues);
  };
})(KeyType || (KeyType = {}));
var PublicKey;
(function(PublicKey4) {
  let _codec;
  PublicKey4.codec = () => {
    if (_codec == null) {
      _codec = message((obj, w2, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w2.fork();
        }
        if (obj.Type != null) {
          w2.uint32(8);
          KeyType.codec().encode(obj.Type, w2);
        }
        if (obj.Data != null) {
          w2.uint32(18);
          w2.bytes(obj.Data);
        }
        if (opts.lengthDelimited !== false) {
          w2.ldelim();
        }
      }, (reader, length3) => {
        const obj = {};
        const end = length3 == null ? reader.len : reader.pos + length3;
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              obj.Type = KeyType.codec().decode(reader);
              break;
            case 2:
              obj.Data = reader.bytes();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return obj;
      });
    }
    return _codec;
  };
  PublicKey4.encode = (obj) => {
    return encodeMessage(obj, PublicKey4.codec());
  };
  PublicKey4.decode = (buf) => {
    return decodeMessage(buf, PublicKey4.codec());
  };
})(PublicKey || (PublicKey = {}));
var PrivateKey;
(function(PrivateKey4) {
  let _codec;
  PrivateKey4.codec = () => {
    if (_codec == null) {
      _codec = message((obj, w2, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w2.fork();
        }
        if (obj.Type != null) {
          w2.uint32(8);
          KeyType.codec().encode(obj.Type, w2);
        }
        if (obj.Data != null) {
          w2.uint32(18);
          w2.bytes(obj.Data);
        }
        if (opts.lengthDelimited !== false) {
          w2.ldelim();
        }
      }, (reader, length3) => {
        const obj = {};
        const end = length3 == null ? reader.len : reader.pos + length3;
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              obj.Type = KeyType.codec().decode(reader);
              break;
            case 2:
              obj.Data = reader.bytes();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return obj;
      });
    }
    return _codec;
  };
  PrivateKey4.encode = (obj) => {
    return encodeMessage(obj, PrivateKey4.codec());
  };
  PrivateKey4.decode = (buf) => {
    return decodeMessage(buf, PrivateKey4.codec());
  };
})(PrivateKey || (PrivateKey = {}));

// node_modules/libp2p/node_modules/@libp2p/crypto/dist/src/keys/ed25519-class.js
var Ed25519PublicKey = class {
  static {
    __name(this, "Ed25519PublicKey");
  }
  _key;
  constructor(key) {
    this._key = ensureKey(key, PUBLIC_KEY_BYTE_LENGTH);
  }
  verify(data, sig) {
    return hashAndVerify(this._key, sig, data);
  }
  marshal() {
    return this._key;
  }
  get bytes() {
    return PublicKey.encode({
      Type: KeyType.Ed25519,
      Data: this.marshal()
    }).subarray();
  }
  equals(key) {
    return equals3(this.bytes, key.bytes);
  }
  hash() {
    const p = sha256.digest(this.bytes);
    if (isPromise(p)) {
      return p.then(({ bytes: bytes2 }) => bytes2);
    }
    return p.bytes;
  }
};
var Ed25519PrivateKey = class {
  static {
    __name(this, "Ed25519PrivateKey");
  }
  _key;
  _publicKey;
  // key       - 64 byte Uint8Array containing private key
  // publicKey - 32 byte Uint8Array containing public key
  constructor(key, publicKey) {
    this._key = ensureKey(key, PRIVATE_KEY_BYTE_LENGTH);
    this._publicKey = ensureKey(publicKey, PUBLIC_KEY_BYTE_LENGTH);
  }
  sign(message2) {
    return hashAndSign(this._key, message2);
  }
  get public() {
    return new Ed25519PublicKey(this._publicKey);
  }
  marshal() {
    return this._key;
  }
  get bytes() {
    return PrivateKey.encode({
      Type: KeyType.Ed25519,
      Data: this.marshal()
    }).subarray();
  }
  equals(key) {
    return equals3(this.bytes, key.bytes);
  }
  async hash() {
    const p = sha256.digest(this.bytes);
    let bytes2;
    if (isPromise(p)) {
      ({ bytes: bytes2 } = await p);
    } else {
      bytes2 = p.bytes;
    }
    return bytes2;
  }
  /**
   * Gets the ID of the key.
   *
   * The key id is the base58 encoding of the identity multihash containing its public key.
   * The public key is a protobuf encoding containing a type and the DER encoding
   * of the PKCS SubjectPublicKeyInfo.
   *
   * @returns {Promise<string>}
   */
  async id() {
    const encoding = identity.digest(this.public.bytes);
    return base58btc.encode(encoding.bytes).substring(1);
  }
  /**
   * Exports the key into a password protected `format`
   */
  async export(password, format2 = "libp2p-key") {
    if (format2 === "libp2p-key") {
      return exporter(this.bytes, password);
    } else {
      throw new CodeError(`export format '${format2}' is not supported`, "ERR_INVALID_EXPORT_FORMAT");
    }
  }
};
function unmarshalEd25519PrivateKey(bytes2) {
  if (bytes2.length > PRIVATE_KEY_BYTE_LENGTH) {
    bytes2 = ensureKey(bytes2, PRIVATE_KEY_BYTE_LENGTH + PUBLIC_KEY_BYTE_LENGTH);
    const privateKeyBytes2 = bytes2.subarray(0, PRIVATE_KEY_BYTE_LENGTH);
    const publicKeyBytes2 = bytes2.subarray(PRIVATE_KEY_BYTE_LENGTH, bytes2.length);
    return new Ed25519PrivateKey(privateKeyBytes2, publicKeyBytes2);
  }
  bytes2 = ensureKey(bytes2, PRIVATE_KEY_BYTE_LENGTH);
  const privateKeyBytes = bytes2.subarray(0, PRIVATE_KEY_BYTE_LENGTH);
  const publicKeyBytes = bytes2.subarray(PUBLIC_KEY_BYTE_LENGTH);
  return new Ed25519PrivateKey(privateKeyBytes, publicKeyBytes);
}
__name(unmarshalEd25519PrivateKey, "unmarshalEd25519PrivateKey");
function unmarshalEd25519PublicKey(bytes2) {
  bytes2 = ensureKey(bytes2, PUBLIC_KEY_BYTE_LENGTH);
  return new Ed25519PublicKey(bytes2);
}
__name(unmarshalEd25519PublicKey, "unmarshalEd25519PublicKey");
async function generateKeyPair() {
  const { privateKey, publicKey } = generateKey();
  return new Ed25519PrivateKey(privateKey, publicKey);
}
__name(generateKeyPair, "generateKeyPair");
async function generateKeyPairFromSeed(seed) {
  const { privateKey, publicKey } = generateKeyFromSeed(seed);
  return new Ed25519PrivateKey(privateKey, publicKey);
}
__name(generateKeyPairFromSeed, "generateKeyPairFromSeed");
function ensureKey(key, length3) {
  key = Uint8Array.from(key ?? []);
  if (key.length !== length3) {
    throw new CodeError(`Key must be a Uint8Array of length ${length3}, got ${key.length}`, "ERR_INVALID_KEY_TYPE");
  }
  return key;
}
__name(ensureKey, "ensureKey");

// node_modules/uint8arrays/dist/src/to-string.js
function toString2(array, encoding = "utf8") {
  const base3 = bases_default[encoding];
  if (base3 == null) {
    throw new Error(`Unsupported encoding "${encoding}"`);
  }
  return base3.encoder.encode(array).substring(1);
}
__name(toString2, "toString");

// node_modules/libp2p/node_modules/@libp2p/crypto/dist/src/keys/rsa-class.js
var rsa_class_exports = {};
__export(rsa_class_exports, {
  MAX_RSA_KEY_SIZE: () => MAX_RSA_KEY_SIZE,
  RsaPrivateKey: () => RsaPrivateKey,
  RsaPublicKey: () => RsaPublicKey,
  fromJwk: () => fromJwk,
  generateKeyPair: () => generateKeyPair2,
  unmarshalRsaPrivateKey: () => unmarshalRsaPrivateKey,
  unmarshalRsaPublicKey: () => unmarshalRsaPublicKey
});

// node_modules/libp2p/node_modules/@libp2p/crypto/dist/src/random-bytes.js
function randomBytes2(length3) {
  if (isNaN(length3) || length3 <= 0) {
    throw new CodeError("random bytes length must be a Number bigger than 0", "ERR_INVALID_LENGTH");
  }
  return randomBytes(length3);
}
__name(randomBytes2, "randomBytes");

// node_modules/libp2p/node_modules/@libp2p/crypto/dist/src/keys/rsa-utils.js
var rsa_utils_exports = {};
__export(rsa_utils_exports, {
  exportToPem: () => exportToPem,
  importFromPem: () => importFromPem,
  jwkToPkcs1: () => jwkToPkcs1,
  jwkToPkix: () => jwkToPkix,
  pkcs1ToJwk: () => pkcs1ToJwk,
  pkixToJwk: () => pkixToJwk
});

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

// node_modules/@noble/hashes/esm/pbkdf2.js
function pbkdf2Init(hash2, _password, _salt, _opts) {
  hash(hash2);
  const opts = checkOpts({ dkLen: 32, asyncTick: 10 }, _opts);
  const { c, dkLen, asyncTick } = opts;
  number(c);
  number(dkLen);
  number(asyncTick);
  if (c < 1)
    throw new Error("PBKDF2: iterations (c) should be >= 1");
  const password = toBytes(_password);
  const salt = toBytes(_salt);
  const DK = new Uint8Array(dkLen);
  const PRF = hmac.create(hash2, password);
  const PRFSalt = PRF._cloneInto().update(salt);
  return { c, dkLen, asyncTick, DK, PRF, PRFSalt };
}
__name(pbkdf2Init, "pbkdf2Init");
function pbkdf2Output(PRF, PRFSalt, DK, prfW, u) {
  PRF.destroy();
  PRFSalt.destroy();
  if (prfW)
    prfW.destroy();
  u.fill(0);
  return DK;
}
__name(pbkdf2Output, "pbkdf2Output");
async function pbkdf2Async(hash2, password, salt, opts) {
  const { c, dkLen, asyncTick, DK, PRF, PRFSalt } = pbkdf2Init(hash2, password, salt, opts);
  let prfW;
  const arr = new Uint8Array(4);
  const view = createView(arr);
  const u = new Uint8Array(PRF.outputLen);
  for (let ti = 1, pos = 0; pos < dkLen; ti++, pos += PRF.outputLen) {
    const Ti = DK.subarray(pos, pos + PRF.outputLen);
    view.setInt32(0, ti, false);
    (prfW = PRFSalt._cloneInto(prfW)).update(arr).digestInto(u);
    Ti.set(u.subarray(0, Ti.length));
    await asyncLoop(c - 1, asyncTick, () => {
      PRF._cloneInto(prfW).update(u).digestInto(u);
      for (let i = 0; i < Ti.length; i++)
        Ti[i] ^= u[i];
    });
  }
  return pbkdf2Output(PRF, PRFSalt, DK, prfW, u);
}
__name(pbkdf2Async, "pbkdf2Async");

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
function concat2(buffers) {
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
__name(concat2, "concat");
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
    return concat2(this.items);
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
        let number3 = this.tagNumber;
        number3 &= 31;
        firstOctet |= number3;
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
  constructor({ name: name3 = EMPTY_STRING, optional: optional2 = false, primitiveSchema, ...parameters } = {}, valueBlockType) {
    super(parameters);
    this.name = name3;
    this.optional = optional2;
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
function viewAdd(first, second) {
  const c = new Uint8Array([0]);
  const firstView = new Uint8Array(first);
  const secondView = new Uint8Array(second);
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
function viewSub(first, second) {
  let b = 0;
  const firstView = new Uint8Array(first);
  const secondView = new Uint8Array(second);
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
      const second = pvtsutils.BufferSourceConverter.toUint8Array(pvtsutils.Convert.FromHex(secondInt.toString(16)));
      second[0] |= 128;
      writer.write(second);
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
    return concat2(retBuffers);
  }
  fromString(string3) {
    this.value = [];
    let pos1 = 0;
    let pos2 = 0;
    let sid = "";
    let flag = false;
    do {
      pos2 = string3.indexOf(".", pos1);
      if (pos2 === -1)
        sid = string3.substring(pos1);
      else
        sid = string3.substring(pos1, pos2);
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
    return concat2(retBuffers);
  }
  fromString(string3) {
    this.value = [];
    let pos1 = 0;
    let pos2 = 0;
    let sid = "";
    do {
      pos2 = string3.indexOf(".", pos1);
      if (pos2 === -1)
        sid = string3.substring(pos1);
      else
        sid = string3.substring(pos1, pos2);
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
      const number3 = new Number(inputString[inputString.length - 1]);
      if (isNaN(number3.valueOf()))
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
        let number3 = parseInt(differenceString.substring(0, 2), 10);
        if (isNaN(number3.valueOf()))
          throw new Error("Wrong input string for conversion");
        hourDifference = multiplier * number3;
        if (differenceString.length === 4) {
          number3 = parseInt(differenceString.substring(2, 4), 10);
          if (isNaN(number3.valueOf()))
            throw new Error("Wrong input string for conversion");
          minuteDifference = multiplier * number3;
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

// node_modules/libp2p/node_modules/@libp2p/crypto/dist/src/keys/rsa-utils.js
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
    throw new CodeError("JWK was missing components", "ERR_INVALID_PARAMETERS");
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
    throw new CodeError("JWK was missing components", "ERR_INVALID_PARAMETERS");
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
    let h2 = i.toString(16);
    if (h2.length % 2 > 0) {
      h2 = `0${h2}`;
    }
    hex.push(h2);
  });
  return BigInt("0x" + hex.join(""));
}
__name(bufToBn, "bufToBn");
var SALT_LENGTH = 16;
var KEY_SIZE = 32;
var ITERATIONS = 1e4;
async function exportToPem(privateKey, password) {
  const crypto3 = webcrypto_browser_default.get();
  const keyWrapper = new Sequence({
    value: [
      // version (0)
      new Integer({ value: 0 }),
      // privateKeyAlgorithm
      new Sequence({
        value: [
          // rsaEncryption OID
          new ObjectIdentifier({
            value: "1.2.840.113549.1.1.1"
          }),
          new Null()
        ]
      }),
      // PrivateKey
      new OctetString({
        valueHex: privateKey.marshal()
      })
    ]
  });
  const keyBuf = keyWrapper.toBER();
  const keyArr = new Uint8Array(keyBuf, 0, keyBuf.byteLength);
  const salt = randomBytes2(SALT_LENGTH);
  const encryptionKey = await pbkdf2Async(sha5122, password, salt, {
    c: ITERATIONS,
    dkLen: KEY_SIZE
  });
  const iv = randomBytes2(16);
  const cryptoKey = await crypto3.subtle.importKey("raw", encryptionKey, "AES-CBC", false, ["encrypt"]);
  const encrypted = await crypto3.subtle.encrypt({
    name: "AES-CBC",
    iv
  }, cryptoKey, keyArr);
  const pbkdf2Params = new Sequence({
    value: [
      // salt
      new OctetString({ valueHex: salt }),
      // iteration count
      new Integer({ value: ITERATIONS }),
      // key length
      new Integer({ value: KEY_SIZE }),
      // AlgorithmIdentifier
      new Sequence({
        value: [
          // hmacWithSHA512
          new ObjectIdentifier({ value: "1.2.840.113549.2.11" }),
          new Null()
        ]
      })
    ]
  });
  const encryptionAlgorithm = new Sequence({
    value: [
      // pkcs5PBES2
      new ObjectIdentifier({
        value: "1.2.840.113549.1.5.13"
      }),
      new Sequence({
        value: [
          // keyDerivationFunc
          new Sequence({
            value: [
              // pkcs5PBKDF2
              new ObjectIdentifier({
                value: "1.2.840.113549.1.5.12"
              }),
              // PBKDF2-params
              pbkdf2Params
            ]
          }),
          // encryptionScheme
          new Sequence({
            value: [
              // aes256-CBC
              new ObjectIdentifier({
                value: "2.16.840.1.101.3.4.1.42"
              }),
              // iv
              new OctetString({
                valueHex: iv
              })
            ]
          })
        ]
      })
    ]
  });
  const finalWrapper = new Sequence({
    value: [
      encryptionAlgorithm,
      new OctetString({ valueHex: encrypted })
    ]
  });
  const finalWrapperBuf = finalWrapper.toBER();
  const finalWrapperArr = new Uint8Array(finalWrapperBuf, 0, finalWrapperBuf.byteLength);
  return [
    "-----BEGIN ENCRYPTED PRIVATE KEY-----",
    ...toString2(finalWrapperArr, "base64pad").split(/(.{64})/).filter(Boolean),
    "-----END ENCRYPTED PRIVATE KEY-----"
  ].join("\n");
}
__name(exportToPem, "exportToPem");
async function importFromPem(pem, password) {
  const crypto3 = webcrypto_browser_default.get();
  let plaintext;
  if (pem.includes("-----BEGIN ENCRYPTED PRIVATE KEY-----")) {
    const key = fromString2(pem.replace("-----BEGIN ENCRYPTED PRIVATE KEY-----", "").replace("-----END ENCRYPTED PRIVATE KEY-----", "").replace(/\n/g, "").trim(), "base64pad");
    const { result } = fromBER(key);
    const { iv, salt, iterations, keySize: keySize4, cipherText } = findEncryptedPEMData(result);
    const encryptionKey = await pbkdf2Async(sha5122, password, salt, {
      c: iterations,
      dkLen: keySize4
    });
    const cryptoKey = await crypto3.subtle.importKey("raw", encryptionKey, "AES-CBC", false, ["decrypt"]);
    const decrypted = toUint8Array(await crypto3.subtle.decrypt({
      name: "AES-CBC",
      iv
    }, cryptoKey, cipherText));
    const { result: decryptedResult } = fromBER(decrypted);
    plaintext = findPEMData(decryptedResult);
  } else if (pem.includes("-----BEGIN PRIVATE KEY-----")) {
    const key = fromString2(pem.replace("-----BEGIN PRIVATE KEY-----", "").replace("-----END PRIVATE KEY-----", "").replace(/\n/g, "").trim(), "base64pad");
    const { result } = fromBER(key);
    plaintext = findPEMData(result);
  } else {
    throw new CodeError("Could not parse private key from PEM data", "ERR_INVALID_PARAMETERS");
  }
  return unmarshalRsaPrivateKey(plaintext);
}
__name(importFromPem, "importFromPem");
function findEncryptedPEMData(root) {
  const encryptionAlgorithm = root.valueBlock.value[0];
  const scheme = encryptionAlgorithm.valueBlock.value[0].toString();
  if (scheme !== "OBJECT IDENTIFIER : 1.2.840.113549.1.5.13") {
    throw new CodeError("Only pkcs5PBES2 encrypted private keys are supported", "ERR_INVALID_PARAMS");
  }
  const keyDerivationFunc = encryptionAlgorithm.valueBlock.value[1].valueBlock.value[0];
  const keyDerivationFuncName = keyDerivationFunc.valueBlock.value[0].toString();
  if (keyDerivationFuncName !== "OBJECT IDENTIFIER : 1.2.840.113549.1.5.12") {
    throw new CodeError("Only pkcs5PBKDF2 key derivation functions are supported", "ERR_INVALID_PARAMS");
  }
  const pbkdf2Params = keyDerivationFunc.valueBlock.value[1];
  const salt = toUint8Array(pbkdf2Params.valueBlock.value[0].getValue());
  let iterations = ITERATIONS;
  let keySize4 = KEY_SIZE;
  if (pbkdf2Params.valueBlock.value.length === 3) {
    iterations = Number(pbkdf2Params.valueBlock.value[1].toBigInt());
    keySize4 = Number(pbkdf2Params.valueBlock.value[2].toBigInt());
  } else if (pbkdf2Params.valueBlock.value.length === 2) {
    throw new CodeError("Could not derive key size and iterations from PEM file - please use @libp2p/rsa to re-import your key", "ERR_INVALID_PARAMS");
  }
  const encryptionScheme = encryptionAlgorithm.valueBlock.value[1].valueBlock.value[1];
  const encryptionSchemeName = encryptionScheme.valueBlock.value[0].toString();
  if (encryptionSchemeName === "OBJECT IDENTIFIER : 1.2.840.113549.3.7") {
  } else if (encryptionSchemeName === "OBJECT IDENTIFIER : 1.3.14.3.2.7") {
  } else if (encryptionSchemeName === "OBJECT IDENTIFIER : 2.16.840.1.101.3.4.1.2") {
  } else if (encryptionSchemeName === "OBJECT IDENTIFIER : 2.16.840.1.101.3.4.1.22") {
  } else if (encryptionSchemeName === "OBJECT IDENTIFIER : 2.16.840.1.101.3.4.1.42") {
  } else {
    throw new CodeError("Only AES-CBC encryption schemes are supported", "ERR_INVALID_PARAMS");
  }
  const iv = toUint8Array(encryptionScheme.valueBlock.value[1].getValue());
  return {
    cipherText: toUint8Array(root.valueBlock.value[1].getValue()),
    salt,
    iterations,
    keySize: keySize4,
    iv
  };
}
__name(findEncryptedPEMData, "findEncryptedPEMData");
function findPEMData(seq) {
  return toUint8Array(seq.valueBlock.value[2].getValue());
}
__name(findPEMData, "findPEMData");
function toUint8Array(buf) {
  return new Uint8Array(buf, 0, buf.byteLength);
}
__name(toUint8Array, "toUint8Array");

// node_modules/libp2p/node_modules/@libp2p/crypto/dist/src/keys/rsa-browser.js
async function generateKey2(bits) {
  const pair = await webcrypto_browser_default.get().subtle.generateKey({
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
__name(generateKey2, "generateKey");
async function unmarshalPrivateKey(key) {
  const privateKey = await webcrypto_browser_default.get().subtle.importKey("jwk", key, {
    name: "RSASSA-PKCS1-v1_5",
    hash: { name: "SHA-256" }
  }, true, ["sign"]);
  const pair = [
    privateKey,
    await derivePublicFromPrivate(key)
  ];
  const keys = await exportKey({
    privateKey: pair[0],
    publicKey: pair[1]
  });
  return {
    privateKey: keys[0],
    publicKey: keys[1]
  };
}
__name(unmarshalPrivateKey, "unmarshalPrivateKey");
async function hashAndSign2(key, msg) {
  const privateKey = await webcrypto_browser_default.get().subtle.importKey("jwk", key, {
    name: "RSASSA-PKCS1-v1_5",
    hash: { name: "SHA-256" }
  }, false, ["sign"]);
  const sig = await webcrypto_browser_default.get().subtle.sign({ name: "RSASSA-PKCS1-v1_5" }, privateKey, msg instanceof Uint8Array ? msg : msg.subarray());
  return new Uint8Array(sig, 0, sig.byteLength);
}
__name(hashAndSign2, "hashAndSign");
async function hashAndVerify2(key, sig, msg) {
  const publicKey = await webcrypto_browser_default.get().subtle.importKey("jwk", key, {
    name: "RSASSA-PKCS1-v1_5",
    hash: { name: "SHA-256" }
  }, false, ["verify"]);
  return webcrypto_browser_default.get().subtle.verify({ name: "RSASSA-PKCS1-v1_5" }, publicKey, sig, msg instanceof Uint8Array ? msg : msg.subarray());
}
__name(hashAndVerify2, "hashAndVerify");
async function exportKey(pair) {
  if (pair.privateKey == null || pair.publicKey == null) {
    throw new CodeError("Private and public key are required", "ERR_INVALID_PARAMETERS");
  }
  return Promise.all([
    webcrypto_browser_default.get().subtle.exportKey("jwk", pair.privateKey),
    webcrypto_browser_default.get().subtle.exportKey("jwk", pair.publicKey)
  ]);
}
__name(exportKey, "exportKey");
async function derivePublicFromPrivate(jwKey) {
  return webcrypto_browser_default.get().subtle.importKey("jwk", {
    kty: jwKey.kty,
    n: jwKey.n,
    e: jwKey.e
  }, {
    name: "RSASSA-PKCS1-v1_5",
    hash: { name: "SHA-256" }
  }, true, ["verify"]);
}
__name(derivePublicFromPrivate, "derivePublicFromPrivate");
function keySize(jwk) {
  if (jwk.kty !== "RSA") {
    throw new CodeError("invalid key type", "ERR_INVALID_KEY_TYPE");
  } else if (jwk.n == null) {
    throw new CodeError("invalid key modulus", "ERR_INVALID_KEY_MODULUS");
  }
  const bytes2 = fromString2(jwk.n, "base64url");
  return bytes2.length * 8;
}
__name(keySize, "keySize");

// node_modules/libp2p/node_modules/@libp2p/crypto/dist/src/keys/rsa-class.js
var MAX_RSA_KEY_SIZE = 8192;
var RsaPublicKey = class {
  static {
    __name(this, "RsaPublicKey");
  }
  _key;
  constructor(key) {
    this._key = key;
  }
  verify(data, sig) {
    return hashAndVerify2(this._key, sig, data);
  }
  marshal() {
    return rsa_utils_exports.jwkToPkix(this._key);
  }
  get bytes() {
    return PublicKey.encode({
      Type: KeyType.RSA,
      Data: this.marshal()
    }).subarray();
  }
  equals(key) {
    return equals3(this.bytes, key.bytes);
  }
  hash() {
    const p = sha256.digest(this.bytes);
    if (isPromise(p)) {
      return p.then(({ bytes: bytes2 }) => bytes2);
    }
    return p.bytes;
  }
};
var RsaPrivateKey = class {
  static {
    __name(this, "RsaPrivateKey");
  }
  _key;
  _publicKey;
  constructor(key, publicKey) {
    this._key = key;
    this._publicKey = publicKey;
  }
  genSecret() {
    return randomBytes2(16);
  }
  sign(message2) {
    return hashAndSign2(this._key, message2);
  }
  get public() {
    if (this._publicKey == null) {
      throw new CodeError("public key not provided", "ERR_PUBKEY_NOT_PROVIDED");
    }
    return new RsaPublicKey(this._publicKey);
  }
  marshal() {
    return rsa_utils_exports.jwkToPkcs1(this._key);
  }
  get bytes() {
    return PrivateKey.encode({
      Type: KeyType.RSA,
      Data: this.marshal()
    }).subarray();
  }
  equals(key) {
    return equals3(this.bytes, key.bytes);
  }
  hash() {
    const p = sha256.digest(this.bytes);
    if (isPromise(p)) {
      return p.then(({ bytes: bytes2 }) => bytes2);
    }
    return p.bytes;
  }
  /**
   * Gets the ID of the key.
   *
   * The key id is the base58 encoding of the SHA-256 multihash of its public key.
   * The public key is a protobuf encoding containing a type and the DER encoding
   * of the PKCS SubjectPublicKeyInfo.
   */
  async id() {
    const hash2 = await this.public.hash();
    return toString2(hash2, "base58btc");
  }
  /**
   * Exports the key as libp2p-key - a aes-gcm encrypted value with the key
   * derived from the password.
   *
   * To export it as a password protected PEM file, please use the `exportPEM`
   * function from `@libp2p/rsa`.
   */
  async export(password, format2 = "pkcs-8") {
    if (format2 === "pkcs-8") {
      return rsa_utils_exports.exportToPem(this, password);
    } else if (format2 === "libp2p-key") {
      return exporter(this.bytes, password);
    } else {
      throw new CodeError(`export format '${format2}' is not supported`, "ERR_INVALID_EXPORT_FORMAT");
    }
  }
};
async function unmarshalRsaPrivateKey(bytes2) {
  const jwk = rsa_utils_exports.pkcs1ToJwk(bytes2);
  if (keySize(jwk) > MAX_RSA_KEY_SIZE) {
    throw new CodeError("key size is too large", "ERR_KEY_SIZE_TOO_LARGE");
  }
  const keys = await unmarshalPrivateKey(jwk);
  return new RsaPrivateKey(keys.privateKey, keys.publicKey);
}
__name(unmarshalRsaPrivateKey, "unmarshalRsaPrivateKey");
function unmarshalRsaPublicKey(bytes2) {
  const jwk = rsa_utils_exports.pkixToJwk(bytes2);
  if (keySize(jwk) > MAX_RSA_KEY_SIZE) {
    throw new CodeError("key size is too large", "ERR_KEY_SIZE_TOO_LARGE");
  }
  return new RsaPublicKey(jwk);
}
__name(unmarshalRsaPublicKey, "unmarshalRsaPublicKey");
async function fromJwk(jwk) {
  if (keySize(jwk) > MAX_RSA_KEY_SIZE) {
    throw new CodeError("key size is too large", "ERR_KEY_SIZE_TOO_LARGE");
  }
  const keys = await unmarshalPrivateKey(jwk);
  return new RsaPrivateKey(keys.privateKey, keys.publicKey);
}
__name(fromJwk, "fromJwk");
async function generateKeyPair2(bits) {
  if (bits > MAX_RSA_KEY_SIZE) {
    throw new CodeError("key size is too large", "ERR_KEY_SIZE_TOO_LARGE");
  }
  const keys = await generateKey2(bits);
  return new RsaPrivateKey(keys.privateKey, keys.publicKey);
}
__name(generateKeyPair2, "generateKeyPair");

// node_modules/libp2p/node_modules/@libp2p/crypto/dist/src/keys/secp256k1-class.js
var secp256k1_class_exports = {};
__export(secp256k1_class_exports, {
  Secp256k1PrivateKey: () => Secp256k1PrivateKey,
  Secp256k1PublicKey: () => Secp256k1PublicKey,
  generateKeyPair: () => generateKeyPair3,
  unmarshalSecp256k1PrivateKey: () => unmarshalSecp256k1PrivateKey,
  unmarshalSecp256k1PublicKey: () => unmarshalSecp256k1PublicKey
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
    constructor(m2 = "") {
      super(m2);
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
    const y2 = Fp3.fromBytes(tail.subarray(Fp3.BYTES, 2 * Fp3.BYTES));
    return { x, y: y2 };
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
    const { px: x, py: y2, pz: z } = p;
    if (Fp3.eql(z, Fp3.ONE))
      return { x, y: y2 };
    const is0 = p.is0();
    if (iz == null)
      iz = is0 ? Fp3.ONE : Fp3.inv(z);
    const ax = Fp3.mul(x, iz);
    const ay = Fp3.mul(y2, iz);
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
    const { x, y: y2 } = p.toAffine();
    if (!Fp3.isValid(x) || !Fp3.isValid(y2))
      throw new Error("bad point: x or y not FE");
    const left = Fp3.sqr(y2);
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
      const { x, y: y2 } = p || {};
      if (!p || !Fp3.isValid(x) || !Fp3.isValid(y2))
        throw new Error("invalid affine point");
      if (p instanceof Point2)
        throw new Error("projective point not allowed");
      const is0 = /* @__PURE__ */ __name((i) => Fp3.eql(i, Fp3.ZERO), "is0");
      if (is0(x) && is0(y2))
        return Point2.ZERO;
      return new Point2(x, y2, Fp3.ONE);
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
      const { y: y2 } = this.toAffine();
      if (Fp3.isOdd)
        return !Fp3.isOdd(y2);
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
      let d2 = this;
      while (k1 > _0n6 || k2 > _0n6) {
        if (k1 & _1n6)
          k1p = k1p.add(d2);
        if (k2 & _1n6)
          k2p = k2p.add(d2);
        d2 = d2.double();
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
        let y3;
        try {
          y3 = Fp3.sqrt(y2);
        } catch (sqrtError) {
          const suffix = sqrtError instanceof Error ? ": " + sqrtError.message : "";
          throw new Error("Point is not on curve" + suffix);
        }
        const isYOdd = (y3 & _1n6) === _1n6;
        const isHeadOdd = (head & 1) === 1;
        if (isHeadOdd !== isYOdd)
          y3 = Fp3.neg(y3);
        return { x, y: y3 };
      } else if (len === uncompressedLen && head === 4) {
        const x = Fp3.fromBytes(tail.subarray(0, Fp3.BYTES));
        const y2 = Fp3.fromBytes(tail.subarray(Fp3.BYTES, 2 * Fp3.BYTES));
        return { x, y: y2 };
      } else {
        throw new Error(`Point of length ${len} was invalid. Expected ${compressedLen} compressed bytes or ${uncompressedLen} uncompressed bytes`);
      }
    }
  });
  const numToNByteStr = /* @__PURE__ */ __name((num) => bytesToHex(numberToBytesBE(num, CURVE.nByteLength)), "numToNByteStr");
  function isBiggerThanHalfOrder(number3) {
    const HALF = CURVE_ORDER >> _1n6;
    return number3 > HALF;
  }
  __name(isBiggerThanHalfOrder, "isBiggerThanHalfOrder");
  function normalizeS(s2) {
    return isBiggerThanHalfOrder(s2) ? modN(-s2) : s2;
  }
  __name(normalizeS, "normalizeS");
  const slcNum = /* @__PURE__ */ __name((b, from3, to) => bytesToNumberBE(b.slice(from3, to)), "slcNum");
  class Signature {
    static {
      __name(this, "Signature");
    }
    constructor(r, s2, recovery) {
      this.r = r;
      this.s = s2;
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
      const { r, s: s2 } = DER.toSig(ensureBytes("DER", hex));
      return new Signature(r, s2);
    }
    assertValidity() {
      aInRange("r", this.r, _1n6, CURVE_ORDER);
      aInRange("s", this.s, _1n6, CURVE_ORDER);
    }
    addRecoveryBit(recovery) {
      return new Signature(this.r, this.s, recovery);
    }
    recoverPublicKey(msgHash) {
      const { r, s: s2, recovery: rec } = this;
      const h2 = bits2int_modN(ensureBytes("msgHash", msgHash));
      if (rec == null || ![0, 1, 2, 3].includes(rec))
        throw new Error("recovery id invalid");
      const radj = rec === 2 || rec === 3 ? r + CURVE.n : r;
      if (radj >= Fp3.ORDER)
        throw new Error("recovery id 2 or 3 invalid");
      const prefix = (rec & 1) === 0 ? "02" : "03";
      const R = Point2.fromHex(prefix + numToNByteStr(radj));
      const ir = invN(radj);
      const u1 = modN(-h2 * ir);
      const u2 = modN(s2 * ir);
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
    const { hash: hash2, randomBytes: randomBytes5 } = CURVE;
    let { lowS, prehash, extraEntropy: ent } = opts;
    if (lowS == null)
      lowS = true;
    msgHash = ensureBytes("msgHash", msgHash);
    validateSigVerOpts(opts);
    if (prehash)
      msgHash = ensureBytes("prehashed msgHash", hash2(msgHash));
    const h1int = bits2int_modN(msgHash);
    const d2 = normPrivateKeyToScalar(privateKey);
    const seedArgs = [int2octets(d2), int2octets(h1int)];
    if (ent != null && ent !== false) {
      const e = ent === true ? randomBytes5(Fp3.BYTES) : ent;
      seedArgs.push(ensureBytes("extraEntropy", e));
    }
    const seed = concatBytes2(...seedArgs);
    const m2 = h1int;
    function k2sig(kBytes) {
      const k = bits2int(kBytes);
      if (!isWithinCurveOrder(k))
        return;
      const ik = invN(k);
      const q = Point2.BASE.multiply(k).toAffine();
      const r = modN(q.x);
      if (r === _0n6)
        return;
      const s2 = modN(ik * modN(m2 + r * d2));
      if (s2 === _0n6)
        return;
      let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n6);
      let normS = s2;
      if (lowS && isBiggerThanHalfOrder(s2)) {
        normS = normalizeS(s2);
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
        const { r: r2, s: s3 } = sg;
        _sig = new Signature(r2, s3);
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
    const { r, s: s2 } = _sig;
    const h2 = bits2int_modN(msgHash);
    const is = invN(s2);
    const u1 = modN(h2 * is);
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
  const create5 = /* @__PURE__ */ __name((hash2) => weierstrass({ ...curveDef, ...getHash(hash2) }), "create");
  return Object.freeze({ ...create5(defHash), create: create5 });
}
__name(createCurve, "createCurve");

// node_modules/@noble/curves/esm/secp256k1.js
var secp256k1P = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f");
var secp256k1N = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141");
var _1n7 = BigInt(1);
var _2n6 = BigInt(2);
var divNearest = /* @__PURE__ */ __name((a, b) => (a + b / _2n6) / b, "divNearest");
function sqrtMod(y2) {
  const P = secp256k1P;
  const _3n4 = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
  const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
  const b2 = y2 * y2 * y2 % P;
  const b3 = b2 * b2 * y2 % P;
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
  if (!Fp2.eql(Fp2.sqr(root), y2))
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

// node_modules/libp2p/node_modules/@libp2p/crypto/dist/src/keys/secp256k1-browser.js
function generateKey3() {
  return secp256k1.utils.randomPrivateKey();
}
__name(generateKey3, "generateKey");
function hashAndSign3(key, msg) {
  const p = sha256.digest(msg instanceof Uint8Array ? msg : msg.subarray());
  if (isPromise(p)) {
    return p.then(({ digest: digest2 }) => secp256k1.sign(digest2, key).toDERRawBytes()).catch((err) => {
      throw new CodeError(String(err), "ERR_INVALID_INPUT");
    });
  }
  try {
    return secp256k1.sign(p.digest, key).toDERRawBytes();
  } catch (err) {
    throw new CodeError(String(err), "ERR_INVALID_INPUT");
  }
}
__name(hashAndSign3, "hashAndSign");
function hashAndVerify3(key, sig, msg) {
  const p = sha256.digest(msg instanceof Uint8Array ? msg : msg.subarray());
  if (isPromise(p)) {
    return p.then(({ digest: digest2 }) => secp256k1.verify(sig, digest2, key)).catch((err) => {
      throw new CodeError(String(err), "ERR_INVALID_INPUT");
    });
  }
  try {
    return secp256k1.verify(sig, p.digest, key);
  } catch (err) {
    throw new CodeError(String(err), "ERR_INVALID_INPUT");
  }
}
__name(hashAndVerify3, "hashAndVerify");
function compressPublicKey(key) {
  const point = secp256k1.ProjectivePoint.fromHex(key).toRawBytes(true);
  return point;
}
__name(compressPublicKey, "compressPublicKey");
function validatePrivateKey(key) {
  try {
    secp256k1.getPublicKey(key, true);
  } catch (err) {
    throw new CodeError(String(err), "ERR_INVALID_PRIVATE_KEY");
  }
}
__name(validatePrivateKey, "validatePrivateKey");
function validatePublicKey(key) {
  try {
    secp256k1.ProjectivePoint.fromHex(key);
  } catch (err) {
    throw new CodeError(String(err), "ERR_INVALID_PUBLIC_KEY");
  }
}
__name(validatePublicKey, "validatePublicKey");
function computePublicKey(privateKey) {
  try {
    return secp256k1.getPublicKey(privateKey, true);
  } catch (err) {
    throw new CodeError(String(err), "ERR_INVALID_PRIVATE_KEY");
  }
}
__name(computePublicKey, "computePublicKey");

// node_modules/libp2p/node_modules/@libp2p/crypto/dist/src/keys/secp256k1-class.js
var Secp256k1PublicKey = class {
  static {
    __name(this, "Secp256k1PublicKey");
  }
  _key;
  constructor(key) {
    validatePublicKey(key);
    this._key = key;
  }
  verify(data, sig) {
    return hashAndVerify3(this._key, sig, data);
  }
  marshal() {
    return compressPublicKey(this._key);
  }
  get bytes() {
    return PublicKey.encode({
      Type: KeyType.Secp256k1,
      Data: this.marshal()
    }).subarray();
  }
  equals(key) {
    return equals3(this.bytes, key.bytes);
  }
  async hash() {
    const p = sha256.digest(this.bytes);
    let bytes2;
    if (isPromise(p)) {
      ({ bytes: bytes2 } = await p);
    } else {
      bytes2 = p.bytes;
    }
    return bytes2;
  }
};
var Secp256k1PrivateKey = class {
  static {
    __name(this, "Secp256k1PrivateKey");
  }
  _key;
  _publicKey;
  constructor(key, publicKey) {
    this._key = key;
    this._publicKey = publicKey ?? computePublicKey(key);
    validatePrivateKey(this._key);
    validatePublicKey(this._publicKey);
  }
  sign(message2) {
    return hashAndSign3(this._key, message2);
  }
  get public() {
    return new Secp256k1PublicKey(this._publicKey);
  }
  marshal() {
    return this._key;
  }
  get bytes() {
    return PrivateKey.encode({
      Type: KeyType.Secp256k1,
      Data: this.marshal()
    }).subarray();
  }
  equals(key) {
    return equals3(this.bytes, key.bytes);
  }
  hash() {
    const p = sha256.digest(this.bytes);
    if (isPromise(p)) {
      return p.then(({ bytes: bytes2 }) => bytes2);
    }
    return p.bytes;
  }
  /**
   * Gets the ID of the key.
   *
   * The key id is the base58 encoding of the SHA-256 multihash of its public key.
   * The public key is a protobuf encoding containing a type and the DER encoding
   * of the PKCS SubjectPublicKeyInfo.
   */
  async id() {
    const hash2 = await this.public.hash();
    return toString2(hash2, "base58btc");
  }
  /**
   * Exports the key into a password protected `format`
   */
  async export(password, format2 = "libp2p-key") {
    if (format2 === "libp2p-key") {
      return exporter(this.bytes, password);
    } else {
      throw new CodeError(`export format '${format2}' is not supported`, "ERR_INVALID_EXPORT_FORMAT");
    }
  }
};
function unmarshalSecp256k1PrivateKey(bytes2) {
  return new Secp256k1PrivateKey(bytes2);
}
__name(unmarshalSecp256k1PrivateKey, "unmarshalSecp256k1PrivateKey");
function unmarshalSecp256k1PublicKey(bytes2) {
  return new Secp256k1PublicKey(bytes2);
}
__name(unmarshalSecp256k1PublicKey, "unmarshalSecp256k1PublicKey");
async function generateKeyPair3() {
  const privateKeyBytes = generateKey3();
  return new Secp256k1PrivateKey(privateKeyBytes);
}
__name(generateKeyPair3, "generateKeyPair");

// node_modules/libp2p/node_modules/@libp2p/crypto/dist/src/keys/index.js
var supportedKeys = {
  rsa: rsa_class_exports,
  ed25519: ed25519_class_exports,
  secp256k1: secp256k1_class_exports
};
function unsupportedKey(type) {
  const supported = Object.keys(supportedKeys).join(" / ");
  return new CodeError(`invalid or unsupported key type ${type}. Must be ${supported}`, "ERR_UNSUPPORTED_KEY_TYPE");
}
__name(unsupportedKey, "unsupportedKey");
function unmarshalPublicKey(buf) {
  const decoded = PublicKey.decode(buf);
  const data = decoded.Data ?? new Uint8Array();
  switch (decoded.Type) {
    case KeyType.RSA:
      return supportedKeys.rsa.unmarshalRsaPublicKey(data);
    case KeyType.Ed25519:
      return supportedKeys.ed25519.unmarshalEd25519PublicKey(data);
    case KeyType.Secp256k1:
      return supportedKeys.secp256k1.unmarshalSecp256k1PublicKey(data);
    default:
      throw unsupportedKey(decoded.Type ?? "unknown");
  }
}
__name(unmarshalPublicKey, "unmarshalPublicKey");
async function unmarshalPrivateKey2(buf) {
  const decoded = PrivateKey.decode(buf);
  const data = decoded.Data ?? new Uint8Array();
  switch (decoded.Type) {
    case KeyType.RSA:
      return supportedKeys.rsa.unmarshalRsaPrivateKey(data);
    case KeyType.Ed25519:
      return supportedKeys.ed25519.unmarshalEd25519PrivateKey(data);
    case KeyType.Secp256k1:
      return supportedKeys.secp256k1.unmarshalSecp256k1PrivateKey(data);
    default:
      throw unsupportedKey(decoded.Type ?? "RSA");
  }
}
__name(unmarshalPrivateKey2, "unmarshalPrivateKey");

// node_modules/weald/node_modules/ms/dist/index.mjs
var s = 1e3;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;
function ms(value, options) {
  try {
    if (typeof value === "string" && value.length > 0) {
      return parse(value);
    } else if (typeof value === "number" && isFinite(value)) {
      return options?.long ? fmtLong(value) : fmtShort(value);
    }
    throw new Error("Value is not a string or number.");
  } catch (error) {
    const message2 = isError(error) ? `${error.message}. value=${JSON.stringify(value)}` : "An unknown error has occured.";
    throw new Error(message2);
  }
}
__name(ms, "ms");
function parse(str) {
  str = String(str);
  if (str.length > 100) {
    throw new Error("Value exceeds the maximum length of 100 characters.");
  }
  const match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
  if (!match) {
    return NaN;
  }
  const n = parseFloat(match[1]);
  const type = (match[2] || "ms").toLowerCase();
  switch (type) {
    case "years":
    case "year":
    case "yrs":
    case "yr":
    case "y":
      return n * y;
    case "weeks":
    case "week":
    case "w":
      return n * w;
    case "days":
    case "day":
    case "d":
      return n * d;
    case "hours":
    case "hour":
    case "hrs":
    case "hr":
    case "h":
      return n * h;
    case "minutes":
    case "minute":
    case "mins":
    case "min":
    case "m":
      return n * m;
    case "seconds":
    case "second":
    case "secs":
    case "sec":
    case "s":
      return n * s;
    case "milliseconds":
    case "millisecond":
    case "msecs":
    case "msec":
    case "ms":
      return n;
    default:
      throw new Error(`The unit ${type} was matched, but no matching case exists.`);
  }
}
__name(parse, "parse");
var dist_default = ms;
function fmtShort(ms2) {
  const msAbs = Math.abs(ms2);
  if (msAbs >= d) {
    return `${Math.round(ms2 / d)}d`;
  }
  if (msAbs >= h) {
    return `${Math.round(ms2 / h)}h`;
  }
  if (msAbs >= m) {
    return `${Math.round(ms2 / m)}m`;
  }
  if (msAbs >= s) {
    return `${Math.round(ms2 / s)}s`;
  }
  return `${ms2}ms`;
}
__name(fmtShort, "fmtShort");
function fmtLong(ms2) {
  const msAbs = Math.abs(ms2);
  if (msAbs >= d) {
    return plural(ms2, msAbs, d, "day");
  }
  if (msAbs >= h) {
    return plural(ms2, msAbs, h, "hour");
  }
  if (msAbs >= m) {
    return plural(ms2, msAbs, m, "minute");
  }
  if (msAbs >= s) {
    return plural(ms2, msAbs, s, "second");
  }
  return `${ms2} ms`;
}
__name(fmtLong, "fmtLong");
function plural(ms2, msAbs, n, name3) {
  const isPlural = msAbs >= n * 1.5;
  return `${Math.round(ms2 / n)} ${name3}${isPlural ? "s" : ""}`;
}
__name(plural, "plural");
function isError(error) {
  return typeof error === "object" && error !== null && "message" in error;
}
__name(isError, "isError");

// node_modules/weald/dist/src/common.js
function setup(env) {
  createDebug.debug = createDebug;
  createDebug.default = createDebug;
  createDebug.coerce = coerce2;
  createDebug.disable = disable;
  createDebug.enable = enable;
  createDebug.enabled = enabled;
  createDebug.humanize = dist_default;
  createDebug.destroy = destroy;
  Object.keys(env).forEach((key) => {
    createDebug[key] = env[key];
  });
  createDebug.names = [];
  createDebug.skips = [];
  createDebug.formatters = {};
  function selectColor(namespace) {
    let hash2 = 0;
    for (let i = 0; i < namespace.length; i++) {
      hash2 = (hash2 << 5) - hash2 + namespace.charCodeAt(i);
      hash2 |= 0;
    }
    return createDebug.colors[Math.abs(hash2) % createDebug.colors.length];
  }
  __name(selectColor, "selectColor");
  createDebug.selectColor = selectColor;
  function createDebug(namespace) {
    let prevTime;
    let enableOverride = null;
    let namespacesCache;
    let enabledCache;
    function debug(...args) {
      if (!debug.enabled) {
        return;
      }
      const self = debug;
      const curr = Number(/* @__PURE__ */ new Date());
      const ms2 = curr - (prevTime || curr);
      self.diff = ms2;
      self.prev = prevTime;
      self.curr = curr;
      prevTime = curr;
      args[0] = createDebug.coerce(args[0]);
      if (typeof args[0] !== "string") {
        args.unshift("%O");
      }
      let index = 0;
      args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format2) => {
        if (match === "%%") {
          return "%";
        }
        index++;
        const formatter = createDebug.formatters[format2];
        if (typeof formatter === "function") {
          const val = args[index];
          match = formatter.call(self, val);
          args.splice(index, 1);
          index--;
        }
        return match;
      });
      createDebug.formatArgs.call(self, args);
      const logFn = self.log || createDebug.log;
      logFn.apply(self, args);
    }
    __name(debug, "debug");
    debug.namespace = namespace;
    debug.useColors = createDebug.useColors();
    debug.color = createDebug.selectColor(namespace);
    debug.extend = extend;
    debug.destroy = createDebug.destroy;
    Object.defineProperty(debug, "enabled", {
      enumerable: true,
      configurable: false,
      get: /* @__PURE__ */ __name(() => {
        if (enableOverride !== null) {
          return enableOverride;
        }
        if (namespacesCache !== createDebug.namespaces) {
          namespacesCache = createDebug.namespaces;
          enabledCache = createDebug.enabled(namespace);
        }
        return enabledCache;
      }, "get"),
      set: /* @__PURE__ */ __name((v) => {
        enableOverride = v;
      }, "set")
    });
    if (typeof createDebug.init === "function") {
      createDebug.init(debug);
    }
    return debug;
  }
  __name(createDebug, "createDebug");
  function extend(namespace, delimiter) {
    const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
    newDebug.log = this.log;
    return newDebug;
  }
  __name(extend, "extend");
  function enable(namespaces) {
    createDebug.save(namespaces);
    createDebug.namespaces = namespaces;
    createDebug.names = [];
    createDebug.skips = [];
    let i;
    const split2 = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
    const len = split2.length;
    for (i = 0; i < len; i++) {
      if (!split2[i]) {
        continue;
      }
      namespaces = split2[i].replace(/\*/g, ".*?");
      if (namespaces[0] === "-") {
        createDebug.skips.push(new RegExp("^" + namespaces.substr(1) + "$"));
      } else {
        createDebug.names.push(new RegExp("^" + namespaces + "$"));
      }
    }
  }
  __name(enable, "enable");
  function disable() {
    const namespaces = [
      ...createDebug.names.map(toNamespace),
      ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
    ].join(",");
    createDebug.enable("");
    return namespaces;
  }
  __name(disable, "disable");
  function enabled(name3) {
    if (name3[name3.length - 1] === "*") {
      return true;
    }
    let i;
    let len;
    for (i = 0, len = createDebug.skips.length; i < len; i++) {
      if (createDebug.skips[i].test(name3)) {
        return false;
      }
    }
    for (i = 0, len = createDebug.names.length; i < len; i++) {
      if (createDebug.names[i].test(name3)) {
        return true;
      }
    }
    return false;
  }
  __name(enabled, "enabled");
  function toNamespace(regexp) {
    return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
  }
  __name(toNamespace, "toNamespace");
  function coerce2(val) {
    if (val instanceof Error) {
      return val.stack ?? val.message;
    }
    return val;
  }
  __name(coerce2, "coerce");
  function destroy() {
    console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
  }
  __name(destroy, "destroy");
  createDebug.setupFormatters(createDebug.formatters);
  createDebug.enable(createDebug.load());
  return createDebug;
}
__name(setup, "setup");

// node_modules/weald/dist/src/browser.js
var storage = localstorage();
var colors = [
  "#0000CC",
  "#0000FF",
  "#0033CC",
  "#0033FF",
  "#0066CC",
  "#0066FF",
  "#0099CC",
  "#0099FF",
  "#00CC00",
  "#00CC33",
  "#00CC66",
  "#00CC99",
  "#00CCCC",
  "#00CCFF",
  "#3300CC",
  "#3300FF",
  "#3333CC",
  "#3333FF",
  "#3366CC",
  "#3366FF",
  "#3399CC",
  "#3399FF",
  "#33CC00",
  "#33CC33",
  "#33CC66",
  "#33CC99",
  "#33CCCC",
  "#33CCFF",
  "#6600CC",
  "#6600FF",
  "#6633CC",
  "#6633FF",
  "#66CC00",
  "#66CC33",
  "#9900CC",
  "#9900FF",
  "#9933CC",
  "#9933FF",
  "#99CC00",
  "#99CC33",
  "#CC0000",
  "#CC0033",
  "#CC0066",
  "#CC0099",
  "#CC00CC",
  "#CC00FF",
  "#CC3300",
  "#CC3333",
  "#CC3366",
  "#CC3399",
  "#CC33CC",
  "#CC33FF",
  "#CC6600",
  "#CC6633",
  "#CC9900",
  "#CC9933",
  "#CCCC00",
  "#CCCC33",
  "#FF0000",
  "#FF0033",
  "#FF0066",
  "#FF0099",
  "#FF00CC",
  "#FF00FF",
  "#FF3300",
  "#FF3333",
  "#FF3366",
  "#FF3399",
  "#FF33CC",
  "#FF33FF",
  "#FF6600",
  "#FF6633",
  "#FF9900",
  "#FF9933",
  "#FFCC00",
  "#FFCC33"
];
function useColors() {
  if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
    return true;
  }
  if (typeof navigator !== "undefined" && navigator.userAgent?.toLowerCase().match(/(edge|trident)\/(\d+)/) != null) {
    return false;
  }
  return typeof document !== "undefined" && document.documentElement?.style?.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
  // @ts-expect-error window.console.firebug and window.console.exception are not in the types
  typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== "undefined" && navigator.userAgent?.toLowerCase().match(/firefox\/(\d+)/) != null && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
  typeof navigator !== "undefined" && navigator.userAgent?.toLowerCase().match(/applewebkit\/(\d+)/);
}
__name(useColors, "useColors");
function formatArgs(args) {
  args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + dist_default(this.diff);
  if (!this.useColors) {
    return;
  }
  const c = "color: " + this.color;
  args.splice(1, 0, c, "color: inherit");
  let index = 0;
  let lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, (match) => {
    if (match === "%%") {
      return;
    }
    index++;
    if (match === "%c") {
      lastC = index;
    }
  });
  args.splice(lastC, 0, c);
}
__name(formatArgs, "formatArgs");
var log = console.debug ?? console.log ?? (() => {
});
function save(namespaces) {
  try {
    if (namespaces) {
      storage?.setItem("debug", namespaces);
    } else {
      storage?.removeItem("debug");
    }
  } catch (error) {
  }
}
__name(save, "save");
function load() {
  let r;
  try {
    r = storage?.getItem("debug");
  } catch (error) {
  }
  if (!r && typeof process !== "undefined" && "env" in process) {
    r = process.env.DEBUG;
  }
  return r;
}
__name(load, "load");
function localstorage() {
  try {
    return localStorage;
  } catch (error) {
  }
}
__name(localstorage, "localstorage");
function setupFormatters(formatters) {
  formatters.j = function(v) {
    try {
      return JSON.stringify(v);
    } catch (error) {
      return "[UnexpectedJSONParseError]: " + error.message;
    }
  };
}
__name(setupFormatters, "setupFormatters");
var browser_default = setup({ formatArgs, save, load, useColors, setupFormatters, colors, storage, log });

// node_modules/weald/dist/src/index.js
var src_default = browser_default;

// node_modules/@libp2p/logger/dist/src/index.js
src_default.formatters.b = (v) => {
  return v == null ? "undefined" : base58btc.baseEncode(v);
};
src_default.formatters.t = (v) => {
  return v == null ? "undefined" : base32.baseEncode(v);
};
src_default.formatters.m = (v) => {
  return v == null ? "undefined" : base64.baseEncode(v);
};
src_default.formatters.p = (v) => {
  return v == null ? "undefined" : v.toString();
};
src_default.formatters.c = (v) => {
  return v == null ? "undefined" : v.toString();
};
src_default.formatters.k = (v) => {
  return v == null ? "undefined" : v.toString();
};
src_default.formatters.a = (v) => {
  return v == null ? "undefined" : v.toString();
};
function createDisabledLogger(namespace) {
  const logger2 = /* @__PURE__ */ __name(() => {
  }, "logger");
  logger2.enabled = false;
  logger2.color = "";
  logger2.diff = 0;
  logger2.log = () => {
  };
  logger2.namespace = namespace;
  logger2.destroy = () => true;
  logger2.extend = () => logger2;
  return logger2;
}
__name(createDisabledLogger, "createDisabledLogger");
function defaultLogger() {
  return {
    forComponent(name3) {
      return logger(name3);
    }
  };
}
__name(defaultLogger, "defaultLogger");
function logger(name3) {
  let trace = createDisabledLogger(`${name3}:trace`);
  if (src_default.enabled(`${name3}:trace`) && src_default.names.map((r) => r.toString()).find((n) => n.includes(":trace")) != null) {
    trace = src_default(`${name3}:trace`);
  }
  return Object.assign(src_default(name3), {
    error: src_default(`${name3}:error`),
    trace
  });
}
__name(logger, "logger");

// node_modules/@libp2p/peer-id/dist/src/index.js
var inspect = Symbol.for("nodejs.util.inspect.custom");
var baseDecoder = Object.values(bases).map((codec) => codec.decoder).reduce((acc, curr) => acc.or(curr), bases.identity.decoder);
var LIBP2P_KEY_CODE = 114;
var MARSHALLED_ED225519_PUBLIC_KEY_LENGTH = 36;
var MARSHALLED_SECP256K1_PUBLIC_KEY_LENGTH = 37;
var PeerIdImpl = class {
  static {
    __name(this, "PeerIdImpl");
  }
  type;
  multihash;
  privateKey;
  publicKey;
  string;
  constructor(init) {
    this.type = init.type;
    this.multihash = init.multihash;
    this.privateKey = init.privateKey;
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
  // return self-describing String representation
  // in default format from RFC 0001: https://github.com/libp2p/specs/pull/209
  toCID() {
    return CID.createV1(LIBP2P_KEY_CODE, this.multihash);
  }
  toBytes() {
    return this.multihash.bytes;
  }
  /**
   * Returns Multiaddr as a JSON string
   */
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
      return peerIdFromString(id).equals(this);
    } else if (id?.multihash?.bytes != null) {
      return equals3(this.multihash.bytes, id.multihash.bytes);
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
var RSAPeerIdImpl = class extends PeerIdImpl {
  static {
    __name(this, "RSAPeerIdImpl");
  }
  type = "RSA";
  publicKey;
  constructor(init) {
    super({ ...init, type: "RSA" });
    this.publicKey = init.publicKey;
  }
};
var Ed25519PeerIdImpl = class extends PeerIdImpl {
  static {
    __name(this, "Ed25519PeerIdImpl");
  }
  type = "Ed25519";
  publicKey;
  constructor(init) {
    super({ ...init, type: "Ed25519" });
    this.publicKey = init.multihash.digest;
  }
};
var Secp256k1PeerIdImpl = class extends PeerIdImpl {
  static {
    __name(this, "Secp256k1PeerIdImpl");
  }
  type = "secp256k1";
  publicKey;
  constructor(init) {
    super({ ...init, type: "secp256k1" });
    this.publicKey = init.multihash.digest;
  }
};
var TRANSPORT_IPFS_GATEWAY_HTTP_CODE = 2336;
var URLPeerIdImpl = class {
  static {
    __name(this, "URLPeerIdImpl");
  }
  type = "url";
  multihash;
  privateKey;
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
  toCID() {
    return CID.createV1(TRANSPORT_IPFS_GATEWAY_HTTP_CODE, this.multihash);
  }
  toBytes() {
    return this.toCID().bytes;
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
function peerIdFromPeerId(other) {
  if (other.type === "RSA") {
    return new RSAPeerIdImpl(other);
  }
  if (other.type === "Ed25519") {
    return new Ed25519PeerIdImpl(other);
  }
  if (other.type === "secp256k1") {
    return new Secp256k1PeerIdImpl(other);
  }
  throw new CodeError("Not a PeerId", "ERR_INVALID_PARAMETERS");
}
__name(peerIdFromPeerId, "peerIdFromPeerId");
function peerIdFromString(str, decoder) {
  decoder = decoder ?? baseDecoder;
  if (str.charAt(0) === "1" || str.charAt(0) === "Q") {
    const multihash = decode4(base58btc.decode(`z${str}`));
    if (str.startsWith("12D")) {
      return new Ed25519PeerIdImpl({ multihash });
    } else if (str.startsWith("16U")) {
      return new Secp256k1PeerIdImpl({ multihash });
    } else {
      return new RSAPeerIdImpl({ multihash });
    }
  }
  return peerIdFromBytes(baseDecoder.decode(str));
}
__name(peerIdFromString, "peerIdFromString");
function peerIdFromBytes(buf) {
  try {
    const multihash = decode4(buf);
    if (multihash.code === identity.code) {
      if (multihash.digest.length === MARSHALLED_ED225519_PUBLIC_KEY_LENGTH) {
        return new Ed25519PeerIdImpl({ multihash });
      } else if (multihash.digest.length === MARSHALLED_SECP256K1_PUBLIC_KEY_LENGTH) {
        return new Secp256k1PeerIdImpl({ multihash });
      }
    }
    if (multihash.code === sha256.code) {
      return new RSAPeerIdImpl({ multihash });
    }
  } catch {
    return peerIdFromCID(CID.decode(buf));
  }
  throw new Error("Supplied PeerID CID is invalid");
}
__name(peerIdFromBytes, "peerIdFromBytes");
function peerIdFromCID(cid) {
  if (cid?.multihash == null || cid.version == null || cid.version === 1 && cid.code !== LIBP2P_KEY_CODE && cid.code !== TRANSPORT_IPFS_GATEWAY_HTTP_CODE) {
    throw new Error("Supplied PeerID CID is invalid");
  }
  if (cid.code === TRANSPORT_IPFS_GATEWAY_HTTP_CODE) {
    const url = toString2(cid.multihash.digest);
    return new URLPeerIdImpl(new URL(url));
  }
  const multihash = cid.multihash;
  if (multihash.code === sha256.code) {
    return new RSAPeerIdImpl({ multihash: cid.multihash });
  } else if (multihash.code === identity.code) {
    if (multihash.digest.length === MARSHALLED_ED225519_PUBLIC_KEY_LENGTH) {
      return new Ed25519PeerIdImpl({ multihash: cid.multihash });
    } else if (multihash.digest.length === MARSHALLED_SECP256K1_PUBLIC_KEY_LENGTH) {
      return new Secp256k1PeerIdImpl({ multihash: cid.multihash });
    }
  }
  throw new Error("Supplied PeerID CID is invalid");
}
__name(peerIdFromCID, "peerIdFromCID");
async function peerIdFromKeys(publicKey, privateKey) {
  if (publicKey.length === MARSHALLED_ED225519_PUBLIC_KEY_LENGTH) {
    return new Ed25519PeerIdImpl({ multihash: create(identity.code, publicKey), privateKey });
  }
  if (publicKey.length === MARSHALLED_SECP256K1_PUBLIC_KEY_LENGTH) {
    return new Secp256k1PeerIdImpl({ multihash: create(identity.code, publicKey), privateKey });
  }
  return new RSAPeerIdImpl({ multihash: await sha256.digest(publicKey), publicKey, privateKey });
}
__name(peerIdFromKeys, "peerIdFromKeys");

// node_modules/@libp2p/peer-collections/dist/src/util.js
function mapIterable(iter, map) {
  const iterator = {
    [Symbol.iterator]: () => {
      return iterator;
    },
    next: /* @__PURE__ */ __name(() => {
      const next = iter.next();
      const val = next.value;
      if (next.done === true || val == null) {
        const result = {
          done: true,
          value: void 0
        };
        return result;
      }
      return {
        done: false,
        value: map(val)
      };
    }, "next")
  };
  return iterator;
}
__name(mapIterable, "mapIterable");

// node_modules/@libp2p/peer-collections/dist/src/map.js
var PeerMap = class {
  static {
    __name(this, "PeerMap");
  }
  map;
  constructor(map) {
    this.map = /* @__PURE__ */ new Map();
    if (map != null) {
      for (const [key, value] of map.entries()) {
        this.map.set(key.toString(), value);
      }
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  clear() {
    this.map.clear();
  }
  delete(peer) {
    return this.map.delete(peer.toString());
  }
  entries() {
    return mapIterable(this.map.entries(), (val) => {
      return [peerIdFromString(val[0]), val[1]];
    });
  }
  forEach(fn) {
    this.map.forEach((value, key) => {
      fn(value, peerIdFromString(key), this);
    });
  }
  get(peer) {
    return this.map.get(peer.toString());
  }
  has(peer) {
    return this.map.has(peer.toString());
  }
  set(peer, value) {
    this.map.set(peer.toString(), value);
  }
  keys() {
    return mapIterable(this.map.keys(), (val) => {
      return peerIdFromString(val);
    });
  }
  values() {
    return this.map.values();
  }
  get size() {
    return this.map.size;
  }
};

// node_modules/@libp2p/peer-collections/dist/src/set.js
var PeerSet = class _PeerSet {
  static {
    __name(this, "PeerSet");
  }
  set;
  constructor(set) {
    this.set = /* @__PURE__ */ new Set();
    if (set != null) {
      for (const key of set) {
        this.set.add(key.toString());
      }
    }
  }
  get size() {
    return this.set.size;
  }
  [Symbol.iterator]() {
    return this.values();
  }
  add(peer) {
    this.set.add(peer.toString());
  }
  clear() {
    this.set.clear();
  }
  delete(peer) {
    this.set.delete(peer.toString());
  }
  entries() {
    return mapIterable(this.set.entries(), (val) => {
      const peerId2 = peerIdFromString(val[0]);
      return [peerId2, peerId2];
    });
  }
  forEach(predicate) {
    this.set.forEach((str) => {
      const id = peerIdFromString(str);
      predicate(id, id, this);
    });
  }
  has(peer) {
    return this.set.has(peer.toString());
  }
  values() {
    return mapIterable(this.set.values(), (val) => {
      return peerIdFromString(val);
    });
  }
  intersection(other) {
    const output2 = new _PeerSet();
    for (const peerId2 of other) {
      if (this.has(peerId2)) {
        output2.add(peerId2);
      }
    }
    return output2;
  }
  difference(other) {
    const output2 = new _PeerSet();
    for (const peerId2 of this) {
      if (!other.has(peerId2)) {
        output2.add(peerId2);
      }
    }
    return output2;
  }
  union(other) {
    const output2 = new _PeerSet();
    for (const peerId2 of other) {
      output2.add(peerId2);
    }
    for (const peerId2 of this) {
      output2.add(peerId2);
    }
    return output2;
  }
};

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

// node_modules/@libp2p/utils/dist/src/filters/fingerprint.js
var MAX_FINGERPRINT_SIZE = 64;
var Fingerprint = class {
  static {
    __name(this, "Fingerprint");
  }
  fp;
  h;
  seed;
  constructor(buf, hash2, seed, fingerprintSize = 2) {
    if (fingerprintSize > MAX_FINGERPRINT_SIZE) {
      throw new TypeError("Invalid Fingerprint Size");
    }
    const fnv = hash2.hashV(buf, seed);
    const fp = alloc(fingerprintSize);
    for (let i = 0; i < fp.length; i++) {
      fp[i] = fnv[i];
    }
    if (fp.length === 0) {
      fp[0] = 7;
    }
    this.fp = fp;
    this.h = hash2;
    this.seed = seed;
  }
  hash() {
    return this.h.hash(this.fp, this.seed);
  }
  equals(other) {
    if (!(other?.fp instanceof Uint8Array)) {
      return false;
    }
    return equals3(this.fp, other.fp);
  }
};

// node_modules/@libp2p/utils/dist/src/filters/utils.js
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
__name(getRandomInt, "getRandomInt");

// node_modules/@libp2p/utils/dist/src/filters/bucket.js
var Bucket = class {
  static {
    __name(this, "Bucket");
  }
  contents;
  constructor(size) {
    this.contents = new Array(size).fill(null);
  }
  has(fingerprint) {
    if (!(fingerprint instanceof Fingerprint)) {
      throw new TypeError("Invalid Fingerprint");
    }
    return this.contents.some((fp) => {
      return fingerprint.equals(fp);
    });
  }
  add(fingerprint) {
    if (!(fingerprint instanceof Fingerprint)) {
      throw new TypeError("Invalid Fingerprint");
    }
    for (let i = 0; i < this.contents.length; i++) {
      if (this.contents[i] == null) {
        this.contents[i] = fingerprint;
        return true;
      }
    }
    return true;
  }
  swap(fingerprint) {
    if (!(fingerprint instanceof Fingerprint)) {
      throw new TypeError("Invalid Fingerprint");
    }
    const i = getRandomInt(0, this.contents.length - 1);
    const current = this.contents[i];
    this.contents[i] = fingerprint;
    return current;
  }
  remove(fingerprint) {
    if (!(fingerprint instanceof Fingerprint)) {
      throw new TypeError("Invalid Fingerprint");
    }
    const found = this.contents.findIndex((fp) => {
      return fingerprint.equals(fp);
    });
    if (found > -1) {
      this.contents[found] = null;
      return true;
    } else {
      return false;
    }
  }
};

// node_modules/@sindresorhus/fnv1a/index.js
var FNV_PRIMES = {
  32: 16777619n,
  64: 1099511628211n,
  128: 309485009821345068724781371n,
  256: 374144419156711147060143317175368453031918731002211n,
  512: 35835915874844867368919076489095108449946327955754392558399825615420669938882575126094039892345713852759n,
  1024: 5016456510113118655434598811035278955030765345404790744303017523831112055108147451509157692220295382716162651878526895249385292291816524375083746691371804094271873160484737966720260389217684476157468082573n
};
var FNV_OFFSETS = {
  32: 2166136261n,
  64: 14695981039346656037n,
  128: 144066263297769815596495629667062367629n,
  256: 100029257958052580907070968620625704837092796014241193945225284501741471925557n,
  512: 9659303129496669498009435400716310466090418745672637896108374329434462657994582932197716438449813051892206539805784495328239340083876191928701583869517785n,
  1024: 14197795064947621068722070641403218320880622795441933960878474914617582723252296732303717722150864096521202355549365628174669108571814760471015076148029755969804077320157692458563003215304957150157403644460363550505412711285966361610267868082893823963790439336411086884584107735010676915n
};
var cachedEncoder = new globalThis.TextEncoder();
function fnv1aUint8Array(uint8Array, size) {
  const fnvPrime = FNV_PRIMES[size];
  let hash2 = FNV_OFFSETS[size];
  for (let index = 0; index < uint8Array.length; index++) {
    hash2 ^= BigInt(uint8Array[index]);
    hash2 = BigInt.asUintN(size, hash2 * fnvPrime);
  }
  return hash2;
}
__name(fnv1aUint8Array, "fnv1aUint8Array");
function fnv1aEncodeInto(string3, size, utf8Buffer) {
  if (utf8Buffer.length === 0) {
    throw new Error("The `utf8Buffer` option must have a length greater than zero");
  }
  const fnvPrime = FNV_PRIMES[size];
  let hash2 = FNV_OFFSETS[size];
  let remaining = string3;
  while (remaining.length > 0) {
    const result = cachedEncoder.encodeInto(remaining, utf8Buffer);
    remaining = remaining.slice(result.read);
    for (let index = 0; index < result.written; index++) {
      hash2 ^= BigInt(utf8Buffer[index]);
      hash2 = BigInt.asUintN(size, hash2 * fnvPrime);
    }
  }
  return hash2;
}
__name(fnv1aEncodeInto, "fnv1aEncodeInto");
function fnv1a(value, { size = 32, utf8Buffer } = {}) {
  if (!FNV_PRIMES[size]) {
    throw new Error("The `size` option must be one of 32, 64, 128, 256, 512, or 1024");
  }
  if (typeof value === "string") {
    if (utf8Buffer) {
      return fnv1aEncodeInto(value, size, utf8Buffer);
    }
    value = cachedEncoder.encode(value);
  }
  return fnv1aUint8Array(value, size);
}
__name(fnv1a, "fnv1a");

// node_modules/@libp2p/utils/dist/src/filters/hashes.js
var import_murmurhash3js_revisited = __toESM(require_murmurhash3js_revisited(), 1);
var fnv1a2 = {
  hash: /* @__PURE__ */ __name((input) => {
    return Number(fnv1a(input, {
      size: 32
    }));
  }, "hash"),
  hashV: /* @__PURE__ */ __name((input, seed) => {
    return numberToBuffer(fnv1a2.hash(input, seed));
  }, "hashV")
};
function numberToBuffer(num) {
  let hex = num.toString(16);
  if (hex.length % 2 === 1) {
    hex = `0${hex}`;
  }
  return fromString2(hex, "base16");
}
__name(numberToBuffer, "numberToBuffer");

// node_modules/@libp2p/utils/dist/src/filters/cuckoo-filter.js
var maxCuckooCount = 500;
var CuckooFilter = class {
  static {
    __name(this, "CuckooFilter");
  }
  bucketSize;
  filterSize;
  fingerprintSize;
  buckets;
  count;
  hash;
  seed;
  constructor(init) {
    this.filterSize = init.filterSize;
    this.bucketSize = init.bucketSize ?? 4;
    this.fingerprintSize = init.fingerprintSize ?? 2;
    this.count = 0;
    this.buckets = [];
    this.hash = init.hash ?? fnv1a2;
    this.seed = init.seed ?? getRandomInt(0, Math.pow(2, 10));
  }
  add(item) {
    if (typeof item === "string") {
      item = fromString2(item);
    }
    const fingerprint = new Fingerprint(item, this.hash, this.seed, this.fingerprintSize);
    const j = this.hash.hash(item, this.seed) % this.filterSize;
    const k = (j ^ fingerprint.hash()) % this.filterSize;
    if (this.buckets[j] == null) {
      this.buckets[j] = new Bucket(this.bucketSize);
    }
    if (this.buckets[k] == null) {
      this.buckets[k] = new Bucket(this.bucketSize);
    }
    if (this.buckets[j].add(fingerprint) || this.buckets[k].add(fingerprint)) {
      this.count++;
      return true;
    }
    const rand = [j, k];
    let i = rand[getRandomInt(0, rand.length - 1)];
    if (this.buckets[i] == null) {
      this.buckets[i] = new Bucket(this.bucketSize);
    }
    for (let n = 0; n < maxCuckooCount; n++) {
      const swapped = this.buckets[i].swap(fingerprint);
      if (swapped == null) {
        continue;
      }
      i = (i ^ swapped.hash()) % this.filterSize;
      if (this.buckets[i] == null) {
        this.buckets[i] = new Bucket(this.bucketSize);
      }
      if (this.buckets[i].add(swapped)) {
        this.count++;
        return true;
      } else {
        continue;
      }
    }
    return false;
  }
  has(item) {
    if (typeof item === "string") {
      item = fromString2(item);
    }
    const fingerprint = new Fingerprint(item, this.hash, this.seed, this.fingerprintSize);
    const j = this.hash.hash(item, this.seed) % this.filterSize;
    const inJ = this.buckets[j]?.has(fingerprint) ?? false;
    if (inJ) {
      return inJ;
    }
    const k = (j ^ fingerprint.hash()) % this.filterSize;
    return this.buckets[k]?.has(fingerprint) ?? false;
  }
  remove(item) {
    if (typeof item === "string") {
      item = fromString2(item);
    }
    const fingerprint = new Fingerprint(item, this.hash, this.seed, this.fingerprintSize);
    const j = this.hash.hash(item, this.seed) % this.filterSize;
    const inJ = this.buckets[j]?.remove(fingerprint) ?? false;
    if (inJ) {
      this.count--;
      return inJ;
    }
    const k = (j ^ fingerprint.hash()) % this.filterSize;
    const inK = this.buckets[k]?.remove(fingerprint) ?? false;
    if (inK) {
      this.count--;
    }
    return inK;
  }
  get reliable() {
    return Math.floor(100 * (this.count / this.filterSize)) <= 90;
  }
};
var MAX_LOAD = {
  1: 0.5,
  2: 0.84,
  4: 0.95,
  8: 0.98
};
function calculateBucketSize(errorRate = 1e-3) {
  if (errorRate > 2e-3) {
    return 2;
  }
  if (errorRate > 1e-5) {
    return 4;
  }
  return 8;
}
__name(calculateBucketSize, "calculateBucketSize");
function optimize(maxItems, errorRate = 1e-3) {
  const bucketSize = calculateBucketSize(errorRate);
  const load2 = MAX_LOAD[bucketSize];
  const filterSize = Math.round(maxItems / load2);
  const fingerprintSize = Math.min(Math.ceil(Math.log2(1 / errorRate) + Math.log2(2 * bucketSize)), MAX_FINGERPRINT_SIZE);
  return {
    filterSize,
    bucketSize,
    fingerprintSize
  };
}
__name(optimize, "optimize");

// node_modules/@libp2p/utils/dist/src/filters/scalable-cuckoo-filter.js
var ScalableCuckooFilter = class {
  static {
    __name(this, "ScalableCuckooFilter");
  }
  filterSize;
  bucketSize;
  fingerprintSize;
  scale;
  filterSeries;
  hash;
  seed;
  constructor(init) {
    this.bucketSize = init.bucketSize ?? 4;
    this.filterSize = init.filterSize ?? (1 << 18) / this.bucketSize;
    this.fingerprintSize = init.fingerprintSize ?? 2;
    this.scale = init.scale ?? 2;
    this.hash = init.hash ?? fnv1a2;
    this.seed = init.seed ?? getRandomInt(0, Math.pow(2, 10));
    this.filterSeries = [
      new CuckooFilter({
        filterSize: this.filterSize,
        bucketSize: this.bucketSize,
        fingerprintSize: this.fingerprintSize,
        hash: this.hash,
        seed: this.seed
      })
    ];
  }
  add(item) {
    if (typeof item === "string") {
      item = fromString2(item);
    }
    if (this.has(item)) {
      return true;
    }
    let current = this.filterSeries.find((cuckoo) => {
      return cuckoo.reliable;
    });
    if (current == null) {
      const curSize = this.filterSize * Math.pow(this.scale, this.filterSeries.length);
      current = new CuckooFilter({
        filterSize: curSize,
        bucketSize: this.bucketSize,
        fingerprintSize: this.fingerprintSize,
        hash: this.hash,
        seed: this.seed
      });
      this.filterSeries.push(current);
    }
    return current.add(item);
  }
  has(item) {
    if (typeof item === "string") {
      item = fromString2(item);
    }
    for (let i = 0; i < this.filterSeries.length; i++) {
      if (this.filterSeries[i].has(item)) {
        return true;
      }
    }
    return false;
  }
  remove(item) {
    if (typeof item === "string") {
      item = fromString2(item);
    }
    for (let i = 0; i < this.filterSeries.length; i++) {
      if (this.filterSeries[i].remove(item)) {
        return true;
      }
    }
    return false;
  }
  get count() {
    return this.filterSeries.reduce((acc, curr) => {
      return acc + curr.count;
    }, 0);
  }
};
function createScalableCuckooFilter(maxItems, errorRate = 1e-3, options) {
  return new ScalableCuckooFilter({
    ...optimize(maxItems, errorRate),
    ...options ?? {}
  });
}
__name(createScalableCuckooFilter, "createScalableCuckooFilter");

// node_modules/@libp2p/peer-id-factory/node_modules/@libp2p/crypto/dist/src/keys/ed25519-class.js
var ed25519_class_exports2 = {};
__export(ed25519_class_exports2, {
  Ed25519PrivateKey: () => Ed25519PrivateKey2,
  Ed25519PublicKey: () => Ed25519PublicKey2,
  generateKeyPair: () => generateKeyPair4,
  generateKeyPairFromSeed: () => generateKeyPairFromSeed2,
  unmarshalEd25519PrivateKey: () => unmarshalEd25519PrivateKey2,
  unmarshalEd25519PublicKey: () => unmarshalEd25519PublicKey2
});

// node_modules/@libp2p/peer-id-factory/node_modules/@libp2p/crypto/dist/src/util.js
function isPromise2(thing) {
  if (thing == null) {
    return false;
  }
  return typeof thing.then === "function" && typeof thing.catch === "function" && typeof thing.finally === "function";
}
__name(isPromise2, "isPromise");

// node_modules/@libp2p/peer-id-factory/node_modules/@libp2p/crypto/dist/src/keys/ed25519-browser.js
var PUBLIC_KEY_BYTE_LENGTH2 = 32;
var PRIVATE_KEY_BYTE_LENGTH2 = 64;
var KEYS_BYTE_LENGTH2 = 32;
function generateKey4() {
  const privateKeyRaw = ed25519.utils.randomPrivateKey();
  const publicKey = ed25519.getPublicKey(privateKeyRaw);
  const privateKey = concatKeys2(privateKeyRaw, publicKey);
  return {
    privateKey,
    publicKey
  };
}
__name(generateKey4, "generateKey");
function generateKeyFromSeed2(seed) {
  if (seed.length !== KEYS_BYTE_LENGTH2) {
    throw new TypeError('"seed" must be 32 bytes in length.');
  } else if (!(seed instanceof Uint8Array)) {
    throw new TypeError('"seed" must be a node.js Buffer, or Uint8Array.');
  }
  const privateKeyRaw = seed;
  const publicKey = ed25519.getPublicKey(privateKeyRaw);
  const privateKey = concatKeys2(privateKeyRaw, publicKey);
  return {
    privateKey,
    publicKey
  };
}
__name(generateKeyFromSeed2, "generateKeyFromSeed");
function hashAndSign4(privateKey, msg) {
  const privateKeyRaw = privateKey.subarray(0, KEYS_BYTE_LENGTH2);
  return ed25519.sign(msg instanceof Uint8Array ? msg : msg.subarray(), privateKeyRaw);
}
__name(hashAndSign4, "hashAndSign");
function hashAndVerify4(publicKey, sig, msg) {
  return ed25519.verify(sig, msg instanceof Uint8Array ? msg : msg.subarray(), publicKey);
}
__name(hashAndVerify4, "hashAndVerify");
function concatKeys2(privateKeyRaw, publicKey) {
  const privateKey = new Uint8Array(PRIVATE_KEY_BYTE_LENGTH2);
  for (let i = 0; i < KEYS_BYTE_LENGTH2; i++) {
    privateKey[i] = privateKeyRaw[i];
    privateKey[KEYS_BYTE_LENGTH2 + i] = publicKey[i];
  }
  return privateKey;
}
__name(concatKeys2, "concatKeys");

// node_modules/@libp2p/peer-id-factory/node_modules/@libp2p/crypto/dist/src/webcrypto-browser.js
var webcrypto_browser_default2 = {
  get(win = globalThis) {
    const nativeCrypto = win.crypto;
    if (nativeCrypto?.subtle == null) {
      throw Object.assign(new Error("Missing Web Crypto API. The most likely cause of this error is that this page is being accessed from an insecure context (i.e. not HTTPS). For more information and possible resolutions see https://github.com/libp2p/js-libp2p/blob/main/packages/crypto/README.md#web-crypto-api"), { code: "ERR_MISSING_WEB_CRYPTO" });
    }
    return nativeCrypto;
  }
};

// node_modules/@libp2p/peer-id-factory/node_modules/@libp2p/crypto/dist/src/ciphers/aes-gcm.browser.js
var derivedEmptyPasswordKey2 = { alg: "A128GCM", ext: true, k: "scm9jmO_4BJAgdwWGVulLg", key_ops: ["encrypt", "decrypt"], kty: "oct" };
function create3(opts) {
  const algorithm = opts?.algorithm ?? "AES-GCM";
  let keyLength = opts?.keyLength ?? 16;
  const nonceLength = opts?.nonceLength ?? 12;
  const digest2 = opts?.digest ?? "SHA-256";
  const saltLength = opts?.saltLength ?? 16;
  const iterations = opts?.iterations ?? 32767;
  const crypto3 = webcrypto_browser_default2.get();
  keyLength *= 8;
  async function encrypt(data, password) {
    const salt = crypto3.getRandomValues(new Uint8Array(saltLength));
    const nonce = crypto3.getRandomValues(new Uint8Array(nonceLength));
    const aesGcm = { name: algorithm, iv: nonce };
    if (typeof password === "string") {
      password = fromString2(password);
    }
    let cryptoKey;
    if (password.length === 0) {
      cryptoKey = await crypto3.subtle.importKey("jwk", derivedEmptyPasswordKey2, { name: "AES-GCM" }, true, ["encrypt"]);
      try {
        const deriveParams = { name: "PBKDF2", salt, iterations, hash: { name: digest2 } };
        const runtimeDerivedEmptyPassword = await crypto3.subtle.importKey("raw", password, { name: "PBKDF2" }, false, ["deriveKey"]);
        cryptoKey = await crypto3.subtle.deriveKey(deriveParams, runtimeDerivedEmptyPassword, { name: algorithm, length: keyLength }, true, ["encrypt"]);
      } catch {
        cryptoKey = await crypto3.subtle.importKey("jwk", derivedEmptyPasswordKey2, { name: "AES-GCM" }, true, ["encrypt"]);
      }
    } else {
      const deriveParams = { name: "PBKDF2", salt, iterations, hash: { name: digest2 } };
      const rawKey = await crypto3.subtle.importKey("raw", password, { name: "PBKDF2" }, false, ["deriveKey"]);
      cryptoKey = await crypto3.subtle.deriveKey(deriveParams, rawKey, { name: algorithm, length: keyLength }, true, ["encrypt"]);
    }
    const ciphertext = await crypto3.subtle.encrypt(aesGcm, cryptoKey, data);
    return concat([salt, aesGcm.iv, new Uint8Array(ciphertext)]);
  }
  __name(encrypt, "encrypt");
  async function decrypt(data, password) {
    const salt = data.subarray(0, saltLength);
    const nonce = data.subarray(saltLength, saltLength + nonceLength);
    const ciphertext = data.subarray(saltLength + nonceLength);
    const aesGcm = { name: algorithm, iv: nonce };
    if (typeof password === "string") {
      password = fromString2(password);
    }
    let cryptoKey;
    if (password.length === 0) {
      try {
        const deriveParams = { name: "PBKDF2", salt, iterations, hash: { name: digest2 } };
        const runtimeDerivedEmptyPassword = await crypto3.subtle.importKey("raw", password, { name: "PBKDF2" }, false, ["deriveKey"]);
        cryptoKey = await crypto3.subtle.deriveKey(deriveParams, runtimeDerivedEmptyPassword, { name: algorithm, length: keyLength }, true, ["decrypt"]);
      } catch {
        cryptoKey = await crypto3.subtle.importKey("jwk", derivedEmptyPasswordKey2, { name: "AES-GCM" }, true, ["decrypt"]);
      }
    } else {
      const deriveParams = { name: "PBKDF2", salt, iterations, hash: { name: digest2 } };
      const rawKey = await crypto3.subtle.importKey("raw", password, { name: "PBKDF2" }, false, ["deriveKey"]);
      cryptoKey = await crypto3.subtle.deriveKey(deriveParams, rawKey, { name: algorithm, length: keyLength }, true, ["decrypt"]);
    }
    const plaintext = await crypto3.subtle.decrypt(aesGcm, cryptoKey, ciphertext);
    return new Uint8Array(plaintext);
  }
  __name(decrypt, "decrypt");
  const cipher = {
    encrypt,
    decrypt
  };
  return cipher;
}
__name(create3, "create");

// node_modules/@libp2p/peer-id-factory/node_modules/@libp2p/crypto/dist/src/keys/exporter.js
async function exporter2(privateKey, password) {
  const cipher = create3();
  const encryptedKey = await cipher.encrypt(privateKey, password);
  return base64.encode(encryptedKey);
}
__name(exporter2, "exporter");

// node_modules/@libp2p/peer-id-factory/node_modules/@libp2p/crypto/dist/src/keys/keys.js
var KeyType2;
(function(KeyType4) {
  KeyType4["RSA"] = "RSA";
  KeyType4["Ed25519"] = "Ed25519";
  KeyType4["Secp256k1"] = "Secp256k1";
})(KeyType2 || (KeyType2 = {}));
var __KeyTypeValues2;
(function(__KeyTypeValues4) {
  __KeyTypeValues4[__KeyTypeValues4["RSA"] = 0] = "RSA";
  __KeyTypeValues4[__KeyTypeValues4["Ed25519"] = 1] = "Ed25519";
  __KeyTypeValues4[__KeyTypeValues4["Secp256k1"] = 2] = "Secp256k1";
})(__KeyTypeValues2 || (__KeyTypeValues2 = {}));
(function(KeyType4) {
  KeyType4.codec = () => {
    return enumeration(__KeyTypeValues2);
  };
})(KeyType2 || (KeyType2 = {}));
var PublicKey2;
(function(PublicKey4) {
  let _codec;
  PublicKey4.codec = () => {
    if (_codec == null) {
      _codec = message((obj, w2, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w2.fork();
        }
        if (obj.Type != null) {
          w2.uint32(8);
          KeyType2.codec().encode(obj.Type, w2);
        }
        if (obj.Data != null) {
          w2.uint32(18);
          w2.bytes(obj.Data);
        }
        if (opts.lengthDelimited !== false) {
          w2.ldelim();
        }
      }, (reader, length3) => {
        const obj = {};
        const end = length3 == null ? reader.len : reader.pos + length3;
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              obj.Type = KeyType2.codec().decode(reader);
              break;
            case 2:
              obj.Data = reader.bytes();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return obj;
      });
    }
    return _codec;
  };
  PublicKey4.encode = (obj) => {
    return encodeMessage(obj, PublicKey4.codec());
  };
  PublicKey4.decode = (buf) => {
    return decodeMessage(buf, PublicKey4.codec());
  };
})(PublicKey2 || (PublicKey2 = {}));
var PrivateKey2;
(function(PrivateKey4) {
  let _codec;
  PrivateKey4.codec = () => {
    if (_codec == null) {
      _codec = message((obj, w2, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w2.fork();
        }
        if (obj.Type != null) {
          w2.uint32(8);
          KeyType2.codec().encode(obj.Type, w2);
        }
        if (obj.Data != null) {
          w2.uint32(18);
          w2.bytes(obj.Data);
        }
        if (opts.lengthDelimited !== false) {
          w2.ldelim();
        }
      }, (reader, length3) => {
        const obj = {};
        const end = length3 == null ? reader.len : reader.pos + length3;
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              obj.Type = KeyType2.codec().decode(reader);
              break;
            case 2:
              obj.Data = reader.bytes();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return obj;
      });
    }
    return _codec;
  };
  PrivateKey4.encode = (obj) => {
    return encodeMessage(obj, PrivateKey4.codec());
  };
  PrivateKey4.decode = (buf) => {
    return decodeMessage(buf, PrivateKey4.codec());
  };
})(PrivateKey2 || (PrivateKey2 = {}));

// node_modules/@libp2p/peer-id-factory/node_modules/@libp2p/crypto/dist/src/keys/ed25519-class.js
var Ed25519PublicKey2 = class {
  static {
    __name(this, "Ed25519PublicKey");
  }
  _key;
  constructor(key) {
    this._key = ensureKey2(key, PUBLIC_KEY_BYTE_LENGTH2);
  }
  verify(data, sig) {
    return hashAndVerify4(this._key, sig, data);
  }
  marshal() {
    return this._key;
  }
  get bytes() {
    return PublicKey2.encode({
      Type: KeyType2.Ed25519,
      Data: this.marshal()
    }).subarray();
  }
  equals(key) {
    return equals3(this.bytes, key.bytes);
  }
  hash() {
    const p = sha256.digest(this.bytes);
    if (isPromise2(p)) {
      return p.then(({ bytes: bytes2 }) => bytes2);
    }
    return p.bytes;
  }
};
var Ed25519PrivateKey2 = class {
  static {
    __name(this, "Ed25519PrivateKey");
  }
  _key;
  _publicKey;
  // key       - 64 byte Uint8Array containing private key
  // publicKey - 32 byte Uint8Array containing public key
  constructor(key, publicKey) {
    this._key = ensureKey2(key, PRIVATE_KEY_BYTE_LENGTH2);
    this._publicKey = ensureKey2(publicKey, PUBLIC_KEY_BYTE_LENGTH2);
  }
  sign(message2) {
    return hashAndSign4(this._key, message2);
  }
  get public() {
    return new Ed25519PublicKey2(this._publicKey);
  }
  marshal() {
    return this._key;
  }
  get bytes() {
    return PrivateKey2.encode({
      Type: KeyType2.Ed25519,
      Data: this.marshal()
    }).subarray();
  }
  equals(key) {
    return equals3(this.bytes, key.bytes);
  }
  async hash() {
    const p = sha256.digest(this.bytes);
    let bytes2;
    if (isPromise2(p)) {
      ({ bytes: bytes2 } = await p);
    } else {
      bytes2 = p.bytes;
    }
    return bytes2;
  }
  /**
   * Gets the ID of the key.
   *
   * The key id is the base58 encoding of the identity multihash containing its public key.
   * The public key is a protobuf encoding containing a type and the DER encoding
   * of the PKCS SubjectPublicKeyInfo.
   *
   * @returns {Promise<string>}
   */
  async id() {
    const encoding = identity.digest(this.public.bytes);
    return base58btc.encode(encoding.bytes).substring(1);
  }
  /**
   * Exports the key into a password protected `format`
   */
  async export(password, format2 = "libp2p-key") {
    if (format2 === "libp2p-key") {
      return exporter2(this.bytes, password);
    } else {
      throw new CodeError(`export format '${format2}' is not supported`, "ERR_INVALID_EXPORT_FORMAT");
    }
  }
};
function unmarshalEd25519PrivateKey2(bytes2) {
  if (bytes2.length > PRIVATE_KEY_BYTE_LENGTH2) {
    bytes2 = ensureKey2(bytes2, PRIVATE_KEY_BYTE_LENGTH2 + PUBLIC_KEY_BYTE_LENGTH2);
    const privateKeyBytes2 = bytes2.subarray(0, PRIVATE_KEY_BYTE_LENGTH2);
    const publicKeyBytes2 = bytes2.subarray(PRIVATE_KEY_BYTE_LENGTH2, bytes2.length);
    return new Ed25519PrivateKey2(privateKeyBytes2, publicKeyBytes2);
  }
  bytes2 = ensureKey2(bytes2, PRIVATE_KEY_BYTE_LENGTH2);
  const privateKeyBytes = bytes2.subarray(0, PRIVATE_KEY_BYTE_LENGTH2);
  const publicKeyBytes = bytes2.subarray(PUBLIC_KEY_BYTE_LENGTH2);
  return new Ed25519PrivateKey2(privateKeyBytes, publicKeyBytes);
}
__name(unmarshalEd25519PrivateKey2, "unmarshalEd25519PrivateKey");
function unmarshalEd25519PublicKey2(bytes2) {
  bytes2 = ensureKey2(bytes2, PUBLIC_KEY_BYTE_LENGTH2);
  return new Ed25519PublicKey2(bytes2);
}
__name(unmarshalEd25519PublicKey2, "unmarshalEd25519PublicKey");
async function generateKeyPair4() {
  const { privateKey, publicKey } = generateKey4();
  return new Ed25519PrivateKey2(privateKey, publicKey);
}
__name(generateKeyPair4, "generateKeyPair");
async function generateKeyPairFromSeed2(seed) {
  const { privateKey, publicKey } = generateKeyFromSeed2(seed);
  return new Ed25519PrivateKey2(privateKey, publicKey);
}
__name(generateKeyPairFromSeed2, "generateKeyPairFromSeed");
function ensureKey2(key, length3) {
  key = Uint8Array.from(key ?? []);
  if (key.length !== length3) {
    throw new CodeError(`Key must be a Uint8Array of length ${length3}, got ${key.length}`, "ERR_INVALID_KEY_TYPE");
  }
  return key;
}
__name(ensureKey2, "ensureKey");

// node_modules/@libp2p/peer-id-factory/node_modules/@libp2p/crypto/dist/src/keys/rsa-class.js
var rsa_class_exports2 = {};
__export(rsa_class_exports2, {
  MAX_RSA_KEY_SIZE: () => MAX_RSA_KEY_SIZE2,
  RsaPrivateKey: () => RsaPrivateKey2,
  RsaPublicKey: () => RsaPublicKey2,
  fromJwk: () => fromJwk2,
  generateKeyPair: () => generateKeyPair5,
  unmarshalRsaPrivateKey: () => unmarshalRsaPrivateKey2,
  unmarshalRsaPublicKey: () => unmarshalRsaPublicKey2
});

// node_modules/@libp2p/peer-id-factory/node_modules/@libp2p/crypto/dist/src/random-bytes.js
function randomBytes3(length3) {
  if (isNaN(length3) || length3 <= 0) {
    throw new CodeError("random bytes length must be a Number bigger than 0", "ERR_INVALID_LENGTH");
  }
  return randomBytes(length3);
}
__name(randomBytes3, "randomBytes");

// node_modules/@libp2p/peer-id-factory/node_modules/@libp2p/crypto/dist/src/keys/rsa-utils.js
var rsa_utils_exports2 = {};
__export(rsa_utils_exports2, {
  exportToPem: () => exportToPem2,
  importFromPem: () => importFromPem2,
  jwkToPkcs1: () => jwkToPkcs12,
  jwkToPkix: () => jwkToPkix2,
  pkcs1ToJwk: () => pkcs1ToJwk2,
  pkixToJwk: () => pkixToJwk2
});
function pkcs1ToJwk2(bytes2) {
  const { result } = fromBER(bytes2);
  const values = result.valueBlock.value;
  const key = {
    n: toString2(bnToBuf2(values[1].toBigInt()), "base64url"),
    e: toString2(bnToBuf2(values[2].toBigInt()), "base64url"),
    d: toString2(bnToBuf2(values[3].toBigInt()), "base64url"),
    p: toString2(bnToBuf2(values[4].toBigInt()), "base64url"),
    q: toString2(bnToBuf2(values[5].toBigInt()), "base64url"),
    dp: toString2(bnToBuf2(values[6].toBigInt()), "base64url"),
    dq: toString2(bnToBuf2(values[7].toBigInt()), "base64url"),
    qi: toString2(bnToBuf2(values[8].toBigInt()), "base64url"),
    kty: "RSA",
    alg: "RS256"
  };
  return key;
}
__name(pkcs1ToJwk2, "pkcs1ToJwk");
function jwkToPkcs12(jwk) {
  if (jwk.n == null || jwk.e == null || jwk.d == null || jwk.p == null || jwk.q == null || jwk.dp == null || jwk.dq == null || jwk.qi == null) {
    throw new CodeError("JWK was missing components", "ERR_INVALID_PARAMETERS");
  }
  const root = new Sequence({
    value: [
      new Integer({ value: 0 }),
      Integer.fromBigInt(bufToBn2(fromString2(jwk.n, "base64url"))),
      Integer.fromBigInt(bufToBn2(fromString2(jwk.e, "base64url"))),
      Integer.fromBigInt(bufToBn2(fromString2(jwk.d, "base64url"))),
      Integer.fromBigInt(bufToBn2(fromString2(jwk.p, "base64url"))),
      Integer.fromBigInt(bufToBn2(fromString2(jwk.q, "base64url"))),
      Integer.fromBigInt(bufToBn2(fromString2(jwk.dp, "base64url"))),
      Integer.fromBigInt(bufToBn2(fromString2(jwk.dq, "base64url"))),
      Integer.fromBigInt(bufToBn2(fromString2(jwk.qi, "base64url")))
    ]
  });
  const der = root.toBER();
  return new Uint8Array(der, 0, der.byteLength);
}
__name(jwkToPkcs12, "jwkToPkcs1");
function pkixToJwk2(bytes2) {
  const { result } = fromBER(bytes2);
  const values = result.valueBlock.value[1].valueBlock.value[0].valueBlock.value;
  return {
    kty: "RSA",
    n: toString2(bnToBuf2(values[0].toBigInt()), "base64url"),
    e: toString2(bnToBuf2(values[1].toBigInt()), "base64url")
  };
}
__name(pkixToJwk2, "pkixToJwk");
function jwkToPkix2(jwk) {
  if (jwk.n == null || jwk.e == null) {
    throw new CodeError("JWK was missing components", "ERR_INVALID_PARAMETERS");
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
            Integer.fromBigInt(bufToBn2(fromString2(jwk.n, "base64url"))),
            Integer.fromBigInt(bufToBn2(fromString2(jwk.e, "base64url")))
          ]
        }).toBER()
      })
    ]
  });
  const der = root.toBER();
  return new Uint8Array(der, 0, der.byteLength);
}
__name(jwkToPkix2, "jwkToPkix");
function bnToBuf2(bn) {
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
__name(bnToBuf2, "bnToBuf");
function bufToBn2(u8) {
  const hex = [];
  u8.forEach(function(i) {
    let h2 = i.toString(16);
    if (h2.length % 2 > 0) {
      h2 = `0${h2}`;
    }
    hex.push(h2);
  });
  return BigInt("0x" + hex.join(""));
}
__name(bufToBn2, "bufToBn");
var SALT_LENGTH2 = 16;
var KEY_SIZE2 = 32;
var ITERATIONS2 = 1e4;
async function exportToPem2(privateKey, password) {
  const crypto3 = webcrypto_browser_default2.get();
  const keyWrapper = new Sequence({
    value: [
      // version (0)
      new Integer({ value: 0 }),
      // privateKeyAlgorithm
      new Sequence({
        value: [
          // rsaEncryption OID
          new ObjectIdentifier({
            value: "1.2.840.113549.1.1.1"
          }),
          new Null()
        ]
      }),
      // PrivateKey
      new OctetString({
        valueHex: privateKey.marshal()
      })
    ]
  });
  const keyBuf = keyWrapper.toBER();
  const keyArr = new Uint8Array(keyBuf, 0, keyBuf.byteLength);
  const salt = randomBytes3(SALT_LENGTH2);
  const encryptionKey = await pbkdf2Async(sha5122, password, salt, {
    c: ITERATIONS2,
    dkLen: KEY_SIZE2
  });
  const iv = randomBytes3(16);
  const cryptoKey = await crypto3.subtle.importKey("raw", encryptionKey, "AES-CBC", false, ["encrypt"]);
  const encrypted = await crypto3.subtle.encrypt({
    name: "AES-CBC",
    iv
  }, cryptoKey, keyArr);
  const pbkdf2Params = new Sequence({
    value: [
      // salt
      new OctetString({ valueHex: salt }),
      // iteration count
      new Integer({ value: ITERATIONS2 }),
      // key length
      new Integer({ value: KEY_SIZE2 }),
      // AlgorithmIdentifier
      new Sequence({
        value: [
          // hmacWithSHA512
          new ObjectIdentifier({ value: "1.2.840.113549.2.11" }),
          new Null()
        ]
      })
    ]
  });
  const encryptionAlgorithm = new Sequence({
    value: [
      // pkcs5PBES2
      new ObjectIdentifier({
        value: "1.2.840.113549.1.5.13"
      }),
      new Sequence({
        value: [
          // keyDerivationFunc
          new Sequence({
            value: [
              // pkcs5PBKDF2
              new ObjectIdentifier({
                value: "1.2.840.113549.1.5.12"
              }),
              // PBKDF2-params
              pbkdf2Params
            ]
          }),
          // encryptionScheme
          new Sequence({
            value: [
              // aes256-CBC
              new ObjectIdentifier({
                value: "2.16.840.1.101.3.4.1.42"
              }),
              // iv
              new OctetString({
                valueHex: iv
              })
            ]
          })
        ]
      })
    ]
  });
  const finalWrapper = new Sequence({
    value: [
      encryptionAlgorithm,
      new OctetString({ valueHex: encrypted })
    ]
  });
  const finalWrapperBuf = finalWrapper.toBER();
  const finalWrapperArr = new Uint8Array(finalWrapperBuf, 0, finalWrapperBuf.byteLength);
  return [
    "-----BEGIN ENCRYPTED PRIVATE KEY-----",
    ...toString2(finalWrapperArr, "base64pad").split(/(.{64})/).filter(Boolean),
    "-----END ENCRYPTED PRIVATE KEY-----"
  ].join("\n");
}
__name(exportToPem2, "exportToPem");
async function importFromPem2(pem, password) {
  const crypto3 = webcrypto_browser_default2.get();
  let plaintext;
  if (pem.includes("-----BEGIN ENCRYPTED PRIVATE KEY-----")) {
    const key = fromString2(pem.replace("-----BEGIN ENCRYPTED PRIVATE KEY-----", "").replace("-----END ENCRYPTED PRIVATE KEY-----", "").replace(/\n/g, "").trim(), "base64pad");
    const { result } = fromBER(key);
    const { iv, salt, iterations, keySize: keySize4, cipherText } = findEncryptedPEMData2(result);
    const encryptionKey = await pbkdf2Async(sha5122, password, salt, {
      c: iterations,
      dkLen: keySize4
    });
    const cryptoKey = await crypto3.subtle.importKey("raw", encryptionKey, "AES-CBC", false, ["decrypt"]);
    const decrypted = toUint8Array2(await crypto3.subtle.decrypt({
      name: "AES-CBC",
      iv
    }, cryptoKey, cipherText));
    const { result: decryptedResult } = fromBER(decrypted);
    plaintext = findPEMData2(decryptedResult);
  } else if (pem.includes("-----BEGIN PRIVATE KEY-----")) {
    const key = fromString2(pem.replace("-----BEGIN PRIVATE KEY-----", "").replace("-----END PRIVATE KEY-----", "").replace(/\n/g, "").trim(), "base64pad");
    const { result } = fromBER(key);
    plaintext = findPEMData2(result);
  } else {
    throw new CodeError("Could not parse private key from PEM data", "ERR_INVALID_PARAMETERS");
  }
  return unmarshalRsaPrivateKey2(plaintext);
}
__name(importFromPem2, "importFromPem");
function findEncryptedPEMData2(root) {
  const encryptionAlgorithm = root.valueBlock.value[0];
  const scheme = encryptionAlgorithm.valueBlock.value[0].toString();
  if (scheme !== "OBJECT IDENTIFIER : 1.2.840.113549.1.5.13") {
    throw new CodeError("Only pkcs5PBES2 encrypted private keys are supported", "ERR_INVALID_PARAMS");
  }
  const keyDerivationFunc = encryptionAlgorithm.valueBlock.value[1].valueBlock.value[0];
  const keyDerivationFuncName = keyDerivationFunc.valueBlock.value[0].toString();
  if (keyDerivationFuncName !== "OBJECT IDENTIFIER : 1.2.840.113549.1.5.12") {
    throw new CodeError("Only pkcs5PBKDF2 key derivation functions are supported", "ERR_INVALID_PARAMS");
  }
  const pbkdf2Params = keyDerivationFunc.valueBlock.value[1];
  const salt = toUint8Array2(pbkdf2Params.valueBlock.value[0].getValue());
  let iterations = ITERATIONS2;
  let keySize4 = KEY_SIZE2;
  if (pbkdf2Params.valueBlock.value.length === 3) {
    iterations = Number(pbkdf2Params.valueBlock.value[1].toBigInt());
    keySize4 = Number(pbkdf2Params.valueBlock.value[2].toBigInt());
  } else if (pbkdf2Params.valueBlock.value.length === 2) {
    throw new CodeError("Could not derive key size and iterations from PEM file - please use @libp2p/rsa to re-import your key", "ERR_INVALID_PARAMS");
  }
  const encryptionScheme = encryptionAlgorithm.valueBlock.value[1].valueBlock.value[1];
  const encryptionSchemeName = encryptionScheme.valueBlock.value[0].toString();
  if (encryptionSchemeName === "OBJECT IDENTIFIER : 1.2.840.113549.3.7") {
  } else if (encryptionSchemeName === "OBJECT IDENTIFIER : 1.3.14.3.2.7") {
  } else if (encryptionSchemeName === "OBJECT IDENTIFIER : 2.16.840.1.101.3.4.1.2") {
  } else if (encryptionSchemeName === "OBJECT IDENTIFIER : 2.16.840.1.101.3.4.1.22") {
  } else if (encryptionSchemeName === "OBJECT IDENTIFIER : 2.16.840.1.101.3.4.1.42") {
  } else {
    throw new CodeError("Only AES-CBC encryption schemes are supported", "ERR_INVALID_PARAMS");
  }
  const iv = toUint8Array2(encryptionScheme.valueBlock.value[1].getValue());
  return {
    cipherText: toUint8Array2(root.valueBlock.value[1].getValue()),
    salt,
    iterations,
    keySize: keySize4,
    iv
  };
}
__name(findEncryptedPEMData2, "findEncryptedPEMData");
function findPEMData2(seq) {
  return toUint8Array2(seq.valueBlock.value[2].getValue());
}
__name(findPEMData2, "findPEMData");
function toUint8Array2(buf) {
  return new Uint8Array(buf, 0, buf.byteLength);
}
__name(toUint8Array2, "toUint8Array");

// node_modules/@libp2p/peer-id-factory/node_modules/@libp2p/crypto/dist/src/keys/rsa-browser.js
async function generateKey5(bits) {
  const pair = await webcrypto_browser_default2.get().subtle.generateKey({
    name: "RSASSA-PKCS1-v1_5",
    modulusLength: bits,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: { name: "SHA-256" }
  }, true, ["sign", "verify"]);
  const keys = await exportKey2(pair);
  return {
    privateKey: keys[0],
    publicKey: keys[1]
  };
}
__name(generateKey5, "generateKey");
async function unmarshalPrivateKey3(key) {
  const privateKey = await webcrypto_browser_default2.get().subtle.importKey("jwk", key, {
    name: "RSASSA-PKCS1-v1_5",
    hash: { name: "SHA-256" }
  }, true, ["sign"]);
  const pair = [
    privateKey,
    await derivePublicFromPrivate2(key)
  ];
  const keys = await exportKey2({
    privateKey: pair[0],
    publicKey: pair[1]
  });
  return {
    privateKey: keys[0],
    publicKey: keys[1]
  };
}
__name(unmarshalPrivateKey3, "unmarshalPrivateKey");
async function hashAndSign5(key, msg) {
  const privateKey = await webcrypto_browser_default2.get().subtle.importKey("jwk", key, {
    name: "RSASSA-PKCS1-v1_5",
    hash: { name: "SHA-256" }
  }, false, ["sign"]);
  const sig = await webcrypto_browser_default2.get().subtle.sign({ name: "RSASSA-PKCS1-v1_5" }, privateKey, msg instanceof Uint8Array ? msg : msg.subarray());
  return new Uint8Array(sig, 0, sig.byteLength);
}
__name(hashAndSign5, "hashAndSign");
async function hashAndVerify5(key, sig, msg) {
  const publicKey = await webcrypto_browser_default2.get().subtle.importKey("jwk", key, {
    name: "RSASSA-PKCS1-v1_5",
    hash: { name: "SHA-256" }
  }, false, ["verify"]);
  return webcrypto_browser_default2.get().subtle.verify({ name: "RSASSA-PKCS1-v1_5" }, publicKey, sig, msg instanceof Uint8Array ? msg : msg.subarray());
}
__name(hashAndVerify5, "hashAndVerify");
async function exportKey2(pair) {
  if (pair.privateKey == null || pair.publicKey == null) {
    throw new CodeError("Private and public key are required", "ERR_INVALID_PARAMETERS");
  }
  return Promise.all([
    webcrypto_browser_default2.get().subtle.exportKey("jwk", pair.privateKey),
    webcrypto_browser_default2.get().subtle.exportKey("jwk", pair.publicKey)
  ]);
}
__name(exportKey2, "exportKey");
async function derivePublicFromPrivate2(jwKey) {
  return webcrypto_browser_default2.get().subtle.importKey("jwk", {
    kty: jwKey.kty,
    n: jwKey.n,
    e: jwKey.e
  }, {
    name: "RSASSA-PKCS1-v1_5",
    hash: { name: "SHA-256" }
  }, true, ["verify"]);
}
__name(derivePublicFromPrivate2, "derivePublicFromPrivate");
function keySize2(jwk) {
  if (jwk.kty !== "RSA") {
    throw new CodeError("invalid key type", "ERR_INVALID_KEY_TYPE");
  } else if (jwk.n == null) {
    throw new CodeError("invalid key modulus", "ERR_INVALID_KEY_MODULUS");
  }
  const bytes2 = fromString2(jwk.n, "base64url");
  return bytes2.length * 8;
}
__name(keySize2, "keySize");

// node_modules/@libp2p/peer-id-factory/node_modules/@libp2p/crypto/dist/src/keys/rsa-class.js
var MAX_RSA_KEY_SIZE2 = 8192;
var RsaPublicKey2 = class {
  static {
    __name(this, "RsaPublicKey");
  }
  _key;
  constructor(key) {
    this._key = key;
  }
  verify(data, sig) {
    return hashAndVerify5(this._key, sig, data);
  }
  marshal() {
    return rsa_utils_exports2.jwkToPkix(this._key);
  }
  get bytes() {
    return PublicKey2.encode({
      Type: KeyType2.RSA,
      Data: this.marshal()
    }).subarray();
  }
  equals(key) {
    return equals3(this.bytes, key.bytes);
  }
  hash() {
    const p = sha256.digest(this.bytes);
    if (isPromise2(p)) {
      return p.then(({ bytes: bytes2 }) => bytes2);
    }
    return p.bytes;
  }
};
var RsaPrivateKey2 = class {
  static {
    __name(this, "RsaPrivateKey");
  }
  _key;
  _publicKey;
  constructor(key, publicKey) {
    this._key = key;
    this._publicKey = publicKey;
  }
  genSecret() {
    return randomBytes3(16);
  }
  sign(message2) {
    return hashAndSign5(this._key, message2);
  }
  get public() {
    if (this._publicKey == null) {
      throw new CodeError("public key not provided", "ERR_PUBKEY_NOT_PROVIDED");
    }
    return new RsaPublicKey2(this._publicKey);
  }
  marshal() {
    return rsa_utils_exports2.jwkToPkcs1(this._key);
  }
  get bytes() {
    return PrivateKey2.encode({
      Type: KeyType2.RSA,
      Data: this.marshal()
    }).subarray();
  }
  equals(key) {
    return equals3(this.bytes, key.bytes);
  }
  hash() {
    const p = sha256.digest(this.bytes);
    if (isPromise2(p)) {
      return p.then(({ bytes: bytes2 }) => bytes2);
    }
    return p.bytes;
  }
  /**
   * Gets the ID of the key.
   *
   * The key id is the base58 encoding of the SHA-256 multihash of its public key.
   * The public key is a protobuf encoding containing a type and the DER encoding
   * of the PKCS SubjectPublicKeyInfo.
   */
  async id() {
    const hash2 = await this.public.hash();
    return toString2(hash2, "base58btc");
  }
  /**
   * Exports the key as libp2p-key - a aes-gcm encrypted value with the key
   * derived from the password.
   *
   * To export it as a password protected PEM file, please use the `exportPEM`
   * function from `@libp2p/rsa`.
   */
  async export(password, format2 = "pkcs-8") {
    if (format2 === "pkcs-8") {
      return rsa_utils_exports2.exportToPem(this, password);
    } else if (format2 === "libp2p-key") {
      return exporter2(this.bytes, password);
    } else {
      throw new CodeError(`export format '${format2}' is not supported`, "ERR_INVALID_EXPORT_FORMAT");
    }
  }
};
async function unmarshalRsaPrivateKey2(bytes2) {
  const jwk = rsa_utils_exports2.pkcs1ToJwk(bytes2);
  if (keySize2(jwk) > MAX_RSA_KEY_SIZE2) {
    throw new CodeError("key size is too large", "ERR_KEY_SIZE_TOO_LARGE");
  }
  const keys = await unmarshalPrivateKey3(jwk);
  return new RsaPrivateKey2(keys.privateKey, keys.publicKey);
}
__name(unmarshalRsaPrivateKey2, "unmarshalRsaPrivateKey");
function unmarshalRsaPublicKey2(bytes2) {
  const jwk = rsa_utils_exports2.pkixToJwk(bytes2);
  if (keySize2(jwk) > MAX_RSA_KEY_SIZE2) {
    throw new CodeError("key size is too large", "ERR_KEY_SIZE_TOO_LARGE");
  }
  return new RsaPublicKey2(jwk);
}
__name(unmarshalRsaPublicKey2, "unmarshalRsaPublicKey");
async function fromJwk2(jwk) {
  if (keySize2(jwk) > MAX_RSA_KEY_SIZE2) {
    throw new CodeError("key size is too large", "ERR_KEY_SIZE_TOO_LARGE");
  }
  const keys = await unmarshalPrivateKey3(jwk);
  return new RsaPrivateKey2(keys.privateKey, keys.publicKey);
}
__name(fromJwk2, "fromJwk");
async function generateKeyPair5(bits) {
  if (bits > MAX_RSA_KEY_SIZE2) {
    throw new CodeError("key size is too large", "ERR_KEY_SIZE_TOO_LARGE");
  }
  const keys = await generateKey5(bits);
  return new RsaPrivateKey2(keys.privateKey, keys.publicKey);
}
__name(generateKeyPair5, "generateKeyPair");

// node_modules/@libp2p/peer-id-factory/node_modules/@libp2p/crypto/dist/src/keys/secp256k1-class.js
var secp256k1_class_exports2 = {};
__export(secp256k1_class_exports2, {
  Secp256k1PrivateKey: () => Secp256k1PrivateKey2,
  Secp256k1PublicKey: () => Secp256k1PublicKey2,
  generateKeyPair: () => generateKeyPair6,
  unmarshalSecp256k1PrivateKey: () => unmarshalSecp256k1PrivateKey2,
  unmarshalSecp256k1PublicKey: () => unmarshalSecp256k1PublicKey2
});

// node_modules/@libp2p/peer-id-factory/node_modules/@libp2p/crypto/dist/src/keys/secp256k1-browser.js
function generateKey6() {
  return secp256k1.utils.randomPrivateKey();
}
__name(generateKey6, "generateKey");
function hashAndSign6(key, msg) {
  const p = sha256.digest(msg instanceof Uint8Array ? msg : msg.subarray());
  if (isPromise2(p)) {
    return p.then(({ digest: digest2 }) => secp256k1.sign(digest2, key).toDERRawBytes()).catch((err) => {
      throw new CodeError(String(err), "ERR_INVALID_INPUT");
    });
  }
  try {
    return secp256k1.sign(p.digest, key).toDERRawBytes();
  } catch (err) {
    throw new CodeError(String(err), "ERR_INVALID_INPUT");
  }
}
__name(hashAndSign6, "hashAndSign");
function hashAndVerify6(key, sig, msg) {
  const p = sha256.digest(msg instanceof Uint8Array ? msg : msg.subarray());
  if (isPromise2(p)) {
    return p.then(({ digest: digest2 }) => secp256k1.verify(sig, digest2, key)).catch((err) => {
      throw new CodeError(String(err), "ERR_INVALID_INPUT");
    });
  }
  try {
    return secp256k1.verify(sig, p.digest, key);
  } catch (err) {
    throw new CodeError(String(err), "ERR_INVALID_INPUT");
  }
}
__name(hashAndVerify6, "hashAndVerify");
function compressPublicKey2(key) {
  const point = secp256k1.ProjectivePoint.fromHex(key).toRawBytes(true);
  return point;
}
__name(compressPublicKey2, "compressPublicKey");
function validatePrivateKey2(key) {
  try {
    secp256k1.getPublicKey(key, true);
  } catch (err) {
    throw new CodeError(String(err), "ERR_INVALID_PRIVATE_KEY");
  }
}
__name(validatePrivateKey2, "validatePrivateKey");
function validatePublicKey2(key) {
  try {
    secp256k1.ProjectivePoint.fromHex(key);
  } catch (err) {
    throw new CodeError(String(err), "ERR_INVALID_PUBLIC_KEY");
  }
}
__name(validatePublicKey2, "validatePublicKey");
function computePublicKey2(privateKey) {
  try {
    return secp256k1.getPublicKey(privateKey, true);
  } catch (err) {
    throw new CodeError(String(err), "ERR_INVALID_PRIVATE_KEY");
  }
}
__name(computePublicKey2, "computePublicKey");

// node_modules/@libp2p/peer-id-factory/node_modules/@libp2p/crypto/dist/src/keys/secp256k1-class.js
var Secp256k1PublicKey2 = class {
  static {
    __name(this, "Secp256k1PublicKey");
  }
  _key;
  constructor(key) {
    validatePublicKey2(key);
    this._key = key;
  }
  verify(data, sig) {
    return hashAndVerify6(this._key, sig, data);
  }
  marshal() {
    return compressPublicKey2(this._key);
  }
  get bytes() {
    return PublicKey2.encode({
      Type: KeyType2.Secp256k1,
      Data: this.marshal()
    }).subarray();
  }
  equals(key) {
    return equals3(this.bytes, key.bytes);
  }
  async hash() {
    const p = sha256.digest(this.bytes);
    let bytes2;
    if (isPromise2(p)) {
      ({ bytes: bytes2 } = await p);
    } else {
      bytes2 = p.bytes;
    }
    return bytes2;
  }
};
var Secp256k1PrivateKey2 = class {
  static {
    __name(this, "Secp256k1PrivateKey");
  }
  _key;
  _publicKey;
  constructor(key, publicKey) {
    this._key = key;
    this._publicKey = publicKey ?? computePublicKey2(key);
    validatePrivateKey2(this._key);
    validatePublicKey2(this._publicKey);
  }
  sign(message2) {
    return hashAndSign6(this._key, message2);
  }
  get public() {
    return new Secp256k1PublicKey2(this._publicKey);
  }
  marshal() {
    return this._key;
  }
  get bytes() {
    return PrivateKey2.encode({
      Type: KeyType2.Secp256k1,
      Data: this.marshal()
    }).subarray();
  }
  equals(key) {
    return equals3(this.bytes, key.bytes);
  }
  hash() {
    const p = sha256.digest(this.bytes);
    if (isPromise2(p)) {
      return p.then(({ bytes: bytes2 }) => bytes2);
    }
    return p.bytes;
  }
  /**
   * Gets the ID of the key.
   *
   * The key id is the base58 encoding of the SHA-256 multihash of its public key.
   * The public key is a protobuf encoding containing a type and the DER encoding
   * of the PKCS SubjectPublicKeyInfo.
   */
  async id() {
    const hash2 = await this.public.hash();
    return toString2(hash2, "base58btc");
  }
  /**
   * Exports the key into a password protected `format`
   */
  async export(password, format2 = "libp2p-key") {
    if (format2 === "libp2p-key") {
      return exporter2(this.bytes, password);
    } else {
      throw new CodeError(`export format '${format2}' is not supported`, "ERR_INVALID_EXPORT_FORMAT");
    }
  }
};
function unmarshalSecp256k1PrivateKey2(bytes2) {
  return new Secp256k1PrivateKey2(bytes2);
}
__name(unmarshalSecp256k1PrivateKey2, "unmarshalSecp256k1PrivateKey");
function unmarshalSecp256k1PublicKey2(bytes2) {
  return new Secp256k1PublicKey2(bytes2);
}
__name(unmarshalSecp256k1PublicKey2, "unmarshalSecp256k1PublicKey");
async function generateKeyPair6() {
  const privateKeyBytes = generateKey6();
  return new Secp256k1PrivateKey2(privateKeyBytes);
}
__name(generateKeyPair6, "generateKeyPair");

// node_modules/@libp2p/peer-id-factory/node_modules/@libp2p/crypto/dist/src/keys/index.js
var supportedKeys2 = {
  rsa: rsa_class_exports2,
  ed25519: ed25519_class_exports2,
  secp256k1: secp256k1_class_exports2
};
function unsupportedKey2(type) {
  const supported = Object.keys(supportedKeys2).join(" / ");
  return new CodeError(`invalid or unsupported key type ${type}. Must be ${supported}`, "ERR_UNSUPPORTED_KEY_TYPE");
}
__name(unsupportedKey2, "unsupportedKey");
function typeToKey(type) {
  type = type.toLowerCase();
  if (type === "rsa" || type === "ed25519" || type === "secp256k1") {
    return supportedKeys2[type];
  }
  throw unsupportedKey2(type);
}
__name(typeToKey, "typeToKey");
async function generateKeyPair7(type, bits) {
  return typeToKey(type).generateKeyPair(bits ?? 2048);
}
__name(generateKeyPair7, "generateKeyPair");
function marshalPublicKey(key, type) {
  type = (type ?? "rsa").toLowerCase();
  typeToKey(type);
  return key.bytes;
}
__name(marshalPublicKey, "marshalPublicKey");
function marshalPrivateKey(key, type) {
  type = (type ?? "rsa").toLowerCase();
  typeToKey(type);
  return key.bytes;
}
__name(marshalPrivateKey, "marshalPrivateKey");

// node_modules/@libp2p/peer-id-factory/dist/src/index.js
var createEd25519PeerId = /* @__PURE__ */ __name(async () => {
  const key = await generateKeyPair7("Ed25519");
  const id = await createFromPrivKey(key);
  if (id.type === "Ed25519") {
    return id;
  }
  throw new Error(`Generated unexpected PeerId type "${id.type}"`);
}, "createEd25519PeerId");
async function createFromPrivKey(privateKey) {
  return peerIdFromKeys(marshalPublicKey(privateKey.public), marshalPrivateKey(privateKey));
}
__name(createFromPrivKey, "createFromPrivKey");

// node_modules/@libp2p/peer-record/node_modules/@libp2p/crypto/dist/src/keys/ed25519-class.js
var ed25519_class_exports3 = {};
__export(ed25519_class_exports3, {
  Ed25519PrivateKey: () => Ed25519PrivateKey3,
  Ed25519PublicKey: () => Ed25519PublicKey3,
  generateKeyPair: () => generateKeyPair8,
  generateKeyPairFromSeed: () => generateKeyPairFromSeed3,
  unmarshalEd25519PrivateKey: () => unmarshalEd25519PrivateKey3,
  unmarshalEd25519PublicKey: () => unmarshalEd25519PublicKey3
});

// node_modules/@libp2p/peer-record/node_modules/@libp2p/crypto/dist/src/util.js
function isPromise3(thing) {
  if (thing == null) {
    return false;
  }
  return typeof thing.then === "function" && typeof thing.catch === "function" && typeof thing.finally === "function";
}
__name(isPromise3, "isPromise");

// node_modules/@libp2p/peer-record/node_modules/@libp2p/crypto/dist/src/keys/ed25519-browser.js
var PUBLIC_KEY_BYTE_LENGTH3 = 32;
var PRIVATE_KEY_BYTE_LENGTH3 = 64;
var KEYS_BYTE_LENGTH3 = 32;
function generateKey7() {
  const privateKeyRaw = ed25519.utils.randomPrivateKey();
  const publicKey = ed25519.getPublicKey(privateKeyRaw);
  const privateKey = concatKeys3(privateKeyRaw, publicKey);
  return {
    privateKey,
    publicKey
  };
}
__name(generateKey7, "generateKey");
function generateKeyFromSeed3(seed) {
  if (seed.length !== KEYS_BYTE_LENGTH3) {
    throw new TypeError('"seed" must be 32 bytes in length.');
  } else if (!(seed instanceof Uint8Array)) {
    throw new TypeError('"seed" must be a node.js Buffer, or Uint8Array.');
  }
  const privateKeyRaw = seed;
  const publicKey = ed25519.getPublicKey(privateKeyRaw);
  const privateKey = concatKeys3(privateKeyRaw, publicKey);
  return {
    privateKey,
    publicKey
  };
}
__name(generateKeyFromSeed3, "generateKeyFromSeed");
function hashAndSign7(privateKey, msg) {
  const privateKeyRaw = privateKey.subarray(0, KEYS_BYTE_LENGTH3);
  return ed25519.sign(msg instanceof Uint8Array ? msg : msg.subarray(), privateKeyRaw);
}
__name(hashAndSign7, "hashAndSign");
function hashAndVerify7(publicKey, sig, msg) {
  return ed25519.verify(sig, msg instanceof Uint8Array ? msg : msg.subarray(), publicKey);
}
__name(hashAndVerify7, "hashAndVerify");
function concatKeys3(privateKeyRaw, publicKey) {
  const privateKey = new Uint8Array(PRIVATE_KEY_BYTE_LENGTH3);
  for (let i = 0; i < KEYS_BYTE_LENGTH3; i++) {
    privateKey[i] = privateKeyRaw[i];
    privateKey[KEYS_BYTE_LENGTH3 + i] = publicKey[i];
  }
  return privateKey;
}
__name(concatKeys3, "concatKeys");

// node_modules/@libp2p/peer-record/node_modules/@libp2p/crypto/dist/src/webcrypto-browser.js
var webcrypto_browser_default3 = {
  get(win = globalThis) {
    const nativeCrypto = win.crypto;
    if (nativeCrypto?.subtle == null) {
      throw Object.assign(new Error("Missing Web Crypto API. The most likely cause of this error is that this page is being accessed from an insecure context (i.e. not HTTPS). For more information and possible resolutions see https://github.com/libp2p/js-libp2p/blob/main/packages/crypto/README.md#web-crypto-api"), { code: "ERR_MISSING_WEB_CRYPTO" });
    }
    return nativeCrypto;
  }
};

// node_modules/@libp2p/peer-record/node_modules/@libp2p/crypto/dist/src/ciphers/aes-gcm.browser.js
var derivedEmptyPasswordKey3 = { alg: "A128GCM", ext: true, k: "scm9jmO_4BJAgdwWGVulLg", key_ops: ["encrypt", "decrypt"], kty: "oct" };
function create4(opts) {
  const algorithm = opts?.algorithm ?? "AES-GCM";
  let keyLength = opts?.keyLength ?? 16;
  const nonceLength = opts?.nonceLength ?? 12;
  const digest2 = opts?.digest ?? "SHA-256";
  const saltLength = opts?.saltLength ?? 16;
  const iterations = opts?.iterations ?? 32767;
  const crypto3 = webcrypto_browser_default3.get();
  keyLength *= 8;
  async function encrypt(data, password) {
    const salt = crypto3.getRandomValues(new Uint8Array(saltLength));
    const nonce = crypto3.getRandomValues(new Uint8Array(nonceLength));
    const aesGcm = { name: algorithm, iv: nonce };
    if (typeof password === "string") {
      password = fromString2(password);
    }
    let cryptoKey;
    if (password.length === 0) {
      cryptoKey = await crypto3.subtle.importKey("jwk", derivedEmptyPasswordKey3, { name: "AES-GCM" }, true, ["encrypt"]);
      try {
        const deriveParams = { name: "PBKDF2", salt, iterations, hash: { name: digest2 } };
        const runtimeDerivedEmptyPassword = await crypto3.subtle.importKey("raw", password, { name: "PBKDF2" }, false, ["deriveKey"]);
        cryptoKey = await crypto3.subtle.deriveKey(deriveParams, runtimeDerivedEmptyPassword, { name: algorithm, length: keyLength }, true, ["encrypt"]);
      } catch {
        cryptoKey = await crypto3.subtle.importKey("jwk", derivedEmptyPasswordKey3, { name: "AES-GCM" }, true, ["encrypt"]);
      }
    } else {
      const deriveParams = { name: "PBKDF2", salt, iterations, hash: { name: digest2 } };
      const rawKey = await crypto3.subtle.importKey("raw", password, { name: "PBKDF2" }, false, ["deriveKey"]);
      cryptoKey = await crypto3.subtle.deriveKey(deriveParams, rawKey, { name: algorithm, length: keyLength }, true, ["encrypt"]);
    }
    const ciphertext = await crypto3.subtle.encrypt(aesGcm, cryptoKey, data);
    return concat([salt, aesGcm.iv, new Uint8Array(ciphertext)]);
  }
  __name(encrypt, "encrypt");
  async function decrypt(data, password) {
    const salt = data.subarray(0, saltLength);
    const nonce = data.subarray(saltLength, saltLength + nonceLength);
    const ciphertext = data.subarray(saltLength + nonceLength);
    const aesGcm = { name: algorithm, iv: nonce };
    if (typeof password === "string") {
      password = fromString2(password);
    }
    let cryptoKey;
    if (password.length === 0) {
      try {
        const deriveParams = { name: "PBKDF2", salt, iterations, hash: { name: digest2 } };
        const runtimeDerivedEmptyPassword = await crypto3.subtle.importKey("raw", password, { name: "PBKDF2" }, false, ["deriveKey"]);
        cryptoKey = await crypto3.subtle.deriveKey(deriveParams, runtimeDerivedEmptyPassword, { name: algorithm, length: keyLength }, true, ["decrypt"]);
      } catch {
        cryptoKey = await crypto3.subtle.importKey("jwk", derivedEmptyPasswordKey3, { name: "AES-GCM" }, true, ["decrypt"]);
      }
    } else {
      const deriveParams = { name: "PBKDF2", salt, iterations, hash: { name: digest2 } };
      const rawKey = await crypto3.subtle.importKey("raw", password, { name: "PBKDF2" }, false, ["deriveKey"]);
      cryptoKey = await crypto3.subtle.deriveKey(deriveParams, rawKey, { name: algorithm, length: keyLength }, true, ["decrypt"]);
    }
    const plaintext = await crypto3.subtle.decrypt(aesGcm, cryptoKey, ciphertext);
    return new Uint8Array(plaintext);
  }
  __name(decrypt, "decrypt");
  const cipher = {
    encrypt,
    decrypt
  };
  return cipher;
}
__name(create4, "create");

// node_modules/@libp2p/peer-record/node_modules/@libp2p/crypto/dist/src/keys/exporter.js
async function exporter3(privateKey, password) {
  const cipher = create4();
  const encryptedKey = await cipher.encrypt(privateKey, password);
  return base64.encode(encryptedKey);
}
__name(exporter3, "exporter");

// node_modules/@libp2p/peer-record/node_modules/@libp2p/crypto/dist/src/keys/keys.js
var KeyType3;
(function(KeyType4) {
  KeyType4["RSA"] = "RSA";
  KeyType4["Ed25519"] = "Ed25519";
  KeyType4["Secp256k1"] = "Secp256k1";
})(KeyType3 || (KeyType3 = {}));
var __KeyTypeValues3;
(function(__KeyTypeValues4) {
  __KeyTypeValues4[__KeyTypeValues4["RSA"] = 0] = "RSA";
  __KeyTypeValues4[__KeyTypeValues4["Ed25519"] = 1] = "Ed25519";
  __KeyTypeValues4[__KeyTypeValues4["Secp256k1"] = 2] = "Secp256k1";
})(__KeyTypeValues3 || (__KeyTypeValues3 = {}));
(function(KeyType4) {
  KeyType4.codec = () => {
    return enumeration(__KeyTypeValues3);
  };
})(KeyType3 || (KeyType3 = {}));
var PublicKey3;
(function(PublicKey4) {
  let _codec;
  PublicKey4.codec = () => {
    if (_codec == null) {
      _codec = message((obj, w2, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w2.fork();
        }
        if (obj.Type != null) {
          w2.uint32(8);
          KeyType3.codec().encode(obj.Type, w2);
        }
        if (obj.Data != null) {
          w2.uint32(18);
          w2.bytes(obj.Data);
        }
        if (opts.lengthDelimited !== false) {
          w2.ldelim();
        }
      }, (reader, length3) => {
        const obj = {};
        const end = length3 == null ? reader.len : reader.pos + length3;
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              obj.Type = KeyType3.codec().decode(reader);
              break;
            case 2:
              obj.Data = reader.bytes();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return obj;
      });
    }
    return _codec;
  };
  PublicKey4.encode = (obj) => {
    return encodeMessage(obj, PublicKey4.codec());
  };
  PublicKey4.decode = (buf) => {
    return decodeMessage(buf, PublicKey4.codec());
  };
})(PublicKey3 || (PublicKey3 = {}));
var PrivateKey3;
(function(PrivateKey4) {
  let _codec;
  PrivateKey4.codec = () => {
    if (_codec == null) {
      _codec = message((obj, w2, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w2.fork();
        }
        if (obj.Type != null) {
          w2.uint32(8);
          KeyType3.codec().encode(obj.Type, w2);
        }
        if (obj.Data != null) {
          w2.uint32(18);
          w2.bytes(obj.Data);
        }
        if (opts.lengthDelimited !== false) {
          w2.ldelim();
        }
      }, (reader, length3) => {
        const obj = {};
        const end = length3 == null ? reader.len : reader.pos + length3;
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              obj.Type = KeyType3.codec().decode(reader);
              break;
            case 2:
              obj.Data = reader.bytes();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return obj;
      });
    }
    return _codec;
  };
  PrivateKey4.encode = (obj) => {
    return encodeMessage(obj, PrivateKey4.codec());
  };
  PrivateKey4.decode = (buf) => {
    return decodeMessage(buf, PrivateKey4.codec());
  };
})(PrivateKey3 || (PrivateKey3 = {}));

// node_modules/@libp2p/peer-record/node_modules/@libp2p/crypto/dist/src/keys/ed25519-class.js
var Ed25519PublicKey3 = class {
  static {
    __name(this, "Ed25519PublicKey");
  }
  _key;
  constructor(key) {
    this._key = ensureKey3(key, PUBLIC_KEY_BYTE_LENGTH3);
  }
  verify(data, sig) {
    return hashAndVerify7(this._key, sig, data);
  }
  marshal() {
    return this._key;
  }
  get bytes() {
    return PublicKey3.encode({
      Type: KeyType3.Ed25519,
      Data: this.marshal()
    }).subarray();
  }
  equals(key) {
    return equals3(this.bytes, key.bytes);
  }
  hash() {
    const p = sha256.digest(this.bytes);
    if (isPromise3(p)) {
      return p.then(({ bytes: bytes2 }) => bytes2);
    }
    return p.bytes;
  }
};
var Ed25519PrivateKey3 = class {
  static {
    __name(this, "Ed25519PrivateKey");
  }
  _key;
  _publicKey;
  // key       - 64 byte Uint8Array containing private key
  // publicKey - 32 byte Uint8Array containing public key
  constructor(key, publicKey) {
    this._key = ensureKey3(key, PRIVATE_KEY_BYTE_LENGTH3);
    this._publicKey = ensureKey3(publicKey, PUBLIC_KEY_BYTE_LENGTH3);
  }
  sign(message2) {
    return hashAndSign7(this._key, message2);
  }
  get public() {
    return new Ed25519PublicKey3(this._publicKey);
  }
  marshal() {
    return this._key;
  }
  get bytes() {
    return PrivateKey3.encode({
      Type: KeyType3.Ed25519,
      Data: this.marshal()
    }).subarray();
  }
  equals(key) {
    return equals3(this.bytes, key.bytes);
  }
  async hash() {
    const p = sha256.digest(this.bytes);
    let bytes2;
    if (isPromise3(p)) {
      ({ bytes: bytes2 } = await p);
    } else {
      bytes2 = p.bytes;
    }
    return bytes2;
  }
  /**
   * Gets the ID of the key.
   *
   * The key id is the base58 encoding of the identity multihash containing its public key.
   * The public key is a protobuf encoding containing a type and the DER encoding
   * of the PKCS SubjectPublicKeyInfo.
   *
   * @returns {Promise<string>}
   */
  async id() {
    const encoding = identity.digest(this.public.bytes);
    return base58btc.encode(encoding.bytes).substring(1);
  }
  /**
   * Exports the key into a password protected `format`
   */
  async export(password, format2 = "libp2p-key") {
    if (format2 === "libp2p-key") {
      return exporter3(this.bytes, password);
    } else {
      throw new CodeError(`export format '${format2}' is not supported`, "ERR_INVALID_EXPORT_FORMAT");
    }
  }
};
function unmarshalEd25519PrivateKey3(bytes2) {
  if (bytes2.length > PRIVATE_KEY_BYTE_LENGTH3) {
    bytes2 = ensureKey3(bytes2, PRIVATE_KEY_BYTE_LENGTH3 + PUBLIC_KEY_BYTE_LENGTH3);
    const privateKeyBytes2 = bytes2.subarray(0, PRIVATE_KEY_BYTE_LENGTH3);
    const publicKeyBytes2 = bytes2.subarray(PRIVATE_KEY_BYTE_LENGTH3, bytes2.length);
    return new Ed25519PrivateKey3(privateKeyBytes2, publicKeyBytes2);
  }
  bytes2 = ensureKey3(bytes2, PRIVATE_KEY_BYTE_LENGTH3);
  const privateKeyBytes = bytes2.subarray(0, PRIVATE_KEY_BYTE_LENGTH3);
  const publicKeyBytes = bytes2.subarray(PUBLIC_KEY_BYTE_LENGTH3);
  return new Ed25519PrivateKey3(privateKeyBytes, publicKeyBytes);
}
__name(unmarshalEd25519PrivateKey3, "unmarshalEd25519PrivateKey");
function unmarshalEd25519PublicKey3(bytes2) {
  bytes2 = ensureKey3(bytes2, PUBLIC_KEY_BYTE_LENGTH3);
  return new Ed25519PublicKey3(bytes2);
}
__name(unmarshalEd25519PublicKey3, "unmarshalEd25519PublicKey");
async function generateKeyPair8() {
  const { privateKey, publicKey } = generateKey7();
  return new Ed25519PrivateKey3(privateKey, publicKey);
}
__name(generateKeyPair8, "generateKeyPair");
async function generateKeyPairFromSeed3(seed) {
  const { privateKey, publicKey } = generateKeyFromSeed3(seed);
  return new Ed25519PrivateKey3(privateKey, publicKey);
}
__name(generateKeyPairFromSeed3, "generateKeyPairFromSeed");
function ensureKey3(key, length3) {
  key = Uint8Array.from(key ?? []);
  if (key.length !== length3) {
    throw new CodeError(`Key must be a Uint8Array of length ${length3}, got ${key.length}`, "ERR_INVALID_KEY_TYPE");
  }
  return key;
}
__name(ensureKey3, "ensureKey");

// node_modules/@libp2p/peer-record/node_modules/@libp2p/crypto/dist/src/keys/rsa-class.js
var rsa_class_exports3 = {};
__export(rsa_class_exports3, {
  MAX_RSA_KEY_SIZE: () => MAX_RSA_KEY_SIZE3,
  RsaPrivateKey: () => RsaPrivateKey3,
  RsaPublicKey: () => RsaPublicKey3,
  fromJwk: () => fromJwk3,
  generateKeyPair: () => generateKeyPair9,
  unmarshalRsaPrivateKey: () => unmarshalRsaPrivateKey3,
  unmarshalRsaPublicKey: () => unmarshalRsaPublicKey3
});

// node_modules/@libp2p/peer-record/node_modules/@libp2p/crypto/dist/src/random-bytes.js
function randomBytes4(length3) {
  if (isNaN(length3) || length3 <= 0) {
    throw new CodeError("random bytes length must be a Number bigger than 0", "ERR_INVALID_LENGTH");
  }
  return randomBytes(length3);
}
__name(randomBytes4, "randomBytes");

// node_modules/@libp2p/peer-record/node_modules/@libp2p/crypto/dist/src/keys/rsa-utils.js
var rsa_utils_exports3 = {};
__export(rsa_utils_exports3, {
  exportToPem: () => exportToPem3,
  importFromPem: () => importFromPem3,
  jwkToPkcs1: () => jwkToPkcs13,
  jwkToPkix: () => jwkToPkix3,
  pkcs1ToJwk: () => pkcs1ToJwk3,
  pkixToJwk: () => pkixToJwk3
});
function pkcs1ToJwk3(bytes2) {
  const { result } = fromBER(bytes2);
  const values = result.valueBlock.value;
  const key = {
    n: toString2(bnToBuf3(values[1].toBigInt()), "base64url"),
    e: toString2(bnToBuf3(values[2].toBigInt()), "base64url"),
    d: toString2(bnToBuf3(values[3].toBigInt()), "base64url"),
    p: toString2(bnToBuf3(values[4].toBigInt()), "base64url"),
    q: toString2(bnToBuf3(values[5].toBigInt()), "base64url"),
    dp: toString2(bnToBuf3(values[6].toBigInt()), "base64url"),
    dq: toString2(bnToBuf3(values[7].toBigInt()), "base64url"),
    qi: toString2(bnToBuf3(values[8].toBigInt()), "base64url"),
    kty: "RSA",
    alg: "RS256"
  };
  return key;
}
__name(pkcs1ToJwk3, "pkcs1ToJwk");
function jwkToPkcs13(jwk) {
  if (jwk.n == null || jwk.e == null || jwk.d == null || jwk.p == null || jwk.q == null || jwk.dp == null || jwk.dq == null || jwk.qi == null) {
    throw new CodeError("JWK was missing components", "ERR_INVALID_PARAMETERS");
  }
  const root = new Sequence({
    value: [
      new Integer({ value: 0 }),
      Integer.fromBigInt(bufToBn3(fromString2(jwk.n, "base64url"))),
      Integer.fromBigInt(bufToBn3(fromString2(jwk.e, "base64url"))),
      Integer.fromBigInt(bufToBn3(fromString2(jwk.d, "base64url"))),
      Integer.fromBigInt(bufToBn3(fromString2(jwk.p, "base64url"))),
      Integer.fromBigInt(bufToBn3(fromString2(jwk.q, "base64url"))),
      Integer.fromBigInt(bufToBn3(fromString2(jwk.dp, "base64url"))),
      Integer.fromBigInt(bufToBn3(fromString2(jwk.dq, "base64url"))),
      Integer.fromBigInt(bufToBn3(fromString2(jwk.qi, "base64url")))
    ]
  });
  const der = root.toBER();
  return new Uint8Array(der, 0, der.byteLength);
}
__name(jwkToPkcs13, "jwkToPkcs1");
function pkixToJwk3(bytes2) {
  const { result } = fromBER(bytes2);
  const values = result.valueBlock.value[1].valueBlock.value[0].valueBlock.value;
  return {
    kty: "RSA",
    n: toString2(bnToBuf3(values[0].toBigInt()), "base64url"),
    e: toString2(bnToBuf3(values[1].toBigInt()), "base64url")
  };
}
__name(pkixToJwk3, "pkixToJwk");
function jwkToPkix3(jwk) {
  if (jwk.n == null || jwk.e == null) {
    throw new CodeError("JWK was missing components", "ERR_INVALID_PARAMETERS");
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
            Integer.fromBigInt(bufToBn3(fromString2(jwk.n, "base64url"))),
            Integer.fromBigInt(bufToBn3(fromString2(jwk.e, "base64url")))
          ]
        }).toBER()
      })
    ]
  });
  const der = root.toBER();
  return new Uint8Array(der, 0, der.byteLength);
}
__name(jwkToPkix3, "jwkToPkix");
function bnToBuf3(bn) {
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
__name(bnToBuf3, "bnToBuf");
function bufToBn3(u8) {
  const hex = [];
  u8.forEach(function(i) {
    let h2 = i.toString(16);
    if (h2.length % 2 > 0) {
      h2 = `0${h2}`;
    }
    hex.push(h2);
  });
  return BigInt("0x" + hex.join(""));
}
__name(bufToBn3, "bufToBn");
var SALT_LENGTH3 = 16;
var KEY_SIZE3 = 32;
var ITERATIONS3 = 1e4;
async function exportToPem3(privateKey, password) {
  const crypto3 = webcrypto_browser_default3.get();
  const keyWrapper = new Sequence({
    value: [
      // version (0)
      new Integer({ value: 0 }),
      // privateKeyAlgorithm
      new Sequence({
        value: [
          // rsaEncryption OID
          new ObjectIdentifier({
            value: "1.2.840.113549.1.1.1"
          }),
          new Null()
        ]
      }),
      // PrivateKey
      new OctetString({
        valueHex: privateKey.marshal()
      })
    ]
  });
  const keyBuf = keyWrapper.toBER();
  const keyArr = new Uint8Array(keyBuf, 0, keyBuf.byteLength);
  const salt = randomBytes4(SALT_LENGTH3);
  const encryptionKey = await pbkdf2Async(sha5122, password, salt, {
    c: ITERATIONS3,
    dkLen: KEY_SIZE3
  });
  const iv = randomBytes4(16);
  const cryptoKey = await crypto3.subtle.importKey("raw", encryptionKey, "AES-CBC", false, ["encrypt"]);
  const encrypted = await crypto3.subtle.encrypt({
    name: "AES-CBC",
    iv
  }, cryptoKey, keyArr);
  const pbkdf2Params = new Sequence({
    value: [
      // salt
      new OctetString({ valueHex: salt }),
      // iteration count
      new Integer({ value: ITERATIONS3 }),
      // key length
      new Integer({ value: KEY_SIZE3 }),
      // AlgorithmIdentifier
      new Sequence({
        value: [
          // hmacWithSHA512
          new ObjectIdentifier({ value: "1.2.840.113549.2.11" }),
          new Null()
        ]
      })
    ]
  });
  const encryptionAlgorithm = new Sequence({
    value: [
      // pkcs5PBES2
      new ObjectIdentifier({
        value: "1.2.840.113549.1.5.13"
      }),
      new Sequence({
        value: [
          // keyDerivationFunc
          new Sequence({
            value: [
              // pkcs5PBKDF2
              new ObjectIdentifier({
                value: "1.2.840.113549.1.5.12"
              }),
              // PBKDF2-params
              pbkdf2Params
            ]
          }),
          // encryptionScheme
          new Sequence({
            value: [
              // aes256-CBC
              new ObjectIdentifier({
                value: "2.16.840.1.101.3.4.1.42"
              }),
              // iv
              new OctetString({
                valueHex: iv
              })
            ]
          })
        ]
      })
    ]
  });
  const finalWrapper = new Sequence({
    value: [
      encryptionAlgorithm,
      new OctetString({ valueHex: encrypted })
    ]
  });
  const finalWrapperBuf = finalWrapper.toBER();
  const finalWrapperArr = new Uint8Array(finalWrapperBuf, 0, finalWrapperBuf.byteLength);
  return [
    "-----BEGIN ENCRYPTED PRIVATE KEY-----",
    ...toString2(finalWrapperArr, "base64pad").split(/(.{64})/).filter(Boolean),
    "-----END ENCRYPTED PRIVATE KEY-----"
  ].join("\n");
}
__name(exportToPem3, "exportToPem");
async function importFromPem3(pem, password) {
  const crypto3 = webcrypto_browser_default3.get();
  let plaintext;
  if (pem.includes("-----BEGIN ENCRYPTED PRIVATE KEY-----")) {
    const key = fromString2(pem.replace("-----BEGIN ENCRYPTED PRIVATE KEY-----", "").replace("-----END ENCRYPTED PRIVATE KEY-----", "").replace(/\n/g, "").trim(), "base64pad");
    const { result } = fromBER(key);
    const { iv, salt, iterations, keySize: keySize4, cipherText } = findEncryptedPEMData3(result);
    const encryptionKey = await pbkdf2Async(sha5122, password, salt, {
      c: iterations,
      dkLen: keySize4
    });
    const cryptoKey = await crypto3.subtle.importKey("raw", encryptionKey, "AES-CBC", false, ["decrypt"]);
    const decrypted = toUint8Array3(await crypto3.subtle.decrypt({
      name: "AES-CBC",
      iv
    }, cryptoKey, cipherText));
    const { result: decryptedResult } = fromBER(decrypted);
    plaintext = findPEMData3(decryptedResult);
  } else if (pem.includes("-----BEGIN PRIVATE KEY-----")) {
    const key = fromString2(pem.replace("-----BEGIN PRIVATE KEY-----", "").replace("-----END PRIVATE KEY-----", "").replace(/\n/g, "").trim(), "base64pad");
    const { result } = fromBER(key);
    plaintext = findPEMData3(result);
  } else {
    throw new CodeError("Could not parse private key from PEM data", "ERR_INVALID_PARAMETERS");
  }
  return unmarshalRsaPrivateKey3(plaintext);
}
__name(importFromPem3, "importFromPem");
function findEncryptedPEMData3(root) {
  const encryptionAlgorithm = root.valueBlock.value[0];
  const scheme = encryptionAlgorithm.valueBlock.value[0].toString();
  if (scheme !== "OBJECT IDENTIFIER : 1.2.840.113549.1.5.13") {
    throw new CodeError("Only pkcs5PBES2 encrypted private keys are supported", "ERR_INVALID_PARAMS");
  }
  const keyDerivationFunc = encryptionAlgorithm.valueBlock.value[1].valueBlock.value[0];
  const keyDerivationFuncName = keyDerivationFunc.valueBlock.value[0].toString();
  if (keyDerivationFuncName !== "OBJECT IDENTIFIER : 1.2.840.113549.1.5.12") {
    throw new CodeError("Only pkcs5PBKDF2 key derivation functions are supported", "ERR_INVALID_PARAMS");
  }
  const pbkdf2Params = keyDerivationFunc.valueBlock.value[1];
  const salt = toUint8Array3(pbkdf2Params.valueBlock.value[0].getValue());
  let iterations = ITERATIONS3;
  let keySize4 = KEY_SIZE3;
  if (pbkdf2Params.valueBlock.value.length === 3) {
    iterations = Number(pbkdf2Params.valueBlock.value[1].toBigInt());
    keySize4 = Number(pbkdf2Params.valueBlock.value[2].toBigInt());
  } else if (pbkdf2Params.valueBlock.value.length === 2) {
    throw new CodeError("Could not derive key size and iterations from PEM file - please use @libp2p/rsa to re-import your key", "ERR_INVALID_PARAMS");
  }
  const encryptionScheme = encryptionAlgorithm.valueBlock.value[1].valueBlock.value[1];
  const encryptionSchemeName = encryptionScheme.valueBlock.value[0].toString();
  if (encryptionSchemeName === "OBJECT IDENTIFIER : 1.2.840.113549.3.7") {
  } else if (encryptionSchemeName === "OBJECT IDENTIFIER : 1.3.14.3.2.7") {
  } else if (encryptionSchemeName === "OBJECT IDENTIFIER : 2.16.840.1.101.3.4.1.2") {
  } else if (encryptionSchemeName === "OBJECT IDENTIFIER : 2.16.840.1.101.3.4.1.22") {
  } else if (encryptionSchemeName === "OBJECT IDENTIFIER : 2.16.840.1.101.3.4.1.42") {
  } else {
    throw new CodeError("Only AES-CBC encryption schemes are supported", "ERR_INVALID_PARAMS");
  }
  const iv = toUint8Array3(encryptionScheme.valueBlock.value[1].getValue());
  return {
    cipherText: toUint8Array3(root.valueBlock.value[1].getValue()),
    salt,
    iterations,
    keySize: keySize4,
    iv
  };
}
__name(findEncryptedPEMData3, "findEncryptedPEMData");
function findPEMData3(seq) {
  return toUint8Array3(seq.valueBlock.value[2].getValue());
}
__name(findPEMData3, "findPEMData");
function toUint8Array3(buf) {
  return new Uint8Array(buf, 0, buf.byteLength);
}
__name(toUint8Array3, "toUint8Array");

// node_modules/@libp2p/peer-record/node_modules/@libp2p/crypto/dist/src/keys/rsa-browser.js
async function generateKey8(bits) {
  const pair = await webcrypto_browser_default3.get().subtle.generateKey({
    name: "RSASSA-PKCS1-v1_5",
    modulusLength: bits,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: { name: "SHA-256" }
  }, true, ["sign", "verify"]);
  const keys = await exportKey3(pair);
  return {
    privateKey: keys[0],
    publicKey: keys[1]
  };
}
__name(generateKey8, "generateKey");
async function unmarshalPrivateKey5(key) {
  const privateKey = await webcrypto_browser_default3.get().subtle.importKey("jwk", key, {
    name: "RSASSA-PKCS1-v1_5",
    hash: { name: "SHA-256" }
  }, true, ["sign"]);
  const pair = [
    privateKey,
    await derivePublicFromPrivate3(key)
  ];
  const keys = await exportKey3({
    privateKey: pair[0],
    publicKey: pair[1]
  });
  return {
    privateKey: keys[0],
    publicKey: keys[1]
  };
}
__name(unmarshalPrivateKey5, "unmarshalPrivateKey");
async function hashAndSign8(key, msg) {
  const privateKey = await webcrypto_browser_default3.get().subtle.importKey("jwk", key, {
    name: "RSASSA-PKCS1-v1_5",
    hash: { name: "SHA-256" }
  }, false, ["sign"]);
  const sig = await webcrypto_browser_default3.get().subtle.sign({ name: "RSASSA-PKCS1-v1_5" }, privateKey, msg instanceof Uint8Array ? msg : msg.subarray());
  return new Uint8Array(sig, 0, sig.byteLength);
}
__name(hashAndSign8, "hashAndSign");
async function hashAndVerify8(key, sig, msg) {
  const publicKey = await webcrypto_browser_default3.get().subtle.importKey("jwk", key, {
    name: "RSASSA-PKCS1-v1_5",
    hash: { name: "SHA-256" }
  }, false, ["verify"]);
  return webcrypto_browser_default3.get().subtle.verify({ name: "RSASSA-PKCS1-v1_5" }, publicKey, sig, msg instanceof Uint8Array ? msg : msg.subarray());
}
__name(hashAndVerify8, "hashAndVerify");
async function exportKey3(pair) {
  if (pair.privateKey == null || pair.publicKey == null) {
    throw new CodeError("Private and public key are required", "ERR_INVALID_PARAMETERS");
  }
  return Promise.all([
    webcrypto_browser_default3.get().subtle.exportKey("jwk", pair.privateKey),
    webcrypto_browser_default3.get().subtle.exportKey("jwk", pair.publicKey)
  ]);
}
__name(exportKey3, "exportKey");
async function derivePublicFromPrivate3(jwKey) {
  return webcrypto_browser_default3.get().subtle.importKey("jwk", {
    kty: jwKey.kty,
    n: jwKey.n,
    e: jwKey.e
  }, {
    name: "RSASSA-PKCS1-v1_5",
    hash: { name: "SHA-256" }
  }, true, ["verify"]);
}
__name(derivePublicFromPrivate3, "derivePublicFromPrivate");
function keySize3(jwk) {
  if (jwk.kty !== "RSA") {
    throw new CodeError("invalid key type", "ERR_INVALID_KEY_TYPE");
  } else if (jwk.n == null) {
    throw new CodeError("invalid key modulus", "ERR_INVALID_KEY_MODULUS");
  }
  const bytes2 = fromString2(jwk.n, "base64url");
  return bytes2.length * 8;
}
__name(keySize3, "keySize");

// node_modules/@libp2p/peer-record/node_modules/@libp2p/crypto/dist/src/keys/rsa-class.js
var MAX_RSA_KEY_SIZE3 = 8192;
var RsaPublicKey3 = class {
  static {
    __name(this, "RsaPublicKey");
  }
  _key;
  constructor(key) {
    this._key = key;
  }
  verify(data, sig) {
    return hashAndVerify8(this._key, sig, data);
  }
  marshal() {
    return rsa_utils_exports3.jwkToPkix(this._key);
  }
  get bytes() {
    return PublicKey3.encode({
      Type: KeyType3.RSA,
      Data: this.marshal()
    }).subarray();
  }
  equals(key) {
    return equals3(this.bytes, key.bytes);
  }
  hash() {
    const p = sha256.digest(this.bytes);
    if (isPromise3(p)) {
      return p.then(({ bytes: bytes2 }) => bytes2);
    }
    return p.bytes;
  }
};
var RsaPrivateKey3 = class {
  static {
    __name(this, "RsaPrivateKey");
  }
  _key;
  _publicKey;
  constructor(key, publicKey) {
    this._key = key;
    this._publicKey = publicKey;
  }
  genSecret() {
    return randomBytes4(16);
  }
  sign(message2) {
    return hashAndSign8(this._key, message2);
  }
  get public() {
    if (this._publicKey == null) {
      throw new CodeError("public key not provided", "ERR_PUBKEY_NOT_PROVIDED");
    }
    return new RsaPublicKey3(this._publicKey);
  }
  marshal() {
    return rsa_utils_exports3.jwkToPkcs1(this._key);
  }
  get bytes() {
    return PrivateKey3.encode({
      Type: KeyType3.RSA,
      Data: this.marshal()
    }).subarray();
  }
  equals(key) {
    return equals3(this.bytes, key.bytes);
  }
  hash() {
    const p = sha256.digest(this.bytes);
    if (isPromise3(p)) {
      return p.then(({ bytes: bytes2 }) => bytes2);
    }
    return p.bytes;
  }
  /**
   * Gets the ID of the key.
   *
   * The key id is the base58 encoding of the SHA-256 multihash of its public key.
   * The public key is a protobuf encoding containing a type and the DER encoding
   * of the PKCS SubjectPublicKeyInfo.
   */
  async id() {
    const hash2 = await this.public.hash();
    return toString2(hash2, "base58btc");
  }
  /**
   * Exports the key as libp2p-key - a aes-gcm encrypted value with the key
   * derived from the password.
   *
   * To export it as a password protected PEM file, please use the `exportPEM`
   * function from `@libp2p/rsa`.
   */
  async export(password, format2 = "pkcs-8") {
    if (format2 === "pkcs-8") {
      return rsa_utils_exports3.exportToPem(this, password);
    } else if (format2 === "libp2p-key") {
      return exporter3(this.bytes, password);
    } else {
      throw new CodeError(`export format '${format2}' is not supported`, "ERR_INVALID_EXPORT_FORMAT");
    }
  }
};
async function unmarshalRsaPrivateKey3(bytes2) {
  const jwk = rsa_utils_exports3.pkcs1ToJwk(bytes2);
  if (keySize3(jwk) > MAX_RSA_KEY_SIZE3) {
    throw new CodeError("key size is too large", "ERR_KEY_SIZE_TOO_LARGE");
  }
  const keys = await unmarshalPrivateKey5(jwk);
  return new RsaPrivateKey3(keys.privateKey, keys.publicKey);
}
__name(unmarshalRsaPrivateKey3, "unmarshalRsaPrivateKey");
function unmarshalRsaPublicKey3(bytes2) {
  const jwk = rsa_utils_exports3.pkixToJwk(bytes2);
  if (keySize3(jwk) > MAX_RSA_KEY_SIZE3) {
    throw new CodeError("key size is too large", "ERR_KEY_SIZE_TOO_LARGE");
  }
  return new RsaPublicKey3(jwk);
}
__name(unmarshalRsaPublicKey3, "unmarshalRsaPublicKey");
async function fromJwk3(jwk) {
  if (keySize3(jwk) > MAX_RSA_KEY_SIZE3) {
    throw new CodeError("key size is too large", "ERR_KEY_SIZE_TOO_LARGE");
  }
  const keys = await unmarshalPrivateKey5(jwk);
  return new RsaPrivateKey3(keys.privateKey, keys.publicKey);
}
__name(fromJwk3, "fromJwk");
async function generateKeyPair9(bits) {
  if (bits > MAX_RSA_KEY_SIZE3) {
    throw new CodeError("key size is too large", "ERR_KEY_SIZE_TOO_LARGE");
  }
  const keys = await generateKey8(bits);
  return new RsaPrivateKey3(keys.privateKey, keys.publicKey);
}
__name(generateKeyPair9, "generateKeyPair");

// node_modules/@libp2p/peer-record/node_modules/@libp2p/crypto/dist/src/keys/secp256k1-class.js
var secp256k1_class_exports3 = {};
__export(secp256k1_class_exports3, {
  Secp256k1PrivateKey: () => Secp256k1PrivateKey3,
  Secp256k1PublicKey: () => Secp256k1PublicKey3,
  generateKeyPair: () => generateKeyPair10,
  unmarshalSecp256k1PrivateKey: () => unmarshalSecp256k1PrivateKey3,
  unmarshalSecp256k1PublicKey: () => unmarshalSecp256k1PublicKey3
});

// node_modules/@libp2p/peer-record/node_modules/@libp2p/crypto/dist/src/keys/secp256k1-browser.js
function generateKey9() {
  return secp256k1.utils.randomPrivateKey();
}
__name(generateKey9, "generateKey");
function hashAndSign9(key, msg) {
  const p = sha256.digest(msg instanceof Uint8Array ? msg : msg.subarray());
  if (isPromise3(p)) {
    return p.then(({ digest: digest2 }) => secp256k1.sign(digest2, key).toDERRawBytes()).catch((err) => {
      throw new CodeError(String(err), "ERR_INVALID_INPUT");
    });
  }
  try {
    return secp256k1.sign(p.digest, key).toDERRawBytes();
  } catch (err) {
    throw new CodeError(String(err), "ERR_INVALID_INPUT");
  }
}
__name(hashAndSign9, "hashAndSign");
function hashAndVerify9(key, sig, msg) {
  const p = sha256.digest(msg instanceof Uint8Array ? msg : msg.subarray());
  if (isPromise3(p)) {
    return p.then(({ digest: digest2 }) => secp256k1.verify(sig, digest2, key)).catch((err) => {
      throw new CodeError(String(err), "ERR_INVALID_INPUT");
    });
  }
  try {
    return secp256k1.verify(sig, p.digest, key);
  } catch (err) {
    throw new CodeError(String(err), "ERR_INVALID_INPUT");
  }
}
__name(hashAndVerify9, "hashAndVerify");
function compressPublicKey3(key) {
  const point = secp256k1.ProjectivePoint.fromHex(key).toRawBytes(true);
  return point;
}
__name(compressPublicKey3, "compressPublicKey");
function validatePrivateKey3(key) {
  try {
    secp256k1.getPublicKey(key, true);
  } catch (err) {
    throw new CodeError(String(err), "ERR_INVALID_PRIVATE_KEY");
  }
}
__name(validatePrivateKey3, "validatePrivateKey");
function validatePublicKey3(key) {
  try {
    secp256k1.ProjectivePoint.fromHex(key);
  } catch (err) {
    throw new CodeError(String(err), "ERR_INVALID_PUBLIC_KEY");
  }
}
__name(validatePublicKey3, "validatePublicKey");
function computePublicKey3(privateKey) {
  try {
    return secp256k1.getPublicKey(privateKey, true);
  } catch (err) {
    throw new CodeError(String(err), "ERR_INVALID_PRIVATE_KEY");
  }
}
__name(computePublicKey3, "computePublicKey");

// node_modules/@libp2p/peer-record/node_modules/@libp2p/crypto/dist/src/keys/secp256k1-class.js
var Secp256k1PublicKey3 = class {
  static {
    __name(this, "Secp256k1PublicKey");
  }
  _key;
  constructor(key) {
    validatePublicKey3(key);
    this._key = key;
  }
  verify(data, sig) {
    return hashAndVerify9(this._key, sig, data);
  }
  marshal() {
    return compressPublicKey3(this._key);
  }
  get bytes() {
    return PublicKey3.encode({
      Type: KeyType3.Secp256k1,
      Data: this.marshal()
    }).subarray();
  }
  equals(key) {
    return equals3(this.bytes, key.bytes);
  }
  async hash() {
    const p = sha256.digest(this.bytes);
    let bytes2;
    if (isPromise3(p)) {
      ({ bytes: bytes2 } = await p);
    } else {
      bytes2 = p.bytes;
    }
    return bytes2;
  }
};
var Secp256k1PrivateKey3 = class {
  static {
    __name(this, "Secp256k1PrivateKey");
  }
  _key;
  _publicKey;
  constructor(key, publicKey) {
    this._key = key;
    this._publicKey = publicKey ?? computePublicKey3(key);
    validatePrivateKey3(this._key);
    validatePublicKey3(this._publicKey);
  }
  sign(message2) {
    return hashAndSign9(this._key, message2);
  }
  get public() {
    return new Secp256k1PublicKey3(this._publicKey);
  }
  marshal() {
    return this._key;
  }
  get bytes() {
    return PrivateKey3.encode({
      Type: KeyType3.Secp256k1,
      Data: this.marshal()
    }).subarray();
  }
  equals(key) {
    return equals3(this.bytes, key.bytes);
  }
  hash() {
    const p = sha256.digest(this.bytes);
    if (isPromise3(p)) {
      return p.then(({ bytes: bytes2 }) => bytes2);
    }
    return p.bytes;
  }
  /**
   * Gets the ID of the key.
   *
   * The key id is the base58 encoding of the SHA-256 multihash of its public key.
   * The public key is a protobuf encoding containing a type and the DER encoding
   * of the PKCS SubjectPublicKeyInfo.
   */
  async id() {
    const hash2 = await this.public.hash();
    return toString2(hash2, "base58btc");
  }
  /**
   * Exports the key into a password protected `format`
   */
  async export(password, format2 = "libp2p-key") {
    if (format2 === "libp2p-key") {
      return exporter3(this.bytes, password);
    } else {
      throw new CodeError(`export format '${format2}' is not supported`, "ERR_INVALID_EXPORT_FORMAT");
    }
  }
};
function unmarshalSecp256k1PrivateKey3(bytes2) {
  return new Secp256k1PrivateKey3(bytes2);
}
__name(unmarshalSecp256k1PrivateKey3, "unmarshalSecp256k1PrivateKey");
function unmarshalSecp256k1PublicKey3(bytes2) {
  return new Secp256k1PublicKey3(bytes2);
}
__name(unmarshalSecp256k1PublicKey3, "unmarshalSecp256k1PublicKey");
async function generateKeyPair10() {
  const privateKeyBytes = generateKey9();
  return new Secp256k1PrivateKey3(privateKeyBytes);
}
__name(generateKeyPair10, "generateKeyPair");

// node_modules/@libp2p/peer-record/node_modules/@libp2p/crypto/dist/src/keys/index.js
var supportedKeys3 = {
  rsa: rsa_class_exports3,
  ed25519: ed25519_class_exports3,
  secp256k1: secp256k1_class_exports3
};
function unsupportedKey3(type) {
  const supported = Object.keys(supportedKeys3).join(" / ");
  return new CodeError(`invalid or unsupported key type ${type}. Must be ${supported}`, "ERR_UNSUPPORTED_KEY_TYPE");
}
__name(unsupportedKey3, "unsupportedKey");
function unmarshalPublicKey3(buf) {
  const decoded = PublicKey3.decode(buf);
  const data = decoded.Data ?? new Uint8Array();
  switch (decoded.Type) {
    case KeyType3.RSA:
      return supportedKeys3.rsa.unmarshalRsaPublicKey(data);
    case KeyType3.Ed25519:
      return supportedKeys3.ed25519.unmarshalEd25519PublicKey(data);
    case KeyType3.Secp256k1:
      return supportedKeys3.secp256k1.unmarshalSecp256k1PublicKey(data);
    default:
      throw unsupportedKey3(decoded.Type ?? "unknown");
  }
}
__name(unmarshalPublicKey3, "unmarshalPublicKey");
async function unmarshalPrivateKey6(buf) {
  const decoded = PrivateKey3.decode(buf);
  const data = decoded.Data ?? new Uint8Array();
  switch (decoded.Type) {
    case KeyType3.RSA:
      return supportedKeys3.rsa.unmarshalRsaPrivateKey(data);
    case KeyType3.Ed25519:
      return supportedKeys3.ed25519.unmarshalEd25519PrivateKey(data);
    case KeyType3.Secp256k1:
      return supportedKeys3.secp256k1.unmarshalSecp256k1PrivateKey(data);
    default:
      throw unsupportedKey3(decoded.Type ?? "RSA");
  }
}
__name(unmarshalPrivateKey6, "unmarshalPrivateKey");

// node_modules/@libp2p/peer-record/dist/src/errors.js
var codes = {
  ERR_SIGNATURE_NOT_VALID: "ERR_SIGNATURE_NOT_VALID"
};

// node_modules/@libp2p/peer-record/dist/src/envelope/envelope.js
var Envelope;
(function(Envelope2) {
  let _codec;
  Envelope2.codec = () => {
    if (_codec == null) {
      _codec = message((obj, w2, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w2.fork();
        }
        if (obj.publicKey != null && obj.publicKey.byteLength > 0) {
          w2.uint32(10);
          w2.bytes(obj.publicKey);
        }
        if (obj.payloadType != null && obj.payloadType.byteLength > 0) {
          w2.uint32(18);
          w2.bytes(obj.payloadType);
        }
        if (obj.payload != null && obj.payload.byteLength > 0) {
          w2.uint32(26);
          w2.bytes(obj.payload);
        }
        if (obj.signature != null && obj.signature.byteLength > 0) {
          w2.uint32(42);
          w2.bytes(obj.signature);
        }
        if (opts.lengthDelimited !== false) {
          w2.ldelim();
        }
      }, (reader, length3) => {
        const obj = {
          publicKey: new Uint8Array(0),
          payloadType: new Uint8Array(0),
          payload: new Uint8Array(0),
          signature: new Uint8Array(0)
        };
        const end = length3 == null ? reader.len : reader.pos + length3;
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              obj.publicKey = reader.bytes();
              break;
            case 2:
              obj.payloadType = reader.bytes();
              break;
            case 3:
              obj.payload = reader.bytes();
              break;
            case 5:
              obj.signature = reader.bytes();
              break;
            default:
              reader.skipType(tag & 7);
              break;
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
  Envelope2.decode = (buf) => {
    return decodeMessage(buf, Envelope2.codec());
  };
})(Envelope || (Envelope = {}));

// node_modules/@libp2p/peer-record/dist/src/envelope/index.js
var RecordEnvelope = class _RecordEnvelope {
  static {
    __name(this, "RecordEnvelope");
  }
  /**
   * Unmarshal a serialized Envelope protobuf message
   */
  static createFromProtobuf = /* @__PURE__ */ __name(async (data) => {
    const envelopeData = Envelope.decode(data);
    const peerId2 = await peerIdFromKeys(envelopeData.publicKey);
    return new _RecordEnvelope({
      peerId: peerId2,
      payloadType: envelopeData.payloadType,
      payload: envelopeData.payload,
      signature: envelopeData.signature
    });
  }, "createFromProtobuf");
  /**
   * Seal marshals the given Record, places the marshaled bytes inside an Envelope
   * and signs it with the given peerId's private key
   */
  static seal = /* @__PURE__ */ __name(async (record, peerId2) => {
    if (peerId2.privateKey == null) {
      throw new Error("Missing private key");
    }
    const domain = record.domain;
    const payloadType = record.codec;
    const payload = record.marshal();
    const signData = formatSignaturePayload(domain, payloadType, payload);
    const key = await unmarshalPrivateKey6(peerId2.privateKey);
    const signature = await key.sign(signData.subarray());
    return new _RecordEnvelope({
      peerId: peerId2,
      payloadType,
      payload,
      signature
    });
  }, "seal");
  /**
   * Open and certify a given marshalled envelope.
   * Data is unmarshalled and the signature validated for the given domain.
   */
  static openAndCertify = /* @__PURE__ */ __name(async (data, domain) => {
    const envelope = await _RecordEnvelope.createFromProtobuf(data);
    const valid = await envelope.validate(domain);
    if (!valid) {
      throw new CodeError("envelope signature is not valid for the given domain", codes.ERR_SIGNATURE_NOT_VALID);
    }
    return envelope;
  }, "openAndCertify");
  peerId;
  payloadType;
  payload;
  signature;
  marshaled;
  /**
   * The Envelope is responsible for keeping an arbitrary signed record
   * by a libp2p peer.
   */
  constructor(init) {
    const { peerId: peerId2, payloadType, payload, signature } = init;
    this.peerId = peerId2;
    this.payloadType = payloadType;
    this.payload = payload;
    this.signature = signature;
  }
  /**
   * Marshal the envelope content
   */
  marshal() {
    if (this.peerId.publicKey == null) {
      throw new Error("Missing public key");
    }
    if (this.marshaled == null) {
      this.marshaled = Envelope.encode({
        publicKey: this.peerId.publicKey,
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
    return equals3(this.marshal(), other.marshal());
  }
  /**
   * Validate envelope data signature for the given domain
   */
  async validate(domain) {
    const signData = formatSignaturePayload(domain, this.payloadType, this.payload);
    if (this.peerId.publicKey == null) {
      throw new Error("Missing public key");
    }
    const key = unmarshalPublicKey3(this.peerId.publicKey);
    return key.verify(signData.subarray(), this.signature);
  }
};
var formatSignaturePayload = /* @__PURE__ */ __name((domain, payloadType, payload) => {
  const domainUint8Array = fromString2(domain);
  const domainLength = encode5(domainUint8Array.byteLength);
  const payloadTypeLength = encode5(payloadType.length);
  const payloadLength = encode5(payload.length);
  return new Uint8ArrayList(domainLength, domainUint8Array, payloadTypeLength, payloadType, payloadLength, payload);
}, "formatSignaturePayload");

// node_modules/@libp2p/utils/dist/src/array-equals.js
function arrayEquals(a, b) {
  const sort2 = /* @__PURE__ */ __name((a2, b2) => a2.toString().localeCompare(b2.toString()), "sort");
  if (a.length !== b.length) {
    return false;
  }
  b.sort(sort2);
  return a.sort(sort2).every((item, index) => b[index].equals(item));
}
__name(arrayEquals, "arrayEquals");

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
function isIPv4(input) {
  return Boolean(parseIPv4(input));
}
__name(isIPv4, "isIPv4");
function isIPv6(input) {
  return Boolean(parseIPv6(input));
}
__name(isIPv6, "isIPv6");
function isIP(input) {
  return Boolean(parseIP(input));
}
__name(isIP, "isIP");

// node_modules/@multiformats/multiaddr/dist/src/ip.js
var isV4 = isIPv4;
var isV6 = isIPv6;
var toBytes2 = /* @__PURE__ */ __name(function(ip) {
  let offset = 0;
  ip = ip.toString().trim();
  if (isV4(ip)) {
    const bytes2 = new Uint8Array(offset + 4);
    ip.split(/\./g).forEach((byte) => {
      bytes2[offset++] = parseInt(byte, 10) & 255;
    });
    return bytes2;
  }
  if (isV6(ip)) {
    const sections = ip.split(":", 8);
    let i;
    for (i = 0; i < sections.length; i++) {
      const isv4 = isV4(sections[i]);
      let v4Buffer;
      if (isv4) {
        v4Buffer = toBytes2(sections[i]);
        sections[i] = toString2(v4Buffer.slice(0, 2), "base16");
      }
      if (v4Buffer != null && ++i < 8) {
        sections.splice(i, 0, toString2(v4Buffer.slice(2, 4), "base16"));
      }
    }
    if (sections[0] === "") {
      while (sections.length < 8)
        sections.unshift("0");
    } else if (sections[sections.length - 1] === "") {
      while (sections.length < 8)
        sections.push("0");
    } else if (sections.length < 8) {
      for (i = 0; i < sections.length && sections[i] !== ""; i++)
        ;
      const argv = [i, 1];
      for (i = 9 - sections.length; i > 0; i--) {
        argv.push("0");
      }
      sections.splice.apply(sections, argv);
    }
    const bytes2 = new Uint8Array(offset + 16);
    for (i = 0; i < sections.length; i++) {
      const word = parseInt(sections[i], 16);
      bytes2[offset++] = word >> 8 & 255;
      bytes2[offset++] = word & 255;
    }
    return bytes2;
  }
  throw new Error("invalid ip address");
}, "toBytes");
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
var codes2 = {};
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
  codes2[proto.code] = proto;
  names[proto.name] = proto;
});
function createProtocol(code2, size, name3, resolvable, path) {
  return {
    code: code2,
    size,
    name: name3,
    resolvable: Boolean(resolvable),
    path: Boolean(path)
  };
}
__name(createProtocol, "createProtocol");
function getProtocol(proto) {
  if (typeof proto === "number") {
    if (codes2[proto] != null) {
      return codes2[proto];
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
function convertToBytes(proto, str) {
  const protocol = getProtocol(proto);
  switch (protocol.code) {
    case 4:
      return ip2bytes(str);
    case 41:
      return ip2bytes(str);
    case 42:
      return str2bytes(str);
    case 6:
    // tcp
    case 273:
    // udp
    case 33:
    // dccp
    case 132:
      return port2bytes(parseInt(str, 10));
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
      return str2bytes(str);
    case 421:
      return mh2bytes(str);
    case 444:
      return onion2bytes(str);
    case 445:
      return onion32bytes(str);
    case 466:
      return mb2bytes(str);
    case 481:
      return str2bytes(globalThis.decodeURIComponent(str));
    default:
      return fromString2(str, "base16");
  }
}
__name(convertToBytes, "convertToBytes");
var decoders = Object.values(bases).map((c) => c.decoder);
var anybaseDecoder = function() {
  let acc = decoders[0].or(decoders[1]);
  decoders.slice(2).forEach((d2) => acc = acc.or(d2));
  return acc;
}();
function ip2bytes(ipString) {
  if (!isIP(ipString)) {
    throw new Error("invalid ip address");
  }
  return toBytes2(ipString);
}
__name(ip2bytes, "ip2bytes");
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
function port2bytes(port) {
  const buf = new ArrayBuffer(2);
  const view = new DataView(buf);
  view.setUint16(0, port);
  return new Uint8Array(buf);
}
__name(port2bytes, "port2bytes");
function bytes2port(buf) {
  const view = new DataView(buf.buffer);
  return view.getUint16(buf.byteOffset);
}
__name(bytes2port, "bytes2port");
function str2bytes(str) {
  const buf = fromString2(str);
  const size = Uint8Array.from(encode5(buf.length));
  return concat([size, buf], size.length + buf.length);
}
__name(str2bytes, "str2bytes");
function bytes2str(buf) {
  const size = decode6(buf);
  buf = buf.slice(encodingLength2(size));
  if (buf.length !== size) {
    throw new Error("inconsistent lengths");
  }
  return toString2(buf);
}
__name(bytes2str, "bytes2str");
function mh2bytes(hash2) {
  let mh;
  if (hash2[0] === "Q" || hash2[0] === "1") {
    mh = decode4(base58btc.decode(`z${hash2}`)).bytes;
  } else {
    mh = CID.parse(hash2).multihash.bytes;
  }
  const size = Uint8Array.from(encode5(mh.length));
  return concat([size, mh], size.length + mh.length);
}
__name(mh2bytes, "mh2bytes");
function mb2bytes(mbstr) {
  const mb = anybaseDecoder.decode(mbstr);
  const size = Uint8Array.from(encode5(mb.length));
  return concat([size, mb], size.length + mb.length);
}
__name(mb2bytes, "mb2bytes");
function bytes2mb(buf) {
  const size = decode6(buf);
  const hash2 = buf.slice(encodingLength2(size));
  if (hash2.length !== size) {
    throw new Error("inconsistent lengths");
  }
  return "u" + toString2(hash2, "base64url");
}
__name(bytes2mb, "bytes2mb");
function bytes2mh(buf) {
  const size = decode6(buf);
  const address = buf.slice(encodingLength2(size));
  if (address.length !== size) {
    throw new Error("inconsistent lengths");
  }
  return toString2(address, "base58btc");
}
__name(bytes2mh, "bytes2mh");
function onion2bytes(str) {
  const addr = str.split(":");
  if (addr.length !== 2) {
    throw new Error(`failed to parse onion addr: ["'${addr.join('", "')}'"]' does not contain a port number`);
  }
  if (addr[0].length !== 16) {
    throw new Error(`failed to parse onion addr: ${addr[0]} not a Tor onion address.`);
  }
  const buf = base32.decode("b" + addr[0]);
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
  const addrBytes = buf.slice(0, buf.length - 2);
  const portBytes = buf.slice(buf.length - 2);
  const addr = toString2(addrBytes, "base32");
  const port = bytes2port(portBytes);
  return `${addr}:${port}`;
}
__name(bytes2onion, "bytes2onion");

// node_modules/@multiformats/multiaddr/dist/src/codec.js
function stringToMultiaddrParts(str) {
  str = cleanPath(str);
  const tuples = [];
  const stringTuples = [];
  let path = null;
  const parts = str.split("/").slice(1);
  if (parts.length === 1 && parts[0] === "") {
    return {
      bytes: new Uint8Array(),
      string: "/",
      tuples: [],
      stringTuples: [],
      path: null
    };
  }
  for (let p = 0; p < parts.length; p++) {
    const part = parts[p];
    const proto = getProtocol(part);
    if (proto.size === 0) {
      tuples.push([proto.code]);
      stringTuples.push([proto.code]);
      continue;
    }
    p++;
    if (p >= parts.length) {
      throw ParseError("invalid address: " + str);
    }
    if (proto.path === true) {
      path = cleanPath(parts.slice(p).join("/"));
      tuples.push([proto.code, convertToBytes(proto.code, path)]);
      stringTuples.push([proto.code, path]);
      break;
    }
    const bytes2 = convertToBytes(proto.code, parts[p]);
    tuples.push([proto.code, bytes2]);
    stringTuples.push([proto.code, convertToString(proto.code, bytes2)]);
  }
  return {
    string: stringTuplesToString(stringTuples),
    bytes: tuplesToBytes(tuples),
    tuples,
    stringTuples,
    path
  };
}
__name(stringToMultiaddrParts, "stringToMultiaddrParts");
function bytesToMultiaddrParts(bytes2) {
  const tuples = [];
  const stringTuples = [];
  let path = null;
  let i = 0;
  while (i < bytes2.length) {
    const code2 = decode6(bytes2, i);
    const n = encodingLength2(code2);
    const p = getProtocol(code2);
    const size = sizeForAddr(p, bytes2.slice(i + n));
    if (size === 0) {
      tuples.push([code2]);
      stringTuples.push([code2]);
      i += n;
      continue;
    }
    const addr = bytes2.slice(i + n, i + n + size);
    i += size + n;
    if (i > bytes2.length) {
      throw ParseError("Invalid address Uint8Array: " + toString2(bytes2, "base16"));
    }
    tuples.push([code2, addr]);
    const stringAddr = convertToString(code2, addr);
    stringTuples.push([code2, stringAddr]);
    if (p.path === true) {
      path = stringAddr;
      break;
    }
  }
  return {
    bytes: Uint8Array.from(bytes2),
    string: stringTuplesToString(stringTuples),
    tuples,
    stringTuples,
    path
  };
}
__name(bytesToMultiaddrParts, "bytesToMultiaddrParts");
function stringTuplesToString(tuples) {
  const parts = [];
  tuples.map((tup) => {
    const proto = getProtocol(tup[0]);
    parts.push(proto.name);
    if (tup.length > 1 && tup[1] != null) {
      parts.push(tup[1]);
    }
    return null;
  });
  return cleanPath(parts.join("/"));
}
__name(stringTuplesToString, "stringTuplesToString");
function tuplesToBytes(tuples) {
  return concat(tuples.map((tup) => {
    const proto = getProtocol(tup[0]);
    let buf = Uint8Array.from(encode5(proto.code));
    if (tup.length > 1 && tup[1] != null) {
      buf = concat([buf, tup[1]]);
    }
    return buf;
  }));
}
__name(tuplesToBytes, "tuplesToBytes");
function sizeForAddr(p, addr) {
  if (p.size > 0) {
    return p.size / 8;
  } else if (p.size === 0) {
    return 0;
  } else {
    const size = decode6(addr instanceof Uint8Array ? addr : Uint8Array.from(addr));
    return size + encodingLength2(size);
  }
}
__name(sizeForAddr, "sizeForAddr");
function cleanPath(str) {
  return "/" + str.trim().split("/").filter((a) => a).join("/");
}
__name(cleanPath, "cleanPath");
function ParseError(str) {
  return new Error("Error parsing address: " + str);
}
__name(ParseError, "ParseError");

// node_modules/@multiformats/multiaddr/dist/src/multiaddr.js
var inspect2 = Symbol.for("nodejs.util.inspect.custom");
var symbol2 = Symbol.for("@multiformats/js-multiaddr/multiaddr");
var DNS_CODES = [
  getProtocol("dns").code,
  getProtocol("dns4").code,
  getProtocol("dns6").code,
  getProtocol("dnsaddr").code
];
var NoAvailableResolverError = class extends Error {
  static {
    __name(this, "NoAvailableResolverError");
  }
  constructor(message2 = "No available resolver") {
    super(message2);
    this.name = "NoAvailableResolverError";
  }
};
var Multiaddr = class _Multiaddr {
  static {
    __name(this, "Multiaddr");
  }
  bytes;
  #string;
  #tuples;
  #stringTuples;
  #path;
  [symbol2] = true;
  constructor(addr) {
    if (addr == null) {
      addr = "";
    }
    let parts;
    if (addr instanceof Uint8Array) {
      parts = bytesToMultiaddrParts(addr);
    } else if (typeof addr === "string") {
      if (addr.length > 0 && addr.charAt(0) !== "/") {
        throw new Error(`multiaddr "${addr}" must start with a "/"`);
      }
      parts = stringToMultiaddrParts(addr);
    } else if (isMultiaddr(addr)) {
      parts = bytesToMultiaddrParts(addr.bytes);
    } else {
      throw new Error("addr must be a string, Buffer, or another Multiaddr");
    }
    this.bytes = parts.bytes;
    this.#string = parts.string;
    this.#tuples = parts.tuples;
    this.#stringTuples = parts.stringTuples;
    this.#path = parts.path;
  }
  toString() {
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
    const tcp = getProtocol("tcp");
    const udp = getProtocol("udp");
    const ip4 = getProtocol("ip4");
    const ip6 = getProtocol("ip6");
    const dns6 = getProtocol("dns6");
    const ip6zone = getProtocol("ip6zone");
    for (const [code2, value] of this.stringTuples()) {
      if (code2 === ip6zone.code) {
        zone = `%${value ?? ""}`;
      }
      if (DNS_CODES.includes(code2)) {
        transport = tcp.name;
        port = 443;
        host = `${value ?? ""}${zone}`;
        family = code2 === dns6.code ? 6 : 4;
      }
      if (code2 === tcp.code || code2 === udp.code) {
        transport = getProtocol(code2).name;
        port = parseInt(value ?? "");
      }
      if (code2 === ip4.code || code2 === ip6.code) {
        transport = getProtocol(code2).name;
        host = `${value ?? ""}${zone}`;
        family = code2 === ip6.code ? 6 : 4;
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
  protos() {
    return this.#tuples.map(([code2]) => Object.assign({}, getProtocol(code2)));
  }
  protoCodes() {
    return this.#tuples.map(([code2]) => code2);
  }
  protoNames() {
    return this.#tuples.map(([code2]) => getProtocol(code2).name);
  }
  tuples() {
    return this.#tuples;
  }
  stringTuples() {
    return this.#stringTuples;
  }
  encapsulate(addr) {
    addr = new _Multiaddr(addr);
    return new _Multiaddr(this.toString() + addr.toString());
  }
  decapsulate(addr) {
    const addrString = addr.toString();
    const s2 = this.toString();
    const i = s2.lastIndexOf(addrString);
    if (i < 0) {
      throw new Error(`Address ${this.toString()} does not contain subaddress: ${addr.toString()}`);
    }
    return new _Multiaddr(s2.slice(0, i));
  }
  decapsulateCode(code2) {
    const tuples = this.tuples();
    for (let i = tuples.length - 1; i >= 0; i--) {
      if (tuples[i][0] === code2) {
        return new _Multiaddr(tuplesToBytes(tuples.slice(0, i)));
      }
    }
    return this;
  }
  getPeerId() {
    try {
      let tuples = [];
      this.stringTuples().forEach(([code2, name3]) => {
        if (code2 === names.p2p.code) {
          tuples.push([code2, name3]);
        }
        if (code2 === names["p2p-circuit"].code) {
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
    return this.#path;
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
  isThinWaistAddress(addr) {
    const protos = (addr ?? this).protos();
    if (protos.length !== 2) {
      return false;
    }
    if (protos[0].code !== 4 && protos[0].code !== 41) {
      return false;
    }
    if (protos[1].code !== 6 && protos[1].code !== 273) {
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
  [inspect2]() {
    return `Multiaddr(${this.#string})`;
  }
};

// node_modules/@multiformats/multiaddr/dist/src/index.js
var resolvers = /* @__PURE__ */ new Map();
function isMultiaddr(value) {
  return Boolean(value?.[symbol2]);
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
        _codec2 = message((obj, w2, opts = {}) => {
          if (opts.lengthDelimited !== false) {
            w2.fork();
          }
          if (obj.multiaddr != null && obj.multiaddr.byteLength > 0) {
            w2.uint32(10);
            w2.bytes(obj.multiaddr);
          }
          if (opts.lengthDelimited !== false) {
            w2.ldelim();
          }
        }, (reader, length3) => {
          const obj = {
            multiaddr: new Uint8Array(0)
          };
          const end = length3 == null ? reader.len : reader.pos + length3;
          while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
              case 1:
                obj.multiaddr = reader.bytes();
                break;
              default:
                reader.skipType(tag & 7);
                break;
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
    AddressInfo2.decode = (buf) => {
      return decodeMessage(buf, AddressInfo2.codec());
    };
  })(AddressInfo = PeerRecord3.AddressInfo || (PeerRecord3.AddressInfo = {}));
  let _codec;
  PeerRecord3.codec = () => {
    if (_codec == null) {
      _codec = message((obj, w2, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w2.fork();
        }
        if (obj.peerId != null && obj.peerId.byteLength > 0) {
          w2.uint32(10);
          w2.bytes(obj.peerId);
        }
        if (obj.seq != null && obj.seq !== 0n) {
          w2.uint32(16);
          w2.uint64(obj.seq);
        }
        if (obj.addresses != null) {
          for (const value of obj.addresses) {
            w2.uint32(26);
            PeerRecord3.AddressInfo.codec().encode(value, w2);
          }
        }
        if (opts.lengthDelimited !== false) {
          w2.ldelim();
        }
      }, (reader, length3) => {
        const obj = {
          peerId: new Uint8Array(0),
          seq: 0n,
          addresses: []
        };
        const end = length3 == null ? reader.len : reader.pos + length3;
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              obj.peerId = reader.bytes();
              break;
            case 2:
              obj.seq = reader.uint64();
              break;
            case 3:
              obj.addresses.push(PeerRecord3.AddressInfo.codec().decode(reader, reader.uint32()));
              break;
            default:
              reader.skipType(tag & 7);
              break;
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
  PeerRecord3.decode = (buf) => {
    return decodeMessage(buf, PeerRecord3.codec());
  };
})(PeerRecord || (PeerRecord = {}));

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
    const peerId2 = peerIdFromBytes(peerRecord.peerId);
    const multiaddrs = (peerRecord.addresses ?? []).map((a) => multiaddr(a.multiaddr));
    const seqNumber = peerRecord.seq;
    return new _PeerRecord({ peerId: peerId2, multiaddrs, seqNumber });
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
    const { peerId: peerId2, multiaddrs, seqNumber } = init;
    this.peerId = peerId2;
    this.multiaddrs = multiaddrs ?? [];
    this.seqNumber = seqNumber ?? BigInt(Date.now());
  }
  /**
   * Marshal a record to be used in an envelope
   */
  marshal() {
    if (this.marshaled == null) {
      this.marshaled = PeerRecord.encode({
        peerId: this.peerId.toBytes(),
        seq: BigInt(this.seqNumber),
        addresses: this.multiaddrs.map((m2) => ({
          multiaddr: m2.bytes
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

// node_modules/it-all/dist/src/index.js
function isAsyncIterable(thing) {
  return thing[Symbol.asyncIterator] != null;
}
__name(isAsyncIterable, "isAsyncIterable");
function all(source) {
  if (isAsyncIterable(source)) {
    return (async () => {
      const arr2 = [];
      for await (const entry of source) {
        arr2.push(entry);
      }
      return arr2;
    })();
  }
  const arr = [];
  for (const entry of source) {
    arr.push(entry);
  }
  return arr;
}
__name(all, "all");
var src_default2 = all;

// node_modules/p-queue/node_modules/eventemitter3/index.mjs
var import_index3 = __toESM(require_eventemitter3(), 1);

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
var AbortError2 = class extends Error {
  static {
    __name(this, "AbortError");
  }
  constructor(message2) {
    super();
    this.name = "AbortError";
    this.message = message2;
  }
};
var getDOMException = /* @__PURE__ */ __name((errorMessage) => globalThis.DOMException === void 0 ? new AbortError2(errorMessage) : new DOMException(errorMessage), "getDOMException");
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
  const wrappedPromise = new Promise((resolve, reject) => {
    if (typeof milliseconds !== "number" || Math.sign(milliseconds) !== 1) {
      throw new TypeError(`Expected \`milliseconds\` to be a positive number, got \`${milliseconds}\``);
    }
    if (options.signal) {
      const { signal } = options;
      if (signal.aborted) {
        reject(getAbortedReason(signal));
      }
      signal.addEventListener("abort", () => {
        reject(getAbortedReason(signal));
      });
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
  });
  cancelablePromise.clear = () => {
    customTimers.clearTimeout.call(void 0, timer);
    timer = void 0;
  };
  return cancelablePromise;
}
__name(pTimeout, "pTimeout");

// node_modules/p-queue/dist/lower-bound.js
function lowerBound(array, value, comparator) {
  let first = 0;
  let count = array.length;
  while (count > 0) {
    const step = Math.trunc(count / 2);
    let it = first + step;
    if (comparator(array[it], value) <= 0) {
      first = ++it;
      count -= step + 1;
    } else {
      count = step;
    }
  }
  return first;
}
__name(lowerBound, "lowerBound");

// node_modules/p-queue/dist/priority-queue.js
var PriorityQueue = class {
  static {
    __name(this, "PriorityQueue");
  }
  #queue = [];
  enqueue(run, options) {
    options = {
      priority: 0,
      ...options
    };
    const element = {
      priority: options.priority,
      run
    };
    if (this.size && this.#queue[this.size - 1].priority >= options.priority) {
      this.#queue.push(element);
      return;
    }
    const index = lowerBound(this.#queue, element, (a, b) => b.priority - a.priority);
    this.#queue.splice(index, 0, element);
  }
  dequeue() {
    const item = this.#queue.shift();
    return item?.run;
  }
  filter(options) {
    return this.#queue.filter((element) => element.priority === options.priority).map((element) => element.run);
  }
  get size() {
    return this.#queue.length;
  }
};

// node_modules/p-queue/dist/index.js
var PQueue = class extends import_index3.default {
  static {
    __name(this, "PQueue");
  }
  #carryoverConcurrencyCount;
  #isIntervalIgnored;
  #intervalCount = 0;
  #intervalCap;
  #interval;
  #intervalEnd = 0;
  #intervalId;
  #timeoutId;
  #queue;
  #queueClass;
  #pending = 0;
  // The `!` is needed because of https://github.com/microsoft/TypeScript/issues/32194
  #concurrency;
  #isPaused;
  #throwOnTimeout;
  /**
      Per-operation timeout in milliseconds. Operations fulfill once `timeout` elapses if they haven't already.
  
      Applies to each future operation.
      */
  timeout;
  // TODO: The `throwOnTimeout` option should affect the return types of `add()` and `addAll()`
  constructor(options) {
    super();
    options = {
      carryoverConcurrencyCount: false,
      intervalCap: Number.POSITIVE_INFINITY,
      interval: 0,
      concurrency: Number.POSITIVE_INFINITY,
      autoStart: true,
      queueClass: PriorityQueue,
      ...options
    };
    if (!(typeof options.intervalCap === "number" && options.intervalCap >= 1)) {
      throw new TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${options.intervalCap?.toString() ?? ""}\` (${typeof options.intervalCap})`);
    }
    if (options.interval === void 0 || !(Number.isFinite(options.interval) && options.interval >= 0)) {
      throw new TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${options.interval?.toString() ?? ""}\` (${typeof options.interval})`);
    }
    this.#carryoverConcurrencyCount = options.carryoverConcurrencyCount;
    this.#isIntervalIgnored = options.intervalCap === Number.POSITIVE_INFINITY || options.interval === 0;
    this.#intervalCap = options.intervalCap;
    this.#interval = options.interval;
    this.#queue = new options.queueClass();
    this.#queueClass = options.queueClass;
    this.concurrency = options.concurrency;
    this.timeout = options.timeout;
    this.#throwOnTimeout = options.throwOnTimeout === true;
    this.#isPaused = options.autoStart === false;
  }
  get #doesIntervalAllowAnother() {
    return this.#isIntervalIgnored || this.#intervalCount < this.#intervalCap;
  }
  get #doesConcurrentAllowAnother() {
    return this.#pending < this.#concurrency;
  }
  #next() {
    this.#pending--;
    this.#tryToStartAnother();
    this.emit("next");
  }
  #onResumeInterval() {
    this.#onInterval();
    this.#initializeIntervalIfNeeded();
    this.#timeoutId = void 0;
  }
  get #isIntervalPaused() {
    const now = Date.now();
    if (this.#intervalId === void 0) {
      const delay2 = this.#intervalEnd - now;
      if (delay2 < 0) {
        this.#intervalCount = this.#carryoverConcurrencyCount ? this.#pending : 0;
      } else {
        if (this.#timeoutId === void 0) {
          this.#timeoutId = setTimeout(() => {
            this.#onResumeInterval();
          }, delay2);
        }
        return true;
      }
    }
    return false;
  }
  #tryToStartAnother() {
    if (this.#queue.size === 0) {
      if (this.#intervalId) {
        clearInterval(this.#intervalId);
      }
      this.#intervalId = void 0;
      this.emit("empty");
      if (this.#pending === 0) {
        this.emit("idle");
      }
      return false;
    }
    if (!this.#isPaused) {
      const canInitializeInterval = !this.#isIntervalPaused;
      if (this.#doesIntervalAllowAnother && this.#doesConcurrentAllowAnother) {
        const job = this.#queue.dequeue();
        if (!job) {
          return false;
        }
        this.emit("active");
        job();
        if (canInitializeInterval) {
          this.#initializeIntervalIfNeeded();
        }
        return true;
      }
    }
    return false;
  }
  #initializeIntervalIfNeeded() {
    if (this.#isIntervalIgnored || this.#intervalId !== void 0) {
      return;
    }
    this.#intervalId = setInterval(() => {
      this.#onInterval();
    }, this.#interval);
    this.#intervalEnd = Date.now() + this.#interval;
  }
  #onInterval() {
    if (this.#intervalCount === 0 && this.#pending === 0 && this.#intervalId) {
      clearInterval(this.#intervalId);
      this.#intervalId = void 0;
    }
    this.#intervalCount = this.#carryoverConcurrencyCount ? this.#pending : 0;
    this.#processQueue();
  }
  /**
  Executes all queued functions until it reaches the limit.
  */
  #processQueue() {
    while (this.#tryToStartAnother()) {
    }
  }
  get concurrency() {
    return this.#concurrency;
  }
  set concurrency(newConcurrency) {
    if (!(typeof newConcurrency === "number" && newConcurrency >= 1)) {
      throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${newConcurrency}\` (${typeof newConcurrency})`);
    }
    this.#concurrency = newConcurrency;
    this.#processQueue();
  }
  async #throwOnAbort(signal) {
    return new Promise((_resolve, reject) => {
      signal.addEventListener("abort", () => {
        reject(signal.reason);
      }, { once: true });
    });
  }
  async add(function_, options = {}) {
    options = {
      timeout: this.timeout,
      throwOnTimeout: this.#throwOnTimeout,
      ...options
    };
    return new Promise((resolve, reject) => {
      this.#queue.enqueue(async () => {
        this.#pending++;
        this.#intervalCount++;
        try {
          options.signal?.throwIfAborted();
          let operation = function_({ signal: options.signal });
          if (options.timeout) {
            operation = pTimeout(Promise.resolve(operation), { milliseconds: options.timeout });
          }
          if (options.signal) {
            operation = Promise.race([operation, this.#throwOnAbort(options.signal)]);
          }
          const result = await operation;
          resolve(result);
          this.emit("completed", result);
        } catch (error) {
          if (error instanceof TimeoutError && !options.throwOnTimeout) {
            resolve();
            return;
          }
          reject(error);
          this.emit("error", error);
        } finally {
          this.#next();
        }
      }, options);
      this.emit("add");
      this.#tryToStartAnother();
    });
  }
  async addAll(functions, options) {
    return Promise.all(functions.map(async (function_) => this.add(function_, options)));
  }
  /**
  Start (or resume) executing enqueued tasks within concurrency limit. No need to call this if queue is not paused (via `options.autoStart = false` or by `.pause()` method.)
  */
  start() {
    if (!this.#isPaused) {
      return this;
    }
    this.#isPaused = false;
    this.#processQueue();
    return this;
  }
  /**
  Put queue execution on hold.
  */
  pause() {
    this.#isPaused = true;
  }
  /**
  Clear the queue.
  */
  clear() {
    this.#queue = new this.#queueClass();
  }
  /**
      Can be called multiple times. Useful if you for example add additional items at a later time.
  
      @returns A promise that settles when the queue becomes empty.
      */
  async onEmpty() {
    if (this.#queue.size === 0) {
      return;
    }
    await this.#onEvent("empty");
  }
  /**
      @returns A promise that settles when the queue size is less than the given limit: `queue.size < limit`.
  
      If you want to avoid having the queue grow beyond a certain size you can `await queue.onSizeLessThan()` before adding a new item.
  
      Note that this only limits the number of items waiting to start. There could still be up to `concurrency` jobs already running that this call does not include in its calculation.
      */
  async onSizeLessThan(limit) {
    if (this.#queue.size < limit) {
      return;
    }
    await this.#onEvent("next", () => this.#queue.size < limit);
  }
  /**
      The difference with `.onEmpty` is that `.onIdle` guarantees that all work from the queue has finished. `.onEmpty` merely signals that the queue is empty, but it could mean that some promises haven't completed yet.
  
      @returns A promise that settles when the queue becomes empty, and all promises have completed; `queue.size === 0 && queue.pending === 0`.
      */
  async onIdle() {
    if (this.#pending === 0 && this.#queue.size === 0) {
      return;
    }
    await this.#onEvent("idle");
  }
  async #onEvent(event, filter2) {
    return new Promise((resolve) => {
      const listener = /* @__PURE__ */ __name(() => {
        if (filter2 && !filter2()) {
          return;
        }
        this.off(event, listener);
        resolve();
      }, "listener");
      this.on(event, listener);
    });
  }
  /**
  Size of the queue, the number of queued items waiting to run.
  */
  get size() {
    return this.#queue.size;
  }
  /**
      Size of the queue, filtered by the given options.
  
      For example, this can be used to find the number of items remaining in the queue with a specific priority level.
      */
  sizeBy(options) {
    return this.#queue.filter(options).length;
  }
  /**
  Number of running items (no longer in the queue).
  */
  get pending() {
    return this.#pending;
  }
  /**
  Whether the queue is currently paused.
  */
  get isPaused() {
    return this.#isPaused;
  }
};

// node_modules/observable-webworkers/dist/src/index.js
var events = {};
var observable = /* @__PURE__ */ __name((worker) => {
  worker.addEventListener("message", (event) => {
    observable.dispatchEvent("message", worker, event);
  });
  if (worker.port != null) {
    worker.port.addEventListener("message", (event) => {
      observable.dispatchEvent("message", worker, event);
    });
  }
}, "observable");
observable.addEventListener = (type, fn) => {
  if (events[type] == null) {
    events[type] = [];
  }
  events[type].push(fn);
};
observable.removeEventListener = (type, fn) => {
  if (events[type] == null) {
    return;
  }
  events[type] = events[type].filter((listener) => listener === fn);
};
observable.dispatchEvent = function(type, worker, event) {
  if (events[type] == null) {
    return;
  }
  events[type].forEach((fn) => fn(worker, event));
};
var src_default3 = observable;

// node_modules/mortice/dist/src/constants.js
var WORKER_REQUEST_READ_LOCK = "lock:worker:request-read";
var WORKER_RELEASE_READ_LOCK = "lock:worker:release-read";
var MASTER_GRANT_READ_LOCK = "lock:master:grant-read";
var WORKER_REQUEST_WRITE_LOCK = "lock:worker:request-write";
var WORKER_RELEASE_WRITE_LOCK = "lock:worker:release-write";
var MASTER_GRANT_WRITE_LOCK = "lock:master:grant-write";

// node_modules/mortice/dist/src/utils.js
var nanoid = /* @__PURE__ */ __name((size = 21) => {
  return Math.random().toString().substring(2);
}, "nanoid");

// node_modules/mortice/dist/src/browser.js
var handleWorkerLockRequest = /* @__PURE__ */ __name((emitter, masterEvent, requestType, releaseType, grantType) => {
  return (worker, event) => {
    if (event.data.type !== requestType) {
      return;
    }
    const requestEvent = {
      type: event.data.type,
      name: event.data.name,
      identifier: event.data.identifier
    };
    emitter.dispatchEvent(new MessageEvent(masterEvent, {
      data: {
        name: requestEvent.name,
        handler: /* @__PURE__ */ __name(async () => {
          worker.postMessage({
            type: grantType,
            name: requestEvent.name,
            identifier: requestEvent.identifier
          });
          await new Promise((resolve) => {
            const releaseEventListener = /* @__PURE__ */ __name((event2) => {
              if (event2 == null || event2.data == null) {
                return;
              }
              const releaseEvent = {
                type: event2.data.type,
                name: event2.data.name,
                identifier: event2.data.identifier
              };
              if (releaseEvent.type === releaseType && releaseEvent.identifier === requestEvent.identifier) {
                worker.removeEventListener("message", releaseEventListener);
                resolve();
              }
            }, "releaseEventListener");
            worker.addEventListener("message", releaseEventListener);
          });
        }, "handler")
      }
    }));
  };
}, "handleWorkerLockRequest");
var makeWorkerLockRequest = /* @__PURE__ */ __name((name3, requestType, grantType, releaseType) => {
  return async () => {
    const id = nanoid();
    globalThis.postMessage({
      type: requestType,
      identifier: id,
      name: name3
    });
    return new Promise((resolve) => {
      const listener = /* @__PURE__ */ __name((event) => {
        if (event == null || event.data == null) {
          return;
        }
        const responseEvent = {
          type: event.data.type,
          identifier: event.data.identifier
        };
        if (responseEvent.type === grantType && responseEvent.identifier === id) {
          globalThis.removeEventListener("message", listener);
          resolve(() => {
            globalThis.postMessage({
              type: releaseType,
              identifier: id,
              name: name3
            });
          });
        }
      }, "listener");
      globalThis.addEventListener("message", listener);
    });
  };
}, "makeWorkerLockRequest");
var defaultOptions = {
  singleProcess: false
};
var browser_default2 = /* @__PURE__ */ __name((options) => {
  options = Object.assign({}, defaultOptions, options);
  const isPrimary = Boolean(globalThis.document) || options.singleProcess;
  if (isPrimary) {
    const emitter = new EventTarget();
    src_default3.addEventListener("message", handleWorkerLockRequest(emitter, "requestReadLock", WORKER_REQUEST_READ_LOCK, WORKER_RELEASE_READ_LOCK, MASTER_GRANT_READ_LOCK));
    src_default3.addEventListener("message", handleWorkerLockRequest(emitter, "requestWriteLock", WORKER_REQUEST_WRITE_LOCK, WORKER_RELEASE_WRITE_LOCK, MASTER_GRANT_WRITE_LOCK));
    return emitter;
  }
  return {
    isWorker: true,
    readLock: /* @__PURE__ */ __name((name3) => makeWorkerLockRequest(name3, WORKER_REQUEST_READ_LOCK, MASTER_GRANT_READ_LOCK, WORKER_RELEASE_READ_LOCK), "readLock"),
    writeLock: /* @__PURE__ */ __name((name3) => makeWorkerLockRequest(name3, WORKER_REQUEST_WRITE_LOCK, MASTER_GRANT_WRITE_LOCK, WORKER_RELEASE_WRITE_LOCK), "writeLock")
  };
}, "default");

// node_modules/mortice/dist/src/index.js
var mutexes = {};
var implementation;
async function createReleaseable(queue, options) {
  let res;
  const p = new Promise((resolve) => {
    res = resolve;
  });
  void queue.add(async () => pTimeout((async () => {
    await new Promise((resolve) => {
      res(() => {
        resolve();
      });
    });
  })(), {
    milliseconds: options.timeout
  }));
  return p;
}
__name(createReleaseable, "createReleaseable");
var createMutex = /* @__PURE__ */ __name((name3, options) => {
  if (implementation.isWorker === true) {
    return {
      readLock: implementation.readLock(name3, options),
      writeLock: implementation.writeLock(name3, options)
    };
  }
  const masterQueue = new PQueue({ concurrency: 1 });
  let readQueue;
  return {
    async readLock() {
      if (readQueue != null) {
        return createReleaseable(readQueue, options);
      }
      readQueue = new PQueue({
        concurrency: options.concurrency,
        autoStart: false
      });
      const localReadQueue = readQueue;
      const readPromise = createReleaseable(readQueue, options);
      void masterQueue.add(async () => {
        localReadQueue.start();
        await localReadQueue.onIdle().then(() => {
          if (readQueue === localReadQueue) {
            readQueue = null;
          }
        });
      });
      return readPromise;
    },
    async writeLock() {
      readQueue = null;
      return createReleaseable(masterQueue, options);
    }
  };
}, "createMutex");
var defaultOptions2 = {
  name: "lock",
  concurrency: Infinity,
  timeout: 846e5,
  singleProcess: false
};
function createMortice(options) {
  const opts = Object.assign({}, defaultOptions2, options);
  if (implementation == null) {
    implementation = browser_default2(opts);
    if (implementation.isWorker !== true) {
      implementation.addEventListener("requestReadLock", (event) => {
        if (mutexes[event.data.name] == null) {
          return;
        }
        void mutexes[event.data.name].readLock().then(async (release) => event.data.handler().finally(() => {
          release();
        }));
      });
      implementation.addEventListener("requestWriteLock", async (event) => {
        if (mutexes[event.data.name] == null) {
          return;
        }
        void mutexes[event.data.name].writeLock().then(async (release) => event.data.handler().finally(() => {
          release();
        }));
      });
    }
  }
  if (mutexes[opts.name] == null) {
    mutexes[opts.name] = createMutex(opts.name, opts);
  }
  return mutexes[opts.name];
}
__name(createMortice, "createMortice");

// node_modules/@libp2p/peer-store/dist/src/errors.js
var codes3 = {
  ERR_INVALID_PARAMETERS: "ERR_INVALID_PARAMETERS"
};

// node_modules/@libp2p/peer-store/dist/src/pb/peer.js
var Peer;
(function(Peer2) {
  let Peer$metadataEntry;
  (function(Peer$metadataEntry2) {
    let _codec2;
    Peer$metadataEntry2.codec = () => {
      if (_codec2 == null) {
        _codec2 = message((obj, w2, opts = {}) => {
          if (opts.lengthDelimited !== false) {
            w2.fork();
          }
          if (obj.key != null && obj.key !== "") {
            w2.uint32(10);
            w2.string(obj.key);
          }
          if (obj.value != null && obj.value.byteLength > 0) {
            w2.uint32(18);
            w2.bytes(obj.value);
          }
          if (opts.lengthDelimited !== false) {
            w2.ldelim();
          }
        }, (reader, length3) => {
          const obj = {
            key: "",
            value: new Uint8Array(0)
          };
          const end = length3 == null ? reader.len : reader.pos + length3;
          while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
              case 1:
                obj.key = reader.string();
                break;
              case 2:
                obj.value = reader.bytes();
                break;
              default:
                reader.skipType(tag & 7);
                break;
            }
          }
          return obj;
        });
      }
      return _codec2;
    };
    Peer$metadataEntry2.encode = (obj) => {
      return encodeMessage(obj, Peer$metadataEntry2.codec());
    };
    Peer$metadataEntry2.decode = (buf) => {
      return decodeMessage(buf, Peer$metadataEntry2.codec());
    };
  })(Peer$metadataEntry = Peer2.Peer$metadataEntry || (Peer2.Peer$metadataEntry = {}));
  let Peer$tagsEntry;
  (function(Peer$tagsEntry2) {
    let _codec2;
    Peer$tagsEntry2.codec = () => {
      if (_codec2 == null) {
        _codec2 = message((obj, w2, opts = {}) => {
          if (opts.lengthDelimited !== false) {
            w2.fork();
          }
          if (obj.key != null && obj.key !== "") {
            w2.uint32(10);
            w2.string(obj.key);
          }
          if (obj.value != null) {
            w2.uint32(18);
            Tag.codec().encode(obj.value, w2);
          }
          if (opts.lengthDelimited !== false) {
            w2.ldelim();
          }
        }, (reader, length3) => {
          const obj = {
            key: ""
          };
          const end = length3 == null ? reader.len : reader.pos + length3;
          while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
              case 1:
                obj.key = reader.string();
                break;
              case 2:
                obj.value = Tag.codec().decode(reader, reader.uint32());
                break;
              default:
                reader.skipType(tag & 7);
                break;
            }
          }
          return obj;
        });
      }
      return _codec2;
    };
    Peer$tagsEntry2.encode = (obj) => {
      return encodeMessage(obj, Peer$tagsEntry2.codec());
    };
    Peer$tagsEntry2.decode = (buf) => {
      return decodeMessage(buf, Peer$tagsEntry2.codec());
    };
  })(Peer$tagsEntry = Peer2.Peer$tagsEntry || (Peer2.Peer$tagsEntry = {}));
  let _codec;
  Peer2.codec = () => {
    if (_codec == null) {
      _codec = message((obj, w2, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w2.fork();
        }
        if (obj.addresses != null) {
          for (const value of obj.addresses) {
            w2.uint32(10);
            Address.codec().encode(value, w2);
          }
        }
        if (obj.protocols != null) {
          for (const value of obj.protocols) {
            w2.uint32(18);
            w2.string(value);
          }
        }
        if (obj.publicKey != null) {
          w2.uint32(34);
          w2.bytes(obj.publicKey);
        }
        if (obj.peerRecordEnvelope != null) {
          w2.uint32(42);
          w2.bytes(obj.peerRecordEnvelope);
        }
        if (obj.metadata != null && obj.metadata.size !== 0) {
          for (const [key, value] of obj.metadata.entries()) {
            w2.uint32(50);
            Peer2.Peer$metadataEntry.codec().encode({ key, value }, w2);
          }
        }
        if (obj.tags != null && obj.tags.size !== 0) {
          for (const [key, value] of obj.tags.entries()) {
            w2.uint32(58);
            Peer2.Peer$tagsEntry.codec().encode({ key, value }, w2);
          }
        }
        if (opts.lengthDelimited !== false) {
          w2.ldelim();
        }
      }, (reader, length3) => {
        const obj = {
          addresses: [],
          protocols: [],
          metadata: /* @__PURE__ */ new Map(),
          tags: /* @__PURE__ */ new Map()
        };
        const end = length3 == null ? reader.len : reader.pos + length3;
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              obj.addresses.push(Address.codec().decode(reader, reader.uint32()));
              break;
            case 2:
              obj.protocols.push(reader.string());
              break;
            case 4:
              obj.publicKey = reader.bytes();
              break;
            case 5:
              obj.peerRecordEnvelope = reader.bytes();
              break;
            case 6: {
              const entry = Peer2.Peer$metadataEntry.codec().decode(reader, reader.uint32());
              obj.metadata.set(entry.key, entry.value);
              break;
            }
            case 7: {
              const entry = Peer2.Peer$tagsEntry.codec().decode(reader, reader.uint32());
              obj.tags.set(entry.key, entry.value);
              break;
            }
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return obj;
      });
    }
    return _codec;
  };
  Peer2.encode = (obj) => {
    return encodeMessage(obj, Peer2.codec());
  };
  Peer2.decode = (buf) => {
    return decodeMessage(buf, Peer2.codec());
  };
})(Peer || (Peer = {}));
var Address;
(function(Address2) {
  let _codec;
  Address2.codec = () => {
    if (_codec == null) {
      _codec = message((obj, w2, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w2.fork();
        }
        if (obj.multiaddr != null && obj.multiaddr.byteLength > 0) {
          w2.uint32(10);
          w2.bytes(obj.multiaddr);
        }
        if (obj.isCertified != null) {
          w2.uint32(16);
          w2.bool(obj.isCertified);
        }
        if (opts.lengthDelimited !== false) {
          w2.ldelim();
        }
      }, (reader, length3) => {
        const obj = {
          multiaddr: new Uint8Array(0)
        };
        const end = length3 == null ? reader.len : reader.pos + length3;
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              obj.multiaddr = reader.bytes();
              break;
            case 2:
              obj.isCertified = reader.bool();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return obj;
      });
    }
    return _codec;
  };
  Address2.encode = (obj) => {
    return encodeMessage(obj, Address2.codec());
  };
  Address2.decode = (buf) => {
    return decodeMessage(buf, Address2.codec());
  };
})(Address || (Address = {}));
var Tag;
(function(Tag2) {
  let _codec;
  Tag2.codec = () => {
    if (_codec == null) {
      _codec = message((obj, w2, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w2.fork();
        }
        if (obj.value != null && obj.value !== 0) {
          w2.uint32(8);
          w2.uint32(obj.value);
        }
        if (obj.expiry != null) {
          w2.uint32(16);
          w2.uint64(obj.expiry);
        }
        if (opts.lengthDelimited !== false) {
          w2.ldelim();
        }
      }, (reader, length3) => {
        const obj = {
          value: 0
        };
        const end = length3 == null ? reader.len : reader.pos + length3;
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              obj.value = reader.uint32();
              break;
            case 2:
              obj.expiry = reader.uint64();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return obj;
      });
    }
    return _codec;
  };
  Tag2.encode = (obj) => {
    return encodeMessage(obj, Tag2.codec());
  };
  Tag2.decode = (buf) => {
    return decodeMessage(buf, Tag2.codec());
  };
})(Tag || (Tag = {}));

// node_modules/@libp2p/peer-store/dist/src/utils/bytes-to-peer.js
function bytesToPeer(peerId2, buf) {
  const peer = Peer.decode(buf);
  if (peer.publicKey != null && peerId2.publicKey == null) {
    peerId2 = peerIdFromPeerId({
      ...peerId2,
      publicKey: peerId2.publicKey
    });
  }
  const tags = /* @__PURE__ */ new Map();
  const now = BigInt(Date.now());
  for (const [key, tag] of peer.tags.entries()) {
    if (tag.expiry != null && tag.expiry < now) {
      continue;
    }
    tags.set(key, tag);
  }
  return {
    ...peer,
    id: peerId2,
    addresses: peer.addresses.map(({ multiaddr: ma, isCertified }) => {
      return {
        multiaddr: multiaddr(ma),
        isCertified: isCertified ?? false
      };
    }),
    metadata: peer.metadata,
    peerRecordEnvelope: peer.peerRecordEnvelope ?? void 0,
    tags
  };
}
__name(bytesToPeer, "bytesToPeer");

// node_modules/interface-datastore/dist/src/key.js
var pathSepS = "/";
var pathSepB = new TextEncoder().encode(pathSepS);
var pathSep = pathSepB[0];
var Key = class _Key {
  static {
    __name(this, "Key");
  }
  _buf;
  /**
   * @param {string | Uint8Array} s
   * @param {boolean} [clean]
   */
  constructor(s2, clean) {
    if (typeof s2 === "string") {
      this._buf = fromString2(s2);
    } else if (s2 instanceof Uint8Array) {
      this._buf = s2;
    } else {
      throw new Error("Invalid key, should be String of Uint8Array");
    }
    if (clean == null) {
      clean = true;
    }
    if (clean) {
      this.clean();
    }
    if (this._buf.byteLength === 0 || this._buf[0] !== pathSep) {
      throw new Error("Invalid key");
    }
  }
  /**
   * Convert to the string representation
   *
   * @param {import('uint8arrays/to-string').SupportedEncodings} [encoding='utf8'] - The encoding to use.
   * @returns {string}
   */
  toString(encoding = "utf8") {
    return toString2(this._buf, encoding);
  }
  /**
   * Return the Uint8Array representation of the key
   *
   * @returns {Uint8Array}
   */
  uint8Array() {
    return this._buf;
  }
  /**
   * Return string representation of the key
   *
   * @returns {string}
   */
  get [Symbol.toStringTag]() {
    return `Key(${this.toString()})`;
  }
  /**
   * Constructs a key out of a namespace array.
   *
   * @param {Array<string>} list - The array of namespaces
   * @returns {Key}
   *
   * @example
   * ```js
   * Key.withNamespaces(['one', 'two'])
   * // => Key('/one/two')
   * ```
   */
  static withNamespaces(list) {
    return new _Key(list.join(pathSepS));
  }
  /**
   * Returns a randomly (uuid) generated key.
   *
   * @returns {Key}
   *
   * @example
   * ```js
   * Key.random()
   * // => Key('/344502982398')
   * ```
   */
  static random() {
    return new _Key(Math.random().toString().substring(2));
  }
  /**
   * @param {*} other
   */
  static asKey(other) {
    if (other instanceof Uint8Array || typeof other === "string") {
      return new _Key(other);
    }
    if (typeof other.uint8Array === "function") {
      return new _Key(other.uint8Array());
    }
    return null;
  }
  /**
   * Cleanup the current key
   *
   * @returns {void}
   */
  clean() {
    if (this._buf == null || this._buf.byteLength === 0) {
      this._buf = pathSepB;
    }
    if (this._buf[0] !== pathSep) {
      const bytes2 = new Uint8Array(this._buf.byteLength + 1);
      bytes2.fill(pathSep, 0, 1);
      bytes2.set(this._buf, 1);
      this._buf = bytes2;
    }
    while (this._buf.byteLength > 1 && this._buf[this._buf.byteLength - 1] === pathSep) {
      this._buf = this._buf.subarray(0, -1);
    }
  }
  /**
   * Check if the given key is sorted lower than ourself.
   *
   * @param {Key} key - The other Key to check against
   * @returns {boolean}
   */
  less(key) {
    const list1 = this.list();
    const list2 = key.list();
    for (let i = 0; i < list1.length; i++) {
      if (list2.length < i + 1) {
        return false;
      }
      const c1 = list1[i];
      const c2 = list2[i];
      if (c1 < c2) {
        return true;
      } else if (c1 > c2) {
        return false;
      }
    }
    return list1.length < list2.length;
  }
  /**
   * Returns the key with all parts in reversed order.
   *
   * @returns {Key}
   *
   * @example
   * ```js
   * new Key('/Comedy/MontyPython/Actor:JohnCleese').reverse()
   * // => Key('/Actor:JohnCleese/MontyPython/Comedy')
   * ```
   */
  reverse() {
    return _Key.withNamespaces(this.list().slice().reverse());
  }
  /**
   * Returns the `namespaces` making up this Key.
   *
   * @returns {Array<string>}
   */
  namespaces() {
    return this.list();
  }
  /** Returns the "base" namespace of this key.
   *
   * @returns {string}
   *
   * @example
   * ```js
   * new Key('/Comedy/MontyPython/Actor:JohnCleese').baseNamespace()
   * // => 'Actor:JohnCleese'
   * ```
   */
  baseNamespace() {
    const ns = this.namespaces();
    return ns[ns.length - 1];
  }
  /**
   * Returns the `list` representation of this key.
   *
   * @returns {Array<string>}
   *
   * @example
   * ```js
   * new Key('/Comedy/MontyPython/Actor:JohnCleese').list()
   * // => ['Comedy', 'MontyPythong', 'Actor:JohnCleese']
   * ```
   */
  list() {
    return this.toString().split(pathSepS).slice(1);
  }
  /**
   * Returns the "type" of this key (value of last namespace).
   *
   * @returns {string}
   *
   * @example
   * ```js
   * new Key('/Comedy/MontyPython/Actor:JohnCleese').type()
   * // => 'Actor'
   * ```
   */
  type() {
    return namespaceType(this.baseNamespace());
  }
  /**
   * Returns the "name" of this key (field of last namespace).
   *
   * @returns {string}
   *
   * @example
   * ```js
   * new Key('/Comedy/MontyPython/Actor:JohnCleese').name()
   * // => 'JohnCleese'
   * ```
   */
  name() {
    return namespaceValue(this.baseNamespace());
  }
  /**
   * Returns an "instance" of this type key (appends value to namespace).
   *
   * @param {string} s - The string to append.
   * @returns {Key}
   *
   * @example
   * ```js
   * new Key('/Comedy/MontyPython/Actor').instance('JohnClesse')
   * // => Key('/Comedy/MontyPython/Actor:JohnCleese')
   * ```
   */
  instance(s2) {
    return new _Key(this.toString() + ":" + s2);
  }
  /**
   * Returns the "path" of this key (parent + type).
   *
   * @returns {Key}
   *
   * @example
   * ```js
   * new Key('/Comedy/MontyPython/Actor:JohnCleese').path()
   * // => Key('/Comedy/MontyPython/Actor')
   * ```
   */
  path() {
    let p = this.parent().toString();
    if (!p.endsWith(pathSepS)) {
      p += pathSepS;
    }
    p += this.type();
    return new _Key(p);
  }
  /**
   * Returns the `parent` Key of this Key.
   *
   * @returns {Key}
   *
   * @example
   * ```js
   * new Key("/Comedy/MontyPython/Actor:JohnCleese").parent()
   * // => Key("/Comedy/MontyPython")
   * ```
   */
  parent() {
    const list = this.list();
    if (list.length === 1) {
      return new _Key(pathSepS);
    }
    return new _Key(list.slice(0, -1).join(pathSepS));
  }
  /**
   * Returns the `child` Key of this Key.
   *
   * @param {Key} key - The child Key to add
   * @returns {Key}
   *
   * @example
   * ```js
   * new Key('/Comedy/MontyPython').child(new Key('Actor:JohnCleese'))
   * // => Key('/Comedy/MontyPython/Actor:JohnCleese')
   * ```
   */
  child(key) {
    if (this.toString() === pathSepS) {
      return key;
    } else if (key.toString() === pathSepS) {
      return this;
    }
    return new _Key(this.toString() + key.toString(), false);
  }
  /**
   * Returns whether this key is a prefix of `other`
   *
   * @param {Key} other - The other key to test against
   * @returns {boolean}
   *
   * @example
   * ```js
   * new Key('/Comedy').isAncestorOf('/Comedy/MontyPython')
   * // => true
   * ```
   */
  isAncestorOf(other) {
    if (other.toString() === this.toString()) {
      return false;
    }
    return other.toString().startsWith(this.toString());
  }
  /**
   * Returns whether this key is a contains another as prefix.
   *
   * @param {Key} other - The other Key to test against
   * @returns {boolean}
   *
   * @example
   * ```js
   * new Key('/Comedy/MontyPython').isDecendantOf('/Comedy')
   * // => true
   * ```
   */
  isDecendantOf(other) {
    if (other.toString() === this.toString()) {
      return false;
    }
    return this.toString().startsWith(other.toString());
  }
  /**
   * Checks if this key has only one namespace.
   *
   * @returns {boolean}
   */
  isTopLevel() {
    return this.list().length === 1;
  }
  /**
   * Concats one or more Keys into one new Key.
   *
   * @param {Array<Key>} keys - The array of keys to concatenate
   * @returns {Key}
   */
  concat(...keys) {
    return _Key.withNamespaces([...this.namespaces(), ...flatten(keys.map((key) => key.namespaces()))]);
  }
};
function namespaceType(ns) {
  const parts = ns.split(":");
  if (parts.length < 2) {
    return "";
  }
  return parts.slice(0, -1).join(":");
}
__name(namespaceType, "namespaceType");
function namespaceValue(ns) {
  const parts = ns.split(":");
  return parts[parts.length - 1];
}
__name(namespaceValue, "namespaceValue");
function flatten(arr) {
  return [].concat(...arr);
}
__name(flatten, "flatten");

// node_modules/@libp2p/peer-store/dist/src/utils/peer-id-to-datastore-key.js
var NAMESPACE_COMMON = "/peers/";
function peerIdToDatastoreKey(peerId2) {
  if (!isPeerId(peerId2) || peerId2.type == null) {
    throw new CodeError("Invalid PeerId", codes3.ERR_INVALID_PARAMETERS);
  }
  const b32key = peerId2.toCID().toString();
  return new Key(`${NAMESPACE_COMMON}${b32key}`);
}
__name(peerIdToDatastoreKey, "peerIdToDatastoreKey");

// node_modules/@libp2p/peer-store/dist/src/utils/dedupe-addresses.js
async function dedupeFilterAndSortAddresses(peerId2, filter2, addresses) {
  const addressMap = /* @__PURE__ */ new Map();
  for (const addr of addresses) {
    if (addr == null) {
      continue;
    }
    if (addr.multiaddr instanceof Uint8Array) {
      addr.multiaddr = multiaddr(addr.multiaddr);
    }
    if (!isMultiaddr(addr.multiaddr)) {
      throw new CodeError("Multiaddr was invalid", codes3.ERR_INVALID_PARAMETERS);
    }
    if (!await filter2(peerId2, addr.multiaddr)) {
      continue;
    }
    const isCertified = addr.isCertified ?? false;
    const maStr = addr.multiaddr.toString();
    const existingAddr = addressMap.get(maStr);
    if (existingAddr != null) {
      addr.isCertified = existingAddr.isCertified || isCertified;
    } else {
      addressMap.set(maStr, {
        multiaddr: addr.multiaddr,
        isCertified
      });
    }
  }
  return [...addressMap.values()].sort((a, b) => {
    return a.multiaddr.toString().localeCompare(b.multiaddr.toString());
  }).map(({ isCertified, multiaddr: multiaddr2 }) => ({
    isCertified,
    multiaddr: multiaddr2.bytes
  }));
}
__name(dedupeFilterAndSortAddresses, "dedupeFilterAndSortAddresses");

// node_modules/@libp2p/peer-store/dist/src/utils/to-peer-pb.js
async function toPeerPB(peerId2, data, strategy, options) {
  if (data == null) {
    throw new CodeError("Invalid PeerData", codes3.ERR_INVALID_PARAMETERS);
  }
  if (data.publicKey != null && peerId2.publicKey != null && !equals3(data.publicKey, peerId2.publicKey)) {
    throw new CodeError("publicKey bytes do not match peer id publicKey bytes", codes3.ERR_INVALID_PARAMETERS);
  }
  const existingPeer = options.existingPeer;
  if (existingPeer != null && !peerId2.equals(existingPeer.id)) {
    throw new CodeError("peer id did not match existing peer id", codes3.ERR_INVALID_PARAMETERS);
  }
  let addresses = existingPeer?.addresses ?? [];
  let protocols = new Set(existingPeer?.protocols ?? []);
  let metadata = existingPeer?.metadata ?? /* @__PURE__ */ new Map();
  let tags = existingPeer?.tags ?? /* @__PURE__ */ new Map();
  let peerRecordEnvelope = existingPeer?.peerRecordEnvelope;
  if (strategy === "patch") {
    if (data.multiaddrs != null || data.addresses != null) {
      addresses = [];
      if (data.multiaddrs != null) {
        addresses.push(...data.multiaddrs.map((multiaddr2) => ({
          isCertified: false,
          multiaddr: multiaddr2
        })));
      }
      if (data.addresses != null) {
        addresses.push(...data.addresses);
      }
    }
    if (data.protocols != null) {
      protocols = new Set(data.protocols);
    }
    if (data.metadata != null) {
      const metadataEntries = data.metadata instanceof Map ? [...data.metadata.entries()] : Object.entries(data.metadata);
      metadata = createSortedMap(metadataEntries, {
        validate: validateMetadata
      });
    }
    if (data.tags != null) {
      const tagsEntries = data.tags instanceof Map ? [...data.tags.entries()] : Object.entries(data.tags);
      tags = createSortedMap(tagsEntries, {
        validate: validateTag,
        map: mapTag
      });
    }
    if (data.peerRecordEnvelope != null) {
      peerRecordEnvelope = data.peerRecordEnvelope;
    }
  }
  if (strategy === "merge") {
    if (data.multiaddrs != null) {
      addresses.push(...data.multiaddrs.map((multiaddr2) => ({
        isCertified: false,
        multiaddr: multiaddr2
      })));
    }
    if (data.addresses != null) {
      addresses.push(...data.addresses);
    }
    if (data.protocols != null) {
      protocols = /* @__PURE__ */ new Set([...protocols, ...data.protocols]);
    }
    if (data.metadata != null) {
      const metadataEntries = data.metadata instanceof Map ? [...data.metadata.entries()] : Object.entries(data.metadata);
      for (const [key, value] of metadataEntries) {
        if (value == null) {
          metadata.delete(key);
        } else {
          metadata.set(key, value);
        }
      }
      metadata = createSortedMap([...metadata.entries()], {
        validate: validateMetadata
      });
    }
    if (data.tags != null) {
      const tagsEntries = data.tags instanceof Map ? [...data.tags.entries()] : Object.entries(data.tags);
      const mergedTags = new Map(tags);
      for (const [key, value] of tagsEntries) {
        if (value == null) {
          mergedTags.delete(key);
        } else {
          mergedTags.set(key, value);
        }
      }
      tags = createSortedMap([...mergedTags.entries()], {
        validate: validateTag,
        map: mapTag
      });
    }
    if (data.peerRecordEnvelope != null) {
      peerRecordEnvelope = data.peerRecordEnvelope;
    }
  }
  const output2 = {
    addresses: await dedupeFilterAndSortAddresses(peerId2, options.addressFilter ?? (async () => true), addresses),
    protocols: [...protocols.values()].sort((a, b) => {
      return a.localeCompare(b);
    }),
    metadata,
    tags,
    publicKey: existingPeer?.id.publicKey ?? data.publicKey ?? peerId2.publicKey,
    peerRecordEnvelope
  };
  if (peerId2.type !== "RSA") {
    delete output2.publicKey;
  }
  return output2;
}
__name(toPeerPB, "toPeerPB");
function createSortedMap(entries, options) {
  const output2 = /* @__PURE__ */ new Map();
  for (const [key, value] of entries) {
    if (value == null) {
      continue;
    }
    options.validate(key, value);
  }
  for (const [key, value] of entries.sort(([a], [b]) => {
    return a.localeCompare(b);
  })) {
    if (value != null) {
      output2.set(key, options.map?.(key, value) ?? value);
    }
  }
  return output2;
}
__name(createSortedMap, "createSortedMap");
function validateMetadata(key, value) {
  if (typeof key !== "string") {
    throw new CodeError("Metadata key must be a string", codes3.ERR_INVALID_PARAMETERS);
  }
  if (!(value instanceof Uint8Array)) {
    throw new CodeError("Metadata value must be a Uint8Array", codes3.ERR_INVALID_PARAMETERS);
  }
}
__name(validateMetadata, "validateMetadata");
function validateTag(key, tag) {
  if (typeof key !== "string") {
    throw new CodeError("Tag name must be a string", codes3.ERR_INVALID_PARAMETERS);
  }
  if (tag.value != null) {
    if (parseInt(`${tag.value}`, 10) !== tag.value) {
      throw new CodeError("Tag value must be an integer", codes3.ERR_INVALID_PARAMETERS);
    }
    if (tag.value < 0 || tag.value > 100) {
      throw new CodeError("Tag value must be between 0-100", codes3.ERR_INVALID_PARAMETERS);
    }
  }
  if (tag.ttl != null) {
    if (parseInt(`${tag.ttl}`, 10) !== tag.ttl) {
      throw new CodeError("Tag ttl must be an integer", codes3.ERR_INVALID_PARAMETERS);
    }
    if (tag.ttl < 0) {
      throw new CodeError("Tag ttl must be between greater than 0", codes3.ERR_INVALID_PARAMETERS);
    }
  }
}
__name(validateTag, "validateTag");
function mapTag(key, tag) {
  let expiry;
  if (tag.expiry != null) {
    expiry = tag.expiry;
  }
  if (tag.ttl != null) {
    expiry = BigInt(Date.now() + Number(tag.ttl));
  }
  return {
    value: tag.value ?? 0,
    expiry
  };
}
__name(mapTag, "mapTag");

// node_modules/@libp2p/peer-store/dist/src/store.js
function decodePeer(key, value, cache3) {
  const base32Str = key.toString().split("/")[2];
  const buf = base32.decode(base32Str);
  const peerId2 = peerIdFromBytes(buf);
  const cached = cache3.get(peerId2);
  if (cached != null) {
    return cached;
  }
  const peer = bytesToPeer(peerId2, value);
  cache3.set(peerId2, peer);
  return peer;
}
__name(decodePeer, "decodePeer");
function mapQuery(query, cache3) {
  if (query == null) {
    return {};
  }
  return {
    prefix: NAMESPACE_COMMON,
    filters: (query.filters ?? []).map((fn) => ({ key, value }) => {
      return fn(decodePeer(key, value, cache3));
    }),
    orders: (query.orders ?? []).map((fn) => (a, b) => {
      return fn(decodePeer(a.key, a.value, cache3), decodePeer(b.key, b.value, cache3));
    })
  };
}
__name(mapQuery, "mapQuery");
var PersistentStore = class {
  static {
    __name(this, "PersistentStore");
  }
  peerId;
  datastore;
  lock;
  addressFilter;
  constructor(components, init = {}) {
    this.peerId = components.peerId;
    this.datastore = components.datastore;
    this.addressFilter = init.addressFilter;
    this.lock = createMortice({
      name: "peer-store",
      singleProcess: true
    });
  }
  async has(peerId2) {
    return this.datastore.has(peerIdToDatastoreKey(peerId2));
  }
  async delete(peerId2) {
    if (this.peerId.equals(peerId2)) {
      throw new CodeError("Cannot delete self peer", codes3.ERR_INVALID_PARAMETERS);
    }
    await this.datastore.delete(peerIdToDatastoreKey(peerId2));
  }
  async load(peerId2) {
    const buf = await this.datastore.get(peerIdToDatastoreKey(peerId2));
    return bytesToPeer(peerId2, buf);
  }
  async save(peerId2, data) {
    const { existingBuf, existingPeer } = await this.#findExistingPeer(peerId2);
    const peerPb = await toPeerPB(peerId2, data, "patch", {
      addressFilter: this.addressFilter
    });
    return this.#saveIfDifferent(peerId2, peerPb, existingBuf, existingPeer);
  }
  async patch(peerId2, data) {
    const { existingBuf, existingPeer } = await this.#findExistingPeer(peerId2);
    const peerPb = await toPeerPB(peerId2, data, "patch", {
      addressFilter: this.addressFilter,
      existingPeer
    });
    return this.#saveIfDifferent(peerId2, peerPb, existingBuf, existingPeer);
  }
  async merge(peerId2, data) {
    const { existingBuf, existingPeer } = await this.#findExistingPeer(peerId2);
    const peerPb = await toPeerPB(peerId2, data, "merge", {
      addressFilter: this.addressFilter,
      existingPeer
    });
    return this.#saveIfDifferent(peerId2, peerPb, existingBuf, existingPeer);
  }
  async *all(query) {
    const peerCache = new PeerMap();
    for await (const { key, value } of this.datastore.query(mapQuery(query ?? {}, peerCache))) {
      const peer = decodePeer(key, value, peerCache);
      if (peer.id.equals(this.peerId)) {
        continue;
      }
      yield peer;
    }
  }
  async #findExistingPeer(peerId2) {
    try {
      const existingBuf = await this.datastore.get(peerIdToDatastoreKey(peerId2));
      const existingPeer = bytesToPeer(peerId2, existingBuf);
      return {
        existingBuf,
        existingPeer
      };
    } catch (err) {
      if (err.code !== "ERR_NOT_FOUND") {
        throw err;
      }
    }
    return {};
  }
  async #saveIfDifferent(peerId2, peer, existingBuf, existingPeer) {
    const buf = Peer.encode(peer);
    if (existingBuf != null && equals3(buf, existingBuf)) {
      return {
        peer: bytesToPeer(peerId2, buf),
        previous: existingPeer,
        updated: false
      };
    }
    await this.datastore.put(peerIdToDatastoreKey(peerId2), buf);
    return {
      peer: bytesToPeer(peerId2, buf),
      previous: existingPeer,
      updated: true
    };
  }
};

// node_modules/@libp2p/peer-store/dist/src/index.js
var PersistentPeerStore = class {
  static {
    __name(this, "PersistentPeerStore");
  }
  store;
  events;
  peerId;
  log;
  constructor(components, init = {}) {
    this.log = components.logger.forComponent("libp2p:peer-store");
    this.events = components.events;
    this.peerId = components.peerId;
    this.store = new PersistentStore(components, init);
  }
  [Symbol.toStringTag] = "@libp2p/peer-store";
  async forEach(fn, query) {
    this.log.trace("forEach await read lock");
    const release = await this.store.lock.readLock();
    this.log.trace("forEach got read lock");
    try {
      for await (const peer of this.store.all(query)) {
        fn(peer);
      }
    } finally {
      this.log.trace("forEach release read lock");
      release();
    }
  }
  async all(query) {
    this.log.trace("all await read lock");
    const release = await this.store.lock.readLock();
    this.log.trace("all got read lock");
    try {
      return await src_default2(this.store.all(query));
    } finally {
      this.log.trace("all release read lock");
      release();
    }
  }
  async delete(peerId2) {
    this.log.trace("delete await write lock");
    const release = await this.store.lock.writeLock();
    this.log.trace("delete got write lock");
    try {
      await this.store.delete(peerId2);
    } finally {
      this.log.trace("delete release write lock");
      release();
    }
  }
  async has(peerId2) {
    this.log.trace("has await read lock");
    const release = await this.store.lock.readLock();
    this.log.trace("has got read lock");
    try {
      return await this.store.has(peerId2);
    } finally {
      this.log.trace("has release read lock");
      release();
    }
  }
  async get(peerId2) {
    this.log.trace("get await read lock");
    const release = await this.store.lock.readLock();
    this.log.trace("get got read lock");
    try {
      return await this.store.load(peerId2);
    } finally {
      this.log.trace("get release read lock");
      release();
    }
  }
  async save(id, data) {
    this.log.trace("save await write lock");
    const release = await this.store.lock.writeLock();
    this.log.trace("save got write lock");
    try {
      const result = await this.store.save(id, data);
      this.#emitIfUpdated(id, result);
      return result.peer;
    } finally {
      this.log.trace("save release write lock");
      release();
    }
  }
  async patch(id, data) {
    this.log.trace("patch await write lock");
    const release = await this.store.lock.writeLock();
    this.log.trace("patch got write lock");
    try {
      const result = await this.store.patch(id, data);
      this.#emitIfUpdated(id, result);
      return result.peer;
    } finally {
      this.log.trace("patch release write lock");
      release();
    }
  }
  async merge(id, data) {
    this.log.trace("merge await write lock");
    const release = await this.store.lock.writeLock();
    this.log.trace("merge got write lock");
    try {
      const result = await this.store.merge(id, data);
      this.#emitIfUpdated(id, result);
      return result.peer;
    } finally {
      this.log.trace("merge release write lock");
      release();
    }
  }
  async consumePeerRecord(buf, expectedPeer) {
    const envelope = await RecordEnvelope.openAndCertify(buf, PeerRecord2.DOMAIN);
    if (expectedPeer?.equals(envelope.peerId) === false) {
      this.log("envelope peer id was not the expected peer id - expected: %p received: %p", expectedPeer, envelope.peerId);
      return false;
    }
    const peerRecord = PeerRecord2.createFromProtobuf(envelope.payload);
    let peer;
    try {
      peer = await this.get(envelope.peerId);
    } catch (err) {
      if (err.code !== "ERR_NOT_FOUND") {
        throw err;
      }
    }
    if (peer?.peerRecordEnvelope != null) {
      const storedEnvelope = await RecordEnvelope.createFromProtobuf(peer.peerRecordEnvelope);
      const storedRecord = PeerRecord2.createFromProtobuf(storedEnvelope.payload);
      if (storedRecord.seqNumber >= peerRecord.seqNumber) {
        this.log("sequence number was lower or equal to existing sequence number - stored: %d received: %d", storedRecord.seqNumber, peerRecord.seqNumber);
        return false;
      }
    }
    await this.patch(peerRecord.peerId, {
      peerRecordEnvelope: buf,
      addresses: peerRecord.multiaddrs.map((multiaddr2) => ({
        isCertified: true,
        multiaddr: multiaddr2
      }))
    });
    return true;
  }
  #emitIfUpdated(id, result) {
    if (!result.updated) {
      return;
    }
    if (this.peerId.equals(id)) {
      this.events.safeDispatchEvent("self:peer:update", { detail: result });
    } else {
      this.events.safeDispatchEvent("peer:update", { detail: result });
    }
  }
};

// node_modules/it-drain/dist/src/index.js
function isAsyncIterable2(thing) {
  return thing[Symbol.asyncIterator] != null;
}
__name(isAsyncIterable2, "isAsyncIterable");
function drain(source) {
  if (isAsyncIterable2(source)) {
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
var src_default4 = drain;

// node_modules/it-peekable/dist/src/index.js
function peekable(iterable) {
  const [iterator, symbol3] = iterable[Symbol.asyncIterator] != null ? [iterable[Symbol.asyncIterator](), Symbol.asyncIterator] : [iterable[Symbol.iterator](), Symbol.iterator];
  const queue = [];
  return {
    peek: /* @__PURE__ */ __name(() => {
      return iterator.next();
    }, "peek"),
    push: /* @__PURE__ */ __name((value) => {
      queue.push(value);
    }, "push"),
    next: /* @__PURE__ */ __name(() => {
      if (queue.length > 0) {
        return {
          done: false,
          value: queue.shift()
        };
      }
      return iterator.next();
    }, "next"),
    [symbol3]() {
      return this;
    }
  };
}
__name(peekable, "peekable");
var src_default5 = peekable;

// node_modules/it-filter/dist/src/index.js
function isAsyncIterable3(thing) {
  return thing[Symbol.asyncIterator] != null;
}
__name(isAsyncIterable3, "isAsyncIterable");
function filter(source, fn) {
  let index = 0;
  if (isAsyncIterable3(source)) {
    return async function* () {
      for await (const entry of source) {
        if (await fn(entry, index++)) {
          yield entry;
        }
      }
    }();
  }
  const peekable2 = src_default5(source);
  const { value, done } = peekable2.next();
  if (done === true) {
    return function* () {
    }();
  }
  const res = fn(value, index++);
  if (typeof res.then === "function") {
    return async function* () {
      if (await res) {
        yield value;
      }
      for await (const entry of peekable2) {
        if (await fn(entry, index++)) {
          yield entry;
        }
      }
    }();
  }
  const func2 = fn;
  return function* () {
    if (res === true) {
      yield value;
    }
    for (const entry of peekable2) {
      if (func2(entry, index++)) {
        yield entry;
      }
    }
  }();
}
__name(filter, "filter");
var src_default6 = filter;

// node_modules/it-sort/dist/src/index.js
function isAsyncIterable4(thing) {
  return thing[Symbol.asyncIterator] != null;
}
__name(isAsyncIterable4, "isAsyncIterable");
function sort(source, sorter) {
  if (isAsyncIterable4(source)) {
    return async function* () {
      const arr = await src_default2(source);
      yield* arr.sort(sorter);
    }();
  }
  return function* () {
    const arr = src_default2(source);
    yield* arr.sort(sorter);
  }();
}
__name(sort, "sort");
var src_default7 = sort;

// node_modules/it-take/dist/src/index.js
function isAsyncIterable5(thing) {
  return thing[Symbol.asyncIterator] != null;
}
__name(isAsyncIterable5, "isAsyncIterable");
function take(source, limit) {
  if (isAsyncIterable5(source)) {
    return async function* () {
      let items = 0;
      if (limit < 1) {
        return;
      }
      for await (const entry of source) {
        yield entry;
        items++;
        if (items === limit) {
          return;
        }
      }
    }();
  }
  return function* () {
    let items = 0;
    if (limit < 1) {
      return;
    }
    for (const entry of source) {
      yield entry;
      items++;
      if (items === limit) {
        return;
      }
    }
  }();
}
__name(take, "take");
var src_default8 = take;

// node_modules/libp2p/node_modules/datastore-core/dist/src/base.js
var BaseDatastore = class {
  static {
    __name(this, "BaseDatastore");
  }
  put(key, val, options) {
    return Promise.reject(new Error(".put is not implemented"));
  }
  get(key, options) {
    return Promise.reject(new Error(".get is not implemented"));
  }
  has(key, options) {
    return Promise.reject(new Error(".has is not implemented"));
  }
  delete(key, options) {
    return Promise.reject(new Error(".delete is not implemented"));
  }
  async *putMany(source, options = {}) {
    for await (const { key, value } of source) {
      await this.put(key, value, options);
      yield key;
    }
  }
  async *getMany(source, options = {}) {
    for await (const key of source) {
      yield {
        key,
        value: await this.get(key, options)
      };
    }
  }
  async *deleteMany(source, options = {}) {
    for await (const key of source) {
      await this.delete(key, options);
      yield key;
    }
  }
  batch() {
    let puts = [];
    let dels = [];
    return {
      put(key, value) {
        puts.push({ key, value });
      },
      delete(key) {
        dels.push(key);
      },
      commit: /* @__PURE__ */ __name(async (options) => {
        await src_default4(this.putMany(puts, options));
        puts = [];
        await src_default4(this.deleteMany(dels, options));
        dels = [];
      }, "commit")
    };
  }
  /**
   * Extending classes should override `query` or implement this method
   */
  // eslint-disable-next-line require-yield
  async *_all(q, options) {
    throw new Error("._all is not implemented");
  }
  /**
   * Extending classes should override `queryKeys` or implement this method
   */
  // eslint-disable-next-line require-yield
  async *_allKeys(q, options) {
    throw new Error("._allKeys is not implemented");
  }
  query(q, options) {
    let it = this._all(q, options);
    if (q.prefix != null) {
      const prefix = q.prefix;
      it = src_default6(it, (e) => e.key.toString().startsWith(prefix));
    }
    if (Array.isArray(q.filters)) {
      it = q.filters.reduce((it2, f) => src_default6(it2, f), it);
    }
    if (Array.isArray(q.orders)) {
      it = q.orders.reduce((it2, f) => src_default7(it2, f), it);
    }
    if (q.offset != null) {
      let i = 0;
      const offset = q.offset;
      it = src_default6(it, () => i++ >= offset);
    }
    if (q.limit != null) {
      it = src_default8(it, q.limit);
    }
    return it;
  }
  queryKeys(q, options) {
    let it = this._allKeys(q, options);
    if (q.prefix != null) {
      const prefix = q.prefix;
      it = src_default6(it, (key) => key.toString().startsWith(prefix));
    }
    if (Array.isArray(q.filters)) {
      it = q.filters.reduce((it2, f) => src_default6(it2, f), it);
    }
    if (Array.isArray(q.orders)) {
      it = q.orders.reduce((it2, f) => src_default7(it2, f), it);
    }
    if (q.offset != null) {
      const offset = q.offset;
      let i = 0;
      it = src_default6(it, () => i++ >= offset);
    }
    if (q.limit != null) {
      it = src_default8(it, q.limit);
    }
    return it;
  }
};

// node_modules/libp2p/node_modules/datastore-core/dist/src/errors.js
var import_err_code = __toESM(require_err_code(), 1);
function notFoundError(err) {
  err = err ?? new Error("Not Found");
  return (0, import_err_code.default)(err, "ERR_NOT_FOUND");
}
__name(notFoundError, "notFoundError");

// node_modules/libp2p/node_modules/datastore-core/dist/src/memory.js
var MemoryDatastore = class extends BaseDatastore {
  static {
    __name(this, "MemoryDatastore");
  }
  data;
  constructor() {
    super();
    this.data = /* @__PURE__ */ new Map();
  }
  put(key, val) {
    this.data.set(key.toString(), val);
    return key;
  }
  get(key) {
    const result = this.data.get(key.toString());
    if (result == null) {
      throw notFoundError();
    }
    return result;
  }
  has(key) {
    return this.data.has(key.toString());
  }
  delete(key) {
    this.data.delete(key.toString());
  }
  *_all() {
    for (const [key, value] of this.data.entries()) {
      yield { key: new Key(key), value };
    }
  }
  *_allKeys() {
    for (const key of this.data.keys()) {
      yield new Key(key);
    }
  }
};

// node_modules/libp2p/dist/src/address-manager/utils.js
function debounce(func2, wait) {
  let timeout;
  return function() {
    const later = /* @__PURE__ */ __name(function() {
      timeout = void 0;
      func2();
    }, "later");
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
__name(debounce, "debounce");

// node_modules/libp2p/dist/src/address-manager/index.js
var defaultAddressFilter = /* @__PURE__ */ __name((addrs) => addrs, "defaultAddressFilter");
function stripPeerId(ma, peerId2) {
  const observedPeerIdStr = ma.getPeerId();
  if (observedPeerIdStr != null) {
    const observedPeerId = peerIdFromString(observedPeerIdStr);
    if (observedPeerId.equals(peerId2)) {
      ma = ma.decapsulate(multiaddr(`/p2p/${peerId2.toString()}`));
    }
  }
  return ma;
}
__name(stripPeerId, "stripPeerId");
var DefaultAddressManager = class {
  static {
    __name(this, "DefaultAddressManager");
  }
  log;
  components;
  // this is an array to allow for duplicates, e.g. multiples of `/ip4/0.0.0.0/tcp/0`
  listen;
  announce;
  observed;
  announceFilter;
  /**
   * Responsible for managing the peer addresses.
   * Peers can specify their listen and announce addresses.
   * The listen addresses will be used by the libp2p transports to listen for new connections,
   * while the announce addresses will be used for the peer addresses' to other peers in the network.
   */
  constructor(components, init = {}) {
    const { listen = [], announce = [] } = init;
    this.components = components;
    this.log = components.logger.forComponent("libp2p:address-manager");
    this.listen = listen.map((ma) => ma.toString());
    this.announce = new Set(announce.map((ma) => ma.toString()));
    this.observed = /* @__PURE__ */ new Map();
    this.announceFilter = init.announceFilter ?? defaultAddressFilter;
    this._updatePeerStoreAddresses = debounce(this._updatePeerStoreAddresses.bind(this), 1e3);
    components.events.addEventListener("transport:listening", () => {
      this._updatePeerStoreAddresses();
    });
    components.events.addEventListener("transport:close", () => {
      this._updatePeerStoreAddresses();
    });
  }
  [Symbol.toStringTag] = "@libp2p/address-manager";
  _updatePeerStoreAddresses() {
    const addrs = this.getAnnounceAddrs().concat(this.components.transportManager.getAddrs()).concat([...this.observed.entries()].filter(([_, metadata]) => metadata.confident).map(([str]) => multiaddr(str))).map((ma) => {
      if (ma.getPeerId() === this.components.peerId.toString()) {
        return ma.decapsulate(`/p2p/${this.components.peerId.toString()}`);
      }
      return ma;
    });
    this.components.peerStore.patch(this.components.peerId, {
      multiaddrs: addrs
    }).catch((err) => {
      this.log.error("error updating addresses", err);
    });
  }
  /**
   * Get peer listen multiaddrs
   */
  getListenAddrs() {
    return Array.from(this.listen).map((a) => multiaddr(a));
  }
  /**
   * Get peer announcing multiaddrs
   */
  getAnnounceAddrs() {
    return Array.from(this.announce).map((a) => multiaddr(a));
  }
  /**
   * Get observed multiaddrs
   */
  getObservedAddrs() {
    return Array.from(this.observed).map(([a]) => multiaddr(a));
  }
  /**
   * Add peer observed addresses
   */
  addObservedAddr(addr) {
    addr = stripPeerId(addr, this.components.peerId);
    const addrString = addr.toString();
    if (this.observed.has(addrString)) {
      return;
    }
    this.observed.set(addrString, {
      confident: false
    });
  }
  confirmObservedAddr(addr) {
    addr = stripPeerId(addr, this.components.peerId);
    const addrString = addr.toString();
    const metadata = this.observed.get(addrString) ?? {
      confident: false
    };
    const startingConfidence = metadata.confident;
    this.observed.set(addrString, {
      confident: true
    });
    if (!startingConfidence) {
      this._updatePeerStoreAddresses();
    }
  }
  removeObservedAddr(addr) {
    addr = stripPeerId(addr, this.components.peerId);
    const addrString = addr.toString();
    this.observed.delete(addrString);
  }
  getAddresses() {
    let addrs = this.getAnnounceAddrs().map((ma) => ma.toString());
    if (addrs.length === 0) {
      addrs = this.components.transportManager.getAddrs().map((ma) => ma.toString());
    }
    addrs = addrs.concat(Array.from(this.observed).filter(([ma, metadata]) => metadata.confident).map(([ma]) => ma));
    const addrSet = new Set(addrs);
    return this.announceFilter(Array.from(addrSet).map((str) => multiaddr(str))).map((ma) => {
      if (ma.protos().pop()?.path === true) {
        return ma;
      }
      if (ma.getPeerId() === this.components.peerId.toString()) {
        return ma;
      }
      return ma.encapsulate(`/p2p/${this.components.peerId.toString()}`);
    });
  }
};

// node_modules/libp2p/dist/src/components.js
var DefaultComponents = class {
  static {
    __name(this, "DefaultComponents");
  }
  components = {};
  _started = false;
  constructor(init = {}) {
    this.components = {};
    for (const [key, value] of Object.entries(init)) {
      this.components[key] = value;
    }
    if (this.components.logger == null) {
      this.components.logger = defaultLogger();
    }
  }
  isStarted() {
    return this._started;
  }
  async _invokeStartableMethod(methodName) {
    await Promise.all(Object.values(this.components).filter((obj) => isStartable(obj)).map(async (startable) => {
      await startable[methodName]?.();
    }));
  }
  async beforeStart() {
    await this._invokeStartableMethod("beforeStart");
  }
  async start() {
    await this._invokeStartableMethod("start");
    this._started = true;
  }
  async afterStart() {
    await this._invokeStartableMethod("afterStart");
  }
  async beforeStop() {
    await this._invokeStartableMethod("beforeStop");
  }
  async stop() {
    await this._invokeStartableMethod("stop");
    this._started = false;
  }
  async afterStop() {
    await this._invokeStartableMethod("afterStop");
  }
};
var OPTIONAL_SERVICES = [
  "metrics",
  "connectionProtector",
  "dns"
];
var NON_SERVICE_PROPERTIES = [
  "components",
  "isStarted",
  "beforeStart",
  "start",
  "afterStart",
  "beforeStop",
  "stop",
  "afterStop",
  "then",
  "_invokeStartableMethod"
];
function defaultComponents(init = {}) {
  const components = new DefaultComponents(init);
  const proxy = new Proxy(components, {
    get(target, prop, receiver) {
      if (typeof prop === "string" && !NON_SERVICE_PROPERTIES.includes(prop)) {
        const service = components.components[prop];
        if (service == null && !OPTIONAL_SERVICES.includes(prop)) {
          throw new CodeError(`${prop} not set`, "ERR_SERVICE_MISSING");
        }
        return service;
      }
      return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value) {
      if (typeof prop === "string") {
        components.components[prop] = value;
      } else {
        Reflect.set(target, prop, value);
      }
      return true;
    }
  });
  return proxy;
}
__name(defaultComponents, "defaultComponents");
function checkServiceDependencies(components) {
  const serviceCapabilities2 = {};
  for (const service of Object.values(components.components)) {
    for (const capability of getServiceCapabilities(service)) {
      serviceCapabilities2[capability] = true;
    }
  }
  for (const service of Object.values(components.components)) {
    for (const capability of getServiceDependencies(service)) {
      if (serviceCapabilities2[capability] !== true) {
        throw new CodeError(`Service "${getServiceName(service)}" required capability "${capability}" but it was not provided by any component, you may need to add additional configuration when creating your node.`, "ERR_UNMET_SERVICE_DEPENDENCIES");
      }
    }
  }
}
__name(checkServiceDependencies, "checkServiceDependencies");
function getServiceCapabilities(service) {
  if (Array.isArray(service?.[serviceCapabilities])) {
    return service[serviceCapabilities];
  }
  return [];
}
__name(getServiceCapabilities, "getServiceCapabilities");
function getServiceDependencies(service) {
  if (Array.isArray(service?.[serviceDependencies])) {
    return service[serviceDependencies];
  }
  return [];
}
__name(getServiceDependencies, "getServiceDependencies");
function getServiceName(service) {
  return service?.[Symbol.toStringTag] ?? service?.toString() ?? "unknown";
}
__name(getServiceName, "getServiceName");

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
    if (r.contains(ipAddr))
      return true;
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
  if (isIPv4(ip))
    return ipv4Check(ip);
  else if (isIpv4MappedIpv6(ip))
    return ipv4MappedIpv6Check(ip);
  else if (isIpv4EmbeddedIpv6(ip))
    return ipv4EmbeddedIpv6Check(ip);
  else if (isIPv6(ip))
    return ipv6Check(ip);
  else
    return void 0;
}
__name(isPrivateIp, "isPrivateIp");

// node_modules/libp2p/dist/src/config/connection-gater.browser.js
function connectionGater(gater = {}) {
  return {
    denyDialPeer: /* @__PURE__ */ __name(async () => false, "denyDialPeer"),
    denyDialMultiaddr: /* @__PURE__ */ __name(async (multiaddr2) => {
      const tuples = multiaddr2.stringTuples();
      if (tuples[0][0] === 4 || tuples[0][0] === 41) {
        return Boolean(isPrivateIp(`${tuples[0][1]}`));
      }
      return false;
    }, "denyDialMultiaddr"),
    denyInboundConnection: /* @__PURE__ */ __name(async () => false, "denyInboundConnection"),
    denyOutboundConnection: /* @__PURE__ */ __name(async () => false, "denyOutboundConnection"),
    denyInboundEncryptedConnection: /* @__PURE__ */ __name(async () => false, "denyInboundEncryptedConnection"),
    denyOutboundEncryptedConnection: /* @__PURE__ */ __name(async () => false, "denyOutboundEncryptedConnection"),
    denyInboundUpgradedConnection: /* @__PURE__ */ __name(async () => false, "denyInboundUpgradedConnection"),
    denyOutboundUpgradedConnection: /* @__PURE__ */ __name(async () => false, "denyOutboundUpgradedConnection"),
    filterMultiaddrForPeer: /* @__PURE__ */ __name(async () => true, "filterMultiaddrForPeer"),
    ...gater
  };
}
__name(connectionGater, "connectionGater");

// node_modules/@multiformats/multiaddr-matcher/dist/src/index.js
var toParts = /* @__PURE__ */ __name((ma) => {
  return ma.toString().split("/").slice(1);
}, "toParts");
var func = /* @__PURE__ */ __name((fn) => {
  return {
    match: /* @__PURE__ */ __name((vals) => {
      if (vals.length < 1) {
        return false;
      }
      if (fn(vals[0])) {
        return vals.slice(1);
      }
      return false;
    }, "match"),
    pattern: "fn"
  };
}, "func");
var literal = /* @__PURE__ */ __name((str) => {
  return {
    match: /* @__PURE__ */ __name((vals) => func((val) => val === str).match(vals), "match"),
    pattern: str
  };
}, "literal");
var string2 = /* @__PURE__ */ __name(() => {
  return {
    match: /* @__PURE__ */ __name((vals) => func((val) => typeof val === "string").match(vals), "match"),
    pattern: "{string}"
  };
}, "string");
var number2 = /* @__PURE__ */ __name(() => {
  return {
    match: /* @__PURE__ */ __name((vals) => func((val) => !isNaN(parseInt(val))).match(vals), "match"),
    pattern: "{number}"
  };
}, "number");
var peerId = /* @__PURE__ */ __name(() => {
  return {
    match: /* @__PURE__ */ __name((vals) => {
      if (vals.length < 2) {
        return false;
      }
      if (vals[0] !== "p2p" && vals[0] !== "ipfs") {
        return false;
      }
      if (vals[1].startsWith("Q") || vals[1].startsWith("1")) {
        try {
          base58btc.decode(`z${vals[1]}`);
        } catch (err) {
          return false;
        }
      } else {
        return false;
      }
      return vals.slice(2);
    }, "match"),
    pattern: "/p2p/{peerid}"
  };
}, "peerId");
var certhash = /* @__PURE__ */ __name(() => {
  return {
    match: /* @__PURE__ */ __name((vals) => {
      if (vals.length < 2) {
        return false;
      }
      if (vals[0] !== "certhash") {
        return false;
      }
      try {
        base64url.decode(vals[1]);
      } catch {
        return false;
      }
      return vals.slice(2);
    }, "match"),
    pattern: "/certhash/{certhash}"
  };
}, "certhash");
var optional = /* @__PURE__ */ __name((matcher) => {
  return {
    match: /* @__PURE__ */ __name((vals) => {
      const result = matcher.match(vals);
      if (result === false) {
        return vals;
      }
      return result;
    }, "match"),
    pattern: `optional(${matcher.pattern})`
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
    }, "match"),
    pattern: `or(${matchers.map((m2) => m2.pattern).join(", ")})`
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
    }, "match"),
    pattern: `and(${matchers.map((m2) => m2.pattern).join(", ")})`
  };
}, "and");
function fmt(...matchers) {
  function match(ma) {
    let parts = toParts(ma);
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
    matches,
    exactMatch
  };
}
__name(fmt, "fmt");
var _DNS4 = and(literal("dns4"), string2());
var _DNS6 = and(literal("dns6"), string2());
var _DNSADDR = and(literal("dnsaddr"), string2());
var _DNS = and(literal("dns"), string2());
var DNS4 = fmt(_DNS4);
var DNS6 = fmt(_DNS6);
var DNSADDR = fmt(_DNSADDR);
var DNS = fmt(or2(_DNS, _DNSADDR, _DNS4, _DNS6));
var _IP4 = and(literal("ip4"), func(isIPv4));
var _IP6 = and(literal("ip6"), func(isIPv6));
var _IP = or2(_IP4, _IP6);
var _IP_OR_DOMAIN = or2(_IP, _DNS, _DNS4, _DNS6, _DNSADDR);
var IP_OR_DOMAIN = fmt(_IP_OR_DOMAIN);
var IP4 = fmt(_IP4);
var IP6 = fmt(_IP6);
var IP = fmt(_IP);
var _TCP = and(_IP_OR_DOMAIN, literal("tcp"), number2());
var _UDP = and(_IP_OR_DOMAIN, literal("udp"), number2());
var TCP = fmt(_TCP);
var UDP = fmt(_UDP);
var _QUIC = and(_UDP, literal("quic"));
var _QUICV1 = and(_UDP, literal("quic-v1"));
var QUIC_V0_OR_V1 = or2(_QUIC, _QUICV1);
var QUIC = fmt(_QUIC);
var QUICV1 = fmt(_QUICV1);
var _WEB = or2(_IP_OR_DOMAIN, _TCP, _UDP, _QUIC, _QUICV1);
var _WebSockets = or2(and(_WEB, literal("ws"), optional(peerId())));
var WebSockets = fmt(_WebSockets);
var _WebSocketsSecure = or2(and(_WEB, literal("wss"), optional(peerId())), and(_WEB, literal("tls"), literal("ws"), optional(peerId())));
var WebSocketsSecure = fmt(_WebSocketsSecure);
var _WebRTCDirect = and(_UDP, literal("webrtc-direct"), optional(certhash()), optional(certhash()), optional(peerId()));
var WebRTCDirect = fmt(_WebRTCDirect);
var _WebTransport = and(_QUICV1, literal("webtransport"), optional(certhash()), optional(certhash()), optional(peerId()));
var WebTransport = fmt(_WebTransport);
var _P2P = or2(_WebSockets, _WebSocketsSecure, and(_TCP, optional(peerId())), and(QUIC_V0_OR_V1, optional(peerId())), and(_IP_OR_DOMAIN, optional(peerId())), _WebRTCDirect, _WebTransport, peerId());
var P2P = fmt(_P2P);
var _Circuit = and(_P2P, literal("p2p-circuit"), peerId());
var Circuit = fmt(_Circuit);
var _WebRTC = or2(and(_P2P, literal("p2p-circuit"), literal("webrtc"), optional(peerId())), and(_P2P, literal("webrtc"), optional(peerId())), literal("webrtc"));
var WebRTC = fmt(_WebRTC);
var _HTTP = or2(and(_IP_OR_DOMAIN, literal("tcp"), number2(), literal("http"), optional(peerId())), and(_IP_OR_DOMAIN, literal("http"), optional(peerId())));
var HTTP = fmt(_HTTP);
var _HTTPS = or2(and(_IP_OR_DOMAIN, literal("tcp"), or2(and(literal("443"), literal("http")), and(number2(), literal("https"))), optional(peerId())), and(_IP_OR_DOMAIN, literal("tls"), literal("http"), optional(peerId())), and(_IP_OR_DOMAIN, literal("https"), optional(peerId())));
var HTTPS = fmt(_HTTPS);

// node_modules/@libp2p/utils/dist/src/multiaddr/is-private.js
function isPrivate(ma) {
  try {
    const { address } = ma.nodeAddress();
    return Boolean(isPrivateIp(address));
  } catch {
    return true;
  }
}
__name(isPrivate, "isPrivate");

// node_modules/@libp2p/utils/dist/src/address-sort.js
function publicAddressesFirst(a, b) {
  const isAPrivate = isPrivate(a.multiaddr);
  const isBPrivate = isPrivate(b.multiaddr);
  if (isAPrivate && !isBPrivate) {
    return 1;
  } else if (!isAPrivate && isBPrivate) {
    return -1;
  }
  return 0;
}
__name(publicAddressesFirst, "publicAddressesFirst");
function certifiedAddressesFirst(a, b) {
  if (a.isCertified && !b.isCertified) {
    return -1;
  } else if (!a.isCertified && b.isCertified) {
    return 1;
  }
  return 0;
}
__name(certifiedAddressesFirst, "certifiedAddressesFirst");
function circuitRelayAddressesLast(a, b) {
  const isACircuit = Circuit.exactMatch(a.multiaddr);
  const isBCircuit = Circuit.exactMatch(b.multiaddr);
  if (isACircuit && !isBCircuit) {
    return 1;
  } else if (!isACircuit && isBCircuit) {
    return -1;
  }
  return 0;
}
__name(circuitRelayAddressesLast, "circuitRelayAddressesLast");
function defaultAddressSort(a, b) {
  const publicResult = publicAddressesFirst(a, b);
  if (publicResult !== 0) {
    return publicResult;
  }
  const relayResult = circuitRelayAddressesLast(a, b);
  if (relayResult !== 0) {
    return relayResult;
  }
  const certifiedResult = certifiedAddressesFirst(a, b);
  return certifiedResult;
}
__name(defaultAddressSort, "defaultAddressSort");

// node_modules/progress-events/dist/src/index.js
var CustomProgressEvent = class extends Event {
  static {
    __name(this, "CustomProgressEvent");
  }
  type;
  detail;
  constructor(type, detail) {
    super(type);
    this.type = type;
    this.detail = detail;
  }
};

// node_modules/@multiformats/dns/dist/src/utils/get-types.js
function getTypes(types) {
  const DEFAULT_TYPES = [
    RecordType.A
  ];
  if (types == null) {
    return DEFAULT_TYPES;
  }
  if (Array.isArray(types)) {
    if (types.length === 0) {
      return DEFAULT_TYPES;
    }
    return types;
  }
  return [
    types
  ];
}
__name(getTypes, "getTypes");

// node_modules/@multiformats/dns/dist/src/utils/to-dns-response.js
var DEFAULT_TTL = 60;
function toDNSResponse(obj) {
  return {
    Status: obj.Status ?? 0,
    TC: obj.TC ?? obj.flag_tc ?? false,
    RD: obj.RD ?? obj.flag_rd ?? false,
    RA: obj.RA ?? obj.flag_ra ?? false,
    AD: obj.AD ?? obj.flag_ad ?? false,
    CD: obj.CD ?? obj.flag_cd ?? false,
    Question: (obj.Question ?? obj.questions ?? []).map((question) => {
      return {
        name: question.name,
        type: RecordType[question.type]
      };
    }),
    Answer: (obj.Answer ?? obj.answers ?? []).map((answer) => {
      return {
        name: answer.name,
        type: RecordType[answer.type],
        TTL: answer.TTL ?? answer.ttl ?? DEFAULT_TTL,
        data: answer.data instanceof Uint8Array ? toString2(answer.data) : answer.data
      };
    })
  };
}
__name(toDNSResponse, "toDNSResponse");

// node_modules/@multiformats/dns/dist/src/resolvers/dns-json-over-https.js
var DEFAULT_QUERY_CONCURRENCY = 4;
function dnsJsonOverHttps(url, init = {}) {
  const httpQueue = new PQueue({
    concurrency: init.queryConcurrency ?? DEFAULT_QUERY_CONCURRENCY
  });
  return async (fqdn, options = {}) => {
    const searchParams = new URLSearchParams();
    searchParams.set("name", fqdn);
    getTypes(options.types).forEach((type) => {
      searchParams.append("type", RecordType[type]);
    });
    options.onProgress?.(new CustomProgressEvent("dns:query", { detail: fqdn }));
    const response = await httpQueue.add(async () => {
      const res = await fetch(`${url}?${searchParams}`, {
        headers: {
          accept: "application/dns-json"
        },
        signal: options?.signal
      });
      if (res.status !== 200) {
        throw new Error(`Unexpected HTTP status: ${res.status} - ${res.statusText}`);
      }
      const response2 = toDNSResponse(await res.json());
      options.onProgress?.(new CustomProgressEvent("dns:response", { detail: response2 }));
      return response2;
    }, {
      signal: options.signal
    });
    if (response == null) {
      throw new Error("No DNS response received");
    }
    return response;
  };
}
__name(dnsJsonOverHttps, "dnsJsonOverHttps");

// node_modules/@multiformats/dns/dist/src/resolvers/default.browser.js
function defaultResolver() {
  return [
    dnsJsonOverHttps("https://cloudflare-dns.com/dns-query"),
    dnsJsonOverHttps("https://dns.google/resolve")
  ];
}
__name(defaultResolver, "defaultResolver");

// node_modules/@multiformats/dns/dist/src/utils/cache.js
var import_hashlru = __toESM(require_hashlru(), 1);
var CachedAnswers = class {
  static {
    __name(this, "CachedAnswers");
  }
  lru;
  constructor(maxSize) {
    this.lru = (0, import_hashlru.default)(maxSize);
  }
  get(fqdn, types) {
    let foundAllAnswers = true;
    const answers = [];
    for (const type of types) {
      const cached = this.getAnswers(fqdn, type);
      if (cached.length === 0) {
        foundAllAnswers = false;
        break;
      }
      answers.push(...cached);
    }
    if (foundAllAnswers) {
      return toDNSResponse({ answers });
    }
  }
  getAnswers(domain, type) {
    const key = `${domain.toLowerCase()}-${type}`;
    const answers = this.lru.get(key);
    if (answers != null) {
      const cachedAnswers = answers.filter((entry) => {
        return entry.expires > Date.now();
      }).map(({ expires, value }) => ({
        ...value,
        TTL: Math.round((expires - Date.now()) / 1e3),
        type: RecordType[value.type]
      }));
      if (cachedAnswers.length === 0) {
        this.lru.remove(key);
      }
      return cachedAnswers;
    }
    return [];
  }
  add(domain, answer) {
    const key = `${domain.toLowerCase()}-${answer.type}`;
    const answers = this.lru.get(key) ?? [];
    answers.push({
      expires: Date.now() + (answer.TTL ?? DEFAULT_TTL) * 1e3,
      value: answer
    });
    this.lru.set(key, answers);
  }
  remove(domain, type) {
    const key = `${domain.toLowerCase()}-${type}`;
    this.lru.remove(key);
  }
  clear() {
    this.lru.clear();
  }
};
function cache2(size) {
  return new CachedAnswers(size);
}
__name(cache2, "cache");

// node_modules/@multiformats/dns/dist/src/dns.js
var DEFAULT_ANSWER_CACHE_SIZE = 1e3;
var DNS2 = class {
  static {
    __name(this, "DNS");
  }
  resolvers;
  cache;
  constructor(init) {
    this.resolvers = {};
    this.cache = cache2(init.cacheSize ?? DEFAULT_ANSWER_CACHE_SIZE);
    Object.entries(init.resolvers ?? {}).forEach(([tld, resolver]) => {
      if (!Array.isArray(resolver)) {
        resolver = [resolver];
      }
      if (!tld.endsWith(".")) {
        tld = `${tld}.`;
      }
      this.resolvers[tld] = resolver;
    });
    if (this.resolvers["."] == null) {
      this.resolvers["."] = defaultResolver();
    }
  }
  /**
   * Queries DNS resolvers for the passed record types for the passed domain.
   *
   * If cached records exist for all desired types they will be returned
   * instead.
   *
   * Any new responses will be added to the cache for subsequent requests.
   */
  async query(domain, options = {}) {
    const types = getTypes(options.types);
    const cached = options.cached !== false ? this.cache.get(domain, types) : void 0;
    if (cached != null) {
      options.onProgress?.(new CustomProgressEvent("dns:cache", { detail: cached }));
      return cached;
    }
    const tld = `${domain.split(".").pop()}.`;
    const resolvers2 = (this.resolvers[tld] ?? this.resolvers["."]).sort(() => {
      return Math.random() > 0.5 ? -1 : 1;
    });
    const errors = [];
    for (const resolver of resolvers2) {
      if (options.signal?.aborted === true) {
        break;
      }
      try {
        const result = await resolver(domain, {
          ...options,
          types
        });
        for (const answer of result.Answer) {
          this.cache.add(domain, answer);
        }
        return result;
      } catch (err) {
        errors.push(err);
        options.onProgress?.(new CustomProgressEvent("dns:error", { detail: err }));
      }
    }
    if (errors.length === 1) {
      throw errors[0];
    }
    throw new AggregateError(errors, `DNS lookup of ${domain} ${types} failed`);
  }
};

// node_modules/@multiformats/dns/dist/src/index.js
var RecordType;
(function(RecordType2) {
  RecordType2[RecordType2["A"] = 1] = "A";
  RecordType2[RecordType2["CNAME"] = 5] = "CNAME";
  RecordType2[RecordType2["TXT"] = 16] = "TXT";
  RecordType2[RecordType2["AAAA"] = 28] = "AAAA";
})(RecordType || (RecordType = {}));
function dns(init = {}) {
  return new DNS2(init);
}
__name(dns, "dns");

// node_modules/@multiformats/multiaddr/dist/src/resolvers/dnsaddr.js
var MAX_RECURSIVE_DEPTH = 32;
var { code: dnsaddrCode } = getProtocol("dnsaddr");
var RecursionLimitError = class extends Error {
  static {
    __name(this, "RecursionLimitError");
  }
  constructor(message2 = "Max recursive depth reached") {
    super(message2);
    this.name = "RecursionLimitError";
  }
};
var dnsaddrResolver = /* @__PURE__ */ __name(async function dnsaddrResolver2(ma, options = {}) {
  const recursionLimit = options.maxRecursiveDepth ?? MAX_RECURSIVE_DEPTH;
  if (recursionLimit === 0) {
    throw new RecursionLimitError("Max recursive depth reached");
  }
  const [, hostname] = ma.stringTuples().find(([proto]) => proto === dnsaddrCode) ?? [];
  const resolver = options?.dns ?? dns();
  const result = await resolver.query(`_dnsaddr.${hostname}`, {
    signal: options?.signal,
    types: [
      RecordType.TXT
    ]
  });
  const peerId2 = ma.getPeerId();
  const output2 = [];
  for (const answer of result.Answer) {
    const addr = answer.data.replace(/["']/g, "").trim().split("=")[1];
    if (addr == null) {
      continue;
    }
    if (peerId2 != null && !addr.includes(peerId2)) {
      continue;
    }
    const ma2 = multiaddr(addr);
    if (addr.startsWith("/dnsaddr")) {
      const resolved = await ma2.resolve({
        ...options,
        maxRecursiveDepth: recursionLimit - 1
      });
      output2.push(...resolved.map((ma3) => ma3.toString()));
    } else {
      output2.push(ma2.toString());
    }
  }
  return output2;
}, "dnsaddrResolver");

// node_modules/merge-options/index.mjs
var import_index4 = __toESM(require_merge_options(), 1);
var merge_options_default = import_index4.default;

// node_modules/libp2p/dist/src/errors.js
var messages;
(function(messages2) {
  messages2["NOT_STARTED_YET"] = "The libp2p node is not started yet";
  messages2["ERR_PROTECTOR_REQUIRED"] = "Private network is enforced, but no protector was provided";
  messages2["NOT_FOUND"] = "Not found";
})(messages || (messages = {}));
var codes4;
(function(codes5) {
  codes5["ERR_PROTECTOR_REQUIRED"] = "ERR_PROTECTOR_REQUIRED";
  codes5["ERR_PEER_DIAL_INTERCEPTED"] = "ERR_PEER_DIAL_INTERCEPTED";
  codes5["ERR_CONNECTION_INTERCEPTED"] = "ERR_CONNECTION_INTERCEPTED";
  codes5["ERR_INVALID_PROTOCOLS_FOR_STREAM"] = "ERR_INVALID_PROTOCOLS_FOR_STREAM";
  codes5["ERR_CONNECTION_ENDED"] = "ERR_CONNECTION_ENDED";
  codes5["ERR_CONNECTION_FAILED"] = "ERR_CONNECTION_FAILED";
  codes5["ERR_NODE_NOT_STARTED"] = "ERR_NODE_NOT_STARTED";
  codes5["ERR_ALREADY_ABORTED"] = "ERR_ALREADY_ABORTED";
  codes5["ERR_TOO_MANY_ADDRESSES"] = "ERR_TOO_MANY_ADDRESSES";
  codes5["ERR_NO_VALID_ADDRESSES"] = "ERR_NO_VALID_ADDRESSES";
  codes5["ERR_RELAYED_DIAL"] = "ERR_RELAYED_DIAL";
  codes5["ERR_DIALED_SELF"] = "ERR_DIALED_SELF";
  codes5["ERR_DISCOVERED_SELF"] = "ERR_DISCOVERED_SELF";
  codes5["ERR_DUPLICATE_TRANSPORT"] = "ERR_DUPLICATE_TRANSPORT";
  codes5["ERR_ENCRYPTION_FAILED"] = "ERR_ENCRYPTION_FAILED";
  codes5["ERR_HOP_REQUEST_FAILED"] = "ERR_HOP_REQUEST_FAILED";
  codes5["ERR_INVALID_KEY"] = "ERR_INVALID_KEY";
  codes5["ERR_INVALID_MESSAGE"] = "ERR_INVALID_MESSAGE";
  codes5["ERR_INVALID_PARAMETERS"] = "ERR_INVALID_PARAMETERS";
  codes5["ERR_INVALID_PEER"] = "ERR_INVALID_PEER";
  codes5["ERR_MUXER_UNAVAILABLE"] = "ERR_MUXER_UNAVAILABLE";
  codes5["ERR_NOT_FOUND"] = "ERR_NOT_FOUND";
  codes5["ERR_TRANSPORT_UNAVAILABLE"] = "ERR_TRANSPORT_UNAVAILABLE";
  codes5["ERR_TRANSPORT_DIAL_FAILED"] = "ERR_TRANSPORT_DIAL_FAILED";
  codes5["ERR_UNSUPPORTED_PROTOCOL"] = "ERR_UNSUPPORTED_PROTOCOL";
  codes5["ERR_PROTOCOL_HANDLER_ALREADY_REGISTERED"] = "ERR_PROTOCOL_HANDLER_ALREADY_REGISTERED";
  codes5["ERR_INVALID_MULTIADDR"] = "ERR_INVALID_MULTIADDR";
  codes5["ERR_SIGNATURE_NOT_VALID"] = "ERR_SIGNATURE_NOT_VALID";
  codes5["ERR_FIND_SELF"] = "ERR_FIND_SELF";
  codes5["ERR_NO_ROUTERS_AVAILABLE"] = "ERR_NO_ROUTERS_AVAILABLE";
  codes5["ERR_CONNECTION_NOT_MULTIPLEXED"] = "ERR_CONNECTION_NOT_MULTIPLEXED";
  codes5["ERR_NO_DIAL_TOKENS"] = "ERR_NO_DIAL_TOKENS";
  codes5["ERR_INVALID_CMS"] = "ERR_INVALID_CMS";
  codes5["ERR_MISSING_KEYS"] = "ERR_MISSING_KEYS";
  codes5["ERR_NO_KEY"] = "ERR_NO_KEY";
  codes5["ERR_INVALID_KEY_NAME"] = "ERR_INVALID_KEY_NAME";
  codes5["ERR_INVALID_KEY_TYPE"] = "ERR_INVALID_KEY_TYPE";
  codes5["ERR_KEY_ALREADY_EXISTS"] = "ERR_KEY_ALREADY_EXISTS";
  codes5["ERR_INVALID_KEY_SIZE"] = "ERR_INVALID_KEY_SIZE";
  codes5["ERR_KEY_NOT_FOUND"] = "ERR_KEY_NOT_FOUND";
  codes5["ERR_OLD_KEY_NAME_INVALID"] = "ERR_OLD_KEY_NAME_INVALID";
  codes5["ERR_NEW_KEY_NAME_INVALID"] = "ERR_NEW_KEY_NAME_INVALID";
  codes5["ERR_PASSWORD_REQUIRED"] = "ERR_PASSWORD_REQUIRED";
  codes5["ERR_PEM_REQUIRED"] = "ERR_PEM_REQUIRED";
  codes5["ERR_CANNOT_READ_KEY"] = "ERR_CANNOT_READ_KEY";
  codes5["ERR_MISSING_PRIVATE_KEY"] = "ERR_MISSING_PRIVATE_KEY";
  codes5["ERR_MISSING_PUBLIC_KEY"] = "ERR_MISSING_PUBLIC_KEY";
  codes5["ERR_INVALID_OLD_PASS_TYPE"] = "ERR_INVALID_OLD_PASS_TYPE";
  codes5["ERR_INVALID_NEW_PASS_TYPE"] = "ERR_INVALID_NEW_PASS_TYPE";
  codes5["ERR_INVALID_PASS_LENGTH"] = "ERR_INVALID_PASS_LENGTH";
  codes5["ERR_NOT_IMPLEMENTED"] = "ERR_NOT_IMPLEMENTED";
  codes5["ERR_WRONG_PING_ACK"] = "ERR_WRONG_PING_ACK";
  codes5["ERR_INVALID_RECORD"] = "ERR_INVALID_RECORD";
  codes5["ERR_ALREADY_SUCCEEDED"] = "ERR_ALREADY_SUCCEEDED";
  codes5["ERR_NO_HANDLER_FOR_PROTOCOL"] = "ERR_NO_HANDLER_FOR_PROTOCOL";
  codes5["ERR_TOO_MANY_OUTBOUND_PROTOCOL_STREAMS"] = "ERR_TOO_MANY_OUTBOUND_PROTOCOL_STREAMS";
  codes5["ERR_TOO_MANY_INBOUND_PROTOCOL_STREAMS"] = "ERR_TOO_MANY_INBOUND_PROTOCOL_STREAMS";
  codes5["ERR_CONNECTION_DENIED"] = "ERR_CONNECTION_DENIED";
  codes5["ERR_TRANSFER_LIMIT_EXCEEDED"] = "ERR_TRANSFER_LIMIT_EXCEEDED";
})(codes4 || (codes4 = {}));

// node_modules/libp2p/dist/src/config.js
var DefaultConfig = {
  addresses: {
    listen: [],
    announce: [],
    noAnnounce: [],
    announceFilter: /* @__PURE__ */ __name((multiaddrs) => multiaddrs, "announceFilter")
  },
  connectionManager: {
    resolvers: {
      dnsaddr: dnsaddrResolver
    },
    addressSorter: defaultAddressSort
  },
  transportManager: {
    faultTolerance: FaultTolerance.FATAL_ALL
  }
};
async function validateConfig(opts) {
  const resultingOptions = merge_options_default(DefaultConfig, opts);
  if (resultingOptions.connectionProtector === null && globalThis.process?.env?.LIBP2P_FORCE_PNET != null) {
    throw new CodeError(messages.ERR_PROTECTOR_REQUIRED, codes4.ERR_PROTECTOR_REQUIRED);
  }
  if (resultingOptions.privateKey != null && !(await peerIdFromKeys(resultingOptions.privateKey.public.bytes, resultingOptions.privateKey.bytes)).equals(resultingOptions.peerId)) {
    throw new CodeError("Private key doesn't match peer id", codes4.ERR_INVALID_KEY);
  }
  return resultingOptions;
}
__name(validateConfig, "validateConfig");

// node_modules/delay/index.js
var createAbortError = /* @__PURE__ */ __name(() => {
  const error = new Error("Delay aborted");
  error.name = "AbortError";
  return error;
}, "createAbortError");
var clearMethods = /* @__PURE__ */ new WeakMap();
function createDelay({ clearTimeout: defaultClear, setTimeout: defaultSet } = {}) {
  return (milliseconds, { value, signal } = {}) => {
    if (signal?.aborted) {
      return Promise.reject(createAbortError());
    }
    let timeoutId;
    let settle;
    let rejectFunction;
    const clear = defaultClear ?? clearTimeout;
    const signalListener = /* @__PURE__ */ __name(() => {
      clear(timeoutId);
      rejectFunction(createAbortError());
    }, "signalListener");
    const cleanup = /* @__PURE__ */ __name(() => {
      if (signal) {
        signal.removeEventListener("abort", signalListener);
      }
    }, "cleanup");
    const delayPromise = new Promise((resolve, reject) => {
      settle = /* @__PURE__ */ __name(() => {
        cleanup();
        resolve(value);
      }, "settle");
      rejectFunction = reject;
      timeoutId = (defaultSet ?? setTimeout)(settle, milliseconds);
    });
    if (signal) {
      signal.addEventListener("abort", signalListener, { once: true });
    }
    clearMethods.set(delayPromise, () => {
      clear(timeoutId);
      timeoutId = null;
      settle();
    });
    return delayPromise;
  };
}
__name(createDelay, "createDelay");
var delay = createDelay();
var delay_default = delay;

// node_modules/@libp2p/utils/dist/src/rate-limiter.js
var RateLimiter = class {
  static {
    __name(this, "RateLimiter");
  }
  memoryStorage;
  points;
  duration;
  blockDuration;
  execEvenly;
  execEvenlyMinDelayMs;
  keyPrefix;
  constructor(opts = {}) {
    this.points = opts.points ?? 4;
    this.duration = opts.duration ?? 1;
    this.blockDuration = opts.blockDuration ?? 0;
    this.execEvenly = opts.execEvenly ?? false;
    this.execEvenlyMinDelayMs = opts.execEvenlyMinDelayMs ?? this.duration * 1e3 / this.points;
    this.keyPrefix = opts.keyPrefix ?? "rlflx";
    this.memoryStorage = new MemoryStorage();
  }
  async consume(key, pointsToConsume = 1, options = {}) {
    const rlKey = this.getKey(key);
    const secDuration = this._getKeySecDuration(options);
    let res = this.memoryStorage.incrby(rlKey, pointsToConsume, secDuration);
    res.remainingPoints = Math.max(this.points - res.consumedPoints, 0);
    if (res.consumedPoints > this.points) {
      if (this.blockDuration > 0 && res.consumedPoints <= this.points + pointsToConsume) {
        res = this.memoryStorage.set(rlKey, res.consumedPoints, this.blockDuration);
      }
      throw new CodeError("Rate limit exceeded", "ERR_RATE_LIMIT_EXCEEDED", res);
    } else if (this.execEvenly && res.msBeforeNext > 0 && !res.isFirstInDuration) {
      let delayMs = Math.ceil(res.msBeforeNext / (res.remainingPoints + 2));
      if (delayMs < this.execEvenlyMinDelayMs) {
        delayMs = res.consumedPoints * this.execEvenlyMinDelayMs;
      }
      await delay_default(delayMs);
    }
    return res;
  }
  penalty(key, points = 1, options = {}) {
    const rlKey = this.getKey(key);
    const secDuration = this._getKeySecDuration(options);
    const res = this.memoryStorage.incrby(rlKey, points, secDuration);
    res.remainingPoints = Math.max(this.points - res.consumedPoints, 0);
    return res;
  }
  reward(key, points = 1, options = {}) {
    const rlKey = this.getKey(key);
    const secDuration = this._getKeySecDuration(options);
    const res = this.memoryStorage.incrby(rlKey, -points, secDuration);
    res.remainingPoints = Math.max(this.points - res.consumedPoints, 0);
    return res;
  }
  /**
   * Block any key for secDuration seconds
   *
   * @param key
   * @param secDuration
   */
  block(key, secDuration) {
    const msDuration = secDuration * 1e3;
    const initPoints = this.points + 1;
    this.memoryStorage.set(this.getKey(key), initPoints, secDuration);
    return {
      remainingPoints: 0,
      msBeforeNext: msDuration === 0 ? -1 : msDuration,
      consumedPoints: initPoints,
      isFirstInDuration: false
    };
  }
  set(key, points, secDuration = 0) {
    const msDuration = (secDuration >= 0 ? secDuration : this.duration) * 1e3;
    this.memoryStorage.set(this.getKey(key), points, secDuration);
    return {
      remainingPoints: 0,
      msBeforeNext: msDuration === 0 ? -1 : msDuration,
      consumedPoints: points,
      isFirstInDuration: false
    };
  }
  get(key) {
    const res = this.memoryStorage.get(this.getKey(key));
    if (res != null) {
      res.remainingPoints = Math.max(this.points - res.consumedPoints, 0);
    }
    return res;
  }
  delete(key) {
    this.memoryStorage.delete(this.getKey(key));
  }
  _getKeySecDuration(options) {
    if (options?.customDuration != null && options.customDuration >= 0) {
      return options.customDuration;
    }
    return this.duration;
  }
  getKey(key) {
    return this.keyPrefix.length > 0 ? `${this.keyPrefix}:${key}` : key;
  }
  parseKey(rlKey) {
    return rlKey.substring(this.keyPrefix.length);
  }
};
var MemoryStorage = class {
  static {
    __name(this, "MemoryStorage");
  }
  storage;
  constructor() {
    this.storage = /* @__PURE__ */ new Map();
  }
  incrby(key, value, durationSec) {
    const existing = this.storage.get(key);
    if (existing != null) {
      const msBeforeExpires = existing.expiresAt != null ? existing.expiresAt.getTime() - (/* @__PURE__ */ new Date()).getTime() : -1;
      if (existing.expiresAt == null || msBeforeExpires > 0) {
        existing.value += value;
        return {
          remainingPoints: 0,
          msBeforeNext: msBeforeExpires,
          consumedPoints: existing.value,
          isFirstInDuration: false
        };
      }
      return this.set(key, value, durationSec);
    }
    return this.set(key, value, durationSec);
  }
  set(key, value, durationSec) {
    const durationMs = durationSec * 1e3;
    const existing = this.storage.get(key);
    if (existing != null) {
      clearTimeout(existing.timeoutId);
    }
    const record = {
      value,
      expiresAt: durationMs > 0 ? new Date(Date.now() + durationMs) : void 0
    };
    this.storage.set(key, record);
    if (durationMs > 0) {
      record.timeoutId = setTimeout(() => {
        this.storage.delete(key);
      }, durationMs);
      if (record.timeoutId.unref != null) {
        record.timeoutId.unref();
      }
    }
    return {
      remainingPoints: 0,
      msBeforeNext: durationMs === 0 ? -1 : durationMs,
      consumedPoints: record.value,
      isFirstInDuration: true
    };
  }
  get(key) {
    const existing = this.storage.get(key);
    if (existing != null) {
      const msBeforeExpires = existing.expiresAt != null ? existing.expiresAt.getTime() - (/* @__PURE__ */ new Date()).getTime() : -1;
      return {
        remainingPoints: 0,
        msBeforeNext: msBeforeExpires,
        consumedPoints: existing.value,
        isFirstInDuration: false
      };
    }
  }
  delete(key) {
    const record = this.storage.get(key);
    if (record != null) {
      if (record.timeoutId != null) {
        clearTimeout(record.timeoutId);
      }
      this.storage.delete(key);
      return true;
    }
    return false;
  }
};

// node_modules/libp2p/dist/src/get-peer.js
function getPeerAddress(peer) {
  if (isPeerId(peer)) {
    return { peerId: peer, multiaddrs: [] };
  }
  if (!Array.isArray(peer)) {
    peer = [peer];
  }
  let peerId2;
  if (peer.length > 0) {
    const peerIdStr = peer[0].getPeerId();
    peerId2 = peerIdStr == null ? void 0 : peerIdFromString(peerIdStr);
    peer.forEach((ma) => {
      if (!isMultiaddr(ma)) {
        throw new CodeError("Invalid Multiaddr", codes4.ERR_INVALID_MULTIADDR);
      }
      const maPeerIdStr = ma.getPeerId();
      if (maPeerIdStr == null) {
        if (peerId2 != null) {
          throw new CodeError("Multiaddrs must all have the same peer id or have no peer id", codes4.ERR_INVALID_PARAMETERS);
        }
      } else {
        const maPeerId = peerIdFromString(maPeerIdStr);
        if (peerId2?.equals(maPeerId) !== true) {
          throw new CodeError("Multiaddrs must all have the same peer id or have no peer id", codes4.ERR_INVALID_PARAMETERS);
        }
      }
    });
  }
  return {
    peerId: peerId2,
    multiaddrs: peer
  };
}
__name(getPeerAddress, "getPeerAddress");

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
var AbortError3 = class extends Error {
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
  let drain2 = pDefer();
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
          drain2.resolve();
          drain2 = pDefer();
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
            reject(new AbortError3());
          }, "listener");
          signal.addEventListener("abort", listener);
        });
      }
      try {
        await Promise.race([
          drain2.promise,
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

// node_modules/race-event/dist/src/index.js
var AbortError4 = class extends Error {
  static {
    __name(this, "AbortError");
  }
  type;
  code;
  constructor(message2, code2) {
    super(message2 ?? "The operation was aborted");
    this.type = "aborted";
    this.name = "AbortError";
    this.code = code2 ?? "ABORT_ERR";
  }
};
async function raceEvent(emitter, eventName, signal, opts) {
  const error = new AbortError4(opts?.errorMessage, opts?.errorCode);
  if (signal?.aborted === true) {
    return Promise.reject(error);
  }
  return new Promise((resolve, reject) => {
    function removeListeners() {
      signal?.removeEventListener("abort", abortListener);
      emitter.removeEventListener(eventName, eventListener);
      if (opts?.errorEvent != null) {
        emitter.removeEventListener(opts.errorEvent, errorEventListener);
      }
    }
    __name(removeListeners, "removeListeners");
    const eventListener = /* @__PURE__ */ __name((evt) => {
      try {
        if (opts?.filter?.(evt) === false) {
          return;
        }
      } catch (err) {
        removeListeners();
        reject(err);
        return;
      }
      removeListeners();
      resolve(evt);
    }, "eventListener");
    const errorEventListener = /* @__PURE__ */ __name((evt) => {
      removeListeners();
      reject(evt.detail);
    }, "errorEventListener");
    const abortListener = /* @__PURE__ */ __name(() => {
      removeListeners();
      reject(error);
    }, "abortListener");
    signal?.addEventListener("abort", abortListener);
    emitter.addEventListener(eventName, eventListener);
    if (opts?.errorEvent != null) {
      emitter.addEventListener(opts.errorEvent, errorEventListener);
    }
  });
}
__name(raceEvent, "raceEvent");

// node_modules/race-signal/dist/src/index.js
var AbortError5 = class extends Error {
  static {
    __name(this, "AbortError");
  }
  type;
  code;
  constructor(message2, code2, name3) {
    super(message2 ?? "The operation was aborted");
    this.type = "aborted";
    this.name = name3 ?? "AbortError";
    this.code = code2 ?? "ABORT_ERR";
  }
};
async function raceSignal(promise, signal, opts) {
  if (signal == null) {
    return promise;
  }
  if (signal.aborted) {
    return Promise.reject(new AbortError5(opts?.errorMessage, opts?.errorCode, opts?.errorName));
  }
  let listener;
  const error = new AbortError5(opts?.errorMessage, opts?.errorCode, opts?.errorName);
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

// node_modules/@libp2p/utils/dist/src/queue/recipient.js
var JobRecipient = class {
  static {
    __name(this, "JobRecipient");
  }
  deferred;
  signal;
  constructor(signal) {
    this.signal = signal;
    this.deferred = pDefer();
    this.onAbort = this.onAbort.bind(this);
    this.signal?.addEventListener("abort", this.onAbort);
  }
  onAbort() {
    this.deferred.reject(this.signal?.reason ?? new AbortError());
  }
  cleanup() {
    this.signal?.removeEventListener("abort", this.onAbort);
  }
};

// node_modules/@libp2p/utils/dist/src/queue/job.js
function randomId() {
  return `${parseInt(String(Math.random() * 1e9), 10).toString()}${Date.now()}`;
}
__name(randomId, "randomId");
var Job = class {
  static {
    __name(this, "Job");
  }
  id;
  fn;
  options;
  recipients;
  status;
  timeline;
  controller;
  constructor(fn, options) {
    this.id = randomId();
    this.status = "queued";
    this.fn = fn;
    this.options = options;
    this.recipients = [];
    this.timeline = {
      created: Date.now()
    };
    this.controller = new AbortController();
    setMaxListeners2(Infinity, this.controller.signal);
    this.onAbort = this.onAbort.bind(this);
  }
  abort(err) {
    this.controller.abort(err);
  }
  onAbort() {
    const allAborted = this.recipients.reduce((acc, curr) => {
      return acc && curr.signal?.aborted === true;
    }, true);
    if (allAborted) {
      this.controller.abort(new AbortError());
      this.cleanup();
    }
  }
  async join(options = {}) {
    const recipient = new JobRecipient(options.signal);
    this.recipients.push(recipient);
    options.signal?.addEventListener("abort", this.onAbort);
    return recipient.deferred.promise;
  }
  async run() {
    this.status = "running";
    this.timeline.started = Date.now();
    try {
      this.controller.signal.throwIfAborted();
      const result = await raceSignal(this.fn({
        ...this.options ?? {},
        signal: this.controller.signal
      }), this.controller.signal);
      this.recipients.forEach((recipient) => {
        recipient.deferred.resolve(result);
      });
      this.status = "complete";
    } catch (err) {
      this.recipients.forEach((recipient) => {
        recipient.deferred.reject(err);
      });
      this.status = "errored";
    } finally {
      this.timeline.finished = Date.now();
      this.cleanup();
    }
  }
  cleanup() {
    this.recipients.forEach((recipient) => {
      recipient.cleanup();
      recipient.signal?.removeEventListener("abort", this.onAbort);
    });
  }
};

// node_modules/@libp2p/utils/dist/src/queue/index.js
var Queue = class extends TypedEventEmitter {
  static {
    __name(this, "Queue");
  }
  concurrency;
  queue;
  pending;
  sort;
  constructor(init = {}) {
    super();
    this.concurrency = init.concurrency ?? Number.POSITIVE_INFINITY;
    this.pending = 0;
    if (init.metricName != null) {
      init.metrics?.registerMetricGroup(init.metricName, {
        calculate: /* @__PURE__ */ __name(() => {
          return {
            size: this.queue.length,
            running: this.pending,
            queued: this.queue.length - this.pending
          };
        }, "calculate")
      });
    }
    this.sort = init.sort;
    this.queue = [];
  }
  tryToStartAnother() {
    if (this.size === 0) {
      queueMicrotask(() => {
        this.safeDispatchEvent("empty");
      });
      if (this.running === 0) {
        queueMicrotask(() => {
          this.safeDispatchEvent("idle");
        });
      }
      return false;
    }
    if (this.pending < this.concurrency) {
      let job;
      for (const j of this.queue) {
        if (j.status === "queued") {
          job = j;
          break;
        }
      }
      if (job == null) {
        return false;
      }
      this.safeDispatchEvent("active");
      this.pending++;
      void job.run().finally(() => {
        for (let i = 0; i < this.queue.length; i++) {
          if (this.queue[i] === job) {
            this.queue.splice(i, 1);
            break;
          }
        }
        this.pending--;
        this.tryToStartAnother();
        this.safeDispatchEvent("next");
      });
      return true;
    }
    return false;
  }
  enqueue(job) {
    this.queue.push(job);
    if (this.sort != null) {
      this.queue.sort(this.sort);
    }
  }
  /**
   * Adds a sync or async task to the queue. Always returns a promise.
   */
  async add(fn, options) {
    options?.signal?.throwIfAborted();
    const job = new Job(fn, options);
    this.enqueue(job);
    this.safeDispatchEvent("add");
    this.tryToStartAnother();
    return job.join(options).then((result) => {
      this.safeDispatchEvent("completed", { detail: result });
      this.safeDispatchEvent("success", { detail: { job, result } });
      return result;
    }).catch((err) => {
      if (job.status === "queued") {
        for (let i = 0; i < this.queue.length; i++) {
          if (this.queue[i] === job) {
            this.queue.splice(i, 1);
            break;
          }
        }
      }
      this.safeDispatchEvent("error", { detail: err });
      this.safeDispatchEvent("failure", { detail: { job, error: err } });
      throw err;
    });
  }
  /**
   * Clear the queue
   */
  clear() {
    this.queue.splice(0, this.queue.length);
  }
  /**
   * Abort all jobs in the queue and clear it
   */
  abort() {
    this.queue.forEach((job) => {
      job.abort(new AbortError());
    });
    this.clear();
  }
  /**
   * Can be called multiple times. Useful if you for example add additional items at a later time.
   *
   * @returns A promise that settles when the queue becomes empty.
   */
  async onEmpty(options) {
    if (this.size === 0) {
      return;
    }
    await raceEvent(this, "empty", options?.signal);
  }
  /**
   * @returns A promise that settles when the queue size is less than the given
   * limit: `queue.size < limit`.
   *
   * If you want to avoid having the queue grow beyond a certain size you can
   * `await queue.onSizeLessThan()` before adding a new item.
   *
   * Note that this only limits the number of items waiting to start. There
   * could still be up to `concurrency` jobs already running that this call does
   * not include in its calculation.
   */
  async onSizeLessThan(limit, options) {
    if (this.size < limit) {
      return;
    }
    await raceEvent(this, "next", options?.signal, {
      filter: /* @__PURE__ */ __name(() => this.size < limit, "filter")
    });
  }
  /**
   * The difference with `.onEmpty` is that `.onIdle` guarantees that all work
   * from the queue has finished. `.onEmpty` merely signals that the queue is
   * empty, but it could mean that some promises haven't completed yet.
   *
   * @returns A promise that settles when the queue becomes empty, and all
   * promises have completed; `queue.size === 0 && queue.pending === 0`.
   */
  async onIdle(options) {
    if (this.pending === 0 && this.size === 0) {
      return;
    }
    await raceEvent(this, "idle", options?.signal);
  }
  /**
   * Size of the queue including running items
   */
  get size() {
    return this.queue.length;
  }
  /**
   * The number of queued items waiting to run.
   */
  get queued() {
    return this.queue.length - this.pending;
  }
  /**
   * The number of items currently running.
   */
  get running() {
    return this.pending;
  }
  /**
   * Returns an async generator that makes it easy to iterate over the results
   * of jobs added to the queue.
   *
   * The generator will end when the queue becomes idle, that is there are no
   * jobs running and no jobs that have yet to run.
   *
   * If you need to keep the queue open indefinitely, consider using it-pushable
   * instead.
   */
  async *toGenerator(options) {
    options?.signal?.throwIfAborted();
    const stream = pushable({
      objectMode: true
    });
    const cleanup = /* @__PURE__ */ __name((err) => {
      if (err != null) {
        this.abort();
      } else {
        this.clear();
      }
      stream.end(err);
    }, "cleanup");
    const onQueueJobComplete = /* @__PURE__ */ __name((evt) => {
      if (evt.detail != null) {
        stream.push(evt.detail);
      }
    }, "onQueueJobComplete");
    const onQueueError = /* @__PURE__ */ __name((evt) => {
      cleanup(evt.detail);
    }, "onQueueError");
    const onQueueIdle = /* @__PURE__ */ __name(() => {
      cleanup();
    }, "onQueueIdle");
    const onSignalAbort = /* @__PURE__ */ __name(() => {
      cleanup(new CodeError("Queue aborted", "ERR_QUEUE_ABORTED"));
    }, "onSignalAbort");
    this.addEventListener("completed", onQueueJobComplete);
    this.addEventListener("error", onQueueError);
    this.addEventListener("idle", onQueueIdle);
    options?.signal?.addEventListener("abort", onSignalAbort);
    try {
      yield* stream;
    } finally {
      this.removeEventListener("completed", onQueueJobComplete);
      this.removeEventListener("error", onQueueError);
      this.removeEventListener("idle", onQueueIdle);
      options?.signal?.removeEventListener("abort", onSignalAbort);
      cleanup();
    }
  }
};

// node_modules/@libp2p/utils/dist/src/peer-queue.js
var PeerQueue = class extends Queue {
  static {
    __name(this, "PeerQueue");
  }
  has(peerId2) {
    return this.find(peerId2) != null;
  }
  find(peerId2) {
    return this.queue.find((job) => {
      return peerId2.equals(job.options.peerId);
    });
  }
};

// node_modules/libp2p/dist/src/connection-manager/constants.defaults.js
var DIAL_TIMEOUT = 5e3;
var INBOUND_UPGRADE_TIMEOUT = 2e3;
var MAX_PEER_ADDRS_TO_DIAL = 25;
var AUTO_DIAL_INTERVAL = 5e3;
var AUTO_DIAL_CONCURRENCY = 25;
var AUTO_DIAL_PRIORITY = 0;
var AUTO_DIAL_MAX_QUEUE_LENGTH = 100;
var AUTO_DIAL_DISCOVERED_PEERS_DEBOUNCE = 10;
var INBOUND_CONNECTION_THRESHOLD = 5;
var MAX_INCOMING_PENDING_CONNECTIONS = 10;
var LAST_DIAL_FAILURE_KEY = "last-dial-failure";
var MAX_DIAL_QUEUE_LENGTH = 500;

// node_modules/libp2p/dist/src/connection-manager/constants.browser.js
var MIN_CONNECTIONS = 5;
var MAX_CONNECTIONS = 100;
var MAX_PARALLEL_DIALS = 50;
var AUTO_DIAL_PEER_RETRY_THRESHOLD = 1e3 * 60 * 7;

// node_modules/libp2p/dist/src/connection-manager/auto-dial.js
var defaultOptions3 = {
  minConnections: MIN_CONNECTIONS,
  maxQueueLength: AUTO_DIAL_MAX_QUEUE_LENGTH,
  autoDialConcurrency: AUTO_DIAL_CONCURRENCY,
  autoDialPriority: AUTO_DIAL_PRIORITY,
  autoDialInterval: AUTO_DIAL_INTERVAL,
  autoDialPeerRetryThreshold: AUTO_DIAL_PEER_RETRY_THRESHOLD,
  autoDialDiscoveredPeersDebounce: AUTO_DIAL_DISCOVERED_PEERS_DEBOUNCE
};
var AutoDial = class {
  static {
    __name(this, "AutoDial");
  }
  connectionManager;
  peerStore;
  queue;
  minConnections;
  autoDialPriority;
  autoDialIntervalMs;
  autoDialMaxQueueLength;
  autoDialPeerRetryThresholdMs;
  autoDialDiscoveredPeersDebounce;
  autoDialInterval;
  started;
  running;
  log;
  /**
   * Proactively tries to connect to known peers stored in the PeerStore.
   * It will keep the number of connections below the upper limit and sort
   * the peers to connect based on whether we know their keys and protocols.
   */
  constructor(components, init) {
    this.connectionManager = components.connectionManager;
    this.peerStore = components.peerStore;
    this.minConnections = init.minConnections ?? defaultOptions3.minConnections;
    this.autoDialPriority = init.autoDialPriority ?? defaultOptions3.autoDialPriority;
    this.autoDialIntervalMs = init.autoDialInterval ?? defaultOptions3.autoDialInterval;
    this.autoDialMaxQueueLength = init.maxQueueLength ?? defaultOptions3.maxQueueLength;
    this.autoDialPeerRetryThresholdMs = init.autoDialPeerRetryThreshold ?? defaultOptions3.autoDialPeerRetryThreshold;
    this.autoDialDiscoveredPeersDebounce = init.autoDialDiscoveredPeersDebounce ?? defaultOptions3.autoDialDiscoveredPeersDebounce;
    this.log = components.logger.forComponent("libp2p:connection-manager:auto-dial");
    this.started = false;
    this.running = false;
    this.queue = new PeerQueue({
      concurrency: init.autoDialConcurrency ?? defaultOptions3.autoDialConcurrency,
      metricName: "libp2p_autodial_queue",
      metrics: components.metrics
    });
    this.queue.addEventListener("error", (evt) => {
      this.log.error("error during auto-dial", evt.detail);
    });
    components.events.addEventListener("connection:close", () => {
      this.autoDial().catch((err) => {
        this.log.error(err);
      });
    });
    let debounce2;
    components.events.addEventListener("peer:discovery", () => {
      clearTimeout(debounce2);
      debounce2 = setTimeout(() => {
        this.autoDial().catch((err) => {
          this.log.error(err);
        });
      }, this.autoDialDiscoveredPeersDebounce);
    });
  }
  isStarted() {
    return this.started;
  }
  start() {
    this.started = true;
  }
  afterStart() {
    this.autoDial().catch((err) => {
      this.log.error("error while autodialing", err);
    });
  }
  stop() {
    this.queue.clear();
    clearTimeout(this.autoDialInterval);
    this.started = false;
    this.running = false;
  }
  async autoDial() {
    if (!this.started || this.running) {
      return;
    }
    const connections = this.connectionManager.getConnectionsMap();
    const numConnections = connections.size;
    if (numConnections >= this.minConnections) {
      if (this.minConnections > 0) {
        this.log.trace("have enough connections %d/%d", numConnections, this.minConnections);
      }
      return;
    }
    if (this.queue.size > this.autoDialMaxQueueLength) {
      this.log("not enough connections %d/%d but auto dial queue is full", numConnections, this.minConnections);
      this.sheduleNextAutodial();
      return;
    }
    this.running = true;
    this.log("not enough connections %d/%d - will dial peers to increase the number of connections", numConnections, this.minConnections);
    const dialQueue = new PeerSet(
      // @ts-expect-error boolean filter removes falsy peer IDs
      this.connectionManager.getDialQueue().map((queue) => queue.peerId).filter(Boolean)
    );
    const peers = await this.peerStore.all({
      filters: [
        // remove some peers
        (peer) => {
          if (peer.addresses.length === 0) {
            this.log.trace("not autodialing %p because they have no addresses", peer.id);
            return false;
          }
          if (connections.has(peer.id)) {
            this.log.trace("not autodialing %p because they are already connected", peer.id);
            return false;
          }
          if (dialQueue.has(peer.id)) {
            this.log.trace("not autodialing %p because they are already being dialed", peer.id);
            return false;
          }
          if (this.queue.has(peer.id)) {
            this.log.trace("not autodialing %p because they are already being autodialed", peer.id);
            return false;
          }
          return true;
        }
      ]
    });
    const shuffledPeers = peers.sort(() => Math.random() > 0.5 ? 1 : -1);
    const peerValues = new PeerMap();
    for (const peer of shuffledPeers) {
      if (peerValues.has(peer.id)) {
        continue;
      }
      peerValues.set(peer.id, [...peer.tags.values()].reduce((acc, curr) => {
        return acc + curr.value;
      }, 0));
    }
    const sortedPeers = shuffledPeers.sort((a, b) => {
      const peerAValue = peerValues.get(a.id) ?? 0;
      const peerBValue = peerValues.get(b.id) ?? 0;
      if (peerAValue > peerBValue) {
        return -1;
      }
      if (peerAValue < peerBValue) {
        return 1;
      }
      return 0;
    });
    const peersThatHaveNotFailed = sortedPeers.filter((peer) => {
      const lastDialFailure = peer.metadata.get(LAST_DIAL_FAILURE_KEY);
      if (lastDialFailure == null) {
        return true;
      }
      const lastDialFailureTimestamp = parseInt(toString2(lastDialFailure));
      if (isNaN(lastDialFailureTimestamp)) {
        return true;
      }
      return Date.now() - lastDialFailureTimestamp > this.autoDialPeerRetryThresholdMs;
    });
    this.log("selected %d/%d peers to dial", peersThatHaveNotFailed.length, peers.length);
    for (const peer of peersThatHaveNotFailed) {
      this.queue.add(async () => {
        const numConnections2 = this.connectionManager.getConnectionsMap().size;
        if (numConnections2 >= this.minConnections) {
          this.log("got enough connections now %d/%d", numConnections2, this.minConnections);
          this.queue.clear();
          return;
        }
        this.log("connecting to a peerStore stored peer %p", peer.id);
        await this.connectionManager.openConnection(peer.id, {
          priority: this.autoDialPriority
        });
      }, {
        peerId: peer.id
      }).catch((err) => {
        this.log.error("could not connect to peerStore stored peer", err);
      });
    }
    this.running = false;
    this.sheduleNextAutodial();
  }
  sheduleNextAutodial() {
    if (!this.started) {
      return;
    }
    this.autoDialInterval = setTimeout(() => {
      this.autoDial().catch((err) => {
        this.log.error("error while autodialing", err);
      });
    }, this.autoDialIntervalMs);
  }
};

// node_modules/@libp2p/utils/dist/src/close.js
var DEFAULT_CLOSABLE_PROTOCOLS = [
  // identify
  "/ipfs/id/1.0.0",
  // identify-push
  "/ipfs/id/push/1.0.0",
  // autonat
  "/libp2p/autonat/1.0.0",
  // dcutr
  "/libp2p/dcutr"
];
async function safelyCloseConnectionIfUnused(connection, options) {
  const streamProtocols = connection?.streams?.map((stream) => stream.protocol) ?? [];
  const closableProtocols = options?.closableProtocols ?? DEFAULT_CLOSABLE_PROTOCOLS;
  if (streamProtocols.filter((proto) => proto != null && !closableProtocols.includes(proto)).length > 0) {
    return;
  }
  try {
    await connection?.close(options);
  } catch (err) {
    connection?.abort(err);
  }
}
__name(safelyCloseConnectionIfUnused, "safelyCloseConnectionIfUnused");

// node_modules/libp2p/dist/src/connection-manager/connection-pruner.js
var defaultOptions4 = {
  maxConnections: MAX_CONNECTIONS,
  allow: []
};
var ConnectionPruner = class {
  static {
    __name(this, "ConnectionPruner");
  }
  maxConnections;
  connectionManager;
  peerStore;
  allow;
  events;
  log;
  constructor(components, init = {}) {
    this.maxConnections = init.maxConnections ?? defaultOptions4.maxConnections;
    this.allow = init.allow ?? defaultOptions4.allow;
    this.connectionManager = components.connectionManager;
    this.peerStore = components.peerStore;
    this.events = components.events;
    this.log = components.logger.forComponent("libp2p:connection-manager:connection-pruner");
    components.events.addEventListener("connection:open", () => {
      this.maybePruneConnections().catch((err) => {
        this.log.error(err);
      });
    });
  }
  /**
   * If we have more connections than our maximum, select some excess connections
   * to prune based on peer value
   */
  async maybePruneConnections() {
    const connections = this.connectionManager.getConnections();
    const numConnections = connections.length;
    this.log("checking max connections limit %d/%d", numConnections, this.maxConnections);
    if (numConnections <= this.maxConnections) {
      return;
    }
    const peerValues = new PeerMap();
    for (const connection of connections) {
      const remotePeer = connection.remotePeer;
      if (peerValues.has(remotePeer)) {
        continue;
      }
      peerValues.set(remotePeer, 0);
      try {
        const peer = await this.peerStore.get(remotePeer);
        peerValues.set(remotePeer, [...peer.tags.values()].reduce((acc, curr) => {
          return acc + curr.value;
        }, 0));
      } catch (err) {
        if (err.code !== "ERR_NOT_FOUND") {
          this.log.error("error loading peer tags", err);
        }
      }
    }
    const sortedConnections = this.sortConnections(connections, peerValues);
    const toPrune = Math.max(numConnections - this.maxConnections, 0);
    const toClose = [];
    for (const connection of sortedConnections) {
      this.log("too many connections open - closing a connection to %p", connection.remotePeer);
      const connectionInAllowList = this.allow.some((ma) => {
        return connection.remoteAddr.toString().startsWith(ma.toString());
      });
      if (!connectionInAllowList) {
        toClose.push(connection);
      }
      if (toClose.length === toPrune) {
        break;
      }
    }
    await Promise.all(toClose.map(async (connection) => {
      await safelyCloseConnectionIfUnused(connection, {
        signal: AbortSignal.timeout(1e3)
      });
    }));
    this.events.safeDispatchEvent("connection:prune", { detail: toClose });
  }
  sortConnections(connections, peerValues) {
    return connections.sort((a, b) => {
      const connectionALifespan = a.timeline.open;
      const connectionBLifespan = b.timeline.open;
      if (connectionALifespan < connectionBLifespan) {
        return 1;
      }
      if (connectionALifespan > connectionBLifespan) {
        return -1;
      }
      return 0;
    }).sort((a, b) => {
      if (a.direction === "outbound" && b.direction === "inbound") {
        return 1;
      }
      if (a.direction === "inbound" && b.direction === "outbound") {
        return -1;
      }
      return 0;
    }).sort((a, b) => {
      if (a.streams.length > b.streams.length) {
        return 1;
      }
      if (a.streams.length < b.streams.length) {
        return -1;
      }
      return 0;
    }).sort((a, b) => {
      const peerAValue = peerValues.get(a.remotePeer) ?? 0;
      const peerBValue = peerValues.get(b.remotePeer) ?? 0;
      if (peerAValue > peerBValue) {
        return 1;
      }
      if (peerAValue < peerBValue) {
        return -1;
      }
      return 0;
    });
  }
};

// node_modules/@libp2p/utils/dist/src/priority-queue.js
var PriorityQueue2 = class extends Queue {
  static {
    __name(this, "PriorityQueue");
  }
  constructor(init = {}) {
    super({
      ...init,
      sort: /* @__PURE__ */ __name((a, b) => {
        if (a.options.priority > b.options.priority) {
          return -1;
        }
        if (a.options.priority < b.options.priority) {
          return 1;
        }
        return 0;
      }, "sort")
    });
  }
};

// node_modules/any-signal/dist/src/index.js
function anySignal(signals) {
  const controller = new globalThis.AbortController();
  function onAbort() {
    controller.abort();
    for (const signal2 of signals) {
      if (signal2?.removeEventListener != null) {
        signal2.removeEventListener("abort", onAbort);
      }
    }
  }
  __name(onAbort, "onAbort");
  for (const signal2 of signals) {
    if (signal2?.aborted === true) {
      onAbort();
      break;
    }
    if (signal2?.addEventListener != null) {
      signal2.addEventListener("abort", onAbort);
    }
  }
  function clear() {
    for (const signal2 of signals) {
      if (signal2?.removeEventListener != null) {
        signal2.removeEventListener("abort", onAbort);
      }
    }
  }
  __name(clear, "clear");
  const signal = controller.signal;
  signal.clear = clear;
  return signal;
}
__name(anySignal, "anySignal");

// node_modules/libp2p/dist/src/connection-manager/utils.js
async function resolveMultiaddrs(ma, options) {
  let resolvable = false;
  for (const key of resolvers.keys()) {
    resolvable = ma.protoNames().includes(key);
    if (resolvable) {
      break;
    }
  }
  if (!resolvable) {
    return [ma];
  }
  const output2 = await ma.resolve(options);
  options.log("resolved %s to", ma, output2.map((ma2) => ma2.toString()));
  return output2;
}
__name(resolveMultiaddrs, "resolveMultiaddrs");

// node_modules/libp2p/dist/src/connection-manager/dial-queue.js
var defaultOptions5 = {
  addressSorter: defaultAddressSort,
  maxParallelDials: MAX_PARALLEL_DIALS,
  maxDialQueueLength: MAX_DIAL_QUEUE_LENGTH,
  maxPeerAddrsToDial: MAX_PEER_ADDRS_TO_DIAL,
  dialTimeout: DIAL_TIMEOUT,
  resolvers: {
    dnsaddr: dnsaddrResolver
  }
};
var DialQueue = class {
  static {
    __name(this, "DialQueue");
  }
  queue;
  components;
  addressSorter;
  maxPeerAddrsToDial;
  maxDialQueueLength;
  dialTimeout;
  shutDownController;
  connections;
  log;
  constructor(components, init = {}) {
    this.addressSorter = init.addressSorter ?? defaultOptions5.addressSorter;
    this.maxPeerAddrsToDial = init.maxPeerAddrsToDial ?? defaultOptions5.maxPeerAddrsToDial;
    this.maxDialQueueLength = init.maxDialQueueLength ?? defaultOptions5.maxDialQueueLength;
    this.dialTimeout = init.dialTimeout ?? defaultOptions5.dialTimeout;
    this.connections = init.connections ?? new PeerMap();
    this.log = components.logger.forComponent("libp2p:connection-manager:dial-queue");
    this.components = components;
    this.shutDownController = new AbortController();
    setMaxListeners2(Infinity, this.shutDownController.signal);
    for (const [key, value] of Object.entries(init.resolvers ?? {})) {
      resolvers.set(key, value);
    }
    this.queue = new PriorityQueue2({
      concurrency: init.maxParallelDials ?? defaultOptions5.maxParallelDials,
      metricName: "libp2p_dial_queue",
      metrics: components.metrics
    });
    this.queue.addEventListener("error", (event) => {
      this.log.error("error in dial queue", event.detail);
    });
  }
  start() {
    this.shutDownController = new AbortController();
    setMaxListeners2(Infinity, this.shutDownController.signal);
  }
  /**
   * Clears any pending dials
   */
  stop() {
    this.shutDownController.abort();
    this.queue.abort();
  }
  /**
   * Connects to a given peer, multiaddr or list of multiaddrs.
   *
   * If a peer is passed, all known multiaddrs will be tried. If a multiaddr or
   * multiaddrs are passed only those will be dialled.
   *
   * Where a list of multiaddrs is passed, if any contain a peer id then all
   * multiaddrs in the list must contain the same peer id.
   *
   * The dial to the first address that is successfully able to upgrade a
   * connection will be used, all other dials will be aborted when that happens.
   */
  async dial(peerIdOrMultiaddr, options = {}) {
    const { peerId: peerId2, multiaddrs } = getPeerAddress(peerIdOrMultiaddr);
    const existingConnection = Array.from(this.connections.values()).flat().find((conn) => {
      if (options.force === true) {
        return false;
      }
      if (conn.remotePeer.equals(peerId2)) {
        return true;
      }
      return multiaddrs.find((addr) => {
        return addr.equals(conn.remoteAddr);
      });
    });
    if (existingConnection != null) {
      this.log("already connected to %a", existingConnection.remoteAddr);
      options.onProgress?.(new CustomProgressEvent("dial-queue:already-connected"));
      return existingConnection;
    }
    const existingDial = this.queue.queue.find((job) => {
      if (peerId2?.equals(job.options.peerId) === true) {
        return true;
      }
      const addresses = job.options.multiaddrs;
      if (addresses == null) {
        return false;
      }
      for (const multiaddr2 of multiaddrs) {
        if (addresses.has(multiaddr2.toString())) {
          return true;
        }
      }
      return false;
    });
    if (existingDial != null) {
      this.log("joining existing dial target for %p", peerId2);
      for (const multiaddr2 of multiaddrs) {
        existingDial.options.multiaddrs.add(multiaddr2.toString());
      }
      options.onProgress?.(new CustomProgressEvent("dial-queue:already-in-dial-queue"));
      return existingDial.join(options);
    }
    if (this.queue.size >= this.maxDialQueueLength) {
      throw new CodeError("Dial queue is full", "ERR_DIAL_QUEUE_FULL");
    }
    this.log("creating dial target for %p", peerId2, multiaddrs.map((ma) => ma.toString()));
    options.onProgress?.(new CustomProgressEvent("dial-queue:add-to-dial-queue"));
    return this.queue.add(async (options2) => {
      options2?.onProgress?.(new CustomProgressEvent("dial-queue:start-dial"));
      const signal = this.createDialAbortController(options2?.signal);
      let addrsToDial;
      try {
        addrsToDial = await this.calculateMultiaddrs(peerId2, options2?.multiaddrs, {
          ...options2,
          signal
        });
        options2?.onProgress?.(new CustomProgressEvent("dial-queue:calculated-addresses", addrsToDial));
        addrsToDial.map(({ multiaddr: multiaddr2 }) => multiaddr2.toString()).forEach((addr) => {
          options2?.multiaddrs.add(addr);
        });
      } catch (err) {
        signal.clear();
        throw err;
      }
      try {
        let dialed = 0;
        const errors = [];
        for (const address of addrsToDial) {
          if (dialed === this.maxPeerAddrsToDial) {
            this.log("dialed maxPeerAddrsToDial (%d) addresses for %p, not trying any others", dialed, peerId2);
            throw new CodeError("Peer had more than maxPeerAddrsToDial", codes4.ERR_TOO_MANY_ADDRESSES);
          }
          dialed++;
          try {
            const conn = await this.components.transportManager.dial(address.multiaddr, {
              ...options2,
              signal
            });
            this.log("dial to %a succeeded", address.multiaddr);
            return conn;
          } catch (err) {
            this.log.error("dial failed to %a", address.multiaddr, err);
            if (peerId2 != null) {
              try {
                await this.components.peerStore.patch(peerId2, {
                  metadata: {
                    [LAST_DIAL_FAILURE_KEY]: fromString2(Date.now().toString())
                  }
                });
              } catch (err2) {
                this.log.error("could not update last dial failure key for %p", peerId2, err2);
              }
            }
            if (signal.aborted) {
              throw new CodeError(err.message, ERR_TIMEOUT);
            }
            errors.push(err);
          }
        }
        if (errors.length === 1) {
          throw errors[0];
        }
        throw new AggregateCodeError(errors, "All multiaddr dials failed", codes4.ERR_TRANSPORT_DIAL_FAILED);
      } finally {
        signal.clear();
      }
    }, {
      peerId: peerId2,
      priority: options.priority ?? DEFAULT_DIAL_PRIORITY,
      multiaddrs: new Set(multiaddrs.map((ma) => ma.toString())),
      signal: options.signal,
      onProgress: options.onProgress
    });
  }
  createDialAbortController(userSignal) {
    const signal = anySignal([
      AbortSignal.timeout(this.dialTimeout),
      this.shutDownController.signal,
      userSignal
    ]);
    setMaxListeners2(Infinity, signal);
    return signal;
  }
  // eslint-disable-next-line complexity
  async calculateMultiaddrs(peerId2, multiaddrs = /* @__PURE__ */ new Set(), options = {}) {
    const addrs = [...multiaddrs].map((ma) => ({
      multiaddr: multiaddr(ma),
      isCertified: false
    }));
    if (peerId2 != null) {
      if (this.components.peerId.equals(peerId2)) {
        throw new CodeError("Tried to dial self", codes4.ERR_DIALED_SELF);
      }
      if (await this.components.connectionGater.denyDialPeer?.(peerId2) === true) {
        throw new CodeError("The dial request is blocked by gater.allowDialPeer", codes4.ERR_PEER_DIAL_INTERCEPTED);
      }
      if (addrs.length === 0) {
        this.log("loading multiaddrs for %p", peerId2);
        try {
          const peer = await this.components.peerStore.get(peerId2);
          addrs.push(...peer.addresses);
          this.log("loaded multiaddrs for %p", peerId2, addrs.map(({ multiaddr: multiaddr2 }) => multiaddr2.toString()));
        } catch (err) {
          if (err.code !== codes4.ERR_NOT_FOUND) {
            throw err;
          }
        }
      }
      if (addrs.length === 0) {
        this.log("looking up multiaddrs for %p in the peer routing", peerId2);
        try {
          const peerInfo = await this.components.peerRouting.findPeer(peerId2);
          this.log("found multiaddrs for %p in the peer routing", peerId2, addrs.map(({ multiaddr: multiaddr2 }) => multiaddr2.toString()));
          addrs.push(...peerInfo.multiaddrs.map((multiaddr2) => ({
            multiaddr: multiaddr2,
            isCertified: false
          })));
        } catch (err) {
          if (err.code !== codes4.ERR_NO_ROUTERS_AVAILABLE) {
            this.log.error("looking up multiaddrs for %p in the peer routing failed", peerId2, err);
          }
        }
      }
    }
    let resolvedAddresses = (await Promise.all(addrs.map(async (addr) => {
      const result = await resolveMultiaddrs(addr.multiaddr, {
        dns: this.components.dns,
        ...options,
        log: this.log
      });
      if (result.length === 1 && result[0].equals(addr.multiaddr)) {
        return addr;
      }
      return result.map((multiaddr2) => ({
        multiaddr: multiaddr2,
        isCertified: false
      }));
    }))).flat();
    if (peerId2 != null) {
      const peerIdMultiaddr = `/p2p/${peerId2.toString()}`;
      resolvedAddresses = resolvedAddresses.map((addr) => {
        const lastProto = addr.multiaddr.protos().pop();
        if (lastProto?.path === true) {
          return addr;
        }
        if (addr.multiaddr.getPeerId() == null) {
          return {
            multiaddr: addr.multiaddr.encapsulate(peerIdMultiaddr),
            isCertified: addr.isCertified
          };
        }
        return addr;
      });
    }
    const filteredAddrs = resolvedAddresses.filter((addr) => {
      if (this.components.transportManager.dialTransportForMultiaddr(addr.multiaddr) == null) {
        return false;
      }
      const addrPeerId = addr.multiaddr.getPeerId();
      if (peerId2 != null && addrPeerId != null) {
        return peerId2.equals(addrPeerId);
      }
      return true;
    });
    const dedupedAddrs = /* @__PURE__ */ new Map();
    for (const addr of filteredAddrs) {
      const maStr = addr.multiaddr.toString();
      const existing = dedupedAddrs.get(maStr);
      if (existing != null) {
        existing.isCertified = existing.isCertified || addr.isCertified || false;
        continue;
      }
      dedupedAddrs.set(maStr, addr);
    }
    const dedupedMultiaddrs = [...dedupedAddrs.values()];
    if (dedupedMultiaddrs.length === 0) {
      throw new CodeError("The dial request has no valid addresses", codes4.ERR_NO_VALID_ADDRESSES);
    }
    const gatedAdrs = [];
    for (const addr of dedupedMultiaddrs) {
      if (this.components.connectionGater.denyDialMultiaddr != null && await this.components.connectionGater.denyDialMultiaddr(addr.multiaddr)) {
        continue;
      }
      gatedAdrs.push(addr);
    }
    const sortedGatedAddrs = gatedAdrs.sort(this.addressSorter);
    if (sortedGatedAddrs.length === 0) {
      throw new CodeError("The connection gater denied all addresses in the dial request", codes4.ERR_NO_VALID_ADDRESSES);
    }
    this.log.trace("addresses for %p before filtering", peerId2 ?? "unknown peer", resolvedAddresses.map(({ multiaddr: multiaddr2 }) => multiaddr2.toString()));
    this.log.trace("addresses for %p after filtering", peerId2 ?? "unknown peer", sortedGatedAddrs.map(({ multiaddr: multiaddr2 }) => multiaddr2.toString()));
    return sortedGatedAddrs;
  }
  async isDialable(multiaddr2, options = {}) {
    if (!Array.isArray(multiaddr2)) {
      multiaddr2 = [multiaddr2];
    }
    try {
      const addresses = await this.calculateMultiaddrs(void 0, new Set(multiaddr2.map((ma) => ma.toString())), options);
      if (options.runOnTransientConnection === false) {
        return addresses.find((addr) => {
          return !Circuit.matches(addr.multiaddr);
        }) != null;
      }
      return true;
    } catch (err) {
      this.log.trace("error calculating if multiaddr(s) were dialable", err);
    }
    return false;
  }
};

// node_modules/libp2p/dist/src/connection-manager/index.js
var DEFAULT_DIAL_PRIORITY = 50;
var defaultOptions6 = {
  minConnections: MIN_CONNECTIONS,
  maxConnections: MAX_CONNECTIONS,
  inboundConnectionThreshold: INBOUND_CONNECTION_THRESHOLD,
  maxIncomingPendingConnections: MAX_INCOMING_PENDING_CONNECTIONS,
  autoDialConcurrency: AUTO_DIAL_CONCURRENCY,
  autoDialPriority: AUTO_DIAL_PRIORITY,
  autoDialMaxQueueLength: AUTO_DIAL_MAX_QUEUE_LENGTH,
  autoDialPeerRetryThreshold: AUTO_DIAL_PEER_RETRY_THRESHOLD,
  autoDialDiscoveredPeersDebounce: AUTO_DIAL_DISCOVERED_PEERS_DEBOUNCE
};
var DefaultConnectionManager = class {
  static {
    __name(this, "DefaultConnectionManager");
  }
  started;
  connections;
  allow;
  deny;
  maxIncomingPendingConnections;
  incomingPendingConnections;
  maxConnections;
  dialQueue;
  autoDial;
  connectionPruner;
  inboundConnectionRateLimiter;
  peerStore;
  metrics;
  events;
  log;
  constructor(components, init = {}) {
    this.maxConnections = init.maxConnections ?? defaultOptions6.maxConnections;
    const minConnections = init.minConnections ?? defaultOptions6.minConnections;
    if (this.maxConnections < minConnections) {
      throw new CodeError("Connection Manager maxConnections must be greater than minConnections", codes4.ERR_INVALID_PARAMETERS);
    }
    this.connections = new PeerMap();
    this.started = false;
    this.peerStore = components.peerStore;
    this.metrics = components.metrics;
    this.events = components.events;
    this.log = components.logger.forComponent("libp2p:connection-manager");
    this.onConnect = this.onConnect.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);
    this.events.addEventListener("connection:open", this.onConnect);
    this.events.addEventListener("connection:close", this.onDisconnect);
    this.allow = (init.allow ?? []).map((ma) => multiaddr(ma));
    this.deny = (init.deny ?? []).map((ma) => multiaddr(ma));
    this.incomingPendingConnections = 0;
    this.maxIncomingPendingConnections = init.maxIncomingPendingConnections ?? defaultOptions6.maxIncomingPendingConnections;
    this.inboundConnectionRateLimiter = new RateLimiter({
      points: init.inboundConnectionThreshold ?? defaultOptions6.inboundConnectionThreshold,
      duration: 1
    });
    this.autoDial = new AutoDial({
      connectionManager: this,
      peerStore: components.peerStore,
      events: components.events,
      logger: components.logger
    }, {
      minConnections,
      autoDialConcurrency: init.autoDialConcurrency ?? defaultOptions6.autoDialConcurrency,
      autoDialPriority: init.autoDialPriority ?? defaultOptions6.autoDialPriority,
      autoDialPeerRetryThreshold: init.autoDialPeerRetryThreshold ?? defaultOptions6.autoDialPeerRetryThreshold,
      autoDialDiscoveredPeersDebounce: init.autoDialDiscoveredPeersDebounce ?? defaultOptions6.autoDialDiscoveredPeersDebounce,
      maxQueueLength: init.autoDialMaxQueueLength ?? defaultOptions6.autoDialMaxQueueLength
    });
    this.connectionPruner = new ConnectionPruner({
      connectionManager: this,
      peerStore: components.peerStore,
      events: components.events,
      logger: components.logger
    }, {
      maxConnections: this.maxConnections,
      allow: this.allow
    });
    this.dialQueue = new DialQueue(components, {
      addressSorter: init.addressSorter ?? defaultAddressSort,
      maxParallelDials: init.maxParallelDials ?? MAX_PARALLEL_DIALS,
      maxDialQueueLength: init.maxDialQueueLength ?? MAX_DIAL_QUEUE_LENGTH,
      maxPeerAddrsToDial: init.maxPeerAddrsToDial ?? MAX_PEER_ADDRS_TO_DIAL,
      dialTimeout: init.dialTimeout ?? DIAL_TIMEOUT,
      resolvers: init.resolvers ?? {
        dnsaddr: dnsaddrResolver
      },
      connections: this.connections
    });
  }
  [Symbol.toStringTag] = "@libp2p/connection-manager";
  isStarted() {
    return this.started;
  }
  /**
   * Starts the Connection Manager. If Metrics are not enabled on libp2p
   * only event loop and connection limits will be monitored.
   */
  async start() {
    this.metrics?.registerMetricGroup("libp2p_connection_manager_connections", {
      calculate: /* @__PURE__ */ __name(() => {
        const metric = {
          inbound: 0,
          outbound: 0
        };
        for (const conns of this.connections.values()) {
          for (const conn of conns) {
            if (conn.direction === "inbound") {
              metric.inbound++;
            } else {
              metric.outbound++;
            }
          }
        }
        return metric;
      }, "calculate")
    });
    this.metrics?.registerMetricGroup("libp2p_protocol_streams_total", {
      label: "protocol",
      calculate: /* @__PURE__ */ __name(() => {
        const metric = {};
        for (const conns of this.connections.values()) {
          for (const conn of conns) {
            for (const stream of conn.streams) {
              const key = `${stream.direction} ${stream.protocol ?? "unnegotiated"}`;
              metric[key] = (metric[key] ?? 0) + 1;
            }
          }
        }
        return metric;
      }, "calculate")
    });
    this.metrics?.registerMetricGroup("libp2p_connection_manager_protocol_streams_per_connection_90th_percentile", {
      label: "protocol",
      calculate: /* @__PURE__ */ __name(() => {
        const allStreams = {};
        for (const conns of this.connections.values()) {
          for (const conn of conns) {
            const streams = {};
            for (const stream of conn.streams) {
              const key = `${stream.direction} ${stream.protocol ?? "unnegotiated"}`;
              streams[key] = (streams[key] ?? 0) + 1;
            }
            for (const [protocol, count] of Object.entries(streams)) {
              allStreams[protocol] = allStreams[protocol] ?? [];
              allStreams[protocol].push(count);
            }
          }
        }
        const metric = {};
        for (let [protocol, counts] of Object.entries(allStreams)) {
          counts = counts.sort((a, b) => a - b);
          const index = Math.floor(counts.length * 0.9);
          metric[protocol] = counts[index];
        }
        return metric;
      }, "calculate")
    });
    this.dialQueue.start();
    this.autoDial.start();
    this.started = true;
    this.log("started");
  }
  async afterStart() {
    void Promise.resolve().then(async () => {
      const keepAlivePeers = await this.peerStore.all({
        filters: [(peer) => {
          return peer.tags.has(KEEP_ALIVE);
        }]
      });
      await Promise.all(keepAlivePeers.map(async (peer) => {
        await this.openConnection(peer.id).catch((err) => {
          this.log.error(err);
        });
      }));
    }).catch((err) => {
      this.log.error(err);
    });
    this.autoDial.afterStart();
  }
  /**
   * Stops the Connection Manager
   */
  async stop() {
    this.dialQueue.stop();
    this.autoDial.stop();
    const tasks = [];
    for (const connectionList of this.connections.values()) {
      for (const connection of connectionList) {
        tasks.push((async () => {
          try {
            await connection.close();
          } catch (err) {
            this.log.error(err);
          }
        })());
      }
    }
    this.log("closing %d connections", tasks.length);
    await Promise.all(tasks);
    this.connections.clear();
    this.log("stopped");
  }
  onConnect(evt) {
    void this._onConnect(evt).catch((err) => {
      this.log.error(err);
    });
  }
  /**
   * Tracks the incoming connection and check the connection limit
   */
  async _onConnect(evt) {
    const { detail: connection } = evt;
    if (!this.started) {
      await connection.close();
      return;
    }
    const peerId2 = connection.remotePeer;
    const storedConns = this.connections.get(peerId2);
    let isNewPeer = false;
    if (storedConns != null) {
      storedConns.push(connection);
    } else {
      isNewPeer = true;
      this.connections.set(peerId2, [connection]);
    }
    if (peerId2.publicKey != null && peerId2.type === "RSA") {
      await this.peerStore.patch(peerId2, {
        publicKey: peerId2.publicKey
      });
    }
    if (isNewPeer) {
      this.events.safeDispatchEvent("peer:connect", { detail: connection.remotePeer });
    }
  }
  /**
   * Removes the connection from tracking
   */
  onDisconnect(evt) {
    const { detail: connection } = evt;
    if (!this.started) {
      return;
    }
    const peerId2 = connection.remotePeer;
    let storedConn = this.connections.get(peerId2);
    if (storedConn != null && storedConn.length > 1) {
      storedConn = storedConn.filter((conn) => conn.id !== connection.id);
      this.connections.set(peerId2, storedConn);
    } else if (storedConn != null) {
      this.connections.delete(peerId2);
      this.events.safeDispatchEvent("peer:disconnect", { detail: connection.remotePeer });
    }
  }
  getConnections(peerId2) {
    if (peerId2 != null) {
      return this.connections.get(peerId2) ?? [];
    }
    let conns = [];
    for (const c of this.connections.values()) {
      conns = conns.concat(c);
    }
    return conns;
  }
  getConnectionsMap() {
    return this.connections;
  }
  async openConnection(peerIdOrMultiaddr, options = {}) {
    if (!this.isStarted()) {
      throw new CodeError("Not started", codes4.ERR_NODE_NOT_STARTED);
    }
    options.signal?.throwIfAborted();
    const { peerId: peerId2 } = getPeerAddress(peerIdOrMultiaddr);
    if (peerId2 != null && options.force !== true) {
      this.log("dial %p", peerId2);
      const existingConnection = this.getConnections(peerId2).find((conn) => !conn.transient);
      if (existingConnection != null) {
        this.log("had an existing non-transient connection to %p", peerId2);
        options.onProgress?.(new CustomProgressEvent("dial-queue:already-connected"));
        return existingConnection;
      }
    }
    const connection = await this.dialQueue.dial(peerIdOrMultiaddr, {
      ...options,
      priority: options.priority ?? DEFAULT_DIAL_PRIORITY
    });
    let peerConnections = this.connections.get(connection.remotePeer);
    if (peerConnections == null) {
      peerConnections = [];
      this.connections.set(connection.remotePeer, peerConnections);
    }
    let trackedConnection = false;
    for (const conn of peerConnections) {
      if (conn.id === connection.id) {
        trackedConnection = true;
      }
    }
    if (!trackedConnection) {
      peerConnections.push(connection);
    }
    return connection;
  }
  async closeConnections(peerId2, options = {}) {
    const connections = this.connections.get(peerId2) ?? [];
    await Promise.all(connections.map(async (connection) => {
      try {
        await connection.close(options);
      } catch (err) {
        connection.abort(err);
      }
    }));
  }
  async acceptIncomingConnection(maConn) {
    const denyConnection = this.deny.some((ma) => {
      return maConn.remoteAddr.toString().startsWith(ma.toString());
    });
    if (denyConnection) {
      this.log("connection from %a refused - connection remote address was in deny list", maConn.remoteAddr);
      return false;
    }
    const allowConnection = this.allow.some((ma) => {
      return maConn.remoteAddr.toString().startsWith(ma.toString());
    });
    if (allowConnection) {
      this.incomingPendingConnections++;
      return true;
    }
    if (this.incomingPendingConnections === this.maxIncomingPendingConnections) {
      this.log("connection from %a refused - incomingPendingConnections exceeded by host", maConn.remoteAddr);
      return false;
    }
    if (maConn.remoteAddr.isThinWaistAddress()) {
      const host = maConn.remoteAddr.nodeAddress().address;
      try {
        await this.inboundConnectionRateLimiter.consume(host, 1);
      } catch {
        this.log("connection from %a refused - inboundConnectionThreshold exceeded by host %s", maConn.remoteAddr, host);
        return false;
      }
    }
    if (this.getConnections().length < this.maxConnections) {
      this.incomingPendingConnections++;
      return true;
    }
    this.log("connection from %a refused - maxConnections exceeded", maConn.remoteAddr);
    return false;
  }
  afterUpgradeInbound() {
    this.incomingPendingConnections--;
  }
  getDialQueue() {
    const statusMap = {
      queued: "queued",
      running: "active",
      errored: "error",
      complete: "success"
    };
    return this.dialQueue.queue.queue.map((job) => {
      return {
        id: job.id,
        status: statusMap[job.status],
        peerId: job.options.peerId,
        multiaddrs: [...job.options.multiaddrs].map((ma) => multiaddr(ma))
      };
    });
  }
  async isDialable(multiaddr2, options = {}) {
    return this.dialQueue.isDialable(multiaddr2, options);
  }
};

// node_modules/@libp2p/utils/dist/src/moving-average.js
var MovingAverage = class {
  static {
    __name(this, "MovingAverage");
  }
  movingAverage;
  variance;
  deviation;
  forecast;
  timespan;
  previousTime;
  constructor(timespan) {
    this.timespan = timespan;
    this.movingAverage = 0;
    this.variance = 0;
    this.deviation = 0;
    this.forecast = 0;
  }
  alpha(t, pt) {
    return 1 - Math.exp(-(t - pt) / this.timespan);
  }
  push(value, time = Date.now()) {
    if (this.previousTime != null) {
      const a = this.alpha(time, this.previousTime);
      const diff = value - this.movingAverage;
      const incr = a * diff;
      this.movingAverage = a * value + (1 - a) * this.movingAverage;
      this.variance = (1 - a) * (this.variance + diff * incr);
      this.deviation = Math.sqrt(this.variance);
      this.forecast = this.movingAverage + a * diff;
    } else {
      this.movingAverage = value;
    }
    this.previousTime = time;
  }
};

// node_modules/@libp2p/utils/dist/src/adaptive-timeout.js
var DEFAULT_TIMEOUT_MULTIPLIER = 1.2;
var DEFAULT_FAILURE_MULTIPLIER = 2;
var DEFAULT_MIN_TIMEOUT = 2e3;
var AdaptiveTimeout = class {
  static {
    __name(this, "AdaptiveTimeout");
  }
  success;
  failure;
  next;
  metric;
  timeoutMultiplier;
  failureMultiplier;
  minTimeout;
  constructor(init = {}) {
    this.success = new MovingAverage(init.interval ?? 5e3);
    this.failure = new MovingAverage(init.interval ?? 5e3);
    this.next = new MovingAverage(init.interval ?? 5e3);
    this.failureMultiplier = init.failureMultiplier ?? DEFAULT_FAILURE_MULTIPLIER;
    this.timeoutMultiplier = init.timeoutMultiplier ?? DEFAULT_TIMEOUT_MULTIPLIER;
    this.minTimeout = init.minTimeout ?? DEFAULT_MIN_TIMEOUT;
    if (init.metricName != null) {
      this.metric = init.metrics?.registerMetricGroup(init.metricName);
    }
  }
  getTimeoutSignal(options = {}) {
    const timeout = Math.max(Math.round(this.next.movingAverage * (options.timeoutFactor ?? this.timeoutMultiplier)), this.minTimeout);
    const sendTimeout = AbortSignal.timeout(timeout);
    const timeoutSignal = anySignal([options.signal, sendTimeout]);
    setMaxListeners2(Infinity, timeoutSignal, sendTimeout);
    timeoutSignal.start = Date.now();
    timeoutSignal.timeout = timeout;
    return timeoutSignal;
  }
  cleanUp(signal) {
    const time = Date.now() - signal.start;
    if (signal.aborted) {
      this.failure.push(time);
      this.next.push(time * this.failureMultiplier);
      this.metric?.update({
        failureMovingAverage: this.failure.movingAverage,
        failureDeviation: this.failure.deviation,
        failureForecast: this.failure.forecast,
        failureVariance: this.failure.variance,
        failure: time
      });
    } else {
      this.success.push(time);
      this.next.push(time);
      this.metric?.update({
        successMovingAverage: this.success.movingAverage,
        successDeviation: this.success.deviation,
        successForecast: this.success.forecast,
        successVariance: this.success.variance,
        success: time
      });
    }
  }
};

// node_modules/it-queueless-pushable/dist/src/index.js
var QueuelessPushable = class {
  static {
    __name(this, "QueuelessPushable");
  }
  readNext;
  haveNext;
  ended;
  nextResult;
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
    await this._push(void 0);
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
      throw new Error("Cannot push value onto an ended pushable");
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

// node_modules/it-byte-stream/dist/src/errors.js
var UnexpectedEOFError = class extends Error {
  static {
    __name(this, "UnexpectedEOFError");
  }
  name = "UnexpectedEOFError";
  code = "ERR_UNEXPECTED_EOF";
};

// node_modules/it-byte-stream/dist/src/index.js
var CodeError2 = class extends Error {
  static {
    __name(this, "CodeError");
  }
  code;
  constructor(message2, code2) {
    super(message2);
    this.code = code2;
  }
};
var AbortError6 = class extends CodeError2 {
  static {
    __name(this, "AbortError");
  }
  type;
  constructor(message2) {
    super(message2, "ABORT_ERR");
    this.type = "aborted";
    this.name = "AbortError";
  }
};
function byteStream(duplex, opts) {
  const write3 = queuelessPushable();
  duplex.sink(write3).catch(async (err) => {
    await write3.end(err);
  });
  duplex.sink = async (source2) => {
    for await (const buf of source2) {
      await write3.push(buf);
    }
    await write3.end();
  };
  let source = duplex.source;
  if (duplex.source[Symbol.iterator] != null) {
    source = duplex.source[Symbol.iterator]();
  } else if (duplex.source[Symbol.asyncIterator] != null) {
    source = duplex.source[Symbol.asyncIterator]();
  }
  const readBuffer = new Uint8ArrayList();
  const W = {
    read: /* @__PURE__ */ __name(async (bytes2, options) => {
      options?.signal?.throwIfAborted();
      let listener;
      const abortPromise = new Promise((resolve, reject) => {
        listener = /* @__PURE__ */ __name(() => {
          reject(new AbortError6("Read aborted"));
        }, "listener");
        options?.signal?.addEventListener("abort", listener);
      });
      try {
        if (bytes2 == null) {
          const { done, value } = await Promise.race([
            source.next(),
            abortPromise
          ]);
          if (done === true) {
            return new Uint8ArrayList();
          }
          return value;
        }
        while (readBuffer.byteLength < bytes2) {
          const { value, done } = await Promise.race([
            source.next(),
            abortPromise
          ]);
          if (done === true) {
            throw new UnexpectedEOFError("unexpected end of input");
          }
          readBuffer.append(value);
        }
        const buf = readBuffer.sublist(0, bytes2);
        readBuffer.consume(bytes2);
        return buf;
      } finally {
        if (listener != null) {
          options?.signal?.removeEventListener("abort", listener);
        }
      }
    }, "read"),
    write: /* @__PURE__ */ __name(async (data, options) => {
      options?.signal?.throwIfAborted();
      if (data instanceof Uint8Array) {
        await write3.push(data, options);
      } else {
        await write3.push(data.subarray(), options);
      }
    }, "write"),
    unwrap: /* @__PURE__ */ __name(() => {
      if (readBuffer.byteLength > 0) {
        const originalStream = duplex.source;
        duplex.source = async function* () {
          if (opts?.yieldBytes === false) {
            yield readBuffer;
          } else {
            yield* readBuffer;
          }
          yield* originalStream;
        }();
      }
      return duplex;
    }, "unwrap")
  };
  return W;
}
__name(byteStream, "byteStream");

// node_modules/libp2p/dist/src/connection-monitor.js
var DEFAULT_PING_INTERVAL_MS = 1e4;
var PROTOCOL_VERSION = "1.0.0";
var PROTOCOL_NAME = "ping";
var PROTOCOL_PREFIX = "ipfs";
var PING_LENGTH = 32;
var ConnectionMonitor = class {
  static {
    __name(this, "ConnectionMonitor");
  }
  protocol;
  components;
  log;
  heartbeatInterval;
  pingIntervalMs;
  abortController;
  timeout;
  constructor(components, init = {}) {
    this.components = components;
    this.protocol = `/${init.protocolPrefix ?? PROTOCOL_PREFIX}/${PROTOCOL_NAME}/${PROTOCOL_VERSION}`;
    this.log = components.logger.forComponent("libp2p:connection-monitor");
    this.pingIntervalMs = init.pingInterval ?? DEFAULT_PING_INTERVAL_MS;
    this.timeout = new AdaptiveTimeout({
      ...init.pingTimeout ?? {},
      metrics: components.metrics,
      metricName: "libp2p_connection_monitor_ping_time_milliseconds"
    });
  }
  [Symbol.toStringTag] = "@libp2p/connection-monitor";
  [serviceCapabilities] = [
    "@libp2p/connection-monitor"
  ];
  start() {
    this.abortController = new AbortController();
    this.heartbeatInterval = setInterval(() => {
      this.components.connectionManager.getConnections().forEach((conn) => {
        Promise.resolve().then(async () => {
          let start = Date.now();
          try {
            const signal = this.timeout.getTimeoutSignal({
              signal: this.abortController?.signal
            });
            const stream = await conn.newStream(this.protocol, {
              signal,
              runOnTransientConnection: true
            });
            const bs = byteStream(stream);
            start = Date.now();
            await Promise.all([
              bs.write(randomBytes2(PING_LENGTH), {
                signal
              }),
              bs.read(PING_LENGTH, {
                signal
              })
            ]);
            conn.rtt = Date.now() - start;
            await bs.unwrap().close({
              signal
            });
          } catch (err) {
            if (err.code !== "ERR_UNSUPPORTED_PROTOCOL") {
              throw err;
            }
            conn.rtt = (Date.now() - start) / 2;
          }
        }).catch((err) => {
          this.log.error("error during heartbeat, aborting connection", err);
          conn.abort(err);
        });
      });
    }, this.pingIntervalMs);
  }
  stop() {
    this.abortController?.abort();
    if (this.heartbeatInterval != null) {
      clearInterval(this.heartbeatInterval);
    }
  }
};

// node_modules/it-merge/dist/src/index.js
function isAsyncIterable6(thing) {
  return thing[Symbol.asyncIterator] != null;
}
__name(isAsyncIterable6, "isAsyncIterable");
function merge(...sources) {
  const syncSources = [];
  for (const source of sources) {
    if (!isAsyncIterable6(source)) {
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
var src_default9 = merge;

// node_modules/libp2p/dist/src/content-routing.js
var CompoundContentRouting = class {
  static {
    __name(this, "CompoundContentRouting");
  }
  routers;
  started;
  components;
  constructor(components, init) {
    this.routers = init.routers ?? [];
    this.started = false;
    this.components = components;
  }
  [Symbol.toStringTag] = "@libp2p/content-routing";
  isStarted() {
    return this.started;
  }
  async start() {
    this.started = true;
  }
  async stop() {
    this.started = false;
  }
  /**
   * Iterates over all content routers in parallel to find providers of the given key
   */
  async *findProviders(key, options = {}) {
    if (this.routers.length === 0) {
      throw new CodeError("No content routers available", codes4.ERR_NO_ROUTERS_AVAILABLE);
    }
    const self = this;
    const seen = new PeerSet();
    for await (const peer of src_default9(...self.routers.map((router) => router.findProviders(key, options)))) {
      if (peer == null) {
        continue;
      }
      if (peer.multiaddrs.length > 0) {
        await this.components.peerStore.merge(peer.id, {
          multiaddrs: peer.multiaddrs
        });
      }
      if (seen.has(peer.id)) {
        continue;
      }
      seen.add(peer.id);
      yield peer;
    }
  }
  /**
   * Iterates over all content routers in parallel to notify it is
   * a provider of the given key
   */
  async provide(key, options = {}) {
    if (this.routers.length === 0) {
      throw new CodeError("No content routers available", codes4.ERR_NO_ROUTERS_AVAILABLE);
    }
    await Promise.all(this.routers.map(async (router) => {
      await router.provide(key, options);
    }));
  }
  /**
   * Store the given key/value pair in the available content routings
   */
  async put(key, value, options) {
    if (!this.isStarted()) {
      throw new CodeError(messages.NOT_STARTED_YET, codes4.ERR_NODE_NOT_STARTED);
    }
    await Promise.all(this.routers.map(async (router) => {
      await router.put(key, value, options);
    }));
  }
  /**
   * Get the value to the given key.
   * Times out after 1 minute by default.
   */
  async get(key, options) {
    if (!this.isStarted()) {
      throw new CodeError(messages.NOT_STARTED_YET, codes4.ERR_NODE_NOT_STARTED);
    }
    return Promise.any(this.routers.map(async (router) => {
      return router.get(key, options);
    }));
  }
};

// node_modules/it-parallel/dist/src/index.js
var CustomEvent2 = globalThis.CustomEvent ?? Event;
async function* parallel(source, options = {}) {
  let concurrency = options.concurrency ?? Infinity;
  if (concurrency < 1) {
    concurrency = Infinity;
  }
  const ordered = options.ordered == null ? false : options.ordered;
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
    if (sourceFinished && ops.length === 0) {
      break;
    }
  }
}
__name(parallel, "parallel");

// node_modules/libp2p/dist/src/peer-routing.js
var DefaultPeerRouting = class {
  static {
    __name(this, "DefaultPeerRouting");
  }
  log;
  peerId;
  peerStore;
  routers;
  constructor(components, init = {}) {
    this.log = components.logger.forComponent("libp2p:peer-routing");
    this.peerId = components.peerId;
    this.peerStore = components.peerStore;
    this.routers = init.routers ?? [];
  }
  [Symbol.toStringTag] = "@libp2p/peer-routing";
  /**
   * Iterates over all peer routers in parallel to find the given peer
   */
  async findPeer(id, options) {
    if (this.routers.length === 0) {
      throw new CodeError("No peer routers available", codes4.ERR_NO_ROUTERS_AVAILABLE);
    }
    if (id.toString() === this.peerId.toString()) {
      throw new CodeError("Should not try to find self", codes4.ERR_FIND_SELF);
    }
    const self = this;
    const source = src_default9(...this.routers.map((router) => async function* () {
      try {
        yield await router.findPeer(id, options);
      } catch (err) {
        self.log.error(err);
      }
    }()));
    for await (const peer of source) {
      if (peer == null) {
        continue;
      }
      if (peer.multiaddrs.length > 0) {
        await this.peerStore.merge(peer.id, {
          multiaddrs: peer.multiaddrs
        });
      }
      return peer;
    }
    throw new CodeError(messages.NOT_FOUND, codes4.ERR_NOT_FOUND);
  }
  /**
   * Attempt to find the closest peers on the network to the given key
   */
  async *getClosestPeers(key, options = {}) {
    if (this.routers.length === 0) {
      throw new CodeError("No peer routers available", codes4.ERR_NO_ROUTERS_AVAILABLE);
    }
    const self = this;
    const seen = createScalableCuckooFilter(1024);
    for await (const peer of parallel(async function* () {
      const source = src_default9(...self.routers.map((router) => router.getClosestPeers(key, options)));
      for await (let peer2 of source) {
        yield async () => {
          if (peer2.multiaddrs.length === 0) {
            try {
              peer2 = await self.findPeer(peer2.id, {
                ...options,
                useCache: false
              });
            } catch (err) {
              self.log.error("could not find peer multiaddrs", err);
              return;
            }
          }
          return peer2;
        };
      }
    }())) {
      if (peer == null) {
        continue;
      }
      if (peer.multiaddrs.length > 0) {
        await this.peerStore.merge(peer.id, {
          multiaddrs: peer.multiaddrs
        });
      }
      if (seen.has(peer.id.toBytes())) {
        continue;
      }
      seen.add(peer.id.toBytes());
      yield peer;
    }
  }
};

// node_modules/libp2p/dist/src/random-walk.js
var RandomWalk = class extends TypedEventEmitter {
  static {
    __name(this, "RandomWalk");
  }
  peerRouting;
  log;
  walking;
  walkers;
  shutdownController;
  walkController;
  needNext;
  constructor(components) {
    super();
    this.log = components.logger.forComponent("libp2p:random-walk");
    this.peerRouting = components.peerRouting;
    this.walkers = 0;
    this.walking = false;
    this.shutdownController = new AbortController();
    setMaxListeners2(Infinity, this.shutdownController.signal);
  }
  [Symbol.toStringTag] = "@libp2p/random-walk";
  start() {
    this.shutdownController = new AbortController();
    setMaxListeners2(Infinity, this.shutdownController.signal);
  }
  stop() {
    this.shutdownController.abort();
  }
  async *walk(options) {
    if (!this.walking) {
      this.startWalk();
    }
    this.walkers++;
    const signal = anySignal([this.shutdownController.signal, options?.signal]);
    setMaxListeners2(Infinity, signal);
    try {
      while (true) {
        this.needNext?.resolve();
        this.needNext = pDefer();
        const event = await raceEvent(this, "walk:peer", signal, {
          errorEvent: "walk:error"
        });
        yield event.detail;
      }
    } finally {
      signal.clear();
      this.walkers--;
      if (this.walkers === 0) {
        this.walkController?.abort();
        this.walkController = void 0;
      }
    }
  }
  startWalk() {
    this.walking = true;
    this.walkController = new AbortController();
    setMaxListeners2(Infinity, this.walkController.signal);
    const signal = anySignal([this.walkController.signal, this.shutdownController.signal]);
    setMaxListeners2(Infinity, signal);
    const start = Date.now();
    let found = 0;
    Promise.resolve().then(async () => {
      this.log("start walk");
      while (this.walkers > 0) {
        try {
          const data = randomBytes2(32);
          let s2 = Date.now();
          for await (const peer of this.peerRouting.getClosestPeers(data, { signal })) {
            if (signal.aborted) {
              this.log("aborting walk");
            }
            signal.throwIfAborted();
            this.log("found peer %p after %dms for %d walkers", peer.id, Date.now() - s2, this.walkers);
            found++;
            this.safeDispatchEvent("walk:peer", {
              detail: peer
            });
            if (this.walkers === 1 && this.needNext != null) {
              this.log("wait for need next");
              await raceSignal(this.needNext.promise, signal);
            }
            s2 = Date.now();
          }
          this.log("walk iteration for %b and %d walkers finished, found %d peers", data, this.walkers, found);
        } catch (err) {
          this.log.error("randomwalk errored", err);
          this.safeDispatchEvent("walk:error", {
            detail: err
          });
        }
      }
      this.log("no walkers left, ended walk");
    }).catch((err) => {
      this.log.error("randomwalk errored", err);
    }).finally(() => {
      this.log("finished walk, found %d peers after %dms", found, Date.now() - start);
      this.walking = false;
    });
  }
};

// node_modules/libp2p/dist/src/registrar.js
var DEFAULT_MAX_INBOUND_STREAMS = 32;
var DEFAULT_MAX_OUTBOUND_STREAMS = 64;
var DefaultRegistrar = class {
  static {
    __name(this, "DefaultRegistrar");
  }
  log;
  topologies;
  handlers;
  components;
  constructor(components) {
    this.log = components.logger.forComponent("libp2p:registrar");
    this.topologies = /* @__PURE__ */ new Map();
    this.handlers = /* @__PURE__ */ new Map();
    this.components = components;
    this._onDisconnect = this._onDisconnect.bind(this);
    this._onPeerUpdate = this._onPeerUpdate.bind(this);
    this._onPeerIdentify = this._onPeerIdentify.bind(this);
    this.components.events.addEventListener("peer:disconnect", this._onDisconnect);
    this.components.events.addEventListener("peer:update", this._onPeerUpdate);
    this.components.events.addEventListener("peer:identify", this._onPeerIdentify);
  }
  [Symbol.toStringTag] = "@libp2p/registrar";
  getProtocols() {
    return Array.from(/* @__PURE__ */ new Set([
      ...this.handlers.keys()
    ])).sort();
  }
  getHandler(protocol) {
    const handler = this.handlers.get(protocol);
    if (handler == null) {
      throw new CodeError(`No handler registered for protocol ${protocol}`, codes4.ERR_NO_HANDLER_FOR_PROTOCOL);
    }
    return handler;
  }
  getTopologies(protocol) {
    const topologies = this.topologies.get(protocol);
    if (topologies == null) {
      return [];
    }
    return [
      ...topologies.values()
    ];
  }
  /**
   * Registers the `handler` for each protocol
   */
  async handle(protocol, handler, opts) {
    if (this.handlers.has(protocol)) {
      throw new CodeError(`Handler already registered for protocol ${protocol}`, codes4.ERR_PROTOCOL_HANDLER_ALREADY_REGISTERED);
    }
    const options = merge_options_default.bind({ ignoreUndefined: true })({
      maxInboundStreams: DEFAULT_MAX_INBOUND_STREAMS,
      maxOutboundStreams: DEFAULT_MAX_OUTBOUND_STREAMS
    }, opts);
    this.handlers.set(protocol, {
      handler,
      options
    });
    await this.components.peerStore.merge(this.components.peerId, {
      protocols: [protocol]
    });
  }
  /**
   * Removes the handler for each protocol. The protocol
   * will no longer be supported on streams.
   */
  async unhandle(protocols) {
    const protocolList = Array.isArray(protocols) ? protocols : [protocols];
    protocolList.forEach((protocol) => {
      this.handlers.delete(protocol);
    });
    await this.components.peerStore.patch(this.components.peerId, {
      protocols: this.getProtocols()
    });
  }
  /**
   * Register handlers for a set of multicodecs given
   */
  async register(protocol, topology) {
    if (topology == null) {
      throw new CodeError("invalid topology", codes4.ERR_INVALID_PARAMETERS);
    }
    const id = `${(Math.random() * 1e9).toString(36)}${Date.now()}`;
    let topologies = this.topologies.get(protocol);
    if (topologies == null) {
      topologies = /* @__PURE__ */ new Map();
      this.topologies.set(protocol, topologies);
    }
    topologies.set(id, topology);
    return id;
  }
  /**
   * Unregister topology
   */
  unregister(id) {
    for (const [protocol, topologies] of this.topologies.entries()) {
      if (topologies.has(id)) {
        topologies.delete(id);
        if (topologies.size === 0) {
          this.topologies.delete(protocol);
        }
      }
    }
  }
  /**
   * Remove a disconnected peer from the record
   */
  _onDisconnect(evt) {
    const remotePeer = evt.detail;
    void this.components.peerStore.get(remotePeer).then((peer) => {
      for (const protocol of peer.protocols) {
        const topologies = this.topologies.get(protocol);
        if (topologies == null) {
          continue;
        }
        for (const topology of topologies.values()) {
          if (topology.filter?.has(remotePeer) === false) {
            continue;
          }
          topology.filter?.remove(remotePeer);
          topology.onDisconnect?.(remotePeer);
        }
      }
    }).catch((err) => {
      if (err.code === codes4.ERR_NOT_FOUND) {
        return;
      }
      this.log.error("could not inform topologies of disconnecting peer %p", remotePeer, err);
    });
  }
  /**
   * When a peer is updated, if they have removed supported protocols notify any
   * topologies interested in the removed protocols.
   */
  _onPeerUpdate(evt) {
    const { peer, previous } = evt.detail;
    const removed = (previous?.protocols ?? []).filter((protocol) => !peer.protocols.includes(protocol));
    for (const protocol of removed) {
      const topologies = this.topologies.get(protocol);
      if (topologies == null) {
        continue;
      }
      for (const topology of topologies.values()) {
        if (topology.filter?.has(peer.id) === false) {
          continue;
        }
        topology.filter?.remove(peer.id);
        topology.onDisconnect?.(peer.id);
      }
    }
  }
  /**
   * After identify has completed and we have received the list of supported
   * protocols, notify any topologies interested in those protocols.
   */
  _onPeerIdentify(evt) {
    const protocols = evt.detail.protocols;
    const connection = evt.detail.connection;
    const peerId2 = evt.detail.peerId;
    for (const protocol of protocols) {
      const topologies = this.topologies.get(protocol);
      if (topologies == null) {
        continue;
      }
      for (const topology of topologies.values()) {
        if (connection.transient && topology.notifyOnTransient !== true) {
          continue;
        }
        if (topology.filter?.has(peerId2) === true) {
          continue;
        }
        topology.filter?.add(peerId2);
        topology.onConnect?.(peerId2, connection);
      }
    }
  }
};

// node_modules/@libp2p/utils/dist/src/tracked-map.js
var TrackedMap = class extends Map {
  static {
    __name(this, "TrackedMap");
  }
  metric;
  constructor(init) {
    super();
    const { name: name3, metrics } = init;
    this.metric = metrics.registerMetric(name3);
    this.updateComponentMetric();
  }
  set(key, value) {
    super.set(key, value);
    this.updateComponentMetric();
    return this;
  }
  delete(key) {
    const deleted = super.delete(key);
    this.updateComponentMetric();
    return deleted;
  }
  clear() {
    super.clear();
    this.updateComponentMetric();
  }
  updateComponentMetric() {
    this.metric.update(this.size);
  }
};
function trackedMap(config) {
  const { name: name3, metrics } = config;
  let map;
  if (metrics != null) {
    map = new TrackedMap({ name: name3, metrics });
  } else {
    map = /* @__PURE__ */ new Map();
  }
  return map;
}
__name(trackedMap, "trackedMap");

// node_modules/libp2p/dist/src/transport-manager.js
var DefaultTransportManager = class {
  static {
    __name(this, "DefaultTransportManager");
  }
  log;
  components;
  transports;
  listeners;
  faultTolerance;
  started;
  constructor(components, init = {}) {
    this.log = components.logger.forComponent("libp2p:transports");
    this.components = components;
    this.started = false;
    this.transports = /* @__PURE__ */ new Map();
    this.listeners = trackedMap({
      name: "libp2p_transport_manager_listeners",
      metrics: this.components.metrics
    });
    this.faultTolerance = init.faultTolerance ?? FaultTolerance.FATAL_ALL;
  }
  [Symbol.toStringTag] = "@libp2p/transport-manager";
  /**
   * Adds a `Transport` to the manager
   */
  add(transport) {
    const tag = transport[Symbol.toStringTag];
    if (tag == null) {
      throw new CodeError("Transport must have a valid tag", codes4.ERR_INVALID_KEY);
    }
    if (this.transports.has(tag)) {
      throw new CodeError(`There is already a transport with the tag ${tag}`, codes4.ERR_DUPLICATE_TRANSPORT);
    }
    this.log("adding transport %s", tag);
    this.transports.set(tag, transport);
    if (!this.listeners.has(tag)) {
      this.listeners.set(tag, []);
    }
  }
  isStarted() {
    return this.started;
  }
  start() {
    this.started = true;
  }
  async afterStart() {
    const addrs = this.components.addressManager.getListenAddrs();
    await this.listen(addrs);
  }
  /**
   * Stops all listeners
   */
  async stop() {
    const tasks = [];
    for (const [key, listeners] of this.listeners) {
      this.log("closing listeners for %s", key);
      while (listeners.length > 0) {
        const listener = listeners.pop();
        if (listener == null) {
          continue;
        }
        tasks.push(listener.close());
      }
    }
    await Promise.all(tasks);
    this.log("all listeners closed");
    for (const key of this.listeners.keys()) {
      this.listeners.set(key, []);
    }
    this.started = false;
  }
  /**
   * Dials the given Multiaddr over it's supported transport
   */
  async dial(ma, options) {
    const transport = this.dialTransportForMultiaddr(ma);
    if (transport == null) {
      throw new CodeError(`No transport available for address ${String(ma)}`, codes4.ERR_TRANSPORT_UNAVAILABLE);
    }
    options?.onProgress?.(new CustomProgressEvent("transport-manager:selected-transport", transport[Symbol.toStringTag]));
    try {
      return await transport.dial(ma, {
        ...options,
        upgrader: this.components.upgrader
      });
    } catch (err) {
      if (err.code == null) {
        err.code = codes4.ERR_TRANSPORT_DIAL_FAILED;
      }
      throw err;
    }
  }
  /**
   * Returns all Multiaddr's the listeners are using
   */
  getAddrs() {
    let addrs = [];
    for (const listeners of this.listeners.values()) {
      for (const listener of listeners) {
        addrs = [...addrs, ...listener.getAddrs()];
      }
    }
    return addrs;
  }
  /**
   * Returns all the transports instances
   */
  getTransports() {
    return Array.of(...this.transports.values());
  }
  /**
   * Returns all the listener instances
   */
  getListeners() {
    return Array.of(...this.listeners.values()).flat();
  }
  /**
   * Finds a transport that matches the given Multiaddr
   */
  dialTransportForMultiaddr(ma) {
    for (const transport of this.transports.values()) {
      const addrs = transport.dialFilter([ma]);
      if (addrs.length > 0) {
        return transport;
      }
    }
  }
  /**
   * Finds a transport that matches the given Multiaddr
   */
  listenTransportForMultiaddr(ma) {
    for (const transport of this.transports.values()) {
      const addrs = transport.listenFilter([ma]);
      if (addrs.length > 0) {
        return transport;
      }
    }
  }
  /**
   * Starts listeners for each listen Multiaddr
   */
  async listen(addrs) {
    if (!this.isStarted()) {
      throw new CodeError("Not started", codes4.ERR_NODE_NOT_STARTED);
    }
    if (addrs == null || addrs.length === 0) {
      this.log("no addresses were provided for listening, this node is dial only");
      return;
    }
    const couldNotListen = [];
    for (const [key, transport] of this.transports.entries()) {
      const supportedAddrs = transport.listenFilter(addrs);
      const tasks = [];
      for (const addr of supportedAddrs) {
        this.log("creating listener for %s on %a", key, addr);
        const listener = transport.createListener({
          upgrader: this.components.upgrader
        });
        let listeners = this.listeners.get(key) ?? [];
        if (listeners == null) {
          listeners = [];
          this.listeners.set(key, listeners);
        }
        listeners.push(listener);
        listener.addEventListener("listening", () => {
          this.components.events.safeDispatchEvent("transport:listening", {
            detail: listener
          });
        });
        listener.addEventListener("close", () => {
          const index = listeners.findIndex((l) => l === listener);
          listeners.splice(index, 1);
          this.components.events.safeDispatchEvent("transport:close", {
            detail: listener
          });
        });
        tasks.push(listener.listen(addr));
      }
      if (tasks.length === 0) {
        couldNotListen.push(key);
        continue;
      }
      const results = await Promise.allSettled(tasks);
      const isListening = results.find((r) => r.status === "fulfilled");
      if (isListening == null && this.faultTolerance !== FaultTolerance.NO_FATAL) {
        throw new CodeError(`Transport (${key}) could not listen on any available address`, codes4.ERR_NO_VALID_ADDRESSES);
      }
    }
    if (couldNotListen.length === this.transports.size) {
      const message2 = `no valid addresses were provided for transports [${couldNotListen.join(", ")}]`;
      if (this.faultTolerance === FaultTolerance.FATAL_ALL) {
        throw new CodeError(message2, codes4.ERR_NO_VALID_ADDRESSES);
      }
      this.log(`libp2p in dial mode only: ${message2}`);
    }
  }
  /**
   * Removes the given transport from the manager.
   * If a transport has any running listeners, they will be closed.
   */
  async remove(key) {
    const listeners = this.listeners.get(key) ?? [];
    this.log.trace("removing transport %s", key);
    const tasks = [];
    this.log.trace("closing listeners for %s", key);
    while (listeners.length > 0) {
      const listener = listeners.pop();
      if (listener == null) {
        continue;
      }
      tasks.push(listener.close());
    }
    await Promise.all(tasks);
    this.transports.delete(key);
    this.listeners.delete(key);
  }
  /**
   * Removes all transports from the manager.
   * If any listeners are running, they will be closed.
   *
   * @async
   */
  async removeAll() {
    const tasks = [];
    for (const key of this.transports.keys()) {
      tasks.push(this.remove(key));
    }
    await Promise.all(tasks);
  }
};

// node_modules/@libp2p/multistream-select/dist/src/constants.js
var PROTOCOL_ID = "/multistream/1.0.0";
var MAX_PROTOCOL_LENGTH = 1024;

// node_modules/it-length-prefixed-stream/dist/src/errors.js
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

// node_modules/it-length-prefixed-stream/dist/src/index.js
function lpStream(duplex, opts = {}) {
  const bytes2 = byteStream(duplex, opts);
  if (opts.maxDataLength != null && opts.maxLengthLength == null) {
    opts.maxLengthLength = encodingLength2(opts.maxDataLength);
  }
  const decodeLength = opts?.lengthDecoder ?? decode6;
  const encodeLength = opts?.lengthEncoder ?? encode5;
  const W = {
    read: /* @__PURE__ */ __name(async (options) => {
      let dataLength = -1;
      const lengthBuffer = new Uint8ArrayList();
      while (true) {
        lengthBuffer.append(await bytes2.read(1, options));
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
          throw new InvalidDataLengthLengthError("message length length too long");
        }
        if (dataLength > -1) {
          break;
        }
      }
      if (opts?.maxDataLength != null && dataLength > opts.maxDataLength) {
        throw new InvalidDataLengthError("message length too long");
      }
      return bytes2.read(dataLength, options);
    }, "read"),
    write: /* @__PURE__ */ __name(async (data, options) => {
      await bytes2.write(new Uint8ArrayList(encodeLength(data.byteLength), data), options);
    }, "write"),
    writeV: /* @__PURE__ */ __name(async (data, options) => {
      const list = new Uint8ArrayList(...data.flatMap((buf) => [encodeLength(buf.byteLength), buf]));
      await bytes2.write(list, options);
    }, "writeV"),
    unwrap: /* @__PURE__ */ __name(() => {
      return bytes2.unwrap();
    }, "unwrap")
  };
  return W;
}
__name(lpStream, "lpStream");

// node_modules/@libp2p/multistream-select/dist/src/multistream.js
var NewLine = fromString2("\n");
async function write2(writer, buffer, options) {
  await writer.write(buffer, options);
}
__name(write2, "write");
async function writeAll(writer, buffers, options) {
  await writer.writeV(buffers, options);
}
__name(writeAll, "writeAll");
async function read3(reader, options) {
  const buf = await reader.read(options);
  if (buf.byteLength === 0 || buf.get(buf.byteLength - 1) !== NewLine[0]) {
    options.log.error("Invalid mss message - missing newline", buf);
    throw new CodeError("missing newline", "ERR_INVALID_MULTISTREAM_SELECT_MESSAGE");
  }
  return buf.sublist(0, -1);
}
__name(read3, "read");
async function readString(reader, options) {
  const buf = await read3(reader, options);
  return toString2(buf.subarray());
}
__name(readString, "readString");

// node_modules/@libp2p/multistream-select/dist/src/select.js
async function select(stream, protocols, options) {
  protocols = Array.isArray(protocols) ? [...protocols] : [protocols];
  if (protocols.length === 1 && options.negotiateFully === false) {
    return optimisticSelect(stream, protocols[0], options);
  }
  const lp = lpStream(stream, {
    ...options,
    maxDataLength: MAX_PROTOCOL_LENGTH
  });
  const protocol = protocols.shift();
  if (protocol == null) {
    throw new Error("At least one protocol must be specified");
  }
  options.log.trace('select: write ["%s", "%s"]', PROTOCOL_ID, protocol);
  const p1 = fromString2(`${PROTOCOL_ID}
`);
  const p2 = fromString2(`${protocol}
`);
  await writeAll(lp, [p1, p2], options);
  options.log.trace("select: reading multistream-select header");
  let response = await readString(lp, options);
  options.log.trace('select: read "%s"', response);
  if (response === PROTOCOL_ID) {
    options.log.trace("select: reading protocol response");
    response = await readString(lp, options);
    options.log.trace('select: read "%s"', response);
  }
  if (response === protocol) {
    return { stream: lp.unwrap(), protocol };
  }
  for (const protocol2 of protocols) {
    options.log.trace('select: write "%s"', protocol2);
    await write2(lp, fromString2(`${protocol2}
`), options);
    options.log.trace("select: reading protocol response");
    const response2 = await readString(lp, options);
    options.log.trace('select: read "%s" for "%s"', response2, protocol2);
    if (response2 === protocol2) {
      return { stream: lp.unwrap(), protocol: protocol2 };
    }
  }
  throw new CodeError("protocol selection failed", "ERR_UNSUPPORTED_PROTOCOL");
}
__name(select, "select");
function optimisticSelect(stream, protocol, options) {
  const originalSink = stream.sink.bind(stream);
  const originalSource = stream.source;
  let negotiated = false;
  let negotiating = false;
  const doneNegotiating = pDefer();
  let sentProtocol = false;
  let sendingProtocol = false;
  const doneSendingProtocol = pDefer();
  let readProtocol = false;
  let readingProtocol = false;
  const doneReadingProtocol = pDefer();
  const lp = lpStream({
    sink: originalSink,
    source: originalSource
  }, {
    ...options,
    maxDataLength: MAX_PROTOCOL_LENGTH
  });
  stream.sink = async (source) => {
    const { sink } = lp.unwrap();
    await sink(async function* () {
      let sentData = false;
      for await (const buf of source) {
        if (sendingProtocol) {
          await doneSendingProtocol.promise;
        }
        if (!sentProtocol) {
          sendingProtocol = true;
          options.log.trace('optimistic: write ["%s", "%s", data(%d)] in sink', PROTOCOL_ID, protocol, buf.byteLength);
          const protocolString = `${protocol}
`;
          yield new Uint8ArrayList(
            Uint8Array.from([19]),
            // length of PROTOCOL_ID plus newline
            fromString2(`${PROTOCOL_ID}
`),
            encode5(protocolString.length),
            fromString2(protocolString),
            buf
          ).subarray();
          options.log.trace('optimistic: wrote ["%s", "%s", data(%d)] in sink', PROTOCOL_ID, protocol, buf.byteLength);
          sentProtocol = true;
          sendingProtocol = false;
          doneSendingProtocol.resolve();
          negotiate().catch((err) => {
            options.log.error("could not finish optimistic protocol negotiation of %s", protocol, err);
          });
        } else {
          yield buf;
        }
        sentData = true;
      }
      if (!sentData) {
        await negotiate();
      }
    }());
  };
  async function negotiate() {
    if (negotiating) {
      options.log.trace("optimistic: already negotiating %s stream", protocol);
      await doneNegotiating.promise;
      return;
    }
    negotiating = true;
    try {
      if (!sentProtocol) {
        options.log.trace("optimistic: doing send protocol for %s stream", protocol);
        await doSendProtocol();
      }
      if (!readProtocol) {
        options.log.trace("optimistic: doing read protocol for %s stream", protocol);
        await doReadProtocol();
      }
    } finally {
      negotiating = false;
      negotiated = true;
      doneNegotiating.resolve();
    }
  }
  __name(negotiate, "negotiate");
  async function doSendProtocol() {
    if (sendingProtocol) {
      await doneSendingProtocol.promise;
      return;
    }
    sendingProtocol = true;
    try {
      options.log.trace('optimistic: write ["%s", "%s", data] in source', PROTOCOL_ID, protocol);
      await lp.writeV([
        fromString2(`${PROTOCOL_ID}
`),
        fromString2(`${protocol}
`)
      ]);
      options.log.trace('optimistic: wrote ["%s", "%s", data] in source', PROTOCOL_ID, protocol);
    } finally {
      sentProtocol = true;
      sendingProtocol = false;
      doneSendingProtocol.resolve();
    }
  }
  __name(doSendProtocol, "doSendProtocol");
  async function doReadProtocol() {
    if (readingProtocol) {
      await doneReadingProtocol.promise;
      return;
    }
    readingProtocol = true;
    try {
      options.log.trace("optimistic: reading multistream select header");
      let response = await readString(lp, options);
      options.log.trace('optimistic: read multistream select header "%s"', response);
      if (response === PROTOCOL_ID) {
        response = await readString(lp, options);
      }
      options.log.trace('optimistic: read protocol "%s", expecting "%s"', response, protocol);
      if (response !== protocol) {
        throw new CodeError("protocol selection failed", "ERR_UNSUPPORTED_PROTOCOL");
      }
    } finally {
      readProtocol = true;
      readingProtocol = false;
      doneReadingProtocol.resolve();
    }
  }
  __name(doReadProtocol, "doReadProtocol");
  stream.source = async function* () {
    await negotiate();
    options.log.trace('optimistic: reading data from "%s" stream', protocol);
    yield* lp.unwrap().source;
  }();
  if (stream.closeRead != null) {
    const originalCloseRead = stream.closeRead.bind(stream);
    stream.closeRead = async (opts) => {
      if (!negotiated) {
        await negotiate().catch((err) => {
          options.log.error("could not negotiate protocol before close read", err);
        });
      }
      await originalCloseRead(opts);
    };
  }
  if (stream.closeWrite != null) {
    const originalCloseWrite = stream.closeWrite.bind(stream);
    stream.closeWrite = async (opts) => {
      if (!negotiated) {
        await negotiate().catch((err) => {
          options.log.error("could not negotiate protocol before close write", err);
        });
      }
      await originalCloseWrite(opts);
    };
  }
  if (stream.close != null) {
    const originalClose = stream.close.bind(stream);
    stream.close = async (opts) => {
      const tasks = [];
      if (sendingProtocol) {
        tasks.push(doneSendingProtocol.promise);
      }
      if (readingProtocol) {
        tasks.push(doneReadingProtocol.promise);
      }
      if (tasks.length > 0) {
        await raceSignal(Promise.all(tasks), opts?.signal);
      } else {
        negotiated = true;
        negotiating = false;
        doneNegotiating.resolve();
      }
      await originalClose(opts);
    };
  }
  return {
    stream,
    protocol
  };
}
__name(optimisticSelect, "optimisticSelect");

// node_modules/it-length-prefixed/dist/src/utils.js
function isAsyncIterable7(thing) {
  return thing[Symbol.asyncIterator] != null;
}
__name(isAsyncIterable7, "isAsyncIterable");

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
  if (isAsyncIterable7(source)) {
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
var InvalidMessageLengthError2 = class extends Error {
  static {
    __name(this, "InvalidMessageLengthError");
  }
  name = "InvalidMessageLengthError";
  code = "ERR_INVALID_MSG_LENGTH";
};
var InvalidDataLengthError2 = class extends Error {
  static {
    __name(this, "InvalidDataLengthError");
  }
  name = "InvalidDataLengthError";
  code = "ERR_MSG_DATA_TOO_LONG";
};
var InvalidDataLengthLengthError2 = class extends Error {
  static {
    __name(this, "InvalidDataLengthLengthError");
  }
  name = "InvalidDataLengthLengthError";
  code = "ERR_MSG_LENGTH_TOO_LONG";
};
var UnexpectedEOFError2 = class extends Error {
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
            throw new InvalidMessageLengthError2("Invalid message length");
          }
          if (dataLength > maxDataLength) {
            throw new InvalidDataLengthError2("Message length too long");
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
              throw new InvalidDataLengthLengthError2("Message length length too long");
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
  if (isAsyncIterable7(source)) {
    return async function* () {
      for await (const buf of source) {
        buffer.append(buf);
        yield* maybeYield();
      }
      if (buffer.byteLength > 0) {
        throw new UnexpectedEOFError2("Unexpected end of input");
      }
    }();
  }
  return function* () {
    for (const buf of source) {
      buffer.append(buf);
      yield* maybeYield();
    }
    if (buffer.byteLength > 0) {
      throw new UnexpectedEOFError2("Unexpected end of input");
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

// node_modules/@libp2p/multistream-select/dist/src/handle.js
async function handle(stream, protocols, options) {
  protocols = Array.isArray(protocols) ? protocols : [protocols];
  options.log.trace("handle: available protocols %s", protocols);
  const lp = lpStream(stream, {
    ...options,
    maxDataLength: MAX_PROTOCOL_LENGTH,
    maxLengthLength: 2
    // 2 bytes is enough to length-prefix MAX_PROTOCOL_LENGTH
  });
  while (true) {
    options.log.trace("handle: reading incoming string");
    const protocol = await readString(lp, options);
    options.log.trace('handle: read "%s"', protocol);
    if (protocol === PROTOCOL_ID) {
      options.log.trace('handle: respond with "%s" for "%s"', PROTOCOL_ID, protocol);
      await write2(lp, fromString2(`${PROTOCOL_ID}
`), options);
      options.log.trace('handle: responded with "%s" for "%s"', PROTOCOL_ID, protocol);
      continue;
    }
    if (protocols.includes(protocol)) {
      options.log.trace('handle: respond with "%s" for "%s"', protocol, protocol);
      await write2(lp, fromString2(`${protocol}
`), options);
      options.log.trace('handle: responded with "%s" for "%s"', protocol, protocol);
      return { stream: lp.unwrap(), protocol };
    }
    if (protocol === "ls") {
      const protos = new Uint8ArrayList(...protocols.map((p) => encode6.single(fromString2(`${p}
`))), fromString2("\n"));
      options.log.trace('handle: respond with "%s" for %s', protocols, protocol);
      await write2(lp, protos, options);
      options.log.trace('handle: responded with "%s" for %s', protocols, protocol);
      continue;
    }
    options.log('handle: respond with "na" for "%s"', protocol);
    await write2(lp, fromString2("na\n"), options);
    options.log('handle: responded with "na" for "%s"', protocol);
  }
}
__name(handle, "handle");

// node_modules/libp2p/dist/src/connection/index.js
var CLOSE_TIMEOUT = 500;
var ConnectionImpl = class {
  static {
    __name(this, "ConnectionImpl");
  }
  /**
   * Connection identifier.
   */
  id;
  /**
   * Observed multiaddr of the remote peer
   */
  remoteAddr;
  /**
   * Remote peer id
   */
  remotePeer;
  direction;
  timeline;
  multiplexer;
  encryption;
  status;
  transient;
  log;
  /**
   * User provided tags
   *
   */
  tags;
  /**
   * Reference to the new stream function of the multiplexer
   */
  _newStream;
  /**
   * Reference to the close function of the raw connection
   */
  _close;
  _abort;
  /**
   * Reference to the getStreams function of the muxer
   */
  _getStreams;
  /**
   * An implementation of the js-libp2p connection.
   * Any libp2p transport should use an upgrader to return this connection.
   */
  constructor(init) {
    const { remoteAddr, remotePeer, newStream, close, abort, getStreams } = init;
    this.id = `${parseInt(String(Math.random() * 1e9)).toString(36)}${Date.now()}`;
    this.remoteAddr = remoteAddr;
    this.remotePeer = remotePeer;
    this.direction = init.direction;
    this.status = "open";
    this.timeline = init.timeline;
    this.multiplexer = init.multiplexer;
    this.encryption = init.encryption;
    this.transient = init.transient ?? false;
    this.log = init.logger.forComponent(`libp2p:connection:${this.direction}:${this.id}`);
    if (this.remoteAddr.getPeerId() == null) {
      this.remoteAddr = this.remoteAddr.encapsulate(`/p2p/${this.remotePeer}`);
    }
    this._newStream = newStream;
    this._close = close;
    this._abort = abort;
    this._getStreams = getStreams;
    this.tags = [];
  }
  [Symbol.toStringTag] = "Connection";
  [connectionSymbol] = true;
  /**
   * Get all the streams of the muxer
   */
  get streams() {
    return this._getStreams();
  }
  /**
   * Create a new stream from this connection
   */
  async newStream(protocols, options) {
    if (this.status === "closing") {
      throw new CodeError("the connection is being closed", "ERR_CONNECTION_BEING_CLOSED");
    }
    if (this.status === "closed") {
      throw new CodeError("the connection is closed", "ERR_CONNECTION_CLOSED");
    }
    if (!Array.isArray(protocols)) {
      protocols = [protocols];
    }
    if (this.transient && options?.runOnTransientConnection !== true) {
      throw new CodeError("Cannot open protocol stream on transient connection", "ERR_TRANSIENT_CONNECTION");
    }
    const stream = await this._newStream(protocols, options);
    stream.direction = "outbound";
    return stream;
  }
  /**
   * Close the connection
   */
  async close(options = {}) {
    if (this.status === "closed" || this.status === "closing") {
      return;
    }
    this.log("closing connection to %a", this.remoteAddr);
    this.status = "closing";
    if (options.signal == null) {
      const signal = AbortSignal.timeout(CLOSE_TIMEOUT);
      setMaxListeners2(Infinity, signal);
      options = {
        ...options,
        signal
      };
    }
    try {
      this.log.trace("closing all streams");
      await Promise.all(this.streams.map(async (s2) => s2.close(options)));
      this.log.trace("closing underlying transport");
      await this._close(options);
      this.log.trace("updating timeline with close time");
      this.status = "closed";
      this.timeline.close = Date.now();
    } catch (err) {
      this.log.error("error encountered during graceful close of connection to %a", this.remoteAddr, err);
      this.abort(err);
    }
  }
  abort(err) {
    this.log.error("aborting connection to %a due to error", this.remoteAddr, err);
    this.status = "closing";
    this.streams.forEach((s2) => {
      s2.abort(err);
    });
    this.log.error("all streams aborted", this.streams.length);
    this._abort(err);
    this.timeline.close = Date.now();
    this.status = "closed";
  }
};
function createConnection(init) {
  return new ConnectionImpl(init);
}
__name(createConnection, "createConnection");

// node_modules/libp2p/dist/src/upgrader.js
var DEFAULT_PROTOCOL_SELECT_TIMEOUT = 3e4;
function findIncomingStreamLimit(protocol, registrar) {
  try {
    const { options } = registrar.getHandler(protocol);
    return options.maxInboundStreams;
  } catch (err) {
    if (err.code !== codes4.ERR_NO_HANDLER_FOR_PROTOCOL) {
      throw err;
    }
  }
  return DEFAULT_MAX_INBOUND_STREAMS;
}
__name(findIncomingStreamLimit, "findIncomingStreamLimit");
function findOutgoingStreamLimit(protocol, registrar, options = {}) {
  try {
    const { options: options2 } = registrar.getHandler(protocol);
    if (options2.maxOutboundStreams != null) {
      return options2.maxOutboundStreams;
    }
  } catch (err) {
    if (err.code !== codes4.ERR_NO_HANDLER_FOR_PROTOCOL) {
      throw err;
    }
  }
  return options.maxOutboundStreams ?? DEFAULT_MAX_OUTBOUND_STREAMS;
}
__name(findOutgoingStreamLimit, "findOutgoingStreamLimit");
function countStreams(protocol, direction, connection) {
  let streamCount = 0;
  connection.streams.forEach((stream) => {
    if (stream.direction === direction && stream.protocol === protocol) {
      streamCount++;
    }
  });
  return streamCount;
}
__name(countStreams, "countStreams");
var DefaultUpgrader = class {
  static {
    __name(this, "DefaultUpgrader");
  }
  components;
  connectionEncryption;
  muxers;
  inboundUpgradeTimeout;
  events;
  constructor(components, init) {
    this.components = components;
    this.connectionEncryption = /* @__PURE__ */ new Map();
    init.connectionEncryption.forEach((encrypter) => {
      this.connectionEncryption.set(encrypter.protocol, encrypter);
    });
    this.muxers = /* @__PURE__ */ new Map();
    init.muxers.forEach((muxer) => {
      this.muxers.set(muxer.protocol, muxer);
    });
    this.inboundUpgradeTimeout = init.inboundUpgradeTimeout ?? INBOUND_UPGRADE_TIMEOUT;
    this.events = components.events;
  }
  [Symbol.toStringTag] = "@libp2p/upgrader";
  async shouldBlockConnection(remotePeer, maConn, connectionType) {
    const connectionGater2 = this.components.connectionGater[connectionType];
    if (connectionGater2 !== void 0) {
      if (await connectionGater2(remotePeer, maConn)) {
        throw new CodeError(`The multiaddr connection is blocked by gater.${connectionType}`, codes4.ERR_CONNECTION_INTERCEPTED);
      }
    }
  }
  /**
   * Upgrades an inbound connection
   */
  async upgradeInbound(maConn, opts) {
    const accept = await this.components.connectionManager.acceptIncomingConnection(maConn);
    if (!accept) {
      throw new CodeError("connection denied", codes4.ERR_CONNECTION_DENIED);
    }
    let encryptedConn;
    let remotePeer;
    let upgradedConn;
    let muxerFactory;
    let cryptoProtocol;
    const signal = AbortSignal.timeout(this.inboundUpgradeTimeout);
    const onAbort = /* @__PURE__ */ __name(() => {
      maConn.abort(new CodeError("inbound upgrade timeout", ERR_TIMEOUT));
    }, "onAbort");
    signal.addEventListener("abort", onAbort, { once: true });
    setMaxListeners2(Infinity, signal);
    try {
      if (await this.components.connectionGater.denyInboundConnection?.(maConn) === true) {
        throw new CodeError("The multiaddr connection is blocked by gater.acceptConnection", codes4.ERR_CONNECTION_INTERCEPTED);
      }
      this.components.metrics?.trackMultiaddrConnection(maConn);
      maConn.log("starting the inbound connection upgrade");
      let protectedConn = maConn;
      if (opts?.skipProtection !== true) {
        const protector = this.components.connectionProtector;
        if (protector != null) {
          maConn.log("protecting the inbound connection");
          protectedConn = await protector.protect(maConn);
        }
      }
      try {
        encryptedConn = protectedConn;
        if (opts?.skipEncryption !== true) {
          opts?.onProgress?.(new CustomProgressEvent("upgrader:encrypt-inbound-connection"));
          ({
            conn: encryptedConn,
            remotePeer,
            protocol: cryptoProtocol
          } = await this._encryptInbound(protectedConn));
          const maConn2 = {
            ...protectedConn,
            ...encryptedConn
          };
          await this.shouldBlockConnection(remotePeer, maConn2, "denyInboundEncryptedConnection");
        } else {
          const idStr = maConn.remoteAddr.getPeerId();
          if (idStr == null) {
            throw new CodeError("inbound connection that skipped encryption must have a peer id", codes4.ERR_INVALID_MULTIADDR);
          }
          const remotePeerId = peerIdFromString(idStr);
          cryptoProtocol = "native";
          remotePeer = remotePeerId;
        }
        upgradedConn = encryptedConn;
        if (opts?.muxerFactory != null) {
          muxerFactory = opts.muxerFactory;
        } else if (this.muxers.size > 0) {
          opts?.onProgress?.(new CustomProgressEvent("upgrader:multiplex-inbound-connection"));
          const multiplexed = await this._multiplexInbound({
            ...protectedConn,
            ...encryptedConn
          }, this.muxers);
          muxerFactory = multiplexed.muxerFactory;
          upgradedConn = multiplexed.stream;
        }
      } catch (err) {
        maConn.log.error("failed to upgrade inbound connection", err);
        throw err;
      }
      await this.shouldBlockConnection(remotePeer, maConn, "denyInboundUpgradedConnection");
      maConn.log("successfully upgraded inbound connection");
      return this._createConnection({
        cryptoProtocol,
        direction: "inbound",
        maConn,
        upgradedConn,
        muxerFactory,
        remotePeer,
        transient: opts?.transient
      });
    } finally {
      signal.removeEventListener("abort", onAbort);
      this.components.connectionManager.afterUpgradeInbound();
    }
  }
  /**
   * Upgrades an outbound connection
   */
  async upgradeOutbound(maConn, opts) {
    const idStr = maConn.remoteAddr.getPeerId();
    let remotePeerId;
    if (idStr != null) {
      remotePeerId = peerIdFromString(idStr);
      await this.shouldBlockConnection(remotePeerId, maConn, "denyOutboundConnection");
    }
    let encryptedConn;
    let remotePeer;
    let upgradedConn;
    let cryptoProtocol;
    let muxerFactory;
    this.components.metrics?.trackMultiaddrConnection(maConn);
    maConn.log("starting the outbound connection upgrade");
    let protectedConn = maConn;
    if (opts?.skipProtection !== true) {
      const protector = this.components.connectionProtector;
      if (protector != null) {
        protectedConn = await protector.protect(maConn);
      }
    }
    try {
      encryptedConn = protectedConn;
      if (opts?.skipEncryption !== true) {
        ({
          conn: encryptedConn,
          remotePeer,
          protocol: cryptoProtocol
        } = await this._encryptOutbound(protectedConn, remotePeerId));
        const maConn2 = {
          ...protectedConn,
          ...encryptedConn
        };
        await this.shouldBlockConnection(remotePeer, maConn2, "denyOutboundEncryptedConnection");
      } else {
        if (remotePeerId == null) {
          throw new CodeError("Encryption was skipped but no peer id was passed", codes4.ERR_INVALID_PEER);
        }
        cryptoProtocol = "native";
        remotePeer = remotePeerId;
      }
      upgradedConn = encryptedConn;
      if (opts?.muxerFactory != null) {
        muxerFactory = opts.muxerFactory;
      } else if (this.muxers.size > 0) {
        const multiplexed = await this._multiplexOutbound({
          ...protectedConn,
          ...encryptedConn
        }, this.muxers);
        muxerFactory = multiplexed.muxerFactory;
        upgradedConn = multiplexed.stream;
      }
    } catch (err) {
      maConn.log.error("failed to upgrade outbound connection", err);
      await maConn.close(err);
      throw err;
    }
    await this.shouldBlockConnection(remotePeer, maConn, "denyOutboundUpgradedConnection");
    maConn.log("successfully upgraded outbound connection");
    return this._createConnection({
      cryptoProtocol,
      direction: "outbound",
      maConn,
      upgradedConn,
      muxerFactory,
      remotePeer,
      transient: opts?.transient
    });
  }
  /**
   * A convenience method for generating a new `Connection`
   */
  _createConnection(opts) {
    const { cryptoProtocol, direction, maConn, upgradedConn, remotePeer, muxerFactory, transient } = opts;
    let muxer;
    let newStream;
    let connection;
    if (muxerFactory != null) {
      muxer = muxerFactory.createStreamMuxer({
        direction,
        // Run anytime a remote stream is created
        onIncomingStream: /* @__PURE__ */ __name((muxedStream) => {
          if (connection == null) {
            return;
          }
          void Promise.resolve().then(async () => {
            const protocols = this.components.registrar.getProtocols();
            const { stream, protocol } = await handle(muxedStream, protocols, {
              log: muxedStream.log,
              yieldBytes: false
            });
            if (connection == null) {
              return;
            }
            connection.log("incoming stream opened on %s", protocol);
            const incomingLimit = findIncomingStreamLimit(protocol, this.components.registrar);
            const streamCount = countStreams(protocol, "inbound", connection);
            if (streamCount === incomingLimit) {
              const err = new CodeError(`Too many inbound protocol streams for protocol "${protocol}" - limit ${incomingLimit}`, codes4.ERR_TOO_MANY_INBOUND_PROTOCOL_STREAMS);
              muxedStream.abort(err);
              throw err;
            }
            muxedStream.source = stream.source;
            muxedStream.sink = stream.sink;
            muxedStream.protocol = protocol;
            if (stream.closeWrite != null) {
              muxedStream.closeWrite = stream.closeWrite;
            }
            if (stream.closeRead != null) {
              muxedStream.closeRead = stream.closeRead;
            }
            if (stream.close != null) {
              muxedStream.close = stream.close;
            }
            await this.components.peerStore.merge(remotePeer, {
              protocols: [protocol]
            });
            this.components.metrics?.trackProtocolStream(muxedStream, connection);
            this._onStream({ connection, stream: muxedStream, protocol });
          }).catch(async (err) => {
            connection.log.error("error handling incoming stream id %s", muxedStream.id, err.message, err.code, err.stack);
            if (muxedStream.timeline.close == null) {
              await muxedStream.close();
            }
          });
        }, "onIncomingStream")
      });
      newStream = /* @__PURE__ */ __name(async (protocols, options = {}) => {
        if (muxer == null) {
          throw new CodeError("Stream is not multiplexed", codes4.ERR_MUXER_UNAVAILABLE);
        }
        connection.log("starting new stream for protocols %s", protocols);
        const muxedStream = await muxer.newStream();
        connection.log.trace("started new stream %s for protocols %s", muxedStream.id, protocols);
        try {
          if (options.signal == null) {
            muxedStream.log("no abort signal was passed while trying to negotiate protocols %s falling back to default timeout", protocols);
            const signal = AbortSignal.timeout(DEFAULT_PROTOCOL_SELECT_TIMEOUT);
            setMaxListeners2(Infinity, signal);
            options = {
              ...options,
              signal
            };
          }
          muxedStream.log.trace("selecting protocol from protocols %s", protocols);
          const { stream, protocol } = await select(muxedStream, protocols, {
            ...options,
            log: muxedStream.log,
            yieldBytes: true
          });
          muxedStream.log("selected protocol %s", protocol);
          const outgoingLimit = findOutgoingStreamLimit(protocol, this.components.registrar, options);
          const streamCount = countStreams(protocol, "outbound", connection);
          if (streamCount >= outgoingLimit) {
            const err = new CodeError(`Too many outbound protocol streams for protocol "${protocol}" - ${streamCount}/${outgoingLimit}`, codes4.ERR_TOO_MANY_OUTBOUND_PROTOCOL_STREAMS);
            muxedStream.abort(err);
            throw err;
          }
          await this.components.peerStore.merge(remotePeer, {
            protocols: [protocol]
          });
          muxedStream.source = stream.source;
          muxedStream.sink = stream.sink;
          muxedStream.protocol = protocol;
          if (stream.closeWrite != null) {
            muxedStream.closeWrite = stream.closeWrite;
          }
          if (stream.closeRead != null) {
            muxedStream.closeRead = stream.closeRead;
          }
          if (stream.close != null) {
            muxedStream.close = stream.close;
          }
          this.components.metrics?.trackProtocolStream(muxedStream, connection);
          return muxedStream;
        } catch (err) {
          connection.log.error("could not create new stream for protocols %s", protocols, err);
          if (muxedStream.timeline.close == null) {
            muxedStream.abort(err);
          }
          if (err.code != null) {
            throw err;
          }
          throw new CodeError(String(err), codes4.ERR_UNSUPPORTED_PROTOCOL);
        }
      }, "newStream");
      void Promise.all([
        muxer.sink(upgradedConn.source),
        upgradedConn.sink(muxer.source)
      ]).catch((err) => {
        connection.log.error("error piping data through muxer", err);
      });
    }
    const _timeline = maConn.timeline;
    maConn.timeline = new Proxy(_timeline, {
      set: /* @__PURE__ */ __name((...args) => {
        if (connection != null && args[1] === "close" && args[2] != null && _timeline.close == null) {
          (async () => {
            try {
              if (connection.status === "open") {
                await connection.close();
              }
            } catch (err) {
              connection.log.error("error closing connection after timeline close", err);
            } finally {
              this.events.safeDispatchEvent("connection:close", {
                detail: connection
              });
            }
          })().catch((err) => {
            connection.log.error("error thrown while dispatching connection:close event", err);
          });
        }
        return Reflect.set(...args);
      }, "set")
    });
    maConn.timeline.upgraded = Date.now();
    const errConnectionNotMultiplexed = /* @__PURE__ */ __name(() => {
      throw new CodeError("connection is not multiplexed", codes4.ERR_CONNECTION_NOT_MULTIPLEXED);
    }, "errConnectionNotMultiplexed");
    connection = createConnection({
      remoteAddr: maConn.remoteAddr,
      remotePeer,
      status: "open",
      direction,
      timeline: maConn.timeline,
      multiplexer: muxer?.protocol,
      encryption: cryptoProtocol,
      transient,
      logger: this.components.logger,
      newStream: newStream ?? errConnectionNotMultiplexed,
      getStreams: /* @__PURE__ */ __name(() => {
        if (muxer != null) {
          return muxer.streams;
        } else {
          return [];
        }
      }, "getStreams"),
      close: /* @__PURE__ */ __name(async (options) => {
        if (muxer != null) {
          connection.log.trace("close muxer");
          await muxer.close(options);
        }
        connection.log.trace("close maconn");
        await maConn.close(options);
        connection.log.trace("closed maconn");
      }, "close"),
      abort: /* @__PURE__ */ __name((err) => {
        maConn.abort(err);
        if (muxer != null) {
          muxer.abort(err);
        }
      }, "abort")
    });
    this.events.safeDispatchEvent("connection:open", {
      detail: connection
    });
    return connection;
  }
  /**
   * Routes incoming streams to the correct handler
   */
  _onStream(opts) {
    const { connection, stream, protocol } = opts;
    const { handler, options } = this.components.registrar.getHandler(protocol);
    if (connection.transient && options.runOnTransientConnection !== true) {
      throw new CodeError("Cannot open protocol stream on transient connection", "ERR_TRANSIENT_CONNECTION");
    }
    handler({ connection, stream });
  }
  /**
   * Attempts to encrypt the incoming `connection` with the provided `cryptos`
   */
  async _encryptInbound(connection) {
    const protocols = Array.from(this.connectionEncryption.keys());
    connection.log("handling inbound crypto protocol selection", protocols);
    try {
      const { stream, protocol } = await handle(connection, protocols, {
        log: connection.log
      });
      const encrypter = this.connectionEncryption.get(protocol);
      if (encrypter == null) {
        throw new Error(`no crypto module found for ${protocol}`);
      }
      connection.log("encrypting inbound connection using", protocol);
      return {
        ...await encrypter.secureInbound(this.components.peerId, stream),
        protocol
      };
    } catch (err) {
      connection.log.error("encrypting inbound connection failed", err);
      throw new CodeError(err.message, codes4.ERR_ENCRYPTION_FAILED);
    }
  }
  /**
   * Attempts to encrypt the given `connection` with the provided connection encrypters.
   * The first `ConnectionEncrypter` module to succeed will be used
   */
  async _encryptOutbound(connection, remotePeerId) {
    const protocols = Array.from(this.connectionEncryption.keys());
    connection.log("selecting outbound crypto protocol", protocols);
    try {
      connection.log.trace("selecting encrypter from %s", protocols);
      const { stream, protocol } = await select(connection, protocols, {
        log: connection.log,
        yieldBytes: true
      });
      const encrypter = this.connectionEncryption.get(protocol);
      if (encrypter == null) {
        throw new Error(`no crypto module found for ${protocol}`);
      }
      connection.log("encrypting outbound connection to %p using %s", remotePeerId, encrypter);
      return {
        ...await encrypter.secureOutbound(this.components.peerId, stream, remotePeerId),
        protocol
      };
    } catch (err) {
      connection.log.error("encrypting outbound connection to %p failed", remotePeerId, err);
      throw new CodeError(err.message, codes4.ERR_ENCRYPTION_FAILED);
    }
  }
  /**
   * Selects one of the given muxers via multistream-select. That
   * muxer will be used for all future streams on the connection.
   */
  async _multiplexOutbound(connection, muxers) {
    const protocols = Array.from(muxers.keys());
    connection.log("outbound selecting muxer %s", protocols);
    try {
      connection.log.trace("selecting stream muxer from %s", protocols);
      const { stream, protocol } = await select(connection, protocols, {
        log: connection.log,
        yieldBytes: true
      });
      connection.log("selected %s as muxer protocol", protocol);
      const muxerFactory = muxers.get(protocol);
      return { stream, muxerFactory };
    } catch (err) {
      connection.log.error("error multiplexing outbound connection", err);
      throw new CodeError(String(err), codes4.ERR_MUXER_UNAVAILABLE);
    }
  }
  /**
   * Registers support for one of the given muxers via multistream-select. The
   * selected muxer will be used for all future streams on the connection.
   */
  async _multiplexInbound(connection, muxers) {
    const protocols = Array.from(muxers.keys());
    connection.log("inbound handling muxers %s", protocols);
    try {
      const { stream, protocol } = await handle(connection, protocols, {
        log: connection.log
      });
      const muxerFactory = muxers.get(protocol);
      return { stream, muxerFactory };
    } catch (err) {
      connection.log.error("error multiplexing inbound connection", err);
      throw new CodeError(String(err), codes4.ERR_MUXER_UNAVAILABLE);
    }
  }
};

// node_modules/libp2p/dist/src/version.js
var version = "1.9.4";
var name2 = "libp2p";

// node_modules/libp2p/dist/src/libp2p.js
var Libp2pNode = class extends TypedEventEmitter {
  static {
    __name(this, "Libp2pNode");
  }
  peerId;
  peerStore;
  contentRouting;
  peerRouting;
  metrics;
  services;
  logger;
  status;
  components;
  log;
  constructor(init) {
    super();
    this.status = "stopped";
    const events2 = new TypedEventEmitter();
    const originalDispatch = events2.dispatchEvent.bind(events2);
    events2.dispatchEvent = (evt) => {
      const internalResult = originalDispatch(evt);
      const externalResult = this.dispatchEvent(new CustomEvent(evt.type, { detail: evt.detail }));
      return internalResult || externalResult;
    };
    setMaxListeners2(Infinity, events2);
    this.peerId = init.peerId;
    this.logger = init.logger ?? defaultLogger();
    this.log = this.logger.forComponent("libp2p");
    this.services = {};
    const components = this.components = defaultComponents({
      peerId: init.peerId,
      privateKey: init.privateKey,
      nodeInfo: init.nodeInfo ?? {
        name: name2,
        version
      },
      logger: this.logger,
      events: events2,
      datastore: init.datastore ?? new MemoryDatastore(),
      connectionGater: connectionGater(init.connectionGater),
      dns: init.dns
    });
    this.peerStore = this.configureComponent("peerStore", new PersistentPeerStore(components, {
      addressFilter: this.components.connectionGater.filterMultiaddrForPeer,
      ...init.peerStore
    }));
    if (init.metrics != null) {
      this.metrics = this.configureComponent("metrics", init.metrics(this.components));
    }
    components.events.addEventListener("peer:update", (evt) => {
      if (evt.detail.previous == null) {
        const peerInfo = {
          id: evt.detail.peer.id,
          multiaddrs: evt.detail.peer.addresses.map((a) => a.multiaddr)
        };
        components.events.safeDispatchEvent("peer:discovery", { detail: peerInfo });
      }
    });
    if (init.connectionProtector != null) {
      this.configureComponent("connectionProtector", init.connectionProtector(components));
    }
    this.components.upgrader = new DefaultUpgrader(this.components, {
      connectionEncryption: (init.connectionEncryption ?? []).map((fn, index) => this.configureComponent(`connection-encryption-${index}`, fn(this.components))),
      muxers: (init.streamMuxers ?? []).map((fn, index) => this.configureComponent(`stream-muxers-${index}`, fn(this.components))),
      inboundUpgradeTimeout: init.connectionManager?.inboundUpgradeTimeout
    });
    this.configureComponent("transportManager", new DefaultTransportManager(this.components, init.transportManager));
    this.configureComponent("connectionManager", new DefaultConnectionManager(this.components, init.connectionManager));
    if (init.connectionMonitor?.enabled !== false) {
      this.configureComponent("connectionMonitor", new ConnectionMonitor(this.components, init.connectionMonitor));
    }
    this.configureComponent("registrar", new DefaultRegistrar(this.components));
    this.configureComponent("addressManager", new DefaultAddressManager(this.components, init.addresses));
    const peerRouters = (init.peerRouters ?? []).map((fn, index) => this.configureComponent(`peer-router-${index}`, fn(this.components)));
    this.peerRouting = this.components.peerRouting = this.configureComponent("peerRouting", new DefaultPeerRouting(this.components, {
      routers: peerRouters
    }));
    const contentRouters = (init.contentRouters ?? []).map((fn, index) => this.configureComponent(`content-router-${index}`, fn(this.components)));
    this.contentRouting = this.components.contentRouting = this.configureComponent("contentRouting", new CompoundContentRouting(this.components, {
      routers: contentRouters
    }));
    this.configureComponent("randomWalk", new RandomWalk(this.components));
    (init.peerDiscovery ?? []).forEach((fn, index) => {
      const service = this.configureComponent(`peer-discovery-${index}`, fn(this.components));
      service.addEventListener("peer", (evt) => {
        this.#onDiscoveryPeer(evt);
      });
    });
    init.transports?.forEach((fn, index) => {
      this.components.transportManager.add(this.configureComponent(`transport-${index}`, fn(this.components)));
    });
    if (init.services != null) {
      for (const name3 of Object.keys(init.services)) {
        const createService = init.services[name3];
        const service = createService(this.components);
        if (service == null) {
          this.log.error("service factory %s returned null or undefined instance", name3);
          continue;
        }
        this.services[name3] = service;
        this.configureComponent(name3, service);
        if (service[contentRoutingSymbol] != null) {
          this.log("registering service %s for content routing", name3);
          contentRouters.push(service[contentRoutingSymbol]);
        }
        if (service[peerRoutingSymbol] != null) {
          this.log("registering service %s for peer routing", name3);
          peerRouters.push(service[peerRoutingSymbol]);
        }
        if (service[peerDiscoverySymbol] != null) {
          this.log("registering service %s for peer discovery", name3);
          service[peerDiscoverySymbol].addEventListener?.("peer", (evt) => {
            this.#onDiscoveryPeer(evt);
          });
        }
      }
    }
    checkServiceDependencies(components);
  }
  configureComponent(name3, component) {
    if (component == null) {
      this.log.error("component %s was null or undefined", name3);
    }
    this.components[name3] = component;
    return component;
  }
  /**
   * Starts the libp2p node and all its subsystems
   */
  async start() {
    if (this.status !== "stopped") {
      return;
    }
    this.status = "starting";
    this.log("libp2p is starting");
    try {
      await this.components.beforeStart?.();
      await this.components.start();
      await this.components.afterStart?.();
      this.status = "started";
      this.safeDispatchEvent("start", { detail: this });
      this.log("libp2p has started");
    } catch (err) {
      this.log.error("An error occurred starting libp2p", err);
      this.status = "started";
      await this.stop();
      throw err;
    }
  }
  /**
   * Stop the libp2p node by closing its listeners and open connections
   */
  async stop() {
    if (this.status !== "started") {
      return;
    }
    this.log("libp2p is stopping");
    this.status = "stopping";
    await this.components.beforeStop?.();
    await this.components.stop();
    await this.components.afterStop?.();
    this.status = "stopped";
    this.safeDispatchEvent("stop", { detail: this });
    this.log("libp2p has stopped");
  }
  getConnections(peerId2) {
    return this.components.connectionManager.getConnections(peerId2);
  }
  getDialQueue() {
    return this.components.connectionManager.getDialQueue();
  }
  getPeers() {
    const peerSet2 = new PeerSet();
    for (const conn of this.components.connectionManager.getConnections()) {
      peerSet2.add(conn.remotePeer);
    }
    return Array.from(peerSet2);
  }
  async dial(peer, options = {}) {
    return this.components.connectionManager.openConnection(peer, {
      // ensure any userland dials take top priority in the queue
      priority: 75,
      ...options
    });
  }
  async dialProtocol(peer, protocols, options = {}) {
    if (protocols == null) {
      throw new CodeError("no protocols were provided to open a stream", codes4.ERR_INVALID_PROTOCOLS_FOR_STREAM);
    }
    protocols = Array.isArray(protocols) ? protocols : [protocols];
    if (protocols.length === 0) {
      throw new CodeError("no protocols were provided to open a stream", codes4.ERR_INVALID_PROTOCOLS_FOR_STREAM);
    }
    const connection = await this.dial(peer, options);
    return connection.newStream(protocols, options);
  }
  getMultiaddrs() {
    return this.components.addressManager.getAddresses();
  }
  getProtocols() {
    return this.components.registrar.getProtocols();
  }
  async hangUp(peer, options = {}) {
    if (isMultiaddr(peer)) {
      peer = peerIdFromString(peer.getPeerId() ?? "");
    }
    await this.components.connectionManager.closeConnections(peer, options);
  }
  /**
   * Get the public key for the given peer id
   */
  async getPublicKey(peer, options = {}) {
    this.log("getPublicKey %p", peer);
    if (peer.publicKey != null) {
      return peer.publicKey;
    }
    try {
      const peerInfo = await this.peerStore.get(peer);
      if (peerInfo.id.publicKey != null) {
        return peerInfo.id.publicKey;
      }
    } catch (err) {
      if (err.code !== codes4.ERR_NOT_FOUND) {
        throw err;
      }
    }
    const peerKey = concat([
      fromString2("/pk/"),
      peer.multihash.digest
    ]);
    const bytes2 = await this.contentRouting.get(peerKey, options);
    unmarshalPublicKey(bytes2);
    await this.peerStore.patch(peer, {
      publicKey: bytes2
    });
    return bytes2;
  }
  async handle(protocols, handler, options) {
    if (!Array.isArray(protocols)) {
      protocols = [protocols];
    }
    await Promise.all(protocols.map(async (protocol) => {
      await this.components.registrar.handle(protocol, handler, options);
    }));
  }
  async unhandle(protocols) {
    if (!Array.isArray(protocols)) {
      protocols = [protocols];
    }
    await Promise.all(protocols.map(async (protocol) => {
      await this.components.registrar.unhandle(protocol);
    }));
  }
  async register(protocol, topology) {
    return this.components.registrar.register(protocol, topology);
  }
  unregister(id) {
    this.components.registrar.unregister(id);
  }
  async isDialable(multiaddr2, options = {}) {
    return this.components.connectionManager.isDialable(multiaddr2, options);
  }
  /**
   * Called whenever peer discovery services emit `peer` events and adds peers
   * to the peer store.
   */
  #onDiscoveryPeer(evt) {
    const { detail: peer } = evt;
    if (peer.id.toString() === this.peerId.toString()) {
      this.log.error(new Error(codes4.ERR_DISCOVERED_SELF));
      return;
    }
    void this.components.peerStore.merge(peer.id, {
      multiaddrs: peer.multiaddrs
    }).catch((err) => {
      this.log.error(err);
    });
  }
};
async function createLibp2pNode(options = {}) {
  const peerId2 = options.peerId ??= await createEd25519PeerId();
  if (peerId2.privateKey == null) {
    throw new CodeError("peer id was missing private key", "ERR_MISSING_PRIVATE_KEY");
  }
  options.privateKey ??= await unmarshalPrivateKey2(peerId2.privateKey);
  return new Libp2pNode(await validateConfig(options));
}
__name(createLibp2pNode, "createLibp2pNode");

// node_modules/libp2p/dist/src/index.js
async function createLibp2p(options = {}) {
  const node = await createLibp2pNode(options);
  if (options.start !== false) {
    await node.start();
  }
  return node;
}
__name(createLibp2p, "createLibp2p");
export {
  createLibp2p
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
//# sourceMappingURL=lib-libp2p.js.map
