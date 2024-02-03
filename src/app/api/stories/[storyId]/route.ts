import { queryStoryDetail } from "@/app/api/stories/[storyId]/server";

export async function GET(
  request: Request,
  { params }: { params: { storyId: string } },
) {
  const res = await queryStoryDetail(params.storyId);

  return Response.json(res);
}
