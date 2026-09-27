"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    const res = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Failed"); return; }
    router.push("/profile");
  };

  return (
    <form onSubmit={submit} className="card p-6 max-w-md mx-auto mt-10 space-y-3">
      <h1 className="text-2xl font-black">{mode === "login" ? "Login" : "Create account"}</h1>
      {mode === "register" && <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="input" aria-label="Name" required />}
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="input" aria-label="Email" required />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="input" aria-label="Password" required minLength={6} />
      {error && <p className="text-red-600 text-sm" role="alert">{error}</p>}
      <button className="btn-primary w-full">{mode === "login" ? "Login" : "Register"}</button>
      {mode === "login" ? <p className="text-sm">No account? <Link href="/register" className="underline">Register</Link></p> : <p className="text-sm">Have an account? <Link href="/login" className="underline">Login</Link></p>}
    </form>
  );
}
