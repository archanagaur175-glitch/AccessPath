import { NextResponse } from "next/server";
import { getAdvisors } from "@/lib/data/advisors";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const advisors = await getAdvisors();
    return NextResponse.json({ advisors });
  } catch {
    return NextResponse.json({ error: "Could not load advisors." }, { status: 500 });
  }
}
