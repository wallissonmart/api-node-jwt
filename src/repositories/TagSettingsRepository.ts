import { Tag } from "../models/Tag";

export type TagBase = Omit<Tag, 'createdAt' | 'users'>

export type TagResponse = TagBase
