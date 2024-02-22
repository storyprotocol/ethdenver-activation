import { sql } from "@vercel/postgres";
import { Chapter } from "@/interface/chapter";
import { ChapterListResponse } from "@/interface/chapterListResponse";
import { QueryChaptersLaterThanProps } from "@/interface/chapterRelationShipRequest";
import { EnvKey, GetEnv } from "../../utils";

export const dynamic = "force-dynamic";

export async function queryChaptersAfterID({
  from_chapter_id,
  limit,
}: QueryChaptersLaterThanProps): Promise<ChapterListResponse> {
  const defaultLimit = GetEnv(EnvKey.ChapterRelationshipMaxLimit) || 10000;
  const { rows } = await sql`
    SELECT
      id,
      story_id,
      parent_id,
      wallet_address 
    FROM 
      chapter 
    WHERE
      id > ${from_chapter_id || 0}
    ORDER BY
      id
    LIMIT ${limit || defaultLimit}`;

  return {
    chapters: rows as Chapter[],
  };
}
