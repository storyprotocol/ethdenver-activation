import { sql } from "@vercel/postgres";

import { Chapter } from "@/interface/chapter";
import { ChapterListResponse } from "@/interface/chapterListResponse";

export const dynamic = "force-dynamic";

export async function queryChaptersByRandom(
  num: number,
): Promise<ChapterListResponse> {
  const { rows } =
    await sql`SELECT * FROM chapter ORDER BY RANDOM() LIMIT ${num}`;

  return {
    chapters: rows.map((row) => ({
      id: row.id,
      content: row.content,
      story_id: row.story_id,
    })) as Chapter[],
  };
}
