"use client";

import Link from "next/link";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { ChapterListResponse } from "@/interface/chapterListResponse";

export default function PrecursorChapterList({
  chapterId,
}: {
  chapterId: string;
}) {
  const { data, error, isLoading } = useSWR<ChapterListResponse>(
    `/api/chapters/${chapterId}/up`,
  );

  const storyListData = data?.chapters || [];

  return (
    <main>
      {storyListData.map((story) => (
        <div key={story.id}>
          {story.id} {story.content}
        </div>
      ))}
    </main>
  );
}
