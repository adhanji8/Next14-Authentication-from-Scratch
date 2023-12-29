import { NextResponse } from "next/server";
import { IUser, db } from "@/database";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const existingUser = (await db.getData()).find(
    (user: IUser) => user.username === username
  );
  if (existingUser)
    return NextResponse.json({ success: false, error: "User already exists" });

  // If no user, create and insert them into the database

  const hashedPassword = await bcrypt.hash(password, 14);
  const user = {
    id: randomUUID(),
    username,
    password: hashedPassword,
    posts: [],
  };

  db.add(user);

  return NextResponse.json({ success: true });
}
