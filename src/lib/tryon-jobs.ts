const jobs = new Map<string, { status: string; resultImage: string | null; products: unknown[]; error?: string; message?: string }>();
export function getJobs() { return jobs; }
