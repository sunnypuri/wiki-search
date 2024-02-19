import { Request, Response, NextFunction } from 'express';

interface CacheRequest extends Request {
    params: {
        searchTerm: string;
    };
}

const MAX_HISTORY_LENGTH: any = process.env.MAX_HISTORY_LENGTH || 5

export const historyMiddleware = async (req: CacheRequest, res: Response, next: NextFunction) => {
    const { searchTerm } = req.params;
    try {
        if (!req.session.searchHistory) {
            req.session.searchHistory = [];
        }
        req.session.searchHistory = [searchTerm, ...req.session.searchHistory.splice(0, MAX_HISTORY_LENGTH - 1)]
        next();
    } catch (error) {
        console.error(error);
        next();
    }
};
