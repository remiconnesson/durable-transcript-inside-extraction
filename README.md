# Durable Transcript Insight Extraction

This repository contains a Next.js app that loads transcripts from local Markdown files and summarizes them with a durable AI workflow.

## Quick start

1. Install dependencies:

```bash
corepack pnpm install
```

2. Start the app:

```bash
corepack pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000).

## How it works

- Transcripts live in `/transcript` (for example `transcript/transcript1.md`).
- `GET /api/transcript/[id]` reads and returns transcript content.
- `POST /api/summarize` starts a durable summarization workflow for a `transcriptId`.
- `GET /api/summarize?runId=...` checks workflow status and returns output when complete.
- The workflow implementation is in `workflows/summarize-transcript.ts`.

## Common commands

```bash
corepack pnpm dev
corepack pnpm lint
corepack pnpm build
```

## Notes

- The summarization workflow uses `@workflow/ai` with `anthropic/claude-haiku-4.5`. Ensure the required provider/runtime credentials are configured in your environment before running workflow-backed requests.
- In restricted/offline environments, `pnpm build` can fail when Next.js attempts to fetch Google Fonts (`Geist`/`Geist Mono`).
