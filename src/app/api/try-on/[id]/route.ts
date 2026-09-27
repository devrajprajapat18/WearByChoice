import { NextResponse } from "next/server";
import { getJobs } from "@/lib/tryon-jobs";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const job = getJobs().get(params.id);
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  return NextResponse.json({ id: params.id, ...job });
}
