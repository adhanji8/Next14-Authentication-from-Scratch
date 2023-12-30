import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

interface IStorableSession {
  add(session: Session): Promise<string>;
  delete(sessionId: string): Promise<void>;
  retrieve(sessionId: string): Promise<Session | null>;
}

export class PrismaStore implements IStorableSession {
  private prismaClient;
  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }
  async add(session: Session): Promise<string> {
    const expiry = session.getExpiry();
    const userId = session.getUserId();
    const createdSession = await this.prismaClient.session.create({
      data: {
        expires: expiry,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return createdSession.id;
  }
  async delete(sessionId: string): Promise<void> {
    this.prismaClient.session.delete({
      where: { id: sessionId },
    });
  }
  async retrieve(sessionId: string): Promise<Session | null> {
    const foundSession = await this.prismaClient.session.findUnique({
      where: {
        id: sessionId,
      },
    });
    if (!foundSession) return null;
    return new Session(foundSession?.userId, foundSession?.expires);
  }
}

export class FileStore implements IStorableSession {
  async add(session: Session): Promise<string> {
    if (!existsSync("sessionStore.json")) {
      await fs.writeFile("sessionStore.json", JSON.stringify({}, null, 2));
    }
    const sessionStore = JSON.parse(
      await fs.readFile("sessionStore.json", "utf8")
    );
    const sessionId = crypto.randomUUID();
    sessionStore[sessionId] = session;
    await fs.writeFile(
      "sessionStore.json",
      JSON.stringify(sessionStore, null, 2)
    );
    return sessionId;
  }
  async delete(sessionId: string): Promise<void> {
    const sessionStore = JSON.parse(
      await fs.readFile("sessionStore.json", "utf8")
    );
    delete sessionStore[sessionId];
  }
  async retrieve(sessionId: string): Promise<Session | null> {
    const sessionStore = JSON.parse(
      await fs.readFile("sessionStore.json", "utf8")
    );
    const foundSession: { userId: string; expiresAt: Date } | null =
      sessionStore[sessionId];
    if (!foundSession) return null;
    // Deserialize Session
    return new Session(foundSession.userId, foundSession.expiresAt);
  }
}

export class SessionStore {
  private store;
  constructor(store: IStorableSession) {
    this.store = store;
  }

  // Adds session to session store and returns sid
  async addSession(session: Session) {
    const sessionId = await this.store.add(session);
    return sessionId;
  }

  async deleteSession(sessionId: string) {
    await this.store.delete(sessionId);
  }

  async getSession(sessionId: string) {
    const session = await this.store.retrieve(sessionId);
    if (!session) return null;
    return session;
  }
}
export class Session {
  private userId;
  private expiresAt;

  constructor(userId: string, expiresAt: Date) {
    this.userId = userId;
    this.expiresAt = expiresAt;
  }

  getUserId() {
    return this.userId;
  }

  getExpiry() {
    return this.expiresAt;
  }

  isExpired() {
    return this.expiresAt < new Date();
  }
}
