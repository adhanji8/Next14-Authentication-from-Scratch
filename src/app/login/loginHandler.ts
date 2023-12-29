export default async function loginUser(username: string, password: string) {
  const res = await fetch("/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const userResponse = await res.json();
  if (userResponse.error) {
    return { error: userResponse.error, user: null };
  }
  return { error: null, user: userResponse.user };
}
