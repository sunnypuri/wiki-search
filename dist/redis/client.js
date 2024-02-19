"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionMiddleware = exports.redisClient = void 0;
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
dotenv_1.default.config();
const RedisStore = require("connect-redis").default;
let redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL
});
exports.redisClient = redisClient;
redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.connect();
const sessionStore = new RedisStore({ client: redisClient });
const sessionMiddleware = (0, express_session_1.default)({
    store: sessionStore,
    secret: 'sunnypuri',
    saveUninitialized: true,
    resave: false,
    cookie: { httpOnly: true, secure: 'auto', maxAge: 86400000 },
});
exports.sessionMiddleware = sessionMiddleware;
