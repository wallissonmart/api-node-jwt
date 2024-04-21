import { User } from "./User";

export interface Tag {
    id: number;
    name: string;
    createdAt: Date;
    users: User[];
}
