import { NextResponse } from "next/server";
import { db, sessionDb } from "@/database";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { Session } from "@/database/sessionstore";

export async function POST(req: Request) {
  const cookieStore = cookies();
  const { username, password } = await req.json();
  const user = await db.retrieveUserByUsername(username);
  if (!user)
    return NextResponse.json({ success: false, error: "User does not exist" });

  try {
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass)
      return NextResponse.json({
        success: false,
        error: "Invalid Credentials",
      });

    // set the expiry time as 3600s (60min) after the current time
    const now = new Date();
    const expiresAt = new Date(+now + 3600 * 1000);

    const session = new Session(user.id, expiresAt);
    const sessionId = await sessionDb.addSession(session);

    cookieStore.set("session_token", sessionId, { expires: expiresAt });

    delete user["password"];
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.log(error);
    NextResponse.json({ success: false, error: "Invalid Credentials" });
  }
}
