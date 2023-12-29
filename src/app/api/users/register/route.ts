import { NextResponse } from "next/server";
import { database } from "@/database";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const { username, password } = await request.json();

  // Check if user already exists
  const existingUser = database.find((user) => user.username === username);
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
  database.push(user);

  const token = jwt.sign({ userId: user.id }, "secret");
  cookieStore.set("token", token);

  // @ts-ignore
  delete user["password"];
  return NextResponse.json({ success: true, user, token });
}
