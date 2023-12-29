"use client";

import { useUserContext } from "@/contexts/user-context";

export default function ClientExample() {
  const { user } = useUserContext();

  return <p>The user is {user.username == "" ? "no user" : user.username}</p>;
}
