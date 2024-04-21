import prisma from '../config/prisma';
import {
  CreateUserParams,
  CreatedUser,
  SearchedUser,
  UpdateUserParams,
  UpdatedUser,
  UserResponse,
  VerifiedUser,
} from './UserSettingsRepository';

export class UserRepository {
  private userBaseSelect = {
    id: true,
    name: true,
    email: true,
    tags: {
      select: {
        id: true,
        name: true,
        createdAt: false,
        users: false,
      },
    },
    createdAt: false,
    updateAt: false,
  };

  public async findByEmail(email: string): Promise<VerifiedUser | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        ...this.userBaseSelect,
        password: true,
      },
    });

    return user || null;
  }

  public async findByID(id: number): Promise<SearchedUser | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        ...this.userBaseSelect,
        password: false,
      },
    });

    return user || null;
  }

  public async create(user: CreateUserParams): Promise<CreatedUser> {
    const createdUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        tags: { connect: user.tagsId.map((tagId) => ({ id: tagId })) },
      },
      select: {
        ...this.userBaseSelect,
        password: false,
      },
    });

    return createdUser;
  }

  public async update(
    id: number,
    user: UpdateUserParams
  ): Promise<UpdatedUser | null> {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: user.name,
        tags: { set: user.tagsId.map((tagId) => ({ id: tagId })) },
      },
      select: {
        ...this.userBaseSelect,
        password: false,
      },
    });

    return updatedUser || null;
  }

  public async delete(id: number): Promise<boolean> {
    const deletedUser = await prisma.user.delete({ where: { id } });
    return !!deletedUser;
  }

  public async getAll(): Promise<UserResponse[]> {
    const allUsers = await prisma.user.findMany({
      select: {
        ...this.userBaseSelect,
        password: false,
      },
    });
    return allUsers;
  }
}
