import { NextResponse } from "next/server";

// create MaxCountError that extend Error
class BasicError extends Error {
  code: string;
  status: number;
  constructor(code: string, status: number, message: string) {
    super(message);
    this.name = "MissingConfigMaxValueError";
    this.code = code;
    this.status = status;
  }
}

class CusTypeError extends BasicError {
  constructor(code: string, message: string) {
    super(code, 400, message);
  }
}
class CusEnvVarsConfigError extends BasicError {
  constructor(code: string, message: string) {
    super(code, 500, message);
  }
}

class CusEntityNotFoundError extends BasicError {
  constructor(code: string, message: string) {
    super(code, 400, message || "Entity not found");
  }
}

class CusEntityNotUniqueError extends BasicError {
  constructor(code: string, message: string) {
    super(code, 400, message || "Entity not unique");
  }
}

class CusRangeError extends BasicError {
  constructor(code: string, message: string) {
    super(code, 400, message);
  }
}

function http400Error(code: string, msg?: string): Response {
  return NextResponse.json(
    {
      code: code,
      message: msg || "error request",
    },
    { status: 400 },
  );
}

function http500Error(code: string): Response {
  return NextResponse.json(
    {
      code: code,
      message: "internal error",
    },
    { status: 500 },
  );
}

const ErrorCode = {
  SystemError: "ORIGINAL_ERROR",
  ChapterRandomQueryVarError: "Query_Var_Random",
  ChapterRandomMaxNotConfigError: "Query_Var_Random_Not_Config",

  ChapterUpDepthTypeError: "Query_Var_Depth_Type_Error",
  ChapterUpDepthMaxError: "Query_Var_Depth_Max_Error",
  ChapterUpDepthRangeError: "Query_Var_Depth_Range_Error",
  ChapterIDTypeError: "Query_Var_ID_Type_Error",
  ChapterNotExistError: "Chapter_Not_Exist",
  ChapterIdUniqueError: "Chapter_ID_Unique_Error",
};

function errorHandler(err: Error): Response {
  if (err instanceof BasicError) {
    const cusErr = err as BasicError;
    switch (cusErr.status) {
      case 400:
        return http400Error(cusErr.code, cusErr.message);
      case 500:
        return http500Error(cusErr.code);
      default:
        return http400Error(cusErr.code);
    }
  } else {
    return http400Error(ErrorCode.SystemError, err.message);
  }
}
export {
  BasicError,
  CusEntityNotFoundError,
  CusEntityNotUniqueError,
  CusEnvVarsConfigError,
  CusRangeError,
  CusTypeError,
  ErrorCode,
  errorHandler,
  http400Error,
  http500Error,
};
