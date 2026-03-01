import { DurableAgent } from "@workflow/ai/agent";
import { getWritable } from "workflow";
import type { UIMessageChunk } from "ai";
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";

// ============================================================================
// System Prompt for Section Streaming
// ============================================================================

const STREAMED_ANALYSIS_SYSTEM_PROMPT = `
You are an expert at analyzing video transcripts and extracting genuinely USEFUL information.

## Your Task

You will be given a transcript. Analyze it and output your analysis by calling the \`emit_section\` tool for EACH section you want to include. Call the tool multiple times, once per section.

## Your Goal: Be USEFUL

The best analysis saves time and helps retain/use what was learned. Ask yourself:
- "If I watched this video, what would I want to reference later?"
- "What insights might I miss on first viewing?"
- "How can I make this content actionable?"

## Required Sections (emit in this order)

1. **tldr** - Concise summary (2-3 sentences max)
2. **detailed_summary** - Comprehensive summary with markdown headers for structure
3. **transcript_corrections** - Likely transcription errors (if any)

## Optional Sections (choose what's valuable for this content)

- **key_takeaways** - Main points to remember
- **actionable_insights** - Concrete actions to take
- **quotes** - Notable quotations worth preserving (with context)
- **mermaid_diagram** - Visual representation (use \`\`\`mermaid code block)
- **facts** - Verifiable facts mentioned
- **stories** - Narratives or anecdotes (often the most memorable parts)
- **frameworks** - Mental models, methodologies, or tools discussed
- **products_mentioned** - Tools, books, resources referenced
- **problems_solved** - Problems addressed (what -> why it matters -> solution)
- **reflection_questions** - Questions for self-reflection/application
- **counterarguments** - Opposing viewpoints mentioned or worth considering
- **prerequisites** - What you need to know/have before applying this
- **related_topics** - What to explore next
- **key_moments** - Timestamps of important moments worth rewatching

**Invent your own sections!** If this is a cooking video, maybe "ingredients" and "technique_tips". If it's a debate, maybe "argument_structure" and "logical_fallacies". Match the content.

## Rules

- Use snake_case for section keys (e.g., "key_takeaways", "action_items")
- Only include sections that are genuinely valuable for THIS content
- Quality over quantity - 5 great sections beats 15 mediocre ones
- Use markdown extensively in the markdown field (bold, italic, headers, lists, code blocks)
- For mermaid diagrams, use simple alphanumeric node IDs and <br/> instead of \\n
- Include timestamps (MM:SS or HH:MM:SS) where relevant
- Call emit_section for EACH section, in order (sectionOrder starts at 1)

## Example Tool Calls

First call:
emit_section({ sectionKey: "tldr", sectionTitle: "TL;DR", markdown: "Brief summary...", sectionOrder: 1 })

Second call:
emit_section({ sectionKey: "detailed_summary", sectionTitle: "Detailed Summary", markdown: "## Overview\\n...", sectionOrder: 2 })

And so on for each section you want to include.
`.trim();

// ============================================================================
// Tool Schema
// ============================================================================

const emitSectionSchema = z.object({
  sectionKey: z
    .string()
    .describe(
      "Unique key for this section (snake_case, e.g., 'key_takeaways')",
    ),
  sectionTitle: z
    .string()
    .nullable()
    .describe("Human-readable title for the section (e.g., 'Key Takeaways')"),
  markdown: z.string().describe("The section content in markdown format"),
  sectionOrder: z
    .number()
    .int()
    .positive()
    .describe("Order of this section in the output (1, 2, 3, ...)"),
});

async function fetchTranscript(transcriptId: string) {
  "use step";

  const filePath = path.join(process.cwd(), "transcript", `${transcriptId}.md`);
  const content = await fs.readFile(filePath, "utf-8");
  return content;
}

export async function summarizeTranscriptWorkflow(transcriptId: string) {
  "use workflow";

  // Step 1: Fetch the transcript content
  const transcriptContent = await fetchTranscript(transcriptId);

  // Step 2: Create a durable agent to summarize the transcript
  const agent = new DurableAgent({
    model: "anthropic/claude-haiku-4.5",
    system: STREAMED_ANALYSIS_SYSTEM_PROMPT,
    temperature: 0.3,
    maxOutputTokens: 4000,
    tools: {
      emit_section: {
        description: "Emit a single analysis section for the transcript",
        inputSchema: emitSectionSchema,
        execute: async (args) => args,
      },
    },
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
    maxSteps: 20,
  });

  return {
    transcriptId,
    messages: result.messages,
  };
}
