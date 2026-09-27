import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface UserRecord { id: string; name: string; email: string; passwordHash: string; createdAt: string; }

const users = new Map<string, UserRecord>(); // key: email (demo store; production uses Prisma/Postgres)

export async function registerUser(name: string, email: string, password: string): Promise<UserRecord> {
  const key = email.toLowerCase();
  if (users.has(key)) throw new Error("Email already registered");
  const passwordHash = await bcrypt.hash(password, 10);
  const user: UserRecord = { id: "u_" + Math.random().toString(36).slice(2, 10), name, email: key, passwordHash, createdAt: new Date().toISOString() };
  users.set(key, user);
  return user;
}

export async function verifyUser(email: string, password: string): Promise<UserRecord | null> {
  const user = users.get(email.toLowerCase());
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

export function signToken(user: UserRecord): string {
  return jwt.sign({ sub: user.id, email: user.email, name: user.name }, process.env.AUTH_SECRET ?? "dev-secret-change-me", { expiresIn: "7d" });
}

export function verifyToken(token: string): { sub: string; email: string; name: string } | null {
  try {
    return jwt.verify(token, process.env.AUTH_SECRET ?? "dev-secret-change-me") as { sub: string; email: string; name: string };
  } catch { return null; }
}
