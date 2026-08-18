import { NextRequest, NextResponse } from "next/server";
import { getEssaysForStudent, getEssayById } from "@/lib/data/essays";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const studentId = request.nextUrl.searchParams.get("student_id");
  try {
    if (studentId) {
      const essays = await getEssaysForStudent(studentId);
      return NextResponse.json({ essays });
    }
    const essayId = request.nextUrl.searchParams.get("id");
    if (essayId) {
      const essay = await getEssayById(essayId);
      if (!essay)
        return NextResponse.json({ error: "Essay not found." }, { status: 404 });
      return NextResponse.json({ essay });
    }
    return NextResponse.json({ error: "Provide ?id= or ?student_id=." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Could not load essays." }, { status: 500 });
  }
}
