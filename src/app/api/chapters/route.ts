import { NextRequest } from "next/server";
import { CreateChapterRequest } from "@/interface/createChapterRequest";
import { CreateChapterResponse } from "@/interface/createChapterResponse";
import { ChapterRelationshipResponse } from "@/interface/chapterRelationShipResponse";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<Response> {
  const requestData: CreateChapterRequest = await request.json();

  const response: CreateChapterResponse = {
    id: 1,
  };

  return Response.json(response);
}

export async function GET(request: NextRequest): Promise<Response> {
  const response: ChapterRelationshipResponse = {
    chapters: [],
  };

  return Response.json(response);
}
