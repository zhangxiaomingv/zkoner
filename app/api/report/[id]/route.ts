import { NextRequest, NextResponse } from "next/server";
import { getResult } from "@/lib/store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const result = getResult(id);

  if (!result) {
    return NextResponse.json(
      { error: "Report not found. The scan may have expired." },
      { status: 404 },
    );
  }

  return NextResponse.json(result);
}
