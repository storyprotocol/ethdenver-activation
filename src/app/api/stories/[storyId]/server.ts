import { sql } from "@vercel/postgres";
import { StoryDetailResponse } from "@/interface/storyDetailResponse";
import { Chapter } from "@/interface/chapter";

export async function queryStoryDetail(
  storyId: string,
): Promise<StoryDetailResponse> {
  const { rows } = await sql`SELECT * FROM newtable;`;
  return {
    id: storyId,
    chapters: rows.map((row) => ({
      id: row.id,
      description: row.title,
    })) as Chapter[],
  };
}
