import { Request, Response } from 'express';
import { TagRepository } from '../repositories/TagRepository';

export class TagController {
  constructor(private readonly tagRepository: TagRepository) {}

  async getAll(req: Request, res: Response) {
    const allTags = await this.tagRepository.getAll();

    return res.status(200).json(allTags);
  }
}
