"use client";

import Link from "next/link";
import { StoriesResponse } from "@/interface/storiesResponse";
import useSWR from "swr";
import { Button } from "@/components/ui/button";

export default function StoryList() {
  const { data, error, isLoading } = useSWR<StoriesResponse>("/api/stories");

  const storyListData = data?.data || [];

  return (
    <main>
      <div>Here is the strory list</div>
      {storyListData.map((story) => (
        <Button key={story.id} asChild>
          <Link href={`stories/${story.id}`}>
            {story.id} {story.title}
          </Link>
        </Button>
      ))}
    </main>
  );
}
