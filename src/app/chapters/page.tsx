"use client";

import useSWR from "swr";
import { ChapterListResponse } from "@/interface/chapterListResponse";
import Link from "next/link";
import ChapterItem from "@/components/pages/ChapterItem";
import { Button } from "@/components/ui/button";

export default function Page() {
  const { data, isLoading, mutate } = useSWR<ChapterListResponse>(
    "/api/chapters/random",
    { revalidateOnFocus: false },
  );

  const chaptersListData = data?.chapters || [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={"px-4 pt-8"}>
      <div className={"text-xl"}>Choose a story to continue...</div>

      {chaptersListData.map((chapter) => (
        <Link key={chapter.id} href={`chapters/${chapter.id}`}>
          <ChapterItem chapter={chapter} cardStyle={true} />
        </Link>
      ))}

      <div className={"h-16"}>
        <div className={"fixed bottom-10 w-screen"}>
          <Button className={"mx-auto"} onClick={() => mutate()}>
            Shuffle
          </Button>
        </div>
      </div>
    </div>
  );
}
