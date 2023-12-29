import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { database } from "@/database";

export async function fetchUser() {
  try {
    const cookieStore = cookies();
    const userCookie = cookieStore.get("token");
    if (!userCookie) return null;

    // @ts-ignore
    const { userId } = jwt.verify(userCookie?.value, "secret");

    const user = database.find((user) => user.id === userId);
    // @ts-ignore
    delete user?.password;
    return user;
  } catch (e) {
    console.log(e);
    return null;
  }
}
