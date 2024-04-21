import { Tag } from "./Tag";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updateAt: Date;
  tags: Tag[];
}

