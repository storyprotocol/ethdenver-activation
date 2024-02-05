import { NextRequest } from "next/server";
import { ErrorCode, HTTP400Error, HTTP500Error } from "../../errorUtils";
import { EnvKey, GetEnv } from "../../utils";
import { queryChaptersByRandom } from "./server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<Response> {
  const searchParams = request.nextUrl.searchParams;

  let count = verify(searchParams.get("count"));
  if (count instanceof Response) {
    return count as Response;
  }

  const response = await queryChaptersByRandom(Number(count));

  return Response.json(response);
}

function verify(value: string | null): number | Response {
  let defulMinNum = GetEnv(EnvKey.ChapterRandomMinCount) || 3;

  let count = value || defulMinNum;
  if (isNaN(Number(count))) {
    return HTTP400Error(
      ErrorCode.ChapterRandomQueryVarError,
      "count should be a number",
    );
  }

  let defaultMaxMum = GetEnv(EnvKey.ChapterRandomMaxCount);
  if (
    isNaN(Number(defaultMaxMum)) ||
    Number(defaultMaxMum) == 0 ||
    Number(count) > Number(defaultMaxMum)
  ) {
    return HTTP500Error(ErrorCode.ChapterRandomMaxNotConfigError);
  }

  return Number(count);
}
