import { IUser } from "@/interfaces";
import fs from "node:fs/promises";
import { PrismaClient } from "@prisma/client";
import { PrismaStore, SessionStore } from "./sessionstore";

interface IStorable<T> {
  add(entity: T): Promise<void>;
  // retrieveUser(id: string): Promise<IUser | null>;
  retrieveUserById(id: string): any; // TODO FIX
  retrieveUserByUsername(username: string): any; // TODO FIX
}

class JsonDatabase implements IStorable<IUser> {
  private filename: string;
  constructor(filename: string) {
    this.filename = filename;
  }
  async add(entity: IUser): Promise<void> {
    const data = JSON.parse(await fs.readFile(this.filename, "utf8"));
    data.push(entity);
    fs.writeFile(this.filename, JSON.stringify(data, null, 2));
  }

  async retrieveUserById(id: string): Promise<IUser | null> {
    const data = await this.getData();
    const user = data.find((user: IUser) => user.id === id);
    if (!user) return null;
    return user;
  }

  async retrieveUserByUsername(username: string): Promise<IUser | null> {
    const data = await this.getData();
    const user = data.find((user: IUser) => user.username === username);
    if (!user) return null;
    return user;
  }

  private async getData(): Promise<IUser[]> {
    return JSON.parse(await fs.readFile(this.filename, "utf8"));
  }
}

class PrismaDatabase implements IStorable<IUser> {
  private client: PrismaClient;
  constructor(client: PrismaClient) {
    this.client = client;
  }
  async add(entity: IUser): Promise<void> {
    await this.client.user.create({
      data: { username: entity.username, password: entity.password },
    });
  }

  async retrieveUserById(id: string) {
    const user = await this.client.user.findUnique({
      where: { id: id },
      include: { posts: true },
    });
    if (!user) return null;
    return user;
  }

  async retrieveUserByUsername(username: string) {
    const user = await this.client.user.findUnique({
      where: { username: username },
      include: { posts: true },
    });
    if (!user) return null;
    return user;
  }
}

class Database {
  private store: IStorable<IUser>;
  constructor(store: IStorable<IUser>) {
    this.store = store;
  }

  async add(user: IUser) {
    this.store.add(user);
  }

  async retrieveUserById(id: string) {
    return this.store.retrieveUserById(id);
  }

  async retrieveUserByUsername(username: string) {
    return this.store.retrieveUserByUsername(username);
  }
}

// uncomment below line to use fake json db instead
// export const db = new Database(new JsonDatabase("fakedatabase.json"));

// Prisma Database (SQlite)
export const db = new Database(new PrismaDatabase(new PrismaClient()));

export const sessionDb = new SessionStore(new PrismaStore(new PrismaClient()));
