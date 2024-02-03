import { sql } from "@vercel/postgres";
import { StoriesResponse } from "@/interface/storiesResponse";
import { Story } from "@/interface/story";

export async function queryStories(): Promise<StoriesResponse> {
  const { rows } = await sql`SELECT * FROM newtable;`;
  return {
    data: rows.map((row) => ({
      id: row.id,
      title: row.title,
    })) as Story[],
  };
}
