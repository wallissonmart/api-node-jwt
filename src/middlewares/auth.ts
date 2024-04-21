import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../helpers/api-errors';
import { UserRepository } from '../repositories/UserRepository';

type JwtPayload = {
  id: number;
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userRepository = new UserRepository();
  const { authorization } = req.headers;

  try {
    if (!authorization) {
      throw new UnauthorizedError('Não autorizado');
    }

    const token = authorization.split(' ')[1];

    const { id } = jwt.verify(token, process.env.JWT_PASS ?? '', {
      ignoreExpiration: false,
    }) as JwtPayload;

    const user = await userRepository.findByID(id);

    if (!user) {
      throw new UnauthorizedError('Não autorizado');
    }

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expirado' });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    if (error instanceof UnauthorizedError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

