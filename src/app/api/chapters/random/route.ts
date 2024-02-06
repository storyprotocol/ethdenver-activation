import { Chapter } from "@/interface/chapter";
import { NextRequest } from "next/server";
import {
  CusEnvVarsConfigError,
  CusRangeError,
  CusTypeError,
  ErrorCode,
  errorHandler,
} from "../../errorUtils";
import { ChapterMO, queryChaptersByRandom } from "../../model";
import { EnvKey, GetEnv } from "../../utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<Response> {
  const searchParams = request.nextUrl.searchParams;

  let count = 0;
  let chapters: ChapterMO[] = [];
  try {
    count = verify(searchParams.get("count"));
    chapters = await queryChaptersByRandom(count);
  } catch (err) {
    return errorHandler(err as Error);
  }

  return Response.json({
    chapters: chapters.map((chapter) => {
      return {
        id: chapter.id,
        story_id: chapter.story_id,
        content: chapter.content,
        parent_id: chapter.parent_id,
        path: chapter.path,
      } as Chapter;
    }),
  });
}

function verify(value: string | null): number {
  let count = value || GetEnv(EnvKey.ChapterRandomMinCount) || 3;
  if (isNaN(Number(count))) {
    throw new CusTypeError(
      ErrorCode.ChapterRandomQueryVarError,
      "count should be a number",
    );
  }
  
  let defaultMaxMum = GetEnv(EnvKey.ChapterRandomMaxCount) || 10;
  if (isNaN(Number(defaultMaxMum))) {
    throw new CusEnvVarsConfigError(
      ErrorCode.ChapterRandomQueryVarError,
      "max count should be a number",
    );
  } else if (
    Number(defaultMaxMum) == 0 ||
    Number(defaultMaxMum) < Number(count)
  ) {
    throw new CusRangeError(
      ErrorCode.ChapterRandomQueryVarError,
      "max count should be greater than range",
    );
  }

  return Number(count);
}
