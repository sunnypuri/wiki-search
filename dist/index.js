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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const middleware_1 = require("./redis/middleware");
const client_1 = require("./redis/client");
const helmet_1 = __importDefault(require("helmet"));
const api_1 = require("./api");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(client_1.sessionMiddleware);
app.use((0, cors_1.default)({
    origin: 'http://localhost:3001',
    credentials: true
}));
app.use(helmet_1.default.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https:', 'http://localhost:3000'],
        fontSrc: ["'self'", 'https:', 'data:'],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
    },
    reportOnly: false,
}));
app.use(express_1.default.static(path_1.default.join(__dirname, '../client/build')));
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../client/build', 'index.html'));
});
app.get('/search/history', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const history = yield req.session.searchHistory;
    res.json({
        history
    });
}));
app.get('/search/:searchTerm', middleware_1.historyMiddleware, middleware_1.cacheMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchTerm } = req.params;
        const response = yield (0, api_1.fetchWikiApiData)(searchTerm);
        const data = response.data.query.search;
        yield client_1.redisClient.setEx(searchTerm, 60, JSON.stringify(data)); // TTL: 1 mins
        res.send({
            isCached: false,
            data: data
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching data" });
    }
}));
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
