import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SummarizeButton } from "@/components/summarize-button";

async function getTranscript(id: string) {
  const res = await fetch(`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/api/transcript/${id}`, {
    cache: 'no-store'
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function Home() {
  const transcript = await getTranscript('transcript1');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-6">
      <Card className="w-full max-w-2xl border border-black">
        <CardHeader>
          <CardTitle>Durable Transcript Insight Extraction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link
            href="/blog"
            className="inline-block rounded-md border px-3 py-2 text-sm font-medium hover:bg-zinc-100"
          >
            Visit the MDX blog
          </Link>
        </CardContent>
      </Card>

      <Card className="w-full max-w-2xl border border-black">
        <CardHeader>
          <CardTitle>Transcript: {transcript?.id || 'Not found'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {transcript ? (
            <>
              <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-md overflow-auto max-h-96">
                {transcript.content}
              </pre>
              <SummarizeButton transcriptId={transcript.id} />
            </>
          ) : (
            <p className="text-muted-foreground">Failed to load transcript</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
