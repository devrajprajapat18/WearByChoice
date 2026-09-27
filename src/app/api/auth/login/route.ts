import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyUser, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = z.object({ email: z.string().email(), password: z.string().min(1) }).parse(await req.json());
    const user = await verifyUser(email, password);
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    const res = NextResponse.json({ id: user.id, name: user.name, email: user.email });
    res.cookies.set("wbc_token", signToken(user), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
    return res;
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 400 });
  }
}
