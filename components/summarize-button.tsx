"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type WorkflowStatus = "idle" | "starting" | "running" | "completed" | "failed";

interface SummarizeButtonProps {
  transcriptId: string;
}

export function SummarizeButton({ transcriptId }: SummarizeButtonProps) {
  const [status, setStatus] = useState<WorkflowStatus>("idle");
  const [runId, setRunId] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startSummarization = async () => {
    setStatus("starting");
    setError(null);
    setSummary(null);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcriptId }),
      });

      if (!response.ok) {
        throw new Error("Failed to start workflow");
      }

      const data = await response.json();
      setRunId(data.runId);
      setStatus("running");

      // Poll for completion
      pollForCompletion(data.runId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setStatus("failed");
    }
  };

  const pollForCompletion = async (id: string) => {
    const maxAttempts = 60;
    let attempts = 0;

    const poll = async () => {
      if (attempts >= maxAttempts) {
        setError("Workflow timed out");
        setStatus("failed");
        return;
      }

      try {
        const response = await fetch(`/api/summarize?runId=${id}`);
        const data = await response.json();

        if (data.status === "completed") {
          setStatus("completed");
          // Extract the assistant message content from the workflow output
          if (data.output?.messages) {
            const assistantMessage = data.output.messages.find(
              (m: { role: string }) => m.role === "assistant"
            );
            if (assistantMessage?.content) {
              // Handle both string content and array content
              const content = Array.isArray(assistantMessage.content)
                ? assistantMessage.content
                    .filter((c: { type: string }) => c.type === "text")
                    .map((c: { text: string }) => c.text)
                    .join("")
                : assistantMessage.content;
              setSummary(content);
            }
          }
          return;
        }

        if (data.status === "failed") {
          setError("Workflow failed");
          setStatus("failed");
          return;
        }

        // Continue polling
        attempts++;
        setTimeout(poll, 2000);
      } catch {
        setError("Failed to check workflow status");
        setStatus("failed");
      }
    };

    poll();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          onClick={startSummarization}
          disabled={status === "starting" || status === "running"}
        >
          {status === "starting" && "Starting..."}
          {status === "running" && "Summarizing..."}
          {status === "idle" && "Summarize Transcript"}
          {status === "completed" && "Summarize Again"}
          {status === "failed" && "Retry Summarization"}
        </Button>

        {runId && (
          <span className="text-sm text-muted-foreground">
            Run ID: {runId.slice(0, 8)}...
          </span>
        )}
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md text-sm">
          {error}
        </div>
      )}

      {summary && (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
            {summary}
          </div>
        </div>
      )}
    </div>
  );
}
