"use client";

import Link from "next/link";
import { StoriesResponse } from "@/interface/storiesResponse";
import useSWR from "swr";
import { fetcher } from "@/app/utils/fetcher";

export default function Home() {
  const { data, error, isLoading } = useSWR<StoriesResponse>(
    "/api/stories",
    fetcher,
  );

  const storyListData = data?.data || [];

  return (
    <main>
      {storyListData.map((story) => (
        <Link key={story.id} href={`stories/${story.id}`}>
          <div>
            {story.id}
            To Detail
          </div>
        </Link>
      ))}
    </main>
  );
}
