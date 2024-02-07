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

class CusDBError extends BasicError {
  constructor(code: string, message: string) {
    super(code, 500, message);
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

function http500Error(code: string, msg?: string): Response {
  return NextResponse.json(
    {
      code,
      message: "internal error->" + (msg ? `: ${msg}` : "[N/A]"),
    },
    { status: 500 },
  );
}

const ErrorCode = {
  ChapterRelationshipLimitError: "Query_Var_Relationship_limit_Error",
  DatabaseError: "Database_Error",

  SystemError: "Original_Error",
  ChapterRandomQueryVarError: "Query_Var_Random_Error",
  ChapterRandomMaxNotConfigError: "Query_Var_Random_Not_Config_Error",

  ChapterUpDepthTypeError: "Query_Var_Depth_Type_Error",
  ChapterUpDepthMaxError: "Query_Var_Depth_Max_Error",
  ChapterUpDepthRangeError: "Query_Var_Depth_Range_Error",
  ChapterIDTypeError: "Query_Var_ID_Type_Error",
  ChapterNotExistError: "Chapter_Not_Exist",
  ChapterIdUniqueError: "Chapter_ID_Unique_Error",
  ChapterCreateError: "Chapter_Create_Error",
  UpdateRelationshipError: "Update_Relationship_Error",
  UpdateAssetError: "Update_Asset_Error",
  UpdateStatisticError: "Update_Statistic_Error",

  StoryIDTypeError: "Story_ID_Type_Error",
  ChapterContentRequiredError: "Chapter_Content_Required_Error",
  WalletAddressTypeError: "Wallet_Address_Type_Error",

  StoryNotExistError: "Story_Not_Exist",
  StoryIdUniqueError: "Story_ID_Unique_Error",

  IPAssetCreateError: "IP_Asset_Create_Error",
  RelationshipCreateError: "Relationship_Create_Error",
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
  CusDBError,
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
