import ClientExample from "@/components/ClientComponent";
import { fetchUser } from "@/lib";

export default async function Home() {
  const user = await fetchUser();
  if (user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <p>{user.posts[0].title}</p>
        <p>{user.posts[0].content}</p>
        <ClientExample />
      </main>
    );
  }
  return <p>Welcome to our site</p>;
}
