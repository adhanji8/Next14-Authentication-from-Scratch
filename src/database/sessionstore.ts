import fs from "node:fs";

interface IStorable {
  add(session: Session): string;
  delete(sessionId: string): void;
  get(sessionId: string): Session | null;
}

class FileStore implements IStorable {
  add(session: Session): string {
    if (!fs.existsSync("sessionStore.json")) {
      fs.writeFileSync("sessionStore.json", JSON.stringify({}));
    }
    const sessionStore = JSON.parse(
      fs.readFileSync("sessionStore.json", "utf8")
    );
    const sessionId = crypto.randomUUID();
    sessionStore[sessionId] = session;
    fs.writeFileSync("sessionStore.json", JSON.stringify(sessionStore));
    return sessionId;
  }
  delete(sessionId: string): void {
    const sessionStore = JSON.parse(
      fs.readFileSync("sessionStore.json", "utf8")
    );
    delete sessionStore[sessionId];
  }
  get(sessionId: string): Session | null {
    const sessionStore = JSON.parse(
      fs.readFileSync("sessionStore.json", "utf8")
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
  constructor(store: IStorable) {
    this.store = store;
  }

  // Adds session to session store and returns sid
  addSession(session: Session): string {
    const sessionId = this.store.add(session);
    return sessionId;
  }

  deleteSession(sessionId: string) {
    this.store.delete(sessionId);
  }

  getSession(sessionId: string): Session | null {
    return this.store.get(sessionId);
  }
}
export class Session {
  private userId;
  private expiresAt;

  constructor(userId: string, expiresAt: Date) {
    this.userId = userId;
    this.expiresAt = expiresAt;
  }

  getData() {
    return this.userId;
  }

  isExpired() {
    return this.expiresAt < new Date();
  }
}

export const mySessionStore = new SessionStore(new FileStore());
