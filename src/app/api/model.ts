import {
  CusEntityNotFoundError,
  CusEntityNotUniqueError,
  ErrorCode,
} from "@/app/api/errorUtils";
import { QueryResultRow } from "@neondatabase/serverless";
import { db } from "@vercel/postgres";

export const dynamic = "force-dynamic";

export async function queryChaptersByRandom(num: number): Promise<ChapterMO[]> {
  const client = await db.connect();
  const { rows } =
    await client.sql`SELECT * FROM chapter ORDER BY RANDOM() LIMIT ${num}`;

  return rows.map((row) => toChapterMO(row));
}

export async function queryChapterById(chapterId: number): Promise<ChapterMO> {
  const client = await db.connect();
  const { rows } =
    await client.sql`SELECT * FROM chapter WHERE id = ${chapterId}`;
  if (rows.length === 0) {
    throw new CusEntityNotFoundError(
      ErrorCode.ChapterNotExistError,
      `Chapter ${chapterId} not found`,
    );
  }

  if (rows.length > 1) {
    throw new CusEntityNotUniqueError(
      ErrorCode.ChapterIdUniqueError,
      `Chapter ${chapterId} has more than one record`,
    );
  }
  return toChapterMO(rows[0]);
}

export async function queryChapterByIds(
  parentIds: number[],
): Promise<ChapterMO[]> {
  const client = await db.connect();
  const { rows } =
    await client.sql`SELECT * FROM chapter WHERE id in (${parentIds.join(",")})`;
  return rows.map((row) => toChapterMO(row));
}

export async function queryChapterSilding(
  storyId: number,
  level: number,
): Promise<ChapterMO[]> {
  const client = await db.connect();
  const { rows } =
    await client.sql`SELECT * FROM chapter WHERE story_id = ${storyId} and level = ${level}`;
  return rows.map((row) => toChapterMO(row));
}

function toChapterMO(row: QueryResultRow): ChapterMO {
  return {
    id: row.id,
    story_id: row.story_id,
    content: row.content,
    wallet_address: row.wallet_address,
    level: row.level,
    path: row.path,
    is_anonymous: row.is_anonymous,
    parent_id: row.parent_id,
    credential: row.credential,
    created_at: row.created_at,
  } as ChapterMO;
}
export interface ChapterMO {
  id: number;
  story_id: number;
  content: string;
  wallet_address: string;
  level: number;
  path: number[];
  is_anonymous: boolean;
  parent_id: number;
  credential: string;
  created_at: number;
}
