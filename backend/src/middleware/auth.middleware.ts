import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: 'Missing token' });

    const token = header.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
        (req as any).user = decoded;
        next();
    } catch {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
