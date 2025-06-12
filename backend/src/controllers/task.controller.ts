import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { title } = req.body;

    if (!title || typeof title !== 'string') {
      res.status(400).json({ error: 'Título inválido' });
      return;
    }

    const task = await prisma.task.create({ 
      data: { 
        title, 
        userId 
      } 
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
};

// Corrigindo a ordenação
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    
    const tasks = await prisma.task.findMany({ 
      where: { userId },
      orderBy: {
        id: 'desc' // Use 'id' ou outro campo existente
        // Ou se adicionou createdAt no modelo:
        // createdAt: 'desc'
      }
    });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar tarefas' });
  }
};


export const toggleComplete = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const taskId = req.params.id;

    const task = await prisma.task.findFirst({ 
      where: { 
        id: taskId,
        userId 
      } 
    });

    if (!task) {
      res.status(404).json({ error: 'Tarefa não encontrada' });
      return;
    }

    const [updatedTask, user] = await prisma.$transaction([
      prisma.task.update({
        where: { id: taskId },
        data: { completed: !task.completed }
      }),
      prisma.user.findUnique({
        where: { id: userId }
      })
    ]);

    if (!task.completed) {
      const newPoints = user!.points + 10;
      const newLevel = Math.floor(newPoints / 100) + 1;
      const remainingPoints = newPoints % 100;

      await prisma.user.update({
        where: { id: userId },
        data: { 
          points: remainingPoints,
          level: newLevel
        }
      });

      (updatedTask as any).pointsEarned = 10;
      (updatedTask as any).newLevel = newLevel;
    }

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
};
