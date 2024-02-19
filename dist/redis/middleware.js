"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.historyMiddleware = exports.cacheMiddleware = void 0;
const cacheMiddleware_1 = require("./cacheMiddleware");
Object.defineProperty(exports, "cacheMiddleware", { enumerable: true, get: function () { return cacheMiddleware_1.cacheMiddleware; } });
const historyMiddleware_1 = require("./historyMiddleware");
Object.defineProperty(exports, "historyMiddleware", { enumerable: true, get: function () { return historyMiddleware_1.historyMiddleware; } });
