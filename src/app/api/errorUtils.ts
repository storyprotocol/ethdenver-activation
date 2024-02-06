import { NextResponse } from "next/server";

function HTTP400Error(code: string, msg: string): Response {
  return NextResponse.json(
    {
      code,
      message: msg || "bad request",
    },
    { status: 400 },
  );
}

function HTTP500Error(code: string): Response {
  return NextResponse.json(
    {
      code,
      message: "internal error",
    },
    { status: 500 },
  );
}

const ErrorCode = {
  ChapterRandomQueryVarError: "C01E400-0001",
  ChapterRelationshipLimitError: "C01E400-0002",
  ChapterRandomMaxNotConfigError: "C01E500-0001",
  DatabaseError: "C01E500-0002",
};

export { ErrorCode, HTTP400Error, HTTP500Error };
