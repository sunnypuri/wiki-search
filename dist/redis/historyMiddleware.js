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
exports.historyMiddleware = void 0;
const MAX_HISTORY_LENGTH = process.env.MAX_HISTORY_LENGTH || 5;
const historyMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = req.params;
    try {
        if (!req.session.searchHistory) {
            req.session.searchHistory = [];
        }
        req.session.searchHistory = [searchTerm, ...req.session.searchHistory.splice(0, MAX_HISTORY_LENGTH - 1)];
        next();
    }
    catch (error) {
        console.error(error);
        next();
    }
});
exports.historyMiddleware = historyMiddleware;
