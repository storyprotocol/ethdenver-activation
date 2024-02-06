import ChapterSkeleton from "@/components/pages/ChapterSkeleton";
import ChapterItem from "@/components/pages/ChapterItem";
import { Chapter } from "@/interface/chapter";

export default function ChapterList({
  isLoading,
  chapterListData,
}: {
  isLoading: boolean;
  chapterListData: Chapter[];
}) {
  return isLoading ? (
    <ChapterSkeleton />
  ) : (
    chapterListData.map((chapter) => (
      <ChapterItem showSiblingCount key={chapter.id} chapter={chapter} />
    ))
  );
}
