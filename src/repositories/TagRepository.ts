import prisma from '../config/prisma';
import { TagResponse } from './TagSettingsRepository';

export class TagRepository {
  private tagBaseSelect = {
    id: true,
    name: true,
    createdAt: false,
    users: false,
  };

  public async getAll(): Promise<TagResponse[]> {
    const allTags = await prisma.tag.findMany({
      select: { ...this.tagBaseSelect },
    });

    return allTags;
  }
}
