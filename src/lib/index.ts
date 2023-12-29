import { cookies } from "next/headers";
import { IUser, db } from "@/database";
import { mySessionStore } from "@/database/sessionstore";

export async function fetchUser() {
  try {
    const cookieStore = cookies();
    const sessionId = cookieStore.get("session_token")?.value;

    if (!sessionId) return null;

    const userSession = mySessionStore.getSession(sessionId);
    if (!userSession) return null;

    if (userSession.isExpired()) {
      mySessionStore.deleteSession(sessionId);
      return null;
    }

    const user = (await db.getData()).find(
      (user: IUser) => user.id === userSession.getData()
    );
    if (!user) return null;
    delete user?.password;
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}
