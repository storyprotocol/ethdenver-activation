import {
  CusDBError,
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

export async function queryChapterByIdAndSid(
  storyId: number,
  Id: number,
): Promise<ChapterMO> {
  const client = await db.connect();
  const { rows } =
    await client.sql`SELECT * FROM chapter WHERE story_id = ${storyId} and id = ${Id}`;
  if (rows.length === 0) {
    throw new CusEntityNotFoundError(
      ErrorCode.ChapterNotExistError,
      `Parent Chapter ${Id} not found`,
    );
  }

  if (rows.length > 1) {
    throw new CusEntityNotUniqueError(
      ErrorCode.ChapterIdUniqueError,
      `Parent Chapter ${Id} has more than one record`,
    );
  }
  return toChapterMO(rows[0]);
}

export async function creaeteChapter(chapter: ChapterMO): Promise<number> {
  try {
    const client = await db.connect();
    const { rows } =
      await client.sql`INSERT INTO chapter (story_id, content, wallet_address, level, path, is_anonymous, parent_id, credential, created_at) VALUES (${chapter.story_id}, ${chapter.content}, ${chapter.wallet_address}, ${chapter.level}, ${JSON.stringify(chapter.path)}, ${chapter.is_anonymous}, ${chapter.parent_id}, ${chapter.credential}, ${chapter.created_at}) RETURNING id`;
    return rows[0].id;
  } catch (err) {
    // return a 500 custom error
    console.error(err);
    throw new CusDBError(
      ErrorCode.ChapterCreateError,
      `Failed to create chapter: ${err}`,
    );
  }
}

function toChapterMO(row: QueryResultRow): ChapterMO {
  return {
    id: parseInt(row.id),
    story_id: parseInt(row.story_id),
    content: row.content,
    wallet_address: row.wallet_address,
    level: parseInt(row.level),
    path: row.path,
    is_anonymous: row.is_anonymous,
    parent_id: parseInt(row.parent_id),
    credential: row.credential,
    created_at: parseInt(row.created_at),
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
