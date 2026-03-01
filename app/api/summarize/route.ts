import { start, getRun } from "workflow/api";
import { summarizeTranscriptWorkflow } from "@/workflows/summarize-transcript";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { transcriptId } = await request.json();

  if (!transcriptId) {
    return NextResponse.json(
      { error: "transcriptId is required" },
      { status: 400 }
    );
  }

  // Start the workflow - executes asynchronously
  const { runId } = await start(summarizeTranscriptWorkflow, [transcriptId]);

  return NextResponse.json({
    message: "Summarization workflow started",
    runId,
    transcriptId,
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const runId = searchParams.get("runId");

  if (!runId) {
    return NextResponse.json(
      { error: "runId query parameter is required" },
      { status: 400 }
    );
  }

  const run = await getRun(runId);

  return NextResponse.json({
    runId,
    status: run.status,
    output: run.output,
  });
}
