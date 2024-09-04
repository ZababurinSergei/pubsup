var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name8 in all)
    __defProp(target, name8, { get: all[name8], enumerable: true });
};
var __copyProps = (to, from15, except, desc) => {
  if (from15 && typeof from15 === "object" || typeof from15 === "function") {
    for (let key of __getOwnPropNames(from15))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from15[key], enumerable: !(desc = __getOwnPropDesc(from15, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

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
    function createError(err, code13, props) {
      if (!err || typeof err === "string") {
        throw new TypeError("Please pass an Error to err-code");
      }
      if (!props) {
        props = {};
      }
      if (typeof code13 === "object") {
        props = code13;
        code13 = "";
      }
      if (code13) {
        props.code = code13;
      }
      try {
        return assign(err, props);
      } catch (_) {
        props.message = err.message;
        props.stack = err.stack;
        const ErrClass = function() {
        };
        ErrClass.prototype = Object.create(Object.getPrototypeOf(err));
        const output = assign(new ErrClass(), props);
        return output;
      }
    }
    module.exports = createError;
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
      function _validBytes(bytes) {
        if (!Array.isArray(bytes) && !ArrayBuffer.isView(bytes)) {
          return false;
        }
        for (var i = 0; i < bytes.length; i++) {
          if (!Number.isInteger(bytes[i]) || bytes[i] < 0 || bytes[i] > 255) {
            return false;
          }
        }
        return true;
      }
      function _x86Multiply(m, n) {
        return (m & 65535) * n + (((m >>> 16) * n & 65535) << 16);
      }
      function _x86Rotl(m, n) {
        return m << n | m >>> 32 - n;
      }
      function _x86Fmix(h) {
        h ^= h >>> 16;
        h = _x86Multiply(h, 2246822507);
        h ^= h >>> 13;
        h = _x86Multiply(h, 3266489909);
        h ^= h >>> 16;
        return h;
      }
      function _x64Add(m, n) {
        m = [m[0] >>> 16, m[0] & 65535, m[1] >>> 16, m[1] & 65535];
        n = [n[0] >>> 16, n[0] & 65535, n[1] >>> 16, n[1] & 65535];
        var o = [0, 0, 0, 0];
        o[3] += m[3] + n[3];
        o[2] += o[3] >>> 16;
        o[3] &= 65535;
        o[2] += m[2] + n[2];
        o[1] += o[2] >>> 16;
        o[2] &= 65535;
        o[1] += m[1] + n[1];
        o[0] += o[1] >>> 16;
        o[1] &= 65535;
        o[0] += m[0] + n[0];
        o[0] &= 65535;
        return [o[0] << 16 | o[1], o[2] << 16 | o[3]];
      }
      function _x64Multiply(m, n) {
        m = [m[0] >>> 16, m[0] & 65535, m[1] >>> 16, m[1] & 65535];
        n = [n[0] >>> 16, n[0] & 65535, n[1] >>> 16, n[1] & 65535];
        var o = [0, 0, 0, 0];
        o[3] += m[3] * n[3];
        o[2] += o[3] >>> 16;
        o[3] &= 65535;
        o[2] += m[2] * n[3];
        o[1] += o[2] >>> 16;
        o[2] &= 65535;
        o[2] += m[3] * n[2];
        o[1] += o[2] >>> 16;
        o[2] &= 65535;
        o[1] += m[1] * n[3];
        o[0] += o[1] >>> 16;
        o[1] &= 65535;
        o[1] += m[2] * n[2];
        o[0] += o[1] >>> 16;
        o[1] &= 65535;
        o[1] += m[3] * n[1];
        o[0] += o[1] >>> 16;
        o[1] &= 65535;
        o[0] += m[0] * n[3] + m[1] * n[2] + m[2] * n[1] + m[3] * n[0];
        o[0] &= 65535;
        return [o[0] << 16 | o[1], o[2] << 16 | o[3]];
      }
      function _x64Rotl(m, n) {
        n %= 64;
        if (n === 32) {
          return [m[1], m[0]];
        } else if (n < 32) {
          return [m[0] << n | m[1] >>> 32 - n, m[1] << n | m[0] >>> 32 - n];
        } else {
          n -= 32;
          return [m[1] << n | m[0] >>> 32 - n, m[0] << n | m[1] >>> 32 - n];
        }
      }
      function _x64LeftShift(m, n) {
        n %= 64;
        if (n === 0) {
          return m;
        } else if (n < 32) {
          return [m[0] << n | m[1] >>> 32 - n, m[1] << n];
        } else {
          return [m[1] << n - 32, 0];
        }
      }
      function _x64Xor(m, n) {
        return [m[0] ^ n[0], m[1] ^ n[1]];
      }
      function _x64Fmix(h) {
        h = _x64Xor(h, [0, h[0] >>> 1]);
        h = _x64Multiply(h, [4283543511, 3981806797]);
        h = _x64Xor(h, [0, h[0] >>> 1]);
        h = _x64Multiply(h, [3301882366, 444984403]);
        h = _x64Xor(h, [0, h[0] >>> 1]);
        return h;
      }
      library.x86.hash32 = function(bytes, seed) {
        if (library.inputValidation && !_validBytes(bytes)) {
          return undefined2;
        }
        seed = seed || 0;
        var remainder = bytes.length % 4;
        var blocks = bytes.length - remainder;
        var h1 = seed;
        var k1 = 0;
        var c1 = 3432918353;
        var c2 = 461845907;
        for (var i = 0; i < blocks; i = i + 4) {
          k1 = bytes[i] | bytes[i + 1] << 8 | bytes[i + 2] << 16 | bytes[i + 3] << 24;
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
            k1 ^= bytes[i + 2] << 16;
          case 2:
            k1 ^= bytes[i + 1] << 8;
          case 1:
            k1 ^= bytes[i];
            k1 = _x86Multiply(k1, c1);
            k1 = _x86Rotl(k1, 15);
            k1 = _x86Multiply(k1, c2);
            h1 ^= k1;
        }
        h1 ^= bytes.length;
        h1 = _x86Fmix(h1);
        return h1 >>> 0;
      };
      library.x86.hash128 = function(bytes, seed) {
        if (library.inputValidation && !_validBytes(bytes)) {
          return undefined2;
        }
        seed = seed || 0;
        var remainder = bytes.length % 16;
        var blocks = bytes.length - remainder;
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
          k1 = bytes[i] | bytes[i + 1] << 8 | bytes[i + 2] << 16 | bytes[i + 3] << 24;
          k2 = bytes[i + 4] | bytes[i + 5] << 8 | bytes[i + 6] << 16 | bytes[i + 7] << 24;
          k3 = bytes[i + 8] | bytes[i + 9] << 8 | bytes[i + 10] << 16 | bytes[i + 11] << 24;
          k4 = bytes[i + 12] | bytes[i + 13] << 8 | bytes[i + 14] << 16 | bytes[i + 15] << 24;
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
            k4 ^= bytes[i + 14] << 16;
          case 14:
            k4 ^= bytes[i + 13] << 8;
          case 13:
            k4 ^= bytes[i + 12];
            k4 = _x86Multiply(k4, c4);
            k4 = _x86Rotl(k4, 18);
            k4 = _x86Multiply(k4, c1);
            h4 ^= k4;
          case 12:
            k3 ^= bytes[i + 11] << 24;
          case 11:
            k3 ^= bytes[i + 10] << 16;
          case 10:
            k3 ^= bytes[i + 9] << 8;
          case 9:
            k3 ^= bytes[i + 8];
            k3 = _x86Multiply(k3, c3);
            k3 = _x86Rotl(k3, 17);
            k3 = _x86Multiply(k3, c4);
            h3 ^= k3;
          case 8:
            k2 ^= bytes[i + 7] << 24;
          case 7:
            k2 ^= bytes[i + 6] << 16;
          case 6:
            k2 ^= bytes[i + 5] << 8;
          case 5:
            k2 ^= bytes[i + 4];
            k2 = _x86Multiply(k2, c2);
            k2 = _x86Rotl(k2, 16);
            k2 = _x86Multiply(k2, c3);
            h2 ^= k2;
          case 4:
            k1 ^= bytes[i + 3] << 24;
          case 3:
            k1 ^= bytes[i + 2] << 16;
          case 2:
            k1 ^= bytes[i + 1] << 8;
          case 1:
            k1 ^= bytes[i];
            k1 = _x86Multiply(k1, c1);
            k1 = _x86Rotl(k1, 15);
            k1 = _x86Multiply(k1, c2);
            h1 ^= k1;
        }
        h1 ^= bytes.length;
        h2 ^= bytes.length;
        h3 ^= bytes.length;
        h4 ^= bytes.length;
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
      library.x64.hash128 = function(bytes, seed) {
        if (library.inputValidation && !_validBytes(bytes)) {
          return undefined2;
        }
        seed = seed || 0;
        var remainder = bytes.length % 16;
        var blocks = bytes.length - remainder;
        var h1 = [0, seed];
        var h2 = [0, seed];
        var k1 = [0, 0];
        var k2 = [0, 0];
        var c1 = [2277735313, 289559509];
        var c2 = [1291169091, 658871167];
        for (var i = 0; i < blocks; i = i + 16) {
          k1 = [bytes[i + 4] | bytes[i + 5] << 8 | bytes[i + 6] << 16 | bytes[i + 7] << 24, bytes[i] | bytes[i + 1] << 8 | bytes[i + 2] << 16 | bytes[i + 3] << 24];
          k2 = [bytes[i + 12] | bytes[i + 13] << 8 | bytes[i + 14] << 16 | bytes[i + 15] << 24, bytes[i + 8] | bytes[i + 9] << 8 | bytes[i + 10] << 16 | bytes[i + 11] << 24];
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
            k2 = _x64Xor(k2, _x64LeftShift([0, bytes[i + 14]], 48));
          case 14:
            k2 = _x64Xor(k2, _x64LeftShift([0, bytes[i + 13]], 40));
          case 13:
            k2 = _x64Xor(k2, _x64LeftShift([0, bytes[i + 12]], 32));
          case 12:
            k2 = _x64Xor(k2, _x64LeftShift([0, bytes[i + 11]], 24));
          case 11:
            k2 = _x64Xor(k2, _x64LeftShift([0, bytes[i + 10]], 16));
          case 10:
            k2 = _x64Xor(k2, _x64LeftShift([0, bytes[i + 9]], 8));
          case 9:
            k2 = _x64Xor(k2, [0, bytes[i + 8]]);
            k2 = _x64Multiply(k2, c2);
            k2 = _x64Rotl(k2, 33);
            k2 = _x64Multiply(k2, c1);
            h2 = _x64Xor(h2, k2);
          case 8:
            k1 = _x64Xor(k1, _x64LeftShift([0, bytes[i + 7]], 56));
          case 7:
            k1 = _x64Xor(k1, _x64LeftShift([0, bytes[i + 6]], 48));
          case 6:
            k1 = _x64Xor(k1, _x64LeftShift([0, bytes[i + 5]], 40));
          case 5:
            k1 = _x64Xor(k1, _x64LeftShift([0, bytes[i + 4]], 32));
          case 4:
            k1 = _x64Xor(k1, _x64LeftShift([0, bytes[i + 3]], 24));
          case 3:
            k1 = _x64Xor(k1, _x64LeftShift([0, bytes[i + 2]], 16));
          case 2:
            k1 = _x64Xor(k1, _x64LeftShift([0, bytes[i + 1]], 8));
          case 1:
            k1 = _x64Xor(k1, [0, bytes[i]]);
            k1 = _x64Multiply(k1, c1);
            k1 = _x64Rotl(k1, 31);
            k1 = _x64Multiply(k1, c2);
            h1 = _x64Xor(h1, k1);
        }
        h1 = _x64Xor(h1, [0, bytes.length]);
        h2 = _x64Xor(h2, [0, bytes.length]);
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

// node_modules/sparse-array/index.js
var require_sparse_array = __commonJS({
  "node_modules/sparse-array/index.js"(exports, module) {
    "use strict";
    var BITS_PER_BYTE = 7;
    module.exports = class SparseArray {
      constructor() {
        this._bitArrays = [];
        this._data = [];
        this._length = 0;
        this._changedLength = false;
        this._changedData = false;
      }
      set(index, value) {
        let pos = this._internalPositionFor(index, false);
        if (value === void 0) {
          if (pos !== -1) {
            this._unsetInternalPos(pos);
            this._unsetBit(index);
            this._changedLength = true;
            this._changedData = true;
          }
        } else {
          let needsSort = false;
          if (pos === -1) {
            pos = this._data.length;
            this._setBit(index);
            this._changedData = true;
          } else {
            needsSort = true;
          }
          this._setInternalPos(pos, index, value, needsSort);
          this._changedLength = true;
        }
      }
      unset(index) {
        this.set(index, void 0);
      }
      get(index) {
        this._sortData();
        const pos = this._internalPositionFor(index, true);
        if (pos === -1) {
          return void 0;
        }
        return this._data[pos][1];
      }
      push(value) {
        this.set(this.length, value);
        return this.length;
      }
      get length() {
        this._sortData();
        if (this._changedLength) {
          const last2 = this._data[this._data.length - 1];
          this._length = last2 ? last2[0] + 1 : 0;
          this._changedLength = false;
        }
        return this._length;
      }
      forEach(iterator) {
        let i = 0;
        while (i < this.length) {
          iterator(this.get(i), i, this);
          i++;
        }
      }
      map(iterator) {
        let i = 0;
        let mapped = new Array(this.length);
        while (i < this.length) {
          mapped[i] = iterator(this.get(i), i, this);
          i++;
        }
        return mapped;
      }
      reduce(reducer, initialValue) {
        let i = 0;
        let acc = initialValue;
        while (i < this.length) {
          const value = this.get(i);
          acc = reducer(acc, value, i);
          i++;
        }
        return acc;
      }
      find(finder) {
        let i = 0, found, last2;
        while (i < this.length && !found) {
          last2 = this.get(i);
          found = finder(last2);
          i++;
        }
        return found ? last2 : void 0;
      }
      _internalPositionFor(index, noCreate) {
        const bytePos = this._bytePosFor(index, noCreate);
        if (bytePos >= this._bitArrays.length) {
          return -1;
        }
        const byte = this._bitArrays[bytePos];
        const bitPos = index - bytePos * BITS_PER_BYTE;
        const exists2 = (byte & 1 << bitPos) > 0;
        if (!exists2) {
          return -1;
        }
        const previousPopCount = this._bitArrays.slice(0, bytePos).reduce(popCountReduce, 0);
        const mask = ~(4294967295 << bitPos + 1);
        const bytePopCount = popCount(byte & mask);
        const arrayPos = previousPopCount + bytePopCount - 1;
        return arrayPos;
      }
      _bytePosFor(index, noCreate) {
        const bytePos = Math.floor(index / BITS_PER_BYTE);
        const targetLength = bytePos + 1;
        while (!noCreate && this._bitArrays.length < targetLength) {
          this._bitArrays.push(0);
        }
        return bytePos;
      }
      _setBit(index) {
        const bytePos = this._bytePosFor(index, false);
        this._bitArrays[bytePos] |= 1 << index - bytePos * BITS_PER_BYTE;
      }
      _unsetBit(index) {
        const bytePos = this._bytePosFor(index, false);
        this._bitArrays[bytePos] &= ~(1 << index - bytePos * BITS_PER_BYTE);
      }
      _setInternalPos(pos, index, value, needsSort) {
        const data = this._data;
        const elem = [index, value];
        if (needsSort) {
          this._sortData();
          data[pos] = elem;
        } else {
          if (data.length) {
            if (data[data.length - 1][0] >= index) {
              data.push(elem);
            } else if (data[0][0] <= index) {
              data.unshift(elem);
            } else {
              const randomIndex = Math.round(data.length / 2);
              this._data = data.slice(0, randomIndex).concat(elem).concat(data.slice(randomIndex));
            }
          } else {
            this._data.push(elem);
          }
          this._changedData = true;
          this._changedLength = true;
        }
      }
      _unsetInternalPos(pos) {
        this._data.splice(pos, 1);
      }
      _sortData() {
        if (this._changedData) {
          this._data.sort(sortInternal);
        }
        this._changedData = false;
      }
      bitField() {
        const bytes = [];
        let pendingBitsForResultingByte = 8;
        let pendingBitsForNewByte = 0;
        let resultingByte = 0;
        let newByte;
        const pending = this._bitArrays.slice();
        while (pending.length || pendingBitsForNewByte) {
          if (pendingBitsForNewByte === 0) {
            newByte = pending.shift();
            pendingBitsForNewByte = 7;
          }
          const usingBits = Math.min(pendingBitsForNewByte, pendingBitsForResultingByte);
          const mask = ~(255 << usingBits);
          const masked = newByte & mask;
          resultingByte |= masked << 8 - pendingBitsForResultingByte;
          newByte = newByte >>> usingBits;
          pendingBitsForNewByte -= usingBits;
          pendingBitsForResultingByte -= usingBits;
          if (!pendingBitsForResultingByte || !pendingBitsForNewByte && !pending.length) {
            bytes.push(resultingByte);
            resultingByte = 0;
            pendingBitsForResultingByte = 8;
          }
        }
        for (var i = bytes.length - 1; i > 0; i--) {
          const value = bytes[i];
          if (value === 0) {
            bytes.pop();
          } else {
            break;
          }
        }
        return bytes;
      }
      compactArray() {
        this._sortData();
        return this._data.map(valueOnly);
      }
    };
    function popCountReduce(count, byte) {
      return count + popCount(byte);
    }
    function popCount(_v) {
      let v = _v;
      v = v - (v >> 1 & 1431655765);
      v = (v & 858993459) + (v >> 2 & 858993459);
      return (v + (v >> 4) & 252645135) * 16843009 >> 24;
    }
    function sortInternal(a, b) {
      return a[0] - b[0];
    }
    function valueOnly(elem) {
      return elem[1];
    }
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
    if (Object.create) {
      Events.prototype = /* @__PURE__ */ Object.create(null);
      if (!new Events().__proto__)
        prefix = false;
    }
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }
    function addListener(emitter, event, fn, context, once) {
      if (typeof fn !== "function") {
        throw new TypeError("The listener must be a function");
      }
      var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
      if (!emitter._events[evt])
        emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn)
        emitter._events[evt].push(listener);
      else
        emitter._events[evt] = [emitter._events[evt], listener];
      return emitter;
    }
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0)
        emitter._events = new Events();
      else
        delete emitter._events[evt];
    }
    function EventEmitter2() {
      this._events = new Events();
      this._eventsCount = 0;
    }
    EventEmitter2.prototype.eventNames = function eventNames() {
      var names = [], events, name8;
      if (this._eventsCount === 0)
        return names;
      for (name8 in events = this._events) {
        if (has.call(events, name8))
          names.push(prefix ? name8.slice(1) : name8);
      }
      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }
      return names;
    };
    EventEmitter2.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event, handlers = this._events[evt];
      if (!handlers)
        return [];
      if (handlers.fn)
        return [handlers.fn];
      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
      }
      return ee;
    };
    EventEmitter2.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event, listeners = this._events[evt];
      if (!listeners)
        return 0;
      if (listeners.fn)
        return 1;
      return listeners.length;
    };
    EventEmitter2.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt])
        return false;
      var listeners = this._events[evt], len = arguments.length, args, i;
      if (listeners.fn) {
        if (listeners.once)
          this.removeListener(event, listeners.fn, void 0, true);
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
        var length11 = listeners.length, j;
        for (i = 0; i < length11; i++) {
          if (listeners[i].once)
            this.removeListener(event, listeners[i].fn, void 0, true);
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
              if (!args)
                for (j = 1, args = new Array(len - 1); j < len; j++) {
                  args[j - 1] = arguments[j];
                }
              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }
      return true;
    };
    EventEmitter2.prototype.on = function on(event, fn, context) {
      return addListener(this, event, fn, context, false);
    };
    EventEmitter2.prototype.once = function once(event, fn, context) {
      return addListener(this, event, fn, context, true);
    };
    EventEmitter2.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt])
        return this;
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
        for (var i = 0, events = [], length11 = listeners.length; i < length11; i++) {
          if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
            events.push(listeners[i]);
          }
        }
        if (events.length)
          this._events[evt] = events.length === 1 ? events[0] : events;
        else
          clearEvent(this, evt);
      }
      return this;
    };
    EventEmitter2.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;
      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt])
          clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }
      return this;
    };
    EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
    EventEmitter2.prototype.addListener = EventEmitter2.prototype.on;
    EventEmitter2.prefixed = prefix;
    EventEmitter2.EventEmitter = EventEmitter2;
    if ("undefined" !== typeof module) {
      module.exports = EventEmitter2;
    }
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
    var defineProperty = (object, name8, value) => Object.defineProperty(object, name8, {
      value,
      writable: true,
      enumerable: true,
      configurable: true
    });
    var globalThis2 = exports;
    var defaultMergeOptions = {
      concatArrays: false,
      ignoreUndefined: false
    };
    var getEnumerableOwnPropertyKeys = (value) => {
      const keys = [];
      for (const key in value) {
        if (hasOwnProperty.call(value, key)) {
          keys.push(key);
        }
      }
      if (Object.getOwnPropertySymbols) {
        const symbols = Object.getOwnPropertySymbols(value);
        for (const symbol2 of symbols) {
          if (propertyIsEnumerable.call(value, symbol2)) {
            keys.push(symbol2);
          }
        }
      }
      return keys;
    };
    function clone(value) {
      if (Array.isArray(value)) {
        return cloneArray(value);
      }
      if (isOptionObject(value)) {
        return cloneOptionObject(value);
      }
      return value;
    }
    function cloneArray(array) {
      const result = array.slice(0, 0);
      getEnumerableOwnPropertyKeys(array).forEach((key) => {
        defineProperty(result, key, clone(array[key]));
      });
      return result;
    }
    function cloneOptionObject(object) {
      const result = Object.getPrototypeOf(object) === null ? /* @__PURE__ */ Object.create(null) : {};
      getEnumerableOwnPropertyKeys(object).forEach((key) => {
        defineProperty(result, key, clone(object[key]));
      });
      return result;
    }
    var mergeKeys = (merged, source, keys, config) => {
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
    };
    var concatArrays = (merged, source, config) => {
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
    };
    function merge2(merged, source, config) {
      if (config.concatArrays && Array.isArray(merged) && Array.isArray(source)) {
        return concatArrays(merged, source, config);
      }
      if (!isOptionObject(source) || !isOptionObject(merged)) {
        return clone(source);
      }
      return mergeKeys(merged, source, getEnumerableOwnPropertyKeys(source), config);
    }
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

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports, module) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
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
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name8) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name8 + (isPlural ? "s" : "");
    }
  }
});

// node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/debug/src/common.js"(exports, module) {
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce10;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug2(...args) {
          if (!debug2.enabled) {
            return;
          }
          const self = debug2;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self.diff = ms;
          self.prev = prevTime;
          self.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format10) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format10];
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
        debug2.namespace = namespace;
        debug2.useColors = createDebug.useColors();
        debug2.color = createDebug.selectColor(namespace);
        debug2.extend = extend;
        debug2.destroy = createDebug.destroy;
        Object.defineProperty(debug2, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug2);
        }
        return debug2;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        let i;
        const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
        const len = split.length;
        for (i = 0; i < len; i++) {
          if (!split[i]) {
            continue;
          }
          namespaces = split[i].replace(/\*/g, ".*?");
          if (namespaces[0] === "-") {
            createDebug.skips.push(new RegExp("^" + namespaces.slice(1) + "$"));
          } else {
            createDebug.names.push(new RegExp("^" + namespaces + "$"));
          }
        }
      }
      function disable() {
        const namespaces = [
          ...createDebug.names.map(toNamespace),
          ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name8) {
        if (name8[name8.length - 1] === "*") {
          return true;
        }
        let i;
        let len;
        for (i = 0, len = createDebug.skips.length; i < len; i++) {
          if (createDebug.skips[i].test(name8)) {
            return false;
          }
        }
        for (i = 0, len = createDebug.names.length; i < len; i++) {
          if (createDebug.names[i].test(name8)) {
            return true;
          }
        }
        return false;
      }
      function toNamespace(regexp) {
        return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
      }
      function coerce10(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module.exports = setup;
  }
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports, module) {
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = [
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
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      let m;
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
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
    exports.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports.storage.getItem("debug");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module.exports = require_common()(exports);
    var { formatters } = module.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// node_modules/ipfs-unixfs-importer/dist/src/index.js
var import_err_code4 = __toESM(require_err_code(), 1);

// node_modules/it-first/dist/src/index.js
function isAsyncIterable(thing) {
  return thing[Symbol.asyncIterator] != null;
}
function first(source) {
  if (isAsyncIterable(source)) {
    return (async () => {
      for await (const entry of source) {
        return entry;
      }
      return void 0;
    })();
  }
  for (const entry of source) {
    return entry;
  }
  return void 0;
}
var src_default = first;

// node_modules/it-batch/dist/src/index.js
function isAsyncIterable2(thing) {
  return thing[Symbol.asyncIterator] != null;
}
function batch(source, size = 1) {
  size = Number(size);
  if (isAsyncIterable2(source)) {
    return async function* () {
      let things = [];
      if (size < 1) {
        size = 1;
      }
      if (size !== Math.round(size)) {
        throw new Error("Batch size must be an integer");
      }
      for await (const thing of source) {
        things.push(thing);
        while (things.length >= size) {
          yield things.slice(0, size);
          things = things.slice(size);
        }
      }
      while (things.length > 0) {
        yield things.slice(0, size);
        things = things.slice(size);
      }
    }();
  }
  return function* () {
    let things = [];
    if (size < 1) {
      size = 1;
    }
    if (size !== Math.round(size)) {
      throw new Error("Batch size must be an integer");
    }
    for (const thing of source) {
      things.push(thing);
      while (things.length >= size) {
        yield things.slice(0, size);
        things = things.slice(size);
      }
    }
    while (things.length > 0) {
      yield things.slice(0, size);
      things = things.slice(size);
    }
  }();
}
var src_default2 = batch;

// node_modules/it-parallel-batch/dist/src/index.js
async function* parallelBatch(source, size = 1) {
  for await (const tasks of src_default2(source, size)) {
    const things = tasks.map(async (p) => {
      return p().then((value) => ({ ok: true, value }), (err) => ({ ok: false, err }));
    });
    for (let i = 0; i < things.length; i++) {
      const result = await things[i];
      if (result.ok) {
        yield result.value;
      } else {
        throw result.err;
      }
    }
  }
}

// node_modules/uint8arraylist/node_modules/uint8arrays/dist/src/alloc.js
function alloc(size = 0) {
  return new Uint8Array(size);
}
function allocUnsafe(size = 0) {
  return new Uint8Array(size);
}

// node_modules/uint8arraylist/node_modules/uint8arrays/dist/src/util/as-uint8array.js
function asUint8Array(buf3) {
  return buf3;
}

// node_modules/uint8arraylist/node_modules/uint8arrays/dist/src/concat.js
function concat(arrays, length11) {
  if (length11 == null) {
    length11 = arrays.reduce((acc, curr) => acc + curr.length, 0);
  }
  const output = allocUnsafe(length11);
  let offset = 0;
  for (const arr of arrays) {
    output.set(arr, offset);
    offset += arr.length;
  }
  return asUint8Array(output);
}

// node_modules/uint8arraylist/node_modules/uint8arrays/dist/src/equals.js
function equals(a, b) {
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

// node_modules/uint8arraylist/dist/src/index.js
var symbol = Symbol.for("@achingbrain/uint8arraylist");
function findBufAndOffset(bufs, index) {
  if (index == null || index < 0) {
    throw new RangeError("index is out of bounds");
  }
  let offset = 0;
  for (const buf3 of bufs) {
    const bufEnd = offset + buf3.byteLength;
    if (index < bufEnd) {
      return {
        buf: buf3,
        index: index - offset
      };
    }
    offset = bufEnd;
  }
  throw new RangeError("index is out of bounds");
}
function isUint8ArrayList(value) {
  return Boolean(value?.[symbol]);
}
var Uint8ArrayList = class _Uint8ArrayList {
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
    let length11 = 0;
    for (const buf3 of bufs) {
      if (buf3 instanceof Uint8Array) {
        length11 += buf3.byteLength;
        this.bufs.push(buf3);
      } else if (isUint8ArrayList(buf3)) {
        length11 += buf3.byteLength;
        this.bufs.push(...buf3.bufs);
      } else {
        throw new Error("Could not append value, must be an Uint8Array or a Uint8ArrayList");
      }
    }
    this.length += length11;
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
    let length11 = 0;
    for (const buf3 of bufs.reverse()) {
      if (buf3 instanceof Uint8Array) {
        length11 += buf3.byteLength;
        this.bufs.unshift(buf3);
      } else if (isUint8ArrayList(buf3)) {
        length11 += buf3.byteLength;
        this.bufs.unshift(...buf3.bufs);
      } else {
        throw new Error("Could not prepend value, must be an Uint8Array or a Uint8ArrayList");
      }
    }
    this.length += length11;
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
  write(buf3, offset = 0) {
    if (buf3 instanceof Uint8Array) {
      for (let i = 0; i < buf3.length; i++) {
        this.set(offset + i, buf3[i]);
      }
    } else if (isUint8ArrayList(buf3)) {
      for (let i = 0; i < buf3.length; i++) {
        this.set(offset + i, buf3.get(i));
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
    const { bufs, length: length11 } = this._subList(beginInclusive, endExclusive);
    return concat(bufs, length11);
  }
  /**
   * Returns a alloc from the given start and end element index.
   *
   * In the best case where the data extracted comes from a single Uint8Array
   * internally this is a no-copy operation otherwise it is a copy operation.
   */
  subarray(beginInclusive, endExclusive) {
    const { bufs, length: length11 } = this._subList(beginInclusive, endExclusive);
    if (bufs.length === 1) {
      return bufs[0];
    }
    return concat(bufs, length11);
  }
  /**
   * Returns a allocList from the given start and end element index.
   *
   * This is a no-copy operation.
   */
  sublist(beginInclusive, endExclusive) {
    const { bufs, length: length11 } = this._subList(beginInclusive, endExclusive);
    const list = new _Uint8ArrayList();
    list.length = length11;
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
      const buf3 = this.bufs[i];
      const bufStart = offset;
      const bufEnd = bufStart + buf3.byteLength;
      offset = bufEnd;
      if (beginInclusive >= bufEnd) {
        continue;
      }
      const sliceStartInBuf = beginInclusive >= bufStart && beginInclusive < bufEnd;
      const sliceEndsInBuf = endExclusive > bufStart && endExclusive <= bufEnd;
      if (sliceStartInBuf && sliceEndsInBuf) {
        if (beginInclusive === bufStart && endExclusive === bufEnd) {
          bufs.push(buf3);
          break;
        }
        const start = beginInclusive - bufStart;
        bufs.push(buf3.subarray(start, start + (endExclusive - beginInclusive)));
        break;
      }
      if (sliceStartInBuf) {
        if (beginInclusive === 0) {
          bufs.push(buf3);
          continue;
        }
        bufs.push(buf3.subarray(beginInclusive - bufStart));
        continue;
      }
      if (sliceEndsInBuf) {
        if (endExclusive === bufEnd) {
          bufs.push(buf3);
          break;
        }
        bufs.push(buf3.subarray(0, endExclusive - bufStart));
        break;
      }
      bufs.push(buf3);
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
    const buf3 = this.subarray(byteOffset, byteOffset + 1);
    const view = new DataView(buf3.buffer, buf3.byteOffset, buf3.byteLength);
    return view.getInt8(0);
  }
  setInt8(byteOffset, value) {
    const buf3 = allocUnsafe(1);
    const view = new DataView(buf3.buffer, buf3.byteOffset, buf3.byteLength);
    view.setInt8(0, value);
    this.write(buf3, byteOffset);
  }
  getInt16(byteOffset, littleEndian) {
    const buf3 = this.subarray(byteOffset, byteOffset + 2);
    const view = new DataView(buf3.buffer, buf3.byteOffset, buf3.byteLength);
    return view.getInt16(0, littleEndian);
  }
  setInt16(byteOffset, value, littleEndian) {
    const buf3 = alloc(2);
    const view = new DataView(buf3.buffer, buf3.byteOffset, buf3.byteLength);
    view.setInt16(0, value, littleEndian);
    this.write(buf3, byteOffset);
  }
  getInt32(byteOffset, littleEndian) {
    const buf3 = this.subarray(byteOffset, byteOffset + 4);
    const view = new DataView(buf3.buffer, buf3.byteOffset, buf3.byteLength);
    return view.getInt32(0, littleEndian);
  }
  setInt32(byteOffset, value, littleEndian) {
    const buf3 = alloc(4);
    const view = new DataView(buf3.buffer, buf3.byteOffset, buf3.byteLength);
    view.setInt32(0, value, littleEndian);
    this.write(buf3, byteOffset);
  }
  getBigInt64(byteOffset, littleEndian) {
    const buf3 = this.subarray(byteOffset, byteOffset + 8);
    const view = new DataView(buf3.buffer, buf3.byteOffset, buf3.byteLength);
    return view.getBigInt64(0, littleEndian);
  }
  setBigInt64(byteOffset, value, littleEndian) {
    const buf3 = alloc(8);
    const view = new DataView(buf3.buffer, buf3.byteOffset, buf3.byteLength);
    view.setBigInt64(0, value, littleEndian);
    this.write(buf3, byteOffset);
  }
  getUint8(byteOffset) {
    const buf3 = this.subarray(byteOffset, byteOffset + 1);
    const view = new DataView(buf3.buffer, buf3.byteOffset, buf3.byteLength);
    return view.getUint8(0);
  }
  setUint8(byteOffset, value) {
    const buf3 = allocUnsafe(1);
    const view = new DataView(buf3.buffer, buf3.byteOffset, buf3.byteLength);
    view.setUint8(0, value);
    this.write(buf3, byteOffset);
  }
  getUint16(byteOffset, littleEndian) {
    const buf3 = this.subarray(byteOffset, byteOffset + 2);
    const view = new DataView(buf3.buffer, buf3.byteOffset, buf3.byteLength);
    return view.getUint16(0, littleEndian);
  }
  setUint16(byteOffset, value, littleEndian) {
    const buf3 = alloc(2);
    const view = new DataView(buf3.buffer, buf3.byteOffset, buf3.byteLength);
    view.setUint16(0, value, littleEndian);
    this.write(buf3, byteOffset);
  }
  getUint32(byteOffset, littleEndian) {
    const buf3 = this.subarray(byteOffset, byteOffset + 4);
    const view = new DataView(buf3.buffer, buf3.byteOffset, buf3.byteLength);
    return view.getUint32(0, littleEndian);
  }
  setUint32(byteOffset, value, littleEndian) {
    const buf3 = alloc(4);
    const view = new DataView(buf3.buffer, buf3.byteOffset, buf3.byteLength);
    view.setUint32(0, value, littleEndian);
    this.write(buf3, byteOffset);
  }
  getBigUint64(byteOffset, littleEndian) {
    const buf3 = this.subarray(byteOffset, byteOffset + 8);
    const view = new DataView(buf3.buffer, buf3.byteOffset, buf3.byteLength);
    return view.getBigUint64(0, littleEndian);
  }
  setBigUint64(byteOffset, value, littleEndian) {
    const buf3 = alloc(8);
    const view = new DataView(buf3.buffer, buf3.byteOffset, buf3.byteLength);
    view.setBigUint64(0, value, littleEndian);
    this.write(buf3, byteOffset);
  }
  getFloat32(byteOffset, littleEndian) {
    const buf3 = this.subarray(byteOffset, byteOffset + 4);
    const view = new DataView(buf3.buffer, buf3.byteOffset, buf3.byteLength);
    return view.getFloat32(0, littleEndian);
  }
  setFloat32(byteOffset, value, littleEndian) {
    const buf3 = alloc(4);
    const view = new DataView(buf3.buffer, buf3.byteOffset, buf3.byteLength);
    view.setFloat32(0, value, littleEndian);
    this.write(buf3, byteOffset);
  }
  getFloat64(byteOffset, littleEndian) {
    const buf3 = this.subarray(byteOffset, byteOffset + 8);
    const view = new DataView(buf3.buffer, buf3.byteOffset, buf3.byteLength);
    return view.getFloat64(0, littleEndian);
  }
  setFloat64(byteOffset, value, littleEndian) {
    const buf3 = alloc(8);
    const view = new DataView(buf3.buffer, buf3.byteOffset, buf3.byteLength);
    view.setFloat64(0, value, littleEndian);
    this.write(buf3, byteOffset);
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
      if (!equals(this.bufs[i], other.bufs[i])) {
        return false;
      }
    }
    return true;
  }
  /**
   * Create a Uint8ArrayList from a pre-existing list of Uint8Arrays.  Use this
   * method if you know the total size of all the Uint8Arrays ahead of time.
   */
  static fromUint8Arrays(bufs, length11) {
    const list = new _Uint8ArrayList();
    list.bufs = bufs;
    if (length11 == null) {
      length11 = bufs.reduce((acc, curr) => acc + curr.byteLength, 0);
    }
    list.length = length11;
    return list;
  }
};

// node_modules/ipfs-unixfs-importer/dist/src/chunker/fixed-size.js
var DEFAULT_CHUNK_SIZE = 262144;
var fixedSize = (options = {}) => {
  const chunkSize = options.chunkSize ?? DEFAULT_CHUNK_SIZE;
  return async function* fixedSizeChunker(source) {
    let list = new Uint8ArrayList();
    let currentLength = 0;
    let emitted = false;
    for await (const buffer3 of source) {
      list.append(buffer3);
      currentLength += buffer3.length;
      while (currentLength >= chunkSize) {
        yield list.slice(0, chunkSize);
        emitted = true;
        if (chunkSize === list.length) {
          list = new Uint8ArrayList();
          currentLength = 0;
        } else {
          const newBl = new Uint8ArrayList();
          newBl.append(list.sublist(chunkSize));
          list = newBl;
          currentLength -= chunkSize;
        }
      }
    }
    if (!emitted || currentLength > 0) {
      yield list.subarray(0, currentLength);
    }
  };
};

// node_modules/@ipld/dag-pb/src/index.js
var src_exports = {};
__export(src_exports, {
  code: () => code,
  createLink: () => createLink,
  createNode: () => createNode,
  decode: () => decode5,
  encode: () => encode3,
  name: () => name,
  prepare: () => prepare,
  validate: () => validate
});

// node_modules/@ipld/dag-pb/node_modules/multiformats/dist/src/bytes.js
var empty = new Uint8Array(0);
function equals2(aa, bb) {
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

// node_modules/@ipld/dag-pb/node_modules/multiformats/dist/src/vendor/base-x.js
function base(ALPHABET, name8) {
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
  function encode33(source) {
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
    var length11 = 0;
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
      for (var it1 = size - 1; (carry !== 0 || i2 < length11) && it1 !== -1; it1--, i2++) {
        carry += 256 * b58[it1] >>> 0;
        b58[it1] = carry % BASE >>> 0;
        carry = carry / BASE >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length11 = i2;
      pbegin++;
    }
    var it2 = size - length11;
    while (it2 !== size && b58[it2] === 0) {
      it2++;
    }
    var str = LEADER.repeat(zeroes);
    for (; it2 < size; ++it2) {
      str += ALPHABET.charAt(b58[it2]);
    }
    return str;
  }
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
    var length11 = 0;
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
      for (var it3 = size - 1; (carry !== 0 || i2 < length11) && it3 !== -1; it3--, i2++) {
        carry += BASE * b256[it3] >>> 0;
        b256[it3] = carry % 256 >>> 0;
        carry = carry / 256 >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length11 = i2;
      psz++;
    }
    if (source[psz] === " ") {
      return;
    }
    var it4 = size - length11;
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
  function decode49(string5) {
    var buffer3 = decodeUnsafe(string5);
    if (buffer3) {
      return buffer3;
    }
    throw new Error(`Non-${name8} character`);
  }
  return {
    encode: encode33,
    decodeUnsafe,
    decode: decode49
  };
}
var src = base;
var _brrp__multiformats_scope_baseX = src;
var base_x_default = _brrp__multiformats_scope_baseX;

// node_modules/@ipld/dag-pb/node_modules/multiformats/dist/src/bases/base.js
var Encoder = class {
  name;
  prefix;
  baseEncode;
  constructor(name8, prefix, baseEncode) {
    this.name = name8;
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
  name;
  prefix;
  baseDecode;
  prefixCodePoint;
  constructor(name8, prefix, baseDecode) {
    this.name = name8;
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
  decoders;
  constructor(decoders) {
    this.decoders = decoders;
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
var Codec = class {
  name;
  prefix;
  baseEncode;
  baseDecode;
  encoder;
  decoder;
  constructor(name8, prefix, baseEncode, baseDecode) {
    this.name = name8;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
    this.baseDecode = baseDecode;
    this.encoder = new Encoder(name8, prefix, baseEncode);
    this.decoder = new Decoder(name8, prefix, baseDecode);
  }
  encode(input) {
    return this.encoder.encode(input);
  }
  decode(input) {
    return this.decoder.decode(input);
  }
};
function from({ name: name8, prefix, encode: encode33, decode: decode49 }) {
  return new Codec(name8, prefix, encode33, decode49);
}
function baseX({ name: name8, prefix, alphabet: alphabet5 }) {
  const { encode: encode33, decode: decode49 } = base_x_default(alphabet5, name8);
  return from({
    prefix,
    name: name8,
    encode: encode33,
    decode: (text) => coerce(decode49(text))
  });
}
function decode(string5, alphabet5, bitsPerChar, name8) {
  const codes = {};
  for (let i = 0; i < alphabet5.length; ++i) {
    codes[alphabet5[i]] = i;
  }
  let end = string5.length;
  while (string5[end - 1] === "=") {
    --end;
  }
  const out = new Uint8Array(end * bitsPerChar / 8 | 0);
  let bits = 0;
  let buffer3 = 0;
  let written = 0;
  for (let i = 0; i < end; ++i) {
    const value = codes[string5[i]];
    if (value === void 0) {
      throw new SyntaxError(`Non-${name8} character`);
    }
    buffer3 = buffer3 << bitsPerChar | value;
    bits += bitsPerChar;
    if (bits >= 8) {
      bits -= 8;
      out[written++] = 255 & buffer3 >> bits;
    }
  }
  if (bits >= bitsPerChar || (255 & buffer3 << 8 - bits) !== 0) {
    throw new SyntaxError("Unexpected end of data");
  }
  return out;
}
function encode(data, alphabet5, bitsPerChar) {
  const pad = alphabet5[alphabet5.length - 1] === "=";
  const mask = (1 << bitsPerChar) - 1;
  let out = "";
  let bits = 0;
  let buffer3 = 0;
  for (let i = 0; i < data.length; ++i) {
    buffer3 = buffer3 << 8 | data[i];
    bits += 8;
    while (bits > bitsPerChar) {
      bits -= bitsPerChar;
      out += alphabet5[mask & buffer3 >> bits];
    }
  }
  if (bits !== 0) {
    out += alphabet5[mask & buffer3 << bitsPerChar - bits];
  }
  if (pad) {
    while ((out.length * bitsPerChar & 7) !== 0) {
      out += "=";
    }
  }
  return out;
}
function rfc4648({ name: name8, prefix, bitsPerChar, alphabet: alphabet5 }) {
  return from({
    prefix,
    name: name8,
    encode(input) {
      return encode(input, alphabet5, bitsPerChar);
    },
    decode(input) {
      return decode(input, alphabet5, bitsPerChar, name8);
    }
  });
}

// node_modules/@ipld/dag-pb/node_modules/multiformats/dist/src/bases/base32.js
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

// node_modules/@ipld/dag-pb/node_modules/multiformats/dist/src/bases/base58.js
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

// node_modules/@ipld/dag-pb/node_modules/multiformats/dist/src/vendor/varint.js
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
var decode2 = read;
var MSB$1 = 128;
var REST$1 = 127;
function read(buf3, offset) {
  var res = 0, offset = offset || 0, shift = 0, counter = offset, b, l = buf3.length;
  do {
    if (counter >= l) {
      read.bytes = 0;
      throw new RangeError("Could not decode varint");
    }
    b = buf3[counter++];
    res += shift < 28 ? (b & REST$1) << shift : (b & REST$1) * Math.pow(2, shift);
    shift += 7;
  } while (b >= MSB$1);
  read.bytes = counter - offset;
  return res;
}
var N1 = Math.pow(2, 7);
var N2 = Math.pow(2, 14);
var N3 = Math.pow(2, 21);
var N4 = Math.pow(2, 28);
var N5 = Math.pow(2, 35);
var N6 = Math.pow(2, 42);
var N7 = Math.pow(2, 49);
var N8 = Math.pow(2, 56);
var N9 = Math.pow(2, 63);
var length = function(value) {
  return value < N1 ? 1 : value < N2 ? 2 : value < N3 ? 3 : value < N4 ? 4 : value < N5 ? 5 : value < N6 ? 6 : value < N7 ? 7 : value < N8 ? 8 : value < N9 ? 9 : 10;
};
var varint = {
  encode: encode_1,
  decode: decode2,
  encodingLength: length
};
var _brrp_varint = varint;
var varint_default = _brrp_varint;

// node_modules/@ipld/dag-pb/node_modules/multiformats/dist/src/varint.js
function decode3(data, offset = 0) {
  const code13 = varint_default.decode(data, offset);
  return [code13, varint_default.decode.bytes];
}
function encodeTo(int, target, offset = 0) {
  varint_default.encode(int, target, offset);
  return target;
}
function encodingLength(int) {
  return varint_default.encodingLength(int);
}

// node_modules/@ipld/dag-pb/node_modules/multiformats/dist/src/hashes/digest.js
function create(code13, digest6) {
  const size = digest6.byteLength;
  const sizeOffset = encodingLength(code13);
  const digestOffset = sizeOffset + encodingLength(size);
  const bytes = new Uint8Array(digestOffset + size);
  encodeTo(code13, bytes, 0);
  encodeTo(size, bytes, sizeOffset);
  bytes.set(digest6, digestOffset);
  return new Digest(code13, size, digest6, bytes);
}
function decode4(multihash) {
  const bytes = coerce(multihash);
  const [code13, sizeOffset] = decode3(bytes);
  const [size, digestOffset] = decode3(bytes.subarray(sizeOffset));
  const digest6 = bytes.subarray(sizeOffset + digestOffset);
  if (digest6.byteLength !== size) {
    throw new Error("Incorrect length");
  }
  return new Digest(code13, size, digest6, bytes);
}
function equals3(a, b) {
  if (a === b) {
    return true;
  } else {
    const data = b;
    return a.code === data.code && a.size === data.size && data.bytes instanceof Uint8Array && equals2(a.bytes, data.bytes);
  }
}
var Digest = class {
  code;
  size;
  digest;
  bytes;
  /**
   * Creates a multihash digest.
   */
  constructor(code13, size, digest6, bytes) {
    this.code = code13;
    this.size = size;
    this.digest = digest6;
    this.bytes = bytes;
  }
};

// node_modules/@ipld/dag-pb/node_modules/multiformats/dist/src/cid.js
function format(link, base12) {
  const { bytes, version } = link;
  switch (version) {
    case 0:
      return toStringV0(bytes, baseCache(link), base12 ?? base58btc.encoder);
    default:
      return toStringV1(bytes, baseCache(link), base12 ?? base32.encoder);
  }
}
var cache = /* @__PURE__ */ new WeakMap();
function baseCache(cid) {
  const baseCache10 = cache.get(cid);
  if (baseCache10 == null) {
    const baseCache11 = /* @__PURE__ */ new Map();
    cache.set(cid, baseCache11);
    return baseCache11;
  }
  return baseCache10;
}
var CID = class _CID {
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
  constructor(version, code13, multihash, bytes) {
    this.code = code13;
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
        const { code: code13, multihash } = this;
        if (code13 !== DAG_PB_CODE) {
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
        const { code: code13, digest: digest6 } = this.multihash;
        const multihash = create(code13, digest6);
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
    return unknown != null && self.code === unknown.code && self.version === unknown.version && equals3(self.multihash, unknown.multihash);
  }
  toString(base12) {
    return format(this, base12);
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
      const { version, code: code13, multihash, bytes } = value;
      return new _CID(version, code13, multihash, bytes ?? encodeCID(version, code13, multihash.bytes));
    } else if (value[cidSymbol] === true) {
      const { version, multihash, code: code13 } = value;
      const digest6 = decode4(multihash);
      return _CID.create(version, code13, digest6);
    } else {
      return null;
    }
  }
  /**
   * @param version - Version of the CID
   * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
   * @param digest - (Multi)hash of the of the content.
   */
  static create(version, code13, digest6) {
    if (typeof code13 !== "number") {
      throw new Error("String codecs are no longer supported");
    }
    if (!(digest6.bytes instanceof Uint8Array)) {
      throw new Error("Invalid digest");
    }
    switch (version) {
      case 0: {
        if (code13 !== DAG_PB_CODE) {
          throw new Error(`Version 0 CID must use dag-pb (code: ${DAG_PB_CODE}) block encoding`);
        } else {
          return new _CID(version, code13, digest6, digest6.bytes);
        }
      }
      case 1: {
        const bytes = encodeCID(version, code13, digest6.bytes);
        return new _CID(version, code13, digest6, bytes);
      }
      default: {
        throw new Error("Invalid version");
      }
    }
  }
  /**
   * Simplified version of `create` for CIDv0.
   */
  static createV0(digest6) {
    return _CID.create(0, DAG_PB_CODE, digest6);
  }
  /**
   * Simplified version of `create` for CIDv1.
   *
   * @param code - Content encoding format code.
   * @param digest - Multihash of the content.
   */
  static createV1(code13, digest6) {
    return _CID.create(1, code13, digest6);
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
    const digest6 = new Digest(specs.multihashCode, specs.digestSize, digestBytes, multihashBytes);
    const cid = specs.version === 0 ? _CID.createV0(digest6) : _CID.createV1(specs.codec, digest6);
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
    const next = () => {
      const [i, length11] = decode3(initialBytes.subarray(offset));
      offset += length11;
      return i;
    };
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
  static parse(source, base12) {
    const [prefix, bytes] = parseCIDtoBytes(source, base12);
    const cid = _CID.decode(bytes);
    if (cid.version === 0 && source[0] !== "Q") {
      throw Error("Version 0 CID string must not include multibase prefix");
    }
    baseCache(cid).set(prefix, source);
    return cid;
  }
};
function parseCIDtoBytes(source, base12) {
  switch (source[0]) {
    case "Q": {
      const decoder = base12 ?? base58btc;
      return [
        base58btc.prefix,
        decoder.decode(`${base58btc.prefix}${source}`)
      ];
    }
    case base58btc.prefix: {
      const decoder = base12 ?? base58btc;
      return [base58btc.prefix, decoder.decode(source)];
    }
    case base32.prefix: {
      const decoder = base12 ?? base32;
      return [base32.prefix, decoder.decode(source)];
    }
    default: {
      if (base12 == null) {
        throw Error("To parse non base32 or base58btc encoded CID multibase decoder must be provided");
      }
      return [source[0], base12.decode(source)];
    }
  }
}
function toStringV0(bytes, cache10, base12) {
  const { prefix } = base12;
  if (prefix !== base58btc.prefix) {
    throw Error(`Cannot string encode V0 in ${base12.name} encoding`);
  }
  const cid = cache10.get(prefix);
  if (cid == null) {
    const cid2 = base12.encode(bytes).slice(1);
    cache10.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
function toStringV1(bytes, cache10, base12) {
  const { prefix } = base12;
  const cid = cache10.get(prefix);
  if (cid == null) {
    const cid2 = base12.encode(bytes);
    cache10.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
var DAG_PB_CODE = 112;
var SHA_256_CODE = 18;
function encodeCID(version, code13, multihash) {
  const codeOffset = encodingLength(version);
  const hashOffset = codeOffset + encodingLength(code13);
  const bytes = new Uint8Array(hashOffset + multihash.byteLength);
  encodeTo(version, bytes, 0);
  encodeTo(code13, bytes, codeOffset);
  bytes.set(multihash, hashOffset);
  return bytes;
}
var cidSymbol = Symbol.for("@ipld/js-cid/CID");

// node_modules/@ipld/dag-pb/src/pb-decode.js
var textDecoder = new TextDecoder();
function decodeVarint(bytes, offset) {
  let v = 0;
  for (let shift = 0; ; shift += 7) {
    if (shift >= 64) {
      throw new Error("protobuf: varint overflow");
    }
    if (offset >= bytes.length) {
      throw new Error("protobuf: unexpected end of data");
    }
    const b = bytes[offset++];
    v += shift < 28 ? (b & 127) << shift : (b & 127) * 2 ** shift;
    if (b < 128) {
      break;
    }
  }
  return [v, offset];
}
function decodeBytes(bytes, offset) {
  let byteLen;
  [byteLen, offset] = decodeVarint(bytes, offset);
  const postOffset = offset + byteLen;
  if (byteLen < 0 || postOffset < 0) {
    throw new Error("protobuf: invalid length");
  }
  if (postOffset > bytes.length) {
    throw new Error("protobuf: unexpected end of data");
  }
  return [bytes.subarray(offset, postOffset), postOffset];
}
function decodeKey(bytes, index) {
  let wire;
  [wire, index] = decodeVarint(bytes, index);
  return [wire & 7, wire >> 3, index];
}
function decodeLink(bytes) {
  const link = {};
  const l = bytes.length;
  let index = 0;
  while (index < l) {
    let wireType, fieldNum;
    [wireType, fieldNum, index] = decodeKey(bytes, index);
    if (fieldNum === 1) {
      if (link.Hash) {
        throw new Error("protobuf: (PBLink) duplicate Hash section");
      }
      if (wireType !== 2) {
        throw new Error(`protobuf: (PBLink) wrong wireType (${wireType}) for Hash`);
      }
      if (link.Name !== void 0) {
        throw new Error("protobuf: (PBLink) invalid order, found Name before Hash");
      }
      if (link.Tsize !== void 0) {
        throw new Error("protobuf: (PBLink) invalid order, found Tsize before Hash");
      }
      [link.Hash, index] = decodeBytes(bytes, index);
    } else if (fieldNum === 2) {
      if (link.Name !== void 0) {
        throw new Error("protobuf: (PBLink) duplicate Name section");
      }
      if (wireType !== 2) {
        throw new Error(`protobuf: (PBLink) wrong wireType (${wireType}) for Name`);
      }
      if (link.Tsize !== void 0) {
        throw new Error("protobuf: (PBLink) invalid order, found Tsize before Name");
      }
      let byts;
      [byts, index] = decodeBytes(bytes, index);
      link.Name = textDecoder.decode(byts);
    } else if (fieldNum === 3) {
      if (link.Tsize !== void 0) {
        throw new Error("protobuf: (PBLink) duplicate Tsize section");
      }
      if (wireType !== 0) {
        throw new Error(`protobuf: (PBLink) wrong wireType (${wireType}) for Tsize`);
      }
      [link.Tsize, index] = decodeVarint(bytes, index);
    } else {
      throw new Error(`protobuf: (PBLink) invalid fieldNumber, expected 1, 2 or 3, got ${fieldNum}`);
    }
  }
  if (index > l) {
    throw new Error("protobuf: (PBLink) unexpected end of data");
  }
  return link;
}
function decodeNode(bytes) {
  const l = bytes.length;
  let index = 0;
  let links = void 0;
  let linksBeforeData = false;
  let data = void 0;
  while (index < l) {
    let wireType, fieldNum;
    [wireType, fieldNum, index] = decodeKey(bytes, index);
    if (wireType !== 2) {
      throw new Error(`protobuf: (PBNode) invalid wireType, expected 2, got ${wireType}`);
    }
    if (fieldNum === 1) {
      if (data) {
        throw new Error("protobuf: (PBNode) duplicate Data section");
      }
      [data, index] = decodeBytes(bytes, index);
      if (links) {
        linksBeforeData = true;
      }
    } else if (fieldNum === 2) {
      if (linksBeforeData) {
        throw new Error("protobuf: (PBNode) duplicate Links section");
      } else if (!links) {
        links = [];
      }
      let byts;
      [byts, index] = decodeBytes(bytes, index);
      links.push(decodeLink(byts));
    } else {
      throw new Error(`protobuf: (PBNode) invalid fieldNumber, expected 1 or 2, got ${fieldNum}`);
    }
  }
  if (index > l) {
    throw new Error("protobuf: (PBNode) unexpected end of data");
  }
  const node = {};
  if (data) {
    node.Data = data;
  }
  node.Links = links || [];
  return node;
}

// node_modules/@ipld/dag-pb/src/pb-encode.js
var textEncoder = new TextEncoder();
var maxInt32 = 2 ** 32;
var maxUInt32 = 2 ** 31;
function encodeLink(link, bytes) {
  let i = bytes.length;
  if (typeof link.Tsize === "number") {
    if (link.Tsize < 0) {
      throw new Error("Tsize cannot be negative");
    }
    if (!Number.isSafeInteger(link.Tsize)) {
      throw new Error("Tsize too large for encoding");
    }
    i = encodeVarint(bytes, i, link.Tsize) - 1;
    bytes[i] = 24;
  }
  if (typeof link.Name === "string") {
    const nameBytes = textEncoder.encode(link.Name);
    i -= nameBytes.length;
    bytes.set(nameBytes, i);
    i = encodeVarint(bytes, i, nameBytes.length) - 1;
    bytes[i] = 18;
  }
  if (link.Hash) {
    i -= link.Hash.length;
    bytes.set(link.Hash, i);
    i = encodeVarint(bytes, i, link.Hash.length) - 1;
    bytes[i] = 10;
  }
  return bytes.length - i;
}
function encodeNode(node) {
  const size = sizeNode(node);
  const bytes = new Uint8Array(size);
  let i = size;
  if (node.Data) {
    i -= node.Data.length;
    bytes.set(node.Data, i);
    i = encodeVarint(bytes, i, node.Data.length) - 1;
    bytes[i] = 10;
  }
  if (node.Links) {
    for (let index = node.Links.length - 1; index >= 0; index--) {
      const size2 = encodeLink(node.Links[index], bytes.subarray(0, i));
      i -= size2;
      i = encodeVarint(bytes, i, size2) - 1;
      bytes[i] = 18;
    }
  }
  return bytes;
}
function sizeLink(link) {
  let n = 0;
  if (link.Hash) {
    const l = link.Hash.length;
    n += 1 + l + sov(l);
  }
  if (typeof link.Name === "string") {
    const l = textEncoder.encode(link.Name).length;
    n += 1 + l + sov(l);
  }
  if (typeof link.Tsize === "number") {
    n += 1 + sov(link.Tsize);
  }
  return n;
}
function sizeNode(node) {
  let n = 0;
  if (node.Data) {
    const l = node.Data.length;
    n += 1 + l + sov(l);
  }
  if (node.Links) {
    for (const link of node.Links) {
      const l = sizeLink(link);
      n += 1 + l + sov(l);
    }
  }
  return n;
}
function encodeVarint(bytes, offset, v) {
  offset -= sov(v);
  const base12 = offset;
  while (v >= maxUInt32) {
    bytes[offset++] = v & 127 | 128;
    v /= 128;
  }
  while (v >= 128) {
    bytes[offset++] = v & 127 | 128;
    v >>>= 7;
  }
  bytes[offset] = v;
  return base12;
}
function sov(x) {
  if (x % 2 === 0) {
    x++;
  }
  return Math.floor((len64(x) + 6) / 7);
}
function len64(x) {
  let n = 0;
  if (x >= maxInt32) {
    x = Math.floor(x / maxInt32);
    n = 32;
  }
  if (x >= 1 << 16) {
    x >>>= 16;
    n += 16;
  }
  if (x >= 1 << 8) {
    x >>>= 8;
    n += 8;
  }
  return n + len8tab[x];
}
var len8tab = [
  0,
  1,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  6,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8
];

// node_modules/@ipld/dag-pb/src/util.js
var pbNodeProperties = ["Data", "Links"];
var pbLinkProperties = ["Hash", "Name", "Tsize"];
var textEncoder2 = new TextEncoder();
function linkComparator(a, b) {
  if (a === b) {
    return 0;
  }
  const abuf = a.Name ? textEncoder2.encode(a.Name) : [];
  const bbuf = b.Name ? textEncoder2.encode(b.Name) : [];
  let x = abuf.length;
  let y = bbuf.length;
  for (let i = 0, len = Math.min(x, y); i < len; ++i) {
    if (abuf[i] !== bbuf[i]) {
      x = abuf[i];
      y = bbuf[i];
      break;
    }
  }
  return x < y ? -1 : y < x ? 1 : 0;
}
function hasOnlyProperties(node, properties) {
  return !Object.keys(node).some((p) => !properties.includes(p));
}
function asLink(link) {
  if (typeof link.asCID === "object") {
    const Hash = CID.asCID(link);
    if (!Hash) {
      throw new TypeError("Invalid DAG-PB form");
    }
    return { Hash };
  }
  if (typeof link !== "object" || Array.isArray(link)) {
    throw new TypeError("Invalid DAG-PB form");
  }
  const pbl = {};
  if (link.Hash) {
    let cid = CID.asCID(link.Hash);
    try {
      if (!cid) {
        if (typeof link.Hash === "string") {
          cid = CID.parse(link.Hash);
        } else if (link.Hash instanceof Uint8Array) {
          cid = CID.decode(link.Hash);
        }
      }
    } catch (e) {
      throw new TypeError(`Invalid DAG-PB form: ${e.message}`);
    }
    if (cid) {
      pbl.Hash = cid;
    }
  }
  if (!pbl.Hash) {
    throw new TypeError("Invalid DAG-PB form");
  }
  if (typeof link.Name === "string") {
    pbl.Name = link.Name;
  }
  if (typeof link.Tsize === "number") {
    pbl.Tsize = link.Tsize;
  }
  return pbl;
}
function prepare(node) {
  if (node instanceof Uint8Array || typeof node === "string") {
    node = { Data: node };
  }
  if (typeof node !== "object" || Array.isArray(node)) {
    throw new TypeError("Invalid DAG-PB form");
  }
  const pbn = {};
  if (node.Data !== void 0) {
    if (typeof node.Data === "string") {
      pbn.Data = textEncoder2.encode(node.Data);
    } else if (node.Data instanceof Uint8Array) {
      pbn.Data = node.Data;
    } else {
      throw new TypeError("Invalid DAG-PB form");
    }
  }
  if (node.Links !== void 0) {
    if (Array.isArray(node.Links)) {
      pbn.Links = node.Links.map(asLink);
      pbn.Links.sort(linkComparator);
    } else {
      throw new TypeError("Invalid DAG-PB form");
    }
  } else {
    pbn.Links = [];
  }
  return pbn;
}
function validate(node) {
  if (!node || typeof node !== "object" || Array.isArray(node) || node instanceof Uint8Array || node["/"] && node["/"] === node.bytes) {
    throw new TypeError("Invalid DAG-PB form");
  }
  if (!hasOnlyProperties(node, pbNodeProperties)) {
    throw new TypeError("Invalid DAG-PB form (extraneous properties)");
  }
  if (node.Data !== void 0 && !(node.Data instanceof Uint8Array)) {
    throw new TypeError("Invalid DAG-PB form (Data must be bytes)");
  }
  if (!Array.isArray(node.Links)) {
    throw new TypeError("Invalid DAG-PB form (Links must be a list)");
  }
  for (let i = 0; i < node.Links.length; i++) {
    const link = node.Links[i];
    if (!link || typeof link !== "object" || Array.isArray(link) || link instanceof Uint8Array || link["/"] && link["/"] === link.bytes) {
      throw new TypeError("Invalid DAG-PB form (bad link)");
    }
    if (!hasOnlyProperties(link, pbLinkProperties)) {
      throw new TypeError("Invalid DAG-PB form (extraneous properties on link)");
    }
    if (link.Hash === void 0) {
      throw new TypeError("Invalid DAG-PB form (link must have a Hash)");
    }
    if (link.Hash == null || !link.Hash["/"] || link.Hash["/"] !== link.Hash.bytes) {
      throw new TypeError("Invalid DAG-PB form (link Hash must be a CID)");
    }
    if (link.Name !== void 0 && typeof link.Name !== "string") {
      throw new TypeError("Invalid DAG-PB form (link Name must be a string)");
    }
    if (link.Tsize !== void 0) {
      if (typeof link.Tsize !== "number" || link.Tsize % 1 !== 0) {
        throw new TypeError("Invalid DAG-PB form (link Tsize must be an integer)");
      }
      if (link.Tsize < 0) {
        throw new TypeError("Invalid DAG-PB form (link Tsize cannot be negative)");
      }
    }
    if (i > 0 && linkComparator(link, node.Links[i - 1]) === -1) {
      throw new TypeError("Invalid DAG-PB form (links must be sorted by Name bytes)");
    }
  }
}
function createNode(data, links = []) {
  return prepare({ Data: data, Links: links });
}
function createLink(name8, size, cid) {
  return asLink({ Hash: cid, Name: name8, Tsize: size });
}
function toByteView(buf3) {
  if (buf3 instanceof ArrayBuffer) {
    return new Uint8Array(buf3, 0, buf3.byteLength);
  }
  return buf3;
}

// node_modules/@ipld/dag-pb/src/index.js
var name = "dag-pb";
var code = 112;
function encode3(node) {
  validate(node);
  const pbn = {};
  if (node.Links) {
    pbn.Links = node.Links.map((l) => {
      const link = {};
      if (l.Hash) {
        link.Hash = l.Hash.bytes;
      }
      if (l.Name !== void 0) {
        link.Name = l.Name;
      }
      if (l.Tsize !== void 0) {
        link.Tsize = l.Tsize;
      }
      return link;
    });
  }
  if (node.Data) {
    pbn.Data = node.Data;
  }
  return encodeNode(pbn);
}
function decode5(bytes) {
  const buf3 = toByteView(bytes);
  const pbn = decodeNode(buf3);
  const node = {};
  if (pbn.Data) {
    node.Data = pbn.Data;
  }
  if (pbn.Links) {
    node.Links = pbn.Links.map((l) => {
      const link = {};
      try {
        link.Hash = CID.decode(l.Hash);
      } catch (e) {
      }
      if (!link.Hash) {
        throw new Error("Invalid Hash field found in link, expected CID");
      }
      if (l.Name !== void 0) {
        link.Name = l.Name;
      }
      if (l.Tsize !== void 0) {
        link.Tsize = l.Tsize;
      }
      return link;
    });
  }
  return node;
}

// node_modules/ipfs-unixfs/dist/src/index.js
var import_err_code = __toESM(require_err_code(), 1);

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
function encodeUint8Array(value, buf3, offset = 0) {
  switch (encodingLength2(value)) {
    case 8: {
      buf3[offset++] = value & 255 | MSB2;
      value /= 128;
    }
    case 7: {
      buf3[offset++] = value & 255 | MSB2;
      value /= 128;
    }
    case 6: {
      buf3[offset++] = value & 255 | MSB2;
      value /= 128;
    }
    case 5: {
      buf3[offset++] = value & 255 | MSB2;
      value /= 128;
    }
    case 4: {
      buf3[offset++] = value & 255 | MSB2;
      value >>>= 7;
    }
    case 3: {
      buf3[offset++] = value & 255 | MSB2;
      value >>>= 7;
    }
    case 2: {
      buf3[offset++] = value & 255 | MSB2;
      value >>>= 7;
    }
    case 1: {
      buf3[offset++] = value & 255;
      value >>>= 7;
      break;
    }
    default:
      throw new Error("unreachable");
  }
  return buf3;
}
function decodeUint8Array(buf3, offset) {
  let b = buf3[offset];
  let res = 0;
  res += b & REST2;
  if (b < MSB2) {
    return res;
  }
  b = buf3[offset + 1];
  res += (b & REST2) << 7;
  if (b < MSB2) {
    return res;
  }
  b = buf3[offset + 2];
  res += (b & REST2) << 14;
  if (b < MSB2) {
    return res;
  }
  b = buf3[offset + 3];
  res += (b & REST2) << 21;
  if (b < MSB2) {
    return res;
  }
  b = buf3[offset + 4];
  res += (b & REST2) * N42;
  if (b < MSB2) {
    return res;
  }
  b = buf3[offset + 5];
  res += (b & REST2) * N52;
  if (b < MSB2) {
    return res;
  }
  b = buf3[offset + 6];
  res += (b & REST2) * N62;
  if (b < MSB2) {
    return res;
  }
  b = buf3[offset + 7];
  res += (b & REST2) * N72;
  if (b < MSB2) {
    return res;
  }
  throw new RangeError("Could not decode varint");
}

// node_modules/protons-runtime/dist/src/utils/float.js
var f32 = new Float32Array([-0]);
var f8b = new Uint8Array(f32.buffer);
function writeFloatLE(val, buf3, pos) {
  f32[0] = val;
  buf3[pos] = f8b[0];
  buf3[pos + 1] = f8b[1];
  buf3[pos + 2] = f8b[2];
  buf3[pos + 3] = f8b[3];
}
function readFloatLE(buf3, pos) {
  f8b[0] = buf3[pos];
  f8b[1] = buf3[pos + 1];
  f8b[2] = buf3[pos + 2];
  f8b[3] = buf3[pos + 3];
  return f32[0];
}
var f64 = new Float64Array([-0]);
var d8b = new Uint8Array(f64.buffer);
function writeDoubleLE(val, buf3, pos) {
  f64[0] = val;
  buf3[pos] = d8b[0];
  buf3[pos + 1] = d8b[1];
  buf3[pos + 2] = d8b[2];
  buf3[pos + 3] = d8b[3];
  buf3[pos + 4] = d8b[4];
  buf3[pos + 5] = d8b[5];
  buf3[pos + 6] = d8b[6];
  buf3[pos + 7] = d8b[7];
}
function readDoubleLE(buf3, pos) {
  d8b[0] = buf3[pos];
  d8b[1] = buf3[pos + 1];
  d8b[2] = buf3[pos + 2];
  d8b[3] = buf3[pos + 3];
  d8b[4] = buf3[pos + 4];
  d8b[5] = buf3[pos + 5];
  d8b[6] = buf3[pos + 6];
  d8b[7] = buf3[pos + 7];
  return f64[0];
}

// node_modules/protons-runtime/dist/src/utils/longbits.js
var MAX_SAFE_NUMBER_INTEGER = BigInt(Number.MAX_SAFE_INTEGER);
var MIN_SAFE_NUMBER_INTEGER = BigInt(Number.MIN_SAFE_INTEGER);
var LongBits = class _LongBits {
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
function length2(string5) {
  let len = 0;
  let c = 0;
  for (let i = 0; i < string5.length; ++i) {
    c = string5.charCodeAt(i);
    if (c < 128) {
      len += 1;
    } else if (c < 2048) {
      len += 2;
    } else if ((c & 64512) === 55296 && (string5.charCodeAt(i + 1) & 64512) === 56320) {
      ++i;
      len += 4;
    } else {
      len += 3;
    }
  }
  return len;
}
function read2(buffer3, start, end) {
  const len = end - start;
  if (len < 1) {
    return "";
  }
  let parts;
  const chunk = [];
  let i = 0;
  let t;
  while (start < end) {
    t = buffer3[start++];
    if (t < 128) {
      chunk[i++] = t;
    } else if (t > 191 && t < 224) {
      chunk[i++] = (t & 31) << 6 | buffer3[start++] & 63;
    } else if (t > 239 && t < 365) {
      t = ((t & 7) << 18 | (buffer3[start++] & 63) << 12 | (buffer3[start++] & 63) << 6 | buffer3[start++] & 63) - 65536;
      chunk[i++] = 55296 + (t >> 10);
      chunk[i++] = 56320 + (t & 1023);
    } else {
      chunk[i++] = (t & 15) << 12 | (buffer3[start++] & 63) << 6 | buffer3[start++] & 63;
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
function write(string5, buffer3, offset) {
  const start = offset;
  let c1;
  let c2;
  for (let i = 0; i < string5.length; ++i) {
    c1 = string5.charCodeAt(i);
    if (c1 < 128) {
      buffer3[offset++] = c1;
    } else if (c1 < 2048) {
      buffer3[offset++] = c1 >> 6 | 192;
      buffer3[offset++] = c1 & 63 | 128;
    } else if ((c1 & 64512) === 55296 && ((c2 = string5.charCodeAt(i + 1)) & 64512) === 56320) {
      c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
      ++i;
      buffer3[offset++] = c1 >> 18 | 240;
      buffer3[offset++] = c1 >> 12 & 63 | 128;
      buffer3[offset++] = c1 >> 6 & 63 | 128;
      buffer3[offset++] = c1 & 63 | 128;
    } else {
      buffer3[offset++] = c1 >> 12 | 224;
      buffer3[offset++] = c1 >> 6 & 63 | 128;
      buffer3[offset++] = c1 & 63 | 128;
    }
  }
  return offset - start;
}

// node_modules/protons-runtime/dist/src/utils/reader.js
function indexOutOfRange(reader, writeLength) {
  return RangeError(`index out of range: ${reader.pos} + ${writeLength ?? 1} > ${reader.len}`);
}
function readFixed32End(buf3, end) {
  return (buf3[end - 4] | buf3[end - 3] << 8 | buf3[end - 2] << 16 | buf3[end - 1] << 24) >>> 0;
}
var Uint8ArrayReader = class {
  buf;
  pos;
  len;
  _slice = Uint8Array.prototype.subarray;
  constructor(buffer3) {
    this.buf = buffer3;
    this.pos = 0;
    this.len = buffer3.length;
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
    const length11 = this.uint32();
    const start = this.pos;
    const end = this.pos + length11;
    if (end > this.len) {
      throw indexOutOfRange(this, length11);
    }
    this.pos += length11;
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
  skip(length11) {
    if (typeof length11 === "number") {
      if (this.pos + length11 > this.len) {
        throw indexOutOfRange(this, length11);
      }
      this.pos += length11;
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
function createReader(buf3) {
  return new Uint8ArrayReader(buf3 instanceof Uint8Array ? buf3 : buf3.subarray());
}

// node_modules/protons-runtime/dist/src/decode.js
function decodeMessage(buf3, codec, opts) {
  const reader = createReader(buf3);
  return codec.decode(reader, void 0, opts);
}

// node_modules/protons-runtime/node_modules/uint8arrays/dist/src/alloc.js
function allocUnsafe3(size = 0) {
  return new Uint8Array(size);
}

// node_modules/protons-runtime/node_modules/multiformats/dist/src/bases/base10.js
var base10_exports = {};
__export(base10_exports, {
  base10: () => base10
});

// node_modules/protons-runtime/node_modules/multiformats/dist/src/bytes.js
var empty2 = new Uint8Array(0);
function equals4(aa, bb) {
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
function coerce2(o) {
  if (o instanceof Uint8Array && o.constructor.name === "Uint8Array")
    return o;
  if (o instanceof ArrayBuffer)
    return new Uint8Array(o);
  if (ArrayBuffer.isView(o)) {
    return new Uint8Array(o.buffer, o.byteOffset, o.byteLength);
  }
  throw new Error("Unknown type, must be binary type");
}
function fromString(str) {
  return new TextEncoder().encode(str);
}
function toString(b) {
  return new TextDecoder().decode(b);
}

// node_modules/protons-runtime/node_modules/multiformats/dist/src/vendor/base-x.js
function base2(ALPHABET, name8) {
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
  function encode33(source) {
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
    var length11 = 0;
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
      for (var it1 = size - 1; (carry !== 0 || i2 < length11) && it1 !== -1; it1--, i2++) {
        carry += 256 * b58[it1] >>> 0;
        b58[it1] = carry % BASE >>> 0;
        carry = carry / BASE >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length11 = i2;
      pbegin++;
    }
    var it2 = size - length11;
    while (it2 !== size && b58[it2] === 0) {
      it2++;
    }
    var str = LEADER.repeat(zeroes);
    for (; it2 < size; ++it2) {
      str += ALPHABET.charAt(b58[it2]);
    }
    return str;
  }
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
    var length11 = 0;
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
      for (var it3 = size - 1; (carry !== 0 || i2 < length11) && it3 !== -1; it3--, i2++) {
        carry += BASE * b256[it3] >>> 0;
        b256[it3] = carry % 256 >>> 0;
        carry = carry / 256 >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length11 = i2;
      psz++;
    }
    if (source[psz] === " ") {
      return;
    }
    var it4 = size - length11;
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
  function decode49(string5) {
    var buffer3 = decodeUnsafe(string5);
    if (buffer3) {
      return buffer3;
    }
    throw new Error(`Non-${name8} character`);
  }
  return {
    encode: encode33,
    decodeUnsafe,
    decode: decode49
  };
}
var src2 = base2;
var _brrp__multiformats_scope_baseX2 = src2;
var base_x_default2 = _brrp__multiformats_scope_baseX2;

// node_modules/protons-runtime/node_modules/multiformats/dist/src/bases/base.js
var Encoder2 = class {
  name;
  prefix;
  baseEncode;
  constructor(name8, prefix, baseEncode) {
    this.name = name8;
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
var Decoder2 = class {
  name;
  prefix;
  baseDecode;
  prefixCodePoint;
  constructor(name8, prefix, baseDecode) {
    this.name = name8;
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
    return or2(this, decoder);
  }
};
var ComposedDecoder2 = class {
  decoders;
  constructor(decoders) {
    this.decoders = decoders;
  }
  or(decoder) {
    return or2(this, decoder);
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
function or2(left, right) {
  return new ComposedDecoder2({
    ...left.decoders ?? { [left.prefix]: left },
    ...right.decoders ?? { [right.prefix]: right }
  });
}
var Codec2 = class {
  name;
  prefix;
  baseEncode;
  baseDecode;
  encoder;
  decoder;
  constructor(name8, prefix, baseEncode, baseDecode) {
    this.name = name8;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
    this.baseDecode = baseDecode;
    this.encoder = new Encoder2(name8, prefix, baseEncode);
    this.decoder = new Decoder2(name8, prefix, baseDecode);
  }
  encode(input) {
    return this.encoder.encode(input);
  }
  decode(input) {
    return this.decoder.decode(input);
  }
};
function from2({ name: name8, prefix, encode: encode33, decode: decode49 }) {
  return new Codec2(name8, prefix, encode33, decode49);
}
function baseX2({ name: name8, prefix, alphabet: alphabet5 }) {
  const { encode: encode33, decode: decode49 } = base_x_default2(alphabet5, name8);
  return from2({
    prefix,
    name: name8,
    encode: encode33,
    decode: (text) => coerce2(decode49(text))
  });
}
function decode6(string5, alphabet5, bitsPerChar, name8) {
  const codes = {};
  for (let i = 0; i < alphabet5.length; ++i) {
    codes[alphabet5[i]] = i;
  }
  let end = string5.length;
  while (string5[end - 1] === "=") {
    --end;
  }
  const out = new Uint8Array(end * bitsPerChar / 8 | 0);
  let bits = 0;
  let buffer3 = 0;
  let written = 0;
  for (let i = 0; i < end; ++i) {
    const value = codes[string5[i]];
    if (value === void 0) {
      throw new SyntaxError(`Non-${name8} character`);
    }
    buffer3 = buffer3 << bitsPerChar | value;
    bits += bitsPerChar;
    if (bits >= 8) {
      bits -= 8;
      out[written++] = 255 & buffer3 >> bits;
    }
  }
  if (bits >= bitsPerChar || (255 & buffer3 << 8 - bits) !== 0) {
    throw new SyntaxError("Unexpected end of data");
  }
  return out;
}
function encode4(data, alphabet5, bitsPerChar) {
  const pad = alphabet5[alphabet5.length - 1] === "=";
  const mask = (1 << bitsPerChar) - 1;
  let out = "";
  let bits = 0;
  let buffer3 = 0;
  for (let i = 0; i < data.length; ++i) {
    buffer3 = buffer3 << 8 | data[i];
    bits += 8;
    while (bits > bitsPerChar) {
      bits -= bitsPerChar;
      out += alphabet5[mask & buffer3 >> bits];
    }
  }
  if (bits !== 0) {
    out += alphabet5[mask & buffer3 << bitsPerChar - bits];
  }
  if (pad) {
    while ((out.length * bitsPerChar & 7) !== 0) {
      out += "=";
    }
  }
  return out;
}
function rfc46482({ name: name8, prefix, bitsPerChar, alphabet: alphabet5 }) {
  return from2({
    prefix,
    name: name8,
    encode(input) {
      return encode4(input, alphabet5, bitsPerChar);
    },
    decode(input) {
      return decode6(input, alphabet5, bitsPerChar, name8);
    }
  });
}

// node_modules/protons-runtime/node_modules/multiformats/dist/src/bases/base10.js
var base10 = baseX2({
  prefix: "9",
  name: "base10",
  alphabet: "0123456789"
});

// node_modules/protons-runtime/node_modules/multiformats/dist/src/bases/base16.js
var base16_exports = {};
__export(base16_exports, {
  base16: () => base16,
  base16upper: () => base16upper
});
var base16 = rfc46482({
  prefix: "f",
  name: "base16",
  alphabet: "0123456789abcdef",
  bitsPerChar: 4
});
var base16upper = rfc46482({
  prefix: "F",
  name: "base16upper",
  alphabet: "0123456789ABCDEF",
  bitsPerChar: 4
});

// node_modules/protons-runtime/node_modules/multiformats/dist/src/bases/base2.js
var base2_exports = {};
__export(base2_exports, {
  base2: () => base22
});
var base22 = rfc46482({
  prefix: "0",
  name: "base2",
  alphabet: "01",
  bitsPerChar: 1
});

// node_modules/protons-runtime/node_modules/multiformats/dist/src/bases/base256emoji.js
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
function encode5(data) {
  return data.reduce((p, c) => {
    p += alphabetBytesToChars[c];
    return p;
  }, "");
}
function decode7(str) {
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
var base256emoji = from2({
  prefix: "\u{1F680}",
  name: "base256emoji",
  encode: encode5,
  decode: decode7
});

// node_modules/protons-runtime/node_modules/multiformats/dist/src/bases/base32.js
var base32_exports = {};
__export(base32_exports, {
  base32: () => base322,
  base32hex: () => base32hex2,
  base32hexpad: () => base32hexpad2,
  base32hexpadupper: () => base32hexpadupper2,
  base32hexupper: () => base32hexupper2,
  base32pad: () => base32pad2,
  base32padupper: () => base32padupper2,
  base32upper: () => base32upper2,
  base32z: () => base32z2
});
var base322 = rfc46482({
  prefix: "b",
  name: "base32",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567",
  bitsPerChar: 5
});
var base32upper2 = rfc46482({
  prefix: "B",
  name: "base32upper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
  bitsPerChar: 5
});
var base32pad2 = rfc46482({
  prefix: "c",
  name: "base32pad",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
  bitsPerChar: 5
});
var base32padupper2 = rfc46482({
  prefix: "C",
  name: "base32padupper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
  bitsPerChar: 5
});
var base32hex2 = rfc46482({
  prefix: "v",
  name: "base32hex",
  alphabet: "0123456789abcdefghijklmnopqrstuv",
  bitsPerChar: 5
});
var base32hexupper2 = rfc46482({
  prefix: "V",
  name: "base32hexupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
  bitsPerChar: 5
});
var base32hexpad2 = rfc46482({
  prefix: "t",
  name: "base32hexpad",
  alphabet: "0123456789abcdefghijklmnopqrstuv=",
  bitsPerChar: 5
});
var base32hexpadupper2 = rfc46482({
  prefix: "T",
  name: "base32hexpadupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
  bitsPerChar: 5
});
var base32z2 = rfc46482({
  prefix: "h",
  name: "base32z",
  alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
  bitsPerChar: 5
});

// node_modules/protons-runtime/node_modules/multiformats/dist/src/bases/base36.js
var base36_exports = {};
__export(base36_exports, {
  base36: () => base36,
  base36upper: () => base36upper
});
var base36 = baseX2({
  prefix: "k",
  name: "base36",
  alphabet: "0123456789abcdefghijklmnopqrstuvwxyz"
});
var base36upper = baseX2({
  prefix: "K",
  name: "base36upper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
});

// node_modules/protons-runtime/node_modules/multiformats/dist/src/bases/base58.js
var base58_exports = {};
__export(base58_exports, {
  base58btc: () => base58btc2,
  base58flickr: () => base58flickr2
});
var base58btc2 = baseX2({
  name: "base58btc",
  prefix: "z",
  alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
});
var base58flickr2 = baseX2({
  name: "base58flickr",
  prefix: "Z",
  alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
});

// node_modules/protons-runtime/node_modules/multiformats/dist/src/bases/base64.js
var base64_exports = {};
__export(base64_exports, {
  base64: () => base64,
  base64pad: () => base64pad,
  base64url: () => base64url,
  base64urlpad: () => base64urlpad
});
var base64 = rfc46482({
  prefix: "m",
  name: "base64",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
  bitsPerChar: 6
});
var base64pad = rfc46482({
  prefix: "M",
  name: "base64pad",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  bitsPerChar: 6
});
var base64url = rfc46482({
  prefix: "u",
  name: "base64url",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
  bitsPerChar: 6
});
var base64urlpad = rfc46482({
  prefix: "U",
  name: "base64urlpad",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
  bitsPerChar: 6
});

// node_modules/protons-runtime/node_modules/multiformats/dist/src/bases/base8.js
var base8_exports = {};
__export(base8_exports, {
  base8: () => base8
});
var base8 = rfc46482({
  prefix: "7",
  name: "base8",
  alphabet: "01234567",
  bitsPerChar: 3
});

// node_modules/protons-runtime/node_modules/multiformats/dist/src/bases/identity.js
var identity_exports = {};
__export(identity_exports, {
  identity: () => identity
});
var identity = from2({
  prefix: "\0",
  name: "identity",
  encode: (buf3) => toString(buf3),
  decode: (str) => fromString(str)
});

// node_modules/protons-runtime/node_modules/multiformats/dist/src/codecs/json.js
var textEncoder3 = new TextEncoder();
var textDecoder2 = new TextDecoder();

// node_modules/protons-runtime/node_modules/multiformats/dist/src/hashes/identity.js
var identity_exports2 = {};
__export(identity_exports2, {
  identity: () => identity2
});

// node_modules/protons-runtime/node_modules/multiformats/dist/src/vendor/varint.js
var encode_12 = encode6;
var MSB3 = 128;
var REST3 = 127;
var MSBALL2 = ~REST3;
var INT2 = Math.pow(2, 31);
function encode6(num, out, offset) {
  out = out || [];
  offset = offset || 0;
  var oldOffset = offset;
  while (num >= INT2) {
    out[offset++] = num & 255 | MSB3;
    num /= 128;
  }
  while (num & MSBALL2) {
    out[offset++] = num & 255 | MSB3;
    num >>>= 7;
  }
  out[offset] = num | 0;
  encode6.bytes = offset - oldOffset + 1;
  return out;
}
var decode8 = read3;
var MSB$12 = 128;
var REST$12 = 127;
function read3(buf3, offset) {
  var res = 0, offset = offset || 0, shift = 0, counter = offset, b, l = buf3.length;
  do {
    if (counter >= l) {
      read3.bytes = 0;
      throw new RangeError("Could not decode varint");
    }
    b = buf3[counter++];
    res += shift < 28 ? (b & REST$12) << shift : (b & REST$12) * Math.pow(2, shift);
    shift += 7;
  } while (b >= MSB$12);
  read3.bytes = counter - offset;
  return res;
}
var N13 = Math.pow(2, 7);
var N23 = Math.pow(2, 14);
var N33 = Math.pow(2, 21);
var N43 = Math.pow(2, 28);
var N53 = Math.pow(2, 35);
var N63 = Math.pow(2, 42);
var N73 = Math.pow(2, 49);
var N82 = Math.pow(2, 56);
var N92 = Math.pow(2, 63);
var length3 = function(value) {
  return value < N13 ? 1 : value < N23 ? 2 : value < N33 ? 3 : value < N43 ? 4 : value < N53 ? 5 : value < N63 ? 6 : value < N73 ? 7 : value < N82 ? 8 : value < N92 ? 9 : 10;
};
var varint2 = {
  encode: encode_12,
  decode: decode8,
  encodingLength: length3
};
var _brrp_varint2 = varint2;
var varint_default2 = _brrp_varint2;

// node_modules/protons-runtime/node_modules/multiformats/dist/src/varint.js
function decode9(data, offset = 0) {
  const code13 = varint_default2.decode(data, offset);
  return [code13, varint_default2.decode.bytes];
}
function encodeTo2(int, target, offset = 0) {
  varint_default2.encode(int, target, offset);
  return target;
}
function encodingLength3(int) {
  return varint_default2.encodingLength(int);
}

// node_modules/protons-runtime/node_modules/multiformats/dist/src/hashes/digest.js
function create2(code13, digest6) {
  const size = digest6.byteLength;
  const sizeOffset = encodingLength3(code13);
  const digestOffset = sizeOffset + encodingLength3(size);
  const bytes = new Uint8Array(digestOffset + size);
  encodeTo2(code13, bytes, 0);
  encodeTo2(size, bytes, sizeOffset);
  bytes.set(digest6, digestOffset);
  return new Digest2(code13, size, digest6, bytes);
}
function decode10(multihash) {
  const bytes = coerce2(multihash);
  const [code13, sizeOffset] = decode9(bytes);
  const [size, digestOffset] = decode9(bytes.subarray(sizeOffset));
  const digest6 = bytes.subarray(sizeOffset + digestOffset);
  if (digest6.byteLength !== size) {
    throw new Error("Incorrect length");
  }
  return new Digest2(code13, size, digest6, bytes);
}
function equals5(a, b) {
  if (a === b) {
    return true;
  } else {
    const data = b;
    return a.code === data.code && a.size === data.size && data.bytes instanceof Uint8Array && equals4(a.bytes, data.bytes);
  }
}
var Digest2 = class {
  code;
  size;
  digest;
  bytes;
  /**
   * Creates a multihash digest.
   */
  constructor(code13, size, digest6, bytes) {
    this.code = code13;
    this.size = size;
    this.digest = digest6;
    this.bytes = bytes;
  }
};

// node_modules/protons-runtime/node_modules/multiformats/dist/src/hashes/identity.js
var code2 = 0;
var name2 = "identity";
var encode7 = coerce2;
function digest(input) {
  return create2(code2, encode7(input));
}
var identity2 = { code: code2, name: name2, encode: encode7, digest };

// node_modules/protons-runtime/node_modules/multiformats/dist/src/hashes/sha2-browser.js
var sha2_browser_exports = {};
__export(sha2_browser_exports, {
  sha256: () => sha256,
  sha512: () => sha512
});

// node_modules/protons-runtime/node_modules/multiformats/dist/src/hashes/hasher.js
function from3({ name: name8, code: code13, encode: encode33 }) {
  return new Hasher(name8, code13, encode33);
}
var Hasher = class {
  name;
  code;
  encode;
  constructor(name8, code13, encode33) {
    this.name = name8;
    this.code = code13;
    this.encode = encode33;
  }
  digest(input) {
    if (input instanceof Uint8Array) {
      const result = this.encode(input);
      return result instanceof Uint8Array ? create2(this.code, result) : result.then((digest6) => create2(this.code, digest6));
    } else {
      throw Error("Unknown type, must be binary type");
    }
  }
};

// node_modules/protons-runtime/node_modules/multiformats/dist/src/hashes/sha2-browser.js
function sha(name8) {
  return async (data) => new Uint8Array(await crypto.subtle.digest(name8, data));
}
var sha256 = from3({
  name: "sha2-256",
  code: 18,
  encode: sha("SHA-256")
});
var sha512 = from3({
  name: "sha2-512",
  code: 19,
  encode: sha("SHA-512")
});

// node_modules/protons-runtime/node_modules/multiformats/dist/src/cid.js
function format2(link, base12) {
  const { bytes, version } = link;
  switch (version) {
    case 0:
      return toStringV02(bytes, baseCache2(link), base12 ?? base58btc2.encoder);
    default:
      return toStringV12(bytes, baseCache2(link), base12 ?? base322.encoder);
  }
}
var cache2 = /* @__PURE__ */ new WeakMap();
function baseCache2(cid) {
  const baseCache10 = cache2.get(cid);
  if (baseCache10 == null) {
    const baseCache11 = /* @__PURE__ */ new Map();
    cache2.set(cid, baseCache11);
    return baseCache11;
  }
  return baseCache10;
}
var CID2 = class _CID {
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
  constructor(version, code13, multihash, bytes) {
    this.code = code13;
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
        const { code: code13, multihash } = this;
        if (code13 !== DAG_PB_CODE2) {
          throw new Error("Cannot convert a non dag-pb CID to CIDv0");
        }
        if (multihash.code !== SHA_256_CODE2) {
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
        const { code: code13, digest: digest6 } = this.multihash;
        const multihash = create2(code13, digest6);
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
    return unknown != null && self.code === unknown.code && self.version === unknown.version && equals5(self.multihash, unknown.multihash);
  }
  toString(base12) {
    return format2(this, base12);
  }
  toJSON() {
    return { "/": format2(this) };
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
      const { version, code: code13, multihash, bytes } = value;
      return new _CID(version, code13, multihash, bytes ?? encodeCID2(version, code13, multihash.bytes));
    } else if (value[cidSymbol2] === true) {
      const { version, multihash, code: code13 } = value;
      const digest6 = decode10(multihash);
      return _CID.create(version, code13, digest6);
    } else {
      return null;
    }
  }
  /**
   * @param version - Version of the CID
   * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
   * @param digest - (Multi)hash of the of the content.
   */
  static create(version, code13, digest6) {
    if (typeof code13 !== "number") {
      throw new Error("String codecs are no longer supported");
    }
    if (!(digest6.bytes instanceof Uint8Array)) {
      throw new Error("Invalid digest");
    }
    switch (version) {
      case 0: {
        if (code13 !== DAG_PB_CODE2) {
          throw new Error(`Version 0 CID must use dag-pb (code: ${DAG_PB_CODE2}) block encoding`);
        } else {
          return new _CID(version, code13, digest6, digest6.bytes);
        }
      }
      case 1: {
        const bytes = encodeCID2(version, code13, digest6.bytes);
        return new _CID(version, code13, digest6, bytes);
      }
      default: {
        throw new Error("Invalid version");
      }
    }
  }
  /**
   * Simplified version of `create` for CIDv0.
   */
  static createV0(digest6) {
    return _CID.create(0, DAG_PB_CODE2, digest6);
  }
  /**
   * Simplified version of `create` for CIDv1.
   *
   * @param code - Content encoding format code.
   * @param digest - Multihash of the content.
   */
  static createV1(code13, digest6) {
    return _CID.create(1, code13, digest6);
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
    const multihashBytes = coerce2(bytes.subarray(prefixSize, prefixSize + specs.multihashSize));
    if (multihashBytes.byteLength !== specs.multihashSize) {
      throw new Error("Incorrect length");
    }
    const digestBytes = multihashBytes.subarray(specs.multihashSize - specs.digestSize);
    const digest6 = new Digest2(specs.multihashCode, specs.digestSize, digestBytes, multihashBytes);
    const cid = specs.version === 0 ? _CID.createV0(digest6) : _CID.createV1(specs.codec, digest6);
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
    const next = () => {
      const [i, length11] = decode9(initialBytes.subarray(offset));
      offset += length11;
      return i;
    };
    let version = next();
    let codec = DAG_PB_CODE2;
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
  static parse(source, base12) {
    const [prefix, bytes] = parseCIDtoBytes2(source, base12);
    const cid = _CID.decode(bytes);
    if (cid.version === 0 && source[0] !== "Q") {
      throw Error("Version 0 CID string must not include multibase prefix");
    }
    baseCache2(cid).set(prefix, source);
    return cid;
  }
};
function parseCIDtoBytes2(source, base12) {
  switch (source[0]) {
    case "Q": {
      const decoder = base12 ?? base58btc2;
      return [
        base58btc2.prefix,
        decoder.decode(`${base58btc2.prefix}${source}`)
      ];
    }
    case base58btc2.prefix: {
      const decoder = base12 ?? base58btc2;
      return [base58btc2.prefix, decoder.decode(source)];
    }
    case base322.prefix: {
      const decoder = base12 ?? base322;
      return [base322.prefix, decoder.decode(source)];
    }
    default: {
      if (base12 == null) {
        throw Error("To parse non base32 or base58btc encoded CID multibase decoder must be provided");
      }
      return [source[0], base12.decode(source)];
    }
  }
}
function toStringV02(bytes, cache10, base12) {
  const { prefix } = base12;
  if (prefix !== base58btc2.prefix) {
    throw Error(`Cannot string encode V0 in ${base12.name} encoding`);
  }
  const cid = cache10.get(prefix);
  if (cid == null) {
    const cid2 = base12.encode(bytes).slice(1);
    cache10.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
function toStringV12(bytes, cache10, base12) {
  const { prefix } = base12;
  const cid = cache10.get(prefix);
  if (cid == null) {
    const cid2 = base12.encode(bytes);
    cache10.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
var DAG_PB_CODE2 = 112;
var SHA_256_CODE2 = 18;
function encodeCID2(version, code13, multihash) {
  const codeOffset = encodingLength3(version);
  const hashOffset = codeOffset + encodingLength3(code13);
  const bytes = new Uint8Array(hashOffset + multihash.byteLength);
  encodeTo2(version, bytes, 0);
  encodeTo2(code13, bytes, codeOffset);
  bytes.set(multihash, hashOffset);
  return bytes;
}
var cidSymbol2 = Symbol.for("@ipld/js-cid/CID");

// node_modules/protons-runtime/node_modules/multiformats/dist/src/basics.js
var bases = { ...identity_exports, ...base2_exports, ...base8_exports, ...base10_exports, ...base16_exports, ...base32_exports, ...base36_exports, ...base58_exports, ...base64_exports, ...base256emoji_exports };
var hashes = { ...sha2_browser_exports, ...identity_exports2 };

// node_modules/protons-runtime/node_modules/uint8arrays/dist/src/util/bases.js
function createCodec(name8, prefix, encode33, decode49) {
  return {
    name: name8,
    prefix,
    encoder: {
      name: name8,
      prefix,
      encode: encode33
    },
    decoder: {
      decode: decode49
    }
  };
}
var string = createCodec("utf8", "u", (buf3) => {
  const decoder = new TextDecoder("utf8");
  return "u" + decoder.decode(buf3);
}, (str) => {
  const encoder = new TextEncoder();
  return encoder.encode(str.substring(1));
});
var ascii = createCodec("ascii", "a", (buf3) => {
  let string5 = "a";
  for (let i = 0; i < buf3.length; i++) {
    string5 += String.fromCharCode(buf3[i]);
  }
  return string5;
}, (str) => {
  str = str.substring(1);
  const buf3 = allocUnsafe3(str.length);
  for (let i = 0; i < str.length; i++) {
    buf3[i] = str.charCodeAt(i);
  }
  return buf3;
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

// node_modules/protons-runtime/node_modules/uint8arrays/dist/src/from-string.js
function fromString2(string5, encoding = "utf8") {
  const base12 = bases_default[encoding];
  if (base12 == null) {
    throw new Error(`Unsupported encoding "${encoding}"`);
  }
  return base12.decoder.decode(`${base12.prefix}${string5}`);
}

// node_modules/protons-runtime/dist/src/utils/pool.js
function pool(size) {
  const SIZE = size ?? 8192;
  const MAX = SIZE >>> 1;
  let slab;
  let offset = SIZE;
  return function poolAlloc(size2) {
    if (size2 < 1 || size2 > MAX) {
      return allocUnsafe3(size2);
    }
    if (offset + size2 > SIZE) {
      slab = allocUnsafe3(SIZE);
      offset = 0;
    }
    const buf3 = slab.subarray(offset, offset += size2);
    if ((offset & 7) !== 0) {
      offset = (offset | 7) + 1;
    }
    return buf3;
  };
}

// node_modules/protons-runtime/dist/src/utils/writer.js
var Op = class {
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
var State = class {
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
    return allocUnsafe3(size);
  }
  return bufferPool(size);
}
var Uint8ArrayWriter = class {
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
    const buf3 = alloc2(this.len);
    let pos = 0;
    while (head != null) {
      head.fn(head.val, buf3, pos);
      pos += head.len;
      head = head.next;
    }
    return buf3;
  }
};
function writeByte(val, buf3, pos) {
  buf3[pos] = val & 255;
}
function writeVarint32(val, buf3, pos) {
  while (val > 127) {
    buf3[pos++] = val & 127 | 128;
    val >>>= 7;
  }
  buf3[pos] = val;
}
var VarintOp = class extends Op {
  next;
  constructor(len, val) {
    super(writeVarint32, len, val);
    this.next = void 0;
  }
};
function writeVarint64(val, buf3, pos) {
  while (val.hi !== 0) {
    buf3[pos++] = val.lo & 127 | 128;
    val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
    val.hi >>>= 7;
  }
  while (val.lo > 127) {
    buf3[pos++] = val.lo & 127 | 128;
    val.lo = val.lo >>> 7;
  }
  buf3[pos++] = val.lo;
}
function writeFixed32(val, buf3, pos) {
  buf3[pos] = val & 255;
  buf3[pos + 1] = val >>> 8 & 255;
  buf3[pos + 2] = val >>> 16 & 255;
  buf3[pos + 3] = val >>> 24;
}
function writeBytes(val, buf3, pos) {
  buf3.set(val, pos);
}
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
function writeBytesBuffer(val, buf3, pos) {
  buf3.set(val, pos);
}
function writeStringBuffer(val, buf3, pos) {
  if (val.length < 40) {
    write(val, buf3, pos);
  } else if (buf3.utf8Write != null) {
    buf3.utf8Write(val, pos);
  } else {
    buf3.set(fromString2(val), pos);
  }
}
function createWriter() {
  return new Uint8ArrayWriter();
}

// node_modules/protons-runtime/dist/src/encode.js
function encodeMessage(message2, codec) {
  const w = createWriter();
  codec.encode(message2, w, {
    lengthDelimited: false
  });
  return w.finish();
}

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
function createCodec2(name8, type, encode33, decode49) {
  return {
    name: name8,
    type,
    encode: encode33,
    decode: decode49
  };
}

// node_modules/protons-runtime/dist/src/codecs/enum.js
function enumeration(v) {
  function findValue(val) {
    if (v[val.toString()] == null) {
      throw new Error("Invalid enum value");
    }
    return v[val];
  }
  const encode33 = function enumEncode(val, writer) {
    const enumValue = findValue(val);
    writer.int32(enumValue);
  };
  const decode49 = function enumDecode(reader) {
    const val = reader.int32();
    return findValue(val);
  };
  return createCodec2("enum", CODEC_TYPES.VARINT, encode33, decode49);
}

// node_modules/protons-runtime/dist/src/codecs/message.js
function message(encode33, decode49) {
  return createCodec2("message", CODEC_TYPES.LENGTH_DELIMITED, encode33, decode49);
}

// node_modules/ipfs-unixfs/dist/src/unixfs.js
var Data;
(function(Data2) {
  let DataType;
  (function(DataType2) {
    DataType2["Raw"] = "Raw";
    DataType2["Directory"] = "Directory";
    DataType2["File"] = "File";
    DataType2["Metadata"] = "Metadata";
    DataType2["Symlink"] = "Symlink";
    DataType2["HAMTShard"] = "HAMTShard";
  })(DataType = Data2.DataType || (Data2.DataType = {}));
  let __DataTypeValues;
  (function(__DataTypeValues2) {
    __DataTypeValues2[__DataTypeValues2["Raw"] = 0] = "Raw";
    __DataTypeValues2[__DataTypeValues2["Directory"] = 1] = "Directory";
    __DataTypeValues2[__DataTypeValues2["File"] = 2] = "File";
    __DataTypeValues2[__DataTypeValues2["Metadata"] = 3] = "Metadata";
    __DataTypeValues2[__DataTypeValues2["Symlink"] = 4] = "Symlink";
    __DataTypeValues2[__DataTypeValues2["HAMTShard"] = 5] = "HAMTShard";
  })(__DataTypeValues || (__DataTypeValues = {}));
  (function(DataType2) {
    DataType2.codec = () => {
      return enumeration(__DataTypeValues);
    };
  })(DataType = Data2.DataType || (Data2.DataType = {}));
  let _codec;
  Data2.codec = () => {
    if (_codec == null) {
      _codec = message((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork();
        }
        if (obj.Type != null) {
          w.uint32(8);
          Data2.DataType.codec().encode(obj.Type, w);
        }
        if (obj.Data != null) {
          w.uint32(18);
          w.bytes(obj.Data);
        }
        if (obj.filesize != null) {
          w.uint32(24);
          w.uint64(obj.filesize);
        }
        if (obj.blocksizes != null) {
          for (const value of obj.blocksizes) {
            w.uint32(32);
            w.uint64(value);
          }
        }
        if (obj.hashType != null) {
          w.uint32(40);
          w.uint64(obj.hashType);
        }
        if (obj.fanout != null) {
          w.uint32(48);
          w.uint64(obj.fanout);
        }
        if (obj.mode != null) {
          w.uint32(56);
          w.uint32(obj.mode);
        }
        if (obj.mtime != null) {
          w.uint32(66);
          UnixTime.codec().encode(obj.mtime, w);
        }
        if (opts.lengthDelimited !== false) {
          w.ldelim();
        }
      }, (reader, length11) => {
        const obj = {
          blocksizes: []
        };
        const end = length11 == null ? reader.len : reader.pos + length11;
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              obj.Type = Data2.DataType.codec().decode(reader);
              break;
            case 2:
              obj.Data = reader.bytes();
              break;
            case 3:
              obj.filesize = reader.uint64();
              break;
            case 4:
              obj.blocksizes.push(reader.uint64());
              break;
            case 5:
              obj.hashType = reader.uint64();
              break;
            case 6:
              obj.fanout = reader.uint64();
              break;
            case 7:
              obj.mode = reader.uint32();
              break;
            case 8:
              obj.mtime = UnixTime.codec().decode(reader, reader.uint32());
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
  Data2.encode = (obj) => {
    return encodeMessage(obj, Data2.codec());
  };
  Data2.decode = (buf3) => {
    return decodeMessage(buf3, Data2.codec());
  };
})(Data || (Data = {}));
var UnixTime;
(function(UnixTime2) {
  let _codec;
  UnixTime2.codec = () => {
    if (_codec == null) {
      _codec = message((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork();
        }
        if (obj.Seconds != null) {
          w.uint32(8);
          w.int64(obj.Seconds);
        }
        if (obj.FractionalNanoseconds != null) {
          w.uint32(21);
          w.fixed32(obj.FractionalNanoseconds);
        }
        if (opts.lengthDelimited !== false) {
          w.ldelim();
        }
      }, (reader, length11) => {
        const obj = {};
        const end = length11 == null ? reader.len : reader.pos + length11;
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              obj.Seconds = reader.int64();
              break;
            case 2:
              obj.FractionalNanoseconds = reader.fixed32();
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
  UnixTime2.encode = (obj) => {
    return encodeMessage(obj, UnixTime2.codec());
  };
  UnixTime2.decode = (buf3) => {
    return decodeMessage(buf3, UnixTime2.codec());
  };
})(UnixTime || (UnixTime = {}));
var Metadata;
(function(Metadata2) {
  let _codec;
  Metadata2.codec = () => {
    if (_codec == null) {
      _codec = message((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork();
        }
        if (obj.MimeType != null) {
          w.uint32(10);
          w.string(obj.MimeType);
        }
        if (opts.lengthDelimited !== false) {
          w.ldelim();
        }
      }, (reader, length11) => {
        const obj = {};
        const end = length11 == null ? reader.len : reader.pos + length11;
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              obj.MimeType = reader.string();
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
  Metadata2.encode = (obj) => {
    return encodeMessage(obj, Metadata2.codec());
  };
  Metadata2.decode = (buf3) => {
    return decodeMessage(buf3, Metadata2.codec());
  };
})(Metadata || (Metadata = {}));

// node_modules/ipfs-unixfs/dist/src/index.js
var types = {
  Raw: "raw",
  Directory: "directory",
  File: "file",
  Metadata: "metadata",
  Symlink: "symlink",
  HAMTShard: "hamt-sharded-directory"
};
var dirTypes = [
  "directory",
  "hamt-sharded-directory"
];
var DEFAULT_FILE_MODE = parseInt("0644", 8);
var DEFAULT_DIRECTORY_MODE = parseInt("0755", 8);
var UnixFS = class _UnixFS {
  /**
   * Decode from protobuf https://github.com/ipfs/specs/blob/master/UNIXFS.md
   */
  static unmarshal(marshaled) {
    const message2 = Data.decode(marshaled);
    const data = new _UnixFS({
      type: types[message2.Type != null ? message2.Type.toString() : "File"],
      data: message2.Data,
      blockSizes: message2.blocksizes,
      mode: message2.mode,
      mtime: message2.mtime != null ? {
        secs: message2.mtime.Seconds ?? 0n,
        nsecs: message2.mtime.FractionalNanoseconds
      } : void 0,
      fanout: message2.fanout
    });
    data._originalMode = message2.mode ?? 0;
    return data;
  }
  type;
  data;
  blockSizes;
  hashType;
  fanout;
  mtime;
  _mode;
  _originalMode;
  constructor(options = {
    type: "file"
  }) {
    const { type, data, blockSizes, hashType, fanout, mtime, mode } = options;
    if (type != null && !Object.values(types).includes(type)) {
      throw (0, import_err_code.default)(new Error("Type: " + type + " is not valid"), "ERR_INVALID_TYPE");
    }
    this.type = type ?? "file";
    this.data = data;
    this.hashType = hashType;
    this.fanout = fanout;
    this.blockSizes = blockSizes ?? [];
    this._originalMode = 0;
    this.mode = mode;
    this.mtime = mtime;
  }
  set mode(mode) {
    if (mode == null) {
      this._mode = this.isDirectory() ? DEFAULT_DIRECTORY_MODE : DEFAULT_FILE_MODE;
    } else {
      this._mode = mode & 4095;
    }
  }
  get mode() {
    return this._mode;
  }
  isDirectory() {
    return dirTypes.includes(this.type);
  }
  addBlockSize(size) {
    this.blockSizes.push(size);
  }
  removeBlockSize(index) {
    this.blockSizes.splice(index, 1);
  }
  /**
   * Returns `0n` for directories or `data.length + sum(blockSizes)` for everything else
   */
  fileSize() {
    if (this.isDirectory()) {
      return 0n;
    }
    let sum = 0n;
    this.blockSizes.forEach((size) => {
      sum += size;
    });
    if (this.data != null) {
      sum += BigInt(this.data.length);
    }
    return sum;
  }
  /**
   * encode to protobuf Uint8Array
   */
  marshal() {
    let type;
    switch (this.type) {
      case "raw":
        type = Data.DataType.Raw;
        break;
      case "directory":
        type = Data.DataType.Directory;
        break;
      case "file":
        type = Data.DataType.File;
        break;
      case "metadata":
        type = Data.DataType.Metadata;
        break;
      case "symlink":
        type = Data.DataType.Symlink;
        break;
      case "hamt-sharded-directory":
        type = Data.DataType.HAMTShard;
        break;
      default:
        throw (0, import_err_code.default)(new Error(`Type: ${type} is not valid`), "ERR_INVALID_TYPE");
    }
    let data = this.data;
    if (this.data == null || this.data.length === 0) {
      data = void 0;
    }
    let mode;
    if (this.mode != null) {
      mode = this._originalMode & 4294963200 | (this.mode ?? 0);
      if (mode === DEFAULT_FILE_MODE && !this.isDirectory()) {
        mode = void 0;
      }
      if (mode === DEFAULT_DIRECTORY_MODE && this.isDirectory()) {
        mode = void 0;
      }
    }
    let mtime;
    if (this.mtime != null) {
      mtime = {
        Seconds: this.mtime.secs,
        FractionalNanoseconds: this.mtime.nsecs
      };
    }
    return Data.encode({
      Type: type,
      Data: data,
      filesize: this.isDirectory() ? void 0 : this.fileSize(),
      blocksizes: this.blockSizes,
      hashType: this.hashType,
      fanout: this.fanout,
      mode,
      mtime
    });
  }
};

// node_modules/ipfs-unixfs-importer/node_modules/multiformats/dist/src/codecs/raw.js
var raw_exports2 = {};
__export(raw_exports2, {
  code: () => code3,
  decode: () => decode11,
  encode: () => encode8,
  name: () => name3
});

// node_modules/ipfs-unixfs-importer/node_modules/multiformats/dist/src/bytes.js
var empty3 = new Uint8Array(0);
function equals6(aa, bb) {
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
function coerce3(o) {
  if (o instanceof Uint8Array && o.constructor.name === "Uint8Array")
    return o;
  if (o instanceof ArrayBuffer)
    return new Uint8Array(o);
  if (ArrayBuffer.isView(o)) {
    return new Uint8Array(o.buffer, o.byteOffset, o.byteLength);
  }
  throw new Error("Unknown type, must be binary type");
}
function fromString3(str) {
  return new TextEncoder().encode(str);
}
function toString2(b) {
  return new TextDecoder().decode(b);
}

// node_modules/ipfs-unixfs-importer/node_modules/multiformats/dist/src/codecs/raw.js
var name3 = "raw";
var code3 = 85;
function encode8(node) {
  return coerce3(node);
}
function decode11(data) {
  return coerce3(data);
}

// node_modules/progress-events/dist/src/index.js
var CustomProgressEvent = class extends Event {
  type;
  detail;
  constructor(type, detail) {
    super(type);
    this.type = type;
    this.detail = detail;
  }
};

// node_modules/ipfs-unixfs-importer/node_modules/multiformats/dist/src/bases/base32.js
var base32_exports2 = {};
__export(base32_exports2, {
  base32: () => base323,
  base32hex: () => base32hex3,
  base32hexpad: () => base32hexpad3,
  base32hexpadupper: () => base32hexpadupper3,
  base32hexupper: () => base32hexupper3,
  base32pad: () => base32pad3,
  base32padupper: () => base32padupper3,
  base32upper: () => base32upper3,
  base32z: () => base32z3
});

// node_modules/ipfs-unixfs-importer/node_modules/multiformats/dist/src/vendor/base-x.js
function base3(ALPHABET, name8) {
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
  function encode33(source) {
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
    var length11 = 0;
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
      for (var it1 = size - 1; (carry !== 0 || i2 < length11) && it1 !== -1; it1--, i2++) {
        carry += 256 * b58[it1] >>> 0;
        b58[it1] = carry % BASE >>> 0;
        carry = carry / BASE >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length11 = i2;
      pbegin++;
    }
    var it2 = size - length11;
    while (it2 !== size && b58[it2] === 0) {
      it2++;
    }
    var str = LEADER.repeat(zeroes);
    for (; it2 < size; ++it2) {
      str += ALPHABET.charAt(b58[it2]);
    }
    return str;
  }
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
    var length11 = 0;
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
      for (var it3 = size - 1; (carry !== 0 || i2 < length11) && it3 !== -1; it3--, i2++) {
        carry += BASE * b256[it3] >>> 0;
        b256[it3] = carry % 256 >>> 0;
        carry = carry / 256 >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length11 = i2;
      psz++;
    }
    if (source[psz] === " ") {
      return;
    }
    var it4 = size - length11;
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
  function decode49(string5) {
    var buffer3 = decodeUnsafe(string5);
    if (buffer3) {
      return buffer3;
    }
    throw new Error(`Non-${name8} character`);
  }
  return {
    encode: encode33,
    decodeUnsafe,
    decode: decode49
  };
}
var src3 = base3;
var _brrp__multiformats_scope_baseX3 = src3;
var base_x_default3 = _brrp__multiformats_scope_baseX3;

// node_modules/ipfs-unixfs-importer/node_modules/multiformats/dist/src/bases/base.js
var Encoder3 = class {
  name;
  prefix;
  baseEncode;
  constructor(name8, prefix, baseEncode) {
    this.name = name8;
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
var Decoder3 = class {
  name;
  prefix;
  baseDecode;
  prefixCodePoint;
  constructor(name8, prefix, baseDecode) {
    this.name = name8;
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
    return or3(this, decoder);
  }
};
var ComposedDecoder3 = class {
  decoders;
  constructor(decoders) {
    this.decoders = decoders;
  }
  or(decoder) {
    return or3(this, decoder);
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
function or3(left, right) {
  return new ComposedDecoder3({
    ...left.decoders ?? { [left.prefix]: left },
    ...right.decoders ?? { [right.prefix]: right }
  });
}
var Codec3 = class {
  name;
  prefix;
  baseEncode;
  baseDecode;
  encoder;
  decoder;
  constructor(name8, prefix, baseEncode, baseDecode) {
    this.name = name8;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
    this.baseDecode = baseDecode;
    this.encoder = new Encoder3(name8, prefix, baseEncode);
    this.decoder = new Decoder3(name8, prefix, baseDecode);
  }
  encode(input) {
    return this.encoder.encode(input);
  }
  decode(input) {
    return this.decoder.decode(input);
  }
};
function from4({ name: name8, prefix, encode: encode33, decode: decode49 }) {
  return new Codec3(name8, prefix, encode33, decode49);
}
function baseX3({ name: name8, prefix, alphabet: alphabet5 }) {
  const { encode: encode33, decode: decode49 } = base_x_default3(alphabet5, name8);
  return from4({
    prefix,
    name: name8,
    encode: encode33,
    decode: (text) => coerce3(decode49(text))
  });
}
function decode12(string5, alphabet5, bitsPerChar, name8) {
  const codes = {};
  for (let i = 0; i < alphabet5.length; ++i) {
    codes[alphabet5[i]] = i;
  }
  let end = string5.length;
  while (string5[end - 1] === "=") {
    --end;
  }
  const out = new Uint8Array(end * bitsPerChar / 8 | 0);
  let bits = 0;
  let buffer3 = 0;
  let written = 0;
  for (let i = 0; i < end; ++i) {
    const value = codes[string5[i]];
    if (value === void 0) {
      throw new SyntaxError(`Non-${name8} character`);
    }
    buffer3 = buffer3 << bitsPerChar | value;
    bits += bitsPerChar;
    if (bits >= 8) {
      bits -= 8;
      out[written++] = 255 & buffer3 >> bits;
    }
  }
  if (bits >= bitsPerChar || (255 & buffer3 << 8 - bits) !== 0) {
    throw new SyntaxError("Unexpected end of data");
  }
  return out;
}
function encode9(data, alphabet5, bitsPerChar) {
  const pad = alphabet5[alphabet5.length - 1] === "=";
  const mask = (1 << bitsPerChar) - 1;
  let out = "";
  let bits = 0;
  let buffer3 = 0;
  for (let i = 0; i < data.length; ++i) {
    buffer3 = buffer3 << 8 | data[i];
    bits += 8;
    while (bits > bitsPerChar) {
      bits -= bitsPerChar;
      out += alphabet5[mask & buffer3 >> bits];
    }
  }
  if (bits !== 0) {
    out += alphabet5[mask & buffer3 << bitsPerChar - bits];
  }
  if (pad) {
    while ((out.length * bitsPerChar & 7) !== 0) {
      out += "=";
    }
  }
  return out;
}
function rfc46483({ name: name8, prefix, bitsPerChar, alphabet: alphabet5 }) {
  return from4({
    prefix,
    name: name8,
    encode(input) {
      return encode9(input, alphabet5, bitsPerChar);
    },
    decode(input) {
      return decode12(input, alphabet5, bitsPerChar, name8);
    }
  });
}

// node_modules/ipfs-unixfs-importer/node_modules/multiformats/dist/src/bases/base32.js
var base323 = rfc46483({
  prefix: "b",
  name: "base32",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567",
  bitsPerChar: 5
});
var base32upper3 = rfc46483({
  prefix: "B",
  name: "base32upper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
  bitsPerChar: 5
});
var base32pad3 = rfc46483({
  prefix: "c",
  name: "base32pad",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
  bitsPerChar: 5
});
var base32padupper3 = rfc46483({
  prefix: "C",
  name: "base32padupper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
  bitsPerChar: 5
});
var base32hex3 = rfc46483({
  prefix: "v",
  name: "base32hex",
  alphabet: "0123456789abcdefghijklmnopqrstuv",
  bitsPerChar: 5
});
var base32hexupper3 = rfc46483({
  prefix: "V",
  name: "base32hexupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
  bitsPerChar: 5
});
var base32hexpad3 = rfc46483({
  prefix: "t",
  name: "base32hexpad",
  alphabet: "0123456789abcdefghijklmnopqrstuv=",
  bitsPerChar: 5
});
var base32hexpadupper3 = rfc46483({
  prefix: "T",
  name: "base32hexpadupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
  bitsPerChar: 5
});
var base32z3 = rfc46483({
  prefix: "h",
  name: "base32z",
  alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
  bitsPerChar: 5
});

// node_modules/ipfs-unixfs-importer/node_modules/multiformats/dist/src/bases/base58.js
var base58_exports2 = {};
__export(base58_exports2, {
  base58btc: () => base58btc3,
  base58flickr: () => base58flickr3
});
var base58btc3 = baseX3({
  name: "base58btc",
  prefix: "z",
  alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
});
var base58flickr3 = baseX3({
  name: "base58flickr",
  prefix: "Z",
  alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
});

// node_modules/ipfs-unixfs-importer/node_modules/multiformats/dist/src/vendor/varint.js
var encode_13 = encode10;
var MSB4 = 128;
var REST4 = 127;
var MSBALL3 = ~REST4;
var INT3 = Math.pow(2, 31);
function encode10(num, out, offset) {
  out = out || [];
  offset = offset || 0;
  var oldOffset = offset;
  while (num >= INT3) {
    out[offset++] = num & 255 | MSB4;
    num /= 128;
  }
  while (num & MSBALL3) {
    out[offset++] = num & 255 | MSB4;
    num >>>= 7;
  }
  out[offset] = num | 0;
  encode10.bytes = offset - oldOffset + 1;
  return out;
}
var decode13 = read4;
var MSB$13 = 128;
var REST$13 = 127;
function read4(buf3, offset) {
  var res = 0, offset = offset || 0, shift = 0, counter = offset, b, l = buf3.length;
  do {
    if (counter >= l) {
      read4.bytes = 0;
      throw new RangeError("Could not decode varint");
    }
    b = buf3[counter++];
    res += shift < 28 ? (b & REST$13) << shift : (b & REST$13) * Math.pow(2, shift);
    shift += 7;
  } while (b >= MSB$13);
  read4.bytes = counter - offset;
  return res;
}
var N14 = Math.pow(2, 7);
var N24 = Math.pow(2, 14);
var N34 = Math.pow(2, 21);
var N44 = Math.pow(2, 28);
var N54 = Math.pow(2, 35);
var N64 = Math.pow(2, 42);
var N74 = Math.pow(2, 49);
var N83 = Math.pow(2, 56);
var N93 = Math.pow(2, 63);
var length4 = function(value) {
  return value < N14 ? 1 : value < N24 ? 2 : value < N34 ? 3 : value < N44 ? 4 : value < N54 ? 5 : value < N64 ? 6 : value < N74 ? 7 : value < N83 ? 8 : value < N93 ? 9 : 10;
};
var varint3 = {
  encode: encode_13,
  decode: decode13,
  encodingLength: length4
};
var _brrp_varint3 = varint3;
var varint_default3 = _brrp_varint3;

// node_modules/ipfs-unixfs-importer/node_modules/multiformats/dist/src/varint.js
function decode14(data, offset = 0) {
  const code13 = varint_default3.decode(data, offset);
  return [code13, varint_default3.decode.bytes];
}
function encodeTo3(int, target, offset = 0) {
  varint_default3.encode(int, target, offset);
  return target;
}
function encodingLength4(int) {
  return varint_default3.encodingLength(int);
}

// node_modules/ipfs-unixfs-importer/node_modules/multiformats/dist/src/hashes/digest.js
function create3(code13, digest6) {
  const size = digest6.byteLength;
  const sizeOffset = encodingLength4(code13);
  const digestOffset = sizeOffset + encodingLength4(size);
  const bytes = new Uint8Array(digestOffset + size);
  encodeTo3(code13, bytes, 0);
  encodeTo3(size, bytes, sizeOffset);
  bytes.set(digest6, digestOffset);
  return new Digest3(code13, size, digest6, bytes);
}
function decode15(multihash) {
  const bytes = coerce3(multihash);
  const [code13, sizeOffset] = decode14(bytes);
  const [size, digestOffset] = decode14(bytes.subarray(sizeOffset));
  const digest6 = bytes.subarray(sizeOffset + digestOffset);
  if (digest6.byteLength !== size) {
    throw new Error("Incorrect length");
  }
  return new Digest3(code13, size, digest6, bytes);
}
function equals7(a, b) {
  if (a === b) {
    return true;
  } else {
    const data = b;
    return a.code === data.code && a.size === data.size && data.bytes instanceof Uint8Array && equals6(a.bytes, data.bytes);
  }
}
var Digest3 = class {
  code;
  size;
  digest;
  bytes;
  /**
   * Creates a multihash digest.
   */
  constructor(code13, size, digest6, bytes) {
    this.code = code13;
    this.size = size;
    this.digest = digest6;
    this.bytes = bytes;
  }
};

// node_modules/ipfs-unixfs-importer/node_modules/multiformats/dist/src/cid.js
function format3(link, base12) {
  const { bytes, version } = link;
  switch (version) {
    case 0:
      return toStringV03(bytes, baseCache3(link), base12 ?? base58btc3.encoder);
    default:
      return toStringV13(bytes, baseCache3(link), base12 ?? base323.encoder);
  }
}
var cache3 = /* @__PURE__ */ new WeakMap();
function baseCache3(cid) {
  const baseCache10 = cache3.get(cid);
  if (baseCache10 == null) {
    const baseCache11 = /* @__PURE__ */ new Map();
    cache3.set(cid, baseCache11);
    return baseCache11;
  }
  return baseCache10;
}
var CID3 = class _CID {
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
  constructor(version, code13, multihash, bytes) {
    this.code = code13;
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
        const { code: code13, multihash } = this;
        if (code13 !== DAG_PB_CODE3) {
          throw new Error("Cannot convert a non dag-pb CID to CIDv0");
        }
        if (multihash.code !== SHA_256_CODE3) {
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
        const { code: code13, digest: digest6 } = this.multihash;
        const multihash = create3(code13, digest6);
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
    return unknown != null && self.code === unknown.code && self.version === unknown.version && equals7(self.multihash, unknown.multihash);
  }
  toString(base12) {
    return format3(this, base12);
  }
  toJSON() {
    return { "/": format3(this) };
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
      const { version, code: code13, multihash, bytes } = value;
      return new _CID(version, code13, multihash, bytes ?? encodeCID3(version, code13, multihash.bytes));
    } else if (value[cidSymbol3] === true) {
      const { version, multihash, code: code13 } = value;
      const digest6 = decode15(multihash);
      return _CID.create(version, code13, digest6);
    } else {
      return null;
    }
  }
  /**
   * @param version - Version of the CID
   * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
   * @param digest - (Multi)hash of the of the content.
   */
  static create(version, code13, digest6) {
    if (typeof code13 !== "number") {
      throw new Error("String codecs are no longer supported");
    }
    if (!(digest6.bytes instanceof Uint8Array)) {
      throw new Error("Invalid digest");
    }
    switch (version) {
      case 0: {
        if (code13 !== DAG_PB_CODE3) {
          throw new Error(`Version 0 CID must use dag-pb (code: ${DAG_PB_CODE3}) block encoding`);
        } else {
          return new _CID(version, code13, digest6, digest6.bytes);
        }
      }
      case 1: {
        const bytes = encodeCID3(version, code13, digest6.bytes);
        return new _CID(version, code13, digest6, bytes);
      }
      default: {
        throw new Error("Invalid version");
      }
    }
  }
  /**
   * Simplified version of `create` for CIDv0.
   */
  static createV0(digest6) {
    return _CID.create(0, DAG_PB_CODE3, digest6);
  }
  /**
   * Simplified version of `create` for CIDv1.
   *
   * @param code - Content encoding format code.
   * @param digest - Multihash of the content.
   */
  static createV1(code13, digest6) {
    return _CID.create(1, code13, digest6);
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
    const multihashBytes = coerce3(bytes.subarray(prefixSize, prefixSize + specs.multihashSize));
    if (multihashBytes.byteLength !== specs.multihashSize) {
      throw new Error("Incorrect length");
    }
    const digestBytes = multihashBytes.subarray(specs.multihashSize - specs.digestSize);
    const digest6 = new Digest3(specs.multihashCode, specs.digestSize, digestBytes, multihashBytes);
    const cid = specs.version === 0 ? _CID.createV0(digest6) : _CID.createV1(specs.codec, digest6);
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
    const next = () => {
      const [i, length11] = decode14(initialBytes.subarray(offset));
      offset += length11;
      return i;
    };
    let version = next();
    let codec = DAG_PB_CODE3;
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
  static parse(source, base12) {
    const [prefix, bytes] = parseCIDtoBytes3(source, base12);
    const cid = _CID.decode(bytes);
    if (cid.version === 0 && source[0] !== "Q") {
      throw Error("Version 0 CID string must not include multibase prefix");
    }
    baseCache3(cid).set(prefix, source);
    return cid;
  }
};
function parseCIDtoBytes3(source, base12) {
  switch (source[0]) {
    case "Q": {
      const decoder = base12 ?? base58btc3;
      return [
        base58btc3.prefix,
        decoder.decode(`${base58btc3.prefix}${source}`)
      ];
    }
    case base58btc3.prefix: {
      const decoder = base12 ?? base58btc3;
      return [base58btc3.prefix, decoder.decode(source)];
    }
    case base323.prefix: {
      const decoder = base12 ?? base323;
      return [base323.prefix, decoder.decode(source)];
    }
    default: {
      if (base12 == null) {
        throw Error("To parse non base32 or base58btc encoded CID multibase decoder must be provided");
      }
      return [source[0], base12.decode(source)];
    }
  }
}
function toStringV03(bytes, cache10, base12) {
  const { prefix } = base12;
  if (prefix !== base58btc3.prefix) {
    throw Error(`Cannot string encode V0 in ${base12.name} encoding`);
  }
  const cid = cache10.get(prefix);
  if (cid == null) {
    const cid2 = base12.encode(bytes).slice(1);
    cache10.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
function toStringV13(bytes, cache10, base12) {
  const { prefix } = base12;
  const cid = cache10.get(prefix);
  if (cid == null) {
    const cid2 = base12.encode(bytes);
    cache10.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
var DAG_PB_CODE3 = 112;
var SHA_256_CODE3 = 18;
function encodeCID3(version, code13, multihash) {
  const codeOffset = encodingLength4(version);
  const hashOffset = codeOffset + encodingLength4(code13);
  const bytes = new Uint8Array(hashOffset + multihash.byteLength);
  encodeTo3(version, bytes, 0);
  encodeTo3(code13, bytes, codeOffset);
  bytes.set(multihash, hashOffset);
  return bytes;
}
var cidSymbol3 = Symbol.for("@ipld/js-cid/CID");

// node_modules/ipfs-unixfs-importer/node_modules/multiformats/dist/src/hashes/sha2-browser.js
var sha2_browser_exports2 = {};
__export(sha2_browser_exports2, {
  sha256: () => sha2562,
  sha512: () => sha5122
});

// node_modules/ipfs-unixfs-importer/node_modules/multiformats/dist/src/hashes/hasher.js
function from5({ name: name8, code: code13, encode: encode33 }) {
  return new Hasher2(name8, code13, encode33);
}
var Hasher2 = class {
  name;
  code;
  encode;
  constructor(name8, code13, encode33) {
    this.name = name8;
    this.code = code13;
    this.encode = encode33;
  }
  digest(input) {
    if (input instanceof Uint8Array) {
      const result = this.encode(input);
      return result instanceof Uint8Array ? create3(this.code, result) : result.then((digest6) => create3(this.code, digest6));
    } else {
      throw Error("Unknown type, must be binary type");
    }
  }
};

// node_modules/ipfs-unixfs-importer/node_modules/multiformats/dist/src/hashes/sha2-browser.js
function sha2(name8) {
  return async (data) => new Uint8Array(await crypto.subtle.digest(name8, data));
}
var sha2562 = from5({
  name: "sha2-256",
  code: 18,
  encode: sha2("SHA-256")
});
var sha5122 = from5({
  name: "sha2-512",
  code: 19,
  encode: sha2("SHA-512")
});

// node_modules/ipfs-unixfs-importer/dist/src/utils/persist.js
var persist = async (buffer3, blockstore, options) => {
  if (options.codec == null) {
    options.codec = src_exports;
  }
  const multihash = await sha2562.digest(buffer3);
  const cid = CID3.create(options.cidVersion, options.codec.code, multihash);
  await blockstore.put(cid, buffer3, options);
  return cid;
};

// node_modules/ipfs-unixfs-importer/dist/src/dag-builder/buffer-importer.js
function defaultBufferImporter(options) {
  return async function* bufferImporter(file, blockstore) {
    let bytesWritten = 0n;
    for await (let block of file.content) {
      yield async () => {
        let unixfs2;
        const opts = {
          codec: src_exports,
          cidVersion: options.cidVersion,
          onProgress: options.onProgress
        };
        if (options.rawLeaves) {
          opts.codec = raw_exports2;
          opts.cidVersion = 1;
        } else {
          unixfs2 = new UnixFS({
            type: options.leafType,
            data: block
          });
          block = encode3({
            Data: unixfs2.marshal(),
            Links: []
          });
        }
        const cid = await persist(block, blockstore, opts);
        bytesWritten += BigInt(block.byteLength);
        options.onProgress?.(new CustomProgressEvent("unixfs:importer:progress:file:write", {
          bytesWritten,
          cid,
          path: file.path
        }));
        return {
          cid,
          unixfs: unixfs2,
          size: BigInt(block.length),
          block
        };
      };
    }
  };
}

// node_modules/ipfs-unixfs-importer/dist/src/dag-builder/index.js
var import_err_code2 = __toESM(require_err_code(), 1);

// node_modules/ipfs-unixfs-importer/dist/src/dag-builder/dir.js
var dirBuilder = async (dir, blockstore, options) => {
  const unixfs2 = new UnixFS({
    type: "directory",
    mtime: dir.mtime,
    mode: dir.mode
  });
  const block = encode3(prepare({ Data: unixfs2.marshal() }));
  const cid = await persist(block, blockstore, options);
  const path = dir.path;
  return {
    cid,
    path,
    unixfs: unixfs2,
    size: BigInt(block.length),
    originalPath: dir.originalPath,
    block
  };
};

// node_modules/ipfs-unixfs-importer/dist/src/dag-builder/file.js
async function* buildFileBatch(file, blockstore, options) {
  let count = -1;
  let previous;
  for await (const entry of parallelBatch(options.bufferImporter(file, blockstore), options.blockWriteConcurrency)) {
    count++;
    if (count === 0) {
      previous = {
        ...entry,
        single: true
      };
      continue;
    } else if (count === 1 && previous != null) {
      yield {
        ...previous,
        block: void 0,
        single: void 0
      };
      previous = void 0;
    }
    yield {
      ...entry,
      block: void 0
    };
  }
  if (previous != null) {
    yield previous;
  }
}
function isSingleBlockImport(result) {
  return result.single === true;
}
var reduce = (file, blockstore, options) => {
  const reducer = async function(leaves) {
    if (leaves.length === 1 && isSingleBlockImport(leaves[0]) && options.reduceSingleLeafToSelf) {
      const leaf = leaves[0];
      let node2 = leaf.block;
      if (isSingleBlockImport(leaf) && (file.mtime !== void 0 || file.mode !== void 0)) {
        leaf.unixfs = new UnixFS({
          type: "file",
          mtime: file.mtime,
          mode: file.mode,
          data: leaf.block
        });
        node2 = { Data: leaf.unixfs.marshal(), Links: [] };
        leaf.block = encode3(prepare(node2));
        leaf.cid = await persist(leaf.block, blockstore, {
          ...options,
          cidVersion: options.cidVersion
        });
        leaf.size = BigInt(leaf.block.length);
      }
      options.onProgress?.(new CustomProgressEvent("unixfs:importer:progress:file:layout", {
        cid: leaf.cid,
        path: leaf.originalPath
      }));
      return {
        cid: leaf.cid,
        path: file.path,
        unixfs: leaf.unixfs,
        size: leaf.size,
        originalPath: leaf.originalPath
      };
    }
    const f = new UnixFS({
      type: "file",
      mtime: file.mtime,
      mode: file.mode
    });
    const links = leaves.filter((leaf) => {
      if (leaf.cid.code === code3 && leaf.size > 0) {
        return true;
      }
      if (leaf.unixfs != null && leaf.unixfs.data == null && leaf.unixfs.fileSize() > 0n) {
        return true;
      }
      return Boolean(leaf.unixfs?.data?.length);
    }).map((leaf) => {
      if (leaf.cid.code === code3) {
        f.addBlockSize(leaf.size);
        return {
          Name: "",
          Tsize: Number(leaf.size),
          Hash: leaf.cid
        };
      }
      if (leaf.unixfs == null || leaf.unixfs.data == null) {
        f.addBlockSize(leaf.unixfs?.fileSize() ?? 0n);
      } else {
        f.addBlockSize(BigInt(leaf.unixfs.data.length));
      }
      return {
        Name: "",
        Tsize: Number(leaf.size),
        Hash: leaf.cid
      };
    });
    const node = {
      Data: f.marshal(),
      Links: links
    };
    const block = encode3(prepare(node));
    const cid = await persist(block, blockstore, options);
    options.onProgress?.(new CustomProgressEvent("unixfs:importer:progress:file:layout", {
      cid,
      path: file.originalPath
    }));
    return {
      cid,
      path: file.path,
      unixfs: f,
      size: BigInt(block.length + node.Links.reduce((acc, curr) => acc + (curr.Tsize ?? 0), 0)),
      originalPath: file.originalPath,
      block
    };
  };
  return reducer;
};
var fileBuilder = async (file, block, options) => {
  return options.layout(buildFileBatch(file, block, options), reduce(file, block, options));
};

// node_modules/ipfs-unixfs-importer/dist/src/dag-builder/index.js
function isIterable(thing) {
  return Symbol.iterator in thing;
}
function isAsyncIterable3(thing) {
  return Symbol.asyncIterator in thing;
}
function contentAsAsyncIterable(content) {
  try {
    if (content instanceof Uint8Array) {
      return async function* () {
        yield content;
      }();
    } else if (isIterable(content)) {
      return async function* () {
        yield* content;
      }();
    } else if (isAsyncIterable3(content)) {
      return content;
    }
  } catch {
    throw (0, import_err_code2.default)(new Error("Content was invalid"), "ERR_INVALID_CONTENT");
  }
  throw (0, import_err_code2.default)(new Error("Content was invalid"), "ERR_INVALID_CONTENT");
}
function defaultDagBuilder(options) {
  return async function* dagBuilder(source, blockstore) {
    for await (const entry of source) {
      let originalPath;
      if (entry.path != null) {
        originalPath = entry.path;
        entry.path = entry.path.split("/").filter((path) => path != null && path !== ".").join("/");
      }
      if (isFileCandidate(entry)) {
        const file = {
          path: entry.path,
          mtime: entry.mtime,
          mode: entry.mode,
          content: async function* () {
            let bytesRead = 0n;
            for await (const chunk of options.chunker(options.chunkValidator(contentAsAsyncIterable(entry.content)))) {
              const currentChunkSize = BigInt(chunk.byteLength);
              bytesRead += currentChunkSize;
              options.onProgress?.(new CustomProgressEvent("unixfs:importer:progress:file:read", {
                bytesRead,
                chunkSize: currentChunkSize,
                path: entry.path
              }));
              yield chunk;
            }
          }(),
          originalPath
        };
        yield async () => fileBuilder(file, blockstore, options);
      } else if (entry.path != null) {
        const dir = {
          path: entry.path,
          mtime: entry.mtime,
          mode: entry.mode,
          originalPath
        };
        yield async () => dirBuilder(dir, blockstore, options);
      } else {
        throw new Error("Import candidate must have content or path or both");
      }
    }
  };
}
function isFileCandidate(entry) {
  return entry.content != null;
}

// node_modules/ipfs-unixfs-importer/dist/src/dag-builder/validate-chunks.js
var import_err_code3 = __toESM(require_err_code(), 1);

// node_modules/ipfs-unixfs-importer/node_modules/multiformats/dist/src/bases/base10.js
var base10_exports2 = {};
__export(base10_exports2, {
  base10: () => base102
});
var base102 = baseX3({
  prefix: "9",
  name: "base10",
  alphabet: "0123456789"
});

// node_modules/ipfs-unixfs-importer/node_modules/multiformats/dist/src/bases/base16.js
var base16_exports2 = {};
__export(base16_exports2, {
  base16: () => base162,
  base16upper: () => base16upper2
});
var base162 = rfc46483({
  prefix: "f",
  name: "base16",
  alphabet: "0123456789abcdef",
  bitsPerChar: 4
});
var base16upper2 = rfc46483({
  prefix: "F",
  name: "base16upper",
  alphabet: "0123456789ABCDEF",
  bitsPerChar: 4
});

// node_modules/ipfs-unixfs-importer/node_modules/multiformats/dist/src/bases/base2.js
var base2_exports2 = {};
__export(base2_exports2, {
  base2: () => base23
});
var base23 = rfc46483({
  prefix: "0",
  name: "base2",
  alphabet: "01",
  bitsPerChar: 1
});

// node_modules/ipfs-unixfs-importer/node_modules/multiformats/dist/src/bases/base256emoji.js
var base256emoji_exports2 = {};
__export(base256emoji_exports2, {
  base256emoji: () => base256emoji2
});
var alphabet2 = Array.from("\u{1F680}\u{1FA90}\u2604\u{1F6F0}\u{1F30C}\u{1F311}\u{1F312}\u{1F313}\u{1F314}\u{1F315}\u{1F316}\u{1F317}\u{1F318}\u{1F30D}\u{1F30F}\u{1F30E}\u{1F409}\u2600\u{1F4BB}\u{1F5A5}\u{1F4BE}\u{1F4BF}\u{1F602}\u2764\u{1F60D}\u{1F923}\u{1F60A}\u{1F64F}\u{1F495}\u{1F62D}\u{1F618}\u{1F44D}\u{1F605}\u{1F44F}\u{1F601}\u{1F525}\u{1F970}\u{1F494}\u{1F496}\u{1F499}\u{1F622}\u{1F914}\u{1F606}\u{1F644}\u{1F4AA}\u{1F609}\u263A\u{1F44C}\u{1F917}\u{1F49C}\u{1F614}\u{1F60E}\u{1F607}\u{1F339}\u{1F926}\u{1F389}\u{1F49E}\u270C\u2728\u{1F937}\u{1F631}\u{1F60C}\u{1F338}\u{1F64C}\u{1F60B}\u{1F497}\u{1F49A}\u{1F60F}\u{1F49B}\u{1F642}\u{1F493}\u{1F929}\u{1F604}\u{1F600}\u{1F5A4}\u{1F603}\u{1F4AF}\u{1F648}\u{1F447}\u{1F3B6}\u{1F612}\u{1F92D}\u2763\u{1F61C}\u{1F48B}\u{1F440}\u{1F62A}\u{1F611}\u{1F4A5}\u{1F64B}\u{1F61E}\u{1F629}\u{1F621}\u{1F92A}\u{1F44A}\u{1F973}\u{1F625}\u{1F924}\u{1F449}\u{1F483}\u{1F633}\u270B\u{1F61A}\u{1F61D}\u{1F634}\u{1F31F}\u{1F62C}\u{1F643}\u{1F340}\u{1F337}\u{1F63B}\u{1F613}\u2B50\u2705\u{1F97A}\u{1F308}\u{1F608}\u{1F918}\u{1F4A6}\u2714\u{1F623}\u{1F3C3}\u{1F490}\u2639\u{1F38A}\u{1F498}\u{1F620}\u261D\u{1F615}\u{1F33A}\u{1F382}\u{1F33B}\u{1F610}\u{1F595}\u{1F49D}\u{1F64A}\u{1F639}\u{1F5E3}\u{1F4AB}\u{1F480}\u{1F451}\u{1F3B5}\u{1F91E}\u{1F61B}\u{1F534}\u{1F624}\u{1F33C}\u{1F62B}\u26BD\u{1F919}\u2615\u{1F3C6}\u{1F92B}\u{1F448}\u{1F62E}\u{1F646}\u{1F37B}\u{1F343}\u{1F436}\u{1F481}\u{1F632}\u{1F33F}\u{1F9E1}\u{1F381}\u26A1\u{1F31E}\u{1F388}\u274C\u270A\u{1F44B}\u{1F630}\u{1F928}\u{1F636}\u{1F91D}\u{1F6B6}\u{1F4B0}\u{1F353}\u{1F4A2}\u{1F91F}\u{1F641}\u{1F6A8}\u{1F4A8}\u{1F92C}\u2708\u{1F380}\u{1F37A}\u{1F913}\u{1F619}\u{1F49F}\u{1F331}\u{1F616}\u{1F476}\u{1F974}\u25B6\u27A1\u2753\u{1F48E}\u{1F4B8}\u2B07\u{1F628}\u{1F31A}\u{1F98B}\u{1F637}\u{1F57A}\u26A0\u{1F645}\u{1F61F}\u{1F635}\u{1F44E}\u{1F932}\u{1F920}\u{1F927}\u{1F4CC}\u{1F535}\u{1F485}\u{1F9D0}\u{1F43E}\u{1F352}\u{1F617}\u{1F911}\u{1F30A}\u{1F92F}\u{1F437}\u260E\u{1F4A7}\u{1F62F}\u{1F486}\u{1F446}\u{1F3A4}\u{1F647}\u{1F351}\u2744\u{1F334}\u{1F4A3}\u{1F438}\u{1F48C}\u{1F4CD}\u{1F940}\u{1F922}\u{1F445}\u{1F4A1}\u{1F4A9}\u{1F450}\u{1F4F8}\u{1F47B}\u{1F910}\u{1F92E}\u{1F3BC}\u{1F975}\u{1F6A9}\u{1F34E}\u{1F34A}\u{1F47C}\u{1F48D}\u{1F4E3}\u{1F942}");
var alphabetBytesToChars2 = alphabet2.reduce((p, c, i) => {
  p[i] = c;
  return p;
}, []);
var alphabetCharsToBytes2 = alphabet2.reduce((p, c, i) => {
  p[c.codePointAt(0)] = i;
  return p;
}, []);
function encode11(data) {
  return data.reduce((p, c) => {
    p += alphabetBytesToChars2[c];
    return p;
  }, "");
}
function decode16(str) {
  const byts = [];
  for (const char of str) {
    const byt = alphabetCharsToBytes2[char.codePointAt(0)];
    if (byt === void 0) {
      throw new Error(`Non-base256emoji character: ${char}`);
    }
    byts.push(byt);
  }
  return new Uint8Array(byts);
}
var base256emoji2 = from4({
  prefix: "\u{1F680}",
  name: "base256emoji",
  encode: encode11,
  decode: decode16
});

// node_modules/ipfs-unixfs-importer/node_modules/multiformats/dist/src/bases/base36.js
var base36_exports2 = {};
__export(base36_exports2, {
  base36: () => base362,
  base36upper: () => base36upper2
});
var base362 = baseX3({
  prefix: "k",
  name: "base36",
  alphabet: "0123456789abcdefghijklmnopqrstuvwxyz"
});
var base36upper2 = baseX3({
  prefix: "K",
  name: "base36upper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
});

// node_modules/ipfs-unixfs-importer/node_modules/multiformats/dist/src/bases/base64.js
var base64_exports2 = {};
__export(base64_exports2, {
  base64: () => base642,
  base64pad: () => base64pad2,
  base64url: () => base64url2,
  base64urlpad: () => base64urlpad2
});
var base642 = rfc46483({
  prefix: "m",
  name: "base64",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
  bitsPerChar: 6
});
var base64pad2 = rfc46483({
  prefix: "M",
  name: "base64pad",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  bitsPerChar: 6
});
var base64url2 = rfc46483({
  prefix: "u",
  name: "base64url",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
  bitsPerChar: 6
});
var base64urlpad2 = rfc46483({
  prefix: "U",
  name: "base64urlpad",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
  bitsPerChar: 6
});

// node_modules/ipfs-unixfs-importer/node_modules/multiformats/dist/src/bases/base8.js
var base8_exports2 = {};
__export(base8_exports2, {
  base8: () => base82
});
var base82 = rfc46483({
  prefix: "7",
  name: "base8",
  alphabet: "01234567",
  bitsPerChar: 3
});

// node_modules/ipfs-unixfs-importer/node_modules/multiformats/dist/src/bases/identity.js
var identity_exports3 = {};
__export(identity_exports3, {
  identity: () => identity3
});
var identity3 = from4({
  prefix: "\0",
  name: "identity",
  encode: (buf3) => toString2(buf3),
  decode: (str) => fromString3(str)
});

// node_modules/ipfs-unixfs-importer/node_modules/multiformats/dist/src/codecs/json.js
var textEncoder4 = new TextEncoder();
var textDecoder3 = new TextDecoder();

// node_modules/ipfs-unixfs-importer/node_modules/multiformats/dist/src/hashes/identity.js
var identity_exports4 = {};
__export(identity_exports4, {
  identity: () => identity4
});
var code4 = 0;
var name4 = "identity";
var encode12 = coerce3;
function digest2(input) {
  return create3(code4, encode12(input));
}
var identity4 = { code: code4, name: name4, encode: encode12, digest: digest2 };

// node_modules/ipfs-unixfs-importer/node_modules/multiformats/dist/src/basics.js
var bases2 = { ...identity_exports3, ...base2_exports2, ...base8_exports2, ...base10_exports2, ...base16_exports2, ...base32_exports2, ...base36_exports2, ...base58_exports2, ...base64_exports2, ...base256emoji_exports2 };
var hashes2 = { ...sha2_browser_exports2, ...identity_exports4 };

// node_modules/ipfs-unixfs-importer/node_modules/uint8arrays/dist/src/alloc.js
function allocUnsafe4(size = 0) {
  return new Uint8Array(size);
}

// node_modules/ipfs-unixfs-importer/node_modules/uint8arrays/dist/src/util/bases.js
function createCodec3(name8, prefix, encode33, decode49) {
  return {
    name: name8,
    prefix,
    encoder: {
      name: name8,
      prefix,
      encode: encode33
    },
    decoder: {
      decode: decode49
    }
  };
}
var string2 = createCodec3("utf8", "u", (buf3) => {
  const decoder = new TextDecoder("utf8");
  return "u" + decoder.decode(buf3);
}, (str) => {
  const encoder = new TextEncoder();
  return encoder.encode(str.substring(1));
});
var ascii2 = createCodec3("ascii", "a", (buf3) => {
  let string5 = "a";
  for (let i = 0; i < buf3.length; i++) {
    string5 += String.fromCharCode(buf3[i]);
  }
  return string5;
}, (str) => {
  str = str.substring(1);
  const buf3 = allocUnsafe4(str.length);
  for (let i = 0; i < str.length; i++) {
    buf3[i] = str.charCodeAt(i);
  }
  return buf3;
});
var BASES2 = {
  utf8: string2,
  "utf-8": string2,
  hex: bases2.base16,
  latin1: ascii2,
  ascii: ascii2,
  binary: ascii2,
  ...bases2
};
var bases_default2 = BASES2;

// node_modules/ipfs-unixfs-importer/node_modules/uint8arrays/dist/src/from-string.js
function fromString4(string5, encoding = "utf8") {
  const base12 = bases_default2[encoding];
  if (base12 == null) {
    throw new Error(`Unsupported encoding "${encoding}"`);
  }
  return base12.decoder.decode(`${base12.prefix}${string5}`);
}

// node_modules/ipfs-unixfs-importer/dist/src/dag-builder/validate-chunks.js
var defaultChunkValidator = () => {
  return async function* validateChunks(source) {
    for await (const content of source) {
      if (content.length === void 0) {
        throw (0, import_err_code3.default)(new Error("Content was invalid"), "ERR_INVALID_CONTENT");
      }
      if (typeof content === "string" || content instanceof String) {
        yield fromString4(content.toString());
      } else if (Array.isArray(content)) {
        yield Uint8Array.from(content);
      } else if (content instanceof Uint8Array) {
        yield content;
      } else {
        throw (0, import_err_code3.default)(new Error("Content was invalid"), "ERR_INVALID_CONTENT");
      }
    }
  };
};

// node_modules/ipfs-unixfs-importer/dist/src/layout/balanced.js
var DEFAULT_MAX_CHILDREN_PER_NODE = 174;
function balanced(options) {
  const maxChildrenPerNode = options?.maxChildrenPerNode ?? DEFAULT_MAX_CHILDREN_PER_NODE;
  return async function balancedLayout(source, reduce2) {
    const roots = [];
    for await (const chunked of src_default2(source, maxChildrenPerNode)) {
      roots.push(await reduce2(chunked));
    }
    if (roots.length > 1) {
      return balancedLayout(roots, reduce2);
    }
    return roots[0];
  };
}

// node_modules/ipfs-unixfs-importer/dist/src/dir.js
var Dir = class {
  options;
  root;
  dir;
  path;
  dirty;
  flat;
  parent;
  parentKey;
  unixfs;
  mode;
  mtime;
  cid;
  size;
  nodeSize;
  constructor(props, options) {
    this.options = options ?? {};
    this.root = props.root;
    this.dir = props.dir;
    this.path = props.path;
    this.dirty = props.dirty;
    this.flat = props.flat;
    this.parent = props.parent;
    this.parentKey = props.parentKey;
    this.unixfs = props.unixfs;
    this.mode = props.mode;
    this.mtime = props.mtime;
  }
};
var CID_V0 = CID3.parse("QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn");
var CID_V1 = CID3.parse("zdj7WbTaiJT1fgatdet9Ei9iDB5hdCxkbVyhyh8YTUnXMiwYi");

// node_modules/ipfs-unixfs-importer/dist/src/dir-flat.js
var DirFlat = class extends Dir {
  _children;
  constructor(props, options) {
    super(props, options);
    this._children = /* @__PURE__ */ new Map();
  }
  async put(name8, value) {
    this.cid = void 0;
    this.size = void 0;
    this.nodeSize = void 0;
    this._children.set(name8, value);
  }
  async get(name8) {
    return Promise.resolve(this._children.get(name8));
  }
  childCount() {
    return this._children.size;
  }
  directChildrenCount() {
    return this.childCount();
  }
  onlyChild() {
    return this._children.values().next().value;
  }
  async *eachChildSeries() {
    for (const [key, child] of this._children.entries()) {
      yield {
        key,
        child
      };
    }
  }
  estimateNodeSize() {
    if (this.nodeSize !== void 0) {
      return this.nodeSize;
    }
    this.nodeSize = 0;
    for (const [name8, child] of this._children.entries()) {
      if (child.size != null && child.cid != null) {
        this.nodeSize += name8.length + (this.options.cidVersion === 1 ? CID_V1.bytes.byteLength : CID_V0.bytes.byteLength);
      }
    }
    return this.nodeSize;
  }
  async *flush(block) {
    const links = [];
    for (const [name8, child] of this._children.entries()) {
      let result = child;
      if (child instanceof Dir) {
        for await (const entry of child.flush(block)) {
          result = entry;
          yield entry;
        }
      }
      if (result.size != null && result.cid != null) {
        links.push({
          Name: name8,
          Tsize: Number(result.size),
          Hash: result.cid
        });
      }
    }
    const unixfs2 = new UnixFS({
      type: "directory",
      mtime: this.mtime,
      mode: this.mode
    });
    const node = { Data: unixfs2.marshal(), Links: links };
    const buffer3 = encode3(prepare(node));
    const cid = await persist(buffer3, block, this.options);
    const size = buffer3.length + node.Links.reduce(
      /**
       * @param {number} acc
       * @param {PBLink} curr
       */
      (acc, curr) => acc + (curr.Tsize == null ? 0 : curr.Tsize),
      0
    );
    this.cid = cid;
    this.size = size;
    yield {
      cid,
      unixfs: unixfs2,
      path: this.path,
      size: BigInt(size)
    };
  }
};

// node_modules/@multiformats/murmur3/node_modules/multiformats/dist/src/bytes.js
var bytes_exports3 = {};
__export(bytes_exports3, {
  coerce: () => coerce4,
  empty: () => empty4,
  equals: () => equals8,
  fromHex: () => fromHex,
  fromString: () => fromString5,
  isBinary: () => isBinary,
  toHex: () => toHex,
  toString: () => toString3
});
var empty4 = new Uint8Array(0);
function toHex(d) {
  return d.reduce((hex, byte) => hex + byte.toString(16).padStart(2, "0"), "");
}
function fromHex(hex) {
  const hexes = hex.match(/../g);
  return hexes != null ? new Uint8Array(hexes.map((b) => parseInt(b, 16))) : empty4;
}
function equals8(aa, bb) {
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
function coerce4(o) {
  if (o instanceof Uint8Array && o.constructor.name === "Uint8Array")
    return o;
  if (o instanceof ArrayBuffer)
    return new Uint8Array(o);
  if (ArrayBuffer.isView(o)) {
    return new Uint8Array(o.buffer, o.byteOffset, o.byteLength);
  }
  throw new Error("Unknown type, must be binary type");
}
function isBinary(o) {
  return o instanceof ArrayBuffer || ArrayBuffer.isView(o);
}
function fromString5(str) {
  return new TextEncoder().encode(str);
}
function toString3(b) {
  return new TextDecoder().decode(b);
}

// node_modules/@multiformats/murmur3/node_modules/multiformats/dist/src/vendor/base-x.js
function base4(ALPHABET, name8) {
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
  function encode33(source) {
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
    var length11 = 0;
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
      for (var it1 = size - 1; (carry !== 0 || i2 < length11) && it1 !== -1; it1--, i2++) {
        carry += 256 * b58[it1] >>> 0;
        b58[it1] = carry % BASE >>> 0;
        carry = carry / BASE >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length11 = i2;
      pbegin++;
    }
    var it2 = size - length11;
    while (it2 !== size && b58[it2] === 0) {
      it2++;
    }
    var str = LEADER.repeat(zeroes);
    for (; it2 < size; ++it2) {
      str += ALPHABET.charAt(b58[it2]);
    }
    return str;
  }
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
    var length11 = 0;
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
      for (var it3 = size - 1; (carry !== 0 || i2 < length11) && it3 !== -1; it3--, i2++) {
        carry += BASE * b256[it3] >>> 0;
        b256[it3] = carry % 256 >>> 0;
        carry = carry / 256 >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length11 = i2;
      psz++;
    }
    if (source[psz] === " ") {
      return;
    }
    var it4 = size - length11;
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
  function decode49(string5) {
    var buffer3 = decodeUnsafe(string5);
    if (buffer3) {
      return buffer3;
    }
    throw new Error(`Non-${name8} character`);
  }
  return {
    encode: encode33,
    decodeUnsafe,
    decode: decode49
  };
}
var src4 = base4;
var _brrp__multiformats_scope_baseX4 = src4;
var base_x_default4 = _brrp__multiformats_scope_baseX4;

// node_modules/@multiformats/murmur3/node_modules/multiformats/dist/src/bases/base.js
var Encoder4 = class {
  name;
  prefix;
  baseEncode;
  constructor(name8, prefix, baseEncode) {
    this.name = name8;
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
var Decoder4 = class {
  name;
  prefix;
  baseDecode;
  prefixCodePoint;
  constructor(name8, prefix, baseDecode) {
    this.name = name8;
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
    return or4(this, decoder);
  }
};
var ComposedDecoder4 = class {
  decoders;
  constructor(decoders) {
    this.decoders = decoders;
  }
  or(decoder) {
    return or4(this, decoder);
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
function or4(left, right) {
  return new ComposedDecoder4({
    ...left.decoders ?? { [left.prefix]: left },
    ...right.decoders ?? { [right.prefix]: right }
  });
}
var Codec4 = class {
  name;
  prefix;
  baseEncode;
  baseDecode;
  encoder;
  decoder;
  constructor(name8, prefix, baseEncode, baseDecode) {
    this.name = name8;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
    this.baseDecode = baseDecode;
    this.encoder = new Encoder4(name8, prefix, baseEncode);
    this.decoder = new Decoder4(name8, prefix, baseDecode);
  }
  encode(input) {
    return this.encoder.encode(input);
  }
  decode(input) {
    return this.decoder.decode(input);
  }
};
function from6({ name: name8, prefix, encode: encode33, decode: decode49 }) {
  return new Codec4(name8, prefix, encode33, decode49);
}
function baseX4({ name: name8, prefix, alphabet: alphabet5 }) {
  const { encode: encode33, decode: decode49 } = base_x_default4(alphabet5, name8);
  return from6({
    prefix,
    name: name8,
    encode: encode33,
    decode: (text) => coerce4(decode49(text))
  });
}
function decode17(string5, alphabet5, bitsPerChar, name8) {
  const codes = {};
  for (let i = 0; i < alphabet5.length; ++i) {
    codes[alphabet5[i]] = i;
  }
  let end = string5.length;
  while (string5[end - 1] === "=") {
    --end;
  }
  const out = new Uint8Array(end * bitsPerChar / 8 | 0);
  let bits = 0;
  let buffer3 = 0;
  let written = 0;
  for (let i = 0; i < end; ++i) {
    const value = codes[string5[i]];
    if (value === void 0) {
      throw new SyntaxError(`Non-${name8} character`);
    }
    buffer3 = buffer3 << bitsPerChar | value;
    bits += bitsPerChar;
    if (bits >= 8) {
      bits -= 8;
      out[written++] = 255 & buffer3 >> bits;
    }
  }
  if (bits >= bitsPerChar || (255 & buffer3 << 8 - bits) !== 0) {
    throw new SyntaxError("Unexpected end of data");
  }
  return out;
}
function encode13(data, alphabet5, bitsPerChar) {
  const pad = alphabet5[alphabet5.length - 1] === "=";
  const mask = (1 << bitsPerChar) - 1;
  let out = "";
  let bits = 0;
  let buffer3 = 0;
  for (let i = 0; i < data.length; ++i) {
    buffer3 = buffer3 << 8 | data[i];
    bits += 8;
    while (bits > bitsPerChar) {
      bits -= bitsPerChar;
      out += alphabet5[mask & buffer3 >> bits];
    }
  }
  if (bits !== 0) {
    out += alphabet5[mask & buffer3 << bitsPerChar - bits];
  }
  if (pad) {
    while ((out.length * bitsPerChar & 7) !== 0) {
      out += "=";
    }
  }
  return out;
}
function rfc46484({ name: name8, prefix, bitsPerChar, alphabet: alphabet5 }) {
  return from6({
    prefix,
    name: name8,
    encode(input) {
      return encode13(input, alphabet5, bitsPerChar);
    },
    decode(input) {
      return decode17(input, alphabet5, bitsPerChar, name8);
    }
  });
}

// node_modules/@multiformats/murmur3/node_modules/multiformats/dist/src/bases/base32.js
var base324 = rfc46484({
  prefix: "b",
  name: "base32",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567",
  bitsPerChar: 5
});
var base32upper4 = rfc46484({
  prefix: "B",
  name: "base32upper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
  bitsPerChar: 5
});
var base32pad4 = rfc46484({
  prefix: "c",
  name: "base32pad",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
  bitsPerChar: 5
});
var base32padupper4 = rfc46484({
  prefix: "C",
  name: "base32padupper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
  bitsPerChar: 5
});
var base32hex4 = rfc46484({
  prefix: "v",
  name: "base32hex",
  alphabet: "0123456789abcdefghijklmnopqrstuv",
  bitsPerChar: 5
});
var base32hexupper4 = rfc46484({
  prefix: "V",
  name: "base32hexupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
  bitsPerChar: 5
});
var base32hexpad4 = rfc46484({
  prefix: "t",
  name: "base32hexpad",
  alphabet: "0123456789abcdefghijklmnopqrstuv=",
  bitsPerChar: 5
});
var base32hexpadupper4 = rfc46484({
  prefix: "T",
  name: "base32hexpadupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
  bitsPerChar: 5
});
var base32z4 = rfc46484({
  prefix: "h",
  name: "base32z",
  alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
  bitsPerChar: 5
});

// node_modules/@multiformats/murmur3/node_modules/multiformats/dist/src/bases/base58.js
var base58btc4 = baseX4({
  name: "base58btc",
  prefix: "z",
  alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
});
var base58flickr4 = baseX4({
  name: "base58flickr",
  prefix: "Z",
  alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
});

// node_modules/@multiformats/murmur3/node_modules/multiformats/dist/src/vendor/varint.js
var encode_14 = encode14;
var MSB5 = 128;
var REST5 = 127;
var MSBALL4 = ~REST5;
var INT4 = Math.pow(2, 31);
function encode14(num, out, offset) {
  out = out || [];
  offset = offset || 0;
  var oldOffset = offset;
  while (num >= INT4) {
    out[offset++] = num & 255 | MSB5;
    num /= 128;
  }
  while (num & MSBALL4) {
    out[offset++] = num & 255 | MSB5;
    num >>>= 7;
  }
  out[offset] = num | 0;
  encode14.bytes = offset - oldOffset + 1;
  return out;
}
var decode18 = read5;
var MSB$14 = 128;
var REST$14 = 127;
function read5(buf3, offset) {
  var res = 0, offset = offset || 0, shift = 0, counter = offset, b, l = buf3.length;
  do {
    if (counter >= l) {
      read5.bytes = 0;
      throw new RangeError("Could not decode varint");
    }
    b = buf3[counter++];
    res += shift < 28 ? (b & REST$14) << shift : (b & REST$14) * Math.pow(2, shift);
    shift += 7;
  } while (b >= MSB$14);
  read5.bytes = counter - offset;
  return res;
}
var N15 = Math.pow(2, 7);
var N25 = Math.pow(2, 14);
var N35 = Math.pow(2, 21);
var N45 = Math.pow(2, 28);
var N55 = Math.pow(2, 35);
var N65 = Math.pow(2, 42);
var N75 = Math.pow(2, 49);
var N84 = Math.pow(2, 56);
var N94 = Math.pow(2, 63);
var length5 = function(value) {
  return value < N15 ? 1 : value < N25 ? 2 : value < N35 ? 3 : value < N45 ? 4 : value < N55 ? 5 : value < N65 ? 6 : value < N75 ? 7 : value < N84 ? 8 : value < N94 ? 9 : 10;
};
var varint4 = {
  encode: encode_14,
  decode: decode18,
  encodingLength: length5
};
var _brrp_varint4 = varint4;
var varint_default4 = _brrp_varint4;

// node_modules/@multiformats/murmur3/node_modules/multiformats/dist/src/varint.js
function decode19(data, offset = 0) {
  const code13 = varint_default4.decode(data, offset);
  return [code13, varint_default4.decode.bytes];
}
function encodeTo4(int, target, offset = 0) {
  varint_default4.encode(int, target, offset);
  return target;
}
function encodingLength5(int) {
  return varint_default4.encodingLength(int);
}

// node_modules/@multiformats/murmur3/node_modules/multiformats/dist/src/hashes/digest.js
function create4(code13, digest6) {
  const size = digest6.byteLength;
  const sizeOffset = encodingLength5(code13);
  const digestOffset = sizeOffset + encodingLength5(size);
  const bytes = new Uint8Array(digestOffset + size);
  encodeTo4(code13, bytes, 0);
  encodeTo4(size, bytes, sizeOffset);
  bytes.set(digest6, digestOffset);
  return new Digest4(code13, size, digest6, bytes);
}
function decode20(multihash) {
  const bytes = coerce4(multihash);
  const [code13, sizeOffset] = decode19(bytes);
  const [size, digestOffset] = decode19(bytes.subarray(sizeOffset));
  const digest6 = bytes.subarray(sizeOffset + digestOffset);
  if (digest6.byteLength !== size) {
    throw new Error("Incorrect length");
  }
  return new Digest4(code13, size, digest6, bytes);
}
function equals9(a, b) {
  if (a === b) {
    return true;
  } else {
    const data = b;
    return a.code === data.code && a.size === data.size && data.bytes instanceof Uint8Array && equals8(a.bytes, data.bytes);
  }
}
var Digest4 = class {
  code;
  size;
  digest;
  bytes;
  /**
   * Creates a multihash digest.
   */
  constructor(code13, size, digest6, bytes) {
    this.code = code13;
    this.size = size;
    this.digest = digest6;
    this.bytes = bytes;
  }
};

// node_modules/@multiformats/murmur3/node_modules/multiformats/dist/src/cid.js
function format4(link, base12) {
  const { bytes, version } = link;
  switch (version) {
    case 0:
      return toStringV04(bytes, baseCache4(link), base12 ?? base58btc4.encoder);
    default:
      return toStringV14(bytes, baseCache4(link), base12 ?? base324.encoder);
  }
}
var cache4 = /* @__PURE__ */ new WeakMap();
function baseCache4(cid) {
  const baseCache10 = cache4.get(cid);
  if (baseCache10 == null) {
    const baseCache11 = /* @__PURE__ */ new Map();
    cache4.set(cid, baseCache11);
    return baseCache11;
  }
  return baseCache10;
}
var CID4 = class _CID {
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
  constructor(version, code13, multihash, bytes) {
    this.code = code13;
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
        const { code: code13, multihash } = this;
        if (code13 !== DAG_PB_CODE4) {
          throw new Error("Cannot convert a non dag-pb CID to CIDv0");
        }
        if (multihash.code !== SHA_256_CODE4) {
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
        const { code: code13, digest: digest6 } = this.multihash;
        const multihash = create4(code13, digest6);
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
    return unknown != null && self.code === unknown.code && self.version === unknown.version && equals9(self.multihash, unknown.multihash);
  }
  toString(base12) {
    return format4(this, base12);
  }
  toJSON() {
    return { "/": format4(this) };
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
      const { version, code: code13, multihash, bytes } = value;
      return new _CID(version, code13, multihash, bytes ?? encodeCID4(version, code13, multihash.bytes));
    } else if (value[cidSymbol4] === true) {
      const { version, multihash, code: code13 } = value;
      const digest6 = decode20(multihash);
      return _CID.create(version, code13, digest6);
    } else {
      return null;
    }
  }
  /**
   * @param version - Version of the CID
   * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
   * @param digest - (Multi)hash of the of the content.
   */
  static create(version, code13, digest6) {
    if (typeof code13 !== "number") {
      throw new Error("String codecs are no longer supported");
    }
    if (!(digest6.bytes instanceof Uint8Array)) {
      throw new Error("Invalid digest");
    }
    switch (version) {
      case 0: {
        if (code13 !== DAG_PB_CODE4) {
          throw new Error(`Version 0 CID must use dag-pb (code: ${DAG_PB_CODE4}) block encoding`);
        } else {
          return new _CID(version, code13, digest6, digest6.bytes);
        }
      }
      case 1: {
        const bytes = encodeCID4(version, code13, digest6.bytes);
        return new _CID(version, code13, digest6, bytes);
      }
      default: {
        throw new Error("Invalid version");
      }
    }
  }
  /**
   * Simplified version of `create` for CIDv0.
   */
  static createV0(digest6) {
    return _CID.create(0, DAG_PB_CODE4, digest6);
  }
  /**
   * Simplified version of `create` for CIDv1.
   *
   * @param code - Content encoding format code.
   * @param digest - Multihash of the content.
   */
  static createV1(code13, digest6) {
    return _CID.create(1, code13, digest6);
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
    const multihashBytes = coerce4(bytes.subarray(prefixSize, prefixSize + specs.multihashSize));
    if (multihashBytes.byteLength !== specs.multihashSize) {
      throw new Error("Incorrect length");
    }
    const digestBytes = multihashBytes.subarray(specs.multihashSize - specs.digestSize);
    const digest6 = new Digest4(specs.multihashCode, specs.digestSize, digestBytes, multihashBytes);
    const cid = specs.version === 0 ? _CID.createV0(digest6) : _CID.createV1(specs.codec, digest6);
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
    const next = () => {
      const [i, length11] = decode19(initialBytes.subarray(offset));
      offset += length11;
      return i;
    };
    let version = next();
    let codec = DAG_PB_CODE4;
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
  static parse(source, base12) {
    const [prefix, bytes] = parseCIDtoBytes4(source, base12);
    const cid = _CID.decode(bytes);
    if (cid.version === 0 && source[0] !== "Q") {
      throw Error("Version 0 CID string must not include multibase prefix");
    }
    baseCache4(cid).set(prefix, source);
    return cid;
  }
};
function parseCIDtoBytes4(source, base12) {
  switch (source[0]) {
    case "Q": {
      const decoder = base12 ?? base58btc4;
      return [
        base58btc4.prefix,
        decoder.decode(`${base58btc4.prefix}${source}`)
      ];
    }
    case base58btc4.prefix: {
      const decoder = base12 ?? base58btc4;
      return [base58btc4.prefix, decoder.decode(source)];
    }
    case base324.prefix: {
      const decoder = base12 ?? base324;
      return [base324.prefix, decoder.decode(source)];
    }
    default: {
      if (base12 == null) {
        throw Error("To parse non base32 or base58btc encoded CID multibase decoder must be provided");
      }
      return [source[0], base12.decode(source)];
    }
  }
}
function toStringV04(bytes, cache10, base12) {
  const { prefix } = base12;
  if (prefix !== base58btc4.prefix) {
    throw Error(`Cannot string encode V0 in ${base12.name} encoding`);
  }
  const cid = cache10.get(prefix);
  if (cid == null) {
    const cid2 = base12.encode(bytes).slice(1);
    cache10.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
function toStringV14(bytes, cache10, base12) {
  const { prefix } = base12;
  const cid = cache10.get(prefix);
  if (cid == null) {
    const cid2 = base12.encode(bytes);
    cache10.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
var DAG_PB_CODE4 = 112;
var SHA_256_CODE4 = 18;
function encodeCID4(version, code13, multihash) {
  const codeOffset = encodingLength5(version);
  const hashOffset = codeOffset + encodingLength5(code13);
  const bytes = new Uint8Array(hashOffset + multihash.byteLength);
  encodeTo4(version, bytes, 0);
  encodeTo4(code13, bytes, codeOffset);
  bytes.set(multihash, hashOffset);
  return bytes;
}
var cidSymbol4 = Symbol.for("@ipld/js-cid/CID");

// node_modules/@multiformats/murmur3/node_modules/multiformats/dist/src/hashes/hasher.js
function from7({ name: name8, code: code13, encode: encode33 }) {
  return new Hasher3(name8, code13, encode33);
}
var Hasher3 = class {
  name;
  code;
  encode;
  constructor(name8, code13, encode33) {
    this.name = name8;
    this.code = code13;
    this.encode = encode33;
  }
  digest(input) {
    if (input instanceof Uint8Array) {
      const result = this.encode(input);
      return result instanceof Uint8Array ? create4(this.code, result) : result.then((digest6) => create4(this.code, digest6));
    } else {
      throw Error("Unknown type, must be binary type");
    }
  }
};

// node_modules/@multiformats/murmur3/src/index.js
var import_murmurhash3js_revisited = __toESM(require_murmurhash3js_revisited(), 1);
function fromNumberTo32BitBuf(number) {
  const bytes = new Array(4);
  for (let i = 0; i < 4; i++) {
    bytes[i] = number & 255;
    number = number >> 8;
  }
  return new Uint8Array(bytes);
}
var murmur332 = from7({
  name: "murmur3-32",
  code: 35,
  encode: (input) => fromNumberTo32BitBuf(import_murmurhash3js_revisited.default.x86.hash32(input))
});
var murmur3128 = from7({
  name: "murmur3-128",
  code: 34,
  encode: (input) => bytes_exports3.fromHex(import_murmurhash3js_revisited.default.x64.hash128(input))
});
var murmur364 = from7({
  name: "murmur3-x64-64",
  code: 34,
  encode: (input) => bytes_exports3.fromHex(import_murmurhash3js_revisited.default.x64.hash128(input)).subarray(0, 8)
});

// node_modules/hamt-sharding/dist/src/bucket.js
var import_sparse_array = __toESM(require_sparse_array(), 1);

// node_modules/hamt-sharding/node_modules/multiformats/dist/src/bases/base10.js
var base10_exports3 = {};
__export(base10_exports3, {
  base10: () => base103
});

// node_modules/hamt-sharding/node_modules/multiformats/dist/src/bytes.js
var empty5 = new Uint8Array(0);
function equals10(aa, bb) {
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
function coerce5(o) {
  if (o instanceof Uint8Array && o.constructor.name === "Uint8Array")
    return o;
  if (o instanceof ArrayBuffer)
    return new Uint8Array(o);
  if (ArrayBuffer.isView(o)) {
    return new Uint8Array(o.buffer, o.byteOffset, o.byteLength);
  }
  throw new Error("Unknown type, must be binary type");
}
function fromString6(str) {
  return new TextEncoder().encode(str);
}
function toString4(b) {
  return new TextDecoder().decode(b);
}

// node_modules/hamt-sharding/node_modules/multiformats/dist/src/vendor/base-x.js
function base5(ALPHABET, name8) {
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
  function encode33(source) {
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
    var length11 = 0;
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
      for (var it1 = size - 1; (carry !== 0 || i2 < length11) && it1 !== -1; it1--, i2++) {
        carry += 256 * b58[it1] >>> 0;
        b58[it1] = carry % BASE >>> 0;
        carry = carry / BASE >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length11 = i2;
      pbegin++;
    }
    var it2 = size - length11;
    while (it2 !== size && b58[it2] === 0) {
      it2++;
    }
    var str = LEADER.repeat(zeroes);
    for (; it2 < size; ++it2) {
      str += ALPHABET.charAt(b58[it2]);
    }
    return str;
  }
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
    var length11 = 0;
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
      for (var it3 = size - 1; (carry !== 0 || i2 < length11) && it3 !== -1; it3--, i2++) {
        carry += BASE * b256[it3] >>> 0;
        b256[it3] = carry % 256 >>> 0;
        carry = carry / 256 >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length11 = i2;
      psz++;
    }
    if (source[psz] === " ") {
      return;
    }
    var it4 = size - length11;
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
  function decode49(string5) {
    var buffer3 = decodeUnsafe(string5);
    if (buffer3) {
      return buffer3;
    }
    throw new Error(`Non-${name8} character`);
  }
  return {
    encode: encode33,
    decodeUnsafe,
    decode: decode49
  };
}
var src5 = base5;
var _brrp__multiformats_scope_baseX5 = src5;
var base_x_default5 = _brrp__multiformats_scope_baseX5;

// node_modules/hamt-sharding/node_modules/multiformats/dist/src/bases/base.js
var Encoder5 = class {
  name;
  prefix;
  baseEncode;
  constructor(name8, prefix, baseEncode) {
    this.name = name8;
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
var Decoder5 = class {
  name;
  prefix;
  baseDecode;
  prefixCodePoint;
  constructor(name8, prefix, baseDecode) {
    this.name = name8;
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
    return or5(this, decoder);
  }
};
var ComposedDecoder5 = class {
  decoders;
  constructor(decoders) {
    this.decoders = decoders;
  }
  or(decoder) {
    return or5(this, decoder);
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
function or5(left, right) {
  return new ComposedDecoder5({
    ...left.decoders ?? { [left.prefix]: left },
    ...right.decoders ?? { [right.prefix]: right }
  });
}
var Codec5 = class {
  name;
  prefix;
  baseEncode;
  baseDecode;
  encoder;
  decoder;
  constructor(name8, prefix, baseEncode, baseDecode) {
    this.name = name8;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
    this.baseDecode = baseDecode;
    this.encoder = new Encoder5(name8, prefix, baseEncode);
    this.decoder = new Decoder5(name8, prefix, baseDecode);
  }
  encode(input) {
    return this.encoder.encode(input);
  }
  decode(input) {
    return this.decoder.decode(input);
  }
};
function from8({ name: name8, prefix, encode: encode33, decode: decode49 }) {
  return new Codec5(name8, prefix, encode33, decode49);
}
function baseX5({ name: name8, prefix, alphabet: alphabet5 }) {
  const { encode: encode33, decode: decode49 } = base_x_default5(alphabet5, name8);
  return from8({
    prefix,
    name: name8,
    encode: encode33,
    decode: (text) => coerce5(decode49(text))
  });
}
function decode21(string5, alphabet5, bitsPerChar, name8) {
  const codes = {};
  for (let i = 0; i < alphabet5.length; ++i) {
    codes[alphabet5[i]] = i;
  }
  let end = string5.length;
  while (string5[end - 1] === "=") {
    --end;
  }
  const out = new Uint8Array(end * bitsPerChar / 8 | 0);
  let bits = 0;
  let buffer3 = 0;
  let written = 0;
  for (let i = 0; i < end; ++i) {
    const value = codes[string5[i]];
    if (value === void 0) {
      throw new SyntaxError(`Non-${name8} character`);
    }
    buffer3 = buffer3 << bitsPerChar | value;
    bits += bitsPerChar;
    if (bits >= 8) {
      bits -= 8;
      out[written++] = 255 & buffer3 >> bits;
    }
  }
  if (bits >= bitsPerChar || (255 & buffer3 << 8 - bits) !== 0) {
    throw new SyntaxError("Unexpected end of data");
  }
  return out;
}
function encode15(data, alphabet5, bitsPerChar) {
  const pad = alphabet5[alphabet5.length - 1] === "=";
  const mask = (1 << bitsPerChar) - 1;
  let out = "";
  let bits = 0;
  let buffer3 = 0;
  for (let i = 0; i < data.length; ++i) {
    buffer3 = buffer3 << 8 | data[i];
    bits += 8;
    while (bits > bitsPerChar) {
      bits -= bitsPerChar;
      out += alphabet5[mask & buffer3 >> bits];
    }
  }
  if (bits !== 0) {
    out += alphabet5[mask & buffer3 << bitsPerChar - bits];
  }
  if (pad) {
    while ((out.length * bitsPerChar & 7) !== 0) {
      out += "=";
    }
  }
  return out;
}
function rfc46485({ name: name8, prefix, bitsPerChar, alphabet: alphabet5 }) {
  return from8({
    prefix,
    name: name8,
    encode(input) {
      return encode15(input, alphabet5, bitsPerChar);
    },
    decode(input) {
      return decode21(input, alphabet5, bitsPerChar, name8);
    }
  });
}

// node_modules/hamt-sharding/node_modules/multiformats/dist/src/bases/base10.js
var base103 = baseX5({
  prefix: "9",
  name: "base10",
  alphabet: "0123456789"
});

// node_modules/hamt-sharding/node_modules/multiformats/dist/src/bases/base16.js
var base16_exports3 = {};
__export(base16_exports3, {
  base16: () => base163,
  base16upper: () => base16upper3
});
var base163 = rfc46485({
  prefix: "f",
  name: "base16",
  alphabet: "0123456789abcdef",
  bitsPerChar: 4
});
var base16upper3 = rfc46485({
  prefix: "F",
  name: "base16upper",
  alphabet: "0123456789ABCDEF",
  bitsPerChar: 4
});

// node_modules/hamt-sharding/node_modules/multiformats/dist/src/bases/base2.js
var base2_exports3 = {};
__export(base2_exports3, {
  base2: () => base24
});
var base24 = rfc46485({
  prefix: "0",
  name: "base2",
  alphabet: "01",
  bitsPerChar: 1
});

// node_modules/hamt-sharding/node_modules/multiformats/dist/src/bases/base256emoji.js
var base256emoji_exports3 = {};
__export(base256emoji_exports3, {
  base256emoji: () => base256emoji3
});
var alphabet3 = Array.from("\u{1F680}\u{1FA90}\u2604\u{1F6F0}\u{1F30C}\u{1F311}\u{1F312}\u{1F313}\u{1F314}\u{1F315}\u{1F316}\u{1F317}\u{1F318}\u{1F30D}\u{1F30F}\u{1F30E}\u{1F409}\u2600\u{1F4BB}\u{1F5A5}\u{1F4BE}\u{1F4BF}\u{1F602}\u2764\u{1F60D}\u{1F923}\u{1F60A}\u{1F64F}\u{1F495}\u{1F62D}\u{1F618}\u{1F44D}\u{1F605}\u{1F44F}\u{1F601}\u{1F525}\u{1F970}\u{1F494}\u{1F496}\u{1F499}\u{1F622}\u{1F914}\u{1F606}\u{1F644}\u{1F4AA}\u{1F609}\u263A\u{1F44C}\u{1F917}\u{1F49C}\u{1F614}\u{1F60E}\u{1F607}\u{1F339}\u{1F926}\u{1F389}\u{1F49E}\u270C\u2728\u{1F937}\u{1F631}\u{1F60C}\u{1F338}\u{1F64C}\u{1F60B}\u{1F497}\u{1F49A}\u{1F60F}\u{1F49B}\u{1F642}\u{1F493}\u{1F929}\u{1F604}\u{1F600}\u{1F5A4}\u{1F603}\u{1F4AF}\u{1F648}\u{1F447}\u{1F3B6}\u{1F612}\u{1F92D}\u2763\u{1F61C}\u{1F48B}\u{1F440}\u{1F62A}\u{1F611}\u{1F4A5}\u{1F64B}\u{1F61E}\u{1F629}\u{1F621}\u{1F92A}\u{1F44A}\u{1F973}\u{1F625}\u{1F924}\u{1F449}\u{1F483}\u{1F633}\u270B\u{1F61A}\u{1F61D}\u{1F634}\u{1F31F}\u{1F62C}\u{1F643}\u{1F340}\u{1F337}\u{1F63B}\u{1F613}\u2B50\u2705\u{1F97A}\u{1F308}\u{1F608}\u{1F918}\u{1F4A6}\u2714\u{1F623}\u{1F3C3}\u{1F490}\u2639\u{1F38A}\u{1F498}\u{1F620}\u261D\u{1F615}\u{1F33A}\u{1F382}\u{1F33B}\u{1F610}\u{1F595}\u{1F49D}\u{1F64A}\u{1F639}\u{1F5E3}\u{1F4AB}\u{1F480}\u{1F451}\u{1F3B5}\u{1F91E}\u{1F61B}\u{1F534}\u{1F624}\u{1F33C}\u{1F62B}\u26BD\u{1F919}\u2615\u{1F3C6}\u{1F92B}\u{1F448}\u{1F62E}\u{1F646}\u{1F37B}\u{1F343}\u{1F436}\u{1F481}\u{1F632}\u{1F33F}\u{1F9E1}\u{1F381}\u26A1\u{1F31E}\u{1F388}\u274C\u270A\u{1F44B}\u{1F630}\u{1F928}\u{1F636}\u{1F91D}\u{1F6B6}\u{1F4B0}\u{1F353}\u{1F4A2}\u{1F91F}\u{1F641}\u{1F6A8}\u{1F4A8}\u{1F92C}\u2708\u{1F380}\u{1F37A}\u{1F913}\u{1F619}\u{1F49F}\u{1F331}\u{1F616}\u{1F476}\u{1F974}\u25B6\u27A1\u2753\u{1F48E}\u{1F4B8}\u2B07\u{1F628}\u{1F31A}\u{1F98B}\u{1F637}\u{1F57A}\u26A0\u{1F645}\u{1F61F}\u{1F635}\u{1F44E}\u{1F932}\u{1F920}\u{1F927}\u{1F4CC}\u{1F535}\u{1F485}\u{1F9D0}\u{1F43E}\u{1F352}\u{1F617}\u{1F911}\u{1F30A}\u{1F92F}\u{1F437}\u260E\u{1F4A7}\u{1F62F}\u{1F486}\u{1F446}\u{1F3A4}\u{1F647}\u{1F351}\u2744\u{1F334}\u{1F4A3}\u{1F438}\u{1F48C}\u{1F4CD}\u{1F940}\u{1F922}\u{1F445}\u{1F4A1}\u{1F4A9}\u{1F450}\u{1F4F8}\u{1F47B}\u{1F910}\u{1F92E}\u{1F3BC}\u{1F975}\u{1F6A9}\u{1F34E}\u{1F34A}\u{1F47C}\u{1F48D}\u{1F4E3}\u{1F942}");
var alphabetBytesToChars3 = alphabet3.reduce((p, c, i) => {
  p[i] = c;
  return p;
}, []);
var alphabetCharsToBytes3 = alphabet3.reduce((p, c, i) => {
  p[c.codePointAt(0)] = i;
  return p;
}, []);
function encode16(data) {
  return data.reduce((p, c) => {
    p += alphabetBytesToChars3[c];
    return p;
  }, "");
}
function decode22(str) {
  const byts = [];
  for (const char of str) {
    const byt = alphabetCharsToBytes3[char.codePointAt(0)];
    if (byt === void 0) {
      throw new Error(`Non-base256emoji character: ${char}`);
    }
    byts.push(byt);
  }
  return new Uint8Array(byts);
}
var base256emoji3 = from8({
  prefix: "\u{1F680}",
  name: "base256emoji",
  encode: encode16,
  decode: decode22
});

// node_modules/hamt-sharding/node_modules/multiformats/dist/src/bases/base32.js
var base32_exports3 = {};
__export(base32_exports3, {
  base32: () => base325,
  base32hex: () => base32hex5,
  base32hexpad: () => base32hexpad5,
  base32hexpadupper: () => base32hexpadupper5,
  base32hexupper: () => base32hexupper5,
  base32pad: () => base32pad5,
  base32padupper: () => base32padupper5,
  base32upper: () => base32upper5,
  base32z: () => base32z5
});
var base325 = rfc46485({
  prefix: "b",
  name: "base32",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567",
  bitsPerChar: 5
});
var base32upper5 = rfc46485({
  prefix: "B",
  name: "base32upper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
  bitsPerChar: 5
});
var base32pad5 = rfc46485({
  prefix: "c",
  name: "base32pad",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
  bitsPerChar: 5
});
var base32padupper5 = rfc46485({
  prefix: "C",
  name: "base32padupper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
  bitsPerChar: 5
});
var base32hex5 = rfc46485({
  prefix: "v",
  name: "base32hex",
  alphabet: "0123456789abcdefghijklmnopqrstuv",
  bitsPerChar: 5
});
var base32hexupper5 = rfc46485({
  prefix: "V",
  name: "base32hexupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
  bitsPerChar: 5
});
var base32hexpad5 = rfc46485({
  prefix: "t",
  name: "base32hexpad",
  alphabet: "0123456789abcdefghijklmnopqrstuv=",
  bitsPerChar: 5
});
var base32hexpadupper5 = rfc46485({
  prefix: "T",
  name: "base32hexpadupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
  bitsPerChar: 5
});
var base32z5 = rfc46485({
  prefix: "h",
  name: "base32z",
  alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
  bitsPerChar: 5
});

// node_modules/hamt-sharding/node_modules/multiformats/dist/src/bases/base36.js
var base36_exports3 = {};
__export(base36_exports3, {
  base36: () => base363,
  base36upper: () => base36upper3
});
var base363 = baseX5({
  prefix: "k",
  name: "base36",
  alphabet: "0123456789abcdefghijklmnopqrstuvwxyz"
});
var base36upper3 = baseX5({
  prefix: "K",
  name: "base36upper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
});

// node_modules/hamt-sharding/node_modules/multiformats/dist/src/bases/base58.js
var base58_exports3 = {};
__export(base58_exports3, {
  base58btc: () => base58btc5,
  base58flickr: () => base58flickr5
});
var base58btc5 = baseX5({
  name: "base58btc",
  prefix: "z",
  alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
});
var base58flickr5 = baseX5({
  name: "base58flickr",
  prefix: "Z",
  alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
});

// node_modules/hamt-sharding/node_modules/multiformats/dist/src/bases/base64.js
var base64_exports3 = {};
__export(base64_exports3, {
  base64: () => base643,
  base64pad: () => base64pad3,
  base64url: () => base64url3,
  base64urlpad: () => base64urlpad3
});
var base643 = rfc46485({
  prefix: "m",
  name: "base64",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
  bitsPerChar: 6
});
var base64pad3 = rfc46485({
  prefix: "M",
  name: "base64pad",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  bitsPerChar: 6
});
var base64url3 = rfc46485({
  prefix: "u",
  name: "base64url",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
  bitsPerChar: 6
});
var base64urlpad3 = rfc46485({
  prefix: "U",
  name: "base64urlpad",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
  bitsPerChar: 6
});

// node_modules/hamt-sharding/node_modules/multiformats/dist/src/bases/base8.js
var base8_exports3 = {};
__export(base8_exports3, {
  base8: () => base83
});
var base83 = rfc46485({
  prefix: "7",
  name: "base8",
  alphabet: "01234567",
  bitsPerChar: 3
});

// node_modules/hamt-sharding/node_modules/multiformats/dist/src/bases/identity.js
var identity_exports5 = {};
__export(identity_exports5, {
  identity: () => identity5
});
var identity5 = from8({
  prefix: "\0",
  name: "identity",
  encode: (buf3) => toString4(buf3),
  decode: (str) => fromString6(str)
});

// node_modules/hamt-sharding/node_modules/multiformats/dist/src/codecs/json.js
var textEncoder5 = new TextEncoder();
var textDecoder4 = new TextDecoder();

// node_modules/hamt-sharding/node_modules/multiformats/dist/src/hashes/identity.js
var identity_exports6 = {};
__export(identity_exports6, {
  identity: () => identity6
});

// node_modules/hamt-sharding/node_modules/multiformats/dist/src/vendor/varint.js
var encode_15 = encode17;
var MSB6 = 128;
var REST6 = 127;
var MSBALL5 = ~REST6;
var INT5 = Math.pow(2, 31);
function encode17(num, out, offset) {
  out = out || [];
  offset = offset || 0;
  var oldOffset = offset;
  while (num >= INT5) {
    out[offset++] = num & 255 | MSB6;
    num /= 128;
  }
  while (num & MSBALL5) {
    out[offset++] = num & 255 | MSB6;
    num >>>= 7;
  }
  out[offset] = num | 0;
  encode17.bytes = offset - oldOffset + 1;
  return out;
}
var decode23 = read6;
var MSB$15 = 128;
var REST$15 = 127;
function read6(buf3, offset) {
  var res = 0, offset = offset || 0, shift = 0, counter = offset, b, l = buf3.length;
  do {
    if (counter >= l) {
      read6.bytes = 0;
      throw new RangeError("Could not decode varint");
    }
    b = buf3[counter++];
    res += shift < 28 ? (b & REST$15) << shift : (b & REST$15) * Math.pow(2, shift);
    shift += 7;
  } while (b >= MSB$15);
  read6.bytes = counter - offset;
  return res;
}
var N16 = Math.pow(2, 7);
var N26 = Math.pow(2, 14);
var N36 = Math.pow(2, 21);
var N46 = Math.pow(2, 28);
var N56 = Math.pow(2, 35);
var N66 = Math.pow(2, 42);
var N76 = Math.pow(2, 49);
var N85 = Math.pow(2, 56);
var N95 = Math.pow(2, 63);
var length6 = function(value) {
  return value < N16 ? 1 : value < N26 ? 2 : value < N36 ? 3 : value < N46 ? 4 : value < N56 ? 5 : value < N66 ? 6 : value < N76 ? 7 : value < N85 ? 8 : value < N95 ? 9 : 10;
};
var varint5 = {
  encode: encode_15,
  decode: decode23,
  encodingLength: length6
};
var _brrp_varint5 = varint5;
var varint_default5 = _brrp_varint5;

// node_modules/hamt-sharding/node_modules/multiformats/dist/src/varint.js
function decode24(data, offset = 0) {
  const code13 = varint_default5.decode(data, offset);
  return [code13, varint_default5.decode.bytes];
}
function encodeTo5(int, target, offset = 0) {
  varint_default5.encode(int, target, offset);
  return target;
}
function encodingLength6(int) {
  return varint_default5.encodingLength(int);
}

// node_modules/hamt-sharding/node_modules/multiformats/dist/src/hashes/digest.js
function create5(code13, digest6) {
  const size = digest6.byteLength;
  const sizeOffset = encodingLength6(code13);
  const digestOffset = sizeOffset + encodingLength6(size);
  const bytes = new Uint8Array(digestOffset + size);
  encodeTo5(code13, bytes, 0);
  encodeTo5(size, bytes, sizeOffset);
  bytes.set(digest6, digestOffset);
  return new Digest5(code13, size, digest6, bytes);
}
function decode25(multihash) {
  const bytes = coerce5(multihash);
  const [code13, sizeOffset] = decode24(bytes);
  const [size, digestOffset] = decode24(bytes.subarray(sizeOffset));
  const digest6 = bytes.subarray(sizeOffset + digestOffset);
  if (digest6.byteLength !== size) {
    throw new Error("Incorrect length");
  }
  return new Digest5(code13, size, digest6, bytes);
}
function equals11(a, b) {
  if (a === b) {
    return true;
  } else {
    const data = b;
    return a.code === data.code && a.size === data.size && data.bytes instanceof Uint8Array && equals10(a.bytes, data.bytes);
  }
}
var Digest5 = class {
  code;
  size;
  digest;
  bytes;
  /**
   * Creates a multihash digest.
   */
  constructor(code13, size, digest6, bytes) {
    this.code = code13;
    this.size = size;
    this.digest = digest6;
    this.bytes = bytes;
  }
};

// node_modules/hamt-sharding/node_modules/multiformats/dist/src/hashes/identity.js
var code5 = 0;
var name5 = "identity";
var encode18 = coerce5;
function digest3(input) {
  return create5(code5, encode18(input));
}
var identity6 = { code: code5, name: name5, encode: encode18, digest: digest3 };

// node_modules/hamt-sharding/node_modules/multiformats/dist/src/hashes/sha2-browser.js
var sha2_browser_exports3 = {};
__export(sha2_browser_exports3, {
  sha256: () => sha2563,
  sha512: () => sha5123
});

// node_modules/hamt-sharding/node_modules/multiformats/dist/src/hashes/hasher.js
function from9({ name: name8, code: code13, encode: encode33 }) {
  return new Hasher4(name8, code13, encode33);
}
var Hasher4 = class {
  name;
  code;
  encode;
  constructor(name8, code13, encode33) {
    this.name = name8;
    this.code = code13;
    this.encode = encode33;
  }
  digest(input) {
    if (input instanceof Uint8Array) {
      const result = this.encode(input);
      return result instanceof Uint8Array ? create5(this.code, result) : result.then((digest6) => create5(this.code, digest6));
    } else {
      throw Error("Unknown type, must be binary type");
    }
  }
};

// node_modules/hamt-sharding/node_modules/multiformats/dist/src/hashes/sha2-browser.js
function sha3(name8) {
  return async (data) => new Uint8Array(await crypto.subtle.digest(name8, data));
}
var sha2563 = from9({
  name: "sha2-256",
  code: 18,
  encode: sha3("SHA-256")
});
var sha5123 = from9({
  name: "sha2-512",
  code: 19,
  encode: sha3("SHA-512")
});

// node_modules/hamt-sharding/node_modules/multiformats/dist/src/cid.js
function format5(link, base12) {
  const { bytes, version } = link;
  switch (version) {
    case 0:
      return toStringV05(bytes, baseCache5(link), base12 ?? base58btc5.encoder);
    default:
      return toStringV15(bytes, baseCache5(link), base12 ?? base325.encoder);
  }
}
var cache5 = /* @__PURE__ */ new WeakMap();
function baseCache5(cid) {
  const baseCache10 = cache5.get(cid);
  if (baseCache10 == null) {
    const baseCache11 = /* @__PURE__ */ new Map();
    cache5.set(cid, baseCache11);
    return baseCache11;
  }
  return baseCache10;
}
var CID5 = class _CID {
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
  constructor(version, code13, multihash, bytes) {
    this.code = code13;
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
        const { code: code13, multihash } = this;
        if (code13 !== DAG_PB_CODE5) {
          throw new Error("Cannot convert a non dag-pb CID to CIDv0");
        }
        if (multihash.code !== SHA_256_CODE5) {
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
        const { code: code13, digest: digest6 } = this.multihash;
        const multihash = create5(code13, digest6);
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
    return unknown != null && self.code === unknown.code && self.version === unknown.version && equals11(self.multihash, unknown.multihash);
  }
  toString(base12) {
    return format5(this, base12);
  }
  toJSON() {
    return { "/": format5(this) };
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
      const { version, code: code13, multihash, bytes } = value;
      return new _CID(version, code13, multihash, bytes ?? encodeCID5(version, code13, multihash.bytes));
    } else if (value[cidSymbol5] === true) {
      const { version, multihash, code: code13 } = value;
      const digest6 = decode25(multihash);
      return _CID.create(version, code13, digest6);
    } else {
      return null;
    }
  }
  /**
   * @param version - Version of the CID
   * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
   * @param digest - (Multi)hash of the of the content.
   */
  static create(version, code13, digest6) {
    if (typeof code13 !== "number") {
      throw new Error("String codecs are no longer supported");
    }
    if (!(digest6.bytes instanceof Uint8Array)) {
      throw new Error("Invalid digest");
    }
    switch (version) {
      case 0: {
        if (code13 !== DAG_PB_CODE5) {
          throw new Error(`Version 0 CID must use dag-pb (code: ${DAG_PB_CODE5}) block encoding`);
        } else {
          return new _CID(version, code13, digest6, digest6.bytes);
        }
      }
      case 1: {
        const bytes = encodeCID5(version, code13, digest6.bytes);
        return new _CID(version, code13, digest6, bytes);
      }
      default: {
        throw new Error("Invalid version");
      }
    }
  }
  /**
   * Simplified version of `create` for CIDv0.
   */
  static createV0(digest6) {
    return _CID.create(0, DAG_PB_CODE5, digest6);
  }
  /**
   * Simplified version of `create` for CIDv1.
   *
   * @param code - Content encoding format code.
   * @param digest - Multihash of the content.
   */
  static createV1(code13, digest6) {
    return _CID.create(1, code13, digest6);
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
    const multihashBytes = coerce5(bytes.subarray(prefixSize, prefixSize + specs.multihashSize));
    if (multihashBytes.byteLength !== specs.multihashSize) {
      throw new Error("Incorrect length");
    }
    const digestBytes = multihashBytes.subarray(specs.multihashSize - specs.digestSize);
    const digest6 = new Digest5(specs.multihashCode, specs.digestSize, digestBytes, multihashBytes);
    const cid = specs.version === 0 ? _CID.createV0(digest6) : _CID.createV1(specs.codec, digest6);
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
    const next = () => {
      const [i, length11] = decode24(initialBytes.subarray(offset));
      offset += length11;
      return i;
    };
    let version = next();
    let codec = DAG_PB_CODE5;
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
  static parse(source, base12) {
    const [prefix, bytes] = parseCIDtoBytes5(source, base12);
    const cid = _CID.decode(bytes);
    if (cid.version === 0 && source[0] !== "Q") {
      throw Error("Version 0 CID string must not include multibase prefix");
    }
    baseCache5(cid).set(prefix, source);
    return cid;
  }
};
function parseCIDtoBytes5(source, base12) {
  switch (source[0]) {
    case "Q": {
      const decoder = base12 ?? base58btc5;
      return [
        base58btc5.prefix,
        decoder.decode(`${base58btc5.prefix}${source}`)
      ];
    }
    case base58btc5.prefix: {
      const decoder = base12 ?? base58btc5;
      return [base58btc5.prefix, decoder.decode(source)];
    }
    case base325.prefix: {
      const decoder = base12 ?? base325;
      return [base325.prefix, decoder.decode(source)];
    }
    default: {
      if (base12 == null) {
        throw Error("To parse non base32 or base58btc encoded CID multibase decoder must be provided");
      }
      return [source[0], base12.decode(source)];
    }
  }
}
function toStringV05(bytes, cache10, base12) {
  const { prefix } = base12;
  if (prefix !== base58btc5.prefix) {
    throw Error(`Cannot string encode V0 in ${base12.name} encoding`);
  }
  const cid = cache10.get(prefix);
  if (cid == null) {
    const cid2 = base12.encode(bytes).slice(1);
    cache10.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
function toStringV15(bytes, cache10, base12) {
  const { prefix } = base12;
  const cid = cache10.get(prefix);
  if (cid == null) {
    const cid2 = base12.encode(bytes);
    cache10.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
var DAG_PB_CODE5 = 112;
var SHA_256_CODE5 = 18;
function encodeCID5(version, code13, multihash) {
  const codeOffset = encodingLength6(version);
  const hashOffset = codeOffset + encodingLength6(code13);
  const bytes = new Uint8Array(hashOffset + multihash.byteLength);
  encodeTo5(version, bytes, 0);
  encodeTo5(code13, bytes, codeOffset);
  bytes.set(multihash, hashOffset);
  return bytes;
}
var cidSymbol5 = Symbol.for("@ipld/js-cid/CID");

// node_modules/hamt-sharding/node_modules/multiformats/dist/src/basics.js
var bases3 = { ...identity_exports5, ...base2_exports3, ...base8_exports3, ...base10_exports3, ...base16_exports3, ...base32_exports3, ...base36_exports3, ...base58_exports3, ...base64_exports3, ...base256emoji_exports3 };
var hashes3 = { ...sha2_browser_exports3, ...identity_exports6 };

// node_modules/hamt-sharding/node_modules/uint8arrays/dist/src/alloc.js
function allocUnsafe5(size = 0) {
  return new Uint8Array(size);
}

// node_modules/hamt-sharding/node_modules/uint8arrays/dist/src/util/bases.js
function createCodec4(name8, prefix, encode33, decode49) {
  return {
    name: name8,
    prefix,
    encoder: {
      name: name8,
      prefix,
      encode: encode33
    },
    decoder: {
      decode: decode49
    }
  };
}
var string3 = createCodec4("utf8", "u", (buf3) => {
  const decoder = new TextDecoder("utf8");
  return "u" + decoder.decode(buf3);
}, (str) => {
  const encoder = new TextEncoder();
  return encoder.encode(str.substring(1));
});
var ascii3 = createCodec4("ascii", "a", (buf3) => {
  let string5 = "a";
  for (let i = 0; i < buf3.length; i++) {
    string5 += String.fromCharCode(buf3[i]);
  }
  return string5;
}, (str) => {
  str = str.substring(1);
  const buf3 = allocUnsafe5(str.length);
  for (let i = 0; i < str.length; i++) {
    buf3[i] = str.charCodeAt(i);
  }
  return buf3;
});
var BASES3 = {
  utf8: string3,
  "utf-8": string3,
  hex: bases3.base16,
  latin1: ascii3,
  ascii: ascii3,
  binary: ascii3,
  ...bases3
};
var bases_default3 = BASES3;

// node_modules/hamt-sharding/node_modules/uint8arrays/dist/src/from-string.js
function fromString7(string5, encoding = "utf8") {
  const base12 = bases_default3[encoding];
  if (base12 == null) {
    throw new Error(`Unsupported encoding "${encoding}"`);
  }
  return base12.decoder.decode(`${base12.prefix}${string5}`);
}

// node_modules/hamt-sharding/dist/src/bucket.js
var Bucket = class _Bucket {
  _options;
  _popCount;
  _parent;
  _posAtParent;
  _children;
  key;
  constructor(options, parent, posAtParent = 0) {
    this._options = options;
    this._popCount = 0;
    this._parent = parent;
    this._posAtParent = posAtParent;
    this._children = new import_sparse_array.default();
    this.key = null;
  }
  async put(key, value) {
    const place = await this._findNewBucketAndPos(key);
    place.bucket._putAt(place, key, value);
  }
  async get(key) {
    const child = await this._findChild(key);
    if (child != null) {
      return child.value;
    }
  }
  async del(key) {
    const place = await this._findPlace(key);
    const child = place.bucket._at(place.pos);
    if (child != null && child.key === key) {
      place.bucket._delAt(place.pos);
    }
  }
  leafCount() {
    const children = this._children.compactArray();
    return children.reduce((acc, child) => {
      if (child instanceof _Bucket) {
        return acc + child.leafCount();
      }
      return acc + 1;
    }, 0);
  }
  childrenCount() {
    return this._children.length;
  }
  onlyChild() {
    return this._children.get(0);
  }
  *eachLeafSeries() {
    const children = this._children.compactArray();
    for (const child of children) {
      if (child instanceof _Bucket) {
        yield* child.eachLeafSeries();
      } else {
        yield child;
      }
    }
  }
  serialize(map2, reduce2) {
    const acc = [];
    return reduce2(this._children.reduce((acc2, child, index) => {
      if (child != null) {
        if (child instanceof _Bucket) {
          acc2.push(child.serialize(map2, reduce2));
        } else {
          acc2.push(map2(child, index));
        }
      }
      return acc2;
    }, acc));
  }
  async asyncTransform(asyncMap, asyncReduce) {
    return asyncTransformBucket(this, asyncMap, asyncReduce);
  }
  toJSON() {
    return this.serialize(mapNode, reduceNodes);
  }
  prettyPrint() {
    return JSON.stringify(this.toJSON(), null, "  ");
  }
  tableSize() {
    return Math.pow(2, this._options.bits);
  }
  async _findChild(key) {
    const result = await this._findPlace(key);
    const child = result.bucket._at(result.pos);
    if (child instanceof _Bucket) {
      return void 0;
    }
    if (child != null && child.key === key) {
      return child;
    }
  }
  async _findPlace(key) {
    const hashValue = this._options.hash(typeof key === "string" ? fromString7(key) : key);
    const index = await hashValue.take(this._options.bits);
    const child = this._children.get(index);
    if (child instanceof _Bucket) {
      return child._findPlace(hashValue);
    }
    return {
      bucket: this,
      pos: index,
      hash: hashValue,
      existingChild: child
    };
  }
  async _findNewBucketAndPos(key) {
    const place = await this._findPlace(key);
    if (place.existingChild != null && place.existingChild.key !== key) {
      const bucket = new _Bucket(this._options, place.bucket, place.pos);
      place.bucket._putObjectAt(place.pos, bucket);
      const newPlace = await bucket._findPlace(place.existingChild.hash);
      newPlace.bucket._putAt(newPlace, place.existingChild.key, place.existingChild.value);
      return bucket._findNewBucketAndPos(place.hash);
    }
    return place;
  }
  _putAt(place, key, value) {
    this._putObjectAt(place.pos, {
      key,
      value,
      hash: place.hash
    });
  }
  _putObjectAt(pos, object) {
    if (this._children.get(pos) == null) {
      this._popCount++;
    }
    this._children.set(pos, object);
  }
  _delAt(pos) {
    if (pos === -1) {
      throw new Error("Invalid position");
    }
    if (this._children.get(pos) != null) {
      this._popCount--;
    }
    this._children.unset(pos);
    this._level();
  }
  _level() {
    if (this._parent != null && this._popCount <= 1) {
      if (this._popCount === 1) {
        const onlyChild = this._children.find(exists);
        if (onlyChild != null && !(onlyChild instanceof _Bucket)) {
          const hash = onlyChild.hash;
          hash.untake(this._options.bits);
          const place = {
            pos: this._posAtParent,
            hash,
            bucket: this._parent
          };
          this._parent._putAt(place, onlyChild.key, onlyChild.value);
        }
      } else {
        this._parent._delAt(this._posAtParent);
      }
    }
  }
  _at(index) {
    return this._children.get(index);
  }
};
function exists(o) {
  return Boolean(o);
}
function mapNode(node, _) {
  return node.key;
}
function reduceNodes(nodes) {
  return nodes;
}
async function asyncTransformBucket(bucket, asyncMap, asyncReduce) {
  const output = [];
  for (const child of bucket._children.compactArray()) {
    if (child instanceof Bucket) {
      await asyncTransformBucket(child, asyncMap, asyncReduce);
    } else {
      const mappedChildren = await asyncMap(child);
      output.push({
        bitField: bucket._children.bitField(),
        children: mappedChildren
      });
    }
  }
  return asyncReduce(output);
}

// node_modules/hamt-sharding/node_modules/uint8arrays/dist/src/util/as-uint8array.js
function asUint8Array2(buf3) {
  return buf3;
}

// node_modules/hamt-sharding/node_modules/uint8arrays/dist/src/concat.js
function concat2(arrays, length11) {
  if (length11 == null) {
    length11 = arrays.reduce((acc, curr) => acc + curr.length, 0);
  }
  const output = allocUnsafe5(length11);
  let offset = 0;
  for (const arr of arrays) {
    output.set(arr, offset);
    offset += arr.length;
  }
  return asUint8Array2(output);
}

// node_modules/hamt-sharding/dist/src/consumable-buffer.js
var START_MASKS = [
  255,
  254,
  252,
  248,
  240,
  224,
  192,
  128
];
var STOP_MASKS = [
  1,
  3,
  7,
  15,
  31,
  63,
  127,
  255
];
var ConsumableBuffer = class {
  _value;
  _currentBytePos;
  _currentBitPos;
  constructor(value) {
    this._value = value;
    this._currentBytePos = value.length - 1;
    this._currentBitPos = 7;
  }
  availableBits() {
    return this._currentBitPos + 1 + this._currentBytePos * 8;
  }
  totalBits() {
    return this._value.length * 8;
  }
  take(bits) {
    let pendingBits = bits;
    let result = 0;
    while (pendingBits > 0 && this._haveBits()) {
      const byte = this._value[this._currentBytePos];
      const availableBits = this._currentBitPos + 1;
      const taking = Math.min(availableBits, pendingBits);
      const value = byteBitsToInt(byte, availableBits - taking, taking);
      result = (result << taking) + value;
      pendingBits -= taking;
      this._currentBitPos -= taking;
      if (this._currentBitPos < 0) {
        this._currentBitPos = 7;
        this._currentBytePos--;
      }
    }
    return result;
  }
  untake(bits) {
    this._currentBitPos += bits;
    while (this._currentBitPos > 7) {
      this._currentBitPos -= 8;
      this._currentBytePos += 1;
    }
  }
  _haveBits() {
    return this._currentBytePos >= 0;
  }
};
function byteBitsToInt(byte, start, length11) {
  const mask = maskFor(start, length11);
  return (byte & mask) >>> start;
}
function maskFor(start, length11) {
  return START_MASKS[start] & STOP_MASKS[Math.min(length11 + start - 1, 7)];
}

// node_modules/hamt-sharding/dist/src/consumable-hash.js
function wrapHash(hashFn2) {
  function hashing(value) {
    if (value instanceof InfiniteHash) {
      return value;
    } else {
      return new InfiniteHash(value, hashFn2);
    }
  }
  return hashing;
}
var InfiniteHash = class {
  _value;
  _hashFn;
  _depth;
  _availableBits;
  _currentBufferIndex;
  _buffers;
  constructor(value, hashFn2) {
    if (!(value instanceof Uint8Array)) {
      throw new Error("can only hash Uint8Arrays");
    }
    this._value = value;
    this._hashFn = hashFn2;
    this._depth = -1;
    this._availableBits = 0;
    this._currentBufferIndex = 0;
    this._buffers = [];
  }
  async take(bits) {
    let pendingBits = bits;
    while (this._availableBits < pendingBits) {
      await this._produceMoreBits();
    }
    let result = 0;
    while (pendingBits > 0) {
      const hash = this._buffers[this._currentBufferIndex];
      const available = Math.min(hash.availableBits(), pendingBits);
      const took = hash.take(available);
      result = (result << available) + took;
      pendingBits -= available;
      this._availableBits -= available;
      if (hash.availableBits() === 0) {
        this._currentBufferIndex++;
      }
    }
    return result;
  }
  untake(bits) {
    let pendingBits = bits;
    while (pendingBits > 0) {
      const hash = this._buffers[this._currentBufferIndex];
      const availableForUntake = Math.min(hash.totalBits() - hash.availableBits(), pendingBits);
      hash.untake(availableForUntake);
      pendingBits -= availableForUntake;
      this._availableBits += availableForUntake;
      if (this._currentBufferIndex > 0 && hash.totalBits() === hash.availableBits()) {
        this._depth--;
        this._currentBufferIndex--;
      }
    }
  }
  async _produceMoreBits() {
    this._depth++;
    const value = this._depth > 0 ? concat2([this._value, Uint8Array.from([this._depth])]) : this._value;
    const hashValue = await this._hashFn(value);
    const buffer3 = new ConsumableBuffer(hashValue);
    this._buffers.push(buffer3);
    this._availableBits += buffer3.availableBits();
  }
};

// node_modules/hamt-sharding/dist/src/index.js
function createHAMT(options) {
  if (options == null || options.hashFn == null) {
    throw new Error("please define an options.hashFn");
  }
  const bucketOptions = {
    bits: options.bits ?? 8,
    hash: wrapHash(options.hashFn)
  };
  return new Bucket(bucketOptions);
}

// node_modules/ipfs-unixfs-importer/dist/src/dir-sharded.js
async function hamtHashFn(buf3) {
  return (await murmur3128.encode(buf3)).slice(0, 8).reverse();
}
var HAMT_HASH_CODE = BigInt(34);
var DEFAULT_FANOUT_BITS = 8;
var DirSharded = class extends Dir {
  _bucket;
  constructor(props, options) {
    super(props, options);
    this._bucket = createHAMT({
      hashFn: hamtHashFn,
      bits: options.shardFanoutBits ?? DEFAULT_FANOUT_BITS
    });
  }
  async put(name8, value) {
    this.cid = void 0;
    this.size = void 0;
    this.nodeSize = void 0;
    await this._bucket.put(name8, value);
  }
  async get(name8) {
    return this._bucket.get(name8);
  }
  childCount() {
    return this._bucket.leafCount();
  }
  directChildrenCount() {
    return this._bucket.childrenCount();
  }
  onlyChild() {
    return this._bucket.onlyChild();
  }
  async *eachChildSeries() {
    for await (const { key, value } of this._bucket.eachLeafSeries()) {
      yield {
        key,
        child: value
      };
    }
  }
  estimateNodeSize() {
    if (this.nodeSize !== void 0) {
      return this.nodeSize;
    }
    this.nodeSize = calculateSize(this._bucket, this, this.options);
    return this.nodeSize;
  }
  async *flush(blockstore) {
    for await (const entry of flush(this._bucket, blockstore, this, this.options)) {
      yield {
        ...entry,
        path: this.path
      };
    }
  }
};
var dir_sharded_default = DirSharded;
async function* flush(bucket, blockstore, shardRoot, options) {
  const children = bucket._children;
  const padLength = (bucket.tableSize() - 1).toString(16).length;
  const links = [];
  let childrenSize = 0n;
  for (let i = 0; i < children.length; i++) {
    const child = children.get(i);
    if (child == null) {
      continue;
    }
    const labelPrefix = i.toString(16).toUpperCase().padStart(padLength, "0");
    if (child instanceof Bucket) {
      let shard;
      for await (const subShard of flush(child, blockstore, null, options)) {
        shard = subShard;
      }
      if (shard == null) {
        throw new Error("Could not flush sharded directory, no subshard found");
      }
      links.push({
        Name: labelPrefix,
        Tsize: Number(shard.size),
        Hash: shard.cid
      });
      childrenSize += shard.size;
    } else if (isDir(child.value)) {
      const dir2 = child.value;
      let flushedDir;
      for await (const entry of dir2.flush(blockstore)) {
        flushedDir = entry;
        yield flushedDir;
      }
      if (flushedDir == null) {
        throw new Error("Did not flush dir");
      }
      const label = labelPrefix + child.key;
      links.push({
        Name: label,
        Tsize: Number(flushedDir.size),
        Hash: flushedDir.cid
      });
      childrenSize += flushedDir.size;
    } else {
      const value = child.value;
      if (value.cid == null) {
        continue;
      }
      const label = labelPrefix + child.key;
      const size2 = value.size;
      links.push({
        Name: label,
        Tsize: Number(size2),
        Hash: value.cid
      });
      childrenSize += BigInt(size2 ?? 0);
    }
  }
  const data = Uint8Array.from(children.bitField().reverse());
  const dir = new UnixFS({
    type: "hamt-sharded-directory",
    data,
    fanout: BigInt(bucket.tableSize()),
    hashType: HAMT_HASH_CODE,
    mtime: shardRoot?.mtime,
    mode: shardRoot?.mode
  });
  const node = {
    Data: dir.marshal(),
    Links: links
  };
  const buffer3 = encode3(prepare(node));
  const cid = await persist(buffer3, blockstore, options);
  const size = BigInt(buffer3.byteLength) + childrenSize;
  yield {
    cid,
    unixfs: dir,
    size
  };
}
function isDir(obj) {
  return typeof obj.flush === "function";
}
function calculateSize(bucket, shardRoot, options) {
  const children = bucket._children;
  const padLength = (bucket.tableSize() - 1).toString(16).length;
  const links = [];
  for (let i = 0; i < children.length; i++) {
    const child = children.get(i);
    if (child == null) {
      continue;
    }
    const labelPrefix = i.toString(16).toUpperCase().padStart(padLength, "0");
    if (child instanceof Bucket) {
      const size = calculateSize(child, null, options);
      links.push({
        Name: labelPrefix,
        Tsize: Number(size),
        Hash: options.cidVersion === 0 ? CID_V0 : CID_V1
      });
    } else if (typeof child.value.flush === "function") {
      const dir2 = child.value;
      const size = dir2.nodeSize();
      links.push({
        Name: labelPrefix + child.key,
        Tsize: Number(size),
        Hash: options.cidVersion === 0 ? CID_V0 : CID_V1
      });
    } else {
      const value = child.value;
      if (value.cid == null) {
        continue;
      }
      const label = labelPrefix + child.key;
      const size = value.size;
      links.push({
        Name: label,
        Tsize: Number(size),
        Hash: value.cid
      });
    }
  }
  const data = Uint8Array.from(children.bitField().reverse());
  const dir = new UnixFS({
    type: "hamt-sharded-directory",
    data,
    fanout: BigInt(bucket.tableSize()),
    hashType: HAMT_HASH_CODE,
    mtime: shardRoot?.mtime,
    mode: shardRoot?.mode
  });
  const buffer3 = encode3(prepare({
    Data: dir.marshal(),
    Links: links
  }));
  return buffer3.length;
}

// node_modules/ipfs-unixfs-importer/dist/src/flat-to-shard.js
async function flatToShard(child, dir, threshold, options) {
  let newDir = dir;
  if (dir instanceof DirFlat && dir.estimateNodeSize() > threshold) {
    newDir = await convertToShard(dir, options);
  }
  const parent = newDir.parent;
  if (parent != null) {
    if (newDir !== dir) {
      if (child != null) {
        child.parent = newDir;
      }
      if (newDir.parentKey == null) {
        throw new Error("No parent key found");
      }
      await parent.put(newDir.parentKey, newDir);
    }
    return flatToShard(newDir, parent, threshold, options);
  }
  return newDir;
}
async function convertToShard(oldDir, options) {
  const newDir = new dir_sharded_default({
    root: oldDir.root,
    dir: true,
    parent: oldDir.parent,
    parentKey: oldDir.parentKey,
    path: oldDir.path,
    dirty: oldDir.dirty,
    flat: false,
    mtime: oldDir.mtime,
    mode: oldDir.mode
  }, options);
  for await (const { key, child } of oldDir.eachChildSeries()) {
    await newDir.put(key, child);
  }
  return newDir;
}

// node_modules/ipfs-unixfs-importer/dist/src/utils/to-path-components.js
var toPathComponents = (path = "") => {
  return path.split(/(?<!\\)\//).filter(Boolean);
};

// node_modules/ipfs-unixfs-importer/dist/src/tree-builder.js
async function addToTree(elem, tree, options) {
  const pathElems = toPathComponents(elem.path ?? "");
  const lastIndex = pathElems.length - 1;
  let parent = tree;
  let currentPath = "";
  for (let i = 0; i < pathElems.length; i++) {
    const pathElem = pathElems[i];
    currentPath += `${currentPath !== "" ? "/" : ""}${pathElem}`;
    const last2 = i === lastIndex;
    parent.dirty = true;
    parent.cid = void 0;
    parent.size = void 0;
    if (last2) {
      await parent.put(pathElem, elem);
      tree = await flatToShard(null, parent, options.shardSplitThresholdBytes, options);
    } else {
      let dir = await parent.get(pathElem);
      if (dir == null || !(dir instanceof Dir)) {
        dir = new DirFlat({
          root: false,
          dir: true,
          parent,
          parentKey: pathElem,
          path: currentPath,
          dirty: true,
          flat: true,
          mtime: dir?.unixfs?.mtime,
          mode: dir?.unixfs?.mode
        }, options);
      }
      await parent.put(pathElem, dir);
      parent = dir;
    }
  }
  return tree;
}
async function* flushAndYield(tree, blockstore) {
  if (!(tree instanceof Dir)) {
    if (tree.unixfs?.isDirectory() === true) {
      yield tree;
    }
    return;
  }
  yield* tree.flush(blockstore);
}
function defaultTreeBuilder(options) {
  return async function* treeBuilder(source, block) {
    let tree = new DirFlat({
      root: true,
      dir: true,
      path: "",
      dirty: true,
      flat: true
    }, options);
    let rootDir;
    let singleRoot = false;
    for await (const entry of source) {
      if (entry == null) {
        continue;
      }
      const dir = `${entry.originalPath ?? ""}`.split("/")[0];
      if (dir != null && dir !== "") {
        if (rootDir == null) {
          rootDir = dir;
          singleRoot = true;
        } else if (rootDir !== dir) {
          singleRoot = false;
        }
      }
      tree = await addToTree(entry, tree, options);
      if (entry.unixfs == null || !entry.unixfs.isDirectory()) {
        yield entry;
      }
    }
    if (options.wrapWithDirectory || singleRoot && tree.childCount() > 1) {
      yield* flushAndYield(tree, block);
    } else {
      for await (const unwrapped of tree.eachChildSeries()) {
        if (unwrapped == null) {
          continue;
        }
        yield* flushAndYield(unwrapped.child, block);
      }
    }
  };
}

// node_modules/ipfs-unixfs-importer/dist/src/index.js
async function* importer(source, blockstore, options = {}) {
  let candidates;
  if (Symbol.asyncIterator in source || Symbol.iterator in source) {
    candidates = source;
  } else {
    candidates = [source];
  }
  const wrapWithDirectory = options.wrapWithDirectory ?? false;
  const shardSplitThresholdBytes = options.shardSplitThresholdBytes ?? 262144;
  const shardFanoutBits = options.shardFanoutBits ?? 8;
  const cidVersion = options.cidVersion ?? 1;
  const rawLeaves = options.rawLeaves ?? true;
  const leafType = options.leafType ?? "file";
  const fileImportConcurrency = options.fileImportConcurrency ?? 50;
  const blockWriteConcurrency = options.blockWriteConcurrency ?? 10;
  const reduceSingleLeafToSelf = options.reduceSingleLeafToSelf ?? true;
  const chunker = options.chunker ?? fixedSize();
  const chunkValidator = options.chunkValidator ?? defaultChunkValidator();
  const buildDag = options.dagBuilder ?? defaultDagBuilder({
    chunker,
    chunkValidator,
    wrapWithDirectory,
    layout: options.layout ?? balanced(),
    bufferImporter: options.bufferImporter ?? defaultBufferImporter({
      cidVersion,
      rawLeaves,
      leafType,
      onProgress: options.onProgress
    }),
    blockWriteConcurrency,
    reduceSingleLeafToSelf,
    cidVersion,
    onProgress: options.onProgress
  });
  const buildTree = options.treeBuilder ?? defaultTreeBuilder({
    wrapWithDirectory,
    shardSplitThresholdBytes,
    shardFanoutBits,
    cidVersion,
    onProgress: options.onProgress
  });
  for await (const entry of buildTree(parallelBatch(buildDag(candidates, blockstore), fileImportConcurrency), blockstore)) {
    yield {
      cid: entry.cid,
      path: entry.path,
      unixfs: entry.unixfs,
      size: entry.size
    };
  }
}
async function importFile(content, blockstore, options = {}) {
  const result = await src_default(importer([content], blockstore, options));
  if (result == null) {
    throw (0, import_err_code4.default)(new Error("Nothing imported"), "ERR_INVALID_PARAMS");
  }
  return result;
}
async function importDirectory(content, blockstore, options = {}) {
  const result = await src_default(importer([content], blockstore, options));
  if (result == null) {
    throw (0, import_err_code4.default)(new Error("Nothing imported"), "ERR_INVALID_PARAMS");
  }
  return result;
}
async function importBytes(buf3, blockstore, options = {}) {
  return importFile({
    content: buf3
  }, blockstore, options);
}
async function importByteStream(bufs, blockstore, options = {}) {
  return importFile({
    content: bufs
  }, blockstore, options);
}

// node_modules/@helia/unixfs/dist/src/commands/add.js
var defaultImporterSettings = {
  cidVersion: 1,
  rawLeaves: true,
  layout: balanced({
    maxChildrenPerNode: 1024
  }),
  chunker: fixedSize({
    chunkSize: 1048576
  })
};
async function* addAll(source, blockstore, options = {}) {
  yield* importer(source, blockstore, {
    ...defaultImporterSettings,
    ...options
  });
}
async function addBytes(bytes, blockstore, options = {}) {
  const { cid } = await importBytes(bytes, blockstore, {
    ...defaultImporterSettings,
    ...options
  });
  return cid;
}
async function addByteStream(bytes, blockstore, options = {}) {
  const { cid } = await importByteStream(bytes, blockstore, {
    ...defaultImporterSettings,
    ...options
  });
  return cid;
}
async function addFile(file, blockstore, options = {}) {
  const { cid } = await importFile(file, blockstore, {
    ...defaultImporterSettings,
    ...options
  });
  return cid;
}
async function addDirectory(dir, blockstore, options = {}) {
  const { cid } = await importDirectory({
    ...dir,
    path: dir.path ?? "-"
  }, blockstore, {
    ...defaultImporterSettings,
    ...options
  });
  return cid;
}

// node_modules/ipfs-unixfs-exporter/dist/src/index.js
var import_err_code14 = __toESM(require_err_code(), 1);

// node_modules/it-last/dist/src/index.js
function isAsyncIterable4(thing) {
  return thing[Symbol.asyncIterator] != null;
}
function last(source) {
  if (isAsyncIterable4(source)) {
    return (async () => {
      let res2;
      for await (const entry of source) {
        res2 = entry;
      }
      return res2;
    })();
  }
  let res;
  for (const entry of source) {
    res = entry;
  }
  return res;
}
var src_default3 = last;

// node_modules/ipfs-unixfs-exporter/node_modules/multiformats/dist/src/bytes.js
var empty6 = new Uint8Array(0);
function equals12(aa, bb) {
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
function coerce6(o) {
  if (o instanceof Uint8Array && o.constructor.name === "Uint8Array")
    return o;
  if (o instanceof ArrayBuffer)
    return new Uint8Array(o);
  if (ArrayBuffer.isView(o)) {
    return new Uint8Array(o.buffer, o.byteOffset, o.byteLength);
  }
  throw new Error("Unknown type, must be binary type");
}

// node_modules/ipfs-unixfs-exporter/node_modules/multiformats/dist/src/vendor/base-x.js
function base6(ALPHABET, name8) {
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
  function encode33(source) {
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
    var length11 = 0;
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
      for (var it1 = size - 1; (carry !== 0 || i2 < length11) && it1 !== -1; it1--, i2++) {
        carry += 256 * b58[it1] >>> 0;
        b58[it1] = carry % BASE >>> 0;
        carry = carry / BASE >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length11 = i2;
      pbegin++;
    }
    var it2 = size - length11;
    while (it2 !== size && b58[it2] === 0) {
      it2++;
    }
    var str = LEADER.repeat(zeroes);
    for (; it2 < size; ++it2) {
      str += ALPHABET.charAt(b58[it2]);
    }
    return str;
  }
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
    var length11 = 0;
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
      for (var it3 = size - 1; (carry !== 0 || i2 < length11) && it3 !== -1; it3--, i2++) {
        carry += BASE * b256[it3] >>> 0;
        b256[it3] = carry % 256 >>> 0;
        carry = carry / 256 >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length11 = i2;
      psz++;
    }
    if (source[psz] === " ") {
      return;
    }
    var it4 = size - length11;
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
  function decode49(string5) {
    var buffer3 = decodeUnsafe(string5);
    if (buffer3) {
      return buffer3;
    }
    throw new Error(`Non-${name8} character`);
  }
  return {
    encode: encode33,
    decodeUnsafe,
    decode: decode49
  };
}
var src6 = base6;
var _brrp__multiformats_scope_baseX6 = src6;
var base_x_default6 = _brrp__multiformats_scope_baseX6;

// node_modules/ipfs-unixfs-exporter/node_modules/multiformats/dist/src/bases/base.js
var Encoder6 = class {
  name;
  prefix;
  baseEncode;
  constructor(name8, prefix, baseEncode) {
    this.name = name8;
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
var Decoder6 = class {
  name;
  prefix;
  baseDecode;
  prefixCodePoint;
  constructor(name8, prefix, baseDecode) {
    this.name = name8;
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
    return or6(this, decoder);
  }
};
var ComposedDecoder6 = class {
  decoders;
  constructor(decoders) {
    this.decoders = decoders;
  }
  or(decoder) {
    return or6(this, decoder);
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
function or6(left, right) {
  return new ComposedDecoder6({
    ...left.decoders ?? { [left.prefix]: left },
    ...right.decoders ?? { [right.prefix]: right }
  });
}
var Codec6 = class {
  name;
  prefix;
  baseEncode;
  baseDecode;
  encoder;
  decoder;
  constructor(name8, prefix, baseEncode, baseDecode) {
    this.name = name8;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
    this.baseDecode = baseDecode;
    this.encoder = new Encoder6(name8, prefix, baseEncode);
    this.decoder = new Decoder6(name8, prefix, baseDecode);
  }
  encode(input) {
    return this.encoder.encode(input);
  }
  decode(input) {
    return this.decoder.decode(input);
  }
};
function from10({ name: name8, prefix, encode: encode33, decode: decode49 }) {
  return new Codec6(name8, prefix, encode33, decode49);
}
function baseX6({ name: name8, prefix, alphabet: alphabet5 }) {
  const { encode: encode33, decode: decode49 } = base_x_default6(alphabet5, name8);
  return from10({
    prefix,
    name: name8,
    encode: encode33,
    decode: (text) => coerce6(decode49(text))
  });
}
function decode26(string5, alphabet5, bitsPerChar, name8) {
  const codes = {};
  for (let i = 0; i < alphabet5.length; ++i) {
    codes[alphabet5[i]] = i;
  }
  let end = string5.length;
  while (string5[end - 1] === "=") {
    --end;
  }
  const out = new Uint8Array(end * bitsPerChar / 8 | 0);
  let bits = 0;
  let buffer3 = 0;
  let written = 0;
  for (let i = 0; i < end; ++i) {
    const value = codes[string5[i]];
    if (value === void 0) {
      throw new SyntaxError(`Non-${name8} character`);
    }
    buffer3 = buffer3 << bitsPerChar | value;
    bits += bitsPerChar;
    if (bits >= 8) {
      bits -= 8;
      out[written++] = 255 & buffer3 >> bits;
    }
  }
  if (bits >= bitsPerChar || (255 & buffer3 << 8 - bits) !== 0) {
    throw new SyntaxError("Unexpected end of data");
  }
  return out;
}
function encode19(data, alphabet5, bitsPerChar) {
  const pad = alphabet5[alphabet5.length - 1] === "=";
  const mask = (1 << bitsPerChar) - 1;
  let out = "";
  let bits = 0;
  let buffer3 = 0;
  for (let i = 0; i < data.length; ++i) {
    buffer3 = buffer3 << 8 | data[i];
    bits += 8;
    while (bits > bitsPerChar) {
      bits -= bitsPerChar;
      out += alphabet5[mask & buffer3 >> bits];
    }
  }
  if (bits !== 0) {
    out += alphabet5[mask & buffer3 << bitsPerChar - bits];
  }
  if (pad) {
    while ((out.length * bitsPerChar & 7) !== 0) {
      out += "=";
    }
  }
  return out;
}
function rfc46486({ name: name8, prefix, bitsPerChar, alphabet: alphabet5 }) {
  return from10({
    prefix,
    name: name8,
    encode(input) {
      return encode19(input, alphabet5, bitsPerChar);
    },
    decode(input) {
      return decode26(input, alphabet5, bitsPerChar, name8);
    }
  });
}

// node_modules/ipfs-unixfs-exporter/node_modules/multiformats/dist/src/bases/base32.js
var base326 = rfc46486({
  prefix: "b",
  name: "base32",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567",
  bitsPerChar: 5
});
var base32upper6 = rfc46486({
  prefix: "B",
  name: "base32upper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
  bitsPerChar: 5
});
var base32pad6 = rfc46486({
  prefix: "c",
  name: "base32pad",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
  bitsPerChar: 5
});
var base32padupper6 = rfc46486({
  prefix: "C",
  name: "base32padupper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
  bitsPerChar: 5
});
var base32hex6 = rfc46486({
  prefix: "v",
  name: "base32hex",
  alphabet: "0123456789abcdefghijklmnopqrstuv",
  bitsPerChar: 5
});
var base32hexupper6 = rfc46486({
  prefix: "V",
  name: "base32hexupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
  bitsPerChar: 5
});
var base32hexpad6 = rfc46486({
  prefix: "t",
  name: "base32hexpad",
  alphabet: "0123456789abcdefghijklmnopqrstuv=",
  bitsPerChar: 5
});
var base32hexpadupper6 = rfc46486({
  prefix: "T",
  name: "base32hexpadupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
  bitsPerChar: 5
});
var base32z6 = rfc46486({
  prefix: "h",
  name: "base32z",
  alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
  bitsPerChar: 5
});

// node_modules/ipfs-unixfs-exporter/node_modules/multiformats/dist/src/bases/base58.js
var base58btc6 = baseX6({
  name: "base58btc",
  prefix: "z",
  alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
});
var base58flickr6 = baseX6({
  name: "base58flickr",
  prefix: "Z",
  alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
});

// node_modules/ipfs-unixfs-exporter/node_modules/multiformats/dist/src/vendor/varint.js
var encode_16 = encode20;
var MSB7 = 128;
var REST7 = 127;
var MSBALL6 = ~REST7;
var INT6 = Math.pow(2, 31);
function encode20(num, out, offset) {
  out = out || [];
  offset = offset || 0;
  var oldOffset = offset;
  while (num >= INT6) {
    out[offset++] = num & 255 | MSB7;
    num /= 128;
  }
  while (num & MSBALL6) {
    out[offset++] = num & 255 | MSB7;
    num >>>= 7;
  }
  out[offset] = num | 0;
  encode20.bytes = offset - oldOffset + 1;
  return out;
}
var decode27 = read7;
var MSB$16 = 128;
var REST$16 = 127;
function read7(buf3, offset) {
  var res = 0, offset = offset || 0, shift = 0, counter = offset, b, l = buf3.length;
  do {
    if (counter >= l) {
      read7.bytes = 0;
      throw new RangeError("Could not decode varint");
    }
    b = buf3[counter++];
    res += shift < 28 ? (b & REST$16) << shift : (b & REST$16) * Math.pow(2, shift);
    shift += 7;
  } while (b >= MSB$16);
  read7.bytes = counter - offset;
  return res;
}
var N17 = Math.pow(2, 7);
var N27 = Math.pow(2, 14);
var N37 = Math.pow(2, 21);
var N47 = Math.pow(2, 28);
var N57 = Math.pow(2, 35);
var N67 = Math.pow(2, 42);
var N77 = Math.pow(2, 49);
var N86 = Math.pow(2, 56);
var N96 = Math.pow(2, 63);
var length7 = function(value) {
  return value < N17 ? 1 : value < N27 ? 2 : value < N37 ? 3 : value < N47 ? 4 : value < N57 ? 5 : value < N67 ? 6 : value < N77 ? 7 : value < N86 ? 8 : value < N96 ? 9 : 10;
};
var varint6 = {
  encode: encode_16,
  decode: decode27,
  encodingLength: length7
};
var _brrp_varint6 = varint6;
var varint_default6 = _brrp_varint6;

// node_modules/ipfs-unixfs-exporter/node_modules/multiformats/dist/src/varint.js
function decode28(data, offset = 0) {
  const code13 = varint_default6.decode(data, offset);
  return [code13, varint_default6.decode.bytes];
}
function encodeTo6(int, target, offset = 0) {
  varint_default6.encode(int, target, offset);
  return target;
}
function encodingLength7(int) {
  return varint_default6.encodingLength(int);
}

// node_modules/ipfs-unixfs-exporter/node_modules/multiformats/dist/src/hashes/digest.js
function create6(code13, digest6) {
  const size = digest6.byteLength;
  const sizeOffset = encodingLength7(code13);
  const digestOffset = sizeOffset + encodingLength7(size);
  const bytes = new Uint8Array(digestOffset + size);
  encodeTo6(code13, bytes, 0);
  encodeTo6(size, bytes, sizeOffset);
  bytes.set(digest6, digestOffset);
  return new Digest6(code13, size, digest6, bytes);
}
function decode29(multihash) {
  const bytes = coerce6(multihash);
  const [code13, sizeOffset] = decode28(bytes);
  const [size, digestOffset] = decode28(bytes.subarray(sizeOffset));
  const digest6 = bytes.subarray(sizeOffset + digestOffset);
  if (digest6.byteLength !== size) {
    throw new Error("Incorrect length");
  }
  return new Digest6(code13, size, digest6, bytes);
}
function equals13(a, b) {
  if (a === b) {
    return true;
  } else {
    const data = b;
    return a.code === data.code && a.size === data.size && data.bytes instanceof Uint8Array && equals12(a.bytes, data.bytes);
  }
}
var Digest6 = class {
  code;
  size;
  digest;
  bytes;
  /**
   * Creates a multihash digest.
   */
  constructor(code13, size, digest6, bytes) {
    this.code = code13;
    this.size = size;
    this.digest = digest6;
    this.bytes = bytes;
  }
};

// node_modules/ipfs-unixfs-exporter/node_modules/multiformats/dist/src/cid.js
function format6(link, base12) {
  const { bytes, version } = link;
  switch (version) {
    case 0:
      return toStringV06(bytes, baseCache6(link), base12 ?? base58btc6.encoder);
    default:
      return toStringV16(bytes, baseCache6(link), base12 ?? base326.encoder);
  }
}
var cache6 = /* @__PURE__ */ new WeakMap();
function baseCache6(cid) {
  const baseCache10 = cache6.get(cid);
  if (baseCache10 == null) {
    const baseCache11 = /* @__PURE__ */ new Map();
    cache6.set(cid, baseCache11);
    return baseCache11;
  }
  return baseCache10;
}
var CID6 = class _CID {
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
  constructor(version, code13, multihash, bytes) {
    this.code = code13;
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
        const { code: code13, multihash } = this;
        if (code13 !== DAG_PB_CODE6) {
          throw new Error("Cannot convert a non dag-pb CID to CIDv0");
        }
        if (multihash.code !== SHA_256_CODE6) {
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
        const { code: code13, digest: digest6 } = this.multihash;
        const multihash = create6(code13, digest6);
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
    return unknown != null && self.code === unknown.code && self.version === unknown.version && equals13(self.multihash, unknown.multihash);
  }
  toString(base12) {
    return format6(this, base12);
  }
  toJSON() {
    return { "/": format6(this) };
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
      const { version, code: code13, multihash, bytes } = value;
      return new _CID(version, code13, multihash, bytes ?? encodeCID6(version, code13, multihash.bytes));
    } else if (value[cidSymbol6] === true) {
      const { version, multihash, code: code13 } = value;
      const digest6 = decode29(multihash);
      return _CID.create(version, code13, digest6);
    } else {
      return null;
    }
  }
  /**
   * @param version - Version of the CID
   * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
   * @param digest - (Multi)hash of the of the content.
   */
  static create(version, code13, digest6) {
    if (typeof code13 !== "number") {
      throw new Error("String codecs are no longer supported");
    }
    if (!(digest6.bytes instanceof Uint8Array)) {
      throw new Error("Invalid digest");
    }
    switch (version) {
      case 0: {
        if (code13 !== DAG_PB_CODE6) {
          throw new Error(`Version 0 CID must use dag-pb (code: ${DAG_PB_CODE6}) block encoding`);
        } else {
          return new _CID(version, code13, digest6, digest6.bytes);
        }
      }
      case 1: {
        const bytes = encodeCID6(version, code13, digest6.bytes);
        return new _CID(version, code13, digest6, bytes);
      }
      default: {
        throw new Error("Invalid version");
      }
    }
  }
  /**
   * Simplified version of `create` for CIDv0.
   */
  static createV0(digest6) {
    return _CID.create(0, DAG_PB_CODE6, digest6);
  }
  /**
   * Simplified version of `create` for CIDv1.
   *
   * @param code - Content encoding format code.
   * @param digest - Multihash of the content.
   */
  static createV1(code13, digest6) {
    return _CID.create(1, code13, digest6);
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
    const multihashBytes = coerce6(bytes.subarray(prefixSize, prefixSize + specs.multihashSize));
    if (multihashBytes.byteLength !== specs.multihashSize) {
      throw new Error("Incorrect length");
    }
    const digestBytes = multihashBytes.subarray(specs.multihashSize - specs.digestSize);
    const digest6 = new Digest6(specs.multihashCode, specs.digestSize, digestBytes, multihashBytes);
    const cid = specs.version === 0 ? _CID.createV0(digest6) : _CID.createV1(specs.codec, digest6);
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
    const next = () => {
      const [i, length11] = decode28(initialBytes.subarray(offset));
      offset += length11;
      return i;
    };
    let version = next();
    let codec = DAG_PB_CODE6;
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
  static parse(source, base12) {
    const [prefix, bytes] = parseCIDtoBytes6(source, base12);
    const cid = _CID.decode(bytes);
    if (cid.version === 0 && source[0] !== "Q") {
      throw Error("Version 0 CID string must not include multibase prefix");
    }
    baseCache6(cid).set(prefix, source);
    return cid;
  }
};
function parseCIDtoBytes6(source, base12) {
  switch (source[0]) {
    case "Q": {
      const decoder = base12 ?? base58btc6;
      return [
        base58btc6.prefix,
        decoder.decode(`${base58btc6.prefix}${source}`)
      ];
    }
    case base58btc6.prefix: {
      const decoder = base12 ?? base58btc6;
      return [base58btc6.prefix, decoder.decode(source)];
    }
    case base326.prefix: {
      const decoder = base12 ?? base326;
      return [base326.prefix, decoder.decode(source)];
    }
    default: {
      if (base12 == null) {
        throw Error("To parse non base32 or base58btc encoded CID multibase decoder must be provided");
      }
      return [source[0], base12.decode(source)];
    }
  }
}
function toStringV06(bytes, cache10, base12) {
  const { prefix } = base12;
  if (prefix !== base58btc6.prefix) {
    throw Error(`Cannot string encode V0 in ${base12.name} encoding`);
  }
  const cid = cache10.get(prefix);
  if (cid == null) {
    const cid2 = base12.encode(bytes).slice(1);
    cache10.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
function toStringV16(bytes, cache10, base12) {
  const { prefix } = base12;
  const cid = cache10.get(prefix);
  if (cid == null) {
    const cid2 = base12.encode(bytes);
    cache10.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
var DAG_PB_CODE6 = 112;
var SHA_256_CODE6 = 18;
function encodeCID6(version, code13, multihash) {
  const codeOffset = encodingLength7(version);
  const hashOffset = codeOffset + encodingLength7(code13);
  const bytes = new Uint8Array(hashOffset + multihash.byteLength);
  encodeTo6(version, bytes, 0);
  encodeTo6(code13, bytes, codeOffset);
  bytes.set(multihash, hashOffset);
  return bytes;
}
var cidSymbol6 = Symbol.for("@ipld/js-cid/CID");

// node_modules/@ipld/dag-cbor/node_modules/cborg/lib/is.js
var typeofs = [
  "string",
  "number",
  "bigint",
  "symbol"
];
var objectTypeNames = [
  "Function",
  "Generator",
  "AsyncGenerator",
  "GeneratorFunction",
  "AsyncGeneratorFunction",
  "AsyncFunction",
  "Observable",
  "Array",
  "Buffer",
  "Object",
  "RegExp",
  "Date",
  "Error",
  "Map",
  "Set",
  "WeakMap",
  "WeakSet",
  "ArrayBuffer",
  "SharedArrayBuffer",
  "DataView",
  "Promise",
  "URL",
  "HTMLElement",
  "Int8Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Int16Array",
  "Uint16Array",
  "Int32Array",
  "Uint32Array",
  "Float32Array",
  "Float64Array",
  "BigInt64Array",
  "BigUint64Array"
];
function is(value) {
  if (value === null) {
    return "null";
  }
  if (value === void 0) {
    return "undefined";
  }
  if (value === true || value === false) {
    return "boolean";
  }
  const typeOf = typeof value;
  if (typeofs.includes(typeOf)) {
    return typeOf;
  }
  if (typeOf === "function") {
    return "Function";
  }
  if (Array.isArray(value)) {
    return "Array";
  }
  if (isBuffer(value)) {
    return "Buffer";
  }
  const objectType = getObjectType(value);
  if (objectType) {
    return objectType;
  }
  return "Object";
}
function isBuffer(value) {
  return value && value.constructor && value.constructor.isBuffer && value.constructor.isBuffer.call(null, value);
}
function getObjectType(value) {
  const objectTypeName = Object.prototype.toString.call(value).slice(8, -1);
  if (objectTypeNames.includes(objectTypeName)) {
    return objectTypeName;
  }
  return void 0;
}

// node_modules/@ipld/dag-cbor/node_modules/cborg/lib/token.js
var Type = class {
  /**
   * @param {number} major
   * @param {string} name
   * @param {boolean} terminal
   */
  constructor(major, name8, terminal) {
    this.major = major;
    this.majorEncoded = major << 5;
    this.name = name8;
    this.terminal = terminal;
  }
  /* c8 ignore next 3 */
  toString() {
    return `Type[${this.major}].${this.name}`;
  }
  /**
   * @param {Type} typ
   * @returns {number}
   */
  compare(typ) {
    return this.major < typ.major ? -1 : this.major > typ.major ? 1 : 0;
  }
};
Type.uint = new Type(0, "uint", true);
Type.negint = new Type(1, "negint", true);
Type.bytes = new Type(2, "bytes", true);
Type.string = new Type(3, "string", true);
Type.array = new Type(4, "array", false);
Type.map = new Type(5, "map", false);
Type.tag = new Type(6, "tag", false);
Type.float = new Type(7, "float", true);
Type.false = new Type(7, "false", true);
Type.true = new Type(7, "true", true);
Type.null = new Type(7, "null", true);
Type.undefined = new Type(7, "undefined", true);
Type.break = new Type(7, "break", true);
var Token = class {
  /**
   * @param {Type} type
   * @param {any} [value]
   * @param {number} [encodedLength]
   */
  constructor(type, value, encodedLength) {
    this.type = type;
    this.value = value;
    this.encodedLength = encodedLength;
    this.encodedBytes = void 0;
    this.byteValue = void 0;
  }
  /* c8 ignore next 3 */
  toString() {
    return `Token[${this.type}].${this.value}`;
  }
};

// node_modules/@ipld/dag-cbor/node_modules/cborg/lib/byte-utils.js
var useBuffer = globalThis.process && // @ts-ignore
!globalThis.process.browser && // @ts-ignore
globalThis.Buffer && // @ts-ignore
typeof globalThis.Buffer.isBuffer === "function";
var textDecoder5 = new TextDecoder();
var textEncoder6 = new TextEncoder();
function isBuffer2(buf3) {
  return useBuffer && globalThis.Buffer.isBuffer(buf3);
}
function asU8A(buf3) {
  if (!(buf3 instanceof Uint8Array)) {
    return Uint8Array.from(buf3);
  }
  return isBuffer2(buf3) ? new Uint8Array(buf3.buffer, buf3.byteOffset, buf3.byteLength) : buf3;
}
var toString5 = useBuffer ? (
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array} bytes
   * @param {number} start
   * @param {number} end
   */
  (bytes, start, end) => {
    return end - start > 64 ? (
      // eslint-disable-line operator-linebreak
      // @ts-ignore
      globalThis.Buffer.from(bytes.subarray(start, end)).toString("utf8")
    ) : utf8Slice(bytes, start, end);
  }
) : (
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array} bytes
   * @param {number} start
   * @param {number} end
   */
  (bytes, start, end) => {
    return end - start > 64 ? textDecoder5.decode(bytes.subarray(start, end)) : utf8Slice(bytes, start, end);
  }
);
var fromString8 = useBuffer ? (
  // eslint-disable-line operator-linebreak
  /**
   * @param {string} string
   */
  (string5) => {
    return string5.length > 64 ? (
      // eslint-disable-line operator-linebreak
      // @ts-ignore
      globalThis.Buffer.from(string5)
    ) : utf8ToBytes(string5);
  }
) : (
  // eslint-disable-line operator-linebreak
  /**
   * @param {string} string
   */
  (string5) => {
    return string5.length > 64 ? textEncoder6.encode(string5) : utf8ToBytes(string5);
  }
);
var slice = useBuffer ? (
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array} bytes
   * @param {number} start
   * @param {number} end
   */
  (bytes, start, end) => {
    if (isBuffer2(bytes)) {
      return new Uint8Array(bytes.subarray(start, end));
    }
    return bytes.slice(start, end);
  }
) : (
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array} bytes
   * @param {number} start
   * @param {number} end
   */
  (bytes, start, end) => {
    return bytes.slice(start, end);
  }
);
var concat3 = useBuffer ? (
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array[]} chunks
   * @param {number} length
   * @returns {Uint8Array}
   */
  (chunks, length11) => {
    chunks = chunks.map((c) => c instanceof Uint8Array ? c : (
      // eslint-disable-line operator-linebreak
      // @ts-ignore
      globalThis.Buffer.from(c)
    ));
    return asU8A(globalThis.Buffer.concat(chunks, length11));
  }
) : (
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array[]} chunks
   * @param {number} length
   * @returns {Uint8Array}
   */
  (chunks, length11) => {
    const out = new Uint8Array(length11);
    let off = 0;
    for (let b of chunks) {
      if (off + b.length > out.length) {
        b = b.subarray(0, out.length - off);
      }
      out.set(b, off);
      off += b.length;
    }
    return out;
  }
);
var alloc3 = useBuffer ? (
  // eslint-disable-line operator-linebreak
  /**
   * @param {number} size
   * @returns {Uint8Array}
   */
  (size) => {
    return globalThis.Buffer.allocUnsafe(size);
  }
) : (
  // eslint-disable-line operator-linebreak
  /**
   * @param {number} size
   * @returns {Uint8Array}
   */
  (size) => {
    return new Uint8Array(size);
  }
);
function compare(b1, b2) {
  if (isBuffer2(b1) && isBuffer2(b2)) {
    return b1.compare(b2);
  }
  for (let i = 0; i < b1.length; i++) {
    if (b1[i] === b2[i]) {
      continue;
    }
    return b1[i] < b2[i] ? -1 : 1;
  }
  return 0;
}
function utf8ToBytes(str) {
  const out = [];
  let p = 0;
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i);
    if (c < 128) {
      out[p++] = c;
    } else if (c < 2048) {
      out[p++] = c >> 6 | 192;
      out[p++] = c & 63 | 128;
    } else if ((c & 64512) === 55296 && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) === 56320) {
      c = 65536 + ((c & 1023) << 10) + (str.charCodeAt(++i) & 1023);
      out[p++] = c >> 18 | 240;
      out[p++] = c >> 12 & 63 | 128;
      out[p++] = c >> 6 & 63 | 128;
      out[p++] = c & 63 | 128;
    } else {
      out[p++] = c >> 12 | 224;
      out[p++] = c >> 6 & 63 | 128;
      out[p++] = c & 63 | 128;
    }
  }
  return out;
}
function utf8Slice(buf3, offset, end) {
  const res = [];
  while (offset < end) {
    const firstByte = buf3[offset];
    let codePoint = null;
    let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
    if (offset + bytesPerSequence <= end) {
      let secondByte, thirdByte, fourthByte, tempCodePoint;
      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 128) {
            codePoint = firstByte;
          }
          break;
        case 2:
          secondByte = buf3[offset + 1];
          if ((secondByte & 192) === 128) {
            tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
            if (tempCodePoint > 127) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 3:
          secondByte = buf3[offset + 1];
          thirdByte = buf3[offset + 2];
          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
            tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
            if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 4:
          secondByte = buf3[offset + 1];
          thirdByte = buf3[offset + 2];
          fourthByte = buf3[offset + 3];
          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
            tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
            if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
              codePoint = tempCodePoint;
            }
          }
      }
    }
    if (codePoint === null) {
      codePoint = 65533;
      bytesPerSequence = 1;
    } else if (codePoint > 65535) {
      codePoint -= 65536;
      res.push(codePoint >>> 10 & 1023 | 55296);
      codePoint = 56320 | codePoint & 1023;
    }
    res.push(codePoint);
    offset += bytesPerSequence;
  }
  return decodeCodePointsArray(res);
}
var MAX_ARGUMENTS_LENGTH = 4096;
function decodeCodePointsArray(codePoints) {
  const len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints);
  }
  let res = "";
  let i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    );
  }
  return res;
}

// node_modules/@ipld/dag-cbor/node_modules/cborg/lib/bl.js
var defaultChunkSize = 256;
var Bl = class {
  /**
   * @param {number} [chunkSize]
   */
  constructor(chunkSize = defaultChunkSize) {
    this.chunkSize = chunkSize;
    this.cursor = 0;
    this.maxCursor = -1;
    this.chunks = [];
    this._initReuseChunk = null;
  }
  reset() {
    this.cursor = 0;
    this.maxCursor = -1;
    if (this.chunks.length) {
      this.chunks = [];
    }
    if (this._initReuseChunk !== null) {
      this.chunks.push(this._initReuseChunk);
      this.maxCursor = this._initReuseChunk.length - 1;
    }
  }
  /**
   * @param {Uint8Array|number[]} bytes
   */
  push(bytes) {
    let topChunk = this.chunks[this.chunks.length - 1];
    const newMax = this.cursor + bytes.length;
    if (newMax <= this.maxCursor + 1) {
      const chunkPos = topChunk.length - (this.maxCursor - this.cursor) - 1;
      topChunk.set(bytes, chunkPos);
    } else {
      if (topChunk) {
        const chunkPos = topChunk.length - (this.maxCursor - this.cursor) - 1;
        if (chunkPos < topChunk.length) {
          this.chunks[this.chunks.length - 1] = topChunk.subarray(0, chunkPos);
          this.maxCursor = this.cursor - 1;
        }
      }
      if (bytes.length < 64 && bytes.length < this.chunkSize) {
        topChunk = alloc3(this.chunkSize);
        this.chunks.push(topChunk);
        this.maxCursor += topChunk.length;
        if (this._initReuseChunk === null) {
          this._initReuseChunk = topChunk;
        }
        topChunk.set(bytes, 0);
      } else {
        this.chunks.push(bytes);
        this.maxCursor += bytes.length;
      }
    }
    this.cursor += bytes.length;
  }
  /**
   * @param {boolean} [reset]
   * @returns {Uint8Array}
   */
  toBytes(reset = false) {
    let byts;
    if (this.chunks.length === 1) {
      const chunk = this.chunks[0];
      if (reset && this.cursor > chunk.length / 2) {
        byts = this.cursor === chunk.length ? chunk : chunk.subarray(0, this.cursor);
        this._initReuseChunk = null;
        this.chunks = [];
      } else {
        byts = slice(chunk, 0, this.cursor);
      }
    } else {
      byts = concat3(this.chunks, this.cursor);
    }
    if (reset) {
      this.reset();
    }
    return byts;
  }
};

// node_modules/@ipld/dag-cbor/node_modules/cborg/lib/common.js
var decodeErrPrefix = "CBOR decode error:";
var encodeErrPrefix = "CBOR encode error:";
var uintMinorPrefixBytes = [];
uintMinorPrefixBytes[23] = 1;
uintMinorPrefixBytes[24] = 2;
uintMinorPrefixBytes[25] = 3;
uintMinorPrefixBytes[26] = 5;
uintMinorPrefixBytes[27] = 9;
function assertEnoughData(data, pos, need) {
  if (data.length - pos < need) {
    throw new Error(`${decodeErrPrefix} not enough data for type`);
  }
}

// node_modules/@ipld/dag-cbor/node_modules/cborg/lib/0uint.js
var uintBoundaries = [24, 256, 65536, 4294967296, BigInt("18446744073709551616")];
function readUint8(data, offset, options) {
  assertEnoughData(data, offset, 1);
  const value = data[offset];
  if (options.strict === true && value < uintBoundaries[0]) {
    throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
  }
  return value;
}
function readUint16(data, offset, options) {
  assertEnoughData(data, offset, 2);
  const value = data[offset] << 8 | data[offset + 1];
  if (options.strict === true && value < uintBoundaries[1]) {
    throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
  }
  return value;
}
function readUint32(data, offset, options) {
  assertEnoughData(data, offset, 4);
  const value = data[offset] * 16777216 + (data[offset + 1] << 16) + (data[offset + 2] << 8) + data[offset + 3];
  if (options.strict === true && value < uintBoundaries[2]) {
    throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
  }
  return value;
}
function readUint64(data, offset, options) {
  assertEnoughData(data, offset, 8);
  const hi = data[offset] * 16777216 + (data[offset + 1] << 16) + (data[offset + 2] << 8) + data[offset + 3];
  const lo = data[offset + 4] * 16777216 + (data[offset + 5] << 16) + (data[offset + 6] << 8) + data[offset + 7];
  const value = (BigInt(hi) << BigInt(32)) + BigInt(lo);
  if (options.strict === true && value < uintBoundaries[3]) {
    throw new Error(`${decodeErrPrefix} integer encoded in more bytes than necessary (strict decode)`);
  }
  if (value <= Number.MAX_SAFE_INTEGER) {
    return Number(value);
  }
  if (options.allowBigInt === true) {
    return value;
  }
  throw new Error(`${decodeErrPrefix} integers outside of the safe integer range are not supported`);
}
function decodeUint8(data, pos, _minor, options) {
  return new Token(Type.uint, readUint8(data, pos + 1, options), 2);
}
function decodeUint16(data, pos, _minor, options) {
  return new Token(Type.uint, readUint16(data, pos + 1, options), 3);
}
function decodeUint32(data, pos, _minor, options) {
  return new Token(Type.uint, readUint32(data, pos + 1, options), 5);
}
function decodeUint64(data, pos, _minor, options) {
  return new Token(Type.uint, readUint64(data, pos + 1, options), 9);
}
function encodeUint(buf3, token) {
  return encodeUintValue(buf3, 0, token.value);
}
function encodeUintValue(buf3, major, uint) {
  if (uint < uintBoundaries[0]) {
    const nuint = Number(uint);
    buf3.push([major | nuint]);
  } else if (uint < uintBoundaries[1]) {
    const nuint = Number(uint);
    buf3.push([major | 24, nuint]);
  } else if (uint < uintBoundaries[2]) {
    const nuint = Number(uint);
    buf3.push([major | 25, nuint >>> 8, nuint & 255]);
  } else if (uint < uintBoundaries[3]) {
    const nuint = Number(uint);
    buf3.push([major | 26, nuint >>> 24 & 255, nuint >>> 16 & 255, nuint >>> 8 & 255, nuint & 255]);
  } else {
    const buint = BigInt(uint);
    if (buint < uintBoundaries[4]) {
      const set = [major | 27, 0, 0, 0, 0, 0, 0, 0];
      let lo = Number(buint & BigInt(4294967295));
      let hi = Number(buint >> BigInt(32) & BigInt(4294967295));
      set[8] = lo & 255;
      lo = lo >> 8;
      set[7] = lo & 255;
      lo = lo >> 8;
      set[6] = lo & 255;
      lo = lo >> 8;
      set[5] = lo & 255;
      set[4] = hi & 255;
      hi = hi >> 8;
      set[3] = hi & 255;
      hi = hi >> 8;
      set[2] = hi & 255;
      hi = hi >> 8;
      set[1] = hi & 255;
      buf3.push(set);
    } else {
      throw new Error(`${decodeErrPrefix} encountered BigInt larger than allowable range`);
    }
  }
}
encodeUint.encodedSize = function encodedSize(token) {
  return encodeUintValue.encodedSize(token.value);
};
encodeUintValue.encodedSize = function encodedSize2(uint) {
  if (uint < uintBoundaries[0]) {
    return 1;
  }
  if (uint < uintBoundaries[1]) {
    return 2;
  }
  if (uint < uintBoundaries[2]) {
    return 3;
  }
  if (uint < uintBoundaries[3]) {
    return 5;
  }
  return 9;
};
encodeUint.compareTokens = function compareTokens(tok1, tok2) {
  return tok1.value < tok2.value ? -1 : tok1.value > tok2.value ? 1 : (
    /* c8 ignore next */
    0
  );
};

// node_modules/@ipld/dag-cbor/node_modules/cborg/lib/1negint.js
function decodeNegint8(data, pos, _minor, options) {
  return new Token(Type.negint, -1 - readUint8(data, pos + 1, options), 2);
}
function decodeNegint16(data, pos, _minor, options) {
  return new Token(Type.negint, -1 - readUint16(data, pos + 1, options), 3);
}
function decodeNegint32(data, pos, _minor, options) {
  return new Token(Type.negint, -1 - readUint32(data, pos + 1, options), 5);
}
var neg1b = BigInt(-1);
var pos1b = BigInt(1);
function decodeNegint64(data, pos, _minor, options) {
  const int = readUint64(data, pos + 1, options);
  if (typeof int !== "bigint") {
    const value = -1 - int;
    if (value >= Number.MIN_SAFE_INTEGER) {
      return new Token(Type.negint, value, 9);
    }
  }
  if (options.allowBigInt !== true) {
    throw new Error(`${decodeErrPrefix} integers outside of the safe integer range are not supported`);
  }
  return new Token(Type.negint, neg1b - BigInt(int), 9);
}
function encodeNegint(buf3, token) {
  const negint = token.value;
  const unsigned = typeof negint === "bigint" ? negint * neg1b - pos1b : negint * -1 - 1;
  encodeUintValue(buf3, token.type.majorEncoded, unsigned);
}
encodeNegint.encodedSize = function encodedSize3(token) {
  const negint = token.value;
  const unsigned = typeof negint === "bigint" ? negint * neg1b - pos1b : negint * -1 - 1;
  if (unsigned < uintBoundaries[0]) {
    return 1;
  }
  if (unsigned < uintBoundaries[1]) {
    return 2;
  }
  if (unsigned < uintBoundaries[2]) {
    return 3;
  }
  if (unsigned < uintBoundaries[3]) {
    return 5;
  }
  return 9;
};
encodeNegint.compareTokens = function compareTokens2(tok1, tok2) {
  return tok1.value < tok2.value ? 1 : tok1.value > tok2.value ? -1 : (
    /* c8 ignore next */
    0
  );
};

// node_modules/@ipld/dag-cbor/node_modules/cborg/lib/2bytes.js
function toToken(data, pos, prefix, length11) {
  assertEnoughData(data, pos, prefix + length11);
  const buf3 = slice(data, pos + prefix, pos + prefix + length11);
  return new Token(Type.bytes, buf3, prefix + length11);
}
function decodeBytesCompact(data, pos, minor, _options) {
  return toToken(data, pos, 1, minor);
}
function decodeBytes8(data, pos, _minor, options) {
  return toToken(data, pos, 2, readUint8(data, pos + 1, options));
}
function decodeBytes16(data, pos, _minor, options) {
  return toToken(data, pos, 3, readUint16(data, pos + 1, options));
}
function decodeBytes32(data, pos, _minor, options) {
  return toToken(data, pos, 5, readUint32(data, pos + 1, options));
}
function decodeBytes64(data, pos, _minor, options) {
  const l = readUint64(data, pos + 1, options);
  if (typeof l === "bigint") {
    throw new Error(`${decodeErrPrefix} 64-bit integer bytes lengths not supported`);
  }
  return toToken(data, pos, 9, l);
}
function tokenBytes(token) {
  if (token.encodedBytes === void 0) {
    token.encodedBytes = token.type === Type.string ? fromString8(token.value) : token.value;
  }
  return token.encodedBytes;
}
function encodeBytes(buf3, token) {
  const bytes = tokenBytes(token);
  encodeUintValue(buf3, token.type.majorEncoded, bytes.length);
  buf3.push(bytes);
}
encodeBytes.encodedSize = function encodedSize4(token) {
  const bytes = tokenBytes(token);
  return encodeUintValue.encodedSize(bytes.length) + bytes.length;
};
encodeBytes.compareTokens = function compareTokens3(tok1, tok2) {
  return compareBytes(tokenBytes(tok1), tokenBytes(tok2));
};
function compareBytes(b1, b2) {
  return b1.length < b2.length ? -1 : b1.length > b2.length ? 1 : compare(b1, b2);
}

// node_modules/@ipld/dag-cbor/node_modules/cborg/lib/3string.js
function toToken2(data, pos, prefix, length11, options) {
  const totLength = prefix + length11;
  assertEnoughData(data, pos, totLength);
  const tok = new Token(Type.string, toString5(data, pos + prefix, pos + totLength), totLength);
  if (options.retainStringBytes === true) {
    tok.byteValue = slice(data, pos + prefix, pos + totLength);
  }
  return tok;
}
function decodeStringCompact(data, pos, minor, options) {
  return toToken2(data, pos, 1, minor, options);
}
function decodeString8(data, pos, _minor, options) {
  return toToken2(data, pos, 2, readUint8(data, pos + 1, options), options);
}
function decodeString16(data, pos, _minor, options) {
  return toToken2(data, pos, 3, readUint16(data, pos + 1, options), options);
}
function decodeString32(data, pos, _minor, options) {
  return toToken2(data, pos, 5, readUint32(data, pos + 1, options), options);
}
function decodeString64(data, pos, _minor, options) {
  const l = readUint64(data, pos + 1, options);
  if (typeof l === "bigint") {
    throw new Error(`${decodeErrPrefix} 64-bit integer string lengths not supported`);
  }
  return toToken2(data, pos, 9, l, options);
}
var encodeString = encodeBytes;

// node_modules/@ipld/dag-cbor/node_modules/cborg/lib/4array.js
function toToken3(_data, _pos, prefix, length11) {
  return new Token(Type.array, length11, prefix);
}
function decodeArrayCompact(data, pos, minor, _options) {
  return toToken3(data, pos, 1, minor);
}
function decodeArray8(data, pos, _minor, options) {
  return toToken3(data, pos, 2, readUint8(data, pos + 1, options));
}
function decodeArray16(data, pos, _minor, options) {
  return toToken3(data, pos, 3, readUint16(data, pos + 1, options));
}
function decodeArray32(data, pos, _minor, options) {
  return toToken3(data, pos, 5, readUint32(data, pos + 1, options));
}
function decodeArray64(data, pos, _minor, options) {
  const l = readUint64(data, pos + 1, options);
  if (typeof l === "bigint") {
    throw new Error(`${decodeErrPrefix} 64-bit integer array lengths not supported`);
  }
  return toToken3(data, pos, 9, l);
}
function decodeArrayIndefinite(data, pos, _minor, options) {
  if (options.allowIndefinite === false) {
    throw new Error(`${decodeErrPrefix} indefinite length items not allowed`);
  }
  return toToken3(data, pos, 1, Infinity);
}
function encodeArray(buf3, token) {
  encodeUintValue(buf3, Type.array.majorEncoded, token.value);
}
encodeArray.compareTokens = encodeUint.compareTokens;
encodeArray.encodedSize = function encodedSize5(token) {
  return encodeUintValue.encodedSize(token.value);
};

// node_modules/@ipld/dag-cbor/node_modules/cborg/lib/5map.js
function toToken4(_data, _pos, prefix, length11) {
  return new Token(Type.map, length11, prefix);
}
function decodeMapCompact(data, pos, minor, _options) {
  return toToken4(data, pos, 1, minor);
}
function decodeMap8(data, pos, _minor, options) {
  return toToken4(data, pos, 2, readUint8(data, pos + 1, options));
}
function decodeMap16(data, pos, _minor, options) {
  return toToken4(data, pos, 3, readUint16(data, pos + 1, options));
}
function decodeMap32(data, pos, _minor, options) {
  return toToken4(data, pos, 5, readUint32(data, pos + 1, options));
}
function decodeMap64(data, pos, _minor, options) {
  const l = readUint64(data, pos + 1, options);
  if (typeof l === "bigint") {
    throw new Error(`${decodeErrPrefix} 64-bit integer map lengths not supported`);
  }
  return toToken4(data, pos, 9, l);
}
function decodeMapIndefinite(data, pos, _minor, options) {
  if (options.allowIndefinite === false) {
    throw new Error(`${decodeErrPrefix} indefinite length items not allowed`);
  }
  return toToken4(data, pos, 1, Infinity);
}
function encodeMap(buf3, token) {
  encodeUintValue(buf3, Type.map.majorEncoded, token.value);
}
encodeMap.compareTokens = encodeUint.compareTokens;
encodeMap.encodedSize = function encodedSize6(token) {
  return encodeUintValue.encodedSize(token.value);
};

// node_modules/@ipld/dag-cbor/node_modules/cborg/lib/6tag.js
function decodeTagCompact(_data, _pos, minor, _options) {
  return new Token(Type.tag, minor, 1);
}
function decodeTag8(data, pos, _minor, options) {
  return new Token(Type.tag, readUint8(data, pos + 1, options), 2);
}
function decodeTag16(data, pos, _minor, options) {
  return new Token(Type.tag, readUint16(data, pos + 1, options), 3);
}
function decodeTag32(data, pos, _minor, options) {
  return new Token(Type.tag, readUint32(data, pos + 1, options), 5);
}
function decodeTag64(data, pos, _minor, options) {
  return new Token(Type.tag, readUint64(data, pos + 1, options), 9);
}
function encodeTag(buf3, token) {
  encodeUintValue(buf3, Type.tag.majorEncoded, token.value);
}
encodeTag.compareTokens = encodeUint.compareTokens;
encodeTag.encodedSize = function encodedSize7(token) {
  return encodeUintValue.encodedSize(token.value);
};

// node_modules/@ipld/dag-cbor/node_modules/cborg/lib/7float.js
var MINOR_FALSE = 20;
var MINOR_TRUE = 21;
var MINOR_NULL = 22;
var MINOR_UNDEFINED = 23;
function decodeUndefined(_data, _pos, _minor, options) {
  if (options.allowUndefined === false) {
    throw new Error(`${decodeErrPrefix} undefined values are not supported`);
  } else if (options.coerceUndefinedToNull === true) {
    return new Token(Type.null, null, 1);
  }
  return new Token(Type.undefined, void 0, 1);
}
function decodeBreak(_data, _pos, _minor, options) {
  if (options.allowIndefinite === false) {
    throw new Error(`${decodeErrPrefix} indefinite length items not allowed`);
  }
  return new Token(Type.break, void 0, 1);
}
function createToken(value, bytes, options) {
  if (options) {
    if (options.allowNaN === false && Number.isNaN(value)) {
      throw new Error(`${decodeErrPrefix} NaN values are not supported`);
    }
    if (options.allowInfinity === false && (value === Infinity || value === -Infinity)) {
      throw new Error(`${decodeErrPrefix} Infinity values are not supported`);
    }
  }
  return new Token(Type.float, value, bytes);
}
function decodeFloat16(data, pos, _minor, options) {
  return createToken(readFloat16(data, pos + 1), 3, options);
}
function decodeFloat32(data, pos, _minor, options) {
  return createToken(readFloat32(data, pos + 1), 5, options);
}
function decodeFloat64(data, pos, _minor, options) {
  return createToken(readFloat64(data, pos + 1), 9, options);
}
function encodeFloat(buf3, token, options) {
  const float = token.value;
  if (float === false) {
    buf3.push([Type.float.majorEncoded | MINOR_FALSE]);
  } else if (float === true) {
    buf3.push([Type.float.majorEncoded | MINOR_TRUE]);
  } else if (float === null) {
    buf3.push([Type.float.majorEncoded | MINOR_NULL]);
  } else if (float === void 0) {
    buf3.push([Type.float.majorEncoded | MINOR_UNDEFINED]);
  } else {
    let decoded;
    let success = false;
    if (!options || options.float64 !== true) {
      encodeFloat16(float);
      decoded = readFloat16(ui8a, 1);
      if (float === decoded || Number.isNaN(float)) {
        ui8a[0] = 249;
        buf3.push(ui8a.slice(0, 3));
        success = true;
      } else {
        encodeFloat32(float);
        decoded = readFloat32(ui8a, 1);
        if (float === decoded) {
          ui8a[0] = 250;
          buf3.push(ui8a.slice(0, 5));
          success = true;
        }
      }
    }
    if (!success) {
      encodeFloat64(float);
      decoded = readFloat64(ui8a, 1);
      ui8a[0] = 251;
      buf3.push(ui8a.slice(0, 9));
    }
  }
}
encodeFloat.encodedSize = function encodedSize8(token, options) {
  const float = token.value;
  if (float === false || float === true || float === null || float === void 0) {
    return 1;
  }
  if (!options || options.float64 !== true) {
    encodeFloat16(float);
    let decoded = readFloat16(ui8a, 1);
    if (float === decoded || Number.isNaN(float)) {
      return 3;
    }
    encodeFloat32(float);
    decoded = readFloat32(ui8a, 1);
    if (float === decoded) {
      return 5;
    }
  }
  return 9;
};
var buffer = new ArrayBuffer(9);
var dataView = new DataView(buffer, 1);
var ui8a = new Uint8Array(buffer, 0);
function encodeFloat16(inp) {
  if (inp === Infinity) {
    dataView.setUint16(0, 31744, false);
  } else if (inp === -Infinity) {
    dataView.setUint16(0, 64512, false);
  } else if (Number.isNaN(inp)) {
    dataView.setUint16(0, 32256, false);
  } else {
    dataView.setFloat32(0, inp);
    const valu32 = dataView.getUint32(0);
    const exponent = (valu32 & 2139095040) >> 23;
    const mantissa = valu32 & 8388607;
    if (exponent === 255) {
      dataView.setUint16(0, 31744, false);
    } else if (exponent === 0) {
      dataView.setUint16(0, (inp & 2147483648) >> 16 | mantissa >> 13, false);
    } else {
      const logicalExponent = exponent - 127;
      if (logicalExponent < -24) {
        dataView.setUint16(0, 0);
      } else if (logicalExponent < -14) {
        dataView.setUint16(0, (valu32 & 2147483648) >> 16 | /* sign bit */
        1 << 24 + logicalExponent, false);
      } else {
        dataView.setUint16(0, (valu32 & 2147483648) >> 16 | logicalExponent + 15 << 10 | mantissa >> 13, false);
      }
    }
  }
}
function readFloat16(ui8a3, pos) {
  if (ui8a3.length - pos < 2) {
    throw new Error(`${decodeErrPrefix} not enough data for float16`);
  }
  const half = (ui8a3[pos] << 8) + ui8a3[pos + 1];
  if (half === 31744) {
    return Infinity;
  }
  if (half === 64512) {
    return -Infinity;
  }
  if (half === 32256) {
    return NaN;
  }
  const exp = half >> 10 & 31;
  const mant = half & 1023;
  let val;
  if (exp === 0) {
    val = mant * 2 ** -24;
  } else if (exp !== 31) {
    val = (mant + 1024) * 2 ** (exp - 25);
  } else {
    val = mant === 0 ? Infinity : NaN;
  }
  return half & 32768 ? -val : val;
}
function encodeFloat32(inp) {
  dataView.setFloat32(0, inp, false);
}
function readFloat32(ui8a3, pos) {
  if (ui8a3.length - pos < 4) {
    throw new Error(`${decodeErrPrefix} not enough data for float32`);
  }
  const offset = (ui8a3.byteOffset || 0) + pos;
  return new DataView(ui8a3.buffer, offset, 4).getFloat32(0, false);
}
function encodeFloat64(inp) {
  dataView.setFloat64(0, inp, false);
}
function readFloat64(ui8a3, pos) {
  if (ui8a3.length - pos < 8) {
    throw new Error(`${decodeErrPrefix} not enough data for float64`);
  }
  const offset = (ui8a3.byteOffset || 0) + pos;
  return new DataView(ui8a3.buffer, offset, 8).getFloat64(0, false);
}
encodeFloat.compareTokens = encodeUint.compareTokens;

// node_modules/@ipld/dag-cbor/node_modules/cborg/lib/jump.js
function invalidMinor(data, pos, minor) {
  throw new Error(`${decodeErrPrefix} encountered invalid minor (${minor}) for major ${data[pos] >>> 5}`);
}
function errorer(msg) {
  return () => {
    throw new Error(`${decodeErrPrefix} ${msg}`);
  };
}
var jump = [];
for (let i = 0; i <= 23; i++) {
  jump[i] = invalidMinor;
}
jump[24] = decodeUint8;
jump[25] = decodeUint16;
jump[26] = decodeUint32;
jump[27] = decodeUint64;
jump[28] = invalidMinor;
jump[29] = invalidMinor;
jump[30] = invalidMinor;
jump[31] = invalidMinor;
for (let i = 32; i <= 55; i++) {
  jump[i] = invalidMinor;
}
jump[56] = decodeNegint8;
jump[57] = decodeNegint16;
jump[58] = decodeNegint32;
jump[59] = decodeNegint64;
jump[60] = invalidMinor;
jump[61] = invalidMinor;
jump[62] = invalidMinor;
jump[63] = invalidMinor;
for (let i = 64; i <= 87; i++) {
  jump[i] = decodeBytesCompact;
}
jump[88] = decodeBytes8;
jump[89] = decodeBytes16;
jump[90] = decodeBytes32;
jump[91] = decodeBytes64;
jump[92] = invalidMinor;
jump[93] = invalidMinor;
jump[94] = invalidMinor;
jump[95] = errorer("indefinite length bytes/strings are not supported");
for (let i = 96; i <= 119; i++) {
  jump[i] = decodeStringCompact;
}
jump[120] = decodeString8;
jump[121] = decodeString16;
jump[122] = decodeString32;
jump[123] = decodeString64;
jump[124] = invalidMinor;
jump[125] = invalidMinor;
jump[126] = invalidMinor;
jump[127] = errorer("indefinite length bytes/strings are not supported");
for (let i = 128; i <= 151; i++) {
  jump[i] = decodeArrayCompact;
}
jump[152] = decodeArray8;
jump[153] = decodeArray16;
jump[154] = decodeArray32;
jump[155] = decodeArray64;
jump[156] = invalidMinor;
jump[157] = invalidMinor;
jump[158] = invalidMinor;
jump[159] = decodeArrayIndefinite;
for (let i = 160; i <= 183; i++) {
  jump[i] = decodeMapCompact;
}
jump[184] = decodeMap8;
jump[185] = decodeMap16;
jump[186] = decodeMap32;
jump[187] = decodeMap64;
jump[188] = invalidMinor;
jump[189] = invalidMinor;
jump[190] = invalidMinor;
jump[191] = decodeMapIndefinite;
for (let i = 192; i <= 215; i++) {
  jump[i] = decodeTagCompact;
}
jump[216] = decodeTag8;
jump[217] = decodeTag16;
jump[218] = decodeTag32;
jump[219] = decodeTag64;
jump[220] = invalidMinor;
jump[221] = invalidMinor;
jump[222] = invalidMinor;
jump[223] = invalidMinor;
for (let i = 224; i <= 243; i++) {
  jump[i] = errorer("simple values are not supported");
}
jump[244] = invalidMinor;
jump[245] = invalidMinor;
jump[246] = invalidMinor;
jump[247] = decodeUndefined;
jump[248] = errorer("simple values are not supported");
jump[249] = decodeFloat16;
jump[250] = decodeFloat32;
jump[251] = decodeFloat64;
jump[252] = invalidMinor;
jump[253] = invalidMinor;
jump[254] = invalidMinor;
jump[255] = decodeBreak;
var quick = [];
for (let i = 0; i < 24; i++) {
  quick[i] = new Token(Type.uint, i, 1);
}
for (let i = -1; i >= -24; i--) {
  quick[31 - i] = new Token(Type.negint, i, 1);
}
quick[64] = new Token(Type.bytes, new Uint8Array(0), 1);
quick[96] = new Token(Type.string, "", 1);
quick[128] = new Token(Type.array, 0, 1);
quick[160] = new Token(Type.map, 0, 1);
quick[244] = new Token(Type.false, false, 1);
quick[245] = new Token(Type.true, true, 1);
quick[246] = new Token(Type.null, null, 1);

// node_modules/@ipld/dag-cbor/node_modules/cborg/lib/encode.js
function makeCborEncoders() {
  const encoders = [];
  encoders[Type.uint.major] = encodeUint;
  encoders[Type.negint.major] = encodeNegint;
  encoders[Type.bytes.major] = encodeBytes;
  encoders[Type.string.major] = encodeString;
  encoders[Type.array.major] = encodeArray;
  encoders[Type.map.major] = encodeMap;
  encoders[Type.tag.major] = encodeTag;
  encoders[Type.float.major] = encodeFloat;
  return encoders;
}
var cborEncoders = makeCborEncoders();
var buf = new Bl();
var Ref = class _Ref {
  /**
   * @param {object|any[]} obj
   * @param {Reference|undefined} parent
   */
  constructor(obj, parent) {
    this.obj = obj;
    this.parent = parent;
  }
  /**
   * @param {object|any[]} obj
   * @returns {boolean}
   */
  includes(obj) {
    let p = this;
    do {
      if (p.obj === obj) {
        return true;
      }
    } while (p = p.parent);
    return false;
  }
  /**
   * @param {Reference|undefined} stack
   * @param {object|any[]} obj
   * @returns {Reference}
   */
  static createCheck(stack, obj) {
    if (stack && stack.includes(obj)) {
      throw new Error(`${encodeErrPrefix} object contains circular references`);
    }
    return new _Ref(obj, stack);
  }
};
var simpleTokens = {
  null: new Token(Type.null, null),
  undefined: new Token(Type.undefined, void 0),
  true: new Token(Type.true, true),
  false: new Token(Type.false, false),
  emptyArray: new Token(Type.array, 0),
  emptyMap: new Token(Type.map, 0)
};
var typeEncoders = {
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  number(obj, _typ, _options, _refStack) {
    if (!Number.isInteger(obj) || !Number.isSafeInteger(obj)) {
      return new Token(Type.float, obj);
    } else if (obj >= 0) {
      return new Token(Type.uint, obj);
    } else {
      return new Token(Type.negint, obj);
    }
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  bigint(obj, _typ, _options, _refStack) {
    if (obj >= BigInt(0)) {
      return new Token(Type.uint, obj);
    } else {
      return new Token(Type.negint, obj);
    }
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  Uint8Array(obj, _typ, _options, _refStack) {
    return new Token(Type.bytes, obj);
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  string(obj, _typ, _options, _refStack) {
    return new Token(Type.string, obj);
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  boolean(obj, _typ, _options, _refStack) {
    return obj ? simpleTokens.true : simpleTokens.false;
  },
  /**
   * @param {any} _obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  null(_obj, _typ, _options, _refStack) {
    return simpleTokens.null;
  },
  /**
   * @param {any} _obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  undefined(_obj, _typ, _options, _refStack) {
    return simpleTokens.undefined;
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  ArrayBuffer(obj, _typ, _options, _refStack) {
    return new Token(Type.bytes, new Uint8Array(obj));
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  DataView(obj, _typ, _options, _refStack) {
    return new Token(Type.bytes, new Uint8Array(obj.buffer, obj.byteOffset, obj.byteLength));
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} options
   * @param {Reference} [refStack]
   * @returns {TokenOrNestedTokens}
   */
  Array(obj, _typ, options, refStack) {
    if (!obj.length) {
      if (options.addBreakTokens === true) {
        return [simpleTokens.emptyArray, new Token(Type.break)];
      }
      return simpleTokens.emptyArray;
    }
    refStack = Ref.createCheck(refStack, obj);
    const entries = [];
    let i = 0;
    for (const e of obj) {
      entries[i++] = objectToTokens(e, options, refStack);
    }
    if (options.addBreakTokens) {
      return [new Token(Type.array, obj.length), entries, new Token(Type.break)];
    }
    return [new Token(Type.array, obj.length), entries];
  },
  /**
   * @param {any} obj
   * @param {string} typ
   * @param {EncodeOptions} options
   * @param {Reference} [refStack]
   * @returns {TokenOrNestedTokens}
   */
  Object(obj, typ, options, refStack) {
    const isMap = typ !== "Object";
    const keys = isMap ? obj.keys() : Object.keys(obj);
    const length11 = isMap ? obj.size : keys.length;
    if (!length11) {
      if (options.addBreakTokens === true) {
        return [simpleTokens.emptyMap, new Token(Type.break)];
      }
      return simpleTokens.emptyMap;
    }
    refStack = Ref.createCheck(refStack, obj);
    const entries = [];
    let i = 0;
    for (const key of keys) {
      entries[i++] = [
        objectToTokens(key, options, refStack),
        objectToTokens(isMap ? obj.get(key) : obj[key], options, refStack)
      ];
    }
    sortMapEntries(entries, options);
    if (options.addBreakTokens) {
      return [new Token(Type.map, length11), entries, new Token(Type.break)];
    }
    return [new Token(Type.map, length11), entries];
  }
};
typeEncoders.Map = typeEncoders.Object;
typeEncoders.Buffer = typeEncoders.Uint8Array;
for (const typ of "Uint8Clamped Uint16 Uint32 Int8 Int16 Int32 BigUint64 BigInt64 Float32 Float64".split(" ")) {
  typeEncoders[`${typ}Array`] = typeEncoders.DataView;
}
function objectToTokens(obj, options = {}, refStack) {
  const typ = is(obj);
  const customTypeEncoder = options && options.typeEncoders && /** @type {OptionalTypeEncoder} */
  options.typeEncoders[typ] || typeEncoders[typ];
  if (typeof customTypeEncoder === "function") {
    const tokens = customTypeEncoder(obj, typ, options, refStack);
    if (tokens != null) {
      return tokens;
    }
  }
  const typeEncoder = typeEncoders[typ];
  if (!typeEncoder) {
    throw new Error(`${encodeErrPrefix} unsupported type: ${typ}`);
  }
  return typeEncoder(obj, typ, options, refStack);
}
function sortMapEntries(entries, options) {
  if (options.mapSorter) {
    entries.sort(options.mapSorter);
  }
}

// node_modules/@ipld/dag-cbor/node_modules/cborg/lib/decode.js
var defaultDecodeOptions = {
  strict: false,
  allowIndefinite: true,
  allowUndefined: true,
  allowBigInt: true
};
var Tokeniser = class {
  /**
   * @param {Uint8Array} data
   * @param {DecodeOptions} options
   */
  constructor(data, options = {}) {
    this._pos = 0;
    this.data = data;
    this.options = options;
  }
  pos() {
    return this._pos;
  }
  done() {
    return this._pos >= this.data.length;
  }
  next() {
    const byt = this.data[this._pos];
    let token = quick[byt];
    if (token === void 0) {
      const decoder = jump[byt];
      if (!decoder) {
        throw new Error(`${decodeErrPrefix} no decoder for major type ${byt >>> 5} (byte 0x${byt.toString(16).padStart(2, "0")})`);
      }
      const minor = byt & 31;
      token = decoder(this.data, this._pos, minor, this.options);
    }
    this._pos += token.encodedLength;
    return token;
  }
};
var DONE = Symbol.for("DONE");
var BREAK = Symbol.for("BREAK");
function tokenToArray(token, tokeniser, options) {
  const arr = [];
  for (let i = 0; i < token.value; i++) {
    const value = tokensToObject(tokeniser, options);
    if (value === BREAK) {
      if (token.value === Infinity) {
        break;
      }
      throw new Error(`${decodeErrPrefix} got unexpected break to lengthed array`);
    }
    if (value === DONE) {
      throw new Error(`${decodeErrPrefix} found array but not enough entries (got ${i}, expected ${token.value})`);
    }
    arr[i] = value;
  }
  return arr;
}
function tokenToMap(token, tokeniser, options) {
  const useMaps = options.useMaps === true;
  const obj = useMaps ? void 0 : {};
  const m = useMaps ? /* @__PURE__ */ new Map() : void 0;
  for (let i = 0; i < token.value; i++) {
    const key = tokensToObject(tokeniser, options);
    if (key === BREAK) {
      if (token.value === Infinity) {
        break;
      }
      throw new Error(`${decodeErrPrefix} got unexpected break to lengthed map`);
    }
    if (key === DONE) {
      throw new Error(`${decodeErrPrefix} found map but not enough entries (got ${i} [no key], expected ${token.value})`);
    }
    if (useMaps !== true && typeof key !== "string") {
      throw new Error(`${decodeErrPrefix} non-string keys not supported (got ${typeof key})`);
    }
    if (options.rejectDuplicateMapKeys === true) {
      if (useMaps && m.has(key) || !useMaps && key in obj) {
        throw new Error(`${decodeErrPrefix} found repeat map key "${key}"`);
      }
    }
    const value = tokensToObject(tokeniser, options);
    if (value === DONE) {
      throw new Error(`${decodeErrPrefix} found map but not enough entries (got ${i} [no value], expected ${token.value})`);
    }
    if (useMaps) {
      m.set(key, value);
    } else {
      obj[key] = value;
    }
  }
  return useMaps ? m : obj;
}
function tokensToObject(tokeniser, options) {
  if (tokeniser.done()) {
    return DONE;
  }
  const token = tokeniser.next();
  if (token.type === Type.break) {
    return BREAK;
  }
  if (token.type.terminal) {
    return token.value;
  }
  if (token.type === Type.array) {
    return tokenToArray(token, tokeniser, options);
  }
  if (token.type === Type.map) {
    return tokenToMap(token, tokeniser, options);
  }
  if (token.type === Type.tag) {
    if (options.tags && typeof options.tags[token.value] === "function") {
      const tagged = tokensToObject(tokeniser, options);
      return options.tags[token.value](tagged);
    }
    throw new Error(`${decodeErrPrefix} tag not supported (${token.value})`);
  }
  throw new Error("unsupported");
}
function decodeFirst(data, options) {
  if (!(data instanceof Uint8Array)) {
    throw new Error(`${decodeErrPrefix} data to decode must be a Uint8Array`);
  }
  options = Object.assign({}, defaultDecodeOptions, options);
  const tokeniser = options.tokenizer || new Tokeniser(data, options);
  const decoded = tokensToObject(tokeniser, options);
  if (decoded === DONE) {
    throw new Error(`${decodeErrPrefix} did not find any content to decode`);
  }
  if (decoded === BREAK) {
    throw new Error(`${decodeErrPrefix} got unexpected break`);
  }
  return [decoded, data.subarray(tokeniser.pos())];
}
function decode30(data, options) {
  const [decoded, remainder] = decodeFirst(data, options);
  if (remainder.length > 0) {
    throw new Error(`${decodeErrPrefix} too many terminals, data makes no sense`);
  }
  return decoded;
}

// node_modules/@ipld/dag-cbor/node_modules/multiformats/dist/src/bytes.js
var empty7 = new Uint8Array(0);
function equals14(aa, bb) {
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
function coerce7(o) {
  if (o instanceof Uint8Array && o.constructor.name === "Uint8Array")
    return o;
  if (o instanceof ArrayBuffer)
    return new Uint8Array(o);
  if (ArrayBuffer.isView(o)) {
    return new Uint8Array(o.buffer, o.byteOffset, o.byteLength);
  }
  throw new Error("Unknown type, must be binary type");
}

// node_modules/@ipld/dag-cbor/node_modules/multiformats/dist/src/vendor/base-x.js
function base7(ALPHABET, name8) {
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
  function encode33(source) {
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
    var length11 = 0;
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
      for (var it1 = size - 1; (carry !== 0 || i2 < length11) && it1 !== -1; it1--, i2++) {
        carry += 256 * b58[it1] >>> 0;
        b58[it1] = carry % BASE >>> 0;
        carry = carry / BASE >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length11 = i2;
      pbegin++;
    }
    var it2 = size - length11;
    while (it2 !== size && b58[it2] === 0) {
      it2++;
    }
    var str = LEADER.repeat(zeroes);
    for (; it2 < size; ++it2) {
      str += ALPHABET.charAt(b58[it2]);
    }
    return str;
  }
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
    var length11 = 0;
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
      for (var it3 = size - 1; (carry !== 0 || i2 < length11) && it3 !== -1; it3--, i2++) {
        carry += BASE * b256[it3] >>> 0;
        b256[it3] = carry % 256 >>> 0;
        carry = carry / 256 >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length11 = i2;
      psz++;
    }
    if (source[psz] === " ") {
      return;
    }
    var it4 = size - length11;
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
  function decode49(string5) {
    var buffer3 = decodeUnsafe(string5);
    if (buffer3) {
      return buffer3;
    }
    throw new Error(`Non-${name8} character`);
  }
  return {
    encode: encode33,
    decodeUnsafe,
    decode: decode49
  };
}
var src7 = base7;
var _brrp__multiformats_scope_baseX7 = src7;
var base_x_default7 = _brrp__multiformats_scope_baseX7;

// node_modules/@ipld/dag-cbor/node_modules/multiformats/dist/src/bases/base.js
var Encoder7 = class {
  name;
  prefix;
  baseEncode;
  constructor(name8, prefix, baseEncode) {
    this.name = name8;
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
var Decoder7 = class {
  name;
  prefix;
  baseDecode;
  prefixCodePoint;
  constructor(name8, prefix, baseDecode) {
    this.name = name8;
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
    return or7(this, decoder);
  }
};
var ComposedDecoder7 = class {
  decoders;
  constructor(decoders) {
    this.decoders = decoders;
  }
  or(decoder) {
    return or7(this, decoder);
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
function or7(left, right) {
  return new ComposedDecoder7({
    ...left.decoders ?? { [left.prefix]: left },
    ...right.decoders ?? { [right.prefix]: right }
  });
}
var Codec7 = class {
  name;
  prefix;
  baseEncode;
  baseDecode;
  encoder;
  decoder;
  constructor(name8, prefix, baseEncode, baseDecode) {
    this.name = name8;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
    this.baseDecode = baseDecode;
    this.encoder = new Encoder7(name8, prefix, baseEncode);
    this.decoder = new Decoder7(name8, prefix, baseDecode);
  }
  encode(input) {
    return this.encoder.encode(input);
  }
  decode(input) {
    return this.decoder.decode(input);
  }
};
function from11({ name: name8, prefix, encode: encode33, decode: decode49 }) {
  return new Codec7(name8, prefix, encode33, decode49);
}
function baseX7({ name: name8, prefix, alphabet: alphabet5 }) {
  const { encode: encode33, decode: decode49 } = base_x_default7(alphabet5, name8);
  return from11({
    prefix,
    name: name8,
    encode: encode33,
    decode: (text) => coerce7(decode49(text))
  });
}
function decode31(string5, alphabet5, bitsPerChar, name8) {
  const codes = {};
  for (let i = 0; i < alphabet5.length; ++i) {
    codes[alphabet5[i]] = i;
  }
  let end = string5.length;
  while (string5[end - 1] === "=") {
    --end;
  }
  const out = new Uint8Array(end * bitsPerChar / 8 | 0);
  let bits = 0;
  let buffer3 = 0;
  let written = 0;
  for (let i = 0; i < end; ++i) {
    const value = codes[string5[i]];
    if (value === void 0) {
      throw new SyntaxError(`Non-${name8} character`);
    }
    buffer3 = buffer3 << bitsPerChar | value;
    bits += bitsPerChar;
    if (bits >= 8) {
      bits -= 8;
      out[written++] = 255 & buffer3 >> bits;
    }
  }
  if (bits >= bitsPerChar || (255 & buffer3 << 8 - bits) !== 0) {
    throw new SyntaxError("Unexpected end of data");
  }
  return out;
}
function encode22(data, alphabet5, bitsPerChar) {
  const pad = alphabet5[alphabet5.length - 1] === "=";
  const mask = (1 << bitsPerChar) - 1;
  let out = "";
  let bits = 0;
  let buffer3 = 0;
  for (let i = 0; i < data.length; ++i) {
    buffer3 = buffer3 << 8 | data[i];
    bits += 8;
    while (bits > bitsPerChar) {
      bits -= bitsPerChar;
      out += alphabet5[mask & buffer3 >> bits];
    }
  }
  if (bits !== 0) {
    out += alphabet5[mask & buffer3 << bitsPerChar - bits];
  }
  if (pad) {
    while ((out.length * bitsPerChar & 7) !== 0) {
      out += "=";
    }
  }
  return out;
}
function rfc46487({ name: name8, prefix, bitsPerChar, alphabet: alphabet5 }) {
  return from11({
    prefix,
    name: name8,
    encode(input) {
      return encode22(input, alphabet5, bitsPerChar);
    },
    decode(input) {
      return decode31(input, alphabet5, bitsPerChar, name8);
    }
  });
}

// node_modules/@ipld/dag-cbor/node_modules/multiformats/dist/src/bases/base32.js
var base327 = rfc46487({
  prefix: "b",
  name: "base32",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567",
  bitsPerChar: 5
});
var base32upper7 = rfc46487({
  prefix: "B",
  name: "base32upper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
  bitsPerChar: 5
});
var base32pad7 = rfc46487({
  prefix: "c",
  name: "base32pad",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
  bitsPerChar: 5
});
var base32padupper7 = rfc46487({
  prefix: "C",
  name: "base32padupper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
  bitsPerChar: 5
});
var base32hex7 = rfc46487({
  prefix: "v",
  name: "base32hex",
  alphabet: "0123456789abcdefghijklmnopqrstuv",
  bitsPerChar: 5
});
var base32hexupper7 = rfc46487({
  prefix: "V",
  name: "base32hexupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
  bitsPerChar: 5
});
var base32hexpad7 = rfc46487({
  prefix: "t",
  name: "base32hexpad",
  alphabet: "0123456789abcdefghijklmnopqrstuv=",
  bitsPerChar: 5
});
var base32hexpadupper7 = rfc46487({
  prefix: "T",
  name: "base32hexpadupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
  bitsPerChar: 5
});
var base32z7 = rfc46487({
  prefix: "h",
  name: "base32z",
  alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
  bitsPerChar: 5
});

// node_modules/@ipld/dag-cbor/node_modules/multiformats/dist/src/bases/base58.js
var base58btc7 = baseX7({
  name: "base58btc",
  prefix: "z",
  alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
});
var base58flickr7 = baseX7({
  name: "base58flickr",
  prefix: "Z",
  alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
});

// node_modules/@ipld/dag-cbor/node_modules/multiformats/dist/src/vendor/varint.js
var encode_17 = encode23;
var MSB8 = 128;
var REST8 = 127;
var MSBALL7 = ~REST8;
var INT7 = Math.pow(2, 31);
function encode23(num, out, offset) {
  out = out || [];
  offset = offset || 0;
  var oldOffset = offset;
  while (num >= INT7) {
    out[offset++] = num & 255 | MSB8;
    num /= 128;
  }
  while (num & MSBALL7) {
    out[offset++] = num & 255 | MSB8;
    num >>>= 7;
  }
  out[offset] = num | 0;
  encode23.bytes = offset - oldOffset + 1;
  return out;
}
var decode32 = read8;
var MSB$17 = 128;
var REST$17 = 127;
function read8(buf3, offset) {
  var res = 0, offset = offset || 0, shift = 0, counter = offset, b, l = buf3.length;
  do {
    if (counter >= l) {
      read8.bytes = 0;
      throw new RangeError("Could not decode varint");
    }
    b = buf3[counter++];
    res += shift < 28 ? (b & REST$17) << shift : (b & REST$17) * Math.pow(2, shift);
    shift += 7;
  } while (b >= MSB$17);
  read8.bytes = counter - offset;
  return res;
}
var N18 = Math.pow(2, 7);
var N28 = Math.pow(2, 14);
var N38 = Math.pow(2, 21);
var N48 = Math.pow(2, 28);
var N58 = Math.pow(2, 35);
var N68 = Math.pow(2, 42);
var N78 = Math.pow(2, 49);
var N87 = Math.pow(2, 56);
var N97 = Math.pow(2, 63);
var length8 = function(value) {
  return value < N18 ? 1 : value < N28 ? 2 : value < N38 ? 3 : value < N48 ? 4 : value < N58 ? 5 : value < N68 ? 6 : value < N78 ? 7 : value < N87 ? 8 : value < N97 ? 9 : 10;
};
var varint7 = {
  encode: encode_17,
  decode: decode32,
  encodingLength: length8
};
var _brrp_varint7 = varint7;
var varint_default7 = _brrp_varint7;

// node_modules/@ipld/dag-cbor/node_modules/multiformats/dist/src/varint.js
function decode33(data, offset = 0) {
  const code13 = varint_default7.decode(data, offset);
  return [code13, varint_default7.decode.bytes];
}
function encodeTo7(int, target, offset = 0) {
  varint_default7.encode(int, target, offset);
  return target;
}
function encodingLength8(int) {
  return varint_default7.encodingLength(int);
}

// node_modules/@ipld/dag-cbor/node_modules/multiformats/dist/src/hashes/digest.js
function create7(code13, digest6) {
  const size = digest6.byteLength;
  const sizeOffset = encodingLength8(code13);
  const digestOffset = sizeOffset + encodingLength8(size);
  const bytes = new Uint8Array(digestOffset + size);
  encodeTo7(code13, bytes, 0);
  encodeTo7(size, bytes, sizeOffset);
  bytes.set(digest6, digestOffset);
  return new Digest7(code13, size, digest6, bytes);
}
function decode34(multihash) {
  const bytes = coerce7(multihash);
  const [code13, sizeOffset] = decode33(bytes);
  const [size, digestOffset] = decode33(bytes.subarray(sizeOffset));
  const digest6 = bytes.subarray(sizeOffset + digestOffset);
  if (digest6.byteLength !== size) {
    throw new Error("Incorrect length");
  }
  return new Digest7(code13, size, digest6, bytes);
}
function equals15(a, b) {
  if (a === b) {
    return true;
  } else {
    const data = b;
    return a.code === data.code && a.size === data.size && data.bytes instanceof Uint8Array && equals14(a.bytes, data.bytes);
  }
}
var Digest7 = class {
  code;
  size;
  digest;
  bytes;
  /**
   * Creates a multihash digest.
   */
  constructor(code13, size, digest6, bytes) {
    this.code = code13;
    this.size = size;
    this.digest = digest6;
    this.bytes = bytes;
  }
};

// node_modules/@ipld/dag-cbor/node_modules/multiformats/dist/src/cid.js
function format7(link, base12) {
  const { bytes, version } = link;
  switch (version) {
    case 0:
      return toStringV07(bytes, baseCache7(link), base12 ?? base58btc7.encoder);
    default:
      return toStringV17(bytes, baseCache7(link), base12 ?? base327.encoder);
  }
}
var cache7 = /* @__PURE__ */ new WeakMap();
function baseCache7(cid) {
  const baseCache10 = cache7.get(cid);
  if (baseCache10 == null) {
    const baseCache11 = /* @__PURE__ */ new Map();
    cache7.set(cid, baseCache11);
    return baseCache11;
  }
  return baseCache10;
}
var CID7 = class _CID {
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
  constructor(version, code13, multihash, bytes) {
    this.code = code13;
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
        const { code: code13, multihash } = this;
        if (code13 !== DAG_PB_CODE7) {
          throw new Error("Cannot convert a non dag-pb CID to CIDv0");
        }
        if (multihash.code !== SHA_256_CODE7) {
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
        const { code: code13, digest: digest6 } = this.multihash;
        const multihash = create7(code13, digest6);
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
    return unknown != null && self.code === unknown.code && self.version === unknown.version && equals15(self.multihash, unknown.multihash);
  }
  toString(base12) {
    return format7(this, base12);
  }
  toJSON() {
    return { "/": format7(this) };
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
      const { version, code: code13, multihash, bytes } = value;
      return new _CID(version, code13, multihash, bytes ?? encodeCID7(version, code13, multihash.bytes));
    } else if (value[cidSymbol7] === true) {
      const { version, multihash, code: code13 } = value;
      const digest6 = decode34(multihash);
      return _CID.create(version, code13, digest6);
    } else {
      return null;
    }
  }
  /**
   * @param version - Version of the CID
   * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
   * @param digest - (Multi)hash of the of the content.
   */
  static create(version, code13, digest6) {
    if (typeof code13 !== "number") {
      throw new Error("String codecs are no longer supported");
    }
    if (!(digest6.bytes instanceof Uint8Array)) {
      throw new Error("Invalid digest");
    }
    switch (version) {
      case 0: {
        if (code13 !== DAG_PB_CODE7) {
          throw new Error(`Version 0 CID must use dag-pb (code: ${DAG_PB_CODE7}) block encoding`);
        } else {
          return new _CID(version, code13, digest6, digest6.bytes);
        }
      }
      case 1: {
        const bytes = encodeCID7(version, code13, digest6.bytes);
        return new _CID(version, code13, digest6, bytes);
      }
      default: {
        throw new Error("Invalid version");
      }
    }
  }
  /**
   * Simplified version of `create` for CIDv0.
   */
  static createV0(digest6) {
    return _CID.create(0, DAG_PB_CODE7, digest6);
  }
  /**
   * Simplified version of `create` for CIDv1.
   *
   * @param code - Content encoding format code.
   * @param digest - Multihash of the content.
   */
  static createV1(code13, digest6) {
    return _CID.create(1, code13, digest6);
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
    const multihashBytes = coerce7(bytes.subarray(prefixSize, prefixSize + specs.multihashSize));
    if (multihashBytes.byteLength !== specs.multihashSize) {
      throw new Error("Incorrect length");
    }
    const digestBytes = multihashBytes.subarray(specs.multihashSize - specs.digestSize);
    const digest6 = new Digest7(specs.multihashCode, specs.digestSize, digestBytes, multihashBytes);
    const cid = specs.version === 0 ? _CID.createV0(digest6) : _CID.createV1(specs.codec, digest6);
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
    const next = () => {
      const [i, length11] = decode33(initialBytes.subarray(offset));
      offset += length11;
      return i;
    };
    let version = next();
    let codec = DAG_PB_CODE7;
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
  static parse(source, base12) {
    const [prefix, bytes] = parseCIDtoBytes7(source, base12);
    const cid = _CID.decode(bytes);
    if (cid.version === 0 && source[0] !== "Q") {
      throw Error("Version 0 CID string must not include multibase prefix");
    }
    baseCache7(cid).set(prefix, source);
    return cid;
  }
};
function parseCIDtoBytes7(source, base12) {
  switch (source[0]) {
    case "Q": {
      const decoder = base12 ?? base58btc7;
      return [
        base58btc7.prefix,
        decoder.decode(`${base58btc7.prefix}${source}`)
      ];
    }
    case base58btc7.prefix: {
      const decoder = base12 ?? base58btc7;
      return [base58btc7.prefix, decoder.decode(source)];
    }
    case base327.prefix: {
      const decoder = base12 ?? base327;
      return [base327.prefix, decoder.decode(source)];
    }
    default: {
      if (base12 == null) {
        throw Error("To parse non base32 or base58btc encoded CID multibase decoder must be provided");
      }
      return [source[0], base12.decode(source)];
    }
  }
}
function toStringV07(bytes, cache10, base12) {
  const { prefix } = base12;
  if (prefix !== base58btc7.prefix) {
    throw Error(`Cannot string encode V0 in ${base12.name} encoding`);
  }
  const cid = cache10.get(prefix);
  if (cid == null) {
    const cid2 = base12.encode(bytes).slice(1);
    cache10.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
function toStringV17(bytes, cache10, base12) {
  const { prefix } = base12;
  const cid = cache10.get(prefix);
  if (cid == null) {
    const cid2 = base12.encode(bytes);
    cache10.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
var DAG_PB_CODE7 = 112;
var SHA_256_CODE7 = 18;
function encodeCID7(version, code13, multihash) {
  const codeOffset = encodingLength8(version);
  const hashOffset = codeOffset + encodingLength8(code13);
  const bytes = new Uint8Array(hashOffset + multihash.byteLength);
  encodeTo7(version, bytes, 0);
  encodeTo7(code13, bytes, codeOffset);
  bytes.set(multihash, hashOffset);
  return bytes;
}
var cidSymbol7 = Symbol.for("@ipld/js-cid/CID");

// node_modules/@ipld/dag-cbor/src/index.js
var CID_CBOR_TAG = 42;
function toByteView2(buf3) {
  if (buf3 instanceof ArrayBuffer) {
    return new Uint8Array(buf3, 0, buf3.byteLength);
  }
  return buf3;
}
function cidEncoder(obj) {
  if (obj.asCID !== obj && obj["/"] !== obj.bytes) {
    return null;
  }
  const cid = CID7.asCID(obj);
  if (!cid) {
    return null;
  }
  const bytes = new Uint8Array(cid.bytes.byteLength + 1);
  bytes.set(cid.bytes, 1);
  return [
    new Token(Type.tag, CID_CBOR_TAG),
    new Token(Type.bytes, bytes)
  ];
}
function undefinedEncoder() {
  throw new Error("`undefined` is not supported by the IPLD Data Model and cannot be encoded");
}
function numberEncoder(num) {
  if (Number.isNaN(num)) {
    throw new Error("`NaN` is not supported by the IPLD Data Model and cannot be encoded");
  }
  if (num === Infinity || num === -Infinity) {
    throw new Error("`Infinity` and `-Infinity` is not supported by the IPLD Data Model and cannot be encoded");
  }
  return null;
}
var _encodeOptions = {
  float64: true,
  typeEncoders: {
    Object: cidEncoder,
    undefined: undefinedEncoder,
    number: numberEncoder
  }
};
var encodeOptions = {
  ..._encodeOptions,
  typeEncoders: {
    ..._encodeOptions.typeEncoders
  }
};
function cidDecoder(bytes) {
  if (bytes[0] !== 0) {
    throw new Error("Invalid CID for CBOR tag 42; expected leading 0x00");
  }
  return CID7.decode(bytes.subarray(1));
}
var _decodeOptions = {
  allowIndefinite: false,
  coerceUndefinedToNull: true,
  allowNaN: false,
  allowInfinity: false,
  allowBigInt: true,
  // this will lead to BigInt for ints outside of
  // safe-integer range, which may surprise users
  strict: true,
  useMaps: false,
  rejectDuplicateMapKeys: true,
  /** @type {import('cborg').TagDecoder[]} */
  tags: []
};
_decodeOptions.tags[CID_CBOR_TAG] = cidDecoder;
var decodeOptions = {
  ..._decodeOptions,
  tags: _decodeOptions.tags.slice()
};
var code6 = 113;
var decode35 = (data) => decode30(toByteView2(data), _decodeOptions);

// node_modules/@ipld/dag-json/node_modules/cborg/lib/is.js
var typeofs2 = [
  "string",
  "number",
  "bigint",
  "symbol"
];
var objectTypeNames2 = [
  "Function",
  "Generator",
  "AsyncGenerator",
  "GeneratorFunction",
  "AsyncGeneratorFunction",
  "AsyncFunction",
  "Observable",
  "Array",
  "Buffer",
  "Object",
  "RegExp",
  "Date",
  "Error",
  "Map",
  "Set",
  "WeakMap",
  "WeakSet",
  "ArrayBuffer",
  "SharedArrayBuffer",
  "DataView",
  "Promise",
  "URL",
  "HTMLElement",
  "Int8Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Int16Array",
  "Uint16Array",
  "Int32Array",
  "Uint32Array",
  "Float32Array",
  "Float64Array",
  "BigInt64Array",
  "BigUint64Array"
];
function is2(value) {
  if (value === null) {
    return "null";
  }
  if (value === void 0) {
    return "undefined";
  }
  if (value === true || value === false) {
    return "boolean";
  }
  const typeOf = typeof value;
  if (typeofs2.includes(typeOf)) {
    return typeOf;
  }
  if (typeOf === "function") {
    return "Function";
  }
  if (Array.isArray(value)) {
    return "Array";
  }
  if (isBuffer3(value)) {
    return "Buffer";
  }
  const objectType = getObjectType2(value);
  if (objectType) {
    return objectType;
  }
  return "Object";
}
function isBuffer3(value) {
  return value && value.constructor && value.constructor.isBuffer && value.constructor.isBuffer.call(null, value);
}
function getObjectType2(value) {
  const objectTypeName = Object.prototype.toString.call(value).slice(8, -1);
  if (objectTypeNames2.includes(objectTypeName)) {
    return objectTypeName;
  }
  return void 0;
}

// node_modules/@ipld/dag-json/node_modules/cborg/lib/token.js
var Type2 = class {
  /**
   * @param {number} major
   * @param {string} name
   * @param {boolean} terminal
   */
  constructor(major, name8, terminal) {
    this.major = major;
    this.majorEncoded = major << 5;
    this.name = name8;
    this.terminal = terminal;
  }
  /* c8 ignore next 3 */
  toString() {
    return `Type[${this.major}].${this.name}`;
  }
  /**
   * @param {Type} typ
   * @returns {number}
   */
  compare(typ) {
    return this.major < typ.major ? -1 : this.major > typ.major ? 1 : 0;
  }
};
Type2.uint = new Type2(0, "uint", true);
Type2.negint = new Type2(1, "negint", true);
Type2.bytes = new Type2(2, "bytes", true);
Type2.string = new Type2(3, "string", true);
Type2.array = new Type2(4, "array", false);
Type2.map = new Type2(5, "map", false);
Type2.tag = new Type2(6, "tag", false);
Type2.float = new Type2(7, "float", true);
Type2.false = new Type2(7, "false", true);
Type2.true = new Type2(7, "true", true);
Type2.null = new Type2(7, "null", true);
Type2.undefined = new Type2(7, "undefined", true);
Type2.break = new Type2(7, "break", true);
var Token2 = class {
  /**
   * @param {Type} type
   * @param {any} [value]
   * @param {number} [encodedLength]
   */
  constructor(type, value, encodedLength) {
    this.type = type;
    this.value = value;
    this.encodedLength = encodedLength;
    this.encodedBytes = void 0;
    this.byteValue = void 0;
  }
  /* c8 ignore next 3 */
  toString() {
    return `Token[${this.type}].${this.value}`;
  }
};

// node_modules/@ipld/dag-json/node_modules/cborg/lib/byte-utils.js
var useBuffer2 = globalThis.process && // @ts-ignore
!globalThis.process.browser && // @ts-ignore
globalThis.Buffer && // @ts-ignore
typeof globalThis.Buffer.isBuffer === "function";
var textDecoder6 = new TextDecoder();
var textEncoder7 = new TextEncoder();
function isBuffer4(buf3) {
  return useBuffer2 && globalThis.Buffer.isBuffer(buf3);
}
function asU8A2(buf3) {
  if (!(buf3 instanceof Uint8Array)) {
    return Uint8Array.from(buf3);
  }
  return isBuffer4(buf3) ? new Uint8Array(buf3.buffer, buf3.byteOffset, buf3.byteLength) : buf3;
}
var toString6 = useBuffer2 ? (
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array} bytes
   * @param {number} start
   * @param {number} end
   */
  (bytes, start, end) => {
    return end - start > 64 ? (
      // eslint-disable-line operator-linebreak
      // @ts-ignore
      globalThis.Buffer.from(bytes.subarray(start, end)).toString("utf8")
    ) : utf8Slice2(bytes, start, end);
  }
) : (
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array} bytes
   * @param {number} start
   * @param {number} end
   */
  (bytes, start, end) => {
    return end - start > 64 ? textDecoder6.decode(bytes.subarray(start, end)) : utf8Slice2(bytes, start, end);
  }
);
var fromString9 = useBuffer2 ? (
  // eslint-disable-line operator-linebreak
  /**
   * @param {string} string
   */
  (string5) => {
    return string5.length > 64 ? (
      // eslint-disable-line operator-linebreak
      // @ts-ignore
      globalThis.Buffer.from(string5)
    ) : utf8ToBytes2(string5);
  }
) : (
  // eslint-disable-line operator-linebreak
  /**
   * @param {string} string
   */
  (string5) => {
    return string5.length > 64 ? textEncoder7.encode(string5) : utf8ToBytes2(string5);
  }
);
var slice2 = useBuffer2 ? (
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array} bytes
   * @param {number} start
   * @param {number} end
   */
  (bytes, start, end) => {
    if (isBuffer4(bytes)) {
      return new Uint8Array(bytes.subarray(start, end));
    }
    return bytes.slice(start, end);
  }
) : (
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array} bytes
   * @param {number} start
   * @param {number} end
   */
  (bytes, start, end) => {
    return bytes.slice(start, end);
  }
);
var concat4 = useBuffer2 ? (
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array[]} chunks
   * @param {number} length
   * @returns {Uint8Array}
   */
  (chunks, length11) => {
    chunks = chunks.map((c) => c instanceof Uint8Array ? c : (
      // eslint-disable-line operator-linebreak
      // @ts-ignore
      globalThis.Buffer.from(c)
    ));
    return asU8A2(globalThis.Buffer.concat(chunks, length11));
  }
) : (
  // eslint-disable-line operator-linebreak
  /**
   * @param {Uint8Array[]} chunks
   * @param {number} length
   * @returns {Uint8Array}
   */
  (chunks, length11) => {
    const out = new Uint8Array(length11);
    let off = 0;
    for (let b of chunks) {
      if (off + b.length > out.length) {
        b = b.subarray(0, out.length - off);
      }
      out.set(b, off);
      off += b.length;
    }
    return out;
  }
);
var alloc4 = useBuffer2 ? (
  // eslint-disable-line operator-linebreak
  /**
   * @param {number} size
   * @returns {Uint8Array}
   */
  (size) => {
    return globalThis.Buffer.allocUnsafe(size);
  }
) : (
  // eslint-disable-line operator-linebreak
  /**
   * @param {number} size
   * @returns {Uint8Array}
   */
  (size) => {
    return new Uint8Array(size);
  }
);
function compare2(b1, b2) {
  if (isBuffer4(b1) && isBuffer4(b2)) {
    return b1.compare(b2);
  }
  for (let i = 0; i < b1.length; i++) {
    if (b1[i] === b2[i]) {
      continue;
    }
    return b1[i] < b2[i] ? -1 : 1;
  }
  return 0;
}
function utf8ToBytes2(str) {
  const out = [];
  let p = 0;
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i);
    if (c < 128) {
      out[p++] = c;
    } else if (c < 2048) {
      out[p++] = c >> 6 | 192;
      out[p++] = c & 63 | 128;
    } else if ((c & 64512) === 55296 && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) === 56320) {
      c = 65536 + ((c & 1023) << 10) + (str.charCodeAt(++i) & 1023);
      out[p++] = c >> 18 | 240;
      out[p++] = c >> 12 & 63 | 128;
      out[p++] = c >> 6 & 63 | 128;
      out[p++] = c & 63 | 128;
    } else {
      out[p++] = c >> 12 | 224;
      out[p++] = c >> 6 & 63 | 128;
      out[p++] = c & 63 | 128;
    }
  }
  return out;
}
function utf8Slice2(buf3, offset, end) {
  const res = [];
  while (offset < end) {
    const firstByte = buf3[offset];
    let codePoint = null;
    let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
    if (offset + bytesPerSequence <= end) {
      let secondByte, thirdByte, fourthByte, tempCodePoint;
      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 128) {
            codePoint = firstByte;
          }
          break;
        case 2:
          secondByte = buf3[offset + 1];
          if ((secondByte & 192) === 128) {
            tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
            if (tempCodePoint > 127) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 3:
          secondByte = buf3[offset + 1];
          thirdByte = buf3[offset + 2];
          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
            tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
            if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 4:
          secondByte = buf3[offset + 1];
          thirdByte = buf3[offset + 2];
          fourthByte = buf3[offset + 3];
          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
            tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
            if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
              codePoint = tempCodePoint;
            }
          }
      }
    }
    if (codePoint === null) {
      codePoint = 65533;
      bytesPerSequence = 1;
    } else if (codePoint > 65535) {
      codePoint -= 65536;
      res.push(codePoint >>> 10 & 1023 | 55296);
      codePoint = 56320 | codePoint & 1023;
    }
    res.push(codePoint);
    offset += bytesPerSequence;
  }
  return decodeCodePointsArray2(res);
}
var MAX_ARGUMENTS_LENGTH2 = 4096;
function decodeCodePointsArray2(codePoints) {
  const len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH2) {
    return String.fromCharCode.apply(String, codePoints);
  }
  let res = "";
  let i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH2)
    );
  }
  return res;
}

// node_modules/@ipld/dag-json/node_modules/cborg/lib/bl.js
var defaultChunkSize2 = 256;
var Bl2 = class {
  /**
   * @param {number} [chunkSize]
   */
  constructor(chunkSize = defaultChunkSize2) {
    this.chunkSize = chunkSize;
    this.cursor = 0;
    this.maxCursor = -1;
    this.chunks = [];
    this._initReuseChunk = null;
  }
  reset() {
    this.cursor = 0;
    this.maxCursor = -1;
    if (this.chunks.length) {
      this.chunks = [];
    }
    if (this._initReuseChunk !== null) {
      this.chunks.push(this._initReuseChunk);
      this.maxCursor = this._initReuseChunk.length - 1;
    }
  }
  /**
   * @param {Uint8Array|number[]} bytes
   */
  push(bytes) {
    let topChunk = this.chunks[this.chunks.length - 1];
    const newMax = this.cursor + bytes.length;
    if (newMax <= this.maxCursor + 1) {
      const chunkPos = topChunk.length - (this.maxCursor - this.cursor) - 1;
      topChunk.set(bytes, chunkPos);
    } else {
      if (topChunk) {
        const chunkPos = topChunk.length - (this.maxCursor - this.cursor) - 1;
        if (chunkPos < topChunk.length) {
          this.chunks[this.chunks.length - 1] = topChunk.subarray(0, chunkPos);
          this.maxCursor = this.cursor - 1;
        }
      }
      if (bytes.length < 64 && bytes.length < this.chunkSize) {
        topChunk = alloc4(this.chunkSize);
        this.chunks.push(topChunk);
        this.maxCursor += topChunk.length;
        if (this._initReuseChunk === null) {
          this._initReuseChunk = topChunk;
        }
        topChunk.set(bytes, 0);
      } else {
        this.chunks.push(bytes);
        this.maxCursor += bytes.length;
      }
    }
    this.cursor += bytes.length;
  }
  /**
   * @param {boolean} [reset]
   * @returns {Uint8Array}
   */
  toBytes(reset = false) {
    let byts;
    if (this.chunks.length === 1) {
      const chunk = this.chunks[0];
      if (reset && this.cursor > chunk.length / 2) {
        byts = this.cursor === chunk.length ? chunk : chunk.subarray(0, this.cursor);
        this._initReuseChunk = null;
        this.chunks = [];
      } else {
        byts = slice2(chunk, 0, this.cursor);
      }
    } else {
      byts = concat4(this.chunks, this.cursor);
    }
    if (reset) {
      this.reset();
    }
    return byts;
  }
};

// node_modules/@ipld/dag-json/node_modules/cborg/lib/common.js
var decodeErrPrefix2 = "CBOR decode error:";
var encodeErrPrefix2 = "CBOR encode error:";
var uintMinorPrefixBytes2 = [];
uintMinorPrefixBytes2[23] = 1;
uintMinorPrefixBytes2[24] = 2;
uintMinorPrefixBytes2[25] = 3;
uintMinorPrefixBytes2[26] = 5;
uintMinorPrefixBytes2[27] = 9;
function assertEnoughData2(data, pos, need) {
  if (data.length - pos < need) {
    throw new Error(`${decodeErrPrefix2} not enough data for type`);
  }
}

// node_modules/@ipld/dag-json/node_modules/cborg/lib/0uint.js
var uintBoundaries2 = [24, 256, 65536, 4294967296, BigInt("18446744073709551616")];
function readUint82(data, offset, options) {
  assertEnoughData2(data, offset, 1);
  const value = data[offset];
  if (options.strict === true && value < uintBoundaries2[0]) {
    throw new Error(`${decodeErrPrefix2} integer encoded in more bytes than necessary (strict decode)`);
  }
  return value;
}
function readUint162(data, offset, options) {
  assertEnoughData2(data, offset, 2);
  const value = data[offset] << 8 | data[offset + 1];
  if (options.strict === true && value < uintBoundaries2[1]) {
    throw new Error(`${decodeErrPrefix2} integer encoded in more bytes than necessary (strict decode)`);
  }
  return value;
}
function readUint322(data, offset, options) {
  assertEnoughData2(data, offset, 4);
  const value = data[offset] * 16777216 + (data[offset + 1] << 16) + (data[offset + 2] << 8) + data[offset + 3];
  if (options.strict === true && value < uintBoundaries2[2]) {
    throw new Error(`${decodeErrPrefix2} integer encoded in more bytes than necessary (strict decode)`);
  }
  return value;
}
function readUint642(data, offset, options) {
  assertEnoughData2(data, offset, 8);
  const hi = data[offset] * 16777216 + (data[offset + 1] << 16) + (data[offset + 2] << 8) + data[offset + 3];
  const lo = data[offset + 4] * 16777216 + (data[offset + 5] << 16) + (data[offset + 6] << 8) + data[offset + 7];
  const value = (BigInt(hi) << BigInt(32)) + BigInt(lo);
  if (options.strict === true && value < uintBoundaries2[3]) {
    throw new Error(`${decodeErrPrefix2} integer encoded in more bytes than necessary (strict decode)`);
  }
  if (value <= Number.MAX_SAFE_INTEGER) {
    return Number(value);
  }
  if (options.allowBigInt === true) {
    return value;
  }
  throw new Error(`${decodeErrPrefix2} integers outside of the safe integer range are not supported`);
}
function decodeUint82(data, pos, _minor, options) {
  return new Token2(Type2.uint, readUint82(data, pos + 1, options), 2);
}
function decodeUint162(data, pos, _minor, options) {
  return new Token2(Type2.uint, readUint162(data, pos + 1, options), 3);
}
function decodeUint322(data, pos, _minor, options) {
  return new Token2(Type2.uint, readUint322(data, pos + 1, options), 5);
}
function decodeUint642(data, pos, _minor, options) {
  return new Token2(Type2.uint, readUint642(data, pos + 1, options), 9);
}
function encodeUint2(buf3, token) {
  return encodeUintValue2(buf3, 0, token.value);
}
function encodeUintValue2(buf3, major, uint) {
  if (uint < uintBoundaries2[0]) {
    const nuint = Number(uint);
    buf3.push([major | nuint]);
  } else if (uint < uintBoundaries2[1]) {
    const nuint = Number(uint);
    buf3.push([major | 24, nuint]);
  } else if (uint < uintBoundaries2[2]) {
    const nuint = Number(uint);
    buf3.push([major | 25, nuint >>> 8, nuint & 255]);
  } else if (uint < uintBoundaries2[3]) {
    const nuint = Number(uint);
    buf3.push([major | 26, nuint >>> 24 & 255, nuint >>> 16 & 255, nuint >>> 8 & 255, nuint & 255]);
  } else {
    const buint = BigInt(uint);
    if (buint < uintBoundaries2[4]) {
      const set = [major | 27, 0, 0, 0, 0, 0, 0, 0];
      let lo = Number(buint & BigInt(4294967295));
      let hi = Number(buint >> BigInt(32) & BigInt(4294967295));
      set[8] = lo & 255;
      lo = lo >> 8;
      set[7] = lo & 255;
      lo = lo >> 8;
      set[6] = lo & 255;
      lo = lo >> 8;
      set[5] = lo & 255;
      set[4] = hi & 255;
      hi = hi >> 8;
      set[3] = hi & 255;
      hi = hi >> 8;
      set[2] = hi & 255;
      hi = hi >> 8;
      set[1] = hi & 255;
      buf3.push(set);
    } else {
      throw new Error(`${decodeErrPrefix2} encountered BigInt larger than allowable range`);
    }
  }
}
encodeUint2.encodedSize = function encodedSize9(token) {
  return encodeUintValue2.encodedSize(token.value);
};
encodeUintValue2.encodedSize = function encodedSize10(uint) {
  if (uint < uintBoundaries2[0]) {
    return 1;
  }
  if (uint < uintBoundaries2[1]) {
    return 2;
  }
  if (uint < uintBoundaries2[2]) {
    return 3;
  }
  if (uint < uintBoundaries2[3]) {
    return 5;
  }
  return 9;
};
encodeUint2.compareTokens = function compareTokens4(tok1, tok2) {
  return tok1.value < tok2.value ? -1 : tok1.value > tok2.value ? 1 : (
    /* c8 ignore next */
    0
  );
};

// node_modules/@ipld/dag-json/node_modules/cborg/lib/1negint.js
function decodeNegint82(data, pos, _minor, options) {
  return new Token2(Type2.negint, -1 - readUint82(data, pos + 1, options), 2);
}
function decodeNegint162(data, pos, _minor, options) {
  return new Token2(Type2.negint, -1 - readUint162(data, pos + 1, options), 3);
}
function decodeNegint322(data, pos, _minor, options) {
  return new Token2(Type2.negint, -1 - readUint322(data, pos + 1, options), 5);
}
var neg1b2 = BigInt(-1);
var pos1b2 = BigInt(1);
function decodeNegint642(data, pos, _minor, options) {
  const int = readUint642(data, pos + 1, options);
  if (typeof int !== "bigint") {
    const value = -1 - int;
    if (value >= Number.MIN_SAFE_INTEGER) {
      return new Token2(Type2.negint, value, 9);
    }
  }
  if (options.allowBigInt !== true) {
    throw new Error(`${decodeErrPrefix2} integers outside of the safe integer range are not supported`);
  }
  return new Token2(Type2.negint, neg1b2 - BigInt(int), 9);
}
function encodeNegint2(buf3, token) {
  const negint = token.value;
  const unsigned = typeof negint === "bigint" ? negint * neg1b2 - pos1b2 : negint * -1 - 1;
  encodeUintValue2(buf3, token.type.majorEncoded, unsigned);
}
encodeNegint2.encodedSize = function encodedSize11(token) {
  const negint = token.value;
  const unsigned = typeof negint === "bigint" ? negint * neg1b2 - pos1b2 : negint * -1 - 1;
  if (unsigned < uintBoundaries2[0]) {
    return 1;
  }
  if (unsigned < uintBoundaries2[1]) {
    return 2;
  }
  if (unsigned < uintBoundaries2[2]) {
    return 3;
  }
  if (unsigned < uintBoundaries2[3]) {
    return 5;
  }
  return 9;
};
encodeNegint2.compareTokens = function compareTokens5(tok1, tok2) {
  return tok1.value < tok2.value ? 1 : tok1.value > tok2.value ? -1 : (
    /* c8 ignore next */
    0
  );
};

// node_modules/@ipld/dag-json/node_modules/cborg/lib/2bytes.js
function toToken5(data, pos, prefix, length11) {
  assertEnoughData2(data, pos, prefix + length11);
  const buf3 = slice2(data, pos + prefix, pos + prefix + length11);
  return new Token2(Type2.bytes, buf3, prefix + length11);
}
function decodeBytesCompact2(data, pos, minor, _options) {
  return toToken5(data, pos, 1, minor);
}
function decodeBytes82(data, pos, _minor, options) {
  return toToken5(data, pos, 2, readUint82(data, pos + 1, options));
}
function decodeBytes162(data, pos, _minor, options) {
  return toToken5(data, pos, 3, readUint162(data, pos + 1, options));
}
function decodeBytes322(data, pos, _minor, options) {
  return toToken5(data, pos, 5, readUint322(data, pos + 1, options));
}
function decodeBytes642(data, pos, _minor, options) {
  const l = readUint642(data, pos + 1, options);
  if (typeof l === "bigint") {
    throw new Error(`${decodeErrPrefix2} 64-bit integer bytes lengths not supported`);
  }
  return toToken5(data, pos, 9, l);
}
function tokenBytes2(token) {
  if (token.encodedBytes === void 0) {
    token.encodedBytes = token.type === Type2.string ? fromString9(token.value) : token.value;
  }
  return token.encodedBytes;
}
function encodeBytes2(buf3, token) {
  const bytes = tokenBytes2(token);
  encodeUintValue2(buf3, token.type.majorEncoded, bytes.length);
  buf3.push(bytes);
}
encodeBytes2.encodedSize = function encodedSize12(token) {
  const bytes = tokenBytes2(token);
  return encodeUintValue2.encodedSize(bytes.length) + bytes.length;
};
encodeBytes2.compareTokens = function compareTokens6(tok1, tok2) {
  return compareBytes2(tokenBytes2(tok1), tokenBytes2(tok2));
};
function compareBytes2(b1, b2) {
  return b1.length < b2.length ? -1 : b1.length > b2.length ? 1 : compare2(b1, b2);
}

// node_modules/@ipld/dag-json/node_modules/cborg/lib/3string.js
function toToken6(data, pos, prefix, length11, options) {
  const totLength = prefix + length11;
  assertEnoughData2(data, pos, totLength);
  const tok = new Token2(Type2.string, toString6(data, pos + prefix, pos + totLength), totLength);
  if (options.retainStringBytes === true) {
    tok.byteValue = slice2(data, pos + prefix, pos + totLength);
  }
  return tok;
}
function decodeStringCompact2(data, pos, minor, options) {
  return toToken6(data, pos, 1, minor, options);
}
function decodeString82(data, pos, _minor, options) {
  return toToken6(data, pos, 2, readUint82(data, pos + 1, options), options);
}
function decodeString162(data, pos, _minor, options) {
  return toToken6(data, pos, 3, readUint162(data, pos + 1, options), options);
}
function decodeString322(data, pos, _minor, options) {
  return toToken6(data, pos, 5, readUint322(data, pos + 1, options), options);
}
function decodeString642(data, pos, _minor, options) {
  const l = readUint642(data, pos + 1, options);
  if (typeof l === "bigint") {
    throw new Error(`${decodeErrPrefix2} 64-bit integer string lengths not supported`);
  }
  return toToken6(data, pos, 9, l, options);
}
var encodeString2 = encodeBytes2;

// node_modules/@ipld/dag-json/node_modules/cborg/lib/4array.js
function toToken7(_data, _pos, prefix, length11) {
  return new Token2(Type2.array, length11, prefix);
}
function decodeArrayCompact2(data, pos, minor, _options) {
  return toToken7(data, pos, 1, minor);
}
function decodeArray82(data, pos, _minor, options) {
  return toToken7(data, pos, 2, readUint82(data, pos + 1, options));
}
function decodeArray162(data, pos, _minor, options) {
  return toToken7(data, pos, 3, readUint162(data, pos + 1, options));
}
function decodeArray322(data, pos, _minor, options) {
  return toToken7(data, pos, 5, readUint322(data, pos + 1, options));
}
function decodeArray642(data, pos, _minor, options) {
  const l = readUint642(data, pos + 1, options);
  if (typeof l === "bigint") {
    throw new Error(`${decodeErrPrefix2} 64-bit integer array lengths not supported`);
  }
  return toToken7(data, pos, 9, l);
}
function decodeArrayIndefinite2(data, pos, _minor, options) {
  if (options.allowIndefinite === false) {
    throw new Error(`${decodeErrPrefix2} indefinite length items not allowed`);
  }
  return toToken7(data, pos, 1, Infinity);
}
function encodeArray2(buf3, token) {
  encodeUintValue2(buf3, Type2.array.majorEncoded, token.value);
}
encodeArray2.compareTokens = encodeUint2.compareTokens;
encodeArray2.encodedSize = function encodedSize13(token) {
  return encodeUintValue2.encodedSize(token.value);
};

// node_modules/@ipld/dag-json/node_modules/cborg/lib/5map.js
function toToken8(_data, _pos, prefix, length11) {
  return new Token2(Type2.map, length11, prefix);
}
function decodeMapCompact2(data, pos, minor, _options) {
  return toToken8(data, pos, 1, minor);
}
function decodeMap82(data, pos, _minor, options) {
  return toToken8(data, pos, 2, readUint82(data, pos + 1, options));
}
function decodeMap162(data, pos, _minor, options) {
  return toToken8(data, pos, 3, readUint162(data, pos + 1, options));
}
function decodeMap322(data, pos, _minor, options) {
  return toToken8(data, pos, 5, readUint322(data, pos + 1, options));
}
function decodeMap642(data, pos, _minor, options) {
  const l = readUint642(data, pos + 1, options);
  if (typeof l === "bigint") {
    throw new Error(`${decodeErrPrefix2} 64-bit integer map lengths not supported`);
  }
  return toToken8(data, pos, 9, l);
}
function decodeMapIndefinite2(data, pos, _minor, options) {
  if (options.allowIndefinite === false) {
    throw new Error(`${decodeErrPrefix2} indefinite length items not allowed`);
  }
  return toToken8(data, pos, 1, Infinity);
}
function encodeMap2(buf3, token) {
  encodeUintValue2(buf3, Type2.map.majorEncoded, token.value);
}
encodeMap2.compareTokens = encodeUint2.compareTokens;
encodeMap2.encodedSize = function encodedSize14(token) {
  return encodeUintValue2.encodedSize(token.value);
};

// node_modules/@ipld/dag-json/node_modules/cborg/lib/6tag.js
function decodeTagCompact2(_data, _pos, minor, _options) {
  return new Token2(Type2.tag, minor, 1);
}
function decodeTag82(data, pos, _minor, options) {
  return new Token2(Type2.tag, readUint82(data, pos + 1, options), 2);
}
function decodeTag162(data, pos, _minor, options) {
  return new Token2(Type2.tag, readUint162(data, pos + 1, options), 3);
}
function decodeTag322(data, pos, _minor, options) {
  return new Token2(Type2.tag, readUint322(data, pos + 1, options), 5);
}
function decodeTag642(data, pos, _minor, options) {
  return new Token2(Type2.tag, readUint642(data, pos + 1, options), 9);
}
function encodeTag2(buf3, token) {
  encodeUintValue2(buf3, Type2.tag.majorEncoded, token.value);
}
encodeTag2.compareTokens = encodeUint2.compareTokens;
encodeTag2.encodedSize = function encodedSize15(token) {
  return encodeUintValue2.encodedSize(token.value);
};

// node_modules/@ipld/dag-json/node_modules/cborg/lib/7float.js
var MINOR_FALSE2 = 20;
var MINOR_TRUE2 = 21;
var MINOR_NULL2 = 22;
var MINOR_UNDEFINED2 = 23;
function decodeUndefined2(_data, _pos, _minor, options) {
  if (options.allowUndefined === false) {
    throw new Error(`${decodeErrPrefix2} undefined values are not supported`);
  } else if (options.coerceUndefinedToNull === true) {
    return new Token2(Type2.null, null, 1);
  }
  return new Token2(Type2.undefined, void 0, 1);
}
function decodeBreak2(_data, _pos, _minor, options) {
  if (options.allowIndefinite === false) {
    throw new Error(`${decodeErrPrefix2} indefinite length items not allowed`);
  }
  return new Token2(Type2.break, void 0, 1);
}
function createToken2(value, bytes, options) {
  if (options) {
    if (options.allowNaN === false && Number.isNaN(value)) {
      throw new Error(`${decodeErrPrefix2} NaN values are not supported`);
    }
    if (options.allowInfinity === false && (value === Infinity || value === -Infinity)) {
      throw new Error(`${decodeErrPrefix2} Infinity values are not supported`);
    }
  }
  return new Token2(Type2.float, value, bytes);
}
function decodeFloat162(data, pos, _minor, options) {
  return createToken2(readFloat162(data, pos + 1), 3, options);
}
function decodeFloat322(data, pos, _minor, options) {
  return createToken2(readFloat322(data, pos + 1), 5, options);
}
function decodeFloat642(data, pos, _minor, options) {
  return createToken2(readFloat642(data, pos + 1), 9, options);
}
function encodeFloat2(buf3, token, options) {
  const float = token.value;
  if (float === false) {
    buf3.push([Type2.float.majorEncoded | MINOR_FALSE2]);
  } else if (float === true) {
    buf3.push([Type2.float.majorEncoded | MINOR_TRUE2]);
  } else if (float === null) {
    buf3.push([Type2.float.majorEncoded | MINOR_NULL2]);
  } else if (float === void 0) {
    buf3.push([Type2.float.majorEncoded | MINOR_UNDEFINED2]);
  } else {
    let decoded;
    let success = false;
    if (!options || options.float64 !== true) {
      encodeFloat162(float);
      decoded = readFloat162(ui8a2, 1);
      if (float === decoded || Number.isNaN(float)) {
        ui8a2[0] = 249;
        buf3.push(ui8a2.slice(0, 3));
        success = true;
      } else {
        encodeFloat322(float);
        decoded = readFloat322(ui8a2, 1);
        if (float === decoded) {
          ui8a2[0] = 250;
          buf3.push(ui8a2.slice(0, 5));
          success = true;
        }
      }
    }
    if (!success) {
      encodeFloat642(float);
      decoded = readFloat642(ui8a2, 1);
      ui8a2[0] = 251;
      buf3.push(ui8a2.slice(0, 9));
    }
  }
}
encodeFloat2.encodedSize = function encodedSize16(token, options) {
  const float = token.value;
  if (float === false || float === true || float === null || float === void 0) {
    return 1;
  }
  if (!options || options.float64 !== true) {
    encodeFloat162(float);
    let decoded = readFloat162(ui8a2, 1);
    if (float === decoded || Number.isNaN(float)) {
      return 3;
    }
    encodeFloat322(float);
    decoded = readFloat322(ui8a2, 1);
    if (float === decoded) {
      return 5;
    }
  }
  return 9;
};
var buffer2 = new ArrayBuffer(9);
var dataView2 = new DataView(buffer2, 1);
var ui8a2 = new Uint8Array(buffer2, 0);
function encodeFloat162(inp) {
  if (inp === Infinity) {
    dataView2.setUint16(0, 31744, false);
  } else if (inp === -Infinity) {
    dataView2.setUint16(0, 64512, false);
  } else if (Number.isNaN(inp)) {
    dataView2.setUint16(0, 32256, false);
  } else {
    dataView2.setFloat32(0, inp);
    const valu32 = dataView2.getUint32(0);
    const exponent = (valu32 & 2139095040) >> 23;
    const mantissa = valu32 & 8388607;
    if (exponent === 255) {
      dataView2.setUint16(0, 31744, false);
    } else if (exponent === 0) {
      dataView2.setUint16(0, (inp & 2147483648) >> 16 | mantissa >> 13, false);
    } else {
      const logicalExponent = exponent - 127;
      if (logicalExponent < -24) {
        dataView2.setUint16(0, 0);
      } else if (logicalExponent < -14) {
        dataView2.setUint16(0, (valu32 & 2147483648) >> 16 | /* sign bit */
        1 << 24 + logicalExponent, false);
      } else {
        dataView2.setUint16(0, (valu32 & 2147483648) >> 16 | logicalExponent + 15 << 10 | mantissa >> 13, false);
      }
    }
  }
}
function readFloat162(ui8a3, pos) {
  if (ui8a3.length - pos < 2) {
    throw new Error(`${decodeErrPrefix2} not enough data for float16`);
  }
  const half = (ui8a3[pos] << 8) + ui8a3[pos + 1];
  if (half === 31744) {
    return Infinity;
  }
  if (half === 64512) {
    return -Infinity;
  }
  if (half === 32256) {
    return NaN;
  }
  const exp = half >> 10 & 31;
  const mant = half & 1023;
  let val;
  if (exp === 0) {
    val = mant * 2 ** -24;
  } else if (exp !== 31) {
    val = (mant + 1024) * 2 ** (exp - 25);
  } else {
    val = mant === 0 ? Infinity : NaN;
  }
  return half & 32768 ? -val : val;
}
function encodeFloat322(inp) {
  dataView2.setFloat32(0, inp, false);
}
function readFloat322(ui8a3, pos) {
  if (ui8a3.length - pos < 4) {
    throw new Error(`${decodeErrPrefix2} not enough data for float32`);
  }
  const offset = (ui8a3.byteOffset || 0) + pos;
  return new DataView(ui8a3.buffer, offset, 4).getFloat32(0, false);
}
function encodeFloat642(inp) {
  dataView2.setFloat64(0, inp, false);
}
function readFloat642(ui8a3, pos) {
  if (ui8a3.length - pos < 8) {
    throw new Error(`${decodeErrPrefix2} not enough data for float64`);
  }
  const offset = (ui8a3.byteOffset || 0) + pos;
  return new DataView(ui8a3.buffer, offset, 8).getFloat64(0, false);
}
encodeFloat2.compareTokens = encodeUint2.compareTokens;

// node_modules/@ipld/dag-json/node_modules/cborg/lib/jump.js
function invalidMinor2(data, pos, minor) {
  throw new Error(`${decodeErrPrefix2} encountered invalid minor (${minor}) for major ${data[pos] >>> 5}`);
}
function errorer2(msg) {
  return () => {
    throw new Error(`${decodeErrPrefix2} ${msg}`);
  };
}
var jump2 = [];
for (let i = 0; i <= 23; i++) {
  jump2[i] = invalidMinor2;
}
jump2[24] = decodeUint82;
jump2[25] = decodeUint162;
jump2[26] = decodeUint322;
jump2[27] = decodeUint642;
jump2[28] = invalidMinor2;
jump2[29] = invalidMinor2;
jump2[30] = invalidMinor2;
jump2[31] = invalidMinor2;
for (let i = 32; i <= 55; i++) {
  jump2[i] = invalidMinor2;
}
jump2[56] = decodeNegint82;
jump2[57] = decodeNegint162;
jump2[58] = decodeNegint322;
jump2[59] = decodeNegint642;
jump2[60] = invalidMinor2;
jump2[61] = invalidMinor2;
jump2[62] = invalidMinor2;
jump2[63] = invalidMinor2;
for (let i = 64; i <= 87; i++) {
  jump2[i] = decodeBytesCompact2;
}
jump2[88] = decodeBytes82;
jump2[89] = decodeBytes162;
jump2[90] = decodeBytes322;
jump2[91] = decodeBytes642;
jump2[92] = invalidMinor2;
jump2[93] = invalidMinor2;
jump2[94] = invalidMinor2;
jump2[95] = errorer2("indefinite length bytes/strings are not supported");
for (let i = 96; i <= 119; i++) {
  jump2[i] = decodeStringCompact2;
}
jump2[120] = decodeString82;
jump2[121] = decodeString162;
jump2[122] = decodeString322;
jump2[123] = decodeString642;
jump2[124] = invalidMinor2;
jump2[125] = invalidMinor2;
jump2[126] = invalidMinor2;
jump2[127] = errorer2("indefinite length bytes/strings are not supported");
for (let i = 128; i <= 151; i++) {
  jump2[i] = decodeArrayCompact2;
}
jump2[152] = decodeArray82;
jump2[153] = decodeArray162;
jump2[154] = decodeArray322;
jump2[155] = decodeArray642;
jump2[156] = invalidMinor2;
jump2[157] = invalidMinor2;
jump2[158] = invalidMinor2;
jump2[159] = decodeArrayIndefinite2;
for (let i = 160; i <= 183; i++) {
  jump2[i] = decodeMapCompact2;
}
jump2[184] = decodeMap82;
jump2[185] = decodeMap162;
jump2[186] = decodeMap322;
jump2[187] = decodeMap642;
jump2[188] = invalidMinor2;
jump2[189] = invalidMinor2;
jump2[190] = invalidMinor2;
jump2[191] = decodeMapIndefinite2;
for (let i = 192; i <= 215; i++) {
  jump2[i] = decodeTagCompact2;
}
jump2[216] = decodeTag82;
jump2[217] = decodeTag162;
jump2[218] = decodeTag322;
jump2[219] = decodeTag642;
jump2[220] = invalidMinor2;
jump2[221] = invalidMinor2;
jump2[222] = invalidMinor2;
jump2[223] = invalidMinor2;
for (let i = 224; i <= 243; i++) {
  jump2[i] = errorer2("simple values are not supported");
}
jump2[244] = invalidMinor2;
jump2[245] = invalidMinor2;
jump2[246] = invalidMinor2;
jump2[247] = decodeUndefined2;
jump2[248] = errorer2("simple values are not supported");
jump2[249] = decodeFloat162;
jump2[250] = decodeFloat322;
jump2[251] = decodeFloat642;
jump2[252] = invalidMinor2;
jump2[253] = invalidMinor2;
jump2[254] = invalidMinor2;
jump2[255] = decodeBreak2;
var quick2 = [];
for (let i = 0; i < 24; i++) {
  quick2[i] = new Token2(Type2.uint, i, 1);
}
for (let i = -1; i >= -24; i--) {
  quick2[31 - i] = new Token2(Type2.negint, i, 1);
}
quick2[64] = new Token2(Type2.bytes, new Uint8Array(0), 1);
quick2[96] = new Token2(Type2.string, "", 1);
quick2[128] = new Token2(Type2.array, 0, 1);
quick2[160] = new Token2(Type2.map, 0, 1);
quick2[244] = new Token2(Type2.false, false, 1);
quick2[245] = new Token2(Type2.true, true, 1);
quick2[246] = new Token2(Type2.null, null, 1);

// node_modules/@ipld/dag-json/node_modules/cborg/lib/encode.js
function makeCborEncoders2() {
  const encoders = [];
  encoders[Type2.uint.major] = encodeUint2;
  encoders[Type2.negint.major] = encodeNegint2;
  encoders[Type2.bytes.major] = encodeBytes2;
  encoders[Type2.string.major] = encodeString2;
  encoders[Type2.array.major] = encodeArray2;
  encoders[Type2.map.major] = encodeMap2;
  encoders[Type2.tag.major] = encodeTag2;
  encoders[Type2.float.major] = encodeFloat2;
  return encoders;
}
var cborEncoders2 = makeCborEncoders2();
var buf2 = new Bl2();
var Ref2 = class _Ref {
  /**
   * @param {object|any[]} obj
   * @param {Reference|undefined} parent
   */
  constructor(obj, parent) {
    this.obj = obj;
    this.parent = parent;
  }
  /**
   * @param {object|any[]} obj
   * @returns {boolean}
   */
  includes(obj) {
    let p = this;
    do {
      if (p.obj === obj) {
        return true;
      }
    } while (p = p.parent);
    return false;
  }
  /**
   * @param {Reference|undefined} stack
   * @param {object|any[]} obj
   * @returns {Reference}
   */
  static createCheck(stack, obj) {
    if (stack && stack.includes(obj)) {
      throw new Error(`${encodeErrPrefix2} object contains circular references`);
    }
    return new _Ref(obj, stack);
  }
};
var simpleTokens2 = {
  null: new Token2(Type2.null, null),
  undefined: new Token2(Type2.undefined, void 0),
  true: new Token2(Type2.true, true),
  false: new Token2(Type2.false, false),
  emptyArray: new Token2(Type2.array, 0),
  emptyMap: new Token2(Type2.map, 0)
};
var typeEncoders2 = {
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  number(obj, _typ, _options, _refStack) {
    if (!Number.isInteger(obj) || !Number.isSafeInteger(obj)) {
      return new Token2(Type2.float, obj);
    } else if (obj >= 0) {
      return new Token2(Type2.uint, obj);
    } else {
      return new Token2(Type2.negint, obj);
    }
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  bigint(obj, _typ, _options, _refStack) {
    if (obj >= BigInt(0)) {
      return new Token2(Type2.uint, obj);
    } else {
      return new Token2(Type2.negint, obj);
    }
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  Uint8Array(obj, _typ, _options, _refStack) {
    return new Token2(Type2.bytes, obj);
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  string(obj, _typ, _options, _refStack) {
    return new Token2(Type2.string, obj);
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  boolean(obj, _typ, _options, _refStack) {
    return obj ? simpleTokens2.true : simpleTokens2.false;
  },
  /**
   * @param {any} _obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  null(_obj, _typ, _options, _refStack) {
    return simpleTokens2.null;
  },
  /**
   * @param {any} _obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  undefined(_obj, _typ, _options, _refStack) {
    return simpleTokens2.undefined;
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  ArrayBuffer(obj, _typ, _options, _refStack) {
    return new Token2(Type2.bytes, new Uint8Array(obj));
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} _options
   * @param {Reference} [_refStack]
   * @returns {TokenOrNestedTokens}
   */
  DataView(obj, _typ, _options, _refStack) {
    return new Token2(Type2.bytes, new Uint8Array(obj.buffer, obj.byteOffset, obj.byteLength));
  },
  /**
   * @param {any} obj
   * @param {string} _typ
   * @param {EncodeOptions} options
   * @param {Reference} [refStack]
   * @returns {TokenOrNestedTokens}
   */
  Array(obj, _typ, options, refStack) {
    if (!obj.length) {
      if (options.addBreakTokens === true) {
        return [simpleTokens2.emptyArray, new Token2(Type2.break)];
      }
      return simpleTokens2.emptyArray;
    }
    refStack = Ref2.createCheck(refStack, obj);
    const entries = [];
    let i = 0;
    for (const e of obj) {
      entries[i++] = objectToTokens2(e, options, refStack);
    }
    if (options.addBreakTokens) {
      return [new Token2(Type2.array, obj.length), entries, new Token2(Type2.break)];
    }
    return [new Token2(Type2.array, obj.length), entries];
  },
  /**
   * @param {any} obj
   * @param {string} typ
   * @param {EncodeOptions} options
   * @param {Reference} [refStack]
   * @returns {TokenOrNestedTokens}
   */
  Object(obj, typ, options, refStack) {
    const isMap = typ !== "Object";
    const keys = isMap ? obj.keys() : Object.keys(obj);
    const length11 = isMap ? obj.size : keys.length;
    if (!length11) {
      if (options.addBreakTokens === true) {
        return [simpleTokens2.emptyMap, new Token2(Type2.break)];
      }
      return simpleTokens2.emptyMap;
    }
    refStack = Ref2.createCheck(refStack, obj);
    const entries = [];
    let i = 0;
    for (const key of keys) {
      entries[i++] = [
        objectToTokens2(key, options, refStack),
        objectToTokens2(isMap ? obj.get(key) : obj[key], options, refStack)
      ];
    }
    sortMapEntries2(entries, options);
    if (options.addBreakTokens) {
      return [new Token2(Type2.map, length11), entries, new Token2(Type2.break)];
    }
    return [new Token2(Type2.map, length11), entries];
  }
};
typeEncoders2.Map = typeEncoders2.Object;
typeEncoders2.Buffer = typeEncoders2.Uint8Array;
for (const typ of "Uint8Clamped Uint16 Uint32 Int8 Int16 Int32 BigUint64 BigInt64 Float32 Float64".split(" ")) {
  typeEncoders2[`${typ}Array`] = typeEncoders2.DataView;
}
function objectToTokens2(obj, options = {}, refStack) {
  const typ = is2(obj);
  const customTypeEncoder = options && options.typeEncoders && /** @type {OptionalTypeEncoder} */
  options.typeEncoders[typ] || typeEncoders2[typ];
  if (typeof customTypeEncoder === "function") {
    const tokens = customTypeEncoder(obj, typ, options, refStack);
    if (tokens != null) {
      return tokens;
    }
  }
  const typeEncoder = typeEncoders2[typ];
  if (!typeEncoder) {
    throw new Error(`${encodeErrPrefix2} unsupported type: ${typ}`);
  }
  return typeEncoder(obj, typ, options, refStack);
}
function sortMapEntries2(entries, options) {
  if (options.mapSorter) {
    entries.sort(options.mapSorter);
  }
}

// node_modules/@ipld/dag-json/node_modules/cborg/lib/decode.js
var defaultDecodeOptions2 = {
  strict: false,
  allowIndefinite: true,
  allowUndefined: true,
  allowBigInt: true
};
var Tokeniser2 = class {
  /**
   * @param {Uint8Array} data
   * @param {DecodeOptions} options
   */
  constructor(data, options = {}) {
    this._pos = 0;
    this.data = data;
    this.options = options;
  }
  pos() {
    return this._pos;
  }
  done() {
    return this._pos >= this.data.length;
  }
  next() {
    const byt = this.data[this._pos];
    let token = quick2[byt];
    if (token === void 0) {
      const decoder = jump2[byt];
      if (!decoder) {
        throw new Error(`${decodeErrPrefix2} no decoder for major type ${byt >>> 5} (byte 0x${byt.toString(16).padStart(2, "0")})`);
      }
      const minor = byt & 31;
      token = decoder(this.data, this._pos, minor, this.options);
    }
    this._pos += token.encodedLength;
    return token;
  }
};
var DONE2 = Symbol.for("DONE");
var BREAK2 = Symbol.for("BREAK");
function tokenToArray2(token, tokeniser, options) {
  const arr = [];
  for (let i = 0; i < token.value; i++) {
    const value = tokensToObject2(tokeniser, options);
    if (value === BREAK2) {
      if (token.value === Infinity) {
        break;
      }
      throw new Error(`${decodeErrPrefix2} got unexpected break to lengthed array`);
    }
    if (value === DONE2) {
      throw new Error(`${decodeErrPrefix2} found array but not enough entries (got ${i}, expected ${token.value})`);
    }
    arr[i] = value;
  }
  return arr;
}
function tokenToMap2(token, tokeniser, options) {
  const useMaps = options.useMaps === true;
  const obj = useMaps ? void 0 : {};
  const m = useMaps ? /* @__PURE__ */ new Map() : void 0;
  for (let i = 0; i < token.value; i++) {
    const key = tokensToObject2(tokeniser, options);
    if (key === BREAK2) {
      if (token.value === Infinity) {
        break;
      }
      throw new Error(`${decodeErrPrefix2} got unexpected break to lengthed map`);
    }
    if (key === DONE2) {
      throw new Error(`${decodeErrPrefix2} found map but not enough entries (got ${i} [no key], expected ${token.value})`);
    }
    if (useMaps !== true && typeof key !== "string") {
      throw new Error(`${decodeErrPrefix2} non-string keys not supported (got ${typeof key})`);
    }
    if (options.rejectDuplicateMapKeys === true) {
      if (useMaps && m.has(key) || !useMaps && key in obj) {
        throw new Error(`${decodeErrPrefix2} found repeat map key "${key}"`);
      }
    }
    const value = tokensToObject2(tokeniser, options);
    if (value === DONE2) {
      throw new Error(`${decodeErrPrefix2} found map but not enough entries (got ${i} [no value], expected ${token.value})`);
    }
    if (useMaps) {
      m.set(key, value);
    } else {
      obj[key] = value;
    }
  }
  return useMaps ? m : obj;
}
function tokensToObject2(tokeniser, options) {
  if (tokeniser.done()) {
    return DONE2;
  }
  const token = tokeniser.next();
  if (token.type === Type2.break) {
    return BREAK2;
  }
  if (token.type.terminal) {
    return token.value;
  }
  if (token.type === Type2.array) {
    return tokenToArray2(token, tokeniser, options);
  }
  if (token.type === Type2.map) {
    return tokenToMap2(token, tokeniser, options);
  }
  if (token.type === Type2.tag) {
    if (options.tags && typeof options.tags[token.value] === "function") {
      const tagged = tokensToObject2(tokeniser, options);
      return options.tags[token.value](tagged);
    }
    throw new Error(`${decodeErrPrefix2} tag not supported (${token.value})`);
  }
  throw new Error("unsupported");
}
function decodeFirst2(data, options) {
  if (!(data instanceof Uint8Array)) {
    throw new Error(`${decodeErrPrefix2} data to decode must be a Uint8Array`);
  }
  options = Object.assign({}, defaultDecodeOptions2, options);
  const tokeniser = options.tokenizer || new Tokeniser2(data, options);
  const decoded = tokensToObject2(tokeniser, options);
  if (decoded === DONE2) {
    throw new Error(`${decodeErrPrefix2} did not find any content to decode`);
  }
  if (decoded === BREAK2) {
    throw new Error(`${decodeErrPrefix2} got unexpected break`);
  }
  return [decoded, data.subarray(tokeniser.pos())];
}
function decode36(data, options) {
  const [decoded, remainder] = decodeFirst2(data, options);
  if (remainder.length > 0) {
    throw new Error(`${decodeErrPrefix2} too many terminals, data makes no sense`);
  }
  return decoded;
}

// node_modules/@ipld/dag-json/node_modules/cborg/lib/json/encode.js
var JSONEncoder = class extends Array {
  constructor() {
    super();
    this.inRecursive = [];
  }
  /**
   * @param {Bl} buf
   */
  prefix(buf3) {
    const recurs = this.inRecursive[this.inRecursive.length - 1];
    if (recurs) {
      if (recurs.type === Type2.array) {
        recurs.elements++;
        if (recurs.elements !== 1) {
          buf3.push([44]);
        }
      }
      if (recurs.type === Type2.map) {
        recurs.elements++;
        if (recurs.elements !== 1) {
          if (recurs.elements % 2 === 1) {
            buf3.push([44]);
          } else {
            buf3.push([58]);
          }
        }
      }
    }
  }
  /**
   * @param {Bl} buf
   * @param {Token} token
   */
  [Type2.uint.major](buf3, token) {
    this.prefix(buf3);
    const is3 = String(token.value);
    const isa = [];
    for (let i = 0; i < is3.length; i++) {
      isa[i] = is3.charCodeAt(i);
    }
    buf3.push(isa);
  }
  /**
   * @param {Bl} buf
   * @param {Token} token
   */
  [Type2.negint.major](buf3, token) {
    this[Type2.uint.major](buf3, token);
  }
  /**
   * @param {Bl} _buf
   * @param {Token} _token
   */
  [Type2.bytes.major](_buf, _token) {
    throw new Error(`${encodeErrPrefix2} unsupported type: Uint8Array`);
  }
  /**
   * @param {Bl} buf
   * @param {Token} token
   */
  [Type2.string.major](buf3, token) {
    this.prefix(buf3);
    const byts = fromString9(JSON.stringify(token.value));
    buf3.push(byts.length > 32 ? asU8A2(byts) : byts);
  }
  /**
   * @param {Bl} buf
   * @param {Token} _token
   */
  [Type2.array.major](buf3, _token) {
    this.prefix(buf3);
    this.inRecursive.push({ type: Type2.array, elements: 0 });
    buf3.push([91]);
  }
  /**
   * @param {Bl} buf
   * @param {Token} _token
   */
  [Type2.map.major](buf3, _token) {
    this.prefix(buf3);
    this.inRecursive.push({ type: Type2.map, elements: 0 });
    buf3.push([123]);
  }
  /**
   * @param {Bl} _buf
   * @param {Token} _token
   */
  [Type2.tag.major](_buf, _token) {
  }
  /**
   * @param {Bl} buf
   * @param {Token} token
   */
  [Type2.float.major](buf3, token) {
    if (token.type.name === "break") {
      const recurs = this.inRecursive.pop();
      if (recurs) {
        if (recurs.type === Type2.array) {
          buf3.push([93]);
        } else if (recurs.type === Type2.map) {
          buf3.push([125]);
        } else {
          throw new Error("Unexpected recursive type; this should not happen!");
        }
        return;
      }
      throw new Error("Unexpected break; this should not happen!");
    }
    if (token.value === void 0) {
      throw new Error(`${encodeErrPrefix2} unsupported type: undefined`);
    }
    this.prefix(buf3);
    if (token.type.name === "true") {
      buf3.push([116, 114, 117, 101]);
      return;
    } else if (token.type.name === "false") {
      buf3.push([102, 97, 108, 115, 101]);
      return;
    } else if (token.type.name === "null") {
      buf3.push([110, 117, 108, 108]);
      return;
    }
    const is3 = String(token.value);
    const isa = [];
    let dp = false;
    for (let i = 0; i < is3.length; i++) {
      isa[i] = is3.charCodeAt(i);
      if (!dp && (isa[i] === 46 || isa[i] === 101 || isa[i] === 69)) {
        dp = true;
      }
    }
    if (!dp) {
      isa.push(46);
      isa.push(48);
    }
    buf3.push(isa);
  }
};

// node_modules/@ipld/dag-json/node_modules/cborg/lib/json/decode.js
var Tokenizer = class {
  /**
   * @param {Uint8Array} data
   * @param {DecodeOptions} options
   */
  constructor(data, options = {}) {
    this._pos = 0;
    this.data = data;
    this.options = options;
    this.modeStack = ["value"];
    this.lastToken = "";
  }
  pos() {
    return this._pos;
  }
  /**
   * @returns {boolean}
   */
  done() {
    return this._pos >= this.data.length;
  }
  /**
   * @returns {number}
   */
  ch() {
    return this.data[this._pos];
  }
  /**
   * @returns {string}
   */
  currentMode() {
    return this.modeStack[this.modeStack.length - 1];
  }
  skipWhitespace() {
    let c = this.ch();
    while (c === 32 || c === 9 || c === 13 || c === 10) {
      c = this.data[++this._pos];
    }
  }
  /**
   * @param {number[]} str
   */
  expect(str) {
    if (this.data.length - this._pos < str.length) {
      throw new Error(`${decodeErrPrefix2} unexpected end of input at position ${this._pos}`);
    }
    for (let i = 0; i < str.length; i++) {
      if (this.data[this._pos++] !== str[i]) {
        throw new Error(`${decodeErrPrefix2} unexpected token at position ${this._pos}, expected to find '${String.fromCharCode(...str)}'`);
      }
    }
  }
  parseNumber() {
    const startPos = this._pos;
    let negative = false;
    let float = false;
    const swallow = (chars) => {
      while (!this.done()) {
        const ch = this.ch();
        if (chars.includes(ch)) {
          this._pos++;
        } else {
          break;
        }
      }
    };
    if (this.ch() === 45) {
      negative = true;
      this._pos++;
    }
    if (this.ch() === 48) {
      this._pos++;
      if (this.ch() === 46) {
        this._pos++;
        float = true;
      } else {
        return new Token2(Type2.uint, 0, this._pos - startPos);
      }
    }
    swallow([48, 49, 50, 51, 52, 53, 54, 55, 56, 57]);
    if (negative && this._pos === startPos + 1) {
      throw new Error(`${decodeErrPrefix2} unexpected token at position ${this._pos}`);
    }
    if (!this.done() && this.ch() === 46) {
      if (float) {
        throw new Error(`${decodeErrPrefix2} unexpected token at position ${this._pos}`);
      }
      float = true;
      this._pos++;
      swallow([48, 49, 50, 51, 52, 53, 54, 55, 56, 57]);
    }
    if (!this.done() && (this.ch() === 101 || this.ch() === 69)) {
      float = true;
      this._pos++;
      if (!this.done() && (this.ch() === 43 || this.ch() === 45)) {
        this._pos++;
      }
      swallow([48, 49, 50, 51, 52, 53, 54, 55, 56, 57]);
    }
    const numStr = String.fromCharCode.apply(null, this.data.subarray(startPos, this._pos));
    const num = parseFloat(numStr);
    if (float) {
      return new Token2(Type2.float, num, this._pos - startPos);
    }
    if (this.options.allowBigInt !== true || Number.isSafeInteger(num)) {
      return new Token2(num >= 0 ? Type2.uint : Type2.negint, num, this._pos - startPos);
    }
    return new Token2(num >= 0 ? Type2.uint : Type2.negint, BigInt(numStr), this._pos - startPos);
  }
  /**
   * @returns {Token}
   */
  parseString() {
    if (this.ch() !== 34) {
      throw new Error(`${decodeErrPrefix2} unexpected character at position ${this._pos}; this shouldn't happen`);
    }
    this._pos++;
    for (let i = this._pos, l = 0; i < this.data.length && l < 65536; i++, l++) {
      const ch = this.data[i];
      if (ch === 92 || ch < 32 || ch >= 128) {
        break;
      }
      if (ch === 34) {
        const str = String.fromCharCode.apply(null, this.data.subarray(this._pos, i));
        this._pos = i + 1;
        return new Token2(Type2.string, str, l);
      }
    }
    const startPos = this._pos;
    const chars = [];
    const readu4 = () => {
      if (this._pos + 4 >= this.data.length) {
        throw new Error(`${decodeErrPrefix2} unexpected end of unicode escape sequence at position ${this._pos}`);
      }
      let u4 = 0;
      for (let i = 0; i < 4; i++) {
        let ch = this.ch();
        if (ch >= 48 && ch <= 57) {
          ch -= 48;
        } else if (ch >= 97 && ch <= 102) {
          ch = ch - 97 + 10;
        } else if (ch >= 65 && ch <= 70) {
          ch = ch - 65 + 10;
        } else {
          throw new Error(`${decodeErrPrefix2} unexpected unicode escape character at position ${this._pos}`);
        }
        u4 = u4 * 16 + ch;
        this._pos++;
      }
      return u4;
    };
    const readUtf8Char = () => {
      const firstByte = this.ch();
      let codePoint = null;
      let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
      if (this._pos + bytesPerSequence > this.data.length) {
        throw new Error(`${decodeErrPrefix2} unexpected unicode sequence at position ${this._pos}`);
      }
      let secondByte, thirdByte, fourthByte, tempCodePoint;
      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 128) {
            codePoint = firstByte;
          }
          break;
        case 2:
          secondByte = this.data[this._pos + 1];
          if ((secondByte & 192) === 128) {
            tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
            if (tempCodePoint > 127) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 3:
          secondByte = this.data[this._pos + 1];
          thirdByte = this.data[this._pos + 2];
          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
            tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
            if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 4:
          secondByte = this.data[this._pos + 1];
          thirdByte = this.data[this._pos + 2];
          fourthByte = this.data[this._pos + 3];
          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
            tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
            if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
              codePoint = tempCodePoint;
            }
          }
      }
      if (codePoint === null) {
        codePoint = 65533;
        bytesPerSequence = 1;
      } else if (codePoint > 65535) {
        codePoint -= 65536;
        chars.push(codePoint >>> 10 & 1023 | 55296);
        codePoint = 56320 | codePoint & 1023;
      }
      chars.push(codePoint);
      this._pos += bytesPerSequence;
    };
    while (!this.done()) {
      const ch = this.ch();
      let ch1;
      switch (ch) {
        case 92:
          this._pos++;
          if (this.done()) {
            throw new Error(`${decodeErrPrefix2} unexpected string termination at position ${this._pos}`);
          }
          ch1 = this.ch();
          this._pos++;
          switch (ch1) {
            case 34:
            case 39:
            case 92:
            case 47:
              chars.push(ch1);
              break;
            case 98:
              chars.push(8);
              break;
            case 116:
              chars.push(9);
              break;
            case 110:
              chars.push(10);
              break;
            case 102:
              chars.push(12);
              break;
            case 114:
              chars.push(13);
              break;
            case 117:
              chars.push(readu4());
              break;
            default:
              throw new Error(`${decodeErrPrefix2} unexpected string escape character at position ${this._pos}`);
          }
          break;
        case 34:
          this._pos++;
          return new Token2(Type2.string, decodeCodePointsArray2(chars), this._pos - startPos);
        default:
          if (ch < 32) {
            throw new Error(`${decodeErrPrefix2} invalid control character at position ${this._pos}`);
          } else if (ch < 128) {
            chars.push(ch);
            this._pos++;
          } else {
            readUtf8Char();
          }
      }
    }
    throw new Error(`${decodeErrPrefix2} unexpected end of string at position ${this._pos}`);
  }
  /**
   * @returns {Token}
   */
  parseValue() {
    switch (this.ch()) {
      case 123:
        this.modeStack.push("obj-start");
        this._pos++;
        return new Token2(Type2.map, Infinity, 1);
      case 91:
        this.modeStack.push("array-start");
        this._pos++;
        return new Token2(Type2.array, Infinity, 1);
      case 34: {
        return this.parseString();
      }
      case 110:
        this.expect([110, 117, 108, 108]);
        return new Token2(Type2.null, null, 4);
      case 102:
        this.expect([102, 97, 108, 115, 101]);
        return new Token2(Type2.false, false, 5);
      case 116:
        this.expect([116, 114, 117, 101]);
        return new Token2(Type2.true, true, 4);
      case 45:
      case 48:
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        return this.parseNumber();
      default:
        throw new Error(`${decodeErrPrefix2} unexpected character at position ${this._pos}`);
    }
  }
  /**
   * @returns {Token}
   */
  next() {
    this.skipWhitespace();
    switch (this.currentMode()) {
      case "value":
        this.modeStack.pop();
        return this.parseValue();
      case "array-value": {
        this.modeStack.pop();
        if (this.ch() === 93) {
          this._pos++;
          this.skipWhitespace();
          return new Token2(Type2.break, void 0, 1);
        }
        if (this.ch() !== 44) {
          throw new Error(`${decodeErrPrefix2} unexpected character at position ${this._pos}, was expecting array delimiter but found '${String.fromCharCode(this.ch())}'`);
        }
        this._pos++;
        this.modeStack.push("array-value");
        this.skipWhitespace();
        return this.parseValue();
      }
      case "array-start": {
        this.modeStack.pop();
        if (this.ch() === 93) {
          this._pos++;
          this.skipWhitespace();
          return new Token2(Type2.break, void 0, 1);
        }
        this.modeStack.push("array-value");
        this.skipWhitespace();
        return this.parseValue();
      }
      case "obj-key":
        if (this.ch() === 125) {
          this.modeStack.pop();
          this._pos++;
          this.skipWhitespace();
          return new Token2(Type2.break, void 0, 1);
        }
        if (this.ch() !== 44) {
          throw new Error(`${decodeErrPrefix2} unexpected character at position ${this._pos}, was expecting object delimiter but found '${String.fromCharCode(this.ch())}'`);
        }
        this._pos++;
        this.skipWhitespace();
      case "obj-start": {
        this.modeStack.pop();
        if (this.ch() === 125) {
          this._pos++;
          this.skipWhitespace();
          return new Token2(Type2.break, void 0, 1);
        }
        const token = this.parseString();
        this.skipWhitespace();
        if (this.ch() !== 58) {
          throw new Error(`${decodeErrPrefix2} unexpected character at position ${this._pos}, was expecting key/value delimiter ':' but found '${String.fromCharCode(this.ch())}'`);
        }
        this._pos++;
        this.modeStack.push("obj-value");
        return token;
      }
      case "obj-value": {
        this.modeStack.pop();
        this.modeStack.push("obj-key");
        this.skipWhitespace();
        return this.parseValue();
      }
      default:
        throw new Error(`${decodeErrPrefix2} unexpected parse state at position ${this._pos}; this shouldn't happen`);
    }
  }
};
function decode37(data, options) {
  options = Object.assign({ tokenizer: new Tokenizer(data, options) }, options);
  return decode36(data, options);
}

// node_modules/@ipld/dag-json/node_modules/multiformats/dist/src/bytes.js
var empty8 = new Uint8Array(0);
function equals16(aa, bb) {
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
function coerce8(o) {
  if (o instanceof Uint8Array && o.constructor.name === "Uint8Array")
    return o;
  if (o instanceof ArrayBuffer)
    return new Uint8Array(o);
  if (ArrayBuffer.isView(o)) {
    return new Uint8Array(o.buffer, o.byteOffset, o.byteLength);
  }
  throw new Error("Unknown type, must be binary type");
}

// node_modules/@ipld/dag-json/node_modules/multiformats/dist/src/vendor/base-x.js
function base9(ALPHABET, name8) {
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
  function encode33(source) {
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
    var length11 = 0;
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
      for (var it1 = size - 1; (carry !== 0 || i2 < length11) && it1 !== -1; it1--, i2++) {
        carry += 256 * b58[it1] >>> 0;
        b58[it1] = carry % BASE >>> 0;
        carry = carry / BASE >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length11 = i2;
      pbegin++;
    }
    var it2 = size - length11;
    while (it2 !== size && b58[it2] === 0) {
      it2++;
    }
    var str = LEADER.repeat(zeroes);
    for (; it2 < size; ++it2) {
      str += ALPHABET.charAt(b58[it2]);
    }
    return str;
  }
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
    var length11 = 0;
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
      for (var it3 = size - 1; (carry !== 0 || i2 < length11) && it3 !== -1; it3--, i2++) {
        carry += BASE * b256[it3] >>> 0;
        b256[it3] = carry % 256 >>> 0;
        carry = carry / 256 >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length11 = i2;
      psz++;
    }
    if (source[psz] === " ") {
      return;
    }
    var it4 = size - length11;
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
  function decode49(string5) {
    var buffer3 = decodeUnsafe(string5);
    if (buffer3) {
      return buffer3;
    }
    throw new Error(`Non-${name8} character`);
  }
  return {
    encode: encode33,
    decodeUnsafe,
    decode: decode49
  };
}
var src8 = base9;
var _brrp__multiformats_scope_baseX8 = src8;
var base_x_default8 = _brrp__multiformats_scope_baseX8;

// node_modules/@ipld/dag-json/node_modules/multiformats/dist/src/bases/base.js
var Encoder8 = class {
  name;
  prefix;
  baseEncode;
  constructor(name8, prefix, baseEncode) {
    this.name = name8;
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
var Decoder8 = class {
  name;
  prefix;
  baseDecode;
  prefixCodePoint;
  constructor(name8, prefix, baseDecode) {
    this.name = name8;
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
    return or8(this, decoder);
  }
};
var ComposedDecoder8 = class {
  decoders;
  constructor(decoders) {
    this.decoders = decoders;
  }
  or(decoder) {
    return or8(this, decoder);
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
function or8(left, right) {
  return new ComposedDecoder8({
    ...left.decoders ?? { [left.prefix]: left },
    ...right.decoders ?? { [right.prefix]: right }
  });
}
var Codec8 = class {
  name;
  prefix;
  baseEncode;
  baseDecode;
  encoder;
  decoder;
  constructor(name8, prefix, baseEncode, baseDecode) {
    this.name = name8;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
    this.baseDecode = baseDecode;
    this.encoder = new Encoder8(name8, prefix, baseEncode);
    this.decoder = new Decoder8(name8, prefix, baseDecode);
  }
  encode(input) {
    return this.encoder.encode(input);
  }
  decode(input) {
    return this.decoder.decode(input);
  }
};
function from12({ name: name8, prefix, encode: encode33, decode: decode49 }) {
  return new Codec8(name8, prefix, encode33, decode49);
}
function baseX8({ name: name8, prefix, alphabet: alphabet5 }) {
  const { encode: encode33, decode: decode49 } = base_x_default8(alphabet5, name8);
  return from12({
    prefix,
    name: name8,
    encode: encode33,
    decode: (text) => coerce8(decode49(text))
  });
}
function decode38(string5, alphabet5, bitsPerChar, name8) {
  const codes = {};
  for (let i = 0; i < alphabet5.length; ++i) {
    codes[alphabet5[i]] = i;
  }
  let end = string5.length;
  while (string5[end - 1] === "=") {
    --end;
  }
  const out = new Uint8Array(end * bitsPerChar / 8 | 0);
  let bits = 0;
  let buffer3 = 0;
  let written = 0;
  for (let i = 0; i < end; ++i) {
    const value = codes[string5[i]];
    if (value === void 0) {
      throw new SyntaxError(`Non-${name8} character`);
    }
    buffer3 = buffer3 << bitsPerChar | value;
    bits += bitsPerChar;
    if (bits >= 8) {
      bits -= 8;
      out[written++] = 255 & buffer3 >> bits;
    }
  }
  if (bits >= bitsPerChar || (255 & buffer3 << 8 - bits) !== 0) {
    throw new SyntaxError("Unexpected end of data");
  }
  return out;
}
function encode26(data, alphabet5, bitsPerChar) {
  const pad = alphabet5[alphabet5.length - 1] === "=";
  const mask = (1 << bitsPerChar) - 1;
  let out = "";
  let bits = 0;
  let buffer3 = 0;
  for (let i = 0; i < data.length; ++i) {
    buffer3 = buffer3 << 8 | data[i];
    bits += 8;
    while (bits > bitsPerChar) {
      bits -= bitsPerChar;
      out += alphabet5[mask & buffer3 >> bits];
    }
  }
  if (bits !== 0) {
    out += alphabet5[mask & buffer3 << bitsPerChar - bits];
  }
  if (pad) {
    while ((out.length * bitsPerChar & 7) !== 0) {
      out += "=";
    }
  }
  return out;
}
function rfc46488({ name: name8, prefix, bitsPerChar, alphabet: alphabet5 }) {
  return from12({
    prefix,
    name: name8,
    encode(input) {
      return encode26(input, alphabet5, bitsPerChar);
    },
    decode(input) {
      return decode38(input, alphabet5, bitsPerChar, name8);
    }
  });
}

// node_modules/@ipld/dag-json/node_modules/multiformats/dist/src/bases/base32.js
var base328 = rfc46488({
  prefix: "b",
  name: "base32",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567",
  bitsPerChar: 5
});
var base32upper8 = rfc46488({
  prefix: "B",
  name: "base32upper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
  bitsPerChar: 5
});
var base32pad8 = rfc46488({
  prefix: "c",
  name: "base32pad",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
  bitsPerChar: 5
});
var base32padupper8 = rfc46488({
  prefix: "C",
  name: "base32padupper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
  bitsPerChar: 5
});
var base32hex8 = rfc46488({
  prefix: "v",
  name: "base32hex",
  alphabet: "0123456789abcdefghijklmnopqrstuv",
  bitsPerChar: 5
});
var base32hexupper8 = rfc46488({
  prefix: "V",
  name: "base32hexupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
  bitsPerChar: 5
});
var base32hexpad8 = rfc46488({
  prefix: "t",
  name: "base32hexpad",
  alphabet: "0123456789abcdefghijklmnopqrstuv=",
  bitsPerChar: 5
});
var base32hexpadupper8 = rfc46488({
  prefix: "T",
  name: "base32hexpadupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
  bitsPerChar: 5
});
var base32z8 = rfc46488({
  prefix: "h",
  name: "base32z",
  alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
  bitsPerChar: 5
});

// node_modules/@ipld/dag-json/node_modules/multiformats/dist/src/bases/base58.js
var base58btc8 = baseX8({
  name: "base58btc",
  prefix: "z",
  alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
});
var base58flickr8 = baseX8({
  name: "base58flickr",
  prefix: "Z",
  alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
});

// node_modules/@ipld/dag-json/node_modules/multiformats/dist/src/vendor/varint.js
var encode_18 = encode27;
var MSB9 = 128;
var REST9 = 127;
var MSBALL8 = ~REST9;
var INT8 = Math.pow(2, 31);
function encode27(num, out, offset) {
  out = out || [];
  offset = offset || 0;
  var oldOffset = offset;
  while (num >= INT8) {
    out[offset++] = num & 255 | MSB9;
    num /= 128;
  }
  while (num & MSBALL8) {
    out[offset++] = num & 255 | MSB9;
    num >>>= 7;
  }
  out[offset] = num | 0;
  encode27.bytes = offset - oldOffset + 1;
  return out;
}
var decode39 = read9;
var MSB$18 = 128;
var REST$18 = 127;
function read9(buf3, offset) {
  var res = 0, offset = offset || 0, shift = 0, counter = offset, b, l = buf3.length;
  do {
    if (counter >= l) {
      read9.bytes = 0;
      throw new RangeError("Could not decode varint");
    }
    b = buf3[counter++];
    res += shift < 28 ? (b & REST$18) << shift : (b & REST$18) * Math.pow(2, shift);
    shift += 7;
  } while (b >= MSB$18);
  read9.bytes = counter - offset;
  return res;
}
var N19 = Math.pow(2, 7);
var N29 = Math.pow(2, 14);
var N39 = Math.pow(2, 21);
var N49 = Math.pow(2, 28);
var N59 = Math.pow(2, 35);
var N69 = Math.pow(2, 42);
var N79 = Math.pow(2, 49);
var N88 = Math.pow(2, 56);
var N98 = Math.pow(2, 63);
var length9 = function(value) {
  return value < N19 ? 1 : value < N29 ? 2 : value < N39 ? 3 : value < N49 ? 4 : value < N59 ? 5 : value < N69 ? 6 : value < N79 ? 7 : value < N88 ? 8 : value < N98 ? 9 : 10;
};
var varint8 = {
  encode: encode_18,
  decode: decode39,
  encodingLength: length9
};
var _brrp_varint8 = varint8;
var varint_default8 = _brrp_varint8;

// node_modules/@ipld/dag-json/node_modules/multiformats/dist/src/varint.js
function decode40(data, offset = 0) {
  const code13 = varint_default8.decode(data, offset);
  return [code13, varint_default8.decode.bytes];
}
function encodeTo8(int, target, offset = 0) {
  varint_default8.encode(int, target, offset);
  return target;
}
function encodingLength9(int) {
  return varint_default8.encodingLength(int);
}

// node_modules/@ipld/dag-json/node_modules/multiformats/dist/src/hashes/digest.js
function create8(code13, digest6) {
  const size = digest6.byteLength;
  const sizeOffset = encodingLength9(code13);
  const digestOffset = sizeOffset + encodingLength9(size);
  const bytes = new Uint8Array(digestOffset + size);
  encodeTo8(code13, bytes, 0);
  encodeTo8(size, bytes, sizeOffset);
  bytes.set(digest6, digestOffset);
  return new Digest8(code13, size, digest6, bytes);
}
function decode41(multihash) {
  const bytes = coerce8(multihash);
  const [code13, sizeOffset] = decode40(bytes);
  const [size, digestOffset] = decode40(bytes.subarray(sizeOffset));
  const digest6 = bytes.subarray(sizeOffset + digestOffset);
  if (digest6.byteLength !== size) {
    throw new Error("Incorrect length");
  }
  return new Digest8(code13, size, digest6, bytes);
}
function equals17(a, b) {
  if (a === b) {
    return true;
  } else {
    const data = b;
    return a.code === data.code && a.size === data.size && data.bytes instanceof Uint8Array && equals16(a.bytes, data.bytes);
  }
}
var Digest8 = class {
  code;
  size;
  digest;
  bytes;
  /**
   * Creates a multihash digest.
   */
  constructor(code13, size, digest6, bytes) {
    this.code = code13;
    this.size = size;
    this.digest = digest6;
    this.bytes = bytes;
  }
};

// node_modules/@ipld/dag-json/node_modules/multiformats/dist/src/cid.js
function format8(link, base12) {
  const { bytes, version } = link;
  switch (version) {
    case 0:
      return toStringV08(bytes, baseCache8(link), base12 ?? base58btc8.encoder);
    default:
      return toStringV18(bytes, baseCache8(link), base12 ?? base328.encoder);
  }
}
var cache8 = /* @__PURE__ */ new WeakMap();
function baseCache8(cid) {
  const baseCache10 = cache8.get(cid);
  if (baseCache10 == null) {
    const baseCache11 = /* @__PURE__ */ new Map();
    cache8.set(cid, baseCache11);
    return baseCache11;
  }
  return baseCache10;
}
var CID8 = class _CID {
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
  constructor(version, code13, multihash, bytes) {
    this.code = code13;
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
        const { code: code13, multihash } = this;
        if (code13 !== DAG_PB_CODE8) {
          throw new Error("Cannot convert a non dag-pb CID to CIDv0");
        }
        if (multihash.code !== SHA_256_CODE8) {
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
        const { code: code13, digest: digest6 } = this.multihash;
        const multihash = create8(code13, digest6);
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
    return unknown != null && self.code === unknown.code && self.version === unknown.version && equals17(self.multihash, unknown.multihash);
  }
  toString(base12) {
    return format8(this, base12);
  }
  toJSON() {
    return { "/": format8(this) };
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
      const { version, code: code13, multihash, bytes } = value;
      return new _CID(version, code13, multihash, bytes ?? encodeCID8(version, code13, multihash.bytes));
    } else if (value[cidSymbol8] === true) {
      const { version, multihash, code: code13 } = value;
      const digest6 = decode41(multihash);
      return _CID.create(version, code13, digest6);
    } else {
      return null;
    }
  }
  /**
   * @param version - Version of the CID
   * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
   * @param digest - (Multi)hash of the of the content.
   */
  static create(version, code13, digest6) {
    if (typeof code13 !== "number") {
      throw new Error("String codecs are no longer supported");
    }
    if (!(digest6.bytes instanceof Uint8Array)) {
      throw new Error("Invalid digest");
    }
    switch (version) {
      case 0: {
        if (code13 !== DAG_PB_CODE8) {
          throw new Error(`Version 0 CID must use dag-pb (code: ${DAG_PB_CODE8}) block encoding`);
        } else {
          return new _CID(version, code13, digest6, digest6.bytes);
        }
      }
      case 1: {
        const bytes = encodeCID8(version, code13, digest6.bytes);
        return new _CID(version, code13, digest6, bytes);
      }
      default: {
        throw new Error("Invalid version");
      }
    }
  }
  /**
   * Simplified version of `create` for CIDv0.
   */
  static createV0(digest6) {
    return _CID.create(0, DAG_PB_CODE8, digest6);
  }
  /**
   * Simplified version of `create` for CIDv1.
   *
   * @param code - Content encoding format code.
   * @param digest - Multihash of the content.
   */
  static createV1(code13, digest6) {
    return _CID.create(1, code13, digest6);
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
    const multihashBytes = coerce8(bytes.subarray(prefixSize, prefixSize + specs.multihashSize));
    if (multihashBytes.byteLength !== specs.multihashSize) {
      throw new Error("Incorrect length");
    }
    const digestBytes = multihashBytes.subarray(specs.multihashSize - specs.digestSize);
    const digest6 = new Digest8(specs.multihashCode, specs.digestSize, digestBytes, multihashBytes);
    const cid = specs.version === 0 ? _CID.createV0(digest6) : _CID.createV1(specs.codec, digest6);
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
    const next = () => {
      const [i, length11] = decode40(initialBytes.subarray(offset));
      offset += length11;
      return i;
    };
    let version = next();
    let codec = DAG_PB_CODE8;
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
  static parse(source, base12) {
    const [prefix, bytes] = parseCIDtoBytes8(source, base12);
    const cid = _CID.decode(bytes);
    if (cid.version === 0 && source[0] !== "Q") {
      throw Error("Version 0 CID string must not include multibase prefix");
    }
    baseCache8(cid).set(prefix, source);
    return cid;
  }
};
function parseCIDtoBytes8(source, base12) {
  switch (source[0]) {
    case "Q": {
      const decoder = base12 ?? base58btc8;
      return [
        base58btc8.prefix,
        decoder.decode(`${base58btc8.prefix}${source}`)
      ];
    }
    case base58btc8.prefix: {
      const decoder = base12 ?? base58btc8;
      return [base58btc8.prefix, decoder.decode(source)];
    }
    case base328.prefix: {
      const decoder = base12 ?? base328;
      return [base328.prefix, decoder.decode(source)];
    }
    default: {
      if (base12 == null) {
        throw Error("To parse non base32 or base58btc encoded CID multibase decoder must be provided");
      }
      return [source[0], base12.decode(source)];
    }
  }
}
function toStringV08(bytes, cache10, base12) {
  const { prefix } = base12;
  if (prefix !== base58btc8.prefix) {
    throw Error(`Cannot string encode V0 in ${base12.name} encoding`);
  }
  const cid = cache10.get(prefix);
  if (cid == null) {
    const cid2 = base12.encode(bytes).slice(1);
    cache10.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
function toStringV18(bytes, cache10, base12) {
  const { prefix } = base12;
  const cid = cache10.get(prefix);
  if (cid == null) {
    const cid2 = base12.encode(bytes);
    cache10.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
var DAG_PB_CODE8 = 112;
var SHA_256_CODE8 = 18;
function encodeCID8(version, code13, multihash) {
  const codeOffset = encodingLength9(version);
  const hashOffset = codeOffset + encodingLength9(code13);
  const bytes = new Uint8Array(hashOffset + multihash.byteLength);
  encodeTo8(version, bytes, 0);
  encodeTo8(code13, bytes, codeOffset);
  bytes.set(multihash, hashOffset);
  return bytes;
}
var cidSymbol8 = Symbol.for("@ipld/js-cid/CID");

// node_modules/@ipld/dag-json/node_modules/multiformats/dist/src/bases/base64.js
var base644 = rfc46488({
  prefix: "m",
  name: "base64",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
  bitsPerChar: 6
});
var base64pad4 = rfc46488({
  prefix: "M",
  name: "base64pad",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  bitsPerChar: 6
});
var base64url4 = rfc46488({
  prefix: "u",
  name: "base64url",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
  bitsPerChar: 6
});
var base64urlpad4 = rfc46488({
  prefix: "U",
  name: "base64urlpad",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
  bitsPerChar: 6
});

// node_modules/@ipld/dag-json/src/index.js
function toByteView3(buf3) {
  if (buf3 instanceof ArrayBuffer) {
    return new Uint8Array(buf3, 0, buf3.byteLength);
  }
  return buf3;
}
var DagJsonTokenizer = class extends Tokenizer {
  /**
   * @param {Uint8Array} data
   * @param {object} [options]
   */
  constructor(data, options) {
    super(data, options);
    this.tokenBuffer = [];
  }
  /**
   * @returns {boolean}
   */
  done() {
    return this.tokenBuffer.length === 0 && super.done();
  }
  /**
   * @returns {Token}
   */
  _next() {
    if (this.tokenBuffer.length > 0) {
      return this.tokenBuffer.pop();
    }
    return super.next();
  }
  /**
   * Implements rules outlined in https://github.com/ipld/specs/pull/356
   *
   * @returns {Token}
   */
  next() {
    const token = this._next();
    if (token.type === Type2.map) {
      const keyToken = this._next();
      if (keyToken.type === Type2.string && keyToken.value === "/") {
        const valueToken = this._next();
        if (valueToken.type === Type2.string) {
          const breakToken = this._next();
          if (breakToken.type !== Type2.break) {
            throw new Error("Invalid encoded CID form");
          }
          this.tokenBuffer.push(valueToken);
          return new Token2(Type2.tag, 42, 0);
        }
        if (valueToken.type === Type2.map) {
          const innerKeyToken = this._next();
          if (innerKeyToken.type === Type2.string && innerKeyToken.value === "bytes") {
            const innerValueToken = this._next();
            if (innerValueToken.type === Type2.string) {
              for (let i = 0; i < 2; i++) {
                const breakToken = this._next();
                if (breakToken.type !== Type2.break) {
                  throw new Error("Invalid encoded Bytes form");
                }
              }
              const bytes = base644.decode(`m${innerValueToken.value}`);
              return new Token2(Type2.bytes, bytes, innerValueToken.value.length);
            }
            this.tokenBuffer.push(innerValueToken);
          }
          this.tokenBuffer.push(innerKeyToken);
        }
        this.tokenBuffer.push(valueToken);
      }
      this.tokenBuffer.push(keyToken);
    }
    return token;
  }
};
var decodeOptions2 = {
  allowIndefinite: false,
  allowUndefined: false,
  allowNaN: false,
  allowInfinity: false,
  allowBigInt: true,
  // this will lead to BigInt for ints outside of
  // safe-integer range, which may surprise users
  strict: true,
  useMaps: false,
  rejectDuplicateMapKeys: true,
  /** @type {import('cborg').TagDecoder[]} */
  tags: []
};
decodeOptions2.tags[42] = CID8.parse;
var code7 = 297;
var decode42 = (data) => {
  const buf3 = toByteView3(data);
  const options = Object.assign(decodeOptions2, { tokenizer: new DagJsonTokenizer(buf3, decodeOptions2) });
  return decode37(buf3, options);
};
var utf8Decoder = new TextDecoder();
var utf8Encoder = new TextEncoder();

// node_modules/ipfs-unixfs-exporter/dist/src/resolvers/index.js
var import_err_code13 = __toESM(require_err_code(), 1);

// node_modules/ipfs-unixfs-exporter/node_modules/multiformats/dist/src/codecs/json.js
var textEncoder8 = new TextEncoder();
var textDecoder7 = new TextDecoder();
var code8 = 512;
function decode43(data) {
  return JSON.parse(textDecoder7.decode(data));
}

// node_modules/ipfs-unixfs-exporter/node_modules/multiformats/dist/src/codecs/raw.js
var code9 = 85;

// node_modules/ipfs-unixfs-exporter/node_modules/multiformats/dist/src/hashes/identity.js
var code10 = 0;
var name6 = "identity";
var encode28 = coerce6;
function digest4(input) {
  return create6(code10, encode28(input));
}
var identity7 = { code: code10, name: name6, encode: encode28, digest: digest4 };

// node_modules/ipfs-unixfs-exporter/dist/src/utils/resolve-object-path.js
var import_err_code5 = __toESM(require_err_code(), 1);
function resolveObjectPath(object, block, cid, name8, path, toResolve, depth) {
  let subObject = object;
  let subPath = path;
  while (toResolve.length > 0) {
    const prop = toResolve[0];
    if (prop in subObject) {
      toResolve.shift();
      subPath = `${subPath}/${prop}`;
      const subObjectCid = CID6.asCID(subObject[prop]);
      if (subObjectCid != null) {
        return {
          entry: {
            type: "object",
            name: name8,
            path,
            cid,
            node: block,
            depth,
            size: BigInt(block.length),
            content: async function* () {
              yield object;
            }
          },
          next: {
            cid: subObjectCid,
            name: prop,
            path: subPath,
            toResolve
          }
        };
      }
      subObject = subObject[prop];
    } else {
      throw (0, import_err_code5.default)(new Error(`No property named ${prop} found in node ${cid}`), "ERR_NO_PROP");
    }
  }
  return {
    entry: {
      type: "object",
      name: name8,
      path,
      cid,
      node: block,
      depth,
      size: BigInt(block.length),
      content: async function* () {
        yield object;
      }
    }
  };
}

// node_modules/ipfs-unixfs-exporter/dist/src/resolvers/dag-cbor.js
var resolve = async (cid, name8, path, toResolve, resolve8, depth, blockstore, options) => {
  const block = await blockstore.get(cid, options);
  const object = decode35(block);
  return resolveObjectPath(object, block, cid, name8, path, toResolve, depth);
};
var dag_cbor_default = resolve;

// node_modules/ipfs-unixfs-exporter/dist/src/resolvers/dag-json.js
var resolve2 = async (cid, name8, path, toResolve, resolve8, depth, blockstore, options) => {
  const block = await blockstore.get(cid, options);
  const object = decode42(block);
  return resolveObjectPath(object, block, cid, name8, path, toResolve, depth);
};
var dag_json_default = resolve2;

// node_modules/ipfs-unixfs-exporter/dist/src/resolvers/identity.js
var import_err_code7 = __toESM(require_err_code(), 1);

// node_modules/ipfs-unixfs-exporter/dist/src/utils/extract-data-from-block.js
function extractDataFromBlock(block, blockStart, requestedStart, requestedEnd) {
  const blockLength = BigInt(block.length);
  const blockEnd = BigInt(blockStart + blockLength);
  if (requestedStart >= blockEnd || requestedEnd < blockStart) {
    return new Uint8Array(0);
  }
  if (requestedEnd >= blockStart && requestedEnd < blockEnd) {
    block = block.subarray(0, Number(requestedEnd - blockStart));
  }
  if (requestedStart >= blockStart && requestedStart < blockEnd) {
    block = block.subarray(Number(requestedStart - blockStart));
  }
  return block;
}
var extract_data_from_block_default = extractDataFromBlock;

// node_modules/ipfs-unixfs-exporter/dist/src/utils/validate-offset-and-length.js
var import_err_code6 = __toESM(require_err_code(), 1);
var validateOffsetAndLength = (size, offset = 0, length11 = size) => {
  const fileSize = BigInt(size);
  const start = BigInt(offset ?? 0);
  let end = BigInt(length11);
  if (end !== fileSize) {
    end = start + end;
  }
  if (end > fileSize) {
    end = fileSize;
  }
  if (start < 0n) {
    throw (0, import_err_code6.default)(new Error("Offset must be greater than or equal to 0"), "ERR_INVALID_PARAMS");
  }
  if (start > fileSize) {
    throw (0, import_err_code6.default)(new Error("Offset must be less than the file size"), "ERR_INVALID_PARAMS");
  }
  if (end < 0n) {
    throw (0, import_err_code6.default)(new Error("Length must be greater than or equal to 0"), "ERR_INVALID_PARAMS");
  }
  if (end > fileSize) {
    throw (0, import_err_code6.default)(new Error("Length must be less than the file size"), "ERR_INVALID_PARAMS");
  }
  return {
    start,
    end
  };
};
var validate_offset_and_length_default = validateOffsetAndLength;

// node_modules/ipfs-unixfs-exporter/dist/src/resolvers/identity.js
var rawContent = (node) => {
  async function* contentGenerator(options = {}) {
    const { start, end } = validate_offset_and_length_default(node.length, options.offset, options.length);
    const buf3 = extract_data_from_block_default(node, 0n, start, end);
    options.onProgress?.(new CustomProgressEvent("unixfs:exporter:progress:identity", {
      bytesRead: BigInt(buf3.byteLength),
      totalBytes: end - start,
      fileSize: BigInt(node.byteLength)
    }));
    yield buf3;
  }
  return contentGenerator;
};
var resolve3 = async (cid, name8, path, toResolve, resolve8, depth, blockstore, options) => {
  if (toResolve.length > 0) {
    throw (0, import_err_code7.default)(new Error(`No link named ${path} found in raw node ${cid}`), "ERR_NOT_FOUND");
  }
  const buf3 = decode29(cid.multihash.bytes);
  return {
    entry: {
      type: "identity",
      name: name8,
      path,
      cid,
      content: rawContent(buf3.digest),
      depth,
      size: BigInt(buf3.digest.length),
      node: buf3.digest
    }
  };
};
var identity_default = resolve3;

// node_modules/ipfs-unixfs-exporter/dist/src/resolvers/json.js
var resolve4 = async (cid, name8, path, toResolve, resolve8, depth, blockstore, options) => {
  const block = await blockstore.get(cid, options);
  const object = decode43(block);
  return resolveObjectPath(object, block, cid, name8, path, toResolve, depth);
};
var json_default = resolve4;

// node_modules/ipfs-unixfs-exporter/dist/src/resolvers/raw.js
var import_err_code8 = __toESM(require_err_code(), 1);
var rawContent2 = (node) => {
  async function* contentGenerator(options = {}) {
    const { start, end } = validate_offset_and_length_default(node.length, options.offset, options.length);
    const buf3 = extract_data_from_block_default(node, 0n, start, end);
    options.onProgress?.(new CustomProgressEvent("unixfs:exporter:progress:raw", {
      bytesRead: BigInt(buf3.byteLength),
      totalBytes: end - start,
      fileSize: BigInt(node.byteLength)
    }));
    yield buf3;
  }
  return contentGenerator;
};
var resolve5 = async (cid, name8, path, toResolve, resolve8, depth, blockstore, options) => {
  if (toResolve.length > 0) {
    throw (0, import_err_code8.default)(new Error(`No link named ${path} found in raw node ${cid}`), "ERR_NOT_FOUND");
  }
  const block = await blockstore.get(cid, options);
  return {
    entry: {
      type: "raw",
      name: name8,
      path,
      cid,
      content: rawContent2(block),
      depth,
      size: BigInt(block.length),
      node: block
    }
  };
};
var raw_default = resolve5;

// node_modules/ipfs-unixfs-exporter/dist/src/resolvers/unixfs-v1/index.js
var import_err_code12 = __toESM(require_err_code(), 1);

// node_modules/ipfs-unixfs-exporter/dist/src/utils/find-cid-in-shard.js
var import_err_code9 = __toESM(require_err_code(), 1);
var hashFn = async function(buf3) {
  return (await murmur3128.encode(buf3)).slice(0, 8).reverse();
};
var addLinksToHamtBucket = async (links, bucket, rootBucket) => {
  const padLength = (bucket.tableSize() - 1).toString(16).length;
  await Promise.all(links.map(async (link) => {
    if (link.Name == null) {
      throw new Error("Unexpected Link without a Name");
    }
    if (link.Name.length === padLength) {
      const pos = parseInt(link.Name, 16);
      bucket._putObjectAt(pos, new Bucket({
        hash: rootBucket._options.hash,
        bits: rootBucket._options.bits
      }, bucket, pos));
      return;
    }
    await rootBucket.put(link.Name.substring(2), true);
  }));
};
var toPrefix = (position, padLength) => {
  return position.toString(16).toUpperCase().padStart(padLength, "0").substring(0, padLength);
};
var toBucketPath = (position) => {
  let bucket = position.bucket;
  const path = [];
  while (bucket._parent != null) {
    path.push(bucket);
    bucket = bucket._parent;
  }
  path.push(bucket);
  return path.reverse();
};
var findShardCid = async (node, name8, blockstore, context, options) => {
  if (context == null) {
    if (node.Data == null) {
      throw (0, import_err_code9.default)(new Error("no data in PBNode"), "ERR_NOT_UNIXFS");
    }
    let dir;
    try {
      dir = UnixFS.unmarshal(node.Data);
    } catch (err) {
      throw (0, import_err_code9.default)(err, "ERR_NOT_UNIXFS");
    }
    if (dir.type !== "hamt-sharded-directory") {
      throw (0, import_err_code9.default)(new Error("not a HAMT"), "ERR_NOT_UNIXFS");
    }
    if (dir.fanout == null) {
      throw (0, import_err_code9.default)(new Error("missing fanout"), "ERR_NOT_UNIXFS");
    }
    const rootBucket = createHAMT({
      hashFn,
      bits: Math.log2(Number(dir.fanout))
    });
    context = {
      rootBucket,
      hamtDepth: 1,
      lastBucket: rootBucket
    };
  }
  const padLength = (context.lastBucket.tableSize() - 1).toString(16).length;
  await addLinksToHamtBucket(node.Links, context.lastBucket, context.rootBucket);
  const position = await context.rootBucket._findNewBucketAndPos(name8);
  let prefix = toPrefix(position.pos, padLength);
  const bucketPath = toBucketPath(position);
  if (bucketPath.length > context.hamtDepth) {
    context.lastBucket = bucketPath[context.hamtDepth];
    prefix = toPrefix(context.lastBucket._posAtParent, padLength);
  }
  const link = node.Links.find((link2) => {
    if (link2.Name == null) {
      return false;
    }
    const entryPrefix = link2.Name.substring(0, padLength);
    const entryName = link2.Name.substring(padLength);
    if (entryPrefix !== prefix) {
      return false;
    }
    if (entryName !== "" && entryName !== name8) {
      return false;
    }
    return true;
  });
  if (link == null) {
    return;
  }
  if (link.Name != null && link.Name.substring(padLength) === name8) {
    return link.Hash;
  }
  context.hamtDepth++;
  const block = await blockstore.get(link.Hash, options);
  node = decode5(block);
  return findShardCid(node, name8, blockstore, context, options);
};
var find_cid_in_shard_default = findShardCid;

// node_modules/it-peekable/dist/src/index.js
function peekable(iterable) {
  const [iterator, symbol2] = iterable[Symbol.asyncIterator] != null ? [iterable[Symbol.asyncIterator](), Symbol.asyncIterator] : [iterable[Symbol.iterator](), Symbol.iterator];
  const queue = [];
  return {
    peek: () => {
      return iterator.next();
    },
    push: (value) => {
      queue.push(value);
    },
    next: () => {
      if (queue.length > 0) {
        return {
          done: false,
          value: queue.shift()
        };
      }
      return iterator.next();
    },
    [symbol2]() {
      return this;
    }
  };
}
var src_default4 = peekable;

// node_modules/it-filter/dist/src/index.js
function isAsyncIterable5(thing) {
  return thing[Symbol.asyncIterator] != null;
}
function filter(source, fn) {
  let index = 0;
  if (isAsyncIterable5(source)) {
    return async function* () {
      for await (const entry of source) {
        if (await fn(entry, index++)) {
          yield entry;
        }
      }
    }();
  }
  const peekable2 = src_default4(source);
  const { value, done } = peekable2.next();
  if (done === true) {
    return /* @__PURE__ */ function* () {
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
  const func = fn;
  return function* () {
    if (res === true) {
      yield value;
    }
    for (const entry of peekable2) {
      if (func(entry, index++)) {
        yield entry;
      }
    }
  }();
}
var src_default5 = filter;

// node_modules/it-map/dist/src/index.js
function isAsyncIterable6(thing) {
  return thing[Symbol.asyncIterator] != null;
}
function map(source, func) {
  let index = 0;
  if (isAsyncIterable6(source)) {
    return async function* () {
      for await (const val of source) {
        yield func(val, index++);
      }
    }();
  }
  const peekable2 = src_default4(source);
  const { value, done } = peekable2.next();
  if (done === true) {
    return /* @__PURE__ */ function* () {
    }();
  }
  const res = func(value, index++);
  if (typeof res.then === "function") {
    return async function* () {
      yield await res;
      for await (const val of peekable2) {
        yield func(val, index++);
      }
    }();
  }
  const fn = func;
  return function* () {
    yield res;
    for (const val of peekable2) {
      yield fn(val, index++);
    }
  }();
}
var src_default6 = map;

// node_modules/p-defer/index.js
function pDefer() {
  const deferred = {};
  deferred.promise = new Promise((resolve8, reject) => {
    deferred.resolve = resolve8;
    deferred.reject = reject;
  });
  return deferred;
}

// node_modules/it-parallel/dist/src/index.js
var CustomEvent = globalThis.CustomEvent ?? Event;
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
          emitter.dispatchEvent(new CustomEvent("task-complete"));
        }, (err) => {
          op.done = true;
          op.err = err;
          emitter.dispatchEvent(new CustomEvent("task-complete"));
        });
      }
      sourceFinished = true;
      emitter.dispatchEvent(new CustomEvent("task-complete"));
    } catch (err) {
      sourceErr = err;
      emitter.dispatchEvent(new CustomEvent("task-complete"));
    }
  });
  function valuesAvailable() {
    if (ordered) {
      return ops[0]?.done;
    }
    return Boolean(ops.find((op) => op.done));
  }
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

// node_modules/it-pushable/dist/src/fifo.js
var FixedFIFO = class {
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
    const last2 = this.buffer[this.btm];
    if (last2 === void 0) {
      return void 0;
    }
    this.buffer[this.btm] = void 0;
    this.btm = this.btm + 1 & this.mask;
    return last2;
  }
  isEmpty() {
    return this.buffer[this.btm] === void 0;
  }
};
var FIFO = class {
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
  type;
  code;
  constructor(message2, code13) {
    super(message2 ?? "The operation was aborted");
    this.type = "aborted";
    this.code = code13 ?? "ABORT_ERR";
  }
};
function pushable(options = {}) {
  const getNext = (buffer3) => {
    const next = buffer3.shift();
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
  };
  return _pushable(getNext, options);
}
function _pushable(getNext, options) {
  options = options ?? {};
  let onEnd = options.onEnd;
  let buffer3 = new FIFO();
  let pushable2;
  let onNext;
  let ended;
  let drain = pDefer();
  const waitNext = async () => {
    try {
      if (!buffer3.isEmpty()) {
        return getNext(buffer3);
      }
      if (ended) {
        return { done: true };
      }
      return await new Promise((resolve8, reject) => {
        onNext = (next) => {
          onNext = null;
          buffer3.push(next);
          try {
            resolve8(getNext(buffer3));
          } catch (err) {
            reject(err);
          }
          return pushable2;
        };
      });
    } finally {
      if (buffer3.isEmpty()) {
        queueMicrotask(() => {
          drain.resolve();
          drain = pDefer();
        });
      }
    }
  };
  const bufferNext = (next) => {
    if (onNext != null) {
      return onNext(next);
    }
    buffer3.push(next);
    return pushable2;
  };
  const bufferError = (err) => {
    buffer3 = new FIFO();
    if (onNext != null) {
      return onNext({ error: err });
    }
    buffer3.push({ error: err });
    return pushable2;
  };
  const push = (value) => {
    if (ended) {
      return pushable2;
    }
    if (options?.objectMode !== true && value?.byteLength == null) {
      throw new Error("objectMode was not true but tried to push non-Uint8Array value");
    }
    return bufferNext({ done: false, value });
  };
  const end = (err) => {
    if (ended)
      return pushable2;
    ended = true;
    return err != null ? bufferError(err) : bufferNext({ done: true });
  };
  const _return = () => {
    buffer3 = new FIFO();
    end();
    return { done: true };
  };
  const _throw = (err) => {
    end(err);
    return { done: true };
  };
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
      return buffer3.size;
    },
    onEmpty: async (options2) => {
      const signal = options2?.signal;
      signal?.throwIfAborted();
      if (buffer3.isEmpty()) {
        return;
      }
      let cancel;
      let listener;
      if (signal != null) {
        cancel = new Promise((resolve8, reject) => {
          listener = () => {
            reject(new AbortError());
          };
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
    }
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
    onEmpty: (opts) => {
      return _pushable2.onEmpty(opts);
    }
  };
  return pushable2;
}

// node_modules/it-merge/dist/src/index.js
function isAsyncIterable7(thing) {
  return thing[Symbol.asyncIterator] != null;
}
function merge(...sources) {
  const syncSources = [];
  for (const source of sources) {
    if (!isAsyncIterable7(source)) {
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
    const output = pushable({
      objectMode: true
    });
    void Promise.resolve().then(async () => {
      try {
        await Promise.all(sources.map(async (source) => {
          for await (const item of source) {
            output.push(item);
          }
        }));
        output.end();
      } catch (err) {
        output.end(err);
      }
    });
    yield* output;
  }();
}
var src_default7 = merge;

// node_modules/it-pipe/dist/src/index.js
function pipe(first2, ...rest) {
  if (first2 == null) {
    throw new Error("Empty pipeline");
  }
  if (isDuplex(first2)) {
    const duplex = first2;
    first2 = () => duplex.source;
  } else if (isIterable2(first2) || isAsyncIterable8(first2)) {
    const source = first2;
    first2 = () => source;
  }
  const fns = [first2, ...rest];
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
var rawPipe = (...fns) => {
  let res;
  while (fns.length > 0) {
    res = fns.shift()(res);
  }
  return res;
};
var isAsyncIterable8 = (obj) => {
  return obj?.[Symbol.asyncIterator] != null;
};
var isIterable2 = (obj) => {
  return obj?.[Symbol.iterator] != null;
};
var isDuplex = (obj) => {
  if (obj == null) {
    return false;
  }
  return obj.sink != null && obj.source != null;
};
var duplexPipelineFn = (duplex) => {
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
      if (isAsyncIterable8(source2)) {
        sourceWrap = async function* () {
          yield* source2;
          stream.end();
        };
      } else if (isIterable2(source2)) {
        sourceWrap = function* () {
          yield* source2;
          stream.end();
        };
      } else {
        throw new Error("Unknown duplex source type - must be Iterable or AsyncIterable");
      }
      return src_default7(stream, sourceWrap());
    }
    return duplex.source;
  };
};

// node_modules/ipfs-unixfs-exporter/dist/src/resolvers/unixfs-v1/content/directory.js
var directoryContent = (cid, node, unixfs2, path, resolve8, depth, blockstore) => {
  async function* yieldDirectoryContent(options = {}) {
    const offset = options.offset ?? 0;
    const length11 = options.length ?? node.Links.length;
    const links = node.Links.slice(offset, length11);
    options.onProgress?.(new CustomProgressEvent("unixfs:exporter:walk:directory", {
      cid
    }));
    yield* pipe(links, (source) => src_default6(source, (link) => {
      return async () => {
        const linkName = link.Name ?? "";
        const linkPath = `${path}/${linkName}`;
        const result = await resolve8(link.Hash, linkName, linkPath, [], depth + 1, blockstore, options);
        return result.entry;
      };
    }), (source) => parallel(source, {
      ordered: true,
      concurrency: options.blockReadConcurrency
    }), (source) => src_default5(source, (entry) => entry != null));
  }
  return yieldDirectoryContent;
};
var directory_default = directoryContent;

// node_modules/ipfs-unixfs-exporter/dist/src/resolvers/unixfs-v1/content/file.js
var import_err_code10 = __toESM(require_err_code(), 1);

// node_modules/p-queue/node_modules/eventemitter3/index.mjs
var import_index4 = __toESM(require_eventemitter3(), 1);

// node_modules/p-timeout/index.js
var TimeoutError = class extends Error {
  constructor(message2) {
    super(message2);
    this.name = "TimeoutError";
  }
};
var AbortError2 = class extends Error {
  constructor(message2) {
    super();
    this.name = "AbortError";
    this.message = message2;
  }
};
var getDOMException = (errorMessage) => globalThis.DOMException === void 0 ? new AbortError2(errorMessage) : new DOMException(errorMessage);
var getAbortedReason = (signal) => {
  const reason = signal.reason === void 0 ? getDOMException("This operation was aborted.") : signal.reason;
  return reason instanceof Error ? reason : getDOMException(reason);
};
function pTimeout(promise, options) {
  const {
    milliseconds,
    fallback,
    message: message2,
    customTimers = { setTimeout, clearTimeout }
  } = options;
  let timer;
  const wrappedPromise = new Promise((resolve8, reject) => {
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
      promise.then(resolve8, reject);
      return;
    }
    const timeoutError = new TimeoutError();
    timer = customTimers.setTimeout.call(void 0, () => {
      if (fallback) {
        try {
          resolve8(fallback());
        } catch (error) {
          reject(error);
        }
        return;
      }
      if (typeof promise.cancel === "function") {
        promise.cancel();
      }
      if (message2 === false) {
        resolve8();
      } else if (message2 instanceof Error) {
        reject(message2);
      } else {
        timeoutError.message = message2 ?? `Promise timed out after ${milliseconds} milliseconds`;
        reject(timeoutError);
      }
    }, milliseconds);
    (async () => {
      try {
        resolve8(await promise);
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

// node_modules/p-queue/dist/lower-bound.js
function lowerBound(array, value, comparator) {
  let first2 = 0;
  let count = array.length;
  while (count > 0) {
    const step = Math.trunc(count / 2);
    let it = first2 + step;
    if (comparator(array[it], value) <= 0) {
      first2 = ++it;
      count -= step + 1;
    } else {
      count = step;
    }
  }
  return first2;
}

// node_modules/p-queue/dist/priority-queue.js
var PriorityQueue = class {
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
var PQueue = class extends import_index4.default {
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
      const delay = this.#intervalEnd - now;
      if (delay < 0) {
        this.#intervalCount = this.#carryoverConcurrencyCount ? this.#pending : 0;
      } else {
        if (this.#timeoutId === void 0) {
          this.#timeoutId = setTimeout(() => {
            this.#onResumeInterval();
          }, delay);
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
    return new Promise((resolve8, reject) => {
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
          resolve8(result);
          this.emit("completed", result);
        } catch (error) {
          if (error instanceof TimeoutError && !options.throwOnTimeout) {
            resolve8();
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
    return new Promise((resolve8) => {
      const listener = () => {
        if (filter2 && !filter2()) {
          return;
        }
        this.off(event, listener);
        resolve8();
      };
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

// node_modules/ipfs-unixfs-exporter/dist/src/resolvers/unixfs-v1/content/file.js
async function walkDAG(blockstore, node, queue, streamPosition, start, end, options) {
  if (node instanceof Uint8Array) {
    const buf3 = extract_data_from_block_default(node, streamPosition, start, end);
    queue.push(buf3);
    return;
  }
  if (node.Data == null) {
    throw (0, import_err_code10.default)(new Error("no data in PBNode"), "ERR_NOT_UNIXFS");
  }
  let file;
  try {
    file = UnixFS.unmarshal(node.Data);
  } catch (err) {
    throw (0, import_err_code10.default)(err, "ERR_NOT_UNIXFS");
  }
  if (file.data != null) {
    const data = file.data;
    const buf3 = extract_data_from_block_default(data, streamPosition, start, end);
    queue.push(buf3);
    streamPosition += BigInt(buf3.byteLength);
  }
  const childOps = [];
  if (node.Links.length !== file.blockSizes.length) {
    throw (0, import_err_code10.default)(new Error("Inconsistent block sizes and dag links"), "ERR_NOT_UNIXFS");
  }
  for (let i = 0; i < node.Links.length; i++) {
    const childLink = node.Links[i];
    const childStart = streamPosition;
    const childEnd = childStart + file.blockSizes[i];
    if (start >= childStart && start < childEnd || // child has offset byte
    end >= childStart && end <= childEnd || // child has end byte
    start < childStart && end > childEnd) {
      childOps.push({
        link: childLink,
        blockStart: streamPosition
      });
    }
    streamPosition = childEnd;
    if (streamPosition > end) {
      break;
    }
  }
  await pipe(childOps, (source) => src_default6(source, (op) => {
    return async () => {
      const block = await blockstore.get(op.link.Hash, options);
      return {
        ...op,
        block
      };
    };
  }), (source) => parallel(source, {
    ordered: true,
    concurrency: options.blockReadConcurrency
  }), async (source) => {
    for await (const { link, block, blockStart } of source) {
      let child;
      switch (link.Hash.code) {
        case code:
          child = decode5(block);
          break;
        case code9:
          child = block;
          break;
        default:
          queue.end((0, import_err_code10.default)(new Error(`Unsupported codec: ${link.Hash.code}`), "ERR_NOT_UNIXFS"));
          return;
      }
      const childQueue = new PQueue({
        concurrency: 1
      });
      childQueue.on("error", (error) => {
        queue.end(error);
      });
      void childQueue.add(async () => {
        options.onProgress?.(new CustomProgressEvent("unixfs:exporter:walk:file", {
          cid: link.Hash
        }));
        await walkDAG(blockstore, child, queue, blockStart, start, end, options);
      });
      await childQueue.onIdle();
    }
  });
  if (streamPosition >= end) {
    queue.end();
  }
}
var fileContent = (cid, node, unixfs2, path, resolve8, depth, blockstore) => {
  async function* yieldFileContent(options = {}) {
    const fileSize = unixfs2.fileSize();
    if (fileSize === void 0) {
      throw new Error("File was a directory");
    }
    const { start, end } = validate_offset_and_length_default(fileSize, options.offset, options.length);
    if (end === 0n) {
      return;
    }
    let read11 = 0n;
    const wanted = end - start;
    const queue = pushable();
    options.onProgress?.(new CustomProgressEvent("unixfs:exporter:walk:file", {
      cid
    }));
    void walkDAG(blockstore, node, queue, 0n, start, end, options).catch((err) => {
      queue.end(err);
    });
    for await (const buf3 of queue) {
      if (buf3 == null) {
        continue;
      }
      read11 += BigInt(buf3.byteLength);
      if (read11 > wanted) {
        queue.end();
        throw (0, import_err_code10.default)(new Error("Read too many bytes - the file size reported by the UnixFS data in the root node may be incorrect"), "ERR_OVER_READ");
      }
      if (read11 === wanted) {
        queue.end();
      }
      options.onProgress?.(new CustomProgressEvent("unixfs:exporter:progress:unixfs:file", {
        bytesRead: read11,
        totalBytes: wanted,
        fileSize
      }));
      yield buf3;
    }
    if (read11 < wanted) {
      throw (0, import_err_code10.default)(new Error("Traversed entire DAG but did not read enough bytes"), "ERR_UNDER_READ");
    }
  }
  return yieldFileContent;
};
var file_default = fileContent;

// node_modules/ipfs-unixfs-exporter/dist/src/resolvers/unixfs-v1/content/hamt-sharded-directory.js
var import_err_code11 = __toESM(require_err_code(), 1);
var hamtShardedDirectoryContent = (cid, node, unixfs2, path, resolve8, depth, blockstore) => {
  function yieldHamtDirectoryContent(options = {}) {
    options.onProgress?.(new CustomProgressEvent("unixfs:exporter:walk:hamt-sharded-directory", {
      cid
    }));
    return listDirectory(node, path, resolve8, depth, blockstore, options);
  }
  return yieldHamtDirectoryContent;
};
async function* listDirectory(node, path, resolve8, depth, blockstore, options) {
  const links = node.Links;
  if (node.Data == null) {
    throw (0, import_err_code11.default)(new Error("no data in PBNode"), "ERR_NOT_UNIXFS");
  }
  let dir;
  try {
    dir = UnixFS.unmarshal(node.Data);
  } catch (err) {
    throw (0, import_err_code11.default)(err, "ERR_NOT_UNIXFS");
  }
  if (dir.fanout == null) {
    throw (0, import_err_code11.default)(new Error("missing fanout"), "ERR_NOT_UNIXFS");
  }
  const padLength = (dir.fanout - 1n).toString(16).length;
  const results = pipe(links, (source) => src_default6(source, (link) => {
    return async () => {
      const name8 = link.Name != null ? link.Name.substring(padLength) : null;
      if (name8 != null && name8 !== "") {
        const result = await resolve8(link.Hash, name8, `${path}/${name8}`, [], depth + 1, blockstore, options);
        return { entries: result.entry == null ? [] : [result.entry] };
      } else {
        const block = await blockstore.get(link.Hash, options);
        node = decode5(block);
        options.onProgress?.(new CustomProgressEvent("unixfs:exporter:walk:hamt-sharded-directory", {
          cid: link.Hash
        }));
        return { entries: listDirectory(node, path, resolve8, depth, blockstore, options) };
      }
    };
  }), (source) => parallel(source, {
    ordered: true,
    concurrency: options.blockReadConcurrency
  }));
  for await (const { entries } of results) {
    yield* entries;
  }
}
var hamt_sharded_directory_default = hamtShardedDirectoryContent;

// node_modules/ipfs-unixfs-exporter/dist/src/resolvers/unixfs-v1/index.js
var findLinkCid = (node, name8) => {
  const link = node.Links.find((link2) => link2.Name === name8);
  return link?.Hash;
};
var contentExporters = {
  raw: file_default,
  file: file_default,
  directory: directory_default,
  "hamt-sharded-directory": hamt_sharded_directory_default,
  metadata: (cid, node, unixfs2, path, resolve8, depth, blockstore) => {
    return () => [];
  },
  symlink: (cid, node, unixfs2, path, resolve8, depth, blockstore) => {
    return () => [];
  }
};
var unixFsResolver = async (cid, name8, path, toResolve, resolve8, depth, blockstore, options) => {
  const block = await blockstore.get(cid, options);
  const node = decode5(block);
  let unixfs2;
  let next;
  if (name8 == null) {
    name8 = cid.toString();
  }
  if (node.Data == null) {
    throw (0, import_err_code12.default)(new Error("no data in PBNode"), "ERR_NOT_UNIXFS");
  }
  try {
    unixfs2 = UnixFS.unmarshal(node.Data);
  } catch (err) {
    throw (0, import_err_code12.default)(err, "ERR_NOT_UNIXFS");
  }
  if (path == null) {
    path = name8;
  }
  if (toResolve.length > 0) {
    let linkCid;
    if (unixfs2?.type === "hamt-sharded-directory") {
      linkCid = await find_cid_in_shard_default(node, toResolve[0], blockstore);
    } else {
      linkCid = findLinkCid(node, toResolve[0]);
    }
    if (linkCid == null) {
      throw (0, import_err_code12.default)(new Error("file does not exist"), "ERR_NOT_FOUND");
    }
    const nextName = toResolve.shift();
    const nextPath = `${path}/${nextName}`;
    next = {
      cid: linkCid,
      toResolve,
      name: nextName ?? "",
      path: nextPath
    };
  }
  const content = contentExporters[unixfs2.type](cid, node, unixfs2, path, resolve8, depth, blockstore);
  if (content == null) {
    throw (0, import_err_code12.default)(new Error("could not find content exporter"), "ERR_NOT_FOUND");
  }
  if (unixfs2.isDirectory()) {
    return {
      entry: {
        type: "directory",
        name: name8,
        path,
        cid,
        content,
        unixfs: unixfs2,
        depth,
        node,
        size: unixfs2.fileSize()
      },
      next
    };
  }
  return {
    entry: {
      type: "file",
      name: name8,
      path,
      cid,
      content,
      unixfs: unixfs2,
      depth,
      node,
      size: unixfs2.fileSize()
    },
    next
  };
};
var unixfs_v1_default = unixFsResolver;

// node_modules/ipfs-unixfs-exporter/dist/src/resolvers/index.js
var resolvers = {
  [code]: unixfs_v1_default,
  [code9]: raw_default,
  [code6]: dag_cbor_default,
  [code7]: dag_json_default,
  [identity7.code]: identity_default,
  [code8]: json_default
};
var resolve6 = async (cid, name8, path, toResolve, depth, blockstore, options) => {
  const resolver = resolvers[cid.code];
  if (resolver == null) {
    throw (0, import_err_code13.default)(new Error(`No resolver for code ${cid.code}`), "ERR_NO_RESOLVER");
  }
  return resolver(cid, name8, path, toResolve, resolve6, depth, blockstore, options);
};
var resolvers_default = resolve6;

// node_modules/ipfs-unixfs-exporter/dist/src/index.js
var toPathComponents2 = (path = "") => {
  return (path.trim().match(/([^\\^/]|\\\/)+/g) ?? []).filter(Boolean);
};
var cidAndRest = (path) => {
  if (path instanceof Uint8Array) {
    return {
      cid: CID6.decode(path),
      toResolve: []
    };
  }
  const cid = CID6.asCID(path);
  if (cid != null) {
    return {
      cid,
      toResolve: []
    };
  }
  if (typeof path === "string") {
    if (path.indexOf("/ipfs/") === 0) {
      path = path.substring(6);
    }
    const output = toPathComponents2(path);
    return {
      cid: CID6.parse(output[0]),
      toResolve: output.slice(1)
    };
  }
  throw (0, import_err_code14.default)(new Error(`Unknown path type ${path}`), "ERR_BAD_PATH");
};
async function* walkPath(path, blockstore, options = {}) {
  let { cid, toResolve } = cidAndRest(path);
  let name8 = cid.toString();
  let entryPath = name8;
  const startingDepth = toResolve.length;
  while (true) {
    const result = await resolvers_default(cid, name8, entryPath, toResolve, startingDepth, blockstore, options);
    if (result.entry == null && result.next == null) {
      throw (0, import_err_code14.default)(new Error(`Could not resolve ${path}`), "ERR_NOT_FOUND");
    }
    if (result.entry != null) {
      yield result.entry;
    }
    if (result.next == null) {
      return;
    }
    toResolve = result.next.toResolve;
    cid = result.next.cid;
    name8 = result.next.name;
    entryPath = result.next.path;
  }
}
async function exporter(path, blockstore, options = {}) {
  const result = await src_default3(walkPath(path, blockstore, options));
  if (result == null) {
    throw (0, import_err_code14.default)(new Error(`Could not resolve ${path}`), "ERR_NOT_FOUND");
  }
  return result;
}
async function* recursive(path, blockstore, options = {}) {
  const node = await exporter(path, blockstore, options);
  if (node == null) {
    return;
  }
  yield node;
  if (node.type === "directory") {
    for await (const child of recurse(node, options)) {
      yield child;
    }
  }
  async function* recurse(node2, options2) {
    for await (const file of node2.content(options2)) {
      yield file;
      if (file instanceof Uint8Array) {
        continue;
      }
      if (file.type === "directory") {
        yield* recurse(file, options2);
      }
    }
  }
}

// node_modules/merge-options/index.mjs
var import_index5 = __toESM(require_merge_options(), 1);
var merge_options_default = import_index5.default;

// node_modules/@helia/unixfs/dist/src/errors.js
var UnixFSError = class extends Error {
  name;
  code;
  constructor(message2, name8, code13) {
    super(message2);
    this.name = name8;
    this.code = code13;
  }
};
var NotUnixFSError = class extends UnixFSError {
  constructor(message2 = "not a Unixfs node") {
    super(message2, "NotUnixFSError", "ERR_NOT_UNIXFS");
  }
};
var InvalidPBNodeError = class extends UnixFSError {
  constructor(message2 = "invalid PBNode") {
    super(message2, "InvalidPBNodeError", "ERR_INVALID_PBNODE");
  }
};
var UnknownError = class extends UnixFSError {
  constructor(message2 = "unknown error") {
    super(message2, "InvalidPBNodeError", "ERR_UNKNOWN_ERROR");
  }
};
var AlreadyExistsError = class extends UnixFSError {
  constructor(message2 = "path already exists") {
    super(message2, "AlreadyExistsError", "ERR_ALREADY_EXISTS");
  }
};
var DoesNotExistError = class extends UnixFSError {
  constructor(message2 = "path does not exist") {
    super(message2, "DoesNotExistError", "ERR_DOES_NOT_EXIST");
  }
};
var NoContentError = class extends UnixFSError {
  constructor(message2 = "no content") {
    super(message2, "NoContentError", "ERR_NO_CONTENT");
  }
};
var NotAFileError = class extends UnixFSError {
  constructor(message2 = "not a file") {
    super(message2, "NotAFileError", "ERR_NOT_A_FILE");
  }
};
var NotADirectoryError = class extends UnixFSError {
  constructor(message2 = "not a directory") {
    super(message2, "NotADirectoryError", "ERR_NOT_A_DIRECTORY");
  }
};
var InvalidParametersError = class extends UnixFSError {
  constructor(message2 = "invalid parameters") {
    super(message2, "InvalidParametersError", "ERR_INVALID_PARAMETERS");
  }
};

// node_modules/@libp2p/logger/dist/src/index.js
var import_debug = __toESM(require_browser(), 1);

// node_modules/multiformats/src/bases/base32.js
var base32_exports4 = {};
__export(base32_exports4, {
  base32: () => base329,
  base32hex: () => base32hex9,
  base32hexpad: () => base32hexpad9,
  base32hexpadupper: () => base32hexpadupper9,
  base32hexupper: () => base32hexupper9,
  base32pad: () => base32pad9,
  base32padupper: () => base32padupper9,
  base32upper: () => base32upper9,
  base32z: () => base32z9
});

// node_modules/multiformats/vendor/base-x.js
function base11(ALPHABET, name8) {
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
  function encode33(source) {
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
    var length11 = 0;
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
      for (var it1 = size - 1; (carry !== 0 || i2 < length11) && it1 !== -1; it1--, i2++) {
        carry += 256 * b58[it1] >>> 0;
        b58[it1] = carry % BASE >>> 0;
        carry = carry / BASE >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length11 = i2;
      pbegin++;
    }
    var it2 = size - length11;
    while (it2 !== size && b58[it2] === 0) {
      it2++;
    }
    var str = LEADER.repeat(zeroes);
    for (; it2 < size; ++it2) {
      str += ALPHABET.charAt(b58[it2]);
    }
    return str;
  }
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
    var length11 = 0;
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
      for (var it3 = size - 1; (carry !== 0 || i2 < length11) && it3 !== -1; it3--, i2++) {
        carry += BASE * b256[it3] >>> 0;
        b256[it3] = carry % 256 >>> 0;
        carry = carry / 256 >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length11 = i2;
      psz++;
    }
    if (source[psz] === " ") {
      return;
    }
    var it4 = size - length11;
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
  function decode49(string5) {
    var buffer3 = decodeUnsafe(string5);
    if (buffer3) {
      return buffer3;
    }
    throw new Error(`Non-${name8} character`);
  }
  return {
    encode: encode33,
    decodeUnsafe,
    decode: decode49
  };
}
var src9 = base11;
var _brrp__multiformats_scope_baseX9 = src9;
var base_x_default9 = _brrp__multiformats_scope_baseX9;

// node_modules/multiformats/src/bytes.js
var empty9 = new Uint8Array(0);
var equals18 = (aa, bb) => {
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
};
var coerce9 = (o) => {
  if (o instanceof Uint8Array && o.constructor.name === "Uint8Array")
    return o;
  if (o instanceof ArrayBuffer)
    return new Uint8Array(o);
  if (ArrayBuffer.isView(o)) {
    return new Uint8Array(o.buffer, o.byteOffset, o.byteLength);
  }
  throw new Error("Unknown type, must be binary type");
};
var fromString10 = (str) => new TextEncoder().encode(str);
var toString7 = (b) => new TextDecoder().decode(b);

// node_modules/multiformats/src/bases/base.js
var Encoder9 = class {
  /**
   * @param {Base} name
   * @param {Prefix} prefix
   * @param {(bytes:Uint8Array) => string} baseEncode
   */
  constructor(name8, prefix, baseEncode) {
    this.name = name8;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {API.Multibase<Prefix>}
   */
  encode(bytes) {
    if (bytes instanceof Uint8Array) {
      return `${this.prefix}${this.baseEncode(bytes)}`;
    } else {
      throw Error("Unknown type, must be binary type");
    }
  }
};
var Decoder9 = class {
  /**
   * @param {Base} name
   * @param {Prefix} prefix
   * @param {(text:string) => Uint8Array} baseDecode
   */
  constructor(name8, prefix, baseDecode) {
    this.name = name8;
    this.prefix = prefix;
    if (prefix.codePointAt(0) === void 0) {
      throw new Error("Invalid prefix character");
    }
    this.prefixCodePoint = /** @type {number} */
    prefix.codePointAt(0);
    this.baseDecode = baseDecode;
  }
  /**
   * @param {string} text
   */
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
  /**
   * @template {string} OtherPrefix
   * @param {API.UnibaseDecoder<OtherPrefix>|ComposedDecoder<OtherPrefix>} decoder
   * @returns {ComposedDecoder<Prefix|OtherPrefix>}
   */
  or(decoder) {
    return or9(this, decoder);
  }
};
var ComposedDecoder9 = class {
  /**
   * @param {Decoders<Prefix>} decoders
   */
  constructor(decoders) {
    this.decoders = decoders;
  }
  /**
   * @template {string} OtherPrefix
   * @param {API.UnibaseDecoder<OtherPrefix>|ComposedDecoder<OtherPrefix>} decoder
   * @returns {ComposedDecoder<Prefix|OtherPrefix>}
   */
  or(decoder) {
    return or9(this, decoder);
  }
  /**
   * @param {string} input
   * @returns {Uint8Array}
   */
  decode(input) {
    const prefix = (
      /** @type {Prefix} */
      input[0]
    );
    const decoder = this.decoders[prefix];
    if (decoder) {
      return decoder.decode(input);
    } else {
      throw RangeError(`Unable to decode multibase string ${JSON.stringify(input)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
    }
  }
};
var or9 = (left, right) => new ComposedDecoder9(
  /** @type {Decoders<L|R>} */
  {
    ...left.decoders || { [
      /** @type API.UnibaseDecoder<L> */
      left.prefix
    ]: left },
    ...right.decoders || { [
      /** @type API.UnibaseDecoder<R> */
      right.prefix
    ]: right }
  }
);
var Codec9 = class {
  /**
   * @param {Base} name
   * @param {Prefix} prefix
   * @param {(bytes:Uint8Array) => string} baseEncode
   * @param {(text:string) => Uint8Array} baseDecode
   */
  constructor(name8, prefix, baseEncode, baseDecode) {
    this.name = name8;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
    this.baseDecode = baseDecode;
    this.encoder = new Encoder9(name8, prefix, baseEncode);
    this.decoder = new Decoder9(name8, prefix, baseDecode);
  }
  /**
   * @param {Uint8Array} input
   */
  encode(input) {
    return this.encoder.encode(input);
  }
  /**
   * @param {string} input
   */
  decode(input) {
    return this.decoder.decode(input);
  }
};
var from13 = ({ name: name8, prefix, encode: encode33, decode: decode49 }) => new Codec9(name8, prefix, encode33, decode49);
var baseX9 = ({ prefix, name: name8, alphabet: alphabet5 }) => {
  const { encode: encode33, decode: decode49 } = base_x_default9(alphabet5, name8);
  return from13({
    prefix,
    name: name8,
    encode: encode33,
    /**
     * @param {string} text
     */
    decode: (text) => coerce9(decode49(text))
  });
};
var decode44 = (string5, alphabet5, bitsPerChar, name8) => {
  const codes = {};
  for (let i = 0; i < alphabet5.length; ++i) {
    codes[alphabet5[i]] = i;
  }
  let end = string5.length;
  while (string5[end - 1] === "=") {
    --end;
  }
  const out = new Uint8Array(end * bitsPerChar / 8 | 0);
  let bits = 0;
  let buffer3 = 0;
  let written = 0;
  for (let i = 0; i < end; ++i) {
    const value = codes[string5[i]];
    if (value === void 0) {
      throw new SyntaxError(`Non-${name8} character`);
    }
    buffer3 = buffer3 << bitsPerChar | value;
    bits += bitsPerChar;
    if (bits >= 8) {
      bits -= 8;
      out[written++] = 255 & buffer3 >> bits;
    }
  }
  if (bits >= bitsPerChar || 255 & buffer3 << 8 - bits) {
    throw new SyntaxError("Unexpected end of data");
  }
  return out;
};
var encode29 = (data, alphabet5, bitsPerChar) => {
  const pad = alphabet5[alphabet5.length - 1] === "=";
  const mask = (1 << bitsPerChar) - 1;
  let out = "";
  let bits = 0;
  let buffer3 = 0;
  for (let i = 0; i < data.length; ++i) {
    buffer3 = buffer3 << 8 | data[i];
    bits += 8;
    while (bits > bitsPerChar) {
      bits -= bitsPerChar;
      out += alphabet5[mask & buffer3 >> bits];
    }
  }
  if (bits) {
    out += alphabet5[mask & buffer3 << bitsPerChar - bits];
  }
  if (pad) {
    while (out.length * bitsPerChar & 7) {
      out += "=";
    }
  }
  return out;
};
var rfc46489 = ({ name: name8, prefix, bitsPerChar, alphabet: alphabet5 }) => {
  return from13({
    prefix,
    name: name8,
    encode(input) {
      return encode29(input, alphabet5, bitsPerChar);
    },
    decode(input) {
      return decode44(input, alphabet5, bitsPerChar, name8);
    }
  });
};

// node_modules/multiformats/src/bases/base32.js
var base329 = rfc46489({
  prefix: "b",
  name: "base32",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567",
  bitsPerChar: 5
});
var base32upper9 = rfc46489({
  prefix: "B",
  name: "base32upper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
  bitsPerChar: 5
});
var base32pad9 = rfc46489({
  prefix: "c",
  name: "base32pad",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
  bitsPerChar: 5
});
var base32padupper9 = rfc46489({
  prefix: "C",
  name: "base32padupper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
  bitsPerChar: 5
});
var base32hex9 = rfc46489({
  prefix: "v",
  name: "base32hex",
  alphabet: "0123456789abcdefghijklmnopqrstuv",
  bitsPerChar: 5
});
var base32hexupper9 = rfc46489({
  prefix: "V",
  name: "base32hexupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
  bitsPerChar: 5
});
var base32hexpad9 = rfc46489({
  prefix: "t",
  name: "base32hexpad",
  alphabet: "0123456789abcdefghijklmnopqrstuv=",
  bitsPerChar: 5
});
var base32hexpadupper9 = rfc46489({
  prefix: "T",
  name: "base32hexpadupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
  bitsPerChar: 5
});
var base32z9 = rfc46489({
  prefix: "h",
  name: "base32z",
  alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
  bitsPerChar: 5
});

// node_modules/multiformats/src/bases/base58.js
var base58_exports4 = {};
__export(base58_exports4, {
  base58btc: () => base58btc9,
  base58flickr: () => base58flickr9
});
var base58btc9 = baseX9({
  name: "base58btc",
  prefix: "z",
  alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
});
var base58flickr9 = baseX9({
  name: "base58flickr",
  prefix: "Z",
  alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
});

// node_modules/multiformats/src/bases/base64.js
var base64_exports4 = {};
__export(base64_exports4, {
  base64: () => base645,
  base64pad: () => base64pad5,
  base64url: () => base64url5,
  base64urlpad: () => base64urlpad5
});
var base645 = rfc46489({
  prefix: "m",
  name: "base64",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
  bitsPerChar: 6
});
var base64pad5 = rfc46489({
  prefix: "M",
  name: "base64pad",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  bitsPerChar: 6
});
var base64url5 = rfc46489({
  prefix: "u",
  name: "base64url",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
  bitsPerChar: 6
});
var base64urlpad5 = rfc46489({
  prefix: "U",
  name: "base64urlpad",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
  bitsPerChar: 6
});

// node_modules/@libp2p/logger/dist/src/index.js
import_debug.default.formatters.b = (v) => {
  return v == null ? "undefined" : base58btc9.baseEncode(v);
};
import_debug.default.formatters.t = (v) => {
  return v == null ? "undefined" : base329.baseEncode(v);
};
import_debug.default.formatters.m = (v) => {
  return v == null ? "undefined" : base645.baseEncode(v);
};
import_debug.default.formatters.p = (v) => {
  return v == null ? "undefined" : v.toString();
};
import_debug.default.formatters.c = (v) => {
  return v == null ? "undefined" : v.toString();
};
import_debug.default.formatters.k = (v) => {
  return v == null ? "undefined" : v.toString();
};
import_debug.default.formatters.a = (v) => {
  return v == null ? "undefined" : v.toString();
};
function createDisabledLogger(namespace) {
  const logger2 = () => {
  };
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
function logger(name8) {
  let trace = createDisabledLogger(`${name8}:trace`);
  if (import_debug.default.enabled(`${name8}:trace`) && import_debug.default.names.map((r) => r.toString()).find((n) => n.includes(":trace")) != null) {
    trace = (0, import_debug.default)(`${name8}:trace`);
  }
  return Object.assign((0, import_debug.default)(name8), {
    error: (0, import_debug.default)(`${name8}:error`),
    trace
  });
}

// node_modules/multiformats/vendor/varint.js
var encode_19 = encode30;
var MSB10 = 128;
var REST10 = 127;
var MSBALL9 = ~REST10;
var INT9 = Math.pow(2, 31);
function encode30(num, out, offset) {
  out = out || [];
  offset = offset || 0;
  var oldOffset = offset;
  while (num >= INT9) {
    out[offset++] = num & 255 | MSB10;
    num /= 128;
  }
  while (num & MSBALL9) {
    out[offset++] = num & 255 | MSB10;
    num >>>= 7;
  }
  out[offset] = num | 0;
  encode30.bytes = offset - oldOffset + 1;
  return out;
}
var decode45 = read10;
var MSB$19 = 128;
var REST$19 = 127;
function read10(buf3, offset) {
  var res = 0, offset = offset || 0, shift = 0, counter = offset, b, l = buf3.length;
  do {
    if (counter >= l) {
      read10.bytes = 0;
      throw new RangeError("Could not decode varint");
    }
    b = buf3[counter++];
    res += shift < 28 ? (b & REST$19) << shift : (b & REST$19) * Math.pow(2, shift);
    shift += 7;
  } while (b >= MSB$19);
  read10.bytes = counter - offset;
  return res;
}
var N110 = Math.pow(2, 7);
var N210 = Math.pow(2, 14);
var N310 = Math.pow(2, 21);
var N410 = Math.pow(2, 28);
var N510 = Math.pow(2, 35);
var N610 = Math.pow(2, 42);
var N710 = Math.pow(2, 49);
var N89 = Math.pow(2, 56);
var N99 = Math.pow(2, 63);
var length10 = function(value) {
  return value < N110 ? 1 : value < N210 ? 2 : value < N310 ? 3 : value < N410 ? 4 : value < N510 ? 5 : value < N610 ? 6 : value < N710 ? 7 : value < N89 ? 8 : value < N99 ? 9 : 10;
};
var varint9 = {
  encode: encode_19,
  decode: decode45,
  encodingLength: length10
};
var _brrp_varint9 = varint9;
var varint_default9 = _brrp_varint9;

// node_modules/multiformats/src/varint.js
var decode46 = (data, offset = 0) => {
  const code13 = varint_default9.decode(data, offset);
  return [code13, varint_default9.decode.bytes];
};
var encodeTo9 = (int, target, offset = 0) => {
  varint_default9.encode(int, target, offset);
  return target;
};
var encodingLength10 = (int) => {
  return varint_default9.encodingLength(int);
};

// node_modules/multiformats/src/hashes/digest.js
var create9 = (code13, digest6) => {
  const size = digest6.byteLength;
  const sizeOffset = encodingLength10(code13);
  const digestOffset = sizeOffset + encodingLength10(size);
  const bytes = new Uint8Array(digestOffset + size);
  encodeTo9(code13, bytes, 0);
  encodeTo9(size, bytes, sizeOffset);
  bytes.set(digest6, digestOffset);
  return new Digest9(code13, size, digest6, bytes);
};
var decode47 = (multihash) => {
  const bytes = coerce9(multihash);
  const [code13, sizeOffset] = decode46(bytes);
  const [size, digestOffset] = decode46(bytes.subarray(sizeOffset));
  const digest6 = bytes.subarray(sizeOffset + digestOffset);
  if (digest6.byteLength !== size) {
    throw new Error("Incorrect length");
  }
  return new Digest9(code13, size, digest6, bytes);
};
var equals19 = (a, b) => {
  if (a === b) {
    return true;
  } else {
    const data = (
      /** @type {{code?:unknown, size?:unknown, bytes?:unknown}} */
      b
    );
    return a.code === data.code && a.size === data.size && data.bytes instanceof Uint8Array && equals18(a.bytes, data.bytes);
  }
};
var Digest9 = class {
  /**
   * Creates a multihash digest.
   *
   * @param {Code} code
   * @param {Size} size
   * @param {Uint8Array} digest
   * @param {Uint8Array} bytes
   */
  constructor(code13, size, digest6, bytes) {
    this.code = code13;
    this.size = size;
    this.digest = digest6;
    this.bytes = bytes;
  }
};

// node_modules/multiformats/src/cid.js
var format9 = (link, base12) => {
  const { bytes, version } = link;
  switch (version) {
    case 0:
      return toStringV09(
        bytes,
        baseCache9(link),
        /** @type {API.MultibaseEncoder<"z">} */
        base12 || base58btc9.encoder
      );
    default:
      return toStringV19(
        bytes,
        baseCache9(link),
        /** @type {API.MultibaseEncoder<Prefix>} */
        base12 || base329.encoder
      );
  }
};
var cache9 = /* @__PURE__ */ new WeakMap();
var baseCache9 = (cid) => {
  const baseCache10 = cache9.get(cid);
  if (baseCache10 == null) {
    const baseCache11 = /* @__PURE__ */ new Map();
    cache9.set(cid, baseCache11);
    return baseCache11;
  }
  return baseCache10;
};
var CID9 = class _CID {
  /**
   * @param {Version} version - Version of the CID
   * @param {Format} code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
   * @param {API.MultihashDigest<Alg>} multihash - (Multi)hash of the of the content.
   * @param {Uint8Array} bytes
   */
  constructor(version, code13, multihash, bytes) {
    this.code = code13;
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
  /**
   * @returns {CID<Data, API.DAG_PB, API.SHA_256, 0>}
   */
  toV0() {
    switch (this.version) {
      case 0: {
        return (
          /** @type {CID<Data, API.DAG_PB, API.SHA_256, 0>} */
          this
        );
      }
      case 1: {
        const { code: code13, multihash } = this;
        if (code13 !== DAG_PB_CODE9) {
          throw new Error("Cannot convert a non dag-pb CID to CIDv0");
        }
        if (multihash.code !== SHA_256_CODE9) {
          throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");
        }
        return (
          /** @type {CID<Data, API.DAG_PB, API.SHA_256, 0>} */
          _CID.createV0(
            /** @type {API.MultihashDigest<API.SHA_256>} */
            multihash
          )
        );
      }
      default: {
        throw Error(
          `Can not convert CID version ${this.version} to version 0. This is a bug please report`
        );
      }
    }
  }
  /**
   * @returns {CID<Data, Format, Alg, 1>}
   */
  toV1() {
    switch (this.version) {
      case 0: {
        const { code: code13, digest: digest6 } = this.multihash;
        const multihash = create9(code13, digest6);
        return (
          /** @type {CID<Data, Format, Alg, 1>} */
          _CID.createV1(this.code, multihash)
        );
      }
      case 1: {
        return (
          /** @type {CID<Data, Format, Alg, 1>} */
          this
        );
      }
      default: {
        throw Error(
          `Can not convert CID version ${this.version} to version 1. This is a bug please report`
        );
      }
    }
  }
  /**
   * @param {unknown} other
   * @returns {other is CID<Data, Format, Alg, Version>}
   */
  equals(other) {
    return _CID.equals(this, other);
  }
  /**
   * @template {unknown} Data
   * @template {number} Format
   * @template {number} Alg
   * @template {API.Version} Version
   * @param {API.Link<Data, Format, Alg, Version>} self
   * @param {unknown} other
   * @returns {other is CID}
   */
  static equals(self, other) {
    const unknown = (
      /** @type {{code?:unknown, version?:unknown, multihash?:unknown}} */
      other
    );
    return unknown && self.code === unknown.code && self.version === unknown.version && equals19(self.multihash, unknown.multihash);
  }
  /**
   * @param {API.MultibaseEncoder<string>} [base]
   * @returns {string}
   */
  toString(base12) {
    return format9(this, base12);
  }
  /**
   * @returns {API.LinkJSON<this>}
   */
  toJSON() {
    return { "/": format9(this) };
  }
  link() {
    return this;
  }
  get [Symbol.toStringTag]() {
    return "CID";
  }
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
   *
   * @template {unknown} Data
   * @template {number} Format
   * @template {number} Alg
   * @template {API.Version} Version
   * @template {unknown} U
   * @param {API.Link<Data, Format, Alg, Version>|U} input
   * @returns {CID<Data, Format, Alg, Version>|null}
   */
  static asCID(input) {
    if (input == null) {
      return null;
    }
    const value = (
      /** @type {any} */
      input
    );
    if (value instanceof _CID) {
      return value;
    } else if (value["/"] != null && value["/"] === value.bytes || value.asCID === value) {
      const { version, code: code13, multihash, bytes } = value;
      return new _CID(
        version,
        code13,
        /** @type {API.MultihashDigest<Alg>} */
        multihash,
        bytes || encodeCID9(version, code13, multihash.bytes)
      );
    } else if (value[cidSymbol9] === true) {
      const { version, multihash, code: code13 } = value;
      const digest6 = (
        /** @type {API.MultihashDigest<Alg>} */
        decode47(multihash)
      );
      return _CID.create(version, code13, digest6);
    } else {
      return null;
    }
  }
  /**
   *
   * @template {unknown} Data
   * @template {number} Format
   * @template {number} Alg
   * @template {API.Version} Version
   * @param {Version} version - Version of the CID
   * @param {Format} code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
   * @param {API.MultihashDigest<Alg>} digest - (Multi)hash of the of the content.
   * @returns {CID<Data, Format, Alg, Version>}
   */
  static create(version, code13, digest6) {
    if (typeof code13 !== "number") {
      throw new Error("String codecs are no longer supported");
    }
    if (!(digest6.bytes instanceof Uint8Array)) {
      throw new Error("Invalid digest");
    }
    switch (version) {
      case 0: {
        if (code13 !== DAG_PB_CODE9) {
          throw new Error(
            `Version 0 CID must use dag-pb (code: ${DAG_PB_CODE9}) block encoding`
          );
        } else {
          return new _CID(version, code13, digest6, digest6.bytes);
        }
      }
      case 1: {
        const bytes = encodeCID9(version, code13, digest6.bytes);
        return new _CID(version, code13, digest6, bytes);
      }
      default: {
        throw new Error("Invalid version");
      }
    }
  }
  /**
   * Simplified version of `create` for CIDv0.
   *
   * @template {unknown} [T=unknown]
   * @param {API.MultihashDigest<typeof SHA_256_CODE>} digest - Multihash.
   * @returns {CID<T, typeof DAG_PB_CODE, typeof SHA_256_CODE, 0>}
   */
  static createV0(digest6) {
    return _CID.create(0, DAG_PB_CODE9, digest6);
  }
  /**
   * Simplified version of `create` for CIDv1.
   *
   * @template {unknown} Data
   * @template {number} Code
   * @template {number} Alg
   * @param {Code} code - Content encoding format code.
   * @param {API.MultihashDigest<Alg>} digest - Miltihash of the content.
   * @returns {CID<Data, Code, Alg, 1>}
   */
  static createV1(code13, digest6) {
    return _CID.create(1, code13, digest6);
  }
  /**
   * Decoded a CID from its binary representation. The byte array must contain
   * only the CID with no additional bytes.
   *
   * An error will be thrown if the bytes provided do not contain a valid
   * binary representation of a CID.
   *
   * @template {unknown} Data
   * @template {number} Code
   * @template {number} Alg
   * @template {API.Version} Ver
   * @param {API.ByteView<API.Link<Data, Code, Alg, Ver>>} bytes
   * @returns {CID<Data, Code, Alg, Ver>}
   */
  static decode(bytes) {
    const [cid, remainder] = _CID.decodeFirst(bytes);
    if (remainder.length) {
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
   *
   * @template {unknown} T
   * @template {number} C
   * @template {number} A
   * @template {API.Version} V
   * @param {API.ByteView<API.Link<T, C, A, V>>} bytes
   * @returns {[CID<T, C, A, V>, Uint8Array]}
   */
  static decodeFirst(bytes) {
    const specs = _CID.inspectBytes(bytes);
    const prefixSize = specs.size - specs.multihashSize;
    const multihashBytes = coerce9(
      bytes.subarray(prefixSize, prefixSize + specs.multihashSize)
    );
    if (multihashBytes.byteLength !== specs.multihashSize) {
      throw new Error("Incorrect length");
    }
    const digestBytes = multihashBytes.subarray(
      specs.multihashSize - specs.digestSize
    );
    const digest6 = new Digest9(
      specs.multihashCode,
      specs.digestSize,
      digestBytes,
      multihashBytes
    );
    const cid = specs.version === 0 ? _CID.createV0(
      /** @type {API.MultihashDigest<API.SHA_256>} */
      digest6
    ) : _CID.createV1(specs.codec, digest6);
    return [
      /** @type {CID<T, C, A, V>} */
      cid,
      bytes.subarray(specs.size)
    ];
  }
  /**
   * Inspect the initial bytes of a CID to determine its properties.
   *
   * Involves decoding up to 4 varints. Typically this will require only 4 to 6
   * bytes but for larger multicodec code values and larger multihash digest
   * lengths these varints can be quite large. It is recommended that at least
   * 10 bytes be made available in the `initialBytes` argument for a complete
   * inspection.
   *
   * @template {unknown} T
   * @template {number} C
   * @template {number} A
   * @template {API.Version} V
   * @param {API.ByteView<API.Link<T, C, A, V>>} initialBytes
   * @returns {{ version:V, codec:C, multihashCode:A, digestSize:number, multihashSize:number, size:number }}
   */
  static inspectBytes(initialBytes) {
    let offset = 0;
    const next = () => {
      const [i, length11] = decode46(initialBytes.subarray(offset));
      offset += length11;
      return i;
    };
    let version = (
      /** @type {V} */
      next()
    );
    let codec = (
      /** @type {C} */
      DAG_PB_CODE9
    );
    if (
      /** @type {number} */
      version === 18
    ) {
      version = /** @type {V} */
      0;
      offset = 0;
    } else {
      codec = /** @type {C} */
      next();
    }
    if (version !== 0 && version !== 1) {
      throw new RangeError(`Invalid CID version ${version}`);
    }
    const prefixSize = offset;
    const multihashCode = (
      /** @type {A} */
      next()
    );
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
   *
   * @template {string} Prefix
   * @template {unknown} Data
   * @template {number} Code
   * @template {number} Alg
   * @template {API.Version} Ver
   * @param {API.ToString<API.Link<Data, Code, Alg, Ver>, Prefix>} source
   * @param {API.MultibaseDecoder<Prefix>} [base]
   * @returns {CID<Data, Code, Alg, Ver>}
   */
  static parse(source, base12) {
    const [prefix, bytes] = parseCIDtoBytes9(source, base12);
    const cid = _CID.decode(bytes);
    if (cid.version === 0 && source[0] !== "Q") {
      throw Error("Version 0 CID string must not include multibase prefix");
    }
    baseCache9(cid).set(prefix, source);
    return cid;
  }
};
var parseCIDtoBytes9 = (source, base12) => {
  switch (source[0]) {
    case "Q": {
      const decoder = base12 || base58btc9;
      return [
        /** @type {Prefix} */
        base58btc9.prefix,
        decoder.decode(`${base58btc9.prefix}${source}`)
      ];
    }
    case base58btc9.prefix: {
      const decoder = base12 || base58btc9;
      return [
        /** @type {Prefix} */
        base58btc9.prefix,
        decoder.decode(source)
      ];
    }
    case base329.prefix: {
      const decoder = base12 || base329;
      return [
        /** @type {Prefix} */
        base329.prefix,
        decoder.decode(source)
      ];
    }
    default: {
      if (base12 == null) {
        throw Error(
          "To parse non base32 or base58btc encoded CID multibase decoder must be provided"
        );
      }
      return [
        /** @type {Prefix} */
        source[0],
        base12.decode(source)
      ];
    }
  }
};
var toStringV09 = (bytes, cache10, base12) => {
  const { prefix } = base12;
  if (prefix !== base58btc9.prefix) {
    throw Error(`Cannot string encode V0 in ${base12.name} encoding`);
  }
  const cid = cache10.get(prefix);
  if (cid == null) {
    const cid2 = base12.encode(bytes).slice(1);
    cache10.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
};
var toStringV19 = (bytes, cache10, base12) => {
  const { prefix } = base12;
  const cid = cache10.get(prefix);
  if (cid == null) {
    const cid2 = base12.encode(bytes);
    cache10.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
};
var DAG_PB_CODE9 = 112;
var SHA_256_CODE9 = 18;
var encodeCID9 = (version, code13, multihash) => {
  const codeOffset = encodingLength10(version);
  const hashOffset = codeOffset + encodingLength10(code13);
  const bytes = new Uint8Array(hashOffset + multihash.byteLength);
  encodeTo9(version, bytes, 0);
  encodeTo9(code13, bytes, codeOffset);
  bytes.set(multihash, hashOffset);
  return bytes;
};
var cidSymbol9 = Symbol.for("@ipld/js-cid/CID");

// node_modules/multiformats/src/hashes/sha2-browser.js
var sha2_browser_exports4 = {};
__export(sha2_browser_exports4, {
  sha256: () => sha2564,
  sha512: () => sha5124
});

// node_modules/multiformats/src/hashes/hasher.js
var from14 = ({ name: name8, code: code13, encode: encode33 }) => new Hasher5(name8, code13, encode33);
var Hasher5 = class {
  /**
   *
   * @param {Name} name
   * @param {Code} code
   * @param {(input: Uint8Array) => Await<Uint8Array>} encode
   */
  constructor(name8, code13, encode33) {
    this.name = name8;
    this.code = code13;
    this.encode = encode33;
  }
  /**
   * @param {Uint8Array} input
   * @returns {Await<Digest.Digest<Code, number>>}
   */
  digest(input) {
    if (input instanceof Uint8Array) {
      const result = this.encode(input);
      return result instanceof Uint8Array ? create9(this.code, result) : result.then((digest6) => create9(this.code, digest6));
    } else {
      throw Error("Unknown type, must be binary type");
    }
  }
};

// node_modules/multiformats/src/hashes/sha2-browser.js
var sha4 = (name8) => (
  /**
   * @param {Uint8Array} data
   */
  async (data) => new Uint8Array(await crypto.subtle.digest(name8, data))
);
var sha2564 = from14({
  name: "sha2-256",
  code: 18,
  encode: sha4("SHA-256")
});
var sha5124 = from14({
  name: "sha2-512",
  code: 19,
  encode: sha4("SHA-512")
});

// node_modules/@helia/unixfs/dist/src/commands/utils/add-link.js
var import_sparse_array3 = __toESM(require_sparse_array(), 1);

// node_modules/uint8arrays/dist/src/util/as-uint8array.js
function asUint8Array3(buf3) {
  if (globalThis.Buffer != null) {
    return new Uint8Array(buf3.buffer, buf3.byteOffset, buf3.byteLength);
  }
  return buf3;
}

// node_modules/multiformats/src/bases/base10.js
var base10_exports4 = {};
__export(base10_exports4, {
  base10: () => base104
});
var base104 = baseX9({
  prefix: "9",
  name: "base10",
  alphabet: "0123456789"
});

// node_modules/multiformats/src/bases/base16.js
var base16_exports4 = {};
__export(base16_exports4, {
  base16: () => base164,
  base16upper: () => base16upper4
});
var base164 = rfc46489({
  prefix: "f",
  name: "base16",
  alphabet: "0123456789abcdef",
  bitsPerChar: 4
});
var base16upper4 = rfc46489({
  prefix: "F",
  name: "base16upper",
  alphabet: "0123456789ABCDEF",
  bitsPerChar: 4
});

// node_modules/multiformats/src/bases/base2.js
var base2_exports4 = {};
__export(base2_exports4, {
  base2: () => base25
});
var base25 = rfc46489({
  prefix: "0",
  name: "base2",
  alphabet: "01",
  bitsPerChar: 1
});

// node_modules/multiformats/src/bases/base256emoji.js
var base256emoji_exports4 = {};
__export(base256emoji_exports4, {
  base256emoji: () => base256emoji4
});
var alphabet4 = Array.from("\u{1F680}\u{1FA90}\u2604\u{1F6F0}\u{1F30C}\u{1F311}\u{1F312}\u{1F313}\u{1F314}\u{1F315}\u{1F316}\u{1F317}\u{1F318}\u{1F30D}\u{1F30F}\u{1F30E}\u{1F409}\u2600\u{1F4BB}\u{1F5A5}\u{1F4BE}\u{1F4BF}\u{1F602}\u2764\u{1F60D}\u{1F923}\u{1F60A}\u{1F64F}\u{1F495}\u{1F62D}\u{1F618}\u{1F44D}\u{1F605}\u{1F44F}\u{1F601}\u{1F525}\u{1F970}\u{1F494}\u{1F496}\u{1F499}\u{1F622}\u{1F914}\u{1F606}\u{1F644}\u{1F4AA}\u{1F609}\u263A\u{1F44C}\u{1F917}\u{1F49C}\u{1F614}\u{1F60E}\u{1F607}\u{1F339}\u{1F926}\u{1F389}\u{1F49E}\u270C\u2728\u{1F937}\u{1F631}\u{1F60C}\u{1F338}\u{1F64C}\u{1F60B}\u{1F497}\u{1F49A}\u{1F60F}\u{1F49B}\u{1F642}\u{1F493}\u{1F929}\u{1F604}\u{1F600}\u{1F5A4}\u{1F603}\u{1F4AF}\u{1F648}\u{1F447}\u{1F3B6}\u{1F612}\u{1F92D}\u2763\u{1F61C}\u{1F48B}\u{1F440}\u{1F62A}\u{1F611}\u{1F4A5}\u{1F64B}\u{1F61E}\u{1F629}\u{1F621}\u{1F92A}\u{1F44A}\u{1F973}\u{1F625}\u{1F924}\u{1F449}\u{1F483}\u{1F633}\u270B\u{1F61A}\u{1F61D}\u{1F634}\u{1F31F}\u{1F62C}\u{1F643}\u{1F340}\u{1F337}\u{1F63B}\u{1F613}\u2B50\u2705\u{1F97A}\u{1F308}\u{1F608}\u{1F918}\u{1F4A6}\u2714\u{1F623}\u{1F3C3}\u{1F490}\u2639\u{1F38A}\u{1F498}\u{1F620}\u261D\u{1F615}\u{1F33A}\u{1F382}\u{1F33B}\u{1F610}\u{1F595}\u{1F49D}\u{1F64A}\u{1F639}\u{1F5E3}\u{1F4AB}\u{1F480}\u{1F451}\u{1F3B5}\u{1F91E}\u{1F61B}\u{1F534}\u{1F624}\u{1F33C}\u{1F62B}\u26BD\u{1F919}\u2615\u{1F3C6}\u{1F92B}\u{1F448}\u{1F62E}\u{1F646}\u{1F37B}\u{1F343}\u{1F436}\u{1F481}\u{1F632}\u{1F33F}\u{1F9E1}\u{1F381}\u26A1\u{1F31E}\u{1F388}\u274C\u270A\u{1F44B}\u{1F630}\u{1F928}\u{1F636}\u{1F91D}\u{1F6B6}\u{1F4B0}\u{1F353}\u{1F4A2}\u{1F91F}\u{1F641}\u{1F6A8}\u{1F4A8}\u{1F92C}\u2708\u{1F380}\u{1F37A}\u{1F913}\u{1F619}\u{1F49F}\u{1F331}\u{1F616}\u{1F476}\u{1F974}\u25B6\u27A1\u2753\u{1F48E}\u{1F4B8}\u2B07\u{1F628}\u{1F31A}\u{1F98B}\u{1F637}\u{1F57A}\u26A0\u{1F645}\u{1F61F}\u{1F635}\u{1F44E}\u{1F932}\u{1F920}\u{1F927}\u{1F4CC}\u{1F535}\u{1F485}\u{1F9D0}\u{1F43E}\u{1F352}\u{1F617}\u{1F911}\u{1F30A}\u{1F92F}\u{1F437}\u260E\u{1F4A7}\u{1F62F}\u{1F486}\u{1F446}\u{1F3A4}\u{1F647}\u{1F351}\u2744\u{1F334}\u{1F4A3}\u{1F438}\u{1F48C}\u{1F4CD}\u{1F940}\u{1F922}\u{1F445}\u{1F4A1}\u{1F4A9}\u{1F450}\u{1F4F8}\u{1F47B}\u{1F910}\u{1F92E}\u{1F3BC}\u{1F975}\u{1F6A9}\u{1F34E}\u{1F34A}\u{1F47C}\u{1F48D}\u{1F4E3}\u{1F942}");
var alphabetBytesToChars4 = (
  /** @type {string[]} */
  alphabet4.reduce(
    (p, c, i) => {
      p[i] = c;
      return p;
    },
    /** @type {string[]} */
    []
  )
);
var alphabetCharsToBytes4 = (
  /** @type {number[]} */
  alphabet4.reduce(
    (p, c, i) => {
      p[
        /** @type {number} */
        c.codePointAt(0)
      ] = i;
      return p;
    },
    /** @type {number[]} */
    []
  )
);
function encode31(data) {
  return data.reduce((p, c) => {
    p += alphabetBytesToChars4[c];
    return p;
  }, "");
}
function decode48(str) {
  const byts = [];
  for (const char of str) {
    const byt = alphabetCharsToBytes4[
      /** @type {number} */
      char.codePointAt(0)
    ];
    if (byt === void 0) {
      throw new Error(`Non-base256emoji character: ${char}`);
    }
    byts.push(byt);
  }
  return new Uint8Array(byts);
}
var base256emoji4 = from13({
  prefix: "\u{1F680}",
  name: "base256emoji",
  encode: encode31,
  decode: decode48
});

// node_modules/multiformats/src/bases/base36.js
var base36_exports4 = {};
__export(base36_exports4, {
  base36: () => base364,
  base36upper: () => base36upper4
});
var base364 = baseX9({
  prefix: "k",
  name: "base36",
  alphabet: "0123456789abcdefghijklmnopqrstuvwxyz"
});
var base36upper4 = baseX9({
  prefix: "K",
  name: "base36upper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
});

// node_modules/multiformats/src/bases/base8.js
var base8_exports4 = {};
__export(base8_exports4, {
  base8: () => base84
});
var base84 = rfc46489({
  prefix: "7",
  name: "base8",
  alphabet: "01234567",
  bitsPerChar: 3
});

// node_modules/multiformats/src/bases/identity.js
var identity_exports7 = {};
__export(identity_exports7, {
  identity: () => identity8
});
var identity8 = from13({
  prefix: "\0",
  name: "identity",
  encode: (buf3) => toString7(buf3),
  decode: (str) => fromString10(str)
});

// node_modules/multiformats/src/codecs/json.js
var textEncoder9 = new TextEncoder();
var textDecoder8 = new TextDecoder();

// node_modules/multiformats/src/codecs/raw.js
var code11 = 85;

// node_modules/multiformats/src/hashes/identity.js
var identity_exports8 = {};
__export(identity_exports8, {
  identity: () => identity9
});
var code12 = 0;
var name7 = "identity";
var encode32 = coerce9;
var digest5 = (input) => create9(code12, encode32(input));
var identity9 = { code: code12, name: name7, encode: encode32, digest: digest5 };

// node_modules/multiformats/src/basics.js
var bases4 = { ...identity_exports7, ...base2_exports4, ...base8_exports4, ...base10_exports4, ...base16_exports4, ...base32_exports4, ...base36_exports4, ...base58_exports4, ...base64_exports4, ...base256emoji_exports4 };
var hashes4 = { ...sha2_browser_exports4, ...identity_exports8 };

// node_modules/uint8arrays/dist/src/alloc.js
function allocUnsafe6(size = 0) {
  if (globalThis.Buffer?.allocUnsafe != null) {
    return asUint8Array3(globalThis.Buffer.allocUnsafe(size));
  }
  return new Uint8Array(size);
}

// node_modules/uint8arrays/dist/src/util/bases.js
function createCodec5(name8, prefix, encode33, decode49) {
  return {
    name: name8,
    prefix,
    encoder: {
      name: name8,
      prefix,
      encode: encode33
    },
    decoder: {
      decode: decode49
    }
  };
}
var string4 = createCodec5("utf8", "u", (buf3) => {
  const decoder = new TextDecoder("utf8");
  return "u" + decoder.decode(buf3);
}, (str) => {
  const encoder = new TextEncoder();
  return encoder.encode(str.substring(1));
});
var ascii4 = createCodec5("ascii", "a", (buf3) => {
  let string5 = "a";
  for (let i = 0; i < buf3.length; i++) {
    string5 += String.fromCharCode(buf3[i]);
  }
  return string5;
}, (str) => {
  str = str.substring(1);
  const buf3 = allocUnsafe6(str.length);
  for (let i = 0; i < str.length; i++) {
    buf3[i] = str.charCodeAt(i);
  }
  return buf3;
});
var BASES4 = {
  utf8: string4,
  "utf-8": string4,
  hex: bases4.base16,
  latin1: ascii4,
  ascii: ascii4,
  binary: ascii4,
  ...bases4
};
var bases_default4 = BASES4;

// node_modules/uint8arrays/dist/src/from-string.js
function fromString11(string5, encoding = "utf8") {
  const base12 = bases_default4[encoding];
  if (base12 == null) {
    throw new Error(`Unsupported encoding "${encoding}"`);
  }
  if ((encoding === "utf8" || encoding === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null) {
    return asUint8Array3(globalThis.Buffer.from(string5, "utf-8"));
  }
  return base12.decoder.decode(`${base12.prefix}${string5}`);
}

// node_modules/uint8arrays/dist/src/concat.js
function concat5(arrays, length11) {
  if (length11 == null) {
    length11 = arrays.reduce((acc, curr) => acc + curr.length, 0);
  }
  const output = allocUnsafe6(length11);
  let offset = 0;
  for (const arr of arrays) {
    output.set(arr, offset);
    offset += arr.length;
  }
  return asUint8Array3(output);
}

// node_modules/@helia/unixfs/dist/src/commands/utils/consumable-hash.js
function wrapHash2(hashFn2) {
  function hashing(value) {
    if (value instanceof InfiniteHash2) {
      return value;
    } else {
      return new InfiniteHash2(value, hashFn2);
    }
  }
  return hashing;
}
var InfiniteHash2 = class {
  _value;
  _hashFn;
  _depth;
  _availableBits;
  _currentBufferIndex;
  _buffers;
  constructor(value, hashFn2) {
    if (!(value instanceof Uint8Array)) {
      throw new Error("can only hash Uint8Arrays");
    }
    this._value = value;
    this._hashFn = hashFn2;
    this._depth = -1;
    this._availableBits = 0;
    this._currentBufferIndex = 0;
    this._buffers = [];
  }
  async take(bits) {
    let pendingBits = bits;
    while (this._availableBits < pendingBits) {
      await this._produceMoreBits();
    }
    let result = 0;
    while (pendingBits > 0) {
      const hash = this._buffers[this._currentBufferIndex];
      const available = Math.min(hash.availableBits(), pendingBits);
      const took = hash.take(available);
      result = (result << available) + took;
      pendingBits -= available;
      this._availableBits -= available;
      if (hash.availableBits() === 0) {
        this._currentBufferIndex++;
      }
    }
    return result;
  }
  untake(bits) {
    let pendingBits = bits;
    while (pendingBits > 0) {
      const hash = this._buffers[this._currentBufferIndex];
      const availableForUntake = Math.min(hash.totalBits() - hash.availableBits(), pendingBits);
      hash.untake(availableForUntake);
      pendingBits -= availableForUntake;
      this._availableBits += availableForUntake;
      if (this._currentBufferIndex > 0 && hash.totalBits() === hash.availableBits()) {
        this._depth--;
        this._currentBufferIndex--;
      }
    }
  }
  async _produceMoreBits() {
    this._depth++;
    const value = this._depth > 0 ? concat5([this._value, Uint8Array.from([this._depth])]) : this._value;
    const hashValue = await this._hashFn(value);
    const buffer3 = new ConsumableBuffer2(hashValue);
    this._buffers.push(buffer3);
    this._availableBits += buffer3.availableBits();
  }
};
var START_MASKS2 = [
  255,
  254,
  252,
  248,
  240,
  224,
  192,
  128
];
var STOP_MASKS2 = [
  1,
  3,
  7,
  15,
  31,
  63,
  127,
  255
];
var ConsumableBuffer2 = class {
  _value;
  _currentBytePos;
  _currentBitPos;
  constructor(value) {
    this._value = value;
    this._currentBytePos = value.length - 1;
    this._currentBitPos = 7;
  }
  availableBits() {
    return this._currentBitPos + 1 + this._currentBytePos * 8;
  }
  totalBits() {
    return this._value.length * 8;
  }
  take(bits) {
    let pendingBits = bits;
    let result = 0;
    while (pendingBits > 0 && this._haveBits()) {
      const byte = this._value[this._currentBytePos];
      const availableBits = this._currentBitPos + 1;
      const taking = Math.min(availableBits, pendingBits);
      const value = byteBitsToInt2(byte, availableBits - taking, taking);
      result = (result << taking) + value;
      pendingBits -= taking;
      this._currentBitPos -= taking;
      if (this._currentBitPos < 0) {
        this._currentBitPos = 7;
        this._currentBytePos--;
      }
    }
    return result;
  }
  untake(bits) {
    this._currentBitPos += bits;
    while (this._currentBitPos > 7) {
      this._currentBitPos -= 8;
      this._currentBytePos += 1;
    }
  }
  _haveBits() {
    return this._currentBytePos >= 0;
  }
};
function byteBitsToInt2(byte, start, length11) {
  const mask = maskFor2(start, length11);
  return (byte & mask) >>> start;
}
function maskFor2(start, length11) {
  return START_MASKS2[start] & STOP_MASKS2[Math.min(length11 + start - 1, 7)];
}

// node_modules/@helia/unixfs/dist/src/commands/utils/hamt-constants.js
var hamtHashCode = BigInt(murmur3128.code);
var hamtBucketBits = 8;
async function hamtHashFn2(buf3) {
  return (await murmur3128.encode(buf3)).subarray(0, 8).reverse();
}

// node_modules/@helia/unixfs/dist/src/commands/utils/hamt-utils.js
var import_sparse_array2 = __toESM(require_sparse_array(), 1);

// node_modules/@helia/unixfs/dist/src/commands/utils/persist.js
var persist2 = async (buffer3, blockstore, options) => {
  if (options.codec == null) {
    options.codec = src_exports;
  }
  const multihash = await sha2564.digest(buffer3);
  const cid = CID9.create(options.cidVersion, options.codec.code, multihash);
  await blockstore.put(cid, buffer3, {
    ...options,
    signal: options.signal
  });
  return cid;
};

// node_modules/@helia/unixfs/dist/src/commands/utils/dir-sharded.js
var Dir2 = class {
  options;
  root;
  dir;
  path;
  dirty;
  flat;
  parent;
  parentKey;
  unixfs;
  mode;
  mtime;
  cid;
  size;
  nodeSize;
  constructor(props, options) {
    this.options = options ?? {};
    this.root = props.root;
    this.dir = props.dir;
    this.path = props.path;
    this.dirty = props.dirty;
    this.flat = props.flat;
    this.parent = props.parent;
    this.parentKey = props.parentKey;
    this.unixfs = props.unixfs;
    this.mode = props.mode;
    this.mtime = props.mtime;
  }
};
var DirSharded2 = class extends Dir2 {
  _bucket;
  constructor(props, options) {
    super(props, options);
    this._bucket = createHAMT({
      hashFn: hamtHashFn2,
      bits: 8
    });
  }
  async put(name8, value) {
    this.cid = void 0;
    this.size = void 0;
    this.nodeSize = void 0;
    await this._bucket.put(name8, value);
  }
  async get(name8) {
    return this._bucket.get(name8);
  }
  childCount() {
    return this._bucket.leafCount();
  }
  directChildrenCount() {
    return this._bucket.childrenCount();
  }
  onlyChild() {
    return this._bucket.onlyChild();
  }
  async *eachChildSeries() {
    for await (const { key, value } of this._bucket.eachLeafSeries()) {
      yield {
        key,
        child: value
      };
    }
  }
  estimateNodeSize() {
    if (this.nodeSize !== void 0) {
      return this.nodeSize;
    }
    this.nodeSize = calculateSize2(this._bucket, this, this.options);
    return this.nodeSize;
  }
  async *flush(blockstore) {
    for await (const entry of flush2(this._bucket, blockstore, this, this.options)) {
      yield {
        ...entry,
        path: this.path
      };
    }
  }
};
async function* flush2(bucket, blockstore, shardRoot, options) {
  const children = bucket._children;
  const links = [];
  let childrenSize = 0n;
  for (let i = 0; i < children.length; i++) {
    const child = children.get(i);
    if (child == null) {
      continue;
    }
    const labelPrefix = i.toString(16).toUpperCase().padStart(2, "0");
    if (child instanceof Bucket) {
      let shard;
      for await (const subShard of flush2(child, blockstore, null, options)) {
        shard = subShard;
      }
      if (shard == null) {
        throw new Error("Could not flush sharded directory, no subshard found");
      }
      links.push({
        Name: labelPrefix,
        Tsize: Number(shard.size),
        Hash: shard.cid
      });
      childrenSize += shard.size;
    } else if (isDir2(child.value)) {
      const dir2 = child.value;
      let flushedDir;
      for await (const entry of dir2.flush(blockstore)) {
        flushedDir = entry;
        yield flushedDir;
      }
      if (flushedDir == null) {
        throw new Error("Did not flush dir");
      }
      const label = labelPrefix + child.key;
      links.push({
        Name: label,
        Tsize: Number(flushedDir.size),
        Hash: flushedDir.cid
      });
      childrenSize += flushedDir.size;
    } else {
      const value = child.value;
      if (value.cid == null) {
        continue;
      }
      const label = labelPrefix + child.key;
      const size2 = value.size;
      links.push({
        Name: label,
        Tsize: Number(size2),
        Hash: value.cid
      });
      childrenSize += BigInt(size2 ?? 0);
    }
  }
  const data = Uint8Array.from(children.bitField().reverse());
  const dir = new UnixFS({
    type: "hamt-sharded-directory",
    data,
    fanout: BigInt(bucket.tableSize()),
    hashType: hamtHashCode,
    mtime: shardRoot?.mtime,
    mode: shardRoot?.mode
  });
  const node = {
    Data: dir.marshal(),
    Links: links
  };
  const buffer3 = encode3(prepare(node));
  const cid = await persist2(buffer3, blockstore, options);
  const size = BigInt(buffer3.byteLength) + childrenSize;
  yield {
    cid,
    unixfs: dir,
    size
  };
}
function isDir2(obj) {
  return typeof obj.flush === "function";
}
function calculateSize2(bucket, shardRoot, options) {
  const children = bucket._children;
  const links = [];
  for (let i = 0; i < children.length; i++) {
    const child = children.get(i);
    if (child == null) {
      continue;
    }
    const labelPrefix = i.toString(16).toUpperCase().padStart(2, "0");
    if (child instanceof Bucket) {
      const size = calculateSize2(child, null, options);
      links.push({
        Name: labelPrefix,
        Tsize: Number(size),
        Hash: options.cidVersion === 0 ? CID_V02 : CID_V12
      });
    } else if (typeof child.value.flush === "function") {
      const dir2 = child.value;
      const size = dir2.nodeSize();
      links.push({
        Name: labelPrefix + child.key,
        Tsize: Number(size),
        Hash: options.cidVersion === 0 ? CID_V02 : CID_V12
      });
    } else {
      const value = child.value;
      if (value.cid == null) {
        continue;
      }
      const label = labelPrefix + child.key;
      const size = value.size;
      links.push({
        Name: label,
        Tsize: Number(size),
        Hash: value.cid
      });
    }
  }
  const data = Uint8Array.from(children.bitField().reverse());
  const dir = new UnixFS({
    type: "hamt-sharded-directory",
    data,
    fanout: BigInt(bucket.tableSize()),
    hashType: hamtHashCode,
    mtime: shardRoot?.mtime,
    mode: shardRoot?.mode
  });
  const buffer3 = encode3(prepare({
    Data: dir.marshal(),
    Links: links
  }));
  return buffer3.length;
}
var CID_V02 = CID9.parse("QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn");
var CID_V12 = CID9.parse("zdj7WbTaiJT1fgatdet9Ei9iDB5hdCxkbVyhyh8YTUnXMiwYi");

// node_modules/@helia/unixfs/dist/src/commands/utils/hamt-utils.js
var log = logger("helia:unixfs:commands:utils:hamt-utils");
var toPrefix2 = (position) => {
  return position.toString(16).toUpperCase().padStart(2, "0").substring(0, 2);
};
var createShard = async (blockstore, contents, options) => {
  const shard = new DirSharded2({
    root: true,
    dir: true,
    parent: void 0,
    parentKey: void 0,
    path: "",
    dirty: true,
    flat: false,
    mtime: options.mtime,
    mode: options.mode
  }, options);
  for (let i = 0; i < contents.length; i++) {
    await shard._bucket.put(contents[i].name, {
      size: contents[i].size,
      cid: contents[i].cid
    });
  }
  const res = await src_default3(shard.flush(blockstore));
  if (res == null) {
    throw new Error("Flushing shard yielded no result");
  }
  return res;
};
var updateShardedDirectory = async (path, blockstore, options) => {
  const shardRoot = UnixFS.unmarshal(path[0].node.Data ?? new Uint8Array(0));
  const fanout = BigInt(Math.pow(2, hamtBucketBits));
  path.reverse();
  let cid;
  let node;
  for (let i = 0; i < path.length; i++) {
    const isRoot = i === path.length - 1;
    const segment = path[i];
    const data = Uint8Array.from(segment.children.bitField().reverse());
    const dir = new UnixFS({
      type: "hamt-sharded-directory",
      data,
      fanout,
      hashType: hamtHashCode
    });
    if (isRoot) {
      dir.mtime = shardRoot.mtime;
      dir.mode = shardRoot.mode;
    }
    node = {
      Data: dir.marshal(),
      Links: segment.node.Links
    };
    const block = encode3(prepare(node));
    cid = await persist2(block, blockstore, options);
    if (!isRoot) {
      const nextSegment = path[i + 1];
      if (nextSegment == null) {
        throw new Error("Was not operating on shard root but also had no parent?");
      }
      log("updating link in parent sub-shard with prefix %s", nextSegment.prefix);
      nextSegment.node.Links = nextSegment.node.Links.filter((l) => l.Name !== nextSegment.prefix);
      nextSegment.node.Links.push({
        Name: nextSegment.prefix,
        Hash: cid,
        Tsize: segment.node.Links.reduce((acc, curr) => acc + (curr.Tsize ?? 0), block.byteLength)
      });
    }
  }
  if (cid == null || node == null) {
    throw new Error("Noting persisted");
  }
  return { cid, node };
};
var recreateShardedDirectory = async (cid, fileName, blockstore, options) => {
  const wrapped = wrapHash2(hamtHashFn2);
  const hash = wrapped(fromString11(fileName));
  const path = [];
  while (true) {
    const block = await blockstore.get(cid, options);
    const node = decode5(block);
    const children = new import_sparse_array2.default();
    const index = await hash.take(hamtBucketBits);
    const prefix = toPrefix2(index);
    path.push({
      prefix,
      children,
      node
    });
    let childLink;
    for (const link of node.Links) {
      const linkName2 = link.Name ?? "";
      if (linkName2.length < 2) {
        throw new Error("Invalid HAMT - link name was too short");
      }
      const position = parseInt(linkName2.substring(0, 2), 16);
      children.set(position, true);
      if (linkName2.startsWith(prefix)) {
        childLink = link;
      }
    }
    if (childLink == null) {
      log("no link found with prefix %s for %s", prefix, fileName);
      break;
    }
    const linkName = childLink.Name ?? "";
    if (linkName.length < 2) {
      throw new Error("Invalid HAMT - link name was too short");
    }
    if (linkName.length === 2) {
      cid = childLink.Hash;
      log("descend into sub-shard with prefix %s", linkName);
      continue;
    }
    break;
  }
  return { path, hash };
};

// node_modules/@helia/unixfs/dist/src/commands/utils/is-over-shard-threshold.js
async function isOverShardThreshold(node, blockstore, threshold, options) {
  if (node.Data == null) {
    throw new Error("DagPB node had no data");
  }
  const unixfs2 = UnixFS.unmarshal(node.Data);
  let size;
  if (unixfs2.type === "directory") {
    size = estimateNodeSize(node);
  } else if (unixfs2.type === "hamt-sharded-directory") {
    size = await estimateShardSize(node, 0, threshold, blockstore, options);
  } else {
    throw new Error("Can only estimate the size of directories or shards");
  }
  return size > threshold;
}
function estimateNodeSize(node) {
  let size = 0;
  for (const link of node.Links) {
    size += (link.Name ?? "").length;
    size += link.Hash.version === 1 ? CID_V12.bytes.byteLength : CID_V02.bytes.byteLength;
  }
  return size;
}
async function estimateShardSize(node, current, max, blockstore, options) {
  if (current > max) {
    return max;
  }
  if (node.Data == null) {
    return current;
  }
  const unixfs2 = UnixFS.unmarshal(node.Data);
  if (!unixfs2.isDirectory()) {
    return current;
  }
  for (const link of node.Links) {
    let name8 = link.Name ?? "";
    name8 = name8.substring(2);
    current += name8.length;
    current += link.Hash.bytes.byteLength;
    if (link.Hash.code === code) {
      const block = await blockstore.get(link.Hash, options);
      const node2 = decode5(block);
      current += await estimateShardSize(node2, current, max, blockstore, options);
    }
  }
  return current;
}

// node_modules/@helia/unixfs/dist/src/commands/utils/add-link.js
var log2 = logger("helia:unixfs:components:utils:add-link");
async function addLink(parent, child, blockstore, options) {
  if (parent.node.Data == null) {
    throw new InvalidParametersError("Invalid parent passed to addLink");
  }
  const meta = UnixFS.unmarshal(parent.node.Data);
  if (meta.type === "hamt-sharded-directory") {
    log2("adding link to sharded directory");
    return addToShardedDirectory(parent, child, blockstore, options);
  }
  log2(`adding ${child.Name} (${child.Hash}) to regular directory`);
  const result = await addToDirectory(parent, child, blockstore, options);
  if (await isOverShardThreshold(result.node, blockstore, options.shardSplitThresholdBytes, options)) {
    log2("converting directory to sharded directory");
    const converted = await convertToShardedDirectory(result, blockstore);
    result.cid = converted.cid;
    result.node = decode5(await blockstore.get(converted.cid, options));
  }
  return result;
}
var convertToShardedDirectory = async (parent, blockstore) => {
  if (parent.node.Data == null) {
    throw new InvalidParametersError("Invalid parent passed to convertToShardedDirectory");
  }
  const unixfs2 = UnixFS.unmarshal(parent.node.Data);
  const result = await createShard(blockstore, parent.node.Links.map((link) => ({
    name: link.Name ?? "",
    size: BigInt(link.Tsize ?? 0),
    cid: link.Hash
  })), {
    mode: unixfs2.mode,
    mtime: unixfs2.mtime,
    cidVersion: parent.cid.version
  });
  log2(`converted directory to sharded directory ${result.cid}`);
  return result;
};
var addToDirectory = async (parent, child, blockstore, options) => {
  const parentLinks = parent.node.Links.filter((link) => {
    const matches = link.Name === child.Name;
    if (matches && !options.allowOverwriting) {
      throw new AlreadyExistsError();
    }
    return !matches;
  });
  parentLinks.push(child);
  if (parent.node.Data == null) {
    throw new InvalidPBNodeError("Parent node with no data passed to addToDirectory");
  }
  const node = UnixFS.unmarshal(parent.node.Data);
  let data;
  if (node.mtime != null) {
    const ms = Date.now();
    const secs = Math.floor(ms / 1e3);
    node.mtime = {
      secs: BigInt(secs),
      nsecs: (ms - secs * 1e3) * 1e3
    };
    data = node.marshal();
  } else {
    data = parent.node.Data;
  }
  parent.node = prepare({
    Data: data,
    Links: parentLinks
  });
  const buf3 = encode3(parent.node);
  const hash = await sha2564.digest(buf3);
  const cid = CID9.create(parent.cid.version, code, hash);
  await blockstore.put(cid, buf3);
  return {
    node: parent.node,
    cid
  };
};
var addToShardedDirectory = async (parent, child, blockstore, options) => {
  const { path, hash } = await recreateShardedDirectory(parent.cid, child.Name, blockstore, options);
  const finalSegment = path[path.length - 1];
  if (finalSegment == null) {
    throw new Error("Invalid HAMT, could not generate path");
  }
  const prefix = finalSegment.prefix;
  const index = parseInt(prefix, 16);
  log2("next prefix for %s is %s", child.Name, prefix);
  const linkName = `${prefix}${child.Name}`;
  const existingLink = finalSegment.node.Links.find((l) => (l.Name ?? "").startsWith(prefix));
  if (existingLink != null) {
    log2("link %s was present in shard", linkName);
    if (existingLink.Name === linkName) {
      if (!options.allowOverwriting) {
        throw new AlreadyExistsError();
      }
      log2("overwriting %s in subshard", child.Name);
      finalSegment.node.Links = finalSegment.node.Links.filter((l) => l.Name !== linkName);
      finalSegment.node.Links.push({
        Name: linkName,
        Hash: child.Hash,
        Tsize: child.Tsize
      });
    } else if (existingLink.Name?.length === 2) {
      throw new Error("Existing link was subshard?!");
    } else {
      log2("prefix %s already exists, creating new subshard", prefix);
      const index2 = finalSegment.node.Links.findIndex((l) => l.Name?.startsWith(prefix));
      const sibling = finalSegment.node.Links.splice(index2, 1)[0];
      const siblingName = (sibling.Name ?? "").substring(2);
      const wrapped = wrapHash2(hamtHashFn2);
      const siblingHash = wrapped(fromString11(siblingName));
      for (let i = 0; i < path.length; i++) {
        await siblingHash.take(hamtBucketBits);
      }
      while (true) {
        const siblingIndex = await siblingHash.take(hamtBucketBits);
        const siblingPrefix = toPrefix2(siblingIndex);
        sibling.Name = `${siblingPrefix}${siblingName}`;
        const newIndex = await hash.take(hamtBucketBits);
        const newPrefix = toPrefix2(newIndex);
        if (siblingPrefix === newPrefix) {
          const children2 = new import_sparse_array3.default();
          children2.set(newIndex, true);
          path.push({
            prefix: newPrefix,
            children: children2,
            node: {
              Links: []
            }
          });
          continue;
        }
        const children = new import_sparse_array3.default();
        children.set(newIndex, true);
        children.set(siblingIndex, true);
        path.push({
          prefix,
          children,
          node: {
            Links: [
              sibling,
              {
                Name: `${newPrefix}${child.Name}`,
                Hash: child.Hash,
                Tsize: child.Tsize
              }
            ]
          }
        });
        break;
      }
    }
  } else {
    log2("link %s was not present in sub-shard", linkName);
    child.Name = linkName;
    finalSegment.node.Links.push(child);
    finalSegment.children.set(index, true);
    log2("adding %s to existing sub-shard", linkName);
  }
  return updateShardedDirectory(path, blockstore, options);
};

// node_modules/@helia/unixfs/dist/src/commands/utils/cid-to-directory.js
async function cidToDirectory(cid, blockstore, options = {}) {
  const entry = await exporter(cid, blockstore, options);
  if (entry.type !== "directory") {
    throw new NotADirectoryError(`${cid.toString()} was not a UnixFS directory`);
  }
  return {
    cid,
    node: entry.node
  };
}

// node_modules/@helia/unixfs/dist/src/commands/utils/cid-to-pblink.js
async function cidToPBLink(cid, name8, blockstore, options) {
  const sourceEntry = await exporter(cid, blockstore, options);
  if (sourceEntry.type !== "directory" && sourceEntry.type !== "file" && sourceEntry.type !== "raw") {
    throw new NotUnixFSError(`${cid.toString()} was not a UnixFS node`);
  }
  return {
    Name: name8,
    Tsize: sourceEntry.node instanceof Uint8Array ? sourceEntry.node.byteLength : dagNodeTsize(sourceEntry.node),
    Hash: cid
  };
}
function dagNodeTsize(node) {
  const linkSizes = node.Links.reduce((acc, curr) => acc + (curr.Tsize ?? 0), 0);
  return encode3(node).byteLength + linkSizes;
}

// node_modules/@helia/unixfs/dist/src/commands/utils/resolve.js
var log3 = logger("helia:unixfs:components:utils:resolve");
async function resolve7(cid, path, blockstore, options) {
  if (path == null || path === "") {
    return { cid };
  }
  log3('resolve "%s" under %c', path, cid);
  const parts = path.split("/").filter(Boolean);
  const segments = [{
    name: "",
    cid,
    size: 0n
  }];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const result = await exporter(cid, blockstore, options);
    log3('resolving "%s"', part, result);
    if (result.type === "file") {
      if (i < parts.length - 1) {
        throw new InvalidParametersError("Path was invalid");
      }
      cid = result.cid;
    } else if (result.type === "directory") {
      let dirCid;
      for await (const entry of result.content()) {
        if (entry.name === part) {
          dirCid = entry.cid;
          break;
        }
      }
      if (dirCid == null) {
        throw new DoesNotExistError("Could not find path in directory");
      }
      cid = dirCid;
      segments.push({
        name: part,
        cid,
        size: result.size
      });
    } else {
      throw new InvalidParametersError("Could not resolve path");
    }
  }
  log3("resolved %s to %c", path, cid);
  return {
    cid,
    path,
    segments
  };
}
async function updatePathCids(cid, result, blockstore, options) {
  if (result.segments == null || result.segments.length === 0) {
    return cid;
  }
  let child = result.segments.pop();
  if (child == null) {
    throw new Error("Insufficient segments");
  }
  child.cid = cid;
  result.segments.reverse();
  for (const parent of result.segments) {
    const [directory, pblink] = await Promise.all([
      cidToDirectory(parent.cid, blockstore, options),
      cidToPBLink(child.cid, child.name, blockstore, options)
    ]);
    const result2 = await addLink(directory, pblink, blockstore, {
      ...options,
      allowOverwriting: true,
      cidVersion: cid.version
    });
    cid = result2.cid;
    parent.cid = cid;
    child = parent;
  }
  return cid;
}

// node_modules/@helia/unixfs/dist/src/commands/cat.js
var mergeOptions2 = merge_options_default.bind({ ignoreUndefined: true });
var defaultOptions = {};
async function* cat(cid, blockstore, options = {}) {
  const opts = mergeOptions2(defaultOptions, options);
  const resolved = await resolve7(cid, opts.path, blockstore, opts);
  const result = await exporter(resolved.cid, blockstore, opts);
  if (result.type !== "file" && result.type !== "raw") {
    throw new NotAFileError();
  }
  if (result.content == null) {
    throw new NoContentError();
  }
  yield* result.content(opts);
}

// node_modules/@helia/unixfs/dist/src/commands/utils/constants.js
var SHARD_SPLIT_THRESHOLD_BYTES = 262144;

// node_modules/@helia/unixfs/dist/src/commands/chmod.js
var mergeOptions3 = merge_options_default.bind({ ignoreUndefined: true });
var log4 = logger("helia:unixfs:chmod");
var defaultOptions2 = {
  recursive: false,
  shardSplitThresholdBytes: SHARD_SPLIT_THRESHOLD_BYTES
};
async function chmod(cid, mode, blockstore, options = {}) {
  const opts = mergeOptions3(defaultOptions2, options);
  const resolved = await resolve7(cid, opts.path, blockstore, options);
  log4("chmod %c %d", resolved.cid, mode);
  if (opts.recursive) {
    const root = await pipe(
      async function* () {
        for await (const entry of recursive(resolved.cid, blockstore, options)) {
          let metadata2;
          let links2 = [];
          if (entry.type === "raw") {
            metadata2 = new UnixFS({ type: "file", data: entry.node });
          } else if (entry.type === "file" || entry.type === "directory") {
            metadata2 = entry.unixfs;
            links2 = entry.node.Links;
          } else {
            throw new NotUnixFSError();
          }
          metadata2.mode = mode;
          const node = {
            Data: metadata2.marshal(),
            Links: links2
          };
          yield {
            path: entry.path,
            content: node
          };
        }
      },
      // @ts-expect-error cannot combine progress types
      (source) => importer(source, blockstore, {
        ...opts,
        dagBuilder: async function* (source2, block2) {
          for await (const entry of source2) {
            yield async function() {
              const node = entry.content;
              const buf3 = encode3(node);
              const updatedCid2 = await persist2(buf3, block2, {
                ...opts,
                cidVersion: cid.version
              });
              if (node.Data == null) {
                throw new InvalidPBNodeError(`${updatedCid2} had no data`);
              }
              const unixfs2 = UnixFS.unmarshal(node.Data);
              return {
                cid: updatedCid2,
                size: BigInt(buf3.length),
                path: entry.path,
                unixfs: unixfs2
              };
            };
          }
        }
      }),
      async (nodes) => src_default3(nodes)
    );
    if (root == null) {
      throw new UnknownError(`Could not chmod ${resolved.cid.toString()}`);
    }
    return updatePathCids(root.cid, resolved, blockstore, opts);
  }
  const block = await blockstore.get(resolved.cid, options);
  let metadata;
  let links = [];
  if (resolved.cid.code === code11) {
    metadata = new UnixFS({ type: "file", data: block });
  } else {
    const node = decode5(block);
    if (node.Data == null) {
      throw new InvalidPBNodeError(`${resolved.cid.toString()} had no data`);
    }
    links = node.Links;
    metadata = UnixFS.unmarshal(node.Data);
  }
  metadata.mode = mode;
  const updatedBlock = encode3({
    Data: metadata.marshal(),
    Links: links
  });
  const hash = await sha2564.digest(updatedBlock);
  const updatedCid = CID9.create(resolved.cid.version, code, hash);
  await blockstore.put(updatedCid, updatedBlock);
  return updatePathCids(updatedCid, resolved, blockstore, opts);
}

// node_modules/@helia/unixfs/dist/src/commands/cp.js
var mergeOptions4 = merge_options_default.bind({ ignoreUndefined: true });
var log5 = logger("helia:unixfs:cp");
var defaultOptions3 = {
  force: false,
  shardSplitThresholdBytes: SHARD_SPLIT_THRESHOLD_BYTES
};
async function cp(source, target, name8, blockstore, options = {}) {
  const opts = mergeOptions4(defaultOptions3, options);
  if (name8.includes("/")) {
    throw new InvalidParametersError("Name must not have slashes");
  }
  const [directory, pblink] = await Promise.all([
    cidToDirectory(target, blockstore, opts),
    cidToPBLink(source, name8, blockstore, opts)
  ]);
  log5('Adding %c as "%s" to %c', source, name8, target);
  const result = await addLink(directory, pblink, blockstore, {
    allowOverwriting: opts.force,
    cidVersion: target.version,
    ...opts
  });
  return result.cid;
}

// node_modules/@helia/unixfs/dist/src/commands/ls.js
var mergeOptions5 = merge_options_default.bind({ ignoreUndefined: true });
var defaultOptions4 = {};
async function* ls(cid, blockstore, options = {}) {
  const opts = mergeOptions5(defaultOptions4, options);
  const resolved = await resolve7(cid, opts.path, blockstore, opts);
  const result = await exporter(resolved.cid, blockstore);
  if (result.type === "file" || result.type === "raw") {
    yield result;
    return;
  }
  if (result.content == null) {
    throw new NoContentError();
  }
  if (result.type !== "directory") {
    throw new NotADirectoryError();
  }
  yield* result.content({
    offset: options.offset,
    length: options.length
  });
}

// node_modules/@helia/unixfs/dist/src/commands/mkdir.js
var mergeOptions6 = merge_options_default.bind({ ignoreUndefined: true });
var log6 = logger("helia:unixfs:mkdir");
var defaultOptions5 = {
  cidVersion: 1,
  force: false,
  shardSplitThresholdBytes: SHARD_SPLIT_THRESHOLD_BYTES
};
async function mkdir(parentCid, dirname, blockstore, options = {}) {
  const opts = mergeOptions6(defaultOptions5, options);
  if (dirname.includes("/")) {
    throw new InvalidParametersError("Path must not have slashes");
  }
  const entry = await exporter(parentCid, blockstore, options);
  if (entry.type !== "directory") {
    throw new NotADirectoryError(`${parentCid.toString()} was not a UnixFS directory`);
  }
  log6("creating %s", dirname);
  const metadata = new UnixFS({
    type: "directory",
    mode: opts.mode,
    mtime: opts.mtime
  });
  const node = {
    Data: metadata.marshal(),
    Links: []
  };
  const buf3 = encode3(node);
  const hash = await sha2564.digest(buf3);
  const emptyDirCid = CID9.create(opts.cidVersion, code, hash);
  await blockstore.put(emptyDirCid, buf3);
  const [directory, pblink] = await Promise.all([
    cidToDirectory(parentCid, blockstore, opts),
    cidToPBLink(emptyDirCid, dirname, blockstore, opts)
  ]);
  log6("adding empty dir called %s to %c", dirname, parentCid);
  const result = await addLink(directory, pblink, blockstore, {
    ...opts,
    allowOverwriting: opts.force
  });
  return result.cid;
}

// node_modules/@helia/unixfs/dist/src/commands/utils/remove-link.js
var log7 = logger("helia:unixfs:utils:remove-link");
async function removeLink(parent, name8, blockstore, options) {
  if (parent.node.Data == null) {
    throw new InvalidPBNodeError("Parent node had no data");
  }
  const meta = UnixFS.unmarshal(parent.node.Data);
  if (meta.type === "hamt-sharded-directory") {
    log7(`removing ${name8} from sharded directory`);
    const result = await removeFromShardedDirectory(parent, name8, blockstore, options);
    if (!await isOverShardThreshold(result.node, blockstore, options.shardSplitThresholdBytes, options)) {
      log7("converting shard to flat directory %c", parent.cid);
      return convertToFlatDirectory(result, blockstore, options);
    }
    return result;
  }
  log7(`removing link ${name8} regular directory`);
  return removeFromDirectory(parent, name8, blockstore, options);
}
var removeFromDirectory = async (parent, name8, blockstore, options) => {
  parent.node.Links = parent.node.Links.filter((link) => {
    return link.Name !== name8;
  });
  const parentBlock = encode3(parent.node);
  const parentCid = await persist2(parentBlock, blockstore, {
    ...options,
    cidVersion: parent.cid.version
  });
  log7(`Updated regular directory ${parentCid}`);
  return {
    node: parent.node,
    cid: parentCid
  };
};
var removeFromShardedDirectory = async (parent, name8, blockstore, options) => {
  const { path } = await recreateShardedDirectory(parent.cid, name8, blockstore, options);
  const finalSegment = path[path.length - 1];
  if (finalSegment == null) {
    throw new Error("Invalid HAMT, could not generate path");
  }
  const linkName = finalSegment.node.Links.filter((l) => (l.Name ?? "").substring(2) === name8).map((l) => l.Name).pop();
  if (linkName == null) {
    throw new Error("File not found");
  }
  const prefix = linkName.substring(0, 2);
  const index = parseInt(prefix, 16);
  finalSegment.node.Links = finalSegment.node.Links.filter((link) => link.Name !== linkName);
  finalSegment.children.unset(index);
  if (finalSegment.node.Links.length === 1) {
    while (true) {
      if (path.length === 1) {
        break;
      }
      const segment = path[path.length - 1];
      if (segment == null || segment.node.Links.length > 1) {
        break;
      }
      path.pop();
      const nextSegment = path[path.length - 1];
      if (nextSegment == null) {
        break;
      }
      const link = segment.node.Links[0];
      nextSegment.node.Links = nextSegment.node.Links.filter((l) => !(l.Name ?? "").startsWith(nextSegment.prefix));
      nextSegment.node.Links.push({
        Hash: link.Hash,
        Name: `${nextSegment.prefix}${(link.Name ?? "").substring(2)}`,
        Tsize: link.Tsize
      });
    }
  }
  return updateShardedDirectory(path, blockstore, options);
};
var convertToFlatDirectory = async (parent, blockstore, options) => {
  if (parent.node.Data == null) {
    throw new InvalidParametersError("Invalid parent passed to convertToFlatDirectory");
  }
  const rootNode = {
    Links: []
  };
  const dir = await exporter(parent.cid, blockstore);
  if (dir.type !== "directory") {
    throw new Error("Unexpected node type");
  }
  for await (const entry of dir.content()) {
    let tsize = 0;
    if (entry.node instanceof Uint8Array) {
      tsize = entry.node.byteLength;
    } else {
      tsize = encode3(entry.node).length;
    }
    rootNode.Links.push({
      Hash: entry.cid,
      Name: entry.name,
      Tsize: tsize
    });
  }
  const oldUnixfs = UnixFS.unmarshal(parent.node.Data);
  rootNode.Data = new UnixFS({ type: "directory", mode: oldUnixfs.mode, mtime: oldUnixfs.mtime }).marshal();
  const block = encode3(prepare(rootNode));
  const cid = await persist2(block, blockstore, {
    codec: src_exports,
    cidVersion: parent.cid.version,
    signal: options.signal
  });
  return {
    cid,
    node: rootNode
  };
};

// node_modules/@helia/unixfs/dist/src/commands/rm.js
var mergeOptions7 = merge_options_default.bind({ ignoreUndefined: true });
var log8 = logger("helia:unixfs:rm");
var defaultOptions6 = {
  shardSplitThresholdBytes: SHARD_SPLIT_THRESHOLD_BYTES
};
async function rm(target, name8, blockstore, options = {}) {
  const opts = mergeOptions7(defaultOptions6, options);
  if (name8.includes("/")) {
    throw new InvalidParametersError("Name must not have slashes");
  }
  const directory = await cidToDirectory(target, blockstore, opts);
  log8("Removing %s from %c", name8, target);
  const result = await removeLink(directory, name8, blockstore, {
    ...opts,
    cidVersion: target.version
  });
  return result.cid;
}

// node_modules/@helia/unixfs/dist/src/commands/stat.js
var mergeOptions8 = merge_options_default.bind({ ignoreUndefined: true });
var log9 = logger("helia:unixfs:stat");
var defaultOptions7 = {};
async function stat(cid, blockstore, options = {}) {
  const opts = mergeOptions8(defaultOptions7, options);
  const resolved = await resolve7(cid, options.path, blockstore, opts);
  log9("stat %c", resolved.cid);
  const result = await exporter(resolved.cid, blockstore, opts);
  if (result.type !== "file" && result.type !== "directory" && result.type !== "raw") {
    throw new NotUnixFSError();
  }
  let fileSize = 0n;
  let dagSize = 0n;
  let localFileSize = 0n;
  let localDagSize = 0n;
  let blocks = 0;
  let mode;
  let mtime;
  const type = result.type;
  let unixfs2;
  if (result.type === "raw") {
    fileSize = BigInt(result.node.byteLength);
    dagSize = BigInt(result.node.byteLength);
    localFileSize = BigInt(result.node.byteLength);
    localDagSize = BigInt(result.node.byteLength);
    blocks = 1;
  }
  if (result.type === "directory") {
    fileSize = 0n;
    dagSize = BigInt(result.unixfs.marshal().byteLength);
    localFileSize = 0n;
    localDagSize = dagSize;
    blocks = 1;
    mode = result.unixfs.mode;
    mtime = result.unixfs.mtime;
    unixfs2 = result.unixfs;
  }
  if (result.type === "file") {
    const results = await inspectDag(resolved.cid, blockstore, opts);
    fileSize = result.unixfs.fileSize();
    dagSize = BigInt((result.node.Data?.byteLength ?? 0) + result.node.Links.reduce((acc, curr) => acc + (curr.Tsize ?? 0), 0));
    localFileSize = BigInt(results.localFileSize);
    localDagSize = BigInt(results.localDagSize);
    blocks = results.blocks;
    mode = result.unixfs.mode;
    mtime = result.unixfs.mtime;
    unixfs2 = result.unixfs;
  }
  return {
    cid: resolved.cid,
    mode,
    mtime,
    fileSize,
    dagSize,
    localFileSize,
    localDagSize,
    blocks,
    type,
    unixfs: unixfs2
  };
}
async function inspectDag(cid, blockstore, options) {
  const results = {
    localFileSize: 0,
    localDagSize: 0,
    blocks: 0
  };
  if (await blockstore.has(cid, options)) {
    const block = await blockstore.get(cid, options);
    results.blocks++;
    results.localDagSize += block.byteLength;
    if (cid.code === code11) {
      results.localFileSize += block.byteLength;
    } else if (cid.code === code) {
      const pbNode = decode5(block);
      if (pbNode.Links.length > 0) {
        for (const link of pbNode.Links) {
          const linkResult = await inspectDag(link.Hash, blockstore, options);
          results.localFileSize += linkResult.localFileSize;
          results.localDagSize += linkResult.localDagSize;
          results.blocks += linkResult.blocks;
        }
      } else {
        if (pbNode.Data == null) {
          throw new InvalidPBNodeError(`PBNode ${cid.toString()} had no data`);
        }
        const unixfs2 = UnixFS.unmarshal(pbNode.Data);
        if (unixfs2.data == null) {
          throw new InvalidPBNodeError(`UnixFS node ${cid.toString()} had no data`);
        }
        results.localFileSize += unixfs2.data.byteLength ?? 0;
      }
    } else {
      throw new UnknownError(`${cid.toString()} was neither DAG_PB nor RAW`);
    }
  }
  return results;
}

// node_modules/@helia/unixfs/dist/src/commands/touch.js
var mergeOptions9 = merge_options_default.bind({ ignoreUndefined: true });
var log10 = logger("helia:unixfs:touch");
var defaultOptions8 = {
  recursive: false,
  shardSplitThresholdBytes: SHARD_SPLIT_THRESHOLD_BYTES
};
async function touch(cid, blockstore, options = {}) {
  const opts = mergeOptions9(defaultOptions8, options);
  const resolved = await resolve7(cid, opts.path, blockstore, opts);
  const mtime = opts.mtime ?? {
    secs: BigInt(Math.round(Date.now() / 1e3)),
    nsecs: 0
  };
  log10("touch %c %o", resolved.cid, mtime);
  if (opts.recursive) {
    const root = await pipe(
      async function* () {
        for await (const entry of recursive(resolved.cid, blockstore)) {
          let metadata2;
          let links2;
          if (entry.type === "raw") {
            metadata2 = new UnixFS({ data: entry.node });
            links2 = [];
          } else if (entry.type === "file" || entry.type === "directory") {
            metadata2 = entry.unixfs;
            links2 = entry.node.Links;
          } else {
            throw new NotUnixFSError();
          }
          metadata2.mtime = mtime;
          const node = {
            Data: metadata2.marshal(),
            Links: links2
          };
          yield {
            path: entry.path,
            content: node
          };
        }
      },
      // @ts-expect-error blockstore types are incompatible
      (source) => importer(source, blockstore, {
        ...opts,
        dagBuilder: async function* (source2, block2) {
          for await (const entry of source2) {
            yield async function() {
              const node = entry.content;
              const buf3 = encode3(node);
              const updatedCid2 = await persist2(buf3, block2, {
                ...opts,
                cidVersion: cid.version
              });
              if (node.Data == null) {
                throw new InvalidPBNodeError(`${updatedCid2} had no data`);
              }
              const unixfs2 = UnixFS.unmarshal(node.Data);
              return {
                cid: updatedCid2,
                size: BigInt(buf3.length),
                path: entry.path,
                unixfs: unixfs2
              };
            };
          }
        }
      }),
      async (nodes) => src_default3(nodes)
    );
    if (root == null) {
      throw new UnknownError(`Could not chmod ${resolved.cid.toString()}`);
    }
    return updatePathCids(root.cid, resolved, blockstore, opts);
  }
  const block = await blockstore.get(resolved.cid, options);
  let metadata;
  let links = [];
  if (resolved.cid.code === code11) {
    metadata = new UnixFS({ data: block });
  } else {
    const node = decode5(block);
    links = node.Links;
    if (node.Data == null) {
      throw new InvalidPBNodeError(`${resolved.cid.toString()} had no data`);
    }
    metadata = UnixFS.unmarshal(node.Data);
  }
  metadata.mtime = mtime;
  const updatedBlock = encode3({
    Data: metadata.marshal(),
    Links: links
  });
  const hash = await sha2564.digest(updatedBlock);
  const updatedCid = CID9.create(resolved.cid.version, code, hash);
  await blockstore.put(updatedCid, updatedBlock);
  return updatePathCids(updatedCid, resolved, blockstore, opts);
}

// node_modules/@helia/unixfs/dist/src/utils/url-source.js
function urlSource(url, options) {
  return {
    path: decodeURIComponent(new URL(url).pathname.split("/").pop() ?? ""),
    content: readURLContent(url, options)
  };
}
async function* readURLContent(url, options) {
  const response = await globalThis.fetch(url, options);
  if (response.body == null) {
    throw new UnknownError("HTTP response did not have a body");
  }
  const reader = response.body.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      if (value != null) {
        yield value;
      }
    }
  } finally {
    reader.releaseLock();
  }
}

// node_modules/@helia/unixfs/dist/src/index.js
var DefaultUnixFS = class {
  components;
  constructor(components) {
    this.components = components;
  }
  async *addAll(source, options = {}) {
    yield* addAll(source, this.components.blockstore, options);
  }
  async addBytes(bytes, options = {}) {
    return addBytes(bytes, this.components.blockstore, options);
  }
  async addByteStream(bytes, options = {}) {
    return addByteStream(bytes, this.components.blockstore, options);
  }
  async addFile(file, options = {}) {
    return addFile(file, this.components.blockstore, options);
  }
  async addDirectory(dir = {}, options = {}) {
    return addDirectory(dir, this.components.blockstore, options);
  }
  async *cat(cid, options = {}) {
    yield* cat(cid, this.components.blockstore, options);
  }
  async chmod(cid, mode, options = {}) {
    return chmod(cid, mode, this.components.blockstore, options);
  }
  async cp(source, target, name8, options = {}) {
    return cp(source, target, name8, this.components.blockstore, options);
  }
  async *ls(cid, options = {}) {
    yield* ls(cid, this.components.blockstore, options);
  }
  async mkdir(cid, dirname, options = {}) {
    return mkdir(cid, dirname, this.components.blockstore, options);
  }
  async rm(cid, path, options = {}) {
    return rm(cid, path, this.components.blockstore, options);
  }
  async stat(cid, options = {}) {
    return stat(cid, this.components.blockstore, options);
  }
  async touch(cid, options = {}) {
    return touch(cid, this.components.blockstore, options);
  }
};
function unixfs(helia) {
  return new DefaultUnixFS(helia);
}
var export_globSource = void 0;
export {
  export_globSource as globSource,
  unixfs,
  urlSource
};
