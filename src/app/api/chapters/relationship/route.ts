import { NextRequest } from "next/server";
import { QueryChaptersLaterThanProps } from "@/interface/chapterRelationShipRequest";
import { ErrorCode, errorHandler, http400Error } from "../../errorUtils";
import { EnvKey, GetEnv } from "../../utils";
import { queryChaptersAfterID } from "./server";

export const dynamic = "force-dynamic";
const FROM_CHAPTER_ID = "from_chapter_id";
const LIMIT = "limit";

export const GET = async (request: NextRequest): Promise<Response> => {
  let response = {};
  try {
    const searchParams = request.nextUrl.searchParams;

    const paramID = searchParams.get(FROM_CHAPTER_ID);
    const paramLimit = searchParams.get(LIMIT);
    validateFromChapterId(paramID);
    validateLimit(paramLimit);
    const limit = Number(paramLimit);
    const fromChapterId = Number(paramID);
    response = await queryChaptersAfterID({
      from_chapter_id: fromChapterId,
      limit,
    } as QueryChaptersLaterThanProps);
  } catch (err) {
    console.error(err);
    return errorHandler(err as Error);
  }
  return Response.json(response);
};
const isEmpty = (value: any): boolean => value === undefined || value === null;
const validateLimit = (value: string | number | undefined | null): void => {
  if (isEmpty(value)) {
    return;
  }
  const defaultLimit =
    Number(GetEnv(EnvKey.ChapterRelationshipMaxLimit)) || 10000;
  const limit = Number(value) || defaultLimit;
  if (isNaN(limit)) {
    throw http400Error(
      ErrorCode.ChapterRandomQueryVarError,
      "limit should be a number",
    );
  }

  if (limit < 1) {
    throw http400Error(
      ErrorCode.ChapterRandomQueryVarError,
      "limit should be greater than 1",
    );
  }

  if (limit > defaultLimit) {
    throw http400Error(
      ErrorCode.ChapterRandomQueryVarError,
      `limit should be within than ${defaultLimit}`,
    );
  }
};

const validateFromChapterId = (
  value: string | number | undefined | null,
): void => {
  if (isEmpty(value)) {
    return;
  }
  const id = Number(value);
  const defaultID = 0;
  if (isNaN(id)) {
    throw http400Error(
      ErrorCode.ChapterRandomQueryVarError,
      `${FROM_CHAPTER_ID} should be a number`,
    );
  }

  if (id < defaultID) {
    throw http400Error(
      ErrorCode.ChapterRandomQueryVarError,
      `invalid ${FROM_CHAPTER_ID}`,
    );
  }
};
