import ChapterSkeleton from "@/components/pages/ChapterSkeleton";
import ChapterItem from "@/components/pages/ChapterItem";
import { Chapter } from "@/interface/chapter";

export default function ChapterList({
  isLoading,
  chapterListData,
  isHighLight,
}: {
  isLoading: boolean;
  chapterListData: Chapter[];
  isHighLight?: boolean;
}) {
  return isLoading ? (
    <ChapterSkeleton />
  ) : (
    <>
      {chapterListData.slice(0, chapterListData.length - 1).map((chapter) => (
        <ChapterItem showSiblingCount key={chapter.id} chapter={chapter} />
      ))}
      {chapterListData.slice(-1).map((chapter) => (
        <ChapterItem
          showSiblingCount
          key={chapter.id}
          isHighLight={isHighLight}
          chapter={chapter}
        />
      ))}
    </>
  );
}
