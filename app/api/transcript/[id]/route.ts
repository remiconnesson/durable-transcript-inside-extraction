import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const transcriptPath = path.join(
      process.cwd(),
      "transcript",
      `${id}.md`
    );

    const content = await fs.readFile(transcriptPath, "utf-8");

    return NextResponse.json({
      id,
      content,
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        id,
        error: "Transcript not found",
        success: false,
      },
      { status: 404 }
    );
  }
}
