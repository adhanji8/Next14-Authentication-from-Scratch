import fs from "node:fs/promises";

export interface IPost {
  title: string;
  content: string;
}
export interface IUser {
  id: string;
  username: string;
  password: string;
  posts: IPost[];
}

class MockDatabase {
  private filename: string;
  constructor(filename: string) {
    this.filename = filename;
  }

  async add(user: IUser) {
    const data = JSON.parse(await fs.readFile(this.filename, "utf8"));
    data.push(user);
    fs.writeFile(this.filename, JSON.stringify(data, null, 2));
  }

  async getData() {
    const data = JSON.parse(await fs.readFile(this.filename, "utf8"));
    return data;
  }
}

export const db = new MockDatabase("fakedatabase.json");
