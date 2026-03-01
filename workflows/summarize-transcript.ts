import { DurableAgent } from "@workflow/ai/agent";
import { getWritable } from "workflow";
import type { UIMessageChunk } from "ai";

async function fetchTranscript(transcriptId: string) {
  "use step";
  
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : "http://localhost:3000";
    
  const response = await fetch(`${baseUrl}/api/transcript/${transcriptId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch transcript: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.content as string;
}

export async function summarizeTranscriptWorkflow(transcriptId: string) {
  "use workflow";

  // Step 1: Fetch the transcript content
  const transcriptContent = await fetchTranscript(transcriptId);

  // Step 2: Create a durable agent to summarize the transcript
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

  return {
    transcriptId,
    messages: result.messages,
  };
}
