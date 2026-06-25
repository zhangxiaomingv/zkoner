import { NextRequest, NextResponse } from "next/server";
import { scanUrl } from "@/lib/scanner";
import { formatUrl } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawUrl = body.url as string;

    if (!rawUrl || typeof rawUrl !== "string") {
      return NextResponse.json(
        { error: "Please provide a valid URL" },
        { status: 400 },
      );
    }

    const url = formatUrl(rawUrl);

    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format. Please enter a valid website URL." },
        { status: 400 },
      );
    }

    const result = await scanUrl(url);

    return NextResponse.json({ id: result.id });
  } catch (error) {
    console.error("Scan error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Scan failed — please try again",
      },
      { status: 500 },
    );
  }
}
