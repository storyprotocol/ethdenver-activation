import { Chapter, toChapter } from "@/interface/chapter";
import { NextRequest } from "next/server";
import { CfgDefaultValue } from "../../config";
import {
  CusEnvVarsConfigError,
  CusRangeError,
  CusTypeError,
  ErrorCode,
  errorHandler,
} from "../../errorUtils";
import {
  ChapterMO,
  queryChaptersByRandom,
  queryLatestChaptersByRandom,
} from "../../model";
import { EnvKey, GetEnv } from "../../utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<Response> {
  const searchParams = request.nextUrl.searchParams;

  let count = 0;
  let latestChapterId = 0;
  let randomChapters: ChapterMO[] = [];
  let result: Chapter[] = [];
  try {
    count = verify(searchParams.get("count"));

    const latest = await queryLatestChaptersByRandom(1);
    if (latest.length > 0) {
      count = count - 1;
      latestChapterId = latest[0].id;
      result.push(toChapter(latest[0]));
    }
    if (count <= 0) {
      return Response.json({
        chapters: result,
      });
    }

    randomChapters = await queryChaptersByRandom(2, latestChapterId);
    if (randomChapters.length == 0) {
      return Response.json({
        chapters: result,
      });
    }

    const temp = randomChapters.map((chapter) => {
      return toChapter(chapter);
    });

    result = result.concat(temp);
  } catch (err) {
    return errorHandler(err as Error);
  }

  return Response.json({
    chapters: result,
  });
}

function verify(value: string | null): number {
  let count =
    value ||
    GetEnv(EnvKey.ChapterRandomMinCount) ||
    CfgDefaultValue.ChapterRandomMinCount;
  if (isNaN(Number(count))) {
    throw new CusTypeError(
      ErrorCode.ChapterRandomQueryVarError,
      "count should be a number",
    );
  }

  let defaultMaxMum =
    GetEnv(EnvKey.ChapterRandomMaxCount) ||
    CfgDefaultValue.ChapterRandomMaxCount;
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
