import ClientExample from "@/components/ClientComponent";
import { IUser } from "@/database";
import { fetchUser } from "@/lib";

export default async function Home() {
  const user: IUser = await fetchUser();
  if (user?.posts) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        {user.posts.map((post) => (
          <div key={post.title}>
            <p>{post.title}</p>
            <p>{post.content}</p>
          </div>
        ))}

        <ClientExample />
      </main>
    );
  }
  return <p>Welcome to our site</p>;
}
