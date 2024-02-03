"use client";

import Link from "next/link";
import { StoriesResponse } from "@/interface/storiesResponse";
import useSWR from "swr";

export default function Page() {
  const { data, error, isLoading } = useSWR<StoriesResponse>("/api/stories");

  const storyListData = data?.data || [];

  return (
    <main>
      <div>Here is the strory list</div>
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
