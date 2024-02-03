import { queryStories } from "@/app/api/stories/server";
import { StoriesResponse } from "@/interface/storiesResponse";

export async function GET(): Promise<Response> {
  const response: StoriesResponse = await queryStories();

  return Response.json(response);
}
