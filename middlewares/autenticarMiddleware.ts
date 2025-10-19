import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface RequestConUsuario extends Request {
    userId?: string;
}

export const verificarToken = (req: RequestConUsuario, res: Response, next: NextFunction) => {

    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ msg: 'No autorizado. No se proveyó un token.' });
    }

    try {
        const decodificado = jwt.verify(token, process.env.JWTSIGN || 'c0ntr4s3n4sup3rs3cr3t4') as { id: string };
        req.userId = decodificado.id;
        next();
    } catch (error) {
        return res.status(401).json({ msg: 'No autorizado. El token no es válido.' });
    }
};