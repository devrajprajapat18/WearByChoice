"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [me, setMe] = useState<{ name: string; email: string } | null>(null);
  const router = useRouter();
  useEffect(() => {
    fetch("/api/auth/me").then(async (r) => {
      if (!r.ok) { router.push("/login"); return; }
      setMe(await r.json());
    });
  }, [router]);
  if (!me) return <div className="p-10 text-center">Loading profile…</div>;
  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black">Profile</h1>
      <div className="card p-6 mt-4">
        <p className="font-bold">{me.name}</p>
        <p className="text-sm text-black/60">{me.email}</p>
        <button className="btn-ghost mt-4" onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); }}>Logout</button>
      </div>
    </div>
  );
}
