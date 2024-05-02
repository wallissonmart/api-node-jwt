import prisma from '../config/prisma';
import { TagResponse } from './TagSettingsRepository';

export class TagRepository {
  private userBaseSelect = {
    id: true,
    name: true,
    createdAt: false,
    users: false,
  };

  public async getAll(): Promise<TagResponse[]> {
    const allTags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        createdAt: false,
        users: false,
      },
    });

    return allTags;
  }
}
