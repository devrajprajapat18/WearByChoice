"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useOutfit, useSession } from "@/lib/store";
import { MOCK_PRODUCTS } from "@/lib/providers/mockProvider";
import { formatINR } from "@/lib/format";

const STEPS = ["Preparing your outfit…", "Analyzing your photo…", "Applying your selected clothes…", "Finalizing your look…"];

function TryOnInner() {
  const params = useSearchParams();
  const { items, addItem } = useOutfit();
  const { userImage, setUserImage } = useSession();
  const [rotation, setRotation] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const [result, setResult] = useState<{ id: string; resultImage: string; message?: string } | null>(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<{ id: string; image: string; date: string }[]>(() => {
    try { return JSON.parse(localStorage.getItem("wbc-tryon") ?? "[]"); } catch { return []; }
  });
  const [provider, setProvider] = useState<{ provider: string; live: boolean } | null>(null);
  useEffect(() => {
    fetch("/api/try-on").then((r) => r.json()).then(setProvider).catch(() => null);
  }, []);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const add = params.get("add");
    if (add) {
      const p = MOCK_PRODUCTS.find((x) => x.id === add);
      if (p && !items.some((i) => i.id === p.id)) addItem(p);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFile = (f: File | undefined) => {
    if (!f) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) { setError("Supported: JPG, JPEG, PNG, WEBP"); return; }
    if (f.size > 8_000_000) { setError("Image must be under 8MB"); return; }
    setError("");
    const r = new FileReader();
    r.onload = () => setUserImage(String(r.result));
    r.readAsDataURL(f);
  };

  const start = async () => {
    if (!userImage) { setError("Please upload your photo first"); return; }
    if (!items.length) { setError("Please add at least one product to your outfit"); return; }
    setError(""); setResult(null);
    let i = 0;
    setStatus(STEPS[0]);
    const timer = setInterval(() => { i = Math.min(i + 1, STEPS.length - 1); setStatus(STEPS[i]); }, 1500);
    try {
      const res = await fetch("/api/try-on", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userImage, products: items.map((p) => ({ id: p.id })) })
      });
      const job = await res.json();
      if (!res.ok) throw new Error(job.error ?? "Generation failed");
      // poll
      for (let k = 0; k < 30; k++) {
        await new Promise((r) => setTimeout(r, 1000));
        const s = await fetch(`/api/try-on/${job.id}`).then((r) => r.json());
        if (s.status === "completed") {
          clearInterval(timer);
          setStatus(null);
          setResult(s);
          const h = [{ id: s.id, image: s.resultImage, date: new Date().toISOString() }, ...history].slice(0, 20);
          setHistory(h);
          localStorage.setItem("wbc-tryon", JSON.stringify(h));
          return;
        }
        if (s.status === "failed") throw new Error(s.error ?? "Generation failed");
      }
      throw new Error("Timed out — please try again");
    } catch (e) {
      clearInterval(timer); setStatus(null);
      setError(e instanceof Error ? e.message : "Generation failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black">Virtual Try-On</h1>
      <p className="text-black/60 mt-1">For best results, upload a clear full-body photo with good lighting.</p>
      {provider && (
        <p className={`inline-block mt-3 text-xs font-semibold px-3 py-1.5 rounded-full ${provider.live ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`} role="status">
          {provider.live ? "● Live AI try-on enabled" : "● Demo preview mode — returns your photo unchanged. Add a try-on API key for real results."}
        </p>
      )}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="card p-5">
          <h2 className="font-bold">1. Upload your photo</h2>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} aria-label="Upload photo" />
          {!userImage ? (
            <button onClick={() => fileRef.current?.click()} className="mt-3 w-full border-2 border-dashed border-black/20 rounded-2xl p-10 text-black/50">Upload Image (JPG / PNG / WEBP)</button>
          ) : (
            <div className="mt-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={userImage} alt="Your uploaded photo" className="w-full rounded-2xl max-h-96 object-contain bg-black/5" style={{ transform: `rotate(${rotation}deg)` }} />
              <div className="flex gap-2 mt-3">
                <button onClick={() => setRotation((r) => (r + 90) % 360)} className="btn-ghost text-sm">Rotate</button>
                <button onClick={() => fileRef.current?.click()} className="btn-ghost text-sm">Replace</button>
                <button onClick={() => setUserImage(null)} className="btn-ghost text-sm">Delete</button>
              </div>
            </div>
          )}
          <h2 className="font-bold mt-6">2. Your outfit ({items.length})</h2>
          {items.length === 0 ? <p className="text-sm text-black/50 mt-2">Empty — <Link href="/discover" className="underline">add products</Link></p> :
            <ul className="mt-2 text-sm space-y-1">{items.map((p) => <li key={p.id}>· {p.name} — {formatINR(p.price)}</li>)}</ul>}
          <button onClick={start} disabled={!!status} className="btn-accent w-full mt-5">{status ?? "TRY IT ON"}</button>
          {status && <p className="mt-2 text-sm text-black/60 animate-pulse" role="status">{status}</p>}
          {error && <p className="mt-2 text-sm text-red-600" role="alert">{error}</p>}
        </div>
        <div className="card p-5">
          <h2 className="font-bold">Your virtual look</h2>
          {!result ? (
            <div className="mt-3 rounded-2xl bg-black/5 p-10 text-center text-black/40">Result appears here</div>
          ) : (
            <div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div>{userImage && <img src={userImage} alt="Original" className="rounded-xl" /> /* eslint-disable-line */}<p className="text-xs text-center mt-1">Original</p></div>
                <div>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={result.resultImage} alt="Try-on result" className="rounded-xl" /><p className="text-xs text-center mt-1">Try-On Result</p></div>
              </div>
              {result.message && <p className="text-xs text-black/50 mt-2">{result.message}</p>}
              <div className="flex flex-wrap gap-2 mt-4">
                <a href={result.resultImage} download="wearbychoice-look.png" className="btn-ghost text-sm">Download</a>
                <button onClick={() => { navigator.clipboard?.writeText(window.location.href); alert("Link copied"); }} className="btn-ghost text-sm">Share</button>
                <Link href="/discover" className="btn-ghost text-sm">Shop products</Link>
                <Link href="/outfit" className="btn-ghost text-sm">Try another outfit</Link>
              </div>
            </div>
          )}
          {history.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold text-sm">Previous try-ons</h3>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {history.map((h) => <img key={h.id} src={h.image} alt={`Try-on from ${h.date}`} className="rounded-lg aspect-square object-cover" />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TryOnPage() {
  return <Suspense fallback={<div className="p-10">Loading…</div>}><TryOnInner /></Suspense>;
}
