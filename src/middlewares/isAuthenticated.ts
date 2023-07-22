import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../utils/jwt';
import { JWTData } from '../types/JWTData';


export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = verifyJWT(token) as JWTData;
        const currentTime = new Date();
        const expDate = new Date(decoded.exp* 1000); 
        if (currentTime <= expDate) {
            next();
        } else {
            return res.status(401).json({ message: 'Token expired' });
        }
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};