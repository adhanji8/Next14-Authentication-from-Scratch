import { cookies } from "next/headers";
import { db, sessionDb } from "@/database";

export async function fetchUser() {
  try {
    const cookieStore = cookies();
    const sessionId = cookieStore.get("session_token")?.value;

    if (!sessionId) return null;

    const userSession = await sessionDb.getSession(sessionId);
    if (!userSession) return null;

    if (userSession.isExpired()) {
      sessionDb.deleteSession(sessionId);
      return null;
    }

    const user = await db.retrieveUserById(userSession.getUserId());

    if (!user) return null;
    delete user?.password;
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}
