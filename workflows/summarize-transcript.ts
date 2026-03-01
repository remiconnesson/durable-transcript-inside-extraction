import { DurableAgent } from "@workflow/ai/agent";
import { getWritable } from "workflow";
import type { UIMessageChunk } from "ai";
import { promises as fs } from "fs";
import path from "path";

async function fetchTranscript(transcriptId: string) {
  "use step";
  
  console.log("[v0] fetchTranscript step started for transcriptId:", transcriptId);
  
  const filePath = path.join(process.cwd(), "transcript", `${transcriptId}.md`);
  console.log("[v0] Reading transcript from file:", filePath);
  
  const content = await fs.readFile(filePath, "utf-8");
  
  console.log("[v0] Transcript content length:", content?.length || 0);
  return content;
}

export async function summarizeTranscriptWorkflow(transcriptId: string) {
  "use workflow";

  console.log("[v0] Workflow started for transcriptId:", transcriptId);

  // Step 1: Fetch the transcript content
  console.log("[v0] Step 1: Fetching transcript...");
  const transcriptContent = await fetchTranscript(transcriptId);
  console.log("[v0] Transcript fetched successfully, length:", transcriptContent?.length || 0);

  // Step 2: Create a durable agent to summarize the transcript
  console.log("[v0] Step 2: Creating DurableAgent...");
  const agent = new DurableAgent({
    model: "anthropic/claude-haiku-4.5",
    system: `You are an expert at analyzing transcripts and extracting useful information.

Your task is to summarize the transcript provided by the user. 

## Output Format

Provide your summary in the following structure:

### TL;DR
A concise 2-3 sentence summary of the entire transcript.

### Key Takeaways
- Bullet points of the main points to remember

### Detailed Summary
A comprehensive summary with markdown headers for structure. Include:
- Main topics discussed
- Important insights
- Notable quotes or statements (if any)

### Actionable Insights
Concrete actions or lessons that can be applied from this content.

Be concise but thorough. Focus on what's genuinely useful and memorable.`,
    temperature: 0.3,
    maxOutputTokens: 4000,
  });

  const writable = getWritable<UIMessageChunk>();
  console.log("[v0] Got writable stream");

  console.log("[v0] Starting agent.stream()...");
  const result = await agent.stream({
    messages: [
      {
        role: "user",
        content: `Please analyze and summarize the following transcript:\n\n${transcriptContent}`,
      },
    ],
    writable,
    maxSteps: 1,
  });

  console.log("[v0] Agent stream completed, messages count:", result.messages?.length || 0);

  return {
    transcriptId,
    messages: result.messages,
  };
}
