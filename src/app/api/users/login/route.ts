import { NextResponse } from "next/server";
import { IUser, db } from "@/database";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { Session, mySessionStore } from "@/database/sessionstore";

export async function POST(req: Request, res: Response) {
  const cookieStore = cookies();
  const { username, password } = await req.json();
  const user = (await db.getData()).find(
    (user: IUser) => user.username === username
  );
  if (!user)
    return NextResponse.json({ success: false, error: "User does not exist" });

  try {
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass)
      return NextResponse.json({
        success: false,
        error: "Invalid Credentials",
      });

    // set the expiry time as 120s after the current time
    const now = new Date();
    const expiresAt = new Date(+now + 120 * 1000);

    const session = new Session(user.id, expiresAt);
    const sessionId = mySessionStore.addSession(session);

    cookieStore.set("session_token", sessionId, { expires: expiresAt });

    delete user["password"];
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.log(error);
    NextResponse.json({ success: false, error: "Invalid Credentials" });
  }
}
