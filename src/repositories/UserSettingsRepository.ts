import { User } from '../models/User';
import { TagResponse } from './TagSettingsRepository';

export interface CreateUserParams {
  name: string;
  email: string;
  password: string;
  tagsId: number[];
}

export interface UpdateUserParams {
  name: string;
  tagsId: number[];
}

export type UserBase = Omit<
  User,
  'createdAt' | 'updateAt' | 'password' | 'tags'
>;

export type CreatedUser = UserBase;

export type UpdatedUser = UserBase;

export interface VerifiedUser extends UserBase {
  password: string;
}

export type SearchedUser = UserBase;

export interface UserResponse extends UserBase {
  tags: TagResponse[];
}
