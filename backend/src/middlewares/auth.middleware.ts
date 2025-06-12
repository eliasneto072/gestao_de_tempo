import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 1. Declarando uma interface estendida para o Request
declare module 'express' {
  interface Request {
    userId?: string;
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    // 2. Verificação segura do token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string }; // CORRIGIDO: id como string (UUID)
    
    // 3. Atribuição tipada corretamente
    req.userId = decoded.id;
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};