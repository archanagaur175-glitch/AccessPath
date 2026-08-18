import { NextResponse } from "next/server";
import { getResources } from "@/lib/data/resources";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const resources = await getResources();
    return NextResponse.json({ resources });
  } catch {
    return NextResponse.json({ error: "Could not load resources." }, { status: 500 });
  }
}
