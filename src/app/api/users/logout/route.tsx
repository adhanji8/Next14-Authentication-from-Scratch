import { mySessionStore } from "@/database/sessionstore";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("session_token");
  if (!sessionToken) return null;

  cookieStore.delete("session_token");
  mySessionStore.deleteSession(sessionToken.value);

  cookieStore.set("session_token", "", { expires: new Date() });

  return NextResponse.json({ success: true });
}
