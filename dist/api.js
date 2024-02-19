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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchWikiApiData = void 0;
const axios_1 = __importDefault(require("axios"));
const WIKI_API_URL = process.env.WIKI_API_URL;
function fetchWikiApiData(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield axios_1.default.get(WIKI_API_URL, {
            params: {
                action: 'query',
                list: 'search',
                srsearch: searchTerm,
                format: 'json',
            }
        });
    });
}
exports.fetchWikiApiData = fetchWikiApiData;
