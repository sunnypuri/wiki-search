"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheMiddleware = void 0;
const client_1 = require("./client");
const cacheMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = req.params;
    try {
        const data = yield client_1.redisClient.get(searchTerm);
        if (data)
            return res.send({
                isCached: true,
                data: JSON.parse(data)
            });
        next();
    }
    catch (error) {
        console.error(error);
        next();
    }
});
exports.cacheMiddleware = cacheMiddleware;
