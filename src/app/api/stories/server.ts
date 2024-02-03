import { sql } from "@vercel/postgres";
import { StoriesResponse } from "@/interface/storiesResponse";
import { Story } from "@/interface/story";

export async function queryStories(): Promise<StoriesResponse> {
  const rows = [
    { id: "id1", title: "some AAA" },
    { id: "id2", title: "some BBB" },
    { id: "id3", title: "some CCC" },
  ];
  return {
    data: rows.map((row) => ({
      id: row.id,
      title: row.title,
    })) as Story[],
  };
}
