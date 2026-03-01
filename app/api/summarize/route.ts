import { start, getRun } from "workflow/api";
import { summarizeTranscriptWorkflow } from "@/workflows/summarize-transcript";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log("[v0] POST /api/summarize called");
  const { transcriptId } = await request.json();
  console.log("[v0] Received transcriptId:", transcriptId);

  if (!transcriptId) {
    console.log("[v0] Error: transcriptId is required");
    return NextResponse.json(
      { error: "transcriptId is required" },
      { status: 400 }
    );
  }

  // Start the workflow - executes asynchronously
  console.log("[v0] Starting workflow...");
  const { runId } = await start(summarizeTranscriptWorkflow, [transcriptId]);
  console.log("[v0] Workflow started with runId:", runId);

  return NextResponse.json({
    message: "Summarization workflow started",
    runId,
    transcriptId,
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const runId = searchParams.get("runId");
  console.log("[v0] GET /api/summarize called with runId:", runId);

  if (!runId) {
    console.log("[v0] Error: runId is required");
    return NextResponse.json(
      { error: "runId query parameter is required" },
      { status: 400 }
    );
  }

  console.log("[v0] Getting run status...");
  const run = getRun(runId);
  const status = await run.status;
  const result = await run.result;
  console.log("[v0] Run status:", status, "result:", result ? "present" : "null");

  return NextResponse.json({
    runId,
    status,
    output: result,
  });
}
