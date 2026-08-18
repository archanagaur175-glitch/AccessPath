import { NextResponse } from "next/server";
import { getColleges } from "@/lib/data/colleges";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const colleges = await getColleges();
    return NextResponse.json({ colleges });
  } catch {
    return NextResponse.json({ error: "Could not load colleges." }, { status: 500 });
  }
}
