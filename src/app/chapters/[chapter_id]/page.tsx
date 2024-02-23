"use client";

import Link from "next/link";
import arrowLeftIcon from "@/assets/common/arrow_left.svg";
import Image from "next/image";
import useSWR from "swr";
import { ChapterListResponse } from "@/interface/chapterListResponse";
import ChapterList from "./ChapterList";
import NewChapterTextarea from "./NewChapterTextarea";
import SubmitSheet from "./SubmitSheet";
import { useState, useEffect } from "react";
import { ErrorResponse } from "@/lib/fetcher";
import NetworkErrorAlert from "@/components/pages/NetworkErrorAlert";

export default function Page({ params }: { params: { chapter_id: string } }) {
  const chapterId = params.chapter_id;
  const [open, setOpen] = useState(false);
  const [preparedContent, setPreparedContent] = useState("");

  const { data, isLoading, isValidating, error, mutate } = useSWR<
    ChapterListResponse,
    ErrorResponse
  >(`/api/chapters/${chapterId}/up`);

  const chapterListData = data?.chapters || [];
  chapterListData.sort((a, b) => a.id - b.id);
  const storyId = chapterListData[0]?.story_id?.toString() || "";

  const onSubmit = (newContent: string) => {
    setPreparedContent(newContent);
    setOpen(true);
  };

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  return (
    <main className={"w-full max-w-screen-sm flex-1"}>
      <div className={"px-4 pt-8"}>
        <Link
          className={"flex space-x-1 text-xl font-medium"}
          href={"/chapters"}
        >
          <Image src={arrowLeftIcon} alt={"back"} />
          <span>Back to Selection</span>
        </Link>

        <NetworkErrorAlert
          error={error}
          onRetry={mutate}
          isValidating={isValidating}
        />

        <ChapterList isLoading={isLoading} chapterListData={chapterListData} />

        <NewChapterTextarea isLoading={isLoading} onSubmit={onSubmit} />

        <SubmitSheet
          open={open}
          onOpenChange={setOpen}
          storyId={storyId}
          chapterId={chapterId}
          content={preparedContent}
        />
      </div>
    </main>
  );
}
