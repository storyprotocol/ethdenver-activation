"use client";

import useSWR from "swr";
import { ChapterListResponse } from "@/interface/chapterListResponse";
import Link from "next/link";
import ChapterItem from "@/components/pages/ChapterItem";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import shuffleIcon from "@/assets/chapter/shuffle_icon.svg";
import ChapterSkeleton from "@/components/pages/ChapterSkeleton";
import Spinner from "@/components/pages/Spinner";
import React from "react";

export default function Page() {
  const { data, isLoading, isValidating, mutate } = useSWR<ChapterListResponse>(
    "/api/chapters/random",
    { revalidateOnFocus: false },
  );

  const chaptersListData = data?.chapters || [];

  return (
    <main className={"flex-1"}>
      <div className={"px-4 pt-8"}>
        <div className={"text-xl"}>Choose a story to continue...</div>

        {isLoading ? (
          <ChapterSkeleton />
        ) : (
          chaptersListData.map((chapter) => (
            <Link key={chapter.id} href={`chapters/${chapter.id}`}>
              <ChapterItem chapter={chapter} cardStyle={true} />
            </Link>
          ))
        )}

        {!isLoading && isValidating && <Spinner />}

        <div className={"fixed bottom-16 left-0 w-screen text-center"}>
          <Button className={"mx-auto"} onClick={() => mutate()}>
            Shuffle
            <Image className={"ml-1"} src={shuffleIcon} alt={"Shuffle"} />
          </Button>
        </div>
      </div>
    </main>
  );
}
