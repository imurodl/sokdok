import { getText } from "@/lib/texts";
import { ReadingSession } from "@/components/ReadingSession";
import { LocalReader } from "@/components/LocalReader";

export default async function ReadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const text = getText(id);
  // Seed texts resolve on the server; imported texts live in localStorage and
  // are resolved on the client.
  if (text) return <ReadingSession text={text} />;
  return <LocalReader id={id} />;
}
