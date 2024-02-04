import Link from "next/link";
import PrecursorChapterList from "@/components/pages/precursorChapterList";

export default async function Page({
  params,
}: {
  params: { chapter_id: string };
}) {
  return (
    <main>
      <Link href={"/chapters"}> 《=== back </Link>
      <div>Latest Items</div>

      <PrecursorChapterList chapterId={params.chapter_id} />
    </main>
  );
}
