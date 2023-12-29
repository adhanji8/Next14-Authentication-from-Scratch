import { NextResponse } from "next/server";
import { database } from "@/database";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export async function POST(req: Request, res: Response) {
  const cookieStore = cookies();
  const { username, password } = await req.json();

  // Check if user exists
  const user = database.find((user) => user.username === username);
  if (!user)
    return NextResponse.json({ success: false, error: "User does not exist" });

  try {
    console.log("comparing begins");
    const validPass = await bcrypt.compare(password, user.password);
    console.log(validPass);
    if (!validPass)
      return NextResponse.json({
        success: false,
        error: "Invalid Credentials",
      });
    const token = jwt.sign({ userId: user.id }, "secret");
    cookieStore.set("token", token);

    // @ts-ignore fix later
    delete user["password"];
    return NextResponse.json({ success: true, user, token });
  } catch (error) {
    console.log("the eror");
    NextResponse.json({ success: false, error: "Invalid Credentials" });
  }
}
