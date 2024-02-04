import { NextRequest } from "next/server";
import { ChapterListResponse } from "@/interface/chapterListResponse";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { chapter_id: string } },
): Promise<Response> {
  const searchParams = request.nextUrl.searchParams;
  const depth = searchParams.get("depth") || 3;
  const chapterId = Number(params.chapter_id) || 0;

  const response: ChapterListResponse = {
    chapters: [
      {
        id: chapterId - 2,
        content: "This is a chapter grandfather",
        story_id: 1,
        parent_id: chapterId - 3,
        sibling_count: 0,
      },
      {
        id: chapterId - 1,
        content: "This is a chapter parent",
        story_id: 1,
        parent_id: chapterId - 2,
        sibling_count: 0,
      },
      {
        id: chapterId,
        content: `This is selected ${chapterId}`,
        story_id: 1,
        parent_id: chapterId - 1,
        sibling_count: 0,
      },
    ],
  };

  return Response.json(response);
}
