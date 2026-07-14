import { notFound } from "next/navigation";
import { getText } from "@/lib/texts";
import { ReadingSession } from "@/components/ReadingSession";

export default async function ReadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const text = getText(id);
  if (!text) notFound();
  return <ReadingSession text={text} />;
}
