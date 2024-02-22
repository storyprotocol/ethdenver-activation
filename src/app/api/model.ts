import {
  CusDBError,
  CusEntityNotFoundError,
  CusEntityNotUniqueError,
  ErrorCode,
} from "@/app/api/errorUtils";
import { QueryResultRow } from "@neondatabase/serverless";
import { sql } from "@vercel/postgres";
import { db } from "@vercel/postgres";

// export const dynamic = "force-dynamic";

export async function queryChaptersByRandom(num: number): Promise<ChapterMO[]> {
  const { rows } =
    await sql`SELECT * FROM chapter ORDER BY RANDOM() LIMIT ${num}`;

  return rows.map((row) => toChapterMO(row));
}

export async function queryChapterById(chapterId: number): Promise<ChapterMO> {
  const { rows } = await sql`SELECT * FROM chapter WHERE id = ${chapterId}`;
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
  const text =
    "SELECT * FROM chapter WHERE id = ANY($1::int[]) order by id asc";
  const values = [parentIds];
  const res = await sql.query(text, values);
  return res.rows.map((row) => toChapterMO(row));
}

export async function queryChapterSiblingNodes(
  storyId: number,
  level: number,
): Promise<ChapterMO[]> {
  const { rows } =
    await sql`SELECT * FROM chapter WHERE story_id = ${storyId} and level = ${level}`;
  return rows.map((row) => toChapterMO(row));
}

export async function queryChapterChildNodes(
  chapterId: number,
): Promise<ChapterMO[]> {
  const { rows } =
    await sql`SELECT * FROM chapter WHERE parent_id = ${chapterId} order by id asc`;
  return rows.map((row) => toChapterMO(row));
}

