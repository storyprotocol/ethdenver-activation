"use client";

import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import arrowLeftIcon from "@/assets/common/arrow_left.svg";
import Image from "next/image";
import useSWR from "swr";
import { ChapterListResponse } from "@/interface/chapterListResponse";
import ChapterItem from "@/components/pages/ChapterItem";

export default function Page({ params }: { params: { chapter_id: string } }) {
  const chapterId = params.chapter_id;
  const { data, error, isLoading } = useSWR<ChapterListResponse>(
    `/api/chapters/${chapterId}/up`,
  );

  const chapterListData = data?.chapters || [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={"px-4 pt-8"}>
      <Link className={"flex"} href={"/chapters"}>
        <Image src={arrowLeftIcon} alt={"back"} />
        <span>Back to Selection</span>
      </Link>

      {chapterListData.map((chapter) => (
        <ChapterItem
          cardStyle={true}
          showSiblingCount
          key={chapter.id}
          chapter={chapter}
        />
      ))}

      <div className={"my-4 text-base text-white/50"}>
        continue the story...
      </div>

      <Textarea className={"text-primary-foreground"} />
    </div>
  );
}
