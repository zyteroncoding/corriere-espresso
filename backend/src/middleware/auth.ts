import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    utente?: { utenteId: number; email: string; admin: boolean };
}

export function verificaToken(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ errore: 'Token mancante' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
        req.utente = decoded;
        next();
    } catch {
        res.status(403).json({ errore: 'Token non valido' });
    }
}

export function soloAdmin(req: AuthRequest, res: Response, next: NextFunction) {
    if (!req.utente?.admin) {
        res.status(403).json({ errore: 'Accesso riservato agli amministratori' });
        return;
    }
    next();
}