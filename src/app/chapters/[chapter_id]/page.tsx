"use client";

import Link from "next/link";
import arrowLeftIcon from "@/assets/common/arrow_left.svg";
import Image from "next/image";
import useSWR from "swr";
import { ChapterListResponse } from "@/interface/chapterListResponse";
import ChapterList from "@/app/chapters/[chapter_id]/ChapterList";
import NewChapterTextarea from "@/app/chapters/[chapter_id]/NewChapterTextarea";
import { useRouter } from "next/navigation";
import SubmitSheet from "@/app/chapters/[chapter_id]/SubmitSheet";
import { useState } from "react";

export default function Page({ params }: { params: { chapter_id: string } }) {
  const chapterId = params.chapter_id;
  const [open, setOpen] = useState(false);
  const [preparedContent, setPreparedContent] = useState("");

  const { data, isLoading, isValidating } = useSWR<ChapterListResponse>(
    `/api/chapters/${chapterId}/up`,
  );

  const chapterListData = data?.chapters || [];

  const onSubmit = (newContent: string) => {
    setPreparedContent(newContent);
    setOpen(true);
  };

  return (
    <main className={"flex-1"}>
      <div className={"px-4 pt-8"}>
        <Link
          className={"flex space-x-1 text-xl font-medium"}
          href={"/chapters"}
        >
          <Image src={arrowLeftIcon} alt={"back"} />
          <span>Back to Selection</span>
        </Link>

        <ChapterList isLoading={isLoading} chapterListData={chapterListData} />

        <NewChapterTextarea isLoading={isLoading} onSubmit={onSubmit} />

        <SubmitSheet
          open={open}
          onOpenChange={setOpen}
          chapterId={chapterId}
          content={preparedContent}
        />
      </div>
    </main>
  );
}
