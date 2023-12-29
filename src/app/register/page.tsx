"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import registerUser from "./registerHandler";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  async function handleRegister(e: React.FormEvent<RegisterForm>) {
    e.preventDefault();
    await registerUser(username, password);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <form
        onSubmit={handleRegister}
        className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-md mx-auto"
        data-v0-t="card"
      >
        <div className="flex flex-col space-y-1.5 p-6">
          {error}
          <h3 className="font-semibold tracking-tight text-2xl text-center">
            Welcome
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            Please enter a username and password to sign up.
          </p>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
            />
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
          </div>
        </div>
        <div className="flex items-center p-6">
          <button
            disabled={username === "" || password === ""}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

interface FormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  password: HTMLInputElement;
}

interface RegisterForm extends HTMLFormElement {
  readonly elements: FormElements;
}
