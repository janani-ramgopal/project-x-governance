import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const apiBase =
    process.env.API_INTERNAL_BASE || process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

  const upstream = await fetch(`${apiBase}/models/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-actor": "interview-demo",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await upstream.json().catch(() => ({}));
  return NextResponse.json(data, { status: upstream.status });
}
