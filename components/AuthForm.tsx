"use client"
import Link from "next/link";
import { useState } from "react";

export const AuthForm = ({ formState = "login", onSubmit, isLoading }: { formState?: "login" | "register", onSubmit: (email: string, password: string) => void, isLoading: boolean }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
      <h2 className="text-2xl font-serif font-medium mb-8">{formState === "login" ? "Sign in": "Sign Up"}</h2>

      <div className="space-y-1">
        <label className="text-sm text-muted-foreground font-sans">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full bg-transparent border-b border-border py-3 text-foreground font-sans outline-none focus:border-foreground transition-colors"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-muted-foreground font-sans">Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full bg-transparent border-b border-border py-3 text-foreground font-sans outline-none focus:border-foreground transition-colors"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-primary-foreground py-3.5 rounded-full font-sans font-medium hover:opacity-90 transition-opacity"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : formState === "login" ? "Sign in": "Sign Up"}
      </button>
      {formState === "register" ? (
        <p className="text-sm text-muted-foreground font-sans text-center">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-foreground underline underline-offset-4">
            Sign in
          </Link>
        </p>
      ) : (<p className="text-sm text-muted-foreground font-sans text-center">
        {"Don't have an account? "}
        <Link href="/auth/register" className="text-foreground underline underline-offset-4">
          Sign up
        </Link>
      </p>)}
    </form>
  );
};
