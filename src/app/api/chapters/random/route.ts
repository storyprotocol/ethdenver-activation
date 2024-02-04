import { NextRequest } from "next/server";
import { ChapterListResponse } from "@/interface/chapterListResponse";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<Response> {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("num") || 3;

  const response: ChapterListResponse = {
    chapters: [
      {
        id: 100,
        content: "This is a chapter AAA",
        story_id: 1,
        parent_id: 0,
        sibling_count: 0,
      },
      {
        id: 200,
        content: "This is a chapter BBB",
        story_id: 2,
        parent_id: 0,
        sibling_count: 0,
      },
      {
        id: 300,
        content: "This is a chapter CCC",
        story_id: 1,
        parent_id: 0,
        sibling_count: 0,
      },
    ],
  };

  return Response.json(response);
}
