"use client";

import NetworkErrorAlert from "@/components/pages/NetworkErrorAlert";
import { ChapterListResponse } from "@/interface/chapterListResponse";
import { ErrorResponse } from "@/lib/fetcher";
import useSWR from "swr";
import ChapterList from "../chapters/[chapter_id]/ChapterList";

export default function GraphChapters({
  chapterId,
  className,
}: {
  chapterId?: string;
  className?: string;
}) {
  const { data, isLoading, isValidating, error, mutate } = useSWR<
    ChapterListResponse,
    ErrorResponse
  >(`/api/chapters/${chapterId}/up?depth=1000`);

  const chapterListData = data?.chapters || [];
  chapterListData.sort((a, b) => a.id - b.id);

  return (
    <div className={className}>
      {chapterId ? (
        <>
          <NetworkErrorAlert
            error={error}
            onRetry={mutate}
            isValidating={isValidating}
          />
          {!isValidating ? (
            <div className="text-xl font-medium">The story so far... </div>
          ) : (
            <> </>
          )}
          <ChapterList
            isLoading={isLoading}
            chapterListData={chapterListData}
            isHighLight={true}
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
