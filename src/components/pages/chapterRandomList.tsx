"use client";

import Link from "next/link";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { ChapterListResponse } from "@/interface/chapterListResponse";

export default function ChapterRandomList() {
  const { data, error, isLoading } = useSWR<ChapterListResponse>(
    "/api/chapters/random",
  );

  const storyListData = data?.chapters || [];

  return (
    <main>
      <div>Here is the strory list</div>
      {storyListData.map((story) => (
        <Button key={story.id} asChild>
          <Link href={`chapters/${story.id}`}>
            {story.id} {story.content}
          </Link>
        </Button>
      ))}
    </main>
  );
}
