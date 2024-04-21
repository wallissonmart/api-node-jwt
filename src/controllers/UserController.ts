import { Request, Response } from 'express';
import { UserRepository } from '../repositories/UserRepository';
import bcrypt from 'bcrypt';
import { CreateUserParams } from '../repositories/UserSettingsRepository';
import { BadRequestError } from '../helpers/api-errors';
import jwt from 'jsonwebtoken';

export class UserController {
  constructor(private readonly userRepository: UserRepository) {}

  async create(req: Request, res: Response) {
    const { name, email, password, tagsId } = req.body;

    const requiredFields = ['name', 'email', 'password', 'tagsId'];

    for (const field of requiredFields) {
      if (!req.body?.[field as keyof CreateUserParams]?.length) {
        throw new BadRequestError(`Campo ${field} é obrigatório!`);
      }
    }

    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) {
      throw new BadRequestError('E-mail já existe');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userRepository.create({
      name,
      email,
      password: hashPassword,
      tagsId,
    });

    return res.status(201).json(newUser);
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new BadRequestError('E-mail ou senha inválidos');
    }

    const verifyPass = await bcrypt.compare(password, user.password);

    if (!verifyPass) {
      throw new BadRequestError('E-mail ou senha inválidos');
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_PASS ?? '', {
      expiresIn: '8h',
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...loggedUser } = user;

    return res.json({
      user: loggedUser,
      token: token,
    });
  }

  async update(req: Request, res: Response) {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      throw new BadRequestError('Parâmetro de ID inválido');
    }

    const userId = parseInt(id);

    if (isNaN(userId)) {
      throw new BadRequestError('ID deve ser um número inteiro válido');
    }

    const { name, tagsId } = req.body;

    const user = await this.userRepository.findByID(userId);

    if (!user) {
      throw new BadRequestError('Usuário não encontrado!');
    }

    const updatedUser = await this.userRepository.update(userId, {
      name,
      tagsId,
    });

    return res.status(200).json(updatedUser);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      throw new BadRequestError('Parâmetro de ID inválido');
    }

    const userId = parseInt(id);

    if (isNaN(userId)) {
      throw new BadRequestError('ID deve ser um número inteiro válido');
    }

    const user = await this.userRepository.findByID(userId);

    if (!user) {
      throw new BadRequestError('Usuário não encontrado!');
    }

    await this.userRepository.delete(userId);

    return res.status(200).json({ message: 'Usuário excluído com sucesso!' });
  }

  async getAll(req: Request, res: Response) {
    const allUsers = await this.userRepository.getAll();

    return res.status(200).json(allUsers);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      throw new BadRequestError('Parâmetro de ID inválido');
    }

    const userId = parseInt(id);

    if (isNaN(userId)) {
      throw new BadRequestError('ID deve ser um número inteiro válido');
    }

    const user = await this.userRepository.findByID(userId);

    if (!user) {
      throw new BadRequestError('Usuário não encontrado!');
    }

    return res.status(200).json(user);
  }
}

/*async getById(req: Request, res: Response) {
  const { id } = req.params;

  const user = await this.userRepository.findByID(parseInt(id));

  if (!user) {
    throw new BadRequestError('Usuário não encontrado!');
  }

  return res.status(200).json(user);
}*/
