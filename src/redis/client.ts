import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';
import session from 'express-session';

dotenv.config();

const RedisStore = require("connect-redis").default;

let redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err: Error) => console.error('Redis Client Error', err));

redisClient.connect();

const sessionStore = new RedisStore({ client: redisClient as any });
const sessionMiddleware = session({
  store: sessionStore,
  secret: 'sunnypuri',
  saveUninitialized: true,
  resave: false,
  cookie: { httpOnly: true, secure: 'auto', maxAge: 86400000 },
});

export {
  redisClient,
  sessionMiddleware
}