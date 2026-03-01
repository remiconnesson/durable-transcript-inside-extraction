import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-96 border border-black">
        <CardHeader>
          <CardTitle>Durable Transcript Insight Extraction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="italic">Put stuff here...</p>
          <Link
            href="/blog"
            className="inline-block rounded-md border px-3 py-2 text-sm font-medium hover:bg-zinc-100"
          >
            Visit the MDX blog
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