export async function queryChapterByIdAndSid(
  storyId: number,
  Id: number,
): Promise<ChapterMO> {
  const { rows } =
    await sql`SELECT * FROM chapter WHERE story_id = ${storyId} and id = ${Id}`;
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

export async function queryIPAsset(
  num: number,
  type: number,
): Promise<AssetMO[]> {
  const client = await db.connect();
  const { rows } =
    await client.sql`SELECT * FROM ip_asset WHERE status = 0 and type = ${type} order by id asc limit ${num}`;
  return rows.map((row) => toAssetMO(row));
}

export async function queryRelationship(
  num: number,
  relationshipType: string,
): Promise<RelationshipMO[]> {
  const client = await db.connect();
  const { rows } =
    await client.sql`select id, relationship_type, (select asset_seq_id from ip_asset where src_asset_id = credential) as src_asset, (select asset_seq_id from ip_asset where dst_asset_id = credential) as dst_asset from relationship where status = 0  and relationship_type = ${relationshipType} order by id asc limit ${num}`;
  return rows.map((row) => toRelationshipMO(row));
}

export async function queryUploadStatistics(): Promise<UploadStatisticMO> {
  const client = await db.connect();
  const { rows } = await client.sql`SELECT * FROM upload_data_statistics`;
  return toStatisticMO(rows[0]);
}

export async function createChapter(chapter: ChapterMO): Promise<number> {
  try {
    const text =
      "INSERT INTO chapter (story_id, content, wallet_address, level, path, is_anonymous, parent_id, credential, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id";
    const values = [
      chapter.story_id,
      chapter.content,
      chapter.wallet_address,
      chapter.level,
      chapter.path,
      chapter.is_anonymous,
      chapter.parent_id,
      chapter.credential,
      chapter.created_at,
    ];
    const res = await sql.query(text, values);
    return res.rows[0].id;
  } catch (err) {
    // return a 500 custom error
    console.error(err);
    throw new CusDBError(
      ErrorCode.ChapterCreateError,
      `Failed to create chapter: ${err}`,
    );
  }
}

export async function updateAsset(asset: AssetMO) {
  try {
    const client = await db.connect();
    await client.sql`UPDATE ip_asset SET status = ${asset.status}, tx_hash = ${asset.tx_hash}, asset_seq_id = ${asset.asset_seq_id}, metadata_url = ${asset.metadata_url} WHERE id = ${asset.id}`;
  } catch (err) {
    // return a 500 custom error
    console.error(err);
    throw new CusDBError(
      ErrorCode.UpdateAssetError,
      `Failed to update asset ${asset.id}: ${err}`,
    );
  }
}

export async function queryStoryCredential(storyId: number): Promise<string> {
  const { rows } =
    await sql`SELECT credential FROM story WHERE id = ${storyId}`;
  if (rows.length === 0) {
    throw new CusEntityNotFoundError(
      ErrorCode.StoryNotExistError,
      `Story ${storyId} not found`,
    );
  }

  if (rows.length > 1) {
    throw new CusEntityNotUniqueError(
      ErrorCode.StoryIdUniqueError,
      `Story ${storyId} has more than one record`,
    );
  }
  return rows[0].credential;
}

export async function createIpAsset(ipAsset: IpAssetVO): Promise<void> {
  try {
    const text =
      "INSERT INTO ip_asset (credential, name, type, description, belong_to, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)";
    const values = [
      ipAsset.credential,
      ipAsset.name,
      ipAsset.type,
      ipAsset.description,
      ipAsset.belong_to,
      ipAsset.status,
      ipAsset.created_at,
    ];
    await sql.query(text, values);
  } catch (err) {
    // return a 500 custom error
    console.error(err);
    throw new CusDBError(
      ErrorCode.IPAssetCreateError,
      `Failed to create ip_asset: ${err}`,
    );
  }
}

export async function updateRelationship(relationship: RelationshipMO) {
  try {
    const client = await db.connect();
    await client.sql`UPDATE relationship SET status = ${relationship.status}, tx_hash = ${relationship.tx_hash}, relationship_seq_id = ${relationship.relationship_seq_id} WHERE id = ${relationship.id}`;
  } catch (err) {
    // return a 500 custom error
    console.error(err);
    throw new CusDBError(
      ErrorCode.UpdateRelationshipError,
      `Failed to update relationship ${relationship.id}: ${err}`,
    );
  }
}

export async function updateUploadStatistics(statistics: UploadStatisticMO) {
  try {
    const client = await db.connect();
    await client.sql`UPDATE upload_data_statistics SET last_upload_time = ${statistics.lastUploadTime}, total_upload_story = ${statistics.storyUploaded}, total_upload_chapter = ${statistics.chapterUploaded}, total_upload_relationship = ${statistics.relationshipUploaded} WHERE id = ${statistics.id}`;
  } catch (err) {
    // return a 500 custom error
    console.error(err);
    throw new CusDBError(
      ErrorCode.UpdateStatisticError,
      `Failed to update upload statistics: ${err}`,
    );
  }
}
export async function createRelationships(
  relationships: RelationshipVO[],
): Promise<void> {
  if (relationships.length === 0) {
    return;
  }
  try {
    let text =
      "INSERT INTO relationship (relationship_type, src_asset_id, dst_asset_id, status, created_at) VALUES ($1, $2, $3, $4, $5)";
    let values = [
      relationships[0].relationship_type,
      relationships[0].src_asset_id,
      relationships[0].dst_asset_id,
      relationships[0].status,
      relationships[0].created_at,
    ];
    if ((relationships.length = 2)) {
      text = text + ",($6, $7, $8, $9, $10)";
      values = values.concat([
        relationships[1].relationship_type,
        relationships[1].src_asset_id,
        relationships[1].dst_asset_id,
        relationships[1].status,
        relationships[1].created_at,
      ]);
    }

    await sql.query(text, values);
  } catch (err) {
    // return a 500 custom error
    console.error(err);
    throw new CusDBError(
      ErrorCode.RelationshipCreateError,
      `Failed to create relationship: ${err}`,
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

function toAssetMO(row: QueryResultRow): AssetMO {
  return {
    id: row.id,
    credential: row.credential,
    name: row.name || row.credential,
    asset_type: row.type,
    description: row.description,
    belong_to: row.belong_to,
    metadata_url: row.metadata_url,
    asset_seq_id: row.asset_seq_id,
    tx_hash: row.tx_hash,
    status: row.status,
  } as AssetMO;
}

export interface AssetMO {
  id: number;
  credential: string;
  name: string;
  asset_type: number;
  description: string;
  belong_to?: string;
  metadata_url?: string;
  asset_seq_id?: string;
  tx_hash?: string;
  status: number;
}

function toRelationshipMO(row: QueryResultRow): RelationshipMO {
  return {
    id: row.id,
    relationship_type: row.relationship_type,
    src_asset: row.src_asset,
    dst_asset: row.dst_asset,
  } as RelationshipMO;
}

export interface RelationshipMO {
  id: number;
  relationship_type: string;
  src_asset?: number;
  dst_asset?: number;
  relationship_seq_id?: string;
  tx_hash?: string;
  status: number;
}

function toStatisticMO(row: QueryResultRow): UploadStatisticMO {
  return {
    id: row.id,
    lastUploadTime: row.last_upload_time || 0,
    storyUploaded: row.total_upload_story || 0,
    chapterUploaded: row.total_upload_chapter,
    relationshipUploaded: row.total_upload_relationship || 0,
  } as UploadStatisticMO;
}
export interface UploadStatisticMO {
  id: string;
  lastUploadTime: number;
  storyUploaded: number;
  chapterUploaded: number;
  relationshipUploaded: number;
}

export interface IpAssetVO {
  credential: string;
  name: string;
  type: number;
  description: string;
  belong_to: string;
  status: number;
  created_at: number;
}
export interface RelationshipVO {
  relationship_type: string;
  src_asset_id: string;
  dst_asset_id: string;
  status: number;
  created_at: number;
}
