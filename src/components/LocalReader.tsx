"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Text } from "@/lib/types";
import { getLocalText } from "@/lib/localTexts";
import { ReadingSession } from "./ReadingSession";

// Resolves an imported text from localStorage on the client (seed texts are
// resolved server-side in read/[id]/page.tsx before this renders).
export function LocalReader({ id }: { id: string }) {
  const [text, setText] = useState<Text | null | undefined>(undefined);

  useEffect(() => {
    setText(getLocalText(id) ?? null);
  }, [id]);

  if (text === undefined) {
    return <p className="text-text-dim">Loading…</p>;
  }
  if (text === null) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Text not found</h1>
        <p className="text-text-dim">
          This text isn&apos;t in the seed library or your imported texts on this device.
        </p>
        <Link href="/" className="inline-block rounded-lg bg-accent px-4 py-2 font-medium text-white">
          Back to library
        </Link>
      </div>
    );
  }
  return <ReadingSession text={text} />;
}
