import { IPost } from "./IPost";

export interface IUser {
  id: string;
  username: string;
  password: string;
  posts: IPost[];
}
