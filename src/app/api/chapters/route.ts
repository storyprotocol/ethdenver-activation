import { ChapterRelationshipResponse } from "@/interface/chapterRelationShipResponse";
import { CreateChapterRequest } from "@/interface/createChapterRequest";
import { CreateChapterResponse } from "@/interface/createChapterResponse";
import { CfgDefaultValue } from "../config";
import { CusTypeError, ErrorCode, errorHandler } from "../errorUtils";
import {
  ChapterMO,
  IpAssetVO,
  RelationshipVO,
  createChapter,
  createIpAsset,
  createRelationships,
  queryChapterByIdAndSid,
  queryStoryCredential,
} from "../model";
import { EnvKey, GetEnv, getUUID, getTimestamp } from "../utils";

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

  if (!requestData.content.trim() || requestData.content.trim().length > 280) {
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
    let newChapter = {
      story_id: Number(requestData.story_id),
      content: requestData.content,
      wallet_address: wallet_address,
      level: parentChapter.level + 1,
      path: parentChapter.path.concat([parentChapter.id]),
      is_anonymous: requestData.is_anonymous,
      parent_id: parentChapter.id,
      credential: getUUID(),
      created_at: getTimestamp(),
    } as ChapterMO;
    const id = await createChapter(newChapter);
    newChapter.id = id;

    // Insert some required data to ip asset relationship table
    await createIpAssetAndRelationship(newChapter, parentChapter);

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

async function createIpAssetAndRelationship(
  newChapter: ChapterMO,
  parentChapter: ChapterMO,
) {
  // Insert some required data to ip asset relationship table
  let newIPAsset = {
    credential: newChapter.credential,
    name: "s" + newChapter.story_id + "_c" + newChapter.id,
    type: 1,
    status: 0,
    description: newChapter.content,
    belong_to: newChapter.wallet_address,
    created_at: getTimestamp(),
  } as IpAssetVO;

  let newRelationships: RelationshipVO[] = [];
  const storyCredential = await queryStoryCredential(newChapter.story_id);
  newRelationships.push({
    relationship_type: RelationshipType.SrcChapter,
    src_asset_id: newChapter.credential,
    dst_asset_id: storyCredential,
    status: 0,
    created_at: getTimestamp(),
  } as RelationshipVO);
  if (newChapter.level > 1 && parentChapter.credential) {
    newRelationships.push({
      relationship_type: RelationshipType.DstChapter,
      src_asset_id: newChapter.credential,
      dst_asset_id: parentChapter.credential,
      status: 0,
      created_at: getTimestamp(),
    } as RelationshipVO);
  }

  await createIpAsset(newIPAsset);
  await createRelationships(newRelationships);
}

const RelationshipType = {
  SrcChapter: "APPEARS_IN",
  DstChapter: "PREVIOUS_CHAPTER",
};
