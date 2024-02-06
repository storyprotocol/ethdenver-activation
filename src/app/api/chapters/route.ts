import { ChapterRelationshipResponse } from "@/interface/chapterRelationShipResponse";
import { CreateChapterRequest } from "@/interface/createChapterRequest";
import { CreateChapterResponse } from "@/interface/createChapterResponse";
import { CfgDefaultValue } from "../config";
import { CusTypeError, ErrorCode, errorHandler } from "../errorUtils";
import { ChapterMO, creaeteChapter, queryChapterByIdAndSid } from "../model";
import { EnvKey, GetEnv } from "../utils";

import { NextRequest } from "next/server";
import { getAddress, isAddress } from "viem";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<Response> {
  const requestData: CreateChapterRequest = await request.json();

  if (!requestData.story_id || isNaN(Number(requestData.story_id))) {
    return errorHandler(
      new CusTypeError(
        ErrorCode.StoryIDTypeError,
        "story_id should be a number",
      ),
    );
  }
  if (!requestData.parent_id || isNaN(Number(requestData.parent_id))) {
    return errorHandler(
      new CusTypeError(
        ErrorCode.ChapterIDTypeError,
        "parent chapter id should be a number",
      ),
    );
  }

  if (!requestData.content || requestData.content.trim().length > 280) {
    return errorHandler(
      new CusTypeError(
        ErrorCode.ChapterContentRequiredError,
        "content is required and should be less than 280 characters",
      ),
    );
  }

  let wallet_address =
    GetEnv(EnvKey.DefaultWalletAddress) || CfgDefaultValue.DefaultWalletAddress;
  if (!requestData.is_anonymous) {
    if (
      !requestData.wallet_address ||
      requestData.wallet_address.trim().length == 0 ||
      !isAddress(requestData.wallet_address.trim())
    ) {
      return errorHandler(
        new CusTypeError(
          ErrorCode.WalletAddressTypeError,
          "wallet_address should be a valid address",
        ),
      );
    }
    wallet_address = getAddress(requestData.wallet_address.trim());
  }

  try {
    const parentChapter = await queryChapterByIdAndSid(
      Number(requestData.story_id),
      Number(requestData.parent_id),
    );
    const id = await creaeteChapter({
      story_id: Number(requestData.story_id),
      content: requestData.content,
      wallet_address: wallet_address,
      level: parentChapter.level + 1,
      path: parentChapter.path.concat([parentChapter.id]),
      is_anonymous: requestData.is_anonymous,
      parent_id: parentChapter.id,
      credential: crypto.randomUUID(),
      created_at: new Date().getTime(),
    } as ChapterMO);

    const response: CreateChapterResponse = {
      id: id,
      story_id: requestData.story_id,
      parent_id: requestData.parent_id,
    };

    return Response.json(response);
  } catch (err) {
    return errorHandler(err as Error);
  }
}

export async function GET(request: NextRequest): Promise<Response> {
  const response: ChapterRelationshipResponse = {
    chapters: [],
  };

  return Response.json(response);
}
