"use client";

import { useUserContext } from "@/contexts/user-context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import loginUser from "./loginHandler";
import Link from "next/link";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUserContext();

  const router = useRouter();

  async function handleLogin(e: React.FormEvent<RegisterForm>) {
    e.preventDefault();
    const { error, user } = await loginUser(username, password);
    if (error) {
      setUsername("");
      setPassword("");
      return toast.error(error);
    }
    router.push("/");
    router.refresh();
    setUser(user);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <form
        onSubmit={handleLogin}
        className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-md mx-auto"
        data-v0-t="card"
      >
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="font-semibold tracking-tight text-2xl text-center">
            Welcome Back!
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            Please enter your username and password to log in.
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
            Log In
          </button>
        </div>
      </form>
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-600">Dont have an account?</span>
        <Link className="text-blue-500 hover:underline ml-2" href="/register">
          Sign Up
        </Link>
      </div>
      <Toaster richColors />
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
