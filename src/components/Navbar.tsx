import { fetchUser } from "@/lib";
import Nav from "./Nav";

export default async function NavLinks() {
  const user = await fetchUser();

  return <Nav user={user} />;
}
