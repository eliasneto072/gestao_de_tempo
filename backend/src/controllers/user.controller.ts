import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = userSchema.parse(req.body);
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hashed } });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao registrar usuário' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = userSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      res.status(401).json({ error: 'Usuário não encontrado' });
      return;
    }
    
    const valid = await bcrypt.compare(password, user.password);
    
    if (!valid) {
      res.status(401).json({ error: 'Senha inválida' });
      return;
    }
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h', });
    res.json({ token });
  } catch {
    res.status(400).json({ error: 'Erro ao fazer login' });
  }
};

export const profile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }
    
    res.json({ 
      email: user.email, 
      points: user.points, 
      level: user.level 
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};