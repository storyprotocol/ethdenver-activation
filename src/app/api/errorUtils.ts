import { NextResponse } from "next/server";

function HTTP400Error(code: string, msg: string): Response {
  return NextResponse.json(
    {
      code: code,
      message: msg || "bad request",
    },
    { status: 400 },
  );
}

function HTTP500Error(code: string): Response {
  return NextResponse.json(
    {
      code: code,
      message: "internal error",
    },
    { status: 500 },
  );
}

let ErrorCode = {
  ChapterRandomQueryVarError: "C01E400-0001",
  ChapterRandomMaxNotConfigError: "C01E500-0001",
};

export { ErrorCode, HTTP400Error, HTTP500Error };
