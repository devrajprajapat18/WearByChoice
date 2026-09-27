import { NextResponse } from "next/server";
import { registerUser, signToken } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const body = registerSchema.parse(await req.json());
    const user = await registerUser(body.name, body.email, body.password);
    const res = NextResponse.json({ id: user.id, name: user.name, email: user.email });
    res.cookies.set("wbc_token", signToken(user), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
    return res;
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Registration failed" }, { status: 400 });
  }
}
