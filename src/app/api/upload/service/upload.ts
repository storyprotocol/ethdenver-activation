import { sepolia } from "viem/chains";
import { Hex, http, keccak256, toHex, isAddress } from "viem";
import {
  queryIPAsset,
  updateAsset,
  queryRelationship,
  updateRelationship,
} from "../../model";
import { SDKTool } from "./SDKTool";

if (!process.env.PRIVATE_KEY || !process.env.RPC_URL)
  throw new Error("No PRIVATE_KEY or RPC_URL found in environment variables");

if (!process.env.IP_ORG_ID)
  throw new Error("No IP_ORG_ID found in environment variables");
const ipOrg = process.env.IP_ORG_ID;

if (!process.env.NEXT_PUBLIC_IP_ASSET_REGISTRY_CONTRACT)
  throw new Error(
    "No NEXT_PUBLIC_IP_ASSET_REGISTRY_CONTRACT found in environment variables",
  );
const registryAddress = process.env.NEXT_PUBLIC_IP_ASSET_REGISTRY_CONTRACT;

const sdkTool = new SDKTool(
  process.env.PRIVATE_KEY as Hex,
  sepolia,
  http(process.env.RPC_URL),
);

export async function uploadChapter(num: number): Promise<number> {
  const chapters = await queryIPAsset(num, 1);
  if (chapters.length === 0) return 0;

  console.log(`Uploading Chapters : ${chapters.length}`);

  for (const chapter of chapters) {
    const metadata_raw = {
      name: chapter.name,
      description: chapter.description,
      author: chapter.belong_to || "Anonymous",
    };
    const metadata = JSON.stringify(metadata_raw);
    const metadata_url = await sdkTool.uploadMetadata(metadata);
    console.log(`Metadata URL: ${metadata_url}`);
    const contentHash = keccak256(toHex(metadata));
    console.log(`Content Hash: ${contentHash}`);
    const response = await sdkTool.createIPAsset({
      name: chapter.name,
      ipAssetType: chapter.asset_type,
      orgAddress: ipOrg,
      // owner: isAddress(chapter.belong_to || "") ? chapter.belong_to : undefined, // the owner must be the sender
      hash: contentHash,
      mediaUrl: metadata_url,
    });
    console.log(`IP Asset ${chapter.id} Response: ${JSON.stringify(response)}`);
    await updateAsset({
      ...chapter,
      status: 1,
      tx_hash: response.txHash,
      asset_seq_id: response.ipAssetId,
      metadata_url: metadata_url,
    });
  }

  return chapters.length;
}

export async function uploadRelationship(
  num: number,
  relationshipType: string = "PREVIOUS",
): Promise<number> {
  const relationships = await queryRelationship(num, relationshipType);
  if (relationships.length === 0) return 0;

  const finalRelationships = relationships.filter(
    (relationship) => relationship.src_asset && relationship.dst_asset,
  );
  if (finalRelationships.length === 0) return 0;

  console.log(
    `Found relationships ${relationships.length}, valid relationships: ${finalRelationships.length}`,
  );

  for (const relationship of finalRelationships) {
    const response = await sdkTool.createRelationship({
      orgAddress: ipOrg,
      relType: relationship.relationship_type,
      srcAddress: registryAddress,
      srcId: relationship.src_asset ? relationship.src_asset.toString() : "",
      dstAddress: registryAddress,
      dstId: relationship.dst_asset ? relationship.dst_asset.toString() : "",
    });
    console.log(
      `Relationship ${relationship.id} Response: ${JSON.stringify(response)}`,
    );
    await updateRelationship({
      ...relationship,
      status: 1,
      tx_hash: response.txHash,
      relationship_seq_id: response.relationshipId,
    });
  }
  return finalRelationships.length;
}
