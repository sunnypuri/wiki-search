import { Request, Response, NextFunction } from 'express';
import { redisClient } from './client';

interface CacheRequest extends Request {
    params: {
        searchTerm: string;
    };
}

export const cacheMiddleware = async (req: CacheRequest, res: Response, next: NextFunction) => {
    const { searchTerm } = req.params;
    try {
        const data = await redisClient.get(searchTerm);
        if (data) return res.send({
            isCached: true,
            data: JSON.parse(data)
        })
        next();
    } catch (error) {
        console.error(error);
        next();
    }
};
