import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { cacheMiddleware, historyMiddleware } from './redis/middleware';
import { redisClient, sessionMiddleware } from './redis/client';
import helmet from 'helmet';
import { fetchWikiApiData } from './api';
import cors from 'cors';

declare module 'express-session' {
    interface SessionData {
        searchHistory?: string[];
    }
}

dotenv.config();

const app = express();
const PORT: number | string = process.env.PORT || 3000;

app.use(express.json());
app.use(sessionMiddleware);
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
}));
app.use(
    helmet.contentSecurityPolicy({
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
    })
);
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
})

app.get('/search/history', async (req: Request, res: Response) => {
    const history = await req.session.searchHistory
    res.json({
        history
    });
})

app.get('/search/:searchTerm', historyMiddleware, cacheMiddleware, async (req: Request, res: Response) => {
    try {
        const { searchTerm } = req.params;
        const response = await fetchWikiApiData(searchTerm)

        const data = response.data.query.search;
        await redisClient.setEx(searchTerm, 60, JSON.stringify(data)); // TTL: 1 mins
        res.send({
            isCached: false,
            data: data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching data" });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
